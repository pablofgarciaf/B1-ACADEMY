# Guion de Video: DOC 042 FinSetup AdvancedGLAcc

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 042 FinSetup AdvancedGLAcc.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 042: DETERMINACIÓN AVANZADA DE CUENTAS DE MAYOR (SAP BUSINESS ONE 10.0)
Código de Manual: 10_FinSetup_23_DefaultGLAcc_Advanced
Módulo Oficial: Finanzas / Configuración Financiera (FI - Advanced G/L Account Determination)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Contadores de Costos, Arquitectos de Integración y Agentes IA (Antigravity)
Carpeta Asociada: 042_10_FinSetup_23_DefaultGLAcc_Advanced


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "042",

  "topic": "Advanced G/L Account Determination & Rule Prioritization",

  "sap_module": "Financials_AdvancedSetup",

  "activation": {

    "menu_path": "Gestión > Inicialización del sistema > Detalles de la empresa > Pestaña Inicialización básica",

    "checkbox": "Activar determinación de cuentas de mayor avanzada",

    "database_flag": "CINF.AdvGlAct = 'Y'"

  },

  "database_tables": {

    "criteria_inventory": "OGDC",

    "rules_inventory": "OGDR",

    "rules_accounts": "GDR1",

    "rules_resources": "OGRR",

    "item_master_data": "OITM (AdvancedRuleType, GlMethod -> Set Inventory Method By)"

  },

  "menu_paths": [

    "Gestión > Definición > Finanzas > Determinación de cuentas de mayor > Criterios de determinación - Inventario",

    "Gestión > Definición > Finanzas > Determinación de cuentas de mayor > Reglas de determinación avanzada - Inventario",

    "Gestión > Definición > Finanzas > Determinación de cuentas de mayor > Determinación de cuentas de mayor"

  ],

  "determination_criteria_inventory": [

    { "id": "ItemCode", "description": "Código de artículo", "auto_activates": "Item Group" },

    { "id": "ItemGroup", "description": "Grupo de artículos", "mandatory_for": "ItemCode" },

    { "id": "WarehouseCode", "description": "Código de almacén" },

    { "id": "ShipToCountry", "description": "País destinatario de la mercancía" },

    { "id": "ShipToState", "description": "Estado / Provincia destinataria" },

    { "id": "BPGroup", "description": "Grupo de interlocutores comerciales" },

    { "id": "BPCode", "description": "Código de cliente o proveedor" },

    { "id": "UserDefinedFields", "description": "Campos de usuario (UDFs) activos como criterios de segmentación" }

  ],

  "resolution_rules": {

    "hierarchy_precedence": "1. Regla Avanzada de mayor prioridad que coincida con el documento -> 2. Cuentas de nivel Empresa en Determinación estándar",

    "priority_mechanism": "El orden vertical de filas en la ventana 'Criterios de determinación' fija el orden de evaluación de las reglas (la fila superior tiene prioridad máxima)",

    "specific_vs_all": "Un valor específico (ej. País = 'Canadá') SIEMPRE tiene mayor prioridad que el comodín 'Todos' (All)",

    "partial_account_override": "Si una regla avanzada solo especifica la Cuenta de Ingresos, la Cuenta de Existencias y el Costo de Ventas se toman automáticamente del nivel Empresa estándar"

  },

  "migration_options_existing_db": [

    { "option": 1, "name": "Migrar asignaciones de cuenta y parametrizaciones", "desc": "Convierte todas las cuentas tradicionales de almacén y grupo en reglas avanzadas" },

    { "option": 2, "name": "Visualización previa de reglas avanzadas", "desc": "Simula la matriz para auditar antes de confirmar la conversión" },

    { "option": 3, "name": "Migrar solo parametrizaciones de inventario", "desc": "Limpia la matriz para diseñar las reglas desde cero sin arrastrar historiales" }

  ]

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 La Limitación de la Solución Tradicional frente a la Solución Avanzada
En el modelo tradicional de SAP Business One, la determinación de cuentas contables para transacciones de inventario, ventas y compras está rígidamente limitada a tres opciones excluyentes:

Por Nivel de Empresa (General).
Por Grupo de Artículos.
Por Almacén.

Este esquema tradicional resulta insuficiente para empresas en expansión global o con operaciones complejas. Por ejemplo:

¿Cómo imputar ingresos a una cuenta contable distinta si un mismo producto se vende localmente en EE. UU. frente a si se exporta a Brasil o Canadá?
¿Cómo diferenciar el costo de ventas según el tipo de cliente (Mayorista vs Minorista) sin tener que crear duplicados del almacén o del artículo?

La Determinación Avanzada de Cuentas de Mayor (Advanced G/L Account Determination) resuelve esto sustituyendo la jerarquía fija por una Matriz Multidimensional de Reglas Basadas en Criterios Dinámicos.
2.2 Arquitectura y Activación de la Solución Avanzada
La solución se activa en Gestión > Inicialización del sistema > Detalles de la empresa > Inicialización básica, marcando Activar determinación de cuentas de mayor avanzada.

Al activarse:

En los Datos Maestros del Artículo (OITM), el campo Fijar cuentas de mayor según cambia de nombre a Fijar método de inventario según (manteniendo sus valores para costeo, pero sin gobernar la contabilidad).
Se añade el campo Tipo de regla avanzada, que se asigna automáticamente como General a todos los artículos nuevos.
Se eliminan las pestañas de finanzas en Grupos de Artículos y Almacenes, centralizando el 100% de la lógica en la nueva matriz de reglas.
2.3 Matriz de Criterios y Mecánica de Prioridades
En la ventana Criterios de determinación - Inventario, el administrador define qué variables del negocio influyen en la contabilidad y en qué orden de precedencia:

Criterios Disponibles: Código de Artículo, Grupo de Artículos, Almacén, País Destinatario (Ship-to Country), Estado Destinatario, Grupo de Socios de Negocios, Código de Socio de Negocios y UDFs.
El Orden de Filas es la Ley: El orden vertical en la ventana de criterios determina qué regla gana cuando un documento coincide con múltiples condiciones. Por ejemplo, si País Destinatario está por encima de Almacén, una regla para Canadá tendrá prioridad sobre una regla genérica del Almacén 01.
Regla de Especificidad: Un criterio con un valor concreto (ej. Almacén = 05) siempre derrota a una regla con valor comodín Todos.
2.4 Comportamiento en Documentos de Ventas y Compras
Cuando un usuario añade una línea en una Factura de Clientes o Entrada de Mercancías:

El sistema evalúa las cuentas requeridas para la transacción (ej. Cuenta de Ingresos y Cuenta de Deudores).
Verifica si existen reglas avanzadas que coincidan con la combinación exacta de: Fecha de contabilización del periodo + Tipo de regla (General) + Datos del Socio de Negocios (País, Grupo) + Datos del Artículo (Código, Grupo, Almacén).
Si existe coincidencia, aplica las cuentas de la regla de mayor prioridad.
Si la regla avanzada solo define una de las cuentas (ej. la de ingresos), las demás cuentas del asiento (inventario, impuestos) se heredan transparentemente de la Determinación de cuentas de mayor a nivel Empresa.
Si ninguna regla coincide, el sistema recurre al 100% a las cuentas por defecto a nivel de Empresa.


3. ATLAS DIDÁCTICO: EL FLUJO DE DECISIÓN CONTABLE DINÁMICA
                        [ DOCUMENTO COMERCIAL: FACTURA ]

                                       │

                                       ▼

             ¿La cuenta requerida tiene Reglas Avanzadas activas?

                                       │

                    ┌──────────────────┴──────────────────┐

                   SÍ                                     NO

                    │                                     │

                    ▼                                     ▼

   ¿Los datos del documento coinciden         [ Tomar cuenta estándar a nivel ]

   con los Criterios de la Matriz?            [ de Empresa (G/L Determination)]

                    │

          ┌─────────┴─────────┐

         SÍ                   NO

          │                   │

          ▼                   └───────────┐

[ Aplicar regla avanzada con mayor ]      ▼

[ prioridad (Valor específico > Todos)]   [ Recurrir a cuenta de Empresa ]


4. CASO DE NEGOCIO RESUELTO: SEGMENTACIÓN DE INGRESOS EN OEC COMPUTERS
Escenario de Consultoría:
James, CEO de OEC Computers (EE. UU.), inicia ventas de impresoras de la línea J.B. Printers en Canadá y Brasil.

En el informe de Pérdidas y Ganancias requiere ver con exactitud los ingresos generados por ventas de impresoras específicamente en Canadá, diferenciados de los ingresos nacionales de EE. UU.
Desea evitar crear almacenes o códigos de artículo duplicados.
Solución con Determinación Avanzada:
Se activa la solución avanzada en Detalles de la empresa.
En Criterios de determinación - Inventario, se activan:
Prioridad 1: Grupo de Artículos
Prioridad 2: País Destinatario (Ship-to Country)
En Reglas de determinación avanzada, se crea la Regla 101:
Grupo de Artículos = J.B. Printers
País Destinatario = CA (Canadá)
Cuenta de Ingresos = 410020 - Ingresos por Ventas Impresoras Canadá
Verificación Operativa:
Cuando un vendedor emite una Factura de Clientes para el cliente canadiense C30000 vendiendo la impresora PRN001, el sistema evalúa la dirección de entrega (Ship-to = CA) y el grupo del artículo (J.B. Printers).
El asiento contable acredita automáticamente la cuenta 410020, cumpliendo la meta gerencial de OEC Computers sin fricción para el usuario.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Al activar la Determinación Avanzada de Cuentas de Mayor en una base de datos de SAP Business One, ¿qué cambio inmediato ocurre en los Datos Maestros del Artículo (OITM)?
A) Se borran todos los precios de venta de las listas de precios.
B) El campo "Fijar cuentas de mayor según" pasa a llamarse "Fijar método de inventario según" y deja de gobernar la imputación de cuentas contables.
C) Todos los artículos se convierten en artículos no inventariables.
D) Se exige ingresar un número de serie obligatorio en cada producto.
Respuesta Correcta: B
Justificación Técnica: El campo cambia de rol para gestionar únicamente métodos de costeo (especialmente en configuraciones multi-sucursal), delegando la asignación contable íntegra a la matriz de reglas avanzadas.
Pregunta 2
Si una regla avanzada de determinación contable coincide con el Grupo de Artículos y el País de Destino del documento, pero en la regla ÚNICAMENTE se especificó la Cuenta de Ingresos, ¿de dónde toma SAP Business One la Cuenta de Existencias para el asiento?
A) Cancela el documento emitiendo un error de validación contable.
B) Toma la Cuenta de Existencias configurada a nivel general de Empresa en la ventana Determinación de cuentas de mayor.
C) Asigna la cuenta de pérdidas y ganancias por omisión.
D) Solicita al usuario teclear la cuenta manualmente antes de guardar.
Respuesta Correcta: B
Justificación Técnica: La determinación avanzada admite sobrescritura parcial: las cuentas no declaradas en la regla específica se heredan automáticamente de los valores por defecto a nivel de Empresa.
Pregunta 3
¿Cómo determina SAP Business One qué regla avanzada tiene mayor jerarquía cuando un documento comercial coincide simultáneamente con los criterios de dos reglas distintas?
A) Elige la regla creada en la fecha más reciente.
B) Evalúa el orden de las filas en la ventana "Criterios de determinación" (la fila situada más arriba tiene mayor prioridad) y la especificidad de los valores (un valor puntual supera a "Todos").
C) Selecciona la regla con el código numérico más bajo.
D) Elige aleatoriamente una de las dos reglas.
Respuesta Correcta: B
Justificación Técnica: La precedencia de reglas en la solución avanzada está gobernada por la posición vertical de los criterios en la ventana de definición y por el principio contable de valor explícito sobre comodín general.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
