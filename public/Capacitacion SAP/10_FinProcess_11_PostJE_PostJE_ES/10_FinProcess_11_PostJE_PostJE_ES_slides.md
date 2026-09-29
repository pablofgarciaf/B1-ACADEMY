# Transcripción por Diapositiva: 10_FinProcess_11_PostJE_PostJE_ES

## Diapositiva 1

PUBLIC Proceso financiero: Contabilización de un asiento SAP Business One Versión 10.0 Bienvenido al tema Contabilización de un asiento. 1

---

## Diapositiva 2

En este curso, explicaremos cómo introducir un asiento manual. 2 PUBLIC Al finalizar este tema, podrá:  Introducir un asiento manual Objetivos

---

## Diapositiva 3

3 PUBLIC Escenario empresarial  Está implementando SAP Business One en un nuevo cliente. El responsable del área de contabilidad de la empresa desea registrar transacciones de forma manual para los gastos menores. Ella le pide registrar estas transacciones en el sistema. Le muestra los asientos manuales. Está implementando SAP Business One en un nuevo cliente. El responsable del área de contabilidad de la empresa desea registrar transacciones de forma manual para los gastos menores. Ella le pide registrar estas transacciones en el sistema. Le muestra los asientos manuales. 3

---

## Diapositiva 4

En SAP Business One, un asiento se contabiliza automáticamente a partir de varios documentos, como facturas de clientes y de proveedores. 4 PUBLIC Asiento Asientos contables automáticos Fact. clientes Cobro Depósito Fact. proveedor Pago EM de pedido Documento de SAP Business One

---

## Diapositiva 5

Asimismo, se puede contabilizar un asiento manual directamente en una cuenta de mayor o en una cuenta de libro auxiliar de interlocutor comercial. 5 PUBLIC Asiento Fact. proveedor Pago EM de pedido Asientos contables automáticos Fact. clientes Cobro Depósito Asientos contables automáticos Documento de SAP Business One

---

## Diapositiva 6

Todos los asientos se contabilizan en un fichero en SAP Business One: el fichero de asientos. Se pueden fijar varios valores por defecto para los asientos. 6 PUBLIC Asiento Fichero de asientos Fact. proveedor Pago EM de pedido Asientos contables automáticos Fact. clientes Cobro Depósito Asientos contables automáticos Documento de SAP Business One

---

## Diapositiva 7

También puede modificar algunas parametrizaciones de documento para un asiento individual. 7 PUBLIC Asiento Fijar opciones del documento Fichero de asientos Asientos contables manuales Fact. proveedor Pago EM de pedido Documento de SAP Business One Asientos contables automáticos Fact. clientes Cobro Depósito

---

## Diapositiva 8

Todos los asientos hacen referencia al tipo y número del documento original, ya que con frecuencia, los asientos se crean automáticamente a partir de otro documento. Por ejemplo, FA se utiliza para las facturas de cliente. Los documentos de origen de los asientos manuales son los asientos mismos. Por este motivo, hacen referencia a sí mismos y son de la clase JE (que es estándar para el registro en el diario). La mayoría de los asientos hace referencia a otros tipos de documento (por ejemplo PU para las facturas de proveedores). 8 PUBLIC Documentos de origen Referencia a tipo de documento de origen y número de documento de origen

---

## Diapositiva 9

La ventana Asiento se encuentra en el módulo Finanzas. La ventana para introducir los asientos se divide en tres secciones: los datos de cabecera del documento, el modo de tratamiento ampliado de una posición y la tabla de posiciones. Puede mostrar u ocultar el modo de tratamiento ampliado. El modo siempre hace referencia a la línea actualmente seleccionada y muestra todos los campos de la posición para registrar los datos necesarios. Con las Parametrizaciones de formulario, puede definir qué columnas se mostrarán en la tabla de partidas individuales. Tenga en cuenta que también puede importar líneas de asientos desde Excel seleccionando el botón Importar de Excel. Para obtener más información, consulte el curso Importar de Excel. 9 PUBLIC Campos de formulario para asientos Parametrizaciones de formulario Datos de cabecera de documento Modo de tratamiento ampliado de una partida individual

---

## Diapositiva 10

Puede introducir varias líneas con importes en el Debe o el Haber. En cada línea que añada, SAP Business One recomendará un importe de compensación que se puede actualizar. Al registrar asientos manuales, en cada línea, coloque el cursor en el campo Cuenta de mayor/Código IC y pulse Tab para visualizar la lista de cuentas, o CTRL + Tab para visualizar la lista de datos maestros de interlocutores comerciales. De forma alternativa, puede utilizar el menú contextual para abrir la lista de cuentas o la lista de interlocutores comerciales. Tenga en cuenta que puede buscar una cuenta o un interlocutor comercial mediante el campo Cuenta de mayor/Nombre IC. Si conoce el primer carácter del código o nombre del cliente, indíquelo, seguido de un asterisco. A continuación, pulse CTRL + Tab para generar una lista de todos los códigos de cliente que empiecen por ese carácter. Si conoce un código o nombre de cliente parcial, escriba primero un asterisco (*) y, a continuación, el código o nombre parcial. A continuación, presione CTRL + Tab para visualizar una lista de todos los registros que contiene el string al que ha accedido. Lo mismo es válido para las cuentas, pero pulsando Tab para visualizar la lista de cuentas. 10 PUBLIC Métodos de trabajo de asiento Cuando introduzca los asientos manuales:  Pulse la tecla Tab para visualizar la lista de cuentas o  CTRL+TAB para visualizar la lista de interlocutores comerciales o  Utilice el menú contextual para visualizar alguna de las listas Es posible buscar una cuenta o interlocutores comerciales mediante un string de código o nombre parcial: • *[string]: para encontrarle a un nombre un código que contiene o termina con este string • [string]*: para encontrarle un código a un nombre que comience con este string

---

## Diapositiva 11

 Es posible que los usuarios hagan entradas incorrectas. Como consecuencia, el asiento creado puede contener información errónea. Para proporcionar una auditoría de la corrección, el usuario primero debe anular el asiento erróneo y, a continuación, realizar una captura correcta del documento.  Para cancelar un asiento manual seleccione Cancelar en el menú Datos o directamente desde el menú contextual del asiento.  Puede especificar si se llevarán a cabo transacciones de anulación: Como transacción de anulación estándar o Como transacciones de anulación con importes negativos. El método elegido también determina el asiento de anulación automático creado para los documentos de marketing cancelados. 11 PUBLIC Transacciones de anulación ■Transacción de anulación estándar ■Transacciones de anulación con importes negativos Asiento original con error Haber Debe Cuenta 2050 Cuenta A 2050 Cuenta B 2050 2050 

---

## Diapositiva 12

 La transacción de anulación estándar hace que el sistema contabilice el Debe erróneamente como Haber y viceversa. De este modo, se corrige el saldo de las cuentas. Sin embargo, la transacción de anulación estándar provoca un aumento adicional de los totales en el Debe y el Haber, y ello puede generar confusiones.  En la parte izquierda de la imagen puede ver un ejemplo de un asiento con errores y la correspondiente entrada de anulación. A la derecha puede ver el efecto de la entrada de anulación en el saldo de cuenta A. El saldo total se compensa, sin embargo, el Debe no se ve afectado y aumenta la columna del Haber. 12 PUBLIC Transacciones de anulación - Transacción de anulación estándar Asiento original con error Haber Debe Cuenta 2050 Cuenta A 2050 Cuenta B 2050 2050  Asiento de anulación Haber Debe Cuenta 2050 Cuenta A 2050 Cuenta B 2050 2050  Saldo de cuenta [A] – antes de la anulación Saldo total (H/D) Haber total Debe total 2050 0 2050 Saldo de cuenta [A] – después de la anulación Saldo total (H/D) Haber total Debe total 0 2050 2050 La anulación estándar aumenta el total del lado opuesto

---

## Diapositiva 13

 La transacción de anulación estándar con importes negativos hace que el sistema contabilice el Debe y el Haber erróneamente como créditos negativos. De este modo, no solo se corrige el saldo de las cuentas, sino también los totales. Como puede ver en la imagen de la tabla del saldo de cuenta. 13 PUBLIC Transacciones de anulación - Transacciones de anulación con importes negativos. La transacción de anulación con importes negativos reinicializa los totales del mismo lado Asiento original con error Haber Debe Cuenta 2050 Cuenta A 2050 Cuenta B 2050 2050  Asiento de anulación Haber Debe Cuenta -2050 Cuenta A -2050 Cuenta B -2050 -2050  Saldo de cuenta [A] – antes de la anulación Saldo total (H/D) Haber total Debe total 2050 0 2050 Saldo de cuenta [A] – después de la anulación Saldo total (H/D) Haber total Debe total 0 0 0

---

## Diapositiva 14

14 PUBLIC Opciones de anulación Esta parametrización es relevante para los asientos automáticos y manuales. La necesidad de llevar a cabo transacciones de anulación estándar o transacciones de anulación con importes negativos depende del país. Puede establecer qué tipo de anulación se utilizará en la ventana Detalles de la empresa en el área de menú Inicialización del sistema del módulo Gestión. En la ficha Inicialización básica, puede seleccionar el campo Permitir importes negativos para contabilización de transacción de anulación para activar la transacción de anulación con importes negativos. De otro modo, el sistema utilizará la transacción de anulación estándar. Esta parametrización es importante para los asientos automáticos (p. ej. factura de clientes) y los manuales. 14

---

## Diapositiva 15

Al registrar un asiento manual, puede marcar la casilla de selección Anular. Esto le permite crear una transacción de anulación para el asiento actual y definir la fecha en la que la transacción de anulación debería crearse. Un ejemplo del uso de esta opción puede ser en los casos en que la empresa debe emitir un informe de período y tiene aplazamientos de ingresos. Cuando se acerca la fecha de anulación de la transacción, se muestra la ventana Anular transacciones al iniciar sesión. Como alternativa, puede abrir la ventana Anular transacciones en el módulo Finanzas. Para ejecutar la transacción de anulación, seleccione el pulsador Ejecutar. Como consecuencia, se crea una nueva transacción. En el campo Comentarios de esta transacción se muestra el texto (anulación) y el número de la transacción original. La opción Anular está deshabilitada. En la transacción original, la opción Anular no está visible y la palabra Cancelada indica que se ha cancelado la transacción. Nota: Las transacciones de anulación pueden contabilizarse únicamente cuando ya ha pasado la fecha de anulación y Puede anular cada asiento una única vez. 15 PUBLIC Anulación programada de los asientos manuales

---

## Diapositiva 16

16 PUBLIC Resumen A continuación, se detallan algunos puntos clave: Todos los asientos se contabilizan en el archivo Asientos, incluidos: • Asientos automáticos que se contabilizan a partir de varios documentos, como facturas de clientes y de proveedores. • Asientos contabilizados manualmente. Al registrar asientos manuales, en el campo Cta.mayor/Código IC pulse: • Tab para visualizar la lista de cuentas. • Y CTRL + Tab para visualizar la lista de Datos maestros de interlocutores comerciales. • O utilice el menú contextual Dependiendo de los estándares de su país, puede especificar si se realizarán transacciones de anulación: • Como transacción de anulación estándar. • O como transacciones de anulación con importes negativos. La anulación programada: • Se lleva a cabo introduciendo una fecha futura de cancelación en el asiento. • Se puede definir para que le avise automáticamente  A continuación, se detallan algunos puntos clave para tener en cuenta:  Todos los asientos se contabilizan en el archivo Asientos. Se incluyen los asientos automáticos contabilizados desde documentos como facturas de clientes y proveedores y asientos contabilizados manualmente.  Cuando registre asientos manuales, en el campo Cta.mayor/Código IC pulse Tab para visualizar la lista de cuentas. O CTRL + Tab para visualizar la lista de Datos maestros de interlocutores comerciales. Recuerde que también puede indicar la lista de cuentas o interlocutores comerciales desde el menú contextual.  Dependiendo de los estándares de su país, puede especificar si se realizarán transacciones de anulación como transacciones de anulación estándar o como transacciones de anulación con importes negativos.  La anulación programada se lleva a cabo introduciendo una fecha futura de cancelación en el asiento. Se puede definir la transacción de cancelación para que le avise automáticamente. 16

---

