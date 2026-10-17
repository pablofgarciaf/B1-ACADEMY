# Auditoría vigente — Finix Academy

Última comprobación: 17 de octubre de 2026. Aplicación verificada: `c83ea34`.
Sitio: https://b1-academy.vercel.app/.
Este documento resume la última auditoría y sustituye los informes y planes anteriores. La limpieza documental no supone nuevas pruebas del producto.

## Qué falta para invertir en publicidad

1. **Dominio y datos legales:** completar la configuración pendiente y habilitar la recepción de inscripciones y solicitudes.
2. **Un curso listo para vender:** revisar sus clases, prácticas y evaluación; probarlo completo con un alumno. Adaptar los materiales heredados que describen otro ERP.
3. **Captación y medición:** comprobar una inscripción y una solicitud empresarial completas, su recepción y el registro de la conversión con el consentimiento correspondiente.
4. **Cierre operativo:** completar la retención automática de registros, recuperación de cuentas, restauración de respaldos y supervisión de errores.

**Decisión actual:** todavía no iniciar campañas de captación. Los formularios públicos permanecen cerrados hasta completar los datos legales, que Pablo proporcionará después.

## Qué quedó corregido y verificado

- Acceso al expediente por su propietario; prácticas y progreso requieren evidencia del servidor.
- Separación de empresas, preparación inicial y persistencia comprobadas con dos alumnos sintéticos; datos de ensayo eliminados.
- Reglas Firestore publicadas y migración Supabase de trazabilidad aplicada y comprobada.
- Correcciones contables de depreciación, cierres y controles de inventario; registro de operaciones y detección de alteraciones/truncado probados.
- Índice reconstruido con 2.271 imágenes reales de 120 manuales; diez capturas iniciales corregidas y 23 categorías coherentes con el catálogo.
- Metadatos, enlaces canónicos, sitemap, marca y cabecera móvil corregidos.
- Narración pública comprobada: HTTP 200, MP3 de 139.824 bytes y duración visible de 23,304 segundos.
- Autoevaluaciones locales distinguidas de las constancias registradas; manuales heredados identificados como material de referencia.

## Evidencia y límites

- 59 pruebas funcionales aprobadas, además de lint, tipos y compilación de 166 páginas.
- Diez comprobaciones del piloto real aprobadas tras actualizar dependencias, incluida su limpieza.
- Cero avisos conocidos en dependencias de producción al ejecutar `npm audit --omit=dev`.
- Persisten siete alertas altas en herramientas de compilación por `braces` y sus consumidores. No se identificó un flujo de patrones de visitantes hacia esas herramientas. No se declara cero vulnerabilidades globales. Aviso: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm.
- La administración de índices/retención automática de Firestore devuelve `PERMISSION_DENIED` con los accesos disponibles; las consultas comprobadas funcionan con los índices existentes.
- Pendientes dominio, identidad legal y contenedor analítico reales. Configuración: [CONFIGURACION_PUBLICACION.md](CONFIGURACION_PUBLICACION.md).
- No se ha validado pedagógicamente toda la malla ni realizado un rediseño completo de todas las secciones.
- El simulador conserva alcance educativo; no está certificado para llevar la contabilidad oficial de empresas ni emitir documentos fiscales reales.
- No hay acreditación educativa externa, garantía de empleo ni garantía de posicionamiento en buscadores o respuestas de IA.

## Continuidad

Cerrar los cuatro puntos de inversión anteriores y comprobar los recorridos finales en el dominio definitivo. Conservar este documento como único informe vigente y actualizarlo cuando exista nueva evidencia.
