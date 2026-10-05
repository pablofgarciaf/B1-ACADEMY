---
id: m03-c01-order-to-cash
status: borrador-piloto
module: ventas-order-to-cash
moduleNumber: 3            # provisional: se reasigna al reordenar los manuales
order: 1
title: "Del pedido al cobro: qué registra SAP en cada paso y cómo comprobarlo"
level: intermedio
durationMinutes: 40
sourceManuals:
  - 10_Sales_11_Process_Overview_ES
  - 10_Sales_12_Process_Order2Cash_ES
  - 10_ItemInv_41_Valuation_ValMethods_ES
simulatorArchetype: sales   # ver src/lib/manual-simulator-registry.ts
prerequisites:
  - m01-c01-arquitectura-y-cockpit
learningObjectives:
  - Explicar para qué existe cada documento del ciclo Order-to-Cash y qué dato aporta a la empresa.
  - Predecir el asiento contable y el movimiento de stock de cada documento antes de crearlo.
  - Verificar con informes que ventas, inventario y cuentas por cobrar cuadran entre sí.
  - Calcular margen bruto, markup y punto de equilibrio con datos que el propio sistema genera.
reportsUsed:
  - Previsualización de asiento (Journal Entry Preview)
  - Asiento de diario del documento (flecha naranja)
  - Informe de auditoría de inventario
  - Informe de antigüedad de saldos de clientes (Aging)
  - Informe de partidas abiertas
---

# Del pedido al cobro: qué registra SAP en cada paso y cómo comprobarlo

> **Respuesta directa.** El ciclo Order-to-Cash es una cadena de cinco documentos: Oferta, Pedido, Entrega, Factura y Cobro. Cada uno registra un hecho distinto de la venta y solo los tres últimos mueven contabilidad. El Pedido reserva stock. La Entrega reconoce el **costo de ventas**. La Factura reconoce el **ingreso, el IVA y la cuenta por cobrar**. El Cobro mueve el dinero al banco. Si entiendes qué dato aporta cada paso, puedes detectar en un informe cuándo algo no cuadra.

## 1. ¿Para qué existe este ciclo?

Una empresa vende dinero futuro: promete mercadería hoy y cobra después. El ciclo existe para responder cuatro preguntas de la gerencia sin llamar a nadie:

1. ¿Qué nos han prometido comprar los clientes? (Pedidos abiertos)
2. ¿Qué podemos prometer sin quedar mal? (Stock disponible)
3. ¿Cuánto ganamos realmente en cada venta? (Ingreso menos costo)
4. ¿Cuánto nos deben y desde cuándo? (Cuentas por cobrar)

Cada documento del ciclo responde una de ellas. Por eso el sistema te obliga a avanzar copiando el documento anterior con **Copiar a**: así los precios pactados, las cantidades y la trazabilidad no se retipean y quedan enlazados para auditoría.

## 2. Mapa del proceso

```
Oferta ──► Pedido ──► Entrega ──► Factura ──► Cobro
 (sin     (reserva   (sale del   (nace el    (entra al
 efecto)   stock)     almacén)    ingreso)    banco)
```

## 3. Qué dato aportas en cada paso y quién lo usa

| Documento | Dato que capturas | Quién lo consume | Decisión que alimenta |
|---|---|---|---|
| Oferta de ventas | Cliente, artículos, precio, descuento, validez | Comercial | Tasa de cierre, política de descuentos |
| Pedido de cliente | Cantidad confirmada, **fecha de entrega requerida** | Logística, MRP | Qué reservar, qué comprar o fabricar |
| Entrega | Cantidad que realmente salió, almacén de salida | Contabilidad de costos | Costo de ventas y valor del inventario |
| Factura de clientes | Precio final, IVA, condición de pago | Contabilidad y tributación | Ingresos, IVA por pagar, cuentas por cobrar |
| Cobro | Medio de pago, fecha, factura que salda | Tesorería | Flujo de caja, antigüedad de saldos |

Regla de oro: **un dato mal capturado en un paso aparece deformado en un informe dos pasos después.** Una cantidad errónea en la Entrega no se ve en la Factura, pero sí distorsiona el margen del mes.

## 4. Qué pasa en el stock y en la contabilidad

El stock no se mira solo por lo que hay en la estantería:

> **Disponible = En stock − Comprometido + Solicitado**

| Documento | Stock | Asiento contable |
|---|---|---|
| Oferta | Sin efecto | Ninguno |
| Pedido | Sube *Comprometido*; baja *Disponible*; *En stock* no cambia | Ninguno |
| Entrega | Baja *En stock* y libera *Comprometido* | **Debe:** Costo de ventas · **Haber:** Existencias |
| Factura (copiada de la Entrega) | Sin efecto | **Debe:** Clientes (cuenta asociada) · **Haber:** Ingresos · **Haber:** IVA ventas |
| Cobro | Sin efecto | **Debe:** Banco · **Haber:** Clientes (cuenta asociada) |

### Ejemplo numérico (se usa en toda la clase)

OEC Computers tiene **10 laptops** en el Almacén 01, valoradas por **precio medio variable**: 5 compradas a $600 y 5 a $700. Costo medio = (5×600 + 5×700) / 10 = **$650**. Valor del stock: **$6.500**.

Maxi-Teq (cliente C20000) pide **4 laptops a $900** cada una. IVA al 15 %.

| Paso | Debe | Haber | Importe |
|---|---|---|---|
| Pedido | — | — | 0 (solo *Comprometido* = 4) |
| Entrega | Costo de ventas | Existencias | 4 × 650 = **$2.600** |
| Factura | Clientes (asociada) | Ingresos por ventas | **$3.600** |
| Factura | (cont.) | IVA ventas | **$540** (15 % de 3.600) |
| Factura | Debe total clientes | | **$4.140** |
| Cobro | Banco | Clientes (asociada) | **$4.140** |

Resultado: quedan **6 laptops × $650 = $3.900** en existencias, la utilidad bruta es **$1.000** y el cliente ya no debe nada.

## 5. Aplicación guiada en el simulador

**Misión:** registrar la venta de 4 laptops a Maxi-Teq y comprobar cada asiento.

1. **Pedido.** Menú: *Ventas - Clientes > Pedido de cliente*. Cliente `C20000`, 4 unidades, fecha de entrega requerida (obligatoria).
   *Comprueba:* en datos maestros del artículo, pestaña de inventario, *Comprometido* subió en 4 y *Disponible* bajó en 4.
2. **Entrega.** Desde el Pedido: botón **Copiar a > Entrega**.
   Antes de pulsar *Crear*, usa **Previsualización de asiento**.
   *Comprueba:* Debe costo de ventas $2.600 / Haber existencias $2.600.
3. **Factura.** Desde la Entrega: **Copiar a > Factura de clientes**. Nunca crees una factura independiente si ya existe la Entrega: duplicarías la salida de stock y el costo.
   *Comprueba:* en la factura creada, clic derecho > *Asiento de diario*: Debe clientes $4.140, Haber ingresos $3.600, Haber IVA $540.
4. **Cobro.** Menú: *Gestión de bancos > Pagos recibidos*. Cliente `C20000`, marca la factura y elige el medio de pago.
   *Comprueba:* la factura queda cerrada y el saldo del cliente en cero.

## 6. Cómo verificar en los informes (lista de control)

Un experto no confía en que "el sistema lo hizo bien": lo cruza.

| Control | Cómo se hace | Debe coincidir con |
|---|---|---|
| Asiento antes de grabar | Previsualización de asiento | Tu cálculo manual de la tabla 4 |
| Asiento de cada documento | Flecha naranja del Nº de transacción | Cuentas y signos esperados |
| Inventario físico vs contable | Informe de auditoría de inventario | Saldo de la cuenta de existencias en el mayor |
| Auxiliar vs mayor | Saldos de clientes (Aging o ficha del cliente) | Saldo de la **cuenta asociada** de clientes |
| Entregas sin facturar | Informe de partidas abiertas, entregas | Ninguna al cierre de mes, o una justificación |
| Pedidos pendientes | Informe de partidas abiertas, pedidos | Compromisos reales con el cliente |

> **Por verificar en el cliente:** el Manual Maestro nombra estos informes pero no detalla la ruta exacta de menú de cada uno. Confirmar las rutas en el sistema (o en los manuales `10_ControlReports_22` y `10_ItemInv_41`) antes de publicarlas en la clase.

## 7. Aplicación gerencial: margen y punto de equilibrio

Con los datos de la venta ya puedes responder preguntas de dirección.

**Margen bruto y markup** (no son lo mismo):

- Utilidad bruta = ventas − costo = 3.600 − 2.600 = **$1.000**
- **Margen** sobre ventas = 1.000 / 3.600 = **27,8 %**
- **Markup** sobre costo = 1.000 / 2.600 = **38,5 %**

**Punto de equilibrio.** Es el nivel de ventas donde no hay ganancia ni pérdida:

> **PE (unidades) = Costos fijos ÷ margen de contribución por unidad**

Supón costos fijos del mes (arriendo, sueldos administrativos) de **$5.000**. El margen de contribución por laptop es 900 − 650 = **$250**.

- PE = 5.000 / 250 = **20 laptops**, o **$18.000** en ventas.
- Si vendes 28 laptops, tu **margen de seguridad** es (28 − 20) / 28 = **28,6 %**.

**Por qué esto depende de lo que capturas.** Si las próximas compras llegan a $700 y el método es FIFO, el costo de salida de las capas nuevas sube, el margen de contribución baja a $200 y el punto de equilibrio sube a **25 laptops**. El informe sale correcto, pero solo si los costos fijos y variables están bien separados en las cuentas y centros de costo. SAP no trae un informe de punto de equilibrio listo: se arma con datos que tú aportas.

## 8. Errores típicos y su huella en los informes

| Error | Qué causa | Dónde se ve |
|---|---|---|
| Factura independiente sobre un pedido ya entregado | Doble salida de stock y doble costo de ventas | Inventario inflado en negativo, margen falsamente bajo |
| Entregas hechas pero sin facturar a fin de mes | Costo reconocido sin ingreso | Margen del mes negativo o irreal; partidas abiertas altas |
| Devolución **y** nota de crédito manual por lo mismo | Stock fantasma | El informe de auditoría de inventario no concilia con el mayor |
| Mirar solo el stock físico al prometer | Promesas que no se pueden cumplir | Pedidos atrasados; reprogramaciones |
| Descuento posterior sin material devuelto | Se usa devolución en vez de abono | Inventario sube sin que haya regresado producto |

Regla: si la mercadería se entregó pero **no** se facturó, usa **Devolución de clientes**. Si ya se facturó, usa **Factura de abono de clientes**. Si es un descuento sin devolver nada, abono con la casilla **Sin contabilización de cantidad**.

## 9. Guion de locución (teleprompter)

Sigue el estándar del PLAN_MAESTRO: sin leer títulos ni números de diapositiva, frases con punto, ejemplos de negocio.

**Slide 1 — Propósito.**
"Vender no es solo emitir una factura. Es una cadena de compromisos. Cuando Maxi-Teq te pide cuatro laptops, tú prometes mercadería que todavía está en tu bodega. El ciclo Order-to-Cash existe para que esa promesa, la salida del producto, el ingreso y el cobro queden enlazados y puedas auditarlos."

**Slide 2 — Los cinco documentos.**
"La oferta no mueve nada. El pedido aparta stock, pero no toca la contabilidad. La entrega sí cambia los libros: en ese instante reconoces el costo de lo que salió. La factura reconoce el ingreso, el IVA y lo que el cliente te debe. Y el cobro lleva ese dinero al banco."

**Slide 3 — El disponible.**
"No mires solo la estantería. Tienes diez laptops, pero si seis están comprometidas con otros clientes, tu disponible real es de cuatro. Promete cinco y le fallas a alguien."

**Slide 4 — Misión en el simulador (pedido y entrega).**
"Ahora te toca. Crea el pedido para Maxi-Teq por cuatro unidades. Luego, con Copiar a, genera la entrega. Antes de grabar, abre la previsualización del asiento y confirma que el costo de ventas es de dos mil seiscientos dólares."

**Slide 5 — Misión (factura y cobro).**
"Copia la entrega a una factura. Nunca crees una factura nueva si ya hubo entrega, porque descontarías el stock dos veces. Revisa el asiento: cuatro mil ciento cuarenta al cliente, tres mil seiscientos a ingresos, quinientos cuarenta al IVA. Registra el cobro y comprueba que el saldo del cliente quedó en cero."

**Slide 6 — Verificación y gerencia.**
"Un experto no confía, comprueba. El saldo del auxiliar de clientes debe coincidir con la cuenta asociada del mayor, y el informe de auditoría de inventario con la cuenta de existencias. Y con esos mismos datos calculas tu margen, de veintisiete coma ocho por ciento, y tu punto de equilibrio, veinte laptops."

## 10. Quiz de comprensión (aprobación ≥ 90 %)

**P1.** ¿En qué documento se reconoce el costo de ventas con inventario permanente?
a) Oferta · b) Pedido · c) **Entrega** · d) Cobro
*Explicación:* la entrega documenta la salida física del producto: Debe costo de ventas, Haber existencias.

**P2.** Hay 10 laptops en stock, 6 comprometidas y 0 solicitadas. ¿Cuánto puedes prometer con seguridad?
a) 10 · b) 6 · c) **4** · d) 16
*Explicación:* Disponible = 10 − 6 + 0 = 4.

**P3.** Ya existe la entrega de un pedido. El vendedor crea una factura independiente. ¿Qué ocurre?
a) Nada, es equivalente · b) **Se duplican la salida de stock y el costo de ventas** · c) Se anula la entrega · d) Se cobra IVA doble
*Explicación:* la factura independiente descarga inventario por su cuenta; debe copiarse de la entrega.

**P4.** Con costos fijos de $5.000, precio $900 y costo $650, ¿cuál es el punto de equilibrio en unidades?
a) 10 · b) **20** · c) 25 · d) 5
*Explicación:* margen de contribución $250; 5.000 / 250 = 20.

**P5.** El cliente se queda con un equipo rayado y le descuentas $100 sin recibir nada de vuelta. ¿Qué documento usas?
a) Devolución de clientes · b) Entrega negativa · c) **Abono de clientes con "Sin contabilización de cantidad"** · d) Salida de mercancías
*Explicación:* ajusta cuenta por cobrar e ingreso sin mover unidades.

## 11. Defensa oral (rúbrica 0-25)

*Pendiente de redactar (pregunta de defensa oral y 3 criterios de evaluación).*

## 12. Fuentes y puntos por verificar antes de publicar

- Fuente de los flujos y asientos: Manual Maestro, módulo 03 (lecciones 3.1 a 3.4) y manuales `10_Sales_11`, `10_Sales_12`.
- Fuente de valoración: Manual Maestro, módulo 04, lección 4.1.
- **Verificar en el cliente SAP B1:** rutas exactas de los informes de la sección 6.
- **Verificar:** tarifa de IVA vigente (15 % usada como ejemplo) y nombres de las cuentas del plan NIIF de la empresa del alumno.
- **Pendiente de integración:** esta clase no está conectada a `/api/lesson-data` ni a `OFFICIAL_SYLLABUS`; es un archivo independiente para validar el formato.
