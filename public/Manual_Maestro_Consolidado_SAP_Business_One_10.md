# MANUAL MAESTRO DE CAPACITACIÓN Y BASE DE CONOCIMIENTO OPERATIVA

## SAP BUSINESS ONE 10.0 (VERSIONES SQL SERVER & SAP HANA)

### Compendio Integral para Plataforma Educativa, Academia Online y Entrenamiento de Copiloto IA

> **Autor / Arquitectura Curricular:** SoftIA Tech & Academia ERP  
> **Versión del Compendio:** 1.0 Consolidada  
> **Estructura:** 12 Módulos Curriculares | 48 Lecciones Operativas | 24 Casos y Evaluaciones Situacionales | 36 Guiones de Locución IA (ElevenLabs)  
> **Propósito:** Base de conocimiento completa y unificada diseñada para ingesta en modelos de lenguaje (LLMs), arquitecturas RAG, asistentes virtuales y diseño curricular de LMS interactivo.

---

## GUÍA DE SISTEMA PARA EL COPILOTO IA (PROMPT DE CONTEXTO)

Cuando este documento sea cargado como contexto para un modelo de inteligencia artificial (LLM) que actúe como tutor, consultor o generador de cursos:

1. **Rol:** Actúas como Consultor Senior Certificado en SAP Business One 10.0 y Tutor Pedagógico Especialista.  
2. **Precisión Técnica:** Basa tus explicaciones, rutas de menú y sintaxis contable/SQL exclusivamente en los flujos oficiales documentados en este manual.  
3. **Regla de Integridad de Datos:** Enfatiza siempre los controles del sistema (irreversibilidad de inventario permanente, imposibilidad de asientos manuales a cuentas asociadas, validación de DI-API en DTW, obligatoriedad de RSP para soporte oficial).  
4. **Enfoque Pedagógico:** Al interactuar con estudiantes, combina la explicación conceptual (por qué ocurre) con el procedimiento paso a paso en pantalla (cómo se ejecuta) y el impacto contable/logístico en el balance y los almacenes.

---

## TABLA DE CONTENIDO GENERAL

- [Módulo 01: Fundamentos, Navegación y Entorno Fiori](#módulo-01-fundamentos-navegación-y-entorno-fiori-sap-business-one-100--erp)  
- [Módulo 02: Compras y Aprovisionamiento (Procure-to-Pay)](#módulo-02-compras-y-aprovisionamiento-procure-to-pay-sap-business-one-100--erp)  
- [Módulo 03: Ventas y Clientes (Order-to-Cash)](#módulo-03-ventas-y-clientes-order-to-cash-sap-business-one-100--erp)  
- [Módulo 04: Gestión de Inventario y Almacenes](#módulo-04-gestión-de-inventario-y-almacenes-valoración-movimientos-ubicaciones-y-recuentos-físicos-sap-business-one-100--erp)  
- [Módulo 05: Planificación de Necesidades y Producción (MRP & BOM)](#módulo-05-planificación-de-necesidades-mrp-y-gestión-de-producción-sap-business-one-100--erp)  
- [Módulo 06: Gestión de Servicio al Cliente (SLA y Equipos)](#módulo-06-gestión-de-servicio-al-cliente-tarjetas-de-equipo-contratos-sla-y-llamadas-de-servicio-sap-business-one-100--erp)  
- [Módulo 07: Gestión de Proyectos y Facturación por Hitos](#módulo-07-gestión-de-proyectos-y-facturación-por-hitos-project-management--billing-wizard-sap-business-one-100--erp)  
- [Módulo 08: Administración del Sistema, Migración (DTW) y Seguridad](#módulo-08-administración-del-sistema-migración-de-datos-dtw-y-seguridad-sap-business-one-100--erp)  
- [Módulo 09: Soporte Técnico, Diagnóstico y Plataforma RSP](#módulo-09-soporte-técnico-herramientas-de-diagnóstico-y-plataforma-de-soporte-remoto-rsp-sap-business-one-100--erp)  
- [Módulo 10: Contabilidad Financiera, Gestión Bancaria y Activos Fijos](#módulo-10-contabilidad-financiera-gestión-bancaria-y-activos-fijos-sap-business-one-100--erp)  
- [Módulo 11: Personalización Avanzada, Automatizaciones y Analítica HANA](#módulo-11-personalización-avanzada-automatizaciones-y-analítica-en-tiempo-real-sap-business-one-100--erp)  
- [Módulo 12: Metodología de Implementación (AIP), Parametrizaciones y Quick Copy](#módulo-12-metodología-de-implementación-aip-parametrizaciones-irreversibles-y-quick-copy-sap-business-one-100--erp)

---

\================================================================================

﻿MÓDULO 01: FUNDAMENTOS, NAVEGACIÓN Y ENTORNO FIORI (SAP BUSINESS ONE 10.0 & ERP) Tipo de Contenido: Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA Fuentes Oficiales Analizadas: 10\_Intro\_11\_Overview\_IntroSAPB1\_ES.pdf, 10\_Intro\_12\_Overview\_GettingStarted\_ES.pdf y CSL01\_Introduction\_Solution\_ES.pdf Nivel: Inicial / Consultoría y Operación Básica Tiempo Estimado de Estudio: 45 minutos (dividido en 3 lecciones integradas)

---

ÍNDICE DEL MÓDULO

1. Lección 1.1: Visión General, Arquitectura Técnica y Modelo de Empresa  
2. Lección 1.2: Navegación, Búsquedas y Personalización del Cockpit Fiori  
3. Lección 1.3: Caso Práctico Resuelto \- Configuración, Ventas y Auditoría Documental  
4. Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA  
5. Banco de Evaluación Situacional

---

LECCIÓN 1.1: VISIÓN GENERAL, ARQUITECTURA TÉCNICA Y MODELO DE EMPRESA

1. Propósito y Contexto de Negocio SAP Business One es una suite empresarial integrada (ERP) diseñada para pequeñas y medianas empresas (PyMEs), que centraliza la totalidad de las operaciones (Ventas, Compras, Finanzas, Inventario, Producción/MRP, Servicios y Proyectos) en una única base de datos transaccional, eliminando islas de información y discrepancias entre departamentos.  
2. Fundamentos de Arquitectura Técnica A. Modelo de Datos y Empresa  
* Una empresa \= Una base de datos: Cada razón social o entidad legal independiente se gestiona en una base de datos propia.  
* Acceso multisociedad: Si una organización posee múltiples personerías jurídicas con balances contables separados, el usuario inicia sesión seleccionando la empresa específica.  
* Cambio de empresa: Gestión \> Seleccionar empresa o haciendo clic directo sobre el nombre de la empresa ubicado en el centro superior de la pantalla principal. B. Plataformas de Base de Datos y Despliegue  
1. SAP HANA:  
   * Motor de computación in-memory (en memoria RAM).  
   * Habilita la interfaz gráfica Cockpit Fiori (HTML5), analíticas avanzadas en tiempo real, búsqueda federada global (Enterprise Search) y vistas de cálculo semánticas.  
2. Microsoft SQL Server:  
   * Motor relacional estándar basado en disco. No dispone del entorno Cockpit Fiori ni de Enterprise Search avanzado.  
3. Modalidades de Despliegue:  
   * On-Premise (Local): Control absoluto sobre el hardware interno, cumplimiento de seguridad interna de datos, licencia perpetua con inversión de capital inicial (CapEx).  
   * Cloud (Nube / SaaS): Acceso vía Web Client / navegador, licenciamiento por suscripción operativa (OpEx), escalabilidad inmediata sin mantenimiento de servidores locales. C. Tipos de Usuario y Esquema de Licenciamiento  
* Superusuario: Acceso total e irrestricto al sistema, funciones de administración, configuración del sistema y todas las opciones de menú. No está sujeto a bloqueos de autorizaciones generales.  
* Usuario Final / Normal: Acceso restringido y delimitado según:  
  1. El tipo de licencia asignada (Profesional, Limitada CRM, Limitada Logística, Limitada Financiera).  
  2. La matriz de autorizaciones generales (Gestión \> Inicialización del sistema \> Autorizaciones).

---

LECCIÓN 1.2: NAVEGACIÓN, BÚSQUEDAS Y PERSONALIZACIÓN DEL COCKPIT FIORI

1. Elementos de la Interfaz de Usuario ┌────────────────────────────────────────────────────────────────────────┐ │ \[Menú Superior\] Fichero | Tratar | Datos | Ir a | Herramientas | Ayuda │ ├────────────────────────────────────────────────────────────────────────┤ │ \[Barra de Herramientas\] (Iconos: Filtro, Imprimir, Excel, PDF, Buscar)│ ├───────────────────┬────────────────────────────────────────────────────┤ │ \[Menú Principal / │ \[ÁREA DE TRABAJO / COCKPIT FIORI\]                  │ │  Módulos\]         │  \- Widgets de Workbench (Flujo visual de procesos) │ │  \- Gestión        │  \- Widgets de Funciones Comunes (Accesos rápidos)  │ │  \- Finanzas       │  \- Widgets de Recuento (Alertas de documentos)     │ │  \- Compras        │  \- Indicadores Clave de Rendimiento (KPIs)         │ │  \- Ventas         │  \- Paneles Analíticos (Dashboards de ventas/stock) │ │  \- Inventario     │  \- Mis Actualizaciones Recientes                   │ └───────────────────┴────────────────────────────────────────────────────┘ A. Barra de Menús y Barra de Herramientas  
* Iconos Activos vs. Inactivos: Los iconos disponibles para el formulario en foco se iluminan en color; las funciones bloqueadas aparecen en gris.  
* Exportación Directa: Integración nativa con Microsoft Office 365, OneDrive, exportación a Excel, Word y generación instantánea de PDF.  
* Log de Mensajes del Sistema: Panel inferior flotante o acoplable que registra los últimos 50 mensajes, advertencias o errores del sistema. Cada error técnico contiene un código de 8 o 9 dígitos que actúa como clave de búsqueda en el portal de ayuda de SAP. B. Métodos de Búsqueda y Navegación Rápida  
1. Desglose Estructurado del Menú: Icono de carpeta (indica submenú anidado) vs. guion \- (indica transacción ejecutable).  
2. Búsqueda de Menús: Campo de texto en la parte superior del menú. Al escribir palabras clave (ej. "maestros artículo" o "pedido"), el sistema lista dinámicamente las rutas completas de acceso.  
3. Enterprise Search (Solo SAP HANA): Búsqueda global tipo Google en la esquina superior derecha. Busca en texto completo sobre todas las tablas del sistema (clientes, artículos, ofertas, pedidos, notas). Permite filtrar por tipo de documento y fechas.  
4. Arrastrar y Vincular (Drag & Relate): Herramienta interactiva de Business Intelligence operacional. Permite arrastrar un código (ej. Código de Cliente C20000) desde cualquier documento directamente sobre un reporte del árbol de Drag & Relate (ej. Ventas \> Pedidos de cliente) para generar un informe instantáneo filtrado por ese cliente.  
5. Flecha Naranja de Vínculo (Golden Arrow): Icono de navegación contextual ubicado junto a campos clave (Código de cliente, Número de artículo, Cuenta contable). Al hacer clic, abre de forma inmediata el registro maestro subyacente.

---

2. Anatomía y Configuración del Cockpit Fiori El Cockpit Fiori transforma el escritorio del usuario en un centro de control operativo y analítico basado en HTML5. Catálogo de Widgets Disponibles:  
3. Workbench (Banco de Trabajo): Diagrama de flujo visual que cubre el 80% de las tareas diarias de un rol específico. Existen 4 workbenches estándar:  
   * Ventas: Oferta \-\> Pedido \-\> Entrega \-\> Factura.  
   * Compras: Pedido de compra \-\> Entrada de mercancías \-\> Factura de proveedores.  
   * Finanzas: Pagos, Asientos, Conciliaciones, Plan de cuentas.  
   * Inventario: Solicitudes de traslado, Transferencias, Recuentos de stock. (Nota: Los iconos con punto azul dentro del workbench tienen menús contextuales para abrir documentos preliminares o listas de partidas abiertas).  
4. Funciones Comunes: Contenedor de accesos directos personalizable. El usuario arrastra cualquier opción de menú dentro del widget para abrirla con un solo clic.  
5. Mis Actualizaciones Recientes: Historial dinámico de los últimos datos maestros y documentos modificados o guardados por el usuario conectado.  
6. Recuento de Business Object: Widget numérico que ejecuta consultas preconfiguradas en segundo plano (ej. Número de facturas de clientes vencidas, Pedidos de compra no recibidos, Solicitudes de traslado pendientes).  
7. Indicadores Clave de Rendimiento (KPIs): Bloques numéricos grandes con código de color (verde/rojo) y flechas de tendencia que comparan el desempeño real frente a metas estratégicas.  
8. Paneles de Análisis Detallado (Dashboards): Gráficos interactivos construidos sobre vistas semánticas de SAP HANA (ej. Top 5 clientes por facturación, Artículos con mayor rotación). Procedimiento para Personalizar el Cockpit:  
9. Hacer clic en el icono del Lápiz (Editar Cockpit) en la esquina superior.  
10. Hacer clic en el icono \+ para desplegar la Galería de Widgets.  
11. Filtrar por categoría (Operativos, Análisis, Otros) y presionar \+ en los widgets deseados.  
12. Reorganizar arrastrando y soltando en la cuadrícula.  
13. Para eliminar un widget, arrastrarlo hacia la papelera en la esquina inferior derecha.  
14. Guardar cambios:  
    * Opción 1: Actualizar mi cockpit (afecta únicamente al usuario actual).  
    * Opción 2: Grabar como modelo (permite publicar la plantilla para asignarla a grupos de usuarios). Asignación Institucional de Cockpits por Roles:  
* Ruta de configuración: Gestión \> Configuración \> General \> Grupos de usuarios.  
* Se selecciona un Grupo de Autorizaciones (ej. Grupo Ventas, Grupo Inventario) y se vincula el Cockpit correspondiente como plantilla predeterminada para todos los integrantes del grupo.

---

LECCIÓN 1.3: CASO PRÁCTICO RESUELTO \- CONFIGURACIÓN, VENTAS Y AUDITORÍA DOCUMENTAL Caso de Estudio Oficial: OEC Computers \- Introducción y Gestión Comercial (CSL01\_Introduction\_Solution\_ES.pdf) Escenario Operativo Bill se incorpora a OEC Computers como Jefe de Ventas. Requiere configurar su entorno de trabajo, asumir la titularidad comercial de clientes clave, emitir una oferta con estructura compleja, convertirla en pedido y auditar transacciones abiertas mediante cuatro métodos distintos.

---

TAREA 1: Asignación de Plantilla de Cockpit de Ventas

1. Abrir el gestor de cockpits y seleccionar la plantilla Ventas.  
2. Regla de Autorización: Para que un usuario final pueda visualizar y operar las transacciones incluidas en la plantilla, debe contar con los permisos correspondientes. Si carece de autorización en facturación, el icono de factura en el workbench se mostrará bloqueado.

---

TAREA 2: Asignación de Empleado de Ventas en Interlocutor Comercial

1. Abrir Datos Maestros:  
   * Opción visual: Clic en el icono de Cliente en el Workbench de Ventas.  
   * Opción menú: Ventas \- Clientes \> Datos maestros interlocutor comercial.  
2. Búsqueda: Presionar modo Buscar (Ctrl \+ F), ingresar código de cliente (ej. C20000) y pulsar Enter.  
3. Modificación: En el campo Empleado de ventas, seleccionar "Jefe de ventas" en el menú desplegable.  
4. Actualizar: Pulsar botón Actualizar para grabar el cambio en la base de datos.

---

TAREA 3: Configuración del Widget "Funciones Comunes"

1. Activar modo edición del cockpit (icono Lápiz).  
2. Abrir Galería de widgets (+), seleccionar categoría Otros y agregar Funciones comunes.  
3. Desde el árbol de menú principal, localizar la transacción Actividad (Gestión de relaciones con el cliente \> Actividad) y arrastrarla directamente al contenedor del widget.  
4. Guardar los cambios pulsando la marca de verificación superior.

---

TAREA 4: Creación de Oferta de Ventas con Líneas Complejas

1. Ruta: Ventas \- Clientes \> Oferta de ventas.  
2. Cabecera: Seleccionar Cliente C20000. El sistema carga automáticamente condiciones fiscales y comerciales.  
3. Línea 1 (Texto libre):  
   * Para insertar texto explicativo o cláusulas comerciales, el campo Tipo debe estar configurado como Texto en lugar de Artículo.  
   * Verificación técnica: Si la columna Tipo no se visualiza, ir a la barra de herramientas, abrir Parametrizaciones de formulario (icono de engranaje) y marcar la casilla Visible para la columna Tipo.  
4. Líneas 2 y 3 (Artículos de hardware):  
   * Añadir artículo A00002 y A00005 con sus respectivas cantidades.  
5. Línea 4 (Subtotal):  
   * Cambiar el campo Tipo a Subtotal. El sistema calcula automáticamente la suma parcial de los artículos anteriores.  
6. Línea 5 (Artículo final):  
   * Añadir artículo C00008 con su cantidad.  
7. Descuento Global:  
   * En el pie de documento, campo Descuento %, ingresar 5%.  
8. Creación: Pulsar Crear y visualizar (o Añadir).

---

TAREA 5: Búsqueda y Conversión de Oferta a Pedido de Cliente

1. Localización mediante Enterprise Search:  
   * En el buscador global superior, ingresar el código C20000 y la fecha de contabilización.  
   * Hacer clic directo en el enlace del documento para abrir la Oferta de ventas.  
2. Copia de Documento (Copiar a):  
   * En la esquina inferior derecha de la Oferta, hacer clic en el botón Copiar a \> Pedido de cliente.  
   * Efecto del sistema: Se transfieren íntegramente las líneas de artículos, precios negociados, textos y descuentos sin requerir reescritura manual.  
3. Datos Mandatorios: Ingresar la Fecha de entrega requerida (campo obligatorio para pedidos).  
4. Registrar: Pulsar botón Crear.

---

TAREA 6: Las 4 Vías de Auditoría de Pedidos Abiertos Cuando la dirección consulta el estado de los pedidos de un cliente, SAP Business One ofrece cuatro mecanismos con diferentes niveles de profundidad: Método Procedimiento Operativo Ventaja Competitiva 1\. Desde Datos Maestros Abrir cliente C20000, buscar el campo numérico Pedidos y hacer clic en la flecha naranja de vínculo. Acceso inmediato desde la ficha comercial del cliente. 2\. Mediante Arrastrar y Vincular (Drag & Relate) Seleccionar la pestaña lateral Drag & Relate \> Ventas \- Clientes. Resaltar con el ratón el código C20000 en la pantalla y arrastrarlo sobre el nodo Pedido de cliente. Filtrar por columna Status \= "Abierto". Análisis interactivo sin abrir transacciones pesadas. 3\. Lista de Partidas Abiertas En el Workbench de Ventas, desplegable de Pedidos \> Lista de partidas abiertas. Seleccionar objeto Pedidos de cliente y ordenar por código. Visión panorámica de toda la empresa con opción de cierre masivo. 4\. Enterprise Search (HANA) Buscar C20000, abrir el filtro de layout lateral Pedido de cliente y desmarcar el check de documentos Cerrados. Búsqueda global ultrarrápida sin conocer la ruta de menú. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA Esta sección constituye la base de conocimiento para que el Asistente Inteligente asesore a usuarios ante incidencias en este módulo: Problema 1: "No encuentro una transacción en el menú principal"

* Causa Raíz: El usuario tiene autorizaciones restringidas para esa función, o la opción está oculta mediante parametrizaciones de formulario del menú principal.  
* Instrucción de Asesoría:  
  1. Utilizar el buscador de menús superior escribiendo el nombre de la transacción. Si no aparece, es síntoma inequívoco de falta de permisos.  
  2. Verificar con un Superusuario en Gestión \> Inicialización del sistema \> Autorizaciones.  
  3. Revisar si la opción fue desmarcada en el icono de llave inglesa junto al menú de búsqueda (Parametrizaciones de formulario \- Menú principal). Problema 2: "En el documento de venta no puedo ingresar filas de texto o subtotales"  
* Causa Raíz: La columna Tipo no está visible en la cuadrícula de líneas del documento.  
* Instrucción de Asesoría:  
  1. Abrir la ventana del documento (Oferta, Pedido o Factura).  
  2. Hacer clic en el icono Parametrizaciones de formulario (engranaje) en la barra de herramientas superior.  
  3. En la pestaña Formato de tabla, buscar la fila Tipo.  
  4. Marcar las casillas Visible y Activo. Pulsar Actualizar. Problema 3: "Modifiqué mi Cockpit pero al reiniciar el sistema volvió a como estaba antes"  
* Causa Raíz: El usuario editó los widgets pero no confirmó con la marca de verificación, o sus modificaciones fueron sobrescritas por una directiva de grupo de cockpit forzada por el administrador.  
* Instrucción de Asesoría:  
  1. Al finalizar las modificaciones en modo edición (icono lápiz), es indispensable hacer clic en la marca de verificación superior.  
  2. Seleccionar explícitamente Actualizar mi cockpit.  
  3. Si persiste, verificar en Gestión \> Parametrizaciones generales \> Cockpit si la empresa tiene habilitado el cockpit a nivel global.

---

BANCO DE EVALUACIÓN SITUACIONAL Pregunta 1 (Arquitectura) Una corporación adquiere dos empresas filiales en Ecuador con personerías jurídicas distintas. ¿Cómo debe configurarse la arquitectura en SAP Business One?

* A) Ambas filiales deben operar en la misma base de datos usando series de numeración separadas.  
* B) Se debe crear una base de datos independiente para cada personería jurídica, permitiendo al usuario alternar entre ellas mediante la selección de empresa. \[CORRECTA\]  
* C) SAP Business One no admite múltiples personerías jurídicas.  
* D) Se debe instalar una instancia de servidor independiente por cada empresa. Explicación: En SAP Business One, cada entidad legal con contabilidad y balances propios está representada por una base de datos única para garantizar la integridad fiscal y contable. Pregunta 2 (Operaciones y Navegación) Un vendedor necesita consultar con urgencia todos los pedidos abiertos de un cliente mientras conversa con él por teléfono. ¿Cuál es el método más rápido sin abandonar el documento actual?  
* A) Salir de SAP, abrir Excel y consultar el reporte de ventas del mes pasado.  
* B) Utilizar la herramienta Drag & Relate, arrastrando el código del cliente sobre el informe de Pedidos de cliente, o hacer clic en la flecha naranja del campo pedidos en sus datos maestros. \[CORRECTA\]  
* C) Recrear la oferta desde cero para ver qué artículos faltan.  
* D) Abrir el módulo de finanzas y revisar el libro mayor. Explicación: Tanto la flecha de vínculo en datos maestros como Drag & Relate permiten navegar al historial de pedidos abiertos en dos clics sin interrumpir el flujo de trabajo.

---

GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS) \[ { "scene": "01\_bienvenida\_entorno", "voicePrompt": "Cálido, profesional y didáctico", "text": "Bienvenido al ecosistema de SAP Business One. A diferencia de un software contable convencional, aquí toda la empresa respira a través de una base de datos centralizada. Lo que registras en el mostrador de ventas impacta en el almacén y en los libros contables en una fracción de segundo. Empecemos dominando tu escritorio de trabajo.", "durationEstimate": "14s" }, { "scene": "02\_cockpit\_fiori", "voicePrompt": "Enfocado y explicativo", "text": "Fíjate en tu pantalla. Este es el Cockpit estilo Fiori. En lugar de navegar por menús infinitos, tienes workbenches visuales con el flujo natural de tu negocio. Si eres de ventas, ves directamente: oferta, pedido y entrega. Además, los widgets de recuento te alertan en tiempo real si tienes pedidos pendientes o clientes con saldo vencido.", "durationEstimate": "16s" }, { "scene": "03\_regla\_copiar\_a", "voicePrompt": "Enfático en mejores prácticas", "text": "Recuerda esta regla de oro en cualquier ERP de clase mundial: nunca vuelvas a digitar información que ya existe. Si tu cliente te aprueba una oferta, utiliza siempre el botón 'Copiar a' para generar el pedido. Esto garantiza que los precios pactados se respeten y crea un mapa de relaciones inalterable que te agradecerá el departamento de auditoría.", "durationEstimate": "18s" } \]

\================================================================================

﻿MÓDULO 02: COMPRAS Y APROVISIONAMIENTO (PROCURE-TO-PAY) (SAP BUSINESS ONE 10.0 & ERP) Tipo de Contenido: Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA Fuentes Oficiales Analizadas: 10\_Purch\_11\_Process\_Process\_ES.pdf, 10\_Purch\_21\_Issues\_GRPO\_ES.pdf, 10\_Purch\_22\_Issues\_ReturnsCM\_ES.pdf, CSL02\_Procurement\_Process\_ES.pdf y CSL02\_Procurement\_Process\_Solution\_ES.pdf Nivel: Intermedio / Especialista en Cadena de Suministro y Finanzas Operativas Tiempo Estimado de Estudio: 60 minutos (dividido en 4 lecciones integradas)

---

ÍNDICE DEL MÓDULO

1. Lección 2.1: El Ciclo Estándar Procure-to-Pay (P2P) y Reglas Contables  
2. Lección 2.2: Gestión de Entregas Parciales, Excesos y Sustitución de Artículos  
3. Lección 2.3: Devoluciones, Abonos de Proveedor y Cancelación de Documentos  
4. Lección 2.4: Caso Práctico Resuelto Oficial \- Flujo Integral de Aprovisionamiento  
5. Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA  
6. Banco de Evaluación Situacional  
7. Guiones Humanizados para Locución IA (ElevenLabs)

---

LECCIÓN 2.1: EL CICLO ESTÁNDAR PROCURE-TO-PAY (P2P) Y REGLAS CONTABLES

1. Las 4 Etapas del Ciclo de Compras El proceso de aprovisionamiento no es un simple intercambio de dinero por mercancía, sino un flujo de control de materiales y financiero que asegura que los insumos correctos lleguen al costo pactado y en la fecha prevista: \[ 1\. Pedido de Compra (PO) \] │ (Compromiso comercial. No afecta inventario físico ni contabilidad) ▼ \[ 2\. Pedido de Entrada de Mercancías (GRPO) \] │ (Recepción física en almacén. Sube stock. Asiento de provisión) ▼ \[ 3\. Factura de Proveedores (A/P Invoice) \] │ (Recepción fiscal. Liquida provisión y genera Cuenta por Pagar) ▼ \[ 4\. Pago Efectuado (Outgoing Payment) \] │ (Gestión de Bancos: Transferencia, Cheque, Efectivo o Tarjeta)

---

2. Datos Maestros Clave en el Circuito de Compras A. Interlocutor Comercial tipo Proveedor  
* Identificación: Código único (ej. V10000), razón social y datos fiscales (RUC / CIF / NIF).  
* Direcciones: Dirección de factura (fiscal) y dirección de entrega/almacén.  
* Condiciones de Pago: Días de crédito, lista de precios asignada, porcentaje de descuento comercial y límite de crédito.  
* Moneda: Moneda local, moneda extranjera o multimoneda (todas las monedas).  
* Vínculo Financiero: Cuenta asociada de mayor en la que se registrarán las Cuentas por Pagar. B. Datos Maestros de Artículo (Ficha de Compras)  
* Proveedor Habitual: Proveedor por defecto asociado al artículo.  
* Número de Catálogo de Fabricante: Código propio del proveedor (permite buscar artículos usando la codificación del fabricante).  
* Unidad de Medida (UdM) de Compra: Ej. se compra en "Cajas de 24 unidades" y se gestiona en almacén como "Unidades individuales". El sistema aplica el factor de conversión automáticamente.  
* Grupo de Aduanas: Clasificación arancelaria para artículos importados.

---

3. Impacto Financiero y Contable en Inventario Permanente En un sistema con inventario permanente (Perpetual Inventory), cada movimiento de materiales registra inmediatamente su impacto en el balance: Documento Movimiento en Almacén Asiento Contable en Libro Mayor  
   1. Pedido de Compra Ninguno. Solo incrementa el valor en la columna "Pedido" de los datos maestros. Sin contabilización.  
   2. Entrada de Mercancías (GRPO) Incrementa stock físico disponible y valorado en el almacén seleccionado. DEBE: Cuenta de Existencias / Inventario. HABER: Cuenta de Dotación / Compensación de Compras no facturadas (Allocation Account).  
   3. Factura de Proveedores Ninguno (si proviene de una Entrada de Mercancías). DEBE: Cuenta de Dotación / Compensación. HABER: Cuenta del Proveedor (Cuentas por Pagar).  
   4. Pago Efectuado Ninguno. DEBE: Cuenta del Proveedor. HABER: Banco / Caja / Cuenta de Tesorería. Concepto Crítico \- Cuenta de Dotación / Asignación (Allocation Account): Es una cuenta puente de pasivo transitorio. Su saldo representa el valor monetario de todas las mercancías recibidas físicamente en almacén que aún no han sido facturadas por el proveedor. Cuando la factura llega y se contabiliza copiando la entrada, el saldo de esta cuenta vuelve a cero para esa operación.

---

4. Proceso de Aprovisionamiento Optimizado (Factura Directa sin Entrada Previa)  
* Caso de uso: Compras urgentes o entregas inmediatas donde el proveedor entrega los artículos y la factura fiscal física al mismo tiempo (ej. compra de mostrador o compras en plaza).  
* Mecanismo: Se crea directamente una Factura de Proveedores independiente (sin crear pedido ni entrada previa).  
* Impacto automático:  
  * Inventario: Incrementa el stock físico inmediatamente.  
  * Contabilidad: DEBE: Cuenta de Existencias / HABER: Cuenta del Proveedor. Se omite la cuenta puente de compensación.  
* Regla de Oro: NUNCA crear una Factura de Proveedores independiente si ya se había registrado una Entrada de Mercancías de pedido (GRPO), pues esto duplicaría el inventario físico y dejaría abierta la provisión contable en la cuenta de dotación.

---

LECCIÓN 2.2: GESTIÓN DE ENTREGAS PARCIALES, EXCESOS Y SUSTITUCIÓN DE ARTÍCULOS En la realidad operativa de compras, las entregas rara vez son idénticas al pedido inicial. SAP Business One gestiona estas contingencias con precisión milimétrica: ┌───\> \[ Entrada Parcial 1: 50 u. \] (Pedido queda Abierto con 50 pendientes) \[ Pedido Original: 100 u. \] ───┤ └───\> \[ Entrada Parcial 2: 30 u. \] (Pedido queda Abierto con 20 pendientes) │ └───\> Proveedor avisa que no enviará las 20 restantes: \==\> \[ Cerrar Línea / Cerrar Pedido \] (Pasa a Cerrado)

1. Entregas Parciales y Múltiples Recepciones  
* Al recibir una entrega parcial, se abre el documento Pedido de Entrada de Mercancías, se pulsa Copiar de \> Pedidos, se selecciona el pedido y en el asistente se ajusta la cantidad real entregada.  
* Estatus del Pedido Base: El pedido original permanece con estatus Abierto mientras existan cantidades pendientes.  
* La columna Cantidad Pendiente en el pedido refleja con exactitud lo que el proveedor adeuda. Las filas completamente recibidas se atenúan en gris; las incompletas permanecen en blanco.  
* Un mismo pedido puede ser referenciado en 2, 3 o más entradas de mercancías consecutivas hasta agotar su saldo.  
2. Entregas en Exceso (Cantidad Mayor a la Pedida)  
* Si el proveedor envía más unidades de las acordadas (ej. 110 en lugar de 100\) y la política de compras lo acepta, en la Entrada de Mercancías se modifica directamente la cantidad a 110\.  
* El sistema recibe las 110 unidades en stock, valoriza las 110 en la cuenta de existencias y cierra el pedido base al haberse completado la cantidad solicitada.  
3. Sustitución de Artículos  
* Escenario: El proveedor informa rotura de stock del artículo pedido (ej. disco duro de 500GB) y envía en su lugar un artículo equivalente de mayor especificación (ej. disco duro de 1TB) al mismo precio.  
* Procedimiento:  
  1. En la Entrada de Mercancías copiada del pedido, se elimina la línea del artículo no entregado (clic derecho \> Borrar fila).  
  2. Se añade manualmente una nueva línea con el código del artículo sustituto y su cantidad recibida.  
  3. En el pedido de compra original, se procede a Cerrar la línea del artículo que ya no se recibirá para que el sistema no lo mantenga como stock pendiente de entrega en los informes de compras y MRP.  
4. Cierre Manual de Pedidos vs. Cancelación Característica Cerrar Pedido (Close) Cancelar Pedido (Cancel) ¿Cuándo se usa? Cuando hubo entregas parciales y el proveedor ya no entregará el resto, o cuando se completó la recepción. Cuando el pedido se emitió por error o el proveedor rechazó la orden antes de cualquier entrega. Condición técnica Puede aplicarse a pedidos que ya fueron parcialmente copiados. Solo se puede cancelar si el documento nunca fue copiado. Impacto en Reportes El pedido continúa apareciendo en los reportes de análisis de compras e historial. El documento no aparece en el informe de análisis de compras. Reapertura No es posible revertir una vez cerrado. No es posible revertir.  
   ---

LECCIÓN 2.3: DEVOLUCIONES, ABONOS DE PROVEEDOR Y CANCELACIÓN DE DOCUMENTOS Cuando las mercancías presentan defectos de calidad, daños en transporte o errores en precio, el sistema ofrece rutas correctivas bien diferenciadas según el estado de la factura: ¿En qué momento se detecta el problema? │ ├── ANTES de ingresar la Factura Fiscal: │     └── Flujo: \[ Entrada de Mercancías \] ──\> \[ Devolución de Mercancías (Goods Return) \] │ ├── DESPUÉS de ingresar la Factura (Sin pagar aún): │     └── Flujo: \[ Factura de Proveedor \] ──\> \[ Abono de Proveedor (Credit Memo) \] │ └── Se recibió descuento posterior / error de precio (Sin mover stock físico): └── Flujo: \[ Abono de Proveedor \] con check activo: "Sin contabilización de cantidad"

1. Devolución de Mercancías (Goods Return)  
* Momento: Se utiliza cuando la mercancía ya ingresó a almacén pero aún no se ha contabilizado la Factura de Proveedores.  
* Efecto en Inventario: Retira físicamente las unidades defectuosas del almacén.  
* Efecto Contable: Anula la provisión previa: DEBE: Cuenta de Asignación / HABER: Cuenta de Existencias.  
* Reapertura de Pedido: Según la parametrización de la empresa, al emitir una devolución, el sistema puede reabrir automáticamente el pedido de compra original para permitir que el proveedor envíe el reemplazo.  
2. Abono de Proveedores (A/P Credit Memo)  
* Momento: Se utiliza cuando la Factura de Proveedores ya fue registrada en el sistema. No es posible hacer una Devolución de Mercancías sobre una entrada ya facturada.  
* Efecto: Reduce el saldo que se le adeuda al proveedor y descuenta las cantidades de stock del almacén.  
* Asiento Contable: DEBE: Cuenta del Proveedor / HABER: Cuenta de Existencias (y reversión de IVA crédito fiscal correspondiente).  
3. Abono "Sin Contabilización de Cantidad" (Corrección de Precios)  
* Escenario: El proveedor omitió un 10% de descuento comercial acordado en su factura. Las cantidades físicas recibidas en almacén son correctas, pero el valor a pagar está inflado.  
* Procedimiento: En la cabecera/líneas del Abono de Proveedores, se marca la casilla "Sin contabilización de cantidad".  
* Impacto: Modifica el saldo contable en el libro mayor y la deuda con el proveedor, sin alterar las unidades físicas del inventario.  
4. La Solicitud de Devolución de Mercancías (RMA)  
* Actúa como documento previo de autorización logística.  
* Permite registrar el número de RMA (Return Merchandise Authorization) proporcionado por el proveedor y el motivo de rechazo.  
* Impacto logístico inteligente: Mueve las unidades devueltas a estatus "Comprometido", impidiendo que el departamento de ventas o producción consuma artículos que están empacados para devolverse al proveedor.  
* Al procesarse, el sistema determina automáticamente si debe transformarse en una Devolución de Mercancías o en un Abono de Proveedor según exista o no factura previa.  
5. Cancelación Nativa de Documentos de Marketing  
* Si una Entrada de Mercancías o Factura fue ingresada con errores graves (proveedor equivocado, fecha errada), se hace clic derecho sobre el documento y se selecciona Cancelar.  
* El sistema crea un documento formal de cancelación (Cancelación de Entrada de Mercancías), reversa los asientos y el stock, y reabre automáticamente el documento base anterior para poder volver a procesarlo de forma limpia.

---

LECCIÓN 2.4: CASO PRÁCTICO RESUELTO OFICIAL \- FLUJO INTEGRAL DE APROVISIONAMIENTO Caso Oficial de Estudio: OEC Computers \- Operaciones de Compras (CSL02\_Procurement\_Process\_Solution\_ES.pdf) Responsable: James (Jefe de Compras) | Proveedor: V10000

---

TAREA 1: Emisión del Pedido Formal de Compras

1. Navegación: Compras \- Proveedores \> Pedido.  
2. Proveedor: Seleccionar V10000.  
3. Carga de Artículos:  
   * I00002 | Cantidad: 50  
   * I00004 | Cantidad: 100  
   * I00007 | Cantidad: 25  
   * I00008 | Cantidad: 15  
4. Verificación: Fecha de entrega requerida.  
5. Acción: Pulsar Crear y visualizar. Estatus del pedido: Abierto. Sin efecto contable.

---

TAREA 2: Recepción de Entrega Parcial (1er Embarque)

1. Navegación: Compras \- Proveedores \> Pedido de entrada de mercancías.  
2. Proveedor: Seleccionar V10000.  
3. Copia Asistida:  
   * Pulsar botón inferior Copiar de \> Pedidos.  
   * Seleccionar el pedido de la Tarea 1\.  
   * En el asistente de personalización de líneas, modificar la cantidad recibida de I00004 de 100 a 50\.  
   * Excluir o borrar la línea del artículo I00002 (que no vino en este camión) con clic derecho \> Borrar fila.  
   * Mantener las cantidades completas de I00007 (25) y I00008 (15).  
4. Crear: Registrar el documento.  
   * Impacto en Almacén: Aumentan las existencias en almacén de I00004 (+50), I00007 (+25) y I00008 (+15).  
   * Impacto en Pedido Base: Sigue Abierto con I00002 (50 pendientes) y I00004 (50 pendientes).

---

TAREA 3: Segunda Entrega con Modificaciones y Sustitución de Insumos El camión llega con:

* I00002: 50 unidades.  
* I00004: 30 unidades (en vez de las 50 restantes).  
* I00003: 20 unidades (artículo nuevo sustituto enviado por el proveedor).  
1. Procedimiento en Entrada de Mercancías:  
   * Abrir nueva Entrada de mercancías, seleccionar proveedor V10000.  
   * Pulsar Copiar de \> Pedidos.  
   * En la fila de I00004, modificar la cantidad a 30\.  
   * Añadir una nueva línea con el artículo sustituto I00003 por cantidad de 20\.  
2. Verificación de Stock Antes de Registrar:  
   * Para evaluar si aceptar las 30 unidades de I00004 y las 20 de I00003, James hace clic en la flecha naranja del número de artículo.  
   * En la ficha Datos de inventario, confirma que en el almacén 01 hay stock suficiente para operar.  
3. Registrar: Guardar la Entrada de Mercancías.

---

TAREA 4: Contabilización de Factura de Proveedor y Cierre de Saldo

1. Llega la factura física del proveedor V10000 por los artículos efectivamente entregados. El proveedor confirma por escrito que no podrá entregar las 20 unidades restantes del artículo I00004.  
2. Generación de Factura:  
   * Compras \- Proveedores \> Factura de proveedores.  
   * Seleccionar proveedor V10000 y pulsar Copiar de \> Pedido de entrada de mercancías.  
   * Seleccionar las dos entradas de mercancías previas para consolidarlas en una sola factura.  
3. Cierre de Cantidad Pendiente en Pedido:  
   * Abrir el Pedido original de la Tarea 1\.  
   * Localizar la fila del artículo I00004 (que muestra cantidad pendiente: 20).  
   * Hacer clic derecho sobre la fila y seleccionar Cerrar fila.  
   * El estatus de todo el pedido cambia a Cerrado, liberando el stock en tránsito del módulo MRP.

---

TAREA 5: Pedido Urgente sin Entrada Previa y Auditoría de Asiento

1. James necesita de emergencia dos artículos para el mismo día: I00008 (25 unidades) y I00009 (5 unidades).  
2. Como el pedido se hizo por teléfono y llegó con la factura de inmediato, se registra directamente en: Compras \- Proveedores \> Factura de proveedores.  
3. Ingresar artículos y cantidades. Al pulsar Crear, el sistema incrementa el stock físico y reconoce la cuenta por pagar en un solo paso.  
4. Auditoría del Asiento Contable:  
   * James hace clic derecho en cualquier parte de la factura guardada y selecciona Asiento de diario (o hace clic en la flecha naranja junto al campo Nº de transacción).  
   * Se visualiza el desglose contable: Débito en cuentas de inventario de ambos artículos y Crédito a la cuenta por pagar del proveedor V10000.

---

TAREA 6: Pago Masivo Simultáneo de Facturas

1. Navegación: Gestión de bancos \> Pagos efectuados \> Pagos efectuados.  
2. Proveedor: Seleccionar V10000.  
3. En la tabla central se listan automáticamente todas las facturas abiertas del proveedor.  
4. James marca la casilla de selección de la Factura de la Tarea 4 y la Factura urgente de la Tarea 5\.  
5. Abre la ventana Medios de pago (icono de bolsa de dinero en la barra de herramientas), selecciona el método (ej. Transferencia bancaria o Cheque), pulsa Fijar importe total y crea el documento de pago.  
6. Ambas facturas quedan cerradas y reconciliadas en el balance.

---

MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA Problema 1: "La cuenta de compensación de compras (dotación) muestra un saldo acumulado anormal"

* Causa Raíz: Los usuarios del almacén registraron Entradas de Mercancías (GRPO), pero el departamento de cuentas por pagar ingresó las facturas como "Facturas independientes" sin usar el botón Copiar de.  
* Instrucción de Asesoría del Copiloto:  
1. Auditar mediante el informe de Lista de partidas abiertas filtrando por Entradas de mercancías de pedido.  
2. Si una entrada ya fue facturada por fuera mediante factura independiente, no crear otra factura. Cancelar la factura errónea o conciliar contablemente la cuenta de dotación mediante un asiento de ajuste autorizado.  
3. Reentrenar al personal: Toda factura de compra cuyo material pasó por almacén debe originarse copiando la entrada correspondiente. Problema 2: "Devolví mercancía dañada pero el sistema no me permite hacer una Devolución de Mercancías"  
* Causa Raíz: La Entrada de Mercancías original ya fue procesada en una Factura de Proveedores.  
* Instrucción de Asesoría del Copiloto:  
1. Una vez emitida la Factura de Proveedores, la transacción logística está cerrada fiscalmente.  
2. Debe utilizarse un Abono de Proveedores (A/P Credit Memo), el cual retira el stock defectuoso de almacén y emite la nota de crédito contable correspondiente contra la deuda del proveedor. Problema 3: "Un pedido de compra sigue apareciendo en el reporte de compras a pesar de que ya no recibiremos más unidades"  
* Causa Raíz: El documento quedó parcialmente recibido y nadie cerró la línea o el pedido manualmente.  
* Instrucción de Asesoría del Copiloto:  
1. Abrir el pedido de compra.  
2. Si solo una línea quedó incompleta, hacer clic derecho sobre esa fila y seleccionar Cerrar fila.  
3. Si ninguna línea recibirá más entregas, hacer clic derecho sobre el cuerpo del documento y seleccionar Cerrar.

---

BANCO DE EVALUACIÓN SITUACIONAL Pregunta 1 (Finanzas y Logística) ¿Cuál es el efecto contable de registrar una Entrada de Mercancías de Pedido (GRPO) en una empresa con inventario permanente?

* A) Acredita la cuenta bancaria y debita el costo de ventas.  
* B) Debita la cuenta de existencias y acredita la cuenta de asignación/compensación de compras no facturadas. \[CORRECTA\]  
* C) Debita las cuentas por pagar y acredita la cuenta de existencias.  
* D) No genera ningún asiento contable hasta que llegue la factura del proveedor. Explicación: La entrada reconoce la propiedad física de las existencias (activo) y provisiona la deuda en una cuenta transitoria de compensación hasta la recepción de la factura fiscal. Pregunta 2 (Resolución de Contingencias) El proveedor envía un abono de $500 por una bonificación comercial de fin de año, pero no se debe devolver ningún artículo del almacén. ¿Cómo se registra en SAP Business One?  
* A) Creando una Devolución de Mercancías con valor cero.  
* B) Creando un Abono de Proveedores con la casilla "Sin contabilización de cantidad" activada. \[CORRECTA\]  
* C) Modificando el costo promedio de los artículos en datos maestros.  
* D) Borrando la última factura registrada. Explicación: La casilla "Sin contabilización de cantidad" permite registrar un impacto puramente monetario en las cuentas contables del proveedor sin afectar el conteo físico de inventario.

---

GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS) \[ { "scene": "01\_el\_ciclo\_p2p", "voicePrompt": "Autoritario, claro y ejecutivo", "text": "Comprar en una empresa no es simplemente pagar facturas. Es un circuito cerrado de control: pedimos lo que necesitamos, verificamos físicamente lo que entra al almacén, conciliamos la factura contra la recepción y recién ahí liberamos el pago. Si te saltas uno de estos pasos, abres la puerta a mermas, pagos duplicados y discrepancias fiscales.", "durationEstimate": "16s" }, { "scene": "02\_entregas\_parciales", "voicePrompt": "Práctico y resolutivo", "text": "¿Qué pasa si pediste cien monitores y el proveedor solo te entregó cincuenta? Jamás canceles el pedido. Utiliza el botón Copiar de en la entrada de mercancías y cambia la cantidad a cincuenta. El sistema registrará el ingreso exacto en almacén y mantendrá el pedido abierto por los cincuenta restantes para cuando llegue el próximo camión.", "durationEstimate": "17s" }, { "scene": "03\_la\_cuenta\_dotacion", "voicePrompt": "Didáctico y financiero", "text": "Presta mucha atención a este concepto: la cuenta de dotación o compensación. Cuando la mercancía entra a la bodega pero la factura del proveedor aún no llega, el sistema crea un pasivo provisional. Cuando finalmente registras la factura copiando la entrada, esa cuenta puente queda en cero y la deuda se transfiere formalmente a la cuenta por pagar.", "durationEstimate": "18s" } \]

\================================================================================

﻿MÓDULO 03: VENTAS Y GESTIÓN DE CLIENTES (ORDER-TO-CASH Y AUTOMATIZACIÓN COMERCIAL) (SAP BUSINESS ONE 10.0 & ERP) Tipo de Contenido: Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA Fuentes Oficiales Analizadas: 10\_Sales\_11\_Process\_Overview\_ES.pdf, 10\_Sales\_12\_Process\_Order2Cash\_ES.pdf, 10\_Sales\_21\_Cust\_Customers\_ES.pdf, 10\_Sales\_31\_CRM\_CRM\_ES.pdf, 10\_Sales\_41\_Process\_Autom\_ES.pdf, 10\_Sales\_51\_Issues\_ReturnsExchange\_ES.pdf y 10\_Sales\_52\_Issues\_CM\_ES.pdf Nivel: Intermedio / Especialista Comercial, Logístico y Financiero Tiempo Estimado de Estudio: 65 minutos (dividido en 4 lecciones integradas)

---

ÍNDICE DEL MÓDULO

1. Lección 3.1: El Ciclo Estándar Order-to-Cash (O2C) y Reglas Contables  
2. Lección 3.2: Verificación de Disponibilidad (ATP) y Reprogramación Gráfica de Entregas  
3. Lección 3.3: Automatización Operativa: Pick & Pack y Asistente de Facturación en Lote  
4. Lección 3.4: Devoluciones de Clientes, Abonos (Notas de Crédito) y Reclamos  
5. Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA  
6. Banco de Evaluación Situacional  
7. Guiones Humanizados para Locución IA (ElevenLabs)

---

LECCIÓN 3.1: EL CICLO ESTÁNDAR ORDER-TO-CASH (O2C) Y REGLAS CONTABLES

1. Las 5 Etapas del Ciclo Comercial El ciclo de ingresos (Order-to-Cash) asegura la captura precisa de pedidos, el despacho oportuno desde almacén y la cobranza efectiva en tesorería: \[ 1\. Oferta de Ventas (Sales Quotation) \] │ (Propuesta comercial no vinculante. Precios, descuentos y validez) ▼ \[ 2\. Pedido de Cliente (Sales Order) \] │ (Compromiso legal del cliente. Reserva stock: Aumenta 'Comprometido') ▼ \[ 3\. Entrega / Albarán (Delivery) \] │ (Salida física de almacén. Disminuye stock. Asiento de Costo de Ventas) ▼ \[ 4\. Factura de Clientes (A/R Invoice) \] │ (Exigibilidad fiscal. Asiento de Ingresos por Venta, Cuentas por Cobrar e IVA) ▼ \[ 5\. Cobro / Pago Recibido (Incoming Payment) \] │ (Gestión de Bancos: Reconciliación interna automática contra la factura)

---

2. Comportamiento del Stock y Asientos en Inventario Permanente En las ventas de artículos inventariables, el impacto operativo se desdobla en dos momentos críticos: la salida física de mercancías (costo) y la emisión fiscal de la factura (ingreso). Documento Movimiento en Almacén Impacto Contable en Libro Mayor  
   1. Oferta de Ventas Ninguno. Sin contabilización.  
   2. Pedido de Cliente Aumenta stock "Comprometido". Reduce el stock "Disponible". El stock "En Stock" físico no cambia. Sin contabilización. (No se generan asientos en el balance).  
   3. Entrega (Delivery) Reduce stock "En Stock" físico. Libera/reduce stock "Comprometido". DEBE: Cuenta de Costo de Ventas (COGS / Pérdidas y Ganancias). HABER: Cuenta de Existencias / Inventario (Activo).  
   4. Factura de Clientes Ninguno (si proviene de una Entrega previa). DEBE: Cuenta del Cliente (Cuentas por Cobrar). HABER: Cuenta de Ingresos por Ventas. HABER: Cuenta de Impuesto Débito Fiscal (IVA Venta).  
   5. Cobro (Incoming Payment) Ninguno. DEBE: Cuenta Bancaria / Caja / Tarjetas. DEBE: Cuenta de Descuento Concedido (si aplica pronto pago). HABER: Cuenta del Cliente (Cuentas por Cobrar).

   ---

3. Dinámica del Stock: La Ecuación Maestra de Disponibilidad En SAP Business One, el stock nunca se evalúa únicamente mirando las unidades en estantería: $$\\text{Cantidad Disponible} \= \\text{En Stock (Físico)} \- \\text{Comprometido (Reservado a clientes)} \+ \\text{Solicitado (En camino de proveedores)}$$  
* En Stock: Cantidad física que reposa en el almacén.  
* Comprometido: Unidades apartadas por pedidos de clientes confirmados o reservadas para órdenes de producción internas.  
* Solicitado: Mercancías que han sido pedidas a proveedores con pedidos de compra abiertos o que están en producción.  
* Disponible: La cifra real y segura que los ejecutivos de ventas pueden comprometer sin generar roturas de stock.

---

4. Venta Directa en Mostrador (Factura Directa sin Entrega Previa)  
* Escenario: Ventas en punto de venta o compras donde el cliente retira el producto y recibe la factura simultáneamente.  
* Mecanismo: Se crea directamente una Factura de Clientes independiente.  
* Impacto Integrado en un Solo Paso:  
  1. Descarga el inventario físico del almacén.  
  2. Genera el asiento de costo: DEBE: Costo de Ventas / HABER: Existencias.  
  3. Genera el asiento comercial: DEBE: Cliente (Cuentas por Cobrar) / HABER: Ingresos por Ventas e IVA.  
* Regla de Auditoría: Si ya se emitió una Entrega (Delivery), jamás se debe generar una Factura independiente, pues esto duplicaría la salida física de almacén y el costo de ventas. Debe generarse copiando la entrega existente.

---

5. Previsualización de Asientos (Journal Entry Preview)  
* Los asientos contables en un ERP no se pueden editar ni borrar una vez grabados en la base de datos (solo reversar mediante anulación).  
* SAP Business One dispone en la barra de herramientas del icono Previsualización de asiento. Permite al usuario simular y auditar el asiento contable exacto (cuentas contables, importes Debe/Haber y centros de costo) antes de presionar el botón Crear.

---

LECCIÓN 3.2: VERIFICACIÓN DE DISPONIBILIDAD (ATP) Y REPROGRAMACIÓN GRÁFICA DE ENTREGAS

1. Verificación de Disponibilidad Estándar Cuando un vendedor ingresa un pedido por una cantidad superior al stock disponible (o stock mínimo), el sistema despliega automáticamente la ventana de advertencia Verificación de disponibilidad de artículos. Acciones Operativas Disponibles en Ventana Emergente:  
2. Continuar: Acepta el pedido por la cantidad solicitada. La cantidad no disponible queda en estatus Pendiente (Backorder).  
3. Cambiar a cantidad disponible: Ajusta automáticamente la línea del pedido para vender solo lo que hay disponible en ese instante.  
4. Visualizar cantidades en otros almacenes: Abre una consulta multicentro para verificar si otra bodega de la empresa tiene existencias y asignar el despacho desde allí.  
5. Visualizar artículos alternativos: Ofrece sustitutos previamente configurados en el sistema (ej. otra marca con características técnicas idénticas).  
6. Borrar línea: Elimina el artículo si el cliente desiste de la compra.  
7. Cambiar a disponibilidad más temprana: Lee los pedidos de compra en camino y sustituye la fecha de entrega por la fecha estimada de arribo del insumo.

---

2. Verificación de Cantidad ATP Avanzada (Exclusiva de SAP HANA) La tecnología in-memory de SAP HANA eleva el ATP a un motor analítico dinámico que calcula la disponibilidad en tiempo real considerando: $$\\text{Disponibilidad ATP} \= \\text{En Stock} \+ \\text{Entradas Previstas} \- \\text{Demandas Confirmadas} \- \\text{Asignaciones Temporales en Curso}$$ 3 Estrategias de Cumplimiento de Entrega:  
3. Propuesta de Entrega (Fraccionada): Divide la línea del pedido en entregas parciales automáticas. Ej. Si el cliente pide 7 unidades y hoy hay 5, programa la entrega de 5 hoy y las 2 restantes en la fecha que llega la orden de compra del proveedor.  
4. Entrega Única: Despacha únicamente lo que se puede entregar en la fecha solicitada (5 unidades) y no programa el saldo.  
5. Entrega Completa: Retrasa la fecha de entrega del pedido completo hasta el día en que las 7 unidades estén juntas en bodega (ideal para clientes que rechazan entregas parciales).

---

3. Herramienta Gráfica de Reprogramación de Entregas (Delivery Schedule Management) Herramienta de alto impacto reservada para directores comerciales y jefes de almacén:  
* Caso de uso: Un cliente VIP o estratégico realiza un pedido urgente de 10 unidades de un artículo escaso, pero todo el stock físico está comprometido con pedidos de clientes ordinarios.  
* Procedimiento Gráfico:  
  1. Abrir la ventana Gestión del plan de entregas.  
  2. El sistema muestra una línea cronológica interactiva con barras de color por cada pedido comprometido.  
  3. El jefe de ventas selecciona la barra azul de un pedido de baja prioridad. La barra cambia a color dorado (amarillo) y activa un control deslizante.  
  4. Se arrastra la barra hacia la izquierda para restar unidades comprometidas a ese cliente y reasignarlas instantáneamente al pedido del cliente VIP.  
  5. Se confirman los cambios: el sistema reasigna el stock y reprograma automáticamente las fechas de entrega de los documentos afectados.

---

LECCIÓN 3.3: AUTOMATIZACIÓN OPERATIVA: PICK & PACK Y ASISTENTE DE FACTURACIÓN EN LOTE En empresas de distribución o retail con cientos de pedidos diarios, despachar pedido por pedido es inviable. SAP Business One ofrece dos motores de automatización masiva: \[ Pedidos de Venta \] ──\> \[ RESPONSABLE DE PICK & PACK \] ──\> \[ LISTAS DE PICKING \] ──\> \[ ENTREGAS MASIVAS \] │ ▼ \[ ASISTENTE DE GENERACIÓN DE DOCUMENTOS \] \<──────────────┘ │ ▼ \[ FACTURAS EN LOTE MASIVAS \]

---

1. El Responsable de Picking, Embalaje y Producción (Pick and Pack Manager) Es el centro de control logístico que consolida y organiza el despacho de mercancías en el almacén mediante 3 cajones de flujo:  
2. Cajón 1: "Abierto"  
   * Muestra todas las líneas de pedidos de clientes aprobadas y con stock disponible pendientes de recolectar.  
   * El jefe de almacén filtra por fecha, ruta o cliente y pulsa Liberar a lista de picking.  
3. Cajón 2: "Liberado"  
   * Agrupa los pedidos en Listas de Picking optimizadas mediante un asistente que permite clasificar por:  
     * Ruta o Zona de Almacén: Para que el operario recorra los pasillos una sola vez recogiendo productos de múltiples pedidos.  
     * Grupo de Artículos: Separando productos frágiles, refrigerados o voluminosos.  
     * Cliente o Documento Individual.  
   * Los operarios recolectan los artículos con la lista impresa o terminal móvil y registran las cantidades efectivamente tomadas.  
4. Cajón 3: "Picking Efectuado"  
   * Los artículos ya están en el área de consolidación y empaque.  
   * Con un solo clic, el sistema genera automáticamente los documentos de Entrega masiva (Deliveries) y las etiquetas de embalaje (Packing Lists), rebajando el stock físico y cerrando las listas de picking.

---

2. El Asistente de Generación de Documentos de Facturación  
* Propósito: Automatizar la emisión y contabilización de facturas de clientes al cierre del día, semana o quincena.  
* Funcionamiento:  
  1. Se definen criterios de agrupación: por cliente, por zona geográfica o por condiciones de pago.  
  2. El asistente busca todas las Entregas (Deliveries) despachadas que aún no han sido facturadas.  
  3. Permite consolidar: si un cliente recibió 4 entregas distintas durante la semana, el asistente las agrupa en una sola Factura consolidada.  
  4. Ejecuta el lote en segundo plano, generando los asientos contables y enviando automáticamente las facturas electrónicas en PDF/XML a los clientes.

---

LECCIÓN 3.4: DEVOLUCIONES DE CLIENTES, ABONOS (NOTAS DE CRÉDITO) Y RECLAMOS Cuando un cliente rechaza un producto por garantía, daño o error en la orden de venta: ¿Cuál es el estatus documental de la venta? │ ├── La mercancía fue entregada pero AÚN NO FACTURADA: │     └── Solución: \[ Devolución de Clientes (Returns) \] │           \- Reingresa stock al almacén. │           \- Asiento: DEBE: Existencias / HABER: Costo de Ventas. │ ├── La Factura de Venta YA FUE EMITIDA (Sin cobrar o ya cobrada): │     └── Solución: \[ Factura de Abono de Clientes (A/R Credit Memo) \] │           \- Reingresa stock al almacén. │           \- Anula la deuda del cliente (HABER: Cliente). │           \- Reversa ingresos e IVA (DEBE: Ingresos / DEBE: Débito Fiscal). │           \- Reversa costo de ventas (DEBE: Existencias / HABER: Costo de Ventas). │ └── Reclamo financiero / Descuento concedido (Sin devolución física de material): └── Solución: \[ Factura de Abono de Clientes \] con check: "Sin contabilización de cantidad" \- Ajusta la cuenta por cobrar y el ingreso. \- NO altera las unidades físicas en inventario.

---

1. Devolución de Clientes (Returns)  
* Se origina copiando directamente la Entrega (Delivery).  
* Efecto Contable: Reversa el asiento de costo de la entrega (DEBE: Cuenta de Existencias / HABER: Cuenta de Costo de Ventas).  
* No afecta cuentas de clientes ni cuentas de ingresos porque la factura nunca existió.  
* Restablece el stock físico disponible en el almacén de devoluciones o almacén principal.  
2. Factura de Abono de Clientes (A/R Credit Memo)  
* Se origina copiando la Factura de Clientes.  
* Es el documento fiscalmente válido (Nota de Crédito) para rectificar una factura emitida.  
* Reduce el saldo por cobrar del cliente o, si el cliente ya había pagado, genera un saldo a su favor para futuras compras o devolución monetaria mediante un Pago Efectuado.  
3. Abono "Sin Contabilización de Cantidad"  
* Caso práctico: Un cliente recibe un lote de 10 laptops. Una de ellas tiene un rasguño superficial en la carcasa. El cliente acepta quedarse con la laptop si la empresa le descuenta $100 del precio.  
* Acción: Se emite un Abono de Clientes copiando la factura, se introduce el importe de $100 y se activa la casilla "Sin contabilización de cantidad".  
* Resultado: Se acredita la cuenta por cobrar del cliente por $100 y se reduce el ingreso por ventas, pero el stock de laptops no se incrementa en almacén porque el equipo permanece en posesión del cliente.

---

MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA Problema 1: "El sistema no permite crear la entrega porque dice que no hay stock disponible, pero en el almacén veo las cajas"

* Causa Raíz: Confusión entre Stock Físico y Stock Disponible. Las unidades físicas existen, pero ya están Comprometidas con otros pedidos de clientes confirmados con fecha de entrega anterior o para órdenes de fabricación.  
* Instrucción de Asesoría del Copiloto:  
  1. Abrir datos maestros del artículo y consultar la pestaña Datos de inventario.  
  2. Hacer clic en la flecha naranja del campo Comprometido para listar los pedidos que tienen retenido el material.  
  3. Si la entrega actual tiene mayor prioridad comercial, utilizar la herramienta de Gestión del plan de entregas (Reprogramación de entregas) para reasignar el stock comprometido desde pedidos secundarios. Problema 2: "El cliente devolvió mercancía pero un vendedor emitió una Devolución y contabilidad emitió además una Nota de Crédito manual"  
* Causa Raíz: Duplicación de operaciones correctivas por falta de trazabilidad entre logística y finanzas.  
* Instrucción de Asesoría del Copiloto:  
  1. Si la Devolución reingresó el stock y el Abono manual volvió a reingresarlo, el inventario físico en el balance está inflado con stock fantasma.  
  2. Reentrenar: Si la factura ya existía, nunca se debe usar Devolución; se debe usar exclusivamente Abono de Clientes con referencia a la factura.  
  3. Para corregir la duplicación actual, emitir un ajuste de salida de inventario por la cantidad duplicada y conciliar los asientos contables con supervisión contable. Problema 3: "Se emitió una factura de clientes directa y luego el almacén despachó una entrega sobre el pedido original"  
* Causa Raíz: Violación del flujo estándar O2C: se facturó como mostrador mientras el almacén continuó con el despacho ordinario.  
* Instrucción de Asesoría del Copiloto:  
  1. Esto provoca doble salida de stock físico y doble reconocimiento de costo de ventas.  
  2. Cancelar la entrega duplicada o emitir un abono de clientes que anule la factura directa errónea, vinculando la factura legal definitiva a la entrega real del almacén.

---

BANCO DE EVALUACIÓN SITUACIONAL Pregunta 1 (Logística e Ingresos) En una empresa que utiliza inventario permanente, ¿en qué momento exacto se reconoce el Costo de la Mercancía Vendida (Costo de Ventas) en los libros contables?

* A) Al emitir la Oferta de Ventas cuando el cliente acepta la cotización.  
* B) Al contabilizar el Pedido de Cliente.  
* C) Al registrar la Entrega (salida física de mercancías del almacén). \[CORRECTA\]  
* D) Únicamente cuando el cliente paga la factura en tesorería. Explicación: La Entrega documenta la pérdida de posesión física y transferencia del riesgo de las existencias, debitando el Costo de Ventas y acreditando la cuenta de Existencias. Pregunta 2 (Herramientas de Planificación) Un cliente corporativo solicita 50 servidores para un evento el viernes. El almacén tiene 30 disponibles y recibirá 20 de un proveedor el jueves. El cliente advierte que NO aceptará entregas parciales y que necesita todos los servidores juntos. ¿Qué estrategia de entrega ATP avanzada debe aplicarse?  
* A) Propuesta de entrega fraccionada.  
* B) Entrega completa (Full Delivery). \[CORRECTA\]  
* C) Cancelar el pedido de compra del proveedor.  
* D) Entrega única inmediata por 30 unidades. Explicación: La estrategia de Entrega Completa retiene el despacho hasta la fecha calculada en que la totalidad de los artículos solicitados estén disponibles en bodega.

---

GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS) \[ { "scene": "01\_el\_circuito\_o2c", "voicePrompt": "Dinámico, profesional y motivador", "text": "Vender en SAP no es solo emitir una factura y cobrar. Es coordinar una coreografía perfecta: cuando confirmas un pedido de cliente, apartas ese stock inmediatamente para que nadie más lo toque. Cuando el almacén hace la entrega, se reconoce el costo de venta y baja el inventario. Y cuando contabilidad factura, se registra formalmente el ingreso fiscal. Cada pieza encaja.", "durationEstimate": "17s" }, { "scene": "02\_la\_trampa\_del\_disponible", "voicePrompt": "Advertencia constructiva y reflexiva", "text": "Nunca cometas el error de novato de mirar únicamente el stock físico. Imagina que tienes diez laptops en la estantería, pero ocho ya están comprometidas para un cliente que retira mañana. Tu stock disponible real es de solo dos unidades. Si prometes vender cinco, provocarás un retraso grave y dañarás la reputación de tu empresa.", "durationEstimate": "18s" }, { "scene": "03\_la\_magia\_del\_pick\_and\_pack", "voicePrompt": "Eficiente, moderno y tecnológico", "text": "Cuando procesas cientos de pedidos al día, el Responsable de Pick and Pack es tu mejor aliado. En lugar de que tus operarios caminen por todo el almacén buscando un pedido a la vez, el sistema genera listas de picking inteligentes por pasillos. Recogen todo en un solo recorrido, empacan en lote y generan las entregas en cuestión de segundos.", "durationEstimate": "19s" } \]

\================================================================================

﻿MÓDULO 04: GESTIÓN DE INVENTARIO Y ALMACENES (VALORACIÓN, MOVIMIENTOS, UBICACIONES Y RECUENTOS FÍSICOS) (SAP BUSINESS ONE 10.0 & ERP) Tipo de Contenido: Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA Fuentes Oficiales Analizadas: 10\_ItemInv\_11\_Item\_ItemMD\_ES.pdf, 10\_ItemInv\_21\_UoM\_Overview\_ES.pdf, 10\_ItemInv\_31\_WM\_WH\_ES.pdf, 10\_ItemInv\_32\_WM\_GM\_ES.pdf, 10\_ItemInv\_41\_Valuation\_ValMethods\_ES.pdf, 10\_Item\_42\_SNBatch\_Valuation.pdf, 10\_BinLoc\_11\_Overview\_Overview\_ES.pdf, 10\_BinLoc\_12\_Setup\_Setup.pdf y 10\_Inven\_13\_WM\_PhyInv.pdf Nivel: Avanzado / Consultoría de Cadena de Suministro, Finanzas de Inventario y Logística Tiempo Estimado de Estudio: 70 minutos (dividido en 4 lecciones integradas)

---

ÍNDICE DEL MÓDULO

1. Lección 4.1: Inventario Permanente y Métodos de Valoración (Media Variable, FIFO, Coste Estándar y Lote/Serie)  
2. Lección 4.2: Movimientos de Mercancías, Traslados y Almacenes en Consignación  
3. Lección 4.3: Gestión Avanzada de Ubicaciones en Almacén (Bin Locations de 4 Subniveles)  
4. Lección 4.4: Inventario Físico, Recuentos Cíclicos y Ajustes de Diferencias  
5. Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA  
6. Banco de Evaluación Situacional  
7. Guiones Humanizados para Locución IA (ElevenLabs)

---

LECCIÓN 4.1: INVENTARIO PERMANENTE Y MÉTODOS DE VALORACIÓN (MEDIA VARIABLE, FIFO, COSTE ESTÁNDAR Y LOTE/SERIE)

1. Inventario Permanente vs. No Permanente En SAP Business One, la decisión arquitectónica fundamental sobre existencias se define durante la inicialización básica de la base de datos (Gestión \> Inicialización del sistema \> Detalles de la empresa \> Inicialización básica):  
* Sistema de Inventario Permanente (Perpetual Inventory):  
  * Cada movimiento físico de entrada o salida genera asientos contables inmediatos y automáticos en el Libro Mayor.  
  * Permite conocer el valor contable y físico exacto del inventario en tiempo real en cualquier segundo del año.  
  * Regla irrevocable: Una vez contabilizada la primera transacción de inventario en la empresa, la casilla de inventario permanente queda bloqueada de por vida y no se puede desactivar ni modificar.  
* Sistema de Inventario No Permanente:  
  * Las transacciones logísticas solo mueven cantidades físicas, sin generar asientos en el libro mayor.  
  * La cuenta de existencias se actualiza manualmente una sola vez al cierre de cada periodo contable mediante asientos de ajuste manuales.

---

2. Comparativa de los 4 Métodos de Valoración en Inventario Permanente \[ ENTRADA DE MATERIALES \] ──\> Se registra a precio de compra real (Factura/Entrada) │ ▼ ¿Cómo se valora la SALIDA al vender o consumir? ┌────────────────────────┬─────────────────────────┬─────────────────────────┐ ▼                        ▼                         ▼                         ▼ \[ Media Variable \]       \[ FIFO (Capas) \]          \[ Coste Estándar \]        \[ Por Lote / Serie \] Coste \= Valor Total /    Coste \= Capa más          Coste \= Valor Fijo        Coste \= Costo real Cantidad en Stock        antigua disponible        Desviación a cuenta P\&L   de ese lote/serie A. Método de Precio Medio Variable (Moving Average)  
* Fórmula: $$\\text{Coste Unitario Actual} \= \\frac{\\text{Valor Monetario Total del Stock}}{\\text{Cantidad Total en Stock}}$$  
* Dinámica:  
  1. Compra 1: 5 unidades a $100 $\\rightarrow$ Valor \= $500, Costo medio \= $100.  
  2. Compra 2: 5 unidades a $200 $\\rightarrow$ Valor \= $1,500, Stock \= 10 unidades $\\rightarrow$ Nuevo Costo medio \= $150 ($1,500 / 10).  
  3. Venta: Se venden 7 unidades. El costo de ventas se calcula a $150 c/u ($\\text{Total Costo} \= $1,050$). Saldo en almacén: 3 unidades valoradas a $150 c/u ($\\text{Nuevo Valor} \= $450$).  
* Uso ideal: Artículos comerciales generales donde el precio de compra fluctúa moderadamente. B. Método FIFO (First In, First Out \- Primeras Entradas, Primeras Salidas)  
* Dinámica de Capas: Cada recepción crea una "capa" independiente de cantidad y costo. Las salidas consumen estrictamente la capa abierta más antigua.  
* Ejemplo comparativo:  
  1. Capa 1: 5 unidades a $100.  
  2. Capa 2: 5 unidades a $200.  
  3. Venta de 7 unidades: El sistema toma 5 unidades de la Capa 1 (a $100 \= $500) y 2 unidades de la Capa 2 (a $200 \= $400).  
  4. Costo de ventas reconocido: $$500 \+ $400 \= $900$ (en lugar de los $1,050 de la media variable).  
  5. Saldo en almacén: 3 unidades restantes en la Capa 2 valoradas a $200 c/u ($\\text{Nuevo Valor} \= $600$).  
* Uso ideal: Productos perecederos, alimentos, fármacos o insumos con riesgo de obsolescencia.  
* Herramienta de auditoría: Reporte Capas FIFO por orden de consumo, que desglosa capa por capa con acceso directo a la transacción que le dio origen. C. Método de Coste Estándar (Standard Cost)  
* Concepto: Se fija manualmente un costo unitario constante e invariable en los datos maestros del artículo (ej. $100).  
* Tratamiento de Desviaciones:  
  * Si se compran 5 unidades a $120 c/u, el inventario ingresa valorado a su costo estándar ($100 $\\times$ 5 \= $500).  
  * La diferencia de $20 por unidad ($100 total) se envía automáticamente a una Cuenta de Desviación de Precios de Compra (Purchase Price Variance) en pérdidas y ganancias.  
  * Al vender o consumir, la salida siempre se descarga a $100 c/u.  
* Uso ideal: Empresas de manufactura con costos estándar de ingeniería o artículos de servicios sin stock donde se quiere medir la ganancia bruta teórica.  
* Actualización: Se realiza mediante la ventana oficial Revalorización de inventario, la cual genera un asiento de auditoría para registrar la revalorización de existencias. D. Método de Valoración por Número de Serie / Lote  
* Permite calcular la rentabilidad y el margen bruto específico de cada número de serie individual o de cada lote de producción.  
* La salida de almacén se valoriza exactamente al costo real con el que ingresó ese número de serie específico, sin mezclar promedios.

---

3. El Informe de Auditoría de Inventario (Inventory Audit Report)  
* Es el informe contable y forense más importante de SAP Business One.  
* Propósito: Reconciliar y comparar la Vista de Logística (unidades físicas y kardex de movimientos) contra la Vista Contable (saldos en las cuentas de mayor del balance).  
* Demuestra línea por línea cada incremento, disminución y saldo acumulado generado por Entradas, Entregas, Facturas y Revalorizaciones.

---

LECCIÓN 4.2: MOVIMIENTOS DE MERCANCÍAS, TRASLADOS Y ALMACENES EN CONSIGNACIÓN En un ERP, no todas las salidas o entradas de almacén nacen de compras o ventas. Existen movimientos puros de inventario interno: ┌──\> \[ Entrada de Mercancías (Goods Receipt) \] │      (Muestras, sobrantes, donaciones, stock inicial) \[ MOVIMIENTOS PUROS \] ─────┼──\> \[ Salida de Mercancías (Goods Issue) \] │      (Mermas, roturas, consumo interno, muestras comerciales) └──\> \[ Traslado de Inventario (Stock Transfer) \] (Movimiento entre bodegas o a consignación en cliente)

1. Entrada de Mercancías sin Referencia (Goods Receipt)  
* Cuándo se usa: Para ingresar existencias que no provienen de compras a proveedores ni de órdenes de fabricación (ej. recepción de muestras gratuitas, inventario inicial de migración, sobrantes de auditoría).  
* Diferencia con compras: No requiere ni permite ingresar código de proveedor.  
* Precio: El usuario debe especificar manualmente el valor unitario con el que ingresará el artículo a libros.  
* Asiento Contable:  
  * DEBE: Cuenta de Existencias / Inventario (Activo).  
  * HABER: Cuenta de Compensación de Stocks: Incremento (Ingreso o Patrimonio/Apertura).  
2. Salida de Mercancías sin Referencia (Goods Issue)  
* Cuándo se usa: Para dar de baja materiales dañados por siniestros (inundación, rotura en pasillos), obsolescencia técnica o entrega de muestras a ferias comerciales.  
* Precio: El campo precio es meramente informativo. El sistema calcula automáticamente el valor contable de salida usando el método de valoración configurado (Media variable actual, capa FIFO más antigua o costo estándar).  
* Asiento Contable:  
  * DEBE: Cuenta de Compensación de Stocks: Reducción / Pérdida por Merma (Gasto).  
  * HABER: Cuenta de Existencias / Inventario (Activo).

---

3. Traslados de Inventario (Stock Transfer) Mueve existencias entre dos almacenes físicos de la misma sociedad:  
* Efecto Contable (Si los almacenes tienen costos o cuentas distintas):  
  * DEBE: Cuenta de Existencias \- Almacén Destino (ej. Almacén 01).  
  * HABER: Cuenta de Existencias \- Almacén Origen (ej. Almacén 02).  
* La Solicitud de Traslado de Inventario (Stock Transfer Request):  
  * Actúa como documento de reserva previa sin impacto contable ni físico.  
  * Para el almacén de origen: El material pasa a "Comprometido" (evitando que otro vendedor lo despache).  
  * Para el almacén de destino: El material figura como "Solicitado" (en camino).  
  * Al recibir físicamente en destino, se copia la solicitud a un Traslado de Inventario, cancelando las reservas y ejecutando el movimiento real.

---

4. Almacenes en Consignación en Instalaciones del Cliente  
* Modelo de Negocio: El cliente mantiene mercancía de nuestra propiedad en sus instalaciones físicas, pero solo se le factura cuando realmente consume el material.  
* Implementación Técnica:  
  1. Se crea un almacén virtual/físico dedicado en el sistema (ej. Almacén 07 \- Consignación Cliente XYZ).  
  2. Para abastecer al cliente: Se emite un Traslado de Inventario desde el almacén central hacia el almacén 07\. A diferencia de las entradas/salidas, los traslados sí permiten registrar el código del Interlocutor Comercial y su dirección.  
  3. No se genera factura ni reconocimiento de ingresos porque la mercancía sigue siendo propiedad de la empresa.  
  4. Al recibir el reporte mensual de consumo del cliente: Se emite una Factura de Clientes indicando expresamente como almacén de salida el Almacén 07\. En ese instante se reconoce la venta fiscal y se descarga el stock en consignación.

---

LECCIÓN 4.3: GESTIÓN AVANZADA DE UBICACIONES EN ALMACÉN (BIN LOCATIONS DE 4 SUBNIVELES) Cuando los almacenes son naves logísticas de gran escala, saber que hay 1,000 unidades en el "Almacén Central" no es suficiente para operar con rapidez. Se requiere la funcionalidad de Ubicaciones (Bin Locations).

1. Estructura Jerárquica de 4 Subniveles SAP Business One permite habilitar ubicaciones por almacén y estructurar hasta 4 dimensiones físicas: \[ ALMACÉN 01 \] ──\> \[ SUBNIVEL 1: Pasillo (Aisle) \]   Ej: Pasillo 04 (A04) └──\> \[ SUBNIVEL 2: Estantería (Rack) \] Ej: Estantería 02 (S02) └──\> \[ SUBNIVEL 3: Nivel (Shelf) \] Ej: Nivel 09 (L09) └──\> \[ SUBNIVEL 4: Casilla / Posición \] \=================================================================================== CÓDIGO DE UBICACIÓN GENERADO: 01-A04-S02-L09  
* Cada casilla física del almacén tiene un código único generado automáticamente por un generador de lotes de ubicaciones.  
* Los operarios pueden escanear etiquetas de código de barras adheridas a la estantería física.  
2. Depósitos de Recepción (Receiving Bin Locations)  
* Áreas designadas específicamente para la zona de descarga e inspección de mercancías entrantes antes de ser colocadas en su estantería definitiva.  
* Al registrar una Entrada de Mercancías, el sistema dirige automáticamente los artículos al depósito de recepción, y posteriormente un traslado interno (Stock Transfer) reubica el insumo en el pasillo correspondiente.  
3. Estrategias de Asignación Automática  
* En Entradas de Mercancías: El sistema puede asignar la ubicación de almacenamiento por orden alfanumérico, por ubicación predeterminada del artículo o llenando ubicaciones vacías hasta agotar capacidad de peso/volumen.  
* En Salidas y Picking:  
  * FIFO Estricto por Ubicación: Sugiere recoger primero de las ubicaciones que contienen lotes más antiguos.  
  * Vaciado de Casillas: Prioriza recoger de casillas que tienen saldos pequeños para liberar estanterías completas.

---

LECCIÓN 4.4: INVENTARIO FÍSICO, RECUENTOS CÍCLICOS Y AJUSTES DE DIFERENCIAS El cotejo entre el inventario físico en estantería y las existencias registradas en el ERP es un requisito fiscal y operativo ineludible. \[ 1\. Definir Ciclos y Alertas \] ──\> \[ 2\. Congelar Artículos (Freeze) \] │ ▼ \[ 4\. Contabilización de Diferencias \] \<── \[ 3\. Conteo Físico (Simple / Equipo) \] (Ajuste contable y corrección de stock)   (Cálculo por Fecha de Creación vs Contabilización)

---

1. Recuentos Cíclicos (Cycle Counting) En lugar de paralizar la planta una vez al año para contar miles de referencias, se aplican recuentos rotativos continuos basados en importancia (Clasificación ABC):  
* Artículos Tipo A (Alto valor/rotación): Se cuentan 6 veces al año (bimestral).  
* Artículos Tipo B (Valor medio): Se cuentan 2 veces al año.  
* Artículos Tipo C (Bajo valor/tornillería): Se cuentan 1 vez al año.  
* Alertas Automáticas: El sistema envía una alerta interna al jefe de almacén con las recomendaciones de artículos que deben contarse hoy.

---

2. El Documento "Recuento de Inventario" (Inventory Counting) Centraliza el proceso de auditoría y ofrece herramientas avanzadas: A. Función "Congelar Artículos" (Freeze Items)  
* Al seleccionar los artículos para conteo, se activa la casilla Congelar.  
* Efecto de Bloqueo: El sistema impide cualquier movimiento transaccional (ventas, compras, traslados o consumo en producción) sobre ese artículo en el almacén o ubicación seleccionada hasta que se registre el conteo, evitando conteos desfasados. B. Modalidades de Contadores  
* Contador Individual: Un solo operario cuenta la zona.  
* Contadores Múltiples: Dos operarios o equipos cuentan la misma área de forma independiente para comparar discrepancias y evitar errores humanos.  
* Equipos Mixtos: Un operario rápido cuenta todo un pasillo, mientras que un equipo de dos operarios cuenta en paralelo; el sistema consolida automáticamente los resultados del equipo para contrastarlos con el contador individual.

---

3. Contabilización de Diferencias de Stock (Inventory Posting) Una vez consolidados los resultados, si el stock físico no coincide con el stock del sistema:  
4. Se utiliza el botón Copiar a \> Contabilización de stocks.  
5. Diferencia Negativa (Faltante físico por robo o merma):  
   * Reduce las unidades en almacén.  
   * DEBE: Cuenta de Pérdida por Diferencia de Inventario (Pérdidas y Ganancias).  
   * HABER: Cuenta de Existencias / Inventario (Activo).  
6. Diferencia Positiva (Sobrante físico):  
   * Aumenta las unidades en almacén.  
   * DEBE: Cuenta de Existencias / Inventario.  
   * HABER: Cuenta de Ganancia por Diferencia de Inventario. Fecha de Conteo: ¿Fecha de Creación vs. Fecha de Contabilización?  
* En Parametrizaciones de documento \> Recuento de inventario, se define con base en qué fecha se calcula el stock teórico esperado:  
  * Basado en Fecha de Creación: Evalúa las transacciones registradas en el sistema hasta el momento exacto en que se creó el documento.  
  * Basado en Fecha de Contabilización: Recomendado cuando hay rezago en la digitación administrativa (ej. la mercancía llegó físicamente el día 6, el conteo se hizo el 7 y el operador digitó la entrada el día 8 con fecha contable del día 6). Esta opción incluye los movimientos retroactivos garantizando un balance fidedigno.

---

MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA Problema 1: "Una empresa quiere cambiar su método de valoración de Media Variable a FIFO después de 6 meses de operar"

* Causa Raíz: No se puede cambiar el método de valoración de forma global si el artículo ya tiene transacciones de inventario abiertas y saldo en stock.  
* Instrucción de Asesoría del Copiloto:  
  1. Si un artículo tiene inventario permanente y saldo acumulado, el método de valoración en sus datos maestros está bloqueado.  
  2. Para cambiar el método de valoración de un artículo activo:  
     * Sacar a cero el inventario físico mediante una Salida de Mercancías.  
     * Cambiar el método de valoración en la pestaña Datos de inventario.  
     * Reingresar el inventario mediante una Entrada de Mercancías con el costo correspondiente.  
  3. Toda modificación de este tipo debe coordinarse previamente con auditoría y dirección financiera por su impacto en la declaración tributaria. Problema 2: "El almacén necesita hacer un traslado urgente pero el sistema bloquea el artículo diciendo 'Artículo congelado'"  
* Causa Raíz: El artículo está incluido en un documento de Recuento de Inventario abierto con la casilla Congelar activa.  
* Instrucción de Asesoría del Copiloto:  
  1. Ir a Inventario \> Operaciones de stock \> Recuento de inventario.  
  2. Localizar el documento de recuento abierto donde figura el artículo.  
  3. Desmarcar temporalmente la casilla Congelar para esa fila, o completar de inmediato el conteo y contabilizar la diferencia para liberar el bloqueo operativo. Problema 3: "Al realizar un traslado de inventario, el sistema exige indicar una ubicación pero el operario no sabe cuál poner"  
* Causa Raíz: El almacén de destino o de origen está configurado como gestionado por Ubicaciones (Bin Locations), por lo que toda entrada o salida requiere estrictamente especificar el código de casillero.  
* Instrucción de Asesoría del Copiloto:  
  1. En la línea del traslado, hacer clic derecho sobre el campo Cantidad y seleccionar Asignación de ubicación.  
  2. Asignar el casillero físico de destino (ej. 01-A01-S01-L01) o el depósito de recepción predeterminado.

---

BANCO DE EVALUACIÓN SITUACIONAL Pregunta 1 (Métodos de Costeo) Durante un año de alta inflación donde los precios de compra de un insumo tecnológico suben continuamente de $100 a $150 y luego a $200, ¿qué método de valoración arrojará el Costo de Mercancía Vendida (COGS) más bajo en la primera venta?

* A) Precio Medio Variable.  
* B) First In, First Out (FIFO). \[CORRECTA\]  
* C) Coste Estándar fijado en $200.  
* D) El costo de reposición de mercado. Explicación: Con FIFO, las ventas consumen primero las capas más antiguas compradas a $100, reconociendo el costo de ventas más bajo y, por consiguiente, reportando una ganancia bruta temporalmente más alta. Pregunta 2 (Logística Operativa) Una distribuidora traslada 100 cajas de repuestos a un almacén ubicado dentro de la fábrica de su cliente principal bajo la modalidad de consignación. ¿Qué documento debe emitirse y qué impacto contable produce?  
* A) Una Factura de Clientes que reconoce el ingreso inmediatamente.  
* B) Una Salida de Mercancías que da de baja el material como costo de ventas.  
* C) Un Traslado de Inventario hacia el almacén de consignación del cliente, el cual mueve existencias entre almacenes sin generar facturación ni reconocimiento de ingresos. \[CORRECTA\]  
* D) Una Devolución de Mercancías al proveedor. Explicación: El traslado a consignación mantiene la titularidad del activo en los libros de la empresa; la venta solo se perfecciona fiscalmente cuando el cliente informa el consumo efectivo del material.

---

GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS) \[ { "scene": "01\_el\_corazon\_del\_inventario", "voicePrompt": "Reflexivo, experto y estratégico", "text": "El inventario no es solo mercancía acumulada en cajas de cartón; es dinero líquido en reposo. En SAP Business One, cada tornillo que ingresa o sale de una bodega dispara un asiento contable automático. Por eso, elegir entre Precio Medio Variable, FIFO o Costo Estándar no es una decisión técnica cualquiera: define cómo pagas impuestos y cómo mides la rentabilidad de tu empresa.", "durationEstimate": "18s" }, { "scene": "02\_ubicaciones\_almacen", "voicePrompt": "Práctico, dinámico y resolutivo", "text": "Imagina tener un hangar de diez mil metros cuadrados y no saber en qué pasillo está la pieza que tu mejor cliente necesita para hoy. Con la gestión de ubicaciones en cuatro subniveles, codificas pasillo, estantería y nivel. El sistema le dice al operario exactamente a qué casilla acudir, reduciendo los tiempos de despacho de horas a simples minutos.", "durationEstimate": "17s" }, { "scene": "03\_la\_disciplina\_del\_recuento", "voicePrompt": "Firme, pedagógico y analítico", "text": "Olvídate de cerrar la empresa tres días en diciembre para contar todo el almacén a las apuradas. El recuento cíclico programa conteos rotativos durante todo el año, priorizando los artículos de mayor valor. Congelas la posición, cuentas con precisión doble y ajustas cualquier discrepancia en libros sin frenar la facturación de tu negocio.", "durationEstimate": "18s" } \]

\================================================================================

﻿MÓDULO 05: PLANIFICACIÓN DE NECESIDADES Y PRODUCCIÓN (MRP & LISTAS DE MATERIALES BOM) (SAP BUSINESS ONE 10.0 & ERP) Tipo de Contenido: Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA Fuentes Oficiales Analizadas: 10\_MRP\_11\_MRP\_Process\_ES.pdf, 10\_MRP\_13\_MRP\_BOM.pdf, 10\_Production\_31\_BOM\_BOM\_ES.pdf, 10\_Production\_41\_Process\_BasicProductionProcess\_ES.pdf y 10\_Production\_51\_Accounting\_Accounting.pdf Nivel: Avanzado / Planificación Industrial, Manufactura y Contabilidad de Costos Tiempo Estimado de Estudio: 70 minutos (dividido en 4 lecciones integradas)

---

ÍNDICE DEL MÓDULO

1. Lección 5.1: Tipologías de Listas de Materiales (BOM) y Modelado de Recursos  
2. Lección 5.2: El Proceso Productivo: De la Orden Planificada al Cierre de Fabricación  
3. Lección 5.3: Contabilidad de Costos de Producción: Cuentas WIP y Liquidación de Desviaciones  
4. Lección 5.4: El Motor MRP: Fuentes de Demanda, Suministro y Recomendaciones Automatizadas  
5. Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA  
6. Banco de Evaluación Situacional  
7. Guiones Humanizados para Locución IA (ElevenLabs)

---

LECCIÓN 5.1: TIPOLOGÍAS DE LISTAS DE MATERIALES (BOM) Y MODELADO DE RECURSOS

1. Las 4 Clases de Listas de Materiales en SAP Business One Una Lista de Materiales (LdM o BOM por sus siglas en inglés, Bill of Materials) define la receta de ingeniería o ensamble requerida para estructurar un producto terminado o paquete comercial: ┌──\> \[ 1\. LdM de Producción \]  (Fabricación física en planta; genera Orden de Producción) │ ├──\> \[ 2\. LdM de Ventas \]      (Kits comerciales estándar; el kit no se inventaría, los hijos sí) \[ TIPOS DE LISTAS BOM \] ───────┤ ├──\> \[ 3\. LdM de Montaje \]     (Similar a ventas; ensamble sobre la marcha en el albarán) │ └──\> \[ 4\. LdM de Modelo \]      (Plantilla editable libremente por el vendedor en la cotización) Tipo de BOM ¿Se emite Orden de Producción? ¿El Padre es inventariable? ¿Los Componentes son inventariables? Caso de Uso Empresarial Producción SÍ (Obligatorio). SÍ. Se gestiona en stock y se costea formalmente. SÍ (artículos y recursos). Fabricación industrial de muebles, ensambles de computadoras, fórmulas químicas. Ventas (Kit) NO. Se procesa directo en ventas. NO. Solo representa un concepto comercial de agrupación. SÍ. Se descargan de stock al despachar la Entrega. Paquete promocional "Computadora \+ Monitor \+ Teclado" vendido a precio unificado. Montaje NO. NO. SÍ. Kits simples donde el cliente no ve el desglose de componentes en la factura fiscal. Modelo (Template) NO. NO. Opcional. Lista de sugerencias donde el comercial puede quitar o añadir componentes en el pedido.  
   ---

2. Estructuras Multinivel (Árbol de Explosión de Materiales)  
* Un artículo padre puede tener componentes que, a su vez, son artículos fabricados internamente con su propia LdM (subensambles).  
* Ejemplo en OEC Computers:  
  * Nivel 0 (Padre final): Servidor Empresarial (Fabricado).  
  * Nivel 1 (Hijos): Teclado (Comprado), Mano de Obra de Ensamblaje (Recurso) y CPU de Escritorio (Fabricado internamente).  
  * Nivel 2 (Nietos): La CPU se desglosa en Tarjeta Madre (Comprada), Disco Duro (Comprado), 2 Tarjetas RAM (Compradas) y Horas de Torno/Prensa (Recurso).  
* Cuando el motor de producción o MRP planifica el Servidor, hace descender la demanda automáticamente por todos los niveles del árbol jerárquico.

---

3. Integración de Recursos (Mano de Obra, Máquinas y Costos Indirectos) En SAP Business One 10.0, la producción no consume solo piezas físicas; incorpora Recursos para costear la operación de la fábrica:  
4. Definición de Recursos: Creados en el módulo de Recursos (Producción \> Recursos).  
   * Recurso Máquina: Torno, CNC, Horno, Prensa industrial (costeados por hora máquina o ciclo).  
   * Recurso Mano de Obra: Operario calificado, Ingeniero de ensamble (costeados por hora hombre).  
5. Etapas de Producción (Production Routing):  
   * Permiten secuenciar la orden en fases cronológicas (ej. Etapa 1: Corte y torneado $\\rightarrow$ Etapa 2: Pintura y secado $\\rightarrow$ Etapa 3: Ensamble eléctrico).  
   * Permite vincular dependencias de inicio y fin entre etapas para controlar el flujo de trabajo en la planta.

---

LECCIÓN 5.2: EL PROCESO PRODUCTIVO: DE LA ORDEN PLANIFICADA AL CIERRE DE FABRICACIÓN \[ 1\. Crear Orden de Producción \] ──\> Estatus: PLANIFICADO (Permite editar cantidades/líneas; sin movimiento) │ ▼ \[ 2\. Liberar Orden a Planta \]    ──\> Estatus: LIBERADO (Habilita consumos y acumula costos) │ ├──\> \[ 3A. Emisión para Producción (Manual) \] │      (El almacén entrega insumos físicos a la orden) │ └──\> \[ 3B. Notificación Posterior (Backflush) \] (Los componentes se descargan automáticamente al recibir el terminado) │ ▼ \[ 4\. Recibo de Producción \]      ──\> Ingresa el Producto Terminado a Bodega (Cálculo del costo estimado) │ ▼ \[ 5\. Cierre de la Orden \]        ──\> Estatus: CERRADO (Liquidación final de variaciones contables)

1. Estados de la Orden de Producción  
* Planificado (Planned): Se genera manualmente o por recomendación del MRP. Se puede modificar la cantidad a producir, cambiar componentes o fechas. No permite registrar salidas de almacén ni entradas de producto terminado.  
* Liberado (Released): El jefe de planta autoriza el inicio de los trabajos. A partir de este instante, los operarios pueden solicitar materias primas y cargar horas de trabajo.  
* Cerrado (Closed): Concluido el proceso, se bloquea cualquier modificación y el sistema realiza el asiento contable de liquidación de desviaciones.

---

2. Métodos de Emisión de Componentes: Manual vs. Backflush Característica Emisión Manual Notificación Posterior (Backflush) Mecanismo Operativo El personal de almacén genera un documento formal de Emisión para producción antes o durante la fabricación. No se crea emisión manual previa; al registrar el Recibo de producción del producto terminado, el sistema descarga automáticamente todos los componentes calculados por la BOM. Control de Inventario Máximo control físico en planta. Ideal para insumos costosos o con mermas variables. Simplificación administrativa. Ideal para ensambles continuos, piezas pequeñas (tornillos, empaques) o producción rápida. Exclusiones Mandatorias Obligatorio para artículos gestionados por Número de Serie o Lote si se requiere asignar la serie específica al entrar a la línea. No se puede aplicar a artículos serializados que requieran selección manual estricta antes de ingresar a la línea.  
   ---

LECCIÓN 5.3: CONTABILIDAD DE COSTOS DE PRODUCCIÓN: CUENTAS WIP Y LIQUIDACIÓN DE DESVIACIONES En un entorno de inventario permanente, la fabricación transforma el valor de materias primas y costos operativos en un nuevo activo valorado (Producto Terminado). \[ Inventario Materias Primas \] ──(Crédito)──┐ ├──\> \[ CUENTA WIP (Trabajo en Proceso) \] \[ Gastos de Recursos/Mano Obra\] ──(Crédito)──┘                     │ │ (Crédito al recibir terminado) ▼ \[ Inventario Producto Terminado \] ──(Débito) │ (Saldo residual al CERRAR la orden) ▼ \[ Cuenta de Desviación de Producción \]

---

1. La Cuenta de Trabajo en Curso (WIP \- Work In Process)  
* Es una cuenta transitoria del activo en el balance general.  
* Retiene monetariamente el costo de todos los materiales, horas de maquinaria y mano de obra entregados a la orden de fabricación mientras el producto está siendo transformado en los talleres.

---

2. Los Asientos Contables del Proceso Productivo A. Emisión para Producción (Issue for Production) Al entregar los insumos a la planta (Manual o Backflush):  
* DEBE: Cuenta WIP \- Inventario de Componentes (Activo / Trabajo en Curso).  
* DEBE: Cuenta WIP \- Recursos (Activo / Trabajo en Curso).  
* HABER: Cuenta de Existencias \- Materias Primas (Descarga física de almacén).  
* HABER: Cuenta de Absorción / Gastos de Recursos (Reconocimiento del costo operativo). B. Recibo de Producción (Receipt from Production) Al declarar que las unidades terminadas ingresan a bodega:  
* DEBE: Cuenta de Existencias \- Producto Terminado (Ingreso físico a inventario valorado).  
* HABER: Cuenta WIP \- Producto Terminado (Descarga de la cuenta de trabajo en proceso). C. Asiento de Cierre y Liquidación de Desviaciones (Closing Journal Entry) Cuando la orden se cierra formalmente:  
* Rara vez el costo real de los insumos y horas consumidas coincide al milímetro con el costo proyectado del producto terminado (p. ej., hubo desperdicio de material, rotura de piezas o se produjo una unidad de más o de menos).  
* El asiento de cierre tiene como misión principal llevar a CERO el saldo residual de la cuenta WIP:  
  * Si el producto terminado continúa en bodega: El sistema ajusta el valor en la cuenta de existencias del producto terminado.  
  * Si el producto terminado ya fue vendido o hay discrepancias de consumo: La diferencia se liquida contra la Cuenta de Desviación de Inventario WIP (WIP Inventory Variance Account) en el estado de pérdidas y ganancias.

---

3. El Reporte de Desviaciones (Variance Report)  
* Accesible directamente desde la pestaña Resumen de la Orden de Producción mediante la flecha naranja junto al campo Desviación Total.  
* Compara cuantitativa y monetariamente:  
  * Cantidad planificada de componentes vs. Cantidad realmente emitida.  
  * Costo estimado vs. Costo real incurrido.  
  * Identifica desviaciones por ineficiencia de mano de obra o exceso de merma en planta.

---

LECCIÓN 5.4: EL MOTOR MRP: FUENTES DE DEMANDA, SUMINISTRO Y RECOMENDACIONES AUTOMATIZADAS El módulo de Planificación de Necesidades de Materiales (MRP \- Materials Requirements Planning) es el cerebro de optimización de la cadena de suministro. Su objetivo es calcular qué pedir o fabricar, en qué cantidad y en qué fecha exacta para cumplir con las ventas sin inflar el inventario de bodega.

---

1. La Ecuación de Balance del Asistente MRP $$\\text{Balance Neto Proyectado} \= \\text{Stock Físico Actual} \+ \\text{Suministros Confirmados} \- \\text{Demandas Comprometidas}$$ FUENTES DE DEMANDA                          FUENTES DE SUMINISTRO (¿Qué nos están pidiendo?)                    (¿Qué viene en camino?) ┌────────────────────────────────────┐       ┌────────────────────────────────────┐ │ • Pedidos de Clientes (Ventas)     │       │ • Pedidos de Compra a Proveedores  │ │ • Pronósticos de Ventas (Forecast) │       │ • Solicitudes de Compra abiertas   │ │ • Acuerdos Globales de Venta       │  vs   │ • Órdenes de Producción activas    │ │ • Facturas de Anticipo de Clientes │       │ • Acuerdos Globales de Compra      │ │ • Niveles de Stock Mínimo exigido  │       │ • Solicitudes de Traslado entrantes│ │ • Solicitudes de Traslado salientes│       └────────────────────────────────────┘ └────────────────────────────────────┘                         │ │                                            │ └──────────────────┬─────────────────────────┘ ▼ \[ ASISTENTE DE MRP WIZARD \] │ ┌──────────────────┴──────────────────┐ ▼                                     ▼ \[ Si el artículo se COMPRA \]          \[ Si el artículo se FABRICA \] Recomendación:                        Recomendación: \- Solicitud de Compra                 \- Orden de Producción \- Pedido de Compra                      (Explota la BOM a niveles inferiores)

---

2. Parámetros de Planificación en Datos Maestros de Artículo Para que el MRP emita recomendaciones inteligentes, la pestaña Datos de planificación del artículo debe contener:  
3. Método de Planificación: MRP o Ninguno.  
4. Método de Aprovisionamiento: Efectuar compra (Buy) o Fabricar (Make).  
5. Intervalo de Pedidos: Frecuencia con la que se consolidan pedidos (ej. diario, semanal, quincenal). Si se define semanal, el MRP agrupa la demanda de toda la semana en una sola orden de compra.  
6. Múltiplo de Pedido: Factor de empaque del proveedor (ej. el artículo solo se puede comprar en múltiplos de 50 unidades; si faltan 65, el MRP recomendará pedir 100).  
7. Cantidad Mínima de Pedido: Lote mínimo negociado comercialmente.  
8. Tiempo de Entrega (Lead Time): Días hábiles requeridos por el proveedor para entregar o por la planta para fabricar.  
9. Tiempo de Entrega Acumulado (Cumulative Lead Time): En artículos con listas BOM multinivel, es la suma de los tiempos de entrega de todos los componentes comprados más el tiempo de ensamble de cada subnivel.

---

3. Las 3 Salidas de Recomendación del MRP Tras ejecutar el asistente de planificación, el sistema presenta el Informe de Recomendación de Pedidos:  
4. Recomendación de Compra: Genera automáticamente Solicitudes de Compra, Ofertas o Pedidos de Compra dirigidos al proveedor habitual con las fechas de entrega calculadas en base al Lead Time.  
5. Recomendación de Producción: Genera Órdenes de Producción en estatus Planificado para los artículos que se fabrican internamente.  
6. Recomendación de Traslado de Inventario: Si la empresa tiene múltiples almacenes y se seleccionó la opción de compensación, el MRP detecta que un almacén secundario tiene excedente y sugiere un traslado en vez de comprar insumos innecesarios a terceros.

---

MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA Problema 1: "El asistente MRP no genera ninguna recomendación para un artículo que tiene pedidos de cliente abiertos y stock en cero"

* Causa Raíz: El artículo está configurado con método de planificación "Ninguno", no tiene proveedor predeterminado, o el almacén donde se registró la venta fue excluido en los pasos de selección del escenario MRP.  
* Instrucción de Asesoría del Copiloto:  
  1. Abrir datos maestros del artículo y verificar en la pestaña Datos de planificación que el Método de planificación esté fijado en MRP.  
  2. Si el artículo se compra, verificar que el Método de aprovisionamiento sea Efectuar compra y que tenga un proveedor asignado en Datos de compras.  
  3. En el Paso 4 del Asistente de MRP, verificar que el almacén donde se originó el pedido esté marcado como Incluido. Problema 2: "Al intentar agregar un Recibo de Producción para un producto terminado con emisión Backflush, el sistema arroja error de stock negativo"  
* Causa Raíz: Como la emisión es automática (Backflush), el sistema intenta descargar los insumos al registrar el producto terminado, pero una de las materias primas hijas de la lista BOM no tiene stock suficiente en el almacén de producción y la empresa tiene bloqueado el stock negativo.  
* Instrucción de Asesoría del Copiloto:  
  1. No forzar la parametrización de stock negativo (eso arruina el costo de inventario).  
  2. Identificar qué componente de la lista BOM está en cero abriendo el reporte de auditoría o la ficha de inventario.  
  3. Ingresar el stock faltante mediante su flujo correspondiente (Entrada de mercancías de compra o traslado desde almacén general al almacén de planta 02).  
  4. Repetir el Recibo de Producción. Problema 3: "La orden de producción se cerró pero la cuenta de existencias del producto terminado muestra un costo unitario distorsionado"  
* Causa Raíz: Se cerró la orden cuando aún no se habían emitido todos los componentes planificados, o se emitió una cantidad excesiva de horas de recursos sin ajustar la cantidad de producto terminado recibido.  
* Instrucción de Asesoría del Copiloto:  
  1. Abrir la Orden de Producción cerrada y consultar la pestaña Resumen \> Desviación Total.  
  2. Abrir el Reporte de Desviaciones con la flecha naranja para auditar qué componente generó la variación.  
  3. Si el producto terminado aún no ha sido vendido, el sistema ajustó su costo contable automáticamente en el asiento de cierre; si ya fue vendido, la desviación se absorbió en la cuenta de resultados WIP Variance.

---

BANCO DE EVALUACIÓN SITUACIONAL Pregunta 1 (Estructura de Manufactura) Una empresa vende un kit promocional navideño que contiene un vino, dos copas y una caja de chocolates a un precio especial. La empresa no ensambla previamente los kits en bodega, sino que los operarios empacan los tres productos en el momento en que se genera el despacho de venta. ¿Qué tipo de Lista de Materiales (BOM) debe configurarse en SAP Business One?

* A) Lista de Materiales de Producción con Orden de Fabricación.  
* B) Lista de Materiales de Ventas. \[CORRECTA\]  
* C) Lista de Materiales de Modelo.  
* D) No se puede utilizar una lista BOM; se deben vender los tres artículos por separado. Explicación: La LdM de Ventas agrupa componentes inventariables bajo un código padre no inventariable para fijar un precio comercial conjunto, descargando los componentes en el momento de la Entrega sin requerir orden de producción. Pregunta 2 (Contabilidad Industrial) En una empresa que utiliza inventario permanente, ¿qué asiento contable se genera al registrar una Emisión para Producción manual de materias primas?  
* A) Débito a Costo de Ventas y Crédito a Existencias de Materias Primas.  
* B) Débito a Cuenta WIP (Trabajo en Proceso) y Crédito a Cuenta de Existencias de Materias Primas. \[CORRECTA\]  
* C) Débito a Cuenta de Existencias de Producto Terminado y Crédito a Proveedores.  
* D) Ninguno, los asientos se generan únicamente al cerrar la orden de producción. Explicación: La emisión retira físicamente los insumos de bodega y transfiere su valor patrimonial a la cuenta de Trabajo en Curso (WIP), reflejando que el valor sigue en posesión de la empresa pero en proceso de transformación.

---

GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS) \[ { "scene": "01\_la\_receta\_industrial", "voicePrompt": "Claro, analítico y motivador", "text": "Fabricar un producto en SAP comienza con una receta impecable: la Lista de Materiales. No basta con enumerar pernos y placas de metal; una lista de producción moderna integra las horas de mano de obra y los tiempos de maquinaria. Si tu receta está bien diseñada, el sistema sabe exactamente cuánto te cuesta encender una máquina y pagarle a un operario para entregar a tiempo.", "durationEstimate": "18s" }, { "scene": "02\_el\_misterio\_del\_wip", "voicePrompt": "Didáctico y financiero", "text": "¿Alguna vez te has preguntado a dónde va el costo de los materiales mientras se están ensamblando en la fábrica? Van a una cuenta contable estratégica llamada WIP, o Trabajo en Proceso. Los materiales salen de la bodega, entran al taller como WIP, y solo cuando el producto terminado está completamente listo e inspeccionado, ese valor acumulado se convierte en inventario comercializable.", "durationEstimate": "19s" }, { "scene": "03\_el\_cerebro\_del\_mrp", "voicePrompt": "Estratégico, visionario y ejecutivo", "text": "Planificar compras a ojo cerrado es la forma más rápida de quebrar una fábrica. El motor MRP analiza todos tus pedidos de venta, tus pronósticos y los tiempos que tarda cada proveedor. En segundos, cruza lo que tienes contra lo que debes entregar y te genera las órdenes de compra y de producción exactas. Compras lo justo, no acumulas mermas y nunca le fallas a un cliente.", "durationEstimate": "20s" } \]

\================================================================================

﻿MÓDULO 06: GESTIÓN DE SERVICIO AL CLIENTE (TARJETAS DE EQUIPO, CONTRATOS SLA Y LLAMADAS DE SERVICIO) (SAP BUSINESS ONE 10.0 & ERP) Tipo de Contenido: Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA Fuentes Oficiales Analizadas: 10\_Service\_11\_CSProcess\_Process\_ES.pdf Nivel: Intermedio \- Avanzado / Postventa, Garantías, Mesa de Ayuda y Servicios de Campo Tiempo Estimado de Estudio: 60 minutos (dividido en 4 lecciones integradas)

---

ÍNDICE DEL MÓDULO

1. Lección 6.1: Tarjetas de Equipo y Trazabilidad de Activos Serializados  
2. Lección 6.2: Modelos y Contratos de Servicio: Gestión de Acuerdos de Nivel de Servicio (SLA)  
3. Lección 6.3: El Ciclo de Vida de la Llamada de Servicio: Colas, Despacho Técnico y Resolución  
4. Lección 6.4: Base de Conocimientos de Soluciones, Costeo de Gastos y Facturación Postventa  
5. Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA  
6. Banco de Evaluación Situacional  
7. Guiones Humanizados para Locución IA (ElevenLabs)

---

LECCIÓN 6.1: TARJETAS DE EQUIPO Y TRAZABILIDAD DE ACTIVOS SERIALIZADOS

1. ¿Qué es una Tarjeta de Equipo de Cliente (Customer Equipment Card)? La Tarjeta de Equipo es el registro maestro que almacena el expediente histórico y técnico de un artículo individual con Número de Serie único instalado en las instalaciones del cliente o gestionado por la empresa. ┌────────────────────────────────────────────────────────────────────────┐ │                      TARJETA DE EQUIPO DE CLIENTE                      │ ├────────────────────────────────────────────────────────────────────────┤ │ • Número de Serie del Fabricante / Interno                             │ │ • Código y Nombre del Cliente (Interlocutor Comercial)                 │ │ • Dirección de Instalación Física del Equipo                           │ │ • Historial Integrado: Llamadas de servicio, Contratos y Transacciones │ │ • Anexos: Planos, manuales de usuario, certificados de calibración     │ │ • Estado del Equipo: Activo, En préstamo, En laboratorio, Devuelto     │ └────────────────────────────────────────────────────────────────────────┘

---

2. Creación Automática vs. Manual de Tarjetas de Equipo \[ REQUISITOS PREVIOS EN CONFIGURACIÓN \]

3. Gestión de Series: "Números de serie unívocos por empresa" (Parametrizaciones Generales \> Inventario).

4. Casilla activa: "Creación automática de tarjeta de equipo".

5. En Maestro del Artículo: Administrado por números de serie \+ Modelo de garantía asignado. │ ▼ \[ FACTURA DE CLIENTES O ENTREGA \] │ (Al añadir el documento de venta) │ ▼ \[ SE CREA AUTOMÁTICAMENTE LA TARJETA DE EQUIPO \] \+ \[ SE CREA EL CONTRATO DE SERVICIO TIPO GARANTÍA \] Método de Creación Disparador Operativo Caso de Uso Empresarial Creación Automática Al contabilizar una Entrega o una Factura de Clientes con artículos serializados. Venta regular de computadoras, servidores, impresoras industriales, vehículos o maquinaria pesada. Creación Manual Desde el menú Servicio \> Tarjeta de equipo. Prestación de soporte y mantenimiento a equipos que el cliente compró a terceros o que son de fabricación previa. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

6. Estados de la Tarjeta y Reglas de Atención

* Activo (Active): Equipo operativo; permite abrir llamadas de servicio y vincular contratos vigentes.  
* Concedido en préstamo (Loaned): Equipo temporal entregado al cliente mientras su equipo original está en taller; permite abrir llamadas.  
* En laboratorio (In Lab) / Devuelto (Returned) / Cancelado (Terminated): El sistema bloquea la creación de llamadas de servicio asociadas a este registro para evitar registrar gastos indebidos.

---

4. Soporte Multicliente y Trazabilidad Comercial En Parametrizaciones de documento \> Por documento \> Tarjeta de equipo:  
* Vincular varios interlocutores a una tarjeta: Permite asociar el proveedor al que se le compró la máquina y el cliente final al que se le vendió.  
* Añadir automáticamente nuevos IC a tarjetas existentes: Si un cliente devuelve un equipo y la empresa lo reacondiciona y lo revende a un segundo cliente con el mismo número de serie, toda la historia previa se preserva en la misma tarjeta.

---

LECCIÓN 6.2: MODELOS Y CONTRATOS DE SERVICIO: GESTIÓN DE ACUERDOS DE NIVEL DE SERVICIO (SLA)

1. Las 3 Tipologías de Contratos de Servicio ┌──\> \[ 1\. Tipo: Número de Serie \]  (Vinculado a una Tarjeta de Equipo específica) │ \[ TIPOS DE CONTRATOS / MODELOS \] ──\> \[ 2\. Tipo: Cliente \]         (Servicios globales/bolsa de horas sin equipo fijo) │ └──\> \[ 3\. Tipo: Grupo de Artículos \](Aplica a toda una familia de productos) Tipo de Contrato Objeto de Vinculación Características Principales Número de Serie Tarjeta de Equipo específica. Típico de garantías de fábrica y contratos de mantenimiento preventivo para maquinaria o hardware. Cliente Código de Interlocutor Comercial. Acuerdos de consultoría, soporte remoto general, mesa de ayuda corporativa sin depender de un activo físico. Grupo de Artículos Familia de artículos del maestro. Contratos de cobertura para todos los productos de una categoría (p. ej., "Mantenimiento para todas las impresoras láser").  
   ---

2. Estructuración del Acuerdo de Nivel de Servicio (SLA) En el Contrato de Servicio se definen las cláusulas operativas y compromisos de atención:  
3. Ficha General:  
   * Tiempo de Respuesta (Resolution Time): Plazo máximo comprometido (en horas o días) para acusar recibo y asignar un técnico al incidente.  
   * Tiempo de Resolución: Plazo límite comprometido para entregar la solución operativa.  
4. Ficha Cobertura:  
   * Horario de Disponibilidad: Ventanas de cobertura (ej. Lunes a Viernes de 8:00 a 17:00, Lunes a Sábado de 7:00 a 19:00, o 24/7).  
   * Inclusión de Feriados/Festivos: Determina si los días festivos pausan el cronómetro del SLA.  
   * Rubros de Costo Cubiertos:  
     * Piezas / Repuestos (Parts): Si están cubiertos, los repuestos se entregan sin cargo adicional.  
     * Mano de Obra (Labor): Horas de trabajo del personal técnico cubiertas.  
     * Desplazamiento (Travel): Viáticos y transporte del personal a las instalaciones del cliente.

---

LECCIÓN 6.3: EL CICLO DE VIDA DE LA LLAMADA DE SERVICIO: COLAS, DESPACHO TÉCNICO Y RESOLUCIÓN \[ 1\. Entrada del Incidente \]  ──\> Registro de Llamada (Validación automática de Contrato y Garantía) │ ▼ \[ 2\. Asignación y Ruteo \]     ──\> Asignación directa a Responsable O envío a una COLA DE ATENCIÓN (Queue) │ ▼ \[ 3\. Diagnóstico y Visitas \]  ──\> Registro de Actividades \+ Planificación de Visitas Técnicas (Técnicos) │ ▼ \[ 4\. Consulta de Soluciones \] ──\> Vinculación con Base de Conocimientos de Soluciones │ ▼ \[ 5\. Liquidación de Costos \]  ──\> Movimientos de repuestos / Facturación de servicios no cubiertos │ ▼ \[ 6\. Cierre de la Llamada \]   ──\> Registro obligatorio de Resolución \-\> Estatus: CERRADO

---

1. Apertura de la Llamada de Servicio Al recibir el contacto del cliente:  
* Se selecciona el Cliente y el Artículo / Número de Serie (Tarjeta de Equipo).  
* Validación Automática de Cobertura: El sistema audita si existe un contrato activo y si la llamada está ingresando dentro de la franja horaria cubierta. Si no hay contrato o está vencido, emite una advertencia visual al operador.  
* El sistema calcula inmediatamente el campo "La resolución tiene que ser antes de", sumando el tiempo de resolución estipulado a las horas hábiles de cobertura.

---

2. Gestión por Colas de Servicio (Service Queues)  
* Permite agrupar especialistas por área técnica (ej. Cola Servidores, Cola Impresoras, Cola Software ERP).  
* El operador inicial clasifica el problema y enruta la llamada a la Cola respectiva.  
* Los miembros del equipo consultan el reporte Servicio \> Informes servicio \> Llamadas de servicio por cola, toman los tickets pendientes y se los autoasignan para atención.  
* Los técnicos se configuran en el Maestro de Empleados asignándoles el rol de Técnico.

---

3. Planificación de Visitas de Campo (Field Service Dispatching)  
* En la ficha Planificación de la llamada de servicio se coordinan las salidas de los técnicos.  
* Configuración Crítica de la Interfaz:  
  * Modo Simple: Permite agendar una única visita técnica por llamada.  
  * Programación Múltiple (Multiple Scheduling): Habilita una grilla completa para planificar múltiples visitas, diferentes técnicos y locaciones para un mismo caso. ⚠️ Advertencia de Implementación: La activación de programación múltiple en Parametrizaciones de documento \> Llamada de servicio es irreversible.

---

LECCIÓN 6.4: BASE DE CONOCIMIENTOS DE SOLUCIONES, COSTEO DE GASTOS Y FACTURACIÓN POSTVENTA

1. La Base de Conocimientos de Soluciones (Solutions Knowledge Base) Repositorio institucional de diagnósticos, síntomas y procedimientos de resolución aprobados:  
   * Se puede consultar y asociar una o múltiples soluciones existentes directamente a la llamada de servicio.  
   * Si el técnico desarrolla una solución novedosa, puede redactarla y guardarla en la base de conocimientos con un clic.  
   * Estados de la solución: Interno, En Revisión, Publicado (controlados mediante el esquema de autorizaciones de usuarios).

---

2. Documentos Relacionados y Liquidación de Gastos En la ficha Documentos Relacionados de la llamada de servicio se registra todo el impacto financiero y logístico:  
   1. Entrega de Repuestos a Técnicos: Traslados de inventario (Inventory Transfer) desde la bodega central al almacén móvil/vehículo del técnico.  
   2. Consumo de Repuestos y Mano de Obra:  
   * Si están cubiertos por el contrato: Se registran para auditoría interna de costos y no se facturan al cliente.  
   * Si están fuera de contrato o sin garantía: El coordinador presiona el botón Nuevo Documento para emitir inmediatamente una Oferta de Ventas, Entrega o Factura de Clientes por el valor de las piezas y horas hombre trabajadas.  
   3. Al marcar la opción Visualizar todos los documentos, se muestra la cadena completa de compras a proveedores, entregas y devoluciones de piezas de repuesto vinculadas a la llamada.

---

4. Requisitos para el Cierre Formal de la Llamada de Servicio El sistema SAP Business One aplica una regla de integridad estricta:  
   * NO se puede cambiar el estado a "Cerrado" si la llamada no cuenta con:  
   1. Al menos una solución vinculada de la Base de Conocimientos, O  
   2. Un texto descriptivo explícito registrado en la ficha Resolución.  
   * Al cerrarse, el sistema graba la fecha y hora exacta en el campo Cerrado el para alimentar los reportes de eficiencia operativa.

---

MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA Problema 1: "Se emitió una factura de clientes para un artículo serializado pero el sistema no generó la Tarjeta de Equipo ni el Contrato de Garantía"

* Causa Raíz: Falta alguna de las 3 condiciones de activación en cadena: la parametrización de números de serie unívocos por empresa no está activa, la casilla de creación automática está desmarcada, o el artículo no tiene asignado un modelo de garantía en su maestro.  
* Instrucción de Asesoría del Copiloto:  
1. Verificar en Gestión \> Inicialización sistema \> Parametrizaciones generales \> Inventario que Números de serie unívocos por esté en Números de serie y marcar Creación automática de tarjeta de equipo.  
2. Abrir los datos maestros del artículo y en la pestaña General confirmar que tenga asignado un modelo de contrato en el campo Modelo de garantía (debe ser tipo Número de Serie).  
3. Si la factura ya fue creada, la tarjeta de equipo debe crearse manualmente por única vez para ese activo. Problema 2: "El usuario intenta cerrar una llamada de servicio pero el sistema arroja error y no permite grabar el estado Cerrado"  
* Causa Raíz: El operador intentó cambiar el campo Estado a "Cerrado" dejando vacías las pestañas de Solución y Resolución.  
* Instrucción de Asesoría del Copiloto:  
1. Recordar al usuario que SAP exige justificación técnica de cierre.  
2. Solicitar al operador que ingrese el detalle del trabajo efectuado en la pestaña Resolución o que seleccione una solución existente en la pestaña Soluciones.  
3. Tras guardar el texto de resolución, proceder al cambio de estado a Cerrado. Problema 3: "El SLA calcula una fecha límite de resolución incoherente (p. ej., vence en la noche o en fin de semana)"  
* Causa Raíz: El contrato de servicio asociado tiene mal configurada la franja horaria de cobertura en la pestaña Cobertura (ej. tiene marcadas 24 horas continuas en vez de 8:00 a 17:00 o no tiene tildada la exclusión de feriados).  
* Instrucción de Asesoría del Copiloto:  
1. Abrir el Contrato de Servicio asociado a la llamada y revisar la ficha Cobertura.  
2. Ajustar los días de atención y los rangos horarios de lunes a viernes.  
3. Asegurar que la casilla Incluir feriados esté configurada según el acuerdo comercial con el cliente.

---

BANCO DE EVALUACIÓN SITUACIONAL Pregunta 1 (Automatización de Postventa) ¿Cuáles son los requisitos de parametrización indispensables en SAP Business One para que al crear una Entrega de venta se genere automáticamente la Tarjeta de Equipo y el Contrato de Garantía del cliente?

* A) Solo definir el artículo como inventariable.  
* B) Activar creación automática en parametrizaciones generales, configurar números de serie únicos por empresa, gestionar el artículo por números de serie y asignarle un modelo de garantía tipo número de serie. \[CORRECTA\]  
* C) Crear primero una orden de producción y luego una factura de reserva.  
* D) Las tarjetas de equipo nunca se crean automáticamente; siempre requieren captura manual. Explicación: La automatización requiere la conjunción de las opciones generales de inventario único y la configuración del artículo serializado con su modelo de garantía predeterminado. Pregunta 2 (Control Operativo de Casos) Un técnico atendió un incidente en campo y el cliente firmó la conformidad. El coordinador de servicio quiere cambiar el estado de la llamada a "Cerrado", pero el sistema se lo bloquea. ¿Qué acción previa es obligatoria?  
* A) Facturar la llamada obligatoriamente, incluso si está en garantía.  
* B) Anexar un plano en formato PDF en la ficha Anexos.  
* C) Registrar un texto explicativo en la ficha Resolución o vincular una solución de la Base de Conocimientos. \[CORRECTA\]  
* D) Eliminar las actividades del técnico. Explicación: SAP Business One no permite cerrar llamadas sin documentar la causa y procedimiento de solución ejecutado.

---

GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS) \[ { "scene": "01\_el\_expediente\_del\_activo", "voicePrompt": "Cálido, profesional y ordenado", "text": "La venta de un producto no termina cuando el camión sale de la bodega; ahí es exactamente donde empieza la relación de servicio. La Tarjeta de Equipo es la cédula de identidad de cada máquina que entregas a tus clientes. Con su número de serie conoces qué repuestos ha necesitado, quién la instaló y si aún cuenta con la garantía del fabricante.", "durationEstimate": "19s" }, { "scene": "02\_el\_compromiso\_sla", "voicePrompt": "Firme, ejecutivo y orientado a calidad", "text": "Prometer rapidez es fácil; cumplirla requiere reglas claras. Con los Contratos de Servicio y los SLAs en SAP, el reloj corre a favor de la excelencia. Si tu cliente tiene cobertura de ocho a cinco, el sistema calcula de forma exacta la fecha límite de respuesta sin castigarte los fines de semana. Tu mesa de ayuda siempre sabe qué casos priorizar.", "durationEstimate": "20s" }, { "scene": "03\_la\_base\_de\_conocimiento", "voicePrompt": "Inspirador y colaborativo", "text": "El verdadero valor de un equipo de soporte está en su conocimiento compartido. Cuando un técnico resuelve una falla compleja y la documenta en la base de soluciones, esa experiencia queda inmortalizada en la empresa. La próxima vez que suene el teléfono por el mismo problema, cualquier operador podrá resolverlo en minutos.", "durationEstimate": "19s" } \]

\================================================================================

﻿MÓDULO 07: GESTIÓN DE PROYECTOS Y FACTURACIÓN POR HITOS (PROJECT MANAGEMENT & BILLING WIZARD) (SAP BUSINESS ONE 10.0 & ERP) Tipo de Contenido: Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA Fuentes Oficiales Analizadas: 10\_ProjectManage\_11\_ProjectManage.pdf y 10\_ProjectManage\_11\_ProjectManage\_Billing.pdf Nivel: Avanzado / Control de Proyectos, PMI, Finanzas Analíticas y Facturación Automatizada Tiempo Estimado de Estudio: 65 minutos (dividido en 4 lecciones integradas)

---

ÍNDICE DEL MÓDULO

1. Lección 7.1: Arquitectura del Módulo y Datos Maestros de Proyecto  
2. Lección 7.2: Desglose de Etapas, Tareas, Dependencias y Jerarquías de Subproyectos  
3. Lección 7.3: Trazabilidad Transaccional, Órdenes de Trabajo e Incidencias Abiertas  
4. Lección 7.4: Asistente de Facturación de Proyectos: Horas Hombre, Gastos y Entregas  
5. Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA  
6. Banco de Evaluación Situacional  
7. Guiones Humanizados para Locución IA (ElevenLabs)

---

LECCIÓN 7.1: ARQUITECTURA DEL MÓDULO Y DATOS MAESTROS DE PROYECTO

1. ¿Qué es el Módulo de Gestión de Proyectos en SAP Business One? Es una consola de comando centralizada (Workbench) que unifica la planificación física, cronológica y operativa de un proyecto con su control presupuestario y contable en tiempo real. ┌──\> \[ PROYECTO EXTERNO \] (Se ejecuta para un Cliente; genera facturación A/R) \[ TIPOS DE PROYECTO MAESTRO \] ─┤ └──\> \[ PROYECTO INTERNO \] (Iniciativa propia de la empresa: I+D, mudanza, mejora) ⚠️ Requisito Previo Mandatorio: El módulo de Gestión de Proyectos debe activarse manualmente en la empresa en Gestión \> Inicialización sistema \> Detalles sociedad \> ficha Inicialización básica \> Habilitar gestión de proyectos.

---

2. Estructura de la Cabecera del Maestro de Proyectos  
* Tipo de Proyecto: Externo (requiere código de Interlocutor Comercial / Cliente) o Interno.  
* Estatus del Proyecto:  
  * Iniciado (Started): En ejecución activa. Permite asociar documentos y registrar avances.  
  * En pausa (Paused): Congelado temporalmente por decisión del cliente o falta de recursos.  
  * Detenido (Stopped): Cancelado antes de culminar. Graba automáticamente la fecha de cierre.  
  * Finalizado (Finished): Todas las obligaciones contractuales han concluido.  
* Barra de Avance (% Complete): Se actualiza automáticamente como la suma de las ponderaciones de todas las etapas marcadas como finalizadas.  
* Enlace con el Proyecto Financiero (Financial Project Code):  
  * Es el código contable analítico creado en el plan de cuentas (Gestión \> Definiciones \> Finanzas \> Proyectos).  
  * Función Clave: Sirve de puente para que las transacciones contables de compras, ventas y asientos de diario se vinculen automáticamente al proyecto logístico.

---

LECCIÓN 7.2: DESGLOSE DE ETAPAS, TAREAS, DEPENDENCIAS Y JERARQUÍAS DE SUBPROYECTOS \[ PROYECTO PADRE \] ─── Factor de Contribución: 100% │ ├──\> \[ Subproyecto 01: Sede Norte \] (Contribución: 60%) │         ├── Etapa 1: Obra Civil (Ponderación: 30%) ──\[Dependencia\]──┐ │         └── Etapa 2: Redes y Cableado (Ponderación: 70%) \<──────────┘ │ └──\> \[ Subproyecto 02: Sede Sur \]   (Contribución: 40%) ├── Etapa 1: Ensamble Servidores (Ponderación: 50%) └── Etapa 2: Capacitación a Usuarios (Ponderación: 50%)

---

1. La Ficha Etapas (Stages Tab) La pestaña Etapas es la columna vertebral del proyecto:  
* Cada fila representa una etapa o tarea específica dentro del flujo de trabajo.  
* Fechas Planificadas vs. Reales:  
  * Fecha de Fin (End Date): La fecha meta comprometida para la entrega de la etapa.  
  * Fecha de Finalización (Finished Date): La fecha real en que se completó. Al marcar la casilla Finalizado, el sistema graba la fecha actual automáticamente (ajustable manualmente si hubo desfase de registro).  
* Costos Planificados (Presupuesto): En cada etapa se asigna un costo estimado de gastos y compras para evaluar desviaciones presupuestarias.

---

2. Dependencias entre Etapas (Stage Precedence)  
* Se pueden configurar hasta 4 dependencias por cada fila de etapa.  
* Regla Operativa: Si la Etapa 5 (Instalación de Servidores) depende de la Etapa 3 (Cableado Estructurado), el sistema no permitirá marcar la Etapa 5 como finalizada hasta que la Etapa 3 haya sido concluida y marcada como finalizada.  
* Las dependencias pueden cruzar entre diferentes subproyectos dentro del mismo proyecto maestro.

---

3. Gestión de Subproyectos Jerárquicos Para proyectos de gran envergadura (multisede, construcción por fases o implementaciones multinacionales):  
* El proyecto maestro se desglosa en una estructura tipo árbol de subproyectos.  
* Cada subproyecto posee sus propias etapas, presupuesto, documentos e incidencias.  
* Porcentaje de Contribución (Subproject Contribution %):  
  * Define el peso relativo del subproyecto en el total del proyecto padre.  
  * Ejemplo: Si el Subproyecto A representa el 20% del proyecto general y lleva un 50% de avance en sus etapas, su aporte al avance del proyecto consolidado es exactamente del 10%.  
* Plantillas de Subproyectos: Para replicar configuraciones estándar (ej. abrir una sucursal en varias ciudades), se puede crear un subproyecto a partir de una plantilla o duplicar uno existente.

---

LECCIÓN 7.3: TRAZABILIDAD TRANSACCIONAL, ÓRDENES DE TRABAJO E INCIDENCIAS ABIERTAS

1. Mecanismos de Vinculación de Documentos Para que una factura, orden de compra o pedido de venta sume a los costos o ingresos del proyecto existen dos vías: \[ VÍA 1: ASIGNACIÓN ASISTIDA POR PROYECTO FINANCIERO \]  
2. El usuario crea una Factura de Proveedor (A/P) e incluye el Código de Proyecto Financiero "101".  
3. Al abrir el Maestro de Proyectos, el sistema detecta transacciones huérfanas y pregunta: "¿Desea asignar estos documentos al maestro del proyecto?"  
4. En la ventana emergente, el gerente de proyecto selecciona las líneas y las asocia a la Etapa correspondiente.

\[ VÍA 2: VINCULACIÓN DIRECTA POR LÍNEA (STAGE ID) \]

1. En las líneas de cualquier documento de compras, ventas o inventario, se habilita la columna "Etapa".  
2. Se selecciona directamente el identificador único de la etapa (ej. Con1(6-1)).

---

2. Órdenes de Fabricación en Etapas de Proyecto  
* En proyectos que incluyen manufactura de equipos especiales (ej. armado de racks, tableros eléctricos o servidores a la medida), se vinculan Órdenes de Producción (Work Orders) directamente a la etapa.  
* Permite imputar el costo de materias primas y las horas de recursos (técnicos y máquinas) al costo real del proyecto.

---

3. Gestión de Incidencias Abiertas (Open Issues) Durante la ejecución de una etapa en campo pueden surgir imprevistos o bloqueos técnicos:  
* Se registra la incidencia en la sección inferior de la etapa.  
* Integración con Servicio: Cuenta con acceso directo a la Base de Conocimientos de Soluciones del módulo de servicio al cliente. El gerente puede vincular la solución aprobada para que el técnico en campo la aplique.  
* Regla Crítica de Control de Calidad: Una etapa NO puede marcarse como finalizada si tiene incidencias abiertas sin resolver.

---

4. La Pestaña Resumen Financiero (Project Summary) Proporciona el balance financiero en tiempo real: $$\\text{Desviación de Costos (Total Variance)} \= \\text{Total Facturado por Proveedores (A/P)} \- \\text{Presupuesto Planificado}$$ $$\\text{Margen Bruto Proyectado} \= \\text{Total Ingresos Facturados (A/R)} \- \\text{Costos Reales Totales (A/P \+ Fabricación)}$$  
* Importe Abierto (A/P): Suma de pedidos de compra pendientes de recibir (compromisos futuros de caja).  
* Importe Abierto (A/R): Pedidos de clientes confirmados pendientes de facturar.

---

LECCIÓN 7.4: ASISTENTE DE FACTURACIÓN DE PROYECTOS: HORAS HOMBRE, GASTOS Y ENTREGAS El Asistente de Generación de Documentos de Facturación (Billing Document Generation Wizard) es la herramienta que automatiza la monetización de los proyectos hacia el cliente. FUENTES FACTURABLES DEL PROYECTO ┌────────────────────────────────────────────────────────┐ │ • Facturas de Proveedores (Gastos/Compras del proyecto)│ │ • Documentos de Venta Abiertos (Ofertas, Pedidos)      │ │ • Órdenes de Fabricación cerradas (Equipos armados)    │ │ • Actividades de Consultoría (CRM)                     │ │ • Hojas de Registro de Horas (HR Time Sheets)          │ └────────────────────────────────────────────────────────┘ │ ▼ \[ FILTRO DE REGISTROS MARCADOS FACTURABLES \] │ ▼ \[ ASISTENTE DE FACTURACIÓN (BILLING WIZARD) \] │ (Revisión de líneas, cantidades y precios) │ ▼ \[ EMISIÓN AUTOMÁTICA DE FACTURA O ENTREGA (A/R) \]

---

1. El Interruptor de "Facturable" (Chargeable) El asistente de facturación únicamente recopila información que tenga la marca expresa de Facturable:  
2. Documentos de Marketing y Órdenes de Fabricación: Se marca la casilla de selección Facturable directamente en la grilla del Maestro de Proyectos.  
3. Hojas de Horas de Trabajo (Time Sheets) y Actividades CRM:  
   * La condición de facturable no se marca en el documento individual, sino en la configuración previa del Tipo de Actividad (Activity Type) en Gestión \> Definiciones \> Gestión de proyectos \> Tipos de actividad.  
   * Al Tipo de Actividad se le tilda la casilla Facturable y se le asocia un Artículo de Mano de Obra / Servicio (ej. Consultoría Senior \- Tarifa por hora).  
   * Cuando el consultor llena su hoja de horas o registra una reunión de CRM vinculada a la etapa del proyecto, el sistema sabe exactamente qué código de artículo y precio facturarle al cliente.

---

2. Flujo de Ejecución del Asistente  
3. Paso 1: Información de Destino y Fuentes:  
   * Se selecciona si se creará una Factura de Clientes o una Entrega.  
   * Se selecciona el proyecto origen y la etapa destino a la cual quedará amarrada la factura generada.  
   * Se seleccionan las fuentes a incluir (compras, ventas, hojas de horas, fabricación).  
4. Paso 2: Confirmación y Ajustes:  
   * El sistema lista todos los rubros detectados con el mismo código financiero.  
   * El coordinador puede ajustar cantidades de horas, tarifas o excluir líneas que no deban cobrarse al cliente.  
5. Paso 3: Creación y Enlace:  
   * Al pulsar Finalizar, el documento de venta se genera en modo Añadir. Al crearse, queda automáticamente registrado en la etapa del proyecto como ingreso real.

---

MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA Problema 1: "El menú Gestión de Proyectos no aparece en el árbol principal de SAP Business One"

* Causa Raíz: El módulo no ha sido habilitado en la parametrización de la base de datos de la empresa.  
* Instrucción de Asesoría del Copiloto:  
  1. Ingresar como superusuario a Gestión \> Inicialización sistema \> Detalles sociedad.  
  2. En la pestaña Inicialización básica, marcar la casilla Habilitar gestión de proyectos.  
  3. Actualizar la ventana y reiniciar la sesión de SAP. Problema 2: "El usuario intenta marcar una etapa como Finalizada pero el sistema emite un error bloqueante"  
* Causa Raíz: Existen dos posibles causales: a) La etapa tiene dependencias de precedencia configuradas y la etapa base aún no ha sido marcada como finalizada. b) La etapa contiene una o más incidencias en la sección Incidencias abiertas que aún no tienen estatus "Cerrado".  
* Instrucción de Asesoría del Copiloto:  
  1. Verificar la columna Incidencias: si hay incidencias en estado Abierto, ingresar a la incidencia, documentar la solución y cambiar su estado a Cerrado.  
  2. Verificar la columna Dependencia: constatar que la etapa previa requerida esté completada y tildada como Finalizado. Problema 3: "Al ejecutar el Asistente de Facturación de Proyectos no aparece ninguna hora de los consultores cargada en el Time Sheet"  
* Causa Raíz: Los registros de la hoja de horas no están vinculados a un Tipo de Actividad facturable, o el código de proyecto financiero del Time Sheet no coincide con el del proyecto maestro.  
* Instrucción de Asesoría del Copiloto:  
  1. Revisar en Gestión \> Definiciones \> Gestión de proyectos \> Tipos de actividad que el tipo de actividad usado tenga marcada la casilla Facturable y tenga un artículo de servicio asignado.  
  2. Verificar en la Hoja de Horas del empleado que la línea contenga el código del Proyecto Financiero y la Etapa correcta.

---

BANCO DE EVALUACIÓN SITUACIONAL Pregunta 1 (Control Operativo de Proyectos) En un proyecto de implementación de servidores para un cliente externo, la etapa 4 (Instalación de Software) tiene como dependencia la etapa 2 (Montaje de Hardware). Adicionalmente, el técnico registró una incidencia abierta porque faltaba una licencia. ¿Qué condiciones deben cumplirse obligatoriamente antes de poder marcar la etapa 4 como "Finalizada"?

* A) Solo debe emitirse la factura de clientes final.  
* B) La etapa 2 debe estar marcada como finalizada y la incidencia debe estar resuelta y cerrada. \[CORRECTA\]  
* C) Debe crearse un subproyecto nuevo para gestionar la licencia.  
* D) Las dependencias son solo informativas; el usuario puede marcar la etapa 4 como finalizada en cualquier momento. Explicación: SAP Business One aplica controles de integridad estrictos: no permite finalizar etapas si la predecesora no ha concluido o si persisten incidencias abiertas sin resolver. Pregunta 2 (Automatización de Facturación) Una empresa de consultoría IT quiere facturar a su cliente las horas que sus ingenieros registraron en sus Hojas de Horas (Time Sheets) utilizando el Asistente de Facturación. ¿Cómo determina el sistema el precio y el código de artículo que se incluirá en la factura de clientes?  
* A) El asistente solicita teclear el precio manualmente en cada factura.  
* B) A través de la configuración del Tipo de Actividad (Activity Type) asignado a la hora trabajada, el cual tiene asociado un artículo de mano de obra/servicio y está marcado como facturable. \[CORRECTA\]  
* C) Tomando el costo del salario del empleado registrado en Recursos Humanos.  
* D) El asistente no factura horas de empleados, solo facturas de proveedores. Explicación: El enlace entre la hora hombre registrada y la línea de factura se realiza mediante el Tipo de Actividad parametrizado como facturable con su respectivo artículo de servicio.

---

GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS) \[ { "scene": "01\_la\_consola\_del\_proyecto", "voicePrompt": "Visionario, analítico y motivador", "text": "Gestionar un proyecto sin un ERP es como navegar a ciegas en medio de una tormenta. En SAP Business One, cada etapa, cada factura de compras y cada hora invertida por tus ingenieros se sincronizan en una sola pantalla. Ya no tienes que esperar al final del mes para descubrir si un proyecto fue rentable; lo sabes en tiempo real.", "durationEstimate": "20s" }, { "scene": "02\_la\_fuerza\_de\_los\_subproyectos", "voicePrompt": "Estratégico, profesional y estructurado", "text": "Cuando los proyectos crecen y abarcan múltiples ciudades o fases constructivas, dividirlos es la única forma de mantener el control. Con la estructura de subproyectos puedes asignar ponderaciones exactas a cada sede y saber con precisión matemática qué porcentaje de avance lleva la obra corporativa completa.", "durationEstimate": "19s" }, { "scene": "03\_la\_magia\_de\_facturar", "voicePrompt": "Dinámico, entusiasta y resolutivo", "text": "¿Cuánto tiempo pierde tu equipo reuniendo facturas de proveedores y revisando hojas de asistencia para poder cobrarle al cliente? El Asistente de Facturación hace el trabajo pesado por ti. Con un par de clics, consolida compras, horas hombre y entregas en una factura de venta impecable. Menos papeleo, mayor flujo de caja.", "durationEstimate": "20s" } \]

\================================================================================

﻿MÓDULO 08: ADMINISTRACIÓN DEL SISTEMA, MIGRACIÓN DE DATOS (DTW) Y SEGURIDAD (SAP BUSINESS ONE 10.0 & ERP) Tipo de Contenido: Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA Fuentes Oficiales Analizadas: 10\_Impl\_32\_Using\_Data\_Trans\_Workbench.pdf, 10\_Impl\_33\_Importing\_Docs\_using\_DTW.pdf, 10\_Impl\_34\_SystemSetup\_DocumentMasterDataNumbering\_ES.pdf y 10\_Impl\_33\_SystemSetup\_DataOwnership\_ES.pdf Nivel: Avanzado / Consultoría de Implementación, Cutover, DBA y Administración de Seguridad Tiempo Estimado de Estudio: 70 minutos (dividido en 4 lecciones integradas)

---

ÍNDICE DEL MÓDULO

1. Lección 8.1: Arquitectura de Migración de Datos con Data Transfer Workbench (DTW)  
2. Lección 8.2: Migración de Documentos de Marketing y Saldos Iniciales (Cutover)  
3. Lección 8.3: Series de Numeración y Reglas de Documentos y Datos Maestros  
4. Lección 8.4: Seguridad, Permisos y Propiedad de Datos (Data Ownership)  
5. Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA  
6. Banco de Evaluación Situacional  
7. Guiones Humanizados para Locución IA (ElevenLabs)

---

LECCIÓN 8.1: ARQUITECTURA DE MIGRACIÓN DE DATOS CON DATA TRANSFER WORKBENCH (DTW)

1. ¿Qué es Data Transfer Workbench (DTW)? DTW es la herramienta cliente/servidor oficial de SAP diseñada para la importación y actualización masiva de datos durante la fase de puesta en marcha (Go-Live / Cutover) o en cargas periódicas complejas. ┌────────────────────────┐      ┌─────────────────────────┐ │ Plantillas Excel / CSV │      │ Base de Datos Externa   │ │ (Delimitado tab/coma)  │      │ (Consultas SQL vía ODBC)│ └───────────┬────────────┘      └────────────┬────────────┘ │                                │ └───────────────┬────────────────┘ ▼ \[ DATA TRANSFER WORKBENCH (DTW) \] │ (Validación mediante interfaz DI-API) │ ▼ \[ BASE DE DATOS SAP BUSINESS ONE \] (Tablas SQL Server o SAP HANA) ⚠️ Reglas de Integridad de DTW:  
2. DTW NO permite eliminar registros de la base de datos (solo insertar o actualizar).  
3. DTW NO permite importar documentos cerrados o históricos cancelados.  
4. La importación respeta todas las reglas de negocio y validaciones del DI-API, garantizando que nunca se corrompa la coherencia transaccional.

---

2. Estructura de las Plantillas Predefinidas Las plantillas se encuentran en la subcarpeta Templates dentro del directorio de instalación de DTW y siguen la nomenclatura de las tablas del diccionario de datos de SAP: Fila 1 (Propiedades DI-API)  \--\> CardCode | CardName          | CardType  | GroupCode Fila 2 (Campos de Base Datos)--\> CardCode | CardName          | CardType  | GroupCode Fila 3 en adelante (Datos)   \--\> C10000   | Corporación ABC   | cCustomer | 100  
* Fila 1 y Fila 2: Son obligatorias y no deben eliminarse ni modificarse.  
* Valores Enumerados (Enums): Si el comentario de la cabecera indica un tipo enum, debe utilizarse el valor exacto de la DI-API (ej. en CardType no se escribe C, sino cCustomer; para proveedores cSupplier).  
* Columnas en blanco: Si un campo tiene valor por defecto en SAP (ej. listas de precios, cuentas contables asociadas al grupo), la columna puede dejarse en blanco.

---

3. Relación entre Plantillas Padre e Hijo (Parent & Child Templates) Para objetos complejos que involucran múltiples tablas (ej. Interlocutor Comercial con Contactos y Direcciones):  
* Plantilla Padre (OCRD): Define el registro principal (Columna A: CardCode \= C00001).  
* Plantilla Hijo de Contactos (OCPR):  
  * Columna A (ParentKey): Se coloca C00001 (clave foránea que apunta al padre).  
  * Columna B (LineNum): Para actualizar contactos existentes se usa 0, 1, 2... Para añadir un nuevo contacto, se deja la columna LineNum en blanco.  
* Plantilla Hijo de Direcciones (CRD1):  
  * No usa LineNum; utiliza el código alfanumérico único Address (Columna C) y el tipo bo\_BillTo o bo\_ShipTo (Columna N).

---

4. Optimización de Rendimiento en SAP HANA (Enable Faster Import) Para migraciones masivas (más de 1.000 registros):  
* Al iniciar sesión en DTW, se puede marcar la casilla Enable Faster Import.  
* Habilita la ejecución multihilo en paralelo mediante componentes COM+ (de 4 hasta 21 hilos de ejecución simultánea).  
* Restricciones: Solo disponible para SAP HANA; no permite ejecutar simulación previa y está restringido a datos maestros (artículos e interlocutores) y documentos de marketing abiertos.

---

LECCIÓN 8.2: MIGRACIÓN DE DOCUMENTOS DE MARKETING Y SALDOS INICIALES (CUTOVER) DOCUMENTO PADRE (Cabecera)              DOCUMENTO HIJO (Líneas) ┌───────────────────────────┐           ┌───────────────────────────┐ │ OINV \- Facturas Clientes  │           │ INV1 \- Detalle de Líneas  │ ├───────────────────────────┤           ├───────────────────────────┤ │ DocNum: 501               │\<──\[Une\]──\>│ ParentKey: 501            │ │ CardCode: C20000          │           │ LineNum: 0 | ItemCode: A1 │ │ DocType: dDocument\_Items  │           │ LineNum: 1 | ItemCode: A2 │ └───────────────────────────┘           └───────────────────────────┘

---

1. Manejo de Numeración de Documentos Migrados: ¿Número SAP o Número Histórico? Enfoque de Numeración Configuración en Plantilla DTW Resultado en SAP Business One Numeración Automática SAP DocNum \= Cualquier número secuencial. HandWritten \= Dejar vacío o poner tNO. El sistema asigna el siguiente número disponible en la serie predeterminada de SAP. Conservar Número Heredado (Legacy) DocNum \= El número de la factura anterior (ej. 10450). HandWritten \= tYES. El documento se crea con el número original histórico y adquiere automáticamente el estado "Abierto \- Impreso".  
   ---

2. Trazabilidad entre Documentos Base y Destino (Base Entry Linking) Para migrar pedidos abiertos que ya tienen entregas parciales y replicar el vínculo Copiar de / Copiar a: En la plantilla de líneas del documento destino (Document\_Lines) se configuran los campos:  
3. BaseType: Código numérico de la DI-API que identifica el tipo de documento previo:  
   * 23 \= Oferta de Ventas.  
   * 17 \= Pedido de Cliente (Sales Order).  
   * 15 \= Entrega (Delivery).  
   * 13 \= Factura de Clientes (A/R Invoice).  
   * 22 \= Pedido de Compras (Purchase Order).  
   * 20 \= Entrada de Mercancías de Compras (Goods Receipt PO).  
4. BaseEntry: Es el DocEntry (clave primaria interna autoincremental de la cabecera en la base de datos) del documento base.  
5. BaseLine: El número de línea del documento base que se está absorbiendo (iniciando en 0 para la primera fila).

---

3. Estrategia de Saldos Iniciales y Prevención de "Doble Contabilización" Uno de los errores más graves en un Cutover es duplicar inventarios o saldos contables: ESTRATEGIA RECOMENDADA DE SALDOS INICIALES ┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐ │          INVENTARIO FÍSICO           │     │          SALDOS DE CLIENTES          │ ├──────────────────────────────────────┤     ├──────────────────────────────────────┤ │ Se carga mediante:                   │     │ Se carga mediante:                   │ │ ENTRADA DE MERCANCÍAS                │     │ FACTURAS DE SERVICIO (Service Type)  │ │ (Goods Receipt en módulo Inventario) │     │ (DocType \= 'dDocument\_Service')      │ │ • Carga cantidades físicas exactas.  │     │ • NO mueve stock físico ni cuentas de│ │ • Asienta costo contra cuenta puente │     │   inventario en almacén.             │ │   de saldos iniciales de balance.    │     │ • Se asienta contra cuenta puente de │ │                                      │     │   contrapartida de saldos iniciales. │ └──────────────────────────────────────┘     └──────────────────────────────────────┘ ⚠️ Regla de Oro: Si las facturas de clientes pendientes por cobrar se importan como artículos físicos sin documento base previo, el sistema descontará inventario por segunda vez y duplicará los costos contables. Por ello, las facturas de saldo inicial deben migrarse como tipo Servicio.

---

LECCIÓN 8.3: SERIES DE NUMERACIÓN Y REGLAS DE DOCUMENTOS Y DATOS MAESTROS

1. Configuración de Series de Documentos En Gestión \> Inicialización sistema \> Numeración de documento:  
* Serie Principal (Primary Series): Viene por defecto en toda base de datos limpia; inicia en 1 y no tiene límite superior.  
* Series Múltiples: Permiten dividir la facturación por sucursales, terminales de punto de venta (POS) o tipos de transacción.  
* Regla Estricta de No Solapamiento: Para crear una nueva serie dentro del mismo tipo de documento, es obligatorio definir el número final de la serie anterior para impedir la duplicación de folios.  
* Prefijos y Sufijos: Se pueden añadir códigos alfanuméricos (ej. FAC-, \-2026). El prefijo o sufijo se imprime en el papel o PDF, pero no forma parte del número entero numérico almacenado en la base de datos.

---

2. Seguridad y Asignación de Series por Usuario Un usuario nuevo no tiene acceso a ninguna serie, ni siquiera a la serie principal, hasta que se le autorice:  
3. En la configuración de la serie, se asocia la serie a un Grupo de Numeración (Grupo 1 al 10).  
4. En Gestión \> Inicialización sistema \> Autorizaciones \> Autorizaciones generales, se busca el rubro Serie de numeración y se otorga Autorización Total al grupo correspondiente.  
5. Se establece una Serie por Defecto para cada usuario mediante el botón Fijar como por defecto.

---

3. Indicadores de Período y Series de Cancelación  
* Indicadores de Período (Period Indicators): Permiten enlazar series de numeración con un ejercicio contable específico (ej. 2026). Esto habilita reiniciar la numeración en 1 cada primero de enero sin que colisione con las facturas del año anterior.  
* Serie de Cancelación: Marcando la casilla Cancelación en una serie específica, el sistema destina esa serie exclusivamente a los documentos de anulación que se generan al cancelar facturas o entregas.

---

4. Numeración Automática de Datos Maestros (Clientes, Artículos y Recursos)  
* Por defecto, los datos maestros se crean con numeración manual libre.  
* Para activar la codificación automática:  
  * Se define una serie numérica con prefijo (ej. CLI- para clientes, PRV- para proveedores, ART- para artículos).  
  * Se define la Cantidad de Dígitos fija (ej. 5 dígitos). El sistema rellenará con ceros a la izquierda automáticamente (CLI-00001, CLI-00002).

---

LECCIÓN 8.4: SEGURIDAD, PERMISOS Y PROPIEDAD DE DATOS (DATA OWNERSHIP)

1. La Jerarquía de Seguridad en Tres Capas \[ CAPA 1: LICENCIA \]             (Define a qué módulos tiene derecho a entrar el usuario) │ ▼ \[ CAPA 2: AUTORIZACIONES GRALES\] (Define si puede Crear, Consultar o Modificar ventanas/menús) │ ▼ \[ CAPA 3: PROPIEDAD DE DATOS \]   (Define si puede ver o editar registros específicos creados por otros)

---

2. Los 3 Métodos de Gestión de Propiedad de Datos (Data Ownership) Configurable en Parametrizaciones generales \> ficha IC: MÉTODOS DE PROPIEDAD DE DATOS ┌────────────────────────────────────────────────────────────────────────┐ │ 1\. SOLO INTERLOCUTOR COMERCIAL:                                        │ │    El propietario se asigna en los datos maestros del cliente. Todos   │ │    los documentos que se creen para ese cliente heredan el propietario.│ │    Restringe la visibilidad del cliente en búsquedas, listas e informes│ ├────────────────────────────────────────────────────────────────────────┤ │ 2\. SOLO DOCUMENTO:                                                     │ │    Los datos maestros del cliente son visibles para todos. El acceso   │ │    se restringe documento por documento según el vendedor asignado.    │ ├────────────────────────────────────────────────────────────────────────┤ │ 3\. INTERLOCUTOR COMERCIAL Y DOCUMENTO (HÍBRIDO):                       │ │    Si el cliente tiene un propietario asignado en su ficha maestra,    │ │    opera bajo la regla 1\. Si no tiene propietario, opera bajo la 2\.    │ └────────────────────────────────────────────────────────────────────────┘

---

3. Matriz de Relaciones Organizacionales Basada en Empleados Para que la propiedad de datos funcione, los usuarios de SAP deben estar vinculados a un registro en el Módulo de Recursos Humanos (Datos Maestros de Empleado). A partir de su organigrama, el sistema evalúa los permisos:  
* Compañero (Peer): El usuario y el propietario del documento tienen el mismo Jefe directo.  
* Jefe (Manager): El propietario es el jefe directo del usuario.  
* Subordinado (Subordinate): El usuario es el jefe directo del propietario (visibilidad de gerencia hacia abajo).  
* Equipo (Team): Pertenecen al mismo equipo de trabajo funcional.  
* Departamento / Sucursal: Pertenecen a la misma unidad organizativa.  
* Empresa (Company): Acceso total global sin importar el propietario. ⚖️ Regla de Prevalencia en Permisos Solapados: Si un usuario recibe permisos por múltiples vías (p. ej., acceso Solo Lectura por Departamento pero Acceso Total por Subordinado), el sistema siempre aplica la autorización más generosa (Total). 👑 Superusuarios: Los usuarios administradores con rol Superusuario omiten todas las restricciones de propiedad de datos de forma nativa.

---

MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA Problema 1: "Al importar un archivo CSV en DTW arroja el error: 'Unexpected end of file' o los campos quedan corridos"

* Causa Raíz: Se guardó el archivo como delimitado por comas pero dentro de las descripciones o direcciones de los clientes existían comas de texto (ej. "Av. Amazonas, Edif. Centro, Piso 3"). DTW interpreta la coma del texto como un separador de columna.  
* Instrucción de Asesoría del Copiloto:  
  1. Abrir la plantilla en Excel y volver a guardarla seleccionando el formato Texto delimitado por tabulaciones (\*.txt) o delimitado por punto y coma.  
  2. Al ejecutar el Asistente de DTW, seleccionar el delimitador Tab Delimited.  
  3. Ejecutar la simulación para comprobar que las columnas coincidan con los campos de la DI-API. Problema 2: "Un usuario no puede abrir la ventana de Facturas de Clientes y el sistema dice 'No tiene autorización para la serie de numeración'"  
* Causa Raíz: El usuario tiene licencia y autorización general para facturación, pero la serie activa de facturas pertenece a un grupo de series (1 al 10\) al cual el usuario no tiene permisos otorgados.  
* Instrucción de Asesoría del Copiloto:  
  1. Ir a Gestión \> Inicialización sistema \> Numeración de documento, hacer doble clic en Facturas de clientes y constatar qué número de Grupo tiene asignada la serie (ej. Grupo 3).  
  2. Ir a Gestión \> Inicialización sistema \> Autorizaciones \> Autorizaciones generales.  
  3. Seleccionar al usuario o su grupo de usuarios, buscar Serie de numeración y asignar Autorización total al grupo correspondiente. Problema 3: "Un vendedor no puede ver las ofertas ni los pedidos creados por su compañero de equipo a pesar de tener autorización general total en ventas"  
* Causa Raíz: La empresa tiene activa la Propiedad de Datos (Data Ownership) y en la matriz de autorizaciones el usuario no tiene asignado permiso sobre la relación Compañero (Peer) o no comparten el mismo jefe en Recursos Humanos.  
* Instrucción de Asesoría del Copiloto:  
  1. Verificar en Datos maestros de empleado que ambos vendedores tengan seleccionado al mismo superior en el campo Jefe.  
  2. En Gestión \> Inicialización sistema \> Autorizaciones \> Propiedad de datos \> Autorizaciones de propiedad de datos, ubicar al vendedor y en la columna Compañero cambiar el permiso de Ninguno a Solo lectura o Total.

---

BANCO DE EVALUACIÓN SITUACIONAL Pregunta 1 (Estrategia de Cutover y Migración) Durante la migración de datos a un nuevo sistema SAP Business One con inventario permanente, la empresa necesita cargar las facturas de clientes que quedaron pendientes de cobro del sistema anterior sin alterar las existencias de mercancía física ni duplicar las cuentas de ingresos y costos en el libro mayor. ¿Cuál es el procedimiento técnico correcto en DTW?

* A) Importar las facturas de clientes como artículos inventariables y luego hacer un ajuste de inventario negativo.  
* B) Importar las facturas utilizando la plantilla de Facturas tipo Servicio (DocType \= 'dDocument\_Service') y asignarlas a una cuenta puente de saldos iniciales de balance. \[CORRECTA\]  
* C) Crear únicamente los cobros sin registrar las facturas.  
* D) Las facturas abiertas nunca se pueden migrar mediante DTW; deben digitarse manualmente en SAP. Explicación: Las facturas de tipo servicio permiten registrar la cuenta por cobrar del cliente contra una cuenta transitoria de saldos iniciales sin interactuar con los almacenes ni duplicar costos de venta en el estado financiero. Pregunta 2 (Administración de Seguridad) Una organización requiere que los gerentes comerciales puedan ver y editar los pedidos de venta de todos los vendedores que les reportan directamente, pero que ningún vendedor pueda ver las ventas de los demás integrantes del equipo. ¿Cómo debe configurarse la seguridad en SAP Business One?  
* A) Modificando las licencias profesionales de los vendedores a licencias limitadas de compras.  
* B) Habilitando la Propiedad de Datos por Documento, vinculando a los vendedores con su jefe en Datos Maestros de Empleado, y configurando la matriz de propiedad de datos con permiso Total para la relación "Subordinado" en el gerente y Ninguno en la relación "Compañero" para los vendedores. \[CORRECTA\]  
* C) Creando bases de datos separadas para cada vendedor.  
* D) Asignando la serie de numeración principal únicamente a los gerentes. Explicación: La relación jerárquica Subordinado otorga visibilidad a la línea de mando sobre las transacciones de sus dependientes, mientras que la relación Compañero en Ninguno aísla a los pares.

---

GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS) \[ { "scene": "01\_el\_arte\_de\_la\_migracion", "voicePrompt": "Metódico, técnico y tranquilizador", "text": "La migración de datos es el momento más delicado en la vida de un ERP. No se trata solo de copiar y pegar hojas de cálculo; se trata de preservar la historia de la empresa sin duplicar saldos contables. Con Data Transfer Workbench, cada cliente, cada inventario y cada factura histórica entran a SAP respetando las mismas reglas de validación que si las hubiera digitado un auditor experto.", "durationEstimate": "21s" }, { "scene": "02\_el\_orden\_de\_las\_series", "voicePrompt": "Claro, estructurado y normativo", "text": "En una empresa que crece, no todos los departamentos pueden compartir el mismo talonario de facturas. Las series de numeración en SAP permiten que cada sucursal o punto de venta trabaje con su propio rango ordenado sin riesgo de solapamientos. Y con los indicadores de período, tu contabilidad reinicia sus correlativos cada primero de enero de forma limpia y transparente.", "durationEstimate": "20s" }, { "scene": "03\_la\_privacidad\_inteligente", "voicePrompt": "Firme, ejecutivo y estratégico", "text": "¿Cómo proteges la información confidencial de tus clientes sin crear silos innecesarios? La Propiedad de Datos de SAP modela la estructura de tu organigrama real. Los gerentes supervisan a su equipo, los departamentos colaboran entre sí, pero las carteras comerciales se mantienen blindadas. La información correcta, en las manos correctas.", "durationEstimate": "19s" } \]

\================================================================================

﻿MÓDULO 09: SOPORTE TÉCNICO, HERRAMIENTAS DE DIAGNÓSTICO Y PLATAFORMA DE SOPORTE REMOTO (RSP) (SAP BUSINESS ONE 10.0 & ERP) Tipo de Contenido: Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA Fuentes Oficiales Analizadas: 10\_Support\_11\_SupportProcTool\_ES.pdf y notas técnicas de soporte de SAP (1167635, 1733065, 896891\) Nivel: Avanzado / Mesa de Ayuda de Nivel 1/2/3, Administración de Infraestructura y Mantenimiento Tiempo Estimado de Estudio: 65 minutos (dividido en 4 lecciones integradas)

---

ÍNDICE DEL MÓDULO

1. Lección 9.1: Modelo de Niveles de Soporte y Obligaciones Contractuales del Partner (N1, N2 y N3)  
2. Lección 9.2: Arquitectura y Operación de la Plataforma de Soporte Remoto (RSP)  
3. Lección 9.3: Herramientas Integradas de Diagnóstico: Logs, Trazas y Grabador de Incidentes  
4. Lección 9.4: Gestión de Incidentes en SAP Support Launchpad y Políticas de Mantenimiento  
5. Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA  
6. Banco de Evaluación Situacional  
7. Guiones Humanizados para Locución IA (ElevenLabs)

---

LECCIÓN 9.1: MODELO DE NIVELES DE SOPORTE Y OBLIGACIONES CONTRACTUALES DEL PARTNER (N1, N2 Y N3)

1. La Cadena de Responsabilidades de Soporte en el Ecosistema SAP El soporte técnico de SAP Business One se rige por un esquema de responsabilidades compartidas estipulado en la Política de Mantenimiento de SAP y la Nota SAP 1167635: \[ CLIENTE FINAL \] │ │ (Reporta incidente o duda operativa) ▼ \[ SOPORTE NIVEL 1 (N1) \- PARTNER \] ──\> Clasificación, búsqueda de Notas SAP y documentación │ │ (Si no existe solución conocida) ▼ \[ SOPORTE NIVEL 2 (N2) \- PARTNER \] ──\> Reproducción en laboratorio, aislamiento de Add-ons y BD │ │ (Confirmación de DEFECTO en software estándar SAP) ▼ \[ SOPORTE NIVEL 3 (N3) \- SAP \]     ──\> Diagnóstico de código fuente, hotfix y nueva Nota SAP Nivel de Soporte Responsable Alcance Técnico y Obligaciones Nivel 1 (N1) Partner / Consultor • Recepción del problema. • Verificación de vigencia del contrato de mantenimiento. • Búsqueda en el repositorio oficial de Notas SAP y portal de ayuda. • Documentación inicial de los pasos del usuario. Nivel 2 (N2) Partner / Especialista • Análisis y reproducción del error en una base de datos de pruebas (demo database) con el último nivel de parche (Patch Level). • Aislamiento del defecto: Desactivar add-ons de terceros, verificar que no existan modificaciones no permitidas en base de datos (Nota 896891). • Entrega de soluciones temporales (Workarounds) al cliente si es factible. • Preparación del ticket formal para SAP si se comprueba un fallo de producto. Nivel 3 (N3) SAP Product Support • Validación y análisis del código estándar de SAP Business One. • Solicitud de base de datos o conexión remota especializada. • Desarrollo de correcciones oficiales de software (Bugfixes / Parches) y publicación de Notas SAP.  
   ---

2. Política de Facturación de Incidentes (Incident Billing)  
* SAP exige que el Partner absorba íntegramente los niveles N1 y N2.  
* Penalización Financiera: Si un partner escala a N3 un caso que ya tenía una solución documentada en una Nota SAP existente, o si el problema se debe a falta de capacitación, datos corruptos por intervención directa no autorizada o fallas de un add-on externo, SAP facturará el costo de atención al Partner.  
* Franquicia Trimestral: SAP otorga una cortesía de hasta 5 incidentes gratuitos por trimestre; a partir del sexto incidente no justificado, se aplican los cargos a la tarifa contratada del partner.

---

LECCIÓN 9.2: ARQUITECTURA Y OPERACIÓN DE LA PLATAFORMA DE SOPORTE REMOTO (RSP)

1. ¿Qué es Remote Support Platform (RSP)? RSP es la plataforma proactiva cliente/servidor desarrollada por SAP para monitorear la salud de las bases de datos, prevenir fallos de infraestructura y distribuir tareas de mantenimiento automáticas. ┌───────────────────────────┐                ┌───────────────────────────┐ │       SOPORTE SAP         │                │     PARTNER DE SOPORTE    │ │ (Distribución de parches, │                │   (Monitoreo centralizado │ │  tareas de diagnóstico)   │                │    mediante RSP STUDIO)   │ └─────────────┬─────────────┘                └─────────────┬─────────────┘ │                                            │ └──────────────────────┬─────────────────────┘ │ (Canal seguro HTTPS / SSL) │ ▼ \[ SERVIDOR DEL CLIENTE FINAL \] ┌────────────────────────────┐ │      AGENTE RSP LOCAL      │ ├────────────────────────────┤ │ • Informe Estado (SSR)     │ │ • Tareas de Auto-reparación│ │ • Carga segura de BD a SAP │ │ • Habilita usuario soporte │ └────────────────────────────┘ ⚠️ Obligación Contractual: Según la Nota SAP 1733065, es obligatorio que el partner instale y active el agente RSP en cada servidor de cliente nuevo para mantener la garantía de soporte de SAP.

---

2. Componentes Fundamentales de RSP  
3. Agente RSP (RSP Agent): Servicio residente instalado en el servidor local de SAP Business One del cliente. Ejecuta tareas periódicas y recopila telemetría de rendimiento y hardware.  
4. RSP Studio: Consola avanzada utilizada por el Partner para monitorear el parque tecnológico de todos sus clientes desde una única vista consolidada y desplegar tareas personalizadas.  
5. Usuario Técnico (Technical Superuser): Credencial técnica única asignada por SAP (solicitada en el Support Launchpad) para establecer el canal seguro de comunicación y sincronización de tareas entre el cliente y los servidores de SAP.

---

3. El Informe de Estado del Sistema (SSR \- System Status Report)  
* Instantánea integral del entorno del cliente:  
  * Estado y fragmentación de la base de datos (SQL Server / SAP HANA).  
  * Espacio libre en disco y consumo de memoria RAM.  
  * Historial y estado de las copias de seguridad (Backups).  
  * Nivel de versión y parche de SAP Business One y add-ons instalados.  
* Frecuencia Recomendada: Debe programarse para ejecución y envío semanal automático a SAP y al partner.  
* Requisito de Escalación: Todo incidente reportado a SAP en N3 debe contar con un SSR actualizado en los últimos 7 días; de lo contrario, el ticket puede ser rechazado o penalizado.

---

4. El Usuario Predefinido de Soporte (support) SAP Business One incluye un usuario de sistema denominado support o soporte:  
* Propósito: Permite al consultor iniciar sesión en la base de datos del cliente para labores de diagnóstico sin consumir licencias adquiridas por el cliente.  
* Condición Bloqueante de Acceso: El sistema bloqueará el acceso con el usuario support si el agente RSP no está instalado o si no ha transmitido un informe SSR exitoso durante los últimos 7 días.  
* Todas las sesiones y transacciones efectuadas con este usuario quedan estrictamente registradas en el log de auditoría.

---

LECCIÓN 9.3: HERRAMIENTAS INTEGRADAS DE DIAGNÓSTICO: LOGS, TRAZAS Y GRABADOR DE INCIDENTES En el menú Ayuda \> Support Desk del cliente SAP Business One se encuentran tres utilitarios críticos para la resolución de anomalías: ┌──\> \[ 1\. Notificar un Problema \] (Grabador paso a paso tipo PSR) │ \[ AYUDA \> SUPPORT DESK \] ──────┼──\> \[ 2\. Support Launchpad / Notas \] (Buscador oficial de soluciones) │ └──\> \[ 3\. Parametrizaciones de Log \] (Configuración de niveles de traza)

---

1. Herramienta de Grabación de Incidentes (Problem Notification Tool)  
* Aplicación autónoma basada en la tecnología de grabación de pasos de usuario (Problem Steps Recorder \- PSR).  
* Funcionamiento: Registra secuencialmente cada clic del usuario acompañado de una captura de pantalla anotada y los metadatos de la ventana activa.  
* Ventaja Operativa: Funciona de forma independiente sin depender de la base de datos de SAP (incluso si el cliente se congela o cae).  
* El archivo empaquetado resultante se puede adjuntar a la llamada de servicio o transmitir al partner a través de RSP.

---

2. Gestión de Registros y Trazas Técnicas (Logging & Tracing) En Ayuda \> Support Desk \> Parametrizaciones de grabación en log:  
* Permite configurar el nivel de detalle (Verbosidad) con el que SAP registra eventos internos:  
  * Nivel Básico / Errores: Registra únicamente excepciones bloqueantes.  
  * Nivel Depuración (Debug / Trace): Registra cada interacción entre el cliente, la API y la base de datos.  
* Utilizado por solicitud expresa del soporte de Nivel 3 de SAP para atrapar errores intermitentes en la capa de comunicación cliente/servidor.

---

LECCIÓN 9.4: GESTIÓN DE INCIDENTES EN SAP SUPPORT LAUNCHPAD Y POLÍTICAS DE MANTENIMIENTO

1. El Portal de Soporte de SAP (SAP Support Launchpad / SAP for Me) La consola central para la gestión de servicios oficiales de soporte:  
* Para Clientes: Acceso para consultar Notas SAP y enviar tickets que viajan automáticamente a la bandeja de su Partner asignado (no van directo a SAP).  
* Para Partners: Consola para administrar las instalaciones de clientes, solicitar usuarios técnicos de RSP, pedir llaves de licencia de software y escalar incidentes validados a Nivel 3\.

---

2. Criterios de Clasificación de Prioridad de Incidentes La prioridad determina los tiempos de compromiso de atención según el impacto operativo en el cliente: \[ MUY ALTA (Very High) \] ──\> Sistema caído / Producción paralizada / Sin solución alternativa \[ ALTA (High) \]          ──\> Función crítica bloqueada pero el sistema opera de forma parcial \[ MEDIA (Medium) \]       ──\> Error en función estándar con impacto manejable o con workaround viable \[ BAJA (Low) \]           ──\> Consulta menor, inconveniente cosmético o duda de configuración

---

3. Protocolo para Escalar un Incidente Válido a SAP Antes de pulsar enviar en el Support Launchpad, el consultor debe verificar la siguiente lista de chequeo:  
4. ¿Se buscó en las Notas SAP por palabra clave y componente (SBO-)?  
5. ¿Se reprodujo el error en una base de datos de prueba con el último nivel de parche (Patch Level)?  
6. ¿Se desactivaron todos los add-ons externos para asegurar que el problema es del código nativo de SAP?  
7. ¿El cliente tiene el agente RSP activo y un informe SSR cargado en los últimos 7 días?  
8. ¿Se adjuntaron los pasos exactos para reproducir el fallo paso a paso junto con las capturas de pantalla?

---

MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA Problema 1: "El consultor intenta ingresar al sistema del cliente con el usuario de soporte ('support') y SAP arroja: 'Acceso denegado, RSP no actualizado'"

* Causa Raíz: El agente de Remote Support Platform (RSP) en el servidor del cliente está detenido, no tiene conexión a internet o hace más de 7 días no envía el informe de estado del sistema (SSR).  
* Instrucción de Asesoría del Copiloto:  
  1. Ingresar al servidor del cliente con un usuario de Windows con privilegios de administrador.  
  2. Abrir la consola del Agente RSP y verificar que el servicio esté en ejecución (Running).  
  3. Ejecutar manualmente la tarea Informe de estado del sistema (SSR) y forzar su carga inmediata hacia SAP.  
  4. Una vez confirmado el envío exitoso del reporte, iniciar sesión en el cliente de SAP Business One con el usuario support. Problema 2: "El partner recibió una factura de cobro por incidentes de soporte (Incident Billing) por parte de SAP"  
* Causa Raíz: El partner escaló incidentes a Soporte Nivel 3 de SAP que correspondían a problemas resueltos en Notas SAP públicas existentes, errores causados por add-ons de terceros o dudas de consultoría no cubiertas por mantenimiento.  
* Instrucción de Asesoría del Copiloto:  
  1. Revisar la Nota SAP asociada al cobro (usualmente la Nota 1167635 adjunta al ticket).  
  2. Implementar un filtro interno de calidad en Nivel 2 antes de escalar tickets: obligar a que todo caso sea probado en una base demo limpia en el último patch liberado.  
  3. Asegurar que ningún ticket se envíe a SAP sin adjuntar la Nota SAP de búsqueda previa y el archivo de descarte de add-ons. Problema 3: "Soporte de SAP solicita la base de datos del cliente para corregir una corrupción de datos pero no se permite enviarla por correo o FTP público"  
* Causa Raíz: Por normativas de seguridad y privacidad (GDPR / políticas SAP), las bases de datos solo pueden transferirse mediante canales cifrados autorizados.  
* Instrucción de Asesoría del Copiloto:  
  1. Solicitar al ingeniero de soporte de SAP que envíe la tarea de Carga de contenido (Content Upload Task) dirigida al número de sistema del cliente en RSP.  
  2. Abrir la consola de RSP en el servidor del cliente, ubicar la tarea aprobada por SAP con el número de ticket correspondiente.  
  3. Ejecutar el asistente de carga de contenido en RSP, seleccionar la copia de seguridad de la base de datos y transmitirla de forma directa y cifrada a los servidores de SAP.

---

BANCO DE EVALUACIÓN SITUACIONAL Pregunta 1 (Gobierno del Servicio de Soporte) Un cliente reporta un error al intentar crear una factura de reserva. El consultor de soporte del partner, sin realizar pruebas previas ni revisar la base de notas de SAP, abre de inmediato un incidente en el Support Launchpad solicitando ayuda a SAP. ¿Qué consecuencia puede tener esta acción según la política de mantenimiento de SAP Business One?

* A) SAP atenderá el caso de inmediato y enviará a un ingeniero a las oficinas del cliente.  
* B) SAP puede rechazar el ticket y facturar al partner el costo del incidente por incumplimiento de las obligaciones de soporte de Nivel 1 y Nivel 2 (Nota 1167635). \[CORRECTA\]  
* C) Se cancelará automáticamente la licencia del cliente.  
* D) El sistema bloqueará la facturación de la empresa por 30 días. Explicación: Los partners están obligados contractualmente a realizar la investigación N1 y reproducción N2; transferir incidencias básicas no analizadas activa la facturación por servicios no estándar. Pregunta 2 (Herramientas de Plataforma RSP) ¿Bajo qué condición técnica estricta permite SAP Business One el inicio de sesión del usuario predefinido de soporte ('support') sin consumir una licencia de usuario profesional?  
* A) Solo los días domingos y feriados.  
* B) Siempre que el servidor tenga más de 64 GB de memoria RAM.  
* C) Únicamente si la plataforma RSP está activa en el cliente y se ha enviado un Informe de Estado del Sistema (SSR) exitoso en los últimos 7 días. \[CORRECTA\]  
* D) Cuando todos los demás usuarios del sistema han cerrado su sesión. Explicación: El usuario support está condicionado a la supervisión activa de RSP y al reporte semanal del estado del sistema (SSR).

---

GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS) \[ { "scene": "01\_el\_pacto\_de\_soporte", "voicePrompt": "Firme, profesional y de liderazgo", "text": "Dar soporte en SAP Business One no es esperar a que algo falle para ver a quién culpar; es un estándar de ingeniería riguroso. Como partner certificado, tu misión en los niveles uno y dos es diagnosticar, aislar factores externos y comprobar soluciones conocidas. Solo cuando demuestras un fallo en el corazón del software, SAP entra en acción para respaldarte.", "durationEstimate": "21s" }, { "scene": "02\_el\_guardian\_rsp", "voicePrompt": "Tecnológico, seguro y analítico", "text": "Imagina tener un médico de cabecera monitoreando tus servidores las veinticuatro horas del día. Eso es exactamente la Plataforma de Soporte Remoto, o RSP. Evalúa tu base de datos, revisa tus respaldos y previene caídas antes de que ocurran. Si tu cliente tiene su RSP al día, su operación está blindada ante cualquier emergencia.", "durationEstimate": "20s" }, { "scene": "03\_la\_evidencia\_del\_incidente", "voicePrompt": "Didáctico, metódico y resolutivo", "text": "Un buen reporte técnico vale más que mil explicaciones verbales. Con el grabador de incidentes de SAP, cada clic y cada ventana del error quedan documentados en capturas precisas. Sin suposiciones y sin rodeos: la evidencia exacta para que tu equipo de soporte resuelva el caso en tiempo récord.", "durationEstimate": "19s" } \]

\================================================================================

﻿MÓDULO 10: CONTABILIDAD FINANCIERA, GESTIÓN BANCARIA Y ACTIVOS FIJOS (SAP BUSINESS ONE 10.0 & ERP) Tipo de Contenido: Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA Fuentes Oficiales Analizadas: 10\_AccBasics\_11\_Financial\_Basics\_ES.pdf, 10\_AccBasics\_12\_Automatic\_Journal\_Entries\_ES.pdf, 10\_BankProcess\_11\_Handling\_Payments\_ES.pdf, 10\_BankProcess\_12\_Payment\_Wizard\_ES.pdf, 10\_BankProcess\_21\_BankReconcile\_Overview\_ES.pdf, 10\_FixedAsset\_11\_Intro\_ES.pdf, 10\_FixedAsset\_21\_InitSettings.pdf y 10\_FixedAsset\_31\_32\_33\_Lifecycle.pdf Nivel: Avanzado / Dirección Financiera, Tesorería, Contabilidad General y Control de Activos Tiempo Estimado de Estudio: 75 minutos (dividido en 4 lecciones integradas)

---

ÍNDICE DEL MÓDULO

1. Lección 10.1: Arquitectura del Plan de Cuentas, Determinación Contable y Cuentas Asociadas  
2. Lección 10.2: Gestión de Tesorería: Medios de Pago y Cuentas Transitorias de Compensación  
3. Lección 10.3: El Asistente de Pagos Masivos y Reconciliación Bancaria Externa e Interna  
4. Lección 10.4: Submódulo de Activos Fijos: Capitalización, Depreciación y Retiro  
5. Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA  
6. Banco de Evaluación Situacional  
7. Guiones Humanizados para Locución IA (ElevenLabs)

---

LECCIÓN 10.1: ARQUITECTURA DEL PLAN DE CUENTAS, DETERMINACIÓN CONTABLE Y CUENTAS ASOCIADAS

1. Los Cajones del Plan de Cuentas (Chart of Accounts Drawers) SAP Business One organiza su contabilidad financiera mediante una estructura arbórea segmentada en hasta 10 niveles y dividida por Cajones (Drawers): \[ BALANCE GENERAL \]                      \[ ESTADO DE PÉRDIDAS Y GANANCIAS \] ├── 1\. Activo                            ├── 4\. Ingresos operacionales (Ventas) ├── 2\. Pasivo                            ├── 5\. Costo de Ventas └── 3\. Patrimonio / Capital y Reservas   ├── 6\. Gastos de Explotación (Operativos) ├── 7\. Gastos/Ingresos no operacionales └── 8\. Impuestos y Partidas Extraordinarias

---

2. Cuentas Asociadas (Control Accounts): El Vínculo con los Libros Auxiliares  
* Principio Fundamental: Los clientes y proveedores individuales no tienen cuentas contables propias en el Plan de Cuentas.  
* La Cuenta Asociada: Es una cuenta del libro mayor designada específicamente para acumular las deudas o créditos de un grupo de interlocutores comerciales (ej. Cuenta Asociada Clientes Locales, Cuenta Asociada Proveedores Extranjeros).  
* Regla Estricta del Sistema: Está prohibido contabilizar asientos manuales directos en una cuenta asociada. El sistema solo permite afectarla a través de documentos de ventas, compras o cobros/pagos vinculados a un Interlocutor Comercial. \[ Factura de Venta al Cliente C20000 por $112 \] │ ▼ ┌────────────────────┴────────────────────┐ │ ASIENTO CONTABLE AUTOMÁTICO:            │ │ • DEBE:  Cuenta Asociada Clientes  $112 │ (Subcuenta auxiliar C20000: $112) │ • HABER: Cuenta Impuesto IVA Venta   $12│ │ • HABER: Cuenta Ingresos por Ventas $100│ └─────────────────────────────────────────┘

---

3. Determinación de Cuentas de Mayor: Tradicional vs. Avanzada Configurable en Gestión \> Configuración \> Finanzas \> Determinación de cuentas de mayor:  
4. Determinación Tradicional:  
   * Asigna cuentas contables predeterminadas para ventas, compras e inventario a nivel de Datos Maestros de Artículo, Grupo de Artículos o Almacén.  
5. Determinación Avanzada de Cuentas de Mayor:  
   * Matriz flexible que evalúa múltiples criterios simultáneos antes de decidir la cuenta (ej. Si Almacén \= 01 Y Grupo \= Hardware Y Territorio \= Costa $\\rightarrow$ Contabilizar en Cuenta de Ingresos 410101).

---

LECCIÓN 10.2: GESTIÓN DE TESORERÍA: MEDIOS DE PAGO Y CUENTAS TRANSITORIAS DE COMPENSACIÓN MEDIOS DE PAGO DISPONIBLES EN SAP ┌────────────────────────────────────────────────────────────────────────┐ │ 1\. EFECTIVO:              Afecta caja chica o cuenta de compensación.   │ │ 2\. CHEQUES:               Registra cheques recibidos en cartera física. │ │ 3\. TARJETA DE CRÉDITO:    Registra vouchers por cobrar de operadoras.  │ │ 4\. TRANSFERENCIA:         Afecta DIRECTAMENTE la cuenta de Banco Propio.│ └────────────────────────────────────────────────────────────────────────┘

---

1. El Flujo en Dos Pasos y las Cuentas de Compensación (Clearing Accounts) Para medios de pago que no representan liquidez inmediata en la cuenta bancaria (cheques, efectivo en sucursales y vouchers de tarjetas de crédito), SAP utiliza un proceso en dos etapas: PASO 1: REGISTRO DEL COBRO (Recibo de Pago) • DEBE:  Cuenta de Compensación (Cheques en Cartera / Tarjeta por Cobrar) • HABER: Cuenta Asociada de Clientes (Se salda la factura del cliente)

PASO 2: DEPÓSITO BANCARIO (Boleta de Depósito) • DEBE:  Cuenta de Banco Propio (El dinero ingresa al saldo de la cuenta bancaria) • HABER: Cuenta de Compensación (Se cancela la cuenta transitoria temporal) 💡 Excepción: Los cobros o pagos efectuados por Transferencia Bancaria se registran en un solo paso, afectando directamente la cuenta del banco propio sin pasar por cuentas transitorias de compensación.

---

LECCIÓN 10.3: EL ASISTENTE DE PAGOS MASIVOS Y RECONCILIACIÓN BANCARIA EXTERNA E INTERNA

1. El Asistente de Pagos (Payment Wizard) Consola masiva para programar y dispersar cobros de clientes o pagos a proveedores en bloque mediante transferencias o emisión de cheques. \[ 1\. Parámetros Generales \]   ──\> Definir fecha de ejecución y seleccionar: Cobro o Pago │ ▼ \[ 2\. Filtro de Proveedores \]  ──\> Rango de códigos de proveedor, grupos o prioridades │ ▼ \[ 3\. Filtro de Documentos \]   ──\> Fechas de vencimiento, tolerancia y descuentos por pronto pago │ ▼ \[ 4\. Métodos de Pago \]        ──\> Cheque, Transferencia bancaria y Banco Propio emisor │ ▼ \[ 5\. Informe de Recomendación\]──\> Grilla interactiva: Selección, exclusión o ajuste de montos │ ▼ \[ 6\. Ejecución y Archivo \]    ──\> Generación de asientos automáticos \+ Archivo bancario de dispersión  
* Orden de Pago (Payment Order Run): Opción avanzada donde el asistente genera el archivo para enviar al banco pero no crea asientos contables de inmediato, dejando las facturas abiertas hasta recibir la confirmación de débito bancario.

---

2. Conciliación Bancaria: Reconciliación Externa vs. Interna TIPOS DE RECONCILIACIÓN ┌──────────────────────────────────────┬──────────────────────────────────────┐ │ RECONCILIACIÓN EXTERNA               │ RECONCILIACIÓN INTERNA               │ ├──────────────────────────────────────┼──────────────────────────────────────┤ │ • Cruza el libro mayor de Banco      │ • Cruza partidas del DEBE y HABER    │ │   Propio en SAP con el Extracto      │   dentro de la misma cuenta de mayor │ │   Bancario oficial del banco.        │   o ficha del cliente/proveedor.     │ │ • Garantiza que no existan depósitos │ • Empareja facturas con sus recibos  │ │   fantasma o cobros no registrados.  │   de cobro, notas de crédito o pagos.│ └──────────────────────────────────────┴──────────────────────────────────────┘

---

LECCIÓN 10.4: SUBMÓDULO DE ACTIVOS FIJOS: CAPITALIZACIÓN, DEPRECIACIÓN Y RETIRO ⚠️ Requisito Mandatorio: Se activa en Gestión \> Inicialización sistema \> Detalles sociedad \> Inicialización básica \> Habilitar activos fijos. Esta activación es irreversible.

---

1. El Cuarteto de Definición del Activo Fijo Todo activo fijo creado en SAP Business One se gobierna mediante 4 pilares: ┌────────────────────────────────────────────────────────────────────────┐ │ 1\. ÁREA DE DEPRECIACIÓN:      Define el estándar contable (GAAP/IFRS)   │ │                               o tributario (fiscal informativo).       │ │ 2\. DETERMINACIÓN DE CUENTAS:  Define las cuentas de balance del activo,│ │                               depreciación acumulada y gasto del período│ │ 3\. TIPO DE DEPRECIACIÓN:      Método matemático (Lineal, Degresivo,    │ │                               Especial) y vida útil en meses/días.     │ │ 4\. CLASE DE ACTIVO (*Class*): Estructura maestra que ensambla los 3    │ │                               parámetros anteriores en una plantilla.  │ └────────────────────────────────────────────────────────────────────────┘

---

2. El Ciclo de Vida Operativo del Activo Fijo \[ 1\. CAPITALIZACIÓN \]  ──\> Factura de Proveedores (A/P) o Capitalización Directa │              (Establece el Costo de Adquisición y Producción \- APC) ▼ \[ 2\. DEPRECIACIÓN \]    ──\> Ejecución de Depreciación Mensual (*Depreciation Run*) │              (Genera el asiento automático: Gasto vs. Depreciación Acumulada) ▼ \[ 3\. AJUSTES \]         ──\> Traslados entre clases, Depreciación manual o Revalorización │ ▼ \[ 4\. RETIRO / BAJA \]   ──\> Baja por Desguace (*Scrapping*) O Venta mediante Factura A/R  
* Fórmula de Depreciación Lineal (Straight Line): $$\\text{Depreciación Mensual} \= \\frac{\\text{Costo de Adquisición (APC)} \- \\text{Valor Residual}}{\\text{Vida Útil Total en Meses}}$$  
* Asiento Contable de la Corrida de Depreciación:  
  * DEBE: Cuenta de Gasto por Depreciación (Pérdidas y Ganancias).  
  * HABER: Cuenta de Depreciación Acumulada (Activo Complementario de Balance).  
* Retiro o Baja (Retirement):  
  * Por Venta: Al facturar el activo mediante una Factura de Clientes (A/R), el sistema calcula el Valor Neto en Libros (Net Book Value), cancela la depreciación acumulada, abona el costo histórico y registra la ganancia o pérdida patrimonial en venta de activos.  
  * Por Desguace (Scrapping): Se retira por deterioro u obsolescencia total sin cliente, enviando el valor residual íntegro a pérdidas del ejercicio.

---

MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA Problema 1: "El usuario intenta ingresar un asiento manual directamente contra la cuenta de Proveedores y SAP emite: 'La cuenta es una cuenta asociada'"

* Causa Raíz: El usuario intentó seleccionar una cuenta de mayor que está tildada como Cuenta asociada en el Plan de Cuentas.  
* Instrucción de Asesoría del Copiloto:  
  1. Explicar al usuario que las cuentas asociadas solo se afectan mediante documentos que tengan un código de Interlocutor Comercial (IC).  
  2. Si se trata de un ajuste directo de saldos, en el Asiento de Diario debe seleccionarse el código del Proveedor (en el campo de IC) y no la cuenta contable de mayor. El sistema actualizará el auxiliar del proveedor y la cuenta asociada automáticamente. Problema 2: "Al ejecutar el Asistente de Pagos no aparece una factura vencida que debería pagarse hoy"  
* Causa Raíz: La factura ya se encuentra seleccionada o reservada en otra ejecución de pago guardada en borrador, o la factura no tiene asignada una vía de pago válida.  
* Instrucción de Asesoría del Copiloto:  
  1. En el Asistente de Pagos, presionar el botón Transacciones no incluidas en el reporte de recomendación para auditar el motivo del descarte.  
  2. Verificar si existe una ejecución de pago anterior en estatus Guardado. Si existe, eliminar la ejecución borrador o concluirla para liberar las facturas bloqueadas.  
  3. Revisar en la factura que el método de pago especificado esté activo en la cuenta de banco propio. Problema 3: "La ejecución de depreciación de activos fijos no permite ejecutarse para el mes actual"  
* Causa Raíz: El período contable en SAP está bloqueado o cerrado, o no se ejecutó la depreciación del mes calendario inmediato anterior.  
* Instrucción de Asesoría del Copiloto:  
  1. Ir a Gestión \> Inicialización sistema \> Períodos contables y verificar que el mes a depreciar tenga estatus Activo.  
  2. En Finanzas \> Activos fijos \> Ejecución de depreciación, verificar que todos los meses previos del ejercicio fiscal hayan sido procesados en orden cronológico estricto.

---

BANCO DE EVALUACIÓN SITUACIONAL Pregunta 1 (Control Contable de Auxiliares) ¿Por qué motivo los saldos individuales de los clientes y proveedores no figuran directamente en las líneas del Balance General en SAP Business One?

* A) Porque el módulo de ventas no está integrado con la contabilidad.  
* B) Porque el Balance General refleja las Cuentas Asociadas que consolidan la totalidad de las cuentas por cobrar y por pagar de los libros auxiliares. \[CORRECTA\]  
* C) Porque los clientes solo se reflejan en el estado de pérdidas y ganancias.  
* D) Porque se requiere ejecutar un asiento de cierre mensual para que se hagan visibles. Explicación: Las cuentas asociadas consolidan la contabilidad auxiliar de los socios de negocio para mantener limpio y balanceado el balance general sin sobrecargar el plan de cuentas. Pregunta 2 (Gestión Patrimonial de Activos) Una empresa adquiere un vehículo de reparto por $12.000 con una vida útil de 60 meses. Al cabo de 24 meses, el vehículo se vende a un tercero por $8.000 mediante una Factura de Clientes. ¿Cómo determina SAP Business One el resultado de la operación?  
* A) Registra los $8.000 íntegros como ingreso operacional puro sin dar de baja el activo.  
* B) Calcula la depreciación acumulada de 24 meses ($4.800), determina el Valor Neto en Libros ($7.200) y genera automáticamente un documento de Retiro que da de baja el activo y reconoce una ganancia en venta de activos de $800. \[CORRECTA\]  
* C) El sistema no permite vender activos fijos; primero debe crearse un desguace.  
* D) Se debe crear un asiento manual antes de poder emitir la factura. Explicación: La Factura de Clientes para un activo fijo dispara automáticamente el documento de Retiro, cancelando el costo histórico, saldando la depreciación acumulada y calculando la utilidad o pérdida contable frente al precio de venta pactado.

---

GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS) \[ { "scene": "01\_el\_corazon\_financiero", "voicePrompt": "Claro, analítico y confiable", "text": "La contabilidad en un ERP no es un registro frío al final del día; es el reflejo vivo de cada movimiento en tu empresa. Cada factura que emites, cada material que entra y cada cobro que recibes alimentan automáticamente el libro mayor. Las cuentas asociadas conectan tus clientes con tu balance en tiempo real, con precisión matemática.", "durationEstimate": "20s" }, { "scene": "02\_el\_ritmo\_de\_la\_tesoreria", "voicePrompt": "Ágil, resolutivo y profesional", "text": "Gestionar el flujo de caja sin herramientas automatizadas es agotador. Con el Asistente de Pagos de SAP, dispersar cientos de transferencias a proveedores toma solo un par de clics. Y al conciliar tus extractos con las cuentas transitorias de compensación, cada centavo en el banco queda plenamente justificado.", "durationEstimate": "19s" }, { "scene": "03\_el\_valor\_del\_patrimonio", "voicePrompt": "Estratégico, maduro y ejecutivo", "text": "Las máquinas de tu fábrica y los vehículos de tu flota representan el músculo operativo de tu compañía. Con el módulo de Activos Fijos, controlas su depreciación mes a mes bajo normas IFRS y conoces su valor real en libros en cualquier momento. Un patrimonio transparente es la base para tomar grandes decisiones de inversión.", "durationEstimate": "21s" } \]

\================================================================================

﻿MÓDULO 11: PERSONALIZACIÓN AVANZADA, AUTOMATIZACIONES Y ANALÍTICA EN TIEMPO REAL (SAP BUSINESS ONE 10.0 & ERP) Tipo de Contenido: Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA Fuentes Oficiales Analizadas: 10\_Impl\_11\_CustomTools\_Queries\_ES.pdf, 10\_Impl\_13\_CustomTools\_ApprovalProcesses\_ES.pdf, 10\_Impl\_14\_CustomTools\_UserDefinedFields\_ES.pdf, 10\_Impl\_15\_CustomTools\_UserDefinedValues\_ES.pdf y 10\_Impl\_17\_CustomTools\_IntroAnalytics\_ES.pdf Nivel: Avanzado / Consultoría de Desarrollo, Automatización de Procesos (FMS/BPM) y Business Intelligence Tiempo Estimado de Estudio: 70 minutos (dividido en 4 lecciones integradas)

---

ÍNDICE DEL MÓDULO

1. Lección 11.1: Extensiones de Datos: Campos de Usuario (UDF), Tablas (UDT) y Objetos (UDO)  
2. Lección 11.2: Automatización de Formularios: Búsquedas Formateadas (FMS) y Valores Definidos por el Usuario  
3. Lección 11.3: Gobernanza y Workflows: Procedimientos de Autorización Estándar y por Consulta  
4. Lección 11.4: Inteligencia de Negocios y Analítica HANA: Capa Semántica, KPIs y Dashboards  
5. Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA  
6. Banco de Evaluación Situacional  
7. Guiones Humanizados para Locución IA (ElevenLabs)

---

LECCIÓN 11.1: EXTENSIONES DE DATOS: CAMPOS DE USUARIO (UDF), TABLAS (UDT) Y OBJETOS (UDO)

1. Campos Definidos por el Usuario (UDF \- User-Defined Fields) Permiten extender la base de datos estándar de SAP Business One sin alterar el código fuente ni perder soporte:  
* Configurable en Herramientas \> Herramientas de customizing \> Campos definidos por el usuario \- Gestión.  
* Nivel de Cabecera: Se almacenan en la tabla del objeto (ej. OCRD, OINV) con el prefijo obligatorio U\_ (ej. U\_EstadoCliente). Se visualizan en el panel lateral presionando Ctrl \+ Shift \+ U o integrándolos visualmente en la ventana mediante el Diseñador de interfaz de usuario.  
* Nivel de Línea: Se añaden a las tablas de detalle (ej. RDR1, INV1). Aparecen como nuevas columnas en la matriz de artículos del documento.  
* Tipos de Datos y Validación: Alfanumérico, Numérico, Fecha/Hora, Importe monetario o Estructura con Lista de Valores válidos (desplegables predefinidos) y valores por defecto. ESTRUCTURA DE EXTENSIBILIDAD EN SAP BUSINESS ONE ┌────────────────────────────────────────────────────────────────────────┐ │ 1\. UDF (Campos):   Columnas adicionales en tablas estándar (Prefijo U\_)│ │ 2\. UDT (Tablas):   Tablas personalizadas independientes (Prefijo @)    │ │ 3\. UDO (Objetos):  Lógica de negocio completa que encapsula UDFs y     │ │                    UDTs con servicios de DI-API nativos.               │ └────────────────────────────────────────────────────────────────────────┘

---

LECCIÓN 11.2: AUTOMATIZACIÓN DE FORMULARIOS: BÚSQUEDAS FORMATEADAS (FMS) Y VALORES DEFINIDOS POR EL USUARIO

1. ¿Qué es una Búsqueda Formateada (FMS / UDV)? Un Valor Definido por el Usuario (User-Defined Value) es una regla que autocompleta o valida un campo mediante una consulta SQL/HANA o una lista de valores estática. \[ EL USUARIO MODIFICA UN CAMPO DISPARADOR \] (Ej. Selecciona el código del Cliente C20000) │ ▼ \[ SE ACTIVA LA BÚSQUEDA FORMATEADA (FMS) \]  (Ejecución de consulta en segundo plano) │ ▼ \[ AUTOCOMPLETA EL CAMPO DESTINO \]           (Ej. Llena el campo "Límite de Crédito Disponible")

---

2. Configuración Operativa de la FMS  
3. Ubicarse en el campo de destino y presionar la combinación de teclas Alt \+ Shift \+ F2 (o vía menú Herramientas \> Herramientas de customizing \> Valores definidos por usuario).  
4. Seleccionar la opción Buscar en valores definidos por el usuario según consulta grabada.  
5. Mecanismo de Disparo (Trigger):  
   * Manual: El usuario presiona la lupa que aparece en el campo (Shift \+ F2).  
   * Automático: Se marca Visualización de valores definidos por el usuario cuando se modifica el campo, seleccionando el campo disparador (ej. Al modificar el Código de Artículo, calcular la comisión del vendedor).

---

LECCIÓN 11.3: GOBERNANZA Y WORKFLOWS: PROCEDIMIENTOS DE AUTORIZACIÓN ESTÁNDAR Y POR CONSULTA

1. El Ciclo de Vida del Procedimiento de Autorización (Approval Process) \[ 1\. Creador intenta AÑADIR documento \] ──\> Cumple condición de bloqueo (Ej. Descuento \> 15%) │ ▼ \[ 2\. Estado: BORRADOR PENDIENTE \]      ──\> Se bloquea la creación formal en el libro mayor │ ▼ \[ 3\. Notificación a los Autorizadores \] ──\> Mensaje emergente o alerta en SAP / App Móvil │ ├──────\[ APROBADO \]──────┐ │                        │ ▼                        ▼ \[ 4\. Notificación al Creador \]         \[ 5\. El Creador abre el Borrador y lo AÑADE a SAP \] │ └──────\[ RECHAZADO \]─────\> El Creador ajusta el documento o se cancela

---

2. Condiciones Estándar vs. Condiciones por Consulta Personalizada En Gestión \> Inicialización sistema \> Procedimientos de autorización \> Modelos de autorización:  
3. Condiciones Predefinidas: Se activan mediante casillas de verificación (ej. Siempre, Desviación del límite de crédito, Margen bruto inferior a X%, Descuento mayor a X%, Total del documento superior a X monto).  
4. Condiciones Basadas en Consultas de Usuario (Approval by Query):  
   * Para reglas complejas (ej. Si el cliente es extranjero Y el plazo de pago supera 60 días Y el artículo es de la familia de Servidores).  
   * Regla Estricta de Sintaxis en la Consulta: Debe retornar TRUE (o valor diferente de cero) para disparar el bloqueo de aprobación. Utiliza la sintaxis de variables activas de formulario en SAP: SELECT DISTINCT 'TRUE' FROM OCRD T0 WHERE T0."CardCode" \= $\[$4.1.0\] AND T0."Balance" \> 50000;

---

LECCIÓN 11.4: INTELIGENCIA DE NEGOCIOS Y ANALÍTICA HANA: CAPA SEMÁNTICA, KPIS Y DASHBOARDS En SAP Business One versión para SAP HANA, la analítica opera sobre la memoria RAM del servidor mediante la Capa Semántica (Semantic Layer): \[ TABLAS FÍSICAS DE LA BASE DE DATOS \] (ORDR, OCRD, OITM, INV1 \- Millones de registros) │ ▼ \[ VISTAS DE CÁLCULO DE CAPA SEMÁNTICA \] (Modelos que unifican Ventas, Compras y Finanzas) │ ├──\> \[ MEDIDAS \]    (Valores cuantitativos: Importes, Ganancia Bruta, Cantidades) └──\> \[ DIMENSIONES \](Valores cualitativos: Cliente, Vendedor, Familia, Mes) │ ▼ \[ PERVASIVE ANALYTICS DESIGNER \] ───\> Dashboards Interactivos, Gráficos de Barras y KPIs │ ▼ \[ PANELES EN EL COCKPIT FIORI \]   ───\> Visualización ejecutiva en tiempo real con 1 clic

---

1. Diseñador de KPIs y Paneles Interactivos (Pervasive Analytics)  
* Permite a los usuarios y consultores diseñar tarjetas de métricas sin escribir código complejo:  
  * KPIs: Métricas numéricas de impacto (ej. Ventas del Mes vs. Meta, Cuentas Vencidas a más de 90 días). Incluye códigos de color de semáforo (Verde, Amarillo, Rojo).  
  * Dashboards: Gráficos de barras, líneas de tendencia, mapas de calor y gráficos de dispersión.  
* Acciones en Paneles (Dashboard Actions): Permite hacer clic en una barra del gráfico para abrir una ventana de SAP con el registro filtrado (ej. clic en el cliente "Maxi Teq" $\\rightarrow$ abre los Datos Maestros de Maxi Teq).  
* Barras Laterales Analíticas en Documentos: Al abrir una Oferta o Pedido de Ventas, el panel lateral muestra en tiempo real las tendencias de compra de ese cliente específico.

---

MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA Problema 1: "Una Búsqueda Formateada (FMS) arroja el error: 'Internal error (-1004)' o no actualiza el valor automáticamente"

* Causa Raíz: La sintaxis de variables de pantalla $\[Tabla.Campo\] o $\[$Item.Columna.0\] hace referencia a un campo que no está visible o su valor está vacío al momento de la ejecución.  
* Instrucción de Asesoría del Copiloto:  
  1. Activar la opción Ver \> Información del sistema (Ctrl \+ Shift \+ I) y pasar el cursor sobre el campo disparador para verificar su ID de ítem y columna exactos.  
  2. Asegurar que la consulta maneje valores nulos mediante funciones de escape (COALESCE en SQL Server o IFNULL en SAP HANA).  
  3. Comprobar que en la configuración de la FMS esté seleccionada la casilla Visualización automática cuando se modifica el campo. Problema 2: "El usuario crea un pedido de cliente y el documento se añade directamente sin solicitar la autorización requerida"  
* Causa Raíz: El usuario creador no está incluido en la lista de Autores del Modelo de Autorización, el autorizador asignado no tiene estatus Activo, o la condición de la consulta retorna nulo.  
* Instrucción de Asesoría del Copiloto:  
  1. Abrir Gestión \> Inicialización sistema \> Procedimientos de autorización \> Modelos de autorización.  
  2. Verificar que en la pestaña Autores esté asignado el usuario específico o su grupo.  
  3. En la pestaña Documentos, confirmar que el documento Pedido de cliente esté marcado.  
  4. Verificar en Parametrizaciones generales \> ficha Servicios que la casilla Activar procedimiento de autorización esté tildada para la empresa.

---

BANCO DE EVALUACIÓN SITUACIONAL Pregunta 1 (Automatización de Procesos) Una empresa necesita que al emitir una Factura de Clientes, el vendedor visualice de inmediato en un campo libre el margen de ganancia calculado en tiempo real sin salir del documento. ¿Cuál es el mecanismo nativo más eficiente en SAP Business One?

* A) Desarrollar un Add-on externo en lenguaje C\#.  
* B) Crear un Campo Definido por el Usuario (UDF) y asociarle una Búsqueda Formateada (FMS) configurada con una consulta de usuario que se dispare automáticamente al cambiar el artículo o la cantidad. \[CORRECTA\]  
* C) Modificar la base de datos directamente mediante un trigger SQL.  
* D) Exportar la factura a Excel antes de imprimirla. Explicación: La combinación de UDF con Búsquedas Formateadas (FMS) es la vía nativa y soportada por SAP para automatizar cálculos interactivos en pantalla sin requerir programación externa. Pregunta 2 (Analítica y Business Intelligence) En SAP Business One versión para SAP HANA, ¿cuál es la diferencia fundamental entre una Dimensión y una Medida en el diseñador de Pervasive Analytics?  
* A) Las dimensiones son numéricas y las medidas son de texto.  
* B) Las medidas son campos numéricos cuantitativos que se pueden sumar o promediar (importes, cantidades, utilidades), mientras que las dimensiones son atributos cualitativos que permiten segmentar o agrupar los datos (clientes, fechas, regiones). \[CORRECTA\]  
* C) No existe diferencia; son términos equivalentes.  
* D) Las medidas solo se pueden utilizar en Crystal Reports. Explicación: En la arquitectura analítica OLAP de SAP HANA, las medidas representan los hechos cuantificables y las dimensiones constituyen los ejes de análisis y agregación.

---

GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS) \[ { "scene": "01\_el\_poder\_de\_adaptar", "voicePrompt": "Inspirador, técnico y visionario", "text": "Un gran ERP no obliga a tu empresa a cambiar su forma de trabajar; se adapta a ella con elegancia. Con los campos de usuario y las tablas personalizadas, expandes SAP Business One para registrar exactamente lo que tu negocio necesita, manteniendo la estabilidad y la integridad oficial del fabricante intactas.", "durationEstimate": "20s" }, { "scene": "02\_el\_inteligencia\_en\_pantalla", "voicePrompt": "Dinámico, resolutivo y ágil", "text": "¿Por qué obligar a tus vendedores a hacer cálculos en una libreta cuando el sistema puede hacerlos en un parpadeo? Las búsquedas formateadas son pequeños cerebros automáticos en tus formularios. Cambias una cantidad y el sistema calcula comisiones, valida márgenes y completa datos en tiempo real.", "durationEstimate": "19s" }, { "scene": "03\_la\_claridad\_de\_hana", "voicePrompt": "Ejecutivo, analítico y de liderazgo", "text": "Esperar horas a que termine un reporte financiero pertenece al pasado. Con la potencia en memoria de SAP HANA y Pervasive Analytics, tus datos transaccionales se transforman en dashboards ejecutivos al instante. Tomas el pulso de tus ventas, tu inventario y tu rentabilidad desde tu propio cockpit interactivo.", "durationEstimate": "21s" } \]

\================================================================================

﻿MÓDULO 12: METODOLOGÍA DE IMPLEMENTACIÓN (AIP), PARAMETRIZACIONES IRREVERSIBLES Y QUICK COPY (SAP BUSINESS ONE 10.0 & ERP) Tipo de Contenido: Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA Fuentes Oficiales Analizadas: 10\_Impl\_21\_ImplTools\_ImplementationMethodology\_ES.pdf, 10\_Impl\_23\_ImplTools\_Key\_Settings\_ES.pdf y 10\_Impl\_26\_ImplTools\_QuickCopy.pdf Nivel: Avanzado / Dirección de Proyectos de TI, Consultoría de Preventa, Cutover y Migración de Configuraciones Tiempo Estimado de Estudio: 65 minutos (dividido en 4 lecciones integradas)

---

ÍNDICE DEL MÓDULO

1. Lección 12.1: Las 5 Fases de la Metodología de Implementación Acelerada (AIP)  
2. Lección 12.2: Parametrizaciones Clave e Irreversibles del Sistema (Decisiones Críticas de Arranque)  
3. Lección 12.3: La Herramienta Quick Copy: Migración de Configuraciones entre Empresas (\*.qdf)  
4. Lección 12.4: Gestión de Ambientes (Demo, Test, Training y Producción) y Plan de Cutover  
5. Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA  
6. Banco de Evaluación Situacional  
7. Guiones Humanizados para Locución IA (ElevenLabs)

---

LECCIÓN 12.1: LAS 5 FASES DE LA METODOLOGÍA DE IMPLEMENTACIÓN ACELERADA (AIP) La metodología oficial de SAP para proyectos de SAP Business One (Accelerated Implementation Program \- AIP) estructura la transición desde la preventa hasta la estabilidad operativa: \[ FASE 1: PREPARACIÓN \] ──\> Acta de constitución, kick-off, infraestructura y plan de trabajo │ ▼ \[ FASE 2: BLUEPRINT \]   ──\> Levantamiento de procesos (As-Is vs. To-Be) y diseño conceptual │ ▼ \[ FASE 3: REALIZACIÓN \] ──\> Parametrización en ambiente TEST, layouts, perfiles y cargas piloto │ ▼ \[ FASE 4: PREP. FINAL \] ──\> Capacitación a usuarios finales, pruebas UAT, congelamiento y CUTOVER │ ▼ \[ FASE 5: GO-LIVE \]     ──\> Salida en vivo oficial, soporte post-arranque y pase a mantenimiento Fase AIP Entregables Principales Hito de Cierre (Milestone) 1\. Preparación del Proyecto Plan de proyecto detallado, asignación de comités de liderazgo y entorno de pruebas listo. Reunión de Kick-Off formal aprobada. 2\. Business Blueprint Documento conceptual de diseño con el alcance contractual, matriz de requerimientos y gap analysis. Firma de aceptación del Blueprint por la gerencia del cliente. 3\. Realización Base de datos configurada en ambiente de pruebas, reportes Crystal diseñados, búsquedas FMS y perfiles de autorización. Aprobación de la configuración por los líderes de área (Key Users). 4\. Preparación Final Pruebas integrales de aceptación de usuario (UAT), capacitación operativa, simulacros y migración final de datos (Cutover). Autorización ejecutiva para el paso a producción (Go / No-Go Decision). 5\. Go-Live y Soporte Monitoreo en vivo en el primer cierre contable, estabilización de incidencias y entrega formal al equipo de soporte. Acta de cierre de proyecto y pase al área de soporte técnico. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

LECCIÓN 12.2: PARAMETRIZACIONES CLAVE E IRREVERSIBLES DEL SISTEMA (DECISIONES CRÍTICAS DE ARRANQUE) Al crear la base de datos de producción, existen parametrizaciones estructurales que, una vez asentada la primera transacción contable o de inventario, se bloquean permanentemente y no pueden modificarse jamás: MATRIZ DE PARAMETRIZACIONES IRREVERSIBLES ┌────────────────────────────────────────────────────────────────────────┐ │ 1\. MONEDA LOCAL Y DEL SISTEMA:        No se pueden cambiar tras crear  │ │    (Detalles Sociedad)                el primer asiento contable.      │ │ 2\. UTILIZAR INVENTARIO PERMANENTE:    No se puede desactivar una vez   │ │    (Detalles Sociedad)                registrado el primer movimiento. │ │ 3\. GESTIONAR COSTES POR ALMACÉN:      Fija si el costo es único de     │ │    (Detalles Sociedad)                empresa o por bodega.            │ │ 4\. HABILITAR ACTIVOS FIJOS:           Una vez activado, la casilla se  │ │    (Detalles Sociedad)                bloquea de forma definitiva.     │ │ 5\. PERMITIR \>1 TIPO DOCUMENTO X SERIE:Permite compartir series fiscales│ │    (Detalles Sociedad)                entre múltiples comprobantes.    │ │ 6\. PROGRAMACIÓN MÚLTIPLE EN SERVICIO: Transforma la interfaz de visitas│ │    (Parametrizaciones de Documento)   técnicas a grilla permanentemente│ └────────────────────────────────────────────────────────────────────────┘ ⚠️ Regla de Consultoría: Estas definiciones deben firmarse en acta conjunta con el Contador General y el Director Financiero del cliente antes de cargar la primera línea en la base de datos de producción.

---

LECCIÓN 12.3: LA HERRAMIENTA QUICK COPY: MIGRACIÓN DE CONFIGURACIONES ENTRE EMPRESAS (\*.QDF)

1. ¿Qué es Quick Copy? Ubicada en Gestión \> Inicialización sistema \> Centro de implementación \> Tareas de implementación \> Gestión de datos \> Copiar datos entre empresas:  
* Permite transferir parametrizaciones, tablas de configuración, planes de cuentas, reportes y datos maestros entre bases de datos de SAP Business One sin tener que reconfigurar manualmente desde cero. COPIA DIRECTA                                 COPIA INDIRECTA ┌────────────────────────┐                   ┌────────────────────────┐ │ Empresa Origen         │                   │ Empresa Origen         │ │ (Ambiente Configurado) │                   │ (Ambiente Configurado) │ └───────────┬────────────┘                   └───────────┬────────────┘ │                                            │ │ (Mismo servidor y versión)                 ▼ (Exporta archivo) │                                    \[ ARCHIVO \*.QDF \] │                                            │ ▼                                            ▼ (Importa archivo) ┌────────────────────────┐                   ┌────────────────────────┐ │ Empresa Destino        │                   │ Empresa Destino        │ │ (Base Limpia / Nueva)  │                   │ (En otro servidor/nube)│ └────────────────────────┘                   └────────────────────────┘

---

2. Métodos de Copia y Manejo de Conflictos Al ejecutar Quick Copy se seleccionan los criterios de sustitución:  
3. Añadir nuevos registros y actualizar existentes: Inserta los códigos faltantes y sobreescribe los existentes si hubo cambios.  
4. Añadir nuevos registros sin actualizar existentes: Preserva las definiciones locales de la base de destino.  
5. Manejo de Errores:  
   * Detener copia en el primer error.  
   * Ignorar errores y copiar registros válidos.  
* Archivos de Proyecto (\*.xml): Permiten guardar la selección de categorías para reutilizar la misma plantilla de copia en futuros despliegues sin repetir la selección manual.

---

LECCIÓN 12.4: GESTIÓN DE AMBIENTES (DEMO, TEST, TRAINING Y PRODUCCIÓN) Y PLAN DE CUTOVER

1. El Paisaje de Bases de Datos en una Implementación Exitosa ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐ │ BASE DEMO            │   │ BASE TEST            │   │ BASE TRAINING        │ │ (Datos de prueba SAP)│   │ (Configuración real  │   │ (Copia de Test para  │ │ Para explorar flujos │   │  para validar UAT)   │   │  capacitar usuarios) │ └──────────────────────┘   └──────────┬───────────┘   └──────────────────────┘ │ │ (Quick Copy de parametrizaciones) ▼ ┌──────────────────────┐ │ BASE DE PRODUCCIÓN   │ │ (Operación real      │ │  limpia para Cutover)│ └──────────────────────┘

---

2. El Cronograma de Cutover (Paso a Producción) Secuencia cronológica estricta para el fin de semana previo al Go-Live:  
3. Día \-3: Congelamiento de transacciones en el sistema legado (Legacy Freeze).  
4. Día \-2: Extracción y depuración final de datos maestros y saldos contables/inventario en plantillas DTW.  
5. Día \-1:  
   * Creación de la base de datos de producción limpia en SAP Business One.  
   * Ejecución de Quick Copy desde la base TEST para transferir el 100% de la parametrización validada.  
   * Carga con DTW de: Catálogo de Cuentas $\\rightarrow$ Interlocutores Comerciales $\\rightarrow$ Artículos $\\rightarrow$ Listas de Materiales BOM.  
   * Carga con DTW de: Saldos iniciales de Inventario (Entradas de mercancías) $\\rightarrow$ Saldos de Clientes/Proveedores (Facturas tipo Servicio) $\\rightarrow$ Asientos de apertura de balance general.  
6. Día 0 (Lunes de Go-Live): Apertura de accesos a los usuarios con perfiles asignados y soporte presencial de piso (Floor Support).

---

MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA Problema 1: "Quick Copy falla con error de dependencias al intentar copiar la Determinación de Cuentas de Mayor"

* Causa Raíz: Se intentó copiar la determinación de cuentas sin haber copiado previamente el Plan de Cuentas, las Cuentas de Impuestos o los Códigos de Monedas en la base de datos de destino.  
* Instrucción de Asesoría del Copiloto:  
  1. En el árbol de selección de Quick Copy, marcar la categoría padre Finanzas completa (incluyendo Plan de Cuentas y Definiciones de Impuestos).  
  2. Asegurar que en las opciones de copia esté tildada la casilla Copiar objetos dependientes automáticamente. Problema 2: "El cliente solicita desactivar el inventario permanente después de 2 meses de operación en vivo"  
* Causa Raíz: La parametrización de Inventario Permanente es irreversible una vez que se han asentado movimientos contables de stock.  
* Instrucción de Asesoría del Copiloto:  
  1. Explicar formalmente al cliente que SAP Business One bloquea esa modificación a nivel de motor de base de datos para preservar la integridad de la auditoría contable.  
  2. Si la empresa necesita operar sin inventario permanente, la única vía técnica soportada es crear una nueva base de datos limpia y volver a migrar saldos iniciales (con el costo y tiempo de un nuevo Cutover).

---

BANCO DE EVALUACIÓN SITUACIONAL Pregunta 1 (Gobernanza de Proyectos) En la metodología de implementación AIP de SAP, ¿en qué fase se deben congelar las transacciones del sistema legado para extraer los saldos de clientes, proveedores e inventario y cargarlos en la base de producción?

* A) Fase 1: Preparación del proyecto.  
* B) Fase 2: Business Blueprint.  
* C) Fase 4: Preparación Final (Cutover). \[CORRECTA\]  
* D) Fase 5: Go-Live y Soporte post-arranque. Explicación: La Fase 4 concentra todas las tareas de preparación final, pruebas UAT, capacitación y la ejecución del plan de Cutover para dejar la base de producción lista para el encendido del sistema. Pregunta 2 (Herramientas de Configuración) Un consultor desea replicar los formatos de impresión en Crystal Reports, las búsquedas formateadas y las definiciones de usuarios desde la base de pruebas a una nueva sucursal. ¿Cuál es la herramienta idónea dentro de SAP Business One?  
* A) Data Transfer Workbench (DTW).  
* B) Quick Copy (Copia de datos entre empresas). \[CORRECTA\]  
* C) SBO Mailer.  
* D) Microsoft Excel Import básico. Explicación: Quick Copy es la herramienta nativa diseñada específicamente para copiar parametrizaciones, personalizaciones, layouts y definiciones entre bases de datos de SAP Business One.

---

GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS) \[ { "scene": "01\_el\_arte\_de\_implementar", "voicePrompt": "Metódico, inspirador y de liderazgo", "text": "Instalar un software lo hace cualquiera; transformar la operación de una compañía requiere una metodología impecable. Con el programa de implementación acelerada de SAP, cada fase tiene un propósito claro. Desde el primer levantamiento de procesos hasta el corte final de datos, cada paso está diseñado para garantizar que tu empresa despegue con seguridad y sin sobresaltos.", "durationEstimate": "22s" }, { "scene": "02\_las\_decisiones\_irreversibles", "voicePrompt": "Firme, reflexivo y preventivo", "text": "En el arranque de un ERP hay decisiones que no tienen marcha atrás. Activar el inventario permanente o definir cómo se gestionará el costo por bodega son elecciones estructurales que acompañarán a tu empresa durante años. Por eso, en SAP, las decisiones críticas se firman con visión de futuro y rigor financiero.", "durationEstimate": "21s" }, { "scene": "03\_la\_magia\_de\_quick\_copy", "voicePrompt": "Dinámico, tecnológico y ágil", "text": "¿Por qué volver a configurar cientos de pantallas cuando ya lo hiciste a la perfección en tu entorno de pruebas? Con Quick Copy empaquetas tus reportes, tus permisos y tus reglas de negocio en un solo archivo y los trasladas a producción en minutos. Eficiencia, consistencia y cero margen de error.", "durationEstimate": "20s" } \]