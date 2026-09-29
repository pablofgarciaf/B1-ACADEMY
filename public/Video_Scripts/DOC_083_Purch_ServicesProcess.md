# Guion de Video: DOC 083 Purch ServicesProcess

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 083 Purch ServicesProcess.

## Contenido Principal (Visual: Diapositivas correspondientes)
DOC_083: Proceso de Compra de Servicios y Transacciones Periódicas
1. Metadatos Técnicos y Contexto Curricular
Módulo SAP Business One: Gestión de Compras / Cuentas por Pagar (Purchasing - A/P).
Código de Archivo Fuente: 10_Purch_14_Process_Services.pdf.
Versión del Sistema: SAP Business One 10.0 (HANA / SQL).
Nivel Curricular: Nivel 1 - Gestión de Compras Intangibles, Servicios y Automatización Periódica.
Audiencia Objetivo: Contadores de Cuentas por Pagar, Jefes de Finanzas, Administradores de Contratos, Consultores Funcionales.


2. JSON Antigravity Master Schema
{

  "antigravity_schema_version": "2.0.0",

  "unit_id": "SAP_B1_PURCH_083",

  "unit_title": "Compra de Servicios y Transacciones Periódicas",

  "technical_metadata": {

    "module": "Purchasing - A/P",

    "document_types": ["Service Type Document", "Item Type Document (Non-Inventory Item)"],

    "database_tables": {

      "marketing_documents": {

        "ap_invoice_header": "OPCH",

        "ap_invoice_lines": "PCH1",

        "purchase_order_header": "OPOR",

        "purchase_order_lines": "POR1"

      },

      "master_data": ["OCRD", "OITM", "OACT", "OJDT", "JDT1"],

      "recurring_transactions": {

        "template_header": "OTOR",

        "template_lines": "TOR1",

        "template_transactions": "TOR2"

      }

    }

  },

  "menu_navigation_paths": {

    "ap_invoice": "Compras - Proveedores -> Factura de Proveedores",

    "purchase_order": "Compras - Proveedores -> Pedido de Compras",

    "recurring_transactions_templates": "Gestión -> Transacciones periódicas -> Modelos de transacciones periódicas",

    "recurring_transactions_execution": "Gestión -> Transacciones periódicas -> Transacciones periódicas",

    "duplicate_invoice_settings": "Gestión -> Inicialización del Sistema -> Parametrizaciones de Documento -> Ficha Por Documento -> Factura de Proveedores"

  },

  "business_logic_matrix": {

    "service_type_document": {

      "master_data_requirement": "Ninguno. No se requiere código de artículo en OITM.",

      "content_tab_structure": "Descripción en texto libre + Cuenta de Mayor de Gastos (OACT) + Total con impuestos.",

      "logistics_tab": "La dirección de envío por defecto es siempre la dirección corporativa de la empresa (OADM). No permite seleccionar almacén.",

      "inventory_impact": "Totalmente nulo. No registra cantidades físicas ni costo de inventario.",

      "mandatory_document": "La Factura de Proveedores (OPCH) es el único documento obligatorio."

    },

    "item_type_service_document": {

      "master_data_requirement": "Artículo creado en OITM con InvntItem='N', PrchseItem='Y', SellItem='Y'/'N'.",

      "content_tab_structure": "Código de artículo + Cantidad + Precio Unitario + Almacén virtual/imputación.",

      "advantages": [

        "Permite mezclar artículos físicos y servicios en el mismo documento comercial",

        "Control estadístico y de cantidades en informes analíticos de compras",

        "Precios predefinidos por lista de precios o acuerdos con proveedores"

      ]

    },

    "duplicate_invoice_validation": {

      "field_monitored": "OPCH.NumAtCard (Número de factura del proveedor)",

      "trigger": "Al intentar añadir una Factura de Proveedores con el mismo NumAtCard y CardCode ya existente en la base de datos.",

      "action": "Alerta bloqueante o informativa según configuración para evitar pagos duplicados."

    }

  }

}


3. Desarrollo Conceptual y Funcional Detallado
3.1. Dos Enfoques para la Compra de Servicios en SAP Business One
A diferencia de los bienes físicos que requieren recepción de muelle y control de existencias, los servicios abarcan conceptos intangibles como alquileres, consultoría, diseño web, seguros, suministros eléctricos o mantenimiento de oficinas.

SAP Business One permite gestionar servicios mediante dos arquitecturas complementarias:


                              +---------------------------------------------+

                              | ¿Cómo gestionar la compra de un servicio?  |

                              +---------------------------------------------+

                                                     |

                     +-------------------------------+-------------------------------+

                     |                                                               |

                     v                                                               v

      [ Documento Tipo Servicio ]                                     [ Documento Tipo Artículo ]

   - Sin dato maestro en OITM                                      - Requiere OITM (InvntItem = 'N')

   - Imputación directa a Cuenta Contable                          - Permite cantidades y precios predefinidos

   - Documento 100% exclusivo de servicios                         - Permite mezclar con bienes físicos

   - Ejemplo: Alquiler, Luz, Tasas Municipales                    - Ejemplo: Consultoría por horas, Flete
3.2. Ciclo con y sin Pedido de Compras
Servicios con Pedido de Compras (OPOR): Apropiado para servicios de alcance definido y presupuesto formal (ej. desarrollo web, jardinería anual, remodelación). Permite dejar asentadas las condiciones, el precio pactado y las fechas de ejecución. Al recibir la factura del proveedor, se utiliza Copiar de -> Pedidos. La Entrada de Mercancías (OPDN) no suele utilizarse para servicios.
Servicios sin Pedido de Compras (Factura Directa OPCH): Para servicios periódicos o utilitarios (luz, agua, telefonía, arriendos). Al recibir la factura física o digital del proveedor, se ingresa directamente una Factura de Proveedores en el sistema.
3.3. Anatomía del Registro de una Factura de Servicios Directa
Selección de Socio de Negocios (CardCode): Carga automáticamente la dirección fiscal, condiciones de pago y cuenta de control en OCRD.
Definición del Tipo de Documento: En el encabezado del documento, en el campo Tipo de documento/artículo, se selecciona Servicio. Regla crítica: Este parámetro aplica a todo el documento y no puede modificarse una vez que el documento es guardado.
Ingreso de Referencias Legales:
Nº de referencia del acreedor (NumAtCard): El número de factura legal emitido por el proveedor.
Fecha de documento (DocDate) y Fecha de vencimiento (DocDueDate): Determinan la fecha tributaria y la programación de tesorería.
Ficha Contenido:
Se ingresa el texto explicativo del servicio (ej. "Arriendo de Oficinas Administrativas - Mes de Marzo").
Se selecciona la Cuenta de Mayor de Gasto (OACT, ej. 610020 - Arrendamientos y Alquileres).
Se indica el importe total del gasto y el indicador de impuestos correspondiente.
Validación contra Facturas Duplicadas: Al presionar Añadir, el motor de validación de SAP Business One verifica si ya existe una factura para ese mismo proveedor con el mismo número en el campo NumAtCard. Si existe, se muestra un mensaje de advertencia o bloqueo según las parametrizaciones de documento, impidiendo pagos duplicados involuntarios.
Efecto Contable Generado en OJDT:
Débito: Cuenta de Gasto seleccionada en la línea (OACT).
Débito: Cuenta de IVA Crédito Fiscal.
Crédito: Cuenta del Proveedor (OCRD.DebPayAcct - Pasivo exigible).
3.4. Automatización Mediante Transacciones Periódicas (Recurring Transactions)
Para contratos de servicios con tarifas periódicas estandarizadas (ej. cuota mensual de mantenimiento de software o contrato anual de alquiler en 12 cuotas fijas), SAP Business One incorpora el motor de Transacciones Periódicas.

Fase 1: Configuración del Modelo (Template en OTOR/TOR1):
Se define el nombre del modelo (ej. ALQUILER_EDIFICIO_CENTRAL).
Se selecciona el tipo de documento (Factura de Proveedores).
Se definen las líneas del documento (Proveedor, Cuenta de Gasto, Centro de Costos, Valor mensual).
Se establece la periodicidad: Diario, Semanal, Mensual, Trimestral, Semestral o Anual.
Se parametriza la fecha de inicio del ciclo y la fecha de caducidad (Válido hasta).
Fase 2: Ejecución y Alerta al Usuario:
Al iniciar sesión en SAP Business One en la fecha programada, o mediante la ventana Gestión -> Transacciones periódicas, el sistema presenta los modelos vencidos que requieren ejecución.
El usuario valida los datos y hace clic en Ejecutar.
El sistema genera automáticamente el documento transaccional real (OPCH) con su respectivo asiento contable en el libro mayor.


4. Caso de Negocio Resuelto: OEC Computers
Contexto Empresarial
OEC Computers arrienda una bodega logística adicional mediante un contrato anual que estipula un canon fijo mensual de $2,500.00 + 12% IVA, pagadero los primeros 5 días de cada mes al arrendador V40000 - Inmobiliaria Metropolitana. Además, la empresa contrata servicios eventuales de mantenimiento técnico de aire acondicionado por horas con el proveedor V50000 - ClimaTotal.
Implementación y Ejecución
Escenario A: Compra de Servicio Directo con Transacción Periódica (Alquiler)
El Administrador Financiero crea un Modelo de Transacción Periódica:
Nombre: CONTRATO_ALQUILER_BODEGA_2026
Documento: Factura de Proveedores - Tipo Servicio.
Línea: Cuenta 610500 - Alquileres de Inmuebles, Descripción: Canon Arriendo Bodega Norte, Importe: $2,500.00 + IVA ($300.00).
Recurrencia: Mensual, Día 1, Válido desde 01.01.2026 hasta 31.12.2026 (12 instancias).
El 1 de marzo de 2026, al abrir SAP B1, aparece la ventana de Transacciones Periódicas con la instancia de marzo pendiente. El contador introduce el número de factura entregado por el arrendador FACT-2026-03 en NumAtCard y pulsa Ejecutar.
Asiento Contable generado en firme:
Débito: 610500 - Alquileres de Inmuebles -> $2,500.00
Débito: 119010 - IVA Crédito Tributario -> $300.00
Crédito: 211010 - Proveedor Inmobiliaria Metropolitana -> $2,800.00
Escenario B: Compra de Servicio mediante Artículo No Inventariable
Se crea en OITM el código SRV-CLIMA - Mantenimiento Preventivo Climatización:
Casilla Artículo de inventario = Desmarcada (N).
Casilla Artículo de compra = Marcada (Y).
Se emite el Pedido de Compras Nº 450 a ClimaTotal por 10 horas de servicio técnico a $45.00/hora ($450.00 total) especificando fecha del servicio.
Tras la visita técnica, se copia el Pedido Nº 450 a la Factura de Proveedor Nº 889 por $450.00 + IVA.
Resultado:
El stock de SRV-CLIMA no aumenta.
El gasto se imputa a la cuenta asociada al grupo de artículos de servicio.
El sistema permite emitir reportes de compras acumuladas por el código SRV-CLIMA para negociar tarifas corporativas por volumen a fin de año.


5. Banco de Evaluación Situacional (Certificación SAP B1)
Pregunta 1
Un auxiliar contable necesita registrar una factura de un proveedor que contiene tanto computadoras portátiles para inventario como el costo de un servicio técnico de instalación y configuración. ¿Qué tipo de documento de compras debe seleccionar?

A) Debe crear un documento de tipo Servicio e ingresar las computadoras en las líneas de texto.
B) Debe utilizar un documento de tipo Artículo, asegurándose de que el servicio técnico esté configurado previamente como un dato maestro de artículo con la casilla "Artículo de inventario" desmarcada.
C) No es posible registrar bienes y servicios en el mismo documento; está obligado a registrar dos facturas separadas.
D) Debe utilizar el Asistente de Transacciones Periódicas.
Respuesta Correcta: B
Justificación Técnica: Los documentos de tipo Artículo permiten incluir artículos inventariables y artículos no inventariables (artículos de servicio con InvntItem = 'N'). En cambio, un documento configurado como tipo Servicio no admite códigos de artículo en sus líneas y no permite registrar bienes de stock.
Pregunta 2
Al registrar una Factura de Proveedores directa de tipo Servicio (sin documentos base previos), ¿cuál de las siguientes opciones describe con precisión el impacto contable e inventarial?

A) Se debita la cuenta de existencias y se acredita al proveedor; el stock disponible aumenta.
B) Se debita la cuenta de compensación de existencias y se acredita la cuenta bancaria.
C) Se debita la cuenta de mayor de gastos especificada en la línea del documento y se acredita la cuenta de control del proveedor; el inventario físico no sufre ningún cambio.
D) Se crea un asiento preliminar en borrador que requiere la emisión de una Entrada de Mercancías posterior.
Respuesta Correcta: C
Justificación Técnica: En los documentos tipo Servicio, el usuario asigna manualmente en cada línea la cuenta de mayor de resultados/gasto correspondiente. Al registrar la factura, se genera el débito al gasto (más IVA soportado) y el crédito a la cuenta asociada del proveedor en el pasivo, sin afectar en ningún momento tablas ni cantidades de stock.
Pregunta 3
¿Qué mecanismo nativo de SAP Business One previene que una empresa pague dos veces la misma factura emitida por una compañía de servicios públicos o un arrendador?

A) El bloqueo automático de socios de negocios inactivos.
B) La comprobación de números de factura duplicados que valida el campo Nº de referencia del acreedor (NumAtCard) para el mismo socio de negocios.
C) La conciliación bancaria externa automática.
D) El módulo de activos fijos virtuales.
Respuesta Correcta: B
Justificación Técnica: En Parametrizaciones de documento, se activa la verificación de números de referencia duplicados. Si se ingresa una factura con un valor en NumAtCard que ya existe para ese CardCode, el sistema dispara una alerta o impide la grabación del documento.
Pregunta 4
Una empresa suscribe un contrato de mantenimiento de servidores por 24 meses con pagos mensuales fijos. ¿Cuál es el procedimiento más eficiente para evitar digitar manualmente la factura cada mes?

A) Crear un Pedido de Compras con 24 líneas y copiar una línea cada mes.
B) Configurar un Modelo de Transacciones Periódicas de Factura de Proveedores con periodicidad mensual y rango de fechas de 24 meses.
C) Importar las facturas mediante Data Transfer Workbench cada semana.
D) Registrar un asiento manual recurrente en Contabilidad General sin utilizar el módulo de compras.
Respuesta Correcta: B
Justificación Técnica: Los Modelos de Transacciones Periódicas (OTOR) están diseñados específicamente para compras repetitivas a precio fijo, permitiendo programar la frecuencia y emitir la Factura de Proveedores en cada período con un solo clic.
Pregunta 5
¿Cuál es la restricción estructural más relevante al cambiar el parámetro "Tipo de documento/artículo" (Item/Service Type) en un documento de compras?

A) Solo los superusuarios pueden alternar entre Artículo y Servicio.
B) Aplica a nivel de cabecera para todo el documento y no puede ser modificado una vez que el documento ha sido guardado/añadido en la base de datos.
C) Exige que el proveedor tenga configurada una moneda extranjera.
D) Obliga a cerrar el período contable antes de grabar el cambio.
Respuesta Correcta: B
Justificación Técnica: La elección entre documento tipo Artículo y tipo Servicio define la estructura tabular de la ficha Contenido (campos de artículos y almacenes vs. descripción y cuentas de mayor). Esta definición rige a todo el documento y queda bloqueada permanentemente tras presionar Añadir.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
