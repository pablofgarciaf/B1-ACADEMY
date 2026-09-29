# Guion de Video: DOC 069 Production Overview

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 069 Production Overview.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 069: PRODUCCIÓN Y PLANIFICACIÓN (MRP) - CONCEPTOS FUNDAMENTALES (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Production_11_Overview_Overview_ES
Módulo Oficial: Producción y Planificación de Materiales (Production & MRP)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores de Manufactura, Planificadores de Planta, Costistas y Agentes IA (Antigravity)
Carpeta Asociada: 069_10_Production_11_Overview_Overview_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "069",

  "topic": "Production Process Overview, BOMs & Resources",

  "sap_module": "Production_MRP",

  "database_tables": {

    "bill_of_materials_header": "OITT",

    "bill_of_materials_lines": "ITT1",

    "production_order_header": "OWOR",

    "production_order_lines": "WOR1",

    "routing_stages": "WOR4",

    "resources_master": "ORSC",

    "issue_for_production": "OIGE / IGE1",

    "receipt_from_production": "OIGN / IGN1"

  },

  "menu_paths": [

    "Producción > Lista de materiales",

    "Producción > Orden de producción",

    "Producción > Emisión para producción",

    "Producción > Recibo de producción"

  ],

  "production_core_entities": {

    "bom_types": [

      { "type": "Producción", "behavior": "Utilizada para fabricar productos terminados multinivel en planta mediante Órdenes de Producción (OWOR)" },

      { "type": "Venta", "behavior": "Paquete comercial; los componentes se visualizan en pedidos de venta pero se despachan juntos" },

      { "type": "Ensamblaje", "behavior": "Similar a la de venta; se agrupa al facturar sin requerir orden de manufactura compleja" },

      { "type": "Modelo (Template)", "behavior": "Plantilla genérica de artículos editable en documentos comerciales" }

    ],

    "resource_types": [

      { "type": "Maquinaria (Machine)", "link": "Vinculado a la ficha de Activos Fijos (OITM / ItemClass='A')" },

      { "type": "Mano de Obra / Trabajo (Labor)", "link": "Vinculado a Datos Maestros de Empleado (OHEM)" },

      { "type": "Otros (Other)", "link": "Costos indirectos o consumos auxiliares de planta" }

    ],

    "production_order_statuses": [

      { "status": "Planificado (Planned)", "effect": "Reserva stock; no permite emitir componentes a planta" },

      { "status": "Liberado (Released)", "effect": "Habilita la emisión de materias primas y registro de horas de recursos" },

      { "status": "Cerrado (Closed)", "effect": "Finaliza la orden y liquida desviaciones entre Trabajo en Proceso (WIP) y Stock Terminado" },

      { "status": "Cancelado (Cancelled)", "effect": "Anula la orden sin efectos en inventario ni contabilidad" }

    ]

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 La Arquitectura del Módulo de Producción en SAP Business One
El módulo de Producción en SAP Business One 10.0 centraliza la gestión de manufactura discreta, integrando el flujo de compras, inventarios, capacidad de maquinaria y contabilidad analítica de costos.

El ciclo operativo estándar consta de 4 etapas esenciales:

Definición de la Lista de Materiales (BOM - OITT): Es la receta técnica estructural donde se detallan las materias primas, componentes semi-elaborados y recursos (máquinas y mano de obra) necesarios para producir una unidad estándar del producto terminado.
Generación de la Orden de Producción (OWOR): Documento ejecutable que planifica la fabricación de una cantidad determinada con una fecha de entrega fija, copiando los componentes desde la BOM.
Emisión de Componentes (Issue for Production - OIGE): Salida física y contable de los insumos desde el almacén hacia el piso de planta (cuenta de Trabajo en Proceso - WIP).
Recibo de Producción (Receipt from Production - OIGN): Ingreso formal del producto terminado al inventario valorizado y descarga de los costos WIP acumulados.
2.2 La Fusión de Artículos y Recursos en la Lista de Materiales
Una de las grandes innovaciones de SAP Business One es el tratamiento de los Recursos (ORSC) al mismo nivel que los artículos de inventario:

Para fabricar una puerta de madera decorativa no solo se consumen artículos físicos (madera, barniz, cerraduras), sino también tiempo de máquina (torno CNC) y tiempo humano (operario especializado).
Los recursos permiten medir la capacidad instalada diaria (horas máquina / horas hombre), programar turnos y absorber costos indirectos de fabricación directamente en el costo unitario del producto terminado.
2.3 Producción con Hojas de Ruta (Routing Stages)
A partir de la versión 10.0, SAP Business One incorpora de forma nativa la gestión de Hojas de Ruta:

Permite dividir la Orden de Producción en etapas secuenciales correlativas (ej. Etapa 1: Corte, Etapa 2: Lijado, Etapa 3: Pintura y Secado).
Cada etapa tiene asignados sus propios artículos y recursos específicos.
Cálculo de Fechas por Capacidad: La duración de cada etapa se proyecta en función de la capacidad disponible del recurso, permitiendo encadenar dependencias (la Etapa 2 no inicia hasta que concluye la Etapa 1).


3. ATLAS DIDÁCTICO: EL CIRCUITO DISCRETO DE MANUFACTURA
┌────────────────────────────────────────────────────────────────────────┐

│ 1. LISTA DE MATERIALES / BOM (OITT)                                   │

│    • Producto Terminado: Puerta Decorativa Tallada                     │

│    • Componentes (Artículos): Madera Pino, Pomo Metálico              │

│    • Recursos: Torno CNC (Máquina), Operario Carpintero (Labor)        │

└───────────────────────────────────┬────────────────────────────────────┘

                                    │ Copia a Producción

                                    ▼

┌────────────────────────────────────────────────────────────────────────┐

│ 2. ORDEN DE PRODUCCIÓN (OWOR)                                          │

│    • Estado: Planificado ──> Liberado (Released)                       │

│    • Cantidad: 10 unidades | Vencimiento: 30/09/2026                   │

└───────────────────┬────────────────────────────────┬───────────────────┘

                    │                                │

                    ▼ (Salida de Insumos)            ▼ (Entrada de Producto)

┌──────────────────────────────────────┐ ┌───────────────────────────────┐

│ 3. EMISIÓN PARA PRODUCCIÓN (OIGE)    │ │ 4. RECIBO DE PRODUCCIÓN (OIGN)│

│    • Extrae Madera y Pomo del stock  │ │    • Ingresa 10 Puertas Term. │

│    • Debita: Cuenta WIP (En Proceso) │ │    • Debita: Inventario Term. │

│    • Acredita: Cuenta de Materia Pr. │ │    • Acredita: Cuenta WIP     │

└──────────────────────────────────────┘ └───────────────────────────────┘

                                    │

                                    ▼

┌────────────────────────────────────────────────────────────────────────┐

│ 5. CIERRE DE ORDEN (CLOSED)                                            │

│    • Liquida y salda variaciones de costo en WIP contra Pérdidas/Gan.  │

└────────────────────────────────────────────────────────────────────────┘


4. CASO DE NEGOCIO RESUELTO: MANUFACTURA DE EQUIPOS EN OEC COMPUTERS
Escenario de Negocio:
OEC Computers ensambla su propia línea de servidores corporativos:

Producto Terminado: Servidor Custom Rack 4U (SRV-4U).
Lista de Materiales (OITT):
Artículos: 1 Chasis 4U (CH-4U), 2 Fuentes Redundantes (PS-800), 1 Placa Base (MB-SRV).
Recursos: 1 Máquina de Pruebas de Estrés Térmico (R-TEST, 2 horas) y 1 Técnico Ensamblador (L-TECH, 3 horas).
Demanda: Un cliente corporativo emite un pedido de 5 servidores.
Procedimiento en SAP Business One:
El planificador crea una Orden de Producción por 5 unidades en estado Planificado.
Verifica la disponibilidad de piezas con el informe de verificación de stock.
Cambia el estado a Liberado.
El operario emite los insumos físicos mediante Emisión para producción (OIGE), debitando la cuenta contable de WIP por el costo exacto de los componentes.
Concluido el ensamblaje y las pruebas, se registra el Recibo de producción (OIGN) por las 5 unidades terminadas, valorizando el servidor en stock e incorporando las horas de labor y máquina al costo final.


5. BANCO DE EVALUACIÓN SITUACIONAL Y CERTIFICACIÓN
Pregunta 1
¿Cuál de los siguientes tipos de Lista de Materiales (BOM) en SAP Business One se utiliza para fabricar artículos terminados en planta mediante el uso de Órdenes de Producción?
A) Lista de materiales de ventas.
B) Lista de materiales de producción.
C) Lista de materiales de ensamblaje.
D) Lista de materiales de modelo.
Respuesta Correcta: B
Justificación Técnica: La Lista de Materiales de Producción es la única que interactúa con el motor de Órdenes de Producción (OWOR) para registrar consumos de insumos, horas de recursos y costos de fabricación en planta.
Pregunta 2
¿Qué cambio contable u operativo ocurre cuando una Orden de Producción pasa de estado "Planificado" a estado "Liberado"?
A) Se descuentan automáticamente todos los componentes del inventario.
B) Se habilita la posibilidad de realizar documentos de Emisión para Producción y despachar materiales físicamente a la planta.
C) Se factura automáticamente al cliente.
D) El costo del producto terminado se congela en el balance general.
Respuesta Correcta: B
Justificación Técnica: Mientras una orden está en estado Planificado, el sistema reserva el stock pero bloquea cualquier movimiento físico. La transición a Liberado autoriza la salida de materias primas a producción.
Pregunta 3
¿A qué dos entidades maestras del sistema se vinculan principalmente los Recursos de tipo Maquinaria y Trabajo en SAP Business One?
A) A las Cuentas de Pérdidas y Ganancias y a las Cajas Chicas.
B) La Maquinaria se vincula a Datos Maestros de Activos Fijos y el Trabajo se vincula a Datos Maestros de Empleado.
C) A los Códigos de Barras y a los Descuentos de Volumen.
D) A los Números de Serie de los Proveedores.
Respuesta Correcta: B
Justificación Técnica: SAP B1 enlaza los recursos de maquinaria con la ficha de activo fijo amortizable (OITM.ItemClass='A') y los recursos humanos con la nómina de empleados (OHEM), unificando la capacidad y el costo real.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
