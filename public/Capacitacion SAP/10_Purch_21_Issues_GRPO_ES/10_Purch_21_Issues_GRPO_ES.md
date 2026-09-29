DOC_084: Gestión de Discrepancias e Inconvenientes en la Entrada de Mercancías de Pedido
1. Metadatos Técnicos y Contexto Curricular
Módulo SAP Business One: Gestión de Compras / Gestión de Inventarios (Purchasing - A/P & Inventory Management).
Código de Archivo Fuente: 10_Purch_21_Issues_GRPO_ES.pdf.
Versión del Sistema: SAP Business One 10.0 (HANA / SQL).
Nivel Curricular: Nivel 1 - Manejo de Incidencias Operativas en Almacén y Recepción de Pedidos.
Audiencia Objetivo: Administradores de Almacén, Jefes de Recepción, Compradores Operativos, Consultores Funcionales.


2. JSON Antigravity Master Schema
{

  "antigravity_schema_version": "2.0.0",

  "unit_id": "SAP_B1_PURCH_084",

  "unit_title": "Gestión de Discrepancias en Entradas de Mercancías de Pedido",

  "technical_metadata": {

    "module": "Purchasing - A/P",

    "sap_object_types": [

      {"object_name": "Purchase Order", "object_type_code": "22", "table_header": "OPOR", "table_lines": "POR1"},

      {"object_name": "Goods Receipt PO", "object_type_code": "20", "table_header": "OPDN", "table_lines": "PDN1"}

    ],

    "master_data_tables": ["OCRD", "OITM", "OITW", "NNM1", "OACT"]

  },

  "menu_navigation_paths": {

    "purchase_order": "Compras - Proveedores -> Pedido de Compras",

    "goods_receipt_po": "Compras - Proveedores -> Entrada de Mercancías de Pedido",

    "purchasing_analysis_report": "Compras - Proveedores -> Informes de Compras -> Análisis de Compras"

  },

  "business_logic_matrix": {

    "partial_deliveries": {

      "scenario": "El proveedor entrega una cantidad menor a la solicitada originalmente.",

      "system_action": "Ajustar la cantidad de la línea en la Entrada de Mercancías al valor recibido real.",

      "po_status": "El Pedido permanece con estatus 'Abierto' (Open) por el remanente no recibido.",

      "residual_processing": [

        "Si se esperan entregas futuras: El pedido se vuelve a referenciar con 'Copiar de/a' tantas veces como sea necesario.",

        "Si no se esperan más entregas: Se debe Cerrar manualmente el documento o la línea individual para liberar la cantidad de 'Solicitado'."

      ]

    },

    "over_deliveries": {

      "scenario": "El proveedor entrega una cantidad superior a la contratada en el pedido.",

      "system_action": "Aumentar manualmente la cantidad en la línea de la Entrada de Mercancías respecto al pedido base.",

      "inventory_accounting_impact": "El stock y el asiento contable de compensación se calculan en base a la cantidad real recibida mayor."

    },

    "substituted_items": {

      "scenario": "El proveedor envía un artículo alternativo en sustitución de un producto agotado.",

      "system_action": [

        "Copiar las líneas de los artículos recibidos correctamente desde el pedido.",

        "Añadir una nueva línea independiente en la Entrada de Mercancías con el artículo sustituto.",

        "Cerrar la línea del artículo original en el Pedido de Compras base para no dejar pendiente la cantidad no entregada."

      ]

    },

    "po_closure_vs_cancellation": {

      "closed_po": {

        "status": "Closed ('C')",

        "audit_visibility": "SÍ aparece en el Informe de Análisis de Compras.",

        "applicability": "Pedidos con recepciones totales automáticas o recepciones parciales finalizadas manualmente."

      },

      "cancelled_po": {

        "status": "Cancelled ('C' con indicador de cancelación)",

        "audit_visibility": "NO aparece en el Informe de Análisis de Compras.",

        "applicability": "Pedidos que nunca tuvieron copias a documentos posteriores y cuyo acuerdo se abortó."

      }

    }

  }

}


3. Desarrollo Conceptual y Funcional Detallado
3.1. Naturaleza de las Incidencias en Recepción de Almacén
En las operaciones reales de la cadena de suministro, las entregas físicas rara vez coinciden de forma exacta e invariable con las órdenes de compra emitidas. Se presentan tres tipologías principales de discrepancia:

Entregas Parciales (Cantidad Insuficiente / Under-Delivery).
Entregas Excedentes (Mayor Cantidad / Over-Delivery).
Sustitución de Mercancías (Artículos Diferentes / Item Substitution).

SAP Business One proporciona flexibilidad para registrar con exactitud legal lo que ingresa físicamente al almacén, asegurando que la factura posterior coincida exactamente con las cantidades recepcionadas y no con lo proyectado originalmente.

                           +-----------------------------------------------+

                           | Discrepancias en Entrada de Mercancías (GRPO) |

                           +-----------------------------------------------+

                                                   |

         +-----------------------------------------+-----------------------------------------+

         |                                         |                                         |

         v                                         v                                         v

 [ 1. Entrega Parcial ]                   [ 2. Entrega Excedente ]                 [ 3. Sustitución de Ítem ]

- Ajustar cantidad hacia abajo           - Incrementar cantidad en línea          - Copiar líneas conformes

- Pedido queda Abierto                   - Actualiza stock por total real          - Añadir fila de ítem sustituto

- Cerrar PO si no habrá más entregas     - Cierra el pedido base                  - Cerrar fila original en PO
3.2. Gestión de Entregas Parciales
Cuando el albarán del transportista contiene menos unidades que el Pedido de Compras:

Procedimiento Operativo: El recepcionista copia el Pedido (OPOR) a la Entrada de Mercancías (OPDN), y en la columna Cantidad, sobrescribe el valor por las unidades efectivamente recibidas en el muelle.
Efectos en el Pedido Base:
El pedido permanece con estatus Abierto (DocStatus = 'O').
En la línea del pedido, el campo Cantidad Pendiente (OpenQty) se actualiza reflejando la diferencia pendiente de entrega.
La cantidad pendiente continúa sumando en la columna Solicitado (OnOrder) de la ficha de inventario.
Opciones de Continuidad:
Caso A: Habrá entregas posteriores. Cuando llegue el siguiente despacho del proveedor, se abre una nueva Entrada de Mercancías y se vuelve a copiar el mismo pedido. El sistema solo arrastrará el saldo pendiente. Un pedido puede referenciarse múltiples veces mientras tenga líneas abiertas.
Caso B: No se esperan más entregas (Finiquito de orden). Si el proveedor informa que no despachará el saldo, se debe proceder a Cerrar el Pedido:
Se puede cerrar el documento completo haciendo clic derecho -> Cerrar.
Se puede cerrar una línea individual específica haciendo clic derecho sobre el número de fila -> Cerrar línea. Esto es fundamental cuando el pedido contiene otros artículos que aún están pendientes de entrega.
Al cerrar el pedido o la línea, la cantidad no entregada se retira inmediatamente de Solicitado, ajustando la disponibilidad proyectada de la empresa.
3.3. Gestión de Entregas Excedentes (Over-Delivery)
Cuando el proveedor despacha más unidades de las ordenadas (ej. embalajes indivisibles o excedentes de fabricación):

Procedimiento: Al copiar el pedido a la Entrada de Mercancías, el usuario incrementa la cifra en la columna Cantidad para reflejar las unidades físicas recibidas.
Efecto Contable y en Inventario:
El stock físico (OnHand) se incrementa por la cantidad mayor total.
El asiento contable de compensación (OJDT) reconoce el pasivo no devengado por el valor total recibido.
El Pedido de Compras base queda completamente referenciado y cambia su estado a Cerrado.
3.4. Gestión de Sustitución de Artículos
Ocurre cuando el proveedor no cuenta con el artículo solicitado y, previo acuerdo, envía un modelo equivalente o superior:

Procedimiento en Dos Pasos:
En la Entrada de Mercancías (OPDN):
Se copian desde el pedido únicamente los artículos que sí llegaron conformes.
En una nueva fila vacía, se introduce manualmente el código del artículo sustituto, su cantidad recibida y su precio acordado.
Se añade la Entrada de Mercancías. El inventario del artículo sustituto ingresa correctamente al almacén.
En el Pedido de Compras Base (OPOR):
La línea del artículo que fue sustituido permanecerá abierta si no se gestiona.
El usuario debe abrir el Pedido original, situarse en la fila del artículo no entregado, hacer clic derecho y seleccionar Cerrar línea. De este modo, se evita que el sistema mantenga una falsa expectativa de stock solicitado.
3.5. Comparativa Técnica: Cerrar Pedido vs. Cancelar Pedido


4. Caso de Negocio Resuelto: OEC Computers
Contexto Empresarial
OEC Computers emite el Pedido de Compras Nº 600 al proveedor V10000 - Far East Imports con el siguiente detalle de componentes:

Línea 1: 10 unidades de Artículo A001 (Memoria RAM 16GB) a $50.00 c/u.
Línea 2: 15 unidades de Artículo B002 (Disco SSD 1TB) a $80.00 c/u.
Línea 3: 2 unidades de Artículo C003 (Gabinete Gamer RGB) a $120.00 c/u.
Llegada del Envío y Gestión de Discrepancias
El transportista llega con la guía de remisión física que presenta las siguientes novedades:

De A001, solo entrega 6 unidades (quedan 4 pendientes).
De B002, entrega 20 unidades (5 adicionales enviadas por el proveedor en promoción).
De C003, no entrega ninguna unidad porque está descontinuado; en su lugar, entrega 2 unidades del modelo nuevo D004 (Gabinete Gamer Pro) al mismo precio acordado de $120.00.
Resolución Paso a Paso en SAP Business One
Elaboración de la Entrada de Mercancías Nº 950:
El recepcionista abre una Entrada de Mercancías y selecciona Copiar de -> Pedidos, eligiendo el Pedido Nº 600.
Modificación Línea 1 (A001): Cambia la cantidad de 10 a 6 unidades.
Modificación Línea 2 (B002): Cambia la cantidad de 15 a 20 unidades.
Eliminación Línea 3 (C003): Elimina la fila de C003 de la Entrada de Mercancías porque no llegó físicamente.
Inserción de Línea 4 (D004): Añade manualmente la fila para el artículo D004 por 2 unidades a $120.00 c/u.
Se añade la Entrada de Mercancías Nº 950.
Impacto Inmediato en Almacén y Asiento:
A001: +6 en stock físico; B002: +20 en stock físico; D004: +2 en stock físico.
Asiento contable de existencias generado por: $$\text{Total} = (6 \times 50) + (20 \times 80) + (2 \times 120) = 300 + 1600 + 240 = 2,140.00 \text{ USD}$$
Mantenimiento del Pedido Base Nº 600:
El comprador consulta el Pedido Nº 600:
La Línea 2 (B002) está cerrada automáticamente por sobrentrega.
La Línea 1 (A001) tiene 4 unidades pendientes en estado Abierto (se esperan la próxima semana).
La Línea 3 (C003) tiene 2 unidades abiertas. Como el proveedor ya no fabricará este modelo, el comprador hace clic derecho sobre la fila 3 y selecciona Cerrar línea.
Resultado: Las 2 unidades de C003 se eliminan de Solicitado, evitando que el sistema Planificador de Necesidades (MRP) asuma falsamente que ingresarán existencias.


5. Banco de Evaluación Situacional (Certificación SAP B1)
Pregunta 1
Un proveedor realiza una entrega parcial de 40 unidades sobre un Pedido de Compras de 100 unidades. El comprador es informado de que las 60 unidades restantes han sido canceladas por el fabricante y nunca serán entregadas. ¿Cuál es la acción recomendada para evitar inconsistencias en el informe de inventario disponible?

A) Cancelar la Entrada de Mercancías de 40 unidades registrada previamente.
B) Cerrar manualmente el Pedido de Compras para liberar las 60 unidades de la columna "Solicitado".
C) Registrar una Factura de Proveedores por las 100 unidades y luego emitir un abono.
D) Borrar el Pedido de Compras de la base de datos utilizando el Asistente de Limpieza de Datos.
Respuesta Correcta: B
Justificación Técnica: Si no se van a recibir las unidades pendientes de un pedido parcial, el documento debe cerrarse manualmente. Esto cambia su estado a Cerrado y resta inmediatamente las unidades no recibidas de OITW.OnOrder (Solicitado), reflejando el stock disponible real.
Pregunta 2
¿Cuál es la diferencia crítica entre un Pedido de Compras "Cerrado" y un Pedido de Compras "Cancelado" en relación con los informes gerenciales de SAP Business One?

A) Los pedidos cancelados generan asientos de pérdida en contabilidad, mientras que los cerrados no.
B) Los pedidos cerrados aparecen en el Informe de Análisis de Compras, mientras que los pedidos cancelados son excluidos de dicho informe.
C) Los pedidos cerrados se pueden reactivar y copiar, mientras que los cancelados quedan protegidos contra escritura.
D) No existe ninguna diferencia funcional; son términos sinónimos en el sistema.
Respuesta Correcta: B
Justificación Técnica: Los pedidos cerrados reflejan compromisos de negocio que completaron su ciclo operativo (o se finiquitaron formalmente) y por ello se incluyen en las estadísticas del Análisis de Compras. Los pedidos cancelados representan operaciones anuladas antes de su ejecución y se excluyen para no desvirtuar los indicadores de gestión.
Pregunta 3
Un almacén recibe 15 unidades de un producto cuando el Pedido de Compras original estipulaba únicamente 10 unidades. La empresa decide aceptar el excedente. ¿Cómo debe procesarse esta recepción en SAP Business One?

A) El sistema bloquea automáticamente cualquier intento de recepción que supere la orden base.
B) Al copiar el Pedido a la Entrada de Mercancías, se modifica la cantidad de la línea a 15 unidades; el sistema incrementará el stock en 15 y cerrará el pedido base.
C) Se debe crear una Entrada de Mercancías por 10 unidades vinculada al pedido y una Entrada de Inventario independiente por las 5 unidades sobrantes.
D) Se debe emitir una Solicitud de Devolución obligatoriamente.
Respuesta Correcta: B
Justificación Técnica: SAP Business One permite incrementar manualmente la cantidad en las líneas de la Entrada de Mercancías copiada para reflejar sobreentregas reales. Al añadirse, se valorizan las 15 unidades y el pedido base queda completamente atendido y cerrado.
Pregunta 4
Al recibir mercancías, el proveedor entrega un modelo equivalente en sustitución del artículo original que se encontraba agotado. ¿Cuál es el procedimiento técnico estándar para procesar este cambio en compras?

A) Modificar la descripción del artículo en el maestro de artículos original.
B) En la Entrada de Mercancías, ingresar la nueva fila con el artículo sustituto y posteriormente cerrar la línea del artículo original en el Pedido de Compras base.
C) Registrar una Nota de Crédito por el artículo original antes de crear la Entrada de Mercancías.
D) Facturar el documento como tipo Servicio para omitir el control de artículos.
Respuesta Correcta: B
Justificación Técnica: La Entrada de Mercancías debe capturar el código real del artículo sustituto para asignarle stock y costo en su propio maestro OITM. Paralelamente, en el Pedido base se debe cerrar la línea del artículo original que no se recibirá para extinguir la cantidad solicitada abierta.
Pregunta 5
¿Bajo qué condición estricta permite SAP Business One "Cancelar" un Pedido de Compras?

A) Únicamente si el proveedor autoriza la cancelación mediante un correo electrónico adjunto.
B) Solo si el pedido nunca ha sido copiado a un documento posterior (como Entrada de Mercancías o Factura).
C) Solo si el período contable en que se creó el pedido ya ha sido cerrado.
D) Solo si el pedido fue creado a través del módulo de MRP.
Respuesta Correcta: B
Justificación Técnica: Un pedido de compras solo admite la opción de Cancelar si se encuentra en estado íntegramente abierto sin ninguna línea copiada total o parcialmente a documentos de destino. Si ya tuvo movimientos derivados, la única opción es Cerrar el saldo remanente.