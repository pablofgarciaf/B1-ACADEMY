import React from 'react';

export interface PartnerAttachment {
  id: string;
  targetPath: string;
  fileName: string;
  date: string;
  freeText: string;
}

interface PartnerTabsDetailProps {
  activeTab: 'general' | 'contactos' | 'direcciones' | 'condiciones' | 'finanzas' | 'anexos';
  setActiveTab: (tab: 'general' | 'contactos' | 'direcciones' | 'condiciones' | 'finanzas' | 'anexos') => void;
  // General
  phone: string;
  setPhone: (v: string) => void;
  mobile: string;
  setMobile: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  website: string;
  setWebsite: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  // Contactos
  contactName: string;
  setContactName: (v: string) => void;
  contactPosition: string;
  setContactPosition: (v: string) => void;
  contactEmail: string;
  setContactEmail: (v: string) => void;
  // Direcciones
  address: string;
  setAddress: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  // Condiciones
  paymentTermsDays: number;
  setPaymentTermsDays: (v: number) => void;
  priceList: string;
  setPriceList: (v: string) => void;
  creditLimit: number;
  setCreditLimit: (v: number) => void;
  discountPercent: number;
  setDiscountPercent: (v: number) => void;
  // Finanzas
  glAccount: string;
  setGlAccount: (v: string) => void;
  rimpe: 'ninguno' | 'emprendedor' | 'popular';
  setRimpe: (v: 'ninguno' | 'emprendedor' | 'popular') => void;
  subjectToWithholding: boolean;
  setSubjectToWithholding: (v: boolean) => void;
  // Anexos
  attachments: PartnerAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<PartnerAttachment[]>>;
  selectedAttachmentIndex: number | null;
  setSelectedAttachmentIndex: (v: number | null) => void;
}

export default function PartnerTabsDetail({
  activeTab,
  setActiveTab,
  phone,
  setPhone,
  mobile,
  setMobile,
  email,
  setEmail,
  website,
  setWebsite,
  notes,
  setNotes,
  contactName,
  setContactName,
  contactPosition,
  setContactPosition,
  contactEmail,
  setContactEmail,
  address,
  setAddress,
  city,
  setCity,
  country,
  setCountry,
  paymentTermsDays,
  setPaymentTermsDays,
  priceList,
  setPriceList,
  creditLimit,
  setCreditLimit,
  discountPercent,
  setDiscountPercent,
  glAccount,
  setGlAccount,
  rimpe,
  setRimpe,
  subjectToWithholding,
  setSubjectToWithholding,
  attachments,
  setAttachments,
  selectedAttachmentIndex,
  setSelectedAttachmentIndex,
}: PartnerTabsDetailProps) {
  return (
    <>
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
                  className="col-span-2 border border-[#9fb4c7] bg-white text-[#1e293b] px-2 py-0.5 rounded-xs focus:bg-[#fffde7] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] text-[#475569]">Ciudad</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="col-span-2 border border-[#9fb4c7] bg-white text-[#1e293b] px-2 py-0.5 rounded-xs focus:bg-[#fffde7] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-[10.5px] text-[#475569]">País</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="col-span-2 border border-[#9fb4c7] bg-white text-[#1e293b] px-2 py-0.5 rounded-xs focus:bg-[#fffde7] focus:outline-none"
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
                  className="col-span-2 border border-[#9fb4c7] bg-white text-[#1e293b] px-2 py-0.5 rounded-xs focus:bg-[#fffde7] focus:outline-none"
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
                          <td className="p-1.5 text-gray-600 truncate max-w-[200px]">
                            {att.freeText}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Botones de Anexos estilo SAP B1 */}
              <div className="flex md:flex-col gap-2 shrink-0 md:w-28">
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
    </>
  );
}
