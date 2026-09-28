# MÓDULO 02: COMPRAS Y APROVISIONAMIENTO (PROCURE-TO-PAY) (SAP BUSINESS ONE 10.0 & ERP)

**Tipo de Contenido:** Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA  
**Fuentes Oficiales Analizadas:** 10_Purch_11_Process_Process_ES.pdf, 10_Purch_21_Issues_GRPO_ES.pdf, 10_Purch_22_Issues_ReturnsCM_ES.pdf, CSL02_Procurement_Process_ES.pdf y CSL02_Procurement_Process_Solution_ES.pdf  
**Nivel:** Intermedio / Especialista en Cadena de Suministro y Finanzas Operativas  
**Tiempo Estimado de Estudio:** 60 minutos (dividido en 4 lecciones integradas)

---

## Resumen Ejecutivo

El ciclo de **Procure-to-Pay (P2P)** en SAP Business One representa el núcleo integral del abastecimiento corporativo. Este módulo no se limita a explicar cómo registrar una compra, sino **por qué** cada paso es crucial para la integridad de los datos financieros y logísticos de la organización. A lo largo del módulo comprenderá la trazabilidad completa: desde la emisión de un pedido formal de compra, pasando por la recepción física y su impacto en el inventario, hasta la conciliación fiscal mediante la factura y el pago final al proveedor. Aprenderá también a gestionar contingencias reales, tales como entregas parciales, sustituciones, devoluciones y correcciones de precio, manteniendo siempre la pulcritud contable y operativa.

---

## ÍNDICE DEL MÓDULO

1. **Lección 2.1:** El Ciclo Estándar Procure-to-Pay (P2P) y Reglas Contables
2. **Lección 2.2:** Gestión de Entregas Parciales, Excesos y Sustitución de Artículos
3. **Lección 2.3:** Devoluciones, Abonos de Proveedor y Cancelación de Documentos
4. **Lección 2.4:** Caso Práctico Resuelto Oficial - Flujo Integral de Aprovisionamiento
5. **Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA**
6. **Banco de Evaluación Situacional**
7. **Guiones Humanizados para Locución IA (ElevenLabs)**

---

## LECCIÓN 2.1: EL CICLO ESTÁNDAR PROCURE-TO-PAY (P2P) Y REGLAS CONTABLES

### 1. Las 4 Etapas del Ciclo de Compras

El proceso de aprovisionamiento no es un simple intercambio de dinero por mercancía; es un flujo estructurado de control de materiales y financiero que asegura que los insumos correctos lleguen al costo pactado y en la fecha prevista:

* **[ 1. Pedido de Compra (PO) ]**
  * *Contexto:* Compromiso comercial con el proveedor.
  * *Impacto:* No afecta el inventario físico ni genera asientos contables. Aumenta la cantidad "En Pedido" en el maestro del artículo.
* **[ 2. Pedido de Entrada de Mercancías (GRPO) ]**
  * *Contexto:* Recepción física de la mercancía en el almacén.
  * *Impacto:* Sube el stock físico. Genera un asiento de provisión contable.
* **[ 3. Factura de Proveedores (A/P Invoice) ]**
  * *Contexto:* Recepción del documento fiscal.
  * *Impacto:* Liquida la provisión temporal y genera una Cuenta por Pagar real.
* **[ 4. Pago Efectuado (Outgoing Payment) ]**
  * *Contexto:* Gestión de Bancos para liquidar la deuda.
  * *Impacto:* Cierra la factura mediante Transferencia, Cheque, Efectivo o Tarjeta.

### 2. Datos Maestros Clave en el Circuito de Compras

Para que el ciclo P2P funcione sin fricciones, los datos maestros deben ser precisos:

**A. Interlocutor Comercial tipo Proveedor**
* **Identificación:** Código único (ej. `V10000`), razón social y datos fiscales (RUC / CIF / NIF).
* **Direcciones:** Dirección de factura (fiscal) y dirección de entrega/almacén.
* **Condiciones de Pago:** Días de crédito, lista de precios asignada, porcentaje de descuento comercial y límite de crédito.
* **Vínculo Financiero:** Cuenta asociada de mayor en la que se registrarán automáticamente las Cuentas por Pagar.

**B. Datos Maestros de Artículo (Ficha de Compras)**
* **Proveedor Habitual:** Proveedor por defecto asociado al artículo.
* **Número de Catálogo de Fabricante:** Permite buscar y pedir artículos utilizando la codificación nativa del proveedor.
* **Unidad de Medida (UdM) de Compra:** Factor de conversión. Por ejemplo, se compra en "Cajas de 24 unidades" pero se gestiona en el almacén como "Unidades individuales".

### 3. Impacto Financiero y Contable en Inventario Permanente

En un sistema con inventario permanente (*Perpetual Inventory*), cada movimiento de materiales registra inmediatamente su impacto en el balance. Comprender este impacto es esencial para auditorías y finanzas:

| Documento | Movimiento en Almacén | Asiento Contable en Libro Mayor |
| :--- | :--- | :--- |
| **1. Pedido de Compra** | Ninguno. Solo incrementa cantidad en "Pedido". | *Sin contabilización.* |
| **2. Entrada de Mercancías (GRPO)** | Incrementa stock físico disponible y valorado. | **DEBE:** Cuenta de Existencias/Inventario <br> **HABER:** Cuenta de Dotación (Puente) |
| **3. Factura de Proveedores** | Ninguno (si proviene de una Entrada de Mercancías). | **DEBE:** Cuenta de Dotación <br> **HABER:** Cuenta del Proveedor (CxP) |
| **4. Pago Efectuado** | Ninguno. | **DEBE:** Cuenta del Proveedor (CxP) <br> **HABER:** Banco/Caja/Tesorería |

> [!IMPORTANT]
> **Concepto Crítico: Cuenta de Dotación / Asignación (Allocation Account)**
> Es una cuenta puente de pasivo transitorio. Su saldo representa el valor monetario de todas las mercancías recibidas físicamente en almacén que *aún no han sido facturadas* por el proveedor. Al contabilizar la factura copiando la entrada, el saldo de esta cuenta vuelve a cero para esa operación.

### 4. Proceso de Aprovisionamiento Optimizado (Factura Directa sin Entrada Previa)

* **Caso de uso:** Compras urgentes, compras en plaza o mostrador, donde el proveedor entrega los artículos físicos junto con la factura fiscal al mismo tiempo.
* **Mecanismo:** Se crea directamente una **Factura de Proveedores** sin pedido ni entrada previa.
* **Impacto automático:**
  * *Inventario:* Incrementa el stock físico inmediatamente.
  * *Contabilidad:* **DEBE:** Cuenta de Existencias / **HABER:** Cuenta del Proveedor. Se omite el uso de la cuenta puente de compensación.

> [!WARNING]
> **Regla de Oro:** NUNCA crear una Factura de Proveedores independiente si ya se había registrado una Entrada de Mercancías (GRPO). Hacerlo duplicaría el inventario físico y dejaría abierta la provisión en la cuenta de dotación permanentemente.

---

## LECCIÓN 2.2: GESTIÓN DE ENTREGAS PARCIALES, EXCESOS Y SUSTITUCIÓN DE ARTÍCULOS

En la realidad operativa corporativa, las entregas rara vez coinciden exactamente con el pedido inicial. SAP Business One gestiona estas discrepancias manteniendo la integridad logística:

### 1. Entregas Parciales y Múltiples Recepciones

* **Procedimiento:** Al recibir una entrega parcial, abra la *Entrada de Mercancías*, pulse **Copiar de > Pedidos**, seleccione el pedido y ajuste la cantidad a la cifra real recibida.
* **Estatus del Pedido Base:** Permanece **Abierto** mientras existan cantidades pendientes.
* **Trazabilidad:** La columna *Cantidad Pendiente* en el pedido refleja con exactitud lo que el proveedor adeuda. Las filas completadas se atenúan (color gris); las incompletas permanecen editables.
* Un mismo pedido puede originar múltiples Entradas de Mercancías hasta agotar el saldo.

### 2. Entregas en Exceso (Cantidad Mayor a la Pedida)

* Si el proveedor envía más unidades (ej. 110 en lugar de 100) y la política de compras lo aprueba, modifique directamente la cantidad en la *Entrada de Mercancías* a 110.
* El sistema recibe las 110 unidades, las valoriza correctamente, y cierra el pedido base automáticamente.

### 3. Sustitución de Artículos

* **Escenario:** El proveedor informa una rotura de stock y envía un artículo sustituto equivalente o superior.
* **Procedimiento:**
  1. En la *Entrada de Mercancías* (copiada del pedido), elimine la línea del artículo original no entregado (*clic derecho > Borrar fila*).
  2. Añada manualmente una nueva línea con el código del artículo sustituto y la cantidad recibida.
  3. En el pedido de compra original, proceda a **Cerrar la línea** del artículo que ya no se recibirá, para evitar que el MRP lo considere como entrada futura esperada.

### 4. Cierre Manual de Pedidos vs. Cancelación

| Característica | Cerrar Pedido (Close) | Cancelar Pedido (Cancel) |
| :--- | :--- | :--- |
| **¿Cuándo se usa?** | Tras entregas parciales si el proveedor no enviará el resto, o al finalizar el ciclo. | Cuando hubo un error en la emisión o el proveedor rechazó la orden antes de entregar. |
| **Condición técnica** | Se aplica a pedidos que ya tienen al menos un documento destino copiado. | Solo se puede aplicar si el pedido **nunca** ha sido copiado a un documento destino. |
| **Impacto en Reportes**| Continúa apareciendo en el historial de compras para análisis. | El documento deja de figurar en informes de compromisos abiertos, quedando anulado. |
| **Reapertura** | No es posible revertir una vez cerrado. | No es posible revertir. |

---

## LECCIÓN 2.3: DEVOLUCIONES, ABONOS DE PROVEEDOR Y CANCELACIÓN DE DOCUMENTOS

Cuando las mercancías presentan defectos, sufren daños o existen errores de facturación, el sistema exige usar el documento correcto dependiendo de la fase del proceso P2P en que se detecte:

### 1. Devolución de Mercancías (Goods Return)

* **Momento de uso:** Mercancía ingresada a almacén, pero la Factura de Proveedores **aún no se ha contabilizado**.
* **Efecto en Inventario:** Retira físicamente las unidades defectuosas.
* **Efecto Contable:** Anula la provisión previa (**DEBE:** Cuenta de Asignación / **HABER:** Cuenta de Existencias).
* **Reapertura:** Según configuración, permite reabrir el pedido original para que el proveedor envíe reemplazos.

### 2. Abono de Proveedores (A/P Credit Memo)

* **Momento de uso:** La Factura de Proveedores **ya fue registrada**. (Ya no se puede usar *Devolución de Mercancías*).
* **Efecto:** Descuenta unidades físicas del almacén y reduce directamente el saldo deudor con el proveedor.
* **Asiento Contable:** **DEBE:** Cuenta del Proveedor / **HABER:** Cuenta de Existencias (y reversión de impuestos aplicables).

### 3. Abono "Sin Contabilización de Cantidad" (Corrección de Precios)

* **Escenario:** El proveedor olvidó aplicar un descuento en su factura. La mercancía física recibida es correcta, pero el valor a pagar está inflado.
* **Procedimiento:** En el *Abono de Proveedores*, marque la casilla **"Sin contabilización de cantidad"**.
* **Impacto:** Modifica el saldo contable y la deuda monetaria, **sin alterar las unidades físicas** del inventario.

### 4. Solicitud de Devolución de Mercancías (RMA)

* Documento previo de autorización logística que registra el número de autorización (RMA) del proveedor.
* **Impacto logístico:** Mueve las unidades a estatus "Comprometido", bloqueando su uso por ventas o producción mientras esperan ser devueltas.

### 5. Cancelación Nativa de Documentos

* Si una Entrada o Factura se ingresó con errores graves (ej. fecha incorrecta, proveedor equivocado), use *clic derecho > Cancelar*.
* El sistema crea un documento formal de cancelación de reversión, dejando un rastro de auditoría y reabriendo el documento base para procesarlo correctamente de nuevo.

---

## LECCIÓN 2.4: CASO PRÁCTICO RESUELTO OFICIAL - FLUJO INTEGRAL DE APROVISIONAMIENTO

**Caso de Estudio:** OEC Computers - Operaciones de Compras  
**Responsable:** James (Jefe de Compras) | **Proveedor:** V10000

### TAREA 1: Emisión del Pedido Formal de Compras
1. **Navegación:** `Compras - Proveedores > Pedido`.
2. **Proveedor:** Seleccionar `V10000`.
3. **Carga de Artículos:** `I00002` (50 un.), `I00004` (100 un.), `I00007` (25 un.), `I00008` (15 un.).
4. **Acción:** Pulsar *Crear*. Estatus: **Abierto** (Sin impacto contable).

### TAREA 2: Recepción de Entrega Parcial (1er Embarque)
1. **Navegación:** `Compras - Proveedores > Pedido de entrada de mercancías`.
2. **Copia Asistida:** Pulsar `Copiar de > Pedidos` y seleccionar el pedido de la Tarea 1.
3. **Ajustes:**
   * Modificar cantidad de `I00004` de 100 a 50.
   * Borrar la línea del `I00002` (no entregado).
   * Mantener cantidades de `I00007` y `I00008`.
4. **Impacto:** Stock físico aumenta. El Pedido original queda abierto con saldos pendientes para `I00004` e `I00002`.

### TAREA 3: Segunda Entrega con Sustitución
El proveedor envía el resto, pero cambia un artículo:
1. Crear nueva *Entrada de mercancías* y copiar del Pedido original.
2. Modificar cantidad de `I00004` a 30 (quedan 20 pendientes).
3. Añadir línea manual para artículo sustituto `I00003` (20 unidades). Registrar.

### TAREA 4: Contabilización de Factura y Cierre Manual
1. Llega la factura física agrupando las dos entregas anteriores.
2. **Navegación:** `Compras - Proveedores > Factura de proveedores`.
3. Copiar desde las dos Entradas de Mercancías previas (consolidación). Registrar.
4. El proveedor confirma que nunca enviará las 20 unidades pendientes de `I00004`. James abre el Pedido original, hace clic derecho sobre la línea del `I00004` y selecciona **Cerrar fila**.

---

## MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA

| Síntoma / Problema | Causa Raíz Frecuente | Instrucción de Asesoría del Copiloto |
| :--- | :--- | :--- |
| **La cuenta de dotación muestra un saldo acumulado enorme y anormal.** | Almacén hace entradas, pero Finanzas ingresa las facturas como "Facturas Independientes" sin basarse en las entradas. | Audite usando *Lista de partidas abiertas*. Identifique GRPO huérfanas. Capacite al usuario: toda factura cuyo stock pasó por almacén debe usar el botón "Copiar de". |
| **El sistema no permite crear una Devolución de Mercancías (botón gris).** | La entrada original ya fue arrastrada a una Factura de Proveedores. | El ciclo fiscal está cerrado para la entrada. Instruya al usuario a usar un **Abono de Proveedores** (Credit Memo) para reversar stock y deuda. |
| **Artículos no recibidos siguen inflando reportes de expectativas de MRP.** | Hubo entregas parciales y las líneas no surtidas quedaron abandonadas en el sistema. | Ingrese al Pedido de Compra original, haga clic derecho en la línea pendiente y seleccione **Cerrar fila** o cierre el documento completo. |

---

## BANCO DE EVALUACIÓN SITUACIONAL

Estas preguntas de evaluación están diseñadas para comprobar la comprensión del "por qué" detrás de las operaciones operativas.

**Pregunta 1: Finanzas y Logística (Impacto de GRPO)**
Su empresa maneja inventario permanente. Al recibir mercancía de un proveedor extranjero, se registra en SAP el Pedido de Entrada de Mercancías (GRPO), pero la factura fiscal demorará dos semanas en llegar por correo aduanal. ¿Cuál es el efecto contable inmediato de esta operación?
* A) No genera ningún asiento contable; solo impacta el inventario físico hasta que llegue la factura.
* B) Debita la cuenta de existencias y acredita directamente la cuenta por pagar del proveedor.
* C) Debita la cuenta de existencias y acredita la cuenta de dotación/compensación de compras no facturadas.
* D) Debita el costo de ventas y acredita la cuenta de existencias.
> **Respuesta Correcta: C**. *Explicación:* Al usar inventario permanente, SAP valora inmediatamente la entrada al almacén (Débito a Existencias) y, dado que la factura no existe aún, crea un pasivo temporal en la cuenta puente de dotación (Crédito), garantizando que el balance cuadre reflejando el material recibido pero aún no facturado.

**Pregunta 2: Corrección de Contingencias Monetarias**
Tras registrar una factura de proveedor por la compra de 1,000 unidades de un insumo, el departamento de contabilidad nota que el proveedor olvidó aplicar un descuento del 5% pactado por volumen. Las 1,000 unidades físicas ya están en estanterías. ¿Cuál es la ruta óptima para ajustar la cuenta por pagar sin afectar el conteo logístico?
* A) Crear una Devolución de Mercancías por el valor del 5%.
* B) Cancelar la factura original y rehacer todo el flujo de compras.
* C) Emitir un Abono de Proveedor seleccionando la casilla "Sin contabilización de cantidad".
* D) Ajustar manualmente el saldo del socio de negocios mediante un asiento de diario directo.
> **Respuesta Correcta: C**. *Explicación:* La casilla "Sin contabilización de cantidad" en el Abono de Proveedores está diseñada precisamente para contingencias donde el inventario físico está correcto, pero el valor financiero o fiscal necesita un ajuste (como descuentos omitidos o errores de precio al alza).

**Pregunta 3: Gestión de Entregas Parciales y MRP**
Emitió un pedido por 50 portátiles. El proveedor entregó 40 y usted registró la Entrada de Mercancías basándose en el pedido. Hoy, el proveedor notifica oficialmente que los 10 portátiles restantes están descontinuados y no los enviará. ¿Qué acción obligatoria debe tomar en SAP para sanear el proceso?
* A) Cancelar el pedido de compra original.
* B) Abrir el pedido de compra original y cerrar la fila de los portátiles manualmente.
* C) Crear una Devolución de Mercancías por los 10 portátiles no recibidos.
* D) Ignorarlo; SAP Business One detectará la falta de movimiento y lo cerrará a fin de mes.
> **Respuesta Correcta: B**. *Explicación:* Un pedido parcialmente surtido no se puede cancelar. Si no cierra la fila o el pedido, el sistema MRP y los reportes de almacén continuarán asumiendo que esas 10 unidades llegarán en el futuro, distorsionando la planificación de reabastecimiento.

**Pregunta 4: Documentos Correctivos (Devolución vs. Abono)**
Se reciben 20 motores en almacén mediante una Entrada de Mercancías. Al día siguiente, Calidad rechaza 3 por estar oxidados. Aún no se ha registrado la factura en el sistema. ¿Qué documento debe usar para regresar estos 3 motores al proveedor?
* A) Abono de Proveedores.
* B) Devolución de Mercancías.
* C) Solicitud de Devolución de Mercancías.
* D) Salida de Mercancías (Módulo de Inventario).
> **Respuesta Correcta: B**. *Explicación:* Dado que la factura fiscal *aún no se ha contabilizado*, la operación logística base sigue siendo la Entrada (GRPO). Su reverso natural y directo es la Devolución de Mercancías, la cual limpia la cuenta de dotación y el almacén.

**Pregunta 5: Riesgos de Facturación Directa**
Un usuario de Cuentas por Pagar tiene sobre su escritorio una factura por insumos de limpieza. El personal de almacén le confirma que los insumos ya llegaron e hicieron una "Entrada de mercancías" en SAP ayer. El usuario decide capturar la factura ingresando a *Factura de Proveedores*, digitando al proveedor y añadiendo los artículos manualmente en las filas. ¿Qué consecuencia grave tendrá esto?
* A) El inventario físico se duplicará en el almacén y la cuenta puente de dotación quedará con saldo pendiente de cierre permanente.
* B) SAP bloqueará la transacción arrojando un error de duplicidad de código.
* C) Se registrará el doble de impuestos, pero el inventario permanecerá correcto.
* D) Ninguna; SAP conciliará automáticamente ambos documentos basándose en la fecha y el proveedor.
> **Respuesta Correcta: A**. *Explicación:* Al no utilizar la función "Copiar de", se rompe el hilo conductor. La entrada original subió el stock y provisionó la deuda. Al hacer una factura suelta de tipo artículo, esta vuelve a subir el stock (duplicándolo) y crea la cuenta por pagar sin matar la provisión original de la cuenta de dotación, descuadrando la contabilidad.

---

## GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS)

```json
[
  {
    "scene": "01_el_ciclo_p2p",
    "voicePrompt": "Voz ejecutiva y autoritaria, ritmo pausado al inicio y enfático en las conclusiones.",
    "text": "Comprar en una empresa no es simplemente pagar facturas al azar. Es un circuito cerrado y riguroso de control. Primero, pedimos exactamente lo que necesitamos; segundo, verificamos físicamente en almacén que lo que llega es lo correcto; tercero, conciliamos que la factura coincida al centavo con la recepción logística; y solo después, liberamos el pago. Si te saltas uno de estos pasos y documentas al vuelo, abres la puerta a mermas, pagos duplicados y graves discrepancias fiscales. SAP te blinda contra esto, si sigues el flujo correcto.",
    "durationEstimate": "28s"
  },
  {
    "scene": "02_entregas_parciales",
    "voicePrompt": "Voz práctica, resolutiva, como un supervisor de almacén experimentado.",
    "text": "¿Qué pasa si pediste cien monitores, pero el proveedor solo te entregó cincuenta porque no cabían en el camión? Por favor, jamás canceles el pedido original ni crees uno nuevo. Simplemente ve a la Entrada de mercancías, utiliza el botón 'Copiar de' desde el pedido y cambia la cantidad a cincuenta. El sistema, de manera inteligente, registrará el ingreso exacto en almacén y mantendrá tu pedido abierto por los cincuenta restantes. Así mantienes un control total sobre las deudas del proveedor.",
    "durationEstimate": "25s"
  },
  {
    "scene": "03_la_cuenta_dotacion",
    "voicePrompt": "Voz didáctica y financiera, explicando un concepto abstracto de manera visual y clara.",
    "text": "Presta mucha atención a este concepto vital: la cuenta de dotación o compensación. Imagina que es una balanza puente temporal. Cuando la mercancía entra a la bodega, tu inventario sube, pero como la factura del proveedor aún no llega por correo, no puedes generar la deuda oficial. Para mantener equilibrada la contabilidad, SAP deposita ese valor temporalmente en la cuenta de dotación. Días después, cuando finalmente registras la factura basándote en la entrada original, esa cuenta puente se vacía, quedando en cero, y la deuda se transfiere formalmente y con todos sus impuestos a la cuenta por pagar real.",
    "durationEstimate": "35s"
  },
  {
    "scene": "04_ajustes_sin_cantidad",
    "voicePrompt": "Voz analítica y correctiva, como un auditor enseñando un truco avanzado.",
    "text": "A veces la logística está perfecta, pero los números fallan. Digamos que el proveedor te entregó mil cajas, ya las tienes en la estantería, pero al revisar la factura te das cuenta de que olvidaron aplicarte un descuento pactado del diez por ciento. No puedes devolver las cajas porque las necesitas. Para ajustar la deuda de forma limpia en SAP, utiliza un 'Abono de Proveedor' y marca la casilla que dice 'Sin contabilización de cantidad'. Esto ajustará directamente la deuda en dinero a tu favor, sin mover ni una sola caja de tu inventario físico. Elegante y preciso.",
    "durationEstimate": "30s"
  }
]
```
