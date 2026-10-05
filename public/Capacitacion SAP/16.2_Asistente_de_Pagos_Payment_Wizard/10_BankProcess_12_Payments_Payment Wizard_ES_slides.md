# Transcripción por Diapositiva: 10_BankProcess_12_Payments_Payment Wizard_ES

## Diapositiva 1

PUBLIC Proceso de gestión de bancos: El asistente de pagos SAP Business One Versión 10.0 Bienvenido al tema del asistente de pagos. 1

---

## Diapositiva 2

Al finalizar este tema, podrá:  Ejecute el asistente de pagos para generar pagos en un lote  Explicar distintos escenarios al ejecutar el asistente de pago. 2 PUBLIC Al finalizar este tema, podrá:  Ejecutar el asistente de pagos para generar pagos en un lote  Explicar distintos escenarios al ejecutar el asistente de pago. Objetivos

---

## Diapositiva 3

3 PUBLIC Escenario empresarial  María, la responsable de contabilidad de OEC Computers, desea hacer que el proceso de creación de los pagos de los clientes y los proveedores sea más eficaz. María desea crear pagos mensuales en un lote.  Le presenta a María el Asistente de pagos y le muestra las opciones necesarias para ejecutar la herramienta.  María, la responsable de contabilidad de OEC Computers, desea hacer que el proceso de creación de los pagos de los clientes y los proveedores sea más eficaz. María desea crear pagos mensuales en un lote.  Le presenta a María el Asistente de pagos y le muestra las opciones necesarias para ejecutar la herramienta. 3

---

## Diapositiva 4

El Asistente de pago permite crear cobros y pagos en lotes para transferencias bancarias, cheques y efectos. Los pagos se crean en función de los criterios de selección y las vías de pago. El asistente de pago crea:  Cobros por transferencias bancarias y  Pagos por cheques y transferencias bancarias Las ejecuciones del asistente de pago comprenden transacciones y documentos de clientes y proveedores que no están pagados por completo, abonados ni reconciliados. Las ejecuciones también cubren los pagos a cuenta que no están imputados ni reconciliados en transacciones específicas. Si los pagos creados son pagos por transferencia bancaria o pagos por débito bancario, el asistente de pago crea los ficheros de pago en el formato específico del país adecuado. También hay una opción para emitir una Ejecución de orden de pago que crea un archivo bancario, no crea ningún asiento y deja las facturas abiertas. Las facturas se cerrarán después de obtener la confirmación del banco. Esta función recibe soporte de 2 informes:  Informe de Órdenes de pago por interlocutor comercial, y  Informe de Órdenes de pago por Ejecución de pago 4 PUBLIC Resumen del asistente de pago Cobros:  Transferencia bancaria Cuenta bancaria Asistente de pago Pagos: Cheques Transferencia bancaria

---

## Diapositiva 5

En el asistente de pagos, los pagos se crean en función de los criterios de selección y las vías de pago. Este gráfico muestra los pasos en el asistente de pagos. Primero, cada ejecución del asistente de pago se identifica mediante un nombre y la fecha de ejecución del pago. A continuación, debe especificar varios criterios de selección como se indica:  Parámetros generales, como la fecha de la siguiente ejecución de pago planificada, la clase (pago o cobro), el medio de pago (cheque o transferencia bancaria) y la serie de documentos utilizados para crear los documentos de pago.  Los interlocutores comerciales que verifica el sistema para localizar facturas vencidas. Se incluye el criterio de selección expandido.  Criterios de selección para los documentos que incluye el sistema, como rango de fechas.  Por último, los métodos de pago que se utilizarán en la ejecución de pago. En función de estos criterios de selección, el sistema crea un informe de recomendaciones o una lista de pagos sugeridos:  Puede aceptar o rechazar estas recomendaciones.  Mediante el pulsador Añadir fila manual, puede crear un documento de pago o una fila de orden de pago entre una cuenta de banco propio y un interlocutor comercial o una cuenta de destino sin hacer referencia a ningún documento de SAP Business One.  El pulsador Transacciones no incluidas crea una lista de todas las partidas abiertas que no se han podido incluir en la ejecución del pago. 5 PUBLIC Recomendaciones Asistente de pagos: Criterios de selección Criterios de selección Parámetros de documento Criterios selección Interl. comercial Parámetros generales Sel. ejecución de pago Mét. pago: Criterios de selección

---

## Diapositiva 6

6 PUBLIC Asistente de pagos: Paso Opciones de grabado Ejecutar ejecución de orden de pago Ejecutar ejecución de pago/ Grabar Cargar Ejecuciones de pago grabadas Recomendaciones Criterios de selección Parámetros de documento Criterios selección interl. comercial Parámetros generales Sel. ejecución de pago Mét. pago: Criterios de selección En el paso Opciones de grabación, puede:  Grabar los criterios de selección sin el informe de recomendación. Esta opción no reserva las transacciones pendientes seleccionadas para esta ejecución de pago. De todos modos, puede compensar las transacciones mediante los documentos de cobros o pagos o mediante una nueva ejecución de pago.  La segunda opción es grabar las recomendaciones y continuar en una fecha posterior. Así se reservan las transacciones abiertas seleccionadas únicamente para esta ejecución de pago, o sea que las transacciones abiertas grabadas en esta opción no se pueden compensar mediante los documentos de pagos recibidos o efectuados ni en una nueva ejecución de pago. Para borrar una ejecución de pago recomendada, en el primer paso del asistente de pago, seleccione la ejecución de pago, haga doble clic y seleccione Cancelar.  También hay una opción para emitir una Ejecución de orden de pago que crea un archivo bancario, no crea ningún asiento y deja las facturas abiertas. Las facturas se cerrarán después de obtener la confirmación del banco. Al recibir la confirmación del banco, puede cargar la ejecución de pago grabada, ejecutar los pagos y cerrar las facturas.  La cuarta opción, Ejecutar ejecución de pago, simplemente ejecuta los pagos.  Y la última opción: Ejecutar ejecución de pago en el servidor, permite al usuario establecer una hora planificada (con retraso) para la ejecución.

---

## Diapositiva 7

Cuando ejecuta los pagos, el sistema crea automáticamente los documentos de pago para las recomendaciones aceptadas. Un pago generalmente consolida facturas para un interlocutor comercial, a menos que se lo especifique de otro modo en el maestro de interlocutores comerciales. Por ejemplo, puede elegir pago único para crear un pago para cada factura de ese interlocutor comercial. Si los pagos creados son pagos por transferencia bancaria o pagos por débito bancario, el asistente de pago puede crear el fichero de pago en el formato específico del país para que se envíe al banco de la empresa. Para crear o adaptar formatos, utilice el Administrador de ficheros electrónico (EFM). Este add-on de SAP Business One es una herramienta gráfica que permite al usuario definir y modificar los formatos de fichero bancario. Si los pagos creados son pagos con cheque, pueden imprimirse directamente desde el sistema. Una vez impresos los cheques, el sistema asigna los números de cheque. Una vez finalizado el proceso, utilice la opción Confirmación de número de cheque en el módulo Gestión de bancos para confirmar los números asignados. 7 PUBLIC Asistente de pagos: Creación de pagos Transferencia bancaria Impresión de cheques Fichero de pago  Impresión de informes  Impresión de documentos Documentos de pago Criterios de selección Recomendaciones Cheques

---

## Diapositiva 8

Es muy importante definir vías de pago cuando se realiza la configuración de la gestión de bancos en el módulo Gestión. Estos datos se utilizan por defecto en todas las ejecuciones de pago. Con la vía de pago, se puede controlar todo el proceso de pago. En la definición de una vía de pago, se debe definir lo siguiente:  En primer lugar, la clase de pago y el medio de pago: en el caso de los pagos efectuados: cheque o transferencia bancaria, en el caso de los pagos recibidos: solo transferencia bancaria.  En segundo lugar, el banco propio y la cuenta bancaria que, por lo general, deben recibir o emitir el pago realizado con este método de pago. Si la empresa trabaja con un banco propio adicional, defina una vía de pago para cada banco o sucursal.  En tercer lugar, las verificaciones de validación que el sistema deberá realizar antes de utilizar este método de pago, así como restricciones de importes.  Y, por último, las contabilizaciones en relación con las cuentas de mayor provisionales.  Nota: Puede definir una vía de pago como inactiva desmarcando la casilla Activo. Esta vía no se incluirá en la ejecución de pago. 8 PUBLIC Vías de pago como instrumento principal de control Opciones de validación Efectuado Recibido Tipo Medio de pago Banco propio Definición  Verificar  Transferencia bancaria

---

## Diapositiva 9

9 PUBLIC Vías de pago como instrumento principal de control Vía de pago Interlocutor comercial Factura de proveedores  Todas las vías de entrada y salida de pagos definidas en SAP Business One aparecen en los registros maestros de los interlocutores comerciales, en la ficha Ejecución de pago.  Para especificar qué métodos de pago desea usar con cada interlocutor comercial, seleccione la casilla Incluir para el método de pago preferido.  Observe que puede necesitar desplazarse hacia la derecha para visualizar la columna Incluir.  Puede fijar una vía de pago por defecto que se asignará automáticamente a los nuevos interlocutores comerciales en la ficha IC en Parametrizaciones generales.  En el registro maestro, también puede fijar una vía como vía de pago por defecto que se utilizará en todos los documentos para este interlocutor comercial.  En función de las parametrizaciones de la ejecución de pago, el sistema selecciona automáticamente una de las vías de pago que aparecen en los registros maestros de los interlocutores comerciales. Si desea utilizar una vía de pago concreta para una determinada factura, también puede indicar directamente la vía de pago en la propia factura.  Nota: Para usar el asistente de pago, asegúrese de haber fijado los bancos y las cuentas de banco propio: Puede definir los bancos con los que trabaja su empresa en el área de configuración de la gestión de bancos en el módulo Gestión. Puede definir más de una sucursal o cuenta como banco propio en SAP Business One. Para ello, utilice la ventana Cuentas de banco propio en el área de configuración de la gestión de bancos en el módulo Gestión. En los datos maestros de interlocutor comercial de proveedor, en la ficha Condiciones de pago, defina los datos bancarios del interlocutor comercial. Esta información se utilizará para los pagos creados por el asistente de pago.

---

## Diapositiva 10

A continuación, se detallan algunos puntos clave para tener en cuenta: • El Asistente de pago crea pagos en lotes para pagos de transferencias bancarias recibidas, y cheques emitidos y pagos por transferencia bancaria. • En el Asistente de pago también hay una opción para emitir una Ejecución de orden de pago que crea un fichero bancario, no crea ningún asiento y deja las facturas abiertas. • Con el método de pago se puede controlar el proceso del asistente de pagos. • En los registros maestros de cada interlocutor comercial, debe especificar qué vías de pago desea utilizar para el interlocutor comercial y una vía de pago por defecto que se utilizará en todos los documentos para este interlocutor comercial. 10 PUBLIC Resumen El Asistente de pagos crea pagos en lotes para: • Cobros de transferencias bancarias y • pagos de transferencias bancarias y cheques efectuados. En el asistente de pago también existe una opción para emitir una Ejecución de orden de pago que: • Crea un archivo bancario, • no crea ningún asiento • y deja las facturas abiertas. Con la vía de pago, puede: • controlar el proceso del asistente de pago. En el registro maestro de cada interlocutor comercial, especifica: • que vías de pago desea usar para el interlocutor comercial. • Una vía como vía de pago por defecto que se utilizará en todos los documentos para este interlocutor comercial. A continuación, se detallan algunos puntos clave:

---

