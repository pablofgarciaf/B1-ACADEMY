# Guion de Video: DOC 062 Overview MasterData Docs

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 062 Overview MasterData Docs.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 062: DATOS MAESTROS Y DOCUMENTOS DE MARKETING (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Overview_13_MDDoc_ES
Módulo Oficial: Introducción y Conceptos Fundamentales (Overview)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Usuarios Clave, Analistas de Negocio y Agentes IA (Antigravity)
Carpeta Asociada: 062_10_Overview_13_MDDoc_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "062",

  "topic": "Master Data Concepts & Marketing Documents Architecture",

  "sap_module": "Core_Architecture",

  "database_tables": {

    "business_partners": {

      "master": "OCRD (CardType: 'C'=Cliente, 'S'=Proveedor, 'L'=Lead/Prospecto)",

      "contact_persons": "OCPR",

      "addresses": "CRD1",

      "payment_terms": "OCTG"

    },

    "items": {

      "master": "OITM",

      "item_groups": "OITB",

      "warehouses": "OWHS",

      "prices": "ITM1"

    },

    "marketing_documents_sales": {

      "quotation": { "header": "OQUT", "lines": "QUT1" },

      "order": { "header": "ORDR", "lines": "RDR1" },

      "delivery": { "header": "ODLN", "lines": "DLN1" },

      "return": { "header": "ORDN", "lines": "RDN1" },

      "invoice": { "header": "OINV", "lines": "INV1" },

      "credit_memo": { "header": "ORIN", "lines": "RIN1" }

    },

    "marketing_documents_purchases": {

      "purchase_order": { "header": "OPOR", "lines": "POR1" },

      "goods_receipt_po": { "header": "OPDN", "lines": "PDN1" },

      "ap_invoice": { "header": "OPCH", "lines": "PCH1" }

    },

    "drafts_and_references": {

      "draft_header": "ODRF",

      "draft_lines": "DRF1",

      "document_references": "RDR1 / INV1 (RefDocNum, RefDocType)"

    }

  },

  "menu_paths": [

    "Interlocutores comerciales > Datos maestros interlocutor comercial",

    "Inventario > Datos maestros de artículo",

    "Ventas - Clientes > [Cualquier documento de marketing]",

    "Compras - Proveedores > [Cualquier documento de marketing]",

    "Módulo Arrastrar y vincular (Drag & Relate)"

  ],

  "marketing_document_anatomy": {

    "structure_3_zones": {

      "Header": "Datos generales: Código IC, Nombre, Contacto, Moneda, Fechas (Contabilización, Vencimiento, Documento)",

      "Body_Tabs": [

        { "name": "Contenido", "desc": "Artículos o servicios transaccionados, cantidades, precios unitarios, descuentos y tipos de fila" },

        { "name": "Logística", "desc": "Direcciones de entrega (Destinatario) y fiscal (Pagar a), vía de expedición y términos de transporte" },

        { "name": "Finanzas / Contabilidad", "desc": "Condiciones de pago, cuenta asociada, indicador de impuestos y documentos referenciados" },

        { "name": "Anexos", "desc": "Archivos adjuntos (PDFs, especificaciones, contratos) vinculados a la ruta de anexos del servidor" }

      ],

      "Footer": "Comentarios del documento, encargado de compras/ventas, descuentos globales, gastos adicionales y totales"

    },

    "row_types_in_contents": {

      "Blank": "Línea regular de artículo inventariable o de servicio",

      "T": "Línea de texto libre o predefinido (instrucciones logísticas / técnicas sin impacto en importes)",

      "Sigma": "Línea de subtotal (calcula la sumatoria de las líneas precedentes)",

      "A": "Línea de artículo alternativo (exclusivo de Ofertas de Venta; no suma en el total del documento)"

    }

  },

  "relationship_tools": {

    "Relationship_Map": "Esquema gráfico interactivo en árbol. Muestra documentos base, documentos destino, asientos contables generados y partidas de reconciliación. El documento activo se resalta en amarillo.",

    "Referenced_Documents": "Permite vincular manualmente documentos independientes que no se generaron mediante 'Copiar a / Copiar de' (ej. Factura original con una Nota de Crédito posterior independiente).",

    "Drag_and_Relate": "Herramienta analítica visual ad-hoc que permite arrastrar un campo clave (ej. Código de Artículo o Código de Cliente) hacia cualquier nodo del menú para obtener un listado instantáneo de transacciones relacionadas."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 La Filosofía de Datos Maestros en SAP Business One
En SAP Business One, cada actividad comercial se documenta formalmente a través de transacciones estructuradas. Para evitar la redundancia operativa, inconsistencias ortográficas y errores contables, las transacciones se construyen a partir de bloques modulares reutilizables denominados Datos Maestros:

Interlocutores Comerciales (OCRD): Entidad maestra que consolida tres roles de negocio:
Clientes (Customers): Activos en el ciclo de ventas (Order to Cash).
Proveedores (Vendors): Activos en el ciclo de compras (Procure to Pay).
Clientes Potenciales (Leads): Entidades prospecto utilizadas en ofertas y oportunidades de venta. Pueden convertirse en Clientes regulares una vez confirmada la primera orden comercial sin perder su historial relacional.
Artículos (OITM): Bienes tangibles o intangibles que la empresa adquiere, almacena o comercializa.
Navegación Directa por Flecha Naranja: Característica ergonómica distintiva de SAP B1 que permite al usuario hacer clic en la flecha de enlace vinculada a cualquier dato maestro o de configuración para abrir instantáneamente la pantalla de parametrización subyacente.
2.2 Anatomía Universal de los Documentos de Marketing
Todos los documentos operativos de Ventas y Compras (Ofertas, Pedidos, Entregas, Entradas de Mercancías, Facturas y Abonos) comparten una arquitectura simétrica estandarizada dividida en tres áreas:

Cabecera: Identificación del socio de negocios, moneda de la transacción, series de numeración y fechas críticas.
Cuerpo Central (4 Pestañas Obligatorias):
Contenido: Matriz tabular de artículos/servicios. Permite alternar entre documento tipo Artículo (con control de inventario) o tipo Servicio (imputación contable directa sin códigos de ítem).
Logística: Direcciones físicas de entrega y facturación heredadas del maestro pero modificables para el envío actual.
Finanzas / Contabilidad: Términos crediticios y cuentas contables asociadas. Incluye el botón Documento de referencia.
Anexos: Repositorio de documentos electrónicos complementarios.
Pie de Página: Resumen de impuestos, descuentos globales, gastos de transporte y total líquido a pagar.
2.3 Tipología de Filas en la Pestaña Contenido
Mediante las Parametrizaciones de Formulario, los usuarios pueden habilitar la columna Tipo, la cual ofrece 4 comportamientos operativos:

Fila en Blanco (Normal): Registra un artículo o servicio transaccionable que afecta importes y stock.
Fila Tipo 'T' (Texto): Permite insertar bloques de texto enriquecido o leyendas preconfiguradas (ej. "Mercancía frágil", "Entregar en puerta trasera"). No tiene valor monetario.
Fila Tipo '$\Sigma$' (Subtotal): Calcula y exhibe la suma aritmética de todas las líneas de artículo situadas entre el subtotal actual y el subtotal previo.
Fila Tipo 'A' (Artículo Alternativo): Exclusivo de las Ofertas de Venta (OQUT). Permite cotizar un producto alternativo (ej. una impresora de gama superior) sin que su precio se compute en el total de la oferta. Al copiar la oferta a un Pedido de Cliente, el sistema consulta al usuario si desea conservar el artículo principal o el alternativo.
2.4 Documentos Preliminares (Borradores - ODRF)
Antes de comprometer stock o generar asientos irreversibles en la base de datos, cualquier documento de marketing puede grabarse como Documento Preliminar (Draft).
Los borradores se guardan en la tabla ODRF y no afectan el libro mayor ni la disponibilidad de inventario.
Sirven como plantillas recurrentes para órdenes habituales y como antesala en los flujos de trabajo de aprobación corporativa.
2.5 Mapa de Relaciones, Documentos Referenciados y Arrastrar y Vincular
Mapa de Relaciones (Relationship Map): Muestra el árbol genealógico completo de una transacción (Oferta $\rightarrow$ Pedido $\rightarrow$ Entrega $\rightarrow$ Factura $\rightarrow$ Cobro). Permite alternar vistas entre documentos, asientos contables (OJDT) y desglose de artículos.
Documentos Referenciados: Permite vincular lógicamente documentos inconexos (por ejemplo, relacionar un Abono financiero independiente con una Factura de proveedor cerrada).
Arrastrar y Vincular (Drag & Relate): Permite arrastrar el código de un artículo o cliente directamente hacia cualquier opción del menú principal para ejecutar una consulta SQL interactiva en tiempo real sobre todas las transacciones históricas asociadas.


3. ATLAS DIDÁCTICO: CICLO DE VIDA DE DOCUMENTOS DE MARKETING
[ OFERTA DE VENTA (OQUT) ]

  │  ▲ Puede incluir líneas tipo 'A' (Alternativo), 'T' (Texto) y 'Σ' (Subtotal)

  │  ▼ Copiar a...

[ PEDIDO DE CLIENTE (ORDR) ] ────► Compromete Inventario (IsCommited)

  │  ▼ Copiar a...

[ ENTREGA DE VENTAS (ODLN) ] ────► Reduce Inventario Físico (OnHand) y Asiento Costo de Ventas

  │  ▼ Copiar a...

[ FACTURA DE CLIENTES (OINV) ] ──► Asiento Fiscal de Deudor e Ingresos

  │  ▼ Copiar a...

[ COBRO RECIBIDO (ORCT) ] ───────► Asiento de Tesorería y Reconciliación Interna

  * En cualquier momento: Click Derecho -> [ MAPA DE RELACIONES ] (Árbol gráfico completo)


4. CASO DE NEGOCIO RESUELTO: CICLO COMERCIAL EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers negocia la venta de equipamiento informático para una oficina corporativa:

Se emite una Oferta de Venta al prospecto L1000 - InnovaTech.
Línea 1: 5 Laptops Ejecutivas a $1,200 c/u = $6,000.
Línea 2 (Tipo 'A'): 5 Laptops Premium a $1,800 c/u (No suma en el total).
Línea 3 (Tipo 'T'): "Instalación de software básico sin costo adicional".
Total de la Oferta: $6,000.00 USD.
El cliente acepta la oferta base. El comercial convierte el prospecto en Cliente regular (C1000) y copia la Oferta a un Pedido de Cliente.
El sistema descarta automáticamente la línea alternativa 'A' y compromete 5 unidades en stock.
Mediante el Mapa de Relaciones, el gerente de ventas audita en una sola pantalla gráfica la Oferta inicial, el Pedido confirmado y la posterior Entrega con su correspondiente Factura.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál de los siguientes tipos de línea en la pestaña Contenido de una Oferta de Venta permite proponer un artículo opcional sin incrementar el monto total cotizado al cliente?
A) Línea Tipo 'T' (Texto).
B) Línea Tipo 'A' (Artículo Alternativo).
C) Línea Tipo '$\Sigma$' (Subtotal).
D) Línea en blanco estándar.
Respuesta Correcta: B
Justificación Técnica: La línea tipo 'A' (Alternativo) está diseñada específicamente en las Ofertas de Ventas (OQUT) para mostrar opciones complementarias al cliente sin computar su valor en el importe total del documento ni comprometer inventario.
Pregunta 2
Si un usuario registra un documento de marketing y lo guarda como "Documento Preliminar" (Borrador - ODRF), ¿cuál es su impacto contable y de inventario en SAP Business One?
A) Disminuye el stock físico y genera un asiento en el libro mayor.
B) Bloquea el crédito del cliente en un 50%.
C) No genera ningún movimiento contable ni afecta las cantidades físicas de stock; se almacena como una propuesta editable que no compromete inventario hasta su creación formal.
D) Se envía automáticamente a la administración tributaria.
Respuesta Correcta: C
Justificación Técnica: Los borradores (ODRF) son registros de trabajo provisionales que no tienen impacto en el Libro Mayor (OJDT) ni alteran los saldos de inventario (OITW) hasta que se transforman en documentos definitivos.
Pregunta 3
¿Qué herramienta nativa de SAP Business One permite al usuario hacer clic sostenido sobre un código de artículo y soltarlo sobre el menú 'Factura de clientes' para consultar instantáneamente todas las facturas en que se ha vendido dicho artículo?
A) Generador de Consultas SQL.
B) Arrastrar y Vincular (Drag & Relate).
C) Data Transfer Workbench.
D) Asistente de Revalorización.
Respuesta Correcta: B
Justificación Técnica: Arrastrar y Vincular (Drag & Relate) es la funcionalidad interactiva de inteligencia operacional de SAP B1 que ejecuta búsquedas relacionales ad-hoc combinando datos maestros con transacciones del menú.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
