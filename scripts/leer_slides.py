import json
from pathlib import Path
for p in ["M01-L01_Que_es_un_ERP", "M01-L02_El_escritorio_de_SAP_B1"]:
    d = json.loads(Path("public/Aula_SAP/M01_Primer_contacto_con_SAP_B1/"+p+"/leccion.json").read_text(encoding="utf-8"))
    for b in d.get("bloques", []):
        for diap in b.get("diapositivas", []):
            print(diap["archivo"])
            print("TITLE:", diap.get("titulo_en_pantalla"))
            print("POINTS:", diap.get("puntos_en_pantalla"))
            print("---")
