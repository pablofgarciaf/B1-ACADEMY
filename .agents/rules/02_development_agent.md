---
trigger: always_on
description: Reglas del Agente de Desarrollo, Ejecución Técnica y Políticas de Control de Versiones
---

# 💻 AGENTE DE DESARROLLO Y EJECUCIÓN TÉCNICA (Development Agent)

Este agente es responsable de **escribir el código, realizar refactorizaciones y ejecutar las soluciones técnicas** con precisión de ingeniería, siguiendo estrictamente los límites de seguridad y control del proyecto.

---

## 🛑 1. Regla de Oro de Git y Despliegues (NO PUSH AUTOMÁTICO)

1. **PROHIBIDO hacer `git push` de forma autónoma.**
2. Todo cambio debe:
   - Desarrollarse y probarse localmente.
   - Compilarse mediante `npm run build` para validar 0 errores de TypeScript y linting.
   - Presentarse al usuario con su respectivo **Scorecard de Calidad A+**.
3. **El `git push` solo se ejecutará cuando el usuario responda explícitamente con su aprobación** (ej. *"haz push"*, *"adelante"*, *"sube los cambios"*).

---

## 🛡️ 2. Regla de Aislamiento de Módulos (Separación de Ecosistemas)

El proyecto cuenta con 3 zonas independientes:
1. **Sitio Público (`src/app/` raíz, `src/app/blog`, `src/app/servicios`, `src/components/site`)**: Enfocado en conversión, diseño premium, SEO y GEO.
2. **Panel Admin (`src/app/admin`)**: Gestión interna, modo oscuro nativo, reportes, métricas.
3. **Aplicación Inspection (`src/app/inspection`)**: Aplicación de campo para inspectores (offline-first, formularios, cámara, GPS, firmas).

**Norma Estricta:**
- Si una tarea es de la web pública, **NUNCA** modificar archivos en `src/app/admin` ni `src/app/inspection`.
- Nunca alterar dependencias o componentes rígidos como `StableInput.tsx` (usar CSS Arbitrary Variants desde el contenedor).

---

## 🎨 3. Reglas de Estilo y Código Limpio

1. **Uso Exclusivo de Tailwind CSS:**
   - Prohibido agregar atributos `style={{ ... }}` en componentes visuales.
   - Prohibido agregar bloques `<style jsx>` en componentes React.
   - Cualquier animación personalizada compleja debe definirse como keyframe en [`globals.css`](file:///c:/Users/pablo/Energyengine/src/app/globals.css) o `tailwind.config.ts`.

2. **Micro-interacciones y UI:**
   - Botones interactivos deben incluir `active:scale-95 transition-all`.
   - Modales deben usar `backdrop-blur` y fondos semitransparentes acordes a la paleta oficial (`#131a20` y `#19222a` en modo oscuro).

---

## 🧪 4. Verificación Local Obligatoria (Pre-Flight Check)

Antes de reportar cualquier tarea como lista al usuario, el agente debe:
1. Validar que no haya imports huérfanos ni errores de TypeScript.
2. Ejecutar `npm run build` para certificar que el empaquetado y generación de páginas estáticas termine con código de salida `0`.
3. Verificar que el rendimiento móvil y de escritorio no sufra degradación.
