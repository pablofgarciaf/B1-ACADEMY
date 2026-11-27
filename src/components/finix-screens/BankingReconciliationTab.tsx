"use client";

import React from 'react';
import { usd } from '@/lib/company-calculations';
import { NumberInput } from './FinixControls';

interface BankingReconciliationTabProps {
  bankAccounts: { id: string; name: string; bankName: string; accountNumber: string; balance: number }[];
  selectedBankForReconcile: string;
  setSelectedBankForReconcile: (id: string) => void;
  reconcileRows: any[];
  statement: Record<string, number>;
  setStatement: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onReconcile: (id: string, statementAmount: number, reconciled: boolean) => Promise<void>;
}

export default function BankingReconciliationTab({
  bankAccounts,
  selectedBankForReconcile,
  setSelectedBankForReconcile,
  reconcileRows,
  statement,
  setStatement,
  onReconcile
}: BankingReconciliationTabProps) {
  const sign = (type: string, value: number) => (type === 'deposit' ? value : -value);

  return (
    <div className="space-y-3">
      {/* Cuentas Bancarias Registradas */}
      <div className="bg-white border border-[#a6b8cc] rounded-xs p-3 shadow-xs space-y-2">
        <h4 className="font-bold text-[#003366] text-xs">Cuentas Bancarias de la Empresa</h4>
        <div className="overflow-x-auto border border-[#b4c4d4] rounded-xs">
          <table className="w-full border-collapse text-left text-[11px]">
            <thead className="bg-[#e4ebf3] font-bold text-[#1e293b] border-b border-[#a8bccf]">
              <tr>
                <th className="p-1.5">Nombre de Cuenta</th>
                <th className="p-1.5">Institución Bancaria</th>
                <th className="p-1.5">Número de Cuenta</th>
                <th className="p-1.5 text-right">Saldo en Libros (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4e1ed]">
              {bankAccounts.map(acc => (
                <tr key={acc.id} className="hover:bg-[#fffde7]">
                  <td className="p-1.5 font-bold text-[#003366]">{acc.name}</td>
                  <td className="p-1.5">{acc.bankName}</td>
                  <td className="p-1.5 font-mono text-gray-700">{acc.accountNumber}</td>
                  <td className="p-1.5 text-right font-mono font-bold text-emerald-800">{usd(acc.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filtro y Reconciliación */}
      <div className="bg-white border border-[#a6b8cc] rounded-xs p-3 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="font-bold text-xs text-[#003366]">Filtrar por cuenta:</label>
            <select
              className="border border-[#9fb4c7] px-2 py-1 text-[11px] rounded-xs bg-white"
              value={selectedBankForReconcile}
              onChange={e => setSelectedBankForReconcile(e.target.value)}
            >
              <option value="">Todas las cuentas</option>
              {bankAccounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.bankName})
                </option>
              ))}
            </select>
          </div>

          <span className="text-[10.5px] text-gray-600">
            {reconcileRows.length} movimiento(s) registrado(s)
          </span>
        </div>

        {/* Tabla de Movimientos y Diferencias */}
        <div className="overflow-x-auto border border-[#b4c4d4] rounded-xs">
          <table className="w-full border-collapse text-left text-[11px]">
            <thead className="bg-[#e4ebf3] font-bold text-[#1e293b] border-b border-[#a8bccf]">
              <tr>
                <th className="p-1.5 w-24">Fecha</th>
                <th className="p-1.5 min-w-36">Referencia</th>
                <th className="p-1.5 w-28 text-right">Saldo Libro</th>
                <th className="p-1.5 w-32 text-right">Importe Extracto</th>
                <th className="p-1.5 w-28 text-right">Diferencia</th>
                <th className="p-1.5 w-24 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4e1ed]">
              {reconcileRows.map(t => {
                const book = sign(t.type, t.amount);
                const value = statement[t.id] ?? t.statementAmount ?? 0;
                const diff = book - value;
                return (
                  <tr key={t.id} className="hover:bg-[#fffde7]">
                    <td className="p-1.5 font-mono">{t.date}</td>
                    <td className="p-1.5 font-medium">{t.reference || t.transactionId}</td>
                    <td className="p-1.5 text-right font-mono font-bold text-[#003366]">{usd(book)}</td>
                    <td className="p-1.5 text-right font-mono">
                      <NumberInput
                        ariaLabel={`Importe banco ${t.transactionId}`}
                        value={value}
                        onChange={val => setStatement(s => ({ ...s, [t.id]: val }))}
                      />
                    </td>
                    <td className="p-1.5 text-right font-mono font-bold text-gray-700">{usd(diff)}</td>
                    <td className="p-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => onReconcile(t.id, value, !t.reconciled)}
                        className={`px-2 py-0.5 rounded-xs font-bold text-[10px] cursor-pointer shadow-2xs transition active:scale-95 ${
                          t.reconciled
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {t.reconciled ? '✓ Conciliada' : 'Conciliar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
