# Guion de Video: DOC 019 Impl Methodology

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 019 Impl Methodology.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 019: METODOLOGÍA DE IMPLEMENTACIÓN ACELERADA (AIP) EN SAP BUSINESS ONE 10.0
Código de Manual: 10_Impl_21_ImplTools_ImplementationMethodology_ES
Módulo Oficial: Metodología y Gestión de Proyectos de Implementación (Implementation Methodology - AIP)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Jefes de Proyecto, Consultores de Implementación, Líderes Funcionales y Agentes IA (Antigravity)
Carpeta Asociada: 019_10_Impl_21_ImplTools_ImplementationMethodology_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "019",

  "topic": "Accelerated Implementation Program (AIP) & Project Governance",

  "sap_module": "Implementation_Methodology",

  "framework": "SAP Accelerated Implementation Program (AIP) / SAP Activate for B1",

  "phases": [

    {

      "phase_id": 1,

      "name": "Preparación del proyecto (Project Preparation)",

      "milestones": [

        "Transferencia formal de ventas a consultoría (Sales Handover)",

        "Reunión de inicio (Kick-off meeting) con patrocinador y equipo del cliente",

        "Evaluación de infraestructura técnica, redes y servidores",

        "Entrega e instalación del software con base de datos de demostración",

        "Aprobación del acta de inicio y plan de proyecto base"

      ]

    },

    {

      "phase_id": 2,

      "name": "Blueprint empresarial (Business Blueprint)",

      "milestones": [

        "Talleres departamentales de procesos (Ventas, Compras, Finanzas, Logística, Producción)",

        "Análisis de brechas y coincidencias (Fit/Gap Analysis)",

        "Documentación del diseño conceptual y configuración del sistema",

        "Estrategia y dimensionamiento de la migración de datos existentes",

        "Firma y aceptación formal del Business Blueprint (alcance contractual cerrado)"

      ]

    },

    {

      "phase_id": 3,

      "name": "Realización del proyecto (Project Realization)",

      "milestones": [

        "Parametrización y configuración de la base de datos de producción",

        "Customizing: Creación de UDF, UDT, UDO, búsquedas formateadas (FMS) y modelos de IU",

        "Migración de prueba de datos maestros con Data Transfer Workbench (DTW)",

        "Ejecución de pruebas unitarias e integrales del sistema con datos del cliente",

        "Diseño del plan de capacitación y preparación del entorno de pruebas"

      ]

    },

    {

      "phase_id": 4,

      "name": "Preparación final (Final Preparation)",

      "milestones": [

        "Capacitación intensiva a usuarios finales y superusuario del cliente",

        "Auditoría de operatividad y verificación de preparación para el corte (Readiness Check)",

        "Plan de transición (Cutover Plan) y congelamiento de transacciones en sistema legado",

        "Carga final de saldos iniciales (Libro Mayor, cartera de clientes, cuentas por pagar, stock valorizado)"

      ]

    },

    {

      "phase_id": 5,

      "name": "Puesta en marcha y soporte (Go-Live & Support)",

      "milestones": [

        "Arranque productivo en vivo (Go-Live)",

        "Acompañamiento in-situ durante el primer cierre contable y operativo",

        "Resolución de incidencias críticas pos-arranque",

        "Traspaso formal a la mesa de ayuda/soporte del partner o SAP",

        "Cierre formal del proyecto y plan de mejora continua"

      ]

    }

  ],

  "stakeholders_matrix": {

    "partner_side": ["Jefe de Proyecto", "Consultor Funcional / Empresarial", "Consultor Técnico"],

    "customer_side": ["Patrocinador / Propietario", "Jefe de Proyecto Cliente", "Líderes Funcionales (Key Users)", "Superusuario", "Administrador de Sistemas"]

  },

  "ecosystem_resources": [

    "SAP PartnerEdge (plantillas AIP en Word/Excel, guías de configuración)",

    "Support Launchpad (descarga de parches y gestión de claves de licencia)",

    "LPE (Local Product Expert - soporte normativo y tributario por país)",

    "SAP Community & Learning Hub (capacitación oficial y foros técnicos)"

  ]

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Importancia de una Metodología Demostrada
Implementar un sistema ERP como SAP Business One 10.0 trasciende la mera instalación de paquetes de software: implica una transformación de procesos empresariales y de gestión del cambio. Las estadísticas de la industria señalan que las dificultades más severas en implementaciones no provienen de bugs en el software, sino de:

Definición deficiente o ambigua del alcance inicial.
Expectativas irreales de clientes derivadas de una preventa no controlada.
Subestimación del tiempo y esfuerzo requeridos para la limpieza y migración de datos maestros y saldos contables.
Falta de involucramiento y capacitación oportuna de los usuarios clave (Key Users).

Para mitigar estos riesgos, SAP diseñó el Programa de Implementación Acelerada (AIP - Accelerated Implementation Program), una metodología ágil estructurada en 5 fases secuenciales gobernadas por hitos formales de aceptación.
2.2 Desglose Funcional de las 5 Fases de AIP
Fase 1: Preparación del Proyecto
Traspaso de Ventas (Sales Handover): El equipo de consultoría recibe del equipo comercial el contexto de negocio, objetivos estratégicos, puntos de dolor y restricciones operativas pactadas.
Reunión Inicial (Kick-off): Se alinea el cronograma, se presenta al equipo de trabajo y se establece el compromiso de dedicación horaria del personal del cliente.
Instalación Temprana: Se entrega e instala el software con una base de datos demo para permitir que los usuarios comiencen a familiarizarse con la interfaz Fiori desde el primer día.
Fase 2: Blueprint Empresarial (Diseño Conceptual)
Talleres Departamentales: Se ejecutan sesiones de trabajo por procesos (Ventas, Compras, Inventario, Bancos, Finanzas).
Análisis Fit/Gap: Se confronta la operación actual del cliente frente al estándar de SAP B1, identificando qué requerimientos se cubren nativamente y cuáles requieren personalizaciones (UDF, FMS) o add-ons.
El Blueprint: Es el documento maestro contractual que congela el alcance funcional del proyecto. Cualquier requerimiento surgido con posterioridad debe someterse a un procedimiento formal de gestión de cambios.
Fase 3: Realización del Proyecto
Configuración del Entorno Productivo: Se inicializa el Plan de Cuentas, monedas, periodos, determinación de cuentas de mayor y parametrizaciones de documentos.
Extensibilidad: Se configuran campos de usuario (CUFD), búsquedas formateadas (OUQR) y modelos de interfaz de usuario.
Migración de Datos de Prueba: Se utiliza Data Transfer Workbench (DTW) para cargar maestros de socios de negocios y artículos, permitiendo ejecutar pruebas integrales de simulación (User Acceptance Testing - UAT).
Fase 4: Preparación Final
Capacitación a Usuarios: Formación basada en roles operativos utilizando manuales de procedimientos adaptados a la realidad del cliente.
Comprobación de Disponibilidad (Readiness Check): Verificación de que la infraestructura de red, impresoras de códigos de barras, respaldos automáticos y licencias estén 100% listas.
Corte Operativo (Cutover): Se define la fecha de congelamiento contable del sistema antiguo y se cargan los saldos iniciales definitivos: Balance de Sumas y Saldos, Facturas pendientes de cobro y pago, y stock físico valorizado.
Fase 5: Puesta en Marcha y Soporte
El sistema entra en operación real.
Los consultores brindan soporte presencial de primera línea en los escritorios de los usuarios (Floor Support).
Se acompaña el primer cierre mensual y, una vez estabilizada la operación, se suscribe el acta de cierre del proyecto y se transfiere la cuenta a la mesa de ayuda (Support Desk).


3. ATLAS METODOLÓGICO: HITOS Y FLUJO SECUENCIAL AIP
  FASE 1: PREPARACIÓN           FASE 2: BLUEPRINT            FASE 3: REALIZACIÓN

┌───────────────────────┐     ┌───────────────────────┐    ┌───────────────────────┐

│ • Kick-off Meeting    │     │ • Talleres Procesos   │    │ • Parametrización     │

│ • Instalación Base B1 │ ──> │ • Fit/Gap Analysis    │──> │ • Customizing & UDF   │

│ • Aceptación Fase 1   │     │ • Firma de Blueprint  │    │ • Carga DTW de Prueba │

└───────────────────────┘     └───────────────────────┘    └───────────────────────┘

                                                                       │

                                                                       ▼

  FASE 5: GO-LIVE & SOPORTE     FASE 4: PREPARACIÓN FINAL              │

┌───────────────────────┐     ┌───────────────────────┐                │

│ • Soporte In-Situ     │     │ • Capacitación Roles  │                │

│ • Cierre 1er Mes      │ <── │ • Carga Saldos Corte  │ <──────────────┘

│ • Traspaso a Mesa     │     │ • Readiness Check OK  │

└───────────────────────┘     └───────────────────────┘


4. CASO DE NEGOCIO RESUELTO: IMPLEMENTACIÓN EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers contrata la implementación de SAP Business One 10.0 en sus dos sedes (Nueva York y Los Ángeles).

Patrocinador: Director General.
Líder de Finanzas: María.
Líder de Almacén: George.
Desafío Crítico: El catálogo actual tiene 15,000 artículos en hojas de Excel dispersas y con descripciones redundantes.
Aplicación de Buenas Prácticas AIP:
Fase 1: En la reunión inicial, el consultor expone con claridad que el equipo de OEC Computers debe dedicar al menos 15 horas semanales al proyecto y se establece la necesidad inmediata de depurar el catálogo de artículos.
Fase 2: Durante los talleres de compras y almacén, se acuerda unificar los 15,000 registros en 6,500 artículos estándar con grupos definidos y se documenta en el Business Blueprint. María y George firman el documento de alcance.
Fase 3: Se crean las plantillas de DTW para artículos y clientes. En la base de datos de pruebas se cargan 1,000 artículos muestra y George ejecuta pruebas de recepción y picking. Se detecta que faltaban campos de peso para las estanterías; se añaden como UDF sin desvíos de cronograma.
Fase 4: Dos semanas antes de la salida en vivo, se realiza la formación de los operarios de almacén y vendedores. El viernes a las 18:00 se realiza el corte en el sistema legado, el sábado se cargan los saldos de clientes, proveedores e inventario valorizado con DTW, y el domingo se audita la cuadratura contable.
Fase 5: El lunes a las 08:00 OEC Computers arranca operaciones en SAP Business One. El consultor acompaña las primeras 48 horas resolviendo dudas de facturación, logrando un cierre exitoso sin interrupción del servicio al cliente.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
En la metodología AIP (Accelerated Implementation Program) de SAP Business One, ¿cuál es el entregable formal y contractual más crítico de la Fase 2 que define el alcance definitivo del proyecto?
A) El contrato de mantenimiento de hardware.
B) El Business Blueprint (Diseño Conceptual Empresarial), que documenta detalladamente cómo se configurará el sistema para soportar los procesos empresariales del cliente.
C) El primer balance general de la empresa.
D) El fichero de licencia de prueba.
Respuesta Correcta: B
Justificación Técnica: El Business Blueprint representa la hoja de ruta y la línea base contractual del proyecto; documenta los procesos acordados y la configuración requerida, congelando el alcance antes de iniciar la parametrización en la Fase 3.
Pregunta 2
¿Qué actividad crítica debe completarse estrictamente durante la Fase 4 (Preparación Final) justo antes de abrir el sistema para la puesta en marcha en vivo?
A) Instalar los servidores físicos desde cero.
B) Capacitar a los usuarios finales y migrar los saldos iniciales definitivos de cuentas por cobrar, cuentas por pagar, stock físico e inventario contable.
C) Redactar el contrato comercial de preventa.
D) Eliminar las parametrizaciones de documentos.
Respuesta Correcta: B
Justificación Técnica: En la Preparación Final se ejecutan las actividades de corte (Cutover), asegurando que los usuarios estén capacitados y que los saldos vivos del negocio migren con exactitud matemática al momento del arranque.
Pregunta 3
¿Por qué motivo se considera que la migración de datos es habitualmente una de las tareas más difíciles y que consume más tiempo en un proyecto de implementación?
A) Porque SAP Business One no cuenta con herramientas de carga de datos.
B) Porque los datos del cliente en sistemas legados suelen estar desactualizados, duplicados o con estructuras inconsistentes que requieren depuración exhaustiva y mapeo técnico detallado hacia las tablas del ERP.
C) Porque solo se puede migrar un registro por día.
D) Porque los datos de clientes son confidenciales y no pueden importarse.
Respuesta Correcta: B
Justificación Técnica: La calidad de la información histórica suele ser deficiente; mapear estructuras heterogéneas de bases de datos antiguas hacia las tablas normalizadas de SAP mediante DTW exige limpieza profunda y validaciones relacionales rigurosas.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
