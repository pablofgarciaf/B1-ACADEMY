# Guion de Video: DOC 047 Impl Alerts

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 047 Impl Alerts.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 047: HERRAMIENTAS DE PERSONALIZACIÓN - GESTIÓN DE ALERTAS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Impl_12_CustomTools_Alerts_ES
Módulo Oficial: Herramientas de Personalización / Administración del Sistema
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Administradores del Sistema, Jefes de Área y Agentes IA (Antigravity)
Carpeta Asociada: 047_10_Impl_12_CustomTools_Alerts_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "047",

  "topic": "Alerts Management (Predefined & User-Defined Alerts)",

  "sap_module": "Administration_Customization_Alerts",

  "database_tables": {

    "alerts_definition": "OALT",

    "alert_recipients": "ALT1",

    "alert_inbox_header": "OAIB",

    "alert_inbox_lines": "AIB1",

    "saved_queries": "OUQR",

    "user_groups": "OUGR"

  },

  "menu_paths": [

    "Gestión > Gestión de alertas",

    "Herramientas > Consultas > Consultas de usuario",

    "Gestión > Inicialización del sistema > Parametrizaciones generales > Ficha Servicio",

    "Gestión > Definición > General > Usuarios > Parametrizaciones de usuario"

  ],

  "alert_types": {

    "Predefined_Alerts": {

      "definition": "Alertas nativas de fábrica activadas por eventos inmediatos de creación de documentos",

      "available_system_alerts": [

        "Desviación de porcentaje de ganancia bruta (Gross Profit %)",

        "Desviación de límite de comprometido (Commitment Limit)",

        "Desviación del límite de crédito (Credit Limit)",

        "Desviación de descuento en % (Discount %)",

        "Desviación de presupuesto (Budget Deviation - Compras, Pagos y Asientos)",

        "Desviación de almacén mínima (Minimum Stock Deviation - Órdenes de entrega)",

        "Recomendación de MRP vencida (Overdue MRP Recommendations)"

      ],

      "trigger_timing": "Instantánea al añadir el documento comercial a la base de datos"

    },

    "User_Defined_Alerts_UDA": {

      "definition": "Alertas basadas en consultas SQL de usuario (OUQR) para monitoreo avanzado o listas de trabajo periódicas",

      "trigger_mechanism": "Programación temporal por frecuencia (Minutos, Horas, Días, Semanas, Meses)",

      "trigger_condition": "Solo se dispara y envía mensaje si la consulta devuelve al menos una fila de resultados",

      "history_logging_option": {

        "Save_History_Checked": "Inserta una línea nueva independiente en la bandeja cada vez que se dispara la alerta",

        "Save_History_Unchecked": "Sobrescribe la línea anterior en negrita, manteniendo limpia la bandeja de entrada"

      }

    }

  },

  "communication_channels": [

    "Mensaje Interno (Ventana emergente Resumen de mensajes/alertas y Widget Cockpit)",

    "Correo Electrónico (Vía SBO Mailer o Microsoft Outlook)",

    "Mensaje de Texto SMS (Vía Integration Framework B1iF con escenario móvil)",

    "Fax"

  ],

  "technical_infrastructure": {

    "server_service": "Servicio de Tareas (Task Service) en System Landscape Directory (SLD)",

    "technical_user": "AlertSvc (Usuario predefinido del sistema que ejecuta las alertas en segundo plano)",

    "hana_dependency": "Requiere Service Layer activo en el servidor SAP HANA (Puerto 50000)"

  },

  "governance_rule_alert_vs_approval": {

    "Alerts": "Mecanismo INFORMATIVO a posteriori. NO detiene ni bloquea la creación del documento comercial.",

    "Approval_Processes": "Mecanismo PREVENTIVO y BLOQUEANTE a priori. Impide la adición del documento guardándolo como borrador (ODRF) hasta ser autorizado formalmente."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Naturaleza y Propósito del Mecanismo de Alertas
El sistema de alertas de SAP Business One es un motor proactivo de mensajería empresarial que notifica instantáneamente a los responsables de área ante la ocurrencia de eventos operativos o desviaciones en las reglas de negocio.

Diferencia Doctrinal: Alerta vs. Proceso de Aprobación

Una Alerta es netamente ex-post (informativa): la transacción comercial ya ha sido grabada formalmente en la base de datos y la alerta avisa del hecho consumado (ej. "Se acaba de crear una factura que superó el límite de crédito del cliente").
Un Procedimiento de Aprobación es ex-ante (restrictivo): el documento comercial se retiene como un borrador preliminar (ODRF) y no afecta inventarios ni contabilidad hasta que el autorizador correspondiente lo libere.
2.2 Alertas Predefinidas
Vienen integradas de fábrica y solo requieren activación, selección de destinatarios y umbral de tolerancia:

En Ventas: Alertan cuando una cotización o pedido transgrede el límite de crédito del socio de negocios, el límite de comprometido (órdenes abiertas), el porcentaje mínimo de margen de ganancia bruta o el descuento comercial máximo autorizado.
En Compras y Finanzas: La Desviación de Presupuesto alerta si una orden de compra o pago supera la partida presupuestaria mensual configurada en el plan financiero.
En Inventario: La Desviación de Almacén Mínima se dispara cuando una Entrega reduce el stock disponible por debajo del stock de seguridad configurado en el maestro del artículo.
En MRP: Alerta el día exacto en que una recomendación de compra o producción debe ser liberada para no quebrar la cadena de suministro.
2.3 Alertas Definidas por el Usuario (UDA)
Permiten extender el monitoreo a cualquier necesidad corporativa utilizando el Generador de Consultas SQL:

Listas de Tareas Diarias / Pools de Trabajo: Notificar cada mañana a las 08:00 AM las ofertas de ventas vencidas ayer o los pedidos pendientes de entrega del día.
Auditoría de Calidad de Datos: Identificar socios de negocios nuevos creados sin número de identificación fiscal (RUC/NIT) o artículos sin lista de precios asignada.
Lógica SQL y Frecuencia: La consulta debe estar sincronizada con la periodicidad. Si una alerta corre diariamente, la cláusula WHERE debe restringir a la fecha actual (T0.DocDate = CURRENT_DATE en HANA) para no re-notificar registros históricos ya atendidos.
2.4 Arquitectura Técnica del Servidor de Alertas
Para que el sistema de alertas funcione de manera ininterrumpida:

El Servicio de Tareas (Task Service) debe estar en ejecución continua dentro del System Landscape Directory (SLD).
El usuario técnico del sistema AlertSvc se conecta de manera desatendida a las bases de datos de la empresa, lo que permite que un destinatario reciba correos electrónicos o SMS aunque no tenga el cliente de SAP Business One abierto.
En entornos SAP HANA, el motor de alertas depende críticamente del Service Layer (servicio REST en el puerto 50000). Si el Service Layer está detenido, las alertas no se disparan.


3. ATLAS DIDÁCTICO: CICLO DE VIDA Y PROCESAMIENTO DE ALERTAS
       [ EVENTO OPERATIVO / CRON JOB ]

                     │

       ┌─────────────┴─────────────┐

       ▼                           ▼

[ ALERTA PREDEFINIDA ]     [ ALERTA DE USUARIO (SQL) ]

Evento: Creación de Doc.   Frecuencia: Cada X Min / Horas

Verifica umbral de regla   Ejecuta consulta en OUQR

       │                           │

       │                   ¿Hay resultados (>0 filas)?

       │                   ├── NO  ──> Termina sin enviar

       │                   └── SÍ  ──┐

       ▼                             ▼

  [ TASK SERVICE EN SLD / USUARIO TÉCNICO: AlertSvc ]

                     │

       ┌─────────────┼─────────────┬─────────────┐

       ▼             ▼             ▼             ▼

   Interna        E-mail          SMS           Fax

  (Ventana       (SMTP /        (B1iF /

  Mensajes)       Mailer)       Mobile)


4. CASO DE NEGOCIO RESUELTO: GESTIÓN DE COMPRAS Y AUDITORÍA EN OEC COMPUTERS
Escenario de Consultoría:
El jefe de compras de OEC Computers requiere dos controles automáticos:

Inmediato: Recibir una notificación inmediata cada vez que una entrega a clientes reduzca el stock de suministros de cómputo por debajo de la cantidad mínima.
Diario: Recibir a las 18:00 horas un informe consolidado con todos los pedidos de compras emitidos durante el día cuyo importe total supere los $5,000.00 USD.
Solución Técnica Implementada:
Alerta 1 (Predefinida):
Ruta: Gestión > Gestión de alertas.
Se selecciona la alerta nativa Desviación de almacén mínima.
Se activa la casilla de verificación y se asigna como destinatario al jefe de compras con método Interno y Correo electrónico.
Alerta 2 (Definida por el Usuario):
Se construye la consulta SQL grabada en OUQR:

SELECT T0."DocNum", T0."DocDate", T0."CardCode", T0."CardName", T0."DocTotal"

FROM OPOR T0

WHERE T0."DocTotal" > 5000 AND T0."DocDate" = CURRENT_DATE

En Gestión de alertas, se selecciona Acciones > Crear alerta de usuario.
Nombre: Auditoría Pedidos de Compra Mayores a $5,000.
Se vincula la consulta grabada, se define frecuencia 1 Día a las 18:00, se desmarca Grabar historial y se asigna al usuario.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es la principal diferencia funcional entre una Alerta (Alert) y un Procedimiento de Autorización (Approval Process) en SAP Business One?
A) Las alertas solo funcionan en moneda extranjera y las autorizaciones en moneda local.
B) Las alertas notifican a los usuarios una vez que el documento ya fue creado en el sistema (no evitan la transacción), mientras que las autorizaciones bloquean la creación del documento reteniéndolo como borrador hasta que sea formalmente aprobado.
C) Las alertas requieren licencia profesional y las autorizaciones licencia limitada.
D) No hay diferencia, son términos sinónimos en el menú de gestión.
Respuesta Correcta: B
Justificación Técnica: Las alertas son instrumentos informativos ex-post que no detienen el flujo operativo, mientras que las autorizaciones son controles de gobernanza ex-ante que impiden que el documento afecte inventarios o contabilidad hasta su aprobación.
Pregunta 2
En las Alertas Definidas por el Usuario (UDA) basadas en consultas SQL, ¿bajo qué condición estricta envía el sistema la notificación al destinatario?
A) Siempre que se cumpla la hora programada, incluso si la consulta no devuelve ningún dato.
B) Únicamente cuando la consulta SQL se ejecuta en la fecha programada y devuelve al menos una fila de resultados.
C) Solo si el usuario tiene sesión activa en el cliente SAP al momento de la ejecución.
D) Cuando el superusuario autoriza manualmente la salida del correo.
Respuesta Correcta: B
Justificación Técnica: Si la consulta SQL no arroja registros (es decir, ningún documento cumplió la condición de desviación), el sistema no genera ningún mensaje, evitando saturar la bandeja de entrada de los usuarios.
Pregunta 3
¿Qué componente técnico de la infraestructura de servidor es responsable de ejecutar el servicio de alertas en segundo plano y enviar notificaciones a usuarios desconectados?
A) El Administrador de Licencias de red.
B) El Servicio de Tareas (Task Service) en el System Landscape Directory (SLD), operando mediante el usuario técnico del sistema AlertSvc.
C) El Generador de Consultas de Crystal Reports.
D) El protocolo ODBC del cliente local.
Respuesta Correcta: B
Justificación Técnica: El Task Service gestionado en SLD utiliza el usuario técnico AlertSvc para monitorear y disparar las alertas automáticamente con independencia de si los destinatarios han iniciado sesión en el cliente de escritorio.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
