# Transcripción por Diapositiva: 10_Purch_14_Process_Services

## Diapositiva 1

Compras: Compra de Servicios — SAP Business One Versión 10.0. Bienvenido al tema sobre la compra de servicios.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Describir las opciones para la compra de servicios. En esta sesión analizaremos las opciones disponibles para comprar servicios. Veremos dos formas de gestionar los servicios en compras: con y sin pedidos de compra. Luego revisaremos los pasos para registrar facturas A/P de servicios como alquiler o suministros. Finalmente, hablaremos sobre la posibilidad de usar transacciones recurrentes.

---

## Diapositiva 3

Escenario de Negocio. Compras servicios como diseño web o jardinería a proveedores usando pedidos de compra. Otros servicios como electricidad o alquiler se compran con una Factura A/P directa, sin documentos previos. Las transacciones recurrentes facilitan la generación de Facturas A/P para acuerdos de servicio con pagos periódicos. A veces compras servicios como diseño web o jardinería a proveedores; en esos casos se trabaja previamente con el proveedor para acordar el tipo de trabajo y el precio. En estos casos tiene sentido usar un pedido de compra para confirmar el acuerdo. Otros servicios como electricidad o alquiler se adquieren sin pedidos de compra: cuando se recibe la factura del proveedor, se introduce directamente en una Factura A/P.

---

## Diapositiva 4

Descripción General del Proceso de Compra de Servicios. Pedido de Compra → Recepción del Servicio → Factura A/P → Pago Saliente. Cuando compras servicios como jardinería, formación u otras compras no físicas, puedes utilizar pedidos de compra y Facturas A/P. Al comprar servicios, puedes comenzar con un pedido de compra que describa el servicio a adquirir, el precio acordado y la cuenta G/L asociada. El pedido de compra es opcional. Su ventaja es que proporciona un documento en el que fijar las condiciones y el precio del servicio. Normalmente se discute el alcance del proyecto y el precio esperado con el proveedor, y en ese momento se crea el pedido con los detalles del acuerdo. Al recibir el pedido, el proveedor confirma el acuerdo y se fijan las fechas para prestar el servicio. La Entrada de Mercancías OC generalmente no se usa para la compra de servicios; este paso suele realizarse fuera del sistema. Tras recibir el servicio y la factura del proveedor, se introduce la Factura A/P en el sistema. Finalmente, se crea un pago saliente para pagar al proveedor.

---

## Diapositiva 5

Tipo de Artículo/Servicio. En compras (y ventas), puedes configurar tus documentos como tipo Artículo o tipo Servicio. Un documento de ventas o compras puede incluir artículos predefinidos de los datos maestros o descripciones de servicios introducidas directamente en las filas, pero no ambos. Al crear un documento, estableces el Tipo Artículo/Servicio como Servicio o Artículo. Esta configuración aplica a todo el documento y no puede cambiarse una vez guardado. La vista de tabla en la pestaña Contenido es diferente para cada opción. ¿Cuándo seleccionar el tipo Servicio? Solo cuando compras o vendes un servicio que no tiene registro maestro. ¿Cuándo seleccionar el tipo Artículo? Cuando adquieres artículos físicos y/o servicios configurados como datos maestros de artículo.

---

## Diapositiva 6

Artículos de Servicio. Los artículos de servicio pueden ser muy útiles si compras un servicio con frecuencia y el precio está preestablecido con el proveedor. Una ventaja de usar artículos de servicio es que pueden añadirse a documentos comerciales de tipo Artículo, como pedidos de compra, lo que permite combinar artículos y servicios en el mismo documento. Al añadir el artículo maestro a un documento, especificas la cantidad usada, lo que facilita un mejor seguimiento de los servicios en los informes estándar. También puedes usar los análisis habituales de ventas y compras para los servicios. Tener datos maestros de artículo para los servicios reduce además la posibilidad de errores en la introducción de datos. Al crear un artículo de servicio, establece la categoría del artículo como artículo no inventariable. Para artículos de servicio de compra, marca la casilla de artículos comprados. Los artículos de servicio también pueden usarse en ventas.

---

## Diapositiva 7

Crear una Factura de Servicio. Para servicios como electricidad o alquiler, generalmente no hay pedido de compra en el proceso. Imagina que acaba de llegarte una factura de alquiler de tu arrendador. La factura del proveedor contiene: nombre del proveedor, número de factura, fecha de emisión, descripción del servicio adquirido e importe adeudado.

---

## Diapositiva 8

Crear una Factura de Servicio (cont.). Crea una Factura A/P en SAP Business One e introduce el código de proveedor.

---

## Diapositiva 9

Crear una Factura de Servicio (cont.). Esto incorpora los datos predeterminados del registro maestro del proveedor, como nombre, dirección, condiciones de pago, método de pago y más.

---

## Diapositiva 10

Crear una Factura de Servicio (cont.). Introduces el número de factura del proveedor y la fecha de la factura. Verificas que la configuración correcta de Tipo Artículo/Servicio esté seleccionada para poder introducir la descripción del servicio y la cuenta G/L correspondiente. Y por supuesto, introduces el importe adeudado en el campo Total en la Factura A/P.

---

## Diapositiva 11

Crear una Factura de Servicio (cont.). Al guardar la factura, SAP Business One realiza una verificación de número de factura duplicado para el proveedor. El sistema te alerta si el número de factura del proveedor ya existe, para que puedas investigar. Esta función ayuda a evitar pagos duplicados.

---

## Diapositiva 12

Crear una Factura de Servicio (cont.). Cuando el sistema guarda la factura, el valor actualiza simultáneamente el importe adeudado al proveedor, la cuenta de gastos relacionada y la cuenta de control del libro mayor.

---

## Diapositiva 13

Transacciones Recurrentes. A veces los servicios como alquiler o mantenimiento se suministran de forma regular con una tarifa periódica estándar. En estos casos puedes usar transacciones recurrentes. Esta funcionalidad permite generar automáticamente documentos de compras, ventas o inventario de forma periódica. Solo tienes que configurar una plantilla donde seleccionas la frecuencia, el rango de fechas y el tipo de documento para la transacción recurrente. Las transacciones recurrentes también están disponibles para documentos de inventario, así como para documentos comerciales de compras y ventas. En nuestro ejemplo de negocio, hemos acordado con un proveedor el arrendamiento de un espacio comercial por un año. Configuramos la plantilla para generar una Factura A/P para el pago del arrendamiento cada mes. Al ejecutar la plantilla, se crean los documentos para el período. Al final del período, se habrán generado un total de 12 facturas.

---

## Diapositiva 14

Resumen. Puntos clave: Para la compra de servicios, la Factura A/P es el único documento obligatorio en compras. Tienes la opción de usar un pedido de compra para especificar los servicios requeridos al proveedor. Configurar datos maestros de artículo para un servicio puede ser útil para servicios que compras o vendes regularmente. Los artículos de servicio se introducen en documentos comerciales de tipo Artículo. Usar datos maestros de artículo permite hacer seguimiento de cantidades en los análisis habituales de compras y ventas, y eliminar errores de introducción de datos. Una plantilla de transacción recurrente puede ser útil para generar documentos de compras de forma periódica.

---

## Diapositiva 15

Aviso legal SAP — sin cambios respecto al documento original.

---
