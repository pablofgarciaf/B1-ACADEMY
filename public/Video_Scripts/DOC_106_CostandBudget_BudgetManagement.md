# Guion de Video: DOC 106 CostandBudget BudgetManagement

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 106 CostandBudget BudgetManagement.

## Contenido Principal (Visual: Diapositivas correspondientes)
DOC_106: Gestión Integral del Presupuesto, Escenarios y Control de Desviaciones en SAP Business One 10.0
Metadatos Técnicos
Módulo SAP: Gestión Presupuestaria y Finanzas (Budget Management & Financials)
Código de Documento: DOC_106_CostandBudget_BudgetManagement
Archivo Fuente Analizado: 10_CostandBudget_21_Budget_Budget.pdf (File ID: 1Lp3ov5R-Ug9Y6tJ0y9ZOCZPQaVlWQcce)
Audiencia Objetivo: Directores Financieros (CFO), Controladores de Presupuesto, Jefes de Compras y Agentes Autónomos de IA / Antigravity
Prerrequisitos: Plan de Cuentas (OACT), Parametrizaciones Generales de Presupuesto (CINF), Autorizaciones Generales de Usuario (USR3)


JSON Antigravity Master Schema
{

  "antigravity_schema_version": "2.0_Master",

  "document_id": "DOC_106_CostandBudget_BudgetManagement",

  "sap_module": "Financials - Budget Management",

  "db_tables": {

    "budget_tables": [

      {

        "table_name": "OBGS",

        "description": "Escenarios de Presupuesto (Budget Scenarios)",

        "primary_key": "AbsId"

      },

      {

        "table_name": "OBGD",

        "description": "Métodos de Distribución del Presupuesto (Budget Distribution Methods)",

        "primary_key": "DistCode"

      },

      {

        "table_name": "BGD1",

        "description": "Líneas de los Métodos de Distribución (Factores de los 12 meses del ejercicio fiscal)",

        "foreign_keys": ["DistCode", "Month"]

      },

      {

        "table_name": "OBGT",

        "description": "Cabecera de Definición de Presupuesto por Cuenta de Mayor y Escenario",

        "primary_key": "AbsId"

      },

      {

        "table_name": "BGT1",

        "description": "Líneas de Presupuesto Mensual por Cuenta contable (Importe presupuestado y real acumulado)",

        "foreign_keys": ["BudgId", "Instance"]

      }

    ],

    "account_flag": {

      "table_name": "OACT",

      "column": "FinancBgt",

      "description": "Casilla 'Relevante para presupuesto' (Y/N) en Detalles de cuenta de mayor"

    }

  },

  "menu_paths": [

    "Gestión -> Inicialización del sistema -> Parametrizaciones generales -> Ficha Presupuesto (Casilla Inicialización del presupuesto)",

    "Finanzas -> Plan de cuentas -> Detalles de cuenta (Casilla Relevante para presupuesto)",

    "Finanzas -> Definición del presupuesto -> Métodos de distribución del presupuesto",

    "Finanzas -> Definición del presupuesto -> Escenarios de presupuesto",

    "Finanzas -> Definición del presupuesto -> Presupuesto",

    "Finanzas -> Informes financieros -> Informes de presupuesto -> Informe de presupuesto"

  ],

  "business_rules": [

    "Regla 1: El control de desviación presupuestaria en tiempo real se evalúa ÚNICAMENTE contra el 'Escenario Principal' (Main Budget Scenario). Los escenarios alternativos (optimista, pesimista) se utilizan exclusivamente para informes analíticos y proyecciones.",

    "Regla 2: El control presupuestario audita el saldo del DEBE de las transacciones imputadas a las cuentas de gastos. Por lo tanto, las alertas y bloqueos solo operan si se define un importe en la columna Debe.",

    "Regla 3: Si se activa el control de presupuesto a nivel logístico (Solicitudes de compra, Pedidos y Entradas de mercancías), la validación suma el importe del documento en curso más todos los documentos abiertos precedentes y el saldo real acumulado.",

    "Regla 4: Modalidad Anual vs. Mensual: En la gestión Anual, el límite es el monto acumulado del año fiscal. En la gestión Mensual, el control compara cada mes contra el presupuesto asignado mediante el método de distribución.",

    "Regla 5: Tres acciones ante desviación: 1) Bloquear desviación; 2) Alerta (permite añadir o cancelar, sujeto a autorización expresa del usuario en Finanzas -> Presupuesto); 3) Sin advertencia.",

    "Regla 6: Métodos de distribución estándar del sistema (Igual, Ascendente y Descendente) no pueden modificarse ni eliminarse, pero es posible crear métodos personalizados."

  ],

  "budget_distribution_methods": [

    {"method": "Igual", "logic": "Divide el importe presupuestado en 12 partes exactamente iguales"},

    {"method": "Ascendente", "logic": "Distribuye cuotas menores en los primeros meses del año e incrementa gradualmente hacia el cierre"},

    {"method": "Descendente", "logic": "Asigna las cuotas mayores a inicio de ejercicio y disminuye mes a mes"},

    {"method": "Manual", "logic": "El usuario ajusta importes personalizados mes a mes en los detalles de fila de la cuenta"}

  ]

}


Desarrollo Conceptual y Funcional Exhaustivo
1. Propósito y Filosofía del Control Presupuestario
El módulo de Presupuesto en SAP Business One permite a las organizaciones planificar anticipadamente sus techos de gasto e inversión para cada ejercicio fiscal, midiendo en tiempo real la ejecución financiera frente a la previsión autorizada.

Su objetivo principal es:

Prevenir Sobrecostos: Evitar que los departamentos excedan los recursos asignados mediante bloqueos proactivos antes de emitir compromisos comerciales.
Proyección Financiera: Monitorear el flujo proyectado de ingresos y egresos frente a la realidad contable.
Trazabilidad Integral: Medir desviaciones tanto a nivel transaccional (documentos de compras) como en el libro mayor definitivo.
2. Protocolo de Configuración en Cuatro Etapas
Etapa 1: Inicialización de la Funcionalidad
Ruta: Gestión -> Inicialización del sistema -> Parametrizaciones generales -> Ficha Presupuesto.
Se marca la casilla: Inicialización del presupuesto.
Se define el comportamiento ante desviaciones:
Bloquear desviación del presupuesto: El sistema impide formalmente la creación del documento comercial o contable si excede el límite.
Alerta: Se muestra un mensaje de advertencia indicando la desviación. El usuario puede confirmar la transacción si posee la autorización correspondiente en Gestión -> Inicialización del sistema -> Autorizaciones -> Módulo Finanzas -> Cláusula Presupuesto.
Sin advertencia: La transacción se añade sin restricciones.
Se seleccionan los documentos sujetos a control presupuestario:
Documentos de Compras: Solicitudes de compra (OPRQ), Pedidos de compra (OPOR) y Entradas de mercancías (OPDN).
Contabilidad: Facturas de proveedores (OPCH) y Asientos directos (OJDT).
Se elige la base temporal: Anual o Mensual.
Etapa 2: Definición de Cuentas Relevantes
Tras marcar la inicialización, el sistema ofrece marcar automáticamente todas las cuentas de Pérdidas y Ganancias como relevantes para presupuesto.
En Finanzas -> Plan de cuentas -> Detalles de cuenta, se puede marcar o desmarcar la casilla Relevante para presupuesto (OACT.FinancBgt) en cualquier cuenta de gastos o ingresos.
Etapa 3: Métodos de Distribución del Presupuesto (OBGD / BGD1)
Solo aplica para presupuestación Mensual.
Métodos automáticos del sistema (inmutables):
Igual: Factor 1.0 para cada mes (1/12).
Ascendente: Factores progresivos crecientes (1, 2, 3... 12).
Descendente: Factores decrecientes (12, 11, 10... 1).
Se pueden diseñar métodos adicionales basados en la estacionalidad del negocio (ej. campañas navideñas o temporadas escolares).
Etapa 4: Escenarios y Definición de Importes (OBGS / OBGT / BGT1)
Escenario Principal (Main Budget Scenario): Creado por defecto por SAP B1. Es el único escenario auditado por las reglas de validación y bloqueo transaccional.
Escenarios Secundarios: Optimistas, pesimistas o corporativos, creados para análisis comparativo mediante las funciones Copiar escenario o Importar escenario.
Captura de Importes (Finanzas -> Definición del presupuesto -> Presupuesto):
Se seleccionan las cuentas y se introduce el importe presupuestado en la columna Debe (en moneda local o del sistema).
Si la cuenta ya tiene saldo en el ejercicio corriente, el sistema pregunta: ¿Desea restaurar el acumulador de cuentas?:
Sí: Copia el saldo contable actual a la columna Real, descontándolo de la capacidad presupuestaria restante.
No: Ignora el saldo anterior y comienza a auditar desde cero a partir de ese momento.
3. Dinámica Comparativa: Presupuesto Anual vs. Presupuesto Mensual
Supongamos un presupuesto asignado a la cuenta de Pasajes Aéreos de $6,000 USD al año:

Modalidad Anual: El límite disponible es $6,000 USD en cualquier momento del año. Si en febrero se emite un pedido por $3,000 USD, se aprueba porque está por debajo del límite anual.
Modalidad Mensual (Método Igual): Cada mes dispone de un cupo de $500 USD ($6,000 / 12). Si en febrero se emite el mismo pedido por $3,000 USD, el sistema lo bloquea de inmediato porque excede los $500 USD del mes corriente.


Caso de Negocio Resuelto en OEC Computers
Contexto
OEC Computers cerró el año anterior con desviaciones severas en gastos de viajes y congresos. Para el nuevo ejercicio fiscal, María (la contadora) implementa un control presupuestario estricto:

Límite Anual para Pasajes Aéreos (610030): $6,000 USD.
Modalidad elegida: Mensual (Método Igual = $500 USD/mes).
Acción ante desviación: Bloquear desviación del presupuesto.
Documentos auditados: Pedidos de compra y Contabilidad.
Ejecución Operativa
En octubre, el saldo real acumulado en la cuenta 610030 es de $5,000 USD.
Un empleado comercial intenta registrar un Pedido de Compras (OPOR) por $600 USD para boletos aéreos de una feria tecnológica.
Respuesta del Sistema:
Al pulsar Crear, SAP B1 ejecuta la validación: Cupo mensual de octubre = $500 USD. El pedido es por $600 USD.
El sistema genera una ventana de bloqueo inmediato: El documento excede el presupuesto definido para la cuenta 610030. La orden no puede ser grabada.
Resolución:
La gerencia decide autorizar la compra excepcionalmente mediante un usuario superusuario con autorización para Confirmar desviación del presupuesto, o ajustando la cuota mensual en los detalles del presupuesto.


Banco de Evaluación Situacional
Pregunta 1
Durante la operación comercial diaria en SAP Business One, ¿contra cuál escenario de presupuesto verifica el sistema las desviaciones y bloqueos al añadir un documento? A) Contra el escenario Optimista definido por la dirección financiera.
B) Únicamente contra el Escenario Principal (Main Budget Scenario).
C) Contra el promedio ponderado de todos los escenarios activos del año.
D) Contra el escenario del año fiscal anterior mediante una regla histórica.

Respuesta Correcta: B
Justificación Técnica: En SAP Business One, la comprobación de desviaciones en tiempo real se ejecuta con exclusividad absoluta sobre el Escenario Principal (OBGS). Los demás escenarios son meramente analíticos para emisión de informes.
Pregunta 2
Al definir el presupuesto para una cuenta de gastos en la ventana de Presupuesto, ¿en qué columna se debe registrar el importe para que el sistema active los bloqueos o advertencias por exceso de gastos? A) En la columna Crédito (Haber).
B) En la columna Débito (Debe) en moneda local o del sistema.
C) En el campo de Código de Distribución.
D) En la columna de Importe de Cierre.

Respuesta Correcta: B
Justificación Técnica: SAP B1 evalúa el control presupuestario comparando las imputaciones que debitan la cuenta de mayor contra el importe registrado en la columna Débito del presupuesto. La columna Crédito se utiliza como meta de ingresos en ventas para reportes.
Pregunta 3
Si una empresa configura el presupuesto en modalidad Mensual con el método de distribución 'Igual' para una cuenta con $12,000 USD anuales ($1,000/mes), ¿qué sucede si en el mes de marzo se genera un Pedido de Compra por $1,200 USD y la parametrización de presupuesto está configurada en 'Alerta'? A) El documento se cancela automáticamente y se borra de la base de datos.
B) El sistema emite un mensaje de alerta por desviación; el usuario puede continuar y añadir el documento si tiene la autorización correspondiente para confirmar desviaciones de presupuesto.
C) El sistema divide automáticamente el pedido en dos órdenes de $600 USD en meses consecutivos.
D) El sistema cambia automáticamente la modalidad a presupuesto anual.

Respuesta Correcta: B
Justificación Técnica: La opción 'Alerta' permite advertir sobre el sobregiro de la cuota mensual de $1,000 USD, permitiendo al usuario completar la transacción únicamente si su perfil posee la autorización formal de confirmación de desvíos en el módulo de Finanzas.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
