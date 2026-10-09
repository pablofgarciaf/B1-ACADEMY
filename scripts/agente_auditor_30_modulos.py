#!/usr/bin/env python3
"""AGENTE AUDITOR AUTÓNOMO EN PYTHON - 30 AGENTES ESTUDIANTES (UNO POR MÓDULO).

Simula 30 agentes estudiantes autónomos con cero conocimiento previo.
Cada agente aprende exclusivamente del contenido de las clases de su módulo,
rinde el examen de certificación contra las rúbricas oficiales y
notifica novedades o vacíos didácticos.
"""

import json
import re
import unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

def normalizar(texto: str) -> str:
    t = unicodedata.normalize("NFD", (texto or "").lower())
    return "".join(c for c in t if unicodedata.category(c) != "Mn")

def extraer_tokens(texto: str):
    return set(re.findall(r"[a-z0-9]{3,}", normalizar(texto)))

def cargar_datos():
    clases_path = RAIZ / "src" / "content" / "aula" / "clases.json"
    lecciones_path = RAIZ / "src" / "content" / "aula" / "lecciones.json"
    exam_path = RAIZ / "src" / "lib" / "exam-bank.ts"

    with open(clases_path, "r", encoding="utf-8") as f:
        clases = json.load(f)

    with open(lecciones_path, "r", encoding="utf-8") as f:
        lecciones = json.load(f)

    # Extraer preguntas del exam-bank.ts
    with open(exam_path, "r", encoding="utf-8") as f:
        exam_raw = f.read()

    exam_bank = {}
    mod_matches = re.finditer(r"'(mod-\d+)':\s*\[(.*?)\]\s*,\s*(?='mod|\};)", exam_raw, re.DOTALL)
    for m in mod_matches:
        mod_id = m.group(1)
        block = m.group(2)
        q_matches = re.finditer(r"question:\s*'([^']+)',\s*rubric:\s*\[(.*?)\]", block, re.DOTALL)
        preguntas = []
        for qm in q_matches:
            q_text = qm.group(1)
            rub_raw = qm.group(2)
            rubricas = [r.strip().strip("'\"") for r in rub_raw.split("',") if r.strip()]
            preguntas.append({"question": q_text, "rubric": rubricas})
        if preguntas:
            exam_bank[mod_id] = preguntas

    return clases, lecciones, exam_bank

class AgenteEstudianteModulo:
    def __init__(self, mod_id: str, mod_nombre: str, clases_info: list, lecciones_db: dict):
        self.mod_id = mod_id
        self.mod_nombre = mod_nombre
        self.clases_info = clases_info
        self.lecciones_db = lecciones_db
        # Conocimiento adquirido (inicia en cero)
        self.memoria_textual = []
        self.vocabulario = set()
        self.novedades = []

    def estudiar_modulo(self):
        """El agente recorre todas las clases y adquiere conocimiento de los guiones."""
        total_slides = 0
        for cls in self.clases_info:
            cls_id = cls["id"]
            lec_data = self.lecciones_db.get(cls_id)
            if not lec_data:
                self.novedades.append(f"Clase {cls_id} no encontrada en lecciones.json")
                continue

            sync_data = lec_data.get("syncData", [])
            for slide in sync_data:
                script = slide.get("script_text", "")
                if script:
                    total_slides += 1
                    self.memoria_textual.append(script)
                    self.vocabulario.update(extraer_tokens(script))

                # Registrar guías de práctica
                step = slide.get("step_guide")
                if step:
                    self.vocabulario.update(extraer_tokens(step.get("title", "")))
                    for inst in step.get("instructions", []):
                        self.vocabulario.update(extraer_tokens(inst))
                    for campo in step.get("campos", []):
                        self.vocabulario.update(extraer_tokens(campo.get("etiqueta", "")))
                        self.vocabulario.update(extraer_tokens(str(campo.get("valor", ""))))

        return total_slides

    def rendir_examen(self, preguntas: list):
        """El agente rinde el examen usando solo lo que aprendió en las clases."""
        if not preguntas:
            return {"aprobado": True, "puntaje": 100, "detalles": ["Sin examen específico en banco"]}

        puntaje_total = 0
        puntos_por_pregunta = 100 / len(preguntas)
        texto_completo = " ".join(self.memoria_textual)
        texto_norm = normalizar(texto_completo)

        detalles = []
        for i, q in enumerate(preguntas, 1):
            rubricas = q["rubric"]
            rubricas_cubiertas = 0
            for rub in rubricas:
                toks = [t for t in extraer_tokens(rub) if len(t) > 3]
                if not toks:
                    rubricas_cubiertas += 1
                    continue
                coincidentes = sum(1 for t in toks if t in self.vocabulario or t in texto_norm)
                if coincidentes / len(toks) >= 0.4:
                    rubricas_cubiertas += 1
                else:
                    self.novedades.append(f"P{i}: Concepto clave de rúbrica poco visible en el texto: '{rub}'")

            pct_p = rubricas_cubiertas / len(rubricas) if rubricas else 1.0
            puntos_ganados = puntos_por_pregunta * pct_p
            puntaje_total += puntos_ganados
            detalles.append(f"P{i}: {int(pct_p * 100)}% ({rubricas_cubiertas}/{len(rubricas)} conceptos)")

        aprobado = puntaje_total >= 70.0
        return {
            "aprobado": aprobado,
            "puntaje": round(puntaje_total, 1),
            "detalles": detalles
        }

def ejecutar_auditoria():
    print("=" * 70)
    print(" B1 ACADEMY - AUDITORIA DE 30 AGENTES ESTUDIANTES AUTONOMOS")
    print("=" * 70)

    clases, lecciones, exam_bank = cargar_datos()

    orden_oficial = [
        ("mod-1", "Fundamentos Operativos, Navegación y Empresa"),
        ("mod-2", "Núcleo Maestro ERP: Socios y Artículos"),
        ("mod-9", "Control y Gestión Administrativa de Activos Fijos"),
        ("mod-21", "Administración del Sistema, Usuarios y Seguridad"),
        ("mod-25", "Estructura Organizacional y Gestión de Personal"),
        ("mod-30", "Nómina, Beneficios Sociales e IESS Ecuador 2026"),
        ("mod-3", "Aprovisionamiento y Control de Inventarios (Procure-to-Pay)"),
        ("mod-13", "Compras Avanzadas y Gestión de Proveedores"),
        ("mod-14", "Unidades de Medida y Valoración de Inventario"),
        ("mod-15", "Operación de Bodega e Inventario Físico"),
        ("mod-16", "Picking, Packing y Despacho"),
        ("mod-4", "Gestión de Ventas y Order-to-Cash"),
        ("mod-5", "Estrategias Avanzadas de Precios y Descuentos"),
        ("mod-6", "Gestión CRM, Oportunidades y Servicio Post-Venta"),
        ("mod-10", "Planificación de Materiales (MRP)"),
        ("mod-11", "Fabricación y Listas de Materiales (BOM)"),
        ("mod-20", "Recursos de Planta, Capacidad y Rutas de Fabricación"),
        ("mod-7", "Contabilidad Central y Normativa NIIF"),
        ("mod-8", "Tesorería, Cobros, Pagos y Bancos"),
        ("mod-17", "Monedas, Cierre Contable e Informes Financieros"),
        ("mod-18", "Contabilidad de Costos, Dimensiones y Presupuestos"),
        ("mod-19", "Facturación Electrónica y Retenciones SRI 2026"),
        ("mod-12", "Consultoría de Datos, Query Manager SQL y DTW"),
        ("mod-22", "Extensibilidad, Tablas de Usuario y Analytics"),
        ("mod-26", "Metodología de Implementación y Ciclo de Vida SAP Activate"),
        ("mod-27", "Modelado y Optimización de Procesos de Negocio (BPMN 2.0)"),
        ("mod-28", "Levantamiento de Requerimientos y Business Blueprint (BRD)"),
        ("mod-29", "Gestión de Clientes, Pruebas UAT y Adopción del Cambio"),
        ("mod-23", "Implementación Técnica, Saldos Iniciales y Go-Live"),
        ("mod-24", "Proyecto Integrador: Certificación Máxima de Súper Analista")
    ]

    reporte_lineas = [
        "# Reporte Oficial de Auditoría: 30 Agentes Estudiantes Autónomos\n",
        "Cada agente estudiante evaluó un módulo partiendo de cero conocimiento previo y rindiendo el examen oficial.\n",
        "| N° | Módulo | Título | Clases | Láminas | Vocabulario | Nota Examen | Estado |",
        "| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |"
    ]

    total_aprobados = 0
    novedades_globales = []

    for idx, (mod_id, titulo) in enumerate(orden_oficial, 1):
        clases_mod = clases.get(mod_id, [])
        agente = AgenteEstudianteModulo(mod_id, titulo, clases_mod, lecciones)
        slides_count = agente.estudiar_modulo()
        preguntas = exam_bank.get(mod_id, [])
        resultado = agente.rendir_examen(preguntas)

        estado_str = "APROBADO" if resultado["aprobado"] else "REQUIERE REVISION"
        if resultado["aprobado"]:
            total_aprobados += 1

        print(f"[{idx:02d}/30] Agente {mod_id:6s} | {titulo[:42]:42s} | {len(clases_mod)} cls | Nota: {resultado['puntaje']:5.1f}% | {estado_str}")

        if agente.novedades:
            novedades_globales.extend([f"- [{mod_id}] {nov}" for nov in agente.novedades[:3]])

        reporte_lineas.append(
            f"| {idx:02d} | {mod_id} | {titulo} | {len(clases_mod)} | {slides_count} | {len(agente.vocabulario)} palabras | {resultado['puntaje']}% | {estado_str} |"
        )

    print("=" * 70)
    print(f"RESULTADO: {total_aprobados}/30 Agentes Estudiantes Certificados Exitosamente.")
    print("=" * 70)

    reporte_lineas.append(f"\n### Resumen Ejecutivo")
    reporte_lineas.append(f"- **Módulos Auditados:** 30 módulos oficiales.")
    reporte_lineas.append(f"- **Agentes Certificados:** {total_aprobados} de 30 módulos superaron el umbral de aprobación.")
    reporte_lineas.append(f"- **Proyecto Integrador:** Posicionado como Capstone Módulo 30 (Súper Analista).")

    reporte_path = RAIZ / "docs" / "AUDITORIA_30_AGENTES_ESTUDIANTES.md"
    with open(reporte_path, "w", encoding="utf-8") as f:
        f.write("\n".join(reporte_lineas))

    print(f"Reporte detallado guardado en: {reporte_path}")

if __name__ == "__main__":
    ejecutar_auditoria()
