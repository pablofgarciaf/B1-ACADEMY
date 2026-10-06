import { z } from 'zod';
import { code, date, text, money, lineSchema, salesTypes, purchaseTypes, customerSchema, vendorSchema, itemSchema, employeeSchema, journalLineSchema, sriInputSchema, bomInputSchema, payrollInputLine, costMethods } from './firestore-types';

const omitBase = { id: true, createdAt: true, updatedAt: true, createdBy: true } as const;
const period = z.string().regex(/^20\d{2}-(0[1-9]|1[0-2])$/, 'Período con formato AAAA-MM.');
const documentInput = z.object({ date, dueDate: date, cardCode: code, reference: text, comments: text, baseDocumentId: z.string().max(80), lines: z.array(lineSchema).min(1).max(80) }).refine(d => d.dueDate >= d.date, 'El vencimiento precede a la fecha.');
export const commandSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('access'), data: z.object({}) }),
  z.object({ action: z.literal('initialize'), data: z.object({ companyName: text.min(2) }) }),
  z.object({ action: z.literal('sales'), data: z.object({ docType: z.enum(salesTypes), document: documentInput }) }),
  z.object({ action: z.literal('purchase'), data: z.object({ docType: z.enum(purchaseTypes), document: documentInput }) }),
  z.object({ action: z.literal('customer'), data: customerSchema.omit({ ...omitBase, cardCode: true, balance: true }) }),
  z.object({ action: z.literal('vendor'), data: vendorSchema.omit({ ...omitBase, cardCode: true, balance: true }) }),
  z.object({ action: z.literal('item'), data: itemSchema.omit({ ...omitBase, itemCode: true }).refine(v => v.maxStock >= v.minStock, 'Máximo menor al mínimo.') }),
  z.object({ action: z.literal('employee'), data: employeeSchema.omit({ ...omitBase, employeeCode: true }) }),
  z.object({ action: z.literal('journal'), data: z.object({ date, dueDate: date, memo: text.min(1), reference: text, lines: z.array(journalLineSchema).min(2).max(100) }) }),
  z.object({ action: z.literal('reverse'), data: z.object({ entryId: code, date }) }),
  z.object({ action: z.literal('stock'), data: z.object({ itemCode: code, warehouseCode: code, qty: z.number().finite().refine(v => v !== 0), costingMethod: z.enum(costMethods) }) }),
  z.object({ action: z.literal('transfer'), data: z.object({ from: code, to: code, date, lines: z.array(z.object({ itemCode: code, quantity: money.positive() })).min(1).max(60) }) }),
  z.object({ action: z.literal('bank'), data: z.object({ bankAccountId: code, date, type: z.enum(['deposit', 'payment']), amount: money.positive(), counterpartAccount: code, reference: text, documentId: z.string().max(80) }) }),
  z.object({ action: z.literal('reconcile'), data: z.object({ id: code, statementAmount: z.number().finite(), reconciled: z.boolean() }) }),
  z.object({ action: z.literal('payroll'), data: z.object({ period: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/), date, sbu: money.positive(), lines: z.array(payrollInputLine).min(1).max(80) }) }),
  z.object({ action: z.literal('sri'), data: sriInputSchema }),
  z.object({ action: z.literal('authorize'), data: z.object({ id: code }) }),
  z.object({ action: z.literal('bom'), data: bomInputSchema }),
  z.object({ action: z.literal('production'), data: z.object({ bomCode: code, quantity: money.positive(), warehouseCode: code, date, dueDate: date }) }),
  z.object({ action: z.literal('productionStatus'), data: z.object({ id: code, status: z.enum(['released', 'in_progress', 'closed']) }) }),
  z.object({ action: z.literal('mrp'), data: z.object({ vendorCode: code, date }) }),
  z.object({ action: z.literal('missionComplete'), data: z.object({ id: code }) }),
  z.object({ action: z.literal('budget'), data: z.object({ year: z.string().regex(/^20\d{2}$/), accountCode: code, months: z.array(money).length(12) }) }),
  // Cierre contable: un período cerrado no admite asientos; el cierre anual traslada el resultado.
  z.object({ action: z.literal('closePeriod'), data: z.object({ period: period, closed: z.boolean() }) }),
  z.object({ action: z.literal('closeYear'), data: z.object({ year: z.string().regex(/^20\d{2}$/) }) }),
  // Autorizaciones (borradores retenidos hasta aprobación).
  z.object({ action: z.literal('approvalRule'), data: z.object({ docType: z.enum([...salesTypes, ...purchaseTypes]), threshold: money, active: z.boolean() }) }),
  z.object({ action: z.literal('approve'), data: z.object({ id: code, approved: z.boolean(), comment: text.min(10, 'Justifica la decisión en al menos 10 caracteres.') }) }),
  // Precios: listas por artículo, lista por cliente y descuentos por volumen.
  z.object({ action: z.literal('itemPrices'), data: z.object({ itemCode: code, price: money, price2: money, price3: money }) }),
  z.object({ action: z.literal('customerPriceList'), data: z.object({ cardCode: code, list: z.union([z.literal(1), z.literal(2), z.literal(3)]) }) }),
  z.object({ action: z.literal('volumeDiscount'), data: z.object({ id: z.string().max(80).default(''), itemCode: z.string().trim().min(1).max(80), minQuantity: money.positive(), discount: money.max(100), remove: z.boolean().default(false) }) }),
  // Conteo físico de inventario con ajuste contable.
  z.object({ action: z.literal('inventoryCount'), data: z.object({ warehouseCode: code, date, blind: z.boolean(), lines: z.array(z.object({ itemCode: code, countedQuantity: money })).min(1).max(200) }) }),
  // Activos fijos y depreciación mensual en línea recta.
  z.object({ action: z.literal('fixedAsset'), data: z.object({ name: text.min(2), category: text.min(2), acquisitionDate: date, cost: money.positive(), residualValue: money, usefulLifeMonths: z.number().int().min(1).max(600), paymentAccount: z.enum(['1.1.01', '2.1.01', '2.2.01']) }) }),
  z.object({ action: z.literal('depreciate'), data: z.object({ period }) }),
  // Costos de importación prorrateados sobre una recepción de mercadería.
  z.object({ action: z.literal('landedCost'), data: z.object({ documentId: code, date, allocation: z.enum(['value', 'quantity']), paymentAccount: z.enum(['2.1.01', '1.1.01']), costs: z.array(z.object({ concept: text.min(2), amount: money.positive() })).min(1).max(10) }) }),
  // CRM: crear o actualizar una oportunidad (id vacío = nueva).
  z.object({ action: z.literal('opportunity'), data: z.object({ id: z.string().max(80).default(''), name: text.min(3), cardCode: code, amount: money, stage: z.enum(['prospecto', 'calificado', 'propuesta', 'negociacion', 'ganada', 'perdida']), expectedClose: date, source: text, notes: text, lossReason: text.default('') }) }),
  // Datos de la empresa (inicialización).
  z.object({ action: z.literal('companySettings'), data: z.object({ companyName: text.min(2), ruc: z.string().regex(/^\d{10}001$/, 'El RUC tiene 13 dígitos y termina en 001.'), incomeTaxRate: z.number().min(0).max(40), warehouses: z.array(z.object({ code: code, name: text.min(2) })).min(1).max(20) }) }),
  // Importación masiva de datos maestros (estilo Data Transfer Workbench): todo o nada.
  z.object({ action: z.literal('importMasterData'), data: z.object({ kind: z.enum(['customer', 'vendor', 'item']), rows: z.array(z.record(z.unknown())).min(1).max(200) }) }),
]);
export type CompanyCommand = z.infer<typeof commandSchema>;
export type CommandData<A extends CompanyCommand['action']> = Extract<CompanyCommand, { action: A }>['data'];
