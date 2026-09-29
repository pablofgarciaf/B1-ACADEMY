# Guion de Video: DOC 090 Sales CustomerMasterData

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 090 Sales CustomerMasterData.

## Contenido Principal (Visual: Diapositivas correspondientes)
DOC_090_Sales_CustomerMasterData: Clientes y Grupos de Clientes en SAP Business One 10.0
Metadatos Técnicos
Módulo SAP: Interlocutores Comerciales & Ventas - Clientes (Business Partner Master Data)
Código de Documento: DOC_090_Sales_CustomerMasterData
Audiencia Objetivo: Administradores de Datos Maestros, Consultores Comerciales, Jefes de Crédito y Cobranza, Gerentes de Ventas.
Nivel Técnico: Avanzado / Arquitectura de Interlocutores Comerciales
Versión de SAP: SAP Business One 10.0 FP 2008 / HANA & SQL


1. Antigravity Master Schema (Arquitectura de Datos y Parámetros)
{

  "unit_id": "090_10_Sales_21_Cust_Customers_ES",

  "system_component": "Business Partner Customer Master Architecture",

  "database_tables": {

    "core_bp_table": {

      "table_name": "OCRD",

      "fields": {

        "CardType": "C = Customer, L = Lead, S = Supplier/Vendor",

        "GroupCode": "Foreign key to OCRG (Customer Groups)",

        "GroupNum": "Foreign key to OCTG (Payment Terms)",

        "ListNum": "Default Price List assigned to Partner",

        "CreditLine": "Maximum credit limit allowed",

        "Balance": "Current financial balance (Receivable)",

        "FatherCard": "Connected Partner code (Consolidation/Connected Vendor)"

      }

    },

    "sub_tables": [

      {

        "table_name": "CRD1",

        "description": "Direcciones múltiples de entrega (Ship-to) y facturación (Bill-to)"

      },

      {

        "table_name": "OCPR",

        "description": "Personas de contacto empresariales asociadas al interlocutor"

      },

      {

        "table_name": "OCRG",

        "description": "Catálogo de Grupos de Clientes y Proveedores"

      },

      {

        "table_name": "OCTG",

        "description": "Condiciones de pago, límites de crédito y descuentos por pronto pago"

      }

    ]

  },

  "menu_paths": {

    "bp_master_data": "Interlocutores comerciales -> Datos maestros interlocutor comercial",

    "customer_groups_setup": "Gestión -> Configuración -> Interlocutores comerciales -> Grupos de clientes",

    "payment_terms_setup": "Gestión -> Configuración -> Interlocutores comerciales -> Condiciones de pago",

    "bp_defaults_company": "Gestión -> Inicialización del sistema -> Parametrizaciones generales -> Ficha IC"

  },

  "lifecycle_rules": {

    "lead_to_customer_transition": "La conversión de Lead a Cliente se realiza modificando directamente el campo Tipo de IC en OCRD; preserva íntegramente todo el historial previo de ofertas y pedidos",

    "lead_document_fence": "Los Leads pueden usarse en OQUT y ORDR; están terminantemente bloqueados en ODLN y OINV",

    "price_list_precedence": "Lista de precios en Grupo de Clientes (OCRG) sobrescribe la lista de precios por defecto de Parametrizaciones Generales"

  }

}


2. Desarrollo Conceptual y Funcional Exhaustivo
2.1 Estructura Unificada de Interlocutores Comerciales (OCRD)
SAP Business One utiliza un modelo de datos unificado para gestionar todos los entes externos con los que la compañía mantiene relaciones mercantiles. La tabla principal OCRD almacena tres tipos mediante el campo CardType:

Cliente Potencial / Prospecto (CardType = 'L' - Lead): Personas u organizaciones en el embudo de ventas preliminar (Pipeline).
Cliente (CardType = 'C' - Customer): Compradores activos a quienes se les despachan mercancías y se les emiten facturas legales.
Proveedor (CardType = 'S' - Supplier/Vendor): Suministradores de compras, materias primas y servicios.

Toda la interfaz gráfica comparte la misma anatomía en pestañas: General, Personas de contacto, Direcciones, Condiciones de pago, Ejecución de pagos, Finanzas y Propiedades.


2.2 Ciclo de Vida del Prospecto: De Lead a Cliente
El uso sistemático de registros de tipo Cliente Potencial (Lead) permite auditar las campañas de mercadeo y esfuerzos de preventa sin contaminar el maestro oficial de clientes:

Documentos Habilitados para Leads:
Actividades de seguimiento y llamadas telefónicas (OCLG).
Oportunidades de Venta en el Pipeline de CRM (OOPR).
Ofertas de Venta / Cotizaciones (OQUT).
Pedidos de Cliente (ORDR).
Regla de Protección de Integridad: Un Lead no puede ser utilizado en Entregas (ODLN) ni en Facturas de Clientes (OINV). Esta barrera previene que el personal de bodega despache mercancías a prospectos no verificados crediticiamente o sin alta fiscal.
Mecánica de Conversión: Cuando el prospecto formaliza su compra, no es necesario crear un nuevo código de interlocutor. El usuario abre el registro maestro del Lead y cambia el menú desplegable de Tipo de IC a Cliente. Toda la información de direcciones, contactos, acuerdos comerciales y los pedidos previamente emitidos quedan intactos y listos para ser copiados a Entregas y Facturas.
Permanencia en Base de Datos: Una vez que un Lead ha sido asignado a un documento comercial (incluso una simple Oferta), el registro no puede ser eliminado físicamente de la base de datos para asegurar la trazabilidad histórica de auditoría.


2.3 Gestión Multidirección y Determinación Fiscal (CRD1)
Un cliente corporativo puede tener múltiples sedes administrativas, sucursales y centros de distribución. SAP B1 modela esto en la tabla CRD1:

Direcciones de Facturación (Bill-to): Domicilio tributario legal donde se radican las facturas y cobros.
Direcciones de Entrega (Ship-to): Ubicaciones físicas de almacenes receptores donde se entregan las mercancías.
Valores por Defecto: Se define una dirección principal de facturación y una principal de entrega, las cuales se cargan automáticamente en los documentos de ventas. En el formulario comercial, el usuario puede alternar la dirección mediante una lista desplegable.
Impacto Tributario: En localizaciones complejas (como Estados Unidos, Brasil o países con impuestos regionales/estatales), el código de impuesto y la tasa del documento se determinan a partir de la dirección de entrega (Ship-to) seleccionada.


2.4 Clasificación Estratégica: Grupos de Clientes (OCRG)
Los grupos de clientes permiten segmentar la base de datos para dos fines primordiales:

Determinación Comercial y Tarifaria: Se puede asignar una Lista de Precios predeterminada a nivel del Grupo de Clientes. Esta lista prevalece y sobrescribe la lista de precios por defecto fijada en las Parametrizaciones Generales.
Inteligencia de Negocios e Informes: Facilita la extracción de balances de antigüedad de saldos (Aging), reportes de rentabilidad y estadísticas de volumen filtradas por sectores industriales (ej. Sector Gubernamental, Colegios y Academias, Mayoristas, Distribuidores).


2.5 Parámetros Financieros y Condiciones de Pago (OCTG)
Las condiciones de pago asignadas al cliente controlan:

Cálculo automático de la fecha de vencimiento (DocDueDate).
Descuentos por pronto pago escalonados por días de pago anticipado.
Límites máximos de crédito (CreditLine) y compromisos permitidos.
Vías de pago bancarias autorizadas.


2.6 Conexión entre Clientes y Proveedores (Connected Customers & Vendors)
En escenarios donde un socio de negocios actúa simultáneamente como cliente (nos compra productos) y como proveedor (nos suministra materias primas o servicios):

En la ficha Finanzas del cliente, se ingresa el código del Proveedor Conectado (OCRD.FatherCard).
De inmediato, el sistema vincula bidireccionalmente ambos registros maestros y habilita una flecha de enlace naranja para navegar entre ambos perfiles.
Beneficios Contables:
Visibilidad unificada en los Informes de Antigüedad de Saldos (Aging).
Consolidación en el Asistente de Reclamaciones (Dunning Wizard).
Ejecución de Reconciliaciones Internas Cruzadas, permitiendo compensar las facturas de clientes abiertas contra las facturas de proveedores pendientes sin necesidad de transferir flujos de dinero físico.


3. Caso de Negocio Práctico en OEC Computers
Contexto
OEC Computers lanza una campaña de equipamiento de aulas digitales dirigida a instituciones educativas.

Configuración de Grupo: Se crea el Grupo de Clientes Educación y Colegios (OCRG), asignándole una lista de precios preferencial con 15% de margen y condiciones de pago a 45 días.
Prospección: Se registra como Lead al Colegio San Francisco de Quito. Se ingresan 2 direcciones de entrega (Campus Norte y Campus Sur) y una de facturación.
Oferta y Pedido: Se emite una Oferta de Venta por 30 proyectores interactivos con entrega en Campus Norte. El rectorado aprueba y se copia a Pedido de Cliente.
Despacho y Conversión: Llegada la fecha de entrega, el sistema bloquea la creación de la Entrega. El consultor accede a los datos maestros del colegio, cambia el tipo de Lead a Cliente, guarda el cambio y procede a generar la Entrega y posterior Factura exitosamente.


4. Banco de Evaluación Situacional (Certificación SAP)
Pregunta 1: Una empresa necesita prospectar nuevas cuentas corporativas en el sistema pero desea asegurarse de que ningún usuario despache mercancías ni emita facturas fiscales a estas cuentas hasta que hayan superado la evaluación de crédito. ¿Cuál es el procedimiento estándar en SAP Business One?

A) Crear los registros en una base de datos externa de CRM.
B) Registrar a los prospectos con la clase de interlocutor comercial "Cliente Potencial" (Lead).
C) Crear a los clientes marcando la casilla "Inactivo" en sus datos maestros.
D) Asignarles un límite de crédito de cero dólares.
Respuesta Correcta: B.
Justificación Técnica: Los datos maestros de tipo Lead permiten registrar actividades, oportunidades, ofertas y pedidos de preventa, pero el sistema bloquea nativamente su uso en documentos de Entrega (ODLN) y Facturas de Clientes (OINV).

Pregunta 2: Si se asigna una lista de precios a un Grupo de Clientes y otra lista de precios diferente en las Parametrizaciones Generales de la empresa, ¿cuál lista de precios heredará automáticamente un nuevo cliente que se registre en dicho grupo?

A) La lista de precios de Parametrizaciones Generales siempre tiene prioridad.
B) La lista de precios asignada al Grupo de Clientes sobrescribe la de Parametrizaciones Generales.
C) El sistema genera un mensaje de error por conflicto de listas.
D) El cliente queda sin lista de precios asignada.
Respuesta Correcta: B.
Justificación Técnica: La jerarquía de valores por defecto establece que las condiciones comerciales vinculadas al Grupo de Clientes (OCRG) tienen mayor especificidad y sobrescriben el valor global de las Parametrizaciones Generales.

Pregunta 3: ¿Qué ocurre con los documentos históricos de oferta y pedidos de venta cuando un registro de "Cliente Potencial" (Lead) se transforma en "Cliente" en sus datos maestros?

A) Los documentos previos se eliminan y deben volverse a capturar.
B) Los documentos quedan congelados en modo de solo lectura y no pueden copiarse.
C) Toda la información y documentos creados previamente se conservan íntegramente y pueden copiarse a entregas y facturas.
D) Se crea automáticamente una copia duplicada del socio de negocios con un nuevo código.
Respuesta Correcta: C.
Justificación Técnica: La conversión de Lead a Cliente modifica únicamente el indicador CardType en la tabla OCRD; todos los documentos mercantiles previos permanecen activos y listos para continuar el flujo hacia la entrega y facturación.

Pregunta 4: ¿Cuál es la principal ventaja contable de utilizar la funcionalidad de "Proveedor Conectado" dentro de los datos maestros de un Cliente?

A) Descontar automáticamente el IVA en compras.
B) Visualizar de forma integrada las operaciones abiertas en los informes de antigüedad de saldos y permitir la reconciliación interna cruzada entre deudas de clientes y pagos a proveedores.
C) Compartir el mismo límite de crédito en compras y ventas.
D) Duplicar los artículos en los catálogos de compras y ventas.
Respuesta Correcta: B.
Justificación Técnica: La interconexión entre socio cliente y socio proveedor permite consolidar saldos en reportes de cartera y ejecutar conciliaciones internas entre cuentas por cobrar y cuentas por pagar sin movimientos bancarios.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
