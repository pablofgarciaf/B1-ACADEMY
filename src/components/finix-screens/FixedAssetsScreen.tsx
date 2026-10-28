'use client';

import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import { Screen, Field, inputClass, buttonClass } from './FinixControls';
import { ParaPensar } from './AnalysisBlocks';
import AssetLifecyclePanel from './AssetLifecyclePanel';
import {
  Building2,
  Calculator,
  RefreshCw,
  Paperclip,
  ArrowRight,
  FolderOpen,
  Eye,
  Trash2,
  FileSpreadsheet,
  Plus,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

/** Vidas útiles máximas para depreciación deducible (Reglamento LRTI Ecuador, art. 28). */
const CATEGORIAS = [
  { nombre: 'Inmuebles (excepto terrenos)', meses: 240, tasa: '5 %' },
  { nombre: 'Instalaciones, maquinaria, equipos y muebles', meses: 120, tasa: '10 %' },
  { nombre: 'Vehículos y equipo de transporte', meses: 60, tasa: '20 %' },
  { nombre: 'Equipos de cómputo', meses: 36, tasa: '33 %' },
  { nombre: 'Camiones de Reparto', meses: 36, tasa: '33 %' },
  { nombre: 'Equipos de cómputo y software', meses: 36, tasa: '33 %' },
];

const PAGO = [
  { code: '2.2.01', label: 'Préstamo a largo plazo (2.2.01)' },
  { code: '1.1.01', label: 'De contado (Caja/Bancos 1.1.01)' },
  { code: '2.1.01', label: 'Cuentas por pagar comerciales (2.1.01)' },
] as const;

export default function FixedAssetsScreen() {
  const c = useCompany();
  const [activeTab, setActiveTab] = useState<'general' | 'valores' | 'ciclo' | 'anexos'>('general');

  const [f, setF] = useState({
    name: '',
    category: CATEGORIAS[3].nombre,
    acquisitionDate: today(),
    cost: 1200,
    residualValue: 0,
    usefulLifeMonths: 36,
    paymentAccount: '2.2.01' as (typeof PAGO)[number]['code'],
    depreciationMethod: 'Lineal' as const,
    accountCode: '110500',
    depreciationArea: 'PCGA'
  });

  const [serialNumber, setSerialNumber] = useState('SN-DEV-2026-X01');
  const [location, setLocation] = useState('Oficina Central — Piso 3');
  const [employee, setEmployee] = useState('manager (Director IT)');
  const [periodo, setPeriodo] = useState(today().slice(0, 7));
  const [assetCode, setAssetCode] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const [attachments, setAttachments] = useState<Array<{ id: string; path: string; fileName: string; date: string; user: string }>>([
    { id: 'att-fa-1', path: 'C:\\SAP_Attachments\\ActivosFijos\\Facturas\\', fileName: 'factura_compra_laptop_dell.pdf', date: today(), user: 'manager' }
  ]);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

  const activos = c.data.fixedAssets;
  const totalCosto = round(activos.reduce((s, a) => s + a.cost, 0));
  const totalDep = round(activos.reduce((s, a) => s + a.accumulatedDepreciation, 0));
  const valorEnLibrosTotal = round(totalCosto - totalDep);

  const handleAddAttachment = () => {
    const fileName = prompt('Ingrese el nombre de la factura o acta de entrega del activo:', `Acta_Activo_${assetCode || 'Nuevo'}.pdf`);
    if (!fileName) return;
    setAttachments(prev => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        path: 'C:\\SAP_Attachments\\ActivosFijos\\',
        fileName,
        date: today(),
        user: 'manager'
      }
    ]);
  };

  const handleDeleteAttachment = () => {
    if (!selectedAttachment) {
      alert('Seleccione un anexo para borrar.');
      return;
    }
    setAttachments(prev => prev.filter(a => a.id !== selectedAttachment));
    setSelectedAttachment(null);
  };

  return (
    <Screen title="Gestión de activos fijos (Activos / Amortizaciones)">
      {/* Resumen Superior de Métricas de Activos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#f8fafc] p-3 rounded border border-[#cbd5e1]">
        <div>
          <span className="text-[11px] text-[#64748b] block">Total Activos Registrados</span>
          <span className="text-base font-bold font-mono text-[#1e293b]">{activos.length} activos</span>
        </div>
        <div>
          <span className="text-[11px] text-[#64748b] block">Costo Histórico de Adquisición</span>
          <span className="text-base font-bold font-mono text-[#0055A5]">{usd(totalCosto)}</span>
        </div>
        <div>
          <span className="text-[11px] text-[#64748b] block">Amortización Acumulada</span>
          <span className="text-base font-bold font-mono text-[#dc2626]">{usd(totalDep)}</span>
        </div>
        <div>
          <span className="text-[11px] text-[#64748b] block">Valor Contable Neto (VCN)</span>
          <span className="text-base font-bold font-mono text-[#16a34a]">{usd(valorEnLibrosTotal)}</span>
        </div>
      </div>

      {/* Selector de Pestañas Oficiales */}
      <div className="flex border-b border-[#cbd5e1] gap-1 bg-[#e2e8f0]/40 p-1 rounded-t">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'general'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <Building2 className="h-3 w-3" />
          Datos Maestros del Activo
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('valores')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'valores'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <Calculator className="h-3 w-3" />
          Valores y Amortización
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ciclo')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'ciclo'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <RefreshCw className="h-3 w-3" />
          Ciclo de Vida y Bajas
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('anexos')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'anexos'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <Paperclip className="h-3 w-3" />
          Anexos ({attachments.length})
        </button>
      </div>

      {/* TAB 1: DATOS MAESTROS DEL ACTIVO */}
      {activeTab === 'general' && (
        <form
          className="space-y-4 bg-white p-4 rounded border border-[#cbd5e1]"
          onSubmit={async e => {
            e.preventDefault();
            try {
              await c.save({
                action: 'fixedAsset',
                data: {
                  ...f,
                  assetCode: assetCode.trim() || undefined
                }
              });
              setF(v => ({ ...v, name: '' }));
              setAssetCode('');
            } catch {
              /* error visible */
            }
          }}
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
            Registro de Alta / Capitalización de Activo Fijo
          </h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Código de activo (vacío: automático)">
              <input
                className={inputClass}
                value={assetCode}
                onChange={e => setAssetCode(e.target.value)}
                placeholder="Ej.: AF-COMP-001"
              />
            </Field>
            <Field label="Descripción del Activo" required>
              <input
                required
                minLength={2}
                className={inputClass}
                value={f.name}
                onChange={e => setF(v => ({ ...v, name: e.target.value }))}
                placeholder="Ej.: Laptop Dell Latitude 5430"
              />
            </Field>
            <Field label="Clase de activo / Categoría SRI">
              <select
                className={inputClass}
                value={f.category}
                onChange={e => {
                  const cat = CATEGORIAS.find(x => x.nombre === e.target.value);
                  setF(v => ({
                    ...v,
                    category: e.target.value,
                    usefulLifeMonths: cat?.meses ?? v.usefulLifeMonths
                  }));
                }}
              >
                {CATEGORIAS.map(x => (
                  <option key={x.nombre} value={x.nombre}>
                    {x.nombre} · {x.meses / 12} años ({x.tasa})
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Fecha de Adquisición / Alta" required>
              <input
                type="date"
                required
                className={inputClass}
                value={f.acquisitionDate}
                onChange={e => setF(v => ({ ...v, acquisitionDate: e.target.value }))}
              />
            </Field>
            <Field label="Número de Serie / Placa">
              <input
                className={inputClass}
                value={serialNumber}
                onChange={e => setSerialNumber(e.target.value)}
              />
            </Field>
            <Field label="Ubicación Física">
              <input
                className={inputClass}
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </Field>

            <Field label="Empleado Responsable">
              <input
                className={inputClass}
                value={employee}
                onChange={e => setEmployee(e.target.value)}
              />
            </Field>
            <Field label="Forma de Financiamiento">
              <select
                className={inputClass}
                value={f.paymentAccount}
                onChange={e => setF(v => ({ ...v, paymentAccount: e.target.value as typeof f.paymentAccount }))}
              >
                {PAGO.map(p => (
                  <option key={p.code} value={p.code}>{p.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Estado Inicial">
              <input
                readOnly
                className={`${inputClass} bg-[#f8fafc] font-semibold text-[#16a34a]`}
                value="Activo (En servicio)"
              />
            </Field>
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-xs text-[#64748b]">
              El registro generará el asiento de capitalización (1.1.05.xx Activos contra cuenta de pago/pasivo).
            </span>
            <button
              type="submit"
              className={`${buttonClass} font-bold`}
              disabled={c.saving || !f.name}
            >
              Capitalizar y Registrar Activo
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: VALORES Y AMORTIZACIÓN */}
      {activeTab === 'valores' && (
        <div className="space-y-4 bg-white p-4 rounded border border-[#cbd5e1]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
            Parámetros Contables y Ejecución de Amortización Mensual
          </h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Costo de Adquisición ($)" required>
              <input
                type="number"
                min={0.01}
                step="0.01"
                required
                className={inputClass}
                value={f.cost}
                onChange={e => setF(v => ({ ...v, cost: Number(e.target.value) }))}
              />
            </Field>
            <Field label="Valor Residual / Salvamento ($)">
              <input
                type="number"
                min={0}
                step="0.01"
                className={inputClass}
                value={f.residualValue}
                onChange={e => setF(v => ({ ...v, residualValue: Number(e.target.value) }))}
              />
            </Field>
            <Field label="Vida Útil (Meses)">
              <input
                type="number"
                min={1}
                max={600}
                className={inputClass}
                value={f.usefulLifeMonths}
                onChange={e => setF(v => ({ ...v, usefulLifeMonths: Number(e.target.value) }))}
              />
            </Field>
            <Field label="Método de Amortización">
              <input
                readOnly
                className={`${inputClass} bg-[#f8fafc] font-semibold text-[#1e293b]`}
                value="Lineal (Línea Recta)"
              />
            </Field>

            <Field label="Área de Amortización">
              <input
                className={inputClass}
                value={f.depreciationArea}
                onChange={e => setF(v => ({ ...v, depreciationArea: e.target.value }))}
              />
            </Field>
            <Field label="Cuenta de Gasto Depreciación">
              <input
                className={inputClass}
                value={f.accountCode}
                onChange={e => setF(v => ({ ...v, accountCode: e.target.value }))}
              />
            </Field>
            <div className="sm:col-span-2 p-2.5 rounded bg-[#f1f5f9] border border-[#cbd5e1] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#64748b] block">Cuota Mensual Estimada</span>
                <span className="text-base font-bold font-mono text-[#0055A5]">
                  {usd(Math.max(0, (f.cost - f.residualValue) / Math.max(1, f.usefulLifeMonths)))} / mes
                </span>
              </div>
              <span className="text-[11px] text-[#64748b]">Tasa: {(100 / (f.usefulLifeMonths / 12)).toFixed(1)}% anual</span>
            </div>
          </div>

          {/* Ejecución de Depreciación del Período */}
          <div className="flex flex-wrap items-end gap-3 p-3 bg-[#f8fafc] rounded border border-[#cbd5e1]">
            <Field label="Período Fiscal a Depreciar">
              <input
                type="month"
                className={inputClass}
                value={periodo}
                onChange={e => setPeriodo(e.target.value)}
              />
            </Field>
            <button
              type="button"
              className={`${buttonClass} font-semibold`}
              disabled={c.saving || !activos.length}
              onClick={async () => {
                try {
                  await c.save({ action: 'depreciate', data: { period: periodo } });
                  alert(`Depreciación del período ${periodo} calculada y contabilizada exitosamente.`);
                } catch {
                  /* error visible */
                }
              }}
            >
              Calcular y Contabilizar Depreciación de Todos los Activos
            </button>
          </div>

          {/* Matriz de Activos Registrados y Valores en Libros */}
          <div className="overflow-x-auto border border-[#cbd5e1] rounded">
            <table className="min-w-full text-xs text-left border-collapse">
              <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
                <tr>
                  <th className="p-2">Código</th>
                  <th className="p-2">Activo</th>
                  <th className="p-2">Categoría</th>
                  <th className="p-2">Adquisición</th>
                  <th className="p-2 text-right">Costo ($)</th>
                  <th className="p-2 text-right">Dep. Acumulada ($)</th>
                  <th className="p-2 text-right">Valor en Libros ($)</th>
                  <th className="p-2 text-center">% Avance</th>
                  <th className="p-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {activos.map(a => {
                  const depreciable = a.cost - (a.residualValue ?? 0);
                  const avance = depreciable > 0 ? Math.round((a.accumulatedDepreciation / depreciable) * 100) : 100;
                  return (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedAsset(a.id)}
                      className={`hover:bg-[#f8fafc] cursor-pointer transition-colors ${selectedAsset === a.id ? 'bg-[#e0f2fe]' : ''}`}
                    >
                      <td className="p-2 font-mono font-semibold text-[#0055A5] flex items-center gap-1">
                        <span>{a.assetCode}</span>
                        <button
                          type="button"
                          title="Flecha dorada: Ver ficha de activo"
                          className="text-[#f59e0b] hover:text-[#d97706]"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                      <td className="p-2 font-medium text-[#1e293b]">{a.name}</td>
                      <td className="p-2 text-[#64748b]">{a.category}</td>
                      <td className="p-2 text-[#64748b]">{a.acquisitionDate}</td>
                      <td className="p-2 text-right font-mono font-semibold">{usd(a.cost)}</td>
                      <td className="p-2 text-right font-mono text-[#dc2626]">{usd(a.accumulatedDepreciation)}</td>
                      <td className="p-2 text-right font-mono font-bold text-[#16a34a]">{usd(a.cost - a.accumulatedDepreciation)}</td>
                      <td className="p-2 text-center font-mono">{avance}%</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          a.status === 'disposed' ? 'bg-[#fee2e2] text-[#b91c1c]' : a.status === 'active' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fef9c3] text-[#a16207]'
                        }`}>
                          {a.status === 'disposed' ? 'Baja' : a.status === 'active' ? 'En uso' : 'Totalmente depreciado'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CICLO DE VIDA Y BAJAS */}
      {activeTab === 'ciclo' && (
        <div className="space-y-4 bg-white p-4 rounded border border-[#cbd5e1]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
            Gestión de Retiros, Desincorporaciones y Ciclo de Vida
          </h4>
          <AssetLifecyclePanel />
        </div>
      )}

      {/* TAB 4: ANEXOS (Facturas y Garantías) */}
      {activeTab === 'anexos' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded border border-[#cbd5e1]">
          <div className="md:col-span-3 overflow-x-auto border border-[#cbd5e1] rounded">
            <table className="min-w-full text-xs text-left border-collapse">
              <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
                <tr>
                  <th className="p-2 w-10 text-center">#</th>
                  <th className="p-2">Ruta de Destino</th>
                  <th className="p-2">Nombre de Archivo</th>
                  <th className="p-2 w-28">Fecha Anexo</th>
                  <th className="p-2 w-28">Usuario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {attachments.map((att, i) => (
                  <tr
                    key={att.id}
                    onClick={() => setSelectedAttachment(att.id)}
                    className={`cursor-pointer transition-colors ${
                      selectedAttachment === att.id ? 'bg-[#e0f2fe] font-semibold' : 'hover:bg-[#f8fafc]'
                    }`}
                  >
                    <td className="p-2 text-center text-[#94a3b8]">{i + 1}</td>
                    <td className="p-2 text-[#64748b] font-mono text-[11px]">{att.path}</td>
                    <td className="p-2 text-[#0055A5] flex items-center gap-1.5">
                      <FileSpreadsheet className="h-3.5 w-3.5 text-[#0284c7]" />
                      {att.fileName}
                    </td>
                    <td className="p-2 text-[#64748b]">{att.date}</td>
                    <td className="p-2 text-[#64748b]">{att.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botones de acción lateral de Anexos */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleAddAttachment}
              className={`${buttonClass} flex items-center justify-center gap-1.5 w-full font-semibold`}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Explorar...
            </button>
            <button
              type="button"
              onClick={() => {
                if (!selectedAttachment) {
                  alert('Seleccione un anexo para visualizar.');
                  return;
                }
                const att = attachments.find(a => a.id === selectedAttachment);
                alert(`Visualizando anexo de activo fijo: ${att?.fileName}`);
              }}
              className={`${buttonClass} flex items-center justify-center gap-1.5 w-full`}
            >
              <Eye className="h-3.5 w-3.5" />
              Visualizar
            </button>
            <button
              type="button"
              onClick={handleDeleteAttachment}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-white text-[#ef4444] border border-[#fca5a5] hover:bg-[#fef2f2] flex items-center justify-center gap-1.5 w-full transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Borrar Anexo
            </button>
          </div>
        </div>
      )}

      <ParaPensar
        clave={`b1_activos_${c.data.profile?.uid ?? 'anon'}`}
        preguntas={[
          '¿Por qué comprar una laptop de $1.200 no reduce la utilidad del mes en $1.200? ¿Dónde aparece ese dinero en los estados financieros?',
          'Si deprecias más rápido de lo que permite el SRI, ¿qué pasa con el impuesto a la renta y con la conciliación tributaria?',
          'Un activo totalmente depreciado que sigue funcionando, ¿tiene valor para la empresa? ¿Lo reemplazarías?',
        ]}
      />
    </Screen>
  );
}
