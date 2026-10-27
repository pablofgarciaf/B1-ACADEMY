'use client';

import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { today } from '@/lib/company-calculations';
import { Screen, Field, Table, inputClass, buttonClass } from './FinixControls';

export interface BatchRecord {
  id: string;
  itemCode: string;
  warehouseCode: string;
  batchNumber: string;
  quantity: number;
  admissionDate: string;
  expirationDate: string;
  manufacturingDate: string;
  status: 'Liberado' | 'Retenido' | 'Bloqueado';
  notes: string;
}

export default function BatchSerialScreen() {
  const c = useCompany();
  const items = c.data.items.filter(i => i.type === 'inventory');
  const warehouses = c.data.profile?.warehouses?.length
    ? c.data.profile.warehouses
    : [{ code: '01', name: 'Almacén Principal' }, { code: '02', name: 'Almacén Secundario' }];

  const [selectedItem, setSelectedItem] = useState(items[0]?.itemCode || '');
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]?.code || '01');
  const [mode, setMode] = useState<'lotes' | 'series'>('lotes');

  // Lotes almacenados en memoria / perfil de simulación
  const [batches, setBatches] = useState<BatchRecord[]>([
    {
      id: 'b-001',
      itemCode: items[0]?.itemCode || 'A00001',
      warehouseCode: '01',
      batchNumber: 'LOT-2026-001',
      quantity: 50,
      admissionDate: today(),
      expirationDate: '2026-12-31',
      manufacturingDate: '2026-01-15',
      status: 'Liberado',
      notes: 'Lote inicial inspeccionado y aprobado para despacho.',
    },
    {
      id: 'b-002',
      itemCode: items[0]?.itemCode || 'A00001',
      warehouseCode: '01',
      batchNumber: 'LOT-2026-002',
      quantity: 25,
      admissionDate: today(),
      expirationDate: '2027-06-30',
      manufacturingDate: '2026-02-10',
      status: 'Retenido',
      notes: 'En control de calidad por muestra de laboratorio.',
    },
  ]);

  // Formulario nuevo lote
  const [newBatch, setNewBatch] = useState({
    batchNumber: '',
    quantity: 10,
    expirationDate: '2026-12-31',
    manufacturingDate: today(),
    status: 'Liberado' as 'Liberado' | 'Retenido' | 'Bloqueado',
    notes: '',
  });

  const filteredBatches = batches.filter(
    b => (!selectedItem || b.itemCode === selectedItem) && (!selectedWarehouse || b.warehouseCode === selectedWarehouse)
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.batchNumber.trim() || !selectedItem) return;

    const record: BatchRecord = {
      id: 'b-' + Math.random().toString(36).slice(2, 7),
      itemCode: selectedItem,
      warehouseCode: selectedWarehouse,
      batchNumber: newBatch.batchNumber.trim().toUpperCase(),
      quantity: Number(newBatch.quantity),
      admissionDate: today(),
      expirationDate: newBatch.expirationDate,
      manufacturingDate: newBatch.manufacturingDate,
      status: newBatch.status,
      notes: newBatch.notes,
    };

    setBatches(prev => [record, ...prev]);
    setNewBatch({
      batchNumber: '',
      quantity: 10,
      expirationDate: '2026-12-31',
      manufacturingDate: today(),
      status: 'Liberado',
      notes: '',
    });
  };

  const handleToggleStatus = (id: string) => {
    setBatches(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        const nextStatus = b.status === 'Liberado' ? 'Retenido' : b.status === 'Retenido' ? 'Bloqueado' : 'Liberado';
        return { ...b, status: nextStatus };
      })
    );
  };

  return (
    <Screen title="Gestión de Lotes y Números de Serie (SAP Business One)">
      <div className="space-y-3">
        {/* Barra superior de modo y filtros */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-300 pb-2">
          <div className="flex gap-2">
            <button
              type="button"
              className={`${buttonClass} ${mode === 'lotes' ? 'bg-[#003366] text-white font-bold' : ''}`}
              onClick={() => setMode('lotes')}
            >
              🏷️ Gestión de Lotes
            </button>
            <button
              type="button"
              className={`${buttonClass} ${mode === 'series' ? 'bg-[#003366] text-white font-bold' : ''}`}
              onClick={() => setMode('series')}
            >
              🔢 Números de Serie
            </button>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            {filteredBatches.length} registro(s) para el artículo seleccionado
          </span>
        </div>

        {/* Criterios de Selección */}
        <div className="grid gap-3 sm:grid-cols-2 bg-gray-50 p-2.5 rounded border border-gray-200">
          <Field label="Artículo (Maestro OITM)">
            <select
              className={inputClass}
              value={selectedItem}
              onChange={e => setSelectedItem(e.target.value)}
            >
              <option value="">-- Todos los artículos --</option>
              {items.map(it => (
                <option key={it.id} value={it.itemCode}>
                  {it.itemCode} · {it.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Almacén">
            <select
              className={inputClass}
              value={selectedWarehouse}
              onChange={e => setSelectedWarehouse(e.target.value)}
            >
              <option value="">-- Todos los almacenes --</option>
              {warehouses.map(w => (
                <option key={w.code} value={w.code}>
                  {w.code} · {w.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Tabla oficial de lotes */}
        <Table
          headers={[
            mode === 'lotes' ? 'Nº de Lote' : 'Nº de Serie',
            'Artículo',
            'Almacén',
            'Cantidad',
            'Admisión',
            'Fabricación',
            'Vencimiento',
            'Estado',
            'Acción',
          ]}
          rows={filteredBatches.map(b => [
            <span key="num" className="font-mono font-bold text-[#003366]">
              {b.batchNumber}
            </span>,
            b.itemCode,
            b.warehouseCode,
            <span key="qty" className="font-mono font-bold">
              {b.quantity}
            </span>,
            b.admissionDate,
            b.manufacturingDate,
            b.expirationDate,
            <span
              key="st"
              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                b.status === 'Liberado'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : b.status === 'Retenido'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              {b.status}
            </span>,
            <button
              key="btn"
              type="button"
              className={`${buttonClass} text-xs`}
              onClick={() => handleToggleStatus(b.id)}
            >
              Cambiar Estado
            </button>,
          ])}
        />

        {/* Formulario de Definición de Nuevo Lote / Serie */}
        <form
          onSubmit={handleCreate}
          className="border border-[#7f9db9] bg-[#f9fbfd] p-3 rounded space-y-2"
        >
          <h4 className="font-bold text-[#003366] text-xs uppercase tracking-wide">
            ➕ Asignar nuevo {mode === 'lotes' ? 'Lote' : 'Número de Serie'}
          </h4>
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <Field label={mode === 'lotes' ? 'Nº Lote' : 'Nº Serie'} required>
              <input
                required
                className={inputClass}
                placeholder={mode === 'lotes' ? 'LOT-2026-...' : 'SER-2026-...'}
                value={newBatch.batchNumber}
                onChange={e => setNewBatch(v => ({ ...v, batchNumber: e.target.value }))}
              />
            </Field>
            <Field label="Cantidad">
              <input
                type="number"
                min={1}
                className={inputClass}
                value={newBatch.quantity}
                onChange={e => setNewBatch(v => ({ ...v, quantity: Number(e.target.value) }))}
              />
            </Field>
            <Field label="F. Fabricación">
              <input
                type="date"
                className={inputClass}
                value={newBatch.manufacturingDate}
                onChange={e => setNewBatch(v => ({ ...v, manufacturingDate: e.target.value }))}
              />
            </Field>
            <Field label="F. Vencimiento">
              <input
                type="date"
                className={inputClass}
                value={newBatch.expirationDate}
                onChange={e => setNewBatch(v => ({ ...v, expirationDate: e.target.value }))}
              />
            </Field>
            <Field label="Estado">
              <select
                className={inputClass}
                value={newBatch.status}
                onChange={e =>
                  setNewBatch(v => ({
                    ...v,
                    status: e.target.value as 'Liberado' | 'Retenido' | 'Bloqueado',
                  }))
                }
              >
                <option value="Liberado">Liberado</option>
                <option value="Retenido">Retenido</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>
            </Field>
            <div className="flex items-end">
              <button
                type="submit"
                className={`${buttonClass} bg-[#003366] text-white font-bold w-full`}
              >
                [ Crear ]
              </button>
            </div>
          </div>
        </form>
      </div>
    </Screen>
  );
}
