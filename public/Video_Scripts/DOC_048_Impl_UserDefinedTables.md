# Guion de Video: DOC 048 Impl UserDefinedTables

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 048 Impl UserDefinedTables.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 048: HERRAMIENTAS DE PERSONALIZACIÓN - TABLAS (UDT) Y OBJETOS DEFINIDOS POR EL USUARIO (UDO) (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Impl_16_CustomTools_UserDefinedTables_ES
Módulo Oficial: Herramientas de Personalización / Arquitectura de Datos
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Técnicos y Funcionales, Desarrolladores SDK/DI-API, Arquitectos de Datos y Agentes IA (Antigravity)
Carpeta Asociada: 048_10_Impl_16_CustomTools_UserDefinedTables_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "048",

  "topic": "User-Defined Tables (UDT) & User-Defined Objects (UDO)",

  "sap_module": "Customization_DataModel_UDT_UDO",

  "database_tables": {

    "udt_system_catalog": "OUTB",

    "udf_metadata_catalog": "CUFD",

    "udf_valid_values": "UFD1",

    "udo_master_catalog": "OUDO",

    "udo_tables_link": "UDO1",

    "udt_physical_prefix": "@ (Ejemplo: @CONDUCTORES, @FLOTA)",

    "udf_column_prefix": "U_ (Ejemplo: U_Turno, U_Placa, U_Licencia)"

  },

  "menu_paths": [

    "Herramientas > Herramientas de customizing > Tablas definidas por el usuario - Configuración",

    "Herramientas > Herramientas de customizing > Campos definidos por el usuario - Gestión",

    "Herramientas > Herramientas de customizing > Asistente de registro de objetos",

    "Herramientas > Ventanas definidas por el usuario"

  ],

  "udt_object_types": {

    "For_UDF_Linking": {

      "No_Object": "Tipo 'Sin objeto': La columna Code es la clave primaria y es editable por el usuario. La columna Name debe ser única.",

      "No_Object_Auto_Increment": "Tipo 'Sin objeto con incremento automático': La columna Code se genera como un correlativo automático del sistema (no editable). Ideal para catálogos continuos."

    },

    "For_UDO_Creation": {

      "Master_Data": "Cabecera de datos maestros independientes con soporte de navegación",

      "Master_Data_Lines": "Tabla secundaria de detalle vinculada a los datos maestros (relación 1 a N)",

      "Document": "Cabecera transaccional con fechas de contabilización y estados operativos",

      "Document_Lines": "Tabla de líneas para transacciones comerciales o logísticas"

    },

    "immutability_rule": "El 'Tipo de objeto' de una UDT NO se puede modificar después de haber sido creada en la base de datos."

  },

  "udt_default_columns": {

    "Code": "Alfanumérico (Hasta 50 caracteres) - Clave Primaria (PK)",

    "Name": "Alfanumérico (Hasta 100 caracteres) - Campo único obligatorio",

    "Additional_Columns": "Se añaden como Campos Definidos por el Usuario (UDF) bajo la categoría de la tabla en CUFD"

  },

  "udo_capabilities": {

    "services": ["Crear (Add - Obligatorio)", "Actualizar (Update - Obligatorio)", "Buscar (Find)", "Borrar (Delete)", "Cancelar (Cancel)", "Cerrar (Close)"],

    "ui_types": ["Tipo línea de cabecera (Header-Line estilo Factura/Maestro)", "Tipo matriz (Matrix estilo Grilla/Tabla)"],

    "menu_integration": "Permite incrustar la ventana nativa dentro de cualquier submódulo del Menú Principal de SAP Business One"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Tablas Definidas por el Usuario (UDT): Extensión del Modelo Relacional
Cuando una empresa requiere almacenar entidades o catálogos que no existen en el estándar de SAP Business One (por ejemplo, gestión de conductores, rutas de transporte, maquinaria pesada o contratos de arrendamiento), se implementan Tablas Definidas por el Usuario (UDT).

Las UDTs se integran de forma nativa en el motor de base de datos relacional (SQL Server o SAP HANA).
El sistema las distingue automáticamente de las tablas estándar aplicando el prefijo físico @ (ej. @OEC_VEHICULOS).
Cuando se clona una sociedad para crear una nueva empresa, SAP Business One permite copiar la totalidad de UDTs y sus metadatos (OUTB).
2.2 Elección del Tipo de Objeto en la Creación de la Tabla
La decisión más crítica al crear una UDT es la selección del Tipo de Objeto, ya que es una parametrización irreversible:

Para vincular a un campo (UDF) en documentos del sistema:
Se debe seleccionar Sin objeto o Sin objeto con incremento automático.
Si se elige Sin objeto, el usuario debe ingresar manualmente un código alfanumérico único para cada registro.
Si se elige Sin objeto con incremento automático, el sistema autogenera la numeración secuencial de la clave primaria Code, minimizando errores de digitación.
Para construir un Objeto de Negocio Completo (UDO):
Se debe elegir Datos maestros, Líneas de datos maestros, Documento o Líneas de documento. Estas tablas contienen campos de auditoría del sistema (como DocEntry, LineId, CreateDate, UserSign).
2.3 Estructura de Columnas y Adición de Campos (UDF)
Toda tabla de usuario nace exclusivamente con dos columnas: Code y Name. Para convertirla en una estructura empresarial útil:

Se accede a Herramientas > Herramientas de customizing > Campos definidos por el usuario - Gestión.
Se localiza la categoría correspondiente a la UDT y se pulsa Añadir.
Cada campo añadido se crea físicamente con el prefijo U_ (ej. @CONDUCTORES.U_Licencia, @CONDUCTORES.U_Telefono, @CONDUCTORES.U_Turno).
La tabla puede ser alimentada manualmente desde Herramientas > Ventanas definidas por el usuario, o de forma masiva mediante Data Transfer Workbench (DTW).
2.4 Vinculación de una UDT a Formularios Estándar (Vía UDF)
Para que los operarios puedan seleccionar datos de la UDT dentro de un documento comercial estándar (como una Entrega o Pedido de Ventas):

Se crea un UDF en el documento estándar (ej. en la cabecera de la Entrega ODLN).
El tipo de datos del UDF debe ser obligatoriamente Alfanumérico con estructura Regular.
En la sección de validación se selecciona Fijar tabla vinculada y se elige la UDT @CONDUCTORES.
En el documento de entrega, el campo muestra un menú desplegable con el código y nombre del conductor, e incluye la opción Definir nuevo para abrir la tabla en caliente.
2.5 Objetos Definidos por el Usuario (UDO): Creación de Ventanas Nativas
Un UDO es la culminación de la personalización avanzada: permite transformar una UDT (o un conjunto cabecera-detalle) en una pantalla completa de SAP Business One:

Se utiliza el Asistente de Registro de Objetos.
Asigna servicios estándar del ERP: búsqueda por comodín (*), botones de navegación de registros (primero, anterior, siguiente, último), borrado lógico y duplicación.
Incorpora el objeto como una opción directa del Menú Principal de SAP Business One, otorgándole permisos de acceso por usuario mediante la matriz de autorizaciones generales.


3. ATLAS DIDÁCTICO: ARQUITECTURA DE INTEGRACIÓN UDT -> UDF -> UDO
             ┌────────────────────────────────────────────────────────┐

             │            TABLA DEFINIDA POR USUARIO (UDT)            │

             │           Nombre físico: @CONDUCTORES (OUTB)           │

             │        Columnas base: Code (PK) | Name (Único)         │

             │        Columnas UDF: U_Licencia, U_Turno, U_Zona       │

             └───────────────────────────┬────────────────────────────┘

                                         │

                 ┌───────────────────────┴───────────────────────┐

                 ▼                                               ▼

      [ CASO 1: VINCULAR A UDF ]                     [ CASO 2: CREAR UDO NATIVO ]

      • Tipo: Sin objeto auto-inc.                   • Tipo: Datos Maestros / Doc.

      • Documento estándar: Entrega (ODLN)           • Asistente de Registro (OUDO)

      • UDF: U_Conductor (Alfanumérico)              • Interfaz: Cabecera-Líneas / Matriz

      • Validación: Fijar tabla vinculada            • Menú: Ventas - Clientes > Conductores

      • Resultado: Desplegable con F5                • Resultado: Formulario propio de SAP


4. CASO DE NEGOCIO RESUELTO: GESTIÓN DE FLOTA DE ENTREGAS EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers gestiona sus propios repartos y requiere asignar un Conductor de Entrega y su Turno de Trabajo en cada documento de Entrega de Ventas (ODLN). Se desea que los usuarios puedan dar de alta nuevos choferes sin salir del formulario de despacho.
Implementación Técnica Paso a Paso:
Creación de la UDT:
Ruta: Herramientas > Herramientas de customizing > Tablas definidas por el usuario - Configuración.
Nombre: CONDUCTORES. Descripción: Conductores de Entrega.
Tipo de objeto: Sin objeto con incremento automático.
Tabla física resultante: @CONDUCTORES.
Creación de Columnas Adicionales:
En Campos definidos por el usuario - Gestión, se selecciona la tabla @CONDUCTORES y se crean:
U_Licencia: Alfanumérico (Longitud 20).
U_Turno: Alfanumérico con lista de valores válidos (M=Mañana, T=Tarde, N=Noche).
U_Telefono: Alfanumérico (Longitud 15).
Vinculación con el Documento de Entrega:
Se crea un UDF en el título de Documentos de marketing:
Nombre: Conductor. Descripción: Conductor Asignado.
Tipo: Alfanumérico (Regular).
Validación: Fijar tabla vinculada -> Selecciona CONDUCTORES.
Validación Operativa:
El despachador abre una Entrega de ventas, visualiza el campo Conductor Asignado, despliega la lista y selecciona Juan Pérez. Si se incorpora un nuevo chofer, presiona Definir nuevo, ingresa su nombre, licencia y turno, y el registro queda disponible al instante.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Al configurar una nueva Tabla Definida por el Usuario (UDT) para vincularla a un campo de usuario (UDF) en una Factura de Ventas, ¿cuál de los siguientes "Tipos de objeto" debe seleccionarse obligatoriamente?
A) Documento o Líneas de documento.
B) Datos maestros o Líneas de datos maestros.
C) Sin objeto (No Object) o Sin objeto con incremento automático (No Object with Auto-Increment).
D) Tabla temporal de sistema.
Respuesta Correcta: C
Justificación Técnica: Solo las tablas creadas con los tipos Sin objeto o Sin objeto con incremento automático pueden ser vinculadas directamente como tablas maestras de consulta para un campo de usuario (UDF) en formularios estándar.
Pregunta 2
¿Qué prefijo físico asigna automáticamente SAP Business One en el motor de base de datos a todas las Tablas Definidas por el Usuario (UDT) para distinguirlas de las tablas estándar del sistema?
A) USR_
B) @
C) U_
D) TBL_
Respuesta Correcta: B
Justificación Técnica: Las tablas de usuario se identifican siempre con el prefijo @ (ej. @CONDUCTORES), mientras que el prefijo U_ se reserva para las columnas/campos definidos por el usuario (CUFD).
Pregunta 3
¿Qué herramienta estándar de SAP Business One permite transformar una Tabla Definida por el Usuario (UDT) en un formulario interactivo completo con servicios de búsqueda, navegación y acceso directo desde el Menú Principal?
A) El Administrador de Informes Crystal Reports.
B) El Asistente de Registro de Objetos (Object Registration Wizard) para crear un UDO.
C) El Generador de Consultas SQL.
D) El Asistente de Conversión de Monedas.
Respuesta Correcta: B
Justificación Técnica: El Asistente de Registro de Objetos convierte una o más UDTs en un Objeto Definido por el Usuario (UDO), dotándolo de servicios nativos de base de datos e incrustándolo en el menú del sistema.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
