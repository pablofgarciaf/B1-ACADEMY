# Guion de Video: DOC 092 Sales ProcessAutomation

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 092 Sales ProcessAutomation.

## Contenido Principal (Visual: Diapositivas correspondientes)
Unidad 092: Automatización del Proceso de Ventas, ATP y Pick & Pack
Metadatos Técnicos
Módulo: Ventas - Clientes / Logística de Almacén
Código de Unidad: DOC_092_Sales_ProcessAutomation
Versión de SAP Business One: 10.0
Audiencia Objetivo: Consultores Logísticos, Jefes de Almacén, Operadores de Ventas


JSON Antigravity Master Schema
{

  "$schema": "https://antigravity.schema.sap.b1/v10/sales_automation.json",

  "unit_id": "092_10_Sales_41_Process_Autom_ES",

  "technical_module": "Sales & Inventory Automation",

  "database_tables": {

    "sales_order": "ORDR",

    "delivery": "ODLN",

    "pick_list_header": "OPKL",

    "pick_list_lines": "PKL1",

    "document_generation_wizard": "OGWZ",

    "atp_rules": "OATC"

  },

  "menu_paths": {

    "standard_atp_setting": "Gestión -> Inicialización del sistema -> Parametrizaciones de documento -> Ficha Por documento -> Pedido de cliente -> Activar verificación de disponibilidad automática",

    "advanced_atp_setting": "Gestión -> Inicialización del sistema -> Parametrizaciones de documento -> Ficha General -> Activar cantidad ATP avanzada",

    "pick_and_pack": "Inventario -> Pick y embalaje -> Gestor de pick y embalaje",

    "document_generation_wizard": "Ventas - Clientes -> Asistente de creación de documentos"

  },

  "business_rules": {

    "standard_atp_formula": "Cantidad disponible = En stock - Comprometido + Solicitado",

    "advanced_atp_strategies": [

      "Propuesta de entrega: divide la entrega para abastecer según disponibilidad inmediata y posterior.",

      "Entrega única: solo despacha si la totalidad puede surtirse en la fecha exacta solicitada.",

      "Entrega completa: pospone el despacho total hasta la fecha futura en que se encuentre el 100% de la mercancía."

    ],

    "hana_delivery_schedule_management": "Herramienta exclusiva de SAP HANA para transferir dinámicamente cantidades comprometidas entre pedidos de distinta prioridad.",

    "document_generation_wizard_scope": "Permite generar entregas o facturas en lotes masivos a partir de pedidos u órdenes base, con opciones de consolidación por cliente."

  }

}


Desarrollo Conceptual y Funcional Detallado
1. Verificación de Disponibilidad Estándar vs. Avanzada (ATP)
Verificación Estándar (SQL / HANA): Al superar la cantidad disponible en una línea de Pedido (ORDR), se despliega la ventana emergente con opciones: Continuar (dejar pendiente), Cambiar a cantidad disponible, Cambiar a disponibilidad más temprana, Consultar cantidades en otros almacenes, Ver artículos alternativos o Borrar línea.
Verificación Avanzada ATP (Exclusiva SAP HANA):
Proyecta disponibilidad dinámica en tiempo real deduciendo asignaciones temporales de otros usuarios en concurrencia.
Ofrece las 3 estrategias formales: Propuesta de entrega, Entrega única y Entrega completa.
Herramienta visual Gestión del plan de entregas (Delivery Schedule Management): permite arrastrar barras de cantidad para desasignar stock de pedidos de baja prioridad y transferirlos a pedidos críticos de clientes VIP.
2. Flujo de Picking, Embalaje y Despacho Automatizado
El Gestor de Pick y Embalaje estructura la expedición en tres fases operativas:

Cajón Abierto: Pedidos y facturas de reserva pendientes de liberación física.
Cajón Liberado: Emisión de listas de picking (OPKL) divididas por cliente, documento, grupo o almacén, asignadas a operarios específicos.
Cajón Pickeado: Confirmación de unidades recogidas, empaque con Packing Slips y generación directa de Entregas (ODLN).
3. Asistente de Creación de Documentos
Herramienta de facturación masiva en lotes: procesa cientos de entregas abiertas para generar Facturas de Clientes (OINV) consolidadas por interlocutor comercial y condiciones de pago, reduciendo tiempos administrativos de cierre diario.


Caso de Negocio Resuelto: OEC Computers
Escenario
Un cliente preferente (MegaCorporación Global) coloca un pedido de 7 escáneres de alta velocidad. El almacén principal solo dispone de 5 unidades inmediatas y las 2 restantes ingresarán en 3 días:

Al ingresar la línea, la Verificación Avanzada ATP detecta la brecha.
OEC utiliza la estrategia Propuesta de entrega dividiendo la orden en 2 entregas programadas (5 hoy, 2 el jueves).
Mediante el Gestor de Pick & Pack, se libera la primera entrega de 5 unidades directamente al operario de almacén, quien imprime la lista de empaque y genera la Entrega parcial en un solo paso.


Banco de Evaluación Situacional
Pregunta 1
¿Qué cálculo aritmético aplica la Verificación de Disponibilidad Estándar para determinar la cantidad disponible de un artículo?

A) En stock + Comprometido - Solicitado
B) En stock - Comprometido + Solicitado
C) En stock - Stock mínimo
D) Solicitado + Comprometido
Respuesta correcta: B
Justificación técnica: En SAP B1, Disponible = En Stock - Comprometido (reservado para clientes/producción) + Solicitado (órdenes de compra/producción pendientes de ingreso).
Pregunta 2
En SAP Business One versión para SAP HANA, ¿qué estrategia de entrega de la Verificación ATP Avanzada debe seleccionarse si el cliente rechaza envíos parciales y exige recibir todos los artículos juntos, aunque la entrega deba retrasarse?

A) Propuesta de entrega
B) Entrega única
C) Entrega completa
D) Entrega inmediata
Respuesta correcta: C
Justificación técnica: La estrategia Entrega completa (Complete Delivery) reprograma la fecha de despacho hasta el momento en que la cantidad total de la orden se encuentre disponible para un solo embarque unificado.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
