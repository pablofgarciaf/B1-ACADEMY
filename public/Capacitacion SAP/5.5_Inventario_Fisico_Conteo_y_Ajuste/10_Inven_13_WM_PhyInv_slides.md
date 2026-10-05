# Transcripción por Diapositiva: 10_Inven_13_WM_PhyInv

## Diapositiva 1

Artículos e Inventario: Inventario Físico — SAP Business One Versión 10.0. Bienvenido al tema de gestión de inventario sobre inventario físico.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Describir los pasos del proceso para el recuento de inventario. Para información más detallada sobre el inventario físico, se recomienda leer la Guía Práctica: Cómo Realizar el Recuento de Inventario en SAP Business One.

---

## Diapositiva 3

Escenario de Negocio. Tu empresa necesita tener un recuento preciso del stock almacenado físicamente en los almacenes de la empresa. La empresa usa inventario permanente, que realiza un seguimiento de la recepción y uso del inventario y calcula la cantidad disponible. La empresa necesita un recuento físico periódico del inventario por razones financieras y fiscales, por lo que ha configurado un ciclo de inventario vinculado a recomendaciones de recuento cíclico. Si el recuento físico revela discrepancias respecto a la cantidad registrada en el sistema, se contabiliza la diferencia de cantidad.

---

## Diapositiva 4

Recuento de Inventario. Puedes configurar ciclos de inventario con recomendaciones para recuentos periódicos. Hacer coincidir la disponibilidad real de artículos con las cantidades del sistema es crucial para la gestión de inventario. El Recuento de Inventario es una actividad recurrente en todo negocio basado en artículos. Puedes configurar ciclos de inventario con recomendaciones para recuentos periódicos que se activen anualmente, mensualmente, bimensualmente, semanalmente o incluso diariamente.

---

## Diapositiva 5

Visión General del Proceso de Recuento Cíclico. Alerta para artículos A → Imprimir hoja de recuento → Recuento → Introducir resultados → Contabilizar diferencias de cantidad. Ciclos de recuento: artículos A: 6 veces/año, artículos B: 6 veces/año, artículos C: 1 vez/año. El recuento cíclico es el proceso de contar artículos de inventario a lo largo del año según un calendario, de modo que todos los artículos se cuenten al menos una vez al año. Primero configura los distintos ciclos necesarios. Luego, en la determinación del recuento cíclico, asigna los ciclos a grupos de artículos o subníveis de almacén y configura una alerta. La alerta envía una recomendación de recuento a un usuario específico, quien puede seleccionar los artículos para el recuento. Una vez seleccionados los artículos, puedes bloquearlos para el recuento, lo que impide cualquier transacción de inventario hasta que el artículo haya sido contado y se hayan realizado las contabilizaciones correspondientes. Imprime una hoja de recuento para que la rellenen los inventariadores. El último paso es contabilizar las diferencias de cantidad detectadas. Desde el documento de recuento de inventario, puedes copiar las diferencias a un documento de contabilización de inventario.

---

## Diapositiva 6

Configuración — Paso 1: Configurar Ciclos. Primero configuras los ciclos de inventario necesarios. Puedes configurar ciclos para diferentes intervalos. Administración → Configuración → Inventario → Ciclos de Inventario. Ciclo 1: 6 veces/año; Ciclo 2: 1 vez/año. Para cada ciclo, establece la unidad básica de recurrencia (por ejemplo, diaria, semanal, mensual, anual) y luego define los detalles: frecuencia de repetición, fecha de inicio exacta o día relativo (por ejemplo, "anualmente, cada segundo martes de enero"). Así puedes escalonar las fechas de inicio de cada ciclo para gestionar mejor la carga de trabajo del recuento físico.

---

## Diapositiva 7

Configuración — Paso 2: Determinación del Recuento Cíclico. Administración → Configuración → Inventario → Determinación del Recuento Cíclico. Impresoras: 6 veces/año. Accesorios: 6 veces/año. Artículos generales: 1 vez/año. El segundo paso es configurar la determinación del recuento cíclico para obtener recomendaciones. Puedes definir los recuentos cíclicos de inventario por grupo de artículos o, si usas gestión de ubicaciones en el almacén, por subníveis de almacén. Una vez realizados estos ajustes, puedes configurar alertas para los grupos de artículos o subníveis de almacén que necesitan recuento.

---

## Diapositiva 8

Proceso: Recibir Alertas. El usuario designado recibe una alerta con las recomendaciones de recuento cíclico. El usuario puede seleccionar qué artículos contar y abrir un documento de recuento de inventario desde la alerta pulsando el botón Recuento de Inventario. También puedes usar la ruta de menú para seleccionar y ver las recomendaciones de recuento cíclico abiertas: Inventario → Transacciones de Inventario → Recomendaciones de Recuento Cíclico.

---

## Diapositiva 9

Proceso: Recuento de Inventario. El documento de Recuento de Inventario centraliza el proceso de registro y gestión del recuento de inventario. En el documento de Recuento de Inventario puedes: bloquear los artículos que planeas contar para que no se produzcan movimientos de inventario durante el recuento; configurar el recuento para realizarlo por uno o varios inventariadores; asignar el recuento a equipos o usuarios/empleados individuales; e imprimir una hoja de recuento para que la rellenen los inventariadores. Cuando finaliza el recuento, usas este documento para introducir las cantidades contadas.

---

## Diapositiva 10

Opción de Recuento de Inventario: Múltiples Inventariadores. Pueden asignarse múltiples inventariadores individuales, equipos de inventariadores o una combinación de ambos para contar artículos en la misma área. Los equipos o individuos introducen sus propios resultados, que luego pueden compararse. Ten cuidado de elegir el tipo de recuento correcto (contador único o múltiple) en el documento de Recuento de Inventario. Si cambias esta configuración después de haber introducido resultados, podrías afectar a los datos ya introducidos. Tipos: Contador Único / Múltiples Contadores Individuales / Recuento en Equipo / Combinación de Equipo e Individual.

---

## Diapositiva 11

Ejemplo de Múltiples Inventariadores. Tres empleados cuentan una sección de un almacén: Keisha cuenta toda la sección sola. Lee y Saúl trabajan como equipo. Recuento de Saúl: 76. Recuento de Lee: 75. Total equipo: 151. Recuento de Keisha: 151. El resultado de Keisha se compara con el resultado del equipo de Saúl y Lee. Cuando finaliza el recuento, introduce las cantidades de cada individuo en el documento de Recuento de Inventario. El sistema suma automáticamente los resultados de Lee y Saúl para su equipo.

---

## Diapositiva 12

Proceso: Comparar Resultados y Contabilizar Diferencias. Cuando hay una discrepancia respecto a la cantidad esperada en el almacén: Opción 1: volver a contar o ajustar las cantidades contadas. Opción 2: copiar la diferencia a una contabilización de inventario. Para gestionar las discrepancias tienes dos opciones principales. Opción 1 — Ajustar Cantidades Contadas: si sospechas que los inventariadores han contado incorrectamente, puedes marcar el artículo como no contado y realizar un nuevo recuento; también puedes ajustar las cantidades contadas a las cantidades del sistema. Opción 2 — Copiar a Contabilización de Inventario: elige qué valores copiar al documento de Contabilización de Inventario. Si los inventariadores no coinciden, puedes seleccionar uno de los recuentos; si todos coinciden, puedes tomar los artículos sin diferencias entre contadores.

---

## Diapositiva 13

Opciones Adicionales en el Proceso. Gestionar recuentos para ubicaciones en el almacén. Contar números de serie y lotes. Contar diferentes unidades de medida. Importar artículos y recuentos en documentos de Recuento de Inventario. Establecer fechas de documentos de inventario o fechas de contabilización de inventario como predeterminadas para las cantidades en el almacén.

---

## Diapositiva 14

Opciones: Gestionar Recuentos para Ubicaciones en el Almacén. Para almacenes con ubicaciones en el almacén, puedes: introducir ubicaciones en el documento de Recuento de Inventario, introducir cantidades a nivel de cada ubicación y ver las cantidades en stock por ubicación.

---

## Diapositiva 15

Opciones: Contar Números de Serie y Lotes. Al contar números de serie y lotes, si hay una discrepancia puedes eliminar o agregar números de serie o de lote. Ejemplo: OEC Computers realizó un recuento de un artículo de impresora. El inventario actual mostraba 54 en stock. El inventariador introdujo un recuento de 55 en el documento de Recuento de Inventario y creó un número de serie provisional. Al contabilizar las diferencias de recuento en un documento de Contabilización de Inventario, el número de serie provisional se convirtió en un número de serie real.

---

## Diapositiva 16

Opciones: Contar Diferentes Unidades de Medida. Un artículo puede almacenarse en diferentes unidades de medida en un almacén. Los grupos de unidades de medida contienen las relaciones entre unidades. El sistema convierte automáticamente las distintas unidades a la unidad de medida de inventario. Ejemplo: la unidad de inventario es el paquete; hay 24 paquetes en una caja. Se contaron 7 paquetes y 10 cajas. Total contado: (24 × 10) + 7 = 247 paquetes.

---

## Diapositiva 17

Opciones: Importar Artículos y Recuentos. Definir la plantilla de importación → Introducir datos en Excel → Importar artículos y recuentos → Ajustar según sea necesario → Agregar el documento. Usa la herramienta Importar desde Excel para importar artículos y recuentos. Esta opción es muy útil para empresas con un gran número de artículos y almacenes extensos. Puedes importar los campos para códigos de artículo y descripciones, códigos de almacén, ubicaciones, códigos de barras, unidades de medida, lotes, números de serie y cantidades contadas.

---

## Diapositiva 18

Opciones: Fecha Predeterminada para Cantidades en el Almacén. Administración → Inicialización del Sistema → Configuración de Documentos → Por Documento → Documento de Recuento de Inventario. Calcular la cantidad en el almacén en la fecha de recuento basada en: Fecha de Creación de Transacciones / Fecha de Contabilización de Transacciones. En la mayoría de los casos, la mejor fecha es la fecha de creación de transacciones. Sin embargo, la fecha de contabilización es otra opción para clientes que crean documentos de inventario con una fecha de contabilización diferente a la fecha actual.

---

## Diapositiva 19

Ejemplo: Fecha Predeterminada para Cantidades en el Almacén. 6 de septiembre: llega al almacén un envío con cantidad de 10. 8 de septiembre: se crea una Entrada de Mercancías para la cantidad 10 (con fecha de contabilización del 6 de septiembre). 7 de septiembre: se realiza el recuento físico de inventario. 9 de septiembre: se crea el documento de Recuento de Inventario (con fecha de recuento del 7 de septiembre). Predeterminado como Fecha de Contabilización: la cantidad en el almacén incluye los 10. Predeterminado como Fecha de Creación: la cantidad en el almacén no incluye los 10. *Más información sobre esta opción disponible en la nota 1899113.

---

## Diapositiva 20

Resumen. Puntos clave: El Recuento de Inventario se realiza periódicamente en todo negocio basado en artículos para hacer coincidir el recuento físico real con las cantidades guardadas en el sistema. Puedes configurar ciclos de inventario con recomendaciones para recuentos periódicos que se activen anualmente, mensualmente, semanalmente o incluso diariamente. Los ciclos pueden vincularse a grupos de artículos y, en almacenes con ubicaciones, a subníveis de almacén. Las alertas te recuerdan sobre los artículos que deben contarse. Los recuentos de inventario pueden realizarse por individuos, equipos o una combinación de ambos. El documento de Recuento de Inventario coordina el recuento por múltiples inventariadores, registra los resultados, gestiona el proceso y permite copiar las diferencias a documentos de contabilización de inventario.

---

## Diapositiva 21

Aviso legal SAP — sin cambios respecto al documento original.

---
