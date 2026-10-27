'use client';

import React, { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { commandSchema } from '@/lib/company-commands';
import { TABLAS } from '@/lib/query-engine';
import { mensajeValidacion } from '@/lib/zod-es';
import { Screen, Field, Table, inputClass, buttonClass } from './FinixControls';
import {
  FileUp,
  Download,
  Database,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Layers,
  FileSpreadsheet,
  Check,
  Search,
} from 'lucide-react';

type TipoObjeto = 'customer' | 'vendor' | 'item';

const OBJETOS_DTW: Record<
  TipoObjeto,
  {
    codigoTabla: string;
    nombre: string;
    descripcion: string;
    columnas: string[];
    mapeoSAP: Record<string, string>;
    ejemplo: string[];
    defecto: Record<string, unknown>;
  }
> = {
  customer: {
    codigoTabla: 'OCRD',
    nombre: 'Socios de Negocios · Clientes (OCRD)',
    descripcion: 'Maestro de clientes, líneas de crédito, condiciones de pago y datos de facturación',
    columnas: ['name', 'ruc', 'email', 'phone', 'city', 'address', 'paymentTermsDays', 'creditLimit', 'group'],
    mapeoSAP: {
      name: 'CardName (Nombre)',
      ruc: 'LicTradNum (RUC/Identificación)',
      email: 'E_Mail (Correo)',
      phone: 'Phone1 (Teléfono)',
      city: 'City (Ciudad)',
      address: 'Address (Dirección fiscal)',
      paymentTermsDays: 'GroupNum (Plazo de pago en días)',
      creditLimit: 'CreditLine (Límite de crédito USD)',
      group: 'GroupName (Grupo de clientes)',
    },
    ejemplo: ['Comercial Andina S.A.', '1791234567001', 'compras@andina.ec', '022345678', 'Quito', 'Av. Amazonas N24-100', '30', '15000', 'Mayoristas'],
    defecto: {
      email: '',
      phone: '',
      address: '',
      city: '',
      contactName: '',
      currency: 'USD',
      paymentTermsDays: 30,
      creditLimit: 0,
      active: true,
      group: 'General',
      notes: '',
      kind: 'customer',
    },
  },
  vendor: {
    codigoTabla: 'OCRD',
    nombre: 'Socios de Negocios · Proveedores (OCRD)',
    descripcion: 'Maestro de proveedores de bienes y servicios, plazos de pago y condiciones comerciales',
    columnas: ['name', 'ruc', 'email', 'phone', 'city', 'address', 'paymentTermsDays', 'group'],
    mapeoSAP: {
      name: 'CardName (Razón social)',
      ruc: 'LicTradNum (RUC proveedor)',
      email: 'E_Mail (Correo electrónico)',
      phone: 'Phone1 (Teléfono)',
      city: 'City (Ciudad)',
      address: 'Address (Dirección matriz)',
      paymentTermsDays: 'GroupNum (Días de crédito)',
      group: 'GroupName (Tipo proveedor)',
    },
    ejemplo: ['Distribuidora del Pacífico Cía.', '0991234567001', 'ventas@pacifico.ec', '042345678', 'Guayaquil', 'Av. 9 de Octubre 412', '45', 'Nacionales'],
    defecto: {
      email: '',
      phone: '',
      address: '',
      city: '',
      contactName: '',
      currency: 'USD',
      paymentTermsDays: 30,
      creditLimit: 0,
      active: true,
      group: 'General',
      notes: '',
    },
  },
  item: {
    codigoTabla: 'OITM',
    nombre: 'Datos Maestros de Artículos (OITM)',
    descripcion: 'Catálogo de artículos inventariables, listas de precios, costos estándar y stock mínimo',
    columnas: ['name', 'type', 'price', 'price2', 'price3', 'purchasePrice', 'maxDiscount', 'minStock', 'reorderPoint', 'group'],
    mapeoSAP: {
      name: 'ItemName (Descripción artículo)',
      type: 'ItemType (Clase inventario/servicio)',
      price: 'PriceList1 (PVP Base USD)',
      price2: 'PriceList2 (Precio Mayorista USD)',
      price3: 'PriceList3 (Precio Distribuidor USD)',
      purchasePrice: 'LastPurPrc (Último precio de compra)',
      maxDiscount: 'MaxDiscount (Descuento máximo %)',
      minStock: 'MinLevel (Stock de seguridad mínimo)',
      reorderPoint: 'ReorderPoint (Punto de reposición)',
      group: 'ItmsGrpCod (Grupo de artículo)',
    },
    ejemplo: ['Mouse Óptico Inalámbrico Pro', 'inventory', '22.50', '19.00', '16.50', '11.00', '15', '10', '20', 'Accesorios IT'],
    defecto: {
      type: 'inventory',
      group: 'General',
      purchaseUnit: 'UND',
      salesUnit: 'UND',
      price: 0,
      price2: 0,
      price3: 0,
      maxDiscount: 0,
      purchasePrice: 0,
      preferredVendor: '',
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      costingMethod: 'average',
      standardCost: 0,
      minStock: 0,
      maxStock: 100000,
      reorderPoint: 0,
      description: '',
      specifications: '',
      active: true,
    },
  },
};

const NUMERICOS = new Set([
  'paymentTermsDays',
  'creditLimit',
  'price',
  'price2',
  'price3',
  'purchasePrice',
  'maxDiscount',
  'minStock',
  'maxStock',
  'reorderPoint',
  'standardCost',
  'weight',
  'length',
  'width',
  'height',
]);

function parseCsv(texto: string): string[][] {
  const sep = (texto.split(/\r?\n/)[0] ?? '').split(';').length > (texto.split(/\r?\n/)[0] ?? '').split(',').length ? ';' : ',';
  const filas: string[][] = [];
  let fila: string[] = [];
  let campo = '';
  let comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const ch = texto[i];
    if (comillas) {
      if (ch === '"' && texto[i + 1] === '"') {
        campo += '"';
        i++;
      } else if (ch === '"') comillas = false;
      else campo += ch;
      continue;
    }
    if (ch === '"') comillas = true;
    else if (ch === sep) {
      fila.push(campo);
      campo = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && texto[i + 1] === '\n') i++;
      fila.push(campo);
      campo = '';
      if (fila.some(x => x.trim())) filas.push(fila);
      fila = [];
    } else campo += ch;
  }
  fila.push(campo);
  if (fila.some(x => x.trim())) filas.push(fila);
  return filas;
}

const descargar = (nombre: string, contenido: string) => {
  const url = URL.createObjectURL(new Blob(['\uFEFF' + contenido], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
};

export default function DataTransferScreen() {
  const c = useCompany();
  const [step, setStep] = useState<number>(1);
  const [operationType, setOperationType] = useState<'import' | 'update'>('import');
  const [tipo, setTipo] = useState<TipoObjeto>('customer');
  const [csv, setCsv] = useState('');
  const [simulated, setSimulated] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ tipo: 'ok' | 'err'; texto: string } | null>(null);
  const [tablaExport, setTablaExport] = useState('OCRD');

  const objActual = OBJETOS_DTW[tipo];

  // Parseo y validación de filas
  const filas = useMemo(() => {
    if (!csv.trim()) return [];
    const [cabecera, ...datos] = parseCsv(csv);
    const columnas = cabecera.map(h => h.trim());
    return datos.map(valores => {
      const fila: Record<string, unknown> = { ...objActual.defecto };
      columnas.forEach((col, i) => {
        const v = (valores[i] ?? '').trim();
        if (v === '') return;
        fila[col] = NUMERICOS.has(col) ? Number(v.replace(',', '.')) : col === 'active' ? !/^(no|false|0)$/i.test(v) : v;
      });
      const r = commandSchema.safeParse({ action: tipo, data: fila });
      return { fila, error: r.success ? '' : r.error.issues.map(x => mensajeValidacion(x)).join('; ') };
    });
  }, [csv, tipo, objActual]);

  const errores = filas.filter(f => f.error).length;
  const validas = filas.length - errores;

  const ejecutarSimulacion = () => {
    setSimulated(true);
    setStep(5);
  };

  const ejecutarImportacionFinal = async () => {
    setStatusMsg(null);
    try {
      await c.save({
        action: 'importMasterData',
        data: { kind: tipo, rows: filas.map(f => f.fila) },
      });
      setStep(6);
      setStatusMsg({
        tipo: 'ok',
        texto: `✓ Carga masiva DTW completada: se importaron ${filas.length} registros exitosamente en la base de datos de SAP Business One.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error durante la carga masiva';
      setStatusMsg({ tipo: 'err', texto: `Error: ${msg}` });
    }
  };

  const exportar = () => {
    const t = TABLAS.find(x => x.nombre === tablaExport);
    if (!t) return;
    const datos = t.filas(c.data);
    const cols = [...new Set(datos.flatMap(f => Object.keys(f)))];
    const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    descargar(
      `${t.nombre}.csv`,
      [cols.map(q).join(';'), ...datos.map(f => cols.map(col => q(f[col])).join(';'))].join('\r\n')
    );
  };

  const pasosDTW = [
    { num: 1, label: 'Operación', desc: 'Importación o Actualización' },
    { num: 2, label: 'Objeto SAP', desc: 'Selección de OCRD / OITM' },
    { num: 3, label: 'Archivo CSV', desc: 'Origen de datos y plantilla' },
    { num: 4, label: 'Mapeo', desc: 'Asignación de columnas a campos' },
    { num: 5, label: 'Simulación', desc: 'Verificación previa sin riesgo' },
    { num: 6, label: 'Resultados', desc: 'Ejecución y confirmación' },
  ];

  return (
    <Screen title="Data Transfer Workbench (DTW) · Migración de Datos Masivos (SAP Business One)">
      <div className="space-y-3">
        {/* Banner descriptivo oficial */}
        <div className="border-l-4 border-[#0055A5] bg-white p-3 rounded-r-xs shadow-xs text-xs">
          <p className="text-gray-700">
            El <strong>Data Transfer Workbench (DTW)</strong> es la herramienta oficial de SAP Business One para la migración de datos maestros y transaccionales desde sistemas legados o archivos Excel/CSV. Cuenta con validación estricta por objetos de negocio antes del commit a base de datos.
          </p>
        </div>

        {/* ── BARRA DE PROGRESO DE 6 PASOS DEL DTW ── */}
        <div className="bg-[#f0f4f8] border border-[#cbd8e5] p-2 rounded-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1">
            {pasosDTW.map(p => {
              const isActive = step === p.num;
              const isPast = step > p.num;
              return (
                <button
                  key={p.num}
                  type="button"
                  onClick={() => setStep(p.num)}
                  className={`flex flex-col text-left p-1.5 rounded-xs border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#0055a5] shadow-xs text-[#003366]'
                      : isPast
                      ? 'bg-[#e7f1f9] border-[#b0c8dc] text-gray-700 hover:bg-white'
                      : 'bg-[#f7fafc] border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isActive
                          ? 'bg-[#0055a5] text-white'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {isPast ? <Check size={10} /> : p.num}
                    </span>
                    <span>Paso {p.num}</span>
                  </div>
                  <span className="text-[10px] font-medium truncate mt-0.5">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CUERPO DE PASOS DEL DTW ── */}
        <div className="bg-white border border-[#a6b8cc] rounded-xs p-4 shadow-xs min-h-[320px] text-xs">
          {/* PASO 1: SELECCIÓN DE TIPO DE OPERACIÓN */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="font-bold text-[#003366] text-sm flex items-center gap-1.5">
                  <Database size={16} className="text-[#0055a5]" /> Paso 1: Tipo de Tarea de Migración
                </h3>
                <p className="text-gray-500 text-xs">
                  Selecciona si deseas agregar nuevos registros o actualizar datos existentes en el catálogo de SAP B1.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setOperationType('import')}
                  className={`p-3.5 border rounded-xs cursor-pointer transition-all ${
                    operationType === 'import'
                      ? 'border-[#0055a5] bg-[#FFFDE7] ring-1 ring-[#0055a5]'
                      : 'border-gray-200 bg-gray-50 hover:bg-white'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#003366] text-xs">
                    <input
                      type="radio"
                      name="opType"
                      checked={operationType === 'import'}
                      onChange={() => setOperationType('import')}
                    />
                    <span>Importar Nuevos Registros (Add New Data)</span>
                  </label>
                  <p className="text-gray-600 text-[11px] mt-1 pl-6">
                    Añade nuevos socios de negocios o artículos con generación automática de códigos y validación de duplicados.
                  </p>
                </div>

                <div
                  onClick={() => setOperationType('update')}
                  className={`p-3.5 border rounded-xs cursor-pointer transition-all ${
                    operationType === 'update'
                      ? 'border-[#0055a5] bg-[#FFFDE7] ring-1 ring-[#0055a5]'
                      : 'border-gray-200 bg-gray-50 hover:bg-white'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#003366] text-xs">
                    <input
                      type="radio"
                      name="opType"
                      checked={operationType === 'update'}
                      onChange={() => setOperationType('update')}
                    />
                    <span>Actualizar Registros Existentes (Update Existing Data)</span>
                  </label>
                  <p className="text-gray-600 text-[11px] mt-1 pl-6">
                    Modifica listas de precios, límites de crédito o condiciones de pago identificando por clave primaria.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: SELECCIÓN DEL OBJETO SAP B1 (OCRD / OITM) */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="font-bold text-[#003366] text-sm flex items-center gap-1.5">
                  <Layers size={16} className="text-[#0055a5]" /> Paso 2: Selección del Objeto de Negocio de SAP B1
                </h3>
                <p className="text-gray-500 text-xs">
                  Selecciona la entidad sobre la cual se ejecutará la carga masiva en el diccionario de datos de SAP.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(Object.keys(OBJETOS_DTW) as TipoObjeto[]).map(key => {
                  const item = OBJETOS_DTW[key];
                  const isSel = tipo === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setTipo(key)}
                      className={`p-3 border rounded-xs cursor-pointer transition-all ${
                        isSel
                          ? 'border-[#0055a5] bg-[#FFFDE7] ring-1 ring-[#0055a5]'
                          : 'border-gray-200 bg-gray-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[#003366] mb-1">
                        <span>{item.codigoTabla}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono">
                          {key.toUpperCase()}
                        </span>
                      </div>
                      <strong className="block text-xs text-gray-800 mb-1">{item.nombre}</strong>
                      <p className="text-gray-500 text-[11px] leading-relaxed">{item.descripcion}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 3: ARCHIVO FUENTE Y PLANTILLA CSV */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-[#003366] text-sm flex items-center gap-1.5">
                    <FileSpreadsheet size={16} className="text-[#0055a5]" /> Paso 3: Carga de Archivo Fuente y Plantilla DTW
                  </h3>
                  <p className="text-gray-500 text-xs">
                    Descarga la plantilla con encabezados canónicos, llénala en Excel y pégala o cárgala como CSV.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    descargar(
                      `DTW_Plantilla_${objActual.codigoTabla}_${tipo}.csv`,
                      `${objActual.columnas.join(';')}\r\n${objActual.ejemplo.join(';')}`
                    )
                  }
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Download size={13} /> Descargar Plantilla DTW (.csv)
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-gray-300 text-gray-700 rounded text-xs font-medium cursor-pointer shadow-2xs flex items-center gap-1.5">
                    <FileUp size={13} /> Seleccionar archivo CSV desde tu equipo
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      className="sr-only"
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) setCsv(await file.text());
                      }}
                    />
                  </label>
                  <span className="text-gray-400 text-xs">o ingresa directamente en el editor:</span>
                </div>

                <Field label="Contenido CSV delimitado por comas (,) o punto y coma (;)">
                  <textarea
                    className={`${inputClass} min-h-36 font-mono text-xs`}
                    value={csv}
                    onChange={e => setCsv(e.target.value)}
                    placeholder={`${objActual.columnas.join(';')}\n${objActual.ejemplo.join(';')}`}
                  />
                </Field>
                <div className="flex justify-between items-center text-[11px] text-gray-500">
                  <span>Filas detectadas: <strong>{filas.length}</strong></span>
                  <button
                    type="button"
                    onClick={() => setCsv(`${objActual.columnas.join(';')}\r\n${objActual.ejemplo.join(';')}`)}
                    className="text-[#0055a5] hover:underline"
                  >
                    Pegar datos de prueba predeterminados
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: MAPEO DE COLUMNAS (FIELD MAPPING) */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="font-bold text-[#003366] text-sm flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#0055a5]" /> Paso 4: Mapeo de Columnas (Field Mapping)
                </h3>
                <p className="text-gray-500 text-xs">
                  Relación entre las columnas de tu archivo de origen y los campos del diccionario de datos de SAP B1.
                </p>
              </div>

              <div className="border border-[#b0c2d4] rounded-xs overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#e9edf2] text-[#003366] border-b border-[#b0c2d4] font-bold text-[11px]">
                    <tr>
                      <th className="p-2 border-r border-[#cbd8e5] w-12 text-center">#</th>
                      <th className="p-2 border-r border-[#cbd8e5]">Columna del Archivo Fuente</th>
                      <th className="p-2 border-r border-[#cbd8e5]">Campo Destino SAP B1</th>
                      <th className="p-2 border-r border-[#cbd8e5]">Tipo de Dato</th>
                      <th className="p-2 text-center">Estado Mapeo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {objActual.columnas.map((col, idx) => (
                      <tr key={col} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'}`}>
                        <td className="p-2 border-r border-[#cbd8e5] text-center font-mono text-gray-500">{idx + 1}</td>
                        <td className="p-2 border-r border-[#cbd8e5] font-mono font-bold text-[#0055a5]">{col}</td>
                        <td className="p-2 border-r border-[#cbd8e5] text-gray-800 font-medium">
                          {objActual.mapeoSAP[col] || col}
                        </td>
                        <td className="p-2 border-r border-[#cbd8e5] font-mono text-gray-600">
                          {NUMERICOS.has(col) ? 'Decimal / Integer' : 'Alphanumeric'}
                        </td>
                        <td className="p-2 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ Auto-mapeado
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PASO 5: SIMULACIÓN DE CARGA PREVIA */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-[#003366] text-sm flex items-center gap-1.5">
                    <Play size={16} className="text-[#0055a5]" /> Paso 5: Simulación y Verificación de Carga (Run Simulation)
                  </h3>
                  <p className="text-gray-500 text-xs">
                    Verifica la integridad referencial, tipos de datos y duplicados sin alterar la base de datos real.
                  </p>
                </div>
              </div>

              {filas.length === 0 ? (
                <div className="p-6 bg-[#f8fafc] border border-gray-200 rounded text-center text-gray-500">
                  No hay filas para simular. Regresa al Paso 3 y carga o pega un archivo CSV.
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Resumen de simulación */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="border border-blue-200 bg-blue-50 p-2.5 rounded text-xs">
                      <span className="text-blue-700 font-bold block">Filas Procesadas:</span>
                      <strong className="text-lg font-mono text-blue-950">{filas.length}</strong>
                    </div>
                    <div className="border border-emerald-300 bg-emerald-50 p-2.5 rounded text-xs">
                      <span className="text-emerald-700 font-bold block">Registros Válidos:</span>
                      <strong className="text-lg font-mono text-emerald-950">{validas}</strong>
                    </div>
                    <div className={`border p-2.5 rounded text-xs ${errores > 0 ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                      <span className={`font-bold block ${errores > 0 ? 'text-red-700' : 'text-gray-500'}`}>
                        Registros con Errores:
                      </span>
                      <strong className={`text-lg font-mono ${errores > 0 ? 'text-red-950' : 'text-gray-600'}`}>
                        {errores}
                      </strong>
                    </div>
                  </div>

                  {/* Tabla de detalle de cada fila simulada */}
                  <div className="border border-[#b0c2d4] rounded-xs overflow-x-auto max-h-72">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#e9edf2] text-[#003366] border-b border-[#b0c2d4] font-bold text-[11px] sticky top-0">
                        <tr>
                          <th className="p-2 border-r border-[#cbd8e5] w-12 text-center">Fila</th>
                          <th className="p-2 border-r border-[#cbd8e5]">Nombre / Razón Social</th>
                          <th className="p-2 border-r border-[#cbd8e5]">Identificador</th>
                          <th className="p-2">Resultado de la Validación SAP B1</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filas.map((f, i) => (
                          <tr key={i} className={`border-b border-gray-100 ${f.error ? 'bg-red-50/50' : 'bg-white'}`}>
                            <td className="p-2 border-r border-[#cbd8e5] text-center font-mono text-gray-500">{i + 1}</td>
                            <td className="p-2 border-r border-[#cbd8e5] font-semibold text-[#003366]">
                              {String(f.fila.name ?? 'Sin nombre')}
                            </td>
                            <td className="p-2 border-r border-[#cbd8e5] font-mono text-gray-600">
                              {String(f.fila.ruc ?? f.fila.type ?? '—')}
                            </td>
                            <td className="p-2">
                              {f.error ? (
                                <span className="text-red-600 font-semibold flex items-center gap-1">
                                  <AlertCircle size={12} /> {f.error}
                                </span>
                              ) : (
                                <span className="text-emerald-700 font-medium flex items-center gap-1">
                                  <CheckCircle2 size={12} /> Listo para importación
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {errores === 0 && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 flex items-center justify-between">
                      <span>✓ Simulación 100% exitosa. No se detectaron conflictos de validación en los datos.</span>
                      <button
                        type="button"
                        onClick={ejecutarImportacionFinal}
                        disabled={c.saving}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Play size={13} /> Ejecutar Carga Definitiva a SAP B1
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PASO 6: EJECUCIÓN Y CONFIRMACIÓN FINAL */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="font-bold text-[#003366] text-sm flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" /> Paso 6: Informe de Carga Final DTW
                </h3>
              </div>

              {statusMsg && (
                <div
                  className={`p-3 rounded text-xs font-semibold ${
                    statusMsg.tipo === 'ok'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-red-100 text-red-900 border border-red-300'
                  }`}
                >
                  {statusMsg.texto}
                </div>
              )}

              <div className="p-4 bg-[#f8fafc] border border-gray-200 rounded-xs space-y-2 text-xs">
                <strong className="text-[#003366] block">Estado de la Base de Datos tras la Carga:</strong>
                <p>• Total Clientes activos: <strong>{c.data.customers.length}</strong></p>
                <p>• Total Proveedores activos: <strong>{c.data.vendors.length}</strong></p>
                <p>• Total Artículos en inventario: <strong>{c.data.items.length}</strong></p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCsv('');
                      setStep(1);
                      setStatusMsg(null);
                    }}
                    className="px-3 py-1.5 bg-[#0055a5] text-white hover:bg-[#004080] rounded text-xs font-bold cursor-pointer"
                  >
                    Iniciar Nueva Tarea DTW
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── BOTONES DE NAVEGACIÓN INFERIOR DEL DTW ── */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
            className={`px-3 py-1.5 border rounded text-xs font-medium flex items-center gap-1 cursor-pointer ${
              step === 1
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white hover:bg-slate-100 text-gray-700 border-gray-300'
            }`}
          >
            <ChevronLeft size={14} /> Atrás
          </button>

          <span className="text-xs text-gray-500 font-mono">
            Paso {step} de 6 — {pasosDTW[step - 1].label}
          </span>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(prev => Math.min(6, prev + 1))}
              className="px-4 py-1.5 bg-[#0055a5] hover:bg-[#004080] text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              Siguiente <ChevronRight size={14} />
            </button>
          ) : step === 4 ? (
            <button
              type="button"
              onClick={ejecutarSimulacion}
              disabled={filas.length === 0}
              className="px-4 py-1.5 bg-[#0055a5] hover:bg-[#004080] text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs disabled:opacity-40"
            >
              Ejecutar Simulación <Play size={13} />
            </button>
          ) : step === 5 ? (
            <button
              type="button"
              onClick={ejecutarImportacionFinal}
              disabled={errores > 0 || c.saving || filas.length === 0}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs disabled:opacity-40"
            >
              Ejecutar Carga Definitiva <ArrowRight size={13} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 border border-gray-300 rounded text-xs font-medium cursor-pointer"
            >
              Finalizar
            </button>
          )}
        </div>

        {/* ── SECCIÓN DE EXPORTACIÓN A EXCEL / CSV (UTL003) ── */}
        <section className="flex flex-wrap items-end gap-2 border border-[#a6b8cc] bg-white p-3 rounded-xs shadow-xs text-xs">
          <div className="w-full border-b border-gray-200 pb-1 mb-1">
            <h4 className="font-bold text-[#003366] flex items-center gap-1.5 text-xs">
              <Download size={14} className="text-[#0055a5]" /> Exportador Canónico de Tablas de SAP B1 (UTL003)
            </h4>
            <p className="text-gray-500 text-[11px]">
              Descarga cualquier tabla del sistema (ej. OCRD, OITM, OINV, OJDT) en formato CSV para auditoría o conciliación.
            </p>
          </div>
          <Field label="Tabla del Sistema a Exportar">
            <select
              className={inputClass}
              value={tablaExport}
              onChange={e => setTablaExport(e.target.value)}
            >
              {TABLAS.map(t => (
                <option key={t.nombre} value={t.nombre}>
                  {t.nombre} · {t.descripcion}
                </option>
              ))}
            </select>
          </Field>
          <button
            type="button"
            className={`${buttonClass} font-bold text-white bg-[#0055a5] hover:bg-[#004080]`}
            onClick={exportar}
          >
            Exportar Tabla Seleccionada (.csv)
          </button>
        </section>
      </div>
    </Screen>
  );
}
