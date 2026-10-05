UNIDAD 064: CREACIÓN Y ESTRUCTURACIÓN DE LISTAS DE PRECIOS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Pricing_21_Pricelist_CreatePricelist_ES
Módulo Oficial: Gestión de Precios (Pricing) e Inventario
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Comerciales, Administradores de Precios, Contadores de Inventario y Agentes IA (Antigravity)
Carpeta Asociada: 064_10_Pricing_21_Pricelist_CreatePricelist_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "064",

  "topic": "Price List Creation, Base List Linking, Multi-Currency & UoM Pricing",

  "sap_module": "Inventory_Pricing",

  "database_tables": {

    "price_lists_header": "OPLN (ListNum, ListName, BaseListNum, Factor, RoundSys, GroupCode, IsGrossPrc, ValidFrom, ValidTo)",

    "price_lists_items": "ITM1 (ItemCode, PriceList, Price, Currency, AdditionalCurrency1, AdditionalCurrency2)",

    "uom_prices": "ITM9 (ItemCode, PriceList, UomEntry, Price, Factor, AutoUpdate)",

    "general_settings_pricing": "OADM (RemoveUnpricedItems, InactivePriceListsDoc, InactivePriceListsRep)"

  },

  "menu_paths": [

    "Inventario > Listas de precios > Listas de precios",

    "Gestión > Inicialización del sistema > Parametrizaciones generales > Pestaña Determinación de precios",

    "Inventario > Datos maestros de artículo > Pestaña General > Campo Lista de precios"

  ],

  "system_managed_price_lists": {

    "last_purchase_price": {

      "list_number": -1,

      "description": "Último precio de compra",

      "nature": "Estrictamente de solo lectura para el usuario. Actualizada automáticamente por el sistema al registrar: Facturas de Proveedores (OPCH), Entradas de Mercancías (OPDN), Asientos de saldo inicial positivo, Precios de entrega (Landed Costs) y Recibos de producción."

    },

    "last_evaluated_price": {

      "list_number": -2,

      "description": "Último precio evaluado",

      "nature": "Estrictamente de solo lectura. Actualizada exclusivamente al ejecutar el 'Informe de simulación de valoración de inventario'."

    }

  },

  "price_list_mechanics": {

    "default_quantity": "SAP Business One incluye 10 listas de precios por defecto; se pueden crear listas adicionales ilimitadas mediante 'Añadir línea'.",

    "base_list_relation": "Precio_Lista_Derivada = Precio_Lista_Base * Factor. Si se modifica manualmente el precio en la lista derivada, se rompe el vínculo automático para esa fila específica.",

    "uom_specific_pricing": {

      "base_uom_price": "Se define en la matriz principal de la lista de precios.",

      "alternative_uom_price": "Se gestiona en 'Precios de UM del artículo' (ITM9). Permite fijar precios absolutos o porcentajes en 'Reducir en %'.",

      "auto_checkbox": "Si está activo, actualiza automáticamente las UdM alternativas al cambiar el precio de la UdM base."

    },

    "multi_currency": "Permite registrar hasta 3 monedas por fila (Moneda principal + 2 Monedas adicionales) para evitar distorsiones por tipo de cambio flotante.",

    "table_optimization": {

      "setting": "Eliminar artículos sin precio de las tablas de listas de precios",

      "impact": "Elimina registros con precio 0.00 de la tabla física ITM1, reduciendo masivamente el tamaño de la base de datos y acelerando las consultas SQL en catálogos de gran volumen."

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Arquitectura de Listas de Precios en SAP Business One
Una lista de precios en SAP Business One representa una matriz completa que vincula artículos con valores monetarios para transacciones de compra o venta.

Disponibilidad Inicial: El sistema incorpora 10 listas de precios predefinidas. Las organizaciones pueden utilizar todas, renombrarlas o crear nuevas listas ilimitadas según su estrategia de segmentación comercial (ej. Distribuidores, Escuelas, Venta Empleados, Mayoristas A, B y C).
Asignación en Cascada: Cada Interlocutor Comercial (OCRD) tiene asignada una única lista de precios por defecto. Al seleccionar al cliente en una cotización o factura, la lista viaja a la cabecera del documento y determina las tarifas de cada partida.
2.2 Listas Basadas en Otras Listas y Factor Multiplicador
Una de las funcionalidades de mayor productividad es la capacidad de vincular listas de precios en cascada:

Se define una Lista de Precios Base (BaseListNum) y un Factor Multiplicador (Factor).
Ejemplo: La lista "Escuelas" se vincula a la "Lista Base" con un factor de 1.50 (50% de margen) o 2.00 (100% de margen).
Cada vez que se actualiza el costo o la tarifa en la Lista Base, todos los precios de la lista derivada se recalculan de forma instantánea y automática.
Ruptura de Vínculo: Si un usuario sobrescribe manualmente el precio de un artículo en la lista derivada, el sistema desvincula ese ítem de la actualización automática, protegiendo la excepción manual.
2.3 Determinación de Precios por Unidad de Medida (UdM)
En empresas que comercializan productos en múltiples empaques (ej. Unidades, Paquetes de 6, Cajas de 48):

Si no se define una tarifa especial para la caja, el sistema calcula el precio matemáticamente multiplicando el precio unitario por el factor de conversión del grupo de UdM.
Para otorgar economías de escala, el usuario puede acceder a la ventana Precios de UM del artículo (ITM9):
Permite ingresar un precio específico para la caja o aplicar un porcentaje en la columna Reducir en % (ej. 15% de descuento por caja).
La casilla Automático asegura que si el precio unitario del artículo sube en la lista de precios principal, el precio de la caja se actualice preservando el 15% de descuento comercial.
El botón Copiar reducido por permite replicar masivamente estos porcentajes de descuento hacia otros artículos que pertenezcan al mismo grupo de unidades de medida.
2.4 Validez Temporal y Estado Inactivo
Las listas de precios pueden crearse con anticipación y mantenerse en estado Inactivo hasta el día del lanzamiento comercial.
Es posible fijar un rango de fechas de validez (Válido de / Válido a).
Si un documento de marketing intenta utilizar una lista inactiva o fuera de fecha, el precio unitario se presentará en blanco/cero y el sistema emitirá un mensaje de advertencia bloqueante al intentar crear la transacción.
2.5 Listas de Precios Especiales del Sistema (Solo Lectura)
Existen dos listas creadas y mantenidas exclusivamente por el motor transaccional de SAP B1 que ningún usuario puede editar manualmente:

Último Precio de Compra (Last Purchase Price): Se actualiza automáticamente al ingresar mercancías al costo original mediante Facturas de Proveedores (OPCH), Entradas de Mercancías (OPDN), Precios de Entrega/Importación y Recibos de Producción. Se utiliza con frecuencia como base multiplicadora para listas de venta.
Último Precio Evaluado (Last Evaluated Price): Se actualiza únicamente cuando la gerencia financiera ejecuta el Informe de simulación de valoración de inventario.
2.6 Optimización de Base de Datos: Limpieza de la Tabla ITM1
Por defecto, SAP B1 asocia cada artículo creado con todas las listas de precios existentes. En empresas con 50,000 artículos y 20 listas, la tabla ITM1 almacena $1,000,000$ de filas, muchas de ellas con precio cero:

En Parametrizaciones Generales > Determinación de Precios, la casilla Eliminar artículos sin precio de las tablas de listas de precios purga físicamente los registros con valor cero de ITM1.
Esto optimiza el tamaño de la base de datos y acelera el rendimiento de las consultas SQL, sin alterar la experiencia visual del usuario en los formularios de consulta.


3. ATLAS DIDÁCTICO: ARQUITECTURA DE VÍNCULOS Y HERENCIA DE PRECIOS
[ LISTA 01: ÚLTIMO PRECIO DE COMPRA ] (Mantenida por el sistema - Costo Real)

   │

   │ Factor: 1.30 (+30% margen mayorista)

   ▼

[ LISTA 02: MAYORISTAS BASE ]

   │

   │ Factor: 1.25 (+25% margen retail)

   ▼

[ LISTA 03: PÚBLICO GENERAL ]

   │

   ├── Artículo A0001 (UdM Base: Unidad) ──────► $10.00 USD

   └── [ Precios de UM (ITM9) ]

         ├── Paquete x 6 (Desc. 5%) ──────────► $57.00 USD (Auto: SÍ)

         └── Caja x 48 (Desc. 15%) ───────────► $408.00 USD (Auto: SÍ)


4. CASO DE NEGOCIO RESUELTO: TARIFA EDUCATIVA EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers crea una lista de precios para el sector institucional educativo ("Escuelas"):

Se basa en la Lista de Precios Base 01 aplicando un Factor de 1.80 (80% sobre la tarifa base).
Para el artículo B00320 - Papel para fotocopia:
Precio en Lista Base = $2.00 USD por paquete.
Precio automático calculado para Escuelas = $3.60 USD.
Se configuran las unidades de medida en ITM9:
Paquete de 6 unidades: Se aplica un 5% de descuento $\rightarrow$ Precio = $20.52 USD (con casilla Automático marcada).
Caja de 48 unidades: Se aplica un 15% de descuento $\rightarrow$ Precio = $146.88 USD.
Mediante el botón Copiar reducido por, George copia estos porcentajes de descuento por volumen a todos los demás tipos de papel del catálogo en una sola operación.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Si una lista de precios derivada (Lista B) está vinculada a una lista base (Lista A) mediante un factor multiplicador de 2.0 y un usuario modifica manualmente el precio de un artículo directamente en la Lista B, ¿qué sucede cuando posteriormente cambia el precio de ese artículo en la Lista A?
A) El precio en la Lista B se sobrescribe multiplicando el nuevo precio base por 2.0.
B) El sistema emite un error contable en el libro mayor.
C) El precio en la Lista B NO se actualiza automáticamente, ya que la modificación manual rompe el enlace de actualización automática para ese artículo específico.
D) Se borra el artículo de la Lista B.
Respuesta Correcta: C
Justificación Técnica: Al fijar manualmente un precio en una lista derivada, SAP Business One interpreta que existe una excepción comercial fija y cancela la propagación automática del factor para esa fila en particular.
Pregunta 2
¿Cuáles son las dos listas de precios del sistema en SAP Business One que ningún usuario puede editar o mantener manualmente?
A) Lista de precios de venta y Lista de precios de compra.
B) Último precio de compra (Last Purchase Price) y Último precio evaluado (Last Evaluated Price).
C) Lista de precios brutos y Lista de precios netos.
D) Lista de distribuidores y Lista de empleados.
Respuesta Correcta: B
Justificación Técnica: Ambas listas son gestionadas exclusivamente por procesos internos del motor ERP (transacciones de ingreso de mercancías y corrida de simulación de valoración) y permanecen bloqueadas para edición manual.
Pregunta 3
¿Qué beneficio técnico y de infraestructura aporta marcar la casilla "Eliminar artículos sin precio de las tablas de listas de precios" en las Parametrizaciones Generales?
A) Elimina los artículos del catálogo de productos permanentemente.
B) Purga las filas con precio 0.00 de la tabla física ITM1 en la base de datos, reduciendo sustancialmente el tamaño de almacenamiento y optimizando el rendimiento de las consultas SQL sin afectar la visibilidad operativa.
C) Desactiva los impuestos de compras.
D) Obliga a vender todos los productos con margen positivo.
Respuesta Correcta: B
Justificación Técnica: La opción evita almacenar millones de registros nulos en la tabla de precios ITM1, optimizando la memoria RAM y el motor de indexación de la base de datos.