# Arquitectura LMS & Árbol de Habilidades (B1 Academy)

## 1. Visión General: Evolución a Plataforma E-Learning
El visor de manuales pasará a ser un **LMS (Plataforma Interactiva de Aprendizaje)** gamificada. El objetivo es retención, interactividad práctica y tutoría mediante IA de alto nivel.

---

## 2. Nueva Estructura de la Clase Práctica (Por Manual)
1. **🎬 Clase en Video:** Videos narrando el material. Se alojarán en **YouTube/TikTok/Vimeo** (incrustados mediante iFrame) para no consumir almacenamiento interno del servidor.
2. **🤖 Tutor IA Inteligente:** Un agente integrado con memoria y caché:
   - **Comprensión del Contexto Global:** No solo lee el MD de la lección actual, sino los MD relacionados.
   - **Caché Inteligente (Semantic Cache):** Respuestas de preguntas frecuentes y lógicas simples (ej. "2+2", "qué es un socio de negocios") se responden automáticamente sin repensar todo el documento.
   - **Generador de Preguntas:** La IA puede sugerir dinámicamente preguntas que otros usuarios han hecho.
3. **❓ FAQ y Preguntas Personales:** Sección comunitaria.
4. **🛠️ Talleres y Simulador (Práctica):** 
   - Pantallas interactivas programadas (frontend puro imitando SAP, apoyadas por imágenes recortadas de internet).
   - Validarán los clics y el ingreso de datos básicos.
   - *Nota:* Solo se activan en manuales operativos, no en los introductorios.
5. **📝 Prueba de Conocimiento (Quiz):** Evaluación final de la lección.

---

## 3. Árbol de Habilidades (Skill Tree) - Propuesta Real
Basado en el análisis de las **23 categorías y 120 manuales**, se propone el siguiente árbol para guiar al usuario progresivamente sin abrumarlo:

### 🟢 Módulo 0: Fundamentos (Tronco Común)
*Prerrequisito para cualquier otra rama. No llevan Simulador, solo Quiz.*
- Nivel 1: **Introducción a SAP Business One**
- Nivel 2: **Visión General del Sistema**

*(Al aprobar el Módulo 0, se desbloquean simultáneamente los Niveles 1 de las siguientes Ramas)*

### 🔵 Rama A: Finanzas y Contabilidad
- Nivel 1: **Contabilidad Básica** | **Gestión Bancaria y Pagos** (Requieren simulador de Asientos y Pagos)
- Nivel 2: **Informes Financieros y Control** | **Procesos Financieros** | **Costos y Presupuestos**
- Nivel 3: **Activos Fijos**

### 🟠 Rama B: Logística e Inventario
- Nivel 1: **Datos Maestros de Artículo** | **Gestión de Inventario y Artículos** | **Compras y Aprovisionamiento** (Requieren simulador de Maestro de Artículos y Pedidos)
- Nivel 2: **Inventarios y Movimientos** | **Ubicaciones en Almacén (Bin Locations)**
- Nivel 3: **Planificación de Materiales (MRP)** | **Producción**

### 🟣 Rama C: Comercial y Servicios
- Nivel 1: **Ventas** (Simulador del Proceso Quote-to-Cash)
- Nivel 2: **Determinación de Precios** | **Gestión de Servicios**
- Nivel 3: **Gestión de Proyectos**

### ⚙️ Rama D: Administración y Soporte
- Nivel 1: **Implementación y Configuración**
- Nivel 2: **Configuración Financiera**
- Nivel 3: **Herramientas de Soporte** | **Casos Prácticos y Ejercicios**

> **Lógica de Desbloqueo Visual:**
Al entrar, el panel solo muestra el "Módulo 0" abierto. Las Ramas A, B, C y D están colapsadas y con icono de Candado (🔒). Al rendir el **Examen de Categoría** del Módulo 0, se abren las 4 ramas en su Nivel 1.

---

## 4. Clasificación de Manuales: Teoría vs. Simulador
1. **Manuales 100% Teóricos (No requieren taller interactivo):** 
   - Todo lo de *Introducción* y *Visión General*.
   - *Informes Financieros*, *Herramientas de Soporte* (mayormente de lectura y análisis de reportes).
2. **Manuales Operativos (SÍ requieren Simulador):**
   - Transaccionales: *Ventas, Compras, Gestión Bancaria, Producción, Inventario y Movimientos.*
   - Datos Maestros: Creación de clientes, proveedores, artículos.

