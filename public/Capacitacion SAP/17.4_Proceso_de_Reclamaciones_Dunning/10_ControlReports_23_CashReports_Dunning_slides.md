# Transcripción por Diapositiva: 10_ControlReports_23_CashReports_Dunning

## Diapositiva 1

PUBLIC Informes de control: Cartas de reclamación SAP Business One Versión 10.0 Bienvenido al tema Cartas de reclamación. 1

---

## Diapositiva 2

Al finalizar este tema, podrá:  Ejecutar el Asistente de reclamación para generar cartas de reclamación. 2 PUBLIC Al finalizar este tema, podrá:  Ejecutar el Asistente de reclamación para generar cartas de reclamación. Objetivos

---

## Diapositiva 3

 María le comenta que controlar el estado de los créditos de clientes y minimizar los retrasos de pago es crucial.  Le presentan el proceso de reclamación que permite enviar recordatorios y cartas de advertencia para facturas de clientes pendientes. 3 PUBLIC Escenario empresarial  María le comenta que controlar el estado de los créditos de clientes y minimizar los retrasos de pago es crucial.  Le presenta el proceso de reclamación que permite enviar recordatorios y cartas de advertencia para facturas de clientes pendientes.

---

## Diapositiva 4

¿Qué acciones proactivas puede llevar a cabo OEC Computers para mejorar los resultados del flujo de caja? ¿Qué opciones tiene una empresa para garantizar pagos oportunos? ¿Cómo se pueden evitar las “deudas incobrables”? 4 PUBLIC  ¿Qué acciones proactivas puede llevar a cabo OEC Computers para mejorar el flujo de caja de la empresa?  ¿Qué opciones tiene una empresa para garantizar pagos oportunos?  ¿Cómo se pueden evitar las “deudas incobrables”? Pregunta de reflexión

---

## Diapositiva 5

Para mejorar un flujo de caja positivo, el primer paso será enviar balances de deudores para las deudas pendientes. Estos balances se pueden imprimir desde el informe de antigüedad. Una vez que las deudas del cliente estén vencidas, el siguiente nivel de cobro de deudas sería cargar al cliente las tasas de interés y reclamación. La empresa debe activar un proceso de cobro de varios niveles, mediante el teléfono, correo electrónico o recordatorios por teléfono o impresos, para el cliente negligente. Esto se realiza mediante el proceso de reclamación. 5 PUBLIC Respuesta: Cartas de reclamación  Una herramienta complementaria para mejorar un flujo de caja positivo será: enviar saldos de deudores para las deudas pendientes y cobrar al cliente las tasas de intereses y reclamación para los pagos con retraso.

---

## Diapositiva 6

SAP Business One ofrece un asistente de reclamaciones para generar cartas de reclamación. El asistente de reclamaciones permite crear y enviar cartas a los clientes que no han pagado sus facturas pendientes en un determinado período y les recuerda que tienen pagos vencidos. Vaya a Clientes de ventas Asistente de reclamaciones. El asistente de reclamaciones se ejecuta en todos los clientes, verifica todas las facturas de clientes pendientes y las transacciones que representan deudas, y permite imprimir y enviar cartas de reclamación de diferentes niveles de gravedad.  Además, durante la ejecución del asistente de reclamaciones se crean automáticamente facturas de servicio para tasas de interés y reclamación.  De este modo, las tasas y los intereses de la reclamación se reflejan en el saldo de cuenta del interlocutor comercial.  Para ello necesita configurar el sistema de reclamaciones. 6 PUBLIC Asistente de reclamaciones

---

## Diapositiva 7

Para configurar el sistema de reclamaciones, vaya al módulo Gestión. En el menú Configuración seleccione el submenú Interlocutores comerciales y, a continuación, la opción Condiciones de reclamación. En cada condición de reclamación, puede definir varios niveles de cartas de reclamación. Esta definición fijará la creación automática de cartas de reclamación. Para cada nivel, puede definir cuándo se debe enviar la carta, cuanto se debe cobrar por cada carta y si cobrar interés o no. Una mejor práctica sería hacer que cada nivel fuera más severo. Vamos a examinar el ejemplo que se muestra en la imagen: • En la primera carta de reclamación, el campo Efectivo después de indica el valor 30. Esto significa que 30 días después de la fecha de vencimiento de la factura pendiente, la carta de reclamación 01 se recomendará para enviar. • La carta de reclamación 02 se entregará 10 días después de que se haya enviado la carta de reclamación 01. • La carta de reclamación 03 se entregará 10 días después de que se haya enviado la carta de reclamación 02. • También puede ver que cada carta le facturará al cliente una tasa de 5, más un importe de intereses. 7 PUBLIC Configuración del sistema de reclamaciones (1/3)

---

## Diapositiva 8

Cuando se selecciona al menos una opción de interés en uno de los niveles, la sección % intereses bancarios aparece en la parte inferior con los campos relevantes que se deben definir. En el campo Tipo de interés anual defina el tipo que se utilizará en los cálculos de la carta de reclamación. En el campo Contabilización automática, especifique si se contabilizará automáticamente el interés y la tasa, o solo el interés, o solo la tasa cuando se cree una carta de reclamación para un cliente. Si desea contabilizar automáticamente el interés o la tasa, se crea una factura de servicio en la ejecución de reclamación que contabiliza el interés y la tasa. Para habilitarlo, deben especificarse las cuentas para contabilizar el interés y la tasa. Las cuentas predeterminadas se toman de la determinación de cuentas de mayor. Sin embargo, puede modificar esta parametrización si selecciona el icono Navegar y especifica diferentes cuentas. También puede seleccionar no contabilizar ningún interés o tasa. Puede tratar las cartas de reclamación por defecto en el Gestor de informes y de layout que se encuentra en el área Definición general del módulo Gestión. 8 PUBLIC Configuración del sistema de reclamaciones (2/3)

---

## Diapositiva 9

Se debe asignar una condición de reclamación a cada cliente. Se puede configurar una condición de reclamación por defecto para los nuevos clientes en la ficha IC en las Parametrizaciones generales. La condición de reclamación aparecerá en el registro de datos maestros de deudores en la ficha Condiciones de pago. Una vez que se selecciona una condición de reclamación para el interlocutor comercial, aparece el campo Contabilización automática. El valor en este campo se toma de la definición de la ventana Condiciones de reclamación – Definición, pero se puede modificar para cada cliente. Ahora puede ejecutar el Asistente de reclamaciones para visualizar los clientes con retraso y enviar avisos de reclamación, así como facturas de servicio para las tasas de interés y reclamación. Tras ejecutar el Asistente de reclamaciones, también puede realizar un seguimiento del último nivel de cartas de reclamación en la ficha Contabilidad de los datos maestros. 9 PUBLIC Configuración del sistema de reclamaciones (3/3)

---

## Diapositiva 10

10 PUBLIC Proveedores conectados en el asistente de reclamaciones Marcar esta casilla al seleccionar los clientes en el asistente SAP Business One puede visualizar las operaciones abiertas de los proveedores conectados en el informe de recomendación del asistente de reclamaciones. Cuando María, la responsable del área de contabilidad, ejecuta el asistente de reclamaciones, también tiene en cuenta las deudas de OEC Computers con proveedores conectados antes de enviar cartas de reclamación. Vea la imagen. Este es un informe de recomendación para el interlocutor comercial Maxi Teq, que es cliente y proveedor de OEC Computers. Los datos maestros de cliente y proveedor están conectados. Por lo tanto, el informe de recomendación también muestra las operaciones abiertas del proveedor Maxi Teq. Tenga en cuenta que para transacciones de visualización de proveedores conectados, debe verificar la casilla Considerar los proveedores conectados mientras se ejecuta el asistente. Tenga en cuenta también que el saldo pendiente de los proveedores y el saldo pendiente de los clientes se visualiza por separado y, por lo tanto, no afecta a ningún cálculo de reclamación del cliente o al contenido de las cartas. Para obtener más información sobre los interlocutores comerciales conectados, consulte el tema Clientes y grupos de clientes. 10

---

## Diapositiva 11

A continuación, se detallan algunos puntos clave para tener en cuenta: • El asistente de reclamaciones se ejecuta en todos los clientes y verifica todas las facturas de cliente impagas y las transacciones que representan deudas. • El asistente de reclamaciones permite: • Enviar por correo electrónico o imprimir cartas de reclamación con distintos niveles de gravedad. • Crear automáticamente facturas de servicio para las tasas de interés y reclamación. • Visualizar operaciones abiertas de proveedores conectados. • En la ventana Condiciones de reclamación establece: • Los niveles de la carta de reclamación. • Las tarifas y el interés de cada nivel. • El nivel de interés y la cuenta de mayor para la creación de facturas automáticas. • En los datos maestros de comerciales, puede configurar y supervisar la información de reclamación de un cliente. 11 PUBLIC Resumen El asistente de reclamaciones se ejecuta en: • Todos los clientes y verifica todas las facturas de cliente impagas y las transacciones que representan deudas. El asistente de reclamaciones permite: • Enviar por correo electrónico o imprimir cartas de reclamación con distintos niveles de gravedad. • Crear automáticamente facturas de servicio para las tasas de interés y reclamación. • Visualizar operaciones abiertas de proveedores conectados. En la ventana Condiciones de reclamación establece: • Los niveles de la carta de reclamación. • La tasa y el interés de cada nivel. • El nivel de interés y la cuenta de mayor para la creación de facturas automáticas. En los datos maestros comerciales, puede hacer lo siguiente: • Configurar y supervisar la información de reclamación de un cliente. A continuación, se detallan algunos puntos clave:

---

