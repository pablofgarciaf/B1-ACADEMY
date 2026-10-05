# Transcripción por Diapositiva: 10_FinProcess_22_PostPeriods_PeriodClose

## Diapositiva 1

Proceso Financiero: Cierre de Período — SAP Business One Versión 10.0. Bienvenido al curso sobre el cierre de período.

---

## Diapositiva 2

En este curso analizaremos cómo prepararse y llevar a cabo el cierre de período. Objetivos. Al finalizar este tema, podrás: Prepararse para el Cierre de Período. Realizar el Cierre de Período.

---

## Diapositiva 3

Escenario de Negocio. Tu empresa crea un estado financiero una vez al año. Necesitan doce períodos de registro para el control interno. Has definido el Ejercicio Fiscal como el año natural y los subperíodos como Meses. La empresa no ejecutará el proceso de Cierre de Período al final de cada mes. En cambio, lo ejecutará al final del ejercicio fiscal. Hay varias tareas de fin de período que realizan mensualmente. El contable sigue una lista de pasos para el cierre de fin de año. Imagina que tu empresa crea un estado financiero anual una vez al año. Necesitan doce períodos de registro para su control interno. Por ello, ya has creado una nueva base de datos de empresa y definido el Ejercicio Fiscal como el año natural y los subperíodos como Meses. No ejecutarán el proceso de Cierre de Período al final de cada mes, sino al final del período de registro principal — el ejercicio fiscal. Aun así, hay varias tareas de fin de período que realizan mensualmente. Por ejemplo, cada mes hacen la conciliación interna y envían extractos de deudores por deudas pendientes. Y por último, el contable sigue una lista de pasos para el cierre de fin de año.

---

## Diapositiva 4

Agenda. Proceso de Fin de Período. Cierre de Período – Visión General. Mes de Cierre vs. Fin de Año. Tareas de Fin de Período. Cierre de Período. Utilidad de Cierre de Período. Estado del Período de Registro. Revisemos el proceso de cierre de período, destacando las diferentes acciones que el usuario debe realizar en el cierre mensual frente al cierre de fin de año.

---

## Diapositiva 5

Aquí puedes ver una visión general del proceso de períodos de registro. Hay tres etapas en el proceso. En este tema nos enfocaremos en el Cierre de Período, la última etapa. Primero revisemos cada paso. En la primera etapa, definimos la configuración de los períodos de registro: primero el período de registro principal para el Ejercicio Fiscal, luego los subperíodos (Año, Trimestres, Meses o Días). La segunda etapa es la operativa: en el trabajo diario, introducimos documentos y asientos contables manuales con una fecha de contabilización que se registra automáticamente en el subperíodo correspondiente. Los subperíodos permiten controlar las contabilizaciones en cada mes. La tercera etapa es el proceso de Cierre de Período, en el que nos enfocaremos. Visión General del Proceso de Períodos de Registro. Ejercicio Fiscal: 2018. Fecha de contabilización → Subperíodo. Subperíodos: Meses (2018-01, 2018-02, 2018-03, …). Configuración adicional. Cierre de Período / Fin de Año.

---

## Diapositiva 6

Hay cuatro tareas en el cierre de período: Primero, cambias el estado del período de registro a Período de Cierre (limitando quién puede contabilizar en él). Luego, realizas las tareas de fin de año (como la conciliación). A continuación, usas la utilidad de cierre de período para cerrar el período (esta acción traslada todos los saldos de las cuentas de Pérdidas y Ganancias a la cuenta de Resultados Acumulados y pone a cero las cuentas de P&G). Finalmente, cambias el estado del período a Bloqueado. El proceso de cierre de período normalmente se lleva a cabo al final de un período financiero de un año. Se realiza mediante la ventana Cierre de Período. Sin embargo, también puedes cerrar un Subperíodo. Analizaremos los estados del período de registro más adelante en este curso. Proceso de Fin de Período: Cambiar a Período de Cierre → Tareas de Fin de Período → Cierre de Período (trasladar saldos de P&G a la cuenta de Resultados Acumulados y ponerlos a cero) → Cambiar Estado del Período a Bloqueado.

---

## Diapositiva 7

Recuerda nuestro ejemplo de negocio. El período principal de tu empresa es de un año, pero también tienes subperíodos mensuales. Has decidido no cerrar cada subperíodo, aunque realizas tareas de fin de período mensualmente. Esto se debe a que usas los subperíodos principalmente para el control interno. Cuando tu empresa hace el cierre de fin de año, cierra todos los subperíodos. Otras empresas pueden optar por cerrar cada subperíodo al final de este. Como ya cerraron los subperíodos durante el año, cierran el último subperíodo del ejercicio fiscal. En cualquier caso, para evitar que los usuarios creen documentos para el ejercicio fiscal anterior, puedes cambiar el estado del período que vas a cerrar a Período de Cierre. Esto significa que solo los usuarios autorizados pueden contabilizar datos, documentos y transacciones. El propósito principal del Cierre de Período es preparar las cuentas para su presentación ante las autoridades e implica poner a cero las cuentas de Pérdidas y Ganancias para que el siguiente período pueda comenzar a recopilar datos relevantes para él. A continuación, cierras o inactivas los subperíodos del ejercicio fiscal bloqueándolos mediante el campo Estado del Período en la ventana Períodos de Registro. Cierre de Fin de Mes vs. Cierre de Fin de Año. Cierre de Fin de Mes: Cambiar a Período de Cierre → Tareas de Fin de Período → Cierre de Período (OPCIONAL) → Cambiar Estado del Período a Bloqueado. Cierre de Fin de Año: Cambiar a Período de Cierre → Tareas de Fin de Año → Cierre de Año (trasladar saldos de P&G a la cuenta de Resultados Acumulados y ponerlos a cero) → Cambiar Estado del Período a Bloqueado. Ejercicio Fiscal: 2020.

---

## Diapositiva 8

Ejemplos de tareas de fin de período: Asegurarse de que todas las transacciones de fin de período se contabilizaron correctamente, incluidos ajustes y provisiones. Contabilizar todos los Vales Contables abiertos. Conciliar internamente las cuentas de compensación de gastos. Como buena práctica, debes conciliarlas regularmente al final de cada mes; de lo contrario, tendrás un gran número de transacciones a conciliar al final del año. Imprimir los informes: Balance de Comprobación (saldo de cada cuenta y estado actual). Informes de Antigüedad de Proveedores y Clientes para conciliar las cuentas por cobrar con el libro mayor. Informe de Auditoría de Inventario para conciliar el inventario con el libro mayor. Y todos los Estados Financieros. Revisar la lista de partidas abiertas y cerrar documentos cuando sea posible. Por último, hacer una copia de seguridad de la base de datos y guardarla en un lugar externo. Tareas de Fin de Período.

---

## Diapositiva 9

Ejemplos de tareas de fin de año: Contabilizar deudas dudosas que consideres irrecuperables. Contabilizar diferencias de tipo de cambio y diferencias de conversión. Contabilizar las transacciones finales del período en todos los módulos y los asientos de ajuste finales en el libro mayor. Cerrar el último período del ejercicio fiscal. Imprimir informes como un Balance de Comprobación detallado final y los Estados Financieros. Configurar un nuevo ejercicio fiscal (si aún no lo has hecho). Una vez más, debes hacer una copia de seguridad para guardar el estado del ejercicio fiscal anterior. Tareas de Fin de Año.

---

## Diapositiva 10

Agenda. Proceso de Fin de Período. Cierre de Período – Visión General. Mes de Cierre vs. Fin de Año. Tareas de Fin de Período. Cierre de Período. Utilidad de Cierre de Período. Estado del Período de Registro. El siguiente paso en el proceso de cierre de período es ejecutar la utilidad de cierre de período y luego cambiar el estado del período de registro.

---

## Diapositiva 11

Tras completar las tareas de fin de período, estamos listos para ejecutar la utilidad de cierre de período y cerrar el ejercicio fiscal. Esta acción pone a cero todos los saldos de las cuentas de Pérdidas y Ganancias transfiriéndolos a la cuenta de Resultados Acumulados. La cuenta de Resultados Acumulados es una cuenta del Balance en el cajón Capital y Reservas (llamado Patrimonio Neto en algunas localizaciones, como Estados Unidos). Después del cierre del período, la cuenta de Resultados Acumulados contiene el beneficio acumulado total traído de períodos anteriores. El siguiente período puede entonces comenzar a recopilar los datos de pérdidas y ganancias relevantes para él. A continuación, cierras o inactivas los subperíodos del ejercicio fiscal bloqueándolos. Realizar el Cierre de Período. Trasladar todos los saldos de las cuentas de P&G a la cuenta de Resultados Acumulados y ponerlos a cero → Cambiar Estado del Período a Bloqueado → Cierre de Período.

---

## Diapositiva 12

Con la Utilidad de Cierre de Período, puedes elegir las cuentas de pérdidas y ganancias y los períodos, y especificar una cuenta de resultados acumulados y una cuenta de cierre de período. Cuando ejecutas el cierre de período, el sistema genera una lista de propuestas para los asientos de cierre. Puedes aceptar cada propuesta individualmente. Aquí hay un ejemplo para una cuenta. Cuando ejecutamos la utilidad de cierre de período para la cuenta de gastos de agua, obtenemos una propuesta para un asiento de cierre. La Utilidad de Cierre de Período se encuentra en el área de Utilidades del módulo de Administración. Utilidad de Cierre de Período: Elegir cuentas de P&G y períodos → Especificar cuenta de resultados acumulados y cuenta de cierre de período → Ejecutar el cierre de período → Obtener lista de propuestas para asientos de cierre → Aceptar cada propuesta individualmente. Ejemplo de Propuesta: Saldo de la Cuenta de Gastos de Agua. Aceptar y Contabilizar Propuesta.

---

## Diapositiva 13

Cuando aceptas la propuesta para la cuenta, se crean dos transacciones para cada cuenta y dos asientos contables se generan automáticamente para reflejar dichas transacciones. De esta forma, los informes financieros son correctos en ambos períodos. En el primer asiento contable, el sistema transfiere el saldo de la cuenta de Gastos e Ingresos a la cuenta de Cierre de Período el mismo día (el último día del período). Esto pone a cero los saldos de las cuentas. La cuenta de Cierre de Período es una cuenta transitoria o de compensación que retiene el saldo hasta el inicio del nuevo período. Utilidad de Cierre de Período. Debe: Cuenta de Gastos de Agua 11.500. Haber: Cuenta de Cierre de Período 11.500. Fecha de Contabilización: 31 de diciembre. Período de Cierre de Período. Asientos Contables Automáticos.

---

## Diapositiva 14

El segundo asiento contable se crea al mismo tiempo que el primero, pero está fechado el primer día del siguiente período de registro. En esa fecha, el sistema transfiere el saldo desde la cuenta de Cierre de Período a la cuenta de Resultados Acumulados. Ahora, la cuenta de Resultados Acumulados (cuenta del Balance) contiene el beneficio acumulado total traído de períodos anteriores. Puedes reconocer los asientos contables generados por la Utilidad de Cierre de Período porque tienen el origen "BC". En el informe del balance, puedes elegir si incluir o excluir estos tipos de transacciones seleccionando la casilla Agregar Saldos de Cierre. Si realizas contabilizaciones después de introducir los saldos de arrastre, debes repetir el proceso de cierre de período para incluir dichas contabilizaciones posteriores. Asientos Contables Automáticos. Primer asiento: Debe: Cuenta de Gastos de Agua 11.500 / Haber: Cuenta de Cierre de Período 11.500. Fecha: 31 de diciembre. Período de Cierre de Período. Segundo asiento: Debe: Cuenta de Cierre de Período 11.500 / Haber: Cuenta de Resultados Acumulados 11.500. Fecha: 1 de enero. Período de Registro siguiente.

---

## Diapositiva 15

Revisemos los estados disponibles para los períodos de registro. La ventana Períodos de Registro se encuentra en Inicialización del Sistema dentro del módulo de Administración. Si observamos el gráfico, vemos el ejercicio fiscal actual. Actualmente estamos en el subperíodo 3, que está desbloqueado. En el trabajo habitual, cuando un período de registro está Desbloqueado, cualquier usuario puede contabilizar transacciones con fecha de contabilización dentro del período. Al finalizar un período de registro, tras contabilizar todas las transacciones del período, puedes bloquear el período para que ningún usuario pueda realizar contabilizaciones adicionales. Haz clic en la flecha de enlace del período que deseas bloquear y cambia el estado de Desbloqueado a Bloqueado. El primer subperíodo del ejercicio fiscal actual también está bloqueado, al igual que todos los subperíodos del año anterior excepto el subperíodo 12. Durante los primeros períodos del nuevo ejercicio fiscal es posible que necesites contabilizar para el cierre del ejercicio anterior. Por eso, el último período del año anterior (subperíodo 12) tiene el estado "Período de Cierre". Además de Desbloqueado y Bloqueado, puedes establecer el estado del período a: Desbloqueado Excepto Ventas (solo usuarios autorizados pueden contabilizar excepto desde el menú Ventas A/R). Período de Cierre (solo personas autorizadas pueden contabilizar en el período; la autorización "Estado del Período: Período de Cierre" se define en Administración → Inicialización del Sistema → Autorizaciones → Autorizaciones Generales). Puedes hacer que el sistema cambie automáticamente el estado a Período de Cierre marcando la casilla correspondiente en la pantalla de Períodos de Registro. Estado del Período de Registro. Bloqueado / Período de Cierre / Período actual - Desbloqueado. Ejercicio fiscal anterior: subperíodos 1-12. Ejercicio fiscal actual: subperíodos 1-12. Bloqueado o Desbloqueado.

---

## Diapositiva 16

Resumen (1/2). Puntos clave: Puedes ejecutar el proceso de Cierre de Período al final de cada subperíodo y al final del período de registro principal (el Ejercicio Fiscal), o solo al final del período de registro principal (lo que cerrará todos los subperíodos). Hay cuatro tareas en el cierre de período: cambiar el estado del período de registro a Período de Cierre, realizar las tareas de fin de año (como la conciliación), usar la utilidad de cierre de período para cerrar el período, y cambiar el estado del período a Bloqueado.

---

## Diapositiva 17

Resumen (2/2). La utilidad de cierre de período pondrá a cero todos los saldos de las cuentas de Pérdidas y Ganancias al transferirlos a la cuenta de Resultados Acumulados (una cuenta del Balance en el cajón Capital y Reservas). Se crean automáticamente dos asientos contables para cada cuenta: Primero, el sistema transfiere el saldo de la cuenta de Gastos e Ingresos a la cuenta de Cierre de Período el último día del período. Segundo, el primer día del siguiente período, el sistema transfiere el saldo desde la cuenta de Cierre de Período a la cuenta de Resultados Acumulados. Puedes establecer el estado del período a uno de cuatro estados: Desbloqueado, Desbloqueado Excepto Ventas, Período de Cierre y Bloqueado.

---

## Diapositiva 18

Aviso legal SAP — sin cambios respecto al documento original.

---
