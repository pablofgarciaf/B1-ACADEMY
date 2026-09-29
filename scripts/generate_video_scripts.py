import os
from pathlib import Path

def generate_script(markdown_text, title):
    return f"""# Guion de Video: {title}

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: {title}.

## Contenido Principal (Visual: Diapositivas correspondientes)
{markdown_text}

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
"""

def main():
    source_dir = Path("public/Capacitacion_SAP_Markdowns_Limpios")
    target_dir = Path("public/Video_Scripts")
    
    if not target_dir.exists():
        target_dir.mkdir(parents=True)
    
    count = 0
    for filename in os.listdir(source_dir):
        if filename.endswith(".md"):
            filepath = source_dir / filename
            with open(filepath, "r", encoding="utf-8") as f:
                text = f.read()
            
            title = filename.replace(".md", "").replace("_", " ")
            script_content = generate_script(text, title)
            
            target_filepath = target_dir / filename
            with open(target_filepath, "w", encoding="utf-8") as f:
                f.write(script_content)
            
            print(f"Generado guion para: {filename}")
            count += 1
            
    print(f"\nTotal guiones generados: {count}")

if __name__ == "__main__":
    main()
