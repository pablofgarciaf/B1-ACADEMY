# 🏛️ Campus Universitario & Escuela SAP Business One 10.0 (HANA)

El Campus Universitario (`/campus`) es el nuevo núcleo formativo de élite de la academia, superando la anterior estructura de 5 tracks genéricos para consolidar una **Escuela Profesional y Universitaria** con 4 Carreras de Especialización, 12 Micro-certificaciones por hitos operativos y un modelo de habilitación docente.

---

## 🗺️ Mapa de Arquitectura Curricular

```mermaid
graph TD
    A[Campus Universitario SAP B1] --> B[Carrera 1: Fundamentos & Núcleo ERP]
    A --> C[Carrera 2: Finanzas NIIF & Tesorería]
    A --> D[Carrera 3: Logística & Cadena de Suministro]
    A --> E[Carrera 4: Planificación MRP & Consultoría]

    B --> M1[MC-01: Navegación & Cockpit Fiori]
    B --> M2[MC-02: Maestros OCRD/OITM & Precios]

    C --> M3[MC-03: Contabilidad NIIF & G/L]
    C --> M4[MC-04: Bancos, Pagos & Conciliaciones]
    C --> M5[MC-05: Activos Fijos & Depreciación]
    C --> M6[MC-06: Costos & Presupuestos]

    D --> M7[MC-07: Ciclo Order-to-Cash Ventas]
    D --> M8[MC-08: Ciclo Procure-to-Pay Compras]
    D --> M9[MC-09: Ubicaciones Bins & Lotes]
    D --> M10[MC-10: Valoración Stock & Landed Costs]

    E --> M11[MC-11: MRP, BOM & Fabricación]
    E --> M12[MC-12: Consultoría SQL, UDF & DTW]

    M1 & M2 --> DIP1[Diploma Operador de Negocios]
    M3 & M4 & M5 & M6 --> DIP2[Diploma Especialista Financiero]
    M7 & M8 & M9 & M10 --> DIP3[Diploma Especialista en Logística]
    M11 & M12 --> DIP4[Diploma Consultor de Implementación]

    DIP1 & DIP2 & DIP3 & DIP4 --> MAST[🏆 Certificación Master: Consultor Asociado SAP B1]
    MAST --> DOC[👨‍🏫 Acreditación Docente Universitaria]
```

---

## 🎖️ Sistema de Acreditación & Monetización de Títulos Oficiales

Cada título emitido en el campus se procesa mediante el motor de alta resolución jsPDF (`[[11_Master_B1_Tutor_IA]]`) e incluye:
1. **Firmas de Responsabilidad:**
   - Director Académico y de Certificaciones (*Ing. Pablo García*).
   - Comité Técnico Evaluador y Red de Consultoría SAP (*Master B1 & Lead Consultants*).
2. **Código de Validación Oficial:** Código alfanumérico único (ej. `B1-MIC-9AB21C-2026`).
3. **Hash Criptográfico SHA-256:** Evidencia anti-adulteración.
4. **Enlace de Validación Pública:** Accesible por reclutadores y universidades en `https://b1academy.org/verificar/[CODE]`.
5. **Sello Oficial en Oro B1 Verified.**

---

## 👨‍🏫 Programa "Train the Trainer" (Docencia Universitaria)

El Campus cuenta con un selector de perfil para alternar entre:
- **Estudiante / Profesional:** Foco en la asimilación técnica, resolución de retos en el simulador y obtención de micro-credenciales.
- **Docente Universitario:** Vista para catedráticos con:
  - Requisitos de habilitación como *Docente Catedrático Especialista* (1 carrera aprobada al 90%+).
  - Requisitos de habilitación como *Docente Titular Master B1* (121 manuales + simulador integral).
  - Guías didácticas oficiales generadas por Master B1.
  - Banco de casos de estudio empresariales.

---

## 🔗 Enlaces Relacionados (Obsidian Vault)

- [[11_Master_B1_Tutor_IA]] - Especificación de la IA residente Master B1 y checkpoints interactivos.
- [[06_LMS_Architecture]] - Arquitectura general del LMS.
- [[06_Manuales]] - Catálogo e índice de los 121 manuales técnicos.
- [[09_Simulador_Integral_Desktop]] - Simulador integral de escritorio SAP B1 y atlas visual.
