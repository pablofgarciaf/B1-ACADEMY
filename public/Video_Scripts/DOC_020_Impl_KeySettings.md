# Guion de Video: DOC 020 Impl KeySettings

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 020 Impl KeySettings.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 020: PARAMETRIZACIONES CLAVE E IRREVERSIBLES DEL SISTEMA EN SAP BUSINESS ONE 10.0
Código de Manual: 10_Impl_23_ImplTools_Key_Settings_ES
Módulo Oficial: Inicialización del Sistema y Configuración Global (System Initialization - Key & Irreversible Settings)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Líderes de Implementación, Directores Financieros, Administradores de Base de Datos y Agentes IA (Antigravity)
Carpeta Asociada: 020_10_Impl_23_ImplTools_Key_Settings_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "020",

  "topic": "System Initialization, Key Settings & Irreversible Parameters",

  "sap_module": "System_Initialization",

  "configuration_consoles": {

    "company_details": {

      "table": "OADM / CINF",

      "menu_path": "Gestión > Inicialización del sistema > Detalles de la empresa",

      "scope": "Datos fiscales, moneda base, modelo de plan de cuentas y parámetros fundacionales de la sociedad"

    },

    "general_settings": {

      "table": "OADM",

      "menu_path": "Gestión > Inicialización del sistema > Parametrizaciones generales",

      "tabs": ["IC", "Presupuesto", "Flujo de caja", "Contabilidad de costes", "Servicios", "Visualización", "Fuente y fondo", "Vía de acceso", "Ocultar funciones", "Inventario"]

    },

    "document_settings": {

      "menu_path": "Gestión > Inicialización del sistema > Parametrizaciones de documento",

      "tabs": ["General", "Por documento"]

    }

  },

  "irreversible_settings_matrix": {

    "strictly_irreversible_on_check": [

      {

        "parameter": "Habilitar activos fijos",

        "condition": "Irreversible INMEDIATAMENTE al marcar la casilla y actualizar, incluso antes de contabilizar transacciones"

      },

      {

        "parameter": "Habilitar Intrastat",

        "condition": "Irreversible tras su activación"

      },

      {

        "parameter": "Ocultar número de tarjeta de crédito",

        "condition": "Solo expone los últimos 4 dígitos; no se puede desmarcar"

      }

    ],

    "irreversible_after_first_transaction": [

      { "parameter": "Modelo del plan de cuentas", "impact": "No se puede cambiar el modelo base una vez existan asientos en OJDT" },

      { "parameter": "Moneda local", "impact": "Moneda oficial de reporte fiscal ante la autoridad tributaria" },

      { "parameter": "Moneda del sistema", "impact": "Moneda de consolidación de balance para asientos automáticos" },

      { "parameter": "Visualizar saldo Haber con signo negativo", "impact": "Determina el signo contable y la captura de saldos iniciales" },

      { "parameter": "Utilizar cuentas de segmentación", "impact": "Estructura contable dimensional por departamentos/regiones" },

      { "parameter": "Utilizar inventario permanente", "impact": "Vincula movimientos de almacén con asientos automáticos de mayor" },

      { "parameter": "Gestionar costes de artículos por almacén", "impact": "Calcula costos unitarios independientes por bodega física" },

      { "parameter": "Utilizar sistema de contabilización de compras", "impact": "Activa contabilidad de compras exigida por legislaciones locales" },

      { "parameter": "Modo precio bruto y neto individual", "impact": "Control de precios con/sin impuestos en localizaciones admitidas" },

      { "parameter": "Instalar procesamiento de extracto bancario (TEB)", "impact": "Irreversible tras procesar transacciones bancarias" },

      { "parameter": "Habilitar gestión de proyectos", "impact": "Irreversible una vez definidos códigos de proyectos" },

      { "parameter": "Gestionar portes en documentos", "impact": "Irreversible tras la primera contabilización comercial" },

      { "parameter": "Posiciones decimales", "impact": "Solo se pueden incrementar hasta 6 decimales; NUNCA reducir" }

    ]

  },

  "reversible_key_settings": [

    { "parameter": "Habilitar determinación avanzada de cuentas de mayor", "status": "Totalmente Reversible" },

    { "parameter": "Permitir liberación de stock sin coste de artículo", "status": "Totalmente Reversible" },

    { "parameter": "Ocultar funciones (Presupuesto, Asistente de pagos, MRP, Producción, Series/Lotes)", "status": "Reversible (salvo si existen artículos con serie/lote activos)" }

  ],

  "shared_network_paths_required": [

    "Carpeta Anexos (Archivos adjuntos, exportación PDF, envíos por correo)",

    "Carpeta Imágenes (Logotipos de empresa, fotos de artículos)",

    "Modelos WordDocs y ExcelDocs (Plantillas de exportación)",

    "Carpeta Extensiones y XML"

  ]

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El "Punto de No Retorno" en la Inicialización del Sistema
La configuración inicial de una nueva base de datos en SAP Business One representa la decisión de diseño de mayor trascendencia en el ciclo de vida del software. A diferencia de las parametrizaciones operativas que pueden modificarse libremente, ciertas banderas de configuración a nivel de base de datos (OADM/CINF) alteran estructuralmente el motor transaccional y pasan a ser estrictamente irreversibles.

Un error en la definición de estas banderas obliga frecuentemente a descartar la base de datos completa y reiniciar el proyecto desde cero si ya se han registrado asientos contables.
2.2 Análisis Detallado de Parametrizaciones Irreversibles
A. Moneda Local y Moneda del Sistema
Moneda Local: Es la divisa de curso legal del país donde opera la sociedad mercantil (ej. USD en Ecuador/EE. UU., EUR en España, COP en Colombia). Todos los balances oficiales tributarios se calculan en esta moneda.
Moneda del Sistema: Divisa corporativa secundaria utilizada para reportar a casas matrices extranjeras. Cada asiento contable en SAP B1 se convierte automáticamente a la moneda del sistema según el tipo de cambio oficial de la fecha de contabilización.
Regla de Oro: Si la empresa no requiere reportes en divisa extranjera para consolidación internacional, la Moneda del Sistema debe definirse idéntica a la Moneda Local. No se pueden alterar tras el primer asiento.
B. Modelo de Plan de Cuentas y Segmentación
El modelo predefinido según la localización define los cajones contables. Una vez registrado el asiento de apertura, el modelo no puede conmutarse.
Las Cuentas de Segmentación dividen el código contable en segmentos fijos (ej. 1100-01-002 para Cuenta-Departamento-Sucursal); activarlo condiciona la captura contable para siempre.
C. Inventario Permanente y Gestión de Costos por Almacén
Inventario Permanente (Perpetual Inventory): Al activarse, cada movimiento físico de entrada, salida o transferencia de mercancías dispara un asiento contable automático en el Libro Mayor (Costo de Ventas, Variación de Existencias, Cuenta de Compensación). Si no se activa, el sistema opera por inventario periódico (solo ajustes manuales por recuento).
Gestionar Costes por Almacén: Permite que un mismo artículo tenga costos promedio ponderado o FIFO distintos en el Almacén 01 y en el Almacén 02. Si se desmarca, el costo es único a nivel corporativo. Es irreversible tras la primera transacción de inventario.
D. Activos Fijos (Fixed Assets)
Es la excepción más crítica: marcar la casilla Habilitar activos fijos en la ficha Inicialización básica se vuelve inmediatamente irreversible, ¡incluso antes de registrar cualquier transacción o documento! Activa de forma permanente tablas y menús de amortización fiscal y contable.
2.3 Parametrizaciones Generales: Control Operativo y Vías de Acceso
Ficha IC (Interlocutores Comerciales):
Verificación de Límite de Crédito: Activa alertas o bloqueos duros cuando los pedidos o entregas superan el límite de crédito o comprometido del cliente.
Habilitar Procesos de Autorización: Activa el motor de flujos de aprobación para documentos que violen presupuestos, descuentos o márgenes.
Ficha Vía de Acceso (Shared Paths):
La Carpeta de Anexos es la más crítica: almacena los PDFs generados, adjuntos de correos electrónicos y ficheros vinculados a UDF. Todos los usuarios de la red deben contar con permisos de lectura/escritura en esta carpeta compartida.
Ficha Ocultar Funciones: Permite simplificar la interfaz retirando menús enteros (ej. Producción, MRP, Asistente de Pagos) si la empresa no los utiliza, reduciendo la curva de aprendizaje de los usuarios.


3. ATLAS DE GOBERNANZA: MATRIZ DE RIESGO DE PARAMETRIZACIÓN


4. CASO DE NEGOCIO RESUELTO: INICIALIZACIÓN EN OEC COMPUTERS
Escenario de Consultoría:
Sam, consultor líder de SAP, debe inicializar la base de datos de producción para OEC Computers:

País: Ecuador (Moneda de curso legal: Dólar estadounidense - USD).
La empresa no reporta a ninguna casa matriz en el extranjero.
Comercializan equipos de computación con números de serie y administran dos almacenes (Central y Garantías), requiriendo costeo independiente por bodega.
Necesitan gestionar amortización de vehículos y servidores propios.
Los vendedores no pueden facturar si el cliente excede su límite de crédito.
Decisiones de Configuración Aplicadas:
Monedas: En Detalles de la empresa, Sam define Moneda local = USD y Moneda del sistema = USD.
Activos Fijos: Se marca la casilla Habilitar activos fijos. Sam valida previamente con María (Contadora) que efectivamente se amortizarán los vehículos de la empresa, consciente de la irreversibilidad de la casilla.
Inventario: Se activa Utilizar inventario permanente y se marca Gestionar costes de artículos por almacén para reflejar diferencias de costo entre el almacén nuevo y el de garantías.
Vías de Acceso: Se configura la ruta compartida de red \\SERVIDOR_SAP\B1_SHR\Anexos con permisos totales para el dominio corporativo.
Control de Clientes: En Parametrizaciones generales > Ficha IC, se activa Verificación de límite de crédito sobre Pedidos, Entregas y Facturas, y se habilitan los Procesos de autorización.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál de las siguientes parametrizaciones en la ventana "Detalles de la empresa" se convierte en IRREVERSIBLE de forma INMEDIATA al marcar la casilla y actualizar, incluso antes de que se haya contabilizado ninguna transacción en el sistema?
A) Permitir la liberación de stock sin coste de artículo.
B) Habilitar activos fijos.
C) Habilitar la determinación avanzada de cuentas de mayor.
D) Utilizar inventario permanente.
Respuesta Correcta: B
Justificación Técnica: La activación de Activos Fijos es la única bandera de inicialización básica que queda permanentemente bloqueada e irreversible en el mismo instante en que se confirma la casilla, independientemente de que existan o no transacciones en el libro mayor.
Pregunta 2
Si una empresa define en la ficha Visualización de Parametrizaciones Generales que los importes se visualicen con 4 decimales y posteriormente contabiliza su primer asiento, ¿qué modificación de decimales permite realizar el sistema a futuro?
A) Puede reducir libremente los decimales a 2 en cualquier momento.
B) Únicamente puede incrementar la cantidad de decimales hasta un máximo de 6 dígitos; la reducción a un número inferior queda estrictamente prohibida.
C) La cantidad de decimales queda congelada en 4 para siempre.
D) Debe reinstalar el cliente de SAP Business One para modificar decimales.
Respuesta Correcta: B
Justificación Técnica: Tras registrarse el primer asiento contable, el motor de base de datos de SAP B1 solo admite ampliar la precisión decimal (hasta 6 posiciones) para preservar la exactitud de redondeos contables previos, impidiendo cualquier truncamiento o reducción.
Pregunta 3
¿Qué ocurre si una empresa nacional sin operaciones en el extranjero define por error una divisa distinta para la "Moneda del sistema" (ej. EUR) respecto a su "Moneda local" (ej. USD) y realiza contabilizaciones?
A) El sistema borra automáticamente los asientos en euros a fin de año.
B) Todos los asientos del Libro Mayor quedarán valuados forzosamente en ambas monedas, obligando a mantener tipos de cambio diarios actualizados de por vida y generando diferencias de conversión automáticas, sin posibilidad de revertir la moneda del sistema.
C) La moneda del sistema se puede cambiar simplemente editando el campo en Detalles de la empresa.
D) El balance tributario local se emitirá en euros de forma obligatoria.
Respuesta Correcta: B
Justificación Técnica: La moneda del sistema es irreversible tras la primera transacción y genera una doble contabilización paralela permanente para cada renglón del mayor, exigiendo el mantenimiento perpetuo de tablas de tipos de cambio.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
