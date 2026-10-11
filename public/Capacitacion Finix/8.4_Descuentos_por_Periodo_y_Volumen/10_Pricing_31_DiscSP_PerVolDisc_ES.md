UNIDAD 066: DETERMINACIÓN DE PRECIOS - DESCUENTOS POR PERÍODO Y CANTIDAD (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Pricing_31_DiscSP_PerVolDisc_ES
Módulo Oficial: Gestión de Precios / Ventas y Compras (Pricing & Discounts)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Comerciales, Administradores de Precios, Arquitectos de Datos y Agentes IA (Antigravity)
Carpeta Asociada: 066_10_Pricing_31_DiscSP_PerVolDisc_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "066",

  "topic": "Period and Volume Discounts",

  "sap_module": "Pricing_Discounts",

  "database_tables": {

    "price_lists": "OPLN",

    "item_prices": "ITM1",

    "period_discounts": {

      "table": "SPP1",

      "description": "Descuentos por período de validez asociados a una lista de precios y artículo",

      "key_fields": ["ItemCode", "CardCode", "PriceList", "FromDate", "ToDate", "Discount"]

    },

    "volume_discounts": {

      "table": "SPP2",

      "description": "Escalas de descuento por cantidad y unidad de medida dentro del período",

      "key_fields": ["ItemCode", "CardCode", "PriceList", "FromDate", "Amount", "Discount", "UomEntry"]

    }

  },

  "menu_paths": [

    "Inventario > Listas de precios > Precios especiales > Descuentos por período y cantidad",

    "Inventario > Listas de precios > Listas de precios"

  ],

  "pricing_hierarchy_priority": [

    { "priority": 1, "level": "Acuerdos Globales (Blanket Agreements)", "table": "OOAT/OAT1" },

    { "priority": 2, "level": "Precios Especiales para Interlocutores Comerciales", "table": "OSPP" },

    { "priority": 3, "level": "Grupos de Descuento (Discount Groups)", "table": "OEDG/EDG1" },

    { "priority": 4, "level": "Descuentos por Período y Cantidad (Period & Volume Discounts)", "table": "SPP1/SPP2" },

    { "priority": 5, "level": "Lista de Precios Base asignada al Socio de Negocios", "table": "OPLN/ITM1" }

  ],

  "business_rules": {

    "uom_matching_rule": "El descuento por cantidad solo se dispara si la Unidad de Medida (UoM) especificada en la escala coincide exactamente con la UdM de la línea del documento comercial.",

    "auto_checkbox_behavior": {

      "checked": "El precio especial o descuento se recalcula dinámicamente si el precio base en la lista de precios cambia.",

      "unchecked": "El precio acordado permanece congelado como importe fijo, protegiendo las ofertas estacionales frente a alzas de la lista base."

    },

    "multi_currency_support": "Permite fijar la fuente del descuento seleccionando entre Moneda Principal, Moneda Adicional 1 o Moneda Adicional 2 definidas en la lista de precios base."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Propósito y Posición en la Jerarquía de Precios
En un entorno corporativo dinámico, el precio estático de una lista de precios básica resulta insuficiente para gestionar campañas promocionales, temporadas comerciales o incentivos por volumen.

SAP Business One implementa los Descuentos por Período y Cantidad como una capa de personalización vinculada directamente a las Listas de Precios existentes (OPLN):

Jerarquía Estricta: Estos descuentos anulan el precio base de la lista asignada al cliente, pero son subordinados ante Precios Especiales para Socios de Negocios o Grupos de Descuento. Si un cliente tiene asignado un precio especial exclusivo en OSPP, este último prevalece sobre cualquier descuento por período general.
Estructura en Cascada de 3 Ventanas:
Descuentos por período y cantidad: Se selecciona la lista de precios, el artículo y la fuente de moneda.
Descuentos por período (SPP1): Se define la ventana temporal (Desde Fecha - Hasta Fecha), el porcentaje de descuento o el precio resultante.
Descuentos por cantidad (SPP2): Se define la escala de volumen mínimo requerido y el descuento acumulado o precio por unidad.
2.2 Gestión Multidivisa y Función de Recálculo Automático
Soporte de Monedas Múltiples: Las listas de precios en SAP B1 permiten fijar precios en moneda principal y hasta dos adicionales. Al crear el descuento, el usuario especifica qué columna monetaria actúa como base.
Casilla "Automático":
Si se mantiene marcada, si el director comercial incrementa en un 10% la lista de precios base, el precio del período con 5% de descuento se ajustará hacia arriba automáticamente conservando la tasa porcentual.
Si se desmarca, el precio especial queda congelado como valor nominal absoluto, garantizando que promociones contractuales vigentes no sufran alteraciones involuntarias.
2.3 Descuentos por Cantidad en Múltiples Unidades de Medida (Multi-UoM)
Con la arquitectura de grupos de UdM (OUGP), un mismo artículo puede comercializarse en Unidades, Paquetes, Cajas o Palets.

SAP Business One permite configurar escalas de volumen independientes para cada UdM del grupo.
Regla de Correspondencia: Para que el descuento se aplique en una Factura o Pedido de Ventas, la unidad de medida seleccionada en la línea del documento debe coincidir con la unidad configurada en la tabla SPP2.
Si una UdM es eliminada posteriormente de la definición del artículo, el sistema remueve automáticamente las líneas de descuento asociadas para evitar inconsistencias.
2.4 Asistente para Copiar Descuentos
Para evitar la parametrización repetitiva en catálogos extensos, la ventana incorpora el botón Copiar descuentos, que ofrece dos filtros avanzados de distribución:

Seleccionar artículos sin descuentos por período: Evita sobrescribir artículos que ya poseen promociones activas.
Seleccionar artículos del mismo grupo de unidades de medida: Garantiza que las escalas por volumen y conversión dimensional sean transferibles únicamente a productos con idéntica estructura de empaque.


3. ATLAS DIDÁCTICO: NAVEGACIÓN Y CONFIGURACIÓN EN CASCADA
┌────────────────────────────────────────────────────────────────────────┐

│ 1. LISTAS DE PRECIOS (OPLN)                                            │

│    • Seleccionar Lista (ej. 02 - Clientes Pequeños)                    │

│    • Seleccionar Artículo (ej. Silla Ejecutiva C1000)                  │

└───────────────────────────────────┬────────────────────────────────────┘

                                    │ Doble Clic en la fila

                                    ▼

┌────────────────────────────────────────────────────────────────────────┐

│ 2. DESCUENTOS POR PERÍODO (SPP1)                                       │

│    • Válido Desde: 01/09/2026 | Hasta: 30/09/2026                      │

│    • Descuento Base del Mes: 5.00%                                     │

│    • Casilla [ ] Automático (Desmarcada para congelar precio)          │

└───────────────────────────────────┬────────────────────────────────────┘

                                    │ Doble Clic en la fila de fecha

                                    ▼

┌────────────────────────────────────────────────────────────────────────┐

│ 3. DESCUENTOS POR CANTIDAD (SPP2)                                      │

│    • UdM: Paquete de 4 / Unidades                                      │

│    • Cantidad Mínima: 4 unidades                                       │

│    • Descuento Total: 8.00% (5% base + 3% adicional por volumen)       │

└────────────────────────────────────────────────────────────────────────┘


4. CASO DE NEGOCIO RESUELTO: CAMPAÑA DE OFICINA EN OEC COMPUTERS
Escenario de Negocio:
OEC Computers lanza su campaña corporativa de otoño durante el mes de septiembre:

Artículo: Silla Ergonómica Pro (A1001).
Lista Base Asignada: Lista 02 - Minoristas (Precio unitario base = $200.00 USD).
Condición 1: Durante todo septiembre, 5% de descuento directo en cualquier compra ($190.00 USD).
Condición 2: Si el cliente compra 4 o más sillas en el mismo pedido, recibe un 3% adicional (Descuento total acumulado = 8%, precio = $184.00 USD/ud).
Parametrización en SAP Business One:
Menú: Inventario > Listas de precios > Precios especiales > Descuentos por período y cantidad.
Seleccionar Lista 02 - Minoristas y agregar el artículo A1001.
Doble clic en la fila de A1001: en la ventana Descuentos por período, ingresar Válido desde: 2026-09-01, Hasta: 2026-09-30, Descuento: 5%. Desmarcar la casilla Automático.
Doble clic en la línea del período: en la ventana Descuentos por cantidad, ingresar Cantidad: 4, Descuento: 8%.
Presionar Actualizar.
Verificación Documental:
Un cliente realiza un Pedido de Venta el 15 de septiembre por 2 sillas: el sistema aplica automáticamente $190.00 USD/ud (5% descuento).
Otro cliente pide 5 sillas el 18 de septiembre: el sistema detecta que supera el umbral de 4 y liquida a $184.00 USD/ud (8% descuento total).


5. BANCO DE EVALUACIÓN SITUACIONAL Y CERTIFICACIÓN
Pregunta 1
En la jerarquía de determinación de precios de SAP Business One, ¿cuál de las siguientes opciones anula a los Descuentos por Período y Cantidad configurados en una lista de precios?
A) El costo estándar del artículo definido en el almacén.
B) Un Precio Especial definido para el Interlocutor Comercial en la ventana OSPP.
C) La lista de precios de compras del proveedor predeterminado.
D) El peso máximo configurado en la ubicación de almacenamiento.
Respuesta Correcta: B
Justificación Técnica: La jerarquía comercial de SAP B1 evalúa primero Acuerdos Globales y Precios Especiales por Interlocutor Comercial (OSPP). Si existe un precio especial asignado al cliente, este anula los descuentos generales por período y cantidad de la lista base.
Pregunta 2
¿Qué efecto tiene desmarcar la casilla "Automático" en la ventana de Descuentos por Período al fijar una promoción estacional?
A) Impide que el usuario guarde el documento sin autorización del gerente.
B) Desactiva el cálculo de impuestos en las líneas de factura.
C) Congela el precio especial resultante, impidiendo que el precio de la promoción se altere si la lista de precios base sufre incrementos posteriores.
D) Elimina el artículo del maestro tras finalizar el mes.
Respuesta Correcta: C
Justificación Técnica: Cuando la casilla Automático está desmarcada, el precio con descuento se fija en términos absolutos; si la lista base sube de precio, el precio promocional acordado no sufre recalculos.
Pregunta 3
Si se define una escala de descuento por cantidad para la unidad de medida "Caja de 12", ¿qué condición debe cumplirse en la orden de venta para que el cliente reciba el descuento?
A) Que el cliente pague exclusivamente en efectivo.
B) Que la unidad de medida seleccionada en la línea del pedido coincida exactamente con "Caja de 12".
C) Que el pedido sea despachado desde el almacén principal.
D) Que la entrega se facture en un plazo menor a 24 horas.
Respuesta Correcta: B
Justificación Técnica: SAP Business One evalúa la coincidencia estricta de la Unidad de Medida entre la regla de descuento de volumen (SPP2) y la línea de transacción comercial.