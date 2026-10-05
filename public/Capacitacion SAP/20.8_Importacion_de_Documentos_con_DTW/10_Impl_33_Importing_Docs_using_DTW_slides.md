# Transcripción por Diapositiva: 10_Impl_33_Importing_Docs_using_DTW

## Diapositiva 1

Herramientas de Implementación: Importar Documentos con DTW — SAP Business One Versión 10.0. Bienvenido al curso sobre la importación de documentos con el Workbench de Transferencia de Datos (DTW). Este curso es útil para cualquier persona que utilice DTW por primera vez.

---

## Diapositiva 2

Objetivos. Al finalizar este curso, podrás: Explicar cómo importar documentos y referenciar otros documentos como base. Describir la relación entre el encabezado de un documento y sus filas de detalle, y cómo se representa en DTW mediante las plantillas Documents y Document_Lines. Indicar el efecto potencial de importar un documento sobre el inventario y el libro mayor.

---

## Diapositiva 3

Importar Documentos.

---

## Diapositiva 4

Estructura de Plantillas para Documentos. La mayoría de los documentos de marketing (y algunos documentos de inventario y producción) se basan en el mismo objeto de negocio de la API DI: el objeto Documents para el encabezado del documento y el objeto secundario Document_Lines para las filas del documento. En DTW, las plantillas predefinidas siguen el mismo formato: plantilla Documents para el encabezado, plantilla Document_Lines para las filas, y otras plantillas secundarias para importar filas de texto y subtotales, gastos adicionales (flete, seguro, etc.), impuestos e información de números de serie/lotes del documento.

---

## Diapositiva 5

Numeración de Documentos. Puedes importar un documento con su número de documento heredado o usar la numeración automática de documentos de SAP Business One. Si el campo HandWritten está en blanco o es tNO, SAP Business One asignará números de documento de la serie de numeración actual. Para conservar los números de documento heredados, introduce el número real en la columna DocNum y el valor 'tYES' en el campo HandWritten. Los documentos con numeración manual se consideran impresos al importarse.

---

## Diapositiva 6

Serie de Documentos. La serie de numeración es un entero asignado por el sistema cuando se crea una nueva serie. Puedes especificar opcionalmente una serie de numeración en la plantilla (columna Series). Para ver este número, ejecuta una consulta en la tabla NNM1 y usa el valor Series correspondiente al nombre de la serie.

---

## Diapositiva 7

Plantillas Principal y Secundaria. Cada fila en la plantilla principal representa un documento. Cada documento puede tener una o más filas en la plantilla secundaria. Las filas en la plantilla Document_Lines se vinculan a su respectiva fila en la plantilla principal mediante el valor de la columna A (la clave primaria). Por ejemplo, si el valor DocNum en la plantilla Documents es 1, cada fila que pertenece al documento tendrá el valor ParentKey 1.

---

## Diapositiva 8

Efectos de Importar Documentos de Marketing. Al importar documentos de marketing con DTW, se realizan contabilizaciones dependiendo del tipo de documento en el inventario y en diversas cuentas del libro mayor. Estas contabilizaciones son idénticas a las de los documentos creados manualmente. Ejemplos: un pedido de ventas importado comprometerá (sin retirar) el stock del inventario; una entrega importada afectará a la cantidad en stock y realizará contabilizaciones en las cuentas relacionadas con el inventario; una factura A/R importada contabilizará en la cuenta del socio comercial, así como en las cuentas de ingresos e impuestos. Las ofertas de ventas y compras abiertas no afectan a la contabilidad ni a los niveles de inventario.

---

## Diapositiva 9

Consideraciones sobre Saldos Iniciales. DTW puede ser una opción para importar saldos iniciales de un sistema heredado: costes y cantidades de artículos usando documentos de Entrada de Mercancías, y saldos de cuentas de socios comerciales usando facturas A/R y A/P. Debe tenerse cuidado para evitar la "doble contabilización" del inventario o de los saldos de socios comerciales. Puedes importar las facturas A/R o A/P como documentos de tipo servicio para evitar la contabilización en las cuentas de cantidad o valor de inventario.

---

## Diapositiva 10

Ejemplo: Facturas de Tipo Servicio. Las plantillas DTW para facturas A/R y A/P se encuentran en las carpetas de plantillas de Ventas o Compras. Para indicar un documento de tipo servicio en la plantilla DTW, introduce dDocument_Service en la columna DocType. Para conservar los números de documento heredados, introduce el número real en la columna DocNum y establece el valor de la columna HandWritten en 'tYES'. En la plantilla de filas (secundaria), puedes introducir información para describir la factura de artículo original en la columna ItemDescription. Conserva las fechas originales de la factura heredada para mantener el vencimiento correcto. La factura de servicio importada actualizará el saldo del socio comercial y las cuentas de control A/R o A/P.

---

## Diapositiva 11

Importar Documentos Relacionados. Para mantener los vínculos entre documentos relacionados en una transacción, puedes introducir información del documento base al importar un documento.

---

## Diapositiva 12

Importar Transacciones Relacionadas. Pedido de Ventas → Entrega → Factura A/R → Cobro. Pedido OC → Entrada de Mercancías OC → Factura A/P → Pago. Cuando los documentos se crean manualmente en SAP Business One, se vinculan mediante la función Copiar a/desde. Puedes replicar el copiar a/desde en DTW introduciendo la información del documento base al importar el documento relacionado. Nota: Como alternativa para documentos de ventas, puedes usar el Asistente de Generación de Documentos. Sin embargo, si hay cambios significativos en las filas de artículos o fechas, debes importar las transacciones relacionadas con DTW.

---

## Diapositiva 13

Vínculos de Documentos Base y Destino. Al importar un documento basado en otro documento, debes proporcionar el número de documento base, el tipo y la fila en la plantilla DTW. El nuevo documento cerrará el documento base. Se usan tres columnas: número de documento base, tipo de documento base (identificado con un valor entero único) y fila del documento base (comienza en 0 para la fila 1). Ejemplo: Pedido de Ventas 281 → Entrega 300 (base: tipo Pedido de Ventas, número 281, filas 0 y 1) → Factura A/R 350 (base: tipo Entrega, número 300, filas 0 y 1).

---

## Diapositiva 14

Especificar Referencias del Documento Base en la Plantilla. Las referencias al documento base se especifican en la plantilla secundaria en cada fila usando los campos: BaseType (tipo de documento), BaseEntry (número interno del documento base) y BaseLine (fila del documento base). El BaseType es el tipo de documento (por ejemplo, 17 indica un pedido de ventas). El BaseEntry es el número interno del documento base (campo DocEntry), no el número de documento (DocNum). El BaseLine es la instancia de fila en el documento base, comenzando en 0 para la fila 1. Nota: No es necesario introducir todos los detalles de fila para una transacción relacionada; la información se copiará automáticamente del documento base. Los gastos adicionales, como flete y seguro, no se copian y deben importarse para cada documento.

---

## Diapositiva 15

Tipos de Documento Base. Los tipos de documento base están documentados en la Referencia de Objetos de la API DI: 23=Oferta de Ventas, 17=Pedido de Ventas, 15=Entrega, 13=Factura A/R, 16=Devolución, 22=Pedido OC, 20=Entrada de Mercancías OC, 18=Factura A/P, 14=Nota de Crédito A/R, 19=Nota de Crédito A/P, 21=Devolución de Mercancías.

---

## Diapositiva 16

Resumen. Puntos clave de este curso: Puedes importar documentos de marketing con DTW utilizando la numeración de documentos heredada o la numeración automática de SAP Business One. La mayoría de los documentos de marketing se basan en el mismo objeto de negocio de la API DI. DTW usa esta estructura con las plantillas de documentos: objeto Documents para el encabezado y objeto secundario Document_Lines para las filas. Puedes importar documentos vinculados a documentos base especificando el tipo, número interno y fila base en la plantilla secundaria. Al importar documentos de marketing, se realizan contabilizaciones en el libro mayor idénticas a las de los documentos creados manualmente. DTW puede ser una opción para importar saldos iniciales: cantidades y costes de artículos con la plantilla de Entrada de Mercancías, y saldos de socios comerciales con las plantillas de facturas A/R y A/P; asegúrate de que los documentos importados no se contabilicen doblemente.

---

## Diapositiva 17

Aviso legal SAP — sin cambios respecto al documento original.

---
