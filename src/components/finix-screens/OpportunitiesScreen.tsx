'use client';

import React, { useState, useMemo } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import type { EtapaOportunidad, Opportunity } from '@/lib/firestore-types';
import { Screen, Field, Table, inputClass, buttonClass } from './FinixControls';
import { ParaPensar } from './AnalysisBlocks';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShieldAlert,
  FileText,
  Paperclip,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  ChevronRight,
  Briefcase,
  Layers,
} from 'lucide-react';

const ETAPAS_OFICIALES: { clave: EtapaOportunidad; num: number; nombre: string; prob: number }[] = [
  { clave: 'prospecto', num: 1, nombre: '1 - Contacto inicial / Reunión', prob: 10 },
  { clave: 'calificado', num: 2, nombre: '2 - Presentación y Calificación', prob: 25 },
  { clave: 'propuesta', num: 3, nombre: '3 - Propuesta técnica y cotización', prob: 50 },
  { clave: 'negociacion', num: 4, nombre: '4 - Negociación comercial', prob: 75 },
  { clave: 'ganada', num: 5, nombre: '5 - Ganada / Cierre formal', prob: 100 },
  { clave: 'perdida', num: 6, nombre: '6 - Perdida / Descartada', prob: 0 },
];

const ABIERTAS: EtapaOportunidad[] = ['prospecto', 'calificado', 'propuesta', 'negociacion'];

const vacia = () => ({
  id: '',
  opportunityNumber: '',
  name: '',
  cardCode: '',
  contactPerson: 'Ing. Contacto Comercial',
  territory: 'Quito y Región Sierra Norte',
  salesEmployee: 'Carlos Viteri (Consultor Comercial)',
  amount: 15000,
  grossProfitPercent: 32,
  stage: 'prospecto' as EtapaOportunidad,
  probability: 10,
  expectedClose: today(),
  source: 'Referido',
  notes: '',
  lossReason: '',
  interestLevel: 'Alto' as 'Alto' | 'Medio' | 'Bajo',
  salesChannel: 'Directo',
  linkedProject: '',
  status: 'open' as 'open' | 'won' | 'lost',
});

type TabId = 'potencial' | 'general' | 'etapas' | 'socios' | 'competidores' | 'resumen' | 'anexos';

export default function OpportunitiesScreen() {
  const c = useCompany();
  const [f, setF] = useState(vacia());
  const [activeTab, setActiveTab] = useState<TabId>('etapas');
  const [statusMsg, setStatusMsg] = useState<{ tipo: 'ok' | 'err'; texto: string } | null>(null);

  // Datos simulados de socios y competidores para enriquecer la autenticidad SAP B1
  const [competitors, setCompetitors] = useState([
    { id: 'comp-1', name: 'Soluciones Andinas S.A.', threat: 'Media', strengths: 'Precio agresivo', weaknesses: 'Sin soporte local 24/7', won: false },
    { id: 'comp-2', name: 'Global Tech Corp', threat: 'Alta', strengths: 'Presencia internacional', weaknesses: 'Tiempos de entrega largos', won: false },
  ]);

  const [partners, setPartners] = useState([
    { id: 'part-1', relation: 'Integrador de hardware', name: 'Infraestructura Andina Cía.', phone: '02-2984500' },
    { id: 'part-2', relation: 'Consultor externo de procesos', name: 'Asesores ERP Ecuador', phone: '04-2651120' },
  ]);

  const [attachments, setAttachments] = useState([
    { id: 'att-1', name: 'Especificaciones_Tecnicas_RFP.pdf', date: today(), size: '2.4 MB', author: 'Comercial' },
    { id: 'att-2', name: 'Cotizacion_Preliminar_SAL001.pdf', date: today(), size: '480 KB', author: 'Ventas' },
  ]);

  const ops = c.data.opportunities || [];
  const abiertas = ops.filter(o => ABIERTAS.includes(o.stage));
  const ganadas = ops.filter(o => o.stage === 'ganada');
  const perdidas = ops.filter(o => o.stage === 'perdida');
  const embudo = round(abiertas.reduce((s, o) => s + o.amount, 0));
  const ponderado = round(abiertas.reduce((s, o) => s + (o.amount * o.probability) / 100, 0));
  const tasa = ganadas.length + perdidas.length ? round((ganadas.length / (ganadas.length + perdidas.length)) * 100) : null;
  const motivos = Object.entries(perdidas.reduce<Record<string, number>>((m, o) => ({ ...m, [o.lossReason]: (m[o.lossReason] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);
  const vencidas = abiertas.filter(o => o.expectedClose < today());

  const clienteSeleccionado = c.data.customers.find(cl => cl.cardCode === f.cardCode);

  const guardar = async () => {
    setStatusMsg(null);
    try {
      // Sincronizar estado con la etapa si el usuario cambió el radio
      let stageFinal = f.stage;
      if (f.status === 'won') stageFinal = 'ganada';
      if (f.status === 'lost') stageFinal = 'perdida';

      await c.save({
        action: 'opportunity',
        data: {
          id: f.id,
          name: f.name || `Oportunidad ${clienteSeleccionado?.name || 'Cliente'}`,
          cardCode: f.cardCode,
          amount: Number(f.amount) || 0,
          stage: stageFinal,
          probability: stageFinal === 'ganada' ? 100 : stageFinal === 'perdida' ? 0 : f.probability,
          expectedClose: f.expectedClose,
          source: f.source,
          notes: f.notes,
          lossReason: stageFinal === 'perdida' ? f.lossReason || 'Precio superior al presupuesto del cliente' : '',
        },
      });

      setStatusMsg({ tipo: 'ok', texto: '✓ Oportunidad comercial registrada con éxito en SAP Business One CRM.' });
      setF(vacia());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la oportunidad';
      setStatusMsg({ tipo: 'err', texto: `Error: ${msg}` });
    }
  };

  const editar = (o: Opportunity) => {
    setF({
      id: o.id,
      opportunityNumber: o.opportunityNumber || '',
      name: o.name,
      cardCode: o.cardCode,
      contactPerson: 'Ing. Contacto Comercial',
      territory: 'Quito y Región Sierra Norte',
      salesEmployee: 'Carlos Viteri (Consultor Comercial)',
      amount: o.amount,
      grossProfitPercent: 32,
      stage: o.stage,
      probability: o.probability,
      expectedClose: o.expectedClose,
      source: o.source,
      notes: o.notes,
      lossReason: o.lossReason,
      interestLevel: 'Alto',
      salesChannel: 'Directo',
      linkedProject: '',
      status: o.stage === 'ganada' ? 'won' : o.stage === 'perdida' ? 'lost' : 'open',
    });
  };

  const handleStageChange = (newStage: EtapaOportunidad) => {
    const meta = ETAPAS_OFICIALES.find(x => x.clave === newStage);
    const prob = meta?.prob ?? f.probability;
    setF(prev => ({
      ...prev,
      stage: newStage,
      probability: prob,
      status: newStage === 'ganada' ? 'won' : newStage === 'perdida' ? 'lost' : 'open',
    }));
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'potencial', label: 'Potencial', icon: <DollarSign size={12} /> },
    { id: 'general', label: 'General', icon: <FileText size={12} /> },
    { id: 'etapas', label: 'Etapas', icon: <Layers size={12} /> },
    { id: 'socios', label: 'Socios de negocios', icon: <Users size={12} /> },
    { id: 'competidores', label: 'Competidores', icon: <ShieldAlert size={12} /> },
    { id: 'resumen', label: 'Resumen', icon: <Briefcase size={12} /> },
    { id: 'anexos', label: 'Anexos', icon: <Paperclip size={12} /> },
  ];

  return (
    <Screen title="CRM · Oportunidades de Venta (SAP Business One)">
      {/* Barra Informativa Pedagógica */}
      <div className="border-l-4 border-[#0055A5] bg-white p-2.5 shadow-xs text-xs">
        <p className="text-[#333]">
          Gestión del embudo comercial en <strong>SAP Business One CRM</strong>. El <strong>pronóstico ponderado</strong> calcula la venta esperada
          multiplicando el importe potencial por la probabilidad de la etapa activa.
        </p>
      </div>

      {/* Tarjetas de Indicadores Clave (KPIs) */}
      <div className="grid gap-2 sm:grid-cols-4">
        {[
          ['Embudo abierto total', usd(embudo), 'text-[#003366]'],
          ['Pronóstico ponderado', usd(ponderado), 'text-emerald-700'],
          ['Tasa de cierre', tasa === null ? '—' : `${tasa} %`, 'text-blue-700'],
          ['Vencidas sin cerrar', String(vencidas.length), vencidas.length > 0 ? 'text-red-600' : 'text-gray-600'],
        ].map(([t, v, col]) => (
          <div key={t} className="border border-[#b8c9d4] bg-white p-2.5 rounded-xs shadow-2xs">
            <p className="text-[11px] text-gray-500 font-medium">{t}</p>
            <strong className={`text-base font-mono ${col}`}>{v}</strong>
          </div>
        ))}
      </div>

      {/* Embudo Visual de Oportunidades */}
      <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-xs">
        {ETAPAS_OFICIALES.map(e => {
          const lista = ops.filter(o => o.stage === e.clave);
          const totalEtapa = lista.reduce((s, o) => s + o.amount, 0);
          const isCurrentActive = f.stage === e.clave;
          return (
            <section
              key={e.clave}
              className={`border p-2 rounded-xs transition-all ${
                isCurrentActive ? 'border-[#0055A5] bg-[#FFFDE7] ring-1 ring-[#0055A5]' : 'border-[#cbd8e5] bg-[#f8fafc]'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-[#003366] text-[11px] border-b border-gray-200 pb-1 mb-1">
                <span>{e.nombre.split(' - ')[1] || e.nombre}</span>
                <span className="text-gray-500 font-normal">{e.prob}%</span>
              </div>
              <p className="text-[10.5px] text-gray-600 font-mono mb-1.5">
                {lista.length} ops · {usd(totalEtapa)}
              </p>
              <ul className="space-y-1">
                {lista.slice(0, 3).map(o => (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => editar(o)}
                      className="w-full border border-gray-200 bg-white p-1 rounded-xs text-left hover:bg-amber-50 cursor-pointer shadow-2xs text-[10px]"
                    >
                      <strong className="text-[#003366] truncate block">{o.name}</strong>
                      <span className="text-gray-500 truncate block">{o.cardName}</span>
                      <span className="font-mono text-emerald-700 font-semibold">{usd(o.amount)}</span>
                    </button>
                  </li>
                ))}
                {lista.length > 3 && <li className="text-[9.5px] text-gray-400 text-center">+{lista.length - 3} más...</li>}
              </ul>
            </section>
          );
        })}
      </div>

      {/* ── VENTANA CANÓNICA DE OPORTUNIDAD SAP BUSINESS ONE ── */}
      <form
        className="border border-[#a6b8cc] bg-white rounded-xs shadow-xs space-y-3 p-3 text-xs"
        onSubmit={e => {
          e.preventDefault();
          void guardar();
        }}
      >
        {/* Barra superior de la ventana SAP B1 */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#003366] text-sm flex items-center gap-1.5">
              <Briefcase size={16} className="text-[#0055a5]" />
              {f.id ? `Oportunidad de ventas — ${f.opportunityNumber || 'Edición'}` : 'Nueva oportunidad de venta'}
            </span>
            {f.id && (
              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                ID: {f.id}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setF(vacia())}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-gray-700 border border-gray-300 rounded text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> Nueva
            </button>
          </div>
        </div>

        {/* ── CABECERA CANÓNICA CON CAMPOS REALES DE SAP B1 ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f8fafc] p-3 border border-[#cbd8e5] rounded-xs text-[11px]">
          {/* Columna Izquierda: Código SN, Nombre SN, Persona Contacto, Territorio, Empleado Ventas */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="font-bold text-[#003366]">Código SN *</label>
              <div className="col-span-2 flex items-center gap-1">
                <select
                  required
                  className={`${inputClass} font-mono font-bold text-[#003366] bg-[#fffde7]`}
                  value={f.cardCode}
                  onChange={e => {
                    const code = e.target.value;
                    const cust = c.data.customers.find(cl => cl.cardCode === code);
                    setF(prev => ({
                      ...prev,
                      cardCode: code,
                      name: prev.name || (cust ? `Eq. y servicios — ${cust.name}` : ''),
                      contactPerson: cust?.contactName || prev.contactPerson,
                    }));
                  }}
                >
                  <option value="">-- Seleccionar Socio de Negocios --</option>
                  {c.data.customers.map(cl => (
                    <option key={cl.id} value={cl.cardCode}>
                      {cl.cardCode} · {cl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-gray-600 font-medium">Nombre SN</label>
              <input
                type="text"
                readOnly
                className="col-span-2 border border-gray-300 bg-gray-100 px-2 py-0.5 rounded text-[11px] text-gray-800"
                value={clienteSeleccionado?.name || ''}
                placeholder="Se completa al elegir el cliente"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-gray-600 font-medium">Persona de contacto</label>
              <input
                type="text"
                className="col-span-2 border border-gray-300 bg-white px-2 py-0.5 rounded text-[11px]"
                value={f.contactPerson}
                onChange={e => setF(v => ({ ...v, contactPerson: e.target.value }))}
                placeholder="Ej. Ing. Juan Pérez"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-gray-600 font-medium">Territorio</label>
              <select
                className="col-span-2 border border-gray-300 bg-white px-2 py-0.5 rounded text-[11px]"
                value={f.territory}
                onChange={e => setF(v => ({ ...v, territory: e.target.value }))}
              >
                <option value="Quito y Región Sierra Norte">Quito y Región Sierra Norte</option>
                <option value="Guayaquil y Región Litoral">Guayaquil y Región Litoral</option>
                <option value="Cuenca y Región Austral">Cuenca y Región Austral</option>
                <option value="Internacional / Exportación">Internacional / Exportación</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-gray-600 font-medium">Empleado de ventas</label>
              <select
                className="col-span-2 border border-gray-300 bg-white px-2 py-0.5 rounded text-[11px]"
                value={f.salesEmployee}
                onChange={e => setF(v => ({ ...v, salesEmployee: e.target.value }))}
              >
                <option value="Carlos Viteri (Consultor Comercial)">Carlos Viteri (Consultor Comercial)</option>
                <option value="Sofía Morales (Especialista Industrial)">Sofía Morales (Especialista Industrial)</option>
                <option value="Pablo García (Gerente de Cuentas)">Pablo García (Gerente de Cuentas)</option>
              </select>
            </div>
          </div>

          {/* Columna Derecha: Nombre Oportunidad, % Cierre, Estado, Cierre Previsto, Importe */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="font-bold text-[#003366]">Nombre de oportunidad *</label>
              <input
                required
                minLength={3}
                type="text"
                className="col-span-2 border border-gray-300 bg-white px-2 py-0.5 rounded text-[11px]"
                value={f.name}
                onChange={e => setF(v => ({ ...v, name: e.target.value }))}
                placeholder="Ej. Implementación Servidores Corporativos"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-gray-600 font-medium">% Cierre (Probabilidad)</label>
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="w-24 border border-gray-300 bg-white px-2 py-0.5 rounded text-[11px] font-mono font-bold text-center"
                  value={f.probability}
                  onChange={e => setF(v => ({ ...v, probability: Number(e.target.value) }))}
                  disabled={f.status === 'won' || f.status === 'lost'}
                />
                <span className="text-gray-500 font-bold">%</span>
                <span className="text-[10px] text-gray-500">
                  (Ponderado: {usd((f.amount * f.probability) / 100)})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="font-bold text-[#003366]">Estado de oportunidad</label>
              <div className="col-span-2 flex items-center gap-4">
                {[
                  { id: 'open', label: 'Abierto', color: 'text-blue-700' },
                  { id: 'won', label: 'Ganado', color: 'text-emerald-700 font-bold' },
                  { id: 'lost', label: 'Perdido', color: 'text-red-700 font-bold' },
                ].map(st => (
                  <label key={st.id} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={st.id}
                      checked={f.status === st.id}
                      onChange={() => {
                        const statusVal = st.id as 'open' | 'won' | 'lost';
                        setF(prev => ({
                          ...prev,
                          status: statusVal,
                          stage: statusVal === 'won' ? 'ganada' : statusVal === 'lost' ? 'perdida' : prev.stage === 'ganada' || prev.stage === 'perdida' ? 'propuesta' : prev.stage,
                          probability: statusVal === 'won' ? 100 : statusVal === 'lost' ? 0 : prev.probability,
                        }));
                      }}
                    />
                    <span className={st.color}>{st.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-gray-600 font-medium">Fecha de cierre prevista</label>
              <input
                type="date"
                className="col-span-2 border border-gray-300 bg-white px-2 py-0.5 rounded text-[11px]"
                value={f.expectedClose}
                onChange={e => setF(v => ({ ...v, expectedClose: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="font-bold text-[#003366]">Importe potencial (USD)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="col-span-2 border border-[#0055a5] bg-white px-2 py-0.5 rounded text-[11px] font-mono font-bold text-[#003366]"
                value={f.amount}
                onChange={e => setF(v => ({ ...v, amount: Number(e.target.value) }))}
              />
            </div>
          </div>
        </div>

        {/* ── BARRA DE PESTAÑAS OFICIALES DE SAP B1 ── */}
        <div className="border-b border-[#a6b8cc] flex items-center gap-1 select-none pt-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-xs font-bold rounded-t-xs border-t-2 border-x transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#003366] border-t-[#0055a5] border-x-[#a6b8cc] border-b-white -mb-px shadow-xs'
                  : 'bg-[#e2eaf2] text-[#475569] border-transparent hover:bg-white/70'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── CUERPO DE LAS 7 PESTAÑAS ── */}
        <div className="bg-white border border-[#a6b8cc] border-t-0 p-3 rounded-b-xs shadow-xs min-h-[200px]">
          {/* 1. PESTAÑA: POTENCIAL */}
          {activeTab === 'potencial' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Importe potencial total (USD)">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className={`${inputClass} font-mono font-bold`}
                    value={f.amount}
                    onChange={e => setF(v => ({ ...v, amount: Number(e.target.value) }))}
                  />
                </Field>
                <Field label="Ganancia bruta estimada (%)">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className={inputClass}
                    value={f.grossProfitPercent}
                    onChange={e => setF(v => ({ ...v, grossProfitPercent: Number(e.target.value) }))}
                  />
                </Field>
                <Field label="Ganancia bruta proyectada (USD)">
                  <input
                    type="text"
                    readOnly
                    className={`${inputClass} bg-gray-100 font-mono`}
                    value={usd((f.amount * f.grossProfitPercent) / 100)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Nivel de interés del cliente">
                  <select
                    className={inputClass}
                    value={f.interestLevel}
                    onChange={e => setF(v => ({ ...v, interestLevel: e.target.value as typeof f.interestLevel }))}
                  >
                    <option value="Alto">Alto — Decisión en menos de 30 días</option>
                    <option value="Medio">Medio — Evaluación presupuestaria</option>
                    <option value="Bajo">Bajo — Exploración preliminar</option>
                  </select>
                </Field>
                <Field label="Importe ponderado (Potencial × % Cierre)">
                  <input
                    type="text"
                    readOnly
                    className={`${inputClass} bg-emerald-50 text-emerald-800 font-mono font-bold`}
                    value={usd((f.amount * f.probability) / 100)}
                  />
                </Field>
                <Field label="Canal de venta">
                  <select
                    className={inputClass}
                    value={f.salesChannel}
                    onChange={e => setF(v => ({ ...v, salesChannel: e.target.value }))}
                  >
                    <option value="Directo">Venta Directa Corporativa</option>
                    <option value="Canal">Distribuidor / Integrador</option>
                    <option value="Licitación">Licitación Pública (SERCOP)</option>
                  </select>
                </Field>
              </div>
            </div>
          )}

          {/* 2. PESTAÑA: GENERAL */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Field label="Origen del contacto comercial">
                  <select
                    className={inputClass}
                    value={f.source}
                    onChange={e => setF(v => ({ ...v, source: e.target.value }))}
                  >
                    {['Referido', 'Web corporativa', 'Feria tecnológica', 'Llamada en frío', 'Cliente existente', 'Campaña redes'].map(x => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Proyecto financiero vinculado">
                  <select
                    className={inputClass}
                    value={f.linkedProject}
                    onChange={e => setF(v => ({ ...v, linkedProject: e.target.value }))}
                  >
                    <option value="">(Ninguno — Oportunidad aislada)</option>
                    {(c.data.projects || []).map(p => (
                      <option key={p.id} value={p.projectNumber}>
                        {p.projectNumber} · {p.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="space-y-2">
                <Field label="Comentarios generales y seguimiento">
                  <textarea
                    className={`${inputClass} min-h-20`}
                    value={f.notes}
                    onChange={e => setF(v => ({ ...v, notes: e.target.value }))}
                    placeholder="Detalles de la reunión comercial, necesidades técnicas del cliente y próximos pasos..."
                  />
                </Field>
              </div>
            </div>
          )}

          {/* 3. PESTAÑA: ETAPAS (MATRIZ CANÓNICA DE SAP B1) */}
          {activeTab === 'etapas' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#003366] text-xs">
                  Flujo de etapas del proceso de venta (Pipeline)
                </span>
                <span className="text-[11px] text-gray-500">
                  Haz clic en una etapa para marcar el avance actual de la oportunidad
                </span>
              </div>

              {/* Matriz canónica con columnas oficiales de SAP B1 */}
              <div className="border border-[#b0c2d4] rounded-xs overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#e9edf2] text-[#003366] border-b border-[#b0c2d4] font-bold text-[11px]">
                    <tr>
                      <th className="p-2 border-r border-[#cbd8e5] w-10 text-center">#</th>
                      <th className="p-2 border-r border-[#cbd8e5]">Etapa</th>
                      <th className="p-2 border-r border-[#cbd8e5] w-16 text-center">%</th>
                      <th className="p-2 border-r border-[#cbd8e5] text-right">Importe potencial</th>
                      <th className="p-2 border-r border-[#cbd8e5] text-right">Importe ponderado</th>
                      <th className="p-2 border-r border-[#cbd8e5]">Socio de negocios</th>
                      <th className="p-2 border-r border-[#cbd8e5]">Documento</th>
                      <th className="p-2 text-center w-24">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ETAPAS_OFICIALES.map((eta, idx) => {
                      const isRowActive = f.stage === eta.clave;
                      const rowAmount = f.amount;
                      const rowWeighted = (rowAmount * eta.prob) / 100;
                      return (
                        <tr
                          key={eta.clave}
                          className={`border-b border-[#e2e8f0] transition-colors ${
                            isRowActive ? 'bg-[#FFFDE7] font-semibold text-[#003366]' : idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfdfd]'
                          }`}
                        >
                          <td className="p-2 border-r border-[#cbd8e5] text-center font-mono text-gray-500">
                            {eta.num}
                          </td>
                          <td className="p-2 border-r border-[#cbd8e5] flex items-center gap-1.5">
                            {isRowActive && <span className="w-2 h-2 rounded-full bg-[#0055a5]"></span>}
                            <span>{eta.nombre}</span>
                          </td>
                          <td className="p-2 border-r border-[#cbd8e5] text-center font-mono">
                            {eta.prob}%
                          </td>
                          <td className="p-2 border-r border-[#cbd8e5] text-right font-mono">
                            {usd(rowAmount)}
                          </td>
                          <td className="p-2 border-r border-[#cbd8e5] text-right font-mono text-emerald-700">
                            {usd(rowWeighted)}
                          </td>
                          <td className="p-2 border-r border-[#cbd8e5] text-gray-700 truncate max-w-xs">
                            {clienteSeleccionado?.name || f.cardCode || '—'}
                          </td>
                          <td className="p-2 border-r border-[#cbd8e5] font-mono text-gray-600">
                            {eta.clave === 'propuesta' ? 'SAL001 (Oferta)' : eta.clave === 'ganada' ? 'SAL002 (Pedido)' : '—'}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleStageChange(eta.clave)}
                              className={`px-2 py-0.5 text-[10px] rounded border cursor-pointer ${
                                isRowActive
                                  ? 'bg-[#0055a5] text-white border-[#004080]'
                                  : 'bg-white hover:bg-slate-100 text-gray-700 border-gray-300'
                              }`}
                            >
                              {isRowActive ? 'Activa' : 'Fijar'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. PESTAÑA: SOCIOS DE NEGOCIOS ASOCIADOS */}
          {activeTab === 'socios' && (
            <div className="space-y-3">
              <p className="text-gray-600 text-xs">
                Socios de negocios que participan o colaboran en la oportunidad (ej. subcontratistas, integradores o distribuidores locales).
              </p>
              <div className="border border-[#b0c2d4] rounded-xs overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#e9edf2] text-[#003366] border-b border-[#b0c2d4] font-bold">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Rol / Relación</th>
                      <th className="p-2">Socio de Negocios</th>
                      <th className="p-2">Contacto / Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((p, idx) => (
                      <tr key={p.id} className="border-b border-gray-100">
                        <td className="p-2 text-gray-500 font-mono">{idx + 1}</td>
                        <td className="p-2 font-medium">{p.relation}</td>
                        <td className="p-2 text-[#003366] font-bold">{p.name}</td>
                        <td className="p-2 font-mono text-gray-600">{p.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. PESTAÑA: COMPETIDORES */}
          {activeTab === 'competidores' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#003366]">Análisis de competencia en la licitación</span>
              </div>
              <div className="border border-[#b0c2d4] rounded-xs overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#e9edf2] text-[#003366] border-b border-[#b0c2d4] font-bold">
                    <tr>
                      <th className="p-2">Competidor</th>
                      <th className="p-2">Nivel de amenaza</th>
                      <th className="p-2">Fortalezas</th>
                      <th className="p-2">Debilidades</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitors.map(c => (
                      <tr key={c.id} className="border-b border-gray-100">
                        <td className="p-2 font-bold text-[#003366]">{c.name}</td>
                        <td className="p-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              c.threat === 'Alta' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {c.threat}
                          </span>
                        </td>
                        <td className="p-2 text-gray-700">{c.strengths}</td>
                        <td className="p-2 text-gray-700">{c.weaknesses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. PESTAÑA: RESUMEN */}
          {activeTab === 'resumen' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 border border-gray-200 p-2.5 rounded-xs bg-[#f8fafc]">
                  <h4 className="font-bold text-[#003366]">Resultado de la Oportunidad</h4>
                  <p>Estado actual: <strong>{f.status === 'won' ? 'Ganada ✔' : f.status === 'lost' ? 'Perdida ✖' : 'En proceso comercial'}</strong></p>
                  <p>Etapa actual: <strong>{ETAPAS_OFICIALES.find(e => e.clave === f.stage)?.nombre}</strong></p>
                  <p>Importe total: <strong>{usd(f.amount)}</strong></p>
                  <p>Ponderado esperado: <strong>{usd((f.amount * f.probability) / 100)}</strong></p>
                </div>

                {f.status === 'lost' && (
                  <div className="space-y-2 border border-red-200 p-2.5 rounded-xs bg-red-50">
                    <Field label="Motivo de la pérdida (Obligatorio para aprender)" required>
                      <input
                        required
                        minLength={5}
                        className={inputClass}
                        value={f.lossReason}
                        onChange={e => setF(v => ({ ...v, lossReason: e.target.value }))}
                        placeholder="Ej. Precio 15% más alto que Soluciones Andinas, entrega no compatible..."
                      />
                    </Field>
                    <p className="text-[10px] text-red-700">
                      En SAP Business One, cada oportunidad perdida debe registrar su causa para alimentar las estadísticas de mejora comercial.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. PESTAÑA: ANEXOS */}
          {activeTab === 'anexos' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#003366]">Documentos adjuntos a la oportunidad</span>
                <button
                  type="button"
                  onClick={() => {
                    const name = prompt('Nombre del archivo anexo (ej. Oferta_Firmada.pdf):');
                    if (name) {
                      setAttachments(prev => [
                        ...prev,
                        { id: `att-${Date.now()}`, name, date: today(), size: '1.1 MB', author: 'Consultor' },
                      ]);
                    }
                  }}
                  className="px-2 py-1 bg-white hover:bg-slate-100 border border-gray-300 text-gray-700 rounded text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Paperclip size={12} /> Adjuntar documento
                </button>
              </div>
              <div className="border border-[#b0c2d4] rounded-xs overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#e9edf2] text-[#003366] border-b border-[#b0c2d4] font-bold">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Nombre del archivo</th>
                      <th className="p-2">Fecha</th>
                      <th className="p-2">Tamaño</th>
                      <th className="p-2">Usuario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attachments.map((att, idx) => (
                      <tr key={att.id} className="border-b border-gray-100">
                        <td className="p-2 text-gray-500 font-mono">{idx + 1}</td>
                        <td className="p-2 font-mono text-[#0055a5] font-semibold flex items-center gap-1">
                          <FileText size={12} /> {att.name}
                        </td>
                        <td className="p-2 font-mono text-gray-600">{att.date}</td>
                        <td className="p-2 font-mono text-gray-600">{att.size}</td>
                        <td className="p-2 text-gray-700">{att.author}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Notificación de estado */}
        {statusMsg && (
          <div
            className={`p-2 rounded text-xs font-semibold ${
              statusMsg.tipo === 'ok'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-red-100 text-red-900 border border-red-300'
            }`}
          >
            {statusMsg.texto}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
          <button
            type="submit"
            className={`${buttonClass} font-bold text-white bg-[#0055a5] hover:bg-[#004080]`}
            disabled={c.saving}
          >
            {f.id ? 'Actualizar oportunidad' : 'Crear oportunidad'}
          </button>
          {f.id && (
            <button
              type="button"
              className={buttonClass}
              onClick={() => setF(vacia())}
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {/* Motivos de pérdida históricos */}
      {motivos.length > 0 && (
        <div className="space-y-1">
          <h3 className="font-bold text-[#003366] text-xs">Causas de pérdida registradas (Inteligencia de Ventas)</h3>
          <Table headers={['Causa de la pérdida', 'Oportunidades afectadas']} rows={motivos.map(([m, n]) => [m, n])} />
        </div>
      )}

      {/* Bloque pedagógico de análisis */}
      <ParaPensar
        clave={`b1_crm_${c.data.profile?.uid ?? 'anon'}`}
        preguntas={[
          'Si tu meta mensual es 20.000 USD y el pronóstico ponderado es 12.000, ¿cuántas oportunidades nuevas necesitas y en qué etapa?',
          '¿Qué te dice el motivo de pérdida más frecuente sobre tu precio, tu producto o tu servicio?',
          'Una oportunidad lleva tres meses en "Negociación". ¿La sigues contando en el pronóstico? ¿Qué harías con ella?',
        ]}
      />
    </Screen>
  );
}
