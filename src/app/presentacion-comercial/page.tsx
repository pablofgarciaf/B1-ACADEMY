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
    "number": 1,
    "tag": "Formación para empresas",
    "title": "Aprender procesos con una empresa de laboratorio",
    "subtitle": "Capacitación práctica para conectar operación, documentos y resultados.",
    "bullets": [
      {
        "title": "Objetivos por equipo",
        "desc": "Definimos los procesos y conocimientos que necesita desarrollar cada grupo."
      },
      {
        "title": "Práctica guiada",
        "desc": "Los estudiantes trabajan con datos sintéticos en un entorno educativo."
      },
      {
        "title": "Diagnóstico previo",
        "desc": "El alcance y el calendario se acuerdan después de evaluar las necesidades."
      }
    ],
    "highlight": {
      "label": "Enfoque",
      "value": "Aprender haciendo",
      "detail": "El simulador es un recurso de formación, sujeto a configuración y validación."
    },
    "speakerNotes": "Demuestra únicamente lo que esté disponible y verificado en el entorno de prueba. Explica los límites y los datos pendientes.",
    "iconName": "Building2"
  },
  {
    "number": 2,
    "tag": "Diagnóstico",
    "title": "Identificar el proceso que necesita mejorar",
    "subtitle": "Empezamos por observar el trabajo y acordar cómo medirlo.",
    "bullets": [
      {
        "title": "Datos de partida",
        "desc": "Revisar calidad de maestros, documentos y responsables."
      },
      {
        "title": "Riesgos observables",
        "desc": "Identificar duplicados, faltantes y diferencias entre registros."
      },
      {
        "title": "Criterios de aceptación",
        "desc": "Definir resultados que puedan comprobarse al terminar la formación."
      }
    ],
    "highlight": {
      "label": "Primer paso",
      "value": "Diagnóstico",
      "detail": "No se prometen porcentajes de ahorro sin medición."
    },
    "speakerNotes": "Demuestra únicamente lo que esté disponible y verificado en el entorno de prueba. Explica los límites y los datos pendientes.",
    "iconName": "ShieldAlert"
  },
  {
    "number": 3,
    "tag": "Entorno educativo",
    "title": "Documentos relacionados y evidencia de práctica",
    "subtitle": "Cada ejercicio debe demostrar una operación o una consulta concreta.",
    "bullets": [
      {
        "title": "Operaciones",
        "desc": "Las prácticas de escritura se verifican contra una operación registrada del alumno."
      },
      {
        "title": "Consultas",
        "desc": "Los ejercicios de lectura usan datos y cálculos explícitos del escenario."
      },
      {
        "title": "Trazabilidad",
        "desc": "La verificación de integridad necesita permisos, referencias confiables y respaldos."
      }
    ],
    "highlight": {
      "label": "Evidencia",
      "value": "Verificable",
      "detail": "Una consulta no sustituye una autorización empresarial."
    },
    "speakerNotes": "Demuestra únicamente lo que esté disponible y verificado en el entorno de prueba. Explica los límites y los datos pendientes.",
    "iconName": "Sparkles"
  },
  {
    "number": 4,
    "tag": "Recorrido comercial",
    "title": "De la oferta al cobro de prueba",
    "subtitle": "Una secuencia para comprender efectos y documentos base.",
    "bullets": [
      {
        "title": "Oferta y pedido",
        "desc": "Revisar cliente, artículos, precios y cantidades."
      },
      {
        "title": "Entrega y factura",
        "desc": "Comprobar stock, asientos y cuenta por cobrar del escenario."
      },
      {
        "title": "Cobro",
        "desc": "Aplicar el pago a la factura correcta y revisar el saldo."
      }
    ],
    "highlight": {
      "label": "Flujo",
      "value": "5 etapas",
      "detail": "Oferta → pedido → entrega → factura → cobro."
    },
    "speakerNotes": "Demuestra únicamente lo que esté disponible y verificado en el entorno de prueba. Explica los límites y los datos pendientes.",
    "iconName": "TrendingUp"
  },
  {
    "number": 5,
    "tag": "Control financiero",
    "title": "Comprender crédito, margen y saldo",
    "subtitle": "Los cálculos respaldan el análisis; no eliminan el riesgo comercial.",
    "bullets": [
      {
        "title": "Crédito",
        "desc": "Distinguir límite, saldo, compromisos y decisiones autorizadas."
      },
      {
        "title": "Margen",
        "desc": "Calcular margen sobre venta con costos y descuentos identificados."
      },
      {
        "title": "Revisión",
        "desc": "Contrastar documentos, auxiliares y mayor antes de concluir."
      }
    ],
    "highlight": {
      "label": "Objetivo",
      "value": "Comprensión",
      "detail": "La formación no garantiza cobros o rentabilidad."
    },
    "speakerNotes": "Demuestra únicamente lo que esté disponible y verificado en el entorno de prueba. Explica los límites y los datos pendientes.",
    "iconName": "ShieldAlert"
  },
  {
    "number": 6,
    "tag": "Alcance fiscal",
    "title": "Separar simulación y operación fiscal real",
    "subtitle": "Los comprobantes del laboratorio no son documentos autorizados por el SRI.",
    "bullets": [
      {
        "title": "Parámetros de prueba",
        "desc": "Revisar base imponible, tarifa configurada y total del caso."
      },
      {
        "title": "Contexto de operación",
        "desc": "La aplicación real depende del régimen, sujetos, concepto y fecha."
      },
      {
        "title": "Activación posterior",
        "desc": "Firma, autorización, rechazos y normativa requieren validación específica."
      }
    ],
    "highlight": {
      "label": "Estado",
      "value": "Simulación",
      "detail": "No se presenta una integración fiscal de producción como activa."
    },
    "speakerNotes": "Demuestra únicamente lo que esté disponible y verificado en el entorno de prueba. Explica los límites y los datos pendientes.",
    "iconName": "FileText"
  },
  {
    "number": 7,
    "tag": "Trazabilidad",
    "title": "Reconstruir una operación con referencias",
    "subtitle": "Seguir los documentos y comprobar sus efectos.",
    "bullets": [
      {
        "title": "Documento base",
        "desc": "Identificar el origen del pedido, entrega y factura."
      },
      {
        "title": "Cambios registrados",
        "desc": "Revisar responsable, fecha y cambios disponibles."
      },
      {
        "title": "Reconciliación",
        "desc": "Comparar cantidades, importes, saldos y asientos relacionados."
      }
    ],
    "highlight": {
      "label": "Método",
      "value": "Comprobar",
      "detail": "La trazabilidad se verifica con evidencia, sin promesas de inmutabilidad absoluta."
    },
    "speakerNotes": "Demuestra únicamente lo que esté disponible y verificado en el entorno de prueba. Explica los límites y los datos pendientes.",
    "iconName": "Sparkles"
  },
  {
    "number": 8,
    "tag": "Caso numérico",
    "title": "Calcular una recuperación simple",
    "subtitle": "Ejemplo hipotético para aprender a justificar una propuesta.",
    "bullets": [
      {
        "title": "Inversión supuesta",
        "desc": "12000 dólares de inversión inicial."
      },
      {
        "title": "Ahorro supuesto",
        "desc": "1000 dólares netos al mes, constantes y verificables en el caso."
      },
      {
        "title": "Cálculo",
        "desc": "12000 dividido para 1000: doce meses de recuperación simple."
      }
    ],
    "highlight": {
      "label": "Ejemplo",
      "value": "12 meses",
      "detail": "No es una previsión comercial ni una garantía de resultados."
    },
    "speakerNotes": "Demuestra únicamente lo que esté disponible y verificado en el entorno de prueba. Explica los límites y los datos pendientes.",
    "iconName": "TrendingUp"
  },
  {
    "number": 9,
    "tag": "Adopción",
    "title": "Formación y alcance acordes al equipo",
    "subtitle": "El calendario depende de procesos, datos y experiencia de los participantes.",
    "bullets": [
      {
        "title": "Necesidades",
        "desc": "Identificar tareas, conocimientos previos y responsables."
      },
      {
        "title": "Práctica y evaluación",
        "desc": "Completar ejercicios y evaluar resultados antes de emitir una constancia."
      },
      {
        "title": "Seguimiento",
        "desc": "Revisar errores y reforzar habilidades con evidencia."
      }
    ],
    "highlight": {
      "label": "Constancia",
      "value": "Finix Academy",
      "detail": "No constituye título oficial ni acreditación de un fabricante."
    },
    "speakerNotes": "Demuestra únicamente lo que esté disponible y verificado en el entorno de prueba. Explica los límites y los datos pendientes.",
    "iconName": "MessageSquare"
  },
  {
    "number": 10,
    "tag": "Siguiente paso",
    "title": "Solicitar formación para tu empresa",
    "subtitle": "Comparte el objetivo del equipo para preparar una propuesta de capacitación.",
    "bullets": [
      {
        "title": "Necesidad",
        "desc": "Describe procesos y resultados de aprendizaje esperados."
      },
      {
        "title": "Equipo",
        "desc": "Indica número de participantes y conocimientos previos."
      },
      {
        "title": "Contacto",
        "desc": "La solicitud queda registrada para revisión en el panel administrativo."
      }
    ],
    "highlight": {
      "label": "Solicitud",
      "value": "Formación empresarial",
      "detail": "Completa el formulario en la sección Empresas."
    },
    "speakerNotes": "Demuestra únicamente lo que esté disponible y verificado en el entorno de prueba. Explica los límites y los datos pendientes.",
    "iconName": "Check"
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
        Presentación de la formación empresarial de Finix Academy.
        Recorrido educativo de documentos, análisis de crédito y margen, trazabilidad y recuperación simple con supuestos explícitos.
      </aside>

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 justify-between">
        {/* Barra superior de herramientas de presentación */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-600 text-white shadow-md shadow-blue-500/20">
              Formación empresarial
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
