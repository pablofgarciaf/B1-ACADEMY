UNIDAD 013: ACTIVOS FIJOS VIRTUALES Y COMPRAS MASIVAS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_FixedAsset_12_FixedAsset_Intro_Virtual_Asset_ES
Módulo Oficial: Finanzas / Activos Fijos (Financials - Virtual Fixed Assets)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Responsables de Compras Internas, Auditores de Activos Fijos y Agentes IA (Antigravity)
Carpeta Asociada: 013_10_FixedAsset_12_FixedAsset_Intro_Virtual_Asset_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "013",

  "topic": "Virtual Fixed Assets & Automated Bulk Capitalization",

  "sap_module": "Financials_FixedAssets_Virtual",

  "master_prerequisites": {

    "numbering_series_required": "La casilla 'Artículo virtual' solo está disponible si los Datos Maestros de Activo Fijo utilizan Series de Numeración automáticas (NNM1).",

    "item_classification": "OITM.ItemClass = 'A' (Activo fijo)",

    "virtual_flag": "OITM.IsVirtual = 'Y' (Actúa exclusivamente como molde/plantilla sin valores contables propios)"

  },

  "database_tables": {

    "virtual_master_template": "OITM (IsVirtual = 'Y')",

    "generated_asset_masters": "OITM (IsVirtual = 'N', creados automáticamente en lote)",

    "ap_invoice": "OPCH / PCH1",

    "capitalization_document": "OACQ / ACQ1",

    "asset_serial_numbers": "OITM (SerialNum / Attr1) & tablas auxiliares de series de activo"

  },

  "menu_paths": [

    "Finanzas > Activos fijos > Datos maestros de activo fijo > Casilla 'Artículo virtual'",

    "Compras - proveedores > Factura de proveedores",

    "Gestión > Definición > Finanzas > Activos fijos > Series de numeración"

  ],

  "automation_rules": {

    "generation_mechanism": "Al agregar una Factura de Proveedores con un Artículo Virtual y Cantidad = N, SAP Business One crea automáticamente N registros de Datos Maestros de Activos Fijos independientes.",

    "capitalization_trigger": "Los N activos recién creados se capitalizan inmediatamente en un único documento de Capitalización (OACQ) vinculado al asiento contable.",

    "invoice_exclusivity_rule": "En una misma Factura de Proveedores se pueden incluir múltiples artículos virtuales distintos, pero NUNCA se pueden mezclar artículos virtuales con activos fijos normales."

  },

  "serial_number_enforcement": {

    "checkbox": "Forzar números de serie (Enforce Serial Numbers)",

    "operational_requirement": "Obliga a capturar un número de serie individual por cada unidad comprada mediante clic derecho en la Factura de Proveedores > 'Números de serie de activo fijo'.",

    "nature_of_serial": "Son números de serie específicos de activo fijo para seguimiento patrimonial y garantías; NO son números de serie de inventario comercial (el activo no puede ser artículo de inventario)."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Desafío de las Adquisiciones Corporativas Masivas
Cuando una organización adquiere bienes de uso interno en gran escala —por ejemplo, 50 computadoras portátiles para el departamento comercial, 100 teléfonos celulares corporativos o 200 sillas de oficina— el método tradicional de activos fijos exige crear 50, 100 o 200 registros maestros individuales en el sistema antes de registrar la factura de compra. Esto representa una carga administrativa lenta, propensa a inconsistencias tipográficas y redundante.

Para resolver este cuello de botella, SAP Business One 10.0 incorpora el concepto de Activo Fijo Virtual (Virtual Asset).
2.2 Arquitectura del Activo Fijo Virtual
Un activo virtual es un registro maestro en OITM configurado como artículo modelo / plantilla:

Requisito Técnico Mandatorio: La sociedad debe tener configuradas Series de Numeración Automáticas para los datos maestros de activo fijo (Gestión > Inicialización del sistema > Numeración de documentos). Si la numeración es manual, la casilla Artículo virtual permanece deshabilitada porque el sistema no podría asignar códigos correlativos a los activos creados en lote.
Naturaleza del Molde: El artículo virtual almacena la Clase de Activo, las Áreas de Amortización, la Determinación de Cuentas y la Vida Útil, pero carece de valores monetarios propios. No tiene costo histórico ni depreciación acumulada.
Regla de Exclusividad en Factura: En una Factura de Proveedores se pueden ingresar varias líneas de activos virtuales (ej. 10 laptops modelo X y 20 monitores modelo Y), pero está estrictamente prohibido combinar en el mismo documento un activo virtual con un activo fijo estándar unitario.
2.3 Proceso Transaccional y Capitalización Automática
El comprador registra la Factura de Proveedores (OPCH), selecciona el código del activo virtual (ej. VIRT-MOBILE) e indica en la columna cantidad el número de unidades adquiridas (ej. 9).
Al pulsar Crear/Añadir, el motor de activos fijos ejecuta dos acciones automáticas en segundo plano:
Clonación Maestra: Genera 9 fichas de Datos Maestros de Activo Fijo completamente nuevas (OITM), asignando el siguiente número disponible de la serie (ej. MOB-001 a MOB-009). Cada una de estas 9 fichas tiene la casilla Artículo virtual desmarcada, convirtiéndose en activos reales y autónomos.
Emisión de Capitalización: Crea un único documento de Capitalización (OACQ) que referencia los 9 activos generados y registra el asiento contable en el Libro Mayor, debitando la cuenta de balance de activo y acreditando al proveedor.
2.4 Control Unitario mediante "Forzar Números de Serie"
Para activos tecnológicos de alto valor que requieren seguimiento de garantías o asignación a empleados:

Si en el activo virtual se marca la casilla Forzar números de serie, el sistema impide crear la factura de proveedores hasta que el usuario digite los números de serie individuales de los fabricantes.
En la factura, mediante clic derecho se accede a Números de serie de activo fijo: Configuración y se ingresan los 9 números de serie físicos.
Cada uno de los 9 activos generados heredará su respectivo número de serie en su ficha maestra para auditorías de inventario físico.


3. ATLAS DIDÁCTICO: COMPARATIVA DE COMPRA CONVENCIONAL VS ACTIVO VIRTUAL
   MÉTODO TRADICIONAL (Sin Activo Virtual)

   [Crear Manualmente 10 Fichas] ──> [Factura con 10 Líneas Individuales] ──> [10 Capitalizaciones]

   (Alto tiempo de digitación, alto riesgo de error humano)

   MÉTODO CON ACTIVO FIJO VIRTUAL

   [Crear 1 Ficha Modelo Virtual] ──> [Factura de Proveedor con 1 sola línea (Cant: 10)]

                                                         │

                                                         ▼

                                 ┌───────────────────────────────────────────────┐

                                 │       SAP B1 Genera en Segundo Plano:         │

                                 │ • 10 Fichas Maestras Individuales (Auto-ID)   │

                                 │ • 1 Documento de Capitalización Consolidado   │

                                 │ • 1 Asiento en Libro Mayor (OJDT)             │

                                 └───────────────────────────────────────────────┘


4. CASO DE NEGOCIO RESUELTO: RENOVACIÓN TECNOLÓGICA EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers adquiere 9 teléfonos inteligentes para el equipo de consultoría técnica:

Proveedor: Telecom Global Corp
Costo unitario: $400.00 USD (Total compra: $3,600.00 USD)
Vida útil: 24 meses
Modelo: Activo virtual con forzado de números de serie para control de IMEI.
Configuración y Flujo Operativo:
Definición de la Plantilla:
Bryce crea el artículo maestro VIRT-TEL-CORP en OITM, clase de artículo Activo fijo, marca la casilla Artículo virtual y marca Forzar números de serie.
Registro de la Factura de Proveedores:
Se selecciona el proveedor y se añade la línea con el artículo VIRT-TEL-CORP por cantidad = 9 a precio unitario de $400.00.
Captura de Series (IMEI):
Bryce hace clic derecho en la fila y abre Números de serie de activo fijo, digitando los 9 códigos IMEI (IMEI-01 a IMEI-09).
Impacto en el Sistema:
Al guardar la factura:
Se crean instantáneamente los activos TEL-1001 a TEL-1009.
Cada activo contiene su respectivo código IMEI grabado en su ficha.
Se emite el documento de Capitalización por $3,600.00 USD, debitando la cuenta de Equipos de Comunicación y acreditando la cuenta de Proveedores.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es la condición técnica indispensable en la configuración de la empresa para poder habilitar la casilla "Artículo virtual" en un registro de activo fijo?
A) Que el almacén tenga ubicaciones activadas.
B) Que se utilicen Series de Numeración automáticas para los Datos Maestros de Activo Fijo.
C) Que el activo se deprecie en menos de 12 meses.
D) Que el proveedor esté localizado en el extranjero.
Respuesta Correcta: B
Justificación Técnica: La creación masiva automatizada de fichas maestras requiere que el sistema tenga la potestad de generar códigos identificadores correlativos automáticos según las reglas de la serie de numeración definida.
Pregunta 2
¿Qué documentos comerciales permiten capitalizar un "Activo Fijo Virtual" en SAP Business One?
A) Ofertas de compra y pedidos de compra.
B) Únicamente la Factura de Proveedores (A/P Invoice).
C) Entradas de mercancías de inventario manuales.
D) Facturas de clientes y notas de crédito.
Respuesta Correcta: B
Justificación Técnica: El mecanismo de clonación y capitalización masiva de activos virtuales está programado de forma exclusiva para operar a través del documento de Factura de Proveedores.
Pregunta 3
¿Pueden combinarse en una misma Factura de Proveedores una línea con un Activo Fijo Virtual y otra línea con un Activo Fijo Normal?
A) Sí, sin ninguna restricción.
B) No, el sistema no permite incluir activos fijos virtuales y activos fijos normales en la misma factura de proveedores.
C) Solo si ambos activos pertenecen a la misma clase de activo.
D) Solo si la factura es en moneda extranjera.
Respuesta Correcta: B
Justificación Técnica: Para mantener la integridad del proceso de generación de activos en segundo plano, SAP Business One prohíbe mezclar activos convencionales unitarios con artículos plantilla virtuales en la misma transacción de compras.