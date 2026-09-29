# Guion de Video: DOC 034 ItemInv ItemGroups

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 034 ItemInv ItemGroups.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 034: GRUPOS DE ARTÍCULOS - PARAMETRIZACIONES POR DEFECTO, CONTABILIDAD Y ANÁLISIS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_ItemInv_12_Item_ItemGrp_ES
Módulo Oficial: Gestión de Inventario / Grupos de Artículos (Inventory Management - Item Groups)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Logísticos, Contadores de Costos, Administradores de Catálogo y Agentes IA (Antigravity)
Carpeta Asociada: 034_10_ItemInv_12_Item_ItemGrp_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "034",

  "topic": "Item Groups Configuration, Default Inheritance & Financial Linkage",

  "sap_module": "Inventory_ItemGroups",

  "database_tables": {

    "item_groups_master": "OITB",

    "item_master_data": "OITM",

    "gl_account_determination": "OACT",

    "uom_groups": "OUGP",

    "cycle_determination": "CYC1"

  },

  "menu_paths": [

    "Gestión > Definición > Inventario > Grupos de artículos",

    "Inventario > Datos maestros de artículo > Campo Grupo de artículos",

    "Gestión > Inicialización del sistema > Parametrizaciones de documento > Determinación de cuentas de mayor > Pestaña Inventario",

    "Ventas > Informes de ventas > Análisis de ventas > Pestaña Por grupos de artículos"

  ],

  "default_inheritance_matrix": {

    "General_Classification": {

      "Item_Class": "Material (Artículos físicos) o Servicio",

      "UoM_Group": "Grupo de Unidades de Medida predeterminado (ej. Manual, Específico)",

      "Inventory_UoM": "Unidad de medida base para control de stock"

    },

    "Inventory_Costing_Method": {

      "Moving_Average": "Media Variable (Calcula costo promedio ponderado en cada entrada)",

      "FIFO": "Primero en Entrar, Primero en Salir (Gestión por capas de costos)",

      "Standard": "Coste Estándar (Valoración fija predeterminada con desvíos a cuentas de varianza)"

    },

    "Planning_MRP_Defaults": {

      "Planning_Method": "Planificación de necesidades (MRP) o Ninguno",

      "Procurement_Method": "Comprar (Aprovisionamiento externo) o Fabricar (Producción interna)",

      "Order_Interval": "Periodicidad de consolidación de compras (Semanal, Mensual, etc.)",

      "Order_Multiple": "Lote económico de compra o múltiplos de empaque",

      "Minimum_Order_Qty": "Cantidad mínima por pedido",

      "Lead_Time": "Tiempo de reposición en días naturales"

    },

    "Bin_Location_Defaults": {

      "Default_Bin": "Ubicación por defecto automática para todos los artículos pertenecientes al grupo"

    }

  },

  "financial_hierarchy_role": {

    "gl_determination_priority": "Prioridad 2 en la jerarquía contable (1. Almacén -> 2. Grupo de Artículos -> 3. General)",

    "function": "Permite asignar cuentas contables específicas de inventario, costo de ventas e ingresos por familia de productos sin tener que configurarlas artículo por artículo"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Propósito Estratégico de los Grupos de Artículos (OITB)
En organizaciones que manejan miles de referencias, configurar y mantener los parámetros técnicos, logísticos y financieros individualmente en cada artículo es inviable. El Grupo de Artículos (OITB) actúa como una plantilla inteligente de parametrización centralizada, garantizando:

Consistencia Operativa: Estandariza métodos de costeo, unidades de medida y parámetros MRP en toda una línea de productos.
Agilidad en la Creación de Datos Maestros: Al dar de alta un nuevo artículo y asignarle un grupo, todos los campos clave se autocompletan de forma automática.
Determinación Contable Homogénea: Asigna cuentas de mayor específicas (Costo de Ventas, Variación de Existencias, Ingresos Nacionales/Extranjeros) por familia.
Agrupación y Reporting: Facilita la generación de informes analíticos consolidados por línea de negocio.
2.2 Herencia de Parámetros y Flexibilidad de Modificación
Cuando un artículo se vincula a un grupo, hereda inmediatamente los valores por defecto configurados en OITB:

Tipo de Artículo: Define si la línea es tangible (artículo material) o intangible (servicio).
Método de Valoración de Inventario: Establece cómo se valoriza el costo de las existencias (Media Variable, FIFO o Coste Estándar).
Grupo de Unidades de Medida y UdM de Inventario: Fija la unidad base de stock.
Parámetros de Reaprovisionamiento MRP: Lead time, lote mínimo y múltiplos de compra.
Regla de Sobrescritura: Aunque los valores se heredan por defecto, el usuario con autorizaciones puede sobrescribir campos específicos en el artículo (a excepción del método de valoración una vez que el artículo ya ha registrado transacciones contables).
2.3 Los Grupos de Artículos en la Determinación de Cuentas de Mayor
En la configuración financiera de SAP Business One, la empresa define cómo deben derivarse las cuentas contables en compras, ventas e inventario:

Si se selecciona la opción de determinación contable por Grupo de Artículos, el sistema consulta la tabla OITB para obtener las cuentas de:
Inventario / Existencias: Activo corriente.
Costo de Mercancías Vendidas (COGS): Pérdidas y Ganancias.
Ingresos por Ventas: Ganancias operacionales.
Diferencias de Precio y Desviaciones: Cuentas de varianza.
Esto permite, por ejemplo, que las ventas de Hardware imputen a la cuenta 410010 - Ventas de Hardware, mientras que las ventas de Accesorios imputen a 410020 - Ventas de Accesorios, de manera 100% automática en el momento en que se crea la factura.
2.4 Ergonomía de Búsqueda y Reformateo de la Lista de Artículos
Al trabajar en documentos comerciales con catálogos extensos, la búsqueda de artículos puede volverse engorrosa. SAP Business One permite reformatear la ventana de selección de artículos (Lista de artículos):

Mediante las Parametrizaciones de Formulario, el usuario puede añadir el campo Grupo de artículos y activar la opción de Agrupar por este campo.
La ventana se transforma en una estructura de árbol: primero se visualizan las carpetas de los grupos (ej. Computadoras, Impresoras, Consumibles) y, al desplegar la carpeta, se muestran los productos específicos, acelerando la digitación de pedidos.


3. CASO DE NEGOCIO RESUELTO: ESTRUCTURACIÓN DE LÍNEAS EN OEC COMPUTERS
Escenario de Negocio:
OEC Computers amplía sus operaciones y decide crear una nueva línea de negocio: Escáneres Digitales de Alta Velocidad. El director financiero exige que esta línea se valore bajo el método FIFO, que sus transacciones se reflejen en cuentas contables independientes de ingresos y costos, y que sus tiempos de reposición estándar sean de 15 días.
Configuración en SAP Business One:
Creación del Grupo de Artículos:
En Gestión > Definición > Inventario > Grupos de artículos, se crea el grupo ESCANERES - Escáneres Digitales.
Definición de Valores por Defecto:
Clase de artículo: Material.
Método de valoración: FIFO.
Método de planificación: MRP. Método de aprovisionamiento: Comprar.
Plazo de entrega (Lead Time): 15 días. Cantidad mínima de pedido: 2 unidades.
Asignación de Cuentas Contables:
Cuenta de inventario: 140020 - Existencias Escáneres.
Costo de ventas: 510020 - Costo de Ventas Escáneres.
Ingresos locales: 410020 - Ingresos Escáneres.
Alta de Nuevos Artículos:
Cuando el asistente de compras crea los artículos SCN-001 y SCN-002 y selecciona el grupo ESCANERES, el método FIFO, las cuentas contables y los 15 días de reposición se configuran en un solo segundo sin intervención manual.
Auditoría Gerencial:
A fin de mes, la gerencia emite el informe Análisis de ventas por grupo de artículos, visualizando con un solo clic la rentabilidad bruta aislada de la nueva categoría.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es la función principal de los Grupos de Artículos en relación con la creación de nuevos registros maestros de artículo en SAP Business One?
A) Bloquear la venta de artículos a clientes extranjeros.
B) Servir como plantilla centralizada que propaga automáticamente valores por defecto (como método de valoración, unidades de medida, parámetros MRP y cuentas contables) a los nuevos artículos, asegurando consistencia y rapidez.
C) Asignar comisiones fijas del 10% a los vendedores.
D) Convertir automáticamente los artículos en activos fijos.
Respuesta Correcta: B
Justificación Técnica: Los grupos de artículos actúan como arquetipos de parametrización; al asociar un grupo, el artículo hereda sus atributos por defecto, reduciendo la carga manual y evitando errores de configuración contable o de costeo.
Pregunta 2
Si una empresa tiene configurada la determinación de cuentas de mayor a nivel de "Grupo de Artículos", ¿qué sucede cuando se contabiliza una Factura de Clientes?
A) El sistema solicita al usuario que elija manualmente la cuenta contable en una ventana emergente.
B) El sistema consulta la tabla OITB del grupo al que pertenece el artículo facturado y toma automáticamente la cuenta de ingresos y costo de ventas parametrizada para ese grupo.
C) El movimiento se envía siempre a una cuenta provisional de balance.
D) Se genera un error contable si el grupo contiene más de 10 artículos.
Respuesta Correcta: B
Justificación Técnica: Al definir la determinación contable por grupo de artículos (prioridad 2), el motor financiero de SAP B1 obtiene las cuentas contables directamente de la configuración del grupo OITB, automatizando el asiento en OJDT.
Pregunta 3
¿Cómo puede un usuario optimizar la ventana de búsqueda "Lista de Artículos" en un pedido de ventas si la empresa maneja un catálogo de más de 10,000 referencias?
A) Cerrando sesión y abriendo una empresa distinta.
B) Mediante las Parametrizaciones de Formulario de la ventana de búsqueda, añadiendo el campo "Grupo de artículos" y activando la opción de agrupar por ese campo para navegar el catálogo en forma de árbol jerárquico.
C) Borrando los artículos con más de 6 meses de antigüedad.
D) Desactivando el motor de base de datos HANA.
Respuesta Correcta: B
Justificación Técnica: Las parametrizaciones de formulario permiten reformatear la lista de artículos, agrupando las filas por familias de productos para realizar búsquedas estructuradas y eficientes en catálogos masivos.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
