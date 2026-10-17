# Finix Academy — estado de correcciones y activación

Actualizado: 16 de octubre de 2026. Base de código: HEAD 89b079f más cambios locales de esta intervención. Pablo autorizó corregir; dominio y datos legales se entregarán después. No se desplegó ni se enviaron campañas. Se preservó archive-F1sh0o/.

## Dictamen actual

Las correcciones de código de A01–A27 están implementadas o tienen una alternativa explícita que elimina la promesa incorrecta. A08 sigue pendiente de datos del responsable. Esto NO certifica 10/10 ni autoriza una campaña: falta activar y comprobar la infraestructura real, el recorrido autenticado y la experiencia visual. El simulador conserva alcance educativo; no se certifica como libro contable oficial ni integración fiscal de producción.

## Resultado local

- npm test: lint, tipos y 55 pruebas funcionales aprobadas, sin pruebas omitidas. Incluye servicios simulados; no sustituye Firebase/Supabase reales.
- npm run build: última compilación de producción aprobada con salida 0; 166 páginas generadas. Política de micrófono del examen confirmada en el manifiesto compilado.
- git diff --check: aprobado.
- npm run check:release: bloqueo esperado por siete datos/configuraciones ausentes: dominio, nombre legal, RUC, dirección, ciudad, correo de privacidad y GTM. No se inventaron valores.
- Revisión visual actual: intento de navegador local rechazado por el control de permisos. No se eludió el rechazo. Móvil, escritorio, teclado y métricas de campo quedan pendientes.
- PostgreSQL local: no hay psql; Docker instalado sin motor disponible. La migración SQL se corrigió por revisión de código, sin ejecutarla en una base real.

## Corrección por hallazgo

| ID | Cambio implementado | Evidencia / alcance pendiente |
|---|---|---|
| A01 | Expediente nuevo por UID y módulo; lectura legada solo si coincide propietario. | Prueba de homónimos y rechazo de registro ajeno. |
| A02 | Práctica de escritura exige operación reciente, actor, empresa, tipo documental y evidencia sin reutilización. Consulta usa datos del servidor. | Pruebas de API con almacén simulado. |
| A03 | Progreso requiere empresa preparada y todas las prácticas exigidas; emisión exige evaluación y prácticas v2. | Revisión de rutas; falta piloto autenticado real. |
| A04 | Docente solo accede a alumnos asignados; excluye empresas personales. Administrador gestiona asignaciones. | Matriz de permisos local aprobada; desplegar reglas. |
| A05 | Registro con contraseña personal; claves temporales independientes y caducidad; cuenta antigua exige recuperación de correo después del corte de seguridad. | Pruebas de política aprobadas; configurar AUTH_POLICY_EPOCH y comprobar correo real. |
| A06 | Formulario empresarial, persistencia idempotente y panel /admin/solicitudes con seguimiento. | Concurrencia/reintento/conflicto probados; falta recepción por responsable en producción. |
| A07 | Ayuda de admisiones funciona sin sesión ni proveedor de IA; tutor privado requiere cuenta habilitada. | Respuestas públicas verificadas localmente; navegador pendiente. |
| A08 | Responsable legal parametrizado; captación se cierra en producción si faltan datos. | Pendiente de Pablo, según instrucción de completar después. |
| A09 | Depreciación en cuenta de gasto; cálculo reconoce registros históricos sin reescribirlos. | Resultado y cierre probados. |
| A10 | Se retiró la escritura alternativa sin auditoría; ausencia de migración impide guardar. | Revisión de contrato; falta integración Supabase real. |
| A11 | Firma de permisos SQL corregida y retirada función antigua sin evidencia. | Falta aplicar/probar migración en ensayo. |
| A12 | Cierre anual impide reabrir un mes del ejercicio cerrado. | Regresión aprobada. |
| A13 | Veinte misiones comerciales con contrato explícito. Escrituras verifican el caso concreto; lecturas se identifican como consultas y no como operaciones ejecutadas. | Contratos/acciones/API probados; falta piloto completo en aula. |
| A14 | sign_up y generate_lead solo tras resultado confirmado, con consentimiento, deduplicación y atribución acotada sin identidad en eventos. | Regresión de privacidad aprobada; falta GTM/GA4 real. |
| A15 | Retirados graduados/vacantes ficticios; postulación exige vacante publicada y constancia vigente validada por servidor. | No se inventaron candidatos ni empleos; requiere contenido real para publicar ofertas. |
| A16 | Preparación académica en una operación atómica, marcador final y repetición idempotente. Apertura nueva conciliada con caja/banco/capital. | Pruebas aprobadas; empresas antiguas parciales necesitan revisión de sus saldos. |
| A17 | Implementados ubicaciones, movimientos, lotes, series y campos de usuario. | Pruebas de capacidad, tipos, recepción/salida, límites y duplicados aprobadas. |
| A18 | Se rechaza comprar activo contra proveedor sin factura/auxiliar; retirada esa opción del formulario. | Alternativa segura probada. Compra a crédito integrada no se presenta como disponible. |
| A19 | Pausa se respeta aunque termine una descarga; cambio de lámina cancela reproducción anterior. | Hook real con descarga/fallo controlados aprobado. |
| A20 | Voz fragmentada, contrato ampliado y aviso de error visible; pruebas usan script_text real. | Todos los textos publicados recorren fragmentación; proveedor real pendiente. |
| A21 | Caso de recuperación calculable con inversión y ahorro supuestos; revisados guiones, rúbricas y presentación comercial. | No se prometen ahorros, plazos ni inmutabilidad absolutos. |
| A22 | Cuotas compartidas en Firestore y límites de historial/texto; secret de voz solo servidor. | Prueba concurrente aprobada; activar TTL. |
| A23 | Intentos y reservas de pregunta transaccionales; concurrencia/versión de pregunta; hash de rúbrica evita reanudar un temario distinto. | Prueba de inicio y respuesta concurrente aprobada. |
| A24 | Webhook firmado registra recepción pendiente, deduplica y responde completed:false. | Regresión aprobada; no se implementa una emisión automática inexistente. |
| A25 | Sitemap desde catálogo; dominio central; llms dinámicos; marca/cifras públicas corregidas. | Dominio definitivo, rastreo e indexación pendientes. |
| A26 | Suite funcional bajo tests/ incluida en npm test; sin depender de scripts ignorados. | 55/55 aprobadas. |
| A27 | Credenciales de laboratorio explícitamente sintéticas. | No son cuentas reales ni credenciales compartidas de producción. |

## Correcciones adicionales descubiertas al integrar

- Las 50 láminas comerciales tenían imágenes con asuntos distintos de su guion. Ahora se presentan con HTML semántico desde el mismo texto narrado. Se actualizaron objetivos, instrucciones y rúbricas del taller; no se exige una operación ficticia para aprobar una consulta.
- Las constancias PDF ya no inventan nota de 100%, horas acreditadas, hash SHA-256, firma de persona o carácter universitario/oficial. Usan datos congelados del servidor; una autoevaluación se identifica como tal y no tiene verificación pública.
- Integridad de Firestore: hash con claves ordenadas para soportar persistencia; comparación con cabecera y secuencia evita aprobar un historial truncado o ausente. SQL también contrasta la última versión con la empresa. La cadena no demuestra ausencia de modificaciones por un administrador de infraestructura ni sustituye una referencia externa confiable.
- Los hashes históricos de Firestore hechos sin orden canónico pueden no revalidarse. No se reescribieron ni se certificaron retroactivamente. Revisar esos expedientes y conservar evidencia antes de cualquier migración o reparación histórica.
- Reglas impiden que credenciales antiguas accedan directamente a la empresa; borradores de vacantes no son públicos. Micrófono permitido solo en la ruta del examen oral, con permiso del navegador.
- Catálogo visible calcula 31 módulos y 124 clases desde la fuente actual. Esto cuenta publicaciones; no acredita que toda la malla haya pasado una evaluación pedagógica independiente.

## Próximos pasos obligatorios antes de invertir

1. Completar las variables de docs/CONFIGURACION_PUBLICACION.md y reconstruir. Los formularios de producción permanecen cerrados hasta tener responsable legal completo.
2. Aplicar reglas/índices/TTL y, si corresponde, migración Supabase en ensayo. Verificar permisos de servicio, transacción, eliminación, idempotencia, cadena íntegra y detección de truncado. Respaldar antes de una modificación de producción.
3. Piloto con dos alumnos de prueba y docente asignado/no asignado: recuperación, Paso 0, prácticas correctas/incorrectas, progreso, examen y constancia. Probar aislamiento en ambas empresas.
4. Revisar portada, Empresas, inscripción y aula en 390/768/1280 px, con teclado, lector y conexión lenta. Comprobar dictado y voz opcionales. Medir rendimiento y accesibilidad de la página final.
5. Comprobar solicitud empresarial en panel y seguimiento por una persona; verificar sign_up/generate_lead en el contenedor real con aceptación y rechazo de analítica.
6. Revisar los materiales y capturas restantes de la malla con el responsable académico antes de publicitar dominio integral del sistema. No se certificó equivalencia universitaria, bachillerato o acreditación externa. Idiomas y refuerzo académico siguen aplazados.
7. Al cerrar estas puertas, retirar informes/mediciones obsoletos según la instrucción de Pablo. Por ahora se conservan como evidencia necesaria y se marcan históricos, sin borrar archivos ajenos.

## Reanudación

Leer este documento y CONFIGURACION_PUBLICACION.md; comprobar git status y HEAD. El código no se subió ni desplegó. No repetir pruebas sin cambios relacionados. No divulgar .env ni datos reales. No marcar producción aprobada por una compilación local. El próximo paso depende de configuración y validación del entorno final, no de prometer una calificación.

## Referencias técnicas consultadas

- Google Search Central: https://developers.google.com/search/docs/fundamentals/creating-helpful-content y https://developers.google.com/search/docs/fundamentals/ai-optimization-guide . Contenido claro y rastreable como base; no se garantiza posición o cita de IA.
- Vercel: https://vercel.com/docs/headers/request-headers . Cabeceras de dirección confiables únicamente bajo el proxy conocido.

## Actualización de publicación autorizada

Pablo autorizó actualizar y publicar el 16-oct. Reglas Firestore publicadas con respaldo previo; las anteriores estaban vencidas desde el 12-oct y bloqueaban el acceso del navegador. Consultas reales de prácticas y evaluaciones comprobadas con identificador inexistente, sin extraer expedientes: ambas funcionan. Gestión de índices/TTL devuelve PERMISSION_DENIED a la credencial disponible y las sesiones abiertas de consola no tienen acceso; no se ampliaron permisos. Las consultas actuales funcionan con los índices existentes.

La migración Supabase fue probada en la base del simulador dentro de BEGIN/ROLLBACK: permisos de service_role/anon, escritura, idempotencia, misión, eliminación y detección de alteración y truncado aprobaron. No quedaron registros de ensayo. Hay respaldo de las funciones anteriores en la carpeta local ignorada de despliegue. Aplicación definitiva coordinada con el despliegue web.

Vercel tiene sesión válida de otra cuenta sin acceso al equipo sinerg-ia2. Se utiliza la integración GitHub que ya publica main en b1-academy; no se crea otro sitio ni se sustituye el dominio pendiente. La configuración legal y GTM sigue deliberadamente pendiente.
