# Transcripción por Diapositiva: 10_AccBasics_11_AccBasics_Financial_Basics_ES

## Diapositiva 1

PUBLIC Fundamentos de la contabilidad: Fundamentos de finanzas SAP Business One Versión 10.0 Bienvenido al tema Fundamentos de finanzas. 1

---

## Diapositiva 2

2 PUBLIC Al finalizar este tema, podrá:  Analizar algunas convenciones de contabilidad general. Objetivos En este tema, cubriremos algunas convenciones generales sobre contabilidad y daremos ejemplos de los asientos automáticos que se crean durante los procesos de venta.

---

## Diapositiva 3

Imagine que está implementando SAP Business One en un cliente nuevo, OEC Computers. Su contacto principal es la responsable del área de contabilidad, María. María está muy interesada en la implementación y pregunta sobre cómo SAP Business One gestiona los procesos de contabilidad financiera. Desea asegurarse de que comprende el panorama general a fin de poder informar periódicamente los resultados a los propietarios de la empresa en cada período. 3 3 PUBLIC Escenario empresarial Implementará SAP Business One en un nuevo cliente, OEC Computers: Su principal contacto en las instalaciones del cliente es María, la responsable del área de contabilidad. María desea conocer cómo SAP Business One gestiona los procesos de contabilidad financiera. Quiere asegurarse de que comprende el panorama general para poder informar sobre los resultados de la empresa.

---

## Diapositiva 4

Veamos algunos conceptos básicos de finanzas. Todas las transacciones comerciales se registran en los libros de la empresa. Esto le permite:  Gestionar la empresa de manera eficaz gracias a la posibilidad de elaborar informes financieros.  Informar las transacciones comerciales a las autoridades pertinentes. Todas las transacciones comerciales generan un intercambio de valor:  Una determinada cuenta aumenta de valor y otra disminuye de valor, lo que genera el registro de contabilizaciones compensadas del Debe y el Haber. 4 PUBLIC Fundamentos de finanzas Configuración del sistema Control de gestión financiera Compras Gestión de almacenes Producción Logística de entrada Logística de salida Marketing y ventas Servicio Datos maestros

---

## Diapositiva 5

En temas anteriores tratamos los documentos del proceso de ventas y sus consecuencias en la contabilidad. Para revisar este proceso intentemos responder a la siguiente pregunta: En un proceso de ventas estándar, ¿qué documentos afectan al sistema contable? 5 PUBLIC Asientos automáticos: Pregunta de reflexión Estándar Oferta de ventas Pedido de cliente Entrega Factura de clientes Cobro Depósito

---

## Diapositiva 6

Estos son los documentos en el proceso de ventas que crean asientos automáticos y por lo tanto afectan al sistema contable: la entrega, la factura de clientes, los pagos recibidos y el depósito.  Tenga en cuenta que la entrega solo crea la contabilización si está utilizando un inventario permanente. 6 PUBLIC Asientos automáticos: Respuesta Cuando se utiliza el inventario permanente Estándar Oferta de ventas Pedido de cliente Entrega Factura de clientes Cobro Depósito

---

## Diapositiva 7

En SAP Business One, un asiento se contabiliza automáticamente para varios documentos durante los procesos de inventario, compra y venta. Ahora supongamos por un momento que estamos en un sistema de inventario no permanente para que nuestro ejemplo sea simple. En ese caso, en nuestro ejemplo de proceso de ventas, la factura de clientes crea automáticamente el siguiente asiento:  Hay un cargo en el Debe de la cuenta del cliente por el precio total de la venta.  Existe el Haber para la cuenta de impuestos para impuestos sobre ventas y el Haber para la cuenta de ingresos para el precio de la venta (impuestos no incluidos). Existe la opción de dividir la contabilización del asiento por líneas de documento. Es decir, las filas con las mismas cuentas de mayor no se agrupan en el asiento creado. Una fila del asiento se enlaza con una fila del documento de marketing. Para habilitar esta opción, en la ventana Parametrizaciones de documento en la ficha General, seleccione la opción Dividir en el campo Dividir contabilización del asiento por líneas de documento. Centrémonos en la columna del Debe. Cada transacción que se registra para el cliente afecta al saldo de la cuenta del cliente.  Ahora veamos la cuenta del cliente más detalladamente. 7 PUBLIC Asiento de factura de clientes Debe Haber Cuenta de cliente 105 Cuenta de impuestos 5 Cuenta de ingresos 100 Oferta de ventas Pedido de cliente Entrega Factura de clientes

---

## Diapositiva 8

Este es un ejemplo de la cuenta del cliente. El saldo de una cuenta representa la diferencia entre el total de transacciones en el Debe y el total de transacciones en el Haber que se registraron para dicha cuenta. El resumen de transacciones o el saldo de una cuenta de mayor o un interlocutor comercial determinado representa la información inicial que puede proporcionar el sistema contable acerca de la empresa. En el gráfico, vemos que los débitos totales son mayores que los créditos totales, por lo que la cuenta tiene un saldo debe. Anteriormente, mencionamos que, en cada asiento, una determinada cuenta aumenta de valor y otra disminuye de valor, lo que genera el registro de contabilizaciones compensadas del Debe y el Haber. El impacto en el saldo de cuenta sería el siguiente:  Las cuentas de activo, gastos y arrastre suelen estar en el debe.  Las cuentas de pasivo, ingresos y capital propio suelen estar en el haber. 8 PUBLIC El saldo de cuenta Cliente XXXX7 Debe Haber Origen Debe 105 Factura de clientes Debe 600 Factura de clientes Debe 400 Factura de clientes Haber 705 Cobro Debe 200 Factura de clientes Debe 100 Factura de clientes Saldo de cuenta Debe 700

---

## Diapositiva 9

Aquí, vemos el típico saldo de cuenta de los distintos tipos de cuenta. Por ejemplo, veamos el intercambio de valor de los activos y los pasivos. Para los activos:  Las transacciones del Debe siempre aumentan el valor del activo.  Las transacciones del Haber siempre disminuyen el valor del activo. Para los pasivos:  Las transacciones del Haber siempre aumentan el pasivo.  Las transacciones del Debe siempre disminuyen el pasivo. Trataremos las diferentes clases de cuenta en otro curso. 9 PUBLIC Cuentas del Debe Cuentas del Haber ▲= aumentar ▼= disminuir Saldos habituales ▲= aumentar ▼= disminuir Saldos habituales Activo ▲ Cuenta bancaria, Clientes ▼ Pasivo ▼ ▲ Proveedores Capital propio/ Capital ▼ ▲ Reservas Gastos ▲ Alquiler, Electricidad ▼ Ingresos ▼ ▲ Ingresos Clases de cuenta Cuentas de balance Cuentas de pérdidas y ganancias

---

## Diapositiva 10

En una factura de clientes habitual, ¿cuál es el efecto de los importes del Debe y el Haber en los saldos de cuenta implicados? Nuevamente haremos suposiciones para que el ejemplo sea simple:  Supongamos que el cliente está exento de impuestos y que se trata de un sistema de inventario no permanente. 10 PUBLIC Intercambio de valor: Pregunta de reflexión Debe Haber Cuenta de cliente 440 Cuenta de ingresos 440 Factura de clientes

---

## Diapositiva 11

La respuesta es que las dos cuentas aumentan sus valores. La cuenta de deudor se considera un activo por lo que cualquier cargo en esta cuenta aumenta el valor de la cuenta. El Haber en la cuenta de ingresos, como vimos en la diapositiva anterior, aumenta el valor de la cuenta. Observe que puede obtener una vista previa de la contabilización del asiento correspondiente y las cuentas involucradas antes de añadir un documento que genere el asiento. Para ello, seleccione el icono Presentación preliminar de asiento en la barra de herramientas o haga clic derecho en el documento y seleccione la opción Presentación preliminar de asiento. 11 PUBLIC Intercambio de valor: Respuesta Las dos cuentas aumentan sus valores: ▲ Factura de clientes Debe Haber Cuenta de cliente 440 Cuenta de ingresos 440

---

## Diapositiva 12

A continuación, se detallan algunos puntos clave para tener en cuenta: El saldo de una cuenta representa la diferencia entre el total de transacciones en el Debe y el total de transacciones en el Haber que se registraron para dicha cuenta. En cada asiento una determinada cuenta incrementa el valor y otra lo disminuye, y así se equilibran la columna del debe y la columna del haber. Las cuentas de activo, gastos y arrastre suelen estar en el debe. Las cuentas de pasivo, ingresos y capital propio suelen estar en el haber. 12 12 PUBLIC Resumen A continuación, se detallan algunos puntos clave: El saldo de cuenta representa: • La diferencia entre el total de transacciones en el debe y el total de transacciones en el haber que se registraron para dicha cuenta. En cada asiento: • Ciertas cuentas incrementan el valor y otras lo disminuyen • La columna Debe y la columna Haber del balance. Las cuentas de activo, gastos y arrastre suelen estar: • Debe Las cuentas de pasivo, ingresos y capital propio suelen estar: • Haber

---

## Diapositiva 13

Ha completado el tema Fundamentos financieros. Le agradecemos el tiempo que nos ha dedicado. 13 PUBLIC Gracias Ya ha completado el tema fundamentos financieros. Le agradecemos el tiempo que nos ha dedicado.

---

