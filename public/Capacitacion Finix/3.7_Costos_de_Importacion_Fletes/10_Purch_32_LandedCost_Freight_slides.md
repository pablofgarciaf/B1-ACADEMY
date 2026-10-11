# Transcripción por Diapositiva: 10_Purch_32_LandedCost_Freight

## Diapositiva 1

Compras: Gastos de Envío (Freight) — SAP Business One Versión 10.0. Bienvenido al tema sobre la gestión de gastos de envío en SAP Business One.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Describir cómo se gestionan los gastos de envío en los procesos de negocio. Configurar los gastos de envío. Agregar gastos de envío en documentos de ventas y compras.

---

## Diapositiva 3

Escenario de Negocio. Tu empresa compra y vende artículos por todo el país. Cuando los artículos se envían a tu almacén, se te cobran los gastos de envío y entrega. Quieres registrar estos cargos y que el costo unitario del inventario refleje el cargo adicional. Algunos artículos que vendes son de alto valor y requieren seguro durante el envío. Cobras a tus clientes una cantidad fija por el seguro, pero no quieres que el costo del seguro afecte al costo unitario.

---

## Diapositiva 4

Definición de Gastos de Envío. Los Gastos de Envío son un cargo que se paga por el transporte de mercancías por aire, tierra o mar. También se pueden usar para aplicar gastos adicionales que no forman parte del precio básico del artículo, como el seguro de las mercancías. Los gastos de envío pueden añadirse a cualquier documento de compras o ventas.

---

## Diapositiva 5

Gastos de Envío en los Procesos de Negocio. Gastos especiales artículo 1: 50. Gastos especiales artículo 2: 25. Envío general: 125. Seguro: 45. Total gastos de envío: 245. Los gastos de envío pueden añadirse al total del documento o a nivel de fila para artículos específicos. Puedes aplicar gastos de envío tanto en documentos de compras como de ventas. Por ejemplo, en una Factura A/P con gastos de envío: cada artículo tuvo un cargo de manipulación especial (añadido en las filas) además del cargo general de envío (añadido a nivel de cabecera del documento). El importe del documento y las filas se combinan para dar el total de gastos de envío del documento.

---

## Diapositiva 6

Efectos Contables y en el Inventario. Se pueden definir diferentes tipos de gastos de envío para contabilizar en diferentes cuentas. Por ejemplo: el seguro puede contabilizarse en una cuenta de gastos. Los costos de envío pueden configurarse para contabilizarse en la cuenta de stock del artículo, incorporando así el costo del envío al costo unitario del artículo. En nuestro ejemplo anterior, los cargos de envío se configuraron para contabilizarse en la cuenta de stock del artículo junto con el costo del artículo. Los cargos de seguro se configuraron para cargarse en una cuenta de gastos. Tanto el costo de los artículos (800) como los cargos de envío (200) se contabilizan en la cuenta de stock del artículo. El seguro se contabiliza en su cuenta de gastos.

---

## Diapositiva 7

Incorporar los Gastos de Envío al Costo del Artículo. Ejemplo: Costo de envío del documento: 100. Los costos de envío se aplican a los artículos según el peso de la fila. Fila 1 representa el 80% del peso total del envío → costo de 80 se contabiliza en la cuenta de stock del artículo. Fila 2 representa el 20% del peso total del envío → costo de 20 se contabiliza en la cuenta de stock del artículo. Puedes distribuir el total de gastos de envío a las filas e incorporar los costos al costo unitario del artículo. Cuando los gastos de envío se cobran a nivel de cabecera del documento, se necesita un método de distribución para asignar esos costos a los artículos individuales. El importe de gastos de envío añadido a cada fila se calcula según el método de distribución definido en la configuración de gastos de envío.

---

## Diapositiva 8

Copia de Gastos de Envío. Artículo: A1000, Cantidad: 10, Precio: 100, Tipo de envío: Seguro, Importe envío: 10. Al copiar a otro documento con cantidad 5, el importe de seguro se copia completo (10) la primera vez que se copia esa fila, incluso cuando se reduce la cantidad. Según la definición del tipo de gastos de envío, los gastos de envío a nivel de fila se copian en su totalidad en la primera referencia, parcialmente o nada en los documentos posteriores. Cuando existen gastos de envío en el nivel de fila y se usa el Asistente de Extracción de Documentos para copiar de un documento a otro, los gastos de envío a nivel de fila se copiarán al documento destino según la definición del tipo de gastos de envío.

---

## Diapositiva 9

Configuración de Gastos de Envío. Ahora veremos cómo configurar los gastos de envío en SAP Business One.

---

## Diapositiva 10

Activación en Configuración de Documentos. Administración → Inicialización del Sistema → Configuración de Documentos → pestaña General → marcar Gestionar Gastos de Envío en Documentos. No se puede revertir esta configuración después de registrar un documento. Para comenzar a usar gastos de envío, primero debe activarse en Configuración de Documentos. Esta configuración añadirá un campo de Gastos de Envío en todos los documentos de compras y ventas.

---

## Diapositiva 11

Configuración de Gastos de Envío. En la ventana de Configuración de Gastos de Envío, se debe crear una fila para cada tipo de gasto de envío que se desea rastrear. Campos principales: Nombre, Cuentas de Ingresos y Gastos, Grupos de Impuestos, Importe Fijo, Gross Freight (importe bruto), Sujeto a Retención, Método de Distribución, Método de Extracción, Casillas Stock y Último Precio de Compra. En nuestro escenario de negocio, se configurarán dos tipos de gastos: uno para envío (sin importe fijo, afecta al stock, método de distribución por peso) y otro para seguro (importe fijo, no afecta al stock, no afecta al precio de compra, sin método de distribución).

---

## Diapositiva 12

Métodos de Distribución de Gastos de Envío. Ejemplo: Importe de gastos en cabecera: 30. Artículo A1000: Cantidad 100, Total 200. Artículo A2000: Cantidad 200, Total 600. Métodos disponibles y resultado de distribución de los 30: Ninguno: 0 y 0. Cantidad: 10 y 20. Volumen: (según volúmenes). Peso: (según pesos). Igualmente: 15 y 15. Total de Fila: 6 y 24 (proporción al total de la fila). Los seis métodos de distribución determinan cómo se asignan los gastos de envío de la cabecera del documento a las filas individuales.

---

## Diapositiva 13

Métodos de Extracción de Gastos de Envío. Cuando se usa el Asistente de Extracción de Documentos para copiar de un documento a otro, el método de extracción determina cómo se copian los gastos de envío a nivel de fila al documento destino en caso de copia parcial. Opciones disponibles: Todo: copia el importe completo la primera vez que se copia cualquier cantidad parcial de la fila. Ninguno: no se copia nada al documento destino. Total: si se copia una fila solo parcialmente, el sistema copia el importe proporcional al total copiado. Cantidad: si solo se copia una fila parcialmente, el sistema copia el importe proporcional a la cantidad copiada.

---

## Diapositiva 14

Agregar Gastos de Envío en Documentos Comerciales. Ahora que hemos visto cómo funciona la configuración, repasemos el proceso de agregar gastos de envío en documentos comerciales.

---

## Diapositiva 15

Agregar Gastos de Envío en Documentos de Ventas — Filas. Gastos de envío a nivel de fila en documentos de ventas. En la fila del documento se pueden definir hasta 3 tipos de gastos de envío. Las columnas de gastos y su importe pueden añadirse usando Configuración de Formulario. Primero se elige el tipo de gasto mediante un desplegable y luego se introduce el importe para esa fila. Se puede añadir información adicional para cada cargo: regla de distribución, código de proyecto, código de impuesto e importe de impuesto. El total de gastos de envío introducidos en las filas se muestra en el campo Gastos de Envío, al pie del documento.

---

## Diapositiva 16

Agregar Gastos de Envío en Documentos de Ventas — Cabecera. Gastos de envío a nivel de cabecera en documentos de ventas: abrir los Cargos de Envío haciendo clic en la flecha de desglose junto al campo Gastos de Envío. En esta ventana aparecen todos los tipos de gastos de envío definidos durante la configuración. Si se introdujo un importe fijo para ingresos durante la configuración, se añadirá automáticamente a todos los documentos de ventas. Se puede eliminar el importe o añadir al importe existente en la columna Importe Neto. En un documento de ventas, el propósito de distribuir los importes de gastos de envío entre las filas es meramente informativo. El campo predeterminado de la columna Distribuir Gastos de Envío en las filas es No; si es importante ver el impacto en el nivel de fila, cámbialo a Sí.

---

## Diapositiva 17

Agregar Gastos de Envío en Documentos de Compras — Filas. Gastos de envío a nivel de fila en compras. En los documentos de compras existen dos columnas adicionales relacionadas con gastos de envío que no existen en los documentos de ventas: Último Precio de Compra e Inventario. Los valores (sí o no) se copian de la configuración de gastos de envío. Si se desea anular el valor predeterminado para una compra concreta, se pueden añadir estas columnas usando Configuración de Formulario y cambiar el valor predeterminado para cada fila.

---

## Diapositiva 18

Agregar Gastos de Envío en Documentos de Compras — Cabecera. Los gastos de envío en la cabecera de documentos de compras son similares a los de ventas. Si los gastos de envío no están configurados para afectar al stock o al último precio de compra (como en nuestro escenario para el seguro), los importes de gastos se registrarán como gastos.

---

## Diapositiva 19

Asiento Contable de Gastos de Envío. Factura A/R (basada en una Entrega): Cliente 110 Debe / Ingresos 100 Haber / Ingreso de Envío 1: 5 Haber (con código de proyecto/regla de distribución) / Ingreso de Envío 2: 5 Haber (con código de proyecto/regla de distribución). Factura A/P (basada en una Entrada de Mercancías OC): Proveedor 110 Haber / Inventario 105 Debe / Gasto de Envío 5 Debe (con código de proyecto/regla de distribución). En el lado de compras, si 5 afectan al inventario, se añaden a la cuenta de inventario; los otros 5 se contabilizan en la cuenta de gastos de envío.

---

## Diapositiva 20

Resumen. Puntos clave: Los gastos de envío se usan para registrar cargos adicionales en documentos de ventas y compras. Los gastos de envío pueden añadirse a la fila o a la cabecera del documento. Los gastos de envío de la cabecera pueden asignarse a las filas usando diferentes métodos de distribución. Los gastos de envío pueden afectar al costo unitario del inventario y al último precio de compra.

---

## Diapositiva 21

Pon a prueba tus conocimientos.

---

## Diapositiva 22

Test de conocimientos — Gastos de Envío. Los gastos de envío en un documento de ventas pueden estar… 1. Solo en la cabecera del documento. 2. Solo a nivel de fila. 3. En la cabecera y a nivel de fila. 4. Solo en la cabecera y en filas de artículos inventariables.

---

## Diapositiva 23

Test de conocimientos — Gastos de Envío (Respuesta). Los gastos de envío en un documento de ventas pueden estar… Respuesta correcta: 3. En la cabecera y a nivel de fila.

---

## Diapositiva 24

Test de conocimientos — Gastos de Envío. Cuando introduces gastos de envío en la fila, no aparece ningún código de impuesto o grupo. ¿Por qué? 1. No marcaste Gross Freight en la configuración de gastos de envío. 2. Marcaste Gross Freight en la configuración de gastos de envío. 3. En un documento de compras, el impuesto no se calcula sobre los gastos de envío. 4. Los códigos o grupos de impuestos no estaban marcados para afectar a los gastos de envío.

---

## Diapositiva 25

Test de conocimientos — Gastos de Envío (Respuesta). Cuando introduces gastos de envío en la fila, no aparece ningún código de impuesto o grupo. Respuesta correcta: 2. Marcaste Gross Freight en la configuración de gastos de envío.

---

## Diapositiva 26

Test de conocimientos — Gastos de Envío. Verdadero/Falso — Solo se pueden asignar gastos de envío con un código de proyecto en documentos de ventas. 1. Verdadero. 2. Falso.

---

## Diapositiva 27

Test de conocimientos — Gastos de Envío (Respuesta). Verdadero/Falso — Solo se pueden asignar gastos de envío con un código de proyecto en documentos de ventas. Respuesta correcta: 2. Falso.

---

## Diapositiva 28

Test de conocimientos — Gastos de Envío. Verdadero/Falso — Los gastos de envío a nivel de fila se copian en su totalidad cuando el documento se convierte en un documento de nivel superior. 1. Verdadero. 2. Falso.

---

## Diapositiva 29

Test de conocimientos — Gastos de Envío (Respuesta). Verdadero/Falso — Los gastos de envío a nivel de fila se copian en su totalidad cuando el documento se convierte en un documento de nivel superior. Respuesta correcta: 2. Falso. Depende del Método de Extracción configurado.

---

## Diapositiva 30

Aviso legal SAP — sin cambios respecto al documento original.

---
