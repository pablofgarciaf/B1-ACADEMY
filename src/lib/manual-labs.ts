import { MANUAL_LEGACY_CODES } from './manual-legacy-codes';

/** Selección por tema del manual. Nunca se deduce una pantalla de palabras sueltas. */
export const MANUAL_LABS: Record<string,string | null> = {
 '1.1':null,'1.2':'cockpit','1.3':'customer',
 '2.1':'order','2.2':'invoice','2.3':'customer','2.4':'opportunity','2.5':null,'2.6':null,'2.7':'credit_note',
 '3.1':'purchase_order','3.2':'purchase_order','3.3':'purchase_request','3.4':'vendor_invoice','3.5':'goods_receipt','3.6':null,'3.7':'landed','3.8':'landed',
 '4.1':'item','4.2':'groups','4.3':null,'4.4':null,'4.5':null,'4.6':null,'4.7':null,
 '5.1':'settings','5.2':'transfer','5.3':null,'5.4':null,'5.5':'count','5.6':null,
 '6.1':'production','6.2':'transfer',
 '7.1':null,'7.2':null,'7.3':null,'7.4':null,'7.5':null,'7.6':null,
 '8.1':'prices','8.2':'prices','8.3':'prices','8.4':'discounts','8.5':'discounts','8.6':'prices',
 '9.1':'mrp','9.2':null,'9.3':'bom',
 '10.1':'production','10.2':'resources','10.3':'capacity','10.4':'bom','10.5':'production','10.6':null,'10.7':'routing','10.8':'production','10.9':null,
 '11.1':'projects','11.2':'projects','12.1':'service',
 '13.1':'accounts','13.2':'currency','13.3':'accounts','13.4':null,'13.5':null,'13.6':null,
 '14.1':'financial','14.2':'journal','15.1':'journal','15.2':null,'15.3':null,'15.4':'period','15.5':'period','15.6':'bank',
 '16.1':'bank','16.2':null,'16.3':'bank','17.1':'financial','17.2':'cashflow','17.3':'aging','17.4':null,
 '18.1':'costs','18.2':'costs','18.3':null,'18.4':'budget',
 '19.1':'assets','19.2':null,'19.3':'assets','19.4':'assets','19.5':'assets','19.6':null,
 '20.1':null,'20.2':'settings','20.3':'settings','20.4':'opening','20.5':null,'20.6':'import','20.7':'import','20.8':'import',
 '21.1':'users','21.2':'users','21.3':null,'21.4':'series','21.5':null,'21.6':'print','21.7':null,
 '22.1':'query','22.2':null,'22.3':'approvals','22.4':'udo','22.5':null,'22.6':'udo','22.7':null,
 '23.1':'verification','23.2':'cockpit','23.3':'cockpit','23.4':'purchase_order','23.5':'goods_receipt','23.6':'query','23.7':'query',
};

const legacyToAcademic = new Map(Object.entries(MANUAL_LEGACY_CODES).map(([academic, legacy]) => [legacy, academic]));
/** Resuelve tanto IDs académicos (19.3_...) como claves legacy (10_FixedAsset_...). */
export function manualLabKey(manualId: string): string {
  const academic = legacyToAcademic.get(manualId)?.split('_')[0];
  return academic || manualId.split('_')[0];
}
