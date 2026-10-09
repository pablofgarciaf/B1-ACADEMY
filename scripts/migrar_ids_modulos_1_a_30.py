#!/usr/bin/env python3
"""MIGRACIÓN TOTAL: ALINEACIÓN 1:1 DE ID DE MÓDULO, NÚMERO Y ARCHIVOS (1 AL 30).

Garantiza que Módulo N tenga SIEMPRE id='mod-N', clases 'modN-c1', 'modN-c2', etc.,
y carpetas en public/aula/modN-c1.
"""

import json
import os
import re
import shutil
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

MAPEO = [
    # (old_id, new_id, new_num, bloque, badge, titulo, cert_titulo, descripcion)
    ("mod-1",  "mod-1",  1,  "Administración y Talento Humano", "Core ERP",
     "Fundamentos Operativos, Navegación y Empresa",
     "Certificado en Navegación y Operación de SAP Business One",
     "Inducción integral: entorno SAP Business One 10.0, escritorio, Cockpit, parametrizaciones de usuario y empresa de práctica."),

    ("mod-2",  "mod-2",  2,  "Administración y Talento Humano", "Master Data",
     "Núcleo Maestro ERP: Socios y Artículos",
     "Certificado en Datos Maestros de Socios y Artículos",
     "Gestión de socios de negocio, clientes, proveedores, artículos, unidades de medida y determinación de precios."),

    ("mod-9",  "mod-3",  3,  "Administración y Talento Humano", "Activos Fijos",
     "Control y Gestión Administrativa de Activos Fijos",
     "Certificado en Gestión Administrativa de Activos Fijos y Depreciación",
     "Custodia patrimonial, clases de activos, alta, plaqueo, amortización, depreciación y bajas de bienes de uso."),

    ("mod-21", "mod-4",  4,  "Administración y Talento Humano", "Administración",
     "Administración del Sistema, Usuarios y Seguridad",
     "Certificado en Administración del Sistema y Seguridad SAP B1",
     "Gestión de usuarios y licencias, autorizaciones por rol, pistas de auditoría, numeración de documentos y formatos de impresión."),

    ("mod-25", "mod-5",  5,  "Administración y Talento Humano", "Gestión RRHH",
     "Estructura Organizacional y Gestión de Personal",
     "Certificado en Gestión de Personal y Estructura Organizacional",
     "Ficha del empleado, organigrama por departamentos, contratos de trabajo, comisiones por ventas, ausencias y evaluación."),

    ("mod-30", "mod-6",  6,  "Administración y Talento Humano", "Nómina 2026",
     "Nómina, Beneficios Sociales e IESS Ecuador 2026",
     "Certificado en Nómina, Beneficios Sociales y Obligaciones IESS 2026",
     "Liquidación de rol de pagos mensual, horas extras, décimos, fondos de reserva, aportes patronal/personal al IESS y contabilización."),

    ("mod-3",  "mod-7",  7,  "Logística y Cadena de Suministro", "Supply Chain",
     "Aprovisionamiento y Control de Inventarios (Procure-to-Pay)",
     "Certificado en Compras e Inventarios (Procure-to-Pay)",
     "Ciclo Procure-to-Pay, transacciones de almacén, ubicaciones, lotes, series y costos de importación."),

    ("mod-13", "mod-8",  8,  "Logística y Cadena de Suministro", "Compras",
     "Compras Avanzadas y Gestión de Proveedores",
     "Certificado en Cotizaciones, Compras de Servicios y Devoluciones",
     "Solicitudes de compra, cotizaciones de proveedores, compras de servicios y gestión de devoluciones."),

    ("mod-14", "mod-9",  9,  "Logística y Cadena de Suministro", "Valoración",
     "Unidades de Medida y Valoración de Inventario",
     "Certificado en Valoración de Inventario y Unidades de Medida",
     "Grupos de unidades de medida, métodos de valoración (FIFO, promedio ponderado, estándar) y ajuste de costos."),

    ("mod-15", "mod-10", 10, "Logística y Cadena de Suministro", "Bodega",
     "Operación de Bodega e Inventario Físico",
     "Certificado en Gestión de Bodega e Inventario Físico",
     "Operación diaria con ubicaciones, transferencias entre bodegas, recuentos de inventario físico y mermas."),

    ("mod-16", "mod-11", 11, "Logística y Cadena de Suministro", "Despacho",
     "Picking, Packing y Despacho",
     "Certificado en Preparación y Despacho de Pedidos",
     "Preparación de pedidos, listas de picking, empaque, despacho de entregas y transferencias entre almacenes."),

    ("mod-4",  "mod-12", 12, "Gestión Comercial y CRM", "Ventas",
     "Gestión de Ventas y Order-to-Cash",
     "Certificado en Facturación y Ciclo de Ventas",
     "Ciclo de ventas completo: ofertas, pedidos, entregas, facturación electrónica deudores y notas de crédito."),

    ("mod-5",  "mod-13", 13, "Gestión Comercial y CRM", "Precios",
     "Estrategias Avanzadas de Precios y Descuentos",
     "Certificado en Listas de Precios y Políticas de Descuento",
     "Listas de precios derivadas, descuentos por período y volumen, grupos de descuento y precios especiales por cliente."),

    ("mod-6",  "mod-14", 14, "Gestión Comercial y CRM", "CRM",
     "Gestión CRM, Oportunidades y Servicio Post-Venta",
     "Certificado en CRM y Servicio Postventa",
     "Pipeline comercial, oportunidades de venta, llamadas de servicio, tarjetas de equipo y gestión de garantías."),

    ("mod-10", "mod-15", 15, "Producción y Planificación", "MRP",
     "Planificación de Materiales (MRP)",
     "Certificado en Planificación de Materiales (MRP)",
     "Previsión de demanda, pronósticos de venta, asistente MRP y generación automatizada de órdenes de compra y producción."),

    ("mod-11", "mod-16", 16, "Producción y Planificación", "Producción",
     "Fabricación y Listas de Materiales (BOM)",
     "Certificado en Órdenes de Producción y Costeo Industrial",
     "Estructuras de producto, listas de materiales de producción y ensamble, emisión de componentes y recibo de producto terminado."),

    ("mod-20", "mod-17", 17, "Producción y Planificación", "Capacidad",
     "Recursos de Planta, Capacidad y Rutas de Fabricación",
     "Certificado en Recursos, Capacidad y Rutas de Producción",
     "Gestión de maquinaria y mano de obra, asignación de capacidad disponible y rutas secuenciales de producción."),

    ("mod-7",  "mod-18", 18, "Finanzas y Fiscalidad", "Contabilidad",
     "Contabilidad Central y Normativa NIIF",
     "Certificado en Contabilidad General NIIF",
     "Estructura del plan de cuentas, determinación de cuentas de mayor, asientos contables y cierre de períodos."),

    ("mod-8",  "mod-19", 19, "Finanzas y Fiscalidad", "Tesorería",
     "Tesorería, Cobros, Pagos y Bancos",
     "Certificado en Conciliación Bancaria, Cobros y Pagos",
     "Pagos recibidos y efectuados, asistente de pagos masivos, conciliación bancaria y gestión de cartera."),

    ("mod-17", "mod-20", 20, "Finanzas y Fiscalidad", "Informes",
     "Monedas, Cierre Contable e Informes Financieros",
     "Certificado en Informes Financieros y Flujo de Caja",
     "Gestión multimoneda, vouchers de diario, diferencias de cambio, balance general, estado de resultados y flujo de caja."),

    ("mod-18", "mod-21", 21, "Finanzas y Fiscalidad", "Costos",
     "Contabilidad de Costos, Dimensiones y Presupuestos",
     "Certificado en Centros de Costo y Control Presupuestario",
     "Centros de costo multidimensionales, reglas de reparto de gastos indirectos y control presupuestario por partidas."),

    ("mod-19", "mod-22", 22, "Finanzas y Fiscalidad", "SRI Fiscal",
     "Facturación Electrónica y Retenciones SRI 2026",
     "Certificado en Facturación Electrónica y Retenciones SRI 2026",
     "Comprobantes electrónicos, esquema XML SRI, porcentajes de retención vigentes de Impuesto a la Renta e IVA."),

    ("mod-12", "mod-23", 23, "Tecnología y Analítica", "SQL & DTW",
     "Consultoría de Datos, Query Manager SQL y DTW",
     "Certificado en Consultas SQL, Alertas y Migración DTW",
     "Consultas SQL avanzadas, generador de consultas Query Manager, procedimientos de aprobación, alertas automáticas y migración DTW."),

    ("mod-22", "mod-24", 24, "Tecnología y Analítica", "Extensibilidad",
     "Extensibilidad, Tablas de Usuario y Analytics",
     "Certificado en Tablas de Usuario y SAP Analytics",
     "Campos y tablas de usuario (UDF/UDO), lógica de objetos personalizados, dashboards interactivos y SAP Analytics."),

    ("mod-26", "mod-25", 25, "Consultoría y Business Analyst", "Activate",
     "Metodología de Implementación y Ciclo de Vida SAP Activate",
     "Certificado en Metodología de Implementación SAP Activate",
     "Fases Discover, Prepare, Explore, Realize, Deploy y Run, gobernanza de proyectos, análisis Fit/Gap y Golden DB."),

    ("mod-27", "mod-26", 26, "Consultoría y Business Analyst", "BPMN 2.0",
     "Modelado y Optimización de Procesos de Negocio (BPMN 2.0)",
     "Certificado en Modelado y Optimización de Procesos (BPMN 2.0)",
     "Notación BPMN 2.0 para ERP, diagnóstico AS-IS, diseño TO-BE con mejores prácticas SAP y traducción a modelos de autorización."),

    ("mod-28", "mod-27", 27, "Consultoría y Business Analyst", "Blueprint",
     "Levantamiento de Requerimientos y Business Blueprint (BRD)",
     "Certificado en Business Blueprint y Levantamiento de Requerimientos",
     "Elicitación con Cinco Porqués, Business Blueprint (BBD), Historias de Usuario con Gherkin, Matriz RTM y diseño de UDFs."),

    ("mod-29", "mod-28", 28, "Consultoría y Business Analyst", "UAT & Cambio",
     "Gestión de Clientes, Pruebas UAT y Adopción del Cambio",
     "Certificado en Pruebas UAT, Adopción del Cambio y Go-Live",
     "Matriz de Mendelow, gestión de Change Requests, Train the Trainer, Test Scripts UAT, validación contable y Acta de Go-Live."),

    ("mod-23", "mod-29", 29, "Consultoría y Business Analyst", "Puesta en Marcha",
     "Implementación Técnica, Saldos Iniciales y Go-Live",
     "Certificado en Implementación Técnica y Puesta en Marcha",
     "Asistente de configuración Express, carga de saldos contables iniciales, corte operativo (Cutover) y periodo de Hypercare."),

    ("mod-24", "mod-30", 30, "Proyecto Final", "Capstone Máster",
     "Proyecto Integrador: Certificación Máxima de Súper Analista",
     "Diploma de Grado: Súper Analista & Consultor Máster SAP B1",
     "Simulación integral de puesta en marcha de una empresa completa en SAP B1: maestros, aprovisionamiento, ventas, nómina, finanzas y defensa ante Auditor IA."),
]

old_to_new = {old: new for old, new, _, _, _, _, _, _ in MAPEO}
old_to_num = {old: num for old, _, num, _, _, _, _, _ in MAPEO}

print("Iniciando migración 1:1 de 30 módulos...")

# 1. Cargar clases y lecciones actuales
clases_path = RAIZ / "src" / "content" / "aula" / "clases.json"
lecciones_path = RAIZ / "src" / "content" / "aula" / "lecciones.json"

with open(clases_path, "r", encoding="utf-8") as f:
    clases_old = json.load(f)

with open(lecciones_path, "r", encoding="utf-8") as f:
    lecciones_old = json.load(f)

clases_new = {}
lecciones_new = {}
mapeo_clases = {}  # old_class_id -> new_class_id

for old_id, new_id, new_num, _, _, _, _, _ in MAPEO:
    classes_list = clases_old.get(old_id, [])
    new_classes_list = []
    for idx, c in enumerate(classes_list, 1):
        old_class_id = c["id"]
        new_class_id = f"mod{new_num}-c{idx}"
        mapeo_clases[old_class_id] = new_class_id

        new_c = dict(c)
        new_c["id"] = new_class_id
        new_c["number"] = idx
        new_classes_list.append(new_c)

        # Migrar lección correspondiente y actualizar rutas de imágenes
        if old_class_id in lecciones_old:
            lec = dict(lecciones_old[old_class_id])
            lec["classId"] = new_class_id
            if "images" in lec and isinstance(lec["images"], list):
                lec["images"] = [
                    img.replace(f"/{old_class_id}/", f"/{new_class_id}/")
                    for img in lec["images"]
                ]
            lecciones_new[new_class_id] = lec

    clases_new[new_id] = new_classes_list

with open(clases_path, "w", encoding="utf-8") as f:
    json.dump(clases_new, f, ensure_ascii=False, indent=2)
print("OK: clases.json remapeado con mod-1..mod-30")

with open(lecciones_path, "w", encoding="utf-8") as f:
    json.dump(lecciones_new, f, ensure_ascii=False, indent=2)
print("OK: lecciones.json remapeado con mod1-c1..mod30-cN")

# 2. Migrar carpetas de imagenes en public/aula/
aula_dir = RAIZ / "public" / "aula"
staging_dir = RAIZ / "public" / "aula_staging"

if staging_dir.exists():
    shutil.rmtree(staging_dir)
os.makedirs(staging_dir, exist_ok=True)

# Mover a staging
for folder in aula_dir.iterdir():
    if folder.is_dir() and folder.name.startswith("mod"):
        shutil.move(str(folder), str(staging_dir / folder.name))

# Mover desde staging a destino con el nuevo nombre
for old_cls_id, new_cls_id in mapeo_clases.items():
    src_folder = staging_dir / old_cls_id
    dst_folder = aula_dir / new_cls_id
    if src_folder.exists():
        if dst_folder.exists():
            shutil.rmtree(dst_folder)
        shutil.copytree(str(src_folder), str(dst_folder))
    else:
        print(f"Aviso: carpeta {old_cls_id} no encontrada en staging")

if staging_dir.exists():
    shutil.rmtree(staging_dir)
print(f"OK: {len(mapeo_clases)} carpetas en public/aula migradas a mod1..mod30")

# 3. Actualizar exam-bank.ts
exam_path = RAIZ / "src" / "lib" / "exam-bank.ts"
with open(exam_path, "r", encoding="utf-8") as f:
    exam_raw = f.read()

# Extraer bloques por módulo antiguo usando delimitador de array
bloques_exam = {}
pattern = r"'(mod-\d+)':\s*(\[[\s\S]*?\n  \])"
for match in re.finditer(pattern, exam_raw):
    m_id = match.group(1)
    b_content = match.group(2)
    bloques_exam[m_id] = b_content

new_exam_bank_lines = []
for old_id, new_id, _, _, _, _, _, _ in MAPEO:
    content = bloques_exam.get(old_id)
    if content:
        new_exam_bank_lines.append(f"  '{new_id}': {content},")
    else:
        print(f"Aviso: no hay preguntas para {old_id}")

exam_header = exam_raw[:exam_raw.find("export const EXAM_BANK: Record<string, ExamQuestion[]> = {") + len("export const EXAM_BANK: Record<string, ExamQuestion[]> = {")]
new_exam_file_content = exam_header + "\n" + "\n".join(new_exam_bank_lines) + "\n};\n"

with open(exam_path, "w", encoding="utf-8") as f:
    f.write(new_exam_file_content)
print(f"OK: exam-bank.ts remapeado con {len(new_exam_bank_lines)} mod-1..mod-30")

# 4. Actualizar curriculum-data.ts
curriculum_path = RAIZ / "src" / "lib" / "curriculum-data.ts"

syllabus_lines = []
for old_id, new_id, new_num, bloque, badge, titulo, cert_titulo, desc in MAPEO:
    line = (
        f"  {{ id: '{new_id}', number: {new_num}, block: '{bloque}', badge: '{badge}',\n"
        f"    title: '{titulo}',\n"
        f"    description: '{desc}',\n"
        f"    certificateTitle: '{cert_titulo}', classes: [] }},"
    )
    syllabus_lines.append(line)

diplomas_code = """export const SPECIALTY_DIPLOMAS: SpecialtyDiploma[] = [
  { id: 'dip-compras', role: 'Asistente de Compras e Inventarios',
    title: 'Diploma de Asistente de Compras e Inventarios',
    requiredModules: ['mod-1', 'mod-2', 'mod-7', 'mod-8', 'mod-9'],
    description: 'Especialista en ciclo Procure-to-Pay, cotizaciones, compras de servicios, órdenes de compra y valoración de inventario.' },
  { id: 'dip-bodega', role: 'Jefe de Bodega y Logística',
    title: 'Diploma de Jefe de Bodega y Logística',
    requiredModules: ['mod-1', 'mod-2', 'mod-7', 'mod-10', 'mod-11'],
    description: 'Control de bodegas, ubicaciones, recuentos físicos, picking, packing y despacho seguro de mercaderías.' },
  { id: 'dip-comercial', role: 'Ejecutivo Comercial y Ventas',
    title: 'Diploma de Ejecutivo Comercial y Ventas',
    requiredModules: ['mod-1', 'mod-2', 'mod-12', 'mod-13'],
    description: 'Dominio del ciclo Order-to-Cash: ofertas, pedidos, entregas, facturación y estrategias avanzadas de precios y descuentos.' },
  { id: 'dip-postventa', role: 'Especialista en CRM y Post-Venta',
    title: 'Diploma de Especialista en CRM y Servicio Post-Venta',
    requiredModules: ['mod-1', 'mod-2', 'mod-12', 'mod-14'],
    description: 'Fidelización y atención al cliente, pipeline de oportunidades, llamadas de servicio, tarjetas de equipo y garantías.' },
  { id: 'dip-produccion', role: 'Planificador de Producción (MRP)',
    title: 'Diploma de Planificador de Producción',
    requiredModules: ['mod-2', 'mod-15', 'mod-16', 'mod-17'],
    description: 'Planificación de materiales MRP, órdenes de fabricación BOM, asignación de recursos y capacidad de planta.' },
  { id: 'dip-contable', role: 'Asistente Contable NIIF',
    title: 'Diploma de Asistente Contable NIIF',
    requiredModules: ['mod-1', 'mod-2', 'mod-18', 'mod-20', 'mod-22'],
    description: 'Registro de asientos, balances, estados financieros bajo NIIF, multimoneda y retenciones electrónicas vigentes del SRI.' },
  { id: 'dip-tesoreria', role: 'Especialista en Tesorería y Cobranzas',
    title: 'Diploma de Especialista en Tesorería y Cobranzas',
    requiredModules: ['mod-1', 'mod-18', 'mod-19', 'mod-22'],
    description: 'Gestión de liquidez, pagos masivos a proveedores, cobros de clientes, conciliación bancaria y retenciones fiscales.' },
  { id: 'dip-costos', role: 'Analista de Costos y Presupuestos',
    title: 'Diploma de Analista de Costos y Presupuestos',
    requiredModules: ['mod-3', 'mod-9', 'mod-18', 'mod-21'],
    description: 'Control de activos fijos, valoración de existencias, centros de costo multidimensionales y control presupuestario.' },
  { id: 'dip-admin-activos', role: 'Administrador de Operaciones y Activos Fijos',
    title: 'Diploma de Gestión Administrativa y Control de Activos Fijos',
    requiredModules: ['mod-1', 'mod-2', 'mod-3', 'mod-4'],
    description: 'Custodia del patrimonio corporativo, administración de activos fijos, altas, bajas, depreciación y gobernanza ERP.' },
  { id: 'dip-nomina', role: 'Especialista en Talento Humano y Nómina',
    title: 'Diploma de Especialista en Talento Humano y Nómina',
    requiredModules: ['mod-1', 'mod-2', 'mod-5', 'mod-6'],
    description: 'Gestión integral de personal, contratos, liquidación de rol de pagos, beneficios sociales y aportes al IESS Ecuador 2026.' },
  { id: 'dip-ventas-master', role: 'Consultor Comercial y Preventa SAP B1',
    title: 'Diploma de Consultor Comercial y Preventa SAP Business One',
    requiredModules: ['mod-1', 'mod-2', 'mod-12', 'mod-13', 'mod-14', 'mod-23'],
    description: 'Value-Based Selling para ejecutivos comerciales: demostraciones de alto impacto, analítica gerencial, ROI y manejo de objeciones.' },
  { id: 'dip-admin', role: 'Administrador del Sistema SAP B1 (Key User)',
    title: 'Diploma de Administrador SAP Business One',
    requiredModules: ['mod-1', 'mod-4', 'mod-23', 'mod-24'],
    description: 'Configuración del ERP, usuarios, autorizaciones, numeración de documentos, consultas SQL y tablas de usuario.' },
  { id: 'dip-consultor', role: 'Consultor de Implementación ERP',
    title: 'Diploma de Consultor de Implementación',
    requiredModules: ['mod-4', 'mod-23', 'mod-29', 'mod-30'],
    requiresOneDiplomaOf: ['dip-compras', 'dip-bodega', 'dip-comercial', 'dip-contable', 'dip-nomina', 'dip-business-analyst'],
    description: 'Liderazgo de proyectos: configuración, migración de datos con DTW, saldos iniciales y defensa del Proyecto Integrador.' },
  { id: 'dip-business-analyst', role: 'Consultor Funcional y Business Analyst SAP B1',
    title: 'Diploma de Consultor Funcional & Business Analyst SAP Business One',
    requiredModules: ['mod-1', 'mod-2', 'mod-25', 'mod-26', 'mod-27', 'mod-28'],
    description: 'Transformación digital: metodología SAP Activate, modelado BPMN 2.0 (AS-IS/TO-BE), Business Blueprint y pruebas UAT.' },
];"""

new_curr_content = f"""import CLASES_AULA from '@/content/aula/clases.json';

export interface SyllabusClass {{
  id: string;
  number: number;
  title: string;
  description: string;
  durationMinutes: number;
}}

export type SyllabusBlock =
  | 'Administración y Talento Humano'
  | 'Logística y Cadena de Suministro'
  | 'Gestión Comercial y CRM'
  | 'Producción y Planificación'
  | 'Finanzas y Fiscalidad'
  | 'Tecnología y Analítica'
  | 'Consultoría y Business Analyst'
  | 'Proyecto Final';

export interface SyllabusModule {{
  /** Clave estable del motor (progreso, láminas, endpoints, DB): alineada 1:1 con el número. */
  id: string;
  /** Número visible para el alumno: secuencia pedagógica continua 1 a 30. */
  number: number;
  title: string;
  description: string;
  badge: string;
  block: SyllabusBlock;
  certificateTitle: string;
  diplomaId?: string;
  classes: SyllabusClass[];
}}

export interface SpecialtyDiploma {{
  id: string;
  title: string;
  role: string;
  requiredModules: string[];
  requiresOneDiplomaOf?: string[];
  description: string;
}}

/** Orden pedagógico oficial: secuencia continua 1 a 30 sin saltos. */
export const OFFICIAL_SYLLABUS: SyllabusModule[] = [
{chr(10).join(syllabus_lines)}
];

{diplomas_code}

/** Programa cumbre: certificaciones funcionales + Proyecto Integrador. */
export const MASTER_PROGRAM = {{
  id: 'master-consultor-integral',
  title: 'Programa Consultor Integral & Súper Analista SAP Business One',
  description: 'Reúne las 30 certificaciones de competencia técnica y culmina con el Proyecto Integrador de Simulación Real.',
}} as const;

export const SYLLABUS_BLOCKS: SyllabusBlock[] = [
  'Administración y Talento Humano',
  'Logística y Cadena de Suministro',
  'Gestión Comercial y CRM',
  'Producción y Planificación',
  'Finanzas y Fiscalidad',
  'Tecnología y Analítica',
  'Consultoría y Business Analyst',
];

for (const mod of OFFICIAL_SYLLABUS) {{
  const publicadas = (CLASES_AULA as Record<string, SyllabusClass[]>)[mod.id];
  if (publicadas?.length) mod.classes = publicadas;
}}

export function getModuleById(id: string): SyllabusModule | undefined {{
  return OFFICIAL_SYLLABUS.find(m => m.id === id);
}}

export function getClassById(moduleId: string, classId: string): SyllabusClass | undefined {{
  const mod = getModuleById(moduleId);
  return mod?.classes.find(c => c.id === classId);
}}

export function moduleMinutes(mod: SyllabusModule): number {{
  return mod.classes.reduce((acc, c) => acc + c.durationMinutes, 0);
}}
"""

with open(curriculum_path, "w", encoding="utf-8") as f:
    f.write(new_curr_content)
print("OK: curriculum-data.ts remapeado con mod-1..mod-30")

# 5. Actualizar malla.json
malla_path = RAIZ / "src" / "content" / "malla" / "malla.json"
with open(malla_path, "r", encoding="utf-8") as f:
    malla = json.load(f)

malla["resumen"]["modulos"] = 30
malla["resumen"]["carreras"] = 14

modulos_malla = []
for old_id, new_id, new_num, _, _, titulo, _, _ in MAPEO:
    cls_list = clases_new.get(new_id, [])
    manuales = [
        {"number": c["number"], "id": c["id"], "title": c["title"]}
        for c in cls_list
    ]
    modulos_malla.append({
        "id": f"M{new_num:02d}",
        "modKey": new_id,
        "number": new_num,
        "name": titulo,
        "clasesCount": len(cls_list),
        "manuals": manuales
    })

malla["modulos"] = modulos_malla

carreras_malla = [
    {"id": "C01", "name": "Asistente de Compras e Inventarios", "modules": ["M01", "M02", "M07", "M08", "M09"]},
    {"id": "C02", "name": "Jefe de Bodega y Logística", "modules": ["M01", "M02", "M07", "M10", "M11"]},
    {"id": "C03", "name": "Ejecutivo Comercial y Ventas", "modules": ["M01", "M02", "M12", "M13"]},
    {"id": "C04", "name": "Especialista en CRM y Post-Venta", "modules": ["M01", "M02", "M12", "M14"]},
    {"id": "C05", "name": "Asistente Contable NIIF", "modules": ["M01", "M02", "M18", "M20", "M22"]},
    {"id": "C06", "name": "Especialista en Tesorería y Cobranzas", "modules": ["M01", "M18", "M19", "M22"]},
    {"id": "C07", "name": "Analista de Costos y Presupuestos", "modules": ["M03", "M09", "M18", "M21"]},
    {"id": "C08", "name": "Planificador de Producción (MRP)", "modules": ["M02", "M15", "M16", "M17"]},
    {"id": "C09", "name": "Gestión Administrativa y Control de Activos Fijos", "modules": ["M01", "M02", "M03", "M04"]},
    {"id": "C10", "name": "Especialista en Talento Humano y Nómina", "modules": ["M01", "M02", "M05", "M06"]},
    {"id": "C11", "name": "Consultor Comercial y Preventa SAP B1", "modules": ["M01", "M02", "M12", "M13", "M14", "M23"]},
    {"id": "C12", "name": "Administrador del Sistema SAP B1 (Key User)", "modules": ["M01", "M04", "M23", "M24"]},
    {"id": "C13", "name": "Consultor de Implementación ERP", "modules": ["M04", "M23", "M29", "M30"]},
    {"id": "C14", "name": "Consultor Funcional y Business Analyst SAP B1", "modules": ["M01", "M02", "M25", "M26", "M27", "M28"]},
]
malla["carreras"] = carreras_malla

with open(malla_path, "w", encoding="utf-8") as f:
    json.dump(malla, f, ensure_ascii=False, indent=2)
print("OK: malla.json remapeado con mod-1..mod-30 y C01..C14")

# 6. Actualizar src/app/mi-aula/page.tsx
mi_aula_page = RAIZ / "src" / "app" / "mi-aula" / "page.tsx"
with open(mi_aula_page, "r", encoding="utf-8") as f:
    mi_aula_content = f.read()

# Reemplazar enlace al capstone por mod-30
mi_aula_content = mi_aula_content.replace('/mi-aula/mod-24', '/mi-aula/mod-30')

with open(mi_aula_page, "w", encoding="utf-8") as f:
    f.write(mi_aula_content)
print("OK: mi-aula/page.tsx actualizado con enlace a mod-30")

print("\nMigración completada exitosamente!")
