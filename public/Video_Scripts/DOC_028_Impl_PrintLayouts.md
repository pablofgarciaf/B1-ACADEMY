# Guion de Video: DOC 028 Impl PrintLayouts

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 028 Impl PrintLayouts.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 028: DISEÑOS DE IMPRESIÓN (PRINT LAYOUTS), GESTOR DE INFORMES Y SECUENCIAS DE IMPRESIÓN EN SAP BUSINESS ONE 10.0
Código de Manual: 10_Impl_36_SystemSetup_Print_layouts
Módulo Oficial: Gestión / Definición / General / Gestión de Informes y Layouts
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Desarrolladores de Reportes Crystal, Administradores del Sistema y Agentes IA (Antigravity)
Carpeta Asociada: 028_10_Impl_36_SystemSetup_Print_layouts


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "028",

  "topic": "Print Layouts, Report and Layout Manager, Crystal Reports Integration & Printing Sequences",

  "sap_module": "SystemSetup_Reporting",

  "database_tables": {

    "report_and_layout_catalog": {

      "table": "RDOC",

      "key_fields": ["DocCode", "DocName", "TypeCode", "Author", "Template"],

      "description": "Catálogo maestro de todos los informes y layouts (PLD y Crystal Reports) registrados en la sociedad"

    },

    "report_types": {

      "table": "RTYP",

      "key_fields": ["TypeCode", "TypeName"],

      "description": "Tipos y categorías de documentos/reportes de marketing"

    },

    "printing_sequences": {

      "tables": ["VSP_PRINT", "VSP_SEQS"],

      "description": "Encadenamiento de layouts y asignación de impresoras para ejecución secuencial en una sola orden"

    }

  },

  "menu_paths": [

    "Gestión > Definición > General > Gestión de informes y layouts",

    "Barra de herramientas > Icono 'Diseñador de layouts' > Gestionar layout",

    "Fichero > Previsualizar layouts...",

    "Gestión > Utilidades > Duplicar modelo de layout"

  ],

  "layout_technologies": {

    "Crystal_Reports_CR": {

      "status": "Estándar moderno oficial en SAP Business One",

      "editing_tool": "SAP Crystal Reports for SAP Business One Designer (requiere instalación cliente)",

      "data_source": "Tablas relacionales nativas de SAP B1 expuestas con estructura de menú",

      "packaging_format": "Archivos comprimidos *.b1px para importación/exportación entre sociedades"

    },

    "Print_Layout_Designer_PLD": {

      "status": "Herramienta propietaria heredada (legacy)",

      "editing_tool": "Diseñador PLD integrado nativamente en el cliente SAP B1 (sin software externo)",

      "duplication": "Utilidad 'Duplicar modelo de layout' en Gestión > Utilidades"

    }

  },

  "assignment_and_default_rules": {

    "by_user": "Un layout puede definirse como predeterminado para 'Todos los usuarios', 'Usuario actual' o 'Usuarios específicos'.",

    "by_business_partner": "Permite asignar layouts específicos por cliente/proveedor (ej. facturas en idioma extranjero o formatos de exportación).",

    "authorization_required": "Para alterar el layout por defecto se exige la autorización 'General > Modificar informe estándar'.",

    "draft_watermark": "Si se previsualiza o imprime un documento antes de grabarlo en base de datos, SAP B1 incrusta automáticamente la marca de agua 'Borrador' (Draft)."

  },

  "advanced_capabilities": {

    "Master_Layouts": "Al importar un paquete b1px, permite propagar un diseño base (logo, cabecera corporativa) a múltiples tipos de documentos afines (Oferta, Pedido, Entrega, Factura).",

    "Printing_Sequences": "Permite definir una lista ordenada de layouts para dispararse juntos (ej. 1 Lista de empaque + 2 Copias de Entrega + 1 Factura original + 1 Factura fiscal) dirigidos a impresoras independientes."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Rol de los Print Layouts en la Implementación
En todo proyecto de implantación de SAP Business One, la parametrización de los Diseños de Impresión (Print Layouts) representa una tarea crítica para la salida en vivo (Go-Live). Los layouts gobiernan cómo se visualizan e imprimen los documentos mercantiles dirigidos a terceros (Facturas, Pedidos de Compra, Remisiones) y documentos internos (Listas de Picking, Órdenes de Fabricación).

Plantillas de Fábrica: SAP Business One provee layouts predefinidos por localización fiscal.
Regla de Inmutabilidad: Los layouts originales provistos por SAP no se pueden modificar directamente ni eliminar. El consultor debe abrirlos, editarlos y guardarlos con un nuevo nombre personalizado en el catálogo de la sociedad.
2.2 Tecnologías: Crystal Reports (CR) vs Print Layout Designer (PLD)
SAP B1 convive con dos motores de diseño:

SAP Crystal Reports (CR): Es el estándar preferente y más potente. Admite fórmulas complejas, subreportes, gráficos analíticos avanzados, códigos de barras vectoriales e integración con el menú de complementos de SAP B1. Los archivos se empaquetan en formato .b1px para transporte entre ambientes de desarrollo, pruebas y producción.
Print Layout Designer (PLD): Es la herramienta nativa histórica embebida en el cliente SAP. No requiere software adicional, pero posee limitaciones gráficas severas en el manejo de fuentes, tablas dinámicas y cálculos lógicos.
2.3 Jerarquía de Asignación de Layouts por Defecto
Cuando un usuario pulsa el icono de impresión o Ctrl + P, SAP B1 resuelve qué layout disparar siguiendo esta prelación:

¿El Socio de Negocios (OCRD) de la transacción tiene un layout por defecto asignado explícitamente? (Ideal para clientes corporativos que exigen su formato propio o clientes internacionales que requieren layout en inglés).
Si el IC no tiene asignación particular: ¿El Usuario actual tiene configurado un layout por defecto?
Si el usuario no tiene personalización: Se dispara el Layout por defecto global de la Empresa (marcado en negrita en la lista de layouts).
2.4 Secuencias de Impresión (Printing Sequences)
En operaciones de despacho intensivo, imprimir manualmente cada documento involucrado genera demoras en bodega. La funcionalidad de Secuencias de Impresión permite encadenar múltiples layouts bajo una sola acción:

Al generar una Factura de Clientes, el sistema puede enviar en paralelo:
1 copia de la Lista de Empaque a la impresora térmica del despachador.
2 copias de la Guía de Remisión/Entrega a la impresora de recepción.
1 original de la Factura Comercial a la impresora de caja.
Todo orquestado automáticamente desde la pestaña Secuencias de impresión de RDOC.


3. CASO DE NEGOCIO RESUELTO EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers requiere adaptar la facturación para cumplir con dos requerimientos operativos clave:

Requisito 1: La empresa adoptó una nueva identidad corporativa con logotipo de alta resolución, colores institucionales y código QR tributario.
Requisito 2: Al imprimir una Factura de Clientes, el operario de despacho debe obtener automáticamente la Factura comercial y dos copias de la Guía de Despacho (Delivery Note) dirigidas a la impresora del muelle.
Implementación Paso a Paso:
Edición del Layout en Crystal Reports:
En Gestión de informes y layouts, se selecciona el layout estándar de Factura de Clientes (OINV) y se pulsa Tratar.
Se abre SAP Crystal Reports Designer. Se reemplaza el logo por el archivo institucional, se añade el campo del código QR y los términos de garantía en el pie de página.
Mediante el menú Complementos > Guardar en SAP Business One, se guarda bajo el nombre OEC_Factura_2026.
Definición de Secuencia de Impresión:
En el Layout Manager, se selecciona OEC_Factura_2026 y se accede a la pestaña Secuencias de impresión.
Se crea la secuencia SEC_DESPACHO_FACT:
Línea 1: Layout OEC_Factura_2026, Copias: 1, Impresora: Facturacion_Caja.
Línea 2: Layout Guía de Entrega Estándar, Copias: 2, Impresora: Bodega_Muelle.
Asignación como Predeterminada:
Se asigna la secuencia SEC_DESPACHO_FACT como valor por defecto para todos los usuarios del departamento de ventas y logística.
Verificación: Al emitir y cobrar una factura en mostrador, ambas impresoras expulsan sus documentos simultáneamente sin intervención manual adicional.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Qué sucede visualmente si un usuario genera una vista previa de impresión (Print Preview) de una Factura de Clientes antes de presionar el botón "Crear" para añadirla a la base de datos?
A) El sistema bloquea la pantalla y emite un error de validación.
B) La vista previa se imprime sin números correlativos ni importes monetarios.
C) El sistema imprime automáticamente la marca de agua "Borrador" (Draft) sobre el documento.
D) El documento se guarda automáticamente como una cotización preliminar.
Respuesta Correcta: C
Justificación Técnica: Por diseño de seguridad e integridad documental en SAP Business One, cualquier documento que no haya sido persistido oficialmente en la base de datos exhibe la marca de agua 'Borrador' para evitar usos comerciales o fiscales no autorizados.
Pregunta 2
¿Qué tipo de archivo exporta el Asistente de Gestión de Informes y Layouts al extraer un diseño modificado de Crystal Reports para transferirlo a otra sociedad?
A) Un archivo con extensión .rpt.
B) Un paquete de intercambio con extensión .b1px.
C) Un archivo comprimido .zip con scripts SQL.
D) Un documento XML plano.
Respuesta Correcta: B
Justificación Técnica: SAP Business One empaqueta los informes y layouts de Crystal Reports junto con sus metadatos de configuración, menús y parámetros en archivos propietarios .b1px.
Pregunta 3
¿Qué ventaja funcional ofrece la designación de un "Layout Maestro" (Master Layout) durante la importación de diseños de Crystal Reports?
A) Permite compilar código Java dentro de los reportes.
B) Permite replicar automáticamente un diseño común (como logotipo, tipografía y membrete) en múltiples clases de documentos con estructura similar (Ofertas, Pedidos, Entregas, Facturas), reduciendo el tiempo de diseño.
C) Bloquea la edición del layout para todos los usuarios excepto el gerente general.
D) Fuerza la conversión de todos los reportes PLD a formato PDF.
Respuesta Correcta: B
Justificación Técnica: La opción de Layout Maestro permite propagar una plantilla unificada a varios tipos de documentos de ventas o compras, ahorrando horas de consultoría en la personalización gráfica repetitiva.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
