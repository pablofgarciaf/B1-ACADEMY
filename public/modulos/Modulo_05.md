# MÓDULO 05: PLANIFICACIÓN DE NECESIDADES Y PRODUCCIÓN (MRP & LISTAS DE MATERIALES BOM) (SAP BUSINESS ONE 10.0)

**Tipo de Contenido:** Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA  
**Nivel:** Avanzado / Planificación Industrial, Manufactura y Contabilidad de Costos  
**Tiempo Estimado de Estudio:** 70 minutos

---

## Resumen Ejecutivo

Este módulo profundiza en el núcleo industrial y de planificación de SAP Business One 10.0. A través de este entrenamiento, comprenderás no solo *cómo* estructurar listas de materiales (BOM) y ejecutar el motor de Planificación de Necesidades de Materiales (MRP), sino también el *porqué* estratégico detrás de cada proceso. Dominar estos conceptos te permitirá optimizar la cadena de suministro, garantizar un costeo exacto mediante las cuentas de Trabajo en Proceso (WIP) y asegurar que las decisiones de compra y fabricación se basen en la demanda real, evitando tanto el quiebre de stock como el sobreinventario.

---

## ÍNDICE DEL MÓDULO

1. **Lección 5.1**: Tipologías de Listas de Materiales (BOM) y Modelado de Recursos
2. **Lección 5.2**: El Proceso Productivo: De la Orden Planificada al Cierre de Fabricación
3. **Lección 5.3**: Contabilidad de Costos de Producción: Cuentas WIP y Liquidación de Desviaciones
4. **Lección 5.4**: El Motor MRP: Fuentes de Demanda, Suministro y Recomendaciones Automatizadas
5. **Matriz de Troubleshooting**: Reglas Críticas para la Resolución de Problemas
6. **Banco de Evaluación Situacional**: 5 Ejercicios Prácticos
7. **Guiones Humanizados para Locución IA** (ElevenLabs)

---

## LECCIÓN 5.1: TIPOLOGÍAS DE LISTAS DE MATERIALES (BOM) Y MODELADO DE RECURSOS

Una Lista de Materiales (LdM o BOM, por sus siglas en inglés *Bill of Materials*) define la "receta" requerida para estructurar un producto terminado o paquete comercial. Comprender el tipo correcto de BOM es fundamental porque define el impacto contable y logístico en el sistema.

### 1. Las 4 Clases de Listas de Materiales en SAP Business One

| Tipo de BOM | ¿Requiere Orden de Producción? | ¿El Padre es Inventariable? | ¿Componentes Inventariables? | Caso de Uso Empresarial y Justificación Pedagógica |
| :--- | :---: | :---: | :---: | :--- |
| **Producción** | SÍ (Obligatorio) | SÍ | SÍ (Artículos y Recursos) | **Fabricación industrial** (muebles, electrónicos). *Por qué:* Transforma físicamente componentes en un nuevo activo. Se requiere costeo formal. |
| **Ventas (Kit)** | NO (Va directo a ventas) | NO | SÍ (Se descargan al despachar) | **Paquetes promocionales** (PC + Monitor). *Por qué:* Agiliza la venta de combos sin necesidad de ensamblaje previo en bodega. |
| **Montaje** | NO | NO | SÍ | **Kits simples opacos al cliente**. *Por qué:* El cliente ve un solo ítem en la factura, pero internamente se descuentan los componentes. |
| **Modelo** | NO | NO | Opcional | **Plantillas editables**. *Por qué:* Ideal para cotizaciones donde el vendedor ajusta sugerencias base según las necesidades del cliente. |

### 2. Estructuras Multinivel (Árbol de Explosión de Materiales)

Los productos complejos rara vez se ensamblan a partir de materias primas puras. Un artículo "padre" puede tener componentes que son, a su vez, subensambles.
* **Ejemplo Práctico:**
  * **Nivel 0 (Padre final):** Servidor Empresarial.
  * **Nivel 1 (Hijos):** Teclado (Comprado), Mano de Obra (Recurso), y Torre CPU (Fabricado internamente).
  * **Nivel 2 (Nietos):** La Torre CPU se compone de Tarjeta Madre, Discos Duros y Horas de Ensamblaje.
* *El Porqué:* Esta estructura permite al sistema (MRP) planificar en cascada, asegurando que los subensambles se fabriquen a tiempo para la producción del ensamble final.

### 3. Integración de Recursos (Mano de Obra y Maquinaria)

La producción real consume tiempo y energía, no solo piezas. SAP incorpora **Recursos** para absorber estos costos indirectos y operativos:
* **Recursos Máquina:** Costeados por hora máquina o ciclo (ej. Torno CNC).
* **Recursos Mano de Obra:** Costeados por hora hombre.
* **Rutas de Producción (Routing):** Permiten secuenciar la fabricación en etapas cronológicas (ej. *Fase 1: Corte -> Fase 2: Ensamble*), controlando el flujo y asignando dependencias lógicas para no iniciar el ensamble sin haber cortado el material.

---

## LECCIÓN 5.2: EL PROCESO PRODUCTIVO: DE LA ORDEN PLANIFICADA AL CIERRE DE FABRICACIÓN

El ciclo de vida de una Orden de Producción refleja la realidad física del taller y asegura que la contabilidad avance en sincronía.

### Flujo del Proceso:

1. **Crear Orden (Estatus: PLANIFICADO)** -> Permite ajustes de diseño. No mueve inventario.
2. **Liberar a Planta (Estatus: LIBERADO)** -> Autorización oficial. Habilita consumos físicos.
3. **Consumo de Insumos (Emisión / Backflush)** -> Traslado del almacén a la línea de ensamblaje.
4. **Recibo de Producción** -> Ingresa el Producto Terminado a la bodega valorado.
5. **Cierre de Orden (Estatus: CERRADO)** -> Liquidación contable final de variaciones.

### Métodos de Emisión: Manual vs. Backflush (Notificación Posterior)

| Característica | Emisión Manual | Notificación Posterior (Backflush) |
| :--- | :--- | :--- |
| **Mecánica** | Documento explícito antes/durante la fabricación. | Descarga automática al recibir el producto terminado. |
| **Ventaja** | Control absoluto. Ideal para insumos costosos o con mermas variables. | Celeridad administrativa. Ideal para tornillería o procesos continuos. |
| **Limitación** | Requiere mayor carga de datos por los operarios. | **Prohibido** para artículos gestionados por Lotes/Series (requieren selección manual). |

---

## LECCIÓN 5.3: CONTABILIDAD DE COSTOS DE PRODUCCIÓN: CUENTAS WIP Y LIQUIDACIÓN

La clave para entender la contabilidad de manufactura es visualizar la transformación del valor.

### 1. La Cuenta de Trabajo en Proceso (WIP)
La cuenta *Work In Process (WIP)* es el "puente" financiero temporal. Cuando un insumo sale del almacén hacia la planta, su valor no se pierde ni se convierte inmediatamente en un gasto; se transfiere a la cuenta WIP, representando un activo en transformación.

### 2. Los Asientos Contables Clave

* **A. Emisión para Producción:**
  * `DEBE:` Cuenta WIP (Acumula el costo en planta)
  * `HABER:` Existencias Materias Primas / Absorción de Recursos (Sale de bodega/Se reconoce el trabajo)
* **B. Recibo de Producción:**
  * `DEBE:` Existencias Producto Terminado (Entra nuevo activo valorado)
  * `HABER:` Cuenta WIP (Se vacía el puente temporal)
* **C. Cierre de Orden (Liquidación):**
  * *Por qué es crítico:* La realidad nunca es perfecta. Si se planificó usar 10 tornillos pero se usaron 12, la cuenta WIP quedará con un saldo remanente. Al cerrar la orden, SAP lleva este remanente a cero, ajustando el costo del producto terminado (si sigue en bodega) o enviando la diferencia a una cuenta de **Desviación de Producción** en el Estado de Resultados.

---

## LECCIÓN 5.4: EL MOTOR MRP: FUENTES DE DEMANDA, SUMINISTRO Y RECOMENDACIONES AUTOMATIZADAS

El **Material Requirements Planning (MRP)** es el cerebro logístico. Su misión es evitar el desabastecimiento sin inmovilizar capital en exceso de inventario.

### 1. La Ecuación de Balance

> **Balance Proyectado** = `Stock Actual` + `Suministros Esperados` (Compras en camino, Órdenes de producción abiertas) - `Demanda Comprometida` (Pedidos de venta, Mínimos de inventario)

Si el Balance Proyectado es negativo en el horizonte de tiempo evaluado, el MRP genera una **Recomendación**.

### 2. Parámetros Maestros Críticos
El éxito del MRP depende de cómo esté configurado el Artículo:
* **Método de Aprovisionamiento:** ¿Se compra a proveedor (Genera Pedido de Compra) o se fabrica (Genera Orden de Producción)?
* **Múltiplos de Pedido:** Si el artículo se vende en cajas de 50 y faltan 10, el MRP recomendará pedir 50.
* **Tiempo de Entrega (Lead Time):** Días que tarda el proveedor en surtir. Esencial para saber *cuándo* lanzar la orden.

---

## MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA

* **Problema 1: El MRP no genera recomendaciones pese a tener ventas abiertas.**
  * *Causa:* El artículo tiene el "Método de planificación" en "Ninguno", o el almacén de venta fue excluido del escenario.
  * *Solución (Copiloto):* "Revisa la pestaña 'Datos de Planificación' en el Maestro del Artículo para asegurar que esté en MRP y verifica los almacenes incluidos en el Paso 4 del asistente."

* **Problema 2: Error de 'Stock Negativo' al hacer un Recibo de Producción por Backflush.**
  * *Causa:* Al ingresar el terminado, el sistema intenta descontar los hijos automáticamente, pero un insumo no tiene existencias físicas.
  * *Solución (Copiloto):* "No habilites el stock negativo. Verifica en la lista BOM qué insumo está en cero, realiza su Entrada de Mercancías previa y vuelve a intentar el recibo de producción."

---

## BANCO DE EVALUACIÓN SITUACIONAL

**Pregunta 1 (Estructura BOM)**
Una empresa vende un kit promocional que contiene vino y chocolates a un precio especial. No se ensamblan previamente; los operarios empacan los ítems al momento de la venta. ¿Qué BOM usar?
* A) Producción
* B) Ventas (Kit) **[CORRECTA]**
* C) Montaje
* *Explicación:* La BOM de Ventas agrupa artículos para fijar un precio comercial conjunto, descargándolos en la Entrega sin requerir una Orden de Producción, optimizando así la operación comercial directa.

**Pregunta 2 (Contabilidad Industrial)**
Al registrar una Emisión para Producción manual, ¿qué ocurre contablemente?
* A) Débito a Costo de Ventas y Crédito a Materias Primas.
* B) Débito a Cuenta WIP y Crédito a Existencias de Materias Primas. **[CORRECTA]**
* C) Débito a Producto Terminado y Crédito a Proveedores.
* *Explicación:* El valor de los insumos abandona la bodega pero no se pierde; se transfiere al Activo Transitorio "WIP" mientras ocurre la transformación.

**Pregunta 3 (Lógica de Planificación MRP)**
El MRP detecta una escasez de 15 unidades de un artículo comprado. Sin embargo, genera una recomendación de compra por 100 unidades. ¿Cuál es la causa técnica?
* A) El Lead Time del artículo está mal configurado.
* B) El usuario activó accidentalmente una orden de producción.
* C) El campo "Múltiplo de Pedido" o "Cantidad Mínima" del artículo está fijado en 100. **[CORRECTA]**
* *Explicación:* El MRP respeta las restricciones de los proveedores. Si el proveedor solo vende lotes de 100 (Múltiplo), el MRP recomendará escalar la solicitud para cumplir con la viabilidad comercial.

**Pregunta 4 (Emisión Backflush)**
Al intentar cambiar el método de emisión a "Backflush" para el Componente X dentro de una Orden de Producción, SAP bloquea la acción. ¿Cuál es el motivo funcional más probable?
* A) La orden de producción ya está en estado "Liberado".
* B) El Componente X se gestiona por Números de Serie o Lotes. **[CORRECTA]**
* C) No hay suficiente stock en el almacén central.
* *Explicación:* El Backflush descuenta artículos a ciegas. Un artículo serializado exige que el operario declare explícitamente *qué* lote o serie específica se consumió, por ende el Backflush está estrictamente prohibido para ellos.

**Pregunta 5 (Liquidación de Desviaciones)**
Se fabricó y vendió un mueble. Al cerrar la Orden de Producción, el sistema detecta que se usó más madera de la planificada. ¿Dónde se refleja esta diferencia contable en el asiento de cierre?
* A) Ajusta el valor del inventario del Producto Terminado.
* B) Se liquida contra la Cuenta de Desviación de Producción en Pérdidas y Ganancias. **[CORRECTA]**
* C) El sistema no permite cerrar la orden hasta devolver la madera.
* *Explicación:* Como el producto terminado *ya fue vendido*, ya no está en la bodega para absorber el ajuste en su costo de inventario. La diferencia monetaria por ineficiencia se reconoce como una variación operativa (pérdida) en el estado de resultados.

---
