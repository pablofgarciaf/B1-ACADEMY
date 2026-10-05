UNIDAD 009: RESTRICCIÓN DE CAPACIDAD Y CONTROL DE PESO EN UBICACIONES (SAP BUSINESS ONE 10.0)
Código de Manual: 10_BinLoc_14_Process_Weight
Módulo Oficial: Inventario / Ubicaciones (Bin Locations - Weight Management)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Logísticos, Administradores de Almacén, Jefes de Seguridad Ocupacional y Agentes IA (Antigravity)
Carpeta Asociada: 009_10_BinLoc_14_Process_Weight


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "009",

  "topic": "Allocation with Weight Restriction in Bin Locations",

  "sap_module": "Inventory_WMS_Weight",

  "database_fields": {

    "item_master_data": {

      "table": "OITM",

      "field": "IWeight1",

      "description": "Peso del artículo en la Unidad de Medida (UdM) de Inventario"

    },

    "bin_location_master": {

      "table": "OBIN",

      "item_weight_calculated": "OBIN.ItemWeight (Informativo: Σ [Cantidad * Peso UdM Inventario])",

      "max_weight_allowed": "OBIN.MaxWeight (Definido por el usuario: Límite estructural de la celda)"

    },

    "warehouse_setup": {

      "table": "OWHS",

      "enable_weight_restriction": "OWHS.MaxWeightAct (Activa validación de peso máximo en entrada)"

    }

  },

  "menu_paths": [

    "Inventario > Datos maestros de artículo > Pestaña Datos de inventario > Campo Peso",

    "Inventario > Ubicaciones > Datos maestros de ubicación > Campos Peso de artículo y Peso máximo",

    "Gestión > Definición > Inventario > Almacenes > Pestaña Ubicaciones > Validación de peso máximo"

  ],

  "weight_calculation_rules": {

    "conversion_rule": "Al actualizar el peso en la UdM de Inventario, el sistema solicita propagar proporcionalmente el peso a las UdM de Compras y Ventas según el factor de conversión del grupo de UdM",

    "bin_weight_formula": "Peso_Actual_Celda = Σ (Cantidad_Articulo_i * Peso_UdM_Inventario_i)",

    "allocation_behavior": {

      "automatic_allocation": "No emite alertas visuales. Asigna exactamente hasta el peso máximo disponible en la celda y desborda el remanente hacia la siguiente ubicación según la regla configurada. Puede generar asignaciones fraccionadas.",

      "manual_allocation": "Emite un mensaje de advertencia si la cantidad asignada excede la capacidad portante máxima de la celda. El usuario puede confirmar la sobrecarga o corregir la asignación."

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Justificación Operativa del Control de Peso en Almacenes
En la logística moderna, el control de pesos cumple una triple función crítica:

Seguridad Industrial y Estructural: Evita el colapso mecánico de racks y estanterías por sobrecarga acumulada.
Capacidad de Carga de Maquinaria: Permite planificar con exactitud las cargas que pueden levantar montacargas y transpaletas (ej. límite de 500 kg por horquilla) sin requerir pesaje manual individual.
Optimización de Distribución Física: Los artículos más pesados se asignan automáticamente a niveles bajos (piso), mientras que los livianos ocupan alturas superiores.
2.2 Configuración en los Datos Maestros del Artículo (OITM)
En la pestaña Datos de inventario, se introduce el peso unitario del artículo correspondiente a la Unidad de Medida de Inventario (ej. 1 paquete de papel = 1 kg; 1 disco duro = 0.5 kg).
Al modificar este valor, SAP Business One ofrece replicar proporcionalmente el peso a las unidades de compras (ej. Caja de 20 paquetes = 20 kg) y ventas, garantizando coherencia dimensional en toda la cadena logística.
2.3 Mecánica de Restricción en la Ubicación (OBIN)
En la ficha de la ubicación conviven dos campos fundamentales:

Peso de Artículo (ItemWeight): Campo dinámico de solo lectura que calcula en tiempo real el peso total acumulado de todos los artículos alojados actualmente en la celda.
Peso Máximo (MaxWeight): Límite máximo estructural establecido por el usuario. Si se deja en blanco, la celda no tiene restricción de peso.
Nota Crítica de Integridad: Si una celda contiene un artículo que no tiene definido un peso en sus datos maestros, dicho artículo no suma al peso calculado de la ubicación, lo cual debe ser considerado en las políticas de carga de datos iniciales.


3. ATLAS DIDÁCTICO: COMPORTAMIENTO DE DESBORDAMIENTO POR PESO
Ejemplo Gráfico del Manual Oficial:

Capacidad máxima configurada por celda = 100 kg.
Celda 1: Tiene inventario actual de 80 kg (Espacio disponible: 20 kg).
Celda 2: Está completamente vacía (Espacio disponible: 100 kg).
Se reciben 50 Discos Duros (cada disco pesa 1 kg = 50 kg totales a ingresar).
Resultado del Algoritmo Automático:
El sistema asigna 20 unidades (20 kg) a la Celda 1, completando su tope exacto de 100 kg.
El sistema desborda las 30 unidades restantes (30 kg) hacia la Celda 2, dejándola con 30 kg ocupados.
No se produce ningún error de bloqueo; el stock se reparte de forma fluida y matemáticamente perfecta.


4. CASO DE NEGOCIO RESUELTO: RECEPCIÓN DE SUMINISTROS EN OEC COMPUTERS
Escenario de Consultoría:
George, jefe de almacén en OEC Computers, desea parametrizar las estanterías del pasillo de accesorios pesados.

Cada balda de la estantería S1 soporta un máximo de 250 kg.
Llega una compra de 400 fuentes de poder para PC, con un peso de 0.8 kg por unidad (Peso total: 320 kg).
Ejecución en el Sistema:
En Datos Maestros de Ubicación para 01-A2-S1-L1 y 01-A2-S1-L2, George define Peso Máximo = 250.
En la Entrada de mercancías por pedido, se ingresan las 400 unidades.
El sistema evalúa la capacidad:
En 01-A2-S1-L1 asigna 312 unidades ($312 \times 0.8\text{ kg} = 249.6\text{ kg} \le 250\text{ kg}$).
En 01-A2-S1-L2 asigna las 88 unidades restantes ($88 \times 0.8\text{ kg} = 70.4\text{ kg}$).
La estantería queda protegida contra fatiga de materiales y el stock queda debidamente zonificado.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Qué sucede cuando se realiza una asignación AUTOMÁTICA en una entrada de mercancías y la cantidad entrante supera el peso máximo configurado en la ubicación de destino?
A) El sistema cancela el documento comercial y bloquea al usuario.
B) El sistema no emite alertas visuales; asigna la cantidad exacta que cabe hasta agotar el peso máximo de la celda y deriva el remanente a la siguiente ubicación disponible.
C) Se cobra una multa automática por sobrepeso en la cuenta de pérdidas.
D) El peso máximo se incrementa automáticamente en la base de datos.
Respuesta Correcta: B
Justificación Técnica: La asignación automática prioriza la continuidad del flujo logístico, llenando la celda hasta su capacidad portante máxima y desbordando el exceso sin interrumpir con ventanas modales emergentes.
Pregunta 2
Si una ubicación tiene definido un Peso Máximo de 500 kg, pero contiene artículos cuyos datos maestros no tienen especificado ningún peso (campo en blanco o cero), ¿cómo actúa el sistema?
A) Asume que cada artículo pesa 10 kg por defecto.
B) Dichos artículos no son computados en el cálculo del peso total acumulado de la celda, lo que podría provocar sobrecargas físicas involuntarias si no se audita el maestro de datos.
C) Bloquea cualquier salida de mercancías de esa celda.
D) Convierte automáticamente el volumen del artículo en kilogramos.
Respuesta Correcta: B
Justificación Técnica: SAP Business One únicamente suma los artículos que tengan valores explícitos en el campo de peso de inventario de OITM; los artículos sin peso se computan como cero kilogramos.
Pregunta 3
¿En cuál de las siguientes modalidades de asignación emite SAP Business One un mensaje de advertencia explícito al superar el peso máximo permitido en una ubicación?
A) Únicamente en asignaciones manuales.
B) Únicamente en asignaciones por órdenes de fabricación.
C) Siempre, tanto en manuales como en automáticas.
D) Nunca emite advertencias.
Respuesta Correcta: A
Justificación Técnica: Los mensajes de advertencia emergentes con opción a ignorar o ajustar están reservados para la asignación manual; en los procesos automáticos el sistema aplica reglas matemáticas silenciosas de desborde.