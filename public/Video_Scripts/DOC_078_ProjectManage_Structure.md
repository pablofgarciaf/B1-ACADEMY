# Guion de Video: DOC 078 ProjectManage Structure

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 078 ProjectManage Structure.

## Contenido Principal (Visual: Diapositivas correspondientes)
Unidad 078: Estructura y Gestión Integral de Proyectos en SAP Business One 10.0
Metadatos Técnicos
Módulo: Gestión de Proyectos (Project Management)
Código de Documento: DOC_078_ProjectManage_Structure
Audiencia Objetivo: Directores de Proyecto (PMO), Consultores Funcionales de SAP B1, Jefes de Operaciones de Servicios y Analistas de Control de Gestión.
Prerrequisitos: Conceptos de Proyectos Financieros (OPRJ), Circuito de Ventas y Compras, Órdenes de Fabricación y Módulo de Servicio / Actividades CRM.
Versión SAP B1: SAP Business One 10.0 FP 2008 / HANA & SQL.


JSON Antigravity Master Schema
{

  "unit_id": "078",

  "document_code": "DOC_078_ProjectManage_Structure",

  "topic": "Project Management Module Architecture, Stages, Subprojects and Gantt",

  "module": "Project Management",

  "version": "10.0",

  "data_architecture": {

    "primary_tables": [

      {

        "table_name": "OPMG",

        "description": "Project Master Data Header (Proyectos principales y subproyectos, estatus, cliente, % avance)",

        "key_fields": ["AbsEntry", "NAME", "STATUS", "CARDCODE", "PrjCode", "FATHER", "IS_SUBPRJ", "PERCENT"]

      },

      {

        "table_name": "PMG1",

        "description": "Project Stages and Tasks (Etapas del proyecto, tareas, porcentaje, fechas estimadas y reales)",

        "key_fields": ["AbsEntry", "LineNum", "StageID", "TaskID", "STATUS", "CLOSE_DATE", "PERCENT", "PLANDCOST"]

      },

      {

        "table_name": "OPRJ",

        "description": "Financial Project Code (Código de proyecto financiero para imputación contable en líneas)",

        "key_fields": ["PrjCode", "PrjName", "Active", "ValidFrom", "ValidTo"]

      },

      {

        "table_name": "OCLG",

        "description": "Activities CRM (Llamadas, reuniones y tareas vinculadas a etapas de proyecto)",

        "key_fields": ["ClgCode", "CardCode", "Action", "PrjCode", "DocType", "DocEntry"]

      },

      {

        "table_name": "OSOL",

        "description": "Service Solutions Knowledge Base (Soluciones asociadas a incidencias abiertas del proyecto)",

        "key_fields": ["SltCode", "ItemCode", "Subject", "Cause", "Symptom", "Descriptio"]

      },

      {

        "table_name": "OWOR",

        "description": "Production Orders (Órdenes de trabajo asignadas a etapas de proyectos)",

        "key_fields": ["DocEntry", "DocNum", "Status", "ItemCode", "PrjCode"]

      }

    ],

    "menu_navigation_paths": [

      "Gestión de proyectos -> Datos maestros de proyecto",

      "Gestión -> Inicialización del sistema -> Detalles de la empresa -> Ficha Inicialización básica (Casilla 'Activar gestión de proyectos')",

      "Gestión de proyectos -> Informes de gestión de proyectos -> Análisis de etapas / Problemas pendientes / Recursos",

      "Menú contextual de Datos Maestros de Proyecto -> Diagrama de Gantt / Resumen de proyecto"

    ],

    "business_rules": [

      {

        "rule_id": "BR_PM_01",

        "name": "Project Management Activation Prerequisite",

        "description": "El módulo de Gestión de Proyectos debe activarse explícitamente en Detalles de la Empresa (Ficha Inicialización Básica) antes de poder registrar proyectos."

      },

      {

        "rule_id": "BR_PM_02",

        "name": "Stage Completion Dependency Validation",

        "description": "Una línea de etapa (tarea) no puede marcarse como 'Finalizada' (Finished) si tiene configurada una dependencia activa sobre otra etapa que aún no ha sido completada."

      },

      {

        "rule_id": "BR_PM_03",

        "name": "Open Issue Completion Block",

        "description": "Ninguna línea de etapa puede marcarse como 'Finalizada' si contiene incidencias o problemas abiertos (Open Issues) con estatus pendiente."

      },

      {

        "rule_id": "BR_PM_04",

        "name": "Subproject Contribution Mathematics",

        "description": "En proyectos complejos con subproyectos, el porcentaje de avance del proyecto principal (% Completeness) es la suma ponderada del porcentaje de avance de cada subproyecto multiplicado por su respectivo porcentaje de contribución (% Contribution)."

      }

    ]

  }

}


Desarrollo Conceptual y Funcional Detallado
1. Arquitectura del Módulo de Gestión de Proyectos
El módulo de Gestión de Proyectos (Project Management) en SAP Business One actúa como una consola integral (Workbench) que centraliza las dimensiones operativas, logísticas, de recursos y financieras de una iniciativa empresarial.
Activación Inicial del Sistema
Para que el módulo sea visible y funcional:

Acceder a: Gestión -> Inicialización del sistema -> Detalles de la empresa -> Ficha Inicialización básica.
Marcar la casilla Activar gestión de proyectos (Enable Project Management).
Clasificación Fundamental del Proyecto
Proyecto Externo (External): Ejecutado para un cliente específico (CardCode obligatorio). Permite la emisión de documentos de facturación, cotizaciones y entregas asociadas.
Proyecto Interno (Internal): Iniciativa interna de la empresa (ej. desarrollo de software propio, ampliación de planta industrial o auditoría). No requiere un socio de negocios cliente.


2. Anatomía de los Datos Maestros de Proyecto (OPMG)
A. Cabecera del Proyecto
Código y Nombre del Proyecto: Identificadores principales.
Proyecto Financiero (OPRJ): Es crítico vincular un código de proyecto financiero. Este enlace es el motor que permite a SAP B1 reconocer automáticamente transacciones contables, documentos de compras/ventas y órdenes de producción pertenecientes al proyecto.
Estatus del Proyecto:
Iniciado (Started): Estatus activo por defecto durante la ejecución.
En pausa (Paused): Detiene temporalmente el avance sin cerrar operaciones.
Interrumpido (Stopped): Utilizado cuando el proyecto se cancela o aborta anticipadamente. Registra la fecha de cierre.
Finalizado (Finished): Bloquea el proyecto tras completar todas las obligaciones. Requiere que el 100% de las etapas estén finalizadas.
Barra de Progreso (% Completeness): Refleja en tiempo real la sumatoria de los porcentajes de avance de las tareas marcadas como finalizadas.
B. Pestaña Etapas (Stages - PMG1)
La pestaña Etapas es la columna vertebral del proyecto. Se compone de filas donde se definen las fases y tareas:

Etapa (Stage): Fases del ciclo de vida (ej. Inicio, Planificación, Ejecución, Cierre).
Tarea (Task): Actividad puntual dentro de la etapa. Múltiples tareas pueden pertenecer a una misma etapa.
Porcentaje de Finalización (% Progress): Peso relativo de la tarea dentro del proyecto total. La sumatoria de todas las tareas debe ser exactamente 100%.
Fecha de Fin Planificada (End Date) vs. Fecha de Finalización Real (Finished Date):
Fecha de Fin: Estimación de calendario ingresada por el director de proyecto.
Fecha de Finalización: Se completa automáticamente con la fecha del sistema al marcar la casilla Finalizado (Finished), permitiendo auditar desvíos temporales.
Responsable de Etapa (Stage Owner): Empleado responsable directo del cumplimiento de la fila.
Dependencias de Etapa (Stage Dependencies): Permite encadenar hasta 4 dependencias jerárquicas entre tareas (incluso entre distintos subproyectos). Una tarea sucesora queda estrictamente bloqueada para finalización hasta que sus tareas predecesoras hayan sido marcadas como finalizadas.


3. Matriz Inferior de Datos Relacionados
Al seleccionar una fila de etapa en la tabla superior, la matriz inferior se expande para vincular los objetos operativos del sistema:

Documentos de Marketing e Inventario:
Facturas y entregas a clientes (OINV, ODLN).
Facturas y entradas de mercancías de proveedores (OPCH, OPDN).
Al registrar un documento, el campo Etapa de Proyecto (Stage) permite enlazarlo directamente con el formato: [ID_Único(ID_Interno_Proyecto - Línea_Etapa)] (ej. Con1(6-1)).
Órdenes de Trabajo / Fabricación (OWOR):
Asignación de órdenes de producción requeridas para ensambles o transformaciones del proyecto, reflejando el costo de máquinas y mano de obra.
Actividades CRM (OCLG):
Registro de reuniones de avance, llamadas de coordinación técnica y visitas en sitio.
Problemas Pendientes (Open Issues):
Registro de incidentes no planificados surgidos en planta o sitio del cliente.
Enlace nativo a la base de conocimiento de Soluciones de Servicio (OSOL).
Regla Bloqueante: Ninguna etapa puede finalizarse mientras existan incidencias con estatus abierto.
Anexos (Attachments):
Contratos firmados, diagramas arquitectónicos y albaranes de entrega digitalizados.
Asistente de Asignación de Documentos (Document Assignment)
Cuando el usuario abre un Dato Maestro de Proyecto, el motor de auditoría de SAP B1 detecta en segundo plano si se han emitido facturas o documentos en el sistema que utilicen el código del proyecto financiero (OPRJ), pero que no hayan sido vinculados a una etapa concreta. El sistema despliega una notificación automática permitiendo abrir la ventana de Asignación de Documentos para asociar las líneas a la etapa correspondiente con un solo clic.


4. Arquitectura de Subproyectos Jerárquicos
Para iniciativas empresariales complejas o de múltiples sedes, SAP Business One permite activar la casilla Proyecto con subproyectos (Project with Subprojects).

Estructura en Árbol: El proyecto principal se sitúa en la cúspide (Nivel 0) y puede ramificarse en múltiples subproyectos (Nivel 1, 2, etc.).
Porcentaje de Contribución (Contribution %): A cada subproyecto se le asigna un porcentaje de peso sobre el proyecto global.
Fórmula de Avance Consolidado: $$\text{% Avance Global} = \sum (\text{% Avance Subproyecto}_i \times \text{% Contribución}_i)$$ Ejemplo: Si el Subproyecto A tiene un 20% de contribución y su avance es del 50%, aporta un 10% al avance total del proyecto consolidado.
Duplicación desde Plantilla: Permite clonar subproyectos homogéneos (ej. despliegue en múltiples sucursales) conservando etapas y tareas estándar.


5. Herramientas de Monitoreo: Diagrama de Gantt e Informes
Diagrama de Gantt Interactivo: Accesible desde el menú contextual (clic derecho) de los datos maestros. Permite visualizar barras cronológicas de etapas y subproyectos en vistas de días, semanas o meses, pudiendo ajustar plazos arrastrando los bloques temporales.
Pestaña Resumen (Summary Tab): Ofrece la comparativa financiera en tiempo real: $$\text{Desviación de Presupuesto} = \text{Total Facturado Proveedores (A/P)} - \text{Presupuesto Planificado}$$ $$\text{Desviación de Ingresos} = \text{Total Facturado Clientes (A/R)} - \text{Ingreso Potencial Esperado}$$
Informes Estándar:
Análisis de Etapas (Stage Analysis): Reporte consolidado de etapas abiertas, fechas de vencimiento y costos acumulados.
Problemas Pendientes (Open Issues Report): Análisis estadístico de incidencias recurrentes por prioridad y responsable.
Recursos (Resources Report): Monitoreo de utilización y capacidad de técnicos y maquinaria involucrados.


Caso de Negocio Resuelto: OEC Computers
Escenario 1: Proyecto de Infraestructura IT para "Maxi Teq"
OEC Computers firma un proyecto externo con el cliente Maxi Teq (C20000) para diseñar e implementar un centro de cómputo:

Configuración Inicial: Kate (PM) crea el proyecto MaxiTeq_DC, vinculado al proyecto financiero 101.
Definición de Etapas:
Etapa 1 (Inicio): Asignación del equipo (2% avance).
Etapa 2 (Kickoff): Reunión de inicio (5% avance). Se adjunta actividad CRM de reunión.
Etapa 3 (Planificación): Análisis de brecha / Gap Analysis (10% avance).
Etapa 4 (Adquisición y Ensamble): Dependiente de Etapa 3. Compra de servidores ($15,000 en OPCH) y ensamble de rack mediante Orden de Fabricación (OWOR).
Etapa 5 (Configuración e Integración): Instalación en sitio del cliente. Surge una incidencia sobre certificación de software; Kate vincula la Solución de Servicio Nº 27 (OSOL) y cierra el problema para poder finalizar la etapa.
Etapa 6 (Piloto y Cierre): Firma del acta de entrega (Cierre al 100%).
Escenario 2: Proyecto Corporativo con Subproyectos "Parameter Technologies"
Parameter Technologies contrata a OEC Computers para renovar el equipamiento en sus sedes de Londres y Cambridge:

Se crea el proyecto maestro Parameter100.
Se crea el Subproyecto Londres con un 20% de Contribución.
Al alcanzar el 50% de avance en Londres, la cabecera del proyecto maestro refleja automáticamente: $$\text{Avance Global} = 50% \times 20% = \mathbf{10%}$$
Kate utiliza la opción Añadir subproyecto desde plantilla para generar el subproyecto Cambridge, reutilizando la estructura estándar y acelerando la planificación operativa.


Banco de Evaluación Situacional
Pregunta 1
Al intentar marcar una etapa de un proyecto como 'Finalizada' (Finished) en los Datos Maestros de Proyecto, el sistema muestra un mensaje de error y no permite guardar el cambio. ¿Cuál de las siguientes condiciones es una causa directa de este bloqueo?

A) La etapa tiene asignada una actividad de reunión que ya fue cerrada en el CRM.
B) La etapa tiene registrado al menos un problema o incidencia (Open Issue) con estatus pendiente.
C) El proyecto financiero vinculado tiene facturas de proveedores con fecha posterior a la fecha de inicio.
D) El porcentaje de avance del proyecto principal no ha superado el 50%.
Respuesta Correcta: B
Justificación Técnica: SAP Business One valida que para poder marcar una etapa o tarea como finalizada, todos los incidentes o problemas pendientes (Open Issues) registrados en la matriz inferior de dicha etapa deben estar resueltos y marcados con estatus cerrado (Closed).
Pregunta 2
En un proyecto configurado con subproyectos, el Subproyecto 'Planta Norte' tiene asignado un porcentaje de contribución del 30% sobre el proyecto global. Si el equipo técnico ha completado etapas que equivalen al 60% de avance dentro del subproyecto 'Planta Norte', y los demás subproyectos aún no han iniciado (0%), ¿cuál es el porcentaje de avance (% Completeness) que mostrará el proyecto principal?

A) 18%
B) 30%
C) 60%
D) 90%
Respuesta Correcta: A
Justificación Técnica: El motor de cálculo pondera el avance del subproyecto por su porcentaje de contribución: $$\text{% Avance Global} = 60% \times 30% = 0.60 \times 0.30 = 0.18 = \mathbf{18%}.$$
Pregunta 3
¿Qué mecanismo utiliza SAP Business One 10.0 para sugerir al director de proyecto la vinculación de facturas o pedidos que se crearon en el sistema sin haber especificado la etapa del proyecto?

A) Una alerta obligatoria que bloquea la contabilización de la factura hasta que el usuario ingrese al proyecto.
B) La ventana interactiva 'Asignación de documentos' (Document Assignment), que se abre automáticamente si existen transacciones con el mismo código de Proyecto Financiero (OPRJ) que aún no están asignadas al proyecto.
C) Una rutina periódica de auditoría que se ejecuta únicamente durante el cierre del ejercicio contable.
D) Un informe de reconciliación bancaria en el módulo de Gestión de Bancos.
Respuesta Correcta: B
Justificación Técnica: Al abrir un proyecto maestro vinculado a un proyecto financiero (OPRJ), el sistema audita las tablas transaccionales. Si detecta documentos con dicho código contable que carecen de vínculo a etapas del proyecto, muestra un mensaje de confirmación que abre el asistente de Asignación de Documentos, permitiendo relacionar filas completas a las etapas correspondientes.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
