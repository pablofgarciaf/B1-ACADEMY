# Transcripción por Diapositiva: 10_Impl_35_SystemSetup_UIConfigurationTemplates_ES

## Diapositiva 1

PUBLIC Configuración y gestión del sistema: Modelos de configuración de la IU SAP Business One Versión 10.0 En este tema veremos cómo simplificar los formularios predefinidos en SAP Business One. 1

---

## Diapositiva 2

 Al finalizar este tema, podrá:  Editar el layout de documentos y formularios estándar de SAP Business One  Asignar los documentos y formularios editados a usuarios en un modelo de configuración de la IU  Explicar cómo gestionar múltiples modelos de configuración de la IU  Describir cómo funciona la ficha Elementos de la IU en la ventana de parametrizaciones de formulario 2 PUBLIC Al finalizar este tema, podrá: Editar y simplificar el layout de documentos y formularios estándar Asignar los documentos y formularios editados a varios usuarios mediante un modelo de configuración de la IU Explicar cómo gestionar múltiples modelos de configuración de la IU Describir cómo funciona la ficha Elementos de la IU en la ventana de parametrizaciones de formulario Objetivos

---

## Diapositiva 3

 El servicio es fundamental para OEC Computers. Para mejorar la eficiencia de las llamadas de servicio, el personal de soporte al cliente debe tener la posibilidad de encontrar rápidamente información clave en documentos y datos maestros. Necesitan una versión simplificada de los formularios estándar, con la consolidación en la misma ficha de campos que estén relacionados con el servicio, con la retirada de campos no utilizados del formulario y con campos definidos por el usuario de fácil acceso. Los usuarios necesitan una interfaz de usuario que esté optimizada y que resulte fácil trabajar con ella.  Los formularios estándar pueden simplificarse fácilmente para satisfacer las necesidades de un grupo de usuarios. Estos formularios editados se agrupan en modelos de configuración de la IU que pueden asignarse a usuarios finales de acuerdo con su rol. 3 3 PUBLIC Para mejorar la eficiencia de las llamadas de servicio, el personal de soporte al cliente tiene que encontrar rápidamente información clave en documentos y datos maestros. Necesitan una versión simplificada de los formularios estándar donde se retiren campos que no sean relevantes, los campos que estén relacionados con el servicio se encuentren en la misma ficha y los campos definidos por el usuario sean de fácil acceso. Ejemplo empresarial Este requisito puede implementarse fácilmente con un modelo de configuración de la IU que contenga el conjunto de formularios simplificados.

---

## Diapositiva 4

4 PUBLIC Simplificación de formularios Mover campos definidos por el usuario Mover campos o botones partes del formulario más adecuadas Ocultar o desactivar los campos no deseados Mover campos de la ficha a la parte principal del formulario En lugar de trabajar con formularios estándar, puede hacer que cumplan con sus necesidades ocultando o desactivando los campos no utilizados, moviendo campos o botones a una parte del formulario más adecuada, moviendo campos de otra ficha a la principal para facilitar el acceso y moviendo los campos definidos por el usuario desde la ventana lateral. 4

---

## Diapositiva 5

Modelos de configuración de la IU  La primera parte de este tema explica la finalidad de un modelo de configuración de la IU. 5

---

## Diapositiva 6

6 PUBLIC Autorizaciones para modificaciones de IU Para editar un formulario para uso personal, el usuario necesita autorización general: GeneralEditar IU de formulario Para modificar los formularios de otros usuarios, el usuario necesita una autorización general: GestiónUtilidades Modelo de configuración de la IU Autorización Vía de acceso a menú Requisito General Editar IU de formulario Herramientas > Editar IU de formulario Editar un formulario para uso personal GestiónUtilidades  Modelo de configuración de la IU Gestión > Utilidades > Modelo de configuración de la IU Editar formularios para los demás en un modelo de IU  Los usuarios autorizados pueden editar y modificar formularios para uso personal utilizando la herramienta Editar IU de formulario. El menú de herramientas se convierte en activo cuando el usuario abre un formulario elegible. La autorización necesaria para editar un formulario se encuentra bajo el área temática General en la ventana de autorizaciones generales.  Los usuarios autorizados pueden modificar formularios para otros usuarios mediante la creación de un modelo de configuración de IU. La autorización general necesaria se encuentra en el área temática Administración > Utilidades en las autorizaciones generales. 6

---

## Diapositiva 7

7 PUBLIC Modelo de configuración de la IU Gestión > Utilidades > Modelo de configuración de la IU  El modelo de configuración de la IU es un conjunto de formularios editados para las necesidades de los usuarios finales  Para crear un nuevo modelo, abra la ventana Modelo de configuración de la IU y seleccione Datos > Añadir Lista de formularios editados para un grupo de usuarios  Un modelo de configuración de la IU es un conjunto de formularios que se han simplificado y/o modificado para satisfacer las necesidades comunes de un conjunto de usuarios finales  En SAP Business One, todos los formularios y documentos pueden modificarse.  Para crear una plantilla de configuración de IU, seleccione la vía de acceso de menú que se muestra en la diapositiva y, a continuación, seleccione Datos > Añadir de la barra de menús. 7

---

## Diapositiva 8

8 PUBLIC Adición de formularios Seleccionar formularios que irán en el modelo  Los formularios individuales se seleccionan de la lista desplegable y, a continuación, se editan para cumplir con los requisitos de usuario  Pueden crearse modelos de IU adicionales para diferentes conjuntos de usuarios. Nota: Algunas funcionalidades de edición se solapan con las parametrizaciones de formulario. Los usuarios todavía pueden realizar más modificaciones en sus propios formularios mediante las parametrizaciones de formulario  Los formularios individuales se seleccionan desde una lista desplegable en la ficha Formularios y, a continuación, se editan de forma individual.  Pueden crearse modelos de IU adicionales para diferentes conjuntos de usuarios finales.  Nota: Algunas de las funcionalidades de edición, como la de ocultar campos, también se pueden lograr utilizando las parametrizaciones de formulario.  Los usuarios todavía pueden realizar más modificaciones en un formulario mediante las parametrizaciones de formulario 8

---

## Diapositiva 9

9 PUBLIC Editar el modo de IU  Seleccione un formulario y, a continuación, el botón Editar IU de formulario  En el modo de edición, el formulario tiene un área de título negra distintiva  El campo en el que se ha hecho clic se resalta para la edición Para editar un formulario, seleccione la fila del formulario en el modelo y, a continuación, seleccione el botón Editar IU de formulario. Tenga en cuenta que este botón no se convierte en activo hasta que seleccione un formulario. Al pulsar el botón Editar IU de formulario entrará en el modo de edición. El formulario tiene un área de título negra distintiva. El título del formulario cambia para incluir el texto “Modo edición de la IU”. Ahora ya puede realizar cambios de diseño. Al hacer clic en un campo, se resalta inmediatamente y puede realizar una acción en él, como ocultarlo o moverlo. 9

---

## Diapositiva 10

10 PUBLIC Asignación de usuarios al modelo de IU  Los usuarios pueden asignarse al modelo de IU de forma individual o por grupo de usuarios  Tras la asignación, los formularios modificados se abrirán automáticamente en lugar de los formularios estándar cuando el usuario asignado vuelva a iniciar sesión  Después de que el conjunto de formularios se haya editado, el modelo de configuración de IU se asigna a los usuarios:  De forma individual por nombre en la ficha Usuarios asignados  Como grupo de usuarios en la ficha Grupos asignados. El grupo de usuarios debe ser del tipo Configuración de modelos o En todos los tipos. Consulte el curso complementario Usuarios y Grupos de usuarios para obtener más información sobre grupos de usuarios.  Estos formularios modificados se abrirán automáticamente en lugar de los formularios estándar cuando el usuario asignado vuelva a iniciar sesión. 10

---

## Diapositiva 11

Realización de modificaciones  En esta sección se muestra cómo editar y simplificar formularios. 11

---

## Diapositiva 12

12 PUBLIC Ocultar y deshabilitar campos En modo Edición de la IU, seleccione un campo o múltiples campos y abra el menú contextual para ver opciones de edición: • Ocultar: retira el campo y descripción del formulario • Deshabilitar: un campo editable pasa a estar en gris y no puede ser modificado por el usuario  En el modo edición puede seleccionar un campo individual o múltiples campos y abrir el menú de contexto haciendo clic con el botón derecho del ratón.  Si el campo fuera editable, el menú contextual le permitirá ocultar o deshabilitar el campo o campos seleccionados.  Cuando oculta un campo, se deja un espacio en el formulario. Cuando deshabilita un campo, este pasa a estar en gris y no puede ser cambiado por el usuario.  Si el campo estuviera inactivo (se muestra en gris), el menú contextual solo permitirá ocultar el campo.  En el ejemplo se muestra el formulario de datos maestros del interlocutor comercial, aunque se aplican las mismas reglas de edición a todos los formularios elegibles. 12

---

## Diapositiva 13

13 PUBLIC Arrastrar y soltar  Hacer uso del espacio en blanco en el formulario desplazando campos a una posición más adecuada  Para mover un campo, seleccione el campo y arrástrelo hasta la nueva posición  Se puede mover el campo de una ficha a la cabecera del formulario, o de una ficha a otra ficha diferente  Puede hacer uso del espacio en blanco en un formulario para desplazar campos a una posición más adecuada.  Puede mover campos seleccionándolos y arrastrándolos y soltándolos en su posición.  Puede mover un campo desde una ficha hasta la cabecera principal del formulario.  También puede mover un campo desde una ficha a una ficha diferente dejándola temporalmente en el espacio de la cabecera antes de cambiar a la ficha destino. 13

---

## Diapositiva 14

14 PUBLIC Alineamiento de campos Para alinear campos movidos con campos existentes, seleccione los campos y elija Alinear desde el menú contextual Campos alineados a la izquierda  Después de mover los campos, puede alinearlos con los campos existentes seleccionando Alinear desde el menú contextual.  Para alinear campos con un campo existente, seleccione el campo existente además de los campos movidos y seleccione la izquierda o derecha.  Para cerrar cualquier espacio, seleccione un campo existente además de los campos movidos y seleccione superior o inferior. 14

---

## Diapositiva 15

15 PUBLIC Para mover un campo definido por el usuario (UDF) desde la ventana lateral hasta el espacio del formulario principal: Seleccione y mantenga pulsado el ratón en el campo hasta que aparezca un borde negro (1) Arrastre el rectángulo negro hasta el espacio principal (2) Muévalo hasta la posición y libérelo (3) Cómo mover campos definidos por el usuario 3 1 2 3  Una ventaja fundamental de la edición de un formulario consiste en mover campos definidos por el usuario desde la ventana lateral a la cabecera principal del formulario o a una ficha dentro del mismo.  Esto resulta especialmente útil para UDF añadidos a documentos de marketing. Ya que edita cada tipo de documento de forma independiente, puede mover campos definidos por el usuario solo relevantes para ese tipo de documento sin necesidad de utilizar categorías de UDF en la ventana lateral.  Solo puede moverse un campo UDF a la vez. Para mover un UDF:  Seleccione el campo, no la etiqueta, y manténgalo pulsado con el ratón hasta que aparezca un borde negro (consulte la captura de pantalla 1).  Arrastre el campo hasta el formulario principal (consulte la captura de pantalla 2).  Sitúe el UDF en el formulario principal (consulte la captura de pantalla 3). 15

---

## Diapositiva 16

16 PUBLIC Grabar y restablecer valores propuestos Después de haber realizado los cambios de edición, haga clic en cualquier espacio en blanco del formulario y abra el menú contextual en: • Grabar: confirma los cambios • Restablecer valores propuestos: Deshace todos los cambios y restablece los campos con el formato original  Después de realizar los cambios, tiene que grabarlos. Haga clic en cualquier lugar del espacio en blanco del formulario y abra el menú contextual. Seleccione Grabar para confirmar los cambios. Si cierra la ventana Edición de la IU sin grabar, perderá los cambios.  La opción Restablecer valores propuestos en el menú contextual actúa como un botón “deshacer”. Por lo tanto, si hubiera ocultado un campo, este se restaurará en el formulario en la posición original.  Tenga en cuenta que la acción de restablecimiento de valores propuestos hace que todos los campos del formulario vuelvan al formato original. Incluso si hubiera grabado y cerrado el modelo de IU, cuando restablezca el formulario este se volverá a establecer con las parametrizaciones originales.  Sugerencia: Si decide cambiar un documento ya modificado ampliamente que están utilizando varios usuarios, realice primero una copia del modelo de IU. Esto ofrece la capacidad de restablecer el documento, si fuera necesario, desde la copia, en lugar de tener que restablecerlo con las parametrizaciones originales. 16

---

## Diapositiva 17

17 PUBLIC Cómo añadir fichas Seleccione Añadir ficha desde el menú contextual del espacio en blanco para añadir una nueva ficha a un formulario  Si el formulario o documento incluyera fichas, puede añadir una nueva ficha. Seleccione la opción del menú contextual. Puede mover campos existentes a una nueva ficha, incluyendo campos definidos por el usuario. 17

---

## Diapositiva 18

18 PUBLIC Parametrizaciones de formulario en modo de edición de IU  Cuando abra parametrizaciones de formulario en el Modo edición de la IU, la ficha Elementos de la IU generará una lista de todos los campos de la cabecera y de todos los campos de cada una de las fichas  Puede ocultar y deshabilitar campos marcando las casillas de selección Visible y Activo (equivalente a ocultar y deshabilitar del menú contextual)  En el Modo edición de la IU, cuando abre la ventana de parametrizaciones de formulario, verá una ficha adicional denominada Elementos de la IU. Esta ficha muestra todos los campos visualizados en la cabecera y en cada ficha del documento, y puede ocultar y deshabilitar campos desde esta ventana con las columnas Visible y Activo. Esto es equivalente a ocultar y deshabilitar campos utilizando el menú contextual.  Tenga en cuenta que la ficha Elementos de la IU solo aparece cuando parametrizaciones de formulario se abre desde un formulario en Modo edición de la IU. Los usuarios finales nunca ven la ficha Elementos de la IU. 18

---

## Diapositiva 19

19 PUBLIC Cómo ocultar una ficha con parametrizaciones de formulario  Opción para ocultar la ficha haciendo que la entrada de la ficha sea invisible en los elementos de la IU  También puede ocultar una ficha completa haciendo que la entrada de la ficha sea invisible en la ficha Elementos de la IU.  En el ejemplo, queremos ocultar las fichas Datos de planificación y Propiedades desde los datos maestros de artículo ya que no se utilizan en la empresa. En los parámetros de formulario retiramos la marca de selección de las casillas relevantes para las fichas Datos de planificación y Propiedades. Como resultado, las fichas, ya no aparecerán en el formulario de datos maestros de artículo.  Las fichas Cabecera y General en los formularos de datos maestros se sitúan en gris en las parametrizaciones de formulario y no pueden ocultarse. En los documentos de marketing, la ficha Contenido no puede ocultarse. 19

---

## Diapositiva 20

20 PUBLIC Resumen Modo de edición de la IU Ficha Elementos de la IU Param. de formulario Mover un campo (arrastrar y soltar)  Mover un campo a otra ficha  Mover un campo definido por el usuario al formulario principal  Alinear y compactar campos  Ocultar un campo    Deshabilitar un campo    Añadir una ficha  Ocultar una ficha   La diapositiva muestra una comparación de las acciones de edición que se pueden realizar utilizando el modo de edición de IU, la ventana de parametrizaciones de formulario mediante la ficha Elementos de IU y la ventana de parametrizaciones de formulario estándar.  Tenga en cuenta que la ventana de parametrizaciones de formulario estándar sólo está disponible para ciertos formularios, como los documentos de marketing. 20

---

## Diapositiva 21

Gestión de modelos de configuración de la IU  La siguiente parte de este tema se centra en cómo puede gestionar modelos de configuración de la IU. 21

---

## Diapositiva 22

22 PUBLIC Copia de los formularios editados en otros modelos de IU Pueden crearse y asignarse múltiples modelos de configuración de la IU en diferentes conjuntos de usuarios Para ahorrar tiempo, puede copiar formularios editados de una plantilla de IU a otra. Seleccione uno o varios formularios y, a continuación, el botón Copiar a  Con frecuencia, existe la necesidad de crear múltiples modelos de configuración de la IU y asignarlos a diferentes conjuntos de usuarios.  Una vez que haya realizado los cambios en un formulario en un modelo de configuración de la IU, puede copiar los cambios en otro modelo de configuración de la IU.  Para ello, seleccione las flechas para los formularios que desea copiar, seleccione el botón Copiar a y seleccione el modelo de la IU destino. 22

---

## Diapositiva 23

23 PUBLIC Modelo de IU por defecto  Opción para designar un modelo de configuración de la IU por defecto en Parametrizaciones generales  El modelo por defecto se aplicará a todos los nuevos usuarios y a los usuarios existentes que no estén asignados a ningún otro modelo de IU  Si un usuario se asignara posteriormente a un modelo de IU diferente, el modelo de IU nuevo tendrá preferencia sobre el modelo de IU por defecto.  Ejemplo: Se crea un nuevo modelo de IU Grupo de ventas 2. ¿Qué ocurrirá cuando se establezca como un modelo por defecto? Resultado: Aún asignado al modelo Grupo de ventas 1 Asignado al modelo Grupo de ventas 2 Ya asignado al modelo de IU Grupo de ventas 1 No asignado a ningún modelo de IU  En lugar de asignar un modelo de IU a cada usuario, puede designar un modelo de IU por defecto en la ficha Visualización de Parametrizaciones generales.  Los formularios de modelo por defecto se aplicarán automáticamente a todos los nuevos usuarios creados después de establecer el modelo por defecto, y también se aplicará a usuarios existentes que no están asignados actualmente a ningún modelo de IU.  Si un nuevo usuario se asignara posteriormente a un modelo de IU que no sea el modelo por defecto, los formularios asignados del modelo tendrán preferencia sobre el modelo de IU por defecto.  Vamos a examinar cómo la designación de un modelo de IU por defecto afecta a usuarios existentes que puede que ya estén asignados a un modelo de IU.  En este ejemplo, disponemos de un modelo de IU existente Grupo de ventas 1. Creamos un nuevo modelo de IU Grupo de ventas 2 y lo establecemos como por defecto.  El Usuario A, que fue asignado previamente por nombre al modelo Grupo de ventas 1, no se verá afectado por el modelo por defecto. El Usuario A seguirá viendo los formularios desde el modelo Grupo de ventas 1.  El Usuario B, que no se asignó a ningún modelo, se verá afectado y ahora verá los formularios del modelo Grupo de ventas 2. 23

---

## Diapositiva 24

Perspectiva de usuario 24

---

## Diapositiva 25

25 PUBLIC Parametrizaciones de formulario  El usuario puede mostrar y ocultar campos utilizando las parametrizaciones de formulario  Si el formulario se asigna al usuario en una plantilla de configuración de IU, el nombre de la plantilla aparece en la ventana de parametrizaciones de formulario  El usuario todavía puede realizar modificaciones mediante las parametrizaciones de formulario Cualquier usuario puede mostrar y ocultar campos en un formulario de documento de marketing mediante el icono de parametrizaciones de formulario (si tienen la autorización General > Parametrizaciones de documento). Si el usuario pulsa el icono de parametrizaciones de formulario de un formulario al que están asignados en una plantilla de configuración de IU, el nombre del modelo de IU aparecerá en la ventana de parametrizaciones de formulario. El usuario todavía puede realizar modificaciones en el formulario. 25

---

## Diapositiva 26

26 PUBLIC Varios modelos de IU Si el usuario se asignara a múltiples modelos de IU con formularios solapados:  El primer modelo asignado se considera que tiene la prioridad más alta  El usuario tiene la opción de aplicar un modelo de IU diferente en las parametrizaciones de formulario  El sistema permite asignar múltiples modelos de IU a un usuario. Ya que los modelos podrían contener formularios solapados, ¿cómo sabe el sistema cuál utilizar?  El primer modelo asignado a un usuario se considera que tiene la prioridad más alta.  El usuario tiene la opción de seleccionar un modelo de IU diferente de una lista desplegable en la ventana de parametrizaciones de formulario y cambiar a los formularios de ese modelo seleccionando el botón Aplicar. 26

---

## Diapositiva 27

27 PUBLIC Resumen Puntos clave de este tema: La simplificación de los formularios y documentos utilizados frecuentemente puede mejorar la productividad de los usuarios y reducir errores al procesar formularios Un modelo de configuración de la IU es un conjunto de formularios que se han simplificado y/o modificado para satisfacer las necesidades de usuarios finales Puede crear diferentes modelos de IU para diferentes conjuntos de usuarios Todos los formularios y documentos del sistema pueden modificarse Los cambios incluyen: reordenar campos mediante la función de arrastrar y soltar, mover campos a una nueva ficha, ocultar e inhabilitar campos, alinear campos, añadir y eliminar fichas, mover campos definidos por el usuario desde la ventada lateral Puede asignar usuarios al modelo de IU de manera individual o desde un grupo de usuarios En las parametrizaciones generales puede fijar un modelo de IU predeterminado para todos los nuevos usuarios Estos son los puntos clave de este tema:  La simplificación de los formularios y documentos utilizados frecuentemente puede mejorar la productividad de los usuarios y reducir errores al procesar formularios  Un modelo de configuración de la IU es un conjunto de formularios que se han simplificado y/o modificado para satisfacer las necesidades de usuarios finales  Puede crear diferentes modelos de IU para diferentes conjuntos de usuarios  Todos los formularios y documentos del sistema pueden modificarse  Los cambios incluyen reordenar campos mediante la función de arrastrar y soltar, mover campos a una nueva ficha, ocultar e inhabilitar campos, alinear campos, añadir y eliminar fichas, mover campos definidos por el usuario desde la ventada lateral  Puede asignar usuarios a la plantilla de IU de manera individual por nombre o desde un grupo de usuarios.  En las parametrizaciones generales puede fijar un modelo de IU predeterminado para aplicarla a todos los nuevos usuarios 27

---

