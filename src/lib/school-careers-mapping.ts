import { ALL_MANUALS, ManualItem } from '@/lib/manuals-120-data';

export interface SchoolCareerInfo {
  id: string;
  number: number;
  code: string;
  title: string;
  shortTitle: string;
  badge: string;
  colorTheme: string;
  gradient: string;
  careerRole: string;
  totalHours: number;
  certificateTitle: string;
  diplomaTitle: string;
  description: string;
  objectives: string[];
  categories: string[];
}

export const SCHOOL_CAREERS_CATALOG: SchoolCareerInfo[] = [
  {
    id: 'carrera-fundamentos',
    number: 1,
    code: 'B1-CAR-01',
    title: 'Fundamentos Operativos, Navegación y Núcleo Maestro ERP',
    shortTitle: 'Fundamentos & Núcleo ERP',
    badge: 'Onboarding & Core ERP',
    colorTheme: 'emerald',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    careerRole: 'Operador de Negocios Certificado SAP B1',
    totalHours: 40,
    certificateTitle: 'Certificado de Especialista en Fundamentos y Núcleo Maestro SAP B1',
    diplomaTitle: 'Diploma Oficial de Operador de Negocios en SAP Business One',
    description: 'Inmersión profunda en la arquitectura in-memory SAP HANA, navegación Fiori, datos maestros de Socios de Negocios (OCRD) y Artículos (OITM), matrices jerárquicas de precios y trazabilidad en el Mapa de Relaciones.',
    objectives: [
      'Dominar la navegación fluida en SAP B1 10.0 y personalización del Cockpit Fiori.',
      'Gestionar de punta a punta fichas de clientes y proveedores con condiciones crediticias.',
      'Configurar catálogos de artículos, grupos y unidades de medida (UoM).',
      'Administrar la jerarquía de 4 niveles de precios y descuentos comerciales.',
      'Auditar cadenas documentales completas mediante el Mapa de Relaciones.'
    ],
    categories: [
      'Introducción a SAP Business One',
      'Datos Maestros de Artículo',
      'Determinación de Precios',
      'Casos Prácticos y Ejercicios'
    ]
  },
  {
    id: 'carrera-finanzas',
    number: 2,
    code: 'B1-CAR-02',
    title: 'Finanzas Corporativas, Contabilidad NIIF y Tesorería',
    shortTitle: 'Finanzas NIIF & Tesorería',
    badge: 'Finanzas & Compliance',
    colorTheme: 'blue',
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    careerRole: 'Especialista Financiero y Tesorero SAP B1',
    totalHours: 90,
    certificateTitle: 'Certificado de Especialista en Finanzas Corporativas y NIIF SAP B1',
    diplomaTitle: 'Diploma Oficial de Especialista en Finanzas y Control de Gestión SAP B1',
    description: 'Ingeniería contable bajo estándares internacionales NIIF/IFRS: Plan de Cuentas en 5 niveles, motor de determinación automática de cuentas de mayor (G/L), tesorería bancaria, asistente de pagos masivos (Payment Wizard), conciliaciones y activos fijos.',
    objectives: [
      'Diseñar y administrar el Plan de Cuentas NIIF con cuentas asociadas de control.',
      'Parametrizar las reglas de determinación contable automática en compras, ventas e inventario.',
      'Operar el circuito bancario de cobros, pagos recibidos y depósitos.',
      'Ejecutar el Asistente de Pagos Masivos a Proveedores y conciliaciones bancarias.',
      'Controlar la vida útil, amortizaciones y bajas en el módulo de Activos Fijos.',
      'Configurar centros de beneficio, normas de reparto y estados financieros.'
    ],
    categories: [
      'Contabilidad Básica',
      'Gestión Bancaria y Pagos',
      'Informes Financieros y Control',
      'Costos y Presupuestos',
      'Procesos Financieros',
      'Configuración Financiera',
      'Activos Fijos'
    ]
  },
  {
    id: 'carrera-logistica',
    number: 3,
    code: 'B1-CAR-03',
    title: 'Logística Integral, Cadena de Suministro (SCM) y Ventas',
    shortTitle: 'Logística, SCM & Ventas',
    badge: 'Supply Chain & Sales',
    colorTheme: 'amber',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    careerRole: 'Especialista en Cadena de Suministro & Logística SAP B1',
    totalHours: 95,
    certificateTitle: 'Certificado de Especialista en Cadena de Suministro y Logística SAP B1',
    diplomaTitle: 'Diploma Oficial de Especialista en Cadena de Suministro y Ventas SAP B1',
    description: 'Gestión de punta a punta de los ciclos comerciales Order-to-Cash y Procure-to-Pay, verificación de disponibilidad ATP en tiempo real, topología de almacenes con ubicaciones tridimensionales (Bin Locations), trazabilidad por lotes/series y costeo de importaciones con Landed Costs.',
    objectives: [
      'Ejecutar el ciclo comercial completo: Oferta, Pedido, ATP, Entrega y Factura A/R.',
      'Optimizar el aprovisionamiento corporativo: Solicitud, Orden de Compra, GRPO y Factura A/P.',
      'Gestionar almacenes con ubicaciones físicas (Bin Locations) y picking automatizado.',
      'Controlar vencimientos y garantías mediante gestión de Lotes y Números de Serie.',
      'Calcular y prorratear gastos aduaneros y fletes internacionales con Costes de Destino.'
    ],
    categories: [
      'Compras y Aprovisionamiento',
      'Ventas',
      'Gestión de Inventario y Artículos',
      'Inventarios y Movimientos',
      'Ubicaciones en Almacén (Bin Locations)',
      'Gestión de Servicios'
    ]
  },
  {
    id: 'carrera-consultoria',
    number: 4,
    code: 'B1-CAR-04',
    title: 'Planificación MRP, Producción y Consultoría de Implementación',
    shortTitle: 'MRP, Producción & Consultoría',
    badge: 'Arquitectura & Consultoría',
    colorTheme: 'purple',
    gradient: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
    careerRole: 'Consultor de Implementación & Planificación SAP B1',
    totalHours: 85,
    certificateTitle: 'Certificado de Consultor de Implementación y Planificación SAP B1',
    diplomaTitle: 'Diploma Oficial de Consultor de Implementación y Planificación SAP B1',
    description: 'Planificación de necesidades de material (MRP), listas de materiales (BOM) y órdenes de fabricación, complementado con la suite de consultoría técnica: consultas SQL en HANA, campos de usuario (UDF/UDT), búsquedas formateadas y migración masiva con Data Transfer Workbench (DTW).',
    objectives: [
      'Modelar estructuras de producto complejas con Listas de Materiales (BOM) de producción.',
      'Ejecutar simulaciones del Asistente MRP con pronósticos de demanda y stock mínimo.',
      'Administrar Órdenes de Fabricación con emisión de componentes y recibo de producto terminado.',
      'Diseñar consultas SQL complejas sobre el esquema de base de datos relacional de SAP B1.',
      'Automatizar controles con Procedimientos de Aprobación y Búsquedas Formateadas (FMS).',
      'Migrar bases de datos y saldos de apertura con Data Transfer Workbench (DTW).'
    ],
    categories: [
      'Planificación de Materiales (MRP)',
      'Producción',
      'Gestión de Proyectos',
      'Implementación y Configuración',
      'Herramientas de Soporte'
    ]
  }
];

export interface CareerModule {
  categoryName: string;
  manuals: ManualItem[];
}

export function getCareerById(id: string): SchoolCareerInfo | undefined {
  return SCHOOL_CAREERS_CATALOG.find(c => c.id === id);
}

export function getCareerManuals(careerId: string): ManualItem[] {
  const career = getCareerById(careerId);
  if (!career) return [];
  return ALL_MANUALS.filter(m => career.categories.includes(m.category));
}

export function getCareerModules(careerId: string): CareerModule[] {
  const career = getCareerById(careerId);
  if (!career) return [];

  const modules: CareerModule[] = [];
  career.categories.forEach(catName => {
    const manuals = ALL_MANUALS.filter(m => m.category === catName);
    if (manuals.length > 0) {
      modules.push({
        categoryName: catName,
        manuals
      });
    }
  });

  return modules;
}
