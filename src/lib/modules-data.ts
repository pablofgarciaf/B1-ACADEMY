/**
 * Índice maestro de los 12 módulos del Manual SAP Business One 10.0
 * Este archivo es la fuente de verdad para el LMS (/mi-aula).
 * Cada módulo mapea a un archivo Markdown en public/modulos/Modulo_XX.md
 */

export interface ModuleLesson {
  id: string;
  title: string;
}

export interface TrainingModule {
  id: string;           // "01", "02", ... "12"
  slug: string;         // "modulo-01"
  fileName: string;     // "Modulo_01.md"
  title: string;
  shortTitle: string;
  description: string;
  durationMinutes: number;
  lessonsCount: number;
  lessons: ModuleLesson[];
  level: 'basico' | 'intermedio' | 'avanzado';
  icon: string;         // Lucide icon name hint
  keywords: string[];
}

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: '01',
    slug: 'modulo-01',
    fileName: 'Modulo_01.md',
    title: 'Fundamentos, Navegación y Entorno Fiori',
    shortTitle: 'Fundamentos y Navegación',
    description: 'Arquitectura técnica de SAP B1, modelo de empresa, plataformas de BD, Cockpit Fiori y personalización del entorno.',
    durationMinutes: 45,
    lessonsCount: 3,
    lessons: [
      { id: '01-L1', title: 'Visión General, Arquitectura Técnica y Modelo de Empresa' },
      { id: '01-L2', title: 'Navegación, Búsquedas y Personalización del Cockpit Fiori' },
      { id: '01-L3', title: 'Caso Práctico Resuelto - Configuración, Ventas y Auditoría' },
    ],
    level: 'basico',
    icon: 'Monitor',
    keywords: ['SAP B1', 'Fiori', 'Cockpit', 'navegación', 'arquitectura'],
  },
  {
    id: '02',
    slug: 'modulo-02',
    fileName: 'Modulo_02.md',
    title: 'Compras y Aprovisionamiento (Procure-to-Pay)',
    shortTitle: 'Compras (P2P)',
    description: 'Solicitudes de compra, pedidos, recepciones de mercancía (GRPO), facturas de proveedores, devoluciones, costes de destino y asistente de pagos.',
    durationMinutes: 60,
    lessonsCount: 3,
    lessons: [
      { id: '02-L1', title: 'Proceso de Compras: Solicitud, Pedido y Recepción' },
      { id: '02-L2', title: 'Facturación de Proveedores, Devoluciones y Costes de Destino' },
      { id: '02-L3', title: 'Caso Práctico: Ciclo Completo Procure-to-Pay' },
    ],
    level: 'basico',
    icon: 'Package',
    keywords: ['compras', 'procure-to-pay', 'GRPO', 'proveedores', 'costes de destino'],
  },
  {
    id: '03',
    slug: 'modulo-03',
    fileName: 'Modulo_03.md',
    title: 'Ciclo de Ventas Completo (Order-to-Cash)',
    shortTitle: 'Ventas (Order-to-Cash)',
    description: 'Flujo completo desde la oferta hasta la factura y cobro, incluyendo documentos de marketing y reglas de arrastre.',
    durationMinutes: 60,
    lessonsCount: 3,
    lessons: [
      { id: '03-L1', title: 'Proceso de Ventas: Oferta, Pedido y Entrega' },
      { id: '03-L2', title: 'Facturación, Notas de Crédito y Cobros' },
      { id: '03-L3', title: 'Caso Práctico: Ciclo Completo Order-to-Cash' },
    ],
    level: 'basico',
    icon: 'ShoppingCart',
    keywords: ['ventas', 'order-to-cash', 'facturación', 'cobros'],
  },
  {
    id: '04',
    slug: 'modulo-04',
    fileName: 'Modulo_04.md',
    title: 'Ciclo de Compras Completo (Procure-to-Pay)',
    shortTitle: 'Compras (Procure-to-Pay)',
    description: 'Solicitudes de compra, pedidos, recepciones de mercancía, facturas de proveedores y pagos.',
    durationMinutes: 60,
    lessonsCount: 3,
    lessons: [
      { id: '04-L1', title: 'Proceso de Compras: Solicitud, Pedido y Recepción' },
      { id: '04-L2', title: 'Facturación de Proveedores y Pagos' },
      { id: '04-L3', title: 'Caso Práctico: Ciclo Completo Procure-to-Pay' },
    ],
    level: 'basico',
    icon: 'Package',
    keywords: ['compras', 'procure-to-pay', 'proveedores', 'recepciones'],
  },
  {
    id: '05',
    slug: 'modulo-05',
    fileName: 'Modulo_05.md',
    title: 'Gestión de Inventario y Almacenes',
    shortTitle: 'Inventario y Almacenes',
    description: 'Movimientos de stock, transferencias, métodos de valoración, números de serie, lotes y control de calidad.',
    durationMinutes: 60,
    lessonsCount: 3,
    lessons: [
      { id: '05-L1', title: 'Estructura de Almacenes y Movimientos de Stock' },
      { id: '05-L2', title: 'Métodos de Valoración y Costos' },
      { id: '05-L3', title: 'Series, Lotes y Trazabilidad' },
    ],
    level: 'intermedio',
    icon: 'Warehouse',
    keywords: ['inventario', 'almacenes', 'stock', 'valoración', 'lotes'],
  },
  {
    id: '06',
    slug: 'modulo-06',
    fileName: 'Modulo_06.md',
    title: 'Gestión de Servicio al Cliente (Tarjetas de Equipo, Contratos SLA y Llamadas)',
    shortTitle: 'Servicio al Cliente',
    description: 'Tarjetas de equipo, contratos de servicio (SLA), llamadas de servicio y gestión de garantías.',
    durationMinutes: 60,
    lessonsCount: 3,
    lessons: [
      { id: '06-L1', title: 'Tarjetas de Equipo y Garantías' },
      { id: '06-L2', title: 'Contratos de Servicio y SLA' },
      { id: '06-L3', title: 'Llamadas de Servicio y Ciclo de Vida' },
    ],
    level: 'intermedio',
    icon: 'Headphones',
    keywords: ['servicio', 'SLA', 'llamadas', 'equipo', 'garantías'],
  },
  {
    id: '07',
    slug: 'modulo-07',
    fileName: 'Modulo_07.md',
    title: 'Gestión de Proyectos y Facturación por Hitos',
    shortTitle: 'Proyectos y Facturación',
    description: 'Estructura de proyectos, subproyectos, asistente de facturación por hitos, reconocimiento de ingresos y seguimiento de costes.',
    durationMinutes: 60,
    lessonsCount: 3,
    lessons: [
      { id: '07-L1', title: 'Estructura de Proyectos y Subproyectos' },
      { id: '07-L2', title: 'Asistente de Facturación por Hitos (Billing Wizard)' },
      { id: '07-L3', title: 'Caso Práctico: Proyecto con Facturación Parcial' },
    ],
    level: 'intermedio',
    icon: 'FolderKanban',
    keywords: ['proyectos', 'facturación', 'hitos', 'billing wizard', 'subproyectos'],
  },
  {
    id: '08',
    slug: 'modulo-08',
    fileName: 'Modulo_08.md',
    title: 'Administración del Sistema, Migración de Datos (DTW) y Seguridad',
    shortTitle: 'Administración y DTW',
    description: 'Configuración de empresa, usuarios y grupos, autorizaciones, series de documentos, plantillas de impresión, alertas e importación/exportación DTW.',
    durationMinutes: 60,
    lessonsCount: 3,
    lessons: [
      { id: '08-L1', title: 'Configuración de Empresa, Usuarios y Autorizaciones' },
      { id: '08-L2', title: 'Data Transfer Workbench (DTW) y Series de Documentos' },
      { id: '08-L3', title: 'Alertas, Plantillas y Herramientas de Administración' },
    ],
    level: 'avanzado',
    icon: 'Shield',
    keywords: ['administración', 'DTW', 'seguridad', 'usuarios', 'autorizaciones'],
  },
  {
    id: '09',
    slug: 'modulo-09',
    fileName: 'Modulo_09.md',
    title: 'Soporte Técnico, Herramientas de Diagnóstico y Plataforma RSP',
    shortTitle: 'Soporte Técnico y RSP',
    description: 'Remote Support Platform, herramientas de diagnóstico, SAP for Me, notas SAP y gestión de incidentes.',
    durationMinutes: 45,
    lessonsCount: 3,
    lessons: [
      { id: '09-L1', title: 'Modelo de Soporte N1/N2/N3 y SAP for Me' },
      { id: '09-L2', title: 'Remote Support Platform (RSP) y Herramientas de Diagnóstico' },
      { id: '09-L3', title: 'Gestión de Incidentes y Escalamiento' },
    ],
    level: 'avanzado',
    icon: 'LifeBuoy',
    keywords: ['soporte', 'RSP', 'diagnóstico', 'incidentes', 'SAP for Me'],
  },
  {
    id: '10',
    slug: 'modulo-10',
    fileName: 'Modulo_10.md',
    title: 'Contabilidad Financiera, Gestión Bancaria y Activos Fijos',
    shortTitle: 'Contabilidad y Finanzas',
    description: 'Plan de cuentas, asientos contables, medios de pago, conciliaciones, asistente de pagos y activos fijos.',
    durationMinutes: 75,
    lessonsCount: 4,
    lessons: [
      { id: '10-L1', title: 'Plan de Cuentas y Determinación de Cuentas' },
      { id: '10-L2', title: 'Medios de Pago y Cuentas de Compensación' },
      { id: '10-L3', title: 'Asistente de Pagos y Conciliaciones' },
      { id: '10-L4', title: 'Submódulo de Activos Fijos' },
    ],
    level: 'avanzado',
    icon: 'Calculator',
    keywords: ['contabilidad', 'finanzas', 'plan de cuentas', 'activos fijos', 'conciliación'],
  },
  {
    id: '11',
    slug: 'modulo-11',
    fileName: 'Modulo_11.md',
    title: 'Personalización Avanzada, Automatizaciones y Analítica en Tiempo Real',
    shortTitle: 'Personalización y Automatización',
    description: 'Campos definidos por usuario (UDF), tablas (UDT), objetos (UDO), búsquedas formateadas, autorizaciones y HANA Analytics.',
    durationMinutes: 75,
    lessonsCount: 4,
    lessons: [
      { id: '11-L1', title: 'UDFs, UDTs y UDOs' },
      { id: '11-L2', title: 'Búsquedas Formateadas (FMS)' },
      { id: '11-L3', title: 'Procedimientos de Autorización' },
      { id: '11-L4', title: 'Analítica HANA y Pervasive Analytics' },
    ],
    level: 'avanzado',
    icon: 'Settings2',
    keywords: ['UDF', 'UDT', 'UDO', 'FMS', 'autorizaciones', 'HANA'],
  },
  {
    id: '12',
    slug: 'modulo-12',
    fileName: 'Modulo_12.md',
    title: 'Implementación, Migración de Datos y Metodología AIP',
    shortTitle: 'Implementación y Migración',
    description: 'Metodología AIP (Accelerated Implementation Program), DTW, Quick Copy, cutover y puesta en marcha.',
    durationMinutes: 60,
    lessonsCount: 3,
    lessons: [
      { id: '12-L1', title: 'Metodología AIP y Fases del Proyecto' },
      { id: '12-L2', title: 'Herramientas de Migración: DTW y Quick Copy' },
      { id: '12-L3', title: 'Cutover, Go-Live y Estabilización' },
    ],
    level: 'avanzado',
    icon: 'Rocket',
    keywords: ['implementación', 'AIP', 'DTW', 'migración', 'go-live'],
  },
];

/** Helper: buscar un módulo por su slug */
export function getModuleBySlug(slug: string): TrainingModule | undefined {
  return TRAINING_MODULES.find((m) => m.slug === slug);
}

/** Helper: buscar un módulo por su id numérico ("01", "02"...) */
export function getModuleById(id: string): TrainingModule | undefined {
  return TRAINING_MODULES.find((m) => m.id === id);
}

/** Total de horas del programa completo */
export const TOTAL_PROGRAM_HOURS = Math.round(
  TRAINING_MODULES.reduce((acc, m) => acc + m.durationMinutes, 0) / 60
);
