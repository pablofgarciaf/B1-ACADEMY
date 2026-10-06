'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, Eye, FolderOpen, Lightbulb, XCircle } from 'lucide-react';

export interface CampoPractica { etiqueta: string; valor: string; pista?: string }
export interface GuiaPractica { title: string; menu_path?: string; instructions?: string[]; campos?: CampoPractica[] }

const MODULOS_SAP = [
  'Administración', 'Finanzas', 'Oportunidades', 'Ventas - Clientes', 'Compras - Proveedores', 'Socios de negocios',
  'Gestión de bancos', 'Inventario', 'Recursos', 'Producción', 'Planificación de necesidades', 'Servicio', 'Proyectos', 'Informes',
];
const SUBMENUS_GENERICOS = ['Definiciones', 'Datos maestros', 'Informes', 'Transacciones', 'Herramientas', 'Configuración'];

/** Normaliza para comparar: sin tildes, mayúsculas, espacios, símbolos de moneda; números y fechas por su valor. */
export function normalizar(valor: string): string {
  let v = valor.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  v = v.replace(/\b(usd|us\$)\b/g, '').replace(/[$\s]/g, '');
  const fecha = v.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
  if (fecha) return `${Number(fecha[1])}/${Number(fecha[2])}/${fecha[3].length === 2 ? `20${fecha[3]}` : fecha[3]}`;
  const num = v.replace(/%$/, '');
  if (/^-?[\d.,]+$/.test(num) && /\d/.test(num)) {
    const ultimo = Math.max(num.lastIndexOf('.'), num.lastIndexOf(','));
    let n: number;
    if (ultimo === -1) n = Number(num);
    else {
      const usaAmbos = num.includes('.') && num.includes(',');
      const decimales = num.length - ultimo - 1;
      // "1.150" o "1,150" (un solo tipo y 3 dígitos al final) = miles; si no, es separador decimal.
      const esDecimal = usaAmbos || decimales !== 3;
      n = esDecimal
        ? Number(num.slice(0, ultimo).replace(/[.,]/g, '') + '.' + num.slice(ultimo + 1))
        : Number(num.replace(/[.,]/g, ''));
    }
    if (!Number.isNaN(n)) return String(Math.round(n * 100) / 100);
  }
  return v.replace(/[.,;:'"()_-]/g, '');
}

function mezclar<T>(arr: T[], semilla: number): T[] {
  const a = [...arr];
  let s = semilla;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PracticaValidada({ guia, onCompleta }: { guia: GuiaPractica; onCompleta: () => void }) {
  const ruta = useMemo(() => (guia.menu_path ?? '').split('>').map((p) => p.trim()).filter(Boolean), [guia.menu_path]);
  const campos = guia.campos ?? [];
  const [nivel, setNivel] = useState(0); // segmentos del menú ya elegidos
  const [errorMenu, setErrorMenu] = useState<string | null>(null);
  const [valores, setValores] = useState<string[]>(() => campos.map(() => ''));
  // true = correcto, false = incorrecto, null = editado desde la última revisión (neutro).
  const [revisado, setRevisado] = useState<(boolean | null)[] | null>(null);
  const [intentos, setIntentos] = useState(0);
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [logrado, setLogrado] = useState(false);

  const ventanaAbierta = nivel >= ruta.length;
  const opciones = useMemo(() => {
    if (ventanaAbierta) return [];
    const correcta = ruta[nivel];
    const base = nivel === 0 ? MODULOS_SAP : [...SUBMENUS_GENERICOS, ...ruta.slice(nivel + 1)];
    const distractores = base.filter((o) => normalizar(o) !== normalizar(correcta)).slice(0, nivel === 0 ? 5 : 3);
    return mezclar([correcta, ...distractores], nivel * 7 + correcta.length);
  }, [nivel, ruta, ventanaAbierta]);

  const elegir = (opcion: string) => {
    if (normalizar(opcion) === normalizar(ruta[nivel])) {
      setErrorMenu(null);
      setNivel(nivel + 1);
    } else {
      setErrorMenu(`"${opcion}" no es la ruta correcta. Piensa en qué módulo vive "${guia.title}".`);
    }
  };

  const validar = () => {
    const res = campos.map((c, i) => normalizar(valores[i]) === normalizar(c.valor));
    setRevisado(res);
    setIntentos((n) => n + 1);
    if (res.every(Boolean)) {
      setLogrado(true);
      setTimeout(onCompleta, 2200);
    }
  };

  const correctos = revisado?.filter((r) => r === true).length ?? 0;
  const tituloVentana = ruta[ruta.length - 1] ?? guia.title;

  return (
    <div className="h-full flex flex-col gap-3 p-3 text-gray-900 overflow-y-auto">
      {/* Paso 1: navegación por el menú de SAP */}
      <div className="rounded-lg border border-[#b0b8c4] bg-[#e4e8ef] p-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#1c3a63] flex items-center gap-1.5">
          <FolderOpen size={14} /> Paso 1 · Abre la ventana desde el menú principal
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1 text-xs">
          <span className="font-semibold text-gray-600">Menú principal</span>
          {ruta.slice(0, nivel).map((p) => (
            <span key={p} className="flex items-center gap-1 font-semibold text-[#1c3a63]"><ChevronRight size={12} />{p}</span>
          ))}
          {!ventanaAbierta && <span className="flex items-center gap-1 text-gray-400"><ChevronRight size={12} />?</span>}
        </div>
        {!ventanaAbierta && (
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {opciones.map((o) => (
              <button
                key={o}
                onClick={() => elegir(o)}
                className="text-left px-2.5 py-1.5 rounded border border-[#7f9db9] bg-white hover:bg-[#fffde0] text-xs font-medium active:scale-95"
              >
                {o}
              </button>
            ))}
          </div>
        )}
        {errorMenu && <p className="mt-2 text-xs text-red-700 flex items-center gap-1"><XCircle size={13} /> {errorMenu}</p>}
      </div>

      {/* Paso 2: la ventana de SAP con los campos a completar */}
      {ventanaAbierta && (
        <div className="rounded-lg border-2 border-[#1c3a63] bg-[#ece9d8] shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#003366] to-[#0055A5] text-white px-3 py-1.5 text-xs font-bold flex justify-between">
            <span>{tituloVentana}</span>
            <span className="opacity-70 tracking-[6px]">▁▢✕</span>
          </div>
          <div className="p-4 space-y-2.5">
            {campos.map((c, i) => {
              const estado = revisado?.[i];
              return (
                <div key={c.etiqueta} className="grid grid-cols-[minmax(110px,180px)_1fr] items-start gap-3">
                  <label htmlFor={`campo-${i}`} className="text-xs text-gray-700 text-right pt-1.5">{c.etiqueta}</label>
                  <div>
                    <input
                      id={`campo-${i}`}
                      value={valores[i]}
                      disabled={logrado}
                      onChange={(e) => {
                        const v = [...valores]; v[i] = e.target.value; setValores(v);
                        if (revisado) { const r = [...revisado]; r[i] = null; setRevisado(r); }
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') validar(); }}
                      className={`w-full px-2 py-1 text-xs bg-white border rounded-sm focus:outline-none ${
                        estado === true ? 'border-emerald-600 bg-emerald-50' : estado === false ? 'border-red-600 bg-red-50' : 'border-[#7f9db9] focus:border-[#316ac5]'
                      }`}
                    />
                    {estado === false && (
                      <p className="mt-0.5 text-[11px] text-red-700 flex items-center gap-1">
                        <Lightbulb size={11} /> {c.pista || 'Revisa este valor con las instrucciones de la práctica.'}
                        {mostrarRespuesta && <span className="ml-1 font-bold">Respuesta: {c.valor}</span>}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-[#d4d0c8] border-t border-[#b0b8c4] px-3 py-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-gray-700">
              {logrado
                ? '¡Documento registrado correctamente!'
                : revisado ? `${correctos} de ${campos.length} campos correctos · intento ${intentos}` : 'Completa los campos y pulsa Añadir.'}
            </span>
            <div className="flex gap-2">
              {intentos >= 3 && !logrado && !mostrarRespuesta && (
                <button onClick={() => setMostrarRespuesta(true)} className="flex items-center gap-1 px-3 py-1 rounded-sm border border-[#555] bg-[#dfdfdf] text-xs active:scale-95">
                  <Eye size={12} /> Ver respuesta
                </button>
              )}
              <button
                onClick={validar}
                disabled={logrado}
                className="px-5 py-1 rounded-sm bg-[#ffb700] hover:bg-[#ffaa00] text-[#1c3a63] text-xs font-bold shadow active:scale-95 disabled:opacity-60"
              >
                Añadir
              </button>
            </div>
          </div>
          {logrado && (
            <div className="px-3 py-2 bg-emerald-600 text-white text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={14} /> Práctica superada. Volviendo a la clase…
            </div>
          )}
        </div>
      )}
    </div>
  );
}
