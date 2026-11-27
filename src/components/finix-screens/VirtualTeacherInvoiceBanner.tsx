"use client";

import React, { useState } from 'react';
import { AlertCircle, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface VirtualTeacherInvoiceBannerProps {
  type: 'customer' | 'vendor';
  partnerCode: string;
  partnerName: string;
  onGenerate: () => Promise<void>;
}

export default function VirtualTeacherInvoiceBanner({
  type,
  partnerCode,
  partnerName,
  onGenerate
}: VirtualTeacherInvoiceBannerProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await onGenerate();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // Manejado por context
    } finally {
      setLoading(false);
    }
  };

  const isCustomer = type === 'customer';

  return (
    <div className="p-4 my-2 rounded-xs border-2 border-dashed border-[#0055a5]/30 bg-gradient-to-br from-[#f0f7ff] to-[#e6f0fa] text-[#1e293b] shadow-2xs">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#0055a5] text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
          👨‍🏫
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h5 className="text-xs font-extrabold uppercase tracking-wide text-[#003366]">
              FeNi Tutor Pedagógico · Flujo Documental SAP B1
            </h5>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-2xs border border-amber-300">
              {isCustomer ? 'Cobros sin Factura' : 'Pagos sin Factura'}
            </span>
          </div>

          <p className="text-[11.5px] leading-relaxed text-[#334155]">
            {isCustomer ? (
              <>
                En SAP Business One, un <strong>Pago Recibido</strong> liquida una cuenta por cobrar que se origina en una <strong>Factura de deudores (Módulo de Ventas)</strong>. Al no encontrar facturas abiertas para <strong>{partnerName} ({partnerCode})</strong>, el sistema no tiene saldo que conciliar.
              </>
            ) : (
              <>
                En SAP Business One, un <strong>Pago Efectuado</strong> liquida una obligación que se origina en una <strong>Factura de proveedores (Módulo de Compras)</strong>. Al no encontrar facturas abiertas para <strong>{partnerName} ({partnerCode})</strong>, el sistema no tiene saldo por liquidar.
              </>
            )}
          </p>

          <div className="bg-white/80 border border-[#cbd5e1] rounded-xs p-2.5 text-[11px] text-[#475569] space-y-1">
            <p className="font-semibold text-[#003366] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0055a5]" />
              <span>¿Cómo deseas continuar tu práctica?</span>
            </p>
            <p>
              {isCustomer
                ? 'Puedes ingresar al módulo de Ventas y emitir la factura manualmente con los datos del ejercicio, o pedirle al profesor que registre una factura de práctica con 1 clic en la base de datos de tu empresa:'
                : 'Puedes ingresar al módulo de Compras y registrar la factura de proveedor manualmente, o pedirle al profesor que genere una factura de práctica al instante:'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              disabled={loading || success}
              onClick={handleCreate}
              className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer ${
                success
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0055a5] text-white hover:bg-[#004282] border border-[#003366]'
              }`}
            >
              {loading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generando documento en tu empresa...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>¡Factura registrada! Lista para cobrar</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    ⚡ Generar factura de práctica ({isCustomer ? '$1,023.50 USD' : '$1,380.00 USD'})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
