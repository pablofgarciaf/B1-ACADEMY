#!/usr/bin/env python3
"""
Pruebas del validador normativo. Ejecutar después de cada cambio de normativa (cada año):
  py -3 scripts/aula/test_validar_normativa.py
Cada caso dice si DEBE producir error (True) o no (False). Los casos "mal" son errores reales encontrados
en clases generadas; los casos "bien" son frases correctas que alguna versión anterior marcaba por error.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import validar_normativa as v  # noqa: E402

TEXTOS = [
    ("La factura lleva IVA del 15 % sobre la base.", False),
    ("Se aplica el quince por ciento de IVA.", False),
    ("La retención en la fuente del impuesto a la renta es del 2 % para bienes.", False),
    ("Retención del IVA: 30 % del IVA en bienes muebles.", False),
    ("Para contribuyentes especiales: el 10 % del IVA en bienes y el 20 % en servicios.", False),
    ("Identificar retenciones en la fuente del Impuesto a la Renta (1%, 1.75%, 2%, 3%, 5%, 10%) y del IVA (10%, 20%, 30%, 70%, 100%).", False),
    ("La NAC-DGERCGC26-00000009 derogó la NAC-DGERCGC24-00000008 y eliminó el 2,75 %.", False),
    ("Un descuento del 12 % por volumen.", False),
    ("Asignará el código IVA-BIENES-30, que representa el 30 % de retención sobre el valor del IVA.", False),
    ("El IVA del 12 % se suma al subtotal.", True),
    ("La retención en la fuente de renta es 2,75 % para servicios.", True),
    ("Aplica el 2,75 % de retención en la fuente.", True),
    ("Se retiene el 50 % del IVA al proveedor.", True),
    ("Retención de impuesto a la renta del 8 % por arriendo.", True),
    ("La retención en la fuente de renta para bienes muebles es 1,75 %.", True),
    ("Según la Resolución NAC-DGERCGC24-00000008 vigente.", True),
]

CADENAS = [
    ("Compra de bienes por 1000 dólares: IVA (150 dólares), 2 % de renta (20 dólares) y 30 % del IVA (45 dólares); neto a pagar 1085 dólares.", False),
    ("Factura por un total de 1700 dólares. IVA (255 dólares), 2 % de renta (34 dólares) y 30 % del IVA (76.50 dólares). El importe neto a pagar será 1344.50 dólares.", True),
    ("Costo de venta por 1300.00 USD e ingresos por 1700.00 USD con IVA de 255.00 USD.", False),
    ("Al guardar la entrega se reconocen los ingresos por 1700.00 USD y el IVA de 255.00 USD.", True),
    ("Al recibir una factura de servicios del proveedor, el asiento registra el gasto de 2000.00 y el IVA débito fiscal de 300.00.", True),
    ("En la factura de clientes se registra el IVA débito fiscal de 150.00 por la venta.", False),
]

CLASIFICACION = [
    ("Compra de un servidor HP ProLiant DL380 (A00006): aplica el 5 % de retención en la fuente.", True),
    ("Compra de 2 laptops Dell (A00001): retención del 2 % de renta y 30 % del IVA.", False),
    ("Mantenimiento del servidor A00006: retención del 3 % de renta por mano de obra.", False),
]

CAMPOS = [
    ([{"etiqueta": "Base imponible", "valor": "1000"}, {"etiqueta": "IVA 15%", "valor": "150"}, {"etiqueta": "Total", "valor": "1150"},
      {"etiqueta": "Retención renta", "valor": "20"}, {"etiqueta": "Retención IVA", "valor": "45"}], False),
    ([{"etiqueta": "Base imponible", "valor": "4250"}, {"etiqueta": "IVA", "valor": "637.50"}, {"etiqueta": "IVA retenido", "valor": "191.25"}], False),
    ([{"etiqueta": "Subtotal", "valor": "1000"}, {"etiqueta": "IVA 0%", "valor": "0"}, {"etiqueta": "Total", "valor": "1000"}], False),
    ([{"etiqueta": "Subtotal", "valor": "1000"}, {"etiqueta": "IVA", "valor": "120"}, {"etiqueta": "Total", "valor": "1120"}], True),
    ([{"etiqueta": "Base imponible", "valor": "4250"}, {"etiqueta": "IVA", "valor": "637.50"}, {"etiqueta": "IVA retenido", "valor": "200"}], True),
    ([{"etiqueta": "Porcentaje retención IVA", "valor": "50%"}], True),
]

ASIENTOS = [
    ([{"cuenta": "Compras", "debe": "1000"}, {"cuenta": "IVA crédito tributario", "debe": "150"}, {"cuenta": "Proveedores", "haber": "1150"}], False),
    ([{"cuenta": "Compras", "debe": "1000"}, {"cuenta": "IVA Debito", "debe": "150"}, {"cuenta": "Proveedores", "haber": "1150"}], True),
    ([{"cuenta": "Clientes", "debe": "1250"}, {"cuenta": "Ventas", "haber": "1147.83"}, {"cuenta": "IVA débito fiscal", "haber": "102.17"}], True),
    ([{"cuenta": "a", "debe": 100}, {"cuenta": "b", "haber": 90}], True),
    # Errores reales de mod19-c2 (lámina "Asiento por factura de compra"): IVA débito en compra y banco en la factura.
    ([{"cuenta": "Compras", "debe": "1000"}, {"cuenta": "IVA débito", "debe": "150"}, {"cuenta": "Retención IVA por pagar", "haber": "45"},
      {"cuenta": "Retención renta por pagar", "haber": "20"}, {"cuenta": "Banco", "haber": "1085"}], True),
    ([{"cuenta": "601000", "debe": "3450"}], True),
]


def main():
    fallos = 0
    grupos = [
        ("texto", TEXTOS, v.revisar_texto), ("cadena", CADENAS, v.revisar_cadena),
        ("clasificación", CLASIFICACION, v.revisar_clasificacion), ("campos", CAMPOS, v.revisar_campos),
        ("asiento", ASIENTOS, v.revisar_asiento),
    ]
    for nombre, casos, funcion in grupos:
        for entrada, debe_fallar in casos:
            errores = []
            if funcion is v.revisar_asiento:
                funcion(entrada, nombre, errores, "Asiento por factura de compra")
            else:
                funcion(entrada, nombre, errores)
            if bool(errores) != debe_fallar:
                fallos += 1
                print(f"✗ {nombre}: esperado {'error' if debe_fallar else 'sin error'} → {str(entrada)[:90]} {errores[:1]}")
    total = sum(len(c) for _, c, _ in grupos)
    print(f"{total - fallos}/{total} casos correctos")
    sys.exit(1 if fallos else 0)


if __name__ == "__main__":
    main()
