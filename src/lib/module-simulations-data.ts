export interface ModuleVisualSimulation {
  systemType: 'SAP_B1' | 'HEIN_NOMINA';
  windowTitle: string;
  transactionCode: string;
  screenSummary: string;
  classTranscript: {
    instructor: string;
    summary: string;
    keyPoints: string[];
    deepDiveText: string;
  };
  interactiveFields: {
    label: string;
    value: string;
    helperExplanation: string;
    isMandatory?: boolean;
  }[];
  workedExample: {
    title: string;
    stepByStepMath: string[];
    accountingJournalEntry: {
      account: string;
      debe?: number;
      haber?: number;
    }[];
  };
  practiceLab: {
    title: string;
    mission: string;
    expectedResult: string;
  };
  quickCheckQuestions: {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  relatedManualNumbers: number[];
}

export const MODULE_SIMULATIONS: Record<string, ModuleVisualSimulation> = {
  "b1-01": {
    "systemType": "SAP_B1",
    "windowTitle": "Inicialización de Sociedad y Configuración DTW",
    "transactionCode": "OADM / DTW-01",
    "screenSummary": "Esta pantalla establece los cimientos de la empresa: moneda local USD, ejercicio contable 01/01 al 31/12 y las reglas de migración masiva con Data Transfer Workbench. Si la moneda o el RUC quedan mal grabados, el impacto es irreversible en la base de datos.",
    "classTranscript": {
      "instructor": "Ing. Marco Vivanco, Consultor Senior SAP B1",
      "summary": "En esta clase aprenderás a inicializar una sociedad corporativa en SAP Business One versión 10.0 FP 2305 para Ecuador y a preparar plantillas DTW para cargar 5,000 maestros de clientes sin violar la integridad referencial.",
      "keyPoints": [
        "La moneda funcional en Ecuador es estrictamente USD; SAP bloquea el cambio una vez asentado el primer comprobante.",
        "Los RUC ecuatorianos deben tener 13 dígitos y terminar en 001; DTW los rechaza si Excel elimina el cero a la izquierda.",
        "Los flujos de aprobación en compras (OPOR) se configuran por montos superiores a $5,000 mediante plantillas de autorización."
      ],
      "deepDiveText": "Al desplegar una nueva sociedad en SAP Business One bajo base de datos SAP HANA o SQL Server, la tabla CINF guarda los parámetros inmutables. Es crucial configurar el separador decimal en punto (.) o coma (,) idéntico al sistema operativo del cliente para evitar que DTW multiplique o divida las cifras por 100 durante la carga masiva."
    },
    "interactiveFields": [
      {
        "label": "Nombre de la Sociedad",
        "value": "DISTRIBUIDORA_ANDINA_EC",
        "helperExplanation": "Identificador único de la base de datos de la empresa en el servidor SAP HANA.",
        "isMandatory": true
      },
      {
        "label": "RUC Fiscal Ecuatoriano",
        "value": "0992348571001",
        "helperExplanation": "Número de Registro Único de Contribuyentes de 13 dígitos registrado ante el SRI.",
        "isMandatory": true
      },
      {
        "label": "Moneda Local / Sistema",
        "value": "USD ($ Dólar Estadounidense)",
        "helperExplanation": "Moneda oficial de la República del Ecuador. Inmutable tras la primera contabilización.",
        "isMandatory": true
      },
      {
        "label": "Ejercicio Contable",
        "value": "01/01/2026 - 31/12/2026",
        "helperExplanation": "Período fiscal anual dividido en 12 subperíodos mensuales para declaraciones del SRI.",
        "isMandatory": true
      },
      {
        "label": "Plantilla Aprobación Compras",
        "value": "APPR_PURCHASE_OVER_5000",
        "helperExplanation": "Bloquea órdenes de compra superiores a $5,000 hasta que el Gerente Financiero autorice.",
        "isMandatory": false
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Parametrización Inicial y Carga DTW de 1,200 Clientes",
      "stepByStepMath": [
        "Escenario: B1 Center migra 1,200 clientes con saldos iniciales de cartera por $145,000.",
        "Paso 1: Validación de RUCs en plantilla OCRD.csv: 1,200 registros validados con fórmula =LARGO(A2)=13.",
        "Paso 2: Conversión a formato Texto en Excel para evitar que RUCs iniciados en 0 (ej. 0992348...) pierdan el primer dígito.",
        "Paso 3: Carga de saldos iniciales en cuenta transitoria puente: 1.1.02.01 (Clientes) vs 3.1.03.01 (Saldos de Apertura).",
        "Paso 4: Verificación de simulación en DTW: 1,200 registros procesados con 0 errores de clave foránea.",
        "Paso 5: Cuadratura del Balance de Apertura: Total Débitos $145,000 = Total Créditos $145,000."
      ],
      "accountingJournalEntry": [
        {
          "account": "1.1.02.01 Clientes Locales Cartera Inicial",
          "debe": 145000
        },
        {
          "account": "3.1.03.01 Patrimonio / Saldos Iniciales de Migración",
          "haber": 145000
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 01: Creación de Plantilla de Aprobación en DTW",
      "mission": "Crea una plantilla de autorización para órdenes de compra que excedan los $5,000 USD y mapea las columnas CardCode, CardName y LicTradNum en OCRD.csv.",
      "expectedResult": "El sistema debe generar el archivo CSV listo para DTW y bloquear cualquier compra no autorizada."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué ocurre si intentas cambiar la moneda local de la sociedad después de haber creado el primer asiento contable?",
        "options": [
          "SAP permite el cambio solicitando confirmación de administrador.",
          "SAP bloquea permanentemente la opción porque causaría descuadres contables irreversibles.",
          "El sistema recalcula automáticamente todos los asientos a la nueva moneda.",
          "Solo se puede cambiar mediante una consulta SQL en la tabla CINF."
        ],
        "correctIndex": 1,
        "explanation": "SAP Business One bloquea de forma estricta e irreversible el cambio de moneda local una vez existe una transacción contabilizada."
      },
      {
        "id": 2,
        "question": "¿Por qué es fundamental formatear la columna del RUC como Texto en Excel antes de exportar a CSV para el DTW?",
        "options": [
          "Porque DTW no soporta números mayores a 10 dígitos.",
          "Porque si el RUC inicia con 0 (provincias de la Costa), Excel lo borra y el SRI rechaza el comprobante.",
          "Porque el RUC debe llevar guiones obligatorios.",
          "Para que el sistema lo convierta automáticamente en mayúsculas."
        ],
        "correctIndex": 1,
        "explanation": "Las provincias 01 a 09 tienen RUC que empieza en cero. Si Excel lo trata como número, elimina el cero inicial dejándolo en 12 dígitos, lo que provoca rechazo del SRI."
      },
      {
        "id": 3,
        "question": "¿Cuál es la función principal de una corrida de simulación previa (Simulate Run) en DTW?",
        "options": [
          "Guardar un respaldo temporal en la nube.",
          "Validar claves foráneas y reglas de negocio sin escribir datos en la base de datos real.",
          "Comprimir el archivo CSV para que suba más rápido.",
          "Enviar un correo electrónico al contador con la lista de clientes."
        ],
        "correctIndex": 1,
        "explanation": "La simulación valida si los códigos existen y si cumplen las restricciones del SDK sin alterar la base de datos de producción."
      }
    ],
    "relatedManualNumbers": [
      1,
      2,
      7
    ]
  },
  "b1-02": {
    "systemType": "SAP_B1",
    "windowTitle": "Determinación de Cuentas de Mayor (G/L Account Determination)",
    "transactionCode": "SPRO / GL-01",
    "screenSummary": "Esta es la pantalla más crítica de todo el ERP. Define qué cuentas contables se afectan automáticamente cuando el usuario guarda una factura, una entrega de inventario o un cobro. Si una cuenta está mal configurada, todos los balances de la empresa saldrán desajustados.",
    "classTranscript": {
      "instructor": "CPA Verónica Zambrano, Especialista NIIF y Consultora SAP B1",
      "summary": "En esta sesión aprenderás a estructurar el Plan de Cuentas NIIF de 5 niveles y a parametrizar la Determinación de Cuentas de Mayor en SAP B1 para que las operaciones de Compras, Ventas e Inventarios se contabilicen automáticamente.",
      "keyPoints": [
        "Solo las cuentas de nivel 5 (cuentas imputables) pueden asignarse en la determinación automática.",
        "La cuenta de Entrada de Mercancías no Facturadas (Dotación) es el pasivo transitorio que puentea la recepción física y la factura.",
        "El costo de ventas se dispara al momento de la Entrega (ODLN), no al momento de la Factura."
      ],
      "deepDiveText": "La arquitectura financiera de SAP B1 se rige por la tabla OGLD. Cada almacén o grupo de artículos puede heredar la determinación general o poseer reglas avanzadas (Advanced GL Determination). Si dejas una cuenta en blanco en una bodega nueva, cualquier operario que intente recibir mercadería recibirá el error bloqueante 131-45."
    },
    "interactiveFields": [
      {
        "label": "Pestaña de Operación",
        "value": "Inventario / General",
        "helperExplanation": "Permite configurar las cuentas de stock, variaciones y costo de ventas.",
        "isMandatory": true
      },
      {
        "label": "Cuenta de Stock (Inventario)",
        "value": "1.1.05.01 Inventario Mercaderías",
        "helperExplanation": "Registra el valor monetario de las existencias físicas en el balance general.",
        "isMandatory": true
      },
      {
        "label": "Cuenta de Costo de Ventas",
        "value": "5.1.01.01 Costo de Ventas Nacional",
        "helperExplanation": "Se debita automáticamente en el momento de crear la Entrega de mercancía al cliente.",
        "isMandatory": true
      },
      {
        "label": "Entradas de Mercancías no Facturadas",
        "value": "2.1.02.01 Provisión Compras Almacén (Bridge)",
        "helperExplanation": "Cuenta transitoria puente entre la recepción de bodega (GRPO) y la factura final del proveedor.",
        "isMandatory": true
      },
      {
        "label": "Diferencias de Precio",
        "value": "5.1.03.04 Variación de Precios Compras",
        "helperExplanation": "Absorbe la diferencia si la factura A/P tiene un precio distinto a la orden de compra en promedio ponderado.",
        "isMandatory": false
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Venta y Salida de Inventario de 10 Unidades",
      "stepByStepMath": [
        "Escenario: Venta de 10 bombas industriales. Precio de venta = $500 c/u ($5,000 total). Costo unitario promedio = $300 c/u ($3,000 total).",
        "Paso 1: Creación de la Entrega (ODLN): El inventario físico sale del almacén 01.",
        "Paso 2: Asiento automático de Entrega: Se debita Costo de Ventas ($3,000) y se acredita Inventario ($3,000).",
        "Paso 3: Creación de la Factura A/R (OINV): Se registra la cuenta por cobrar y el ingreso comercial.",
        "Paso 4: Cálculo tributario: Subtotal $5,000.00 + IVA 15% ($750.00) = Total Factura $5,750.00.",
        "Paso 5: Ganancia Bruta Operativa: Ingresos $5,000.00 - Costo de Ventas $3,000.00 = $2,000.00 (Margen del 40%)."
      ],
      "accountingJournalEntry": [
        {
          "account": "1.1.02.01 Clientes Nacionales por Cobrar",
          "debe": 5750
        },
        {
          "account": "4.1.01.01 Ventas de Productos Gravados IVA 15%",
          "haber": 5000
        },
        {
          "account": "2.1.04.05 IVA por Pagar en Ventas 15%",
          "haber": 750
        },
        {
          "account": "5.1.01.01 Costo de Ventas Nacional",
          "debe": 3000
        },
        {
          "account": "1.1.05.01 Inventario Mercaderías (Baja física)",
          "haber": 3000
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 02: Mapeo de Cuentas para Nuevo Almacén de Tránsito",
      "mission": "Configura la determinación de cuentas de mayor para el almacén \"02-TRANSITO\", asignando stock, dotación de compras y costo de ventas sin dejar campos vacíos.",
      "expectedResult": "El simulador debe validar que el almacén pueda recibir una recepción preliminar GRPO sin arrojar error de cuenta faltante."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿En qué documento del ciclo comercial se genera el asiento de Costo de Ventas cuando se utiliza el flujo estándar de SAP B1?",
        "options": [
          "En el Pedido de Cliente (ORDR).",
          "En la Entrega (ODLN) al rebajar el inventario físico.",
          "En el Cobro en Efectivo o Banco.",
          "En el Anexo Transaccional Simplificado."
        ],
        "correctIndex": 1,
        "explanation": "En SAP B1, la Entrega (ODLN) rebaja las unidades del inventario físico y genera el asiento contable entre Costo de Ventas (Debe) y Existencias (Haber)."
      },
      {
        "id": 2,
        "question": "¿Qué tipo de cuenta debe ser asignada en la Determinación de Cuentas de Mayor para que el sistema permita contabilizar?",
        "options": [
          "Una cuenta de tipo \"Título\" o nivel 1.",
          "Una cuenta de nivel 5 clasificada como \"Cuenta de Mayor\" (imputable).",
          "Cualquier cuenta siempre que pertenezca al pasivo.",
          "Una cuenta de orden no monetaria."
        ],
        "correctIndex": 1,
        "explanation": "Solo las cuentas imputables de último nivel reciben movimientos contables. Asignar un título produce error de validación inmediato."
      },
      {
        "id": 3,
        "question": "¿Cuál es el rol de la cuenta \"Entradas de Mercancías no Facturadas\" (Dotación)?",
        "options": [
          "Registrar pérdidas por robo en bodega.",
          "Servir de pasivo transitorio entre la entrada física (GRPO) y la factura final del proveedor (OPCH).",
          "Acumular las retenciones de IVA del SRI.",
          "Pagar los fletes de transporte marítimo."
        ],
        "correctIndex": 1,
        "explanation": "Es la cuenta puente que acredita el pasivo provisto al recibir la mercadería y se salda cuando llega la factura comercial del proveedor."
      }
    ],
    "relatedManualNumbers": [
      3,
      4,
      15
    ]
  },
  "b1-03": {
    "systemType": "SAP_B1",
    "windowTitle": "Gestión Maestra: Socios de Negocios (OCRD) y Artículos (OITM)",
    "transactionCode": "OCRD / OITM",
    "screenSummary": "Catálogos maestros fundamentales. Aquí se crean los clientes, proveedores y artículos con sus listas de precios, grupos de retención SRI y condiciones de pago.",
    "classTranscript": {
      "instructor": "Ing. Marco Vivanco, Consultor Senior SAP B1",
      "summary": "Domina la creación y estandarización de maestros en SAP B1. Aprende a asociar grupos de impuestos, reglas de crédito comercial y parámetros de inventario para evitar errores operativos.",
      "keyPoints": [
        "Un Socio de Negocios puede actuar como Cliente, Proveedor o Lead.",
        "Las listas de precios en SAP B1 son 10 y admiten factores multiplicadores dinámicos.",
        "La asignación de grupos de retención en la ficha OCRD automatiza la retención del SRI en cada compra."
      ],
      "deepDiveText": "La tabla OCRD almacena los socios de negocios y OITM los artículos. Cada socio debe tener asignada su condición de pago (OCTG) y su cuenta contable asociada de control. En artículos, la selección del método de valoración (FIFO, Promedio Ponderado o Estándar) se fija al momento de la creación y no debe cambiarse si tiene stock."
    },
    "interactiveFields": [
      {
        "label": "Código de Socio (CardCode)",
        "value": "PRV-0992834710001",
        "helperExplanation": "Código estructurado con prefijo de tipo y número de RUC para evitar duplicados.",
        "isMandatory": true
      },
      {
        "label": "Tipo de Socio",
        "value": "Proveedor (Vendor)",
        "helperExplanation": "Define si alimenta el ciclo de compras A/P o de ventas A/R.",
        "isMandatory": true
      },
      {
        "label": "Condición de Pago",
        "value": "Crédito Comercial 30 Días",
        "helperExplanation": "Determina la fecha de vencimiento automática calculada desde la fecha de factura.",
        "isMandatory": true
      },
      {
        "label": "Sujeto a Retención SRI",
        "value": "SI (Códigos 312 Bienes 2% / 304 Servicios 3%)",
        "helperExplanation": "Asocia la tabla de retenciones impositivas para retener en compras.",
        "isMandatory": true
      },
      {
        "label": "Método de Valoración Artículo",
        "value": "Promedio Ponderado Móvil (Moving Avg)",
        "helperExplanation": "Recalcula el costo unitario con cada compra nueva ingresada al almacén.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Creación de Proveedor con Lista de Precios y Límite de Crédito",
      "stepByStepMath": [
        "Escenario: Alta de proveedor de materias primas con crédito de $20,000 a 45 días.",
        "Paso 1: Validación del RUC en la ficha OCRD contra el padrón público del SRI.",
        "Paso 2: Asignación de condición de pago en OCTG: 45 días con 0% descuento por pronto pago.",
        "Paso 3: Asignación del límite de crédito de $20,000 en el campo CreditLine.",
        "Paso 4: Mapeo de cuenta contable asociada: 2.1.01.01 Proveedores Locales.",
        "Paso 5: Validación de artículo en OITM: Alta de \"Resina Polietileno\" a costo estimado de $1.20 / Kg en almacén 01."
      ],
      "accountingJournalEntry": [
        {
          "account": "No genera asiento contable inmediato (Registro de Dato Maestro)",
          "debe": 0
        },
        {
          "account": "Habilita transacciones futuras en compras y bodega",
          "haber": 0
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 03: Alta de Cliente Corporativo con Validación de RUC",
      "mission": "Registra un cliente corporativo en OCRD con RUC 1790012345001, límite de crédito de $10,000 y lista de precios Mayorista.",
      "expectedResult": "El sistema debe validar el campo LicTradNum y asociar la lista de precios 02."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué sucede si intentas cambiar el método de valoración de un artículo en OITM que ya tiene existencias físicas en almacén?",
        "options": [
          "SAP recalcula el stock automáticamente sin advertencias.",
          "SAP bloquea el cambio hasta que el stock de dicho artículo quede en cero absoluto.",
          "Se puede cambiar si el usuario tiene licencia profesional.",
          "Se cambia automáticamente al final del ejercicio fiscal."
        ],
        "correctIndex": 1,
        "explanation": "Para cambiar el método de valoración de un artículo con inventario, primero se debe vaciar el stock a cero mediante una salida de mercancías."
      },
      {
        "id": 2,
        "question": "¿Qué tabla de la base de datos SAP B1 almacena los datos de cabecera de los Socios de Negocios?",
        "options": [
          "OITM",
          "OCRD",
          "OJDT",
          "OPOR"
        ],
        "correctIndex": 1,
        "explanation": "OCRD almacena los socios de negocios (clientes, proveedores y leads), mientras OITM almacena artículos."
      },
      {
        "id": 3,
        "question": "¿Cuál es la ventaja de asociar una Lista de Precios base con un factor multiplicador a otra lista?",
        "options": [
          "Reduce el espacio de almacenamiento en el disco duro.",
          "Permite que cualquier cambio en la lista de costo base actualice automáticamente los precios minoristas o mayoristas.",
          "Evita pagar impuestos al SRI.",
          "Bloquea los pedidos de clientes morosos."
        ],
        "correctIndex": 1,
        "explanation": "El enlace con factor (ej. Base × 1.30) actualiza en cascada los precios sin tener que digitar artículo por artículo."
      }
    ],
    "relatedManualNumbers": [
      6,
      7,
      8
    ]
  },
  "b1-04": {
    "systemType": "SAP_B1",
    "windowTitle": "Ciclo Order-to-Cash: De la Oportunidad a la Factura A/R",
    "transactionCode": "OQUT / ORDR / ODLN / OINV",
    "screenSummary": "Flujo completo de ventas: Cotización, Pedido de venta con verificación ATP de stock disponible, Despacho físico con Entrega y Emisión de la Factura electrónica de clientes.",
    "classTranscript": {
      "instructor": "Ing. Marco Vivanco, Consultor Senior SAP B1",
      "summary": "Aprende a ejecutar el ciclo comercial Order-to-Cash sin fisuras. Revisaremos cómo el ATP protege el inventario, cómo la Entrega rebaja el kardex y cómo la Factura A/R genera la cuenta por cobrar.",
      "keyPoints": [
        "La verificación ATP (Available to Promise) resta los pedidos comprometidos para no vender lo que ya está apartado.",
        "La Entrega (ODLN) es el documento legal que acompaña el transporte físico junto a la Guía de Remisión.",
        "La Factura A/R (OINV) genera el comprobante electrónico para el SRI y el crédito comercial."
      ],
      "deepDiveText": "El ciclo O2C relaciona las tablas ORDR (pedidos), ODLN (entregas) y OINV (facturas). El vínculo se preserva a través del campo BaseEntry y BaseLine en las líneas de detalle (RDR1, DLN1, INV1). Copiar de un documento base garantiza la trazabilidad completa del mapa de relaciones."
    },
    "interactiveFields": [
      {
        "label": "Número de Pedido (ORDR)",
        "value": "PED-2026-00452",
        "helperExplanation": "Documento comercial en firme acordado con el cliente.",
        "isMandatory": true
      },
      {
        "label": "Estado de Inventario ATP",
        "value": "Stock Disponible: 250 / Comprometido: 50",
        "helperExplanation": "Verificación en tiempo real de existencia en almacén.",
        "isMandatory": true
      },
      {
        "label": "Documento de Entrega (ODLN)",
        "value": "ENT-2026-00318",
        "helperExplanation": "Documento que genera la salida física del inventario del kardex.",
        "isMandatory": true
      },
      {
        "label": "Factura de Venta A/R (OINV)",
        "value": "FAC-001-002-000084920",
        "helperExplanation": "Factura electrónica con autorización del SRI.",
        "isMandatory": true
      },
      {
        "label": "Tarifa IVA Aplicada",
        "value": "IVA 15% (Vigente Ecuador)",
        "helperExplanation": "Tarifa oficial del impuesto al valor agregado en Ecuador.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Venta Mayorista de Insumos con IVA 15%",
      "stepByStepMath": [
        "Escenario: Pedido de 50 cajas de insumos a $80.00 c/u. Costo unitario en bodega = $50.00 c/u.",
        "Paso 1: Subtotal de la Venta = 50 × $80.00 = $4,000.00.",
        "Paso 2: IVA 15% = $4,000.00 × 0.15 = $600.00.",
        "Paso 3: Total Factura de Clientes A/R = $4,000.00 + $600.00 = $4,600.00.",
        "Paso 4: Asiento de Entrega (Costo): 50 × $50.00 = $2,500.00 (Costo de Ventas a Stock).",
        "Paso 5: Asiento de Factura (Ingreso): Clientes por Cobrar $4,600.00 vs Ventas $4,000.00 + IVA $600.00.",
        "Paso 6: Margen Bruto = $4,000.00 - $2,500.00 = $1,500.00 (37.5%)."
      ],
      "accountingJournalEntry": [
        {
          "account": "1.1.02.01 Clientes Nacionales por Cobrar",
          "debe": 4600
        },
        {
          "account": "4.1.01.01 Ventas Gravadas 15% IVA",
          "haber": 4000
        },
        {
          "account": "2.1.04.05 IVA por Pagar Ventas 15%",
          "haber": 600
        },
        {
          "account": "5.1.01.01 Costo de Ventas Nacional",
          "debe": 2500
        },
        {
          "account": "1.1.05.01 Inventario Mercaderías",
          "haber": 2500
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 04: Flujo O2C con Copiado desde Pedido a Entrega",
      "mission": "Genera un pedido de cliente en ORDR por $4,000 y utilízalo como documento base para crear la Entrega ODLN con salida física de bodega.",
      "expectedResult": "El mapa de relaciones de SAP B1 debe mostrar la conexión cerrada entre Pedido, Entrega y Factura."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué función cumple el botón \"Copiar de\" (Copy From) al crear una Factura A/R desde una Entrega?",
        "options": [
          "Duplica los registros contables en una base secundaria.",
          "Mantiene la trazabilidad en el Mapa de Relaciones y evita duplicar la salida de inventario.",
          "Aplica automáticamente un descuento del 10%.",
          "Envía una copia del documento por WhatsApp al cliente."
        ],
        "correctIndex": 1,
        "explanation": "Copiar desde el documento base preserva la trazabilidad y garantiza que el inventario no se descuente dos veces."
      },
      {
        "id": 2,
        "question": "Si una empresa entrega mercadería en fecha 10 de marzo y factura el 15 de marzo, ¿en qué fecha se reconoce contablemente el costo de ventas?",
        "options": [
          "El 15 de marzo con la factura.",
          "El 10 de marzo con la entrega física.",
          "Al final de mes en el cierre contable.",
          "Cuando el cliente pague la factura."
        ],
        "correctIndex": 1,
        "explanation": "Bajo NIIF y arquitectura SAP B1, el costo de ventas se devenga con la transferencia del control del bien en la Entrega (10 de marzo)."
      },
      {
        "id": 3,
        "question": "¿Qué tabla almacena las líneas de detalle de las facturas de clientes en SAP B1?",
        "options": [
          "OINV",
          "INV1",
          "RDR1",
          "JDT1"
        ],
        "correctIndex": 1,
        "explanation": "OINV almacena la cabecera de la factura de clientes e INV1 almacena sus líneas de artículos."
      }
    ],
    "relatedManualNumbers": [
      8,
      9,
      10
    ]
  },
  "b1-05": {
    "systemType": "SAP_B1",
    "windowTitle": "Ciclo Procure-to-Pay: De la Requisición al Pago A/P",
    "transactionCode": "OPOR / OPDN / OPCH / VPM1",
    "screenSummary": "Flujo de compras corporativas: Solicitud interna, Orden de Compra (PO), Entrada de Mercancías en almacén (GRPO), Factura de Proveedor con retención de impuestos y Pago en banco.",
    "classTranscript": {
      "instructor": "CPA Verónica Zambrano, Especialista NIIF y Consultora SAP B1",
      "summary": "Aprende a controlar las compras de la empresa mediante el ciclo Procure-to-Pay. Veremos cómo conciliar la recepción física de almacén contra la factura del proveedor y liquidar las retenciones SRI.",
      "keyPoints": [
        "La Entrada de Mercancías (GRPO / OPDN) registra el ingreso físico y crea la provisión de pasivo transitorio.",
        "La Factura de Proveedor (OPCH) salda la provisión y calcula las retenciones de Renta e IVA.",
        "El Pago Efectuado (OVPM) emite la transferencia bancaria o cheque cancelando el líquido."
      ],
      "deepDiveText": "En el ciclo P2P ecuatoriano, la factura A/P (OPCH) debe contener el número de autorización de 49 dígitos del comprobante electrónico del proveedor. Al guardar la factura, el sistema valida que el subtotal y el IVA coincidan al centavo con el XML recibido antes de generar el comprobante de retención electrónico."
    },
    "interactiveFields": [
      {
        "label": "Orden de Compra (OPOR)",
        "value": "OC-2026-00891",
        "helperExplanation": "Compromiso comercial emitido al proveedor con precios pactados.",
        "isMandatory": true
      },
      {
        "label": "Entrada de Mercancía (OPDN)",
        "value": "GRPO-2026-00743",
        "helperExplanation": "Recepción física verificada por el jefe de bodega.",
        "isMandatory": true
      },
      {
        "label": "Factura Proveedor (OPCH)",
        "value": "FP-002-101-000459812",
        "helperExplanation": "Documento tributario emitido por el proveedor.",
        "isMandatory": true
      },
      {
        "label": "Código Retención Renta",
        "value": "312 - Compra de Bienes Muebles (2%)",
        "helperExplanation": "Retención en la fuente del impuesto a la renta obligatoria por ley (2% desde el 1 de marzo de 2026, Resolución NAC-DGERCGC26-00000009).",
        "isMandatory": true
      },
      {
        "label": "Retención IVA Aplicable",
        "value": "IVA 30% (Retención sobre el IVA liquidado)",
        "helperExplanation": "Retención sobre el valor del IVA si la empresa es agente de retención.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Compra de Mercadería de $10,000 con Retención SRI",
      "stepByStepMath": [
        "Escenario: Compra de inventario por $10,000.00 a sociedad nacional.",
        "Paso 1: Subtotal Compra = $10,000.00.",
        "Paso 2: IVA 15% = $10,000.00 × 0.15 = $1,500.00.",
        "Paso 3: Retención Renta 2% (Cód. 312) = $10,000.00 × 0.02 = $200.00.",
        "Paso 4: Retención IVA 30% = $1,500.00 × 0.30 = $450.00.",
        "Paso 5: Total Retenido que no se paga al proveedor = $200.00 + $450.00 = $650.00.",
        "Paso 6: Valor Neto a Pagar al Proveedor = ($10,000 + $1,500) - $650.00 = $10,850.00."
      ],
      "accountingJournalEntry": [
        {
          "account": "1.1.05.01 Inventario Mercaderías",
          "debe": 10000
        },
        {
          "account": "1.1.06.01 IVA Crédito Tributario Compras 15%",
          "debe": 1500
        },
        {
          "account": "2.1.04.01 Retenciones Renta por Pagar SRI (Cód 312)",
          "haber": 200
        },
        {
          "account": "2.1.04.02 Retenciones IVA por Pagar SRI (30%)",
          "haber": 450
        },
        {
          "account": "2.1.01.01 Proveedores Locales por Pagar (Líquido)",
          "haber": 10850
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 05: Conciliación de GRPO contra Factura A/P y Liquidación de Retención",
      "mission": "Carga una factura de compras por $10,000, aplica retención código 312 (2%) y retención de IVA del 30% generando el comprobante de retención tipo 07.",
      "expectedResult": "El sistema debe arrojar saldo a pagar al proveedor de $10,850.00 y dejar las retenciones pendientes para el Formulario 103."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué documento del ciclo de compras genera el asiento inicial que debita la cuenta de Inventario y acredita la provisión de pasivo?",
        "options": [
          "La Orden de Compra (OPOR).",
          "La Entrada de Mercancías / Recepción (OPDN / GRPO).",
          "La Solicitud de Cotización.",
          "La Transferencia Bancaria."
        ],
        "correctIndex": 1,
        "explanation": "La Entrada de Mercancías (GRPO) es la transacción que valida el ingreso físico a bodega e incrementa el inventario con su provisión puente."
      },
      {
        "id": 2,
        "question": "Al registrar una factura de proveedor con retenciones del SRI, ¿qué sucede con los montos retenidos?",
        "options": [
          "Se le pagan al proveedor en efectivo.",
          "Se deducen del pago al proveedor y se registran como pasivo tributario para pagar al SRI el mes siguiente.",
          "Se eliminan de la contabilidad como descuento comercial.",
          "Se abonan a la cuenta de capital social."
        ],
        "correctIndex": 1,
        "explanation": "El dinero retenido se le descuenta al proveedor y la empresa lo custodia como agente de retención para entregarlo al SRI en el Formulario 103."
      },
      {
        "id": 3,
        "question": "¿Qué tabla almacena las cabeceras de las facturas de proveedores (Facturas A/P)?",
        "options": [
          "OPCH",
          "OINV",
          "OPOR",
          "OACT"
        ],
        "correctIndex": 0,
        "explanation": "OPCH almacena las facturas de proveedores (A/P Invoices) en SAP B1."
      }
    ],
    "relatedManualNumbers": [
      11,
      12,
      20
    ]
  },
  "b1-06": {
    "systemType": "SAP_B1",
    "windowTitle": "Inventario Avanzado: Métodos de Valoración, Lotes y Números de Serie",
    "transactionCode": "OINM / OBTN / OSRI",
    "screenSummary": "Gestión y control de inventarios: Configuración de métodos de costeo (FIFO, Promedio Ponderado, Estándar), trazabilidad estricta de lotes con fechas de vencimiento y números de serie.",
    "classTranscript": {
      "instructor": "Ing. Marco Vivanco, Consultor Senior SAP B1",
      "summary": "Aprende a gestionar el inventario valorado en SAP B1. Entiende el funcionamiento del kardex en la tabla OINM y cómo parametrizar lotes para industrias farmacéuticas o de alimentos.",
      "keyPoints": [
        "La tabla OINM es el libro mayor de inventarios; cada movimiento físico crea un registro inmutable.",
        "El método FIFO consume las capas más antiguas primero; el Promedio Ponderado recalcula el costo unitario.",
        "La gestión de lotes (OBTN) permite bloquear automáticamente artículos caducados."
      ],
      "deepDiveText": "Bajo NIIF para PYMES en Ecuador, el método LIFO (Último en entrar, primero en salir) está expresamente prohibido. SAP B1 ofrece FIFO y Promedio Ponderado Móvil como las opciones estándar recomendadas. La parametrización de ubicaciones de bodega (Bin Locations) añade control tridimensional de pasillos y niveles."
    },
    "interactiveFields": [
      {
        "label": "Método de Valoración Activo",
        "value": "Promedio Ponderado Móvil",
        "helperExplanation": "Recalcula el costo por unidad tras cada recepción de compra.",
        "isMandatory": true
      },
      {
        "label": "Gestión de Lotes (OBTN)",
        "value": "Obligatorio en Todas las Transacciones",
        "helperExplanation": "Exige ingresar número de lote y fecha de vencimiento al recibir o despachar.",
        "isMandatory": true
      },
      {
        "label": "Almacén por Defecto",
        "value": "01 - Bodega Matriz Guayaquil",
        "helperExplanation": "Ubicación física donde se custodia la existencia.",
        "isMandatory": true
      },
      {
        "label": "Control de Negativos",
        "value": "Bloqueado (No se permite stock negativo)",
        "helperExplanation": "Evita despachar unidades que no existen físicamente.",
        "isMandatory": true
      },
      {
        "label": "Cuenta Contable de Ajuste",
        "value": "5.1.03.05 Faltantes de Inventario",
        "helperExplanation": "Cuenta de pérdidas para ajustes de conteo cíclico.",
        "isMandatory": false
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Entrada de Lote con Dos Compras a Diferente Precio",
      "stepByStepMath": [
        "Escenario: Compra 1: 100 unidades a $10.00 ($1,000). Compra 2: 50 unidades a $13.00 ($650).",
        "Paso 1: Stock Total acumulado = 100 + 50 = 150 unidades.",
        "Paso 2: Valor Monetario Total = $1,000.00 + $650.00 = $1,650.00.",
        "Paso 3: Nuevo Costo Promedio Ponderado = $1,650.00 ÷ 150 unidades = $11.00 por unidad.",
        "Paso 4: Venta y Despacho de 40 unidades: Costo de Ventas = 40 × $11.00 = $440.00.",
        "Paso 5: Saldo remanente en bodega = 110 unidades × $11.00 = $1,210.00."
      ],
      "accountingJournalEntry": [
        {
          "account": "5.1.01.01 Costo de Ventas Nacional",
          "debe": 440
        },
        {
          "account": "1.1.05.01 Inventario Mercaderías (Salida de 40 uds)",
          "haber": 440
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 06: Creación de Artículo con Gestión de Lotes y Fecha de Caducidad",
      "mission": "Da de alta un producto farmacéutico con gestión de lotes obligatoria, ingresa el lote LT-2026-A con caducidad en 12 meses y verifica el kardex en OINM.",
      "expectedResult": "El sistema debe exigir el lote al intentar crear una entrega o factura."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Cuál método de costeo de inventarios está expresamente prohibido bajo las Normas Internacionales de Información Financiera (NIIF)?",
        "options": [
          "Promedio Ponderado Móvil",
          "FIFO (Primeras entradas, primeras salidas)",
          "LIFO (Últimas entradas, primeras salidas)",
          "Costo Estándar"
        ],
        "correctIndex": 2,
        "explanation": "La norma NIC 2 / Sección 13 de NIIF prohíbe el uso de LIFO porque distorsiona el valor real de los inventarios en balance."
      },
      {
        "id": 2,
        "question": "¿Qué tabla de base de datos de SAP B1 representa el Kardex oficial donde se registran todas las transacciones de entrada y salida?",
        "options": [
          "OITM",
          "OINM",
          "OITW",
          "OBTN"
        ],
        "correctIndex": 1,
        "explanation": "OINM (Warehouse Journal) es la tabla maestra inmutable donde cada movimiento físico registra su impacto contable y de unidades."
      },
      {
        "id": 3,
        "question": "¿Por qué es una mejor práctica de auditoría bloquear el stock negativo en las definiciones generales de SAP B1?",
        "options": [
          "Porque acelera la velocidad de la red.",
          "Porque el stock negativo descalibra los costos promedio ponderados y produce distorsiones financieras graves.",
          "Porque el SRI cobra multas por cada unidad negativa.",
          "Porque bloquea la impresión de reportes."
        ],
        "correctIndex": 1,
        "explanation": "Tener stock negativo genera costos unitarios aberrantes (divisiones por cero o valores negativos), dañando la integridad del balance."
      }
    ],
    "relatedManualNumbers": [
      13,
      14,
      15
    ]
  },
  "b1-07": {
    "systemType": "SAP_B1",
    "windowTitle": "Producción y Planificación de Requerimientos (MRP)",
    "transactionCode": "OITT / OWOR / MRP-WIZ",
    "screenSummary": "Gestión de manufactura: Listas de Materiales (BOM / Recetas), Órdenes de Producción, consumo de insumos con backflush, asignación de mano de obra y corridas del Asistente MRP.",
    "classTranscript": {
      "instructor": "Ing. Marco Vivanco, Consultor Senior SAP B1",
      "summary": "Aprende a modelar líneas de producción industrial en SAP B1. Definiremos recetas de fabricación, calcularemos costos de mano de obra y ejecutaremos el asistente MRP para generar órdenes de compra automáticas.",
      "keyPoints": [
        "La Lista de Materiales (OITT) define la receta: componentes, cantidades y mermas técnicas.",
        "La Orden de Producción (OWOR) transforma materias primas en producto terminado mediante notificación de piso.",
        "El Asistente MRP analiza la demanda futura, pedidos comprometidos y stock mínimo para sugerir compras o fabricación."
      ],
      "deepDiveText": "En plantas de transformación ecuatorianas (alimentos, plásticos, agroindustria), la configuración del método de emisión (Backflush vs Manual) determina cuándo se rebajan las materias primas. El método Backflush automatiza el consumo en proporción al reporte de producto terminado terminado, mientras el Manual permite registrar mermas reales de planta."
    },
    "interactiveFields": [
      {
        "label": "Producto Terminado Padre",
        "value": "PT-AGRO-001 Caja de Conserva 500g",
        "helperExplanation": "Artículo que se fabrica y se ingresa al almacén de producto terminado.",
        "isMandatory": true
      },
      {
        "label": "Tipo de Lista de Materiales",
        "value": "Producción (Production BOM)",
        "helperExplanation": "Permite despiece en órdenes de fabricación.",
        "isMandatory": true
      },
      {
        "label": "Método de Emisión de Componentes",
        "value": "Notificación (Backflush)",
        "helperExplanation": "Consume los insumos automáticamente al reportar la terminación.",
        "isMandatory": true
      },
      {
        "label": "Componente Recurso (Mano de Obra)",
        "value": "REC-OP-01 Operario de Línea Envasado",
        "helperExplanation": "Asigna el costo horario del personal de planta al costo unitario del producto.",
        "isMandatory": false
      },
      {
        "label": "Escenario de Planificación MRP",
        "value": "MRP_MENSUAL_DEMANDA_2026",
        "helperExplanation": "Horizonte temporal de 90 días para sugerir adquisiciones de materias primas.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Costeo y Cierre de Orden de Producción de 500 Unidades",
      "stepByStepMath": [
        "Escenario: Fabricación de 500 cajas de conserva. Consumo de insumos: Hortalizas $600, Envases $250, Etiquetas $50. Mano de obra directa: $200.",
        "Paso 1: Costo Total de Materias Primas Insumidas = $600 + $250 + $50 = $900.00.",
        "Paso 2: Costo de Mano de Obra y Costos Indirectos de Fabricación (CIF) = $200.00.",
        "Paso 3: Costo de Producción Total Acumulado = $900.00 + $200.00 = $1,100.00.",
        "Paso 4: Costo Unitario de Producto Terminado = $1,100.00 ÷ 500 unidades = $2.20 por caja.",
        "Paso 5: Asiento de Cierre: Se acredita Trabajo en Proceso (WIP) por $1,100 y se debita Inventario de Producto Terminado."
      ],
      "accountingJournalEntry": [
        {
          "account": "1.1.05.02 Inventario Producto Terminado",
          "debe": 1100
        },
        {
          "account": "1.1.05.04 Inventario Materias Primas Insumidas",
          "haber": 900
        },
        {
          "account": "2.1.03.05 Mano de Obra Aplicada / CIF",
          "haber": 200
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 07: Creación de Lista de Materiales y Ejecución de Orden de Trabajo",
      "mission": "Crea una receta de producción con 3 materias primas, emite una orden de producción para 500 unidades y ciérrala verificando el costo unitario de $2.20.",
      "expectedResult": "El kardex debe mostrar la baja de materias primas y el alta de las 500 unidades terminadas."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Cuál es la diferencia entre el método de emisión \"Manual\" y \"Notificación\" (Backflush) en una orden de producción?",
        "options": [
          "Manual no permite usar materias primas importadas.",
          "Backflush descarga los componentes automáticamente según la receta al reportar la terminación; Manual exige registrar el consumo exacto.",
          "Manual solo sirve para productos defectuosos.",
          "Backflush no calcula costos de mano de obra."
        ],
        "correctIndex": 1,
        "explanation": "Backflush calcula el consumo teórico multiplicando la cantidad fabricada por la receta, mientras que Manual permite ingresar variaciones y mermas reales."
      },
      {
        "id": 2,
        "question": "¿Qué tabla almacena las Órdenes de Producción en SAP Business One?",
        "options": [
          "OWOR",
          "OITT",
          "WOR1",
          "ITT1"
        ],
        "correctIndex": 0,
        "explanation": "OWOR almacena las cabeceras de órdenes de producción y WOR1 sus líneas de componentes."
      },
      {
        "id": 3,
        "question": "¿Qué tipo de recomendaciones genera el asistente MRP tras analizar la demanda y los stocks?",
        "options": [
          "Aumentos salariales para los obreros.",
          "Recomendaciones de Pedidos de Compra a proveedores y Órdenes de Producción internas.",
          "Declaraciones automáticas de impuestos al SRI.",
          "Reducciones de personal en almacén."
        ],
        "correctIndex": 1,
        "explanation": "El MRP detecta faltantes de inventario y genera sugerencias automáticas de compra o de órdenes de fabricación."
      }
    ],
    "relatedManualNumbers": [
      15,
      16
    ]
  },
  "b1-08": {
    "systemType": "SAP_B1",
    "windowTitle": "Informes, Query Generator y Cockpit Analítico SAP HANA",
    "transactionCode": "HANA-SQL / CR-RPT / FIORI",
    "screenSummary": "Inteligencia de negocios y reportes: Creación de consultas SQL en el Query Generator, diseño de formatos oficiales en Crystal Reports y visualización de indicadores clave en el Cockpit Fiori de SAP HANA.",
    "classTranscript": {
      "instructor": "Ing. Marco Vivanco, Consultor Senior SAP B1",
      "summary": "Aprende a extraer información de valor desde la base de datos SAP B1. Escribiremos consultas SQL optimizadas con tablas de clientes, inventarios y ventas, y configuraremos paneles ejecutivos en el Cockpit Fiori.",
      "keyPoints": [
        "El Generador de Consultas (Query Generator) permite unir tablas (JOINs) mediante SQL estándar.",
        "Crystal Reports es la herramienta oficial para diseñar facturas, guías y cheques con logotipo y código de barras.",
        "Los widgets y KPIs en el Cockpit de SAP HANA se actualizan en memoria en tiempo real."
      ],
      "deepDiveText": "La base de datos SAP HANA almacena las tablas columnarmente en memoria RAM, permitiendo ejecutar analíticas complejas sobre millones de registros en milisegundos. El uso de Calculation Views y queries SQL parametrizados permite alimentar dashboards interactivos sin afectar la velocidad de facturación de los cajeros."
    },
    "interactiveFields": [
      {
        "label": "Editor de Consulta SQL",
        "value": "SELECT T0.CardCode, T0.CardName, SUM(T1.DocTotal) FROM OCRD T0 INNER JOIN OINV T1...",
        "helperExplanation": "Query estructurada para totalizar ventas anuales por cliente corporativo.",
        "isMandatory": true
      },
      {
        "label": "Herramienta de Salida",
        "value": "Crystal Reports 2026 Developer Edition",
        "helperExplanation": "Generador de documentos oficiales para impresión y PDF.",
        "isMandatory": true
      },
      {
        "label": "Widget de Cockpit HANA",
        "value": "KPI: Margen de Utilidad Bruta Mensual",
        "helperExplanation": "Indicador visual con semáforo verde/rojo en la pantalla de inicio del usuario.",
        "isMandatory": false
      },
      {
        "label": "Nivel de Permisos de Consulta",
        "value": "Grupo de Consultas 01 - Gerencia Financiera",
        "helperExplanation": "Restringe el acceso a reportes confidenciales por perfil de usuario.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Construcción de Reporte de Antigüedad de Cartera por Cliente",
      "stepByStepMath": [
        "Escenario: Gerencia requiere conocer qué clientes deben facturas vencidas a más de 60 días.",
        "Paso 1: Identificación de tablas: OCRD (Clientes) y OINV (Facturas) y JDT1 (Asientos).",
        "Paso 2: Condición SQL: WHERE T0.DocStatus = \"O\" AND DATEDIFF(day, T0.DocDueDate, CURRENT_DATE) > 60.",
        "Paso 3: Agrupación y Sumatoria: SUM(T0.DocTotal - T0.PaidToDate) AS SaldoPendiente.",
        "Paso 4: Resultado del reporte: 14 clientes identificados con una deuda vencida total de $34,890.00.",
        "Paso 5: Automatización: Creación de alerta automática por correo para el departamento de cobranzas."
      ],
      "accountingJournalEntry": [
        {
          "account": "No genera asiento contable (Reporte Analítico de Gestión)",
          "debe": 0
        },
        {
          "account": "Informa la composición del saldo de la cuenta 1.1.02.01 Clientes",
          "haber": 0
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 08: Creación de Consulta SQL y Publicación en Menú de Usuario",
      "mission": "Diseña una consulta SQL que liste el Top 10 de productos más vendidos en el mes y guárdala en el menú de informes de ventas de SAP B1.",
      "expectedResult": "El reporte debe mostrar código, descripción, unidades vendidas y monto total facturado."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué herramienta integrada en SAP Business One permite a los usuarios crear consultas personalizadas sobre las tablas del sistema?",
        "options": [
          "El Administrador de Licencias",
          "El Query Generator / Asistente de Consultas",
          "El Editor de Formularios de Windows",
          "El Backup Manager"
        ],
        "correctIndex": 1,
        "explanation": "El Query Generator permite redactar sentencias SQL sobre cualquier tabla del sistema y guardar los resultados para uso cotidiano."
      },
      {
        "id": 2,
        "question": "¿Cuál es la tecnología de base de datos en memoria que permite a SAP Business One procesar grandes volúmenes de analítica en tiempo real?",
        "options": [
          "Microsoft Access",
          "SAP HANA",
          "SQLite",
          "Firebase Realtime"
        ],
        "correctIndex": 1,
        "explanation": "SAP HANA es el motor relacional en memoria que ejecuta analíticas y dashboards de alto rendimiento en tiempo real."
      },
      {
        "id": 3,
        "question": "¿Por qué se utiliza Crystal Reports como estándar para los comprobantes comerciales en SAP B1?",
        "options": [
          "Porque es el único que puede enviar mensajes de texto.",
          "Porque ofrece control milimétrico de diseño, códigos de barras e integración nativa con los datos del documento.",
          "Porque no requiere instalar licencias de SAP.",
          "Porque traduce automáticamente al inglés."
        ],
        "correctIndex": 1,
        "explanation": "Crystal Reports permite maquetar formatos oficiales de impresión con logos, códigos QR y tablas con exactitud gráfica profesional."
      }
    ],
    "relatedManualNumbers": [
      14,
      16
    ]
  },
  "loc-01": {
    "systemType": "SAP_B1",
    "windowTitle": "Facturación Electrónica SRI: Transmisión XML y Firma Digital",
    "transactionCode": "SRI-XML-01",
    "screenSummary": "Motor de cumplimiento tributario: Generación de comprobantes electrónicos en estándar XML v2.1.0, firmado criptográfico con token XAdES-BES y transmisión inmediata al Web Service del SRI.",
    "classTranscript": {
      "instructor": "Ing. Christian Roldán, Especialista en Integración SRI & SAP B1",
      "summary": "Aprende cómo funciona el circuito de facturación electrónica en Ecuador. Desarmaremos la estructura del XML, calcularemos la Clave de Acceso de 49 dígitos con el algoritmo Módulo 11 y entenderemos cómo manejar la firma digital XAdES-BES.",
      "keyPoints": [
        "La Clave de Acceso tiene 49 dígitos y es el identificador único ante el SRI.",
        "El XML debe validarse contra el esquema XSD 2.1.0 antes de enviarse al Web Service.",
        "La firma digital debe ser de tipo archivo .p12 con algoritmo SHA-256."
      ],
      "deepDiveText": "Cuando un usuario guarda una factura en SAP B1, un Add-on o servicio background toma los datos de OINV e INV1 y compone el XML. La clave de acceso combina: Fecha (8) + Tipo Comprobante (2) + RUC (13) + Ambiente (1) + Serie (6) + Secuencial (9) + Código Numérico (8) + Tipo Emisión (1) + Dígito Verificador Módulo 11 (1). Si el dígito verificador falla, el SRI rechaza el documento inmediatamente."
    },
    "interactiveFields": [
      {
        "label": "Tipo de Comprobante SRI",
        "value": "01 - Factura de Venta Electrónica",
        "helperExplanation": "Código oficial del catálogo de comprobantes tributarios del SRI.",
        "isMandatory": true
      },
      {
        "label": "Clave de Acceso (49 dígitos)",
        "value": "1309202601099234857100110010020000849201234567814",
        "helperExplanation": "Clave única generada con algoritmo matemático Módulo 11.",
        "isMandatory": true
      },
      {
        "label": "Ambiente de Conexión",
        "value": "2 - Producción (cel.sri.gob.ec)",
        "helperExplanation": "Servidor oficial del SRI para comprobantes con validez fiscal.",
        "isMandatory": true
      },
      {
        "label": "Formato de Firma Criptográfica",
        "value": "XAdES-BES / PKCS#12 (.p12) SHA-256",
        "helperExplanation": "Certificado de firma digital emitido por entidad autorizada (BCE, Security Data, etc.).",
        "isMandatory": true
      },
      {
        "label": "Estado de Autorización SRI",
        "value": "AUTORIZADO (Código 200 OK)",
        "helperExplanation": "Respuesta del SRI confirmando la validez tributaria del documento.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Generación y Transmisión de Factura Electrónica de $1,200",
      "stepByStepMath": [
        "Escenario: Facturación de servicios de consultoría por $1,200.00 a cliente corporativo.",
        "Paso 1: Base Imponible = $1,200.00. Tarifa IVA 15% = $180.00. Total Factura = $1,380.00.",
        "Paso 2: Generación del nodo <infoFactura> con moneda DOLAR y código de forma de pago 20 (Otros con utilización del sistema financiero).",
        "Paso 3: Construcción de la Clave de Acceso de 49 dígitos y aplicación del algoritmo Módulo 11.",
        "Paso 4: Inyección del nodo <ds:Signature> con certificado digital .p12 y digest SHA-256.",
        "Paso 5: Envío SOAP al método recepcionComprobantes y consulta inmediata a autorizacionComprobantes.",
        "Paso 6: Respuesta del SRI: \"AUTORIZADO\" con número de autorización y timestamp de registro."
      ],
      "accountingJournalEntry": [
        {
          "account": "1.1.02.01 Clientes por Cobrar",
          "debe": 1380
        },
        {
          "account": "4.1.01.02 Ingresos por Servicios Profesionales",
          "haber": 1200
        },
        {
          "account": "2.1.04.05 IVA por Pagar Ventas 15%",
          "haber": 180
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 09: Inspección de XML y Cálculo de Dígito Verificador Módulo 11",
      "mission": "Toma una cadena de 48 caracteres, aplica los pesos 2,3,4,5,6,7 y halla el dígito verificador final para completar la clave de 49 dígitos.",
      "expectedResult": "El validador del SRI debe confirmar que la clave de acceso tiene checksum matemáticamente válido."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Cuántos dígitos exactos tiene la Clave de Acceso de los comprobantes electrónicos del SRI en Ecuador?",
        "options": [
          "37 dígitos",
          "49 dígitos",
          "52 dígitos",
          "40 dígitos alfanuméricos"
        ],
        "correctIndex": 1,
        "explanation": "La clave de acceso del SRI tiene exactamente 49 caracteres numéricos calculados mediante el algoritmo Módulo 11."
      },
      {
        "id": 2,
        "question": "¿Cuál es el estándar de firma criptográfica exigido por la ficha técnica del SRI para facturas electrónicas?",
        "options": [
          "PGP Signature",
          "XAdES-BES sobre formato XML",
          "MD5 Checksum",
          "Firma manuscrita escaneada"
        ],
        "correctIndex": 1,
        "explanation": "El SRI exige el estándar XAdES-BES en formato XML utilizando certificados de firma electrónica reconocidos por el ARCOTEL."
      },
      {
        "id": 3,
        "question": "¿Qué código de tipo de comprobante corresponde a las Facturas de Venta según el catálogo del SRI?",
        "options": [
          "01",
          "04",
          "05",
          "07"
        ],
        "correctIndex": 0,
        "explanation": "El código 01 corresponde a Factura, 04 a Nota de Crédito, 05 a Nota de Débito y 07 a Comprobante de Retención."
      }
    ],
    "relatedManualNumbers": [
      17,
      18,
      19
    ]
  },
  "loc-02": {
    "systemType": "SAP_B1",
    "windowTitle": "Retenciones en la Fuente: Parametrización Códigos SRI",
    "transactionCode": "OPCH / WTCode",
    "screenSummary": "Al registrar una factura de compras de un proveedor en Ecuador, SAP B1 determina qué retención de Impuesto a la Renta y de IVA se debe descontar. El dinero retenido no se le paga al proveedor, sino que se entrega al SRI al mes siguiente mediante el Formulario 103.",
    "classTranscript": {
      "instructor": "CPA Verónica Zambrano, Especialista NIIF y Consultora SAP B1",
      "summary": "Aprende a configurar las tablas de retención en la fuente de SAP B1. Revisaremos los porcentajes de Impuesto a la Renta vigentes desde el 1 de marzo de 2026 (Resolución NAC-DGERCGC26-00000009) y los porcentajes de IVA (30%, 70%, 100%) según el régimen tributario del emisor y receptor.",
      "keyPoints": [
        "Código 312 aplica a compras de bienes muebles (2% desde marzo 2026).",
        "Código 304 aplica a servicios con predominio de mano de obra (3%); todo pago sin porcentaje específico también retiene el 3%.",
        "Si compras a un contribuyente RIMPE Negocio Popular, no se aplica retención de renta ni de IVA."
      ],
      "deepDiveText": "La determinación de retenciones en SAP B1 se apoya en la tabla OWHT (Withholding Tax). Cada código de retención debe tener vinculado su porcentaje, la cuenta contable de pasivo donde se acredita el valor y el código oficial del Anexo Transaccional Simplificado (ATS)."
    },
    "interactiveFields": [
      {
        "label": "Tipo de Documento",
        "value": "Factura de Proveedor (OPCH)",
        "helperExplanation": "Documento contable oficial que sustenta la compra de insumos, servicios o activos fijos.",
        "isMandatory": true
      },
      {
        "label": "Código Retención Bienes",
        "value": "312 - Transferencia de Bienes Muebles (2%)",
        "helperExplanation": "Aplica a compras de productos físicos, materias primas y mercadería.",
        "isMandatory": true
      },
      {
        "label": "Código Retención Servicios",
        "value": "304 - Servicios con Predominio de Mano de Obra (3%)",
        "helperExplanation": "Aplica a mano de obra y mantenimiento. Los servicios profesionales de sociedades retienen 5% y los honorarios de personas naturales 10%.",
        "isMandatory": true
      },
      {
        "label": "Retención de IVA Bienes",
        "value": "Código IVA-30% (Retiene el 30% del IVA causado)",
        "helperExplanation": "Si eres Agente de Retención calificado por el SRI, retienes el 30% del IVA al comprar bienes a sociedades.",
        "isMandatory": true
      },
      {
        "label": "Retención de IVA Servicios",
        "value": "Código IVA-70% (Retiene el 70% del IVA causado)",
        "helperExplanation": "En compras de servicios se retiene el 70% del IVA liquidado en la factura.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Factura Mixta de Insumos y Mantenimiento",
      "stepByStepMath": [
        "Escenario: Compras $4,000 en insumos de cómputo (Bienes) y $1,500 en mantenimiento de equipos (servicio con predominio de mano de obra). Proveedor es Régimen General.",
        "Paso 1: Subtotal Compra = $4,000.00 (Bienes) + $1,500.00 (Servicios) = $5,500.00.",
        "Paso 2: IVA 15% Total = $5,500.00 × 0.15 = $825.00 ($600 de bienes + $225 de servicios).",
        "Paso 3: Retención Renta Bienes Cód. 312 (2%) = $4,000.00 × 0.02 = $80.00.",
        "Paso 4: Retención Renta Servicios Cód. 307 (3%) = $1,500.00 × 0.03 = $45.00.",
        "Paso 5: Retención IVA Bienes 30% = $600.00 × 0.30 = $180.00.",
        "Paso 6: Retención IVA Servicios 70% = $225.00 × 0.70 = $157.50.",
        "Paso 7: Total Retenido que NO pagas al proveedor = $80.00 + $45.00 + $180.00 + $157.50 = $462.50.",
        "Paso 8: Total Factura con IVA = $5,500.00 + $825.00 = $6,325.00.",
        "Paso 9: Valor Neto a Transferir al Proveedor = $6,325.00 - $462.50 = $5,862.50."
      ],
      "accountingJournalEntry": [
        {
          "account": "1.1.05.01 Inventario de Equipos (Bienes)",
          "debe": 4000
        },
        {
          "account": "5.1.03.02 Gasto Mantenimiento Técnico (Servicios)",
          "debe": 1500
        },
        {
          "account": "1.1.06.01 IVA Crédito Tributario Compras 15%",
          "debe": 825
        },
        {
          "account": "2.1.04.01 Retención en la Fuente Renta por Pagar (312 + 307)",
          "haber": 125
        },
        {
          "account": "2.1.04.02 Retención en la Fuente IVA por Pagar (30% + 70%)",
          "haber": 337.5
        },
        {
          "account": "2.1.01.01 Proveedores Locales por Pagar (Líquido)",
          "haber": 5862.5
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 10: Parametrización de Código de Retención en OWHT",
      "mission": "Actualiza el código de retención 307 en la tabla de retenciones de SAP B1 a la tasa vigente del 3% (Resolución NAC-DGERCGC26-00000009) y enlaza la cuenta de pasivo 2.1.04.01.",
      "expectedResult": "Al ingresar una factura de servicios de mano de obra por $1,000, el sistema debe retener automáticamente $30.00 de renta."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Cuál es el porcentaje vigente de retención de Impuesto a la Renta para la compra de bienes muebles corporales (Código 312)?",
        "options": [
          "1.00%",
          "1.75%",
          "2.00%",
          "3.00%"
        ],
        "correctIndex": 2,
        "explanation": "Desde el 1 de marzo de 2026 (Resolución NAC-DGERCGC26-00000009) el código 312 retiene el 2% sobre bienes muebles corporales; antes era 1.75%."
      },
      {
        "id": 2,
        "question": "¿Qué porcentaje de retención de IVA corresponde retener a un Agente de Retención calificado al comprar servicios a una sociedad régimen general?",
        "options": [
          "10%",
          "20%",
          "30%",
          "70%"
        ],
        "correctIndex": 3,
        "explanation": "En adquisiciones de servicios a sociedades, la retención de IVA aplicable por agentes de retención es del 70% del IVA causado."
      },
      {
        "id": 3,
        "question": "¿En qué formulario mensual del SRI se declaran y pagan los valores retenidos de Impuesto a la Renta a proveedores?",
        "options": [
          "Formulario 101",
          "Formulario 102",
          "Formulario 103",
          "Formulario 104"
        ],
        "correctIndex": 2,
        "explanation": "El Formulario 103 es la declaración mensual de retenciones en la fuente de Impuesto a la Renta."
      }
    ],
    "relatedManualNumbers": [
      20,
      21,
      26
    ]
  },
  "loc-03": {
    "systemType": "SAP_B1",
    "windowTitle": "Ingeniería de Metadatos: UDFs y UDTs para Cumplimiento Fiscal",
    "transactionCode": "SAP-UDF-01",
    "screenSummary": "Diseño de campos de usuario (UDFs) y tablas de usuario (UDTs) para capturar la información tributaria exigida por el SRI que no existe de forma nativa en el estándar internacional de SAP B1.",
    "classTranscript": {
      "instructor": "Ing. Christian Roldán, Especialista en Integración SRI & SAP B1",
      "summary": "Aprende a extender la base de datos de SAP B1 mediante herramientas de parametrización nativas. Crearemos campos de usuario (UDF) para sustento tributario, tipo de comprobante y régimen del contribuyente sin programar código.",
      "keyPoints": [
        "Los UDFs tienen el prefijo obligatorio U_ y se gestionan desde Herramientas de Personalización.",
        "Las UDTs tienen el prefijo @ y almacenan tablas maestras locales (ej. Códigos de Sustento del SRI).",
        "Los UDFs se exponen automáticamente en la Service Layer y en las vistas de Crystal Reports."
      ],
      "deepDiveText": "Para cumplir con el Anexo Transaccional Simplificado (ATS), toda factura de compras debe especificar el Tipo de Sustento Tributario (códigos 01 al 10). Dado que este concepto es exclusivo de Ecuador, se crea el campo U_Sustento en la tabla OPCH y se alimenta mediante una UDT denominada @SRI_SUSTENTO con valores válidos validados por combobox."
    },
    "interactiveFields": [
      {
        "label": "Tabla Destino",
        "value": "OPCH - Factura de Proveedores",
        "helperExplanation": "Tabla contable de compras donde se inyectará el metadato.",
        "isMandatory": true
      },
      {
        "label": "Nombre del Campo (UDF)",
        "value": "U_SustentoSRI",
        "helperExplanation": "Nombre del campo con prefijo U_ de tipo Alfanumérico longitud 2.",
        "isMandatory": true
      },
      {
        "label": "Tabla de Usuario Vinculada",
        "value": "@SRI_SUSTENTO (UDT Maestra)",
        "helperExplanation": "Tabla auxiliar que contiene los 10 códigos oficiales de sustento tributario.",
        "isMandatory": false
      },
      {
        "label": "Valor Seleccionado",
        "value": "01 - Crédito Tributario para declaración de IVA",
        "helperExplanation": "Valor que califica el derecho al crédito fiscal en la compra.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Creación de UDF para Sustento Tributario y Validación en XML",
      "stepByStepMath": [
        "Escenario: Creación del campo U_Sustento en OPCH para alimentar el ATS y la factura electrónica.",
        "Paso 1: Abrir Gestión → Herramientas personalización → Campos de usuario - Gestión.",
        "Paso 2: Seleccionar Datos maestros de compras y finanzas → Documentos de compras → Título.",
        "Paso 3: Definir nombre \"U_SustentoSRI\", descripción \"Sustento Tributario SRI\", tipo Alfanumérico (2 caracteres).",
        "Paso 4: Ingresar valores válidos: 01 (Crédito Tributario), 02 (Costo o Gasto IR), 03 (Activo Fijo).",
        "Paso 5: Verificación: El campo aparece en la solapa de Campos de Usuario lateral de la Factura de Proveedor."
      ],
      "accountingJournalEntry": [
        {
          "account": "No genera asiento contable (Configuración de Arquitectura de Datos)",
          "debe": 0
        },
        {
          "account": "Asegura que el XML del ATS contenga el nodo <codSustento>",
          "haber": 0
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 11: Creación de Campo de Usuario U_RegimenTrib en Socios de Negocios",
      "mission": "Crea el campo U_RegimenTrib en OCRD con las opciones: GENERAL, RIMPE_EMPRENDEDOR, RIMPE_POPULAR y vincula una búsqueda formateada.",
      "expectedResult": "El campo debe estar disponible en la pestaña General de Socios de Negocios."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué prefijo añade automáticamente SAP Business One a todos los Campos de Usuario creados en el sistema?",
        "options": [
          "SAP_",
          "U_",
          "CUSTOM_",
          "FLD_"
        ],
        "correctIndex": 1,
        "explanation": "Todo campo de usuario creado en SAP B1 recibe automáticamente el prefijo \"U_\" (ejemplo: U_SustentoSRI)."
      },
      {
        "id": 2,
        "question": "¿Cuál es la función principal de crear una Tabla de Usuario (UDT) con prefijo \"@\" en SAP B1?",
        "options": [
          "Almacenar respaldos del sistema operativo.",
          "Crear tablas maestras personalizadas para catálogos locales como códigos de sustento o tablas de retención.",
          "Eliminar transacciones antiguas.",
          "Acelerar el inicio de sesión."
        ],
        "correctIndex": 1,
        "explanation": "Las UDTs permiten estructurar información auxiliar personalizada con integridad de datos y mantenimiento de claves."
      },
      {
        "id": 3,
        "question": "¿Por qué es obligatorio registrar el código de sustento tributario en cada factura de compras en Ecuador?",
        "options": [
          "Para que el banco autorice la transferencia.",
          "Porque el validador del Anexo Transaccional Simplificado (ATS) del SRI rechaza compras sin código de sustento válido.",
          "Para que el transportista entregue la mercadería.",
          "Para aplicar descuentos en el seguro de salud."
        ],
        "correctIndex": 1,
        "explanation": "El SRI exige asociar cada compra a un código de sustento (nodo <codSustento>) para calificar si da derecho a crédito fiscal o deducibilidad."
      }
    ],
    "relatedManualNumbers": [
      22,
      23
    ]
  },
  "loc-04": {
    "systemType": "SAP_B1",
    "windowTitle": "Anexo Transaccional Simplificado (ATS): Generación y Cuadre",
    "transactionCode": "SRI-ATS-01",
    "screenSummary": "Generación mensual del informe de transacciones para el SRI: Mapeo de ventas, compras, retenciones emitidas y anulados, validación de esquemas XML y cuadre contra balances contables.",
    "classTranscript": {
      "instructor": "CPA Verónica Zambrano, Especialista NIIF y Consultora SAP B1",
      "summary": "Aprende a generar y conciliar el Anexo Transaccional Simplificado (ATS). Veremos cómo cruzar las ventas y compras del período contra los formularios 103 y 104 y corregir las inconsistencias típicas antes de subir el archivo al DIMM del SRI.",
      "keyPoints": [
        "El ATS se presenta mensualmente según el noveno dígito del RUC.",
        "El total de compras del ATS debe cuadrar al centavo con las casillas del Formulario 104.",
        "Los comprobantes anulados deben reportarse con sus series y secuenciales completos."
      ],
      "deepDiveText": "El ATS es el examen mensual más riguroso que rinde la empresa ante el SRI. El sistema extrae los datos de OPCH, OINV, ORCT, OVPM y sus tablas de retención para armar el archivo XML. Si una factura tiene un RUC inválido, una fecha fuera de mes o una retención mal calculada por $0.01, el validador del SRI arroja error de estructura impidiendo la entrega."
    },
    "interactiveFields": [
      {
        "label": "Período Fiscal del ATS",
        "value": "Mes 08 / Año 2026",
        "helperExplanation": "Mes de las transacciones reportadas ante el SRI.",
        "isMandatory": true
      },
      {
        "label": "Total Compras Reportadas",
        "value": "$128,450.00 (85 Facturas procesadas)",
        "helperExplanation": "Suma de bases imponibles que sustentan crédito tributario.",
        "isMandatory": true
      },
      {
        "label": "Total Ventas Reportadas",
        "value": "$245,800.00 (340 Facturas emitidas)",
        "helperExplanation": "Ingresos operacionales facturados en el período.",
        "isMandatory": true
      },
      {
        "label": "Total Retenciones Renta ATS",
        "value": "$2,894.15 (Cuadrado con Formulario 103)",
        "helperExplanation": "Debe coincidir exactamente con el valor a pagar en el F103.",
        "isMandatory": true
      },
      {
        "label": "Estado Validador SRI DIMM",
        "value": "0 Errores / Esquema XML 100% Válido",
        "helperExplanation": "Resultado de la validación previa antes de subir al portal del SRI.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Cuadre Conciliatorio entre ATS y Formulario 104 del IVA",
      "stepByStepMath": [
        "Escenario: Cierre mensual de agosto con 85 facturas de compras y 340 facturas de ventas.",
        "Paso 1: Total Ventas Base 15% en ATS = $245,800.00. IVA generado = $36,870.00.",
        "Paso 2: Casilla 411 Formulario 104 = $245,800.00. Casilla 421 = $36,870.00 (Cuadre 100%).",
        "Paso 3: Total Compras Bienes Base 15% = $80,000.00. Compras Servicios = $48,450.00. Total = $128,450.00.",
        "Paso 4: Casilla 500 Formulario 104 = $128,450.00. IVA Compras Casilla 510 = $19,267.50.",
        "Paso 5: Retenciones en la fuente recibidas por clientes en ventas = $4,301.50 (Casilla 605).",
        "Paso 6: Impuesto a pagar o saldo a favor determinado y conciliado al centavo."
      ],
      "accountingJournalEntry": [
        {
          "account": "2.1.04.05 Liquidación Mensual IVA por Pagar",
          "debe": 36870
        },
        {
          "account": "1.1.06.01 Compensación IVA Crédito Tributario Compras",
          "haber": 19267.5
        },
        {
          "account": "1.1.06.03 Retenciones IVA que nos hicieron los clientes",
          "haber": 4301.5
        },
        {
          "account": "2.1.04.06 Saldo Neto de IVA a Pagar al SRI en F104",
          "haber": 13301
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 12: Detección y Corrección de Descuadre en Compras del ATS",
      "mission": "Identifica una factura con diferencia de $0.02 de redondeo en el IVA entre el XML del proveedor y el registro de SAP B1 y ajústala para que el validador del ATS apruebe el archivo.",
      "expectedResult": "El ATS debe pasar la prueba del validador con 0 errores de cálculo."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué sucede si el total de compras reportado en el ATS no coincide con la casilla 500 del Formulario 104?",
        "options": [
          "El SRI aprueba el trámite sin observaciones.",
          "El sistema informático del SRI genera una notificación de inconsistencia o auditoría preventiva por cruce de información.",
          "Se anula automáticamente la clave del RUC.",
          "El banco congela las cuentas corrientes."
        ],
        "correctIndex": 1,
        "explanation": "El SRI cruza automáticamente las bases imponibles del ATS contra las declaraciones mensuales; cualquier discrepancia dispara alertas de fiscalización."
      },
      {
        "id": 2,
        "question": "¿Cómo deben reportarse en el ATS las facturas físicas o electrónicas que fueron anuladas durante el mes?",
        "options": [
          "Se borran del archivo XML.",
          "Se incluyen en el nodo <anulados> indicando tipo de comprobante, serie, secuencial de inicio y fin y número de autorización.",
          "Se reportan con valor de $1.00.",
          "Solo se informa a fin de año."
        ],
        "correctIndex": 1,
        "explanation": "El nodo <anulados> es obligatorio para justificar los secuenciales vacíos en la numeración continua del contribuyente."
      },
      {
        "id": 3,
        "question": "¿Qué formato de archivo genera el módulo de localización para presentar el ATS al SRI?",
        "options": [
          "Archivo Excel .xlsx",
          "Documento PDF",
          "Archivo XML codificado en UTF-8",
          "Archivo binario .dat"
        ],
        "correctIndex": 2,
        "explanation": "El ATS se presenta estrictamente como un archivo XML estructurado bajo el esquema XSD oficial del SRI en codificación UTF-8."
      }
    ],
    "relatedManualNumbers": [
      24,
      25
    ]
  },
  "loc-05": {
    "systemType": "SAP_B1",
    "windowTitle": "Auditoría SRI: Anulación de Comprobantes y Resoluciones",
    "transactionCode": "SRI-ANUL-01",
    "screenSummary": "Manejo de contingencias tributarias: Flujo formal de anulación de comprobantes electrónicos en el portal del SRI, emisión de Notas de Crédito correctoras y atención a resoluciones sancionatorias.",
    "classTranscript": {
      "instructor": "CPA Verónica Zambrano, Especialista NIIF y Consultora SAP B1",
      "summary": "Aprende los procedimientos legales para cancelar o corregir transacciones autorizadas por el SRI. Conocerás cuándo usar una Nota de Crédito y cuándo procede la anulación directa en el portal del SRI.",
      "keyPoints": [
        "Un comprobante electrónico autorizado nunca se elimina de la base de datos de SAP B1.",
        "La Nota de Crédito (código 04) es el mecanismo contable para anular o rebajar el valor de una factura.",
        "La anulación en el portal del SRI requiere la aceptación expresa del cliente receptor."
      ],
      "deepDiveText": "Por normativa del SRI, una vez que un comprobante electrónico obtiene el estado AUTORIZADO, adquiere existencia jurídica y fiscal. En SAP B1, está terminantemente prohibido alterar los registros mediante consultas UPDATE en base de datos. Para anular una factura, se debe emitir una Nota de Crédito (ORIN) vinculada al documento base, revirtiendo el ingreso, el IVA y el costo de ventas."
    },
    "interactiveFields": [
      {
        "label": "Documento a Revertir",
        "value": "Factura A/R FAC-001-002-000084920",
        "helperExplanation": "Factura previamente autorizada que contiene un error de precio.",
        "isMandatory": true
      },
      {
        "label": "Instrumento de Corrección",
        "value": "Nota de Crédito Electrónica (ORIN - Cód 04)",
        "helperExplanation": "Comprobante tributario que disminuye el valor de la factura o la anula en su totalidad.",
        "isMandatory": true
      },
      {
        "label": "Motivo de Modificación",
        "value": "Error en cantidad facturada por devolución física",
        "helperExplanation": "Explicación obligatoria en el nodo <motivo> del XML de la Nota de Crédito.",
        "isMandatory": true
      },
      {
        "label": "Retorno Físico al Almacén",
        "value": "SI (Aumenta stock en Bodega 01)",
        "helperExplanation": "Reversa el costo de ventas y devuelve las unidades al kardex.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Emisión de Nota de Crédito Total de Factura de $2,300",
      "stepByStepMath": [
        "Escenario: Factura emitida por $2,000 + IVA ($300) = $2,300. Cliente devuelve la mercadería por defecto de fábrica.",
        "Paso 1: Creación de Nota de Crédito (ORIN) copiada desde la Factura (OINV).",
        "Paso 2: Reversión del Ingreso: Se debita la cuenta de Ventas (4.1.01.01) por $2,000.00.",
        "Paso 3: Reversión del Pasivo Tributario: Se debita IVA por Pagar Ventas (2.1.04.05) por $300.00.",
        "Paso 4: Cancelación de la Cuenta por Cobrar: Se acredita Clientes Nacionales (1.1.02.01) por $2,300.00.",
        "Paso 5: Reversión del Costo: Se debita Inventario ($1,200) y se acredita Costo de Ventas ($1,200).",
        "Paso 6: Saldo del cliente queda en cero y las unidades regresan al stock disponible."
      ],
      "accountingJournalEntry": [
        {
          "account": "4.1.01.01 Devoluciones y Descuentos en Ventas",
          "debe": 2000
        },
        {
          "account": "2.1.04.05 IVA en Ventas (Reversión por Nota de Crédito)",
          "debe": 300
        },
        {
          "account": "1.1.02.01 Clientes Nacionales por Cobrar (Cancelación)",
          "haber": 2300
        },
        {
          "account": "1.1.05.01 Inventario Mercaderías (Retorno físico)",
          "debe": 1200
        },
        {
          "account": "5.1.01.01 Costo de Ventas (Reversión de costo)",
          "haber": 1200
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 13: Emisión de Nota de Crédito Copiada de Factura y Verificación de Kardex",
      "mission": "Emite una Nota de Crédito en ORIN vinculada a una factura de $2,300 y verifica en OINM que las unidades hayan reingresado a la bodega matriz.",
      "expectedResult": "El saldo pendiente de la factura debe pasar a cerrado y el stock debe incrementarse."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué documento tributario debe emitirse obligatoriamente para reversar legalmente una factura electrónica autorizada por el SRI?",
        "options": [
          "Un recibo simple de caja",
          "Una Nota de Crédito electrónica (Tipo 04)",
          "Una cotización de venta",
          "Un correo electrónico explicativo"
        ],
        "correctIndex": 1,
        "explanation": "La Nota de Crédito es el único instrumento legal facultado por la Ley de Régimen Tributario para disminuir o anular una factura emitida."
      },
      {
        "id": 2,
        "question": "¿Por qué está estrictamente prohibido borrar un registro de factura directamente en la base de datos SQL/HANA de SAP B1?",
        "options": [
          "Porque se reinicia el servidor.",
          "Porque rompe la integridad referencial, la trazabilidad de auditoría y constituye defraudación tributaria ante el SRI.",
          "Porque se borran las fotos de los empleados.",
          "Porque cambia el idioma del sistema."
        ],
        "correctIndex": 1,
        "explanation": "Borrar comprobantes en base de datos viola la integridad contable, genera multas tributarias y destruye la auditoría del ERP."
      },
      {
        "id": 3,
        "question": "¿Qué impacto tiene en el kardex la emisión de una Nota de Crédito con devolución de mercadería?",
        "options": [
          "Ninguno, solo afecta la contabilidad.",
          "Reingresa las unidades físicas al almacén y reversa el asiento de costo de ventas.",
          "Elimina los artículos del catálogo.",
          "Bloquea el inventario por 30 días."
        ],
        "correctIndex": 1,
        "explanation": "Al marcar la devolución física, SAP B1 reingresa las unidades al stock y restaura el costo de ventas devengado."
      }
    ],
    "relatedManualNumbers": [
      26
    ]
  },
  "loc-06": {
    "systemType": "SAP_B1",
    "windowTitle": "Formularios SRI (101, 103, 104), ISD 5% y Régimen RIMPE",
    "transactionCode": "SRI-103-104",
    "screenSummary": "Consolidación tributaria integral: Generación de balances fiscales para el Formulario 101 (Renta Sociedades), liquidación del Formulario 104 (IVA), tratamiento del Impuesto a la Salida de Divisas (ISD 5%) y parametrización de contribuyentes RIMPE.",
    "classTranscript": {
      "instructor": "CPA Verónica Zambrano, Especialista NIIF y Consultora SAP B1",
      "summary": "Aprende a preparar las declaraciones tributarias mayores de la empresa. Revisaremos cómo parametrizar el ISD del 5% en transferencias al exterior y las reglas de retención para negocios del Régimen RIMPE.",
      "keyPoints": [
        "El ISD del 5% grava las transferencias monetarias al exterior y puede constituir crédito tributario según la partida arancelaria.",
        "Los contribuyentes RIMPE Emprendedor tienen retención de Renta del 1% en bienes y servicios.",
        "Los contribuyentes RIMPE Negocio Popular no son objeto de retención de renta ni de IVA en comprobantes autorizados."
      ],
      "deepDiveText": "La ley ecuatoriana exige un tratamiento fiscal diferenciado según el régimen del socio de negocios. En SAP B1, esto se gestiona vinculando la ficha OCRD con el catálogo impositivo correspondiente. Cuando la empresa realiza pagos al exterior por importación de servicios o dividendos, el sistema debe liquidar automáticamente el ISD 5% acreditando la cuenta de bancos y registrando el comprobante de retención correspondiente."
    },
    "interactiveFields": [
      {
        "label": "Declaración Tributaria",
        "value": "Formulario 104 (IVA) & Formulario 103 (Retenciones)",
        "helperExplanation": "Declaraciones obligatorias de periodicidad mensual ante el SRI.",
        "isMandatory": true
      },
      {
        "label": "Tarifa ISD Aplicable",
        "value": "5.00% sobre giros al exterior",
        "helperExplanation": "Impuesto a la Salida de Divisas recaudado por el banco sobre pagos al extranjero.",
        "isMandatory": true
      },
      {
        "label": "Clasificación RIMPE Emprendedor",
        "value": "Retención 1.00% Impuesto a la Renta",
        "helperExplanation": "Régimen especial para personas naturales y jurídicas con ingresos hasta $300,000.",
        "isMandatory": true
      },
      {
        "label": "Clasificación RIMPE Negocio Popular",
        "value": "Retención 0.00% (No Sujeto a Retención)",
        "helperExplanation": "Negocios con ingresos anuales hasta $20,000; emiten notas de venta autorizadas.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Pago al Exterior de $25,000 con Liquidación de ISD 5%",
      "stepByStepMath": [
        "Escenario: Pago de licencia de software a proveedor en Estados Unidos por $25,000.00 vía transferencia Swift.",
        "Paso 1: Valor de la transferencia comercial = $25,000.00.",
        "Paso 2: Cálculo del Impuesto a la Salida de Divisas (ISD 5%) = $25,000.00 × 0.05 = $1,250.00.",
        "Paso 3: Débito bancario total en cuenta corriente = $25,000.00 (Proveedor) + $1,250.00 (ISD) = $26,250.00.",
        "Paso 4: Análisis tributario: El ISD por importación de materias primas e insumos productivos puede usarse como crédito tributario para el Formulario 101.",
        "Paso 5: Registro contable: Se cancela el pasivo del proveedor del exterior y se reconoce el gasto/crédito tributario de ISD."
      ],
      "accountingJournalEntry": [
        {
          "account": "2.1.01.02 Proveedores del Exterior por Pagar",
          "debe": 25000
        },
        {
          "account": "1.1.06.05 Crédito Tributario ISD 5% para Impuesto a la Renta",
          "debe": 1250
        },
        {
          "account": "1.1.01.02 Banco Internacional Cuenta Corriente USD",
          "haber": 26250
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 14: Configuración de Socio de Negocios RIMPE Emprendedor",
      "mission": "Crea un proveedor RIMPE Emprendedor en OCRD, efectúa una compra de $2,000 y aplica la retención exclusiva del 1% en la fuente.",
      "expectedResult": "El sistema debe liquidar exactamente $20.00 de retención de renta en lugar del 2% (bienes) o 3% (servicios) del régimen general."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Cuál es el porcentaje de retención de Impuesto a la Renta aplicable en compras de bienes y servicios a contribuyentes del Régimen RIMPE Emprendedor?",
        "options": [
          "1.00%",
          "1.75%",
          "2.00%",
          "10.00%"
        ],
        "correctIndex": 0,
        "explanation": "La Resolución NAC-DGERCGC26-00000009 (vigente desde marzo 2026) fija una retención en la fuente del 1% en compras a contribuyentes RIMPE Emprendedor (0% a Negocios Populares)."
      },
      {
        "id": 2,
        "question": "¿Qué tarifa general de Impuesto a la Salida de Divisas (ISD) aplica en Ecuador sobre transferencias y pagos monetarios al exterior?",
        "options": [
          "2.00%",
          "3.50%",
          "5.00%",
          "12.00%"
        ],
        "correctIndex": 2,
        "explanation": "La tarifa oficial general del ISD en Ecuador es del 5% sobre transferencias y giros al extranjero."
      },
      {
        "id": 3,
        "question": "¿Qué tratamiento de retención de IVA corresponde al comprar bienes a un contribuyente RIMPE Negocio Popular que emite Nota de Venta?",
        "options": [
          "Se le retiene el 100% del IVA.",
          "No se le retiene IVA porque sus notas de venta no desglosan ni causan IVA.",
          "Se le retiene el 30% del total.",
          "Se le cobra una tasa fija de $5."
        ],
        "correctIndex": 1,
        "explanation": "Los contribuyentes del régimen RIMPE Negocio Popular emiten notas de venta sin desglose de IVA; por tanto, no existe IVA que retener."
      }
    ],
    "relatedManualNumbers": [
      20,
      26
    ]
  },
  "nom-01": {
    "systemType": "HEIN_NOMINA",
    "windowTitle": "Registro y Liquidación de Novedades del Mes",
    "transactionCode": "HN-NOV-01",
    "screenSummary": "En esta pantalla se registran las novedades que alteran el rol de pagos mensual. Los conceptos se cargan por colaborador con su cantidad de horas. El sistema aplica automáticamente la fórmula legal del Código del Trabajo de Ecuador: Sueldo / 240 horas.",
    "classTranscript": {
      "instructor": "Abg. & Consultor HCM Marcelo Peña, Especialista Laboral Ecuador",
      "summary": "Aprende a liquidar horas suplementarias y extraordinarias en Nómina HCM. Analizaremos por qué el divisor legal es estrictamente 240 horas y cómo integrar marcaciones de relojes biométricos.",
      "keyPoints": [
        "El divisor legal en Ecuador es 240 horas (30 días comerciales × 8 horas diarias).",
        "Horas Suplementarias (+50%): hasta las 24h00 en días hábiles (máximo 4 al día, 12 a la semana).",
        "Horas Extraordinarias (+100%): fines de semana, feriados o de 24h00 a 06h00.",
        "Todas las horas extras forman materia gravada para el cálculo del IESS."
      ],
      "deepDiveText": "El artículo 55 del Código del Trabajo fija las reglas de recargo salarial. Un error común de consultores novatos es utilizar 160 horas (4 semanas de 40 horas) como divisor; esto incrementa el costo horario un 50% de forma ilegal y lesiona las finanzas de la empresa. Nómina HCM parametriza el divisor 240 como constante legal fija en la tabla de fórmulas."
    },
    "interactiveFields": [
      {
        "label": "Cédula / Colaborador",
        "value": "1718945201 - Juan Carlos Mora",
        "helperExplanation": "Identificador único del colaborador registrado ante el IESS.",
        "isMandatory": true
      },
      {
        "label": "Concepto Salarial",
        "value": "CONC-105: Horas Suplementarias (+50%)",
        "helperExplanation": "Aplica a las horas trabajadas fuera de la jornada regular hasta las 24h00.",
        "isMandatory": true
      },
      {
        "label": "Divisor Legal Horas",
        "value": "240 HORAS (Fijo por Ley)",
        "helperExplanation": "El Código de Trabajo de Ecuador fija 30 días comerciales de 8 horas = 240 horas.",
        "isMandatory": true
      },
      {
        "label": "Horas Reportadas",
        "value": "12.00 Horas",
        "helperExplanation": "Número de horas extraídas del reloj biométrico o aprobadas por el jefe.",
        "isMandatory": true
      },
      {
        "label": "Materia Gravada IESS",
        "value": "SI (Aporta 9.45% / 12.15%)",
        "helperExplanation": "Las horas extras integran la base imponible del IESS.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Cálculo de Horas Extras de Juan Mora",
      "stepByStepMath": [
        "Datos del Empleado: Sueldo mensual = $800.00. Horas suplementarias (50%) = 10h. Horas extraordinarias domingo (100%) = 4h.",
        "Paso 1: Valor Hora Ordinaria = $800.00 ÷ 240 horas = $3.3333 por hora.",
        "Paso 2: Valor Hora Suplementaria (+50%) = $3.3333 × 1.50 = $5.0000. Total 10h = 10 × $5.0000 = $50.00.",
        "Paso 3: Valor Hora Extraordinaria (+100%) = $3.3333 × 2.00 = $6.6666. Total 4h = 4 × $6.6666 = $26.67.",
        "Paso 4: Total Ganado en Horas Extras = $50.00 + $26.67 = $76.67.",
        "Paso 5: Materia Gravada IESS Total = $800.00 (Sueldo) + $76.67 (Extras) = $876.67.",
        "Paso 6: Aporte Personal IESS (9.45%) = $876.67 × 0.0945 = $82.85 (Descuento en rol).",
        "Paso 7: Aporte Patronal Empresa (12.15%) = $876.67 × 0.1215 = $106.52 (Gasto patronal).",
        "Paso 8: Salario Líquido a Pagar = $876.67 - $82.85 = $793.82 transferido a su cuenta bancaria."
      ],
      "accountingJournalEntry": [
        {
          "account": "5.1.02.01 Gasto Sueldos y Salarios",
          "debe": 800
        },
        {
          "account": "5.1.02.02 Gasto Horas Extras y Suplementarias",
          "debe": 76.67
        },
        {
          "account": "5.1.02.05 Gasto Aporte Patronal IESS (12.15%)",
          "debe": 106.52
        },
        {
          "account": "2.1.03.01 Cuentas por Pagar IESS Aportes (Personal + Patronal)",
          "haber": 189.37
        },
        {
          "account": "2.1.03.02 Sueldos por Pagar (Líquido a Empleado)",
          "haber": 793.82
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 15: Simulación de Novedad Salarial y Cálculo de Recargos",
      "mission": "Calcula las horas extras de un colaborador con sueldo de $960.00 que reportó 14 horas al 50% y 6 horas al 100% usando el divisor 240.",
      "expectedResult": "Valor hora = $4.00; Total horas extras = $84.00 (50%) + $48.00 (100%) = $132.00."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Cuál es el divisor de horas legal establecido por el Código del Trabajo en Ecuador para calcular el valor de la hora ordinaria?",
        "options": [
          "160 horas",
          "180 horas",
          "240 horas",
          "300 horas"
        ],
        "correctIndex": 2,
        "explanation": "El Código del Trabajo computa el mes laboral comercial en 30 días de 8 horas, fijando el divisor en exactamente 240 horas."
      },
      {
        "id": 2,
        "question": "¿Qué porcentaje de recargo legal aplica a las horas trabajadas en días sábados, domingos o feriados nacionales?",
        "options": [
          "25% de recargo",
          "50% de recargo",
          "100% de recargo (Horas Extraordinarias)",
          "No tienen recargo"
        ],
        "correctIndex": 2,
        "explanation": "El trabajo en días de descanso obligatorio o feriados se remunera con el 100% de recargo sobre el valor de la hora ordinaria."
      },
      {
        "id": 3,
        "question": "¿Forman las horas extras parte de la materia gravada para la aportación al IESS?",
        "options": [
          "No, están exentas de seguridad social.",
          "Sí, obligatoriamente integran la base imponible del IESS.",
          "Solo si el empleado lo solicita por escrito.",
          "Solo si superan los $100 al mes."
        ],
        "correctIndex": 1,
        "explanation": "La Ley de Seguridad Social estipula que todo ingreso salarial ordinario o extraordinario constituye materia gravada para aportes del IESS."
      }
    ],
    "relatedManualNumbers": [
      27,
      28,
      29
    ]
  },
  "nom-02": {
    "systemType": "HEIN_NOMINA",
    "windowTitle": "Seguridad Social IESS: Aportes, Fondos de Reserva y Planillas",
    "transactionCode": "HN-IESS-02",
    "screenSummary": "Motor de cálculo del Instituto Ecuatoriano de Seguridad Social: Liquidación del aporte personal (9.45%), aporte patronal (12.15% en sector privado incluyendo SECAP/IECE 0.5%), fondos de reserva (8.33%) y generación de planillas mecanizadas para el portal del IESS.",
    "classTranscript": {
      "instructor": "Abg. & Consultor HCM Marcelo Peña, Especialista Laboral Ecuador",
      "summary": "Aprende a liquidar los aportes a la seguridad social en Nómina HCM. Veremos las tasas vigentes, el derecho a Fondos de Reserva tras el primer año y cómo exportar el archivo plano para el portal del IESS sin glosas.",
      "keyPoints": [
        "Aporte Personal IESS: 9.45% retenido al colaborador.",
        "Aporte Patronal IESS: 12.15% (11.15% IESS + 0.5% SECAP + 0.5% IECE/SETEC) asumido por la empresa.",
        "Fondos de Reserva: 8.33% mensual a partir del mes 13 de relación laboral continua."
      ],
      "deepDiveText": "La tabla de cotizaciones en Nómina HCM parametriza las reglas del IESS. Si un colaborador cumple un año de servicio, el sistema dispara automáticamente el devengo de Fondos de Reserva (8.33%). El colaborador puede solicitar en el IESS mensualizar este valor en su rol o acumularlo en su cuenta individual del IESS; si acumula, la empresa transfiere el valor al IESS en la planilla mensual."
    },
    "interactiveFields": [
      {
        "label": "Tasa Aporte Personal IESS",
        "value": "9.45% (Descuento al trabajador)",
        "helperExplanation": "Porcentaje legal descontado del sueldo del empleado para cobertura médica y jubilación.",
        "isMandatory": true
      },
      {
        "label": "Tasa Aporte Patronal Total",
        "value": "12.15% (Costo laboral de la empresa)",
        "helperExplanation": "Incluye 11.15% IESS + 0.5% SECAP + 0.5% IECE/SETEC.",
        "isMandatory": true
      },
      {
        "label": "Fondos de Reserva (Art 196 CT)",
        "value": "8.33% (1 salario al año tras mes 12)",
        "helperExplanation": "Derecho que nace al cumplir un año de trabajo con el mismo empleador.",
        "isMandatory": true
      },
      {
        "label": "Preferencia Fondo de Reserva",
        "value": "Mensualizado en Rol de Pagos",
        "helperExplanation": "Determina si se paga en cuenta bancaria del empleado o se transfiere a la planilla del IESS.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Liquidación de IESS y Fondos de Reserva para Sueldo de $1,000",
      "stepByStepMath": [
        "Datos: Empleado con 2 años de antigüedad. Sueldo mensual = $1,000.00. Fondos de reserva mensualizados.",
        "Paso 1: Materia Gravada IESS = $1,000.00.",
        "Paso 2: Aporte Personal (9.45%) = $1,000.00 × 0.0945 = $94.50 (Descuento de su rol).",
        "Paso 3: Aporte Patronal (12.15%) = $1,000.00 × 0.1215 = $121.50 (Gasto patronal de la empresa).",
        "Paso 4: Fondo de Reserva (8.3333%) = $1,000.00 × 0.083333 = $83.33 (Se suma como ingreso si mensualiza).",
        "Paso 5: Total Ingresos = $1,000.00 (Sueldo) + $83.33 (Fondo Reserva) = $1,083.33.",
        "Paso 6: Total Egresos = $94.50 (Aporte IESS Personal).",
        "Paso 7: Líquido a Pagar en Cuenta = $1,083.33 - $94.50 = $988.83.",
        "Paso 8: Costo Laboral Total para la Empresa = $1,000 + $121.50 (Patronal) + $83.33 (Fondo) = $1,204.83."
      ],
      "accountingJournalEntry": [
        {
          "account": "5.1.02.01 Gasto Sueldos y Salarios",
          "debe": 1000
        },
        {
          "account": "5.1.02.05 Gasto Aporte Patronal IESS (12.15%)",
          "debe": 121.5
        },
        {
          "account": "5.1.02.06 Gasto Fondos de Reserva (8.33%)",
          "debe": 83.33
        },
        {
          "account": "2.1.03.01 IESS Aportes por Pagar (94.50 + 121.50)",
          "haber": 216
        },
        {
          "account": "2.1.03.02 Sueldos por Pagar Líquido Empleado",
          "haber": 988.83
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 16: Parametrización de Colaborador con Fondos de Reserva Acumulados",
      "mission": "Configura un colaborador que eligió acumular sus fondos de reserva en el IESS y verifica que los $83.33 vayan a la cuenta por pagar del IESS y no a su sueldo líquido.",
      "expectedResult": "El rol neto debe descontar el aporte personal sin pagar el fondo en efectivo."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Cuál es el porcentaje legal de aporte patronal al IESS en el sector privado ecuatoriano (incluyendo aportes a SECAP y SETEC)?",
        "options": [
          "9.45%",
          "11.15%",
          "12.15%",
          "15.00%"
        ],
        "correctIndex": 2,
        "explanation": "El aporte patronal total en el sector privado es del 12.15% (11.15% IESS + 0.5% SECAP + 0.5% SETEC/IECE)."
      },
      {
        "id": 2,
        "question": "¿A partir de qué mes de trabajo continuo con el mismo empleador adquiere el trabajador el derecho al Fondo de Reserva?",
        "options": [
          "Desde el primer día",
          "A partir del tercer mes",
          "A partir del mes 13 (tras cumplir 1 año)",
          "A partir de los 3 años"
        ],
        "correctIndex": 2,
        "explanation": "El artículo 196 del Código del Trabajo establece que el derecho a los fondos de reserva se genera a partir del mes 13 de labor continua."
      },
      {
        "id": 3,
        "question": "¿Qué porcentaje mensual del sueldo equivale el Fondo de Reserva?",
        "options": [
          "5.00%",
          "8.33% (un doceavo del salario anual)",
          "10.00%",
          "12.15%"
        ],
        "correctIndex": 1,
        "explanation": "El fondo de reserva equivale a un mes de sueldo por año, lo que representa el 8.3333% mensual (1/12)."
      }
    ],
    "relatedManualNumbers": [
      30,
      31,
      32
    ]
  },
  "nom-03": {
    "systemType": "HEIN_NOMINA",
    "windowTitle": "Beneficios Sociales: Décimo Tercero, Décimo Cuarto y Utilidades",
    "transactionCode": "HN-BENEF-03",
    "screenSummary": "Liquidación de beneficios de ley en Ecuador: Provisión y pago del Décimo Tercer Sueldo (Bono Navideño), Décimo Cuarto Sueldo (Bono Escolar con Salario Básico Unificado $482), y reparto del 15% de Utilidades (10% colaborador, 5% cargas familiares).",
    "classTranscript": {
      "instructor": "Abg. & Consultor HCM Marcelo Peña, Especialista Laboral Ecuador",
      "summary": "Aprende a provisionar y liquidar los beneficios sociales en Nómina HCM. Analizaremos los períodos de cálculo del 13ro y 14to sueldo por regiones (Costa e Insular vs Sierra y Amazonía) y la fórmula del 15% de utilidades.",
      "keyPoints": [
        "Décimo Tercero: Suma de lo ganado entre 01/Dic y 30/Nov dividido para 12 (Pago hasta 24 de diciembre).",
        "Décimo Cuarto: 1 SBU completo ($482.00 en 2026). Fechas de pago: 15 de marzo (Costa) o 15 de agosto (Sierra).",
        "Utilidades 15%: 10% distribuido por días laborados, 5% distribuido por cargas familiares legalmente acreditadas."
      ],
      "deepDiveText": "Los colaboradores pueden elegir mensualizar sus décimos o acumularlos para las fechas tradicionales de pago. Nómina HCM mantiene una doble vía: genera la provisión contable mensual del 8.33% para el balance general y, si el empleado mensualiza, le liquida el doceavo en el rol. Si acumula, acumula la provisión en el pasivo hasta la fecha de corte legal."
    },
    "interactiveFields": [
      {
        "label": "Salario Básico Unificado (SBU 2026)",
        "value": "$482.00 USD (Vigente)",
        "helperExplanation": "Valor base oficial fijado por el Ministerio del Trabajo para el Décimo Cuarto sueldo.",
        "isMandatory": true
      },
      {
        "label": "Régimen Décimo Cuarto Sueldo",
        "value": "Costa e Insular (Corte 01/Mar a 28/Feb)",
        "helperExplanation": "Define el calendario de liquidación escolar según la región geográfica.",
        "isMandatory": true
      },
      {
        "label": "Preferencia Décimo Tercero",
        "value": "Acumulado (Pago hasta 24 de Diciembre)",
        "helperExplanation": "Empleado prefiere recibir la totalidad acumulada en la víspera de Navidad.",
        "isMandatory": true
      },
      {
        "label": "Cargas Familiares Utilidades (5%)",
        "value": "3 Cargas Acreditadas (Cónyuge + 2 Hijos)",
        "helperExplanation": "Hijos menores de 18 años o con discapacidad y cónyuge/conviviente legal.",
        "isMandatory": false
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Provisión Mensual de Décimos y Reparto del 15% de Utilidades",
      "stepByStepMath": [
        "Datos: Sueldo = $900.00. Empleado con 1 año completo laborado y 2 cargas familiares.",
        "Paso 1: Provisión Mensual 13er Sueldo = $900.00 ÷ 12 = $75.00 mensual.",
        "Paso 2: Provisión Mensual 14to Sueldo = $482.00 (SBU) ÷ 12 = $40.17 mensual.",
        "Paso 3: Provisión Vacaciones = $900.00 ÷ 24 = $37.50 mensual.",
        "Paso 4: Total Provisiones Sociales Mensuales = $75.00 + $40.17 + $37.50 = $152.67 asumido por la empresa.",
        "Paso 5: Cálculo Utilidades: Empresa genera $100,000 en utilidades líquidas. 15% a repartir = $15,000 ($10,000 al 10% + $5,000 al 5%).",
        "Paso 6: Por sus 360 días laborados y 2 cargas, el empleado recibe $680.00 de utilidades en abril."
      ],
      "accountingJournalEntry": [
        {
          "account": "5.1.02.03 Gasto Provisión Décimo Tercer Sueldo",
          "debe": 75
        },
        {
          "account": "5.1.02.04 Gasto Provisión Décimo Cuarto Sueldo",
          "debe": 40.17
        },
        {
          "account": "5.1.02.07 Gasto Provisión Vacaciones",
          "debe": 37.5
        },
        {
          "account": "2.1.03.03 Pasivo Provisión 13er Sueldo por Pagar",
          "haber": 75
        },
        {
          "account": "2.1.03.04 Pasivo Provisión 14to Sueldo por Pagar",
          "haber": 40.17
        },
        {
          "account": "2.1.03.05 Pasivo Provisión Vacaciones por Pagar",
          "haber": 37.5
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 17: Simulación de Acumulación vs Mensualización de Décimos",
      "mission": "Configura a dos empleados idénticos con sueldo de $1,200: uno mensualiza décimos y el otro acumula. Compara el ingreso neto de su rol mensual.",
      "expectedResult": "El empleado que mensualiza recibe $100 (13ro) + $40.17 (14to) adicionales en su rol de pagos cada mes."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Cuál es el período legal de cómputo para el cálculo del Décimo Tercer Sueldo en Ecuador?",
        "options": [
          "Del 01 de enero al 31 de diciembre",
          "Del 01 de diciembre del año anterior al 30 de noviembre del año en curso",
          "Del 01 de agosto al 31 de julio",
          "Del 01 de marzo al 28 de febrero"
        ],
        "correctIndex": 1,
        "explanation": "El artículo 111 del Código del Trabajo fija el período de cómputo del 13er sueldo desde el 01 de diciembre hasta el 30 de noviembre."
      },
      {
        "id": 2,
        "question": "¿A cuánto equivale el valor del Décimo Cuarto Sueldo para un trabajador que laboró el año completo?",
        "options": [
          "A medio sueldo del trabajador",
          "A un Salario Básico Unificado (SBU) completo fijado por el MDT",
          "A $350 dólares fijos",
          "A un porcentaje de las ventas"
        ],
        "correctIndex": 1,
        "explanation": "El Décimo Cuarto Sueldo (bono escolar) equivale exactamente a un Salario Básico Unificado (SBU) vigente sin importar el cargo o sueldo."
      },
      {
        "id": 3,
        "question": "¿Cómo se divide el 15% de las utilidades que las empresas en Ecuador deben repartir a sus trabajadores?",
        "options": [
          "15% igual para todos",
          "10% para todos los trabajadores según días laborados y 5% en proporción a las cargas familiares acreditadas",
          "7.5% para obreros y 7.5% para directivos",
          "12% a trabajadores y 3% al sindicato"
        ],
        "correctIndex": 1,
        "explanation": "El artículo 97 del Código del Trabajo estipula que el 10% se divide por días trabajados y el 5% por cargas familiares (cónyuge e hijos menores/discapacitados)."
      }
    ],
    "relatedManualNumbers": [
      33,
      34,
      35
    ]
  },
  "nom-04": {
    "systemType": "HEIN_NOMINA",
    "windowTitle": "Tributación Laboral: Retención Impuesto a la Renta y Anexo RDEP",
    "transactionCode": "HN-TRIB-04",
    "screenSummary": "Cálculo de retención mensual de Impuesto a la Renta para trabajadores en relación de dependencia: Proyección de ingresos anuales, deducción del aporte personal IESS, aplicación de la rebaja por gastos personales con canasta básica y generación del Anexo RDEP y Formulario 107.",
    "classTranscript": {
      "instructor": "CPA Verónica Zambrano, Especialista NIIF y Consultora SAP B1",
      "summary": "Aprende a liquidar la retención de Impuesto a la Renta de empleados bajo relación de dependencia. Analizaremos la tabla progresiva del SRI, el formulario de gastos personales y la fórmula de rebaja basada en el número de cargas familiares.",
      "keyPoints": [
        "El aporte personal al IESS (9.45%) es ingreso no gravado y se resta de la base imponible anual.",
        "La rebaja de gastos personales depende del número de cargas familiares reportadas en el formulario del SRI.",
        "A fin de año se emite el Formulario 107 y se transmite el Anexo RDEP al SRI."
      ],
      "deepDiveText": "La reforma tributaria ecuatoriana sustituyó la deducción directa de gastos personales por una rebaja líquida en el impuesto causado calculada en función de canastas básicas familiares (CBF). Nómina HCM proyecta los ingresos anuales esperados del trabajador, aplica la tabla de escala progresiva del SRI y descuenta la cuota mensual de retención dividida para los meses restantes del año."
    },
    "interactiveFields": [
      {
        "label": "Ingresos Proyectados Anuales",
        "value": "$24,000.00 ($2,000 mensual × 12)",
        "helperExplanation": "Estimación de sueldos, comisiones y horas extras gravadas del año.",
        "isMandatory": true
      },
      {
        "label": "Deducción IESS Personal 9.45%",
        "value": "$2,268.00 (Exento de Renta)",
        "helperExplanation": "Los aportes obligatorios al IESS se restan de la base imponible.",
        "isMandatory": true
      },
      {
        "label": "Base Imponible Neta Anual",
        "value": "$21,732.00 ($24,000 - $2,268)",
        "helperExplanation": "Monto que se ubica en la tabla progresiva de Impuesto a la Renta del SRI.",
        "isMandatory": true
      },
      {
        "label": "Número de Cargas Familiares",
        "value": "2 Cargas (Aumenta la rebaja tributaria)",
        "helperExplanation": "Permite acceder a una mayor cantidad de canastas básicas de rebaja.",
        "isMandatory": false
      },
      {
        "label": "Retención Mensual Calculada",
        "value": "$34.50 por mes",
        "helperExplanation": "Valor retenido en el rol de pagos para entregar al SRI en el Formulario 103.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Proyección de Impuesto a la Renta para Sueldo de $2,000",
      "stepByStepMath": [
        "Datos: Empleado con sueldo de $2,000.00 mensual ($24,000 anual). 2 cargas familiares.",
        "Paso 1: Aporte IESS Personal anual = $24,000 × 0.0945 = $2,268.00.",
        "Paso 2: Base Imponible = $24,000.00 - $2,268.00 = $21,732.00.",
        "Paso 3: Ubicación en tabla SRI (Fracción básica $19,657 con impuesto de $645 y 12% sobre excedente).",
        "Paso 4: Impuesto sobre excedente = ($21,732.00 - $19,657.00) × 0.12 = $249.00.",
        "Paso 5: Impuesto a la Renta Causado Previo = $645.00 + $249.00 = $894.00.",
        "Paso 6: Rebaja por Gastos Personales con 2 cargas familiares = $480.00 de descuento.",
        "Paso 7: Impuesto Anual Definitivo a Retener = $894.00 - $480.00 = $414.00 al año.",
        "Paso 8: Retención mensual en el rol de pagos = $414.00 ÷ 12 meses = $34.50 al mes."
      ],
      "accountingJournalEntry": [
        {
          "account": "5.1.02.01 Gasto Sueldos y Salarios",
          "debe": 2000
        },
        {
          "account": "2.1.03.01 IESS Personal por Pagar (9.45%)",
          "haber": 189
        },
        {
          "account": "2.1.04.04 Retención Impuesto a la Renta Rol de Pagos (SRI)",
          "haber": 34.5
        },
        {
          "account": "2.1.03.02 Sueldos Líquidos por Pagar en Banco",
          "haber": 1776.5
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 18: Simulación de Formulario 107 y Reliquidación por Cargas",
      "mission": "Añade una tercera carga familiar a un empleado a mitad de año y recalcula la retención mensual en Nómina HCM para los meses restantes.",
      "expectedResult": "La retención mensual debe disminuir automáticamente por el incremento de la rebaja."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué componente del rol de pagos es deducible al 100% de los ingresos brutos para determinar la base gravable de Impuesto a la Renta de un empleado?",
        "options": [
          "El Aporte Personal al IESS (9.45%)",
          "El consumo del almuerzo",
          "Los préstamos quirografarios",
          "Las multas disciplinarias"
        ],
        "correctIndex": 0,
        "explanation": "La Ley Orgánica de Régimen Tributario Interno estipula que el aporte personal al IESS no constituye renta gravada."
      },
      {
        "id": 2,
        "question": "¿Qué anexo anual obligatorio deben generar las empresas para reportar al SRI todas las retenciones practicadas a sus trabajadores bajo relación de dependencia?",
        "options": [
          "Anexo ATS",
          "Anexo RDEP (Retenciones en la Fuente bajo Relación de Dependencia)",
          "Anexo ROT",
          "Anexo APS"
        ],
        "correctIndex": 1,
        "explanation": "El Anexo RDEP es el informe anual que consolida los ingresos, deducciones y retenciones de todos los colaboradores de la empresa."
      },
      {
        "id": 3,
        "question": "¿Qué documento oficial debe entregar el empleador al trabajador en enero para certificar sus retenciones de impuesto a la renta del año previo?",
        "options": [
          "Una carta simple de recomendación",
          "El Formulario 107 firmado",
          "El certificado de votación",
          "La copia del rol de diciembre"
        ],
        "correctIndex": 1,
        "explanation": "El Formulario 107 es el comprobante oficial de retenciones en la fuente de ingresos del trabajo bajo relación de dependencia."
      }
    ],
    "relatedManualNumbers": [
      36,
      37
    ]
  },
  "nom-05": {
    "systemType": "HEIN_NOMINA",
    "windowTitle": "Compliance MDT: Actas de Finiquito SUT e Indemnizaciones",
    "transactionCode": "HN-SUT-05",
    "screenSummary": "Desvinculación laboral y cumplimiento legal: Liquidación de haberes pendientes, indemnización por despido intempestivo (Art. 188 CT), bonificación por desahucio (Art. 185 CT) y generación del archivo para registro en el Sistema Único de Trabajo (SUT) del Ministerio del Trabajo.",
    "classTranscript": {
      "instructor": "Abg. & Consultor HCM Marcelo Peña, Especialista Laboral Ecuador",
      "summary": "Aprende a liquidar actas de finiquito sin contingencias legales. Revisaremos las causales de terminación de contrato, las fórmulas de desahucio y despido intempestivo y los plazos legales para registrar el finiquito en el SUT.",
      "keyPoints": [
        "Desahucio (Art. 185 CT): 25% de la última remuneración mensual por cada año de servicio completo.",
        "Despido Intempestivo (Art. 188 CT): De 1 a 3 años = 3 meses de remuneración; más de 3 años = 1 mes por cada año hasta un máximo de 25 meses.",
        "El plazo legal para legalizar el acta en el SUT y pagar al trabajador es de 15 días laborables."
      ],
      "deepDiveText": "La terminación de un contrato laboral en Ecuador exige precisión absoluta en el cálculo de la última remuneración completa (sueldo básico + horas extras habituales + comisiones). Nómina HCM calcula automáticamente los proporcionales de décimo tercero, décimo cuarto y vacaciones no gozadas y genera el archivo plano listo para importar en el portal SUT del Ministerio del Trabajo."
    },
    "interactiveFields": [
      {
        "label": "Causa de Desvinculación",
        "value": "Art. 188 Despido Intempestivo",
        "helperExplanation": "Causa legal que activa el pago de indemnizaciones completas.",
        "isMandatory": true
      },
      {
        "label": "Tiempo de Servicio",
        "value": "4 Años, 5 Meses, 12 Días",
        "helperExplanation": "La fracción de año se computa como año completo para despido intempestivo.",
        "isMandatory": true
      },
      {
        "label": "Última Remuneración Completa",
        "value": "$1,200.00 USD mensual",
        "helperExplanation": "Base de cálculo para indemnizaciones laborales.",
        "isMandatory": true
      },
      {
        "label": "Indemnización Despido (Art. 188)",
        "value": "$6,000.00 (5 años × $1,200.00)",
        "helperExplanation": "5 años computados (4 años + fracción como año entero).",
        "isMandatory": true
      },
      {
        "label": "Bonificación Desahucio (Art. 185)",
        "value": "$1,200.00 (4 años × 25% de $1,200 = $300 × 4)",
        "helperExplanation": "25% por cada año completo de servicio.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Liquidación de Finiquito por Despido Intempestivo",
      "stepByStepMath": [
        "Datos: Empleado con 4 años y 3 meses de servicio. Sueldo mensual = $1,200.00.",
        "Paso 1: Indemnización Despido Intempestivo: 4 años + fracción = 5 años. 5 × $1,200.00 = $6,000.00.",
        "Paso 2: Bonificación por Desahucio (25% por año completo): 4 años × (0.25 × $1,200.00) = 4 × $300.00 = $1,200.00.",
        "Paso 3: Vacaciones no gozadas pendientes (15 días) = $600.00.",
        "Paso 4: Proporcional Décimo Tercero (6 meses) = ($1,200 × 6) ÷ 12 = $600.00.",
        "Paso 5: Proporcional Décimo Cuarto (6 meses) = ($482 SBU × 6) ÷ 12 = $241.00.",
        "Paso 6: Total Liquidación Acta de Finiquito = $6,000 + $1,200 + $600 + $600 + $241 = $8,641.00.",
        "Paso 7: Tratamiento tributario: Las indemnizaciones por despido y desahucio están exentas de Impuesto a la Renta y de IESS."
      ],
      "accountingJournalEntry": [
        {
          "account": "5.1.02.08 Gasto Indemnizaciones Laborales (Despido)",
          "debe": 6000
        },
        {
          "account": "5.1.02.09 Gasto Bonificación Desahucio",
          "debe": 1200
        },
        {
          "account": "2.1.03.03 Provisión 13er Sueldo (Reversión)",
          "debe": 600
        },
        {
          "account": "2.1.03.04 Provisión 14to Sueldo (Reversión)",
          "debe": 241
        },
        {
          "account": "2.1.03.05 Provisión Vacaciones (Reversión)",
          "debe": 600
        },
        {
          "account": "1.1.01.02 Banco Cuenta Corriente (Pago Finiquito SUT)",
          "haber": 8641
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 19: Generación de Acta de Finiquito por Renuncia Voluntaria",
      "mission": "Liquida la salida de un colaborador que presentó renuncia voluntaria con 3 años de servicio y verifica que solo perciba desahucio y haberes proporcionales, sin indemnización del Art. 188.",
      "expectedResult": "El finiquito no debe incluir despido intempestivo y debe calcular exactamente el 25% por año."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿A cuánto equivale la bonificación por desahucio estipulada en el artículo 185 del Código del Trabajo de Ecuador?",
        "options": [
          "10% de la última remuneración",
          "25% del equivalente a la última remuneración mensual por cada año completo de servicio",
          "Un sueldo completo por año",
          "No existe el desahucio en Ecuador"
        ],
        "correctIndex": 1,
        "explanation": "El artículo 185 fija la bonificación por desahucio en el 25% de la última remuneración mensual por cada uno de los años de servicio prestados."
      },
      {
        "id": 2,
        "question": "Para el cálculo de la indemnización por despido intempestivo (Art. 188 CT), ¿cómo se computa la fracción de año trabajada?",
        "options": [
          "Se pierde la fracción.",
          "Se paga de forma proporcional en días.",
          "La fracción de un año se considerará como año completo.",
          "Solo se paga si supera los 11 meses."
        ],
        "correctIndex": 2,
        "explanation": "El artículo 188 establece taxativamente que la fracción de un año se considerará como año completo para el cálculo de la indemnización."
      },
      {
        "id": 3,
        "question": "¿Las indemnizaciones por despido intempestivo y bonificación por desahucio están gravadas con aporte al IESS o Impuesto a la Renta?",
        "options": [
          "Sí, gravan el 9.45% de IESS.",
          "No, están legalmente exentas de retención de IESS y de Impuesto a la Renta.",
          "Solo gravan Impuesto a la Renta.",
          "Solo si superan los $20,000."
        ],
        "correctIndex": 1,
        "explanation": "La legislación tributaria y de seguridad social declara las indemnizaciones por terminación laboral como ingresos exentos de IESS e Impuesto a la Renta."
      }
    ],
    "relatedManualNumbers": [
      38,
      39,
      40
    ]
  },
  "nom-06": {
    "systemType": "HEIN_NOMINA",
    "windowTitle": "Configuración Maestra: Conceptos, Promedios y Cierre Anual",
    "transactionCode": "HN-MAEST-06",
    "screenSummary": "Administración del motor salarial: Creación de conceptos salariales (devengos y deducciones), reglas de cálculo con variables acumuladas, promedios móviles de 12 meses para vacaciones y procedimiento de cierre contable anual.",
    "classTranscript": {
      "instructor": "Abg. & Consultor HCM Marcelo Peña, Especialista Laboral Ecuador",
      "summary": "Aprende a parametrizar el núcleo de Nómina HCM. Crearemos conceptos salariales personalizados, configuraremos las bases acumuladas para promedios de vacaciones y ejecutaremos el cierre de año fiscal.",
      "keyPoints": [
        "Cada concepto salarial define su comportamiento ante el IESS, SRI y Beneficios Sociales.",
        "Las vacaciones se liquidan sobre el promedio de lo ganado en las últimas 24 quincenas (12 meses).",
        "El cierre anual congela los acumulados y apertura los períodos del nuevo ejercicio."
      ],
      "deepDiveText": "La arquitectura de Nómina HCM descansa en una tabla de conceptos donde cada código tiene banderas booleanas: EsMateriaGravadaIESS, EsBaseRenta, EsBaseDecimoTercero, EsBaseUtilidades. Si creas una comisión por ventas y olvidas tildar EsMateriaGravadaIESS, la planilla del IESS saldrá con glosa de evasión."
    },
    "interactiveFields": [
      {
        "label": "Código de Concepto",
        "value": "DEV-204 Comisión por Cumplimiento de Metas",
        "helperExplanation": "Identificador único del nuevo rubro salarial en el catálogo.",
        "isMandatory": true
      },
      {
        "label": "Afectación IESS",
        "value": "SI (Grava aporte personal 9.45% y patronal 12.15%)",
        "helperExplanation": "Las comisiones forman parte del salario ordinario.",
        "isMandatory": true
      },
      {
        "label": "Afectación Décimo Tercero",
        "value": "SI (Suma para el promedio navideño)",
        "helperExplanation": "Incrementa el valor del 13er sueldo proporcional.",
        "isMandatory": true
      },
      {
        "label": "Afectación Impuesto a la Renta",
        "value": "SI (Ingreso tributable para retención en la fuente)",
        "helperExplanation": "Suma en la proyección anual de ingresos.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Liquidación de Vacaciones con Promedio de 12 Meses de Comisiones",
      "stepByStepMath": [
        "Escenario: Vendedor con sueldo base de $600.00 que acumuló $7,200.00 en comisiones variables durante el año.",
        "Paso 1: Total Ingresos Anuales Ganados = ($600 × 12) + $7,200 = $7,200 + $7,200 = $14,400.00.",
        "Paso 2: Valor Legal de 15 Días de Vacaciones (Veinticuatroava parte del total anual) = $14,400.00 ÷ 24 = $600.00.",
        "Paso 3: Si se liquidara solo con sueldo base, el empleado recibiría $300.00; el promedio garantiza sus $600.00 legales.",
        "Paso 4: Descuento IESS Personal de vacaciones (9.45%) = $600.00 × 0.0945 = $56.70.",
        "Paso 5: Líquido a Pagar por Vacaciones Gozadas = $600.00 - $56.70 = $543.30."
      ],
      "accountingJournalEntry": [
        {
          "account": "2.1.03.05 Pasivo Provisión de Vacaciones por Pagar",
          "debe": 600
        },
        {
          "account": "2.1.03.01 IESS Aportes por Pagar (9.45%)",
          "haber": 56.7
        },
        {
          "account": "1.1.01.02 Banco Cuenta Corriente (Pago Vacaciones)",
          "haber": 543.3
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 20: Creación de Rubro Salarial Exento (Bono de Movilización)",
      "mission": "Crea un concepto \"Subsidio de Movilización\" que no grave IESS ni Décimos según las excepciones del Art. 11 de la Ley de Seguridad Social.",
      "expectedResult": "El concepto debe sumarse al líquido sin engrosar la planilla de aportes al IESS."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Cómo se calcula legalmente el valor monetario correspondiente a los 15 días de vacaciones anuales de un trabajador en Ecuador?",
        "options": [
          "La mitad del sueldo básico sin comisiones",
          "La veinticuatroava parte (1/24) de todo lo percibido por el trabajador durante el año",
          "Un valor fijo de $200",
          "El promedio de los últimos 3 meses"
        ],
        "correctIndex": 1,
        "explanation": "El artículo 69 del Código del Trabajo fija el valor de las vacaciones en la veinticuatroava parte de lo percibido en el año completo."
      },
      {
        "id": 2,
        "question": "¿Qué rubros de la nómina están legalmente exentos de aportar al IESS según la Ley de Seguridad Social?",
        "options": [
          "Las comisiones de ventas",
          "Las horas extras",
          "Los viáticos justificados, subsidios de movilización y herramientas de trabajo",
          "Los sueldos básicos"
        ],
        "correctIndex": 2,
        "explanation": "La ley excluye de la materia gravada los viáticos comprobados, alimentación en casino y subsidios de movilización para el desempeño del cargo."
      },
      {
        "id": 3,
        "question": "¿Qué proceso en el sistema garantiza que los acumulados de ingresos del año se trasladen a los históricos sin borrarse?",
        "options": [
          "El formateo del disco",
          "El Cierre Anual de Nómina",
          "El cambio de contraseña del administrador",
          "La impresión del rol"
        ],
        "correctIndex": 1,
        "explanation": "El Cierre Anual traslada las tablas activas a tablas históricas de auditoría y reinicializa los acumuladores para el nuevo ejercicio fiscal."
      }
    ],
    "relatedManualNumbers": [
      41,
      42,
      43
    ]
  },
  "nom-07": {
    "systemType": "HEIN_NOMINA",
    "windowTitle": "Interfaz Contable Nómina ↔ SAP Business One (Service Layer)",
    "transactionCode": "HN-INT-07",
    "screenSummary": "Integración empresarial: Mapeo de conceptos salariales contra el plan de cuentas de SAP B1, distribución analítica por centros de costos multidimensionales y generación automática del asiento de diario vía REST Service Layer.",
    "classTranscript": {
      "instructor": "Ing. Christian Roldán, Especialista en Integración SRI & SAP B1",
      "summary": "Aprende a integrar Nómina HCM con el corazón financiero de SAP Business One. Configuraremos la matriz de contabilización, distribuiremos los costos de personal por departamentos y dispararemos el asiento contable mediante la Service Layer.",
      "keyPoints": [
        "La matriz de interfaz vincula cada concepto salarial con una cuenta contable de mayor (OACT).",
        "Los centros de costos permiten asignar el gasto a Administración, Ventas o Producción.",
        "La Service Layer de SAP B1 garantiza transacciones seguras con protocolo HTTPS y JSON."
      ],
      "deepDiveText": "El cierre de quincena o mes culmina con la contabilización del rol en SAP B1. Nómina HCM empaqueta los débitos de gastos y los créditos de pasivos en un payload JSON y lo envía al endpoint /JournalEntries de la Service Layer. Si el asiento no cuadra al centavo o una cuenta no existe en SAP, la Service Layer aborta la transacción manteniendo la consistencia de datos."
    },
    "interactiveFields": [
      {
        "label": "Endpoint de Conexión",
        "value": "https://sap-server.local:50000/b1s/v2/JournalEntries",
        "helperExplanation": "Servicio REST oficial de SAP Business One Service Layer.",
        "isMandatory": true
      },
      {
        "label": "Centro de Costo Dimensión 1",
        "value": "CC_ADM (Departamento Administrativo)",
        "helperExplanation": "Distribución analítica para el estado de resultados.",
        "isMandatory": true
      },
      {
        "label": "Centro de Costo Dimensión 2",
        "value": "CC_VTS (Fuerza Comercial y Ventas)",
        "helperExplanation": "Distribución para medir rentabilidad comercial.",
        "isMandatory": true
      },
      {
        "label": "Estado de Transmisión del Asiento",
        "value": "201 Created (Transacción OJDT #4892 generada en firme)",
        "helperExplanation": "Confirmación exitosa de la contabilización en SAP B1.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Asiento Contable Consolidado de Nómina de 50 Empleados",
      "stepByStepMath": [
        "Escenario: Nómina mensual total: Sueldos $40,000, Horas Extras $3,500, Aporte Patronal $5,286.75, Provisiones Sociales $7,250.00.",
        "Paso 1: Total Débitos Gastos de Personal = $40,000 + $3,500 + $5,286.75 + $7,250 = $56,036.75.",
        "Paso 2: Distribución por Centros de Costos: 40% Administración ($22,414.70), 60% Ventas y Operaciones ($33,622.05).",
        "Paso 3: Total Créditos Pasivos: IESS por Pagar ($9,400), Retención Renta ($1,200), Provisiones Décimos ($7,250), Líquido a Pagar ($38,186.75).",
        "Paso 4: Total Créditos = $9,400 + $1,200 + $7,250 + $38,186.75 = $56,036.75.",
        "Paso 5: Débitos ($56,036.75) = Créditos ($56,036.75). Asiento 100% balanceado en SAP B1."
      ],
      "accountingJournalEntry": [
        {
          "account": "5.1.02.01 Gastos Personal Admón (CC_ADM)",
          "debe": 22414.7
        },
        {
          "account": "5.2.02.01 Gastos Personal Ventas (CC_VTS)",
          "debe": 33622.05
        },
        {
          "account": "2.1.03.01 Cuentas por Pagar IESS Planilla",
          "haber": 9400
        },
        {
          "account": "2.1.04.04 Retenciones Renta Empleados SRI",
          "haber": 1200
        },
        {
          "account": "2.1.03.03 Pasivos Provisiones Sociales Acumuladas",
          "haber": 7250
        },
        {
          "account": "2.1.03.02 Sueldos Líquidos por Pagar en Banco",
          "haber": 38186.75
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 21: Mapeo de Matriz Contable y Validación de Payload JSON",
      "mission": "Configura la matriz de cuentas de Nómina HCM mapeando el concepto \"Bono de Producción\" a la cuenta 5.3.02.01 de Costo de Ventas y genera el payload JSON.",
      "expectedResult": "El validador de la Service Layer debe retornar código 201 Created con asiento asignado en SAP B1."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué tecnología de interfaz nativa utiliza SAP Business One versión HANA para recibir asientos contables desde sistemas externos como Nómina HCM?",
        "options": [
          "Conexión directa por ODBC a las tablas",
          "SAP Service Layer (API RESTful basada en OData)",
          "Archivos de texto en disquete",
          "Mensajes SMS"
        ],
        "correctIndex": 1,
        "explanation": "La Service Layer es la interfaz moderna de alta velocidad que provee SAP B1 para integraciones seguras con validación de reglas de negocio."
      },
      {
        "id": 2,
        "question": "¿Qué requisito contable indispensable exige SAP B1 para permitir registrar el asiento de nómina en la tabla OJDT?",
        "options": [
          "Que el asiento esté 100% cuadrado (Suma de Débitos = Suma de Créditos) y las cuentas imputables existan.",
          "Que el total de débitos sea mayor a los créditos.",
          "Que no se utilicen centros de costo.",
          "Que se contabilice solo en fin de año."
        ],
        "correctIndex": 0,
        "explanation": "El motor contable rechaza cualquier transacción donde exista una diferencia de balance o donde se intente imputar a una cuenta inexistente."
      },
      {
        "id": 3,
        "question": "¿Qué función cumplen los Centros de Costo en el asiento contable de nómina?",
        "options": [
          "Cambiar el nombre de los empleados.",
          "Distribuir los gastos de personal por área (Administración, Ventas, Planta) para análisis de rentabilidad gerencial.",
          "Calcular las horas extras de los sábados.",
          "Enviar correos al sindicato."
        ],
        "correctIndex": 1,
        "explanation": "Los centros de costo asignan la erogación salarial a la unidad organizativa que generó el gasto para estados financieros analíticos."
      }
    ],
    "relatedManualNumbers": [
      44,
      45,
      46
    ]
  },
  "hcm-01": {
    "systemType": "HEIN_NOMINA",
    "windowTitle": "Atracción del Talento: Flujo ATS con Screening de IA",
    "transactionCode": "HCM-ATS-01",
    "screenSummary": "Plataforma de reclutamiento corporativo: Publicación de vacantes, parsing inteligente de hojas de vida, screening algorítmico de competencias con IA y gestión del embudo de selección de candidatos.",
    "classTranscript": {
      "instructor": "MSc. Daniela Aguirre, Directora de Talento Humano & Consultora HCM",
      "summary": "Aprende a configurar el ATS de Gestión Humana. Automatizaremos el filtro de postulantes, compararemos perfiles contra el descriptor del cargo y vincularemos al candidato contratado directamente a la nómina.",
      "keyPoints": [
        "El descriptor del puesto fija los requisitos mínimos excluyentes (título, experiencia, software).",
        "El screening algorítmico rankea a los postulantes con un puntaje de compatibilidad porcentual.",
        "La contratación traslada los datos personales a la ficha del empleado sin doble digitación."
      ],
      "deepDiveText": "En medianas y grandes empresas, procesar cientos de hojas de vida por vacante consume semanas de tiempo improductivo. El módulo de Selección permite definir matrices de competencias y ponderaciones por puesto. Al aprobar la contratación, el sistema dispara el flujo de alta y aprovisiona el perfil en nómina."
    },
    "interactiveFields": [
      {
        "label": "Puesto Vacante",
        "value": "VAC-2026-084 Consultor Junior SAP B1",
        "helperExplanation": "Posición requerida por la Dirección de Tecnología.",
        "isMandatory": true
      },
      {
        "label": "Requisito Excluyente",
        "value": "Título Profesional en Sistemas o Contabilidad + Inglés B2",
        "helperExplanation": "Filtro inicial de descarte automático para postulantes.",
        "isMandatory": true
      },
      {
        "label": "Puntaje de Compatibilidad IA",
        "value": "92% de Afinidad Curricular",
        "helperExplanation": "Evaluación del currículo contra el perfil técnico del puesto.",
        "isMandatory": false
      },
      {
        "label": "Estado del Candidato",
        "value": "Aprobado para Contratación / Alta en Nómina",
        "helperExplanation": "Fase final del embudo de atracción.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Evaluación y Contratación de Ingeniero de Soporte",
      "stepByStepMath": [
        "Escenario: Selección entre 45 postulantes para cubrir vacante técnica con sueldo de $1,500.",
        "Paso 1: Filtro algorítmico elimina 32 postulantes por falta de experiencia mínima en ERP.",
        "Paso 2: Evaluación técnica de 13 candidatos: Prueba de conocimientos (40%), Entrevista por competencias (40%), Prueba psicométrica (20%).",
        "Paso 3: Candidato Finalista: Prueba técnica (95/100 = 38 pts), Entrevista (90/100 = 36 pts), Psicométrica (85/100 = 17 pts).",
        "Paso 4: Calificación Global Ponderada = 38 + 36 + 17 = 91.00 / 100 puntos.",
        "Paso 5: Contratación formal: Traslado de datos a Nómina HCM y alta en el sistema IESS con código de puesto oficial."
      ],
      "accountingJournalEntry": [
        {
          "account": "No genera asiento contable directo (Gestión de Talento)",
          "debe": 0
        },
        {
          "account": "Aprovisiona el legajo del colaborador para transacciones salariales",
          "haber": 0
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 22: Creación de Vacante y Configuración de Filtros Excluyentes",
      "mission": "Crea una vacante para \"Analista de Facturación SRI\", añade filtros de experiencia contable de 2 años y simula la recepción de 5 candidatos.",
      "expectedResult": "El sistema debe descartar a los candidatos sin experiencia y clasificar al mejor puntuado."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Cuál es la principal ventaja de un Applicant Tracking System (ATS) integrado con el sistema de nómina?",
        "options": [
          "Evita el pago de indemnizaciones.",
          "Permite que el candidato seleccionado pase a ser empleado activo en nómina sin redigitar sus datos personales.",
          "Elimina los contratos de trabajo.",
          "Reemplaza a los gerentes de área."
        ],
        "correctIndex": 1,
        "explanation": "La integración nativa traslada los datos personales, cuentas bancarias y cédula directamente a la nómina, reduciendo errores humanos."
      },
      {
        "id": 2,
        "question": "¿Qué define un descriptor de cargo en la arquitectura de Gestión Humana?",
        "options": [
          "La lista de compras de la oficina.",
          "Las competencias, responsabilidades, nivel educativo y perfil salarial de la posición.",
          "El modelo de auto que debe manejar el empleado.",
          "Las recetas del comedor."
        ],
        "correctIndex": 1,
        "explanation": "El descriptor de cargo estandariza los requisitos técnicos, conductuales y la jerarquía requerida para la posición."
      },
      {
        "id": 3,
        "question": "¿Qué evalúa una prueba psicométrica en un proceso de selección formal?",
        "options": [
          "La velocidad de digitación únicamente.",
          "Rasgos de personalidad, estabilidad emocional y estilos de comportamiento en el entorno laboral.",
          "El saldo de la cuenta bancaria.",
          "El peso corporal."
        ],
        "correctIndex": 1,
        "explanation": "Las pruebas psicométricas miden patrones de conducta, toma de decisiones y adaptabilidad cultural a la organización."
      }
    ],
    "relatedManualNumbers": [
      47,
      48
    ]
  },
  "hcm-02": {
    "systemType": "HEIN_NOMINA",
    "windowTitle": "Matrices de Evaluación de Desempeño 90°, 180°, 270° y 360°",
    "transactionCode": "HCM-EVAL-02",
    "screenSummary": "Medición del rendimiento laboral: Parametrización de cuestionarios por competencias y metas operativas (KPIs), configuración de evaluadores múltiples (jefe, pares, subordinados y clientes) y curvas de calibración.",
    "classTranscript": {
      "instructor": "MSc. Daniela Aguirre, Directora de Talento Humano & Consultora HCM",
      "summary": "Aprende a estructurar ciclos de evaluación del desempeño 360° en Gestión Humana. Definiremos escalas de calificación, asignaremos ponderaciones entre metas cuantitativas y competencias y analizaremos los desvíos evaluativos.",
      "keyPoints": [
        "Evaluación 90°: Solo el jefe inmediato evalúa.",
        "Evaluación 180°: Jefe inmediato + Autoevaluación del colaborador.",
        "Evaluación 360°: Jefe + Autoevaluación + Pares + Subordinados + Clientes internos.",
        "La ponderación típica es 60% Cumplimiento de Metas (KPIs) y 40% Competencias Conductuales."
      ],
      "deepDiveText": "La evaluación del desempeño alimenta las decisiones de bonificaciones, ascensos y planes de sucesión. Gestión Humana permite parametrizar escalas Likert y cuestionarios específicos por nivel jerárquico. Una vez concluido el ciclo de encuestas, el sistema consolida los resultados en un reporte de brechas de competencias."
    },
    "interactiveFields": [
      {
        "label": "Tipo de Evaluación Activa",
        "value": "Evaluación Multifuente 360 Grados",
        "helperExplanation": "Participan jefe, autoevaluación, 2 pares y 2 subordinados.",
        "isMandatory": true
      },
      {
        "label": "Ponderación Metas vs Competencias",
        "value": "60% Objetivos Cuantitativos / 40% Competencias",
        "helperExplanation": "Equilibrio entre resultados de negocio y conducta profesional.",
        "isMandatory": true
      },
      {
        "label": "Colaborador Evaluado",
        "value": "Ing. Andrea Morales - Jefe de Almacén",
        "helperExplanation": "Responsable de la custodia y despachos de inventario.",
        "isMandatory": true
      },
      {
        "label": "Puntaje Consolidado Obtenido",
        "value": "88.50 / 100 Puntos (Desempeño Sobresaliente)",
        "helperExplanation": "Resultado ponderado tras finalizar todas las evaluaciones.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Consolidación de Evaluación 360° para Jefe de Almacén",
      "stepByStepMath": [
        "Datos: 60% Metas (KPIs) y 40% Competencias Conductuales.",
        "Paso 1: Cumplimiento de Metas: Exactitud de Inventario (95%), Entregas a Tiempo (90%), Reducción de Mermas (85%). Promedio Metas = 90.00%.",
        "Paso 2: Aporte de Metas al puntaje final = 90.00 × 0.60 = 54.00 puntos.",
        "Paso 3: Evaluación de Competencias Multifuente (Liderazgo, Trabajo en Equipo, Comunicación):",
        "       - Jefe Inmediato (40%): 88 pts.",
        "       - Autoevaluación (10%): 92 pts.",
        "       - Pares del mismo nivel (25%): 84 pts.",
        "       - Subordinados (25%): 86 pts.",
        "Paso 4: Promedio Ponderado de Competencias = (88×0.40) + (92×0.10) + (84×0.25) + (86×0.25) = 35.2 + 9.2 + 21.0 + 21.5 = 86.90 pts.",
        "Paso 5: Aporte de Competencias al puntaje final = 86.90 × 0.40 = 34.76 puntos.",
        "Paso 6: Calificación Final Global = 54.00 + 34.76 = 88.76 / 100 puntos (Nivel Competente Superior)."
      ],
      "accountingJournalEntry": [
        {
          "account": "No genera asiento contable directo (Evaluación de Rendimiento)",
          "debe": 0
        },
        {
          "account": "Dispara la asignación de bonificaciones salariales en nómina",
          "haber": 0
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 23: Creación de Formulario de Evaluación con Escala de Competencias",
      "mission": "Diseña un cuestionario de evaluación 180° para el área de ventas con 3 KPIs cuantitativos y 2 competencias conductuales con escala de 1 a 5.",
      "expectedResult": "El sistema debe calcular el puntaje final ponderado sobre 100."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué evaluadores participan en un ciclo de evaluación de desempeño de 360 grados?",
        "options": [
          "Solo el gerente general",
          "Jefe inmediato, el propio colaborador (autoevaluación), pares del mismo nivel y subordinados a su cargo",
          "Solo los clientes externos",
          "El sindicato de trabajadores"
        ],
        "correctIndex": 1,
        "explanation": "La evaluación 360° integra una visión holística: supervisores, autopercepción, compañeros de equipo y colaboradores subordinados."
      },
      {
        "id": 2,
        "question": "¿Por qué se recomienda separar la evaluación en Objetivos Cuantitativos (KPIs) y Competencias Conductuales?",
        "options": [
          "Para que el examen sea el doble de largo.",
          "Porque evalúa tanto los resultados tangibles de negocio (el qué) como la forma de trabajar y liderar (el cómo).",
          "Porque lo exige el Ministerio del Trabajo.",
          "Para descontar días de sueldo."
        ],
        "correctIndex": 1,
        "explanation": "Un colaborador puede cumplir metas numéricas destruyendo el clima laboral; balancear metas y competencias fomenta un liderazgo sostenible."
      },
      {
        "id": 3,
        "question": "¿Qué es una sesión de calibración en la gestión del desempeño?",
        "options": [
          "La reparación de los relojes biométricos.",
          "Una reunión de líderes para estandarizar criterios y evitar que jefes muy indulgentes o muy duros distorsionen las notas.",
          "La revisión de los estados de cuenta bancarios.",
          "El pago de los sueldos en efectivo."
        ],
        "correctIndex": 1,
        "explanation": "La calibración armoniza las curvas de calificación de diferentes áreas para asegurar justicia y equidad interna."
      }
    ],
    "relatedManualNumbers": [
      49,
      50
    ]
  },
  "hcm-03": {
    "systemType": "HEIN_NOMINA",
    "windowTitle": "Analítica del Talento: Calibración y Mapeo en la Matriz Nine Box",
    "transactionCode": "HCM-9BOX-03",
    "screenSummary": "Mapeo estratégico del capital humano: Ubicación visual de colaboradores en la cuadrícula de 9 cajas cruzando Desempeño Actual (eje X) contra Potencial de Crecimiento Futuro (eje Y) para identificar sucesores y líderes clave.",
    "classTranscript": {
      "instructor": "MSc. Daniela Aguirre, Directora de Talento Humano & Consultora HCM",
      "summary": "Aprende a mapear el talento corporativo en la Matriz Nine Box. Analizaremos los 9 cuadrantes, desde los Talentos Top (Future Leaders) hasta los Enigmas y colaboradores con bajo desempeño que requieren planes de acción.",
      "keyPoints": [
        "Eje Horizontal (X): Desempeño demostrado (Bajo, Medio, Alto).",
        "Eje Vertical (Y): Potencial de aprendizaje y liderazgo futuro (Bajo, Medio, Alto).",
        "Cuadrante 1A (Top Right): Alto Desempeño / Alto Potencial (Las \"Estrellas\" de la compañía).",
        "La matriz guía la asignación de becas, bonos de retención y planes de sucesión para cargos críticos."
      ],
      "deepDiveText": "La Matriz Nine-Box desarrollada originalmente por General Electric y McKinsey es el estándar global para la gestión del talento. Gestión Humana cruza automáticamente el resultado de la evaluación del desempeño con los comités de potencial, ubicando a cada colaborador en la cuadrícula visual para alimentar los planes de carrera."
    },
    "interactiveFields": [
      {
        "label": "Colaborador Mapeado",
        "value": "Ing. Carlos Medina - Especialista SAP B1",
        "helperExplanation": "Profesional evaluado en el comité de talento anual.",
        "isMandatory": true
      },
      {
        "label": "Nivel de Desempeño (Eje X)",
        "value": "Alto (Puntaje Evaluación: 94/100)",
        "helperExplanation": "Consistente entrega de resultados y metas de negocio.",
        "isMandatory": true
      },
      {
        "label": "Nivel de Potencial (Eje Y)",
        "value": "Alto (Capacidad de asumir gerencia en 12 meses)",
        "helperExplanation": "Agilidad de aprendizaje, visión estratégica y habilidades directivas.",
        "isMandatory": true
      },
      {
        "label": "Cuadrante Asignado",
        "value": "Cuadrante 1A: Alto Potencial / Alto Desempeño (Top Talent)",
        "helperExplanation": "Sujeto prioritario para plan de sucesión y retención clave.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Calibración y Mapeo de 30 Profesionales en la Matriz 9-Box",
      "stepByStepMath": [
        "Escenario: Comité de Talento analiza 30 profesionales de tecnología para sucesión de jefaturas.",
        "Paso 1: Cuadrante 1A (Top Talent - Alto/Alto): 3 profesionales identificados (10% del equipo). Plan: Mentoría ejecutiva y bono de retención.",
        "Paso 2: Cuadrante 1B/2A (Futuros Líderes / Especialistas Clave): 12 profesionales (40% del equipo). Plan: Proyectos transversales.",
        "Paso 3: Cuadrante 2B (Rendimiento Sólido Medio/Medio): 10 profesionales (33% del equipo). Plan: Capacitación técnica continua.",
        "Paso 4: Cuadrante 3C (Bajo Desempeño / Bajo Potencial): 2 colaboradores (7% del equipo). Plan de Mejora de Rendimiento (PIP) a 90 días.",
        "Paso 5: Resultado: Plan de sucesión cubierto al 100% para las 4 gerencias críticas de la compañía."
      ],
      "accountingJournalEntry": [
        {
          "account": "No genera asiento contable directo (Analítica de Sucesión)",
          "debe": 0
        },
        {
          "account": "Presupuesta fondos de inversión en capacitación y bonos de retención",
          "haber": 0
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 24: Calibración de Cuadrantes en la Matriz Nine Box",
      "mission": "Toma 5 perfiles con diferentes puntuaciones de desempeño y potencial, asígnalos en la matriz 9-Box y define una acción de desarrollo para cada uno.",
      "expectedResult": "El sistema debe generar el mapa gráfico de distribución de talento."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué dos dimensiones fundamentales se cruzan en la Matriz Nine Box para clasificar el talento humano?",
        "options": [
          "Edad del trabajador y salario mensual",
          "Desempeño demostrado actual y Potencial de crecimiento futuro",
          "Horas extras trabajadas y días de vacaciones",
          "Nivel de colesterol y presión arterial"
        ],
        "correctIndex": 1,
        "explanation": "La Matriz Nine Box cruza en sus ejes cartesianos el desempeño actual (resultados presentes) contra el potencial futuro (capacidad de asumir mayores retos)."
      },
      {
        "id": 2,
        "question": "¿Qué estrategia de recursos humanos corresponde aplicar a un colaborador clasificado en el cuadrante de Alto Potencial y Alto Desempeño (Top Talent)?",
        "options": [
          "Despedirlo intempestivamente.",
          "Planes de retención, asignación de proyectos estratégicos de alto impacto y preparación como sucesor de posiciones clave.",
          "Reducirle el salario a la mitad.",
          "Trasladarlo a tareas operativas repetitivas."
        ],
        "correctIndex": 1,
        "explanation": "Los top talents representan el futuro de la organización y deben recibir programas acelerados de desarrollo y planes de retención."
      },
      {
        "id": 3,
        "question": "¿Cuál es la acción recomendada para un colaborador situado en el cuadrante de Bajo Desempeño y Bajo Potencial?",
        "options": [
          "Ascenderlo a vicepresidente inmediatamente.",
          "Establecer un Plan de Mejora del Rendimiento (PIP) con metas claras a 60-90 días o considerar su desvinculación formal.",
          "Ignorar la situación por 5 años.",
          "Aumentarle el límite de crédito."
        ],
        "correctIndex": 1,
        "explanation": "Se debe otorgar un plan de mejora con retroalimentación formal; si no se observan avances, se procede a la desvinculación."
      }
    ],
    "relatedManualNumbers": [
      51,
      52
    ]
  },
  "hcm-04": {
    "systemType": "HEIN_NOMINA",
    "windowTitle": "Planes de Desarrollo Individual (PDI) y Alineación con OKRs",
    "transactionCode": "HCM-PDI-04",
    "screenSummary": "Crecimiento profesional y gestión por objetivos: Creación de planes de desarrollo individual (PDI), definición de acciones formativas y alineación de objetivos individuales con los OKRs estratégicos de la compañía.",
    "classTranscript": {
      "instructor": "MSc. Daniela Aguirre, Directora de Talento Humano & Consultora HCM",
      "summary": "Aprende a estructurar Planes de Desarrollo Individual basados en la metodología 70-20-10. Vincularemos las brechas de competencias detectadas en las evaluaciones con acciones de aprendizaje experiencial y seguimiento de OKRs.",
      "keyPoints": [
        "Modelo 70-20-10: 70% Experiencia práctica en el puesto, 20% Mentoría y feedback, 10% Cursos formales.",
        "Los OKRs (Objectives and Key Results) conectan la estrategia del negocio con metas medibles trimestrales.",
        "El PDI formaliza el compromiso mutuo entre colaborador y líder para el crecimiento profesional."
      ],
      "deepDiveText": "La capacitación aislada sin aplicación práctica tiene una retención menor al 15%. Gestión Humana estructura el PDI alrededor de hitos de ejecución en proyectos reales de la empresa. Cada objetivo individual se vincula jerárquicamente a los Key Results corporativos, asegurando que el desarrollo del empleado impulse directamente el valor del negocio."
    },
    "interactiveFields": [
      {
        "label": "Objetivo Estratégico Alineado (OKR)",
        "value": "KR-2: Reducir en 30% los tiempos de facturación electrónica",
        "helperExplanation": "Meta corporativa compartida por el equipo de tecnología.",
        "isMandatory": true
      },
      {
        "label": "Brecha de Competencia a Cerrar",
        "value": "Optimización de consultas SQL en base de datos SAP HANA",
        "helperExplanation": "Habilidad técnica prioritaria identificada en la evaluación.",
        "isMandatory": true
      },
      {
        "label": "Acción 70% (Práctica / On the job)",
        "value": "Liderar la refactorización de 5 vistas de base de datos críticas",
        "helperExplanation": "Experiencia directa resolviendo problemas reales de la empresa.",
        "isMandatory": true
      },
      {
        "label": "Acción 20% (Mentoría)",
        "value": "Sesiones quincenales de code-review con el Arquitecto de Software",
        "helperExplanation": "Acompañamiento y retroalimentación de un profesional senior.",
        "isMandatory": false
      },
      {
        "label": "Acción 10% (Formación Formal)",
        "value": "Certificación Oficial SAP Certified Technology Associate",
        "helperExplanation": "Curso estructurado en academia especializada.",
        "isMandatory": false
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Estructuración y Seguimiento de PDI Trimestral",
      "stepByStepMath": [
        "Escenario: PDI a 90 días para Consultor Junior enfocado en acelerar despliegue de módulos.",
        "Paso 1: Diagnóstico: Brecha de 20 puntos en conocimiento de la Service Layer de SAP B1.",
        "Paso 2: Formulación de 3 Key Results trimestrales: Construir 2 APIs, completar 10 horas de sandbox y aprobar examen técnico.",
        "Paso 3: Mes 1: Finalización del curso y laboratorio de APIs (Cumplimiento 100%).",
        "Paso 4: Mes 2: Despliegue de la primera interfaz de nómina en ambiente de pruebas (Cumplimiento 100%).",
        "Paso 5: Mes 3: Puesta en producción de la integración con 0 caídas (Cumplimiento 100%).",
        "Paso 6: Cierre del PDI: Brecha cerrada al 100% y evaluación técnica actualizada a 95 puntos."
      ],
      "accountingJournalEntry": [
        {
          "account": "5.1.02.10 Gasto Capacitación y Desarrollo del Personal",
          "debe": 850
        },
        {
          "account": "1.1.01.02 Banco Cuenta Corriente (Pago Certificación Oficial)",
          "haber": 850
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 25: Diseño de Plan de Desarrollo Individual bajo Metodología 70-20-10",
      "mission": "Crea un PDI para un analista de nómina con 1 acción práctica (70%), 1 acción de mentoría (20%) y 1 curso de legislación laboral (10%).",
      "expectedResult": "El sistema debe calcular las fechas límite y habilitar el panel de seguimiento de avances."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "Bajo el modelo de aprendizaje profesional 70-20-10, ¿de dónde proviene el 70% del aprendizaje más efectivo?",
        "options": [
          "De leer libros teóricos",
          "De la experiencia práctica resolviendo retos y proyectos en el puesto de trabajo",
          "De memorizar conceptos de internet",
          "De asistir a congresos"
        ],
        "correctIndex": 1,
        "explanation": "El modelo 70-20-10 establece que el 70% del aprendizaje se consolida mediante la práctica directa y la resolución de desafíos reales."
      },
      {
        "id": 2,
        "question": "¿Cuál es la característica distintiva de la metodología OKR (Objectives and Key Results)?",
        "options": [
          "Fija metas numéricas trimestrales ambiciosas, medibles y transparentes para toda la organización.",
          "Oculta las metas a los trabajadores.",
          "Solo evalúa la puntualidad al llegar.",
          "Se revisa una vez cada 10 años."
        ],
        "correctIndex": 0,
        "explanation": "Los OKRs establecen objetivos cualitativos acompañados de resultados clave cuantificables con ciclos de seguimiento ágiles (generalmente trimestrales)."
      },
      {
        "id": 3,
        "question": "¿Cuál es el propósito principal de un Plan de Desarrollo Individual (PDI)?",
        "options": [
          "Justificar una rebaja salarial.",
          "Cerrar brechas específicas de competencias y preparar al colaborador para asumir mayores responsabilidades profesionales.",
          "Controlar el uso del internet en el trabajo.",
          "Asignar horas extras obligatorias."
        ],
        "correctIndex": 1,
        "explanation": "El PDI es un plan de acción estructurado para potenciar fortalezas y cerrar debilidades de cara al crecimiento del empleado y de la empresa."
      }
    ],
    "relatedManualNumbers": [
      53,
      54
    ]
  },
  "hcm-05": {
    "systemType": "HEIN_NOMINA",
    "windowTitle": "Business Intelligence de RRHH: Rotación, Ausentismo y Pasivos",
    "transactionCode": "HCM-BI-05",
    "screenSummary": "Analítica avanzada de recursos humanos: Cuadros de mando ejecutivos con tasa de rotación (turnover), índice de ausentismo laboral (horas perdidas), pirámide demográfica y proyección de pasivos laborales actuariales.",
    "classTranscript": {
      "instructor": "MSc. Daniela Aguirre, Directora de Talento Humano & Consultora HCM",
      "summary": "Aprende a tomar decisiones estratégicas basadas en métricas de personas (People Analytics). Calcularemos la tasa de rotación voluntaria e involuntaria, analizaremos el costo del ausentismo y proyectaremos los pasivos laborales en balances.",
      "keyPoints": [
        "Tasa de Rotación = (Bajas en el período ÷ Promedio de empleados) × 100.",
        "El ausentismo no programado tiene un costo oculto del 15% al 20% de la masa salarial.",
        "Los pasivos laborales por jubilación patronal y desahucio deben respaldarse con estudios actuariales según NIC 19."
      ],
      "deepDiveText": "La dirección de recursos humanos moderna habla el idioma financiero del Directorio. Gestión Humana extrae los datos de asistencia, nómina y legajos para alimentar tableros analíticos en tiempo real. Esto permite identificar áreas con alta rotación antes de que se conviertan en crisis operativas y mantener las provisiones contables exactamente alineadas a la norma NIIF."
    },
    "interactiveFields": [
      {
        "label": "Tasa de Rotación Mensual (Turnover)",
        "value": "1.85% (Dentro del rango saludable < 3%)",
        "helperExplanation": "Porcentaje de colaboradores que salieron de la empresa en el mes.",
        "isMandatory": true
      },
      {
        "label": "Índice de Ausentismo Laboral",
        "value": "2.10% de horas productivas perdidas",
        "helperExplanation": "Permisos médicos, faltas injustificadas y calamidades domésticas.",
        "isMandatory": true
      },
      {
        "label": "Pasivo Actuarial Proyectado (NIC 19)",
        "value": "$345,800.00 (Jubilación Patronal y Desahucio)",
        "helperExplanation": "Obligación a largo plazo calculada por actuario calificado.",
        "isMandatory": true
      },
      {
        "label": "Costo Promedio por Contratación",
        "value": "$650.00 por posición cubierta",
        "helperExplanation": "Gastos de publicación, pruebas y horas de entrevistas.",
        "isMandatory": false
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Cálculo de Rotación Anual y Costo del Ausentismo",
      "stepByStepMath": [
        "Datos: Empresa con promedio de 250 empleados en el año. Se registraron 20 renuncias y 10 despidos. Horas laborables teóricas = 2,000h por persona.",
        "Paso 1: Total Bajas en el año = 20 + 10 = 30 bajas.",
        "Paso 2: Tasa de Rotación Global = (30 bajas ÷ 250 empleados promedio) × 100 = 12.00% anual.",
        "Paso 3: Análisis de Rotación Voluntaria = (20 renuncias ÷ 250) × 100 = 8.00% (Fuga de talento a investigar).",
        "Paso 4: Ausentismo: Se registraron 1,200 horas de ausencia no justificada durante el año.",
        "Paso 5: Costo de Hora Promedio = $6.50. Costo Directo del Ausentismo = 1,200 × $6.50 = $7,800.00.",
        "Paso 6: Costo Indirecto (reemplazos con horas extras y retrasos) estimado en 1.5× = $11,700.00.",
        "Paso 7: Impacto Económico Total = $7,800.00 + $11,700.00 = $19,500.00 anuales a mitigar."
      ],
      "accountingJournalEntry": [
        {
          "account": "5.1.02.11 Gasto Estudio Actuarial y Provisión NIC 19",
          "debe": 28500
        },
        {
          "account": "2.2.01.01 Provisión Jubilación Patronal a Largo Plazo",
          "haber": 28500
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 26: Análisis de Rotación por Departamento y Proyección de Pasivos",
      "mission": "Calcula la tasa de rotación del área de ventas (8 bajas sobre 40 empleados) y compárala contra administración (1 baja sobre 30 empleados).",
      "expectedResult": "Ventas presenta un 20% de rotación alertando la necesidad de revisar comisiones y clima laboral."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Cómo se calcula la tasa de rotación de personal (Turnover) en un período determinado?",
        "options": [
          "Dividiendo el número de colaboradores desvinculados para el promedio de empleados y multiplicando por 100.",
          "Sumando los sueldos de los trabajadores.",
          "Multiplicando los días de vacaciones por las horas extras.",
          "Restando las ventas de los costos."
        ],
        "correctIndex": 0,
        "explanation": "La fórmula estándar es: (Total de bajas ÷ Dotación promedio) × 100 para obtener el porcentaje de rotación."
      },
      {
        "id": 2,
        "question": "Bajo la Norma Internacional de Contabilidad NIC 19, ¿qué pasivo laboral a largo plazo debe calcularse con estudio actuarial en Ecuador?",
        "options": [
          "El décimo tercer sueldo",
          "La Jubilación Patronal y el Desahucio",
          "El fondo de reserva mensual",
          "El pago del almuerzo"
        ],
        "correctIndex": 1,
        "explanation": "La NIC 19 exige valorar actuarialmente las obligaciones futuras por jubilación patronal (más de 25 años de servicio) y desahucio."
      },
      {
        "id": 3,
        "question": "¿Qué mide el People Analytics en la gestión moderna de recursos humanos?",
        "options": [
          "La marca de las computadoras de la empresa.",
          "El uso de datos cuantitativos y análisis estadístico para optimizar decisiones sobre el talento humano y el negocio.",
          "El número de cafés consumidos.",
          "La temperatura del aire acondicionado."
        ],
        "correctIndex": 1,
        "explanation": "People Analytics utiliza modelos de datos para predecir rotación, optimizar productividad y alinear la estrategia de personas con los resultados financieros."
      }
    ],
    "relatedManualNumbers": [
      55,
      56
    ]
  },
  "vert-01": {
    "systemType": "SAP_B1",
    "windowTitle": "Vertical Bananera: Liquidación a Productores y Embarque",
    "transactionCode": "BAN-EXP-01",
    "screenSummary": "Control de la fruta desde la finca hasta el puerto. Valida que el pago a los productores cumpla con el Precio Mínimo de Sustentación fijado por el Ministerio de Agricultura y añade fletes navieros al costo final de exportación.",
    "classTranscript": {
      "instructor": "Ing. Agroindustrial Roberto Seminario, Consultor Agroexportador SAP B1",
      "summary": "Aprende a operar la vertical bananera en SAP B1. Veremos la liquidación del Precio Mínimo de Sustentación ($6.85), el impuesto a la renta único agropecuario (1.50%), la trazabilidad GlobalGAP y el costeo FOB en puerto.",
      "keyPoints": [
        "Precio Mínimo de Sustentación oficial fijado por el MAG: $6.85 por caja 22XU.",
        "Retención en la fuente de Impuesto a la Renta Único para el sector bananero: 1.50%.",
        "Trazabilidad obligatoria: Registro de código de finca y certificación GlobalGAP para exportar a la UE."
      ],
      "deepDiveText": "La exportación de banano en Ecuador está fuertemente regulada por el Sistema UNIBANANO del Ministerio de Agricultura. Si el ERP permite registrar una liquidación a un precio inferior a $6.85 por caja, la exportadora comete infracción sancionada con multas severas y suspensión del cupo de exportación. SAP B1 valida automáticamente el precio mínimo y genera el comprobante de retención y la guía de remisión del contenedor."
    },
    "interactiveFields": [
      {
        "label": "Cajas Recibidas en Empacadora",
        "value": "5,000 Cajas 22XU",
        "helperExplanation": "Total de cajas empacadas que cumplieron los estándares de calibre y sanidad vegetal.",
        "isMandatory": true
      },
      {
        "label": "Precio Mínimo de Sustentación",
        "value": "$6.85 por Caja (Oficial)",
        "helperExplanation": "Precio legal de ley en Ecuador. Si el ERP permite pagar menos de $6.85, la empresa es multada por el MAG.",
        "isMandatory": true
      },
      {
        "label": "Certificación de Trazabilidad",
        "value": "GlobalGAP / Rainforest Alliance",
        "helperExplanation": "Código de finca exigido por los supermercados europeos para autorizar el desembarque en destino.",
        "isMandatory": true
      },
      {
        "label": "Costos de Exportación (FOB)",
        "value": "Cartón ($1.40) + Flete Naviero ($3.50)",
        "helperExplanation": "Gastos adicionales incorporados al valor de la fruta para fijar el costo real FOB en puerto de Guayaquil.",
        "isMandatory": false
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Liquidación de Embarque de 5,000 Cajas de Banano",
      "stepByStepMath": [
        "Escenario: Liquidación a productor independiente por 5,000 cajas de banano premium enviadas a Róterdam.",
        "Paso 1: Pago al Productor (Precio Mínimo Oficial) = 5,000 cajas × $6.85 = $34,250.00.",
        "Paso 2: Retención en la Fuente Banano (1.50% impuesto a la renta único) = $34,250.00 × 0.015 = $513.75.",
        "Paso 3: Pago Neto al Productor Bananero = $34,250.00 - $513.75 = $33,736.25.",
        "Paso 4: Insumos de Empaque (Cartón $1.40 + Funda $0.30) = 5,000 × $1.70 = $8,500.00.",
        "Paso 5: Flete y Logística Naviera = 5,000 × $3.50 = $17,500.00.",
        "Paso 6: Costo FOB Total del Contenedor = $34,250.00 + $8,500.00 + $17,500.00 = $60,250.00 ($12.05 por caja exportada)."
      ],
      "accountingJournalEntry": [
        {
          "account": "5.1.04.01 Costo de Fruta Adquirida (Banano)",
          "debe": 34250
        },
        {
          "account": "5.1.04.02 Materiales de Empaque (Cartón y Plásticos)",
          "debe": 8500
        },
        {
          "account": "5.1.04.03 Fletes Marítimos y Puerto",
          "debe": 17500
        },
        {
          "account": "2.1.04.03 Retención en la Fuente Banano por Pagar",
          "haber": 513.75
        },
        {
          "account": "2.1.01.02 Productores Agrícolas por Pagar (Líquido)",
          "haber": 33736.25
        },
        {
          "account": "2.1.01.03 Proveedores de Logística y Empaque",
          "haber": 26000
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 27: Liquidación de Productor Bananero y Validación de Precio Mínimo",
      "mission": "Liquida 3,000 cajas de banano al precio oficial de $6.85, aplica la retención única del 1.50% y genera el registro en cuenta corriente del productor.",
      "expectedResult": "El sistema debe calcular $20,550.00 brutos, retener $308.25 y transferir $20,241.75 netos."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué organismo estatal en Ecuador fija periódicamente el Precio Mínimo de Sustentación de la caja de banano para exportación?",
        "options": [
          "El Ministerio de Educación",
          "El Ministerio de Agricultura y Ganadería (MAG)",
          "El Banco Central de Reserva de EE.UU.",
          "La Policía Nacional"
        ],
        "correctIndex": 1,
        "explanation": "El Ministerio de Agricultura y Ganadería (MAG) fija y regula el precio oficial obligatorio que se debe pagar a los productores."
      },
      {
        "id": 2,
        "question": "¿Qué norma determina la retención en la fuente aplicable a las compras locales de banano a productores en Ecuador?",
        "options": [
          "La tabla general de la Resolución NAC-DGERCGC26-00000009 (2% como bienes muebles).",
          "La Ley de Régimen Tributario Interno y su Reglamento, bajo el régimen de Impuesto a la Renta Único del sector bananero.",
          "Un acuerdo privado entre exportador y productor.",
          "No existe retención para el banano."
        ],
        "correctIndex": 1,
        "explanation": "La compra local de banano a productores tiene su propio porcentaje de retención, fijado por la Ley de Régimen Tributario Interno y su Reglamento (Impuesto a la Renta Único, con tarifas progresivas según el volumen). La tabla general de 2026 lo remite expresamente a esa norma. El régimen único bananero tiene vigencia hasta diciembre de 2026: hay que revisar su renovación."
      },
      {
        "id": 3,
        "question": "¿Por qué es indispensable registrar la certificación GlobalGAP en el lote de exportación en SAP B1?",
        "options": [
          "Para que el barco navegue más rápido.",
          "Porque certifica buenas prácticas agrícolas y es requisito excluyente para ingresar a los mercados de la Unión Europea y EE.UU.",
          "Para evitar pagar el combustible del camión.",
          "Para cambiar el color de la fruta."
        ],
        "correctIndex": 1,
        "explanation": "GlobalGAP garantiza trazabilidad, inocuidad alimentaria y respeto ambiental, siendo indispensable para compradores internacionales."
      }
    ],
    "relatedManualNumbers": [
      57,
      58,
      59
    ]
  },
  "vert-02": {
    "systemType": "SAP_B1",
    "windowTitle": "Vertical Camaronera: Piscinas como Centros de Costo y Biomasa",
    "transactionCode": "CAM-PISC-02",
    "screenSummary": "Control acuícola integral: Modelado de piscinas de engorde como Centros de Costo y Almacenes independientes, control de siembra de larvas, balanceado diario, curvas de crecimiento de biomasa y liquidación de pesca en planta procesadora.",
    "classTranscript": {
      "instructor": "Ing. Acuícola Fernando Moncayo, Especialista SAP B1 Camaronero",
      "summary": "Aprende a configurar el costeo por piscina en SAP B1 para el sector camaronero de Ecuador. Controlaremos el consumo diario de alimento balanceado, calcularemos el Factor de Conversión Alimenticia (FCA) y liquidaremos la cosecha por tallas.",
      "keyPoints": [
        "Cada piscina camaronera es un Centro de Costo analítico y un sub-almacén de producto en proceso.",
        "El alimento balanceado representa entre el 50% y 60% del costo total de la corrida.",
        "Al momento de la pesca, el inventario en proceso se liquida contra el producto terminado clasificado por gramaje y tallas."
      ],
      "deepDiveText": "Ecuador es el primer exportador mundial de camarón. La gestión financiera en SAP B1 exige tratar cada ciclo biológico (corrida de 90 a 120 días) como un proyecto de manufactura. Todos los costos de larva, balanceado, probióticos, combustible de bombeo y mano de obra se acumulan en la cuenta de inventario en proceso de la piscina hasta el día de la pesca."
    },
    "interactiveFields": [
      {
        "label": "Piscina / Centro de Costo",
        "value": "PISC-04 (Superficie: 8.5 Hectáreas)",
        "helperExplanation": "Unidad biológica y contable donde se desarrolla el cultivo.",
        "isMandatory": true
      },
      {
        "label": "Densidad de Siembra",
        "value": "120,000 Larvas por Hectárea (PL-12)",
        "helperExplanation": "Población inicial sembrada en la piscina.",
        "isMandatory": true
      },
      {
        "label": "Consumo Alimento Balanceado",
        "value": "18,500 Kg (Proteína 35%)",
        "helperExplanation": "Mayor componente del costo operativo de la corrida.",
        "isMandatory": true
      },
      {
        "label": "Biomasa Cosechada en Pesca",
        "value": "14,200 Libras de Camarón (Talla 20/30)",
        "helperExplanation": "Rendimiento físico obtenido al drenar la piscina.",
        "isMandatory": true
      },
      {
        "label": "Costo por Libra Obtenido",
        "value": "$1.42 USD por Libra Cosechada",
        "helperExplanation": "Costo total acumulado dividido para las libras producidas.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Costeo y Liquidación de Cosecha en Piscina de 8.5 Hectáreas",
      "stepByStepMath": [
        "Escenario: Corrida de 105 días en Piscina 04. Se cosechan 14,200 libras de camarón entero.",
        "Paso 1: Costo de Larva Sembrada (1,000,000 larvas a $2.50 el millar) = $2,500.00.",
        "Paso 2: Alimento Balanceado consumido (18,500 Kg a $0.55/Kg) = $10,175.00.",
        "Paso 3: Probióticos y fertilizantes del agua = $1,800.00.",
        "Paso 4: Combustible Diésel bombeo y aireación = $3,200.00.",
        "Paso 5: Mano de obra directa de camaroneros = $2,500.00.",
        "Paso 6: Costo Total Acumulado en Piscina 04 = $2,500 + $10,175 + $1,800 + $3,200 + $2,500 = $20,175.00.",
        "Paso 7: Costo Unitario por Libra = $20,175.00 ÷ 14,200 libras = $1.4208 por libra.",
        "Paso 8: Venta a Empacadora a $2.10 la libra = $29,820.00. Ganancia Operativa = $29,820 - $20,175 = $9,645.00."
      ],
      "accountingJournalEntry": [
        {
          "account": "1.1.05.03 Inventario Camarón Cosechado para Empaque",
          "debe": 20175
        },
        {
          "account": "1.1.05.05 Inventario Biomasa en Proceso (Piscina 04)",
          "haber": 20175
        },
        {
          "account": "1.1.02.01 Cuentas por Cobrar Empacadora Exportadora",
          "debe": 29820
        },
        {
          "account": "4.1.01.03 Ventas de Camarón Cosechado",
          "haber": 29820
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 28: Registro de Consumo de Balanceado y Actualización de Biomasa",
      "mission": "Registra un consumo semanal de 2,000 Kg de balanceado a $0.55/Kg imputándolo al Centro de Costo Piscina-04 en SAP B1.",
      "expectedResult": "El inventario de bodega general debe rebajar 2,000 Kg y la cuenta de biomasa en proceso debe debitar $1,100.00."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "En la arquitectura de SAP Business One para camaroneras, ¿cómo se modela operativamente cada piscina?",
        "options": [
          "Como un socio de negocios",
          "Como un Centro de Costo analítico y un almacén de inventario en proceso independiente",
          "Como una cuenta de capital",
          "Como un impuesto del SRI"
        ],
        "correctIndex": 1,
        "explanation": "Modelar la piscina como Centro de Costo y almacén permite acumular consumos de balanceado, larvas y diésel para conocer el costo exacto por libra."
      },
      {
        "id": 2,
        "question": "¿Qué rubro representa el mayor porcentaje del costo de producción en el engorde del camarón?",
        "options": [
          "El uniforme de los obreros",
          "El alimento balanceado (50% a 60% del costo total)",
          "Las llamadas telefónicas",
          "La pintura de las oficinas"
        ],
        "correctIndex": 1,
        "explanation": "El alimento balanceado es el insumo principal y determinante del margen financiero en la industria acuícola."
      },
      {
        "id": 3,
        "question": "¿Qué es el Factor de Conversión Alimenticia (FCA)?",
        "options": [
          "La cantidad de kilogramos de alimento balanceado requeridos para producir un kilogramo de camarón vivo.",
          "La velocidad de natación de las larvas.",
          "El tipo de cambio del dólar.",
          "La profundidad de la piscina en metros."
        ],
        "correctIndex": 0,
        "explanation": "El FCA mide la eficiencia zootécnica: Kg de alimento suministrado dividido para los Kg de biomasa cosechada (menor FCA = mayor eficiencia)."
      }
    ],
    "relatedManualNumbers": [
      60,
      61,
      62
    ]
  },
  "vert-03": {
    "systemType": "SAP_B1",
    "windowTitle": "Manufactura con Beas Manufacturing: Órdenes de Trabajo y Costeo ABC",
    "transactionCode": "BEAS-PROD-03",
    "screenSummary": "Solución avanzada de fabricación industrial de Boyum IT integrada en SAP B1: Rutas de producción complejas, gestión de máquinas y tiempos de preparación (Setup), control de scrap/mermas y costeo basado en actividades (ABC).",
    "classTranscript": {
      "instructor": "Ing. Industrial Patricio Alarcón, Especialista Beas Manufacturing",
      "summary": "Aprende a operar el add-on industrial líder de Boyum IT para SAP B1. Veremos cómo definir hojas de ruta de producción, registrar paradas de máquina y calcular el costo real de fabricación por minuto.",
      "keyPoints": [
        "Beas Manufacturing añade control de tiempos de preparación (Setup Time) y tiempo de ciclo (Run Time).",
        "Permite planificar capacidad finita de máquinas y turnos de operarios de planta.",
        "El reporte en terminales táctiles de piso de planta registra la producción en tiempo real."
      ],
      "deepDiveText": "Mientras la producción estándar de SAP B1 es lineal, industrias como plásticos, químicos, farmacéutica y metalmecánica requieren control de subensambles, mermas multinivel y costos de energía por máquina. Beas Manufacturing extiende la base de datos de SAP B1 permitiendo costeo real por orden de trabajo y cálculo de eficiencia OEE."
    },
    "interactiveFields": [
      {
        "label": "Orden de Trabajo Beas",
        "value": "WO-2026-00481 (Inyección de Tapas Plásticas)",
        "helperExplanation": "Orden de trabajo de producción avanzada en planta.",
        "isMandatory": true
      },
      {
        "label": "Recurso / Centro de Trabajo",
        "value": "INJ-MAQ-03 Inyectora Hidráulica 250 Toneladas",
        "helperExplanation": "Máquina asignada con su costo horario de amortización y energía.",
        "isMandatory": true
      },
      {
        "label": "Tiempo de Preparación (Setup)",
        "value": "45 Minutos (Cambio de Molde de Inyección)",
        "helperExplanation": "Tiempo previo no productivo que se costea como indirecto de fabricación.",
        "isMandatory": true
      },
      {
        "label": "Porcentaje de Scrap / Merma Real",
        "value": "2.40% de Purga de Resina Reciclable",
        "helperExplanation": "Material que no conforma producto terminado y se reincorpora al molino.",
        "isMandatory": false
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Costeo ABC de Lote de 10,000 Tapas Plásticas en Beas",
      "stepByStepMath": [
        "Escenario: Fabricación de 10,000 tapas de polipropileno con ciclo de inyección de 12 segundos por golpe.",
        "Paso 1: Materia Prima: 150 Kg de Resina PP a $1.40/Kg = $210.00. Masterbatch color $15.00. Total Insumos = $225.00.",
        "Paso 2: Tiempo de Máquina: 10,000 tapas ÷ 8 cavidades = 1,250 golpes × 12 seg = 4.17 horas de máquina.",
        "Paso 3: Costo Horario Inyectora (Energía $4.00 + Depreciación $3.50) = $7.50/hora. 4.17h × $7.50 = $31.28.",
        "Paso 4: Mano de Obra Operador de Turno: 4.17 horas a $5.00/hora = $20.85.",
        "Paso 5: Tiempo de Setup (Cambio de Molde): 0.75 horas a $25.00/hora = $18.75.",
        "Paso 6: Costo Total de Fabricación = $225.00 (Insumos) + $31.28 (Máquina) + $20.85 (Operador) + $18.75 (Setup) = $295.88.",
        "Paso 7: Costo Unitario Industrial = $295.88 ÷ 10,000 unidades = $0.0296 por tapa plástica."
      ],
      "accountingJournalEntry": [
        {
          "account": "1.1.05.02 Inventario Producto Terminado Tapas",
          "debe": 295.88
        },
        {
          "account": "1.1.05.04 Inventario Materias Primas Resina",
          "haber": 225
        },
        {
          "account": "5.1.03.08 Costos Indirectos de Fabricación (Energía y Setup)",
          "haber": 50.03
        },
        {
          "account": "2.1.03.05 Mano de Obra de Fábrica Aplicada",
          "haber": 20.85
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 29: Creación de Hoja de Ruta en Beas con Asignación de Setup",
      "mission": "Modela una ruta de trabajo con dos operaciones: Corte (10 min setup) y Ensamble (5 min de ciclo), verificando el costo de preparación.",
      "expectedResult": "Beas debe sumar el costo de setup prorrateado sobre el lote total producido."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué ventaja principal ofrece Beas Manufacturing frente a la producción nativa de SAP Business One?",
        "options": [
          "Cambia el idioma del sistema operativo a alemán.",
          "Permite modelar hojas de ruta multinivel, planificar capacidad finita de máquinas, capturar tiempos en terminales de piso y calcular costos ABC.",
          "Elimina la necesidad de comprar materias primas.",
          "Hace que las máquinas funcionen sin electricidad."
        ],
        "correctIndex": 1,
        "explanation": "Beas es el estándar de manufactura avanzada que transforma a SAP B1 en un sistema industrial completo con control de tiempos y máquinas."
      },
      {
        "id": 2,
        "question": "¿Qué representa el tiempo de \"Setup\" en una línea de producción industrial?",
        "options": [
          "La hora de la merienda de los operarios.",
          "El tiempo requerido para preparar, calibrar y cambiar moldes o herramientas en la máquina antes de iniciar la producción en firme.",
          "El tiempo que tarda el camión en llegar a la planta.",
          "El apagado de luces en la noche."
        ],
        "correctIndex": 1,
        "explanation": "El Setup es el tiempo muerto técnico necesario para dejar la máquina en condiciones operativas para el nuevo lote."
      },
      {
        "id": 3,
        "question": "¿Cómo impacta el tamaño del lote de producción en el costo unitario cuando existe un tiempo de preparación (Setup) elevado?",
        "options": [
          "No tiene ningún impacto.",
          "A mayor tamaño de lote, el costo fijo del setup se diluye entre más unidades reduciendo el costo unitario (Economía de Escala).",
          "Aumenta el costo unitario exponencialmente.",
          "Bloquea el inventario de bodega."
        ],
        "correctIndex": 1,
        "explanation": "Prorratear el costo fijo de preparación entre un lote grande reduce drásticamente la carga unitaria del producto."
      }
    ],
    "relatedManualNumbers": [
      65,
      66,
      67
    ]
  },
  "vert-04": {
    "systemType": "SAP_B1",
    "windowTitle": "Gestión Avanzada de Bodegas: Produmex WMS y Radiofrecuencia",
    "transactionCode": "WMS-PROD-04",
    "screenSummary": "Logística de almacenamiento de clase mundial de Boyum IT: Recepción con código de barras GS1/SSCC, cross-docking, estrategias avanzadas de almacenamiento (Putaway), preparación de pedidos por olas (Wave Picking) y validación en terminales de radiofrecuencia.",
    "classTranscript": {
      "instructor": "Ing. Logístico Gabriel Cárdenas, Especialista WMS & Boyum IT",
      "summary": "Aprende a digitalizar bodegas complejas mediante Produmex WMS para SAP B1. Veremos cómo eliminar errores de despacho, optimizar rutas de montacargas y operar pistolas de radiofrecuencia.",
      "keyPoints": [
        "Produmex WMS opera con estándares GS1-128 y matrículas de pallet SSCC (Serial Shipping Container Code).",
        "Las estrategias de Putaway sugieren la ubicación óptima según rotación ABC, peso y dimensiones.",
        "El Wave Picking agrupa múltiples pedidos para recolectar en una sola pasada por los pasillos."
      ],
      "deepDiveText": "En centros de distribución de consumo masivo, retail y farmacéutica, el inventario estándar por almacén es insuficiente. Produmex WMS divide cada bodega en zonas, pasillos, racks, niveles y compartimentos (Bin Locations) y guía a los operarios mediante terminales de radiofrecuencia, reduciendo los errores de picking al 0.01%."
    },
    "interactiveFields": [
      {
        "label": "Matrícula de Pallet (SSCC)",
        "value": "00178610923000045892 (GS1 Estándar)",
        "helperExplanation": "Identificador único internacional del pallet completo.",
        "isMandatory": true
      },
      {
        "label": "Ubicación Sugerida (Putaway)",
        "value": "PAS-02-RACK-04-NIV-03-BIN-A",
        "helperExplanation": "Espacio físico asignado algorítmicamente por peso y rotación.",
        "isMandatory": true
      },
      {
        "label": "Estrategia de Despacho",
        "value": "FEFO (First Expired, First Out)",
        "helperExplanation": "Prioriza el despacho del lote cuya fecha de caducidad esté más próxima.",
        "isMandatory": true
      },
      {
        "label": "Terminal Móvil RF Activa",
        "value": "Zebra MC9300 - Operario: Carlos Viteri",
        "helperExplanation": "Dispositivo portátil con lector láser de código de barras 2D.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Recepción, Palletizado y Wave Picking de 50 Pedidos",
      "stepByStepMath": [
        "Escenario: Centro de distribución recibe 40 pallets de productos de consumo para despachar 50 pedidos de retail.",
        "Paso 1: Lectura de código GS1-128 en muelle de recepción: El sistema valida Orden de Compra y genera matrícula SSCC.",
        "Paso 2: Algoritmo Putaway dirige el montacargas hacia Pasillo 02, Nivel 03 optimizando recorrido.",
        "Paso 3: Generación de Ola de Picking (Wave Picking): 50 pedidos individuales agrupados en 1 sola ruta de recolección.",
        "Paso 4: Tiempo estándar tradicional sin WMS = 4 horas de recolección manual.",
        "Paso 5: Tiempo con Produmex WMS y Wave Picking = 1 hora 15 minutos (Ahorro del 68% de tiempo).",
        "Paso 6: Validación en mesa de empaque con escáner de confirmación: Cero despachos errados reportados."
      ],
      "accountingJournalEntry": [
        {
          "account": "1.1.05.01 Inventario Mercaderías en Ubicación Físicamente Validada",
          "debe": 48000
        },
        {
          "account": "2.1.02.01 Entradas de Mercancías no Facturadas (GRPO)",
          "haber": 48000
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 30: Simulación de Picking Guiado por Radiofrecuencia en Produmex WMS",
      "mission": "Ejecuta una orden de picking escaneando el código de barras de la ubicación y el código EAN del artículo, confirmando la cantidad exacta.",
      "expectedResult": "El sistema debe validar el código escaneado y liberar la orden para empaque."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué significa el código SSCC (Serial Shipping Container Code) en la logística de almacenamiento?",
        "options": [
          "Un impuesto municipal",
          "La matrícula o código de barras único internacional que identifica a un pallet o bulto logístico completo",
          "El número de teléfono del transportista",
          "La contraseña de la red Wi-Fi"
        ],
        "correctIndex": 1,
        "explanation": "El SSCC de GS1 es la matrícula de 18 dígitos que identifica unívocamente a cada pallet en cualquier parte de la cadena de suministro."
      },
      {
        "id": 2,
        "question": "¿Qué principio de rotación de inventarios exige despachar primero el lote cuya fecha de caducidad venza antes?",
        "options": [
          "LIFO (Last In First Out)",
          "FEFO (First Expired First Out)",
          "FIFO (First In First Out)",
          "Random Picking"
        ],
        "correctIndex": 1,
        "explanation": "FEFO es la regla obligatoria en industrias farmacéuticas y alimenticias para garantizar que no expire producto en percha."
      },
      {
        "id": 3,
        "question": "¿Cuál es la principal ventaja de la preparación de pedidos por olas (Wave Picking) en un almacén grande?",
        "options": [
          "Que los empleados descansan más tiempo.",
          "Consolida múltiples pedidos en una sola ruta de recolección, evitando que los operarios caminen varias veces por los mismos pasillos.",
          "Aumenta el cobro del transporte.",
          "Elimina el uso de montacargas."
        ],
        "correctIndex": 1,
        "explanation": "Wave Picking optimiza los recorridos físicos recolectando de una sola pasada la suma de artículos requeridos por varios pedidos."
      }
    ],
    "relatedManualNumbers": [
      68,
      69,
      70
    ]
  },
  "vert-05": {
    "systemType": "SAP_B1",
    "windowTitle": "Personalización con B1 Usability Package (B1UP) de Boyum IT",
    "transactionCode": "B1UP-CUST-05",
    "screenSummary": "Herramienta de personalización sin código (No-Code) de Boyum IT para SAP B1: Rediseño visual de pantallas, campos obligatorios condicionales, botones rápidos de acción, búsquedas formateadas avanzadas y automatizaciones con B1 Print & Delivery.",
    "classTranscript": {
      "instructor": "Ing. Christian Roldán, Especialista en Integración SRI & SAP B1",
      "summary": "Aprende a transformar la experiencia de usuario en SAP B1 con Boyum B1UP. Crearemos botones interactivos que ejecutan flujos de trabajo, bloquearemos campos sin código y automatizaremos el envío de facturas por email.",
      "keyPoints": [
        "B1UP permite rediseñar cualquier formulario estándar de SAP B1 sin escribir código SDK.",
        "Reglas de Validación Universal (UVR): Bloquean transacciones si faltan campos obligatorios de negocio.",
        "B1 Print & Delivery automatiza el envío de PDF con estados de cuenta y facturas por correo electrónico."
      ],
      "deepDiveText": "La adopción del usuario es el factor determinante del éxito de un ERP. Con B1 Usability Package de Boyum IT, los consultores pueden ocultar campos innecesarios, reorganizar pestañas y crear atajos en segundos. Por ejemplo, en Ecuador es común usar B1UP para hacer obligatorio el campo de sustento SRI solo si el tipo de documento es Factura de Proveedor."
    },
    "interactiveFields": [
      {
        "label": "Módulo de Personalización B1UP",
        "value": "Item Placement Tool (Diseño de Interfaz)",
        "helperExplanation": "Permite mover, ocultar y renombrar campos en la pantalla.",
        "isMandatory": true
      },
      {
        "label": "Regla de Validación Universal",
        "value": "UVR_MANDATORY_SUSTENTO_SRI",
        "helperExplanation": "Bloquea el botón Guardar si el campo U_SustentoSRI está vacío.",
        "isMandatory": true
      },
      {
        "label": "Botón de Acción Rápida",
        "value": "BTN_CONSULTAR_RUC_SRI",
        "helperExplanation": "Botón incrustado que abre directamente la consulta pública del SRI.",
        "isMandatory": false
      },
      {
        "label": "Módulo de Envío Automático",
        "value": "B1 Print & Delivery (B1P&D)",
        "helperExplanation": "Dispara el correo al cliente con el PDF de la factura y el XML adjuntos.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Implementación de Botón de Envío y Regla de Campo Obligatorio",
      "stepByStepMath": [
        "Escenario: Configurar la Factura de Clientes para que envíe automáticamente un PDF por correo y exija ingresar el RUC.",
        "Paso 1: Abrir Item Placement Tool en la pantalla de Factura A/R.",
        "Paso 2: Crear regla UVR: Si $[$CardCode] no tiene RUC de 13 dígitos, mostrar error \"RUC debe tener 13 dígitos\" y detener proceso.",
        "Paso 3: Crear Botón Rápido \"Verificar en SRI\" con acción OpenURL: https://srienlinea.sri.gob.ec/sri-en-linea/...",
        "Paso 4: Configurar B1 Print & Delivery: Al presionar \"Añadir\", compilar Crystal Report, generar PDF y enviar a la dirección de correo del socio.",
        "Paso 5: Prueba de usuario: La factura se envía al cliente en 3 segundos con 0 intervención manual."
      ],
      "accountingJournalEntry": [
        {
          "account": "No genera asiento contable directo (Personalización y Automatización)",
          "debe": 0
        },
        {
          "account": "Aumenta la productividad del departamento de facturación en un 40%",
          "haber": 0
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 31: Creación de Regla de Validación Universal (UVR) en B1UP",
      "mission": "Crea una regla en B1UP que impida guardar una Orden de Compra si la fecha de entrega prometida es anterior a la fecha actual.",
      "expectedResult": "El sistema debe mostrar un mensaje emergente amarillo y abortar la acción de guardado."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué permite hacer la herramienta B1 Usability Package (B1UP) de Boyum IT en SAP Business One?",
        "options": [
          "Cambiar el hardware físico del servidor.",
          "Personalizar pantallas, crear botones, establecer validaciones de campos obligatorios y automatizar flujos de trabajo sin programar en C# o Java.",
          "Eliminar el plan de cuentas de la empresa.",
          "Prestar dinero a los clientes."
        ],
        "correctIndex": 1,
        "explanation": "B1UP es el add-on de personalización más popular del mundo para SAP B1, permitiendo rediseñar interfaces y crear lógica de negocio no-code."
      },
      {
        "id": 2,
        "question": "¿Cuál es la función del componente B1 Print & Delivery (B1P&D)?",
        "options": [
          "Recargar la tinta de las impresoras mecánicas.",
          "Automatizar la generación, conversión a PDF y despacho masivo por correo electrónico de documentos comerciales oficiales con sus XML adjuntos.",
          "Limpiar las oficinas de la empresa.",
          "Calcular las horas extras del chofer."
        ],
        "correctIndex": 1,
        "explanation": "B1P&D automatiza toda la distribución digital de documentos (facturas, estados de cuenta, pedidos) con plantillas de correo personalizadas."
      },
      {
        "id": 3,
        "question": "¿Cómo ayuda una Regla de Validación Universal (UVR) a garantizar la calidad de los datos?",
        "options": [
          "Bloquea la conexión a internet.",
          "Impide que los usuarios guarden documentos incompletos o con datos errados antes de que afecten la contabilidad o el SRI.",
          "Cambia las contraseñas de los usuarios cada 5 minutos.",
          "Borra las transacciones antiguas."
        ],
        "correctIndex": 1,
        "explanation": "Las UVRs actúan como filtros de calidad en el momento exacto de la captura, evitando que ingresen datos corruptos o incompletos al ERP."
      }
    ],
    "relatedManualNumbers": [
      73,
      74,
      75
    ]
  },
  "vert-06": {
    "systemType": "SAP_B1",
    "windowTitle": "Arquitectura de Integración: SAP Service Layer, OData y n8n",
    "transactionCode": "SL-ODATA-06",
    "screenSummary": "Integración moderna de sistemas: Consumo de la API RESTful SAP Service Layer mediante protocolo OData v4, autenticación con B1SESSION, y diseño de flujos de automatización empresarial con n8n y webhooks.",
    "classTranscript": {
      "instructor": "Ing. Christian Roldán, Especialista en Integración SRI & SAP B1",
      "summary": "Aprende a conectar SAP Business One con cualquier sistema web o móvil. Utilizaremos la Service Layer con llamadas HTTP (GET, POST, PATCH), construiremos pipelines en n8n y aseguraremos la integridad transaccional.",
      "keyPoints": [
        "La Service Layer es un servidor web basado en Apache/Nginx que expone todas las entidades de SAP B1 vía OData.",
        "Reemplaza a la antigua DI API COM con una arquitectura sin estado de alto rendimiento.",
        "n8n permite orquestar flujos de integración complejos sin escribir microservicios dedicados."
      ],
      "deepDiveText": "La Service Layer es el estándar de oro de integración en SAP B1. Para interactuar con ella, una aplicación externa envía un POST a /Login con la base de datos, usuario y clave, recibiendo un token de sesión B1SESSION. Con este token, la aplicación puede crear facturas, consultar inventarios o sincronizar con e-commerce en tiempo real."
    },
    "interactiveFields": [
      {
        "label": "Método HTTP / Endpoint",
        "value": "POST /b1s/v2/Orders (Crear Pedido de Venta)",
        "helperExplanation": "Llamada REST con payload JSON hacia la Service Layer.",
        "isMandatory": true
      },
      {
        "label": "Cabecera de Autenticación",
        "value": "Cookie: B1SESSION=928a3f81-01ec-4b92; ROUTEID=.node1",
        "helperExplanation": "Token de sesión activo emitido tras autenticación exitosa.",
        "isMandatory": true
      },
      {
        "label": "Plataforma de Orquestación",
        "value": "n8n Workflow Automation Server",
        "helperExplanation": "Motor de flujos que escucha eventos de tiendas online y escribe en SAP.",
        "isMandatory": false
      },
      {
        "label": "Código de Respuesta HTTP",
        "value": "201 Created (DocEntry: 18492)",
        "helperExplanation": "Confirmación de inserción exitosa con el número interno del documento.",
        "isMandatory": true
      }
    ],
    "workedExample": {
      "title": "Caso Práctico Resuelto: Sincronización Automática de Pedido de E-Commerce a SAP B1",
      "stepByStepMath": [
        "Escenario: Tienda online Shopify recibe un pedido de $350.00 de un cliente corporativo.",
        "Paso 1: Webhook de Shopify envía el JSON del pedido al endpoint webhook de n8n.",
        "Paso 2: n8n autentica contra SAP Service Layer enviando credenciales a /Login.",
        "Paso 3: n8n valida si el cliente existe en OCRD mediante GET /BusinessPartners(\"0992834710001\").",
        "Paso 4: n8n compone el payload OData con CardCode, DocDueDate y DocumentLines con el SKU y cantidad.",
        "Paso 5: Envío POST a /Orders: La Service Layer valida existencias y crea el pedido ORDR #18492.",
        "Paso 6: n8n notifica a Shopify que el pedido fue ingresado a SAP con el número #18492 en 800 milisegundos."
      ],
      "accountingJournalEntry": [
        {
          "account": "No genera asiento contable inmediato (Creación de Pedido ORDR)",
          "debe": 0
        },
        {
          "account": "Compromete stock en bodega y habilita el picking en WMS",
          "haber": 0
        }
      ]
    },
    "practiceLab": {
      "title": "Laboratorio 32: Consulta de Stock en Tiempo Real vía Service Layer",
      "mission": "Construye una llamada GET a /Items(\"P001\")?$select=ItemCode,ItemName,QuantityOnStock e inspecciona el JSON retornado.",
      "expectedResult": "La respuesta debe incluir el código del artículo y el inventario disponible en almacén."
    },
    "quickCheckQuestions": [
      {
        "id": 1,
        "question": "¿Qué protocolo y estándar de intercambio de datos utiliza la Service Layer de SAP Business One?",
        "options": [
          "SOAP con archivos XML únicamente",
          "RESTful API basada en el estándar OData (Open Data Protocol) con formato JSON",
          "Transmisión de archivos por FTP",
          "Protocolo Bluetooth"
        ],
        "correctIndex": 1,
        "explanation": "La Service Layer opera bajo el estándar OData RESTful, utilizando verbos HTTP y payloads JSON ligeros de alta velocidad."
      },
      {
        "id": 2,
        "question": "¿Cómo se autentica una aplicación externa antes de consumir los endpoints de la Service Layer?",
        "options": [
          "Enviando una solicitud POST al endpoint /Login con CompanyDB, UserName y Password para obtener la cookie B1SESSION.",
          "Escribiendo directamente en el archivo hosts de Windows.",
          "Llamando por teléfono al soporte de SAP.",
          "No requiere autenticación."
        ],
        "correctIndex": 0,
        "explanation": "La sesión se inicia en /Login y el servidor retorna un token B1SESSION que debe enviarse en la cabecera de las llamadas subsiguientes."
      },
      {
        "id": 3,
        "question": "¿Qué ventaja aporta utilizar un motor de integración como n8n junto a SAP Business One?",
        "options": [
          "Permite diseñar flujos visuales de integración con e-commerce, WhatsApp y CRM sin tener que programar microservicios desde cero.",
          "Elimina la necesidad de pagar la nómina.",
          "Reemplaza a los contadores de la empresa.",
          "Hace copias de seguridad en disquetes."
        ],
        "correctIndex": 0,
        "explanation": "n8n es un orquestador no-code/low-code que simplifica la conexión de webhooks y APIs externas hacia la Service Layer de SAP B1."
      }
    ],
    "relatedManualNumbers": [
      78,
      79,
      80
    ]
  }
};

export function getModuleSimulation(submoduleId: string, trackCode?: string): ModuleVisualSimulation {
  if (MODULE_SIMULATIONS[submoduleId]) {
    return MODULE_SIMULATIONS[submoduleId];
  }

  // Fallback estructurado de alta calidad si no se encuentra
  const isNomina = (trackCode && trackCode.includes('HEIN')) || submoduleId.startsWith('nom') || submoduleId.startsWith('hcm');
  return {
    systemType: isNomina ? 'HEIN_NOMINA' : 'SAP_B1',
    windowTitle: `Operación y Parametrización: ${submoduleId.toUpperCase()}`,
    transactionCode: `TX-${submoduleId.toUpperCase()}`,
    screenSummary: 'Transacción oficial para la operación técnica y administrativa del módulo. Permite registrar transacciones de negocio, validar reglas fiscales del SRI y el IESS y balancear asientos contables en tiempo real.',
    classTranscript: {
      instructor: 'Ing. Consultor Senior Especializado en SAP B1 & Nómina Ecuador',
      summary: 'Clase magistral de operación y parametrización técnica. Se analizan los campos críticos de la transacción, el impacto contable y las validaciones de auditoría fiscal.',
      keyPoints: [
        'Validación de integridad referencial antes de contabilizar.',
        'Alineación estricta con normativas NIIF y resoluciones del SRI e IESS.',
        'Mapeo automático hacia centros de costos y cuentas de mayor.'
      ],
      deepDiveText: 'La ejecución de esta transacción en producción requiere verificar que los períodos contables estén abiertos y que los datos maestros de socios o artículos posean sus cuentas asociadas configuradas correctamente.'
    },
    interactiveFields: [
      {
        label: 'Código de Transacción',
        value: `TX-${submoduleId.toUpperCase()}`,
        helperExplanation: 'Identificador único de la pantalla en el menú de navegación del ERP.',
        isMandatory: true
      },
      {
        label: 'Moneda de Registro',
        value: 'USD ($ Dólar Oficial Ecuador)',
        helperExplanation: 'Moneda funcional de la República del Ecuador.',
        isMandatory: true
      },
      {
        label: 'Centro de Costo Asignado',
        value: 'CC-OPERATIVO-01',
        helperExplanation: 'Unidad de gestión analítica para la imputación de gastos o costos.',
        isMandatory: true
      },
      {
        label: 'Estado de Validación Fiscal',
        value: '100% Conforme Normativa SRI / IESS',
        helperExplanation: 'Comprobación de cumplimiento impositivo antes de escribir en base de datos.',
        isMandatory: true
      }
    ],
    workedExample: {
      title: `Caso Práctico Resuelto: Transacción y Asiento de ${submoduleId.toUpperCase()}`,
      stepByStepMath: [
        '1. Verificación de prerequisitos maestros en base de datos.',
        '2. Registro de la transacción con valores comerciales y tarifas tributarias vigentes.',
        '3. Conciliación y cuadre contable entre Débitos y Créditos en el libro diario general.'
      ],
      accountingJournalEntry: [
        { account: 'Cuenta de Activo / Gasto Imputable (Debe)', debe: 1500.00 },
        { account: 'Cuenta de Pasivo / Transitoria por Pagar (Haber)', haber: 1500.00 }
      ]
    },
    practiceLab: {
      title: 'Laboratorio de Consolidación y Verificación',
      mission: 'Ejecuta los valores del caso de estudio en la consola sandbox y comprueba que el asiento diario mantenga suma cero.',
      expectedResult: 'El balance de comprobación debe validar que no existen descuadres contables.'
    },
    quickCheckQuestions: [
      {
        id: 1,
        question: '¿Qué principio garantiza que una transacción contable sea inmutable tras su autorización en el ERP?',
        options: ['La regla de partida doble y trazabilidad de auditoría', 'El reinicio del servidor cada noche', 'La velocidad de la conexión a internet', 'El color de la pantalla'],
        correctIndex: 0,
        explanation: 'Los sistemas ERP de clase mundial garantizan inmutabilidad mediante bitácora de auditoría y asientos de reversión autorizados.'
      },
      {
        id: 2,
        question: '¿Cuál es la moneda oficial inmutable en la que se deben registrar todas las operaciones en Ecuador?',
        options: ['Pesos', 'Dólares Estadounidenses (USD)', 'Euros', 'Bitcoins'],
        correctIndex: 1,
        explanation: 'En Ecuador la moneda oficial y funcional para registros contables y fiscales es el Dólar Estadounidense (USD).'
      },
      {
        id: 3,
        question: '¿Qué documento o entidad regula las declaraciones tributarias de las empresas en Ecuador?',
        options: ['El Servicio de Rentas Internas (SRI)', 'La NASA', 'El Ministerio de Turismo', 'La Organización Mundial de la Salud'],
        correctIndex: 0,
        explanation: 'El SRI es la administración tributaria nacional que regula impuestos, facturación electrónica y retenciones.'
      }
    ],
    relatedManualNumbers: [1, 2, 3]
  };
}
