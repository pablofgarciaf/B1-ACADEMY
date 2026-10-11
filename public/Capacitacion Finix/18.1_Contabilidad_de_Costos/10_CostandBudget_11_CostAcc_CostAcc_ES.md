DOC_103: Contabilidad de Costes, Centros de Coste y Normas de Reparto en SAP Business One 10.0
Metadatos Técnicos
Módulo SAP: Contabilidad de Costes y Finanzas (Cost Accounting & Financials)
Código de Documento: DOC_103_CostandBudget_CostAcc
Archivo Fuente Analizado: 10_CostandBudget_11_CostAcc_CostAcc_ES.pdf (File ID: 1_CDF-CEDSK7k79OynIJZxOM9xRYnrAHU)
Audiencia Objetivo: Consultores Financieros, Controladores de Gestión, Contadores de Costos y Agentes Autónomos de IA / Antigravity
Prerrequisitos: Plan de Cuentas (OACT), Asientos Contables (OJDT/JDT1), Cuentas de Pérdidas y Ganancias (Ventas y Gastos)


JSON Antigravity Master Schema
{

  "antigravity_schema_version": "2.0_Master",

  "document_id": "DOC_103_CostandBudget_CostAcc",

  "sap_module": "Financials - Cost Accounting",

  "db_tables": {

    "header_tables": [

      {

        "table_name": "OPRC",

        "description": "Centros de Coste / Centros de Beneficio (Cost Centers / Profit Centers)",

        "primary_key": "PrcCode"

      },

      {

        "table_name": "ODRF",

        "description": "Normas de Reparto / Reglas de Distribución (Distribution Rules)",

        "primary_key": "OcrCode"

      }

    ],

    "line_tables": [

      {

        "table_name": "DRF1",

        "description": "Líneas de la Norma de Reparto: asignación de porcentajes o importes por centro de coste",

        "foreign_keys": ["OcrCode", "PrcCode"]

      },

      {

        "table_name": "JDT1",

        "description": "Líneas de Asiento Contable con campos de imputación OcrCode, OcrCode2, etc.",

        "foreign_keys": ["TransId", "Line_ID"]

      }

    ],

    "system_cost_centers": [

      {

        "code": "Center_z",

        "description": "Centro de Coste Cero: absorbe importes no asignados, gastos no deducibles o remanentes de normas fijas"

      }

    ]

  },

  "menu_paths": [

    "Finanzas -> Contabilidad de costes -> Centros de coste",

    "Finanzas -> Contabilidad de costes -> Normas de reparto",

    "Finanzas -> Contabilidad de costes -> Tabla de centros de coste y normas de reparto",

    "Finanzas -> Plan de cuentas (Botón Detalles de cuenta -> Norma de reparto)",

    "Finanzas -> Informes financieros -> Informes de contabilidad de costes"

  ],

  "business_rules": [

    "Regla 1: Solo las cuentas de mayor de tipo Ventas (Ingresos) o Gastos en el Plan de Cuentas pueden enlazarse a Normas de Reparto.",

    "Regla 2: Al crear un Centro de Coste en OPRC, SAP B1 genera automáticamente una Norma de Reparto directa e inmutable en ODRF con el mismo código y asignación del 100%.",

    "Regla 3: Si una norma de reparto no asigna el 100% del importe, o si existen discrepancias en normas de importe fijo sin un centro comodín, la diferencia se asigna automáticamente al centro cero (Center_z).",

    "Regla 4: La norma de reparto asignada en una línea de documento de marketing o en el asiento manual tiene precedencia absoluta sobre la norma vinculada por defecto en la cuenta de mayor.",

    "Regla 5: Las normas de reparto manuales definidas directamente en la línea de un asiento no se guardan como plantillas reutilizables en ODRF."

  ],

  "reporting_objects": [

    "Informe de Centro de Coste",

    "Informe de Distribución",

    "Informe de Resumen de Contabilidad de Costes",

    "Pérdidas y Ganancias por Centro de Coste"

  ]

}


Desarrollo Conceptual y Funcional Exhaustivo
1. Propósito de la Contabilidad de Costes en SAP Business One
La contabilidad financiera tradicional refleja las transacciones de la empresa hacia entes externos y autoridades tributarias mediante el Balance General y el Estado de Resultados consolidado. Sin embargo, la gerencia requiere evaluar la rentabilidad interna por unidades de negocio, sucursales o departamentos.

La Contabilidad de Costes permite:

Consolidar Gastos e Ingresos: Desglosar cada partida de pérdidas y ganancias entre las distintas unidades operativas.
Medir Rendimiento Operativo: Generar Estados de Pérdidas y Ganancias independientes por cada Centro de Coste.
Prorratear Gastos Indirectos: Distribuir costos compartidos (alquiler, energía, servicios centrales, catering) mediante criterios objetivos (superficie en m², número de colaboradores, consumo horario).
2. Centros de Coste (OPRC) y el Centro Cero (Center_z)
Definición: Un Centro de Coste es una unidad organizativa de la empresa (departamento, sucursal, proyecto o línea operativa) donde se originan costos e ingresos.
Agrupamiento: Los centros de coste se organizan mediante Códigos de Clasificación para facilitar su presentación en reportes analíticos.
El Centro Cero (Center_z): Creado automáticamente por el sistema durante la inicialización. Cumple una función de control vital:
Registra costos o ingresos que no pueden ser asignados a un centro productivo debido a falta de información en el momento del registro.
Absorbe gastos que la empresa decide no imputar a la gestión operativa interna (por ejemplo, el 20% no deducible de un canon de arrendamiento o gastos corporativos extraordinarios).
3. Normas de Reparto (ODRF / DRF1): Directas vs. Indirectas
Una Norma de Reparto es la regla matemática que define cómo se distribuyen los importes contabilizados en una cuenta de mayor entre uno o más centros de coste:
A. Normas de Reparto Directas
Se generan automáticamente al dar de alta un Centro de Coste en OPRC.
Tienen el mismo código del centro de coste, son de solo lectura y asignan el 100% del valor imputado de forma exclusiva a dicho centro.
Se utilizan para gastos e ingresos directamente identificables (ejemplo: gastos de combustible de vehículos asignados exclusivamente a la fuerza de ventas).
B. Normas de Reparto Indirectas
Creadas manualmente por el usuario en Finanzas -> Contabilidad de costes -> Normas de reparto.
Permiten distribuir un importe entre múltiples centros de coste mediante:
Porcentajes: Asignación proporcional (ej. 50% Ventas, 30% Soporte, 20% Desarrollo).
Ratios o Unidades Físicas: Valores absolutos que el sistema pondera automáticamente (ej. 100 m² Ventas, 200 m² Soporte, 200 m² Desarrollo sobre un total de 500 m²).
Si los factores no completan la base total, el remanente no asignado se deriva a Center_z.
C. Normas de Reparto por Importe Fijo
Permiten estipular un monto monetario fijo para determinados centros de coste (ejemplo: Soporte $3,000 USD y Desarrollo $3,000 USD).
Si el costo real del mes difiere de la suma de los importes fijos ($6,000 USD):
Si se incluye un centro de coste sin importe definido (comodín), este centro absorbe íntegramente la variación (positiva o negativa).
Si todos los centros tienen importe fijo y no hay comodín, cualquier diferencia respecto a la factura real se envía automáticamente a Center_z.
D. Normas de Reparto Manuales en Asientos
En un Asiento Manual (OJDT), el usuario puede pulsar sobre el campo de norma de reparto y seleccionar Definir norma de reparto manual.
Permite prorratear el importe de la línea puntualmente entre centros de coste para esa transacción específica, sin guardarse como norma permanente en ODRF.
4. Enlace entre Libro Mayor y Contabilidad de Costes
Configuración en el Plan de Cuentas (OACT):
En Finanzas -> Plan de cuentas, al seleccionar una cuenta de tipo Ventas o Gastos, se presiona el botón Detalles de cuenta.
Se marca la casilla de selección de contabilidad de costes y se selecciona la Norma de Reparto por defecto.
Ejecución Operativa:
Cada vez que se genera una factura de clientes, factura de proveedores o asiento contable que impute a dicha cuenta, el importe se transfiere automáticamente a los centros de coste según la norma enlazada.
Jerarquía de Precedencia:
Nivel 1 (Mayor prioridad): Norma modificada manualmente en el Asiento Contable (JDT1.OcrCode).
Nivel 2: Norma especificada en la línea del Documento de Marketing (INV1.OcrCode / PCH1.OcrCode).
Nivel 3 (Menor prioridad / Por defecto): Norma configurada en los Detalles de la Cuenta de Mayor (OACT.LocManStg).


Caso de Negocio Resuelto en OEC Computers
Escenario Operativo
OEC Computers implementa la contabilidad de costes para evaluar el rendimiento de sus tres departamentos principales:

Centro 1 (CC_VENTAS): Ventas (Personal comercial y vehículos corporativos).
Centro 2 (CC_SOPORTE): Soporte al Cliente (Mesa de ayuda y técnicos de campo).
Centro 3 (CC_DEV): Desarrollo e Innovación (Ingenieros de software).
Configuración e Imputación Transaccional
Gastos Directos de Vehículos:
Cuenta Contable: 610010 - Gastos de Vehículos.
Enlace: Norma Directa CC_VENTAS (100%).
Al registrar la Factura de Proveedor por mantenimiento vehicular de $1,000 USD, el 100% impacta directamente a CC_VENTAS.
Gastos Indirectos de Arriendo y Electricidad por Área:
Cuenta Contable: 610020 - Consumo Eléctrico y Servicios Básicos.
Norma de Reparto: NR_AREA con base en 500 m²:
CC_VENTAS: 100 m² (20% = $400 USD de una factura de $2,000 USD).
CC_SOPORTE: 200 m² (40% = $800 USD).
CC_DEV: 200 m² (40% = $800 USD).
Resultado en Informes:
En el Informe de Centro de Coste, el controlador financiero genera el Estado de Pérdidas y Ganancias del departamento de Desarrollo, verificando que absorbe $800 USD de electricidad y $0 USD de vehículos, calculando con exactitud el margen operativo neto del departamento.


Banco de Evaluación Situacional
Pregunta 1
¿Qué ocurre en SAP Business One cuando un usuario crea un nuevo Centro de Coste en la ventana de definición de centros de coste? A) El usuario debe crear manualmente una norma de reparto en una ventana separada antes de poder usarlo.
B) El sistema crea automáticamente una norma de reparto con el mismo nombre y código que asigna el 100% del valor a dicho centro de coste de forma directa.
C) El sistema solicita la vinculación inmediata de al menos 5 cuentas contables del balance.
D) El centro de coste queda inactivo hasta que se apruebe mediante un procedimiento de autorización.

Respuesta Correcta: B
Justificación Técnica: En SAP B1, cada vez que se da de alta un centro de coste en OPRC, el motor genera de manera intrínseca e inmutable una norma de reparto directa homónima en ODRF, con factor 100 y de solo lectura.
Pregunta 2
Al configurar una norma de reparto con importes fijos para los centros de coste de Soporte ($2,000 USD) y Desarrollo ($3,000 USD), se emite una factura por $6,000 USD sin haber definido un centro comodín que absorba diferencias. ¿Cómo distribuye el sistema la diferencia de $1,000 USD? A) El sistema bloquea el documento comercial con un error de descuadre contable.
B) Los $1,000 USD se prorratean en partes iguales entre Soporte y Desarrollo.
C) La diferencia de $1,000 USD se asigna automáticamente al centro de coste cero (Center_z).
D) La diferencia se envía a la cuenta de diferencias de cambio en el libro mayor.

Respuesta Correcta: C
Justificación Técnica: Cuando una norma de importe fijo genera desviaciones (positivas o negativas) frente al importe del documento y no existe un centro de coste sin importe fijado para absorber el remanente, el sistema transfiere obligatoriamente el saldo no asignado a Center_z.
Pregunta 3
Si una cuenta contable tiene asignada la norma de reparto 'NR_GENERAL' en el Plan de Cuentas, pero en la línea de la Factura de Clientes el vendedor selecciona 'NR_VENTAS', ¿cuál es el resultado de la contabilización? A) Prevalece la norma del Plan de Cuentas porque es la definición financiera base.
B) Prevalece la norma ingresada en el documento de marketing ('NR_VENTAS'), la cual sobrescribe a la del Plan de Cuentas.
C) El sistema genera dos asientos simultáneos dividiendo el 50% en cada norma.
D) El sistema emite una alerta y rechaza la transacción por conflicto de imputación.

Respuesta Correcta: B
Justificación Técnica: La jerarquía de imputación de contabilidad de costes en SAP B1 establece que la norma ingresada a nivel de documento de marketing o asiento contable manual tiene prioridad absoluta sobre la norma parametrizada por defecto en la ficha de la cuenta de mayor.