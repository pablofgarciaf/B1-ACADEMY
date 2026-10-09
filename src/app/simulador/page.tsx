'use client';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { getCompany } from '@/lib/firestore-company';
import type { CompanyState } from '@/lib/firestore-types';
import SimuladorLogin from '@/components/simulador/SimuladorLogin';
import SimuladorDashboard from '@/components/simulador/SimuladorDashboard';
import CompanyWorkspace from '@/components/simulador/CompanyWorkspace';
import FinixLoginScreen from '@/components/sap-screens/FinixLoginScreen';
import { Busy, buttonClass } from '@/components/sap-screens/FinixControls';
import { useAuth } from '@/context/AuthContext';
const catalogSchema = z.object({ modules: z.record(z.object({ key: z.string(), name: z.string(), icon: z.string(), screens: z.array(z.object({ id: z.string(), name: z.string() })) })), metadata: z.object({ total_screens: z.number(), total_modules: z.number() }) });
export default function SimuladorPage() {
  const { userProfile, currentUser, loading, logout, login } = useAuth();
  const [company, setCompany] = useState<CompanyState | null>(null);
  const [companyError, setCompanyError] = useState('');
  const [showSimulator, setShowSimulator] = useState(false); const [sapLoggedIn, setSapLoggedIn] = useState(false);
  const [catalog, setCatalog] = useState<z.infer<typeof catalogSchema> | null>(null);
  const [error, setError] = useState<string | null>(null); const [loginLoading, setLoginLoading] = useState(false); const [catalogAttempt, setCatalogAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try { setError(null); const response = await fetch('/sap_ui_catalog.json', { signal: controller.signal }); if (!response.ok) throw new Error('No se pudo cargar el catálogo SAP.'); const data: unknown = await response.json(); setCatalog(catalogSchema.parse(data)); }
      catch (e: unknown) { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Error al cargar el catálogo.'); }
    }
    void load(); return () => controller.abort();
  }, [catalogAttempt]);
  useEffect(() => { setSapLoggedIn(false); setShowSimulator(false); }, [currentUser?.uid]);
  useEffect(() => {
    let active = true; setCompany(null); setCompanyError('');
    if (currentUser && !showSimulator) void getCompany(currentUser.uid).then(value => { if (active) setCompany(value); }).catch((e: unknown) => { if (active) setCompanyError(e instanceof Error ? e.message : 'No se pudo cargar el progreso.'); });
    return () => { active = false; };
  }, [currentUser, showSimulator]);
  const handleLogin = async (email: string, password: string) => { setLoginLoading(true); setError(null); try { const result = await login(email, password); if (!result.success) setError(result.error ?? 'No se pudo iniciar sesión.'); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error de acceso.'); } finally { setLoginLoading(false); } };
  const handleLogout = async () => { try { sessionStorage.removeItem('sap_session_active'); sessionStorage.removeItem('sap_session_user'); } catch { /* Auth still signs out if browser storage is blocked. */ } await logout(); setShowSimulator(false); setSapLoggedIn(false); };
  useEffect(() => { if (!currentUser) return; try { const previous = sessionStorage.getItem('sap_session_user'); if (previous !== currentUser.uid) sessionStorage.removeItem('sap_session_active'); sessionStorage.setItem('sap_session_user', currentUser.uid); } catch { /* SAPLoginScreen reports blocked storage. */ } }, [currentUser]);
  if (loading) return <div className="p-10"><Busy /></div>;
  if (!userProfile) return <SimuladorLogin onLogin={handleLogin} isLoading={loginLoading} error={error} />;
  if (!showSimulator) return <>{companyError && <p role="alert" className="bg-amber-50 p-3 text-amber-900">{companyError}</p>}<SimuladorDashboard user={{ displayName: userProfile.displayName || 'Estudiante', email: userProfile.email, avatar: userProfile.avatar, company: company?.profile?.companyName || userProfile.company, level: company?.profile?.level || 1, xp: company?.profile?.xp || 0, totalMissions: Math.max(1, company?.missions.length || 0), completedMissions: company?.missions.filter(m => m.status === 'completed').length || 0 }} onStartSimulator={() => setShowSimulator(true)} onLogout={handleLogout} /></>;
  if (!sapLoggedIn) return <FinixLoginScreen userEmail={userProfile.email} onLoginSuccess={() => setSapLoggedIn(true)} />;
  if (!catalog) return <div className="p-10">{error ? <><p role="alert">{error}</p><button className={buttonClass} onClick={() => setCatalogAttempt(n => n + 1)}>Reintentar</button></> : <Busy />}</div>;
  return <CompanyWorkspace key={currentUser?.uid} catalog={catalog} onExit={() => setShowSimulator(false)} />;
}
