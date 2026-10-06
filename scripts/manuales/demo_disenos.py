"""Renderiza una lámina de muestra por cada diseño para revisar el aspecto visual."""
import io
import json
import sys

from PIL import Image
from playwright.sync_api import sync_playwright

from comun import TRABAJO
from paso2_laminas import html_lamina

DEMO = [
    {"layout": "portada", "titulo": "Solicitudes y cotizaciones de compra", "claves": ["Solicitud de compra", "Cotización", "Mejor precio"], "icono": "shopping-cart"},
    {"layout": "objetivos", "titulo": "Al terminar esta clase podrás", "claves": ["Crear solicitudes de compra", "Pedir cotizaciones a proveedores", "Usar el asistente de cotizaciones"], "icono": "target"},
    {"layout": "concepto", "titulo": "¿Qué es una solicitud de compra?", "claves": ["Documento interno", "Cantidades y plazo", "Autorización previa", "Sin efecto contable"], "icono": "clipboard-list"},
    {"layout": "flujo", "titulo": "Del pedido interno a la compra", "pasos": [{"texto": "Solicitud de compra", "icono": "clipboard-list"}, {"texto": "Cotización", "icono": "file-text"}, {"texto": "Comparar precios", "icono": "scale"}, {"texto": "Pedido de compra", "icono": "shopping-cart"}], "claves": ["Trazabilidad", "Mejor precio"], "icono": "workflow"},
    {"layout": "comparacion", "titulo": "Solicitud vs. pedido de compra", "columnas": [{"titulo": "Solicitud", "icono": "clipboard-list", "puntos": ["Uso interno", "Sin proveedor fijo", "No compromete pago"]}, {"titulo": "Pedido", "icono": "shopping-cart", "puntos": ["Va al proveedor", "Precio acordado", "Compromiso de compra"]}], "icono": "arrow-left-right"},
    {"layout": "pantalla", "titulo": "La ventana Solicitud de compra", "ventana": "Solicitud de compra", "campos": [{"etiqueta": "Solicitante", "valor": "María Pérez"}, {"etiqueta": "Departamento", "valor": "Bodega Quito"}, {"etiqueta": "Fecha requerida", "valor": "15/10/2026"}, {"etiqueta": "Artículo", "valor": "A00001 Laptop 15\""}, {"etiqueta": "Cantidad", "valor": "10"}], "resaltar": 2, "claves": ["Fecha requerida", "Solicitante", "Artículo y cantidad"], "icono": "monitor"},
    {"layout": "asiento", "titulo": "Impacto contable de la factura", "lineas": [{"cuenta": "Cuentas por cobrar", "debe": "1.150,00", "haber": ""}, {"cuenta": "Ventas", "debe": "", "haber": "1.000,00"}, {"cuenta": "IVA por pagar 15 %", "debe": "", "haber": "150,00"}], "claves": ["Se genera solo", "Debe = Haber"], "icono": "calculator"},
    {"layout": "kpi", "titulo": "Indicadores de compras", "kpis": [{"valor": "4,2 días", "etiqueta": "Tiempo de aprobación", "icono": "clock"}, {"valor": "-12 %", "etiqueta": "Ahorro por cotizar", "icono": "trending-down"}, {"valor": "38", "etiqueta": "Solicitudes abiertas", "icono": "clipboard-list"}], "claves": ["Informe de solicitudes"], "icono": "chart-bar"},
]

out = TRABAJO / "_demo"
out.mkdir(parents=True, exist_ok=True)
with sync_playwright() as pw:
    b = pw.chromium.launch()
    p = b.new_page(viewport={"width": 1920, "height": 1080})
    for i, L in enumerate(DEMO, 1):
        p.set_content(html_lamina(L, {"n": i, "total": len(DEMO), "manual": "Compras · Solicitudes y cotizaciones"}))
        Image.open(io.BytesIO(p.screenshot(type="png"))).convert("RGB").save(out / f"demo_{i:02d}_{L['layout']}.webp", "WEBP", quality=88)
    b.close()
print("ok", out)
