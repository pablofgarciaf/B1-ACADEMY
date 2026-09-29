# Transcripción por Diapositiva: 10_BankProcess_11_Handling_Payments_ES

## Diapositiva 1

PUBLIC Proceso de gestión de bancos: Gestión de pagos SAP Business One Versión 10.0 Bienvenido al tema Gestión de pagos. 1

---

## Diapositiva 2

Al finalizar este tema, podrá:  Enumerar las etapas del proceso de pago y realizarlas en SAP Business One, como: cobros, pagos y depósitos.  Explicar las consecuencias de cada etapa en las cuentas de mayor implicadas.  Ajusta el escenario de pago adecuado para las necesidades del cliente y la localización según las decisiones tomadas junto al contador del cliente. 2 PUBLIC Al finalizar este tema, podrá:  Enumerar las etapas del proceso de pago y realizarlas en SAP Business One  Explicar las consecuencias de cada etapa en las cuentas de mayor implicadas.  Ajustar el escenario de pago adecuado de acuerdo con la localización y las necesidades del cliente. Objetivos

---

## Diapositiva 3

Primero, veremos un proceso de pago manual típico: Los clientes pagan sus deudas, es decir, las facturas de clientes pendientes, de acuerdo con las condiciones de pago acordadas: Efectivo, plazos, neto 30, etc. En nuestro ejemplo empresarial, María, la responsable del área de contabilidad de OEC Computers, se encarga de los cobros todas las tardes. Ella visualiza la cuenta bancaria de la empresa en línea para ver los cobros recibidos de los clientes mediante transferencia bancaria. En SAP Business One, verifica las cuentas de tarjetas de crédito (Visa y Master Card) para ver la cantidad de cobros con tarjeta de crédito emitidos en el punto de venta de la tienda y en el centro de servicio al cliente durante el día. María introduce un depósito con tarjeta de crédito en SAP Business One para registrar los pagos que Visa y Master Card transfirieron a la cuenta bancaria de la empresa. Observe que en este ejemplo empresarial nos centramos en el proceso de pago manual. Recuerde que también dispone del Asistente de pago y de las opciones del Tratamiento de extractos bancarios que le permiten crear cobros y pagos efectuados automáticamente y semiautomáticamente. Para obtener más información sobre la creación de pagos en lotes, consulte el curso del asistente de pago. 3 PUBLIC Gestión de pagos recibidos: Ejemplo empresarial Cobro Depósito Cuenta bancaria

---

## Diapositiva 4

 Existen cuatro opciones de medios de pago para los cobros. Primero veremos los tres medios de pago que generalmente consisten en un proceso de dos pasos: efectivo, cheques y tarjeta de crédito.  Independientemente del medio de pago, cuando emite un cobro completo se cierra la factura pendiente en la cuenta de deudor.  Los pagos en efectivo, por cheque y con tarjeta de crédito se contabilizan en una cuenta de compensación.  Tenga en cuenta que el término “compensación” se utiliza en la localización para EE. UU. En otras localizaciones, el término podría ser: “cuenta temporal” o “cuenta transitoria”. Las cuentas de compensación deben predefinirse en la definición.  En el ejemplo, vemos un Pago en la izquierda por 105 que genera el siguiente asiento automático: Debe en una cuenta de compensación: saldo de caja/tarjeta de crédito/cheques recibidos. Haber en una cuenta de deudor.  Es posible integrar herramientas externas, como sistema de punto de venta y autorización de transacciones con tarjeta de crédito, en el proceso estándar.  El sistema recupera el efectivo y las cuentas de cheques recibidos en la ventana Determinación de cuenta de mayor.  La cuenta de la tarjeta de crédito se recupera desde el campo Cuenta de mayor en la ventana de definición de tarjetas de crédito de la configuración bancaria en el módulo Administración.  En la derecha, vemos la segunda contabilización del documento Depósito que se usó para transferir los fondos de la cuenta de compensación a la cuenta de banco propio y compensar dicha cuenta. 4 PUBLIC Cobros: Medios de pago en efectivo, con tarjeta de crédito y cheque Debe Haber Cuenta compensación: Cheque/Tarj. crédito/ Efectivo 105 Cliente 105 Cobro Depósito Cuenta de compensación Cuenta bancaria Debe Haber Cuenta compensación: Cheque/Tarj. crédito/ Efectivo 105 Cuenta bancaria 105 Factura de clientes Cobros - Medios de pago:  Efectivo  Verificar  Tarjeta de crédito

---

## Diapositiva 5

Otra opción para los medios de pago es la transferencia bancaria. Cuando un cliente paga mediante Transferencia bancaria la transacción NO involucra una cuenta de compensación. El cliente transfiere el pago directamente al banco propio. Aquí vemos el Debe en el banco propio, y el Haber en la cuenta del deudor. 5 PUBLIC Cobros : Medios de pago por transferencia bancaria Cobro – Medios de pago:  Transferencia bancaria Cobro Debe Haber Cuenta bancaria 105 Cliente 105 Factura de clientes Cuenta bancaria

---

## Diapositiva 6

Las ventanas para pagos recibidos y efectuados son prácticamente idénticas. La pantalla está dividida en las siguientes partes:  El área de la cabecera del documento (arriba)  El área para la selección de facturas pendientes, abonos y asientos, así como para la asignación de importes de pago (en el medio).  El área para especificar comentarios y visualizar totales (en la parte inferior) 6 PUBLIC Estructura de un documento de pago Cabecera de documento de pago Facturas pendientes, abonos y asientos Totales, comentarios Cobros/Pagos

---

## Diapositiva 7

En el área central, se seleccionan las transacciones pendientes de pago de la tabla mediante la casilla de selección de la columna Seleccionado. El sistema le ofrece herramientas para identificar rápidamente la naturaleza de los documentos que se muestran y para colaborar con su selección. 7 PUBLIC Cómo determinar el importe de pago Pago a cuenta 25 185 Saldo pendiente 25 Importe total vencido -98 AC -98 -98 * 1 de 1 204 CN FA FA Tp. doc. -20 -20 -20 * 1 de 1 202 98 2% 100 100 2 de 2 101 180 180 200 * 1 de 2 Pago total Saldo vencido Total * Plazos Doc.  Sel. 101    Dto. pronto pago

---

## Diapositiva 8

Un asterisco (*) tras la fecha de la factura indica que esta ya ha vencido. La fecha de vencimiento de la factura es anterior o equivalente a la fecha actual. El porcentaje de descuento por pronto pago muestra la tasa de descuento por pronto pago definida para el interlocutor comercial, depende de la fecha del pago recibido y de la fecha de la factura. Si es necesario, puede modificarlo.  La columna Pago total muestra el importe pendiente de una factura. El sistema propone el saldo vencido como el importe a pagar. Modifique este importe si el pago solo es parte del importe de la factura. 8 PUBLIC Cómo determinar el importe de pago Pago a cuenta 25 185 Saldo pendiente 25 Importe total vencido -98 AC -98 -98 * 1 de 1 204 CN FA FA Tipo doc. -20 -20 -20 * 1 de 1 202 98 2% 100 100 2 de 2 101 180 180 200 * 1 de 2 Pago total Dto. pronto pago Saldo vencido Total * Plazos Doc.  Sel. 101   

---

## Diapositiva 9

La columna de clase de documento muestra el origen de cada línea. Por ejemplo, IN para factura, CN para abono y JE para asiento. 9 PUBLIC Cómo determinar el importe de pago Pago a cuenta 25 185 Saldo pendiente 25 Importe total vencido -98 AC -98 -98 * 1 de 1 204 CN FA FA Tipo doc. -20 -20 -20 * 1 de 1 202 98 2% 100 100 2 de 2 101 180 180 200 * 1 de 2 Pago total Saldo vencido Total * Plazos Doc.  Sel. 101    Dto. pronto pago

---

## Diapositiva 10

Con las Parametrizaciones de formulario, puede elegir mostrar el indicador de número de referencia de IC en la tabla.  Esto le permite basar el pago en el número de factura del proveedor en lugar de en su propio número de documento interno al emitir un pago. Puede elegir que el sistema muestre todas las transacciones en la tabla o limitar la visualización a las facturas y abonos. La parametrización para mostrar una transacción de manera predeterminada se encuentra en las parametrizaciones de documento para pagos efectuados y recibidos. Si desea documentar un pago que no se basa en una factura. Por ejemplo, pago anticipado, seleccione la opción Pago a cuenta. En este ejemplo, el Importe total vencido incluye el pago a cuenta y el importe total de pago de las transacciones abiertas de la tabla. 10 PUBLIC Cómo determinar el importe de pago Pago a cuenta 25 185 Saldo pendiente 25 Importe total vencido -98 AC -98 -98 * 1 de 1 204 CN FA FA Tipo doc. -20 -20 -20 * 1 de 1 202 98 2% 100 100 2 de 2 101 180 180 200 * 1 de 2 Pago total Saldo vencido Total * Plazos Doc.  Sel. 101    Dto. pronto pago

---

## Diapositiva 11

Una vez determinado el importe de pago, se debe especificar el medio de pago. Puede seleccionar uno de los siguientes medios de pago: Cheque, Transferencia bancaria, Tarjeta de crédito o Efecto. En algunos países, también puede utilizar el medio de pago Efecto.  Seleccione el icono Medios de pago para abrir la ventana Medios de pago. En la mayoría de los casos, el pagador paga el importe completo con un solo medio de pago. Sin embargo, es posible distribuirlo en varios medios de pago. El sistema toma los detalles del medio de pago para los pagos recibidos del registro maestro de clientes. Al contabilizar un pago, el sistema reconcilia el pago con las facturas seleccionadas y cierra las transacciones. Si el pago se contabilizó como Pago a cuenta, las facturas y el pago permanecen abiertos. Si se efectuó un pago parcial, el sistema ajusta en consecuencia el saldo vencido. 11 PUBLIC Cómo especificar el medio de pago 1. Determine el importe de pago. 2. Distribuya el importe de pago según el medio de pago. Medios de pago posibles: Verificar Transferencia bancaria Tarjeta de crédito Efectivo * Efecto

---

## Diapositiva 12

Si extrae efectivo de su saldo de caja o cheques del cajón de cheques y los lleva al banco, puede utilizar la transacción Depósito para contabilizar esta transferencia. En este gráfico vemos el proceso de los pagos en efectivo. El pago recibido se coloca en el Debe de la cuenta de deudor y el efectivo en el Haber de una cuenta disponible.  Cuando se realiza el depósito, el depósito de efectivo se acredita y la cuenta bancaria se debita. 12 PUBLIC Saldo de caja 1 2 Banco 2 Efectivo Depósito Cliente 1 FP Factura pendiente Cobro Medio de pago Efectivo Depósitos de efectivo y cheques

---

## Diapositiva 13

Un depósito de cheques es similar. El cobro se coloca en el Debe de la cuenta de deudor y en el Haber los cheques recibidos en la cuenta. Cuando se realiza el depósito, la cuenta de cheques recibidos se acredita y la cuenta bancaria se debita. 13 PUBLIC Depósitos de efectivo y cheques Saldo de caja 1 2 Banco 2 Efectivo Depósito Cheques rec. 1 2 Banco 2 Depósito de cheques Cliente 1 FP Factura pendiente Cobro Medio de pago Efectivo Cliente 1 FP Factura pendiente Cobro Medio de pago Cheque

---

## Diapositiva 14

SAP Business One admite varios escenarios de cancelación de pagos, depósitos y cheques. Por ejemplo:  Si indica un pago o depósito incorrectos,  En las situaciones en las que se cancela un pago, o  En caso de que necesite cancelar un pago o depósito después de que se haya depositado un cheque relacionado con un pago.  Tenga en cuenta que puede cancelar un cheque depositado de un depósito con varios cheques. Para conocer más detalles sobre cómo cancelar pagos, depósitos y cheques consulte la Ayuda en línea. 14 PUBLIC Cancelación de pagos y depósitos Cobro Depósito Cobro Depósito Cuenta bancaria Factura de clientes

---

## Diapositiva 15

Trabajar con pagos es similar a trabajar con cobros, excepto, por supuesto, que se paga dinero en lugar de recibirlo. Al crear un pago:  Hay un Debe en la cuenta de acreedor,  Y se acredita a la cuenta bancaria A diferencia de los cobros, normalmente el proceso de pagos manuales no incluye cuentas temporales ni de compensación para tarjetas de crédito, cheques y transferencias bancarias.  En su lugar, la contabilización en el Haber se realiza directamente en la cuenta bancaria. Si desea utilizar una cuenta temporal o de compensación, se puede insertar manualmente una cuenta provisional en el campo Cuenta de mayor en la ventana Medios de pago. Luego, cuando se resta el pago del banco, se debe especificar una entrada manual para debitar la cuenta provisional y acreditar la cuenta bancaria. Además, se puede utilizar el asistente de pago para generar automáticamente pagos contra una cuenta de compensación si se define una en la ventana Cuentas de banco propio – Configuración. Consulte el curso Asistente de pagos para obtener más información sobre este proceso. Si quiere establecer que el sistema utilice cuentas de compensación automáticamente, puede utilizar el Tratamiento de extracto bancario. Esta funcionalidad puede fijarse para contabilizar automáticamente la transferencia entre las cuentas de compensación y bancarias. 15 PUBLIC Proceso de pago en SAP Business One: Compras Pago: Medio de pago  Verificar  Tarjeta de crédito  Efectivo  Transferencia bancaria Debe Haber Cuenta bancaria 202 Proveedor 202 Pago Cuenta bancaria Factura de proveedor

---

## Diapositiva 16

A continuación, se detallan algunos puntos clave para tener en cuenta: En los cobros los pagos en efectivo, cheque y tarjeta de crédito generalmente se contabilizan en una cuenta de compensación o temporal. Se debe procesar un documento de Depósito para transferir los fondos de la cuenta de compensación a la cuenta de banco propio y compensar dicha cuenta. Cuando un cliente paga mediante Transferencia bancaria, la transacción no implica una cuenta de compensación. El cliente transfiere el pago directamente al banco propio. En un documento de pago, un asterisco (*) después de la fecha de factura indica que la factura está vencida. La fecha de vencimiento de la factura es anterior o equivalente a la fecha actual. 16 PUBLIC Resumen (1/2) A continuación, se detallan algunos puntos clave: En los pagos recibidos, los pagos en efectivo, cheques y tarjeta de crédito normalmente se contabilizan en: • Una cuenta de compensación o temporal. Se debe procesar un documento de Depósito para: • Transferir los fondos desde la cuenta de compensación a la cuenta de banco propio. • y compensar la cuenta de compensación. Cuando un cliente paga mediante el medio de pago Transferencia bancaria: • Este medio de pago no incluye ninguna cuenta de compensación. • El cliente transfiere el pago directamente al banco propio. En un documento de pago, un asterisco (*) después de la fecha de factura indica que: • La factura está vencida. La fecha de vencimiento de la factura es anterior o equivalente a la fecha actual.

---

## Diapositiva 17

En los pagos el proceso generalmente no implica cuentas de compensación o temporales. En su lugar, la contabilización en el Haber se realiza directamente en la cuenta bancaria. Si desea utilizar una cuenta de compensación o temporal en los pagos, puede hacerlo de tres modos. Puede insertar manualmente una cuenta provisional en el campo Cuenta de mayor en la ventana Medio de pago. Puede usar el asistente de pagos para generar pagos automáticamente para una cuenta de compensación. O puede utilizar la funcionalidad Tratamiento de extracto bancario. 17 PUBLIC Resumen (2/2) En los pago, normalmente el proceso no implica: • Una cuenta de compensación o temporal. En su lugar, la contabilización en el Haber se realiza directamente en la cuenta bancaria. Si desea utilizar una cuenta de compensación o temporal en los pagos, deberá: • Insertar manualmente una cuenta provisional en el campo Cuenta de mayor en la ventana Medio de pago. • Utilice el asistente de pago para generar automáticamente pagos contra una cuenta de compensación. • Utilice la funcionalidad Tratamiento de extracto bancario.

---

