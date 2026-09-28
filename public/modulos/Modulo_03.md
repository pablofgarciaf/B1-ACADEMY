# MÓDULO 03: VENTAS Y GESTIÓN DE CLIENTES (ORDER-TO-CASH Y AUTOMATIZACIÓN COMERCIAL)
*(SAP Business One 10.0 & ERP)*

**Tipo de Contenido:** Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA  
**Nivel:** Intermedio / Especialista Comercial, Logístico y Financiero  
**Tiempo Estimado de Estudio:** 65 minutos (dividido en 4 lecciones integradas)  

---

## Resumen Ejecutivo

El presente módulo abarca de principio a fin el ciclo de ingresos o **Order-to-Cash (O2C)** en SAP Business One. Entender este proceso es fundamental, no solo para registrar transacciones comerciales, sino porque cada paso tiene un impacto directo e inmediato en los **niveles de inventario**, el **costo de ventas**, y los **ingresos fiscales** de la compañía. Aprenderemos por qué la sincronización entre ventas, almacén y finanzas previene quiebres de stock, cuellos de botella en despachos y errores contables. Adicionalmente, abordaremos herramientas de automatización masiva (*Pick & Pack*), control dinámico de disponibilidad (*ATP*) y las mejores prácticas operativas para la gestión de devoluciones y notas de crédito.

---

## ÍNDICE DEL MÓDULO

1. **Lección 3.1:** El Ciclo Estándar Order-to-Cash (O2C) y Reglas Contables
2. **Lección 3.2:** Verificación de Disponibilidad (ATP) y Reprogramación Gráfica de Entregas
3. **Lección 3.3:** Automatización Operativa: Pick & Pack y Asistente de Facturación en Lote
4. **Lección 3.4:** Devoluciones de Clientes, Abonos (Notas de Crédito) y Reclamos
5. **Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA**
6. **Banco de Evaluación Situacional**
7. **Guiones Humanizados para Locución IA (ElevenLabs)**

---

## LECCIÓN 3.1: EL CICLO ESTÁNDAR ORDER-TO-CASH (O2C) Y REGLAS CONTABLES

### 1. Las 5 Etapas del Ciclo Comercial
El ciclo de ingresos asegura la captura precisa de pedidos, el despacho oportuno y la cobranza efectiva. Entender el "porqué" de cada fase evita desajustes en el balance general:

* **Paso 1: Oferta de Ventas (Sales Quotation)**
  * *Por qué:* Es una propuesta comercial no vinculante. Define precios, descuentos y validez antes de formalizar la compra. No afecta inventario ni finanzas.
* **Paso 2: Pedido de Cliente (Sales Order)**
  * *Por qué:* Representa el compromiso legal. Aquí se aparta la mercancía (aumenta el stock *Comprometido*), asegurando que nadie más la venda.
* **Paso 3: Entrega / Albarán (Delivery)**
  * *Por qué:* Documenta la salida física del almacén. Es crítico porque en este instante se reconoce financieramente el **Costo de Ventas** y se reduce el inventario físico.
* **Paso 4: Factura de Clientes (A/R Invoice)**
  * *Por qué:* Otorga exigibilidad fiscal. Genera la deuda del cliente (Cuentas por Cobrar) y registra el ingreso por ventas más impuestos.
* **Paso 5: Cobro / Pago Recibido (Incoming Payment)**
  * *Por qué:* Cierra el ciclo ingresando el flujo de caja a tesorería, reconciliando la deuda contra los fondos bancarios.

### 2. Comportamiento del Stock y Asientos en Inventario Permanente

| Documento | Movimiento en Almacén | Impacto Contable (Libro Mayor) |
| :--- | :--- | :--- |
| **Oferta de Ventas** | Ninguno. | Sin contabilización. |
| **Pedido de Cliente** | Aumenta stock "Comprometido". Reduce "Disponible". El físico no cambia. | Sin contabilización (no hay asientos en el balance). |
| **Entrega** | Reduce stock "Físico" y libera/reduce "Comprometido". | **DEBE:** Costo de Ventas (COGS)<br>**HABER:** Existencias (Inventario). |
| **Factura de Clientes** | Ninguno (si copia de una Entrega previa). | **DEBE:** Cuenta por Cobrar (Cliente)<br>**HABER:** Ingresos por Ventas e IVA. |
| **Cobro Recibido** | Ninguno. | **DEBE:** Banco / Caja<br>**HABER:** Cuenta por Cobrar (Cliente). |

### 3. Dinámica del Stock: La Ecuación Maestra
En un ERP, nunca se evalúa el inventario solo mirando los estantes. La salud logística se rige por:

> **Cantidad Disponible = En Stock (Físico) - Comprometido (Reservado) + Solicitado (En camino)**

* **En Stock:** Físicamente en bodega.
* **Comprometido:** Ya vendido o reservado internamente.
* **Solicitado:** Compras a proveedores confirmadas y en tránsito.
* **Disponible:** Lo que realmente un vendedor puede ofrecer sin fallarle al cliente.

### 4. Venta Directa en Mostrador (Factura Directa sin Entrega)
En escenarios de *retail*, el cliente compra y se lleva el producto al instante. 
* **Por qué un solo paso:** La Factura de Clientes se crea directamente sin pedido previo, unificando la salida de almacén (Costo de Ventas) y la exigibilidad fiscal (Ingreso).
> [!WARNING]
> **Regla de Auditoría:** Si ya despachaste una *Entrega*, jamás emitas una *Factura independiente*. Si lo haces, el sistema duplicará la salida física del producto y el costo de ventas, alterando gravemente tus estados financieros.

### 5. Previsualización de Asientos (Journal Entry Preview)
Los ERP previenen el fraude impidiendo borrar asientos. Por ello, SAP ofrece la herramienta de simulación contable antes de grabar un documento, permitiendo a los usuarios auditar cuentas afectadas, importes y centros de costo.

---

## LECCIÓN 3.2: VERIFICACIÓN DE DISPONIBILIDAD (ATP) Y REPROGRAMACIÓN GRÁFICA

### 1. Verificación de Disponibilidad Estándar
Cuando la demanda supera al stock disponible, el sistema bloquea preventivamente y despliega alertas para proteger el nivel de servicio. Las opciones son:
* **Continuar:** Acepta vender; la diferencia entra en *Backorder* (Pendiente).
* **Cambiar a cantidad disponible:** Vende solo lo que hay, perdiendo la venta del excedente.
* **Visualizar en otros almacenes:** Fomenta la sinergia entre sucursales de la misma empresa.
* **Artículos alternativos:** Sugiere reemplazos equivalentes para no perder al cliente.
* **Cambiar a disponibilidad más temprana:** Promete la entrega cruzando la fecha de arribo del proveedor.

### 2. Verificación de Cantidad ATP Avanzada (Exclusiva de SAP HANA)
Gracias al procesamiento *in-memory*, el motor ATP proyecta el inventario a futuro basándose en tiempos reales:
* **Propuesta Fraccionada:** Entregas parciales progresivas según va llegando la mercancía.
* **Entrega Única:** Despacha lo que hay para la fecha y desestima el saldo.
* **Entrega Completa:** Retrasa el despacho hasta que todo el pedido esté acopiado (evita múltiples costos logísticos de envío).

### 3. Reprogramación de Entregas (Delivery Schedule Management)
Herramienta visual para directores de almacén que necesitan apagar "incendios" logísticos.
* **El "Porqué":** A veces un cliente VIP necesita stock que ya fue reservado (comprometido) a un cliente de menor prioridad. 
* **Cómo:** A través de un diagrama de Gantt interactivo, se arrastran unidades de un pedido estándar y se reasignan instantáneamente al VIP, recalculando automáticamente las fechas de todos los implicados.

---

## LECCIÓN 3.3: AUTOMATIZACIÓN OPERATIVA: PICK & PACK Y ASISTENTE DE FACTURACIÓN

Para operaciones de alto volumen, gestionar entregas "una a una" es insostenible.

### 1. El Responsable de Picking (Pick and Pack Manager)
Centraliza la logística en tres cajones fluidos:
* **Cajón 1: "Abierto"** (Planeación) -> Se filtran pedidos listos para surtir.
* **Cajón 2: "Liberado"** (Ejecución) -> Se emiten *Listas de Picking* agrupadas por rutas o pasillos, minimizando los desplazamientos de los montacarguistas.
* **Cajón 3: "Picking Efectuado"** (Cierre) -> Al empacar, se generan las notas de *Entrega masiva* con un solo clic, impactando el stock contable de cientos de órdenes simultáneamente.

### 2. Asistente de Generación de Documentos de Facturación
Al final de la jornada administrativa, este asistente barre todas las *Entregas* y genera la facturación electrónica en lote, consolidando múltiples entregas semanales de un mismo cliente en una única factura mensual, reduciendo la carga administrativa en finanzas.

---

## LECCIÓN 3.4: DEVOLUCIONES, ABONOS Y RECLAMOS

Entender el estado documental es clave para aplicar el reverso financiero adecuado:

1. **Devolución de Clientes (Returns)**
   * *Cuándo usar:* La mercancía fue entregada pero **aún no se ha facturado**.
   * *Por qué:* Revierte únicamente el despacho físico y el costo de ventas. No toca ingresos ni deudas.
2. **Factura de Abono de Clientes (Nota de Crédito)**
   * *Cuándo usar:* La factura **ya fue emitida**.
   * *Por qué:* Tiene impacto fiscal completo. Anula la deuda, el IVA, el ingreso por ventas, y devuelve el artículo al inventario físico y costo de ventas.
3. **Abono "Sin Contabilización de Cantidad"**
   * *Cuándo usar:* El cliente reclama un descuento (ej. daño estético) pero **se queda con el producto**.
   * *Por qué:* Reconoce el gasto/descuento rebajando la deuda del cliente, pero **no altera** el stock físico en el almacén, porque la mercancía nunca retornó.

---

## MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS (IA)

| Problema Reportado | Causa Raíz Frecuente | Instrucción / Solución del Copiloto |
| :--- | :--- | :--- |
| **"No puedo entregar, dice falta de stock, pero veo las cajas físicamente"** | Confusión entre Stock Físico y Stock Disponible. Las unidades están "Comprometidas" con otras órdenes. | Revisar pestaña "Datos de inventario" y auditar stock comprometido. Si es urgente, usar *Reprogramación de Entregas* para reasignarlo. |
| **"Hicimos Devolución y luego Contabilidad hizo una Nota de Crédito. El sistema falló."** | Duplicidad humana de procesos por falta de comunicación. El sistema no falló, los usuarios ingresaron dos operaciones correctivas. | Si ya había factura, **nunca** usar Devolución logística. Solo usar Nota de Crédito. Auditar si el inventario quedó inflado (doble ingreso) y emitir ajuste de salida. |
| **"Se facturó por mostrador y además se hizo una entrega en almacén para la misma venta."** | Violación del O2C: se hizo Factura Directa (que descuenta stock) y luego una Entrega aislada. | Genera doble salida de stock y doble costo. Se debe cancelar la entrega aislada o hacer una Nota de Crédito a la factura directa errónea. |

---

## BANCO DE EVALUACIÓN SITUACIONAL

**Pregunta 1: En una empresa que usa inventario permanente, ¿en qué momento exacto se registra financieramente el Costo de la Mercancía Vendida (COGS)?**
* A) Al emitir la Oferta de Ventas.
* B) Al registrar la Factura de Clientes.
* C) Al registrar la Entrega física de mercancías.
* D) Cuando el cliente paga la factura.
> **Respuesta Correcta: C**. La Entrega documenta la transferencia física del bien. En ese instante se debita el Costo de Ventas y se acredita la cuenta de Inventario, reconociendo el consumo del activo para la venta.

**Pregunta 2: Un cliente VIP exige 100 laptops para el viernes en un único envío, rechazando entregas en partes. Tienes 40 en bodega y llegan 60 el jueves. ¿Qué estrategia ATP recomiendas?**
* A) Propuesta de entrega fraccionada.
* B) Entrega Completa (Full Delivery).
* C) Cancelar el pedido de compras.
* D) Facturación directa en mostrador.
> **Respuesta Correcta: B**. La Entrega Completa consolidará la promesa de despacho para el viernes, impidiendo envíos parciales, lo cual respeta las condiciones del cliente y ahorra costos logísticos.

**Pregunta 3: Un cliente recibe un lote de escritorios, pero uno llegó con el tablero rayado. El cliente acepta no devolverlo si le haces un descuento de $50. ¿Qué documento debes emitir en SAP?**
* A) Una Devolución de Clientes.
* B) Un Abono de Clientes estándar.
* C) Un Abono de Clientes con la casilla "Sin contabilización de cantidad".
* D) Una Factura de reserva.
> **Respuesta Correcta: C**. Al usar el Abono "Sin contabilización de cantidad", se reduce la cuenta por cobrar y los ingresos en $50, pero el sistema entiende que el escritorio físico no regresó al almacén, manteniendo íntegro el conteo de inventario.

**Pregunta 4: Tu encargado de almacén tiene que preparar 300 pedidos de venta variados hoy. Está buscando los artículos pedido por pedido en toda la bodega. ¿Qué herramienta de SAP solucionaría esta ineficiencia logística?**
* A) Asistente de Generación de Documentos.
* B) Previsualización de asientos.
* C) Manager de Pick & Pack.
* D) Reprogramación Gráfica de Entregas.
> **Respuesta Correcta: C**. El *Pick & Pack Manager* agrupa múltiples líneas de pedidos y crea listas de recolección optimizadas por pasillos o rutas, permitiendo recoger masivamente y luego empacar y despachar rápidamente.

**Pregunta 5: Emitiste una Factura de Clientes Directa (sin documento previo) para una venta. Sin embargo, el jefe de almacén también intentó crear una "Entrega" manual para despachar esa misma mercancía. ¿Qué ocurriría a nivel contable y de stock?**
* A) Nada, el sistema bloquea automáticamente las entregas manuales.
* B) El stock bajará dos veces y el costo de ventas se duplicará.
* C) La entrega simplemente actualizará la factura de forma transparente.
* D) El cliente recibirá dos facturas automáticamente.
> **Respuesta Correcta: B**. Como la Factura Directa ya deduce el inventario y contabiliza el costo, crear una Entrega suelta manual por las mismas unidades generará un doble descuento de stock físico y duplicará el impacto en gastos.

---

## GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS)

```json
[
  {
    "scene": "01_el_circuito_o2c",
    "voicePrompt": "Voz profesional, didáctica, con energía, simulando un mentor corporativo.",
    "text": "Vender en SAP no es solo emitir una factura y cobrar. Es coordinar una coreografía perfecta: cuando confirmas un pedido de cliente, apartas ese stock inmediatamente para que nadie más lo toque. Cuando el almacén hace la entrega, se reconoce el costo de venta y baja el inventario. Y cuando contabilidad factura, se registra formalmente el ingreso fiscal. Cada pieza encaja y protege tus finanzas.",
    "durationEstimate": "22s"
  },
  {
    "scene": "02_la_trampa_del_disponible",
    "voicePrompt": "Voz de advertencia constructiva, tono serio pero orientador.",
    "text": "Nunca cometas el error de novato de mirar únicamente el stock físico en la estantería. Imagina que tienes diez laptops ahí guardadas, pero ocho ya están comprometidas para un cliente que retira mañana. Tu stock disponible real, el que puedes vender hoy, es de solo dos unidades. Si prometes vender cinco basándote en lo visual, provocarás un quiebre de stock, retrasos graves y dañarás la reputación de tu empresa.",
    "durationEstimate": "25s"
  },
  {
    "scene": "03_la_magia_del_pick_and_pack",
    "voicePrompt": "Tono moderno, tecnológico, rápido y eficiente.",
    "text": "Cuando tu empresa crece y procesas cientos de pedidos al día, el Responsable de Pick and Pack es tu mejor aliado operativo. En lugar de que tus operarios caminen por todo el almacén buscando de manera caótica un pedido a la vez, el sistema genera listas de picking inteligentes ordenadas por pasillos y zonas. Recogen cientos de artículos en un solo recorrido, empacan en lote y el software emite las entregas masivas en cuestión de segundos.",
    "durationEstimate": "28s"
  },
  {
    "scene": "04_el_abono_sin_stock",
    "voicePrompt": "Tono analítico, como si estuviera revelando un consejo clave o un 'secreto' del sistema.",
    "text": "¿Qué haces cuando un cliente te pide un descuento por un daño menor en el producto, pero decide quedarse con él? ¡Cuidado! Si haces una Nota de Crédito estándar, SAP pensará que el artículo regresó al almacén e inflarás tu inventario fantasma. La clave está en usar la opción de Abono marcando la casilla de 'Sin contabilización de cantidad'. Así devuelves el dinero, ajustas los impuestos, pero mantienes tu stock físico intacto. Pura precisión contable.",
    "durationEstimate": "27s"
  }
]
```
