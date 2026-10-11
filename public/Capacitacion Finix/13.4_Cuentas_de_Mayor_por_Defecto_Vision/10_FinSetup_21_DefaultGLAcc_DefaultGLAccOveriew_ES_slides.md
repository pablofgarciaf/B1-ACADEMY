# Transcripción por Diapositiva: 10_FinSetup_21_DefaultGLAcc_DefaultGLAccOveriew_ES

## Diapositiva 1

PUBLIC Configuración financiera: Cuentas de mayor de propuesta SAP Business One Versión 10.0 Bienvenido al tema Cuentas de mayor por defecto: Descripción general. 1

---

## Diapositiva 2

En esta sesión veremos las opciones para definir cuentas de mayor por defecto. 2 PUBLIC Al finalizar este tema, podrá:  Debatir las opciones para definir cuentas de mayor por defecto. Objetivos

---

## Diapositiva 3

Imagine que está implementando SAP Business One a un nuevo cliente.  Jaime, el director general, le indica que en el informe de pérdidas y ganancias desea ver los beneficios de cada grupo de artículos (por ejemplo, impresoras).  Quiere que el sistema contabilice automáticamente los asientos en las cuentas de pérdidas y ganancias correspondientes. 3 3 PUBLIC Escenario empresarial Implementará SAP Business One en un nuevo cliente, OEC Computers.  Jaime, el director general, le indica que en el informe de pérdidas y ganancias desea ver los beneficios de cada grupo de artículos (por ejemplo, impresoras).  Quiere que el sistema contabilice automáticamente los asientos en las cuentas de pérdidas y ganancias correspondientes.

---

## Diapositiva 4

Cuando se implementa SAP Business One por primera vez se definen las cuentas de mayor por defecto que se utilizarán al crear las transacciones durante los distintos procesos empresariales, tales como ventas, compras e inventario. Para ello se utiliza la ventana Determinación de cuentas de mayor del área Configuración de finanzas del módulo Gestión. Cuando se selecciona un modelo de plan de cuentas predefinido, la mayoría de las cuentas de mayor por defecto ya están definidas. Si es necesario, puede modificarlas. Cuando se usan posiciones en las transacciones, existen 2 opciones para la determinación de cuenta: la solución tradicional y la solución avanzada. Nota: Es muy importante asegurarse de tomar decisiones sobre Determinación de cuentas de mayor junto con el responsable del área de contabilidad del cliente. Las dos opciones de basan en las cuentas definidas en la ventana Determinación de cuentas de mayor. 4 PUBLIC Cuentas de mayor por defecto Para artículos utilizados en documentos  Ventana Determinación de cuentas de mayor  Ventas  Compras  General (por ejemplo, Cierre del período)  Inventario  Recursos y Asignación WIP  Solución tradicional: Método LM por defecto para un artículo  En el nivel de almacén  En el nivel de grupo de artículos  En el nivel de artículo  Determinación avanzada de cuenta de mayor

---

## Diapositiva 5

La primera opción es la solución tradicional que estaba disponible antes de la versión 9.0.  Según la solución tradicional, existen tres opciones para definir un método de cuentas de mayor para un artículo: nivel de almacén, nivel de grupo de artículos y nivel de artículo. Cada artículo tendrá un método definido. Puede fijar el método con anterioridad para todos los nuevos artículos.  Si su empresa utiliza la solución tradicional, seleccione el método de cuenta de mayor por defecto para los nuevos artículos en las Parametrizaciones generales en la ficha Inventario. En la subetiqueta de los artículos, encontrará el campo Fijar cuentas de mayor según.  A continuación, puede modificar el método por artículo.  Los valores que define en las etiquetas de la ventana Determinación de cuentas de mayor aparecen por defecto en los 3 niveles. Luego puede cambiar las cuentas por defecto por cualquiera de las de los niveles. Por ejemplo, puede gestionar distintas cuentas de inventario para cada almacén que tiene la empresa. 5 PUBLIC Cuentas de mayor por defecto: Solución tradicional  Ventana Determinación de cuentas de mayor  Ventas  Compras  General (por ejemplo, Cierre del período)  Inventario  Recursos y Asignación WIP  Solución tradicional: Método LM por defecto para un artículo  En el nivel de almacén  En el nivel de grupo de artículos  En el nivel de artículo  Determinación avanzada de cuenta de mayor

---

## Diapositiva 6

Cada vez que añade un documento que contabiliza un asiento, por ejemplo una factura de clientes, el sistema mira cada artículo del documento para determinar el nivel fijado para ese artículo y luego busca las cuentas de mayor asociadas que utilizará entre las cuentas por defecto. Cada artículo puede tener un método definido. Observe que, aunque especifique un método de cuentas de mayor por defecto para nuevos artículos, puede gestionar diferentes artículos con diferentes métodos si este escenario fuera necesario en su empresa. En el ejemplo que presentamos hay 3 artículos en la factura de clientes que tienen el nivel de grupo de artículos definido como método LM por defecto. Un artículo tiene definido el método de nivel de artículo y se pueden asignar distintas cuentas de mayor para utilizarlas en la transacción monetaria que se ha creado para este artículo. 6 PUBLIC Cuentas de mayor por defecto: Solución tradicional Factura de clientes N.º Cód. artículo Método LM por defecto Valor de método LM Cuenta de existencias Cuenta de ingresos Más cuentas... 1 A00002 Grupo de artículos Impresoras 9001 9002 2 A00003 Grupo de artículos Impresoras 9001 9002 3 S10000 Grupo de artículos Servidores 8008 8007 4 X70007 Nivel de artículo Nivel de artículo 7001 7002

---

## Diapositiva 7

En la solución avanzada, la ventana Determinación de cuentas de mayor se utiliza para definir cuentas de mayor en el nivel de empresa. Además, la solución avanzada ofrece una matriz centralizada para determinar reglas para asignar cuentas de mayor en los asientos según una lista (cerrada) de criterios predefinidos. Por lo tanto, la solución es más flexible y constante con la contabilidad. Para una nueva empresa y para una empresa mejorada, la solución avanzada no es la opción predeterminada. Esto se debe a las consideraciones de contabilidad.  Para activar la solución avanzada, vaya a la ficha Inicialización básica en la ventana Detalles de la empresa. Marque la casilla de selección Habilitar determinación avanzada de cuenta de mayor. Una vez marcada la casilla y existan transacciones, se puede volver a desmarcar; sin embargo, en este caso no se asignarán cuentas y el formulario Determinación de cuentas de mayor se utilizará para definir cuentas de mayor en todos los niveles: nivel de almacén, grupo de artículos y artículo. 7 PUBLIC  Solución tradicional:  Método de cuentas de mayor por defecto para un artículo  Determinación de cuenta de mayor avanzada  La ventana Determinación de cuentas de mayor se utiliza para definir cuentas de mayor en el nivel de empresa  También puede definir reglas para asignar las cuentas de mayor en los asientos. Cuentas de mayor por defecto: Determinación avanzada de cuenta de mayor  Ventana Determinación de cuentas de mayor  Ventas  Compras  General (por ejemplo, Cierre del período)  Inventario  Recursos y Asignación WIP

---

## Diapositiva 8

Por tanto, se utiliza la ventana Determinación de cuentas de mayor para definir las cuentas de nivel de empresa en un mismo lugar. Muchas empresas descubrirán que las cuentas del nivel de la empresa son suficientes. Para los escenarios empresariales específicos, tiene la opción de definir reglas para asignar cuentas de mayor en asientos. Estas reglas admiten:  Determinación de cuentas de mayor para código de articulo, grupo de artículos, código de almacén, país de entrega, estado de entrega, grupo de interlocutores comerciales, campos definidos por el usuario y otros.  Así como criterios de determinación múltiple. Es decir, una combinación de criterios. Las reglas que defina en el formulario avanzado tendrán mayor prioridad (que la ventana Determinación de cuentas de mayor) al determinar qué cuenta se asigna en los asientos. Por lo tanto, en nuestro ejemplo, OEC Computers puede definir una cuenta de ingresos diferente para cada grupo de artículos por país (por ejemplo, ingresos de impresoras en Canadá, Brasil y EE.UU.). Cuando eligen un artículo en un documento de marketing, por ejemplo una factura de clientes, el sistema verifica las cuentas necesarias para la transacción. En nuestro ejemplo, el sistema verifica el inventario y las cuentas de ingresos. Después, el sistema verifica si hay reglas definidas para estas cuentas. Si hay reglas definidas para las cuentas necesarias, el sistema busca la regla adecuada y elige la regla con mayor prioridad. 8 PUBLIC Cuentas de mayor por defecto: Determinación avanzada de cuenta de mayor La matriz centralizada determina las reglas para asignar cuentas de mayor en asientos: Regla Grupo de artículos País (dest. entrega) Cuenta de existencias Cuenta de ingresos Cuenta de gastos Más cuentas... 1 Impresoras EE. UU. 1001 1002 1003 … 2 Impresoras Canadá 2001 2002 2003 … 3 Impresoras Brasil 3001 3002 3003 … Nivel de empresa Cuenta de existencias Cuenta de ingresos Cuenta de gastos Más cuentas... Ventana Determinación de cuentas de mayor Reglas de determinación avanzada de cuenta de mayor ventana

---

## Diapositiva 9

En la ventana Determinación de cuentas de mayor, se definen las cuentas de mayor por defecto que se utilizarán en las transacciones. Existen 2 opciones para la determinación de cuentas en las transacciones con artículos: la solución tradicional de establecer un método predeterminado de cuentas de mayor para un artículo o la solución avanzada de determinación de cuentas. Las dos opciones de basan en las cuentas definidas en la ventana Determinación de cuentas de mayor. 9 9 PUBLIC Resumen A continuación, se detallan algunos puntos clave: En la ventana Determinación de cuentas de mayor debe definir: • Las cuentas de mayor por defecto que se utilizarán en las transacciones. Existen 2 opciones para la determinación de cuentas en las transacciones con artículos: • La solución tradicional: Método LM por defecto para un artículo. • La solución avanzada de determinación de cuenta de mayor. • Las dos opciones de basan en las cuentas definidas en la ventana Determinación de cuentas de mayor.

---

