# Auditoría integral inicial — SAP Academy / Finix ERP

**Fecha:** 11 de octubre de 2026  
**Alcance:** revisión de código y contenidos del repositorio actual; observación de la portada y del panel del simulador en `localhost:3333`; consulta de documentación oficial. No es un pentest de producción, una auditoría contable independiente, una acreditación educativa ni una medición de Search Console. El kit local `public/SAP_B1_Full_Kit_Simulador/` está sin seguimiento en Git y no se modificó.

## Dictamen ejecutivo

| Frente | Estado provisional | Motivo principal |
|---|---|---|
| Seguridad | 42/100; bloqueo crítico | Un endpoint permite consultar certificados, progreso y evaluaciones mediante `uid` sin autenticar. |
| Arquitectura | 55/100 | Existe una base transaccional y controles de concurrencia, pero hay rutas y permisos con límites insuficientes. |
| Preparación de producción | 35/100 | Faltan pruebas integrales, validación de despliegue, privacidad y operación. |
| Formación ERP | Base amplia; competencia aún no certificable | La malla y las prácticas existen, pero el avance y algunas aprobaciones no prueban ejecución de tareas. |
| Simulador para contabilidad real | No apto actualmente | Facturación SRI y banca simuladas; falta segregación de funciones y trazabilidad completa. |
| Búsqueda y experiencia visual | Requiere mejora | Señales técnicas presentes, pero contenido indexable escaso, promesas no sustentadas y presentación repetitiva. |

Las cifras de seguridad y arquitectura son un juicio de revisión de código, no una certificación externa. No se asigna nota SEO o de accesibilidad sin datos de Search Console, mediciones de campo y prueba sistemática de teclado, lector de pantalla y móvil.

## 1. Seguridad y arquitectura

### Crítico

- `src/app/api/certificates/my-certificates/route.ts:23-27,35-80`: la ruta acepta `?uid=` sin sesión válida y devuelve certificados, progreso y resultados de evaluación del usuario indicado. Corregir con autenticación obligatoria y UID derivado del token. Reprobar con dos cuentas de prueba y acceso anónimo.

### Alto

- `src/app/api/progress/route.ts:25-42`, `src/app/api/oral-exam/route.ts:60-69`, `src/app/api/certificates/issue/route.ts:25-35`: el alumno puede marcar una clase como completa sin evidencia de práctica; esa marca participa en el itinerario hacia el certificado.
- `src/app/api/chat/route.ts:49-104` y `src/app/api/simulador/advisor/route.ts:118-171`: acceso sin autenticación a llamadas de IA con coste externo; límite local en memoria basado en una cabecera de IP que puede manipularse.
- `src/app/api/finix/company/route.ts:23-28` y `firestore.rules:30-35`: cualquier docente puede leer la empresa de cualquier alumno. Definir el alcance docente por asignación y consentimiento, especialmente antes de alojar datos empresariales reales.
- `src/lib/server-auth.ts:109-153`: fallos del verificador Admin activan una ruta alternativa de validación y cookie con ID token. Revisar explícitamente disponibilidad, revocación y duración, sin confundir caída del servicio con autorización.

### Medio y fortalezas

- `firestore.rules:17-23` permite al usuario alterar campos de XP, nivel, misiones y progreso del perfil; separar datos editables de logros calculados por servidor.
- `src/app/api/auth/session/route.ts:29-36` tiene diferencia entre duración del token alternativo y la cookie; documentar y alinear.
- Los comandos del ERP derivan la empresa del UID, hay validaciones Zod, operaciones atómicas e idempotencia. Las reglas bloquean escrituras directas a datos ERP. Hay cabeceras de seguridad, aunque la CSP conserva `unsafe-inline`.
- `npm test` pasó en esta revisión, pero solo ejecuta lint y TypeScript. `npm audit --offline --omit=dev` informó cero vulnerabilidades según la caché local, sin verificación actualizada. No se completó pentest autenticado ni prueba de despliegue.

## 2. Formación, módulos y certificación

`src/content/aula/` contiene **30 módulos, 120 clases, 1.394 láminas y 364 prácticas evaluadas**. El banco de examen oral tiene cinco preguntas para cada módulo (150). La cobertura incluye datos maestros, administración, RR. HH., compras, inventario, ventas, producción, finanzas, fiscalidad, analítica, implementación y proyecto final. Esto constituye una base curricular, no una prueba de que un graduado pueda trabajar de forma autónoma.

Brechas verificadas:

1. `src/content/aula/lecciones.json` enlaza las tres primeras clases de nómina (`mod6-c1..c3`) con imágenes de consultoría (`mod25-c2..c4`); siete imágenes referidas faltan. Narración y pantalla se contradicen.
2. Los 120 campos `quizQuestions` están vacíos. `src/content/malla/malla.json:10` promete cuestionario de clase con 90 %, pero no hay preguntas por clase.
3. `src/app/api/practice/route.ts:29-39,58-64` acepta un registro reciente cualquiera del mismo usuario sin unirlo de forma estricta a la misión y la entidad exigidas. `src/lib/practice-check.ts` tampoco convierte intentos o consulta de solución en un criterio de dominio.
4. En `src/content/aula/clases.json`, 114 de 120 descripciones breves están vacías.
5. Hay varias representaciones de la malla (`curriculum-data.ts`, `modules-data.ts`, `malla-curricular.ts`). Cada ruta necesita declarar qué programa y credencial muestra para que los números y promesas no se mezclen.

**Criterio para poder afirmar preparación laboral:** objetivos observables por rol; tareas integradoras con datos y errores realistas; rúbrica por operación, no solo por navegación; evidencia guardada en servidor; evaluación independiente; piloto con estudiantes y empleadores; revisión editorial y de vigencia normativa. La biblioteca `AI-Skills-Unificadas-2026-10-08` aporta una guía de formación corporativa para estructurar este trabajo, pero no prueba cumplimiento por sí sola.

## 3. Simulador contable, administrativo y financiero

**Dictamen:** conservarlo como entorno educativo. No registrar todavía la contabilidad oficial de empresas reales en él.

| Capacidad | Estado observado |
|---|---|
| Asientos, partida doble y períodos | Base funcional con controles de centavos y cuentas imputables. |
| Persistencia | Transacciones, idempotencia y control de concurrencia. |
| Facturación electrónica SRI | XML y estados simulados; no hay firma ni transmisión/autorización real. |
| Banca y conciliación | Banca simulada; el mismo usuario puede declarar y conciliar importes. |
| Roles y aprobación | La API de comandos no aplica permiso por acción ni separación de quien registra, aprueba y reabre. |
| Auditoría | No existe historial inmutable suficiente de antes/después, autor y aprobador. |
| Cierre fiscal e informes | Hay simplificaciones didácticas, incluido cierre sin conciliación tributaria completa. |

Evidencia: `src/lib/fiscal-gateway.ts:64-111`, `src/lib/sri-xml.ts:44,99`, `src/lib/company-engine.ts:74-82,232-235,270-285,339-340,404-408,438-445,685-690`, `src/app/api/finix/company/route.ts:34-42`, `supabase/migrations/20261006_simulador_empresas.sql:15-32,80-94`. El [SRI](https://www.sri.gob.ec/facturacion-electronica) describe generación, firma electrónica y envío para autorización como partes de la facturación electrónica. Por ello un comprobante mostrado por el simulador no debe presentarse como emitido ante SRI.

Para pasar a contabilidad real: definir persona jurídica, régimen y casos de uso; aislar por empresa; permisos y aprobaciones por acción; libro de auditoría inalterable; reversos y cierres controlados; conciliación contra extractos verificables; impuestos versionados por vigencia; conexión SRI en pruebas y producción; respaldo, recuperación y exportación; pruebas con contador responsable y comparación de varios períodos contra resultados conocidos. La aceptación debe ser por empresa y jurisdicción, no por una etiqueta genérica de «ERP real».

## 4. Búsqueda, IA y diseño

**Señales positivas:** `src/app/layout.tsx` define metadatos y organización estructurada; hay `robots.ts`, `sitemap.ts`, `public/llms.txt` y `public/llms-full.txt`; las zonas privadas tienen reglas de no indexación.

**Brechas visibles y de código:**

- `src/app/sitemap.ts:24` usa la fecha actual como `lastModified` de todas las rutas, aunque no hayan cambiado. [Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) utiliza esa señal si es verificable y exacta.
- `src/app/blog/page.tsx:48-81` muestra dos tarjetas «Leer artículo completo» como texto sin enlaces ni artículos completos. Se promete profundidad que el usuario y el buscador no pueden abrir.
- La portada contiene una larga «Cápsula GEO» antes del título principal, 14 tarjetas de diploma con estructura casi idéntica y llamadas «oficial», «acreditados» y «certificada» sin prueba de acreditación externa visible. Google recomienda [contenido útil para personas](https://developers.google.com/search/docs/fundamentals/creating-helpful-content); un bloque diseñado expresamente para motores no sustituye explicaciones, ejemplos y resultados comprobables.
- `src/app/layout.tsx:24-76,94-129` fija dominio y marca en metadatos; confirmar dominio canónico, logotipo existente, perfiles sociales reales y alcance geográfico antes de publicar esas afirmaciones. La portada exhibe `finix.local` como contacto, que no es un canal externo utilizable.
- En la pantalla local a 1265 px, el panel del simulador sitúa una sola tarjeta de entrada sobre cuatro métricas; la malla de diplomas obliga a recorrer tarjetas largas y repetidas. Hacer prueba con usuarios en móvil y escritorio antes de rediseñar; priorizar jerarquía, orientación, ejemplos reales, prueba social verificable y una ruta clara de inicio.

El marcado `Course` puede ayudar a describir cursos que existen y son visibles; [Google no garantiza resultados enriquecidos](https://developers.google.com/search/docs/appearance/structured-data/course). `llms.txt` tampoco demuestra citas o posicionamiento. Faltan Search Console del dominio correcto, analítica segmentada y métricas de experiencia para medir visibilidad real.

## 5. Plataforma educativa reutilizable

La plataforma sí tiene piezas reutilizables: identidad y matrícula, organización por programa/módulo/lección, reproductor, prácticas, progreso, evaluación y credenciales. Conviene separar **motor educativo** de **contenido específico ERP** y definir `Programa → Plan versionado → Competencia → Unidad → Actividad → Evidencia → Evaluación → Credencial`. El simulador ERP quedaría como laboratorio conectado solo al programa de ERP.

### Inglés

Piloto de una ruta A1-A2 basada en descriptores observables del [MCER](https://www.coe.int/en/web/portfolio/the-common-european-framework-of-reference-for-languages-learning-teaching-assessment-cefr-). Añadir diagnóstico de nivel, comprensión oral/escrita, producción oral/escrita, interacción, repetición espaciada, conversación con feedback humano o calibrado, rúbricas de pronunciación y evaluación periódica. Probar retención y progreso real antes de escalar a B1-C2. Una calificación automática de IA no debe ser la única evidencia.

### Mallas universitarias de Ecuador

Elegir primero **una universidad, carrera, sede y versión de pensum**. Importar la malla oficial de esa institución, mapear resultados de aprendizaje, prerrequisitos, créditos/horas y evaluación; someter el contenido a revisión de docentes del área. El [CES](https://ppcp.ces.gob.ec/) gestiona proyectos de carreras y programas; la plataforma no debe insinuar que otorga el título universitario sin convenio y autorización aplicables.

### Bachillerato y equivalencias internacionales

Elegir país y credencial objetivo antes de redactar la malla. Para Ecuador, basarse en currículo oficial vigente y requisitos de la autoridad educativa; para una referencia internacional, el [Programa del Diploma IB](https://ibo.org/programmes/diploma-programme/curriculum/) combina seis grupos de asignaturas y un núcleo. Ofrecer un programa IB requiere [autorización del IB](https://ibo.org/become-an-ib-school/the-authorization-process/). Se puede enseñar contenido alineado sin prometer un diploma oficial que la plataforma no está autorizada a emitir.

## 6. Orden recomendado y puertas de aceptación

1. **Contención inmediata:** corregir acceso anónimo a certificados; cerrar rutas de IA o establecer cuota verificable por identidad; revisar lectura docente de datos empresariales. Probar con cuentas de distintos roles.
2. **Integridad de credenciales:** unir cada práctica a la operación exigida, bloquear progreso unilateral, corregir nómina e imágenes, aclarar criterio del 90 %. Repetir un ciclo completo alumno → práctica → examen → certificado.
3. **Promesas públicas y visibilidad:** retirar o sustentar afirmaciones «oficial/acreditado», reparar blog y contacto, alinear dominio, estructura de cursos y sitemap; medir Search Console y Core Web Vitals.
4. **Experiencia:** test de 5-8 usuarios de perfiles distintos, móvil y escritorio; rediseñar portada, diplomas, inicio del simulador y transición de narración según errores observados; verificar teclado y lector de pantalla.
5. **ERP real, como producto aparte:** especificación contable y de cumplimiento con contador responsable; controles, integraciones y pruebas de cierre antes de aceptar datos reales.
6. **Expansión educativa:** piloto de inglés; después una malla universitaria o bachillerato según el socio y la autorización disponibles.

## Decisiones del propietario pendientes

1. Jurisdicción, tipo de empresa y alcance tributario de la primera versión contable utilizable.
2. Si la siguiente etapa es solo diseño y plan, o también corrección inmediata de bloqueos identificados.
3. Orden de prioridad entre inglés, una malla universitaria específica y bachillerato; para universidad, indicar institución/carrera/versión; para bachillerato, país y credencial buscada.
4. Evidencia de acreditaciones, dominio público definitivo, acceso a Search Console y un entorno de ensayo con cuentas de alumno, docente y administrador.
