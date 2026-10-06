'use client';
import { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { commandSchema } from '@/lib/company-commands';
import { TABLAS } from '@/lib/query-engine';
import { mensajeValidacion } from '@/lib/zod-es';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';

type Tipo = 'customer' | 'vendor' | 'item';
const ETIQUETA: Record<Tipo, string> = { customer: 'Clientes', vendor: 'Proveedores', item: 'Artículos' };

/** Columnas de la plantilla y valores por defecto: el CSV solo necesita lo esencial. */
const PLANTILLA: Record<Tipo, { columnas: string[]; ejemplo: string[]; defecto: Record<string, unknown> }> = {
  customer: {
    columnas: ['name', 'ruc', 'email', 'phone', 'city', 'address', 'paymentTermsDays', 'creditLimit', 'group'],
    ejemplo: ['Comercial Andes', '1791234567001', 'compras@andes.ec', '022345678', 'Quito', 'Av. Amazonas N24', '30', '5000', 'Mayoristas'],
    defecto: { email: '', phone: '', address: '', city: '', contactName: '', currency: 'USD', paymentTermsDays: 30, creditLimit: 0, active: true, group: 'General', notes: '', kind: 'customer' },
  },
  vendor: {
    columnas: ['name', 'ruc', 'email', 'phone', 'city', 'address', 'paymentTermsDays', 'group'],
    ejemplo: ['Importadora Pacífico', '0991234567001', 'ventas@pacifico.ec', '042345678', 'Guayaquil', 'Av. 9 de Octubre', '45', 'Nacionales'],
    defecto: { email: '', phone: '', address: '', city: '', contactName: '', currency: 'USD', paymentTermsDays: 30, creditLimit: 0, active: true, group: 'General', notes: '' },
  },
  item: {
    columnas: ['name', 'type', 'price', 'price2', 'price3', 'purchasePrice', 'maxDiscount', 'minStock', 'reorderPoint', 'group'],
    ejemplo: ['Mouse inalámbrico', 'inventory', '18', '16', '15', '9.5', '10', '5', '10', 'Accesorios'],
    defecto: { type: 'inventory', group: 'General', purchaseUnit: 'UND', salesUnit: 'UND', price: 0, price2: 0, price3: 0, maxDiscount: 0, purchasePrice: 0, preferredVendor: '', weight: 0, length: 0, width: 0, height: 0, costingMethod: 'average', standardCost: 0, minStock: 0, maxStock: 100000, reorderPoint: 0, description: '', specifications: '', active: true },
  },
};
const NUMERICOS = new Set(['paymentTermsDays', 'creditLimit', 'price', 'price2', 'price3', 'purchasePrice', 'maxDiscount', 'minStock', 'maxStock', 'reorderPoint', 'standardCost', 'weight', 'length', 'width', 'height']);

/** CSV con comas o punto y coma, con comillas. */
function parseCsv(texto: string): string[][] {
  const sep = (texto.split(/\r?\n/)[0] ?? '').split(';').length > (texto.split(/\r?\n/)[0] ?? '').split(',').length ? ';' : ',';
  const filas: string[][] = []; let fila: string[] = []; let campo = ''; let comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const ch = texto[i];
    if (comillas) { if (ch === '"' && texto[i + 1] === '"') { campo += '"'; i++; } else if (ch === '"') comillas = false; else campo += ch; continue; }
    if (ch === '"') comillas = true;
    else if (ch === sep) { fila.push(campo); campo = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && texto[i + 1] === '\n') i++; fila.push(campo); campo = ''; if (fila.some(x => x.trim())) filas.push(fila); fila = []; }
    else campo += ch;
  }
  fila.push(campo); if (fila.some(x => x.trim())) filas.push(fila);
  return filas;
}

const descargar = (nombre: string, contenido: string) => {
  const url = URL.createObjectURL(new Blob(['﻿' + contenido], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = nombre; a.click(); URL.revokeObjectURL(url);
};

/** Data Transfer Workbench (UTL002/UTL004) + exportador (UTL003). */
export default function DataTransferScreen() {
  const c = useCompany();
  const [tipo, setTipo] = useState<Tipo>('customer');
  const [csv, setCsv] = useState('');
  const [tablaExport, setTablaExport] = useState('OCRD');

  const filas = useMemo(() => {
    if (!csv.trim()) return [];
    const [cabecera, ...datos] = parseCsv(csv);
    const columnas = cabecera.map(h => h.trim());
    return datos.map(valores => {
      const fila: Record<string, unknown> = { ...PLANTILLA[tipo].defecto };
      columnas.forEach((col, i) => {
        const v = (valores[i] ?? '').trim();
        if (v === '') return;
        fila[col] = NUMERICOS.has(col) ? Number(v.replace(',', '.')) : col === 'active' ? !/^(no|false|0)$/i.test(v) : v;
      });
      const r = commandSchema.safeParse({ action: tipo, data: fila });
      return { fila, error: r.success ? '' : r.error.issues.map(x => mensajeValidacion(x)).join('; ') };
    });
  }, [csv, tipo]);
  const errores = filas.filter(f => f.error).length;

  const importar = async () => { try { await c.save({ action: 'importMasterData', data: { kind: tipo, rows: filas.map(f => f.fila) } }); setCsv(''); } catch { /* error visible */ } };
  const exportar = () => {
    const t = TABLAS.find(x => x.nombre === tablaExport); if (!t) return;
    const datos = t.filas(c.data); const cols = [...new Set(datos.flatMap(f => Object.keys(f)))];
    const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    descargar(`${t.nombre}.csv`, [cols.map(q).join(';'), ...datos.map(f => cols.map(col => q(f[col])).join(';'))].join('\r\n'));
  };

  return (
    <Screen title="Data Transfer Workbench">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        En una implementación real nadie digita mil clientes a mano: se cargan desde Excel. Descarga la plantilla, llénala en Excel,
        guárdala como CSV y pégala aquí. <strong>Cada fila se valida con las mismas reglas que el ingreso manual</strong>; si una falla, no se importa ninguna.
      </p>
      <section className="space-y-2 border border-[#999] bg-white p-2">
        <h3 className="font-bold text-[#003366]">Importar datos maestros</h3>
        <div className="flex flex-wrap items-end gap-2">
          <Field label="Objeto"><select className={inputClass} value={tipo} onChange={e => setTipo(e.target.value as Tipo)}>{(Object.keys(ETIQUETA) as Tipo[]).map(t => <option key={t} value={t}>{ETIQUETA[t]}</option>)}</select></Field>
          <button type="button" className={buttonClass} onClick={() => descargar(`plantilla-${ETIQUETA[tipo].toLowerCase()}.csv`, `${PLANTILLA[tipo].columnas.join(';')}\r\n${PLANTILLA[tipo].ejemplo.join(';')}`)}>Descargar plantilla</button>
          <label className={`${buttonClass} cursor-pointer`}>Cargar archivo CSV<input type="file" accept=".csv,text/csv" className="sr-only" onChange={async e => { const file = e.target.files?.[0]; if (file) setCsv(await file.text()); }} /></label>
        </div>
        <Field label="O pega el contenido CSV"><textarea className={`${inputClass} min-h-28 font-mono`} value={csv} onChange={e => setCsv(e.target.value)} placeholder={`${PLANTILLA[tipo].columnas.join(';')}\n${PLANTILLA[tipo].ejemplo.join(';')}`} /></Field>
        {filas.length > 0 && (
          <>
            <p role="status">{filas.length} fila(s) · <strong className={errores ? 'text-[#c62828]' : 'text-[#2e7d32]'}>{errores ? `${errores} con errores: corrígelas antes de importar` : 'todas válidas'}</strong></p>
            <Table headers={['#', 'Nombre', 'Identificación / tipo', 'Validación']} rows={filas.map((f, i) => [i + 1, String(f.fila.name ?? ''), String(f.fila.ruc ?? f.fila.type ?? ''), f.error ? <span key="e" className="text-[#c62828]">{f.error}</span> : <span key="o" className="text-[#2e7d32]">✔ Lista</span>])} />
            <button type="button" className={`${buttonClass} font-bold`} disabled={c.saving || errores > 0 || filas.length > 200} onClick={importar}>Importar {filas.length} registro(s)</button>
          </>
        )}
      </section>
      <section className="flex flex-wrap items-end gap-2 border border-[#999] bg-white p-2">
        <h3 className="w-full font-bold text-[#003366]">Exportar a Excel (CSV)</h3>
        <Field label="Tabla"><select className={inputClass} value={tablaExport} onChange={e => setTablaExport(e.target.value)}>{TABLAS.map(t => <option key={t.nombre} value={t.nombre}>{t.nombre} · {t.descripcion}</option>)}</select></Field>
        <button type="button" className={buttonClass} onClick={exportar}>Descargar</button>
      </section>
    </Screen>
  );
}
