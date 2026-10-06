import CLASES_AULA from '@/content/aula/clases.json';

export interface SyllabusClass {
  id: string;
  number: number;
  title: string;
  description: string;
  durationMinutes: number;
}

export interface SyllabusModule {
  id: string;
  number: number;
  title: string;
  description: string;
  badge: string;
  diplomaId?: string;
  classes: SyllabusClass[];
}

export interface SpecialtyDiploma {
  id: string;
  title: string;
  requiredModules: string[];
  description: string;
}

export const SPECIALTY_DIPLOMAS: SpecialtyDiploma[] = [
  {
    id: "dip-logistica",
    title: "Diploma de Especialidad en Logística y Supply Chain",
    requiredModules: ["mod-1", "mod-2", "mod-3"],
    description: "Especialista en abastecimiento, control de almacenes y entregas."
  },
  {
    id: "dip-comercial",
    title: "Diploma de Especialidad en Gestión Comercial y CRM",
    requiredModules: ["mod-1", "mod-4", "mod-5", "mod-6"],
    description: "Especialista en el ciclo Order-to-Cash, CRM y servicios."
  },
  {
    id: "dip-finanzas",
    title: "Diploma de Especialidad en Finanzas y Control NIIF",
    requiredModules: ["mod-1", "mod-7", "mod-8", "mod-9"],
    description: "Especialista contable, tributario, bancario y de activos fijos."
  },
  {
    id: "dip-industrial",
    title: "Diploma de Especialidad en Producción e Inteligencia de Negocios",
    requiredModules: ["mod-1", "mod-10", "mod-11", "mod-12"],
    description: "Experto en MRP, manufactura, proyectos y Query Manager SQL."
  }
];

export const OFFICIAL_SYLLABUS: SyllabusModule[] = [
  {
    id: "mod-1",
    number: 1,
    title: "Fundamentos Operativos y Navegación",
    description: "Aprende la arquitectura general, el inicio de sesión y la navegación fluida a través del Cockpit y los menús.",
    badge: "Core Basics",
    diplomaId: "dip-logistica", // Opcional, solo para taggear visualmente
    classes: [
      {
        id: "mod1-c1",
        number: 1,
        title: "Arquitectura y Cockpit Fiori",
        description: "Introducción al sistema, inicio de sesión y personalización de widgets.",
        durationMinutes: 15
      },
      {
        id: "mod1-c2",
        number: 2,
        title: "Parametrizaciones y Preferencias de Usuario",
        description: "Ajuste de idioma, formatos de fecha, moneda y atajos de teclado.",
        durationMinutes: 10
      },
      {
        id: "mod1-c3",
        number: 3,
        title: "Búsqueda y Funciones de Ayuda",
        description: "Uso del buscador Enterprise Search y consulta de ayudas nativas.",
        durationMinutes: 10
      },
      {
        id: "mod1-c4",
        number: 4,
        title: "Mensajes, Alertas y Autorizaciones",
        description: "Bandeja de entrada, alertas de sistema y restricciones de perfiles.",
        durationMinutes: 15
      }
    ]
  },
  {
    id: "mod-2",
    number: 2,
    title: "Núcleo Maestro ERP",
    description: "Gestión de Socios de Negocio, Catálogo de Artículos y Listas de Precios base.",
    badge: "Master Data",
    classes: [
      { id: "mod2-c1", number: 1, title: "Socio de Negocios (OCRD)", description: "", durationMinutes: 20 },
      { id: "mod2-c2", number: 2, title: "Datos Maestros de Artículo (OITM)", description: "", durationMinutes: 20 },
      { id: "mod2-c3", number: 3, title: "Gestión de Unidades de Medida", description: "", durationMinutes: 15 },
      { id: "mod2-c4", number: 4, title: "Determinación Estándar de Precios", description: "", durationMinutes: 25 },
    ]
  },
  {
    id: "mod-3",
    number: 3,
    title: "Aprovisionamiento y Control de Inventarios",
    description: "Ciclo Procure-to-Pay y control de almacenes logísticos.",
    badge: "Supply Chain",
    classes: [
      { id: "mod3-c1", number: 1, title: "Ciclo Procure-to-Pay", description: "", durationMinutes: 25 },
      { id: "mod3-c2", number: 2, title: "Transacciones de Almacén", description: "", durationMinutes: 20 },
      { id: "mod3-c3", number: 3, title: "Ubicaciones (Bin Locations)", description: "", durationMinutes: 20 },
      { id: "mod3-c4", number: 4, title: "Trazabilidad por Lotes y Series", description: "", durationMinutes: 20 },
      { id: "mod3-c5", number: 5, title: "Costos de Importación", description: "", durationMinutes: 25 },
    ]
  },
  // The rest are mocked for now to build the UI
  {
    id: "mod-4",
    number: 4,
    title: "Gestión de Ventas y Order-to-Cash",
    description: "Ciclo de ventas y facturación.",
    badge: "Ventas",
    classes: []
  },
  {
    id: "mod-5",
    number: 5,
    title: "Estrategias Avanzadas de Precios",
    description: "Descuentos, campañas y periodos.",
    badge: "Comercial",
    classes: []
  },
  {
    id: "mod-6",
    number: 6,
    title: "Gestión CRM y Servicios Post-venta",
    description: "Llamadas de servicio, garantías.",
    badge: "CRM",
    classes: []
  },
  {
    id: "mod-7",
    number: 7,
    title: "Contabilidad Central y NIIF",
    description: "Plan de cuentas, asientos manuales.",
    badge: "Finanzas",
    classes: []
  },
  {
    id: "mod-8",
    number: 8,
    title: "Tesorería, Cobros y Pagos (Bancos)",
    description: "Gestión de cobros, pagos, extractos.",
    badge: "Tesorería",
    classes: []
  },
  {
    id: "mod-9",
    number: 9,
    title: "Control de Activos Fijos",
    description: "Amortizaciones, altas y bajas.",
    badge: "Activos Fijos",
    classes: []
  },
  {
    id: "mod-10",
    number: 10,
    title: "Planificación de Materiales (MRP)",
    description: "Pronósticos y asistente MRP.",
    badge: "Logística",
    classes: []
  },
  {
    id: "mod-11",
    number: 11,
    title: "Fabricación y Proyectos (BOM)",
    description: "Órdenes de producción, recetas.",
    badge: "Producción",
    classes: []
  },
  {
    id: "mod-12",
    number: 12,
    title: "Consultoría y Herramientas SQL",
    description: "Consultas SQL, DTW.",
    badge: "Consultoría",
    classes: []
  }
];

// Temario real de Mi Aula: generado por scripts/aula/publicar_clases.py a partir de scripts/aula/plan.json.
// Reemplaza las clases de cada módulo que tenga contenido publicado (los módulos 4-12 estaban vacíos).
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
