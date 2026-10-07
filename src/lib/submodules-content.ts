export interface SubmoduleGuide {
  submoduleId: string;
  code: string;
  title: string;
  trackId: string;
  functionalOverview: string;
  sapMenuPath: string;
  businessCaseEC: {
    companyName: string;
    scenario: string;
    calculationOrConfig: string;
  };
  stepByStepSteps: {
    stepNumber: number;
    title: string;
    action: string;
    technicalDetails: string;
    validationCheck: string;
  }[];
  criticalErrorsToAvoid: {
    error: string;
    consequence: string;
    solution: string;
  }[];
  regulatoryContextEC: string;
}

export const SUBMODULE_GUIDES: Record<string, SubmoduleGuide> = {
  // TRACK 1: SAP B1 CORE
  'b1-01': {
    submoduleId: 'b1-01',
    code: 'DOC-SAP-001',
    title: 'Administración: Configuración Maestra y DTW',
    trackId: 'sap-b1-core',
    functionalOverview: 'La parametrización inicial de SAP Business One define las bases de la sociedad (moneda funcional USD, ejercicio fiscal del 1 de enero al 31 de diciembre, plan de cuentas base NIIF y flujos de aprobación por montos). El Data Transfer Workbench (DTW) es el utilitario que permite la migración masiva de maestros (OCRD, OITM) sin romper la integridad referencial.',
    sapMenuPath: 'Gestión → Inicialización del sistema → Detalles de la sociedad / Procedimientos de aprobación',
    businessCaseEC: {
      companyName: 'B1 Center (Guayaquil, Ecuador)',
      scenario: 'Puesta en marcha de una distribuidora mayorista con 5,000 SKUs y 1,200 clientes corporativos, requiriendo aprobación de compras superiores a $5,000.',
      calculationOrConfig: 'Configuración de Approval Template en Compras: Si "Total de documento > $5,000", disparar solicitud al perfil CFO. Mapeo en DTW de OCRD con RUC ecuatoriano de 13 dígitos terminado en 001.',
    },
    stepByStepSteps: [
      {
        stepNumber: 1,
        title: 'Inicialización de la Sociedad y Moneda Local',
        action: 'Definir el nombre de la compañía, RUC, dirección fiscal y fijar la moneda local en Dólares Estadounidenses (USD).',
        technicalDetails: 'Tabla CINF en base de datos HANA/SQL. Una vez creados asientos, la moneda del sistema no puede modificarse.',
        validationCheck: 'Verificar que la ventana Información de la Sociedad muestre USD como moneda local y de sistema.',
      },
      {
        stepNumber: 2,
        title: 'Definición de Períodos Contables',
        action: 'Crear subperíodos mensuales de enero a diciembre con estatus de bloqueo automático.',
        technicalDetails: 'Tabla OFPR. Definir fechas de contabilización, fecha de vencimiento y fecha del documento.',
        validationCheck: 'Comprobar que el ejercicio fiscal coincida con el calendario tributario del SRI.',
      },
      {
        stepNumber: 3,
        title: 'Parametrización de Procedimientos de Aprobación',
        action: 'Crear la etapa de autorización y la plantilla de aprobación ligada a Órdenes de Compra (OPOR).',
        technicalDetails: 'Tablas OWST y OWDD. Establecer condición basada en consulta SQL: SELECT 1 FROM OPOR WHERE DocTotal > 5000.',
        validationCheck: 'Crear una OC de $5,500 con un usuario operativo y verificar que el documento quede en estado Pendiente de Aprobación.',
      },
      {
        stepNumber: 4,
        title: 'Carga Masiva con Data Transfer Workbench (DTW)',
        action: 'Preparar plantillas CSV de Socios de Negocios (BusinessPartners.csv) y Direcciones (BPAddresses.csv).',
        technicalDetails: 'DTW conecta vía DI API COM o Service Layer. Validar códigos de país "EC" y tipos de persona jurídica/natural.',
        validationCheck: 'Ejecutar simulación previa (Simulate Run) en DTW y confirmar 0 errores de clave foránea antes de escribir.',
      },
    ],
    criticalErrorsToAvoid: [
      {
        error: 'Definir una moneda local distinta de USD o cambiarla después de iniciar transacciones',
        consequence: 'Descuadre contable irreversible; SAP bloquea el cambio de moneda una vez existe el primer asiento.',
        solution: 'Fijar USD desde la inicialización y bloquear permisos de cambio en Definiciones Generales.',
      },
      {
        error: 'Cargar RUCs sin ceros a la izquierda o con longitud diferente a 13 dígitos en DTW',
        consequence: 'Rechazo de los comprobantes electrónicos y del Anexo Transaccional Simplificado (ATS) por el validador del SRI.',
        solution: 'Formatear las celdas de Excel como Texto antes de exportar a CSV para preservar los ceros líderes.',
      },
    ],
    regulatoryContextEC: 'Resolución SRI NAC-DGERCGC: Las empresas en Ecuador deben registrar su contabilidad en USD y reportar transacciones con identificación RUC de 13 dígitos o Cédula de 10 dígitos.',
  },

  'b1-02': {
    submoduleId: 'b1-02',
    code: 'DOC-SAP-003',
    title: 'Finanzas NIIF y Determinación de Cuentas (G/L)',
    trackId: 'sap-b1-core',
    functionalOverview: 'La Determinación de Cuentas de Mayor (G/L Account Determination) es el corazón de la integración financiera en SAP B1. Define cómo las transacciones de ventas, compras e inventario generan asientos contables automáticos sin intervención manual, clasificando cuentas de inventario, costo de ventas, ingresos, pasivos tributarios y cuentas puente de nómina.',
    sapMenuPath: 'Gestión → Definiciones → Finanzas → Determinación de cuentas de mayor',
    businessCaseEC: {
      companyName: 'Corporación Industrial del Austro (Cuenca, Ecuador)',
      scenario: 'Implementación del plan de cuentas bajo NIIF para PYMES con asignación automática de costo de ventas por línea de artículo y cuenta transitoria de nómina.',
      calculationOrConfig: 'Asignación de cuenta 1.1.05.01 (Inventario Producto Terminado), 5.1.01.01 (Costo de Ventas) y 2.1.03.01 (Retenciones SRI en la fuente por pagar).',
    },
    stepByStepSteps: [
      {
        stepNumber: 1,
        title: 'Estructuración del Plan de Cuentas NIIF',
        action: 'Crear los 5 niveles del catálogo de cuentas: Activo, Pasivo, Patrimonio, Ingresos, Costos y Gastos.',
        technicalDetails: 'Tabla OACT. Marcar cuentas de nivel 5 como "Cuentas de Mayor" (tildar título=No).',
        validationCheck: 'Generar el Balance de Comprobación y verificar la cuadratura del activo contra pasivo + patrimonio.',
      },
      {
        stepNumber: 2,
        title: 'Configuración de Determinación por Almacén / Grupo de Artículos',
        action: 'Parametrizar la pestaña Inventario para fijar cuenta de stock, cuenta de dotación (costeo) y cuenta de diferencias.',
        technicalDetails: 'Tablas OACP y OGLD. Si se usa determinación avanzada de cuentas, configurar reglas por UDF o grupo.',
        validationCheck: 'Simular la recepción de un artículo y validar que el asiento preliminar afecte Stock vs Entrada de Mercancías no Facturadas.',
      },
      {
        stepNumber: 3,
        title: 'Mapeo de Cuentas de Compras y Ventas',
        action: 'Asignar cuentas de Clientes Nacionales, Proveedores Nacionales, Anticipos e IVA Compras/Ventas 15%.',
        technicalDetails: 'Pestañas Ventas y Compras. Asignar cuentas de redondeo y diferencias de cambio.',
        validationCheck: 'Emitir una factura borrador y revisar el Asiento Contable previo para certificar débitos y créditos.',
      },
    ],
    criticalErrorsToAvoid: [
      {
        error: 'Dejar cuentas de inventario o costo de ventas vacías en un almacén nuevo',
        consequence: 'Bloqueo inmediato de despachos y recepciones con el error "Falta cuenta de mayor [Mensaje 131-45]".',
        solution: 'Configurar plantillas de almacén obligatorias y no permitir el alta de almacenes sin determinación G/L completa.',
      },
      {
        error: 'Asignar una cuenta de tipo Título en la determinación automática',
        consequence: 'El sistema arroja error de validación contable impidiendo contabilizar documentos de compras/ventas.',
        solution: 'Verificar en el Plan de Cuentas que todas las cuentas asignadas sean imputables (nivel activo operativo).',
      },
    ],
    regulatoryContextEC: 'Norma Internacional de Información Financiera (NIIF) adoptada por la Superintendencia de Compañías, Valores y Seguros del Ecuador.',
  },

  'b1-04': {
    submoduleId: 'b1-04',
    code: 'DOC-SAP-010',
    title: 'Ciclo Order-to-Cash: De la Oportunidad a la Factura A/R',
    trackId: 'sap-b1-core',
    functionalOverview: 'El ciclo Order-to-Cash (O2C) modela la ruta comercial: Oportunidad de venta (pipeline) → Cotización (OQUT) → Pedido de cliente (ORDR) → Verificación de disponibilidad de inventario (ATP) → Entrega física (ODLN) → Factura electrónica A/R (OINV) → Cobro y aplicación en cartera.',
    sapMenuPath: 'Ventas - Clientes → Oferta de venta / Pedido de cliente / Entrega / Factura de clientes',
    businessCaseEC: {
      companyName: 'Comercializadora San Francisco (Quito, Ecuador)',
      scenario: 'Venta de 100 laptops a crédito a 30 días, con validación de inventario disponible en almacén matriz y entrega con guía de remisión.',
      calculationOrConfig: 'Precio unitario $800 + IVA 15% ($120). Total documento $92,000. Descuento de stock en almacén 01 al crear la Entrega (ODLN).',
    },
    stepByStepSteps: [
      {
        stepNumber: 1,
        title: 'Registro de la Oferta y Pedido de Venta',
        action: 'Seleccionar Socio de Negocio (OCRD), artículos y validar condiciones de pago y lista de precios.',
        technicalDetails: 'Validación ATP (Available to Promise): Comprueba Stock Físico - Comprometido + Pedido.',
        validationCheck: 'Confirmar que el estado del pedido quede en "Abierto" y el stock comprometido se incremente.',
      },
      {
        stepNumber: 2,
        title: 'Creación de la Entrega (Picking y Packing)',
        action: 'Copiar pedido a Entrega (ODLN). La entrega realiza la salida física de almacén y genera el asiento de Costo de Ventas.',
        technicalDetails: 'Asiento contable: Débito Costo de Ventas (5.1) y Crédito Inventario (1.1).',
        validationCheck: 'Consultar Datos de Artículo (OITM) y certificar la reducción del stock en mano.',
      },
      {
        stepNumber: 3,
        title: 'Generación de la Factura de Clientes A/R',
        action: 'Copiar Entrega a Factura A/R (OINV). Se devenga la cuenta por cobrar y el impuesto IVA 15%.',
        technicalDetails: 'Asiento: Débito Clientes (1.1.02) y Crédito Ventas (4.1.01) + IVA por Pagar (2.1.04). Disparo de XML al SRI.',
        validationCheck: 'Verificar en el Mapa de Relaciones la trazabilidad visual desde el Pedido hasta la Factura.',
      },
    ],
    criticalErrorsToAvoid: [
      {
        error: 'Facturar directamente sin hacer la Entrega física cuando la empresa controla inventario permanente',
        consequence: 'La factura genera tanto la salida de stock como el ingreso, pero imposibilita despachos parciales y rompe la conciliación con guías de remisión.',
        solution: 'Utilizar siempre el documento intermedio Entrega para reflejar la realidad física de la bodega.',
      },
    ],
    regulatoryContextEC: 'Art. 13 del Reglamento de Comprobantes de Venta, Retención y Documentos Complementarios del SRI.',
  },

  // TRACK 2: LOCALIZACION ECUADOR SRI
  'loc-01': {
    submoduleId: 'loc-01',
    code: 'DOC-LOC-011',
    title: 'Facturación Electrónica SRI: Transmisión XML y Firma Digital',
    trackId: 'sap-loc-ec',
    functionalOverview: 'La emisión de comprobantes electrónicos en Ecuador exige la generación de un archivo XML bajo el estándar XAdES-BES con firma digital (.p12), el cálculo de la Clave de Acceso de 49 dígitos (módulo 11) y la comunicación sincrónica/asincrónica con el Web Service de Recepción y Autorización del SRI.',
    sapMenuPath: 'Ventas / Compras → Comprobantes Electrónicos SRI → Monitor de Facturación Electrónica',
    businessCaseEC: {
      companyName: 'Farmacéutica Panamericana Cía. Ltda. (Quito, Ecuador)',
      scenario: 'Emisión de una Factura Electrónica por $10,000 + IVA 15% que debe transmitirse en tiempo real al ambiente de Producción del SRI.',
      calculationOrConfig: 'Generación de Clave de Acceso: Fecha (8d) + Tipo Comprobante "01" (2d) + RUC (13d) + Tipo Ambiente "2" (1d) + Serie (6d) + Secuencial (9d) + Código Numérico (8d) + Tipo Emisión "1" (1d) + Dígito Verificador Módulo 11 (1d) = 49 dígitos exactos.',
    },
    stepByStepSteps: [
      {
        stepNumber: 1,
        title: 'Configuración del Certificado de Firma Digital',
        action: 'Instalar el archivo .p12 emitido por entidad de certificación autorizada (Banco Central, Security Data, etc.) y registrar la contraseña.',
        technicalDetails: 'El conector firma el nodo XML con algoritmo RSA-SHA1 / SHA256 bajo estándar XAdES-BES.',
        validationCheck: 'Ejecutar prueba de test de firma y verificar que retorne "Certificado Válido" con fecha de caducidad futura.',
      },
      {
        stepNumber: 2,
        title: 'Construcción del XML y Clave de Acceso de 49 Dígitos',
        action: 'Mapear campos del documento SAP B1 (OINV) hacia la estructura XSD oficial del SRI versión 1.1.0 / 2.1.0.',
        technicalDetails: 'Algoritmo Módulo 11 con ponderadores 2,3,4,5,6,7. Si el residuo es 11 el dígito es 0, si es 10 es 1.',
        validationCheck: 'Validar la longitud exacta de 49 caracteres numéricos de la clave de acceso antes del envío.',
      },
      {
        stepNumber: 3,
        title: 'Transmisión al Web Service y Obtención de la Autorización',
        action: 'Consumir el endpoint https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline.',
        technicalDetails: 'Si el estado es RECIBIDA, invocar AutorizacionComprobantesOffline para obtener número de autorización y fecha.',
        validationCheck: 'Verificar que en la tabla de control el estado cambie a AUTORIZADO y se guarde el mensaje XML firmado.',
      },
    ],
    criticalErrorsToAvoid: [
      {
        error: 'Transmitir con certificado digital expirado o revocado',
        consequence: 'Rechazo masivo con código de error SRI "FIRMA INVALIDA / CERTIFICADO CADUCADO", paralizando las ventas.',
        solution: 'Configurar alertas automáticas en el sistema 30 días antes del vencimiento de la firma digital.',
      },
      {
        error: 'Descuadre de centavos en la sumatoria de impuestos del XML frente al total del comprobante',
        consequence: 'Error SRI "TOTAL DEL COMPROBANTE NO COINCIDE CON LA SUMA DE LOS IMPUESTOS".',
        solution: 'Alinear el redondeo de SAP B1 a 2 decimales exactos con la fórmula reglamentaria del SRI.',
      },
    ],
    regulatoryContextEC: 'Ficha Técnica de Comprobantes Electrónicos Offline del SRI y Ley de Comercio Electrónico, Firmas y Mensajes de Datos.',
  },

  'loc-02': {
    submoduleId: 'loc-02',
    code: 'DOC-LOC-008',
    title: 'Retenciones en la Fuente: Parametrización Códigos SRI',
    trackId: 'sap-loc-ec',
    functionalOverview: 'En compras a proveedores, los agentes de retención en Ecuador están obligados por ley a retener un porcentaje de Impuesto a la Renta y de IVA. Desde el 1 de marzo de 2026 (Resolución NAC-DGERCGC26-00000009) los porcentajes de renta son: 312 (Transferencia de bienes muebles de naturaleza corporal: 2%), construcción (2%), 304 (Servicios con predominio de mano de obra: 3%), servicios profesionales de sociedades (5%) y 303 (Honorarios profesionales de personas naturales: 10%); todo pago sin porcentaje específico retiene el 3%. Se suman el IVA 15% y sus retenciones del 30%, 70% o 100% (10% y 20% a contribuyentes especiales).',
    sapMenuPath: 'Gestión → Definiciones → Finanzas → Impuesto → Retención de Impuestos',
    businessCaseEC: {
      companyName: 'Constructora del Pacífico S.A. (Manta, Ecuador)',
      scenario: 'Pago de factura de proveedor por $5,000 en materiales (bien) y $2,000 en mano de obra técnica (servicio), aplicando retención en la fuente e IVA.',
      calculationOrConfig: 'Subtotal Bienes: $5,000 x 2% (Cod 312) = $100.00. Subtotal Servicios de mano de obra: $2,000 x 3% (Cod 304) = $60.00. IVA Total: $7,000 x 15% = $1,050. Retención IVA Bienes (30% de $750) = $225. Retención IVA Servicios (70% de $300) = $210. Total Retenido: $595.00.',
    },
    stepByStepSteps: [
      {
        stepNumber: 1,
        title: 'Creación de Códigos de Retención en SAP B1',
        action: 'Definir el código de impuesto, descripción oficial del SRI, porcentaje aplicable y cuenta contable de pasivo.',
        technicalDetails: 'Tabla OWHT. Asignar código oficial de formulario SRI 103 (ej. campo OficialCode = 312).',
        validationCheck: 'Verificar que el porcentaje configurado coincida exactamente con la tabla vigente del SRI.',
      },
      {
        stepNumber: 2,
        title: 'Asociación a Socios de Negocios Proveedores',
        action: 'En la pestaña Finanzas → Impuestos de la ficha OCRD del proveedor, habilitar retención y marcar códigos por defecto.',
        technicalDetails: 'Campos WTCode en tabla CRD4. Distinguir si el proveedor es Contribuyente Especial, RIMPE o Régimen General.',
        validationCheck: 'Al crear una factura de proveedor (OPCH), comprobar que se cargue la tabla de retención automáticamente.',
      },
      {
        stepNumber: 3,
        title: 'Emisión del Comprobante de Retención Electrónico',
        action: 'Generar la retención dentro de los 5 días posteriores a la recepción de la factura y transmitir el XML al SRI.',
        technicalDetails: 'Tipo de comprobante "07" en la codificación del SRI. Enlace al número de factura física/electrónica sustento.',
        validationCheck: 'Verificar en el portal del SRI la autorización del comprobante de retención 07.',
      },
    ],
    criticalErrorsToAvoid: [
      {
        error: 'Aplicar el código 312 a servicios o el 304 a bienes',
        consequence: 'Glosas y multas tributarias del SRI por retención indebida o cálculo por defecto en fiscalizaciones.',
        solution: 'Parametrizar las retenciones por línea de factura en SAP B1 según el tipo de artículo o servicio.',
      },
    ],
    regulatoryContextEC: 'Resolución SRI NAC-DGERCGC: Tablas de Retención en la Fuente del Impuesto a la Renta y Circular de Porcentajes de Retención de IVA.',
  },

  // TRACK 3: NOMINA HCM ECUADOR
  'nom-01': {
    submoduleId: 'nom-01',
    code: 'DOC-NOM-024',
    title: 'Novedades, Asistencia y Fórmulas de Horas Extras',
    trackId: 'b1-nom-ec',
    functionalOverview: 'El motor de novedades de Nómina HCM captura incidencias del período (asistencia biométrica, faltas, permisos, préstamos) y procesa el recargo de horas suplementarias (+50% hasta las 24h00), extraordinarias (+100% en fines de semana, feriados o de 24h00 a 06h00) y recargo nocturno (+25% de 19h00 a 06h00), aplicando estrictamente la fórmula legal: Sueldo / 240.',
    sapMenuPath: 'Nómina HCM → Novedades y Trámites → Registro Masivo de Novedades',
    businessCaseEC: {
      companyName: 'Lácteos de la Sierra C.A. (Ambato, Ecuador)',
      scenario: 'Operador de planta con sueldo básico de $720. Registra en el mes: 12 horas suplementarias (50%) y 8 horas extraordinarias en domingo (100%).',
      calculationOrConfig: 'Valor Hora Ordinaria = $720 / 240 = $3.00. Hora Suplementaria (50%) = $3.00 x 1.50 = $4.50. Total Suplementarias (12h) = $54.00. Hora Extraordinaria (100%) = $3.00 x 2.00 = $6.00. Total Extraordinarias (8h) = $48.00. Total Ganado Horas Extras = $102.00.',
    },
    stepByStepSteps: [
      {
        stepNumber: 1,
        title: 'Configuración del Concepto Salarial y Divisor Legal',
        action: 'Verificar en Configuración → Conceptos que el divisor de la hora ordinaria esté parametrizado en 240 horas mensuales.',
        technicalDetails: 'El Código del Trabajo de Ecuador estipula 30 días comerciales de 8 horas = 240 horas.',
        validationCheck: 'Validar que el cálculo unitario de un colaborador de $482 (SBU) resulte en $2.0083 por hora ordinaria.',
      },
      {
        stepNumber: 2,
        title: 'Importación de Marcaciones Biométricas',
        action: 'Cargar el archivo de reloj control mediante la plantilla de Novedades, clasificando tipos de horas.',
        technicalDetails: 'Campos: Cédula, Código de Concepto (ej. EXT50, EXT100, REC25), Número de Horas, Fecha.',
        validationCheck: 'Revisar la bitácora de auditoría de importación para garantizar que no existan cédulas huérfanas.',
      },
      {
        stepNumber: 3,
        title: 'Pre-liquidación y Auditoría de Variaciones',
        action: 'Ejecutar el proceso de pre-liquidación y comparar el total de horas extras contra el promedio del mes anterior.',
        technicalDetails: 'Módulo Auditoría de Nómina: Alerta visual si las horas extras superan el 20% del salario base.',
        validationCheck: 'Certificar que las horas extras sumen a la materia gravada para el cálculo posterior del IESS.',
      },
    ],
    criticalErrorsToAvoid: [
      {
        error: 'Dividir el sueldo entre 160 horas (40 horas semanales x 4) en lugar del divisor legal de 240',
        consequence: 'Sobrepago ilegal del 50% en el valor de la hora extra, causando pérdidas económicas a la empresa y distorsión contable.',
        solution: 'Bloquear el divisor en 240 a nivel de motor en la fórmula del concepto en Nómina HCM.',
      },
    ],
    regulatoryContextEC: 'Artículos 47, 49 y 55 del Código del Trabajo de la República del Ecuador.',
  },

  'nom-02': {
    submoduleId: 'nom-02',
    code: 'DOC-NOM-026',
    title: 'Seguridad Social IESS: Aportes, Fondos de Reserva y Planillas',
    trackId: 'b1-nom-ec',
    functionalOverview: 'La liquidación del aporte al Instituto Ecuatoriano de Seguridad Social (IESS) es obligatoria sobre toda remuneración ordinaria o extraordinaria. El aporte personal es del 9.45% (descontado al trabajador) y el patronal es del 11.15% + 1.00% SECAP/IECE (12.15% total a costo de la empresa). A partir del mes 13 de labores continuas se liquida el Fondo de Reserva (8.33%).',
    sapMenuPath: 'Nómina HCM → Seguridad Social → Generación de Planilla IESS',
    businessCaseEC: {
      companyName: 'Textiles del Norte S.A. (Otavalo, Ecuador)',
      scenario: 'Colaborador con sueldo de $1,000 + $100 comisiones. Antigüedad: 2 años. Solicitó acumular fondos de reserva en el IESS.',
      calculationOrConfig: 'Materia Gravada = $1,000 + $100 = $1,100. Aporte Personal (9.45%) = $103.95 (descuento en rol). Aporte Patronal (12.15%) = $133.65 (costo empresa). Fondo de Reserva (8.33%) = $91.63 (depositado a planilla IESS). Salario Neto a pagar = $1,100 - $103.95 = $996.05.',
    },
    stepByStepSteps: [
      {
        stepNumber: 1,
        title: 'Determinación de Materia Gravada vs Exenta',
        action: 'Mapear conceptos que aportan al IESS (Sueldo, Horas Extras, Comisiones) y excluir conceptos exentos (Viáticos, Beneficios Sociales).',
        technicalDetails: 'Art. 14 del Código del Trabajo y Ley de Seguridad Social: Los décimos y utilidades no son materia gravada.',
        validationCheck: 'Comprobar en el resumen de liquidación que la base de cálculo de aportes coincida con la materia gravada.',
      },
      {
        stepNumber: 2,
        title: 'Generación del Archivo de Transmisión para el IESS',
        action: 'Exportar la planilla en formato estructurado (archivo plano .TXT) con código de tipo de planilla y cédulas.',
        technicalDetails: 'Formato estándar del portal del IESS: Sucursal, Año, Mes, Tipo de aporte, Cédula, Sueldo, Días trabajados.',
        validationCheck: 'Cargar el archivo en el validador del portal empleador del IESS y verificar que pase sin inconsistencias.',
      },
    ],
    criticalErrorsToAvoid: [
      {
        error: 'No reportar el aviso de entrada en el IESS dentro de los primeros 15 días desde el inicio de labores',
        consequence: 'Generación de glosas patronales y multas automáticas con intereses por afiliación extemporánea.',
        solution: 'Sincronizar el onboarding del colaborador con la generación del aviso de entrada en el portal del IESS.',
      },
    ],
    regulatoryContextEC: 'Ley de Seguridad Social de Ecuador y resoluciones del Consejo Directivo del IESS.',
  },

  // TRACK 4: GESTION HUMANA NINE BOX
  'hcm-03': {
    submoduleId: 'hcm-03',
    code: 'DOC-RRHH-040',
    title: 'Analítica del Talento: Calibración y Mapeo en la Matriz Nine Box',
    trackId: 'b1-hcm-talent',
    functionalOverview: 'La Matriz Nine-Box cruza dos dimensiones independientes: Desempeño Operativo (Eje X: Bajo, Medio, Alto) y Potencial de Crecimiento (Eje Y: Bajo, Medio, Alto). Permite identificar de manera objetiva a las "Futuras Estrellas" (Star Performers en cuadrante 9), empleados de alto rendimiento clave (Workhorses en cuadrante 3) y enigmas que requieren intervención, mitigando el sesgo del Efecto Halo.',
    sapMenuPath: 'Gestión Humana → Evaluación del Desempeño → Matriz Nine Box y Calibración',
    businessCaseEC: {
      companyName: 'Banco Pichincha Tech & Innovation Hub (Quito, Ecuador)',
      scenario: 'Comité de calibración de 80 analistas y consultores SAP para definir quiénes pasan al Plan de Sucesión de Jefaturas.',
      calculationOrConfig: 'Cruce dimensional: Puntaje Desempeño = 92% (Alto). Evaluación Potencial = 88% (Alto). Ubicación: Cuadrante 9 "Talento Estrella". Plan: Asignación como mentor y postulante directo a vacante de Consultor Senior.',
    },
    stepByStepSteps: [
      {
        stepNumber: 1,
        title: 'Carga de Resultados de Evaluación de Desempeño y Potencial',
        action: 'Consolidar las evaluaciones de metas (OKRs) y la evaluación psicométrica / de competencias de potencial.',
        technicalDetails: 'La plataforma de Gestión Humana normaliza las escalas a rangos de 1 a 5 o porcentajes de 0 a 100.',
        validationCheck: 'Verificar que todos los colaboradores del ciclo cuenten con ambas notas cerradas.',
      },
      {
        stepNumber: 2,
        title: 'Visualización Dinámica de los 9 Cuadrantes',
        action: 'Abrir el dashboard analítico Nine-Box y filtrar por gerencia, área funcional o centro de costos.',
        technicalDetails: 'Cuadrante 1: Bajo Desempeño/Bajo Potencial (Riesgo). Cuadrante 9: Alto Desempeño/Alto Potencial (Estrella).',
        validationCheck: 'Comprobar la distribución de la campana de Gauss para evitar concentración artificial en el cuadrante superior.',
      },
      {
        stepNumber: 3,
        title: 'Sesión de Calibración del Comité y Plan de Sucesión',
        action: 'Ajustar la posición de candidatos con discrepancias entre jefes y vincularlos a los planes de desarrollo (PDI).',
        technicalDetails: 'Registro de actas de calibración con justificación técnica para garantizar transparencia y auditoría.',
        validationCheck: 'Generar la exportación del Plan de Sucesión con los candidatos listos en plazo de 0 a 6 meses.',
      },
    ],
    criticalErrorsToAvoid: [
      {
        error: 'Confundir Desempeño pasado con Potencial futuro',
        consequence: 'Promover a excelentes técnicos a cargos de liderazgo donde fracasan (Principio de Peter).',
        solution: 'Evaluar el potencial mediante competencias conductuales de adaptabilidad y pensamiento estratégico, no solo por cumplimiento de ventas.',
      },
    ],
    regulatoryContextEC: 'Políticas de Desarrollo Organizacional, Gobernanza Corporativa y Equidad Laboral.',
  },

  // TRACK 5: VERTICALES EXPORTACION ECUADOR
  'vert-01': {
    submoduleId: 'vert-01',
    code: 'DOC-IND-016',
    title: 'Vertical Bananera: Trazabilidad de Campo a Empacadora y Exportación',
    trackId: 'sap-vert-exp',
    functionalOverview: 'La vertical agroexportadora bananera en Ecuador requiere la trazabilidad integral de cada racimo cosechado, control de cuadrillas de corte y empaque, liquidación al productor respetando el Precio Mínimo de Sustentación fijado por el Ministerio de Agricultura, costeo de cajas con fletes marítimos internacionales y cumplimiento estricto de la certificación GlobalGAP.',
    sapMenuPath: 'SAP Business One → Vertical Banano → Cosecha / Liquidación al Productor / Embarques',
    businessCaseEC: {
      companyName: 'Exportadora Bananera del Guayas S.A. (Machala, Ecuador)',
      scenario: 'Cosecha semanal de 15,000 cajas de banano premium 22XU destinadas a la Unión Europea, con liquidación a productores independientes.',
      calculationOrConfig: 'Precio Mínimo de Sustentación oficial = $6.85 por caja. Control de mermas en empacadora: Máximo 8%. Incorporación de costos de cartón ($1.40), funda ($0.30), flete naviero ($3.50). Costo FOB total por caja exportada = $12.05.',
    },
    stepByStepSteps: [
      {
        stepNumber: 1,
        title: 'Registro de Recepción de Fruta y Calidad en Empacadora',
        action: 'Capturar el peso, edad del racimo (semanas de encinte) y porcentaje de calibración en la recepción.',
        technicalDetails: 'Vinculación del lote de campo con el código de finca registrado en el Ministerio de Agricultura y GlobalGAP.',
        validationCheck: 'Verificar que el porcentaje de fruta no conforme no exceda la tolerancia del cliente exportador.',
      },
      {
        stepNumber: 2,
        title: 'Liquidación al Productor con Precio Mínimo de Sustentación',
        action: 'Generar la pre-liquidación multiplicando las cajas aceptadas por el valor legal fijado en Ecuador.',
        technicalDetails: 'Emisión de Liquidación de Compra de Bienes (código SRI 03) con retención de impuesto a la renta bananero.',
        validationCheck: 'Comprobar que el valor unitario no sea inferior al decreto ministerial vigente para evitar sanciones de MAG.',
      },
      {
        stepNumber: 3,
        title: 'Creación del Lote de Exportación y Despacho Portuario',
        action: 'Consolidar cajas en pallets, asignar etiquetas GS1-128 con trazabilidad de finca y generar la factura de exportación.',
        technicalDetails: 'Factura de Exportación código 01 con régimen arancelario liberado de IVA e incorporación de fletes en DAE.',
        validationCheck: 'Consultar el informe de Trazabilidad Hacia Atrás y confirmar que cada caja reporte su día de empaque y finca de origen.',
      },
    ],
    criticalErrorsToAvoid: [
      {
        error: 'Liquidar cajas a productores por debajo del Precio Mínimo de Sustentación',
        consequence: 'Bloqueo de licencias de exportación por el Ministerio de Agricultura y multas severas.',
        solution: 'Configurar en SAP B1 una regla de validación que impida grabar liquidaciones de compra inferiores a la tarifa legal.',
      },
    ],
    regulatoryContextEC: 'Ley para Estimular y Controlar la Producción y Comercialización del Banano y Normas GlobalGAP.',
  },

  'vert-02': {
    submoduleId: 'vert-02',
    code: 'DOC-IND-018',
    title: 'Vertical Camaronera: Piscinas como Centros de Costo y Biomasa',
    trackId: 'sap-vert-exp',
    functionalOverview: 'La industria acuícola camaronera ecuatoriana estructura su costeo financiero definiendo cada piscina de engorde como un Centro de Costo analítico independiente. Se controla la siembra de larvas (millares), el factor de conversión alimenticia (FCA: kg de balanceado / kg de camarón ganado), la mortalidad biológica y el costo absorbido por libra cosechada.',
    sapMenuPath: 'SAP Business One → Finanzas → Centros de Costo / Producción → Ciclo Biológico Piscina',
    businessCaseEC: {
      companyName: 'Acuícola Santa Priscila del Litoral (Isla Puná, Ecuador)',
      scenario: 'Ciclo biológico de 90 días en Piscina P-14 (8 hectáreas). Siembra: 800,000 larvas. Cosecha: 32,000 libras de camarón entero.',
      calculationOrConfig: 'Consumo de balanceado: 48,000 lbs ($33,600). Larvas: $2,400. Diésel de bombeo: $4,500. Probióticos: $1,800. Mano de obra: $3,200. Costo Total Piscina = $45,500. Factor de Conversión Alimenticia (FCA) = 48,000 / 32,000 = 1.50. Costo por libra cosechada = $45,500 / 32,000 = $1.42 / lb.',
    },
    stepByStepSteps: [
      {
        stepNumber: 1,
        title: 'Apertura de la Piscina como Centro de Costo y Proyecto',
        action: 'Crear la regla de distribución y el centro de costo analítico correspondiente al ciclo de siembra (ej. CC_PISCINA_14_C2026).',
        technicalDetails: 'Tablas OOCR y OPPR. Todos los despachos de balanceado, insumos y energía se imputan a esta dimensión.',
        validationCheck: 'Verificar en el diario contable que el centro de costo sea obligatorio para cuentas de gastos directos.',
      },
      {
        stepNumber: 2,
        title: 'Registro de Muestreos Semanales y Biomasa',
        action: 'Ingresar peso promedio semanal (gramos por animal) y tasa de supervivencia estimada para proyectar la biomasa.',
        technicalDetails: 'Ajuste de la curva de alimentación automática para evitar desperdicio de balanceado en el fondo.',
        validationCheck: 'Comparar el crecimiento proyectado contra el histórico de la camaronera.',
      },
      {
        stepNumber: 3,
        title: 'Cierre de Cosecha (Pesca) y Capitalización de Inventario',
        action: 'Liquidar la orden de producción cerrando el centro de costo e ingresando el producto terminado (camarón clasificado) al costo real.',
        technicalDetails: 'Asiento contable: Débito Inventario de Producto Terminado (1.1.05) y Crédito Trabajos en Proceso de Piscinas (1.1.04).',
        validationCheck: 'Verificar que el costo unitario por libra en el maestro de artículos (OITM) coincida con el balance del centro de costo.',
      },
    ],
    criticalErrorsToAvoid: [
      {
        error: 'Prorratear el balanceado de manera global entre todas las piscinas en vez de registrar el consumo puntual por piscina',
        consequence: 'Distorsión total del costo real; imposibilita detectar piscinas ineficientes, enfermedades o fugas de alimento.',
        solution: 'Exigir que cada remisión de bodega especifique el número de piscina receptor antes de emitir la salida.',
      },
    ],
    regulatoryContextEC: 'Normativa de Control Acuícola del Ministerio de Producción, Comercio Exterior, Inversiones y Pesca de Ecuador.',
  },
};
