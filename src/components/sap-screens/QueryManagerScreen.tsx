'use client';
import { useEffect, useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { CONSULTAS_EJEMPLO, TABLAS, ejecutarConsulta, type Resultado } from '@/lib/query-engine';
import { Screen, Table, buttonClass, inputClass } from './SAPControls';

const CLAVE_GUARDADAS = 'b1_consultas_guardadas';
type Guardada = { titulo: string; sql: string };

function aCsv(r: Resultado) {
  const celda = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [r.columnas.map(celda).join(';'), ...r.filas.map(f => r.columnas.map(c => celda(f[c])).join(';'))].join('\r\n');
}

/** Query Manager: consultas tipo SQL sobre la empresa del estudiante, con tablas SAP reales. */
export default function QueryManagerScreen() {
  const c = useCompany();
  const [sql, setSql] = useState(CONSULTAS_EJEMPLO[0].sql);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState('');
  const [tablaAbierta, setTablaAbierta] = useState('OINV');
  const [guardadas, setGuardadas] = useState<Guardada[]>([]);
  useEffect(() => { try { setGuardadas(JSON.parse(localStorage.getItem(CLAVE_GUARDADAS) ?? '[]') as Guardada[]); } catch { setGuardadas([]); } }, []);

  // Columnas reales de cada tabla, tomadas de los datos de la empresa.
  const columnas = useMemo(() => Object.fromEntries(TABLAS.map(t => [t.nombre, [...new Set(t.filas(c.data).flatMap(f => Object.keys(f)))]])), [c.data]);

  const ejecutar = async (texto = sql) => {
    try {
      const res = ejecutarConsulta(c.data, texto);
      setResultado(res);
      setError('');
      try { await c.save({ action: 'query', data: { title: 'Consulta ejecutada', sql: texto } }); } catch { /* error silencioso en save */ }
    }
    catch (e) { setResultado(null); setError(e instanceof Error ? e.message : 'Consulta no válida.'); }
  };
  const guardar = async () => {
    const titulo = window.prompt('Nombre de la consulta:')?.trim() || 'Consulta guardada';
    const nuevas = [...guardadas.filter(g => g.titulo !== titulo), { titulo, sql }];
    setGuardadas(nuevas);
    try { localStorage.setItem(CLAVE_GUARDADAS, JSON.stringify(nuevas)); } catch { /* sin almacenamiento */ }
    try { await c.save({ action: 'query', data: { title: titulo, sql } }); } catch { /* error silencioso en save */ }
  };
  const exportar = () => {
    if (!resultado) return;
    const url = URL.createObjectURL(new Blob(['﻿' + aCsv(resultado)], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'consulta-sap.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Screen title="Query Manager">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        En SAP Business One los gerentes no esperan un informe: <strong>le preguntan a los datos</strong>. Escribe una consulta
        (solo <code>SELECT</code>) sobre las tablas de tu empresa. Usa los mismos nombres que SAP: <code>OCRD</code>, <code>OITM</code>, <code>OINV</code>, <code>JDT1</code>…
      </p>
      <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
        <div className="space-y-2">
          <label className="block">
            <span className="sr-only">Consulta SQL</span>
            <textarea
              value={sql}
              onChange={e => setSql(e.target.value)}
              onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); ejecutar(); } }}
              spellCheck={false}
              className={`${inputClass} min-h-40 font-mono text-[12px]`}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={`${buttonClass} font-bold`} onClick={() => ejecutar()}>▶ Ejecutar (Ctrl+Enter)</button>
            <button type="button" className={buttonClass} onClick={guardar}>Guardar consulta</button>
            <button type="button" className={buttonClass} disabled={!resultado?.filas.length} onClick={exportar}>Exportar a Excel (CSV)</button>
          </div>
          {error && <p role="alert" className="border border-[#c62828] bg-[#fdecea] p-2 text-[#a12622]">{error}</p>}
          {resultado && (
            <div className="space-y-1">
              <p role="status">{resultado.total} fila(s){resultado.truncado ? ' · se muestran las primeras 500' : ''}.</p>
              <Table headers={resultado.columnas} rows={resultado.filas.map(f => resultado.columnas.map(col => {
                const v = f[col];
                return typeof v === 'number' ? <span className="block text-right tabular-nums">{v.toLocaleString('es-EC', { maximumFractionDigits: 2 })}</span> : String(v ?? '');
              }))} />
            </div>
          )}
        </div>

        <aside className="space-y-3">
          <section className="border border-[#999] bg-white p-2">
            <h3 className="mb-1 font-bold text-[#003366]">Consultas de negocio</h3>
            <ul className="space-y-1">
              {CONSULTAS_EJEMPLO.map(ej => (
                <li key={ej.titulo}>
                  <button type="button" className="w-full text-left text-[#0055A5] hover:underline" title={ej.pregunta}
                    onClick={() => { setSql(ej.sql); ejecutar(ej.sql); }}>{ej.titulo}</button>
                  <p className="text-[#555]">{ej.pregunta}</p>
                </li>
              ))}
            </ul>
          </section>
          {guardadas.length > 0 && (
            <section className="border border-[#999] bg-white p-2">
              <h3 className="mb-1 font-bold text-[#003366]">Mis consultas</h3>
              <ul>{guardadas.map(g => <li key={g.titulo}><button type="button" className="text-[#0055A5] hover:underline" onClick={() => { setSql(g.sql); ejecutar(g.sql); }}>{g.titulo}</button></li>)}</ul>
            </section>
          )}
          <section className="border border-[#999] bg-white p-2">
            <h3 className="mb-1 font-bold text-[#003366]">Tablas</h3>
            <ul className="space-y-0.5">
              {TABLAS.map(t => (
                <li key={t.nombre}>
                  <button type="button" className="text-left" aria-expanded={tablaAbierta === t.nombre} onClick={() => setTablaAbierta(tablaAbierta === t.nombre ? '' : t.nombre)}>
                    <strong>{t.nombre}</strong> · {t.descripcion}
                  </button>
                  {tablaAbierta === t.nombre && (
                    <p className="pl-2 font-mono text-[10px] text-[#555]">
                      {columnas[t.nombre]?.length ? columnas[t.nombre].join(', ') : 'Sin registros todavía: crea documentos para ver sus columnas.'}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </Screen>
  );
}
