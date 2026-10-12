# Encargo para Antigravity: auditoría y corrección de la formación ERP

**Estado:** preparado para ejecutar después de la fase actual. Este documento no autoriza a cambiar clases hoy.

## Texto para entregar a Antigravity

Trabaja en `C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy`. Verifica primero el repositorio, la rama, el estado de Git y los materiales sin seguimiento; conserva el trabajo local. Tu objetivo es **demostrar que cada ruta forma una competencia operativa verificable en el simulador educativo**, sin afirmar acreditación externa, preparación laboral garantizada ni dominio de un proceso que no pueda probarse.

### Fuentes que debes confrontar

- Malla vigente: `docs/12_Malla_Curricular.md`, `src/content/malla/malla.json`, `src/lib/curriculum-data.ts`.
- Clases y lecciones: `src/content/aula/clases.json`, `src/content/aula/lecciones.json`, imágenes referidas en `public/`.
- Evaluación: `src/lib/exam-bank.ts`, `src/lib/practice-check.ts`, `src/app/api/practice/route.ts`, `src/app/api/progress/route.ts`, `src/app/api/oral-exam/route.ts`, `src/app/api/certificates/issue/route.ts`.
- Otras rutas de conocimiento: `public/llms-full.txt`, `public/Manual_Maestro_Consolidado_SAP_Business_One_10.md`, `docs/PLAN_MAESTRO_LECCIONES_PEDAGOGICAS.md`, `docs/06_LMS_Architecture.md`, `docs/09_Simulador_Integral_Desktop.md`, `docs/10_Campus_Escuela_SAP_B1.md`.
- Biblioteca metodológica: `C:\Users\pablo\Documents\AI-Skills-Unificadas-2026-10-08\skills\agency-corporate-training-designer\SKILL.md`. Úsala como guía de diseño, no como prueba de calidad.

### Defectos ya identificados que debes reproducir y resolver

1. Las lecciones `mod6-c1`, `mod6-c2` y `mod6-c3` de nómina enlazan imágenes de `mod25-c2..c4`, que son de consultoría. Hay siete referencias a imágenes inexistentes. Identifica las rutas exactas, crea o selecciona materiales correctos y comprueba visualmente lámina, narración y texto sincronizados.
2. Los 120 campos `quizQuestions` de lección están vacíos, mientras la malla afirma que cada clase exige un cuestionario con 90 %. Decide con evidencia si se implementará evaluación por clase o se corregirá la promesa curricular; mantén un criterio único visible y ejecutable.
3. `POST /api/progress` permite al alumno marcar clase terminada sin actividad demostrada. El examen oral exige clases marcadas, pero no verifica prácticas aprobadas. El certificado hereda esa debilidad. Haz que la decisión de avance y emisión dependa de evidencia del servidor.
4. La práctica conectada puede aprobarse por cualquier registro reciente del mismo usuario; vincúlala a empresa, clase, misión, operación, documento y criterios esperados. Una credencial cualquiera de dos caracteres no debe considerarse una tarea completada.
5. 114 de 120 descripciones breves de clase están vacías. Redacta resultados de aprendizaje observables, prerrequisitos, duración estimada y qué podrá hacer el alumno al finalizar, revisados por un especialista funcional.
6. Distingue las representaciones de malla (`curriculum-data.ts`, `modules-data.ts`, `malla-curricular.ts`): programa, rutas y credenciales propias de cada una. Verifica que no haya cifras contradictorias entre portada, capacitación, aula y documentos.

### Método de revisión

Para cada módulo, construye una matriz **objetivo → explicación → demostración → práctica → evidencia → criterio → evaluación → certificado**. Recorre las 120 clases y registra cobertura y defectos por módulo. Usa casos de pymes ecuatorianas de servicios, comercio, producción y turismo; marca los parámetros tributarios por régimen y fecha, sin presentar la simulación como emisión real ante SRI. Revisa ortografía, narración, láminas y accesibilidad. Prioriza los errores que impiden al alumno aprender o aprobar con justicia.

Ejecuta un piloto de flujo completo con cuentas de prueba: alumno sin actividad, alumno con solo lectura, alumno que falla práctica, alumno que aprueba práctica y examen, y usuario de otra empresa. Comprueba tanto lo que debe permitirse como lo que debe rechazarse. Evita alterar cuentas o datos reales.

### Entregables y aceptación

- Matriz de las 120 clases con estado y evidencia; lista de defectos por prioridad.
- Materiales corregidos y validación visual de nómina.
- Política única de avance y certificación implementada en servidor, con pruebas que impidan atajos.
- Rúbricas por rol y al menos un caso integrador validado de principio a fin antes de declarar una ruta lista.
- Construcción de producción, pruebas automatizadas pertinentes y recorrido manual de aula, narración, práctica y certificado.
- Informe final con límites honestos: qué perfiles puede preparar la academia, qué procesos aún no cubre y qué revisión humana externa falta.

No borres los informes de auditoría hasta que las correcciones estén implementadas, probadas y resumidas en un registro de cierre. Al final, presenta inventario de archivos temporales de auditoría para retirarlos de forma controlada, conservando únicamente documentación funcional vigente y evidencia necesaria de cambios.
