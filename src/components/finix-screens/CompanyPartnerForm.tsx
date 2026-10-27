'use client';

import React, { useState, useEffect } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { CommandData } from '@/lib/company-commands';
import { usd } from '@/lib/company-calculations';
import {
  Users,
  Search,
  Plus,
  Save,
  Trash2,
  FileText,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Scale,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
} from 'lucide-react';

interface CompanyPartnerFormProps {
  vendor?: boolean;
}

export default function CompanyPartnerForm({ vendor = false }: CompanyPartnerFormProps) {
  const c = useCompany();
  const privateCompany = c.data.profile?.usage === 'private';

  // Colección de interlocutores según tipo
  const rawList = vendor ? c.data.vendors : c.data.customers;
  const list = rawList || [];

  // Modo: 'create' (Ctrl+A), 'edit' (cuando se selecciona un registro), o 'search' (Ctrl+F)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'search'>('create');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<'general' | 'contactos' | 'direcciones' | 'condiciones' | 'finanzas' | 'anexos'>('general');

  // Estado del formulario
  const [cardCode, setCardCode] = useState('');
  const [partnerType, setPartnerType] = useState<'customer' | 'vendor' | 'lead'>(vendor ? 'vendor' : 'customer');
  const [name, setName] = useState('');
  const [foreignName, setForeignName] = useState('');
  const [group, setGroup] = useState('Nacional');
  const [currency, setCurrency] = useState('USD');
  const [ruc, setRuc] = useState('');
  const [phone, setPhone] = useState('');
  const [phone2, setPhone2] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [active, setActive] = useState(true);
  const [contactName, setContactName] = useState('');
  const [contactPosition, setContactPosition] = useState('Gerente Comercial');
  const [contactEmail, setContactEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Ecuador');
  const [paymentTermsDays, setPaymentTermsDays] = useState<number>(30);
  const [creditLimit, setCreditLimit] = useState<number>(5000);
  const [priceList, setPriceList] = useState('Lista 1 — PVP Base');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [glAccount, setGlAccount] = useState(vendor ? '2.01.01.01 Proveedores Locales' : '1.01.02.01 Clientes Locales');
  const [rimpe, setRimpe] = useState<'ninguno' | 'emprendedor' | 'popular'>('ninguno');
  const [subjectToWithholding, setSubjectToWithholding] = useState(false);
  const [notes, setNotes] = useState('');

  // Anexos
  const [attachments, setAttachments] = useState<Array<{ id: string; targetPath: string; fileName: string; date: string; freeText: string }>>([]);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState<number | null>(null);

  // Vincular clientes y proveedores
  const [linkCustomerCode, setLinkCustomerCode] = useState('');
  const [linkVendorCode, setLinkVendorCode] = useState('');

  // Cargar registro seleccionado
  const loadPartner = (index: number) => {
    if (index < 0 || index >= list.length) return;
    const p = list[index];
    setSelectedIndex(index);
    setFormMode('edit');
    setCardCode(p.cardCode || '');
    setName(p.name || '');
    setGroup(p.group || 'Nacional');
    setCurrency(p.currency || 'USD');
    setRuc(p.ruc || '');
    setPhone(p.phone || '');
    setEmail(p.email || '');
    setContactName(p.contactName || '');
    setAddress(p.address || '');
    setCity(p.city || '');
    setPaymentTermsDays(p.paymentTermsDays || 30);
    setCreditLimit(p.creditLimit || 0);
    setActive(p.active ?? true);
    setNotes(p.notes || '');
    if (vendor) {
      setPartnerType('vendor');
      const v = p as typeof c.data.vendors[number];
      setRimpe(v.rimpe || 'ninguno');
      setSubjectToWithholding(Boolean(v.subjectToWithholding));
    } else {
      setPartnerType('customer');
    }
  };

  const resetFormToCreate = () => {
    setSelectedIndex(-1);
    setFormMode('create');
    const autoCode = vendor ? `P${String(list.length + 1).padStart(5, '0')}` : `C${String(list.length + 1).padStart(5, '0')}`;
    setCardCode(autoCode);
    setName('');
    setForeignName('');
    setGroup('Nacional');
    setCurrency('USD');
    setRuc(privateCompany ? '' : '1792456789001');
    setPhone(privateCompany ? '' : '022345678');
    setPhone2('');
    setMobile('');
    setEmail(privateCompany ? '' : 'contacto@empresa.ec');
    setWebsite('www.empresa.ec');
    setActive(true);
    setContactName(privateCompany ? '' : 'Ing. Carlos Pérez');
    setContactPosition('Gerente');
    setContactEmail('');
    setAddress(privateCompany ? '' : 'Av. Amazonas N24-100 y Colón');
    setCity(privateCompany ? '' : 'Quito');
    setCountry('Ecuador');
    setPaymentTermsDays(30);
    setCreditLimit(privateCompany ? 0 : 5000);
    setPriceList('Lista 1 — PVP Base');
    setDiscountPercent(0);
    setRimpe('ninguno');
    setSubjectToWithholding(false);
    setNotes('');
    setAttachments([]);
  };

  // Inicializar en modo crear
  useEffect(() => {
    if (selectedIndex === -1) {
      resetFormToCreate();
    }
  }, [vendor]);

  // Atajos de teclado SAP B1 (Ctrl+A -> Modo Crear, Ctrl+F -> Modo Buscar)
  useEffect(() => {
    const onSapAdd = () => {
      resetFormToCreate();
    };
    const onSapSearch = () => {
      setFormMode('search');
    };
    window.addEventListener('sap-add-mode', onSapAdd);
    window.addEventListener('sap-search-mode', onSapSearch);
    return () => {
      window.removeEventListener('sap-add-mode', onSapAdd);
      window.removeEventListener('sap-search-mode', onSapSearch);
    };
  }, [list.length, vendor]);

  // Guardar o actualizar registro
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Introduce el nombre o razón social del interlocutor.');
      return;
    }

    try {
      if (formMode === 'create' || !cardCode) {
        if (vendor) {
          await c.save({
            action: 'vendor',
            data: {
              name,
              ruc,
              email,
              phone,
              address,
              city,
              contactName,
              currency: 'USD' as const,
              paymentTermsDays,
              creditLimit,
              active,
              group,
              notes,
              partnerClass: 'Proveedor',
              rimpe,
              subjectToWithholding,
              withholdingTax: '',
              vatWithholdingGroup: '',
              vatWithholdingCode: '',
              fiscalCategory: '',
            },
          });
        } else {
          await c.save({
            action: 'customer',
            data: {
              name,
              ruc,
              email,
              phone,
              address,
              city,
              contactName,
              currency: 'USD' as const,
              paymentTermsDays,
              creditLimit,
              active,
              group,
              notes,
              kind: partnerType === 'lead' ? 'lead' : 'customer',
              ownerCode: '',
            },
          });
        }
        resetFormToCreate();
      } else {
        // Actualización
        await c.save({
          action: 'partnerUpdate',
          data: {
            partnerType: vendor ? 'vendor' : 'customer',
            cardCode,
            changes: {
              name,
              ruc,
              email,
              phone,
              address,
              city,
              contactName,
              paymentTermsDays,
              creditLimit,
              active,
              group,
              notes,
              ...(vendor
                ? { rimpe, subjectToWithholding }
                : { kind: partnerType === 'lead' ? 'lead' : 'customer' }),
            },
          },
        });
      }
    } catch {
      /* error gestionado por c.save */
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f0f4f8] text-[#1e293b] font-[Tahoma,Arial,sans-serif] text-[11px] select-none p-2 sm:p-3 overflow-y-auto">
      {/* ── BARRA DE TÍTULO Y NAVEGADOR ESTILO SAP B1 ── */}
      <div className="bg-[#e4ebf3] border border-[#a6b8cc] rounded-t-xs px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[#0055a5] text-sm font-bold">👤</span>
          <span className="font-bold text-xs text-[#0a246a]">
            {vendor ? 'Datos Maestros de Interlocutores Comerciales — Proveedor (OCRD)' : 'Datos Maestros de Interlocutores Comerciales — Cliente / Lead (OCRD)'}
          </span>
          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#fffde7] text-[#8a5d00] border border-[#e0c46c]">
            {formMode === 'create' ? 'Modo Crear' : formMode === 'search' ? 'Modo Buscar' : 'Modo Visualizar / Actualizar'}
          </span>
        </div>

        {/* Controles de Navegación SAP B1 [|◀] [◀] (X de Y) [▶] [▶|] */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => loadPartner(0)}
            disabled={list.length === 0}
            className="p-1 bg-white hover:bg-slate-100 border border-[#b8c9d4] rounded-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Primer registro"
          >
            <ChevronsLeft size={13} />
          </button>
          <button
            type="button"
            onClick={() => loadPartner(Math.max(0, selectedIndex - 1))}
            disabled={selectedIndex <= 0}
            className="p-1 bg-white hover:bg-slate-100 border border-[#b8c9d4] rounded-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Registro anterior"
          >
            <ChevronLeft size={13} />
          </button>
          <span className="text-[10.5px] px-2 font-mono text-gray-600">
            {selectedIndex >= 0 ? `${selectedIndex + 1} / ${list.length}` : `Nuevo (${list.length} regs)`}
          </span>
          <button
            type="button"
            onClick={() => loadPartner(Math.min(list.length - 1, selectedIndex + 1))}
            disabled={selectedIndex < 0 || selectedIndex >= list.length - 1}
            className="p-1 bg-white hover:bg-slate-100 border border-[#b8c9d4] rounded-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Registro siguiente"
          >
            <ChevronRight size={13} />
          </button>
          <button
            type="button"
            onClick={() => loadPartner(list.length - 1)}
            disabled={list.length === 0}
            className="p-1 bg-white hover:bg-slate-100 border border-[#b8c9d4] rounded-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Último registro"
          >
            <ChevronsRight size={13} />
          </button>
          <button
            type="button"
            onClick={resetFormToCreate}
            className="ml-2 px-2 py-0.5 bg-[#0070d2] text-white hover:bg-[#005bb5] rounded-xs font-bold text-[10.5px] flex items-center gap-1 shadow-2xs"
            title="Crear nuevo interlocutor (Ctrl+A)"
          >
            <Plus size={11} />
            <span>Nuevo</span>
          </button>
        </div>
      </div>

      {/* ── CUERPO PRINCIPAL DEL FORMULARIO OCRD ── */}
      <form onSubmit={handleSave} className="border border-[#a6b8cc] border-t-0 bg-white p-3 rounded-b-xs space-y-3 shadow-xs">
        {/* Cabecera Canónica OCRD (2 Columnas con Etiquetas y Cuadros Oficiales SAP B1) */}
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
                  disabled={formMode === 'edit'}
                  className="w-full border border-[#9fb4c7] bg-[#fffde7] px-2 py-0.5 text-[11px] font-mono font-bold text-[#003366] rounded-xs focus:outline-none focus:ring-1 focus:ring-[#0070d2]"
                  placeholder="Auto (C00001 / P00001)"
                />
                <button
                  type="button"
                  onClick={() => setFormMode('search')}
                  className="p-1 bg-slate-100 hover:bg-slate-200 border border-[#9fb4c7] rounded-xs text-gray-600"
                  title="Buscar código existente (Ctrl+F)"
                >
                  <Search size={12} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] font-bold text-[#003366]">Nombre / Razón Social <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] rounded-xs focus:bg-[#fffde7] focus:outline-none focus:ring-1 focus:ring-[#0070d2]"
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
              </select>
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

          {/* Columna Derecha: Tipo, RUC, Saldo de Cuenta */}
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
              <label className="text-[10.5px] font-bold text-[#003366]">RUC / C.I. <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] font-mono rounded-xs focus:bg-[#fffde7] focus:outline-none focus:ring-1 focus:ring-[#0070d2]"
                placeholder="1792456789001"
              />
            </div>

            {/* Saldo de Cuenta con Enlace Oficial de SAP B1 */}
            <div className="grid grid-cols-3 gap-2 items-center bg-[#f7fafc] p-1.5 border border-[#d4e1ed] rounded-xs">
              <label className="text-[10.5px] font-bold text-[#003366] flex items-center gap-1">
                <span>Saldo de cuenta</span>
                <span className="text-orange-500 text-xs font-black cursor-pointer" title="Ver detalle de mayor">➔</span>
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

        {/* ── PESTAÑAS OFICIALES SAP BUSINESS ONE ── */}
        <div className="border-b border-[#a6b8cc] flex items-center gap-1 select-none pt-1">
          {[
            { id: 'general', label: 'General' },
            { id: 'contactos', label: 'Personas de contacto' },
            { id: 'direcciones', label: 'Direcciones' },
            { id: 'condiciones', label: 'Condiciones de pago' },
            { id: 'finanzas', label: 'Finanzas (SRI)' },
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
        <div className="bg-white border border-[#a6b8cc] border-t-0 p-3 rounded-b-xs shadow-xs min-h-[200px]">
          {/* PESTAÑA: GENERAL */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Teléfono 1</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Teléfono móvil</label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Correo electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Sitio Web</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-start">
                  <label className="text-[10.5px] text-[#475569] pt-1">Observaciones</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-1 rounded-xs"
                    placeholder="Comentarios internos o instrucciones comerciales"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA: PERSONAS DE CONTACTO */}
          {activeTab === 'contactos' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#f7fafc] p-2.5 border border-[#cbd8e5] rounded-xs">
                <div>
                  <label className="block text-[10.5px] font-bold text-[#003366] mb-1">Nombre del contacto</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full border border-[#9fb4c7] bg-white px-2 py-0.5 rounded-xs"
                    placeholder="Ing. Carlos Pérez"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] text-[#475569] mb-1">Cargo / Posición</label>
                  <input
                    type="text"
                    value={contactPosition}
                    onChange={(e) => setContactPosition(e.target.value)}
                    className="w-full border border-[#9fb4c7] bg-white px-2 py-0.5 rounded-xs"
                    placeholder="Gerente Comercial"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] text-[#475569] mb-1">Correo de contacto</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full border border-[#9fb4c7] bg-white px-2 py-0.5 rounded-xs"
                    placeholder="carlos.perez@empresa.ec"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA: DIRECCIONES */}
          {activeTab === 'direcciones' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-bold text-[#003366] border-b pb-1">Dirección de Factura</h4>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Calle y Nro.</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Ciudad</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">País</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-[#003366] border-b pb-1">Dirección de Entrega / Destino</h4>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Dirección destino</label>
                  <input
                    type="text"
                    defaultValue={address}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA: CONDICIONES DE PAGO */}
          {activeTab === 'condiciones' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Plazo de pago (días)</label>
                  <input
                    type="number"
                    min={0}
                    value={paymentTermsDays}
                    onChange={(e) => setPaymentTermsDays(Number(e.target.value))}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Lista de precios</label>
                  <select
                    value={priceList}
                    onChange={(e) => setPriceList(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
                  >
                    <option value="Lista 1 — PVP Base">Lista 1 — PVP Base</option>
                    <option value="Lista 2 — Mayorista">Lista 2 — Mayorista</option>
                    <option value="Lista 3 — Distribuidor">Lista 3 — Distribuidor</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] font-bold text-[#003366]">Límite de crédito USD</label>
                  <input
                    type="number"
                    min={0}
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs font-mono font-bold text-[#0055a5]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Descuento total %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA: FINANZAS (SRI) */}
          {activeTab === 'finanzas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] font-bold text-[#003366]">Cuenta contable</label>
                  <input
                    type="text"
                    value={glAccount}
                    onChange={(e) => setGlAccount(e.target.value)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569]">Régimen SRI</label>
                  <select
                    value={rimpe}
                    onChange={(e) => setRimpe(e.target.value as typeof rimpe)}
                    className="col-span-2 border border-[#9fb4c7] px-2 py-0.5 rounded-xs"
                  >
                    <option value="ninguno">Régimen General</option>
                    <option value="emprendedor">RIMPE Emprendedor (Retención 1%)</option>
                    <option value="popular">RIMPE Negocio Popular (Nota de venta)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={subjectToWithholding}
                    onChange={(e) => setSubjectToWithholding(e.target.checked)}
                    className="rounded text-[#0070d2]"
                  />
                  <span className="font-semibold text-[#003366]">Sujeto a retención en la fuente</span>
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
                            No hay archivos anexados a esta ficha de interlocutor. Haz clic en &quot;Explorar...&quot; para adjuntar cédula o RUC.
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
                              targetPath: 'C:\\SAP_B1\\BP_Attachments\\',
                              fileName: file.name,
                              date: new Date().toISOString().slice(0, 10),
                              freeText: 'Documento de interlocutor',
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
            Total en base de datos: <strong>{list.length}</strong> {vendor ? 'proveedores' : 'clientes'}
          </span>
        </div>
      </form>

      {/* ── SECCIÓN INFERIOR: VINCULAR CLIENTE Y PROVEEDOR ── */}
      <div className="mt-3 bg-white border border-[#9fb4c7] rounded-xs p-3">
        <h4 className="font-bold text-xs text-[#0a246a] mb-1">Vincular fichas de Cliente y Proveedor</h4>
        <p className="text-[10.5px] text-gray-500 mb-2">
          Relaciona dos fichas que operan como contrapartes mutuas manteniendo sus libros auxiliares independientes.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={linkCustomerCode}
            onChange={(e) => setLinkCustomerCode(e.target.value)}
            className="border border-[#9fb4c7] px-2 py-1 rounded-xs bg-white text-[11px]"
          >
            <option value="">Selecciona cliente...</option>
            {c.data.customers.map((cust) => (
              <option key={cust.id} value={cust.cardCode}>
                {cust.cardCode} · {cust.name}
              </option>
            ))}
          </select>
          <span className="font-bold text-[#0055a5]">⟷</span>
          <select
            value={linkVendorCode}
            onChange={(e) => setLinkVendorCode(e.target.value)}
            className="border border-[#9fb4c7] px-2 py-1 rounded-xs bg-white text-[11px]"
          >
            <option value="">Selecciona proveedor...</option>
            {c.data.vendors.map((vend) => (
              <option key={vend.id} value={vend.cardCode}>
                {vend.cardCode} · {vend.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!linkCustomerCode || !linkVendorCode || c.saving}
            onClick={async () => {
              try {
                await c.save({
                  action: 'partnerLink',
                  data: { customerCode: linkCustomerCode, vendorCode: linkVendorCode },
                });
                alert('Vínculo comercial registrado.');
              } catch {
                /* handled */
              }
            }}
            className="px-3 py-1 bg-[#0055a5] hover:bg-[#004080] text-white font-bold rounded-xs text-[11px] disabled:opacity-40 active:scale-95 transition cursor-pointer"
          >
            Guardar Vínculo
          </button>
        </div>
      </div>
    </div>
  );
}
