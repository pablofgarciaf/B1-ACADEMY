/** Shared namespace for reads, writes and audit. Invalid slots never fall back to the course. */
export const PRIVATE_COMPANY_SLOT = 'privado';
export function companyScope(uid: string, slot = 'curso', privateAccountingEnabled = false): string {
  if (!/^[\w-]{1,128}$/.test(uid) || !/^[a-zA-Z0-9_-]{1,32}$/.test(slot)) throw new Error('Empresa inválida.');
  if (slot === PRIVATE_COMPANY_SLOT && !privateAccountingEnabled) throw new Error('La empresa privada requiere habilitación del propietario.');
  return slot === 'curso' ? uid : `${uid}__${slot}`;
}
export function isPrivateCompany(uid: string) { return uid.endsWith(`__${PRIVATE_COMPANY_SLOT}`); }
