# MÓDULO 01: FUNDAMENTOS, NAVEGACIÓN Y ENTORNO FIORI (SAP BUSINESS ONE 10.0 & ERP)

**Tipo de Contenido:** Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA  
**Fuentes Oficiales Analizadas:** 10_Intro_11_Overview_IntroSAPB1_ES.pdf, 10_Intro_12_Overview_GettingStarted_ES.pdf y CSL01_Introduction_Solution_ES.pdf  
**Nivel:** Inicial / Consultoría y Operación Básica  
**Tiempo Estimado de Estudio:** 45 minutos (dividido en 3 lecciones integradas)

---

## Resumen Ejecutivo
Este módulo establece las bases operativas y conceptuales de SAP Business One 10.0. Los usuarios aprenderán no solo a interactuar con el entorno Cockpit Fiori, sino a comprender la lógica empresarial subyacente que unifica datos de distintas áreas en una base de datos centralizada. Abordaremos la arquitectura del sistema, técnicas avanzadas de navegación, el flujo del proceso comercial y estrategias de resolución de problemas. El objetivo es convertir a los colaboradores en usuarios estratégicos que comprendan el impacto de cada transacción en los diferentes departamentos.

---

## ÍNDICE DEL MÓDULO

1. **Lección 1.1:** Visión General, Arquitectura Técnica y Modelo de Empresa
2. **Lección 1.2:** Navegación, Búsquedas y Personalización del Cockpit Fiori
3. **Lección 1.3:** Caso Práctico Resuelto - Configuración, Ventas y Auditoría Documental
4. **Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA**
5. **Banco de Evaluación Situacional**
6. **Guiones Humanizados para Locución IA**

---

## LECCIÓN 1.1: VISIÓN GENERAL, ARQUITECTURA TÉCNICA Y MODELO DE EMPRESA

### 1. Propósito y Contexto de Negocio
SAP Business One es una suite empresarial integrada (ERP) diseñada para pequeñas y medianas empresas (PyMEs). Centraliza la totalidad de las operaciones—desde Ventas y Finanzas hasta Producción e Inventario—en una **única base de datos transaccional**.
> **¿Por qué es vital esto?** Elimina las islas de información. Cuando un vendedor registra una salida de mercancía, contabilidad y almacenes ven el impacto en tiempo real. Se reducen las discrepancias y se agiliza la toma de decisiones.

### 2. Fundamentos de Arquitectura Técnica

#### A. Modelo de Datos y Empresa
* **Una empresa = Una base de datos:** Cada razón social o entidad legal independiente debe gestionarse en una base de datos propia. Esto asegura el aislamiento legal y contable de la información.
* **Acceso multisociedad:** Para corporaciones con múltiples personerías jurídicas y balances separados, el usuario inicia sesión y selecciona a qué empresa desea entrar.
* **Cambio de empresa:** Se puede realizar desde el menú `Gestión > Seleccionar empresa` o simplemente haciendo clic en el nombre de la empresa situado en el centro superior de la pantalla.

#### B. Plataformas de Base de Datos y Despliegue

| Plataforma | Características Clave | Ventajas Principales |
| :--- | :--- | :--- |
| **SAP HANA** | Motor in-memory (en memoria RAM). Habilita Cockpit Fiori (HTML5), Enterprise Search y analíticas avanzadas. | Respuestas instantáneas y búsqueda federada global en tiempo real. |
| **Microsoft SQL Server** | Motor relacional estándar basado en disco físico. | Solución tradicional robusta (no dispone del Fiori nativo o búsquedas tipo Google). |

**Modalidades de Despliegue:**
* **On-Premise (Local):** La empresa posee y mantiene sus propios servidores. Implica una inversión de capital (CapEx) y brinda control total sobre infraestructura y seguridad.
* **Cloud (Nube / SaaS):** Acceso vía navegador (Web Client), licenciamiento operativo (OpEx) y escalabilidad inmediata sin preocuparse por el mantenimiento físico de servidores.

#### C. Tipos de Usuario y Esquema de Licenciamiento
Para garantizar la integridad y confidencialidad, el acceso al ERP está segmentado:
* **Superusuario:** Acceso total e irrestricto. Puede configurar funciones de administración y todas las opciones de menú, exento de bloqueos generales.
* **Usuario Final / Normal:** Su acceso se delimita por dos factores:
  1. El tipo de licencia adquirida (Profesional, Limitada CRM, Limitada Logística, Financiera).
  2. Las autorizaciones generales configuradas por el administrador en `Gestión > Inicialización del sistema > Autorizaciones`.

---

## LECCIÓN 1.2: NAVEGACIÓN, BÚSQUEDAS Y PERSONALIZACIÓN DEL COCKPIT FIORI

### 1. Elementos de la Interfaz de Usuario

El **Cockpit Fiori** es la reinvención del escritorio de trabajo. Pasa de un árbol de menús aburrido a un panel de control interactivo basado en HTML5.

* **Iconos Activos vs. Inactivos:** Solo las herramientas útiles para la ventana activa aparecerán en color. Las deshabilitadas quedan en gris para guiar al usuario.
* **Exportación Directa:** Facilita la generación de archivos PDF, Word o la exportación a Excel y OneDrive (Office 365) en un clic.
* **Log de Mensajes del Sistema:** La barra inferior muestra el historial de éxito o error. Los códigos de error ayudan directamente al área de soporte o al portal de ayuda de SAP.

### 2. Métodos de Búsqueda y Navegación Rápida

| Método de Búsqueda | Descripción y Utilidad |
| :--- | :--- |
| **Enterprise Search (HANA)** | Búsqueda universal tipo Google (esquina superior derecha). Busca en todas las tablas del sistema de forma simultánea. Ideal cuando solo recuerdas un nombre, un teléfono o un pedazo de información. |
| **Búsqueda de Menús** | Al escribir "oferta" en el buscador de la izquierda, resalta las rutas del menú. Ahorra tiempo a usuarios que aún no memorizan el árbol de opciones. |
| **Arrastrar y Vincular (Drag & Relate)** | Tecnología de BI operativo interactivo. Arrastra un código (ej. Código de Cliente) sobre una opción del menú (ej. Facturas) para obtener todas las facturas de ese cliente de manera inmediata. |
| **Flecha Naranja (Golden Arrow)** | El ícono de enlace junto a campos como "Cliente" o "Artículo". Un clic abre el registro maestro subyacente al instante, sin perder de vista tu transacción actual. |

### 3. Anatomía y Personalización del Cockpit Fiori

El Cockpit permite empoderar a cada rol dentro de la empresa mediante el uso de **Widgets**:
* **Workbench (Banco de Trabajo):** El proceso de trabajo trazado visualmente (ej. Oferta -> Pedido -> Entrega -> Factura). Los puntos azules dentro de los íconos proporcionan acceso a informes rápidos.
* **Funciones Comunes:** Accesos directos para no navegar por el menú principal (hasta el 80% de las tareas diarias con un clic).
* **Indicadores (KPIs) y Dashboards:** Gráficos que comparan resultados contra metas estratégicas y visualizaciones ricas para la toma de decisiones.

**Cómo personalizar:**
1. Haz clic en el ícono de **Lápiz** para activar la edición.
2. Usa el botón **+** para abrir la Galería de Widgets.
3. Arrastra, agrega o elimina (papelera) lo que necesites.
4. **Guarda** con la marca de verificación. Puedes actualizar tu propio cockpit o guardarlo como plantilla (si eres administrador) para todo un grupo (ej. Ventas).

---

## LECCIÓN 1.3: CASO PRÁCTICO RESUELTO - CONFIGURACIÓN, VENTAS Y AUDITORÍA DOCUMENTAL

**Contexto del Escenario:**
Bill es el nuevo Jefe de Ventas en *OEC Computers*. Necesita adaptar su sistema para ser eficiente desde el día uno, crear y dar seguimiento a cotizaciones complejas, y auditar su trabajo.

### TAREA 1: Asignación de Plantilla de Cockpit de Ventas
Bill requiere el Cockpit especializado de ventas. Un administrador o usuario autorizado le vincula el grupo correspondiente. Si a Bill no se le otorgan permisos de finanzas, verá el ícono de facturación bloqueado en su workbench (segregación de funciones).

### TAREA 2: Asignación en Interlocutor Comercial
Para asumir la titularidad, Bill modifica la cuenta del cliente:
1. Va a `Ventas - Clientes > Datos maestros interlocutor comercial`.
2. Pasa al modo **Buscar** (`Ctrl + F`), introduce el cliente (ej. C20000).
3. Cambia el campo de "Empleado de ventas" seleccionando su nombre.
4. Presiona **Actualizar**.

### TAREA 3: Configuración del Widget "Funciones Comunes"
Bill desea un atajo para registrar Actividades de CRM:
1. Clic en el **Lápiz** (edición de Cockpit).
2. Agrega el widget de **Funciones comunes**.
3. Arrastra la transacción *Actividad* desde el menú principal hacia el widget.
4. **Guarda** los cambios.

### TAREA 4: Creación de Oferta de Ventas Compleja
Se requiere un documento que sume varios artículos y aplique descuentos, usando diferentes tipos de líneas:
1. **Cabecera:** `Ventas > Oferta de ventas` (Cliente C20000).
2. **Línea de Texto Libre:** Para insertar condiciones comerciales. El campo *Tipo* de la fila debe ser "Texto". *(Nota: Si no se ve la columna Tipo, se activa desde el engranaje de "Parametrizaciones de formulario").*
3. **Líneas de Artículo:** Ingresa códigos de productos de hardware y cantidades.
4. **Línea de Subtotal:** Cambia el *Tipo* de la fila a "Subtotal". El ERP suma automáticamente todo lo que está arriba.
5. **Descuento:** Aplica un 5% en la casilla de descuento al pie del formulario y hace clic en **Crear**.

### TAREA 5: Copiar Oferta a Pedido
El ERP evita el re-trabajo manual y asegura la trazabilidad (Mapa de Relaciones):
1. Bill encuentra la oferta recién creada.
2. Utiliza el botón inferior derecho **Copiar a > Pedido de cliente**.
3. Toda la información comercial se hereda de manera exacta.
4. Añade la fecha obligatoria de entrega y hace clic en **Crear**.

---

## MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA

Esta sección instruye a la Inteligencia Artificial (o personal de soporte) sobre cómo resolver bloqueos comunes de usuarios.

**Problema 1: "No encuentro una transacción en el menú principal"**
* **Análisis (Causa Raíz):** Problemas de permisos o de visualización (UI).
* **Solución IA:**
  1. Escribe la transacción en la barra de búsqueda de menú. Si no se visualiza, faltan **Autorizaciones** (Revisar en Inicialización de sistema).
  2. Si está autorizada pero no se ve, el usuario desactivó el módulo en la herramienta "Parametrizaciones de formulario" del menú principal (icono de llave inglesa).

**Problema 2: "No puedo agregar líneas de texto o subtotales en las ventas"**
* **Análisis (Causa Raíz):** La columna "Tipo" está oculta en la cuadrícula de datos.
* **Solución IA:**
  1. Con el formulario abierto, ve a **Parametrizaciones de formulario** (icono de engranaje superior).
  2. Pestaña *Formato de tabla*, localiza la fila *Tipo*.
  3. Marca las casillas **Visible** y **Activo**, y presiona Actualizar.

**Problema 3: "Mis widgets del Cockpit desaparecieron al iniciar sesión"**
* **Análisis (Causa Raíz):** Los cambios no se guardaron correctamente, o el administrador sobreescribió la plantilla.
* **Solución IA:**
  1. Tras editar (lápiz), se debe confirmar en el ícono del **Visto Bueno** (Check).
  2. Al sistema le debe indicar explícitamente **"Actualizar mi cockpit"**.
  3. Comprobar que en Parametrizaciones Generales esté habilitado el entorno Cockpit Fiori.

---

## BANCO DE EVALUACIÓN SITUACIONAL

A continuación, un banco de pruebas para medir la comprensión operativa y de negocio:

**Pregunta 1 (Arquitectura de Datos)**
Una empresa textil internacional abre una nueva filial en Perú con su propio número de identificación tributaria (RUC). ¿Cómo debe configurarse esta nueva filial en SAP Business One?
* A) Como una nueva sucursal dentro de la base de datos matriz para compartir numeración.
* B) Instalando un servidor físico completamente distinto en las oficinas de Perú.
* C) **[CORRECTA]** Creando una base de datos independiente para mantener la integridad contable y legal, accediendo a través del menú de selección de empresa.
* D) Cambiando las parametrizaciones del plan de cuentas de la matriz.
> **Explicación:** Una entidad legalmente distinta, con su propio registro fiscal y contable, exige una base de datos propia en SAP B1.

**Pregunta 2 (Agilidad y Navegación)**
Durante una llamada crítica, un cliente te solicita el estatus de sus pedidos pendientes. Estás viendo la ficha de su registro maestro y no quieres navegar por los menús de reportes. ¿Qué acción es la más eficiente?
* A) Generar una consulta en SQL Management Studio.
* B) **[CORRECTA]** Hacer clic en la flecha naranja (Golden Arrow) junto a los saldos de pedidos en sus datos maestros, o usar *Drag & Relate*.
* C) Cerrar la ventana del maestro y abrir manualmente la lista de partidas abiertas del módulo de ventas.
* D) Utilizar Enterprise Search buscando el nombre de la transacción.
> **Explicación:** La "Golden Arrow" y el "Drag & Relate" permiten saltar instantáneamente a los documentos subyacentes (drill-down) sin interrumpir tu flujo de trabajo en la ventana activa.

**Pregunta 3 (Flujo Operativo y Trazabilidad)**
Un cliente aprobó una oferta que emitiste ayer. Para avanzar en la venta, decides ir a "Ventas > Pedidos de cliente" e ingresas manualmente todos los códigos y precios de nuevo. ¿Qué impacto negativo tiene esto en el ERP?
* A) Bloquea automáticamente el sistema debido a duplicidad.
* B) Consume más licencias de usuario del sistema.
* C) **[CORRECTA]** Se pierde la conexión del mapa de relaciones entre la oferta y el pedido, perjudicando la trazabilidad de auditoría, además del riesgo de errores de captura.
* D) SAP elimina la oferta anterior al crear un pedido nuevo manualmente.
> **Explicación:** En un ERP, usar las funciones "Copiar a" o "Copiar de" asegura que los datos fluyan correctamente de un eslabón a otro. Crear el documento suelto rompe la cadena de eventos lógicos y la trazabilidad de auditoría.

**Pregunta 4 (Parametrización de UI)**
Quieres insertar una nota explicativa larga (Ej: "Garantía de 2 años no cubre daños eléctricos") en medio de las líneas de una cotización. Sin embargo, el sistema solo te permite agregar códigos de artículos y genera un error al teclear el texto. ¿Por qué ocurre?
* A) No tienes licencia profesional.
* B) **[CORRECTA]** La columna "Tipo" está oculta. Debes mostrarla mediante las Parametrizaciones de Formulario y seleccionar el tipo "Texto" en la fila correspondiente.
* C) SAP Business One no soporta añadir texto en los documentos.
* D) Debes escribir esa información exclusivamente en la pestaña de finanzas.
> **Explicación:** Las parametrizaciones de formulario permiten descubrir campos ocultos como la columna "Tipo", la cual cambia el comportamiento de la fila para aceptar sub-totales o campos de texto libre.

---
