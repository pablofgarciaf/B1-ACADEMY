Unidad 095: Gestión Integral de Procesos de Servicio al Cliente
Metadatos Técnicos
Módulo: Servicio al Cliente / Postventa
Código de Unidad: DOC_095_Service_CustomerServiceProcess
Versión de SAP Business One: 10.0
Audiencia Objetivo: Consultores de Servicio y Soporte, Administradores de Helpdesk, Gerentes de Operaciones


JSON Antigravity Master Schema
{

  "$schema": "https://antigravity.schema.sap.b1/v10/service_process.json",

  "unit_id": "095_10_Service_11_CSProcess_Process_ES",

  "technical_module": "Customer Service & Helpdesk",

  "database_tables": {

    "service_call": "OSCL",

    "customer_equipment_card": "OINS",

    "service_contracts": "OCTR",

    "service_contract_templates": "OCTT",

    "service_contract_lines": "CTR1",

    "solutions_knowledge_base": "OSLT",

    "service_queues": "OSCQ",

    "technician_scheduling": "SCL5"

  },

  "menu_paths": {

    "service_call": "Servicio -> Llamada de servicio",

    "customer_equipment_card": "Servicio -> Tarjeta de equipo de cliente",

    "service_contract": "Servicio -> Contrato de servicio",

    "contract_templates": "Gestión -> Configuración -> Servicio -> Modelos de contrato",

    "knowledge_base": "Servicio -> Base de conocimientos de soluciones",

    "service_queues": "Gestión -> Configuración -> Servicio -> Colas",

    "service_reports": "Servicio -> Informes de servicio"

  },

  "business_rules": {

    "auto_equipment_card_conditions": "Requiere: 1) En Parametrizaciones generales -> Inventario: 'Números de serie unívocos por: Números de serie' y marcar 'Creación automática de tarjeta de equipo'. 2) En el maestro de artículo (OITM), gestionado por series con Modelo de Garantía asignado. 3) Se dispara al contabilizar una Entrega (ODLN) o Factura (OINV).",

    "contract_types": "1) Número de serie (vinculado a tarjeta de equipo). 2) Cliente (cobertura global a un IC). 3) Grupo de artículos.",

    "service_call_closure_rule": "No se puede marcar una llamada de servicio como 'Cerrada' a menos que se haya introducido un texto explicativo en la ficha Resolución o se haya vinculado una solución válida de la Base de Conocimientos.",

    "multi_scheduling_irreversible": "La casilla 'Habilitar programación múltiple para llamadas de servicio' en Parametrizaciones de documento es IRREVERSIBLE; transforma la pestaña Planificación en una cuadrícula para múltiples técnicos/visitas."

  }

}


Desarrollo Conceptual y Funcional Detallado
1. Tarjetas de Equipo del Cliente (OINS)
Representan las instancias físicas instaladas en el cliente con número de serie único:

Almacenan historial completo de llamadas de servicio, contratos activos, transacciones de venta y documentos de cambio/garantía.
Pueden vincularse a múltiples interlocutores comerciales (ej. equipo comprado a un fabricante/proveedor y vendido posteriormente a un cliente final).
Solo se pueden atender llamadas sobre tarjetas en estado Activo o Concedido en préstamo. Si su estado es Devuelto, Cancelado o En laboratorio, el sistema bloquea la llamada.
2. Modelos y Contratos de Servicio (OCTR / OCTT)
Acuerdo de Nivel de Servicio (SLA): Fija los compromisos contractuales de Tiempo de respuesta (en horas/días) y Tiempo de resolución.
Pestaña Cobertura: Determina los días de la semana y franjas horarias válidas (ej. 8x5 vs. 24x7), inclusión de días festivos y rubros cubiertos (Piezas, Mano de obra, Desplazamiento/Viajes).
3. El Ciclo de Vida de la Llamada de Servicio (OSCL)
Recepción y Registro: Al seleccionar el cliente o número de serie, SAP B1 valida la existencia de contratos activos y calcula automáticamente las fechas límite contractuales (La resolución tiene que ser antes de).
Asignación y Colas de Servicio (OSCQ): Las llamadas pueden asignarse directamente a un empleado o canalizarse a Colas de especialistas técnicos.
Diagnóstico y Base de Conocimientos (OSLT): Repositorio corporativo de síntomas y soluciones con flujos de aprobación (Interno, Revisión, Publicado).
Seguimiento de Gastos y Materiales: En la pestaña Documentos relacionados, el técnico genera entregas de repuestos, traslados de inventario a su camioneta/almacén móvil o facturas por horas no cubiertas.
Cierre Formal: Exige registrar la resolución antes de actualizar el estado a Cerrado.


Caso de Negocio Resuelto: OEC Computers
Escenario
OEC Computers vende un plotter de alta precisión serializado (Plotter Pro 48") a la firma de ingeniería Planos y Diseños S.A.:

Al contabilizar la Entrega, el sistema genera automáticamente la Tarjeta de Equipo OINS #5520 y un Contrato de Garantía de 12 meses (cobertura 8x5 con tiempo de resolución de 24 horas hábiles).
A los 4 meses, el cliente llama reportando un atasco crítico en el cabezal de impresión.
El agente de helpdesk abre una Llamada de Servicio, consulta la Base de Conocimientos y encuentra la solución estándar de recalibración.
El agente despacha un técnico de campo mediante la ficha Planificación; el técnico ejecuta la reparación y registra 1 hora de mano de obra cubierta al 100% por la garantía.
El técnico documenta la acción en la ficha Resolución y cierra la llamada formalmente.


Banco de Evaluación Situacional
Pregunta 1
¿Cuáles son los requisitos de configuración obligatorios para que SAP Business One cree automáticamente una Tarjeta de Equipo y un Contrato de Servicio de tipo Garantía al vender un artículo?

A) Que el artículo sea inventariable y se facture mediante una orden de producción.
B) Que en Parametrizaciones generales esté activado 'Números de serie unívocos' y 'Creación automática de tarjeta de equipo', y que el artículo esté gestionado por series con un modelo de garantía asignado en su maestro.
C) Que el usuario que crea la factura sea un técnico certificado en el módulo de servicio.
D) Que se facture mediante el Asistente de Creación de Documentos.
Respuesta correcta: B
Justificación técnica: La automatización exige la combinación de la política corporativa de seriales únicos y bandera de tarjetas de equipo en Parametrizaciones Generales, junto con la gestión por serie y modelo de garantía en el registro maestro OITM.
Pregunta 2
¿Bajo qué condición funcional permite SAP Business One modificar el estado de una Llamada de Servicio a 'Cerrada'?

A) Únicamente si se ha emitido una factura de clientes por los servicios prestados.
B) Solamente si el supervisor de soporte autoriza la solicitud mediante un flujo de aprobación.
C) Es obligatorio haber ingresado un texto descriptivo en la ficha Resolución o haber vinculado al menos una solución de la Base de Conocimientos.
D) Siempre que el tiempo transcurrido sea inferior al SLA contratado.
Respuesta correcta: C
Justificación técnica: SAP B1 bloquea el cierre formal de una llamada de servicio (OSCL) si no cuenta con una justificación documentada en la pestaña Resolución o una solución anexada desde la base de conocimientos.