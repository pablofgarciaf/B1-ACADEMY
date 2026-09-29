# Transcripción por Diapositiva: 10_ControlReports_21_CashReports_cashflow_ES

## Diapositiva 1

PUBLIC Informes de control: Informe de flujo de efectivo SAP Business One Versión 10.0 Bienvenido al tema Informes de flujo de caja. 1

---

## Diapositiva 2

Al finalizar este tema, podrá:  Generar informes de flujo de caja e interpretar los datos de informes típicos.  Analizar el efecto de los procesos estándar en el flujo de caja de SAP Business One. 2 PUBLIC Al finalizar este tema, podrá:  Generar informes de flujo de efectivo e interpretar los datos de informes típicos.  Analizar el efecto de los procesos estándar en el flujo de efectivo de SAP Business One: Objetivos

---

## Diapositiva 3

María, la responsable del área de contabilidad de OEC Computers, desea controlar mejor sus saldos de cuentas monetarias y realizar una previsión de los cobros y pagos. Le presenta los informes de Flujo de caja y de Previsión de flujo de caja, que permiten controlar la situación financiera de la empresa. 3 PUBLIC Escenario empresarial  María, la responsable del área de contabilidad de OEC Computers, desea controlar mejor sus saldos de cuentas monetarias y realizar una previsión de los cobros y pagos.  Le presenta los informes de Flujo de efectivo y de Previsión de flujo de efectivo, que permiten controlar la situación financiera de la empresa.

---

## Diapositiva 4

El flujo de caja es un informe de previsión: Encontrará el informe Flujo de caja en el menú Informes financieros del módulo Finanzas. El informe ofrece información sobre la liquidez de su empresa que va más allá del alcance de una cuenta de pérdidas y ganancias. Muestra las cuentas de balance que reflejan el valor monetario de la empresa. El informe de flujo de caja en SAP Business One enumera los totales y balances de ambas cuentas que representan el efectivo disponible y las cuentas que esperan un flujo de caja en el futuro (ya sea pago o cobro) para el intervalo de tiempo solicitado. En la imagen, puede ver la lista de estos componentes de flujo de caja. 4 PUBLIC Componentes del flujo de efectivo El flujo de efectivo es un informe de previsión que muestra transacciones de entrada y salida previstas Componentes: Efectivo Documentos de tarjeta de crédito Cheques recibidos Deudas del cliente Deudas con proveedores Previsión de cliente Previsión del proveedor

---

## Diapositiva 5

 Un nivel de seguridad es el nivel de probabilidad de que la operación se convierta en efectivo (pagos efectuados y recibidos). La probabilidad de llegada de una operación de flujo de caja varía considerablemente. Por este motivo, cada balance de componente tiene un nivel de seguridad distinto.  Vea la imagen. Los componentes de flujo de caja están ordenados por niveles de seguridad: • Las transaccionesmás ciertas se derivan de cuentas monetarias, como las cuentas bancarias • Después, los documentos de tarjeta de crédito y los cheques recibidos • El siguiente nivel es Deudas del cliente (por ejemplo, facturas de cliente) y Deudas con proveedores (por ejemplo, facturas de proveedores) • El nivel de seguridad más bajo es la previsión de cliente y la previsión de proveedor. Las previsiones de cliente y proveedor representan los documentos pendientes, como las ventas, los pedidos de compras y los documentos preliminares. 5 PUBLIC Componentes de flujo de efectivo y nivel de seguridad Nivel de seguridad más alto Nivel de seguridad más bajo Componentes: Efectivo Documentos de tarjeta de crédito Cheques recibidos Deudas del cliente Deudas con proveedores Previsión de cliente Previsión del proveedor

---

## Diapositiva 6

El flujo de caja se ejecuta según: • Operaciones abiertas – no reconciliadas (con la opción para visualizar contabilizaciones reconciliadas totalmente). • La fecha de vencimiento de la transacción. El flujo de caja se visualiza según: • Los intervalos de tiempo (días, semanas, meses, etc.) • Niveles de seguridad El informe enumera todos los intervalos de tiempo dentro del rango de fecha del informe. Cada intervalo enumera las transacciones esperadas (en el futuro) según su nivel de seguridad. En la imagen, puede ver un ejemplo de un intervalo de tiempo dentro del informe de flujo de caja. Se muestran distintas transacciones de acuerdo con sus niveles de seguridad. Tenga en cuenta que es posible que existan varias transacciones dentro de un nivel de seguridad. 6 PUBLIC Estructura de informe del flujo de efectivo Nivel de seguridad Fe.vencimiento (en el futuro) Documento Cuenta Debe Haber Cuentas monetarias ---- ---- Pagos a proveedor (transf. bancaria) Banco propio 5.000 Tarjetas de crédito/cheques ---- ---- Cobros Cta. compen. tarjeta crédito 10.000 Deudas del cliente ---- ---- Facturas clientes Cta. clientes 2.000 Deudas con proveedores ---- ---- Facturas prov. Proveedor 3.000 Previsión del proveedor ---- ---- Pedidos Proveedor 1.000 Dentro de intervalo tiempo, semana: Saldo acumulado dentro del intervalo de tiempo: 3.000 Rango de tiempo: Mes siguiente

---

## Diapositiva 7

7 PUBLIC Opciones de informe en la ventana de criterios de selección En la ventana Criterios de selección de flujo de caja, puede añadir al flujo de caja: • Transacciones recurrentes, que aparecen en verde en el informe • Documentos preliminares pendientes, que se muestran en azul en el informe. • Documentos de marketing que no crean asientos, como pedidos de cliente y documentos preliminares. • También puede añadir los acuerdos globales autorizados al cálculo de informe. En la tabla Incluir contabilizaciones proyectadas especifique las transacciones futuras que todavía no se han registrado en SAP Business One, como la compra de un nuevo vehículo para la empresa, diseñada para ejecutarse el siguiente mes. El informe muestra las transacciones adicionales en verde. 7

---

## Diapositiva 8

8 PUBLIC Informe de previsión del flujo de efectivo Datos de configuración Ajustar el nivel de seguridad y los componentes en cada nivel Arrastrar los márgenes para ajustar el intervalo de tiempo deseado Otra forma de presentar los datos de flujo de caja de la empresa es el informe de previsión de flujo de caja. Esta es una herramienta gráfica, rápida y fácil de usar que genera el informe al instante. El ajuste del intervalo de tiempo o la modificación de los datos de configuración volverán a generar el informe y gráfico inmediatamente. El gráfico de barras muestralos importes de entrada en azul y los importes de salida en verde. El gráfico de líneas muestra importes netos y acumulados. 8

---

## Diapositiva 9

La Declaración de flujo de caja es otro informe y un documento legal necesario en muchas localizaciones, igual que la cuenta de pérdidas y ganancias y el balance. Debe configurar las parametrizaciones iniciales en la ventana Parametrizaciones generales y fijar los valores por defecto para asignar transacciones a los artículos relevantes en la Declaración de flujo de caja. Para conocer más detalles sobre cómo configurar la Declaración de flujo de caja, consulte la ayuda en línea. 9 PUBLIC Estado de flujos de efectivo El Estado de flujos de efectivo es un documento legal necesario en varias localizaciones. Configure las parametrizaciones iniciales y fije los valores por defecto en la ventana Parametrizaciones generales en la ficha Flujo de efectivo.

---

## Diapositiva 10

10 PUBLIC Resumen A continuación, se detallan algunos puntos clave: El flujo de efectivo es un: • Informe de pronóstico que refleja el valor monetario de la empresa. El flujo de efectivo se visualiza según: • Operaciones abiertas – no reconciliado. • Fecha de vencimiento de las transacciones. El flujo de efectivo muestra saldos de: • Efectivo disponible (por ejemplo, el efectivo recibido en el banco). • Flujo de efectivo previsto en el futuro (p. ej., cobros futuros y facturas pendientes). El sistema asigna los saldos a: • Varios niveles de seguridad - el nivel de certeza. Por ejemplo: ─El efectivo disponible pertenece al primer nivel - Cuentas monetarias. ─Los cobros previstos de facturas pendientes pertenecen al siguiente nivel, Deudas del cliente. El informe Previsión de flujo de efectivo es: Una herramienta que permite generar un flujo de efectivo gráfico y rápido El estado del flujo de efectivo es: Otro informe y un documento legal necesario en muchas localizaciones.  A continuación, se detallan algunos puntos clave para tener en cuenta:  El flujo de caja es un informe de pronóstico que refleja el valor monetario de la empresa.  El flujo de caja se ejecuta en función de las operaciones abiertas (no reconciliadas) y en las fechas de vencimiento de las transacciones.  El informe de flujo de caja muestra los saldos del efectivo disponible (como el efectivo en el banco) y el flujo de caja esperado en el futuro (como los pagos futuros y las facturas pendientes).  El sistema asigna los balances a diferentes niveles de seguridad dependiendo del nivel de certeza. Por ejemplo, el efectivo disponible pertenece al primer nivel (cuentas monetarias), mientras que los cobros previstos de facturas pendientes pertenecen al siguiente nivel, Deudas del cliente.  El informe de previsión de flujo de caja es una herramienta que le permite generar un flujo de caja gráfico y rápido.  La Declaración de flujo de caja es otro informe y un documento legal necesario en algunas localizaciones. 10

---

