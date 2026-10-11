UNIDAD 041: PLAN DE CUENTAS - CONCEPTOS Y ESTRUCTURA JERÁRQUICA (SAP BUSINESS ONE 10.0)
Código de Manual: 10_FinSetup_11_COA_COAConcepts_ES
Módulo Oficial: Finanzas / Configuración Financiera (FI - Chart of Accounts)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Contadores Generales, Auditores y Agentes IA (Antigravity)
Carpeta Asociada: 041_10_FinSetup_11_COA_COAConcepts_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "041",

  "topic": "Chart of Accounts Structure & Accounting Conventions",

  "sap_module": "Financials_Setup",

  "database_tables": {

    "chart_of_accounts": {

      "table": "OACT",

      "primary_key": "AcctCode",

      "key_fields": {

        "AcctName": "Descripción de la cuenta contable",

        "CurrTotal": "Saldo acumulado en moneda local",

        "Levels": "Nivel jerárquico dentro del árbol (Nivel 1 a 10)",

        "Postable": "Indica si es cuenta activa imputable ('Y') o cuenta de título ('N')",

        "ActType": "Tipo de cuenta: Activo, Pasivo, Capital, Ingreso, Gasto",

        "LocManTran": "Indica si la cuenta es asociada (Reconciliation Account)"

      }

    },

    "account_segmentation": "OASC",

    "financial_projects": "OPRJ"

  },

  "menu_paths": [

    "Finanzas > Plan de cuentas",

    "Finanzas > Detalles de cuenta de mayor",

    "Finanzas > Informes financieros > Balance",

    "Finanzas > Informes financieros > Balance de sumas y saldos",

    "Finanzas > Informes financieros > Pérdidas y ganancias"

  ],

  "drawer_structure": {

    "balance_sheet_drawers": [

      { "drawer_id": 1, "name": "Activo (Assets)", "nature": "Deudora", "financial_statement": "Balance General" },

      { "drawer_id": 2, "name": "Pasivo (Liabilities)", "nature": "Acreedora", "financial_statement": "Balance General" },

      { "drawer_id": 3, "name": "Capital y Reservas (Equity)", "nature": "Acreedora", "financial_statement": "Balance General" }

    ],

    "profit_loss_drawers": [

      { "drawer_id": 4, "name": "Volumen de Negocios / Ingresos (Revenues)", "nature": "Acreedora", "financial_statement": "Pérdidas y Ganancias" },

      { "drawer_id": 5, "name": "Costes de Ventas (Cost of Goods Sold - COGS)", "nature": "Deudora", "financial_statement": "Pérdidas y Ganancias" },

      { "drawer_id": 6, "name": "Costes de Explotación / Gastos Operativos (Operating Expenses)", "nature": "Deudora", "financial_statement": "Pérdidas y Ganancias" },

      { "drawer_id": 7, "name": "No Derivados de Explotación / Financieros (Financing Income/Expense)", "nature": "Variable", "financial_statement": "Pérdidas y Ganancias" },

      { "drawer_id": 8, "name": "Impuestos y Otros Gastos (Taxation & Extraordinary)", "nature": "Deudora", "financial_statement": "Pérdidas y Ganancias" },

      { "drawer_id": 9, "name": "Cajón Opcional 1 (User Defined)", "nature": "Personalizado", "financial_statement": "Según localización" },

      { "drawer_id": 10, "name": "Cajón Opcional 2 (User Defined)", "nature": "Personalizado", "financial_statement": "Según localización" }

    ]

  },

  "hierarchy_rules": {

    "max_levels": 10,

    "level_1": "Cajón de armario (Drawer Level) - Representa los grandes bloques contables",

    "intermediate_levels": "Títulos (en azul) que agrupan y totalizan saldos sin permitir imputación",

    "lowest_level": "Cuentas Activas (en negro o verde si son por defecto) - Únicas imputables en transacciones",

    "best_practice": "Definir todas las cuentas activas en el mismo nivel más bajo (ej. Nivel 5) para mantener consistencia y simetría en los reportes financieros"

  },

  "account_details_governance": {

    "reconciliation_account_rule": "Los interlocutores comerciales (clientes y proveedores) no son cuentas de mayor; sus saldos se consolidan en cuentas asociadas (Reconciliation Accounts) del cajón 1 y 2",

    "active_period_restriction": "Permite restringir la validez operativa de una cuenta a un rango de fechas específico",

    "balance_limits": "Definición de saldos mínimos y máximos permitidos con validación de bloqueo o advertencia en Parametrizaciones de Documento"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Plan de Cuentas como Espina Dorsal Financiera
El Plan de Cuentas (Chart of Accounts - COA) en SAP Business One es el catálogo integral y jerárquico de todas las cuentas de mayor (OACT) utilizadas por la organización para registrar sus hechos económicos y cumplir con los Principios de Contabilidad Generalmente Aceptados (GAAP/NIIF).

Cada cuenta posee:

Código de Cuenta: Clave alfanumérica única o segmentada.
Descripción: Nombre formal y funcional.
Atributos Operativos: Moneda (Local, Extranjera o Multimoneda), Proyecto Financiero asociado, Norma de Reparto analítica y estado de Imputación.
2.2 Arquitectura de Cajones: Balance vs. Pérdidas y Ganancias
El Libro Mayor se organiza visualmente en Cajones de Armario (Drawers) representados en el Nivel 1:

Cajones de Balance (Cajones 1, 2 y 3):
Comprenden Activo, Pasivo y Capital Propio (Patrimonio Neto).
Su saldo acumulado se mantiene vivo de un ejercicio contable al siguiente.
Reflejan la posición financiera patrimonial y solvencia de la empresa.
Cajones de Resultados / Pérdidas y Ganancias (Cajones 4 al 8):
Comprenden Ingresos, Costos de Ventas, Gastos Operativos, Financieros e Impuestos.
Sus saldos miden el desempeño y variación económica durante un período fiscal.
Al cierre del ejercicio contable (Cierre del Período), sus saldos se liquidan y se transfieren a la cuenta patrimonial de Resultados Acumulados en el Balance General, iniciando el nuevo año en cero.
Cajones Opcionales (Cajones 9 y 10): Disponibles según la localización fiscal para contabilidad analítica, de orden o cuentas puente específicas.
2.3 Jerarquía de Niveles y Convención Visual
SAP Business One soporta hasta 10 niveles jerárquicos:

Nivel 1: El Cajón mismo.
Niveles Intermedios (2 al 4): Cuentas de Título (Header Accounts). Se muestran en color azul. Su función es puramente clasificatoria y calculan automáticamente la suma de todas las cuentas activas que cuelgan bajo ellas. No permiten imputación directa.
Nivel Operativo (ej. Nivel 5): Cuentas Activas (Active Accounts). Se muestran en color negro (o en verde si están asignadas como cuentas automáticas por defecto en la Determinación de Cuentas de Mayor). Son las únicas cuentas sobre las que se pueden contabilizar asientos manuales o automáticos.
2.4 Control Financiero Avanzado: Detalles de Cuenta
En la ventana Detalles de cuenta de mayor, el sistema ofrece mecanismos estrictos de control interno:

Bloqueo por Rango de Fechas: Habilita el funcionamiento de una cuenta únicamente durante un rango temporal (ej. gastos de una campaña específica), bloqueando cualquier contabilización fuera de ese intervalo.
Límites de Saldo (Mínimo y Máximo): Permite fijar un saldo mínimo (ej. fondo de caja chica no inferior a $100) y un saldo máximo (ej. transferir a banco al llegar a $5,000). Al infringir los límites, el sistema activa alertas o bloquea el documento según la política establecida en Parametrizaciones de documento.


3. ATLAS DIDÁCTICO: MAPA DE RELACIONES CONTABLES Y REPORTES
┌─────────────────────────────────────────────────────────────────────────┐

│                    ESTRUCTURA DEL PLAN DE CUENTAS (OACT)                │

├───────────────────────────────────┬─────────────────────────────────────┤

│      CAJONES DE BALANCE           │     CAJONES DE PÉRDIDAS Y GANANCIAS │

│  (Saldos acumulativos vivos)      │     (Se compensan en cierre anual)  │

│                                   │                                     │

│  [1] Activo (Deudora)             │  [4] Ingresos (Acreedora)           │

│  [2] Pasivo (Acreedora)           │  [5] Coste de Ventas (Deudora)      │

│  [3] Capital Propio (Acreedora)   │  [6] Gastos Explotación (Deudora)   │

│                                   │  [7] Financieros (Variable)         │

│                                   │  [8] Impuestos / Extraord. (Deudora)│

└─────────────────┬─────────────────┴──────────────────┬──────────────────┘

                  │                                    │

                  ▼                                    ▼

       [ BALANCE GENERAL ]                 [ ESTADO DE RESULTADOS (P&G) ]


4. CASO DE NEGOCIO RESUELTO: IMPLEMENTACIÓN CONTABLE EN OEC COMPUTERS
Escenario de Consultoría:
María, contable de OEC Computers, está diseñando el plan de cuentas para su salida en vivo.

Desea controlar los gastos del proyecto Cumbre Tecnológica 2026.
Requiere que el Fondo de Caja Chica no supere los $5,000.00 USD para mitigar riesgos de robo, y no baje de $100.00 USD para operatividad.
Desea que todos los clientes locales consoliden en la cuenta asociada 112000 - Deudores Comerciales Locales sin crear una cuenta de mayor por cada cliente.
Solución y Parametrización en SAP Business One:
Creación de Cuenta Activa en Nivel 5:
Ruta: Finanzas > Plan de cuentas > Cajón 6 (Gastos).
Bajo el título 6100 - Gastos Comerciales, se crea la cuenta activa 610050 - Gastos Cumbre Tecnológica en nivel 5. Se asigna la moneda local y se vincula al código de proyecto CUMBRE2026.
Restricción Temporal:
En Detalles de cuenta de mayor, se marca la casilla Activo con fecha inicio 2026-03-01 y fecha fin 2026-12-31. Cualquier intento de contabilizar en 2027 será bloqueado automáticamente.
Control de Límites de Saldo:
Para la cuenta 111050 - Caja Chica, María entra a Detalles de cuenta de mayor, activa Saldo de cuenta permitido y define: De: 100.00 y Hasta: 5,000.00. En Parametrizaciones de documento, selecciona Bloquear contabilización al superar límites.
Validación de Auxiliares:
Se valida que los 1,200 clientes de OEC Computers apunten a la cuenta asociada 112000. El Balance General permanece compacto y pulcro mostrando un único total consolidado en 112000, mientras que la cartera individual se audita en el informe de Antigüedad de saldos de clientes.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es la diferencia fundamental en el comportamiento de los cajones de Balance frente a los cajones de Pérdidas y Ganancias al finalizar el ejercicio contable?
A) Las cuentas de balance se eliminan y las de pérdidas y ganancias se duplican.
B) Las cuentas de balance conservan su saldo acumulado hacia el siguiente ejercicio contable, mientras que las cuentas de pérdidas y ganancias se compensan y saldan en cero mediante el proceso de Cierre del Período, transfiriendo el resultado neto al patrimonio.
C) Las cuentas de pérdidas y ganancias no admiten monedas extranjeras.
D) Ambos grupos se reinician a cero el 1 de enero.
Respuesta Correcta: B
Justificación Técnica: Los cajones 1, 2 y 3 miden patrimonio acumulativo y no se resetean; los cajones 4 al 8 miden el flujo económico de un ejercicio cerrado y deben comenzar el nuevo año con saldo cero tras la capitalización del resultado del ejercicio.
Pregunta 2
En la ventana del Plan de Cuentas de SAP Business One, ¿qué significa que una cuenta aparezca en color AZUL y qué restricción operativa tiene?
A) Es una cuenta bloqueada por auditoría fiscal.
B) Es una cuenta de Título (Header Account) que agrupa y totaliza cuentas inferiores, y no permite registrar asientos contables directamente sobre ella.
C) Es una cuenta bancaria propia con saldo negativo.
D) Es una cuenta por defecto asignada en compras.
Respuesta Correcta: B
Justificación Técnica: Las cuentas de título aparecen en azul y actúan como contenedores jerárquicos en el árbol contable. En SAP Business One, únicamente las cuentas activas (mostradas en negro o verde) admiten imputación transaccional.
Pregunta 3
¿Cómo se reflejan los saldos individuales de los Clientes y Proveedores en el Plan de Cuentas (OACT)?
A) Cada cliente y proveedor tiene su propia cuenta contable activa en el cajón 1 y 2.
B) No aparecen de forma individual; sus operaciones se consolidan y acumulan en las Cuentas Asociadas (Reconciliation Accounts) de Deudores y Proveedores, manteniendo el balance general estructurado y sin saturación.
C) Se registran como activos fijos intangibles.
D) Solo aparecen si el cliente ha pagado el 100% de sus facturas.
Respuesta Correcta: B
Justificación Técnica: SAP Business One desacopla el maestro de interlocutores comerciales (OCRD) de la contabilidad de mayor (OACT), consolidando todos los saldos auxiliares a través de cuentas asociadas de control.