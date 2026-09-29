# Guion de Video: DOC 075 Production RoutingProcess

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 075 Production RoutingProcess.

## Contenido Principal (Visual: Diapositivas correspondientes)
Unidad 075: Órdenes de Producción con Hoja de Ruta (Routing) (SAP Business One 10.0)
1. Metadatos Técnicos
Módulo: Producción (Manufacturing Routing & Operations)
Código de Unidad: DOC_075_Production_RoutingProcess
Audiencia Objetivo: Directores de Planta, Ingenieros de Métodos y Tiempos, Planificadores de Rutas y Consultores Senior de SAP B1.
Versión de SAP: SAP Business One 10.0 (HANA / SQL Server).


2. Antigravity Master Schema (JSON Specification)
{

  "$schema": "https://antigravity.schema.sap.com/v10/production-routing-process.json",

  "unit_id": "075_Production_RoutingProcess",

  "system_context": {

    "module": "Production",

    "submodules": ["Routing Stages", "Date Calculation", "Capacity Scheduling"],

    "database_tables": {

      "routing_tables": [

        {"table": "ORST", "description": "Maestro de Etapas de Ruta (Route Stage Master Data - Descripción, Código)"},

        {"table": "WOR4", "description": "Etapas de Ruta en la Orden de Fabricación (StageID, SeqNum, Status, StartDate, EndDate, WaitingDays)"}

      ],

      "production_lines": [

        {"table": "WOR1", "description": "Líneas de la Orden (StageID vinculado, ResourceTime, RequiredDays)"}

      ],

      "resource_capacity": [

        {"table": "RSC3", "description": "Capacidad de Ejecución Única (Single Run Capacity) utilizada para la programación de rutas"}

      ]

    },

    "menu_navigation_paths": [

      "Producción > Etapas de ruta",

      "Producción > Lista de materiales (Tipo de línea = Etapa de ruta)",

      "Producción > Orden de producción > Campo Cálculo de la fecha de hoja de ruta",

      "Producción > Orden de producción > Menú contextual > Enviar componentes (Filtrado por etapa de ruta)"

    ]

  },

  "business_rules": {

    "routing_calculation_methods": [

      {

        "method": "On Start Date",

        "date_dependencies": "No genera dependencias entre etapas. Todas las etapas adoptan la fecha de inicio de la cabecera.",

        "capacity_behavior": "El recurso se asigna a la fecha de inicio de cada etapa."

      },

      {

        "method": "On End Date",

        "date_dependencies": "No genera dependencias entre etapas. Todas las etapas adoptan la fecha de vencimiento de la cabecera.",

        "capacity_behavior": "El recurso se asigna a la fecha de fin de cada etapa."

      },

      {

        "method": "Start Date Forwards",

        "date_dependencies": "La fecha de fin de una etapa determina la fecha de inicio de la siguiente etapa. La fecha de fin de la última etapa actualiza la fecha de vencimiento de la cabecera.",

        "capacity_behavior": "Consume capacidad de ejecución única disponible día a día hacia adelante desde el inicio del día."

      },

      {

        "method": "End Date Backwards",

        "date_dependencies": "La fecha de inicio de una etapa determina la fecha de fin de la etapa previa. La fecha de inicio de la primera etapa actualiza la fecha de inicio de la cabecera.",

        "capacity_behavior": "Consume capacidad de ejecución única disponible día a día hacia atrás desde el final del día (Just-in-Time)."

      }

    ],

    "time_formulas": {

      "required_days_stage": "MAX(Required Days de todas las líneas de recurso de la etapa)",

      "total_stage_days": "Required Days de la etapa + Waiting Days (Días de espera / fraguado / secado)",

      "production_time_stage": "MAX(Production Time de todas las líneas de recurso de la etapa)"

    },

    "red_button_trigger": "El botón 'Actualizar ahora' se torna de color ROJO cuando un cambio manual en cabecera o líneas requiere un recálculo de fechas y capacidad, solicitando confirmación al usuario."

  }

}


3. Desarrollo Conceptual y Funcional Exhaustivo
3.1 Fundamentos de la Fabricación con Hoja de Ruta (Routing)
Las manufacturas complejas no consumen todos sus materiales ni aplican todos sus recursos en un único instante. El proceso se divide en Etapas Secuenciales de Ruta (ej. 1: Corte $\rightarrow$ 2: Lijado $\rightarrow$ 3: Pintura $\rightarrow$ 4: Ensamble).

En SAP Business One 10.0, una LdM o una Orden de Producción estructurada con ruta agrupa los componentes bajo cabeceras de etapa (WOR4). Cada etapa posee un número de Secuencia de Ruta que define su precedencia cronológica.
3.2 Los Cuatro Métodos de Cálculo de la Fecha de Hoja de Ruta
En la cabecera de la orden de producción se define el parámetro determinante Cálculo de la fecha de hoja de ruta:

En la fecha de inicio (On Start Date):
Método estático. No calcula dependencias temporales entre fases.
Todas las etapas reciben la misma fecha de inicio y vencimiento de la cabecera. La capacidad se reserva en el día inicial de cada etapa.
En la fecha de fin (On End Date):
Método estático. La capacidad se reserva en el día final de cada etapa.
Fecha de inicio en adelante (Start Date Forwards):
Programación Dinámica Hacia Adelante:
La fecha de inicio de la cabecera se asigna a la Etapa 1.
El sistema analiza la Capacidad de Ejecución Única disponible día a día. Si la etapa requiere 12 horas y la máquina solo dispone de 4 h/día, ocupará 3 días laborables.
La fecha de finalización calculada de la Etapa 1 fija automáticamente la Fecha de Inicio de la Etapa 2, y así sucesivamente.
La fecha de fin de la última etapa ajusta automáticamente la Fecha de Vencimiento de la cabecera.
Fecha de fin para atrás (End Date Backwards):
Programación Dinámica Inversa (Just-in-Time):
Parte de la fecha límite de entrega pactada con el cliente (Fecha de vencimiento en cabecera).
La última etapa consume capacidad hacia atrás. Su fecha de inicio calculada se convierte en la fecha de fin de la penúltima etapa.
La fecha de inicio de la Etapa 1 recalcula la Fecha de Inicio más tardía permitida en la cabecera.
3.3 Métricas Clave de Tiempos en la Hoja de Ruta
Tiempo de Producción (Production Time): Expresión cuantitativa de horas netas de máquina/trabajador ($T = \text{Cantidad Planificada} \times \text{Tiempo por Unidad}$). En una etapa, el tiempo de la etapa es el máximo entre sus recursos paralelos.
Días Necesarios (Required Days): Días de calendario que el recurso monopolizará la capacidad disponible.
Días de Espera (Waiting Days): Tiempo muerto o técnico no productivo necesario entre etapas (ej. 24 horas para secado de esmalte, curado de hormigón o enfriamiento de moldes). No consume capacidad de máquinas pero empuja cronológicamente la fecha de inicio de la etapa posterior: $$\text{Días Totales de la Etapa} = \text{Días Necesarios} + \text{Días de Espera}$$
3.4 El Mecanismo del Botón "Actualizar Ahora" en Rojo
Si el planificador modifica manualmente una fecha en la cabecera, añade un día festivo no planificado o sustituye una máquina averiada por otra con menor velocidad, se rompe la sincronización matemática de la ruta.

SAP B1 no sobreescribe los datos arbitrariamente.
El botón Actualizar ahora se ilumina en color ROJO brillante, alertando al planificador de que las fechas y asignaciones de capacidad están desfasadas.
Al hacer clic en el botón rojo, el sistema despliega una advertencia y recalcula toda la cascada de fechas de inicio/fin y capacidades comprometidas.
3.5 Despacho de Materiales por Etapa de Ruta
En lugar de abarrotar la planta de insumos desde el día 1, el supervisor abre el menú contextual de la orden y hace clic en Enviar componentes. La ventana de criterios de selección permite filtrar y despachar mediante Salida para producción (OIGE) únicamente los materiales de la etapa que está por iniciar (ej. Etapa 1: Corte), manteniendo el orden y la seguridad en planta.


4. Caso de Negocio Práctico en OEC Computers
Contexto
OEC Computers produce el servidor industrial para intemperie SRV-RUGGED-EXT. Su proceso consta de 3 etapas secuenciales:

Etapa 1: Mecanizado y Soldadura de Gabinete IP67 (Recurso: Centro CNC). Requiere 16 horas. Capacidad disponible = 8 h/día $\rightarrow$ Días necesarios = 2 días. Días de espera = 0.
Etapa 2: Sellado Químico y Pintura Térmica (Recurso: Cabina de Pintura). Requiere 8 horas (1 día). Días de espera = 1 día (secado obligatorio de la resina antes de manipulación). Días totales = 2 días.
Etapa 3: Integración de Electrónica y Pruebas (Recurso: Técnico Senior). Requiere 8 horas (1 día).
Ejecución con Método "Fecha de Inicio en Adelante"
Fecha de Inicio de Cabecera: Lunes 01 de Junio.
Cronograma Calculado Automáticamente:
Etapa 1: Inicia Lunes 01 de Junio. Finaliza Martes 02 de Junio (2 días).
Etapa 2: Inicia Miércoles 03 de Junio. Trabajo activo finaliza Miércoles 03 de Junio (1 día) + Jueves 04 de Junio de espera/secado. Fecha fin de etapa = Jueves 04 de Junio.
Etapa 3: Inicia Viernes 05 de Junio. Finaliza Viernes 05 de Junio (1 día).
Resultado: La fecha de entrega en cabecera se fija automáticamente para el Viernes 05 de Junio a las 18:00. Los componentes electrónicos solo se solicitan y envían a piso el día Viernes, protegiendo microchips costosos de polvo y calor durante las etapas previas.


5. Banco de Evaluación Situacional (Certificación SAP B1)
Pregunta 1
Al utilizar el método "Fecha de inicio en adelante" en una Orden de Producción con Hoja de Ruta, ¿cómo determina el sistema la fecha de vencimiento de la cabecera del documento?

A) Sumando 30 días calendario por defecto.
B) La fecha de fin calculada de la última etapa de ruta se copia automáticamente a la fecha de vencimiento de la cabecera.
C) Se toma del tiempo de entrega del proveedor más lento.
D) La fecha de vencimiento debe digitarse obligatoriamente de forma manual.
Respuesta Correcta: B
Justificación Técnica: En la programación dinámica hacia adelante, el sistema proyecta el consumo secuencial de capacidad etapa tras etapa; por lo tanto, el instante en que concluye la última operación fija la finalización real de la orden en la cabecera.
Pregunta 2
¿Qué función operativa cumple el campo "Días de espera" (Waiting Days) en una etapa de hoja de ruta?

A) Define el número de días que el cliente tiene para pagar la factura.
B) Representa un tiempo de espera técnico no productivo (como secado o fraguado) que se suma a los días necesarios de la etapa para aplazar el inicio de la etapa posterior, sin consumir capacidad de máquinas.
C) Bloquea el sistema impidiendo abrir otras órdenes de producción.
D) Reduce el costo de la mano de obra.
Respuesta Correcta: B
Justificación Técnica: Los días de espera modelan tiempos de proceso pasivos (curado químico, enfriamiento) que no demandan recursos activos pero que postergan físicamente la disponibilidad de las piezas para la siguiente fase.
Pregunta 3
¿Por qué motivo el botón "Actualizar ahora" de una orden de producción con hoja de ruta se muestra de color ROJO?

A) Porque la orden ha incurrido en un sobrecosto financiero.
B) Porque un cambio manual en fechas, recursos o cantidades requiere un recálculo de la programación de fechas de las etapas y de la capacidad de recursos.
C) Porque la licencia de producción ha caducado en el SLD.
D) Porque no hay materias primas disponibles en stock.
Respuesta Correcta: B
Justificación Técnica: El botón rojo es una señal de advertencia interactiva que indica al usuario que la lógica temporal de la ruta está desfasada tras una edición manual y requiere que el operador autorice el recálculo formal de las fechas de la orden.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
