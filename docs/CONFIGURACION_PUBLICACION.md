# Activación de Finix Academy

El código admite el dominio y datos de responsable mediante variables de entorno. Pablo los proporcionará después. No hay valores fiscales o dominios oficiales inventados. `npm run check:release` muestra únicamente qué configuración falta, nunca sus valores secretos.

## Variables públicas

Completar las variables `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_LEGAL_NAME`, `NEXT_PUBLIC_LEGAL_RUC`, `NEXT_PUBLIC_LEGAL_ADDRESS`, `NEXT_PUBLIC_LEGAL_CITY`, `NEXT_PUBLIC_PRIVACY_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE` y `NEXT_PUBLIC_GTM_ID` del archivo `.env.example`. Son datos públicos del sitio; no poner contraseñas ni claves privadas en ellas. Reconstruir la aplicación tras cambiarlas, porque Next.js incorpora variables públicas durante el build.

En producción, registro público, verificación con captación y solicitudes empresariales quedan cerrados mientras los datos legales no estén completos. En desarrollo se pueden probar los recorridos con servicios simulados o cuentas de ensayo. Las páginas y el catálogo siguen consultables.

## Servicios de servidor

- Firebase Admin, claves de firma de certificados y TTS se configuran como secretos del alojamiento. La firma de voz se conserva estable entre compilación y ejecución; nunca se publica mediante `next.config.env`. La clave local de voz quedó preparada en el archivo local ignorado por Git y no aparece en informes.
- Las reglas `firestore.rules` se publicaron el 17-oct; sustituían reglas de prueba vencidas. Los índices actuales permiten las consultas verificadas. La administración de índices de `firestore.indexes.json` y TTL quedó pendiente por PERMISSION_DENIED de la credencial disponible. Las políticas TTL declaradas deben activarse realmente: tener fechas de expiración en documentos no prueba que la infraestructura los borre. Revisar las colecciones de cuota y consultas de certificados.
- Si `SIMULADOR_DB=supabase`, aplicar la migración de auditoría corregida después del esquema base y comprobar permisos en una base de ensayo. El código no sigue guardando sin esa migración ni declara íntegra una auditoría ausente o truncada. La migración se probó en una transacción revertida en Supabase, después se publicó y se verificó el RPC real. Hay respaldo local ignorado de las funciones anteriores. Para Firestore, los hashes nuevos ordenan claves; las cadenas históricas sin esa normalización deben revisarse sin reescribirlas ni declararlas válidas automáticamente.
- `TRUST_PROXY_HEADERS=true` solo para un proxy propio que sustituya cabeceras del cliente; Vercel se reconoce automáticamente. Fuera de un proxy verificado, la cuota anónima se comparte y no confía en direcciones enviadas por visitantes.

## Cuentas anteriores

Esta versión incluye un corte de seguridad fijo para cuentas antiguas. AUTH_POLICY_EPOCH es opcional para establecer un corte posterior; conservarlo estable: una cuenta antigua solo podrá crear contraseña después de una recuperación por correo posterior a ese instante; no cambiarlo arbitrariamente en cada build. Comprobar recuperación, sesión nueva y acceso con cuentas de ensayo.

La versión de seguridad de contraseñas exige que las cuentas antiguas creen una contraseña personal antes de operar; modificar `passwordChanged` desde el navegador ya no está permitido. No se reescribieron cuentas reales ni asientos históricos. Los expedientes legados se leen solo cuando su UID y módulo coinciden; prácticas y evaluaciones anteriores al validador nuevo deben revalidarse para nuevas emisiones. Revisar certificados históricos con el responsable académico antes de cualquier revocación; no se revocaron automáticamente. Los PDF nuevos usan nota, fecha y duración estimada registradas cuando existen; no añaden notas o firmas ficticias. Las autoevaluaciones locales se identifican sin código público.

Los docentes reciben acceso únicamente a alumnos asignados por un administrador en el panel. La asignación no habilita empresas personales. Las solicitudes empresariales se revisan y actualizan desde `/admin/solicitudes`; recibir una solicitud no significa que se envió un correo ni que ya se contactó a la persona.

## Conversiones

`sign_up` se emite al confirmar creación de cuenta; `generate_lead`, al confirmar una solicitud empresarial persistida. Ambos respetan el consentimiento analítico y no incluyen correo, teléfono, nombre o UID en el evento. Una cuenta no equivale a venta o matrícula pagada. Crear los eventos correspondientes en GTM/GA4, marcar los resultados elegidos como conversiones y comprobarlos una sola vez en el entorno real. Los clics o el chat no se cuentan como solicitudes.

## Verificación antes de campaña

1. Dominio definitivo autorizado en Firebase; HTTPS y redirecciones; canonical, sitemap y `llms.txt` en ese dominio.
2. Registro, nueva contraseña de cuenta antigua, Paso 0, prácticas, progreso, examen concurrente y constancia con dos cuentas de ensayo.
3. Solicitud empresarial persistida, visible en administración, con estado de seguimiento; error/reintento no duplica datos.
4. Rechazar y aceptar analítica; verificar que solo el caso consentido emite eventos; comprobar contenedor y atribución reales.
5. Aislamiento entre alumno, docente asignado/no asignado y empresa personal; comprobar reglas reales.
6. Prueba de restauración, supervisión de errores y rendimiento móvil/accesibilidad de la página final. Un build local no demuestra estas condiciones externas.

El 16-oct Pablo autorizó actualizar y publicar. Las campañas siguen pendientes; no se compró publicidad.

## Evidencia local actual

npm test aprobó lint, tipos y 59 pruebas funcionales. Build de producción aprobado en la revisión (166 páginas); consultar el plan de correcciones para el alcance y la última ejecución. La portada y Empresas públicas se revisaron en navegador a tres tamaños. El piloto real con dos alumnos sintéticos comprobó persistencia, aislamiento, evidencias, progreso y auditoría; sus datos se limpiaron. Sitio publicado en https://b1-academy.vercel.app/. No hay certificación 10/10: faltan activación legal, dominio, TTL, medición de conversiones y piloto académico completo.

La narración usa de preferencia TTS_SIGNING_SECRET (o la firma de constancias). Si ambas faltan, existe compatibilidad mediante una clave derivada con HKDF de la credencial privada del servidor, exclusiva para firmar guiones públicos. Cambiar a una clave dedicada exige reconstruir los manuales. Nunca se envía la credencial ni la clave derivada al navegador.
