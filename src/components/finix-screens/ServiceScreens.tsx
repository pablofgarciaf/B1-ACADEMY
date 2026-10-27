'use client';

import React, { useState, useMemo } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import type { EstadoLlamada, ServiceCall, ServiceContract, Project } from '@/lib/firestore-types';
import { Screen, Field, Table, inputClass, buttonClass } from './FinixControls';
import { ParaPensar } from './AnalysisBlocks';
import {
  Wrench,
  ShieldCheck,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Layers,
  Plus,
  Search,
  FileText,
  Laptop,
  Check,
  TrendingUp,
} from 'lucide-react';

const TIPO_CONTRATO = {
  garantia: 'Garantía oficial del fabricante',
  mantenimiento: 'Mantenimiento preventivo mensual',
  soporte: 'Soporte técnico 24/7 y asistencia remota',
} as const;

const ESTADO: Record<EstadoLlamada, string> = {
  abierta: 'Abierta',
  en_proceso: 'En proceso',
  resuelta: 'Resuelta',
  cerrada: 'Cerrada',
};

const ahoraLocal = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

// ─────────────────────────────────────────────────────────────────────────────
// 1. TARJETA DE EQUIPO DEL CLIENTE (Customer Equipment Card - OINS)
// ─────────────────────────────────────────────────────────────────────────────
export interface EquipmentCard {
  id: string;
  insID: string;
  mfrSerialNo: string;
  internalSerialNo: string;
  itemCode: string;
  itemName: string;
  cardCode: string;
  cardName: string;
  contactPerson: string;
  address: string;
  status: 'active' | 'in_repair' | 'returned' | 'terminated';
  technician: string;
  contractNumber: string;
  warrantyStart: string;
  warrantyEnd: string;
}

export function CustomerEquipmentCardScreen({ onSelectCard }: { onSelectCard?: (card: EquipmentCard) => void }) {
  const c = useCompany();
  const [cards, setCards] = useState<EquipmentCard[]>([
    {
      id: 'eq-001',
      insID: 'EQ-1001',
      mfrSerialNo: 'SN-DELL-99214A',
      internalSerialNo: 'INT-SRV-01',
      itemCode: c.data.items[0]?.itemCode || 'ITM001',
      itemName: c.data.items[0]?.name || 'Servidor Rack 2U Enterprise',
      cardCode: c.data.customers[0]?.cardCode || 'CL001',
      cardName: c.data.customers[0]?.name || 'Corporación Favorita',
      contactPerson: 'Ing. Roberto Andrade',
      address: 'Av. Eloy Alfaro y Amazonas, Quito',
      status: 'active',
      technician: 'Carlos Viteri',
      contractNumber: c.data.serviceContracts[0]?.contractNumber || 'CTR-2026-001',
      warrantyStart: '2026-01-01',
      warrantyEnd: '2027-01-01',
    },
    {
      id: 'eq-002',
      insID: 'EQ-1002',
      mfrSerialNo: 'SN-HP-88741X',
      internalSerialNo: 'INT-IMP-02',
      itemCode: c.data.items[1]?.itemCode || 'ITM002',
      itemName: c.data.items[1]?.name || 'Impresora Térmica Facturación',
      cardCode: c.data.customers[1]?.cardCode || 'CL002',
      cardName: c.data.customers[1]?.name || 'Pronaca S.A.',
      contactPerson: 'Lcda. María Elena Peña',
      address: 'Vía Daule Km 12.5, Guayaquil',
      status: 'active',
      technician: 'Mariana Gómez',
      contractNumber: 'CTR-2026-002',
      warrantyStart: '2025-06-01',
      warrantyEnd: '2026-06-01',
    },
  ]);

  const [form, setForm] = useState({
    mfrSerialNo: '',
    internalSerialNo: '',
    itemCode: '',
    cardCode: '',
    contactPerson: '',
    technician: 'Carlos Viteri',
    warrantyEnd: '2027-12-31',
  });

  const [msg, setMsg] = useState('');

  const registrarTarjeta = (e: React.FormEvent) => {
    e.preventDefault();
    const cliente = c.data.customers.find(cl => cl.cardCode === form.cardCode);
    const item = c.data.items.find(it => it.itemCode === form.itemCode);
    if (!cliente || !item) return;

    const nueva: EquipmentCard = {
      id: `eq-${Date.now()}`,
      insID: `EQ-${1000 + cards.length + 1}`,
      mfrSerialNo: form.mfrSerialNo || `SN-${Date.now()}`,
      internalSerialNo: form.internalSerialNo || `INT-${cards.length + 1}`,
      itemCode: item.itemCode,
      itemName: item.name,
      cardCode: cliente.cardCode,
      cardName: cliente.name,
      contactPerson: form.contactPerson || cliente.contactName || 'Contacto Comercial',
      address: cliente.address || 'Quito, Pichincha',
      status: 'active',
      technician: form.technician,
      contractNumber: 'CTR-ACTIVO',
      warrantyStart: today(),
      warrantyEnd: form.warrantyEnd,
    };

    setCards(prev => [nueva, ...prev]);
    setMsg(`✓ Tarjeta de equipo ${nueva.insID} creada y vinculada al cliente.`);
    setForm({
      mfrSerialNo: '',
      internalSerialNo: '',
      itemCode: '',
      cardCode: '',
      contactPerson: '',
      technician: 'Carlos Viteri',
      warrantyEnd: '2027-12-31',
    });
  };

  return (
    <div className="space-y-3">
      <div className="border-l-4 border-[#0055A5] bg-white p-2.5 rounded-r-xs shadow-xs text-xs">
        <p className="text-gray-700">
          <strong>Tarjeta de Equipo del Cliente (Customer Equipment Card):</strong> En SAP Business One, cada equipo o producto con número de serie entregado al cliente cuenta con una tarjeta única que registra su fabricante, vigencia de garantía y su historial completo de llamadas de soporte.
        </p>
      </div>

      {/* Formulario de registro de Tarjeta de Equipo */}
      <form onSubmit={registrarTarjeta} className="p-3 bg-white border border-[#a6b8cc] rounded-xs shadow-xs space-y-3 text-xs">
        <h4 className="font-bold text-[#003366] flex items-center gap-1.5 text-xs">
          <Laptop size={14} className="text-[#0055a5]" /> Registrar Nueva Tarjeta de Equipo
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <Field label="Cliente / Socio *" required>
            <select
              required
              className={inputClass}
              value={form.cardCode}
              onChange={e => setForm(v => ({ ...v, cardCode: e.target.value }))}
            >
              <option value="">Selecciona cliente...</option>
              {c.data.customers.map(cl => (
                <option key={cl.id} value={cl.cardCode}>
                  {cl.cardCode} · {cl.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Artículo / Producto *" required>
            <select
              required
              className={inputClass}
              value={form.itemCode}
              onChange={e => setForm(v => ({ ...v, itemCode: e.target.value }))}
            >
              <option value="">Selecciona artículo...</option>
              {c.data.items.map(it => (
                <option key={it.id} value={it.itemCode}>
                  {it.itemCode} · {it.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="N° Serie Fabricante *" required>
            <input
              required
              className={`${inputClass} font-mono`}
              placeholder="Ej. SN-DELL-8839X"
              value={form.mfrSerialNo}
              onChange={e => setForm(v => ({ ...v, mfrSerialNo: e.target.value }))}
            />
          </Field>

          <Field label="N° Serie Interno">
            <input
              className={`${inputClass} font-mono`}
              placeholder="Ej. INT-SRV-04"
              value={form.internalSerialNo}
              onChange={e => setForm(v => ({ ...v, internalSerialNo: e.target.value }))}
            />
          </Field>

          <Field label="Técnico Asignado">
            <input
              className={inputClass}
              value={form.technician}
              onChange={e => setForm(v => ({ ...v, technician: e.target.value }))}
            />
          </Field>

          <Field label="Vencimiento de Garantía">
            <input
              type="date"
              className={inputClass}
              value={form.warrantyEnd}
              onChange={e => setForm(v => ({ ...v, warrantyEnd: e.target.value }))}
            />
          </Field>
        </div>

        {msg && <p className="text-emerald-700 font-semibold text-xs">{msg}</p>}

        <button type="submit" className={`${buttonClass} font-bold text-white bg-[#0055a5] hover:bg-[#004080]`}>
          Registrar Tarjeta de Equipo
        </button>
      </form>

      {/* Matriz de Tarjetas de Equipo existentes */}
      <div className="border border-[#b0c2d4] bg-white rounded-xs overflow-x-auto shadow-xs">
        <div className="bg-[#e9edf2] px-3 py-1.5 border-b border-[#b0c2d4] font-bold text-xs text-[#003366] flex items-center justify-between">
          <span>Catálogo de Tarjetas de Equipo Instaladas ({cards.length})</span>
        </div>
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#f0f4f8] text-[#003366] border-b border-[#cbd8e5] text-[11px] font-bold">
            <tr>
              <th className="p-2 border-r border-[#cbd8e5]">N° Tarjeta</th>
              <th className="p-2 border-r border-[#cbd8e5]">N° Serie Fabricante</th>
              <th className="p-2 border-r border-[#cbd8e5]">Artículo</th>
              <th className="p-2 border-r border-[#cbd8e5]">Cliente</th>
              <th className="p-2 border-r border-[#cbd8e5]">Garantía Hasta</th>
              <th className="p-2 border-r border-[#cbd8e5]">Técnico</th>
              <th className="p-2 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((cd, idx) => (
              <tr
                key={cd.id}
                onClick={() => onSelectCard?.(cd)}
                className={`border-b border-gray-100 hover:bg-[#FFFDE7] cursor-pointer ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'
                }`}
              >
                <td className="p-2 border-r border-[#cbd8e5] font-mono font-bold text-[#0055a5]">
                  {cd.insID}
                </td>
                <td className="p-2 border-r border-[#cbd8e5] font-mono font-semibold text-gray-800">
                  {cd.mfrSerialNo}
                </td>
                <td className="p-2 border-r border-[#cbd8e5] text-gray-800">
                  {cd.itemName}
                </td>
                <td className="p-2 border-r border-[#cbd8e5] text-gray-800 font-medium">
                  {cd.cardName}
                </td>
                <td className="p-2 border-r border-[#cbd8e5] font-mono text-gray-600">
                  {cd.warrantyEnd}
                </td>
                <td className="p-2 border-r border-[#cbd8e5] text-gray-700">
                  {cd.technician}
                </td>
                <td className="p-2 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Activo
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONTRATOS DE SERVICIO CON SLA (Service Contracts - OCTR)
// ─────────────────────────────────────────────────────────────────────────────
export function ServiceContractsScreen() {
  const c = useCompany();
  const [f, setF] = useState({
    cardCode: '',
    type: 'soporte' as keyof typeof TIPO_CONTRATO,
    startDate: today(),
    endDate: `${Number(today().slice(0, 4)) + 1}${today().slice(4)}`,
    monthlyFee: 250,
    responseHours: 8,
    coverage: '10 equipos corporativos, mantenimiento preventivo trimestral, repuestos menores',
  });

  const [activeSubTab, setActiveSubTab] = useState<'general' | 'equipos' | 'sla' | 'anexos'>('general');

  const activos = c.data.serviceContracts.filter(k => k.status === 'active' && k.endDate >= today());
  const ingresoMensual = round(activos.reduce((s, k) => s + k.monthlyFee, 0));

  return (
    <Screen title="Servicio · Contratos de Servicio y SLA (OCTR)">
      <div className="border-l-4 border-[#0055A5] bg-white p-2.5 rounded-r-xs shadow-xs text-xs">
        <p className="text-gray-700">
          Un <strong>Contrato de Servicio</strong> en SAP B1 ampara los equipos del cliente, garantizando ingresos recurrentes y fijando el tiempo máximo de respuesta o <strong>SLA (Service Level Agreement)</strong>.
        </p>
      </div>

      {/* Resumen de contratos activos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="border border-[#b8c9d4] bg-white p-2.5 rounded-xs shadow-2xs">
          <span className="text-gray-500 font-medium block">Contratos Vigentes:</span>
          <strong className="text-lg font-mono text-[#003366]">{activos.length}</strong>
        </div>
        <div className="border border-[#b8c9d4] bg-white p-2.5 rounded-xs shadow-2xs">
          <span className="text-gray-500 font-medium block">Ingreso Recurrente Mensual (MRR):</span>
          <strong className="text-lg font-mono text-emerald-700">{usd(ingresoMensual)}</strong>
        </div>
        <div className="border border-[#b8c9d4] bg-white p-2.5 rounded-xs shadow-2xs">
          <span className="text-gray-500 font-medium block">SLA Promedio Comprometido:</span>
          <strong className="text-lg font-mono text-blue-700">
            {activos.length ? Math.round(activos.reduce((s, k) => s + k.responseHours, 0) / activos.length) : 8} horas
          </strong>
        </div>
      </div>

      {/* Formulario con pestañas oficiales */}
      <form
        className="space-y-3 border border-[#a6b8cc] bg-white p-3 rounded-xs shadow-xs text-xs"
        onSubmit={async e => {
          e.preventDefault();
          try {
            await c.save({ action: 'serviceContract', data: f });
            setF(v => ({ ...v, coverage: '' }));
          } catch {
            /* error visible */
          }
        }}
      >
        <h3 className="font-bold text-[#003366] flex items-center gap-1.5 text-xs">
          <ShieldCheck size={14} className="text-[#0055a5]" /> Registrar Nuevo Contrato de Servicio
        </h3>

        {/* Pestañas del contrato */}
        <div className="border-b border-[#a6b8cc] flex items-center gap-1 select-none pt-1">
          {[
            { id: 'general', label: 'General' },
            { id: 'equipos', label: 'Equipos y Cobertura' },
            { id: 'sla', label: 'Horario y SLA' },
            { id: 'anexos', label: 'Anexos' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`px-3 py-1 text-xs font-bold rounded-t-xs border-t-2 border-x transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-white text-[#003366] border-t-[#0055a5] border-x-[#a6b8cc] border-b-white -mb-px shadow-xs'
                  : 'bg-[#e2eaf2] text-[#475569] border-transparent hover:bg-white/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-[#a6b8cc] border-t-0 p-3 rounded-b-xs min-h-[160px]">
          {activeSubTab === 'general' && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Cliente *" required>
                <select
                  required
                  className={inputClass}
                  value={f.cardCode}
                  onChange={e => setF(v => ({ ...v, cardCode: e.target.value }))}
                >
                  <option value="">Selecciona cliente...</option>
                  {c.data.customers.map(x => (
                    <option key={x.id} value={x.cardCode}>
                      {x.cardCode} · {x.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tipo de Contrato">
                <select
                  className={inputClass}
                  value={f.type}
                  onChange={e => setF(v => ({ ...v, type: e.target.value as keyof typeof TIPO_CONTRATO }))}
                >
                  {Object.entries(TIPO_CONTRATO).map(([k, n]) => (
                    <option key={k} value={k}>{n}</option>
                  ))}
                </select>
              </Field>
              <Field label="Fecha de Inicio">
                <input
                  type="date"
                  className={inputClass}
                  value={f.startDate}
                  onChange={e => setF(v => ({ ...v, startDate: e.target.value }))}
                />
              </Field>
              <Field label="Fecha de Fin">
                <input
                  type="date"
                  className={inputClass}
                  value={f.endDate}
                  onChange={e => setF(v => ({ ...v, endDate: e.target.value }))}
                />
              </Field>
            </div>
          )}

          {activeSubTab === 'equipos' && (
            <div className="space-y-3">
              <Field label="Detalle de Cobertura y Equipos Incluidos *" required>
                <input
                  required
                  minLength={3}
                  className={inputClass}
                  value={f.coverage}
                  onChange={e => setF(v => ({ ...v, coverage: e.target.value }))}
                  placeholder="Ej.: 10 servidores Dell, reemplazo de fuentes de poder, mantenimiento semestral..."
                />
              </Field>
              <p className="text-gray-500 text-[11px]">
                En SAP Business One, las Tarjetas de Equipo se asocian a este contrato para autorizar llamadas sin cobro de mano de obra.
              </p>
            </div>
          )}

          {activeSubTab === 'sla' && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Cuota mensual de mantenimiento (USD)">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={`${inputClass} font-mono font-bold`}
                  value={f.monthlyFee}
                  onChange={e => setF(v => ({ ...v, monthlyFee: Number(e.target.value) }))}
                />
              </Field>
              <Field label="SLA: Compromiso máximo de respuesta (Horas)">
                <input
                  type="number"
                  min={1}
                  max={720}
                  className={`${inputClass} font-mono font-bold text-[#0055a5]`}
                  value={f.responseHours}
                  onChange={e => setF(v => ({ ...v, responseHours: Number(e.target.value) }))}
                />
              </Field>
            </div>
          )}

          {activeSubTab === 'anexos' && (
            <div className="space-y-2">
              <p className="text-gray-600">Adjunta el contrato físico o digital firmado por ambas partes.</p>
              <div className="border border-dashed border-gray-300 p-3 text-center rounded bg-gray-50 text-gray-500 text-xs">
                Contrato_SLA_Firmado.pdf · 1.8 MB (Adjunto certificado)
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`${buttonClass} font-bold text-white bg-[#0055a5] hover:bg-[#004080]`}
          disabled={c.saving}
        >
          Registrar contrato oficial
        </button>
      </form>

      {/* Tabla de contratos */}
      <div className="border border-[#b0c2d4] bg-white rounded-xs overflow-x-auto shadow-xs">
        <Table
          headers={['N° Contrato', 'Cliente', 'Tipo de Servicio', 'Vigencia', 'Cuota Mensual', 'SLA Garantizado', 'Cobertura']}
          rows={c.data.serviceContracts.map(k => [
            <span key="c" className="font-mono font-bold text-[#0055a5]">{k.contractNumber}</span>,
            k.cardName,
            TIPO_CONTRATO[k.type] || k.type,
            `${k.startDate} a ${k.endDate}`,
            <span key="v" className="font-mono text-emerald-700 font-bold">{usd(k.monthlyFee)}</span>,
            <span key="h" className="font-mono text-blue-700 font-semibold">{k.responseHours} h</span>,
            k.coverage,
          ])}
        />
      </div>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LLAMADAS DE SERVICIO (Service Calls - OSCL)
// ─────────────────────────────────────────────────────────────────────────────
function FilaLlamada({ l }: { l: ServiceCall }) {
  const c = useCompany();
  const [f, setF] = useState({
    status: l.status,
    technician: l.technician,
    resolution: l.resolution,
    hoursWorked: l.hoursWorked,
  });

  const [activeTab, setActiveTab] = useState<'general' | 'solucion' | 'gastos'>('general');

  const guardar = async () => {
    try {
      await c.save({
        action: 'serviceCallUpdate',
        data: { id: l.id, ...f, at: new Date().toISOString() },
      });
    } catch {
      /* error visible */
    }
  };

  const cerrada = l.status === 'cerrada';

  return (
    <article className="space-y-2 border border-[#999] bg-white p-3 rounded-xs shadow-xs text-xs">
      <header className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-200 pb-1.5 font-bold">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[#0055a5] text-sm">{l.callNumber}</span>
          <span className="text-gray-400">|</span>
          <span className="text-[#003366]">{l.cardName}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-700 font-normal">{l.subject}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              l.priority === 'alta'
                ? 'bg-red-100 text-red-800'
                : l.priority === 'media'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            Prioridad {l.priority.toUpperCase()}
          </span>
          <span className="font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
            {l.responseHours ? `SLA: ${l.responseHours} h` : 'Sin SLA'}
          </span>
        </div>
      </header>

      <p className="text-gray-500 text-[11px]">
        Abierta: {new Date(l.openedAt).toLocaleString('es-EC')}
        {l.resolvedAt && ` · Resuelta: ${new Date(l.resolvedAt).toLocaleString('es-EC')}`}
        {l.slaMet !== null && (
          <strong className={l.slaMet ? 'text-emerald-700' : 'text-red-700'}>
            {' '}· {l.slaMet ? '✓ SLA Cumplido' : '✖ SLA Incumplido'}
          </strong>
        )}
      </p>

      {/* Pestañas internas de la llamada */}
      <div className="flex gap-1 border-b border-gray-200 text-[11px] pt-1">
        {[
          { id: 'general', label: 'Estado y Técnico' },
          { id: 'solucion', label: 'Solución Aplicada' },
          { id: 'gastos', label: 'Costos y Horas' },
        ].map(tb => (
          <button
            key={tb.id}
            type="button"
            onClick={() => setActiveTab(tb.id as typeof activeTab)}
            className={`px-2.5 py-0.5 font-bold cursor-pointer ${
              activeTab === tb.id
                ? 'border-b-2 border-[#0055a5] text-[#0055a5]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 pt-1">
          <Field label="Estado">
            <select
              disabled={cerrada}
              className={inputClass}
              value={f.status}
              onChange={e => setF(v => ({ ...v, status: e.target.value as EstadoLlamada }))}
            >
              {(Object.keys(ESTADO) as EstadoLlamada[]).map(k => (
                <option key={k} value={k}>{ESTADO[k]}</option>
              ))}
            </select>
          </Field>
          <Field label="Técnico asignado">
            <input
              disabled={cerrada}
              className={inputClass}
              value={f.technician}
              onChange={e => setF(v => ({ ...v, technician: e.target.value }))}
            />
          </Field>
          <Field label="Artículo / N° Serie reportado">
            <input
              disabled
              className={`${inputClass} bg-gray-50 font-mono`}
              value={l.itemCode || 'Servicio General'}
            />
          </Field>
        </div>
      )}

      {activeTab === 'solucion' && (
        <div className="space-y-1.5 pt-1">
          <Field label="Diagnóstico y Solución Definitiva">
            <textarea
              disabled={cerrada}
              className={`${inputClass} min-h-16`}
              value={f.resolution}
              onChange={e => setF(v => ({ ...v, resolution: e.target.value }))}
              placeholder="Describa la solución técnica ejecutada..."
            />
          </Field>
        </div>
      )}

      {activeTab === 'gastos' && (
        <div className="grid gap-2 sm:grid-cols-2 pt-1">
          <Field label="Horas trabajadas">
            <input
              disabled={cerrada}
              type="number"
              min={0}
              step="0.25"
              className={`${inputClass} font-mono`}
              value={f.hoursWorked}
              onChange={e => setF(v => ({ ...v, hoursWorked: Number(e.target.value) }))}
            />
          </Field>
          <Field label="Costo liquidado estimado (USD)">
            <input
              disabled
              className={`${inputClass} bg-gray-50 font-mono`}
              value={usd(f.hoursWorked * 35)}
            />
          </Field>
        </div>
      )}

      {!cerrada && (
        <div className="pt-1">
          <button
            type="button"
            className={`${buttonClass} font-bold text-white bg-[#0055a5] hover:bg-[#004080]`}
            disabled={c.saving}
            onClick={guardar}
          >
            Actualizar Llamada de Servicio
          </button>
        </div>
      )}
    </article>
  );
}

export function ServiceCallsScreen() {
  const c = useCompany();
  const [f, setF] = useState({
    cardCode: '',
    subject: '',
    itemCode: '',
    priority: 'media' as 'alta' | 'media' | 'baja',
    openedAt: ahoraLocal(),
  });

  const [subView, setSubView] = useState<'llamadas' | 'tarjetas'>('llamadas');

  const llamadas = [...c.data.serviceCalls].sort((a, b) => b.openedAt.localeCompare(a.openedAt));
  const conSla = llamadas.filter(l => l.slaMet !== null);
  const cumplimiento = conSla.length ? round((conSla.filter(l => l.slaMet).length / conSla.length) * 100) : null;
  const resueltas = llamadas.filter(l => l.resolvedAt);
  const mttr = resueltas.length
    ? round(resueltas.reduce((s, l) => s + (Date.parse(l.resolvedAt) - Date.parse(l.openedAt)) / 3_600_000, 0) / resueltas.length)
    : null;

  return (
    <Screen title="Servicio · Llamadas de Servicio y Tarjetas de Equipo (OSCL/OINS)">
      {/* Selector superior de vista */}
      <div className="flex gap-2 border-b border-[#a6b8cc] pb-1">
        <button
          type="button"
          onClick={() => setSubView('llamadas')}
          className={`px-3 py-1 font-bold text-xs rounded-t flex items-center gap-1.5 cursor-pointer ${
            subView === 'llamadas'
              ? 'bg-[#0055a5] text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Wrench size={13} /> Llamadas de Servicio (Incidentes)
        </button>
        <button
          type="button"
          onClick={() => setSubView('tarjetas')}
          className={`px-3 py-1 font-bold text-xs rounded-t flex items-center gap-1.5 cursor-pointer ${
            subView === 'tarjetas'
              ? 'bg-[#0055a5] text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Laptop size={13} /> Tarjetas de Equipo del Cliente
        </button>
      </div>

      {subView === 'tarjetas' ? (
        <CustomerEquipmentCardScreen />
      ) : (
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ['Llamadas abiertas', String(llamadas.filter(l => l.status === 'abierta' || l.status === 'en_proceso').length), 'text-[#003366]'],
              ['Cumplimiento de SLA', cumplimiento === null ? '—' : `${cumplimiento} %`, 'text-emerald-700'],
              ['Tiempo medio de solución (MTTR)', mttr === null ? '—' : `${mttr} h`, 'text-blue-700'],
            ].map(([t, v, col]) => (
              <div key={t} className="border border-[#999] bg-white p-3 rounded-xs shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">{t}</p>
                <strong className={`text-lg font-mono ${col}`}>{v}</strong>
              </div>
            ))}
          </div>

          <form
            className="space-y-2 border border-[#999] bg-white p-3 rounded-xs shadow-xs text-xs"
            onSubmit={async e => {
              e.preventDefault();
              try {
                await c.save({ action: 'serviceCall', data: { ...f, openedAt: new Date(f.openedAt).toISOString() } });
                setF(v => ({ ...v, subject: '' }));
              } catch {
                /* error visible */
              }
            }}
          >
            <h3 className="font-bold text-[#003366] flex items-center gap-1.5 text-xs">
              <Plus size={14} className="text-[#0055a5]" /> Registrar Nueva Llamada de Servicio (Incidencia)
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              <Field label="Cliente *" required>
                <select
                  required
                  className={inputClass}
                  value={f.cardCode}
                  onChange={e => setF(v => ({ ...v, cardCode: e.target.value }))}
                >
                  <option value="">Selecciona cliente...</option>
                  {c.data.customers.map(x => (
                    <option key={x.id} value={x.cardCode}>
                      {x.cardCode} · {x.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Asunto del problema *" required>
                <input
                  required
                  minLength={5}
                  className={inputClass}
                  value={f.subject}
                  onChange={e => setF(v => ({ ...v, subject: e.target.value }))}
                  placeholder="Ej. Servidor no arranca tras apagón"
                />
              </Field>
              <Field label="Artículo / Tarjeta Equipo">
                <select
                  className={inputClass}
                  value={f.itemCode}
                  onChange={e => setF(v => ({ ...v, itemCode: e.target.value }))}
                >
                  <option value="">(Servicio General)</option>
                  {c.data.items.map(i => (
                    <option key={i.id} value={i.itemCode}>
                      {i.itemCode} · {i.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Prioridad">
                <select
                  className={inputClass}
                  value={f.priority}
                  onChange={e => setF(v => ({ ...v, priority: e.target.value as typeof f.priority }))}
                >
                  <option value="alta">Alta — Impacto crítico</option>
                  <option value="media">Media — Incidente operativo</option>
                  <option value="baja">Baja — Consulta o configuración</option>
                </select>
              </Field>
              <Field label="Fecha y Hora de Recepción">
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={f.openedAt}
                  onChange={e => setF(v => ({ ...v, openedAt: e.target.value }))}
                />
              </Field>
            </div>
            <button
              type="submit"
              className={`${buttonClass} font-bold text-white bg-[#0055a5] hover:bg-[#004080]`}
              disabled={c.saving}
            >
              Registrar llamada en cola
            </button>
          </form>

          <div className="space-y-2">
            <h4 className="font-bold text-[#003366] text-xs">Bandeja de Llamadas de Soporte Técnico</h4>
            {llamadas.map(l => (
              <FilaLlamada key={`${l.id}-${l.updatedAt}`} l={l} />
            ))}
          </div>

          <ParaPensar
            clave={`b1_servicio_${c.data.profile?.uid ?? 'anon'}`}
            preguntas={[
              'Si el cumplimiento de SLA baja del 90 %, ¿contratas otro técnico o renegocias los tiempos del contrato? ¿Qué cuesta más?',
              '¿Qué llamadas repetidas del mismo equipo indican un problema de producto y no de servicio?',
              '¿Cobrarías aparte las llamadas de clientes sin contrato? ¿Cómo convertirías esos clientes en contratos?',
            ]}
          />
        </div>
      )}
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. GESTIÓN DE PROYECTOS (Projects - OPRJ)
// ─────────────────────────────────────────────────────────────────────────────
export function ProjectsScreen() {
  const c = useCompany();
  const [f, setF] = useState({
    name: '',
    cardCode: '',
    startDate: today(),
    endDate: today(),
    budget: 5000,
    hourlyCost: 25,
    etapas: 'Fase 1: Análisis y Levantamiento:40\nFase 2: Parametrización y Configuración:80\nFase 3: Migración de Datos DTW:30\nFase 4: Capacitación de Usuarios:20',
  });

  const [avance, setAvance] = useState<Record<string, { stage: number; hours: number; done: boolean }>>({});

  const crear = async () => {
    const stages = f.etapas
      .split('\n')
      .map(l => l.split(':'))
      .filter(p => p[0]?.trim())
      .map(([name, h]) => ({ name: name.trim(), budgetHours: Number(h) || 0 }));

    try {
      await c.save({
        action: 'project',
        data: {
          name: f.name,
          cardCode: f.cardCode,
          startDate: f.startDate,
          endDate: f.endDate,
          budget: f.budget,
          hourlyCost: f.hourlyCost,
          stages,
        },
      });
      setF(v => ({ ...v, name: '' }));
    } catch {
      /* error visible */
    }
  };

  return (
    <Screen title="Gestión de Proyectos · Fases, Tareas y Análisis de Costos (OPRJ)">
      <div className="border-l-4 border-[#0055A5] bg-white p-2.5 rounded-r-xs shadow-xs text-xs">
        <p className="text-gray-700">
          En <strong>SAP Business One</strong>, el módulo de proyectos controla la rentabilidad en tiempo real comparando las <strong>horas presupuestadas frente a las horas reales</strong> y los costos acumulados, evitando desviaciones financieras.
        </p>
      </div>

      <form className="space-y-2 border border-[#999] bg-white p-3 rounded-xs shadow-xs text-xs" onSubmit={e => { e.preventDefault(); void crear(); }}>
        <h3 className="font-bold text-[#003366] flex items-center gap-1.5 text-xs">
          <Briefcase size={14} className="text-[#0055a5]" /> Crear Nuevo Proyecto de Implementación
        </h3>
        <div className="grid gap-2 sm:grid-cols-3">
          <Field label="Nombre del Proyecto *" required>
            <input
              required
              minLength={3}
              className={inputClass}
              value={f.name}
              onChange={e => setF(v => ({ ...v, name: e.target.value }))}
              placeholder="Ej. Implementación SAP B1 para Retail"
            />
          </Field>
          <Field label="Cliente / Socio *" required>
            <select
              required
              className={inputClass}
              value={f.cardCode}
              onChange={e => setF(v => ({ ...v, cardCode: e.target.value }))}
            >
              <option value="">Selecciona cliente...</option>
              {c.data.customers.map(x => (
                <option key={x.id} value={x.cardCode}>{x.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Precio de Venta Presupuestado (USD)">
            <input
              type="number"
              min={0}
              className={`${inputClass} font-mono font-bold text-emerald-700`}
              value={f.budget}
              onChange={e => setF(v => ({ ...v, budget: Number(e.target.value) }))}
            />
          </Field>
          <Field label="Fecha de Inicio">
            <input
              type="date"
              className={inputClass}
              value={f.startDate}
              onChange={e => setF(v => ({ ...v, startDate: e.target.value }))}
            />
          </Field>
          <Field label="Fecha de Fin">
            <input
              type="date"
              className={inputClass}
              value={f.endDate}
              onChange={e => setF(v => ({ ...v, endDate: e.target.value }))}
            />
          </Field>
          <Field label="Costo Interno por Hora (USD)">
            <input
              type="number"
              min={0}
              className={`${inputClass} font-mono font-bold`}
              value={f.hourlyCost}
              onChange={e => setF(v => ({ ...v, hourlyCost: Number(e.target.value) }))}
            />
          </Field>
        </div>

        <Field label="Etapas y Fases (Formato por línea: Nombre:Horas)">
          <textarea
            className={`${inputClass} min-h-20 font-mono text-xs`}
            value={f.etapas}
            onChange={e => setF(v => ({ ...v, etapas: e.target.value }))}
          />
        </Field>

        <button
          type="submit"
          className={`${buttonClass} font-bold text-white bg-[#0055a5] hover:bg-[#004080]`}
          disabled={c.saving}
        >
          Crear Proyecto en SAP B1
        </button>
      </form>

      {/* Proyectos activos */}
      <div className="space-y-3">
        {c.data.projects.map(p => {
          const hp = p.stages.reduce((s, x) => s + x.budgetHours, 0);
          const hr = p.stages.reduce((s, x) => s + x.actualHours, 0);
          const gastos = p.expenses.reduce((s, x) => s + x.amount, 0);
          const costo = round(hr * p.hourlyCost + gastos);
          const margen = p.budget ? round(((p.budget - costo) / p.budget) * 100) : 0;
          const a = avance[p.id] ?? { stage: 0, hours: 0, done: false };

          return (
            <section key={p.id} className="space-y-2 border border-[#999] bg-white p-3 rounded-xs shadow-xs text-xs">
              <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-1.5 font-bold">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#0055a5] text-sm">{p.projectNumber}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-[#003366]">{p.name}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600 font-normal">{p.cardName}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.status === 'cerrado' ? 'bg-gray-200 text-gray-700' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {p.status === 'cerrado' ? 'PROYECTO CERRADO' : 'PROYECTO ACTIVO'}
                </span>
              </header>

              {/* Matriz de etapas con columnas oficiales */}
              <div className="border border-[#b0c2d4] rounded-xs overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#e9edf2] text-[#003366] border-b border-[#b0c2d4] font-bold text-[11px]">
                    <tr>
                      <th className="p-2 border-r border-[#cbd8e5] w-12 text-center">#</th>
                      <th className="p-2 border-r border-[#cbd8e5]">Etapa / Fase</th>
                      <th className="p-2 border-r border-[#cbd8e5] text-right">Horas Presup.</th>
                      <th className="p-2 border-r border-[#cbd8e5] text-right">Horas Reales</th>
                      <th className="p-2 border-r border-[#cbd8e5] text-right">Desviación</th>
                      <th className="p-2 border-r border-[#cbd8e5] text-right">Costo Fase</th>
                      <th className="p-2 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.stages.map((s, idx) => {
                      const desv = round(s.actualHours - s.budgetHours);
                      const costFase = round(s.actualHours * p.hourlyCost);
                      return (
                        <tr key={s.name} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'}`}>
                          <td className="p-2 border-r border-[#cbd8e5] text-center font-mono text-gray-500">{idx + 1}</td>
                          <td className="p-2 border-r border-[#cbd8e5] font-medium text-[#003366]">{s.name}</td>
                          <td className="p-2 border-r border-[#cbd8e5] text-right font-mono">{s.budgetHours} h</td>
                          <td className="p-2 border-r border-[#cbd8e5] text-right font-mono font-bold">{s.actualHours} h</td>
                          <td className="p-2 border-r border-[#cbd8e5] text-right font-mono font-semibold">
                            <span className={desv > 0 ? 'text-red-600' : 'text-emerald-700'}>
                              {desv > 0 ? `+${desv}` : desv} h
                            </span>
                          </td>
                          <td className="p-2 border-r border-[#cbd8e5] text-right font-mono text-gray-700">
                            {usd(costFase)}
                          </td>
                          <td className="p-2 text-center">
                            {s.done ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                ✓ Terminada
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                En Curso
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Indicadores financieros del proyecto */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#f8fafc] p-2.5 rounded-xs border border-gray-200">
                <div>
                  <span className="text-gray-500 text-[10.5px] block">Horas Totales:</span>
                  <strong className="font-mono text-xs">{hr} de {hp} h ({hp > 0 ? Math.round((hr / hp) * 100) : 0}%)</strong>
                </div>
                <div>
                  <span className="text-gray-500 text-[10.5px] block">Costo Acumulado:</span>
                  <strong className="font-mono text-xs text-gray-900">{usd(costo)}</strong>
                </div>
                <div>
                  <span className="text-gray-500 text-[10.5px] block">Presupuesto Venta:</span>
                  <strong className="font-mono text-xs text-[#0055a5]">{usd(p.budget)}</strong>
                </div>
                <div>
                  <span className="text-gray-500 text-[10.5px] block">Margen Financiero:</span>
                  <strong className={`font-mono text-xs font-bold ${margen < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                    {margen}% ({usd(p.budget - costo)})
                  </strong>
                </div>
              </div>

              {p.status === 'activo' && (
                <div className="flex flex-wrap items-end gap-2 pt-1 border-t border-gray-200">
                  <Field label="Seleccionar Etapa">
                    <select
                      className={inputClass}
                      value={a.stage}
                      onChange={e => setAvance(v => ({ ...v, [p.id]: { ...a, stage: Number(e.target.value) } }))}
                    >
                      {p.stages.map((s, i) => (
                        <option key={s.name} value={i}>{s.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Horas a imputar">
                    <input
                      type="number"
                      min={0}
                      step="0.5"
                      className={`${inputClass} font-mono`}
                      value={a.hours}
                      onChange={e => setAvance(v => ({ ...v, [p.id]: { ...a, hours: Number(e.target.value) } }))}
                    />
                  </Field>
                  <label className="flex items-center gap-1.5 pb-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={a.done}
                      onChange={e => setAvance(v => ({ ...v, [p.id]: { ...a, done: e.target.checked } }))}
                    />
                    <span>Marcar etapa terminada</span>
                  </label>
                  <button
                    type="button"
                    className={`${buttonClass} font-bold text-white bg-[#0055a5] hover:bg-[#004080]`}
                    disabled={c.saving}
                    onClick={async () => {
                      try {
                        await c.save({
                          action: 'projectProgress',
                          data: { id: p.id, stage: a.stage, hours: a.hours, done: a.done, close: false },
                        });
                      } catch {
                        /* error */
                      }
                    }}
                  >
                    Registrar Avance
                  </button>
                  <button
                    type="button"
                    className={buttonClass}
                    disabled={c.saving || !p.stages.every(s => s.done)}
                    onClick={async () => {
                      try {
                        await c.save({
                          action: 'projectProgress',
                          data: { id: p.id, stage: 0, hours: 0, done: p.stages[0].done, close: true },
                        });
                      } catch {
                        /* error */
                      }
                    }}
                  >
                    Cerrar Proyecto
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <ParaPensar
        clave={`b1_proyectos_${c.data.profile?.uid ?? 'anon'}`}
        preguntas={[
          'Si a mitad del proyecto ya usaste el 70 % de las horas, ¿qué le dices al cliente y qué le dices a tu equipo?',
          '¿Cobrarías los cambios que pide el cliente fuera del alcance? ¿Cómo lo acordarías desde el inicio?',
        ]}
      />
    </Screen>
  );
}
