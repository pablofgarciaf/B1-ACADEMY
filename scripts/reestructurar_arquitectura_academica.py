#!/usr/bin/env python3
"""Script para reestructurar las clases y lecciones del curriculum académico a 30 módulos."""

import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# 1. Actualizar clases.json
clases_path = RAIZ / "src" / "content" / "aula" / "clases.json"
with open(clases_path, "r", encoding="utf-8") as f:
    clases = json.load(f)

clases["mod-25"] = [
    {
        "id": "mod25-c1",
        "number": 1,
        "title": "Ficha del Empleado, Estructura Organizacional y Costo Laboral",
        "description": "Alta de empleados, datos personales, organigrama y asignación de cargos.",
        "durationMinutes": 15
    },
    {
        "id": "mod25-c2",
        "number": 2,
        "title": "Gestión de Contratos, Ausencias y Políticas Salariales",
        "description": "Contratos laborales, permisos, licencias y comisiones por ventas.",
        "durationMinutes": 14
    },
    {
        "id": "mod25-c3",
        "number": 3,
        "title": "Evaluación de Desempeño, Finiquito y Salida del Personal",
        "description": "Actas de finiquito, causales de terminación y liquidación laboral.",
        "durationMinutes": 16
    }
]

clases["mod-30"] = [
    {
        "id": "mod30-c1",
        "number": 1,
        "title": "Rol de Pagos: Sueldo, Horas Extras y Descuentos",
        "description": "Cálculo de sueldo neto, horas extras al 50% y 100%, anticipos y deducciones.",
        "durationMinutes": 14
    },
    {
        "id": "mod30-c2",
        "number": 2,
        "title": "Décimos, Fondos de Reserva y Provisiones de Ley",
        "description": "Cálculo y mensualización de décimo tercero, décimo cuarto y fondos de reserva.",
        "durationMinutes": 12
    },
    {
        "id": "mod30-c3",
        "number": 3,
        "title": "Contabilidad de la Nómina y Liquidación de Aportes al IESS",
        "description": "Asiento contable centralizado, planillas IESS y archivo bancario de acreditación.",
        "durationMinutes": 18
    }
]

with open(clases_path, "w", encoding="utf-8") as f:
    json.dump(clases, f, ensure_ascii=False, indent=2)

print("OK: clases.json actualizado con mod-25 y mod-30")

# 2. Actualizar lecciones.json
lecciones_path = RAIZ / "src" / "content" / "aula" / "lecciones.json"
with open(lecciones_path, "r", encoding="utf-8") as f:
    lecciones = json.load(f)

# Replicar datos para mod30-c1, mod30-c2, mod30-c3
if "mod25-c2" in lecciones and "mod30-c1" not in lecciones:
    lec1 = dict(lecciones["mod25-c2"])
    lec1["classId"] = "mod30-c1"
    lec1["title"] = "Rol de Pagos: Sueldo, Horas Extras y Descuentos"
    lecciones["mod30-c1"] = lec1

if "mod25-c3" in lecciones and "mod30-c2" not in lecciones:
    lec2 = dict(lecciones["mod25-c3"])
    lec2["classId"] = "mod30-c2"
    lec2["title"] = "Décimos, Fondos de Reserva y Provisiones de Ley"
    lecciones["mod30-c2"] = lec2

if "mod25-c4" in lecciones and "mod30-c3" not in lecciones:
    lec3 = dict(lecciones["mod25-c4"])
    lec3["classId"] = "mod30-c3"
    lec3["title"] = "Contabilidad de la Nómina y Liquidación de Aportes al IESS"
    lecciones["mod30-c3"] = lec3

with open(lecciones_path, "w", encoding="utf-8") as f:
    json.dump(lecciones, f, ensure_ascii=False, indent=2)

print("OK: lecciones.json actualizado con mod30-c1, mod30-c2, mod30-c3")
