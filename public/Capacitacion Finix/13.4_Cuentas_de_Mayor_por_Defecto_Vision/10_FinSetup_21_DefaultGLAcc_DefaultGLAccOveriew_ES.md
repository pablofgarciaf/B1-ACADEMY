DOCUMENTO TÉCNICO ATÓMICO: DOC_119_FinSetup_DefaultGLAccOverview.md
1. METADATOS TÉCNICOS
Módulo SAP: Gestión Financiera / Determinación de Cuentas de Mayor (Visión General)
Código de Unidad: UNIDAD_119_FIN_DEFAULT_GL_ACCOUNTS_OVERVIEW
Nombre del Manual Original: 10_FinSetup_21_DefaultGLAcc_DefaultGLAccOveriew_ES.pdf
Audiencia Objetivo: Consultores Funcionales SAP B1, Contadores de Costos, Diseñadores de Procesos ERP y Arquitectos de Integración


2. JSON ANTIGRAVITY MASTER SCHEMA
{

  "$schema": "https://antigravity.ai/schemas/sap-b1-v10-unit.json",

  "unit_id": "119_FIN_DEFAULT_GL_OVERVIEW",

  "title": "Configuración Financiera: Determinación de Cuentas de Mayor - Visión General y Comparativa de Soluciones",

  "sap_module": "Financials / Setup",

  "version": "10.0",

  "database_tables": {

    "header_tables": [

      {

        "table": "OACP",

        "description": "Periodos Contables y Cuentas por Defecto"

      },

      {

        "table": "CINF",

        "description": "Información de Sociedad (Bandera AdvGlAct para habilitación avanzada)"

      }

    ],

    "line_tables": [

      {

        "table": "OGDC",

        "description": "Determinación de Cuentas Avanzada - Criterios de Selección"

      },

      {

        "table": "GDR1",

        "description": "Reglas de Determinación Contable Avanzada"

      }

    ]

  },

  "menu_paths": [

    {

      "action": "Ventana Determinación de Cuentas de Mayor",

      "path": "Gestión -> Configuración -> Finanzas -> Determinación de cuentas de mayor"

    },

    {

      "action": "Activación de Determinación Avanzada",

      "path": "Gestión -> Inicialización del sistema -> Detalles de la empresa -> ficha Inicialización básica"

    },

    {

      "action": "Fijar Método de Cuentas por Defecto para Artículos",

      "path": "Gestión -> Inicialización del sistema -> Parametrizaciones generales -> ficha Inventario -> subficha Artículos"

    }

  ],

  "business_rules_and_validations": {

    "architectural_purpose": "Permite que los documentos logísticos (ventas, compras, inventario, producción) automaticen los asientos contables determinando las cuentas de mayor correctas sin intervención humana.",

    "the_two_solutions": {

      "traditional_solution": {

        "status": "Solución estándar original.",

        "determination_levels": [

          "Nivel Almacén: Cuentas asignadas en la ficha Finanzas del maestro de almacén (OWHS).",

          "Nivel Grupo de Artículos: Cuentas asignadas en la ficha Finanzas del Grupo de Artículos (OITB).",

          "Nivel Artículo: Cuentas asignadas directamente en la ficha Inventario del maestro de artículo (OITM)."

        ],

        "default_setting": "Se define en Parametrizaciones Generales -> Inventario -> 'Fijar cuentas de mayor según'."

      },

      "advanced_solution": {

        "status": "Introducida en SAP B1 9.0 para máxima flexibilidad corporativa.",

        "mechanism": "Matriz multidimensional centralizada basada en reglas de prioridad con criterios dinámicos (Grupo de artículos, Almacén, País/Estado de destino, Código de artículo, UDFs).",

        "company_level_fallback": "La ventana Determinación de Cuentas de Mayor actúa como nivel empresa por defecto si ninguna regla avanzada coincide.",

        "toggle_rule": "Se activa en Detalles de la Empresa marcando 'Habilitar determinación avanzada de cuenta de mayor'. Si existen transacciones, puede desmarcarse, pero revertirá el comportamiento a la asignación clásica."

      }

    }

  }

}


3. DESARROLLO CONCEPTUAL Y FUNCIONAL DETALLADO
3.1 El Motor de Contabilización Automática de SAP B1
En SAP Business One, los usuarios operativos (vendedores, jefes de almacén, compradores) no necesitan conocer contabilidad ni seleccionar cuentas contables manualmente. Al añadir una Entrega, una Factura de Proveedor o una Salida de Mercancías, el sistema consulta las reglas configuradas en la Determinación de Cuentas de Mayor para generar de forma inmediata el Asiento Contable (OJDT/JDT1).

Las cuentas se organizan en pestañas funcionales:

Ventas: Cuentas asociadas de clientes, ingresos nacionales/extranjeros, anticipos, devoluciones y descuentos concedidos.
Compras: Cuentas asociadas de proveedores, compras de existencias, cuenta puente de compensación de mercancías (devengo), diferencias de precio y gastos adicionales.
Inventario: Cuentas de existencias en almacén, coste de ventas (COGS), diferencias de inventario, aumentos/disminuciones en ajustes físicos y revalorización.
General: Cuentas de cierre del período, apertura y redondeo de saldos.
Recursos / WIP: Cuentas de trabajo en proceso para órdenes de producción.
3.2 Comparativa de Enfoques: Tradicional vs. Avanzado
                    ┌────────────────────────────────────────────────────────┐

                    │  VENTANA DETERMINACIÓN DE CUENTAS DE MAYOR (EMPRESA)   │

                    └───────────────────────────┬────────────────────────────┘

                                                │

                 ┌──────────────────────────────┴──────────────────────────────┐

                 ▼                                                             ▼

   ┌───────────────────────────┐                                 ┌───────────────────────────┐

   │    SOLUCIÓN TRADICIONAL   │                                 │     SOLUCIÓN AVANZADA     │

   ├───────────────────────────┤                                 ├───────────────────────────┤

   │ Cuentas por método fijo:  │                                 │ Matriz centralizada de    │

   │ • Almacén                 │                                 │ reglas dinámicas:         │

   │ • Grupo de Artículos      │                                 │ • Artículo + Almacén      │

   │ • Artículo Individual     │                                 │ • Grupo Art. + País Envío │

   │                           │                                 │ • UDFs + Grupo de Clientes│

   │ Cada nuevo artículo toma  │                                 │ Prioridad jerárquica con  │

   │ un nivel único en OITM    │                                 │ herencia hacia la empresa │

   └───────────────────────────┘                                 └───────────────────────────┘

Solución Tradicional:
Adecuada para empresas con estructuras contables lineales.
La cuenta se busca según el campo Fijar cuentas de mayor según (OITM.GLMethod):
Si es Almacén, toma las cuentas de OWHS.
Si es Grupo de Artículos, toma las cuentas de OITB.
Si es Artículo, toma las cuentas fijadas en OITM.
Solución Avanzada:
Diseñada para corporaciones que requieren contabilizaciones cruzadas (ej. imputar ingresos en cuentas contables distintas dependiendo del país destinatario de la mercancía, sin tener que duplicar los grupos de artículos ni crear almacenes virtuales).
Las reglas avanzadas tienen prioridad absoluta sobre los valores por defecto de la empresa.


4. CASO DE NEGOCIO RESUELTO: OEC COMPUTERS
Contexto
Jaime, el Director General de OEC Computers, solicita que en el informe de Pérdidas y Ganancias se muestre el beneficio neto diferenciado para la línea de Impresoras respecto a la línea de Servidores y Computadoras. Adicionalmente, para exportaciones de impresoras a Canadá, las ventas deben registrarse en una cuenta de ingresos de exportación separada.
Análisis y Decisión de Arquitectura
Si se utiliza la Solución Tradicional: Se puede configurar el nivel de determinación por Grupo de Artículos, asignando una cuenta de ingresos propia para el grupo Impresoras y otra para Servidores. Sin embargo, no permite distinguir automáticamente el país de exportación sin intervención manual.
Si se utiliza la Solución Avanzada: Se define una regla primaria por Grupo de Artículos (Impresoras $\rightarrow$ Cuenta Ingresos Locales), y una regla de mayor prioridad para Grupo de Artículos (Impresoras) + País Destino (Canadá) $\rightarrow$ Cuenta Ingresos Exportación.


5. BANCO DE EVALUACIÓN SITUACIONAL
Pregunta 1
Situación: Una empresa implementa SAP Business One y el Director Financiero desea que los ingresos por ventas de accesorios se contabilicen en cuentas contables distintas según el Almacén desde el cual se despachó el producto. Si la empresa utiliza la Solución Tradicional de determinación de cuentas, ¿qué configuración se debe realizar?

A) Configurar las reglas en Determinación Avanzada.
B) Definir el método de cuentas de mayor del artículo en "Nivel de Almacén" y configurar las cuentas en la ficha Finanzas de cada almacén.
C) Crear un plan de cuentas separado para cada almacén.
D) Crear un grupo de artículos por cada almacén.
Respuesta Correcta: B
Justificación Técnica: En la Solución Tradicional, al asignar a un artículo el método "Almacén" (GLMethod = 'W'), el motor contable deriva las cuentas de existencias, ingresos y coste de ventas directamente de la definición del almacén emisor (OWHS), permitiendo segmentar contablemente por ubicación logística.
Pregunta 2
Situación: Al activar la Determinación Avanzada de Cuentas de Mayor en Detalles de la Empresa, ¿qué ocurre con los valores configurados previamente en la ventana estándar de Determinación de Cuentas de Mayor?

A) Se borran automáticamente de la base de datos.
B) Permanecen activos y funcionan como el nivel predeterminado de empresa (fallback) si ninguna regla avanzada específica coincide con los criterios del documento.
C) El sistema bloquea el registro de nuevos documentos hasta que se recreen todas las cuentas.
D) Se trasladan automáticamente como reglas al nivel de artículo.
Respuesta Correcta: B
Justificación Técnica: En la arquitectura avanzada de SAP B1, la ventana tradicional de Determinación de Cuentas de Mayor pasa a representar el nivel corporativo base. Si una transacción no cumple ninguna de las reglas avanzadas definidas en la matriz, el sistema hereda las cuentas del nivel empresa.