'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { CONSULTAS_EJEMPLO, TABLAS, ejecutarConsulta, type Resultado } from '@/lib/query-engine';
import { Screen, Table, buttonClass, inputClass, Field } from './FinixControls';
import {
  Code2,
  Table as TableIcon,
  Play,
  Save,
  Download,
  Search,
  Plus,
  Trash2,
  HelpCircle,
  FolderOpen,
  Filter,
  CheckCircle,
  SlidersHorizontal,
} from 'lucide-react';

const CLAVE_GUARDADAS = 'b1_consultas_guardadas';
type Guardada = { titulo: string; categoria: string; sql: string };

function aCsv(r: Resultado) {
  const celda = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [r.columnas.map(celda).join(';'), ...r.filas.map(f => r.columnas.map(c => celda(f[c])).join(';'))].join('\r\n');
}

/** Preprocesador para adaptar sintaxis canónica de SAP Business One (T0.Campo, T0 alias) */
function normalizarSqlSap(sqlOriginal: string, variables: Record<string, string>): string {
  let limpia = sqlOriginal;
  // Reemplazar [%0], [%1]...
  for (const [k, v] of Object.entries(variables)) {
    const regex = new RegExp(`\\[%${k}\\]`, 'g');
    // Si no tiene comillas y es texto alfanumérico no numérico, entrecomillar
    const valorFinal = /^\d+(\.\d+)?$/.test(v.trim()) ? v.trim() : `'${v.replace(/'/g, "''").trim()}'`;
    limpia = limpia.replace(regex, valorFinal);
  }
  // Eliminar prefijos de alias como T0., T1., T2.
  limpia = limpia.replace(/\b[A-Za-z]\d+\./g, '');
  // Eliminar alias de tablas tras el FROM: "FROM OINV T0" -> "FROM OINV"
  limpia = limpia.replace(/(FROM\s+[A-Za-z_]\w*)\s+[A-Za-z]\d+/gi, '$1');
  return limpia;
}

export default function QueryManagerScreen({ persistQueries = true }: { persistQueries?: boolean }) {
  const c = useCompany();
  const [activeTab, setActiveTab] = useState<'generator' | 'editor' | 'guardadas'>('generator');
  const [sql, setSql] = useState(CONSULTAS_EJEMPLO[0].sql);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState('');
  const [tablaAbierta, setTablaAbierta] = useState('OINV');
  const [guardadas, setGuardadas] = useState<Guardada[]>([]);

  // Estado del Query Generator Visual
  const [genTable, setGenTable] = useState('OINV');
  const [genColumns, setGenColumns] = useState<string[]>(['docNumber', 'cardName', 'date', 'total', 'status']);
  const [whereField, setWhereField] = useState('total');
  const [whereOp, setWhereOp] = useState('>');
  const [whereVal, setWhereVal] = useState('[%0]');
  const [orderField, setOrderField] = useState('total');
  const [orderDesc, setOrderDesc] = useState(true);
  const [limitVal, setLimitVal] = useState(100);

  // Modal de variables parametrizadas [%0], [%1]
  const [modalVariables, setModalVariables] = useState<{ open: boolean; vars: string[]; valores: Record<string, string>; sqlPendiente: string }>({
    open: false,
    vars: [],
    valores: {},
    sqlPendiente: '',
  });

  useEffect(() => {
    if (!persistQueries) return;
    try {
      const guardadasGuardadas = JSON.parse(localStorage.getItem(CLAVE_GUARDADAS) ?? '[]') as Guardada[];
      setGuardadas(guardadasGuardadas);
    } catch {
      setGuardadas([]);
    }
  }, [persistQueries]);

  // Columnas disponibles en tiempo de ejecución por tabla
  const columnasPorTabla = useMemo(() => {
    return Object.fromEntries(
      TABLAS.map(t => [t.nombre, [...new Set(t.filas(c.data).flatMap(f => Object.keys(f)))]])
    );
  }, [c.data]);

  // Detectar variables [%0], [%1] en un SQL
  const detectarVariables = (codigoSql: string): string[] => {
    const matches = codigoSql.match(/\[%(\d+)\]/g);
    if (!matches) return [];
    const indices = matches.map(m => m.replace(/\[%|\]/g, ''));
    return [...new Set(indices)].sort((a, b) => Number(a) - Number(b));
  };

  const ejecutarConParametros = (sqlAprobado: string, valoresParam: Record<string, string> = {}) => {
    try {
      const sqlLimpio = normalizarSqlSap(sqlAprobado, valoresParam);
      const res = ejecutarConsulta(c.data, sqlLimpio);
      setResultado(res);
      setError('');
      void c.save({ action: 'query', data: { title: 'Consulta ejecutada', sql: sqlAprobado } });
    } catch (e) {
      setResultado(null);
      setError(e instanceof Error ? e.message : 'Error en la ejecución de la consulta');
    }
  };

  const intentarEjecutar = (textoSql = sql) => {
    const vars = detectarVariables(textoSql);
    if (vars.length > 0) {
      // Abrir diálogo de parámetros interactivos canónico de SAP B1
      const defaultVals: Record<string, string> = {};
      vars.forEach(v => {
        defaultVals[v] = v === '0' ? '100' : '2026-01-01';
      });
      setModalVariables({
        open: true,
        vars,
        valores: defaultVals,
        sqlPendiente: textoSql,
      });
    } else {
      ejecutarConParametros(textoSql, {});
    }
  };

  // Generar SQL desde el Query Generator
  const construirQueryVisual = () => {
    const cols = genColumns.length > 0 ? genColumns.join(', ') : '*';
    let q = `SELECT ${cols}\nFROM ${genTable}`;
    if (whereField && whereVal.trim()) {
      q += `\nWHERE ${whereField} ${whereOp} ${whereVal.trim()}`;
    }
    if (orderField) {
      q += `\nORDER BY ${orderField} ${orderDesc ? 'DESC' : 'ASC'}`;
    }
    if (limitVal) {
      q += `\nLIMIT ${limitVal}`;
    }
    setSql(q);
    setActiveTab('editor');
    intentarEjecutar(q);
  };

  const guardar = async () => {
    const titulo = window.prompt('Nombre descriptivo de la consulta:')?.trim() || 'Consulta personalizada';
    const categoria = window.prompt('Categoría en Query Manager (Ventas, Compras, Finanzas, General):')?.trim() || 'General';
    const nuevas = [...guardadas.filter(g => g.titulo !== titulo), { titulo, categoria, sql }];
    setGuardadas(nuevas);
    try {
      if (persistQueries) localStorage.setItem(CLAVE_GUARDADAS, JSON.stringify(nuevas));
    } catch {
      /* sin almacenamiento */
    }
    try {
      await c.save({ action: 'query', data: { title: `${categoria} · ${titulo}`, sql } });
    } catch {
      /* save silencioso */
    }
  };

  const exportar = () => {
    if (!resultado) return;
    const url = URL.createObjectURL(new Blob(['\uFEFF' + aCsv(resultado)], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `consulta-sap-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Screen title="Query Manager & Query Generator · Generador Canónico de Consultas (SAP Business One)">
      <div className="space-y-3">
        {/* Banner descriptivo */}
        <div className="border-l-4 border-[#0055A5] bg-white p-3 rounded-r-xs shadow-xs text-xs">
          <p className="text-gray-700">
            En <strong>SAP Business One</strong>, el <strong>Query Generator</strong> permite construir consultas relacionales sobre las tablas del sistema
            (<code>OINV</code>, <code>OCRD</code>, <code>OITM</code>, <code>ORDR</code>, <code>OJDT</code>). Admite parámetros de usuario dinámicos con la sintaxis <code>[%0]</code>, <code>[%1]</code> que solicitan valores interactivos al usuario al momento de la ejecución.
          </p>
        </div>

        {/* ── BARRA DE PESTAÑAS: GENERADOR VISUAL / EDITOR SQL / GUARDADAS ── */}
        <div className="border-b border-[#a6b8cc] flex items-center gap-1 select-none pt-1">
          {[
            { id: 'generator', label: 'Query Generator Visual', icon: <SlidersHorizontal size={13} /> },
            { id: 'editor', label: 'Editor SQL Avanzado', icon: <Code2 size={13} /> },
            { id: 'guardadas', label: `Mis Consultas (${guardadas.length})`, icon: <FolderOpen size={13} /> },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-t-xs border-t-2 border-x transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#003366] border-t-[#0055a5] border-x-[#a6b8cc] border-b-white -mb-px shadow-xs'
                  : 'bg-[#e2eaf2] text-[#475569] border-transparent hover:bg-white/70'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── CUERPO SEGÚN PESTAÑA ACTIVA ── */}
        <div className="bg-white border border-[#a6b8cc] border-t-0 p-3 rounded-b-xs shadow-xs text-xs space-y-3">
          {/* PESTAÑA 1: QUERY GENERATOR VISUAL */}
          {activeTab === 'generator' && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="font-bold text-[#003366] text-xs flex items-center gap-1.5">
                  <SlidersHorizontal size={14} className="text-[#0055a5]" /> Generador Visual de Consultas (Query Generator SAP B1)
                </h3>
                <p className="text-gray-500 text-[11px]">
                  Arma tu consulta sin memorizar SQL seleccionando la tabla, columnas y filtros parametrizados.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Selección de Tabla */}
                <div className="space-y-2 border border-gray-200 p-2.5 rounded-xs bg-[#f8fafc]">
                  <span className="font-bold text-[#003366] block border-b border-gray-200 pb-1">
                    1. Tabla Principal (FROM)
                  </span>
                  <Field label="Tabla de SAP B1">
                    <select
                      className={inputClass}
                      value={genTable}
                      onChange={e => {
                        const nuevaT = e.target.value;
                        setGenTable(nuevaT);
                        const cols = columnasPorTabla[nuevaT] || [];
                        setGenColumns(cols.slice(0, 4));
                        setWhereField(cols[0] || '');
                        setOrderField(cols[0] || '');
                      }}
                    >
                      {TABLAS.map(t => (
                        <option key={t.nombre} value={t.nombre}>
                          {t.nombre} · {t.descripcion}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className="pt-2">
                    <span className="font-medium text-gray-600 block mb-1 text-[11px]">
                      Columnas disponibles ({columnasPorTabla[genTable]?.length || 0}):
                    </span>
                    <div className="max-h-36 overflow-y-auto border border-gray-300 rounded bg-white p-1.5 space-y-1">
                      {(columnasPorTabla[genTable] || []).map(col => {
                        const estaIncluida = genColumns.includes(col);
                        return (
                          <label key={col} className="flex items-center gap-1.5 text-[11px] cursor-pointer hover:bg-slate-50 p-0.5 rounded">
                            <input
                              type="checkbox"
                              checked={estaIncluida}
                              onChange={e => {
                                if (e.target.checked) setGenColumns(prev => [...prev, col]);
                                else setGenColumns(prev => prev.filter(c => c !== col));
                              }}
                            />
                            <span className="font-mono text-gray-800">{col}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Filtro WHERE y Parámetros */}
                <div className="space-y-2 border border-gray-200 p-2.5 rounded-xs bg-[#f8fafc]">
                  <span className="font-bold text-[#003366] block border-b border-gray-200 pb-1">
                    2. Condiciones de Filtro (WHERE)
                  </span>
                  <Field label="Campo de Filtro">
                    <select
                      className={inputClass}
                      value={whereField}
                      onChange={e => setWhereField(e.target.value)}
                    >
                      {(columnasPorTabla[genTable] || []).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>

                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Operador">
                      <select className={inputClass} value={whereOp} onChange={e => setWhereOp(e.target.value)}>
                        <option value="=">=</option>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value=">=">&gt;=</option>
                        <option value="<=">&lt;=</option>
                        <option value="LIKE">LIKE</option>
                        <option value="<>">&lt;&gt; (Distinto)</option>
                      </select>
                    </Field>
                    <Field label="Valor o Variable SAP">
                      <input
                        className={`${inputClass} font-mono font-bold text-[#0055a5]`}
                        value={whereVal}
                        onChange={e => setWhereVal(e.target.value)}
                        placeholder="[%0] o valor fijo"
                      />
                    </Field>
                  </div>
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900">
                    💡 Si colocas <strong>[%0]</strong>, el sistema abrirá la ventana emergente oficial de SAP B1 pidiendo el valor al ejecutar.
                  </div>
                </div>

                {/* 3. Orden y Límite */}
                <div className="space-y-2 border border-gray-200 p-2.5 rounded-xs bg-[#f8fafc]">
                  <span className="font-bold text-[#003366] block border-b border-gray-200 pb-1">
                    3. Ordenación y Límite (ORDER BY)
                  </span>
                  <Field label="Ordenar por">
                    <select className={inputClass} value={orderField} onChange={e => setOrderField(e.target.value)}>
                      {(columnasPorTabla[genTable] || []).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Sentido">
                    <select className={inputClass} value={orderDesc ? 'desc' : 'asc'} onChange={e => setOrderDesc(e.target.value === 'desc')}>
                      <option value="desc">Descendente (Mayor a menor)</option>
                      <option value="asc">Ascendente (Menor a mayor)</option>
                    </select>
                  </Field>
                  <Field label="Límite de filas">
                    <input
                      type="number"
                      min={1}
                      max={500}
                      className={inputClass}
                      value={limitVal}
                      onChange={e => setLimitVal(Number(e.target.value))}
                    />
                  </Field>
                  <div className="pt-2 text-right">
                    <button
                      type="button"
                      onClick={construirQueryVisual}
                      className="px-4 py-2 bg-[#0055a5] hover:bg-[#004080] text-white font-bold rounded text-xs flex items-center gap-1.5 ml-auto cursor-pointer shadow-xs"
                    >
                      <Play size={13} /> Generar y Ejecutar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 2: EDITOR SQL AVANZADO */}
          {activeTab === 'editor' && (
            <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
              <div className="space-y-2">
                <label className="block">
                  <span className="sr-only">Consulta SQL</span>
                  <textarea
                    value={sql}
                    onChange={e => setSql(e.target.value)}
                    onKeyDown={e => {
                      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault();
                        intentarEjecutar();
                      }
                    }}
                    spellCheck={false}
                    className={`${inputClass} min-h-36 font-mono text-[12px] bg-[#1e293b] text-[#f8fafc] p-2.5 rounded-xs`}
                    placeholder="SELECT * FROM OINV WHERE total > [%0] ORDER BY total DESC"
                  />
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-[#0055a5] hover:bg-[#004080] text-white font-bold rounded text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                    onClick={() => intentarEjecutar()}
                  >
                    <Play size={13} /> Ejecutar Consulta (Ctrl+Enter)
                  </button>
                  <button
                    type="button"
                    className={buttonClass}
                    onClick={guardar}
                  >
                    <Save size={13} /> Guardar Consulta en Catálogo
                  </button>
                  <button
                    type="button"
                    className={buttonClass}
                    disabled={!resultado?.filas.length}
                    onClick={exportar}
                  >
                    <Download size={13} /> Exportar a Excel (.csv)
                  </button>
                </div>
              </div>

              {/* Panel Lateral de Consultas de Negocio */}
              <aside className="space-y-2 text-xs">
                <section className="border border-gray-300 bg-[#f8fafc] p-2.5 rounded-xs">
                  <h4 className="font-bold text-[#003366] text-xs mb-1 flex items-center gap-1">
                    <TableIcon size={12} /> Consultas Estándar de Negocio
                  </h4>
                  <ul className="space-y-1.5 text-[11px]">
                    {CONSULTAS_EJEMPLO.map(ej => (
                      <li key={ej.titulo} className="border-b border-gray-200 pb-1 last:border-0">
                        <button
                          type="button"
                          className="w-full text-left font-semibold text-[#0055a5] hover:underline"
                          onClick={() => {
                            setSql(ej.sql);
                            intentarEjecutar(ej.sql);
                          }}
                        >
                          {ej.titulo}
                        </button>
                        <p className="text-gray-500 text-[10px]">{ej.pregunta}</p>
                      </li>
                    ))}
                    <li className="border-b border-gray-200 pb-1">
                      <button
                        type="button"
                        className="w-full text-left font-semibold text-emerald-700 hover:underline"
                        onClick={() => {
                          const queryParam = "SELECT cardCode, cardName, creditLimit, balance\nFROM OCRD\nWHERE balance > [%0]\nORDER BY balance DESC";
                          setSql(queryParam);
                          intentarEjecutar(queryParam);
                        }}
                      >
                        ⚡ Saldo mayor a variable [%0]
                      </button>
                      <p className="text-gray-500 text-[10px]">Ejemplo parametrizado oficial SAP</p>
                    </li>
                  </ul>
                </section>
              </aside>
            </div>
          )}

          {/* PESTAÑA 3: MIS CONSULTAS GUARDADAS */}
          {activeTab === 'guardadas' && (
            <div className="space-y-3">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="font-bold text-[#003366] text-xs flex items-center gap-1.5">
                  <FolderOpen size={14} className="text-[#0055a5]" /> Catálogo de Consultas Guardadas (Query Manager)
                </h3>
              </div>
              {guardadas.length === 0 ? (
                <div className="p-4 bg-gray-50 text-gray-500 rounded text-center">
                  No tienes consultas guardadas en el catálogo. Escribe una consulta en el editor y haz clic en &quot;Guardar Consulta&quot;.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {guardadas.map(g => (
                    <div key={g.titulo} className="border border-gray-200 p-2.5 rounded-xs bg-[#f8fafc] space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#003366]">
                        <span>{g.titulo}</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                          {g.categoria || 'General'}
                        </span>
                      </div>
                      <pre className="p-1.5 bg-gray-100 text-gray-700 font-mono text-[10px] rounded overflow-x-auto max-h-16">
                        {g.sql}
                      </pre>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          className="px-2 py-0.5 bg-[#0055a5] text-white rounded text-[10.5px] cursor-pointer"
                          onClick={() => {
                            setSql(g.sql);
                            setActiveTab('editor');
                            intentarEjecutar(g.sql);
                          }}
                        >
                          Cargar y Ejecutar
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800 text-[10.5px] flex items-center gap-0.5"
                          onClick={() => {
                            const nuevas = guardadas.filter(x => x.titulo !== g.titulo);
                            setGuardadas(nuevas);
                            if (persistQueries) localStorage.setItem(CLAVE_GUARDADAS, JSON.stringify(nuevas));
                          }}
                        >
                          <Trash2 size={11} /> Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MENSAJE DE ERROR SI OCURRE */}
          {error && (
            <p role="alert" className="border border-[#c62828] bg-[#fdecea] p-2 rounded text-[#a12622] text-xs">
              {error}
            </p>
          )}

          {/* ── MATRIZ DE RESULTADOS CANÓNICA DE SAP B1 ── */}
          {resultado && (
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-[#003366] text-xs">
                  Resultados de la Consulta: <strong>{resultado.total} fila(s) devuelta(s)</strong>
                  {resultado.truncado ? ' · Mostrando primeras 500' : ''}
                </span>
                <button
                  type="button"
                  onClick={exportar}
                  className="px-2 py-0.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Download size={11} /> Exportar matriz a Excel
                </button>
              </div>

              <div className="border border-[#b0c2d4] rounded-xs overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#e9edf2] text-[#003366] border-b border-[#b0c2d4] font-bold text-[11px] sticky top-0">
                    <tr>
                      <th className="p-2 border-r border-[#cbd8e5] w-10 text-center">#</th>
                      {resultado.columnas.map(col => (
                        <th key={col} className="p-2 border-r border-[#cbd8e5]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.filas.map((f, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-gray-100 hover:bg-[#FFFDE7] ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'
                        }`}
                      >
                        <td className="p-2 border-r border-[#cbd8e5] text-center font-mono text-gray-400 text-[10.5px]">
                          {idx + 1}
                        </td>
                        {resultado.columnas.map(col => {
                          const v = f[col];
                          const esNum = typeof v === 'number';
                          return (
                            <td
                              key={col}
                              className={`p-2 border-r border-[#cbd8e5] ${
                                esNum ? 'text-right font-mono text-gray-900 font-semibold' : 'text-gray-800'
                              }`}
                            >
                              {esNum
                                ? v.toLocaleString('es-EC', { maximumFractionDigits: 2 })
                                : String(v ?? '—')}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── MODAL INTERACTIVO DE VARIABLES SAP B1 [%0], [%1] ── */}
        {modalVariables.open && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border-2 border-[#0055a5] rounded-xs shadow-xl max-w-md w-full p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h4 className="font-bold text-[#003366] text-sm flex items-center gap-1.5">
                  <Filter size={15} className="text-[#0055a5]" />
                  Variables de Consulta · SAP Business One
                </h4>
              </div>
              <p className="text-gray-600 text-[11px]">
                La consulta contiene variables de reemplazo dinámico (<code>[%0]</code>, <code>[%1]</code>...). Introduce los valores requeridos para ejecutar:
              </p>
              <div className="space-y-2">
                {modalVariables.vars.map(v => (
                  <div key={v} className="grid grid-cols-3 gap-2 items-center">
                    <label className="font-mono font-bold text-[#003366]">Variable [%{v}]:</label>
                    <input
                      type="text"
                      className={`col-span-2 ${inputClass} font-mono font-bold bg-[#fffde7]`}
                      value={modalVariables.valores[v] || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setModalVariables(prev => ({
                          ...prev,
                          valores: { ...prev.valores, [v]: val },
                        }));
                      }}
                      placeholder="Ej. 100 o 'open'"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setModalVariables(prev => ({ ...prev, open: false }))}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const params = modalVariables.valores;
                    const sqlTarget = modalVariables.sqlPendiente;
                    setModalVariables(prev => ({ ...prev, open: false }));
                    ejecutarConParametros(sqlTarget, params);
                  }}
                  className="px-4 py-1.5 bg-[#0055a5] hover:bg-[#004080] text-white font-bold rounded text-xs cursor-pointer shadow-xs"
                >
                  Aceptar y Ejecutar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}
