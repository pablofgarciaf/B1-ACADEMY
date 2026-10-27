'use client';

import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { documentLabels } from '@/lib/company-engine';
import { salesTypes, purchaseTypes, type Approval, type DocType } from '@/lib/firestore-types';
import { usd } from '@/lib/company-calculations';
import { Screen, Field, Table, inputClass, buttonClass } from './FinixControls';
import { ParaPensar } from './AnalysisBlocks';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCheck,
  Layers,
  Settings,
  Users,
  AlertTriangle,
  FileText,
  Clock,
  Plus,
} from 'lucide-react';

const TIPOS: DocType[] = ['order', 'invoice', 'credit_note', 'purchase_order', 'vendor_invoice', 'debit_note'];

/** Contexto que un aprobador responsable revisa antes de decidir. */
function Contexto({ a }: { a: Approval }) {
  const c = useCompany();
  const socio = (a.kind === 'sales' ? c.data.customers : c.data.vendors).find(p => p.cardCode === a.cardCode);
  const exceso = a.total - a.threshold;
  const datos: string[] = [`Supera el umbral de la regla en ${usd(exceso)} (${Math.round((exceso / Math.max(a.threshold, 1)) * 100)} %).`];
  if (socio) {
    datos.push(`Saldo actual con ${socio.name}: ${usd(socio.balance)}.`);
    if (a.kind === 'sales' && socio.creditLimit > 0) {
      const despues = socio.balance + a.total;
      datos.push(
        despues > socio.creditLimit
          ? `⚠ Con este documento el cliente superaría su límite de crédito: ${usd(despues)} sobre cupo de ${usd(socio.creditLimit)}.`
          : `Quedaría en ${usd(despues)} de un cupo de ${usd(socio.creditLimit)}.`
      );
    }
  }
  return (
    <div className="bg-[#fffde7] border border-[#d4c875] p-2 rounded-xs text-[11px] text-[#554b1d] space-y-1">
      <span className="font-bold flex items-center gap-1 text-[#003366]">
        <AlertTriangle size={12} className="text-amber-600" /> Auditoría previa a la autorización:
      </span>
      <ul className="list-disc pl-5 space-y-0.5">
        {datos.map(d => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    </div>
  );
}

function Pendiente({ a }: { a: Approval }) {
  const c = useCompany();
  const [comentario, setComentario] = useState('');
  const decidir = async (approved: boolean) => {
    try {
      await c.save({ action: 'approve', data: { id: a.id, approved, comment: comentario } });
    } catch {
      /* el proveedor muestra el error */
    }
  };

  return (
    <article className="space-y-2 border border-[#a6b8cc] bg-white p-3 rounded-xs shadow-xs text-xs">
      <header className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-200 pb-1.5 font-bold">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[#0055a5] text-sm">{a.approvalNumber}</span>
          <span className="text-gray-400">|</span>
          <span className="text-[#003366]">{documentLabels[a.docType]}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-800">{a.cardName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium text-[11px]">Total Documento:</span>
          <span className="font-mono text-base font-bold text-[#0055a5]">{usd(a.total)}</span>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-4 text-gray-500 text-[11px]">
        <span>Fecha de contabilización: <strong>{a.document.date}</strong></span>
        <span>Líneas contenidas: <strong>{a.document.lines.length}</strong></span>
        <span>Comentarios: <em>{a.document.comments || 'Sin comentarios registrados'}</em></span>
      </div>

      <Contexto a={a} />

      <Field label="Justificación de la decisión de autorización (Mínimo 10 caracteres obligatorios)">
        <textarea
          className={`${inputClass} min-h-16 text-xs`}
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          placeholder="Ej.: Se aprueba compra porque cuenta con presupuesto y el descuento por volumen es del 15%..."
        />
      </Field>

      <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
        <button
          type="button"
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xs text-xs flex items-center gap-1 cursor-pointer disabled:opacity-40"
          disabled={c.saving || comentario.trim().length < 10}
          onClick={() => decidir(true)}
        >
          <CheckCircle2 size={13} /> Aprobar Documento
        </button>
        <button
          type="button"
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xs text-xs flex items-center gap-1 cursor-pointer disabled:opacity-40"
          disabled={c.saving || comentario.trim().length < 10}
          onClick={() => decidir(false)}
        >
          <XCircle size={13} /> Rechazar Documento
        </button>
      </div>
    </article>
  );
}

/** Procedimientos de autorización (ADM003 / ADM006 / WDD1): control interno sobre documentos retenidos. */
export default function ApprovalsScreen() {
  const c = useCompany();
  const reglas = c.data.profile?.approvalRules ?? [];
  const [activeTab, setActiveTab] = useState<'decisiones' | 'modelos' | 'etapas'>('decisiones');

  // Estado del modelo de autorización (OWTM)
  const [docType, setDocType] = useState<DocType>('purchase_order');
  const [monto, setMonto] = useState(1000);
  const [modelName, setModelName] = useState('Modelo Compras Mayores a $1,000');
  const [modelDesc, setModelDesc] = useState('Requiere autorización de Gerencia para compras que superen el límite operativo');
  const [selectedStage, setSelectedStage] = useState('ETP-01');

  // Etapas de autorización simuladas oficiales (OWST)
  const [etapas, setEtapas] = useState([
    {
      id: 'ETP-01',
      name: 'Etapa 1: Jefatura de Compras y Abastecimiento',
      reqApprovals: 1,
      reqRejections: 1,
      users: ['Juan Pérez (Jefe Compras)', 'Sofía Morales (Supervisora)'],
    },
    {
      id: 'ETP-02',
      name: 'Etapa 2: Gerencia Financiera y Presidencia',
      reqApprovals: 1,
      reqRejections: 1,
      users: ['Pablo García (Gerente Financiero)', 'Roberto Silva (Director Ejecutivo)'],
    },
  ]);

  const [nuevaEtapa, setNuevaEtapa] = useState({ name: '', reqApprovals: 1, reqRejections: 1, user: '' });

  const pendientes = c.data.approvals.filter(a => a.status === 'pending');
  const historial = c.data.approvals.filter(a => a.status !== 'pending').sort((a, b) => b.decidedAt.localeCompare(a.decidedAt));

  const guardarRegla = async (dt: DocType, threshold: number, active: boolean) => {
    try {
      await c.save({
        action: 'approvalRule',
        data: {
          docType: dt as (typeof salesTypes)[number] | (typeof purchaseTypes)[number],
          threshold,
          active,
        },
      });
    } catch {
      /* error visible */
    }
  };

  const agregarEtapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaEtapa.name) return;
    const id = `ETP-0${etapas.length + 1}`;
    setEtapas(prev => [
      ...prev,
      {
        id,
        name: nuevaEtapa.name,
        reqApprovals: nuevaEtapa.reqApprovals,
        reqRejections: nuevaEtapa.reqRejections,
        users: nuevaEtapa.user ? [nuevaEtapa.user] : ['Usuario Autorizador'],
      },
    ]);
    setNuevaEtapa({ name: '', reqApprovals: 1, reqRejections: 1, user: '' });
  };

  const tabs: { id: typeof activeTab; label: string; count?: number; icon: React.ReactNode }[] = [
    {
      id: 'decisiones',
      label: 'Decisiones de Aprobación (WDD1)',
      count: pendientes.length,
      icon: <FileCheck size={13} />,
    },
    {
      id: 'modelos',
      label: 'Modelos de Autorización (OWTM)',
      count: reglas.length,
      icon: <Layers size={13} />,
    },
    {
      id: 'etapas',
      label: 'Etapas de Autorización (OWST)',
      count: etapas.length,
      icon: <Users size={13} />,
    },
  ];

  return (
    <Screen title="Procedimientos de Autorización · SAP Business One (OWTM/OWST/WDD1)">
      <div className="border-l-4 border-[#0055A5] bg-white p-2.5 rounded-r-xs shadow-xs text-xs">
        <p className="text-gray-700">
          En <strong>SAP Business One</strong>, el flujo de autorización bloquea la creación directa del documento mercantil,
          reteniéndolo como <strong>Documento Borrador en Proceso de Autorización</strong> hasta que las etapas y modelos definidos
          sean aprobados por los usuarios facultados.
        </p>
      </div>

      {/* ── BARRA DE PESTAÑAS OFICIALES DE AUTORIZACIÓN ── */}
      <div className="border-b border-[#a6b8cc] flex items-center gap-1 select-none pt-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-bold rounded-t-xs border-t-2 border-x transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-[#003366] border-t-[#0055a5] border-x-[#a6b8cc] border-b-white -mb-px shadow-xs'
                : 'bg-[#e2eaf2] text-[#475569] border-transparent hover:bg-white/70'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  tab.id === 'decisiones' && pendientes.length > 0
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── CONTENIDO DE LAS PESTAÑAS ── */}
      <div className="bg-white border border-[#a6b8cc] border-t-0 p-3 rounded-b-xs shadow-xs min-h-[300px] text-xs">
        {/* 1. PESTAÑA: DECISIONES DE AUTORIZACIÓN (BANDEJA WDD1) */}
        {activeTab === 'decisiones' && (
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#003366] text-xs flex items-center gap-1.5">
                  <Clock size={14} className="text-[#0055a5]" /> Documentos Retenidos Pendientes de Decisión ({pendientes.length})
                </h3>
                <p className="text-gray-500 text-[11px]">
                  Documentos mercantiles que superan las reglas y esperan la revisión de un autorizador.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {pendientes.length ? (
                pendientes.map(a => <Pendiente key={a.id} a={a} />)
              ) : (
                <div className="p-4 bg-[#f8fafc] border border-gray-200 rounded text-center text-gray-500 text-xs">
                  ✓ No hay documentos retenidos pendientes de autorización en este momento.
                </div>
              )}
            </div>

            {/* Historial de decisiones */}
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <h3 className="font-bold text-[#003366] text-xs">Historial de Resoluciones Tomadas (Auditoría Inmutable)</h3>
              <div className="border border-[#b0c2d4] rounded-xs overflow-x-auto">
                <Table
                  headers={['Solicitud', 'Documento', 'Socio de Negocios', 'Total', 'Resolución', 'Justificación Registrada', 'Doc. Generado']}
                  rows={historial.map(a => [
                    <span key="n" className="font-mono font-bold text-[#0055a5]">{a.approvalNumber}</span>,
                    documentLabels[a.docType],
                    a.cardName,
                    <span key="t" className="font-mono font-semibold">{usd(a.total)}</span>,
                    <strong
                      key="d"
                      className={`text-xs ${a.status === 'approved' ? 'text-emerald-700' : 'text-red-700'}`}
                    >
                      {a.status === 'approved' ? '✓ Aprobada' : '✖ Rechazada'}
                    </strong>,
                    a.decisionComment,
                    a.resultDocumentId || '—',
                  ])}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. PESTAÑA: MODELOS DE AUTORIZACIÓN (OWTM) */}
        {activeTab === 'modelos' && (
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="font-bold text-[#003366] text-xs flex items-center gap-1.5">
                <Layers size={14} className="text-[#0055a5]" /> Configuración de Modelos de Autorización (OWTM)
              </h3>
              <p className="text-gray-500 text-[11px]">
                Vincula tipos de documentos con condiciones de importe y etapas de autorización obligatorias.
              </p>
            </div>

            {/* Formulario de creación de modelo con pestañas canónicas SAP B1 */}
            <form
              onSubmit={e => {
                e.preventDefault();
                void guardarRegla(docType, monto, true);
              }}
              className="border border-[#cbd8e5] p-3 rounded-xs bg-[#f8fafc] space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Nombre del Modelo *" required>
                  <input
                    required
                    type="text"
                    className={inputClass}
                    value={modelName}
                    onChange={e => setModelName(e.target.value)}
                  />
                </Field>
                <Field label="Descripción de la Política">
                  <input
                    type="text"
                    className={inputClass}
                    value={modelDesc}
                    onChange={e => setModelDesc(e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <Field label="Documento Sujeto a Autorización">
                  <select
                    className={inputClass}
                    value={docType}
                    onChange={e => setDocType(e.target.value as DocType)}
                  >
                    {TIPOS.map(t => (
                      <option key={t} value={t}>
                        {documentLabels[t]}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Condición: Total del Documento Mayor a (USD)">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={`${inputClass} font-mono font-bold`}
                    value={monto}
                    onChange={e => setMonto(Number(e.target.value))}
                  />
                </Field>

                <Field label="Etapa Asignada">
                  <select
                    className={inputClass}
                    value={selectedStage}
                    onChange={e => setSelectedStage(e.target.value)}
                  >
                    {etapas.map(et => (
                      <option key={et.id} value={et.id}>
                        {et.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <button
                type="submit"
                className={`${buttonClass} font-bold text-white bg-[#0055a5] hover:bg-[#004080]`}
                disabled={c.saving}
              >
                Guardar Modelo de Autorización
              </button>
            </form>

            {/* Matriz de Modelos Configurados */}
            <div className="border border-[#b0c2d4] rounded-xs overflow-x-auto">
              <Table
                headers={['Documento', 'Condición de Disparo', 'Estado en SAP', 'Acción']}
                rows={reglas.map(r => [
                  <span key="d" className="font-bold text-[#003366]">{documentLabels[r.docType]}</span>,
                  <span key="m" className="font-mono font-semibold">Total &gt; {usd(r.threshold)}</span>,
                  <span
                    key="s"
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {r.active ? 'Activo' : 'Inactivo'}
                  </span>,
                  <button
                    key="btn"
                    type="button"
                    className={buttonClass}
                    disabled={c.saving}
                    onClick={() => guardarRegla(r.docType, r.threshold, !r.active)}
                  >
                    {r.active ? 'Desactivar' : 'Activar'}
                  </button>,
                ])}
              />
            </div>
          </div>
        )}

        {/* 3. PESTAÑA: ETAPAS DE AUTORIZACIÓN (OWST) */}
        {activeTab === 'etapas' && (
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="font-bold text-[#003366] text-xs flex items-center gap-1.5">
                <Users size={14} className="text-[#0055a5]" /> Definición de Etapas de Autorización (OWST)
              </h3>
              <p className="text-gray-500 text-[11px]">
                Define los niveles jerárquicos de aprobación, el número mínimo de firmas requeridas y los usuarios aprobadores.
              </p>
            </div>

            {/* Formulario para añadir nueva etapa */}
            <form onSubmit={agregarEtapa} className="border border-[#cbd8e5] p-3 rounded-xs bg-[#f8fafc] space-y-3">
              <h4 className="font-bold text-[#003366] text-xs flex items-center gap-1">
                <Plus size={12} /> Crear Nueva Etapa de Autorización
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <Field label="Nombre de la Etapa *" required>
                  <input
                    required
                    type="text"
                    className={inputClass}
                    placeholder="Ej. Etapa 3: Auditoría Interna"
                    value={nuevaEtapa.name}
                    onChange={e => setNuevaEtapa(v => ({ ...v, name: e.target.value }))}
                  />
                </Field>
                <Field label="Autorizaciones Requeridas">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className={`${inputClass} font-mono`}
                    value={nuevaEtapa.reqApprovals}
                    onChange={e => setNuevaEtapa(v => ({ ...v, reqApprovals: Number(e.target.value) }))}
                  />
                </Field>
                <Field label="Rechazos para Bloquear">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className={`${inputClass} font-mono`}
                    value={nuevaEtapa.reqRejections}
                    onChange={e => setNuevaEtapa(v => ({ ...v, reqRejections: Number(e.target.value) }))}
                  />
                </Field>
                <Field label="Usuario Aprobador Principal">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Ej. Ing. Fernando Dávila"
                    value={nuevaEtapa.user}
                    onChange={e => setNuevaEtapa(v => ({ ...v, user: e.target.value }))}
                  />
                </Field>
              </div>
              <button
                type="submit"
                className={`${buttonClass} font-bold text-white bg-[#0055a5] hover:bg-[#004080]`}
              >
                Añadir Etapa a SAP B1
              </button>
            </form>

            {/* Matriz de Etapas existentes */}
            <div className="border border-[#b0c2d4] rounded-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#e9edf2] text-[#003366] border-b border-[#b0c2d4] font-bold text-[11px]">
                  <tr>
                    <th className="p-2 border-r border-[#cbd8e5] w-20">Código</th>
                    <th className="p-2 border-r border-[#cbd8e5]">Nombre de la Etapa</th>
                    <th className="p-2 border-r border-[#cbd8e5] text-center w-28">N° Aprobaciones</th>
                    <th className="p-2 border-r border-[#cbd8e5] text-center w-24">N° Rechazos</th>
                    <th className="p-2">Usuarios Aprobadores Autorizados</th>
                  </tr>
                </thead>
                <tbody>
                  {etapas.map((et, idx) => (
                    <tr
                      key={et.id}
                      className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'}`}
                    >
                      <td className="p-2 border-r border-[#cbd8e5] font-mono font-bold text-[#0055a5]">
                        {et.id}
                      </td>
                      <td className="p-2 border-r border-[#cbd8e5] font-semibold text-[#003366]">
                        {et.name}
                      </td>
                      <td className="p-2 border-r border-[#cbd8e5] text-center font-mono font-bold text-emerald-700">
                        {et.reqApprovals}
                      </td>
                      <td className="p-2 border-r border-[#cbd8e5] text-center font-mono font-bold text-red-700">
                        {et.reqRejections}
                      </td>
                      <td className="p-2 text-gray-700">
                        {et.users.join(' · ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ParaPensar
        clave={`b1_aprobaciones_${c.data.profile?.uid ?? 'anon'}`}
        preguntas={[
          '¿Qué monto pondrías como límite? Si es muy bajo, frenas la operación; si es muy alto, pierdes control. ¿Cómo lo equilibras?',
          '¿Debería la misma persona que pide una compra poder aprobarla? ¿Qué riesgo de fraude evita separar funciones?',
          '¿Qué información mínima necesitas ver antes de aprobar una venta a crédito grande?',
        ]}
      />
    </Screen>
  );
}
