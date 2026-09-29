UNIDAD 016: CAMPOS DEFINIDOS POR EL USUARIO (UDF) EN SAP BUSINESS ONE 10.0
Código de Manual: 10_Impl_14_CustomTools_UserDefinedFields_ES
Módulo Oficial: Herramientas de Customizing e Implementación (Customization Tools)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Desarrolladores SDK/Service Layer, Administradores de Sistemas y Arquitectos de IA (Antigravity)
Carpeta Asociada: 016_10_Impl_14_CustomTools_UserDefinedFields_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "016",

  "topic": "User-Defined Fields (UDF) & Database Schema Extensibility",

  "sap_module": "Customization_Tools",

  "metadata_tables": {

    "udf_definitions": "CUFD",

    "valid_values": "UFD1",

    "naming_convention": "Prefijo obligatorio 'U_' añadido por el motor de base de datos a nivel físico (ej. U_EstadoCliente)"

  },

  "menu_paths": [

    "Herramientas > Herramientas de customizing > Campos definidos por el usuario - Gestión",

    "Herramientas > Editar IU de formulario (para arrastrar UDF al formulario principal)",

    "Ver > Campos definidos por el usuario (Ctrl + Mayús + U para abrir panel lateral)",

    "Herramientas > Herramientas de customizing > Parametrizaciones (Ctrl + Mayús + B)"

  ],

  "supported_data_types": {

    "Alfanumérico": {

      "structures": ["Normal (hasta 254 caracteres)", "Dirección", "Nº de teléfono", "Texto (hasta 2 GB en cabecera / 255 KB en líneas)"]

    },

    "Numérico": {

      "structures": ["Solo números enteros (sin estructura adicional)"]

    },

    "Fecha_Hora": {

      "structures": ["Fecha (con selector de calendario)", "Hora"]

    },

    "Unidades_y_Totales": {

      "structures": ["Tipo impositivo", "Importe", "Precio", "Cantidad", "% / Porcentaje", "Medida"],

      "precision": "Regida por la parametrización decimal en Parametrizaciones generales > Visualización"

    },

    "General": {

      "structures": ["Vínculo (fichero o URL web; requiere vía en Parametrizaciones generales > Vía de acceso > Anexos)", "Imagen (fichero gráfico; requiere vía de acceso en Carpeta Imágenes)"]

    }

  },

  "business_and_validation_rules": {

    "immutability": "No se puede alterar el Tipo ni la Estructura de un UDF una vez confirmado en la base de datos; requiere eliminación y recreación.",

    "mandatory_fields": "Para marcar un UDF como obligatorio, es requisito indispensable definir un valor por defecto al momento de crearlo a fin de no violar la integridad referencial de los registros históricos.",

    "concurrency_lock": "La creación de UDF ejecuta sentencias DDL (ALTER TABLE) en el motor de base de datos; exige desconexión de usuarios concurrentes o forzado de cierre de documentos abiertos.",

    "document_flow_inheritance": "Los valores de UDF se traspasan automáticamente de documento base a destino mediante 'Copiar de' / 'Copiar a' y el Asistente de Creación de Documentos (si se agrupan múltiples documentos base con valores UDF discrepantes, el valor no se propaga).",

    "line_level_behavior": "Los UDF de línea se agregan como columnas estándar en las matrices (`RDR1`, `INV1`, etc.); pueden editarse tras el cierre del documento únicamente si se habilita la casilla 'Permitir edición de UDF en líneas' en Parametrizaciones de documento."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Naturaleza y Propósito de los UDF en SAP Business One
Los Campos Definidos por el Usuario (User-Defined Fields - UDF) constituyen la herramienta primaria de extensibilidad de datos nativa en SAP Business One. Permiten adaptar el modelo de datos relacional estándar a las necesidades específicas de la industria o del flujo operativo del cliente sin requerir código de desarrollo externo ni comprometer la integridad estructural ante futuras actualizaciones de versión (Upgrades).

Los UDF pueden implementarse en:

Datos Maestros: Interlocutores comerciales (OCRD), Artículos de inventario (OITM), Activos fijos, Cuentas contables (OACT).
Documentos de Marketing: Tanto en el área de Cabecera (ORDR, ODLN, OINV, OPOR, etc.) como en el área de Líneas (RDR1, DLN1, INV1, POR1, etc.).
Tablas Definidas por el Usuario (UDT) y Objetos de Usuario (UDO).
2.2 Ciclo de Vida, Interfaz de Usuario y Modelos de IU
Panel Lateral vs Integración en Formulario:
Por defecto, los UDF de cabecera no se incrustan en el formulario estándar, sino que se alojan en un panel lateral independiente accesible mediante Ver > Campos definidos por el usuario o el atajo de teclado Ctrl + Shift + U.
Editar IU de Formulario: Los usuarios con la autorización adecuada pueden activar Herramientas > Editar IU de formulario, arrastrar el UDF directamente desde el panel lateral hacia cualquier pestaña del formulario principal (ej. Pestaña Logística o Finanzas) y guardar la disposición en un Modelo de Configuración de la IU, el cual se asigna masivamente a grupos de usuarios o roles.
Comportamiento en Líneas: Los UDF creados a nivel de línea se incorporan automáticamente como nuevas columnas de la matriz transaccional. Su visibilidad, orden y ancho se controlan desde las Parametrizaciones de Formulario estándar.
2.3 Tipos de Validación y Enlace a Entidades
SAP Business One ofrece tres mecanismos de control de entrada de datos en los UDF:

Valores Válidos (Valid Values - UFD1): Define una lista cerrada de opciones visualizadas como menú desplegable (ComboBox). El usuario final solo puede seleccionar opciones preaprobadas (ej. "Oro", "Plata", "Bronce").
Vinculado a Entidades (Linked to System Entities): Establece una clave foránea lógica directa entre el UDF y un objeto del sistema (como Factura de Clientes, Contratos de Servicio o Pedidos de Compra) o una UDT, permitiendo navegación interactiva mediante la flecha amarilla de enlace.
Validación Avanzada: Reglas matemáticas o de formato para validar rangos numéricos, operadores de comparación ($>, <, =$ o patrones alfanuméricos específicos.
Valores Definidos por el Usuario (FMS): Asocia una consulta SQL al campo para autocompletar valores en función de disparadores operativos (tratado a fondo en la Unidad 017).


3. ATLAS TÉCNICO: REGLAS DE ARQUITECTURA DE DATOS
┌─────────────────────────────────────────────────────────────────────────┐

│                    GESTIÓN DE CAMPOS DE USUARIO (CUFD)                  │

├─────────────────────────────────────────────────────────────────────────┤

│ Objeto Destino (ej. Interlocutores comerciales - OCRD)                  │

│  ├─ Nombre: EstadoCliente  ──> Nombre en BD física: U_EstadoCliente     │

│  ├─ Tipo: Alfanumérico                                                  │

│  ├─ Estructura: Normal (Longitud: 15)                                    │

│  ├─ Validación: Valores Válidos (UFD1)                                  │

│  │   ├── Código: ORO   | Descripción: Cliente Categoría Oro             │

│  │   ├── Código: PLA   | Descripción: Cliente Categoría Plata           │

│  │   └── Código: BRO   | Descripción: Cliente Categoría Bronce          │

│  ├─ Valor por Defecto: BRO                                              │

│  └─ Obligatorio: SÍ                                                     │

└─────────────────────────────────────────────────────────────────────────┘


4. CASO DE NEGOCIO RESUELTO: DESPLIEGUE EN OEC COMPUTERS
Escenario de Consultoría:
George y María, directores de logística y finanzas de OEC Computers, solicitan dos adaptaciones críticas:

Segmentación de Clientes: En el maestro de clientes se debe clasificar el nivel comercial en tres categorías: Oro, Plata y Bronce, siendo obligatorio para todo nuevo registro.
Instrucciones Especiales de Reparto: En los pedidos de venta, el vendedor debe indicar instrucciones de entrega (ej. "Entregar por rampa trasera antes de las 10 AM"). Este dato debe fluir automáticamente desde el Pedido hacia la Entrega y la Factura.
Procedimiento de Implementación:
Creación del UDF de Cliente:
Ruta: Herramientas > Herramientas de customizing > Campos definidos por el usuario - Gestión.
Selección de tabla: Datos maestros de interlocutores comerciales (OCRD).
Nombre: NivelCliente (BD: U_NivelCliente), Título: Nivel de Cliente.
Tipo: Alfanumérico, Estructura: Normal, Longitud: 10.
Validación: Valores válidos (ORO, PLATA, BRONCE). Valor por defecto: BRONCE. Casilla Obligatorio marcada.
Creación del UDF de Pedido (Cabecera):
Selección de tabla: Documentos de marketing > Título (aplica a ORDR, ODLN, OINV).
Nombre: InstEntrega (BD: U_InstEntrega), Título: Instrucciones de Entrega.
Tipo: Alfanumérico, Estructura: Texto (permite descripciones largas).
Integración en la Interfaz de Ventas:
En el formulario de Pedido de cliente, se activa Herramientas > Editar IU de formulario.
Se arrastra U_InstEntrega desde el panel lateral hacia la pestaña Logística, colocándolo debajo de la dirección de entrega.
Se guarda la disposición en el modelo de IU corporativo.
Verificación de Flujo:
El vendedor emite un pedido con la instrucción de entrega. Al presionar Copiar a > Entrega, el valor de U_InstEntrega se traslada intacto al documento de almacén para que el transportista visualice la indicación.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Qué prefijo añade automáticamente SAP Business One en la base de datos a cualquier campo definido por el usuario (UDF)?
A) SAP_
B) USR_
C) U_
D) CUST_
Respuesta Correcta: C
Justificación Técnica: Todo UDF creado en SAP Business One se almacena físicamente en la base de datos (tanto en SAP HANA como en SQL Server) precedido obligatoriamente por el prefijo U_ (por ejemplo, si el nombre ingresado es MiCampo, la columna en la tabla será U_MiCampo).
Pregunta 2
Si un consultor necesita crear un campo definido por el usuario de tipo obligatorio en una tabla que ya contiene miles de registros históricos, ¿cuál es el requisito técnico indispensable que exige el sistema?
A) Desfragmentar la base de datos previamente.
B) Proporcionar un valor por defecto al momento de crear el UDF para que se asigne a los registros existentes y se mantenga la integridad de la base de datos.
C) Eliminar temporalmente los registros históricos.
D) Asignar permisos de superusuario a todos los operadores.
Respuesta Correcta: B
Justificación Técnica: Al definir un campo como obligatorio (NOT NULL en SQL), SAP Business One exige definir un valor predeterminado para poblar los registros ya guardados en la tabla y evitar inconsistencias a nivel de base de datos.
Pregunta 3
¿Cómo se comportan los valores de los UDF al utilizar la funcionalidad "Copiar a" / "Copiar de" para trasladar un Pedido de Cliente hacia una Entrega?
A) Los valores de los UDF se pierden siempre y deben reescribirse manualmente.
B) El valor del UDF del documento base se transfiere automáticamente al UDF idéntico del documento destino, salvo que se consoliden varios documentos base con valores divergentes en dicho UDF.
C) Solo se transfieren si el documento está en moneda extranjera.
D) Únicamente se transfieren los UDF de tipo numérico.
Respuesta Correcta: B
Justificación Técnica: El mecanismo de copia entre documentos de marketing preserva y traslada automáticamente los valores de UDF coincidentes en cabecera y líneas, omitiendo la copia únicamente en escenarios de agrupación múltiple donde los valores de origen sean dispares.