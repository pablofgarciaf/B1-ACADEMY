# Guion de Video: DOC 104 CostandBudget MultiDimensions

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 104 CostandBudget MultiDimensions.

## Contenido Principal (Visual: Diapositivas correspondientes)
DOC_104: Dimensiones Múltiples y Jerarquía de Centros de Coste en SAP Business One 10.0
Metadatos Técnicos
Módulo SAP: Contabilidad de Costes y Control de Gestión (Cost Accounting & Multi-Dimensions)
Código de Documento: DOC_104_CostandBudget_MultiDimensions
Archivo Fuente Analizado: 10_CostandBudget_12_CostAcc_MultiDimensions_ES.pdf (File ID: 17H1jFF3qJJbQnkCm1G2R5Nh3PzdEFj6j)
Audiencia Objetivo: Consultores Financieros, Controladores Corporativos, Directores Financieros (CFO) y Agentes Autónomos de IA / Antigravity
Prerrequisitos: DOC_103 (Contabilidad de Costes Básica), Plan de Cuentas (OACT), Parametrizaciones Generales de Costos


JSON Antigravity Master Schema
{

  "antigravity_schema_version": "2.0_Master",

  "document_id": "DOC_104_CostandBudget_MultiDimensions",

  "sap_module": "Financials - Cost Accounting & Multi-Dimensions",

  "db_tables": {

    "dimension_tables": [

      {

        "table_name": "ODIM",

        "description": "Definición de Dimensiones (hasta 5 dimensiones analíticas independientes)",

        "primary_key": "DimCode"

      },

      {

        "table_name": "OPRC",

        "description": "Centros de Coste vinculados a una dimensión específica (DimCode 1 a 5)",

        "columns": ["PrcCode", "PrcName", "DimCode", "ValidFrom", "ValidTo"]

      },

      {

        "table_name": "ODRF",

        "description": "Normas de Reparto asociadas a una dimensión específica",

        "columns": ["OcrCode", "OcrName", "DimCode", "Direct"]

      }

    ],

    "hierarchy_tables": [

      {

        "table_name": "OCCH",

        "description": "Cabecera de Jerarquía de Centros de Coste (Modelos de Reporte)",

        "primary_key": "Code"

      },

      {

        "table_name": "CCH1",

        "description": "Nodos de Jerarquía (hasta 3 niveles) y fórmulas de agregación",

        "foreign_keys": ["Code", "LineNum"]

      }

    ],

    "transaction_mapping": {

      "table_name": "JDT1",

      "dimension_fields": [

        {"dimension_1": "ProfitCode / OcrCode"},

        {"dimension_2": "OcrCode2"},

        {"dimension_3": "OcrCode3"},

        {"dimension_4": "OcrCode4"},

        {"dimension_5": "OcrCode5"}

      ]

    }

  },

  "menu_paths": [

    "Gestión -> Inicialización del sistema -> Parametrizaciones generales -> Ficha Contabilidad de costes (Casilla Utilizar dimensiones múltiples)",

    "Finanzas -> Contabilidad de costes -> Dimensiones",

    "Finanzas -> Contabilidad de costes -> Jerarquía de centros de coste",

    "Finanzas -> Contabilidad de costes -> Informe de centro de coste",

    "Finanzas -> Contabilidad de costes -> Informe de distribución",

    "Finanzas -> Contabilidad de costes -> Informe de resumen de contabilidad de costes"

  ],

  "business_rules": [

    "Regla 1: Las Dimensiones Múltiples permiten generar hasta 5 vistas analíticas ortogonales e independientes sobre la misma transacción contable.",

    "Regla 2: Cada Centro de Coste (OPRC) y cada Norma de Reparto (ODRF) pertenece obligatoriamente a una única dimensión analítica.",

    "Regla 3: En el Plan de Cuentas, una cuenta contable de Pérdidas y Ganancias puede enlazarse simultáneamente a 5 normas de reparto activas (una por cada dimensión).",

    "Regla 4: Al contabilizar un gasto o ingreso, el sistema asigna el 100% del importe en paralelo a cada una de las dimensiones configuradas.",

    "Regla 5: Las jerarquías de centros de coste admiten hasta 3 niveles de profundidad; los centros de coste individuales solo pueden situarse en los nodos terminales (inferiores).",

    "Regla 6: La visualización de dimensiones en documentos puede configurarse en columna única separada por punto y coma (;) o en columnas independientes por dimensión."

  ],

  "reporting_objects": [

    "Pérdidas y Ganancias por Dimensión",

    "Balance de Sumas y Saldos por Norma de Reparto",

    "Informe de Resumen de Contabilidad de Costes estructurado por Jerarquía",

    "Informe de Distribución Multidimensional"

  ]

}


Desarrollo Conceptual y Funcional Exhaustivo
1. Concepto y Necesidad de Dimensiones Múltiples
En organizaciones de mediana y gran complejidad, analizar los resultados financieros bajo un único criterio (por ejemplo, únicamente por departamentos) resulta insuficiente. Una empresa puede necesitar evaluar:

Dimensión 1: Estructura Departamental (Ventas, Soporte, Desarrollo, Administración).
Dimensión 2: Línea de Negocio / Productos (Hardware, Software, Servicios Cloud).
Dimensión 3: Región Geográfica / Sucursal (Norte, Centro, Sur, Exportaciones).
Dimensión 4: Canal de Distribución (Retail, Mayorista, E-Commerce).
Dimensión 5: Unidad de Negocio Estratégica o Proyectos Corporativos.

SAP Business One permite activar hasta 5 dimensiones independientes, garantizando que un único asiento contable o factura se analice desde 5 perspectivas simultáneas sin duplicar transacciones ni requerir conciliaciones manuales.
2. Activación y Parametrización en el Sistema
Habilitación en Parametrizaciones Generales:
Ruta: Gestión -> Inicialización del sistema -> Parametrizaciones generales -> Ficha Contabilidad de costes.
Se marca la casilla: Utilizar dimensiones múltiples.
Se define la visualización en documentos de marketing y asientos:
Columna única: Todas las normas activas se muestran en un solo campo concatenadas por punto y coma (ej. VENTAS;HW;NORTE).
Columnas separadas: Cada dimensión dispone de su propia columna en la grilla (Norma de reparto 1, Norma de reparto 2, etc.).
Definición de Dimensiones (ODIM):
Ruta: Finanzas -> Contabilidad de costes -> Dimensiones.
Se asignan descripciones claras (ej. Dimensión 1 = Departamentos, Dimensión 2 = Líneas de Negocio).
Se activan las dimensiones necesarias (de 1 a 5).
Pertenencia Unidimensional:
Cada centro de coste (OPRC) y cada norma de reparto (ODRF) se asigna obligatoriamente a una sola dimensión. No existen centros de coste compartidos entre dimensiones.
3. Mecánica de Imputación Paralela Ortogonal
Cuando una cuenta de gastos (ejemplo: 610020 - Consumo Eléctrico) se vincula a múltiples dimensiones en el Plan de Cuentas:

Se enlaza una norma de reparto específica para la Dimensión 1 (ej. NR_AREA_DEP, distribuida por m² de cada departamento).
Se enlaza una norma de reparto específica para la Dimensión 2 (ej. NR_EMP_LOB, distribuida por número de empleados de cada línea de negocio).

Al contabilizar una factura de proveedores por $2,000 USD:

Dimensión 1: Los $2,000 USD se dividen entre Ventas ($400), Soporte ($800) y Desarrollo ($800).
Dimensión 2: Los mismos $2,000 USD se dividen en paralelo entre Hardware ($1,200) y Aplicaciones ($800).
Resultado: Cada dimensión absorbe el 100% del costo ($2,000 USD en Dimensión 1 y $2,000 USD en Dimensión 2). No se fragmenta el valor total entre dimensiones, sino que se proyecta en vistas analíticas ortogonales.
4. Modelos de Jerarquía de Centros de Coste (OCCH / CCH1)
Para la presentación de reportes ejecutivos, SAP B1 permite diseñar estructuras jerárquicas multinivel:

Profundidad: Hasta 3 niveles jerárquicos (Nivel 1: Categoría Superior, Nivel 2: Subcategoría, Nivel 3: Centros de Coste).
Regla Estructural: Los centros de coste individuales solo pueden situarse en los nodos terminales (hojas de la jerarquía).
Agregaciones y Fórmulas: Permite agrupar centros afines (ej. agrupar CC_VENTAS y CC_SOPORTE bajo el rubro Atención al Cliente con subtotales automáticos o fórmulas algebraicas).
Multi-modelo: Para una misma dimensión se pueden crear múltiples modelos de jerarquía según el informe requerido (ej. Jerarquía Operativa vs. Jerarquía Financiera).


Caso de Negocio Resuelto en OEC Computers
Contexto y Requerimiento
OEC Computers comercializa hardware y software empresarial. La gerencia general y el contador debaten la mejor forma de auditar los resultados:

El contador necesita ver la rentabilidad por Departamentos (Ventas, Soporte, Desarrollo).
El director comercial necesita ver la rentabilidad por Línea de Negocio (Hardware vs. Aplicaciones).
Solución con Dimensiones Múltiples
Se activa Utilizar dimensiones múltiples.
Se definen las dimensiones:
Dimensión 1 (Departamentos): Centros VENTAS, SOPORTE, DESARROLLO.
Dimensión 2 (Línea de Negocio - LOB): Centros HARDWARE, APLICACIONES.
Cuenta 610020 - Consumo Eléctrico ($2,000 USD):
Dimensión 1 (NR_AREA): Ventas 20% ($400), Soporte 40% ($800), Desarrollo 40% ($800).
Dimensión 2 (NR_PERSONAL): Hardware 60% ($1,200), Aplicaciones 40% ($800).
Emisión de Informes:
En Finanzas -> Contabilidad de costes -> Informe de centro de coste, el contador filtra por Dimensión 1 y analiza el gasto por departamento.
El director comercial filtra el mismo informe por Dimensión 2 y obtiene la rentabilidad neta de la línea de Hardware frente a Aplicaciones. Ambos obtienen la información requerida sin discrepancias contables.


Banco de Evaluación Situacional
Pregunta 1
¿Cuántas dimensiones independientes pueden definirse en SAP Business One 10.0 para el análisis de contabilidad de costes? A) 2 dimensiones.
B) Hasta 3 dimensiones.
C) Hasta 5 dimensiones.
D) Ilimitadas dimensiones mediante UDFs.

Respuesta Correcta: C
Justificación Técnica: SAP Business One permite activar hasta un máximo de 5 dimensiones analíticas (ODIM), cada una gestionando sus propios centros de coste (OPRC) y normas de reparto (ODRF).
Pregunta 2
Al imputar una factura de gastos de $1,000 USD en una cuenta que tiene asignadas normas de reparto en la Dimensión 1 (Departamentos) y Dimensión 2 (Líneas de Negocio), ¿cuál es el importe total distribuido en cada dimensión? A) $500 USD a la Dimensión 1 y $500 USD a la Dimensión 2.
B) $1,000 USD se distribuyen en la Dimensión 1 y, paralelamente, los mismos $1,000 USD se distribuyen en la Dimensión 2.
C) Solo se distribuye en la Dimensión 1, ya que la Dimensión 2 requiere una transacción manual de ajuste.
D) El sistema divide el importe proporcionalmente al número de centros de coste existentes en ambas dimensiones.

Respuesta Correcta: B
Justificación Técnica: Las dimensiones en SAP B1 funcionan de manera ortogonal y paralela: cada dimensión activa analiza el 100% del importe de la transacción bajo sus propias normas de distribución.
Pregunta 3
¿Cuál es una regla estructural obligatoria al diseñar una Jerarquía de Centros de Coste en SAP Business One? A) Se pueden definir hasta 10 niveles jerárquicos de centros de coste.
B) Los centros de coste individuales solo pueden colocarse en los nodos inferiores (terminales) de la jerarquía, con un máximo de 3 niveles.
C) Una misma jerarquía puede combinar centros de coste pertenecientes a diferentes dimensiones.
D) No es posible utilizar subtotales ni fórmulas matemáticas en los nodos.

Respuesta Correcta: B
Justificación Técnica: Las jerarquías de centros de coste (OCCH/CCH1) soportan hasta 3 niveles de profundidad, están restringidas estrictamente a una única dimensión y exigen que los centros de coste activos se sitúen exclusivamente en el nivel terminal inferior.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
