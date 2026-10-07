#!/usr/bin/env python3
"""
Aplica las reglas vigentes del generador a todos los borradores de scratch/aula_es sin volver a llamar al modelo:
rutas reales del menú, campos reales, "ventana = práctica", validador normativo y nombre de la empresa del curso.
Los borradores que no pasan quedan en scratch/cola_regenerar.txt para regenerarlos.

  py -3 scripts/aula/revalidar_borradores.py
"""
import copy
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
sys.argv = sys.argv[:1]
sys.path.insert(0, str(Path(__file__).parent))
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "manuales"))
import generar_clases as g  # noqa: E402

RAIZ = Path(__file__).resolve().parents[2]
REEMPLAZOS = [(r"Distribuidora Andina Tech S\.A\.", "B1 Center"), (r"Distribuidora Andina Tech", "B1 Center"),
              (r"Distribuidora Andina S\.A\.S\.", "B1 Center"), (r"Distribuidora Andina", "B1 Center"),
              (r"AndinaTech_Demo", "B1Center_Demo"), (r"Andina Tech", "B1 Center")]
# Clases revisadas y escritas a mano: solo se les aplica el cambio de nombre.
A_MANO = {"mod1-c1", "mod1-c2", "mod1-c3", "mod1-c4"}


def main():
    validos, cola, practicas = 0, [], 0
    for m in g.PLAN["modulos"]:
        for c in m["clases"]:
            p = RAIZ / "scratch" / "aula_es" / c["id"] / "clase.json"
            if not p.exists():
                cola.append(c["id"])
                continue
            texto = p.read_text(encoding="utf-8")
            for a, b in REEMPLAZOS:
                texto = re.sub(a, b, texto)
            datos = json.loads(texto)
            if c["id"] not in A_MANO:
                lam, motivo = g.valida(copy.deepcopy(datos), g.rutas_permitidas(m, c))
                if not lam:
                    cola.append(c["id"])
                    print(f"  ✗ {c['id']}: {motivo}")
                    continue
                datos["laminas"] = lam
            p.write_text(json.dumps(datos, ensure_ascii=False, indent=2), encoding="utf-8")
            validos += 1
            practicas += sum(isinstance(x.get("practica"), dict) for x in datos["laminas"])
    (RAIZ / "scratch" / "cola_regenerar.txt").write_text(" ".join(cola), encoding="utf-8")
    print(f"Borradores válidos: {validos} · prácticas reales: {practicas} · por regenerar: {' '.join(cola) or 'ninguno'}")


if __name__ == "__main__":
    main()
