Unidad 071: Capacidad de Recursos y Planificación de Planta (SAP Business One 10.0)
1. Metadatos Técnicos
Módulo: Producción y Planificación de Capacidad (MRP / Production)
Código de Unidad: DOC_071_Production_ResourcesCapacity
Audiencia Objetivo: Consultores de Producción, Planificadores Maestros de Producción (MPS), Directores de Operaciones Industriales y Administradores de SAP Business One.
Versión de SAP: SAP Business One 10.0 (HANA / SQL Server).


2. Antigravity Master Schema (JSON Specification)
{

  "$schema": "https://antigravity.schema.sap.com/v10/production-resource-capacity.json",

  "unit_id": "071_Production_ResourcesCapacity",

  "system_context": {

    "module": "Production",

    "submodules": ["Resources", "Capacity Planning", "Production Orders"],

    "database_tables": {

      "header_tables": [

        {"table": "ORSC", "description": "Maestro de Recursos (Resource Master Data)"},

        {"table": "ORST", "description": "Tipos de Recurso (Resource Types: Machine, Labor, Other)"},

        {"table": "ORGP", "description": "Grupos de Recursos y Cuentas Contables WIP"}

      ],

      "capacity_tables": [

        {"table": "RSC1", "description": "Componentes de Costo del Recurso (1-10)"},

        {"table": "RSC2", "description": "Datos de Planificación Diaria del Recurso (Factores 1-4)"},

        {"table": "RSC3", "description": "Capacidad Diaria Generada por Almacén / Período (Internal & Single Run)"},

        {"table": "RSC4", "description": "Capacidad Comprometida por Órdenes de Fabricación"},

        {"table": "RSC5", "description": "Capacidad Consumida por Emisiones a Producción"}

      ],

      "transaction_tables": [

        {"table": "OWOR", "description": "Cabecera de Orden de Producción"},

        {"table": "WOR1", "description": "Líneas de la Orden de Producción (Tipo Recurso)"}

      ]

    },

    "menu_navigation_paths": [

      "Recursos > Datos maestros del recurso > Ficha Datos de planificación",

      "Recursos > Datos maestros del recurso > Ficha Datos de capacidad",

      "Recursos > Fijar capacidades internas diarias",

      "Recursos > Capacidad de recursos (Ventana interactiva de análisis)",

      "Gestión > Inicialización del sistema > Parametrizaciones generales > Ficha Recursos"

    ]

  },

  "business_rules": {

    "capacity_formula": "Capacidad Disponible = Capacidad Interna - Capacidad Comprometida - Capacidad Consumida",

    "internal_capacity_calc": "Factor 1 * Factor 2 * Factor 3 * Factor 4",

    "single_run_capacity_calc": "Multiplicación exclusiva de los factores marcados como 'Relevante para ejecución única' (usualmente Factor 1)",

    "allocation_methods": [

      {"method": "On Start Date", "code": "SD", "description": "Toda la cantidad requerida se asigna en la fecha de inicio de la línea."},

      {"method": "On End Date", "code": "ED", "description": "Toda la cantidad requerida se asigna en la fecha de vencimiento/fin de la línea."},

      {"method": "Start Date Forwards", "code": "SF", "description": "Consume capacidad disponible desde la fecha de inicio hacia adelante día a día hasta agotar el requerimiento. Si sobra, asigna el residuo a la fecha de inicio."},

      {"method": "End Date Backwards", "code": "EB", "description": "Consume capacidad disponible desde la fecha de fin hacia atrás día a día hasta agotar el requerimiento (enfoque Just-in-Time)."}

    ],

    "cumulative_view_logic": "La vista de capacidad acumulada suma progresivamente las disponibilidades netas diarias para detectar sobrecargas estructurales reales frente a desfases puntuales de un único día."

  }

}


3. Desarrollo Conceptual y Funcional Exhaustivo
3.1 Fundamentos y Necesidad de la Gestión de Capacidad
En entornos productivos discretos o por lotes, disponer de las materias primas (artículos) no garantiza el cumplimiento de las fechas de entrega. Los cuellos de botella surgen casi invariablemente por falta de disponibilidad de Recursos Críticos (máquinas de corte, centros de mecanizado CNC, hornos de secado, técnicos certificados de calibración).

SAP Business One 10.0 implementa un motor de capacidad de recursos bidimensional:

Capacidad Interna (Internal Capacity): Representa el potencial total de horas/ciclos disponibles sumando todos los turnos y recursos paralelos (por ejemplo, 2 máquinas funcionando 2 turnos de 8 horas = 32 horas/día). Permite múltiples órdenes en paralelo.
Capacidad de Ejecución Única (Single Run Capacity): Asume la restricción de que una orden de producción específica solo puede ser procesada por una máquina/operario individual a la vez (no se puede acelerar un ciclo de 8 horas en una sola máquina poniéndole 2 máquinas a la mitad del tiempo si la pieza no se puede dividir). Considera únicamente los factores marcados como relevantes (usualmente las horas por turno de 1 máquina).
3.2 El Ciclo de 2 Pasos para Generar la Capacidad
Para que el sistema conozca la disponibilidad de una máquina o cuadrilla, se deben seguir dos pasos secuenciales:

Paso 1: Definición de Capacidad Diaria Estándar (Template Semanal): En el maestro del recurso (ORSC), ficha Datos de planificación, se definen hasta 4 factores por día de la semana (Lunes a Domingo):
Factor 1: Horas trabajadas por turno (ej. 8 horas).
Factor 2: Número de turnos por día (ej. 2 turnos).
Factor 3: Número de máquinas idénticas o técnicos en el centro de trabajo (ej. 2 tornos).
Factor 4: Eficiencia o factor de merma operacional.
Se marca la casilla de selección en la columna del factor que aplica para la Ejecución única (por defecto Factor 1).
Paso 2: Generación de la Capacidad en el Calendario de Planta: A través de la ventana Fijar capacidades internas diarias (Recursos > Fijar capacidades internas diarias), el planificador proyecta la plantilla semanal sobre un rango de fechas real (por ejemplo, el trimestre Q1 del 01.01.2026 al 31.03.2026) considerando días festivos y paradas técnicas.
Se puede copiar la plantilla estándar o ingresar excepciones manuales (ej. mantenimiento mayor el 15 de febrero con capacidad 0).
Permite copiar de Interna a Ejecución Única o viceversa.
3.3 Visualización y Monitoreo: Ficha Datos de Capacidad vs. Ventana Capacidad de Recursos
Ficha Datos de Capacidad (ORSC): Muestra el resumen numérico consolidado para un período y almacén: $$\text{Capacidad Disponible} = \text{Interna} - \text{Comprometida} - \text{Consumida}$$
Interna: Capacidad nominal total en el período.
Comprometida: Capacidad reservada por Órdenes de Producción en estado Planificado o Liberado pendientes de ejecución.
Consumida: Horas/ciclos ya emitidos mediante Salida para producción (OIGE).
Ventana interactiva Capacidad de Recursos: Cuadrícula temporal dinámica donde las columnas son los días del calendario y las filas representan los recursos y sus 4 estados de capacidad (Interna, Comprometida, Consumida, Disponible).
Casilla "Mostrar capacidad acumulada de hoy": Herramienta clave de balanceo de planta. Si un recurso muestra $-6$ horas el Miércoles pero el Jueves tiene $+16$ horas libres, la vista diaria normal alarma con un número rojo de sobrecarga puntual. Sin embargo, la vista acumulada muestra un balance positivo, indicando al jefe de planta que basta con mover la orden o que el trabajo puede absorberse sin contratar horas extra. Si la vista acumulada se torna negativa, existe un cuello de botella estructural insalvable.
3.4 Métodos de Asignación de Recursos en Órdenes de Producción
En las líneas de la orden de producción (WOR1), el consumo del recurso se planifica según uno de los 4 métodos:

En la fecha de inicio (On Start Date): Todo el requerimiento de horas de la línea se reserva en el día de inicio. Útil para tareas de alistamiento o arranque.
En la fecha de fin (On End Date): Todo el requerimiento se reserva el día final.
Fecha de inicio en adelante (Start Date Forwards): Consume la capacidad disponible del día 1; si no alcanza, pasa al día 2, día 3, etc. Recomendado para producción contra stock (Make-to-Stock), buscando terminar el inventario lo antes posible.
Fecha de fin para atrás (End Date Backwards): Inicia la reserva en la fecha de entrega y busca hacia atrás en los días previos la capacidad requerida. Enfoque puro Just-in-Time (JIT / Make-to-Order) para no inmovilizar capital ni ocupar piso de planta antes de tiempo.


4. Caso de Negocio Práctico en OEC Computers
Contexto
OEC Computers ensambla servidores corporativos modelo SRV-ENTERPRISE-X1. El centro de trabajo de pruebas de estrés térmico y control de calidad utiliza la máquina QC-THERMAL-01 (Recurso tipo Máquina).
Configuración del Recurso
Parámetros del Recurso en ORSC:
Unidad de Medida de Recurso: Horas.
Factor 1: 8 horas/turno (marcado como Relevante para Ejecución Única).
Factor 2: 2 turnos diarios.
Factor 3: 1 máquina disponible.
Capacidad Interna Diaria: $8 \times 2 \times 1 = 16\text{ horas/día}$.
Capacidad de Ejecución Única: $8\text{ horas/día}$.
Generación de Capacidad: Se proyecta la capacidad para la primera semana de Marzo (Lunes 02 a Jueves 05 de Marzo = 64 horas internas totales, 32 horas de ejecución única).
Demanda: Se genera una Orden de Producción para 5 servidores corporativos. Cada servidor requiere 6 horas de prueba térmica (Total = 30 horas de recurso comprometidas).
Asignación: Se aplica el método Fecha de inicio en adelante a partir del 02 de Marzo:
Lunes 02 de Marzo: Capacidad disponible = 8 h (Ejecución única). Se comprometen 8 h (Quedan 0 h disponibles). Faltan 22 h.
Martes 03 de Marzo: Capacidad disponible = 8 h. Se comprometen 8 h (Quedan 0 h disponibles). Faltan 14 h.
Miércoles 04 de Marzo: Capacidad disponible = 8 h. Se comprometen 8 h (Quedan 0 h disponibles). Faltan 6 h.
Jueves 05 de Marzo: Capacidad disponible = 8 h. Se comprometen 6 h (Quedan 2 h disponibles).
Resultado: La fecha de finalización calculada automáticamente de la etapa es el 05 de Marzo a las 14:00. No se generan alertas de cuello de botella porque la vista acumulada nunca cae por debajo de cero.


5. Banco de Evaluación Situacional (Certificación SAP B1)
Pregunta 1
En SAP Business One 10.0, ¿cuál es la diferencia técnica fundamental entre la Capacidad Interna y la Capacidad de Ejecución Única de un recurso?

A) La capacidad interna calcula los costos financieros, mientras que la ejecución única calcula las horas de los empleados.
B) La capacidad interna multiplica todos los factores configurados permitiendo trabajo paralelo, mientras que la ejecución única solo toma los factores marcados como relevantes asumiendo que solo una orden de producción puede procesarse a la vez en ese recurso.
C) La capacidad interna solo aplica a subcontratistas externos y la ejecución única a máquinas de la empresa.
D) No existe diferencia técnica; son sinónimos que se aplican según la versión de base de datos HANA o SQL.
Respuesta Correcta: B
Justificación Técnica: La capacidad interna representa el total de ciclos/horas agregados ($F1 \times F2 \times F3 \times F4$). La capacidad de ejecución única aísla las restricciones de una sola máquina u operario individual para evitar planificar que una sola tarea indivisible se complete más rápido por tener múltiples operarios en la misma máquina si físicamente no es viable.
Pregunta 2
Un planificador observa en la ventana interactiva Capacidad de recursos que el día 10 de octubre un recurso presenta una capacidad disponible de $-12$ horas (en rojo). Sin embargo, al activar la casilla Mostrar capacidad acumulada de hoy, el balance hasta el 10 de octubre es de $+40$ horas. ¿Qué decisión operativa debe tomar el planificador?

A) Cancelar inmediatamente la orden de producción porque la planta colapsará.
B) Contratar de inmediato un turno nocturno extraordinario para el día 10 de octubre.
C) No es una sobrecarga estructural insalvable; la vista acumulada demuestra que en los días previos hubo capacidad ociosa suficiente, por lo que basta con adelantar la programación o ajustar las fechas de inicio de las órdenes.
D) Revalorizar el costo del recurso en la tabla RSC1.
Respuesta Correcta: C
Justificación Técnica: La vista acumulada consolida las entradas y salidas de capacidad en el horizonte temporal. Una cifra diaria puntual negativa con acumulado positivo evidencia un simple desfase de programación que puede resolverse nivelando la carga hacia los días previos sin incurrir en costos de capacidad adicional.
Pregunta 3
¿Qué ocurre con la capacidad de los recursos cuando una Orden de Producción se crea en estado Planificado?

A) No tiene ningún impacto en la capacidad hasta que pasa a estado Liberado.
B) La capacidad requerida se resta de la capacidad interna y se suma a la columna Comprometido, reduciendo la capacidad Disponible.
C) Se consume automáticamente y se contabiliza en la cuenta WIP.
D) Se crea una solicitud de compra de servicio en el módulo de Compras.
Respuesta Correcta: B
Justificación Técnica: Al igual que los artículos de inventario pasan a cantidad Comprometida al crearse la orden, las horas/ciclos de los recursos en la orden de producción se reservan pasando a Capacidad Comprometida, garantizando que otros planificadores visualicen la indisponibilidad de dicha capacidad en el horizonte seleccionado.