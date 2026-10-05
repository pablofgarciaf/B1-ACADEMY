# Transcripción por Diapositiva: 10_Impl_39_SystemSetup_EmailPrefrences

## Diapositiva 1

Configuración y Administración del Sistema: Preferencias de Correo Electrónico — SAP Business One Versión 10.0. Bienvenido al tema de Preferencias de Correo Electrónico.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Definir la configuración para el envío de correos electrónicos. Enviar correo automáticamente al agregar un documento. Enviar por correo múltiples documentos a múltiples destinatarios. Enviar por correo electrónico información específica del informe de vencimiento a múltiples socios comerciales.

---

## Diapositiva 3

Métodos de Correo Electrónico. Puedes usar el SBO Mailer o Microsoft Outlook al enviar correos automáticamente.

---

## Diapositiva 4

SBO Mailer y Microsoft Outlook. Métodos generales de correo electrónico: SBO Mailer (gestor de correo de SAP Business One) — configura e inicia el servicio SBO Mailer en el área de Servicio de Trabajos del SLD. Correo Electrónico de Outlook — asegúrate de que MS Outlook esté instalado en el equipo del usuario. Hay dos métodos para enviar correos desde SAP Business One: el SBO Mailer integrado, cuyo servicio debe configurarse e iniciarse en el Directorio del Panorama del Sistema (SLD), o Microsoft Outlook, que requiere únicamente tener MS Outlook instalado en el equipo del usuario.

---

## Diapositiva 5

Configuración a Nivel de Empresa. SBO Mailer o MS Outlook: Administración → Inicialización del Sistema → Configuración General → Pestaña Servicios. Selecciona el método de correo electrónico predeterminado: SAP Business One Mailer u Outlook. El administrador del sistema puede definir el servicio de correo predeterminado en la pestaña Servicios de la Configuración General. Un usuario puede cambiar el método de envío para correos individuales. Hay una opción para configurar un servidor SMTP diferente para la base de datos de empresa específica. Para ello, activa la casilla Activar Configuración de Mailer Específica de Empresa en la Configuración General e introduce el nombre y puerto del servidor de correo saliente, el método de autenticación y si usar cifrado TLS.

---

## Diapositiva 6

Enviar Documentos por Correo Automáticamente. A continuación veremos la opción para crear y enviar automáticamente archivos PDF por correo al agregar un documento.

---

## Diapositiva 7

Ejemplo de Negocio: Enviar Documentos por Correo Automáticamente. OEC Computers quiere reducir el uso de papel y enviar documentos a clientes y proveedores más rápidamente de forma electrónica. Para agilizar este proceso, quieren que el sistema envíe automáticamente el correo al agregar un documento. Jean, la gerente de ventas, quiere usar esta opción para las ofertas de ventas que crea su departamento.

---

## Diapositiva 8

Configuración a Nivel de Documento: Crear PDF/Correo Electrónico Automáticamente. Administración → Inicialización del Sistema → Preferencias de Impresión → Por Documento: selecciona el tipo de documento y activa la casilla de correo electrónico (el correo se envía a la dirección definida para la persona de contacto del documento). En la ventana Preferencias de Impresión, puedes definir para cada tipo de documento si se debe exportar automáticamente a PDF y/o enviar por correo al agregar un documento. El documento se adjuntará como archivo PDF al correo. Jean, la gerente de ventas de OEC Computers, decidió crear y enviar automáticamente archivos PDF por correo al agregar una oferta de ventas.

---

## Diapositiva 9

Configuración a Nivel de Documento: Texto Predeterminado para Envío Automático de Correo. Al definir las preferencias de impresión para un tipo de documento, también puedes definir texto predeterminado para el asunto y el cuerpo del correo automático. Usa el botón Insertar Textos Predefinidos para copiar texto ya definido en el sistema. Jean introdujo texto predeterminado en los campos Asunto del Correo y Cuerpo del Correo.

---

## Diapositiva 10

Enviar Documento por Correo Automáticamente — SBO Mailer. Al agregar un documento, si el método predeterminado de la empresa es el SBO Mailer, aparece la ventana Enviar Mensaje con los datos de la persona de contacto definida en el documento. En la pestaña Texto puedes ver el texto predeterminado que Jean introdujo. Puedes cambiar este texto. El documento aparece en la pestaña Datos y el archivo PDF creado aparece en la pestaña Adjuntos. Elige el botón Enviar para enviar el correo.

---

## Diapositiva 11

Carpeta de Adjuntos. Los documentos para correo se almacenan en la carpeta de adjuntos definida en la pestaña Ruta de la Configuración General. Asegúrate de que esta carpeta sea compartida y accesible por los usuarios. Si la ruta de la carpeta cambia en el futuro, usa el botón Actualizar Rutas en Documentos para aplicar la nueva ruta a los adjuntos en los documentos existentes.

---

## Diapositiva 12

Carpeta de Adjuntos — Subcarpetas. En lugar de una única carpeta de adjuntos para todos los usuarios, puedes definir subcarpetas y asignarlas a distintos grupos de usuarios. Esto se hace mediante los Valores Predeterminados de Usuario. En la pestaña Ruta se define una subcarpeta separada para los usuarios asignados a ese conjunto de valores predeterminados. También puedes definir la configuración de preferencias de impresión para el envío de documentos por correo en la pestaña Impresión.

---

## Diapositiva 13

Enviar Documento por Correo Automáticamente — Correo Electrónico de Outlook. Si el método predeterminado de la empresa es Outlook, al agregar el documento se abre una ventana de correo con el correo del contacto en el campo Para. El texto predeterminado que Jean introdujo aparece en los campos de Asunto y Cuerpo del Correo, y el documento se adjunta como archivo PDF. Elige el botón Enviar para enviar el correo.

---

## Diapositiva 14

Informe de Correos Enviados. Socios Comerciales → Informes de Socios Comerciales → Informe de Correos Enviados. Hay un informe disponible para realizar un seguimiento de los correos enviados con documentos o informes adjuntos. Ten en cuenta que si un correo aparece en el informe no significa que haya llegado al destinatario.

---

## Diapositiva 15

Enviar Documentos Masivos por Correo. A continuación mostraré la opción para enviar por correo múltiples documentos a múltiples destinatarios de una sola vez, y también la opción de enviar a varios clientes su informe de vencimiento.

---

## Diapositiva 16

Ejemplo de Negocio: Enviar Múltiples Documentos a Múltiples Destinatarios. Recientemente, OEC Computers presentó nuevos productos a clientes potenciales y actuales en una conferencia del sector. Jean, la gerente de ventas, creó ofertas de ventas para los clientes y leads que se acercaron a ella durante la conferencia. Ahora busca una forma de enviar por correo estas ofertas de una sola vez, dirigiéndose a la persona relevante en la organización del socio comercial.

---

## Diapositiva 17

Configuración en los Datos Maestros del Socio Comercial: Grupo de Correo Electrónico. Puedes definir Grupos de Correo Electrónico para especificar qué destinatarios dentro de la organización del socio comercial recibirán el correo. El grupo de correo actúa como lista de distribución. Se asigna un grupo de correo a una persona de contacto específica en los datos maestros del socio comercial. Ejemplo: OEC Computers ha definido tres grupos de correo para asignar a personas de contacto: uno para el gestor de almacén, otro para el Director de Tecnología (CIO) y otro para el contable de la empresa. Lo más probable es que las ofertas de ventas se envíen al CIO, las entregas al gestor de almacén y las facturas A/R al contable.

---

## Diapositiva 18

Configuración en los Datos Maestros del Socio Comercial: Grupo de Correo Electrónico. Definir y asignar un Grupo de Correo: selecciona una persona de contacto en la ventana de Datos Maestros del Socio Comercial y asígnala a un grupo de correo. Puedes definir nuevos grupos de correo eligiendo la opción Definir Nuevo.

---

## Diapositiva 19

Enviar Múltiples Documentos a Múltiples Destinatarios de Correo. Ventas → Impresión de Documentos A/R. Para enviar un lote de documentos, por ejemplo, ofertas de ventas creadas para distintos clientes, a las personas de contacto respectivas, usa la ventana de impresión de documentos. Después de generar la lista de documentos a enviar, selecciónalos y en el menú Archivo elige Enviar, luego Correo Electrónico u Outlook. Nota: la selección de múltiples documentos requiere formato Crystal Reports. Solo se pueden elegir los documentos aún no enviados por correo. El formato PLD solo admite el envío de un único documento.

---

## Diapositiva 20

Enviar Múltiples Documentos a Múltiples Destinatarios de Correo. Selecciona la casilla Usar Grupo de Correo Electrónico y especifica el grupo requerido para enviar los documentos a las personas de contacto asociadas al grupo seleccionado. Si no marcas esta casilla, los documentos se enviarán a la dirección de correo de la persona de contacto definida en el documento. Puedes cambiar el contacto predeterminado y la dirección de correo en la siguiente ventana.

---

## Diapositiva 21

Enviar Múltiples Documentos a Múltiples Destinatarios de Correo. Tras confirmar la ventana Opciones de Correo, aparece la ventana de Correo Electrónico para el tipo de documento, con la lista de los documentos seleccionados. El nombre de la persona de contacto y su dirección de correo aparecen según la selección anterior. Puedes actualizar el nombre y la dirección de correo manualmente si es necesario. La columna Correo Electrónico está seleccionada de forma predeterminada; si deseas cancelar el envío de un determinado documento, desactiva esta opción. En las columnas Asunto y Cuerpo aparece el texto insertado para el tipo de documento en la ventana Preferencias de Impresión. Finalmente, elige Enviar.

---

## Diapositiva 22

Enviar Informe de Vencimiento a Varios Socios Comerciales. Tras generar el informe de vencimiento, ya sea para clientes o proveedores, puedes enviar por correo los datos de vencimiento correspondientes a los socios comerciales relevantes.

---

## Diapositiva 23

Configuración a Nivel de Informe: Texto Predeterminado para Envío Automático de Correo. Administración → Inicialización del Sistema → Preferencias de Impresión → Por Informe. De manera similar a la opción de documentos, puedes definir texto predeterminado para el asunto y el cuerpo del correo automático. El responsable del departamento de finanzas ha introducido texto predeterminado en los campos de Asunto y Cuerpo del Correo.

---

## Diapositiva 24

Enviar Informe de Vencimiento a Varios Socios Comerciales. Tras generar el informe de vencimiento para clientes, selecciona los socios comerciales a los que deseas enviar sus datos de vencimiento. En el menú Archivo elige Enviar, luego Correo Electrónico u Outlook.

---

## Diapositiva 25

Enviar Informe de Vencimiento a Varios Clientes. Los archivos PDF con los datos de vencimiento a enviar ya están creados y puedes visualizarlos. Sigue los detalles en las columnas Ruta de Origen y Nombre de Archivo. De manera similar al envío de múltiples documentos, define en la ventana Opciones de Correo si usar un grupo de correo o no. Tras confirmar la ventana, aparece la ventana Correo de Vencimiento con la lista de socios comerciales seleccionados. El nombre de la persona de contacto y su dirección de correo aparecen según la selección anterior. Puedes cambiar el nombre y la dirección manualmente si es necesario. Finalmente, elige Enviar. Cada persona de contacto definida en la ventana recibirá los datos de vencimiento relevantes para su empresa.

---

## Diapositiva 26

Resumen. Puedes crear y enviar automáticamente archivos PDF por correo al agregar documentos. Puedes definir a nivel de empresa si usar el SBO Mailer o Microsoft Outlook. También puedes definir texto predeterminado para el asunto y el cuerpo del correo automático. Al asignar grupos de correo a personas de contacto en los datos maestros del socio comercial, creas listas de distribución para enviar múltiples documentos a múltiples destinatarios de una sola vez. Con los grupos de correo también puedes enviar información relevante del informe de vencimiento simultáneamente a múltiples clientes. Puedes revisar los archivos PDF antes de enviarlos.

---

## Diapositiva 27

Aviso legal SAP — sin cambios respecto al documento original.

---
