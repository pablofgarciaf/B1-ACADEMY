Unidad 091: Gestión de Relaciones con los Clientes (CRM) y Actividades
Metadatos Técnicos
Módulo: Ventas - Clientes (CRM)
Código de Unidad: DOC_091_Sales_CRM_Activities
Versión de SAP Business One: 10.0
Audiencia Objetivo: Consultores Funcionales, Gestores de CRM y Ventas, Administradores de Sistema


JSON Antigravity Master Schema
{

  "$schema": "https://antigravity.schema.sap.b1/v10/crm_activities.json",

  "unit_id": "091_10_Sales_31_CRM_CRM_ES",

  "technical_module": "Sales & CRM",

  "database_tables": {

    "header": "OCLG",

    "activity_types": "OCLT",

    "activity_locations": "OCLL",

    "activity_subjects": "OCLS",

    "target_groups": "OTGZ",

    "target_group_members": "TGZ1",

    "campaigns": "OCPG",

    "opportunities": "OOPR",

    "opportunity_stages": "OPR1",

    "quotations": "OQUT"

  },

  "menu_paths": {

    "activity": "Interlocutores comerciales -> Actividad",

    "campaign_wizard": "Interlocutores comerciales -> Asistente de generación de campaña",

    "target_groups": "Gestión -> Configuración -> Interlocutores comerciales -> Grupos objetivo",

    "sales_opportunity": "Oportunidades de ventas -> Oportunidad de venta",

    "sales_quotation": "Ventas - Clientes -> Oferta de ventas",

    "calendar": "Barra de herramientas -> Icono Calendario",

    "general_settings_services": "Gestión -> Inicialización del sistema -> Parametrizaciones generales -> Ficha Servicios"

  },

  "business_rules": {

    "calendar_visibility": "Aparecen en el calendario: Llamadas telefónicas, Reuniones, Campañas, Notas y Otros. Las Tareas NO se muestran en el calendario (se gestionan en informes y Outlook).",

    "multi_user_assignment": "Una actividad puede asignarse a un usuario individual o a una lista de destinatarios predefinida de usuarios.",

    "daily_alerts_flag": "Controlada por la casilla 'Enviar alerta para actividades programadas para hoy' en Parametrizaciones generales (ficha Servicios) o en la ficha Servicios de Usuarios: Configuración.",

    "quotation_validity": "La fecha de fin de validez por defecto se calcula a partir de Parametrizaciones de documento -> Ficha Por documento -> Oferta de ventas (meses/días/semanas desde la fecha de contabilización).",

    "outlook_integration": "Sincroniza contactos, guarda correos/adjuntos como actividades, exporta citas/tareas y permite consultar/crear ofertas directamente desde Microsoft Outlook."

  }

}


Desarrollo Conceptual y Funcional Detallado
1. Las Actividades en el Ciclo de Vida del Cliente
La Actividad (OCLG) es el registro transaccional universal para documentar interacciones internas y externas en SAP Business One. Permite gestionar:

Llamadas telefónicas: Registro de duración, asunto, contenido de la llamada y fecha de seguimiento.
Reuniones: Coordinación de citas presenciales o virtuales con vinculación horaria al calendario.
Tareas: Actividades con fecha límite que no ocupan bloques horarios continuos en el calendario.
Notas y Otros: Apuntes libres, registros de correspondencia y minutas.
Campañas: Actividades masivas resultantes de ejecuciones de marketing.

Las actividades pueden ser puntuales o periódicas (recurrencias diarias, semanales, mensuales). Cada ocurrencia de una serie periódica puede modificarse o cancelarse de manera independiente sin afectar al resto de la serie.
2. El Calendario de SAP Business One
El calendario integrado ofrece vistas mensual, semanal, diaria y una vista grupal diseñada para coordinar las agendas de equipos comerciales o de soporte técnico. Permite crear actividades mediante doble clic en la franja horaria deseada, asociando de inmediato al interlocutor comercial (OCRD), contacto y documentos de marketing vinculados.
3. Asistente de Generación de Campañas y Grupos Objetivo
El módulo CRM permite estructurar campañas comerciales multicanal (correo electrónico, correo postal, llamadas):

Grupos Objetivo (OTGZ / TGZ1): Listas de distribución filtradas por criterios demográficos, sectoriales o históricos de compra de clientes potenciales (Leads) y clientes formales.
Asistente de Campaña (OCPG): Flujo guiado para definir canal de comunicación, plantilla HTML corporativa, artículos promocionados y listas de precios preferenciales.
Registro de Respuestas: Permite convertir el interés del destinatario directamente en una Actividad, una Oportunidad de Venta o una Oferta de Ventas.
4. Oportunidades de Ventas y Embudo (Pipeline)
La Oportunidad de Venta (OOPR) administra el ciclo completo de negociación mediante etapas ponderadas (OPR1):

Cada etapa define un porcentaje estimado de probabilidad de cierre y un importe potencial ponderado.
En cada fase se pueden enlazar actividades realizadas, competidores detectados y ofertas formales emitidas (OQUT).
Proporciona métricas para el análisis de previsión (Sales Forecast), análisis de razones de pérdida y conversión de prospectos a clientes formales.


Caso de Negocio Resuelto: OEC Computers
Escenario
OEC Computers lanza su nueva línea de servidores para PYMES y desea gestionar la prospección mediante el módulo de CRM:

El departamento de marketing genera un Grupo Objetivo de 150 clientes corporativos con contratos de soporte por renovar.
Mediante el Asistente de Campañas se envía un correo promocional con plantilla HTML.
Un cliente clave, Innovaciones Tecnológicas S.A., responde solicitando una reunión de consultoría.
El ejecutivo comercial registra una Actividad de tipo Reunión para el viernes a las 10:00 AM, asignada a él y al arquitecto preventa mediante una lista de destinatarios.
De la reunión surge una Oportunidad de Venta en Etapa 3 (40% de éxito) y una Oferta de Venta vinculada con validez de 15 días.


Banco de Evaluación Situacional
Pregunta 1
¿Cuál de los siguientes tipos de actividad NO se visualiza como un bloque de tiempo programado en el Calendario de SAP Business One?

A) Reunión
B) Tarea
C) Llamada telefónica
D) Campaña
Respuesta correcta: B
Justificación técnica: Las Tareas representan acciones pendientes con fecha límite de vencimiento pero no ocupan bloques horarios continuos en el calendario gráfico; se controlan en listas de verificación, informes de actividad y mediante Outlook Integration.
Pregunta 2
Para que los usuarios reciban notificaciones emergentes automáticas en la ventana Resumen de mensajes/alertas sobre sus actividades del día, ¿qué parámetro debe configurarse?

A) Activar el servicio de mensajería SMS en el SLD.
B) Marcar la casilla 'Enviar alerta para actividades programadas para hoy' en Parametrizaciones generales (ficha Servicios) o en la ficha Servicios del registro del usuario.
C) Crear un proceso de aprobación para cada llamada de servicio.
D) Asignar permisos de superusuario a todos los comerciales.
Respuesta correcta: B
Justificación técnica: El envío de alertas de actividades está gobernado por la casilla 'Enviar alerta para actividades programadas para hoy', configurable a nivel corporativo o por perfil individual de usuario.