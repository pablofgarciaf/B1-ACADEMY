DOC_085: Devoluciones de Mercancías, Abonos de Proveedores y Logística Inversa
1. Metadatos Técnicos y Contexto Curricular
Módulo SAP Business One: Gestión de Compras / Gestión de Inventarios y Contabilidad (Purchasing - A/P & Financials).
Código de Archivo Fuente: 10_Purch_22_Issues_ReturnsCM_ES.pdf.
Versión del Sistema: SAP Business One 10.0 (HANA / SQL).
Nivel Curricular: Nivel 1 - Procedimientos de Logística Inversa, Devoluciones y Correcciones Contables de Compras.
Audiencia Objetivo: Administradores de Almacén, Contadores de Cuentas por Pagar, Jefes de Calidad, Consultores Funcionales.


2. JSON Antigravity Master Schema
{

  "antigravity_schema_version": "2.0.0",

  "unit_id": "SAP_B1_PURCH_085",

  "unit_title": "Devoluciones de Mercancías y Abonos de Proveedores",

  "technical_metadata": {

    "module": "Purchasing - A/P",

    "sap_object_types": [

      {"object_name": "Goods Return Request", "object_type_code": "234000028", "table_header": "OPRR", "table_lines": "PRR1"},

      {"object_name": "Goods Return", "object_type_code": "21", "table_header": "ORPD", "table_lines": "RPD1"},

      {"object_name": "A/P Credit Memo", "object_type_code": "19", "table_header": "ORPC", "table_lines": "RPC1"},

      {"object_name": "Goods Receipt PO", "object_type_code": "20", "table_header": "OPDN", "table_lines": "PDN1"},

      {"object_name": "A/P Invoice", "object_type_code": "18", "table_header": "OPCH", "table_lines": "PCH1"}

    ],

    "master_data_tables": ["OCRD", "OITM", "OITW", "OACT", "OJDT", "JDT1"]

  },

  "menu_navigation_paths": {

    "goods_return_request": "Compras - Proveedores -> Solicitud de Devolución de Mercancías",

    "goods_return": "Compras - Proveedores -> Devolución de Mercancías",

    "ap_credit_memo": "Compras - Proveedores -> Abono de Proveedores",

    "document_cancellation": "Clic derecho sobre el documento abierto -> Cancelar"

  },

  "business_logic_matrix": {

    "goods_return": {

      "prerequisite": "Se utiliza cuando las mercancías ingresaron con una Entrada de Mercancías (OPDN) pero AÚN NO se ha registrado la Factura de Proveedores (OPCH).",

      "accounting_impact": "Asiento inverso a la EM: Débito a Cuenta de Compensación de Existencias (Allocation) / Crédito a Cuenta de Existencias.",

      "inventory_impact": "Reduce En Stock (-). Si se activa la reapertura del pedido, incrementa Solicitado (+) y Disponible (+).",

      "valuation_rule": "Si se crea sin documento base previo, un artículo de media variable se descarga al coste actual del maestro y no al precio digitado en el documento."

    },

    "ap_credit_memo": {

      "prerequisite": "Se utiliza DESPUÉS de haberse registrado la Factura de Proveedores (OPCH).",

      "standard_behavior": "Disminuye el saldo adeudado al proveedor y reduce la cantidad física del inventario valorizada a la cuenta de existencias.",

      "without_qty_posting": {

        "flag_field": "RPC1.WithoutQty (Sin contabilización de cantidad)",

        "use_case": "Descuentos omitidos, corrección de precios o reembolsos financieros sin devolución física de inventario.",

        "accounting_impact": "Corrige valores monetarios en el libro mayor (Débito a Proveedor / Crédito a Cuenta de Existencias o Diferencia de Precios) SIN alterar cantidades de stock en almacén."

      },

      "standalone_credit_memo": "Abono sin referencia. Se utiliza cuando la factura original ya fue pagada y cerrada, o cuando el crédito aplica a múltiples facturas consolidadas."

    },

    "goods_return_request": {

      "operational_role": "Documento preliminar de logística inversa para documentar el motivo y capturar el número de autorización de devolución de material (RMA).",

      "inventory_impact": "Incrementa 'Comprometido' y reduce 'Disponible' para apartar los artículos a devolver. No genera asientos contables.",

      "automation_routing": "Selecciona automáticamente si el documento destino debe ser Devolución de Mercancías (si viene de EM no facturada) o Abono de Proveedores (si viene de Factura)."

    },

    "cancellation_mechanism": {

      "action": "Genera automáticamente un documento espejo de Cancelación (ej. Cancelación de Entrada de Mercancías).",

      "status": "Tanto el documento original como el de cancelación quedan cerrados y reconciliados al 100%. Reabre automáticamente el Pedido de Compras base."

    }

  }

}


3. Desarrollo Conceptual y Funcional Detallado
3.1. Arquitectura de Corrección y Devolución en Compras
Cuando los artículos entregados por un proveedor resultan defectuosos, no cumplen los estándares de calidad o sufren averías en el transporte, SAP Business One cuenta con dos rutas de resolución técnica dependiendo del estado de la facturación:

                            ¿Se ha registrado ya la Factura de Proveedores (OPCH)?

                                                     |

                     +-------------------------------+-------------------------------+

                     | NO                                                            | SÍ

                     v                                                               v

         [ Devolución de Mercancías ]                                    [ Abono de Proveedores ]

               (Tabla: ORPD)                                                   (Tabla: ORPC)

   - Compensa la Entrada de Mercancías (OPDN)                      - Reversa la Factura de Proveedor (OPCH)

   - Reversa Asiento de Existencias vs Compensación                 - Disminuye la cuenta por pagar al proveedor

   - Disminuye stock físico en almacén                             - Disminuye stock físico (o solo precio)
3.2. Solicitud de Devolución de Mercancías (Goods Return Request - OPRR)
Propósito: Es un documento de paso intermedio introducido para agilizar y estructurar la logística inversa sin requerir que los operarios de almacén investiguen el estado contable de la compra.
Funcionalidad Inteligente:
Se puede crear tomando como base una Entrada de Mercancías de Pedido (OPDN) o una Factura de Proveedores (OPCH).
Al copiar la solicitud al documento de ejecución final, el sistema elige automáticamente el documento correcto: si la compra no está facturada genera una Devolución de Mercancías; si ya está facturada genera un Abono de Proveedores.
Control de Autorización RMA y Motivos:
Permite capturar el código RMA (Return Merchandise Authorization) entregado por el fabricante o proveedor.
Registra formalmente los motivos de devolución (daño de fábrica, vencimiento, golpe en transporte).
Impacto en Inventario: $$\text{Cantidad Disponible} = \text{En Stock} - \text{Comprometido} + \text{Solicitado}$$ Al registrar la solicitud de devolución, el sistema incrementa la cantidad en la columna Comprometido (IsCommited) por las unidades defectuosas y disminuye la cantidad Disponible. Esto asegura que los vendedores no comprometan ni vendan productos que están apartados en la zona de cuarentena para ser devueltos al proveedor. No tiene efectos contables en OJDT.
3.3. Devolución de Mercancías (Goods Return - ORPD)
Momento de Aplicación: Se utiliza cuando los artículos ingresaron al stock con una Entrada de Mercancías, pero la factura del proveedor aún no ha sido registrada.
Efecto Contable (Inventario Permanente): Actúa como el documento espejo de compensación de la Entrada de Mercancías:
Débito: Cuenta de Compensación de Existencias / Asignación (Allocation Account).
Crédito: Cuenta de Existencias / Inventario (OACT).
Resultado: El pasivo transitorio pendiente queda liquidado en cero y el activo de inventario se reduce.
Efecto en Almacén: Se descargan las cantidades físicas del stock (OnHand - Qty).
Reapertura del Pedido Base: En Parametrizaciones de documento, se puede habilitar la casilla para permitir que, al generar una Devolución de Mercancías, el Pedido de Compras base original se vuelva a abrir automáticamente, sumando las unidades a Solicitado para esperar un reemplazo por parte del proveedor.
Regla de Costeo sin Base: Si se crea una Devolución de Mercancías directa (sin documento base), para artículos con método de Media Variable, el sistema no toma el precio escrito por el usuario en la línea sino el coste actual calculado en el maestro del artículo, protegiendo el kardex contable contra distorsiones.
3.4. Abono de Proveedores (A/P Credit Memo - ORPC)
Momento de Aplicación: Se utiliza cuando la Factura de Proveedores (OPCH) ya fue registrada en el sistema. Una vez facturada una Entrada de Mercancías, el sistema bloquea cualquier intento de emitir una Devolución de Mercancías sobre ella, obligando a utilizar el Abono.
Efecto Contable Estándar:
Débito: Cuenta de Control del Proveedor (OCRD.DebPayAcct - Disminuye la deuda comercial).
Crédito: Cuenta de Existencias / Inventario (Descarga el costo de los bienes devueltos).
Crédito: Cuenta de IVA Crédito Tributario (Reversa el impuesto soportado proporcional).
Modalidad: Abono sin Contabilización de Cantidad (Without Qty Posting):
Uso: Diferencias de precio facturadas de más, descuentos comerciales omitidos en la factura o bonificaciones donde no hay devolución física de mercancías.
Mecánica: En la línea del Abono de Proveedores, se marca la casilla Sin contabilización de cantidad.
Efecto: Corrige exclusivamente los valores monetarios en el Libro Mayor (disminuyendo el saldo a pagar al proveedor y ajustando el costo del inventario o cuenta de diferencias) sin tocar las cantidades físicas en almacén.
Abono de Proveedores sin Referencia:
Casos obligatorios:
Cuando la Factura de Proveedores original ya fue pagada por tesorería y se encuentra cerrada.
Cuando un único crédito otorgado por el proveedor compensa artículos distribuidos en múltiples facturas distintas.
Al no tener factura base, el abono reduce el saldo global del proveedor y valoriza los artículos descargados al costo actual de inventario.
3.5. Cancelación Nativa de Documentos
En lugar de crear notas de crédito o devoluciones, SAP Business One permite hacer clic derecho sobre una Entrada de Mercancías o Factura y seleccionar Cancelar:

El sistema crea automáticamente un documento de anulación con fecha contable del día.
El documento original y el de cancelación se cierran y concilian mutuamente.
El Pedido de Compras base se reabre automáticamente para permitir una nueva recepción limpia.


4. Caso de Negocio Resuelto: OEC Computers
Contexto Empresarial
OEC Computers adquirió 50 cajas de auriculares profesionales modelo AUD-PRO al proveedor V20000 - CyberTech Wholesale a un costo de $100.00 por caja ($5,000.00 total) + 10% IVA ($500.00).
Escenario A: Devolución Inmediata de Escáneres (Sin Factura)
Previamente se recibieron 20 escáneres con la Entrada de Mercancías Nº 330.
Control de calidad detecta que 2 escáneres sufrieron rotura de chasis en el viaje. Aún no llega la factura.
El bodeguero genera una Solicitud de Devolución de Mercancías Nº 45 por 2 escáneres, indicando el motivo "Daño en transporte" y el código RMA RMA-8841.
En stock: 20
Comprometido: +2
Disponible: $20 - 2 = 18$ unidades.
Al despachar los 2 escáneres en el camión de logística inversa, se copia la solicitud a una Devolución de Mercancías Nº 112.
Asiento generado ($200.00):
Débito: 211050 - Compensación de Existencias -> $200.00
Crédito: 140000 - Inventario de Mercaderías -> $200.00
En stock: 18 unidades. La cuenta puente queda cuadrada para esperar la factura solo por 18 escáneres.
Escenario B: Abono por Defecto Oculto tras Registro de Factura
De las 50 cajas de auriculares AUD-PRO, el proveedor envió la Factura Nº 778 por $5,000.00 + $500.00 IVA = $5,500.00, la cual fue registrada en SAP B1.
Al día siguiente, antes de emitir el pago, el equipo de pruebas descubre que 5 cajas tienen fallas eléctricas irreparables.
Como la factura ya está contabilizada, el usuario genera un Abono de Proveedores Nº 205 copiando la Factura Nº 778 por las 5 cajas defectuosas ($500.00 base + $50.00 IVA).
Asiento Contable generado por el Abono:
Débito: 211010 - Proveedor CyberTech Wholesale -> $550.00 (Reduce la deuda de $5,500 a $4,950)
Crédito: 140000 - Inventario de Mercaderías -> $500.00 (Salen 5 cajas físicas)
Crédito: 119010 - IVA Crédito Tributario -> $50.00
Escenario C: Abono por Descuento Omitido (Sin Mover Stock)
Para otra compra de 10 unidades a $100.00 c/u (Total $1,000.00), el proveedor olvidó aplicar un 10% de descuento acordado por pronto pago ($100.00 de descuento). La factura ya fue pagada.
El proveedor envía una nota de crédito por $100.00.
El contador crea un Abono de Proveedores directo, selecciona el artículo, coloca el valor de $100.00 y marca la casilla Sin contabilización de cantidad.
Resultado:
Débito: 211010 - Proveedor -> $100.00 (Saldo a favor en cuenta corriente).
Crédito: 140000 - Inventario de Mercaderías (o cuenta de desviación) -> $100.00.
Las unidades físicas en almacén permanecen intactas en 10 unidades.


5. Banco de Evaluación Situacional (Certificación SAP B1)
Pregunta 1
Una empresa recibe 25 unidades de un producto mediante una Entrada de Mercancías de Pedido. Antes de registrar la Factura de Proveedores, el departamento de control de calidad determina que 3 unidades están defectuosas y deben devolverse inmediatamente al proveedor. ¿Qué documento se debe utilizar para procesar esta salida de inventario?

A) Abono de Proveedores (A/P Credit Memo).
B) Devolución de Mercancías (Goods Return).
C) Salida de Inventario interna (Goods Issue).
D) Reclamación de Garantía en Servicios.
Respuesta Correcta: B
Justificación Técnica: La Devolución de Mercancías (ORPD) es el documento específico diseñado para compensar física y contablemente una Entrada de Mercancías (OPDN) cuando la factura del proveedor aún no ha sido registrada en el sistema.
Pregunta 2
¿Qué ventaja funcional aporta el uso de la "Solicitud de Devolución de Mercancías" frente a la creación manual directa de una Devolución o un Abono?

A) Permite autorizar automáticamente transferencias bancarias internacionales.
B) El documento selecciona de forma automática el documento de destino adecuado (Devolución de Mercancías o Abono de Proveedores) evaluando si la compra ya fue facturada, e incrementa el stock "Comprometido" para apartar los artículos.
C) Elimina la necesidad de contar con inventario permanente en la base de datos.
D) Bloquea al proveedor en el maestro de interlocutores comerciales.
Respuesta Correcta: B
Justificación Técnica: La Solicitud de Devolución de Mercancías (OPRR) actúa como enrutador inteligente: si el documento base es una EM sin facturar, propone una Devolución de Mercancías; si el documento base es una Factura, propone un Abono. Además, reserva las unidades devueltas aumentando el valor en Comprometido.
Pregunta 3
Un proveedor emite una nota de crédito financiera a favor de su empresa debido a un error en el porcentaje de descuento comercial aplicado en una factura de compras previa. Los productos recibidos originalmente se encontraban en perfecto estado y permanecen en almacén. ¿Cómo debe registrarse el Abono de Proveedores en SAP Business One?

A) Ingresando el abono y marcando la casilla "Sin contabilización de cantidad" en las líneas afectadas.
B) Registrando una Entrada de Mercancías adicional con cantidad negativa.
C) Creando una Factura de Proveedores de tipo Servicio en negativo.
D) Modificando el precio histórico en la Entrada de Mercancías original.
Respuesta Correcta: A
Justificación Técnica: La casilla Sin contabilización de cantidad (RPC1.WithoutQty) permite procesar abonos monetarios por diferencias de precios o descuentos, ajustando el saldo financiero con el proveedor y el libro mayor sin reducir erróneamente las existencias físicas en el almacén.
Pregunta 4
¿En qué circunstancias es estrictamente obligatorio registrar un Abono de Proveedores sin referenciar a una factura base (Abono sin documento base)?

A) Cuando los artículos a devolver tienen número de serie obligatorio.
B) Cuando la Factura de Proveedores original ya ha sido pagada y cerrada, o cuando el abono otorgado por el proveedor abarca artículos correspondientes a múltiples facturas diferentes.
C) Cuando el monto del abono supera los $5,000.00 USD.
D) Únicamente en los primeros tres días del ejercicio contable.
Respuesta Correcta: B
Justificación Técnica: SAP Business One no permite utilizar Copiar de/a sobre facturas de proveedores cuyo estado contable esté cerrado (pagadas íntegramente), ni tampoco permite consolidar múltiples facturas en un único abono mediante copia directa. En tales casos, se debe emitir un abono sin base.
Pregunta 5
Cuando se utiliza la función nativa de "Cancelar" sobre una Entrada de Mercancías de Pedido errónea registrada el mismo día, ¿qué ocurre con el Pedido de Compras original que le dio origen?

A) El pedido de compras se cancela automáticamente y queda inutilizable.
B) El pedido de compras se vuelve a abrir automáticamente, permitiendo ser utilizado como documento base para generar una nueva Entrada de Mercancías correcta.
C) El pedido de compras se borra de la base de datos de SQL/HANA.
D) El pedido de compras queda congelado y solo un superusuario puede reasignarlo.
Respuesta Correcta: B
Justificación Técnica: El procedimiento de cancelación nativo genera un documento de anulación que compensa el asiento y el stock de la Entrada de Mercancías errónea, y de manera automatizada reabre el Pedido de Compras base (DocStatus = 'O') para que el almacén pueda efectuar la recepción correcta.