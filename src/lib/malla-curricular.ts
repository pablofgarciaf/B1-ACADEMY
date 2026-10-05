// ═══════════════════════════════════════════════════════════════════
// MALLA CURRICULAR — B1 ACADEMY SAP BUSINESS ONE 10.0 (HANA)
// Conecta manuales → 23 categorías → tracks → rutas de carrera
// Generado: 2026-10-03
// ═══════════════════════════════════════════════════════════════════

// ─── TIPOS ──────────────────────────────────────────────────────────

export type NivelCompetencia = 'INTRO' | 'FUNC' | 'ARQ' | 'EXPERT';
export type CareerPathId =
  | 'consultor-implementacion'
  | 'usuario-clave-finanzas'
  | 'usuario-clave-logistica'
  | 'analista-bi-sap'
  | 'administrador-sistema';

export interface UnidadAprendizaje {
  /** ID del manual (igual al id en ALL_MANUALS) */
  manualId: string;
  /** Número de manual (1-120) */
  manualNumber: number;
  /** Número de display jerárquico (ej: "1.1", "22.3") */
  displayNumber: string;
  /** Título corto para la malla */
  titulo: string;
  /** Nivel de competencia requerido */
  nivel: NivelCompetencia;
  /** Duración estimada en horas */
  horasEstimadas: number;
  /** Prerrequisito: IDs de manuales que deben completarse antes */
  prerequisitos: string[];
  /** Tiene laboratorio interactivo (CSL/CSI) */
  tieneLabPractico: boolean;
  /** Manuales del tipo system/mixed predominantes */
  esModuloSistema: boolean;
}

export interface BloqueTemático {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  color: string; // Tailwind color class
  trackId: string; // Vincula con TRAINING_TRACKS
  unidades: UnidadAprendizaje[];
  horasTotales: number;
  nivelMinimo: NivelCompetencia;
  nivelMaximo: NivelCompetencia;
}

export interface RutaDeCarrera {
  id: CareerPathId;
  titulo: string;
  descripcion: string;
  perfil: string;
  mercadoLaboral: string[];
  salarioReferencialUSD: { min: number; max: number };
  duracionMeses: number;
  horasTotales: number;
  certificacionSAP?: string;
  bloquesRequeridos: string[]; // IDs de BloqueTemático
  bloquesOpcionales: string[]; // IDs de BloqueTemático
  iconEmoji: string;
}

// ─── BLOQUES TEMÁTICOS (23 categorías → bloques académicos) ─────────

export const BLOQUES_TEMATICOS: BloqueTemático[] = [
  {
    id: 'intro-sistema',
    titulo: 'Introducción y Navegación SAP B1',
    descripcion: 'Fundamentos del sistema, navegación, datos maestros básicos y primeros pasos como usuario SAP.',
    icono: '🎓',
    color: 'sky',
    trackId: 'sap-b1-logistics',
    horasTotales: 6,
    nivelMinimo: 'INTRO',
    nivelMaximo: 'FUNC',
    unidades: [
      { manualId: '10_Intro_11_Overview_IntroSAPB1_ES', manualNumber: 1, displayNumber: '1.1', titulo: 'Introducción a SAP Business One', nivel: 'INTRO', horasEstimadas: 1.5, prerequisitos: [], tieneLabPractico: false, esModuloSistema: false },
      { manualId: '10_Intro_12_Overview_GettingStarted_ES', manualNumber: 2, displayNumber: '1.2', titulo: 'Primeros Pasos y Cockpit', nivel: 'INTRO', horasEstimadas: 2, prerequisitos: ['10_Intro_11_Overview_IntroSAPB1_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: '10_Overview_13_MDDoc_ES', manualNumber: 3, displayNumber: '1.3', titulo: 'Datos Maestros y Documentos', nivel: 'INTRO', horasEstimadas: 1.5, prerequisitos: ['10_Intro_12_Overview_GettingStarted_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: 'CSL01_Introduction_Solution_ES', manualNumber: 101, displayNumber: '1.4', titulo: 'Laboratorio: Introducción Práctica', nivel: 'FUNC', horasEstimadas: 3, prerequisitos: ['10_Overview_13_MDDoc_ES'], tieneLabPractico: true, esModuloSistema: true },
    ]
  },
  {
    id: 'herramientas-personalizacion',
    titulo: 'Herramientas de Personalización',
    descripcion: 'Consultas, alertas, aprobaciones, UDF/UDT y Analytics para adaptar SAP B1 a cada empresa.',
    icono: '🛠️',
    color: 'violet',
    trackId: 'sap-b1-herramientas',
    horasTotales: 22,
    nivelMinimo: 'FUNC',
    nivelMaximo: 'ARQ',
    unidades: [
      { manualId: '10_Impl_11_CustomTools_Queries_ES', manualNumber: 4, displayNumber: '22.1', titulo: 'Consultas SQL Personalizadas', nivel: 'ARQ', horasEstimadas: 3, prerequisitos: ['10_Overview_13_MDDoc_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: '10_Impl_12_CustomTools_Alerts_ES', manualNumber: 5, displayNumber: '22.2', titulo: 'Sistema de Alertas', nivel: 'FUNC', horasEstimadas: 2, prerequisitos: ['10_Impl_11_CustomTools_Queries_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: '10_Impl_13_CustomTools_ApprovalProcesses_ES', manualNumber: 6, displayNumber: '22.3', titulo: 'Procesos de Aprobación', nivel: 'ARQ', horasEstimadas: 3, prerequisitos: ['10_Impl_12_CustomTools_Alerts_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: '10_Impl_14_CustomTools_UserDefinedFields_ES', manualNumber: 7, displayNumber: '22.4', titulo: 'Campos Definidos (UDF)', nivel: 'ARQ', horasEstimadas: 2.5, prerequisitos: [], tieneLabPractico: false, esModuloSistema: true },
      { manualId: '10_Impl_15_CustomTools_UserDefinedValues_ES', manualNumber: 8, displayNumber: '22.5', titulo: 'Valores Definidos (UDV)', nivel: 'ARQ', horasEstimadas: 2, prerequisitos: ['10_Impl_14_CustomTools_UserDefinedFields_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: '10_Impl_16_CustomTools_UserDefinedTables_ES', manualNumber: 9, displayNumber: '22.6', titulo: 'Tablas Definidas (UDT)', nivel: 'ARQ', horasEstimadas: 2, prerequisitos: ['10_Impl_15_CustomTools_UserDefinedValues_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: '10_Impl_17_CustomTools_IntroAnalytics_ES', manualNumber: 10, displayNumber: '22.7', titulo: 'SAP Analytics y Cockpit', nivel: 'ARQ', horasEstimadas: 4, prerequisitos: ['10_Impl_11_CustomTools_Queries_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: 'CSI08_Query_Practice', manualNumber: 111, displayNumber: '22.8', titulo: 'Lab: Práctica de Consultas', nivel: 'ARQ', horasEstimadas: 3, prerequisitos: ['10_Impl_11_CustomTools_Queries_ES'], tieneLabPractico: true, esModuloSistema: true },
    ]
  },
  {
    id: 'ventas-crm',
    titulo: 'Ventas y Gestión de Clientes (A/R)',
    descripcion: 'Ciclo Order-to-Cash completo: cotizaciones, pedidos, entregas, facturas y cobros.',
    icono: '💼',
    color: 'emerald',
    trackId: 'sap-b1-logistics',
    horasTotales: 20,
    nivelMinimo: 'FUNC',
    nivelMaximo: 'ARQ',
    unidades: [
      { manualId: '10_Sales_11_MD_BusinessPartners_ES', manualNumber: 30, displayNumber: '3.1', titulo: 'Datos Maestros: Socios de Negocio', nivel: 'FUNC', horasEstimadas: 2, prerequisitos: ['10_Overview_13_MDDoc_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: '10_Sales_12_Process_Order2Cash_ES', manualNumber: 31, displayNumber: '3.2', titulo: 'Proceso Order-to-Cash', nivel: 'FUNC', horasEstimadas: 3, prerequisitos: ['10_Sales_11_MD_BusinessPartners_ES'], tieneLabPractico: false, esModuloSistema: false },
      { manualId: '10_Sales_13_Setup_PricesAndSpecialPrices_ES', manualNumber: 32, displayNumber: '3.3', titulo: 'Precios y Precios Especiales', nivel: 'ARQ', horasEstimadas: 3, prerequisitos: ['10_Sales_12_Process_Order2Cash_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: 'CSL02_Procurement_Process_Solution_ES', manualNumber: 102, displayNumber: '3.4', titulo: 'Lab: Proceso de Compras/Ventas', nivel: 'FUNC', horasEstimadas: 4, prerequisitos: ['10_Sales_12_Process_Order2Cash_ES'], tieneLabPractico: true, esModuloSistema: true },
    ]
  },
  {
    id: 'compras-proveedores',
    titulo: 'Compras y Proveedores (A/P)',
    descripcion: 'Ciclo Procure-to-Pay: requisiciones, órdenes de compra, GRPO y pago a proveedores.',
    icono: '🛒',
    color: 'amber',
    trackId: 'sap-b1-logistics',
    horasTotales: 16,
    nivelMinimo: 'FUNC',
    nivelMaximo: 'ARQ',
    unidades: [
      { manualId: '10_Purchasing_11_MD_BusinessPartners_ES', manualNumber: 40, displayNumber: '4.1', titulo: 'Socios de Negocio: Proveedores', nivel: 'FUNC', horasEstimadas: 2, prerequisitos: ['10_Overview_13_MDDoc_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: '10_Purchasing_12_Process_Procure2Pay_ES', manualNumber: 41, displayNumber: '4.2', titulo: 'Proceso Procure-to-Pay', nivel: 'FUNC', horasEstimadas: 3, prerequisitos: ['10_Purchasing_11_MD_BusinessPartners_ES'], tieneLabPractico: false, esModuloSistema: false },
    ]
  },
  {
    id: 'inventario-almacenes',
    titulo: 'Inventario y Gestión de Almacenes',
    descripcion: 'Artículos, valoración, traslados, lotes, bins y control de stock.',
    icono: '📦',
    color: 'orange',
    trackId: 'sap-b1-logistics',
    horasTotales: 18,
    nivelMinimo: 'FUNC',
    nivelMaximo: 'ARQ',
    unidades: [
      { manualId: '10_Inventory_11_MD_Items_ES', manualNumber: 50, displayNumber: '5.1', titulo: 'Datos Maestros: Artículos (OITM)', nivel: 'FUNC', horasEstimadas: 2.5, prerequisitos: ['10_Overview_13_MDDoc_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: '10_BinLoc_12_Setup_Setup', manualNumber: 55, displayNumber: '5.6', titulo: 'Config: Ubicaciones de Bin', nivel: 'ARQ', horasEstimadas: 3, prerequisitos: ['10_Inventory_11_MD_Items_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: '10_BinLoc_13_Process_Process', manualNumber: 56, displayNumber: '5.7', titulo: 'Proceso: Gestión de Bins', nivel: 'ARQ', horasEstimadas: 3, prerequisitos: ['10_BinLoc_12_Setup_Setup'], tieneLabPractico: false, esModuloSistema: true },
    ]
  },
  {
    id: 'contabilidad-finanzas',
    titulo: 'Contabilidad General y Finanzas NIIF',
    descripcion: 'Plan de cuentas, asientos manuales, cuentas bancarias, conciliaciones y reportes financieros.',
    icono: '💰',
    color: 'green',
    trackId: 'sap-b1-finanzas',
    horasTotales: 22,
    nivelMinimo: 'FUNC',
    nivelMaximo: 'EXPERT',
    unidades: [
      { manualId: '10_AccBasics_11_AccBasics_Financial_Basics_ES', manualNumber: 60, displayNumber: '6.1', titulo: 'Fundamentos Contables SAP', nivel: 'FUNC', horasEstimadas: 3, prerequisitos: ['10_Overview_13_MDDoc_ES'], tieneLabPractico: false, esModuloSistema: false },
      { manualId: '10_AccBasics_12_AccBasics_Automatic_Journal_Entries_ES', manualNumber: 61, displayNumber: '6.2', titulo: 'Asientos Contables Automáticos', nivel: 'ARQ', horasEstimadas: 3.5, prerequisitos: ['10_AccBasics_11_AccBasics_Financial_Basics_ES'], tieneLabPractico: false, esModuloSistema: true },
    ]
  },
  {
    id: 'produccion-mrp',
    titulo: 'Producción y Planificación (MRP)',
    descripcion: 'BOM, órdenes de producción, hojas de ruta y planificación de requerimientos de materiales.',
    icono: '⚙️',
    color: 'slate',
    trackId: 'sap-b1-produccion',
    horasTotales: 18,
    nivelMinimo: 'ARQ',
    nivelMaximo: 'EXPERT',
    unidades: [
      { manualId: '10_Production_11_MD_Items_ES', manualNumber: 80, displayNumber: '7.1', titulo: 'Artículos de Producción', nivel: 'ARQ', horasEstimadas: 2, prerequisitos: ['10_Inventory_11_MD_Items_ES'], tieneLabPractico: false, esModuloSistema: true },
    ]
  },
  {
    id: 'implementacion-metodologia',
    titulo: 'Implementación y Migración de Datos',
    descripcion: 'Metodología SAP, Express Wizard, DTW, migración desde Excel y apertura de saldos.',
    icono: '🔧',
    color: 'rose',
    trackId: 'sap-b1-implementacion',
    horasTotales: 24,
    nivelMinimo: 'ARQ',
    nivelMaximo: 'EXPERT',
    unidades: [
      { manualId: '10_Impl_21_ImplTools_ImplementationMethodology_ES', manualNumber: 11, displayNumber: '20.1', titulo: 'Metodología de Implementación', nivel: 'ARQ', horasEstimadas: 3, prerequisitos: [], tieneLabPractico: false, esModuloSistema: false },
      { manualId: '10_Impl_31_ImportfromExcel', manualNumber: 90, displayNumber: '21.1', titulo: 'Importación desde Excel', nivel: 'ARQ', horasEstimadas: 3, prerequisitos: ['10_Impl_21_ImplTools_ImplementationMethodology_ES'], tieneLabPractico: false, esModuloSistema: true },
      { manualId: '10_Impl_32_Using_Data_Trans_Workbench', manualNumber: 91, displayNumber: '21.2', titulo: 'Data Transfer Workbench (DTW)', nivel: 'EXPERT', horasEstimadas: 4, prerequisitos: ['10_Impl_31_ImportfromExcel'], tieneLabPractico: false, esModuloSistema: true },
    ]
  },
];

// ─── RUTAS DE CARRERA ────────────────────────────────────────────────

export const RUTAS_DE_CARRERA: RutaDeCarrera[] = [
  {
    id: 'consultor-implementacion',
    titulo: 'Consultor SAP B1 — Implementación',
    descripcion: 'Especialista en implementar, configurar y migrar datos en SAP Business One para empresas medianas.',
    perfil: 'Profesional con visión de procesos de negocio y capacidad técnica para configurar el sistema end-to-end.',
    mercadoLaboral: ['Casas consultoras SAP', 'Partners certificados SAP', 'Empresas industriales y comerciales', 'Freelance SAP B1'],
    salarioReferencialUSD: { min: 1800, max: 4500 },
    duracionMeses: 8,
    horasTotales: 120,
    certificacionSAP: 'C_TB1200_10 — SAP Business One 10.0',
    bloquesRequeridos: ['intro-sistema', 'ventas-crm', 'compras-proveedores', 'inventario-almacenes', 'contabilidad-finanzas', 'implementacion-metodologia'],
    bloquesOpcionales: ['herramientas-personalizacion', 'produccion-mrp'],
    iconEmoji: '🏆',
  },
  {
    id: 'usuario-clave-finanzas',
    titulo: 'Usuario Clave — Finanzas y Contabilidad',
    descripcion: 'Especialista en el módulo financiero de SAP B1: contabilidad, bancos, reportes y cierres.',
    perfil: 'Contador o financiero que opera y supervisa el módulo contable y de tesorería en SAP.',
    mercadoLaboral: ['Departamentos contables', 'Empresas con SAP B1 instalado', 'Jefes de contabilidad'],
    salarioReferencialUSD: { min: 1200, max: 2800 },
    duracionMeses: 4,
    horasTotales: 60,
    bloquesRequeridos: ['intro-sistema', 'contabilidad-finanzas'],
    bloquesOpcionales: ['ventas-crm', 'compras-proveedores'],
    iconEmoji: '💰',
  },
  {
    id: 'usuario-clave-logistica',
    titulo: 'Usuario Clave — Logística y Operaciones',
    descripcion: 'Especialista en los módulos de ventas, compras e inventario de SAP B1.',
    perfil: 'Operador que gestiona pedidos, stocks y entregas en SAP Business One.',
    mercadoLaboral: ['Bodegas y almacenes', 'Coordinadores de ventas', 'Supervisores de compras'],
    salarioReferencialUSD: { min: 1000, max: 2400 },
    duracionMeses: 4,
    horasTotales: 54,
    bloquesRequeridos: ['intro-sistema', 'ventas-crm', 'compras-proveedores', 'inventario-almacenes'],
    bloquesOpcionales: ['produccion-mrp'],
    iconEmoji: '📦',
  },
  {
    id: 'analista-bi-sap',
    titulo: 'Analista BI y Reportería SAP',
    descripcion: 'Especialista en consultas SQL, analytics, dashboards y reportes en SAP B1.',
    perfil: 'Analista con orientación a datos que extrae, transforma y visualiza información del ERP.',
    mercadoLaboral: ['Gerencias de inteligencia de negocio', 'Consultoras de datos', 'Controller financiero'],
    salarioReferencialUSD: { min: 1500, max: 3500 },
    duracionMeses: 3,
    horasTotales: 40,
    bloquesRequeridos: ['intro-sistema', 'herramientas-personalizacion'],
    bloquesOpcionales: ['contabilidad-finanzas', 'ventas-crm'],
    iconEmoji: '📊',
  },
  {
    id: 'administrador-sistema',
    titulo: 'Administrador de Sistema SAP B1',
    descripcion: 'Responsable de la configuración técnica, usuarios, autorizaciones y mantenimiento del sistema.',
    perfil: 'IT Manager o Administrador con rol técnico en la empresa usuaria de SAP.',
    mercadoLaboral: ['Departamentos IT', 'Empresas con SAP B1 propio', 'Soporte técnico SAP'],
    salarioReferencialUSD: { min: 1400, max: 3000 },
    duracionMeses: 5,
    horasTotales: 70,
    bloquesRequeridos: ['intro-sistema', 'herramientas-personalizacion', 'implementacion-metodologia'],
    bloquesOpcionales: ['contabilidad-finanzas'],
    iconEmoji: '⚙️',
  },
];

// ─── HELPERS ────────────────────────────────────────────────────────

/**
 * Devuelve todos los bloques requeridos y opcionales de una ruta de carrera.
 */
export function getBloquesByRuta(rutaId: CareerPathId): {
  requeridos: BloqueTemático[];
  opcionales: BloqueTemático[];
} {
  const ruta = RUTAS_DE_CARRERA.find(r => r.id === rutaId);
  if (!ruta) return { requeridos: [], opcionales: [] };
  return {
    requeridos: BLOQUES_TEMATICOS.filter(b => ruta.bloquesRequeridos.includes(b.id)),
    opcionales: BLOQUES_TEMATICOS.filter(b => ruta.bloquesOpcionales.includes(b.id)),
  };
}

/**
 * Devuelve el total de horas de una ruta sumando sus bloques requeridos.
 */
export function getHorasTotalesRuta(rutaId: CareerPathId): number {
  const { requeridos } = getBloquesByRuta(rutaId);
  return requeridos.reduce((acc, b) => acc + b.horasTotales, 0);
}

/**
 * Obtiene las unidades con laboratorio práctico de todos los bloques.
 */
export function getLaboratoriosPracticos(): UnidadAprendizaje[] {
  return BLOQUES_TEMATICOS.flatMap(b =>
    b.unidades.filter(u => u.tieneLabPractico)
  );
}
