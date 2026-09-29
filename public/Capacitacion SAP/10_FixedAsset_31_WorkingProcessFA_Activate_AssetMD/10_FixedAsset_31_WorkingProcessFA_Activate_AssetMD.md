UNIDAD 044: ACTIVACIÓN DE DATOS MAESTROS Y CAPITALIZACIÓN DE ACTIVOS FIJOS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_FixedAsset_31_WorkingProcessFA_Activate_AssetMD
Módulo Oficial: Finanzas / Activos Fijos (Fixed Assets - Activation & Capitalization)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Contadores de Activos, Encargados de Compras y Agentes IA (Antigravity)
Carpeta Asociada: 044_10_FixedAsset_31_WorkingProcessFA_Activate_AssetMD


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "044",

  "topic": "Asset Master Data Activation, Capitalization & Purchasing Integration",

  "sap_module": "FixedAssets_Capitalization",

  "transactional_documents": {

    "direct_capitalization": {

      "document": "Capitalización (Capitalization)",

      "table_header": "OACQ",

      "table_lines": "ACQ1",

      "menu_path": "Finanzas > Activos fijos > Capitalización",

      "use_case": "Altas directas sin factura comercial de proveedor o activos construidos por la propia empresa"

    },

    "ap_invoice_capitalization": {

      "document": "Factura de proveedores (A/P Invoice)",

      "table_header": "OPCH",

      "table_lines": "PCH1",

      "menu_path": "Compras - Proveedores > Factura de proveedores",

      "use_case": "Compra formal de activos a terceros. Genera automáticamente el documento OACQ en segundo plano"

    }

  },

  "accounting_flow_two_legs": {

    "leg_1_ap_invoice": {

      "debit": "Cuenta de Compensación de Adquisición (Acquisition Clearing Account)",

      "debit_tax": "IVA Soportado / Crédito Fiscal",

      "credit": "Cuenta Asociada del Proveedor (Pasivo Exigible)"

    },

    "leg_2_capitalization": {

      "debit": "Cuenta de Balance del Activo Fijo (Asset Balance Sheet Account)",

      "credit": "Cuenta de Compensación de Adquisición (Queda saldada en 0.00)"

    },

    "net_combined_effect": "Debe: Activo Fijo (Costo Histórico APC) | Haber: Proveedor (Deuda Comercial)"

  },

  "asset_value_date_rules": {

    "field": "AssetValueDate (Fecha de Valor del Activo)",

    "location": "Pestaña Finanzas del documento comercial o cabecera de OACQ",

    "impact": "Fija la 'Fecha de Capitalización' en el Maestro del Activo y determina el inicio del cálculo de amortizaciones planificadas",

    "restriction": "Puede diferir de la fecha de contabilización y de documento, pero debe pertenecer al mismo ejercicio fiscal"

  },

  "virtual_asset_rules": {

    "creation_restriction": "Los activos virtuales SOLO pueden capitalizarse mediante Facturas de Proveedores (OPCH)",

    "invoice_exclusivity": "Una misma factura de proveedores puede incluir múltiples líneas de activos virtuales, pero NO puede mezclar activos virtuales con activos fijos normales en el mismo documento",

    "template_behavior": "El activo virtual actúa como molde; no tiene valores en la pestaña Activos Fijos y engendra N expedientes independientes con correlativo automático"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Concepto Contable de Capitalización
La Capitalización (Capitalization) es el acto contable y administrativo mediante el cual los Costos de Adquisición y Producción (CAP / APC) de un bien se incorporan al balance general de la empresa como un Activo Fijo tangible o intangible, transformando un desembolso financiero en un activo patrimonial amortizable.

En SAP Business One 10.0, la activación del activo puede ejecutarse por dos vías:

Vía Documental Directa (Capitalización - OACQ): Se utiliza cuando no interviene un proveedor externo o cuando la factura fiscal fue contabilizada por separado como anticipo. El usuario registra la capitalización directa, imputando Débito a la cuenta de activo y Crédito a la cuenta de compensación de adquisiciones.
Vía Integrada de Compras (Factura de Proveedores - OPCH): Es la vía estándar corporativa. Al seleccionar un código de activo fijo en una factura de compras, SAP Business One genera dos asientos contables simétricos y enlazados en un único clic.
2.2 El Circuito de Asientos Contables y la Cuenta de Compensación
Para garantizar una auditoría financiera transparente, el sistema no acredita directamente al proveedor contra el activo en una sola línea opaca. Desglosa la operación a través de una Cuenta Puente de Compensación de Adquisición (Acquisition Clearing Account):

Asiento 1 (Factura de Proveedor):
Debe: Cuenta de Compensación de Adquisición por el costo neto del bien.
Debe: IVA Crédito Fiscal.
Haber: Cuenta de Proveedores por el total facturado.
Asiento 2 (Documento de Capitalización generado en background):
Debe: Cuenta de Balance del Activo Fijo (incremento patrimonial).
Haber: Cuenta de Compensación de Adquisición.
Resultado Neto: La cuenta de compensación queda completamente en $0.00 USD, el activo queda registrado al valor histórico exacto en el balance y la deuda con el proveedor queda formalizada en el pasivo.
2.3 La Fecha de Valor del Activo (Asset Value Date)
Un aspecto crítico en la parametrización es la Fecha de Valor del Activo:

Por defecto, el sistema sugiere la misma fecha de contabilización de la factura.
No obstante, el contador puede modificarla en la pestaña Finanzas del documento antes de crear la factura.
Esta fecha se traslada directamente al campo CapitalizationDate en la ficha maestra del activo (OITM).
Impacto en Amortización: Las cuotas de amortización planificadas del activo se calculan a partir de la Fecha de Valor del Activo. Si un camión se compra el 28 de enero pero su puesta en marcha operativa (Fecha de Valor) es el 1 de marzo, la amortización comenzará a correr a partir de marzo.
2.4 Capitalización Masiva de Activos Fijos Virtuales
Cuando una empresa adquiere activos idénticos en grandes cantidades (ej. 50 computadoras para un centro de cómputo):

Se crea un artículo plantilla marcado con la casilla Activo Virtual (Virtual Item).
En la Factura de Proveedores se selecciona este ítem virtual y se introduce Cantidad = 50.
Al presionar Crear:
SAP Business One genera automáticamente 50 fichas maestras de activo fijo individuales (OITM), asignándoles números de serie sucesivos según la serie definida en Numeración de documentos.
Cada una de las 50 fichas hereda la clase de activo, vida útil y cuentas contables del activo virtual.
Se genera un único documento de Capitalización (OACQ) que capitaliza los 50 activos de forma instantánea.


3. ATLAS DIDÁCTICO: EL CIRCUITO DE CONTABILIZACIÓN EN 2 PASOS
┌────────────────────────────────────────────────────────────────────────┐

│                     COMPRA DE ACTIVO FIJO EN SAP B1                    │

└───────────────────────────────────┬────────────────────────────────────┘

                                    │

           ┌────────────────────────┴────────────────────────┐

           ▼                                                 ▼

[ PASO 1: FACTURA PROVEEDOR ]                     [ PASO 2: CAPITALIZACIÓN ]

• Debe: Cuenta Compensación ($6,000)              • Debe: Cuenta Activo Balance ($6,000)

• Haber: Proveedor ($6,000)                       • Haber: Cuenta Compensación ($6,000)

           │                                                 │

           └────────────────────────┬────────────────────────┘

                                    ▼

                 [ RESULTADO EN EL LIBRO MAYOR ]

                 • Cuenta Compensación: Saldo = $0.00

                 • Activo Fijo (Activo): +$6,000.00

                 • Proveedor (Pasivo):   -$6,000.00


4. CASO DE NEGOCIO RESUELTO: ALTA DEL CAMIÓN EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers formaliza la compra de su nuevo camión de reparto TRUCK-001 con el concesionario Vehículos del Norte S.A. por $6,000.00 USD netos.

La factura fiscal tiene fecha de emisión 15 de Enero.
La puesta a punto del furgón concluye el 1 de Febrero (Fecha de Valor del Activo).
Ejecución Transaccional:
El usuario de compras abre Factura de proveedores (OPCH).
Selecciona el proveedor V10000 y en la línea selecciona el activo TRUCK-001.
En la pestaña Finanzas, cambia la Fecha de Valor del Activo al 01/02/2026.
Al pulsar Crear:
Se crea la Factura 1044 y el documento de Capitalización 12.
El estado del activo en OITM pasa automáticamente de Nuevo a Activo.
El plan de amortización mensual de $500/mes arranca formalmente a partir del 1 de febrero de 2026, respetando la fecha de puesta en marcha.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es la función contable de la "Cuenta de Compensación de Adquisición" utilizada durante la compra de un activo fijo mediante una Factura de Proveedores?
A) Registrar las comisiones bancarias del crédito automotriz.
B) Servir como cuenta puente transitoria entre la Factura de Proveedores y la Capitalización automática, quedando con saldo cero una vez completada la transacción.
C) Pagar los impuestos de matriculación vehicular.
D) Acumular la depreciación del primer mes.
Respuesta Correcta: B
Justificación Técnica: La cuenta de compensación absorbe el débito de la factura de compra y se acredita inmediatamente con el asiento de capitalización del activo, garantizando la perfecta conciliación entre cuentas por pagar y el libro auxiliar de activos fijos.
Pregunta 2
¿Qué parámetro del documento de compra determina la fecha en que un activo fijo comienza formalmente su ciclo de amortización planificada?
A) La fecha de vencimiento de la factura del proveedor.
B) La Fecha de Valor del Activo (Asset Value Date), la cual actualiza la Fecha de Capitalización en los datos maestros del activo.
C) La fecha del sistema del servidor.
D) La fecha del pedido de compra original.
Respuesta Correcta: B
Justificación Técnica: La Fecha de Valor del Activo fija el momento contable de puesta en servicio del activo y determina el inicio del cómputo de cuotas de amortización en el calendario financiero.
Pregunta 3
Respecto al uso de "Activos Fijos Virtuales" para compras masivas, ¿cuál de las siguientes restricciones es estrictamente obligatoria en SAP Business One?
A) Los activos virtuales solo pueden utilizarse para comprar licencias de software.
B) No es posible incluir en una misma Factura de Proveedores tanto activos virtuales como activos fijos normales simultáneamente; deben procesarse en facturas separadas.
C) Los activos virtuales deben pagarse siempre en efectivo.
D) No se permite asignar números de serie a los activos generados.
Respuesta Correcta: B
Justificación Técnica: SAP Business One no permite mezclar líneas de activos fijos convencionales con líneas de activos fijos virtuales en el mismo documento comercial de compras.