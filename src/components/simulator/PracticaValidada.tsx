'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SapiCara } from '@/components/site/SapiMascota';
import {
  ArrowRight, ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight, ChevronLeft, CircleAlert, CircleCheck,
  FileSpreadsheet, FileText, Filter, Folder, FolderOpen, Info, Mail, Plus, Printer, Search, Settings,
} from 'lucide-react';
import { normalizar, coincide, SI, esBooleano, type IntentoPractica } from '@/lib/practice-check';
import { useAuth } from '@/context/AuthContext';
import { getCompany } from '@/lib/firestore-company';
import { EMPRESA_CURSO } from '@/lib/b1-center-datos';

export interface CampoPractica { etiqueta: string; valor: string; pista?: string }
export interface GuiaPractica { title: string; menu_path?: string; instructions?: string[]; campos?: CampoPractica[] }

/** Menú principal de SAP Business One 10.0 (cliente de escritorio, español). */
const MODULOS_SAP = [
  'Administración', 'Finanzas', 'Oportunidades', 'Ventas - Clientes', 'Compras - Proveedores', 'Socios de negocios',
  'Gestión de bancos', 'Inventario', 'Recursos', 'Producción', 'Planificación de necesidades', 'Servicio',
  'Recursos humanos', 'Proyectos', 'Informes',
];
const SUBMENUS_GENERICOS = ['Definiciones', 'Datos maestros', 'Informes', 'Transacciones', 'Herramientas', 'Configuración', 'Asistentes'];
const MENU_SUPERIOR = ['Archivo', 'Edición', 'Ver', 'Datos', 'Ir a', 'Módulos', 'Herramientas', 'Ventana', 'Ayuda'];
const CLAVE_GUIA = 'sapi_guia_v1';
const GUIA_TAM = 34;

/** Las clases a veces nombran el módulo de forma abreviada: se traduce al nombre oficial del menú de SAP. */
const ALIAS_MODULO: [RegExp, string][] = [
  [/^ventas?\b|^clientes\b|clientes de ventas/, 'Ventas - Clientes'],
  [/^compras?\b|^proveedores\b/, 'Compras - Proveedores'],
  [/banco|tesorer/, 'Gestión de bancos'],
  [/^mrp$|planificaci/, 'Planificación de necesidades'],
  [/socio|interlocutor/, 'Socios de negocios'], // los manuales usan "Interlocutores comerciales" (traducción de España)
  [/contab|finanz/, 'Finanzas'],
  [/almac|inventar|stock/, 'Inventario'],
  [/^gestion$|administr|configurac/, 'Administración'],
  [/produc|fabric/, 'Producción'],
  [/servicio|garant/, 'Servicio'],
  [/proyecto/, 'Proyectos'],
  [/informe|reporte/, 'Informes'],
  [/oportunidad|crm/, 'Oportunidades'],
  [/activo/, 'Finanzas'],
];

const plano = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

function moduloOficial(nombre: string): string {
  const p = plano(nombre);
  const oficial = MODULOS_SAP.find((m) => plano(m) === p);
  if (oficial) return oficial;
  return ALIAS_MODULO.find(([re]) => re.test(p))?.[1] ?? nombre;
}

/**
 * Convierte la ruta de la clase en la ruta real de SAP Business One:
 * quita "Menú principal" / "Módulo de…", resuelve "Maestros de datos" y "CRM" según la tarea,
 * y deja "Herramientas" como menú de la barra superior (en SAP no está en el Menú principal).
 */
export function rutaSap(menuPath: string, titulo = ''): string[] {
  const partes = menuPath.split('>').map((s) => s.trim()).filter(Boolean);
  while (partes.length && /^(menu( principal)?|modulos?)$/.test(plano(partes[0]))) partes.shift();
  if (!partes.length) return partes;
  let raiz = plano(partes[0]).replace(/^modulo( de)?\s+/, '');
  const contexto = plano(`${partes.join(' ')} ${titulo}`);
  if (/^(maestros? de datos|datos maestros)$/.test(raiz)) {
    raiz = /socio|cliente|proveedor|contacto/.test(contexto) ? 'socios de negocios' : /articulo|item|almacen|precio|unidad|lote|serie/.test(contexto) ? 'inventario' : 'administracion';
  } else if (raiz === 'crm') {
    raiz = /oportunidad/.test(contexto) ? 'oportunidades' : 'socios de negocios';
  } else if (raiz === 'operaciones') {
    raiz = /venta|factura|pedido|cliente/.test(contexto) ? 'ventas' : /compra|proveedor/.test(contexto) ? 'compras' : /stock|almacen|inventario/.test(contexto) ? 'inventario' : 'administracion';
  }
  partes[0] = /^herramientas/.test(raiz) ? 'Herramientas' : moduloOficial(raiz);
  return partes;
}

// Las reglas de comparación viven en un módulo compartido: el servidor (/api/practice) califica igual que esta pantalla.
export { normalizar, coincide } from '@/lib/practice-check';

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

/** Códigos de datos maestros (C20000, V10000, A00001…): en SAP llevan la flecha naranja de enlace. */
const esCodigoMaestro = (v: string) => /^[A-Z]{1,3}\d{3,}$/.test(v.trim());

const CLIENTES = [['C20000', 'Maxi-Teq'], ['C20001', 'TechSolutions'], ['C20002', 'CompuMundo'], ['C20003', 'ElectroHogar'], ['C20004', 'Sistemas del Valle']];
const PROVEEDORES = [['V10000', 'Dell Ecuador'], ['V10001', 'HP Importaciones'], ['V10002', 'Lenovo Andina'], ['V10003', 'Acer Distributors']];
const ARTICULOS = [['A00001', 'Laptop Dell Latitude 3420'], ['A00002', 'Laptop HP ProBook 440'], ['A00003', 'Monitor Lenovo ThinkVision 24"'], ['A00004', 'Teclado Inalámbrico Logitech'], ['A00005', 'Mouse Óptico Dell'], ['A00006', 'Servidor HP ProLiant DL380'], ['A00007', 'Disco Duro SSD 1TB Samsung'], ['A00008', 'Memoria RAM 16GB DDR4'], ['A00009', 'Impresora Multifunción Epson'], ['A00010', 'Switch Cisco 24 Puertos'], ['A00011', 'Cable de Red Cat6 100m'], ['A00012', 'UPS APC 1500VA']];
type Opcion = { valor: string; texto: string };
const lista = (pares: string[][]): Opcion[] => pares.map(([valor, nombre]) => ({ valor, texto: `${valor} · ${nombre}` }));

/**
 * Opciones de un campo de valores cerrados: en SAP no se escriben, se eligen. Devuelve null si el campo es libre.
 * El valor esperado siempre está entre las opciones (el reto es elegir el correcto, no adivinar el formato).
 */
function opcionesCampo(c: CampoPractica): Opcion[] | null {
  const et = plano(c.etiqueta);
  const v = c.valor.trim();
  let ops: Opcion[] | null = null;
  if (/^C2\d{4}$/.test(v) || (/cliente|socio/.test(et) && CLIENTES.some(([, n]) => plano(n) === plano(v)))) ops = lista(CLIENTES);
  else if (/^V1\d{4}$/.test(v) || (/proveedor/.test(et) && PROVEEDORES.some(([, n]) => plano(n) === plano(v)))) ops = lista(PROVEEDORES);
  else if (/^A0\d{4}$/.test(v)) ops = lista(ARTICULOS);
  else if (/\biva\b|impuesto/.test(et) && !/retenc/.test(et)) ops = ['IVA 15%', 'IVA 5%', 'IVA 8%', 'IVA 0%'].map((o) => ({ valor: o, texto: o }));
  else if (/retenc/.test(et) && /%/.test(v)) return null;
  else if (/bodega|almacen/.test(et) && /^0[12]$|bodega/i.test(v)) ops = [{ valor: '01', texto: '01 · Bodega Central Quito' }, { valor: '02', texto: '02 · Bodega Sucursal Guayaquil' }];
  else if (/moneda/.test(et)) ops = ['USD', 'EUR', 'COP', 'PEN'].map((o) => ({ valor: o, texto: o }));
  else if (/condici.n de pago|plazo de pago|terminos de pago/.test(et)) ops = ['Contado', '15 días', '30 días', '45 días', '60 días'].map((o) => ({ valor: o, texto: o }));
  else if (/^tipo( de socio)?$/.test(et) && /cliente|proveedor|lead/i.test(v)) ops = ['Cliente', 'Proveedor', 'Lead'].map((o) => ({ valor: o, texto: o }));
  if (!ops) return null;
  return ops.some((o) => coincide(o.valor, v) || coincide(o.texto, v)) ? ops : [...ops, { valor: v, texto: v }];
}

type Estado = { tono: 'info' | 'error' | 'exito'; texto: string };

export default function PracticaValidada({ guia, onCompleta }: { guia: GuiaPractica; onCompleta: (intento: IntentoPractica) => void }) {
  const ruta = useMemo(() => rutaSap(guia.menu_path ?? '', guia.title), [guia.menu_path, guia.title]);
  // "Herramientas" (consultas, alertas, personalización) se abre desde la barra de menú superior, como en SAP.
  const porMenuSuperior = ruta[0] === 'Herramientas';
  const campos = useMemo(() => guia.campos ?? [], [guia.campos]);
  const [nivel, setNivel] = useState(0); // segmentos correctos ya abiertos en el árbol
  const [moduloAbierto, setModuloAbierto] = useState<string | null>(null); // módulo incorrecto expandido
  const [valores, setValores] = useState<string[]>(() => campos.map(() => ''));
  // true = correcto, false = incorrecto, null = editado desde la última revisión (neutro).
  const [revisado, setRevisado] = useState<(boolean | null)[] | null>(null);
  const [intentos, setIntentos] = useState(0);
  const [mostrarSolucion, setMostrarSolucion] = useState(false);

  // Empresa propia del estudiante (la misma del Simulador integral): cada uno trabaja en la suya
  // ("Mi Empresa", "Pruebas"…). undefined = cargando o sin conexión; null = aún no ha creado su empresa.
  const { currentUser } = useAuth();
  const [empresa, setEmpresa] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    if (!currentUser) return;
    let activo = true;
    getCompany(currentUser.uid)
      .then((s) => { if (activo) setEmpresa(s.profile?.companyName ?? null); })
      .catch(() => { if (activo) setEmpresa(undefined); });
    return () => { activo = false; };
  }, [currentUser]);
  const [logrado, setLogrado] = useState(false);
  const [estado, setEstado] = useState<Estado>({ tono: 'info', texto: 'Listo. Abre la ventana desde el Menú principal.' });

  const ventanaAbierta = ruta.length === 0 || nivel >= ruta.length;
  const modulos = useMemo(() => {
    const raiz = ruta[0];
    if (!raiz || porMenuSuperior || MODULOS_SAP.some((m) => normalizar(m) === normalizar(raiz))) return MODULOS_SAP;
    return [...MODULOS_SAP, raiz];
  }, [ruta, porMenuSuperior]);

  /** Hijos de un nivel del árbol: el correcto mezclado con submenús distractores. */
  const hijos = (profundidad: number) => {
    const correcto = ruta[profundidad];
    const distractores = SUBMENUS_GENERICOS.filter((o) => normalizar(o) !== normalizar(correcto)).slice(0, 3);
    return mezclar([correcto, ...distractores], profundidad * 11 + correcto.length);
  };

  const elegir = (profundidad: number, opcion: string) => {
    if (logrado) return;
    if (profundidad === nivel && normalizar(opcion) === normalizar(ruta[profundidad])) {
      setNivel(nivel + 1);
      setEstado(nivel + 1 >= ruta.length
        ? { tono: 'info', texto: `Ventana "${opcion}" abierta. Completa los campos y pulsa Añadir.` }
        : { tono: 'info', texto: 'Bien. Sigue bajando por el menú.' });
    } else {
      setEstado({ tono: 'error', texto: `"${opcion}" no es la ventana de esta tarea. Revisa la ruta en las instrucciones.` });
    }
  };

  const validar = () => {
    if (logrado) return;
    const res = campos.map((c, i) => coincide(valores[i], c.valor));
    const buenos = res.filter(Boolean).length;
    setRevisado(res);
    setIntentos((n) => n + 1);
    if (buenos === campos.length) {
      setLogrado(true);
      setEstado({ tono: 'exito', texto: 'Operación completada con éxito.' });
      const intento: IntentoPractica = { valores: [...valores], intentos: intentos + 1, vioSolucion: mostrarSolucion };
      setTimeout(() => onCompleta(intento), 2200);
    } else {
      setEstado({ tono: 'error', texto: `No se puede añadir: ${campos.length - buenos} campo(s) con valores incorrectos. Revisa los marcados en rojo.` });
    }
  };

  const tituloVentana = ruta[ruta.length - 1] ?? guia.title;

  // ── Sapi guía: se desplaza hasta el siguiente elemento que hay que pulsar o llenar ──
  const raizRef = useRef<HTMLDivElement>(null);
  const [guiaActiva, setGuiaActiva] = useState(true);
  useEffect(() => {
    try { if (localStorage.getItem(CLAVE_GUIA) === 'off') setGuiaActiva(false); } catch { /* sin almacenamiento */ }
  }, []);
  const alternarGuia = () => {
    setGuiaActiva((v) => {
      try { localStorage.setItem(CLAVE_GUIA, v ? 'off' : 'on'); } catch { /* sin almacenamiento */ }
      return !v;
    });
  };

  /** Qué debe hacer el estudiante ahora. No revela valores: solo señala dónde actuar. */
  const objetivo = useMemo<{ clave: string; texto: string } | null>(() => {
    if (logrado) return null;
    if (!ventanaAbierta) {
      const op = ruta[nivel];
      return { clave: `menu-${nivel}`, texto: nivel === 0 && porMenuSuperior ? `Abre el menú "${op}"` : `Haz clic en "${op}"` };
    }
    const mal = revisado ? revisado.findIndex((r) => r === false) : -1;
    if (mal >= 0) return { clave: `campo-${mal}`, texto: `Corrige "${campos[mal].etiqueta}"` };
    const vacio = campos.findIndex((c, i) => !esBooleano(c.valor) && !valores[i].trim());
    if (vacio >= 0) return { clave: `campo-${vacio}`, texto: `Llena "${campos[vacio].etiqueta}"` };
    return { clave: 'anadir', texto: '¡Todo listo! Pulsa Añadir' };
  }, [logrado, ventanaAbierta, ruta, nivel, porMenuSuperior, revisado, campos, valores]);

  const [posGuia, setPosGuia] = useState<{ x: number; y: number; izquierda: boolean } | null>(null);
  useLayoutEffect(() => {
    const raiz = raizRef.current;
    if (!raiz || !objetivo || !guiaActiva) { setPosGuia(null); return; }
    const calcular = () => {
      const el = raiz.querySelector<HTMLElement>(`[data-guia="${objetivo.clave}"]`);
      if (!el) { setPosGuia(null); return; }
      const r = el.getBoundingClientRect();
      const b = raiz.getBoundingClientRect();
      const esCampo = objetivo.clave.startsWith('campo-');
      // Sapi se coloca DEBAJO del elemento donde hay que hacer clic o escribir, nunca encima:
      // así el estudiante siempre ve el campo y lo que escribe.
      let x = r.left - b.left + (esCampo ? 4 : 0);
      x = Math.max(4, Math.min(x, b.width - GUIA_TAM - 4));
      const y = r.bottom - b.top + 2;
      // El globo va a la derecha de Sapi, salvo que no quepa.
      const izquierda = x > b.width - 230;
      // Solo actualiza si cambió: evita renders en cadena con el ResizeObserver.
      setPosGuia((p) => (p && Math.abs(p.x - x) < 0.5 && Math.abs(p.y - y) < 0.5 && p.izquierda === izquierda ? p : { x, y, izquierda }));
    };
    calcular();
    const ro = new ResizeObserver(calcular);
    ro.observe(raiz);
    raiz.addEventListener('scroll', calcular, true); // el árbol de módulos tiene scroll propio
    window.addEventListener('resize', calcular);
    return () => { ro.disconnect(); raiz.removeEventListener('scroll', calcular, true); window.removeEventListener('resize', calcular); };
  }, [objetivo, guiaActiva, moduloAbierto]);

  return (
    <div ref={raizRef} className="relative m-2 sm:m-3 rounded-md border border-[#8a9bb0] bg-[#eef1f5] shadow-2xl overflow-hidden text-[#1d2d3e] text-xs select-none">
      {posGuia && objetivo && (
        <div
          aria-hidden="true"
          // Coordenadas calculadas en tiempo real según el elemento objetivo: no expresables con clases.
          style={{ left: posGuia.x, top: posGuia.y }}
          className="pointer-events-none absolute z-30 transition-[left,top] duration-500 ease-out motion-reduce:transition-none"
        >
          <SapiCara tam={GUIA_TAM} />
          <span
            className={`absolute top-1 whitespace-nowrap rounded-md bg-[#0B3D91] px-2 py-1 text-[11px] font-semibold text-white shadow-lg ${
              posGuia.izquierda ? 'right-full mr-1' : 'left-full ml-1'
            }`}
          >
            {objetivo.texto}
          </span>
        </div>
      )}
      {/* Barra de título de la aplicación */}
      <div className="flex items-center justify-between bg-gradient-to-b from-[#dfe7f1] to-[#c7d4e4] border-b border-[#9fb1c7] px-2 py-1">
        <span className="flex items-center gap-2 font-semibold">
          <span className="rounded-sm bg-gradient-to-b from-[#1f6fc5] to-[#0a3d8f] px-1.5 text-[10px] font-black italic text-white">SAP</span>
          SAP Business One 10.0 — {empresa || EMPRESA_CURSO}
        </span>
        <span className="hidden sm:flex gap-1" aria-hidden="true">
          {['▁', '▢', '✕'].map((s) => <span key={s} className="w-6 h-4 flex items-center justify-center rounded-sm border border-[#9fb1c7] bg-[#eef2f7] text-[10px]">{s}</span>)}
        </span>
      </div>

      {/* Barra de menú (Herramientas abre su menú desplegable, como en SAP) */}
      <div className="relative flex flex-wrap gap-x-4 bg-[#f6f7f9] border-b border-[#cdd6e1] px-3 py-0.5 text-[11px]">
        {MENU_SUPERIOR.map((m) => (
          <button
            key={m}
            type="button"
            data-guia={porMenuSuperior && m === 'Herramientas' ? 'menu-0' : undefined}
            onClick={() => {
              if (porMenuSuperior && m === 'Herramientas') { if (nivel === 0) elegir(0, m); }
              else setEstado({ tono: porMenuSuperior ? 'error' : 'info', texto: porMenuSuperior ? `"${m}" no contiene la ventana de esta tarea.` : 'Esta tarea se abre desde el Menú principal de la izquierda.' });
            }}
            className={`px-1 hover:bg-[#dde6f1] ${porMenuSuperior && m === 'Herramientas' && nivel > 0 ? 'bg-[#dde6f1] font-semibold' : ''}`}
          >
            {m}
          </button>
        ))}
        {porMenuSuperior && nivel > 0 && !ventanaAbierta && (
          <div className="absolute left-[38%] top-full z-20 min-w-[220px] rounded-sm border border-[#9fb1c7] bg-white shadow-xl py-1">
            <Rama ruta={ruta} profundidad={1} nivel={nivel} hijos={hijos} elegir={elegir} />
          </div>
        )}
      </div>

      {/* Barra de herramientas */}
      <div className="flex items-center gap-1 bg-[#e9edf2] border-b border-[#cdd6e1] px-2 py-1" aria-hidden="true">
        {[Printer, Mail, FileSpreadsheet, null, Search, Plus, null, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, null, Filter, Settings].map((Icono, i) =>
          Icono
            ? <span key={i} className="w-6 h-6 flex items-center justify-center rounded-sm hover:bg-[#d6dee8] text-[#2a5d9f]"><Icono size={14} /></span>
            : <span key={i} className="w-px h-4 bg-[#b8c4d2] mx-1" />,
        )}
      </div>

      <div className="flex flex-col md:flex-row min-h-[380px]">
        {/* Menú principal (árbol de módulos) */}
        <nav aria-label="Menú principal de SAP" className="md:w-60 shrink-0 bg-white border-b md:border-b-0 md:border-r border-[#cdd6e1]">
          <div className="flex text-[11px] border-b border-[#cdd6e1]">
            <span className="px-3 py-1 font-bold border-b-2 border-[#f0ab00]">Módulos</span>
            <span className="px-3 py-1 text-gray-400">Drag &amp; Relate</span>
            <span className="px-3 py-1 text-gray-400">Mi menú</span>
          </div>
          <ul className="py-1 max-h-[340px] overflow-y-auto">
            {modulos.map((m) => {
              const esRaizCorrecta = !!ruta[0] && normalizar(m) === normalizar(ruta[0]);
              const abierto = (esRaizCorrecta && nivel > 0) || moduloAbierto === m;
              return (
                <li key={m}>
                  <button
                    type="button"
                    data-guia={esRaizCorrecta ? 'menu-0' : undefined}
                    onClick={() => {
                      if (esRaizCorrecta) { if (nivel === 0) elegir(0, m); }
                      else { setModuloAbierto(abierto ? null : m); setEstado({ tono: 'info', texto: `Módulo "${m}" desplegado.` }); }
                    }}
                    className={`w-full flex items-center gap-1.5 px-2 py-[3px] text-left hover:bg-[#e8f1fb] ${abierto ? 'font-semibold' : ''}`}
                  >
                    {abierto ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                    {abierto ? <FolderOpen size={14} className="text-[#e3a21a] fill-[#f7d774]" /> : <Folder size={14} className="text-[#e3a21a] fill-[#f7d774]" />}
                    {m}
                  </button>
                  {/* Rama correcta: se despliega nivel por nivel */}
                  {abierto && esRaizCorrecta && <Rama ruta={ruta} profundidad={1} nivel={nivel} hijos={hijos} elegir={elegir} />}
                  {/* Rama de un módulo equivocado: submenús que no llevan a la tarea */}
                  {abierto && !esRaizCorrecta && (
                    <ul className="pl-5">
                      {SUBMENUS_GENERICOS.slice(0, 4).map((s) => (
                        <li key={s}>
                          <button type="button" onClick={() => elegir(-1, s)} className="w-full flex items-center gap-1.5 px-2 py-[3px] text-left hover:bg-[#e8f1fb]">
                            <FileText size={13} className="text-[#2a5d9f]" /> {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Escritorio de trabajo */}
        <div className="flex-1 bg-[#d5dce5] p-3 sm:p-5 space-y-3">
          {/* Ficha del ejercicio: como en los ejercicios de SAP Learning, el dato de cada campo es explícito.
              El reto es encontrar la ventana en el menú y registrar bien el documento, no adivinar valores. */}
          {campos.length > 0 && (
            <div className="max-w-3xl rounded-sm border border-[#7f93ab] bg-white px-3 py-2">
              <p className="font-bold text-[#0B3D91] mb-1">Ficha del ejercicio</p>
              {ruta.length > 0 && (
                <p className="text-[#4a5b70] mb-1.5">Ventana: <strong className="text-[#1d2d3e]">{ruta.join(' › ')}</strong></p>
              )}
              <dl className="grid sm:grid-cols-2 gap-x-4 gap-y-0.5">
                {campos.map((c, i) => (
                  <div key={i} className="flex gap-1.5">
                    <dt className="text-[#4a5b70]">{c.etiqueta}:</dt>
                    <dd className="font-semibold text-[#1d2d3e]">{esBooleano(c.valor) ? (SI.test(normalizar(c.valor)) ? 'marcar la casilla' : 'dejar sin marcar') : c.valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {!ventanaAbierta ? (
            <div className="h-full min-h-[200px] flex items-center justify-center">
              <p className="max-w-sm text-center text-[#4a5b70] bg-white/70 rounded-md border border-[#b8c4d2] px-4 py-3">
                Abre la ventana de la tarea desde {porMenuSuperior ? <>el menú <strong>Herramientas</strong> de la barra superior</> : <>el <strong>Menú principal</strong> de la izquierda</>}:<br />
                <span className="font-semibold text-[#1f4f8f]">{ruta.slice(0, Math.max(nivel, 1)).join(' › ')}{nivel < ruta.length ? ' › …' : ''}</span>
              </p>
            </div>
          ) : (
            <div className="max-w-3xl rounded-sm border border-[#7f93ab] bg-[#f7f8fa] shadow-xl">
              {/* Barra de título de la ventana del documento */}
              <div className="flex items-center justify-between bg-gradient-to-b from-[#e3eaf3] to-[#cfdbe9] border-b border-[#9fb1c7] px-2 py-1 font-semibold">
                <span>{tituloVentana}</span>
                <span className="flex gap-1" aria-hidden="true">
                  {['▁', '▢', '✕'].map((s) => <span key={s} className="w-5 h-4 flex items-center justify-center rounded-sm border border-[#9fb1c7] bg-[#eef2f7] text-[9px]">{s}</span>)}
                </span>
              </div>

              {/* Campos (dos columnas, como la cabecera de un documento SAP) */}
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 p-3 sm:p-4">
                {campos.map((c, i) => {
                  const est = revisado?.[i];
                  return (
                    <div key={`${i}-${c.etiqueta}`}>
                      <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                        <label htmlFor={`campo-${i}`} className="flex items-center gap-1 text-[#32465c] leading-tight" title={c.etiqueta}>
                          {esCodigoMaestro(c.valor) && <ArrowRight size={11} className="shrink-0 text-[#f0ab00]" aria-label="Enlace a datos maestros" />}
                          {c.etiqueta}
                        </label>
                        {esBooleano(c.valor) ? (
                          <span data-guia={`campo-${i}`} className="flex items-center h-6">
                            <input
                              id={`campo-${i}`}
                              type="checkbox"
                              checked={SI.test(normalizar(valores[i]))}
                              disabled={logrado}
                              onChange={(e) => {
                                const v = [...valores]; v[i] = e.target.checked ? 'Sí' : 'No'; setValores(v);
                                if (revisado) { const r = [...revisado]; r[i] = null; setRevisado(r); }
                              }}
                              className={`w-4 h-4 accent-[#f0ab00] ${est === false ? 'outline outline-2 outline-[#c9302c]' : ''}`}
                            />
                          </span>
                        ) : opcionesCampo(c) ? (
                        // Campos de valores cerrados (IVA, bodega, moneda, socio, artículo…): se eligen de una lista, como en SAP.
                        <select
                          id={`campo-${i}`}
                          data-guia={`campo-${i}`}
                          value={valores[i]}
                          disabled={logrado}
                          onChange={(e) => {
                            const v = [...valores]; v[i] = e.target.value; setValores(v);
                            if (revisado) { const r = [...revisado]; r[i] = null; setRevisado(r); }
                          }}
                          className={`h-6 w-full px-1 bg-white border rounded-[2px] focus:outline-none ${
                            est === true ? 'border-[#3a8f3a] bg-[#f0f9ee]'
                              : est === false ? 'border-[#c9302c] bg-[#fdf0ef]'
                                : 'border-[#a9b7c8] focus:border-[#f0ab00] focus:ring-1 focus:ring-[#f0ab00]'
                          }`}
                        >
                          <option value="">Selecciona…</option>
                          {opcionesCampo(c)!.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
                        </select>
                        ) : (
                        <input
                          id={`campo-${i}`}
                          data-guia={`campo-${i}`}
                          value={valores[i]}
                          disabled={logrado}
                          autoComplete="off"
                          onChange={(e) => {
                            const v = [...valores]; v[i] = e.target.value; setValores(v);
                            if (revisado) { const r = [...revisado]; r[i] = null; setRevisado(r); }
                          }}
                          onKeyDown={(e) => { if (e.key === 'Enter') validar(); }}
                          className={`h-6 w-full px-1.5 bg-white border rounded-[2px] focus:outline-none select-text ${
                            est === true ? 'border-[#3a8f3a] bg-[#f0f9ee]'
                              : est === false ? 'border-[#c9302c] bg-[#fdf0ef]'
                                : 'border-[#a9b7c8] focus:border-[#f0ab00] focus:ring-1 focus:ring-[#f0ab00]'
                          }`}
                        />
                        )}
                      </div>
                      {est === false && (
                        <p className="mt-0.5 ml-[158px] text-[10.5px] text-[#a12622]">
                          {c.pista || 'Revisa este valor con las instrucciones.'}
                          {mostrarSolucion && <> · <strong>Solución: {c.valor}</strong></>}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botones de SAP: Añadir / Cancelar abajo a la izquierda; Copiar de / a a la derecha */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#cdd6e1] px-3 py-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-guia="anadir"
                    onClick={validar}
                    disabled={logrado}
                    className="min-w-[80px] h-6 px-3 rounded-[3px] border border-[#c48a00] bg-gradient-to-b from-[#ffd25a] to-[#f0ab00] font-bold text-[#1d2d3e] shadow-sm hover:brightness-105 active:scale-95 disabled:opacity-60"
                  >
                    Añadir
                  </button>
                  <button
                    type="button"
                    onClick={() => { setValores(campos.map(() => '')); setRevisado(null); setEstado({ tono: 'info', texto: 'Cambios descartados.' }); }}
                    disabled={logrado}
                    className="min-w-[80px] h-6 px-3 rounded-[3px] border border-[#8a9bb0] bg-gradient-to-b from-white to-[#e4e9ef] active:scale-95 disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                  {intentos >= 3 && !logrado && !mostrarSolucion && (
                    <button type="button" onClick={() => setMostrarSolucion(true)} className="h-6 px-3 rounded-[3px] border border-[#8a9bb0] bg-white text-[#1f4f8f] underline active:scale-95">
                      Ver solución
                    </button>
                  )}
                </div>
                <div className="hidden sm:flex gap-2" aria-hidden="true">
                  {['Copiar de', 'Copiar a'].map((b) => <span key={b} className="h-6 px-3 flex items-center rounded-[3px] border border-[#c3ccd7] bg-[#eef1f5] text-gray-400">{b}</span>)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de estado (mensajes del sistema) */}
      <div
        role="status"
        className={`flex items-center gap-2 border-t px-3 py-1 text-[11px] ${
          estado.tono === 'error' ? 'bg-[#fdecea] border-[#e3a6a2] text-[#a12622]'
            : estado.tono === 'exito' ? 'bg-[#e9f6e7] border-[#a8d3a0] text-[#2b6e2b]'
              : 'bg-[#f2f4f7] border-[#cdd6e1] text-[#4a5b70]'
        }`}
      >
        {estado.tono === 'error' ? <CircleAlert size={13} /> : estado.tono === 'exito' ? <CircleCheck size={13} /> : <Info size={13} />}
        <span className="flex-1">{estado.texto}</span>
        {logrado && <span className="font-bold">Práctica superada · volviendo a la clase…</span>}
        {!logrado && revisado && <span>Intento {intentos}</span>}
        {!logrado && (
          <button
            type="button"
            onClick={alternarGuia}
            aria-pressed={guiaActiva}
            className="ml-1 rounded-sm border border-[#b8c4d2] bg-white px-1.5 py-px text-[10.5px] text-[#1f4f8f] hover:bg-[#e8f1fb] active:scale-95"
          >
            {guiaActiva ? 'Ocultar guía Sapi' : 'Mostrar guía Sapi'}
          </button>
        )}
      </div>
    </div>
  );
}

/** Nivel del árbol bajo el módulo correcto: el camino de la tarea mezclado con submenús distractores. */
function Rama({ ruta, profundidad, nivel, hijos, elegir }: {
  ruta: string[]; profundidad: number; nivel: number;
  hijos: (p: number) => string[]; elegir: (p: number, o: string) => void;
}) {
  if (profundidad >= ruta.length || nivel < profundidad) return null;
  return (
    <ul className="pl-4">
      {hijos(profundidad).map((o) => {
        const correcto = normalizar(o) === normalizar(ruta[profundidad]);
        const esHoja = profundidad === ruta.length - 1;
        const abierto = correcto && nivel > profundidad;
        return (
          <li key={o}>
            <button
              type="button"
              data-guia={correcto ? `menu-${profundidad}` : undefined}
              onClick={() => elegir(profundidad, o)}
              className={`w-full flex items-center gap-1.5 px-2 py-[3px] text-left hover:bg-[#e8f1fb] ${abierto ? 'font-semibold' : ''}`}
            >
              {esHoja
                ? <FileText size={13} className="text-[#2a5d9f]" />
                : abierto ? <FolderOpen size={13} className="text-[#e3a21a] fill-[#f7d774]" /> : <Folder size={13} className="text-[#e3a21a] fill-[#f7d774]" />}
              {o}
            </button>
            {abierto && <Rama ruta={ruta} profundidad={profundidad + 1} nivel={nivel} hijos={hijos} elegir={elegir} />}
          </li>
        );
      })}
    </ul>
  );
}
