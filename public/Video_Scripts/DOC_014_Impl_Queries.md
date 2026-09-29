# Guion de Video: DOC 014 Impl Queries

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 014 Impl Queries.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 014: HERRAMIENTAS DE PERSONALIZACIÓN - GENERADOR DE CONSULTAS SQL (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Impl_11_CustomTools_Queries_ES
Módulo Oficial: Implementación / Herramientas de Personalización (Customization Tools - SQL Queries)
Versión de SAP: Business One 10.0 (SAP HANA & MS SQL Server)
Audiencia Objetivo: Consultores Técnicos y Funcionales, Desarrolladores de Reportes, Administradores de Sistemas y Agentes IA (Antigravity)
Carpeta Asociada: 014_10_Impl_11_CustomTools_Queries_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "014",

  "topic": "Customization Tools - SQL Queries & System Information",

  "sap_module": "Implementation_Queries",

  "inspection_tools": {

    "system_information_shortcut": "Ctrl + Shift + I (o menú Vista > Información del sistema)",

    "status_bar_display": "Muestra en la esquina inferior izquierda: Nombre de Tabla (4 caracteres), Nombre de Campo, Longitud de datos, Número de Item y Número de Columna",

    "form_identifiers": {

      "header_field_example": "CardCode en documentos de marketing es siempre Item 4 (Columna 0)",

      "line_field_example": "ItemCode en líneas de documentos de marketing es siempre Item 38 (Columna 1)",

      "importance": "Permite formular consultas universales independientes del tipo de documento utilizando sintaxis de formulario"

    },

    "reference_documentation": "REFDB (SDK Help / Data Transfer Workbench Help) para consultar tipos de datos, llaves foráneas y listas de valores permitidos"

  },

  "database_naming_conventions": {

    "table_length": "4 caracteres estándar",

    "master_data_examples": {

      "OCRD": "Cabecera de Socios de Negocios",

      "CRD1": "Direcciones fiscales y de entrega de Socios de Negocios",

      "OCPR": "Personas de contacto",

      "OITM": "Datos maestros de artículos"

    },

    "marketing_documents_pattern": {

      "rule": "La letra 'O' prefija la cabecera del documento; el nombre sin 'O' con un '1' sufijado representa las líneas",

      "Sales_Order": "ORDR (Cabecera) / RDR1 (Líneas)",

      "Delivery": "ODLN (Cabecera) / DLN1 (Líneas)",

      "AR_Invoice": "OINV (Cabecera) / INV1 (Líneas)",

      "Purchase_Order": "OPOR (Cabecera) / POR1 (Líneas)",

      "GRPO": "OPDN (Cabecera) / PDN1 (Líneas)",

      "AP_Invoice": "OPCH (Cabecera) / PCH1 (Líneas)"

    }

  },

  "query_tools_suite": [

    { "tool": "Query Wizard (Asistente de consultas)", "interface": "Asistente guiado de varios pasos con tecla Tab para búsqueda y auto-joins" },

    { "tool": "Query Generator (Generador de consultas)", "interface": "Pantalla única; campos en negrita indican claves foráneas para drag-and-drop de tablas relacionadas" },

    { "tool": "Query Preview / Editor", "interface": "Permite escribir SQL manual puro desde cero y grabar en el Administrador de Consultas" }

  ],

  "syntax_rules": {

    "hana_vs_sqlserver": "En SAP HANA los nombres de tablas y campos llevan comillas dobles (T0.\"CardCode\"); en SQL Server corchetes ([CardCode])",

    "runtime_variables": "Variables de parámetro para el usuario con sintaxis [%0], [%1], [%2] que despliegan ventanas modales para ingreso dinámico de valores",

    "active_window_syntax": "$[TableName.FieldName] o $[Item.Column] para capturar valores de la ventana activa en pantalla (imprescindible para FMS y Procedimientos de Autorización)",

    "security_constraint": "Las herramientas de consulta son ESTRICTAMENTE de solo lectura (SELECT). Está totalmente prohibido ejecutar INSERT, UPDATE, DELETE o DROP en tablas estándar; invalida la garantía oficial de SAP."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Ecosistema de Consultas en SAP Business One
Las herramientas de consulta SQL constituyen el pilar fundamental para la personalización y extensibilidad del ERP. A diferencia de las herramientas de reporte gráfico pesado (como Crystal Reports), las consultas de usuario están diseñadas para:

Reportes Ad-Hoc Ágiles: Creación de listas dinámicas ejecutables bajo demanda.
Disparadores de Procedimientos de Autorización: Evaluación de condiciones comerciales complejas en tiempo de ejecución.
Búsquedas Formateadas (FMS) / Valores Definidos por el Usuario: Auto-rellenado dinámico de campos condicionados por la información digitada en pantalla.
Alimentación de Cuadros de Mando (KPIs y Dashboards en Cockpit Fiori): Vistas semánticas para análisis analítico en tiempo real.
2.2 Descubrimiento del Modelo de Datos: Información del Sistema
Para construir consultas eficientes, el consultor debe conocer con exactitud técnica la tabla y columna donde reside la información:

Al activar Información del sistema (Ctrl + Shift + I o menú Vista), la barra de estado inferior revela en tiempo real los metadatos del campo sobre el cual se posiciona el puntero del ratón:
[Tabla].[Campo]: Ejemplo OCRD.CardName o RDR1.Price.
Formulario / Item / Columna: En un documento de marketing, la cabecera siempre es el Item 4 para CardCode, mientras que las líneas son el Item 38 para ItemCode.
Campos Calculados o Compuestos: Campos de precio, totales de factura e impuestos que se muestran en pantalla concatenados con el símbolo de moneda (ej. $ 1,500.00) no muestran el nombre físico de la columna en la barra de estado. Para consultar estos datos, se debe recurrir al archivo de referencia de base de datos REFDB (disponible en la carpeta SDK o en el menú de ayuda del Data Transfer Workbench - DTW).
2.3 Generador de Consultas vs Asistente de Consultas
Asistente de Consultas (Query Wizard): Diseñado para usuarios funcionales o con poco dominio de SQL. El usuario presiona Tab para seleccionar tablas de una lista, selecciona columnas y el asistente genera las sentencias INNER JOIN de forma transparente.
Generador de Consultas (Query Generator): Herramienta rápida en una sola pantalla para consultores técnicos. Muestra las tablas seleccionadas en la columna izquierda; los campos que representan claves foráneas hacia otras tablas se destacan en negrita. Arrastrar y soltar un campo en negrita hacia el selector de tablas abre automáticamente la tabla relacionada y formula el enlace relacional.
2.4 Parámetros Dinámicos y Sintaxis de Ventana Activa
A. Variables de Parámetro ([%0])
Permiten que una consulta grabada sea interactiva. En lugar de fijar una fecha estática en la cláusula WHERE, se utiliza la sintaxis WHERE T0."DocDate" >= [%0]. Al ejecutarse, SAP B1 despliega una ventana donde el usuario selecciona la fecha deseada en un calendario emergente.
B. Sintaxis de Ventana Activa ($[Tabla.Campo])
Cuando una consulta debe ejecutarse mientras el usuario está procesando un documento que aún no ha sido guardado en la base de datos (como en un flujo de aprobación o una búsqueda formateada):

La sintaxis convencional SELECT ... FROM ORDR fallaría porque el documento aún no existe físicamente en las tablas relacionales.
Se utiliza la sintaxis especial con el signo dólar y corchetes: $$$[\text{ORDR}.\text{CardCode}] \quad \text{o} \quad $[$4.0.0]$$
El motor de SAP B1 captura el valor presente en la memoria gráfica de la ventana activa del usuario y lo inyecta como parámetro en la consulta SQL.


3. ATLAS DIDÁCTICO: COMPARATIVA DE SINTAXIS ESTÁNDAR VS VENTANA ACTIVA
-- CONSULTA 1: REPORTE AD-HOC DE AUDITORÍA (Base de Datos Física)

-- Busca pedidos abiertos de clientes en los últimos 7 días con total mayor a $5,000

SELECT 

    T0."DocNum" AS "Nº Pedido",

    T0."CardCode" AS "Código Cliente",

    T0."CardName" AS "Nombre Cliente",

    T0."DocTotal" AS "Monto Total",

    T1."SlpName" AS "Vendedor"

FROM ORDR T0

INNER JOIN OSLP T1 ON T0."SlpCode" = T1."SlpCode"

WHERE T0."DocStatus" = 'O' 

  AND T0."DocDate" >= ADD_DAYS(CURRENT_DATE, -7)

  AND T0."DocTotal" > 5000

ORDER BY T0."DocTotal" DESC;

-- CONSULTA 2: BÚSQUEDA FORMATEADA (Ventana Activa en Pantalla)

-- Recupera el saldo deudor actual del cliente seleccionado en el formulario activo

SELECT T0."Balance" 

FROM OCRD T0 

WHERE T0."CardCode" = $[ORDR.CardCode];


4. CASO DE NEGOCIO RESUELTO: ALERTAS DE COMPRA EN OEC COMPUTERS
Escenario de Consultoría:
George, jefe de almacén en OEC Computers, necesita un informe diario que muestre los pedidos de compra pendientes de entrega ordenados por proveedor, indicando el número de órdenes y el monto total acumulado.
Formulación de la Consulta SQL (Sintaxis SAP HANA):
SELECT 

    T0."CardCode" AS "Código Proveedor",

    T0."CardName" AS "Razón Social Proveedor",

    COUNT(T0."DocNum") AS "Total Órdenes Abiertas",

    SUM(T0."DocTotal") AS "Monto Acumulado Pendiente"

FROM OPOR T0

WHERE T0."DocStatus" = 'O'

GROUP BY T0."CardCode", T0."CardName"

ORDER BY SUM(T0."DocTotal") DESC;
Implementación y Despliegue:
George abre Herramientas > Consultas > Generador de consultas.
Pega la sentencia en el editor de consultas y pulsa Ejecutar.
Los resultados muestran la lista consolidada de proveedores con pedidos abiertos.
George pulsa el botón Guardar, selecciona la categoría Compras - Auditoría y nombra la consulta ORDENES_COMPRA_PENDIENTES_PROV.
La consulta queda disponible en el Administrador de Consultas para todo el equipo de adquisiciones.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es el atajo de teclado oficial en SAP Business One para activar la "Información del sistema" y visualizar los nombres técnicos de tablas y campos en la barra de estado?
A) Ctrl + Alt + Del
B) Ctrl + Shift + I
C) F5
D) Alt + F11
Respuesta Correcta: B
Justificación Técnica: Al presionar Ctrl + Shift + I, el sistema habilita la inspección de metadatos en la barra de estado inferior al pasar el cursor sobre cualquier control de la pantalla.
Pregunta 2
En el desarrollo de una búsqueda formateada (FMS) o condición de aprobación que debe leer un valor del documento que el usuario tiene abierto en pantalla antes de guardarlo, ¿qué sintaxis especial debe emplearse?
A) SELECT * FROM TMP_DOCUMENT
B) $[NombreTabla.NombreCampo] o $[Item.Columna] utilizando el símbolo de dólar y corchetes.
C) Declarar una variable global en SQL Server Management Studio.
D) Crear un archivo XML temporal en la carpeta del usuario.
Respuesta Correcta: B
Justificación Técnica: El prefijo $ y los corchetes instruyen al cliente de SAP Business One para capturar el dato presente en la memoria de la ventana activa en lugar de intentar leer una tabla que aún no se ha confirmado.
Pregunta 3
¿Por qué está terminantemente prohibido ejecutar sentencias SQL de modificación como INSERT, UPDATE o DELETE mediante las herramientas de consulta o accesos directos de base de datos contra tablas estándar de SAP Business One?
A) Porque la base de datos se borra automáticamente.
B) Porque se saltan las reglas de validación de negocio, contabilidad de partida doble y lógica de integridad transaccional del DI-API, corrompiendo la base de datos e invalidando el soporte oficial de SAP.
C) Porque solo los administradores de red pueden escribir en mayúsculas.
D) Porque el servidor consume el 100% de la memoria RAM de forma permanente.
Respuesta Correcta: B
Justificación Técnica: Cualquier manipulación directa que no pase por el Application Layer / DI-API de SAP B1 destruye la coherencia relacional entre documentos y libros mayores, provocando la pérdida inmediata del soporte del fabricante.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
