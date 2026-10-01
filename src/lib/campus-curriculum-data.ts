// ═══════════════════════════════════════════════════════════════════
// CURRÍCULO OFICIAL DE LA ESCUELA SAP BUSINESS ONE (CAMPUS UNIVERSITARIO)
// Mapeo exhaustivo de 121 Manuales, 4 Carreras, 12 Micro-Certificaciones,
// Diplomas de Especialidad, Grado Consultor Master B1 y Acreditación Docente.
// ═══════════════════════════════════════════════════════════════════

export type CareerId = 
  | 'carrera-fundamentos' 
  | 'carrera-finanzas' 
  | 'carrera-logistica' 
  | 'carrera-consultoria';

export type CertificateType = 
  | 'micro' 
  | 'diploma' 
  | 'master' 
  | 'docente';

export interface MicroCertification {
  id: string;
  code: string;
  careerId: CareerId;
  title: string;
  shortTitle: string;
  badge: string;
  iconName: string;
  level: 'OPERATIVO' | 'ESPECIALISTA' | 'ARQUITECTURA';
  estimatedHours: number;
  description: string;
  competencies: string[];
  manualIds: string[];
  simulatorArchetype: string;
  passingScorePercent: number; // Por defecto 85 o 90
  officialIssuanceFeeUSD: number; // Tarifa de emisión oficial con firmas de responsabilidad
  skillsTagged: string[];
}

export interface CareerTrack {
  id: CareerId;
  code: string;
  number: number;
  title: string;
  shortTitle: string;
  badge: string;
  colorTheme: string;
  gradient: string;
  targetAudience: string;
  careerRole: string;
  totalHours: number;
  diplomaTitle: string;
  diplomaIssuanceFeeUSD: number;
  description: string;
  objectives: string[];
  microCertifications: string[]; // IDs de MicroCertification
  manualCount: number;
}

export interface TeacherAccreditationInfo {
  specialistRequirements: string;
  masterTeacherRequirements: string;
  perks: string[];
}

// ═══════════════════════════════════════════════════════════════════
// 1. LAS 4 CARRERAS UNIVERSITARIAS Y EJECUTIVAS
// ═══════════════════════════════════════════════════════════════════

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'carrera-fundamentos',
    code: 'B1-CAR-01',
    number: 1,
    title: 'Fundamentos Operativos, Navegación y Núcleo Maestro ERP',
    shortTitle: 'Fundamentos & Núcleo ERP',
    badge: 'Onboarding & Core',
    colorTheme: 'emerald',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    targetAudience: 'Estudiantes universitarios de pregrado, administradores, analistas de negocio y nuevos usuarios.',
    careerRole: 'Operador de Negocios Certificado SAP B1',
    totalHours: 40,
    diplomaTitle: 'Diploma de Operador de Negocios en SAP Business One',
    diplomaIssuanceFeeUSD: 49,
    description: 'Domina desde cero la navegación intuitiva, parametrizaciones de usuario, datos maestros de Socios de Negocios (OCRD) y Artículos (OITM), listas de precios y trazabilidad en el Mapa de Relaciones.',
    objectives: [
      'Navegar con fluidez en la interfaz SAP B1 10.0 y Cockpit Fiori.',
      'Gestionar fichas de clientes y proveedores con condiciones crediticias.',
      'Configurar catálogos de artículos con unidades de medida y listas de precios.',
      'Auditar flujos documentales completos con el Mapa de Relaciones.'
    ],
    microCertifications: ['mc-01-navegacion', 'mc-02-maestros-precios'],
    manualCount: 15
  },
  {
    id: 'carrera-finanzas',
    code: 'B1-CAR-02',
    number: 2,
    title: 'Finanzas Corporativas, Contabilidad NIIF y Control de Gestión',
    shortTitle: 'Finanzas NIIF & Tesorería',
    badge: 'Finanzas & Compliance',
    colorTheme: 'blue',
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    targetAudience: 'Estudiantes de Contaduría, Contralores Financieros, Analistas Contables y Auditores de Gestión.',
    careerRole: 'Especialista Financiero y Tesorero SAP B1',
    totalHours: 90,
    diplomaTitle: 'Diploma de Especialista en Finanzas y Control de Gestión SAP B1',
    diplomaIssuanceFeeUSD: 69,
    description: 'Estructuración y control del Plan de Cuentas NIIF, determinación automática de cuentas de mayor, gestión bancaria y de cobros, activos fijos con depreciación automática, costos multidimensionales y cierre de período.',
    objectives: [
      'Diseñar y mantener el Plan de Cuentas bajo estándar internacional NIIF.',
      'Parametrizar las reglas de determinación contable automática en compras y ventas.',
      'Operar el asistente de pagos masivos y conciliaciones bancarias.',
      'Controlar la vida útil, amortización y bajas de Activos Fijos.',
      'Generar balances, estados de resultados y reportes de flujo de caja para auditoría.'
    ],
    microCertifications: ['mc-03-contabilidad-gl', 'mc-04-bancos-pagos', 'mc-05-activos-fijos', 'mc-06-costos-presupuesto'],
    manualCount: 38
  },
  {
    id: 'carrera-logistica',
    code: 'B1-CAR-03',
    number: 3,
    title: 'Logística Integral, Cadena de Suministro y Ciclos Comerciales',
    shortTitle: 'Logística, SCM & Ventas',
    badge: 'Supply Chain & Sales',
    colorTheme: 'amber',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    targetAudience: 'Ingenieros Industriales, Directores de Logística, Jefes de Compras, Gerentes de Ventas y Almacén.',
    careerRole: 'Especialista en Cadena de Suministro & Logística SAP B1',
    totalHours: 95,
    diplomaTitle: 'Diploma de Especialista en Cadena de Suministro y Ventas SAP B1',
    diplomaIssuanceFeeUSD: 69,
    description: 'Gestión de punta a punta del ciclo Order-to-Cash y Procure-to-Pay, control de ubicaciones en almacén (Bin Locations), trazabilidad por lotes y series, métodos de valoración de inventario y costeo de importaciones (Landed Costs).',
    objectives: [
      'Ejecutar el ciclo comercial completo: Cotización, Pedido, Entrega y Facturación A/R.',
      'Optimizar el aprovisionamiento corporativo: Solicitudes, Órdenes de Compra, GRPO y Factura A/P.',
      'Diseñar topología de almacenes con ubicaciones tridimensionales (Bin Locations).',
      'Monitorear números de serie y lotes con trazabilidad de garantía y caducidad.',
      'Calcular y distribuir los gastos de importación y fletes aduaneros con Landed Costs.'
    ],
    microCertifications: ['mc-07-order-to-cash', 'mc-08-procure-to-pay', 'mc-09-ubicaciones-lotes', 'mc-10-valoracion-landed'],
    manualCount: 42
  },
  {
    id: 'carrera-consultoria',
    code: 'B1-CAR-04',
    number: 4,
    title: 'Planificación MRP, Fabricación y Consultoría de Implementación',
    shortTitle: 'MRP, Producción & Consultoría',
    badge: 'Arquitectura & Consultoría',
    colorTheme: 'purple',
    gradient: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
    targetAudience: 'Ingenieros de Sistemas, Consultores Funcionales Junior, Jefes de Planta e Implementadores ERP.',
    careerRole: 'Consultor de Implementación & Planificación SAP B1',
    totalHours: 85,
    diplomaTitle: 'Diploma de Consultor de Implementación y Planificación SAP B1',
    diplomaIssuanceFeeUSD: 79,
    description: 'Planificación de requerimientos de materiales (MRP), listas de materiales (BOM), centros de trabajo y capacidad, y suite de herramientas del consultor: consultas SQL, campos de usuario (UDF/UDT), búsquedas formateadas y migración masiva con DTW.',
    objectives: [
      'Modelar estructuras de productos con Listas de Materiales (BOM) y rutas de ensamble.',
      'Ejecutar corridas del asistente MRP considerando stock mínimo, pedidos y pronósticos.',
      'Diseñar consultas avanzadas con el Generador de Consultas SQL y Crystal Reports.',
      'Extender la base de datos con Tablas y Campos de Usuario (UDF/UDT) sin programar código.',
      'Automatizar controles mediante procedimientos de aprobación y búsquedas formateadas (FMS).',
      'Migrar bases de datos maestras y saldos iniciales con Data Transfer Workbench (DTW).'
    ],
    microCertifications: ['mc-11-mrp-produccion', 'mc-12-consultoria-dtw-sql'],
    manualCount: 26
  }
];

// ═══════════════════════════════════════════════════════════════════
// 2. LAS 12 MICRO-CERTIFICACIONES MODULARES MONETIZABLES
// ═══════════════════════════════════════════════════════════════════

export const MICRO_CERTIFICATIONS: MicroCertification[] = [
  // ── CARRERA 1: FUNDAMENTOS ──────────────────────────────────────
  {
    id: 'mc-01-navegacion',
    code: 'MC-B1-01',
    careerId: 'carrera-fundamentos',
    title: 'Navegación, Cockpit Fiori y Estructura Global del ERP',
    shortTitle: 'Navegación & Cockpit Fiori',
    badge: 'Fundamentos',
    iconName: 'LayoutDashboard',
    level: 'OPERATIVO',
    estimatedHours: 18,
    description: 'Acreditación en ergonomía del sistema, personalización del Cockpit Fiori, parametrizaciones generales de usuario y uso del mapa de relaciones.',
    competencies: [
      'Autenticación e inicio seguro en sociedades SAP B1',
      'Creación y configuración de paneles Cockpit con widgets e indicadores KPI',
      'Navegación por menús, barra de herramientas y accesos rápidos de teclado',
      'Rastreo transaccional bidireccional mediante el Mapa de Relaciones'
    ],
    manualIds: [
      '10_Intro_11_Overview_IntroSAPB1_ES',
      '10_Intro_12_Overview_GettingStarted_ES',
      '10_Overview_13_MDDoc_ES',
      'CSL01_Introduction_ES',
      'CSL01_Introduction_Solution_ES'
    ],
    simulatorArchetype: 'cockpit',
    passingScorePercent: 85,
    officialIssuanceFeeUSD: 19,
    skillsTagged: ['Cockpit Fiori', 'Navegación', 'Mapa de Relaciones', 'Parametrizaciones']
  },
  {
    id: 'mc-02-maestros-precios',
    code: 'MC-B1-02',
    careerId: 'carrera-fundamentos',
    title: 'Gestión Maestra: Socios de Negocios, Artículos y Listas de Precios',
    shortTitle: 'Maestros OCRD/OITM & Precios',
    badge: 'Datos Maestros',
    iconName: 'Users',
    level: 'OPERATIVO',
    estimatedHours: 22,
    description: 'Administración integral de fichas de clientes y proveedores (OCRD), artículos inventariables y de venta (OITM) y jerarquía de listas de precios.',
    competencies: [
      'Alta y mantenimiento de clientes, proveedores y leads en la tabla OCRD',
      'Parametrización de artículos con cuentas contables y grupos en OITM',
      'Creación de listas de precios base y derivadas con factores de conversión',
      'Configuración de descuentos por período, volumen y grupos de artículos'
    ],
    manualIds: [
      '10_ItemInv_11_Item_ItemMD_ES',
      '10_ItemInv_12_Item_ItemGrp_ES',
      '10_Pricing_11_Concept_PrConcept_ES',
      '10_Pricing_21_Pricelist_CreatePricelist_ES',
      '10_Pricing_22_Pricelist_UpdatePricelist_ES',
      '10_Pricing_31_DiscSP_PerVolDisc_ES',
      '10_Pricing_32_DiscSP_DiscGrp_ES',
      '10_Pricing_33_DiscSP_SpPrBP_ES'
    ],
    simulatorArchetype: 'item_master',
    passingScorePercent: 85,
    officialIssuanceFeeUSD: 19,
    skillsTagged: ['OCRD', 'OITM', 'Listas de Precios', 'Descuentos Especiales']
  },

  // ── CARRERA 2: FINANZAS ─────────────────────────────────────────
  {
    id: 'mc-03-contabilidad-gl',
    code: 'MC-B1-03',
    careerId: 'carrera-finanzas',
    title: 'Contabilidad General NIIF, Determinación de Cuentas y Libro Mayor',
    shortTitle: 'Contabilidad NIIF & G/L',
    badge: 'Finanzas Core',
    iconName: 'DollarSign',
    level: 'ESPECIALISTA',
    estimatedHours: 24,
    description: 'Estructuración del Plan de Cuentas (COA), parametrización de cuentas por defecto y registro de asientos contables automáticos y manuales.',
    competencies: [
      'Estructura de cajones y niveles en el Plan de Cuentas',
      'Determinación de cuentas de mayor tradicional y avanzada para inventarios y ventas',
      'Creación de Asientos Contables manuales (OJDT) y plantillas de contabilización recurrente',
      'Gestión de períodos contables, bloqueos y proceso de Cierre de Ejercicio'
    ],
    manualIds: [
      '10_AccBasics_11_AccBasics_Financial_Basics_ES',
      '10_AccBasics_12_AccBasics_Automatic_Journal_Entries_ES',
      '10_FinSetup_11_COA_COAConcepts_ES',
      '10_FinSetup_12_COA_ManageCOA',
      '10_FinSetup_21_DefaultGLAcc_DefaultGLAccOveriew_ES',
      '10_FinSetup_22_DefaultGLAcc_Traditional',
      '10_FinSetup_23_DefaultGLAcc_Advanced',
      '10_FinProcess_11_PostJE_PostJE_ES',
      '10_FinProcess_12_PostJE_template_ES',
      '10_FinProcess_13_PostJE_voucher_ES',
      '10_FinProcess_21_PostPeriods_PostPeriods_ES',
      '10_FinProcess_22_PostPeriods_PeriodClose'
    ],
    simulatorArchetype: 'journal_entry',
    passingScorePercent: 90,
    officialIssuanceFeeUSD: 24,
    skillsTagged: ['Plan de Cuentas', 'OJDT', 'Determinación G/L', 'Cierre de Ejercicio']
  },
  {
    id: 'mc-04-bancos-pagos',
    code: 'MC-B1-04',
    careerId: 'carrera-finanzas',
    title: 'Gestión Bancaria, Asistente de Pagos y Reconciliaciones',
    shortTitle: 'Bancos, Pagos & Conciliaciones',
    badge: 'Tesorería',
    iconName: 'CreditCard',
    level: 'ESPECIALISTA',
    estimatedHours: 22,
    description: 'Emisión y recepción de pagos en efectivo, cheques, transferencias y tarjetas, uso del Asistente de Pagos Masivos y conciliación bancaria.',
    competencies: [
      'Registro de Pagos Recibidos (ORCT) y Pagos Efectuados (OVPM)',
      'Ejecución del Asistente de Pagos (Payment Wizard) con generación de archivos bancarios',
      'Conciliación bancaria interna (cuentas de mayor) y externa (extractos bancarios)',
      'Gestión de depósitos de cheques posfechados y cartas de reclamación (Dunning)'
    ],
    manualIds: [
      '10_BankProcess_11_Handling_Payments_ES',
      '10_BankProcess_12_Payments_Payment Wizard_ES',
      '10_BankProcess_21_BankReconcile_Overview_ES',
      '10_FinProcess_31_InternalRecon_InternalRecon_ES',
      '10_ControlReports_23_CashReports_Dunning'
    ],
    simulatorArchetype: 'banking',
    passingScorePercent: 90,
    officialIssuanceFeeUSD: 24,
    skillsTagged: ['ORCT', 'OVPM', 'Payment Wizard', 'Conciliación Bancaria', 'Dunning']
  },
  {
    id: 'mc-05-activos-fijos',
    code: 'MC-B1-05',
    careerId: 'carrera-finanzas',
    title: 'Gestión Integral de Activos Fijos y Depreciación Fiscal/NIIF',
    shortTitle: 'Activos Fijos & Depreciación',
    badge: 'Activos Fijos',
    iconName: 'Building2',
    level: 'ESPECIALISTA',
    estimatedHours: 20,
    description: 'Ciclo de vida del activo fijo: capitalización, cálculo automático de amortizaciones bajo métodos lineal y acelerado, transferencias y bajas.',
    competencies: [
      'Parametrización de áreas de valoración (Fiscal y NIIF) y clases de activos',
      'Adquisición de activos mediante factura de proveedor o capitalización directa',
      'Ejecución de la corrida de amortización mensual con contabilización en mayor',
      'Retiro, venta y baja de activos fijos con cálculo de ganancia o pérdida'
    ],
    manualIds: [
      '10_FixedAsset_11_FixedAsset_Intro_ES',
      '10_FixedAsset_12_FixedAsset_Intro_Virtual_Asset_ES',
      '10_FixedAsset_21_FixedAsset_InitSettings',
      '10_FixedAsset_31_WorkingProcessFA_Activate_AssetMD',
      '10_FixedAsset_32_WorkingProcessFA_Depreciation_Adjustments',
      '10_FixedAsset_33_WorkingProcessFA_Retirement_Monitoring'
    ],
    simulatorArchetype: 'cockpit',
    passingScorePercent: 85,
    officialIssuanceFeeUSD: 24,
    skillsTagged: ['Activos Fijos', 'Depreciación NIIF', 'Capitalización', 'Baja de Activos']
  },
  {
    id: 'mc-06-costos-presupuesto',
    code: 'MC-B1-06',
    careerId: 'carrera-finanzas',
    title: 'Contabilidad de Costos Multidimensional y Control Presupuestario',
    shortTitle: 'Costos & Presupuestos',
    badge: 'Contraloría',
    iconName: 'PieChart',
    level: 'ARQUITECTURA',
    estimatedHours: 24,
    description: 'Centros de beneficio, normas de reparto en hasta 5 dimensiones, definición de escenarios de presupuesto y alertas de sobregiro presupuestario.',
    competencies: [
      'Configuración de centros de costo y dimensiones analíticas (sucursal, proyecto, división)',
      'Reglas de reparto automáticas e imputación de costos indirectos',
      'Definición de presupuestos anuales y mensuales por cuenta contable',
      'Generación de reportes de flujo de caja y antigüedad de saldos (Aging)'
    ],
    manualIds: [
      '10_CostandBudget_11_CostAcc_CostAcc_ES',
      '10_CostandBudget_12_CostAcc_MultiDimensions_ES',
      '10_CostandBudget_13_CostAcc_CostAdjustment',
      '10_CostandBudget_21_Budget_Budget',
      '10_ControlReports_11_FinReports_FinReports_ES',
      '10_ControlReports_21_CashReports_cashflow_ES',
      '10_ControlReports_22_CashReports_Aging_ES'
    ],
    simulatorArchetype: 'cockpit',
    passingScorePercent: 90,
    officialIssuanceFeeUSD: 24,
    skillsTagged: ['Centros de Beneficio', 'Normas de Reparto', 'Presupuestos', 'Aging Reports']
  },

  // ── CARRERA 3: LOGÍSTICA & SCM ──────────────────────────────────
  {
    id: 'mc-07-order-to-cash',
    code: 'MC-B1-07',
    careerId: 'carrera-logistica',
    title: 'Ciclo Comercial Order-to-Cash: De la Oportunidad a la Facturación A/R',
    shortTitle: 'Ciclo Order-to-Cash (Ventas)',
    badge: 'Ventas & CRM',
    iconName: 'TrendingUp',
    level: 'OPERATIVO',
    estimatedHours: 24,
    description: 'Gestión del pipeline de ventas, cotizaciones, órdenes de venta con verificación de disponibilidad ATP, entregas y facturación a clientes.',
    competencies: [
      'Administración de Oportunidades de Venta y actividades CRM',
      'Elaboración de Ofertas y Órdenes de Venta (ORDR) con verificación de stock disponible ATP',
      'Generación de Entregas (ODLN) y salidas de mercancía de almacén',
      'Emisión de Facturas de Deudores A/R (OINV), Notas de Crédito y Devoluciones'
    ],
    manualIds: [
      '10_Sales_11_Process_Overview_ES',
      '10_Sales_12_Process_Order2Cash_ES',
      '10_Sales_21_Cust_Customers_ES',
      '10_Sales_31_CRM_CRM_ES',
      '10_Sales_41_Process_Autom_ES',
      '10_Sales_51_Issues_ReturnsExchange_ES',
      '10_Sales_52_Issues_CM_ES',
      '10_Service_11_CSProcess_Process_ES'
    ],
    simulatorArchetype: 'sales',
    passingScorePercent: 85,
    officialIssuanceFeeUSD: 24,
    skillsTagged: ['Order-to-Cash', 'ORDR', 'OINV', 'ATP Check', 'Notas de Crédito']
  },
  {
    id: 'mc-08-procure-to-pay',
    code: 'MC-B1-08',
    careerId: 'carrera-logistica',
    title: 'Ciclo de Aprovisionamiento Procure-to-Pay: De la Solicitud a la Factura A/P',
    shortTitle: 'Ciclo Procure-to-Pay (Compras)',
    badge: 'Compras',
    iconName: 'ShoppingCart',
    level: 'OPERATIVO',
    estimatedHours: 24,
    description: 'Gestión estratégica de compras: requisiciones internas, solicitudes de cotización, pedidos a proveedores, recepción de mercancías (GRPO) y conciliación con factura de acreedores.',
    competencies: [
      'Elaboración de Solicitudes de Compra y cotizaciones con proveedores',
      'Generación y seguimiento de Órdenes de Compra (OPOR)',
      'Registro de Entregas Entrantes GRPO (OPDN) con impacto contable de provisión de compras',
      'Validación de Facturas de Proveedor A/P (OPCH), Devoluciones y Notas de Crédito'
    ],
    manualIds: [
      '10_Purch_11_Process_Process_ES',
      '10_Purch_12_Process_Items_ES',
      '10_Purch_13_Process_PurchaseReqQt',
      '10_Purch_14_Process_Services',
      '10_Purch_21_Issues_GRPO_ES',
      '10_Purch_22_Issues_ReturnsCM_ES',
      'CSL02_Procurement_Process_ES',
      'CSL02_Procurement_Process_Solution_ES'
    ],
    simulatorArchetype: 'procurement',
    passingScorePercent: 85,
    officialIssuanceFeeUSD: 24,
    skillsTagged: ['Procure-to-Pay', 'OPOR', 'GRPO', 'OPCH', 'Devoluciones']
  },
  {
    id: 'mc-09-ubicaciones-lotes',
    code: 'MC-B1-09',
    careerId: 'carrera-logistica',
    title: 'Topología de Almacén: Ubicaciones (Bin Locations), Lotes y Números de Serie',
    shortTitle: 'Ubicaciones (Bins) & Lotes',
    badge: 'Almacén WMS',
    iconName: 'Layers',
    level: 'ESPECIALISTA',
    estimatedHours: 24,
    description: 'Configuración tridimensional de almacén en pasillos, estantes y niveles (OBIN), estrategias de asignación automática y trazabilidad de lotes y números de serie.',
    competencies: [
      'Habilitación de almacenes con ubicaciones y codificación de niveles',
      'Rutas de picking y estrategias de recepción automática en ubicaciones',
      'Creación y rastreo de Números de Serie para equipos y garantías',
      'Gestión de Lotes con fechas de caducidad y estados de cuarentena'
    ],
    manualIds: [
      '10_BinLoc_11_Overview_Overview_ES',
      '10_BinLoc_12_Setup_Setup',
      '10_BinLoc_13_Process_Process',
      '10_BinLoc_14_Process_Weight',
      '10_BinLoc_15_Reporting_Reporting',
      '10_BinLoc_16_Serial_Serial',
      '10_ItemInv_51_SNBatch_SNBatch_ES',
      '10_Item_42_SNBatch_Valuation'
    ],
    simulatorArchetype: 'bin_locations',
    passingScorePercent: 90,
    officialIssuanceFeeUSD: 24,
    skillsTagged: ['Bin Locations', 'OBIN', 'Números de Serie', 'Gestión de Lotes']
  },
  {
    id: 'mc-10-valoracion-landed',
    code: 'MC-B1-010',
    careerId: 'carrera-logistica',
    title: 'Valoración de Inventario, Unidades de Medida y Costos de Importación (Landed Costs)',
    shortTitle: 'Valoración de Stock & Landed Costs',
    badge: 'Costeo Logístico',
    iconName: 'Scale',
    level: 'ARQUITECTURA',
    estimatedHours: 23,
    description: 'Mecanismos de valoración continua de inventario (Promedio Móvil, FIFO, Estándar), grupos de unidades de medida complejas y liquidación de costos de importación.',
    competencies: [
      'Impacto financiero de los métodos de valoración FIFO, PMP y Costo Estándar',
      'Grupos de unidades de medida (UoM) con empaques y factores de conversión',
      'Liquidación de Precios de Entrega (Landed Costs) para prorratear fletes y aranceles al costo del artículo',
      'Conteo de inventario físico y ajustes de stock con recálculo de costos'
    ],
    manualIds: [
      '10_ItemInv_21_UoM_Overview_ES',
      '10_Item_22_UoM_Setup',
      '10_Item_23_UoM_Weight',
      '10_Item_24_UoM_Packaging',
      '10_ItemInv_31_WM_WH_ES',
      '10_ItemInv_32_WM_GM_ES',
      '10_ItemInv_41_Valuation_ValMethods_ES',
      '10_Purch_32_LandedCost_Freight',
      '10_Purch_32_LandedCost_ManageLandedCosts',
      '10_Inven_13_WM_PhyInv'
    ],
    simulatorArchetype: 'inventory_move',
    passingScorePercent: 90,
    officialIssuanceFeeUSD: 24,
    skillsTagged: ['FIFO', 'Promedio Ponderado', 'Landed Costs', 'Unidades de Medida']
  },

  // ── CARRERA 4: MRP & CONSULTORÍA ────────────────────────────────
  {
    id: 'mc-11-mrp-produccion',
    code: 'MC-B1-011',
    careerId: 'carrera-consultoria',
    title: 'Planificación de Materiales (MRP), Listas BOM y Fabricación por Rutas',
    shortTitle: 'MRP, BOM & Producción',
    badge: 'Producción & MRP',
    iconName: 'Factory',
    level: 'ESPECIALISTA',
    estimatedHours: 28,
    description: 'Diseño de estructuras de fabricación (BOM), asignación de recursos y tiempos de máquina, órdenes de producción con costeo y asistente de planificación MRP.',
    competencies: [
      'Estructuración de Listas de Materiales (OITT) de producción, venta y ensamble',
      'Modelado de Recursos, Centros de Trabajo y capacidades operativas',
      'Órdenes de Fabricación (OWOR): emisión de componentes por retroceso (backflush) o manual',
      'Simulación y ejecución del Asistente MRP con recomendaciones de compra y fabricación'
    ],
    manualIds: [
      '10_MRP_11_MRP_Process_ES',
      '10_MRP_12_ConsumeForecast',
      '10_MRP_13_MRP_BOM',
      '10_Production_11_Overview_Overview_ES',
      '10_Production_21_Resources_Resources_ES',
      '10_Production_22_Resources_Capacity_ES',
      '10_Production_31_BOM_BOM_ES',
      '10_Production_41_Process_BasicProductionProcess_ES',
      '10_Production_42_Process_ByProductsandAdditional',
      '10_Production_42_Process_RoutingProductionProcess_ES',
      '10_Production_51_Accounting_Accounting',
      '10_Production_52_Accounting_Cost',
      '10_Inven_22_PNP_PNPProduction'
    ],
    simulatorArchetype: 'production',
    passingScorePercent: 90,
    officialIssuanceFeeUSD: 29,
    skillsTagged: ['BOM', 'Órdenes de Fabricación', 'Asistente MRP', 'Recursos']
  },
  {
    id: 'mc-12-consultoria-dtw-sql',
    code: 'MC-B1-012',
    careerId: 'carrera-consultoria',
    title: 'Ingeniería de Implementación: Consultas SQL, UDF/UDT, Autorizaciones y DTW',
    shortTitle: 'Consultoría, SQL & DTW',
    badge: 'Consultor Senior',
    iconName: 'Terminal',
    level: 'ARQUITECTURA',
    estimatedHours: 32,
    description: 'Herramientas de parametrización técnica avanzada: extracción de datos con SQL Queries, ampliación de base de datos con tablas de usuario, workflows de aprobación y migración masiva mediante DTW.',
    competencies: [
      'Construcción de consultas SQL con el Generador de Consultas sobre tablas clave (OJDT, OCRD, OITM, OPOR)',
      'Definición de Campos y Tablas de Usuario (UDF/UDT) para requerimientos de negocio',
      'Configuración de Búsquedas Formateadas (FMS) y Procedimientos de Aprobación por montos',
      'Migración de datos transaccionales y saldos iniciales con Data Transfer Workbench (DTW)'
    ],
    manualIds: [
      '10_Impl_11_CustomTools_Queries_ES',
      '10_Impl_12_CustomTools_Alerts_ES',
      '10_Impl_13_CustomTools_ApprovalProcesses_ES',
      '10_Impl_14_CustomTools_UserDefinedFields_ES',
      '10_Impl_15_CustomTools_UserDefinedValues_ES',
      '10_Impl_16_CustomTools_UserDefinedTables_ES',
      '10_Impl_17_CustomTools_IntroAnalytics_ES',
      '10_Impl_21_ImplTools_ImplementationMethodology_ES',
      '10_Impl_22_ImplTools_ExpressWizard_ES',
      '10_Impl_23_ImplTools_Key_Settings_ES',
      '10_Impl_25_ImplTools_OpeningBalances',
      '10_Impl_26_ImplTools_QuickCopy',
      '10_Impl_31_ImportfromExcel',
      '10_Impl_31_SystemSetup_Users_Groups_ES',
      '10_Impl_32_SystemSetup_GeneralAuthorizations_ES',
      '10_Impl_32_Using_Data_Trans_Workbench',
      '10_Impl_33_Importing_Docs_using_DTW',
      '10_Impl_33_SystemSetup_DataOwnership_ES',
      '10_Impl_34_SystemSetup_DocumentMasterDataNumbering_ES',
      '10_Impl_35_SystemSetup_UIConfigurationTemplates_ES',
      '10_Impl_36_SystemSetup_Print_layouts',
      '10_Impl_39_SystemSetup_EmailPrefrences',
      '10_Support_11_SupportProcTool_ES',
      'CSI08_Query_Practice',
      'CSI08_Query Practice_Solutions'
    ],
    simulatorArchetype: 'query',
    passingScorePercent: 90,
    officialIssuanceFeeUSD: 29,
    skillsTagged: ['SQL Queries', 'UDF / UDT', 'DTW', 'Flujos de Aprobación', 'Quick Copy']
  }
];

// ═══════════════════════════════════════════════════════════════════
// 3. ACREDITACIÓN DOCENTE UNIVERSITARIA ("TRAIN THE TRAINER")
// ═══════════════════════════════════════════════════════════════════

export const TEACHER_ACCREDITATION_INFO: TeacherAccreditationInfo = {
  specialistRequirements: 'Completar y aprobar con calificación mínima de 90% el 100% de los manuales y laboratorios en el simulador de una Carrera específica (ej. Carrera de Finanzas o Carrera de Logística). Habilita para dictar esa cátedra específica.',
  masterTeacherRequirements: 'Completar y aprobar con calificación mínima de 90% los 121 manuales de la academia, superar los 12 desafíos prácticos en el simulador de escritorio y aprobar la Defensa Pedagógica Virtual con Master B1. Otorga la Acreditación Plena como Instructor Titular Certificado SAP Business One.',
  perks: [
    'Panel de Gestión de Alumnos con vista de avances y notas en tiempo real',
    'Guías pedagógicas exclusivas generadas por Master B1 con preguntas socráticas de examen',
    'Banco de casos de estudio empresariales listos para proyectar en aula universitaria',
    'Certificado de Acreditación Docente con código de registro internacional para el CV académico',
    'Capacidad de firmar y avalar a sus propios estudiantes en proyectos de grado'
  ]
};

// ═══════════════════════════════════════════════════════════════════
// 4. FUNCIONES DE AYUDA Y UTILIDADES CURRICULARES
// ═══════════════════════════════════════════════════════════════════

export function getCareerById(id: CareerId): CareerTrack | undefined {
  return CAREER_TRACKS.find(c => c.id === id);
}

export function getMicroCertById(id: string): MicroCertification | undefined {
  return MICRO_CERTIFICATIONS.find(m => m.id === id);
}

export function getMicroCertsByCareer(careerId: CareerId): MicroCertification[] {
  return MICRO_CERTIFICATIONS.filter(m => m.careerId === careerId);
}

export function getCareerForManual(manualId: string): CareerTrack | undefined {
  const foundMicro = MICRO_CERTIFICATIONS.find(m => m.manualIds.includes(manualId));
  if (foundMicro) {
    return CAREER_TRACKS.find(c => c.id === foundMicro.careerId);
  }
  return undefined;
}
