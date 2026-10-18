import { z } from 'zod';
import { code, date, money, text } from './firestore-types';

const cents = money.refine(n => Math.abs(n * 100 - Math.round(n * 100)) < 0.0001, 'Usa importes con hasta dos decimales.');
const positiveCents = cents.refine(n=>n>0,'El importe debe ser positivo.');
const pending = z.object({ cardCode: code, documentNumber: text.min(1), date, dueDate: date, amount: positiveCents }).strict().refine(r => r.dueDate >= r.date, 'Vencimiento anterior al documento.');
export const openingBalancesSchema = z.object({
  version: z.literal(1),
  reference: code,
  date,
  accountFamily: z.enum(['compact', 'global']),
  balances: z.array(z.object({ accountCode: code, debit: cents, credit: cents }).strict()).min(2).max(160),
  receivables: z.array(pending).max(150),
  payables: z.array(pending).max(150),
  inventory: z.array(z.object({ itemCode: code, warehouseCode: code, quantity: money.positive(), unitCost: money, layers: z.array(z.object({ quantity: money.positive(), unitCost: money, date }).strict()).min(1).max(100).optional() }).strict()).max(150),
  banks: z.array(z.object({ bankAccountId: code, ledgerAccount: code, balance: cents }).strict()).max(30),
  assets: z.array(z.object({ assetCode: code, name: text.min(2), category: text.min(1), acquisitionDate: date, cost: positiveCents, residualValue: cents, usefulLifeMonths: z.number().int().min(1).max(1200), accumulatedDepreciation: cents }).strict()).max(100),
}).strict();
export type OpeningBalancesInput = z.infer<typeof openingBalancesSchema>;

export const openingControlMaps = {
  compact: { '1.1.03': '1.1.03', '2.1.01': '2.1.01', '1.1.05': '1.1.05', '1.1.07': '1.1.07', '1.2.01': '1.2.01', '1.2.02': '1.2.02' },
  global: { '1.1.03': '101020502', '2.1.01': '2010301', '1.1.05': '1010306', '1.1.07': '1010305', '1.2.01': '1020108', '1.2.02': '1020112' },
} as const;
