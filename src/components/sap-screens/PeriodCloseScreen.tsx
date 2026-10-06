'use client';
import { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { today } from '@/lib/company-calculations';
import type { CompanyState } from '@/lib/firestore-types';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';
import { ParaPensar } from './AnalysisBlocks';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

/** Lista de verificación antes de cerrar un mes: lo que un contador revisa siempre. */
function verificacion(s: CompanyState, periodo: string) {
  const enPeriodo = (fecha: string) => fecha.startsWith(periodo);
  const sinConciliar = s.bankTransactions.filter(t => enPeriodo(t.date) && !t.reconciled).length;
  const sriPendiente = s.sriDocuments.filter(d => enPeriodo(d.date) && d.status === 'PENDIENTE').length;
  const produccion = s.productionOrders.filter(o => enPeriodo(o.date) && o.status !== 'closed').length;
  const activos = s.fixedAssets.filter(a => a.status === 'active' && a.acquisitionDate.slice(0, 7) <= periodo && !a.depreciatedPeriods.includes(periodo)).length;
  const autorizaciones = s.approvals.filter(a => a.status === 'pending' && enPeriodo(a.document.date)).length;
  const nomina = s.employees.some(e => e.active) && !s.payrollRuns.some(p => p.period === periodo);
  return [
    { ok: sinConciliar === 0, texto: 'Bancos conciliados', detalle: sinConciliar ? `${sinConciliar} movimiento(s) sin conciliar` : 'Todo conciliado' },
    { ok: sriPendiente === 0, texto: 'Comprobantes SRI autorizados', detalle: sriPendiente ? `${sriPendiente} comprobante(s) pendientes` : 'Sin pendientes' },
    { ok: activos === 0, texto: 'Depreciación del mes registrada', detalle: activos ? `${activos} activo(s) sin depreciar` : 'Al día' },
    { ok: !nomina, texto: 'Nómina del mes procesada', detalle: nomina ? 'Hay empleados activos y no hay rol de pagos' : 'Al día' },
    { ok: produccion === 0, texto: 'Órdenes de producción cerradas', detalle: produccion ? `${produccion} orden(es) abiertas` : 'Sin pendientes' },
    { ok: autorizaciones === 0, texto: 'Autorizaciones resueltas', detalle: autorizaciones ? `${autorizaciones} documento(s) esperando aprobación` : 'Sin pendientes' },
  ];
}

/** Cierres fiscales (FIN008): cerrar meses, reabrirlos y cerrar el ejercicio. */
export default function PeriodCloseScreen() {
  const c = useCompany();
  const [year, setYear] = useState(today().slice(0, 4));
  const [mes, setMes] = useState(today().slice(0, 7));
  const cerrados = new Set(c.data.profile?.closedPeriods ?? []);
  const checks = useMemo(() => verificacion(c.data, mes), [c.data, mes]);
  const anioCerrado = c.data.journalEntries.some(e => e.source === 'closing' && e.reference === year);
  const accion = async (period: string, closed: boolean) => { try { await c.save({ action: 'closePeriod', data: { period, closed } }); } catch { /* error visible */ } };
  const cerrarAnio = async () => {
    if (!window.confirm(`Se registrará el asiento de cierre del ejercicio ${year} y se cerrarán los 12 meses. ¿Continuar?`)) return;
    try { await c.save({ action: 'closeYear', data: { year } }); } catch { /* error visible */ }
  };

  return (
    <Screen title="Cierres fiscales">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        Cerrar un período protege la información ya reportada: nadie puede registrar asientos con fecha de un mes cerrado.
        Antes de cerrar, revisa la lista de verificación. El cierre anual traslada la utilidad a <strong>Resultados acumulados (3.02)</strong>.
      </p>
      <section className="space-y-2 border border-[#999] bg-white p-2">
        <h3 className="font-bold text-[#003366]">Lista de verificación previa al cierre</h3>
        <div className="max-w-xs"><Field label="Mes a revisar"><input type="month" className={inputClass} value={mes} onChange={e => setMes(e.target.value)} /></Field></div>
        <ul className="space-y-1">
          {checks.map(k => <li key={k.texto}><span aria-hidden="true">{k.ok ? '✅' : '⚠️'}</span> <strong>{k.texto}:</strong> {k.detalle}</li>)}
        </ul>
        <button type="button" className={`${buttonClass} font-bold`} disabled={c.saving || cerrados.has(mes)} onClick={() => accion(mes, true)}>
          {checks.every(k => k.ok) ? 'Cerrar este mes' : 'Cerrar este mes de todas formas'}
        </button>
      </section>

      <div className="max-w-xs"><Field label="Ejercicio"><input type="number" min={2020} max={2099} className={inputClass} value={year} onChange={e => setYear(e.target.value)} /></Field></div>
      <Table headers={['Período', 'Estado', 'Acción']} rows={MESES.map((m, i) => {
        const p = `${year}-${String(i + 1).padStart(2, '0')}`;
        const cerrado = cerrados.has(p);
        return [`${m} ${year}`, <strong key="e" className={cerrado ? 'text-[#c62828]' : 'text-[#2e7d32]'}>{cerrado ? '🔒 Cerrado' : 'Abierto'}</strong>,
          <button key="a" type="button" className={buttonClass} disabled={c.saving || anioCerrado} onClick={() => accion(p, !cerrado)}>{cerrado ? 'Reabrir' : 'Cerrar'}</button>];
      })} />
      <section className="space-y-1 border border-[#999] bg-white p-2">
        <h3 className="font-bold text-[#003366]">Cierre del ejercicio {year}</h3>
        {anioCerrado
          ? <p>✅ El ejercicio {year} ya está cerrado: su resultado está en Resultados acumulados.</p>
          : <><p>Salda las cuentas de ingresos, costos y gastos del año contra Resultados acumulados y cierra los 12 meses.</p>
            <button type="button" className={`${buttonClass} font-bold`} disabled={c.saving} onClick={cerrarAnio}>Cerrar ejercicio {year}</button></>}
      </section>
      <ParaPensar clave={`b1_cierre_${c.data.profile?.uid ?? 'anon'}_${year}`} preguntas={[
        '¿Por qué es peligroso que se puedan registrar facturas en un mes cuyos estados financieros ya se presentaron al banco o al SRI?',
        'Si descubres un error en un mes cerrado, ¿lo corriges reabriendo el mes o con un ajuste en el mes actual? ¿Qué es más transparente?',
        '¿Quién debería tener permiso para reabrir un período y por qué?',
      ]} />
    </Screen>
  );
}
