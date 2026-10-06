'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { documentLabels } from '@/lib/company-engine';
import { salesTypes, purchaseTypes, type Approval, type DocType } from '@/lib/firestore-types';
import { usd } from '@/lib/company-calculations';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';
import { ParaPensar } from './AnalysisBlocks';

const TIPOS: DocType[] = ['order', 'invoice', 'credit_note', 'purchase_order', 'vendor_invoice', 'debit_note'];

/** Contexto que un aprobador responsable revisa antes de decidir. */
function Contexto({ a }: { a: Approval }) {
  const c = useCompany();
  const socio = (a.kind === 'sales' ? c.data.customers : c.data.vendors).find(p => p.cardCode === a.cardCode);
  const exceso = a.total - a.threshold;
  const datos: string[] = [`Supera la regla en ${usd(exceso)} (${Math.round((exceso / Math.max(a.threshold, 1)) * 100)} %).`];
  if (socio) {
    datos.push(`Saldo actual con ${socio.name}: ${usd(socio.balance)}.`);
    if (a.kind === 'sales' && socio.creditLimit > 0) {
      const despues = socio.balance + a.total;
      datos.push(despues > socio.creditLimit
        ? `⚠ Con este documento el cliente quedaría en ${usd(despues)}, sobre su cupo de crédito de ${usd(socio.creditLimit)}.`
        : `Quedaría en ${usd(despues)} de un cupo de ${usd(socio.creditLimit)}.`);
    }
  }
  return <ul className="list-disc pl-5 text-[#333]">{datos.map(d => <li key={d}>{d}</li>)}</ul>;
}

function Pendiente({ a }: { a: Approval }) {
  const c = useCompany();
  const [comentario, setComentario] = useState('');
  const decidir = async (approved: boolean) => { try { await c.save({ action: 'approve', data: { id: a.id, approved, comment: comentario } }); } catch { /* el proveedor muestra el error */ } };
  return (
    <article className="space-y-2 border border-[#999] bg-white p-2">
      <header className="flex flex-wrap justify-between gap-2 font-bold">
        <span>{a.approvalNumber} · {documentLabels[a.docType]} · {a.cardName}</span>
        <span>{usd(a.total)}</span>
      </header>
      <p className="text-[#555]">Fecha {a.document.date} · {a.document.lines.length} línea(s) · {a.document.comments || 'sin comentarios'}</p>
      <Contexto a={a} />
      <Field label="Justificación de la decisión (obligatoria)">
        <textarea className={`${inputClass} min-h-16`} value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Ej.: Se aprueba porque el cliente paga puntual y el margen es 28 %…" />
      </Field>
      <div className="flex gap-2">
        <button type="button" className={`${buttonClass} font-bold`} disabled={c.saving || comentario.trim().length < 10} onClick={() => decidir(true)}>✔ Aprobar</button>
        <button type="button" className={buttonClass} disabled={c.saving || comentario.trim().length < 10} onClick={() => decidir(false)}>✖ Rechazar</button>
      </div>
    </article>
  );
}

/** Procedimientos de autorización (ADM003 / ADM006): control interno sobre documentos de alto monto. */
export default function ApprovalsScreen() {
  const c = useCompany();
  const reglas = c.data.profile?.approvalRules ?? [];
  const [docType, setDocType] = useState<DocType>('purchase_order');
  const [monto, setMonto] = useState(1000);
  const pendientes = c.data.approvals.filter(a => a.status === 'pending');
  const historial = c.data.approvals.filter(a => a.status !== 'pending').sort((a, b) => b.decidedAt.localeCompare(a.decidedAt));
  const guardarRegla = async (dt: DocType, threshold: number, active: boolean) => { try { await c.save({ action: 'approvalRule', data: { docType: dt as (typeof salesTypes)[number] | (typeof purchaseTypes)[number], threshold, active } }); } catch { /* error visible */ } };

  return (
    <Screen title="Procedimientos de autorización">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        En una empresa seria nadie compra o vende montos grandes sin una segunda firma. Define desde qué monto un documento
        necesita autorización: al guardarlo quedará <strong>retenido como borrador</strong> hasta que alguien lo apruebe con una justificación.
      </p>

      <section className="space-y-2 border border-[#999] bg-white p-2">
        <h3 className="font-bold text-[#003366]">Reglas</h3>
        <div className="grid gap-2 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
          <Field label="Tipo de documento"><select className={inputClass} value={docType} onChange={e => setDocType(e.target.value as DocType)}>{TIPOS.map(t => <option key={t} value={t}>{documentLabels[t]}</option>)}</select></Field>
          <Field label="Requiere autorización si el total supera (USD)"><input type="number" min={0} step="any" className={inputClass} value={monto} onChange={e => setMonto(Number(e.target.value))} /></Field>
          <button type="button" className={buttonClass} disabled={c.saving} onClick={() => guardarRegla(docType, monto, true)}>Guardar regla</button>
        </div>
        <Table headers={['Documento', 'Monto desde', 'Estado', 'Acción']} rows={reglas.map(r => [
          documentLabels[r.docType], usd(r.threshold), r.active ? 'Activa' : 'Inactiva',
          <button key={r.docType} type="button" className={buttonClass} disabled={c.saving} onClick={() => guardarRegla(r.docType, r.threshold, !r.active)}>{r.active ? 'Desactivar' : 'Activar'}</button>,
        ])} />
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-[#003366]">Bandeja de autorizaciones ({pendientes.length})</h3>
        {pendientes.length ? pendientes.map(a => <Pendiente key={a.id} a={a} />) : <p className="bg-white p-2">No hay documentos pendientes de autorización.</p>}
      </section>

      <h3 className="font-bold text-[#003366]">Historial de decisiones</h3>
      <Table headers={['Solicitud', 'Documento', 'Socio', 'Total', 'Decisión', 'Justificación', 'Documento creado']} rows={historial.map(a => [
        a.approvalNumber, documentLabels[a.docType], a.cardName, usd(a.total),
        <strong key="d" className={a.status === 'approved' ? 'text-[#2e7d32]' : 'text-[#c62828]'}>{a.status === 'approved' ? 'Aprobada' : 'Rechazada'}</strong>,
        a.decisionComment, a.resultDocumentId || '—',
      ])} />
      <ParaPensar clave={`b1_aprobaciones_${c.data.profile?.uid ?? 'anon'}`} preguntas={[
        '¿Qué monto pondrías como límite? Si es muy bajo, frenas la operación; si es muy alto, pierdes control. ¿Cómo lo equilibras?',
        '¿Debería la misma persona que pide una compra poder aprobarla? ¿Qué riesgo de fraude evita separar funciones?',
        '¿Qué información mínima necesitas ver antes de aprobar una venta a crédito grande?',
      ]} />
    </Screen>
  );
}
