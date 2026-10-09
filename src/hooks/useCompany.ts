'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { emptyCompany, type CompanyState, type SalesDocType, type PurchaseDocType, type SRITaxDocument } from '@/lib/firestore-types';
import { getCompany, sendCommand } from '@/lib/firestore-company';
import { trialBalance } from '@/lib/company-calculations';
import type { CompanyCommand, CommandData } from '@/lib/company-commands';

export function useCompanyController() {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;
  const [data, setData] = useState<CompanyState>(emptyCompany);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const serial = useRef(0); const locked = useRef(false);
  const refresh = useCallback(async () => {
    const request = ++serial.current;
    if (!uid) { setData(emptyCompany()); setLoading(false); return; }
    setLoading(true);
    try { const state = await getCompany(uid); if (request === serial.current) { setData(state); setError(''); } }
    catch (e: unknown) { if (request === serial.current) setError(e instanceof Error ? e.message : 'Error al cargar.'); }
    finally { if (request === serial.current) setLoading(false); }
  }, [uid]);
  useEffect(() => { const sequence = serial; setData(emptyCompany()); void refresh(); const changed = () => { void refresh(); }; window.addEventListener('finix-company-changed', changed); window.addEventListener('sap-company-changed', changed); return () => { sequence.current++; window.removeEventListener('finix-company-changed', changed); window.removeEventListener('sap-company-changed', changed); }; }, [refresh]);
  const save = async (command: CompanyCommand): Promise<string> => {
    if (!uid) throw new Error('Sesión requerida.'); if (locked.current) throw new Error('Hay una operación en curso.');
    locked.current = true; setSaving(true); setError(''); setNotice('');
    try { const result = await sendCommand(uid, command); setNotice(`Operación guardada: ${result}`); await refresh(); return result; }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error al guardar.'); throw e; }
    finally { locked.current = false; setSaving(false); }
  };
  return { data, loading, saving, error, notice, refresh, save };
}
export type CompanyContextValue = ReturnType<typeof useCompanyController>;
export const CompanyContext = createContext<CompanyContextValue | null>(null);
export function useCompany() { const value = useContext(CompanyContext); if (!value) throw new Error('Falta CompanyProvider.'); return value; }
export function useCompanyProfile() { const c = useCompany(); return { profile: c.data.profile, loading: c.loading, init: (companyName: string) => c.save({ action: 'initialize', data: { companyName } }) }; }
export function useSalesDocuments(docType?: SalesDocType) { const c = useCompany(); return { docs: c.data.salesOrders.filter(d => !docType || d.docType === docType), loading: c.loading, save: (data: CommandData<'sales'>) => c.save({ action: 'sales', data }), refresh: c.refresh }; }
export function usePurchaseDocuments(docType?: PurchaseDocType) { const c = useCompany(); return { docs: c.data.purchaseOrders.filter(d => !docType || d.docType === docType), loading: c.loading, save: (data: CommandData<'purchase'>) => c.save({ action: 'purchase', data }), refresh: c.refresh }; }
export function useCustomers() { const c = useCompany(); return { customers: c.data.customers, loading: c.loading, save: (data: CommandData<'customer'>) => c.save({ action: 'customer', data }), refresh: c.refresh }; }
export function useVendors() { const c = useCompany(); return { vendors: c.data.vendors, loading: c.loading, save: (data: CommandData<'vendor'>) => c.save({ action: 'vendor', data }), refresh: c.refresh }; }
export function useItems() { const c = useCompany(); return { items: c.data.items, loading: c.loading, save: (data: CommandData<'item'>) => c.save({ action: 'item', data }), updateStock: (data: CommandData<'stock'>) => c.save({ action: 'stock', data }), refresh: c.refresh }; }
export function useJournalEntries() { const c = useCompany(); return { entries: c.data.journalEntries, loading: c.loading, save: (data: CommandData<'journal'>) => c.save({ action: 'journal', data }), trialBalance: (from: string, to: string) => trialBalance(c.data.chartOfAccounts, c.data.journalEntries, from, to), refresh: c.refresh }; }
export function useBankAccounts() { const c = useCompany(); return { accounts: c.data.bankAccounts, transactions: c.data.bankTransactions, loading: c.loading, save: (data: CommandData<'bank'>) => c.save({ action: 'bank', data }) }; }
export function useEmployees() { const c = useCompany(); return { employees: c.data.employees, payrolls: c.data.payrollRuns, loading: c.loading, save: (data: CommandData<'employee'>) => c.save({ action: 'employee', data }) }; }
export function useSRIDocuments(docType?: SRITaxDocument['docType']) { const c = useCompany(); return { documents: c.data.sriDocuments.filter(d => !docType || d.docType === docType), loading: c.loading, save: (data: CommandData<'sri'>) => c.save({ action: 'sri', data }) }; }
