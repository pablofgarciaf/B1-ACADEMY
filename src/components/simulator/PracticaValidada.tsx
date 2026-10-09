'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FiniCara } from '@/components/site/FiniMascota';
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
  [/socio|interlocutor/, 'Socios de negocios'],
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

const esCodigoMaestro = (v: string) => /^[A-Z]{1,3}\d{3,}$/.test(v.trim());

const CLIENTES = [['C20000', 'Maxi-Teq'], ['C20001', 'TechSolutions'], ['C20002', 'CompuMundo'], ['C20003', 'ElectroHogar'], ['C20004', 'Sistemas del Valle']];
const PROVEEDORES = [['V10000', 'Dell Ecuador'], ['V10001', 'HP Importaciones'], ['V10002', 'Lenovo Andina'], ['V10003', 'Acer Distributors']];
const ARTICULOS = [['A00001', 'Laptop Dell Latitude 3420'], ['A00002', 'Laptop HP ProBook 440'], ['A00003', 'Monitor Lenovo ThinkVision 24"'], ['A00004', 'Teclado Inalámbrico Logitech'], ['A00005', 'Mouse Óptico Dell'], ['A00006', 'Servidor HP ProLiant DL380'], ['A00007', 'Disco Duro SSD 1TB Samsung'], ['A00008', 'Memoria RAM 16GB DDR4'], ['A00009', 'Impresora Multifunción Epson'], ['A00010', 'Switch Cisco 24 Puertos'], ['A00011', 'Cable de Red Cat6 100m'], ['A00012', 'UPS APC 1500VA']];
type Opcion = { valor: string; texto: string };
const lista = (pares: string[][]): Opcion[] => pares.map(([valor, nombre]) => ({ valor, texto: `${valor} · ${nombre}` }));

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
  const porMenuSuperior = ruta[0] === 'Herramientas';
  const campos = useMemo(() => guia.campos ?? [], [guia.campos]);
  const [nivel, setNivel] = useState(0);
  const [moduloAbierto, setModuloAbierto] = useState<string | null>(null);

  // Inicialización de campos con auto-relleno inteligente usando el correo registrado del estudiante
  const [valores, setValores] = useState<string[]>(() => {
    return campos.map((c) => {
      const et = plano(c.etiqueta);
      if (et.includes('usuario') || et.includes('user')) return 'pablofgarciaf@gmail.com';
      if (et.includes('contra') || et.includes('clave') || et.includes('pass')) return 'mateD0MEmia';
      if (et.includes('empresa') || et.includes('company')) return 'B1 Center';
      return '';
    });
  });

  const [revisado, setRevisado] = useState<(boolean | null)[] | null>(null);
  const [intentos, setIntentos] = useState(0);
  const [mostrarSolucion, setMostrarSolucion] = useState(false);

  const [ventanaMaximizada, setVentanaMaximizada] = useState(false);
  const [ventanaMinimizada, setVentanaMinimizada] = useState(false);
  const [outerMaximizada, setOuterMaximizada] = useState(false);

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

  // Si el usuario tiene sesión activa, actualizar el valor del campo Usuario con su correo real de la cuenta
  useEffect(() => {
    if (!currentUser?.email) return;
    const emailReal = currentUser.email;
    setValores(prev => prev.map((v, i) => {
      const et = plano(campos[i]?.etiqueta || '');
      if ((et.includes('usuario') || et.includes('user')) && (!v || v === 'pablofgarciaf@gmail.com' || v === 'pablo.garcia' || v === 'manager')) {
        return emailReal;
      }
      return v;
    }));
  }, [currentUser, campos]);

  const [logrado, setLogrado] = useState(false);
  const [estado, setEstado] = useState<Estado>({ tono: 'info', texto: 'Listo. Abre la ventana desde el Menú principal o confirma los datos prellenos.' });

  const ventanaAbierta = ruta.length === 0 || nivel >= ruta.length;
  const modulos = useMemo(() => {
    const raiz = ruta[0];
    if (!raiz || porMenuSuperior || MODULOS_SAP.some((m) => normalizar(m) === normalizar(raiz))) return MODULOS_SAP;
    return [...MODULOS_SAP, raiz];
  }, [ruta, porMenuSuperior]);

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
    const res = campos.map((c, i) => coincide(valores[i], c.valor, c.etiqueta));
    const buenos = res.filter(Boolean).length;
    setRevisado(res);
    setIntentos((n) => n + 1);
    if (buenos === campos.length) {
      setLogrado(true);
      setEstado({ tono: 'exito', texto: '¡Operación y datos validados con éxito en B1 Center!' });
      const intento: IntentoPractica = { valores: [...valores], intentos: intentos + 1, vioSolucion: mostrarSolucion };
      setTimeout(() => onCompleta(intento), 1500);
    } else {
      setEstado({ tono: 'error', texto: `No se puede añadir: ${campos.length - buenos} campo(s) con valores incorrectos. Revisa los marcados en rojo.` });
    }
  };

  const tituloVentana = ruta[ruta.length - 1] ?? guia.title;

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
      
      let x = r.left - b.left + (esCampo ? 4 : 0);
      x = Math.max(4, Math.min(x, b.width - GUIA_TAM - 4));
      
      // FIX DE POSICIONAMIENTO DE SAPI: Si se está mostrando el mensaje de solución roja debajo del campo,
      // desplazamos el icono de Sapi más abajo (34px adicionales) para que NUNCA obstruya la lectura de la solución.
      const indiceCampo = esCampo ? parseInt(objetivo.clave.replace('campo-', ''), 10) : -1;
      const haySolucionVisible = mostrarSolucion || (indiceCampo >= 0 && revisado?.[indiceCampo] === false);
      let y = r.bottom - b.top + (haySolucionVisible ? 36 : 2);

      const izquierda = x > b.width - 230;
      setPosGuia((p) => (p && Math.abs(p.x - x) < 0.5 && Math.abs(p.y - y) < 0.5 && p.izquierda === izquierda ? p : { x, y, izquierda }));
    };
    calcular();
    const ro = new ResizeObserver(calcular);
    ro.observe(raiz);
    raiz.addEventListener('scroll', calcular, true);
    window.addEventListener('resize', calcular);
    return () => { ro.disconnect(); raiz.removeEventListener('scroll', calcular, true); window.removeEventListener('resize', calcular); };
  }, [objetivo, guiaActiva, moduloAbierto, mostrarSolucion, revisado]);

  return (
    <div ref={raizRef} className={`relative rounded-md border border-[#8a9bb0] bg-[#eef1f5] shadow-2xl overflow-hidden text-[#1d2d3e] text-xs select-none transition-all duration-100 ${outerMaximizada ? 'fixed inset-1 z-50 m-0 rounded-none h-[calc(100vh-8px)] flex flex-col' : 'm-2 sm:m-3'}`}>
      {posGuia && objetivo && (
        <div
          aria-hidden="true"
          style={{ left: posGuia.x, top: posGuia.y }}
          className="pointer-events-none absolute z-30 transition-[left,top] duration-500 ease-out motion-reduce:transition-none"
        >
          <FiniCara tam={GUIA_TAM} />
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
      <div className="flex items-center justify-between bg-gradient-to-b from-[#dfe7f1] to-[#c7d4e4] border-b border-[#9fb1c7] px-2.5 py-1 select-none">
        <span className="flex items-center gap-2 font-semibold text-xs">
          <span className="rounded-sm bg-gradient-to-b from-[#1f6fc5] to-[#0a3d8f] px-1.5 py-0.5 text-[10px] font-black italic text-white shadow-sm">SAP</span>
          <span>SAP Business One 10.0 — {empresa || EMPRESA_CURSO}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setOuterMaximizada(!outerMaximizada)}
            className="px-2 py-0.5 rounded border border-[#9fb1c7] bg-[#eef2f7] hover:bg-white text-[10.5px] font-bold text-[#1d2d3e] transition-all active:scale-95 shadow-sm cursor-pointer flex items-center gap-1"
            title={outerMaximizada ? 'Restaurar tamaño del simulador' : 'Maximizar simulador a pantalla completa'}
          >
            <span>{outerMaximizada ? 'Restaurar' : 'Maximizar simulador'}</span>
            <span>{outerMaximizada ? '❐' : '□'}</span>
          </button>
        </div>
      </div>

      {/* Barra de menú */}
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

      {/* Cuerpo principal de SAP B1 */}
      <div className="flex flex-col md:flex-row min-h-[380px]">
        {/* Árbol del Menú principal */}
        <nav className="w-full md:w-56 shrink-0 bg-[#e4eaf2] border-b md:border-b-0 md:border-r border-[#abb8c7] p-2 overflow-y-auto max-h-[420px]">
          <p className="font-semibold text-[#1d2d3e] mb-1 pb-1 border-b border-[#b5c2d1]">Menú principal</p>
          <ul className="space-y-0.5">
            {modulos.map((m) => {
              const esRaizCorrecta = normalizar(m) === normalizar(ruta[0]);
              const estaExpandido = esRaizCorrecta ? nivel > 0 : moduloAbierto === m;
              return (
                <li key={m}>
                  <button
                    type="button"
                    data-guia={nivel === 0 && esRaizCorrecta ? 'menu-0' : undefined}
                    onClick={() => {
                      if (esRaizCorrecta) { if (nivel === 0) elegir(0, m); }
                      else { setModuloAbierto((v) => (v === m ? null : m)); elegir(0, m); }
                    }}
                    className={`w-full flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm text-left hover:bg-[#c9d6e5] ${
                      esRaizCorrecta && nivel > 0 ? 'font-semibold text-[#0b3d91] bg-[#d3e0f0]' : ''
                    }`}
                  >
                    {estaExpandido ? <FolderOpen size={13} className="text-[#d89e00]" /> : <Folder size={13} className="text-[#d89e00]" />}
                    <span className="truncate">{m}</span>
                  </button>

                  {estaExpandido && (
                    <ul className="ml-3 pl-2 border-l border-[#abb8c7] space-y-0.5 my-0.5">
                      {esRaizCorrecta ? (
                        <Rama ruta={ruta} profundidad={1} nivel={nivel} hijos={hijos} elegir={elegir} />
                      ) : (
                        SUBMENUS_GENERICOS.slice(0, 3).map((sub) => (
                          <li key={sub}>
                            <button type="button" onClick={() => elegir(1, sub)} className="w-full text-left px-1.5 py-0.5 hover:bg-[#c9d6e5] text-[11px] truncate">
                              {sub}
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

      {/* Escritorio de trabajo */}
        <div className="flex-1 bg-[#d5dce5] p-3 sm:p-5 space-y-3 relative overflow-hidden flex flex-col min-h-[360px]">
          {!ventanaAbierta ? (
            <div className="h-full min-h-[200px] flex items-center justify-center">
              <p className="max-w-sm text-center text-[#4a5b70] bg-white/70 rounded-md border border-[#b8c4d2] px-4 py-3">
                Abre la ventana de la tarea desde {porMenuSuperior ? <>el menú <strong>Herramientas</strong> de la barra superior</> : <>el <strong>Menú principal</strong> de la izquierda</>}:<br />
                <span className="font-semibold text-[#1f4f8f]">{ruta.slice(0, Math.max(nivel, 1)).join(' › ')}{nivel < ruta.length ? ' › …' : ''}</span>
              </p>
            </div>
          ) : ventanaMinimizada ? (
            <div className="mt-auto bg-[#1e293b] border-2 border-[#475569] p-2.5 rounded flex items-center justify-between text-white shadow-xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-bold text-xs">{tituloVentana} (Ventana minimizada)</span>
              </div>
              <button
                type="button"
                onClick={() => setVentanaMinimizada(false)}
                className="px-3 py-1 bg-[#0055A5] hover:bg-[#003366] text-white font-bold rounded text-xs transition-all active:scale-95 shadow cursor-pointer flex items-center gap-1"
              >
                <span>Restaurar ventana</span>
                <span>❐</span>
              </button>
            </div>
          ) : (
            <div className={`rounded-sm border border-[#7f93ab] bg-[#f7f8fa] shadow-xl transition-all duration-100 ${ventanaMaximizada ? 'absolute inset-2 z-30 max-w-none m-0 border-2 border-[#0055A5] flex flex-col h-[calc(100%-16px)]' : 'max-w-3xl'}`}>
              {/* Barra de título de la ventana */}
              <div className="flex items-center justify-between bg-gradient-to-b from-[#e3eaf3] to-[#cfdbe9] border-b border-[#9fb1c7] px-2.5 py-1 font-semibold select-none shrink-0">
                <span className="flex items-center gap-1.5 text-xs text-[#003366] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#0055A5]" />
                  {tituloVentana}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setVentanaMinimizada(true)}
                    className="w-5 h-5 bg-[#eab308] hover:bg-yellow-400 rounded-sm text-[10px] text-slate-950 font-extrabold flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    title="Minimizar a la barra inferior"
                  >
                    _
                  </button>
                  <button
                    type="button"
                    onClick={() => setVentanaMaximizada(!ventanaMaximizada)}
                    className="w-5 h-5 bg-[#16a34a] hover:bg-emerald-500 rounded-sm text-[10px] text-white font-extrabold flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    title={ventanaMaximizada ? 'Restaurar tamaño normal' : 'Maximizar al área disponible'}
                  >
                    {ventanaMaximizada ? '❐' : '□'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setVentanaMinimizada(true)}
                    className="w-5 h-5 bg-[#dc2626] hover:bg-red-500 rounded-sm text-[11px] text-white font-extrabold flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    title="Cerrar ventana (×)"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Campos */}
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
                      {/* Pistas y solución visible sin obstrucción */}
                      {est === false && (
                        <p className="mt-1 ml-[158px] text-[10.5px] text-[#a12622] leading-tight font-medium bg-[#fdf0ef] p-1 rounded border border-[#f5c6cb]">
                          {c.pista || 'Revisa este valor.'}
                          {mostrarSolucion && <span className="block mt-0.5 font-bold text-[#721c24]">Solución: {c.valor}</span>}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botones de SAP: Añadir / Cancelar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#cdd6e1] px-3 py-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-guia="anadir"
                    onClick={validar}
                    disabled={logrado}
                    className="min-w-[80px] h-6 px-3 rounded-[3px] border border-[#c48a00] bg-gradient-to-b from-[#ffd25a] to-[#f0ab00] font-bold text-[#1d2d3e] shadow-sm hover:brightness-105 active:scale-95 disabled:opacity-60 cursor-pointer"
                  >
                    Añadir
                  </button>
                  <button
                    type="button"
                    onClick={() => { setValores(campos.map(() => '')); setRevisado(null); setEstado({ tono: 'info', texto: 'Cambios descartados.' }); }}
                    disabled={logrado}
                    className="min-w-[80px] h-6 px-3 rounded-[3px] border border-[#8a9bb0] bg-gradient-to-b from-white to-[#e4e9ef] active:scale-95 disabled:opacity-60 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  {intentos >= 1 && !logrado && !mostrarSolucion && (
                    <button type="button" onClick={() => setMostrarSolucion(true)} className="h-6 px-3 rounded-[3px] border border-[#8a9bb0] bg-white text-[#1f4f8f] underline active:scale-95 cursor-pointer">
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

      {/* Barra de estado */}
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
            {guiaActiva ? 'Ocultar guía Fini' : 'Mostrar guía Fini'}
          </button>
        )}
      </div>
    </div>
  );
}

function Rama({ ruta, profundidad, nivel, hijos, elegir }: {
  ruta: string[]; profundidad: number; nivel: number;
  hijos: (p: number) => string[]; elegir: (p: number, o: string) => void;
}) {
  const correcto = ruta[profundidad];
  if (!correcto) return null;
  const items = hijos(profundidad);
  const esUltimo = profundidad === ruta.length - 1;
  const alcanzado = nivel > profundidad;
  return (
    <>
      {items.map((opcion) => {
        const esCorrecto = normalizar(opcion) === normalizar(correcto);
        return (
          <li key={opcion}>
            <button
              type="button"
              data-guia={nivel === profundidad && esCorrecto ? `menu-${profundidad}` : undefined}
              onClick={() => elegir(profundidad, opcion)}
              className={`w-full flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm text-left hover:bg-[#c9d6e5] ${
                esCorrecto && alcanzado ? 'font-semibold text-[#0b3d91] bg-[#d3e0f0]' : ''
              }`}
            >
              {esUltimo && esCorrecto ? <FileText size={12} className="text-[#1f4f8f]" /> : <Folder size={12} className="text-[#d89e00]" />}
              <span className="truncate">{opcion}</span>
            </button>
            {esCorrecto && alcanzado && !esUltimo && (
              <ul className="ml-3 pl-2 border-l border-[#abb8c7] space-y-0.5 my-0.5">
                <Rama ruta={ruta} profundidad={profundidad + 1} nivel={nivel} hijos={hijos} elegir={elegir} />
              </ul>
            )}
          </li>
        );
      })}
    </>
  );
}
