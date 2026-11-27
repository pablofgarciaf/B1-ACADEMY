"use client";

import React from 'react';
import { usd } from '@/lib/company-calculations';

interface BankingMeansModalProps {
  paymentMethod: 'transfer' | 'check' | 'card' | 'cash';
  setPaymentMethod: (m: 'transfer' | 'check' | 'card' | 'cash') => void;
  paymentDate: string;
  setPaymentDate: (d: string) => void;
  amount: number;
  onClose: () => void;
}

export default function BankingMeansModal({
  paymentMethod,
  setPaymentMethod,
  paymentDate,
  setPaymentDate,
  amount,
  onClose
}: BankingMeansModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#ECE9D8] border-2 border-[#0A246A] shadow-2xl rounded-sm p-3 font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222]">
        <div className="flex items-center justify-between bg-[#0A246A] text-white px-2 py-1 font-bold -mx-3 -mt-3 mb-3">
          <span className="flex items-center gap-1.5">
            <span>💰</span>
            <span>Medios de Pago — SAP Business One</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-red-300 font-black text-sm cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 bg-white p-3 border border-[#808080] rounded-xs shadow-inner">
          <div className="flex border-b border-[#a8bccf] gap-1 pb-1">
            {(['transfer', 'check', 'card', 'cash'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMethod(m)}
                className={`px-3 py-1 font-bold text-xs rounded-xs border transition cursor-pointer ${
                  paymentMethod === m
                    ? 'bg-[#0055a5] text-white border-[#003366]'
                    : 'bg-[#f0f4f8] text-[#334455] border-[#b0c4de] hover:bg-white'
                }`}
              >
                {m === 'transfer' ? 'Transferencia' : m === 'check' ? 'Cheque' : m === 'card' ? 'Tarjeta' : 'Efectivo'}
              </button>
            ))}
          </div>

          {paymentMethod === 'transfer' && (
            <div className="space-y-2 text-[11px]">
              <p className="text-gray-600 font-semibold">Datos de la Transferencia Bancaria:</p>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-gray-700">Cuenta de Mayor:</label>
                <span className="col-span-2 font-mono font-bold text-[#003366]">1.1.01.01 - Banco Matriz</span>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-gray-700">Fecha de Transferencia:</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                  className="col-span-2 border p-1 rounded-xs"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-gray-700">Importe Total:</label>
                <span className="col-span-2 font-mono text-base font-extrabold text-[#0055a5]">
                  {usd(amount)} USD
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'check' && (
            <div className="space-y-2 text-[11px]">
              <p className="text-gray-600 font-semibold">Datos del Cheque:</p>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-gray-700">Banco Emisor:</label>
                <input type="text" defaultValue="Banco Pichincha" className="col-span-2 border p-1 rounded-xs" />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-gray-700">Nº de Cheque:</label>
                <input type="text" defaultValue="004812" className="col-span-2 border p-1 rounded-xs font-mono" />
              </div>
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div className="space-y-2 text-[11px]">
              <p className="text-gray-600 font-semibold">Cobro / Pago en Efectivo:</p>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-gray-700">Cuenta de Caja:</label>
                <span className="col-span-2 font-mono font-bold text-[#003366]">1.1.01.03 - Caja General</span>
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-2 text-[11px]">
              <p className="text-gray-600 font-semibold">Datos de la Tarjeta:</p>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-gray-700">Operadora:</label>
                <input type="text" defaultValue="Visa / Mastercard" className="col-span-2 border p-1 rounded-xs" />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-[#808080]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 bg-[#0A246A] hover:bg-[#1E3A5F] text-white font-bold text-xs rounded-xs active:scale-95 cursor-pointer shadow-sm"
          >
            Fijar (OK)
          </button>
        </div>
      </div>
    </div>
  );
}
