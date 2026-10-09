#!/usr/bin/env python3
"""Actualizar malla.json con 30 módulos y las 14 carreras oficiales ordenadas."""

import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
malla_path = RAIZ / "src" / "content" / "malla" / "malla.json"

with open(malla_path, "r", encoding="utf-8") as f:
    malla = json.load(f)

malla["resumen"]["modulos"] = 30
malla["resumen"]["carreras"] = 14

carreras = [
    {
        "id": "C01",
        "name": "Asistente de Compras e Inventarios",
        "modules": ["M01", "M02", "M03", "M13", "M14"]
    },
    {
        "id": "C02",
        "name": "Jefe de Bodega y Logística",
        "modules": ["M01", "M02", "M03", "M15", "M16"]
    },
    {
        "id": "C03",
        "name": "Ejecutivo Comercial y Ventas",
        "modules": ["M01", "M02", "M04", "M05"]
    },
    {
        "id": "C04",
        "name": "Especialista en CRM y Post-Venta",
        "modules": ["M01", "M02", "M04", "M06"]
    },
    {
        "id": "C05",
        "name": "Asistente Contable NIIF",
        "modules": ["M01", "M02", "M07", "M17", "M19"]
    },
    {
        "id": "C06",
        "name": "Especialista en Tesorería y Cobranzas",
        "modules": ["M01", "M07", "M08", "M19"]
    },
    {
        "id": "C07",
        "name": "Analista de Costos y Presupuestos",
        "modules": ["M09", "M14", "M07", "M18"]
    },
    {
        "id": "C08",
        "name": "Planificador de Producción (MRP)",
        "modules": ["M02", "M10", "M11", "M20"]
    },
    {
        "id": "C09",
        "name": "Gestión Administrativa y Control de Activos Fijos",
        "modules": ["M01", "M02", "M09", "M21"]
    },
    {
        "id": "C10",
        "name": "Especialista en Talento Humano y Nómina",
        "modules": ["M01", "M02", "M25", "M30"]
    },
    {
        "id": "C11",
        "name": "Consultor Comercial y Preventa SAP B1",
        "modules": ["M01", "M02", "M04", "M05", "M06", "M12"]
    },
    {
        "id": "C12",
        "name": "Administrador del Sistema SAP B1 (Key User)",
        "modules": ["M01", "M21", "M12", "M22"]
    },
    {
        "id": "C13",
        "name": "Consultor de Implementación ERP",
        "modules": ["M21", "M12", "M23", "M24"]
    },
    {
        "id": "C14",
        "name": "Consultor Funcional y Business Analyst SAP B1",
        "modules": ["M01", "M02", "M26", "M27", "M28", "M29"]
    }
]

malla["carreras"] = carreras

# Asegurar existencia de M30 en modulos de malla
modulos = malla.get("modulos", [])
if not any(m.get("id") == "M30" or m.get("modKey") == "mod-30" for m in modulos):
    modulos.append({
        "id": "M30",
        "modKey": "mod-30",
        "number": 6,
        "name": "Nómina, Beneficios Sociales e IESS Ecuador 2026",
        "clasesCount": 3,
        "manuals": [
            { "number": 1, "id": "mod30-c1", "title": "Rol de Pagos: Sueldo, Horas Extras y Descuentos" },
            { "number": 2, "id": "mod30-c2", "title": "Décimos, Fondos de Reserva y Provisiones de Ley" },
            { "number": 3, "id": "mod30-c3", "title": "Contabilidad de la Nómina y Liquidación de Aportes al IESS" }
        ]
    })
malla["modulos"] = modulos

with open(malla_path, "w", encoding="utf-8") as f:
    json.dump(malla, f, ensure_ascii=False, indent=2)

print("OK: malla.json sincronizado con 30 modulos y 14 carreras")
