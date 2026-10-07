# Estado del proyecto y aprendizajes (resumen compacto)

> Fecha: 7-oct-2026. Sirve como memoria para retomar el trabajo sin releer la conversación.
> Detalle técnico: `docs/15` (clases express), `docs/16` (revisión SAP y contador), `docs/revision/*.csv`.

## 1. Lo que ya funciona (lo positivo)

**Plataforma**
- Mi Aula (curso) y /simulador (práctica) comparten **la misma empresa del estudiante en Supabase**: B1 Center (curso) y "Mi empresa" (libre). Seguridad verificada: RLS activo, funciones cerradas al público, solo el servidor entra.
- Sesión robusta (sin bucle de login), 95 → **100 clases, 25 módulos, 341 prácticas**, certificados por módulo, diplomas por rol (incluye Nómina) y programa maestro.
- **174 prácticas abren una pantalla real del simulador** y el servidor comprueba que el registro exista en la empresa del estudiante. Todas las pantallas del simulador tienen al menos una práctica.

**Contenido sin gastar tokens de Claude**
- Cadena: `plan.json` → generador (NVIDIA/Gemini) → validadores → publicación con láminas (Playwright). Reanudable, sin tocar lo ya publicado.
- Validadores que atrapan lo que un modelo no ve: tarifas de IVA y retenciones, naturaleza del IVA, resoluciones citadas, **asientos que cuadran en las tres estructuras**, cifras de nómina (9,45 %, 12,15 %, SBU 482…), **importes que solo pueden venir de la fuente calculada por el motor**, y láminas sin práctica que dicen "practica".

**Simulador**
- **SRI de pruebas:** clave de acceso (módulo 11), validación de RUC/cédula, recepción y autorización simuladas con mensajes, RIDE con código de barras, retenciones con porcentaje fijado por el servidor, asiento y saldo del proveedor actualizados.
- **Banca simulada** (Pichincha, Pacífico, Guayaquil, Produbanco): extracto, conciliación automática, archivo de pagos.
- **Nómina:** rol de pagos con IESS, décimos, fondos de reserva, vacaciones, horas extras; asiento que cuadra; 4 empleados de prueba; un empleado no cobra dos veces el mismo período.
- Códigos al estilo SAP (C20000, V10000, A00001, E001) iguales en las clases y en el motor.
- 44 pruebas del motor (`npm run test:motor`) + 41 casos del validador normativo.

**Calidad y proceso**
- Paquete de revisión para consultor SAP y contador (`docs/16` + CSV con rutas, campos y asientos).
- Plan de clases express (`docs/15`), barato porque reutiliza las prácticas existentes.

## 2. Aprendizajes que conviene conservar
1. **Validar con código vale más que pedirle al modelo que sea cuidadoso.** Aun con la fuente delante inventó totales y cuentas; el validador de cifras y de importe por cuenta los frenó.
2. **Leer lo generado encuentra errores de fondo** (asiento balanceado pero mal explicado). Hacerlo antes de publicar.
3. **Una sola fuente de verdad** (tabla de retenciones, fuentes por tema) evita que un dato viejo sobreviva en otro archivo. El error de los códigos de retención sobrevivió porque estaba copiado en 6 sitios.
4. **Las fuentes web discrepan:** no basta con una; si dos independientes coinciden, se acepta y se marca lo dudoso para el contador.
5. **Cuidado con `\b` en scripts de shell/Python:** se convierte en un carácter de control y rompe regex en silencio. Escribir esos cambios con el editor, y buscar caracteres de control después.
6. **Prácticas que dependen unas de otras** (crear empleado → rol → pagar) deben ser únicas por clase, o el estudiante choca con "ya registrado".
7. **No empujar a GitHub sin autorización explícita** (regla del proyecto) y no mezclar archivos de otras sesiones en los commits.

## 3. Pendientes conocidos
- Confirmación de **códigos de retención ⚠** y del aporte IECE/SECAP por un contador; revisión de rutas y campos por un consultor SAP.
- Decisión de la política de aprobación de prácticas (`practicaAprobada`, `TODO(human)`).
- Impuestos que el simulador **aún no calcula**: retención de IR a empleados en el rol, utilidades, IR anual y anticipo (ver sección 4).
- Clases express (planificadas), versión móvil, sección tipo blog en la página principal, correo real de admisiones, subida automática a YouTube.
- Prueba con un estudiante real (auditoría con estudiante ficticio en preparación).

## 4. Cobertura tributaria hoy (para la auditoría)
| Tema | Estado |
|---|---|
| IVA 0 / 5 / 8 / 15 %, crédito tributario, IVA cobrado | ✔ en documentos, asientos, XML y Formulario 104 |
| Retención de renta (2026) y de IVA, comprobante de retención | ✔ con tabla única, autorización simulada y asiento |
| Facturación electrónica: clave, XML, autorización, RIDE | ✔ simulada (sin firma real) |
| Formularios 103 / 104 / ATS | ✔ resumen en el simulador; clase que los explica |
| IESS personal y patronal, décimos, reserva, vacaciones | ✔ en rol de pagos y asiento |
| **Retención de IR al empleado (tabla 2026)** | ✘ solo explicado |
| **Utilidades 15 %** | ✘ solo explicado |
| **IR anual y anticipo de la empresa (25 %)** | ✘ no calculado |
| ISD, notas de venta RIMPE, ICE | ✘ no cubierto |
