import { z } from 'zod';
import { code, date, text, money, lineSchema, salesTypes, purchaseTypes, customerSchema, vendorSchema, itemSchema, employeeSchema, journalLineSchema, sriInputSchema, bomInputSchema, payrollInputLine, costMethods } from './firestore-types';

const omitBase = { id: true, createdAt: true, updatedAt: true, createdBy: true } as const;
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
]);
export type CompanyCommand = z.infer<typeof commandSchema>;
export type CommandData<A extends CompanyCommand['action']> = Extract<CompanyCommand, { action: A }>['data'];
