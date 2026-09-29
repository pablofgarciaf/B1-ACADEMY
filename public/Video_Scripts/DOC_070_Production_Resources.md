# Guion de Video: DOC 070 Production Resources

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 070 Production Resources.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 070: PRODUCCIÓN Y PLANIFICACIÓN (MRP) - GESTIÓN INTEGRAL DE RECURSOS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Production_21_Resources_Resources_ES
Módulo Oficial: Producción y Planificación de Materiales (Production & Resources)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores de Manufactura, Planificadores de Capacidad, Costistas y Agentes IA (Antigravity)
Carpeta Asociada: 070_10_Production_21_Resources_Resources_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "070",

  "topic": "Resource Master Data, Cost Components & Run Time Calculation",

  "sap_module": "Production_Resources",

  "database_tables": {

    "resources_master": {

      "table": "ORSC",

      "description": "Datos maestros de recursos de manufactura (maquinaria, mano de obra y otros)",

      "primary_key": "ResCode",

      "key_fields": ["ResName", "ResType", "ResGrp", "UnitName", "TimePerUnit", "UnitsPerTime", "CostTotal"]

    },

    "resource_groups": {

      "table": "ORGP",

      "description": "Grupos de recursos que definen hasta 10 componentes de costo estándar y cuentas de mayor",

      "primary_key": "ResGrpCode"

    },

    "resource_cost_components": {

      "table": "RSC1",

      "description": "Estructura de costos unitarios (hasta 10 elementos: amortización, mantenimiento, labor, etc.)"

    },

    "resource_capacity": "RSC2 / RSC3",

    "linked_fixed_assets": "OITM (ItemClass = 'A')",

    "linked_employees": "OHEM"

  },

  "menu_paths": [

    "Recursos > Datos maestros del recurso",

    "Gestión > Definición > Recursos > Grupos de recursos",

    "Gestión > Definición > Recursos > Componentes de coste de recursos"

  ],

  "resource_types_matrix": {

    "Machine": {

      "name": "Maquinaria",

      "tab_activated": "Activos Fijos",

      "linkage": "Permite vincular uno o varios activos fijos amortizables definidos en el sistema"

    },

    "Labor": {

      "name": "Trabajo / Mano de Obra",

      "tab_activated": "Empleados",

      "linkage": "Permite vincular uno o varios operarios de la nómina de empleados (OHEM)"

    },

    "Other": {

      "name": "Otros",

      "tab_activated": "Ninguna",

      "linkage": "Utilizado para costos indirectos de fabricación, energía o subcontrataciones"

    }

  },

  "run_time_calculation_formulas": {

    "unit_run_time": "Tiempo_Ejecucion_Por_UdM = Tiempo_Por_Unidad_Recurso / Unidades_Recurso_Por_Periodo",

    "bom_total_resource_time": "Tiempo_Total_Recurso = Cantidad_BOM * Tiempo_Ejecucion_Por_UdM",

    "order_run_time_unrouted": "Tiempo_Total_Orden_Produccion = MAX(Tiempos_Ejecucion_Recursos)"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Recurso como Factor Clave de Producción
En los sistemas ERP tradicionales, la producción solía gestionarse únicamente a través de transacciones de inventario físico de materias primas. Sin embargo, en la manufactura moderna los Recursos (maquinaria, instalaciones y mano de obra) representan con frecuencia más del 50% del valor agregado y constituyen el principal factor limitante (cuello de botella) de la planta.

En SAP Business One 10.0:

Los recursos se gestionan como un maestro independiente (ORSC).
A diferencia de los artículos, los recursos no acumulan saldo de existencias en almacenes; se gestionan mediante Capacidad Diaria y Periódica (horas o ciclos disponibles).
Pueden comercializarse o comprarse externamente en documentos de marketing vinculándolos a un Artículo no inventariable.
2.2 Tipología de Recursos y Vinculación con Maestros
El campo Tipo de recurso en la cabecera de ORSC determina el comportamiento de la ficha:

Maquinaria: Activa la pestaña Activos Fijos. Permite seleccionar uno o varios registros de activo fijo (OITM.ItemClass='A'), conectando el desgaste y amortización de la máquina con el costo de producción.
Trabajo (Labor): Activa la pestaña Empleados. Permite vincular trabajadores de la tabla OHEM para registrar horas laboradas por operario o cuadrilla.
Otros: Para recursos que no corresponden a activos ni personal directo (ej. moldes compartidos, vapor industrial, licencias de software CAM).
2.3 Grupos de Recursos y los 10 Componentes de Coste Estándar
Los Grupos de Recursos (ORGP) permiten agrupar máquinas o cuadrillas con esquemas de costos homogéneos:

Cada grupo permite estructurar hasta 10 componentes de costo estándar definidos por el usuario (ej. Costo 1: Amortización de Activo, Costo 2: Mantenimiento Preventivo, Costo 3: Consumo Eléctrico, Costo 4: Mano de Obra Directa, Costo 5: Gastos Generales de Planta).
A cada componente de costo se le asigna su propia Cuenta de Mayor en el Plan de Cuentas, permitiendo que el asiento de producción (OJDT) desagregue la absorción de costos con total transparencia analítica.
2.4 Unidades de Medida de Recurso y Conversión en Tiempo Real
Un recurso no siempre se mide en minutos u horas cronológicas; puede medirse en magnitudes industriales como Ciclos, Vueltas, Golpes de prensa o Metros lineales:

Para que el motor de planificación pueda programar la orden de producción en el calendario, SAP B1 convierte la UdM del recurso en tiempo de ejecución mediante dos campos:
Tiempo por unidades de recurso (ej. 15 minutos).
Unidades de recurso por período de tiempo (ej. 1 ciclo).
Fórmula de Conversión: $$\text{Tiempo de Ejecución por UdM} = \frac{\text{Tiempo por Unidades de Recurso}}{\text{Unidades de Recurso por Período}}$$ $$\text{Ejemplo:} \quad \frac{15\text{ minutos}}{1\text{ ciclo}} = 15\text{ minutos por ciclo} \quad \left(\text{o equivalentemente } \frac{1\text{ hora}}{4\text{ ciclos}} = 15\text{ min}\right)$$
2.5 Tiempo Total en Órdenes de Producción Sin Hoja de Ruta
Cuando una Orden de Producción contiene múltiples recursos que trabajan simultáneamente (ej. 1 torno CNC durante 45 minutos y 1 operario durante 30 minutos), el sistema aplica el principio de paralelismo: $$\text{Tiempo Total de Ejecución de la Orden} = \max(\text{Tiempo Recurso}_1, \text{Tiempo Recurso}_2, \dots, \text{Tiempo Recurso}_n)$$ En el ejemplo, el tiempo total es el valor máximo: 45 minutos.


3. ATLAS DIDÁCTICO: MODELO DE DATOS Y FLUJO DE RECURSOS
┌────────────────────────────────────────────────────────────────────────┐

│ DATOS MAESTROS DE RECURSO (ORSC)                                       │

│    • Tipo: Maquinaria ──> Vincula Activo Fijo (OITM)                  │

│    • Tipo: Trabajo    ──> Vincula Empleados de Planta (OHEM)          │

│    • Grupo de Recurso ──> Hereda hasta 10 Componentes de Costo (RSC1) │

└───────────────────────────────────┬────────────────────────────────────┘

                                    │

                                    ▼

┌────────────────────────────────────────────────────────────────────────┐

│ LISTA DE MATERIALES / BOM (OITT)                                       │

│    • Componente: Torno CNC (Recurso)                                   │

│    • UdM: Ciclos | Cantidad BOM: 3 ciclos                              │

│    • Conversión: 1 ciclo = 15 min ──> Tiempo Ejecución: 45 min         │

└───────────────────────────────────┬────────────────────────────────────┘

                                    │

                                    ▼

┌────────────────────────────────────────────────────────────────────────┐

│ ORDEN DE PRODUCCIÓN (OWOR)                                             │

│    • Asignación de Capacidad Diaria en Calendario de Planta            │

│    • Asiento Contable: Absorción de Costos en WIP por Componente       │

└────────────────────────────────────────────────────────────────────────┘


4. CASO DE NEGOCIO RESUELTO: TALLER DE CARPINTERÍA OC WOODTREND
Escenario de Negocio:
La empresa de carpintería a medida OC WoodTrend fabrica puertas y ventanas personalizadas:

Recurso 1 (Maquinaria): Torno para madera (REC-TORNO).
Grupo: Mantenimiento y Amortización.
Unidad de Medida: Ciclo.
Conversión: Tiempo por unidad = 00:15:00 (15 minutos), Unidades por período = 1.
Costo estándar por ciclo: $12.00 USD ($7 amortización + $5 mantenimiento).
Recurso 2 (Trabajo): Operario carpintero especialista (REC-OPERARIO).
Grupo: Mano de Obra Directa.
Unidad de Medida: Horas.
Costo estándar por hora: $25.00 USD.
Planificación de la Lista de Materiales:
Para producir 1 puerta tallada, se requieren:

REC-TORNO: 3 ciclos ($3 \times 15\text{ min} = 45\text{ minutos}$, costo absorbido = $36.00 USD).
REC-OPERARIO: 0.5 horas (30 minutos, costo absorbido = $12.50 USD).
Resultado en la Orden de Producción:
Tiempo Total Estimado de Fabricación: $\max(45\text{ min}, 30\text{ min}) = \mathbf{45\text{ minutos}}$.
Costo Total de Recursos Absorbido: $$36.00 + $12.50 = \mathbf{$48.50\text{ USD}}$ por cada puerta producida, integrado automáticamente en la cuenta de inventario terminado.


5. BANCO DE EVALUACIÓN SITUACIONAL Y CERTIFICACIÓN
Pregunta 1
¿Cuántos componentes de costo estándar definidos por el usuario permite configurar SAP Business One en un Grupo de Recursos (ORGP)?
A) Máximo 3 componentes (Materiales, Mano de obra y Gastos generales).
B) Hasta 10 componentes de costo estándar independientes, cada uno con su propia cuenta contable asignable.
C) Únicamente 1 componente de costo fijo por hora.
D) No admite desglose de componentes, solo costo estándar global.
Respuesta Correcta: B
Justificación Técnica: SAP Business One permite hasta 10 componentes de costo por grupo de recursos (ej. depreciación, energía, herramientas, mantenimiento), asociables a diferentes cuentas de mayor para auditoría analítica de costos.
Pregunta 2
Si un recurso de tipo máquina tiene como texto de UdM "Ciclo", con un "Tiempo por unidades de recurso" de 00:15:00 (15 minutos) y "Unidades de recurso por período" de 1, ¿cuánto tiempo de ejecución calculará el sistema para fabricar un producto cuya lista de materiales requiere 4 ciclos?
A) 15 minutos.
B) 60 minutos (1 hora).
C) 4 horas.
D) 30 minutos.
Respuesta Correcta: B
Justificación Técnica: Cada ciclo requiere $\frac{15\text{ min}}{1} = 15\text{ minutos}$. Para 4 ciclos en la BOM, el tiempo total es $4 \times 15\text{ min} = 60\text{ minutos}$.
Pregunta 3
En una Orden de Producción sin hoja de ruta que contiene dos recursos que operan en simultáneo (un torno que requiere 50 minutos y un operario que requiere 30 minutos), ¿cómo determina SAP Business One el tiempo de ejecución total de la orden?
A) Sumando ambos tiempos ($50 + 30 = 80$ minutos).
B) Tomando el valor máximo de los tiempos de ejecución de los recursos involucrados (50 minutos).
C) Promediando ambos tiempos (40 minutos).
D) Dividiendo el tiempo de la máquina entre el número de operarios.
Respuesta Correcta: B
Justificación Técnica: En órdenes de producción convencionales sin hojas de ruta secuenciales, el tiempo total de ejecución se calcula como el valor máximo entre los recursos participantes.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
