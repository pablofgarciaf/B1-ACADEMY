# Guion de Video: DOC 008 BinLoc Allocation Process

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 008 BinLoc Allocation Process.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 008: PROCESOS OPERATIVOS DE ASIGNACIÓN EN UBICACIONES (SAP BUSINESS ONE 10.0)
Código de Manual: 10_BinLoc_13_Process_Process
Módulo Oficial: Inventario / Ubicaciones (Bin Locations - Allocation)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Logísticos, Operadores de Almacén, Diseñadores de Procesos y Agentes IA (Antigravity)
Carpeta Asociada: 008_10_BinLoc_13_Process_Process


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "008",

  "topic": "Bin Location Allocation Processes (Inbound & Outbound Logistics)",

  "sap_module": "Inventory_WMS_Allocation",

  "transactional_documents": {

    "inbound": [

      { "doc": "Entrada de mercancías por pedido", "table": "OPDN/PDN1" },

      { "doc": "Factura de proveedores", "table": "OPCH/PCH1" },

      { "doc": "Entrada de mercancías general", "table": "OIGN/IGN1" },

      { "doc": "Recibo de producción", "table": "OIGN/IGN1" }

    ],

    "outbound": [

      { "doc": "Entrega de ventas", "table": "ODLN/DLN1" },

      { "doc": "Factura de clientes", "table": "OINV/INV1" },

      { "doc": "Salida de mercancías general", "table": "OIGE/IGE1" },

      { "doc": "Emisión para producción", "table": "OIGE/IGE1" }

    ],

    "internal_transfer": {

      "header": "OWTR",

      "lines": "WTR1",

      "bin_allocation_table": "OILM / OIBQ"

    }

  },

  "allocation_shortcuts_and_rules": {

    "shortcut_fill_remaining": "CTRL + B en el campo 'Cantidad asignada' para completar el saldo pendiente de la fila",

    "mandatory_line_data": ["ItemCode", "Quantity", "WhsCode"],

    "positive_quantity_rule": "La cantidad ingresada en la ventana de asignación de ubicación es SIEMPRE un número positivo, incluso si en la línea del documento comercial la cantidad es negativa (ej. en devoluciones o notas de crédito)",

    "multistore_mixing": "Un mismo documento puede mezclar líneas de almacenes convencionales y almacenes gestionados por ubicaciones"

  },

  "outbound_methods_detail": {

    "Single_Choice": "Solo auto-asigna si existe una ÚNICA combinación posible para cubrir la cantidad. Si hay múltiples celdas opcionales, exige decisión manual del usuario.",

    "Bin_Code_Order": "Orden alfanumérico estricto del código de depósito (01-A1-S1 antes de 01-A4-S1).",

    "Alternative_Sort_Code": "Sigue la ruta física de recorrido (Ruta de Picking) configurada en el maestro de ubicación.",

    "Ascending_Quantity": "Consume primero las celdas con menor stock para vaciar ubicaciones y maximizar espacio disponible.",

    "Descending_Quantity": "Consume de la celda con mayor volumen para minimizar paradas y movimientos de montacargas.",

    "Ascending_Single_Bin_Preferred": "Busca la celda más pequeña que contenga la totalidad del pedido en un solo lote de picking.",

    "FIFO": "Consume primero la celda cuya fecha del último ingreso en stock sea la más antigua.",

    "LIFO": "Consume de la celda con ingreso más reciente."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 La Mecánica de Asignación en Línea de Documento
En SAP Business One 10.0, la asignación de ubicaciones no se realiza en la cabecera del documento, sino a nivel de cada fila transaccional:

Cuando una línea involucra un almacén gestionado por ubicaciones (OWHS.BinActivat = 'Y'), la columna Asignación de ubicación muestra una flecha de enlace amarilla.
Para habilitar la ventana de asignación es obligatorio que la fila tenga completos tres datos: Código de Artículo, Cantidad y Código de Almacén.
El usuario puede repartir la cantidad de una sola línea entre múltiples celdas físicas (por ejemplo, si un palet no cabe completo en una sola estantería).
Atajo de Productividad: Al posicionarse en la columna Cantidad asignada, presionar Ctrl + B copia automáticamente el saldo pendiente de asignar, acelerando drásticamente el trabajo del digitador.
2.2 Estrategias de Entrada: Ubicación Receptora vs Asignación Automática
Cuando entran mercancías al almacén, SAP B1 permite dos filosofías operativas:

Flujo con Ubicación Receptora (Muelle / Cuarentena):
El sistema propone asignar a una celda de muelle (ej. 01-RECEPCION).
No se asigna a estanterías definitivas hasta que el producto pasa el control de calidad.
La asignación a la ubicación receptora se activa formalmente al presionar el botón Crear del documento de compra.
Flujo de Asignación Automática Directa:
La celda se asigna antes de guardar el documento en la pantalla.
Se rige por la jerarquía de Ubicación por Defecto (Artículo -> Grupo -> Almacén) o por el criterio de Última Ubicación Utilizada.
2.3 Los 8 Métodos de Asignación de Salida (Picking y Despacho)
Para la emisión de mercancías (Ventas, Mermas o Producción), el sistema ofrece 8 algoritmos matemáticos en Parametrizaciones de Almacén:

Elección Única (Single Choice): Diseñado para control estricto. Si un operario debe despachar 3 unidades y hay una celda con 3 unidades exactas, el sistema la auto-asigna. Si hay dos celdas con 2 y 4 unidades (generando múltiples combinaciones posibles), el sistema no toma decisiones arbitrarias y obliga al operario a seleccionar manualmente de cuál estantería retirar.
Cantidad Descendente: Minimiza paradas; toma del bolsón más grande.
Cantidad Ascendente: Maximiza la compactación del almacén; vacía las posiciones marginales.
FIFO / LIFO: Controla la frescura y caducidad basándose en la fecha de la última transacción de entrada en cada celda específica.


3. ATLAS DIDÁCTICO: COMPARATIVA DE ALGORITMOS DE SALIDA


4. CASO DE NEGOCIO RESUELTO: DESPACHO CON RUTA ÓPTIMA EN OEC COMPUTERS
Escenario de Consultoría:
En el almacén de OEC Computers, George configura el algoritmo de salida para que los operarios de montacargas sigan la ruta física más corta sin cruzar pasillos innecesariamente.

Se utiliza el campo Código de clasificación alternativo (OBIN.AltSortCod) asignando numeración correlativa 00010, 00020, 00030... según el sentido del tráfico del pasillo.
Se selecciona el método de salida: Orden de código de clasificación alternativo.
Al emitirse una entrega de 50 teclados, el sistema genera la lista de picking ordenada estrictamente por el código alternativo, reduciendo el tiempo de recorrido en un 35%.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Al registrar una devolución de mercancías de un cliente mediante un documento comercial con cantidad negativa (-5 unidades), ¿cómo se introduce la cantidad en la ventana de asignación de ubicación de SAP Business One?
A) Como un número negativo (-5).
B) Como un número positivo (5).
C) El sistema bloquea las cantidades negativas en almacenes con ubicaciones.
D) Se debe ingresar una nota de crédito manual previa.
Respuesta Correcta: B
Justificación Técnica: En las ventanas modales de asignación de ubicación en SAP Business One, la cantidad asignada es siempre un valor absoluto positivo; el sentido del movimiento (entrada o salida de stock) lo determina el signo y la naturaleza del documento base.
Pregunta 2
¿Qué atajo de teclado permite al operario asignar instantáneamente el saldo pendiente total de una fila en la ventana de Asignación de Ubicación?
A) Ctrl + S
B) Ctrl + B
C) Alt + F4
D) Shift + Tab
Respuesta Correcta: B
Justificación Técnica: El atajo estándar en SAP Business One para completar la cantidad asignada restante con el saldo de la fila es Ctrl + B.
Pregunta 3
Si en la configuración del almacén se selecciona el método de salida "Elección Única" (Single Choice) y el sistema detecta que la cantidad solicitada puede extraerse de dos combinaciones distintas de celdas, ¿qué acción ejecuta SAP B1?
A) Cancela el pedido de cliente inmediatamente.
B) Elige la celda con la fecha más reciente sin avisar.
C) No realiza ninguna asignación automática y exige que el usuario seleccione manualmente las ubicaciones de donde extraer el inventario.
D) Envía un correo electrónico al departamento de compras.
Respuesta Correcta: C
Justificación Técnica: El método Single Choice solo actúa de forma automática cuando existe una única alternativa unívoca. Al presentarse ambigüedad, cede el control al operario para evitar asignaciones no deseadas.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
