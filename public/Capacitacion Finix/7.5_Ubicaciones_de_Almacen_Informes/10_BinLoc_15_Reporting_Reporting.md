UNIDAD 010: REPORTES, AUDITORÍA, REABASTECIMIENTO Y VACIADO DE UBICACIONES (SAP BUSINESS ONE 10.0)
Código de Manual: 10_BinLoc_15_Reporting_Reporting
Módulo Oficial: Inventario / Ubicaciones (Bin Locations - Reporting & Replenishment)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Logísticos, Contadores de Inventario, Jefes de Operaciones y Agentes IA (Antigravity)
Carpeta Asociada: 010_10_BinLoc_15_Reporting_Reporting


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "010",

  "topic": "Bin Location Reporting, Replenishment and Clearing Processes",

  "sap_module": "Inventory_WMS_Reporting",

  "reporting_suite": {

    "Bin_Location_List": {

      "menu_path": "Inventario > Informes de inventario > Lista de ubicaciones",

      "level": "Celdas físicas (OBIN)",

      "operational_actions": ["Reabastecer ubicaciones (Replenish)", "Vaciar ubicaciones (Clear)", "Abrir lista de contabilización"]

    },

    "Bin_Location_Content_List": {

      "menu_path": "Inventario > Informes de inventario > Lista de contenido de la ubicación",

      "level": "Desglose Artículo por Celda (OBIN x OITM)",

      "operational_actions": ["Fijar como ubicación por defecto", "Traslado de inventario", "Vista jerárquica"]

    },

    "Inventory_Posting_List": {

      "feature": "Casilla 'Dividir visualización por ubicaciones': desglosa cada asiento de inventario mostrando las celdas afectadas"

    },

    "Inventory_in_Warehouse_Report": {

      "feature": "Muestra Primera Ubicación, Ubicación Predeterminada y si está Forzada"

    }

  },

  "replenishment_math": {

    "replenishment_formula": "Cantidad_Reabastecimiento = MaxQty - CurrentQty",

    "below_minimum_formula": "Cantidad_Bajo_Minimo = MinQty - CurrentQty",

    "critical_rule": "El Asistente de Reabastecimiento rellena la celda hasta el MÁXIMO configurado (MaxQty), ignorando el mínimo como tope de llenado. El mínimo (MinQty) solo actúa como disparador de alerta o filtro de selección."

  },

  "inventory_transfer_defaults": {

    "Replenish_Option": {

      "Quantity": "Cantidad de reabastecimiento (MaxQty - CurrentQty)",

      "To_Bin_Location": "La celda seleccionada en el reporte (celda de picking a rellenar)",

      "From_Bin_Location": "Asignado automáticamente por reglas de salida (almacenamiento masivo)"

    },

    "Clear_Option": {

      "Quantity": "Cantidad actual de stock en la celda (CurrentQty)",

      "From_Bin_Location": "La celda seleccionada en el reporte (celda a vaciar)",

      "To_Bin_Location": "Asignado automáticamente por reglas de entrada (celda de destino)"

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 La Suite de Informes de Ubicaciones
En la operación de un almacén avanzado existen dos niveles de análisis:

Lista de Ubicaciones (Bin Location List): Vista macro a nivel de infraestructura. Muestra cada celda (OBIN), sus subniveles, peso actual, peso máximo, número de ítems diferentes y estado operativo.
Lista de Contenido de Ubicaciones (Bin Location Content List): Vista micro a nivel de existencia. Desglosa los artículos específicos contenidos en cada celda, mostrando cantidades, lotes y números de serie. Ofrece una Vista Jerárquica con funciones de colapsar/expandir por pasillo, estante o artículo.
2.2 El Proceso Automatizado de Reabastecimiento (Replenishment)
El Concepto de "Pick Face": Las empresas suelen mantener una zona de preparación rápida (Pick Face) cerca del muelle de despacho con cantidades moderadas de artículos de alta rotación, mientras que el grueso del inventario reside en estanterías altas de difícil acceso.
Mecánica del Reabastecimiento:
Semanal o diariamente, el jefe de bodega emite la Lista de Ubicaciones filtrando por el campo Cantidad por debajo del mínimo > 0.
Selecciona las filas críticas y presiona Traslado de inventario > Reabastecer ubicaciones.
SAP Business One genera automáticamente un Traslado de Inventario (OWTR) donde:
En el campo A la ubicación (To Bin) coloca la celda del Pick Face.
En el campo Desde la ubicación (From Bin) extrae stock del almacén general mediante reglas automáticas.
En la cantidad transaccionada calcula con exactitud: $\text{Cantidad de Reabastecimiento} = \text{Cantidad Máxima} - \text{Cantidad Actual}$.
2.3 El Proceso de Vaciado (Clearing Process)
Cuando una celda debe someterse a reparación o ser reasignada en exclusividad a una nueva familia de artículos, se ejecuta el botón Vaciar ubicaciones (Clear Bin Locations).
El sistema genera un traslado que toma el 100% del saldo actual de la celda de origen y busca celdas de almacenamiento alternativas disponibles.


3. ATLAS DIDÁCTICO: LÓGICA COMPARATIVA DE REABASTECER VS VACIAR
┌─────────────────────────────────────────────────────────────────────────┐

│                      LISTA DE UBICACIONES / CONTENIDOS                  │

└────────────────────────────────────┬────────────────────────────────────┘

                                     │

            ┌────────────────────────┴────────────────────────┐

            ▼                                                 ▼

   [ REABASTECER UBICACIÓN ]                         [ VACIAR UBICACIÓN ]

   • Objetivo: Rellenar Pick Face                    • Objetivo: Desocupar Celda

   • Cantidad: MaxQty - CurrentQty                   • Cantidad: CurrentQty (Total)

   • Destino (To Bin): Celda de Reporte              • Origen (From Bin): Celda de Reporte

   • Origen (From Bin): Almacenamiento Masivo        • Destino (To Bin): Celdas Alternativas


4. CASO DE NEGOCIO RESUELTO: GESTIÓN DE PICK FACE EN OEC COMPUTERS
Escenario de Consultoría:
George gestiona la zona de despacho rápido de OEC Computers. La celda 01-PF-S1-L1 aloja cables HDMI:

Cantidad Mínima configurada = 20 unidades.
Cantidad Máxima configurada = 100 unidades.
Tras los pedidos de la mañana, el saldo actual cae a 12 unidades.
Ejecución del Reabastecimiento:
George abre Inventario > Informes de inventario > Lista de ubicaciones.
El sistema muestra: Cantidad actual = 12, Cantidad bajo el mínimo = 8 ($20 - 12$), Cantidad de reabastecimiento = 88 ($100 - 12$).
George marca la línea, pulsa Traslado de inventario y selecciona Reabastecer ubicaciones.
Se abre el Traslado de Inventario trasladando 88 unidades desde las estanterías altas de reserva hacia 01-PF-S1-L1, restaurando el stock al tope óptimo de 100 unidades.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Al ejecutar el procedimiento de "Reabastecimiento de Ubicaciones" (Replenishment) desde la Lista de Ubicaciones, ¿qué cantidad traslada el sistema a la celda seleccionada?
A) La cantidad mínima definida para la celda.
B) La cantidad exacta para alcanzar la Cantidad Máxima definida (Cantidad Máxima menos Cantidad Actual).
C) Siempre traslada un palet cerrado de 500 unidades.
D) Duplica el inventario existente sin verificar límites.
Respuesta Correcta: B
Justificación Técnica: El motor de reabastecimiento de SAP Business One está diseñado para llevar el stock de la celda de preparación al tope de su capacidad máxima autorizada (MaxQty - CurrentQty).
Pregunta 2
En el informe "Lista de Contabilización de Inventario", ¿qué efecto produce marcar la casilla "Dividir visualización por ubicaciones"?
A) Separa el reporte en dos archivos PDF independientes.
B) Desglosa las transacciones de cada documento mostrando una línea separada por cada ubicación física afectada, facilitando la auditoría de celdas.
C) Oculta las transacciones en moneda extranjera.
D) Elimina las partidas de mermas y ajustes de inventario.
Respuesta Correcta: B
Justificación Técnica: Al marcar la casilla, el reporte desagrega la línea del documento comercial para exhibir con precisión el flujo de entradas y salidas celda por celda.
Pregunta 3
¿Bajo qué circunstancias calcula el sistema los campos "Cantidad bajo mínimo" y "Cantidad de reabastecimiento" en el informe Lista de Ubicaciones?
A) En cualquier celda, independientemente de cuántos artículos contenga.
B) Únicamente cuando la celda contiene un solo artículo con cantidad distinta de cero, o cuando la celda tiene saldo cero pero está restringida a un "Artículo específico".
C) Solo si el almacén no tiene costos estándar.
D) Únicamente en almacenes de consignación.
Respuesta Correcta: B
Justificación Técnica: En celdas multi-artículo el sistema no puede presumir a cuál de los productos aplicar el límite máximo o mínimo, por lo que desactiva el cálculo matemático para evitar errores lógicos.