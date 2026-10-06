import json
import re

with open('src/lib/manuals-120-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

match_all = re.search(r'export const ALL_MANUALS: ManualItem\[\] = \[(.*?)\];\s*export const', content, re.DOTALL)
block = match_all.group(1)
items = re.findall(r'\{\s*"id":\s*"([^"]+)",\s*"number":\s*(\d+),\s*"slug":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)"', block)

print(f"Total items in ALL_MANUALS: {len(items)}")

# Helper to determine simulator configuration
def get_config(m_id, title, category):
    lower_id = m_id.lower()
    lower_title = title.lower()

    # 1. Purely theoretical manuals
    theoretical_checks = [
        '10_intro_11_overview_introsapb1_es',
        '10_overview_13_mddoc_es',
        '10_finsetup_11_currencies_currencies_es',
        '10_controlreports_11_finreports_finreports_es',
        '10_controlreports_21_cashreports_cashflow_es',
        '10_controlreports_22_cashreports_aging_es',
        '10_controlreports_23_cashreports_dunning',
        '10_costandbudget_11_costacc_costacc_es',
        '10_support_11_supportproctool_es',
        '10_accbasics_11_accbasics_financial_basics_es',
        '10_finprocess_21_postperiods_postperiods_es',
        '10_purch_11_process_process_es', # Conceptual P2P process
        '10_sales_11_process_overview_es', # Conceptual O2C overview
        '10_production_11_overview_overview_es', # Conceptual prod overview
        '10_mrp_11_mrpprocess_process_es', # Conceptual MRP
        '10_service_11_csprocess_process_es', # Conceptual service
        '10_fixedasset_11_fixedasset_intro_es', # Conceptual FA
        '10_binloc_11_overview_overview_es' # Conceptual Bin Locations
    ]

    for tc in theoretical_checks:
        if tc in lower_id:
            return {
                "requiresSimulator": False,
                "archetype": "none",
                "title": title,
                "moduleName": category,
                "theoreticalSummary": f"Este manual aborda la arquitectura conceptual, normativas y modelos de negocio de {category}. No requiere captura de datos transaccionales. Enfócate en el video explicativo y el Examen con el Profesor IA."
            }

    # 2. Specific Archetypes
    # Query Generator
    if 'query' in lower_id or 'csi08' in lower_id or 'customtools_queries' in lower_id:
        return {
            "requiresSimulator": True,
            "archetype": "query",
            "title": f"Generador de Consultas SQL - {title}",
            "moduleName": "Herramientas > Consultas",
            "defaultTable": "OCRD - Business Partners",
            "scenarioGoal": "Estructurar consulta SQL seleccionando campos de la tabla OCRD/OINV y aplicando filtros WHERE."
        }

    # Fiori Cockpit / Intro / Settings
    if 'gettingstarted' in lower_id or 'csl01' in lower_id or 'uitemplates' in lower_id:
        return {
            "requiresSimulator": True,
            "archetype": "cockpit",
            "title": f"Parametrizaciones Generales & Cockpit - {title}",
            "moduleName": "Gestión > Inicialización del Sistema",
            "defaultTable": "OADM - Administración",
            "scenarioGoal": "Configurar la plantilla de rol de usuario, almacén por defecto y activación de widgets Fiori."
        }

    # Sales / Ventas
    if category == "Ventas" or 'sales' in lower_id or 'cust_' in lower_id:
        return {
            "requiresSimulator": True,
            "archetype": "sales",
            "title": f"Documento de Ventas - {title}",
            "moduleName": "Ventas - Clientes",
            "defaultTable": "ORDR / OINV - Factura de Clientes",
            "scenarioGoal": "Registrar orden o factura para el cliente C20000 (Maxi-Teq) con cálculo automático de totales e IVA."
        }

    # Purchasing / Compras
    if category == "Compras y Aprovisionamiento" or 'purch' in lower_id or 'csl02' in lower_id:
        return {
            "requiresSimulator": True,
            "archetype": "procurement",
            "title": f"Documento de Compras - {title}",
            "moduleName": "Compras - Proveedores",
            "defaultTable": "OPOR / OPDN - Pedido y Entrada de Mercancías",
            "scenarioGoal": "Emitir pedido de compras al proveedor S10000 (Far East Imports) y dar entrada de almacén."
        }

    # Accounting / Asientos Contables / Finanzas
    if 'journal' in lower_id or 'postje' in lower_id or 'accbasics_12' in lower_id or 'internalrecon' in lower_id:
        return {
            "requiresSimulator": True,
            "archetype": "journal_entry",
            "title": f"Asiento Contable Manual - {title}",
            "moduleName": "Finanzas > Asiento",
            "defaultTable": "OJDT - Cabecera Asiento / JDT1 - Líneas",
            "scenarioGoal": "Registrar líneas contables en Debe y Haber verificando que la suma de saldos cuadre a cero."
        }

    # Banking / Pagos
    if 'bankprocess' in lower_id or 'payment' in lower_id or category == "Gestión Bancaria y Pagos":
        return {
            "requiresSimulator": True,
            "archetype": "banking",
            "title": f"Gestión de Pagos y Cobros - {title}",
            "moduleName": "Gestión de Bancos > Pagos",
            "defaultTable": "ORCT - Pagos Recibidos / OVPM - Pagos Efectuados",
            "scenarioGoal": "Asignar medio de pago (Transferencia / Cheque) y conciliar facturas pendientes."
        }

    # Items / Datos Maestros de Artículo
    if 'item' in lower_id or category in ["Datos Maestros de Artículo", "Gestión de Inventario y Artículos"]:
        return {
            "requiresSimulator": True,
            "archetype": "item_master",
            "title": f"Datos Maestros de Artículo - {title}",
            "moduleName": "Inventario > Datos Maestros de Artículo",
            "defaultTable": "OITM - Maestro de Artículos",
            "scenarioGoal": "Gestionar propiedades del artículo, método de valoración de stock y grupos de unidad de medida."
        }

    # Inventory Moves / Stock
    if 'inventory' in lower_id or category == "Inventarios y Movimientos":
        return {
            "requiresSimulator": True,
            "archetype": "inventory_move",
            "title": f"Movimientos de Inventario - {title}",
            "moduleName": "Inventario > Operaciones de Stock",
            "defaultTable": "OIGN / OIGE - Entradas / Salidas de Mercancías",
            "scenarioGoal": "Realizar traspaso de stock entre almacenes y registrar recuento de inventario."
        }

    # Bin Locations / Ubicaciones
    if 'binloc' in lower_id or category == "Ubicaciones en Almacén (Bin Locations)":
        return {
            "requiresSimulator": True,
            "archetype": "bin_locations",
            "title": f"Ubicaciones en Almacén (Bin Locations) - {title}",
            "moduleName": "Inventario > Ubicaciones",
            "defaultTable": "OBIN - Maestro de Ubicaciones",
            "scenarioGoal": "Configurar código de ubicación estructurado por Subnivel (Pasillo-Estante-Nivel)."
        }

    # Production / MRP
    if 'production' in lower_id or 'bom' in lower_id or category == "Producción":
        return {
            "requiresSimulator": True,
            "archetype": "production",
            "title": f"Producción y Lista de Materiales - {title}",
            "moduleName": "Producción > Orden de Fabricación",
            "defaultTable": "OWOR - Órdenes de Fabricación / OITT - BOM",
            "scenarioGoal": "Definir lista de componentes y emitir orden de fabricación para producto terminado."
        }

    if 'mrp' in lower_id or category == "Planificación de Materiales (MRP)":
        return {
            "requiresSimulator": True,
            "archetype": "mrp",
            "title": f"Asistente de Planificación MRP - {title}",
            "moduleName": "MRP > Asistente de Planificación",
            "defaultTable": "MRP Wizard Scenarios",
            "scenarioGoal": "Ejecutar asistente de necesidades calculando recomendaciones de compra y fabricación."
        }

    # Pricing
    if 'pricing' in lower_id or category == "Determinación de Precios":
        return {
            "requiresSimulator": True,
            "archetype": "pricing",
            "title": f"Listas de Precios y Descuentos - {title}",
            "moduleName": "Inventario > Listas de Precios",
            "defaultTable": "OPLN - Listas de Precios / ITM1 - Precios de Artículos",
            "scenarioGoal": "Definir precio base, factor de lista y reglas de descuento por cantidad."
        }

    # Default fallback practical for configuration / admin / others
    return {
        "requiresSimulator": True,
        "archetype": "cockpit",
        "title": f"Parametrizaciones de Sistema - {title}",
        "moduleName": category,
        "defaultTable": "Parametrizaciones de Formulario",
        "scenarioGoal": f"Comprobar parámetros y opciones operativas para {title}."
    }

# Generate TypeScript file
ts_lines = [
    '// ═══════════════════════════════════════════════════════════════════',
    '// REGISTRO DE ARQUETIPOS DE SIMULADOR PARA LOS MANUALES SAP B1',
    '// Clasificación exacta: Teóricos (sin formulario) vs Prácticos (9 arquetipos)',
    '// ═══════════════════════════════════════════════════════════════════',
    '',
    'export type SimulatorArchetype = ',
    '  | "query"           // Generador de Consultas SQL (Query Generator)',
    '  | "sales"           // Documentos de Ventas (OQUT / ORDR / OINV)',
    '  | "procurement"     // Documentos de Compras (OPOR / OPDN / OPCH)',
    '  | "item_master"     // Datos Maestros de Artículo (OITM)',
    '  | "inventory_move"  // Movimientos y Traslados de Stock (OIGN / OIGE / OWTR)',
    '  | "bin_locations"   // Ubicaciones de Almacén (OBIN)',
    '  | "journal_entry"   // Asiento Contable Manual (OJDT)',
    '  | "banking"         // Pagos Recibidos y Efectuados (ORCT / OVPM)',
    '  | "production"      // Lista de Materiales y Órdenes de Fabricación (OITT / OWOR)',
    '  | "mrp"             // Asistente de Planificación MRP',
    '  | "pricing"         // Listas de Precios y Descuentos (OPLN)',
    '  | "cockpit"         // Parametrizaciones Generales y Cockpit Fiori',
    '  | "none";           // Módulo puramente conceptual / teórico',
    '',
    'export interface ManualSimulatorConfig {',
    '  requiresSimulator: boolean;',
    '  archetype: SimulatorArchetype;',
    '  title: string;',
    '  moduleName: string;',
    '  defaultTable?: string;',
    '  scenarioGoal?: string;',
    '  theoreticalSummary?: string;',
    '}',
    '',
    'export const MANUAL_SIMULATOR_MAP: Record<string, ManualSimulatorConfig> = {'
]

stats = {}
for m_id, num, slug, title, cat in items:
    cfg = get_config(m_id, title, cat)
    arch = cfg["archetype"]
    stats[arch] = stats.get(arch, 0) + 1
    
    ts_lines.append(f'  "{m_id}": {{')
    ts_lines.append(f'    requiresSimulator: {str(cfg["requiresSimulator"]).lower()},')
    ts_lines.append(f'    archetype: "{cfg["archetype"]}",')
    ts_lines.append(f'    title: {json.dumps(cfg["title"], ensure_ascii=False)},')
    ts_lines.append(f'    moduleName: {json.dumps(cfg["moduleName"], ensure_ascii=False)},')
    if "defaultTable" in cfg:
        ts_lines.append(f'    defaultTable: {json.dumps(cfg["defaultTable"], ensure_ascii=False)},')
    if "scenarioGoal" in cfg:
        ts_lines.append(f'    scenarioGoal: {json.dumps(cfg["scenarioGoal"], ensure_ascii=False)},')
    if "theoreticalSummary" in cfg:
        ts_lines.append(f'    theoreticalSummary: {json.dumps(cfg["theoreticalSummary"], ensure_ascii=False)},')
    ts_lines.append('  },')

ts_lines.append('};')
ts_lines.append('')
ts_lines.append('export function getManualSimulatorConfig(manualId: string): ManualSimulatorConfig {')
ts_lines.append('  if (MANUAL_SIMULATOR_MAP[manualId]) {')
ts_lines.append('    return MANUAL_SIMULATOR_MAP[manualId];')
ts_lines.append('  }')
ts_lines.append('  // Fallback inteligente por coincidencia de texto')
ts_lines.append('  const lower = manualId.toLowerCase();')
ts_lines.append('  if (lower.includes("query") || lower.includes("csi08")) {')
ts_lines.append('    return {')
ts_lines.append('      requiresSimulator: true,')
ts_lines.append('      archetype: "query",')
ts_lines.append('      title: "Generador de Consultas SQL",')
ts_lines.append('      moduleName: "Herramientas > Consultas",')
ts_lines.append('      defaultTable: "OCRD - Business Partners",')
ts_lines.append('      scenarioGoal: "Estructurar consulta SQL en la tabla OCRD con filtros y ordenamiento."')
ts_lines.append('    };')
ts_lines.append('  }')
ts_lines.append('  if (lower.includes("purch") || lower.includes("csl02")) {')
ts_lines.append('    return {')
ts_lines.append('      requiresSimulator: true,')
ts_lines.append('      archetype: "procurement",')
ts_lines.append('      title: "Documentos de Compras",')
ts_lines.append('      moduleName: "Compras - Proveedores",')
ts_lines.append('      defaultTable: "OPOR - Pedido de Compras",')
ts_lines.append('      scenarioGoal: "Emitir pedido de compras a proveedor y dar entrada de mercancías."')
ts_lines.append('    };')
ts_lines.append('  }')
ts_lines.append('  if (lower.includes("sales")) {')
ts_lines.append('    return {')
ts_lines.append('      requiresSimulator: true,')
ts_lines.append('      archetype: "sales",')
ts_lines.append('      title: "Documentos de Ventas",')
ts_lines.append('      moduleName: "Ventas - Clientes",')
ts_lines.append('      defaultTable: "OINV - Factura de Clientes",')
ts_lines.append('      scenarioGoal: "Crear factura de clientes con líneas de artículos y cálculo de totales."')
ts_lines.append('    };')
ts_lines.append('  }')
ts_lines.append('  if (lower.includes("intro") || lower.includes("overview")) {')
ts_lines.append('    return {')
ts_lines.append('      requiresSimulator: false,')
ts_lines.append('      archetype: "none",')
ts_lines.append('      title: "Fundamentos Teóricos",')
ts_lines.append('      moduleName: "Introducción y Arquitectura",')
ts_lines.append('      theoreticalSummary: "Este manual aborda conceptos generales y arquitectura. No requiere formulario transaccional."')
ts_lines.append('    };')
ts_lines.append('  }')
ts_lines.append('  return {')
ts_lines.append('    requiresSimulator: true,')
ts_lines.append('    archetype: "cockpit",')
ts_lines.append('    title: "Parametrizaciones Generales",')
ts_lines.append('    moduleName: "Gestión",')
ts_lines.append('    defaultTable: "OADM - Parámetros",')
ts_lines.append('    scenarioGoal: "Configurar opciones generales del sistema."')
ts_lines.append('  };')
ts_lines.append('}')

with open('src/lib/manual-simulator-registry.ts', 'w', encoding='utf-8') as out_f:
    out_f.write('\n'.join(ts_lines))

print("Created src/lib/manual-simulator-registry.ts successfully!")
print("Distribution of archetypes:")
for arch, count in sorted(stats.items()):
    print(f"  - {arch}: {count}")
