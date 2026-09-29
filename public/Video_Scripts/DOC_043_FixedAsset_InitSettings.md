# Guion de Video: DOC 043 FixedAsset InitSettings

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 043 FixedAsset InitSettings.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 043: ACTIVOS FIJOS - PARAMETRIZACIONES INICIALES Y MAESTROS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_FixedAsset_21_FixedAsset_InitSettings
Módulo Oficial: Finanzas / Activos Fijos (Fixed Assets - Initial Settings)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Contadores Generales, Responsables de Activos y Agentes IA (Antigravity)
Carpeta Asociada: 043_10_FixedAsset_21_FixedAsset_InitSettings


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "043",

  "topic": "Fixed Assets Initial Settings, Master Data & Configuration Suite",

  "sap_module": "FixedAssets_Setup",

  "activation": {

    "menu_path": "Gestión > Inicialización del sistema > Detalles de la empresa > Pestaña Inicialización básica",

    "checkbox": "Activar activos fijos",

    "irreversibility": "Una vez activada la casilla, queda deshabilitada permanentemente y no se puede desactivar",

    "depreciation_calculation_basis": {

      "options": ["Por mes (Month)", "Por día (Day)"],

      "default": "Mes",

      "locking_rule": "No se puede modificar durante el ejercicio fiscal si ya se ha contabilizado al menos una amortización"

    }

  },

  "database_tables": {

    "asset_master_data": "OITM (ItemClass = 'A')",

    "asset_classes": "OACS",

    "depreciation_areas": "ODPA",

    "depreciation_types": "ODTY",

    "account_determination_fa": "OACR",

    "depreciation_posting_runs": "ODPR",

    "asset_documents_numbering": "NNM1"

  },

  "menu_paths": [

    "Finanzas > Activos fijos > Datos maestros de activo",

    "Gestión > Definición > Finanzas > Activos fijos > Clases de activos fijos",

    "Gestión > Definición > Finanzas > Activos fijos > Áreas de amortización",

    "Gestión > Definición > Finanzas > Activos fijos > Clases de amortización",

    "Gestión > Definición > Finanzas > Activos fijos > Determinación de cuentas de mayor"

  ],

  "configuration_quadrant": {

    "1_Asset_Class": {

      "role": "Entidad agrupadora central que se vincula en el Maestro de Activos",

      "sub_entities": ["Áreas de amortización", "Determinación de cuentas", "Clase de amortización", "Vida útil en meses"],

      "types": ["General", "Activo de bajo valor (Low Value Asset con límites min/max)"]

    },

    "2_Depreciation_Area": {

      "types": [

        { "type": "Contabilización en libro mayor (Posting to G/L)", "desc": "Área principal GAAP obligatoria que genera asientos reales en el balance" },

        { "type": "Área adicional (Additional Area)", "desc": "Área extracontable (ej. IFRS/fiscal) con propósitos de reporting e impuestos" },

        { "type": "Área derivada (Derived Area)", "desc": "Área vinculada a la principal para capturar amortizaciones no planificadas o especiales" }

      ],

      "depreciation_posting_methods": {

        "Direct_Posting": "Acredita directamente la cuenta de balance del activo",

        "Indirect_Posting": "Acredita la cuenta de Amortización Acumulada (Estándar contable recomendado)"

      },

      "retirement_posting_methods": ["Bruto (Gross)", "Neto (Net)"]

    },

    "3_Depreciation_Type": {

      "methods": [

        "Sin amortización (No Depreciation - Terrenos)",

        "Lineal (Straight Line)",

        "Control de periodos lineal (Straight Line Period Control)",

        "Degresivo / Saldo decreciente (Declining Balance con factor y cambio automático a lineal)",

        "Multinivel (Multilevel - Hasta 5 fases)",

        "Amortización inmediata (Immediate Write-off)",

        "Amortización especial (Special Depreciation)",

        "Manual"

      ]

    },

    "4_Account_Determination": {

      "accounts": [

        "Cuenta de balance de activos",

        "Cuenta de compensación de adquisición",

        "Cuenta de amortización acumulada",

        "Cuenta de gastos de amortización",

        "Cuenta de ingresos por baja",

        "Cuenta de gastos por baja (desguace/pérdida)"

      ]

    }

  },

  "asset_master_data_subtabs": [

    "Resumen (Overview: Estado, Clase de activo, Vida útil, Parámetros de amortización)",

    "Valores (Values: Costo histórico, Adquisiciones, Valor residual, Valor neto contable)",

    "Amortización (Depreciation: Proyección planificada mes a mes)",

    "Contabilidad de costes (Cost Accounting: Distribución por centros de costo)",

    "Atributos (Attributes: Campos dimensionales y técnicos)"

  ]

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Activación e Irreversibilidad del Módulo de Activos Fijos
En SAP Business One 10.0, la gestión de activos fijos está completamente integrada en el núcleo financiero.

La activación se ejecuta en Detalles de la empresa, marcando la casilla Activar activos fijos.
Regla Crítica de Consultoría: Esta casilla es completamente irreversible. Una vez marcada y grabada la inicialización de la empresa, el flag queda deshabilitado permanentemente.
Cálculo de Amortización (Mensual vs. Diario): El sistema exige elegir entre el cálculo por mes (distribución equitativa $1/12$ por mes) o por día ($1/365$ días, reflejando diferencias por meses de 28, 30 o 31 días). Esta decisión es de alcance global para la sociedad y queda bloqueada durante el ejercicio si ya existe al menos una amortización contabilizada.
2.2 La Cuadrícula de Configuración de Activos Fijos
Para dar de alta un activo fijo no basta con crear su ficha; es imperativo configurar una arquitectura en cascada de cuatro entidades interrelacionadas:

Áreas de Amortización (ODPA): Dimensión contable de valoración.
Área Principal (GAAP): De tipo Contabilización en libro mayor. Es mandatoria y genera asientos reales en OJDT.
Área Adicional (ej. IFRS / Fiscal): No contabiliza en el libro diario estándar; se utiliza para presentar estados financieros comparativos bajo normas internacionales.
Área Derivada: Asignada a la principal para albergar depreciaciones imprevistas o extraordinarias.
Métodos de Contabilización:
Amortización Indirecta: Método estándar preferido. El gasto se debita en pérdidas y se acredita en la cuenta de Amortización Acumulada (cuenta compensatoria de activo), manteniendo el valor de adquisición original visible en el balance.
Amortización Directa: El crédito se imputa directamente a la cuenta del bien reduciendo su saldo histórico.
Clases de Amortización (ODTY): Define el algoritmo matemático:
Método Lineal: Divide el costo neto entre la vida útil en meses.
Saldo Decreciente (Declining Balance): Aplica un porcentaje constante sobre el Valor Neto Contable remanente. Permite configurar la regla Cambiar automáticamente a lineal cuando la cuota decreciente cae por debajo de la cuota lineal.
Determinación de Cuentas de Mayor (OACR): Asigna las cuentas de mayor específicas para altas, bajas, ventas, pérdidas por desguace y gastos de amortización.
Clase de Activo Fijo (OACS): Es la entidad agrupadora que fusiona el Área de Amortización, la Cuenta Contable, la Clase de Amortización y la Vida Útil por defecto.
2.3 El Maestro de Activo Fijo (OITM) y sus Estados Operativos
El activo fijo se gestiona en la ventana Datos maestros de activo (Finanzas > Activos fijos > Datos maestros de activo):

En la base de datos es un registro de la tabla OITM con la propiedad interna ItemClass = 'A' (Asset).
Ciclo de Estados:
Nuevo (New): Creado en el maestro pero aún no capitalizado financieramente. No amortiza.
Activo (Active): Se activa automáticamente al registrarse el documento de Capitalización (OACQ) o la Factura de Proveedores (OPCH). Comienza a generar amortizaciones planificadas.
Inactivo (Inactive): Pasa a este estado tras una Baja (ORET) total por venta o desguace. No admite más transacciones.
2.4 Gestión de Cantidad Global vs. Activos Individuales
Activos Individuales: Cada bien físico (un camión, una laptop asignada) tiene su propio registro maestro único.
Cantidad Global (Consider Quantity): Para activos masivos de bajo costo (ej. 200 sillas de oficina), la empresa puede crear una única ficha maestra y marcar la columna Tomar en cuenta cantidad en la factura. El sistema registra las 200 unidades en el campo Quantity y amortiza el valor global del lote.


3. ATLAS DIDÁCTICO: MODELO DE DATOS Y JERARQUÍA DE ACTIVOS
┌────────────────────────────────────────────────────────────────────────┐

│                        CLASE DE ACTIVO FIJO (OACS)                     │

│                        Ejemplo: "Vehículos Pesados"                    │

├───────────────────────────────────┬────────────────────────────────────┤

│   ÁREA DE AMORTIZACIÓN (ODPA)     │  DETERMINACIÓN DE CUENTAS (OACR)   │

│   • Principal: GAAP (Contabiliza) │  • Activo: 150000 (Vehículos)      │

│   • Adicional: IFRS (Reportes)    │  • Amort. Acum: 159000 (Indirecta) │

│   • Derivada: No planificada      │  • Gasto Amort: 680000             │

├───────────────────────────────────┴────────────────────────────────────┤

│                    CLASE DE AMORTIZACIÓN (ODTY)                        │

│                    • Método: Lineal (Straight Line)                    │

│                    • Vida Útil: 60 Meses (5 Años)                      │

└───────────────────────────────────┬────────────────────────────────────┘

                                    │  Se asigna a

                                    ▼

┌────────────────────────────────────────────────────────────────────────┐

│                   DATOS MAESTROS DE ACTIVO (OITM - Class A)            │

│                   Código: VH-TRUCK-01 | Descripción: Camión de Reparto │

│                   Estado: Activo | Fecha Capitalización: 2026-01-15    │

└────────────────────────────────────────────────────────────────────────┘


4. CASO DE NEGOCIO RESUELTO: FLOTA DE CAMIONES EN OEC COMPUTERS
Escenario de Consultoría:
Bryce, contador de OEC Computers, necesita incorporar a los libros un camión de reparto adquirido por $60,000.00 USD.

Vida útil estimada: 5 años (60 meses).
Método de amortización: Lineal con cálculo mensual.
Política de presentación contable: Método indirecto con cuenta de amortización acumulada.
Parametrización y Trazabilidad en SAP Business One:
Configuración de la Clase de Amortización:
Código: LIN_60M | Método: Línea recta | Base de cálculo: Anual | Método de cálculo: Valor de adquisición / Vida útil total.
Configuración de Cuentas:
Código: FA_VEHICULOS.
Cuenta de Activo: 150100 - Flota de Transporte.
Amortización Acumulada: 150190 - Amort. Acum. Flota de Transporte.
Gasto de Amortización: 680100 - Gasto Amortización Vehículos.
Configuración de la Clase de Activo:
Código: VEH_PESADOS | Área Principal GAAP asignada a FA_VEHICULOS con clase LIN_60M y Vida Útil: 60 meses.
Alta y Capitalización:
Bryce crea el activo TRUCK-001, le asigna la clase VEH_PESADOS y contabiliza la Factura de Proveedor por $60,000.00.
El estado cambia inmediatamente de Nuevo a Activo.
En la pestaña Amortización, el sistema proyecta una cuota mensual constante de $1,000.00 USD/mes ($60,000 / 60 meses) durante los siguientes 5 ejercicios fiscales.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Qué sucede en SAP Business One una vez que se marca y actualiza la casilla "Activar activos fijos" en Detalles de la empresa?
A) Se puede desactivar en cualquier momento si la empresa decide no usar el módulo.
B) La opción se bloquea de forma permanente e irreversible, quedando habilitado el menú de activos fijos sin posibilidad de revertir la casilla.
C) Se eliminan las listas de precios de venta.
D) El inventario físico se bloquea automáticamente.
Respuesta Correcta: B
Justificación Técnica: La habilitación del módulo de activos fijos en la inicialización básica de la sociedad es estrictamente irreversible según la arquitectura del sistema.
Pregunta 2
En la configuración de Áreas de Amortización, ¿cuál es la diferencia funcional entre el método de "Contabilización Indirecta" y el de "Contabilización Directa"?
A) La directa no genera asientos y la indirecta sí.
B) En la contabilización indirecta el crédito del asiento de amortización se imputa a la cuenta de Amortización Acumulada preservando el costo histórico del bien, mientras que en la directa se acredita directamente la cuenta de balance del activo reduciendo su valor nominal.
C) La indirecta solo se usa para activos intangibles.
D) La directa requiere autorización manual de la gerencia cada mes.
Respuesta Correcta: B
Justificación Técnica: La contabilización indirecta refleja la amortización en una cuenta compensatoria de activo (Amortización Acumulada), cumpliendo con los estándares de revelación patrimonial de GAAP e IFRS.
Pregunta 3
Si una empresa adquiere 150 laptops idénticas para sus desarrolladores y desea que cada una tenga su propio número de inventario y placa física de seguimiento, ¿cuál es la mejor práctica en SAP B1?
A) Crear 150 líneas manuales en la factura de proveedores una por una.
B) Utilizar la función de "Activo Fijo Virtual", ingresando la cantidad de 150 en una única fila de la factura para que el sistema genere automáticamente los 150 registros maestros individuales de activo.
C) Manejar las laptops como artículos de consumo no capitalizables.
D) Dar de alta una sola laptop y multiplicar el precio por 150 en el campo de texto.
Respuesta Correcta: B
Justificación Técnica: El concepto de Activo Fijo Virtual actúa como una plantilla en documentos de compras, desdoblando automáticamente compras masivas en expedientes individuales de activo fijo con series únicas.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
