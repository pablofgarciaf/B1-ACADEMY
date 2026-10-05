# Transcripción por Diapositiva: 10_ProjectManage_11_ProjectManage_Billing

## Diapositiva 1

Gestión de Proyectos: Facturación — SAP Business One Versión 10.0. Bienvenido al curso Gestión de Proyectos – Facturación. Para comprender este curso es necesario estar familiarizado con el módulo de Gestión de Proyectos tal como se describe en el curso de Gestión de Proyectos.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Agregar registros de hojas de tiempo. Definir documentos, actividades y registros de hojas de tiempo como facturables. Ejecutar el Asistente de Generación de Documentos de Facturación.

---

## Diapositiva 3

Escenario de Negocio. OEC Computers ofrece soluciones técnicas de TI a sus clientes. Utilizan el módulo de Gestión de Proyectos para gestionar proyectos complejos. En estos proyectos facturan a sus clientes por horas de trabajo, componentes comprados, montaje de dispositivos, etc. Actualmente emiten facturas de forma manual. Además, la empresa envía técnicos a realizar distintas tareas en las instalaciones de los clientes y desean documentar estas horas para facturarlas en consecuencia. Para lograr esto, OEC Computers decide utilizar el Asistente de Generación de Documentos de Facturación para crear facturas de múltiples componentes facturables relacionados con un proyecto.

---

## Diapositiva 4

Asistente de Generación de Documentos de Facturación — Concepto. Fuentes de datos: Hoja de Tiempo de RRHH, Datos facturables en Datos Maestros del Proyecto: Facturas A/P, Presupuestos/Pedidos/Entregas A/R, Órdenes de Trabajo (órdenes de producción), Actividades (CRM). El Asistente genera: Factura A/R o Entrega. El Asistente de Generación de Documentos de Facturación está disponible desde la versión 9.3. Recopila documentos abiertos e información facturable del proyecto. El asistente procesa estos datos y genera una factura A/R o una entrega. Las fuentes del asistente pueden ser: Facturas A/P registradas como gastos del proyecto, Presupuestos, pedidos o entregas A/R ya emitidos al cliente del proyecto, Órdenes de trabajo cerradas de artículos producidos para el proyecto, Actividades de reuniones, llamadas y tareas realizadas en el proyecto.

---

## Diapositiva 5

Marcar los Datos Fuente como Facturables. Documentos A/R+A/P y Órdenes de Trabajo: marcar como Facturable en los Datos Maestros del Proyecto. Hojas de Tiempo y Actividades (CRM): marcar como Facturable en la ventana Tipo de Actividad. El Asistente de Generación de Documentos de Facturación solo recopila registros marcados como Facturables. En los Datos Maestros del Proyecto, en la matriz inferior, se puede marcar la casilla Facturable para filas de documentos comerciales y órdenes de trabajo. Las actividades y los registros de hojas de tiempo se marcan como facturables de una manera diferente: primero se definen Tipos de Actividad y para cada Tipo de Actividad se define si es facturable o no.

---

## Diapositiva 6

Marcar Filas de Documentos como Facturables en los Datos Maestros del Proyecto. En los Datos Maestros del Proyecto: las Órdenes de Trabajo se marcan como facturables de la misma manera. Para incluir documentos comerciales y órdenes de trabajo del proyecto en el proceso de facturación, deben marcarse como Facturables. En la imagen se pueden ver dos Facturas A/P marcadas como facturables.

---

## Diapositiva 7

La Hoja de Tiempo. ID de Hoja de Tiempo 14, Tipo Empleado, Facturable, Etapa, Proyecto Financiero, Tipo de Actividad, Hora de Fin, Hora de Inicio, Fecha. La Hoja de Tiempo es un objeto de RRHH en SAP Business One que sirve para registrar la duración de distintas actividades realizadas por un empleado, usuario u otra entidad. También puede usarse para registrar la asistencia de los empleados manualmente. Hay un registro de hoja de tiempo por empleado/usuario. Los registros se filtran según el rango de fechas introducido en la cabecera. Para cada empleado o usuario se crea una hoja de tiempo. Se pueden agregar filas por cada vez que un empleado trabaja en un proyecto, especificando la fecha y la actividad. En OEC Computers, los empleados registran el tiempo que pasan en las instalaciones del cliente o realizando tareas de back office relacionadas con un proyecto determinado.

---

## Diapositiva 8

Tipo de Actividad. Administración → Configuración → Gestión de Proyectos → Tipos de Actividad. Con el Tipo de Actividad, los registros de Hojas de Tiempo y las Actividades (CRM) pueden marcarse como facturables. En la ventana de Configuración de Tipos de Actividad se definen los distintos tipos de actividades que se desean registrar. Un Tipo de Actividad puede marcarse como facturable. Entonces, los registros de Hojas de Tiempo y Actividades (CRM) conectados a un Tipo de Actividad facturable se incluirán en la ejecución del Asistente de Generación de Documentos de Facturación. En OEC Computers, Kate, la gestora de proyectos, accede a la ventana de Configuración de Tipos de Actividad y añade un nuevo tipo llamado Consultoría. Lo conecta al artículo de mano de obra L10001 – tarifa por hora y lo marca como facturable.

---

## Diapositiva 9

Actividad como Objeto Facturable. Desde el módulo CRM: El mismo Tipo de Actividad se utiliza en la Actividad (CRM) que se agregó para una reunión del comité directivo en las instalaciones del cliente. Esta actividad se incluirá en el Asistente de Generación de Documentos de Facturación porque: la actividad está conectada a una etapa del proyecto, está conectado un Tipo de Actividad facturable, y el mismo código de proyecto financiero está conectado tanto a la Actividad como a los datos maestros del proyecto.

---

## Diapositiva 10

Asistente de Generación de Documentos de Facturación — Información de Origen y Destino. Gestión de Proyectos → Asistente de Generación de Documentos de Facturación o mediante el menú contextual de los Datos Maestros del Proyecto. El asistente recopila documentos abiertos y elementos facturables conectados a un proyecto y genera una Factura A/R o una Entrega. En la información de destino se elige el tipo de documento a generar, el proyecto relevante y la etapa destino a la que se conectará el documento generado. En la sección Tipos de Origen se elige qué incluir en la ejecución. El asistente no solo genera documentos A/R basados en Facturas A/P (gastos documentados en el proyecto), sino también documentos A/R basados en Presupuestos/Pedidos o Entregas A/R conectados al proyecto.

---

## Diapositiva 11

Asistente de Generación de Documentos de Facturación — Confirmar y Ejecutar. En el paso 2, confirmar cada origen relevante. Casilla Confirmado. Botón Finalizar → elige Finalizar para abrir el documento creado por el asistente. En el paso 2, el asistente muestra la lista de orígenes conectados al proyecto. En la segunda etapa aún se puede editar el tipo de actividad, la cantidad y la fecha de entrega. Luego se confirman los orígenes a incluir. Para generar el documento se elige Finalizar. El documento destino se abre automáticamente en modo Agregar. Se pueden hacer cambios y luego agregarlo. Una vez agregado, queda conectado a la etapa destino del proyecto, marcado como facturable y ya no es editable.

---

## Diapositiva 12

Resumen. Puntos clave: El Asistente de Generación de Documentos de Facturación genera una factura A/R o una entrega por proyecto. Los objetos facturables del proyecto son: Facturas A/P, órdenes de trabajo, registros de hojas de tiempo y actividades. Los presupuestos, pedidos y entregas A/R también pueden incluirse en la ejecución del asistente. Los registros de hojas de tiempo no se registran en los datos maestros del proyecto; sin embargo, la conexión al proyecto se realiza en la hoja de tiempo en el campo Etapa. Cada objeto fuente debe marcarse como Facturable. Para documentos comerciales y órdenes de trabajo, se marca en las filas de los datos maestros del proyecto. Para registros de hojas de tiempo y actividades, se marca en el Tipo de Actividad conectado al objeto.

---

## Diapositiva 13

Aviso legal SAP — sin cambios respecto al documento original.

---
