# MÓDULO 04: GESTIÓN DE INVENTARIO Y ALMACENES (VALORACIÓN, MOVIMIENTOS, UBICACIONES Y RECUENTOS FÍSICOS) (SAP BUSINESS ONE 10.0 & ERP)

**Tipo de Contenido:** Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA  
**Fuentes Oficiales Analizadas:** 10_ItemInv_11_Item_ItemMD_ES.pdf, 10_ItemInv_21_UoM_Overview_ES.pdf, 10_ItemInv_31_WM_WH_ES.pdf, 10_ItemInv_32_WM_GM_ES.pdf, 10_ItemInv_41_Valuation_ValMethods_ES.pdf, 10_Item_42_SNBatch_Valuation.pdf, 10_BinLoc_11_Overview_Overview_ES.pdf, 10_BinLoc_12_Setup_Setup.pdf y 10_Inven_13_WM_PhyInv.pdf  
**Nivel:** Avanzado / Consultoría de Cadena de Suministro, Finanzas de Inventario y Logística  
**Tiempo Estimado de Estudio:** 70 minutos (dividido en 4 lecciones integradas)

---

## Resumen Ejecutivo

El Módulo 04 explora el corazón de la gestión logística y financiera en SAP Business One: **el Inventario**. Comprender cómo el sistema valora cada artículo (Media Variable, FIFO, Coste Estándar o Lote/Serie) es vital, ya que cada movimiento físico desencadena impactos contables inmediatos en un modelo de inventario permanente. A lo largo de este módulo, aprenderás el *porqué* detrás de las salidas y traslados de mercancías, cómo estructurar almacenes complejos mediante ubicaciones (Bin Locations) de hasta 4 subniveles para acelerar la operativa, y la importancia estratégica de realizar recuentos físicos cíclicos. Dominar estos conceptos permite mantener la precisión del stock, cumplir normativas fiscales y optimizar la cadena de suministro de cualquier empresa.

---

## ÍNDICE DEL MÓDULO

1. **Lección 4.1:** Inventario Permanente y Métodos de Valoración (Media Variable, FIFO, Coste Estándar y Lote/Serie)
2. **Lección 4.2:** Movimientos de Mercancías, Traslados y Almacenes en Consignación
3. **Lección 4.3:** Gestión Avanzada de Ubicaciones en Almacén (Bin Locations de 4 Subniveles)
4. **Lección 4.4:** Inventario Físico, Recuentos Cíclicos y Ajustes de Diferencias
5. **Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA**
6. **Banco de Evaluación Situacional**
7. **Guiones Humanizados para Locución IA (ElevenLabs)**

---

## LECCIÓN 4.1: INVENTARIO PERMANENTE Y MÉTODOS DE VALORACIÓN

### 1. Inventario Permanente vs. No Permanente

En SAP Business One, la decisión arquitectónica fundamental sobre existencias se define durante la inicialización básica de la base de datos (**Gestión > Inicialización del sistema > Detalles de la empresa > Inicialización básica**). Entender esta diferencia es crucial porque afecta toda la vida financiera de la empresa.

* **Sistema de Inventario Permanente (Perpetual Inventory):**
  * Cada movimiento físico de entrada o salida genera asientos contables **inmediatos y automáticos** en el Libro Mayor.
  * Permite conocer el valor contable y físico exacto del inventario en tiempo real en cualquier segundo del año.
  * **Regla irrevocable:** Una vez contabilizada la primera transacción de inventario en la empresa, la casilla de inventario permanente queda bloqueada de por vida y no se puede desactivar ni modificar.

* **Sistema de Inventario No Permanente:**
  * Las transacciones logísticas solo mueven cantidades físicas, sin generar asientos en el libro mayor.
  * La cuenta de existencias se actualiza manualmente una sola vez al cierre de cada periodo contable mediante asientos de ajuste manuales. *Este método está cada vez más en desuso por su falta de visibilidad en tiempo real.*

---

### 2. Comparativa de los 4 Métodos de Valoración en Inventario Permanente

> **¿Por qué importa el método de valoración?** Porque define el Costo de Mercancía Vendida (COGS) y, por lo tanto, la rentabilidad y los impuestos a pagar. Toda **ENTRADA** se registra a precio de compra real. El reto es: *¿Cómo se valora la SALIDA al vender o consumir?*

| Método | Fórmula / Concepto | Caso de Uso Ideal |
| :--- | :--- | :--- |
| **Media Variable** | Coste = Valor Total / Cantidad en Stock | Artículos comerciales generales (fluctuación de precios moderada). |
| **FIFO (Capas)** | Coste = Capa más antigua disponible | Productos perecederos, alimentos, fármacos (riesgo de obsolescencia). |
| **Coste Estándar** | Coste = Valor Fijo (Desviación a cuenta P&L) | Manufactura, costos de ingeniería, servicios sin stock físico. |
| **Por Lote / Serie** | Coste = Costo real de ese lote/serie específico | Maquinaria, joyas, equipos de alto valor unitario. |

#### A. Método de Precio Medio Variable (Moving Average)
* **Fórmula:** `Coste Unitario Actual = Valor Monetario Total del Stock / Cantidad Total en Stock`
* **Dinámica (El Porqué):** Suaviza los picos de precios. Si compras 5 unidades a $100 y luego 5 a $200, tus 10 unidades ahora valen $150 cada una. Las ventas descargarán a $150.

#### B. Método FIFO (First In, First Out)
* **Dinámica de Capas:** Cada recepción crea una "capa" independiente. Las salidas consumen estrictamente la capa más antigua.
* **El Porqué:** Muestra un costo de ventas más apegado al pasado, dejando el inventario final valorado a costos recientes. Requiere estricto control.
* **Herramienta de Auditoría:** El *Reporte Capas FIFO* por orden de consumo desglosa cada capa con su transacción de origen.

#### C. Método de Coste Estándar (Standard Cost)
* **Concepto:** Se fija manualmente un costo constante (ej. $100).
* **Tratamiento de Desviaciones:** Si compras a $120, la diferencia ($20) va directamente a una cuenta de pérdidas/ganancias (Desviación de Precios de Compra).
* **Actualización:** Se realiza mediante la **Revalorización de inventario**, generando un asiento contable formal.

#### D. Método de Valoración por Lote / Serie
* **Concepto:** Rentabilidad a nivel de ítem individual. La salida se valoriza exactamente al costo con el que ingresó ese artículo específico, sin mezclar promedios.

---

### 3. El Informe de Auditoría de Inventario (Inventory Audit Report)

* Es el informe contable y forense **más importante** de SAP Business One.
* **Propósito:** Reconciliar y comparar la Vista de Logística (unidades físicas y kardex de movimientos) contra la Vista Contable (saldos en las cuentas de mayor del balance).
* Demuestra línea por línea cada incremento, disminución y saldo acumulado.

---

## LECCIÓN 4.2: MOVIMIENTOS DE MERCANCÍAS, TRASLADOS Y CONSIGNACIÓN

En un ERP, no todas las salidas/entradas nacen de compras o ventas. Existen movimientos puros de inventario interno.

### 1. Entrada de Mercancías sin Referencia (Goods Receipt)
* **Cuándo se usa:** Para ingresos sin proveedor (ej. muestras gratuitas, inventario inicial de migración, sobrantes de auditoría).
* **Precio:** El usuario especifica manualmente el valor unitario (a diferencia de una compra donde viene en la factura).
* **Asiento Contable:** `DEBE: Cuenta de Inventario (Activo) | HABER: Compensación de Stocks (Ingreso)`.

### 2. Salida de Mercancías sin Referencia (Goods Issue)
* **Cuándo se usa:** Bajas por siniestros, obsolescencia técnica o entrega de muestras a ferias.
* **Precio:** Es informativo. El sistema calcula automáticamente el valor contable de salida usando el método de valoración configurado (ej. toma el costo medio).
* **Asiento Contable:** `DEBE: Pérdida por Merma (Gasto) | HABER: Cuenta de Inventario (Activo)`.

### 3. Traslados de Inventario (Stock Transfer)
Mueve existencias entre dos almacenes de la misma sociedad.
* **Solicitud de Traslado:** Documento de reserva. El material pasa a "Comprometido" (origen) y "Solicitado" (destino). Protege el stock de ser vendido mientras viaja.
* **Traslado Final:** Ejecuta el movimiento real cancelando las reservas.

### 4. Almacenes en Consignación en Instalaciones del Cliente
* **Modelo (El Porqué):** El cliente mantiene tu mercancía, pero solo se factura cuando la consume. Retienes la propiedad del activo.
* **Implementación:**
  1. Creas un **almacén virtual** (ej. Almacén 07 - Cliente XYZ).
  2. Emites un **Traslado de Inventario** hacia el Almacén 07 (no genera ingreso ni factura).
  3. Al recibir el reporte de consumo, emites una **Factura de Clientes** desde el Almacén 07, reconociendo la venta fiscal y descargando el stock definitivamente.

---

## LECCIÓN 4.3: GESTIÓN AVANZADA DE UBICACIONES (BIN LOCATIONS)

Saber que hay 1,000 unidades en el "Almacén Central" no sirve en la operación de una gran nave logística. Las **Bin Locations** reducen los tiempos de búsqueda drásticamente.

### 1. Estructura Jerárquica de 4 Subniveles
SAP Business One permite estructurar el espacio físico:
* **Subnivel 1:** Pasillo (Aisle) -> ej: A04
* **Subnivel 2:** Estantería (Rack) -> ej: S02
* **Subnivel 3:** Nivel (Shelf) -> ej: L09
* **Subnivel 4:** Casilla / Posición
> **Código de Ubicación Generado:** `01-A04-S02-L09`. Este código se mapea con códigos de barras.

### 2. Depósitos de Recepción (Receiving Bin Locations)
* **El Porqué:** Sirven como "sala de espera". Áreas para descarga e inspección de calidad antes de poner los artículos en su estantería definitiva.
* Al registrar una Entrada, el sistema envía los artículos aquí. Luego, un traslado interno los reubica en el pasillo correspondiente.

### 3. Estrategias de Asignación Automática
* **Entradas:** El sistema puede llenar casillas vacías o sugerir ubicación por peso/volumen.
* **Salidas (Picking):**
  * *FIFO Estricto por Ubicación:* Sugiere recoger primero de las casillas con los lotes más antiguos.
  * *Vaciado de Casillas:* Prioriza recoger saldos pequeños para liberar estanterías completas.

---

## LECCIÓN 4.4: INVENTARIO FÍSICO Y RECUENTOS CÍCLICOS

El cotejo físico contra el sistema es ineludible operativa y fiscalmente.

### 1. Recuentos Cíclicos (Cycle Counting)
* **El Porqué:** Evita cerrar la planta una vez al año. Son conteos continuos basados en importancia (Clasificación ABC).
  * **Tipo A:** Alto valor/rotación (6 veces al año).
  * **Tipo B:** Valor medio (2 veces al año).
  * **Tipo C:** Bajo valor (1 vez al año).

### 2. El Documento "Recuento de Inventario"
* **Función "Congelar Artículos" (Freeze):** Bloquea transacciones sobre ese artículo en esa ubicación hasta terminar el conteo. Evita discrepancias por movimientos paralelos.
* **Modalidades de Conteo:** Soporta *Contador Individual* o *Contadores Múltiples* (dos personas cuentan lo mismo, sin ver el resultado del otro, y el sistema cruza los datos para evitar fraudes/errores).

### 3. Contabilización de Diferencias (Inventory Posting)
Si el conteo físico no cuadra con el teórico, se genera una contabilización de stocks:
* **Faltante (Merma/Robo):** `DEBE: Gasto por Pérdida de Inventario | HABER: Inventario`.
* **Sobrante:** `DEBE: Inventario | HABER: Ganancia por Diferencia`.

---

## MATRIZ DE TROUBLESHOOTING PARA EL COPILOTO IA

| Síntoma / Problema | Causa Raíz | Instrucción de Asesoría del Copiloto |
| :--- | :--- | :--- |
| **"Queremos cambiar el método de Media Variable a FIFO, pero la opción está bloqueada."** | El artículo ya tiene transacciones o saldo acumulado en un sistema de inventario permanente. | 1. Sacar el stock a cero vía *Salida de Mercancías*. 2. Cambiar el método. 3. Reingresar el saldo vía *Entrada de Mercancías*. (Requiere visto bueno contable). |
| **"Error al hacer traslado: 'Artículo congelado'."** | El artículo forma parte de un documento de *Recuento de Inventario* abierto con "Congelar" activo. | 1. Ir a *Recuento de inventario*. 2. Desmarcar la casilla "Congelar" o finalizar la contabilización del conteo inmediatamente. |
| **"Sistema exige ubicación al hacer traslado y el operario no sabe cuál poner."** | Almacén gestionado por Ubicaciones (Bin Locations) requiere casillero estricto. | 1. Clic derecho en el campo Cantidad > *Asignación de ubicación*. 2. Seleccionar el casillero físico exacto o el depósito de recepción predeterminado. |

---

## BANCO DE EVALUACIÓN SITUACIONAL

**Pregunta 1 (Métodos de Costeo)**
Durante un año de alta inflación donde los precios de compra de un insumo tecnológico suben continuamente de $100 a $150 y luego a $200, ¿qué método de valoración arrojará el Costo de Mercancía Vendida (COGS) *más bajo* en la primera venta?
* A) Precio Medio Variable.
* B) First In, First Out (FIFO). **[CORRECTA]**
* C) Coste Estándar fijado en $200.
* D) El costo de reposición de mercado.
> *Explicación:* Con FIFO, las ventas consumen primero las capas más antiguas (compradas a $100), reconociendo un costo de ventas menor y reportando, por tanto, una ganancia bruta temporalmente más alta.

**Pregunta 2 (Logística Operativa)**
Una distribuidora traslada 100 cajas de repuestos a un almacén ubicado dentro de la fábrica de su cliente principal bajo la modalidad de consignación. ¿Qué documento debe emitirse y qué impacto contable produce?
* A) Una Factura de Clientes que reconoce el ingreso inmediatamente.
* B) Una Salida de Mercancías que da de baja el material como costo de ventas.
* C) Un Traslado de Inventario hacia el almacén de consignación del cliente, el cual mueve existencias entre almacenes sin generar facturación ni reconocimiento de ingresos. **[CORRECTA]**
* D) Una Devolución de Mercancías al proveedor.
> *Explicación:* El traslado a consignación mantiene la titularidad del activo en los libros de la empresa; la venta y el ingreso solo se perfeccionan fiscalmente cuando el cliente informa el consumo efectivo del material.

**Pregunta 3 (Recuentos Físicos y Congelación)**
Un jefe de almacén está realizando un recuento cíclico y nota que no puede despachar un pedido urgente de un cliente porque SAP arroja el error "Artículo congelado". ¿Por qué sucede esto y cuál es la solución operativa recomendada?
* A) El artículo fue bloqueado desde la ficha maestra y debe activarse manualmente.
* B) El artículo está incluido en un documento de "Recuento de Inventario" abierto con la opción "Congelar" marcada. Para despachar, debe desmarcarse temporalmente o contabilizar el conteo. **[CORRECTA]**
* C) El artículo se quedó sin saldo; debe hacerse una nueva entrada de mercancías.
* D) El artículo está reservado de por vida en una orden de producción.
> *Explicación:* La función "Congelar" protege la fidelidad del conteo físico impidiendo transacciones logísticas simultáneas. La solución es concluir rápidamente el recuento o liberar temporalmente la bandera.

**Pregunta 4 (Traslados vs. Salidas por Merma)**
Si necesitas retirar existencias del almacén porque han sufrido daños irrevocables debido a una inundación en los pasillos, ¿qué documento es el apropiado para reflejar contablemente esta pérdida?
* A) Factura de Reserva de Clientes.
* B) Entrada de Mercancías.
* C) Traslado de Inventario a un almacén de tránsito.
* D) Salida de Mercancías sin Referencia (Goods Issue). **[CORRECTA]**
*Explicación:* La Salida de Mercancías sin referencia está diseñada precisamente para mermas, robos, daños u obsolescencias. Contablemente genera un gasto por pérdida que rebaja el activo del inventario.

**Pregunta 5 (Ubicaciones y Recepción Logística)**
Al recibir un contenedor con mercancía importada en un almacén configurado con ubicaciones de 4 subniveles, la mejor práctica recomendada para inspeccionar la calidad del producto antes de ubicarlo en la estantería final es:
* A) Enviar directamente el producto al subnivel 4 de manera aleatoria.
* B) Configurar y utilizar "Depósitos de Recepción" (Receiving Bin Locations) para alojar la mercancía temporalmente. **[CORRECTA]**
* C) Hacer una Salida de Mercancía seguida de una Entrada.
* D) No asignar ninguna ubicación hasta que la mercancía se haya vendido.
> *Explicación:* Los Depósitos de Recepción actúan como "salas de cuarentena" temporales dentro del sistema, permitiendo que la entrada se registre rápidamente sin entorpecer los pasillos finales hasta que pase el control de calidad.

---
