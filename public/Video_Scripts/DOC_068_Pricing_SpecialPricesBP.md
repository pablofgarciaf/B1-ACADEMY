# Guion de Video: DOC 068 Pricing SpecialPricesBP

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 068 Pricing SpecialPricesBP.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 068: DETERMINACIÓN DE PRECIOS - PRECIOS ESPECIALES PARA INTERLOCUTORES COMERCIALES (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Pricing_33_DiscSP_SpPrBP_ES
Módulo Oficial: Gestión de Precios / Ventas y Compras (Pricing & Special Prices)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Comerciales, Administradores de Precios, Arquitectos de Datos y Agentes IA (Antigravity)
Carpeta Asociada: 068_10_Pricing_33_DiscSP_SpPrBP_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "068",

  "topic": "Special Prices for Business Partners",

  "sap_module": "Pricing_SpecialPrices",

  "database_tables": {

    "special_prices_header": {

      "table": "OSPP",

      "description": "Precios especiales vinculados a una combinación única de Interlocutor Comercial y Artículo",

      "primary_key": ["CardCode", "ItemCode"],

      "key_fields": ["PriceList", "Discount", "Price", "AutoUpdt"]

    },

    "special_prices_periods": "SPP1",

    "special_prices_volumes": "SPP2",

    "business_partners": "OCRD",

    "items": "OITM"

  },

  "menu_paths": [

    "Inventario > Listas de precios > Precios especiales > Precios especiales para interlocutores comerciales",

    "Inventario > Listas de precios > Precios especiales > Actualización global de precios especiales"

  ],

  "hierarchy_position": {

    "rule": "Prioridad máxima de fijación de precios tras los Acuerdos Globales (Blanket Agreements). Anula a los Grupos de Descuento (OEDG), Descuentos por Período y Cantidad (SPP1/SPP2) y a la Lista de Precios Base del cliente (OPLN)."

  },

  "configuration_features": {

    "reference_options": "Permite fijar precios con o sin referencia a una lista de precios (incluso referenciando una lista distinta a la asignada en OCRD)",

    "recalculation_flag": "Campo AutoUpdt: si está activo, el precio especial se recalcula dinámicamente ante fluctuaciones en la lista de precios de referencia",

    "cascading_capabilities": "Hereda la capacidad de definir ventanas de fechas de validez (SPP1) y escalas de cantidad por Unidad de Medida (SPP2)"

  },

  "batch_operations": {

    "copy_special_prices_rules": [

      { "mode": "Sustituir artículos (todos)", "behavior": "Copia todas las líneas y sobrescribe precios existentes en el destino" },

      { "mode": "Sustituir sólo artículos existentes", "behavior": "Solo actualiza los artículos que ya tenían precio especial en el destino; no inserta nuevos" },

      { "mode": "No sustituir artículos", "behavior": "Solo inserta artículos nuevos; respeta y no altera los precios especiales preexistentes" }

    ],

    "global_update_tabs": [

      "Cambiar descuento aumentando o disminuyendo el porcentaje",

      "Cambiar precios de los artículos por porcentaje",

      "Actualizar precios especiales desde la lista de precios vinculada",

      "Borrar precios especiales masivamente"

    ]

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 La Máxima Especificidad en la Fijación de Precios
En la arquitectura comercial de SAP Business One, la regla fundamental de búsqueda de precios es: "Lo específico siempre anula a lo general". Los Precios Especiales para Interlocutores Comerciales (OSPP) constituyen el nivel de parametrización comercial más detallado que puede definirse para un cliente o proveedor, superado únicamente por un contrato marco formal (Acuerdo Global Específico).

Cuando un usuario digita un Pedido de Ventas o Factura:

El motor de precios consulta primero si existe un acuerdo global aplicable.
Si no existe, consulta inmediatamente la tabla OSPP para el CardCode y el ItemCode.
Si existe un registro activo en OSPP, el sistema ignora automáticamente los grupos de descuento (OEDG), los descuentos por período generales y la lista de precios del cliente, aplicando la condición pactada.
2.2 Modalidades de Precios Especiales
SAP Business One ofrece dos modalidades de configuración en OSPP:

Precios Sin Referencia a Lista: Se establece un precio fijo neto inamovible (ej. $150.00 USD exactos para el cliente VIP, sin importar cómo se mueva el mercado).
Precios Con Referencia a Lista: Se vincula a una lista de precios base (que no necesariamente debe ser la lista asignada en la ficha del cliente) y se le aplica un porcentaje de descuento o recargo (ej. Lista 01 Mayorista menos 12%).
Si la casilla Actualización Automática (AutoUpdt) está marcada, cualquier ajuste en la lista vinculada recalculará el precio especial del cliente.
Si está desmarcada, el precio queda congelado en el valor vigente al momento de la configuración.
2.3 Períodos de Validez y Escalas de Volumen Anidadas
Haciendo doble clic sobre la fila del precio especial en OSPP, se abre la ventana de Períodos de Validez (SPP1), permitiendo fijar vigencias (ej. precios válidos durante el primer semestre). Haciendo un segundo doble clic en la línea del período, se despliega la ventana de Escalas por Cantidad (SPP2), donde se parametrizan descuentos por volumen condicionados a la Unidad de Medida seleccionada.
2.4 Asistente de Copia de Precios Especiales
Configurar precios individuales para cientos de clientes corporativos es una tarea que SAP B1 simplifica mediante la función Copiar precios especiales:

Permite seleccionar un cliente modelo (origen) y proyectar sus acuerdos hacia un rango de clientes destino (por código, grupo o propiedades).
Las 3 Reglas de Sobrescritura:
Sustituir artículos (todos): Sobrescribe todo el catálogo de precios especiales del destino.
Sustituir sólo artículos existentes: Actualiza únicamente los ítems comunes, sin añadir nuevos productos.
No sustituir artículos: Modo incremental; solo agrega artículos nuevos sin tocar las condiciones ya negociadas previamente con el cliente destino.
2.5 Transacción de Actualización Global
Ubicada en Inventario > Listas de precios > Precios especiales > Actualización global de precios especiales, esta utilidad centralizada permite ejecutar modificaciones masivas en 4 escenarios:

Variar descuentos por porcentaje (+/- X%).
Variar precios nominales en masa.
Forzar el refresco de precios especiales desde sus listas vinculadas.
Purgar y borrar precios especiales obsoletos por rangos de fechas o socios de negocios.


3. ATLAS DIDÁCTICO: EL FLUJO COMPLETO DE DETERMINACIÓN DE PRECIOS EN SAP B1
                  [ LÍNEA DE DOCUMENTO COMERCIAL ]

                                 │

                                 ▼

              ¿Existe Acuerdo Global Válido (OOAT)?

                    │                         │

                  (SÍ)                       (NO)

                    │                         ▼

            [ APLICA PRECIO ]      ¿Existe Precio Especial

            [  DEL ACUERDO  ]       en OSPP para este IC?

                                       │              │

                                     (SÍ)            (NO)

                                       │              ▼

                               [ APLICA PRECIO ]  ¿Existe Grupo de Descuento

                               [ ESPECIAL OSPP ]     Aplicable en OEDG?

                                                      │              │

                                                    (SÍ)            (NO)

                                                      │              ▼

                                                      │    ¿Hay Descuentos Período/

                                                      │     Cantidad en Lista Base?

                                                      │        │              │

                                                      │      (SÍ)            (NO)

                                                      │        │              ▼

                                                      │        ▼       [ APLICA PRECIO ]

                                                      │     [ APLICA ] [  BASE OPLN    ]

                                                      │     [ DESC.  ]

                                                      ▼        ▼

                                          Calcula Precio Final Combinado


4. CASO DE NEGOCIO RESUELTO: ACUERDO PREFERENCIAL EN OEC COMPUTERS
Escenario de Negocio:
OEC Computers cierra un acuerdo estratégico con la firma consultora C10000 - TechCorp:

Artículo: Servidor Rack Pro (S8000).
Lista de Precios del Cliente: Lista 03 - Corporativo General ($1,200.00 USD).
Precio Especial Pactado en OSPP: $950.00 USD fijos, sin importar que la lista general suba.
Escala de Volumen: Si compran más de 5 servidores en una misma orden, el precio desciende a $900.00 USD.
Parametrización en SAP Business One:
Menú: Inventario > Listas de precios > Precios especiales > Precios especiales para interlocutores comerciales.
Seleccionar cliente C10000 y agregar artículo S8000.
Ingresar Precio = 950.00 USD y desmarcar Actualización Automática.
Doble clic en la línea: definir período anual en SPP1.
Doble clic en el período: en SPP2, agregar fila con Cantidad = 5, Precio especial = 900.00 USD.
Con la herramienta Copiar precios especiales bajo la opción No sustituir artículos, George replica este acuerdo a dos empresas filiales del mismo grupo corporativo (C10001 y C10002).
Resultado Operativo:
Al ingresar una orden de 6 servidores para C10001, el sistema recupera instantáneamente el precio de $900.00 USD, omitiendo cualquier otro descuento de grupo o lista base.


5. BANCO DE EVALUACIÓN SITUACIONAL Y CERTIFICACIÓN
Pregunta 1
Si un cliente tiene asignada la Lista de Precios 02 en su ficha maestra, pero en la ventana de Precios Especiales para Interlocutores Comerciales (OSPP) se le define un precio especial basado en la Lista de Precios 01 con un 10% de descuento, ¿qué precio propone SAP B1 al crear una factura?
A) Rechaza el documento por incongruencia de listas de precios.
B) Aplica el precio especial basado en la Lista de Precios 01 con el 10% de descuento, porque el precio especial de OSPP anula la lista base del cliente.
C) Aplica la Lista de Precios 02 sin descuento.
D) Calcula un promedio ponderado entre ambas listas.
Respuesta Correcta: B
Justificación Técnica: Los precios especiales en OSPP pueden hacer referencia a cualquier lista de precios del sistema (no necesariamente la asignada al cliente en OCRD) y tienen prioridad absoluta sobre la lista de precios general.
Pregunta 2
Al utilizar la herramienta "Copiar precios especiales", ¿qué diferencia a la opción "Sustituir sólo artículos existentes" de la opción "Sustituir artículos (todos)"?
A) "Sustituir sólo artículos existentes" únicamente sobrescribe los precios de los artículos que ya estaban definidos en el cliente destino, sin añadir ningún artículo nuevo del cliente origen.
B) "Sustituir sólo artículos existentes" elimina todos los artículos del almacén.
C) No existe ninguna diferencia operativa entre ambas opciones.
D) "Sustituir artículos (todos)" requiere autorización por contraseña del superusuario.
Respuesta Correcta: A
Justificación Técnica: Esta opción protege el catálogo del cliente destino, actualizando únicamente los ítems comunes que ya tenían precio especial acordado sin poblar el registro con nuevos códigos.
Pregunta 3
¿Qué ocurre si un artículo tiene definido un Precio Especial por Interlocutor Comercial con escala por cantidad para la unidad de medida "Caja", pero en el pedido de venta se comercializa en "Unidades sueltas"?
A) El sistema cancela la línea del pedido.
B) No se aplica el precio especial de la escala por volumen, ya que la Unidad de Medida del documento no coincide con la UdM configurada en la tabla SPP2.
C) El sistema divide el precio de la caja entre 12 automáticamente sin validar.
D) Se genera un asiento de ajuste contable por diferencia de cambio.
Respuesta Correcta: B
Justificación Técnica: Para que las escalas de volumen anidadas en precios especiales se activen, es indispensable la coincidencia exacta de la Unidad de Medida en la transacción.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
