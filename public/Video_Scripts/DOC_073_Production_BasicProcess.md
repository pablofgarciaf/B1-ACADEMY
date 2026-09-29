# Guion de Video: DOC 073 Production BasicProcess

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 073 Production BasicProcess.

## Contenido Principal (Visual: Diapositivas correspondientes)
Unidad 073: Proceso de Producción Básico y Ciclo de Fabricación (SAP Business One 10.0)
1. Metadatos Técnicos
Módulo: Producción (Manufacturing Execution)
Código de Unidad: DOC_073_Production_BasicProcess
Audiencia Objetivo: Supervisores de Planta, Contadores de Costos de Manufactura, Operadores de Sistema y Consultores SAP B1.
Versión de SAP: SAP Business One 10.0 (HANA / SQL Server).


2. Antigravity Master Schema (JSON Specification)
{

  "$schema": "https://antigravity.schema.sap.com/v10/production-basic-process.json",

  "unit_id": "073_Production_BasicProcess",

  "system_context": {

    "module": "Production",

    "submodules": ["Production Orders", "Issue for Production", "Receipt from Production"],

    "database_tables": {

      "transaction_headers": [

        {"table": "OWOR", "description": "Orden de Producción (DocEntry, Status: P=Planned, R=Released, L=Closed, C=Cancelled)"},

        {"table": "OIGE", "description": "Salida para Producción (Goods Issue - Consumo de materias primas y recursos)"},

        {"table": "OIGN", "description": "Recibo de Producción (Goods Receipt - Entrada de producto terminado y subproductos)"}

      ],

      "transaction_lines": [

        {"table": "WOR1", "description": "Líneas de Componentes de la Orden (ItemCode, BaseQty, PlannedQty, IssuedQty, IssueType)"},

        {"table": "IGE1", "description": "Líneas de Salida de Componentes"},

        {"table": "IGN1", "description": "Líneas de Entrada de Producto Terminado"}

      ],

      "costing_tables": [

        {"table": "OJDT", "description": "Asientos Contables de Producción (WIP Debit/Credit)"},

        {"table": "JDT1", "description": "Partidas Contables (Cuentas de inventario en proceso, variación y existencias)"}

      ]

    },

    "menu_navigation_paths": [

      "Producción > Orden de producción",

      "Producción > Salida para producción",

      "Producción > Recibo de producción",

      "Producción > Informes de producción > Informe de desviación de la orden de producción"

    ]

  },

  "business_rules": {

    "lifecycle_states": [

      {"status": "Planned", "code": "P", "rules": "Permite modificaciones totales. No permite consumos (OIGE) ni recibos (OIGN). Reserva inventario como Comprometido y capacidad como Comprometida."},

      {"status": "Released", "code": "R", "rules": "Piso de planta activo. Permite traslados a piso, emisiones manuales y recibos de producto terminado. Acumula costos reales en cuenta WIP."},

      {"status": "Closed", "code": "L", "rules": "Finalización total. No permite más transacciones. Liquida la cuenta WIP calculando la desviación de producción contra la cuenta de variación de inventario."},

      {"status": "Cancelled", "code": "C", "rules": "Solo permitida si no existen emisiones (IssuedQty = 0). Libera stock y capacidad comprometida."}

    ],

    "issue_methods": [

      {"method": "Manual", "rules": "El usuario debe crear expresamente el documento 'Salida para producción' (OIGE). Obligatorio para artículos gestionados por Número de Serie o Lote."},

      {"method": "Backflush (Toma Retroactiva)", "rules": "El sistema emite los componentes automáticamente en el momento exacto en que se registra el 'Recibo de producción' (OIGN). Prohibido para series/lotes con asignación manual obligatoria."}

    ],

    "inventory_balance_impact": {

      "planned_state": {"components": "+Comprometido, -Disponible", "finished_good": "+Solicitado, +Disponible"},

      "completed_state": {"components": "-En Stock, -Comprometido", "finished_good": "+En Stock, -Solicitado"}

    }

  }

}


3. Desarrollo Conceptual y Funcional Exhaustivo
3.1 El Documento Central: La Orden de Producción (OWOR)
La Orden de Producción es el eje de control operativo y financiero de la planta en SAP Business One. Su objetivo es transformar materias primas e insumos, combinados con la capacidad de máquinas y mano de obra, en un producto terminado valorado.

Tipos de Orden de Producción:
Estándar: Basada en una LdM de Producción para fabricar artículos regulares.
Especial: Permite fabricar o reparar artículos sin necesidad de una LdM previa (los componentes y recursos se definen manualmente al momento de crear la orden).
Desmontaje: Desensambla un producto terminado para reintegrar sus componentes al inventario.
Campos de Cabecera Clave:
Cantidad Planificada: Determina el factor de escala multiplicador para las cantidades base de las líneas (WOR1.PlannedQty = BaseQty * HeaderPlannedQty).
Prioridad: Valor de 1 a 100 (1 = máxima prioridad) visible en la consola de Pick & Pack.
Fechas Operativas: Fecha de contabilización, Fecha de inicio y Fecha de vencimiento (por defecto: Fecha de inicio + Tiempo de ciclo del artículo en OITM).
3.2 Ciclo de Vida y Estados de la Orden de Producción
Estado Planificado (Planned):
Es el estado inicial al agregar el documento.
Impacto en Stock: Los artículos componentes aumentan su cantidad en el campo Comprometido (reduciendo el Disponible). El producto terminado resultante incrementa su cantidad en Solicitado (aumentando su Disponible para ventas futuras).
Restricción: Está estrictamente prohibido realizar emisiones (OIGE) o recibos (OIGN).
Estado Liberado (Released):
Autoriza formalmente el inicio de actividades en planta.
Permite emitir traslados de inventario hacia el almacén de piso de producción.
Habilita la captura de costos mediante Salida para producción.
Estado Cerrado (Closed):
Tras notificar la finalización completa o parcial, el usuario cierra la orden.
Liquidación de WIP: Se calcula la diferencia entre los débitos acumulados en la cuenta de Trabajo en Proceso (WIP Account) por insumos y recursos emitidos, frente a los créditos ingresados al recibir el producto terminado a su costo estándar o estimado. Cualquier residuo se salda a cero contra la cuenta de Variación de Inventario mediante un asiento contable automático (OJDT).
3.3 Métodos de Emisión de Materiales a Planta
Emisión Manual (Manual Issue):
El operario registra un documento independiente de Salida para producción (OIGE) por cada consumo real.
Permite despachos parciales, consumos escalonados y sobrantes de material.
Requisito Técnico: Obligatorio para artículos gestionados por Números de Serie o Lotes, ya que el sistema exige seleccionar las series/lotes específicos que salen de la bodega.
Toma Retroactiva (Backflush):
Automatización total para artículos de gran volumen, granel o materias primas estándar no serializadas (ej. tornillería, cables, resinas).
El sistema no exige salidas previas. Al generar el Recibo de producción (OIGN) del producto final, SAP B1 crea en segundo plano una salida de inventario automática que descuenta las materias primas exactamente en la proporción teórica de la LdM.


4. Caso de Negocio Práctico en OEC Computers
Contexto
OEC Computers recibe un pedido para ensamblar 20 estaciones de trabajo CAD Modelo WS-CAD-01.
Ejecución del Flujo
Creación de la Orden (OWOR):
Producto: WS-CAD-01.
Cantidad Planificada: 20 unidades.
Estado: Planificado.
Verificación: El inventario comprometido de procesadores Xeon, memorias ECC y tarjetas Quadro aumenta en 20 unidades en el almacén central.
Liberación:
El supervisor cambia el estado a Liberado.
Se genera un traslado de inventario desde el almacén 01 (Central) al almacén 02 (Piso de Ensamble).
Emisión de Componentes:
La memoria RAM y cables SATA están configurados como Toma retroactiva.
Las tarjetas gráficas y procesadores están configurados como Manual por estar controlados por número de serie. El técnico genera una Salida para producción (OIGE) seleccionando los 20 números de serie específicos extraídos del almacén.
Finalización y Recibo (OIGN):
Tras ensamblar los equipos, el supervisor ingresa al menú contextual de la orden y selecciona Recibo de producción.
Se registran las 20 estaciones con sus respectivos nuevos números de serie de producto terminado.
En ese mismo instante, el sistema ejecuta la toma retroactiva de las memorias y cables.
Cierre:
Se cambia el estado de la orden a Cerrado. Se liquida la cuenta WIP sin variaciones significativas.


5. Banco de Evaluación Situacional (Certificación SAP B1)
Pregunta 1
¿Qué cambio contable y operativo ocurre en SAP Business One cuando una Orden de Producción cambia su estado de "Liberado" a "Cerrado"?

A) Se eliminan los números de serie asignados a los componentes.
B) Se desbloquea la modificación de la cantidad planificada en la cabecera.
C) La orden queda bloqueada para futuras contabilizaciones y el sistema liquida cualquier saldo remanente en la cuenta de trabajo en proceso (WIP) debitando o acreditando la cuenta de desviación de existencias.
D) Se genera automáticamente una factura de proveedores por la mano de obra.
Respuesta Correcta: C
Justificación Técnica: El cierre de la orden de producción ejecuta el finiquito de costos de manufactura. Compara los costos reales ingresados a WIP con el valor del producto ingresado al inventario; el delta contable se cancela mediante un asiento automático contra la cuenta de variación o desviación de producción.
Pregunta 2
Si un artículo componente está configurado con el método de emisión "Toma retroactiva" (Backflush) pero en sus Datos Maestros está gestionado por "Números de Serie", ¿qué ocurrirá al intentar generar el Recibo de Producción?

A) El sistema seleccionará los números de serie más antiguos automáticamente según FIFO.
B) El sistema arrojará un error de validación impidiendo la toma retroactiva, ya que SAP Business One exige que los artículos gestionados por número de serie se emitan mediante el método manual para garantizar la asignación explícita de series.
C) Se generará una compra de emergencia en el módulo de compras.
D) Los números de serie se registrarán en estado nulo.
Respuesta Correcta: B
Justificación Técnica: Por regla de negocio inmutable en SAP B1, los artículos serializados no pueden emitirse por Backflush puro si requieren asignación unitaria obligatoria en transacciones de salida, exigiendo el método Manual para auditar qué serie específica ingresó a cada máquina producida.
Pregunta 3
¿Cómo afecta al cálculo de disponibilidad de inventario la creación de una Orden de Producción en estado "Planificado" para 10 unidades de producto terminado?

A) Reduce inmediatamente el stock físico (En stock) de los componentes.
B) No afecta ninguna variable hasta que se libere la orden.
C) Aumenta la cantidad "Comprometida" de los componentes (reduciendo su disponible) y aumenta la cantidad "Solicitada" del producto terminado (aumentando su disponible teórico).
D) Bloquea el almacén completo de producción.
Respuesta Correcta: C
Justificación Técnica: La fórmula fundamental de inventario en SAP B1 es $\text{Disponible} = \text{En Stock} - \text{Comprometido} + \text{Solicitado}$. La orden planificada compromete insumos y solicita producto terminado sin mover saldos físicos de almacén.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
