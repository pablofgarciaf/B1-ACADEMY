'use client';

import React, { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import { Screen, Field, inputClass, buttonClass } from './FinixControls';
import { ParaPensar } from './AnalysisBlocks';
import {
  ClipboardCheck,
  Sliders,
  History,
  Paperclip,
  ArrowRight,
  FolderOpen,
  Eye,
  Trash2,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Lock
} from 'lucide-react';

/** Conteo físico de inventario (INV003 / OINC): conteo ciego, ajuste automático, tolerancias y mermas. */
export default function InventoryCountScreen() {
  const c = useCompany();
  const almacenes = c.data.profile?.warehouses ?? [{ code: '01', name: 'Bodega Principal' }];
  const [almacen, setAlmacen] = useState(almacenes[0]?.code ?? '01');
  const [fecha, setFecha] = useState(today());
  const [hora, setHora] = useState('08:30');
  const [countingType, setCountingType] = useState<'single' | 'multiple'>('single');
  const [mainCounter, setMainCounter] = useState('manager (Auditor Interno)');
  const [ciego, setCiego] = useState(true);
  const [activeTab, setActiveTab] = useState<'articulos' | 'parametros' | 'historial' | 'anexos'>('articulos');

  const [contado, setContado] = useState<Record<string, string>>({});
  const [ubicacion, setUbicacion] = useState<Record<string, string>>({});
  const [contador, setContador] = useState<Record<string, string>>({});
  const [fijado, setFijado] = useState<Record<string, boolean>>({});
  const [ajustes, setAjustes] = useState(() => c.data.profile?.inventorySettings ?? []);

  const [attachments, setAttachments] = useState<Array<{ id: string; path: string; fileName: string; date: string; user: string }>>([
    { id: 'att-inc-1', path: 'C:\\SAP_Attachments\\Inventarios\\Recuentos\\', fileName: 'acta_toma_fisica_firmada.pdf', date: today(), user: 'manager' }
  ]);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

  const filas = useMemo(() => c.data.items.filter(i => i.active && i.type === 'inventory').map(i => {
    const s = c.data.warehouseStock.find(w => w.itemCode === i.itemCode && w.warehouseCode === almacen);
    return {
      itemCode: i.itemCode,
      nombre: i.name,
      sistema: s?.quantity ?? 0,
      costo: s?.averageCost || i.purchasePrice || 0
    };
  }), [c.data, almacen]);

  const lineas = filas
    .filter(f => contado[f.itemCode] !== undefined && contado[f.itemCode] !== '')
    .map(f => ({
      itemCode: f.itemCode,
      countedQuantity: Number(contado[f.itemCode]),
      location: ubicacion[f.itemCode] ?? 'A1-01',
      counter: contador[f.itemCode] ?? mainCounter
    }));

  const articulosConDiferencia = filas.filter(f => {
    const v = contado[f.itemCode];
    if (v === undefined || v === '') return false;
    return Number(v) !== f.sistema;
  });

  const registrar = async () => {
    if (!window.confirm(`Se ajustará el stock de ${lineas.length} artículo(s) y se generará el asiento automático de diferencias. ¿Desea proceder?`)) return;
    try {
      await c.save({
        action: 'inventoryCount',
        data: {
          warehouseCode: almacen,
          date: fecha,
          blind: ciego,
          lines: lineas
        }
      });
      setContado({});
      setActiveTab('historial');
    } catch {
      /* error visible */
    }
  };

  const historial = [...c.data.inventoryCounts].sort((a, b) => b.date.localeCompare(a.date));
  const ultimo = historial[0];
  const valorSistema = ultimo ? ultimo.lines.reduce((s, l) => s + l.systemQuantity * l.unitCost, 0) : 0;
  const mermaPct = ultimo && valorSistema > 0 ? round((Math.abs(Math.min(0, ultimo.totalDifferenceValue)) / valorSistema) * 100) : 0;

  const handleAddAttachment = () => {
    const fileName = prompt('Ingrese el nombre del acta o reporte firmado:', `Acta_Recuento_${fecha}.pdf`);
    if (!fileName) return;
    setAttachments(prev => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        path: 'C:\\SAP_Attachments\\Inventarios\\',
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
    <Screen title="Recuento e inventario físico (OINC / INC1)">
      {/* Cabecera Oficial del Recuento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#f8fafc] p-3 rounded border border-[#cbd5e1]">
        <div>
          <label className="text-[11px] font-semibold text-[#475569] block mb-0.5">N° Recuento</label>
          <input
            readOnly
            className={`${inputClass} bg-[#f1f5f9] font-mono font-semibold text-[#1e293b]`}
            value={ultimo ? `REC-${(historial.length + 1).toString().padStart(5, '0')}` : 'REC-00001 (Borrador)'}
          />
        </div>
        <Field label="Almacén de Recuento" required>
          <select
            className={inputClass}
            value={almacen}
            onChange={e => { setAlmacen(e.target.value); setContado({}); }}
          >
            {almacenes.map(w => (
              <option key={w.code} value={w.code}>{w.code} · {w.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Fecha del Recuento" required>
          <input
            type="date"
            className={inputClass}
            value={fecha}
            onChange={e => setFecha(e.target.value)}
          />
        </Field>
        <Field label="Hora">
          <input
            type="time"
            className={inputClass}
            value={hora}
            onChange={e => setHora(e.target.value)}
          />
        </Field>

        <Field label="Tipo de Recuento">
          <select
            className={inputClass}
            value={countingType}
            onChange={e => setCountingType(e.target.value as 'single' | 'multiple')}
          >
            <option value="single">Contador individual</option>
            <option value="multiple">Contadores múltiples (Doble ciego)</option>
          </select>
        </Field>
        <Field label="Contador Principal">
          <input
            className={inputClass}
            value={mainCounter}
            onChange={e => setMainCounter(e.target.value)}
          />
        </Field>
        <div className="flex items-center pt-5">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#1e293b] cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded text-[#0055A5] focus:ring-[#0055A5]"
              checked={ciego}
              onChange={e => setCiego(e.target.checked)}
            />
            <span>Conteo ciego (ocultar stock de sistema)</span>
          </label>
        </div>
        <div className="flex items-center pt-5 text-xs text-[#64748b]">
          {articulosConDiferencia.length > 0 ? (
            <span className="text-[#dc2626] font-semibold flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              {articulosConDiferencia.length} artículos con diferencias
            </span>
          ) : (
            <span className="text-[#16a34a] font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Sin discrepancias detectadas
            </span>
          )}
        </div>
      </div>

      {/* Selector de Pestañas Oficiales */}
      <div className="flex border-b border-[#cbd5e1] gap-1 bg-[#e2e8f0]/40 p-1 rounded-t">
        <button
          type="button"
          onClick={() => setActiveTab('articulos')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'articulos'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <ClipboardCheck className="h-3 w-3" />
          Artículos Contados ({filas.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('parametros')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'parametros'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <Sliders className="h-3 w-3" />
          Parámetros y Tolerancias
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('historial')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'historial'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <History className="h-3 w-3" />
          Historial y Mermas ({historial.length})
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

      {/* TAB 1: ARTÍCULOS CONTADOS (Matriz Oficial OINC) */}
      {activeTab === 'articulos' && (
        <div className="space-y-3">
          <div className="overflow-x-auto border border-[#cbd5e1] rounded bg-white shadow-inner">
            <table className="min-w-full text-xs text-left border-collapse">
              <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
                <tr>
                  <th className="p-2 w-10 text-center">#</th>
                  <th className="p-2 min-w-[140px]">Código Artículo</th>
                  <th className="p-2 min-w-[200px]">Descripción</th>
                  <th className="p-2 w-28">Ubicación</th>
                  {!ciego && <th className="p-2 w-24 text-right">En Sistema</th>}
                  <th className="p-2 w-24 text-center">Fijar</th>
                  <th className="p-2 w-28 text-right">Contado *</th>
                  {!ciego && <th className="p-2 w-24 text-right">Diferencia</th>}
                  {!ciego && <th className="p-2 w-24 text-right">% Desv.</th>}
                  <th className="p-2 min-w-[140px]">Contador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {filas.map((f, i) => {
                  const v = contado[f.itemCode];
                  const contadoNum = v !== undefined && v !== '' ? Number(v) : null;
                  const dif = contadoNum !== null ? round(contadoNum - f.sistema) : null;
                  const pct = dif !== null && f.sistema > 0 ? round((dif / f.sistema) * 100) : null;
                  return (
                    <tr key={f.itemCode} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="p-2 text-center text-[#94a3b8] font-mono">{i + 1}</td>
                      <td className="p-2 font-mono font-semibold text-[#0055A5] flex items-center gap-1">
                        <span>{f.itemCode}</span>
                        <button
                          type="button"
                          title="Flecha dorada: Ver maestro del artículo"
                          className="text-[#f59e0b] hover:text-[#d97706]"
                          onClick={() => alert(`Maestro del artículo: ${f.itemCode} - ${f.nombre}`)}
                        >
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                      <td className="p-2 text-[#334155] font-medium truncate max-w-[200px]" title={f.nombre}>
                        {f.nombre}
                      </td>
                      <td className="p-1">
                        <input
                          aria-label={`Ubicación ${f.nombre}`}
                          className={inputClass}
                          value={ubicacion[f.itemCode] ?? ''}
                          onChange={e => setUbicacion(x => ({ ...x, [f.itemCode]: e.target.value }))}
                          placeholder="A1-01"
                        />
                      </td>
                      {!ciego && (
                        <td className="p-2 text-right font-mono font-semibold text-[#1e293b]">
                          {f.sistema}
                        </td>
                      )}
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          title="Fijar artículo (bloquear movimientos durante el recuento)"
                          checked={fijado[f.itemCode] ?? false}
                          onChange={e => setFijado(x => ({ ...x, [f.itemCode]: e.target.checked }))}
                        />
                      </td>
                      <td className="p-1">
                        <input
                          aria-label={`Cantidad contada ${f.nombre}`}
                          type="number"
                          min={0}
                          step="any"
                          className={`${inputClass} text-right font-semibold`}
                          value={v ?? ''}
                          onChange={e => setContado(x => ({ ...x, [f.itemCode]: e.target.value }))}
                          placeholder="0.00"
                        />
                      </td>
                      {!ciego && (
                        <td className="p-2 text-right font-mono font-bold">
                          {dif === null ? (
                            <span className="text-[#94a3b8]">—</span>
                          ) : (
                            <span className={dif < 0 ? 'text-[#dc2626]' : dif > 0 ? 'text-[#d97706]' : 'text-[#16a34a]'}>
                              {dif > 0 ? `+${dif}` : dif}
                            </span>
                          )}
                        </td>
                      )}
                      {!ciego && (
                        <td className="p-2 text-right font-mono">
                          {pct === null ? (
                            <span className="text-[#94a3b8]">—</span>
                          ) : (
                            <span className={pct < 0 ? 'text-[#dc2626]' : pct > 0 ? 'text-[#d97706]' : 'text-[#16a34a]'}>
                              {pct > 0 ? `+${pct}%` : `${pct}%`}
                            </span>
                          )}
                        </td>
                      )}
                      <td className="p-1">
                        <input
                          aria-label={`Contador ${f.nombre}`}
                          className={inputClass}
                          value={contador[f.itemCode] ?? ''}
                          onChange={e => setContador(x => ({ ...x, [f.itemCode]: e.target.value }))}
                          placeholder="Responsable"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-[#64748b]">
              <span>{lineas.length} artículos con conteo ingresado de {filas.length} en el almacén.</span>
            </div>
            <button
              type="button"
              className={`${buttonClass} font-bold`}
              disabled={c.saving || !lineas.length}
              onClick={registrar}
            >
              Registrar Recuento y Ajustar Stock ({lineas.length})
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PARÁMETROS Y AJUSTES */}
      {activeTab === 'parametros' && (
        <div className="space-y-4 bg-white p-4 rounded border border-[#cbd5e1]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
            Configuración de Fechas de Stock y Tolerancias
          </h4>
          <div className="grid gap-3 sm:grid-cols-4">
            <Field label="Documento Base">
              <input
                className={inputClass}
                value={ajustes[0]?.document ?? 'Recuento de Inventario'}
                onChange={e => setAjustes([{ document: e.target.value, stockDateBy: ajustes[0]?.stockDateBy ?? 'creation', default: ajustes[0]?.default ?? true, appliesTo: ajustes[0]?.appliesTo ?? 'Todos los usuarios', exampleDate: ajustes[0]?.exampleDate ?? fecha }])}
              />
            </Field>
            <Field label="Fecha de stock por">
              <select
                className={inputClass}
                value={ajustes[0]?.stockDateBy ?? 'creation'}
                onChange={e => setAjustes([{ document: ajustes[0]?.document ?? 'Recuento de Inventario', stockDateBy: e.target.value as 'creation' | 'posting', default: ajustes[0]?.default ?? true, appliesTo: ajustes[0]?.appliesTo ?? 'Todos los usuarios', exampleDate: ajustes[0]?.exampleDate ?? fecha }])}
              >
                <option value="creation">Fecha de Creación</option>
                <option value="posting">Fecha de Contabilización</option>
              </select>
            </Field>
            <Field label="Aplica a">
              <input
                className={inputClass}
                value={ajustes[0]?.appliesTo ?? 'Todos los usuarios'}
                onChange={e => setAjustes([{ document: ajustes[0]?.document ?? 'Recuento de Inventario', stockDateBy: ajustes[0]?.stockDateBy ?? 'creation', default: ajustes[0]?.default ?? true, appliesTo: e.target.value, exampleDate: ajustes[0]?.exampleDate ?? fecha }])}
              />
            </Field>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={ajustes[0]?.default ?? true}
                  onChange={e => setAjustes([{ document: ajustes[0]?.document ?? 'Recuento de Inventario', stockDateBy: ajustes[0]?.stockDateBy ?? 'creation', default: e.target.checked, appliesTo: ajustes[0]?.appliesTo ?? 'Todos los usuarios', exampleDate: ajustes[0]?.exampleDate ?? fecha }])}
                />
                Predeterminado para nuevos conteos
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className={buttonClass}
              disabled={c.saving}
              onClick={() => c.save({ action: 'inventorySettingsSave', data: { settings: ajustes } })}
            >
              Guardar Configuración de Tolerancia
            </button>
          </div>

          <div className="p-3 rounded bg-[#f1f5f9] text-xs text-[#475569] space-y-1 border border-[#e2e8f0]">
            <p className="font-semibold text-[#1e293b]">Cuentas Contables Afectadas Automáticamente:</p>
            <p>• <strong>Faltante de inventario (Merma):</strong> Debe: 6.05.01 Pérdida por merma de inventario | Haber: 1.1.05 Inventario de mercaderías</p>
            <p>• <strong>Sobrante de inventario:</strong> Debe: 1.1.05 Inventario de mercaderías | Haber: 4.02.09 Otros ingresos operativos</p>
          </div>
        </div>
      )}

      {/* TAB 3: HISTORIAL Y MERMAS */}
      {activeTab === 'historial' && (
        <div className="space-y-4 bg-white p-4 rounded border border-[#cbd5e1]">
          {ultimo ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5]">
                  Resultado del Último Recuento Registrado · {ultimo.countNumber} ({ultimo.date})
                </h4>
                <span className="text-xs text-[#64748b]">Almacén: {ultimo.warehouseCode}</span>
              </div>

              <div className="overflow-x-auto border border-[#cbd5e1] rounded">
                <table className="min-w-full text-xs text-left border-collapse">
                  <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
                    <tr>
                      <th className="p-2">Artículo</th>
                      <th className="p-2">Ubicación</th>
                      <th className="p-2">Contador</th>
                      <th className="p-2 text-right">Sistema</th>
                      <th className="p-2 text-right">Contado</th>
                      <th className="p-2 text-center">Tipo Ajuste</th>
                      <th className="p-2 text-right">Diferencia</th>
                      <th className="p-2 text-right">Impacto ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {ultimo.lines.map((l, idx) => (
                      <tr key={idx} className="hover:bg-[#f8fafc]">
                        <td className="p-2 font-medium text-[#1e293b]">{l.itemName}</td>
                        <td className="p-2 text-[#64748b]">{l.location || '—'}</td>
                        <td className="p-2 text-[#64748b]">{l.counter || '—'}</td>
                        <td className="p-2 text-right font-mono">{l.systemQuantity}</td>
                        <td className="p-2 text-right font-mono font-semibold">{l.countedQuantity}</td>
                        <td className="p-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            l.adjustmentType === 'entry' ? 'bg-[#dcfce7] text-[#15803d]' : l.adjustmentType === 'exit' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#f1f5f9] text-[#64748b]'
                          }`}>
                            {l.adjustmentType === 'entry' ? 'Entrada' : l.adjustmentType === 'exit' ? 'Salida' : 'Sin ajuste'}
                          </span>
                        </td>
                        <td className="p-2 text-right font-mono font-bold">
                          {l.difference > 0 ? `+${l.difference}` : l.difference}
                        </td>
                        <td className="p-2 text-right font-mono font-semibold text-[#1e293b]">
                          {usd(l.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-[#f8fafc] rounded border border-[#cbd5e1]">
                <div>
                  <span className="text-[11px] text-[#64748b] block">Diferencia Neta Valorizada</span>
                  <span className="text-base font-bold font-mono text-[#0055A5]">{usd(ultimo.totalDifferenceValue)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#64748b] block">Merma sobre Stock Contado</span>
                  <span className={`text-base font-bold font-mono ${mermaPct > 2 ? 'text-[#dc2626]' : 'text-[#16a34a]'}`}>
                    {mermaPct.toLocaleString('es-EC', { maximumFractionDigits: 2 })} %
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#64748b] block">Asiento Contable Generado</span>
                  <span className="text-xs font-mono font-semibold text-[#0284c7]">{ultimo.journalEntryId || 'Automático'}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#94a3b8] text-center py-6">
              Aún no se han registrado recuentos físicos para este almacén.
            </p>
          )}
        </div>
      )}

      {/* TAB 4: ANEXOS (Actas y Evidencias Firmadas) */}
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
                  alert('Seleccione un archivo de la lista para visualizar.');
                  return;
                }
                const att = attachments.find(a => a.id === selectedAttachment);
                alert(`Visualizando anexo oficial: ${att?.fileName}`);
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
        clave={`b1_conteo_${c.data.profile?.uid ?? 'anon'}`}
        preguntas={[
          'Si faltan unidades, ¿cómo distinguirías entre robo, error de despacho y error de registro? ¿Qué revisarías primero?',
          '¿Por qué el conteo ciego da resultados más confiables? ¿Quién no debería hacer el conteo?',
          '¿Cada cuánto contarías los artículos de alto valor frente a los de bajo valor (análisis ABC)?',
        ]}
      />
    </Screen>
  );
}
