# Fuente técnica: ICE, ISD, RIMPE, retenciones recibidas y cierre tributario — Ecuador 2026

> Vigencia verificada: octubre de 2026. Las cifras de los ejemplos salen del motor del simulador de B1 Academy.
> Lo marcado ⚠ proviene de fuentes secundarias y debe confirmarlo un contador (ver docs/16).

## 1. ICE — Impuesto a los Consumos Especiales
- Grava la venta de ciertos bienes y servicios (cigarrillos, alcohol, cerveza, vehículos, perfumes, videojuegos, televisión pagada…). Lo paga el consumidor final dentro del precio, lo cobra el fabricante, importador o prestador y lo declara mensualmente en el formulario 105.
- Tarifas 2026 (resoluciones NAC-DGERCGC25-00000040, 00000041, 00000042 y 00000043, de diciembre de 2025): perfumes y aguas de tocador 20 % ad valorem; videojuegos 35 % ad valorem; cigarrillos USD 0,16 por unidad (cigarrillo); televisión pagada 15 %; vehículos del 5 % al 35 % según el precio; alcohol y cerveza llevan tarifa específica por litro de alcohol puro (bebidas alcohólicas USD 10,41; cerveza artesanal USD 1,56; cerveza industrial USD 13,62).
- Excepción 2026: el ICE de la cerveza se eliminó temporalmente del 12 de junio al 19 de julio de 2026 (Copa Mundial de la FIFA).
- El IVA se calcula sobre la base imponible MÁS el ICE.
- El ICE de una venta es un pasivo con el SRI: se acredita en la cuenta 2.1.11 ICE por pagar. El ICE de una compra se suma al costo del inventario (no es crédito tributario).
- En el XML del comprobante electrónico el ICE es un impuesto propio (código 3) con el código del producto.
- En el simulador cada artículo tiene el campo ICE (catálogo: perfumes 20 %, videojuegos 35 %, cigarrillos USD 0,16 por unidad). El ICE lo fija el artículo, no quien digita el documento. ⚠ El simulador calcula el ICE ad valorem sobre el precio facturado; la base legal es el precio de venta al público sugerido o el ex fábrica más 25 % de margen.

### Ejemplo ICE (artículo nuevo: «Perfume Eau 100ml», código A00013, ICE perfumes 20 %, precio de lista 100,00)
- Compra de 5 perfumes a USD 50,00 al proveedor V10000: base 250,00 + ICE 20 % (50,00) + IVA 15 % sobre 300,00 (45,00) = total 345,00. Asiento: Debe Inventarios 300,00 (250,00 + 50,00 de ICE capitalizado) · Debe IVA en compras 45,00 · Haber Cuentas por pagar proveedores 345,00. Cada perfume queda con un costo de 60,00.
- Venta de 2 perfumes a USD 100,00 al cliente C20000: base 200,00 + ICE 20 % (40,00) + IVA 15 % sobre 240,00 (36,00) = total 276,00. Asiento: Debe Costo de ventas 120,00 · Haber Inventarios 120,00 · Debe Cuentas por cobrar clientes 276,00 · Haber Ventas operacionales 200,00 · Haber IVA en ventas 36,00 · Haber ICE por pagar 40,00.
- Cigarrillos: 100 cigarrillos vendidos a USD 0,50 = base 50,00; ICE 100 × 0,16 = 16,00; IVA 15 % sobre 66,00 = 9,90; total 75,90.

## 2. ISD — Impuesto a la Salida de Divisas
- Se paga sobre el valor que sale del país (transferencias, pagos a proveedores del exterior). Tarifa general 5 %.
- 2026: el Decreto Ejecutivo fija tarifas diferenciadas para beneficiarios: 0 % para el sector farmacéutico y 2,5 % para otros sectores productivos (los beneficiarios los define el Ministerio de Producción con el SRI mediante acuerdo ministerial). ⚠ El simulador no verifica quién es beneficiario: el estudiante elige la tarifa.
- Exoneración para consumos y retiros con tarjeta de crédito o débito desde el exterior: USD 5.188,26 al año, vigente 2025, 2026 y 2027 (concepto; el simulador no la aplica).
- Cuando la empresa hace una transferencia al exterior, el banco cobra el ISD y lo declara; la empresa solo lo contabiliza.
- Contabilización: si el pago es por importación de materias primas, insumos o bienes de capital, el ISD puede usarse como crédito tributario para el impuesto a la renta (cuenta 1.1.12 ISD pagado); en cualquier otro pago es gasto (cuenta 6.08 ISD).
- Siempre sale del banco el pago MÁS el ISD.

### Ejemplos ISD
- Pago de 1.000,00 por una licencia de software, tarifa general 5 %: ISD 50,00; salen del banco 1.050,00. Asiento: Debe Gastos administrativos 1.000,00 · Debe ISD 50,00 · Haber Bancos 1.050,00.
- Importación pagada a un proveedor del exterior por 800,00 con tarifa reducida 2,5 %: ISD 20,00 como crédito tributario; salen del banco 820,00; baja la deuda con el proveedor en 800,00.
- Para pagar necesitas fondos: los bancos de B1 Center empiezan en cero, así que primero se deposita capital (por ejemplo 5.000,00 en Banco Pichincha con contrapartida 3.01 Capital social).

## 3. Retenciones que te hacen tus clientes (crédito tributario)
- Si el cliente es agente de retención, al pagarte te entrega un comprobante de retención y te paga solo la diferencia. Esas retenciones son un crédito a tu favor: la de renta se descuenta del impuesto a la renta anual (cuenta 1.1.10) y la de IVA se descuenta en el formulario 104 (cuenta 1.1.11).
- Ejemplo: factura de venta de 1.150,00 (base 1.000,00 + IVA 150,00). El cliente retiene renta 20,00 (2 % de 1.000,00) e IVA 45,00 (30 % de 150,00) y paga 1.085,00. Asiento del cobro: Debe Bancos 1.085,00 · Debe Crédito tributario retenciones de renta 20,00 · Debe Crédito tributario retenciones de IVA 45,00 · Haber Cuentas por cobrar clientes 1.150,00. La factura queda cobrada por completo y el cliente en cero.

## 4. RIMPE en el simulador
- La ficha del proveedor tiene el campo «Régimen del proveedor» (régimen general, RIMPE Emprendedor, RIMPE Negocio Popular). En SAP Business One estándar ese dato se guarda en un campo definido por el usuario; en B1 Academy es un campo propio.
- Negocio Popular: entrega nota de venta RIMPE, NO cobra IVA y no se le retiene renta ni IVA (código 332, 0 %). Si el comprador quiere el crédito del IVA, emite una liquidación de compra y retiene el 100 % del IVA. El simulador rechaza una compra con IVA a un Negocio Popular.
- Emprendedor: factura (con IVA) y se le retiene el 1 % de renta (código 343). El simulador rechaza otro porcentaje.
- La propia empresa también tiene régimen (Detalles de la sociedad): un Negocio Popular no cobra IVA ni emite factura electrónica (entrega nota de venta); un Emprendedor factura con la leyenda «CONTRIBUYENTE RÉGIMEN RIMPE» en el comprobante.
- Ejemplo (compra a un Emprendedor, proveedor «Taller Andino»): 16 teclados a USD 25,00 = base 400,00 + IVA 15 % (60,00) = total 460,00. Retención de renta 1 % de 400,00 = 4,00 (código 343) y retención de IVA 30 % de 60,00 = 18,00: total retenido 22,00; se paga al proveedor 438,00. Asiento de la retención: Debe Cuentas por pagar proveedores 22,00 · Haber Retenciones por pagar 22,00.

## 5. Cierre tributario del ejercicio (orden obligatorio)
1. **Utilidades de los trabajadores.** 15 % de la utilidad líquida: 10 % se reparte entre todos en proporción a los días trabajados y 5 % según las cargas familiares (si nadie tiene cargas, se reparte también por días). Tope por trabajador: 24 SBU (24 × 482 = 11.568,00); el excedente va al IESS. Se pagan hasta el 15 de abril. Asiento: Debe Participación de trabajadores en utilidades · Haber Utilidades por pagar (y IESS por pagar si hay excedente).
2. **Impuesto a la renta de la empresa (régimen general).** Base = utilidad − participación de los trabajadores; impuesto = base × 25 %. Se restan el anticipo pagado y las retenciones de renta recibidas; el saldo es el impuesto a pagar. ⚠ El simulador no hace conciliación tributaria (gastos no deducibles, ingresos exentos). Los RIMPE no usan esta tarifa.
3. **Anticipo del año siguiente.** Anticipo voluntario = 50 % del impuesto causado − retenciones de renta del ejercicio, pagado en dos cuotas iguales (julio y septiembre). Se paga en Bancos con la contrapartida 1.1.09 Anticipo de impuesto a la renta y es crédito para el impuesto del año siguiente. ⚠ Confirmar con el contador si a la empresa le corresponde el anticipo mínimo obligatorio.

### Ejemplo de cierre (utilidad líquida 10.000,00; ejercicio 2026)
- Participación 15 %: 1.500,00 (10 % = 1.000,00 por días trabajados; 5 % = 500,00 repartido por días porque ningún empleado de B1 Center tiene cargas familiares). El reparto por empleado lo muestra la pantalla; no lo calcules a mano. Asiento: Debe Participación de trabajadores 1.500,00 · Haber Utilidades por pagar 1.500,00.
- Base del impuesto a la renta: 10.000,00 − 1.500,00 = 8.500,00. Impuesto 25 % = 2.125,00.
- Sin anticipos ni retenciones recibidas: impuesto a pagar 2.125,00. Asiento: Debe Impuesto a la renta 2.125,00 · Haber Impuesto a la renta por pagar 2.125,00. Anticipo del año siguiente: 50 % × 2.125,00 = 1.062,50, en cuotas de 531,25.
- Con 20,00 de retenciones de renta recibidas (ejemplo de la sección 3): impuesto a pagar 2.105,00; anticipo 1.042,50 en cuotas de 521,25.

## 6. Reglas de fidelidad para estas clases (obligatorias)
- SAP Business One estándar NO calcula ISD, utilidades ni impuesto a la renta del ejercicio: se hacen con el módulo de localización o con asientos. Las prácticas de cierre usan la ruta real «Finanzas > Asiento» y se titulan «Calcular las utilidades…», «Cerrar el impuesto a la renta…» o «Calcular el anticipo…»; las de ISD usan «Gestión de bancos > Pagos efectuados > Pagos efectuados» y se titulan «Registrar un pago al exterior…»; las de ICE usan «Inventario > Datos maestros de artículo» (crear el artículo), «Compras - Proveedores > Factura de Proveedores» y «Ventas - Clientes > Factura de clientes».
- Usa EXCLUSIVAMENTE los importes con decimales que aparecen en esta fuente. No inventes otros productos, importes, tarifas ni totales.
- Una lámina que NO sea de práctica nunca dice «en esta práctica», «practica» ni «ahora tú».
- Los asientos deben cuadrar y usar los nombres de cuenta de este plan: Inventarios materia prima / mercaderías, IVA en compras, Cuentas por pagar proveedores, Cuentas por cobrar clientes, Ventas operacionales, IVA en ventas, ICE por pagar, Costo de ventas, Gastos administrativos, ISD, Bancos, Participación de trabajadores en utilidades, Utilidades por pagar a trabajadores, Impuesto a la renta, Impuesto a la renta por pagar, Retenciones por pagar, Anticipo de impuesto a la renta, Crédito tributario retenciones de renta recibidas, Crédito tributario retenciones de IVA recibidas.

### Ejemplo B de RIMPE Emprendedor (usado en la clase de RUC, firma y RIMPE)
- 10 teclados a USD 25,00 = base 250,00 + IVA 15 % (37,50) = total 287,50. Retención de renta 1 % = 2,50 y retención de IVA 30 % = 11,25; se paga al proveedor 273,75.
- Compra a un Negocio Popular: 5 mouses a USD 10,00 = 50,00, sin IVA y sin retención; se paga 50,00.
