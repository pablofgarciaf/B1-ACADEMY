# Guion de Video: DOC 100 CSL01 CaseStudy Intro Solution

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 100 CSL01 CaseStudy Intro Solution.

## Contenido Principal (Visual: Diapositivas correspondientes)
Solución Técnica Integral: Caso Práctico CSL01 - Introducción, Navegación y Ventas
Metadatos Técnicos
Módulo SAP: Fundamentos de Operación y CRM (System Basics / CRM Sales Flow)
Código de Unidad: 100_CSL01_Introduction_Solution_ES
Versión Oficial: SAP Business One 10.0, versión para SAP HANA
Audiencia Objetivo: Consultores Certificados, Administradores y Jefes de Operaciones.



{

  "antigravity_master_schema": {

    "module": "System Fundamentals & CRM Navigation - Solution",

    "version": "10.0 HANA",

    "step_by_step_solutions": {

      "task_1": "Selección de plantilla 'Ventas' desde la gestión de plantillas de Cockpit",

      "task_2": "Actualización de campo OCRD.SlpCode mediante Búsqueda en Menú o Workbench",

      "task_3": "Uso de Buscar Menús, apertura de Galería de Widgets (+), adición de 'Funciones comunes' y Drag & Drop de Actividad",

      "task_4": "Creación de OQUT con filas tipo 'T' (Texto), 'Σ' (Subtotal), artículos A00002, A00005, C00008 y 5% de descuento",

      "task_5": "Enterprise Search con filtros 'C20000' + Fecha, clic en hipervínculo y función 'Copiar a Pedido de cliente'",

      "task_6": "4 Vías de auditoría: 1) Flecha naranja en OCRD.Orders; 2) Drag & Relate; 3) Lista de partidas abiertas; 4) Filtro en Enterprise Search"

    },

    "database_updates": {

      "OCRD": "Actualización de SlpCode = [ID Jefe Ventas]",

      "OQUT": "Generación de DocEntry para C20000 con DiscPrcnt = 5.0",

      "ORDR": "Generación de pedido con BaseType = 23 (Oferta) y BaseEntry = DocEntry de OQUT"

    }

  }

}


1. Resolución Paso a Paso de las Tareas del Caso de Negocio
Solución Tarea 1: Asignar Plantilla de Cockpit de Ventas
En la esquina superior derecha del Cockpit, haga clic en el ícono de opciones de Cockpit o navegue a la administración de plantillas.
Seleccione la plantilla estándar Ventas (Sales).
El sistema carga automáticamente los paneles de KPI analíticos (Margen Bruto, Clientes Principales), el banco de trabajo de procesos de ventas (Sales Process Workbench) y los tableros analíticos de HANA.
Consideración de Seguridad: Los usuarios finales requieren autorizaciones activas para visualizar los objetos que componen la plantilla. El usuario director dispone de privilegios de superusuario.
Solución Tarea 2: Asignación de Responsabilidad en Clientes (C20000, C50000, C60000)
Abra la ventana de Datos Maestros de Socio de Negocios:
Mediante el ícono de Cliente en el banco de trabajo de ventas del cockpit.
Navegando por Ventas - Clientes -> Datos maestros socio de negocios (OCRD).
Escribiendo Datos maestros en la barra de búsqueda de menú.
Pase a modo Buscar (Ctrl + F), ingrese C20000 y presione Enter.
En la ficha General, ubique el campo Empleado del departamento de ventas (SlpCode).
Seleccione en la lista desplegable el nombre correspondiente al nuevo Jefe de Ventas.
Elija Actualizar. Repita la operación para los códigos C50000 y C60000.
Solución Tarea 3: Búsqueda de Menú y Configuración de Widget de Actividades
Localización de la Función: Escriba Actividad en el campo Buscar menú situado en la parte superior del panel de módulos. El sistema mostrará la ruta jerárquica exacta: Gestión de relaciones con el cliente (CRM) -> Actividad.
Modificación del Cockpit:
Haga clic en el ícono del Lápiz (Editar Cockpit) en la barra superior.
Haga clic en el ícono + para abrir la Galería de Widgets.
En el filtro de categorías, seleccione Otros y localice Funciones comunes.
Presione el símbolo + debajo del widget para activarlo (cambiará a un visto verde).
Vuelva al cockpit y ubique el widget en la posición deseada mediante arrastre.
Haga clic en el visto de confirmación para guardar (opción Actualizar mi cockpit).
Anclaje de la Transacción: Arrastre la entrada Actividad desde el menú principal directamente dentro del cuerpo del widget Funciones comunes.
Solución Tarea 4: Creación de la Oferta de Ventas Estructurada
Abra Ventas - Clientes -> Oferta de ventas (OQUT).
Ingrese el cliente C20000.
Activación del Campo Tipo de Fila: En la barra de herramientas, abra Parametrizaciones de formulario (Ctrl + Shift + F). En la pestaña Formato de tabla, marque como visible y activo el campo Tipo (LineType).
Carga de Líneas:
Fila 1: Seleccione Tipo T (Texto). Ingrese un texto explicativo (ej. "Equipos y componentes solicitados para ampliación de red corporativa").
Fila 2: Tipo normal (en blanco). Artículo A00002, Cantidad 10.
Fila 3: Tipo normal. Artículo A00005, Cantidad 5.
Fila 4: Seleccione Tipo $\Sigma$ (Subtotal). El sistema calculará e imprimirá el importe acumulado de las filas 2 y 3.
Fila 5: Tipo normal. Artículo C00008, Cantidad 15.
Descuento Financiero: En el campo Descuento al pie del documento, digite 5 (el sistema aplicará un 5% de descuento sobre el total neto).
Presione Crear y visualizar.
Solución Tarea 5: Enterprise Search y Conversión a Pedido
En la esquina superior derecha de la ventana principal, haga clic en el ícono de la lupa con tres líneas (Enterprise Search).
Introduzca como criterios de búsqueda: C20000 y la fecha de contabilización de la oferta.
En los resultados devueltos por el motor SAP HANA, localice la Oferta de Ventas y haga clic sobre su hipervínculo para abrir el formulario.
En la parte inferior derecha de la oferta, haga clic en Copiar a -> Pedido de cliente.
Toda la información (artículos, cantidades, precios, filas de texto y subtotales) se hereda automáticamente. Ingrese la Fecha de entrega obligatoria y presione Crear.
Solución Tarea 6: Cuatro Métodos de Consulta de Pedidos Abiertos
Método 1 (Datos Maestros de SN): Abra el maestro del cliente C20000. En la pestaña General, ubique el campo de saldo de Pedidos y haga clic en la flecha de enlace naranja. El sistema desplegará inmediatamente la lista de órdenes pendientes.
Método 2 (Arrastrar y Vincular - Drag & Relate): Abra la pestaña Arrastrar y vincular en el panel lateral izquierdo. Abra el nodo Ventas - Clientes. Seleccione el código del cliente C20000 en la pantalla activa, arrástrelo y suéltelo sobre la entrada Pedido de cliente. En la ventana resultante, filtre la columna Status por el valor O (Abierto).
Método 3 (Lista de Partidas Abiertas): Vaya a Ventas - Clientes -> Informes de ventas -> Lista de partidas abiertas. Seleccione en el desplegable superior la opción Pedidos de cliente. Ordene por la columna Código de cliente.
Método 4 (Filtro en Enterprise Search): Ejecute Enterprise Search buscando C20000. En la barra lateral izquierda de facetas de búsqueda (Layout), filtre por el objeto de negocio Pedido de cliente y desmarque la casilla Cerrados.


2. Banco de Evaluación de Certificación
Pregunta 1: En un documento de marketing de ventas, ¿cuál es el comportamiento de una línea de Tipo "$\Sigma$" (Subtotal)?

A) Contabiliza un importe temporal en la cuenta de mayor asignada.
B) Presenta la sumatoria de las líneas precedentes hasta el último subtotal anterior, sin alterar el valor total del documento ni duplicar importes.
C) Aplica un descuento financiero automático sobre las líneas superiores.
D) Bloquea la edición de las líneas de artículos previas.
Respuesta Correcta: B.
Justificación Técnica: Las filas de subtotal en documentos de marketing son líneas no transaccionales que consolidan visualmente los importes monetarios de las filas de artículos inmediatamente superiores. No tienen impacto contable ni duplican el valor de la venta.

Pregunta 2: ¿Qué funcionalidad exclusiva de SAP Business One versión para SAP HANA permite localizar de forma global documentos, socios de negocios y artículos mediante búsqueda facetada en texto completo?

A) Asistente de consultas (Query Wizard).
B) Arrastrar y vincular (Drag & Relate).
C) Búsqueda empresarial (Enterprise Search).
D) Generador de informes financieros.
Respuesta Correcta: C.
Justificación Técnica: Enterprise Search aprovecha los motores de indexación en memoria de SAP HANA para realizar búsquedas globales tipo Google sobre todas las tablas de negocio, permitiendo aplicar filtros interactivos (facetas) por tipo de documento, estatus y fechas.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
