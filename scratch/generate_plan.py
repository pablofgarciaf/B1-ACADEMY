import os
import sys

base = os.path.join("public", "Capacitacion SAP")
dirs = [d for d in os.listdir(base) if os.path.isdir(os.path.join(base, d)) and not d.startswith(('01_', '02_', 'para '))]
dirs.sort()

lines = []
lines.append("# 📚 PLAN MAESTRO: CLASES MAGISTRALES PEDAGÓGICAS SAP BUSINESS ONE (121 MANUALES)\n")
lines.append("> **PROPÓSITO DE ESTE DOCUMENTO:**")
lines.append("> Este archivo es la **única fuente de verdad** y la **bitácora de progreso** para la transformación pedagógica de toda la academia SAP Business One.")
lines.append("> Si en algún momento la sesión se interrumpe o deseas alternar entre modelos de IA (Claude, ChatGPT, Antigravity), puedes copiar este documento íntegro para continuar exactamente en el manual pendiente.\n")
lines.append("---\n")
lines.append("## 🎯 1. Estándar Pedagógico No Negociable (Instrucciones para la IA)\n")
lines.append("Cualquier modelo de IA que elabore las lecciones debe cumplir estas **5 Reglas de Oro**:")
lines.append("1. **Rol del Instructor:** Actúas como un **Consultor Senior y Docente de Élite de SAP Business One**. Explicas la lógica operativa y empresarial detrás de cada módulo.")
lines.append("2. **PROHIBIDO leer números o encabezados mecánicos:** Nunca digas *'Diapositiva 1'*, *'3 Escenario empresarial'*, *'4 Herramientas de servicio'* ni leas el índice.")
lines.append("3. **PROHIBIDO leer viñetas de corrido sin puntuación:** Todo debe enseñarse mediante una narrativa fluida, con ejemplos de negocio (ej. clientes como *OEC Computers*), explicando el *por qué*, el *cómo* y su repercusión contable y operativa.")
lines.append("4. **Puntuación y Prosodia Impecable:** Cada frase debe terminar con su punto (`.`) y estar estructurada con comas para que la voz neuronal realice pausas de respiración y entonación didáctica natural.")
lines.append("5. **Curaduría Visual Inteligente:** Mantener las diapositivas que contengan diagramas de flujo, pantallas del sistema, flujos de documentos y tablas operativas. Cada diapositiva visual seleccionada debe tener entre 20 y 45 segundos de explicación clara.\n")
lines.append("---\n")
lines.append("## 🤖 2. Prompt Maestro para ChatGPT / Claude (Para Retomar Manuales)\n")
lines.append("Si vas a procesar un manual en ChatGPT o Claude, copia y pega el siguiente prompt:\n")
lines.append("```markdown")
lines.append("Eres un Consultor Senior y Docente Titular de SAP Business One.")
lines.append("Vamos a crear la clase magistral para el manual: [NOMBRE_DEL_MANUAL].")
lines.append("Toma como base las diapositivas y el contenido técnico en public/Capacitacion SAP/[NOMBRE_DEL_MANUAL]/.\n")
lines.append("Requisitos para el guion (clase_sync.json):")
lines.append("1. Redacta una explicación pedagógica magistral para cada diapositiva útil (sin leer títulos ni números de slide).")
lines.append("2. Explica la lógica empresarial real (impacto en Libro Mayor, tablas del sistema como OJDT/OITM/OCRD, procesos de negocio).")
lines.append("3. Puntuación perfecta con puntos y comas para pausas humanas del motor de voz.")
lines.append("4. Devuelve únicamente el archivo JSON con este formato:")
lines.append("[")
lines.append("  {")
lines.append('    "slide_index": 1,')
lines.append('    "image_file": "nombre_de_la_imagen.webp",')
lines.append('    "script_text": "Texto didáctico con puntuación perfecta..."')
lines.append("  }")
lines.append("]")
lines.append("```\n")
lines.append("---\n")
lines.append("## ⚙️ 3. Pipeline Técnico de Renderizado\n")
lines.append("Una vez generado el archivo `clase_sync.json` con los textos didácticos para el manual, se ejecuta:")
lines.append("```bash")
lines.append('python scratch/pedagogical_lesson_generator.py --manual "[NOMBRE_DEL_MANUAL]"')
lines.append("```\n")
lines.append("---\n")
lines.append("## 📋 4. Checklist Maestro de los 121 Manuales\n")
lines.append("| # | Código del Manual | Diapositivas | Estado |")
lines.append("| :--- | :--- | :---: | :---: |")

for i, d in enumerate(dirs, 1):
    img_dir = os.path.join(base, d, "Imagenes_Diapositivas")
    num_imgs = len(os.listdir(img_dir)) if os.path.exists(img_dir) else 0
    if num_imgs == 0:
        status = "⚪ Sin diapositivas (Caso Práctico / SQL)"
    else:
        status = "[ ] Pendiente"
    lines.append(f"| {i} | `{d}` | {num_imgs} | {status} |")

lines.append("\n")

os.makedirs("docs", exist_ok=True)
with open("docs/PLAN_MAESTRO_LECCIONES_PEDAGOGICAS.md", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("Plan maestro escrito exitosamente.")
