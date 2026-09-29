# Guion de Video: DOC 017 Impl UserDefinedValues

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 017 Impl UserDefinedValues.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 017: VALORES DEFINIDOS POR EL USUARIO (UDV / BÚSQUEDAS FORMATEADAS FMS) EN SAP BUSINESS ONE 10.0
Código de Manual: 10_Impl_15_CustomTools_UserDefinedValues_ES
Módulo Oficial: Herramientas de Customizing e Implementación (Customization Tools)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Administradores de Sistemas, Desarrolladores SQL/HANA y Arquitectos de IA (Antigravity)
Carpeta Asociada: 017_10_Impl_15_CustomTools_UserDefinedValues_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "017",

  "topic": "User-Defined Values (UDV) & Formatted Searches (FMS)",

  "sap_module": "Customization_Tools_FMS",

  "database_tables": {

    "queries": "OUQR",

    "query_categories": "OQCN",

    "user_queries_permissions": "OUPR"

  },

  "menu_paths": [

    "Herramientas > Herramientas de customizing > Valores definidos por usuario: Definición (Alt + Shift + F2)",

    "Ver > Visualización de colectores > Valores definidos por usuario (para mostrar/ocultar icono de lupa)",

    "Herramientas > Consultas > Generador de consultas (para redactar SQL base)"

  ],

  "udv_modes": {

    "None": "Sin buscar en valores definidos por usuario (elimina la búsqueda formateada)",

    "Static_List": "Buscar en valores existentes definidos por usuario (lista estática desplegable; permite botón 'Nuevo')",

    "Saved_Query": "Buscar en valores existentes definidos por usuario según consulta grabada (SQL dinámico)"

  },

  "dynamic_syntax_rules": {

    "active_form_reference": "$[$Item.Column.Number] o $[Table.Field]",

    "hana_syntax_example": "SELECT ADD_DAYS($[$4.0.DATE], 7) FROM DUMMY",

    "sql_server_syntax_example": "SELECT DATEADD(day, 7, CONVERT(datetime, $[$4.0.0], 112))",

    "cross_table_subquery": "SELECT T0.\"Balance\" FROM OCRD T0 WHERE T0.\"CardCode\" = $[$4.0.0]"

  },

  "auto_refresh_logic": {

    "trigger_fields_limit": "Máximo 5 campos dependientes que disparan la ejecución automática",

    "refresh_frequency_modes": {

      "Display_Saved_User_Defined_Values": "Modo por defecto. Se ejecuta una sola vez al dispararse el evento y fija el valor calculado. No recalcula al abrir documentos históricos.",

      "Refresh_Regularly": "Recalcula cada vez que se modifica o selecciona el campo disparador, e incluso al navegar/abrir documentos históricos (pone el documento en modo Actualizar)."

    },

    "line_level_triggers": {

      "On_Exit_Modified_Column": "Se dispara únicamente al abandonar columnas editables por el usuario",

      "When_Column_Value_Changes": "Se dispara ante cualquier cambio en la columna, incluyendo campos calculados por el sistema (impuesto, ganancia bruta, importe total)"

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Concepto y Arquitectura de las Búsquedas Formateadas (FMS / UDV)
Los Valores Definidos por el Usuario (User-Defined Values - UDV), conocidos tradicionalmente en el ecosistema SAP como Búsquedas Formateadas (Formatted Searches - FMS), constituyen el mecanismo nativo más potente para automatizar la captura de datos, ejecutar cálculos en tiempo real y enlazar lógica empresarial compleja directamente sobre la interfaz de usuario sin programar add-ons externos.

Pueden vincularse a:

Cualquier campo estándar editable del sistema (tanto en cabecera como en líneas).
Cualquier Campo Definido por el Usuario (UDF). Identificador visual: Cuando un campo posee una búsqueda formateada asignada, el sistema exhibe un icono de lupa en su extremo derecho (cuya visualización se habilita o inhabilita desde Ver > Visualización de colectores > Valores definidos por usuario).
2.2 Modos de Implementación de UDV
A. Lista Estática de Valores
Permite asociar una lista cerrada de opciones directamente a un campo editable. A diferencia de los "Valores válidos" de un UDF, la lista de un UDV permite que usuarios con autorización creen nuevos elementos en la lista mediante el botón Nuevo en el momento de la captura, sin acudir a la consola de administración.
B. Consulta Grabada (SQL Query FMS)
Permite asociar una consulta guardada en el Gestor de Consultas de SAP Business One. El resultado devuelto por la sentencia SQL se inserta directamente en el campo destino.

Compatibilidad de Tipos: El tipo de dato devuelto por la consulta SQL (Texto, Numérico, Fecha) debe coincidir estrictamente con el tipo de datos del campo de destino para evitar desbordamientos o errores de conversión.
Variables Dinámicas de Formulario Activo: Para que una consulta lea los valores que el usuario está digitando en pantalla antes de guardar el documento en la base de datos, se utiliza la sintaxis especial con corchetes y símbolo de dólar:
Sintaxis indexada por Item/Columna: $[Item.Column.Type] (ej. $[$4.0.0] para el código de cliente en cabecera de ventas).
Sintaxis nominal: $[ORDR.DocDate.DATE].
En SAP HANA, las operaciones escalares sin tabla origen requieren la cláusula FROM DUMMY.
2.3 Lógica de Actualización Automática (Auto-Refresh) y Disparadores
Un UDV basado en consulta puede configurarse en dos modos operativos:

Ejecución Manual: El usuario hace clic en la lupa o presiona Shift + F2 en el campo para ejecutar la consulta bajo demanda.
Actualización Automática al Modificarse Campo: La consulta se dispara automáticamente cuando cambia el valor de hasta 5 campos dependientes seleccionados.
Frecuencia de Actualización:
Visualizar valores grabados definidos por usuario (Recomendado): La consulta se ejecuta una única vez al cumplirse el evento disparador y congela el resultado en el documento. Si el documento se consulta meses después, el valor original permanece intacto. Ideal para: Fechas calculadas de entrega, condiciones comerciales fijas, costos base al momento de la venta.
Actualizar regularmente: La consulta se reejecuta cada vez que el registro se abre, se navega o se altera el campo dependiente. Si el valor devuelto difiere del guardado, el documento pasa automáticamente al modo Actualizar. Ideal para: Visualización en vivo del saldo contable de un cliente, límite de crédito remanente o stock disponible en almacén.


3. ATLAS TÉCNICO: ANATOMÍA DE UNA BÚSQUEDA FORMATEADA (FMS)
┌─────────────────────────────────────────────────────────────────────────┐

│              CONFIGURACIÓN DE BÚSQUEDA FORMATEADA (Alt + Shift + F2)   │

├─────────────────────────────────────────────────────────────────────────┤

│ Campo Destino: Fecha de entrega (DocDueDate)                            │

│ Modalidad: Buscar según consulta grabada                                │

│ Consulta: 'CALC_FECHA_ENTREGA'                                          │

│                                                                         │

│ Sentencia SQL (HANA):                                                   │

│   SELECT ADD_DAYS($[$4.0.DATE], 5) FROM DUMMY                          │

│                                                                         │

│ Disparador:                                                             │

│   [X] Actualización automática al modificarse campo                     │

│   Campo Dependiente: Fecha de contabilización ($[$4.0.0])               │

│                                                                         │

│ Frecuencia:                                                             │

│   (o) Visualizar valores grabados (Ejecución única en creación)         │

│   ( ) Actualizar regularmente                                           │

└─────────────────────────────────────────────────────────────────────────┘


4. CASO DE NEGOCIO RESUELTO: OPTIMIZACIÓN DE VENTAS EN OEC COMPUTERS
Escenario de Consultoría:
María y el equipo comercial de OEC Computers identifican dos ineficiencias al tomar pedidos telefónicos:

Cálculo de Entrega: Los clientes solicitan entrega estándar en 5 días laborales. Los vendedores suelen olvidar llenar la Fecha de entrega o la calculan mal con el calendario manual.
Control de Morosidad en Vivo: Los vendedores necesitan ver inmediatamente el saldo pendiente de cobro del cliente en cuanto ingresan su código, sin necesidad de abrir la ficha maestra del cliente ni generar reportes auxiliares.
Implementación Técnica:
FMS 1: Cálculo Automático de Fecha de Entrega:
Se guarda la consulta SQL: SELECT ADD_DAYS($[$DocDate.0.DATE], 5) FROM DUMMY.
En el campo Fecha de entrega (DocDueDate) del Pedido de Clientes, se pulsa Alt + Shift + F2.
Se selecciona la consulta, se tilda Actualización automática al modificarse campo, se elige como disparador el campo Fecha de contabilización y se selecciona Visualizar valores grabados.
Resultado: Al digitar la fecha del pedido, la fecha de entrega se autocompleta con +5 días de forma instantánea.
FMS 2: Saldo Vivo del Cliente en Cabecera:
Se crea el UDF de cabecera U_SaldoActual (Tipo: Unidades y Totales, Estructura: Importe).
Se guarda la consulta SQL: SELECT T0."Balance" FROM OCRD T0 WHERE T0."CardCode" = $[$4.0.0].
En el campo U_SaldoActual, se abre la ventana con Alt + Shift + F2, se asocia la consulta, se activa actualización automática dependiente del campo Código de cliente ($[$4.0.0]) y se marca la opción Actualizar regularmente.
Resultado: Al seleccionar el cliente C20000, el saldo vivo aparece en pantalla al milisegundo, alertando al vendedor si el cliente excede su línea de crédito.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es el atajo de teclado universal en SAP Business One para abrir la ventana de definición de Valores Definidos por el Usuario (UDV / Búsqueda Formateada) en un campo seleccionado?
A) Ctrl + Shift + U
B) Alt + Shift + F2
C) Ctrl + Shift + B
D) Shift + F2
Respuesta Correcta: B
Justificación Técnica: Alt + Shift + F2 abre la ventana de configuración del UDV; Shift + F2 se utiliza para ejecutar manualmente la búsqueda ya configurada, y Ctrl + Shift + U abre el panel lateral de UDF.
Pregunta 2
Si se configura una consulta de actualización automática en un campo de cabecera seleccionando la frecuencia "Actualizar regularmente", ¿qué efecto operativo se produce al visualizar documentos históricos grabados?
A) El sistema bloquea el documento y prohíbe su visualización.
B) La consulta se reejecuta cada vez que se visualiza o navega por el documento, recalculando el valor y colocando el documento en modo "Actualizar" si el dato cambió.
C) El valor original se conserva invariable para siempre.
D) Se borra la línea de asientos contables asociada.
Respuesta Correcta: B
Justificación Técnica: La opción Actualizar regularmente fuerza la reevaluación de la sentencia SQL ante cualquier apertura o cambio del registro, lo que puede provocar que documentos históricos alteren sus valores informativos si las condiciones en base de datos variaron.
Pregunta 3
¿Hasta cuántos campos dependientes permite seleccionar SAP Business One para desencadenar la ejecución de una búsqueda formateada con actualización automática?
A) Solo 1 campo.
B) Hasta 5 campos dependientes.
C) Máximo 10 campos.
D) Ilimitados.
Respuesta Correcta: B
Justificación Técnica: La interfaz de configuración de valores definidos por el usuario de SAP Business One permite parametrizar una lista de hasta un máximo de 5 campos disparadores (triggers) por cada búsqueda formateada.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
