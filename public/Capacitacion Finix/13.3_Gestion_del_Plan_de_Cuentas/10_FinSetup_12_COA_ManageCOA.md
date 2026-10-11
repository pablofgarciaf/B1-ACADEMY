DOCUMENTO TÉCNICO ATÓMICO: DOC_118_FinSetup_EditCOA.md
1. METADATOS TÉCNICOS
Módulo SAP: Gestión Financiera / Estructuración y Mantenimiento del Plan de Cuentas
Código de Unidad: UNIDAD_118_FIN_MANAGE_CHART_OF_ACCOUNTS
Nombre del Manual Original: 10_FinSetup_12_COA_ManageCOA.pdf
Audiencia Objetivo: Consultores Financieros, Administradores del Sistema SAP, Contadores Generales y Auditores de Datos Maestros


2. JSON ANTIGRAVITY MASTER SCHEMA
{

  "$schema": "https://antigravity.ai/schemas/sap-b1-v10-unit.json",

  "unit_id": "118_FIN_MANAGE_COA",

  "title": "Configuración Financiera: Gestión y Modificación del Plan de Cuentas",

  "sap_module": "Financials / Setup",

  "version": "10.0",

  "database_tables": {

    "header_tables": [

      {

        "table": "OACT",

        "description": "Maestro del Plan de Cuentas (Chart of Accounts)",

        "key_fields": ["AcctCode", "AcctName", "CurrTotal", "Levels", "Postable", "LocManTran", "GroupMask"]

      }

    ],

    "line_tables": [

      {

        "table": "OACP",

        "description": "Periodos Contables y Cierres de Cuentas"

      }

    ]

  },

  "menu_paths": [

    {

      "action": "Ventana Plan de Cuentas (Consulta y Alta Regular)",

      "path": "Finanzas -> Plan de cuentas"

    },

    {

      "action": "Ventana Tratar Plan de Cuentas (Reestructuración Estructural)",

      "path": "Finanzas -> Tratar plan de cuentas"

    }

  ],

  "business_rules_and_validations": {

    "coa_definition_options": [

      "1. Seleccionar modelo predefinido estándar (según la localización legal seleccionada al crear la BD).",

      "2. Importar estructura heredada desde legado usando Data Transfer Workbench (DTW - OACT.csv).",

      "3. Definir manualmente un Plan de Cuentas propio (procedimiento laborioso y restringido)."

    ],

    "two_windows_paradigm": {

      "plan_de_cuentas_window": {

        "purpose": "Operación diaria y mantenimiento puntual.",

        "allowed_tasks": [

          "Añadir cuenta de mayor a un título existente.",

          "Consultar saldos, movimientos y transacciones históricas.",

          "Editar propiedades en 'Detalles de cuenta' (bloqueo de períodos, saldo mínimo/máximo, moneda de cuenta)."

        ]

      },

      "tratar_plan_de_cuentas_window": {

        "purpose": "Reorganización masiva y mantenimiento estructural del árbol contable.",

        "allowed_tasks": [

          "Añadir nuevos títulos (agrupadores) en cualquier nivel.",

          "Mover títulos y cuentas completas de una rama a otra mediante arrastre o botones de posición.",

          "Eliminar cuentas (solo posible si tienen saldo 0.00 y NUNCA han tenido movimientos contables).",

          "Añadir cuentas de subnivel ('Añadir cuenta subordinada')."

        ]

      }

    },

    "visual_color_coding": {

      "blue": "Cuentas de Título (agrupadores no imputables, Levels 1 a 4).",

      "black": "Cuentas activas imputables estándar (Postable = 'Y', Level 5).",

      "green": "Cuentas asociadas o cuentas configuradas en la Determinación de Cuentas de Mayor por Defecto."

    },

    "structural_best_practices": {

      "rule": "Se recomienda que todas las cuentas activas (imputables) se encuentren estrictamente en el mismo nivel jerárquico (típicamente Nivel 5), reservando los niveles 1 al 4 exclusivamente para títulos agrupadores."

    }

  }

}


3. DESARROLLO CONCEPTUAL Y FUNCIONAL DETALLADO
3.1 Vías de Creación Inicial del Plan de Cuentas
Al iniciar la implementación de una sociedad en SAP Business One, se presentan 3 métodos para establecer el Plan de Cuentas (OACT):

Modelo Predefinido (Template): La opción más ágil y recomendada para la mayoría de empresas. Adopta el catálogo contable oficial adaptado a la legislación del país (ej. Plan Contable General de España, US GAAP en EE.UU., catálogos locales en Latinoamérica).
Migración vía DTW: Importación masiva de archivos .csv para clientes que exigen preservar su codificación contable heredada.
Definición Manual Completa: Creación desde cero de cajones y títulos. Requiere configurar manualmente cada una de las cuentas en la Determinación de Cuentas de Mayor para que el ERP pueda operar.
3.2 El Paradigma de las Dos Ventanas de Mantenimiento
SAP B1 separa claramente la administración del plan de cuentas en dos herramientas complementarias:

3.3 Código de Colores Visual en el Árbol Contable
Para facilitar la navegación visual del contador:

Azul: Representa cuentas de Título (Postable = 'N'). No admiten imputaciones directas en asientos; su saldo refleja la sumatoria de las cuentas activas hijas.
Negro: Representa cuentas Activas estándar (Postable = 'Y'). Son las cuentas imputables donde se registran las transacciones de ventas, compras, bancos o ajustes manuales.
Verde: Representa cuentas activas que han sido asignadas en la Determinación de Cuentas de Mayor (Default Accounts) o que están parametrizadas como Cuentas Asociadas (Reconciliation Accounts). Indican cuentas críticas que el sistema utiliza para automatizaciones.
3.4 Reglas para Borrar o Desactivar Cuentas
Borrado Físico: Solo se permite borrar una cuenta en la ventana Tratar plan de cuentas si la cuenta nunca ha tenido ningún asiento contable registrado en la historia de la sociedad (incluso si actualmente su saldo es cero).
Bloqueo / Inactivación: Si una cuenta ya tiene transacciones en JDT1, no puede borrarse. Para sacarla de operación, se accede a Detalles de cuenta y se marca la casilla Inactivo o se definen fechas de validez específicas.


4. CASO DE NEGOCIO RESUELTO: OEC COMPUTERS
Contexto
María, la contadora de OEC Computers, requiere abrir una nueva línea de negocio para préstamos a corto plazo con una entidad financiera internacional. Necesita:

Crear un nuevo título agrupador llamado Préstamos Bancarios Extranjeros bajo el cajón de Pasivo (Cajón 2), rama Pasivo Corriente (Nivel 3).
Crear la cuenta activa imputable Préstamo Banco City USD (Nivel 5) con moneda extranjera USD.
Procedimiento en Pantalla
Crear el Título en Tratar Plan de Cuentas:
Ir a: Finanzas -> Tratar plan de cuentas.
Seleccionar Cajón: Pasivo.
Navegar hasta la sección Pasivo Corriente.
Hacer clic en el botón Añadir título.
Nombre: Préstamos Bancarios Extranjeros.
Ubicación: Nivel 4, dependiente de Pasivo Corriente.
Clic en Actualizar.
Crear la Cuenta Activa:
Ir a: Finanzas -> Plan de cuentas.
Localizar el título recién creado Préstamos Bancarios Extranjeros (aparece en azul).
Clic en el botón Añadir cuenta (o cambiar a Modo Crear Ctrl + A).
Código de Cuenta: 210040.
Nombre: Préstamo Banco City USD.
Nivel: 5 (Activa, aparece en negro).
Moneda de la cuenta: Seleccionar USD.
Clic en Crear.
Resultado:
La estructura queda perfectamente consolidada y visible en el balance de situación.


5. BANCO DE EVALUACIÓN SITUACIONAL
Pregunta 1
Situación: Un contador intenta borrar una cuenta contable de gastos de viaje que fue utilizada por error en dos asientos durante el año anterior. Actualmente la cuenta tiene saldo $0.00. Al seleccionarla en el formulario "Tratar plan de cuentas" y presionar eliminar, el sistema arroja un mensaje de error y no permite borrarla. ¿Cuál es la razón técnica de este comportamiento?

A) La cuenta debe ser desbloqueada primero por el administrador en Parametrizaciones Generales.
B) Una cuenta contable que posee registros históricos en la tabla de asientos (JDT1) no puede eliminarse físicamente de la base de datos para preservar la trazabilidad y la integridad de auditoría contable.
C) La cuenta solo puede borrarse desde la ventana "Plan de cuentas" regular, no desde "Tratar plan de cuentas".
D) El usuario debe cambiar primero el color de la cuenta de negro a azul.
Respuesta Correcta: B
Justificación Técnica: La integridad referencial de SAP Business One prohíbe eliminar registros de la tabla OACT si su clave primaria (AcctCode) está referenciada en líneas de asientos (JDT1). La solución operativa para cuentas obsoletas o erróneas con histórico es inactivarlas en Detalles de cuenta.
Pregunta 2
Situación: Durante una reorganización contable, se requiere trasladar cinco cuentas de gastos generales hacia un nuevo título agrupador de gastos administrativos. ¿Qué ventana de SAP Business One se debe utilizar para realizar esta reorganización estructural?

A) Plan de cuentas regular.
B) Tratar plan de cuentas.
C) Determinación de cuentas de mayor.
D) Asistente de configuración rápida.
Respuesta Correcta: B
Justificación Técnica: La ventana Tratar plan de cuentas está diseñada específicamente para labores de mantenimiento estructural: mover cuentas entre títulos, cambiar niveles jerárquicos y añadir títulos agrupadores. La ventana regular de Plan de cuentas no permite reorganizar la estructura del árbol.