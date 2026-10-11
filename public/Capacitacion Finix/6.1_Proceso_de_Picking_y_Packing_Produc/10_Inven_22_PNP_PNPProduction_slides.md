# Transcripción por Diapositiva: 10_Inven_22_PNP_PNPProduction

## Diapositiva 1

Artículos e Inventario: Preparación de Mercancías en el Proceso de Producción — SAP Business One Versión 10.0. Bienvenido al curso Preparación de Mercancías en el Proceso de Producción. Antes de realizar esta formación, debes completar el tema Preparación y Embalaje en el Proceso de Ventas y tener un buen conocimiento del proceso de producción.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Describir el uso del Gestor de Preparación, Embalaje y Producción en el proceso de producción.

---

## Diapositiva 3

Escenario de Negocio. OEC Computers revende equipos informáticos y electrónicos a distribuidores en el Reino Unido. Además, OEC Computers ensambla equipos combinados con distintos componentes como discos duros, tarjetas de memoria y carcasas. OEC dispone de varias áreas de producción para fabricar diferentes tipos de equipos. George es el gestor de almacén de OEC Computers. Junto con su consultor de SAP Business One, ya ha implementado procesos de preparación en la empresa. Ahora George quiere incluir también procesos de preparación para producción: le gustaría crear listas de preparación para los componentes necesarios en producción y gestionar la recogida de componentes del almacén y la entrada del artículo producido en el mismo. El consultor muestra a George cómo aprovechar el Gestor de Preparación, Embalaje y Producción como área de trabajo para crear los documentos de producción relevantes.

---

## Diapositiva 4

Preparación y Embalaje en el Proceso de Producción — Concepto. Orden de Producción → Gestor de Preparación, Embalaje y Producción → Entrada desde Producción. Para iniciar la producción: liberar la Orden de Producción. En el Gestor de Preparación, Embalaje y Producción: seleccionar las filas de la Orden de Producción y crear una lista de preparación. En el Gestor, tras la preparación: crear la Salida para Producción. Tras la producción: agregar la Entrada desde Producción. OEC Computers puede generar listas de preparación para los artículos necesarios en su proceso de producción. Una vez al día, George abre el Gestor, selecciona las filas de las Órdenes de Producción y crea listas de preparación. Los componentes se recogen y llevan al área de planta. A continuación, el gestor de almacén crea un documento de Salida para Producción desde el Gestor para consumir los componentes del inventario en producción. Finalmente, una vez completada la producción, el gestor de almacén agrega un documento de Entrada desde Producción para añadir el producto final al inventario. Nota: para los artículos componentes con el método de retroimputación, el proceso no incluye crear un documento de Salida para Producción.

---

## Diapositiva 5

Gestor de Preparación, Embalaje y Producción — Criterios de Selección. Inventario → Preparación y Embalaje → Gestor de Preparación, Embalaje y Producción. George ejecuta el Gestor para todas las órdenes de producción del área de planta Lab. OEC Computers ha añadido un campo definido por el usuario en el documento de Orden de Producción para indicar qué área de planta se utilizará, ya que disponen de tres áreas diferentes. George quiere ver solo las órdenes de producción destinadas al área Lab. Al pulsar Aceptar para abrir el Gestor, George ve una lista de filas de órdenes de producción para el área Lab.

---

## Diapositiva 6

Crear una Salida para Producción desde el Gestor de Preparación, Embalaje y Producción. La imagen muestra los siguientes pasos: El primer paso consiste en crear una lista de preparación pulsando el botón Liberar a Lista de Preparación. Este proceso es similar al descrito en el tema Preparación y Embalaje en el Proceso de Ventas. El empleado de almacén usa la lista de preparación para recoger los artículos para producción. Para consumir los componentes en producción se debe generar un documento de Salida para Producción. En el paso 2, una vez generada la lista de preparación, George entra en el cajón Liberado y selecciona todas las filas de Órdenes de Producción que desea enviar a producción. En el paso 3, elige el botón Crear y selecciona la opción Salida para Producción.

---

## Diapositiva 7

Crear una Entrada desde Producción en el Gestor de Preparación, Embalaje y Producción. Una vez finalizada la producción, los artículos producidos deben introducirse en el almacén mediante el documento de Entrada desde Producción. Al igual que la Salida para Producción, este documento puede generarse desde el Gestor. George abre el cajón Preparado para encontrar las mismas filas de producción que ya fueron preparadas y emitidas para producción. Selecciona las filas, elige Crear y luego selecciona la opción que agrega una Entrada desde Producción.

---

## Diapositiva 8

Gestión de Recursos en el Proceso de Preparación y Embalaje. Al igual que las filas de artículos, las filas de recursos pueden procesarse en el Gestor de Preparación, Embalaje y Producción. Cuando sea necesario, George puede filtrar el tipo de filas de la orden de producción (recurso o artículo) en la ventana de criterios de selección. En el Gestor, utiliza el indicador de tipo de fila para distinguir entre artículos y recursos. Aunque los recursos no se preparan físicamente, incluirlos en el Gestor permite procesar todas las filas de la Orden de Producción. De este modo, el Gestor puede ser verdaderamente un área de trabajo desde el que gestionar todo el proceso de producción. Este procedimiento es muy similar al de los artículos no inventariables que se describe en el tema Preparación y Embalaje en el Proceso de Ventas.

---

## Diapositiva 9

Preparación de Mercancías en un Proceso de Producción con Enrutamiento. En las órdenes de producción con enrutamiento, el proceso de producción se divide en etapas llamadas secuencias de ruta. Estas secuencias se organizan en un orden determinado y cada una tiene su propia fecha de inicio y fecha de finalización. El Gestor de Preparación, Embalaje y Producción muestra campos relacionados con el enrutamiento para proporcionar toda la información necesaria para crear documentos de producción como listas de preparación, Salidas para Producción y Entradas desde Producción. Las columnas resaltadas muestran información relacionada con el enrutamiento: las columnas Fecha de Inicio y Fecha de Entrega/Vencimiento representan las fechas de inicio y fin de una etapa; las columnas Secuencia de Ruta y Etapa de Ruta también muestran información sobre las órdenes de producción con enrutamiento. Todo esto permite ordenar o filtrar (en los criterios de selección) las filas de órdenes de producción según las necesidades del proceso. Dos columnas proporcionan información para todos los tipos de órdenes de producción: N.° de Producto (código del artículo producido) y Prioridad de Producción (permite ordenar las filas por prioridad de la orden de producción).

---

## Diapositiva 10

Resumen. Puntos clave de este tema: El proceso de preparación de artículos a través del Gestor de Preparación, Embalaje y Producción para producción es similar al del proceso de ventas. El Gestor puede utilizarse como área de trabajo para gestionar un proceso de producción completo, incluyendo la creación de documentos de Salida para Producción y Entrada desde Producción. Las filas de recursos de las órdenes de producción también están disponibles en el Gestor para crear documentos destino para filas de artículos y recursos. El Gestor también admite el procesamiento de órdenes de producción con enrutamiento: la información sobre fechas de inicio y fin, etapa y secuencia de ruta permite ordenar y filtrar por esta información.

---

## Diapositiva 11

Aviso legal SAP — sin cambios respecto al documento original.

---
