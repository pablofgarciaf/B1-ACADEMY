# Transcripción por Diapositiva: 10_FinProcess_31_InternalRecon_InternalRecon_ES

## Diapositiva 1

PUBLIC Proceso financiero: Reconciliación interna SAP Business One Versión 10.0 Bienvenido al tema Reconciliación interna. 1

---

## Diapositiva 2

En este tema, discutiremos cómo utilizar el proceso de reconciliación interna, ambas reconciliaciones, tanto las del sistema como las del usuario, en las cuentas de mayor e interlocutores comerciales. Aprenderá cómo repasar las reconciliaciones del sistema automáticas y semiautomáticas, y cómo realizar reconciliaciones internas manualmente. 2 PUBLIC Al finalizar este tema, podrá:  Utilizar el proceso de reconciliación interna en cuentas de mayor e interlocutores comerciales.  Revisar las reconciliaciones del sistema  Realizar una reconciliación interna (clase manual) Objetivos

---

## Diapositiva 3

3 PUBLIC Agenda Reconciliación interna  Definición de la reconciliación interna Reconciliaciones del sistema Reconciliación completa Reconciliación parcial Reconciliación de usuario Clases de reconciliaciones de usuario Moneda de reconciliación Presentaremos el tema reconciliación interna estudiando el proceso de reconciliación de los datos maestros de un interlocutor comercial.

---

## Diapositiva 4

Imagine que está implementando SAP Business One con un cliente nuevo, OEC Computers. María, la responsable del área de contabilidad de OEC Computers, le hace algunas preguntas más sobre el proceso de reconciliación interno. Recuerda que usted le mencionó anteriormente, que, entre otros procesos, se relaciona con el cierre del período. A María le complace escuchar que la mayoría de las reconciliaciones internas las realiza automáticamente SAP Business One. Estas son las reconciliaciones del sistema. Las reconciliaciones automáticas del sistema pueden ser parciales o totales. 4 PUBLIC Debe Haber Escenario empresarial  Clases de reconciliaciones de usuario:  Proceso de reconciliación interna Debe Haber  Estados de reconciliaciones del sistema:  Estados de reconciliaciones de usuario:

---

## Diapositiva 5

Ofrece a María dos ejemplos de reconciliaciones automáticas totales:  Primero, en las cuentas de datos maestros de interlocutores comerciales, cuando un pago recibido se basa en una factura de clientes (o un abono en una factura de cliente).  Y en segundo lugar, en las cuentas de mayor de compensación, cuando deposita un cheque recibido mediante un pago recibido. Le explica a María que SAP Business One también realiza reconciliaciones del sistema parciales si, por ejemplo, un cliente abona parcialmente una factura de clientes. 5 PUBLIC Debe Haber Escenario empresarial  Estados de reconciliaciones del sistema:  Completa  Parcial  Clases de reconciliaciones de usuario:  Estados de reconciliaciones de usuario:  Proceso de reconciliación interna Debe Haber

---

## Diapositiva 6

No obstante, habrá situaciones en las que la propia María realizará reconciliaciones internas; estas son las reconciliaciones de usuario. Por ejemplo, cuando OEC Computers realice un pago adelantado a un proveedor y reciba la factura de proveedores más tarde, María deberá reconciliar los datos maestros de proveedor de manera interna y conciliar el pago con las operaciones de la factura de proveedores. María puede realizar la reconciliación de usuario mediante una de las tres clases de reconciliación:  Manual  Automática  Semiautomática 6 PUBLIC Debe Haber Escenario empresarial  Estados de reconciliaciones del sistema:  Completa  Parcial  Clases de reconciliaciones de usuario:  Manual  Automática  Semiautomática  Estados de reconciliaciones de usuario:  Proceso de reconciliación interna Debe Haber

---

## Diapositiva 7

Al igual que las reconciliaciones del sistema, las reconciliaciones del usuario pueden ser totales o parciales. 7 PUBLIC Debe Haber Escenario empresarial  Estados de reconciliaciones del sistema:  Completa  Parcial  Clases de reconciliaciones de usuario:  Manual  Automática  Semiautomática  Estados de reconciliaciones de usuario:  Total  Parcial  Proceso de reconciliación interna Debe Haber

---

## Diapositiva 8

Consideremos el caso que acabamos de analizar, en el que OEC Computers paga a un proveedor con antelación y recibe la factura de proveedores más adelante. Cuando María ve el saldo de cuenta del proveedor, este refleja el pago por adelantado y las operaciones de la factura de proveedores. ¿Por qué es entonces importarte que María efectúe una reconciliación interna de los datos maestros de proveedor? 8 PUBLIC Pregunta de reflexión: proceso de reconciliación interna Cuando María ve el saldo de cuenta del proveedor, este refleja el pago por adelantado y las operaciones de la factura de proveedores. ¿Por qué es entonces importarte que María efectúe una reconciliación interna de los datos maestros de proveedor?

---

## Diapositiva 9

El motivo es que si no se realiza la reconciliación, la factura de proveedores aparecerá como pendiente al crear un nuevo pago al proveedor. Otra razón es el efecto en los informes, como los de antigüedad y créditos de dudoso cobro. La factura de proveedores aparecerá como pendiente en esos informes si María no lo reconcilia con la transacción de pago. 9 PUBLIC Pregunta de reflexión: proceso de reconciliación interna  La factura de proveedores debería aparecer como cerrada para:  Pago  Informes de antigüedad y créditos de dudoso cobro Cuando María ve el saldo de cuenta del proveedor, este refleja el pago por adelantado y las operaciones de la factura de proveedores. ¿Por qué es entonces importarte que María efectúe una reconciliación interna de los datos maestros de proveedor?

---

## Diapositiva 10

10 PUBLIC Agenda Reconciliación interna  Definición de la reconciliación interna Reconciliaciones del sistema Reconciliación completa Reconciliación parcial Reconciliación de usuario Clases de reconciliaciones de usuario Moneda de reconciliación Comenzaremos con la reconciliación del sistema que tiene lugar durante el trabajo diario.

---

## Diapositiva 11

El término reconciliación interna hace referencia a la confrontación y compensación de posiciones abiertas del Haber con posiciones abiertas del Debe en una cuenta (por lo tanto, son internas). Esto es necesario para las cuentas en donde un proceso empresarial no se considera completo hasta que cada importe del Haber tiene un importe del Debe correspondiente:  En el caso de las cuentas de clientes, un crédito (Debe) debe ir seguido de un cobro (Haber).  En las cuentas de proveedores, un pasivo (Haber) debe ir seguido de un pago (Debe). 11 PUBLIC Definición de la reconciliación interna Reconciliación interna: Conciliación y compensación posiciones abiertas del Haber con posiciones abiertas del Debe en una cuenta. Debe Haber Debe Haber

---

## Diapositiva 12

En primer lugar, hablemos sobre la reconciliación del sistema. La reconciliación del sistema se realiza automáticamente. Analicemos algunos ejemplos: Al aplicar un pago a una factura, crear un abono para una factura o cancelar un documento, el asiento original se reconcilia con la anulación. Al depositar un cheque, el asiento de pago se reconcilia con los depósitos de la línea en la cuenta de compensación. Esto significa mayoritariamente, que no debe mantener ni conducir reconciliaciones internas en el sistema. Como dijimos anteriormente, el sistema puede reconciliar las transacciones ya sea total o parcialmente. Veremos ambos. 12 PUBLIC Reconciliaciones del sistema Debe Haber Estados de reconciliaciones del sistema: – Completa – Parcial Debe Haber

---

## Diapositiva 13

El sistema intentará realizar automáticamente la reconciliación completa al contabilizar un pago a un cliente o proveedor. El sistema asocia la línea empresarial en el asiento del pago con la factura o facturas que seleccionó y cierra las transacciones. También cerrará los abonos seleccionados y otras transacciones que se seleccionaron en el pago. En el gráfico mostramos cómo la reconciliación completa del sistema tiene lugar sin un pago a un proveedor.  A la izquierda mostramos la factura del proveedor con su asiento. A la derecha vemos el pago de la factura.  Cuando la factura está pagada, el sistema automáticamente realiza la reconciliación interna en el registro maestro del proveedor. En este ejemplo, mostramos solo una factura, pero el pago podría haberse efectuado para 2 o más facturas y la reconciliación automática se habría realizado de todas maneras. Con respecto a los pagos realizados con el asistente de pago o el tratamiento de extracto bancario, el sistema propone automáticamente (y, algunas veces, asocia automáticamente) pagos con facturas o abonos en función de los criterios que se faciliten, como la fecha de vencimiento o el importe. 13 PUBLIC Reconciliación del sistema: reconciliación completa Pago basado en una factura (o facturas) de proveedor Debe Haber Cuenta bancaria 202 Proveedor 202 Factura de proveedor Debe Haber Proveedor 202 Cuenta de compensación/ gastos 202 Reconciliación interna automática en los datos maestros de proveedor 1 2 2

---

## Diapositiva 14

También es posible reconciliar las transacciones de manera parcial al emitir los pagos y cobros. La reconciliación parcial se realiza cuando el monto de un pago no corresponde con el monto de las transacciones seleccionadas. Por ejemplo, un cliente puede realizar el pago de un monto parcial a pagar.  Cuando se realiza un pago parcial, el sistema ajusta el saldo vencido apropiadamente y reconcilia parcialmente la factura. Cuando se pague el saldo restante de la factura, la factura se reconciliará por completo y el saldo vencido será cero. 14 PUBLIC Reconciliación del sistema - Reconciliación parcial Debe Haber Cuenta bancaria 100 Proveedor 100 Debe Haber Proveedor 202 Cuenta de compensación/ gastos 202 Saldo vencido: Haber = 102 2 Saldo vencido en el informe de antigüedad de deudas del proveedor Pago basado en una factura (o facturas) de proveedor Factura de proveedor Reconciliación interna automática en los datos maestros de proveedor 1 2

---

## Diapositiva 15

SAP Business One automáticamente reconcilia las siguientes cuentas provisionales:  Cuenta de asignación, Cuenta de compensación de gastos y Cuenta de stock en tránsito.  El trabajo en el tratamiento de cuenta de inventario.  En algunas localizaciones, la Cuenta de impuestos diferidos (relevante para: Austria, Costa Rica, España, Francia, Guatemala, Italia, México y Sudáfrica)  La Cuenta interina de anticipo y la Cuenta de compensación de anticipo. Veamos el ejemplo de cuenta de compensación: Si la empresa utiliza el sistema de inventario permanente, normalmente se reconcilia la cuenta de compensación. Recuerde que una cuenta de compensación se acredita cuando se emite un pedido de entrada de mercancías y se debita en una factura de proveedores. El sistema realiza esta reconciliación en esta cuenta provisional. 15 PUBLIC Reconciliación del sistema de cuentas provisionales Factura de proveedor Pedido de EM Cuenta de compensación Acreditado Debitado

---

## Diapositiva 16

16 PUBLIC Agenda Reconciliación interna  Definición de la reconciliación interna Reconciliaciones del sistema Reconciliación completa Reconciliación parcial Reconciliación de usuario Clases de reconciliaciones de usuario Moneda de reconciliación A continuación, veamos cómo puede el usuario gestionar el proceso de reconciliación.

---

## Diapositiva 17

Veamos las circunstancias en las que podría realizar una reconciliación de usuario: Un cliente le paga, pero se olvida de seleccionar la factura al procesar el pago.  En ese caso, se realiza un pago en la cuenta y no en una factura en particular. Si el pago se contabilizó como pago a cuenta porque no se seleccionaron facturas, el pago y las facturas estarán pendientes (y por lo tanto, sin reconciliar). Otro ejemplo del pago a cuenta puede ser cuando existe un acuerdo con un cliente para pagar un importe fijo mensual independientemente de los montos actuales de la factura. Nuevamente, al no seleccionar facturas, no se reconcilian. En estos casos, debe reconciliar la cuenta de interlocutor comercial con la función Reconciliación como reconciliación de usuario. Para realizar una reconciliación interna para un interlocutor comercial, seleccione la opción Reconciliación en el área Reconciliación interna del módulo Interlocutores comerciales. También puede realizar la reconciliación de usuario en una cuenta de mayor. Por ejemplo, en escenarios especiales de saldos pendientes y cuando se trabaja con cuentas diferidas. La ventana Reconciliación para las cuentas de mayor se encuentra en el área Reconciliación interna en el módulo Finanzas. 17 PUBLIC Seleccionada Origen Fe. contabilización Importe Saldo vencido Importe a reconciliar FA 10,07 1000,00 1000,00 1000,00 FA 17,08 2000,00 2000,00 1500,00 RC 24,08 (1000,00) (1000,00) (1000,00) RC 24,08 (1500,00) (1500,00) (1500,00) FA 01,09 3000,00 3000,00 Reconciliación de usuario: clase manual Cuenta de interlocutor comercial      En este ejemplo, datos maestros de cliente Reconciliación interna manual en los datos maestros de cliente 0,00

---

## Diapositiva 18

Puede realizar la reconciliación de usuario mediante una de las tres clases de reconciliación: Manual, automática y semiautomática La reconciliación manual es útil si trabaja con pocas transacciones o casos en los que las reconciliaciones parciales lo requieren o donde las transacciones se contabilizan para más de un interlocutor comercial. La reconciliación automática se usa para reconciliar una gran cantidad de transacciones, o una gama de interlocutores comerciales, basada en las prioridades y los parámetros definidos por el usuario. La reconciliación semiautomática se usa para reconciliar manualmente transacciones basadas en recomendaciones proporcionadas por SAP Business One. La opción múltiples BP aparece solo cuando se selecciona la clase reconciliación manual. Esta opción permite que se reconcilien las transacciones de más de un interlocutor comercial. Por ejemplo, en algunas localizaciones, si un determinado interlocutor comercial es cliente y proveedor a la vez y, por tanto, tiene dos registros maestros de interlocutor comercial, las transacciones creadas se pueden reconciliar con ambos registros de datos maestros de interlocutor comercial. 18 PUBLIC Debe Haber Clases de reconciliaciones de usuario  Clases de reconciliaciones de usuario:  Manual  Automática  Semiautomática Debe Haber

---

## Diapositiva 19

19 PUBLIC Reconciliación de varios interlocutores comerciales Un interlocutor comercial conectado Es posible reconciliar varios interlocutores comerciales entre sí. Uno de los escenarios comunes de la reconciliación de varios interlocutores comerciales se produce entre un cliente y un proveedor conectados. En este escenario, hay un proveedor que también es un cliente de la empresa. En este caso, la empresa desea hacer igualar la deuda del proveedor con el saldo pendiente del cliente. Cuando selecciona la casilla de selección Considerar IC conectados y selecciona el interlocutor comercial, el sistema añade automáticamente el interlocutor comercial conectado a la ventana de criterios de selección. En la imagen, puede ver la ventana Reconciliación interna de IC - Criterios de selección y que la casilla de selección considerar IC conectados está marcada. En la tabla, se seleccionan los registros de Maxi Teq, el cliente, y Maxi Teq, el proveedor. Una vez seleccione Reconciliar, se visualizarán las facturas de clientes y las facturas de proveedores pendientes. Ahora es posible compensar el saldo vencido de las facturas de proveedores desde las facturas de cliente. Consulte el tema Clientes y grupos de clientes para aprender a conectar un cliente con un proveedor. Tenga en cuenta que también puede reconciliar varios interlocutores comerciales que no están conectados. Seleccione los interlocutores comerciales relevantes en la tabla de la ventana de criterios de selección. 19

---

## Diapositiva 20

20 PUBLIC Reconciliación de varios interlocutores comerciales – Asiento Ninguna reconciliación entre dos o más interlocutores comerciales (conectados y no conectados) genera un asiento automático. El asiento compensa el registro de los interlocutores comerciales. La imagen muestra el asiento que se creó cuando la factura de clientes se reconcilió con la factura de proveedores. Este es un ejemplo sencillo en el que los importes reconciliados son iguales. Se efectúa un abono al cliente y un cargo al proveedor. 20

---

## Diapositiva 21

Una reconciliación interna se realiza en una moneda: la moneda de la cuenta. Esto es relevante tanto para la reconciliación de usuario como para la de sistema, y para las cuentas de interlocutor comercial y de mayor. Si la moneda del interlocutor comercial especificado se fija en moneda local o todas las monedas, la moneda de reconciliación será la moneda local. Si una de las monedas extranjeras se especificó para el interlocutor comercial, la moneda de reconciliación es esta moneda extranjera. En el ejemplo presentado la moneda local de la empresa es Libra esterlina y Maxi-Teq es un cliente local que tiene Libra esterlina definida como moneda de interlocutor comercial. Por lo tanto, la moneda de reconciliación es la moneda local, que es libra esterlina. 21 PUBLIC Moneda de reconciliación Moneda IC

---

## Diapositiva 22

22 PUBLIC Transacciones de saldo en reconciliación interna Una diferencia en la moneda local cuando hay implicada una moneda extranjera Durante la reconciliación, el sistema verifica: Una diferencia en la moneda del sistema cuando la moneda local de la empresa es distinta a la moneda del sistema El sistema crea de forma automática: Un asiento de la diferencia en tipo de cambio (en ML y MS) Un asiento de la diferencia de conversión (solo en MS) Existen dos clases de transacciones de saldo:  Diferencia de tipo de cambio – Este asiento se crea automáticamente al reconciliar las transacciones en una moneda extranjera, donde el importe en moneda local se diferencia entre las transacciones reconciliadas, debido a los diferentes tipos de cambio de la moneda extranjera. Por ejemplo: se envíaun pago un mes después de la creación de la factura.  Diferencia del tipo de conversión: Este asiento se crea automáticamente cuando la moneda del sistema es diferente de la moneda local y la moneda del sistema difiere entre las operaciones reconciliadas. 22

---

## Diapositiva 23

El sistema asigna un número de reconciliación único a cada reconciliación de usuario interno completa (ya sea manual, automática o semiautomática). También graba y asigna un número único a las reconciliaciones del sistema, por ejemplo, las reconciliaciones efectuadas durante el procesamiento de pagos. 23 PUBLIC Identificadores únicos  Identificador único para reconciliaciones internas:  Reconciliaciones de usuario: Manual, automática o semiautomática  Reconciliaciones del sistema Debe Haber Debe Haber

---

## Diapositiva 24

La función Gestionar reconciliaciones anteriores permite revisar o cancelar una reconciliación de usuario. Esta función no permite anular contabilizaciones de reconciliación. Las contabilizaciones siguen existiendo, aunque se cancele la reconciliación. Si desea anular estas contabilizaciones, deberá anularlas en el libro mayor de la forma habitual seleccionando Datos Cancelar en la visualización del asiento. Para cancelar reconciliaciones de usuario para interlocutores comerciales o cuentas de mayor, seleccione la opción Gestionar reconciliaciones anteriores en el área Reconciliaciones internas del módulo Interlocutores comerciales o Finanzas. 24 PUBLIC Gestión de reconciliaciones anteriores Cuenta 2000 5000 3000 2000 Cancelar reconciliación de usuario Cuenta 2000 5000 3000 2000

---

## Diapositiva 25

25 PUBLIC Resumen (1/2) A continuación, se detallan algunos puntos clave: El término Reconciliación interna, hace referencia a: • La conciliación y compensación de las partidas abiertas del Haber con las partidas abiertas del Debe de una cuenta (por lo tanto, internas). Para cuentas de proveedor: • Una deuda (Haber) se reconcilia con un pago (Debe). La reconciliación interna puede ser: • Reconciliación del sistema • Reconciliaciones de usuario Ambos estados, la reconciliación del sistema y la reconciliación de usuario son: • Total • Parcial Clases de reconciliaciones de usuario: • Manual (con la opción Múltiples IC) • Automática • Semiautomática  A continuación, se detallan algunos puntos clave para tener en cuenta:  El término reconciliación interna hace referencia a la confrontación y compensación interna de posiciones abiertas del Haber con posiciones abiertas del Debe en una cuenta.  En las cuentas de proveedor, una deuda (Haber) se reconcilia con un pago (Debe).  En el caso de las cuentas de clientes, un crédito (Debe) debe ir seguido de un pago recibido (Haber).  La reconciliación interna puede ser reconciliación del sistema o reconciliación de usuario.  Existen dos estatus tanto para la reconciliación del sistema como para la reconciliación de usuario: completa y parcial  Existen tres tipos de reconciliación de usuario: manual, automática y semiautomática.  El tipo manual incluye una opción para reconciliar múltiples interlocutores comerciales entre sí. 25

---

## Diapositiva 26

26 PUBLIC Resumen (2/2) Una reconciliación interna se realiza en una moneda: • Moneda local (IC/Cuenta = moneda local o todas las monedas) • Moneda extranjera (IC/Cuenta = Moneda extranjera) SAP Business One puede gestionar la contabilidad en dos monedas paralelas: • En la moneda local • y en la moneda de sistema. Todas las reconciliaciones internas (de sistema y de usuario) deben saldarse: • En la moneda local • y en la moneda de sistema. El sistema asigna un único número de reconciliación a cada reconciliación interna tanto para: • Reconciliación del sistema • Reconciliaciones de usuario La función Gestionar reconciliaciones anteriores permite: • Revisar o cancelar una reconciliación de usuario.  Una reconciliación interna se realiza en una moneda. La moneda puede ser la moneda local o una moneda extranjera. La moneda local se usa si la cuenta de interlocutor comercial se fijó en moneda local o en todas las monedas. Si el interlocutor comercial se fija en una moneda extranjera, entonces esa moneda se usará para la reconciliación.  SAP Business One puede gestionar la contabilidad en dos monedas paralelas: la moneda local y la moneda del sistema.  Todas las reconciliaciones internas, sean del sistema o de usuario, deben saldarse en la moneda local y en la moneda del sistema.  El sistema asigna un único número de reconciliación a cada reconciliación interna tanto para las reconciliaciones del sistema como para las reconciliaciones de usuario.  La función Gestionar reconciliaciones anteriores permite revisar o cancelar una reconciliación de usuario. 26

---

