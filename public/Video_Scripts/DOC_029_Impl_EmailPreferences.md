# Guion de Video: DOC 029 Impl EmailPreferences

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 029 Impl EmailPreferences.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 029: PREFERENCIAS DE CORREO ELECTRÓNICO, AUTOMATIZACIÓN DE ENVÍOS Y GRUPOS DE DISTRIBUCIÓN EN SAP BUSINESS ONE 10.0
Código de Manual: 10_Impl_39_SystemSetup_EmailPrefrences
Módulo Oficial: Gestión / Inicialización del Sistema / Parametrizaciones Generales / Servicios
Versión de SAP: Business One 10.0
Audiencia Objetivo: Administradores de Sistemas, Consultores de Procesos, Responsables de TI y Agentes IA (Antigravity)
Carpeta Asociada: 029_10_Impl_39_SystemSetup_EmailPrefrences


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "029",

  "topic": "E-Mail Preferences, SBO Mailer, Outlook Integration & Bulk Dispatching",

  "sap_module": "SystemSetup_Emailing",

  "database_tables": {

    "system_services_config": {

      "table": "CINF / OADM",

      "key_fields": ["MailServ", "SMTPUser", "SMTPPass", "UseTLS", "AttchPath"],

      "description": "Configuración de servicios de correo saliente, credenciales SMTP y ruta de anexos de la sociedad"

    },

    "contact_persons": {

      "table": "OCPR",

      "key_fields": ["CntctCode", "CardCode", "Name", "E_MailL", "EmailGroup"],

      "description": "Personas de contacto en clientes y proveedores con asignación de grupo de correo electrónico"

    },

    "email_groups": {

      "table": "OALG",

      "lines": "ALG1",

      "description": "Grupos de distribución de correo definidos para segmentación de envíos"

    },

    "messages_and_alerts": {

      "outbox": "OAOB",

      "received": "OALR",

      "description": "Colas de salida y registro histórico de mensajes y alertas generadas"

    }

  },

  "menu_paths": [

    "Gestión > Inicialización del sistema > Parametrizaciones generales > Ficha Servicios",

    "Gestión > Inicialización del sistema > Parametrizaciones generales > Ficha Vía de acceso",

    "Gestión > Inicialización del sistema > Preferencias de impresión > Ficha Por documento / Por informe",

    "Interlocutores comerciales > Datos maestros de interlocutor comercial > Ficha Personas de contacto",

    "Ventas - Clientes / Compras > Impresión de documentos",

    "Interlocutores comerciales > Informes de IC > Informe de e-mails enviados"

  ],

  "email_delivery_engines": {

    "SBO_Mailer": {

      "type": "Servicio de correo nativo de fondo en el servidor",

      "architecture": "Ejecutado por el componente Job Service dentro del System Landscape Directory (SLD)",

      "database_scope": "Permite configurar un SMTP específico por empresa (Enable Company Specific Mailer Configuration) con puerto, autenticación y cifrado TLS independiente"

    },

    "Microsoft_Outlook": {

      "type": "Integración con cliente MAPI local",

      "architecture": "Requiere que MS Outlook esté instalado y configurado en el equipo local del usuario. Abre ventana de redacción nativa."

    }

  },

  "automation_rules": {

    "on_document_add": "Al marcar 'Exportar a PDF automáticamente' y 'Enviar por correo electrónico al añadir documento', SAP B1 genera el PDF en la carpeta de anexos y dispara el correo al contacto del documento sin clics adicionales.",

    "bulk_emailing_requirement": "El envío masivo de documentos múltiples a múltiples destinatarios requiere obligatoriamente layouts en Crystal Reports (PLD solo admite envío unitario).",

    "attachments_directory": "Ruta de red obligatoria y compartida (Path tab). Si se migra el servidor de archivos, se debe ejecutar 'Actualizar vías de acceso en documentos'."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Los Dos Motores de Correo: SBO Mailer vs Microsoft Outlook
SAP Business One 10.0 ofrece dos mecanismos alternativos para despachar correspondencia electrónica:

SBO Mailer (SAP Business One Mailer):
Es un servicio desatendido que se ejecuta en el servidor a través del Job Service del System Landscape Directory (SLD).
Ventaja Multicompany: En entornos multiempresa en un mismo servidor, se puede marcar la casilla Activar configuración de mailer específica de la empresa (General Settings > Services). Esto permite que la Empresa A envíe correos desde @empresa-a.com usando su propio servidor SMTP con TLS, mientras la Empresa B utiliza @empresa-b.com con otro puerto y autenticación.
Microsoft Outlook Integration:
Utiliza la suite Office instalada en la estación de trabajo del usuario.
Permite al usuario revisar y editar el mensaje en el entorno de Outlook antes del envío, utilizando sus firmas y libretas de direcciones locales.
2.2 Automatización de Envíos en la Creación de Documentos
Para empresas que buscan una operación "Paperless" (cero papel) y máxima velocidad de cobranza:

En Preferencias de impresión > Por documento, se selecciona la transacción deseada (ej. Cotización de ventas o Factura de clientes).
Se habilitan las casillas:
Exportar a PDF automáticamente.
Enviar por correo electrónico al añadir documento.
Se redacta la plantilla de Asunto y Cuerpo del correo, con posibilidad de insertar variables dinámicas predefinidas.
Al presionar Crear en la factura, el sistema compila el PDF en segundo plano, lo guarda en el repositorio de red y envía el correo directamente al email de la persona de contacto activa.
2.3 Grupos de Correo Electrónico (E-Mail Groups) como Listas de Distribución
En clientes corporativos medianos o grandes, enviar todos los documentos a una dirección genérica (info@cliente.com) suele provocar extravíos de facturas o retrasos en pedidos.

SAP B1 resuelve esto mediante los Grupos de Correo Electrónico:
Se definen perfiles de destinatarios: Contabilidad, Compras / IT, Bodega / Logística.
En la ficha del cliente (OCRD), se asigna a cada persona de contacto su grupo respectivo.
Al ejecutar envíos masivos desde Impresión de documentos:
Si se envían Facturas, se selecciona el grupo Contabilidad. El sistema filtra y despacha cada factura a los contadores de cada uno de los 50 clientes seleccionados.
Si se envían Remisiones/Entregas, se selecciona el grupo Bodega.
2.4 Envío Masivo del Informe de Antigüedad de Saldos (Aging Report)
La gestión de cobranza preventiva se agiliza drásticamente mediante la integración de correo en los reportes financieros:

El tesorero ejecuta el informe de Antigüedad de saldos de clientes.
Selecciona los clientes con facturas vencidas > 30 días.
En el menú Fichero > Enviar > Correo electrónico, marca el grupo Contabilidad.
SAP Business One genera automáticamente un PDF individualizado para cada cliente con su estado de cuenta específico y lo despacha con una sola orden.


3. CASO DE NEGOCIO RESUELTO EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers organizó una feria tecnológica y generó 80 cotizaciones de venta para diferentes empresas prospecto. Jean, gerente de ventas, necesita enviar todas las cotizaciones en un solo paso, asegurándose de que lleguen directamente al Director de Tecnología (CIO) de cada cliente.
Implementación Paso a Paso:
Configuración de Grupo de Correo:
En Datos maestros de interlocutor comercial > Personas de contacto, se crea el grupo de correo CIO_TI.
En los 80 clientes, se asigna el contacto técnico a este grupo.
Plantilla de Mensaje:
En Preferencias de impresión > Por documento > Oferta de ventas, se configura el asunto: "OEC Computers - Propuesta Comercial Feria Tecnológica 2026" y un mensaje cordial de agradecimiento en el cuerpo.
Ejecución Masiva desde Impresión de Documentos:
Ruta: Ventas - Clientes > Impresión de documentos > Oferta de ventas.
Se filtran las cotizaciones de la feria y se seleccionan con Shift + Clic.
Menú Fichero > Enviar > E-Mail.
En la ventana emergente Opciones de correo, se marca la casilla Utilizar grupo de correo electrónico y se elige CIO_TI.
Despacho y Auditoría:
Se abre la grilla de verificación mostrando a los 80 CIOs con sus emails corporativos y los PDFs adjuntos.
Se pulsa Enviar. Las 80 cotizaciones se remiten en menos de 2 minutos.
En Informes de IC > Informe de e-mails enviados, Jean comprueba el registro de auditoría de cada correo despachado con su marca temporal.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Qué requisito técnico indispensable debe cumplirse en SAP Business One para poder enviar un lote de múltiples documentos de marketing a múltiples destinatarios por correo electrónico en una sola operación?
A) El servidor de base de datos debe reiniciarse en modo de mantenimiento.
B) El diseño de impresión asignado al documento debe estar desarrollado en Crystal Reports (el motor PLD no soporta envíos masivos agrupados).
C) Todos los clientes deben tener su cuenta bancaria configurada en dólares.
D) Los documentos deben estar en estado cancelado.
Respuesta Correcta: B
Justificación Técnica: La funcionalidad de envío masivo en lote desde la ventana de impresión de documentos requiere obligatoriamente que el layout activo sea de Crystal Reports; los layouts PLD están limitados a envíos unitarios.
Pregunta 2
Si una empresa cambia de servidor físico y traslada la carpeta compartida de anexos donde se almacenan los PDFs generados para correo, ¿qué acción debe realizar el administrador en SAP Business One?
A) Modificar la ruta en la pestaña Vía de Acceso de Parametrizaciones Generales y presionar el botón "Actualizar vías de acceso en documentos".
B) Reinstalar el cliente de SAP Business One en todas las máquinas.
C) Eliminar y volver a crear todas las cotizaciones históricas.
D) Cambiar la licencia de los usuarios a Licencia Profesional.
Respuesta Correcta: A
Justificación Técnica: Al modificar la ruta de red en Parametrizaciones generales > Vía de acceso, el botón Actualizar vías de acceso en documentos actualiza los punteros relacionales de los anexos en los documentos preexistentes.
Pregunta 3
¿Cómo permite SAP Business One 10.0 que dos empresas distintas alojadas en un mismo servidor utilicen servidores SMTP diferentes con credenciales independientes para el SBO Mailer?
A) No es posible, el SBO Mailer solo admite un servidor de correo por instalación física.
B) Marcando la casilla "Activar configuración de mailer específica de la empresa" en la pestaña Servicios de Parametrizaciones Generales e ingresando el host SMTP, puerto y TLS de cada sociedad.
C) Creando un túnel VPN obligatorio entre las dos bases de datos.
D) Utilizando exclusivamente Microsoft Outlook en lugar de SBO Mailer.
Respuesta Correcta: B
Justificación Técnica: SAP B1 10.0 incorporó la configuración SMTP a nivel de base de datos de empresa, permitiendo desacoplar el correo de la configuración global del SLD.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
