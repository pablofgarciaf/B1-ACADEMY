# Transcripción por Diapositiva: 10_Impl_36_SystemSetup_Print_layouts

## Diapositiva 1

Configuración y Administración del Sistema: Formatos de Impresión — SAP Business One Versión 10.0. Este tema cubre los formatos de impresión necesarios para la impresión de documentos e informes.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Describir la función de un formato de impresión. Establecer formatos de impresión predeterminados para usuarios y por socio comercial. Utilizar el Gestor de Informes y Formatos para gestionar informes y formatos de impresión. Definir una secuencia de impresión para un documento.

---

## Diapositiva 3

Concepto de Formato de Impresión. SAP Business One — Cada documento de marketing o informe tiene un formato de impresión. Es una plantilla que define cómo aparecerá el documento en pantalla al imprimirse. Los formatos de impresión son plantillas que definen la apariencia de un documento o informe en pantalla al imprimirse. SAP proporciona un conjunto de formatos predefinidos para cada documento de marketing. Puedes usarlos tal como están o editarlos para crear documentos impresos específicos del cliente. Esto se hace habitualmente para documentos dirigidos a terceros externos, aunque también puedes personalizar los formatos para documentos de uso interno como listas de selección y listas de materiales.

---

## Diapositiva 4

Formatos de Impresión de un Documento. Un documento puede tener múltiples formatos de impresión. Para previsualizar un documento en los formatos disponibles, abre un documento y elige Archivo → Previsualizar Formatos…. El formato predeterminado aparece en negrita. Puede haber múltiples formatos de impresión para un documento. Debes decidir con el cliente qué plantillas serán necesarias para cada documento. Por ejemplo, una factura A/R puede imprimirse como albarán de entrega y también como factura. Nota: Si imprimes o previsualizas un documento antes de agregarlo al sistema, el sistema agrega automáticamente la marca de agua Borrador en la impresión.

---

## Diapositiva 5

Establecer el Formato de Impresión Predeterminado. Se puede especificar un formato predeterminado para todos los usuarios, solo para el usuario actual o para usuarios específicos. También puedes establecer un predeterminado para todos los socios comerciales o para socios específicos. Se requiere autorización para establecer el formato predeterminado. Un usuario puede necesitar usar más de una plantilla de formato de impresión. Los usuarios autorizados pueden establecer un formato diferente como predeterminado para distintos usuarios o socios comerciales. Para establecer el formato predeterminado, abre un documento y elige el icono de Diseñador de Formatos de la barra de herramientas. Se puede establecer una nueva plantilla como predeterminada para: todos los usuarios, solo el usuario actual, o usuarios específicos seleccionados. También puede establecerse como predeterminada para todos los socios comerciales o para socios seleccionados. Nota: Se requiere la autorización general Cambiar Informe Predeterminado General.

---

## Diapositiva 6

Personalización de Formatos de Impresión. Los formatos de impresión deben personalizarse durante la implementación para satisfacer las necesidades del cliente en los documentos dirigidos a terceros externos. Como mínimo, deberás insertar el logotipo y la dirección de la empresa. Puede ser necesario traducir el formato para proporcionar documentos impresos en el idioma nativo del cliente. Durante la implementación, debes mostrar al cliente los distintos formatos disponibles. Al identificar el formato que mejor se adapta a las necesidades del cliente, puedes usarlo como base para los cambios.

---

## Diapositiva 7

Gestionar Formatos de Impresión e Informes. Administración → Configuración → General → Gestor de Informes y Formatos. El Gestor de Informes y Formatos es el punto central para gestionar los formatos de impresión y también los informes de usuario. Al instalar SAP Business One, los formatos de impresión para documentos e informes se cargan según la localización. Cuando seleccionas un tipo de documento, verás todos los formatos de impresión disponibles para ese tipo. Hay formatos diferentes para documentos de tipo artículo y de tipo servicio.

---

## Diapositiva 8

Gestionar Formatos de Impresión e Informes (cont.). También puedes acceder al Gestor de Informes y Formatos eligiendo el icono Diseñador de Formatos desde un documento abierto y luego el botón Gestionar Formato.

---

## Diapositiva 9

Editar Formatos de Impresión. Todos los nuevos formatos se proporcionan en Crystal Reports. Los formatos más antiguos se proporcionan en el Diseñador de Formatos de Impresión (PLD). Para cambiar un formato de impresión, selecciónalo y elige Editar. Tras realizar los cambios, guarda el formato con un nuevo nombre. No es posible modificar directamente un formato proporcionado por SAP Business One. Nota: No puedes eliminar los informes y formatos proporcionados con el producto principal.

---

## Diapositiva 10

Editar Formatos del Diseñador de Formatos de Impresión. Al editar un formato PLD, el sistema abre automáticamente la herramienta Diseñador de Formatos de Impresión integrada, lo que te permite editar y guardar el formato. Para más información sobre cómo editar un formato, consulta la guía Cómo Personalizar Formatos de Impresión con el Diseñador de Formatos de Impresión.

---

## Diapositiva 11

Editar Formatos Crystal Reports. Al editar un formato Crystal Reports, el sistema abre automáticamente SAP Crystal Reports para SAP Business One, lo que te permite editar y guardar el formato con un nuevo nombre. Crystal Reports Designer es necesario y debe estar instalado para editar formatos. Para más información, consulta la guía Cómo Trabajar con Crystal Reports en SAP Business One.

---

## Diapositiva 12

Integración con Crystal. La integración de SAP Crystal Reports para SAP Business One se proporciona con los archivos de instalación. Una vez instalado el paquete de integración, SAP Business One aparece como fuente de datos en Crystal Reports y las tablas de SAP Business One coinciden con la estructura del menú de la aplicación. Tras realizar cambios en un formato de impresión, puedes guardarlo directamente en SAP Business One usando el menú Complementos. El nuevo formato aparecerá en la lista del Gestor de Informes y Formatos. También puedes previsualizar cómo se verán los cambios en SAP Business One.

---

## Diapositiva 13

Importar y Exportar (Formatos Crystal Reports Modificados). Los asistentes de exportación e importación permiten mover los formatos Crystal Reports modificados entre empresas de SAP Business One. Los formatos se empaquetan como archivo b1px. Los asistentes también admiten la importación y exportación de informes definidos por el usuario desarrollados en Crystal Reports. Para exportar formatos, elige Exportar y selecciona los formatos para exportar. Para importar formatos, elige Importar.

---

## Diapositiva 14

Formatos Maestros. Puedes importar un formato Crystal Reports como formato maestro para otros tipos de documento. Al importar, puedes designar un formato como maestro para otros tipos de documentos con estructura similar. Esto te permite realizar cambios comunes, como el logotipo de la empresa, en un solo formato y usarlo para otros documentos. Los formatos maestros pueden aplicarse a tipos de documentos de ventas, compras, inventario y producción. Al importar el archivo de paquete, selecciona la casilla Formato Maestro y elige los tipos de documentos adicionales a los que quieres aplicarlo. Afina los formatos duplicados según sea necesario. Nota: También puedes duplicar un formato PLD para crear un nuevo formato PLD para otro tipo de documento desde Administración → Utilidades → Duplicar Plantilla de Formato.

---

## Diapositiva 15

Secuencia de Impresión. Usa la pestaña Secuencias de Impresión para definir el conjunto de formatos que se imprimirán para un formato de impresión. Puedes incluir otros tipos de documento en la secuencia de impresión. Puedes establecer una secuencia como predeterminada al imprimir un documento. Distintas empresas tienen diferentes necesidades y procedimientos de impresión. Por ejemplo, una empresa puede querer incluir siempre un albarán al imprimir una factura para un cliente. En el Gestor de Informes y Formatos, selecciona un formato de impresión y crea una nueva secuencia en la pestaña de secuencia de impresión. El ejemplo de secuencia imprimirá primero una lista de selección, seguida de dos copias del albarán, luego la factura A/R con el formato predeterminado, y finalmente una factura solo de impuestos.

---

## Diapositiva 16

Resumen. Puntos clave de este tema: Un formato de impresión define cómo aparece un documento en pantalla al imprimirse. SAP proporciona formatos de impresión predefinidos para cada documento de marketing. Un documento puede tener varios formatos disponibles y puedes asignar distintos formatos predeterminados a distintos usuarios. Durante la implementación, edita los formatos para satisfacer las necesidades del cliente en los documentos externos. El Gestor de Informes y Formatos es el punto central para gestionar los formatos de impresión y los informes. Puedes editar formatos Crystal Reports con Crystal Reports Designer; los formatos más antiguos se editan con el Diseñador de Formatos de Impresión. Puedes exportar formatos Crystal modificados e informes definidos por el usuario e importarlos en otro sistema SAP Business One. Al importar formatos Crystal Reports como paquete, puedes designar un formato maestro para aplicarlo a múltiples tipos de documento. Puedes duplicar un formato PLD como plantilla para otro documento. Puedes definir una secuencia de impresión para incluir número de copias, impresora y tipos de documentos adicionales.

---

## Diapositiva 17

Aviso legal SAP — sin cambios respecto al documento original.

---
