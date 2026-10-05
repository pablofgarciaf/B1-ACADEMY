import type { CompanyProfile, CompanyState } from './firestore-types';
import { financialSummary, round, trialBalance } from './company-calculations';

export function companyAlerts(state: CompanyState): string[] {
  return [
    ...state.journalEntries.filter(entry => round(entry.lines.reduce((sum, l) => sum + l.debit - l.credit, 0)) !== 0).map(e => `Asiento descuadrado ${e.entryNumber}`),
    ...[...state.salesOrders, ...state.purchaseOrders].filter(d => d.status === 'open').map(d => `Documento abierto ${d.docNumber}`),
    ...state.sriDocuments.filter(d => d.status === 'PENDIENTE').map(d => `SRI pendiente ${d.number}`),
    ...state.productionOrders.filter(d => d.status !== 'closed').map(d => `Producción pendiente ${d.orderNumber}`),
    ...state.missions.filter(d => d.status === 'assigned').map(d => `Misión pendiente: ${d.title}`),
  ];
}

export function companySummary(state: CompanyState, activityDate: string) {
  const entries = [...state.salesOrders, ...state.purchaseOrders, ...state.journalEntries, ...state.sriDocuments, ...state.payrollRuns];
  const balance = financialSummary(trialBalance(state.chartOfAccounts, state.journalEntries, '0000-00-00', '9999-12-31'));
  return {
    activityDate,
    documentsToday: entries.filter(d => new Date(d.createdAt).toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' }) === activityDate).length,
    pendingAlerts: companyAlerts(state).length,
    salesCycle: state.profile?.xpHistory.some(event => event.key === 'sales-cycle') ?? false,
    balanced: state.journalEntries.length > 0 && balance.difference === 0,
  };
}

export interface TeacherStudent extends Pick<CompanyProfile, 'uid' | 'email' | 'companyName' | 'xp' | 'level' | 'completedModules' | 'lastAccess' | 'documentCount'> { hasCompany: boolean; studentName: string; studentStatus: 'active' | 'suspended' | 'unknown'; pendingAlerts: number }
export interface TeacherPage {
  profiles: TeacherStudent[];
  total: number;
  filteredTotal: number;
  documentsToday: number;
  pendingAlerts: number;
  salesCycles: number;
  balancedCompanies: number;
  nextCursor: string | null;
}
