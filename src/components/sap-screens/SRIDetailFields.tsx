'use client';
import type { CommandData } from '@/lib/company-commands';
import { Field, Table, buttonClass, inputClass } from './SAPControls';
import { today } from '@/lib/company-calculations';

type Data = CommandData<'sri'>;
const fields: { key: Exclude<keyof Data['details'], 'accountingRequired'>; label: string; types?: string[]; date?: boolean; required?: boolean }[] = [
  { key: 'matrixAddress', label: 'Dirección matriz', required: true },
  { key: 'establishmentAddress', label: 'Dirección establecimiento', required: true },
  { key: 'supportNumber', label: 'Número fiscal de sustento (001-001-000000001)', types: ['04', '05', '07'], required: true },
  { key: 'supportDate', label: 'Fecha del comprobante modificado', types: ['04', '05'], date: true, required: true },
  { key: 'reason', label: 'Motivo', types: ['04', '05', '06'], required: true },
  { key: 'departureAddress', label: 'Dirección de partida', types: ['06'], required: true },
  { key: 'destinationAddress', label: 'Dirección de destino', types: ['06'], required: true },
  { key: 'carrierName', label: 'Nombre del transportista', types: ['06'], required: true },
  { key: 'carrierId', label: 'RUC / cédula del transportista', types: ['06'], required: true },
  { key: 'plate', label: 'Placa', types: ['06'], required: true },
  { key: 'transportStart', label: 'Inicio del transporte', types: ['06'], date: true, required: true },
  { key: 'transportEnd', label: 'Fin del transporte', types: ['06'], date: true, required: true },
  { key: 'route', label: 'Ruta', types: ['06'] },
];
export function SRIDetailFields({ data, onChange }: { data: Data; onChange: (value: Data) => void }) {
  return <div className="grid gap-3 sm:grid-cols-3">
    {fields.filter(field => !field.types || field.types.includes(data.docType)).map(field => <Field key={field.key} label={field.label} required={field.required}>
      <input className={inputClass} required={field.required} type={field.date ? 'date' : 'text'} value={data.details[field.key]} pattern={field.key === 'supportNumber' ? '[0-9]{3}-[0-9]{3}-[0-9]{9}' : undefined} onChange={e => onChange({ ...data, details: { ...data.details, [field.key]: e.target.value } })} />
    </Field>)}
    <Field label="Obligado a llevar contabilidad"><input type="checkbox" checked={data.details.accountingRequired} onChange={e => onChange({ ...data, details: { ...data.details, accountingRequired: e.target.checked } })} /></Field>
  </div>;
}

export function ATSFields({ value, onChange }: { value: Data['ats']; onChange: (value: Data['ats']) => void }) {
  return <details><summary className="cursor-pointer font-bold">ATS · identificación, bases, retenciones, pago y compensaciones</summary>
    <div className="mt-2 grid gap-2 sm:grid-cols-3">{Object.entries(value).filter(([, entry]) => !Array.isArray(entry)).map(([key, entry]) => <Field key={key} label={key}>
      {typeof entry === 'boolean' ? <input type="checkbox" checked={entry} onChange={e => onChange({ ...value, [key]: e.target.checked })} /> : <input className={inputClass} type={typeof entry === 'number' ? 'number' : key.startsWith('fecha') ? 'date' : 'text'} min={typeof entry === 'number' ? 0 : undefined} step={typeof entry === 'number' ? '0.01' : undefined} readOnly={['autorizacion', 'secuencial'].includes(key)} value={String(entry)} onChange={e => onChange({ ...value, [key]: typeof entry === 'number' ? Number(e.target.value) : e.target.value })} />}
    </Field>)}<Field label="Formas de pago (códigos separados por coma)"><input className={inputClass} value={value.formasDePago.join(',')} onChange={e => onChange({ ...value, formasDePago: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })} /></Field></div>
    <Table headers={['Código compensación', 'Valor', 'Acción']} rows={value.compensaciones.map((row, i) => [
      <input key="code" aria-label={'Código compensación ' + (i + 1)} className={inputClass} value={row.codigo} onChange={e => onChange({ ...value, compensaciones: value.compensaciones.map((r, j) => j === i ? { ...r, codigo: e.target.value } : r) })} />,
      <input key="value" aria-label={'Valor compensación ' + (i + 1)} className={inputClass} type="number" min="0" step="0.01" value={row.valor} onChange={e => onChange({ ...value, compensaciones: value.compensaciones.map((r, j) => j === i ? { ...r, valor: Number(e.target.value) } : r) })} />,
      <button key="remove" type="button" className={buttonClass} onClick={() => onChange({ ...value, compensaciones: value.compensaciones.filter((_, j) => i !== j) })}>Eliminar</button>,
    ])} /><button type="button" className={buttonClass} onClick={() => onChange({ ...value, compensaciones: [...value.compensaciones, { codigo: '', valor: 0 }] })}>+ Compensación</button>
    <ATSRows title="Retenciones de renta (AIR)" rows={value.air} onChange={air => onChange({ ...value, air })} blank={{ codRetAir: '', baseImpAir: 0, porcentajeAir: 0, valRetAir: 0 }} />
    <ATSRows title="Reembolsos" rows={value.reembolsos} onChange={reembolsos => onChange({ ...value, reembolsos })} blank={{ tipoComprobanteReemb: '01', tpIdProvReemb: '01', idProvReemb: '', establecimientoReemb: '001', puntoEmisionReemb: '001', secuencialReemb: '', fechaEmisionReemb: today(), autorizacionReemb: '', baseImponibleReemb: 0, baseImpGravReemb: 0, baseNoGraIvaReemb: 0, baseImpExeReemb: 0, montoIceRemb: 0, montoIvaRemb: 0 }} />
  </details>;
}

function ATSRows<T extends Record<string, string | number>>({ title, rows, blank, onChange }: { title: string; rows: T[]; blank: T; onChange: (rows: T[]) => void }) {
  return <details className="mt-3 border border-[#999] p-2"><summary>{title} ({rows.length})</summary>
    {rows.map((row, index) => <div key={index} className="my-2 grid gap-2 border-b border-[#999] pb-2 sm:grid-cols-3">
      {Object.entries(row).map(([key, entry]) => <Field key={key} label={key}><input className={inputClass} type={typeof entry === 'number' ? 'number' : key.startsWith('fecha') ? 'date' : 'text'} min={typeof entry === 'number' ? 0 : undefined} step={typeof entry === 'number' ? '0.01' : undefined} value={entry} onChange={e => onChange(rows.map((r, i) => i === index ? { ...r, [key]: typeof entry === 'number' ? Number(e.target.value) : e.target.value } : r))} /></Field>)}
      <button type="button" className={buttonClass} onClick={() => onChange(rows.filter((_, i) => i !== index))}>Eliminar línea</button>
    </div>)}<button type="button" className={buttonClass} disabled={rows.length >= 30} onClick={() => onChange([...rows, { ...blank }])}>+ Añadir línea</button>
  </details>;
}
