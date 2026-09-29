UNIDAD 038: MÉTODOS DE VALORACIÓN DE INVENTARIOS EN SISTEMA PERMANENTE (SAP BUSINESS ONE 10.0)
Código de Manual: 10_ItemInv_41_Valuation_ValMethods_ES
Módulo Oficial: Artículos e Inventario / Métodos de Valoración (Inventory Valuation - MM/FI)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Contadores Generales, Auditores Financieros y Agentes IA (Antigravity)
Carpeta Asociada: 038_10_ItemInv_41_Valuation_ValMethods_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "038",

  "topic": "Inventory Valuation Methods in Perpetual Inventory Systems",

  "sap_module": "Inventory_Valuation_Finance",

  "system_architecture": {

    "perpetual_inventory_flag": "OADM.MngStatPrc (Ficha Inicialización básica en Detalles de la empresa)",

    "valuation_level_flag": "OADM.ItemCostBy (Gestionar costo de artículo por Almacén 'W' o Empresa 'C')",

    "irreversibility_rule": "Una vez contabilizada la PRIMERA transacción de inventario en la base de datos, la opción de activar o desactivar el inventario permanente queda bloqueada de forma definitiva e irreversible"

  },

  "database_tables": {

    "item_master_valuation": {

      "table": "OITM",

      "field_eval_system": "OITM.EvalSystem",

      "options": {

        "A": "Precio Medio Variable (Moving Average)",

        "F": "Primero en Entrar, Primero en Salir (FIFO)",

        "S": "Costo Estándar (Standard Cost)",

        "B": "Valoración en Serie / Por Lote (Serial/Batch Valuation)"

      }

    },

    "warehouse_costs": {

      "table": "OITW",

      "fields": {

        "AvgPrice": "Costo unitario actual vigente en el almacén",

        "StockValue": "Valor monetario total del inventario (OnHand * AvgPrice)"

      }

    },

    "fifo_layers": {

      "table": "OINM / OIVL",

      "description": "Registro de capas de inventario abiertas con cantidad disponible y costo unitario original"

    },

    "inventory_revaluation": {

      "header_table": "OMRV",

      "lines_table": "MRV1",

      "description": "Ajuste manual o auditoría de costos para artículos estándar o capas FIFO"

    }

  },

  "menu_paths": [

    "Gestión > Inicialización del sistema > Detalles de la empresa > Pestaña Inicialización básica",

    "Gestión > Definición > Inventario > Grupos de artículos",

    "Inventario > Datos maestros de artículo > Pestaña Datos de inventario",

    "Inventario > Revalorización de inventario",

    "Inventario > Informes de inventario > Informe de auditoría de inventario",

    "Inventario > Informes de inventario > Informe de capas FIFO por orden de consumo"

  ],

  "valuation_comparison_matrix": {

    "Moving_Average": {

      "formula": "Costo_Unitario = Valor_Total_Existencias / Cantidad_Total_En_Stock",

      "recalculation_trigger": "En cada entrada de mercancías (compras, recepciones, ajustes positivos)",

      "sales_impact": "El costo de ventas es idéntico para todas las unidades que salen en ese instante"

    },

    "FIFO": {

      "formula": "Consumo estricto de la capa de inventario abierta más antigua",

      "recalculation_trigger": "Cada entrada crea una capa separada (Cantidad + Costo). Cada salida consume capas en orden cronológico",

      "sales_impact": "Permite diferentes costos unitarios en una misma entrega si la cantidad abarca más de una capa"

    },

    "Standard_Cost": {

      "formula": "Costo fijo predeterminado definido por decreto manual en Revalorización de Inventario",

      "recalculation_trigger": "Inmune a precios de compra. Las diferencias entre precio facturado y costo estándar se desvían a una cuenta de Pérdidas y Ganancias",

      "sales_impact": "Costo de ventas perfectamente estable y constante en todas las transacciones"

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Inventario Permanente vs Inventario No Permanente
Al configurar una sociedad en SAP Business One, la decisión arquitectónica más trascendental es la elección del modelo de inventario:

Sistema de Inventario Permanente (Perpetual Inventory):
Toda transacción física (entradas, salidas, entregas, facturas directas, mermas) genera en tiempo real un asiento contable automático en el Libro Mayor (OJDT).
Refleja permanentemente en el Balance General el valor monetario del inventario (140000 - Cuentas de Existencias) y en el Estado de Resultados el Costo de Mercancías Vendidas (500000 - COGS).
Sistema de Inventario No Permanente (Non-Perpetual Inventory):
Los movimientos de inventario solo alteran las cantidades físicas (OnHand), sin generar ningún asiento contable automático de existencias en el Libro Mayor.
El saldo de la cuenta de inventario en el balance no cambia con las operaciones diarias; se ajusta de forma manual mediante asientos contables periódicos (mensuales o anuales) tras la ejecución de recuentos de inventario físico.
Normativa: Utilizado tradicionalmente en países como Alemania, Suiza, Italia, Panamá y Sudáfrica.
Regla de Bloqueo Absoluto: La casilla Utilizar inventario permanente en Detalles de la empresa solo puede seleccionarse antes de iniciar operaciones. Tras el registro del primer documento con inventario, el sistema bloquea la casilla permanentemente, impidiendo cualquier cambio de modelo contable.
2.2 Análisis Técnico de los Tres Métodos de Valoración
A. Método de Precio Medio Variable (Moving Average - 'A')
Es el método más habitual en la distribución comercial.
Cada vez que ingresa una nueva compra a un precio diferente, el sistema recalcula el costo promedio ponderado dividiendo el valor monetario total entre el stock resultante: $$\text{Nuevo Costo Medio} = \frac{(\text{Stock Actual} \times \text{Costo Actual}) + (\text{Cantidad Comprada} \times \text{Precio Compra})}{\text{Stock Actual} + \text{Cantidad Comprada}}$$
Al venderse o emitirse el artículo, el inventario sale al costo promedio calculado en ese milisegundo exacto. El precio de venta acordado con el cliente no tiene ninguna injerencia en el costo contable de salida.
B. Método FIFO (First In, First Out - 'F')
Administra el inventario en capas contables independientes. Cada entrada de mercancías registra una capa con su fecha, cantidad y costo de adquisición.
Al despachar o vender, el motor de inventario consume primero las unidades de la capa más antigua disponible hasta agotarla, pasando luego a la siguiente.
Ventaja: Ideal para productos perecibles o bienes tecnológicos con rápida devaluación de precios.
Trazabilidad: El informe Informe de capas FIFO por orden de consumo desglosa con exactitud el stock remanente en cada capa abierta.
C. Método de Costo Estándar (Standard Cost - 'S')
Supone un costo fijo y predeterminado para el artículo, fijado manualmente en la ventana Revalorización de inventario.
Toda entrada o salida del almacén se valoriza estrictamente a ese precio estándar.
Tratamiento de Desviaciones: Si un artículo tiene un costo estándar de $100.00 y se adquiere de un proveedor a $120.00, el inventario en balance solo aumenta en $100.00. La diferencia de $20.00 se contabiliza de forma automática en la Cuenta de Desviación / Variación de Precios (Pérdidas y Ganancias).
Es el método predilecto en industrias de manufactura para medir variaciones de eficiencia productiva y variaciones en compras de materias primas.
2.3 Informe de Auditoría de Inventario (Inventory Audit Report)
Es la herramienta de conciliación suprema entre Contabilidad y Logística en SAP Business One.
Compara el saldo deudor de la cuenta contable de mayor de inventario en el Plan de Cuentas con la suma valorizada de todas las transacciones físicas registradas en OINM.
No recalcula costos, sino que expone la trazabilidad cronológica inalterable de cada transacción monetaria generada por el inventario permanente.


3. CASO DE NEGOCIO COMPARATIVO RESUELTO EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers compra un nuevo modelo de procesador en dos lotes sucesivos y luego realiza una venta parcial a un cliente. Se analiza el resultado contable y financiero comparando los tres métodos de valoración bajo inventario permanente.
Operaciones Registradas:
Compra 1: 5 unidades a $100.00 USD c/u $\rightarrow$ Total: $500.00 USD.
Compra 2: 5 unidades a $200.00 USD c/u $\rightarrow$ Total: $1,000.00 USD.
Stock total acumulado: 10 unidades | Inversión total acumulada: $1,500.00 USD.
Venta: Se venden 7 unidades a un cliente corporativo a un precio de venta de $300.00 USD c/u (Total Factura Venta: $2,100.00 USD).


Cuadro Comparativo de Impacto Contable y Financiero:


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿En qué momento se puede modificar la configuración de "Utilizar inventario permanente" en una empresa de SAP Business One?
A) En cualquier momento al finalizar el ejercicio fiscal anual.
B) Únicamente durante la inicialización básica de la sociedad; una vez que se contabiliza la primera transacción de inventario, la opción queda bloqueada de forma irreversible.
C) Mediante una solicitud de cambio de clave en el portal de soporte de SAP.
D) Siempre que no existan órdenes de fabricación abiertas.
Respuesta Correcta: B
Justificación Técnica: La parametrización de inventario permanente define la estructura contable de la base de datos. Para evitar corrupciones contables y discrepancias de balance, SAP Business One desactiva la casilla permanentemente tras el primer movimiento de stock.
Pregunta 2
Si un artículo gestionado bajo el método de Costo Estándar con valor fijo de $50.00 USD es comprado mediante una Factura de Proveedores a $65.00 USD por unidad, ¿cómo se contabiliza la diferencia de $15.00 USD?
A) Se suma al saldo de la cuenta de existencias, incrementando el costo unitario del artículo a $65.00.
B) Se contabiliza de forma automática en una cuenta de Desviación de Precios (Pérdidas y Ganancias), manteniendo la cuenta de inventario valorizada a razón de $50.00 por unidad.
C) El sistema rechaza la factura de compra por violación de costo.
D) Se transfiere al cliente final como un cargo adicional de flete.
Respuesta Correcta: B
Justificación Técnica: El costo estándar asume un valor de inventario constante. Toda fluctuación entre el precio de compra y el estándar se deriva a cuentas de variación en resultados sin alterar el valor contable unitario de las existencias.
Pregunta 3
¿Cuál es la función principal del Informe de Auditoría de Inventario en un entorno de inventario permanente?
A) Predecir la demanda futura de compras mediante algoritmos predictivos.
B) Proporcionar la conciliación y auditoría detallada entre los movimientos logísticos de stock y las variaciones monetarias en las cuentas contables de existencias del Libro Mayor.
C) Reemplazar la declaración anual de impuestos sobre la renta.
D) Asignar comisiones a los vendedores según el margen bruto.
Respuesta Correcta: B
Justificación Técnica: El informe de auditoría de inventario compara la perspectiva contable (Plan de Cuentas) con la perspectiva logística (Cantidades y costos transaccionales), asegurando que el Balance General refleje con absoluta exactitud el valor físico de las bodegas.