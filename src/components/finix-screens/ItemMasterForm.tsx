'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { CommandData } from '@/lib/company-commands';
import {
  Package,
  Search,
  Plus,
  Save,
  Trash2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';
import ItemTabsDetail, { type ItemAttachment } from './ItemTabsDetail';

export interface ItemMasterFormProps {
  initialItemCode?: string;
}

export default function ItemMasterForm({ initialItemCode }: ItemMasterFormProps) {
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
  const [manageMethod, setManageMethod] = useState<'none' | 'lot' | 'serial'>('none');
  const [contractModel, setContractModel] = useState('');

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
  const [attachments, setAttachments] = useState<ItemAttachment[]>([]);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState<number | null>(null);

  // Grupos de artículos disponibles: se recuperan los grupos guardados en la empresa (Supabase),
  // los grupos requeridos en las prácticas de certificación (IMPRES, etc.) y los canónicos.
  const savedItemGroups = useMemo(() => {
    const raw = (c.data.profile as unknown as Record<string, unknown>)?.itemGroups;
    if (Array.isArray(raw)) {
      return raw as Array<{ codigo?: string; code?: string; nombre?: string; name?: string; descripcion?: string }>;
    }
    return [];
  }, [c.data.profile]);

  const availableGroups = useMemo(() => {
    const list: Array<{ code: string; label: string }> = [];
    const seen = new Set<string>();

    const add = (code?: string, label?: string) => {
      if (!code) return;
      const trimmed = code.trim();
      const norm = trimmed.toUpperCase();
      if (!trimmed || seen.has(norm)) return;
      seen.add(norm);
      list.push({
        code: trimmed,
        label: label && label.trim().toUpperCase() !== norm ? `${trimmed} · ${label.trim()}` : trimmed,
      });
    };

    // 1. Grupos guardados en la empresa del alumno (persistidos en Supabase)
    savedItemGroups.forEach((g) => {
      const cod = g.codigo || g.code;
      const nom = g.nombre || g.name || g.descripcion;
      add(cod, nom);
    });

    // 2. Grupos de artículos oficiales de laboratorio y certificación
    add('IMPRES', 'Impresoras');
    add('HARDWARE', 'Equipos y componentes');
    add('IMPRESORAS', 'Impresoras y multifuncionales');
    add('MEMORIAS', 'Memorias RAM y almacenamiento');
    add('SUMINISTROS', 'Suministros y consumibles');

    // 3. Grupos estándar clásicos de Finix / SAP B1
    add('General', 'General');
    add('Laptops', 'Laptops & Computadores');
    add('Perifericos', 'Periféricos & Accesorios');
    add('Servidores', 'Servidores & Redes');
    add('Suministros', 'Suministros & Repuestos');

    if (group) add(group);

    return list;
  }, [savedItemGroups, group]);

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
    setCurrentStock((it as unknown as { stock?: number }).stock ?? 50);
    setActive(it.active ?? true);
    setPlanningMethod(it.planningMethod || 'buy');
    setMrpActive(Boolean(it.mrpActive));
    setPurchaseLeadDays(it.purchaseLeadDays || 0);
    setManageMethod(it.manageMethod || 'none');
    setContractModel(it.contractModel || '');
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
    setManageMethod('none');
    setContractModel('');
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

  // Carga inicial o precarga por código de artículo
  useEffect(() => {
    if (initialItemCode) {
      const idx = items.findIndex((it) => it.itemCode?.toUpperCase() === initialItemCode.toUpperCase());
      if (idx >= 0) {
        loadItem(idx);
        return;
      }
      // Si el artículo solicitado aún no existe en el catálogo inicial (ej. A00002)
      setSelectedIndex(-1);
      setFormMode('edit');
      setItemCode(initialItemCode);
      if (initialItemCode === 'A00002') {
        setName('Laptop HP ProBook 440');
        setGroup('IMPRES');
        setBarcode('HP440001');
        setSalesTaxRate(15);
      }
      return;
    }
    if (selectedIndex === -1) {
      resetFormToCreate();
    }
  }, [initialItemCode, items.length]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleCodeBlur = () => {
    const trimmed = itemCode.trim().toUpperCase();
    if (!trimmed) return;
    const matchIdx = items.findIndex((it) => it.itemCode?.toUpperCase() === trimmed);
    if (matchIdx >= 0 && matchIdx !== selectedIndex) {
      loadItem(matchIdx);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === 'search') {
      const qCode = itemCode.trim().toLowerCase();
      const qName = name.trim().toLowerCase();
      const qBarcode = barcode.trim();
      const matched = items.find(
        (it) =>
          (qCode && it.itemCode.toLowerCase().includes(qCode)) ||
          (qName && it.name.toLowerCase().includes(qName)) ||
          (qBarcode && it.barcode && it.barcode.includes(qBarcode))
      );
      if (matched) {
        const idx = items.findIndex((it) => it.itemCode === matched.itemCode);
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
      manageMethod,
      perpetualInventory: true,
      contractModel,
      ice: 'none',
      weight: 0.5,
      length: 10,
      width: 10,
      height: 10,
    };

    try {
      const targetCode = itemCode.trim().toUpperCase();
      const existingIdx = items.findIndex((it) => it.itemCode?.toUpperCase() === targetCode);

      if (existingIdx >= 0) {
        const existing = items[existingIdx];
        await c.save({
          action: 'itemUpdate',
          data: { ...payload, itemCode: existing.itemCode || targetCode },
        });
        loadItem(existingIdx);
      } else if (formMode === 'create' || selectedIndex < 0) {
        await c.save({ action: 'item', data: payload });
        resetFormToCreate();
      } else {
        const existing = items[selectedIndex];
        await c.save({
          action: 'itemUpdate',
          data: { ...payload, itemCode: existing.itemCode || targetCode },
        });
      }
    } catch {
      /* Handled by c.save */
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f0f4f8] text-[#1e293b] font-[Tahoma,Arial,sans-serif] text-[11px] select-none p-2 sm:p-3 overflow-y-auto sap-b1-form">
      {/* ── BARRA DE TÍTULO Y NAVEGADOR ESTILO SAP B1 ── */}
      <div className="bg-[#e4ebf3] border border-[#a6b8cc] rounded-t-xs px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[#0055a5] text-sm font-bold">📦</span>
          <span className="font-bold text-[#003366] text-xs">
            Datos Maestros de Artículos (OITM)
          </span>
          <span className="px-1.5 py-0.2 bg-[#fffde7] border border-[#d49b00] text-[#7a5900] text-[10px] font-bold rounded-xs">
            {formMode === 'create' ? 'Modo Crear' : formMode === 'search' ? 'Modo Buscar' : 'Modo Modificar'}
          </span>
        </div>

        {/* Botones de navegación de registros */}
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
                  onBlur={handleCodeBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCodeBlur();
                    }
                  }}
                  className={`w-full border ${formMode === 'search' ? 'border-[#d49b00] bg-[#fffde7] ring-1 ring-[#f59e0b]/50' : 'border-[#9fb4c7] bg-[#fffde7]'} px-2 py-0.5 text-[11px] font-mono font-bold text-[#003366] rounded-xs focus:outline-none focus:ring-1 focus:ring-[#0070d2]`}
                  placeholder="Auto (A00001)"
                />
                <button
                  type="button"
                  onClick={() => setFormMode('search')}
                  className="p-1 bg-slate-100 hover:bg-slate-200 border border-[#9fb4c7] rounded-xs text-gray-600 cursor-pointer"
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
                className={`col-span-2 border ${formMode === 'search' ? 'border-[#d49b00] bg-[#fffde7]' : 'border-[#9fb4c7] bg-white'} px-2 py-0.5 text-[11px] text-[#1e293b] rounded-xs focus:bg-[#fffde7] focus:outline-none focus:ring-1 focus:ring-[#0070d2]`}
                placeholder="Descripción del ítem / producto"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] text-[#475569]">Nombre extranjero</label>
              <input
                type="text"
                value={foreignName}
                onChange={(e) => setForeignName(e.target.value)}
                className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#1e293b] rounded-xs"
                placeholder="Nombre comercial alternativo"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] font-bold text-[#003366]">Grupo de artículos</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#1e293b] rounded-xs font-medium"
              >
                {availableGroups.map((g) => (
                  <option key={g.code} value={g.code}>
                    {g.label}
                  </option>
                ))}
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
                className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#1e293b] rounded-xs"
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

        {/* ── PESTAÑAS DETALLE DE OITM MODULARIZADAS ── */}
        <ItemTabsDetail
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          barcode={barcode}
          setBarcode={setBarcode}
          inventoryUnit={inventoryUnit}
          setInventoryUnit={setInventoryUnit}
          manageMethod={manageMethod}
          setManageMethod={setManageMethod}
          contractModel={contractModel}
          setContractModel={setContractModel}
          active={active}
          setActive={setActive}
          vendors={c.data.vendors}
          preferredVendor={preferredVendor}
          setPreferredVendor={setPreferredVendor}
          purchaseUnit={purchaseUnit}
          setPurchaseUnit={setPurchaseUnit}
          purchasePrice={purchasePrice}
          setPurchasePrice={setPurchasePrice}
          salesUnit={salesUnit}
          setSalesUnit={setSalesUnit}
          price={price}
          setPrice={setPrice}
          price2={price2}
          setPrice2={setPrice2}
          maxDiscount={maxDiscount}
          setMaxDiscount={setMaxDiscount}
          salesTaxRate={salesTaxRate}
          setSalesTaxRate={setSalesTaxRate}
          currentStock={currentStock}
          committedStock={committedStock}
          orderedStock={orderedStock}
          costingMethod={costingMethod}
          setCostingMethod={setCostingMethod}
          minStock={minStock}
          setMinStock={setMinStock}
          planningMethod={planningMethod}
          setPlanningMethod={setPlanningMethod}
          purchaseLeadDays={purchaseLeadDays}
          setPurchaseLeadDays={setPurchaseLeadDays}
          mrpActive={mrpActive}
          setMrpActive={setMrpActive}
          attachments={attachments}
          setAttachments={setAttachments}
          selectedAttachmentIndex={selectedAttachmentIndex}
          setSelectedAttachmentIndex={setSelectedAttachmentIndex}
        />

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
