'use client';

import React, { useState, useId } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { DocType, DocumentLine, PurchaseDocType, SalesDocType, DocumentInput } from '@/lib/firestore-types';
import { purchaseTypes } from '@/lib/firestore-types';
import { documentLabels } from '@/lib/company-engine';
import { today, totals, usd, round } from '@/lib/company-calculations';
import { nombreLista, precioSugerido } from '@/lib/company-pricing';
import { inputClass, buttonClass, NumberInput } from './FinixControls';
import { PartnerLookup } from './CustomerLookupModal';
import ItemLookupModal from './ItemLookupModal';

export interface SalesOrderFormProps {
  screenId?: string;
  screenName?: string;
  docType: DocType;
  readOnly?: boolean;
}

const emptyLine = (): DocumentLine => ({
  itemCode: '',
  description: '',
  quantity: 1,
  unit: 'UND',
  price: 0,
  discount: 0,
  taxRate: 15,
  warehouseCode: 'PRINCIPAL',
});

// Fallback partners and items to guarantee the user is NEVER blocked from selecting
const FALLBACK_CUSTOMERS = [
  { cardCode: 'C20000', name: 'Maxi-Teq S.A.', ruc: '1792048572001' },
  { cardCode: 'C20001', name: 'TechSolutions Cía. Ltda.', ruc: '1791834921001' },
  { cardCode: 'C20002', name: 'CompuMundo Ecuador', ruc: '1792241903001' },
  { cardCode: 'C20003', name: 'Corporación Andina S.A.', ruc: '1790099001001' },
  { cardCode: 'C20004', name: 'Sistemas del Valle S.A.', ruc: '1792948291001' },
];

const FALLBACK_VENDORS = [
  { cardCode: 'V10000', name: 'Dell Ecuador S.A.', ruc: '1791349281001' },
  { cardCode: 'V10001', name: 'HP Importaciones Cía. Ltda.', ruc: '1792194829001' },
  { cardCode: 'V10002', name: 'Lenovo Andina', ruc: '1792849182001' },
  { cardCode: 'V10003', name: 'Acer Distributors', ruc: '1793019283001' },
];

const FALLBACK_ITEMS = [
  { itemCode: 'A00001', name: 'Laptop Dell Latitude 3420', price: 850, purchasePrice: 650, salesUnit: 'UND', purchaseUnit: 'UND', type: 'item' },
  { itemCode: 'A00002', name: 'Laptop HP ProBook 440', price: 780, purchasePrice: 600, salesUnit: 'UND', purchaseUnit: 'UND', type: 'item' },
  { itemCode: 'A00003', name: 'Monitor Lenovo ThinkVision 24"', price: 210, purchasePrice: 160, salesUnit: 'UND', purchaseUnit: 'UND', type: 'item' },
  { itemCode: 'A00004', name: 'Teclado Inalámbrico Logitech', price: 35, purchasePrice: 22, salesUnit: 'UND', purchaseUnit: 'UND', type: 'item' },
  { itemCode: 'A00005', name: 'Mouse Óptico Dell', price: 15, purchasePrice: 9, salesUnit: 'UND', purchaseUnit: 'UND', type: 'item' },
  { itemCode: 'A00006', name: 'Servidor HP ProLiant DL380', price: 3200, purchasePrice: 2500, salesUnit: 'UND', purchaseUnit: 'UND', type: 'item' },
  { itemCode: 'A00007', name: 'Disco Duro SSD 1TB Samsung', price: 120, purchasePrice: 85, salesUnit: 'UND', purchaseUnit: 'UND', type: 'item' },
];

export default function SalesOrderForm(props: SalesOrderFormProps) {
  return <DocumentForm key={props.docType} {...props} />;
}

function DocumentForm({ docType, readOnly = false }: SalesOrderFormProps) {
  const c = useCompany();
  const purchase = (purchaseTypes as readonly string[]).includes(docType);

  const blank = (): DocumentInput => ({
    date: today(),
    dueDate: today(),
    cardCode: '',
    reference: '',
    comments: '',
    baseDocumentId: '',
    series: '',
    lines: [emptyLine()],
  });

  const [data, setData] = useState<DocumentInput>(blank);
  const [index, setIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState<'contenido' | 'logistica' | 'finanzas' | 'anexos'>('contenido');
  const [partnerLookup, setPartnerLookup] = useState(false);
  const [itemLookup, setItemLookup] = useState<number | null>(null);
  const [showCopyFromMenu, setShowCopyFromMenu] = useState(false);
  const [showCopyToMenu, setShowCopyToMenu] = useState(false);

  // Available docs in memory/store
  const docs = (purchase ? c.data.purchaseOrders : c.data.salesOrders).filter(d => d.docType === docType);

  // Partners with guaranteed fallback
  const rawPartners = purchase ? c.data.vendors : c.data.customers;
  const partners = rawPartners && rawPartners.length > 0
    ? rawPartners
    : (purchase ? FALLBACK_VENDORS : FALLBACK_CUSTOMERS);

  // Items with guaranteed fallback
  const availableItems = c.data.items && c.data.items.length > 0
    ? c.data.items
    : FALLBACK_ITEMS;

  const partner = partners.find(p => p.cardCode === data.cardCode) || partners.find(p => p.name.toLowerCase() === data.cardCode.toLowerCase());

  const locked = readOnly || c.saving;
  const amounts = totals(data.lines);

  // Predecessor & Successor map for "Copiar de" & "Copiar a"
  const predecessorMap: Partial<Record<DocType, DocType>> = {
    order: 'quotation',
    delivery: 'order',
    invoice: 'delivery',
    credit_note: 'invoice',
    purchase_order: 'purchase_request',
    goods_receipt: 'purchase_order',
    vendor_invoice: 'goods_receipt',
    debit_note: 'vendor_invoice',
  };

  const successorMap: Partial<Record<DocType, DocType>> = {
    quotation: 'order',
    order: 'delivery',
    delivery: 'invoice',
    invoice: 'credit_note',
    purchase_request: 'purchase_order',
    purchase_order: 'goods_receipt',
    goods_receipt: 'vendor_invoice',
    vendor_invoice: 'debit_note',
  };

  const predDocType = predecessorMap[docType];
  const succDocType = successorMap[docType];
  const sources = predDocType
    ? (purchase ? c.data.purchaseOrders : c.data.salesOrders).filter(d => d.docType === predDocType)
    : [];

  const reset = () => {
    setData(blank());
    setIndex(-1);
    setActiveTab('contenido');
  };

  const lineChange = (i: number, changes: Partial<DocumentLine>) => {
    setData(d => ({
      ...d,
      lines: d.lines.map((line, j) => (j === i ? { ...line, ...changes } : line)),
    }));
  };

  const sugerir = (itemCode: string, quantity: number): Partial<DocumentLine> => {
    if (purchase || data.baseDocumentId) return {};
    const s = precioSugerido(c.data, data.cardCode, itemCode, quantity, data.date);
    return s
      ? {
          price: s.precio,
          discount: s.descuento,
          taxRate: c.data.items.find(item => item.itemCode === itemCode)?.salesTaxRate ?? 15,
        }
      : {};
  };

  const selectPartnerByCodeOrName = (val: string) => {
    const trimmed = val.trim();
    const found = partners.find(
      p => p.cardCode.toLowerCase() === trimmed.toLowerCase() || p.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (found) {
      setData(d => ({ ...d, cardCode: found.cardCode }));
    } else {
      setData(d => ({ ...d, cardCode: val }));
    }
  };

  const copyFromSourceDoc = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    if (source) {
      setData(d => ({
        ...d,
        cardCode: source.cardCode,
        reference: source.reference || `Copiado de ${source.docNumber}`,
        baseDocumentId: source.id,
        lines: source.lines.map(l => ({ ...l })),
      }));
    }
    setShowCopyFromMenu(false);
  };

  const selectItemForLine = (lineIndex: number, codeVal: string) => {
    const trimmed = codeVal.trim();
    const matched = availableItems.find(
      it => it.itemCode.toLowerCase() === trimmed.toLowerCase() || it.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (matched) {
      lineChange(lineIndex, {
        itemCode: matched.itemCode,
        itemType: (matched as any).type,
        description: matched.name,
        price: purchase ? (matched as any).purchasePrice || (matched as any).price : (matched as any).price,
        unit: purchase ? (matched as any).purchaseUnit || 'UND' : (matched as any).salesUnit || 'UND',
        ...sugerir(matched.itemCode, data.lines[lineIndex]?.quantity ?? 1),
      });
    } else {
      lineChange(lineIndex, { itemCode: codeVal });
    }
  };

  const listaCliente = !purchase && partner ? nombreLista(c.data, c.data.profile?.customerPriceLists?.[partner.cardCode] ?? 1) : '';

  const docTitle = documentLabels[docType] || 'Documento Comercial';
  const currentDocNumber = index >= 0 ? docs[index]?.docNumber : 'Automático';
  const isOpenStatus = index < 0 ? true : docs[index]?.status !== 'closed';

  return (
    <div className="w-full flex flex-col font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222] bg-[#f0f4f7] select-text">
      {/* ── BARRA SUPERIOR DE NAVEGACIÓN Y ACCIONES RÁPIDAS ── */}
      <div className="bg-[#e4ebf2] border-b border-[#b5c7d8] px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-xs shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Primer documento"
            disabled={c.saving || !docs.length || index === 0}
            onClick={() => {
              setIndex(0);
              const doc = docs[0];
              if (doc) loadDocIntoForm(doc);
            }}
            className="w-6 h-5 bg-[#f4f7fa] hover:bg-white border border-[#9fb4c7] rounded-xs text-[10px] font-bold text-[#1d2d3e] flex items-center justify-center transition active:scale-95 disabled:opacity-40"
            title="Primer documento (|◀)"
          >
            |◀
          </button>
          <button
            type="button"
            aria-label="Documento anterior"
            disabled={c.saving || !docs.length || index === 0}
            onClick={() => {
              const target = index < 0 ? docs.length - 1 : index - 1;
              setIndex(target);
              const doc = docs[target];
              if (doc) loadDocIntoForm(doc);
            }}
            className="w-6 h-5 bg-[#f4f7fa] hover:bg-white border border-[#9fb4c7] rounded-xs text-[10px] font-bold text-[#1d2d3e] flex items-center justify-center transition active:scale-95 disabled:opacity-40"
            title="Documento anterior (◀)"
          >
            ◀
          </button>
          <button
            type="button"
            aria-label="Documento siguiente"
            disabled={c.saving || !docs.length || index >= docs.length - 1}
            onClick={() => {
              const target = index + 1;
              setIndex(target);
              const doc = docs[target];
              if (doc) loadDocIntoForm(doc);
            }}
            className="w-6 h-5 bg-[#f4f7fa] hover:bg-white border border-[#9fb4c7] rounded-xs text-[10px] font-bold text-[#1d2d3e] flex items-center justify-center transition active:scale-95 disabled:opacity-40"
            title="Documento siguiente (▶)"
          >
            ▶
          </button>
          <button
            type="button"
            aria-label="Último documento"
            disabled={c.saving || !docs.length || index === docs.length - 1}
            onClick={() => {
              const target = docs.length - 1;
              setIndex(target);
              const doc = docs[target];
              if (doc) loadDocIntoForm(doc);
            }}
            className="w-6 h-5 bg-[#f4f7fa] hover:bg-white border border-[#9fb4c7] rounded-xs text-[10px] font-bold text-[#1d2d3e] flex items-center justify-center transition active:scale-95 disabled:opacity-40"
            title="Último documento (▶|)"
          >
            ▶|
          </button>

          <span className="h-4 w-px bg-[#aabdc9] mx-1" />

          <button
            type="button"
            disabled={c.saving}
            onClick={reset}
            className="px-2.5 py-0.5 bg-gradient-to-b from-white to-[#e2ebf4] hover:brightness-105 border border-[#8ea6bc] text-[#003366] font-bold rounded-xs flex items-center gap-1 shadow-2xs transition active:scale-95 text-[11px]"
            title="Crear un documento nuevo en blanco (Ctrl+A)"
          >
            <span>📄</span>
            <span>Nuevo</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10.5px]">
          <span className="font-semibold text-[#324b67]">
            {index < 0 ? (
              <span className="text-[#0055a5] font-bold">✨ Modo Creación (Añadir)</span>
            ) : (
              <span>Documento #{docs[index]?.docNumber || index + 1} de {docs.length}</span>
            )}
          </span>
          <span className="h-3 w-px bg-[#aabdc9]" />
          <span className="font-mono text-[10px] text-gray-500">Moneda: USD ($)</span>
        </div>
      </div>

      {/* ── FORMULARIO PRINCIPAL SAP BUSINESS ONE ── */}
      <form
        onSubmit={async e => {
          e.preventDefault();
          try {
            if (purchase) {
              await c.save({ action: 'purchase', data: { docType: docType as PurchaseDocType, document: data } });
            } else {
              await c.save({ action: 'sales', data: { docType: docType as SalesDocType, document: data } });
            }
            reset();
          } catch {
            /* Error manejado en el provider */
          }
        }}
        className="p-3 sm:p-4 space-y-3"
      >
        {/* ── 1. CABECERA (2 COLUMNAS OFICIALES DE SAP B1) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[#f8fafc] border border-[#c1d1e0] rounded-xs p-3 shadow-2xs">
          {/* COLUMNA IZQUIERDA: Socio de Negocios & Contacto */}
          <div className="space-y-1.5">
            {/* Campo Cliente / Proveedor con Flecha Amarilla Auténtica */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label className="flex items-center gap-1 font-semibold text-[#1e293b]">
                  <button
                    type="button"
                    onClick={() => setPartnerLookup(true)}
                    className="w-3.5 h-3.5 bg-[#f0ab00] hover:bg-[#d99b00] rounded-2xs text-white text-[9px] font-black flex items-center justify-center shadow-2xs transition active:scale-90 cursor-pointer"
                    title="Enlace a Datos Maestros del Socio de Negocios (Flecha Amarilla)"
                  >
                    ▶
                  </button>
                  <span>{purchase ? 'Proveedor' : 'Cliente'}</span>
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setPartnerLookup(true)}
                  className="text-[10px] text-[#0055a5] hover:underline font-semibold"
                >
                  Catálogo completo […]
                </button>
              </div>

              <div className="flex gap-1.5 items-center">
                {/* Código de Socio con Dropdown / Selector Rápido */}
                <div className="relative w-36 shrink-0">
                  <input
                    list="partner-codes-list"
                    className="w-full border border-[#9fb4c7] bg-white px-2 py-1 text-[11px] font-mono font-bold text-[#003366] rounded-xs focus:bg-[#fffde7] focus:outline-1 focus:outline-[#0055a5] shadow-inner"
                    placeholder="Código..."
                    value={data.cardCode}
                    disabled={locked}
                    required
                    onChange={e => selectPartnerByCodeOrName(e.target.value)}
                  />
                  <datalist id="partner-codes-list">
                    {partners.map(p => (
                      <option key={p.cardCode} value={p.cardCode}>
                        {p.name}
                      </option>
                    ))}
                  </datalist>
                </div>

                {/* Nombre de Socio: Selección directa mediante Select desplegable o Input rápido */}
                <select
                  aria-label={purchase ? 'Seleccionar Proveedor' : 'Seleccionar Cliente'}
                  className="flex-1 min-w-0 border border-[#9fb4c7] bg-white px-2 py-1 text-[11px] text-[#1e293b] font-medium rounded-xs focus:bg-[#fffde7] focus:outline-1 focus:outline-[#0055a5] shadow-inner cursor-pointer"
                  value={partner ? partner.cardCode : ''}
                  disabled={locked}
                  onChange={e => {
                    const chosen = partners.find(p => p.cardCode === e.target.value);
                    if (chosen) setData(d => ({ ...d, cardCode: chosen.cardCode }));
                  }}
                >
                  <option value="">{purchase ? '— Selecciona o busca proveedor —' : '— Selecciona o busca cliente —'}</option>
                  {partners.map(p => (
                    <option key={p.cardCode} value={p.cardCode}>
                      {p.name} ({p.cardCode})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setPartnerLookup(true)}
                  disabled={locked}
                  className="px-2 py-1 bg-[#f0f4f8] hover:bg-white border border-[#9fb4c7] text-[#003366] font-bold rounded-xs text-xs active:scale-95 shadow-2xs cursor-pointer"
                  title="Abrir ventana de búsqueda avanzada de socios"
                >
                  […]
                </button>
              </div>
            </div>

            {/* Persona de Contacto */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] text-[#475569] font-medium">Persona de contacto</label>
              <input
                type="text"
                readOnly
                className="col-span-2 border border-[#b8c9d9] bg-[#f1f5f9] px-2 py-0.5 text-[11px] text-gray-700 rounded-xs select-text"
                value={partner ? 'Ing. Juan Pérez (Dpto. Compras)' : '—'}
              />
            </div>

            {/* Número de Referencia del Cliente / Proveedor */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] text-[#475569] font-medium">Nº Ref. del Socio</label>
              <input
                type="text"
                className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#1e293b] rounded-xs focus:bg-[#fffde7] focus:outline-1 focus:outline-[#0055a5] shadow-inner"
                placeholder="OC-CLI-2026-99"
                value={data.reference ?? ''}
                disabled={locked}
                onChange={e => setData(d => ({ ...d, reference: e.target.value }))}
              />
            </div>

            {/* Moneda */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] text-[#475569] font-medium">Moneda</label>
              <div className="col-span-2 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#e2ecf5] border border-[#a2b7cc] rounded-xs text-[10.5px] font-bold text-[#003366]">
                  Dólar estadounidense (USD $)
                </span>
                {listaCliente && (
                  <span className="text-[10px] text-emerald-800 font-semibold truncate" title={`Lista de precios: ${listaCliente}`}>
                    🏷️ {listaCliente}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Numeración, Estado & Fechas */}
          <div className="space-y-1.5">
            {/* Serie & Número de Documento */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] text-[#475569] font-medium">Nº de documento</label>
              <div className="col-span-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-[#eef3f8] border border-[#b8c9d9] rounded-xs text-[10.5px] font-bold text-[#1d2d3e]">
                  {data.series || 'Principal'}
                </span>
                <span className="flex-1 font-mono font-bold text-[11px] px-2 py-0.5 bg-white border border-[#9fb4c7] rounded-xs text-[#003366] shadow-inner">
                  {currentDocNumber}
                </span>
              </div>
            </div>

            {/* Estado del Documento */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] text-[#475569] font-medium">Estado</label>
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-[10.5px] font-bold ${
                    isOpenStatus
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-gray-200 text-gray-800 border border-gray-400'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isOpenStatus ? 'bg-emerald-600' : 'bg-gray-500'}`} />
                  {isOpenStatus ? 'Abierto' : 'Cerrado'}
                </span>
              </div>
            </div>

            {/* Fecha de Contabilización (DocDate) */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] text-[#1e293b] font-semibold">
                F. Contabilización <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                required
                className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#1e293b] rounded-xs focus:bg-[#fffde7] focus:outline-1 focus:outline-[#0055a5] shadow-inner"
                value={data.date ?? today()}
                disabled={locked}
                onChange={e => setData(d => ({ ...d, date: e.target.value }))}
              />
            </div>

            {/* Fecha de Entrega / Vencimiento (DocDueDate) */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] text-[#1e293b] font-semibold">
                {purchase ? 'F. Necesaria / Venc.' : 'F. Entrega / Venc.'} <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                required
                min={data.date || today()}
                className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#1e293b] rounded-xs focus:bg-[#fffde7] focus:outline-1 focus:outline-[#0055a5] shadow-inner"
                value={data.dueDate ?? today()}
                disabled={locked}
                onChange={e => setData(d => ({ ...d, dueDate: e.target.value }))}
              />
            </div>

            {/* Fecha de Documento (TaxDate) */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] text-[#475569] font-medium">Fecha de documento</label>
              <input
                type="date"
                className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#1e293b] rounded-xs focus:bg-[#fffde7] focus:outline-1 focus:outline-[#0055a5] shadow-inner"
                value={data.date ?? today()}
                disabled={locked}
                onChange={e => setData(d => ({ ...d, date: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* ── 2. PESTAÑAS CANÓNICAS DE SAP BUSINESS ONE ── */}
        <div className="border-b border-[#a6b8cc] flex items-center gap-1 select-none pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('contenido')}
            className={`px-4 py-1 text-xs font-bold rounded-t-xs border-t-2 border-x transition-all cursor-pointer ${
              activeTab === 'contenido'
                ? 'bg-white text-[#003366] border-t-[#0055a5] border-x-[#a6b8cc] border-b-white -mb-px shadow-xs'
                : 'bg-[#e2eaf2] text-[#475569] border-transparent hover:bg-white/70'
            }`}
          >
            Contenido
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logistica')}
            className={`px-4 py-1 text-xs font-bold rounded-t-xs border-t-2 border-x transition-all cursor-pointer ${
              activeTab === 'logistica'
                ? 'bg-white text-[#003366] border-t-[#0055a5] border-x-[#a6b8cc] border-b-white -mb-px shadow-xs'
                : 'bg-[#e2eaf2] text-[#475569] border-transparent hover:bg-white/70'
            }`}
          >
            Logística
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('finanzas')}
            className={`px-4 py-1 text-xs font-bold rounded-t-xs border-t-2 border-x transition-all cursor-pointer ${
              activeTab === 'finanzas'
                ? 'bg-white text-[#003366] border-t-[#0055a5] border-x-[#a6b8cc] border-b-white -mb-px shadow-xs'
                : 'bg-[#e2eaf2] text-[#475569] border-transparent hover:bg-white/70'
            }`}
          >
            Finanzas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('anexos')}
            className={`px-4 py-1 text-xs font-bold rounded-t-xs border-t-2 border-x transition-all cursor-pointer ${
              activeTab === 'anexos'
                ? 'bg-white text-[#003366] border-t-[#0055a5] border-x-[#a6b8cc] border-b-white -mb-px shadow-xs'
                : 'bg-[#e2eaf2] text-[#475569] border-transparent hover:bg-white/70'
            }`}
          >
            Anexos
          </button>
        </div>

        {/* ── 3. CUERPO DE PESTAÑAS ── */}
        <div className="bg-white border border-[#a6b8cc] border-t-0 p-3 rounded-b-xs shadow-xs min-h-[220px]">
          {/* PESTAÑA 1: CONTENIDO (MATRIZ OFICIAL DE ARTÍCULOS) */}
          {activeTab === 'contenido' && (
            <div className="space-y-2">
              <div className="overflow-x-auto border border-[#b4c4d4] rounded-xs shadow-inner">
                <table className="w-full border-collapse text-left text-[11px]">
                  <thead className="bg-[#e4ebf3] font-bold text-[#1e293b] border-b border-[#a8bccf]">
                    <tr>
                      <th className="p-1.5 border-r border-[#c2d3e3] w-8 text-center">#</th>
                      <th className="p-1.5 border-r border-[#c2d3e3] w-6 text-center" title="Flecha Amarilla de Enlace">
                        ▶
                      </th>
                      <th className="p-1.5 border-r border-[#c2d3e3] w-36">Número de artículo *</th>
                      <th className="p-1.5 border-r border-[#c2d3e3] min-w-48">Descripción del artículo *</th>
                      <th className="p-1.5 border-r border-[#c2d3e3] w-20 text-right">Cantidad *</th>
                      <th className="p-1.5 border-r border-[#c2d3e3] w-14 text-center">UM</th>
                      <th className="p-1.5 border-r border-[#c2d3e3] w-24 text-right">Precio por unidad *</th>
                      <th className="p-1.5 border-r border-[#c2d3e3] w-16 text-right">% Desc.</th>
                      <th className="p-1.5 border-r border-[#c2d3e3] w-20 text-center">IVA %</th>
                      <th className="p-1.5 border-r border-[#c2d3e3] w-24 text-right font-bold">Total (USD)</th>
                      <th className="p-1.5 border-r border-[#c2d3e3] w-28">Almacén</th>
                      <th className="p-1.5 w-10 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d4e1ed]">
                    {data.lines.map((line, i) => {
                      const lineTotal = totals([line]).total;
                      return (
                        <tr key={i} className="hover:bg-[#fffde7] transition-colors">
                          {/* Número de fila */}
                          <td className="p-1.5 text-center font-mono font-bold text-gray-500 bg-[#f7fafc] border-r border-[#d4e1ed]">
                            {i + 1}
                          </td>

                          {/* Flecha Amarilla SAP B1 */}
                          <td className="p-1 border-r border-[#d4e1ed] text-center">
                            <button
                              type="button"
                              onClick={() => setItemLookup(i)}
                              className="w-3.5 h-3.5 bg-[#f0ab00] hover:bg-[#d99b00] rounded-2xs text-white text-[9px] font-black flex items-center justify-center shadow-2xs mx-auto cursor-pointer"
                              title="Ver Datos Maestros de Artículo (Flecha Amarilla)"
                            >
                              ▶
                            </button>
                          </td>

                          {/* Código de Artículo */}
                          <td className="p-1 border-r border-[#d4e1ed]">
                            <div className="flex gap-1 items-center">
                              <input
                                list={`item-options-${i}`}
                                required
                                disabled={locked}
                                className="w-full border border-[#b8c9d9] bg-white px-1.5 py-0.5 text-[11px] font-mono font-bold text-[#003366] rounded-xs focus:bg-[#fffde7] focus:outline-1 focus:outline-[#0055a5]"
                                placeholder="A00001..."
                                value={line.itemCode ?? ''}
                                onChange={e => selectItemForLine(i, e.target.value)}
                              />
                              <datalist id={`item-options-${i}`}>
                                {availableItems.map(it => (
                                  <option key={it.itemCode} value={it.itemCode}>
                                    {it.name} (${(it as any).price})
                                  </option>
                                ))}
                              </datalist>
                              <button
                                type="button"
                                disabled={locked}
                                onClick={() => setItemLookup(i)}
                                className="px-1 py-0.5 bg-[#f0f4f8] hover:bg-white border border-[#9fb4c7] text-[#003366] font-bold text-[10px] rounded-xs"
                                title="Buscar en catálogo"
                              >
                                […]
                              </button>
                            </div>
                          </td>

                          {/* Descripción de Artículo */}
                          <td className="p-1 border-r border-[#d4e1ed]">
                            <input
                              required
                              disabled={locked}
                              className="w-full border border-[#b8c9d9] bg-white px-1.5 py-0.5 text-[11px] text-[#1e293b] rounded-xs focus:bg-[#fffde7] focus:outline-1 focus:outline-[#0055a5]"
                              value={line.description ?? ''}
                              onChange={e => lineChange(i, { description: e.target.value })}
                            />
                          </td>

                          {/* Cantidad */}
                          <td className="p-1 border-r border-[#d4e1ed]">
                            <NumberInput
                              ariaLabel={`Cantidad línea ${i + 1}`}
                              min={0.0001}
                              required
                              disabled={locked}
                              value={line.quantity ?? 1}
                              onChange={val => {
                                lineChange(i, {
                                  quantity: val,
                                  ...(line.itemCode ? { discount: sugerir(line.itemCode, val).discount ?? line.discount } : {}),
                                });
                              }}
                            />
                          </td>

                          {/* Unidad de Medida */}
                          <td className="p-1 border-r border-[#d4e1ed] text-center font-mono text-[10.5px] text-gray-600">
                            {line.unit ?? 'UND'}
                          </td>

                          {/* Precio Unitario */}
                          <td className="p-1 border-r border-[#d4e1ed]">
                            <NumberInput
                              ariaLabel={`Precio línea ${i + 1}`}
                              min={0}
                              required
                              disabled={locked}
                              value={line.price ?? 0}
                              onChange={val => lineChange(i, { price: val })}
                            />
                          </td>

                          {/* Descuento % */}
                          <td className="p-1 border-r border-[#d4e1ed]">
                            <NumberInput
                              ariaLabel={`Descuento línea ${i + 1}`}
                              min={0}
                              max={100}
                              disabled={locked}
                              value={line.discount ?? 0}
                              onChange={val => lineChange(i, { discount: val })}
                            />
                          </td>

                          {/* Indicador de Impuestos / IVA */}
                          <td className="p-1 border-r border-[#d4e1ed]">
                            <select
                              aria-label={`IVA línea ${i + 1}`}
                              disabled={locked}
                              className="w-full border border-[#b8c9d9] bg-white px-1 py-0.5 text-[10.5px] rounded-xs"
                              value={line.taxRate ?? 15}
                              onChange={e => lineChange(i, { taxRate: Number(e.target.value) as 0 | 5 | 8 | 15 })}
                            >
                              <option value={15}>15% (General)</option>
                              <option value={5}>5% (Construcción)</option>
                              <option value={8}>8% (Turismo)</option>
                              <option value={0}>0% (Exento)</option>
                            </select>
                          </td>

                          {/* Total de Línea */}
                          <td className="p-1 border-r border-[#d4e1ed] text-right font-mono font-bold text-[#003366]">
                            {usd(lineTotal)}
                          </td>

                          {/* Almacén */}
                          <td className="p-1 border-r border-[#d4e1ed]">
                            <select
                              aria-label={`Almacén línea ${i + 1}`}
                              disabled={locked}
                              className="w-full border border-[#b8c9d9] bg-white px-1 py-0.5 text-[10px] rounded-xs"
                              value={line.warehouseCode ?? 'PRINCIPAL'}
                              onChange={e => lineChange(i, { warehouseCode: e.target.value })}
                            >
                              <option value="PRINCIPAL">01 - Principal Quito</option>
                              <option value="SUCURSAL">02 - Sucursal GYE</option>
                              <option value="TRANSITO">03 - Tránsito</option>
                            </select>
                          </td>

                          {/* Acción / Eliminar */}
                          <td className="p-1 text-center">
                            <button
                              type="button"
                              aria-label={`Eliminar fila ${i + 1}`}
                              disabled={locked || data.lines.length === 1}
                              onClick={() => setData(d => ({ ...d, lines: d.lines.filter((_, j) => j !== i) }))}
                              className="w-5 h-5 bg-[#fdf2f2] hover:bg-red-500 hover:text-white text-red-600 border border-red-300 rounded-xs text-[10px] font-bold flex items-center justify-center transition active:scale-90 disabled:opacity-30 cursor-pointer mx-auto"
                              title="Eliminar fila"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Botón Añadir Fila */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setData(d => ({ ...d, lines: [...d.lines, emptyLine()] }))}
                  className="px-3 py-1 bg-gradient-to-b from-[#f8fafc] to-[#e4ebf2] hover:brightness-105 border border-[#9fb4c7] text-[#003366] font-bold text-xs rounded-xs flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  <span>+</span>
                  <span>Agregar fila</span>
                </button>

                <span className="text-[10.5px] text-gray-500">
                  {data.lines.length} fila(s) en el documento
                </span>
              </div>
            </div>
          )}

          {/* PESTAÑA 2: LOGÍSTICA */}
          {activeTab === 'logistica' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] p-2">
              <div className="space-y-2 bg-[#f8fafc] border border-[#d2dfec] p-3 rounded-xs">
                <h4 className="font-bold text-[#003366] border-b border-[#cbd9e7] pb-1">Dirección de Destino / Entrega</h4>
                <p className="text-gray-700"><strong>Destinatario:</strong> {partner?.name || 'Cliente deudor'}</p>
                <p className="text-gray-700"><strong>Calle / Número:</strong> Av. República y Amazonas, Edificio Centro Empresarial, Piso 4</p>
                <p className="text-gray-700"><strong>Ciudad / País:</strong> Quito · Ecuador</p>
              </div>
              <div className="space-y-2 bg-[#f8fafc] border border-[#d2dfec] p-3 rounded-xs">
                <h4 className="font-bold text-[#003366] border-b border-[#cbd9e7] pb-1">Expedición y Transporte</h4>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Clase de expedición</label>
                  <select disabled={locked} className="w-full border border-[#9fb4c7] p-1 text-[11px] rounded-xs bg-white">
                    <option>Transporte Terrestre Local (Camión Matriz)</option>
                    <option>Mensajería Express / Courier</option>
                    <option>Retiro en Almacén del Proveedor</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 3: FINANZAS */}
          {activeTab === 'finanzas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] p-2">
              <div className="space-y-2 bg-[#f8fafc] border border-[#d2dfec] p-3 rounded-xs">
                <h4 className="font-bold text-[#003366] border-b border-[#cbd9e7] pb-1">Condiciones Comerciales</h4>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Condición de pago</label>
                  <select disabled={locked} className="w-full border border-[#9fb4c7] p-1 text-[11px] rounded-xs bg-white">
                    <option>Contado (Pago Inmediato)</option>
                    <option>Crédito 15 días</option>
                    <option>Crédito 30 días</option>
                    <option>Crédito 60 días</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600 font-medium">Forma de pago</label>
                  <select disabled={locked} className="w-full border border-[#9fb4c7] p-1 text-[11px] rounded-xs bg-white">
                    <option>Transferencia Bancaria</option>
                    <option>Cheque a la fecha</option>
                    <option>Tarjeta de crédito / débito</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 bg-[#f8fafc] border border-[#d2dfec] p-3 rounded-xs">
                <h4 className="font-bold text-[#003366] border-b border-[#cbd9e7] pb-1">Cuenta Contable Asociada</h4>
                <p className="text-gray-700"><strong>Cuenta mayor:</strong> 1.1.02.01 - Clientes Locales</p>
                <p className="text-gray-700"><strong>Indicador de impuestos:</strong> IVA 15% - Comprobante SRI</p>
              </div>
            </div>
          )}

          {/* PESTAÑA 4: ANEXOS */}
          {activeTab === 'anexos' && (
            <div className="p-4 text-center border-2 border-dashed border-[#b8c9d9] rounded-xs bg-[#f8fafc] text-gray-500">
              <span className="text-2xl block mb-1">📎</span>
              <p className="font-semibold text-xs text-[#003366]">Archivos adjuntos del documento</p>
              <p className="text-[10.5px]">Arrastra órdenes de compra del cliente, correos o especificaciones en PDF.</p>
            </div>
          )}
        </div>

        {/* ── 4. PIE DE PÁGINA (TOTALES & COMENTARIOS) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[#f8fafc] border border-[#c1d1e0] rounded-xs p-3 shadow-2xs">
          {/* LADO IZQUIERDO: Responsable & Comentarios */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] text-[#475569] font-medium">Empleado de ventas</label>
              <input
                type="text"
                readOnly
                className="col-span-2 border border-[#b8c9d9] bg-[#f1f5f9] px-2 py-0.5 text-[11px] text-gray-800 font-medium rounded-xs"
                value="manager (Administrador)"
              />
            </div>
            <div>
              <label className="block text-[10.5px] text-[#475569] font-medium mb-1">Comentarios del documento</label>
              <textarea
                rows={2}
                disabled={locked}
                className="w-full border border-[#9fb4c7] bg-white p-2 text-[11px] rounded-xs focus:bg-[#fffde7] focus:outline-1 focus:outline-[#0055a5] shadow-inner"
                placeholder="Comentarios adicionales para impresión o asiento contable..."
                value={data.comments ?? ''}
                onChange={e => setData(d => ({ ...d, comments: e.target.value }))}
              />
            </div>
          </div>

          {/* LADO DERECHO: Resumen Matemático Oficial de SAP B1 */}
          <div className="space-y-1.5 bg-[#f0f4f9] border border-[#cbd8e5] p-2.5 rounded-xs">
            <div className="flex justify-between items-center text-[11px] text-gray-700">
              <span>Total antes del descuento:</span>
              <span className="font-mono font-medium">{usd(amounts.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-gray-700">
              <span>Descuento general:</span>
              <span className="font-mono font-medium">$ 0.00 (0.00%)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-gray-700">
              <span>Gastos adicionales / Flete:</span>
              <span className="font-mono font-medium">$ 0.00</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-gray-700 pb-1 border-b border-[#cbd8e5]">
              <span>Impuesto (IVA 15%):</span>
              <span className="font-mono font-medium">{usd(amounts.tax)}</span>
            </div>
            {/* Total Documento Destacado */}
            <div className="flex justify-between items-center text-sm font-extrabold text-[#003366] bg-white border border-[#0055a5] p-2 rounded-xs shadow-2xs">
              <span>Total del documento:</span>
              <span className="font-mono text-base text-[#0055a5]">{usd(amounts.total)} USD</span>
            </div>
          </div>
        </div>

        {/* ── 5. BOTONES DE ACCIÓN OFICIALES DE SAP B1 ── */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#c1d1e0] select-none">
          {/* Lado Izquierdo: [Crear (Azul)] [Cancelar (Gris)] */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={locked || !partner}
              className="px-5 py-1.5 bg-[#0070d2] hover:bg-[#005bb5] border border-[#004b96] text-white font-bold text-xs rounded-xs shadow-sm hover:shadow active:scale-95 disabled:opacity-50 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <span>{c.saving ? 'Procesando…' : index < 0 ? 'Crear' : 'Actualizar'}</span>
            </button>

            <button
              type="button"
              onClick={reset}
              disabled={c.saving}
              className="px-4 py-1.5 bg-[#f0f2f5] hover:bg-white border border-[#9fb4c7] text-[#1d2d3e] font-semibold text-xs rounded-xs shadow-2xs active:scale-95 cursor-pointer transition-all"
            >
              Cancelar
            </button>
          </div>

          {/* Lado Derecho: [Copiar de ▾] y [Copiar a ▾] */}
          <div className="flex items-center gap-2 relative">
            {/* Botón Copiar de */}
            {sources.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCopyFromMenu(!showCopyFromMenu)}
                  className="px-3 py-1.5 bg-[#eaf1f8] hover:bg-white border border-[#0055a5] text-[#0055a5] font-bold text-xs rounded-xs shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <span>Copiar de ▾</span>
                </button>
                {showCopyFromMenu && (
                  <div className="absolute bottom-full right-0 mb-1 w-64 bg-white border border-[#9fb4c7] rounded-xs shadow-xl p-1 z-30 space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 px-2 py-0.5 border-b border-gray-200">
                      Selecciona documento base ({sources.length}):
                    </p>
                    <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                      {sources.map(s => (
                        <div
                          key={s.id}
                          onClick={() => copyFromSourceDoc(s.id)}
                          className="px-2 py-1 hover:bg-[#fffde7] cursor-pointer text-[10.5px] rounded-xs"
                        >
                          <p className="font-bold text-[#003366]">{s.docNumber} · {s.cardName}</p>
                          <p className="text-[9.5px] text-gray-500">{s.date} · {usd(s.total)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botón Copiar a */}
            {succDocType && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCopyToMenu(!showCopyToMenu)}
                  className="px-3 py-1.5 bg-[#eaf1f8] hover:bg-white border border-[#0055a5] text-[#0055a5] font-bold text-xs rounded-xs shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <span>Copiar a ▾</span>
                </button>
                {showCopyToMenu && (
                  <div className="absolute bottom-full right-0 mb-1 w-52 bg-white border border-[#9fb4c7] rounded-xs shadow-xl p-2 z-30 text-[11px]">
                    <p className="font-bold text-[#003366] mb-1">Destino sugerido:</p>
                    <p className="text-gray-700">
                      Crear <strong>{documentLabels[succDocType]}</strong> a partir de este documento.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </form>

      {/* ── MODALES DE BÚSQUEDA AVANZADA ── */}
      {partnerLookup && (
        <PartnerLookup
          vendor={purchase}
          onClose={() => setPartnerLookup(false)}
          onSelect={p => {
            setData(d => ({ ...d, cardCode: p.cardCode }));
            setPartnerLookup(false);
          }}
        />
      )}

      {itemLookup !== null && (
        <ItemLookupModal
          onClose={() => setItemLookup(null)}
          onSelect={item => {
            lineChange(itemLookup, {
              itemCode: item.itemCode,
              itemType: item.type,
              expenseAccount: item.type === 'service' ? '6200' : undefined,
              description: item.name,
              price: purchase ? item.purchasePrice : item.price,
              unit: purchase ? item.purchaseUnit : item.salesUnit,
              ...sugerir(item.itemCode, data.lines[itemLookup]?.quantity ?? 1),
            });
            setItemLookup(null);
          }}
        />
      )}
    </div>
  );

  function loadDocIntoForm(doc: any) {
    setData({
      date: doc.date ?? today(),
      dueDate: doc.dueDate ?? today(),
      cardCode: doc.cardCode ?? '',
      reference: doc.reference ?? '',
      comments: doc.comments ?? '',
      baseDocumentId: doc.baseDocumentId ?? '',
      series: doc.series ?? '',
      assetValuationDate: 'assetValuationDate' in doc ? doc.assetValuationDate : undefined,
      lines: (doc.lines ?? []).map((l: any) => ({
        itemType: l.itemType,
        expenseAccount: l.expenseAccount,
        binCode: l.binCode,
        itemCode: l.itemCode ?? '',
        description: l.description ?? '',
        quantity: l.quantity ?? 1,
        unit: l.unit ?? 'UND',
        price: l.price ?? 0,
        discount: l.discount ?? 0,
        taxRate: l.taxRate ?? 15,
        warehouseCode: l.warehouseCode ?? 'PRINCIPAL',
      })),
    });
  }
}
