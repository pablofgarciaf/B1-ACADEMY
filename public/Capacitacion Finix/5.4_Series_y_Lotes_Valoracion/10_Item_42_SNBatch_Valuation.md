UNIDAD 058: VALORACIÓN DE INVENTARIOS POR NÚMERO DE SERIE Y LOTE EN SAP BUSINESS ONE 10.0
Código de Manual: 10_Item_42_SNBatch_Valuation
Módulo Oficial: Inventario y Artículos (Items and Inventory - Serial & Batch Valuation)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Financieros y de Costos, Auditores de Inventario, Jefes de Contabilidad y Agentes IA (Antigravity)
Carpeta Asociada: 058_10_Item_42_SNBatch_Valuation


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "058",

  "topic": "Serial and Batch Valuation Method & Actual Cost Tracking",

  "sap_module": "Inventory_Costing_SerialBatch",

  "prerequisites": {

    "perpetual_inventory": "Obligatorio tener activo el Inventario Permanente en Detalles de la Empresa (OADM)",

    "management_method": "Debe configurarse estrictamente como 'En cada transacción' (On Every Transaction) en OITM"

  },

  "database_tables": {

    "serial_numbers_cost": "OSRN / OSRQ (Costos unitarios por número de serie)",

    "batch_numbers_cost": "OBTN / OBTQ (Costo promedio ponderado del lote)",

    "item_master_data": "OITM (EvalSystem = 'S')",

    "audit_report_tables": "OINM / OIVL / SRI1 / IBT1",

    "landed_costs": "OIPF / IPF1"

  },

  "menu_paths": [

    "Gestión > Inicialización del sistema > Detalles empresa > Pestaña Inicialización básica > Gestionar costo de serie y lote por Método de valoración de serie/lote",

    "Inventario > Datos maestros de artículo > Pestaña Datos de inventario > Método de valoración: Serie/Lote",

    "Inventario > Informes de inventario > Informe de auditoría de inventario de lotes y números de serie",

    "Inventario > Operaciones de stock > Revalorización de inventario"

  ],

  "costing_rules": {

    "serial_number_costing": "Cada número de serie mantiene su costo de adquisición exacto individual (Factura/GRPO + Precios de Entrega). Al venderse, el Costo de Ventas (COGS) refleja exactamente ese monto.",

    "batch_costing": "El costo del lote es el costo real acumulado de producción o compra. Si se permiten múltiples recepciones para un mismo lote, el costo se recalcula: Costo_Unitario = Suma_Valor_Recepciones / Suma_Cantidad_Recepciones.",

    "block_multiple_receipts": "Casilla 'Bloquear recepciones múltiples para el mismo lote': Garantiza que cada lote tenga un precio único inmutable forzando un nuevo código de lote en cada ingreso.",

    "cost_management_level": "El costo de series/lotes se gestiona a nivel de EMPRESA (Company Level), no a nivel de almacén individual."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Más Allá de los Métodos Convencionales (PMP, FIFO, Estándar)
En industrias especializadas (electrónica de alto valor, maquinaria médica, automóviles y productos gourmet por lotes), los métodos convencionales de costeo promedian o enmascaran la rentabilidad real:

En Precio Medio Ponderado (PMP), el costo se diluye entre todas las unidades en stock.
En FIFO, el costo depende estrictamente del orden cronológico de entrada, no del artículo físico real entregado. El Método de Valoración por Número de Serie y Lote (Serial/Batch Valuation) rastrea el costo de adquisición o fabricación individual de cada unidad física identificada, imputando al Costo de Ventas (COGS) el importe exacto con el que ingresó esa pieza al almacén.
2.2 El Ciclo de Costeo de Series con Precios de Entrega (Landed Costs)
Entrada de Mercancías (OPDN): Se compran 5 laptops importadas a $1,000 USD c/u. A cada número de serie (SN1001 a SN1005) se le asigna un costo inicial de $1,000.
Precios de Entrega (OIPF): Se imputan $250 USD de aranceles y fletes aduaneros prorrateados ($50 USD por laptop). El costo individual de cada número de serie se actualiza automáticamente a $1,050 USD.
Despacho / Entrega (ODLN): El cliente compra las laptops SN1001 y SN1002 a $1,800 USD c/u.
El asiento contable debita Costo de Ventas por $2,100 USD ($1,050 * 2) y acredita Inventario por $2,100.
La rentabilidad bruta se calcula con precisión milimétrica: $$\text{Margen Bruto Real} = $3,600 - $2,100 = \mathbf{$1,500\text{ USD (41.67%)}}$$
2.3 Costeo de Lotes de Fabricación y Recepciones Múltiples
En manufactura (ej. industria chocolatera o farmacéutica), cada Orden de Fabricación acumula materias primas, costos de máquina y mano de obra.
Al emitir el Recibo de Producción, el lote terminado (OBTN) hereda el costo total incurrido dividido por las unidades producidas.
Manejo de Recepciones Múltiples: Si una empresa compra o produce el mismo número de lote en distintas fechas con costos disímiles, SAP Business One ofrece dos políticas:
Bloquear recepciones múltiples: Obliga a utilizar un identificador de lote distinto para no alterar el costo histórico.
Permitir recepciones múltiples: Recalcula el costo unitario del lote mediante promedio ponderado de las remesas ingresadas.


3. ATLAS DIDÁCTICO: RASTREO DE COSTOS EN EL CICLO DE VIDA DE LA SERIE
[ Factura / GRPO ] ----> Asigna Costo Base Individual ($100 / unidad)

         │

         ▼

[ Precios de Entrega ] -> Suma Gastos Aduaneros / Flete (+ $10 / unidad) -> Costo Total: $110

         │

         ▼

[ Entrega a Cliente ] -> Debita Costo de Ventas (COGS) por exactamente $110

         │

         ▼

[ Devolución Cliente ] -> Retorna al Inventario con su costo original de $110

         │

         ▼

[ Revalorización Stock] -> Si el ítem sufrió daño físico, se revaloriza a $75 (Pérdida a Desviación de Stock: $35)


4. CASO DE NEGOCIO RESUELTO: GESTIÓN DE TABLETS EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers comercializa tablets de alta gama valorizadas individualmente por número de serie.

Se reciben 5 tablets a $100 c/u (SN10001 a SN10005).
Se liquidan gastos aduaneros por $50 (+$10 por tablet $\rightarrow$ Costo = $110 c/u).
Se venden las unidades SN10001 y SN10002 a $275 c/u.
La unidad SN10001 sufre daño cosmético en el transporte y el cliente la devuelve.
Trazabilidad Contable:
Devolución de Cliente (ORDN): Reingresa SN10001 a inventario a su costo original de $110 USD (Crédito a COGS por $110).
Revalorización de Inventario (MRV): Por el defecto cosmético, el perito reduce el valor de la tablet en $35 USD, fijando su nuevo costo en $75 USD.
Asiento generado: Debe Desviación de Existencias ($35) / Haber Cuenta de Existencias ($35).
Auditoría de Stock: El Informe de Auditoría de Lotes y Series muestra que en el almacén hay 4 tablets con un valor de balance total de $405 USD (3 unidades a $110 + 1 unidad a $75), reflejando fielmente el valor real de realización.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿A qué nivel de la organización gestiona SAP Business One el costo de los artículos cuando se utiliza el Método de Valoración de Serie y Lote?
A) A nivel de cada almacén individual.
B) A nivel de toda la empresa (Company Level).
C) A nivel de grupo de clientes.
D) A nivel de centro de costo de ventas.
Respuesta Correcta: B
Justificación Técnica: A diferencia del costo por almacén en métodos tradicionales, la valoración de series y lotes se controla como una entidad global en la sociedad, asegurando que el costo de una serie sea idéntico independientemente del almacén donde resida.
Pregunta 2
¿Por qué motivo NO es posible seleccionar el Método de Valoración de Serie/Lote como valor por defecto en los Grupos de Artículos (OITB)?
A) Porque el módulo de grupos está reservado solo para servicios.
B) Porque los grupos de artículos pueden albergar productos que no están gestionados por series ni por lotes, lo que crearía una incompatibilidad arquitectónica de datos.
C) Porque solo se permite en bases de datos SQL Server.
D) Porque requiere una licencia de desarrollo SDK.
Respuesta Correcta: B
Justificación Técnica: La valoración de series/lotes exige que el artículo posea serialización activa; al ser los grupos de artículos genéricos, SAP restringe esta asignación a la Inicialización de Empresa o al maestro de artículo individual.
Pregunta 3
Si se activa la casilla "Bloquear recepciones múltiples para el mismo lote", ¿qué comportamiento exige el sistema en una segunda compra del mismo producto?
A) Obliga a pagar en efectivo.
B) Requiere asignar obligatoriamente un código de lote nuevo y diferente, impidiendo que el lote original mezcle costos de distintas transacciones.
C) Bloquea la entrada de mercancías permanentemente.
D) Asigna el costo a cero.
Respuesta Correcta: B
Justificación Técnica: Dicha salvaguarda asegura la pureza del costo unitario del lote, evitando recálculos ponderados por entradas subsecuentes a diferentes precios.