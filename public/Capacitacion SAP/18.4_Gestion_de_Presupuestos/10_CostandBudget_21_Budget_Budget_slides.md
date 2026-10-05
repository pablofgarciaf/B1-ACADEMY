# Transcripción por Diapositiva: 10_CostandBudget_21_Budget_Budget

## Diapositiva 1

Contabilidad de Costos y Presupuesto: Gestión de Presupuesto — SAP Business One Versión 10.0. Bienvenido al tema: Gestión de Presupuesto.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Describir cómo gestionar el presupuesto. En este tema, revisaremos el módulo de presupuesto y veremos cómo ayuda a gestionar y controlar los gastos de la empresa.

---

## Diapositiva 3

Escenario de Negocio: Estás implementando SAP Business One en un nuevo cliente, OEC Computers. María, la contable, comenta que en años anteriores terminaron el ejercicio fiscal con gastos mucho mayores de lo previsto. Desean poder planificar sus gastos para un ejercicio fiscal y realizar un seguimiento durante el año. Ten en cuenta que debes tomar decisiones sobre las definiciones contables junto con el contable del cliente.

---

## Diapositiva 4

Gestión de Presupuesto. Previsión anual. Gastos — Cuenta G/L: Importe Máximo. Vuelos: 5.000 / Conferencias: 10.000 / Viaje en equipo: 2.500 / … / Enero. El módulo de presupuesto te ayuda a gestionar y controlar los gastos de la empresa. El objetivo del presupuesto es proporcionar una previsión de ingresos y gastos. De esta forma, la actividad financiera real del negocio puede compararse con la previsión. En SAP Business One, el presupuesto se basa en los datos que introduces, que especifican el importe máximo que puede asignarse a una cuenta G/L concreta. En nuestro ejemplo, OEC desea controlar los gastos que excedió el año pasado. Por eso, al inicio del ejercicio fiscal, María la contable introduce los importes en la previsión de presupuesto para las cuentas G/L de gastos correspondientes.

---

## Diapositiva 5

Gestión de Presupuesto. Importes reales. Gastos — Cuenta G/L: Saldo Acum. Vuelos: 5.000 / Conferencias: 2.000 / Viaje en equipo: 2.000 / … / Septiembre. Pedido de compra: Billetes de vuelo 1.200. Previsión del año en curso. Gastos — Cuenta G/L: Importe Máximo. Vuelos: 6.000 / Conferencias: 10.000 / Viaje en equipo: 2.500 / … Puedes bloquear la creación de transacciones para cuentas G/L que excedan su límite de presupuesto. Durante el trabajo habitual, la aplicación comprueba el lado del Debe de las transacciones registradas en las cuentas G/L para las que se ha definido un presupuesto. Si se supera el presupuesto, la aplicación emite una advertencia o bloquea la acción, según la configuración elegida. En nuestro ejemplo, María optó por bloquear las transacciones que superasen los importes del presupuesto que definió. En septiembre, cuando se emite un pedido de vuelos que supera el importe previsto, el sistema bloquea al usuario y no le permitirá agregar el pedido.

---

## Diapositiva 6

Configurar el Presupuesto. 4: Definir Importes del Presupuesto. 3: Definir Métodos de Distribución del Presupuesto. 2: Definir las cuentas relevantes para el presupuesto. 1: Inicializar la funcionalidad de presupuesto. Para configurar la funcionalidad de presupuesto debes: Inicializar la funcionalidad de presupuesto en la base de datos de la empresa. Definir las cuentas G/L que serán relevantes para el control del presupuesto. Definir métodos de distribución del presupuesto que dividan automáticamente el importe del presupuesto entre los meses del año. Y finalmente, definir los importes del presupuesto para las cuentas G/L relevantes. En las siguientes diapositivas revisaremos estos pasos y discutiremos algunos conceptos relacionados con la definición del presupuesto.

---

## Diapositiva 7

Paso 1 - Inicializar la Funcionalidad de Presupuesto. 1: Inicializar la funcionalidad de presupuesto. (* Sujeto a autorización para confirmar la desviación del presupuesto.) Primero, hay que inicializar la funcionalidad de presupuesto. Ve a Administración → Inicialización del Sistema → Configuración General, y en la pestaña Presupuesto marca la casilla Inicialización del Presupuesto. A continuación, define qué debe ocurrir cuando los documentos se desvíen del presupuesto: bloquear la creación de transacciones que lo excedan, o presentar una alerta al superarlo. El usuario puede confirmar y agregar la transacción, o cancelar. En la ventana Autorización, bajo el módulo Finanzas, existe una cláusula de Presupuesto en la que puedes definir autorizaciones para que los usuarios confirmen la desviación del presupuesto cuando se supere y aparezca una alerta. Cuando se elige la opción Sin Advertencia, el usuario podrá agregar transacciones que excedan el presupuesto sin ninguna restricción ni advertencia. Para Solicitudes de Compra, Pedidos de Compra y Entradas de Mercancías OC, la comprobación se realiza al emitir el documento, incluyendo todos los documentos abiertos y el actual. Para la opción Contabilidad, la comprobación se realiza al emitir una Factura OC o cualquier otra transacción contable que involucre una cuenta G/L relevante para el presupuesto. Puedes gestionar el presupuesto de forma anual o mensual. Discutiremos estas dos opciones en las siguientes diapositivas.

---

## Diapositiva 8

Paso 2 - Definir las Cuentas Relevantes para el Presupuesto. 2: Definir las cuentas relevantes para el presupuesto. Después de inicializar la funcionalidad de presupuesto y actualizar la ventana Configuración General, tienes la opción de marcar todas las cuentas de pérdidas y ganancias como cuentas de presupuesto. Al elegir Sí, se selecciona la casilla Relevante para Presupuesto en todas las cuentas G/L de pérdidas y ganancias. Puedes encontrar esta casilla en Finanzas → Plan de Cuentas → botón Detalles de la Cuenta. Ten en cuenta que puedes seleccionar manualmente cuentas G/L que no sean de pérdidas y ganancias como relevantes para el presupuesto marcando la casilla Relevante para Presupuesto en cada cuenta G/L.

---

## Diapositiva 9

Presupuesto Anual Versus Mensual. Previsión anual — Presupuesto mensual: Vuelos 6.000 ÷ 12 = 500. Previsión anual — Presupuesto anual: Vuelos 6.000. Puedes gestionar el presupuesto de forma anual o mensual. Con la opción anual, la desviación respecto a la previsión del presupuesto se mide contra el saldo real de la cuenta G/L para el ejercicio fiscal actual. En nuestro ejemplo, si OEC Computers elige la opción de presupuesto anual e introduce un importe de previsión de 6.000 para la cuenta de gastos de vuelos, la comprobación de desviación siempre se realizaría contra este importe. Para la opción mensual, el sistema distribuye el importe de la previsión del presupuesto de cada cuenta G/L entre los meses del año. En cada mes, las transacciones que debitan esta cuenta G/L se comparan con el importe mensual distribuido. Si OEC Computers eligiese la opción mensual e introdujera el mismo importe de 6.000 como previsión para la cuenta de gastos de vuelos, el sistema distribuiría este importe entre 12, asignando un presupuesto mensual de 500. La comprobación de desviación se realizaría contra este importe distribuido.

---

## Diapositiva 10

Presupuesto Anual Versus Mensual. Previsión anual — Presupuesto mensual: Vuelos 6.000 ÷ 12 = 500. Saldo real en la cuenta G/L de gastos de vuelos: 5.000. Previsión anual — Presupuesto anual: Vuelos 6.000. Octubre. Pedido de compra: Billetes de vuelo 600. Supongamos que estamos en octubre, el saldo real en la cuenta G/L de gastos de vuelos es de 5.000, y se emite un pedido de compra de billetes de vuelo con un importe total de 600. Con la opción anual, la comprobación del presupuesto aprobará este gasto porque 5.600 sigue dentro del importe previsto anual de 6.000. Según el presupuesto mensual, el límite de gastos en vuelos en cada mes es de 500, por lo que 600 ya supone una desviación del presupuesto y, por lo tanto, el pedido sería bloqueado. Ten en cuenta que si se eligió la opción de advertencia en la Configuración General para el presupuesto, el sistema presentará una alerta al superarlo. El usuario puede confirmar y agregar la transacción si se ha definido para ese usuario una autorización para confirmar la desviación del presupuesto.

---

## Diapositiva 11

Paso 3 - Definir Métodos de Distribución del Presupuesto. (* No relevante para trabajar con un presupuesto anual.) 3: Definir Métodos de Distribución del Presupuesto. En el ejemplo que acabamos de ver, SAP Business One usó el método de distribución Igual para dividir automáticamente el importe del presupuesto entre los meses del año. SAP Business One define automáticamente los siguientes 3 métodos de distribución comunes: El método Igual. Orden Ascendente — que distribuye el importe del presupuesto en orden ascendente y se usa cuando aumentas los gastos del presupuesto a lo largo de los meses del año (por ejemplo, en enero usas solo una pequeña parte del presupuesto, en febrero lo aumentas, etc.). Orden Descendente — que distribuye el importe en orden descendente y se usa cuando disminuyes los gastos a lo largo del año. Estos métodos no pueden modificarse. Sin embargo, puedes añadir métodos adicionales en Finanzas → Configuración de Presupuesto → Métodos de Distribución del Presupuesto. Puedes definir un método de distribución como predeterminado eligiendo el botón Establecer como Predeterminado. Ten en cuenta que los métodos de distribución del presupuesto no son relevantes para trabajar con un presupuesto anual.

---

## Diapositiva 12

Escenarios de Presupuesto. Escenario Optimista — Cuenta 100000 / Cuenta 200000 / Cuenta 300000 / Cuenta 400000 / Cuenta 500000. Escenario Principal. Escenario Pesimista. Ten en cuenta que durante el trabajo habitual, la desviación del presupuesto se comprueba únicamente contra el escenario de presupuesto principal. ¡Los demás escenarios se usan para los informes de presupuesto! Los escenarios de presupuesto se usan principalmente para mostrar informes de presupuesto. Mediante un escenario, creas un análisis de una situación particular del presupuesto de la empresa y obtienes información sobre cuál sería el saldo presupuestario según el escenario seleccionado. Por ejemplo: un escenario optimista frente a uno pesimista. Al crear una nueva empresa, la aplicación proporciona un escenario predeterminado llamado Presupuesto Principal. Este escenario no puede editarse. Para cada escenario que use la empresa, deberás introducir posteriormente los importes del presupuesto.

---

## Diapositiva 13

Escenarios de Presupuesto. Para definir escenarios de presupuesto, ve a Finanzas → Configuración de Presupuesto → Escenarios de Presupuesto. Selecciona un ejercicio fiscal. Luego, en la barra de menú, elige Datos → Agregar Fila o haz clic derecho y elige Agregar Fila. El primer escenario definido será el escenario principal predeterminado y, por lo tanto, no puede eliminarse. Además, los campos Basado En e Índice Inicial del escenario principal no pueden modificarse. En el siguiente paso introduciremos los importes del presupuesto en este escenario principal. La función Importar Escenario permite importar un escenario de presupuesto de otra empresa de SAP Business One al nuevo escenario de presupuesto. Asegúrate durante la operación de que los códigos de cuenta G/L de la empresa origen coincidan con los de la empresa destino. La función Copiar Escenario permite copiar los datos del presupuesto de un escenario a un escenario destino en la misma empresa, para el mismo ejercicio fiscal o para el siguiente.

---

## Diapositiva 14

Paso 4 - Definir Importes del Presupuesto. 4: Definir Importes del Presupuesto. Por último, defines los importes del presupuesto. Ve a Finanzas → Configuración de Presupuesto → Presupuesto. Elige el escenario para el que deseas definir un presupuesto y selecciona las cuentas G/L necesarias.

---

## Diapositiva 15

Definición de Importes del Presupuesto. En la columna Debe/Haber en Moneda Local especifica un importe en moneda local para cada cuenta G/L. Ten en cuenta que: Solo puedes definir importes de presupuesto para las cuentas G/L definidas como Relevantes para Presupuesto en el Plan de Cuentas. SAP Business One comprueba las desviaciones del presupuesto contra el lado del Debe de las transacciones registradas en la cuenta G/L. Por lo tanto, las alertas solo se activan para cuentas con un importe presupuestado en la columna Debe. Puedes usar el campo Haber para las cuentas de ventas para establecer objetivos de ingresos que puedas seguir con el informe de presupuesto. Cuando creas un nuevo presupuesto que incluye cuentas sin definiciones de presupuesto anteriores, la ventana no muestra ninguna cuenta. En ese caso, marca la casilla Mostrar Cuentas sin Presupuesto. Para cada cuenta, puedes cambiar el importe del presupuesto y el método de distribución. También puedes cambiar la distribución de los importes manualmente en la ventana Detalles de Partida de Presupuesto haciendo doble clic en el número de fila correspondiente o con clic derecho y eligiendo Detalles de Fila. Si cambias los importes del presupuesto manualmente, la columna Método en la ventana Escenarios de Presupuesto – Configuración cambia a Manual y aparece marcada en rojo en la fila de la cuenta G/L correspondiente.

---

## Diapositiva 16

Definición de Importes del Presupuesto. La columna Real mostrará el saldo de esta cuenta según sus asientos contables. Cuando defines un importe de presupuesto para una cuenta G/L que ya tiene un saldo contable, SAP Business One muestra un mensaje del sistema sobre las transacciones existentes y pregunta si deseas restaurar el acumulador de la cuenta. Eligiendo Sí: copia el saldo contable actual de la cuenta G/L para el ejercicio fiscal elegido en la columna Real. Esto significa que SAP Business One considera el saldo contable actual al comenzar a calcular los importes de presupuesto utilizados. Eligiendo No: ignora el saldo contable actual de la cuenta G/L y comienza a calcular el presupuesto utilizado desde este momento (importe de presupuesto utilizado igual a cero).

---

## Diapositiva 17

Empezando a Trabajar. Ahora el presupuesto está definido para las cuentas seleccionadas, lo que te permite realizar un análisis comparando el presupuesto definido con la actividad empresarial real. Durante el trabajo habitual, cuando creas una transacción contra una cuenta G/L de gastos relevante para el presupuesto, se realiza una comprobación de desviación respecto al escenario de presupuesto principal. Si se supera el presupuesto, se emite una alerta. Cuando se elige la opción Advertencia en la configuración general para el presupuesto, el usuario puede optar por continuar y agregar la transacción o cancelar. Ten en cuenta que esto está sujeto a autorización para confirmar la desviación del presupuesto. Si se definió la opción Bloquear Desviación del Presupuesto, el sistema bloqueará la creación de la transacción que causa la superación del presupuesto.

---

## Diapositiva 18

Informe de Presupuesto. Ve a Finanzas → Informes Financieros → Informes de Presupuesto → Informe de Presupuesto. El Informe de Presupuesto te permite visualizar los datos del presupuesto de la empresa según tus requerimientos. Este informe analiza las actividades empresariales que ocurren durante un período definido, con referencia al escenario de presupuesto seleccionado.

---

## Diapositiva 19

Informes Financieros de Presupuesto. Ve a Finanzas → Informes Financieros → Informes de Presupuesto. Los informes financieros estándar pueden mostrarse junto con los datos del presupuesto: Balance, Balance de Comprobación, Cuenta de Pérdidas y Ganancias. Puedes ejecutar los informes de presupuesto según el escenario de presupuesto que prefieras.

---

## Diapositiva 20

Resumen. Puntos clave: El objetivo del presupuesto es proporcionar una previsión de ingresos y gastos. De esta forma, la actividad financiera real del negocio puede compararse con la previsión. Tras inicializar el presupuesto, defines qué debe ocurrir cuando los documentos se desvíen del presupuesto: bloquear la creación de transacciones que lo excedan, o presentar una alerta. El usuario puede confirmar y agregar la transacción si se ha definido para ese usuario una autorización para confirmar la desviación del presupuesto. Tienes la opción de marcar todas las cuentas de pérdidas y ganancias como cuentas de presupuesto.

---

## Diapositiva 21

Resumen (cont.). Puedes gestionar el presupuesto de forma anual o mensual. Con la opción anual, la desviación respecto a la previsión del presupuesto se mide contra el saldo real de la cuenta G/L para el ejercicio fiscal actual. Para la opción mensual, el sistema distribuye el importe de la previsión del presupuesto de cada cuenta G/L entre los meses del año; la comprobación de desviación se realiza contra este importe distribuido. Defines los importes del presupuesto en el escenario de presupuesto. Durante el trabajo habitual, la desviación del presupuesto se comprueba únicamente contra el presupuesto principal. ¡Los demás escenarios se usan solo para informes de presupuesto! SAP Business One comprueba las desviaciones del presupuesto contra el lado del Debe de las transacciones registradas en la cuenta G/L.

---

## Diapositiva 22

Aviso legal SAP — sin cambios respecto al documento original.

---
