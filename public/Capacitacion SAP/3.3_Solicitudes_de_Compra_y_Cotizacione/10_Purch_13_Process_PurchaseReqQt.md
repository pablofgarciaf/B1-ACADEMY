DOC_082: Solicitudes de Compra y Ofertas de Compra (Purchase Requests & Quotations)
1. Metadatos Técnicos y Contexto Curricular
Módulo SAP Business One: Gestión de Compras / Aprovisionamiento (Purchasing - A/P).
Código de Archivo Fuente: 10_Purch_13_Process_PurchaseReqQt.pdf.
Versión del Sistema: SAP Business One 10.0 (HANA / SQL).
Nivel Curricular: Nivel 1 - Procesos Preliminares de Aprovisionamiento y Sourcing.
Audiencia Objetivo: Compradores Estratégicos, Jefes de Aprovisionamiento, Usuarios Solicitantes de Áreas Internas, Consultores Funcionales.


2. JSON Antigravity Master Schema
{

  "antigravity_schema_version": "2.0.0",

  "unit_id": "SAP_B1_PURCH_082",

  "unit_title": "Solicitudes de Compra y Ofertas de Compra",

  "technical_metadata": {

    "module": "Purchasing - A/P",

    "sap_object_types": [

      {"object_name": "Purchase Request", "object_type_code": "1470000113", "table_header": "OPRQ", "table_lines": "PRQ1"},

      {"object_name": "Purchase Quotation", "object_type_code": "540000006", "table_header": "OPQT", "table_lines": "PQT1"},

      {"object_name": "Purchase Order", "object_type_code": "22", "table_header": "OPOR", "table_lines": "POR1"}

    ],

    "master_data_tables": ["OCRD", "OITM", "ITM2", "OUSR", "OHEM", "OUDP"]

  },

  "menu_navigation_paths": {

    "purchase_request": "Compras - Proveedores -> Solicitud de Compra",

    "purchase_quotation": "Compras - Proveedores -> Oferta de Compra",

    "purchase_quotation_wizard": "Compras - Proveedores -> Asistente para Generación de Ofertas de Compra",

    "purchase_request_report": "Compras - Proveedores -> Informes de Compras -> Informe de Solicitudes de Compra",

    "purchase_quotation_comparison_report": "Compras - Proveedores -> Informes de Compras -> Cuadro Comparativo de Ofertas de Compra"

  },

  "business_logic_matrix": {

    "purchase_request": {

      "accounting_impact": "Ninguno. No genera asiento contable.",

      "inventory_impact": "Ninguno. No modifica Stock, Comprometido, Solicitado ni Disponible.",

      "operational_scope": "Requisición interna generada por cualquier empleado o usuario para notificar una necesidad de compra de bienes o servicios.",

      "key_fields": ["ReqType (171=Empleado, 12=Usuario)", "Requester (ID del solicitante)", "ReqDate (Fecha necesaria)", "DocDueDate (Válido hasta)", "SendEMail (Alerta por creación de PO o GRPO)"]

    },

    "purchase_quotation": {

      "accounting_impact": "Ninguno. No genera asiento contable.",

      "inventory_impact": "Ninguno. No altera niveles físicos ni planificados de stock.",

      "operational_scope": "Documento externo enviado a uno o más proveedores para solicitar precios, descuentos y plazos de entrega antes de formalizar el pedido.",

      "key_mechanisms": [

        "Carga individual manual o por copia de Solicitud de Compra",

        "Generación masiva mediante Asistente de Ofertas de Compra usando Proveedores Preferentes (ITM2)",

        "Cuadro comparativo para adjudicación y creación directa de Pedido al proveedor ganador"

      ]

    }

  }

}


3. Desarrollo Conceptual y Funcional Detallado
3.1. Rol de las Fases Preliminares en el Ciclo de Compras
Antes de la emisión vinculante de un Pedido de Compras (OPOR), las organizaciones requieren canalizar las necesidades internas de los empleados y explorar el mercado de proveedores para obtener las mejores condiciones comerciales.

+------------------------------------+         +------------------------------------+         +-----------------------+

| Solicitud de Compra (OPRQ)        | ------> | Oferta de Compra (OPQT)            | ------> | Pedido de Compras (OPOR)|

| Tipo: Requisición Interna          |         | Tipo: Cotización a Proveedores     |         | Tipo: Contrato Firme   |

| Solicitante: Usuario / Empleado    |         | Multi-proveedor / Comparación      |         | Ganador Adjudicado    |

+------------------------------------+         +------------------------------------+         +-----------------------+
3.2. Solicitud de Compra (Purchase Request / Requisition - OPRQ)
Naturaleza Operativa: Es un documento puramente administrativo interno. Permite que cualquier empleado de la compañía (incluso usuarios indirectos o sin perfil técnico en compras) notifique a compras que requiere artículos o servicios para una fecha límite determinada.
Beneficios de Control y Presupuesto:
Evita compras no autorizadas o duplicadas.
Reduce devoluciones de mercancías ocasionadas por especificaciones erróneas.
Facilita el seguimiento preventivo de gastos departamentales antes del compromiso formal de fondos.
Parámetros Clave en Cabecera y Líneas:
Tipo de Solicitante (ReqType): Define si quien solicita es un Usuario de SAP (User) o un Empleado de la empresa (Employee de la tabla OHEM).
Nombre del Solicitante, Sucursal y Departamento: Permite la imputación presupuestaria y centros de costos.
Fecha Necesaria (Required Date): Hito temporal en el que el bien debe estar disponible físicamente.
Válido Hasta (Valid Until): Fecha de caducidad tras la cual la solicitud no atendida expira.
Enviar Correo Electrónico: Casilla que dispara alertas nativas o correos automáticos al solicitante cuando se añade el Pedido de Compras o la Entrada de Mercancías vinculada.
Precio Informativo (Info Price): Precio de referencia estimado para valorizar la necesidad interna.
3.3. Informe de Solicitudes de Compra (Purchase Request Report)
Ruta de Acceso: Compras - Proveedores -> Informes de Compras -> Informe de Solicitudes de Compra.
Funcionalidad Estratégica: Es la consola de trabajo del comprador. En lugar de revisar solicitud por solicitud, el comprador ejecuta el reporte filtrando por fechas, solicitantes, grupos de artículos o proveedores sugeridos.
Acciones Directas desde el Reporte:
El comprador selecciona filas de múltiples solicitudes abiertas.
Puede agrupar solicitudes por Proveedor Preferente para no emitir pedidos fragmentados.
A través del menú desplegable Crear, puede generar directamente:
Ofertas de Compra (Purchase Quotations): Si requiere comparar cotizaciones.
Pedidos de Compra (Purchase Orders): Si el proveedor y precio ya están fijados.
Modificación de cantidades y proveedores in situ antes de la creación en firme.
3.4. Oferta de Compra (Purchase Quotation - OPQT)
Propósito: Registrar y auditar las cotizaciones solicitadas a los proveedores en el proceso de licitación o cotización libre (Sourcing).
Ciclo de Vida de la Cotización:
Emisión del documento con cantidades y fecha límite de respuesta (Valid Until).
Envío al proveedor (PDF por correo electrónico o integración electrónica).
Recepción de la respuesta del proveedor e ingreso de los precios ofertados, descuentos y fechas prometidas de entrega en la Oferta de Compra.
Métodos de Creación:
Manual: Documento independiente.
Copia desde Solicitud de Compra: Usando Copiar de o el Informe de Solicitudes.
Asistente de Generación de Ofertas de Compra (Purchase Quotation Generation Wizard): Herramienta automatizada para cotizaciones masivas.
3.5. Asistente para la Generación de Ofertas de Compra
Ubicación: Compras -> Asistente para generación de ofertas de compra.
Mecánica Operativa: Permite procesar de forma simultánea múltiples artículos y múltiples proveedores en un único flujo de trabajo.
Integración con Proveedores Preferentes (ITM2): En el dato maestro del artículo (OITM), pestaña Datos de compras, SAP Business One permite definir una lista de Proveedores Preferentes. El asistente lee automáticamente estos proveedores asociados a cada artículo y genera de forma desatendida $N$ Ofertas de Compra distintas (una por cada proveedor preferente involucrado).

                      +------------------------------------------+

                      | Asistente de Ofertas de Compra           |

                      | Artículos: Impresora A + Impresora B     |

                      +------------------------------------------+

                                     |

           +-------------------------+-------------------------+

           |                                                   |

           v                                                   v

+-----------------------+                           +-----------------------+

| Proveedor Preferente 1|                           | Proveedor Preferente 2|

| Oferta de Compra #101 |                           | Oferta de Compra #102 |

+-----------------------+                           +-----------------------+
3.6. Cuadro Comparativo de Ofertas de Compra (Purchase Quotation Comparison Report)
Propósito: Evaluar técnica y económicamente las ofertas recibidas.
Criterios de Comparación:
Precios unitarios y totales.
Condiciones de pago.
Descuentos comerciales.
Fecha prometida de entrega frente a la fecha requerida.
Adjudicación: Desde el propio cuadro comparativo, el comprador selecciona la oferta ganadora. Al hacer clic en el botón de adjudicación/crear pedido, el sistema genera automáticamente el Pedido de Compras (OPOR) para el proveedor seleccionado y marca o cierra las ofertas competidoras no favorecidas.


4. Caso de Negocio Resuelto: OEC Computers
Contexto Empresarial
El departamento de soporte comercial de OEC Computers va a iniciar una gira nacional de eventos (Sales Road Show).

Necesidad: 2 Tablets de alta gama modelo TAB-PRO01 con fecha límite de entrega requerida para el 15 de marzo.
Regla de Gobernanza: Toda compra que supere los $1,000.00 requiere aprobación de la Gerencia de Operaciones y la solicitud de cotizaciones a al menos 3 proveedores preferentes.
Flujo de Ejecución en SAP Business One
Paso 1: Solicitud de Compra Nº 105 por el Solicitante:
Solicitante: Jayson Butler (Empleado ID 12).
Línea: TAB-PRO01 - Cantidad: 2 - Fecha Requerida: 15.03.2026 - Precio Informativo: $650.00 c/u (Total estimado $1,300.00).
Al superar $1,000.00, el Procedimiento de Autorizaciones retiene la solicitud como Borrador (ODRF). La Gerencia aprueba el borrador y se convierte en Solicitud de Compra formal Nº 105.
Paso 2: Ejecución del Asistente de Generación de Ofertas de Compra:
El comprador selecciona la Solicitud Nº 105.
El artículo TAB-PRO01 tiene 3 proveedores preferentes en ITM2:
V10000 - Far East Imports
V20000 - CyberTech Wholesale
V30000 - MicroGlobal Supply
El asistente genera automáticamente 3 Ofertas de Compra: Oferta Nº 501, Oferta Nº 502 y Oferta Nº 503.
Paso 3: Carga de Cotizaciones Recibidas:
Oferta 501 (V10000): $640.00 c/u - Entrega: 18 de marzo (Fuera de fecha).
Oferta 502 (V20000): $610.00 c/u - Entrega: 14 de marzo (A tiempo y mejor precio).
Oferta 503 (V30000): $630.00 c/u - Entrega: 12 de marzo.
Paso 4: Adjudicación con el Cuadro Comparativo:
El comprador abre el Cuadro Comparativo de Ofertas de Compra, selecciona la Oferta Nº 502 del proveedor V20000 y pulsa Crear Pedido de Compras.
Se genera el Pedido Nº 820 por 2 unidades a $610.00 ($1,220.00 total) para CyberTech Wholesale.
El sistema cierra la Solicitud de Compra Nº 105 y envía una notificación automática por correo a Jayson Butler informándole que su pedido ha sido colocado.


5. Banco de Evaluación Situacional (Certificación SAP B1)
Pregunta 1
Un empleado crea una Solicitud de Compra en SAP Business One para pedir 5 monitores de diseño gráfico para su departamento. ¿Qué modificaciones se producen en las cifras de inventario del almacén principal?

A) La cantidad solicitada aumenta en 5 unidades y la cantidad disponible aumenta en 5 unidades.
B) La cantidad comprometida aumenta en 5 unidades para reservar los artículos en caso de que existan en stock.
C) No se produce ninguna modificación en las cifras de stock físico, comprometido, solicitado ni disponible.
D) El stock físico se reduce de inmediato en 5 unidades como reserva preventiva.
Respuesta Correcta: C
Justificación Técnica: La Solicitud de Compra (OPRQ) es un documento de requisición puramente interno. A diferencia del Pedido de Compras (OPOR), la solicitud no altera OnOrder (Solicitado) ni ninguna otra variable de inventario hasta que se formalice en un Pedido o en una orden de producción.
Pregunta 2
El departamento de compras necesita solicitar cotizaciones para 10 artículos diferentes a sus proveedores habituales. En el maestro de cada artículo ya se encuentran definidos tres proveedores preferentes. ¿Cuál es la herramienta más eficiente en SAP Business One para ejecutar esta tarea sin crear las cotizaciones una a una?

A) El Asistente de Confirmación de Aprovisionamiento desde un pedido de ventas.
B) El Asistente para la Generación de Ofertas de Compra.
C) La Lista de Partidas Abiertas filtrada por ofertas pendientes.
D) La función Arrastrar y Vincular (Drag & Relate).
Respuesta Correcta: B
Justificación Técnica: El Asistente para la Generación de Ofertas de Compra (Purchase Quotation Generation Wizard) procesa múltiples artículos y aprovecha la lista de proveedores preferentes (ITM2) de los datos maestros para crear de forma masiva y desatendida las ofertas correspondientes para cada proveedor.
Pregunta 3
¿Qué función permite a un comprador consolidar solicitudes de compra provenientes de diferentes empleados y sucursales en un único Pedido de Compras para el mismo proveedor?

A) El Asistente de Pagos.
B) El Informe de Solicitudes de Compra agrupando y seleccionando las líneas pertinentes antes de pulsar Crear -> Pedido de Compras.
C) El Asistente de Reconciliación Interna.
D) La ventana de Transacciones Periódicas.
Respuesta Correcta: B
Justificación Técnica: El Informe de Solicitudes de Compra proporciona una visión global donde el comprador puede filtrar, ordenar y agrupar por proveedor, seleccionando múltiples registros y generando un único documento de compras destino consolidado.
Pregunta 4
Al utilizar el Cuadro Comparativo de Ofertas de Compra, ¿qué acción realiza el sistema cuando el usuario selecciona una oferta específica y pulsa el botón para generar el Pedido de Compras?

A) Borra físicamente las demás ofertas de la base de datos para no consumir espacio en disco.
B) Crea el Pedido de Compras copiando los datos de la oferta adjudicada y permite cerrar o descartar las ofertas competidoras no seleccionadas.
C) Convierte automáticamente las ofertas perdedoras en notas de crédito de proveedores.
D) Actualiza el costo estándar del artículo en el catálogo maestro.
Respuesta Correcta: B
Justificación Técnica: El cuadro comparativo facilita la adjudicación comercial creando el documento firme (Pedido OPOR) con la oferta ganadora, preservando el histórico de cotizaciones en la base de datos para auditorías de compras.
Pregunta 5
¿Qué campo de la Solicitud de Compra permite notificar automáticamente al usuario cuando el departamento de compras finalmente genera el Pedido de Compras o cuando el almacén recibe la mercancía?

A) La casilla Enviar correo electrónico si se añade pedido o EM de pedido (SendEMail).
B) El indicador de impuestos en la ficha Logística.
C) La condición de pago en Finanzas.
D) El campo de Código de Unidad de Medida.
Respuesta Correcta: A
Justificación Técnica: En la cabecera de la Solicitud de Compra existe la casilla de verificación Enviar correo electrónico vinculada al correo del solicitante (E_Mail), la cual dispara automáticamente mensajes internos o vía SMTP cuando se añade un pedido o una entrada de mercancías vinculada.