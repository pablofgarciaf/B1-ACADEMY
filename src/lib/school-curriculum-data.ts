// ═══════════════════════════════════════════════════════════════════
// CURRÍCULO ACADÉMICO DE LA ESCUELA SAP BUSINESS ONE 10.0 (CAMPUS UNIVERSITARIO)
// Diseñado para Estudiantes de Pregrado/Posgrado, Profesionales y Docentes.
// Las Clases condensan, sintetizan y estructuran la lógica empresarial real,
// vinculando teoría magistral, tutoría Master B1, talleres en el simulador,
// quizzes de aprobación y manuales del atlas como material de consulta.
// ═══════════════════════════════════════════════════════════════════

export interface ClassCheckpoint {
  timestampMin: number;
  pauseMessage: string;
  teacherAudioPrompt: string;
  simulatorTask: string;
  simulatorMenuPath: string;
  simulatorArchetype: string;
}

export interface ClassSimulatorMission {
  title: string;
  description: string;
  stepByStep: string[];
  validationCriteria: string;
  targetModule: string;
}

export interface ClassQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface RelatedManual {
  id: string;
  title: string;
  summary: string;
}

export interface SchoolClass {
  id: string;
  number: number;
  title: string;
  durationMin: number;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  courseId: string;
  courseTitle: string;
  careerId: string;
  careerTitle: string;
  objectives: string[];
  businessScenario: string;
  theoryContent: string;
  checkpoint: ClassCheckpoint;
  simulatorMission: ClassSimulatorMission;
  quiz: ClassQuizQuestion[];
  relatedManuals: RelatedManual[];
}

export interface SchoolCourse {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  durationHours: number;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  classes: SchoolClass[];
}

export interface SchoolCareer {
  id: string;
  code: string;
  number: number;
  title: string;
  shortTitle: string;
  badge: string;
  colorTheme: string;
  gradient: string;
  targetAudience: string;
  careerRole: string;
  totalHours: number;
  diplomaTitle: string;
  diplomaIssuanceFeeUSD: number;
  description: string;
  objectives: string[];
  courses: SchoolCourse[];
  skillsTagged: string[];
}

// ═══════════════════════════════════════════════════════════════════
// BASE DE DATOS MAESTRA DE LAS 4 CARRERAS Y 40 CLASES MAGISTRALES
// ═══════════════════════════════════════════════════════════════════

export const SCHOOL_CAREERS: SchoolCareer[] = [
  // ─────────────────────────────────────────────────────────────────
  // CARRERA 1: FUNDAMENTOS OPERATIVOS, NAVEGACIÓN Y NÚCLEO MAESTRO ERP
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'carrera-fundamentos',
    code: 'B1-CAR-01',
    number: 1,
    title: 'Fundamentos Operativos, Navegación y Núcleo Maestro ERP',
    shortTitle: 'Fundamentos & Núcleo ERP',
    badge: 'Onboarding & Core ERP',
    colorTheme: 'emerald',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    targetAudience: 'Estudiantes universitarios, analistas de negocio, nuevos usuarios y consultores funcionales junior.',
    careerRole: 'Operador de Negocios Certificado SAP B1',
    totalHours: 40,
    diplomaTitle: 'Diploma Oficial de Operador de Negocios en SAP Business One',
    diplomaIssuanceFeeUSD: 49,
    description: 'Aprende los principios estructurales del ERP líder para medianas empresas: arquitectura en memoria HANA, Cockpit interactivo Fiori, configuración multi-sociedad, datos maestros de Socios de Negocios (OCRD) y Artículos (OITM), matrices de precios y trazabilidad en el Mapa de Relaciones.',
    objectives: [
      'Comprender la arquitectura cliente-servidor de SAP Business One sobre SAP HANA.',
      'Operar con destreza el Cockpit Fiori, widgets analíticos, menús y comandos rápidos.',
      'Parametrizar usuarios, valores por defecto y campos definidos por usuario (UDFs).',
      'Administrar con exactitud fichas de Clientes y Proveedores con condiciones crediticias.',
      'Gestionar el catálogo de artículos, listas de precios base y descuentos comerciales.',
      'Auditar flujos documentales completos mediante el Mapa de Relaciones.'
    ],
    skillsTagged: ['Navegación Fiori', 'Datos Maestros OCRD', 'Catálogo OITM', 'Listas de Precios', 'Mapa de Relaciones'],
    courses: [
      {
        id: 'curso-fund-01',
        code: 'CUR-FND-01',
        title: 'Arquitectura Empresarial, Cockpit Fiori y Navegación Transaccional',
        shortTitle: 'Arquitectura & Navegación Fiori',
        description: 'Fundamentos de la base de datos HANA, estructura multi-sociedad, interfaz visual Fiori y auditoría documental.',
        durationHours: 18,
        level: 'Básico',
        classes: [
          {
            id: 'clase-fund-01',
            number: 1,
            title: 'Arquitectura Cliente-Servidor HANA, Modelo Multi-Sociedad y Creación de Usuarios',
            durationMin: 35,
            level: 'Básico',
            courseId: 'curso-fund-01',
            courseTitle: 'Arquitectura Empresarial, Cockpit Fiori y Navegación Transaccional',
            careerId: 'carrera-fundamentos',
            careerTitle: 'Fundamentos Operativos, Navegación y Núcleo Maestro ERP',
            objectives: [
              'Entender la diferencia entre la base de datos relacional y el motor in-memory de SAP HANA.',
              'Aprender cómo SAP B1 administra múltiples bases de datos de sociedades independientes en un mismo servidor.',
              'Crear y configurar un usuario del sistema asignando licencias profesionales y autorizaciones.'
            ],
            businessScenario: 'OEC Computers es una compañía multinacional de distribución tecnológica con sede en Miami y filiales en Latinoamérica. El Director de TI requiere incorporar nuevos analistas asignándoles cuentas seguras, licencias tipo "Professional" y vinculándolos a su sucursal correspondiente.',
            theoryContent: `### 1. El Paradigma de SAP Business One sobre SAP HANA
A diferencia de los ERPs tradicionales basados en discos mecánicos, **SAP Business One 10.0 sobre SAP HANA** procesa los datos íntegramente en la memoria RAM (**In-Memory Computing**). Esto permite análisis en tiempo real, búsqueda tipo Google en toda la base de datos empresarial y ejecución instantánea de reportes complejos.

#### Componentes de la Arquitectura:
- **Capa de Base de Datos:** Motor SAP HANA (Linux SUSE o Red Hat) que aloja el esquema de la empresa (tablas \`OITM\`, \`OCRD\`, \`OINV\`, etc.).
- **Capa de Servidor de Aplicaciones:** Servicio de Licencias (System Landscape Directory - SLD), Servidor de Integración (B1iSN) y Service Layer (API REST moderna).
- **Capa de Cliente:** Cliente enriquecido de escritorio para Windows y cliente Web Fiori accesible desde cualquier navegador moderno.

### 2. Modelo Multi-Sociedad
SAP Business One permite gestionar en una misma instancia múltiples sociedades mercantiles completamente aisladas a nivel de base de datos contable:
- Cada sociedad posee su propia moneda local, moneda del sistema y Plan de Cuentas.
- Permite operaciones inter-compañía mediante módulos de consolidación e integración.

### 3. Gestión de Usuarios y Licenciamiento
Para que un operador trabaje en el sistema, se requiere:
1. **Definición de Usuario:** En *Gestión > Definiciones > General > Usuarios*. Se asigna Código, Nombre, Correo y Sucursal.
2. **Asignación de Licencia:** A través del *Administrador de Licencias*, se asigna una licencia nominal (ej. *Professional*, *Limited CRM*, *Limited Financials*).
3. **Autorizaciones:** En *Gestión > Inicialización de Sistema > Autorizaciones Generales*, se define a qué módulos y ventanas tiene permiso de lectura, modificación o denegado.`,
            checkpoint: {
              timestampMin: 18,
              pauseMessage: '¡Alto de Cátedra! Master B1 requiere que practiques la creación de un usuario y verifiques su estado en el simulador.',
              teacherAudioPrompt: '¡Hola estudiante! Soy Master B1, tu profesor. Hemos pausado la lección. Abre ahora el Simulador SAP y dirígete a Gestión > Definición > Usuarios para registrar el nuevo operador con licencia profesional.',
              simulatorTask: 'Navega al módulo Gestión y abre la ventana de Usuarios para inspeccionar los perfiles activos.',
              simulatorMenuPath: 'Gestión > Definiciones > General > Usuarios',
              simulatorArchetype: 'system-setup'
            },
            simulatorMission: {
              title: 'Misión de Laboratorio: Alta y Verificación de Usuario Operador',
              description: 'Ingresa al simulador SAP Business One, accede a la ventana de Definición de Usuarios e identifica los parámetros de sucursal y bloqueo de acceso.',
              stepByStep: [
                '1. En el simulador, haz clic en el Menú Principal > Gestión.',
                '2. Despliega la carpeta "Definiciones" y luego "General".',
                '3. Selecciona la opción "Usuarios".',
                '4. Observa el campo "Código de usuario" y la casilla "Bloqueado".',
                '5. Haz clic en "Buscar" para listar los usuarios existentes en la empresa demo.'
              ],
              validationCriteria: 'Ventana de Usuarios abierta correctamente y comprensión del concepto de licenciamiento nominal.',
              targetModule: 'Gestión'
            },
            quiz: [
              {
                question: '¿Cuál es la ventaja principal del motor SAP HANA respecto a las bases de datos relacionales convencionales?',
                options: [
                  'Almacena los datos exclusivamente en archivos de texto plano.',
                  'Procesa toda la información en memoria RAM, permitiendo analítica y transacciones en tiempo real.',
                  'No requiere licencias de ningún tipo.',
                  'Solo funciona para empresas de menos de 5 empleados.'
                ],
                correctIndex: 1,
                explanation: 'SAP HANA es una plataforma in-memory que aloja los datos directamente en la memoria principal del servidor, acelerando radicalmente la ejecución de reportes y transacciones.'
              },
              {
                question: 'En SAP Business One, ¿dónde se configura si un usuario puede ver o modificar las Facturas de Clientes?',
                options: [
                  'En el fichero de socios de negocios.',
                  'En Gestión > Inicialización de Sistema > Autorizaciones Generales.',
                  'En el menú de ayuda F1.',
                  'En la lista de precios.'
                ],
                correctIndex: 1,
                explanation: 'La ventana de Autorizaciones Generales permite definir permisos específicos (Autorización total, Solo lectura o Sin autorización) por usuario o grupo de usuarios.'
              },
              {
                question: '¿Qué tipo de licencia permite acceso total a todos los módulos funcionales de SAP Business One?',
                options: [
                  'Limited Financial',
                  'Limited CRM',
                  'Professional',
                  'Mobile Only'
                ],
                correctIndex: 2,
                explanation: 'La licencia Professional otorga derecho de acceso a todos los módulos y funcionalidades operativas y administrativas del sistema.'
              }
            ],
            relatedManuals: [
              { id: 'tb1000-01-fundamentos-navegacion-entorno-fiori', title: 'Manual 01: Fundamentos y Entorno Fiori', summary: 'Detalle de la arquitectura del servidor, configuración del SLD y despliegue del cliente web.' },
              { id: 'tb1000-05-administracion-usuarios-autorizaciones', title: 'Manual 05: Usuarios y Autorizaciones', summary: 'Guía técnica profunda para perfiles de seguridad, cifrado y políticas de contraseñas.' }
            ]
          },
          {
            id: 'clase-fund-02',
            number: 2,
            title: 'Dominio de la Interfaz: Cockpit Fiori, Menú Principal y Teclas Rápidas',
            durationMin: 40,
            level: 'Básico',
            courseId: 'curso-fund-01',
            courseTitle: 'Arquitectura Empresarial, Cockpit Fiori y Navegación Transaccional',
            careerId: 'carrera-fundamentos',
            careerTitle: 'Fundamentos Operativos, Navegación y Núcleo Maestro ERP',
            objectives: [
              'Dominar la navegación fluida mediante el árbol de Menú Principal y el campo de búsqueda rápida.',
              'Configurar el Cockpit Fiori con widgets analíticos, paneles KPI y gráficos en tiempo real.',
              'Utilizar atajos de teclado clave (Ctrl+Tab, F2, Shift+F2) que duplican la productividad de los consultores.'
            ],
            businessScenario: 'El Gerente General de OEC Computers necesita un cuadro de mando diario en su pantalla de inicio que le muestre el importe total facturado del mes, las 5 entregas pendientes más urgentes y acceso directo a la creación de pedidos sin tener que explorar el árbol completo de menús.',
            theoryContent: `### 1. La Filosofía del Cockpit Fiori en SAP B1
El **Cockpit Fiori** transforma la interfaz estática tradicional en un espacio dinámico centrado en roles. Su diseño responde a los lineamientos visuales modernos de SAP:
- **Tarjetas KPI (Indicadores Clave):** Muestran valores consolidados (ej. *Cuentas por Cobrar Vencidas*, *Margen Bruto Mensual*).
- **Procesos Gráficos de Trabajo:** Diagramas de flujo interactivos con accesos directos paso a paso (ej. de Oferta a Cobro).
- **Widgets de Cuenta:** Gráficos de barras y circulares generados por modelos analíticos Pervasive Analytics sobre HANA.

### 2. Estructura de las Ventanas Transaccionales
Cada formulario en SAP B1 posee 3 modos operativos fundamentales:
1. **Modo Buscar (Ctrl + F):** Los campos aparecen en color amarillo pálido. Permite ingresar comodines como \`*\` para localizar registros existentes.
2. **Modo Crear / Añadir (Ctrl + A):** Los campos aparecen en blanco o con valores predeterminados. El botón inferior dice **"Crear"** o **"Añadir"**.
3. **Modo Actualizar / OK:** Cuando se visualiza un registro existente, al modificar cualquier valor el botón cambia a **"Actualizar"**.

### 3. Teclas Rápidas Esenciales del Consultor
| Comando | Función en SAP B1 |
| :--- | :--- |
| **Ctrl + F** | Pasa inmediatamente a modo "Buscar" |
| **Ctrl + A** | Pasa inmediatamente a modo "Añadir / Crear" |
| **Ctrl + Tab** | Abre la lista de precios o unidades alternativas en líneas de detalle |
| **Flecha Naranja (Golden Arrow)** | Navega directamente al dato maestro vinculado (ej. de la factura al cliente o al artículo) |
| **F2** | Despliega listas de selección en campos de fecha o catálogos |`,
            checkpoint: {
              timestampMin: 22,
              pauseMessage: '¡Práctica con Master B1! Vamos a experimentar el uso de la Flecha Naranja y los modos Buscar vs Crear.',
              teacherAudioPrompt: '¡Atención clase! Soy Master B1. Es hora de verificar la regla de oro: la flecha naranja es el hipervínculo del ERP. Abre el simulador y prueba a buscar un pedido de ventas.',
              simulatorTask: 'Abre el módulo Ventas > Orden de Venta y alterna entre Modo Buscar (Ctrl+F) y Modo Crear.',
              simulatorMenuPath: 'Ventas - Clientes > Orden de Venta',
              simulatorArchetype: 'sales-order'
            },
            simulatorMission: {
              title: 'Misión de Laboratorio: Exploración de Formularios y Modos Operativos',
              description: 'Abre la ventana de Pedido de Ventas en el simulador, reconoce los encabezados, solapas de contenido, finanzas y logística, y la barra de herramientas superior.',
              stepByStep: [
                '1. En el simulador, haz clic en el Menú Principal > Ventas - Clientes.',
                '2. Selecciona "Orden de Venta" (Pedido).',
                '3. Fíjate en el botón inferior: si está en "Añadir" o "Crear", presiona el botón Buscar en la barra superior.',
                '4. Escribe "*" en el campo Socio de Negocios y presiona Buscar para ver la lista de clientes.',
                '5. Selecciona al cliente Maxi-Teq (C20000).'
              ],
              validationCriteria: 'Dominio de los modos Buscar/Añadir y comprensión del comportamiento de los campos de cabecera vs líneas.',
              targetModule: 'Ventas - Clientes'
            },
            quiz: [
              {
                question: '¿Qué indica la pequeña Flecha Naranja (Golden Arrow) junto a un campo en SAP B1?',
                options: [
                  'Que el campo contiene un error que debe ser corregido.',
                  'Que es un enlace directo que abre la ficha maestra del registro vinculado.',
                  'Que el registro está bloqueado para facturación.',
                  'Que el usuario no tiene permisos sobre ese valor.'
                ],
                correctIndex: 1,
                explanation: 'La Flecha Naranja es la herramienta de navegación por excelencia en SAP B1; al hacer clic sobre ella se abre el documento o dato maestro correspondiente en una ventana nueva.'
              },
              {
                question: '¿Qué combinación de teclas permite pasar inmediatamente al modo de Búsqueda en cualquier documento de SAP Business One?',
                options: [
                  'Ctrl + F',
                  'Ctrl + Z',
                  'Ctrl + P',
                  'Alt + F4'
                ],
                correctIndex: 0,
                explanation: 'Ctrl + F (Find) coloca la ventana activa en modo búsqueda, tornando los campos en color amarillo pálido para ingresar criterios de filtrado.'
              },
              {
                question: '¿En qué solapa de una ventana de marketing (ej. Factura) se consultan las condiciones de pago y la cuenta contable?',
                options: [
                  'Solapa Logística',
                  'Solapa Contenido',
                  'Solapa Finanzas',
                  'Solapa Anexos'
                ],
                correctIndex: 2,
                explanation: 'La solapa Finanzas almacena las condiciones de pago del socio de negocios, los proyectos financieros, normas de reparto y cuentas contables asociadas al documento.'
              }
            ],
            relatedManuals: [
              { id: 'tb1000-01-fundamentos-navegacion-entorno-fiori', title: 'Manual 01: Fundamentos y Fiori', summary: 'Exploración de la paleta Belize/Quartz, widgets y personalización del escritorio.' },
              { id: 'tb1000-03-parametrizaciones-formulario-ajustes', title: 'Manual 03: Ajustes de Formulario', summary: 'Cómo activar, ocultar y congelar columnas en las matrices de documentos.' }
            ]
          },
          {
            id: 'clase-fund-03',
            number: 3,
            title: 'Parametrizaciones de Usuario, Campos Definidos (UDFs) y Form Settings',
            durationMin: 35,
            level: 'Básico',
            courseId: 'curso-fund-01',
            courseTitle: 'Arquitectura Empresarial, Cockpit Fiori y Navegación Transaccional',
            careerId: 'carrera-fundamentos',
            careerTitle: 'Fundamentos Operativos, Navegación y Núcleo Maestro ERP',
            objectives: [
              'Personalizar la disposición de columnas en tablas mediante la ventana Ajustes de Formulario.',
              'Comprender la diferencia entre Parametrizaciones Generales, de Documento y de Usuario.',
              'Crear y visualizar Campos Definidos por el Usuario (UDF - User Defined Fields) sin alterar el código fuente.'
            ],
            businessScenario: 'Los digitadores de almacén de OEC Computers se quejan de que tienen que desplazarse horizontalmente a través de 30 columnas innecesarias para ingresar la cantidad recibida. Además, la empresa necesita registrar un campo obligatorio "Número de Manifiesto de Importación" en cada cabecera de entrega.',
            theoryContent: `### 1. Ajustes de Formulario (Form Settings)
En SAP Business One, cada usuario puede tener una visualización personalizada de los formularios sin alterar la base de datos de los demás colegas:
- **Ícono de Llave Inglesa / Engranaje:** Ubicado en la barra de herramientas superior.
- **Pestaña Formato de Tabla:** Permite marcar casillas para **Visible** (si la columna se muestra) y **Activo** (si el usuario puede editarla).
- Permite arrastrar el encabezado de las columnas para reordenarlas de izquierda a derecha.

### 2. Parametrizaciones de Documento
Configuradas por el Administrador en *Gestión > Inicialización de Sistema > Parametrizaciones de Documento*:
- Permite definir si se bloquean documentos con stock negativo.
- Define el texto estándar de cabecera y pie de página en impresiones.
- Configura reglas de redondeo y determinación automática de series de numeración.

### 3. Campos Definidos por el Usuario (UDF - User Defined Fields)
Una de las mayores fortalezas de SAP Business One es su extensibilidad sin programación:
- Los UDFs se crean en *Herramientas > Herramientas de Personalización > Campos Definidos por el Usuario*.
- En la base de datos se almacenan con el prefijo **\`U_\`** (por ejemplo, en la tabla \`OINV\` se crea el campo \`U_Manifiesto\`).
- Se pueden visualizar en el panel lateral presionando **Ctrl + Shift + U** o activando el menú *Ver > Campos Definidos por el Usuario*.`,
            checkpoint: {
              timestampMin: 20,
              pauseMessage: '¡Taller con Master B1! Personaliza las columnas de un formulario y observa el panel de UDFs.',
              teacherAudioPrompt: 'Profesor Master B1 aquí. Ajustar los formularios según las necesidades del puesto de trabajo es lo que distingue a un consultor profesional. Abre el simulador y haz clic en el ícono de Ajustes de Formulario.',
              simulatorTask: 'Abre Ajustes de Formulario en una Orden de Venta y oculta dos columnas no requeridas.',
              simulatorMenuPath: 'Barra Superior > Ajustes de Formulario (Form Settings)',
              simulatorArchetype: 'form-settings'
            },
            simulatorMission: {
              title: 'Misión de Laboratorio: Optimización de Cuadrícula de Trabajo',
              description: 'Abre cualquier documento de marketing en el simulador y aprende a ordenar y ocultar columnas para agilizar la captura de datos.',
              stepByStep: [
                '1. Abre la ventana "Orden de Venta" en el simulador.',
                '2. Haz clic en el ícono de "Ajustes de Formulario" en la barra de herramientas.',
                '3. En la pestaña Formato de Tabla, desmarca la casilla "Visible" para el campo "Código de Proyecto".',
                '4. Haz clic en Actualizar y observa cómo la cuadrícula se vuelve más limpia y legible.'
              ],
              validationCriteria: 'Capacidad de configurar vistas eficientes de captura de datos para usuarios finales.',
              targetModule: 'Ventas - Clientes'
            },
            quiz: [
              {
                question: '¿Qué prefijo añade automáticamente SAP Business One a todos los campos creados por el usuario en la base de datos?',
                options: [
                  'SYS_',
                  'U_',
                  'CUST_',
                  'EXT_'
                ],
                correctIndex: 1,
                explanation: 'Todos los campos definidos por el usuario (UDF) se nombran obligatoriamente con el prefijo U_ (ej. U_NumeroGuia), garantizando que las actualizaciones de SAP no sobrescriban campos personalizados.'
              },
              {
                question: '¿Qué combinación de teclas permite mostrar u ocultar la ventana lateral de Campos Definidos por el Usuario (UDF)?',
                options: [
                  'Ctrl + Shift + U',
                  'Ctrl + Alt + Del',
                  'Shift + F5',
                  'Ctrl + U'
                ],
                correctIndex: 0,
                explanation: 'Ctrl + Shift + U es el atajo oficial para alternar la visualización del panel de campos de usuario en cualquier formulario.'
              },
              {
                question: 'Si desmarcamos la casilla "Activo" de una columna en Ajustes de Formulario, ¿qué ocurre?',
                options: [
                  'La columna se borra de la base de datos de la empresa.',
                  'La columna sigue siendo visible pero sus celdas quedan bloqueadas para edición.',
                  'El usuario no puede ver la columna.',
                  'Se bloquea el documento completo.'
                ],
                correctIndex: 1,
                explanation: 'La casilla "Activo" controla la editabilidad: cuando está desmarcada pero "Visible" está marcada, el usuario puede ver el dato pero no modificarlo.'
              }
            ],
            relatedManuals: [
              { id: 'tb1000-03-parametrizaciones-formulario-ajustes', title: 'Manual 03: Ajustes de Formulario', summary: 'Creación de esquemas de formulario, bloqueo de campos y personalización por grupos.' },
              { id: 'tb1000-04-campos-tablas-usuario-udf-udt', title: 'Manual 04: UDFs y UDTs', summary: 'Ingeniería de datos: creación de tablas de usuario y objetos UDO.' }
            ]
          },
          {
            id: 'clase-fund-04',
            number: 4,
            title: 'Trazabilidad Integral: El Mapa de Relaciones y Registro de Auditoría',
            durationMin: 35,
            level: 'Básico',
            courseId: 'curso-fund-01',
            courseTitle: 'Arquitectura Empresarial, Cockpit Fiori y Navegación Transaccional',
            careerId: 'carrera-fundamentos',
            careerTitle: 'Fundamentos Operativos, Navegación y Núcleo Maestro ERP',
            objectives: [
              'Aprender a auditar cualquier transacción desde su origen hasta su cobro/pago mediante el Mapa de Relaciones.',
              'Interpretar los diferentes modos de vista: Árbol de Documentos, Partidas Contables e Información de Referencias.',
              'Utilizar el Registro de Modificaciones (Audit Trail) para saber qué usuario alteró un dato y en qué fecha exacta.'
            ],
            businessScenario: 'Un auditor tributario externo solicita a OEC Computers la trazabilidad completa de una factura de cliente por 45,000 USD: quién elaboró la cotización original, con qué número de guía se despachó la mercancía y cuál fue el asiento contable y cheque bancario con el que se canceló la deuda.',
            theoryContent: `### 1. El Mapa de Relaciones: El Corazón de la Auditoría ERP
En un sistema ERP integrado como SAP Business One, ningún documento existe de forma aislada. Todo documento de marketing forma parte de una cadena de valor:
- Para abrirlo: Se hace clic derecho en cualquier parte del formulario y se selecciona **Mapa de Relaciones**.
- Muestra gráficamente cajitas interconectadas por líneas de flujo:
  - **Oferta de Venta > Pedido de Cliente > Entrega de Mercancía > Factura de Clientes > Cobro Recibido.**
- **Códigos de Color:** Una línea roja diagonal sobre la caja indica que el documento está cerrado o cancelado; las cajas abiertas siguen pendientes de acción.

### 2. Modos del Mapa de Relaciones
Desde la lista desplegable en la parte superior del Mapa de Relaciones se pueden consultar:
1. **Árbol de Documentos:** La secuencia comercial estándar.
2. **Partidas Contables Relacionadas:** Muestra todos los asientos contables (\`OJDT\`) generados automáticamente por la entrega y la factura.
3. **Estructura de Artículos:** Muestra el desglose de productos cuando intervienen listas de materiales o componentes.

### 3. Registro de Modificaciones (Audit Trail)
¿Quién cambió el límite de crédito de un cliente? ¿Quién modificó el precio de un artículo?
- Se accede mediante *Herramientas > Registro de Modificaciones* sobre cualquier documento o dato maestro.
- El sistema muestra una lista de versiones históricas: al hacer doble clic en una versión previa, resalta en **color blanco o rayado** exactamente los campos modificados, indicando el usuario responsable, la fecha y la hora.`,
            checkpoint: {
              timestampMin: 20,
              pauseMessage: '¡Profesor Master B1 en acción! Abre el Mapa de Relaciones y verifica el flujo de un pedido cerrado.',
              teacherAudioPrompt: 'Hola de nuevo. Como auditores o consultores, el Mapa de Relaciones es nuestra brújula. Haz clic derecho en el documento dentro del simulador y abre el mapa.',
              simulatorTask: 'Haz clic derecho sobre una factura o pedido en el simulador y selecciona Mapa de Relaciones.',
              simulatorMenuPath: 'Clic Derecho en Documento > Mapa de Relaciones',
              simulatorArchetype: 'relationship-map'
            },
            simulatorMission: {
              title: 'Misión de Laboratorio: Auditoría de Cadena Documental',
              description: 'Ingresa al simulador, localiza una orden de venta cerrada y abre el Mapa de Relaciones para auditar los documentos hijos (entregas y facturas).',
              stepByStep: [
                '1. Abre la ventana "Orden de Venta" en el simulador.',
                '2. Utiliza la tecla de navegación "Último Registro" en la barra de herramientas.',
                '3. Haz clic derecho sobre el formulario y selecciona "Mapa de Relaciones".',
                '4. Observa cómo la orden de venta se conecta con la entrega y la factura.',
                '5. Haz doble clic sobre la cajita de la "Factura" para navegar directamente a ella.'
              ],
              validationCriteria: 'Comprensión cabal de la trazabilidad documental y navegación entre nodos del mapa de relaciones.',
              targetModule: 'Ventas - Clientes'
            },
            quiz: [
              {
                question: '¿Qué significa que una caja de documento en el Mapa de Relaciones tenga una línea roja transversal?',
                options: [
                  'Que el documento contiene un virus o script malicioso.',
                  'Que el documento se encuentra en estado Cerrado o fue completamente arrastrado a un documento posterior.',
                  'Que el documento está pendiente de aprobación por la gerencia.',
                  'Que el cliente se declaró en quiebra.'
                ],
                correctIndex: 1,
                explanation: 'La línea roja diagonal simboliza que el documento está cerrado porque todo su contenido y cantidad fue procesado en etapas posteriores.'
              },
              {
                question: '¿Cómo puede un auditor comprobar qué usuario modificó un precio en un pedido y en qué fecha ocurrió?',
                options: [
                  'Consultando las redes sociales de los empleados.',
                  'Mediante Herramientas > Registro de Modificaciones en el documento.',
                  'Borrando el pedido y creándolo de nuevo.',
                  'Abriendo el panel de control de Windows.'
                ],
                correctIndex: 1,
                explanation: 'El Registro de Modificaciones almacena un historial inmutable de cambios con usuario, timestamp y los valores anteriores vs nuevos.'
              },
              {
                question: '¿Qué vista del Mapa de Relaciones permite ver el asiento contable (asiento de diario) vinculado a una Entrega de mercancía?',
                options: [
                  'Vista de Estructura de Artículos.',
                  'Vista de Partidas Contables Relacionadas.',
                  'Vista de Nómina de Empleados.',
                  'Vista de Tipos de Cambio.'
                ],
                correctIndex: 1,
                explanation: 'Al seleccionar "Partidas Contables Relacionadas" en el combo del mapa, se muestran los asientos automáticos asociados a la transacción.'
              }
            ],
            relatedManuals: [
              { id: 'tb1000-02-mapa-relaciones-trazabilidad-documental', title: 'Manual 02: Mapa de Relaciones', summary: 'Metodología completa de auditoría de documentos, enlaces base y vínculos de destino.' }
            ]
          }
        ]
      },
      {
        id: 'curso-fund-02',
        code: 'CUR-FND-02',
        title: 'Gestión Maestra de Negocios y Estructura de Precios',
        shortTitle: 'Maestros OCRD, OITM & Precios',
        description: 'Fichas de clientes y proveedores, catálogo de artículos con unidades de medida y jerarquía de listas de precios.',
        durationHours: 22,
        level: 'Básico',
        classes: [
          {
            id: 'clase-fund-05',
            number: 5,
            title: 'Maestro de Socios de Negocios (OCRD): Clientes, Proveedores y Condiciones Crediticias',
            durationMin: 40,
            level: 'Básico',
            courseId: 'curso-fund-02',
            courseTitle: 'Gestión Maestra de Negocios y Estructura de Precios',
            careerId: 'carrera-fundamentos',
            careerTitle: 'Fundamentos Operativos, Navegación y Núcleo Maestro ERP',
            objectives: [
              'Comprender la tabla maestra OCRD y los 3 tipos de Socios de Negocios: Clientes, Proveedores y Leads.',
              'Parametrizar direcciones fiscales, direcciones de entrega y personas de contacto.',
              'Definir límites de crédito, límites de compromiso y listas de precios por defecto en la solapa Condiciones de Pago.'
            ],
            businessScenario: 'OEC Computers firma un contrato de distribución mayorista con una nueva cadena retail llamada "TecnoStore S.A.". El departamento de créditos autorizó una línea de 50,000 USD a 45 días plazo con descuento financiero del 2% por pronto pago. El estudiante debe dar de alta el cliente configurando estos parámetros de compliance.',
            theoryContent: `### 1. El Concepto Unificado de Socio de Negocios (Business Partner)
A diferencia de otros sistemas que tienen módulos fragmentados para clientes y proveedores, SAP Business One unifica todas las entidades comerciales en la tabla maestra **\`OCRD\`**:
- **Cliente (\`C\`):** Destinatario de ventas y cobros.
- **Proveedor (\`S\`):** Emisor de compras y pagos.
- **Lead / Prospecto (\`L\`):** Cliente potencial para cotizaciones y pipeline de ventas que aún no tiene historial contable.

### 2. Estructura de la Ficha Maestra
- **Cabecera:** Código de SN (ej. \`C20000\`), Nombre, Nombre Extranjero, Grupo de SN y Moneda (Local, Moneda Extranjera o Todas las Monedas).
- **Solapa General:** Datos telefónicos, e-mails, representantes de ventas y canales de distribución.
- **Solapa Personas de Contacto:** Director de Compras, Tesorero, etc., con teléfonos directos y correos electrónicos.
- **Solapa Direcciones:** Permite registrar múltiples direcciones tipo *Destino de Factura (Bill-to)* y *Destino de Entrega (Ship-to)* con códigos postales y distritos.
- **Solapa Condiciones de Pago:** 
  - Define la lista de precios asignada al cliente.
  - Define el límite de crédito (Credit Limit) y límite de compromiso (Commitment Limit = Saldo + Pedidos abiertos).
  - Define las condiciones de pago (ej. *Neto a 30 días*, *Contado*).
- **Solapa Finanzas:** Cuentas asociadas de control (Cuentas por Cobrar \`112000\` o Cuentas por Pagar \`211000\`).`,
            checkpoint: {
              timestampMin: 22,
              pauseMessage: '¡Laboratorio guiado por Master B1! Vamos a abrir la ficha de un Socio de Negocios y verificar sus límites crediticios.',
              teacherAudioPrompt: 'Hola de nuevo. Un dato maestro mal parametrizado paraliza a toda la empresa. Abre el Simulador SAP y dirígete al módulo Socios de Negocios > Datos Maestros de Socio de Negocios.',
              simulatorTask: 'Abre la ventana Datos Maestros de Socio de Negocios y busca el cliente Maxi-Teq (C20000).',
              simulatorMenuPath: 'Socios de Negocios > Datos Maestros de Socio de Negocios',
              simulatorArchetype: 'business-partners'
            },
            simulatorMission: {
              title: 'Misión de Laboratorio: Alta y Configuración de un Socio de Negocios',
              description: 'Accede al módulo Socios de Negocios, consulta al cliente C20000 e inspecciona su solapa de Condiciones de Pago y su saldo de cuenta actual.',
              stepByStep: [
                '1. Abre el simulador y haz clic en Socios de Negocios > Datos Maestros de Socio de Negocios.',
                '2. Presiona Ctrl + F o haz clic en Buscar.',
                '3. Ingresa "C20000" en el campo Código y presiona Enter.',
                '4. Haz clic en la solapa "Condiciones de Pago" y verifica el Límite de Crédito asignado.',
                '5. Observa el campo "Saldo de cuenta" en la cabecera e interactúa con su flecha naranja.'
              ],
              validationCriteria: 'Identificación correcta de los campos críticos de crédito y condiciones de pago en OCRD.',
              targetModule: 'Socios de Negocios'
            },
            quiz: [
              {
                question: '¿Qué tabla principal de la base de datos de SAP Business One almacena la información de Clientes y Proveedores?',
                options: [
                  'OITM',
                  'OCRD',
                  'OINV',
                  'OJDT'
                ],
                correctIndex: 1,
                explanation: 'La tabla OCRD (Order Customer/Vendor Master Data) almacena todos los socios de negocios en el esquema de base de datos.'
              },
              {
                question: '¿Qué diferencia a un Socio de Negocios tipo "Lead" de un "Cliente"?',
                options: [
                  'Un Lead solo puede ser utilizado en campañas de marketing y ofertas, pero no se le puede emitir una Entrega ni una Factura con impacto contable.',
                  'Un Lead no tiene código de identificación.',
                  'Un Lead solo puede comprar en efectivo.',
                  'No existe ninguna diferencia.'
                ],
                correctIndex: 0,
                explanation: 'Los Leads permiten gestionar el ciclo preventa; cuando deciden comprar, su tipo se actualiza a Cliente para habilitar entregas y facturación.'
              },
              {
                question: 'Si un cliente supera su "Límite de Compromiso", ¿qué documentos suma el sistema para validar el bloqueo?',
                options: [
                  'Únicamente las facturas ya vencidas.',
                  'El saldo actual de cuenta más el importe de los pedidos y entregas abiertas pendientes de facturar.',
                  'Solo las cotizaciones enviadas por correo.',
                  'El capital social de la empresa.'
                ],
                correctIndex: 1,
                explanation: 'El Límite de Compromiso es más estricto que el de crédito: suma la deuda real en libros contables más el compromiso de stock en órdenes abiertas.'
              }
            ],
            relatedManuals: [
              { id: 'tb1000-06-maestro-socios-negocios-ocrd', title: 'Manual 06: Socios de Negocios OCRD', summary: 'Guía exhaustiva para clientes, proveedores, condiciones de pago e informes de antigüedad de saldos.' }
            ]
          },
          {
            id: 'clase-fund-06',
            number: 6,
            title: 'Maestro de Artículos (OITM): Tipos de Artículo, Grupos y Cuentas Contables',
            durationMin: 40,
            level: 'Básico',
            courseId: 'curso-fund-02',
            courseTitle: 'Gestión Maestra de Negocios y Estructura de Precios',
            careerId: 'carrera-fundamentos',
            careerTitle: 'Fundamentos Operativos, Navegación y Núcleo Maestro ERP',
            objectives: [
              'Distinguir las 3 casillas maestras: Artículo de Venta, Artículo de Compra y Artículo de Inventario.',
              'Entender el rol del Grupo de Artículos en la determinación contable y márgenes comerciales.',
              'Gestionar Unidades de Medida (UoM) y grupos de unidades (Caja, Pallet, Unidad individual).'
            ],
            businessScenario: 'OEC Computers amplía su portafolio incorporando "Servicios de Instalación de Redes" (artículo no almacenable) y "Monitores LED 27 pulgadas" (artículo almacenable con control de garantía y compras por palet de 20 unidades). El estudiante debe clasificar correctamente estos artículos para no corromper la contabilidad de inventario.',
            theoryContent: `### 1. Las Tres Casillas Críticas del Maestro de Artículos (OITM)
En la parte superior derecha de la ficha de cualquier artículo existen 3 casillas de verificación que definen su naturaleza operativa:
1. **Artículo de Inventario (Inventory Item):** Al activarse, cada movimiento genera stock físico y registros en la cuenta contable de Existencias. Si se desmarca, se comporta como un servicio o gasto directo.
2. **Artículo de Venta (Sales Item):** Habilita al producto para aparecer en cotizaciones, pedidos y facturas de clientes.
3. **Artículo de Compra (Purchase Item):** Habilita al producto para solicitudes de compra, órdenes a proveedores y recepciones de mercancía.

### 2. Grupos de Artículos y Regla de Determinación
El campo **Grupo de Artículos** (tabla \`OITB\`) es el eje central de la configuración:
- Permite agrupar productos con propiedades homogéneas (ej. *Laptops*, *Accesorios*, *Servicios*).
- Define por defecto el **Método de Valoración** (Promedio Ponderado, FIFO o Coste Estándar).
- Si la empresa utiliza la opción de fijar cuentas contables por Grupo de Artículos, todos los productos heredan automáticamente las cuentas de Costo de Ventas, Ingreso por Ventas y Cuenta de Stock.

### 3. Grupos de Unidades de Medida (UoM Groups)
SAP B1 10.0 cuenta con un motor flexible de unidades:
- **Unidad de Medida Base:** Ej. \`Unidad\` (la unidad mínima en la que se cuenta el stock).
- **Unidad de Medida de Compra:** Ej. \`Caja x 12\` o \`Pallet x 144\`. Al comprar 1 caja, el sistema ingresa automáticamente 12 unidades al inventario.
- **Unidad de Medida de Venta:** Ej. \`Pack x 2\` con factor de conversión automático.`,
            checkpoint: {
              timestampMin: 21,
              pauseMessage: '¡Pausa de Cátedra con Master B1! Vamos a inspeccionar el Maestro de Artículos y sus casillas de inventario.',
              teacherAudioPrompt: 'Hola de nuevo. Soy Master B1. Si marcas un artículo de servicios como "Artículo de Inventario", generarás un error grave en el balance general. Abre el simulador y verifica la ficha del artículo A00001.',
              simulatorTask: 'Abre Inventario > Datos Maestros de Artículo y revisa las casillas Inventario, Venta y Compra.',
              simulatorMenuPath: 'Inventario > Datos Maestros de Artículo',
              simulatorArchetype: 'items-master'
            },
            simulatorMission: {
              title: 'Misión de Laboratorio: Parametrización del Catálogo de Productos',
              description: 'Abre la ventana de Datos Maestros de Artículo en el simulador, localiza el artículo A00001 e inspecciona sus solapas de Datos de Inventario y Datos de Ventas.',
              stepByStep: [
                '1. En el simulador, haz clic en Inventario > Datos Maestros de Artículo.',
                '2. Presiona Buscar y localiza el artículo "A00001" (Servidor JB).',
                '3. Fíjate en las casillas: Artículo de Inventario, Venta y Compra.',
                '4. Haz clic en la solapa "Datos de Inventario" para consultar el stock En Stock, Comprometido y Solicitado.',
                '5. Verifica el método de valoración asignado.'
              ],
              validationCriteria: 'Diferenciación exacta entre artículos de inventario vs artículos de servicio y lectura de stock proyectado.',
              targetModule: 'Inventario'
            },
            quiz: [
              {
                question: 'Si una empresa vende un servicio de consultoría o transporte que no se almacena en bodegas, ¿cómo debe configurarse su ficha en OITM?',
                options: [
                  'Debe marcarse como Artículo de Inventario y de Compra.',
                  'Debe marcarse como Artículo de Venta, pero desmarcarse obligatoriamente la casilla "Artículo de Inventario".',
                  'No se pueden crear servicios en SAP Business One.',
                  'Debe crearse como un Socio de Negocios.'
                ],
                correctIndex: 1,
                explanation: 'Los servicios no mueven inventario físico ni generan costo de existencias en el balance, por lo que nunca deben tener marcada la casilla de Inventario.'
              },
              {
                question: 'En la solapa Datos de Inventario, ¿a qué equivale la fórmula del "Stock Disponible"?',
                options: [
                  'Disponible = En Stock - Comprometido + Solicitado',
                  'Disponible = En Stock + Comprometido',
                  'Disponible = Solicitado - Comprometido',
                  'Disponible = En Stock x 2'
                ],
                correctIndex: 0,
                explanation: 'El Stock Disponible (ATP básico) es el inventario real en almacén restando lo ya reservado en pedidos de clientes y sumando lo que está por llegar en órdenes de compra.'
              },
              {
                question: '¿Qué tabla almacena las definiciones generales de los Grupos de Artículos?',
                options: [
                  'OITB',
                  'OCRD',
                  'OINV',
                  'OPOR'
                ],
                correctIndex: 0,
                explanation: 'La tabla OITB almacena los grupos de artículos, sus métodos de costeo por defecto y sus vínculos de determinación contable.'
              }
            ],
            relatedManuals: [
              { id: 'tb1000-07-maestro-articulos-oitm-grupos', title: 'Manual 07: Maestro de Artículos OITM', summary: 'Configuración técnica profunda de unidades de medida, embalajes y catálogo maestro.' }
            ]
          },
          {
            id: 'clase-fund-07',
            number: 7,
            title: 'Jerarquía de Precios: Listas Base, Descuentos por Período y Cantidad, y Precios Especiales',
            durationMin: 45,
            level: 'Básico',
            courseId: 'curso-fund-02',
            courseTitle: 'Gestión Maestra de Negocios y Estructura de Precios',
            careerId: 'carrera-fundamentos',
            careerTitle: 'Fundamentos Operativos, Navegación y Núcleo Maestro ERP',
            objectives: [
              'Comprender la arquitectura jerárquica de 4 niveles de precios en SAP Business One.',
              'Configurar Listas de Precios base derivadas con factores multiplicadores.',
              'Implementar Descuentos por Período y Cantidad y Precios Especiales para Socios de Negocios específicos.'
            ],
            businessScenario: 'OEC Computers maneja una Lista de Precios de Costo y desea que la "Lista Mayorista" tenga un margen del 25% automático (Factor 1.25) y la "Lista Distribuidor" un margen del 15% (Factor 1.15). Además, para el cliente clave Maxi-Teq se pactó un precio especial fijo en memorias RAM siempre que compre más de 50 unidades.',
            theoryContent: `### 1. La Jerarquía de Determinación de Precios en SAP B1
Cuando un usuario crea una línea en una cotización o factura, el sistema busca el precio unitario siguiendo un orden de prioridad descendente estricto (de lo más específico a lo más genérico):
1. **Prioridad 1: Precios Especiales para Socios de Negocios:** Precios personalizados asignados a un cliente específico para un artículo puntual, con o sin rangos de fechas.
2. **Prioridad 2: Grupos de Descuento:** Reglas de descuento por fabricante, grupo de artículos o propiedades de socio de negocios.
3. **Prioridad 3: Descuentos por Período y Cantidad:** Rebajas por volumen (ej. de 1 a 9 unidades a 100 USD; de 10 a 49 a 90 USD; más de 50 a 80 USD) vigentes durante una campaña promocional.
4. **Prioridad 4: Lista de Precios Asignada al Socio de Negocios:** La lista de precios general configurada en la solapa Condiciones de Pago del cliente (tabla \`OPLN\`).

### 2. Listas de Precios Derivadas y Factores
SAP B1 permite crear hasta 10 listas de precios estándar:
- Se elige una **Lista de Precios Base** (por ejemplo, *Costo Estándar*).
- Se crea una lista hija (por ejemplo, *Precio al Público*) con un **Factor de 1.40**.
- Cuando el costo del producto cambia, el precio de venta se actualiza automáticamente multiplicando por el factor sin intervención manual.

### 3. Redondeo y Monedas de Lista
Cada lista de precios puede definirse en Moneda Principal (ej. USD) con precios secundarios en moneda local o multidivisa, permitiendo reglas de redondeo comercial al decimal más cercano o al entero superior.`,
            checkpoint: {
              timestampMin: 24,
              pauseMessage: '¡Profesor Master B1! Vamos a inspeccionar cómo opera la cascada de precios en el simulador.',
              teacherAudioPrompt: 'Hola de nuevo. La jerarquía de precios es una de las preguntas fijas del examen de certificación SAP. Abre el simulador y accede a Inventario > Listas de Precios.',
              simulatorTask: 'Abre la ventana Listas de Precios en el módulo Inventario y analiza los factores configurados.',
              simulatorMenuPath: 'Inventario > Listas de Precios > Listas de Precios',
              simulatorArchetype: 'price-lists'
            },
            simulatorMission: {
              title: 'Misión de Laboratorio: Análisis de Factores en Listas de Precios',
              description: 'Ingresa al simulador, abre la ventana de Listas de Precios y verifica cómo las listas comerciales se derivan de la lista base con factores multiplicadores.',
              stepByStep: [
                '1. En el simulador, haz clic en Inventario > Listas de Precios > Listas de Precios.',
                '2. Observa la lista número 1 (Lista Base de Compra) y la lista número 2 (Lista Regular de Ventas).',
                '3. Fíjate en la columna "Factor" y "Lista de precios base".',
                '4. Haz doble clic en el número de fila de la Lista 2 para inspeccionar los precios por artículo.',
                '5. Comprueba cómo el sistema calcula automáticamente el precio de venta a partir del factor.'
              ],
              validationCriteria: 'Comprensión de la derivación automática de precios por factores y la cascada de 4 niveles.',
              targetModule: 'Inventario'
            },
            quiz: [
              {
                question: 'Si un cliente tiene asignada la Lista de Precios 3, pero tiene configurado un "Precio Especial para Socio de Negocios" para ese producto, ¿cuál precio aplicará SAP B1?',
                options: [
                  'Aplicará el precio de la Lista 3.',
                  'Aplicará el Precio Especial para Socio de Negocios, ya que tiene la máxima prioridad en la jerarquía.',
                  'El sistema se bloqueará y arrojará un error de inconsistencia.',
                  'Aplicará el promedio entre ambos.'
                ],
                correctIndex: 1,
                explanation: 'Los Precios Especiales para Socios de Negocios ocupan la prioridad 1 en la cascada de precios de SAP Business One.'
              },
              {
                question: '¿Qué sucede si una lista de precios "Ventas Mayoristas" tiene como lista base el "Costo de Compra" con un Factor de 1.30 y el costo del artículo sube de 100 USD a 120 USD?',
                options: [
                  'El precio mayorista se mantiene en 130 USD hasta que el usuario lo actualice manualmente.',
                  'El precio mayorista sube automáticamente a 156 USD (120 x 1.30).',
                  'Se genera una nota de crédito automática.',
                  'El artículo queda bloqueado para venta.'
                ],
                correctIndex: 1,
                explanation: 'Al estar vinculada con un factor multiplicador, cualquier modificación en la lista base recalcula dinámicamente el precio de la lista derivada.'
              },
              {
                question: '¿En qué solapa de la ficha del Socio de Negocios se asigna la Lista de Precios predeterminada para sus compras o ventas?',
                options: [
                  'Solapa General',
                  'Solapa Direcciones',
                  'Solapa Condiciones de Pago',
                  'Solapa Propiedades'
                ],
                correctIndex: 2,
                explanation: 'En Condiciones de Pago se define la lista de precios asignada al cliente, además de sus plazos y límites de crédito.'
              }
            ],
            relatedManuals: [
              { id: 'tb1000-08-listas-precios-descuentos-condiciones', title: 'Manual 08: Listas de Precios', summary: 'Matrices de descuentos por volumen, precios en moneda extranjera y jerarquías comerciales.' }
            ]
          },
          {
            id: 'clase-fund-08',
            number: 8,
            title: 'Laboratorio Integrador: Alta Integral de Compañía y Catálogo Comercial',
            durationMin: 45,
            level: 'Básico',
            courseId: 'curso-fund-02',
            courseTitle: 'Gestión Maestra de Negocios y Estructura de Precios',
            careerId: 'carrera-fundamentos',
            careerTitle: 'Fundamentos Operativos, Navegación y Núcleo Maestro ERP',
            objectives: [
              'Consolidar de punta a punta los conocimientos del Núcleo Operativo de SAP Business One.',
              'Ejecutar en el simulador un circuito completo: usuario, cliente, artículo y validación en lista de precios.',
              'Aprobar el hito curricular para habilitar la Micro-Certificación y Diploma de Carrera 1.'
            ],
            businessScenario: 'Caso de Grado Carrera 1: OEC Computers apertura una nueva sucursal en Quito. Como consultor a cargo, debes verificar la creación del cliente corporativo C30000, vincular el artículo de tecnología LM4029 con control de stock, verificar su precio en la lista mayorista y comprobar que la orden de venta quede lista para el equipo comercial.',
            theoryContent: `### 1. El Flujo de Trabajo Integrado del Consultor B1
En este laboratorio integrador ponemos a prueba la interacción sinérgica de todos los elementos estudiados en la Carrera 1:
\`\`\`mermaid
graph LR
    U[1. Usuario & Permisos] --> SN[2. Socio de Negocios OCRD]
    SN --> PR[3. Lista de Precios & Crédito]
    IT[4. Maestro Artículos OITM] --> OV[5. Orden de Venta OV]
    PR --> OV
    OV --> MR[6. Mapa de Relaciones]
\`\`\`

### 2. Puntos Clave de Control de Calidad Operativo
Antes de liberar una transacción al circuito contable y logístico:
- **Verificar que el SN no esté bloqueado** y tenga asignada su moneda y lista de precios adecuada.
- **Verificar que los artículos tengan marcado el almacén correcto** y no violen las políticas de stock negativo.
- **Comprobar la coherencia en la fecha de contabilización vs fecha de entrega.**`,
            checkpoint: {
              timestampMin: 25,
              pauseMessage: '¡Profesor Master B1! Iniciamos la evaluación integradora en el simulador.',
              teacherAudioPrompt: '¡Felicidades por llegar al laboratorio integrador de la Carrera 1! Soy Master B1. Ahora es tu turno de demostrar que dominas el núcleo de SAP Business One. Sigue la misión en el simulador.',
              simulatorTask: 'Ejecuta el circuito integrador: abre la Orden de Venta y selecciona cliente y artículo para validar precios.',
              simulatorMenuPath: 'Ventas - Clientes > Orden de Venta',
              simulatorArchetype: 'integrated-core-lab'
            },
            simulatorMission: {
              title: 'Misión Integradora de Carrera 1: Circuito Maestro Completo',
              description: 'Abre el simulador, crea una orden de venta de prueba con el cliente C20000, añade el artículo A00001, verifica el precio calculado y consulta el mapa de relaciones preliminar.',
              stepByStep: [
                '1. Abre el simulador SAP B1 y ve a Ventas - Clientes > Orden de Venta.',
                '2. Selecciona al cliente Maxi-Teq (C20000).',
                '3. En la tabla de artículos, añade el producto A00001 con cantidad 5.',
                '4. Observa cómo el precio unitario y el total de la línea se cargan automáticamente desde la lista de precios.',
                '5. Revisa la solapa Logística y Finanzas para certificar las condiciones de pago.'
              ],
              validationCriteria: 'Generación correcta de documento de ventas respetando maestros de SN, artículos y listas de precios.',
              targetModule: 'Ventas - Clientes'
            },
            quiz: [
              {
                question: 'En un entorno productivo de SAP B1, ¿qué sucede si se intenta crear una Orden de Venta para un cliente cuyo saldo más el pedido supera su Límite de Crédito y la empresa tiene activa la alerta de bloqueo?',
                options: [
                  'El sistema bloquea la creación del documento o detona un procedimiento de aprobación gerencial.',
                  'El sistema borra al cliente de la base de datos.',
                  'El documento se envía a la papelera de reciclaje.',
                  'El sistema convierte la venta en una donación.'
                ],
                correctIndex: 0,
                explanation: 'Las parametrizaciones de documento permiten bloquear la transacción o enviar el documento a un flujo de aprobación formal cuando se vulnera el límite de crédito.'
              },
              {
                question: '¿Cuál es la función del campo "Moneda del SN" en la cabecera de la ficha del Socio de Negocios?',
                options: [
                  'Define si el socio solo puede operar en Moneda Local, en una Moneda Extranjera específica o en "Todas las Monedas".',
                  'Indica el sueldo de los empleados del cliente.',
                  'No tiene ningún efecto en los documentos.',
                  'Solo sirve para fines estadísticos en reportes de texto.'
                ],
                correctIndex: 0,
                explanation: 'La moneda asignada restringe las divisas en las que se le pueden facturar o recibir cobros a dicho socio comercial.'
              },
              {
                question: 'Al culminar exitosamente el circuito de la Carrera 1, ¿qué credenciales puede solicitar el alumno?',
                options: [
                  'Solo una carta informal sin validez.',
                  'El Diploma Oficial de Operador de Negocios SAP B1 y las Micro-Certificaciones MC-B1-01 y MC-B1-02 con código de verificación QR y firma académica.',
                  'Una licencia de desarrollador de videojuegos.',
                  'Ninguna acreditación.'
                ],
                correctIndex: 1,
                explanation: 'La aprobación de las clases de la Carrera 1 acredita las competencias oficiales del Núcleo ERP con diploma y hash criptográfico verificable.'
              }
            ],
            relatedManuals: [
              { id: 'tb1000-01-fundamentos-navegacion-entorno-fiori', title: 'Manual 01: Fundamentos y Fiori', summary: 'Repaso general de la arquitectura.' },
              { id: 'tb1000-06-maestro-socios-negocios-ocrd', title: 'Manual 06: Socios de Negocios', summary: 'Repaso de condiciones crediticias.' },
              { id: 'tb1000-07-maestro-articulos-oitm-grupos', title: 'Manual 07: Maestro de Artículos', summary: 'Repaso de catálogo de productos.' }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // CARRERA 2: FINANZAS CORPORATIVAS, CONTABILIDAD NIIF Y TESORERÍA
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'carrera-finanzas',
    code: 'B1-CAR-02',
    number: 2,
    title: 'Finanzas Corporativas, Contabilidad NIIF y Control de Gestión',
    shortTitle: 'Finanzas NIIF & Tesorería',
    badge: 'Finanzas & Compliance',
    colorTheme: 'blue',
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    targetAudience: 'Estudiantes de Contaduría, Contralores Financieros, Analistas Contables, Auditores y Consultores Financieros SAP.',
    careerRole: 'Especialista Financiero y Tesorero SAP B1',
    totalHours: 90,
    diplomaTitle: 'Diploma Oficial de Especialista en Finanzas y Control de Gestión SAP B1',
    diplomaIssuanceFeeUSD: 69,
    description: 'Domina la arquitectura contable bajo estándar internacional NIIF en SAP Business One: Plan de Cuentas segmentado, determinación automática de cuentas de mayor (G/L), asientos manuales y periódicos, gestión bancaria integral, asistente de pagos masivos (Payment Wizard), conciliaciones bancarias, activos fijos y contabilidad de costos multidimensional.',
    objectives: [
      'Diseñar y administrar el Plan de Cuentas en 5 niveles bajo normas NIIF / IFRS.',
      'Configurar las reglas de determinación contable automática en compras, ventas e inventario.',
      'Controlar asientos de diario manuales (OJDT), contabilizaciones periódicas y modelos de asiento.',
      'Operar con rigor el flujo bancario: cobros recibidos, pagos efectuados y depósitos.',
      'Ejecutar el Asistente de Pagos Masivos a Proveedores y conciliaciones bancarias electrónicas.',
      'Administrar el ciclo completo de Activos Fijos con cálculo de amortización automática.',
      'Gestionar centros de beneficio, normas de reparto y emitir Balances y Estados de Resultados.'
    ],
    skillsTagged: ['Plan de Cuentas NIIF', 'Determinación G/L', 'Payment Wizard', 'Conciliación Bancaria', 'Activos Fijos', 'Costos'],
    courses: [
      {
        id: 'curso-fin-01',
        code: 'CUR-FIN-01',
        title: 'Arquitectura Contable NIIF y Determinación Automática G/L',
        shortTitle: 'Plan de Cuentas & Determinación G/L',
        description: 'Estructuración contable internacional, parametrización del motor de mayor y contabilizaciones automáticas vs manuales.',
        durationHours: 30,
        level: 'Intermedio',
        classes: [
          {
            id: 'clase-fin-01',
            number: 9,
            title: 'Diseño e Ingeniería del Plan de Cuentas: Estructura en 5 Niveles y Cuentas de Mayor',
            durationMin: 45,
            level: 'Intermedio',
            courseId: 'curso-fin-01',
            courseTitle: 'Arquitectura Contable NIIF y Determinación Automática G/L',
            careerId: 'carrera-finanzas',
            careerTitle: 'Finanzas Corporativas, Contabilidad NIIF y Control de Gestión',
            objectives: [
              'Comprender la estructura de cajones contables en SAP B1 (Activo, Pasivo, Patrimonio, Ingresos, Costos, Gastos).',
              'Distinguir entre Cuentas de Título (agrupadoras no imputables) y Cuentas de Mayor / Activas (imputables).',
              'Aprender a definir Cuentas Asociadas (Reconciliation Accounts) para Clientes y Proveedores.'
            ],
            businessScenario: 'OEC Computers debe homologar su contabilidad local al estándar internacional NIIF (IFRS). La Gerencia Financiera encomienda al consultor reestructurar el Plan de Cuentas creando la rama de "Activos por Derecho de Uso" y verificando que ninguna cuenta de título admita asientos contables directos por error humano.',
            theoryContent: `### 1. Los 8 Cajones Estándar del Plan de Cuentas
En SAP Business One, el Plan de Cuentas (tabla \`OACT\`) está organizado de forma fija en **cajones** (Drawers) representados por pestañas verticales a la derecha de la ventana:
1. **Activo (1):** Recursos controlados por la entidad.
2. **Pasivo (2):** Obligaciones presentes.
3. **Patrimonio Neto (3):** Capital social y reservas.
4. **Ingresos Ordinarios (4):** Ventas de bienes y servicios.
5. **Costos de Ventas (5):** Costo de mercancía vendida y producción.
6. **Gastos de Operación (6):** Gastos de administración, comercialización y financieros.
7. **Otros Ingresos y Gastos (7):** Ganancias o pérdidas extraordinarias.
8. **Impuestos y Cierre (8):** Cuentas de orden y liquidación fiscal.

### 2. Jerarquía de 5 Niveles: Títulos vs Cuentas Activas
- **Nivel 1:** El Cajón mismo (ej. \`10000000\` Activo).
- **Nivel 2, 3 y 4:** Cuentas de Título (en color **azul** o **negrita**). Agrupan subtotales para balances y **no permiten imputaciones directas**.
- **Nivel 5:** Cuentas de Mayor Activas (en color **verde** o normal). Son las únicas cuentas donde se pueden registrar transacciones contables.

### 3. Cuentas Asociadas (Reconciliation Accounts)
En SAP B1, **nunca se hace un asiento manual directo contra la cuenta de Clientes o Proveedores sin indicar el código del Socio de Negocios**.
- Al crear una cuenta en el activo corriente (ej. \`112001 - Clientes Nacionales\`), se marca la casilla **Cuenta Asociada**.
- Esto garantiza que el saldo del libro mayor contable coincida al 100% con la suma de los saldos individuales de la cartera en el módulo auxiliar de Socios de Negocios.`,
            checkpoint: {
              timestampMin: 22,
              pauseMessage: '¡Profesor Master B1! Inspeccionemos el Plan de Cuentas en el simulador.',
              teacherAudioPrompt: '¡Hola futuros contralores y consultores! Soy Master B1. El Plan de Cuentas es el cimiento de todo el edificio financiero. Abre el simulador y entra a Finanzas > Plan de Cuentas.',
              simulatorTask: 'Abre Finanzas > Plan de Cuentas e inspecciona los cajones Activo y Pasivo.',
              simulatorMenuPath: 'Finanzas > Plan de Cuentas',
              simulatorArchetype: 'chart-of-accounts'
            },
            simulatorMission: {
              title: 'Misión de Laboratorio: Exploración del Plan de Cuentas NIIF',
              description: 'Abre la ventana Plan de Cuentas en el simulador, navega por el cajón de Activos e identifica la diferencia visual entre cuentas de título y cuentas activas.',
              stepByStep: [
                '1. En el simulador, haz clic en Finanzas > Plan de Cuentas.',
                '2. Haz clic en la pestaña "Activo" en el extremo derecho.',
                '3. Despliega la rama Activo Corriente > Efectivo y Equivalentes de Efectivo.',
                '4. Haz clic sobre una cuenta activa (ej. Caja General o Banco Pichincha) y verifica su saldo.',
                '5. Observa la casilla "Cuenta Asociada" en las cuentas por cobrar a clientes.'
              ],
              validationCriteria: 'Comprensión de la jerarquía de 5 niveles y del rol de las cuentas asociadas de cartera.',
              targetModule: 'Finanzas'
            },
            quiz: [
              {
                question: '¿Qué sucede si un usuario intenta ingresar un asiento contable manual digitando el código de una Cuenta de Título (Nivel 2 o 3)?',
                options: [
                  'El sistema lo permite sin ningún inconveniente.',
                  'El sistema rechaza la operación porque las Cuentas de Título son solo agrupadoras y no admiten contabilizaciones.',
                  'El asiento se divide automáticamente en todas las cuentas hijas.',
                  'Se bloquea la base de datos de la empresa.'
                ],
                correctIndex: 1,
                explanation: 'Solo las cuentas activas (de último nivel) admiten contabilización; las de título son exclusivamente para estructurar balances consolidados.'
              },
              {
                question: '¿Por qué las cuentas de Clientes y Proveedores deben definirse como "Cuentas Asociadas"?',
                options: [
                  'Para que no paguen impuestos.',
                  'Para garantizar la conciliación permanente entre el Libro Mayor Contable y el módulo auxiliar de cartera de Socios de Negocios.',
                  'Porque solo los bancos pueden ser cuentas normales.',
                  'Para ocultarlas a los inspectores fiscales.'
                ],
                correctIndex: 1,
                explanation: 'Las cuentas asociadas vinculan cada movimiento contable a un Socio de Negocios específico (OCRD), impidiendo descuadres entre contabilidad y cartera.'
              },
              {
                question: '¿Cuántos cajones principales estructuran el Plan de Cuentas estándar en SAP Business One?',
                options: [
                  '3 cajones.',
                  '8 cajones.',
                  '12 cajones.',
                  '50 cajones.'
                ],
                correctIndex: 1,
                explanation: 'SAP B1 organiza su plan contable en hasta 8 cajones universales: 3 de balance patrimonial, 4 de resultados y 1 de cierre/impuestos.'
              }
            ],
            relatedManuals: [
              { id: 'tb1000-09-plan-cuentas-niif-determinacion-gl', title: 'Manual 09: Plan de Cuentas NIIF', summary: 'Arquitectura contable internacional, moneda de cuenta y estructuración en 5 niveles.' }
            ]
          },
          {
            id: 'clase-fin-02',
            number: 10,
            title: 'El Motor Contable: Determinación Automática de Cuentas G/L en Ventas e Inventarios',
            durationMin: 50,
            level: 'Intermedio',
            courseId: 'curso-fin-01',
            courseTitle: 'Arquitectura Contable NIIF y Determinación Automática G/L',
            careerId: 'carrera-finanzas',
            careerTitle: 'Finanzas Corporativas, Contabilidad NIIF y Control de Gestión',
            objectives: [
              'Dominar la ventana de Determinación de Cuentas de Mayor (G/L Account Determination).',
              'Comprender cómo se disparan los asientos de Debe y Haber sin que los vendedores o bodegueros conozcan de contabilidad.',
              'Aprender a parametrizar la determinación contable por Almacén, por Grupo de Artículos o a nivel de Artículo.'
            ],
            businessScenario: 'Al emitir una Entrega de Mercancía en OEC Computers, el sistema debe acreditar la cuenta de inventario (140101) y debitar el Costo de Ventas (510101). Luego, al emitir la Factura, debe debitar a Clientes (112001) y acreditar Ingreso por Ventas (410101) e IVA por Pagar (210701). El consultor debe auditar que las cuentas estén correctamente mapeadas.',
            theoryContent: `### 1. La Magia de la Contabilización Automática en el ERP
En SAP Business One, los usuarios operativos (vendedores, jefes de compras, almacenistas) no ingresan códigos contables. Es el **Motor de Determinación de Cuentas de Mayor** (tabla \`CINF\` / \`OADP\`) el que asigna las cuentas de forma instantánea al crear cada documento.

### 2. Dónde se Parametriza la Determinación G/L
Se accede desde *Gestión > Inicialización de Sistema > Parametrizaciones de Documento > pestaña Finanzas > Determinación de Cuentas de Mayor*:
- **Pestaña Ventas:**
  - *Cuenta de Ingresos Nacionales / Extranjeros:* Se acredita al facturar.
  - *Cuenta de Descuentos sobre Ventas:* Si se otorga rebaja comercial.
  - *Impuesto sobre Ventas (IVA/VAT):* Se acredita con el impuesto repercutido.
- **Pestaña Compras:**
  - *Cuenta de Facturas Recibidas no Facturadas (Cuenta Puente EM/RF - GRPO):* Esencial en el ciclo de compras.
- **Pestaña Inventario:**
  - *Cuenta de Existencias (Stock):* Refleja el valor monetario del inventario en bodega.
  - *Costo de Ventas (COGS):* Se debita al dar salida a la mercancía por entrega de ventas.
  - *Cuenta de Ajustes / Mermas:* Para diferencias en tomas físicas de inventario.

### 3. Jerarquía de Asignación Contable
¿De dónde saca SAP la cuenta para un artículo específico?
Se configura en el campo **Fijar Cuentas de Mayor Por:**
1. **Nivel Almacén:** Cada almacén físico (ej. Bodega Principal vs Bodega Tránsito) tiene sus propias cuentas.
2. **Nivel Grupo de Artículos (Recomendado):** Los productos de ferretería van a una cuenta y los de tecnología a otra.
3. **Nivel de Artículo:** Permite excepciones individuales para productos especiales.`,
            checkpoint: {
              timestampMin: 25,
              pauseMessage: '¡Profesor Master B1! Vamos a auditar la ventana de Determinación de Cuentas de Mayor.',
              teacherAudioPrompt: 'Atención equipo contable. Si una cuenta está mal mapeada aquí, cada factura que se emita generará un descuadre en el balance general. Abre el simulador y accede a Determinación de Cuentas de Mayor.',
              simulatorTask: 'Navega a Gestión > Inicialización de Sistema > Determinación de Cuentas de Mayor y examina las pestañas Ventas e Inventario.',
              simulatorMenuPath: 'Gestión > Inicialización de Sistema > Determinación de Cuentas de Mayor',
              simulatorArchetype: 'gl-determination'
            },
            simulatorMission: {
              title: 'Misión de Laboratorio: Auditoría del Motor Contable Automático',
              description: 'Ingresa al simulador, abre la ventana Determinación de Cuentas de Mayor e inspecciona qué cuentas de ingresos e inventarios están configuradas para la empresa demo.',
              stepByStep: [
                '1. En el simulador, haz clic en Gestión > Inicialización de Sistema.',
                '2. Selecciona "Determinación de Cuentas de Mayor".',
                '3. Haz clic en la pestaña "Inventario" y ubica la fila "Cuenta de Existencias" y "Costo de las Mercancías Vendidas".',
                '4. Haz clic en la pestaña "Ventas" y verifica la "Cuenta de Ingresos Nacionales".',
                '5. Comprueba cómo cada código corresponde a una cuenta activa del Plan de Cuentas.'
              ],
              validationCriteria: 'Dominio cabal del flujo contable automático y su impacto en el Debe y Haber al operar ventas e inventario.',
              targetModule: 'Gestión'
            },
            quiz: [
              {
                question: 'Al emitir una Entrega de Mercancía a un cliente en una empresa con inventario permanente, ¿cuál es el asiento contable automático generado por SAP B1?',
                options: [
                  'Debe: Clientes / Haber: Ventas',
                  'Debe: Costo de Ventas (COGS) / Haber: Cuenta de Existencias (Inventario)',
                  'Debe: Banco / Haber: Caja',
                  'No se genera ningún asiento hasta que se emita la factura.'
                ],
                correctIndex: 1,
                explanation: 'La Entrega traslada el costo del producto del activo realizable (Inventario) a la cuenta de resultados (Costo de Ventas).'
              },
              {
                question: '¿Qué método de determinación contable es el más recomendado por las mejores prácticas de consultoría SAP?',
                options: [
                  'Por Nivel de Artículo individual para cada uno de los 50,000 productos.',
                  'Por Grupo de Artículos, estandarizando las cuentas contables por familia de producto.',
                  'Dejar todas las cuentas en blanco.',
                  'Por nombre del empleado vendedor.'
                ],
                correctIndex: 1,
                explanation: 'Determinar por Grupo de Artículos reduce drásticamente el mantenimiento y garantiza homogeneidad contable en todo el catálogo.'
              },
              {
                question: '¿Qué cuenta contable puente se utiliza temporalmente en una Entrada de Mercancías de Compra (GRPO) antes de recibir la factura del proveedor?',
                options: [
                  'Cuenta de Capital Social.',
                  'Cuenta de Mercancías en Tránsito / Provisiones de Compra (EM/RF - Clearing Account).',
                  'Caja Chica.',
                  'Utilidad Retenida.'
                ],
                correctIndex: 1,
                explanation: 'La cuenta puente de compensación de compras (EM/RF) registra el pasivo estimado por la mercancía física ingresada hasta que llegue la factura legal del proveedor.'
              }
            ],
            relatedManuals: [
              { id: 'tb1000-09-plan-cuentas-niif-determinacion-gl', title: 'Manual 09: Determinación G/L', summary: 'Mapeo detallado de cuentas de inventario, compensación y ventas.' },
              { id: 'tb1000-10-asientos-contables-ojdt-modelos-recurrentes', title: 'Manual 10: Asientos Automáticos', summary: 'Auditoría de pólizas generadas por el motor transaccional.' }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // CARRERA 3: LOGÍSTICA INTEGRAL, CADENA DE SUMINISTRO Y VENTAS
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'carrera-logistica',
    code: 'B1-CAR-03',
    number: 3,
    title: 'Logística Integral, Cadena de Suministro y Ciclos Comerciales',
    shortTitle: 'Logística, SCM & Ventas',
    badge: 'Supply Chain & Sales',
    colorTheme: 'amber',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    targetAudience: 'Ingenieros Industriales, Jefes de Compras, Directores de Almacén, Gerentes de Ventas y Consultores de Supply Chain.',
    careerRole: 'Especialista en Cadena de Suministro & Logística SAP B1',
    totalHours: 95,
    diplomaTitle: 'Diploma Oficial de Especialista en Cadena de Suministro y Ventas SAP B1',
    diplomaIssuanceFeeUSD: 69,
    description: 'Gestión avanzada de los ciclos Order-to-Cash y Procure-to-Pay, topología de almacenes con ubicaciones tridimensionales (Bin Locations), trazabilidad estricta por números de lote y series de garantía, métodos de valoración de inventario (Promedio Ponderado, FIFO, Estándar) y costeo de importaciones internacionales mediante Costes de Destino (Landed Costs).',
    objectives: [
      'Ejecutar el ciclo comercial completo: Cotización, Pedido, Verificación ATP, Entrega y Facturación A/R.',
      'Optimizar el aprovisionamiento corporativo: Solicitudes, Órdenes de Compra, GRPO y Facturas A/P.',
      'Diseñar y administrar la topología de bodegas con Ubicaciones (Bin Locations).',
      'Controlar la trazabilidad de productos con gestión por números de serie y números de lote.',
      'Calcular y prorratear los gastos aduaneros y fletes internacionales con Costes de Destino.'
    ],
    skillsTagged: ['Order-to-Cash', 'Procure-to-Pay', 'Bin Locations', 'Lotes y Series', 'Landed Costs', 'FIFO/PMP'],
    courses: [
      {
        id: 'curso-log-01',
        code: 'CUR-LOG-01',
        title: 'Ciclo Comercial Completo (Order-to-Cash)',
        shortTitle: 'Ciclo de Ventas (Order-to-Cash)',
        description: 'De la cotización y verificación de disponibilidad (ATP) a la entrega de mercancía, facturación y notas de crédito.',
        durationHours: 32,
        level: 'Intermedio',
        classes: [
          {
            id: 'clase-log-01',
            number: 11,
            title: 'Cotizaciones y Ofertas de Venta: Verificación de Disponibilidad (ATP) y Compromiso de Entrega',
            durationMin: 40,
            level: 'Intermedio',
            courseId: 'curso-log-01',
            courseTitle: 'Ciclo Comercial Completo (Order-to-Cash)',
            careerId: 'carrera-logistica',
            careerTitle: 'Logística Integral, Cadena de Suministro y Ciclos Comerciales',
            objectives: [
              'Entender el proceso de ventas consultivo iniciando en la Oferta de Venta (Sales Quotation).',
              'Dominar la Verificación de Disponibilidad en Tiempo Real (ATP - Available-to-Promise).',
              'Gestionar fechas de entrega comprometidas y propuestas de almacenes alternativos.'
            ],
            businessScenario: 'Un cliente clave solicita a OEC Computers una cotización formal por 15 Servidores JB con fecha de entrega garantizada para el próximo viernes. En bodega solo hay 8 unidades físicas, pero el sistema muestra que entrarán 20 unidades de una orden de compra abierta. El estudiante debe utilizar la verificación ATP para prometer la entrega con respaldo del sistema.',
            theoryContent: `### 1. El Inicio del Ciclo Order-to-Cash
El proceso de ventas en SAP Business One está diseñado para maximizar la satisfacción del cliente y proteger la liquidez:
1. **Oferta de Ventas (Sales Quotation):** Documento informativo no vinculante que no genera asientos contables ni afecta el stock físico.
2. **Orden de Venta (Sales Order):** Contrato comercial formal que compromete stock físico para que ningún otro vendedor pueda comercializarlo.

### 2. Available-to-Promise (ATP) en SAP HANA
El motor ATP calcula dinámicamente si es viable cumplir la fecha solicitada por el cliente evaluando:
- Stock en almacén actual.
- Menos: Reservas de pedidos ya confirmados a otros clientes.
- Más: Órdenes de compra a proveedores aprobadas y órdenes de fabricación en proceso que llegarán antes de la fecha límite.
- Si no hay suficiente stock, la ventana de **Verificación de Disponibilidad** ofrece automáticamente alternativas:
  - Cambiar fecha de entrega al primer día con saldo positivo.
  - Entregar una cantidad parcial inmediata.
  - Cambiar el almacén de despacho si otra sucursal dispone del inventario.`,
            checkpoint: {
              timestampMin: 20,
              pauseMessage: '¡Profesor Master B1! Analicemos la verificación ATP en el simulador.',
              teacherAudioPrompt: 'Hola estudiantes de logística. Un buen vendedor nunca promete lo que el almacén no puede entregar. Abre el simulador de SAP y crea una Oferta de Venta revisando el ATP.',
              simulatorTask: 'Abre Ventas > Oferta de Venta, selecciona un cliente y producto y consulta la verificación de disponibilidad.',
              simulatorMenuPath: 'Ventas - Clientes > Oferta de Ventas',
              simulatorArchetype: 'sales-quotation'
            },
            simulatorMission: {
              title: 'Misión de Laboratorio: Creación de Oferta y Comprobación ATP',
              description: 'Ingresa al simulador, elabora una Oferta de Venta para el cliente C20000, añade el artículo A00001 e inspecciona la ventana de verificación de disponibilidad de inventario.',
              stepByStep: [
                '1. Abre el simulador y ve a Ventas - Clientes > Oferta de Ventas.',
                '2. Selecciona al cliente Maxi-Teq (C20000).',
                '3. En la línea de artículos, coloca el producto A00001 y digita una cantidad de 100 unidades.',
                '4. Observa cómo el sistema abre la ventana de Disponibilidad indicando la cantidad que se puede prometer.',
                '5. Haz clic en "Crear" para registrar la cotización en el sistema.'
              ],
              validationCriteria: 'Manejo correcto de la ventana de verificación ATP y generación de ofertas comerciales.',
              targetModule: 'Ventas - Clientes'
            },
            quiz: [
              {
                question: '¿Qué impacto contable y físico tiene la creación de una Oferta de Ventas (Sales Quotation) en SAP Business One?',
                options: [
                  'Disminuye el stock físico en bodega de inmediato.',
                  'Genera un asiento de ingresos en el libro mayor.',
                  'Ninguno: es un documento preliminar que no mueve stock ni genera asientos contables.',
                  'Cancela las órdenes de compra de los proveedores.'
                ],
                correctIndex: 2,
                explanation: 'La Oferta de Ventas es un documento puramente comercial; solo cuando se convierte en Pedido compromete stock, y cuando se convierte en Entrega mueve inventario físico.'
              },
              {
                question: '¿Qué información provee la verificación ATP (Available-to-Promise) cuando se digita una cantidad superior al stock físico en almacén?',
                options: [
                  'El precio del artículo en la competencia.',
                  'Las fechas futuras en que habrá stock disponible considerando órdenes de compra y fabricación proyectadas.',
                  'El historial de compras del empleado que atiende la llamada.',
                  'Un descuento automático del 50%.'
                ],
                correctIndex: 1,
                explanation: 'El ATP evalúa las entradas y salidas proyectadas en el tiempo para brindar una fecha de cumplimiento verídica al cliente.'
              },
              {
                question: '¿Cómo se copia una Oferta de Ventas a una Orden de Venta sin volver a escribir los datos?',
                options: [
                  'Copiando el texto en un archivo de Word.',
                  'Haciendo clic en el botón inferior "Copiar a > Orden de Venta" (Copiar a / Copiar de).',
                  'Borrando la base de datos.',
                  'Tomando una captura de pantalla.'
                ],
                correctIndex: 1,
                explanation: 'El mecanismo de arrastre documental "Copiar a" traslada íntegramente las cabeceras, líneas y precios al siguiente documento manteniendo el vínculo en el Mapa de Relaciones.'
              }
            ],
            relatedManuals: [
              { id: 'tb1000-11-ciclo-ventas-order-to-cash-completo', title: 'Manual 11: Ciclo Order-to-Cash', summary: 'Flujo completo desde la oferta hasta la factura y cobranza.' }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // CARRERA 4: PLANIFICACIÓN MRP, PRODUCCIÓN Y CONSULTORÍA ERP
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'carrera-consultoria',
    code: 'B1-CAR-04',
    number: 4,
    title: 'Planificación MRP, Fabricación y Consultoría de Implementación',
    shortTitle: 'MRP, Producción & Consultoría',
    badge: 'Arquitectura & Consultoría',
    colorTheme: 'purple',
    gradient: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
    targetAudience: 'Ingenieros de Sistemas, Jefes de Planta, Consultores Funcionales SAP, Desarrolladores y Directores de Proyecto ERP.',
    careerRole: 'Consultor de Implementación & Planificación SAP B1',
    totalHours: 85,
    diplomaTitle: 'Diploma Oficial de Consultor de Implementación y Planificación SAP B1',
    diplomaIssuanceFeeUSD: 79,
    description: 'La formación de mayor jerarquía técnica de la academia: Planificación de Requerimientos de Materiales (MRP), Listas de Materiales (BOM), Órdenes de Fabricación y centros de trabajo, consultas complejas con el Generador de Consultas SQL, búsquedas formateadas (FMS), procedimientos de aprobación y migración masiva de datos con Data Transfer Workbench (DTW).',
    objectives: [
      'Modelar estructuras de productos complejos mediante Listas de Materiales (BOM) y rutas de ensamble.',
      'Ejecutar corridas de simulación con el Asistente de Planificación MRP calculando compras y órdenes de trabajo.',
      'Gestionar Órdenes de Fabricación con emisión manual y backflush y costeo de producto terminado.',
      'Diseñar consultas SQL sobre tablas maestras y transaccionales (OITM, OCRD, OINV, OPOR, OJDT).',
      'Configurar búsquedas formateadas (FMS) y procedimientos de aprobación multi-etapa con alertas.',
      'Migrar bases de datos y saldos de apertura con Data Transfer Workbench (DTW).'
    ],
    skillsTagged: ['Listas de Materiales BOM', 'Asistente MRP', 'Órdenes de Fabricación', 'Consultas SQL', 'Búsquedas Formateadas', 'DTW Migración'],
    courses: [
      {
        id: 'curso-con-01',
        code: 'CUR-CON-01',
        title: 'Planificación de Materiales (MRP) y Fabricación',
        shortTitle: 'MRP & Órdenes de Fabricación',
        description: 'Estructura de listas de materiales, simulación de demanda y ejecución de órdenes de planta.',
        durationHours: 35,
        level: 'Avanzado',
        classes: [
          {
            id: 'clase-con-01',
            number: 12,
            title: 'Listas de Materiales (BOM): Estructura de Producción, Ensamble, Ventas y Plantillas',
            durationMin: 45,
            level: 'Avanzado',
            courseId: 'curso-con-01',
            courseTitle: 'Planificación de Materiales (MRP) y Fabricación',
            careerId: 'carrera-consultoria',
            careerTitle: 'Planificación MRP, Fabricación y Consultoría de Implementación',
            objectives: [
              'Comprender los 4 tipos de Listas de Materiales: Producción, Venta, Ensamble y Plantilla.',
              'Definir el Artículo Padre y los Artículos Componentes (Hijos) con sus cantidades y mermas.',
              'Asignar almacenes predeterminados para la salida de materia prima y entrada de producto terminado.'
            ],
            businessScenario: 'OEC Computers no solo distribuye servidores importados, sino que ensambla en planta su producto estrella: el "Servidor PC-Gamer Extreme" compuesto por 1 procesador, 2 memorias RAM, 1 tarjeta gráfica, 1 gabinete y 2 horas de mano de obra de ensamble. El estudiante debe modelar la Lista de Materiales tipo Producción.',
            theoryContent: `### 1. El Concepto de Lista de Materiales (Bill of Materials - BOM)
En la tabla \`OITT\`, una Lista de Materiales define la receta de fabricación o ensamble de un producto:
- **Artículo Padre (Header):** El producto terminado que se entregará al cliente o ingresará a stock.
- **Componentes Hijos (Lines):** Materias primas, subensambles, piezas o recursos de mano de obra y maquinaria necesarios para producir 1 unidad del padre.

### 2. Los 4 Tipos de Listas de Materiales en SAP B1
1. **L.M. de Producción (Production BOM):** Se utiliza para fabricar con Órdenes de Producción. El padre es un artículo con control de stock y los componentes se consumen en planta.
2. **L.M. de Venta (Sales BOM / Kit):** Se vende como un paquete promocional (ej. *Combo Computadora + Impresora*). En la orden de venta aparece el padre pero se entregan y descuentan los componentes del inventario.
3. **L.M. de Ensamble (Assembly BOM):** Similar a la de venta, pero orientada a procesos simples de ensamblado sin orden de trabajo previa.
4. **L.M. de Plantilla (Template BOM):** Lista genérica que sirve de guía para seleccionar componentes al momento de cotizar.`,
            checkpoint: {
              timestampMin: 22,
              pauseMessage: '¡Profesor Master B1! Vamos a inspeccionar una Lista de Materiales en el simulador.',
              teacherAudioPrompt: 'Hola futuros ingenieros e implementadores. Las Listas de Materiales son la base de toda la industria de manufactura. Abre el simulador en Producción > Lista de Materiales.',
              simulatorTask: 'Abre Producción > Lista de Materiales y analiza los componentes de un producto terminado.',
              simulatorMenuPath: 'Producción > Lista de Materiales',
              simulatorArchetype: 'bill-of-materials'
            },
            simulatorMission: {
              title: 'Misión de Laboratorio: Modelado de Lista de Materiales',
              description: 'Ingresa al simulador, abre la ventana Lista de Materiales en el módulo Producción y verifica la relación entre el artículo padre y los componentes hijos.',
              stepByStep: [
                '1. En el simulador, haz clic en Producción > Lista de Materiales.',
                '2. Presiona Buscar y localiza el producto padre "A00002" (Servidor Ensamble).',
                '3. Observa el campo "Tipo de lista de materiales": Producción.',
                '4. Inspecciona la lista de componentes: cantidades requeridas y almacén de consumo.',
                '5. Verifica el costo total estimado de los componentes.'
              ],
              validationCriteria: 'Capacidad para diseñar y auditar estructuras de productos y recetas de fabricación.',
              targetModule: 'Producción'
            },
            quiz: [
              {
                question: '¿Qué tipo de Lista de Materiales se utiliza cuando se requiere emitir una Orden de Fabricación para transformar materias primas en un producto terminado?',
                options: [
                  'Lista de Materiales de Venta (Sales BOM).',
                  'Lista de Materiales de Producción (Production BOM).',
                  'Lista de Materiales de Plantilla.',
                  'Lista de Precios.'
                ],
                correctIndex: 1,
                explanation: 'Solo las Listas de Materiales tipo Producción pueden vincularse a Órdenes de Fabricación en el módulo de Producción.'
              },
              {
                question: 'En una Lista de Materiales de Venta (Kit de Ventas), ¿cuándo se descuenta el stock de los artículos componentes?',
                options: [
                  'Al crear el kit en el maestro de artículos.',
                  'Al emitir la Entrega o Factura al cliente que adquiere el kit.',
                  'Nunca se descuenta el inventario.',
                  'Al cierre de año fiscal.'
                ],
                correctIndex: 1,
                explanation: 'En las Sales BOM el padre no tiene stock físico propio; se rebajan del inventario los componentes individuales al generar la entrega.'
              },
              {
                question: '¿Qué tabla maestra en la base de datos de SAP B1 almacena las cabeceras de las Listas de Materiales?',
                options: [
                  'OITT',
                  'ITT1',
                  'OWOR',
                  'WOR1'
                ],
                correctIndex: 0,
                explanation: 'OITT almacena las cabeceras de BOMs, mientras que ITT1 almacena el desglose de componentes y líneas.'
              }
            ],
            relatedManuals: [
              { id: 'tb1000-15-mrp-planificacion-listas-materiales-bom', title: 'Manual 15: MRP y Listas de Materiales', summary: 'Ingeniería de producto, rutas de fabricación y asistentes de planificación.' }
            ]
          }
        ]
      },
      {
        id: 'curso-con-02',
        code: 'CUR-CON-02',
        title: 'Herramientas de Consultoría: Consultas SQL, UDFs y Migración DTW',
        shortTitle: 'Consultoría SQL, UDFs & DTW',
        description: 'Generador de consultas en base de datos HANA, automatización con FMS y migración con Data Transfer Workbench.',
        durationHours: 50,
        level: 'Avanzado',
        classes: [
          {
            id: 'clase-con-05',
            number: 13,
            title: 'Generador de Consultas SQL y Arquitectura de Tablas Relacionales (OITM, OCRD, OINV, OJDT)',
            durationMin: 50,
            level: 'Avanzado',
            courseId: 'curso-con-02',
            courseTitle: 'Herramientas de Consultoría: Consultas SQL, UDFs y Migración DTW',
            careerId: 'carrera-consultoria',
            careerTitle: 'Planificación MRP, Fabricación y Consultoría de Implementación',
            objectives: [
              'Comprender la nomenclatura de tablas en SAP B1 (Tablas que empiezan por "O" para cabeceras y números "1", "2" para líneas).',
              'Operar el Generador de Consultas (Query Generator) sin necesidad de herramientas externas.',
              'Construir consultas SQL con cláusulas JOIN entre clientes, facturas y artículos.'
            ],
            businessScenario: 'La Dirección General de OEC Computers solicita un reporte a medida que no existe en los menús estándar: una lista de los 10 mejores clientes del trimestre, mostrando el total comprado, el margen de utilidad y el nombre del ejecutivo de ventas asignado. El consultor debe crear la consulta SQL y publicarla en el menú del usuario.',
            theoryContent: `### 1. La Convención de Nombres de Tablas en SAP B1
El modelo de datos de SAP Business One sigue una regla mnemotécnica muy clara:
- **Tablas de Cabecera:** Empiezan por la letra **\`O\`** (Order / Object):
  - \`OCRD\` = Socios de Negocios
  - \`OITM\` = Artículos Maestros
  - \`OINV\` = Facturas de Clientes (Cabecera)
  - \`ORDR\` = Pedidos de Clientes (Cabecera)
  - \`OPOR\` = Órdenes de Compra (Cabecera)
  - \`OJDT\` = Asientos Contables (Cabecera)
- **Tablas de Líneas de Detalle:** El nombre de la cabecera reemplazando la \`O\` por la inicial y terminando en **\`1\`**:
  - \`INV1\` = Líneas de Factura de Clientes
  - \`RDR1\` = Líneas de Pedidos
  - \`POR1\` = Líneas de Órdenes de Compra
  - \`JDT1\` = Apuntes de Asientos Contables (Debe / Haber por línea)

### 2. El Generador de Consultas (Query Generator)
Ubicado en *Herramientas > Consultas > Generador de Consultas*:
- Permite seleccionar tablas escribiendo su código (ej. \`OINV\` y \`INV1\`).
- El sistema detecta automáticamente la clave foránea (\`DocEntry\`).
- Permite arrastrar campos a las zonas de **SELECT**, **WHERE**, **ORDER BY** y ejecutar al instante.
- Los resultados se pueden guardar en el **Administrador de Consultas** en categorías seguras por departamento.`,
            checkpoint: {
              timestampMin: 25,
              pauseMessage: '¡Profesor Master B1! Vamos a inspeccionar el Generador de Consultas SQL.',
              teacherAudioPrompt: 'Hola consultores avanzados. Dominar la arquitectura SQL de SAP B1 es lo que separa a un operador de un consultor de alto valor. Abre el Generador de Consultas en el simulador.',
              simulatorTask: 'Abre Herramientas > Consultas > Generador de Consultas y consulta la tabla OCRD.',
              simulatorMenuPath: 'Herramientas > Consultas > Generador de Consultas',
              simulatorArchetype: 'sql-query-generator'
            },
            simulatorMission: {
              title: 'Misión de Laboratorio: Extracción de Datos con Generador SQL',
              description: 'Ingresa al simulador, abre el Generador de Consultas y construye una consulta básica sobre la tabla de Socios de Negocios seleccionando Código, Nombre y Saldo de Cuenta.',
              stepByStep: [
                '1. En el simulador, haz clic en Herramientas > Consultas > Generador de Consultas.',
                '2. En el recuadro superior izquierdo de tabla, escribe "OCRD" y presiona Tab.',
                '3. Haz doble clic en los campos: CardCode, CardName y Balance.',
                '4. Haz clic en el botón "Ejecutar".',
                '5. Observa la cuadrícula de datos generada en tiempo real.'
              ],
              validationCriteria: 'Comprensión de la arquitectura relacional DocEntry y extracción de datos mediante consultas SQL.',
              targetModule: 'Herramientas'
            },
            quiz: [
              {
                question: 'En la arquitectura de base de datos de SAP Business One, ¿cuál es la tabla que almacena las líneas de detalle de una Factura de Clientes?',
                options: [
                  'OINV',
                  'INV1',
                  'OCRD',
                  'OITM'
                ],
                correctIndex: 1,
                explanation: 'OINV almacena la cabecera (cliente, fecha, total), mientras que INV1 almacena cada artículo, cantidad, precio e impuesto por línea.'
              },
              {
                question: '¿Cuál es el campo clave primario (Primary Key) que vincula una cabecera con sus líneas de detalle en casi todos los documentos de marketing?',
                options: [
                  'DocNum',
                  'DocEntry',
                  'CardCode',
                  'ItemCode'
                ],
                correctIndex: 1,
                explanation: 'DocEntry es el identificador único interno e inmutable que relaciona las cabeceras con las tablas hijas en la base de datos.'
              },
              {
                question: '¿Qué herramienta integrada en SAP B1 permite diseñar consultas personalizadas y asignarlas a botones o menús sin escribir código externo?',
                options: [
                  'El Generador de Consultas y Administrador de Consultas.',
                  'El bloc de notas de Windows.',
                  'La calculadora de escritorio.',
                  'El antivirus.'
                ],
                correctIndex: 0,
                explanation: 'El Generador de Consultas de SAP B1 permite crear, categorizar y autorizar consultas SQL nativas directamente desde la interfaz.'
              }
            ],
            relatedManuals: [
              { id: 'tb1000-16-consultoria-sql-queries-tablas-sistema', title: 'Manual 16: Consultas SQL y Tablas', summary: 'Diccionario de tablas del sistema, sintaxis de consultas en HANA y optimización de reportes.' }
            ]
          }
        ]
      }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES DE ACCESO Y NAVEGACIÓN CURRICULAR
// ═══════════════════════════════════════════════════════════════════

export function getAllSchoolCareers(): SchoolCareer[] {
  return SCHOOL_CAREERS;
}

export function getSchoolCareerById(id: string): SchoolCareer | undefined {
  return SCHOOL_CAREERS.find(c => c.id === id);
}

export function getSchoolClassById(classId: string): SchoolClass | undefined {
  for (const career of SCHOOL_CAREERS) {
    for (const course of career.courses) {
      const found = course.classes.find(cl => cl.id === classId);
      if (found) return found;
    }
  }
  return undefined;
}

export function getAllSchoolClasses(): SchoolClass[] {
  const all: SchoolClass[] = [];
  for (const career of SCHOOL_CAREERS) {
    for (const course of career.courses) {
      all.push(...course.classes);
    }
  }
  return all;
}

export function getAdjacentClasses(classId: string): {
  previousClass: SchoolClass | null;
  nextClass: SchoolClass | null;
} {
  const allClasses = getAllSchoolClasses();
  const index = allClasses.findIndex(c => c.id === classId);
  if (index === -1) {
    return { previousClass: null, nextClass: null };
  }
  return {
    previousClass: index > 0 ? allClasses[index - 1] : null,
    nextClass: index < allClasses.length - 1 ? allClasses[index + 1] : null,
  };
}
