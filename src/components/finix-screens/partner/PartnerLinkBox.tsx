'use client';

import React, { useState } from 'react';
import { Link as LinkIcon, CheckCircle2, ArrowLeftRight } from 'lucide-react';

interface PartnerLinkBoxProps {
  customers: Array<{ id: string; cardCode: string; name: string }>;
  vendors: Array<{ id: string; cardCode: string; name: string }>;
  linkCustomerCode: string;
  setLinkCustomerCode: (code: string) => void;
  linkVendorCode: string;
  setLinkVendorCode: (code: string) => void;
  onSaveLink: (customerCode: string, vendorCode: string) => Promise<boolean>;
  saving: boolean;
}

export default function PartnerLinkBox({
  customers,
  vendors,
  linkCustomerCode,
  setLinkCustomerCode,
  linkVendorCode,
  setLinkVendorCode,
  onSaveLink,
  saving,
}: PartnerLinkBoxProps) {
  const [linking, setLinking] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLink = async () => {
    if (!linkCustomerCode || !linkVendorCode || linking || saving) return;
    setLinking(true);
    setSuccessMsg(null);
    try {
      const ok = await onSaveLink(linkCustomerCode, linkVendorCode);
      if (ok) {
        setSuccessMsg(`✅ Vínculo comercial registrado entre ${linkCustomerCode} y ${linkVendorCode}.`);
        setTimeout(() => setSuccessMsg(null), 6000);
      }
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="mt-3 bg-white border border-[#9fb4c7] rounded-xs p-3 shadow-2xs">
      <div className="flex items-center justify-between gap-2 mb-1">
        <h4 className="font-bold text-xs text-[#0a246a] flex items-center gap-1.5">
          <ArrowLeftRight size={13} className="text-[#0055a5]" />
          <span>Vincular fichas de Cliente y Proveedor (Contrapartes)</span>
        </h4>
        {successMsg && (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 animate-fadeIn">
            {successMsg}
          </span>
        )}
      </div>

      <p className="text-[10.5px] text-gray-500 mb-2">
        Relaciona dos fichas que operan como contrapartes mutuas manteniendo sus libros auxiliares independientes.
        Al guardar, el proveedor y el cliente quedan vinculados en sus respectivos campos maestros.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          <label className="text-[10.5px] font-bold text-[#003366]">Cliente:</label>
          <select
            value={linkCustomerCode}
            onChange={(e) => setLinkCustomerCode(e.target.value)}
            className="border border-[#9fb4c7] px-2 py-1 rounded-xs bg-white text-[11px] font-medium text-[#003366] max-w-[220px]"
          >
            <option value="">Selecciona cliente...</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.cardCode}>
                {cust.cardCode} · {cust.name}
              </option>
            ))}
          </select>
        </div>

        <span className="font-bold text-[#0055a5] px-1">⟷</span>

        <div className="flex items-center gap-1.5">
          <label className="text-[10.5px] font-bold text-[#003366]">Proveedor:</label>
          <select
            value={linkVendorCode}
            onChange={(e) => setLinkVendorCode(e.target.value)}
            className="border border-[#9fb4c7] px-2 py-1 rounded-xs bg-white text-[11px] font-medium text-[#003366] max-w-[220px]"
          >
            <option value="">Selecciona proveedor...</option>
            {vendors.map((vend) => (
              <option key={vend.id} value={vend.cardCode}>
                {vend.cardCode} · {vend.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          disabled={!linkCustomerCode || !linkVendorCode || linking || saving}
          onClick={handleLink}
          className="px-4 py-1.5 bg-[#0055a5] hover:bg-[#004080] text-white font-bold rounded-xs text-[11px] disabled:opacity-40 active:scale-95 transition cursor-pointer shadow-2xs"
        >
          {linking ? 'Vinculando…' : 'Guardar Vínculo'}
        </button>
      </div>
    </div>
  );
}
