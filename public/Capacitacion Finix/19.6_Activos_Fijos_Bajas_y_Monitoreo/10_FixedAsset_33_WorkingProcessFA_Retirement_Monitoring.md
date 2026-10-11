UNIDAD 046: ACTIVOS FIJOS - BAJA, VENTA Y MONITOREO DEL VALOR (SAP BUSINESS ONE 10.0)
Código de Manual: 10_FixedAsset_33_WorkingProcessFA_Retirement_Monitoring
Módulo Oficial: Finanzas / Activos Fijos (Fixed Assets - FA)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Financieros, Contadores de Activos Fijos, Auditores y Agentes IA (Antigravity)
Carpeta Asociada: 046_10_FixedAsset_33_WorkingProcessFA_Retirement_Monitoring


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "046",

  "topic": "Fixed Assets Retirement and Value Monitoring",

  "sap_module": "Financials_FixedAssets",

  "database_tables": {

    "asset_master_header": "OITM (ItemClass = 'A')",

    "asset_depreciation_parameters": "ITM7",

    "asset_period_values": "ITM8",

    "retirement_document_header": "ODPV",

    "retirement_document_lines": "DPV1",

    "ar_invoice_header": "OINV",

    "gl_account_determination": "OACR",

    "depreciation_areas": "ODPA",

    "asset_classes": "OACS"

  },

  "menu_paths": [

    "Finanzas > Activos fijos > Baja",

    "Ventas - Clientes > Factura de clientes",

    "Finanzas > Activos fijos > Informes de activo fijo > Cuadro de activos fijos",

    "Finanzas > Activos fijos > Informes de activo fijo > Previsión de amortización",

    "Finanzas > Activos fijos > Informes de activo fijo > Informe de estado de activo fijo",

    "Finanzas > Activos fijos > Informes de activo fijo > Informe de transacciones de activo fijo"

  ],

  "retirement_methods": {

    "Sales_Retirement": {

      "trigger": "Factura de Clientes (OINV)",

      "prerequisite": "El Activo Fijo debe estar marcado como 'Artículo de venta' (SellItem = 'Y') en OITM",

      "mechanism": "La Factura de Clientes genera automáticamente un documento de Baja en segundo plano",

      "journal_entry_invoice": {

        "debit": "Cuenta de Clientes (OCRD)",

        "credit": "Cuenta de Compensación de Ingresos por Baja (Revenue Clearing Account)"

      },

      "journal_entry_retirement": {

        "debit": "Cuenta de Compensación de Ingresos por Baja",

        "debit_depr": "Cuenta de Amortización Acumulada",

        "credit": "Cuenta de Balance del Activo Fijo (Coste de Adquisición APC)",

        "balancing": "Cuenta de Ganancia o Pérdida por Enajenación de Activos Fijos"

      }

    },

    "Scrapping_Retirement": {

      "trigger": "Documento de Baja directo (ODPV / Finanzas > Activos fijos > Baja)",

      "use_case": "Desguace, obsolescencia, daño irreparable o siniestro sin cliente involucrado",

      "journal_entry": {

        "debit": "Cuenta de Amortización Acumulada",

        "debit_loss": "Cuenta de Pérdida por Desguace / Baja de Activos (Scrapping Loss Account)",

        "credit": "Cuenta de Balance del Activo Fijo (APC)"

      }

    }

  },

  "posting_modes": {

    "Gross_Posting": "La cuenta de gastos registra el valor bruto y se contabiliza el ingreso íntegro por separado",

    "Net_Posting": "El sistema calcula el resultado neto (Beneficio o Pérdida) compensando el Valor Neto Contable contra el precio de venta"

  },

  "asset_lifecycle_state_after_full_retirement": {

    "asset_status": "Inactivo (Inactive)",

    "net_book_value_nbv": 0.00,

    "balance_sheet_subledger_value": 0.00,

    "partial_retirement_behavior": "El activo permanece Activo con el Valor Neto Contable remanente y amortiza sobre el saldo residual hasta el fin de la vida útil"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Concepto de Baja de un Activo Fijo (Retirement)
La baja de un activo fijo representa la salida física y contable del bien (o de una fracción del mismo) del patrimonio y del balance general de la compañía. Ocurre cuando el bien llega al término de su vida útil, cuando es enajenado a un tercero, o cuando sufre un siniestro u obsolescencia tecnológica.

En SAP Business One 10.0, la baja puede ejecutarse mediante dos vías funcionales:

Baja por Venta con Factura de Clientes:
Utilizada cuando existe un comprador.
Requisito mandatorio: El maestro del activo en OITM debe tener marcada la casilla Artículo de venta (SellItem = 'Y').
Al emitir la Factura de Clientes (OINV), SAP Business One realiza una operación en dos fases sincronizadas:
La factura genera el cobro al cliente contra una Cuenta de Compensación de Ingresos por Baja (cuenta puente).
En el mismo instante, el sistema crea en segundo plano un Documento de Baja (ODPV) que cancela la cuenta puente, da de baja el Coste Histórico de Adquisición y Producción (APC), cancela la Amortización Acumulada histórica y calcula automáticamente la Ganancia o Pérdida neta de la venta.
Baja Directa por Desguace (Scrapping):
Utilizada cuando el activo se destruye, dona o descarta sin transacción comercial con un cliente.
Se registra directamente desde Finanzas > Activos fijos > Baja.
Cancela el valor contable del activo cargando el Valor Neto Contable (VNC) remanente a una cuenta de pérdidas por desguace.
2.2 Baja Total vs. Baja Parcial
Baja Total: Se retira el 100% de la cantidad o del costo. El estatus del activo cambia automáticamente a Inactivo, su Valor Neto Contable pasa a cero y no puede ser seleccionado en futuras transacciones operativas.
Baja Parcial: Se puede especificar una cantidad parcial (si el activo gestiona unidades) o un porcentaje/monto del coste APC. El activo permanece en estado Activo, recalculando las cuotas de amortización futuras sobre el valor remanente no dado de baja.
2.3 Monitoreo del Valor del Activo Fijo
SAP Business One ofrece un conjunto de herramientas para auditar el valor patrimonial de los activos:

Subpestañas "Valores" y "Amortización" en Datos Maestros del Activo:
Permite inspeccionar año por año el APC inicial, adquisiciones del ejercicio, bajas, amortización ordinaria calculada y el Valor Neto Contable (VNC) resultante, tanto para el área fiscal GAAP como para el área informativa IFRS.
Cuadro de Activos Fijos (Asset History Sheet):
Es el reporte más importante y el suplemento oficial al Balance General. Muestra la evolución patrimonial de cada cuenta de mayor de activo fijo: saldo inicial, altas, bajas, transferencias, amortizaciones acumuladas y saldo de cierre. Puede emitirse por área de amortización local o IFRS.
Previsión de Amortización (Asset Depreciation Forecast Report):
Proyecta las cuotas de amortización esperadas para ejercicios futuros. Si el año fiscal aún no está formalmente creado en el calendario contable de SAP, el sistema predice los valores y los identifica con un asterisco (*).
Informe de Estado del Activo (Asset Status Report):
Ofrece un inventario consolidado de todos los activos del ejercicio (activos, inactivos, capitalizados o pendientes).
Informe de Transacciones de Activo Fijo (Asset Transaction Report):
Historial cronológico de todos los eventos del activo (capitalizaciones, notas de crédito, traslados, amortizaciones y bajas).


3. ATLAS DIDÁCTICO: EL CIRCUITO CONTABLE DE LA BAJA POR VENTA
[ PASO 1: FACTURA DE CLIENTES ]

  Debe:  Cliente (OCRD)                                $2,000

  Haber: Cuenta Compensación de Ingresos (OACR)                 $2,000

                  │ (Generación automática simultánea)

                  ▼

[ PASO 2: DOCUMENTO DE BAJA AUTOMÁTICO ]

  Debe:  Cuenta Compensación de Ingresos (OACR)        $2,000

  Debe:  Amortización Acumulada                        $7,000

  Haber: Cuenta de Balance del Activo (APC)                     $8,000

  Haber: Beneficio en Venta de Activo Fijo                      $1,000

Interpretación Técnica: Un camión comprado originalmente en $8,000 con amortización acumulada de $7,000 (VNC = $1,000) se vende en $2,000. El resultado contable arroja una ganancia neta patrimonial de $1,000 USD.


4. CASO DE NEGOCIO RESUELTO: RENOVACIÓN DE FLOTA EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers adquirió un camión de reparto (TRUCK-01) por $30,000.00 USD. Tras 4 años de servicio, la amortización acumulada registrada es de $24,000.00 USD (Valor Neto Contable residual = $6,000.00 USD). La gerencia decide vender el camión a un distribuidor logístico por $7,500.00 USD.
Procedimiento Operativo:
En Datos Maestros de Artículo para TRUCK-01, se verifica que la casilla Artículo de venta esté activa.
En Ventas - Clientes > Factura de clientes, se selecciona al cliente, el artículo TRUCK-01 y el precio de $7,500.00 USD.
Al pulsar Crear:
La factura registra la cuenta por cobrar al cliente por $7,500 y acredita la cuenta puente de compensación.
El sistema genera el documento de Baja automático:
Cancela la cuenta puente de $7,500 (Debe).
Debita la Amortización Acumulada de Camiones por $24,000 (Debe).
Acredita la Cuenta de Activo Fijo Camiones por el APC histórico de $30,000 (Haber).
Acredita la cuenta Beneficio por Enajenación de Activos por la ganancia de $1,500.00 USD ($7,500 venta - $6,000 VNC).
El camión TRUCK-01 pasa a estatus Inactivo y su VNC queda en $0.00 USD.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Para poder vender un activo fijo directamente a través del documento de Factura de Clientes (A/R Invoice) en SAP Business One, ¿cuál es el requisito de configuración indispensable en la ficha del activo?
A) El activo debe pertenecer obligatoriamente al grupo de artículos "Servicios".
B) Debe marcarse la casilla "Artículo de venta" (Sales Item) en los Datos Maestros del Activo.
C) El activo debe estar amortizado al 100% previamente.
D) Debe generarse primero una orden de fabricación de desensamblaje.
Respuesta Correcta: B
Justificación Técnica: Si el activo no está marcado como artículo de venta (SellItem = 'Y'), la ventana de Factura de Clientes no permitirá seleccionarlo en las líneas del documento comercial.
Pregunta 2
¿Cuál de los siguientes reportes constituye el suplemento oficial y más importante al Balance General para auditar la evolución de los activos fijos en un ejercicio contable?
A) Informe de Transacciones de Activo Fijo.
B) Cuadro de Activos Fijos (Asset History Sheet).
C) Lista de Contabilización de Inventarios.
D) Previsión de Amortización.
Respuesta Correcta: B
Justificación Técnica: El Cuadro de Activos Fijos (Asset History Sheet) desglosa por cuenta de balance los saldos de apertura, capitalizaciones, retiros, traslados, amortizaciones del ejercicio y saldo de cierre, sirviendo como anexo legal a los estados financieros.
Pregunta 3
¿Qué sucede con el estatus y el Valor Neto Contable (Net Book Value) de un activo fijo cuando se procesa una BAJA TOTAL en el sistema?
A) El estatus permanece "Activo" pero se congela por 5 años.
B) El estatus cambia automáticamente a "Inactivo" y su Valor Neto Contable se establece en 0.00.
C) El registro maestro se borra de la base de datos de inmediato.
D) Se transfiere automáticamente como artículo de inventario disponible para la venta.
Respuesta Correcta: B
Justificación Técnica: La baja total extingue la vida económica del bien en la empresa: el maestro pasa a inactivo para impedir nuevos movimientos y el VNC se salda a cero.