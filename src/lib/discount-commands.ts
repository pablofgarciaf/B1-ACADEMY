import { z } from 'zod';
import { code,date,text,money } from './firestore-types';
const validity={validFrom:date,validTo:date};
export const discountCommands=[
 z.object({action:z.literal('discountGroup'),data:z.object({code,description:text.min(2),...validity,active:z.boolean()}).refine(d=>d.validTo>=d.validFrom,'Vigencia inválida.')}),
 z.object({action:z.literal('discountGroupRule'),data:z.object({groupCode:code,itemGroup:text.min(1),itemCode:code,discount:money.max(100),paidQuantity:money.default(0),freeQuantity:money.default(0),maxFree:money.default(0),kind:z.enum(['percent','free']),description:text.default('')}).refine(d=>d.kind!=='free'||d.paidQuantity>0&&d.freeQuantity>0&&d.maxFree>0,'Define cantidades pagadas, gratuitas y máximo mayores a cero.')}),
 z.object({action:z.literal('customerDiscountGroup'),data:z.object({cardCode:code,customerGroup:text.min(1),groupCode:code,list:z.number().int().min(1).max(60),excluded:z.boolean()})}),
 z.object({action:z.literal('copyVolumeDiscounts'),data:z.object({list:z.number().int().min(1).max(60),sourceItemCode:code,targetItemCodes:z.array(code).min(1).max(100),filter:z.literal('Grupo de unidades de medida'),overwrite:z.boolean()})}),
 z.object({action:z.literal('specialPriceBatch'),data:z.object({group:text.min(1),percent:z.number().min(-100).max(100),...validity}).refine(d=>d.validTo>=d.validFrom,'Vigencia inválida.')}),
 z.object({action:z.literal('copySpecialPrices'),data:z.object({sourceCardCode:code,itemCode:code,targetCardCodes:z.array(code).min(1).max(100),replaceExisting:z.boolean()})})
] as const;
export type DiscountCommand=z.infer<typeof discountCommands[number]>;
