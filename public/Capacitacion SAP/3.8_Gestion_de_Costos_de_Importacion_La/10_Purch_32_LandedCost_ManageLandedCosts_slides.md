# Transcripción por Diapositiva: 10_Purch_32_LandedCost_ManageLandedCosts

## Diapositiva 1

Compras: Gestión de Costos de Importación — SAP Business One Versión 10.0. Bienvenido al tema sobre cómo gestionar los costos de importación. Veremos cómo estimar y rastrear los costos de importación reales y cómo se configura esta funcionalidad.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Entender cómo se rastrean los costos de importación en los procesos de negocio. Configurar grupos de aduanas y cargos de costos de importación utilizados en los documentos de costos de importación.

---

## Diapositiva 3

Escenario de Negocio. Imagina que una gran parte del negocio de tu empresa es importar mercancías del extranjero y venderlas localmente. Cuando las mercancías llegan al puerto, hay que pagar cargos adicionales antes de poder trasladarlas a tu almacén. Estos cargos incluyen derechos de aduana y gastos adicionales de almacenamiento y envío. Para que la contabilidad del Costo de Ventas sea correcta, estos cargos adicionales deben incorporarse al costo del artículo.

---

## Diapositiva 4

¿Qué son los Costos de Importación? Los Costos de Importación (Landed Costs) son gastos adicionales que pueden aplicarse durante la importación de mercancías. Estos costos son adicionales a los derechos de aduana que se pagan por importar artículos. Los Costos de Importación pueden incluir: Envío, Seguro, Almacenamiento. El documento de costos de importación ayudará a estimar y rastrear los derechos de aduana y los costos de importación para capturar estos costos en el costo unitario de los artículos y, opcionalmente, afectar a los precios.

---

## Diapositiva 5

Distribución de Costos de Importación. Artículos: AB100 (1 kg, precio 500), BB150 (3 kg, precio 200), CD390 (2 kg, precio 300, cantidad 2). Seguro distribuido por Precio: costo 10 → AB100: 5, BB150: 2, CD390: 3. Envío distribuido por Peso: costo 120 → AB100: 20, BB150: 60, CD390: 40. Se puede elegir cómo se distribuyen los costos de importación. Por ejemplo, un pedido al extranjero puede tener costos adicionales de seguro y envío. Algunos costos pueden distribuirse por precio y otros por peso. El seguro suele basarse en el valor del artículo, por lo que se distribuye en función del precio. Los costos de envío típicamente se basan en el peso o volumen.

---

## Diapositiva 6

El Proceso de Costos de Importación en SAP Business One. Entrada de Mercancías u Orden de Compra / Factura A/P → Documento de Costos de Importación (costos de aduana e importación estimados) → Factura A/P del agente (con costos de importación reales basados en el conocimiento de embarque). Una vez que se recibe aviso de que los artículos han llegado al puerto, se emite una Entrada de Mercancías OC o una Factura A/P. El documento de costos de importación se basa en la Entrada de Mercancías OC o en la Factura A/P. Cada artículo debe tener un grupo de aduanas asignado, que está asociado a un porcentaje para calcular el importe de aduanas. El agente es un proveedor externo que cobra los costos de aduanas e importación. El agente emite una Factura A/P separada basada en el documento de costos de importación.

---

## Diapositiva 7

Ejemplo de Costos de Importación. Artículo Z00002 Tablet PC 64 GB — Precio proveedor: 300. Artículo Z00004 Tablet PC 128 GB — Precio proveedor: 400. Artículo Z00005 Tablet PC 256 GB — Precio proveedor: 600. Se han pedido 3 nuevos modelos de tablet al proveedor. Cuando llegan los artículos, se reciben en una Entrada de Mercancías OC, pero aún no se tienen los costos de envío, seguro y almacenamiento. Los tres artículos tienen el mismo peso y volumen, pero varían en precio. Se usará un documento de costos de importación para añadir esos costos y asignarlos apropiadamente.

---

## Diapositiva 8

Crear un Documento de Costos de Importación — pestaña Artículos. Se introduce el código del proveedor en un nuevo documento de Costos de Importación y luego se usa Copiar Desde para traer la información de la Entrada de Mercancías OC. La información de los artículos, precios, peso y volumen se copia en el documento. Las columnas Gasto y Valor de Costo de Asignación se rellenarán automáticamente según la configuración de asignación una vez que se introduzcan los costos. Tabla: N.°, N.° Artículo, Cant., Peso, Volumen, Precio Doc. Base, Valor Doc. Base, Gasto, Asignación, Valor de Costo.

---

## Diapositiva 9

Introducir Costos de Importación. Se han recibido facturas de seguro, envío y almacenamiento durante el tránsito. Se introducen los importes en la pestaña Costos. En el sistema están preconfiguradas las categorías de costos de importación con sus métodos de asignación: Seguro: basado en precio del artículo. Envío: asignado según peso del artículo. Almacenamiento: basado en volumen del artículo. Estas asignaciones pueden modificarse dentro del documento de costos de importación si es necesario.

---

## Diapositiva 10

Asignación Automática. Tras introducir los costos, se regresa a la pestaña Artículos para ver los cambios. El costo total de seguro, envío y almacenamiento se ha distribuido entre las filas. La columna Costos de Asignación muestra lo que realmente se asigna a cada fila. La columna Gasto muestra la asignación por unidad. Tabla actualizada con los valores distribuidos: Z00002: Gasto 6,41, Asignación 64,11. Z00004: Gasto 6,60, Asignación 66,01. Z00005: Gasto 6,99, Asignación 69,88.

---

## Diapositiva 11

Efecto en Contabilidad. En el asiento contable, el total de costos de importación se: Debita a la cuenta de inventario. Acredita a una cuenta de asignación de costos de importación. Estos costos se añaden al precio base para obtener un nuevo precio de almacén para el artículo. Cuando se pagan las facturas de seguro, envío y almacenamiento, esos costos se introducen en las cuentas de gastos a pagar correspondientes. Luego se acredita a cuentas por pagar y en lugar de debitar el gasto de envío, se debita la cuenta de costos de importación para anularla. Nota: en una empresa con inventario no perpetuo, no se crea ningún asiento contable al agregar el costo de importación.

---

## Diapositiva 12

Efecto en el Último Precio de Compra. Los costos de importación también pueden afectar al último precio de compra y a otras listas de precios. En la pestaña Detalles del documento de Costos de Importación, se puede ver el último precio de compra actualizado que ahora incluye los costos de importación. Nota: cuando el campo Gasto indica No, el importe de costos de importación de esa fila no afectará al costo del artículo.

---

## Diapositiva 13

Múltiples Proveedores. Un documento de Costos de Importación puede incluir artículos de más de un proveedor. Por ejemplo, dos envíos distintos de dos proveedores diferentes pueden copiarse en el mismo documento de costos de importación. Para ello: se copia el primer albarán (o Factura A/P) con el primer proveedor, luego se reemplaza el proveedor en la cabecera del documento. El sistema pregunta si se desea eliminar el primer proveedor. Se responde No y aparecerá "Diferentes proveedores" en el campo de proveedor. Todos los proveedores aparecerán en la pestaña Proveedores.

---

## Diapositiva 14

Definir Grupos de Aduanas. Comenzaremos la configuración de los costos de importación definiendo los grupos de aduanas.

---

## Diapositiva 15

¿Qué son los Derechos de Aduana? Los derechos de aduana son un arancel o impuesto aplicado a las mercancías cuando se transportan a través de fronteras internacionales. Cada tipo de artículo tiene una tasa de derechos específica que se determina por varios factores, incluyendo el lugar de adquisición, el lugar de fabricación y los materiales de fabricación. La tasa de derechos de aduana es un porcentaje que se determina sobre el valor total de compra de los artículos pagado en el extranjero. Recuerda que cada país tiene diferentes regulaciones aduaneras; debes seguir los requisitos locales cuando trabajes con derechos de aduana.

---

## Diapositiva 16

Grupos de Aduanas en SAP Business One. Los Grupos de Aduanas: Reflejan un porcentaje proyectado del precio de compra para calcular los gastos de derechos de aduana. Afectan al costo unitario del inventario. Afectan a una lista de precios de tu elección y al último precio de compra. Se asignan al registro de Datos Maestros del Artículo. Se necesita definir grupos de aduanas en SAP Business One según el tipo de artículos que se importan de países extranjeros. Cada grupo refleja un porcentaje proyectado del precio de compra para calcular los gastos de derechos de aduana. Los grupos de aduanas se asignan al Datos Maestros del Artículo en la pestaña Datos de Compras.

---

## Diapositiva 17

Definir Grupos de Aduanas. Administración → Configuración → Inventario → Grupos de Aduanas. Columnas: Nombre, % Aduanas, % Compra, % Otros, % Total, Cuenta de Asignación, Cuenta de Gastos. Para cada tipo de cargo aduanero se crea un grupo de aduanas diferente (por ejemplo: Vehículos, Electrónica, Alimentación). Las columnas de aduanas, compra y otros son porcentajes que representan el desglose de los cargos aduaneros. La columna total muestra el porcentaje total utilizado en el documento de costos de importación para calcular los importes de aduanas. En las últimas dos columnas se definen las cuentas de asignación y de gastos de aduanas.

---

## Diapositiva 18

Definir Grupos de Aduanas — Configuración de Cuentas. Costos de importación SIN efecto en inventario: Debe Asignación de Aduanas / Haber Gastos de Aduanas. Costos de importación CON efecto en inventario: Debe Inventario / Haber Asignación de Aduanas. Factura del agente A/P (basada en costos de importación): Debe Asignación de Aduanas / Haber Proveedor (Agente). La cuenta de gastos de aduanas se usa cuando las aduanas no afectan al inventario. Cuando las aduanas sí afectan al inventario, la cuenta de asignación de aduanas se acredita y la cuenta de inventario se debita. Cuando se crea la Factura A/P del agente basada en el documento de costos de importación, la asignación de aduanas se cancela y su saldo queda a cero. Para indicar si las aduanas deben afectar al inventario, se marca la casilla Aduanas Afectan Inventario en la pestaña Artículos del documento de Costos de Importación.

---

## Diapositiva 19

Definir Costos de Importación. A continuación definimos los costos de importación.

---

## Diapositiva 20

Definir Costos de Importación. Administración → Configuración → Compras → Costos de Importación. Columnas: Código, Nombre, Distribuir Por, Cuenta de Asignación de Costos de Importación. Se puede definir un código y nombre para cada gasto. Como un costo de importación se introduce como un importe total, se necesita decidir cómo distribuir ese importe entre los artículos del documento. Hay 6 métodos de asignación disponibles. Se necesita definir una cuenta de pasivo por cada gasto. Esta cuenta se usa como cuenta de asignación cuando se agrega el documento de costos de importación y se cancela cuando se introduce la Factura A/P del agente. No hay importes ni porcentajes en la configuración de costos de importación; esos se introducen en el propio documento.

---

## Diapositiva 21

Definir Costos de Importación — Métodos de Asignación. Hay 6 maneras posibles de distribuir los importes de costos de importación entre los artículos del documento: Valor en Efectivo Antes de Aduanas: precio unitario proporcional comparado con el total antes de aplicar el importe de aduanas. Valor en Efectivo Después de Aduanas: precio unitario proporcional comparado con el total después de aplicar el importe de aduanas. Cantidad: porcentaje basado en la cantidad de cada artículo respecto a la cantidad total. Peso: porcentaje basado en el peso de cada artículo respecto al peso total (debe definirse en los Datos Maestros). Volumen: porcentaje del volumen de cada artículo respecto al volumen total (debe definirse en los Datos Maestros). Igual: porcentaje igual para cada unidad del documento. Nota: el método de asignación puede modificarse en el documento de costos de importación según sea necesario para casos excepcionales.

---

## Diapositiva 22

Definir Costos de Importación — Transacciones Contables. Documento de Costos de Importación: Debe Inventario de Productos Terminados / Haber Asignación de Costos de Importación. Factura del agente A/P (basada en costos de importación): Debe Asignación de Costos de Importación / Haber Proveedor (Agente). Cuando se agrega el documento de costos de importación, la cuenta de productos terminados se debita y la cuenta de asignación de costos de importación se acredita. Cuando se agrega la factura del agente basada en el documento de costos de importación, la cuenta se cancela y se debita, y el proveedor se acredita. Por lo tanto, el saldo de la cuenta de asignación de costos de importación representa el total de costos de importación contabilizados pero aún no facturados por el agente.

---

## Diapositiva 23

Derechos de Aduana vs. Costos de Importación. Tabla comparativa: Obligatorio: Aduanas depende de regulaciones locales y tipo de artículos; Costos de Importación depende de los gastos incurridos hasta la liberación de los artículos. Dónde asignar: Aduanas en Datos Maestros del Artículo; Costos de Importación en el documento. Importe o porcentaje: Aduanas es un porcentaje del precio de compra del artículo; Costos de Importación es un importe total para el documento. Efecto en costo unitario: Aduanas opcional; Costos de Importación siempre. Afectar lista de precios: ambos opcional. Factura A/P del agente: ambos necesitan una. Si se han introducido aduanas y costos de importación, se necesita una Factura A/P del agente basada en el documento de costos de importación para completar el proceso.

---

## Diapositiva 24

Test de conocimientos — Configuración de Costos de Importación. ¿Dónde se asigna un grupo de aduanas? 1. Datos maestros del almacén. 2. Datos maestros del artículo. 3. Documento de Costos de Importación. 4. Datos maestros del proveedor.

---

## Diapositiva 25

Test de conocimientos — Configuración de Costos de Importación (Respuesta). ¿Dónde se asigna un grupo de aduanas? Respuesta correcta: 2. Datos maestros del artículo.

---

## Diapositiva 26

Test de conocimientos — Configuración de Costos de Importación. Verdadero/Falso — Los gastos de aduanas solo se usan cuando las aduanas no afectan al inventario. 1. Verdadero. 2. Falso.

---

## Diapositiva 27

Test de conocimientos — Configuración de Costos de Importación (Respuesta). Verdadero/Falso — Los gastos de aduanas solo se usan cuando las aduanas no afectan al inventario. Respuesta correcta: 2. Falso.

---

## Diapositiva 28

Test de conocimientos — Configuración de Costos de Importación. Verdadero/Falso — Los métodos de asignación de costos de importación solo pueden definirse en la configuración de costos de importación. 1. Verdadero. 2. Falso.

---

## Diapositiva 29

Test de conocimientos — Configuración de Costos de Importación (Respuesta). Verdadero/Falso — Los métodos de asignación de costos de importación solo pueden definirse en la configuración de costos de importación. Respuesta correcta: 2. Falso. Los métodos de asignación también pueden modificarse dentro del propio documento de costos de importación.

---

## Diapositiva 30

Resumen. Puntos clave: Los costos de importación se usan en empresas que importan mercancías de países extranjeros. El objetivo principal del rastreo de costos de importación es ver y registrar el efecto de los gastos adicionales de importación en el costo unitario del artículo. Los grupos de aduanas y los costos de importación deben configurarse con las cuentas del libro mayor correspondientes para habilitar los asientos contables automáticos. Los costos de importación también pueden usarse para afectar al último precio de compra o a cualquier otra lista de precios.

---

## Diapositiva 31

Aviso legal SAP — sin cambios respecto al documento original.

---
