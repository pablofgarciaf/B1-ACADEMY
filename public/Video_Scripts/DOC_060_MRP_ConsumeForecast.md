# Guion de Video: DOC 060 MRP ConsumeForecast

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 060 MRP ConsumeForecast.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 060: CONSUMO DE PREVISIONES Y PRONÓSTICOS EN EL MOTOR MRP (SAP BUSINESS ONE 10.0)
Código de Manual: 10_MRP_12_ConsumeForecast
Módulo Oficial: Producción y Planificación (Production & MRP - Forecast Consumption)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Planificadores de la Demanda, Jefes de Operaciones, Directores de Cadena de Suministro y Agentes IA (Antigravity)
Carpeta Asociada: 060_10_MRP_12_ConsumeForecast


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "060",

  "topic": "Forecast Consumption in Material Requirements Planning (MRP)",

  "sap_module": "Production_MRP_ForecastConsumption",

  "database_tables": {

    "forecast_master": "OFCT",

    "forecast_lines": "FCT1",

    "general_settings_planning": "OADM (ConsumFcst, ConsumMthd, DaysBwd, DaysFwd)",

    "sales_orders": "ORDR / RDR1 (ConsumeFcst)",

    "blanket_agreements": "OOAT / OAT1 (ConsumeFcst, Frequency)"

  },

  "menu_paths": [

    "Gestión > Inicialización del sistema > Parametrizaciones generales > Pestaña Inventario > Subpestaña Planificación",

    "Planificación de necesidades > Pronósticos",

    "Ventas - Clientes > Pedido de cliente > Columna Consumir previsión (Sí/No)",

    "Ventas - Clientes > Acuerdo global de venta > Pestaña Posiciones > Columna Consumir previsión"

  ],

  "consumption_methods": {

    "Backward_Forward": {

      "search_order": "Busca primero hacia atrás (Días precedentes) desde la fecha de entrega; si no hay pronóstico remanente, busca hacia adelante (Días posteriores).",

      "inventory_effect": "Minimiza el stock de seguridad en el futuro inmediato; ideal para empresas orientadas a mantener bajo nivel de inventario (Lean/JIT).",

      "risk_profile": "Mayor riesgo de rotura si surge demanda imprevista."

    },

    "Forward_Backward": {

      "search_order": "Busca primero hacia adelante (Días posteriores) desde la fecha de entrega; si no hay pronóstico remanente, busca hacia atrás (Días precedentes).",

      "inventory_effect": "Aumenta las recomendaciones de compra en el futuro cercano, incrementando el nivel de inventario preventivo.",

      "risk_profile": "Minimiza el riesgo de desabastecimiento; ideal para empresas con alta exigencia de nivel de servicio al cliente."

    }

  },

  "consumption_formula": {

    "net_demand_displayed": "Demanda_Neta_MRP = Pedidos_Reales + Max(0, Pronostico_Original - Pedidos_Reales_Consumidores)",

    "forecast_record_integrity": "El consumo NO modifica el registro maestro del pronóstico (OFCT/FCT1); únicamente altera la matriz de demanda resultante dentro de la corrida de MRP."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Peligro de la Duplicación de Demanda en la Planificación
Cuando una empresa utiliza Pronósticos de Venta (Forecasts) para anticiparse a los pedidos de clientes de largo plazo y, simultáneamente, ingresa los Pedidos de Clientes Reales (ORDR), existe un riesgo crítico de sobreproducción:

Si la empresa proyecta vender 1,000 unidades y luego recibe un pedido real por 900 unidades, sumar ambas demandas ($1,000 + 900 = 1,900$) duplicaría innecesariamente las compras de materias primas y saturaría los almacenes.
El mecanismo de Consumo de Previsiones (Forecast Consumption) resta automáticamente las cantidades de los pedidos reales de la previsión existente, asegurando que la demanda total procesada por MRP sea de solo 1,000 unidades (900 pedidos reales + 100 de previsión remanente).
2.2 Algoritmos de Búsqueda: Hacia Atrás vs Hacia Adelante
En Parametrizaciones Generales > Inventario > Planificación, se parametrizan los días de ventana de búsqueda (Días hacia atrás y Días hacia adelante) y el método de consumo:

Método Hacia Atrás - Hacia Adelante (Backward-Forward):
El sistema busca previsiones abiertas desde la fecha de entrega del pedido hacia el pasado.
Si agota la previsión anterior y aún queda pedido por compensar, busca en periodos futuros.
Impacto: Consume primero las previsiones más antiguas, reduciendo las órdenes de compra en el corto plazo.
Método Hacia Adelante - Hacia Atrás (Forward-Backward):
El sistema consume primero las previsiones de semanas o meses futuros.
Impacto: Conserva la demanda del periodo actual y traslada las necesidades hacia el presente, generando compras tempranas y aumentando la disponibilidad de stock de seguridad.
2.3 Acuerdos Globales de Venta (Blanket Agreements) y Pronósticos
Los Acuerdos Globales de Venta (OOAT) con clientes recurrentes pueden actuar como previsiones específicas de cliente.
Si se activan para consumir pronósticos, cada entrega programada (mensual, trimestral o semanal) reduce la previsión genérica de ventas de la empresa a partir de la fecha de inicio del acuerdo (From Date), integrando los compromisos contractuales con la planificación de fábrica.


3. ATLAS DIDÁCTICO: COMPARATIVA DE CONSUMO (ESCENARIO 2 SEMANAS)
Parámetros: Semana 15 (Pronóstico = 1,000) y Semana 16 (Pronóstico = 1,000).
Pedidos Reales: Lunes 8 (200 un), Viernes 12 (900 un), Lunes 15 (300 un).



4. CASO DE NEGOCIO RESUELTO: GESTIÓN DE DISCOS DUROS EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers implementa el consumo de previsiones para el artículo Disco Duro 400 GB:

Pronóstico Semanal Semana 11 = 1,100 unidades.
Llegan dos pedidos de clientes en la semana: Pedido A por 600 unidades y Pedido B por 400 unidades (Total pedidos = 1,000 unidades).
Comportamiento del Motor MRP:
En la corrida de MRP, el sistema evalúa la línea de demanda del disco duro.
Reconoce los dos pedidos de cliente como demanda firme ($600 + 400 = 1,000\text{ unidades}$).
Consume la previsión de 1,100 restando 1,000, dejando una demanda de previsión neta de 100 unidades.
La demanda total que procesa MRP para calcular compras es exactamente de 1,100 unidades ($1,000 + 100$), en lugar de disparar una compra inflada de 2,100 unidades.
Se evitan sobrecostos de almacenamiento y problemas de flujo de caja financiero.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Qué efecto produce la ejecución de MRP con "Consumo de Previsiones" sobre las cantidades grabadas originalmente en el documento de Pronóstico (OFCT/FCT1)?
A) Borra permanentemente las líneas del pronóstico original.
B) Ninguno; el documento maestro de previsión permanece inalterado, modificándose únicamente la cantidad neta de demanda calculada en la matriz temporal de resultados de MRP.
C) Reduce el precio de venta en las listas de precios.
D) Convierte el pronóstico en una orden de producción cerrada.
Respuesta Correcta: B
Justificación Técnica: La previsión es un maestro estadístico que preserva sus valores originales de presupuestación; el consumo es un cálculo dinámico en memoria durante la ejecución del escenario de MRP.
Pregunta 2
Si una empresa busca minimizar a toda costa los niveles de inventario almacenado para reducir costos de capital de trabajo, ¿cuál método de consumo de previsión debe seleccionar?
A) Forward - Backward.
B) Backward - Forward.
C) Consumo exclusivamente anual.
D) Ningún método (acumulación directa).
Respuesta Correcta: B
Justificación Técnica: El método Backward-Forward consume primero las previsiones más antiguas o inmediatas, reduciendo las recomendaciones de compra a corto plazo y evitando acumulaciones tempranas de stock.
Pregunta 3
¿Bajo qué condiciones un Acuerdo Global de Ventas (Blanket Agreement) puede consumir pronósticos en la planificación de MRP?
A) Solo si tiene un monto superior a $100,000 USD.
B) Debe tener el estado "Autorizado" (Approved) y tener un código de almacén especificado en la línea correspondiente.
C) Solo si está vinculado a un proveedor extranjero.
D) Únicamente en almacenes gestionados por peso.
Respuesta Correcta: B
Justificación Técnica: Para que MRP reconozca el acuerdo global como demanda válida consumidora, debe estar contractualmente aprobado y tener asignado el almacén logístico de retiro.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
