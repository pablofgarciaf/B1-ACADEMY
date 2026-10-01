# 🎬 Mapa Maestro de Producción: Videos Explicativos, Generación de Nuevas Imágenes y Simuladores SAP

Este documento establece el **guion técnico, mapa de capturas a generar y especificaciones del simulador interactivo** para los módulos prácticos de SAP Business One 10.0 en SAP HANA.

---

## 📌 Índice de Módulos Prácticos
1. [CSI08: Práctica de Consultas SQL (Query Practice)](#-módulo-csi08-práctica-de-consultas-sql)
2. [CSI08 Soluciones: Consultas SQL (Query Practice Solutions)](#-módulo-csi08-soluciones-paso-a-paso)
3. [CSL01: Introducción, Navegación y Cockpit](#-módulo-csl01-introducción-y-navegación)
4. [CSL01 Soluciones: Introducción y Ventas](#-módulo-csl01-soluciones-de-navegación-y-crm)
5. [CSL02: Proceso de Aprovisionamiento (Compras)](#-módulo-csl02-proceso-de-aprovisionamiento)
6. [CSL02 Soluciones: Aprovisionamiento y Pagos](#-módulo-csl02-soluciones-de-aprovisionamiento)

---

## 🗂️ 1. Módulo CSI08: Práctica de Consultas SQL

### 🎯 Objetivo del Video
Capacitar al estudiante en la construcción de consultas directas sobre la base de datos SAP HANA mediante el Generador de Consultas, el filtrado dinámico con variables `[%0]`, el uso de funciones analíticas y la integración con el Cockpit Fiori.

| Escena / Slide | Captura Original Extraída | Nueva Imagen / Pantalla a Generar (1080p) | Guion de Locución para el Video (Español Neutro) | Campos y Lógica para el Simulador Interactivo |
| :--- | :--- | :--- | :--- | :--- |
| **Escena 1 (Slide 1-2)**<br>Portada e Introducción | `slide_1_img_01.png`<br>`slide_1_img_02.jpeg` | Slide de título moderno SAP B1 HANA con logotipo oficial, tema oscuro y diagrama de las 5 tareas prácticas. | *"Bienvenidos al módulo práctico de creación de consultas en SAP Business One versión para SAP HANA. A lo largo de esta sesión, aprenderás a extraer información estratégica del sistema utilizando el Generador de Consultas, combinando tablas maestras y transaccionales, y visualizando los resultados en tiempo real en tu Cockpit."* | Pantalla de bienvenida con selección de usuario `manager` y base de datos `SBODEMO_ES`. |
| **Escena 2 (Slide 3-4)**<br>Tarea 1: Lista de Clientes | `slide_3_img_03.png`<br>`slide_4_img_05.png` | Mockup nítido de la ventana del Generador de Consultas con `OCRD`, lista de campos y la cláusula `T0."CardType" = 'C'`. | *"Comenzamos con la primera tarea: un reporte de clientes y sus saldos. Abrimos el Generador de Consultas desde el menú Herramientas. En la casilla de tabla escribimos OCRD y pulsamos Tab. Seleccionamos código, razón social, dirección, ciudad y saldo. Para excluir proveedores y prospectos, añadimos en la condición Where: CardType igual a 'C'."* | - Input Tabla: `OCRD`<br>- Selección de campos: `CardCode`, `CardName`, `Balance`<br>- Condición Where: `CardType = 'C'`<br>- Botón: `Ejecutar`<br>- Atajo interactivo: `Ctrl + Clic` en cabecera para totalizar. |
| **Escena 3 (Slide 5)**<br>Tarea 2: Consulta Parametrizada | `slide_5_img_06.png`<br>`slide_5_img_07.png` | Pantalla dual: Factura de deudores con Información del Sistema activa mostrando `DocDate` y `DocTotal`, y ventana de selección de fecha dinámica. | *"En la tarea 2 aprenderemos a parametrizar consultas. Con la información del sistema activa pulsando Ctrl + Shift + I, identificamos los nombres técnicos en la tabla OINV. Al configurar la cláusula Where con T0.DocDate mayor que [%0], el sistema solicitará una fecha en tiempo de ejecución de forma interactiva."* | - Input Tabla: `OINV`<br>- Filtro: `DocStatus = 'O' AND DocDate > [%0]`<br>- Modal emergente: Selector de fecha (DatePicker)<br>- Grid de resultados con flechas naranjas clickeables. |
| **Escena 4 (Slide 6)**<br>Tarea 3: Agrupación Multitabla | `slide_6_img_08.png`<br>`slide_6_img_09.png` | Interfaz del Generador mostrando unión automática `OQUT` + `OSLP`, cláusula `GROUP BY` y resultados con `SUM` y `COUNT`. | *"La tarea 3 nos enseña a unir tablas. Ingresamos OQUT para ofertas y OSLP para empleados de ventas; SAP B1 crea el INNER JOIN automáticamente. Aplicamos las funciones SUM para el total cotizado y COUNT para el número de documentos, agrupando obligatoriamente por empleado y cliente."* | - Tablas: `OQUT`, `OSLP`<br>- Campos agrupados: `SlpName`, `CardCode`, `CardName`<br>- Métricas: `SUM(DocTotal)`, `COUNT(DocNum)`<br>- Validación de sintaxis SQL en tiempo real. |
| **Escena 5 (Slide 7)**<br>Tarea 4: Acumulado Continuo | `slide_7_img_10.png` | Ventana SQL con la instrucción `SUM(DocTotal) OVER (PARTITION BY SlpName ORDER BY DocNum)` y tabla de resultados con pedidos del día. | *"Para supervisar los pedidos del día, empleamos funciones analíticas de SAP HANA. Con la cláusula OVER calculamos un acumulado progresivo por representante comercial, ideal para integrarlo en el Gestor de Alertas automáticas."* | - Tablas: `ORDR`, `OSLP`<br>- Cláusula analítica de ventana<br>- Botón de prueba de ejecución<br>- Opción de guardar en categoría `Ventas`. |
| **Escena 6 (Slide 8)**<br>Tarea 5: Widget en Cockpit | `slide_8_img_11.png`<br>`slide_8_img_12.png` | Panel Cockpit Fiori con el widget de recuento 'Entregas de Hoy' marcando número interactivo. | *"Finalmente, conectamos nuestra consulta técnica con el usuario operativo. Creamos la consulta sobre entregas del día en la tabla ODLN y la vinculamos a un Widget de Recuento en el Cockpit. Al hacer clic sobre el indicador numérico, el consultor puede auditar los documentos directamente."* | - Dashboard Fiori simulado con widgets arrastrables.<br>- Configuración de Widget de Recuento (`ODLN`).<br>- Contador dinámico que incrementa al crear entregas. |

---

## 🗂️ 2. Módulo CSI08 Soluciones: Paso a Paso Detallado

### 🎯 Objetivo del Video
Explicar la resolución oficial, resolución de fallas frecuentes (como errores de sintaxis en HANA y comillas dobles) y la asignación de permisos por grupos.

| Escena / Slide | Captura Original Extraída | Nueva Imagen / Pantalla a Generar (1080p) | Guion de Locución para el Video (Español Neutro) | Campos y Lógica para el Simulador Interactivo |
| :--- | :--- | :--- | :--- | :--- |
| **Slide 3-7**<br>Solución Tarea 1 | `slide_3_img_03.png`<br>`slide_4_img_05.png`<br>`slide_5_img_06.png` | Secuencia de 3 capturas en alta fidelidad: 1) Formulario Query Generator; 2) Ventana Guardar Consulta con 'Tratar Categorías'; 3) Asignación de Grupo No. 1. | *"Para resolver el reporte de clientes, escribimos OCRD y seleccionamos los campos de dirección y saldo. Noten un detalle clave en SAP HANA: los nombres de campo deben llevar comillas dobles. Guardamos la consulta bajo la categoría Ventas y la asignamos al Grupo 1 de autorizaciones."* | - Modal de Guardar Consulta.<br>- Creación de categoría `Ventas`.<br>- Asignador de grupos (1 al 128) con checkboxes interactivos. |
| **Slide 8-10**<br>Solución Tarea 2 | `slide_8_img_13.png`<br>`slide_9_img_14.png` | Captura con zoom resaltando la variable `[%0]` y la ventana emergente con el calendario de fechas. | *"Al resolver la consulta de facturas, la variable entre corchetes porcentaje cero actúa como disparador de interfaz. Al presionar Ejecutar, el sistema detecta que DocDate es tipo fecha y nos presenta el calendario estándar."* | - Disparador de parámetros dinámicos.<br>- Simulación de ejecución con filtro fecha.<br>- Flecha de profundización (drill-down naranja) a Socio de Negocios. |
| **Slide 11-13**<br>Solución Tarea 3 | `slide_11_img_16.png`<br>`slide_12_img_17.png` | Vista del Generador con campos `SUM(DocTotal)` y `COUNT(DocNum)` con el panel de 'Agrupar por' visible. | *"Atención en la solución multitabla: todo campo seleccionado que no esté dentro de una función de agregación debe incluirse obligatoriamente en el área Agrupar Por, de lo contrario la base de datos devolverá un error de sintaxis."* | - Editor de funciones SQL agregadas.<br>- Panel de agrupación con validación de campos obligatorios. |
| **Slide 14-15**<br>Solución Tarea 4 | `slide_14_img_18.png`<br>`slide_15_img_19.png` | Código SQL formateado en pantalla con syntax highlighting sobre la cláusula OVER. | *"Observen cómo la cláusula OVER particionada por SlpName mantiene el total acumulado sin alterar las filas individuales de cada pedido de venta."* | - Consola de consulta SQL directa.<br>- Comparador de resultados antes y después del acumulado. |
| **Slide 16-19**<br>Solución Tarea 5 | `slide_16_img_20.png`<br>`slide_18_img_22.png`<br>`slide_19_img_24.png` | Flujo de 4 pasos: 1) Crear entrega; 2) Configurar Count Widget; 3) Galería de Widgets (+); 4) Cockpit actualizado. | *"Para completar el ejercicio, abrimos la Galería de Widgets, seleccionamos Recuento de Objetos de Negocio, activamos el check verde y guardamos. El widget refleja inmediatamente el recuento de entregas del día."* | - Editor de Cockpit interactivo (modo edición con lápiz).<br>- Drag and drop de widgets a la cuadrícula del usuario. |

---

## 🗂️ 3. Módulos CSL01 y CSL02 (Introducción y Aprovisionamiento)

### 📌 Resumen de Puntos Clave para Grabación de Videos
- **CSL01 (Introducción y CRM):**
  - **Capturas Clave a Recrear:** Selección de Plantilla Fiori de Ventas, Búsqueda de Menú (`Actividades`), Parametrizaciones de formulario para filas de Tipo 'Texto' y 'Subtotal', y los 4 métodos de consulta de pedidos abiertos (Datos Maestros, Arrastrar y Vincular, Partidas Abiertas y Enterprise Search).
  - **Guion:** Orientado al flujo de inducción del nuevo Jefe de Ventas (Bill) en OEC Computers.
- **CSL02 (Compras y Cadena de Suministro):**
  - **Capturas Clave a Recrear:** Pedido a Proveedor (`OPOR`), Entradas parciales de mercancías (`OPDN`) usando 'Copiar de' con personalización de filas, verificación de stock multialmacén (`Ctrl + Tab`), Factura de Proveedor (`OPCH`) y Pago Efectuado (`OVPM`).
  - **Guion:** Orientado a la gestión de inventarios y discrepancias de entrega con el proveedor V10000.

---

## 🛠️ Especificaciones para el Simulador Web Interactivo (Fase 3)

### Stack Técnico:
1. **Frontend:** React / Next.js (App Router), Tailwind CSS.
2. **Backend & Persistencia:** Firebase Firestore (para guardar las consultas de los estudiantes, estados de documentos creados y avance pedagógico).
3. **Componentes Clave a Programar:**
   - `SapHeaderBar`: Barra superior con Enterprise Search, selector de empresa y usuario `manager`.
   - `QueryGeneratorModal`: Simulador fiel de la ventana del Generador de Consultas de SAP B1 (casillas de tablas, selector de campos, área Where, Sort By y Group By).
   - `SapGridTable`: Cuadrícula con ordenación alfanumérica, selección de filas, totales al pie con `Ctrl + Clic` y flechas naranjas de navegación.
   - `CockpitDashboard`: Panel personalizable con widgets de recuento y gráficos KPI.
