"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, Play, Maximize2, Minimize2,
  FileText, CheckCircle2, TrendingUp, ShieldAlert,
  ArrowRight, Sparkles, Building2, Wrench, MessageSquare, Printer, Check
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

interface SlideData {
  number: number;
  tag: string;
  title: string;
  subtitle: string;
  bullets: { title: string; desc: string }[];
  highlight: { label: string; value: string; detail: string };
  speakerNotes: string;
  iconName: string;
}

const SLIDES: SlideData[] = [
  {
    number: 1,
    tag: 'Presentación Oficial B2B',
    title: 'Finix ERP 10.0: Gestión Integral para Empresas de Alto Rendimiento',
    subtitle: 'Control Operativo Total, Cumplimiento Fiscal SRI 2026 y Rentabilidad en Tiempo Real.',
    bullets: [
      { title: 'Una Sola Verdad Corporativa', desc: 'Ventas, Compras, Bodega, Finanzas y Nómina sincronizados al segundo sin hojas de cálculo dispersas.' },
      { title: 'Decisiones con Datos Vivos', desc: 'Dashboards directivos e indicadores clave de rentabilidad para la toma ágil de decisiones.' },
      { title: 'Metodología B1 Center', desc: 'Puesta en marcha garantizada en 4 semanas con plantillas de industria listas.' }
    ],
    highlight: { label: 'Impacto Comprobado', value: '4 Semanas', detail: 'Tiempo promedio de implementación con B1 Center' },
    speakerNotes: 'Apertura: Saluda cordialmente al Director General y Director Financiero. Agradece su tiempo y aclara el objetivo: "Hoy no venimos a mostrarles pantallas técnicas aburridas, sino a demostrar cómo Finix ERP elimina el desorden operativo y protege el dinero de su empresa".',
    iconName: 'Building2'
  },
  {
    number: 2,
    tag: 'Diagnóstico Operativo',
    title: 'El Costo Oculto del Descontrol: Por Qué Fallan las Hojas de Cálculo',
    subtitle: 'Las empresas medianas pierden entre el 8% y el 15% de su margen neto anual en fugas no detectadas.',
    bullets: [
      { title: 'Caos de Inventario y Mermas', desc: 'Ventas promete stock que ya se vendió; bodega tiene productos vencidos o perdidos sin responsable visible.' },
      { title: 'Ventas a Clientes Insolventes', desc: 'Vendedores que comisionan sin control mientras la cartera vencida se acumula en facturas incobrables.' },
      { title: 'Riesgo Tributario y Multas SRI', desc: 'Cálculos manuales de retenciones, errores de IVA y facturación desfasada que provocan glosas fiscales.' }
    ],
    highlight: { label: 'Fuga Estimada', value: '-12% Margen', detail: 'Pérdida operativa en empresas sin ERP integrado' },
    speakerNotes: 'Conexión con el dolor: Pregunta al CEO: "¿Don Carlos, alguna vez un cliente le ha cancelado un pedido porque bodega dijo que había stock y en realidad no había?". Deja que responda y asiente: "Ese dolor le cuesta miles de dólares al año a su compañía".',
    iconName: 'ShieldAlert'
  },
  {
    number: 3,
    tag: 'Arquitectura de Solución',
    title: 'La Propuesta de Valor: Cero Doble Digitación y Datos en Tiempo Real',
    subtitle: 'El ERP conecta todas las áreas en una sola base de datos transaccional e inmutable.',
    bullets: [
      { title: 'Del Lead a la Contabilidad', desc: 'Lo que el asesor cotiza, bodega lo despacha y contabilidad lo registra sin recapturar un solo dato.' },
      { title: 'Pistas de Auditoría Inmutables', desc: 'Cada transacción registra usuario, fecha, hora exacta y monto con certificación antifraude.' },
      { title: 'Acceso en la Nube y Móvil', desc: 'Consulte estados de cuenta, autorice descuentos y supervise la operación desde cualquier dispositivo.' }
    ],
    highlight: { label: 'Eficiencia Operativa', value: '0 Errores', detail: 'Erradicación total de la recaptura manual de datos' },
    speakerNotes: 'Demostración de valor: "A diferencia de tener un software contable aislado y diez archivos de Excel en ventas, Finix ERP crea una autopista digital donde cada departamento alimenta al siguiente de forma automática".',
    iconName: 'Sparkles'
  },
  {
    number: 4,
    tag: 'Flujo Central de Negocio',
    title: 'Ciclo Order-to-Cash Automatizado: De la Oferta al Banco en Minutos',
    subtitle: 'Un proceso secuencial, controlado y auditado de principio a fin.',
    bullets: [
      { title: '1. Cotización Multi-Línea Ágil', desc: 'Precios mayoristas automáticos y validación de margen en 60 segundos con PDF corporativo.' },
      { title: '2. Pedido con Reserva de Stock', desc: 'El inventario pasa a comprometido al instante para blindar la promesa de entrega al cliente.' },
      { title: '3. Despacho y Facturación SRI', desc: 'Descarga automática de kardex al costo ponderado y factura electrónica con IVA 15% 2026.' }
    ],
    highlight: { label: 'Tiempo de Ciclo', value: '90% Menos', detail: 'Reducción del tiempo de emisión desde cotización a factura' },
    speakerNotes: 'Paso a la acción: "Este flujo lo veremos en vivo en el simulador en unos minutos. Noten cómo el inventario y la contabilidad se actualizan en el mismo segundo en que el camión sale de la bodega".',
    iconName: 'TrendingUp'
  },
  {
    number: 5,
    tag: 'Control Financiero',
    title: 'Blindaje de Liquidez: Control de Crédito y Protección de Margen',
    subtitle: 'Reglas matemáticas estrictas que defienden el capital de trabajo de los accionistas.',
    bullets: [
      { title: 'Límites de Crédito Inquebrantables', desc: 'El sistema bloquea automáticamente ventas a clientes morosos o que superen su cupo autorizado.' },
      { title: 'Alerta de Margen Bruto Crítico', desc: 'Ningún vendedor puede otorgar descuentos que vulneren el piso mínimo de rentabilidad corporativa.' },
      { title: 'Flujo de Aprobaciones Digitales', desc: 'Las excepciones estratégicas son autorizadas por el Gerente General desde su teléfono con un clic.' }
    ],
    highlight: { label: 'Protección de Caja', value: '100% Blindado', detail: 'Cero ventas a morosos sin autorización previa de la gerencia' },
    speakerNotes: 'Dirígete al CFO: "Licenciado, con Finix ERP usted duerme tranquilo. Si un cliente debe facturas vencidas, el vendedor no puede facturarle ni un solo centavo sin que usted lo autorice formalmente en el sistema".',
    iconName: 'ShieldAlert'
  },
  {
    number: 6,
    tag: 'Cumplimiento Fiscal SRI 2026',
    title: 'Facturación Electrónica y Retenciones SRI Ecuador 2026 Nativas',
    subtitle: 'Actualizado a la normativa tributaria vigente: IVA 15%, retenciones y generación de RIDE.',
    bullets: [
      { title: 'Tarifa General IVA 15%', desc: 'Cálculo automático de bases imponibles y desglose de tarifas diferenciadas según la ley tributaria 2026.' },
      { title: 'Retenciones en la Fuente Automáticas', desc: 'Gestión transparente de retenciones de Renta (2%) e IVA (30%) conciliadas contra la factura emitida.' },
      { title: 'Emisión de RIDE y XML Legal', desc: 'Comprobantes autorizados con clave de acceso de 49 dígitos, QR y envío automático por correo al cliente.' }
    ],
    highlight: { label: 'Fiscalidad SRI', value: '100% Nativo', detail: 'Sin software intermedio ni recapturas para el Anexo Transaccional ATS' },
    speakerNotes: 'Argumento tributario: "Olvídese de parches o integradores externos que cobran por cada XML. Finix ERP emite la factura electrónica SRI, calcula las retenciones y prepara el anexo transaccional de forma nativa e ilimitada".',
    iconName: 'FileText'
  },
  {
    number: 7,
    tag: 'Herramienta Estrella',
    title: 'La Joya de la Corona: El Mapa de Relaciones Interactivo',
    subtitle: 'Auditoría directiva en vivo: toda la historia de una operación en un solo pantallazo.',
    bullets: [
      { title: 'Trazabilidad Visual Completa', desc: 'Conecta en un árbol gráfico la cotización, pedido, entrega, factura, retención, cobro y asiento contable.' },
      { title: 'Auditoría en Un Clic (Drill-Down)', desc: 'Haga doble clic en cualquier nodo para abrir el documento original y verificar quién lo emitió y cuándo.' },
      { title: 'Fin a las Disputas Internas', desc: 'Ante cualquier duda del cliente o reclamo de auditoría, la respuesta está visible en menos de 10 segundos.' }
    ],
    highlight: { label: 'Tiempo de Auditoría', value: '10 Segundos', detail: 'Para reconstruir el historial completo de cualquier transacción' },
    speakerNotes: 'El momento WOW: Abre los brazos con seguridad: "Esta pantalla que están viendo es lo que convence a 9 de cada 10 directores. Imaginen poder responder a un auditor o a un socio en diez segundos con la cadena documental completa en pantalla".',
    iconName: 'Sparkles'
  },
  {
    number: 8,
    tag: 'Retorno de Inversión',
    title: 'Justificación Financiera: El ERP que se Paga Solo en Menos de 6 Meses',
    subtitle: 'El análisis de costo-beneficio para una empresa que factura $100,000 a $300,000 mensuales.',
    bullets: [
      { title: 'Ahorro por Mermas y Errores', desc: 'Reducción del 2% en pérdidas de inventario = $2,000 a $4,000 USD mensuales recuperados.' },
      { title: 'Aceleración de Cobranza (DSO)', desc: 'Facturación inmediata el mismo día de entrega = Reducción de 12 días en el ciclo de caja.' },
      { title: 'Horas Hombre Administrativas', desc: 'Eliminación de 40 horas al mes por digitación manual y cuadres contables de fin de mes.' }
    ],
    highlight: { label: 'Retorno Estimado', value: '< 6 Meses', detail: 'Período de amortización integral de la inversión con B1 Center' },
    speakerNotes: 'Cierre financiero: "Don Carlos, la pregunta no es si Finix ERP cuesta dinero. La realidad es que hoy su empresa ya está pagando el equivalente a dos ERPs en mermas, cobros atrasados y horas extras de digitación. Es hora de convertir esa pérdida en utilidad".',
    iconName: 'TrendingUp'
  },
  {
    number: 9,
    tag: 'Guía de Respuestas',
    title: 'Arsenal Anti-Objeciones: Respuestas Concretas a Dudas Comunes',
    subtitle: 'Cómo responder con solvencia a las 5 preguntas que todo comité de compras formula.',
    bullets: [
      { title: '1. "Es muy costoso"', desc: 'Caro es perder clientes por despachos fallidos. Finix ERP genera retorno medible desde el primer mes.' },
      { title: '2. "El personal se resistirá"', desc: 'Cockpit ultra simplificado: cada empleado ve únicamente los tres botones necesarios para su jornada.' },
      { title: '3. "Tardará meses en funcionar"', desc: 'Nuestra metodología B1 Center utiliza empresas semilla preconfiguradas para salir en 4 semanas.' },
      { title: '4. "Ya tenemos software contable"', desc: 'La contabilidad registra el pasado cuando el error ya costó dinero; Finix ERP controla la operación en vivo.' }
    ],
    highlight: { label: 'Tasa de Adopción', value: '98%', detail: 'De usuarios operativos adaptados en las dos primeras semanas' },
    speakerNotes: 'Uso interno del vendedor: Este slide te da el respaldo total ante las dudas del cliente. Si dicen que ya tienen software contable, recuérdales que el software contable no controla la bodega ni frena las ventas a morosos en el mostrador.',
    iconName: 'MessageSquare'
  },
  {
    number: 10,
    tag: 'Llamada a la Acción',
    title: 'El Próximo Paso: Taller de Diagnóstico y Empresa de Práctica',
    subtitle: 'Comprobemos el valor de Finix ERP con los datos y procesos reales de su compañía.',
    bullets: [
      { title: '1. Sesión de Alcance Sin Costo', desc: 'Revisamos sus procesos clave de ventas, bodega y facturación con sus responsables de área.' },
      { title: '2. Configuración en B1 Center', desc: 'Cargamos sus familias de artículos, listas de precios y clientes en una empresa de prueba dedicada.' },
      { title: '3. Demostración Personalizada', desc: 'Presentamos a su directorio la operación exacta de su negocio corriendo en Finix ERP 10.0.' }
    ],
    highlight: { label: 'Siguiente Hito', value: 'Agenda Hoy', detail: 'Definamos la fecha para el Taller de Diagnóstico Operativo' },
    speakerNotes: 'Cierre consultivo: "Don Carlos, Licenciado, el siguiente paso no es firmar un contrato a ciegas. Les propongo agendar un Taller de Diagnóstico de 45 minutos esta semana para cargar su catálogo en su empresa de práctica B1 Center y que vean su propia operación funcionando. ¿Les parece mejor el martes o el jueves por la mañana?".',
    iconName: 'Check'
  }
];

export default function PresentacionComercialPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slide = SLIDES[currentSlide];

  // Atajos de teclado para presentaciones profesionales
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, SLIDES.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Ocultar navegación en modo fullscreen */}
      {!isFullscreen && <Navbar />}

      {/* Cápsula GEO */}
      <aside aria-label="Resumen de Presentación Comercial" className="sr-only">
        Presentación comercial oficial de Finix ERP 10.0: dossier ejecutivo de ventas para directores y gerentes generales.
        Cubre dolores empresariales, flujo Order-to-Cash, cumplimiento tributario SRI 2026 con IVA 15%, Mapa de Relaciones y retorno de inversión en 4 semanas.
      </aside>

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 justify-between">
        {/* Barra superior de herramientas de presentación */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-600 text-white shadow-md shadow-blue-500/20">
              Pitch Deck Oficial
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Diapositiva {slide.number} de {SLIDES.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                showNotes
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
              title="Atajo: Tecla N"
            >
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
              {showNotes ? 'Ocultar Notas' : 'Notas del Orador (N)'}
            </button>

            <Link
              href="/simulador"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:border-blue-500/50 hover:text-blue-400 transition-all active:scale-95"
            >
              <Wrench className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
              Abrir Simulador
            </Link>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition-all active:scale-95"
              title="Imprimir presentación o guardar como PDF"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              Imprimir / PDF
            </button>

            <button
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition-all active:scale-95"
              title="Pantalla completa"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        {/* Diapositiva Principal Activa */}
        <section aria-labelledby="slide-title" className="my-auto py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Columna Izquierda: Contenido Central */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  {slide.tag}
                </p>
                <h1 id="slide-title" className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg text-slate-400 font-medium leading-relaxed">
                  {slide.subtitle}
                </p>
              </div>

              {/* Lista de Puntos Clave */}
              <div className="space-y-4 pt-2">
                {slide.bullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm hover:border-blue-500/40 transition-all"
                  >
                    <div className="h-8 w-8 shrink-0 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-sm sm:text-base font-bold text-white">
                        {bullet.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {bullet.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna Derecha: Tarjeta de Impacto / Métrica */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-6">
              <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-blue-950/60 via-slate-900/90 to-slate-950 border border-blue-500/30 shadow-2xl flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                    {slide.highlight.label}
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {slide.highlight.value}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                    {slide.highlight.detail}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    Garantía de Metodología B1 Center
                  </div>
                  <Link
                    href="/simulador"
                    target="_blank"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/30"
                  >
                    <Play className="w-3.5 h-3.5" aria-hidden="true" />
                    Ver en Simulador en Vivo
                  </Link>
                </div>
              </div>

              {/* Modo Notas del Orador (Desplegable) */}
              {showNotes && (
                <div className="rounded-2xl p-5 bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-amber-400">
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                    Guion para el Consultor Comercial (Notas)
                  </div>
                  <p className="leading-relaxed text-amber-100">
                    {slide.speakerNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Barra de Navegación Inferior (Controles + Miniaturas) */}
        <footer className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Indicadores de diapositivas */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 sm:pb-0">
            {SLIDES.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentSlide
                    ? 'w-8 bg-blue-500 shadow-md shadow-blue-500/50'
                    : 'w-2.5 bg-slate-800 hover:bg-slate-700'
                }`}
                aria-label={`Ir a la diapositiva ${s.number}`}
              />
            ))}
          </div>

          {/* Botones Anterior / Siguiente */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:border-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Anterior
            </button>

            <button
              onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, SLIDES.length - 1))}
              disabled={currentSlide === SLIDES.length - 1}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </footer>
      </main>

      {!isFullscreen && <Footer />}
    </div>
  );
}
