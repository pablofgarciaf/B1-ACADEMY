'use client';

import React, { useState, useEffect } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { CommandData } from '@/lib/company-commands';
import { usd } from '@/lib/company-calculations';
import {
  Package,
  Search,
  Plus,
  Save,
  Trash2,
  Factory,
  Layers,
  FileSpreadsheet,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ShoppingCart,
  Boxes,
  Calendar,
} from 'lucide-react';

export default function ItemMasterForm() {
  const c = useCompany();
  const items = c.data.items || [];

  const [formMode, setFormMode] = useState<'create' | 'edit' | 'search'>('create');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<'general' | 'compras' | 'ventas' | 'inventario' | 'planificacion' | 'anexos'>('general');

  // Cabecera OITM
  const [itemCode, setItemCode] = useState('');
  const [name, setName] = useState('');
  const [foreignName, setForeignName] = useState('');
  const [itemClass, setItemClass] = useState('100');
  const [group, setGroup] = useState('General');
  const [priceList, setPriceList] = useState('Lista 1 — PVP Base');

  // 3 Checkboxes Oficiales SAP B1
  const [isInventoryItem, setIsInventoryItem] = useState(true);
  const [isSalesItem, setIsSalesItem] = useState(true);
  const [isPurchaseItem, setIsPurchaseItem] = useState(true);

  // Pestaña General
  const [active, setActive] = useState(true);
  const [barcode, setBarcode] = useState('');
  const [inventoryUnit, setInventoryUnit] = useState('UND');

  // Pestaña Compras
  const [preferredVendor, setPreferredVendor] = useState('');
  const [purchaseUnit, setPurchaseUnit] = useState('UND');
  const [purchasePrice, setPurchasePrice] = useState<number>(20);

  // Pestaña Ventas
  const [salesUnit, setSalesUnit] = useState('UND');
  const [price, setPrice] = useState<number>(35);
  const [price2, setPrice2] = useState<number>(30);
  const [price3, setPrice3] = useState<number>(25);
  const [maxDiscount, setMaxDiscount] = useState<number>(100);
  const [salesTaxRate, setSalesTaxRate] = useState<number>(15);

  // Pestaña Inventario
  const [defaultWarehouse, setDefaultWarehouse] = useState('01');
  const [costingMethod, setCostingMethod] = useState<'average' | 'fifo' | 'standard'>('average');
  const [standardCost, setStandardCost] = useState<number>(20);
  const [minStock, setMinStock] = useState<number>(5);
  const [maxStock, setMaxStock] = useState<number>(1000);
  const [reorderPoint, setReorderPoint] = useState<number>(10);
  const [currentStock, setCurrentStock] = useState<number>(50);
  const [committedStock, setCommittedStock] = useState<number>(5);
  const [orderedStock, setOrderedStock] = useState<number>(20);

  // Pestaña Planificación
  const [planningMethod, setPlanningMethod] = useState<'buy' | 'production'>('buy');
  const [mrpActive, setMrpActive] = useState(false);
  const [purchaseLeadDays, setPurchaseLeadDays] = useState<number>(3);
  const [orderMultiple, setOrderMultiple] = useState<number>(1);
  const [forecastQuantity, setForecastQuantity] = useState<number>(0);

  // Anexos
  const [attachments, setAttachments] = useState<Array<{ id: string; targetPath: string; fileName: string; date: string; freeText: string }>>([]);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState<number | null>(null);

  // Cargar registro seleccionado
  const loadItem = (index: number) => {
    if (index < 0 || index >= items.length) return;
    const it = items[index];
    setSelectedIndex(index);
    setFormMode('edit');
    setItemCode(it.itemCode || '');
    setName(it.name || '');
    setGroup(it.group || 'General');
    setItemClass(it.itemClass || '100');
    setBarcode(it.barcode || '');
    setInventoryUnit(it.inventoryUnit || 'UND');
    setPurchaseUnit(it.purchaseUnit || 'UND');
    setSalesUnit(it.salesUnit || 'UND');
    setPreferredVendor(it.preferredVendor || '');
    setPurchasePrice(it.purchasePrice || 0);
    setPrice(it.price || 0);
    setPrice2(it.price2 || 0);
    setPrice3(it.price3 || 0);
    setMaxDiscount(it.maxDiscount || 0);
    setSalesTaxRate(it.salesTaxRate || 15);
    setDefaultWarehouse(it.defaultWarehouse || '01');
    setCostingMethod(it.costingMethod || 'average');
    setStandardCost(it.standardCost || 0);
    setMinStock(it.minStock || 0);
    setMaxStock(it.maxStock || 1000);
    setReorderPoint(it.reorderPoint || 0);
    setCurrentStock((it as any).stock ?? 50);
    setActive(it.active ?? true);
    setPlanningMethod(it.planningMethod || 'buy');
    setMrpActive(Boolean(it.mrpActive));
    setPurchaseLeadDays(it.purchaseLeadDays || 0);
  };

  const resetFormToCreate = () => {
    setSelectedIndex(-1);
    setFormMode('create');
    const autoCode = `A${String(items.length + 1).padStart(5, '0')}`;
    setItemCode(autoCode);
    setName('');
    setForeignName('');
    setItemClass('100');
    setGroup('General');
    setPriceList('Lista 1 — PVP Base');
    setIsInventoryItem(true);
    setIsSalesItem(true);
    setIsPurchaseItem(true);
    setActive(true);
    setBarcode('');
    setInventoryUnit('UND');
    setPreferredVendor('');
    setPurchaseUnit('UND');
    setPurchasePrice(20);
    setSalesUnit('UND');
    setPrice(35);
    setPrice2(30);
    setPrice3(25);
    setMaxDiscount(100);
    setSalesTaxRate(15);
    setDefaultWarehouse('01');
    setCostingMethod('average');
    setStandardCost(20);
    setMinStock(5);
    setMaxStock(1000);
    setReorderPoint(10);
    setCurrentStock(0);
    setCommittedStock(0);
    setOrderedStock(0);
    setPlanningMethod('buy');
    setMrpActive(false);
    setPurchaseLeadDays(3);
    setOrderMultiple(1);
    setForecastQuantity(0);
    setAttachments([]);
  };

  useEffect(() => {
    if (selectedIndex === -1) {
      resetFormToCreate();
    }
  }, []);

  // Atajos de teclado oficiales de SAP B1
  useEffect(() => {
    const onSapAdd = () => resetFormToCreate();
    const onSapSearch = () => {
      setFormMode('search');
      const itemCodeInput = document.querySelector('input[placeholder*="Auto (A00001)"]') as HTMLInputElement | null;
      if (itemCodeInput) {
        itemCodeInput.focus();
        itemCodeInput.select();
      }
    };
    const onSapSave = () => {
      const formEl = document.getElementById('item-master-form') as HTMLFormElement | null;
      if (formEl) formEl.requestSubmit();
    };
    const onSapEscape = () => {
      if (formMode === 'search') {
        resetFormToCreate();
      }
    };

    window.addEventListener('sap-add-mode', onSapAdd);
    window.addEventListener('sap-search-mode', onSapSearch);
    window.addEventListener('sap-save-document', onSapSave);
    window.addEventListener('sap-escape', onSapEscape);
    return () => {
      window.removeEventListener('sap-add-mode', onSapAdd);
      window.removeEventListener('sap-search-mode', onSapSearch);
      window.removeEventListener('sap-save-document', onSapSave);
      window.removeEventListener('sap-escape', onSapEscape);
    };
  }, [items, formMode]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === 'search') {
      const qCode = itemCode.trim().toLowerCase();
      const qName = name.trim().toLowerCase();
      const qBarcode = barcode.trim();
      const matched = items.find(it =>
        (qCode && it.itemCode.toLowerCase().includes(qCode)) ||
        (qName && it.name.toLowerCase().includes(qName)) ||
        (qBarcode && it.barcode && it.barcode.includes(qBarcode))
      );
      if (matched) {
        const idx = items.findIndex(it => it.itemCode === matched.itemCode);
        loadItem(idx);
      } else if (items.length > 0) {
        loadItem(0);
      } else {
        alert('No se encontraron artículos con ese criterio de búsqueda.');
      }
      return;
    }

    if (!name.trim()) {
      alert('Introduce la descripción del artículo.');
      return;
    }

    const payload: CommandData<'item'> = {
      name,
      type: isInventoryItem ? 'inventory' : 'service',
      group,
      itemClass,
      uomGroup: '',
      inventoryUnit,
      purchaseUnit,
      salesUnit,
      barcode,
      salesTaxRate: (salesTaxRate as 0 | 15 | 5 | 8) || 15,
      price,
      price2,
      price3,
      maxDiscount,
      purchasePrice,
      preferredVendor,
      costingMethod,
      standardCost,
      minStock,
      maxStock,
      reorderPoint,
      defaultWarehouse,
      planningMethod,
      mrpActive,
      planningWarehouse: defaultWarehouse,
      purchaseLeadDays,
      productionLeadDays: 0,
      orderInterval: '',
      orderMultiple,
      planningMinimum: 0,
      forecastQuantity,
      description: name,
      specifications: '',
      active,
      manageMethod: 'none',
      perpetualInventory: true,
      contractModel: '',
      ice: 'none',
      weight: 0.5,
      length: 10,
      width: 10,
      height: 10,
    };

    try {
      if (formMode === 'create' || selectedIndex < 0) {
        await c.save({ action: 'item', data: payload });
        resetFormToCreate();
      } else {
        const existing = items[selectedIndex];
        await c.save({
          action: 'itemUpdate',
          data: { ...payload, itemCode: existing.itemCode || itemCode },
        });
      }
    } catch {
      /* Handled by c.save */
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f0f4f8] text-[#1e293b] font-[Tahoma,Arial,sans-serif] text-[11px] select-none p-2 sm:p-3 overflow-y-auto">
      {/* ── BARRA DE TÍTULO Y NAVEGADOR ESTILO SAP B1 ── */}
      <div className="bg-[#e4ebf3] border border-[#a6b8cc] rounded-t-xs px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[#0055a5] text-sm font-bold">📦</span>
          <span className="font-bold text-xs text-[#0a246a]">
            Datos Maestros de Artículos (OITM)
          </span>
          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#fffde7] text-[#8a5d00] border border-[#e0c46c]">
            {formMode === 'create' ? 'Modo Crear' : formMode === 'search' ? 'Modo Buscar' : 'Modo Visualizar / Actualizar'}
          </span>
        </div>

        {/* Controles de Navegación SAP B1 [|◀] [◀] (X de Y) [▶] [▶|] */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => loadItem(0)}
            disabled={items.length === 0}
            className="p-1 bg-white hover:bg-slate-100 border border-[#b8c9d4] rounded-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Primer artículo"
          >
            <ChevronsLeft size={13} />
          </button>
          <button
            type="button"
            onClick={() => loadItem(Math.max(0, selectedIndex - 1))}
            disabled={selectedIndex <= 0}
            className="p-1 bg-white hover:bg-slate-100 border border-[#b8c9d4] rounded-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Artículo anterior"
          >
            <ChevronLeft size={13} />
          </button>
          <span className="text-[10.5px] px-2 font-mono text-gray-600">
            {selectedIndex >= 0 ? `${selectedIndex + 1} / ${items.length}` : `Nuevo (${items.length} arts)`}
          </span>
          <button
            type="button"
            onClick={() => loadItem(Math.min(items.length - 1, selectedIndex + 1))}
            disabled={selectedIndex < 0 || selectedIndex >= items.length - 1}
            className="p-1 bg-white hover:bg-slate-100 border border-[#b8c9d4] rounded-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Artículo siguiente"
          >
            <ChevronRight size={13} />
          </button>
          <button
            type="button"
            onClick={() => loadItem(items.length - 1)}
            disabled={items.length === 0}
            className="p-1 bg-white hover:bg-slate-100 border border-[#b8c9d4] rounded-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Último artículo"
          >
            <ChevronsRight size={13} />
          </button>
          <button
            type="button"
            onClick={resetFormToCreate}
            className="ml-2 px-2 py-0.5 bg-[#0070d2] text-white hover:bg-[#005bb5] rounded-xs font-bold text-[10.5px] flex items-center gap-1 shadow-2xs"
            title="Crear nuevo artículo (Ctrl+A)"
          >
            <Plus size={11} />
            <span>Nuevo</span>
          </button>
        </div>
      </div>

      {/* ── CUERPO PRINCIPAL DEL FORMULARIO OITM ── */}
      <form id="item-master-form" onSubmit={handleSave} className="border border-[#a6b8cc] border-t-0 bg-white p-3 rounded-b-xs space-y-3 shadow-xs">
        {/* Cabecera Canónica OITM (2 Columnas + 3 Checkboxes SAP B1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-[#cbd8e5] text-[11px]">
          {/* Columna Izquierda: Número de artículo, Descripción, Clase, Grupo */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] font-bold text-[#003366]">Número de artículo</label>
              <div className="col-span-2 flex items-center gap-1.5">
                <input
                  type="text"
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                  disabled={formMode === 'edit'}
                  className={`w-full border ${formMode === 'search' ? 'border-[#d49b00] bg-[#fffde7] ring-1 ring-[#f59e0b]/50' : 'border-[#9fb4c7] bg-[#fffde7]'} px-2 py-0.5 text-[11px] font-mono font-bold text-[#003366] rounded-xs focus:outline-none focus:ring-1 focus:ring-[#0070d2]`}
                  placeholder="Auto (A00001)"
                />
                <button
                  type="button"
                  onClick={() => setFormMode('search')}
                  className="p-1 bg-slate-100 hover:bg-slate-200 border border-[#9fb4c7] rounded-xs text-gray-600"
                  title="Buscar artículo existente (Ctrl+F)"
                >
                  <Search size={12} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] font-bold text-[#003366]">Descripción <span className="text-red-500">*</span></label>
              <input
                type="text"
                required={formMode !== 'search'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`col-span-2 border ${formMode === 'search' ? 'border-[#d49b00] bg-[#fffde7]' : 'border-[#9fb4c7] bg-white'} px-2 py-0.5 text-[11px] rounded-xs focus:bg-[#fffde7] focus:outline-none focus:ring-1 focus:ring-[#0070d2]`}
                placeholder="Descripción del ítem / producto"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] text-[#475569]">Nombre extranjero</label>
              <input
                type="text"
                value={foreignName}
                onChange={(e) => setForeignName(e.target.value)}
                className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] rounded-xs"
                placeholder="Nombre comercial alternativo"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] text-[#475569]">Grupo de artículos</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] rounded-xs"
              >
                <option value="General">General</option>
                <option value="Laptops">Laptops & Computadores</option>
                <option value="Perifericos">Periféricos & Accesorios</option>
                <option value="Servidores">Servidores & Redes</option>
                <option value="Suministros">Suministros & Repuestos</option>
              </select>
            </div>
          </div>

          {/* Columna Derecha: Lista de Precios y los 3 Checkboxes Canónicos de SAP B1 */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] text-[#475569]">Lista de precios</label>
              <select
                value={priceList}
                onChange={(e) => setPriceList(e.target.value)}
                className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] rounded-xs"
              >
                <option value="Lista 1 — PVP Base">Lista 1 — PVP Base</option>
                <option value="Lista 2 — Mayorista">Lista 2 — Mayorista</option>
                <option value="Lista 3 — Distribuidor">Lista 3 — Distribuidor</option>
              </select>
            </div>

            {/* Los 3 Checkboxes Icónicos de SAP Business One */}
            <div className="bg-[#f7fafc] border border-[#d4e1ed] p-2.5 rounded-xs space-y-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
                Propiedades del Artículo (SAP B1)
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#003366]">
                  <input
                    type="checkbox"
                    checked={isInventoryItem}
                    onChange={(e) => setIsInventoryItem(e.target.checked)}
                    className="rounded text-[#0070d2]"
                  />
                  <span>Artículo de inventario</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#003366]">
                  <input
                    type="checkbox"
                    checked={isSalesItem}
                    onChange={(e) => setIsSalesItem(e.target.checked)}
                    className="rounded text-[#0070d2]"
                  />
                  <span>Artículo de venta</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#003366]">
                  <input
                    type="checkbox"
                    checked={isPurchaseItem}
                    onChange={(e) => setIsPurchaseItem(e.target.checked)}
                    className="rounded text-[#0070d2]"
                  />
                  <span>Artículo de compra</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ── PESTAÑAS CANÓNICAS DE SAP BUSINESS ONE OITM ── */}
        <div className="border-b border-[#a6b8cc] flex items-center gap-1 select-none pt-1">
          {[
            { id: 'general', label: 'General' },
            { id: 'compras', label: 'Datos de compras' },
            { id: 'ventas', label: 'Datos de ventas' },
            { id: 'inventario', label: 'Datos de inventario' },
            { id: 'planificacion', label: 'Planificación' },
            { id: 'anexos', label: 'Anexos' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1 text-xs font-bold rounded-t-xs border-t-2 border-x transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#003366] border-t-[#0055a5] border-x-[#a6b8cc] border-b-white -mb-px shadow-xs'
                  : 'bg-[#e2eaf2] text-[#475569] border-transparent hover:bg-white/70'
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
                  <label className="text-[10.5px] text-[#475569]">Código de barras</label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs font-mono"
                    placeholder="7861000123456"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Unidad de medida base</label>
                  <input
                    type="text"
                    value={inventoryUnit}
                    onChange={(e) => setInventoryUnit(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
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
                  <label className="text-[10.5px] text-[#475569]">Proveedor preferido</label>
                  <select
                    value={preferredVendor}
                    onChange={(e) => setPreferredVendor(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
                  >
                    <option value="">Sin preferencia...</option>
                    {c.data.vendors.map((v) => (
                      <option key={v.id} value={v.cardCode}>
                        {v.cardCode} · {v.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Unidad de compra</label>
                  <input
                    type="text"
                    value={purchaseUnit}
                    onChange={(e) => setPurchaseUnit(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
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
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs font-mono font-bold text-[#0055a5]"
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
                  <label className="text-[10.5px] text-[#475569]">Unidad de venta</label>
                  <input
                    type="text"
                    value={salesUnit}
                    onChange={(e) => setSalesUnit(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
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
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs font-mono font-bold text-[#0055a5]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Precio Lista 2 (Mayorista)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={price2}
                    onChange={(e) => setPrice2(Number(e.target.value))}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Descuento máx %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">IVA Ventas %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={salesTaxRate}
                    onChange={(e) => setSalesTaxRate(Number(e.target.value))}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs font-mono"
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
                      <td className="p-1.5 text-right font-mono font-bold text-emerald-700 border-r border-[#d4e1ed]">{currentStock}</td>
                      <td className="p-1.5 text-right font-mono text-gray-600 border-r border-[#d4e1ed]">{committedStock}</td>
                      <td className="p-1.5 text-right font-mono text-blue-600 border-r border-[#d4e1ed]">{orderedStock}</td>
                      <td className="p-1.5 text-right font-mono font-extrabold text-[#0055a5]">{currentStock - committedStock + orderedStock}</td>
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
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
                  >
                    <option value="average">Promedio ponderado</option>
                    <option value="fifo">FIFO (Primeras entradas, primeras salidas)</option>
                    <option value="standard">Precio estándar</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Stock mínimo</label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs font-mono"
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
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
                  >
                    <option value="buy">Comprar</option>
                    <option value="production">Fabricar / Producir</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Plazo de entrega (días)</label>
                  <input
                    type="number"
                    min={0}
                    value={purchaseLeadDays}
                    onChange={(e) => setPurchaseLeadDays(Number(e.target.value))}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs font-mono"
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
                                className="w-full bg-transparent border-b border-transparent hover:border-[#9fb4c7] px-1 py-0.5 text-[11px] outline-none"
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

        {/* ── BOTONES OFICIALES DE ACCIÓN: [Crear / Actualizar] [Cancelar] ── */}
        <div className="flex items-center justify-between pt-2 border-t border-[#c1d1e0]">
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={c.saving}
              className="px-5 py-1.5 bg-[#0070d2] hover:bg-[#005bb5] text-white font-bold text-xs rounded-xs shadow-sm active:scale-95 transition cursor-pointer"
            >
              {c.saving ? 'Guardando…' : formMode === 'create' ? 'Crear (Ctrl+A)' : formMode === 'search' ? 'Buscar (Ctrl+F)' : 'Actualizar'}
            </button>
            <button
              type="button"
              onClick={resetFormToCreate}
              disabled={c.saving}
              className="px-4 py-1.5 bg-[#f0f2f5] hover:bg-white border border-[#9fb4c7] text-[#1d2d3e] font-semibold text-xs rounded-xs shadow-2xs active:scale-95 transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
          <span className="text-[10px] text-gray-500">
            Total en catálogo: <strong>{items.length}</strong> artículos registrados
          </span>
        </div>
      </form>
    </div>
  );
}
