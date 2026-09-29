# Guion de Video: DOC 065 Pricing UpdatePricelist

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 065 Pricing UpdatePricelist.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 065: ACTUALIZACIÓN MASIVA DE LISTAS DE PRECIOS Y ASISTENTE DE PRECIOS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Pricing_22_Pricelist_UpdatePricelist_ES
Módulo Oficial: Gestión de Precios (Pricing) e Inventario
Versión de SAP: Business One 10.0
Audiencia Objetivo: Administradores de Precios, Consultores de Ventas, Contadores de Costos y Agentes IA (Antigravity)
Carpeta Asociada: 065_10_Pricing_22_Pricelist_UpdatePricelist_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "065",

  "topic": "Price List Maintenance & Price Update Wizard Automation",

  "sap_module": "Inventory_Pricing_Maintenance",

  "database_tables": {

    "price_lists_header": "OPLN",

    "price_lists_lines": "ITM1 (Manual: 'Y'/'N')",

    "uom_prices": "ITM9",

    "price_update_wizard_log": "OUPW",

    "currencies_exchange_rates": "ORTT"

  },

  "menu_paths": [

    "Inventario > Listas de precios > Listas de precios (Actualizar por selección)",

    "Inventario > Listas de precios > Asistente para actualización de precios",

    "Gestión > Tipos de cambio e índices"

  ],

  "maintenance_methods_comparison": {

    "Direct_Window_Maintenance": {

      "use_case": "Ajustes puntuales de pocos artículos o modificación global del factor en la cabecera",

      "impact": "Marcar manualmente un precio activa la casilla 'Manual' en ITM1 y desvincula la fila de la lista base"

    },

    "Update_by_Selection": {

      "use_case": "Mantenimiento por lotes dentro de una única lista de precios filtrando por Proveedor, Grupo o Propiedad",

      "impact": "Abre una grilla filtrada; los cambios realizados marcan la bandera 'Manual'"

    },

    "Price_Update_Wizard": {

      "use_case": "Actualizaciones complejas multisociedad, multimoneda y multicriterio sobre una o varias listas simultáneamente",

      "features": ["Modo Simulación previo", "4 métodos de actualización", "Conversión de divisas en bloque", "Ajuste masivo de UdM"]

    }

  },

  "wizard_4_update_methods": {

    "1_Item_Prices": {

      "operations": ["Multiplicar (*)", "Dividir (/)", "Sumar (+)", "Restar (-)", "Fijar valor constante (=)"],

      "filters": ["Fabricante", "Grupo de artículos", "Rango de ítems", "Excluir artículos sin precio", "Excluir artículos inactivos"]

    },

    "2_Base_Price_List": {

      "actions": [

        "Conservar lista base y actualizar únicamente el factor multiplicador",

        "Asignar una nueva lista base con nuevo factor",

        "Basar una lista en sí misma con factor 1.0 (para congelar precios y desvincularla de automatismos)"

      ]

    },

    "3_Convert_To": {

      "purpose": "Convierte precios de una moneda a otra (Principal, Adicional 1 o Adicional 2) utilizando el tipo de cambio oficial de ORTT o un valor manual pactado"

    },

    "4_UoM_Reduce_By_Percent": {

      "purpose": "Ajuste masivo del campo 'Reducir en %' en ITM9 para grupos de unidades de medida homogéneos (ej. incrementar descuento en cajas del 5% al 10%)"

    }

  },

  "simulation_and_execution": {

    "simulation_views": ["Por artículo (permite marcar/desmarcar ítems individuales)", "Por lista de precios (aprobación global)"],

    "execution_nature": "Estrictamente irreversible tras pulsar 'Ejecutar'. Requiere ejecutarse preferentemente en horarios de baja concurrencia."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Enfoques para el Mantenimiento de Precios en SAP B1
La gestión de precios a lo largo del ciclo fiscal requiere herramientas ágiles para responder a la inflación, variaciones en los costos de materias primas o ajustes estacionales de demanda. SAP Business One ofrece dos vías de mantenimiento:

Mantenimiento en la Ventana de Listas de Precios:
Actualización por Factor: Modifica el factor multiplicador en la cabecera de OPLN recalculando toda la lista derivada.
Actualización Manual Directa: Sobrescribe celdas individuales en la grilla.
Actualizar por Selección: Permite abrir un subconjunto de artículos filtrados por proveedor habitual, rango de códigos o grupo de artículos.
El Asistente de Actualización de Precios (Price Update Wizard):
Es una herramienta avanzada que permite actualizar múltiples listas de precios de manera simultánea, proyectar los resultados en una simulación previa y registrar auditorías completas.
2.3 Los 4 Métodos Operativos del Asistente de Actualización
Método 1: Precios del Artículo (Operaciones Matemáticas y Valor Fijo)
Permite transformar las tarifas vigentes mediante 5 operaciones fundamentales:

Multiplicar: Incrementa o reduce porcentualmente. Ejemplo: Para subir un 5%, se multiplica por 1.05; para reducir un 10%, se multiplica por 0.90.
Dividir: Divide el precio actual entre un factor.
Agregar / Sumar: Aplica un incremento monetario fijo (ej. sumar $2.50 por recargo de empaque).
Restar: Aplica un descuento monetario fijo.
Fijar Valor: Sobrescribe el precio con una tarifa fija sin importar el valor precedente.
Filtros de Seguridad: Incluye casillas para ignorar artículos sin precio (evitando que un artículo en cero pase a tener un valor no deseado) e ignorar artículos inactivos.
Método 2: Lista de Precios Base y Factores
Permite reestructurar la arquitectura de relaciones entre listas:

Mantener la lista base actual y redefinir el factor para un grupo específico de artículos (ej. cambiar el factor de accesorios de 0.50 a 0.75).
Asignar una nueva lista base a una lista de venta existente.
Congelamiento de Precios ("Basar en sí misma"): Al seleccionar Misma lista que la de destino con un factor de 1.0, la lista se independiza de su origen histórico, permitiendo fijar tarifas estables que ya no oscilarán con los cambios de la lista base.
Método 3: Convertir a (Conversión de Monedas)
Facilita la adaptación de listas de precios para mercados internacionales.
Permite tomar una lista de precios expresada en moneda local y convertirla colectivamente a dólares (USD), euros (EUR) o libras esterlinas (GBP), afectando la Moneda Principal o las Monedas Adicionales 1 y 2.
El sistema propone el tipo de cambio del día desde la tabla ORTT, pero el administrador puede fijar un tipo de cambio comercial específico para la corrida.
Método 4: UM "Reducir por %" (Ajuste Colectivo de Unidades de Medida)
Ajusta de forma masiva los márgenes de descuento por empaque en la tabla ITM9.
Permite redefinir el porcentaje de ahorro por comprar cajas o palets en múltiples listas de precios simultáneamente (ej. fijar el porcentaje de reducción en 10% para todos los papeles de copia).
2.4 El Modo Simulación y la Regla de Irreversibilidad
En el Paso 3, el asistente ofrece una Simulación Visual:
Vista por Artículo: Permite auditar el precio anterior, el precio simulado y desmarcar manualmente aquellos productos que deban ser excluidos del aumento.
Vista por Lista de Precios: Muestra el impacto consolidado por lista.
Advertencia Operativa: Una vez que se pulsa el botón Ejecutar, los cambios se graban físicamente en la base de datos de forma irreversible. Asimismo, los artículos modificados mediante el método de Precios del Artículo quedan marcados automáticamente con la casilla Manual (ITM1.Manual = 'Y'), lo que significa que ya no responderán a futuros recálculos por factor de lista base.


3. ATLAS DIDÁCTICO: COMPARATIVA DE MÉTODOS DEL ASISTENTE


4. CASO DE NEGOCIO RESUELTO: CAMPAÑA DE AUMENTO EN OEC COMPUTERS
Escenario de Consultoría:
El fabricante de periféricos Rainbow notifica a OEC Computers un incremento del 5% en sus costos de producción:

Se debe trasladar el incremento del 5% a todos los productos Rainbow en las listas de venta: Distribuidores y Público General.
La lista Tienda Web debe quedar excluida (se mantendrá en promoción fija).
Los artículos sin precio y los productos descontinuados (inactivos) no deben ser modificados.
Ejecución con el Asistente de Actualización de Precios:
Se abre el asistente y se selecciona el método Precios del artículo con la operación Multiplicar por 1.05.
Criterios de Selección:
Fabricante = Rainbow.
Casilla marcada: Excluir artículos sin precio.
Casilla marcada: Excluir artículos inactivos.
Listas de precios seleccionadas: Distribuidores y Público General (se excluye Tienda Web).
En la Simulación, el jefe de ventas verifica que un teclado con precio actual de $20.00 pasa a $21.00 USD.
Se pulsa Ejecutar. Las listas quedan actualizadas en lote en menos de 10 segundos con registro de log auditable.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Al utilizar el Asistente de Actualización de Precios con el método "Precios del artículo" para aplicar un aumento del 10% a un catálogo, ¿qué ocurre con el campo 'Manual' de los artículos actualizados en la lista de precios?
A) El campo 'Manual' se desmarca para permitir actualizaciones automáticas.
B) El campo 'Manual' se marca automáticamente como 'SÍ', lo que significa que el artículo ya no se actualizará en cascada cuando cambie el precio de su lista de precios base.
C) El artículo se bloquea para la venta.
D) Se requiere una orden de producción para desbloquearlo.
Respuesta Correcta: B
Justificación Técnica: Al alterar directamente el valor numérico del artículo mediante una operación matemática, el sistema asume que se ha fijado una tarifa específica e interrumpe la sincronización por factor con la lista base marcando la casilla 'Manual'.
Pregunta 2
Si una empresa desea "congelar" de forma permanente los precios de una lista de precios derivada para que nunca más vuelva a variar cuando cambien las listas de compras o de costos, ¿qué opción debe seleccionar en el método "Lista de precios base" del Asistente?
A) Borrar la lista de precios base.
B) Seleccionar la opción "Misma lista que la de destino" con un factor multiplicador de 1.0.
C) Poner el factor en 0.0.
D) Convertir todos los precios a moneda extranjera.
Respuesta Correcta: B
Justificación Técnica: Al basar una lista de precios en sí misma con factor 1.0, el sistema corta el cordón umbilical con cualquier lista de costo externa, manteniendo fijos los valores hasta que se editen voluntariamente.
Pregunta 3
¿Qué ventaja operativa ofrece el paso de "Simulación" en el Asistente de Actualización de Precios antes de la ejecución definitiva?
A) Permite enviar cotizaciones borrador a los clientes.
B) Permite visualizar el impacto de los nuevos precios frente a los actuales y desmarcar artículos específicos que no deban recibir el ajuste antes de aplicar los cambios irreversibles.
C) Permite calcular el balance de sumas y saldos del mes siguiente.
D) Genera automáticamente los asientos de ajuste por inflación en el libro mayor.
Respuesta Correcta: B
Justificación Técnica: La simulación actúa como un entorno de ensayo donde el usuario verifica la coherencia de las tarifas calculadas y puede realizar exclusiones puntuales antes del compromiso definitivo en la base de datos.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
