# Transcripción por Diapositiva: 10_Inven_21_PNP_PNPSales

## Diapositiva 1

Artículos e Inventario: Preparación de Mercancías en el Proceso de Ventas — SAP Business One Versión 10.0. Bienvenido al tema del Gestor de Preparación, Embalaje y Producción en el proceso de ventas. En esta formación aprenderemos a trabajar con el Gestor de Preparación, Embalaje y Producción, a generar listas de preparación y a llevar a cabo un proceso de preparación y embalaje en ventas.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Utilizar el Gestor de Preparación, Embalaje y Producción en el proceso de ventas para crear listas de preparación y documentos de ventas. Generar listas de preparación directamente desde documentos.

---

## Diapositiva 3

Introducción al Módulo de Preparación y Embalaje. Crear listas de preparación en el proceso de ventas: preparar artículos pedidos del almacén para su entrega al cliente. Crear listas de preparación en el proceso de producción: preparar artículos componentes para producción. Crear listas de preparación para transferencias de inventario: preparar artículos a transferir de un almacén o ubicación a otro. Crear documentos en el proceso de preparación: Entrega, Factura, Salida para Producción, Entrada desde Producción, Solicitud de Transferencia de Inventario, Transferencia de Inventario. El propósito principal del módulo de Preparación y Embalaje es facilitar la recolección de mercancías en el almacén. Una de sus funciones principales es la lista de preparación. El empleado de almacén puede usar la Lista de Preparación para recoger los distintos artículos necesarios y marcarlos como preparados. La Lista de Preparación puede usarse en: el proceso de ventas (al entregar mercancías a clientes), el proceso de producción (al preparar componentes para producción) y cuando los artículos se van a transferir a otra ubicación o almacén. Además de crear listas de preparación, en el Gestor de Preparación, Embalaje y Producción también se pueden emitir distintos documentos relevantes para ventas, producción y transferencia de inventario.

---

## Diapositiva 4

Escenario de Negocio. OEC Computers revende equipos informáticos y electrónicos a distribuidores. George es el gestor de almacén de OEC Computers. Junto con su consultor de SAP Business One, está a punto de implementar el módulo de Preparación y Embalaje en la empresa. George quiere incorporar el Gestor de Preparación, Embalaje y Producción en el proceso de ventas. Le gustaría crear listas de preparación para los artículos de los pedidos de ventas que están próximos a entregarse a los clientes. También quiere generar un albarán de embalaje para adjuntar a los paquetes entregados. El consultor explica a George cómo trabajar con el Gestor de Preparación, Embalaje y Producción para crear listas de preparación y aprovechar el gestor para crear entregas y facturas basadas en las ventas procesadas.

---

## Diapositiva 5

Proceso de Preparación y Embalaje en Ventas en OEC Computers. Crear Pedidos de Ventas → Preparar artículos para entrega y crear Listas de Preparación → Crear una Entrega o Factura basada en las filas del Pedido de Ventas seleccionadas. En el Gestor de Preparación, Embalaje y Producción. La imagen ilustra un proceso de ventas habitual en OEC Computers hasta la fase de entrega. Gran parte de este proceso puede realizarse en el Gestor de Preparación, Embalaje y Producción. Al crear Pedidos de Ventas, se añaden nuevos registros para las filas de artículos de estos documentos en el Gestor. Cuando llega el momento de la entrega, el empleado de almacén genera listas de preparación para los artículos a entregar. Una vez recogidos los artículos, el empleado puede crear un documento de Entrega para los artículos preparados. Este mismo proceso puede aplicarse a las Facturas de Reserva además de a los Pedidos de Ventas.

---

## Diapositiva 6

Gestor de Preparación, Embalaje y Producción. Inventario → Preparación y Embalaje → Gestor de Preparación, Embalaje y Producción. El primer paso en el Gestor es filtrar los datos relevantes en la ventana de Criterios de Selección, donde se eligen los documentos base para los que se generarán las listas de preparación. Luego se pueden filtrar los documentos base según distintos criterios como fecha, artículos concretos o incluso un campo definido por el usuario (CUD) añadido al documento base. Las opciones de filtro varían según el documento base elegido. En algunos casos, George filtra los pedidos de ventas por fecha de entrega para preparar solo los documentos planificados para ese mismo día. Además, OEC Computers gestiona un CUD para áreas de distribución; para entregar documentos por área, George también filtra por este campo. En este caso, George quiere ver todas las filas de Pedidos de Ventas y Facturas de Reserva. El estado Abierto indica filas que aún no han sido preparadas ni liberadas a ninguna lista de preparación. Una vez que elige Aceptar, el Gestor de Preparación, Embalaje y Producción se abre y muestra 3 cajones: Abierto, Liberado y Preparado.

---

## Diapositiva 7

Los Cajones del Gestor de Preparación, Embalaje y Producción. Abierto: filas de documentos abiertos antes de crear listas de preparación. Liberado: filas de documentos abiertos liberadas a listas de preparación pero aún no preparadas. Preparado: filas de documentos abiertos ya marcadas como preparadas. El cajón Abierto contiene todas las filas de documentos abiertos que aún no han sido preparadas. El cajón Liberado contiene todas las filas de documentos abiertos ya copiadas a listas de preparación pero que aún no han sido preparadas. El cajón Preparado contiene todas las filas de documentos abiertos ya marcadas como preparadas en la lista de preparación. Los cajones están ordenados de izquierda a derecha según el proceso de ventas tradicional, pero a cada cajón se puede acceder en cualquier momento.

---

## Diapositiva 8

Información del Gestor de Preparación, Embalaje y Producción. Dentro de cada cajón se puede ver información variada sobre las filas de documentos. Además de los detalles de las filas (artículo y cliente), también se muestra otra información importante para el proceso de preparación, como la cantidad abierta a preparar. La cantidad abierta se copia en la columna A Liberar, lo que permite liberar una cantidad menor a la lista de preparación si se desea. La columna Disponible para Liberar muestra la cantidad acumulada disponible en el almacén. Hay que tener en cuenta que cada fila depende de las cantidades propuestas para preparación en las filas anteriores. Esta columna permite verificar las cantidades disponibles en el almacén.

---

## Diapositiva 9

Liberar a Lista de Preparación. George selecciona las filas del pedido de ventas a liberar y elige el botón Liberar a Lista de Preparación. Este botón inicia un asistente de dos pasos. En el paso 1 se puede elegir si crear una única lista de preparación para todas las filas del pedido o dividir las filas en múltiples listas según los parámetros elegidos, como socios comerciales, documentos, grupos de artículos o almacenes. George decide crear una lista de preparación por cliente, por lo que divide las listas por socios comerciales. En este caso, al haber dos clientes en los pedidos de ventas, se generarán dos listas de preparación y se asignará un preparador a cada una.

---

## Diapositiva 10

Generar Lista de Preparación desde el Gestor de Preparación, Embalaje y Producción. En el paso 2 del asistente, el usuario puede cambiar datos para especificar un día de preparación, cambiar el nombre del preparador o añadir observaciones para la lista de preparación. En el paso 2 se ven las listas de preparación que se van a generar. George asignó manualmente la primera lista a Bill y las otras dos a Betty, y añadió una observación en la primera lista indicando que ese pedido debe prepararse lo antes posible. George elige el botón Generar y crea así tres listas de preparación. Las filas de Pedidos de Ventas que fueron liberadas a listas de preparación y aún no han sido preparadas aparecen en el cajón Liberado. Nota: al trabajar con almacenes gestionados por ubicaciones, el Asistente de Generación de Listas de Preparación incluye un paso adicional.

---

## Diapositiva 11

Las Listas de Preparación. Inventario → Preparación y Embalaje → Lista de Preparación. Se muestran las dos listas de preparación generadas, una por cliente. La lista número 9 contiene dos pedidos de ventas del mismo cliente; estos artículos podrán embalarse y enviarse juntos. Bill y Betty recibieron cada una su lista de preparación. Mirando la lista de Bill, se puede ver que logró preparar todos los artículos y lo indicó manualmente en la columna Preparado, y el estado de la lista es Preparado. También se pueden ver las observaciones que George añadió en el asistente de generación. En las filas de la lista de preparación se muestra, para cada fila del pedido, la cantidad pedida, la cantidad liberada/preparada y la cantidad disponible en inventario. Las listas de preparación se encuentran en el menú Inventario → Preparación y Embalaje → Lista de Preparación.

---

## Diapositiva 12

Crear Documentos desde el Gestor de Preparación, Embalaje y Producción. George abre el cajón Preparado para asegurarse de que los pedidos fueron preparados y para crear documentos de Entrega para las filas de pedidos preparadas. Para ello usa el botón Crear, que aparece en todos los cajones. Existen varias opciones para crear documentos desde la lista de preparación. Los tipos de documentos disponibles dependen del documento base. Como en este ejemplo la lista de preparación contiene filas de Pedidos de Ventas, solo puede crearse una Entrega o una Factura A/R. Al elegir la opción Entrega Manual, se abre un documento de Entrega en modo Agregar, ya con toda la información necesaria que puede editarse antes de agregarlo al sistema. George elige la opción Entrega Automática porque no desea modificar ningún dato; en ese caso, las entregas se crearán por cliente en segundo plano. Las demás opciones de creación se tratan en los siguientes temas de Preparación y Embalaje.

---

## Diapositiva 13

Albarán de Embalaje. Desde el menú contextual de una Entrega o Factura existente: Albarán de Embalaje. Antes de enviar las mercancías al cliente, se puede generar e imprimir un Albarán de Embalaje para una Entrega o Factura A/R. El Albarán de Embalaje se genera desde el menú contextual de la Entrega o Factura. En el albarán, el empleado de almacén elige el paquete relevante de la lista de tipos de paquete definidos en Administración → Configuración → Inventario → Tipo de Paquete. Luego mueve los artículos disponibles del lado izquierdo al contenido del paquete en el lado derecho, usando la flecha. Una vez completado el proceso, el empleado actualiza el albarán, lo imprime y lo adjunta al paquete. Nota: el peso total solo se calcula cuando se gestiona el peso de los artículos en los Datos Maestros del Artículo.

---

## Diapositiva 14

Generar Lista de Preparación Directamente desde un Documento. Una lista de preparación puede generarse directamente desde un Pedido de Ventas, una Factura de Reserva, una Orden de Producción o una Solicitud de Transferencia de Inventario. Esto se hace eligiendo la opción Generar Lista de Preparación desde el menú contextual. También es posible ver las listas de preparación existentes relacionadas con ese documento. Generar una lista de preparación directamente desde un documento concreto puede ser una opción rápida para gestionar la preparación de ese documento. Esta función está disponible para todos los documentos base disponibles en el Gestor: Pedidos de Ventas, Facturas de Reserva A/R, Solicitudes de Transferencia de Inventario y Órdenes de Producción. Las opciones del menú contextual son: Generar Lista de Preparación (genera y abre una lista de preparación para la cantidad abierta del documento) y Ver Listas de Preparación (abre las listas de preparación existentes relacionadas con el documento).

---

## Diapositiva 15

Procesar Documentos con Artículos No Inventariables. Las filas de artículos no inventariables pueden procesarse en el Gestor de Preparación, Embalaje y Producción y, por tanto, pueden usarse en la creación de documentos. Incluir artículos no inventariables en el Gestor garantiza que estos artículos sean facturados. En la vida real, los artículos no inventariables como honorarios de técnico o tarifas de soporte aparecen frecuentemente en documentos de ventas. Las filas de artículos no inventariables pueden incluirse en listas de preparación y copiarse a entregas o facturas usando la opción Crear. Nota: los artículos no inventariables no pueden copiarse a documentos de transferencia de inventario. Los recursos de producción también pueden copiarse a una lista de preparación. Incluir artículos no inventariables y recursos de producción en el Gestor es una forma excelente de garantizar que sean facturados o consumidos.

---

## Diapositiva 16

Puntos Clave – Página 1. El Gestor de Preparación, Embalaje y Producción admite distintos procesos: Ventas, Producción y Transferencia de Inventario. El Gestor permite la creación masiva de listas de preparación y también la generación de documentos. El Gestor tiene tres cajones para mostrar los distintos estados de las filas de documentos: abierto, liberado y preparado. Al liberar los artículos para preparación, se abre un asistente de dos pasos con diferentes opciones para la creación de listas de preparación, como la división de listas y el cambio masivo de datos. La cantidad preparada se actualiza en la lista de preparación y transforma el estado de la fila del artículo a Preparado.

---

## Diapositiva 17

Puntos Clave – Página 2. Distintos documentos como Entregas y Facturas pueden crearse desde el Gestor de Preparación, Embalaje y Producción para filas de Pedidos de Ventas, lo que permite al usuario trabajar desde una sola ventana. Los albaranes de embalaje pueden generarse para una entrega o factura desde el menú contextual del documento. En lugar de abrir el Gestor, el usuario puede crear rápidamente una lista de preparación para un documento individual desde el menú contextual de cualquier pedido de ventas, factura de reserva A/R, orden de producción o solicitud de transferencia de inventario. Los artículos no inventariables también pueden copiarse a listas de preparación y documentos destino, lo que permite un proceso de ventas completo desde el Gestor.

---

## Diapositiva 18

Apéndice — Tabla de Correspondencia de Opciones de Creación de Documentos. Filas de documentos base (documentos existentes) → Opción de creación (nuevos documentos a crear): Pedidos de Ventas, Facturas de Reserva → Entrega Manual + Automática; Pedidos de Ventas → Factura; Órdenes de Producción → Salida para Producción; Órdenes de Producción → Entrada desde Producción; Todas las filas excepto Solicitud de Transferencia de Inventario → Solicitud de Transferencia de Inventario; Todas las filas → Transferencia de Artículos/Componentes; Solicitud de Transferencia de Inventario → Transferencia de Inventario. (*Excluye artículos con método de retroimputación.) Las opciones del botón Crear en los cajones del Gestor son sensibles al contexto. No todas las filas tienen que ir al mismo documento; se pueden elegir las filas a incluir en cada documento creado. Si se intenta crear nuevos documentos basados en filas de documentos no relevantes para un tipo de documento determinado, el sistema muestra un mensaje de error.

---

## Diapositiva 19

Aviso legal SAP — sin cambios respecto al documento original.

---
