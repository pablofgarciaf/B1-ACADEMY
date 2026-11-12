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
import PartnerTabsDetail, { type PartnerAttachment } from './PartnerTabsDetail';

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
    setRuc('');
    setPhone('');
    setPhone2('');
    setMobile('');
    setEmail('');
    setWebsite('');
    setActive(true);
    setContactName('');
    setContactPosition('');
    setContactEmail('');
    setAddress('');
    setCity('');
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

  // Atajos de teclado SAP B1 (Ctrl+A -> Modo Crear, Ctrl+F -> Modo Buscar, Ctrl+S -> Guardar, Escape -> Cancelar)
  useEffect(() => {
    const onSapAdd = () => {
      resetFormToCreate();
    };
    const onSapSearch = () => {
      setFormMode('search');
      const codeInput = document.querySelector('input[placeholder*="Auto"]') as HTMLInputElement | null;
      if (codeInput) {
        codeInput.focus();
        codeInput.select();
      }
    };
    const onSapSave = () => {
      const formEl = document.getElementById('company-partner-form') as HTMLFormElement | null;
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
  }, [list, formMode, vendor]);

  // Guardar o actualizar registro (o ejecutar búsqueda en modo Buscar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === 'search') {
      const qCode = cardCode.trim().toLowerCase();
      const qName = name.trim().toLowerCase();
      const qRuc = ruc.trim();
      const matched = list.find(p =>
        (qCode && p.cardCode.toLowerCase().includes(qCode)) ||
        (qName && p.name.toLowerCase().includes(qName)) ||
        (qRuc && p.ruc && p.ruc.includes(qRuc))
      );
      if (matched) {
        const idx = list.findIndex(p => p.cardCode === matched.cardCode);
        loadPartner(idx);
      } else if (list.length > 0) {
        loadPartner(0);
      } else {
        alert('No se encontraron interlocutores con ese criterio de búsqueda.');
      }
      return;
    }

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
      <form id="company-partner-form" onSubmit={handleSave} className="border border-[#a6b8cc] border-t-0 bg-white p-3 rounded-b-xs space-y-3 shadow-xs">
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
                  className={`w-full border ${formMode === 'search' ? 'border-[#d49b00] bg-[#fffde7] ring-1 ring-[#f59e0b]/50' : 'border-[#9fb4c7] bg-[#fffde7]'} px-2 py-0.5 text-[11px] font-mono font-bold text-[#003366] rounded-xs focus:outline-none focus:ring-1 focus:ring-[#0070d2]`}
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
                required={formMode !== 'search'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`col-span-2 border ${formMode === 'search' ? 'border-[#d49b00] bg-[#fffde7]' : 'border-[#9fb4c7] bg-white'} px-2 py-0.5 text-[11px] rounded-xs focus:bg-[#fffde7] focus:outline-none focus:ring-1 focus:ring-[#0070d2]`}
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
              <label className="text-[10.5px] font-bold text-[#003366]">Ciudad <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] rounded-xs focus:bg-[#fffde7] focus:outline-none"
                placeholder="Ej. Cuenca o Quito"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-[10.5px] font-bold text-[#003366]">Condición de pago</label>
              <div className="col-span-2 flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  value={paymentTermsDays}
                  onChange={(e) => setPaymentTermsDays(Number(e.target.value))}
                  className="w-20 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] font-mono rounded-xs focus:bg-[#fffde7] focus:outline-none"
                />
                <span className="text-[10.5px] text-gray-500">días</span>
              </div>
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

        <PartnerTabsDetail
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          phone={phone}
          setPhone={setPhone}
          mobile={mobile}
          setMobile={setMobile}
          email={email}
          setEmail={setEmail}
          website={website}
          setWebsite={setWebsite}
          notes={notes}
          setNotes={setNotes}
          contactName={contactName}
          setContactName={setContactName}
          contactPosition={contactPosition}
          setContactPosition={setContactPosition}
          contactEmail={contactEmail}
          setContactEmail={setContactEmail}
          address={address}
          setAddress={setAddress}
          city={city}
          setCity={setCity}
          country={country}
          setCountry={setCountry}
          paymentTermsDays={paymentTermsDays}
          setPaymentTermsDays={setPaymentTermsDays}
          priceList={priceList}
          setPriceList={setPriceList}
          creditLimit={creditLimit}
          setCreditLimit={setCreditLimit}
          discountPercent={discountPercent}
          setDiscountPercent={setDiscountPercent}
          glAccount={glAccount}
          setGlAccount={setGlAccount}
          rimpe={rimpe}
          setRimpe={setRimpe}
          subjectToWithholding={subjectToWithholding}
          setSubjectToWithholding={setSubjectToWithholding}
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
