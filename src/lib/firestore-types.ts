import { z } from 'zod';
import type { TrainingOpeningRecord, AccountingPeriodRecord } from './training-accounting';
import type { AssetModel, AssetLifecycleRecord } from './asset-lifecycle';

export const money = z.number().finite().min(0).max(1e10);
export const code = z.string().trim().min(1).max(80).regex(/^[\w.-]+$/);
export const text = z.string().trim().max(500);
export const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().startsWith(value), 'Fecha inválida');
const base = z.object({ id: code, createdAt: z.string(), updatedAt: z.string(), createdBy: code });
export type Entity = z.infer<typeof base>;
export type Input<T extends Entity> = Omit<T, keyof Entity>;
export const salesTypes = ['quotation', 'order', 'delivery', 'invoice', 'credit_note'] as const;
export const purchaseTypes = ['purchase_request', 'purchase_order', 'goods_receipt', 'vendor_invoice', 'debit_note'] as const;
export type SalesDocType = typeof salesTypes[number];
export type PurchaseDocType = typeof purchaseTypes[number];
export type DocType = SalesDocType | PurchaseDocType;
export const costMethods = ['average', 'fifo', 'standard'] as const;
export type CostingMethod = typeof costMethods[number];
export const lineSchema = z.object({ itemCode: code, description: text.min(1), quantity: money.positive(), unit: text.min(1), price: money, discount: money.max(100), taxRate: z.union([z.literal(0), z.literal(5), z.literal(8), z.literal(15)]), warehouseCode: code, ice: money.optional(), itemType:z.enum(['inventory','service','labor']).optional(), expenseAccount:code.optional(), binCode:code.optional() });
export type DocumentLine = z.infer<typeof lineSchema>;
const documentSchema = base.extend({ openingBalance: z.boolean().optional(), docNumber: code, /** Serie configurada usada para numerar este documento. */ series: text.default(''), ownerCode: z.union([code, z.literal('')]).default(''), date, dueDate: date, cardCode: code, cardName: text.min(1), currency: z.literal('USD'), reference: text, comments: text, baseDocumentId: z.string().max(80), status: z.enum(['open', 'closed']), lines: z.array(lineSchema).max(80), subtotal: money, ice: money.optional(), tax: money, total: money, paidAmount: money, journalEntryId: z.string() });
export const salesSchema = documentSchema.extend({ docType: z.enum(salesTypes) }).refine(d=>d.openingBalance === true ? d.lines.length === 0 : d.lines.length > 0, 'Un documento normal requiere líneas; un saldo de apertura no reconstruye líneas históricas.');
export const purchaseSchema = documentSchema.extend({ docType: z.enum(purchaseTypes), assetValuationDate:date.optional() }).refine(d=>d.openingBalance === true ? d.lines.length === 0 : d.lines.length > 0, 'Un documento normal requiere líneas; un saldo de apertura no reconstruye líneas históricas.');
export type SalesDocument = z.infer<typeof salesSchema>;
export type PurchaseDocument = z.infer<typeof purchaseSchema>;
export type DocumentInput = Pick<SalesDocument, 'date' | 'dueDate' | 'cardCode' | 'reference' | 'comments' | 'baseDocumentId' | 'series' | 'lines'> & {assetValuationDate?:string};
const partnerSchema = base.extend({ cardCode: code, name: text.min(2), ruc: z.string().regex(/^\d{10}(\d{3})?$/), email: z.union([z.string().email(), z.literal('')]), phone: text, address: text, city: text, contactName: text, currency: z.literal('USD'), paymentTermsDays: money.int().max(365), creditLimit: money, balance: z.number().finite(), active: z.boolean(), group: text, notes: text });
export const customerSchema = partnerSchema.extend({ kind: z.enum(['customer', 'lead']), linkedVendorCode: code.optional(), ownerCode: z.union([code, z.literal('')]).default('') });
export const vendorSchema = partnerSchema.extend({
  rimpe: z.enum(['ninguno', 'emprendedor', 'popular']).default('ninguno'),
  linkedCustomerCode: code.optional(),
  /** Datos fiscales que determinan la retención simulada del proveedor. */
  subjectToWithholding: z.boolean().default(false),
  withholdingTax: text.default(''),
  vatWithholdingGroup: text.default(''),
  vatWithholdingCode: text.default(''),
  fiscalCategory: text.default(''),
  partnerClass: z.literal('Proveedor').default('Proveedor'),
});
export type Customer = z.infer<typeof customerSchema>;
export type Vendor = z.infer<typeof vendorSchema>;
export const itemSchema = base.extend({ ice: z.enum(['none', 'perfumes', 'videojuegos', 'cigarrillos']).default('none'), itemCode: code, barcode:text.default(''), salesTaxRate:z.union([z.literal(0),z.literal(5),z.literal(8),z.literal(15)]).default(15), name: text.min(2), type: z.enum(['inventory', 'service', 'labor']), group: text, itemClass: text.default('100'), uomGroup: text.default(''), inventoryUnit: text.default('UND'), manageMethod: z.enum(['none','lot','serial']).default('none'), perpetualInventory: z.boolean().default(true), contractModel: text.default(''), defaultWarehouse: code.default('01'), purchaseUnit: text.min(1), salesUnit: text.min(1), price: money, price2: money, price3: money, maxDiscount: money.max(100), purchasePrice: money, preferredVendor: z.string().max(80), weight: money, length: money, width: money, height: money, costingMethod: z.enum(costMethods), standardCost: money, minStock: money, maxStock: money, reorderPoint: money, planningMethod: z.enum(['buy','production']).default('buy'), mrpActive: z.boolean().default(false), planningWarehouse: code.default('01'), purchaseLeadDays: z.number().int().min(0).max(3650).default(0), productionLeadDays: z.number().int().min(0).max(3650).default(0), orderInterval: text.default(''), orderMultiple: money.default(0), planningMinimum: money.default(0), forecastQuantity: money.default(0), description: text, specifications: text, active: z.boolean() });
export type Item = z.infer<typeof itemSchema>;
export interface WarehouseStock extends Entity { itemCode: string; warehouseCode: string; quantity: number; reserved: number; averageCost: number; value: number; costingMethod: CostingMethod; layers: { quantity: number; cost: number; date: string }[] }
export interface StockMovement extends Entity { itemCode: string; description?: string; warehouseCode: string; fromWarehouseCode?: string; toWarehouseCode?: string; date: string; quantity: number; unitCost: number; value: number; balance: number; reference: string }
export const journalLineSchema = z.object({ accountCode: code, debit: money, credit: money, description: text, costCenter: text });
export type JournalLine = z.infer<typeof journalLineSchema>;
export const journalSchema = base.extend({ entryNumber: code, date, dueDate: date, period: z.string().regex(/^\d{4}-\d{2}$/), reference: text, memo: text.min(1), lines: z.array(journalLineSchema).min(2).max(160), totalDebit: money, totalCredit: money, reversalOf: z.string(), reversedBy: z.string(), source: text });
export type JournalEntry = z.infer<typeof journalSchema>;
export interface AccountingAccount extends Entity { code: string; name: string; parentCode: string; category: 'asset' | 'liability' | 'equity' | 'income' | 'cost' | 'expense'; nature: 'D' | 'H'; postable: boolean; active: boolean }
export interface TrialBalanceRow { accountCode: string; name: string; category: AccountingAccount['category']; nature: 'D' | 'H'; opening: number; debit: number; credit: number; closing: number }
export interface BankAccount extends Entity { name: string; bankName: string; accountNumber: string; currency: 'USD'; ledgerAccount: string; openingBalance: number; balance: number; active: boolean }
export const bankSchema = base.extend({ transactionId: code, bankAccountId: code, date, type: z.enum(['deposit', 'payment']), amount: money.positive(), retentionIR: money.optional(), retentionIVA: money.optional(), discountPercent: money.optional(), discountAmount: money.optional(), paymentMethod: z.enum(['transfer','card','cash','check']).default('transfer'), partnerCode: z.string(), documentNumber: z.string(), documentTotal: money.optional(), counterpartAccount: code, reference: text, documentId: z.string(), reconciled: z.boolean(), statementAmount: z.number().finite().nullable(), journalEntryId: z.string() });
export type BankTransaction = z.infer<typeof bankSchema> & { bankName: string; accountName: string; accountNumber: string };
export const employeeSchema = base.extend({ employeeCode: code, fullName: text.default(''), firstName: text.min(1), lastName: text.min(1), identification: z.string().regex(/^\d{10}$/), position: text, department: text, supervisorCode: z.union([code, z.literal('')]).default(''), branchCode: code.default('01'), hireDate: date, contract: z.enum(['indefinite', 'fixed', 'fees']), schedule: z.enum(['full', 'partial']), baseSalary: money.positive(), employerRate: money.max(100), personalRate: money.max(100), thirteenthMonthly: z.boolean(), fourteenthMonthly: z.boolean(), reserveMonthly: z.boolean(), vacationDays: money, dependents: z.number().int().min(0).max(10).default(0), projectedExpenses: money.default(0), active: z.boolean() });
export type PayrollEmployee = z.infer<typeof employeeSchema>;
export const payrollInputLine = z.object({ employeeCode: code, days: money.max(30), extra50: money.max(240), extra100: money.max(240), commissions: money, otherIncome: money, advances: money, otherDeductions: money });
export type PayrollInputLine = z.infer<typeof payrollInputLine>;
export interface PayrollLine extends PayrollInputLine { employeeName: string; salary: number; overtime50: number; overtime100: number; contributory: number; thirteenth: number; fourteenth: number; reserves: number; thirteenthProvision: number; fourteenthProvision: number; reserveProvision: number; vacationProvision: number; personalIESS: number; incomeTax: number; employerIESS: number; income: number; deductions: number; net: number }
export interface PayrollRun extends Entity { payrollId: string; period: string; date: string; sbu: number; lines: PayrollLine[]; totalIncome: number; totalDeductions: number; totalNet: number; employerIESS: number; journalEntryId: string; status: 'posted' }
/** Cierres tributarios del ejercicio: utilidades de los trabajadores, impuesto a la renta, anticipo y pagos con ISD. */
export interface TaxRun extends Entity { runId: string; kind: 'utilidades' | 'renta' | 'anticipo' | 'isd'; year: number; date: string; title: string; partnerCode?: string; concept?: string; figures: Record<string, number>; lines: { label: string; value: string; note: string }[]; journalEntryId: string }
export const sriTypes = ['01', '03', '04', '05', '06', '07'] as const;
export const retentionLineSchema = z.object({ code: code, tax: z.enum(['IR', 'IVA']), base: money, rate: money.max(100) });
export const atsSchema = z.object({ sustentoTributario: text, tpIdProv: text, idProv: text, tipoComprobante: text, parteRel: z.boolean(), fechaRegistro: date, establecimiento: z.string().regex(/^\d{3}$/), puntoEmision: z.string().regex(/^\d{3}$/), secuencial: text, autorizacion: text, fechaEmision: date, baseNoGraIva: money, baseImponible: money, baseImpGrav: money, baseImpExe: money, montoIce: money, montoIva: money, valRetBien10: money, valRetServ20: money, valorRetBienes: money, valRetServ50: money, valorRetServicios: money, valRetServ100: money, totbasesImpReemb: money, pagoLocExt: text, paisEfecPago: text, aplicConvDobTrib: z.boolean(), pagExtSujRetNorLeg: z.boolean(), formasDePago: z.array(text), tipoEmision: text, compensaciones: z.array(z.object({ codigo: text, valor: money })), retencionesRecibidas: money,
  tipoProv: text.default('01'), denoProv: text.default(''), docModificado: text.default(''), estabModificado: text.default(''), ptoEmiModificado: text.default(''), secModificado: text.default(''), autModificado: text.default(''),
  estabRetencion1: text.default(''), ptoEmiRetencion1: text.default(''), secRetencion1: text.default(''), autRetencion1: text.default(''), fechaEmiRet1: date.or(z.literal('')).default(''),
  pagoRegFis: text.default(''), paisEfecPagoGen: text.default(''), paisEfecPagoParFis: text.default(''), denopagoRegFis: text.default(''), fopPagExtSujRetNorLeg: text.default(''),
  tpIdCliente: text.default('01'), idCliente: text.default(''), tipoCliente: text.default('01'), denoCli: text.default(''), parteRelVtas: z.boolean().default(false), numeroComprobantes: money.int().default(1),
  valorRetIva: money.default(0), valorRetRenta: money.default(0), establecimientoVenta: text.default('001'), ventasEstab: money.default(0), ivaComp: money.default(0),
  air: z.array(z.object({ codRetAir: text, baseImpAir: money, porcentajeAir: money.max(100), valRetAir: money })).max(30).default([]),
  reembolsos: z.array(z.object({ tipoComprobanteReemb: text, tpIdProvReemb: text, idProvReemb: text, establecimientoReemb: text, puntoEmisionReemb: text, secuencialReemb: text, fechaEmisionReemb: date, autorizacionReemb: text, baseImponibleReemb: money, baseImpGravReemb: money, baseNoGraIvaReemb: money, baseImpExeReemb: money, montoIceRemb: money, montoIvaRemb: money })).max(30).default([]),
});
export const sriDetailsSchema = z.object({
  matrixAddress: text.min(1).default('Quito · matriz de práctica'), establishmentAddress: text.min(1).default('Quito · establecimiento de práctica'),
  accountingRequired: z.boolean().default(true), reason: text.default('Operación de práctica'),
  supportNumber: z.string().regex(/^\d{3}-\d{3}-\d{9}$/).or(z.literal('')).default(''), supportDate: date.or(z.literal('')).default(''),
  departureAddress: text.default(''), destinationAddress: text.default(''), carrierName: text.default(''), carrierId: z.string().regex(/^\d{10}(\d{3})?$/).or(z.literal('')).default(''),
  plate: text.default(''), transportStart: date.or(z.literal('')).default(''), transportEnd: date.or(z.literal('')).default(''), route: text.default(''),
});
export const sriInputSchema = z.object({ docType: z.enum(sriTypes), date, partnerCode: code, sourceDocumentId: z.string(), series: z.string().regex(/^\d{3}-\d{3}$/), retentionLines: z.array(retentionLineSchema).max(30), ats: atsSchema, details: sriDetailsSchema.default({}) });
export interface SRITaxDocument extends Entity, z.infer<typeof sriInputSchema> { claveAcceso: string; number: string; environment: '1'; emissionType: '1'; status: 'PENDIENTE' | 'AUTORIZADO' | 'DEVUELTA' | 'NO AUTORIZADO'; authorizedAt: string; xml: string; totalRetention: number; simulated: true; sriMessages?: { identificador: string; mensaje: string; tipo: 'ERROR' | 'ADVERTENCIA' | 'INFORMATIVO' }[]; journalEntryId?: string }
export const bomComponentSchema = z.object({ lineNumber: z.number().int().positive().optional(), lineType: z.enum(['item', 'resource']).default('item'), itemCode: code, description: text.min(1).optional(), quantity: money.positive(), unit: text.min(1), cost: money, warehouseCode: code.optional(), estimatedTime: text.optional() });
export const bomInputSchema = z.object({ parentItemCode: code, description: text.min(1).optional(), type: z.enum(['production', 'template', 'sales']), level: z.number().int().positive().default(1), baseQuantity: money.positive().default(1), warehouseCode: code.optional(), components: z.array(bomComponentSchema).min(1).max(60) });
export interface BillOfMaterials extends Entity, z.infer<typeof bomInputSchema> { bomCode: string; totalCost: number }
export interface ProductionStageIssue { id: string; stage: number; componentCode: string; quantity: number; fromWarehouseCode: string; toWarehouseCode: string; date: string }
export interface ProductionOrder extends Entity { orderNumber: string; receiptNumber?: string; date: string; dueDate: string; parentItemCode: string; description: string; priority: number; quantity: number; warehouseCode: string; bomCode: string; components: BillOfMaterials['components']; stageIssues: ProductionStageIssue[]; status: 'planned' | 'released' | 'in_progress' | 'closed'; issuedQuantity: number; receivedQuantity: number; unitCost: number; issueJournalEntryId: string; receiptJournalEntryId: string; journalEntryId: string; actualCost: number }
export interface XPEvent { key: string; label: string; points: number; date: string; reference: string }
export interface CompanyProfile extends Entity { usage?: 'training' | 'private'; trainingSetupVersion?: number; address?: string; phone?: string; regimen?: 'general' | 'rimpe-emprendedor' | 'rimpe-popular'; uid: string; email: string; companyName: string; ruc: string; currency: 'USD'; country: 'EC'; fiscalScenario: 'training-2024' | 'ecuador-2026'; sbu: number; incomeTaxRate: number; warehouses: { code: string; name: string }[]; xp: number; level: number; xpHistory: XPEvent[]; completedModules: string[]; lastAccess: string; sequences: Record<string, number>; documentCount: number;
  finalOperations?: import('./final-operations').FinalOperationRecord[];
  accountDeterminationRules?: import('./final-operations').AccountDeterminationRule[];
  /** Regla guardada para asignar fecha de stock a recuentos físicos. */
  seriesPermissions?: {userCode:string;group:number;access:'Total'|'Consulta'|'Ninguno';enabled:boolean;module:'Serie de numeración';permissionType:'Serie: Número de grupo'}[];
  stockRevaluations?: {id:string;itemCode:string;date:string;oldCost:number;newCost:number;reason:string;valueChange:number;journalEntryId:string}[];
  landedCostTypes?: {name:string;expenseAccount:string;updatesStock:boolean;allocation:'weight'|'value'|'quantity'|'none';updatesLastPurchase:boolean;fixedAmount:number}[];
  purchaseReturns?: {id:string;kind:'request'|'goods_return'|'credit_note'|'value_credit';date:string;vendorCode:string;baseDocumentId:string;itemCode:string;quantity:number;price:number;warehouseCode:string;reason:string;rma:string;withoutQuantity:boolean;subtotal:number;tax:number;total:number;journalEntryId:string}[];
  assetModels?:AssetModel[];
  assetLifecycle?:AssetLifecycleRecord[];
  inventorySettings?: { document: string; stockDateBy: 'creation' | 'posting'; default: boolean; appliesTo: string; exampleDate: string }[];
  trainingOpenings?: TrainingOpeningRecord[];
  accountingPeriods?: AccountingPeriodRecord[];
  budgetReports?: {id:string;scenario:string;period:string;accountCode:string;budget:number;actual:number;variance:number}[];
  priceUpdates?: {id:string;list:number;method:string;value:number}[];
  discountGroups?: {code:string;description:string;validFrom:string;validTo:string;active:boolean;rules:{groupCode:string;itemGroup:string;itemCode:string;discount:number;paidQuantity:number;freeQuantity:number;maxFree:number;kind:'percent'|'free';description:string}[]}[];
  customerDiscountGroups?: Record<string,{groupCode:string;excluded:boolean}>;
  discountOperations?: ({id:string;kind:string;count:number}&Record<string,unknown>)[];
  accountingPeriodSetup?: {startDate:string;endDate:string;dueThrough:string;interval:'Mensual';extendedDue:boolean;januaryStart:boolean;differentCalendar:boolean};
  /** Períodos contables cerrados (AAAA-MM): no admiten asientos. */
  closedPeriods?: string[];
  /** Annual lock, also for years with no profit-and-loss entry to post. */
  closedFiscalYears?: string[];
  /** Atomic opening import; keeps operational documents aligned with the selected control accounts. */
  openingBalances?: { reference:string; date:string; journalEntryId:string; importedAt:string; accountFamily:'compact'|'global' };
  controlAccounts?: Record<string,string>;
  /** Reglas de autorización: documentos de ese tipo sobre el monto requieren aprobación. */
  approvalRules?: ApprovalRule[];
  /** Lista de precios asignada a cada cliente (1 general, 2 mayorista, 3 distribuidor). */
  customerPriceLists?: Record<string, number>;
  /** Listas de precios derivadas de otra con un factor (las listas 1 a 3 son las base y siempre existen).
   * `items` conserva excepciones explícitas por lista, tal como se haría al añadir un artículo a una lista en B1. */
  priceLists?: { no: number; code: string; name: string; description: string; base: number; factor: number; currency: 'USD'; validFrom: string; validTo: string; active: boolean; items?: PriceListItem[] }[];
  /** Descuentos automáticos por cantidad. itemCode '*' aplica a todos los artículos. */
  volumeDiscounts?: VolumeDiscount[];
  /** Precio especial por cliente y artículo, con vigencia. Tiene prioridad sobre su lista general. */
  specialPrices?: SpecialPrice[];
  /** Campos definidos por el usuario (como los U_ de Finix ERP). */
  udfDefinitions?: UdfDefinition[];
}
export interface ApprovalRule { docType: DocType; threshold: number; active: boolean }
export interface PriceListItem { itemCode: string; description: string; price: number; unit: string; validFrom: string; validTo: string; active: boolean }
export interface VolumeDiscount { id: string; itemCode: string; list: number; minQuantity: number; maxQuantity: number | null; discount: number; validFrom: string; validTo: string; active: boolean; kind?: 'period' | 'quantity'; automatic?: boolean; fixedPrice?: number | null }
export interface SpecialPrice { id: string; cardCode: string; itemCode: string; discount: number; validFrom: string; validTo: string; referenceList: number; active: boolean }
export interface Mission extends Entity { title: string; description: string; module: string; status: 'assigned' | 'completed'; teacherUid: string }
/** Presupuesto anual de una cuenta de resultados (ingresos, costos o gastos), en 12 montos mensuales. */
export interface Budget extends Entity { year: string; accountCode: string; accountName: string; months: number[] }
/** Documento retenido hasta que alguien con criterio lo autorice (como los borradores de Finix ERP). */
export interface Approval extends Entity {
  approvalNumber: string; kind: 'sales' | 'purchase'; docType: DocType; cardCode: string; cardName: string; total: number; threshold: number;
  document: { date: string; dueDate: string; cardCode: string; reference: string; comments: string; baseDocumentId: string; lines: DocumentLine[] };
  status: 'pending' | 'approved' | 'rejected'; decisionComment: string; decidedAt: string; resultDocumentId: string;
}
/** Línea trazable de un recuento: ubicación física y responsable del conteo. */
export interface InventoryCountLine { itemCode: string; itemName: string; location: string; counter: string; systemQuantity: number; countedQuantity: number; difference: number; adjustmentType: 'entry' | 'exit' | 'none'; unitCost: number; value: number }
export interface InventoryCount extends Entity { countNumber: string; date: string; warehouseCode: string; blind: boolean; lines: InventoryCountLine[]; totalDifferenceValue: number; journalEntryId: string }
/** Costos de importación (flete, seguro, arancel, FODINFA, ISD…) prorrateados sobre una recepción. */
export interface LandedCost extends Entity {
  landedCostNumber: string; documentId: string; documentNumber: string; date: string; allocation: 'value' | 'quantity';
  costs: { concept: string; amount: number }[]; total: number;
  lines: { itemCode: string; warehouseCode: string; quantity: number; baseValue: number; share: number; toInventory: number; toCostOfSales: number }[];
  journalEntryId: string;
}
export type EtapaOportunidad = 'prospecto' | 'calificado' | 'propuesta' | 'negociacion' | 'ganada' | 'perdida';
/** Oportunidad de venta del CRM (embudo comercial). */
export interface Opportunity extends Entity {
  opportunityNumber: string; name: string; cardCode: string; cardName: string; amount: number; stage: EtapaOportunidad; probability: number;
  expectedClose: string; source: string; notes: string; lossReason: string; closedAt: string;
}
/** Contrato de servicio con nivel de servicio (SLA) en horas de respuesta. */
export interface ServiceContract extends Entity {
  contractNumber: string; cardCode: string; cardName: string; type: 'garantia' | 'mantenimiento' | 'soporte';
  startDate: string; endDate: string; monthlyFee: number; responseHours: number; coverage: string; status: 'active' | 'cancelled';
}
export type EstadoLlamada = 'abierta' | 'en_proceso' | 'resuelta' | 'cerrada';
/** Llamada / orden de servicio técnico. */
export interface ServiceCall extends Entity {
  callNumber: string; cardCode: string; cardName: string; subject: string; itemCode: string; priority: 'alta' | 'media' | 'baja';
  status: EstadoLlamada; technician: string; contractId: string; openedAt: string; resolvedAt: string; resolution: string;
  hoursWorked: number; responseHours: number; slaMet: boolean | null;
}
/** Proyecto con etapas presupuestadas en horas y costo. */
export interface Project extends Entity {
  projectNumber: string; name: string; cardCode: string; cardName: string; startDate: string; endDate: string; budget: number; hourlyCost: number;
  status: 'activo' | 'cerrado'; stages: { name: string; budgetHours: number; actualHours: number; done: boolean }[]; expenses: { date: string; concept: string; amount: number }[];
}
/** Miembro simulado del equipo con su rol y permisos por área (segregación de funciones). */
export interface TeamUser extends Entity { userCode: string; name: string; role: string; permissions: Record<string, 'total' | 'consulta' | 'ninguno'>; active: boolean }
/** Ruta de fabricación: operaciones por centro de trabajo con tiempos estándar. */
export interface Routing extends Entity { itemCode: string; operations: { seq: number; name: string; workCenter: string; setupMinutes: number; runMinutesPerUnit: number }[] }
/** Ubicación (bin) dentro de un almacén con su contenido. */
export interface BinLocation extends Entity { warehouseCode: string; binCode: string; description: string; maxQuantity: number; maxWeight?: number; currentWeight?: number; availableWeight?: number; contents: { itemCode: string; quantity: number }[] }
/** Lote o número de serie, con vencimiento y trazabilidad de entradas y salidas. */
export interface Lot extends Entity {
  itemCode: string; warehouseCode: string; lotNumber: string; kind: 'lote' | 'serie'; receivedQuantity: number; quantity: number; expiryDate: string;
  receiptDocumentId: string; receiptDocumentNumber: string; vendorName: string; issues: { documentId: string; documentNumber: string; cardName: string; date: string; quantity: number }[];
}
/** Valores de campos definidos por el usuario (UDF) para un registro de OCRD u OITM. */
export interface UdfValues extends Entity { table: 'OCRD' | 'OITM'; key: string; values: Record<string, string | number> }
export interface UdfDefinition { table: 'OCRD' | 'OITM'; field: string; label: string; type: 'texto' | 'numero' | 'lista'; options: string[] }
export interface FixedAsset extends Entity {
  assetCode: string; name: string; category: string; acquisitionDate: string; cost: number; residualValue: number; usefulLifeMonths: number;
  depreciationMethod: 'Lineal'; accountCode: string; depreciationArea: string;
  accumulatedDepreciation: number; depreciatedPeriods: string[]; status: 'active' | 'fully_depreciated' | 'disposed'; journalEntryId: string;
  sourceDocumentId?:string; sourceItemCode?:string; fiscalYear?:number; disposalDate?:string; disposalJournalEntryId?:string;
}
/** Registro persistente de un proceso bancario: extracto, conciliación, vía o lote de pagos. */
export interface BankWorkflow extends Entity {
  workflowType: 'statement' | 'reconciliation' | 'payment_run' | 'payment_method' | 'card_deposit';
  bankName: string; accountName: string; active: boolean; date: string; reference: string; currency: string;
  openingBalance: number; closingBalance: number; amount: number; paymentMethod: string; executionName: string; paymentClass: string;
  documentNumber: string; partnerCode: string; accountType: string; sourceAccount: string; destinationAccount: string;
  fileFormat: string; fileName: string; valueDate: string; journalNumber: string; journalDate: string; statementNumber: string; statementDate: string;
  selected: boolean; reserveTransactions: boolean; preventReconciliation: boolean; routeCode: string; routeName: string; series: string;
}
export interface CompanyCollections { salesOrders: SalesDocument; purchaseOrders: PurchaseDocument; customers: Customer; vendors: Vendor; items: Item; warehouseStock: WarehouseStock; stockMovements: StockMovement; journalEntries: JournalEntry; chartOfAccounts: AccountingAccount; bankAccounts: BankAccount; bankTransactions: BankTransaction; bankWorkflows: BankWorkflow; employees: PayrollEmployee; payrollRuns: PayrollRun; sriDocuments: SRITaxDocument; productionOrders: ProductionOrder; boms: BillOfMaterials; missions: Mission; budgets: Budget; approvals: Approval; inventoryCounts: InventoryCount; fixedAssets: FixedAsset; landedCosts: LandedCost; opportunities: Opportunity; serviceContracts: ServiceContract; serviceCalls: ServiceCall; projects: Project; teamUsers: TeamUser; routings: Routing; binLocations: BinLocation; lots: Lot; udfValues: UdfValues; taxRuns: TaxRun }
export type CollectionName = keyof CompanyCollections;
export const collectionNames: CollectionName[] = ['salesOrders', 'purchaseOrders', 'customers', 'vendors', 'items', 'warehouseStock', 'stockMovements', 'journalEntries', 'chartOfAccounts', 'bankAccounts', 'bankTransactions', 'bankWorkflows', 'employees', 'payrollRuns', 'sriDocuments', 'productionOrders', 'boms', 'missions', 'budgets', 'approvals', 'inventoryCounts', 'fixedAssets', 'landedCosts', 'opportunities', 'serviceContracts', 'serviceCalls', 'projects', 'teamUsers', 'routings', 'binLocations', 'lots', 'udfValues', 'taxRuns'];
export type CompanyState = { profile: CompanyProfile | null } & { [K in CollectionName]: CompanyCollections[K][] };
export const emptyCompany = (): CompanyState => ({ profile: null, salesOrders: [], purchaseOrders: [], customers: [], vendors: [], items: [], warehouseStock: [], stockMovements: [], journalEntries: [], chartOfAccounts: [], bankAccounts: [], bankTransactions: [], bankWorkflows: [], employees: [], payrollRuns: [], sriDocuments: [], productionOrders: [], boms: [], missions: [], budgets: [], approvals: [], inventoryCounts: [], fixedAssets: [], landedCosts: [], opportunities: [], serviceContracts: [], serviceCalls: [], projects: [], teamUsers: [], routings: [], binLocations: [], lots: [], udfValues: [], taxRuns: [] });
