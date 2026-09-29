# Guion de Video: DOC 076 Production Accounting

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 076 Production Accounting.

## Contenido Principal (Visual: Diapositivas correspondientes)
Unidad 076: Contabilidad del Proceso de Producción en SAP Business One 10.0
Metadatos Técnicos
Módulo: Producción y MRP (Production & MRP)
Código de Documento: DOC_076_Production_Accounting
Audiencia Objetivo: Consultores Financieros y de Producción, Contadores Generales, Auditores de Costos de Manufactura y Jefes de Planta.
Prerrequisitos: Gestión de inventario continuo (Perpetual Inventory), Métodos de valoración de inventario (Media Variable, FIFO, Estándar), Estructura de Lista de Materiales (BOM) y Orden de Fabricación estándar.
Versión SAP B1: SAP Business One 10.0 FP 2008 / HANA & SQL.


JSON Antigravity Master Schema
{

  "unit_id": "076",

  "document_code": "DOC_076_Production_Accounting",

  "topic": "Production Process Accounting and Perpetual Inventory Postings",

  "module": "Production",

  "version": "10.0",

  "data_architecture": {

    "primary_tables": [

      {

        "table_name": "OWOR",

        "description": "Production Order Header (Estado, Producto Padre, Costos Reales, Variaciones)",

        "key_fields": ["DocEntry", "DocNum", "Status", "ItemCode", "PlannedQty", "CmpltQty", "RjctQty"]

      },

      {

        "table_name": "WOR1",

        "description": "Production Order Component Lines (Artículos, Recursos, Tipos de Emisión, Cuentas WIP)",

        "key_fields": ["DocEntry", "LineNum", "ItemType", "ItemCode", "PlannedQty", "IssuedQty", "WipActCode"]

      },

      {

        "table_name": "OIGE / IGE1",

        "description": "Goods Issue (Emisión para Producción manual o backflush)",

        "key_fields": ["DocEntry", "DocNum", "BaseEntry", "BaseLine", "ItemCode", "Quantity", "Price", "AcctCode"]

      },

      {

        "table_name": "OIGN / IGN1",

        "description": "Goods Receipt (Recibo de Producción del Producto Terminado o Subproductos)",

        "key_fields": ["DocEntry", "DocNum", "BaseEntry", "BaseLine", "ItemCode", "Quantity", "Price", "AcctCode"]

      },

      {

        "table_name": "OJDT / JDT1",

        "description": "Journal Entry and Lines (Asientos contables automáticos de emisión, recibo y cierre de orden)",

        "key_fields": ["TransId", "BaseRef", "TransType", "Account", "Debit", "Credit", "DueDate"]

      },

      {

        "table_name": "OINM",

        "description": "Warehouse Journal / Stock Audit Report (Kardex financiero y físico de movimientos)",

        "key_fields": ["TransSeq", "ItemCode", "Warehouse", "TransType", "BASE_REF", "DocLineNum", "CalcPrice"]

      }

    ],

    "menu_navigation_paths": [

      "Producción -> Orden de fabricación (Ficha Resumen y Ficha Finanzas)",

      "Producción -> Emisión para producción",

      "Producción -> Recibo de producción",

      "Gestión -> Inicialización del sistema -> Parametrizaciones de documento -> Ficha Por documento -> Orden de fabricación",

      "Gestión -> Definición -> Finanzas -> Determinación de cuentas de mayor -> Ficha Inventario -> Subficha Trabajo en Proceso (WIP)"

    ],

    "business_rules": [

      {

        "rule_id": "BR_PRD_01",

        "name": "WIP Account Zero Balancing at Closing",

        "description": "Al cambiar el estatus de la Orden de Fabricación a 'Cerrado' (Closed), el sistema debe liquidar y saldar a cero cualquier saldo residual existente en la cuenta de Trabajo en Proceso (WIP)."

      },

      {

        "rule_id": "BR_PRD_02",

        "name": "Variance Revaluation Priority",

        "description": "Si al cerrar la orden existe una variación de costo entre insumos consumidos y producto recibido, y el producto terminado permanece aún en stock en el almacén de recibo, la variación se imputa contra la cuenta de existencias del producto terminado. Si el producto ya fue despachado o consumido, la diferencia se envía a la Cuenta de Desviación de Inventario WIP (Pérdidas y Ganancias)."

      },

      {

        "rule_id": "BR_PRD_03",

        "name": "WIP Derivation Configuration",

        "description": "En Parametrizaciones de Documento para Órdenes de Fabricación se define si las transacciones de emisión de componentes toman la cuenta WIP definida en los datos maestros del componente o la cuenta WIP del producto padre."

      }

    ]

  }

}


Desarrollo Conceptual y Funcional Detallado
1. El Flujo Contable en Empresas con Inventario Continuo (Perpetual Inventory)
En SAP Business One, cuando una empresa opera con inventario permanente, cada transacción del módulo de Producción genera asientos en el libro mayor (OJDT) en tiempo real, transformando el valor monetario de las materias primas e insumos en producto terminado a través de cuentas puente de balance denominadas Cuentas de Trabajo en Proceso (WIP - Work in Process).

El ciclo contable estándar consta de tres eventos fundamentales:

[1. Emisión para Producción]

   Debe: Cuenta de Inventario WIP (Componentes)

   Debe: Cuenta de Recurso WIP

      Haber: Cuenta de Existencias / Inventario (Materias Primas)

      Haber: Cuenta de Absorción / Gasto de Recursos (Mano de Obra / Maquinaria)

[2. Recibo de Producción]

   Debe: Cuenta de Existencias / Inventario (Producto Terminado)

      Haber: Cuenta de Inventario WIP (Producto Terminado)

[3. Cierre de la Orden de Fabricación]

   Ajuste y balanceo a cero de saldos residuales en Cuentas WIP:

   Debe/Haber: Cuenta de Inventario WIP (Saldo residual)

   Debe/Haber: Cuenta de Desviación WIP (P&L) o Cuenta de Existencias (Revalorización de Activo)


2. Contabilización Detallada por Etapa Transaccional
A. Emisión de Componentes (Issue for Production - OIGE)
Cuando los componentes son retirados del almacén para su transformación (ya sea mediante emisión manual o por notificación automática Backflush):

Materiales de Inventario:
Débito: Cuenta de Inventario WIP (WipActCode). Refleja la capitalización transitoria del inventario en proceso dentro del balance general.
Crédito: Cuenta de Existencias de Materias Primas (InvntAct). Descuenta el costo del kardex (OINM) del almacén de origen según el método de valoración asignado (Media Variable, FIFO o Costo Estándar).
Recursos de Manufactura (Máquinas / Operarios):
Débito: Cuenta de Recursos WIP (WipRscAct). Registra la absorción de costo de maquinaria o mano de obra aplicada al proceso.
Crédito: Cuenta de Gastos / Costos de Recursos (RscExpAct). Actúa como contracuenta de absorción frente a los gastos reales de nómina o amortizaciones registrados en finanzas.
B. Recibo del Producto Terminado (Receipt from Production - OIGN)
Al ingresar los artículos terminados al almacén:

Débito: Cuenta de Existencias del Producto Terminado (InvntAct). Incrementa el valor y la cantidad física del producto en el almacén de destino.
Crédito: Cuenta de Inventario WIP del Producto Padre (WipActCode). Descarga el costo estimado o acumulado transferido al producto terminado.
C. Cierre de la Orden de Fabricación (Production Order Closing)
El cierre formal de la orden es el hito de control financiero donde se calculan las Desviaciones de Producción (Production Variances).

Si la suma de débitos a las cuentas WIP (insumos reales + recursos consumidos) es idéntica a los créditos (valor recibido de producto terminado), el saldo neto en WIP es 0.00. El sistema genera un asiento técnico que cancela las cuentas WIP contra la cuenta de desviación si se usan cuentas contables diferenciadas entre componentes y padre.
Si existe una desviación de costos (por ejemplo, variación en el precio de los componentes entre la emisión y el recibo, consumo de insumos mayor al planificado, o rechazo de unidades terminadas):
El sistema salda a cero las cuentas WIP.
La diferencia neta se absorbe de acuerdo con la disponibilidad de existencias del producto padre:
Si el producto terminado sigue en stock: El sistema ajusta el valor unitario y total de las existencias del producto terminado debitando o acreditando la Cuenta de Existencias contra la Cuenta de Desviación de Inventario WIP.
Si el producto terminado ya se vendió o consumió: La variación total se envía directamente a la Cuenta de Desviación de Inventario WIP en el Estado de Resultados (Pérdidas y Ganancias).


3. Cuentas WIP de Contrapartida en Pérdidas y Ganancias (P&L Offset Accounts)
En ciertas legislaciones europeas (tales como República Checa, Eslovaquia y Hungría) o por políticas corporativas de contabilidad analítica, se requiere que los movimientos de producción reflejen un impacto transitorio en cuentas de resultados (P&L) en lugar de una transferencia estrictamente patrimonial dentro del balance.

SAP Business One permite activar las cuentas intermedias:

Cuenta de contrapartida de inventario en P&L (Inventory Offset P&L Account).
Cuenta de contrapartida de WIP en P&L (WIP Offset P&L Account).

Cuando están habilitadas, la emisión y el recibo de producción generan asientos desglosados en 4 líneas, donde la salida de existencias se refleja como una variación de inventario en resultados y se compensa con el débito en WIP.


4. Ficha Resumen de la Orden de Fabricación e Informe de Desviaciones
En la cabecera y cuerpo de la Orden de Fabricación (OWOR), la ficha Resumen expone la matriz financiera de control:

Costo Real de Componentes de Artículo (Actual Item Component Cost): Total monetario acumulado de todas las emisiones de materiales (OIGE).
Costo Real de Componentes de Recursos (Actual Resource Component Cost): Total acumulado del costo de máquinas y operarios imputados a la orden.
Costo Adicional Real (Actual Additional Cost): Costos de artículos no inventariables (servicios externos, fletes directos de ensamble).
Costo Real del Producto (Actual Product Cost): Valor total al que fue recibido el producto terminado en las entradas de producción (OIGN).
Costo Real de Subproductos (Actual By-Product Cost): Valor de subproductos recuperados que reducen el costo neto de la orden.
Desviación Total (Total Variance): Cálculo formal: $$\text{Desviación Total} = (\text{Costo Real de Componentes} + \text{Costo Real de Recursos} + \text{Costo Adicional}) - \text{Costo Real de Productos} - \text{Costo Subproductos}$$

Haciendo clic en la flecha de enlace del campo Desviación Total, SAP B1 abre el Informe de Desviaciones (Variance Report), desglosando línea por línea la cantidad planificada, cantidad real, costo medio y la línea especial de Revalorización del Producto (Product Revaluation) generada en el asiento de cierre.


Caso de Negocio Resuelto: OC WoodTrend / OEC Computers
Contexto Empresarial
OC WoodTrend fabrica puertas de madera decorativas personalizadas (D00002) empleando inventario continuo valorado por el método de Media Ponderada Variable (Moving Average).
Estructura de la Orden de Fabricación
Producto Terminado: 10 Puertas de Madera Decorativas (D00002). Costo estimado inicial: $150.00 c/u.
Componentes Planificados:
10 Planchas de madera (W100): Costo en kardex = $50.00 c/u. Total = $500.00.
20 Manijas de acero (H200): Costo en kardex = $10.00 c/u. Total = $200.00.
20 Horas de Torno (R_LATHE): Tarifa horaria = $20.00/hr. Total = $400.00.
Costo Total Insumos Planificados: $500 + $200 + $400 = $1,100.00 ($110.00 por puerta).
Ejecución Operativa y Desviación de Producción
Emisión de Materiales: Se emiten los 10 paneles ($500), 20 manijas ($200) y 20 horas de torno ($400).
Total cargado en Debe a Cuentas WIP = $1,100.00.
Incidencia en Planta: Durante el ensamblaje, 1 puerta sufre un daño estructural irreparable y es rechazada.
Recibo de Producción: Se efectúa el recibo de solo 9 puertas terminadas a un costo provisional unitario de $110.00.
Total acreditado a Cuenta WIP del producto terminado = $990.00 ($110 × 9).
Estado Previo al Cierre:
Debe en Cuentas WIP: $1,100.00.
Haber en Cuentas WIP: $990.00.
Saldo deudor residual en WIP: $110.00.
Cierre de la Orden:
El sistema detecta que las 9 puertas permanecen en el almacén 01.
Se ejecuta el asiento de cierre que salda las cuentas WIP por $1,100 y $990 respectivamente, y genera una línea de ajuste que debe la Cuenta de Existencias de la puerta decorativa por $110.00 contra la Cuenta de Desviación de Inventario WIP.
Resultado en inventario: Las 9 puertas absorben el costo total del lote insumido ($1,100.00), ajustando su costo unitario real a $122.22 c/u ($1,100 / 9), manteniendo la estricta cuadratura contable y patrimonial.


Banco de Evaluación Situacional
Pregunta 1
En una empresa gestionada con inventario continuo, se emiten materias primas para una orden de fabricación por un valor de $5,000 USD y se consumen recursos por $1,200 USD. Posteriormente se recibe la totalidad de los productos terminados por un valor provisional de $6,200 USD. ¿Qué asiento contable generará el sistema al cambiar el estatus de la orden a 'Cerrado' si no hubo variaciones de costo ni mermas?

A) Ninguno, porque el estatus cerrado no genera asientos si la orden fue completada al 100%.
B) Un asiento que debita la cuenta de desviación de inventario WIP y acredita la cuenta de existencias por $6,200 USD.
C) Un asiento contable que salda a cero las cuentas de inventario WIP de componentes y recursos contra la cuenta WIP del producto terminado por los importes debitados y acreditados previamente.
D) Un asiento que cancela el documento preliminar de la orden de fabricación y revierte las emisiones.
Respuesta Correcta: C
Justificación Técnica: Cuando los costos de los insumos y los recibos coinciden con exactitud ($6,200 de emisión vs $6,200 de recibo), el sistema debe balancear las cuentas intermedias de Trabajo en Proceso (WIP). Si las cuentas de componentes, recursos y producto padre están diferenciadas en la determinación contable, se genera el asiento de cierre cruzando los débitos y créditos correspondientes para dejar las cuentas WIP con saldo estrictamente en cero.
Pregunta 2
Durante la fabricación de un lote de maquinaria, se emitieron componentes valorados en $10,000 USD. Al recibirse los productos terminados, ingresaron al almacén por $10,000 USD. Sin embargo, antes de cerrar la orden de fabricación, se realiza una emisión manual adicional de repuestos por $1,500 USD debido a un ajuste técnico. Si el lote fabricado ya fue vendido y entregado al cliente final mediante una Entrega (ODLN), ¿cómo contabiliza SAP Business One la variación de $1,500 USD al cerrar la orden?

A) Incrementa el costo en el kardex del producto terminado en el almacén generando stock negativo en valor.
B) Modifica retroactivamente el costo de ventas de la Entrega ya cerrada y recalcula el margen de la factura.
C) Envía el saldo deudor residual de $1,500 USD a la Cuenta de Desviación de Inventario WIP en el Estado de Resultados (Pérdidas y Ganancias), ya que no existen unidades en stock para revalorizar.
D) Bloquea el cierre de la orden hasta que el cliente devuelva las unidades mediante una devolución de mercancías.
Respuesta Correcta: C
Justificación Técnica: SAP Business One valida la existencia física del lote terminado en el almacén receptor. Si las unidades ya salieron del inventario (por venta o consumo), el sistema no puede revalorizar el activo en balance y automáticamente desvía la diferencia a la Cuenta de Desviación WIP (WIP Inventory Variance Account), reflejando la pérdida por sobrecosto en el estado de resultados del período corriente.
Pregunta 3
¿Dónde se parametriza en SAP Business One 10.0 si las emisiones de materiales deben utilizar la cuenta de Trabajo en Proceso (WIP) asignada al componente o la cuenta WIP asignada al producto padre terminado?

A) En la ficha Finanzas del Dato Maestro del Artículo de cada componente.
B) En Parametrizaciones de documento -> ficha Por documento -> Orden de fabricación.
C) En el registro maestro de la Lista de Materiales (BOM) en el menú Producción.
D) En el asistente de determinación avanzada de cuentas de mayor exclusivamente.
Respuesta Correcta: B
Justificación Técnica: En Gestión -> Inicialización del sistema -> Parametrizaciones de documento -> Ficha Por documento -> Orden de fabricación, existe la casilla específica que permite configurar si las transacciones de los componentes emplean la cuenta WIP definida en los maestros de los componentes o heredan la cuenta WIP configurada para el producto terminado (padre).

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
