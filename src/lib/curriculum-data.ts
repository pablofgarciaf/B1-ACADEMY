import CLASES_AULA from '@/content/aula/clases.json';

export interface SyllabusClass {
  id: string;
  number: number;
  title: string;
  description: string;
  durationMinutes: number;
}

export type SyllabusBlock =
  | 'Administración y Talento Humano'
  | 'Logística y Cadena de Suministro'
  | 'Gestión Comercial y CRM'
  | 'Producción y Planificación'
  | 'Finanzas y Fiscalidad'
  | 'Tecnología y Analítica'
  | 'Consultoría y Business Analyst'
  | 'Proyecto Final';

export interface SyllabusModule {
  /** Clave estable del motor (progreso, láminas, endpoints, DB): alineada 1:1 con el número. */
  id: string;
  /** Número visible para el alumno: secuencia pedagógica continua 1 a 30. */
  number: number;
  title: string;
  description: string;
  badge: string;
  block: SyllabusBlock;
  certificateTitle: string;
  diplomaId?: string;
  classes: SyllabusClass[];
}

export interface SpecialtyDiploma {
  id: string;
  title: string;
  role: string;
  requiredModules: string[];
  requiresOneDiplomaOf?: string[];
  description: string;
}

/** Orden pedagógico oficial: secuencia continua 1 a 30 sin saltos. */
export const OFFICIAL_SYLLABUS: SyllabusModule[] = [
  { id: 'mod-1', number: 1, block: 'Administración y Talento Humano', badge: 'Core ERP',
    title: 'Fundamentos Operativos, Navegación y Empresa',
    description: 'Inducción integral: entorno SAP Business One 10.0, escritorio, Cockpit, parametrizaciones de usuario y empresa de práctica.',
    certificateTitle: 'Certificado en Navegación y Operación de SAP Business One', classes: [] },
  { id: 'mod-2', number: 2, block: 'Administración y Talento Humano', badge: 'Master Data',
    title: 'Núcleo Maestro ERP: Socios y Artículos',
    description: 'Gestión de socios de negocio, clientes, proveedores, artículos, unidades de medida y determinación de precios.',
    certificateTitle: 'Certificado en Datos Maestros de Socios y Artículos', classes: [] },
  { id: 'mod-3', number: 3, block: 'Administración y Talento Humano', badge: 'Activos Fijos',
    title: 'Control y Gestión Administrativa de Activos Fijos',
    description: 'Custodia patrimonial, clases de activos, alta, plaqueo, amortización, depreciación y bajas de bienes de uso.',
    certificateTitle: 'Certificado en Gestión Administrativa de Activos Fijos y Depreciación', classes: [] },
  { id: 'mod-4', number: 4, block: 'Administración y Talento Humano', badge: 'Administración',
    title: 'Administración del Sistema, Usuarios y Seguridad',
    description: 'Gestión de usuarios y licencias, autorizaciones por rol, pistas de auditoría, numeración de documentos y formatos de impresión.',
    certificateTitle: 'Certificado en Administración del Sistema y Seguridad SAP B1', classes: [] },
  { id: 'mod-5', number: 5, block: 'Administración y Talento Humano', badge: 'Gestión RRHH',
    title: 'Estructura Organizacional y Gestión de Personal',
    description: 'Ficha del empleado, organigrama por departamentos, contratos de trabajo, comisiones por ventas, ausencias y evaluación.',
    certificateTitle: 'Certificado en Gestión de Personal y Estructura Organizacional', classes: [] },
  { id: 'mod-6', number: 6, block: 'Administración y Talento Humano', badge: 'Nómina 2026',
    title: 'Nómina, Beneficios Sociales e IESS Ecuador 2026',
    description: 'Liquidación de rol de pagos mensual, horas extras, décimos, fondos de reserva, aportes patronal/personal al IESS y contabilización.',
    certificateTitle: 'Certificado en Nómina, Beneficios Sociales y Obligaciones IESS 2026', classes: [] },
  { id: 'mod-7', number: 7, block: 'Logística y Cadena de Suministro', badge: 'Supply Chain',
    title: 'Aprovisionamiento y Control de Inventarios (Procure-to-Pay)',
    description: 'Ciclo Procure-to-Pay, transacciones de almacén, ubicaciones, lotes, series y costos de importación.',
    certificateTitle: 'Certificado en Compras e Inventarios (Procure-to-Pay)', classes: [] },
  { id: 'mod-8', number: 8, block: 'Logística y Cadena de Suministro', badge: 'Compras',
    title: 'Compras Avanzadas y Gestión de Proveedores',
    description: 'Solicitudes de compra, cotizaciones de proveedores, compras de servicios y gestión de devoluciones.',
    certificateTitle: 'Certificado en Cotizaciones, Compras de Servicios y Devoluciones', classes: [] },
  { id: 'mod-9', number: 9, block: 'Logística y Cadena de Suministro', badge: 'Valoración',
    title: 'Unidades de Medida y Valoración de Inventario',
    description: 'Grupos de unidades de medida, métodos de valoración (FIFO, promedio ponderado, estándar) y ajuste de costos.',
    certificateTitle: 'Certificado en Valoración de Inventario y Unidades de Medida', classes: [] },
  { id: 'mod-10', number: 10, block: 'Logística y Cadena de Suministro', badge: 'Bodega',
    title: 'Operación de Bodega e Inventario Físico',
    description: 'Operación diaria con ubicaciones, transferencias entre bodegas, recuentos de inventario físico y mermas.',
    certificateTitle: 'Certificado en Gestión de Bodega e Inventario Físico', classes: [] },
  { id: 'mod-11', number: 11, block: 'Logística y Cadena de Suministro', badge: 'Despacho',
    title: 'Picking, Packing y Despacho',
    description: 'Preparación de pedidos, listas de picking, empaque, despacho de entregas y transferencias entre almacenes.',
    certificateTitle: 'Certificado en Preparación y Despacho de Pedidos', classes: [] },
  { id: 'mod-12', number: 12, block: 'Gestión Comercial y CRM', badge: 'Ventas',
    title: 'Gestión de Ventas y Order-to-Cash',
    description: 'Ciclo de ventas completo: ofertas, pedidos, entregas, facturación electrónica deudores y notas de crédito.',
    certificateTitle: 'Certificado en Facturación y Ciclo de Ventas', classes: [] },
  { id: 'mod-13', number: 13, block: 'Gestión Comercial y CRM', badge: 'Precios',
    title: 'Estrategias Avanzadas de Precios y Descuentos',
    description: 'Listas de precios derivadas, descuentos por período y volumen, grupos de descuento y precios especiales por cliente.',
    certificateTitle: 'Certificado en Listas de Precios y Políticas de Descuento', classes: [] },
  { id: 'mod-14', number: 14, block: 'Gestión Comercial y CRM', badge: 'CRM',
    title: 'Gestión CRM, Oportunidades y Servicio Post-Venta',
    description: 'Pipeline comercial, oportunidades de venta, llamadas de servicio, tarjetas de equipo y gestión de garantías.',
    certificateTitle: 'Certificado en CRM y Servicio Postventa', classes: [] },
  { id: 'mod-15', number: 15, block: 'Producción y Planificación', badge: 'MRP',
    title: 'Planificación de Materiales (MRP)',
    description: 'Previsión de demanda, pronósticos de venta, asistente MRP y generación automatizada de órdenes de compra y producción.',
    certificateTitle: 'Certificado en Planificación de Materiales (MRP)', classes: [] },
  { id: 'mod-16', number: 16, block: 'Producción y Planificación', badge: 'Producción',
    title: 'Fabricación y Listas de Materiales (BOM)',
    description: 'Estructuras de producto, listas de materiales de producción y ensamble, emisión de componentes y recibo de producto terminado.',
    certificateTitle: 'Certificado en Órdenes de Producción y Costeo Industrial', classes: [] },
  { id: 'mod-17', number: 17, block: 'Producción y Planificación', badge: 'Capacidad',
    title: 'Recursos de Planta, Capacidad y Rutas de Fabricación',
    description: 'Gestión de maquinaria y mano de obra, asignación de capacidad disponible y rutas secuenciales de producción.',
    certificateTitle: 'Certificado en Recursos, Capacidad y Rutas de Producción', classes: [] },
  { id: 'mod-18', number: 18, block: 'Finanzas y Fiscalidad', badge: 'Contabilidad',
    title: 'Contabilidad Central y Normativa NIIF',
    description: 'Estructura del plan de cuentas, determinación de cuentas de mayor, asientos contables y cierre de períodos.',
    certificateTitle: 'Certificado en Contabilidad General NIIF', classes: [] },
  { id: 'mod-19', number: 19, block: 'Finanzas y Fiscalidad', badge: 'Tesorería',
    title: 'Tesorería, Cobros, Pagos y Bancos',
    description: 'Pagos recibidos y efectuados, asistente de pagos masivos, conciliación bancaria y gestión de cartera.',
    certificateTitle: 'Certificado en Conciliación Bancaria, Cobros y Pagos', classes: [] },
  { id: 'mod-20', number: 20, block: 'Finanzas y Fiscalidad', badge: 'Informes',
    title: 'Monedas, Cierre Contable e Informes Financieros',
    description: 'Gestión multimoneda, vouchers de diario, diferencias de cambio, balance general, estado de resultados y flujo de caja.',
    certificateTitle: 'Certificado en Informes Financieros y Flujo de Caja', classes: [] },
  { id: 'mod-21', number: 21, block: 'Finanzas y Fiscalidad', badge: 'Costos',
    title: 'Contabilidad de Costos, Dimensiones y Presupuestos',
    description: 'Centros de costo multidimensionales, reglas de reparto de gastos indirectos y control presupuestario por partidas.',
    certificateTitle: 'Certificado en Centros de Costo y Control Presupuestario', classes: [] },
  { id: 'mod-22', number: 22, block: 'Finanzas y Fiscalidad', badge: 'SRI Fiscal',
    title: 'Facturación Electrónica y Retenciones SRI 2026',
    description: 'Comprobantes electrónicos, esquema XML SRI, porcentajes de retención vigentes de Impuesto a la Renta e IVA.',
    certificateTitle: 'Certificado en Facturación Electrónica y Retenciones SRI 2026', classes: [] },
  { id: 'mod-23', number: 23, block: 'Tecnología y Analítica', badge: 'SQL & DTW',
    title: 'Consultoría de Datos, Query Manager SQL y DTW',
    description: 'Consultas SQL avanzadas, generador de consultas Query Manager, procedimientos de aprobación, alertas automáticas y migración DTW.',
    certificateTitle: 'Certificado en Consultas SQL, Alertas y Migración DTW', classes: [] },
  { id: 'mod-24', number: 24, block: 'Tecnología y Analítica', badge: 'Extensibilidad',
    title: 'Extensibilidad, Tablas de Usuario y Analytics',
    description: 'Campos y tablas de usuario (UDF/UDO), lógica de objetos personalizados, dashboards interactivos y SAP Analytics.',
    certificateTitle: 'Certificado en Tablas de Usuario y SAP Analytics', classes: [] },
  { id: 'mod-25', number: 25, block: 'Consultoría y Business Analyst', badge: 'Activate',
    title: 'Metodología de Implementación y Ciclo de Vida SAP Activate',
    description: 'Fases Discover, Prepare, Explore, Realize, Deploy y Run, gobernanza de proyectos, análisis Fit/Gap y Golden DB.',
    certificateTitle: 'Certificado en Metodología de Implementación SAP Activate', classes: [] },
  { id: 'mod-26', number: 26, block: 'Consultoría y Business Analyst', badge: 'BPMN 2.0',
    title: 'Modelado y Optimización de Procesos de Negocio (BPMN 2.0)',
    description: 'Notación BPMN 2.0 para ERP, diagnóstico AS-IS, diseño TO-BE con mejores prácticas SAP y traducción a modelos de autorización.',
    certificateTitle: 'Certificado en Modelado y Optimización de Procesos (BPMN 2.0)', classes: [] },
  { id: 'mod-27', number: 27, block: 'Consultoría y Business Analyst', badge: 'Blueprint',
    title: 'Levantamiento de Requerimientos y Business Blueprint (BRD)',
    description: 'Elicitación con Cinco Porqués, Business Blueprint (BBD), Historias de Usuario con Gherkin, Matriz RTM y diseño de UDFs.',
    certificateTitle: 'Certificado en Business Blueprint y Levantamiento de Requerimientos', classes: [] },
  { id: 'mod-28', number: 28, block: 'Consultoría y Business Analyst', badge: 'UAT & Cambio',
    title: 'Gestión de Clientes, Pruebas UAT y Adopción del Cambio',
    description: 'Matriz de Mendelow, gestión de Change Requests, Train the Trainer, Test Scripts UAT, validación contable y Acta de Go-Live.',
    certificateTitle: 'Certificado en Pruebas UAT, Adopción del Cambio y Go-Live', classes: [] },
  { id: 'mod-29', number: 29, block: 'Consultoría y Business Analyst', badge: 'Puesta en Marcha',
    title: 'Implementación Técnica, Saldos Iniciales y Go-Live',
    description: 'Asistente de configuración Express, carga de saldos contables iniciales, corte operativo (Cutover) y periodo de Hypercare.',
    certificateTitle: 'Certificado en Implementación Técnica y Puesta en Marcha', classes: [] },
  { id: 'mod-30', number: 30, block: 'Proyecto Final', badge: 'Capstone Máster',
    title: 'Proyecto Integrador: Certificación Máxima de Súper Analista',
    description: 'Simulación integral de puesta en marcha de una empresa completa en SAP B1: maestros, aprovisionamiento, ventas, nómina, finanzas y defensa ante Auditor IA.',
    certificateTitle: 'Diploma de Grado: Súper Analista & Consultor Máster SAP B1', classes: [] },
];

export const SPECIALTY_DIPLOMAS: SpecialtyDiploma[] = [
  { id: 'dip-compras', role: 'Asistente de Compras e Inventarios',
    title: 'Diploma de Asistente de Compras e Inventarios',
    requiredModules: ['mod-1', 'mod-2', 'mod-7', 'mod-8', 'mod-9'],
    description: 'Especialista en ciclo Procure-to-Pay, cotizaciones, compras de servicios, órdenes de compra y valoración de inventario.' },
  { id: 'dip-bodega', role: 'Jefe de Bodega y Logística',
    title: 'Diploma de Jefe de Bodega y Logística',
    requiredModules: ['mod-1', 'mod-2', 'mod-7', 'mod-10', 'mod-11'],
    description: 'Control de bodegas, ubicaciones, recuentos físicos, picking, packing y despacho seguro de mercaderías.' },
  { id: 'dip-comercial', role: 'Ejecutivo Comercial y Ventas',
    title: 'Diploma de Ejecutivo Comercial y Ventas',
    requiredModules: ['mod-1', 'mod-2', 'mod-12', 'mod-13'],
    description: 'Dominio del ciclo Order-to-Cash: ofertas, pedidos, entregas, facturación y estrategias avanzadas de precios y descuentos.' },
  { id: 'dip-postventa', role: 'Especialista en CRM y Post-Venta',
    title: 'Diploma de Especialista en CRM y Servicio Post-Venta',
    requiredModules: ['mod-1', 'mod-2', 'mod-12', 'mod-14'],
    description: 'Fidelización y atención al cliente, pipeline de oportunidades, llamadas de servicio, tarjetas de equipo y garantías.' },
  { id: 'dip-produccion', role: 'Planificador de Producción (MRP)',
    title: 'Diploma de Planificador de Producción',
    requiredModules: ['mod-2', 'mod-15', 'mod-16', 'mod-17'],
    description: 'Planificación de materiales MRP, órdenes de fabricación BOM, asignación de recursos y capacidad de planta.' },
  { id: 'dip-contable', role: 'Asistente Contable NIIF',
    title: 'Diploma de Asistente Contable NIIF',
    requiredModules: ['mod-1', 'mod-2', 'mod-18', 'mod-20', 'mod-22'],
    description: 'Registro de asientos, balances, estados financieros bajo NIIF, multimoneda y retenciones electrónicas vigentes del SRI.' },
  { id: 'dip-tesoreria', role: 'Especialista en Tesorería y Cobranzas',
    title: 'Diploma de Especialista en Tesorería y Cobranzas',
    requiredModules: ['mod-1', 'mod-18', 'mod-19', 'mod-22'],
    description: 'Gestión de liquidez, pagos masivos a proveedores, cobros de clientes, conciliación bancaria y retenciones fiscales.' },
  { id: 'dip-costos', role: 'Analista de Costos y Presupuestos',
    title: 'Diploma de Analista de Costos y Presupuestos',
    requiredModules: ['mod-3', 'mod-9', 'mod-18', 'mod-21'],
    description: 'Control de activos fijos, valoración de existencias, centros de costo multidimensionales y control presupuestario.' },
  { id: 'dip-admin-activos', role: 'Administrador de Operaciones y Activos Fijos',
    title: 'Diploma de Gestión Administrativa y Control de Activos Fijos',
    requiredModules: ['mod-1', 'mod-2', 'mod-3', 'mod-4'],
    description: 'Custodia del patrimonio corporativo, administración de activos fijos, altas, bajas, depreciación y gobernanza ERP.' },
  { id: 'dip-nomina', role: 'Especialista en Talento Humano y Nómina',
    title: 'Diploma de Especialista en Talento Humano y Nómina',
    requiredModules: ['mod-1', 'mod-2', 'mod-5', 'mod-6'],
    description: 'Gestión integral de personal, contratos, liquidación de rol de pagos, beneficios sociales y aportes al IESS Ecuador 2026.' },
  { id: 'dip-ventas-master', role: 'Consultor Comercial y Preventa SAP B1',
    title: 'Diploma de Consultor Comercial y Preventa SAP Business One',
    requiredModules: ['mod-1', 'mod-2', 'mod-12', 'mod-13', 'mod-14', 'mod-23'],
    description: 'Value-Based Selling para ejecutivos comerciales: demostraciones de alto impacto, analítica gerencial, ROI y manejo de objeciones.' },
  { id: 'dip-admin', role: 'Administrador del Sistema SAP B1 (Key User)',
    title: 'Diploma de Administrador SAP Business One',
    requiredModules: ['mod-1', 'mod-4', 'mod-23', 'mod-24'],
    description: 'Configuración del ERP, usuarios, autorizaciones, numeración de documentos, consultas SQL y tablas de usuario.' },
  { id: 'dip-consultor', role: 'Consultor de Implementación ERP',
    title: 'Diploma de Consultor de Implementación',
    requiredModules: ['mod-4', 'mod-23', 'mod-29', 'mod-30'],
    requiresOneDiplomaOf: ['dip-compras', 'dip-bodega', 'dip-comercial', 'dip-contable', 'dip-nomina', 'dip-business-analyst'],
    description: 'Liderazgo de proyectos: configuración, migración de datos con DTW, saldos iniciales y defensa del Proyecto Integrador.' },
  { id: 'dip-business-analyst', role: 'Consultor Funcional y Business Analyst SAP B1',
    title: 'Diploma de Consultor Funcional & Business Analyst SAP Business One',
    requiredModules: ['mod-1', 'mod-2', 'mod-25', 'mod-26', 'mod-27', 'mod-28'],
    description: 'Transformación digital: metodología SAP Activate, modelado BPMN 2.0 (AS-IS/TO-BE), Business Blueprint y pruebas UAT.' },
];

/** Programa cumbre: certificaciones funcionales + Proyecto Integrador. */
export const MASTER_PROGRAM = {
  id: 'master-consultor-integral',
  title: 'Programa Consultor Integral & Súper Analista SAP Business One',
  description: 'Reúne las 30 certificaciones de competencia técnica y culmina con el Proyecto Integrador de Simulación Real.',
} as const;

export const SYLLABUS_BLOCKS: SyllabusBlock[] = [
  'Administración y Talento Humano',
  'Logística y Cadena de Suministro',
  'Gestión Comercial y CRM',
  'Producción y Planificación',
  'Finanzas y Fiscalidad',
  'Tecnología y Analítica',
  'Consultoría y Business Analyst',
];

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

export function moduleMinutes(mod: SyllabusModule): number {
  return mod.classes.reduce((acc, c) => acc + c.durationMinutes, 0);
}
