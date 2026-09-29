import os
import docx
from pathlib import Path

def extract_text_from_docx(docx_path):
    try:
        doc = docx.Document(docx_path)
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        return '\n'.join(full_text)
    except Exception as e:
        print(f"Error reading {docx_path}: {e}")
        return ""

def main():
    source_dir = Path("public/Capacitacion_SAP_Todos_Los_Markdowns")
    target_dir = Path("public/Capacitacion_SAP_Markdowns_Limpios")
    
    if not target_dir.exists():
        target_dir.mkdir(parents=True)
    
    count = 0
    for filename in os.listdir(source_dir):
        if filename.endswith(".md.docx"):
            filepath = source_dir / filename
            text = extract_text_from_docx(filepath)
            
            # Limpiar nombre
            new_filename = filename.replace(".md.docx", ".md")
            target_filepath = target_dir / new_filename
            
            with open(target_filepath, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"Extracted: {new_filename}")
            count += 1
            
    print(f"\nTotal files processed: {count}")

if __name__ == "__main__":
    main()
