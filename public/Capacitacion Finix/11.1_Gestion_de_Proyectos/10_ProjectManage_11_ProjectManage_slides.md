# Transcripción por Diapositiva: 10_ProjectManage_11_ProjectManage

## Diapositiva 1

Gestión de Proyectos: Visión General — SAP Business One Versión 10.0. En esta formación encontrarás dos escenarios que describen las principales funcionalidades del módulo de Gestión de Proyectos. También está disponible una formación adicional sobre Facturación en Gestión de Proyectos. Para más información, consulta el documento de ayuda Cómo trabajar con Gestión de Proyectos en SAP Business One.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Explicar el concepto de gestión de proyectos en SAP Business One. Crear, mantener y completar un proyecto mediante los Datos Maestros del Proyecto. Conectar diferentes objetos a los Datos Maestros del Proyecto. Crear y gestionar subproyectos. Monitorear proyectos mediante el gráfico de Gantt e informes de gestión de proyectos.

---

## Diapositiva 3

Concepto. El módulo de Gestión de Proyectos permite gestionar distintos tipos de proyectos en el sistema. La ventana de Datos Maestros del Proyecto es un área de trabajo centralizada que agrupa los diferentes aspectos del proyecto y permite documentar sus distintas etapas. La lista de etapas compone el proceso del proyecto y puede usarse para la planificación. Para cada etapa se define un porcentaje de progreso de modo que la suma de todas las etapas terminadas sea el 100%. Cada etapa puede contener datos relevantes para esa fase del proyecto. El sistema analiza estos datos para obtener información sobre el valor, el costo y el beneficio del proyecto. El módulo de Gestión de Proyectos debe habilitarse manualmente en la ventana de Detalles de la Empresa.

---

## Diapositiva 4

Datos del Proyecto. Para cada etapa en los Datos Maestros del Proyecto pueden referenciarse diferentes datos: documentos de marketing e inventario, órdenes de producción, soluciones de servicio y actividades. Además, se puede vincular un código de proyecto financiero a cada proyecto. Los Datos Maestros del Proyecto forman un único punto de entrada tanto para los datos financieros como para los logísticos.

---

## Diapositiva 5

Salidas de la Gestión de Proyectos. Usando la información del proyecto acumulada en los datos maestros, el usuario puede generar un gráfico de Gantt, informes y ejecutar el Asistente de Generación de Documentos de Facturación para facturar los costos imputables del proyecto.

---

## Diapositiva 6

Escenario de Negocio. OEC Computers ofrece soluciones técnicas de TI a sus clientes. Estas soluciones normalmente incluyen: planificación e instalación de infraestructura, suministro de hardware informático, configuración e integración de equipos e instalación de equipos periféricos. OEC Computers quiere gestionar un proyecto por cada cliente para hacer seguimiento del progreso según diferentes hitos. También quiere definir un presupuesto para el proyecto y analizar su rentabilidad. Además, algunos proyectos están compuestos por varios subproyectos. Para lograr esto, OEC Computers decide utilizar el módulo de Gestión de Proyectos.

---

## Diapositiva 7

Escenario 1 — El Proceso del Proyecto. Etapa 1: Asignación del equipo del proyecto. Etapa 2: Reunión de inicio (Kickoff). Etapa 3: Análisis de brecha (Gap Analysis). Etapa 4: Compra y ensamblaje. Etapa 5: Configuración e integración. Etapa 6: Piloto y firma de conformidad. En esta formación se recorre el proceso del proyecto desde su creación hasta su finalización. En la imagen se ven las distintas etapas del proyecto en el escenario. En muchos casos todas las etapas del proyecto se crean de antemano, incluyendo los tiempos planificados de inicio y fin. En nuestro escenario, las etapas se crean una a una conforme avanza el proyecto.

---

## Diapositiva 8

Información de Cabecera del Proyecto. Un proyecto realizado para un cliente se marca como Externo; un proyecto interno se marca como Interno. Cuatro posibles estados: Iniciado, Pausado, Detenido y Finalizado. La barra de progreso % Completado se actualiza según el porcentaje de progreso de las filas de etapa terminadas. Se conecta un proyecto financiero para vincular los documentos relevantes asociados al proyecto. Kate es la gestora de proyectos en OEC Computers. Ella introduce los Datos Maestros del Proyecto y añade un nuevo proyecto para el cliente Maxi Teq. Marca el proyecto como Externo y mantiene el estado predeterminado Iniciado mientras el proyecto está activo. Vincula el proyecto financiero abierto por el contable de la empresa, que está relacionado con cuentas de ingresos en el plan de cuentas. Esto permite hacer seguimiento de información financiera del proyecto y vincular los documentos relevantes.

---

## Diapositiva 9

Etapas del Proyecto y Porcentaje de Progreso. La pestaña Etapas es la columna vertebral de los Datos Maestros del Proyecto. Aquí se documenta cada etapa del proyecto. Cada etapa puede tener más de una tarea. La lista de tareas es común a todas las etapas, lo que significa que cada tarea puede usarse en distintas etapas. En nuestro escenario, Kate define dos tareas para la etapa de Concepción/Inicio: la primera es la asignación del equipo del proyecto y la segunda es la reunión de inicio. La primera tarea se marca como terminada y tiene una ponderación del 2% en la finalización del proyecto; por lo tanto, el porcentaje de progreso total del proyecto es ahora del 2%. Nota: la Fecha de Fin es una fecha estimada o deseada; la Fecha de Finalización real se rellena automáticamente con la fecha de hoy al marcar la casilla Terminado.

---

## Diapositiva 10

Datos de las Etapas. Para cada fila de etapa en la tabla superior, se pueden añadir datos adicionales a través de las opciones en la parte inferior. Los datos pueden ser, por ejemplo, una Factura A/R para facturar al cliente, una Actividad para una reunión planificada o un Problema Abierto (Open Issue) surgido durante el proceso del proyecto.

---

## Diapositiva 11

Agregar una Actividad. Kate programa la reunión en una Actividad de calendario de SAP Business One. Amplía la opción Actividad y desde el campo Actividad añade una nueva actividad de reunión. La información relevante de la actividad se copia a la fila de Actividad en el proyecto. Una actividad relacionada con un proyecto puede crearse directamente desde el módulo CRM o de Socio de Negocio. Una vez que se introducen los datos del proyecto en la actividad, esta se añade automáticamente a la etapa del proyecto correspondiente. También es posible conectar un ID de fila de etapa de un proyecto en la pestaña Otros Detalles de la Actividad.

---

## Diapositiva 12

Agregar una Factura A/R. Kate marca la segunda tarea como terminada y el porcentaje de completado sube al 7%. Añade una nueva etapa llamada Definición/Planificación con una tarea de análisis de brecha. Añade otra etapa predefinida para la facturación mensual de las horas invertidas en este proyecto (2.000). Tras añadir la Factura A/R, el importe se copia a la tabla de etapas en la columna Importe Facturado (A/R). Kate también añade manualmente un costo planificado para cada fila de etapa, lo que permite planificar el presupuesto del proyecto y compararlo con el valor real acumulado. Nota: las Facturas A/R y las Entregas también pueden emitirse en lote mediante el Asistente de Generación de Documentos de Facturación.

---

## Diapositiva 13

Asignación de Documentos. Kate añade una cuarta etapa para la compra de hardware y el ensamblaje de equipos. Al abrir los Datos Maestros del Proyecto, el sistema muestra un mensaje indicando que existe un documento con el mismo código de proyecto financiero pero que no está conectado al proyecto (código 101). Kate elige Sí para asignarlo. En la ventana de Asignación de Documentos, ve una Factura A/P con varias filas correspondiente a la factura de compra de equipos del proyecto. Kate selecciona todas las filas, elige la etapa destino (etapa 4) y pulsa el botón de flecha para relacionar las filas del documento.

---

## Diapositiva 14

Gestión de Documentos. En la imagen se ve la sección Documentos ampliada para la 6.ª fila de etapa. Allí aparece la fila de Factura A/P relacionada con los Datos Maestros del Proyecto en el paso anterior. Kate también adjunta la factura escaneada del proveedor en la pestaña Adjuntos. El importe total de la Factura A/P aparece ahora en la columna Importe Facturado (A/P) para la etapa 4. Cualquier documento puede también añadirse manualmente en la sección Documentos.

---

## Diapositiva 15

Conexión de una Etapa del Proyecto en Documentos. Un proyecto puede conectarse manualmente usando el campo Etapa en: documentos de marketing, Hoja de Tiempo y Actividades (CRM). El valor de Etapa es la concatenación del proyecto (clave interna) y los números de fila de etapa, y del campo ID Único de la fila de etapa (si está definido). El ID Único en los datos maestros del proyecto es un campo de texto libre y opcional. Es recomendable asignar un nombre significativo al campo ID Único para localizarlo fácilmente. La conexión de una etapa del proyecto en una fila de documento solo es posible cuando el mismo código de proyecto financiero está conectado tanto a los datos maestros del proyecto como a la fila del documento. El tema de la Hoja de Tiempo se aborda en el curso de Facturación en Gestión de Proyectos.

---

## Diapositiva 16

Gestión de Órdenes de Producción en una Etapa. OEC Computers ensamblaron un servidor en un proceso de producción para este proyecto. Kate abre la sección Órdenes de Trabajo de la 4.ª etapa y añade la Orden de Producción correspondiente. Solo se muestran las Órdenes de Producción con el mismo código de proyecto financiero. Alternativamente, se puede añadir manualmente una nueva Orden de Producción directamente. En la Orden de Producción se pueden añadir recursos para los empleados involucrados en el proyecto, lo que permite reflejar el costo de los empleados y gestionar su capacidad.

---

## Diapositiva 17

Dependencia entre Filas de Etapa. Se pueden definir hasta 4 dependencias distintas. Cuando una fila de etapa depende de otra tarea, solo puede marcarse como terminada si la tarea base también está terminada. En nuestro proyecto, la fila de etapa 5 (Compra y Ensamblaje) depende de la fila de etapa 3 (Análisis de Brecha). Esto significa que Kate solo puede marcar la tarea 5 como terminada después de haber marcado la tarea 3. También es posible añadir una dependencia sobre una etapa de un subproyecto diferente.

---

## Diapositiva 18

Gestión de Problemas Abiertos en un Proyecto. Durante la etapa de configuración (fila de etapa 7) surgió un problema relacionado con una certificación necesaria para la instalación de un software. El técnico en las instalaciones del cliente llama a Kate y le pide ayuda. Kate crea un registro de Problema Abierto para la fila de etapa 7 y busca una solución predefinida en la base de conocimiento de soluciones en la columna Solución de la sección Problema Abierto. Esta es la misma base de conocimiento de soluciones del módulo de Servicio. Kate encuentra la solución n.º 27 con la información de certificación relevante y llama al técnico. Una vez resuelto el problema, Kate marca el problema como cerrado. Nota: una fila de etapa no puede marcarse como terminada mientras exista un problema abierto relacionado. Existe un informe dedicado a los problemas abiertos para analizar los problemas recurrentes en proyectos.

---

## Diapositiva 19

Propietario de Etapa. Ha llegado la última etapa del proyecto: ejecutar un piloto y firmar la conformidad. Kate se asigna a sí misma como propietaria de esta fila de etapa y es responsable en las instalaciones del cliente de ejecutar el piloto y gestionar los rechazos.

---

## Diapositiva 20

Resumen del Proyecto (1/2). La pestaña Resumen proporciona información importante como: costo planificado (presupuesto) vs. valor real de la etapa, parámetros de rentabilidad y costos de producción y recursos. La sección resaltada en la parte inferior es relevante cuando se trabaja con subproyectos y muestra los importes totales de todos los subproyectos. Los datos en la parte superior de la ventana son relevantes para el proyecto/subproyecto actual. El valor Varianza Total es el cálculo: Total A/P − Presupuesto. El campo % de Varianza muestra que el costo real de los documentos A/P es un 32% inferior al costo planificado. Nota: el campo Importe Abierto (A/P) es el total de todos los documentos A/P abiertos conectados al proyecto, excluida la Factura A/P, lo que permite planificar mejor los gastos futuros del proyecto.

---

## Diapositiva 21

Resumen del Proyecto (2/2). En la sección Valores de Beneficio se ven los datos de ingresos. Kate introdujo manualmente el ingreso esperado del proyecto y comprobó que el importe total facturado al cliente aún no ha alcanzado el importe esperado. Kate prevé que esta diferencia se eliminará en la próxima ronda de facturación. El campo Importe Abierto (A/R) muestra todos los documentos A/R abiertos excepto las Facturas A/R. En la sección Costos de Órdenes de Trabajo se ven los distintos costos relacionados con la producción. El importe de Varianza Total es la suma de todos los importes de Varianza Total de las Órdenes de Producción relacionadas con este proyecto.

---

## Diapositiva 22

Estado del Proyecto. Cuando un proyecto está terminado y todas las obligaciones con el cliente se han cumplido, Kate cambia el estado del proyecto de Iniciado a Finalizado. Para finalizar un proyecto, todas las tareas deben marcarse como Terminadas. Los otros dos valores de estado son: Detenido (cuando el proyecto se detiene antes de lo previsto) y Pausado (para poner el proyecto en espera temporalmente). Al seleccionar Detenido o Finalizado, la fecha actual se actualiza automáticamente en el campo de fecha de cierre.

---

## Diapositiva 23

Escenario 2 — Trabajo con Subproyectos. La funcionalidad de subproyectos permite gestionar proyectos complejos en los que cada subproyecto tiene sus propias etapas y datos de resumen. Un subproyecto puede contener más subproyectos por debajo, formando así una estructura jerárquica en árbol con el proyecto principal en el nivel superior. Kate gestiona otro proyecto para un gran cliente (Parameter Technologies) que tiene varias ubicaciones y necesita renovar equipos e infraestructura en todas ellas. Kate decide crear un subproyecto para cada ubicación, lo que le permite gestionar los datos de cada ubicación de forma independiente pero también gestionar los datos acumulados de todas ellas.

---

## Diapositiva 24

Agregar y Duplicar Subproyectos. Kate crea el subproyecto Londres dentro del proyecto Parameter100. Antes de añadir un segundo subproyecto se da cuenta de que todos son similares, por lo que decide duplicar el subproyecto Londres ya creado. Elige la opción Añadir subproyecto desde plantilla y selecciona Londres en la lista de subproyectos.

---

## Diapositiva 25

Contribución del Subproyecto. En cada subproyecto, Kate define la proporción relativa del subproyecto respecto al proyecto completo introduciendo un porcentaje en el campo % de Contribución. El subproyecto Londres está definido como el 20% del proyecto Parameter100 y está completado al 50%. Como los demás subproyectos aún no han comenzado, el % de completado del proyecto completo es el 10% (50% del 20% asignado al subproyecto Londres).

---

## Diapositiva 26

Visión General del Proyecto. Una visión general del proyecto puede verse en: la pestaña Resumen y el Informe de Visión General del Proyecto generado desde el menú contextual de los Datos Maestros del Proyecto. Kate añadió varios subproyectos según las distintas ubicaciones del proyecto Parameter100. Ahora va a la pestaña Resumen para obtener una visión más amplia de todos sus subproyectos. También abre la Visión General del Proyecto desde el menú contextual. La visión general del proyecto funciona como un área de trabajo donde Kate puede ver el progreso de los distintos subproyectos, marcar filas de etapa como completadas y abrir los datos maestros de cada subproyecto de la lista.

---

## Diapositiva 27

Gráfico de Gantt. Otra forma de monitorear un proyecto es visualizando su gráfico de Gantt, al que se accede desde el menú contextual de los Datos Maestros del Proyecto. En la imagen se ven 3 subproyectos del proyecto Parameter100. Cada subproyecto tiene la misma estructura con 4 filas de etapa idénticas, pero con fechas de inicio y fin distintas. Se pueden desplazar las barras de tiempo del Gantt de subproyectos y etapas para actualizar las líneas de tiempo del proyecto con fines de planificación.

---

## Diapositiva 28

Informes del Proyecto. Hay 3 informes distintos en el módulo de Proyectos que pueden analizar múltiples proyectos y ofrecer una visión general cruzada: Análisis de Etapas (lista de proyectos abiertos con desglose a sus etapas relacionadas), Problemas Abiertos (lista de problemas abiertos filtrable por propietario/prioridad/proyecto) y Recursos (lista de recursos relacionados con proyectos). Estos informes son muy útiles al trabajar con subproyectos, ya que los datos del proyecto se agrupan en los informes. Existe un cuarto informe que proporciona una visión general de los registros de hojas de tiempo relacionados con proyectos (ver curso de Facturación en Gestión de Proyectos).

---

## Diapositiva 29

Resumen (1/2). Puntos clave: Un proyecto está compuesto por etapas. Cada fila en la pestaña Etapas representa una tarea concreta de una etapa; pueden definirse varias tareas para una misma etapa. Cada fila de etapa tiene un porcentaje de completado; la suma de todos los porcentajes llega al 100%. Se pueden relacionar para cada fila de etapa distintos tipos de datos: documentos, órdenes de producción, actividades, problemas abiertos (incidencias) y adjuntos. El sistema sugiere la asignación de documentos a un proyecto según el código de proyecto financiero relacionado. También es posible conectar filas de etapa en documentos de marketing, Actividades y la Hoja de Tiempo seleccionando el ID de etapa en las filas del documento.

---

## Diapositiva 30

Resumen (2/2). Cuando existe un proyecto financiero, es importante vincularlo a los Datos Maestros del Proyecto para habilitar la asignación de documentos y relacionar documentos de producción. Se puede definir que una fila de etapa dependa de la finalización de otra; esta dependencia también puede definirse entre etapas de distintos subproyectos. En la pestaña Resumen se encuentra información útil del proyecto como beneficio, presupuesto y costo, incluyendo información acumulada de subproyectos. Un proyecto puede tener subproyectos, y cada subproyecto puede tener los suyos, formando una estructura jerárquica. Para cada subproyecto debe definirse un % de contribución para determinar su proporción respecto al proyecto principal y su aportación al porcentaje de completado total. Al trabajar con varios subproyectos es útil ver el proyecto completo en la Visión General del Proyecto y en el gráfico de Gantt.

---

## Diapositiva 31

Aviso legal SAP — sin cambios respecto al documento original.

---
