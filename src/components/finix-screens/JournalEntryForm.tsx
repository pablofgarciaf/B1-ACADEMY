'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { JournalLine } from '@/lib/firestore-types';
import { round, today, usd } from '@/lib/company-calculations';
import { Screen, Field, Navigation, SaveButton, inputClass, buttonClass, NumberInput } from './FinixControls';
import { AccountCombobox } from './AccountCombobox';
import { SUPERCÍAS_CATALOG } from '@/lib/supercias-catalog';
import { Paperclip, Plus, Trash2, ExternalLink, FileSpreadsheet, Eye, FolderOpen, ArrowRight } from 'lucide-react';

interface ExtendedJournalLine extends JournalLine {
  taxCode?: string;
  project?: string;
}

const TAX_CODES = [
  { code: 'IVA_15', name: 'IVA 15% Crédito Tributario', rate: 15 },
  { code: 'IVA_0', name: 'IVA 0% Tarifa Cero', rate: 0 },
  { code: 'IVA_EXE', name: 'Exento de IVA', rate: 0 },
  { code: 'RET_FTE_175', name: 'Retención FTE 1.75% Bienes', rate: -1.75 },
  { code: 'RET_FTE_275', name: 'Retención FTE 2.75% Servicios', rate: -2.75 },
  { code: 'RET_IVA_70', name: 'Retención IVA 70% Servicios', rate: -70 },
  { code: 'RET_IVA_100', name: 'Retención IVA 100% Liquidación', rate: -100 },
];

const emptyLine = (): ExtendedJournalLine => ({
  accountCode: '',
  debit: 0,
  credit: 0,
  description: '',
  costCenter: '',
  taxCode: 'IVA_15',
  project: '',
});

export default function JournalEntryForm(_props: { screenId?: string; screenName?: string }) {
  const c = useCompany();
  const [index, setIndex] = useState(-1);
  const [date, setDate] = useState(today());
  const [dueDate, setDueDate] = useState(today());
  const [taxDate, setTaxDate] = useState(today());
  const [memo, setMemo] = useState('');
  const [reference, setReference] = useState('');
  const [reference2, setReference2] = useState('');
  const [reference3, setReference3] = useState('');
  const [transCode, setTransCode] = useState('AS-MAN');
  const [project, setProject] = useState('PRJ-GRAL');
  const [activeTab, setActiveTab] = useState<'contenido' | 'general' | 'anexos'>('contenido');
  const [lines, setLines] = useState<ExtendedJournalLine[]>([emptyLine(), emptyLine()]);
  const [attachments, setAttachments] = useState<Array<{ id: string; path: string; fileName: string; date: string; user: string }>>([
    { id: 'att-1', path: 'C:\\SAP_Attachments\\Comprobantes\\', fileName: 'respaldo_transaccion_contable.pdf', date: today(), user: 'manager' }
  ]);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

  const debit = round(lines.reduce((s, l) => s + (l.debit || 0), 0));
  const credit = round(lines.reduce((s, l) => s + (l.credit || 0), 0));
  const difference = round(debit - credit);
  const entry = c.data.journalEntries[index];

  const cuentasDisponibles = useMemo(() => {
    const mapa = new Map<string, { code: string; name: string; category?: string; postable?: boolean }>();
    for (const s of SUPERCÍAS_CATALOG) {
      if (s.postable) {
        mapa.set(s.code, { code: s.code, name: s.name, category: s.category, postable: true });
      }
    }
    for (const a of (c.data.chartOfAccounts || [])) {
      if (a.postable) {
        mapa.set(a.code, { code: a.code, name: a.name, category: a.category, postable: true });
      }
    }
    return Array.from(mapa.values()).sort((a, b) =>
      a.code.localeCompare(b.code, undefined, { numeric: true })
    );
  }, [c.data.chartOfAccounts]);

  const cuentaNombre = (code: string) => {
    if (!code) return '—';
    const found = cuentasDisponibles.find(a => a.code === code);
    return found ? found.name : 'Cuenta no catalogada';
  };

  const reset = () => {
    setIndex(-1);
    setDate(today());
    setDueDate(today());
    setTaxDate(today());
    setMemo('');
    setReference('');
    setReference2('');
    setReference3('');
    setTransCode('AS-MAN');
    setProject('PRJ-GRAL');
    setLines([emptyLine(), emptyLine()]);
    setActiveTab('contenido');
  };

  const change = (i: number, patch: Partial<ExtendedJournalLine>) =>
    setLines(ls => ls.map((l, j) => i === j ? { ...l, ...patch } : l));

  const balanceAutomatically = () => {
    if (difference === 0) return;
    if (difference > 0) {
      // Debe > Haber -> agregamos línea al Haber
      setLines(ls => [...ls, { ...emptyLine(), credit: Math.abs(difference), description: 'Cuadre automático' }]);
    } else {
      // Haber > Debe -> agregamos línea al Debe
      setLines(ls => [...ls, { ...emptyLine(), debit: Math.abs(difference), description: 'Cuadre automático' }]);
    }
  };

  const handleAddAttachment = () => {
    const fileName = prompt('Ingrese el nombre del archivo para adjuntar:', `Sustento_Asiento_${Date.now().toString().slice(-4)}.pdf`);
    if (!fileName) return;
    setAttachments(prev => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        path: 'C:\\SAP_Attachments\\Contabilidad\\',
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

  useEffect(() => {
    const onSapAdd = () => reset();
    const onSapSave = () => {
      const formEl = document.getElementById('journal-entry-form') as HTMLFormElement | null;
      if (formEl) formEl.requestSubmit();
    };
    const onSapDelete = () => {
      if (lines.length > 2) {
        if (window.confirm('¿Desea borrar la última línea del asiento?')) {
          setLines(ls => ls.slice(0, -1));
        }
      }
    };
    const onSapEscape = () => reset();

    window.addEventListener('sap-add-mode', onSapAdd);
    window.addEventListener('sap-save-document', onSapSave);
    window.addEventListener('sap-delete-row', onSapDelete);
    window.addEventListener('sap-escape', onSapEscape);
    return () => {
      window.removeEventListener('sap-add-mode', onSapAdd);
      window.removeEventListener('sap-save-document', onSapSave);
      window.removeEventListener('sap-delete-row', onSapDelete);
      window.removeEventListener('sap-escape', onSapEscape);
    };
  }, [lines.length]);

  return (
    <Screen title="Asiento contable (OJDT / JDT1)">
      {/* Barra de Navegación Oficial SAP B1 */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#cbd5e1] pb-2">
        <Navigation
          count={c.data.journalEntries.length}
          index={index}
          onNew={reset}
          onSelect={i => {
            const e = c.data.journalEntries[i];
            setIndex(i);
            setDate(e?.date ?? today());
            setDueDate(e?.dueDate ?? e?.date ?? today());
            setTaxDate(e?.date ?? today());
            setMemo(e?.memo ?? '');
            setReference(e?.reference ?? '');
            setLines((e?.lines ?? []).map(l => ({
              accountCode: l.accountCode ?? '',
              debit: l.debit ?? 0,
              credit: l.credit ?? 0,
              description: l.description ?? '',
              costCenter: l.costCenter ?? '',
              taxCode: 'IVA_15',
              project: 'PRJ-GRAL',
            })));
          }}
        />
        <div className="text-xs text-[#64748b]">
          <span className="font-semibold text-[#1e293b]">
            {entry?.entryNumber ? `N° ${entry.entryNumber}` : 'Modo Creación (Nuevo Asiento)'}
          </span>
          {' · '}
          <span>Período fiscal: {(date || today()).slice(0, 7)}</span>
          {' · '}
          <span>Origen: {entry?.source ? entry.source.toUpperCase() : 'MANUAL'}</span>
        </div>
      </div>

      <form
        id="journal-entry-form"
        className="space-y-3"
        onSubmit={async e => {
          e.preventDefault();
          if (difference !== 0) {
            alert(`El asiento está descuadrado por ${usd(difference)}. El Debe y Haber deben ser idénticos para contabilizar.`);
            return;
          }
          try {
            await c.save({
              action: 'journal',
              data: {
                date,
                dueDate,
                memo: memo || 'Asiento de diario manual',
                reference,
                lines: lines.map(l => ({
                  accountCode: l.accountCode,
                  debit: l.debit,
                  credit: l.credit,
                  description: l.description,
                  costCenter: l.costCenter,
                }))
              }
            });
            reset();
          } catch {
            /* Provider error */
          }
        }}
      >
        <fieldset disabled={c.saving || index >= 0} className="space-y-3">
          {/* Cabecera Oficial del Asiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#f8fafc] p-3 rounded border border-[#cbd5e1]">
            <div>
              <label className="text-[11px] font-semibold text-[#475569] block mb-0.5">N° Transacción</label>
              <input
                readOnly
                className={`${inputClass} bg-[#f1f5f9] font-mono font-semibold text-[#1e293b]`}
                value={entry?.entryNumber ?? 'Automático (AS)'}
              />
            </div>
            <Field label="Fecha de contabilización" required>
              <input
                required
                type="date"
                className={inputClass}
                value={date ?? ''}
                onChange={e => setDate(e.target.value)}
              />
            </Field>
            <Field label="Fecha de vencimiento" required>
              <input
                required
                type="date"
                className={inputClass}
                value={dueDate ?? ''}
                onChange={e => setDueDate(e.target.value)}
              />
            </Field>
            <Field label="Fecha de documento">
              <input
                type="date"
                className={inputClass}
                value={taxDate ?? ''}
                onChange={e => setTaxDate(e.target.value)}
              />
            </Field>

            <Field label="Ref. 1 (Comprobante)">
              <input
                className={inputClass}
                value={reference ?? ''}
                onChange={e => setReference(e.target.value)}
                placeholder="Ej.: FAC-001-002-12345"
              />
            </Field>
            <Field label="Ref. 2">
              <input
                className={inputClass}
                value={reference2}
                onChange={e => setReference2(e.target.value)}
                placeholder="Ej.: CHQ-99812 / TRANSF"
              />
            </Field>
            <Field label="Código transacción">
              <select
                className={inputClass}
                value={transCode}
                onChange={e => setTransCode(e.target.value)}
              >
                <option value="AS-MAN">AS-MAN · Asiento Diario Manual</option>
                <option value="AS-AJU">AS-AJU · Ajuste de Auditoría</option>
                <option value="AS-REV">AS-REV · Reversión Periódica</option>
                <option value="AS-APE">AS-APE · Apertura de Ejercicio</option>
                <option value="AS-CIE">AS-CIE · Cierre de Cuentas</option>
              </select>
            </Field>
            <Field label="Proyecto">
              <input
                className={inputClass}
                value={project}
                onChange={e => setProject(e.target.value)}
                placeholder="Ej.: PRJ-2026-LOGISTICA"
              />
            </Field>

            <div className="md:col-span-2 lg:col-span-4">
              <Field label="Comentarios / Glosa del Asiento (Memo)" required>
                <input
                  required
                  className={inputClass}
                  value={memo ?? ''}
                  onChange={e => setMemo(e.target.value)}
                  placeholder="Describa el concepto económico de la transacción contable..."
                />
              </Field>
            </div>
          </div>

          {/* Selector de Pestañas Oficiales SAP Business One */}
          <div className="flex border-b border-[#cbd5e1] gap-1 bg-[#e2e8f0]/40 p-1 rounded-t">
            <button
              type="button"
              onClick={() => setActiveTab('contenido')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all ${
                activeTab === 'contenido'
                  ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
                  : 'text-[#475569] hover:bg-white/60'
              }`}
            >
              Contenido (Matriz de Cuentas)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all ${
                activeTab === 'general'
                  ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
                  : 'text-[#475569] hover:bg-white/60'
              }`}
            >
              General y Auditoría
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

          {/* TAB 1: CONTENIDO (Matriz Transaccional SAP B1) */}
          {activeTab === 'contenido' && (
            <div className="space-y-2">
              <div className="overflow-x-auto border border-[#cbd5e1] rounded bg-white shadow-inner">
                <table className="min-w-full text-xs text-left border-collapse">
                  <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
                    <tr>
                      <th className="p-2 w-10 text-center">#</th>
                      <th className="p-2 min-w-[200px]">Cuenta / Código SN *</th>
                      <th className="p-2 min-w-[200px]">Nombre de Cuenta</th>
                      <th className="p-2 w-28 text-right">Debe ($)</th>
                      <th className="p-2 w-28 text-right">Haber ($)</th>
                      <th className="p-2 min-w-[140px]">Ind. Impuesto</th>
                      <th className="p-2 min-w-[120px]">Centro Costo</th>
                      <th className="p-2 min-w-[120px]">Proyecto</th>
                      <th className="p-2 min-w-[180px]">Detalle de Línea</th>
                      <th className="p-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {lines.map((line, i) => (
                      <tr key={i} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="p-2 text-center text-[#94a3b8] font-mono">{i + 1}</td>
                        <td className="p-1">
                          <div className="flex items-center gap-1">
                            <AccountCombobox
                              ariaLabel={`Cuenta línea ${i + 1}`}
                              required
                              value={line.accountCode ?? ''}
                              accounts={cuentasDisponibles}
                              disabled={c.saving || index >= 0}
                              onChange={accountCode => change(i, { accountCode })}
                            />
                            {line.accountCode && (
                              <button
                                type="button"
                                title="Flecha dorada SAP: Ver Plan de Cuentas"
                                className="text-[#f59e0b] hover:text-[#d97706] p-0.5"
                                onClick={() => alert(`Detalle de cuenta SAP B1: ${line.accountCode} - ${cuentaNombre(line.accountCode)}`)}
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-2 font-medium text-[#334155] truncate max-w-[200px]" title={cuentaNombre(line.accountCode ?? '')}>
                          {cuentaNombre(line.accountCode ?? '')}
                        </td>
                        <td className="p-1">
                          <NumberInput
                            ariaLabel={`Debe línea ${i + 1}`}
                            min={0}
                            value={line.debit ?? 0}
                            onChange={val => change(i, { debit: val, credit: 0 })}
                          />
                        </td>
                        <td className="p-1">
                          <NumberInput
                            ariaLabel={`Haber línea ${i + 1}`}
                            min={0}
                            value={line.credit ?? 0}
                            onChange={val => change(i, { credit: val, debit: 0 })}
                          />
                        </td>
                        <td className="p-1">
                          <select
                            className={inputClass}
                            value={line.taxCode ?? 'IVA_15'}
                            onChange={e => change(i, { taxCode: e.target.value })}
                          >
                            {TAX_CODES.map(tc => (
                              <option key={tc.code} value={tc.code}>{tc.code} ({tc.rate}%)</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-1">
                          <input
                            className={inputClass}
                            value={line.costCenter ?? ''}
                            onChange={e => change(i, { costCenter: e.target.value })}
                            placeholder="CC-ADM"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            className={inputClass}
                            value={line.project ?? ''}
                            onChange={e => change(i, { project: e.target.value })}
                            placeholder="PRJ-01"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            className={inputClass}
                            value={line.description ?? ''}
                            onChange={e => change(i, { description: e.target.value })}
                            placeholder="Glosa específica..."
                          />
                        </td>
                        <td className="p-1 text-center">
                          <button
                            type="button"
                            disabled={lines.length <= 2}
                            className="text-[#ef4444] hover:text-[#b91c1c] disabled:opacity-20 p-1"
                            title="Eliminar fila (Ctrl+D)"
                            onClick={() => setLines(ls => ls.filter((_, j) => i !== j))}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Botones de control de matriz */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={`${buttonClass} flex items-center gap-1`}
                    onClick={() => setLines(ls => [...ls, emptyLine()])}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Añadir Línea
                  </button>
                  {difference !== 0 && (
                    <button
                      type="button"
                      onClick={balanceAutomatically}
                      className="px-2.5 py-1 text-xs font-semibold bg-[#e0f2fe] text-[#0369a1] hover:bg-[#bae6fd] rounded border border-[#7dd3fc] transition-all"
                    >
                      Balancear Automáticamente ({usd(Math.abs(difference))})
                    </button>
                  )}
                </div>
                <div className="text-xs text-[#64748b]">
                  {lines.length} líneas registradas
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL Y AUDITORÍA */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded border border-[#cbd5e1]">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
                  Referencias Adicionales
                </h4>
                <Field label="Referencia 3">
                  <input
                    className={inputClass}
                    value={reference3}
                    onChange={e => setReference3(e.target.value)}
                    placeholder="Ref. interna / Auditoría"
                  />
                </Field>
                <Field label="Transacción periódica">
                  <input
                    readOnly
                    className={`${inputClass} bg-[#f8fafc]`}
                    value="No (Asiento puntual)"
                  />
                </Field>
                <Field label="Indicador de anulación">
                  <input
                    readOnly
                    className={`${inputClass} bg-[#f8fafc]`}
                    value={entry?.reversedBy ? `Revertido por ${entry.reversedBy}` : entry?.reversalOf ? `Reversión de ${entry.reversalOf}` : 'Sin anulación'}
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
                  Control y Seguridad
                </h4>
                <Field label="Origen de datos">
                  <input
                    readOnly
                    className={`${inputClass} bg-[#f8fafc] font-mono`}
                    value={entry?.source ? `B1_${entry.source.toUpperCase()}` : 'B1_MANUAL_POSTING'}
                  />
                </Field>
                <Field label="Usuario registrador">
                  <input
                    readOnly
                    className={`${inputClass} bg-[#f8fafc]`}
                    value="manager (Administrador del Sistema)"
                  />
                </Field>
                <Field label="Moneda de contabilización">
                  <input
                    readOnly
                    className={`${inputClass} bg-[#f8fafc] font-semibold`}
                    value="USD — Dólar de los Estados Unidos"
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
                  Normativas y Conciliación
                </h4>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Este asiento cumple con la partida doble obligatoria (Debe = Haber) conforme a NIIF para PYMES y la normativa tributaria del SRI. Toda transacción afecta el Balance General y el Estado de Resultados en el Byte-0 del motor contable.
                </p>
                <div className="p-2.5 rounded bg-[#f1f5f9] text-[11px] text-[#334155] border border-[#e2e8f0]">
                  <strong>Regla de oro:</strong> Una vez contabilizado, un asiento en SAP Business One no se puede eliminar físicamente; únicamente puede compensarse mediante una transacción inversa.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ANEXOS (Gestor Documental Oficial SAP B1) */}
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
                    {attachments.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-[#94a3b8]">
                          No hay archivos anexados a este asiento contable.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Botones de acción lateral de Anexos SAP B1 */}
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
        </fieldset>

        {/* Resumen Financiero y Cuadre de Partida Doble */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded border bg-[#f8fafc] border-[#cbd5e1]">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] text-[#64748b] block">Total Debe</span>
              <span className="text-sm font-bold font-mono text-[#1e293b]">{usd(debit)}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#64748b] block">Total Haber</span>
              <span className="text-sm font-bold font-mono text-[#1e293b]">{usd(credit)}</span>
            </div>
            <div className="border-l border-[#cbd5e1] pl-4">
              <span className="text-[11px] text-[#64748b] block">Diferencia / Saldo</span>
              <span className={`text-sm font-bold font-mono ${difference === 0 && debit > 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                {usd(difference)} {difference === 0 && debit > 0 ? '✓ Cuadrado' : '✗ Descuadrado'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SaveButton
              disabled={index >= 0 || difference !== 0 || debit <= 0}
              label="Contabilizar (Crear)"
            />
            <button
              type="button"
              className={buttonClass}
              disabled={c.saving}
              onClick={reset}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-semibold rounded bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca] hover:bg-[#fee2e2] disabled:opacity-30"
              disabled={c.saving || !entry || entry.source !== 'manual' || Boolean(entry.reversedBy)}
              onClick={async () => {
                if (!entry) return;
                if (!window.confirm(`¿Desea crear un asiento inverso para anular la transacción ${entry.entryNumber}?`)) return;
                try {
                  await c.save({ action: 'reverse', data: { entryId: entry.id, date: today() } });
                } catch {
                  /* Provider error */
                }
              }}
            >
              Revertir Asiento
            </button>
          </div>
        </div>
      </form>
    </Screen>
  );
}
