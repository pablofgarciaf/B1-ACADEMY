import { QuizQuestion } from './manual-quizzes-data';

export interface CategoryExam {
  categoryName: string;
  badgeTitle: string;
  description: string;
  passingScore: number; // 9 de 10 (90%)
  questions: QuizQuestion[];
}

export const CATEGORY_EXAMS: Record<string, CategoryExam> = {
  "Introducción a SAP Business One": {
    categoryName: "Introducción a SAP Business One",
    badgeTitle: "Especialista en Fundamentos y Arquitectura SAP B1",
    description: "Evaluación rigurosa de 10 preguntas sobre arquitectura en memoria HANA, Service Layer, navegación Fiori, licenciamiento, parametrizaciones y modelo de datos relacional. Exige un 90% de aciertos para certificar.",
    passingScore: 9,
    questions: [
      {
        q: "1. ¿Cuál es la principal diferencia entre la arquitectura de base de datos SAP HANA y Microsoft SQL Server en SAP Business One?",
        options: [
          "SAP HANA no requiere servidor físico y funciona únicamente en navegadores móviles.",
          "SAP HANA ejecuta el procesamiento de datos directamente en memoria RAM con estructura columnar, permitiendo ejecutar analítica transaccional en tiempo real.",
          "Microsoft SQL Server no permite crear interlocutores comerciales de tipo proveedor.",
          "SAP HANA solo permite guardar borradores de documentos sin asientos contables."
        ],
        answer: 1,
        explanation: "SAP HANA es una base de datos in-memory con compresión columnar avanzada que acelera reportes y transacciones masivas.",
        topic: "Arquitectura In-Memory SAP HANA",
        recommendedManualId: "10_Intro_11_Overview_IntroSAPB1_ES",
        recommendedManualTitle: "Introducción a SAP Business One"
      },
      {
        q: "2. En el modelo relacional de SAP Business One, ¿qué tabla almacena los datos principales de los Interlocutores Comerciales (Clientes, Proveedores y Leads)?",
        options: [
          "OITM",
          "OCRD",
          "OJDT",
          "OINV"
        ],
        answer: 1,
        explanation: "La tabla OCRD almacena todos los socios de negocios, diferenciados por el campo CardType (C: Cliente, S: Proveedor, L: Lead).",
        topic: "Datos Maestros de Socios de Negocios (OCRD)",
        recommendedManualId: "10_Overview_13_MDDoc_ES",
        recommendedManualTitle: "Documentos y Datos Maestros: Conceptos Generales"
      },
      {
        q: "3. Al navegar en cualquier formulario de SAP Business One, ¿qué función cumple hacer clic en la flecha de enlace naranja situada junto a un campo?",
        options: [
          "Cierra inmediatamente el cliente SAP para liberar licencias.",
          "Navega en profundidad (drill-down) abriendo directamente el registro maestro o documento origen correspondiente.",
          "Elimina el valor del campo y lo restablece a cero.",
          "Envía una alerta de aprobación al gerente financiero."
        ],
        answer: 1,
        explanation: "La flecha naranja es la herramienta de navegación nativa de SAP B1 para acceder al dato maestro o documento relacionado en un solo clic.",
        topic: "Navegación con Flecha Naranja",
        recommendedManualId: "10_Intro_12_Overview_GettingStarted_ES",
        recommendedManualTitle: "Primeros Pasos en SAP Business One"
      },
      {
        q: "4. ¿Qué sucede con los registros contables y el inventario cuando un usuario guarda un documento como 'Documento Preliminar' (Borrador)?",
        options: [
          "Se contabiliza de inmediato pero con fecha del último día del mes.",
          "No genera ningún asiento contable ni afecta las existencias de almacén; permanece como plantilla hasta su confirmación.",
          "Descuenta las cantidades físicas en el almacén pero no afecta los costos.",
          "Solo se permite guardar borradores si la empresa tiene menos de 10 empleados."
        ],
        answer: 1,
        explanation: "Los borradores se registran en tablas temporales (ODRF/DRF1) y no tienen impacto contable ni logístico hasta ser añadidos definitivamente.",
        topic: "Documentos Preliminares y Borradores",
        recommendedManualId: "10_Overview_13_MDDoc_ES",
        recommendedManualTitle: "Documentos y Datos Maestros: Conceptos Generales"
      },
      {
        q: "5. Para habilitar la visualización en tiempo real del nombre técnico de las tablas y campos en la barra de estado inferior, ¿cuál es el procedimiento correcto?",
        options: [
          "Abrir la consola de comandos de Windows.",
          "Activar la opción 'Información del Sistema' desde el menú Vista o mediante el atajo de teclado Ctrl + Shift + I.",
          "Reiniciar el servidor de licencias de SAP.",
          "Instalar un plug-in de navegador de terceros."
        ],
        answer: 1,
        explanation: "Vista > Información del Sistema (Ctrl+Shift+I) es la herramienta fundamental de todo consultor para identificar tablas y campos en pantalla.",
        topic: "Información del Sistema (Ctrl+Shift+I)",
        recommendedManualId: "10_Intro_12_Overview_GettingStarted_ES",
        recommendedManualTitle: "Primeros Pasos en SAP Business One"
      },
      {
        q: "6. En un documento de marketing, ¿qué tipo de línea permite ingresar notas detalladas o instrucciones al transportista sin valor económico?",
        options: [
          "Línea en blanco estándar",
          "Línea de tipo T (Texto)",
          "Línea de tipo S (Subtotal)",
          "Línea de tipo A (Alternativo)"
        ],
        answer: 1,
        explanation: "Las líneas de tipo T permiten insertar texto libre explicativo en el cuerpo del documento.",
        topic: "Tipos de Línea en Documentos de Marketing",
        recommendedManualId: "10_Overview_13_MDDoc_ES",
        recommendedManualTitle: "Documentos y Datos Maestros: Conceptos Generales"
      },
      {
        q: "7. ¿Qué componente del ecosistema SAP B1 gestiona centralizadamente los servidores, empresas registradas y el servidor de licencias?",
        options: [
          "System Landscape Directory (SLD)",
          "Windows Defender Firewall",
          "Microsoft Excel 365",
          "Crystal Reports Viewer"
        ],
        answer: 0,
        explanation: "El SLD centraliza la arquitectura de servidores, bases de datos y servicios del entorno SAP B1.",
        topic: "Arquitectura y Administración del SLD",
        recommendedManualId: "10_Intro_11_Overview_IntroSAPB1_ES",
        recommendedManualTitle: "Introducción a SAP Business One"
      },
      {
        q: "8. Cuando un cliente potencial (Lead) concreta su primera compra, ¿cuál es la mejor práctica en SAP B1?",
        options: [
          "Crear un nuevo cliente desde cero y borrar el prospecto anterior.",
          "Cambiar el CardType del registro existente de Lead a Cliente para conservar todo el historial de cotizaciones y actividades.",
          "Desactivar la base de datos de ventas.",
          "Exportar los datos a un archivo PDF impreso."
        ],
        answer: 1,
        explanation: "Al cambiar el tipo de socio de negocios de Lead a Cliente, se preserva el histórico completo de oportunidades y cotizaciones.",
        topic: "Ciclo de Conversión de Leads a Clientes",
        recommendedManualId: "10_Overview_13_MDDoc_ES",
        recommendedManualTitle: "Documentos y Datos Maestros: Conceptos Generales"
      },
      {
        q: "9. Si un usuario no puede acceder al menú de Contabilidad ni Inventario, ¿cuál es la causa principal en la administración del sistema?",
        options: [
          "El usuario tiene una pantalla con brillo reducido.",
          "Restricción de autorizaciones en Gestión > Inicialización del Sistema > Autorizaciones o falta de licencia nominal profesional/financiera.",
          "La empresa no tiene conexión a internet satelital.",
          "El teclado del usuario no tiene teclado numérico."
        ],
        answer: 1,
        explanation: "Las autorizaciones de usuario y la asignación de licencias determinan exactamente qué menús y funciones están disponibles.",
        topic: "Matriz de Autorizaciones y Permisos",
        recommendedManualId: "10_Intro_12_Overview_GettingStarted_ES",
        recommendedManualTitle: "Primeros Pasos en SAP Business One"
      },
      {
        q: "10. ¿Cuál es el protocolo estándar de SAP B1 para garantizar trazabilidad cuando una Orden de Venta se despacha al cliente?",
        options: [
          "Digitar nuevamente todos los artículos en una Entrega independiente sin enlazar.",
          "Utilizar la función 'Copiar a Entrega' desde el pedido, actualizando el estado de las líneas base y reflejándolo en el Mapa de Relaciones.",
          "Enviar un mensaje de texto al chofer del camión.",
          "Borrar el pedido original para que no aparezca en los reportes."
        ],
        answer: 1,
        explanation: "El flujo 'Copiar a' genera el documento destino enlazado, actualiza cantidades abiertas/cerradas y traza el flujo en el Mapa de Relaciones.",
        topic: "Trazabilidad y Mapa de Relaciones",
        recommendedManualId: "10_Overview_13_MDDoc_ES",
        recommendedManualTitle: "Documentos y Datos Maestros: Conceptos Generales"
      }
    ]
  },
  "Implementación y Configuración": {
    categoryName: "Implementación y Configuración",
    badgeTitle: "Consultor Técnico en Parametrización y Herramientas de Personalización",
    description: "Evaluación rigurosa de 10 preguntas sobre consultas SQL, Tablas UDT, Campos UDF, Objetos UDO, Búsquedas Formateadas y diccionario REFDB. Exige 90% de aciertos para certificar.",
    passingScore: 9,
    questions: [
      {
        q: "1. ¿Qué prefijo obligatorio asigna automáticamente SAP Business One a todas las Tablas Definidas por el Usuario (UDT) creadas en el sistema?",
        options: [
          "SYS_",
          "@",
          "TBL_",
          "USER_"
        ],
        answer: 1,
        explanation: "Todas las tablas de usuario creadas en SAP B1 inician con el prefijo @ (ejemplo: @MI_TABLA) para no colisionar con las tablas nativas O***.",
        topic: "Tablas de Usuario (UDT) y Prefijo @",
        recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
        recommendedManualTitle: "Consultas Personalizadas (Queries)"
      },
      {
        q: "2. ¿Cuál es el propósito fundamental de crear un Objeto Definido por el Usuario (UDO) en lugar de una simple tabla UDT?",
        options: [
          "Reducir el tamaño de la memoria RAM del servidor.",
          "Dotar a las tablas personalizadas de lógica de negocio completa: navegación nativa, servicios de añadir/actualizar, autorizaciones por rol y enlace a formularios automáticos.",
          "Convertir las consultas SQL en archivos PDF de solo lectura.",
          "Evitar que los usuarios utilicen contraseñas seguras."
        ],
        answer: 1,
        explanation: "Un UDO (User-Defined Object) encapsula una o más UDTs otorgándoles interfaz gráfica estándar, servicios de búsqueda y reglas de integridad de negocio.",
        topic: "Objetos de Usuario (UDO) y Lógica de Negocio",
        recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
        recommendedManualTitle: "Consultas Personalizadas (Queries)"
      },
      {
        q: "3. Al construir una consulta SQL en el Generador de Consultas, ¿qué tabla de cabecera y qué tabla de líneas deben relacionarse para auditar las Facturas de Clientes?",
        options: [
          "ORDR y RDR1",
          "OINV y INV1",
          "OPCH y PCH1",
          "ODLN y DLN1"
        ],
        answer: 1,
        explanation: "OINV es la cabecera de Facturas de Clientes (A/R Invoices) e INV1 contiene el desglose de líneas de artículos/servicios.",
        topic: "Tablas de Facturación OINV / INV1",
        recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
        recommendedManualTitle: "Consultas Personalizadas (Queries)"
      },
      {
        q: "4. ¿Qué herramienta nativa permite asignar una consulta SQL a un campo para que calcule o sugiera valores automáticamente al modificarse otro dato en pantalla?",
        options: [
          "Valores Definidos por el Usuario (UDV / Búsquedas Formateadas).",
          "El Diseñador de Crystal Reports.",
          "La consola de Servicios de Windows.",
          "El Asistente de Recuperación de Desastres."
        ],
        answer: 0,
        explanation: "Las Búsquedas Formateadas (UDV) disparan consultas SQL automáticas condicionadas a eventos o cambios en campos de pantalla.",
        topic: "Búsquedas Formateadas (UDV)",
        recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
        recommendedManualTitle: "Consultas Personalizadas (Queries)"
      },
      {
        q: "5. ¿Por qué no se debe utilizar nunca sentencias SQL INSERT o DELETE directamente sobre tablas maestras como OCRD u OITM?",
        options: [
          "Porque SQL Server borraría el archivo de log de transacciones.",
          "Porque elude la capa de validación de negocio (DI-API/Service Layer), desbalancea las cuentas de control y anula la garantía oficial de soporte de SAP.",
          "Porque solo se permiten consultas en idioma inglés.",
          "Porque el monitor del usuario se bloquearía durante 24 horas."
        ],
        answer: 1,
        explanation: "Escribir directamente en tablas de SAP B1 destruye la integridad contable y referencial del ERP, invalidando el contrato de soporte con SAP.",
        topic: "Garantía de Soporte e Integridad de Base de Datos",
        recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
        recommendedManualTitle: "Consultas Personalizadas (Queries)"
      },
      {
        q: "6. En una búsqueda formateada con sintaxis $[$Item.Column.Number$], ¿qué representa el número de Item?",
        options: [
          "El código del artículo en inventario.",
          "El identificador numérico interno único del control visual o campo asignado por el diseñador de ventanas de SAP B1.",
          "El número de teléfono del usuario conectado.",
          "El tipo de cambio del euro."
        ],
        answer: 1,
        explanation: "En la arquitectura de interfaz de SAP B1, cada control visual de una ventana tiene un identificador entero llamado Item UID.",
        topic: "Sintaxis Interna de Controles en Búsquedas Formateadas",
        recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
        recommendedManualTitle: "Consultas Personalizadas (Queries)"
      },
      {
        q: "7. ¿Dónde se visualizan y administran las consultas SQL guardadas por los usuarios para controlar permisos de ejecución por grupos?",
        options: [
          "En el Gestor de Consultas (Query Manager) organizado en categorías de consulta autorizables.",
          "En el bloc de notas del escritorio de Windows.",
          "En la carpeta temporal de descargas de Google Chrome.",
          "En la barra de tareas de Windows."
        ],
        answer: 0,
        explanation: "El Query Manager permite clasificar consultas en carpetas y asignar permisos de ejecución específicos por rol de usuario.",
        topic: "Administración del Query Manager",
        recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
        recommendedManualTitle: "Consultas Personalizadas (Queries)"
      },
      {
        q: "8. ¿Qué prefijo identifica a los Campos Definidos por el Usuario (UDF) cuando se consultan mediante SQL en la base de datos?",
        options: [
          "U_",
          "CUSTOM_",
          "USER_",
          "FIELD_"
        ],
        answer: 0,
        explanation: "Todos los campos de usuario (UDF) creados en cualquier tabla nativa o UDT reciben el prefijo obligatorio U_ (ej: U_MiCampo).",
        topic: "Campos Definidos por el Usuario (UDF)",
        recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
        recommendedManualTitle: "Consultas Personalizadas (Queries)"
      },
      {
        q: "9. ¿Cuál es la función del archivo REFDB accesible desde las herramientas de desarrollo de SAP B1?",
        options: [
          "Diccionario de datos canónico que detalla tipos de campo, longitud máxima, relaciones foráneas y restricciones.",
          "Un archivo para reproducir música durante la jornada laboral.",
          "El archivo que guarda las contraseñas de correo electrónico.",
          "El instalador de impresoras fiscales."
        ],
        answer: 0,
        explanation: "REFDB es el diccionario oficial de referencia de tablas y campos para desarrolladores y consultores.",
        topic: "Diccionario de Datos REFDB",
        recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
        recommendedManualTitle: "Consultas Personalizadas (Queries)"
      },
      {
        q: "10. ¿Qué herramienta estándar de SAP B1 se utiliza para importar masivamente datos maestros desde archivos de texto o Excel en una implementación inicial?",
        options: [
          "Data Transfer Workbench (DTW) conectado vía DI-API.",
          "Copiar y pegar con el botón derecho en el menú inicio.",
          "El Administrador de Dispositivos de Windows.",
          "El explorador de archivos de Windows."
        ],
        answer: 0,
        explanation: "El Data Transfer Workbench (DTW) valida las plantillas CSV/Excel contra la lógica empresarial e importa masivamente datos maestros y transaccionales.",
        topic: "Herramienta Data Transfer Workbench (DTW)",
        recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
        recommendedManualTitle: "Consultas Personalizadas (Queries)"
      }
    ]
  },
  "Casos Prácticos y Ejercicios": {
    categoryName: "Casos Prácticos y Ejercicios",
    badgeTitle: "Consultor Certificado en Casos Prácticos y Simulación SAP B1",
    description: "Evaluación rigurosa de 10 preguntas prácticas de consultoría que certifica la destreza en construcción de consultas SQL HANA, automatización de alertas, diseño de dashboards, personalización de cockpits y ciclo integral Procure-to-Pay.",
    passingScore: 9,
    questions: [
      {
        q: "1. En una consulta SQL HANA sobre la tabla OCRD, ¿por qué es imperativo filtrar por CardType = 'C' para reportes de cartera?",
        options: [
          "Porque OCRD contiene clientes ('C'), proveedores ('S') y prospectos ('L'); sin el filtro, la suma de saldos distorsiona la cartera por cobrar.",
          "Porque SAP HANA arroja un error de sintaxis si no se especifica el tipo de socio.",
          "Porque los proveedores no tienen asignada una cuenta contable en el plan de cuentas.",
          "Porque 'C' fuerza la conversión de moneda extranjera a moneda local."
        ],
        answer: 0,
        explanation: "OCRD almacena centralizadamente todos los interlocutores comerciales. CardType es el discriminador canónico.",
        topic: "Maestro de Socios de Negocios (OCRD)",
        recommendedManualId: "CSI08_Query_Practice",
        recommendedManualTitle: "Práctica de Consultas (Query Practice)"
      },
      {
        q: "2. Al estructurar una consulta interactiva en SAP B1, ¿qué mecanismo técnico permite solicitar una fecha al usuario en tiempo de ejecución sin alterar el código?",
        options: [
          "La variable de parámetro [%0] vinculada con un operador relacional (ej. DocDate > [%0]).",
          "Una macro de Visual Basic incrustada en el cliente.",
          "Un trigger de base de datos que pausa el servidor.",
          "El uso de la función SQL NOW() sin parámetros."
        ],
        answer: 0,
        explanation: "La sintaxis [%0], [%1]... invoca el asistente de criterios de selección nativo de SAP B1.",
        topic: "Parámetros Dinámicos en Consultas",
        recommendedManualId: "CSI08_Query_Practice",
        recommendedManualTitle: "Práctica de Consultas (Query Practice)"
      },
      {
        q: "3. ¿Qué clave primaria/foránea vincula de forma unívoca la cabecera de un documento de marketing (ej. OINV) con sus líneas de artículos (ej. INV1)?",
        options: [
          "DocNum",
          "DocEntry",
          "LineNum",
          "CardCode"
        ],
        answer: 1,
        explanation: "DocEntry es el identificador numérico interno e inmutable utilizado por SAP B1 para todas las relaciones relacionales cabecera-detalle.",
        topic: "Claves de Unión Multitabla",
        recommendedManualId: "CSI08_Query_Practice",
        recommendedManualTitle: "Práctica de Consultas (Query Practice)"
      },
      {
        q: "4. En el Generador de Consultas, ¿qué atajo de teclado y ratón permite calcular la sumatoria total de cualquier columna numérica en la grilla de resultados?",
        options: [
          "Ctrl + Clic en el encabezado de la columna.",
          "Alt + Doble clic en la última fila.",
          "Shift + F12.",
          "Clic derecho y seleccionar 'Exportar a Excel'."
        ],
        answer: 0,
        explanation: "Ctrl + Clic en el encabezado de columna activa el cálculo de sumatoria al pie de página sin recalcular la consulta.",
        topic: "Ajuste Fino de Resultados",
        recommendedManualId: "CSI08_Query_Practice",
        recommendedManualTitle: "Práctica de Consultas (Query Practice)"
      },
      {
        q: "5. ¿Cuál es el requisito indispensable al construir una consulta SQL destinada a un widget de gráfico de barras en Pervasive Analytics?",
        options: [
          "Utilizar GROUP BY para la dimensión de categorías y al menos una función de agregación (como SUM o COUNT) para la métrica numérica.",
          "No incluir ningún alias de columna.",
          "Ejecutar la consulta únicamente con el usuario 'manager'.",
          "Guardar la consulta exclusivamente en formato de solo texto."
        ],
        answer: 0,
        explanation: "Los widgets Fiori requieren consolidar datos numéricos mediante funciones agregadas y agrupar por una o más dimensiones.",
        topic: "Consultas para Dashboards",
        recommendedManualId: "CSI08_Query_Practice",
        recommendedManualTitle: "Práctica de Consultas (Query Practice)"
      },
      {
        q: "6. En el caso práctico CSL01, ¿cómo se asegura un consultor de que un nuevo jefe de ventas tenga acceso rápido a las funciones operativas más usadas?",
        options: [
          "Asignando una plantilla de Cockpit de Ventas y personalizando el widget de Funciones Comunes.",
          "Creando una nueva base de datos para el usuario.",
          "Instalando un add-on externo de navegación.",
          "Cambiando el usuario a superusuario 'manager'."
        ],
        answer: 0,
        explanation: "Las plantillas de Cockpit y los widgets de Funciones Comunes permiten estructurar el espacio de trabajo según el rol del empleado.",
        topic: "Configuración de Cockpits",
        recommendedManualId: "CSL01_Introduction_ES",
        recommendedManualTitle: "Caso Práctico: Introducción"
      },
      {
        q: "7. ¿Qué función de búsqueda avanzada en SAP HANA permite localizar rápidamente un documento por cliente, fecha y texto en todos los objetos de la empresa?",
        options: [
          "Enterprise Search (Búsqueda Empresarial en Memoria).",
          "Buscar Menús en la esquina superior izquierda.",
          "Comando DIR en la consola de comandos.",
          "El Administrador de Dispositivos."
        ],
        answer: 0,
        explanation: "Enterprise Search indexa en memoria HANA todos los datos maestros y documentos para búsquedas instantáneas tipo Google.",
        topic: "Enterprise Search en SAP HANA",
        recommendedManualId: "CSL01_Introduction_ES",
        recommendedManualTitle: "Caso Práctico: Introducción"
      },
      {
        q: "8. En el ciclo de compras P2P (CSL02), ¿qué impacto contable e inventarial produce la Entrada de Mercancías por Compras (EMPC)?",
        options: [
          "Incrementa el inventario físico y genera un asiento acreditando la cuenta puente de compensación de compras (EM/RF).",
          "No genera ningún asiento contable ya que la factura aún no ha sido recibida.",
          "Disminuye el stock del almacén por considerarse en tránsito.",
          "Cancela automáticamente la orden de compra y el pago bancario."
        ],
        answer: 0,
        explanation: "La EMPC aumenta existencias y acredita la cuenta puente de compensación de mercancías recibidas no facturadas.",
        topic: "Asiento Contable de EMPC",
        recommendedManualId: "CSL02_Procurement_Process_ES",
        recommendedManualTitle: "Caso Práctico: Proceso de Compras"
      },
      {
        q: "9. Al recibir la Factura de Proveedores basada en una EMPC previa, ¿qué movimiento realiza el motor contable de SAP B1?",
        options: [
          "Debita la cuenta puente de compensación y acredita la cuenta por pagar real del Proveedor.",
          "Duplica el valor del inventario en el activo circulante.",
          "Elimina el documento base para ahorrar espacio en disco.",
          "Genera una nota de crédito automática por el total del IVA."
        ],
        answer: 0,
        explanation: "La Factura de Proveedores cancela la cuenta puente provisional y crea la obligación legal con el socio de negocios.",
        topic: "Ciclo de Cuentas por Pagar P2P",
        recommendedManualId: "CSL02_Procurement_Process_ES",
        recommendedManualTitle: "Caso Práctico: Proceso de Compras"
      },
      {
        q: "10. ¿Qué herramienta gráfica de SAP B1 permite auditar en un solo diagrama el flujo completo desde la Solicitud de Pedido hasta el Pago Efectuado?",
        options: [
          "El Mapa de Relaciones del documento.",
          "El Plan de Cuentas contable.",
          "El log de eventos de Windows.",
          "La ventana de Parametrizaciones Generales."
        ],
        answer: 0,
        explanation: "El Mapa de Relaciones visualiza todos los documentos predecesores y sucesores vinculados en una transacción.",
        topic: "Mapa de Relaciones y Trazabilidad",
        recommendedManualId: "CSL02_Procurement_Process_ES",
        recommendedManualTitle: "Caso Práctico: Proceso de Compras"
      }
    ]
  }
};

// Generador genérico de 10 preguntas complejas con umbral de 90% para cualquier categoría restante
export function getCategoryExam(categoryName: string): CategoryExam {
  if (CATEGORY_EXAMS[categoryName]) {
    return CATEGORY_EXAMS[categoryName];
  }

  const baseQuestions: QuizQuestion[] = [
    {
      q: `1. En la arquitectura empresarial de SAP Business One, ¿cuál es el principio clave que rige el módulo de ${categoryName}?`,
      options: [
        "La duplicación de documentos en carpetas físicas locales.",
        `La integración total en tiempo real con la contabilidad financiera y el inventario sin interfaces externas.`,
        "El uso de software externo no homologado por SAP.",
        "La eliminación de controles de autorización de usuarios."
      ],
      answer: 1,
      explanation: `Todas las operaciones de ${categoryName} en SAP B1 actualizan en tiempo real los libros mayores y la trazabilidad del sistema.`,
      topic: `Integración Transaccional en ${categoryName}`,
      recommendedManualTitle: `Manuales del módulo ${categoryName}`
    },
    {
      q: `2. Al parametrizar las cuentas contables o reglas asociadas a ${categoryName}, ¿qué control técnico previene inconsistencias?`,
      options: [
        "La determinación automática de cuentas de mayor y los candados de período contable.",
        "Apagar el servidor de base de datos al finalizar cada registro.",
        "Permitir que cualquier usuario modifique los saldos de apertura a voluntad.",
        "Desactivar los asientos contables en el sistema."
      ],
      answer: 0,
      explanation: "La determinación de cuentas de mayor predefine qué cuentas se afectan en cada transacción según el grupo de artículos o almacén.",
      topic: `Determinación de Cuentas en ${categoryName}`,
      recommendedManualTitle: `Manuales del módulo ${categoryName}`
    },
    {
      q: `3. ¿Cómo garantiza SAP Business One la trazabilidad de cualquier transacción ejecutada dentro de ${categoryName}?`,
      options: [
        "Mediante el Mapa de Relaciones visual y el Registro de Auditoría de Transacciones (Audit Log).",
        "Imprimiendo un comprobante físico que se archiva manualmente.",
        "Ocultando las transacciones anteriores para no saturar la pantalla.",
        "Enviando un correo electrónico al fabricante del servidor."
      ],
      answer: 0,
      explanation: "El Mapa de Relaciones permite al consultor auditar el ciclo de vida completo de un documento desde su cotización inicial hasta el pago.",
      topic: `Mapa de Relaciones en ${categoryName}`,
      recommendedManualTitle: `Manuales del módulo ${categoryName}`
    },
    {
      q: `4. Si una auditoría detecta discrepancias en los registros de ${categoryName}, ¿cuál es el paso de diagnóstico estándar para un consultor SAP?`,
      options: [
        "Modificar directamente los registros en la base de datos con un script de consola.",
        "Consultar el Log de Modificaciones para identificar qué usuario, fecha y campo exacto fue alterado.",
        "Reinstalar el cliente de SAP Business One en todas las estaciones de trabajo.",
        "Eliminar el período contable completo."
      ],
      answer: 1,
      explanation: "Herramientas > Log de Modificaciones muestra el historial completo de cambios campo por campo con usuario y timestamp.",
      topic: `Auditoría y Log de Modificaciones`,
      recommendedManualTitle: `Manuales del módulo ${categoryName}`
    },
    {
      q: `5. ¿Cuál es el impacto financiero directo de los movimientos logísticos generados en ${categoryName}?`,
      options: [
        "No generan ningún impacto hasta el cierre del año fiscal.",
        "Generan asientos automáticos en cuentas de inventario, variación de existencias o costo de ventas según el método de valoración.",
        "Afectan únicamente cuentas de patrimonio neto sin tocar activos.",
        "Se deben calcular manualmente en una calculadora física."
      ],
      answer: 1,
      explanation: "El sistema de inventario permanente de SAP B1 contabiliza en tiempo real cada entrada, salida o transferencia.",
      topic: `Inventario Permanente y Costos en ${categoryName}`,
      recommendedManualTitle: `Manuales del módulo ${categoryName}`
    },
    {
      q: `6. Al gestionar autorizaciones en ${categoryName}, ¿qué nivel de seguridad permite asignar SAP B1 a un usuario?`,
      options: [
        "Autorización Total, Solo Lectura o Sin Autorización, segmentable por campos sensibles y series de numeración.",
        "Solo permite bloquear el mouse de la computadora.",
        "No existen autorizaciones, todos los empleados son administradores.",
        "Solo permite restringir el acceso los días domingos."
      ],
      answer: 0,
      explanation: "La matriz de autorizaciones granula el acceso por ventana, acción (crear, modificar, ver) y series de numeración.",
      topic: `Seguridad y Perfiles de Autorización`,
      recommendedManualTitle: `Manuales del módulo ${categoryName}`
    },
    {
      q: `7. ¿Qué reporte nativo de SAP B1 proporciona el detalle cronológico de todos los movimientos y saldos del módulo ${categoryName}?`,
      options: [
        "El Informe de Auditoría de Stocks o Libro Mayor según la naturaleza del módulo.",
        "El historial de navegación de Google Chrome.",
        "El visor de eventos de Windows.",
        "Un documento de Word sin formato."
      ],
      answer: 0,
      explanation: "Los informes de auditoría reconstruyen con precisión matemática la evolución de saldos y transacciones.",
      topic: `Informes Oficiales de Auditoría`,
      recommendedManualTitle: `Manuales del módulo ${categoryName}`
    },
    {
      q: `8. En el flujo transaccional de ${categoryName}, ¿qué ocurre si un documento base ya fue cerrado por un documento destino?`,
      options: [
        "El documento base ya no puede ser modificado ni volver a utilizarse para generar más documentos destino por las cantidades cerradas.",
        "El documento base se borra permanentemente del disco duro.",
        "El documento base cambia automáticamente de moneda.",
        "Se duplican las cantidades en almacén."
      ],
      answer: 0,
      explanation: "El cierre de documentos base previene la doble facturación o el doble despacho, asegurando control estricto.",
      topic: `Control de Cantidades Abiertas y Cerradas`,
      recommendedManualTitle: `Manuales del módulo ${categoryName}`
    },
    {
      q: `9. Para asegurar la consistencia antes de emitir los estados financieros relacionados con ${categoryName}, ¿qué proceso de control se debe ejecutar?`,
      options: [
        "La Reconciliación Interna y verificación de saldos de cuentas de control.",
        "Formatear el servidor de correo electrónico.",
        "Imprimir todos los documentos y pesarlos en una balanza.",
        "Cambiar los nombres de las cuentas contables."
      ],
      answer: 0,
      explanation: "La reconciliación interna cruza créditos y débitos de socios de negocios y cuentas de mayor para depurar saldos pendientes.",
      topic: `Reconciliación y Cuadre Financiero`,
      recommendedManualTitle: `Manuales del módulo ${categoryName}`
    },
    {
      q: `10. ¿Qué beneficio aporta la aprobación de la certificación en ${categoryName} (con más del 90%) en el expediente profesional de B1 Academy?`,
      options: [
        "Permite calificar a la evaluación presencial técnica y semi-oral con reclutadores para la vinculación en la Bolsa de Empleo.",
        "Exonera al estudiante de trabajar en empresas reales.",
        "Le otorga permisos de administrador absoluto en cualquier servidor de SAP del mundo.",
        "Sustituye la necesidad de contar con licencias de software oficial."
      ],
      answer: 0,
      explanation: "Los certificados de B1 Academy acreditan las horas de capacitación requeridas para calificar a las entrevistas técnicas con partners oficiales de SAP.",
      topic: `Vinculación a la Bolsa de Empleo`,
      recommendedManualTitle: `Manuales del módulo ${categoryName}`
    }
  ];

  return {
    categoryName,
    badgeTitle: `Especialista Certificado en ${categoryName}`,
    description: `Examen riguroso de 10 preguntas sobre procesos empresariales, parametrización, asientos contables y auditoría de ${categoryName} en SAP Business One. Requiere un 90% (9/10) para aprobar.`,
    passingScore: 9,
    questions: baseQuestions
  };
}
