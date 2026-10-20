import { z } from 'zod';
import { code, customerSchema, vendorSchema, type CompanyState } from './firestore-types';

const editable = customerSchema.pick({ name: true, ruc: true, email: true, phone: true, address: true,
  city: true, contactName: true, paymentTermsDays: true, creditLimit: true, active: true, group: true, notes: true, ownerCode: true }).partial()
  .extend({ kind: z.enum(['customer', 'lead']).optional(), rimpe: vendorSchema.shape.rimpe.optional(),
    subjectToWithholding: vendorSchema.shape.subjectToWithholding.optional(), withholdingTax: vendorSchema.shape.withholdingTax.optional(),
    vatWithholdingGroup: vendorSchema.shape.vatWithholdingGroup.optional(), vatWithholdingCode: vendorSchema.shape.vatWithholdingCode.optional(),
    fiscalCategory: vendorSchema.shape.fiscalCategory.optional() }).strict();
export const partnerCommands = [
  z.object({ action: z.literal('partnerUpdate'), data: z.object({ partnerType: z.enum(['customer', 'vendor']), cardCode: code, changes: editable.refine(v => Object.keys(v).length > 0, 'No hay cambios para guardar.') }) }),
  z.object({ action: z.literal('partnerLink'), data: z.object({ customerCode: code, vendorCode: code }) }),
] as const;
export type PartnerCommand = z.infer<(typeof partnerCommands)[number]>;

/** Called only on the reducer's cloned state: a rejected edit cannot modify stored records. */
export function applyPartnerCommand(state: CompanyState, command: PartnerCommand, now: string): string {
  if (command.action === 'partnerLink') {
    const customer = state.customers.find(p => p.cardCode === command.data.customerCode);
    const vendor = state.vendors.find(p => p.cardCode === command.data.vendorCode);
    if (!customer || !vendor || !customer.active || !vendor.active) throw new Error('Selecciona un cliente y un proveedor activos de esta empresa.');
    if (state.profile?.usage !== 'training' && customer.ruc !== vendor.ruc) throw new Error('Cliente y proveedor deben tener la misma identificación para vincularse.');
    if ((customer.linkedVendorCode && customer.linkedVendorCode !== vendor.cardCode) || (vendor.linkedCustomerCode && vendor.linkedCustomerCode !== customer.cardCode)) throw new Error('La ficha ya está vinculada a otro socio.');
    customer.linkedVendorCode = vendor.cardCode; vendor.linkedCustomerCode = customer.cardCode;
    customer.updatedAt = now; vendor.updatedAt = now;
    return customer.id;
  }
  const { partnerType, cardCode, changes } = command.data;
  const collection = partnerType === 'customer' ? state.customers : state.vendors;
  const partner = collection.find(p => p.cardCode === cardCode);
  if (!partner) throw new Error('El socio seleccionado no pertenece a esta empresa.');
  if (partnerType === 'customer' && changes.rimpe !== undefined) throw new Error('El régimen de proveedor no corresponde a una ficha de cliente.');
  if (partnerType === 'vendor' && changes.kind !== undefined) throw new Error('El tipo cliente o lead no corresponde a una ficha de proveedor.');
  const documents = (partnerType === 'customer' ? state.salesOrders : state.purchaseOrders).filter(d => d.cardCode === cardCode);
  if (changes.ruc !== undefined && changes.ruc !== partner.ruc) {
    if (documents.length || partner.balance !== 0 || ('linkedVendorCode' in partner && partner.linkedVendorCode) || ('linkedCustomerCode' in partner && partner.linkedCustomerCode)) throw new Error('No cambies la identificación de una ficha con documentos, saldo o vínculo.');
    if (collection.some(p => p.cardCode !== cardCode && p.ruc === changes.ruc)) throw new Error('La identificación ya pertenece a otro socio.');
  }
  if (changes.active === false && partner.balance !== 0) throw new Error('El socio tiene saldo pendiente; liquídalo antes de desactivarlo.');
  if (changes.kind === 'lead' && documents.length) throw new Error('Un cliente con documentos no puede volver a ser lead.');
  if (partnerType === 'customer' && changes.ownerCode && !state.employees.some(employee => employee.employeeCode === changes.ownerCode && employee.active)) throw new Error('El propietario debe ser un empleado activo de esta empresa.');
  Object.assign(partner, changes, { updatedAt: now });
  return partner.id;
}
