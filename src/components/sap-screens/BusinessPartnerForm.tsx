'use client';

import React, { useState } from 'react';

interface BusinessPartnerFormProps {
  mode?: 'customer' | 'vendor' | 'lead';
  readOnly?: boolean;
}

const TABS = ['General', 'Datos Contacto', 'Direcciones', 'Condiciones Pago', 'Contabilización', 'Propiedades', 'Observaciones'];

export default function BusinessPartnerForm({ mode = 'customer', readOnly = false }: BusinessPartnerFormProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    code: 'C10001',
    name: 'Empresa ABC S.A.',
    foreignName: '',
    group: 'Clientes Nacionales',
    currency: 'COP - Peso Colombiano',
    federalTaxId: '900.123.456-7',
    balance: '15,200.00',
    deliveries: '3,500.00',
    orders: '8,900.00',
    opportunities: '2',
    // General tab
    phone1: '601-123-4567',
    phone2: '',
    mobilePhone: '310-456-7890',
    fax: '',
    email: 'contacto@empresaabc.com',
    website: 'www.empresaabc.com',
    shippingType: 'Transporte Terrestre',
    password: '',
    project: '',
    industry: 'Manufactura',
    bpType: 'Cliente',
    personalDataProtect: false,
    alias: '',
  });

  const update = (key: string, val: string | boolean) => {
    if (readOnly) return;
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] font-sans text-[11px] text-gray-800 select-none">
      {/* ── Título de ventana SAP ── */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#003366] to-[#0055A5] px-2 py-0.5">
        <span className="text-white font-semibold text-[11px]">Datos Maestros de Interlocutor Comercial</span>
        <div className="flex gap-1">
          <button className="w-4 h-4 bg-[#ECE9D8] border border-gray-600 text-[9px] flex items-center justify-center hover:bg-gray-200">_</button>
          <button className="w-4 h-4 bg-[#ECE9D8] border border-gray-600 text-[9px] flex items-center justify-center hover:bg-gray-200">□</button>
          <button className="w-4 h-4 bg-[#ECE9D8] border border-gray-600 text-[9px] flex items-center justify-center hover:bg-red-500 hover:text-white">✕</button>
        </div>
      </div>

      {/* ── Toolbar SAP ── */}
      <div className="flex items-center gap-1 px-1 py-0.5 bg-[#ECE9D8] border-b border-gray-400">
        {['◀', '▶', '⊕', '⊗', '💾', '🖨', '📊', '🔍'].map((icon, i) => (
          <button
            key={i}
            className="w-6 h-5 text-[10px] border border-gray-400 bg-[#F5F4EE] hover:bg-[#DDD9C4] flex items-center justify-center"
          >
            {icon}
          </button>
        ))}
        <div className="flex-1" />
        <span className="text-[10px] text-gray-600">Añadir · Buscar · Cancelar</span>
      </div>

      {/* ── Header con campos principales ── */}
      <div className="grid grid-cols-2 gap-x-4 px-2 py-1.5 bg-[#ECE9D8] border-b border-gray-400">
        {/* Columna izquierda */}
        <div className="space-y-0.5">
          <SapField label="Código" value={formData.code} onChange={v => update('code', v)} readOnly={readOnly} required />
          <SapField label="Nombre" value={formData.name} onChange={v => update('name', v)} readOnly={readOnly} width="full" />
          <SapField label="Nombre ext." value={formData.foreignName} onChange={v => update('foreignName', v)} readOnly={readOnly} width="full" />
          <div className="flex gap-2">
            <SapSelect label="Grupo" value={formData.group} onChange={v => update('group', v)} readOnly={readOnly}
              options={['Clientes Nacionales', 'Clientes Internacionales', 'Clientes VIP']} />
            <SapSelect label="Moneda" value={formData.currency} onChange={v => update('currency', v)} readOnly={readOnly}
              options={['COP - Peso Colombiano', 'USD - Dólar', 'EUR - Euro']} />
          </div>
          <SapField label="NIT/RUT" value={formData.federalTaxId} onChange={v => update('federalTaxId', v)} readOnly={readOnly} />
        </div>

        {/* Columna derecha — saldos */}
        <div className="space-y-0.5">
          <div className="text-right">
            <SapMoneyField label="Saldo cuenta" value={formData.balance} color="text-blue-700" />
            <SapMoneyField label="Entregas abiertas" value={formData.deliveries} color="text-orange-600" />
            <SapMoneyField label="Pedidos abiertos" value={formData.orders} color="text-orange-600" />
            <SapMoneyField label="Oportunidades" value={formData.opportunities} color="text-gray-700" />
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex border-b border-gray-400 bg-[#D4D0C8]">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-3 py-0.5 text-[11px] border-r border-gray-400 hover:bg-[#ECE9D8] transition-colors ${
              i === activeTab
                ? 'bg-[#ECE9D8] font-semibold border-b-2 border-b-[#ECE9D8] -mb-px'
                : 'text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Contenido del tab activo ── */}
      <div className="flex-1 overflow-auto bg-[#ECE9D8] px-2 py-2">
        {activeTab === 0 && <TabGeneral formData={formData} update={update} readOnly={readOnly} />}
        {activeTab === 1 && <TabContactos />}
        {activeTab === 2 && <TabDirecciones />}
        {activeTab === 3 && <TabCondicionesPago />}
        {activeTab === 4 && <TabContabilizacion />}
        {activeTab >= 5 && (
          <div className="text-gray-500 text-center mt-8 text-xs">
            Contenido de &quot;{TABS[activeTab]}&quot; disponible en SAP Business One real
          </div>
        )}
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center px-2 py-0.5 bg-[#D4D0C8] border-t border-gray-400 text-[10px] text-gray-600">
        <span className="flex-1">
          {mode === 'customer' ? '🟢 Cliente activo' : mode === 'vendor' ? '🔵 Proveedor activo' : '🟡 Cliente potencial'}
        </span>
        <span>SAP Business One 10.0</span>
      </div>
    </div>
  );
}

// ─── Subcomponentes de UI SAP ─────────────────────────────────────────────────

function SapField({ label, value, onChange, readOnly, required, width }: {
  label: string; value: string; onChange: (v: string) => void;
  readOnly?: boolean; required?: boolean; width?: 'full';
}) {
  return (
    <div className="flex items-center gap-1">
      <label className="text-[11px] text-gray-700 whitespace-nowrap min-w-[80px] text-right">
        {label}{required && <span className="text-red-600">*</span>}:
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        readOnly={readOnly}
        className={`border border-gray-400 bg-white px-1 py-0 text-[11px] text-gray-800 h-4 ${
          width === 'full' ? 'flex-1' : 'w-36'
        } ${readOnly ? 'bg-[#F0EEE8]' : 'focus:border-[#003366] focus:outline-none'}`}
      />
    </div>
  );
}

function SapSelect({ label, value, onChange, readOnly, options }: {
  label: string; value: string; onChange: (v: string) => void;
  readOnly?: boolean; options: string[];
}) {
  return (
    <div className="flex items-center gap-1 flex-1">
      <label className="text-[11px] text-gray-700 whitespace-nowrap min-w-[50px] text-right">{label}:</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={readOnly}
        className="border border-gray-400 bg-white px-0.5 text-[11px] text-gray-800 h-4 flex-1 focus:outline-none focus:border-[#003366]"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SapMoneyField({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-end gap-2 py-0.5">
      <label className="text-[11px] text-gray-600">{label}:</label>
      <span className={`font-mono text-[11px] font-semibold ${color} min-w-[80px] text-right`}>{value}</span>
    </div>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

function TabGeneral({ formData, update, readOnly }: { formData: Record<string, string | boolean>; update: (k: string, v: string | boolean) => void; readOnly: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
      <div className="space-y-0.5">
        <SapField label="Tel. 1" value={formData.phone1 as string} onChange={v => update('phone1', v)} readOnly={readOnly} />
        <SapField label="Tel. 2" value={formData.phone2 as string} onChange={v => update('phone2', v)} readOnly={readOnly} />
        <SapField label="Móvil" value={formData.mobilePhone as string} onChange={v => update('mobilePhone', v)} readOnly={readOnly} />
        <SapField label="Fax" value={formData.fax as string} onChange={v => update('fax', v)} readOnly={readOnly} />
        <SapField label="E-mail" value={formData.email as string} onChange={v => update('email', v)} readOnly={readOnly} width="full" />
        <SapField label="Web" value={formData.website as string} onChange={v => update('website', v)} readOnly={readOnly} width="full" />
      </div>
      <div className="space-y-0.5">
        <SapField label="Tipo envío" value={formData.shippingType as string} onChange={v => update('shippingType', v)} readOnly={readOnly} />
        <SapField label="Contraseña" value={formData.password as string} onChange={v => update('password', v)} readOnly={readOnly} />
        <SapField label="Proyecto" value={formData.project as string} onChange={v => update('project', v)} readOnly={readOnly} />
        <SapField label="Industria" value={formData.industry as string} onChange={v => update('industry', v)} readOnly={readOnly} />
        <SapField label="Tipo IC" value={formData.bpType as string} onChange={v => update('bpType', v)} readOnly={readOnly} />
        <div className="flex items-center gap-2 py-0.5">
          <label className="text-[11px] text-gray-700 min-w-[80px] text-right">Protección datos:</label>
          <input type="checkbox" checked={!!formData.personalDataProtect} onChange={e => update('personalDataProtect', e.target.checked)} disabled={readOnly} className="w-3 h-3" />
        </div>
        <SapField label="Alias" value={formData.alias as string} onChange={v => update('alias', v)} readOnly={readOnly} />
      </div>
    </div>
  );
}

function TabContactos() {
  return (
    <div>
      <div className="mb-1 font-semibold text-[11px] text-gray-700">Personas de Contacto</div>
      <SapTable
        columns={['Nº', 'Nombre', 'Apellido', 'Título', 'Posición', 'Teléfono', 'Móvil', 'E-mail']}
        rows={[
          ['1', 'Juan', 'García', 'Sr.', 'Gerente Compras', '601-123-4567', '310-456-7890', 'j.garcia@abc.com'],
        ]}
      />
    </div>
  );
}

function TabDirecciones() {
  return (
    <div>
      <div className="mb-1 font-semibold text-[11px] text-gray-700">Direcciones</div>
      <SapTable
        columns={['Tipo', 'Nombre dirección', 'País', 'Estado/Dpto', 'Ciudad', 'Calle', 'CP']}
        rows={[
          ['Facturación', 'Principal', 'Colombia', 'Cundinamarca', 'Bogotá', 'Cra 7 # 45-12', '110111'],
          ['Entrega', 'Bodega Norte', 'Colombia', 'Cundinamarca', 'Bogotá', 'Cll 80 # 23-45', '111221'],
        ]}
      />
    </div>
  );
}

function TabCondicionesPago() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
      <div className="space-y-0.5">
        <SapDisplayField label="Condición de pago" value="30 días netos" />
        <SapDisplayField label="Lista de precios" value="Lista General" />
        <SapDisplayField label="Total Crédito" value="50,000,000 COP" />
        <SapDisplayField label="Compromiso" value="15,200 COP" />
        <SapDisplayField label="Descuento" value="5.00%" />
      </div>
      <div className="space-y-0.5">
        <SapDisplayField label="Forma de pago" value="Transferencia Bancaria" />
        <SapDisplayField label="Banco" value="Bancolombia" />
        <SapDisplayField label="Cuenta" value="123-456789-00" />
      </div>
    </div>
  );
}

function TabContabilizacion() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
      <div className="space-y-0.5">
        <SapDisplayField label="Cuenta Control" value="13050501 - Clientes Nacionales" />
        <SapDisplayField label="Grupo IVA" value="IVA-19%" />
        <SapDisplayField label="Tipo retención" value="Ret. Fuente 3.5%" />
      </div>
      <div className="space-y-0.5">
        <SapDisplayField label="Tolerancia deuda" value="0.00" />
        <SapDisplayField label="Calificación" value="A - Excelente" />
      </div>
    </div>
  );
}

function SapDisplayField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1">
      <label className="text-[11px] text-gray-700 whitespace-nowrap min-w-[120px] text-right">{label}:</label>
      <span className="border border-gray-300 bg-[#F0EEE8] px-1 py-0 text-[11px] text-gray-800 h-4 flex items-center min-w-[140px]">{value}</span>
    </div>
  );
}

function SapTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <table className="w-full border-collapse text-[11px]">
      <thead>
        <tr className="bg-[#D4D0C8]">
          {columns.map(c => (
            <th key={c} className="border border-gray-400 px-1 py-0.5 text-left font-semibold text-[11px] text-gray-700 whitespace-nowrap">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F5F4EE]'}>
            {row.map((cell, j) => (
              <td key={j} className="border border-gray-300 px-1 py-0.5 text-[11px] text-gray-800">{cell}</td>
            ))}
          </tr>
        ))}
        {/* Fila vacía para añadir */}
        <tr className="bg-[#FFFDE7]">
          {columns.map((_, j) => (
            <td key={j} className="border border-gray-300 px-1 py-0.5 text-[11px] text-gray-400">&nbsp;</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
