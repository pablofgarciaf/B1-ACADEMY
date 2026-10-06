# Transcripción por Diapositiva: 10_Item_22_UoM_Setup
## Diapositiva 1
**Artículos e Inventario: Configuración de Unidades de Medida**
Bienvenidos a esta clase sobre la Configuración de Unidades de Medida y Grupos de Unidades de Medida en SAP Business One versión diez punto cero. En esta sesión aprenderemos a configurar un catálogo unificado de unidades y cómo combinarlas en grupos con reglas de conversión exactas para compras, ventas y almacén.
---
## Diapositiva 2
**Objetivos de la Sesión**
Al finalizar esta clase serás capaz de estructurar grupos de unidades de medida, establecer equivalencias matemáticas respecto a la unidad base y vincular estos grupos a familias de artículos o productos individuales de forma óptima.
---
## Diapositiva 3
**Escenario Empresarial: OEC Computers**
Analicemos el caso de negocio real de OEC Computers. La compañía compra cables a distribuidores internacionales por rollos de cien metros, pero sus clientes técnicos compran bobinas de cincuenta metros o metros individuales fraccionados. Para evitar descuadres de stock, SAP Business One gestionará la conversión automática en cada transacción.
---
## Diapositiva 4
**Ejemplo de Negocio: Artículos de Cable**
Todos los cables se valorizan en inventario por metros, que será la unidad base. Cuando compras un rollo de cien metros, el inventario ingresa cien unidades base. Cuando vendes dos bobinas de cincuenta metros, el sistema deduce exactamente cien metros del stock, manteniendo el valor contable impecable.
---
## Diapositiva 5
**Metodología en 4 Pasos para Configurar UdM**
La implementación sigue una metodología secuencial estricta de cuatro pasos: primero, definimos el catálogo global de unidades en la tabla O U O M; segundo, construimos los grupos y sus fórmulas en O U G P; tercero, asignamos el grupo a la familia de artículos; y cuarto, definimos las unidades predeterminadas en la ficha del artículo.
---
## Diapositiva 6
**Paso 1: Definir la Lista Global de Unidades de Medida**
Comencemos con el Paso 1. Ingresamos al menú Gestión, seleccionamos Definición, luego Inventario y abrimos Unidades de Medida. En esta ventana registramos los códigos y nombres globales: Metro, Rollo y Bobina. Este catálogo maestro estará disponible para todas las operaciones de la empresa.
---
## Diapositiva 7
**Añadir Dimensiones Físicas y Cubicaje a las Unidades**
Opcionalmente, podemos asociar dimensiones físicas a cada unidad de medida: largo, ancho, alto y peso. Esto permite que SAP Business One calcule automáticamente el volumen y cubicaje de los paquetes para optimizar fletes de exportación y capacidad de bodega.
---
## Diapositiva 8
**Características Clave de las Unidades Globales**
La gran ventaja del catálogo global es la reutilización. Una misma unidad como Caja se puede usar en productos electrónicos y en suministros de papelería, sin necesidad de crear códigos duplicados como Caja10 o Caja20. Las reglas de cuántos productos contiene esa caja se definirán en el siguiente nivel.
---
## Diapositiva 9
**Concepto de Grupo de Unidades de Medida**
Un Grupo de Unidades de Medida es el corazón de la conversión. Cada grupo exige designar una Unidad de Medida Base. Como regla de oro de consultoría SAP, la unidad base debe ser siempre la Unidad de Medida de Inventario, para que todas las equivalencias matemáticas sean enteras y directas.
---
## Diapositiva 10
**Paso 2: Definir el Grupo de UdM y sus Fórmulas**
Para el Paso 2, navegamos a Grupos de unidades de medida. Creamos el grupo Cables de Red, fijamos Metro como unidad base, y en la matriz de conversión añadimos dos filas: un Rollo equivale a cien Metros, y una Bobina equivale a cincuenta Metros. El sistema validará la fórmula inmediatamente.
---
## Diapositiva 11
**Ventana de Configuración de Grupos de UdM**
La ventana de configuración de grupos te permite también asignar tipos de empaque predeterminados a cada unidad alternativa. Así, al generar una orden de entrega, el personal de bodega sabrá de inmediato si el producto debe cargarse en cajas, carretes o palets sin consultar manuales externos.
---
## Diapositiva 12
**Paso 3 Opción 1: Asignar a Nivel de Grupo de Artículos**
El Paso 3 ofrece dos alternativas. La opción más eficiente es asociar el grupo de UdM directamente al Grupo de Artículos en O I T B. De esta manera, cada vez que un asistente dé de alta un nuevo cable, heredará de forma automática toda la estructura sin riesgo de errores humanos.
---
## Diapositiva 13
**Paso 3 Opción 2: Asignar Directamente en Datos Maestros**
La segunda opción es asignar el grupo de forma manual en la pestaña General de los Datos Maestros del Artículo. Esta alternativa se utiliza cuando los productos dentro de una misma categoría tienen configuraciones de empaque atípicas o formatos especiales de importación.
---
## Diapositiva 14
**Paso 4: Fijar Valores Predeterminados en el Maestro**
Finalmente, en el Paso 4, configuramos los valores por defecto: en Datos de Compras establecemos Rollo, en Datos de Ventas establecemos Bobina, y en Datos de Inventario verificamos que Metro quede fijado. Además, podemos asignar un código de barras único para cada formato de venta.
---
## Diapositiva 15
**Resumen de Rutas de Menú para Parametrización**
Repasemos las cuatro rutas esenciales en el menú de SAP Business One: Gestión, Definición, Inventario, Unidades de medida; luego Grupos de unidades de medida; Grupos de artículos; y finalmente Datos maestros de artículo en el módulo de Inventario.
---
## Diapositiva 16
**Resumen y Reglas de Integridad del Negocio**
Para cerrar, recordemos la regla crítica de integridad: la Unidad de Medida de Inventario queda completamente bloqueada y no se puede modificar una vez que se registra la primera transacción con ese artículo. Planificar correctamente las unidades desde el inicio es el sello de un consultor profesional.
---
## Diapositiva 17
**Aviso Legal y Certificación Oficial**
Has completado la lección sobre Configuración de Unidades de Medida. Te invito a realizar la práctica en el simulador interactivo y comprobar tu dominio en la Evaluación con Master B1.
---
