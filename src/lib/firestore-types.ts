import { z } from 'zod';

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
export const lineSchema = z.object({ itemCode: code, description: text.min(1), quantity: money.positive(), unit: text.min(1), price: money, discount: money.max(100), taxRate: z.union([z.literal(0), z.literal(5), z.literal(15)]), warehouseCode: code });
export type DocumentLine = z.infer<typeof lineSchema>;
const documentSchema = base.extend({ docNumber: code, date, dueDate: date, cardCode: code, cardName: text.min(1), currency: z.literal('USD'), reference: text, comments: text, baseDocumentId: z.string().max(80), status: z.enum(['open', 'closed']), lines: z.array(lineSchema).min(1).max(80), subtotal: money, tax: money, total: money, paidAmount: money, journalEntryId: z.string() });
export const salesSchema = documentSchema.extend({ docType: z.enum(salesTypes) });
export const purchaseSchema = documentSchema.extend({ docType: z.enum(purchaseTypes) });
export type SalesDocument = z.infer<typeof salesSchema>;
export type PurchaseDocument = z.infer<typeof purchaseSchema>;
export type DocumentInput = Pick<SalesDocument, 'date' | 'dueDate' | 'cardCode' | 'reference' | 'comments' | 'baseDocumentId' | 'lines'>;
const partnerSchema = base.extend({ cardCode: code, name: text.min(2), ruc: z.string().regex(/^\d{10}(\d{3})?$/), email: z.union([z.string().email(), z.literal('')]), phone: text, address: text, city: text, contactName: text, currency: z.literal('USD'), paymentTermsDays: money.int().max(365), creditLimit: money, balance: z.number().finite(), active: z.boolean(), group: text, notes: text });
export const customerSchema = partnerSchema.extend({ kind: z.enum(['customer', 'lead']) });
export const vendorSchema = partnerSchema;
export type Customer = z.infer<typeof customerSchema>;
export type Vendor = z.infer<typeof vendorSchema>;
export const itemSchema = base.extend({ itemCode: code, name: text.min(2), type: z.enum(['inventory', 'service', 'labor']), group: text, purchaseUnit: text.min(1), salesUnit: text.min(1), price: money, price2: money, price3: money, maxDiscount: money.max(100), purchasePrice: money, preferredVendor: z.string().max(80), weight: money, length: money, width: money, height: money, costingMethod: z.enum(costMethods), standardCost: money, minStock: money, maxStock: money, reorderPoint: money, description: text, specifications: text, active: z.boolean() });
export type Item = z.infer<typeof itemSchema>;
export interface WarehouseStock extends Entity { itemCode: string; warehouseCode: string; quantity: number; reserved: number; averageCost: number; value: number; costingMethod: CostingMethod; layers: { quantity: number; cost: number; date: string }[] }
export interface StockMovement extends Entity { itemCode: string; warehouseCode: string; date: string; quantity: number; unitCost: number; value: number; balance: number; reference: string }
export const journalLineSchema = z.object({ accountCode: code, debit: money, credit: money, description: text, costCenter: text });
export type JournalLine = z.infer<typeof journalLineSchema>;
export const journalSchema = base.extend({ entryNumber: code, date, dueDate: date, period: z.string().regex(/^\d{4}-\d{2}$/), reference: text, memo: text.min(1), lines: z.array(journalLineSchema).min(2).max(160), totalDebit: money, totalCredit: money, reversalOf: z.string(), reversedBy: z.string(), source: text });
export type JournalEntry = z.infer<typeof journalSchema>;
export interface AccountingAccount extends Entity { code: string; name: string; parentCode: string; category: 'asset' | 'liability' | 'equity' | 'income' | 'cost' | 'expense'; nature: 'D' | 'H'; postable: boolean; active: boolean }
export interface TrialBalanceRow { accountCode: string; name: string; category: AccountingAccount['category']; nature: 'D' | 'H'; opening: number; debit: number; credit: number; closing: number }
export interface BankAccount extends Entity { name: string; bankName: string; accountNumber: string; currency: 'USD'; ledgerAccount: string; openingBalance: number; balance: number; active: boolean }
export const bankSchema = base.extend({ transactionId: code, bankAccountId: code, date, type: z.enum(['deposit', 'payment']), amount: money.positive(), counterpartAccount: code, reference: text, documentId: z.string(), reconciled: z.boolean(), statementAmount: z.number().finite().nullable(), journalEntryId: z.string() });
export type BankTransaction = z.infer<typeof bankSchema>;
export const employeeSchema = base.extend({ employeeCode: code, firstName: text.min(1), lastName: text.min(1), identification: z.string().regex(/^\d{10}$/), position: text, department: text, hireDate: date, contract: z.enum(['indefinite', 'fixed', 'fees']), schedule: z.enum(['full', 'partial']), baseSalary: money.positive(), employerRate: money.max(100), personalRate: money.max(100), thirteenthMonthly: z.boolean(), fourteenthMonthly: z.boolean(), reserveMonthly: z.boolean(), vacationDays: money, active: z.boolean() });
export type PayrollEmployee = z.infer<typeof employeeSchema>;
export const payrollInputLine = z.object({ employeeCode: code, days: money.max(30), extra50: money.max(240), extra100: money.max(240), commissions: money, otherIncome: money, advances: money, otherDeductions: money });
export type PayrollInputLine = z.infer<typeof payrollInputLine>;
export interface PayrollLine extends PayrollInputLine { employeeName: string; salary: number; overtime50: number; overtime100: number; contributory: number; thirteenth: number; fourteenth: number; reserves: number; thirteenthProvision: number; fourteenthProvision: number; reserveProvision: number; vacationProvision: number; personalIESS: number; employerIESS: number; income: number; deductions: number; net: number }
export interface PayrollRun extends Entity { payrollId: string; period: string; date: string; sbu: number; lines: PayrollLine[]; totalIncome: number; totalDeductions: number; totalNet: number; employerIESS: number; journalEntryId: string; status: 'posted' }
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
export interface SRITaxDocument extends Entity, z.infer<typeof sriInputSchema> { claveAcceso: string; number: string; environment: '1'; emissionType: '1'; status: 'PENDIENTE' | 'AUTORIZADO'; authorizedAt: string; xml: string; totalRetention: number; simulated: true }
export const bomInputSchema = z.object({ parentItemCode: code, type: z.enum(['production', 'template', 'sales']), components: z.array(z.object({ itemCode: code, quantity: money.positive(), unit: text.min(1), cost: money })).min(1).max(60) });
export interface BillOfMaterials extends Entity, z.infer<typeof bomInputSchema> { bomCode: string; totalCost: number }
export interface ProductionOrder extends Entity { orderNumber: string; date: string; dueDate: string; parentItemCode: string; quantity: number; warehouseCode: string; bomCode: string; components: BillOfMaterials['components']; status: 'planned' | 'released' | 'in_progress' | 'closed'; journalEntryId: string; actualCost: number }
export interface XPEvent { key: string; label: string; points: number; date: string; reference: string }
export interface CompanyProfile extends Entity { uid: string; email: string; companyName: string; ruc: string; currency: 'USD'; country: 'EC'; fiscalScenario: 'training-2024' | 'ecuador-2026'; sbu: number; incomeTaxRate: number; warehouses: { code: string; name: string }[]; xp: number; level: number; xpHistory: XPEvent[]; completedModules: string[]; lastAccess: string; sequences: Record<string, number>; documentCount: number;
  /** Períodos contables cerrados (AAAA-MM): no admiten asientos. */
  closedPeriods?: string[];
  /** Reglas de autorización: documentos de ese tipo sobre el monto requieren aprobación. */
  approvalRules?: ApprovalRule[];
  /** Lista de precios asignada a cada cliente (1 general, 2 mayorista, 3 distribuidor). */
  customerPriceLists?: Record<string, 1 | 2 | 3>;
  /** Descuentos automáticos por cantidad. itemCode '*' aplica a todos los artículos. */
  volumeDiscounts?: VolumeDiscount[];
  /** Campos definidos por el usuario (como los U_ de SAP). */
  udfDefinitions?: UdfDefinition[];
}
export interface ApprovalRule { docType: DocType; threshold: number; active: boolean }
export interface VolumeDiscount { id: string; itemCode: string; minQuantity: number; discount: number }
export interface Mission extends Entity { title: string; description: string; module: string; status: 'assigned' | 'completed'; teacherUid: string }
/** Presupuesto anual de una cuenta de resultados (ingresos, costos o gastos), en 12 montos mensuales. */
export interface Budget extends Entity { year: string; accountCode: string; accountName: string; months: number[] }
/** Documento retenido hasta que alguien con criterio lo autorice (como los borradores de SAP). */
export interface Approval extends Entity {
  approvalNumber: string; kind: 'sales' | 'purchase'; docType: DocType; cardCode: string; cardName: string; total: number; threshold: number;
  document: { date: string; dueDate: string; cardCode: string; reference: string; comments: string; baseDocumentId: string; lines: DocumentLine[] };
  status: 'pending' | 'approved' | 'rejected'; decisionComment: string; decidedAt: string; resultDocumentId: string;
}
export interface InventoryCountLine { itemCode: string; itemName: string; systemQuantity: number; countedQuantity: number; difference: number; unitCost: number; value: number }
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
export interface BinLocation extends Entity { warehouseCode: string; binCode: string; description: string; maxQuantity: number; contents: { itemCode: string; quantity: number }[] }
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
  accumulatedDepreciation: number; depreciatedPeriods: string[]; status: 'active' | 'fully_depreciated'; journalEntryId: string;
}
export interface CompanyCollections { salesOrders: SalesDocument; purchaseOrders: PurchaseDocument; customers: Customer; vendors: Vendor; items: Item; warehouseStock: WarehouseStock; stockMovements: StockMovement; journalEntries: JournalEntry; chartOfAccounts: AccountingAccount; bankAccounts: BankAccount; bankTransactions: BankTransaction; employees: PayrollEmployee; payrollRuns: PayrollRun; sriDocuments: SRITaxDocument; productionOrders: ProductionOrder; boms: BillOfMaterials; missions: Mission; budgets: Budget; approvals: Approval; inventoryCounts: InventoryCount; fixedAssets: FixedAsset; landedCosts: LandedCost; opportunities: Opportunity; serviceContracts: ServiceContract; serviceCalls: ServiceCall; projects: Project; teamUsers: TeamUser; routings: Routing; binLocations: BinLocation; lots: Lot; udfValues: UdfValues }
export type CollectionName = keyof CompanyCollections;
export const collectionNames: CollectionName[] = ['salesOrders', 'purchaseOrders', 'customers', 'vendors', 'items', 'warehouseStock', 'stockMovements', 'journalEntries', 'chartOfAccounts', 'bankAccounts', 'bankTransactions', 'employees', 'payrollRuns', 'sriDocuments', 'productionOrders', 'boms', 'missions', 'budgets', 'approvals', 'inventoryCounts', 'fixedAssets', 'landedCosts', 'opportunities', 'serviceContracts', 'serviceCalls', 'projects', 'teamUsers', 'routings', 'binLocations', 'lots', 'udfValues'];
export type CompanyState = { profile: CompanyProfile | null } & { [K in CollectionName]: CompanyCollections[K][] };
export const emptyCompany = (): CompanyState => ({ profile: null, salesOrders: [], purchaseOrders: [], customers: [], vendors: [], items: [], warehouseStock: [], stockMovements: [], journalEntries: [], chartOfAccounts: [], bankAccounts: [], bankTransactions: [], employees: [], payrollRuns: [], sriDocuments: [], productionOrders: [], boms: [], missions: [], budgets: [], approvals: [], inventoryCounts: [], fixedAssets: [], landedCosts: [], opportunities: [], serviceContracts: [], serviceCalls: [], projects: [], teamUsers: [], routings: [], binLocations: [], lots: [], udfValues: [] });
