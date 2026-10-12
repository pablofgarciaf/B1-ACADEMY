# Plan de implementación para Claude — lunes 12 de octubre de 2026

**Proyecto:** SAP Academy / Finix ERP.  
**Decisiones del propietario:** pymes ecuatorianas de servicios, comercio, producción y turismo; distintos regímenes, con núcleo contable genérico; integración SRI real en una fase posterior; clases ERP se corrigen en fase separada con Antigravity; el programa de bachillerato será **refuerzo académico**, sin curso certificador ni título.

## Resultado alcanzable del lunes

Entregar una **base técnica y pedagógica versionada** para múltiples programas y un piloto pequeño que funcione. No prometer que en un día existirán todas las mallas universitarias, niveles de inglés y asignaturas de bachillerato revisadas por docentes.

### 1. Preparación y controles de entrada

1. Verificar repositorio, rama, `git status`, archivos sin seguimiento y cambios del 11 de octubre. No sobrescribir el kit local del simulador ni publicar mediante `git push`.
2. Leer `docs/AUDITORIA_INTEGRAL_2026-10-11.md` y el cierre de las correcciones de certificados, trazabilidad, SEO y diseño. Ejecutar `npm test` y `npm run build` antes de cambiar arquitectura. Identificar pruebas que no se ejecutan con `npm test`.
3. Decidir explícitamente si el programa será `ERP`, `Inglés`, `Universidad` o `Refuerzo académico`; que las páginas y credenciales no mezclen identidades.

### 2. Modelo de plataforma, sin duplicar el ERP

Definir un esquema versionado para `programa`, `plan`, `unidad`, `competencia`, `actividad`, `evidencia`, `rúbrica`, `evaluación` y `constancia`. Incluir idioma, país, institución fuente, versión, vigencia, autor, revisor y estado editorial. Migrar primero una muestra representativa, sin alterar las 120 clases ERP ese día. El ERP queda como laboratorio conectado a sus unidades; inglés usa audio/conversación y refuerzo escolar usa ejercicios de asignatura.

Las operaciones del simulador deben seguir separadas del contenido y aisladas por empresa. Diseñar un catálogo de **sector** (servicios, comercio, producción, turismo) y **régimen tributario** con parámetros versionados por fecha, sin duplicar motor contable para cada sector. Mantener documentos SRI y banca claramente marcados como simulados. La trazabilidad de comandos debe quedar activa antes de añadir datos empresariales reales.

### 3. Piloto inglés

Crear un programa piloto de nivel A1 con diagnóstico, una competencia de comprensión, una de producción y una de interacción, criterios observables y revisión humana. El [Marco Común Europeo](https://www.coe.int/en/web/portfolio/the-common-european-framework-of-reference-for-languages-learning-teaching-assessment-cefr-) utiliza niveles A1-C2 y descriptores de capacidad; usarlo para mapear resultados, no para anunciar certificación oficial de dominio. Incluir accesibilidad de audio y transcripción, control de progreso y una evaluación repetible. A1-A2 puede planificarse completo después de validar el piloto.

### 4. Mallas universitarias de Ecuador

Preparar un importador y una plantilla de correspondencia para **una institución, carrera, sede, modalidad y versión de pensum** que el propietario seleccione. Registrar asignatura, resultados de aprendizaje, prerrequisitos, créditos/horas, bibliografía autorizada, evaluación y vínculo a fuente oficial. No publicar una malla con nombre de universidad hasta contrastarla con la versión aprobada de esa institución. El [CES publica la plataforma de proyectos de carreras y programas](https://ppcp.ces.gob.ec/); la enseñanza de apoyo no equivale a otorgar títulos universitarios.

### 5. Refuerzo académico de bachillerato

Etiquetar el producto «Refuerzo académico», sin diploma, título ni promesa de equivalencia. Prototipo por asignatura y grado con diagnóstico, práctica adaptativa, explicación de errores, reporte para estudiante/tutor y revisión docente. Para Ecuador usar la [fuente curricular oficial de bachillerato](https://recursos.educacion.gob.ec/red/curriculo-bachillerato/) y versionar la referencia; el [currículo priorizado de 2025](https://educacion.gob.ec/wp-content/uploads/downloads/2025/07/Curriculo-Priorizado-Bachillerato.pdf) contiene competencias e inserciones que deben verificarse contra la vigencia aplicable. Si se desea apoyo para otro país, abrir otro plan con fuente oficial propia, sin llamar «equivalente» al contenido por semejanza temática.

### 6. Calidad, privacidad y experiencia

- Definir roles de autor, revisor académico, docente, alumno y administrador. Toda publicación de contenido requiere versión y aprobación editorial.
- Separar datos de menores de edad y sus tutores del ERP y de la captación comercial; diseñar flujos y permisos antes de abrir refuerzo académico a menores.
- Aplicar [WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/) como objetivo de accesibilidad, con teclado, foco, contraste, subtítulos/transcripciones y móvil.
- Medir tareas de usuario: encontrar una ruta, iniciar clase, completar ejercicio, entender el feedback y continuar. Guardar datos de medición solo durante la fase de validación; no convertir reportes temporales en documentación permanente.
- En SEO, cada programa público tendrá páginas útiles con temario, público, objetivos, duración y responsables revisados; datos estructurados solo cuando coincidan con contenido visible. [Google indica](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) que el contenido debe servir primero a las personas.

## Secuencia de trabajo del lunes

| Bloque | Entrega | Puerta de aceptación |
|---|---|---|
| 1. Auditoría de entrada | Estado y resultados base | Ningún cambio local perdido; fallos previos identificados. |
| 2. Contrato de datos | Esquema versionado + migración de muestra | ERP existente sigue abriendo y su malla no cambia por accidente. |
| 3. Piloto inglés A1 | Una unidad usable | Evidencia y rúbrica guardadas; tarea repetible en móvil. |
| 4. Plantillas de expansión | Importador universitario y refuerzo escolar | Fuente, institución/país y versión son obligatorios; sin títulos implícitos. |
| 5. Validación | `npm test`, build y recorrido de navegador | Ningún error nuevo; accesibilidad básica y permisos comprobados. |
| 6. Cierre | Lista de cambios, riesgos y decisiones pendientes | Propietario puede revisar cada resultado y priorizar siguientes contenidos. |

## Decisiones que Claude no debe inventar

- Universidad y carrera de la primera malla, incluido año o versión aprobada.
- País y grados del primer piloto de refuerzo escolar; por defecto, proponer Ecuador, 1.º de bachillerato y Matemáticas como **hipótesis para aprobar**.
- Responsables académicos que firman la revisión de contenidos, especialmente idiomas y menores.
- Dominio público definitivo y canal de contacto comercial de la academia.

## Condición de cierre y archivos temporales

Después de corregir y verificar cada defecto, inventariar uno a uno los informes de auditoría, mediciones, capturas y salidas de prueba creadas para esta campaña. Conservar código, pruebas útiles, decisiones de producto y documentación operativa. Retirar los informes temporales únicamente cuando todos sus hallazgos estén cerrados o trasladados al registro de pendientes y se confirme que no son necesarios para investigar una regresión. El propietario pidió este retiro al terminar la corrección, no antes.
