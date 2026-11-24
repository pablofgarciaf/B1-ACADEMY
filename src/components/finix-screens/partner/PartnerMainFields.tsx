'use client';

import React from 'react';
import { Search, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

interface PartnerMainFieldsProps {
  vendor: boolean;
  formMode: 'create' | 'edit' | 'search';
  setFormMode: (mode: 'create' | 'edit' | 'search') => void;
  cardCode: string;
  setCardCode: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  foreignName: string;
  setForeignName: (v: string) => void;
  group: string;
  setGroup: (v: string) => void;
  customerGroupOptions: string[];
  city: string;
  setCity: (v: string) => void;
  paymentTermsDays: number;
  setPaymentTermsDays: (v: number) => void;
  currency: string;
  setCurrency: (v: string) => void;
  partnerType: 'customer' | 'vendor' | 'lead';
  setPartnerType: (type: 'customer' | 'vendor' | 'lead') => void;
  ruc: string;
  setRuc: (v: string) => void;
  active: boolean;
  setActive: (v: boolean) => void;
  // Campo de vinculación contraparte (Cliente conectado en Proveedor / Proveedor conectado en Cliente)
  linkedPartnerCode: string;
  setLinkedPartnerCode: (v: string) => void;
  counterparts: Array<{ cardCode: string; name: string }>;
  onExecuteSearch?: () => void;
}

export default function PartnerMainFields({
  vendor,
  formMode,
  setFormMode,
  cardCode,
  setCardCode,
  name,
  setName,
  foreignName,
  setForeignName,
  group,
  setGroup,
  customerGroupOptions,
  city,
  setCity,
  paymentTermsDays,
  setPaymentTermsDays,
  currency,
  setCurrency,
  partnerType,
  setPartnerType,
  ruc,
  setRuc,
  active,
  setActive,
  linkedPartnerCode,
  setLinkedPartnerCode,
  counterparts,
  onExecuteSearch,
}: PartnerMainFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-[#cbd8e5] text-[11px]">
      {/* Columna Izquierda: Código, Nombre, Moneda, RUC */}
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="text-[10.5px] font-bold text-[#003366]">Código</label>
          <div className="col-span-2 flex items-center gap-1.5">
            <input
              type="text"
              value={cardCode}
              onChange={(e) => setCardCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (onExecuteSearch) onExecuteSearch();
                }
              }}
              className={`w-full border ${
                formMode === 'search'
                  ? 'border-[#d49b00] bg-[#fffde7] ring-1 ring-[#f59e0b]/50'
                  : 'border-[#9fb4c7] bg-[#fffde7]'
              } px-2 py-0.5 text-[11px] font-mono font-bold text-[#003366] rounded-xs focus:outline-none focus:ring-1 focus:ring-[#0070d2]`}
              placeholder="Auto (C00001 / P00001)"
            />
            <button
              type="button"
              onClick={() => {
                if (onExecuteSearch) onExecuteSearch();
                else setFormMode('search');
              }}
              className="p-1 bg-slate-100 hover:bg-slate-200 border border-[#9fb4c7] rounded-xs text-gray-600 cursor-pointer"
              title="Buscar código existente (Ctrl+F o Enter)"
            >
              <Search size={12} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="text-[10.5px] font-bold text-[#003366]">
            Nombre / Razón Social <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required={formMode !== 'search'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (formMode === 'search' || !name.trim())) {
                e.preventDefault();
                if (onExecuteSearch) onExecuteSearch();
              }
            }}
            className={`col-span-2 border ${
              formMode === 'search' ? 'border-[#d49b00] bg-[#fffde7]' : 'border-[#9fb4c7] bg-white'
            } px-2 py-0.5 text-[11px] rounded-xs focus:bg-[#fffde7] focus:outline-none focus:ring-1 focus:ring-[#0070d2]`}
            placeholder="Razón Social Oficial"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="text-[10.5px] text-[#475569]">Nombre extranjero</label>
          <input
            type="text"
            value={foreignName}
            onChange={(e) => setForeignName(e.target.value)}
            className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] rounded-xs focus:outline-none"
            placeholder="Nombre comercial o en inglés"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="text-[10.5px] text-[#475569]">Grupo</label>
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] rounded-xs"
          >
            <option value="Nacional">Nacional</option>
            <option value="Extranjero / Exterior">Extranjero / Exterior</option>
            <option value="Corporativo / Grupo">Corporativo / Grupo</option>
            <option value="Gobierno / Público">Gobierno / Público</option>
            {customerGroupOptions.slice(4).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="text-[10.5px] font-bold text-[#003366]">
            Ciudad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] rounded-xs focus:bg-[#fffde7] focus:outline-none"
            placeholder="Ej. Cuenca o Quito"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="text-[10.5px] font-bold text-[#003366]">Condición de pago</label>
          <div className="col-span-2 flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              value={paymentTermsDays}
              onChange={(e) => setPaymentTermsDays(Number(e.target.value))}
              className="w-20 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] font-mono rounded-xs focus:bg-[#fffde7] focus:outline-none"
            />
            <span className="text-[10.5px] text-gray-500">días</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="text-[10.5px] text-[#475569]">Moneda</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] rounded-xs"
          >
            <option value="USD">Dólar estadounidense ($ - USD)</option>
            <option value="EUR">Euro (€ - EUR)</option>
            <option value="ALL">Todas las monedas</option>
          </select>
        </div>
      </div>

      {/* Columna Derecha: Tipo, RUC, Saldo de Cuenta, Cliente/Proveedor Conectado */}
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="text-[10.5px] font-bold text-[#003366]">Tipo de Socio</label>
          <div className="col-span-2 flex items-center gap-3">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="partnerType"
                checked={partnerType === 'customer'}
                onChange={() => setPartnerType('customer')}
                className="text-[#0070d2]"
              />
              <span>Cliente</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="partnerType"
                checked={partnerType === 'vendor'}
                onChange={() => setPartnerType('vendor')}
                className="text-[#0070d2]"
              />
              <span>Proveedor</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="partnerType"
                checked={partnerType === 'lead'}
                onChange={() => setPartnerType('lead')}
                className="text-[#0070d2]"
              />
              <span>Lead</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="text-[10.5px] font-bold text-[#003366]">
            RUC / C.I. <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={ruc}
            onChange={(e) => setRuc(e.target.value)}
            className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] font-mono rounded-xs focus:bg-[#fffde7] focus:outline-none focus:ring-1 focus:ring-[#0070d2]"
            placeholder="1799999999001"
          />
        </div>

        {/* ── CAMPO OFICIAL SAP B1: CLIENTE CONECTADO / PROVEEDOR CONECTADO ── */}
        <div className="grid grid-cols-3 gap-2 items-center bg-[#f0f7ff] p-1.5 border border-[#99c4ff] rounded-xs shadow-2xs">
          <label className="text-[10.5px] font-bold text-[#004b91] flex items-center gap-1">
            <LinkIcon size={12} className="text-[#0055a5]" />
            <span>{vendor ? 'Cliente conectado' : 'Proveedor conectado'}</span>
          </label>
          <div className="col-span-2 flex items-center gap-1.5">
            <select
              value={linkedPartnerCode}
              onChange={(e) => setLinkedPartnerCode(e.target.value)}
              className="w-full border border-[#7fb3f5] bg-white px-2 py-0.5 text-[11px] font-medium text-[#003366] rounded-xs focus:outline-none focus:ring-1 focus:ring-[#0070d2]"
              title={
                vendor
                  ? 'Código del cliente conectado a este proveedor (SAP B1 OCRD)'
                  : 'Código del proveedor conectado a este cliente (SAP B1 OCRD)'
              }
            >
              <option value="">— Ninguno (sin vincular) —</option>
              {counterparts.map((item) => (
                <option key={item.cardCode} value={item.cardCode}>
                  {item.cardCode} · {item.name}
                </option>
              ))}
            </select>
            {linkedPartnerCode && (
              <span className="text-emerald-600 shrink-0" title="Vínculo configurado">
                <CheckCircle2 size={14} />
              </span>
            )}
          </div>
        </div>

        {/* Saldo de Cuenta con Enlace Oficial de SAP B1 */}
        <div className="grid grid-cols-3 gap-2 items-center bg-[#f7fafc] p-1.5 border border-[#d4e1ed] rounded-xs">
          <label className="text-[10.5px] font-bold text-[#003366] flex items-center gap-1">
            <span>Saldo de cuenta</span>
            <span className="text-orange-500 text-xs font-black cursor-pointer" title="Ver detalle de mayor">
              ➔
            </span>
          </label>
          <div className="col-span-2 flex items-center justify-between">
            <span className="font-mono font-bold text-[#0055a5] text-xs">$ 0.00 USD</span>
            <span className="text-[10px] text-gray-400">Sin mora</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="text-[10.5px] text-[#475569]">Estado</label>
          <div className="col-span-2 flex items-center gap-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="rounded text-[#0070d2]"
              />
              <span className={active ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                {active ? 'Activo' : 'Inactivo'}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
