# Paquete de revisión: consultor SAP y contador

> Para qué sirve: que alguien con SAP Business One y un contador confirmen en pocas horas lo que el equipo NO puede garantizar solo.
> Cómo se genera la parte de datos: `py scripts/aula/exportar_revision.py` (sin tokens) crea los CSV de `docs/revision/`.
> Cada CSV tiene columnas en blanco para que el revisor escriba "OK" o una observación.

## 1. Qué se pide a cada revisor

| Revisor | Qué confirma | Archivo | Tiempo estimado |
|---|---|---|---|
| **Consultor SAP B1** | Que cada ruta de menú existe en su versión y que los nombres de campos son los reales | `docs/revision/rutas_unicas.csv` (rutas) y `practicas_sap.csv` (campos) | 2–3 h |
| **Contador** | Códigos y porcentajes de retención, fórmulas de formularios, asientos y nómina | Secciones 3, 4 y 5 de este documento + `asientos_y_cifras.csv` | 2–3 h |

## 2. Lo que el sistema ya verifica por sí mismo (no hace falta revisarlo a mano)
- **Aritmética y balance:** cada asiento publicado se comprueba (debe = haber) en las tres estructuras donde se guarda. Resultado actual: 0 descuadrados.
- **Tarifas:** IVA solo 0 %, 5 %, 8 %, 15 %; retención de renta solo 0, 1, 1,75, 2, 3, 5, 10 %; retención de IVA solo 10, 20, 30, 70, 100 %.
- **Naturaleza del IVA:** en una compra es crédito tributario (debe), en una venta es IVA cobrado (haber).
- **Nómina:** aporte personal 9,45 %, patronal 11,15 % (12,15 % con IECE y SECAP), fondos de reserva 8,33 %, SBU 482.
- **Motor del simulador:** 44 pruebas automáticas (`npm run test:motor`) cubren retenciones, autorización SRI simulada, banca y nómina.

## 3. Para el contador — tabla de retenciones del simulador (`src/lib/sri-catalogo.ts`)

**Porcentajes:** Resolución NAC-DGERCGC26-00000009 (renta, desde el 1-mar-2026) y NAC-DGERCGC20-00000061 (IVA).
**Códigos:** tomados de fuentes secundarias que NO siempre coinciden entre sí; los marcados ⚠ necesitan confirmación contra la ficha técnica del ATS vigente.

| Código | Concepto | % | Estado |
|---|---|---|---|
| 303 | Honorarios de personas naturales (título profesional) | 10 | confirmado en 3 fuentes |
| 303A | Servicios profesionales de sociedades residentes | 5 | ⚠ 2 fuentes; una tercera lo daba como 308 |
| 304 | Servicios donde predomina el intelecto (sin título) | 10 | confirmado en 2 fuentes |
| 307 | Servicios donde predomina la mano de obra | 3 | confirmado en 2 fuentes (antes estaba mal como 304) |
| 308 | Uso de imagen o renombre | 10 | confirmado en 2 fuentes |
| 309 | Publicidad y medios de comunicación | 3 | confirmado |
| 310 | Transporte privado de pasajeros o carga | 1 | confirmado |
| 312 | Transferencia de bienes muebles | 2 | confirmado |
| 312A | Productos agrícolas al productor (1 %) / a distribuidor (1,75 %) | 1 / 1,75 | ⚠ el código del 1,75 % no se pudo verificar |
| 319 | Arrendamiento mercantil (leasing) | 2 | confirmado |
| 320 | Arrendamiento de inmuebles | 10 | confirmado |
| 322 | Seguros y reaseguros | 2 | confirmado |
| 332 | Compras no sujetas a retención (p. ej. Negocio Popular) | 0 | ⚠ el alcance exacto del 332 |
| 343 | Compras a RIMPE Emprendedor / otras retenciones 1 % | 1 | confirmado en 2 fuentes |
| 3440 | Otras retenciones sin porcentaje específico | 3 | ⚠ |
| IVA 1 / 2 / 3 | Bienes 30 % / servicios 70 % / honorarios y liquidación de compra 100 % | — | confirmado |
| IVA 9 / 10 | Contribuyente especial: bienes 10 % / servicios 20 % | — | confirmado |

**Preguntas concretas al contador**
1. ¿Los códigos ⚠ coinciden con la ficha técnica del ATS que usa hoy?
2. ¿Compras a un Negocio Popular: se codifica 332 con 0 %?
3. ¿La liquidación de compra a un Negocio Popular con retención del 100 % del IVA está bien explicada en `mod19-c6` y `mod19-c7`?
4. ¿Las fechas "noveno dígito del RUC → día 10, 12, … 28" y la regla "desde el 1-jun-2026 declarar sin pagar no cumple" son correctas para el IVA mensual?
5. ¿El cálculo "IVA a pagar = IVA cobrado − crédito tributario − retenciones que le practicaron" del Formulario 104 es el que usaría (la clase `mod19-c5` lo explica así)?

## 4. Para el contador — nómina 2026 (`scripts/aula/fuentes/nomina_ec_2026.md`)

| Parámetro | Valor usado | Confirmar |
|---|---|---|
| SBU 2026 | USD 482 | confirmado en 5 fuentes |
| Aporte personal IESS | 9,45 % | confirmado |
| Aporte patronal | 11,15 % + IECE 0,5 % + SECAP 0,5 % = 12,15 % | ⚠ confirmar el 1 % de IECE/SECAP |
| Décimo tercero | 1/12 de lo ganado; pago hasta el 24-dic | confirmar fecha |
| Décimo cuarto | 1 SBU; hasta 15-mar (Costa, Galápagos) / 15-ago (Sierra, Amazonía) | confirmado en 2 fuentes |
| Fondos de reserva | 8,33 % desde el 2.º año | confirmado |
| Vacaciones | provisión remuneración × 15 / 360 | confirmar criterio |
| Horas extras | hora = sueldo / 240; ×1,5 (50 %) y ×2 (100 %) | confirmar |
| Impuesto a la renta de empleados | fracción básica 12.208; tabla del 5 % al 37 % (NAC-DGERCGC25-00000043); **el simulador no lo calcula** | confirmado |
| Utilidades | 15 % (10 % trabajadores + 5 % cargas); hasta el 15-abril; **el simulador no las calcula** | confirmar fecha |

**Ejemplos que el contador puede recalcular a mano** (período abril 2026):
- María Gómez: sueldo 900 + 10 h extras al 50 % (56,25) = 956,25 · reserva 79,69 · ingreso 1.035,94 · IESS 90,37 · anticipo 100 · **neto 845,57**.
- Ana Silva: 482 + décimo 13.º 40,17 + décimo 14.º 40,17 = 562,34 · IESS 45,55 · **neto 516,79**.
- Carlos López: 750 + 8 h al 100 % (50,00) = 800 · IESS 75,60 · **neto 724,40**.
- Asiento de María: Debe 6.01 Gasto de nómina 1.035,94 + 6.02 IESS patronal 116,18 + 6.04 Beneficios sociales 159,70 = **1.311,82**; Haber Sueldos por pagar 845,57 + IESS por pagar 206,55 + Anticipos al personal 100,00 + Beneficios sociales por pagar 159,70 = **1.311,82**.

**Preguntas concretas al contador**
1. ¿Se reconoce el aporte patronal y las provisiones como gasto del mes (como en el asiento)?
2. ¿El anticipo se cancela contra "Anticipos al personal" como en el ejemplo?
3. ¿Falta algo que una nómina real ecuatoriana deba contabilizar (p. ej. IECE/SECAP en cuenta aparte, fondos de reserva depositados en el IESS)?

## 5. Para el consultor SAP — qué mirar
1. **`rutas_unicas.csv`:** cada fila es una ruta de menú distinta usada por una práctica. Marcar si existe en la versión instalada (SAP B1 10.0 FP o la que tenga el cliente) y corregir el nombre.
2. **`practicas_sap.csv`:** para cada práctica, ¿los campos y el orden se parecen a la pantalla real? Anotar nombres reales.
3. **Cosas que el curso dice que SAP estándar NO hace** (confirmar que es cierto): no calcula nómina ecuatoriana; no tiene ventanas de "nota de débito", "guía de remisión" ni "liquidación de compra" como documentos propios (se resuelven con series de numeración y la localización); no genera los formularios 103/104 ni el ATS.
4. **Qué simplifica el simulador** (decir si es aceptable para formación): numeración C20000/V10000/A00001; una sola moneda (USD); sin aprobaciones por flujo salvo umbrales; banca con formatos simulados.

## 6. Cómo cerrar la revisión
- El revisor devuelve los CSV con la columna de "OK/observación" completada.
- Cada observación se corrige en `sri-catalogo.ts`, en `nomina_ec_2026.md`, en `plan.json`/fuentes o en la práctica, y se regenera la clase afectada (`generar_clases.py --only … --force` y `publicar_clases.py --only …`).
- Se vuelve a ejecutar `py scripts/aula/exportar_revision.py` y `npm run test:motor` para dejar constancia.

## 7. Validación del estudiante
La aprobación de una práctica la decide el servidor (`src/lib/practice-check.ts`, función `practicaAprobada`): compara lo que el estudiante hizo con la clase publicada y, en prácticas conectadas, comprueba que el registro exista en su empresa. La política exacta (¿cuenta si vio la solución? ¿cuántos intentos?) está pendiente de decisión del dueño del curso.
