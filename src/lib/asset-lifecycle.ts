import { z } from 'zod';
import { code, date, money, text, type CompanyState, type JournalLine } from './firestore-types';
import { round } from './company-calculations';

export const assetLifecycleSchema=z.discriminatedUnion('mode',[
 z.object({mode:z.literal('model'),itemCode:code,isAsset:z.boolean(),virtual:z.boolean(),series:code}),
 z.object({mode:z.literal('annual'),assetId:code,date,area:text.min(1),expectedAmount:money.positive()}),
 z.object({mode:z.literal('rollover'),year:z.number().int().min(2020).max(2099),newYear:z.number().int().min(2021).max(2100),date,transfer:z.literal(true),recalculate:z.literal(true)}),
 z.object({mode:z.literal('dispose'),assetId:code,date,reason:text.min(3),kind:z.literal('Desecho'),posting:z.literal('Neto')})
]);
export type AssetLifecycleCommand=z.infer<typeof assetLifecycleSchema>;
export interface AssetModel {itemCode:string;isAsset:boolean;virtual:boolean;series:string}
export interface AssetLifecycleRecord {id:string;mode:string;date?:string;assetId?:string;area?:string;amount?:number;journalEntryId?:string;year?:number;newYear?:number;transfer?:boolean;recalculate?:boolean;carried?:{assetCode:string;cost:number;accumulatedDepreciation:number;remaining:number}[];kind?:string;reason?:string;posting?:string;bookValue?:number}
export function capitalAssetCode(state:CompanyState,itemCode:string,fallback:()=>string):string{
 const model=state.profile?.assetModels?.find(m=>m.itemCode===itemCode&&m.isAsset);
 if(!model)return fallback();
 const list=(state.profile as unknown as {docSeries?:{docType:string;nombre:string;actual:number;inicio:number;fin:number;digitos?:number;prefijo?:string;sufijo?:string;bloqueada?:boolean}[]}).docSeries??[];
 const series=list.find(s=>s.docType==='activos'&&s.nombre===model.series&&!s.bloqueada);
 if(!series||!Number.isInteger(series.actual)||series.actual<series.inicio||series.actual>series.fin)throw new Error('La serie del modelo de activo no tiene números disponibles.');
 const code=`${series.prefijo??''}${String(series.actual).padStart(series.digitos??1,'0')}${series.sufijo??''}`;
 if(state.fixedAssets.some(a=>a.assetCode===code))throw new Error('El código de activo ya existe en esta serie.');
 series.actual++;return code;
}
export function annualAssetAmount(asset:CompanyState['fixedAssets'][number],date:string){
 const start=Number(asset.acquisitionDate.slice(0,4))*12+Number(asset.acquisitionDate.slice(5,7));
 const end=Number(date.slice(0,4))*12+Number(date.slice(5,7));
 const months=Math.max(0,Math.min(asset.usefulLifeMonths,end-start+1));
 return round(Math.max(0,round((asset.cost-asset.residualValue)*months/asset.usefulLifeMonths)-asset.accumulatedDepreciation));
}
type Post=(date:string,memo:string,source:string,reference:string,lines:JournalLine[])=>string;
const line=(accountCode:string,debit=0,credit=0):JournalLine=>({accountCode,debit,credit,description:'',costCenter:''});
export function applyAssetLifecycle(state:CompanyState,d:AssetLifecycleCommand,now:string,next:(prefix:string,date?:string)=>string,post:Post):string{
 const p=state.profile!;const fail=(condition:unknown,message:string)=>{if(!condition)throw new Error(message);};
 if(d.mode==='model'){
  fail(state.items.some(i=>i.itemCode===d.itemCode&&i.active),'Selecciona un artículo activo.');
  fail(!d.virtual||d.isAsset,'Un modelo virtual debe estar marcado como artículo de activo.');
  const series=((p as unknown as {docSeries?:{docType?:string;nombre?:string;bloqueada?:boolean}[]}).docSeries??[]);
  fail(series.some(s=>s.docType==='activos'&&s.nombre===d.series&&!s.bloqueada),'Configura una serie activa de activos fijos.');
  p.assetModels=[...(p.assetModels??[]).filter(m=>m.itemCode!==d.itemCode),{...d}];return d.itemCode;
 }
 const id=next('ACT',d.date);let record:AssetLifecycleRecord={id,mode:d.mode,date:d.date};
 if(d.mode==='rollover'){
  fail(d.newYear===d.year+1&&d.date===`${d.year}-12-31`,'El ejercicio nuevo debe ser consecutivo al corte anual.');
  fail(!(p.assetLifecycle??[]).some(r=>r.mode==='rollover'&&r.year===d.year),'El ejercicio ya fue transferido.');
  fail(state.fixedAssets.length>0,'Registra activos antes del cambio de ejercicio.');
  fail(state.fixedAssets.every(a=>a.acquisitionDate<=d.date),'Hay activos de un ejercicio posterior al corte.');
  for(const a of state.fixedAssets){a.fiscalYear=d.newYear;a.updatedAt=now;}
  record={...record,...d,carried:state.fixedAssets.map(a=>({assetCode:a.assetCode,cost:a.cost,accumulatedDepreciation:a.accumulatedDepreciation,remaining:round(a.cost-a.accumulatedDepreciation)}))};
 } else {
  const a=state.fixedAssets.find(a=>a.id===d.assetId);if(!a)throw new Error('Activo inexistente.');
  fail(a.status!=='disposed','El activo ya está dado de baja.');fail(d.date>=a.acquisitionDate,'La fecha precede a la adquisición.');
  fail(!a.depreciatedPeriods.some(period=>period>d.date.slice(0,7)),'La fecha precede a una depreciación contabilizada.');
  if(d.mode==='annual'){
   fail(d.date.endsWith('-12-31'),'La ejecución anual requiere el cierre de diciembre.');fail(a.depreciationArea===d.area,'Selecciona el área del activo.');
   const amount=annualAssetAmount(a,d.date);fail(amount>0,'No hay amortización pendiente al corte.');
   fail(amount===d.expectedAmount,'El importe cambió; vuelve a calcular la vista previa.');
   const journalEntryId=post(d.date,`Amortización anual ${a.assetCode}`,'depreciation',id,[line('6.09',amount),line('1.2.02',0,amount)]);
   a.accumulatedDepreciation=round(a.accumulatedDepreciation+amount);
   const first=Number(a.acquisitionDate.slice(0,4))*12+Number(a.acquisitionDate.slice(5,7))-1;
   const last=Number(d.date.slice(0,4))*12+11;
   for(let m=first;m<=last;m++){const period=`${Math.floor(m/12)}-${String(m%12+1).padStart(2,'0')}`;if(!a.depreciatedPeriods.includes(period))a.depreciatedPeriods.push(period);}
   a.status=a.accumulatedDepreciation>=round(a.cost-a.residualValue)?'fully_depreciated':'active';
   record={...record,assetId:a.assetCode,area:d.area,amount,journalEntryId};
  }else{
   const bookValue=round(a.cost-a.accumulatedDepreciation);
   const journalEntryId=post(d.date,`Baja ${a.assetCode}: ${d.reason}`,'asset_disposal',id,[line('1.2.02',a.accumulatedDepreciation),line('6.03',bookValue),line(a.accountCode,0,a.cost)]);
   a.status='disposed';a.disposalDate=d.date;a.disposalJournalEntryId=journalEntryId;
   record={...record,assetId:a.assetCode,kind:d.kind,posting:d.posting,reason:d.reason,bookValue,journalEntryId};
  }
  a.updatedAt=now;
 }
 p.assetLifecycle=[...(p.assetLifecycle??[]),record];return id;
}
