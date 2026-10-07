'use client';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import Link from 'next/link';
import { CompanyContext, useCompanyController } from '@/hooks/useCompany';
import { useAuth } from '@/context/AuthContext';
import { sendCommand, empresaActiva, cambiarEmpresaActiva, type EmpresaSlot } from '@/lib/firestore-company';
import { crearB1Center } from '@/lib/b1-center';
import { levelNames } from '@/lib/company-defaults';
import SAPDesktopShell from '@/components/desktop/SAPDesktopShell';
import { Busy, buttonClass, inputClass, Screen } from '@/components/sap-screens/SAPControls';

type Catalog = ComponentProps<typeof SAPDesktopShell>['catalog'];
export function extendCompanyCatalog(catalog: Catalog): Catalog {
  const modules = Object.fromEntries(Object.entries(catalog.modules).map(([key, module]) => [key, { ...module, screens: module.screens.map(screen => screen.id === 'SAL006' ? { ...screen, id: 'EC-CUSTOMERS' } : screen.id === 'PUR006' ? { ...screen, id: 'EC-VENDORS' } : screen) }]));
  modules.ecuador = { key: 'ecuador', name: 'Ecuador · SRI, nómina y cuentas', icon: '🇪🇨', screens: [{ id: 'EC-SRI', name: 'Comprobantes electrónicos' }, { id: 'EC-RETENTION', name: 'Retenciones' }, { id: 'EC-TAX', name: 'Formularios 103 / 104 y ATS' }, { id: 'EC-EMPLOYEE', name: 'Ficha de empleado' }, { id: 'EC-PAYROLL', name: 'Nómina y rol de pagos' }, { id: 'EC-ACCOUNTS', name: 'Plan de cuentas Ecuador' }, { id: 'RPT-VENTAS', name: 'Reporte de ventas' }] };
  return { modules, metadata: { total_modules: Object.keys(modules).length, total_screens: Object.values(modules).reduce((s, m) => s + m.screens.length, 0) } };
}
export default function CompanyWorkspace({ catalog, onExit }: { catalog: Catalog; onExit: () => void }) {
  const c = useCompanyController(); const { userProfile, currentUser } = useAuth(); const [creandoB1, setCreandoB1] = useState(''); const [companyName, setCompanyName] = useState('Mi empresa de práctica EC'); const [showMissions, setShowMissions] = useState(false);
  // Dos empresas por estudiante: su B1 Center (la del curso) y su empresa libre, con sus propios datos.
  const [slot, setSlot] = useState<EmpresaSlot>('curso');
  useEffect(() => { setSlot(empresaActiva()); }, []);
  const elegir = (s: EmpresaSlot) => { setSlot(s); cambiarEmpresaActiva(s); };
  const visited = useRef(''); const uid = c.data.profile?.uid;
  const refresh = c.refresh;
  useEffect(() => {
    if (!uid || visited.current === uid) return;
    visited.current = uid;
    void sendCommand(uid, { action: 'access', data: {} }).then(refresh).catch(() => { visited.current = ''; });
  }, [uid, refresh]);
  return <CompanyContext.Provider value={c}><div className="flex min-h-dvh flex-col bg-[#ECE9D8] font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222]">
    <div className="flex flex-wrap items-center gap-3 border-b border-[#999] bg-[#D4D0C8] p-2"><button className={buttonClass} disabled={c.saving} onClick={onExit}>Volver al campus</button><span role="group" aria-label="Empresa activa" className="flex overflow-hidden rounded border border-[#808080]">{(['curso', 'libre'] as const).map(s => <button key={s} type="button" aria-pressed={slot === s} disabled={c.saving} onClick={() => elegir(s)} className={`px-2 py-1 ${slot === s ? 'bg-[#0a246a] font-bold text-white' : 'bg-[#ECE9D8] hover:bg-white'}`}>{s === 'curso' ? 'B1 Center (curso)' : 'Mi empresa'}</button>)}</span><strong>{c.data.profile?.companyName ?? (slot === 'curso' ? 'B1 Center por crear' : 'Empresa por crear')}</strong>{c.data.profile && <span>{c.data.profile.xp} XP · Nivel {c.data.profile.level} · {levelNames[c.data.profile.level - 1]}</span>}{userProfile && ['teacher', 'docente'].includes(userProfile.role) && <Link href="/simulador/admin" className={buttonClass}>Panel docente</Link>}<button className={buttonClass} onClick={() => setShowMissions(v => !v)}>Misiones y XP</button>{(c.loading || c.saving) && <Busy />}</div>
    {c.error && <div role="alert" className="border border-red-400 bg-red-50 p-3 text-red-900">{c.error}<button className={buttonClass + ' ml-2'} onClick={() => { void c.refresh(); }}>Reintentar carga</button></div>}
    {c.notice && <p role="status" className="border border-green-500 bg-green-50 p-2 text-green-900">{c.notice}</p>}
    {showMissions && <div className="max-h-60 overflow-auto border border-[#999] bg-white p-3"><h2 className="font-bold">Misiones asignadas</h2>{!c.data.missions.length && <p>No tienes misiones asignadas.</p>}{c.data.missions.map(m => <div className="border-b p-2" key={m.id}><strong>{m.title}</strong><p>{m.description}</p><button disabled={c.saving || m.status === 'completed'} className={buttonClass} onClick={async () => { try { await c.save({ action: 'missionComplete', data: { id: m.id } }); } catch { /* Provider error. */ } }}>{m.status === 'completed' ? 'Completada' : 'Marcar entregada'}</button></div>)}<h2 className="mt-3 font-bold">Historial de XP verificado por operaciones</h2>{c.data.profile?.xpHistory.map(e => <p key={e.key}>{e.label}: +{e.points} XP</p>)}</div>}
    {!c.data.profile ? c.loading ? <div className="p-10"><Busy /></div> : slot === 'curso' ? <Screen title="Crear tu B1 Center"><div className="max-w-md space-y-3"><p>B1 Center es tu empresa del curso: la misma que usas en Mi Aula, con 5 clientes, 4 proveedores, 12 artículos, 2 bodegas y stock inicial de prueba.</p><button className={buttonClass} disabled={Boolean(creandoB1) || !currentUser} onClick={async () => { if (!currentUser) return; try { await crearB1Center(currentUser.uid, setCreandoB1); await c.refresh(); } catch { /* el error se muestra al recargar */ } finally { setCreandoB1(''); } }}>{creandoB1 || 'Crear mi B1 Center'}</button></div></Screen> : <Screen title="Crear tu empresa libre"><form className="max-w-md space-y-3" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'initialize', data: { companyName } }); } catch { /* Provider error. */ } }}><label className="block">Nombre de empresa <span className="text-red-700">*</span><input required minLength={2} className={inputClass} value={companyName} onChange={e => setCompanyName(e.target.value)} /></label><p>Se crean plan contable, almacenes y bancos ficticios. Escenario Ecuador 2026 (IVA 15 %, SBU $482) con parámetros editables en nómina.</p><button className={buttonClass} disabled={c.saving || Boolean(c.error)}>{c.saving ? <Busy /> : 'Crear empresa'}</button></form></Screen> : <div className="min-h-0 flex-1"><SAPDesktopShell catalog={extendCompanyCatalog(catalog)} /></div>}
  </div></CompanyContext.Provider>;
}
