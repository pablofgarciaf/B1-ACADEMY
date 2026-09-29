UNIDAD 018: INTRODUCCIÓN A ANALYTICS, CAPA SEMÁNTICA Y COCKPIT FIORI EN SAP BUSINESS ONE 10.0 (VERSIÓN PARA SAP HANA)
Código de Manual: 10_Impl_17_CustomTools_IntroAnalytics_ES
Módulo Oficial: Herramientas de Customizing y Business Intelligence (Analytics for SAP HANA)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores de BI, Administradores de Sistemas, Consultores Funcionales y Agentes IA (Antigravity)
Carpeta Asociada: 018_10_Impl_17_CustomTools_IntroAnalytics_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "018",

  "topic": "Analytics, Semantic Layer, Calculation Views & Fiori Cockpit",

  "sap_module": "Analytics_HANA",

  "architectural_components": {

    "semantic_layer": "Modelos de vistas de cálculo desplegados en la memoria de SAP HANA que unifican tablas transaccionales (ORDR, RDR1, OCRD, OITM) aislando la complejidad técnica relacional",

    "data_structures": {

      "dimensions": "Campos cualitativos descriptivos (atributos: Quién, Qué, Cuándo; ej. CardCode, ItemCode, SlpCode, DocDate)",

      "measures": "Campos cuantitativos calculables y agregables (métricas: Suma, Promedio, Conteo; ej. DocTotal, GrsProfit, Quantity)"

    },

    "visual_widgets": {

      "pervasive_dashboards": "Gráficos interactivos de solo lectura incrustados en Cockpit Fiori o en la barra lateral de documentos transaccionales",

      "kpi_widgets": "Tarjetas métricas con valor actual, objetivo (Target), tendencia coloreada (Verde/Rojo) y marco temporal",

      "advanced_dashboards": "Tableros multipágina de análisis contextual profundo (ej. Cliente 360 / Customer 360)",

      "interactive_analysis_excel": "Complemento de MS Excel con pestañas 'Informe de Excel' y 'Análisis interactivo' (Tablas dinámicas sobre cubos HANA)",

      "analytical_portal": "Acceso web universal vía navegador (puerto 40000/Portal) mediante autenticación SAML/SSO sin cliente instalado"

    }

  },

  "menu_paths_and_urls": {

    "analytics_administration": "https://<Server>:40000/Enablement (Credencial: B1SiteUser)",

    "analytical_portal_url": "https://<Server>:40000/Portal",

    "pervasive_designer": "Icono Diseñador de análisis detallado en la barra superior de SAP Business One",

    "excel_integration": "Herramientas > Informe de Excel y análisis interactivo",

    "security_authorizaciones": "Gestión > Inicialización del sistema > Autorizaciones > Autorizaciones generales > Rama Analytics"

  },

  "dashboard_actions": [

    { "action": "Abrir ventana", "description": "Navega directamente a los datos maestros del socio de negocios o documento base" },

    { "action": "Búsqueda empresarial", "description": "Dispara Enterprise Search con el valor dimensional seleccionado (ej. CardCode)" },

    { "action": "Abrir panel avanzado", "description": "Lanza una vista analítica 360 grados contextual" }

  ],

  "advanced_analytical_strategies": [

    "Previsión / Forecast (requiere dimensión temporal de fecha)",

    "Clasificación ABC (segmentación Pareto 80/20)",

    "Clustering K-means (agrupamiento estadístico de patrones de compra)"

  ]

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 La Arquitectura de Inteligencia de Negocios en SAP HANA
En las instalaciones tradicionales basadas en disco (Microsoft SQL Server), los informes complejos exigen pesadas consultas transaccionales que compiten por recursos con la operación diaria. En contraposición, SAP Business One versión para SAP HANA aprovecha el motor de computación en memoria (In-Memory Computing) y la organización columnar de datos para habilitar análisis multidimensionales en tiempo real.

El pilar de esta solución es la Capa Semántica (Semantic Layer):

Consiste en un conjunto de Vistas de Cálculo (Calculation Views) preconstruidas por SAP que integran decenas de tablas subyacentes (ej. ORDR, RDR1, OCRD, OITM, OSHP).
Aísla al usuario y al consultor de la complejidad de los JOIN relacionales.
No duplica datos físicos: modela la información en memoria y la proyecta instantáneamente al ejecutarse la consulta.
2.2 Dimensiones vs Medidas
Toda herramienta de Business Intelligence en SAP HANA estructura la información en dos categorías:

Dimensiones: Datos categóricos y atributos descriptivos que responden a quién, cuándo o dónde. Ejemplos: Código de cliente (CardCode), Grupo de artículos, Vendedor (SlpCode), Región geográfica, Fechas de entrega.
Medidas: Magnitudes numéricas y métricas cuantificables sobre las cuales se pueden aplicar funciones de agregación matemática ($\text{SUM}$, $\text{AVG}$, $\text{COUNT}$). Ejemplos: Total facturado, Margen de ganancia bruta, Cantidad de unidades vendidas, Importe de impuestos.
2.3 Componentes del Cockpit Fiori y Diseñador de Análisis Detallado
A través del Diseñador de Análisis Detallado (Pervasive Analytics Designer), los consultores pueden construir tres tipos de artefactos:

Paneles Detallados (Pervasive Dashboards): Gráficos circulares, de barras, líneas o dispersión. Permiten limitar los resultados a los $N$ principales (ej. Top 5 Clientes), aplicar filtros por dimensión y activar Acciones Interactivas de Clic Derecho:
Abrir Datos Maestros: Abre la ficha del cliente o artículo seleccionado.
Iniciar Búsqueda Empresarial: Ejecuta la búsqueda federada Enterprise Search.
Abrir Panel Avanzado: Despliega un tablero complementario como Cliente 360.
Indicadores Clave de Rendimiento (KPI): Muestran el valor de una métrica crítica frente a un objetivo pactado (Target), con flechas de tendencia y código de colores semafórico (verde = favorable, rojo = desfavorable).
Paneles Avanzados (Advanced Dashboards): Espacios de trabajo multipágina que agrupan KPIs, paneles detallados y widgets de recuento para un análisis holístico.
2.4 Extensión fuera del ERP: Excel y Portal Analítico
Informe de Excel y Diseñador de Análisis Interactivo: Complemento oficial integrado en Microsoft Excel que permite construir reportes con formato corporativo o explorar datos mediante tablas dinámicas conectadas directamente a los cubos semánticos de SAP HANA.
Portal Analítico Web (Puerto 40000): Plataforma web responsive basada en HTML5 que permite a directores y usuarios móviles consultar informes de Crystal Reports y reportes de Excel desde tablets o smartphones, con autenticación segura SAML/SSO y programación de envíos automáticos por correo.


3. ATLAS TÉCNICO: ARQUITECTURA DE FLUJO ANALÍTICO
┌─────────────────────────────────────────────────────────────────────────┐

│              BASE DE DATOS IN-MEMORY (SAP HANA ENGINE)                  │

├─────────────────────────────────────────────────────────────────────────┤

│ Tablas Físicas Columnar: ORDR, RDR1, OCRD, OITM, OACT, JDT1             │

│                                │                                        │

│                                ▼                                        │

│                  VISTAS DE CÁLCULO / CAPA SEMÁNTICA                     │

│                  (Dimensiones + Medidas Agregables)                     │

└────────────────────────────────┬────────────────────────────────────────┘

                                 │

         ┌───────────────────────┼───────────────────────┐

         ▼                       ▼                       ▼

 [ COCKPIT FIORI ]       [ EXCEL ADD-IN ]       [ PORTAL ANALÍTICO ]

 • Pervasive Dashboards  • Informes Excel       • Acceso Web Móvil

 • KPI Semafóricos       • Análisis Interactivo • Exportación PDF/HTML

 • Tableros Cliente 360  • Tablas Dinámicas     • Programación Envíos


4. CASO DE NEGOCIO RESUELTO: TABLERO COMERCIAL EN OEC COMPUTERS
Escenario de Consultoría:
La dirección general de OEC Computers necesita que los supervisores de ventas monitoreen visualmente el embudo comercial y los clientes más rentables directamente desde su pantalla de inicio en SAP Business One.
Configuración del Tablero:
Inicialización: Se verifica en la consola https://server:40000/Enablement que la base de datos de OEC Computers tenga desplegados los paquetes semánticos analíticos.
Creación del Panel Detallado (Top 5 Clientes en Ventas):
Se abre el Diseñador de análisis detallado y se pulsa Nuevo panel.
Fuente de datos: Vista semántica SalesOrderAnalysisQuery.
Medida: DocTotal (Método: Suma).
Dimensión: CardName (Nombre del cliente).
Tipo de gráfico: Gráfico de barras horizontales.
Filtro de rango: Barra Límite superior fijada en 5.
Acciones añadidas: Se activa la acción Abrir ventana de datos maestros de interlocutor comercial vinculada a la dimensión CardCode.
Creación del KPI de Margen Bruto:
Métrica: Suma de GrsProfit del trimestre actual.
Objetivo (Target): $150,000.00 USD.
Regla de color: Verde si $\ge 150,000$; Rojo si $< 150,000$.
Despliegue: George y los gerentes incorporan el gráfico y el KPI a su Cockpit Fiori. Al hacer clic derecho sobre la barra de un cliente en el gráfico, pueden abrir instantáneamente su ficha maestra para revisar líneas de crédito o pedidos demorados.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es la diferencia fundamental entre una "Dimensión" y una "Medida" en la capa semántica de SAP HANA para SAP Business One?
A) Las dimensiones son números enteros y las medidas son números con decimales.
B) Las dimensiones representan atributos cualitativos descriptivos (quién, qué, cuándo), mientras que las medidas son magnitudes numéricas cuantificables sobre las cuales se realizan agregaciones y cálculos matemáticos (sumas, promedios).
C) Las dimensiones se guardan en el servidor y las medidas en el cliente.
D) Las dimensiones son exclusivas del módulo de compras.
Respuesta Correcta: B
Justificación Técnica: En el modelado dimensional de BI, las dimensiones contextualizan y clasifican la información (ej. Cliente, Producto, Fecha), mientras que las medidas proporcionan el valor métrico calculable (ej. Importe de ventas, Cantidad).
Pregunta 2
¿Qué herramienta administrativa debe utilizarse para desplegar e inicializar las vistas de cálculo semánticas predefinidas de SAP HANA en la base de datos de la empresa?
A) El Generador de Consultas de SAP Business One.
B) La Consola de Administración de Analytics (acceso vía navegador web en el puerto 40000/Enablement con usuario B1SiteUser).
C) El Data Transfer Workbench (DTW).
D) El Diseñador de Menús de Usuario.
Respuesta Correcta: B
Justificación Técnica: La inicialización y despliegue de los modelos analíticos y cubos semánticos de SAP HANA se gestiona exclusivamente a través de la consola web de Analytics en el puerto 40000 utilizando la credencial maestra B1SiteUser.
Pregunta 3
Al configurar un Panel Detallado (Pervasive Dashboard), ¿cuáles son las tres acciones interactivas que pueden asignarse al menú contextual de clic derecho?
A) Formatear el disco duro, reiniciar la base de datos y apagar el servidor.
B) Abrir una ventana específica del sistema (datos maestros o documentos), iniciar la Búsqueda Empresarial (Enterprise Search) o abrir un Panel Avanzado (como Cliente 360).
C) Imprimir cheques, hacer asientos contables y cerrar periodos.
D) Enviar SMS, cambiar contraseñas y calcular depreciaciones.
Respuesta Correcta: B
Justificación Técnica: Los paneles detallados admiten tres acciones interactivas de enlace contextual: navegación a formularios estándar de SAP B1, ejecución de Enterprise Search y apertura de tableros analíticos avanzados.