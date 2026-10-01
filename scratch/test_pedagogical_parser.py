import re

def refine_pedagogical_text(raw_text, slide_num, total_slides, module_name=""):
    text = raw_text.strip()
    
    # 1. Eliminar cabeceras, marcas de agua y números de diapositiva
    text = re.sub(r'^\s*\d+\s*', '', text)
    text = re.sub(r'^\s*PUBLIC\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'PUBLIC', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Diapositiva\s*\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide\s*\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'SAP Business One Versión \d+\.\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'©\s*\d{4}.*?All rights reserved\.?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\b\d+\s*$', '', text) # número al final de la lámina
    
    # 2. Manejo inteligente de viñetas
    # Convertir viñetas en saltos de línea limpios
    text = re.sub(r'[•\*\-\#_\|]', '\n', text)
    
    # 3. Separar líneas y eliminar duplicados o fragmentos
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    
    cleaned_items = []
    seen = set()
    
    for l in lines:
        # Limpiar números al inicio de línea (ej: "3 Escenario" -> "Escenario")
        l = re.sub(r'^\d+\s*', '', l).strip()
        if not l or len(l) < 5:
            continue
            
        # Detectar frases individuales
        sub_phrases = re.split(r'(?<=[.!?])\s+', l)
        for sp in sub_phrases:
            sp = sp.strip()
            if not sp or len(sp) < 8:
                continue
            # Normalizar para detectar duplicados
            norm = re.sub(r'[^\w\s]', '', sp.lower()).strip()
            norm = re.sub(r'\s+', ' ', norm)
            if norm in seen:
                continue
            seen.add(norm)
            
            # Asegurar capitalización correcta
            sp = sp[0].upper() + sp[1:]
            if not sp.endswith(('.', ':', '!', '?')):
                sp += '.'
            cleaned_items.append(sp)

    if not cleaned_items:
        return f"En esta diapositiva analizamos la configuración técnica, flujo de documentos y reglas de negocio aplicables a {module_name} en SAP Business One."

    # 4. Formulación pedagógica según el tipo de lámina
    first_item = cleaned_items[0].lower()
    
    # Caso 1: Portada
    if slide_num == 1:
        intro = f"Bienvenidos a esta clase sobre {module_name}. En esta lección exploraremos las mejores prácticas de consultoría, flujos operativos y la arquitectura del sistema en SAP Business One."
        rest = " ".join([it for it in cleaned_items if "bienvenido" not in it.lower() and "tema" not in it.lower()][:2])
        return f"{intro} {rest}".strip()

    # Caso 2: Objetivos
    if "objetivos" in first_item or "al finalizar" in first_item or "podrá" in first_item:
        intro = "Al finalizar esta lección, serás capaz de dominar los siguientes aspectos clave:"
        bullets = [it for it in cleaned_items if "objetivos" not in it.lower()]
        body = " ".join(bullets)
        return f"{intro} {body}".strip()

    # Caso 3: Resumen / Conclusión
    if "resumen" in first_item or "conclusión" in first_item or "gracias" in first_item or slide_num == total_slides:
        intro = "Como resumen y puntos clave de esta sesión:"
        body = " ".join(cleaned_items)
        return f"{intro} {body}".strip()

    # Caso General: Unir con puntuación y conectores
    narrative = " ".join(cleaned_items)
    
    # Limpieza final de signos dobles
    narrative = re.sub(r':\s*\.', ':', narrative)
    narrative = re.sub(r'\.\s*\.', '.', narrative)
    narrative = re.sub(r'\s+', ' ', narrative).strip()
    
    return narrative

if __name__ == "__main__":
    with open("public/Capacitacion SAP/10_Service_11_CSProcess_Process_ES/10_Service_11_CSProcess_Process_ES_slides.md", encoding="utf-8", errors="ignore") as f:
        text = f.read()
    parts = text.split("## Diapositiva ")
    
    print("=== SLIDE 3 ===")
    print(refine_pedagogical_text(parts[3], 3, len(parts)-1, "Gestión de Llamadas de Servicio"))
    print("\n=== SLIDE 4 ===")
    print(refine_pedagogical_text(parts[4], 4, len(parts)-1, "Gestión de Llamadas de Servicio"))
