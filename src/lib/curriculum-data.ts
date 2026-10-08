import CLASES_AULA from '@/content/aula/clases.json';

export interface SyllabusClass {
  id: string;
  number: number;
  title: string;
  description: string;
  durationMinutes: number;
}

export type SyllabusBlock = 'Fundamentos' | 'Logística' | 'Comercial' | 'Finanzas' | 'Producción' | 'Sistema y Consultoría' | 'Proyecto Final';

export interface SyllabusModule {
  /** Clave estable (progreso, láminas y clases publicadas dependen de ella): nunca se renumera. */
  id: string;
  /** Número visible para el alumno: sigue el orden pedagógico. */
  number: number;
  title: string;
  description: string;
  badge: string;
  block: SyllabusBlock;
  /** Certificado de competencia que otorga el módulo: nombrado por lo que el alumno sabe hacer en el trabajo. */
  certificateTitle: string;
  diplomaId?: string;
  classes: SyllabusClass[];
}

export interface SpecialtyDiploma {
  id: string;
  title: string;
  /** Rol profesional al que apunta el diploma. */
  role: string;
  requiredModules: string[];
  /** Además, al menos uno de estos diplomas (p. ej. el de consultor exige una especialidad funcional). */
  requiresOneDiplomaOf?: string[];
  description: string;
}

/** Orden pedagógico oficial: secuencia continua 1 a 25 sin saltos. */
export const OFFICIAL_SYLLABUS: SyllabusModule[] = [
  // ── 01. Fundamentos ──
  { id: 'mod-1', number: 1, block: 'Fundamentos', badge: 'Core Basics',
    title: 'Fundamentos Operativos y Navegación',
    description: 'Inducción: qué es SAP Business One, primeros pasos, escritorio y Cockpit, documentos y datos maestros, y tu empresa de práctica.',
    certificateTitle: 'Certificado en Navegación y Operación de SAP Business One', classes: [] },
  { id: 'mod-2', number: 2, block: 'Fundamentos', badge: 'Master Data',
    title: 'Núcleo Maestro ERP',
    description: 'Socios de negocio, artículos, unidades de medida y determinación estándar de precios.',
    certificateTitle: 'Certificado en Datos Maestros de Socios y Artículos', classes: [] },

  // ── 02. Ciclos Operativos (Compras y Ventas) ──
  { id: 'mod-3', number: 3, block: 'Logística', badge: 'Supply Chain',
    title: 'Aprovisionamiento y Control de Inventarios (Procure-to-Pay)',
    description: 'Ciclo Procure-to-Pay, transacciones de almacén, ubicaciones, lotes, series y costos de importación.',
    certificateTitle: 'Certificado en Compras e Inventarios (Procure-to-Pay)', classes: [] },
  { id: 'mod-4', number: 4, block: 'Comercial', badge: 'Ventas',
    title: 'Gestión de Ventas y Order-to-Cash',
    description: 'Ofertas, pedidos, entregas, facturación, devoluciones y notas de crédito.',
    certificateTitle: 'Certificado en Facturación y Ciclo de Ventas', classes: [] },
  { id: 'mod-5', number: 5, block: 'Comercial', badge: 'Precios',
    title: 'Estrategias Avanzadas de Precios y Descuentos',
    description: 'Listas de precios, descuentos por período y volumen, grupos de descuento y precios especiales.',
    certificateTitle: 'Certificado en Listas de Precios y Descuentos', classes: [] },
  { id: 'mod-6', number: 6, block: 'Comercial', badge: 'CRM',
    title: 'Gestión CRM y Servicios Post-venta',
    description: 'Relación con clientes, oportunidades, llamadas de servicio, tarjetas de equipo y garantías.',
    certificateTitle: 'Certificado en CRM y Servicio Postventa', classes: [] },

  // ── 03. Finanzas y Tesorería ──
  { id: 'mod-7', number: 7, block: 'Finanzas', badge: 'Contabilidad',
    title: 'Contabilidad Central y NIIF',
    description: 'Plan de cuentas, determinación de cuentas, asientos y cierre de períodos.',
    certificateTitle: 'Certificado en Contabilidad General NIIF', classes: [] },
  { id: 'mod-8', number: 8, block: 'Finanzas', badge: 'Tesorería',
    title: 'Tesorería, Cobros y Pagos (Bancos)',
    description: 'Pagos recibidos y efectuados, asistente de pagos, conciliación bancaria y cobranza.',
    certificateTitle: 'Certificado en Conciliación Bancaria, Cobros y Pagos', classes: [] },
  { id: 'mod-9', number: 9, block: 'Finanzas', badge: 'Activos Fijos',
    title: 'Control y Gestión de Activos Fijos',
    description: 'Configuración, alta, depreciación, ajustes y bajas de activos.',
    certificateTitle: 'Certificado en Gestión de Activos Fijos y Depreciación', classes: [] },

  // ── 04. Producción y Planificación ──
  { id: 'mod-10', number: 10, block: 'Producción', badge: 'MRP',
    title: 'Planificación de Materiales (MRP)',
    description: 'Planificación de necesidades, pronósticos, MRP con listas de materiales y órdenes sugeridas.',
    certificateTitle: 'Certificado en Planificación de Materiales (MRP)', classes: [] },
  { id: 'mod-11', number: 11, block: 'Producción', badge: 'Producción',
    title: 'Fabricación y Proyectos (BOM)',
    description: 'Listas de materiales, órdenes de producción, costos y facturación de proyectos.',
    certificateTitle: 'Certificado en Órdenes de Producción y Proyectos', classes: [] },

  // ── 05. Consultoría y Logística Avanzada ──
  { id: 'mod-12', number: 12, block: 'Sistema y Consultoría', badge: 'Consultoría',
    title: 'Consultoría y Herramientas SQL',
    description: 'Query Manager, alertas, procesos de aprobación, campos de usuario y migración con DTW.',
    certificateTitle: 'Certificado en Consultas SQL, Alertas y Migración DTW', classes: [] },
  { id: 'mod-13', number: 13, block: 'Logística', badge: 'Compras',
    title: 'Compras Avanzadas y Devoluciones',
    description: 'Solicitudes de compra, cotizaciones de proveedores, compras de servicios y devoluciones.',
    certificateTitle: 'Certificado en Cotizaciones, Compras de Servicios y Devoluciones', classes: [] },
  { id: 'mod-14', number: 14, block: 'Logística', badge: 'Valoración',
    title: 'Unidades de Medida y Valoración de Inventario',
    description: 'Unidades por peso y empaque, métodos de valoración y ajuste de costos de inventario.',
    certificateTitle: 'Certificado en Valoración de Inventario', classes: [] },
  { id: 'mod-15', number: 15, block: 'Logística', badge: 'Bodega',
    title: 'Operación de Almacén e Inventario Físico',
    description: 'Operación diaria con ubicaciones, reglas de bodega, informes y conteo físico.',
    certificateTitle: 'Certificado en Gestión de Bodega e Inventario Físico', classes: [] },
  { id: 'mod-16', number: 16, block: 'Logística', badge: 'Despacho',
    title: 'Picking, Packing y Despacho',
    description: 'Preparación de pedidos para producción y transferencias entre bodegas.',
    certificateTitle: 'Certificado en Preparación y Despacho de Pedidos', classes: [] },

  // ── 06. Finanzas Especializadas y Normativa ──
  { id: 'mod-17', number: 17, block: 'Finanzas', badge: 'Informes',
    title: 'Monedas, Cierre e Informes Financieros',
    description: 'Monedas y tipos de cambio, determinación avanzada de cuentas, vouchers, informes y flujo de caja.',
    certificateTitle: 'Certificado en Informes Financieros y Flujo de Caja', classes: [] },
  { id: 'mod-18', number: 18, block: 'Finanzas', badge: 'Costos',
    title: 'Costos, Dimensiones y Presupuestos',
    description: 'Contabilidad de costos, centros de costo con dimensiones y control presupuestario.',
    certificateTitle: 'Certificado en Centros de Costo y Presupuestos', classes: [] },
  { id: 'mod-19', number: 19, block: 'Finanzas', badge: 'SRI 2026',
    title: 'Facturación Electrónica y Retenciones SRI 2026',
    description: 'Transmisión inmediata, anulaciones, retenciones de renta e IVA según la normativa vigente del SRI.',
    certificateTitle: 'Certificado en Facturación Electrónica y Retenciones SRI 2026', classes: [] },

  // ── 07. Capacidad, Administración y Go-Live ──
  { id: 'mod-20', number: 20, block: 'Producción', badge: 'Capacidad',
    title: 'Recursos, Capacidad y Rutas de Producción',
    description: 'Recursos de producción, capacidad disponible y rutas de fabricación.',
    certificateTitle: 'Certificado en Recursos, Capacidad y Rutas de Producción', classes: [] },
  { id: 'mod-21', number: 21, block: 'Sistema y Consultoría', badge: 'Administración',
    title: 'Administración del Sistema',
    description: 'Usuarios y grupos, autorizaciones, alertas, numeración de documentos, diseños de impresión, correo y propiedad de los datos.',
    certificateTitle: 'Certificado en Administración del Sistema SAP B1', classes: [] },
  { id: 'mod-22', number: 22, block: 'Sistema y Consultoría', badge: 'Extensibilidad',
    title: 'Extensibilidad y Analítica',
    description: 'Tablas definidas por el usuario y analítica con SAP Analytics.',
    certificateTitle: 'Certificado en Tablas de Usuario y SAP Analytics', classes: [] },
  { id: 'mod-23', number: 23, block: 'Sistema y Consultoría', badge: 'Implementación',
    title: 'Implementación, Saldos Iniciales y Go-Live',
    description: 'Metodología de implementación, asistente express, saldos iniciales, Quick Copy e importación DTW.',
    certificateTitle: 'Certificado en Implementación y Puesta en Marcha', classes: [] },
  { id: 'mod-24', number: 24, block: 'Proyecto Final', badge: 'Integrador',
    title: 'Proyecto Integrador',
    description: 'Casos completos de puesta en marcha, aprovisionamiento y consultas SQL con la empresa del curso.',
    certificateTitle: 'Certificado de Proyecto Integrador SAP B1', classes: [] },
  { id: 'mod-25', number: 25, block: 'Finanzas', badge: 'Nómina 2026',
    title: 'Nómina y Talento Humano Ecuador 2026',
    description: 'Ficha del empleado, rol de pagos, horas extras, décimos, fondos de reserva, vacaciones, IESS y contabilización de la nómina con las cifras vigentes en 2026.',
    certificateTitle: 'Certificado en Nómina y Talento Humano Ecuador 2026', classes: [] },
  { id: 'mod-26', number: 26, block: 'Sistema y Consultoría', badge: 'Activate',
    title: 'Metodología de Implementación y Ciclo de Vida SAP',
    description: 'Marco metodológico SAP Activate y AIP, gobernanza de proyecto, talleres Explore, Golden DB, migración masiva y Cutover Runbook.',
    certificateTitle: 'Certificado en Metodología de Implementación SAP (Activate & AIP)', classes: [] },
  { id: 'mod-27', number: 27, block: 'Sistema y Consultoría', badge: 'BPMN 2.0',
    title: 'Modelado y Optimización de Procesos de Negocio (BPMN 2.0)',
    description: 'Notación BPMN 2.0 para ERP, diagnóstico AS-IS, diseño TO-BE con mejores prácticas SAP y traducción de compuertas a modelos de autorización.',
    certificateTitle: 'Certificado en Modelado y Optimización de Procesos (BPMN 2.0)', classes: [] },
  { id: 'mod-28', number: 28, block: 'Sistema y Consultoría', badge: 'Blueprint',
    title: 'Levantamiento de Requerimientos y Documentación de Negocio',
    description: 'Elicitación con Cinco Porqués, Business Blueprint (BBD), Historias de Usuario con Gherkin, Matriz RTM y configuración de UDFs.',
    certificateTitle: 'Certificado en Business Blueprint y Levantamiento de Requerimientos', classes: [] },
  { id: 'mod-29', number: 29, block: 'Sistema y Consultoría', badge: 'UAT & Go-Live',
    title: 'Gestión de Clientes, Pruebas UAT y Adopción del Cambio',
    description: 'Matriz de Mendelow, Change Requests, Train the Trainer, elaboración de Test Scripts UAT, validación contable y Acta de Go-Live.',
    certificateTitle: 'Certificado en Pruebas UAT, Adopción del Cambio y Go-Live', classes: [] },
];

/** Diplomas por rol profesional: cada uno combina certificados de módulo (los módulos se comparten entre diplomas). */
export const SPECIALTY_DIPLOMAS: SpecialtyDiploma[] = [
  { id: 'dip-compras', role: 'Asistente de Compras e Inventario',
    title: 'Diploma de Asistente de Compras e Inventario',
    requiredModules: ['mod-1', 'mod-2', 'mod-3', 'mod-13', 'mod-14'],
    description: 'Gestiona solicitudes, cotizaciones, órdenes de compra, recepciones y valoración de inventario.' },
  { id: 'dip-bodega', role: 'Jefe de Bodega',
    title: 'Diploma de Jefe de Bodega',
    requiredModules: ['mod-1', 'mod-2', 'mod-3', 'mod-15', 'mod-16'],
    description: 'Controla ubicaciones, movimientos, conteos físicos y despacho de pedidos.' },
  { id: 'dip-comercial', role: 'Ejecutivo Comercial',
    title: 'Diploma de Ejecutivo Comercial',
    requiredModules: ['mod-1', 'mod-2', 'mod-4', 'mod-5'],
    description: 'Lleva el ciclo de ventas completo: ofertas, pedidos, facturación y estrategia de precios.' },
  { id: 'dip-postventa', role: 'Servicio Postventa',
    title: 'Diploma de Servicio Postventa',
    requiredModules: ['mod-1', 'mod-2', 'mod-4', 'mod-6'],
    description: 'Atiende clientes con CRM, llamadas de servicio, garantías y devoluciones.' },
  { id: 'dip-contable', role: 'Asistente Contable',
    title: 'Diploma de Asistente Contable NIIF',
    requiredModules: ['mod-1', 'mod-2', 'mod-7', 'mod-17', 'mod-19'],
    description: 'Registra asientos, cierra períodos, emite informes y aplica las retenciones vigentes del SRI.' },
  { id: 'dip-nomina', role: 'Asistente de Nómina y Talento Humano',
    title: 'Diploma de Asistente de Nómina y Talento Humano',
    requiredModules: ['mod-1', 'mod-2', 'mod-7', 'mod-25'],
    description: 'Calcula el rol de pagos, los décimos, los fondos de reserva y los aportes al IESS, y contabiliza la nómina con la normativa de 2026.' },
  { id: 'dip-tesoreria', role: 'Tesorería y Cobranzas',
    title: 'Diploma de Tesorería y Cobranzas',
    requiredModules: ['mod-1', 'mod-7', 'mod-8', 'mod-19'],
    description: 'Gestiona cobros, pagos, conciliación bancaria, cartera y retenciones.' },
  { id: 'dip-costos', role: 'Analista de Costos y Presupuestos',
    title: 'Diploma de Analista de Costos y Presupuestos',
    requiredModules: ['mod-7', 'mod-14', 'mod-9', 'mod-18'],
    description: 'Controla costos, centros de costo, presupuestos, valoración y activos fijos.' },
  { id: 'dip-produccion', role: 'Planificador de Producción',
    title: 'Diploma de Planificador de Producción',
    requiredModules: ['mod-2', 'mod-10', 'mod-11', 'mod-20'],
    description: 'Planifica materiales con MRP, programa órdenes de producción y administra la capacidad.' },
  { id: 'dip-admin', role: 'Administrador SAP B1 (Key User)',
    title: 'Diploma de Administrador SAP Business One',
    requiredModules: ['mod-1', 'mod-21', 'mod-22', 'mod-12'],
    description: 'Configura usuarios, documentos, impresión, extensiones, consultas y alertas.' },
  { id: 'dip-consultor', role: 'Consultor de Implementación',
    title: 'Diploma de Consultor de Implementación',
    requiredModules: ['mod-21', 'mod-12', 'mod-23', 'mod-24'],
    requiresOneDiplomaOf: ['dip-compras', 'dip-bodega', 'dip-comercial', 'dip-postventa', 'dip-contable', 'dip-nomina', 'dip-tesoreria', 'dip-costos', 'dip-produccion', 'dip-business-analyst'],
    description: 'Lidera implementaciones: metodología, migración de datos, saldos iniciales y puesta en marcha.' },
  { id: 'dip-business-analyst', role: 'Consultor Funcional y Business Analyst SAP B1',
    title: 'Diploma de Consultor Funcional & Business Analyst SAP Business One',
    requiredModules: ['mod-1', 'mod-2', 'mod-26', 'mod-27', 'mod-28', 'mod-29'],
    description: 'Lidera la transformación digital de la empresa: metodología SAP Activate/AIP, modelado BPMN 2.0 (AS-IS/TO-BE), Business Blueprint (BBD), elicitación con Gherkin, gestión de stakeholders y pruebas UAT.' },
];

/** Programa máximo: todos los certificados de módulo. El Proyecto Integrador funciona como examen final. */
export const MASTER_PROGRAM = {
  id: 'master-consultor-integral',
  title: 'Programa Consultor Integral SAP Business One',
  description: 'Reúne los 29 certificados de competencia y culmina con el Proyecto Integrador.',
} as const;

export const SYLLABUS_BLOCKS: SyllabusBlock[] = ['Fundamentos', 'Logística', 'Comercial', 'Finanzas', 'Producción', 'Sistema y Consultoría', 'Proyecto Final'];

// Temario real de Mi Aula: generado por scripts/aula/publicar_clases.py a partir de scripts/aula/plan.json.
for (const mod of OFFICIAL_SYLLABUS) {
  const publicadas = (CLASES_AULA as Record<string, SyllabusClass[]>)[mod.id];
  if (publicadas?.length) mod.classes = publicadas;
}

export function getModuleById(id: string): SyllabusModule | undefined {
  return OFFICIAL_SYLLABUS.find(m => m.id === id);
}

export function getClassById(moduleId: string, classId: string): SyllabusClass | undefined {
  const mod = getModuleById(moduleId);
  return mod?.classes.find(c => c.id === classId);
}

/** Minutos totales de un módulo (suma de sus clases publicadas). */
export function moduleMinutes(mod: SyllabusModule): number {
  return mod.classes.reduce((acc, c) => acc + c.durationMinutes, 0);
}
