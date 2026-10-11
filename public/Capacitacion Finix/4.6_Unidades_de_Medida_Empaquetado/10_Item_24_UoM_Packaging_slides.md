# Transcripción por Diapositiva: 10_Item_24_UoM_Packaging

## Diapositiva 1

Artículos e Inventario: Unidades de Medida — Configurar Paquetes — SAP Business One Versión 10.0. Bienvenido al tema sobre la configuración de paquetes.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Configurar cálculos automáticos del tipo y la cantidad de materiales de embalaje a usar al enviar o recibir un artículo. En este tema aprenderás a configurar cálculos automáticos del tipo y la cantidad de materiales de embalaje al enviar o recibir un artículo. También verás cómo crear automáticamente un albarán de embalaje con el contenido de los paquetes en una entrega.

---

## Diapositiva 3

Escenario de Negocio. OEC Computers compra papel en palés y lo vende con o sin embalaje. Cuando el papel se vende en grandes cantidades, el equipo de almacén lo empaqueta en cajas. Se quiere configurar el cálculo automático de materiales de embalaje para papel a fin de agilizar el proceso. Además, se quiere garantizar que se creen automáticamente los albaranes de embalaje correctos para los artículos en ventas y compras.

---

## Diapositiva 4

Pasos para Configurar el Embalaje. Pasos: 1) Configurar los tipos de paquete globales (Administración → Configuración → Inventario). 2) Asignar un grupo de unidades de medida al artículo (Datos Maestros del Artículo). 3) Configurar el embalaje en el artículo para cada unidad de medida (Datos Maestros del Artículo). Veamos los pasos para configurar el embalaje por unidad de medida de un artículo. Primero se configuran los tipos de paquete globales. Luego se asigna un grupo de unidades de medida al artículo (cómo configurar grupos de unidades de medida se trató en un tema anterior). Finalmente se configura el embalaje en el artículo para cada unidad de medida: para ventas desde un botón en la pestaña Datos de Ventas y para compras desde un botón en la pestaña Datos de Compras.

---

## Diapositiva 5

Paso 1: Configurar el Tipo de Paquete. Administración → Configuración → Inventario → Tipos de Paquete. El primer paso es configurar los tipos de paquete que se usarán globalmente. Para cada tipo de paquete, se introduce un nombre y sus dimensiones. Si también se han introducido dimensiones para cada unidad de medida, introducir las dimensiones del paquete permitirá al sistema calcular el número de unidades para cada paquete específico. En el ejemplo, el papel se compra en palés. Al venderlo, las grandes cantidades se envían en cajas, contenedores o palés. Se han introducido dimensiones de longitud, anchura, altura, volumen y peso para cada tipo de paquete utilizado en productos de papel.

---

## Diapositiva 6

Uso del Peso en un Tipo de Paquete. El peso indicado en un tipo de paquete puede referirse al peso bruto con el contenido incluido o al peso neto del paquete sin contenido. Esto ofrece flexibilidad para usar la columna de peso según las necesidades del negocio. Al decidir cómo usar este campo, hay que considerar si se desea utilizar este valor para calcular el número de unidades que caben en un paquete. Si se quiere que este dato sea el valor predeterminado para el cálculo del número de unidades por paquete, debe referirse al peso bruto disponible para dicho paquete. La desventaja del peso bruto es que la definición del paquete queda limitada a artículos que comparten el mismo peso para el mismo volumen. Si el tipo de paquete se va a usar para muchos artículos con distintos pesos, no conviene usar un peso bruto predeterminado para el artículo.

---

## Diapositiva 7

Paso 2: Asignar el Grupo de Unidades de Medida al Artículo. Datos Maestros del Artículo → Papel de Impresora Blanco → Embalaje por UdM. El segundo paso para configurar la selección automática de paquetes para un artículo es asignar un grupo de unidades de medida al artículo. Puede asignarse manualmente o heredarse por defecto desde las categorías de artículos. También existe una opción global para añadir todas las unidades del grupo al artículo automáticamente; esto se controla con la casilla Agregar Automáticamente Todas las Definiciones del Grupo de UdM en la Configuración General. Si esta casilla no está marcada, hay que agregar las unidades del grupo individualmente usando el botón Agregar Fila. Una vez asignado el grupo de unidades de medida al Datos Maestros del Artículo, se puede dar el siguiente paso para configurar el embalaje por cada unidad de medida. Ejemplo de grupo: Pack = 21x30x4 cm; Pack Pequeño = 0,5 Pack; Paquete de 6 = 6 Pack; Caja = 24 Pack; Palé = 48 Pack.

---

## Diapositiva 8

Paso 3 — Configurar el Embalaje en el Artículo. Configurar el embalaje para: Ventas y Compras. Existen dos tipos de embalaje que se pueden configurar para un artículo: paquetes para ventas y paquetes para compras. Para configurar los paquetes de artículos que vendes a clientes, elige la pestaña Datos de Ventas y el botón a la derecha del campo Tipo de Paquete. Para configurar los paquetes para recepción de artículos, accede a la pestaña Datos de Compras y elige el botón a la derecha del campo Tipo de Paquete. Estos botones abren una ventana donde se define la relación entre cada unidad de medida y tipos de paquete específicos, según el número de unidades necesario y las dimensiones de esas unidades. Los tipos de paquete para ventas pueden ser distintos de los usados para compras. En el ejemplo, OEC Computers recibe papel de sus proveedores en un palé. Cuando venden papel a clientes, puede venderse sin embalaje, en cajas, contenedores o palés.

---

## Diapositiva 9

Paso 3 en Detalle: Datos de Ventas del Artículo — Unidad de Medida de Ventas. Desde la pestaña Datos de Ventas de los Datos Maestros del Artículo. En este ejemplo se examina la ventana de ventas, aunque los paquetes para ventas y compras se configuran de la misma manera. Desde la pestaña Datos de Ventas, el botón lleva a la ventana UdM de Ventas y Tipos de Paquete. En la parte izquierda de la ventana se ven las unidades de medida. Una de ellas puede establecerse como predeterminada para ventas. En el ejemplo, la unidad más popular es el Paquete de 6, por lo que se ha establecido como unidad predeterminada para ventas. Al elegir una unidad, las dimensiones de esa unidad se muestran en la parte inferior de la ventana. Estas medidas provienen de la Configuración global de Unidades de Medida y pueden modificarse manualmente.

---

## Diapositiva 10

Paso 3 en Detalle: Datos de Ventas del Artículo — Tipo de Paquete. Desde la pestaña Datos de Ventas de los Datos Maestros del Artículo. En la parte derecha de la ventana UdM de Ventas y Tipos de Paquete se introduce la información de paquete para cada artículo. Existe la opción de mostrar todos los tipos de paquete en esta ventana como predeterminado; esto se controla con la casilla Agregar Automáticamente Todas las Definiciones de Paquete en la Configuración General. Puede ser muy útil si no hay muchos tipos de paquete. Si hay muchos, se pueden agregar individualmente usando el botón Agregar Fila, o eliminarlos desde el menú contextual. Se puede establecer un tipo de paquete como predeterminado, que se copiará al campo Tipo de Paquete de la pestaña Datos de Ventas. Al hacer clic en un tipo de paquete, se pueden ver y definir sus dimensiones. Las dimensiones se toman por defecto de la Configuración de Tipos de Paquete, pero pueden modificarse manualmente.

---

## Diapositiva 11

Paso 3 en Detalle: Cantidad por Paquete. En la ventana completa UdM de Ventas y Tipos de Paquete se puede ver la relación entre unidades de medida y paquetes, y qué usa el sistema para calcular la cantidad por paquete. El sistema usa las dimensiones de volumen del paquete y de la unidad de medida para determinar cuántas unidades caben en un paquete. El resultado del cálculo aparece en el campo Cantidad por Paquete. Ejemplo: el Paquete de 6 mide 30 cm de largo y 21 cm de ancho. La Caja mide 60 cm de largo y 42 cm de ancho. El Paquete de 6 y la Caja tienen la misma altura. Esto significa que 2 Paquetes de 6 caben en el largo de la caja y otros 2 en el ancho, dando un total de 4 Paquetes de 6 por caja.

---

## Diapositiva 12

Calcular Paquetes en Documentos. El campo Número de Paquetes muestra el cálculo de la cantidad introducida en la fila dividida entre la cantidad por paquete. Como la Caja tiene 4 Paquetes de 6 por defecto (según la ventana UdM de Ventas y Tipos de Paquete), si vendemos 8 Paquetes de 6 de papel, necesitamos 2 cajas. El inventario no se cuenta por la unidad de ventas (Paquete de 6) sino por la unidad de inventario (Pack). El campo Cantidad (Unidad de Medida de Inventario) muestra la cantidad de ventas multiplicada por los artículos por unidad. En el ejemplo, los artículos por unidad son 6 (1 Paquete de 6 = 6 Packs), por lo que: 8 x 6 = 48 unidades de inventario (Packs).

---

## Diapositiva 13

Consejos Útiles. Siempre es posible cambiar las dimensiones de unidades y tipos de paquete dentro de los datos de ventas o compras del artículo. Si faltan dimensiones de volumen, el campo Cant. por Paquete en las ventanas de tipos de paquete de los Datos Maestros del Artículo se calculará según el peso. Si deseas calcular por peso, recuerda usar el peso bruto de un paquete completamente cargado en la definición del tipo de paquete. El campo Cant. por Paquete solo puede contener números enteros y el resultado de un cálculo siempre se redondea hacia abajo. Si el cálculo de la cantidad de paquetes para una unidad de medida específica es menor que 1, no aparecerá ningún valor en el campo.

---

## Diapositiva 14

Creación Automática de un Albarán de Embalaje. Inicialización del Sistema → Configuración de Documentos → Por Documento. SAP Business One puede crear automáticamente un albarán de embalaje para entregas y facturas A/R realizadas para artículos con múltiples unidades de medida. Para configurar esta opción, accede a la ventana de Configuración de Documentos en la pestaña Por Documento. En el campo Documento elige Entrega o Factura A/R y activa la casilla Recomendar Embalaje Según los Datos Maestros del Artículo.

---

## Diapositiva 15

Contenido del Albarán de Embalaje. Se muestra un albarán de embalaje creado automáticamente para una entrega que incluye paquetes. Los datos provienen de la ventana UdM de Ventas y Tipos de Paquete combinada con los datos de la entrega. En el ejemplo, se emitió una entrega de 8 unidades de Paquete de 6. Según las definiciones de la ventana UdM de Ventas y Tipos de Paquete, 4 unidades de Paquete de 6 caben en 1 caja, por lo que se necesitan 2 cajas para entregar 8 unidades. El peso total se calcula multiplicando el peso por unidad por el número de unidades en cada paquete. En el ejemplo, 1 unidad de Paquete de 6 pesa 15 kg y 1 caja contiene 4 unidades: 15 kg × 4 = 60 kg. Al elegir una fila de la lista de paquetes existentes, se pueden ver los artículos embalados en la caja en la parte inferior derecha de la ventana.

---

## Diapositiva 16

Resumen. Puntos clave: Existen tres pasos para configurar paquetes basados en las unidades de medida: 1) Configurar los tipos de paquete globales (Administración → Configuración → Inventario). 2) Asignar un grupo de unidades de medida al artículo. 3) Configurar los paquetes en los Datos Maestros del Artículo para cada unidad de medida. Tienes la opción de mostrar todos los tipos de paquete en la ventana como predeterminado (casilla Agregar Automáticamente Todas las Definiciones de Paquete en la Configuración General). Puedes establecer tipos de paquete predeterminados para ventas y para compras. El sistema usa las dimensiones de volumen del paquete y de la unidad de medida para determinar automáticamente cuántas unidades caben en un paquete. Si faltan dimensiones de volumen, el campo Cantidad por Paquete se calculará según el peso. SAP Business One puede crear automáticamente un albarán de embalaje para entregas y facturas A/R de artículos con múltiples unidades de medida; esta configuración se mantiene en las pestañas de Configuración de Documentos para entregas y facturas A/R.

---

## Diapositiva 17

Aviso legal SAP — sin cambios respecto al documento original.

---
