'use client';

import React from 'react';

export interface ItemAttachment {
  id: string;
  targetPath: string;
  fileName: string;
  date: string;
  freeText: string;
}

interface ItemTabsDetailProps {
  activeTab: 'general' | 'compras' | 'ventas' | 'inventario' | 'planificacion' | 'anexos';
  setActiveTab: (tab: 'general' | 'compras' | 'ventas' | 'inventario' | 'planificacion' | 'anexos') => void;
  // Pestaña General
  barcode: string;
  setBarcode: (v: string) => void;
  inventoryUnit: string;
  setInventoryUnit: (v: string) => void;
  manageMethod: 'none' | 'lot' | 'serial';
  setManageMethod: (v: 'none' | 'lot' | 'serial') => void;
  contractModel: string;
  setContractModel: (v: string) => void;
  active: boolean;
  setActive: (v: boolean) => void;
  // Pestaña Compras
  vendors: Array<{ id: string; cardCode: string; name: string }>;
  preferredVendor: string;
  setPreferredVendor: (v: string) => void;
  purchaseUnit: string;
  setPurchaseUnit: (v: string) => void;
  purchasePrice: number;
  setPurchasePrice: (v: number) => void;
  // Pestaña Ventas
  salesUnit: string;
  setSalesUnit: (v: string) => void;
  price: number;
  setPrice: (v: number) => void;
  price2: number;
  setPrice2: (v: number) => void;
  maxDiscount: number;
  setMaxDiscount: (v: number) => void;
  salesTaxRate: number;
  setSalesTaxRate: (v: number) => void;
  // Pestaña Inventario
  currentStock: number;
  committedStock: number;
  orderedStock: number;
  costingMethod: 'average' | 'fifo' | 'standard';
  setCostingMethod: (v: 'average' | 'fifo' | 'standard') => void;
  minStock: number;
  setMinStock: (v: number) => void;
  // Pestaña Planificación
  planningMethod: 'buy' | 'production';
  setPlanningMethod: (v: 'buy' | 'production') => void;
  purchaseLeadDays: number;
  setPurchaseLeadDays: (v: number) => void;
  mrpActive: boolean;
  setMrpActive: (v: boolean) => void;
  // Pestaña Anexos
  attachments: ItemAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<ItemAttachment[]>>;
  selectedAttachmentIndex: number | null;
  setSelectedAttachmentIndex: (v: number | null) => void;
}

export default function ItemTabsDetail({
  activeTab,
  setActiveTab,
  barcode,
  setBarcode,
  inventoryUnit,
  setInventoryUnit,
  manageMethod,
  setManageMethod,
  contractModel,
  setContractModel,
  active,
  setActive,
  vendors,
  preferredVendor,
  setPreferredVendor,
  purchaseUnit,
  setPurchaseUnit,
  purchasePrice,
  setPurchasePrice,
  salesUnit,
  setSalesUnit,
  price,
  setPrice,
  price2,
  setPrice2,
  maxDiscount,
  setMaxDiscount,
  salesTaxRate,
  setSalesTaxRate,
  currentStock,
  committedStock,
  orderedStock,
  costingMethod,
  setCostingMethod,
  minStock,
  setMinStock,
  planningMethod,
  setPlanningMethod,
  purchaseLeadDays,
  setPurchaseLeadDays,
  mrpActive,
  setMrpActive,
  attachments,
  setAttachments,
  selectedAttachmentIndex,
  setSelectedAttachmentIndex,
}: ItemTabsDetailProps) {
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'compras', label: 'Datos de compras' },
    { id: 'ventas', label: 'Datos de ventas' },
    { id: 'inventario', label: 'Datos de inventario' },
    { id: 'planificacion', label: 'Planificación' },
    { id: 'anexos', label: 'Anexos' },
  ] as const;

  const baseInput =
    'col-span-2 border border-[#9fb4c7] bg-white text-[#1e293b] px-2 py-0.5 text-[11px] rounded-xs focus:bg-[#fffde7] focus:outline-none focus:ring-1 focus:ring-[#0070d2] shadow-2xs';

  return (
    <div>
      {/* ── BARRA DE PESTAÑAS CANÓNICA SAP B1 ── */}
      <div className="flex border-b border-[#a6b8cc] bg-[#e4ebf3] px-2 pt-1.5 gap-1 text-[11px] font-semibold select-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 rounded-t-xs border-t border-x transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white border-[#a6b8cc] border-b-white text-[#003366] font-bold shadow-xs -mb-[1px] z-10'
                : 'border-transparent text-[#475569] hover:bg-slate-200 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── CUERPO DE PESTAÑAS ── */}
      <div className="bg-white border border-[#a6b8cc] border-t-0 p-3 rounded-b-xs shadow-xs min-h-[220px]">
        {/* PESTAÑA: GENERAL */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-medium text-[#475569]">Código de barras</label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className={`${baseInput} font-mono`}
                  placeholder="7861000123456"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-medium text-[#475569]">Unidad de medida base</label>
                <input
                  type="text"
                  value={inventoryUnit}
                  onChange={(e) => setInventoryUnit(e.target.value)}
                  className={baseInput}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-medium text-[#475569]">Gestionado por</label>
                <select
                  value={manageMethod}
                  onChange={(e) => setManageMethod(e.target.value as 'none' | 'lot' | 'serial')}
                  className={baseInput}
                >
                  <option value="none">Ninguno</option>
                  <option value="serial">Números de serie</option>
                  <option value="lot">Lotes</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-medium text-[#475569]">Modelo de contrato</label>
                <input
                  type="text"
                  value={contractModel}
                  onChange={(e) => setContractModel(e.target.value)}
                  placeholder="Garantía Estándar"
                  className={baseInput}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded text-[#0070d2]"
                />
                <span className={active ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                  {active ? 'Artículo Activo en el Catálogo' : 'Artículo Inactivo'}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* PESTAÑA: DATOS DE COMPRAS */}
        {activeTab === 'compras' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-medium text-[#475569]">Proveedor preferido</label>
                <select
                  value={preferredVendor}
                  onChange={(e) => setPreferredVendor(e.target.value)}
                  className={baseInput}
                >
                  <option value="">Sin preferencia...</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.cardCode}>
                      {v.cardCode} · {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-medium text-[#475569]">Unidad de compra</label>
                <input
                  type="text"
                  value={purchaseUnit}
                  onChange={(e) => setPurchaseUnit(e.target.value)}
                  className={baseInput}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-bold text-[#003366]">Precio de compra USD</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className={`${baseInput} font-mono font-bold text-[#0055a5]`}
                />
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA: DATOS DE VENTAS */}
        {activeTab === 'ventas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-medium text-[#475569]">Unidad de venta</label>
                <input
                  type="text"
                  value={salesUnit}
                  onChange={(e) => setSalesUnit(e.target.value)}
                  className={baseInput}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-bold text-[#003366]">Precio Lista 1 (Base)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className={`${baseInput} font-mono font-bold text-[#0055a5]`}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-medium text-[#475569]">Precio Lista 2 (Mayorista)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={price2}
                  onChange={(e) => setPrice2(Number(e.target.value))}
                  className={`${baseInput} font-mono`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-medium text-[#475569]">Descuento máx %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(Number(e.target.value))}
                  className={`${baseInput} font-mono`}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-medium text-[#475569]">IVA Ventas %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={salesTaxRate}
                  onChange={(e) => setSalesTaxRate(Number(e.target.value))}
                  className={`${baseInput} font-mono`}
                />
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA: DATOS DE INVENTARIO */}
        {activeTab === 'inventario' && (
          <div className="space-y-3">
            {/* Tabla Canónica de Almacenes SAP B1 */}
            <div className="border border-[#b4c4d4] rounded-xs overflow-hidden">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-[#e4ebf3] font-bold text-[#003366] border-b border-[#a8bccf]">
                  <tr>
                    <th className="p-1.5 border-r border-[#c2d3e3]">Cód. Almacén</th>
                    <th className="p-1.5 border-r border-[#c2d3e3]">Nombre de Almacén</th>
                    <th className="p-1.5 border-r border-[#c2d3e3] text-right">En stock</th>
                    <th className="p-1.5 border-r border-[#c2d3e3] text-right">Comprometido</th>
                    <th className="p-1.5 border-r border-[#c2d3e3] text-right">Solicitado</th>
                    <th className="p-1.5 text-right font-black text-[#0055a5]">Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="p-1.5 font-mono font-bold text-gray-700 border-r border-[#d4e1ed]">01</td>
                    <td className="p-1.5 font-medium border-r border-[#d4e1ed]">Bodega Central Matriz</td>
                    <td className="p-1.5 text-right font-mono font-bold text-emerald-700 border-r border-[#d4e1ed]">
                      {currentStock}
                    </td>
                    <td className="p-1.5 text-right font-mono text-gray-600 border-r border-[#d4e1ed]">
                      {committedStock}
                    </td>
                    <td className="p-1.5 text-right font-mono text-blue-600 border-r border-[#d4e1ed]">
                      {orderedStock}
                    </td>
                    <td className="p-1.5 text-right font-mono font-extrabold text-[#0055a5]">
                      {currentStock - committedStock + orderedStock}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-bold text-[#003366]">Método de valoración</label>
                <select
                  value={costingMethod}
                  onChange={(e) => setCostingMethod(e.target.value as typeof costingMethod)}
                  className={baseInput}
                >
                  <option value="average">Promedio ponderado</option>
                  <option value="fifo">FIFO (Primeras entradas, primeras salidas)</option>
                  <option value="standard">Precio estándar</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-medium text-[#475569]">Stock mínimo</label>
                <input
                  type="number"
                  value={minStock}
                  onChange={(e) => setMinStock(Number(e.target.value))}
                  className={`${baseInput} font-mono`}
                />
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA: PLANIFICACIÓN */}
        {activeTab === 'planificacion' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-bold text-[#003366]">Método aprovisionamiento</label>
                <select
                  value={planningMethod}
                  onChange={(e) => setPlanningMethod(e.target.value as typeof planningMethod)}
                  className={baseInput}
                >
                  <option value="buy">Comprar</option>
                  <option value="production">Fabricar / Producir</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] font-medium text-[#475569]">Plazo de entrega (días)</label>
                <input
                  type="number"
                  min={0}
                  value={purchaseLeadDays}
                  onChange={(e) => setPurchaseLeadDays(Number(e.target.value))}
                  className={`${baseInput} font-mono`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={mrpActive}
                  onChange={(e) => setMrpActive(e.target.checked)}
                  className="rounded text-[#0070d2]"
                />
                <span className="font-semibold text-[#003366]">Participa en planificación MRP</span>
              </label>
            </div>
          </div>
        )}

        {/* PESTAÑA: ANEXOS */}
        {activeTab === 'anexos' && (
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 overflow-x-auto border border-[#b4c4d4] rounded-xs shadow-inner bg-white">
                <table className="w-full border-collapse text-left text-[11px]">
                  <thead className="bg-[#e4ebf3] font-bold text-[#1e293b] border-b border-[#a8bccf]">
                    <tr>
                      <th className="p-1.5 border-r border-[#c2d3e3] w-8 text-center">#</th>
                      <th className="p-1.5 border-r border-[#c2d3e3] w-48">Vía de acceso destino</th>
                      <th className="p-1.5 border-r border-[#c2d3e3] min-w-44">Nombre de archivo</th>
                      <th className="p-1.5 border-r border-[#c2d3e3] w-28">Fecha del anexo</th>
                      <th className="p-1.5">Texto libre</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d4e1ed]">
                    {attachments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-400 italic">
                          No hay fichas técnicas ni manuales anexados a este artículo. Haz clic en &quot;Explorar...&quot; para adjuntar.
                        </td>
                      </tr>
                    ) : (
                      attachments.map((att, idx) => (
                        <tr
                          key={att.id}
                          onClick={() => setSelectedAttachmentIndex(idx)}
                          className={`cursor-pointer transition-colors ${
                            selectedAttachmentIndex === idx ? 'bg-[#fffde7] font-semibold text-[#003366]' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="p-1.5 text-center font-mono font-bold text-gray-500 bg-[#f7fafc] border-r border-[#d4e1ed]">
                            {idx + 1}
                          </td>
                          <td className="p-1.5 font-mono text-[10.5px] text-gray-600 border-r border-[#d4e1ed] truncate max-w-[160px]">
                            {att.targetPath}
                          </td>
                          <td className="p-1.5 font-medium border-r border-[#d4e1ed] text-[#003366]">
                            📄 {att.fileName}
                          </td>
                          <td className="p-1.5 text-gray-700 border-r border-[#d4e1ed] whitespace-nowrap">
                            {att.date}
                          </td>
                          <td className="p-1">
                            <input
                              type="text"
                              value={att.freeText}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAttachments((prev) => prev.map((a, j) => (j === idx ? { ...a, freeText: val } : a)));
                              }}
                              className="w-full bg-white text-[#1e293b] border-b border-transparent hover:border-[#9fb4c7] px-1 py-0.5 text-[11px] outline-none"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="w-full md:w-32 flex md:flex-col gap-2 shrink-0">
                <label className="w-full">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAttachments((prev) => [
                          ...prev,
                          {
                            id: `att-${Date.now()}`,
                            targetPath: 'C:\\SAP_B1\\Item_Attachments\\',
                            fileName: file.name,
                            date: new Date().toISOString().slice(0, 10),
                            freeText: 'Ficha técnica de artículo',
                          },
                        ]);
                      }
                    }}
                  />
                  <span className="block w-full text-center px-3 py-1.5 bg-[#f0f4f8] hover:bg-white border border-[#9fb4c7] rounded-xs text-[11px] font-bold text-[#003366] cursor-pointer shadow-2xs active:scale-95 transition">
                    Explorar...
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedAttachmentIndex !== null && attachments[selectedAttachmentIndex]) {
                      alert(`Visualizando: ${attachments[selectedAttachmentIndex].fileName}`);
                    }
                  }}
                  disabled={selectedAttachmentIndex === null}
                  className="w-full px-3 py-1.5 bg-[#f0f4f8] hover:bg-white disabled:opacity-40 border border-[#9fb4c7] rounded-xs text-[11px] font-bold text-[#003366] cursor-pointer shadow-2xs"
                >
                  Visualizar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedAttachmentIndex !== null) {
                      setAttachments((prev) => prev.filter((_, i) => i !== selectedAttachmentIndex));
                      setSelectedAttachmentIndex(null);
                    }
                  }}
                  disabled={selectedAttachmentIndex === null}
                  className="w-full px-3 py-1.5 bg-[#fdf2f2] hover:bg-red-500 hover:text-white disabled:opacity-40 border border-red-300 rounded-xs text-[11px] font-bold text-red-700 cursor-pointer shadow-2xs"
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
