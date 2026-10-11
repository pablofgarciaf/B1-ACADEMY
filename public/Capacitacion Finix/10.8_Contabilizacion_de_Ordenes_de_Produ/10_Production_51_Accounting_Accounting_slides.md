# Transcripción por Diapositiva: 10_Production_51_Accounting_Accounting

## Diapositiva 1

Producción y MRP: Contabilidad de la Producción — SAP Business One Versión 10.0. Bienvenido al tema sobre la Contabilidad del Proceso de Producción.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Describir los asientos contables generados en cada etapa del proceso de producción. Identificar las cuentas WIP (Trabajo en Proceso) utilizadas. Explicar el tratamiento de las varianzas de costos y el Informe de Varianzas.

---

## Diapositiva 3

Escenario de Negocio. OEC Computers fabrica equipos informáticos y necesita entender cómo SAP Business One registra contablemente cada etapa del proceso productivo: desde el consumo de componentes hasta la recepción del producto terminado. El contable quiere asegurarse de que las cuentas WIP se manejen correctamente y poder analizar varianzas entre el costo planificado y el costo real.

---

## Diapositiva 4

Asiento Contable: Salida para Producción. Cuando se crea un documento de Salida para Producción (consumo de componentes): Debe: Cuenta WIP (Trabajo en Proceso) — por el valor de los componentes consumidos. Haber: Cuenta de Inventario — por el valor de los componentes retirados del almacén. Este asiento transfiere el valor de los componentes desde el inventario a la cuenta WIP, reflejando que los materiales están en proceso de fabricación.

---

## Diapositiva 5

Asiento Contable: Entrada desde Producción. Cuando se crea un documento de Entrada desde Producción (recepción del artículo terminado): Debe: Cuenta de Inventario del Artículo Terminado — por el costo estándar o real del artículo producido. Haber: Cuenta WIP — por el valor acreditado de la producción completada. Este asiento transfiere el valor del producto terminado desde WIP al inventario de artículos terminados.

---

## Diapositiva 6

Asiento Contable: Cierre de la Orden de Producción. Al cerrar la Orden de Producción, el sistema equilibra las cuentas WIP: Si el costo real es mayor que el costo de la Entrada desde Producción: la diferencia se registra como Debe en la cuenta de Varianza de Producción y Haber en WIP. Si el costo real es menor: la diferencia se registra como Haber en la cuenta de Varianza y Debe en WIP. El objetivo es que el saldo de la cuenta WIP quede en cero al cerrar la OP.

---

## Diapositiva 7

Cuentas WIP. Las cuentas WIP (Work In Process / Trabajo en Proceso) son cuentas contables que acumulan el valor de los materiales y recursos en proceso de producción. En SAP Business One, las cuentas WIP se configuran en la Determinación de Cuentas G/L (Gestión → Inicialización → Determinación de Cuentas G/L). Puede configurarse una cuenta WIP diferente para cada grupo de artículos o almacén, permitiendo un seguimiento detallado del inventario en proceso.

---

## Diapositiva 8

Varianza de Costos de Producción. La varianza de costos es la diferencia entre el costo planificado (basado en la LM y los precios estándar) y el costo real de producción. Causas comunes de varianza: precios de compra distintos a los estándar, consumos reales diferentes a los planificados, tiempos de recursos distintos a los estimados. SAP Business One registra automáticamente las varianzas al cerrar la Orden de Producción.

---

## Diapositiva 9

Cuentas Offset de Pérdidas y Ganancias (Países UE). En algunos países de la UE, la normativa contable requiere el uso de cuentas Offset de P&L para registrar los movimientos de inventario en producción. Estas cuentas de contrapartida permiten cumplir con los requisitos locales de presentación de estados financieros, manteniendo la trazabilidad de los movimientos de producción según las normativas contables vigentes en cada país.

---

## Diapositiva 10

Pestaña Resumen de la Orden de Producción. En la Orden de Producción, la pestaña Resumen muestra: Costo total planificado de la producción. Costo real acumulado hasta la fecha. Varianza entre el costo planificado y el real. Esta información permite al responsable de producción monitorear en tiempo real si la producción está dentro del presupuesto previsto.

---

## Diapositiva 11

Informe de Varianzas de Producción. Producción → Informes de Producción → Informe de Varianzas. Este informe muestra todas las Órdenes de Producción cerradas con sus varianzas de costo. Permite analizar por artículo, grupo de artículos o período: varianzas de materiales, varianzas de recursos (mano de obra, máquinas), varianzas totales. Es una herramienta clave para el control de costos y la mejora continua del proceso productivo.

---

