UNIDAD 035: DESCRIPCIÓN GENERAL DE UNIDADES DE MEDIDA (UdM) Y GRUPOS DE CONVERSIÓN (SAP BUSINESS ONE 10.0)
Código de Manual: 10_ItemInv_21_UoM_Overview_ES
Módulo Oficial: Gestión de Inventario / Unidades de Medida (Inventory Management - Units of Measure)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Logísticos, Gestores de Cadena de Suministro, Diseñadores de Empaque y Agentes IA (Antigravity)
Carpeta Asociada: 035_10_ItemInv_21_UoM_Overview_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "035",

  "topic": "Units of Measure Architecture, UoM Groups & Multi-Level Conversion Rules",

  "sap_module": "Inventory_UnitsOfMeasure",

  "database_tables": {

    "global_uom_master": "OUOM",

    "uom_groups_header": "OUGP",

    "uom_group_conversion_lines": "UGP1",

    "item_master_data": "OITM",

    "barcodes_by_uom": "OBCD",

    "prices_by_uom": "ITM1 / ITM9",

    "package_types": "OPKG"

  },

  "menu_paths": [

    "Gestión > Definición > Inventario > Unidades de medida > Unidades de medida",

    "Gestión > Definición > Inventario > Unidades de medida > Grupos de unidades de medida",

    "Inventario > Datos maestros de artículo > Pestaña Compras / Ventas / Inventario",

    "Inventario > Códigos de barras"

  ],

  "three_uom_tiers": {

    "Inventory_UoM": {

      "definition": "Unidad base para el registro contable y control cuantitativo de existencias",

      "immutability": "Estrictamente INMUTABLE una vez que el artículo registra su primera transacción de stock o asiento contable",

      "scope": "Todas las contabilizaciones del Libro Mayor, valoraciones FIFO/PMP, comprobación de disponibilidad (ATP), recuentos físicos e informes oficiales se expresan en esta unidad"

    },

    "Purchasing_UoM": {

      "definition": "Unidad en la que se negocia y adquiere el artículo a proveedores (ej. Cajas de 24, Palés de 48)",

      "flexibility": "Un artículo puede asociar múltiples UdM de compra; el usuario puede alternar entre ellas en el documento de compra",

      "conversion": "Al registrar una Entrada de Mercancías (GRPO), el sistema multiplica la cantidad comprada por el factor de conversión para asentar el stock en la UdM de Inventario"

    },

    "Sales_UoM": {

      "definition": "Unidad en la que se comercializa el artículo a clientes (ej. Paquetes individuales, Packs de 6)",

      "flexibility": "Admite múltiples UdM de venta con precios, códigos de barras y dimensiones de embalaje independientes"

    }

  },

  "conversion_rules_mechanics": {

    "base_relation": "1 [UdM_Secundaria] = X [UdM_Base_Inventario]",

    "example_paper_group": {

      "Base_Unit": "Paquete (1 paquete = 1)",

      "Small_Pack": "0.5 paquetes",

      "Pack_6": "6 paquetes",

      "Box": "24 paquetes",

      "Pallet": "48 paquetes (1,152 unidades base)"

    },

    "special_conversion_modification_protocol": {

      "challenge": "Modificar la tasa de conversión para un artículo específico sin afectar a otros artículos del mismo grupo",

      "solution": [

        "1. Crear un grupo paralelo de UdM (ej. Grupo Papel 2) con las tasas requeridas",

        "2. Cerrar o cancelar todos los documentos de marketing abiertos que contengan el artículo afectado",

        "3. Reasignar el artículo al nuevo Grupo Papel 2 en los Datos Maestros de Artículo",

        "4. Actualizar la nueva tasa de conversión dentro de la definición del Grupo Papel 2"

      ]

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Desafío de la Multidimensionalidad en el Embalaje
En las empresas de distribución y manufactura, rara vez un producto se compra, almacena y vende en la misma presentación física. Un distribuidor de papelería adquiere el papel a los molinos en Palés de 48 cajas, almacena el stock en Cajas de 24 paquetes y lo comercializa a minoristas en Packs de 6 unidades o a consumidores finales en Paquetes individuales.

Antes de la introducción de los Grupos de Unidades de Medida en SAP Business One, las empresas se veían obligadas a crear múltiples códigos SKU ficticios o a calcular factores manuales propensos a errores. SAP Business One 10.0 resuelve esto desacoplando las unidades comerciales mediante un motor relacional de Grupos de Unidades de Medida (OUGP/UGP1).
2.2 Arquitectura Relacional de Unidades de Medida
El modelo opera en tres capas jerárquicas:

Unidades de Medida Globales (OUOM): Catálogo corporativo de todas las unidades físicas reconocidas por la empresa (Litro, Kilogramo, Metro, Paquete, Caja, Palé, Botella, Display).
Grupos de Unidades de Medida (OUGP): Conjunto relacional que agrupa las unidades aplicables a una categoría de producto y establece las Reglas de Conversión matemáticas respecto a una Unidad Base.
Asignación al Maestro de Artículo (OITM): El artículo adopta el grupo de UdM, permitiendo parametrizar:
Códigos de Barras por UdM (OBCD): El paquete individual tiene un código EAN-13, mientras que la caja máster tiene un código ITF-14 o GS1-128 diferente.
Listas de Precios por UdM (ITM1/ITM9): Permite fijar un precio unitario de $5 por paquete individual, pero un precio promocional de $110 por la caja de 24 (en lugar de $120).
Tipos de Embalaje y Dimensiones: Asocia dimensiones de Largo, Ancho, Alto y Volumen para cubicaje en camiones y almacenes.
2.3 El Principio de Inmutabilidad de la UdM de Inventario
La Unidad de Medida de Inventario (OITM.InvntryUom) es la columna vertebral de la contabilidad de costos y el control físico de stock.
Regla Estricta: Una vez que un artículo registra cualquier movimiento de entrada o salida (GRPO, Factura, Entrega, Ajuste de Inventario), la UdM de inventario queda permanentemente bloqueada y no puede modificarse.
Mapeo Transaccional Automático: Cuando un usuario emite un documento en una unidad distinta (ej. Compra de 2 Cajas), SAP Business One realiza la conversión en segundo plano: $$\text{Cantidad en Inventario} = 2 \text{ Cajas} \times 24 \frac{\text{Paquetes}}{\text{Caja}} = 48 \text{ Paquetes}$$ El inventario físico y la valoración en el Libro Mayor se asientan exclusivamente en función de los 48 paquetes.


3. CASO DE NEGOCIO RESUELTO: GESTIÓN DE PAPEL DE IMPRESIÓN EN OEC COMPUTERS
Escenario de Negocio:
OEC Computers comercializa diversas variedades de papel: Papel A4 Blanco, Papel A4 Reciclado y Papel A4 Fotográfico.

Compra habitual: Cajas de 24 paquetes al fabricante internacional.
Venta habitual: Paquetes individuales o Cajas completas a corporativos con descuento.
OEC Computers necesita estandarizar las reglas de conversión y resolver una excepción: un nuevo proveedor de papel reciclado entrega cajas especiales de 30 paquetes en lugar del estándar de 24.
Configuración en SAP Business One:
Definición del Grupo Estándar GRUPO_PAPEL:
Unidad Base (Inventario): Paquete.
Unidades del Grupo:
Pack-6 = 6 Paquetes.
Caja-24 = 24 Paquetes.
Palé = 48 Cajas (1,152 Paquetes).
Asignación a Artículos:
Se asigna GRUPO_PAPEL al artículo PPR-BLANCO y PPR-FOTO.
Unidad de compra por defecto: Caja-24. Unidad de venta por defecto: Paquete.
Resolución de la Excepción para el Papel Reciclado (PPR-RECICLADO):
Como el proveedor entrega cajas de 30 paquetes, no se puede alterar el GRUPO_PAPEL porque desconfiguraría el papel blanco.
Se crea el grupo GRUPO_PAPEL_30 donde la unidad Caja-30 equivale a 30 paquetes.
Se comprueba que no existan cotizaciones o pedidos abiertos para PPR-RECICLADO.
Se reasigna el artículo al nuevo grupo GRUPO_PAPEL_30.
Ejecución Transaccional:
Se recibe una orden de compra de 5 Cajas de PPR-RECICLADO.
El sistema calcula y asienta automáticamente en almacén: $5 \times 30 = 150\text{ paquetes}$.
La auditoría contable y el inventario en paquetes quedan matemáticamente perfectos.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál de las siguientes afirmaciones es CORRECTA respecto a la "Unidad de Medida de Inventario" de un artículo en SAP Business One?
A) Puede cambiarse libremente al final de cada ejercicio fiscal.
B) Es la unidad en la que se registran todas las transacciones del Libro Mayor, valoraciones de existencias e informes de disponibilidad; no puede modificarse una vez que el artículo registra transacciones.
C) Solo se utiliza en empresas de manufactura pesada.
D) Debe coincidir obligatoriamente con la unidad de medida de compras del proveedor.
Respuesta Correcta: B
Justificación Técnica: La UdM de inventario gobierna la base de costeo y stock en OITW; permitir su alteración tras registrar movimientos destruiría la consistencia histórica de las capas de costo y saldos contables.
Pregunta 2
Si una empresa adquiere 10 Cajas de un producto, y en el Grupo de Unidades de Medida se tiene definido que 1 Caja = 12 Unidades base de inventario, ¿cuántas unidades se contabilizan en el stock físico al crear la Entrada de Mercancías por Pedido (GRPO)?
A) Exactamente 10 unidades.
B) Exactamente 120 unidades base de inventario.
C) 1.2 unidades.
D) El sistema solicita que el usuario decida en una ventana modal.
Respuesta Correcta: B
Justificación Técnica: El motor logístico convierte automáticamente la cantidad del documento de compras a la unidad base de inventario multiplicando la cantidad por el factor relacional: $10 \times 12 = 120$ unidades.
Pregunta 3
¿Qué requisito indispensable debe cumplirse en SAP Business One antes de modificar la tasa de conversión en un Grupo de Unidades de Medida asignado a un artículo específico?
A) Se debe solicitar autorización escrita a SAP AG.
B) Se deben cerrar o cancelar previamente todos los documentos de marketing abiertos (pedidos, ofertas, solicitudes) que contengan dicho artículo.
C) Se debe formatear la base de datos de la empresa.
D) Se debe cambiar el método de costeo del artículo a Coste Estándar.
Respuesta Correcta: B
Justificación Técnica: Si existieran documentos abiertos con cantidades calculadas bajo la tasa antigua, alterar la conversión causaría inconsistencias de redondeo y desbalance en las cantidades pendientes por servir o facturar.