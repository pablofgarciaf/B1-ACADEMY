'use client';

import React, { useState, useEffect } from 'react';
import { useCompany } from '@/hooks/useCompany';
import PartnerHeaderNav from './partner/PartnerHeaderNav';
import PartnerMainFields from './partner/PartnerMainFields';
import PartnerLinkBox from './partner/PartnerLinkBox';
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
  const counterparts = vendor ? c.data.customers : c.data.vendors;
  const configuredGroups =
    ((c.data.profile as unknown as Record<string, unknown>)?.customerGroups as Array<{ codigo?: string }> | undefined) ?? [];
  const customerGroupOptions = Array.from(
    new Set([
      'Nacional',
      'Extranjero / Exterior',
      'Corporativo / Grupo',
      'Gobierno / Público',
      ...configuredGroups.map((g) => g.codigo || '').filter(Boolean),
    ])
  );

  // Modo: 'create' (Ctrl+A), 'edit' (cuando se selecciona un registro), o 'search' (Ctrl+F)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'search'>('create');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<'general' | 'contactos' | 'direcciones' | 'condiciones' | 'finanzas' | 'anexos'>('general');
  const [partnerSaving, setPartnerSaving] = useState(false);

  // Estado del formulario
  const [cardCode, setCardCode] = useState('');
  const [partnerType, setPartnerType] = useState<'customer' | 'vendor' | 'lead'>(vendor ? 'vendor' : 'customer');
  const [name, setName] = useState('');
  const [foreignName, setForeignName] = useState('');
  const [group, setGroup] = useState('Nacional');
  const [currency, setCurrency] = useState('USD');
  const [ruc, setRuc] = useState('');
  const [phone, setPhone] = useState('');
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

  // Contraparte conectada (Cliente conectado en Proveedor / Proveedor conectado en Cliente)
  const [linkedPartnerCode, setLinkedPartnerCode] = useState('');

  // Anexos
  const [attachments, setAttachments] = useState<PartnerAttachment[]>([]);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState<number | null>(null);

  // Vincular clientes y proveedores (cajas sincronizadas)
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
      const conn = v.linkedCustomerCode || '';
      setLinkedPartnerCode(conn);
      setLinkVendorCode(v.cardCode || '');
      setLinkCustomerCode(conn);
    } else {
      const cust = p as typeof c.data.customers[number];
      setPartnerType(cust.kind === 'lead' ? 'lead' : 'customer');
      const conn = cust.linkedVendorCode || '';
      setLinkedPartnerCode(conn);
      setLinkCustomerCode(cust.cardCode || '');
      setLinkVendorCode(conn);
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
    setLinkedPartnerCode('');
    setAttachments([]);
  };

  // Inicializar en modo crear
  useEffect(() => {
    if (selectedIndex === -1) {
      resetFormToCreate();
    }
  }, [vendor]);

  // Atajos de teclado SAP B1 (Ctrl+A, Ctrl+F, Ctrl+S, Escape)
  useEffect(() => {
    const onSapAdd = () => resetFormToCreate();
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
      if (formMode === 'search') resetFormToCreate();
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

  // Guardar vínculo entre Cliente y Proveedor
  const handleSaveLink = async (custCode: string, vendCode: string): Promise<boolean> => {
    try {
      await c.save({
        action: 'partnerLink',
        data: { customerCode: custCode, vendorCode: vendCode },
      });
      if (vendor && cardCode === vendCode) setLinkedPartnerCode(custCode);
      if (!vendor && cardCode === custCode) setLinkedPartnerCode(vendCode);
      return true;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al vincular socios.');
      return false;
    }
  };

  // Guardar o actualizar registro (o ejecutar búsqueda en modo Buscar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === 'search') {
      const qCode = cardCode.trim().toLowerCase();
      const qName = name.trim().toLowerCase();
      const qRuc = ruc.trim();
      const matched = list.find(
        (p) =>
          (qCode && p.cardCode.toLowerCase().includes(qCode)) ||
          (qName && p.name.toLowerCase().includes(qName)) ||
          (qRuc && p.ruc && p.ruc.includes(qRuc))
      );
      if (matched) {
        const idx = list.findIndex((p) => p.cardCode === matched.cardCode);
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

    setPartnerSaving(true);
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
              cardCode: cardCode.trim(),
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
        // Actualización estándar del socio
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

        // Si se configuró o cambió el socio conectado en la cabecera, se asegura el vínculo
        if (linkedPartnerCode) {
          const cust = vendor ? linkedPartnerCode : cardCode;
          const vend = vendor ? cardCode : linkedPartnerCode;
          await c.save({
            action: 'partnerLink',
            data: { customerCode: cust, vendorCode: vend },
          });
        }
      }
    } catch {
      /* error gestionado por c.save */
    } finally {
      setPartnerSaving(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f0f4f8] text-[#1e293b] font-[Tahoma,Arial,sans-serif] text-[11px] select-none p-2 sm:p-3 overflow-y-auto">
      {/* ── BARRA DE TÍTULO Y NAVEGADOR ESTILO SAP B1 ── */}
      <PartnerHeaderNav
        vendor={vendor}
        formMode={formMode}
        selectedIndex={selectedIndex}
        totalRecords={list.length}
        list={list}
        onFirst={() => loadPartner(0)}
        onPrev={() => loadPartner(Math.max(0, selectedIndex - 1))}
        onNext={() => loadPartner(Math.min(list.length - 1, selectedIndex + 1))}
        onLast={() => loadPartner(list.length - 1)}
        onSelectIndex={(idx) => loadPartner(idx)}
        onNew={resetFormToCreate}
      />

      {/* ── CUERPO PRINCIPAL DEL FORMULARIO OCRD ── */}
      <form
        id="company-partner-form"
        onSubmit={handleSave}
        className="border border-[#a6b8cc] border-t-0 bg-white p-3 rounded-b-xs space-y-3 shadow-xs"
      >
        <PartnerMainFields
          vendor={vendor}
          formMode={formMode}
          setFormMode={setFormMode}
          cardCode={cardCode}
          setCardCode={setCardCode}
          name={name}
          setName={setName}
          foreignName={foreignName}
          setForeignName={setForeignName}
          group={group}
          setGroup={setGroup}
          customerGroupOptions={customerGroupOptions}
          city={city}
          setCity={setCity}
          paymentTermsDays={paymentTermsDays}
          setPaymentTermsDays={setPaymentTermsDays}
          currency={currency}
          setCurrency={setCurrency}
          partnerType={partnerType}
          setPartnerType={setPartnerType}
          ruc={ruc}
          setRuc={setRuc}
          active={active}
          setActive={setActive}
          linkedPartnerCode={linkedPartnerCode}
          setLinkedPartnerCode={(code) => {
            setLinkedPartnerCode(code);
            if (vendor) {
              setLinkVendorCode(cardCode);
              setLinkCustomerCode(code);
            } else {
              setLinkCustomerCode(cardCode);
              setLinkVendorCode(code);
            }
          }}
          counterparts={counterparts}
        />

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
              disabled={partnerSaving}
              className="px-5 py-1.5 bg-[#0070d2] hover:bg-[#005bb5] text-white font-bold text-xs rounded-xs shadow-sm active:scale-95 transition cursor-pointer"
            >
              {partnerSaving ? 'Guardando…' : formMode === 'create' ? 'Crear (Ctrl+A)' : formMode === 'search' ? 'Buscar (Ctrl+F)' : 'Actualizar'}
            </button>
            <button
              type="button"
              onClick={resetFormToCreate}
              disabled={partnerSaving}
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
      <PartnerLinkBox
        customers={c.data.customers}
        vendors={c.data.vendors}
        linkCustomerCode={linkCustomerCode}
        setLinkCustomerCode={setLinkCustomerCode}
        linkVendorCode={linkVendorCode}
        setLinkVendorCode={setLinkVendorCode}
        onSaveLink={handleSaveLink}
        saving={c.saving}
      />
    </div>
  );
}
