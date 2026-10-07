'use client';

import { auth } from './firebase';
import type { CompanyCommand, CommandData } from './company-commands';
import type { CompanyState, SalesDocType, PurchaseDocType, CostingMethod, SRITaxDocument } from './firestore-types';
import { trialBalance } from './company-calculations';

/**
 * Cada estudiante tiene dos empresas: "curso" (su B1 Center, la de Mi Aula) y "libre" (la suya, para practicar
 * con sus propios datos en el Simulador). El servidor decide la empresa real a partir de la sesión; aquí solo
 * se indica cuál se quiere usar. Mi Aula siempre trabaja en "curso".
 */
export type EmpresaSlot = 'curso' | 'libre';
const CLAVE_EMPRESA = 'b1_empresa_activa';
export function empresaActiva(): EmpresaSlot {
  try { return localStorage.getItem(CLAVE_EMPRESA) === 'libre' ? 'libre' : 'curso'; } catch { return 'curso'; }
}
export function cambiarEmpresaActiva(slot: EmpresaSlot) {
  try { localStorage.setItem(CLAVE_EMPRESA, slot); } catch { /* sin almacenamiento: se usa B1 Center */ }
  window.dispatchEvent(new Event('sap-company-changed'));
}
// Fuerza la empresa del curso mientras se ejecuta Mi Aula (ver usarEmpresaCurso).
let forzarCurso = 0;
export function usarEmpresaCurso(): () => void { forzarCurso++; return () => { forzarCurso = Math.max(0, forzarCurso - 1); }; }
const slotActual = (): EmpresaSlot => (forzarCurso > 0 ? 'curso' : empresaActiva());

export async function companyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Inicia sesión en la academia.');
    const token = await user.getIdToken();
    const response = await fetch(path, { ...init, cache: 'no-store', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Empresa': slotActual(), ...init?.headers } });
    const data: unknown = await response.json();
    if (!response.ok) throw new Error(typeof data === 'object' && data && 'error' in data ? String(data.error) : 'Operación fallida.');
    return data as T;
  } catch (error: unknown) { throw error instanceof Error ? error : new Error('Error de conexión.'); }
}
export async function getCompany(uid: string): Promise<CompanyState> { return companyFetch<CompanyState>(`/api/sap/company?uid=${encodeURIComponent(uid)}`); }
export async function sendCommand(uid: string, command: CompanyCommand, requestId = crypto.randomUUID()): Promise<string> {
  if (auth.currentUser?.uid !== uid) throw new Error('No puedes modificar otra empresa.');
  // Same request ID on the single network retry; the server stores its result atomically.
  const body = JSON.stringify({ requestId, command });
  let response: { result: string };
  try { response = await companyFetch<{ result: string }>('/api/sap/company', { method: 'POST', body }); }
  catch (error: unknown) { if (!(error instanceof TypeError)) throw error; response = await companyFetch<{ result: string }>('/api/sap/company', { method: 'POST', body }); }
  window.dispatchEvent(new Event('sap-company-changed'));
  return response.result;
}
export async function initializeCompany(uid: string, email: string, companyName: string): Promise<void> { if (auth.currentUser?.email !== email) throw new Error('Correo incompatible con la sesión.'); await sendCommand(uid, { action: 'initialize', data: { companyName } }); }
export const saveSalesDocument = async (uid: string, data: CommandData<'sales'>): Promise<string> => sendCommand(uid, { action: 'sales', data });
export const getSalesDocuments = async (uid: string, docType?: SalesDocType) => (await getCompany(uid)).salesOrders.filter(d => !docType || d.docType === docType);
export const savePurchaseDocument = async (uid: string, data: CommandData<'purchase'>): Promise<string> => sendCommand(uid, { action: 'purchase', data });
export const getPurchaseDocuments = async (uid: string, docType?: PurchaseDocType) => (await getCompany(uid)).purchaseOrders.filter(d => !docType || d.docType === docType);
export const saveCustomer = async (uid: string, data: CommandData<'customer'>): Promise<string> => sendCommand(uid, { action: 'customer', data });
export const getCustomers = async (uid: string) => (await getCompany(uid)).customers;
export const saveVendor = async (uid: string, data: CommandData<'vendor'>): Promise<string> => sendCommand(uid, { action: 'vendor', data });
export const getVendors = async (uid: string) => (await getCompany(uid)).vendors;
export const saveItem = async (uid: string, data: CommandData<'item'>): Promise<string> => sendCommand(uid, { action: 'item', data });
export const getItems = async (uid: string) => (await getCompany(uid)).items;
export const updateStock = async (uid: string, itemCode: string, warehouseCode: string, qty: number, costingMethod: CostingMethod): Promise<void> => { await sendCommand(uid, { action: 'stock', data: { itemCode, warehouseCode, qty, costingMethod } }); };
export const getStock = async (uid: string, itemCode?: string) => (await getCompany(uid)).warehouseStock.filter(s => !itemCode || s.itemCode === itemCode);
export const saveJournalEntry = async (uid: string, data: CommandData<'journal'>): Promise<string> => sendCommand(uid, { action: 'journal', data });
export const getJournalEntries = async (uid: string, dateFrom = '0000-00-00', dateTo = '9999-12-31') => (await getCompany(uid)).journalEntries.filter(e => e.date >= dateFrom && e.date <= dateTo);
export const getTrialBalance = async (uid: string, dateFrom: string, dateTo: string) => { const s = await getCompany(uid); return trialBalance(s.chartOfAccounts, s.journalEntries, dateFrom, dateTo); };
export const saveBankTransaction = async (uid: string, data: CommandData<'bank'>): Promise<string> => sendCommand(uid, { action: 'bank', data });
export const getBankTransactions = async (uid: string, bankAccountId?: string) => (await getCompany(uid)).bankTransactions.filter(t => !bankAccountId || t.bankAccountId === bankAccountId);
export const saveEmployee = async (uid: string, data: CommandData<'employee'>): Promise<string> => sendCommand(uid, { action: 'employee', data });
export const getEmployees = async (uid: string) => (await getCompany(uid)).employees;
export const savePayrollRun = async (uid: string, data: CommandData<'payroll'>): Promise<string> => sendCommand(uid, { action: 'payroll', data });
export const saveSRIDocument = async (uid: string, data: CommandData<'sri'>): Promise<string> => sendCommand(uid, { action: 'sri', data });
export const getSRIDocuments = async (uid: string, docType?: SRITaxDocument['docType']) => (await getCompany(uid)).sriDocuments.filter(d => !docType || d.docType === docType);
export const saveProductionOrder = async (uid: string, data: CommandData<'production'>): Promise<string> => sendCommand(uid, { action: 'production', data });
export const saveBOM = async (uid: string, data: CommandData<'bom'>): Promise<string> => sendCommand(uid, { action: 'bom', data });
