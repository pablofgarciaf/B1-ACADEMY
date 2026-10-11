# Transcripción por Diapositiva: 10_Impl_25_ImplTools_OpeningBalances

## Diapositiva 1

Herramientas de Implementación: Saldos de Apertura — SAP Business One Versión 10.0. En este curso aprenderás a introducir los saldos de apertura para una nueva implementación de cliente.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Describir el proceso de migración de saldos heredados de socios de negocio, inventario y cuentas G/L a un nuevo sistema SAP Business One antes de la puesta en marcha. Explicar las mejores prácticas y herramientas para la introducción de saldos de apertura desde el sistema heredado.

---

## Diapositiva 3

Escenario de Negocio. Justo antes de la puesta en marcha, dispones de un período breve en el que debes introducir los saldos de las cuentas G/L del sistema heredado, incluidos los saldos de las cuentas de socios de negocio. También debes introducir las cantidades y los costos de los artículos. Al final de este proceso, los informes financieros del nuevo sistema SAP Business One deben coincidir con los informes del sistema heredado. El cliente pondrá en marcha el sistema en dos días. Una vez cerrado el sistema heredado, hay que equilibrar las cuentas del sistema heredado con los saldos de cuentas en SAP Business One. Para ello es necesario introducir los saldos de las cuentas G/L y de los socios de negocio, así como las cantidades y costos de los artículos, de modo que los informes financieros coincidan.

---

## Diapositiva 4

Período de Transición (Cutover) en el Ciclo de Implementación. El período inmediatamente anterior a la puesta en marcha se denomina cutover. Este período puede durar desde unas pocas horas hasta varios días (por ejemplo, un fin de semana). Durante el período de cutover, las actividades principales son: congelar el sistema heredado para que no se introduzcan nuevas transacciones; en el sistema heredado congelado, conciliar las cuentas de socios de negocio e intentar cerrar los documentos para minimizar la cantidad de transacciones abiertas; realizar un recuento de stock; introducir o migrar las transacciones abiertas y los saldos de apertura finales al nuevo sistema SAP Business One. En el momento de la puesta en marcha, la información financiera en SAP Business One debe coincidir con las cuentas del balance del sistema heredado. Aspectos a considerar: ¿El nuevo sistema SAP Business One funcionará en paralelo con el sistema heredado durante un tiempo? ¿Puede la puesta en marcha realizarse al inicio del ejercicio fiscal del cliente o tendrá lugar durante el ejercicio? ¿Pueden cerrarse las transacciones abiertas en el sistema heredado antes del cutover?

---

## Diapositiva 5

Migración de Datos durante el Cutover. Durante el cutover, se recomienda migrar las transacciones finales y los saldos de apertura en un determinado orden, para evitar apuntes duplicados.

---

## Diapositiva 6

Orden de Migración de Datos para los Saldos de Apertura. En general, debes seguir este orden para transferir los datos finales del sistema heredado: 1. Datos maestros finales (añadidos por el cliente tras la migración inicial). 2. Cantidades y costos de artículos (para que coincidan con los valores del sistema heredado en el momento del cutover). 3. Transacciones abiertas del sistema heredado: pedidos de venta y compra, facturas, pagos parciales y órdenes de producción. 4. Saldos de cuenta finales de socios de negocio y cuentas G/L, incluidas las cuentas de caja y banco. Junto con esta formación, consulta la Guía de Migración de Datos de la metodología AIP para una guía paso a paso detallada de los saldos de apertura.

---

## Diapositiva 7

Migración Final de Datos Maestros. Los datos maestros suelen migrarse en la fase de Realización del Proyecto de la implementación; sin embargo, puede ser necesario migrar nuevos datos maestros creados en el sistema heredado después de que finalice la migración principal. Los datos maestros finales pueden incluir no solo registros de socios de negocio y artículos de última hora, sino también listas de materiales, recursos de producción, listas de precios, números de catálogo, registros de empleados e información de servicio como contratos, plantillas, fichas de equipo de clientes y una base de conocimiento de soluciones. Se debe animar al cliente a limpiar los datos del sistema heredado antes de migrarlos al nuevo sistema. Esto puede incluir: eliminar datos maestros duplicados, eliminar socios de negocio o productos antiguos e inactivos, consolidar listas de precios o introducir nuevas y usar un nuevo esquema de numeración para los códigos de clientes y proveedores, números de producto o números del plan de cuentas.

---

## Diapositiva 8

Cantidades y Costos de Artículos. Las cantidades y los costos de los artículos deben introducirse en SAP Business One para reflejar el sistema heredado. El cliente debe congelar las operaciones en el sistema heredado y realizar primero un recuento de stock para que las cantidades sean precisas. La migración de cantidades debe planificarse cuidadosamente, ya que puede haber transacciones abiertas en el sistema heredado que afecten a los niveles de inventario una vez transferidas al nuevo sistema (por ejemplo, entregas abiertas que liberarían inventario). El costo del artículo se usa para calcular la valoración del inventario. Si el sistema usa inventario perpetuo, la cuenta G/L de inventario se actualizará cuando se migren las cantidades de artículos.

---

## Diapositiva 9

Transacciones Abiertas. Las transacciones abiertas son las que están en proceso en el sistema heredado. Deben clasificarse en: Documentos que no afectan a la contabilidad ni al inventario (presupuestos de ventas, pedidos de venta no vinculados a entregas, presupuestos de compra, pedidos de compra no vinculados a entradas de mercancías, y órdenes de producción). Se importan fácilmente con DTW. Documentos que no afectan al inventario pero sí a los saldos contables: facturas A/R y A/P, y pagos. Deben importarse con precaución, ya que las facturas pueden afectar al inventario si no hay una entrega o entrada de mercancías importada previamente. *Precaución: SAP recomienda importar estas facturas A/R y A/P como facturas de tipo servicio para evitar actualizaciones de inventario. Documentos que sí afectan al inventario: entregas, devoluciones y notas de crédito. **Precaución: SAP recomienda no migrar estas transacciones, ya que pueden provocar un desequilibrio entre las cantidades de stock y la valoración. En su lugar, el cliente debe intentar facturar o cerrar estos documentos en el sistema heredado. Si no es posible, el cliente debe conservar estos documentos y procesarlos en el sistema heredado hasta que se cierren. Antes de importar los datos transaccionales, debes aclarar con el cliente si los documentos heredados deben introducirse con el número original. Si el cliente necesita los números originales del sistema heredado, usa números de documento manuales al importarlos.

---

## Diapositiva 10

Saldos de Apertura Finales. Por último, introduce los saldos de apertura finales de los socios de negocio y las cuentas G/L, incluidas las cuentas bancarias. Importante: Si se importaron las cantidades y costos de artículos en el paso 2 y se usa inventario perpetuo, la cuenta G/L de inventario ya es correcta y debe excluirse para evitar actualizaciones duplicadas. Si se importaron todos los documentos A/R y A/P abiertos en el paso 3, junto con todos los pagos parciales, anticipos o pagos a cuenta no basados en facturas, los saldos finales de los socios de negocio ya deberían ser correctos. En este caso, no introduzcas los saldos de las cuentas de control A/R y A/P para evitar actualizaciones duplicadas. Antes de transferir los saldos de las cuentas bancarias, el cliente debe intentar conciliar las transacciones de dichas cuentas. Si la cuenta puede conciliarse totalmente, transfiere el saldo. Si hay transacciones sin conciliar, debes publicarlas individualmente en SAP Business One.

---

## Diapositiva 11

Herramientas para Importar los Saldos de Apertura. No existe un único enfoque para importar saldos de apertura. Hay varias herramientas disponibles en SAP Business One: La transacción de saldo de apertura es una herramienta fácil de usar integrada en el cliente y puede utilizarse para introducir cantidades y valoración del inventario, saldos de cuentas G/L y saldos de cuentas de socios de negocio. La Herramienta de Transferencia de Datos (DTW) permite importar documentos en bloque como entradas de mercancías, asientos contables, transacciones abiertas (pedidos de venta y compra) y transacciones que afectan a la contabilidad (facturas A/R y A/P). Una ventaja es que dispones de un documento en SAP Business One como origen. DTW requiere conocimiento de la estructura de tablas de la base de datos. La utilidad Importar desde Excel es una herramienta integrada para importar datos maestros desde una hoja de cálculo de Microsoft Excel. *También puede usarse para rellenar la ventana de la transacción de saldos de apertura para inventario, cuentas G/L y cuentas de socios de negocio. Por último, si los volúmenes de datos son bajos, puedes introducir los documentos manualmente. Nota: este curso se centra en las transacciones de saldos de apertura. Para más información sobre DTW, consulta el curso relacionado Uso del DTW. Para más información sobre Importar desde Excel, consulta el curso relacionado Importar desde Excel.

---

## Diapositiva 12

Efectos de los Documentos Comerciales. Cuando importas o creas documentos de marketing como pedidos de venta y compra, y facturas A/R y A/P, debes tener en cuenta el impacto en el inventario y en las cuentas del libro mayor: Un pedido de venta importado compromete stock del inventario. Una entrega importada para el pedido afecta a la cantidad en stock y genera apuntes en las cuentas relacionadas con el inventario en el libro mayor. Una Factura A/R importada para la entrega registra en la cuenta del socio de negocio, así como en las cuentas de ingresos e impuestos. Si solo importas la Factura A/R sin documentos previos, la factura realizará los apuntes y cambios de stock que habrían realizado los documentos previos. Si estás cargando las transacciones como parte de los saldos de apertura de una nueva empresa, debes asegurarte de que los documentos importados no se "cuenten dos veces" en el inventario. Si decides importar las facturas A/R como facturas de tipo servicio en lugar de tipo artículo, evitarás los apuntes de stock, pero seguirá habiendo apuntes en las cuentas del socio de negocio y de ingresos.

---

## Diapositiva 13

Informes de Conciliación. Independientemente de cómo realices la migración de artículos, cuentas G/L y saldos de socios de negocio, debes conciliar las cuentas entre SAP Business One y el sistema heredado. Imprime y conserva una copia impresa de todos los informes de conciliación de SAP Business One y del sistema heredado para demostrar la corrección de la migración: Para conciliar cantidades y valores de inventario, ejecuta el Informe de Auditoría de Stock. Compara las cantidades de artículos en SAP Business One con las del sistema heredado. Para conciliar los saldos de los socios de negocio, ejecuta los informes de Antigüedad de Deudores y Antigüedad de Acreedores con un rango de fechas de registro hasta el inicio del ejercicio fiscal actual. Asegúrate de que los saldos de apertura de los socios de negocio en SAP Business One coincidan con el sistema heredado. Para conciliar los saldos de las cuentas G/L, ejecuta el Balance a fecha del primer día del ejercicio fiscal actual. Si migraste otros elementos abiertos como pedidos de venta y compra, ejecuta el Informe de Elementos Abiertos en SAP Business One y compáralo con los elementos abiertos correspondientes en el sistema heredado.

---

## Diapositiva 14

Saldos de Apertura del Inventario. En esta sección aprenderás las herramientas para importar cantidades y costos de artículos como saldos de apertura.

---

## Diapositiva 15

Transacción de Saldo de Apertura del Inventario. Inventario → Transacciones de Inventario → Saldo de Apertura del Inventario. La transacción permite introducir la cantidad en stock y el precio unitario de cada artículo desde una única pantalla, de dos maneras: seleccionando los artículos para rellenar las filas de la ventana e introduciendo la cantidad y el costo en cada fila, o eligiendo Importar Artículos para rellenar toda la cuadrícula desde una hoja de cálculo (usando la utilidad Importar desde Excel). El precio unitario puede representar el costo de fabricación o compra del artículo. Para una nueva implementación, este precio se toma del sistema heredado. El desplegable Origen del Precio permite seleccionar: Costo del Artículo (del dato maestro), Por Lista de Precios (si ya se ha configurado una lista de precios para el artículo) o Último Precio Evaluado (solo relevante si se generó previamente un informe de valoración de almacén en SAP Business One). Cuando publicas esta transacción, actualiza la cantidad en stock de cada artículo. Si trabajas con inventario perpetuo, también genera un asiento contable para registrar el valor del inventario.

---

## Diapositiva 16

Transacción de Saldo de Apertura del Inventario (cont.). Si el artículo está gestionado por número de serie o lote, puedes hacer clic derecho en la fila del artículo y seleccionar Serie o Lote en el menú contextual para introducir los números de serie o la información de lote correspondiente. Si seleccionas un almacén habilitado para ubicaciones de almacén, la columna Ubicación de Almacén se vuelve editable y permite introducir la ubicación del almacén donde se encuentra el artículo.

---

## Diapositiva 17

Consideraciones para el Inventario Perpetuo. Si en el sistema heredado se usa inventario perpetuo, debes considerar cada método de valoración para que la valoración coincida correctamente con el sistema heredado. Asegúrate también de no introducir de nuevo el saldo de la cuenta de inventario al introducir los saldos G/L. Ejemplo con 5 artículos comprados a 100 y otros 5 a 200: Con Costo Estándar: el costo del artículo es fijo; usa el costo del sistema heredado. Con Media Móvil: el costo del artículo se recalcula cada vez; calcula el costo unitario medio del sistema heredado. Con FIFO: introduce el costo del artículo varias veces con distintas cantidades usando el precio de costo de cada capa del sistema heredado. Nota: el método de valoración por número de serie/lote es similar al FIFO.

---

## Diapositiva 18

Asiento Contable. Si se usa inventario perpetuo, el asiento contable actualiza la cuenta de inventario predeterminada definida en la determinación de cuentas G/L y acredita una cuenta compensatoria que especificas en la columna de la derecha de la fila de la cuadrícula. SAP recomienda crear una cuenta G/L de saldos de apertura (generalmente en el cajón de capital propio) y usar esta cuenta compensatoria para garantizar que no haya efecto en otras cuentas del libro mayor. La cuenta compensatoria puede seleccionarse en cada fila de artículo.

---

## Diapositiva 19

Saldos de Apertura para Cuentas G/L. En esta sección aprenderás las herramientas y mejores prácticas para introducir los saldos de apertura finales de las cuentas G/L.

---

## Diapositiva 20

Introducción a los Saldos de Apertura de Cuentas G/L. Si la puesta en marcha se produce al inicio de un ejercicio fiscal, realiza el cierre de período en el sistema heredado y transfiere los saldos de las cuentas del balance. Si la puesta en marcha se produce durante el ejercicio fiscal, debes transferir también las cuentas de pérdidas y ganancias. El cliente debe ejecutar el informe de PyG para cada período desde el inicio del año financiero, lo que permite introducir los saldos de cada período en SAP Business One. Si ya importaste facturas A/R y A/P abiertas, no introduzcas saldos para estas cuentas de control. Si ya importaste costos de artículos, no vuelvas a introducir los saldos de la cuenta de inventario (para inventario perpetuo). Para más información, consulta la Guía de Migración de Datos en los materiales AIP.

---

## Diapositiva 21

Transacción de Saldo de Apertura de Cuentas G/L. Administración → Inicialización del Sistema → Saldos de Apertura → Saldo de Apertura de Cuentas G/L. La transacción de saldo de apertura de cuentas G/L en SAP Business One permite introducir el saldo de apertura de cada cuenta G/L en una fila desde una única pantalla. Puedes usar y seguir el balance de comprobación del sistema heredado. Al abrir la transacción, la ventana se rellena con las cuentas de los cajones seleccionados. Debes seleccionar primero una cuenta de saldo de apertura como cuenta compensatoria o de equilibrio para los asientos contables publicados; debe terminar con valor cero una vez introducidos todos los saldos G/L del sistema heredado. Aunque se publica un asiento contable separado para cada fila de cuenta, la fecha de registro es la misma. Puedes decidir si distribuir los saldos a lo largo de un ejercicio fiscal (por ejemplo, dividiendo por período contable y publicando con la fecha del final del mes). Puedes introducir varios saldos con distintas fechas para la misma cuenta. Al introducir saldos de apertura, debes introducir el signo menos para los saldos acreedores si está activada la opción Mostrar Saldo Acreedor con Signo Negativo en los Detalles de la Empresa. El botón Importar desde Excel permite rellenar el área de cuadrícula (filas) de esta transacción desde una hoja de cálculo.

---

## Diapositiva 22

Resultado — Transacción de Saldo de Apertura de Cuentas G/L. La transacción publica un asiento contable separado para cada fila de cuenta. El origen del asiento de saldo de apertura es "OB", lo que permite identificar fácilmente estos asientos en los informes.

---

## Diapositiva 23

Saldos de Apertura para Socios de Negocio. En esta sección aprenderás sobre las herramientas para introducir los saldos de apertura de socios de negocio.

---

## Diapositiva 24

Transacción de Saldo de Apertura de Socios de Negocio. Administración → Inicialización del Sistema → Saldos de Apertura → Saldo de Apertura de Socios de Negocio. La transacción de saldos de apertura de socios de negocio es una herramienta fácil de usar y una alternativa a la importación de facturas y pagos mediante DTW. Al abrir la transacción, la ventana se rellena con los socios de negocio seleccionados. Primero debes seleccionar una cuenta compensatoria de saldos de apertura. Si es posible, usa el informe de antigüedad del sistema heredado. Introduce el saldo de la cuenta heredada en una fila para cada socio de negocio, con la fecha de vencimiento correcta para el análisis de antigüedad. Para admitir el análisis de antigüedad en el nuevo sistema, especifica la fecha de vencimiento precisa para cada transacción. Nota: asegúrate de que los períodos contables en SAP Business One estén abiertos para que se puedan publicar con las fechas de vencimiento originales. La cuenta de control predeterminada de los datos maestros se selecciona en la fila, pero puedes seleccionar una cuenta de control diferente si es necesario. Si la cuenta del socio de negocio contiene varias transacciones con distintas fechas de vencimiento, puedes introducir cada transacción por separado ejecutando de nuevo la transacción de saldo de apertura. También debes introducir una fila para cualquier anticipo o pago a cuenta de socios de negocio. Si empiezas a mitad del año financiero y quieres ver los saldos iniciales desde el comienzo del año en SAP Business One, debes introducir los saldos de apertura de cada socio de negocio a fecha del último día del año anterior y luego introducir un saldo delta para cada socio de negocio en cada período contable sucesivo. Si la casilla Mostrar Saldo Acreedor con Signo Negativo está activada en los Detalles de la Empresa, introduce el signo menos para los saldos acreedores.

---

## Diapositiva 25

Resultado — Transacción de Saldo de Apertura de Socios de Negocio. Cuando se publican los saldos de apertura, se crea un asiento contable para cada fila y se actualiza la cuenta del socio de negocio. El código de origen del asiento es OB. El asiento contable puede seleccionarse posteriormente para la conciliación de pagos. Si la moneda del sistema difiere de la moneda local, los saldos se convierten automáticamente. Si las cuentas se definieron como cuentas en moneda extranjera en el plan de cuentas, el campo OB (ME) se habilita para su edición. El asiento también aparece en el informe de antigüedad con la fecha de vencimiento introducida en la fila.

---

## Diapositiva 26

Resumen. Puntos clave: El objetivo de introducir saldos de apertura es que el balance y el informe de pérdidas y ganancias del sistema heredado coincidan con los del nuevo sistema SAP Business One. SAP recomienda migrar los saldos de apertura finales en el siguiente orden: datos maestros finales; cantidades y costos de artículos (tras el recuento de stock); transacciones abiertas (pedidos, facturas, pagos, órdenes de producción, etc.); saldos finales de socios de negocio, artículos y cuentas G/L (incluyendo transacciones bancarias). Durante el cutover, el sistema heredado se congela y se realiza el recuento de stock. Las transacciones abiertas deben cerrarse si es posible. Las cuentas de socios de negocio y bancarias deben conciliarse. Para importar saldos de apertura puedes usar las transacciones de saldos de apertura para artículos, socios de negocio y cuentas G/L, con opción de importar filas desde una hoja de cálculo mediante la utilidad Importar desde Excel. Cada saldo genera un asiento contable con origen OB para facilitar su localización. Puedes usar el DTW para importar documentos abiertos como pedidos de venta y compra, facturas y pagos. El resultado es un documento en el nuevo sistema. Para más detalles sobre la introducción de saldos de apertura, consulta la Guía de Migración de Datos en los materiales AIP.

---

## Diapositiva 27

Aviso legal SAP — sin cambios respecto al documento original.

---
