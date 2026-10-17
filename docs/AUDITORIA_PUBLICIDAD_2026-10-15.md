> Antecedente histórico: el estado actual está en [PLAN_CORRECCIONES_2026-10-16.md](PLAN_CORRECCIONES_2026-10-16.md). Los hallazgos y resultados siguientes describen el código de la fecha de esta auditoría, antes de las correcciones.

# Auditoría previa a publicidad — Finix Academy

Inicio: 15 de octubre de 2026. Cierre: 16 de octubre de 2026, America/Bogota.
Código: `89b079f99fea3c81bdea8d1a1031b9882be43979`; sin cambios funcionales durante la revisión.
Objetivos confirmados por Pablo: **inscripción a cursos y solicitudes de capacitación para empresas**. Dominio propio todavía por comprar.
Plan de continuidad: `docs/PLAN_AUDITORIA_PUBLICIDAD_2026-10-15.md`.

## Dictamen

**No recomiendo iniciar campañas de captación todavía.** Hay defectos que comprometen la identidad del expediente, la aprobación de prácticas, el aislamiento de empresas y la fidelidad del simulador. El recorrido de solicitud empresarial y su medición también requieren trabajo antes de invertir.

La revisión no permite afirmar «10/10 en todo». Las categorías con fallos están suspendidas; las que requieren cuentas de prueba, medición real o acceso a infraestructura quedan sin aprobar. El aspecto visual de la portada y una compilación correcta no compensan errores en lo que se promete entregar.

| Área | Resultado para lanzamiento | Motivo |
|---|---|---|
| Seguridad e identidad académica | Bloqueada | Expedientes de homónimos; progreso y prácticas sin evidencia suficiente. |
| Privacidad y confianza | Bloqueada | Responsable legal incompleto, credenciales iniciales y acceso docente global. |
| Formación y taller comercial | Bloqueada | Misiones abren pantallas equivocadas; dos defectos de narración. |
| Simulador y trazabilidad | Bloqueada | Depreciación, cierres, migración y compatibilidad sin auditoría. |
| Captación empresarial | Bloqueada | Página informativa sin formulario o acción comercial directa. |
| Medición de inscripciones y solicitudes | Pendiente de aprobación | No hay eventos propios de conversión; configuración externa y recorrido real no verificados. |
| SEO e información para IA | Parcial | Metadatos presentes; sitemap incompleto, fuentes de identidad/dominio dispersas. |
| Diseño, accesibilidad y rendimiento | Evaluación parcial | Portada y ayuda observadas; faltan mediciones sistemáticas y recorridos autenticados completos. |
| Dominio y operación | Pendiente programado | Dominio por adquirir; requiere lista de conexión y comprobación posterior. |

## Cómo se verificó

Revisión principal y tres agentes especialistas sobre código actual; revalidación de hallazgos anteriores, pruebas puras en memoria y suites existentes. El código revisado permaneció en el mismo HEAD al cierre. Se preservó `archive-F1sh0o/`, cuyo origen no está confirmado.

La portada pública `https://b1-academy.vercel.app/` respondió **200**, con el título de la escuela y `index, follow`. Se observó con navegador como visitante sin cuenta y se probó una pregunta sugerida del asistente. Eso acredita disponibilidad y ese comportamiento público; no identifica el commit desplegado ni valida reglas, migraciones o integraciones remotas.

No se crearon cuentas ni expedientes reales, no se enviaron solicitudes comerciales, no se emitieron certificados y no se modificaron bases. Las pruebas de autorización docente y de compatibilidad Supabase usaron dependencias simuladas. La integración real SRI sigue deliberadamente diferida y no se cuenta como error. Esto no es un pentest autenticado de producción ni una certificación legal o contable.

## Errores que bloquean captar usuarios

### A01 · Crítico · Expedientes de personas distintas pueden mezclarse

`src/lib/student-doc.ts:29–33`; `src/app/api/progress/route.ts:18–35,77–85`; `src/app/api/certificates/issue/route.ts:25–45`.

La clave usa módulo y nombre normalizado, sin UID. Dos alumnos homónimos obtienen el mismo documento; progreso y aprobación se leen sin validar su propietario. Pueden heredarse requisitos y emitirse un certificado con una evaluación ajena. Cambiar el nombre también cambia la clave aparente del historial.

**Aceptación:** clave estable UID+módulo, validación de propietario y migración revisada. Dos cuentas homónimas deben mantener progreso, notas y certificados independientes; renombrar un perfil debe conservar su historial.

### A02 · Alto · Un registro cualquiera permite aprobar prácticas diferentes

`src/app/api/practice/route.ts:23,27–35,48,59–73`; `src/components/simulator/PracticaConectada.tsx:81–85`.

El cliente envía `conectada:true` y evita la comparación de campos. El servidor acepta cualquier registro propio de los últimos veinte minutos, sin relacionarlo con operación, documento o resultado de la misión. Un solo guardado puede satisfacer ejercicios que no se realizaron.

**Aceptación:** tipo de práctica definido por servidor y evidencia específica de alumno, empresa, misión, operación y valores. Una operación sin relación no debe aprobar la práctica.

### A03 · Alto · Se pueden completar clases directamente sin cursarlas

`src/app/api/progress/route.ts:45–85`; `src/lib/requisitos-aula.ts:61–68`.

La API valida sesión e ID de clase y escribe finalización sin exigir evidencia académica ni inducción previa. Enviar los IDs de inducción permite cumplir el desbloqueo sin recorrerla.

**Aceptación:** requisitos aplicados por servidor, comprobando intentos de completar fuera del recorrido y el recorrido legítimo.

### A04 · Alto · Docentes acceden a empresas personales ajenas

`src/app/api/finix/company/route.ts:23–28`; `src/app/api/finix/teacher/route.ts:20–24,59–64`.

El rol docente autoriza cualquier UID, sin asignación alumno/docente ni distinción entre empresa académica y personal. Prueba aislada actual: sesión docente simulada y UID de empresa personal producen HTTP 200 y lectura de ese UID.

**Aceptación:** relaciones explícitas de autorización; rechazar empresas personales y alumnos no asignados en listados, lecturas y misiones.

### A05 · Alto · Credencial inicial predecible y cambio obligatorio eludible

`src/context/AuthContext.tsx:160–166`; `src/app/api/admin/users/route.ts:46`; `firestore.rules:17–20`; `src/lib/server-auth.ts:126`.

El registro utiliza cédula como contraseña inicial. El flujo administrativo puede guardar la contraseña temporal en el campo `cedula`. El usuario puede modificar `passwordChanged` y el servidor no exige el cambio real antes de autorizar las operaciones revisadas. La política pública afirma que no se almacenan contraseñas (`src/app/privacidad/page.tsx:136–137`), lo que contradice ese caso administrativo.

**Aceptación:** credencial temporal no predecible, sin conservarla en perfil, y transición comprobada por servidor. Pruebas con cuenta nueva, cambio pendiente y credencial antigua.

### A06 · Alto para campaña B2B · No existe un recorrido de solicitud empresarial

`src/app/empresas/page.tsx:18–38`; `src/components/site/Footer.tsx:72–78`.

La página dirige a explorar el catálogo; no ofrece solicitar capacitación, cotización o diagnóstico. El pie remite al asistente como orientación. Un prospecto empresarial no puede dejar una solicitud desde esa página ni recibir una confirmación de recepción.

**Aceptación:** acción comercial clara, formulario con empresa/contacto/necesidad mínima, aviso correspondiente, persistencia o entrega comprobada, confirmación y responsable de seguimiento. Probar envío válido, duplicado, error y recuperación con datos de ensayo.

### A07 · Alto para captación · La ayuda pública falla para visitantes nuevos

`src/components/site/FeNiChat.tsx:60–92`; `src/app/api/chat/route.ts:49–68`; `src/components/site/Footer.tsx:75`.

Se anuncia ayuda y se permite escribir sin sesión, mientras la API exige autenticación. La pregunta sugerida se probó en la portada pública sin cuenta: muestra «Ocurrió un error al conectar con FeNi AI. Por favor, intenta de nuevo». No explica que sea necesario entrar ni ofrece contacto alternativo dentro de ese error.

**Aceptación:** recorrido público de orientación coherente con la protección de la API; explicar el acceso requerido o proporcionar asistencia pública controlada y un canal alternativo que funcione.

### A08 · Alto antes de captar datos · Identificación legal incompleta

`src/lib/legal-config.ts:7–11`; `src/app/privacidad/page.tsx:29–32,123`.

Razón social, RUC, domicilio, ciudad y correo de privacidad están vacíos. El aviso usa `[pendiente]` o un canal incompleto, mientras el registro y la verificación recogen datos personales.

**Aceptación:** completar datos del responsable y canal operativo, comprobar coherencia de avisos y formularios. No se emite aquí un dictamen jurídico integral.

### A09 · Alto · Depreciación distorsiona el resultado utilizado para impuestos

`src/lib/company-engine.ts:19,542,556`; `src/lib/company-calculations.ts:15`.

La depreciación se lleva a `6.06`, denominada participación de trabajadores, que se excluye del cálculo previo a participación e IR. Reproducción actual: ingreso 1.000 y depreciación 100 devuelven resultado 1.000; debe incorporar el gasto y ser 900 antes de esos conceptos.

**Aceptación:** cuenta propia, revisión de registros existentes y prueba integrada de resultado y cálculo tributario.

### A10 · Alto · Compatibilidad Supabase permite operar sin trazabilidad

`src/lib/company-store-supabase.ts:96–98,183`.

Cuando falta la función nueva, se reintenta sin `p_audit` ni `p_deletes`. Si falta el verificador, responde `{valid:true,checked:0}`. Ambos comportamientos fueron reproducidos localmente con respuestas remotas simuladas. Una auditoría ausente no demuestra integridad.

**Aceptación:** detectar esquema incompatible y detener/informar la operación; no declarar válida una comprobación inexistente. Probar instalaciones con y sin migración.

### A11 · Alto · Migración de auditoría no concede permiso a la firma declarada

`supabase/migrations/20261011_simulador_auditoria.sql:23–26,97`.

La función declara doce parámetros, cinco `jsonb`; el `GRANT` apunta a once, cuatro `jsonb`. La migración fallará en esa sentencia con el esquema previsto. Confirmación estática; no se aplicó SQL remoto.

**Aceptación:** ejecutar la migración completa en una base temporal desde el esquema anterior y verificar permisos efectivos.

### A12 · Alto · Reapertura posterior al cierre anual deja el ejercicio inconsistente

`src/lib/company-engine.ts:409–418`.

Reproducción actual: ingreso, cierre anual, reapertura de octubre y nuevo ingreso. Se acepta el movimiento posterior, pero recerrar responde «El ejercicio 2026 ya fue cerrado». El primer cierre deja de representar el año.

**Aceptación:** impedir esa reapertura o implementar reversión formal del cierre y recierre con evidencia.

### A13 · Alto · El taller de ventas no ejecuta varias misiones prometidas

`src/lib/practica-conectada.ts:97–107`; `src/components/simulator/FinixInteractiveSimulator.tsx:635–660`; `src/components/simulator/PracticaConectada.tsx:81–85`.

La función actual se ejecutó contra las veinte misiones publicadas. Alta de cliente devuelve formulario textual; límite de crédito abre bancos; consultar stock/costo abre editor que exige guardar; emitir factura abre panel SRI que necesita documento previo; mapa de relaciones abre formulario de factura. El selector por texto no respeta los `screenId` como contrato de navegación.

**Aceptación:** asociación explícita misión/pantalla/acción; completar consultas sin guardados artificiales; ciclo probado de cliente, oferta, pedido, entrega, factura y cobro sobre empresa nueva.

## Otros defectos y carencias comprobados

| ID / prioridad | Error y evidencia | Prueba de cierre |
|---|---|---|
| A14 · Medio, puerta de medición | No se encontraron eventos propios `sign_up`, `generate_lead` ni conservación explícita de atribución en el código. `CookieConsent.tsx:54–67` solo inicia GTM; `layout.tsx:89` admite un ID de muestra que no carga analítica. Un contenedor externo podría añadir medición, pero no fue inspeccionado. | Inscripción exitosa y solicitud empresarial deben generar una conversión deduplicada, verificable, sin contar aperturas/clics como resultados; documentar campañas y consentimiento. |
| A15 · Medio | Talento inserta dos perfiles de muestra como graduados auditados; contacto sin acción. Vacantes fijas y elegibilidad local no coinciden con autorización real de postulaciones. `student-service.ts:236–304`, `talento/page.tsx:23–34,100–104`, `bolsa-empleo/page.tsx:12–59`, `api/job-applications/route.ts:8–16`. | Datos reales y autorización del servidor, o etiquetado inequívoco como demostración; contacto operativo. |
| A16 · Medio | Paso 0 se considera completo con `companyName`, aunque la carga puede interrumpirse antes del stock/documentos. `company-server.ts:24–28`, `b1-center.ts:13–125`. | Marcador final del servidor, inicialización reanudable e idempotente; simular interrupción y recuperación. |
| A17 · Medio | Seis comandos válidos carecen de ejecución: `binLocation`, `binMove`, `lotRegister`, `lotIssue`, `udfDefine`, `udfSet`. `company-commands.ts:69–76`; `company-engine.ts:181–734,751`. Reproducción: ubicación no creada y resultado vacío sin error. | Implementar o rechazar explícitamente; cobertura exhaustiva de comandos. |
| A18 · Medio | Compra de activo a crédito aumenta mayor sin proveedor/documento auxiliar. `company-engine.ts:532–536`; `company-control.test.cjs:180–182` acepta diferencia de 500. | Compra integrada con proveedor/factura y auxiliares conciliados. |
| A19 · Medio | Pausa durante descarga de voz no impide `audio.play()` posterior. `useAcademyVoice.ts:102–115,180–207`. Prueba del hook real con descarga controlada: audio inicia con `isPaused=true`. | Con conexión lenta, pausar antes de terminar la descarga debe impedir audio y temporizador hasta reanudar. |
| A20 · Medio | `mod20-c2`, lámina 8, concatena narración e instrucciones: 1.696 caracteres; servicio admite 1.500. `lecciones.json:15834`; `mi-aula/[moduleId]/page.tsx:312–317`; `tts.ts:6`. | Fragmentar narración o ajustar contrato; comprobar textos finales de todas las láminas. Mostrar error de voz al alumno. |
| A21 · Medio | Se exige responder «Retorno ROI en 6 meses» sin inversión ni fórmula; cifras de pérdidas/capital liberado sin supuestos suficientes y promesa de auditoría inmutable. `lecciones.json:24146,24160,24212`. | Caso calculable con hipótesis e inversión; evaluación del cálculo, sin garantía universal de plazo ni inmutabilidad no demostrada. |
| A22 · Medio | Cuotas IA/voz en memoria se multiplican entre instancias/reinicios; `history` no tiene máximo de cantidad. `chat/route.ts:16,19,71–75`; `simulador/advisor/route.ts:19,133–137`; `tts/route.ts:14–25`. | Cuota compartida persistente y límites de tamaño total. |
| A23 · Medio | Creación/avance de examen no atómicos: solicitudes simultáneas pueden superar cuota o sobrescribir respuestas. `oral-exam/route.ts:104–160`. | Reserva atómica de intento y pregunta, idempotencia/versiones y prueba concurrente. |
| A24 · Medio | Webhook afirma emisión de PDF, publicación y sincronización sin ejecutar esas acciones. `webhooks/n8n/route.ts:35–64`. | Responder éxito solo tras confirmar persistencia/integración, o declarar expresamente simulación. |
| A25 · Medio | Sitemap de diez rutas excluye manuales individuales y módulos públicos; dominio/identidad se repiten en varias fuentes. `sitemap.ts:5–15`, `site-url.ts:2–12`, `legal-config.ts:13`, `public/llms*.txt`, `layout.tsx:41–43,94`. | Catálogo indexable en sitemap y origen/marca consistentes; verificar tras comprar dominio. No se deduce de esto una penalización actual. |
| A26 · Medio | `test:motor` apunta a archivos de `scripts/pruebas` no versionados porque `scripts/` está ignorado; `npm test` solo ejecuta lint/tipos. `package.json:14–15`, `.gitignore`; `git ls-files scripts/pruebas` vacío. | Clon limpio debe ejecutar pruebas funcionales versionadas sin archivos locales extra. |
| A27 · Medio | Práctica cliente autorrellena valores fijos de acceso, incluida identidad de correo. `PracticaValidada.tsx:119–125,190–200`; `practice-check.ts:45`. Son criterios didácticos, sin autenticación real demostrada. | Usar identidades ficticias explícitas y evitar enseñar credenciales compartidas; no se intentó iniciar sesión con esos valores. |

## Qué mejoró y qué no debe repetirse como error antiguo

- Inventario actual: **31 módulos, 124 clases/lecciones, 1.444 láminas y 384 prácticas**. Ventas sí tiene **4 clases, 50 láminas y 20 misiones**.
- No se encontraron imágenes referenciadas inexistentes ni clases sin lección. Esto no acredita revisión editorial de cada imagen/texto.
- El margen costo 650/precio 850 fue corregido a **23,5 %**. Ya no se reporta el antiguo error del 30 %.
- La consulta privada de certificados deriva UID de autenticación; chat y asesor también exigen sesión o Bearer.
- Verificación pública conserva respuesta mínima, cuota transaccional y consentimiento comercial separado; nombre y correo o teléfono. TTL desplegado no comprobado. Fuera de Vercel, `verify/route.ts:32–35` agrupa visitantes como `untrusted-proxy`, con cuota diaria compartida: revisar solo si se cambia de alojamiento.
- Banco oral independiente existente: los arreglos vacíos de quiz no bastan por sí solos para declarar que no hay evaluación.

## Resultados técnicos y cobertura pendiente

- `npm test`: completó con salida 0 durante esta revisión; lint y TypeScript.
- Suites puras de control, auditoría y analítica: **23/23 aprobadas**. Los errores A09–A12 y A17–A18 sobreviven a esas pruebas.
- Reproducciones adicionales en memoria: depreciación, recierre anual, comando vacío, acceso docente con autenticación simulada, fallback Supabase, selector de misiones y pausa de narración. Sin DB remota.
- Compilación final `npm run build`: **aprobada, salida 0, 160 páginas estáticas generadas**. No extrapolar compilación a corrección funcional.
- Navegador público: portada y ayuda sin sesión; pregunta sugerida terminó en error visible. No se creó una inscripción ni una solicitud empresarial reales.

**Pendientes de aceptación:** cuentas de ensayo y recorrido completo registro → cambio de clave → curso → práctica → examen → certificado; email de recuperación/entrega; permisos y TTL de producción; migración en base temporal; restauración de respaldo; entrega y seguimiento de leads; depuración de GTM/GA4/Ads; carga concurrente; auditoría de accesibilidad con teclado/lector de pantalla y varios anchos; métricas de rendimiento móvil y Core Web Vitals de campo. No hay evidencia para puntuar estas áreas como 10/10. La revisión tributaria por vigencia/contribuyente también sigue pendiente: no se emite certificación normativa de todo el material.

## Marcadores para el futuro dominio y las conversiones

No se compró ni se inventó un dominio. Completar esta lista cuando Pablo lo decida:

1. `[PENDIENTE_DOMINIO]` Registrar nombre elegido y configurar DNS/HTTPS en el alojamiento. Verificar redirección entre variantes y la URL definitiva.
2. `[PENDIENTE_ORIGEN]` Establecer `NEXT_PUBLIC_SITE_URL`; alinear `LEGAL.sitio`, `llms.txt`, `llms-full.txt`, enlaces de credenciales/webhooks y cualquier URL fija. Mantener una única marca visible.
3. `[PENDIENTE_AUTH]` Autorizar dominio en Firebase y revisar sesión, recuperación y enlaces de correo en dominio final.
4. `[PENDIENTE_CONTACTO]` Identificar responsable, correo y seguimiento de solicitudes; comprobar entrega, spam, error y recuperación.
5. `[PENDIENTE_SEO]` Comprobar canonical, robots, sitemap, previews sociales, noindex de zonas privadas y Search Console en dominio final. El dominio temporal no demuestra indexación futura.
6. `[PENDIENTE_INSCRIPCION]` Definir qué cuenta como inscripción: cuenta creada o matrícula en programa. Son eventos diferentes. Registrar `sign_up` solo tras cuenta confirmada; si se vende matrícula, exigir la confirmación de matrícula. No se observó checkout que permita certificar una venta/pago.
7. `[PENDIENTE_SOLICITUD_EMPRESA]` Publicar recorrido empresarial con `generate_lead` al persistir/entregar la solicitud, identificador de deduplicación y estado de seguimiento. Un clic al catálogo no es solicitud.
8. `[PENDIENTE_MEDICION]` Configurar identificadores reales y verificar eventos aceptados/denegados según consentimiento; conservar atribución permitida de campaña sin poner datos personales en URLs o eventos. La ausencia de cookies publicitarias no se considera un defecto: se debe escoger una medición compatible con la política ofrecida.
9. `[PENDIENTE_LANZAMIENTO]` En el despliegue definitivo, repetir ambos recorridos con datos de prueba y comprobar recepción y conversión una sola vez. Confirmar que el anuncio describe exactamente la oferta de su página.

## Orden de corrección y autorización de campañas

1. Resolver A01–A05 y A08 antes de captar cuentas/datos. Corregir evidencias de progreso y prácticas antes de prometer certificación basada en dominio del sistema.
2. Resolver A06–A07 y A14 para los dos objetivos comerciales. Definir la inscripción con precisión y comprobar solicitud recibida por una persona responsable.
3. Corregir A09–A13 y las misiones/voz; completar un piloto autenticado con datos de ensayo. Presentar siempre el ERP conforme a su alcance educativo; los permisos de equipo simulados no prueban segregación operativa multiusuario.
4. Corregir demostraciones/promesas engañosas y restantes defectos. Ejecutar los controles de producción, dominio, accesibilidad y rendimiento pendientes.
5. Autorizar un piloto publicitario únicamente con evidencia de esas puertas; ampliar inversión después de medir inscripciones/solicitudes válidas y su calidad. Esta auditoría no promete rentabilidad de anuncios.

## Continuidad

Entregable de auditoría, sin correcciones de producto. No se eliminaron documentación ni archivos ajenos en esta entrega: pueden contener trabajo posterior útil. El informe del 11-oct queda como antecedente fechado; este informe es la revisión vigente para la decisión publicitaria. El siguiente revisor debe partir de A01–A27, contrastar HEAD y registrar evidencia de cierre; no dar un error por resuelto solo porque pase lint o build.
