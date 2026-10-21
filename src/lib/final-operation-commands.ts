import {z} from 'zod';
import {code,date,money,text} from './firestore-types';

export const finalOperationCommands=[
 z.object({action:z.literal('vendorAdvance'),data:z.object({date,reference:code,vendorCode:code,bankAccountId:code,amount:money.positive()})}),
 z.object({action:z.literal('cardReceipt'),data:z.object({date,invoiceId:code,amount:money.positive()})}),
 z.object({action:z.literal('procurementQuotes'),data:z.object({requestId:code,vendorCodes:z.array(code).min(2).max(20),date})}),
 z.object({action:z.literal('costAdjustment'),data:z.object({series:code,date,accountCode:code,fromCenter:code,toCenter:code,amount:money.positive()})}),
 z.object({action:z.literal('cardSettlement'),data:z.object({date,reference:code,bankAccountId:code,amount:money.positive()})}),
 z.object({action:z.literal('vendorReconciliation'),data:z.object({date,vendorCode:code,invoiceId:code,paymentId:code,amount:money.positive()})}),
 z.object({action:z.literal('vendorAging'),data:z.object({date,vendorCode:code,ranges:z.array(z.number().int().positive()).length(3),showAdvances:z.boolean()}).refine(d=>d.ranges[0]<d.ranges[1]&&d.ranges[1]<d.ranges[2],'Los rangos deben ser crecientes.')}),
 z.object({action:z.literal('accountDetermination'),data:z.object({customerCode:code,itemGroup:text.min(1),incomeAccount:code,inventoryAccount:code,costAccount:code,receivableAccount:code,taxAccount:code})}),
 z.object({action:z.literal('accountingPreview'),data:z.object({customerCode:code,itemCode:code,quantity:money.positive(),price:money.positive(),warehouseCode:code,date})}),
] as const;
export type FinalOperationCommand=z.infer<typeof finalOperationCommands[number]>;
