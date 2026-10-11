# Transcripción por Diapositiva: 10_FinSetup_11_Currencies_Currencies_ES

## Diapositiva 1

PUBLIC Configuración financiera: Trabajar con monedas SAP Business One Versión 10.0 Bienvenido al tema sobre monedas. 1

---

## Diapositiva 2

En este tema, analizaremos cómo definir las monedas en el proceso de implementación. Explicaremos las consecuencias de las elecciones sobre la definición de las monedas en la empresa en el proceso de contabilidad financiera. Daremos ejemplos de algunas cuestiones relativas a monedas en SAP Business One. Las decisiones sobre estas definiciones siempre deben realizarse junto con la persona responsable del área de contabilidad del cliente. 2 PUBLIC Al finalizar este tema, podrá:  Definir las monedas en el proceso de implementación.  Explicar las consecuencias de las elecciones sobre la definición de las monedas en la empresa en el proceso de contabilidad financiera.  Dar ejemplos de algunas cuestiones relativas a monedas en SAP Business One. Objetivos Nota: Las decisiones sobre estas definiciones siempre deben realizarse junto con la persona responsable del área de contabilidad del cliente.

---

## Diapositiva 3

Imagine que está implementando SAP Business One con un cliente británico, OEC Computers. Analiza la definición de monedas con María, la responsable del área de contabilidad: María dice que la mayor parte de sus clientes son locales, por lo que se ubican en el Reino Unido. Sin embargo, algunos clientes y proveedores con los que trabajan se encuentran en otro país, específicamente en EE. UU. Menciona a María los métodos de trabajo con las monedas en SAP Business One. 3 3 PUBLIC Escenario empresarial  Analiza la definición de impuestos con María, la responsable del área de contabilidad:  María comenta que la mayoría de sus clientes son locales.  Sin embargo, algunos clientes y proveedores están ubicados en otro país.

---

## Diapositiva 4

Revisaremos las definiciones de moneda de la empresa. Desde el nivel de la empresa, la moneda de la cuenta y finalmente la configuración de monedas en la lista de precios. 4 PUBLIC Agenda Monedas a nivel de empresa – Moneda local y del sistema – Monedas de la cuenta – Monedas en la lista de precios Contabilización de diferencias de tipos de cambio – Diferencias de cambio – Diferencias de conversión

---

## Diapositiva 5

OEC Computers se ubica en el Reino Unido, algunos de sus clientes están en los EE. UU. ¿Cómo pueden cobrarles a los clientes extranjeros? ¿Cuál será la moneda del importe total de la factura de clientes? ¿Cuál será la moneda en el asiento automático creado por la factura de clientes? 5 PUBLIC Pregunta de reflexión OEC Computers se ubica en el Reino Unido, algunos de sus clientes están en los EE. UU.  ¿Cómo pueden cobrarles a los clientes extranjeros?  ¿Cuál será la moneda del importe total de la factura de clientes?  ¿Cuál será la moneda en el asiento automático creado por la factura de clientes?

---

## Diapositiva 6

Se puede fijar el precio de un artículo en cada lista de precios en hasta tres monedas diferentes: la moneda principal y dos monedas adicionales. Esto es útil cuando se necesite definir una determinación de precios exacta para diferentes países en vez de usar tipos de cambio de moneda. En la lista de precios de ventas de OEC Computers, la moneda primaria sigue siendo la predeterminada por lo tanto la Libra esterlina se usa en los documentos para los clientes locales. En la columna moneda adicional en la lista de precios de ventas indicarán los precios en dólares estadounidenses. Para los clientes de EE.UU., la moneda del documento será dólares estadounidenses y el precio de los artículos se presentará en la moneda adicional, es decir, dólares estadounidenses. En los asientos automáticos, el sistema convierte el importe total de la factura de la moneda extranjera a la moneda local y contabiliza ambos valores en paralelo. 6 PUBLIC Respuesta  En la columna moneda adicional en la lista de precios de ventas indicarán los precios en dólares estadounidenses.  La moneda de la factura de cliente será dólares estadounidenses.  En los asientos automáticos, el sistema convierte el importe total de la factura de la moneda extranjera a la moneda local y contabiliza ambos valores en paralelo.

---

## Diapositiva 7

SAP Business One puede gestionar la contabilidad en dos monedas paralelas: la moneda local y la moneda del sistema. Esto se define en la ficha Inicialización básica de la ventana Detalles de la empresa en el menú Inicialización del sistema en el módulo Gestión. La moneda local es la moneda en la que la empresa está obligada legalmente a llevar sus libros. La moneda del sistema puede ser diferente de la moneda local y resulta especialmente útil para las subsidiarias de empresas internacionales cuya sede central utiliza una moneda diferente de la de las subsidiarias (por ejemplo, Euros (€) en la subsidiaria y USD ($) en la sede central). En este caso, el sistema calcula automáticamente todas las contabilizaciones en la moneda local y gestiona un saldo de cuenta adicional en la moneda del sistema en tiempo real. Esto facilita la agregación de informes en todas las subsidiarias y permite una mejor integración con el sistema de la sede central. Por ejemplo, puede exportar datos financieros en la moneda del sistema desde los sistemas SAP Business One de las subsidiarias al sistema de la sede central. Como alternativa, la consolidación financiera puede llevarse a cabo con Microsoft Excel o con cualquier otro producto basado en los datos financieros en la moneda del sistema. 7 PUBLIC Nivel de empresa: moneda local y del sistema Sede central Moneda: USD Subsidiaria Moneda local: EUR Moneda del sistema: USD Moneda local: USD Moneda del sistema: USD Moneda local: JPY Moneda del sistema: USD Microsoft Excel Subsidiaria Subsidiaria

---

## Diapositiva 8

En nuestro ejemplo, OEC Computers desea generar informes en Euros para poder presentarlos a los inversores que ejecutan sus cuentas en Euros. Por lo tanto, defina la moneda del sistema en Euros. Es importante recordar que no podrá cambiar la moneda local o la moneda del sistema una vez que haya comenzado a trabajar con la base de datos. Además de la moneda del sistema, tiene la opción de presentar informes financieros en cualquier moneda extranjera. Utilice la opción de revaluación para elegir el método de revaluación y la moneda. El sistema calcula todos los saldos en la moneda seleccionada, a medida que realiza el informe. 8 PUBLIC Nivel de empresa: moneda local y del sistema SAP Business One Moneda local: GBP Moneda del sistema: Euro OEC Computers

---

## Diapositiva 9

Cada registro de datos maestros de interlocutor comercial y cada cuenta de mayor debe tener una definición de moneda de la cuenta:  El sistema fija la moneda local como moneda por defecto para todos los registros de datos maestros de interlocutor comercial.  Puede definir una moneda predeterminada para las nuevas cuentas de mayor mediante el campo Moneda de la cuenta predeterminada de la etiqueta Inicialización básica en la ventana Detalles de la empresa en la Inicialización del sistema. En nuestro ejemplo, la moneda para la mayoría de los proveedores y clientes de OEC Computers se definirá como libra esterlina (moneda local). Los proveedores y clientes de EE.UU. se definirán en USD (moneda extranjera específica). La cuenta bancaria de la empresa se definirá en Todas las monedas, ya que debe registrar asientos y documentos en más de una moneda extranjera específica (por ejemplo, transferencias bancarias). La tabla de la diapositiva detalla las opciones para escribir asientos y visualizar el saldo de cuenta para cada opción de la moneda de la cuenta: Moneda local, Moneda extranjera y Todas las monedas. 9 PUBLIC Monedas de la cuenta Monedas para escribir asientos Monedas del saldo de cuenta Moneda de la cuenta = Moneda local ■Moneda local ■Moneda local ■Moneda del sistema Moneda de la cuenta = Moneda extranjera específica ■Moneda local ■Moneda extranjera definida ■Moneda local ■Moneda del sistema ■Moneda extranjera definida Moneda de la cuenta = Todas las monedas ■Moneda local ■Cualquier moneda extranjera ■Moneda local ■Moneda del sistema

---

## Diapositiva 10

En la primera línea, vemos que si la moneda de la cuenta es "moneda local", los asientos se registran en la moneda local. Sin embargo, todas las transacciones, en todas las monedas, se convierten automáticamente en la moneda del sistema en tiempo real y se visualizan en el asiento en las columnas de moneda de sistema independientes. Por lo tanto el saldo de cuenta se muestra en la moneda local y en la del sistema. Tenga en cuenta que la reconciliación interna se realiza en una sola moneda. Esta cuenta se reconciliará en la moneda local. 10 PUBLIC Monedas para escribir asientos Monedas del saldo de cuenta Moneda de la cuenta = Moneda local ■Moneda local ■Moneda local ■Moneda del sistema * Moneda del sistema ≠ moneda local Moneda de la cuenta = Moneda extranjera específica ■Moneda local ■Moneda extranjera definida ■Moneda local ■Moneda del sistema ■Moneda extranjera definida Moneda de la cuenta = Todas las monedas ■Moneda local ■Cualquier moneda extranjera ■Moneda local ■Moneda del sistema Monedas de la cuenta

---

## Diapositiva 11

En la segunda línea, la moneda de la cuenta se definió para una moneda extranjera específica.  En ese caso, puede registrar asientos en la moneda local y también en la moneda extranjera especificada.  Puede visualizar el saldo de cuenta en la moneda extranjera especificada y también en las monedas locales y las del sistema. Esta cuenta se reconciliará en la moneda extranjera. 11 PUBLIC Monedas de la cuenta Monedas para escribir asientos Monedas del saldo de cuenta Moneda de la cuenta = Moneda local ■Moneda local ■Moneda local ■Moneda del sistema Moneda de la cuenta = Moneda extranjera específica ■Moneda local ■Moneda extranjera definida ■Moneda local ■Moneda del sistema ■Moneda extranjera definida Moneda de la cuenta = Todas las monedas ■Moneda local ■Cualquier moneda extranjera ■Moneda local ■Moneda del sistema

---

## Diapositiva 12

En la última línea, la cuenta se definió para “Todas las monedas”.  En ese caso, puede registrar asientos en cualquier moneda extranjera que se haya definido para la empresa, así también como en la moneda local. El saldo de cuenta se visualizará en la moneda local y en la del sistema. Esta cuenta se reconciliará en la moneda local. En cualquier momento, puede cambiar la moneda de la cuenta a Todas las monedas, pero una vez que actualice la cuenta, no podrá volver a cambiarla por una moneda extranjera específica o una de local. 12 PUBLIC Monedas de la cuenta Monedas para escribir asientos Monedas del saldo de cuenta Moneda de la cuenta = Moneda local ■Moneda local ■Moneda local ■Moneda del sistema Moneda de la cuenta = Moneda extranjera específica ■Moneda local ■Moneda extranjera definida ■Moneda local ■Moneda del sistema ■Moneda extranjera definida Moneda de la cuenta = Todas las monedas ■Moneda local ■Cualquier moneda extranjera ■Moneda local ■Moneda del sistema

---

## Diapositiva 13

Como ya se ha mencionado, se puede fijar el precio de un artículo en hasta tres monedas diferentes: la moneda principal y dos monedas adicionales. En el ejemplo que presentamos, en la lista de precios de ventas regulares la moneda principal es la moneda por defecto (es decir, la libra esterlina) para los documentos de los clientes locales. En la moneda adicional en esta lista de precios, los precios se indicaron en Dólares estadounidenses. Cuando se selecciona un cliente estadounidense en una factura de clientes, la moneda del documento se fija automáticamente en Dólares estadounidenses según la moneda del IC. Por lo tanto, el precio por unidad del artículo utilizará la moneda adicional, es decir dólares estadounidenses. En el asiento automático creado por esta factura, el sistema convierte el importe total de la factura de la moneda extranjera a la moneda local y contabiliza ambos valores en paralelo. Nota: Puede fijar un símbolo de moneda predeterminada si desea que se autocomplete cuando indica los precios en la lista de precios. En la ventana inicial Lista de precios, en las columnas de monedas adicionales, fije la moneda deseada. Por ejemplo, para la lista de precios Ventas regulares indique USD en la columna Moneda adicional 1. Cuando abra esta lista de precios y escriba un precio en la columna Precio por unidad en la sección Moneda adicional 1 y seleccione TAB, el sistema añadirá automáticamente el símbolo USD. 13 PUBLIC Utilizar monedas extranjeras en documentos: Moneda adicional Asiento

---

## Diapositiva 14

En algunos casos, no hay ningún precio en la lista de precios con la misma moneda que la moneda de interlocutor comercial. Esto se puede definir, por ejemplo, cuando desea colocar un precio en una moneda fija para clientes locales y extranjeros. Al seleccionar un interlocutor comercial en un documento de marketing, su moneda y su lista de precios se copian automáticamente en el documento. Por defecto, si NO hay ninguna moneda que coincida en los precios principales o adicionales de la lista de precios, el precio principal se copiará en la línea del artículo del documento. En ese caso, la moneda del precio es distinta a la moneda del documento. SAP Business One convierte automáticamente el valor total de la línea y el valor total del documento a la moneda local, a la del sistema o a la moneda IC, en función de la moneda del interlocutor comercial. También puede registrar manualmente un precio por unidad en cualquier moneda extranjera definida en la ventana Monedas: Configuración. Por defecto, el tipo de cambio utilizado se basa en la fecha de contabilización del documento. 14 PUBLIC Utilizar monedas extranjeras en documentos: Sin moneda adicional ¿Coincide algún precio de la lista de precios con la moneda del IC? Yes No Utilice este precio Utilice el precio principal Convertir a: Moneda local, del IC, del sistema

---

## Diapositiva 15

A continuación, veremos las diferencias de cambio desde la moneda extranjera y la moneda del sistema hasta la moneda local. 15 PUBLIC Agenda Monedas a nivel de empresa – Moneda local y del sistema – Monedas de la cuenta – Monedas en la lista de precios Contabilización de diferencias de tipos de cambio – Diferencias de cambio – Diferencias de conversión

---

## Diapositiva 16

Las fluctuaciones del tipo de cambio pueden causar diferencias de cambio cuando se pagan facturas en monedas extranjeras:  En la figura, se muestra una factura de proveedores emitida por un proveedor extranjero en una moneda extranjera. En el día de la contabilización de la factura, el tipo de cambio era 0,5. El sistema convierte las 10 unidades de moneda extranjera en 20 unidades de moneda local y contabiliza ambos valores en paralelo en la columna Haber de la cuenta de proveedor.  En el momento de contabilizar el pago de esta factura, el tipo de cambio ha pasado a ser 0,25. 10 unidades de moneda extranjera equivalen ahora a 40 unidades de moneda local.  Recuerde que los importes pagados en la moneda extranjera son similares a los de la factura de proveedores. Al proveedor se le paga en su moneda local para que no note la diferencia. Veremos la diferencia cambiaria en la conversión a la moneda local.  En la moneda extranjera, el importe de la factura y del pago es similar, es decir, 10 unidades.  Pero, en comparación con el valor en el momento de la factura, existe una diferencia de tipo de cambio de 20 unidades de moneda local. Al contabilizar el pago de esta factura, el sistema contabiliza automáticamente esta diferencia de tipo de cambio en una cuenta de diferencia de tipo de cambio. El sistema contabiliza las diferencias de cambio como gastos o ingresos en las cuentas que se han indicado en la ventana Determinación de cuentas de mayor, en la ficha Compras, en el campo Ganancia de diferencia de cambio realizada y en la Pérdida de diferencia de cambio realizada. 16 PUBLIC Contabilizaciones de diferencias de tipos de cambio Proveedor extranjero Pagos efectuados 20 ML Diferencias de cambio 40 ML 20 ML 20 ML 40 ML Tipo: 0,5 Tipo: 0,25 10 ME 10 ME 10 ME ML: Moneda local ME: Moneda extranjera Factura en moneda extranjera Pago

---

## Diapositiva 17

Las cuentas de moneda extranjera y los interlocutores comerciales contabilizan todas las transacciones en la moneda local además de hacerlo en la moneda extranjera. El saldo en la moneda local contiene las posiciones en moneda extranjera convertidas mediante el tipo de cambio (obtenidas de la tabla Tipos de cambio) durante la fecha de contabilización o la fecha fiscal. En otras palabras, el saldo se basa en tipos de cambio pasados. Periódicamente, debe revalorizar el saldo de cuenta en moneda extranjera con el tipo de cambio de una fecha clave de cierre. Esta acción se realiza en la ventana Diferencias de tipo de cambio en el módulo Finanzas. Al ejecutar esta función, el sistema genera una lista de propuestas para las contabilizaciones de diferencias en la moneda local. Puede aceptar o rechazar cada propuesta de forma individual. 17 PUBLIC Ventana de diferencias de tipos de cambio Cuenta en moneda extranjera 10 ML Diferencias de tipo de cambio 10 ML 200 ML 100 ME 190 ML 100 ME Saldo revalorizado Revaloración Saldo original ML: Moneda local,   ME: Moneda extranjera o Propuestas de contabilizaciones de diferencias Rechazar propuesta Aceptar y contabilizar propuesta

---

## Diapositiva 18

Además de la moneda local, el sistema gestiona los datos en la moneda del sistema de forma paralela. Si la moneda local de la empresa es diferente de la moneda del sistema, pueden surgir diferencias de tipo de cambio. El sistema puede revalorizar automáticamente estas diferencias a una fecha determinada. La fecha es normalmente un día de cierre de un período determinado. El procedimiento se realiza mediante la función Diferencias de conversión en el módulo Finanzas de la misma forma que las diferencias de cambio. De la misma forma que la funcionalidad de las diferencias de tipo de cambio, el sistema propone los asientos que se deben contabilizar. Las diferencias de conversión se contabilizan únicamente en la moneda del sistema. Se recomienda ejecutar la función de diferencia de conversión antes de ejecutar el proceso de cierre del período. Consulte el curso: Reconciliación interna para obtener más información acerca de las diferencias de conversión y cambio en el proceso de reconciliación interno. 18 PUBLIC Ventana de diferencias de conversión Cualquier cuenta 10 MS Diferencias de conversión 10 MS 100 MS 100 ML 90 MS 100 ML Saldo revalorizado Revaloración Saldo básico Cuando la moneda del sistema es distinta de la moneda local o Propuestas de contabilizaciones de diferencias Rechazar propuesta Aceptar y contabilizar propuesta MS: Moneda del sistema

---

## Diapositiva 19

A continuación, se detallan algunos puntos clave para tener en cuenta: • SAP Business One puede gestionar la contabilidad en dos monedas paralelas: la moneda local (en la que la empresa está obligada legalmente a llevar sus libros) y la moneda del sistema. • Cuando la moneda del sistema difiere de la moneda local, el sistema calcula automáticamente todas las contabilizaciones en la moneda local y gestiona un saldo de cuenta adicional en la moneda del sistema en tiempo real. • Cada registro de datos maestros de interlocutor comercial y cada cuenta de mayor debe tener fijada una definición de moneda de la cuenta en una de estas tres opciones: moneda local, moneda extranjera específica o todas las monedas. 19 19 PUBLIC Resumen (1/3) A continuación, se detallan algunos puntos clave: SAP Business One puede gestionar la contabilidad en dos monedas paralelas: • La moneda local en la que la empresa está obligada legalmente a mantener sus libros. • La moneda del sistema que resulta especialmente útil en subsidiarias de empresas internacionales. Con la moneda del sistema, el sistema automáticamente: • Calcula todas las contabilizaciones en la moneda local. • y gestiona un saldo de cuenta adicional en la moneda del sistema en tiempo real. Cada registro de datos maestros de interlocutor comercial y cada cuenta de mayor debe tener: • Una definición de moneda de la cuenta: ─Moneda local o ─Moneda extranjera específica o ─Todas las monedas

---

## Diapositiva 20

• Es posible fijar un precio de artículo en una de estas tres monedas de la lista de precios: la moneda primaria y dos monedas adicionales. • Cuando selecciona un cliente extranjero en un documento de ventas, la moneda del documento se fija automáticamente según la moneda del IC. El precio unitario de este artículo se toma de la lista de precios asignada en la moneda adicional adecuada, si se definió una.  El asiento automático de la factura convierte el importe total de la factura de la moneda extranjera a la moneda local y contabiliza ambos valores en paralelo. • Cuando paga facturas en monedas extranjeras, el importe de la factura y del pago son similares en la moneda extranjera.  Las diferencias de tipo de cambio pueden deberse a una diferencia de cambio en la conversión a la moneda local. El sistema automáticamente contabiliza cualquier diferencia en tipo de cambio a una cuenta de diferencia de tipo de cambio. 20 20 PUBLIC Resumen (2/3) Se puede fijar el precio de un artículo en hasta tres monedas diferentes en una lista de precios: • La moneda primaria y dos monedas adicionales. Cuando se selecciona un cliente extranjero en un documento de ventas. • La moneda de documento se fija automáticamente según la moneda IC. • El precio por unidad del artículo se toma de la moneda adicional correspondiente, si se ha definido. • El asiento automático convierte el importe total en moneda extranjera en la moneda local y contabiliza ambos valores en paralelo. Cuando paga facturas en monedas extranjeras: • En la moneda extranjera, el importe de la factura y del pago es similar. • Las diferencias de tipo de cambio se deben a una diferencia de cambio en la conversión a la moneda local. • El sistema automáticamente contabiliza cualquier diferencia en tipo de cambio a una cuenta de diferencia de tipo de cambio.

---

## Diapositiva 21

• El proceso Diferencias de tipo de cambio permite compensar la diferencia entre el saldo de cuenta en moneda extranjera y el saldo de cuenta en moneda local para una fecha determinada. • Un asiento de deferencia de conversión: • Compensa la moneda de sistema • Se lleva a cabo en empresas en las que la moneda del sistema es distinta de la moneda local. • Un proceso de deferencia de conversión compensa la moneda del sistema para un tipo de cambio de una determinada fecha de cierre. 21 21 PUBLIC Resumen (3/3) El proceso Diferencias de tipo de cambio permite compensar: • La diferencia entre el saldo de cuenta en moneda extranjera y el saldo de cuenta en moneda local. Un asiento de deferencia de conversión: • Compensa la moneda de sistema • Se lleva a cabo en empresas en las que la moneda del sistema es distinta de la moneda local. Un proceso de deferencia de conversión: • Compensa la moneda del sistema para un tipo de cambio de una determinada fecha de cierre.

---

