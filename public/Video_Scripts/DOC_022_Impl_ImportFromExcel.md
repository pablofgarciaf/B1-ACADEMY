# Guion de Video: DOC 022 Impl ImportFromExcel

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 022 Impl ImportFromExcel.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 022: HERRAMIENTAS DE IMPLEMENTACIÓN - IMPORTACIÓN DESDE EXCEL (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Impl_31_ImportfromExcel
Módulo Oficial: Implementación y Migración de Datos (Data Import / Data Management)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Administradores de Datos, Contadores y Agentes IA (Antigravity)
Carpeta Asociada: 022_10_Impl_31_ImportfromExcel


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "022",

  "topic": "Implementation Tools: Import from Excel",

  "sap_module": "Implementation_DataImport",

  "tool_name": "Import from Excel (Importar de Excel)",

  "menu_paths": [

    "Gestión > Importación/Exportación de datos > Importación de datos > Importar de Excel",

    "Gestión > Inicialización del sistema > Centro de implementación > Tareas de implementación > Ficha Gestión de datos"

  ],

  "supported_business_objects": [

    {

      "object": "Business Partner Master Data",

      "header_table": "OCRD",

      "child_tables": {

        "contacts": "OCPR",

        "addresses": "CRD1"

      },

      "type_codes": { "C": "Cliente (Customer)", "S": "Proveedor (Supplier/Vendor)", "L": "Lead" }

    },

    {

      "object": "Item Master Data",

      "header_table": "OITM",

      "prices_table": "ITM1",

      "item_types": { "I": "Artículo (Item)", "L": "Mano de obra (Labor)", "T": "Viaje (Travel)" },

      "valuation_methods": { "A": "Promedio Ponderado (Moving Average)", "S": "Estándar", "F": "FIFO", "B": "Número de Serie/Lote" },

      "uom_restriction": "Todos los artículos importados por esta vía se crean obligatoriamente con el Grupo de UdM 'Manual' (OITM.UgpEntry no está expuesto en la interfaz)."

    },

    {

      "object": "Prices in Price Lists",

      "tables": ["OPLN", "ITM1"],

      "import_method_allowed": "Únicamente 'Actualizar registros existentes sin agregar nuevos'"

    },

    {

      "object": "Business Partner Catalog Numbers",

      "table": "OSCN",

      "required_fields": ["ItemCode", "CardCode", "Substitute"]

    },

    {

      "object": "Journal Entries",

      "header_table": "OJDT",

      "lines_table": "JDT1",

      "row_identifiers": {

        "H": "Línea de Cabecera (Header) - Columnas A a M",

        "L": "Línea de Asiento (Line) - Columna N define 'GL' (Cuenta Mayor) o 'BP' (Socio de Negocios)"

      },

      "import_method_allowed": "Únicamente 'Agregar nuevos registros sin actualizar existentes'"

    }

  ],

  "technical_file_rules": {

    "format": "Texto delimitado por tabulaciones (*.txt)",

    "header_row": "PROHIBIDO incluir fila de encabezados en el archivo Excel/TXT. La fila 1 debe contener datos directos.",

    "cell_format": "Texto (Text) obligatorio para evitar truncamientos de ceros a la izquierda y decimales.",

    "file_lock": "El archivo de texto DEBE estar cerrado en el sistema operativo antes de ejecutar la importación, de lo contrario generará error de bloqueo."

  },

  "integration_points": [

    "Saldos Iniciales de Cuentas de Mayor (Finanzas > Saldos iniciales)",

    "Saldos Iniciales de Socios de Negocios",

    "Saldos Iniciales de Inventario (Inventario > Operaciones de stock > Saldos iniciales)",

    "Formulario de Asientos individuales (Importar de Excel para asientos con cientos de líneas)"

  ]

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Propósito y Ventajas del Asistente "Importar de Excel"
La utilidad Importar de Excel en SAP Business One está diseñada para la ingesta rápida y periódica de datos masivos sin requerir la complejidad de configuración de Data Transfer Workbench (DTW). Es la herramienta preferida por usuarios clave y consultores para cargas mensuales de listas de precios de proveedores, catálogos de distribuidores y saldos iniciales de apertura de ejercicios.

La herramienta interactúa con la base de datos a través de la interfaz DI API (Data Interface API), lo que garantiza que se ejecuten todas las reglas de validación de integridad referencial del ERP.
2.2 Requisitos y Reglas de Formateo del Archivo
Para que la importación sea exitosa, la hoja de cálculo de Microsoft Excel debe cumplir rigurosamente con los siguientes estándares:

Sin Encabezados: La fila 1 debe contener el primer registro de datos. Si se incluye una fila con nombres de columnas, SAP B1 intentará importarla como código de artículo o socio de negocios, provocando un error.
Formato de Celdas como Texto: Previene que Excel elimine ceros a la izquierda en códigos postales, RUC/NIT/NIF o números de cuentas contables.
Guardar y Cerrar: El archivo debe guardarse como Texto delimitado por tabulaciones (*.txt) y debe cerrarse en Excel antes de iniciar el asistente en SAP Business One; si el archivo permanece abierto, el sistema operativo denegará el acceso por bloqueo de lectura.
2.3 Mapeo de Columnas y Tablas Hijas (Contactos y Direcciones)
En la ventana de importación, el consultor asigna cada letra de columna (A, B, C...) al campo destino de SAP B1:

Valores por Defecto: Si una columna se omite o queda en blanco, el sistema aplica la parametrización predeterminada (por ejemplo, si no se especifica moneda, toma la moneda local; si no se especifica grupo de socios, asigna el primero del sistema).
Importación de Personas de Contacto (OCPR):
Puede importarse en la misma fila del socio de negocios seleccionando el campo clave Persona de contacto... (resaltado en azul).
Al seleccionarlo, se despliega una secuencia fija de columnas que debe respetarse escrupulosamente en el archivo.
Para importar múltiples personas de contacto por cada cliente, se ejecuta un procedimiento en 2 pasos: primero se crea la cabecera del cliente con el método Agregar nuevos registros, y luego se importa un segundo archivo con los contactos vinculados por código de cliente mediante el método Actualizar registros existentes.
Importación de Direcciones de Facturación y Envío (CRD1): Sigue la misma lógica fija de columnas para Destino de factura y Destino de entrega.
2.4 Particularidades en Artículos y Listas de Precios
Grupo de Unidades de Medida: La herramienta Importar de Excel asigna automáticamente el grupo de UdM Manual. No permite asignar grupos de UdM complejos (como cajas o palets) durante la creación porque el campo OITM.UgpEntry no está expuesto en la lista desplegable.
Actualización de Precios (ITM1): Para actualizar precios de venta en listas predefinidas (OPLN), el artículo y la lista deben existir previamente en el sistema. El único método admitido es Actualizar registros existentes sin agregar nuevos.
2.5 Carga de Asientos Contables Masivos (OJDT / JDT1)
La utilidad permite importar asientos contables multilínea complejos mediante un identificador en la Columna A:

Fila H (Cabecera): Define fecha de contabilización, fecha de vencimiento, fecha de documento, serie y comentarios (columnas A a M).
Filas L (Líneas del Asiento): Contiene la imputación contable. La columna N define si la cuenta corresponde a GL (Cuenta de Mayor) o BP (Socio de Negocios).
El asiento debe cumplir el principio de partida doble ($\sum \text{Debe} = \sum \text{Haber}$) en las líneas L subordinadas antes de pasar a la siguiente cabecera H.


3. CASO DE NEGOCIO RESUELTO: ACTUALIZACIÓN MENSUAL DE CLIENTES EN OEC COMPUTERS
Escenario de Consultoría:
Los distribuidores de OEC Computers envían un archivo Excel con 150 clientes nuevos y 80 clientes existentes con cambios de dirección fiscal y teléfonos de contacto para soporte de garantías.
Pasos de Implementación:
El consultor prepara la hoja de cálculo, elimina la fila de títulos y formatea todas las celdas como Texto.
En la Columna A coloca el código de cliente, Columna B el nombre, Columna C el tipo (C), Columna D el teléfono y Columna E la dirección.
Guarda el archivo como Clientes_Septiembre_2026.txt y lo cierra.
Abre en SAP B1: Gestión > Importación/Exportación de datos > Importar de Excel.
Selecciona el objeto Socio de negocios, busca el archivo .txt y mapea las columnas A a E con los campos correspondientes.
Selecciona el método de importación: Agregar nuevos registros y actualizar existentes.
Ejecuta la importación: El sistema inserta los 150 clientes nuevos con sus parámetros por defecto y actualiza los 80 clientes existentes sin alterar sus saldos históricos de balance.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál de las siguientes afirmaciones es una regla obligatoria al estructurar un archivo de hoja de cálculo para la herramienta "Importar de Excel" en SAP Business One?
A) La primera fila del archivo debe contener los nombres técnicos de las tablas SQL.
B) El archivo debe guardarse como texto delimitado por tabulaciones (*.txt) y NO debe incluir ninguna fila de encabezado.
C) Es obligatorio ingresar un valor numérico para cada campo disponible en el sistema.
D) El archivo debe permanecer abierto en Microsoft Excel mientras se ejecuta la importación para verificar bloqueos.
Respuesta Correcta: B
Justificación Técnica: La herramienta espera que los datos transaccionales comiencen exactamente en la fila 1 y exige el formato de texto delimitado por tabulaciones; incluir encabezados corrompe la primera fila y dejar el archivo abierto genera un error de acceso exclusivo del sistema operativo.
Pregunta 2
Al importar Artículos (Item Master Data) mediante la herramienta "Importar de Excel", ¿qué grupo de Unidades de Medida (UoM Group) se asigna a los nuevos artículos creados?
A) El grupo configurado en el Grupo de Artículos.
B) Se asigna automáticamente el grupo de UdM "Manual", ya que el campo UgpEntry no está disponible para selección en esta utilidad.
C) El sistema solicita al usuario seleccionar el grupo en una ventana emergente por cada artículo.
D) No se asigna ningún grupo de UdM.
Respuesta Correcta: B
Justificación Técnica: Por diseño de la interfaz de Importar de Excel, todos los artículos importados quedan registrados bajo el grupo de UdM "Manual". Si se requiere una estructura de UdM agrupada, debe utilizarse Data Transfer Workbench (DTW).
Pregunta 3
¿Cómo distingue el asistente de importación las filas de cabecera de las filas de detalle al realizar una carga masiva de Asientos Contables (Journal Entries)?
A) Por el color de la celda en Excel.
B) Mediante un indicador en la Columna A: el carácter 'H' identifica la cabecera del asiento y el carácter 'L' identifica las líneas de imputación contable.
C) Separando las cabeceras en un archivo de texto y las líneas en otro archivo distinto.
D) Mediante una fórmula matemática de saldo cero.
Respuesta Correcta: B
Justificación Técnica: El formato de importación de asientos exige colocar 'H' (Header) para los datos generales del asiento y 'L' (Lines) para cada una de las partidas de débito/crédito asociadas.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
