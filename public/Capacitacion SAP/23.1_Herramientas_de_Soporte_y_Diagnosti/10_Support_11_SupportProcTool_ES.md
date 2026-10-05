Unidad 096: Procesos y Herramientas de Soporte Oficial y RSP
Metadatos Técnicos
Módulo: Administración del Sistema / Soporte y Mantenimiento SAP
Código de Unidad: DOC_096_Support_RemoteSupportPlatform
Versión de SAP Business One: 10.0
Audiencia Objetivo: Consultores de Soporte Técnico, Administradores de Infraestructura (SysAdmins), Partners Autorizados (VARs)


JSON Antigravity Master Schema
{

  "$schema": "https://antigravity.schema.sap.b1/v10/support_rsp.json",

  "unit_id": "096_10_Support_11_SupportProcTool_ES",

  "technical_module": "System Support & Remote Support Platform",

  "support_architecture": {

    "partner_tier_1": "Soporte Nivel 1: Resolución inicial, búsqueda en notas SAP, verificación de documentación y comunidad.",

    "partner_tier_2": "Soporte Nivel 2: Análisis técnico, reproducción en base de datos de pruebas/último patch, aislamiento de add-ons de terceros y verificación de integridad.",

    "sap_tier_3": "Soporte Nivel 3: Diagnóstico en laboratorio SAP, depuración de código fuente del kernel, liberación de correcciones y notas oficiales."

  },

  "tools_and_frameworks": {

    "rsp_agent": "Plataforma de Soporte Remoto (RSP Agent): instalada en el servidor del cliente para telemetría, tareas y backups.",

    "rsp_studio": "Consola del Partner para supervisar centralizadamente las instancias de todos sus clientes.",

    "system_status_report": "SSR (System Status Report): informe semanal obligatorio del estado de salud del hardware y la base de datos.",

    "support_launchpad": "Portal web de SAP para gestión de incidentes, solicitud de licencias y superusuarios técnicos (S-User).",

    "problem_recording_tool": "Herramienta nativa en Ayuda -> Support Desk -> Notificar un problema (captura pasos y pantallas PSR)."

  },

  "business_rules": {

    "maintenance_contract_prerequisite": "Para recibir soporte de SAP, el cliente debe estar al día con su cuota de mantenimiento de software.",

    "partner_billing_policy": "Si el Partner incumple las obligaciones de Nivel 1 y 2 (Nota SAP 1167635), SAP facturará trimestralmente los incidentes derivados injustificadamente (franquicia de 5 llamadas gratuitas por trimestre).",

    "technical_user_requirement": "Se requiere un superusuario técnico por cada cliente para la comunicación segura y descarga de tareas en la RSP.",

    "support_user_logon_restriction": "El usuario predefinido 'support' en SAP B1 no requiere licencia, pero SOLO permite iniciar sesión si la RSP está activa y ha transmitido un informe de estado en los últimos 7 días."

  }

}


Desarrollo Conceptual y Funcional Detallado
1. Niveles de Soporte y Responsabilidades del Partner
El modelo de servicio de SAP Business One delega la atención directa en el Partner (Value Added Reseller):

Nivel 1 (Partner): Recepción del ticket, triage del problema, comprobación de la documentación oficial y consulta en el repositorio de Notas SAP.
Nivel 2 (Partner): Reproducción rigurosa del fallo en una base de datos limpia con el nivel de patch (Feature Package) más reciente; descarte de colisiones con add-ons o desarrollos a medida; verificación de modificaciones no autorizadas en base de datos (Nota SAP 896891).
Nivel 3 (SAP Support): Análisis avanzado por el equipo de desarrollo de SAP; creación de notas correctivas y parches oficiales de software.
Incumplimiento (Nota SAP 1167635): Si un Partner reenvía a SAP problemas básicos atribuibles a Nivel 1 o 2 sin análisis previo, SAP aplica cobros por servicios no estándar (Incident Billing).
2. Plataforma de Soporte Remoto (RSP)
Herramienta de mantenimiento proactivo instalada en la infraestructura del cliente:

Tareas Automatizadas: Ejecución de scripts de mantenimiento preventivo, corrección de incoherencias en base de datos y parches automáticos.
Informe de Estado del Sistema (SSR): Auditoría diagnóstica semanal de rendimiento de hardware, espacio en disco, configuraciones y copias de seguridad.
Carga de Bases de Datos: Permite transmitir copias de seguridad de forma cifrada y segura hacia el laboratorio de soporte de SAP ante incidencias críticas.
Conexión Remota: Asistente integrado para coordinar sesiones de control remoto con ingenieros de SAP mediante GoToAssist.
3. Herramientas Integradas en el Cliente de SAP B1
Herramienta de Grabación de Incidentes: Accesible en Ayuda -> Support Desk -> Notificar un problema; graba capturas de pantalla de cada clic para reproducir fallos sin depender de grabadores externos.
Usuario 'support': Cuenta administrativa especial para auditorías del Partner sin consumir licencias de usuario pagadas, condicionada a que el agente RSP haya reportado exitosamente en los últimos 7 días.


Caso de Negocio Resuelto: OEC Computers
Escenario
Un cliente de OEC Computers experimenta un error de violación de clave primaria al intentar crear Facturas de Reserva tras una migración de versión:

El consultor de soporte de OEC (Nivel 1) investiga en el Support Launchpad buscando notas bajo el componente SBO-SD-INV.
El especialista de Nivel 2 aísla el entorno: desactiva add-ons locales y reproduce la falla en una base de datos de pruebas en el nivel de patch vigente.
El agente comprueba que el error persiste en el núcleo estándar de SAP B1.
Genera el Informe de Estado del Sistema (SSR) mediante la RSP y carga el backup anonimizado a través de la tarea de transferencia segura.
Registra el incidente formal en el Support Launchpad adjuntando el log de la herramienta Notificar un problema, garantizando el cumplimiento de la Nota SAP 1167635 sin incurrir en penalizaciones por facturación de incidentes.


Banco de Evaluación Situacional
Pregunta 1
¿Qué condición es estrictamente obligatoria en el sistema para que un consultor pueda iniciar sesión en SAP Business One utilizando el usuario administrativo gratuito 'support'?

A) Contar con una licencia Professional asignada al usuario.
B) Que la Plataforma de Soporte Remoto (RSP) esté activa y haya enviado un Informe de Estado del Sistema (SSR) dentro de los últimos 7 días.
C) Desconectar la base de datos de la red local.
D) Haber registrado un ticket de Nivel 3 en el Support Launchpad.
Respuesta correcta: B
Justificación técnica: El usuario especial 'support' no consume licencias contractuales, pero SAP bloquea su acceso si el cliente no mantiene la RSP operativa con una transmisión válida de telemetría SSR en los últimos 7 días.
Pregunta 2
Según la política de mantenimiento y la Nota SAP 1167635, ¿cuál es la responsabilidad contractual del Partner antes de escalar un incidente al soporte de Nivel 3 de SAP?

A) Reenviar el correo electrónico del cliente directamente a los directores de soporte de SAP.
B) Realizar las tareas de Nivel 1 y 2, incluyendo la búsqueda en notas SAP, reproducción en el nivel de patch más reciente y aislamiento de factores externos o add-ons.
C) Reinstalar el sistema operativo del servidor del cliente.
D) Facturar al cliente por cada llamada telefónica recibida.
Respuesta correcta: B
Justificación técnica: Los Partners están obligados contractualmente a agotar el diagnóstico de Nivel 1 y Nivel 2; escalar sin reproducir ni descartar add-ons viola la política de soporte y genera cobros por Incident Billing.