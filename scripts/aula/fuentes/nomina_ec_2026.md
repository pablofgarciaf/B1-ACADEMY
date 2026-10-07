# Fuente técnica: Nómina en Ecuador 2026 y su contabilización en SAP Business One

> Vigencia verificada: octubre de 2026. Las cifras salen de las normas vigentes y del motor del simulador de B1 Academy (mismos cálculos).
> Antes de regenerar esta clase, revisar el SBU y las tarifas vigentes.

## 1. Parámetros 2026
- Salario Básico Unificado (SBU) 2026: USD 482 (vigente desde el 1 de enero de 2026).
- Aporte personal al IESS (lo paga el trabajador, se descuenta del rol): 9,45 % de la remuneración sujeta a aporte.
- Aporte patronal (lo paga el empleador): 11,15 % al IESS más 0,5 % IECE y 0,5 % SECAP, es decir 12,15 % en total. En B1 Center se usa 12,15 %.
- Remuneración sujeta a aporte ("contributory" en el simulador) = sueldo del período + horas extras + comisiones + otros ingresos gravables.
- Décimo tercer sueldo (bono navideño): equivale a la doceava parte (1/12) de todo lo ganado en el año. Se paga hasta el 24 de diciembre; el trabajador puede pedir que se mensualice (se paga cada mes junto con el rol).
- Décimo cuarto sueldo (bono escolar): un SBU (USD 482) al año, proporcional a los días trabajados. Se paga hasta el 15 de marzo en la Costa y Galápagos y hasta el 15 de agosto en la Sierra y la Amazonía; también se puede mensualizar (SBU / 12 = 40,17 al mes).
- Fondos de reserva: 8,33 % (1/12) de la remuneración, desde el segundo año de servicio (cuando el trabajador cumple un año). Se pagan cada mes con el rol o se depositan en el IESS si el trabajador lo pide.
- Vacaciones: 15 días por año. La empresa provisiona cada mes: remuneración × 15 / 360.
- Horas extras: el valor de la hora es el sueldo / 240. Suplementarias (recargo del 50 %): hora × 1,5. Extraordinarias (sábados, domingos y feriados, recargo del 100 %): hora × 2. Máximo 4 horas por día y 12 por semana.
- Sueldo del período = sueldo mensual × días trabajados / 30.
- Impuesto a la renta en relación de dependencia 2026 (Resolución NAC-DGERCGC25-00000043): la fracción básica desgravada es USD 12.208 anuales; sobre el excedente se aplica una tabla progresiva del 5 % al 37 %. La base es el ingreso anual menos el aporte personal al IESS menos la rebaja de gastos personales. Un sueldo de USD 482 mensuales (5.784 al año) no llega a la fracción básica y no tiene retención. El simulador de B1 Academy NO calcula esta retención: se explica como concepto.
- Utilidades: 15 % de la utilidad líquida de la empresa (10 % para los trabajadores y 5 % por cargas familiares); se pagan hasta el 15 de abril del año siguiente. El simulador no las calcula.

## 2. Empleados de B1 Center (datos de prueba del curso)
| Código | Nombre | Cargo | Sueldo | Ingreso | Décimo 13 | Décimo 14 | Fondos de reserva |
|---|---|---|---|---|---|---|---|
| E001 | Juan Pérez | Gerente Comercial | 1.200,00 | 10/01/2022 | acumulado | acumulado | mensualizado |
| E002 | María Gómez | Contadora General | 900,00 | 01/03/2024 | acumulado | acumulado | mensualizado |
| E003 | Carlos López | Jefe de Bodega | 750,00 | 10/06/2023 | acumulado | acumulado | acumulado |
| E004 | Ana Silva | Asistente de Ventas | 482,00 | 15/01/2026 | mensualizado | mensualizado | aún no (menos de un año) |
"Acumulado" significa que la empresa lo provisiona cada mes y lo paga en la fecha legal; "mensualizado" significa que se paga cada mes con el rol.

## 3. Ejemplos calculados con el motor del simulador (período abril de 2026, SBU 482)

### Ejemplo A — María Gómez (E002): 30 días, 10 horas extras al 50 %, anticipo de 100,00, fondos de reserva mensualizados
- Sueldo del período: 900,00.
- Horas extras 50 %: 900 / 240 × 1,5 × 10 = 56,25.
- Remuneración sujeta a aporte: 956,25.
- Fondos de reserva (8,33 %, ya cumplió un año): 956,25 / 12 = 79,69 (se pagan en el rol).
- Ingreso total del rol: 956,25 + 79,69 = 1.035,94.
- Aporte personal IESS 9,45 %: 90,37. Anticipo: 100,00. Total descuentos: 190,37.
- Neto a pagar: 1.035,94 − 190,37 = 845,57.
- Aporte patronal 12,15 %: 116,18 (lo paga la empresa, no se descuenta a María).
- Provisiones de la empresa: décimo tercero 79,69 (956,25 / 12) + décimo cuarto 40,17 (482 / 12) + vacaciones 39,84 (956,25 × 15 / 360) = 159,70.

### Ejemplo B — Ana Silva (E004): 30 días, sin extras, décimos mensualizados, menos de un año de antigüedad
- Sueldo = remuneración sujeta a aporte: 482,00.
- Décimo tercero mensualizado: 482 / 12 = 40,17. Décimo cuarto mensualizado: 482 / 12 = 40,17.
- Fondos de reserva: 0,00 (aún no cumple un año; los generará desde el 15/01/2027).
- Ingreso total: 482,00 + 40,17 + 40,17 = 562,34.
- Aporte personal 9,45 %: 45,55 (se calcula solo sobre el sueldo de 482, no sobre los décimos). Neto: 562,34 − 45,55 = 516,79.
- Aporte patronal 12,15 %: 58,56. Provisión de vacaciones: 20,08.

### Ejemplo C — Carlos López (E003): 30 días, 8 horas extras al 100 %, décimos y reserva acumulados
- Sueldo 750,00. Horas extras 100 %: 750 / 240 × 2 × 8 = 50,00. Remuneración sujeta a aporte: 800,00.
- Aporte personal IESS 9,45 %: 75,60. Neto: 800,00 − 75,60 = 724,40 (no recibe décimos ni reserva en el rol porque se acumulan).
- Aporte patronal: 97,20. Provisiones: décimo tercero 66,67, décimo cuarto 40,17, fondos de reserva 66,67, vacaciones 33,33.

## 4. Asiento contable del rol de pagos (ejemplo A, solo María)
Cuentas del plan de B1 Center: 6.01 Gasto de nómina, 6.02 IESS patronal, 6.04 Beneficios sociales, 2.1.05 Sueldos por pagar, 2.1.04 IESS por pagar, 2.1.07 Beneficios sociales por pagar, 1.1.08 Anticipos al personal, 2.1.08 Otros descuentos por pagar.
- Debe: Gasto de nómina 1.035,94 · IESS patronal 116,18 · Beneficios sociales (provisiones) 159,70. Suma del debe: 1.311,82.
- Haber: Sueldos por pagar 845,57 · IESS por pagar 206,55 (aporte personal 90,37 + patronal 116,18) · Anticipos al personal 100,00 · Beneficios sociales por pagar 159,70. Suma del haber: 1.311,82.
- El anticipo se acredita en Anticipos al personal porque se había entregado antes (era un activo) y ahora se cancela contra el sueldo.
- Después se paga: transferencia de los sueldos netos desde el banco (debe Sueldos por pagar, haber Bancos) y pago de las planillas al IESS (debe IESS por pagar, haber Bancos).

## 5. SAP Business One y la nómina
- SAP Business One estándar NO calcula la nómina ecuatoriana. Guarda la ficha del empleado (Recursos humanos > Datos maestros de empleado) y las horas (Recursos humanos > Hoja de tiempos). El cálculo del rol se hace en un sistema de nómina externo, en una localización o en un complemento (add-on) del partner, y su resultado se contabiliza en SAP con un asiento (Finanzas > Asiento), igual al de la sección 4.
- En B1 Academy el simulador incluye el módulo "Rol de pagos" para practicar el cálculo y su contabilización; las clases usan esas pantallas.
- Los roles se hacen por período mensual y un mismo empleado no puede repetirse en el mismo rol.

## 6. Reglas de fidelidad para las clases de nómina (obligatorias)
- NO inventes ventanas de SAP llamadas "Rol de pagos", "Nómina" ni "Cálculo de décimos": no existen en SAP Business One estándar. Las prácticas de cálculo se titulan "Ejecutar rol de pagos…" y usan la ruta real "Finanzas > Asiento" (porque en SAP el resultado se contabiliza con un asiento); las prácticas de la ficha del empleado usan la ruta real "Recursos humanos > Datos maestros de empleado".
- Usa SIEMPRE los empleados E001 a E004 de B1 Center, con las cifras exactas de la sección 3 y el asiento de la sección 4. No inventes otros empleados ni otros montos.
- En una práctica, los campos que escribe el estudiante son datos reales del rol: empleado, días trabajados, horas extras 50 %, horas extras 100 %, anticipo. Cada valor debe ser el del ejemplo.
- Una lámina que NO sea de práctica nunca dice "en esta práctica", "practica" ni "ahora tú".
- No expliques utilidades ni impuesto a la renta con montos que el simulador no calcula salvo como concepto, y siempre aclarando que el simulador no los calcula.

## 7. Ejemplos y prácticas adicionales (usar exactamente estos datos)

### Ejemplo D — Juan Pérez (E001), junio de 2026: 30 días, comisión de 300,00, fondos de reserva mensualizados
- Sueldo 1.200,00 + comisión 300,00 = remuneración sujeta a aporte 1.500,00.
- Fondos de reserva (ya cumplió un año): 1.500 / 12 = 125,00 (se pagan en el rol). Ingreso total: 1.625,00.
- Aporte personal 9,45 %: 141,75. Neto: 1.625,00 − 141,75 = 1.483,25. Aporte patronal 12,15 %: 182,25.
- Provisiones: décimo tercero 125,00, décimo cuarto 40,17, vacaciones 62,50.

### Empleado nuevo para la práctica de la ficha del empleado
- Pedro Andrade, cédula 1704444445, cargo Asistente de Bodega, departamento Bodega, fecha de ingreso 01/05/2026, sueldo 600,00, contrato indefinido, jornada completa.

### Prácticas por clase (cada práctica usa una ventana real de la ruta indicada y datos exactos)
- Clase de la ficha del empleado: práctica "Crear al empleado Pedro Andrade" en "Recursos humanos > Datos maestros de empleado". Campos: nombre Pedro, apellido Andrade, cédula 1704444445, cargo Asistente de Bodega, sueldo 600.00, fecha de ingreso 01/05/2026.
- Clase del rol de pagos: práctica "Ejecutar el rol de pagos de abril de María Gómez" en "Finanzas > Asiento". Campos: período 2026-04, empleado María Gómez, días trabajados 30, horas extras al 50 % 10, anticipo 100.00.
- Clase de décimos, fondos de reserva y vacaciones: práctica "Ejecutar el rol de pagos de mayo de Ana Silva" (período 2026-05, empleado Ana Silva, días 30, sin extras: neto 516,79) y práctica "Ejecutar el rol de pagos de mayo de Carlos López" (período 2026-05, días 30, horas extras al 100 % 8: neto 724,40), ambas en "Finanzas > Asiento".
- Clase de contabilidad de la nómina: primero la práctica "Depositar el capital inicial en el banco" en "Gestión de bancos > Pagos recibidos > Pagos recibidos" (banco Banco Pichincha, depósito, monto 5000.00, contrapartida Capital social); luego "Pagar los sueldos netos por transferencia" en "Gestión de bancos > Pagos efectuados > Pagos efectuados" (monto 845.57, contrapartida Sueldos por pagar) y "Pagar la planilla del IESS" en la misma ruta (monto 206.55, contrapartida IESS por pagar).
- Clase de comisiones, impuesto a la renta y utilidades: práctica "Ejecutar el rol de pagos de junio de Juan Pérez con comisión" (período 2026-06, empleado Juan Pérez, días 30, comisión 300.00; neto 1.483,25) en "Finanzas > Asiento".

## 8. Uso de este ejemplo en la clase "Documentos Preliminares de Asiento" (mod17-c3)
- Si la clase trata de documentos preliminares, el documento preliminar de ejemplo es el asiento de nómina de la sección 4 (María Gómez, abril de 2026), con las cuentas del plan de B1 Center y SUS importes exactos: Debe Gasto de nómina 1.035,94, IESS patronal 116,18, Beneficios sociales 159,70; Haber Sueldos por pagar 845,57, IESS por pagar 206,55, Anticipos al personal 100,00, Beneficios sociales por pagar 159,70.
- Un documento preliminar es un borrador: no afecta la contabilidad hasta que se contabiliza, y puede guardarse desbalanceado mientras se arma. Aquí se arma línea por línea hasta que el debe (1.311,82) es igual al haber (1.311,82).
- NO uses cuentas numeradas 610000, 215000 ni 110000, ni porcentajes del 12 % para el aporte del empleado: no existen en este plan.

## 9. Asientos de nómina calculados por el motor (ÚNICAS cifras permitidas en las clases de nómina)
Regla de oro del asiento: el **ingreso total del rol** (incluye lo que se paga mensualizado: fondos de reserva y décimos mensualizados) va completo al Gasto de nómina; solo se PROVISIONAN (Beneficios sociales) los beneficios que quedan acumulados y las vacaciones. El aporte personal NO es gasto de la empresa: se descuenta del trabajador y se acredita en IESS por pagar junto con el aporte patronal. Por eso el neto a pagar = ingreso total − aporte personal − anticipos.

| Caso | Debe: Gasto de nómina | Debe: IESS patronal | Debe: Beneficios sociales (provisiones) | **Total debe** | Haber: Sueldos por pagar (neto) | Haber: IESS por pagar | Haber: Anticipos al personal | Haber: Beneficios sociales por pagar | **Total haber** |
|---|---|---|---|---|---|---|---|---|---|
| A María Gómez, abril | 1.035,94 | 116,18 | 159,70 | **1.311,82** | 845,57 | 206,55 | 100,00 | 159,70 | **1.311,82** |
| B Ana Silva, mayo | 562,34 | 58,56 | 20,08 | **640,98** | 516,79 | 104,11 | 0,00 | 20,08 | **640,98** |
| C Carlos López, mayo | 800,00 | 97,20 | 206,84 | **1.104,04** | 724,40 | 172,80 | 0,00 | 206,84 | **1.104,04** |
| D Juan Pérez con comisión, junio | 1.625,00 | 182,25 | 227,67 | **2.034,92** | 1.483,25 | 324,00 | 0,00 | 227,67 | **2.034,92** |
| P Pedro Andrade, mayo (nuevo) | 600,00 | 72,90 | 115,17 | **788,07** | 543,30 | 129,60 | 0,00 | 115,17 | **788,07** |

Detalle de las provisiones (Beneficios sociales):
- A María: décimo tercero 79,69 + décimo cuarto 40,17 + vacaciones 39,84 = 159,70.
- B Ana: solo vacaciones 20,08 (los décimos están mensualizados y ya van en el gasto de nómina; la reserva aún no aplica).
- C Carlos: décimo tercero 66,67 + décimo cuarto 40,17 + fondos de reserva 66,67 + vacaciones 33,33 = 206,84.
- D Juan: décimo tercero 125,00 + décimo cuarto 40,17 + vacaciones 62,50 = 227,67 (la reserva de 125,00 está mensualizada y va dentro del ingreso).
- P Pedro: décimo tercero 50,00 + décimo cuarto 40,17 + vacaciones 25,00 = 115,17 (sin fondos de reserva: menos de un año).

Aporte personal 9,45 % por caso: A 90,37 · B 45,55 · C 75,60 · D 141,75 · P 56,70.

**Costo total mensual para la empresa** (ingreso del rol + aporte patronal + provisiones = total debe): María 1.311,82 · Ana 640,98 · Carlos 1.104,04 · Juan (con comisión) 2.034,92 · Pedro 788,07.

**Efecto de una comisión (caso Juan, junio):** sin comisión: remuneración sujeta a aporte 1.200,00, fondos de reserva 100,00, ingreso 1.300,00, aporte personal 113,40, neto 1.186,60, aporte patronal 145,80. Con comisión de 300,00: remuneración 1.500,00, reserva 125,00, ingreso 1.625,00, aporte personal 141,75, neto 1.483,25, aporte patronal 182,25. La comisión sube el neto en 296,65.

**Pagos posteriores en el banco (caso A):** sueldos netos 845,57 (debe Sueldos por pagar, haber Bancos) y planilla del IESS 206,55 (debe IESS por pagar, haber Bancos). Cuenta de banco en el simulador: "Banco Pichincha · Cta. corriente" (BAN-1, número 2100000001).

## 10. Reglas de cifras (el validador las aplica)
- En las clases de nómina SOLO puedes escribir importes con decimales (xx,xx) que aparezcan en esta fuente. No inventes otros empleados, importes, totales ni tablas de costo; no sumes ni restes cifras nuevas.
- Un "total del asiento" es el "Total debe" de la tabla de la sección 9; no lo recalcules.
- No cites números de cuenta bancaria distintos de "Banco Pichincha · Cta. corriente (2100000001)".
