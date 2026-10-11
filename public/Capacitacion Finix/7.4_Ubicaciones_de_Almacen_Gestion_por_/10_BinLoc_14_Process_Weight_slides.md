# Transcripción por Diapositiva: 10_BinLoc_14_Process_Weight

## Diapositiva 1

Asignación en Ubicaciones de Almacén con Restricción de Peso — SAP Business One Versión 10.0. Bienvenido al curso: Asignación con Restricción de Peso en Ubicaciones de Almacén. Para comprender completamente el contenido de este curso, debes tener un buen conocimiento de inventario, Unidades de Medida (UdM) y gestión de ubicaciones de almacén.

---

## Diapositiva 2

Al finalizar esta formación, podrás: Asignar y registrar el peso de artículos y ubicaciones de almacén. Habilitar la asignación a ubicaciones de almacén según restricción de peso. Objetivos.

---

## Diapositiva 3

Escenario de Negocio: OEC Computers revende equipos informáticos y electrónicos a minoristas en el Reino Unido. OEC Computers ya ha implementado la solución de ubicaciones de almacén y UdM en la empresa. George, el gerente de almacén, desea comenzar a gestionar el peso de los artículos en el almacén. Un indicador de peso por artículo le permitirá monitorizar el peso de los artículos almacenados y limitar el peso de carga y transporte según los estándares permitidos. George te ha pedido, como consultor de SAP Business One, que le ayudes a gestionar el peso de artículos y ubicaciones de almacén.

---

## Diapositiva 4

Comencemos observando el campo Peso en el Maestro de Artículos. Este es el peso de la UdM de inventario del artículo. En la imagen vemos el artículo "Papel para Impresora". Este artículo pertenece al grupo "Papel" y 1 Paquete de Papel para Impresora equivale a 1 kilogramo. Nota: cada vez que actualices el campo Peso en los datos de inventario, el sistema pregunta si deseas copiar el peso de la UdM de inventario a las UdM de venta y compra. El peso se copia proporcionalmente, según las reglas de conversión definidas entre los distintos códigos de UdM en el grupo de UdM. Esta funcionalidad permite actualizar los tres campos de peso de una sola vez.

---

## Diapositiva 5

Definir el peso para la UdM de inventario del artículo permite monitorizar y registrar el peso en el almacén. También puede usarse para limitar el peso que levantan y transportan los empleados o la maquinaria del almacén. En el ejemplo mostrado, la carretilla elevadora tiene una limitación de peso de 500 kg. Como gestionamos el peso de la UdM de inventario del artículo, podemos calcular fácilmente cuántos artículos caben en la carretilla sin pesarlos cada vez. 1 paquete de papel pesa 1 kg, lo que significa que una carretilla puede transportar 500 paquetes de papel para impresora.

---

## Diapositiva 6

La solución de ubicaciones de almacén permite distintas reglas de asignación automática, incluyendo una restricción de asignación por peso. Se puede definir la capacidad de peso para cada ubicación, y ya vimos que también se puede definir el peso de la UdM de inventario del artículo. Estas definiciones permiten realizar la asignación de ubicación hasta el máximo permitido por cada ubicación. Principios de asignación por peso: se puede definir el peso para la UdM de inventario de los artículos; se puede definir la capacidad de peso para cada ubicación; se puede restringir la asignación de artículos según la capacidad de peso de la ubicación.

---

## Diapositiva 7

Observa el ejemplo ilustrado. Queremos asignar artículos de disco duro. Cada disco duro pesa 1 kg. Tenemos 2 ubicaciones: Ubic_1 y Ubic_2, cada una con una restricción de peso de 100 kg. Ubic_1 ya tiene un inventario existente de 80 kg. Ubic_2 está vacía. Hay también una regla de asignación: primero se asigna a Ubic_1 y luego a Ubic_2. Al activar la restricción de peso, el sistema asignará solo 20 kg a Ubic_1 (hasta el máximo de 100 kg) y el resto (30 kg) a Ubic_2. Total a asignar: 50 unidades × 1 kg = 50 kg.

---

## Diapositiva 8

En la ventana Configuración del Almacén se indica si se desea usar la regla de asignación hasta el peso máximo. Esta regla puede definirse tanto para Ubicaciones de Recepción como para ubicaciones regulares. Para ubicaciones regulares, se puede agregar una validación de peso adicional a cualquier regla de asignación en recepción. Nota: esta definición aplica tanto para asignación automática como manual. Para la Ubicación de Recepción, se puede agregar una validación de cantidad máxima, peso máximo o ambos. Tanto el peso máximo como la cantidad máxima se definen en el Maestro de Ubicación de Almacén.

---

## Diapositiva 9

Observa los campos Peso del Artículo y Peso Máximo en el Maestro de Ubicación de Almacén. El campo Peso del Artículo es un campo informativo que muestra el peso total de los artículos actualmente almacenados en la ubicación. Este total se calcula como la suma de la cantidad de cada artículo multiplicada por el peso definido para la UdM de inventario del artículo. El campo Peso Máximo es el peso máximo permitido para esta ubicación, introducido por el usuario. Notas importantes: si no se ingresa ningún valor en el campo Peso Máximo, no se aplicará ninguna restricción de peso a esa ubicación. Además, si una ubicación con restricción de peso contiene un artículo sin definición de peso, ese artículo no se tendrá en cuenta en el cálculo del peso de la ubicación.

---

## Diapositiva 10

¿Qué ocurre cuando se está a punto de superar el peso máximo de una ubicación? Por ejemplo, al ingresar un documento de Entrada de Mercancías OC y el peso máximo de una ubicación está a punto de excederse. En la asignación automática: no se emite ninguna alerta. El sistema asigna hasta el peso máximo permitido. Esto puede resultar en una asignación parcial o incluso en la asignación de una fracción de unidad. Para la asignación manual: sí se emite una alerta. Al ingresar en la ventana Asignación de Ubicación – Emisión y la asignación está a punto de superar el peso definido, aparece un mensaje de alerta como el mostrado en la imagen. El usuario puede entonces elegir asignar hasta el peso máximo o ignorar el mensaje.

---

## Diapositiva 11

Puntos clave de este curso: El peso puede gestionarse para la UdM de inventario del artículo. El campo Peso del Artículo en el Maestro de Ubicación de Almacén indica el peso total de los artículos actualmente almacenados en esa ubicación. El campo Peso Máximo indica la limitación de peso de la ubicación. Se puede establecer una restricción de peso para la asignación automática y manual, basada en el peso actual de la ubicación y su limitación de peso.

---

## Diapositiva 12

Aviso legal SAP — sin cambios respecto al documento original.

---
