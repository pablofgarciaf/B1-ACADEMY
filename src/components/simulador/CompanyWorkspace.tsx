'use client';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import Link from 'next/link';
import { CompanyContext, useCompanyController } from '@/hooks/useCompany';
import { useAuth } from '@/context/AuthContext';
import { sendCommand, empresaActiva, cambiarEmpresaActiva, LISTA_SIETE_EMPRESAS, type EmpresaSlot } from '@/lib/firestore-company';
import { crearB1Center } from '@/lib/b1-center';
import { levelNames } from '@/lib/company-defaults';
import FinixDesktopShell from '@/components/desktop/FinixDesktopShell';
import { Busy, buttonClass, inputClass, Screen } from '@/components/sap-screens/SAPControls';

type Catalog = ComponentProps<typeof FinixDesktopShell>['catalog'];
export function extendCompanyCatalog(catalog: Catalog): Catalog {
  const modules = Object.fromEntries(Object.entries(catalog.modules).map(([key, module]) => [key, { ...module, screens: module.screens.map(screen => screen.id === 'SAL006' ? { ...screen, id: 'EC-CUSTOMERS' } : screen.id === 'PUR006' ? { ...screen, id: 'EC-VENDORS' } : screen) }]));
  modules.ecuador = { key: 'ecuador', name: 'Ecuador · SRI, nómina y cuentas', icon: '🇪🇨', screens: [{ id: 'EC-SRI', name: 'Comprobantes electrónicos' }, { id: 'EC-RETENTION', name: 'Retenciones' }, { id: 'EC-TAX', name: 'Formularios 103 / 104 y ATS' }, { id: 'EC-EMPLOYEE', name: 'Ficha de empleado' }, { id: 'EC-PAYROLL', name: 'Nómina y rol de pagos' }, { id: 'EC-TAXCLOSE', name: 'Cierre tributario: utilidades, renta y anticipo' }, { id: 'EC-ISD', name: 'Pagos al exterior (ISD)' }, { id: 'EC-ACCOUNTS', name: 'Plan de cuentas Ecuador' }, { id: 'RPT-VENTAS', name: 'Reporte de ventas' }] };
  return { modules, metadata: { total_modules: Object.keys(modules).length, total_screens: Object.values(modules).reduce((s, m) => s + m.screens.length, 0) } };
}
export default function CompanyWorkspace({ catalog, onExit }: { catalog: Catalog; onExit: () => void }) {
  const c = useCompanyController();
  const { userProfile, currentUser } = useAuth();
  const [creandoB1, setCreandoB1] = useState('');
  const [slot, setSlot] = useState<EmpresaSlot>('curso');
  const [companyName, setCompanyName] = useState('B1 Center S.A.S. (Matriz)');
  const [showMissions, setShowMissions] = useState(false);

  useEffect(() => {
    const act = empresaActiva();
    setSlot(act);
    const def = LISTA_SIETE_EMPRESAS.find(e => e.id === act);
    if (def) setCompanyName(def.name);
  }, []);

  const elegir = (s: EmpresaSlot) => {
    setSlot(s);
    const def = LISTA_SIETE_EMPRESAS.find(e => e.id === s);
    if (def) setCompanyName(def.name);
    cambiarEmpresaActiva(s);
  };

  const visited = useRef('');
  const uid = c.data.profile?.uid;
  const refresh = c.refresh;

  useEffect(() => {
    if (!uid || visited.current === uid) return;
    visited.current = uid;
    void sendCommand(uid, { action: 'access', data: {} }).then(refresh).catch(() => { visited.current = ''; });
  }, [uid, refresh]);

  const empActual = LISTA_SIETE_EMPRESAS.find(e => e.id === slot) || LISTA_SIETE_EMPRESAS[0];

  return <CompanyContext.Provider value={c}><div className="flex min-h-dvh flex-col bg-[#ECE9D8] font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222]">
    <div className="flex flex-wrap items-center gap-3 border-b border-[#999] bg-[#D4D0C8] p-2">
      <button className={buttonClass} disabled={c.saving} onClick={onExit}>Volver al campus</button>
      <div className="flex items-center gap-1.5 bg-[#0a246a] text-white px-2 py-0.5 rounded border border-[#001133] shadow-sm">
        <span className="font-bold text-[10.5px] text-emerald-300">Sociedad ({slot}):</span>
        <select
          value={slot}
          disabled={c.saving}
          onChange={e => elegir(e.target.value)}
          className="bg-[#0e2c7a] text-white font-semibold text-[11px] rounded border border-blue-300/40 px-2 py-0.5 outline-none cursor-pointer"
        >
          {LISTA_SIETE_EMPRESAS.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.icon} {emp.shortName}
            </option>
          ))}
        </select>
      </div>
      <strong>{c.data.profile?.companyName ?? `${empActual.name} (Por inicializar)`}</strong>
      {c.data.profile && <span>{c.data.profile.xp} XP · Nivel {c.data.profile.level} · {levelNames[c.data.profile.level - 1]}</span>}
      {userProfile && ['teacher', 'docente'].includes(userProfile.role) && <Link href="/simulador/admin" className={buttonClass}>Panel docente</Link>}
      <button className={buttonClass} onClick={() => setShowMissions(v => !v)}>Misiones y XP</button>
      {(c.loading || c.saving) && <Busy />}
    </div>
    {c.error && <div role="alert" className="border border-red-400 bg-red-50 p-3 text-red-900">{c.error}<button className={buttonClass + ' ml-2'} onClick={() => { void c.refresh(); }}>Reintentar carga</button></div>}
    {c.notice && <p role="status" className="border border-green-500 bg-green-50 p-2 text-green-900">{c.notice}</p>}
    {showMissions && <div className="max-h-60 overflow-auto border border-[#999] bg-white p-3"><h2 className="font-bold">Misiones asignadas</h2>{!c.data.missions.length && <p>No tienes misiones asignadas.</p>}{c.data.missions.map(m => <div className="border-b p-2" key={m.id}><strong>{m.title}</strong><p>{m.description}</p><button disabled={c.saving || m.status === 'completed'} className={buttonClass} onClick={async () => { try { await c.save({ action: 'missionComplete', data: { id: m.id } }); } catch { /* Provider error. */ } }}>{m.status === 'completed' ? 'Completada' : 'Marcar entregada'}</button></div>)}<h2 className="mt-3 font-bold">Historial de XP verificado por operaciones</h2>{c.data.profile?.xpHistory.map(e => <p key={e.key}>{e.label}: +{e.points} XP</p>)}</div>}
    {!c.data.profile ? (
      c.loading ? (
        <div className="p-10"><Busy /></div>
      ) : (
        <Screen title={`Inicializar ${empActual.name}`}>
          <div className="max-w-xl space-y-4 bg-white p-5 border border-[#999] rounded shadow">
            <div className="border-b pb-3">
              <h2 className="text-sm font-bold text-[#0a246a] flex items-center gap-2">
                <span>{empActual.icon}</span>
                {empActual.name}
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Giro: <strong>{empActual.category}</strong>. Esta sociedad contará con su propia base de datos corporativa independiente, plan de cuentas NIIF Ecuador 2026, bodegas y bancos.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="font-semibold text-gray-700">Razón social de la sociedad</span>
                <input
                  required
                  minLength={2}
                  className={inputClass + ' mt-1'}
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                />
              </label>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  className={`${buttonClass} bg-gradient-to-b from-[#ffd25a] to-[#f0ab00] font-bold text-[#1d2d3e] px-4 py-2 rounded shadow`}
                  disabled={Boolean(creandoB1) || c.saving || !currentUser}
                  onClick={async () => {
                    if (!currentUser) return;
                    try {
                      await crearB1Center(currentUser.uid, setCreandoB1, companyName || empActual.name);
                      await c.refresh();
                    } catch {
                      /* error visible */
                    } finally {
                      setCreandoB1('');
                    }
                  }}
                >
                  {creandoB1 || 'Cargar con Datos Modelo y Apertura 2026'}
                </button>

                <button
                  type="button"
                  className={`${buttonClass} px-4 py-2 font-bold bg-slate-100 hover:bg-slate-200 border border-slate-400 rounded`}
                  disabled={c.saving || Boolean(c.error)}
                  onClick={async () => {
                    try {
                      await c.save({
                        action: 'initialize',
                        data: { companyName: companyName || empActual.name }
                      });
                    } catch {
                      /* Provider error */
                    }
                  }}
                >
                  {c.saving ? <Busy /> : 'Inicializar Vacía (Contabilidad Limpia en Vivo)'}
                </button>
              </div>
              <p className="text-[10px] text-gray-500">
                * Ambas opciones configuran el Plan de Cuentas NIIF Ecuador 2026, IVA al 15%, 4 cuentas bancarias locales, retenciones SRI y bodegas.
              </p>
            </div>
          </div>
        </Screen>
      )
    ) : (
      <div className="min-h-0 flex-1"><FinixDesktopShell catalog={extendCompanyCatalog(catalog)} /></div>
    )}
  </div></CompanyContext.Provider>;
}
