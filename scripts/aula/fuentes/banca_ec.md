# Fuente técnica: Banca para empresas en Ecuador y conciliación en SAP Business One

## Cómo se conecta una pyme ecuatoriana con su banco
- Las pymes ecuatorianas NO se conectan al banco por una API pública. Trabajan con su banca en línea para empresas: descargan el extracto de la cuenta (archivo CSV, TXT o Excel) y suben archivos de pagos con el formato propio de cada banco (pagos a proveedores, nómina).
- Cada banco (Banco Pichincha, Banco del Pacífico, Banco Guayaquil, Produbanco) entrega su especificación de archivos a sus clientes empresariales; el formato difiere entre bancos (separador de columnas, formato de fecha, una columna de monto con signo o columnas débito y crédito separadas).
- Las integraciones directas por API existen solo para clientes corporativos grandes bajo contrato.
- En B1 Academy el flujo se practica con formatos SIMULADOS para formación; no son los formatos oficiales de ningún banco.

## Flujo mensual de conciliación (extracto → SAP)
1. Descargar el extracto del mes desde la banca en línea.
2. Importarlo en SAP Business One (Gestión de bancos > Extractos de cuenta y reconciliaciones externas) para que el sistema empareje cada línea del banco con los pagos y cobros ya registrados por monto, referencia y fecha cercana.
3. Revisar lo que NO tiene pareja: son movimientos que el banco hizo y la empresa aún no registró. Los más comunes: comisión de mantenimiento de cuenta, interés ganado, transferencias recibidas sin aviso, débitos no autorizados.
4. Registrar cada diferencia con su asiento: la comisión es un gasto financiero (debe) contra Bancos (haber); el interés ganado es un ingreso financiero (haber) contra Bancos (debe).
5. Cuando el saldo del extracto coincide con el saldo contable de Bancos, la conciliación está cerrada.

## Pagos a proveedores con archivo de pagos
- Se seleccionan las facturas de proveedor abiertas, el sistema calcula lo que realmente se debe pagar (la factura menos las retenciones de renta e IVA ya autorizadas y menos pagos anteriores) y genera el archivo para subir a la banca empresas, que ejecuta las transferencias.
- En SAP Business One este proceso se hace con el Asistente de pagos (Payment Wizard).
- Ejemplo: factura de proveedor de 1.150 dólares (base 1.000 + IVA 150) con retención de renta 2 % (20 dólares) e IVA 30 % (45 dólares): el archivo de pagos incluye 1.085 dólares.
