# Guion de Video: DOC 052 Impl UITemplates

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 052 Impl UITemplates.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 052: MODELOS DE CONFIGURACIÓN DE LA INTERFAZ DE USUARIO (UI CONFIGURATION TEMPLATES)
Código de Manual: 10_Impl_35_SystemSetup_UIConfigurationTemplates_ES
Módulo Oficial: Configuración y Gestión del Sistema / Personalización de Formularios (System Setup - UI Templates)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Administradores de Sistemas, Consultores Funcionales, Diseñadores de Ergonomía UI y Agentes IA (Antigravity)
Carpeta Asociada: 052_10_Impl_35_SystemSetup_UIConfigurationTemplates_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "052",

  "topic": "UI Configuration Templates & Form Layout Editing",

  "sap_module": "System_Setup_Customization",

  "database_tables": {

    "template_header": "OUTP (UI Configuration Templates Header)",

    "template_forms": "UTP1 (UI Configuration Template Forms)",

    "template_users": "UTP2 (Users assigned to UI Template)",

    "template_groups": "UTP3 (User Groups assigned to UI Template)",

    "form_settings_custom": "CPRF (User Form Settings Details)"

  },

  "menu_paths": [

    "Gestión > Utilidades > Modelo de configuración de la IU",

    "Herramientas > Editar IU de formulario (Dentro del formulario activo)",

    "Gestión > Inicialización del sistema > Parametrizaciones generales > Ficha Visualización (Modelo por defecto)"

  ],

  "authorizations_required": {

    "personal_form_editing": "General > Editar IU de formulario (Modifica formularios solo para el usuario en sesión)",

    "corporate_template_management": "Gestión > Utilidades > Modelo de configuración de la IU (Crea y asigna plantillas para grupos de usuarios)"

  },

  "ui_editing_capabilities": {

    "drag_and_drop": "Desplazar campos a cualquier área del formulario, mover campos entre fichas o llevar campos de fichas a la cabecera",

    "udf_integration": "Mover Campos Definidos por el Usuario (UDF) desde la barra lateral directamente al cuerpo o cabecera del formulario principal",

    "field_states": {

      "Hide (Ocultar)": "Retira el campo y su etiqueta visualmente, dejando el espacio disponible para compactación",

      "Disable (Deshabilitar)": "Mantiene el campo visible en gris, bloqueando la edición por parte del usuario final"

    },

    "tab_management": {

      "Add_Tab": "Crear pestañas personalizadas adicionales en documentos y maestros",

      "Hide_Tab": "Ocultar pestañas completas desde la ficha 'Elementos de la IU' (Excepto fichas protegidas: Cabecera/General en maestros y Contenido en documentos de marketing)"

    },

    "alignment_tools": "Alinear campos a la izquierda, derecha, superior o inferior para cerrar espacios vacíos"

  },

  "priority_and_assignment_rules": {

    "multiple_templates_assigned": "Si un usuario tiene asignados múltiples modelos de IU con formularios solapados, el primer modelo asignado tiene la prioridad más alta por defecto. El usuario puede alternar manualmente en Parametrizaciones de Formulario.",

    "default_company_template": "El modelo definido en Parametrizaciones Generales se aplica a nuevos usuarios y a usuarios existentes sin plantilla asignada. Si un usuario tiene una plantilla explícita, esta prevalece sobre el modelo por defecto."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Propósito y Ergonomía de los Modelos de Configuración de la IU
En entornos empresariales reales, los formularios estándar de SAP Business One contienen decenas de campos diseñados para cubrir múltiples industrias. Para usuarios operativos con roles específicos (ej. agentes de atención al cliente o cajeros), la saturación visual genera lentitud en la captura de datos y errores de digitación.

Los Modelos de Configuración de la IU (UI Configuration Templates) permiten a los administradores diseñar versiones limpias y optimizadas de formularios y documentos para distribuirlas masivamente por rol:

Modo Edición de la IU: Al ingresar a este modo, el formulario adopta una barra de título negra distintiva con el rótulo Modo edición de la IU, permitiendo la manipulación directa de los elementos visuales.
Segregación de Permisos: Se diferencia rigurosamente la capacidad de alterar la propia pantalla (General > Editar IU de formulario) de la facultad de gobernar las interfaces del resto de la empresa (Gestión > Utilidades > Modelo de configuración de la IU).
2.2 Integración Nativa de Campos Definidos por el Usuario (UDF)
Históricamente, los campos personalizados de usuario residían en la ventana lateral lateral de UDF (Ctrl + Shift + U). Con los Modelos de Configuración de la IU:

El administrador puede arrastrar un campo UDF desde la ventana lateral y soltarlo en la cabecera principal o en cualquier ficha del documento estándar.
Mecánica de Arrastre: Se debe hacer clic sostenido sobre el campo (no sobre la etiqueta de texto) hasta que aparezca un recuadro de borde negro. Posteriormente se arrastra y se suelta en la posición de destino.
Esto elimina la necesidad de que los usuarios mantengan abierta la ventana lateral, integrando los datos propios del negocio en el flujo natural de la pantalla.
2.3 La Ficha "Elementos de la IU" en Parametrizaciones de Formulario
Cuando un administrador abre la ventana de Parametrizaciones de formulario mientras se encuentra dentro del Modo edición de la IU, el sistema despliega una pestaña secreta y exclusiva: Elementos de la IU:

Enumera todos y cada uno de los campos de la cabecera y de todas las fichas del documento.
Contiene las columnas de control Visible y Activo:
Desmarcar Visible oculta el elemento.
Desmarcar Activo deshabilita el campo (queda visible en modo de solo lectura).
Permite ocultar pestañas enteras que la empresa no utilice (ej. ocultar las fichas Datos de planificación o Propiedades en el maestro de artículos).
Fichas Protegidas: Por integridad de la lógica transaccional de SAP, las fichas General/Cabecera en maestros y la ficha Contenido en documentos de marketing no pueden ocultarse.
2.4 Asignación, Herencia y Resolución de Conflictos
Asignación: Se realiza por usuario individual (UTP2) o por Grupos de Usuarios (UTP3) del tipo Configuración de modelos.
Modelo por Defecto: Se define en Parametrizaciones Generales > Visualización. Aplica automáticamente a nuevos usuarios creados en el sistema. Si un usuario ya tiene una plantilla asignada nominalmente, la asignación específica prevalece sobre el valor por defecto.
Resolución de Múltiples Plantillas: Si a un usuario se le asignan dos plantillas (ej. Plantilla Ventas y Plantilla Logística) que modifican la misma Factura de Clientes, el sistema aplica la plantilla asignada en primer lugar. No obstante, el usuario puede ingresar a Parametrizaciones de Formulario y cambiar la plantilla activa en cualquier momento mediante un menú desplegable.


3. COMPARATIVA FUNCIONAL DE MODIFICACIÓN DE PANTALLAS


4. CASO DE NEGOCIO RESUELTO: CALL CENTER DE SERVICIO EN OEC COMPUTERS
Escenario de Consultoría:
El equipo de atención al cliente de OEC Computers gestiona cientos de llamadas de servicio diariamente. Los agentes pierden tiempo navegando entre pestañas para verificar la garantía y el número de serie en los Datos Maestros del Interlocutor Comercial.
Solución Implementada:
El consultor crea el modelo SOPORTE_CLIENTE en Gestión > Utilidades > Modelo de configuración de la IU.
Añade el formulario Datos Maestros de Interlocutor Comercial (BP Master Data) y pulsa Editar IU de formulario.
Oculta campos no bancarios y financieros irrelevantes para soporte.
Arrastra el UDF U_NivelSLA (Tiempo de respuesta contratado) desde la ventana lateral hacia la cabecera principal junto al nombre del cliente.
Crea una nueva pestaña llamada Historial Rápido y mueve allí los campos de contacto telefónico directo.
Guarda los cambios y asigna la plantilla al grupo de usuarios G_CALLCENTER.
Resultado: Los tiempos promedio de llamada se reducen un 25% al tener los datos vitales concentrados en una sola vista.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Qué ocurre si un administrador selecciona la opción "Restablecer valores propuestos" (Reset to Defaults) dentro del Modo de Edición de la IU de un formulario?
A) Se borran los datos del cliente que estaban cargados en pantalla.
B) Se deshacen todas las modificaciones visuales y el formulario se restaura completamente a la disposición y formato original de fábrica de SAP Business One.
C) Se desinstalan los add-ons conectados a la base de datos.
D) Se restablecen las contraseñas de todos los usuarios asignados al modelo.
Respuesta Correcta: B
Justificación Técnica: "Restablecer valores propuestos" actúa como una reversión total a nivel de diseño, eliminando alineaciones, UDFs arrastrados y campos ocultos, devolviendo la ventana a su estado original estándar.
Pregunta 2
¿Cuál de las siguientes pestañas NO puede ocultarse mediante la ficha "Elementos de la IU" en las parametrizaciones de formulario de un documento de marketing?
A) La ficha Finanzas.
B) La ficha Logística.
C) La ficha Contenido.
D) La ficha Anexos.
Respuesta Correcta: C
Justificación Técnica: La pestaña Contenido alberga la grilla transaccional obligatoria donde se especifican artículos, cantidades, precios e impuestos; por ende, SAP prohíbe terminantemente su ocultamiento.
Pregunta 3
¿Cómo se traslada un Campo Definido por el Usuario (UDF) desde la ventana lateral al cuerpo principal de un formulario en Modo de Edición de la IU?
A) Modificando el código fuente en el SDK de SAP.
B) Haciendo clic sostenido sobre el campo en la ventana lateral hasta visualizar un borde negro y arrastrándolo hacia la posición deseada en el formulario principal.
C) Cambiando el nombre del campo en la tabla CUFD.
D) Exportando la pantalla a Microsoft Excel y reimportándola.
Respuesta Correcta: B
Justificación Técnica: La interfaz gráfica interactiva de SAP Business One permite capturar el elemento UDF mediante clic sostenido sobre su caja de entrada (apareciendo un marco negro) y depositarlo por arrastre en la cabecera o fichas del formulario.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
