# Guion de Video: DOC 025 Impl DataTransferWorkbench

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 025 Impl DataTransferWorkbench.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 025: HERRAMIENTAS DE IMPLEMENTACIÓN - DATA TRANSFER WORKBENCH (DTW) EN SAP BUSINESS ONE 10.0
Código de Manual: 10_Impl_32_Using_Data_Trans_Workbench
Módulo Oficial: Implementación y Migración Masiva de Datos (Data Transfer Workbench / DI API)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Técnicos y Funcionales, Administradores de Datos, Arquitectos de Integración y Agentes IA (Antigravity)
Carpeta Asociada: 025_10_Impl_32_Using_Data_Trans_Workbench


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "025",

  "topic": "Implementation Tools: Using Data Transfer Workbench (DTW)",

  "sap_module": "Implementation_DTW_Migration",

  "software_components": {

    "executable": "DTW.exe",

    "core_interface": "SAP Business One DI API (Data Interface API)",

    "architecture": "Cliente desktop independiente o integrado vía Centro de Implementación (SLD)",

    "supported_sources": [

      "Archivos delimitados por tabulaciones (*.txt)",

      "Archivos delimitados por comas (*.csv)",

      "Archivos delimitados por punto y coma (*.csv)",

      "Conexión directa a bases de datos externas vía ODBC con sentencias SQL"

    ]

  },

  "data_categories_supported": {

    "Setup_Data": "Bancos, códigos de impuestos, usuarios, grupos de artículos y socios, saldos iniciales.",

    "Master_Data": "Maestros de Socios de Negocios (OCRD), Artículos (OITM), Empleados (OHEM), Activos Fijos.",

    "Transactional_Data": "Asientos contables, órdenes de compra, pedidos de venta, entregas, facturas abiertas, pagos y órdenes de fabricación.",

    "limitations": [

      "NO permite importar documentos históricos que ya hayan sido cerrados en el sistema legado.",

      "NO soporta la eliminación física ni lógica de registros en la base de datos."

    ]

  },

  "template_architecture": {

    "mandatory_headers": [

      { "row": 1, "name": "Object Properties", "reference": "DI API - Objects Reference" },

      { "row": 2, "name": "Field Names", "reference": "Database Tables Reference (REFDB)" }

    ],

    "rule": "NUNCA eliminar las dos primeras filas de encabezados. Las columnas no utilizadas deben dejarse en blanco, respetando la estructura original o generando una plantilla personalizada (*.xlt).",

    "enumerated_values": "En campos de tipo 'enum', DTW exige valores de DI API (ej. CardType: 'cCustomer', 'cSupplier', 'cLid') en lugar de los valores de base de datos ('C', 'S', 'L')."

  },

  "performance_optimization_hana": {

    "feature": "Enable Faster Import (Importación Acelerada)",

    "engine": "Ejecución paralela multihilo bajo aplicación COM+ (4 a 21 hilos de procesamiento)",

    "conditions": "Efectivo únicamente para lotes mayores a 1,000 registros; desactiva la función de simulación previa; soportado en Business Partners, Items y documentos transaccionales estándar."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Rol Fundamental de DTW en Proyectos de Migración
El Data Transfer Workbench (DTW) es la herramienta oficial de migración de datos de nivel corporativo para SAP Business One. A diferencia de la utilidad básica Importar de Excel, DTW cubre la totalidad del modelo relacional del ERP:

Permite la ingesta simultánea de tablas padre (cabecera) y tablas hijas (filas y subdetalles).
Soporta la carga inicial de saldos de apertura y documentos transaccionales abiertos (pedidos de venta y compra pendientes de entrega o facturación).
Valida todas las reglas de negocio en tiempo real a través de la capa de acceso DI API.
2.2 Estructura y Reglas de Plantillas Predefinidas
Las plantillas oficiales de DTW (ubicadas en la subcarpeta Templates de la instalación) son libros de Excel con nombres que inician con el acrónimo de 4 letras de la tabla SQL de destino (ej. OCRD - BusinessPartners.xlt, CRD1 - BPAddresses.xlt, OITM - Items.xlt):

Doble Fila de Encabezados:
Fila 1: Nombre de la propiedad del objeto en la DI API (ej. CardCode, CardName, CardType).
Fila 2: Nombre técnico de la columna en la base de datos SQL/HANA.
Ambas filas deben permanecer intactas al guardar el archivo como texto delimitado.
Columnas en Blanco y Valores por Defecto: Al igual que en la captura manual en pantalla, si una columna se deja vacía, el sistema asigna el valor predeterminado del sistema o de las parametrizaciones generales.
Manejo de Enumeraciones (Enum): Al pasar el cursor sobre los encabezados, los comentarios emergentes indican el tipo de dato. Si el campo es un enumerador, debe colocarse la cadena técnica esperada por la API (ejemplo: bo_BillTo o bo_ShipTo en tipos de dirección de CRD1).
2.3 Operaciones con Tablas Hijas Independientes
DTW permite actualizar tablas hijas sin necesidad de volver a procesar la tabla padre:

Contactos de Socios de Negocios (OCPR):
Para actualizar un contacto existente, en la Columna A se coloca el código del socio (CardCode) y en la Columna B (LineNum) se coloca el índice numérico correlativo (0 para el primer contacto, 1 para el segundo).
Para agregar un contacto nuevo a un cliente existente, se deja el campo LineNum en blanco.
En el asistente de DTW se selecciona la operación Update Existing Data y se carga únicamente la plantilla OCPR.
Direcciones de Socios de Negocios (CRD1): No utiliza LineNum; cada dirección se identifica unívocamente por su nombre de clave primaria (Address / Address ID).
2.4 Optimización de Alto Rendimiento en SAP HANA
Para migraciones masivas de cientos de miles de registros (como catálogos de retail o históricos contables), DTW ofrece el parámetro Enable Faster Import en la pantalla de inicio de sesión:

Ejecuta subprocesos paralelos (hilos) que procesan diferentes bloques de filas concurrentemente mediante COM+.
La carga se acelera exponencialmente, pero debe tenerse en cuenta que los registros pueden insertarse en un orden cronológico ligeramente desfasado respecto al archivo original.
2.5 Personalización de Plantillas y Campos de Usuario (UDF)
Plantillas Personalizadas (*.xlt): Mediante el menú Templates > Customize Template, el consultor puede eliminar columnas no utilizadas y reordenar las columnas obligatorias al inicio, simplificando la captura para el equipo del cliente.
Generación Automática de Plantillas con UDFs: La opción Generate UDF Templates examina la base de datos y agrega automáticamente al final de las plantillas estándar todas las columnas de campos de usuario definidos (U_Campo).


3. CASO DE NEGOCIO RESUELTO: MIGRACIÓN DE ARTÍCULOS Y PRECIOS EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers migra desde un sistema heredado AS/400 hacia SAP Business One 10.0 en SAP HANA. Se requiere importar 12,500 artículos con sus listas de precios, unidades de medida y proveedores predeterminados, minimizando los tiempos de inactividad durante el fin de semana de corte (Cutover).
Estrategia de Ejecución con DTW:
Preparación de Datos: El equipo técnico genera las plantillas delimitadas por tabulaciones OITM.txt (cabeceras) e ITM1.txt (precios de venta), asegurando que los códigos de proveedores preexistentes en OCRD ya estén cargados en el sistema.
Conexión Acelerada: El consultor abre DTW, ingresa las credenciales del superusuario manager y activa la casilla Enable Faster Import, configurando 8 hilos paralelos.
Simulación Previa: En un entorno de staging de pruebas, se corre una simulación de 500 registros para comprobar que no existan errores de cuentas de mayor ni grupos de artículos inexistentes.
Ejecución en Producción: En el asistente de importación, se selecciona Master Data > Item Master Data > Add New Data, se seleccionan las plantillas OITM e ITM1 y se procesa la migración.
Resultado: Los 12,500 artículos y sus listas de precios se importan íntegramente en menos de 15 minutos, con cero registros fallidos reportados en el visor de logs.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál de las siguientes categorías de información NO puede importarse en SAP Business One utilizando Data Transfer Workbench (DTW)?
A) Asientos contables y saldos de apertura de clientes.
B) Documentos transaccionales de ventas que ya se encuentran cerrados o cancelados en el sistema heredado.
C) Pedidos de compra abiertos con múltiples líneas de artículos.
D) Estructuras de subniveles y datos maestros de ubicaciones de almacén.
Respuesta Correcta: B
Justificación Técnica: Por arquitectura de integridad de SAP Business One, DTW únicamente permite migrar documentos abiertos (pendientes de entrega, facturación o cobro); no soporta la importación de documentos históricos cerrados.
Pregunta 2
Al preparar una plantilla de Excel para importar Socios de Negocios en DTW (archivo OCRD), ¿qué se debe hacer con las dos primeras filas de la plantilla?
A) Deben eliminarse para que los datos comiencen en la fila 1.
B) Deben dejarse intactas obligatoriamente, ya que la Fila 1 contiene las propiedades del objeto en la DI API y la Fila 2 contiene los nombres técnicos de los campos de la base de datos.
C) Deben fusionarse en una sola fila con formato negrita.
D) Se reemplazan por la consulta SQL de extracción.
Respuesta Correcta: B
Justificación Técnica: DTW utiliza las dos primeras filas para mapear automáticamente el archivo con los metadatos de la DI API; si se borran o modifican, el asistente fallará al reconocer la estructura del objeto.
Pregunta 3
¿Cómo se especifica en la plantilla OCPR que se desea AGREGAR una nueva persona de contacto a un cliente preexistente sin sobreescribir los contactos actuales?
A) Ingresando el código del cliente en la columna CardCode y dejando el campo LineNum en blanco.
B) Colocando el número 99 en el campo LineNum.
C) Seleccionando la opción 'Eliminar todos los registros' en el asistente.
D) Duplicando la fila del socio de negocios en la plantilla OCRD.
Respuesta Correcta: A
Justificación Técnica: En las plantillas de tablas secundarias como OCPR, ingresar un valor numérico en LineNum (0, 1, 2...) actualiza la fila correspondiente en el orden de creación original, mientras que dejar LineNum vacío instruye a la DI API a insertar un nuevo registro adicional.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
