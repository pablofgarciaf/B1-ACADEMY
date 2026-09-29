# Transcripción por Diapositiva: 10_BankProcess_21_BankReconcile_Overview_ES

## Diapositiva 1

PUBLIC Proceso de gestión de bancos: Reconciliación de cuenta bancaria SAP Business One Versión 10.0 Bienvenido al tema Reconciliación de cuenta bancaria: Resumen. 1

---

## Diapositiva 2

2 PUBLIC Objetivos Al finalizar esta unidad, podrá: Explicar las opciones para la reconciliación externa de una cuenta bancaria de mayor.  En este tema, trataremos las opciones para la reconciliación externa de una cuenta bancaria de mayor.  Nota: un requisito previo obligatorio para este tema es tener un buen conocimiento de los procesos financieros de SAP Business One y los principios contables generalmente aceptados.

---

## Diapositiva 3

3 PUBLIC Gestión de reconciliaciones en la cuenta bancaria: Ejemplo empresarial Una vez a la semana, María, la contable de OEC Computers, recibe un extracto de cuenta del banco. María le pregunta cuál es la manera más eficaz de registrar este extracto de cuenta en SAP Business One. Y cómo conciliar las operaciones que el banco ha registrado para OEC Computers con la operación que ella ha registrado para la cuenta de mayor bancaria en SAP Business One. Debe tener en cuenta que OEC Computers emite y recibe pagos utilizando todos los medios de pago (depósitos de cheques y efectivo, cheques para pagos y transferencias bancarias).  Aquí presentamos un ejemplo empresarial:  Una vez a la semana, María, la contable de OEC Computers, recibe un extracto de cuenta del banco.  María le pregunta cuál es la manera más eficaz de registrar este extracto de cuenta en SAP Business One.  Y cómo conciliar las operaciones que el banco ha registrado para OEC Computers con la operación que ella ha registrado para la cuenta de mayor bancaria en SAP Business One.  Debe tener en cuenta que OEC Computers emite y recibe pagos utilizando todos los medios de pago (depósitos de cheques y efectivo, cheques para pagos y transferencias bancarias).

---

## Diapositiva 4

4 PUBLIC Proceso de pago en SAP Business One – Reconciliación de cuenta bancaria Extracto de cuenta Cuenta de banco propio en SAP Business One Proceso de cobros Pagos Reconciliación bancaria = Reconciliación externa • Conciliar las operaciones bancarias de banco propio con el extracto de cuenta. • Comparar una cuenta con datos externos.  Los cobros, los pagos y los depósitos contabilizan asientos en la cuenta de banco propio.  El extracto de cuenta sirve de instrumento de notificación legalmente vinculante entre el banco y sus clientes.  Debe conciliar las operaciones de banco propio registradas en la cuenta bancaria en SAP Business One con los datos del extracto de cuenta y realizar los ajustes necesarios.  Estas partidas abiertas no se deben conciliar hasta que se recibe el extracto bancario que muestra que el banco ha efectuado realmente el pago.  Este proceso de conciliación se denomina Reconciliación bancaria, donde se compara una cuenta con datos externos.  En SAP Business One este proceso se denomina Reconciliación externa.  Las reconciliaciones bancarias permiten a los empresarios asegurarse de que todas las operaciones bancarias se registren correctamente en el libro de contabilidad y el extracto de cuenta.

---

## Diapositiva 5

5 PUBLIC Reconciliaciones externas 2000 3000 Debe Haber 2000 3000 Cuenta de banco propio Extracto de cuenta externo Una vez que se concilian estas partidas abiertas de la cuenta de mayor del banco propio en SAP Business One con las partidas abiertas del extracto de cuenta externo, SAP Business One marca estas operaciones como reconciliadas externamente.  Cuando se efectúa una reconciliación externa, se concilian las partidas abiertas de una cuenta de mayor bancaria en SAP Business One con las partidas abiertas de un extracto de cuenta externo.  Una vez hecho esto, SAP Business One marca estas operaciones como reconciliadas externamente.  En la mayoría de los casos, el extracto de cuenta se recibe de un banco y la cuenta que se debe reconciliar es la cuenta bancaria asociada. El extracto, sin embargo, también puede recibirse de un interlocutor comercial que desea reconciliar la cuenta de interlocutor comercial de sus libros con su propia cuenta.  En SAP Business One también existe el proceso de reconciliación interna, que es diferente del proceso de reconciliación externa.

---

## Diapositiva 6

 El término reconciliación interna hace referencia a la confrontación y compensación de posiciones abiertas del Haber con posiciones abiertas del Debe en una cuenta (por lo tanto, son internas). Esto es necesario para las cuentas en donde un proceso empresarial no se considera completo hasta que cada importe del Haber tiene un importe del Debe correspondiente: En el caso de las cuentas de clientes, un crédito (Debe) debe ir seguido de un cobro (Haber). En las cuentas de proveedores, un pasivo (Haber) debe ir seguido de un pago (Debe). Cuando se utiliza una cuenta bancaria provisional, un pago a un proveedor realizado por el asistente de pago (Debe) debe ir seguido de una contabilización de transferencia a la cuenta bancaria de mayor (Haber).  En este tema trataremos el proceso de reconciliación externa. 6 PUBLIC Debe Haber Reconciliación interna:  Conciliación y compensación  Partidas abiertas del Haber  Con partidas abiertas del Debe  En una cuenta. Definición de la reconciliación interna Debe Haber

---

## Diapositiva 7

7 PUBLIC Reconciliaciones externas 3 opciones para la reconciliación externa:  Reconciliación  Reconciliación manual  Tratamiento de extracto bancario *La decisión sobre qué opción se utilizará para efectuar reconciliaciones externas depende de la localización de la empresa. 2000 3000 Debe Haber 2000 3000 Cuenta de banco propio Extracto de cuenta externo  En SAP Business One dispone de tres opciones para realizar una reconciliación externa: Reconciliación, Reconciliación manual y el Tratamiento de extracto bancario.  Observe que estos son los nombres de las ventanas de SAP Business One.  Para evitar que se creen reconciliaciones duplicadas, el usuario debe seleccionar una opción y utilizarla para efectuar las reconciliaciones externas.  Esta decisión depende de la localización de la empresa.  Vamos a revisar estas tres opciones.

---

## Diapositiva 8

8 PUBLIC 1. Reconciliación  Manual  Automática  Semiautomática Cuenta de mayor Cuenta de banco propio Transacciones abiertas     Extracto de cuenta externo Importar/Escribir manualmente Transacciones     * Admitido en todas las localizaciones.  La primera opción en SAP Business One se denomina Reconciliación. Se admite en todas las localizaciones.  Con esta opción, primero importa, o escribe manualmente, las operaciones de extracto de cuenta en el sistema utilizando la función de Tratar extracto de cuenta externo (de ser necesario, puede añadir esta ventana mediante Parametrizaciones de formulario – Menú principal).  A continuación, el sistema muestra, una al lado de otra, las operaciones abiertas de la cuenta de mayor en SAP Business One y la operación que se ha importado o indicado del extracto de cuenta. Debe reconciliar las operaciones coincidentes del lado de SAP Business One y del lado del banco. Si es necesario, puede realizar operaciones de ajuste para conciliar sus datos con los del banco.  Puede seleccionar una clase de reconciliación: Manual, Automática o Semiautomática. Funcionan de forma muy parecida a las clases de reconciliación interna.  Para utilizar la Reconciliación, seleccione el acceso vía menús: Gestión de bancos Extractos de cuenta y reconciliaciones externas Reconciliación.

---

## Diapositiva 9

 La segunda opción es Reconciliación manual. Se admite en Australia, Brasil, Canadá, China, Chipre, India, Japón, Corea, Nueva Zelanda, Singapur, Sudáfrica, Reino Unido y Estados Unidos.  Con esta opción, se indica la fecha y el saldo final del extracto de cuenta recibido del banco. El sistema muestra las operaciones abiertas para la cuenta de mayor bancaria. Se deben conciliar manualmente con el balance recibido del banco.  Esta función permite verificar y reconciliar las operaciones registradas en SAP Business One con el saldo recibido del banco, y crear ajustes si es necesario.  El sistema rastrea la diferencia entre el saldo final del extracto y las partidas compensadas de la cuenta de mayor. El sistema solo permite reconciliar la cuenta cuando la diferencia es 0.  Desde la pantalla de reconciliación manual, puede crear ajustes para cerrar las discrepancias y reducir la diferencia a 0. Por ejemplo, puede depositar los pagos en efectivo, con cheque y con tarjeta de crédito que aparecen en el extracto de cuenta. También puede contabilizar asientos o crear pagos. El sistema realiza un seguimiento del saldo del extracto para la siguiente reconciliación. Para utilizar la Reconciliación manual, seleccione Gestión de bancos Extractos de cuenta y reconciliaciones externas Reconciliación manual. 9 PUBLIC 2. Reconciliación manual * Localizaciones admitidas: Australia, Brasil, Canadá, China, Chipre, India, Japón, Corea, Nueva Zelanda, Singapur, Sudáfrica, Reino Unido y Estados Unidos. Saldo final     Cuenta de mayor Cuenta de banco propio Extracto de cuenta externo Importar/Escribir manualmente Transacciones abiertas

---

## Diapositiva 10

 La última opción es Tratamiento de extracto bancario (TEB). Esta opción automatiza el procesamiento y reconciliación de las operaciones de un extracto de cuenta.  Está diseñada para las empresas que utilizan muy a menudo la transferencia bancaria directa para los pagos recibidos y efectuados.  Puesto que la mayoría de los clientes pagan por transferencia bancaria directa, el contable de la empresa no tiene conocimiento de un pago recibido hasta que importa el fichero bancario. La función de tratamiento de extracto bancario permite generar automáticamente pagos recibidos y efectuados, y realizar reconciliaciones internas y externas. Indicando los detalles del extracto de cuenta, ya sea manual o automáticamente, puede crear operaciones que todavía no se han contabilizado. Este proceso se admite en todas las localizaciones. La clave de la eficacia de la funcionalidad TEB es la configuración: Cabe destacar que la automatización del tratamiento de extracto bancario está directamente relacionada con la precisión de las parametrizaciones según su relevancia para la empresa. 10 PUBLIC 3. Tratamiento de extracto bancario – TEB Transacciones abiertas     Transacciones      Automatiza la gestión de las operaciones de extracto de cuenta.  Diseñada para las empresas que utilizan muy a menudo la transferencia bancaria directa para los cobros y pagos. * Admitido en todas las localizaciones. Cuenta de mayor Cuenta de banco propio Extracto de cuenta externo Importar/Escribir manualmente

---

## Diapositiva 11

 María, la contable de OEC Computers emite una transferencia bancaria de 500 para pagar una factura de proveedores de uno de los proveedores de la empresa.  Deben llevarse a cabo dos tipos de reconciliación para este pago. ¿Cuáles son esas reconciliaciones? 11 PUBLIC Reconciliación: Pregunta de reflexión  María, la contable de OEC Computers emite una transferencia bancaria de 500 para pagar una factura de proveedores de uno de los proveedores de la empresa.  Deben llevarse a cabo dos clases de reconciliación para este pago. ¿Cuáles son esas reconciliaciones? Pago = 500

---

## Diapositiva 12

 Reconciliación interna para que el registro de datos maestros de proveedor coincida con el importe del pago (Debe) y el importe de la factura de proveedores (Haber).  Reconciliación externa para conciliar la operación de pago registrada en la cuenta bancaria en SAP Business One con los datos del extracto de cuenta que María recibirá del banco. 12 PUBLIC Reconciliación: Respuesta  Reconciliación interna - para que el registro de datos maestros de proveedor coincida con el importe del pago (Debe) y el importe de la factura de proveedores (Haber).  Reconciliación externa - para conciliar la operación de pago registrada en la cuenta bancaria en SAP Business One con los datos del extracto de cuenta que María recibirá del banco.

---

## Diapositiva 13

13 PUBLIC Resumen - 1 A continuación, se detallan algunos puntos clave:  Debe conciliar las operaciones de banco propio registradas en la cuenta bancaria en SAP Business One con los datos del extracto de cuenta que ha recibido del banco y realizar los ajustes necesarios.  Este proceso de conciliación se denomina Reconciliación bancaria, donde se compara una cuenta con datos externos.  En SAP Business One este proceso se denomina Reconciliación externa.  Una vez hecho esto, SAP Business One marca estas operaciones como reconciliadas externamente.  A continuación, se detallan algunos puntos clave:  Debe conciliar las operaciones de banco propio registradas en la cuenta bancaria en SAP Business One con los datos del extracto de cuenta que ha recibido del banco y realizar los ajustes necesarios.  Este proceso de conciliación se denomina Reconciliación bancaria, donde se compara una cuenta con datos externos.  En SAP Business One este proceso se denomina Reconciliación externa.  Una vez hecho esto, SAP Business One marca estas operaciones como reconciliadas externamente. 13

---

## Diapositiva 14

14 PUBLIC Resumen – 2  En SAP Business One dispone de tres opciones para realizar una reconciliación externa:  Reconciliación  Reconciliación manual  Tratamiento de extracto bancario (TEB)  Para evitar que se creen reconciliaciones duplicadas, el usuario debe seleccionar una opción y utilizarla para efectuar las reconciliaciones externas.  En SAP Business One dispone de tres opciones para realizar una reconciliación externa:  Reconciliación  Reconciliación manual  Y Tratamiento de extracto bancario (TEB)  Para evitar que se creen reconciliaciones duplicadas, el usuario debe seleccionar una opción y utilizarla para efectuar las reconciliaciones externas. 14

---

