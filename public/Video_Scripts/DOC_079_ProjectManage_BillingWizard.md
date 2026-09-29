# Guion de Video: DOC 079 ProjectManage BillingWizard

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 079 ProjectManage BillingWizard.

## Contenido Principal (Visual: Diapositivas correspondientes)
Unidad 079: Asistente de Generación de Documentos de Facturación de Proyectos en SAP Business One 10.0
Metadatos Técnicos
Módulo: Gestión de Proyectos y Facturación (Project Management & Billing)
Código de Documento: DOC_079_ProjectManage_BillingWizard
Audiencia Objetivo: Administradores de Contratos, Consultores de Ventas y Facturación, Responsables de Cuentas por Cobrar (A/R) y Jefes de Proyecto.
Prerrequisitos: Módulo de Gestión de Proyectos (Unidad 078), Hojas de Tiempo de Recursos Humanos (Time Sheet), Ciclo de Ventas y Compras, Tipos de Actividad CRM.
Versión SAP B1: SAP Business One 10.0 FP 2008 / HANA & SQL.


JSON Antigravity Master Schema
{

  "unit_id": "079",

  "document_code": "DOC_079_ProjectManage_BillingWizard",

  "topic": "Billing Document Generation Wizard, Billable Data Sources and Time Sheets",

  "module": "Project Management",

  "version": "10.0",

  "data_architecture": {

    "primary_tables": [

      {

        "table_name": "OPMG",

        "description": "Project Master Data (Registro maestro y consolidación de fuentes facturables)",

        "key_fields": ["AbsEntry", "NAME", "CARDCODE", "PrjCode", "STATUS"]

      },

      {

        "table_name": "OTSH / TSH1",

        "description": "Time Sheet Header and Lines (Registro de horas de empleados/usuarios por etapa y proyecto)",

        "key_fields": ["AbsEntry", "EmpID", "UserID", "DateFrom", "DateTo", "LineID", "ActType", "PrjCode", "StageID", "BillTime"]

      },

      {

        "table_name": "OACT",

        "description": "Activity Types Setup (Tipos de actividad, bandera 'Facturable' y artículo de mano de obra asociado)",

        "key_fields": ["ActType", "ActName", "LaborItem", "IsBillable", "IsAbsence"]

      },

      {

        "table_name": "OCLG",

        "description": "CRM Activities (Actividades de clientes vinculadas a etapas y tipos de actividad facturables)",

        "key_fields": ["ClgCode", "CardCode", "Action", "ActType", "PrjCode", "DocEntry"]

      },

      {

        "table_name": "OINV / INV1",

        "description": "A/R Invoice Header and Lines (Factura de clientes de destino generada por el asistente)",

        "key_fields": ["DocEntry", "DocNum", "CardCode", "DocTotal", "ItemCode", "Price", "Quantity"]

      },

      {

        "table_name": "ODLN / DLN1",

        "description": "A/R Delivery Header and Lines (Entrega de clientes de destino generada por el asistente)",

        "key_fields": ["DocEntry", "DocNum", "CardCode", "DocTotal", "ItemCode", "Price", "Quantity"]

      }

    ],

    "menu_navigation_paths": [

      "Gestión de proyectos -> Asistente para generación de documentos de facturación",

      "Menú contextual en Datos maestros de proyecto (Clic derecho en etapa) -> Asistente para generación de documentos de facturación",

      "Recursos humanos -> Hoja de tiempos",

      "Gestión -> Definición -> Gestión de proyectos -> Clases de actividad"

    ],

    "business_rules": [

      {

        "rule_id": "BR_BW_01",

        "name": "Chargeable Flag Mandatory Requirement",

        "description": "El asistente de facturación únicamente extrae transacciones y registros que hayan sido marcados explícitamente como 'Facturables' (Chargeable)."

      },

      {

        "rule_id": "BR_BW_02",

        "name": "Financial Project Code Matching",

        "description": "Solo los objetos (hojas de tiempo, actividades, documentos) que compartan el mismo código de Proyecto Financiero (OPRJ) asociado a los Datos Maestros de Proyecto son candidatos elegibles para facturación."

      },

      {

        "rule_id": "BR_BW_03",

        "name": "Post-Billing Immutability",

        "description": "Una vez que el documento de venta (Factura o Entrega) generado por el asistente es añadido al sistema, queda automáticamente vinculado a la etapa de destino, marcado como facturable y no puede volver a ser facturado en ejecuciones posteriores."

      }

    ]

  }

}


Desarrollo Conceptual y Funcional Detallado
1. Concepto del Asistente de Generación de Documentos de Facturación
El Asistente para Generación de Documentos de Facturación (Billing Document Generation Wizard) es una herramienta integral introducida para automatizar el ciclo Cost-to-Revenue en empresas que gestionan servicios profesionales, proyectos de integración técnica o construcción.

Permite recopilar en un solo proceso masivo todos los costos, insumos, órdenes de fabricación y horas de consultoría devengadas en un proyecto, transformándolos automáticamente en:

Una Factura de Clientes (OINV - A/R Invoice): Cuando se factura directamente el servicio o gasto al cliente.
Una Entrega de Clientes (ODLN - A/R Delivery): Cuando se requiere primero registrar la remisión o albarán logístico para despacho físico o posterior facturación agrupada.


2. Las 5 Fuentes de Datos Facturables (Billable Sources)
El asistente audita e integra cinco orígenes de datos distintos:

                          ┌─── Facturas de Proveedores (A/P Invoices: Gastos Reembolsables)

                          ├─── Cotizaciones, Pedidos y Entregas Abiertas (A/R Documents)

Fuentes Facturables ─────┼─── Órdenes de Fabricación Cerradas (Work Orders / Ensamble)

(Chargeable Sources)      ├─── Hojas de Tiempo de RRHH (Time Sheets: Horas de Técnicos)

                          └─── Actividades CRM (Reuniones, Visitas en Sitio)

                                            │

                                            ▼

                     [Billing Document Generation Wizard]

                                            │

                                            ▼

                       Factura de Clientes o Entrega (A/R)

Facturas de Proveedores (OPCH): Compras de repuestos, licencias o subcontrataciones efectuadas para el proyecto que se trasladan como gastos facturables al cliente.
Documentos Abiertos de Clientes (OQUT, ORDR, ODLN): Pedidos o presupuestos vinculados al proyecto que se cierran y copian hacia la factura o entrega generada.
Órdenes de Trabajo / Fabricación (OWOR): Equipos customizados o racks ensamblados en planta para el proyecto.
Hojas de Tiempo de Recursos Humanos (OTSH/TSH1): Horas laboradas por consultores y especialistas asignadas a la etapa del proyecto.
Actividades CRM (OCLG): Eventos de soporte, talleres técnicos o reuniones de seguimiento.


3. Mecanismos para Definir Registros como Facturables (Chargeable)
Para que un registro aparezca en el asistente de facturación, debe cumplir estrictamente con el criterio de Facturable (Chargeable), el cual se configura según el tipo de objeto:
A. En Documentos de Marketing y Órdenes de Trabajo
En los Datos Maestros de Proyecto (OPMG), al expandir la matriz inferior en las secciones Documento u Orden de trabajo, el usuario debe marcar manualmente la casilla de verificación Facturable (Chargeable) para cada fila específica que desee trasladar al cliente.
B. En Hojas de Tiempo y Actividades CRM: El Rol de la Clase de Actividad
Las horas de trabajo y las actividades de agenda no disponen de una casilla manual directa en cada línea, sino que su condición se hereda de la Clase de Actividad (Activity Type):

Ruta de Configuración: Gestión -> Definición -> Gestión de proyectos -> Clases de actividad.
Configuración del Maestro:
Nombre de la Actividad: Ej. "Consultoría Senior", "Soporte en Sitio", "Capacitación".
Casilla Facturable (Chargeable): Al activarse, habilita que cualquier registro que use este tipo sea elegible para facturar.
Artículo de Mano de Obra (Labor Item): Se debe asociar un código de artículo de venta no inventariable de tipo servicio o mano de obra (OITM.ItemCode, ej. L10001 - Tarifa por Hora de Consultoría). Este es el artículo que se insertará automáticamente en las líneas de la Factura o Entrega generada.
Casilla Ausencia: Permite reservar tipos de actividad para registrar vacaciones, bajas médicas o permisos sin impacto comercial.


4. La Hoja de Tiempos de Recursos Humanos (Time Sheet - OTSH)
La Hoja de Tiempos es el documento operativo donde empleados o usuarios registran el tiempo dedicado a las tareas de la empresa:

Cabecera: Se define si el registro es por Empleado o Usuario del sistema, y el rango de fechas de visualización.
Líneas de Detalle:
Fecha, Hora de Inicio y Hora de Fin: Calculan el tiempo transcurrido.
Clase de Actividad: Se selecciona una actividad (ej. "Consultoría"). Si es facturable, la columna Tiempo Facturable se completa automáticamente.
Proyecto Financiero: Se imputa el código del proyecto (OPRJ).
Etapa del Proyecto: Se selecciona el código unificado de la etapa (ej. Con1(6-1)).
Informes Directos: Desde los Datos Maestros de Proyecto, hacer clic derecho en la cabecera abre el informe consolidado de horas del proyecto; hacer clic derecho en una etapa específica abre el informe filtrado únicamente para dicha etapa.


5. Flujo Operativo del Asistente en 2 Pasos
Paso 1: Información de Destino y Fuentes
Acceso: Desde el menú principal o directamente haciendo clic derecho en una etapa del proyecto y seleccionando Asistente para generación de documentos de facturación.
Parámetros de Destino:
Documento a generar: Factura de Clientes o Entrega.
Proyecto y Etapa de Destino: El proyecto seleccionado actúa simultáneamente como fuente de costos y receptor del documento generado.
Selección de Tipos de Fuente: Casillas independientes para incluir Facturas de Proveedores, Documentos A/R abiertos, Órdenes de trabajo, Hojas de tiempo y Actividades.
Paso 2: Confirmación y Ejecución
El sistema presenta una grilla con todos los conceptos facturables pendientes encontrados para ese cliente y código de proyecto financiero.
El usuario puede revisar, desmarcar líneas individuales, o ajustar las cantidades facturables y la fecha de entrega.
Al presionar Finalizar (Finish):
El sistema genera el documento destino (OINV u ODLN) en Modo Crear (Add Mode).
El usuario puede realizar modificaciones finales de precios o textos.
Al hacer clic en Crear, el documento se graba en firme, se enlaza automáticamente a la etapa de destino del proyecto y sus partidas quedan bloqueadas contra refacturaciones.


Caso de Negocio Resuelto: OEC Computers
Contexto
OEC Computers culminó la fase de despliegue del proyecto de centro de datos para el cliente Maxi Teq (C20000). La jefa de proyectos, Kate Milton, debe consolidar y facturar los gastos y servicios incurridos durante el mes.
Componentes Facturables Acumulados
Compras de Hardware: Factura de proveedores (OPCH 405) por repuestos de fibra óptica: $1,200 USD. Marcada como Facturable en la etapa 4.
Servicios de Consultoría e Instalación:
Michael (Técnico Senior): 5 horas de "Consultoría en Sitio" registradas en su Hoja de Tiempos, vinculadas a la etapa Con1(6-1).
Kate Milton (PM): 3 horas de "Revisión Arquitectónica" en su Hoja de Tiempos.
La Clase de Actividad "Consultoría" está configurada como Facturable y apunta al artículo L10001 (Tarifa Horaria: $100.00 USD/hr).
Total Horas Facturables: 8 horas $\times$ $100.00 = $800.00 USD.
Reunión de Comité de Control: Actividad CRM tipo Reunión en sitio con el cliente, registrada con la clase "Consultoría": 2 horas $\times$ $100.00 = $200.00 USD.
Ejecución del Asistente
Kate abre los Datos Maestros del Proyecto MaxiTeq_DC, hace clic derecho en la etapa 4 y selecciona el Asistente de Facturación.
Selecciona como destino Factura de Clientes.
En el Paso 2, el asistente consolida:
Línea 1: Repuestos de fibra óptica ($1,200.00 USD).
Línea 2: Artículo L10001 por 10 horas de servicio ($1,000.00 USD).
Kate pulsa Finalizar; la Factura de Clientes se abre en pantalla por un total de $2,200.00 USD.
Al crear la factura, el sistema actualiza la columna Importe Facturado Clientes (A/R) en la etapa 4 de los datos maestros del proyecto, reduciendo la brecha frente al ingreso esperado y eliminando los riesgos de omisión de cobro.


Banco de Evaluación Situacional
Pregunta 1
Un consultor registra 8 horas de trabajo en su Hoja de Tiempos asignadas correctamente a la etapa de un proyecto externo. Sin embargo, al ejecutar el Asistente de Generación de Documentos de Facturación, dichas horas no aparecen en la lista de partidas a facturar. ¿Cuál es el motivo técnico más probable?

A) El empleado no tiene una licencia profesional asignada en el Service Layer.
B) La Clase de Actividad seleccionada en la línea de la Hoja de Tiempos no tiene marcada la casilla 'Facturable' o carece de un artículo de mano de obra asignado en su configuración.
C) La Hoja de Tiempos no ha sido firmada digitalmente por el director de finanzas.
D) El documento destino seleccionado en el asistente fue una Entrega en lugar de una Factura de Clientes.
Respuesta Correcta: B
Justificación Técnica: Para que los registros de Hojas de Tiempo y Actividades CRM sean recopilados por el asistente, su Clase de Actividad (Activity Type) debe tener habilitada la casilla Facturable y contar con un artículo de mano de obra (Labor Item) válido. Si falta cualquiera de estas condiciones, el asistente descarta el registro.
Pregunta 2
¿Qué sucede inmediatamente después de pulsar el botón 'Finalizar' en el Asistente de Generación de Documentos de Facturación?

A) El sistema contabiliza y timbra la Factura de Clientes automáticamente sin permitir revisión alguna.
B) El documento destino (Factura o Entrega) se abre automáticamente en 'Modo Crear' (Add mode), permitiendo al usuario revisar cantidades, precios o añadir líneas antes de crear el documento en la base de datos.
C) Se crea un asiento contable directo en el libro mayor debitando la cuenta de clientes y acreditando ingresos sin generar documento de marketing.
D) Se bloquea el proyecto financiero y se cambia su estatus a 'Interrumpido'.
Respuesta Correcta: B
Justificación Técnica: El asistente no inserta el documento final a ciegas; abre la ventana de Factura o Entrega en Modo Crear con todas las partidas preconsolidadas, otorgando al usuario la posibilidad de auditar los importes y realizar modificaciones antes de confirmar la creación definitiva.
Pregunta 3
¿Cómo se definen las líneas de Facturas de Proveedores (OPCH) para que sean reconocidas como gastos facturables al cliente en el asistente de facturación?

A) Marcando la casilla 'Facturable' (Chargeable) directamente en la fila correspondiente dentro de la sección Documentos de la matriz inferior de la etapa en los Datos Maestros de Proyecto.
B) Creando una solicitud de devolución de mercancías de compras.
C) Modificando el código de impuestos en la cabecera de la factura del proveedor.
D) Asignando un número de serie alfanumérico a cada línea de la factura.
Respuesta Correcta: A
Justificación Técnica: A diferencia de las horas de tiempo que dependen de la Clase de Actividad, las líneas de documentos de marketing (como Facturas de Proveedores) y las Órdenes de Trabajo se marcan como facturables de forma explícita activando la casilla Facturable (Chargeable) en la matriz inferior de la pestaña Etapas dentro de los Datos Maestros de Proyecto.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
