# Guion de Video: DOC 120 FinSetup DefaultGLAccTraditional

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 120 FinSetup DefaultGLAccTraditional.

## Contenido Principal (Visual: Diapositivas correspondientes)
DOCUMENTO TÉCNICO ATÓMICO: DOC_120_FinSetup_DefaultGLAccTraditional.md
1. METADATOS TÉCNICOS
Módulo SAP: Gestión Financiera / Determinación de Cuentas de Mayor - Solución Tradicional
Código de Unidad: UNIDAD_120_FIN_DEFAULT_GL_ACCOUNTS_TRADITIONAL
Nombre del Manual Original: 10_FinSetup_22_DefaultGLAcc_Traditional.pdf
Audiencia Objetivo: Consultores de Finanzas e Inventarios, Jefes de Contabilidad, Administradores de Datos Maestros y Parametrizadores de SAP B1


2. JSON ANTIGRAVITY MASTER SCHEMA
{

  "$schema": "https://antigravity.ai/schemas/sap-b1-v10-unit.json",

  "unit_id": "120_FIN_DEFAULT_GL_TRADITIONAL",

  "title": "Configuración Financiera: Determinación de Cuentas de Mayor - Implementación Práctica de la Solución Tradicional",

  "sap_module": "Financials / Setup",

  "version": "10.0",

  "database_tables": {

    "header_tables": [

      {

        "table": "OITB",

        "description": "Grupos de Artículos (Ficha Finanzas con cuentas por grupo)",

        "key_fields": ["ItmsGrpCod", "ItmsGrpNam", "BalInvntAc", "SaleCostAc", "RevenuesAc"]

      },

      {

        "table": "OWHS",

        "description": "Almacenes (Ficha Finanzas con cuentas por almacén)",

        "key_fields": ["WhsCode", "WhsName", "BalInvntAc", "SaleCostAc", "RevenuesAc"]

      },

      {

        "table": "OITM",

        "description": "Datos Maestros de Artículo (Campo GLMethod y cuentas a nivel artículo)",

        "key_fields": ["ItemCode", "ItemName", "GLMethod"]

      }

    ],

    "line_tables": [

      {

        "table": "OITW",

        "description": "Inventario de Artículo por Almacén (Cuentas asignadas a nivel de artículo por almacén)"

      }

    ]

  },

  "menu_paths": [

    {

      "action": "Configurar Cuentas a Nivel de Grupo de Artículos",

      "path": "Gestión -> Configuración -> Inventario -> Grupos de artículos -> ficha Finanzas"

    },

    {

      "action": "Configurar Cuentas a Nivel de Almacén",

      "path": "Gestión -> Configuración -> Inventario -> Almacenes -> ficha Finanzas"

    },

    {

      "action": "Fijar Método por Defecto para Artículos Nuevos",

      "path": "Gestión -> Inicialización del sistema -> Parametrizaciones generales -> ficha Inventario -> subficha Artículos -> campo 'Fijar cuentas de mayor según'"

    },

    {

      "action": "Asignar Cuentas a Nivel de Artículo Individual",

      "path": "Inventario -> Datos maestros de artículo -> ficha Datos de inventario -> campo 'Fijar cuentas de mayor según' fijado en 'Nivel de artículo'"

    }

  ],

  "business_rules_and_validations": {

    "hierarchical_options": {

      "warehouse_level": {

        "code": "W",

        "behavior": "El artículo deriva sus cuentas automáticamente de la ficha Finanzas del Almacén en el documento. Los campos de cuentas en el maestro del artículo quedan bloqueados en modo solo lectura."

      },

      "item_group_level": {

        "code": "C",

        "behavior": "El artículo deriva sus cuentas de la ficha Finanzas del Grupo de Artículos al que pertenece. Si se modifica una cuenta en el grupo, los artículos asociados heredan el cambio automáticamente."

      },

      "item_level": {

        "code": "I",

        "behavior": "El usuario debe ingresar manualmente las cuentas contables en la grilla de almacenes de la ficha Inventario del maestro de artículo. Otorga máxima granularidad para excepciones comerciales."

      }

    },

    "runtime_resolution": {

      "rule": "Cuando se añade un documento de marketing o inventario que genera asiento contable, el sistema evalúa el campo GLMethod del artículo. Si es 'C', lee OITB; si es 'W', lee OWHS; si es 'I', lee OITW."

    },

    "transition_rules": {

      "rule": "Un artículo puede transicionar en cualquier momento entre Almacén, Grupo de Artículos o Nivel de Artículo, permitiendo reasignaciones operativas según la evolución del negocio."

    }

  }

}


3. DESARROLLO CONCEPTUAL Y FUNCIONAL DETALLADO
3.1 Los 3 Niveles de la Solución Tradicional
La solución tradicional de determinación de cuentas estructura la asignación contable en 3 niveles mutuamente excluyentes para cada artículo:

Nivel Almacén (GLMethod = 'W'):
Las cuentas contables se administran en Gestión -> Configuración -> Inventario -> Almacenes -> ficha Finanzas.
Excelente para negocios donde cada almacén físico representa una unidad de negocio, sucursal o centro de beneficio independiente (ej. Almacén Tienda Norte vs. Almacén Tienda Sur).
Nivel Grupo de Artículos (GLMethod = 'C'):
Las cuentas se configuran en Gestión -> Configuración -> Inventario -> Grupos de artículos -> ficha Finanzas.
Es el estándar más extendido en la industria porque permite analizar márgenes, ventas e inventarios por familias de productos (ej. Línea Blanca vs. Informática vs. Telefonía).
Nivel Artículo Individual (GLMethod = 'I'):
Las cuentas se asignan de forma manual e individual en la pestaña Datos de inventario del maestro OITM para cada almacén en el que opera.
Diseñado para productos atípicos, activos especiales o mercancías sujetas a regulaciones tributarias únicas.
3.2 El Flujo de Configuración en 4 Pasos
Para implementar exitosamente la solución tradicional, se debe seguir la siguiente secuencia cronológica:

Paso 1 (Cuentas Base de la Empresa): Parametrizar la ventana Determinación de cuentas de mayor a nivel de sociedad. Estos valores funcionarán como plantilla inicial para los grupos y almacenes.
Paso 2 (Definición en Objetos):
Configurar las cuentas específicas en cada Grupo de Artículos (OITB).
Configurar las cuentas específicas en cada Almacén (OWHS).
Paso 3 (Parámetro Global para Nuevos Artículos): En Parametrizaciones Generales -> Inventario -> Artículos, fijar el valor por defecto en el campo Fijar cuentas de mayor según (ej. seleccionar "Grupo de artículos").
Paso 4 (Alta y Herencia): Al registrar un nuevo artículo, este adopta automáticamente el método configurado en el Paso 3 y hereda las cuentas contables de su grupo o almacén sin requerir digitación adicional.


4. CASO DE NEGOCIO RESUELTO: OEC COMPUTERS
Contexto
OEC Computers implementa la Solución Tradicional por Grupo de Artículos para su catálogo general. Sin embargo:

Vende servidores de alta gama (S10000) pertenecientes al grupo Servidores, cuyas ventas deben reportarse en la cuenta contable 8007 (Ingresos Servidores) y coste en 8008.
Vende impresoras láser (A00002) pertenecientes al grupo Impresoras, cuyas ventas deben imputarse en la cuenta 9002 (Ingresos Impresoras) y coste en 9001.
Introduce un prototipo de servidor experimental (X70007) que requiere imputar sus ingresos a una cuenta contable de proyectos I+D (7002).
Configuración Operativa
En el grupo de artículos Servidores: Cuentas fijadas en Ingresos = 8007, Coste = 8008.
En el grupo de artículos Impresoras: Cuentas fijadas en Ingresos = 9002, Coste = 9001.
Para los artículos S10000 y A00002, se mantiene el método fijado en Grupo de artículos.
Para el prototipo X70007:
Abrir Datos maestros de artículo.
Ir a la ficha Datos de inventario.
Cambiar el campo Fijar cuentas de mayor según de Grupo de artículos a Nivel de artículo.
En la columna Cuenta de ingresos, asignar manualmente la cuenta 7002.
Resultado en Factura:
Al emitir una factura multilínea conteniendo A00002, S10000 y X70007, el sistema genera un único asiento contable desglosado con créditos respectivos a las cuentas 9002, 8007 y 7002 sin errores.


5. BANCO DE EVALUACIÓN SITUACIONAL
Pregunta 1
Situación: Un usuario da de alta un nuevo artículo y nota que en la ficha "Datos de inventario", los campos correspondientes a las cuentas de existencias, ingresos y coste de ventas aparecen sombreados en gris y no permiten su modificación manual. ¿Cuál es la causa?

A) El usuario no tiene licencia profesional de SAP.
B) El campo "Fijar cuentas de mayor según" está definido a nivel de "Grupo de artículos" o "Almacén", por lo que las cuentas se heredan de dichos objetos y no son editables en el maestro.
C) La base de datos tiene activa la moneda del sistema en euros.
D) El artículo no está marcado como inventariable.
Respuesta Correcta: B
Justificación Técnica: Cuando el método de determinación tradicional es Almacén o Grupo de Artículos, SAP B1 bloquea las celdas en OITM para garantizar la uniformidad contable de la familia. Para editarlas individualmente en el artículo, el método debe cambiarse a "Nivel de artículo".
Pregunta 2
Situación: Si una empresa cambia la cuenta de ingresos configurada en la ficha Finanzas del Grupo de Artículos "Accesorios", ¿qué impacto tiene este cambio en las facturas de clientes que ya fueron emitidas y contabilizadas en el pasado?

A) Las facturas anteriores se actualizan automáticamente reclasificando los asientos viejos.
B) Las facturas anteriores no se modifican; los asientos históricos permanecen inalterados y la nueva cuenta solo aplicará a los nuevos documentos que se creen a partir del momento de la modificación.
C) El sistema bloquea el cambio hasta ejecutar un recálculo contable.
D) Se genera un asiento de ajuste automático por diferencia de inventario.
Respuesta Correcta: B
Justificación Técnica: Los asientos contables registrados en OJDT/JDT1 son inmutables. Modificar las cuentas por defecto en grupos de artículos o almacenes solo afecta a las transacciones futuras que consulten la definición del grupo en tiempo de ejecución.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
