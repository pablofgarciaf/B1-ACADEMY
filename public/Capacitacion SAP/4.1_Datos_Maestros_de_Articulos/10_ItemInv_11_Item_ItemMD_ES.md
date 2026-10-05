UNIDAD 033: DATOS MAESTROS DE ARTÍCULO - CATEGORÍAS, ESTRUCTURA Y CÁLCULO DE DISPONIBILIDAD (SAP BUSINESS ONE 10.0)
Código de Manual: 10_ItemInv_11_Item_ItemMD_ES
Módulo Oficial: Gestión de Inventario / Artículos (Inventory Management - Item Master Data)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Logísticos, Gestores de Catálogo, Planificadores de Cadena de Suministro y Agentes IA (Antigravity)
Carpeta Asociada: 033_10_ItemInv_11_Item_ItemMD_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "033",

  "topic": "Item Master Data Architecture, Categories & Inventory Availability Logic",

  "sap_module": "Inventory_ItemMasterData",

  "database_tables": {

    "item_master_header": "OITM",

    "item_warehouse_data": "OITW",

    "item_prices": "ITM1",

    "item_properties_definitions": "OITG",

    "uom_groups": "OUGP",

    "item_groups": "OITB"

  },

  "menu_paths": [

    "Inventario > Datos maestros de artículo",

    "Inventario > Informes de inventario > Estado de inventario",

    "Gestión > Definición > Inventario > Propiedades del artículo"

  ],

  "item_categories_matrix": {

    "flags": {

      "PrchseItem": "Artículo de compra (OITM.PrchseItem = 'Y'): Habilitado en Solicitudes, Pedidos y Facturas de Proveedores",

      "SellItem": "Artículo de venta (OITM.SellItem = 'Y'): Habilitado en Ofertas, Pedidos, Entregas y Facturas de Clientes",

      "InvntItem": "Artículo de inventario (OITM.InvntItem = 'Y'): Genera movimientos de stock y asientos en el Libro Mayor"

    },

    "business_archetypes": {

      "Manufactured_and_Sold": { "PrchseItem": "N", "SellItem": "Y", "InvntItem": "Y", "example": "Producto terminado fabricado internamente" },

      "Standard_Resale_Goods": { "PrchseItem": "Y", "SellItem": "Y", "InvntItem": "Y", "example": "Mercancía de reventa comprada y vendida con stock" },

      "Direct_Expense_Supplies": { "PrchseItem": "Y", "SellItem": "N", "InvntItem": "N", "example": "Material de oficina o suministros consumidos inmediatamente" },

      "Pure_Service": { "PrchseItem": "N", "SellItem": "Y", "InvntItem": "N", "example": "Servicio de consultoría o soporte técnico" }

    }

  },

  "lifecycle_and_deletion_rules": {

    "hard_deletion_rule": "Si un código de artículo ya ha sido utilizado en cualquier documento de marketing preliminar/definitivo, transacción contable o movimiento de stock, NO PUEDE ELIMINARSE de la base de datos.",

    "obsolete_management": {

      "inactive_flag": "OITM.validFor = 'N' / OITM.frozenFor = 'Y'",

      "date_range": "Posibilidad de programar validez (validFrom / validTo) o congelación temporal (frozenFrom / frozenTo)",

      "operational_effect": "El artículo no puede seleccionarse en nuevos documentos de venta/compra y puede ocultarse de informes mediante Parametrizaciones Generales"

    }

  },

  "stock_availability_mathematics": {

    "formula": "Disponible (Available) = En Stock (OnHand) + Solicitado (OnOrder) - Comprometido (IsCommited)",

    "variables": {

      "OnHand": "Existencia física real actualmente dentro de los almacenes de la empresa",

      "IsCommited": "Stock reservado para clientes en Pedidos de venta abiertos o reservado para producción",

      "OnOrder": "Stock solicitado a proveedores en Órdenes de compra abiertas o en Órdenes de producción pendientes"

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Registro Maestro de Artículo como Núcleo del ERP
El Dato Maestro de Artículo (OITM) es la entidad central alrededor de la cual orbitan casi todos los submódulos de SAP Business One: Ventas, Compras, Almacén, Producción, MRP, Servicios y Finanzas. Cada producto o servicio comercializado o consumido por la empresa se registra mediante un código alfanumérico unívoco (Código SKU o EAN).
2.2 Las Tres Casillas de Categoría de Artículo
En la cabecera del registro se definen tres atributos booleanos determinantes:

Artículo de Inventario (InvntItem): Si está marcado, el artículo mueve cantidades físicas y costo monetario en la tabla OITW. Cuando entra o sale de bodega, dispara transacciones en el Libro Mayor (OJDT). Si está desmarcado, el sistema no controla stock físico.
Artículo de Venta (SellItem): Autoriza al artículo a ser llamado en documentos del ciclo comercial (Cotizaciones, Pedidos, Entregas, Facturas de Deudores).
Artículo de Compra (PrchseItem): Autoriza al artículo a ser adquirido mediante el ciclo de aprovisionamiento (Órdenes de Compra, GRPO, Facturas de Acreedores).
2.3 Estructura de las 9 Pestañas de Datos
La ficha se organiza en nueve bloques temáticos:

General: Fabricante, tipo de expedición, número de catálogo adicional y regla de gestión por Números de Serie o Lotes (en cada transacción o solo en descargo).
Datos de Compras: Proveedor preferente habitual (CardCode), número de catálogo del fabricante, unidad de medida de compra (BuyUnitMsr), factor de conversión por empaque y grupo aduanero.
Datos de Ventas: Unidad de medida de venta (SalUnitMsr), reglas de empaque, dimensiones volumétricas y clasificación impositiva.
Datos de Inventario: Matriz en tiempo real por almacén mostrando: En Stock, Comprometido, Solicitado y Disponible. Aquí se define también el método de valoración de inventario (Promedio Ponderado, Estándar o FIFO) y la cuenta contable por almacén.
Datos de Planificación: Parámetros para el motor MRP: Método de aprovisionamiento (Efectuar/Comprar), Intervalo de pedido, Pedido múltiple, Cantidad mínima y Tiempo de reposición (Lead Time).
Datos de Producción: Método de emisión de componentes (Manual vs Toma Retroactiva / Backflush) y vinculación con la Lista de Materiales (BOM / OITT).
Propiedades: Matriz de hasta 64 banderas booleanas personalizables para segmentar el catálogo por atributos comerciales (ej. Gama Alta, Uso Rudo, Reacondicionado, Pantalla Táctil) útiles en filtros masivos y listas de precios.
Observaciones: Texto descriptivo libre e inserción de imagen/fotografía del producto.
Anexos: Hojas técnicas, certificados de calidad o manuales en PDF vinculados al registro.
2.4 Dinámica del Cálculo de Stock Disponible
Uno de los puntos más consultados por los asesores de ventas es la disponibilidad real para promesa de entrega (ATP): $$\text{Disponible} = \text{En Stock} + \text{Solicitado} - \text{Comprometido}$$

Si OEC Computers tiene 50 monitores en bodega, 20 comprometidos en pedidos de clientes ya firmados, y una orden de compra abierta con el fabricante por 30 unidades: $$\text{Disponible} = 50 + 30 - 20 = 60 \text{ unidades}$$
El sistema permite comprometer hasta 60 unidades para entrega futura sin incurrir en quiebre de stock.


3. CASO DE NEGOCIO RESUELTO: ALTA DE NUEVO HARDWARE EN OEC COMPUTERS
Escenario de Negocio:
OEC Computers incorpora a su portafolio el nuevo servidor corporativo SRV-XEON-100 ensamblado internamente, y un contrato de servicio anual de mantenimiento SRV-MNT-ANNUAL.
Parametrización en SAP Business One:
Servidor SRV-XEON-100:
Categorías: Artículo de Venta = Sí, Artículo de Inventario = Sí, Artículo de Compra = No (se ensambla con partes internas).
Pestaña General: Gestionado por Números de Serie en cada transacción.
Pestaña Planificación: Método de aprovisionamiento = Efectuar (Fabricación interna).
Pestaña Producción: Vinculado a la Lista de Materiales de ensamble BOM-SRV-100.
Contrato de Soporte SRV-MNT-ANNUAL:
Categorías: Artículo de Venta = Sí, Artículo de Inventario = No, Artículo de Compra = No.
Efecto Contable: Al facturarse, no mueve cuentas de almacén ni costo de ventas; imputa directamente a la cuenta de Ingresos por Servicios.
Resultado:
El catálogo de OEC Computers queda estructurado sin generar costos fantasma de inventario para servicios y garantizando trazabilidad serial para los servidores ensamblados.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Si un artículo en SAP Business One ya ha sido utilizado en una Factura de Proveedores previa, ¿es posible eliminarlo permanentemente de la base de datos?
A) Sí, haciendo clic derecho y seleccionando "Eliminar".
B) No. Cualquier artículo con historial contable o transaccional queda protegido contra eliminación; únicamente puede marcarse como "Inactivo" para impedir su uso futuro.
C) Sí, pero se debe reiniciar el servidor de licencias.
D) Solo si el balance del proveedor está en cero.
Respuesta Correcta: B
Justificación Técnica: Por integridad de auditoría y trazabilidad fiscal, SAP Business One prohíbe el borrado de entidades maestras que tengan registros vinculados en las tablas transaccionales (INV1, PCH1, JDT1).
Pregunta 2
En la ficha de Datos de Inventario, ¿cuál es la fórmula matemática exacta que calcula la "Cantidad Disponible" de un artículo?
A) En Stock - Solicitado + Comprometido.
B) En Stock + Solicitado - Comprometido.
C) En Stock + Comprometido.
D) Solicitado - Comprometido exclusivamente.
Respuesta Correcta: B
Justificación Técnica: La disponibilidad proyectada suma la existencia física actual más los pedidos de compra en tránsito (Solicitado) y resta los compromisos de entrega ya adquiridos con clientes (Comprometido).
Pregunta 3
¿Cuál de las siguientes combinaciones de casillas de categoría es la adecuada para registrar un servicio puro de consultoría que la empresa vende pero no almacena ni compra?
A) Artículo de Compra = Sí, Artículo de Inventario = Sí, Artículo de Venta = Sí.
B) Artículo de Venta = Sí, Artículo de Inventario = No, Artículo de Compra = No.
C) Artículo de Inventario = Sí, Artículo de Venta = No.
D) Ninguna casilla marcada.
Respuesta Correcta: B
Justificación Técnica: Un servicio que no se gestiona físicamente no debe tener el flag de inventario ni de compra; al marcar únicamente "Artículo de venta", puede facturarse a clientes reconociendo ingresos sin generar registros de stock ni costos de mercancías.