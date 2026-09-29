UNIDAD 007: CONFIGURACIÓN, RESTRICCIONES Y GESTIÓN MASIVA DE UBICACIONES (SAP BUSINESS ONE 10.0)
Código de Manual: 10_BinLoc_12_Setup_Setup
Módulo Oficial: Inventario / Ubicaciones (Bin Locations - WMS)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Logísticos, Administradores de Almacén, Diseñadores de Procesos y Agentes IA (Antigravity)
Carpeta Asociada: 007_10_BinLoc_12_Setup_Setup


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "007",

  "topic": "Bin Location Setup, Sublevels, Restrictions & Management",

  "sap_module": "Inventory_WMS_Setup",

  "configuration_phases": [

    { "phase": 1, "name": "Habilitación de Almacén", "action": "Activar casilla 'Activar ubicaciones' en Definición de Almacén (OWHS)" },

    { "phase": 2, "name": "Subniveles y Atributos", "action": "Definir hasta 4 subniveles (OSBL/SBL1) y hasta 10 atributos de usuario (OBAT)" },

    { "phase": 3, "name": "Generación de Códigos", "action": "Generación masiva mediante Asistente de Gestión de Ubicaciones (OBIN)" },

    { "phase": 4, "name": "Zonificación y Receptores", "action": "Configurar ubicaciones receptoras de muelle y estrategias de entrada" }

  ],

  "system_bin_location_rules": {

    "system_code_sublevel1": "SYSTEM-BIN-LOCATION",

    "system_bin_code": "[CódigoAlmacén]-SYSTEM-BIN-LOCATION",

    "purpose": "Permite continuidad operativa ('Business as usual') al activar ubicaciones. Todo el stock existente y nuevas transacciones se alojan allí temporalmente hasta la migración física mediante Traslado de Inventario."

  },

  "bin_location_restrictions": {

    "Transaction_Restrictions": {

      "options": ["Sin restricciones", "Todas las transacciones excepto entradas", "Todas las transacciones excepto salidas", "Todas las transacciones"],

      "behavior": "Bloquea flujos operativos específicos sin ocultar la ubicación de los reportes"

    },

    "Item_Restrictions": {

      "options": ["Sin restricción", "Artículo único", "Grupo de artículos específico"],

      "behavior": "Garantiza exclusividad de almacenamiento. Falla si ya contiene artículos disímiles."

    },

    "UoM_Restrictions": {

      "options": ["Unidad de medida específica", "Solo unidad de inventario"],

      "behavior": "Asegura estandarización física de empaques (palets completos, cajas máster)"

    },

    "Batch_Restrictions": {

      "options": ["Lote único"],

      "behavior": "Impide mezcla de diferentes lotes de fabricación en la misma celda"

    },

    "Inactive_Status": {

      "behavior": "Bloquea todas las transacciones y excluye la celda de las listas de selección y reportes operativos. Solo se permite si Stock == 0."

    }

  },

  "batch_management_tools": {

    "Sublevel_Code_Management": "Generación automática con prefijos alfanuméricos y secuencias numéricas con ceros a la izquierda (R01-R30)",

    "Bin_Location_Management": "Generador masivo combinatorio de celdas cruzando subniveles activos",

    "Bin_Location_Modification": "Reorganización física de almacén. Permite renombrar o reasignar códigos incluso con stock existente mediante la creación automática de traslados de inventario."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 La Fase 1 de Activación y el Rol Vital de la "Ubicación del Sistema"
Activar la gestión de ubicaciones en una empresa con operaciones en marcha suele generar temor de paralización operativa. SAP Business One resuelve esto mediante una arquitectura no disruptiva:

La casilla Activar ubicaciones se marca almacén por almacén en Gestión > Definición > Inventario > Almacenes.
Al activarse, el sistema genera automáticamente una Ubicación del Sistema (System Bin Location) con la nomenclatura [Almacén]-SYSTEM-BIN-LOCATION.
Continuidad Operativa ("Business as usual"): Toda la existencia actual del almacén y todas las nuevas órdenes de compra o entregas se canalizan automáticamente a la ubicación del sistema. El personal comercial y de facturación puede seguir trabajando sin interrupción mientras los consultores configuran las estanterías físicas y los códigos definitivos.
Una vez creadas las ubicaciones físicas reales, el stock se redistribuye mediante un Traslado de Inventario masivo.
2.2 Anatomía de los Datos Maestros de la Ubicación (OBIN)
La ficha de datos maestros de una celda se divide en 4 bloques funcionales:

Estructura del Código: Muestra el almacén base, los códigos de subnivel concatenados y el separador (ej. - o /).
Propiedades:
Código de clasificación alternativo (Alternative Sort Code): Cadena alfanumérica libre utilizada para definir la Ruta Óptima de Recorrido del montacargas durante el picking, independientemente de la lógica del código físico.
Excluir de la asignación automática en la salida: Evita que el sistema proponga esta celda en entregas automáticas (útil para zonas de difícil acceso o celdas reservadas).
Restricciones de Ubicación: Mecanismo de gobernanza para evitar errores operacionales (artículo único, lote único o bloqueo por humedad/mantenimiento).
Atributos (Hasta 10 campos de usuario): Características dimensionales o ambientales (ej. Altura, Ancho, Capacidad Térmica, Zona Antiestática).
2.3 Reorganización Masiva: Modificación de Códigos de Ubicación
En almacenes dinámicos es frecuente reorganizar pasillos o cambiar la orientación de estanterías.

Modificar códigos manualmente en miles de celdas con inventario sería inviable.
La herramienta Modificación de Códigos de Ubicación (Bin Location Code Modification) permite actualizar masivamente rangos de celdas.
Si las ubicaciones modificadas contienen artículos, SAP Business One genera automáticamente un documento de Traslado de Inventario (OWTR/WTR1) que migra el stock desde el código antiguo hacia el nuevo código, manteniendo la trazabilidad contable y de auditoría intacta.


3. ATLAS DIDÁCTICO: EL WORKFLOW DE CONFIGURACIÓN
Flujo de Configuración en 4 Fases:
Fase 1: Habilitar Almacén $\rightarrow$ Fase 2: Configurar Subniveles y Atributos $\rightarrow$ Fase 3: Generar Códigos de Depósito $\rightarrow$ Fase 4: Configurar Ubicaciones Receptoras.
Generación Automática de Subniveles (Prefijo + Segmento Numérico):
Configuración de prefijo fijo R + Rango numérico 1 a 30 con ceros a la izquierda $\rightarrow$ Genera R01, R02... R30 con orden alfanumérico limpio.
Matriz de Restricciones en Datos Maestros:
Casos de uso: Diferencia entre celda Inactiva (oculta de reportes y compras) vs celda con Restricción de Transacciones (visible pero bloqueada).


4. CASO DE NEGOCIO RESUELTO: DESPLIEGUE EN EL ALMACÉN DE NUEVA YORK
Escenario de Consultoría:
George, jefe de almacén en OEC Computers Nueva York, debe habilitar 240 celdas en el Pasillo Central (Área Roja).

Almacén: 01
Subnivel 1 (Piso): P1 (Planta Baja)
Subnivel 2 (Área): ROJ (Zona Roja)
Subnivel 3 (Fila): R01 a R20 (20 filas)
Subnivel 4 (Estante): A a F (6 alturas)
Procedimiento con el Asistente Masivo:
George abre Inventario > Ubicaciones > Gestión de ubicaciones.
Selecciona la tarea Generar ubicaciones.
Define los filtros: Almacén 01, Piso P1, Área ROJ, Filas R01 a R20, Estantes A a F.
Define el atributo Anti-Estático = SÍ para todas las celdas del estante A y B.
Pulsa OK y revisa la ventana de visualización previa (240 celdas generadas).
Pulsa Generar. Las 240 celdas se crean en la tabla OBIN en menos de 5 segundos con códigos como 01-P1-ROJ-R01-A.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Qué sucede inmediatamente en un almacén de SAP Business One cuando se marca la casilla "Activar ubicaciones"?
A) El sistema borra todo el stock existente para empezar desde cero.
B) Se crea automáticamente la "Ubicación del Sistema" ([Almacén]-SYSTEM-BIN-LOCATION), donde se aloja todo el inventario actual y las nuevas entradas, permitiendo que la empresa siga operando normalmente.
C) Se bloquea la creación de facturas de clientes en toda la empresa.
D) Se requiere reiniciar el servidor de base de datos HANA.
Respuesta Correcta: B
Justificación Técnica: La ubicación del sistema garantiza la continuidad operativa ("Business as usual"), asignando temporalmente las transacciones a esta celda virtual hasta que se definan las celdas físicas reales.
Pregunta 2
¿Bajo qué condición estricta permite SAP Business One marcar una ubicación como "Inactiva" (Inactive)?
A) Solo si la celda pertenece a un proveedor extranjero.
B) Únicamente si la ubicación tiene saldo de inventario igual a cero y no tiene documentos abiertos de recuento de inventario.
C) En cualquier momento, trasladando los artículos automáticamente a pérdidas.
D) Solo si la celda está ubicada en el último piso del almacén.
Respuesta Correcta: B
Justificación Técnica: Para preservar la integridad física y contable del almacén, SAP Business One no permite desactivar una celda si aún contiene artículos o si forma parte de un inventario físico en proceso.
Pregunta 3
Si se reorganiza un almacén y se cambian los códigos de ubicación mediante la herramienta "Modificación de códigos de ubicación", ¿cómo gestiona el sistema los artículos que se encontraban en las celdas originales?
A) Emite un error fatal y cancela el proceso.
B) Genera automáticamente un documento de Traslado de Inventario que transfiere el stock desde el código de ubicación original hacia el nuevo código.
C) Los artículos quedan en un estado de limbo contable sin ubicación.
D) Transforma los artículos en números de serie provisionales.
Respuesta Correcta: B
Justificación Técnica: La herramienta automatiza la migración física y contable creando el traslado correspondiente en OWTR, garantizando auditoría total del cambio de celdas.