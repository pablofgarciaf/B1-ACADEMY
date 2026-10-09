'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { financialSummary, today, trialBalance, usd } from '@/lib/company-calculations';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';

const cleanZero = (val: number): number => (Math.abs(val) < 0.005 ? 0 : val);
const formatMoney = (val: number): string => usd(cleanZero(val));

export default function FinancialStatementsScreen() {
  const c = useCompany();
  const [tab, setTab] = useState(0);
  const [from, setFrom] = useState(today().slice(0, 4) + '-01-01');
  const [to, setTo] = useState(today());

  const rows = trialBalance(c.data.chartOfAccounts, c.data.journalEntries, from, to);
  const balance = financialSummary(rows, c.data.profile?.incomeTaxRate);
  const period = financialSummary(
    rows.map(r => ({ ...r, closing: r.debit - r.credit })),
    c.data.profile?.incomeTaxRate
  );

  const operatingRevenue = cleanZero(
    -rows.filter(r => r.accountCode === '4.01').reduce((sum, r) => sum + r.debit - r.credit, 0)
  );
  const otherRevenue = cleanZero(
    -rows.filter(r => r.accountCode === '4.02').reduce((sum, r) => sum + r.debit - r.credit, 0)
  );
  const group = (prefix: string) =>
    cleanZero(rows.filter(r => r.accountCode.startsWith(prefix)).reduce((s, r) => s + r.closing, 0));

  const grossProfit = cleanZero(operatingRevenue - period.cost);
  const operatingProfit = cleanZero(grossProfit - period.expenses);
  const profitBeforeTax = cleanZero(period.profit);
  const isLoss = profitBeforeTax < 0;
  const netResult = isLoss ? profitBeforeTax : cleanZero(period.net);

  return (
    <Screen title="Estados Financieros Oficiales (NIIF / SRI)">
      <div className="space-y-3">
        {/* Pestañas de Navegación de Estados Financieros */}
        <div className="flex gap-2 border-b border-gray-300 pb-2">
          {['Balance General', 'Estado de Resultados (P&G)', 'Balance de Comprobación'].map((label, i) => (
            <button
              className={`${buttonClass} ${tab === i ? 'bg-[#003366] text-white font-bold' : ''}`}
              key={label}
              aria-pressed={tab === i}
              onClick={() => setTab(i)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filtros de Rango de Fechas */}
        <div className="grid gap-3 sm:grid-cols-2 bg-gray-50 p-2.5 rounded border border-gray-200">
          <Field label="Fecha Desde (Inicio Periodo)">
            <input type="date" className={inputClass} value={from} onChange={e => setFrom(e.target.value)} />
          </Field>
          <Field label="Fecha Hasta (Corte)">
            <input type="date" className={inputClass} value={to} onChange={e => setTo(e.target.value)} />
          </Field>
        </div>

        {tab === 0 ? (
          <>
            <Table
              headers={['Estructura de Balance General (NIIF)', 'Valor USD']}
              rows={[
                ['1.1 Activo Corriente (Caja, Bancos, Clientes, Inventarios)', formatMoney(group('1.1.'))],
                ['1.2 Activo No Corriente (Propiedad, Planta y Equipos)', formatMoney(group('1.2.'))],
                ['TOTAL ACTIVO', formatMoney(balance.assets)],
                ['2.1 Pasivo Corriente (Proveedores, IESS, Retenciones SRI)', formatMoney(-group('2.1.'))],
                ['2.2 Pasivo No Corriente (Préstamos a largo plazo)', formatMoney(-group('2.2.'))],
                ['TOTAL PASIVO', formatMoney(balance.liabilities)],
                ['3.0 Patrimonio Neto (Capital Social y Reservas)', formatMoney(balance.equity)],
                ['Resultados del Ejercicio (Ganancia / Pérdida)', formatMoney(balance.profit)],
                ['TOTAL PASIVO + PATRIMONIO + RESULTADOS', formatMoney(balance.liabilities + balance.equity + balance.profit)],
              ]}
            />
            <div className={`p-2 rounded text-xs font-bold ${balance.difference === 0 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-900 border border-red-300'}`}>
              {balance.difference === 0 ? '✓ Balance General Cuadrado (Activo = Pasivo + Patrimonio)' : `⚠️ Descuadre Contable detectado: ${formatMoney(balance.difference)}`}
            </div>
          </>
        ) : tab === 1 ? (
          <>
            <Table
              headers={['Estado de Resultados Integral (P&G)', 'Valor USD']}
              rows={[
                ['(+) Ingresos Operacionales (Ventas de Mercaderías / Servicios)', formatMoney(operatingRevenue)],
                ['(-) Costo de Ventas (Costo de Mercaderías Vendidas)', formatMoney(period.cost)],
                ['(=) UTILIDAD BRUTA EN VENTAS', formatMoney(grossProfit)],
                ['(-) Gastos Operacionales (Administración, Nómina y Ventas)', formatMoney(period.expenses)],
                ['(=) UTILIDAD OPERACIONAL', formatMoney(operatingProfit)],
                ['(+) Otros Ingresos (Financieros, Rendimientos o Ajustes)', formatMoney(otherRevenue)],
                ['(=) RESULTADO ANTES DE IMPUESTO A LA RENTA', formatMoney(profitBeforeTax)],
                [`(-) Impuesto a la Renta Estimado (${c.data.profile?.incomeTaxRate ?? 25}%)`, isLoss ? '$0,00' : formatMoney(period.tax)],
                [isLoss ? '(=) PÉRDIDA NETA DEL PERÍODO' : '(=) UTILIDAD NETA ESTIMADA DEL PERÍODO', formatMoney(netResult)],
              ]}
            />
            <p className="text-[11px] text-gray-500 italic mt-1">
              * Nota: Escenario fiscal Ecuador 2026. Si el resultado antes de impuestos es negativo o cero, el IR estimado es $0.00.
            </p>
          </>
        ) : (
          <>
            <Table
              headers={['Código', 'Nombre de Cuenta Contable', 'Saldo Inicial', 'Total Débitos', 'Total Créditos', 'Saldo Final']}
              rows={rows.map(r => [
                r.accountCode,
                r.name,
                formatMoney(r.opening),
                formatMoney(r.debit),
                formatMoney(r.credit),
                formatMoney(r.closing),
              ])}
            />
            <div className="flex justify-between items-center text-xs font-bold px-2 py-1 bg-gray-100 rounded border border-gray-300">
              <span>Total Débitos: {formatMoney(rows.reduce((s, r) => s + r.debit, 0))}</span>
              <span>Total Créditos: {formatMoney(rows.reduce((s, r) => s + r.credit, 0))}</span>
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}
