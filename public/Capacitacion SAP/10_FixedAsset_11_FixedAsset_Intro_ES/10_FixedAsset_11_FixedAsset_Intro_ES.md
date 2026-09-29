UNIDAD 012: ACTIVOS FIJOS - INTRODUCCIÓN Y CICLO DE VIDA CONTABLE (SAP BUSINESS ONE 10.0)
Código de Manual: 10_FixedAsset_11_FixedAsset_Intro_ES
Módulo Oficial: Finanzas / Activos Fijos (Financials - Fixed Assets)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Contadores Generales, Auditores Financieros y Agentes IA (Antigravity)
Carpeta Asociada: 012_10_FixedAsset_11_FixedAsset_Intro_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "012",

  "topic": "Fixed Assets Introduction & Asset Life Cycle",

  "sap_module": "Financials_FixedAssets",

  "activation_prerequisite": {

    "menu_path": "Gestión > Inicialización del sistema > Detalles de la empresa > Inicialización básica",

    "checkbox": "Habilitar activos fijos",

    "critical_warning": "Una vez habilitada la solución de activos fijos en la base de datos, NO se puede desactivar."

  },

  "database_tables": {

    "asset_master_data": "OITM (ItemClass = 'A')",

    "asset_classes": "OACS",

    "depreciation_areas": "ODPA",

    "depreciation_types": "ODTY",

    "account_determination": "OACR",

    "capitalization_documents": "OACQ / ACQ1",

    "depreciation_runs": "ODPR / DPR1",

    "retirement_documents": "ORET / RET1",

    "asset_transfer": "OTRF / TRF1"

  },

  "configuration_hierarchy": {

    "Asset_Class": {

      "definition": "Vínculo maestro asignado a cada activo fijo en OITM",

      "inherits": ["Áreas de amortización", "Determinación de cuentas de mayor", "Clase de amortización"]

    },

    "Depreciation_Area": {

      "Principal_GAAP": "Área principal que genera asientos contables reales en el Libro Mayor (OJDT)",

      "Informative_IFRS": "Área adicional informativa para estados financieros internacionales (sin contabilización directa en el Mayor local)"

    },

    "Account_Determination": {

      "asset_balance_sheet_account": "Cuenta de mayor de balance donde reside el valor histórico de adquisición",

      "acquisition_clearing_account": "Cuenta transitoria puente para compra de activos fijos",

      "accumulated_depreciation_account": "Cuenta compensadora de activo (Haber) para amortización indirecta",

      "depreciation_expense_account": "Cuenta de pérdidas y ganancias (Debe) para gasto periódico",

      "revenue_clearing_account": "Cuenta transitoria para ingresos procedentes de bajas por venta"

    }

  },

  "life_cycle_phases": [

    { "phase": "1. Definición", "doc": "Datos maestros de activo fijo", "status": "Nuevo / Inactivo" },

    { "phase": "2. Capitalización", "doc": "Factura de proveedor (OPCH) o Capitalización directa (OACQ)", "status": "Activo" },

    { "phase": "3. Amortización", "doc": "Ejecución de amortización periódica (ODPR)", "status": "Activo" },

    { "phase": "4. Ajustes", "doc": "Transferencia de activo / Revalorización", "status": "Activo" },

    { "phase": "5. Baja", "doc": "Factura de clientes (OINV) o Documento de Baja (ORET)", "status": "Dado de baja (Net Book Value = 0)" }

  ]

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Activación e Integración de Activos Fijos en SAP B1
A partir de la versión 9.0 y perfeccionado en la versión 10.0, SAP Business One integra la gestión de activos fijos de forma nativa sin requerir add-ons externos.

Activación Irreversible: Se activa en Detalles de la empresa > Inicialización básica. Al marcar la casilla, se despliegan automáticamente los menús en Finanzas > Activos fijos y Gestión > Configuración > Finanzas > Activos fijos.
El Activo como Artículo Maestro (OITM): En SAP B1, cada activo fijo es un registro en los datos maestros de artículo con el campo Clase de artículo = Activo fijo (ItemClass = 'A'). Esto habilita pestañas especializadas de cálculo financiero (Valores, Amortización, Contabilidad de Costes y Atributos).
2.2 La Jerarquía Paramétrica: Clase, Área, Determinación y Amortización
Para garantizar consistencia y evitar que los usuarios configuren parámetros contables manualmente en cada compra, el sistema estructura una jerarquía estricta:

Clase de Activo Fijo (OACS): Define el grupo macro (ej. Vehículos Pesados, Maquinaria Industrial, Equipos de Cómputo). Cada activo se vincula a una clase y hereda automáticamente sus reglas.
Áreas de Amortización (ODPA): Permite multicuadre contable:
Área Principal (GAAP Local): Es obligatoria y es la única que contabiliza asientos en el Libro Mayor (OJDT).
Área Adicional (IFRS / Fiscal): Calcula depreciaciones bajo normativas internacionales o fiscales alternativas para emisión de reportes paralelos, sin duplicar asientos en el balance local.
Determinación de Cuentas (OACR): Asigna las cuentas de balance, gastos de depreciación, depreciación acumulada y cuentas de compensación para adquisiciones y bajas.
Clase de Amortización (ODTY): Define el algoritmo matemático de cálculo (Lineal, Cuotas Decrecientes, Amortización Especial) y la periodicidad del cálculo.
2.3 El Ciclo de Vida Financiero del Activo
A. Capitalización (Adquisición y Activación)
Ocurre mediante una Factura de Proveedores (OPCH) o un documento directo de Capitalización (OACQ).
Asiento contable generado:
Debe: Cuenta de Balance del Activo Fijo (incrementa el activo no corriente).
Haber: Cuenta Asociada del Proveedor (o Cuenta de Compensación de Adquisiciones).
La Fecha Valor de Activo define la fecha de inicio del cómputo de la vida útil, que puede ser anterior o coincidente con la fecha contable de la factura.
B. Ejecución de Amortización (ODPR)
Las amortizaciones no se contabilizan día a día, sino mediante el proceso masivo Finanzas > Activos fijos > Ejecución de amortización.
El sistema calcula las cuotas planificadas de todos los activos activos hasta la fecha de corte.
Amortización Indirecta (Estándar):
Debe: Cuenta de Gastos de Amortización (Pérdidas y Ganancias).
Haber: Cuenta de Amortización Acumulada (Activo Compensador / Pasivo de valoración).
La cuenta de balance histórica del activo no se altera hasta su baja definitiva.
Repetición de Ejecución: Si tras ejecutar la amortización se modifica retroactivamente el valor de un activo, el usuario puede repetir la ejecución para el mismo periodo; el sistema liquidará únicamente la diferencia neta.
C. Baja del Activo (Retirement)
Baja por Venta: Si el activo se vende a un tercero, se emite una Factura de Clientes (el activo debe estar marcado como Artículo de ventas en OITM). El sistema genera automáticamente el documento de Baja, calculando la ganancia o pérdida por enajenación de activos.
Baja por Desguace / Siniestro: Se registra directamente un documento de Baja (ORET) sin cliente, cancelando el costo histórico y la depreciación acumulada contra pérdidas extraordinarias.
El Valor Neto Contable (Net Book Value - NBV) pasa a ser exactamente $0.00.


3. ATLAS DIDÁCTICO: CICLO DE VIDA Y FÓRMULA DE VALOR NETO CONTABLE
$$\text{Valor Neto Contable (VNC)} = \text{Coste Histórico de Adquisición (APC)} - \text{Amortización Acumulada}$$

   [ 1. ALTA / DEFINICIÓN ]

   Ficha de Activo en OITM (Vida útil: 36 meses)

              │

              ▼

   [ 2. CAPITALIZACIÓN ]

   Factura de Proveedor por $6,000 USD (Fecha Valor: 01/Enero)

   • Debe: Activo Fijo (Vehículos) $6,000

   • Haber: Proveedor $6,000

              │

              ▼

   [ 3. AMORTIZACIÓN ANUAL ]

   Ejecución de Amortización Lineal ($2,000 / año)

   • Año 1: Gasto $2,000 | Amort. Acumulada $2,000 ==> VNC = $4,000

   • Año 2: Gasto $2,000 | Amort. Acumulada $4,000 ==> VNC = $2,000

   • Año 3: Gasto $2,000 | Amort. Acumulada $6,000 ==> VNC = $0

              │

              ▼

   [ 4. BAJA DEFINITIVA ]

   Factura de Venta / Documento de Baja

   • Cancela Coste Histórico ($6,000) y Amortización Acumulada ($6,000)

   • Saldo en Libro Auxiliar de Activos Fijos = $0.00


4. CASO DE NEGOCIO RESUELTO: GESTIÓN DE FLOTA EN OEC COMPUTERS
Escenario de Consultoría:
Bryce, contador de OEC Computers, necesita incorporar a la contabilidad un nuevo camión de reparto para el centro de distribución:

Código de Activo: VEH-CAMION-01
Clase de Activo: Vehículos Pesados
Método de amortización: Lineal
Vida útil: 36 meses (3 años)
Coste de adquisición: $6,000.00 USD
Fecha valor de adquisición: 01/01/2026
Ejecución Transaccional:
Alta: Bryce crea el artículo VEH-CAMION-01 con clase de artículo Activos fijos y le asigna la clase Vehículos Pesados.
Capitalización: Registra la Factura de Proveedores de la concesionaria por $6,000.00 USD. El sistema genera automáticamente el documento de Capitalización activando el activo en el balance.
Cierre del Primer Ejercicio: Al 31/12/2026, Bryce procesa la Ejecución de amortización. El sistema calcula 12 meses de depreciación: $$\text{Amortización Anual} = \frac{$6,000}{3} = $2,000.00\text{ USD}$$
Asiento registrado:
Debe: 520000 - Gasto de Amortización Vehículos = +$2,000.00
Haber: 179000 - Amortización Acumulada Vehículos = -$2,000.00
El informe Cuadro de activos fijos muestra: Coste Histórico $6,000.00, Amortización Acumulada $2,000.00 y Valor Neto Contable = $4,000.00 USD.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Qué consecuencia tiene habilitar la casilla "Habilitar activos fijos" en los Detalles de la Empresa en SAP Business One?
A) Activa temporalmente la función durante 30 días de prueba.
B) Habilita de manera definitiva e irreversible la suite de activos fijos en la base de datos, desplegando las opciones de menú y campos maestros en Finanzas y Gestión.
C) Convierte automáticamente todos los artículos de compras en activos fijos.
D) Bloquea el módulo de bancos hasta registrar un camión.
Respuesta Correcta: B
Justificación Técnica: La activación de activos fijos altera permanentemente la estructura de base de datos y esquemas de menú en la sociedad, impidiendo su desmarcación posterior.
Pregunta 2
En la configuración de Activos Fijos, ¿cuál es la diferencia fundamental entre el Área de Amortización Principal y un Área de Amortización Adicional?
A) El área principal solo calcula depreciaciones en moneda extranjera.
B) El área principal contabiliza transacciones reales en el Libro Mayor (OJDT) bajo la normativa local (GAAP), mientras que el área adicional se utiliza con fines informativos o de reporte (ej. IFRS) sin generar asientos directos en la contabilidad local.
C) El área adicional solo sirve para registrar activos intangibles.
D) No existe diferencia; ambas contabilizan asientos idénticos duplicando el saldo.
Respuesta Correcta: B
Justificación Técnica: SAP B1 utiliza el área principal para gobernar los balances fiscales locales y permite áreas derivadas para cumplir con marcos internacionales de reporte corporativo sin desajustar el Mayor legal.
Pregunta 3
Si una empresa decide vender un activo fijo a un cliente antes de que finalice su vida útil, ¿qué requisito debe cumplir la ficha del activo en los Datos Maestros de Artículo?
A) Debe tener costo cero en el almacén.
B) Debe estar marcada la casilla "Artículo de ventas" (Sales Item) en el registro de Datos Maestros para poder seleccionarlo en la Factura de Clientes.
C) Debe revalorizarse al 200% de su valor comercial.
D) Debe trasladarse previamente a una ubicación receptora.
Respuesta Correcta: B
Justificación Técnica: Para que cualquier artículo (incluidos los activos fijos) sea seleccionable en la interfaz de Factura de Clientes (OINV), debe tener activo el atributo comercial de venta en OITM.