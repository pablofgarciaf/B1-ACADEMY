# Transcripción por Diapositiva: 10_Impl_32_Using_Data_Trans_Workbench

## Diapositiva 1

Herramientas de Implementación: Uso del Workbench de Transferencia de Datos (DTW) — SAP Business One Versión 10.0. Bienvenido al curso sobre el uso del Workbench de Transferencia de Datos (DTW). Este curso es útil para cualquier persona que utilice DTW por primera vez.

---

## Diapositiva 2

Objetivos. Al finalizar este curso, podrás: Describir el proceso para importar datos usando el Workbench de Transferencia de Datos. Enumerar los tipos de objetos que pueden importarse con DTW. Explicar la relación entre los objetos de SAP Business One y las plantillas DTW proporcionadas. Explicar cómo mejorar el rendimiento al importar a una base de datos SAP HANA. Explicar cómo actualizar registros secundarios de un objeto. Describir cómo crear una nueva plantilla personalizando una existente.

---

## Diapositiva 3

Visión General y Referencias. En este segmento se presenta la herramienta Workbench de Transferencia de Datos y se ofrecen referencias para ayudarte con los objetos y campos.

---

## Diapositiva 4

Workbench de Transferencia de Datos (DTW). Microsoft Excel → Base de datos SAP Business One / Base de Datos Externa → ODBC → DI-API → DTW → Importar y/o actualizar. El Workbench de Transferencia de Datos (DTW) es una herramienta incluida con SAP Business One para la importación masiva de datos en objetos de SAP Business One usando plantillas de Microsoft Excel predefinidas. DTW admite la importación de datos maestros, datos de configuración, asientos contables y documentos abiertos de ventas, compras, producción y servicios. Los datos financieros que pueden importarse incluyen saldos iniciales, asientos contables y comprobantes de diario. También se pueden importar datos de configuración como usuarios, códigos de impuestos y bancos. DTW utiliza la API DI para acceder a la base de datos de SAP Business One. Se requiere cierta familiaridad con los nombres de tablas y campos de SAP Business One. Por ello, los usuarios finales podrían preferir la utilidad Importar desde Excel como herramienta de importación periódica. Nota: El Workbench de Transferencia de Datos no admite la importación de documentos ya cerrados ni la eliminación de registros de la base de datos.

---

## Diapositiva 5

Inicio de DTW. Desde el Centro de Implementación de SAP Business One: Administración → Inicialización del Sistema → Centro de Implementación → Tareas de Implementación. Para iniciar DTW desde el centro de implementación es necesario indicar la ruta al ejecutable DTW en la ventana de Configuración. Desde el escritorio: Archivos de Programa → SAP → Data Transfer Workbench → DTW.exe. El DTW se suministra con los archivos de instalación del cliente SAP Business One y es un paquete opcional. Puede instalarse en el escritorio del cliente o en un escritorio remoto sin el cliente SAP Business One. Nota: Microsoft Excel debe estar instalado en el equipo donde esté instalado DTW.

---

## Diapositiva 6

Conexión al Servidor de Base de Datos. En la ventana de inicio de sesión de DTW, debe iniciarse sesión en la empresa de destino de SAP Business One como superusuario. Los servidores se muestran desde el SLD. El tipo de servidor de base de datos y los nombres de servidor se toman del Directorio del Panorama del Sistema (SLD). Solo se muestran los servidores registrados y las bases de datos de empresa. Para SAP HANA se requiere el número de puerto (por ejemplo, 30015) además del nombre de servidor o dirección IP. Si no aparece ninguna empresa, elige el botón Actualizar para recargar la lista. La casilla de verificación Activar Importación Más Rápida en la ventana de inicio de sesión permite una importación más rápida de registros en bases de datos SAP HANA mediante múltiples subprocesos.

---

## Diapositiva 7

Activar Importación Más Rápida para SAP HANA. Con una base de datos SAP HANA, puedes ejecutar la importación usando múltiples procesos paralelos. Selecciona la casilla Activar Importación Más Rápida e indica el número de procesos (el valor predeterminado es 4). Puedes seleccionar hasta 21 subprocesos según el tamaño de la configuración de hardware. Al seleccionar esta opción, DTW ejecutará la API DI bajo una aplicación COM+. Las filas de la hoja de cálculo se distribuirán entre los subprocesos y se importarán en paralelo. Limitaciones: el incremento de rendimiento solo es efectivo para importaciones de más de 1.000 registros; no se puede ejecutar una simulación antes de la importación; solo se admiten ciertos objetos. Consulta la nota SAP 2229208 para más información.

---

## Diapositiva 8

Menú y Ayuda de DTW. Tras iniciar sesión, se abre la ventana de la aplicación DTW con las opciones de menú: Herramientas: asistente de importación, gestor de registros. Plantillas: creación de nuevas plantillas. Ayuda: ayuda en línea de DTW, Referencia de la API DI y Referencia de Tablas de Base de Datos. En la parte inferior de la ventana se muestra el estado de la conexión a la base de datos de destino, incluida la empresa. La Referencia de la API DI describe los objetos y sus propiedades. La Referencia de Tablas de Base de Datos muestra los campos de tabla, incluidos valores predeterminados, tipos de campo y restricciones.

---

## Diapositiva 9

Proceso General de Importación. Iniciar sesión en la base de datos de la empresa de destino. Guardar la plantilla como archivo delimitado (tabulador, coma o punto y coma). En DTW, elegir el botón Importar para ejecutar el asistente de importación. Nota: el carácter delimitador no debe aparecer en los datos de los campos. Introducir los datos en las plantillas predefinidas.

---

## Diapositiva 10

Plantillas Predefinidas. Veamos las plantillas predefinidas proporcionadas en DTW.

---

## Diapositiva 11

Plantillas DTW. Tras instalar DTW, la carpeta del ejecutable contiene las plantillas de Microsoft Excel predefinidas (en la subcarpeta Plantillas). Los nombres de las plantillas comienzan con el nombre de tabla de cuatro caracteres de la base de datos; por ejemplo, la plantilla principal de datos maestros de socio comercial es OCRD – BusinessPartners. Se proporciona una plantilla para cada tabla secundaria. La carpeta Ejemplos contiene plantillas completadas como referencia.

---

## Diapositiva 12

Cada plantilla predefinida incluye una columna para cada campo expuesto a la API DI. Las dos filas de encabezado no deben eliminarse; contienen las propiedades del objeto y los nombres de campo de la API DI. SAP recomienda no eliminar columnas de una plantilla; en su lugar, deja la columna en blanco o genera una plantilla personalizada. Ejemplo: Plantilla OCRD.

---

## Diapositiva 13

Comentarios de Campo y Datos Enumerados. Cada campo de encabezado en la plantilla incluye un comentario con el tipo de dato y la longitud del campo. Si el tipo es enumerado (enum), debe usarse uno de los valores válidos indicados. Si el comentario muestra una tabla relacionada, introduce el código de esa tabla en el campo de la plantilla. Ejemplo: en el campo CardType (columna C) de los datos maestros de socio comercial, debes introducir cCustomer, cSupplier o cLid.

---

## Diapositiva 14

Valores Válidos y Referencia de Tablas de Base de Datos. Si un campo tiene valores válidos en el comentario de la plantilla, usa siempre esos valores y no introduzcas las restricciones mostradas en la Referencia de Tablas de Base de Datos. Por ejemplo, la Referencia de Tablas de Base de Datos muestra las restricciones del campo CardType como C, S y L, pero DTW espera cCustomer, cSupplier o cLid.

---

## Diapositiva 15

Dejar Columnas en Blanco. Las reglas de entrada de datos en DTW son idénticas a las de entrada manual. No es necesario introducir valores de campo predeterminados ni datos no obligatorios. Asegúrate de que los datos previos requeridos estén creados antes de importar los datos. Para los datos maestros de socios comerciales, los datos previos incluyen: grupos de socios comerciales, monedas, códigos bancarios y definiciones de banco domiciliario.

---

## Diapositiva 16

Plantillas Principal y Secundaria. Si hay tablas secundarias para un objeto, puedes importar los registros secundarios junto con los registros principales. Para vincular las plantillas secundaria y principal, el campo clave principal en la plantilla secundaria hace referencia a la clave primaria (columna A) en la plantilla principal. Plantilla secundaria / Plantilla principal: C001 → C001.

---

## Diapositiva 17

Proceso de Importación. Veamos el proceso general para importar los datos.

---

## Diapositiva 18

Asistente de Importación DTW. Selecciona el tipo de datos a importar: datos de configuración, datos maestros o datos de transacciones. Los datos de configuración incluyen bancos, bancos domiciliarios, grupos de socios comerciales y artículos, códigos de impuestos, datos de saldos iniciales y usuarios. Los datos maestros incluyen socios comerciales, artículos y empleados. Los datos de transacciones incluyen asientos contables, documentos de ventas y compras, actividades de socios comerciales, pagos y transacciones de inventario.

---

## Diapositiva 19

Asistente de Importación DTW. Selecciona la operación a realizar: Agregar, Actualizar o Agregar y Actualizar. Para importar nuevos objetos de datos, elige "Agregar Nuevos Datos". Para actualizar información en una plantilla principal o secundaria, elige "Actualizar Datos Existentes". Para importar nuevos registros principales y al mismo tiempo actualizar registros secundarios existentes, elige "Agregar Nuevos Datos y Actualizar Datos Existentes". Esta última opción no está disponible si se seleccionaron datos de transacciones en el paso 1.

---

## Diapositiva 20

Asistente de Importación DTW. Navega hasta el objeto de negocio expandiendo la lista. Solo pueden importarse datos para un único objeto de negocio en cada ejecución de importación. Por ejemplo, no se pueden mezclar datos maestros de socios comerciales y datos maestros de artículos en la misma ejecución.

---

## Diapositiva 21

Asistente de Importación DTW. Selecciona el tipo de archivo para la plantilla guardada: separado por comas, separado por punto y coma, delimitado por tabulador u ODBC. Si seleccionas ODBC, se te pedirá una consulta SQL que extraerá los datos de una base de datos de origen e importará los datos en la base de datos de SAP Business One de destino.

---

## Diapositiva 22

Asistente de Importación DTW. El asistente muestra todas las plantillas disponibles para el objeto de negocio seleccionado. Para cada tabla que desees importar, elige el botón de exploración y localiza el archivo de plantilla guardado. Una X roja indica que se ha seleccionado una plantilla y se muestra la ruta.

---

## Diapositiva 23

Asistente de Importación DTW. Usa la pestaña Reglas de Asignación para verificar visualmente la asignación entre los campos de datos de la plantilla de origen y los campos de la API DI. Si el campo de destino está en blanco, puedes asignarlo manualmente al campo de origen.

---

## Diapositiva 24

Asistente de Importación DTW. Usa la pestaña Datos de Origen para verificar visualmente los datos de la plantilla y asegurarte de que cada campo se interpreta correctamente.

---

## Diapositiva 25

Asistente de Importación DTW. Usa la pestaña Datos de Destino para verificar visualmente los campos de datos de destino según la asignación. Expande la estructura del objeto para ver los datos esperados en cada campo. Esto puede ser útil para solucionar errores durante una importación.

---

## Diapositiva 26

Asistente de Importación DTW. Puedes definir cómo gestionará el asistente los errores durante la importación: cancelar la importación tras el primer error, ignorar todos los errores e importar los registros válidos, o ignorar un número determinado de errores. También tienes la opción de ejecutar una simulación antes de la importación real. SAP recomienda ejecutar primero una simulación o importar los datos en una base de datos de prueba.

---

## Diapositiva 27

Asistente de Importación DTW. El paso final es la importación de datos. Se genera un registro para cada registro importado correctamente en la base de datos.

---

## Diapositiva 28

Errores de DTW. Si se detectan errores con los datos de la plantilla, se muestra la clave y descripción del registro fallido. Puedes acceder a la fila en la plantilla haciendo clic en el botón Archivo de Error.

---

## Diapositiva 29

Trabajo con las Plantillas.

---

## Diapositiva 30

Importar en Campos Definidos por el Usuario. Para importar datos en un campo definido por el usuario, agrega el nombre del campo al final de la plantilla. Si un objeto tiene muchos campos definidos por el usuario, tienes la opción de generar una nueva plantilla que los incluya. Usa el nombre de campo de base de datos, que comienza con "U_".

---

## Diapositiva 31

Agregar o Actualizar Empleados de Contacto de un Socio Comercial - 1. Puedes actualizar o agregar registros en las tablas secundarias de un objeto existente sin la plantilla principal. Por ejemplo, puedes agregar nuevos empleados de contacto o actualizar información de contacto para un socio comercial usando la plantilla secundaria OCPR. Introduce el código del objeto principal en la columna A. Para actualizar un contacto existente, introduce el LineNum (0, 1, 2, etc.) correspondiente al orden en el objeto. Para agregar un nuevo contacto, deja el LineNum en blanco.

---

## Diapositiva 32

Agregar o Actualizar Empleados de Contacto de un Socio Comercial - 2. Al ejecutar la importación DTW, elige la opción "Actualizar Datos Existentes" para que no se requiera la plantilla principal. Luego selecciona solo el archivo de hoja de cálculo secundario como fuente de datos.

---

## Diapositiva 33

Agregar o Actualizar Direcciones de un Socio Comercial. Para agregar nuevas direcciones o actualizar direcciones existentes, no se usa el campo LineNum porque las direcciones se identifican por el ID de Dirección. Introduce el código en la columna A. En la columna C introduce el ID de Dirección que se actualizará o agregará. En la columna N introduce el tipo de dirección (bo_BillTo o bo_ShipTo). Al ejecutar la importación, elige "Actualizar Datos Existentes" y selecciona solo la hoja de cálculo CRD1 como fuente de datos.

---

## Diapositiva 34

Plantillas Personalizadas. Este segmento cubre la creación de plantillas personalizadas.

---

## Diapositiva 35

Ejemplo de Negocio para Plantillas Personalizadas. Deseas importar datos maestros de artículos en un nuevo sistema SAP Business One. La plantilla predefinida OITM contiene muchos campos que los productos a importar no utilizan. Para simplificar la entrada de datos, puedes eliminar los campos no utilizados y generar una plantilla personalizada.

---

## Diapositiva 36

Personalizar Plantilla - 1. Para crear una plantilla adaptada a tus necesidades, elige Plantillas → Personalizar Plantilla. Selecciona el objeto de negocio que será la base para la nueva plantilla. En el ejemplo se selecciona el objeto de datos maestros de artículos.

---

## Diapositiva 37

Personalizar Plantilla - 2. Expande el nodo de la tabla para ver la lista completa de campos de la API DI. Al seleccionar un campo, sus atributos se muestran en la parte inferior derecha. Puedes: reorganizar el orden de los campos arrastrando y soltando, eliminar un campo de la plantilla, o agregar un campo previamente eliminado. No elimines campos obligatorios ni claves primarias.

---

## Diapositiva 38

Personalizar Plantilla - 3. Tras reorganizar los campos, haz clic derecho en el nodo de tabla y selecciona Crear Plantilla para la Estructura. La nueva plantilla se guarda en la carpeta de plantillas como archivo .xlt.

---

## Diapositiva 39

Generar Plantillas de CUD. Los campos definidos por el usuario (CUD) agregados a un objeto no aparecen en las plantillas predefinidas, pero puedes generar una nueva plantilla para incluirlos. Elige Generar Plantillas de CUD. La ventana muestra una lista de todos los objetos con CUD. El sistema generará plantillas para los objetos seleccionados con los CUD incluidos en la plantilla. Las plantillas se guardan en la ubicación mostrada en la ventana.

---

## Diapositiva 40

Generar Plantillas de UDO. También puedes generar nuevas plantillas para objetos definidos por el usuario (UDO): elige Generar Plantillas de UDO. La ventana muestra todos los objetos definidos por el usuario que han sido registrados (tipo Datos Maestros o Documento). Se generará una plantilla para cada UDO seleccionado.

---

## Diapositiva 41

Resumen. Puntos clave de este curso: El Workbench de Transferencia de Datos (DTW) permite importar datos de configuración, datos maestros y transacciones abiertas de forma masiva. DTW proporciona plantillas predefinidas para los objetos de SAP Business One basadas en la interfaz de la API DI. La Referencia de Tablas de Base de Datos documenta los campos de las plantillas, incluidos valores predeterminados, longitudes y restricciones. Con una base de datos SAP HANA, puedes aumentar el rendimiento activando la casilla Activar Importación Más Rápida. Tras introducir los datos en la plantilla, guárdala como archivo delimitado por tabulador, coma o punto y coma antes de ejecutar el asistente de importación. SAP recomienda ejecutar primero una simulación o importar en una base de datos de prueba. Puedes crear plantillas personalizadas y generar nuevas plantillas para campos definidos por el usuario (CUD) y objetos definidos por el usuario (UDO).

---

## Diapositiva 42

Aviso legal SAP — sin cambios respecto al documento original.

---
