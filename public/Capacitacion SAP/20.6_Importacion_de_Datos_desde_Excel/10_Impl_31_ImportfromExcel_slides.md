# Transcripción por Diapositiva: 10_Impl_31_ImportfromExcel

## Diapositiva 1

Herramientas de Implementación: Importar desde Excel — SAP Business One Versión 10.0. En este curso aprenderás a importar datos desde Microsoft Excel.

---

## Diapositiva 2

Objetivos. Usando la utilidad Importar desde Excel, importa múltiples registros para: Datos maestros de interlocutores comerciales / Datos maestros de artículos / Datos de listas de precios / Números de catálogo de interlocutores comerciales / Asientos contables. También puedes acceder a la utilidad Importar desde Excel desde las ventanas de saldos de apertura, configuración de números de serie y lotes, y asientos contables.

---

## Diapositiva 3

Escenario de Negocio. Cada mes tus distribuidores te envían una hoja de cálculo de Microsoft Excel con datos de clientes nuevos y actualizados. Proporcionas soporte de garantía a estos clientes y por lo tanto necesitas actualizar esta información en la base de datos de la empresa. Solución: la utilidad Importar desde Excel proporciona una forma sencilla de importar datos desde una hoja de cálculo. Muchas empresas necesitan importar periódicamente datos maestros en bloque, especialmente cuando tratan con distribuidores y otros terceros.

---

## Diapositiva 4

Visión General.

---

## Diapositiva 5

Utilidad Importar desde Excel. La utilidad Importar desde Excel puede importar las siguientes categorías de datos: Datos maestros de interlocutores comerciales / Datos maestros de artículos / Precios en una lista de precios / Números de catálogo de interlocutores comerciales / Asientos contables. Nota: existe una utilidad similar disponible para importar datos maestros de activos fijos. Para acceder a esta utilidad, primero debes habilitar los activos fijos en los Datos de la Empresa. Acceso: Administración → Importación/Exportación de Datos → Importación de Datos → Importar desde Excel. O desde la pestaña Gestión de Datos de la ventana Tareas de Implementación.

---

## Diapositiva 6

Proceso General. Seleccionar tipo de datos y abrir el archivo de hoja de cálculo → Preparar la hoja de cálculo → Guardar como archivo *.txt → Cerrar el archivo txt → Asignar columnas de la hoja de cálculo a los campos del objeto seleccionando de la lista desplegable → Elegir un método de importación y ejecutar la importación. Nota: no todos los campos pueden importarse. Para usar esta utilidad, primero preparas los datos en una hoja de cálculo de Microsoft Excel. Guarda este archivo como un archivo txt delimitado por tabulaciones y ciérralo. En la ventana Importar desde Excel, selecciona el tipo de datos y busca el archivo de hoja de cálculo guardado. Luego asigna cada columna de la hoja de cálculo (A, B, C, etc.) a un campo del objeto seleccionando los campos de la lista desplegable. Para continuar con la importación, elige un método de importación y ejecuta la importación.

---

## Diapositiva 7

Documentación sobre Nombres de Campos. La utilidad Importar desde Excel usa la interfaz DI API para acceder a la base de datos. Para ayudarte a asignar los campos del objeto, puedes consultar la Referencia de Tablas de Base de Datos (archivo REFDB). Selecciona un objeto en la Referencia de Tablas de Base de Datos para ver los nombres de campos, descripciones, valores predeterminados y restricciones. También puedes mostrar los nombres de la tabla y del campo de la base de datos marcando la casilla Mostrar Nombre de Campo de la Base de Datos.

---

## Diapositiva 8

Guardar la Asignación. Opción de guardar las asignaciones actuales como un archivo de plantilla para reutilizarlas más adelante. Cuando abres la ventana Importar desde Excel, el sistema muestra las asignaciones usadas en la importación anterior para el mismo objeto. Para comenzar una nueva asignación, elige el botón Borrar Asignación. Después de asignar los campos al orden de la hoja de cálculo, puedes guardar la asignación como una plantilla para reutilizarla más adelante.

---

## Diapositiva 9

Reglas y Consejos para la Hoja de Cálculo. Reglas generales: No incluir una fila de encabezado en la hoja de cálculo. Formatear las celdas como Texto para evitar truncamientos. Si el campo tiene un valor predeterminado, no es necesario introducirlo (por ejemplo, código de moneda, código de grupo). Cumplir con las restricciones de los campos, como tipo, longitud máxima y valores permitidos. Antes de ejecutar la utilidad, guarda la hoja de cálculo como un archivo de texto delimitado por tabulaciones (*.txt). Cierra el archivo de texto. No cerrar el archivo antes de ejecutar la importación resultará en un error.

---

## Diapositiva 10

Métodos de Importación. Método de Importación / Datos Maestros de IC / Datos Maestros de Artículos / Asientos / Listas de Precios / Números de Catálogo IC: Agregar Nuevos Registros y Actualizar Existentes (solo IC y Artículos) / Agregar Nuevos Registros Sin Actualizar Existentes (todos) / Actualizar Registros Existentes Sin Añadir Nuevos (IC, Artículos y Precios). Los métodos de importación disponibles son: Agregar nuevos registros y actualizar los existentes: actualiza registros con claves coincidentes, disponible para datos maestros de IC y artículos. Agregar nuevos registros sin actualizar los existentes: disponible para IC, artículos, asientos y números de catálogo de IC. Si ya existe un registro con la misma clave, los datos no se importarán. Actualizar registros existentes sin añadir nuevos: disponible para IC, artículos y datos de listas de precios. Si no existe un registro con la misma clave, la importación fallará.

---

## Diapositiva 11

Autorización General. Se requiere autorización general para acceder a la utilidad Importar desde Excel: Los usuarios deben estar autorizados para usar la utilidad. Puedes controlar qué usuarios pueden acceder a la utilidad de importación usando autorizaciones generales. La autorización es "Importar desde Excel".

---

## Diapositiva 12

Importación de Datos Maestros de Interlocutores Comerciales.

---

## Diapositiva 13

Datos Maestros de Interlocutores Comerciales. Selecciona Interlocutor Comercial como tipo de datos. Los datos pueden introducirse en cualquier orden en la hoja de cálculo, ya que asignarás cada columna a un campo en los datos maestros. La lista desplegable muestra los campos que pueden importarse para el objeto IC. Ten en cuenta que: Los valores para el campo Tipo IC son C (cliente), S (proveedor) y L (candidato). La Moneda del IC es el código de moneda. El Código de Grupo es en realidad el nombre del grupo; si no se introduce un nombre de grupo, el IC se asigna automáticamente al primer grupo del sistema.

---

## Diapositiva 14

Interlocutores Comerciales – Tabla de Persona de Contacto. Los campos de contacto se muestran en un orden fijo que debes seguir en la hoja de cálculo. La información de contacto del IC se conserva en la tabla secundaria OCPR. Para importar datos de contacto en la misma fila que los campos de encabezado, selecciona el campo Persona de Contacto… en la hoja de cálculo. Cuando seleccionas este campo, varios campos de la tabla secundaria se muestran en un orden fijo, por lo que debes asegurarte de que la hoja de cálculo siga este orden.

---

## Diapositiva 15

Importación de Múltiples Contactos para un Interlocutor Comercial. Para importar múltiples personas de contacto para un IC se requieren dos pasos: 1. Primero importa la información de encabezado para los ICs. 2. Luego prepara otra hoja de cálculo para los registros secundarios: introduce el Código IC respectivo en cada fila (columna A), en las demás columnas introduce los campos de contacto requeridos. Selecciona el método de importación Actualizar Registros Existentes Sin Añadir Nuevos.

---

## Diapositiva 16

Interlocutores Comerciales – Direcciones de Facturación y Envío. Los datos de dirección se conservan en la tabla secundaria CRD1. Para importar una dirección de facturación o envío en la misma fila que los datos de encabezado, selecciona el campo clave Dirección de Facturación o Envío (marcado en azul). Los campos de dirección se asignan automáticamente en un orden fijo; sigue este orden en la hoja de cálculo.

---

## Diapositiva 17

Interlocutores Comerciales – Múltiples Direcciones de Facturación y Envío. Para importar múltiples direcciones de envío o facturación para un IC: primero importa los datos de encabezado, prepara otra hoja de cálculo y referencia el Código IC en la columna A. Selecciona las direcciones de la lista desplegable y elige el método de importación Actualizar Registros Existentes Sin Añadir Nuevos.

---

## Diapositiva 18

Importación de Datos Maestros de Artículos.

---

## Diapositiva 19

Objeto de Datos Maestros de Artículos. Para importar datos maestros de artículos, selecciona Artículos como tipo de datos. Los campos pueden introducirse en cualquier orden en la hoja de cálculo y luego asignarse en la ventana Importar desde Excel. Para los datos maestros de artículos: El Tipo de Artículo es I (artículo), L (mano de obra) o T (viaje). El Grupo de Artículos es el nombre del grupo, no el código. El campo Establecer Cuentas G/L Por requiere los valores W, C o L para indicar el nivel de determinación de cuentas G/L: almacén, grupo de artículos o nivel de artículo. El método de valoración: A (precio medio ponderado), S (estándar), F (FIFO) y B (método de valoración de serie/lote). El método de gestión de números de serie es A (en cada transacción) o R (solo en salida).

---

## Diapositiva 20

Grupos UdM. Todos los artículos se importan automáticamente con un Grupo UdM Manual. No puedes importar un Grupo UdM no manual usando la utilidad de importación, ya que el campo (OITM.UgpEntry) no está disponible en la lista desplegable.

---

## Diapositiva 21

Datos Maestros de Artículos con Precio Unitario. El precio unitario de un artículo (ITM1) puede importarse en la misma fila que los detalles del artículo seleccionando el campo Código de Lista de Precios (marcado en azul). Después de hacer la selección, se muestra un orden fijo de campos de lista de precios, y debes seguir este orden en tu hoja de cálculo.

---

## Diapositiva 22

Datos Maestros de Artículos con Precio Unitario (cont.). El código de lista de precios es un número asignado cuando se crea inicialmente una lista de precios. Para ver los códigos, ejecuta una consulta en la tabla OPLN. En la hoja de cálculo, después del código de lista de precios, introduce el precio con el código de moneda. Puedes introducir el precio unitario en hasta 2 monedas adicionales. El campo Código UdM es obligatorio y para un nuevo artículo el único valor permitido es Manual.

---

## Diapositiva 23

Importación de Listas de Precios.

---

## Diapositiva 24

Importación de Precios a una Lista de Precios. Puedes importar múltiples precios a una lista de precios seleccionando Lista de Precios como tipo de datos. Los datos maestros de artículos deben existir ya. La lista de precios debe existir ya en la tabla OPLN. El único método de importación permitido es Actualizar Registros Existentes Sin Añadir Nuevos. Puedes seleccionar Nº de Artículo o Nº de Artículo con UdM. Al hacer esta selección, el conjunto de campos requeridos se selecciona automáticamente.

---

## Diapositiva 25

Importación de Precios Unitarios – 1. Para importar o actualizar el precio unitario de un artículo, selecciona Nº de Artículo e introduce en la hoja de cálculo: Código de lista de precios en la columna A / Código de artículo en la columna B / Lista de precios base y factor (opcionales) en las columnas C-D / Precio del artículo y moneda en las columnas E-F / Precio opcional en monedas adicionales en las columnas G-J.

---

## Diapositiva 26

Importación de Precios Unitarios – 2. Puedes importar/actualizar múltiples precios de artículos en la misma fila repitiendo la selección del campo Nº de Artículo. Asegúrate de seguir el orden fijo de los campos y dejar columnas en blanco en la hoja de cálculo donde sea necesario.

---

## Diapositiva 27

Importación de Precios UdM – 1. Para un artículo con precio en múltiples unidades de medida (Grupo UdM no Manual), puedes importar el precio de la unidad base seleccionando Nº de Artículo. Puedes importar los precios para las unidades de medida seleccionando Nº de Artículo con UdM. Nota: antes de importar los precios UdM, asegúrate de que los Códigos UdM relevantes existan para el artículo en la ventana Precios UdM. La utilidad no importa los Códigos UdM, sino que actualiza los campos Precio y/o Reducir en % en las filas de la tabla Precios UdM.

---

## Diapositiva 28

Importación de Precios UdM – 2. En la hoja de cálculo puedes incluir el precio de la unidad base y los precios UdM en la misma fila. Para el precio de la unidad base, selecciona Nº de Artículo en la columna B. Luego selecciona Nº de Artículo con UdM en la columna K (y así sucesivamente). Para el precio UdM puedes introducir el precio real (columna M) o el importe de reducción (columna N).

---

## Diapositiva 29

Importación de Precios UdM – 3. Como resultado de la importación, la entrada de la lista de precios se actualiza para los artículos, en la moneda principal y en cualquier moneda adicional especificada en la hoja de cálculo. El precio base del artículo se actualiza en la lista de precios, y los precios de las unidades de medida se actualizan en la ventana Precios UdM.

---

## Diapositiva 30

Otros Objetos Admitidos.

---

## Diapositiva 31

Números de Catálogo de Interlocutores Comerciales. Para importar números de catálogo de un IC, selecciona Números de Catálogo de Interlocutores Comerciales como tipo de datos. Introduce cada número de catálogo en una fila separada. Puedes configurar SAP Business One para usar los números de artículo de clientes y proveedores en paralelo a tus propios números de artículo. Solo se requieren tres campos en la hoja de cálculo: código de artículo, código de IC y el número de catálogo que el IC usa para el artículo. El nombre de la tabla es OSCN.

---

## Diapositiva 32

Asientos Contables. Selecciona Asiento como objeto. El único método de importación es Agregar Nuevos Registros Sin Actualizar Existentes. Los asientos tienen una sección de encabezado y de líneas; la columna A debe contener H (encabezado) o L (línea). Los campos de encabezado tienen un formato fijo (columnas A-M) que se muestra al seleccionar el objeto. Los campos de líneas se introducen en una fila separada a partir de la columna N. La columna N indica si la línea es para una cuenta G/L o un interlocutor comercial. Cada asiento es seguido por sus líneas. Múltiples asientos pueden introducirse; la utilidad interpretará todas las líneas como pertenecientes al mismo asiento hasta que un nuevo asiento comience con H en la columna A.

---

## Diapositiva 33

Importación de Asiento Único. El botón Importar desde Excel en el formulario de asiento permite importar un único asiento desde una hoja de cálculo. Útil para importar un asiento con muchas filas. Ten en cuenta que algunas casillas de verificación en el encabezado del asiento (por ejemplo, IVA Automático) no son compatibles con la utilidad de importación. El sistema trata la importación igual que la escritura manual. Algunos campos del asiento no son compatibles: los campos Plantilla y Tipo de Plantilla en el encabezado, todas las casillas de verificación en el encabezado (excepto la casilla Informe UE), y el campo Nombre de Cuenta G/L/IC en las líneas.

---

## Diapositiva 34

Importación de Saldos de Apertura – 1 de 2. Se proporciona acceso a la utilidad Importar desde Excel directamente desde un botón en las tres ventanas de saldos de apertura: Cuentas G/L / Interlocutores Comerciales / Inventario. En las tres ventanas introduces primero los datos de encabezado y luego usas la utilidad Importar desde Excel para importar los datos de la cuadrícula (fila). Para Cuentas G/L e Interlocutores Comerciales, el botón Importar desde Excel solo se activa después de seleccionar la cuenta de compensación del saldo de apertura.

---

## Diapositiva 35

Importación de Saldos de Apertura – 2 de 2. La ventana de Saldos de Apertura se abre con el tipo de objeto preseleccionado. Para ejecutar la importación: selecciona y abre el archivo de hoja de cálculo, asigna las columnas en la lista desplegable de Importar desde Excel a las columnas de la hoja de cálculo, selecciona el método de importación, elige Importar. Después de la importación, se te devolverá a la ventana de transacción de saldo de apertura, donde eliges Agregar para confirmar los datos importados en la base de datos. Los datos no se guardan en la base de datos hasta que presionas Agregar.

---

## Diapositiva 36

Documentos de Inventario Físico y Contabilización de Inventario. Puedes importar registros de inventario usando Importar desde Excel para los siguientes documentos: documentos de inventario físico y documentos de contabilización de inventario. Para iniciar la importación, abre la lista desplegable Agregar Artículos y en lugar de seleccionar los artículos, elige Importar Artículos. Se abrirá la ventana Importar desde Excel con el objeto preseleccionado.

---

## Diapositiva 37

Importación de Números de Serie y Lotes. También se proporciona acceso a la utilidad Importar desde Excel desde un botón en las ventanas de configuración de Números de Serie y Lotes. Solo se admite un método de entrada: Agregar Nuevos Registros Sin Actualizar Existentes. Los nombres mostrados en la lista desplegable son los títulos de columna de la sección de cuadrícula de la ventana de configuración correspondiente. El botón Importar desde Excel queda deshabilitado si la cantidad actual de serie o lote está completa. Después de la importación, el sistema vuelve a la ventana de configuración y los nuevos lotes o números de serie se añaden cuando el usuario presiona Agregar.

---

## Diapositiva 38

Resumen. Puntos clave de este curso: La utilidad Importar desde Excel es una forma sencilla de importar desde una hoja de cálculo los siguientes tipos de datos en bloque: Datos maestros de ICs (con múltiples personas de contacto y direcciones de facturación y envío) / Datos maestros de artículos con precios unitarios (Grupo UdM Manual predeterminado) / Precios de artículos en listas de precios existentes, incluidos precios para múltiples unidades de medida / Números de catálogo de ICs / Asientos contables. La utilidad Importar desde Excel está integrada con varios formularios para importar: Saldos de apertura en el área de cuadrícula de las transacciones de saldos de apertura para ICs, artículos y cuentas G/L / Documentos de inventario físico y contabilización / Lotes y números de serie desde las ventanas de configuración respectivas / Asientos únicos desde la ventana de Asiento.

---

## Diapositiva 39

Resumen (cont.). Se requiere la autorización general "Importar desde Excel" para usar la utilidad. La Referencia de Tablas de Base de Datos es útil para determinar nombres y descripciones de campos, valores predeterminados, longitudes de campos y restricciones. Los datos de la hoja de cálculo se asignan a los campos del objeto en la lista desplegable. Puedes guardar las asignaciones de campos como una plantilla para uso posterior. Asegúrate de guardar la hoja de cálculo como un archivo de texto (delimitado por tabulaciones) y cerrarla antes de ejecutar la importación. La hoja de cálculo no debe contener encabezados de columnas. Algunos tipos de datos tienen un conjunto fijo de campos que deben coincidir en la hoja de cálculo. Existen algunas restricciones sobre los campos que pueden importarse.

---

## Diapositiva 40

Aviso legal SAP — sin cambios respecto al documento original.

---
