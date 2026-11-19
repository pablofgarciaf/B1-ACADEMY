# Revisión curricular y UX pedagógica — cierre de ronda

Fecha: 18 de noviembre de 2026. Repositorio: `C:/dev/proyectos/sap academy`.
Alcance: clases publicadas, actividades de Mi Aula, cobertura, instrucciones y evaluación.
Estado: correcciones parciales integradas; no equivale a validación integral ni a publicación.

## Evidencia y hallazgos

- `src/content/aula/lecciones.json`, contrastado con `src/lib/curriculum-data.ts`: 124 clases. Al inicio había 384 actividades y 24 clases con una sola práctica. Un conteo positivo no demuestra cobertura de todos los objetivos.
- Datos Maestros (`mod-2`) tenía 17 actividades. En artículos (`mod2-c2`), solo una de seis abría un formulario conectado; las otras eran fichas. El estado actual tiene 19 actividades: socios 4 (4 conectadas), artículos 7 (1 conectada), unidades 5 (2 conectadas), precios 3 (3 conectadas). Queda pendiente convertir las fichas de configuración de artículos que corresponda en operaciones reales y comprobarlas en navegador.
- `mod5-c3` se titulaba Evaluación de Desempeño, Finiquito y Salida del Personal, pero repetía íntegramente la clase de beneficios sociales `mod6-c2`. Se sustituyó el contenido publicado por un recorrido sobre desempeño, soportes, responsables, conciliación de liquidación y cierre de accesos.
- `mod22-c5` anunciaba 103, 104 y ATS, pero su única actividad era configurar un proveedor. Se añadieron casos de asociación de obligaciones y conciliación del anexo.
- `mod16-c4` cubría proyectos y facturación con una sola actividad de vincular una actividad. Se añadieron casos sobre etapas, presupuesto y facturación por hito sin duplicar lo ya facturado.
- `docs/15_Plan_Clases_Express_Simulador.md:18` documenta la queja de que FeNi estorbaba. Es evidencia documental de una queja, no un estudio de usuarios ni una prueba de resolución actual. Queda pendiente la comprobación visual de superposición y controles de pausa.
- El historial de MiroFish describe opiniones sintéticas sobre claridad de práctica, duración, prerrequisitos y evaluación. No se presentan como opiniones de alumnos reales. No se recuperaron los registros originales de entrevistas durante esta ronda.

## Cambios de esta ronda

- `src/lib/aula/operational-workshops.ts`: 16 talleres de aplicación para `mod5-c3`, `mod6-c2`, `mod9-c2`, `mod10-c1`, `mod16-c4`, `mod22-c4`, `mod22-c5` y `mod22-c10`. Cada taller incluye caso, preguntas, pistas y criterio de éxito. Los ejercicios fiscales y laborales explicitan sus supuestos y no tramitan documentos reales.
- `src/lib/aula/workshop-types.ts`: contrato de casos y constructor de láminas. Se agregan al final para conservar las claves anteriores de las demás actividades.
- `src/lib/aula/published-lessons.ts`: composición del contenido efectivo y corrección de la clase duplicada. Es la fuente común consumida por la API, registro de prácticas y contratos de evaluación. El JSON base permanece como material original; para auditar lo publicado se debe usar esta composición.
- `src/components/aula/CaseWorkshop.tsx`: respuestas inicialmente vacías, pistas plegables, devolución por criterio y reintento. Las respuestas esperadas no se muestran como valores para copiar en el panel de instrucciones. No equivale a un examen ciego: el material de práctica está disponible en el cliente.
- `src/components/aula/AulaSimulatorView.tsx`: integración del taller de aplicación y ocultación de la ficha de soluciones para esos casos.
- `src/lib/practica-conectada.ts`: los casos se reconocen explícitamente y no abren un formulario ERP por coincidencia de palabras.
- `src/lib/practice-registry.ts`, `src/lib/practice-outcome-contract.ts`, `src/app/api/lesson-data/route.ts`: mismo contenido efectivo para entrega, requisitos y evaluación. El antiguo rol `mod5-c3#5` deja de acreditar la clase de salida; ahora requiere los casos `#11` y `#12`. No se borran registros históricos.
- `tests/workshop-pedagogy.test.cjs`: cuatro pruebas nuevas de integración de requisitos, corrección temática, secuencia y cálculos.
- `tests/curriculum-integrity.test.cjs`: comprueba la fuente publicada efectiva.

Resultado del inventario actual: 124 clases y 401 actividades. Las ocho clases reforzadas pasan de una práctica a dos o tres. Esto no acredita cobertura exhaustiva de todas las competencias ni corrige todas las pantallas.

## Cambios concurrentes preservados

Durante la revisión aparecieron modificaciones ajenas a esta ejecución en `docs/CONFIGURACION_PUBLICACION.md`, `src/content/aula/lecciones.json`, `src/app/api/lesson-data/route.ts`, `src/app/api/practice/route.ts`, `src/app/api/oral-exam/route.ts`, `src/lib/server-auth.ts`, `src/components/aula/AulaSimulatorView.tsx` y pruebas existentes. Se preservaron y solo se integraron los puntos indicados arriba.

Entre ellas están ejercicios de disponibilidad y conversiones en Datos Maestros, aclaración de ficha frente a laboratorio, referencia a `.env` y cambios de conservación de aprobaciones. No se atribuyen a esta ejecución como autoría propia. Las verificaciones descritas abajo corresponden al checkout conjunto observado.

## Validación

- `node --test tests/workshop-pedagogy.test.cjs tests/curriculum-integrity.test.cjs tests/practice-outcomes.test.cjs`: 37/37 correctas.
- `npm run lint`: código 0, sin errores y con 10 advertencias en componentes existentes.
- `npx next typegen` y `npx tsc --noEmit --incremental false --pretty false`: código 0.
- `git diff --check`: sin errores de espacios; avisos de conversión LF/CRLF.
- `npm run test:unit`: 201 pruebas, 198 correctas y 3 fallidas. La suite global no está aprobada.
- Fallo `tests/intake-access-contract.test.cjs:97`: empresa privada habilitada, obtiene 403 frente a 200 esperado.
- Fallo `tests/intake-access-contract.test.cjs:102`: perfil bloqueado/contraseña antigua, obtiene 200 frente a 401 esperado.
- Fallo `tests/legal-configuration.test.cjs:32`: configuración incompleta, obtiene `true` frente a `false` esperado.
- No se ejecutó build de producción ni recorrido autenticado en navegador en esta ronda. No se usaron credenciales, no se creó `.env.example`, no hubo despliegue ni push.

## Pendientes al corte solicitado

- Persisten 16 clases con una sola práctica: `mod25-c1` a `mod25-c4`, `mod26-c1` a `mod26-c4`, `mod27-c1` a `mod27-c4` y `mod28-c1` a `mod28-c4`. Requieren evidencia de fases/fit-gap, BPMN, requisitos/RTM y UAT que vaya más allá de una ficha aislada.
- Verificar y corregir el recorrido real de edición de artículos, vinculación de socios y unidades; las fichas no acreditan persistencia en el motor.
- Comprobar la queja de FeNi, visibilidad de todos los talleres, duraciones adicionales y navegación/recuperación tras errores con una cuenta de ensayo.
- Resolver los tres fallos globales antes de considerar lista una versión de publicación.
