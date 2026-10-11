# Transcripción por Diapositiva: 10_Item_42_SNBatch_Valuation

## Diapositiva 1

Artículos e Inventario: Método de Valoración por N/S y Lote — SAP Business One Versión 10.0. Bienvenido al tema sobre el Método de Valoración por Número de Serie y Lote.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Describir el Método de Valoración por N/S y Lote. Explicar cómo se rastrea el costo a nivel de número de serie o lote. Configurar la empresa y los artículos para utilizar este método de valoración.

---

## Diapositiva 3

Escenario de Negocio #1 — OC Chocolates. OC Chocolates fabrica y vende chocolate de lujo. Cada lote de producción tiene costos distintos según los ingredientes utilizados. La empresa necesita rastrear el costo exacto de cada lote para calcular correctamente el costo de ventas y valorar el inventario.

---

## Diapositiva 4

Escenario de Negocio #2 — OEC Computers. OEC Computers compra y revende equipos informáticos serializados. Los precios de compra varían según el proveedor y el momento de la compra. OEC necesita saber el costo exacto de cada artículo serializado para reflejar con precisión el costo de ventas.

---

## Diapositiva 5

Concepto: Método de Valoración por N/S y Lote. El Método de Valoración por N/S y Lote rastrea el costo de inventario a nivel de número de serie o número de lote individual. A diferencia de los métodos FIFO o Promedio Móvil que calculan un costo promedio o por orden de entrada, este método asigna un costo específico a cada serie o lote. Ventaja principal: máxima precisión en el costo de ventas y en la valoración del inventario para artículos con costos variables entre unidades.

---

## Diapositiva 6

Configuración a Nivel de Empresa. Administración → Inicialización del Sistema → Detalles de la Empresa → pestaña Inventario. Para habilitar el Método de Valoración por N/S y Lote es necesario que la empresa utilice Inventario Perpetuo (Use Perpetual Inventory). Esta configuración es un requisito previo para poder seleccionar el método de valoración por serie/lote en los artículos.

---

## Diapositiva 7

Configuración en el Artículo — Datos Maestros. En el Datos Maestros del Artículo, pestaña Datos de Inventario: seleccionar el Método de Valoración "Por N/S" o "Por Lote" según corresponda. Esta configuración define que el costo del artículo se gestionará de forma individual para cada número de serie o lote recibido. Solo puede configurarse antes de realizar transacciones con el artículo.

---

## Diapositiva 8

Bloquear Múltiples Recepciones del Mismo Lote. En el Datos Maestros del Artículo es posible activar la opción de bloquear múltiples recepciones para el mismo número de lote. Cuando esta opción está activa, el sistema impide recibir el mismo número de lote más de una vez, garantizando la unicidad de cada lote en el inventario.

---

## Diapositiva 9

Efecto de Múltiples Recepciones en el Costo del Lote. Si se permiten múltiples recepciones para el mismo lote, el costo del lote se recalcula usando la fórmula: Valor Total del Lote / Cantidad Total del Lote = Nuevo Costo Unitario del Lote. Ejemplo: Recepción 1: 10 unidades a $5 = $50. Recepción 2: 5 unidades a $7 = $35. Nuevo costo unitario = ($50 + $35) / 15 = $5.67 por unidad.

---

## Diapositiva 10

Campo Costo en Ventanas de Series y Lotes. Al abrir la ventana de detalles de un número de serie o un lote, se muestra el campo Costo que refleja el costo unitario asignado a esa serie o lote específico. Este costo es el que se utilizará al realizar salidas de inventario (ventas, consumos de producción) para ese número de serie o lote.

---

## Diapositiva 11

Proceso de Revaluación de Series y Lotes. Es posible revalutar el costo de series o lotes existentes en inventario mediante el documento de Revaluación de Inventario. Casos de uso: ajustar el costo después de recibir la factura definitiva del proveedor, corregir errores de costo, o actualizar costos tras gastos de importación adicionales.

---

## Diapositiva 12

Ejemplo Completo de Ciclo de Costos — Paso 1: Entrada de Mercancías OC (GRPO). OEC Computers recibe 5 laptops serializadas (N/S: L001 a L005) con una Entrada de Mercancías OC. Precio de compra: $800 por unidad. Cada número de serie queda registrado en el inventario con un costo de $800.

---

## Diapositiva 13

Ejemplo Completo — Paso 2: Costos de Importación. Se añaden costos de importación (flete, seguro, aduanas) a través de un documento de Costos de Importación vinculado a la Entrada de Mercancías OC. Los costos adicionales se distribuyen entre los 5 números de serie. Si los costos de importación totales son $100, cada N/S recibe $20 adicionales. Nuevo costo por N/S: $820.

---

## Diapositiva 14

Ejemplo Completo — Paso 3: Entrega al Cliente. Se crea una Entrega para vender la laptop con N/S L003 al cliente. SAP Business One utiliza el costo específico de la N/S L003 ($820) para registrar el costo de ventas en el asiento contable. Asiento: Debe Costo de Ventas $820 / Haber Inventario $820.

---

## Diapositiva 15

Ejemplo Completo — Paso 4: Devolución del Cliente. El cliente devuelve la laptop L003. Se crea una Devolución basada en la Entrega. SAP Business One revierte el costo original de $820 y devuelve la N/S L003 al inventario con su costo original.

---

## Diapositiva 16

Ejemplo Completo — Paso 5: Revaluación. Tras recibir una factura adicional del proveedor de logística, se revalúa la N/S L003. El nuevo costo se actualiza a $850. El asiento de revaluación registra la diferencia de $30 contra la cuenta de variación de inventario.

---

## Diapositiva 17

Informe de Auditoría de Inventario de Lotes y Series. Inventario → Informes de Inventario → Informe de Auditoría de Inventario de Lotes/Series. Este informe muestra el historial completo de movimientos y cambios de costo para cada número de serie o lote. Permite verificar la trazabilidad completa del costo desde la recepción hasta la venta, incluyendo revaluaciones y ajustes intermedios.

---

## Diapositiva 18

Comparación con Otros Métodos de Valoración. FIFO: costo basado en el orden de entrada. Promedio Móvil: costo promedio de todas las unidades en stock. Costo Estándar: costo fijo predefinido. Por N/S y Lote: costo exacto por unidad individual. El método por N/S y Lote es el más preciso pero también el más complejo de gestionar. Se recomienda para artículos de alto valor con costos variables entre unidades.

---

## Diapositiva 19

Consideraciones de Implementación. El método de valoración no puede cambiarse una vez que el artículo tiene transacciones. Requiere que la empresa tenga activado el Inventario Perpetuo. Los números de serie y lotes deben gestionarse con cuidado para asegurar la correcta asignación de costos. Se recomienda definir claramente los procesos de recepción, costos adicionales y revaluación antes de comenzar.

---

## Diapositiva 20

Puntos Clave — Resumen. El Método de Valoración por N/S y Lote rastrea el costo a nivel de número de serie o lote individual. Requiere Inventario Perpetuo activado a nivel de empresa. El costo se asigna en el momento de la recepción y se puede ajustar mediante revaluaciones. Al vender o consumir, se utiliza el costo específico de la serie o lote seleccionado. El Informe de Auditoría de Inventario de Lotes y Series proporciona trazabilidad completa del historial de costos.

---

## Diapositiva 21

![Diapositiva 21](Imagenes_Diapositivas/slide_021.webp)

---

## Diapositiva 22

![Diapositiva 22](Imagenes_Diapositivas/slide_022.webp)

---

## Diapositiva 23

![Diapositiva 23](Imagenes_Diapositivas/slide_023.webp)

---

## Diapositiva 24

![Diapositiva 24](Imagenes_Diapositivas/slide_024.webp)

---

## Diapositiva 25

![Diapositiva 25](Imagenes_Diapositivas/slide_025.webp)

---

## Diapositiva 26

Aviso legal SAP — sin cambios respecto al documento original.

---
