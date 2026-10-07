export interface TechnicalManualItem {
  id: string;
  block: string;
  blockTitle: string;
  number: number;
  level: "OP" | "ARQ";
  title: string;
  category: string;
  summary: string;
}

export const ALL_83_MANUALS: TechnicalManualItem[] = [
  {
    "id": "man-01",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 1,
    "level": "ARQ",
    "title": "Administración: Configuración inicial de la compañía",
    "category": "Configuración",
    "summary": "Inicialización de la compañía, ejercicio fiscal, moneda local USD, plan de cuentas base NIIF."
  },
  {
    "id": "man-02",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 2,
    "level": "ARQ",
    "title": "Administración: Usuarios, autorizaciones y licencias",
    "category": "Seguridad",
    "summary": "Gestión de roles, segregación de funciones, licencias profesionales y limitadas."
  },
  {
    "id": "man-03",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 3,
    "level": "ARQ",
    "title": "Finanzas I: Plan de Cuentas y Determinación de Contabilización (G/L)",
    "category": "Finanzas",
    "summary": "Mapeo de cuentas de mayor por almacén, grupo de artículos y reglas de contabilización automática."
  },
  {
    "id": "man-04",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 4,
    "level": "OP",
    "title": "Finanzas II: Asientos de diario y plantillas recurrentes",
    "category": "Finanzas",
    "summary": "Registro de asientos manuales, reversiones y transacciones periódicas programadas."
  },
  {
    "id": "man-05",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 5,
    "level": "OP",
    "title": "Finanzas III: Cuentas por cobrar y por pagar (Antigüedad de saldos)",
    "category": "Finanzas",
    "summary": "Gestión de cartera, reportes de cobranza y análisis de envejecimiento de deudas."
  },
  {
    "id": "man-06",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 6,
    "level": "OP",
    "title": "Finanzas IV: Activos Fijos",
    "category": "Finanzas",
    "summary": "Depreciación acumulada, bajas de activos, áreas de amortización y transferencias."
  },
  {
    "id": "man-07",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 7,
    "level": "ARQ",
    "title": "Finanzas V: Presupuestos y centros de costo",
    "category": "Finanzas",
    "summary": "Definición de escenarios presupuestarios y reglas de distribución por centro de beneficio."
  },
  {
    "id": "man-08",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 8,
    "level": "OP",
    "title": "Banca: Pagos, cheques y conciliación bancaria",
    "category": "Tesorería",
    "summary": "Emisión de cheques, pagos electrónicos, remesas de depósito y conciliación de extractos."
  },
  {
    "id": "man-09",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 9,
    "level": "OP",
    "title": "Socios de Negocio: Maestro de clientes y proveedores",
    "category": "Maestros",
    "summary": "Ficha OCRD, condiciones de pago, listas de precios y matrices de descuento."
  },
  {
    "id": "man-10",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 10,
    "level": "OP",
    "title": "Ventas–Clientes: Ciclo comercial completo (Oferta a Factura)",
    "category": "Ventas",
    "summary": "Flujo Order-to-Cash: Cotización → Pedido → Entrega → Factura A/R."
  },
  {
    "id": "man-11",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 11,
    "level": "OP",
    "title": "Oportunidades de venta y CRM",
    "category": "Comercial",
    "summary": "Gestión de pipeline de oportunidades comerciales, etapas y previsión de cierre."
  },
  {
    "id": "man-12",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 12,
    "level": "OP",
    "title": "Compras–Proveedores: Ciclo de aprovisionamiento",
    "category": "Compras",
    "summary": "Flujo Procure-to-Pay: Requisición → Orden de Compra → Recepción (GRPO) → Factura A/P."
  },
  {
    "id": "man-13",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 13,
    "level": "OP",
    "title": "Inventario I: Maestro de artículos y listas de precios",
    "category": "Inventario",
    "summary": "Ficha OITM, clasificación por grupos, unidades de medida y listas de precios múltiples."
  },
  {
    "id": "man-14",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 14,
    "level": "OP",
    "title": "Inventario II: Almacenes, transferencias y conteo cíclico",
    "category": "Inventario",
    "summary": "Traslados entre bodegas, control de mermas y auditoría de inventario físico periódico."
  },
  {
    "id": "man-15",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 15,
    "level": "ARQ",
    "title": "Inventario III: Métodos de valoración y costeo (FIFO/Promedio/Estándar)",
    "category": "Costos",
    "summary": "Impacto contable de FIFO vs Promedio Ponderado Móvil en el costo de exportación."
  },
  {
    "id": "man-16",
    "block": "A",
    "blockTitle": "SAP Business One: Núcleo Transversal",
    "number": 16,
    "level": "OP",
    "title": "Informes, Query Generator y dashboards SAP HANA",
    "category": "Analítica",
    "summary": "Consultas SQL directas, Crystal Reports interactivo y cuadros de mando en Cockpit."
  },
  {
    "id": "man-17",
    "block": "B",
    "blockTitle": "SAP Business One: Producción y Planificación",
    "number": 17,
    "level": "OP",
    "title": "Recursos: Maestro de mano de obra y maquinaria",
    "category": "Producción",
    "summary": "Capacidad de líneas, centros de trabajo y costos horarios de máquinas."
  },
  {
    "id": "man-18",
    "block": "B",
    "blockTitle": "SAP Business One: Producción y Planificación",
    "number": 18,
    "level": "OP",
    "title": "Producción I: Listas de materiales (BOM)",
    "category": "Producción",
    "summary": "Estructura de producto: fórmula de ensamble, materias primas y fases operativas."
  },
  {
    "id": "man-19",
    "block": "B",
    "blockTitle": "SAP Business One: Producción y Planificación",
    "number": 19,
    "level": "OP",
    "title": "Producción II: Órdenes de producción y reporte de piso",
    "category": "Producción",
    "summary": "Emisión de órdenes, consumo de componentes por backflush y cierre de producto terminado."
  },
  {
    "id": "man-20",
    "block": "B",
    "blockTitle": "SAP Business One: Producción y Planificación",
    "number": 20,
    "level": "ARQ",
    "title": "MRP: Pronósticos y planificación de requerimientos",
    "category": "Planificación",
    "summary": "Escenarios de cálculo de necesidades netas de compras y fabricación."
  },
  {
    "id": "man-21",
    "block": "B",
    "blockTitle": "SAP Business One: Producción y Planificación",
    "number": 21,
    "level": "OP",
    "title": "Servicio: Contratos y llamadas de servicio",
    "category": "Servicio",
    "summary": "Garantías, acuerdos SLA y seguimiento de mantenimiento posventa."
  },
  {
    "id": "man-22",
    "block": "B",
    "blockTitle": "SAP Business One: Producción y Planificación",
    "number": 22,
    "level": "OP",
    "title": "Proyectos: Fases, presupuesto y documentos vinculados",
    "category": "Proyectos",
    "summary": "Control financiero de proyectos plurianuales y rentabilidad por etapa."
  },
  {
    "id": "man-23",
    "block": "C",
    "blockTitle": "Localización y Cumplimiento Ecuador SRI",
    "number": 23,
    "level": "ARQ",
    "title": "Facturación electrónica SRI: Comprobantes, firma y autorización",
    "category": "Tributación SRI",
    "summary": "Generación de XML XAdES-BES, clave de acceso de 49 dígitos y web service SRI."
  },
  {
    "id": "man-24",
    "block": "C",
    "blockTitle": "Localización y Cumplimiento Ecuador SRI",
    "number": 24,
    "level": "ARQ",
    "title": "Retenciones en la fuente: IVA e Impuesto a la Renta",
    "category": "Tributación SRI",
    "summary": "Retenciones vigentes desde marzo 2026: 312 bienes (2%), 304 mano de obra (3%), sociedades profesionales (5%), 303 honorarios (10%) y retención IVA 30%/70%/100%."
  },
  {
    "id": "man-25",
    "block": "C",
    "blockTitle": "Localización y Cumplimiento Ecuador SRI",
    "number": 25,
    "level": "ARQ",
    "title": "Anexo Transaccional Simplificado (ATS): Generación y consolidación",
    "category": "Tributación SRI",
    "summary": "Extracción mensual de compras, ventas y retenciones para reporte oficial al SRI."
  },
  {
    "id": "man-26",
    "block": "C",
    "blockTitle": "Localización y Cumplimiento Ecuador SRI",
    "number": 26,
    "level": "ARQ",
    "title": "Formularios SRI 103, 104 y 101: Interpretación y cruce contable",
    "category": "Tributación SRI",
    "summary": "Conciliación entre los saldos contables de SAP B1 y los casilleros de impuestos."
  },
  {
    "id": "man-27",
    "block": "C",
    "blockTitle": "Localización y Cumplimiento Ecuador SRI",
    "number": 27,
    "level": "ARQ",
    "title": "Impuesto a la Salida de Divisas (ISD) y pagos al exterior",
    "category": "Tributación SRI",
    "summary": "Tarifa del ISD (5% en 2026), retenciones bancarias y exenciones tributarias."
  },
  {
    "id": "man-28",
    "block": "C",
    "blockTitle": "Localización y Cumplimiento Ecuador SRI",
    "number": 28,
    "level": "ARQ",
    "title": "RIMPE y tipos de contribuyente: Impacto en la ficha de clientes/proveedores",
    "category": "Tributación SRI",
    "summary": "Negocios populares y emprendedores: parametrización de UDFs en tabla OCRD."
  },
  {
    "id": "man-29",
    "block": "D",
    "blockTitle": "Adaptaciones Verticales Ecuatorianas",
    "number": 29,
    "level": "ARQ",
    "title": "Vertical Manufactura: Beas Manufacturing y costeo por absorción",
    "category": "Verticales",
    "summary": "MES industrial, control de tiempos de operarios y absorción de costos indirectos (CIF)."
  },
  {
    "id": "man-30",
    "block": "D",
    "blockTitle": "Adaptaciones Verticales Ecuatorianas",
    "number": 30,
    "level": "OP",
    "title": "Vertical Manufactura: Programación de planta (Visual Scheduler)",
    "category": "Verticales",
    "summary": "Planificación gráfica de producción tipo diagrama de Gantt y secuenciamiento."
  },
  {
    "id": "man-31",
    "block": "D",
    "blockTitle": "Adaptaciones Verticales Ecuatorianas",
    "number": 31,
    "level": "OP",
    "title": "Vertical Alimentos y Bebidas: Trazabilidad por lote y vencimiento",
    "category": "Verticales",
    "summary": "Control de lotes hacia adelante y hacia atrás, recetas y fechas de caducidad."
  },
  {
    "id": "man-32",
    "block": "D",
    "blockTitle": "Adaptaciones Verticales Ecuatorianas",
    "number": 32,
    "level": "OP",
    "title": "Vertical Farmacéutica: Números de serie y cadena de frío",
    "category": "Verticales",
    "summary": "Normativa ARCSA de buenas prácticas de manufactura y distribución farmacéutica."
  },
  {
    "id": "man-33",
    "block": "D",
    "blockTitle": "Adaptaciones Verticales Ecuatorianas",
    "number": 33,
    "level": "OP",
    "title": "Vertical Textil: Matrices de talla y color",
    "category": "Verticales",
    "summary": "Parametrización de artículos en dos dimensiones con códigos de barras derivados."
  },
  {
    "id": "man-34",
    "block": "D",
    "blockTitle": "Adaptaciones Verticales Ecuatorianas",
    "number": 34,
    "level": "OP",
    "title": "Vertical Agrícola: Costeo por finca y ciclo de cultivo",
    "category": "Verticales",
    "summary": "Insumos agrícolas, mano de obra de campo y acumulación de costos por hectárea."
  },
  {
    "id": "man-35",
    "block": "D",
    "blockTitle": "Adaptaciones Verticales Ecuatorianas",
    "number": 35,
    "level": "OP",
    "title": "Vertical Bananera: Trazabilidad de caja/lote y comercio exterior",
    "category": "Verticales",
    "summary": "Control de calidad en empacadora, GlobalGAP y Precio Mínimo de Sustentación."
  },
  {
    "id": "man-36",
    "block": "D",
    "blockTitle": "Adaptaciones Verticales Ecuatorianas",
    "number": 36,
    "level": "OP",
    "title": "Vertical Camaronera: Costeo por piscina y ciclo biológico",
    "category": "Verticales",
    "summary": "Piscinas como centros de costo, factor de conversión alimenticia y costo por libra."
  },
  {
    "id": "man-37",
    "block": "D",
    "blockTitle": "Adaptaciones Verticales Ecuatorianas",
    "number": 37,
    "level": "OP",
    "title": "Vertical Retail: Punto de venta e integración omnicanal",
    "category": "Verticales",
    "summary": "Cajas registradoras, facturación rápida en mostrador y cierre diario de caja."
  },
  {
    "id": "man-38",
    "block": "D",
    "blockTitle": "Adaptaciones Verticales Ecuatorianas",
    "number": 38,
    "level": "ARQ",
    "title": "Gestión avanzada de inventarios: WMS y captura por radiofrecuencia (Produmex)",
    "category": "Verticales",
    "summary": "Ubicaciones tridimensionales (bins), pistolas de radiofrecuencia y picking guiado."
  },
  {
    "id": "man-39",
    "block": "E",
    "blockTitle": "Personalización y Ecosistema Boyum IT",
    "number": 39,
    "level": "ARQ",
    "title": "B1 Usability Package (B1UP): Automatizaciones y dashboards",
    "category": "Add-ons",
    "summary": "Creación de botones, reglas de validación sin código y envío automático con B1 Print."
  },
  {
    "id": "man-40",
    "block": "E",
    "blockTitle": "Personalización y Ecosistema Boyum IT",
    "number": 40,
    "level": "ARQ",
    "title": "Ecosistema de partners tecnológicos: Boyum IT y alcance de add-ons",
    "category": "Add-ons",
    "summary": "Matriz de compatibilidad y arquitectura de add-ons certificados para SAP B1."
  },
  {
    "id": "man-41",
    "block": "F",
    "blockTitle": "Nómina HCM: Operación Laboral",
    "number": 41,
    "level": "OP",
    "title": "Hoja de Vida: Administración de colaboradores",
    "category": "Nómina",
    "summary": "Datos personales, contrato, centro de costos y cuenta bancaria de dispersión."
  },
  {
    "id": "man-42",
    "block": "F",
    "blockTitle": "Nómina HCM: Operación Laboral",
    "number": 42,
    "level": "OP",
    "title": "Novedades y trámites del mes",
    "category": "Nómina",
    "summary": "Registro de horas extras, faltas justificadas, permisos y comisiones del período."
  },
  {
    "id": "man-43",
    "block": "F",
    "blockTitle": "Nómina HCM: Operación Laboral",
    "number": 43,
    "level": "OP",
    "title": "Liquidación de nómina: Proceso estándar",
    "category": "Nómina",
    "summary": "Cálculo de ingresos gravados, deducciones de ley y salario neto mensual."
  },
  {
    "id": "man-44",
    "block": "F",
    "blockTitle": "Nómina HCM: Operación Laboral",
    "number": 44,
    "level": "OP",
    "title": "Procesos de liquidación especiales (Vacaciones, subsidios)",
    "category": "Nómina",
    "summary": "Cálculo proporcional de vacaciones (15 días al año) y licencias médicas."
  },
  {
    "id": "man-45",
    "block": "F",
    "blockTitle": "Nómina HCM: Operación Laboral",
    "number": 45,
    "level": "OP",
    "title": "Auditoría de nómina",
    "category": "Nómina",
    "summary": "Revisión cruzada de variaciones salariales frente al mes previo antes del pago."
  },
  {
    "id": "man-46",
    "block": "F",
    "blockTitle": "Nómina HCM: Operación Laboral",
    "number": 46,
    "level": "OP",
    "title": "Pago de nómina y dispersión bancaria",
    "category": "Nómina",
    "summary": "Generación de archivos bancarios para Banco Pichincha, Guayaquil, Pacífico, etc."
  },
  {
    "id": "man-47",
    "block": "F",
    "blockTitle": "Nómina HCM: Operación Laboral",
    "number": 47,
    "level": "OP",
    "title": "Notificaciones al colaborador (Rol de pagos)",
    "category": "Nómina",
    "summary": "Envío automático por correo electrónico del comprobante de liquidación mensual."
  },
  {
    "id": "man-48",
    "block": "F",
    "blockTitle": "Nómina HCM: Operación Laboral",
    "number": 48,
    "level": "OP",
    "title": "Seguridad social: Generación de planilla IESS",
    "category": "Nómina",
    "summary": "Exportación en archivo plano .TXT para validación en el portal web del IESS."
  },
  {
    "id": "man-49",
    "block": "F",
    "blockTitle": "Nómina HCM: Operación Laboral",
    "number": 49,
    "level": "OP",
    "title": "Nómina electrónica: Consolidación y archivo legal",
    "category": "Nómina",
    "summary": "Almacenamiento de soportes electrónicos y auditoría de comprobantes."
  },
  {
    "id": "man-50",
    "block": "G",
    "blockTitle": "Nómina HCM: Configuración / Caja Negra",
    "number": 50,
    "level": "ARQ",
    "title": "Usuarios, perfiles y permisos",
    "category": "Configuración HCM",
    "summary": "Seguridad de acceso, perfiles de liquidador vs auditor y bitácora de cambios."
  },
  {
    "id": "man-51",
    "block": "G",
    "blockTitle": "Nómina HCM: Configuración / Caja Negra",
    "number": 51,
    "level": "ARQ",
    "title": "Creación y parametrización de conceptos",
    "category": "Configuración HCM",
    "summary": "Fórmulas matemáticas de conceptos: si aporta al IESS y si graba Impuesto a la Renta."
  },
  {
    "id": "man-52",
    "block": "G",
    "blockTitle": "Nómina HCM: Configuración / Caja Negra",
    "number": 52,
    "level": "ARQ",
    "title": "Configuración de promedios",
    "category": "Configuración HCM",
    "summary": "Reglas para liquidar conceptos con bases variables en los últimos 12 meses."
  },
  {
    "id": "man-53",
    "block": "G",
    "blockTitle": "Nómina HCM: Configuración / Caja Negra",
    "number": 53,
    "level": "ARQ",
    "title": "Centro de costos: Áreas funcionales",
    "category": "Configuración HCM",
    "summary": "Estructuración analítica para distribuir el gasto de personal por departamento."
  },
  {
    "id": "man-54",
    "block": "G",
    "blockTitle": "Nómina HCM: Configuración / Caja Negra",
    "number": 54,
    "level": "ARQ",
    "title": "Asientos contables: Interfaz hacia SAP Business One",
    "category": "Configuración HCM",
    "summary": "Plantilla de mapeo concepto → cuenta contable y transmisión automática vía Service Layer."
  },
  {
    "id": "man-55",
    "block": "G",
    "blockTitle": "Nómina HCM: Configuración / Caja Negra",
    "number": 55,
    "level": "OP",
    "title": "Terceros: Fondos, cooperativas y beneficiarios",
    "category": "Configuración HCM",
    "summary": "Parametrización de entidades acreedoras para descuentos por nómina."
  },
  {
    "id": "man-56",
    "block": "G",
    "blockTitle": "Nómina HCM: Configuración / Caja Negra",
    "number": 56,
    "level": "OP",
    "title": "Préstamos y embargos judiciales",
    "category": "Configuración HCM",
    "summary": "Control de cuotas, topes de retención legal (pensiones de alimentos en SUPA)."
  },
  {
    "id": "man-57",
    "block": "G",
    "blockTitle": "Nómina HCM: Configuración / Caja Negra",
    "number": 57,
    "level": "ARQ",
    "title": "Parametrización general del sistema",
    "category": "Configuración HCM",
    "summary": "Parámetros globales de la empresa, políticas de redondeo y calendarios laborales."
  },
  {
    "id": "man-58",
    "block": "G",
    "blockTitle": "Nómina HCM: Configuración / Caja Negra",
    "number": 58,
    "level": "ARQ",
    "title": "Proceso de cierre e inicio de año (Actualización SBU e IESS)",
    "category": "Configuración HCM",
    "summary": "Actualización obligatoria en enero del Salario Básico ($482) y tablas IESS."
  },
  {
    "id": "man-59",
    "block": "H",
    "blockTitle": "Gestión Humana: Talento 360°",
    "number": 59,
    "level": "OP",
    "title": "Centralización de hoja de vida: Colaboradores y aspirantes",
    "category": "Gestión Humana",
    "summary": "Base de datos unificada de experiencia, títulos y competencias personales."
  },
  {
    "id": "man-60",
    "block": "H",
    "blockTitle": "Gestión Humana: Talento 360°",
    "number": 60,
    "level": "OP",
    "title": "Selección y contratación con screening de IA",
    "category": "Gestión Humana",
    "summary": "Filtro automatizado de CVs por concordancia con el perfil del puesto."
  },
  {
    "id": "man-61",
    "block": "H",
    "blockTitle": "Gestión Humana: Talento 360°",
    "number": 61,
    "level": "OP",
    "title": "Capacitación y desarrollo",
    "category": "Gestión Humana",
    "summary": "Mapeo de necesidades formativas y planes de entrenamiento empresarial."
  },
  {
    "id": "man-62",
    "block": "H",
    "blockTitle": "Gestión Humana: Talento 360°",
    "number": 62,
    "level": "OP",
    "title": "Evaluación de desempeño por objetivos y competencias",
    "category": "Gestión Humana",
    "summary": "Evaluación periódica de metas individuales alineadas con los OKRs del negocio."
  },
  {
    "id": "man-63",
    "block": "H",
    "blockTitle": "Gestión Humana: Talento 360°",
    "number": 63,
    "level": "ARQ",
    "title": "Estructura organizacional y gestión de vacantes",
    "category": "Gestión Humana",
    "summary": "Organigrama dinámico, jerarquías de aprobación y detección de plazas críticas."
  },
  {
    "id": "man-64",
    "block": "H",
    "blockTitle": "Gestión Humana: Talento 360°",
    "number": 64,
    "level": "OP",
    "title": "Procesos disciplinarios",
    "category": "Gestión Humana",
    "summary": "Registro de amonestaciones, llamados de atención y soporte para Visto Bueno."
  },
  {
    "id": "man-65",
    "block": "H",
    "blockTitle": "Gestión Humana: Talento 360°",
    "number": 65,
    "level": "OP",
    "title": "Portales de autogestión (Empleado y líder)",
    "category": "Gestión Humana",
    "summary": "Solicitud de vacaciones en línea, certificados laborales y roles de pago."
  },
  {
    "id": "man-66",
    "block": "H",
    "blockTitle": "Gestión Humana: Talento 360°",
    "number": 66,
    "level": "OP",
    "title": "Business Intelligence de talento humano",
    "category": "Gestión Humana",
    "summary": "Indicadores de rotación de personal, ausentismo y auditoría de pasivo vacacional."
  },
  {
    "id": "man-67",
    "block": "I",
    "blockTitle": "Marco Normativo Laboral Ecuatoriano",
    "number": 67,
    "level": "OP",
    "title": "IESS: Aportes personal y patronal, fondos de reserva",
    "category": "Leyes Ecuador",
    "summary": "Fórmulas 9.45% + 12.15% y 8.33% de fondos de reserva a partir del mes 13."
  },
  {
    "id": "man-68",
    "block": "I",
    "blockTitle": "Marco Normativo Laboral Ecuatoriano",
    "number": 68,
    "level": "OP",
    "title": "Décimo tercero y décimo cuarto sueldo: Cálculo y provisión",
    "category": "Leyes Ecuador",
    "summary": "Bono navideño (remuneraciones/12) y escolar (1 SBU según Costa o Sierra)."
  },
  {
    "id": "man-69",
    "block": "I",
    "blockTitle": "Marco Normativo Laboral Ecuatoriano",
    "number": 69,
    "level": "OP",
    "title": "Horas suplementarias, extraordinarias y recargo nocturno",
    "category": "Leyes Ecuador",
    "summary": "Cálculo sobre base 240: +50% diurnas, +100% fines de semana y +25% nocturnas."
  },
  {
    "id": "man-70",
    "block": "I",
    "blockTitle": "Marco Normativo Laboral Ecuatoriano",
    "number": 70,
    "level": "OP",
    "title": "Utilidades: Cálculo y distribución legal (15%)",
    "category": "Leyes Ecuador",
    "summary": "10% de distribución directa + 5% en proporción a cargas familiares acreditadas."
  },
  {
    "id": "man-71",
    "block": "I",
    "blockTitle": "Marco Normativo Laboral Ecuatoriano",
    "number": 71,
    "level": "OP",
    "title": "SUT del Ministerio del Trabajo: Contratos y actas de finiquito",
    "category": "Leyes Ecuador",
    "summary": "Registro obligatorio de contratos en 15 días y legalización de finiquitos."
  },
  {
    "id": "man-72",
    "block": "I",
    "blockTitle": "Marco Normativo Laboral Ecuatoriano",
    "number": 72,
    "level": "ARQ",
    "title": "Terminación laboral: Visto Bueno, despido e indemnizaciones",
    "category": "Leyes Ecuador",
    "summary": "Art. 185 (desahucio 25%) y Art. 188 (despido intempestivo hasta 25 salarios)."
  },
  {
    "id": "man-73",
    "block": "J",
    "blockTitle": "Flujos de Trabajo Transversales",
    "number": 73,
    "level": "OP",
    "title": "Flujo Order-to-Cash: Del pedido al cobro",
    "category": "Flujos End-to-End",
    "summary": "Ruta completa comercial en SAP B1 y conciliación de cuentas por cobrar."
  },
  {
    "id": "man-74",
    "block": "J",
    "blockTitle": "Flujos de Trabajo Transversales",
    "number": 74,
    "level": "OP",
    "title": "Flujo Procure-to-Pay: De la compra al pago",
    "category": "Flujos End-to-End",
    "summary": "Aprovisionamiento, recepción física y retenciones en la fuente a proveedores."
  },
  {
    "id": "man-75",
    "block": "J",
    "blockTitle": "Flujos de Trabajo Transversales",
    "number": 75,
    "level": "OP",
    "title": "Flujo Producir y Exportar (Bananero / Camaronero)",
    "category": "Flujos End-to-End",
    "summary": "De la cosecha en finca o pesca en piscina hasta el embarque en contenedor."
  },
  {
    "id": "man-76",
    "block": "J",
    "blockTitle": "Flujos de Trabajo Transversales",
    "number": 76,
    "level": "OP",
    "title": "Flujo de cálculo y cierre de nómina mensual",
    "category": "Flujos End-to-End",
    "summary": "De la importación biométrica hasta la dispersión bancaria y contabilización."
  },
  {
    "id": "man-77",
    "block": "J",
    "blockTitle": "Flujos de Trabajo Transversales",
    "number": 77,
    "level": "OP",
    "title": "Flujo de ingreso de colaborador (Onboarding)",
    "category": "Flujos End-to-End",
    "summary": "Contrato SUT → Aviso de entrada IESS → Hoja de vida digital → Asignación centro de costos."
  },
  {
    "id": "man-78",
    "block": "J",
    "blockTitle": "Flujos de Trabajo Transversales",
    "number": 78,
    "level": "ARQ",
    "title": "Flujo de salida de colaborador (Offboarding y finiquito)",
    "category": "Flujos End-to-End",
    "summary": "Causal de salida → Aviso de salida IESS → Cálculo liquidación SUT → Pago de finiquito."
  },
  {
    "id": "man-79",
    "block": "K",
    "blockTitle": "Ingeniería de Parametrización Transversal",
    "number": 79,
    "level": "ARQ",
    "title": "Diseño del Plan de Cuentas y mapeo multi-módulo",
    "category": "Consultor Premium",
    "summary": "Estructuración del árbol contable para soportar integración con compras, ventas e inventario."
  },
  {
    "id": "man-80",
    "block": "K",
    "blockTitle": "Ingeniería de Parametrización Transversal",
    "number": 80,
    "level": "ARQ",
    "title": "Diseño de centros de costo multi-sistema (SAP B1 + Nómina HCM)",
    "category": "Consultor Premium",
    "summary": "Homologación de la estructura analítica para evitar asientos con centros de costo huérfanos."
  },
  {
    "id": "man-81",
    "block": "K",
    "blockTitle": "Ingeniería de Parametrización Transversal",
    "number": 81,
    "level": "ARQ",
    "title": "Checklist de puesta en marcha (Go-Live): Qué debe estar parametrizado",
    "category": "Consultor Premium",
    "summary": "Lista exhaustiva de verificaciones técnicas antes de permitir el primer login de usuarios."
  },
  {
    "id": "man-82",
    "block": "K",
    "blockTitle": "Ingeniería de Parametrización Transversal",
    "number": 82,
    "level": "ARQ",
    "title": "Gobierno de datos maestros (Artículos, socios, empleados)",
    "category": "Consultor Premium",
    "summary": "Políticas de nomenclatura, validación de RUCs/cédulas y control de duplicidad."
  },
  {
    "id": "man-83",
    "block": "K",
    "blockTitle": "Ingeniería de Parametrización Transversal",
    "number": 83,
    "level": "ARQ",
    "title": "Plan de pruebas de cierre integrado (Nómina → Contabilidad → SRI)",
    "category": "Consultor Premium",
    "summary": "Matriz de pruebas unitarias y de estrés para validar que el cierre contable cuadre al centavo."
  }
];
