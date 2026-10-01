import os
import re
import json

with open('src/lib/manuals-120-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Parse items
pattern = r'\{\s*"id":\s*"([^"]+)",\s*"number":\s*(\d+),\s*"slug":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)"'
matches = re.findall(pattern, content)
print(f"Total manuales: {len(matches)}")

# Classify manuals:
# 1. Theoretical / Conceptual (No need for interactive transactional simulator, or show overview)
# 2. Transactional / Operational (Needs specific SAP B1 screen)

# Let's map categories to potential simulator types:
sim_mapping = {
    # Ventas
    "Ventas": "sales_doc", # Oferta, Orden, Entrega, Factura
    # Compras
    "Compras y Aprovisionamiento": "purch_doc", # Pedido, Entrada mercancia, Factura
    # Inventario
    "Gestión de Inventario y Artículos": "item_master",
    "Datos Maestros de Artículo": "item_master",
    "Inventarios y Movimientos": "goods_movement",
    "Ubicaciones en Almacén (Bin Locations)": "bin_locations",
    # Finanzas
    "Contabilidad Básica": "journal_entry",
    "Gestión Bancaria y Pagos": "banking_payments",
    "Procesos Financieros": "financial_periods",
    "Configuración Financiera": "chart_of_accounts",
    "Costos y Presupuestos": "cost_centers",
    "Activos Fijos": "fixed_assets",
    "Informes Financieros y Control": "financial_reports",
    # Producción y MRP
    "Producción": "production_order",
    "Planificación de Materiales (MRP)": "mrp_wizard",
    # Precios
    "Determinación de Precios": "price_lists",
    # Proyectos y Servicios
    "Gestión de Proyectos": "project_management",
    "Gestión de Servicios": "service_call",
    # Casos Prácticos
    "Casos Prácticos y Ejercicios": "query_generator",
    # Soporte e Implementación
    "Herramientas de Soporte": "support_tools",
    "Implementación y Configuración": "setup_custom",
    # Introducción
    "Introducción a SAP Business One": "cockpit",
    "Visión General del Sistema": "theory_only",
}

categorized = {}
for m_id, num, slug, title, cat in matches:
    sim_type = sim_mapping.get(cat, "unknown")
    categorized.setdefault(cat, []).append({
        "id": m_id,
        "number": int(num),
        "title": title,
        "sim_type": sim_type
    })

print(f"\nResumen por categoría y simulador asignado:")
for cat, items in categorized.items():
    sim_type = items[0]["sim_type"]
    print(f"- [{cat}] ({len(items)} manuales) -> Tipo Simulador: {sim_type}")
