export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const TRACK_QUIZZES: Record<string, QuizQuestion[]> = {
  'SAP-B1-LOGISTICS': [
    {
      id: 1,
      question: '¿En qué ruta de SAP Business One se parametriza la Determinación de Cuentas de Mayor para compras, ventas e inventarios?',
      options: [
        'Gestión → Definiciones → Finanzas → Determinación de cuentas de mayor',
        'Ventas → Informes de ventas → Cuentas por cobrar',
        'Inventario → Gestión de artículos → Precios',
        'Herramientas → Consultas de usuario → Asientos'
      ],
      correctAnswer: 0,
      explanation: 'La Determinación de Cuentas de Mayor en Gestión define las cuentas imputables automáticas para cada operación comercial y de stock.'
    },
    {
      id: 2,
      question: 'En el ciclo Order-to-Cash, ¿qué documento genera la salida física de almacén y el asiento de Costo de Ventas?',
      options: [
        'La Oferta de Venta',
        'El Pedido de Cliente',
        'La Entrega (ODLN)',
        'La Solicitud de Anticipo'
      ],
      correctAnswer: 2,
      explanation: 'La Entrega (ODLN) es el documento que rebaja el inventario físico y debita el Costo de Ventas acreditando la cuenta de existencias.'
    },
    {
      id: 3,
      question: '¿Cuál es el utilitario oficial para realizar migraciones masivas de datos maestros (clientes, proveedores, artículos) en SAP B1?',
      options: [
        'Data Transfer Workbench (DTW)',
        'SAP Crystal Reports Viewer',
        'B1 Print & Delivery',
        'SAP Business One Service Manager'
      ],
      correctAnswer: 0,
      explanation: 'DTW permite importar archivos CSV hacia las tablas de base de datos garantizando la integridad referencial a través de la DI API.'
    }
  ],

  'SAP-LOC-EC': [
    {
      id: 1,
      question: '¿Cuál es la longitud exacta de la Clave de Acceso en los comprobantes electrónicos del SRI en Ecuador?',
      options: [
        '37 dígitos',
        '49 dígitos',
        '52 dígitos',
        '40 dígitos alfanuméricos'
      ],
      correctAnswer: 1,
      explanation: 'La clave de acceso del SRI tiene exactamente 49 caracteres numéricos calculados mediante el algoritmo Módulo 11.'
    },
    {
      id: 2,
      question: '¿Qué porcentaje de retención en la fuente del Impuesto a la Renta corresponde al código SRI 312 (Transferencia de bienes muebles)?',
      options: [
        '1.00%',
        '1.75%',
        '2.75%',
        '8.00%'
      ],
      correctAnswer: 1,
      explanation: 'El código 312 aplica una retención del 1.75% sobre la compra de bienes muebles corporales según la tabla vigente del SRI.'
    },
    {
      id: 3,
      question: '¿Qué estándar de firma digital es obligatorio para el archivo XML de comprobantes electrónicos en Ecuador?',
      options: [
        'XAdES-BES con algoritmo RSA-SHA1 o superior (.p12)',
        'Firma PGP ASCII Armor',
        'JSON Web Token (JWT)',
        'Firma digital MD5'
      ],
      correctAnswer: 0,
      explanation: 'El SRI estipula en su ficha técnica oficial el estándar XAdES-BES con certificado en formato PKCS#12 (.p12).'
    }
  ],

  'B1-NOM-EC': [
    {
      id: 1,
      question: 'Bajo el Código del Trabajo de Ecuador, ¿cuál es el divisor legal obligatorio para calcular el valor de la hora ordinaria?',
      options: [
        '160 horas (40h x 4 semanas)',
        '240 horas (30 días comerciales x 8 horas)',
        '180 horas',
        '200 horas'
      ],
      correctAnswer: 1,
      explanation: 'El artículo 55 del Código del Trabajo establece que el mes laboral consta de 30 días remunerados de 8 horas, resultando en un divisor de 240.'
    },
    {
      id: 2,
      question: '¿Cuáles son los porcentajes obligatorios de aporte al IESS para el sector privado en Ecuador?',
      options: [
        'Personal 9.45% y Patronal 12.15% (11.15% IESS + 1% SECAP/IECE)',
        'Personal 11.15% y Patronal 9.45%',
        'Personal 8.33% y Patronal 15.00%',
        'Personal 10.00% y Patronal 10.00%'
      ],
      correctAnswer: 0,
      explanation: 'El trabajador aporta el 9.45% de su materia gravada y el empleador aporta el 12.15% (11.15% patronal + 0.5% SECAP + 0.5% IECE).'
    },
    {
      id: 3,
      question: '¿Cuál es la base de cálculo del Décimo Cuarto Sueldo en Ecuador?',
      options: [
        'El promedio de todo lo ganado en el año',
        'Exactamente un Salario Básico Unificado (SBU) vigente sin importar el sueldo del colaborador',
        'El 50% de la remuneración mensual',
        'El equivalente al Décimo Tercer Sueldo'
      ],
      correctAnswer: 1,
      explanation: 'El décimo cuarto sueldo o bono escolar equivale estrictamente a un SBU, sin incluir comisiones ni horas extras.'
    }
  ],

  'B1-HCM-TALENT': [
    {
      id: 1,
      question: '¿Qué dimensiones cruza la Matriz Nine-Box en la evaluación del talento?',
      options: [
        'Desempeño Operativo en el eje X y Potencial de Crecimiento en el eje Y',
        'Antigüedad laboral en el eje X y Salario en el eje Y',
        'Horas de capacitación en el eje X y Puntualidad en el eje Y',
        'Nivel de estudios en el eje X y Edad en el eje Y'
      ],
      correctAnswer: 0,
      explanation: 'La matriz 9-Box mapea objetivamente el desempeño real pasado (eje X) frente al potencial futuro de desarrollo y liderazgo (eje Y).'
    },
    {
      id: 2,
      question: '¿Qué sesgo cognitivo ayuda a mitigar la sesión de calibración del comité de talento humano?',
      options: [
        'Efecto Halo y sesgo de benevolencia/severidad de los evaluadores',
        'Sesgo de confirmación contable',
        'Principio de Pareto',
        'Ley de rendimientos decrecientes'
      ],
      correctAnswer: 0,
      explanation: 'La calibración colegiada evita que una impresión positiva aislada (Efecto Halo) distorsione la evaluación real del colaborador.'
    }
  ],

  'SAP-VERT-EXP': [
    {
      id: 1,
      question: 'En la vertical bananera de Ecuador, ¿cuál es el precio regulatorio mínimo que no se puede infringir al liquidar al productor?',
      options: [
        'Precio Mínimo de Sustentación fijado por el Ministerio de Agricultura',
        'Precio spot del puerto de Hamburgo',
        'Costo promedio de inventario FIFO',
        'Valor CIF de aduana'
      ],
      correctAnswer: 0,
      explanation: 'El Precio Mínimo de Sustentación es ley de la República; pagar por debajo expone a la exportadora a sanciones y pérdida del cupo.'
    },
    {
      id: 2,
      question: 'En la industria camaronera acuícola, ¿cómo se configura arquitectónicamente el software para controlar el costo por ciclo biológico?',
      options: [
        'Definiendo cada piscina como un Centro de Costo analítico independiente en SAP B1',
        'Creando una cuenta contable separada por cada camarón sembrado',
        'Utilizando el módulo de servicios',
        'Registrando los costos como gastos administrativos indirectos'
      ],
      correctAnswer: 0,
      explanation: 'Asignar cada piscina como centro de costo permite imputar balanceado, diésel y mano de obra para calcular el costo por libra cosechada.'
    }
  ],

  'modulo-01': [
    {
      id: 1,
      question: '¿Cuál es el motor de base de datos in-memory sobre el cual está optimizado SAP Business One versión HANA?',
      options: [
        'Microsoft SQL Server',
        'SAP HANA',
        'Oracle Database',
        'IBM DB2'
      ],
      correctAnswer: 1,
      explanation: 'SAP HANA es la plataforma base de datos en memoria (in-memory) y de computación desarrollada por SAP para altísimo rendimiento.'
    },
    {
      id: 2,
      question: '¿Qué tecnología de interfaz de usuario utiliza SAP Business One para proporcionar una experiencia basada en web y roles?',
      options: [
        'SAP GUI',
        'Fiori',
        'Windows Forms',
        'Web Dynpro'
      ],
      correctAnswer: 1,
      explanation: 'Fiori es la filosofía y tecnología de diseño de experiencia de usuario (UX) de SAP basada en roles y accesible vía navegador.'
    },
    {
      id: 3,
      question: '¿Cómo se llama la funcionalidad en SAP Business One versión para SAP HANA que permite búsquedas de tipo Google en toda la base de datos?',
      options: [
        'Enterprise Search (Búsqueda Empresarial)',
        'Búsqueda Formateada',
        'Query Manager',
        'Búsqueda de Interlocutores'
      ],
      correctAnswer: 0,
      explanation: 'Enterprise Search, representada por el ícono de lupa superior, permite buscar cualquier término estructurado o no estructurado en el sistema completo.'
    },
    {
      id: 4,
      question: '¿Qué función permite a los usuarios guardar accesos directos a las pantallas más utilizadas en su Cockpit de SAP Business One?',
      options: [
        'Menú de Módulos',
        'Widget de Mensajes',
        'Widget de Favoritos o Mis Favoritos',
        'Alertas de Usuario'
      ],
      correctAnswer: 2,
      explanation: 'El Widget de Favoritos permite arrastrar funcionalidades al Cockpit, ahorrando tiempo en navegar por el menú tradicional.'
    },
    {
      id: 5,
      question: '¿Qué nivel de arquitectura representa el ejecutable instalado en la máquina del usuario (SAP Business One Client)?',
      options: [
        'Capa de base de datos',
        'Capa de presentación (Presentation Layer)',
        'Capa de lógica de negocio',
        'Capa de integración'
      ],
      correctAnswer: 1,
      explanation: 'El SAP B1 Client actúa como la Capa de Presentación, manejando la interfaz gráfica e interactuando con la lógica de negocio subyacente y la DB.'
    }
  ],

  'modulo-02': [
    {
      id: 1,
      question: '¿Cuál es el primer documento formal en el ciclo de compras de SAP B1 que internamente no genera un asiento contable?',
      options: [
        'Factura de Proveedores',
        'Pedido de Compra (Orden de Compra)',
        'Entrada de Mercancías',
        'Solicitud de Compra'
      ],
      correctAnswer: 3,
      explanation: 'La Solicitud de Compra es puramente informativa e interna. El Pedido de Compra compromete pero no asienta valor contable aún.'
    },
    {
      id: 2,
      question: '¿Qué documento en SAP Business One se utiliza para registrar la recepción física de artículos en el almacén?',
      options: [
        'Entrega de Compras',
        'Pedido de Entrada de Mercancías (GRPO)',
        'Factura de Reserva',
        'Solicitud de Devolución'
      ],
      correctAnswer: 1,
      explanation: 'El Pedido de Entrada de Mercancías (Goods Receipt PO) es el documento logístico que ingresa inventario físico al almacén y genera el pasivo no facturado provisional.'
    },
    {
      id: 3,
      question: '¿Qué herramienta de SAP B1 permite distribuir costos adicionales (como flete, aduana, seguros) al costo de inventario del artículo importado?',
      options: [
        'Precios de Entrega (Landed Costs)',
        'Revalorización de Inventario',
        'Asiento Manual',
        'Factura de Anticipo'
      ],
      correctAnswer: 0,
      explanation: 'El módulo de Precios de Entrega (Landed Costs) prorratea costos indirectos sobre los artículos basándose en peso, volumen o valor, incrementando su costo contable y real.'
    },
    {
      id: 4,
      question: '¿Qué sucede contablemente cuando se crea una Factura de Proveedor basándose en un Pedido de Entrada de Mercancías previo?',
      options: [
        'Se debita el Inventario y se acredita la Cuenta por Pagar',
        'Se debita la Cuenta de Asignación (Puente) y se acredita la Cuenta por Pagar de Proveedores',
        'No se genera asiento contable',
        'Se acredita la cuenta de Gastos y se debita Banco'
      ],
      correctAnswer: 1,
      explanation: 'El inventario ya fue debitado en la Entrada (GRPO) contra una cuenta puente de asignación; la Factura cierra la cuenta puente y genera la Cuenta por Pagar real.'
    },
    {
      id: 5,
      question: '¿Qué transacción se debe utilizar si se necesita devolver mercancía a un proveedor después de haber contabilizado la Factura de Proveedor?',
      options: [
        'Devolución de Mercancías',
        'Nota de Crédito de Compras',
        'Salida de Mercancías',
        'Cancelación de Factura'
      ],
      correctAnswer: 1,
      explanation: 'Si la Factura ya está creada, el inventario y la cuenta por pagar deben revertirse oficialmente usando una Nota de Crédito de Compras.'
    }
  ],

  'modulo-03': [
    {
      id: 1,
      question: '¿Qué documento de ventas en SAP B1 compromete el inventario para un cliente pero no reduce el stock físico de forma inmediata?',
      options: [
        'Oferta de Venta',
        'Pedido de Cliente',
        'Entrega',
        'Factura de Deudores'
      ],
      correctAnswer: 1,
      explanation: 'El Pedido de Cliente (Sales Order) reserva o "compromete" el inventario para asegurar la disponibilidad futura, sin descontarlo del físico real.'
    },
    {
      id: 2,
      question: '¿Qué documento en el proceso de ventas debita el Costo de Ventas y acredita el Inventario de manera automática por defecto?',
      options: [
        'Factura de Deudores',
        'Oferta de Venta',
        'Entrega (Delivery)',
        'Solicitud de Devolución'
      ],
      correctAnswer: 2,
      explanation: 'La Entrega (ODLN) retira los bienes físicos del almacén y efectúa el asiento de costo (Costo de Ventas vs Inventario).'
    },
    {
      id: 3,
      question: 'En SAP B1, ¿qué herramienta automatiza el proceso de creación de facturas masivas para clientes con contratos periódicos recurrentes?',
      options: [
        'Asistente de Pagos',
        'Asistente de Reclamación',
        'Asistente de Generación de Documentos Periódicos',
        'MRP'
      ],
      correctAnswer: 2,
      explanation: 'Las Operaciones Recurrentes y su asistente permiten programar y crear plantillas de documentos (ej. cobros de alquiler, pólizas) automáticamente con una frecuencia.'
    },
    {
      id: 4,
      question: '¿Qué tipo de registro en el CRM de SAP B1 permite planificar y registrar interacciones individuales como llamadas, notas o reuniones con interlocutores?',
      options: [
        'Campañas',
        'Oportunidades de Ventas',
        'Actividades',
        'Contratos de Servicio'
      ],
      correctAnswer: 2,
      explanation: 'Las "Actividades" son el componente base del CRM para agendar interacciones, asignar recordatorios a usuarios y llevar el registro de acciones pasadas.'
    },
    {
      id: 5,
      question: 'Si un cliente paga anticipadamente el total antes de que exista la mercancía, ¿qué documento de ventas permite cobrar y tributar sin afectar inventario?',
      options: [
        'Factura de Anticipo de Clientes',
        'Nota de Crédito',
        'Recibo de Producción',
        'Oferta de Venta'
      ],
      correctAnswer: 0,
      explanation: 'La Factura de Anticipo permite recaudar IVA y reconocer un pasivo hacia el cliente sin mover stock físico, permitiendo deducirla luego en la factura final.'
    }
  ],

  'modulo-04': [
    {
      id: 1,
      question: '¿Cuáles son los tres métodos estándar principales de valoración de inventario soportados por SAP Business One de forma nativa?',
      options: [
        'LIFO, FIFO y Promedio Móvil',
        'FIFO, Promedio Móvil y Precio Estándar',
        'LIFO, Promedio Móvil y Precio Estándar',
        'FIFO, LIFO y Precio Estándar'
      ],
      correctAnswer: 1,
      explanation: 'SAP B1 estándar no admite LIFO (Último en entrar, Primero en salir) para valoración, solo FIFO, Media Móvil y Costo Estándar.'
    },
    {
      id: 2,
      question: '¿Qué documento se utiliza para mover inventario de un almacén principal a una sucursal física dentro de la misma sociedad sin vender?',
      options: [
        'Entrada de Mercancías',
        'Traslado de Inventario (Transferencia de Stock)',
        'Salida de Mercancías',
        'Entrega'
      ],
      correctAnswer: 1,
      explanation: 'El Traslado de Inventario cambia la locación lógica o física (Almacén A a Almacén B) de los ítems sin generar ingresos o gastos, solo movimientos de cuentas de stock si las cuentas difieren.'
    },
    {
      id: 3,
      question: '¿Cómo se denomina en SAP B1 a la funcionalidad que permite segmentar de manera tridimensional los espacios dentro de un almacén (pasillo, nivel, rack)?',
      options: [
        'Gestión de Lotes',
        'Ubicaciones (Bin Locations)',
        'Almacenes Virtuales',
        'Grupos de Artículos'
      ],
      correctAnswer: 1,
      explanation: 'Las "Ubicaciones" o Bin Locations permiten encontrar un producto exactamente en una coordenada física dentro de una bodega mayor.'
    },
    {
      id: 4,
      question: '¿Qué método de seguimiento de artículos es ideal y mandatorio para productos con fecha de caducidad y trazabilidad (como farmacéuticos o alimentos)?',
      options: [
        'Números de Serie',
        'Gestión por Lotes (Batches)',
        'Ninguno',
        'Artículos Fantasma'
      ],
      correctAnswer: 1,
      explanation: 'La Gestión por Lotes permite rastrear la procedencia, fecha de expiración y distribución de un conjunto masivo de artículos fabricados juntos.'
    },
    {
      id: 5,
      question: '¿Qué documento permite ajustar estrictamente el costo monetario de un artículo en el sistema sin modificar en absoluto la cantidad física actual?',
      options: [
        'Revalorización de Inventario',
        'Entrada de Mercancías',
        'Recuento de Inventario',
        'Asiento de Ajuste'
      ],
      correctAnswer: 0,
      explanation: 'La Revalorización de Inventario permite corregir desviaciones de costo alterando el valor total del inventario contra una cuenta de mayor, manteniendo idéntico el stock físico.'
    }
  ],

  'modulo-05': [
    {
      id: 1,
      question: '¿Qué es una Lista de Materiales (BOM) en SAP Business One?',
      options: [
        'Un reporte estadístico de inventario disponible',
        'Una estructura (receta) que define los componentes, recursos y cantidades para fabricar un producto',
        'Un documento de orden de compra automática',
        'Una lista de precios especiales para proveedores'
      ],
      correctAnswer: 1,
      explanation: 'La Lista de Materiales (Bill Of Materials) es la receta estructural; especifica las materias primas y los tiempos (Recursos) necesarios para un producto final.'
    },
    {
      id: 2,
      question: '¿Qué tipo de Lista de Materiales se utiliza en ventas para ofrecer un "Kit" donde se vende un paquete, pero el almacén rebaja los componentes individuales?',
      options: [
        'Lista de Materiales de Producción',
        'Lista de Materiales de Montaje',
        'Lista de Materiales de Ventas',
        'Lista de Materiales Fantasma'
      ],
      correctAnswer: 2,
      explanation: 'La Lista de Materiales de Ventas muestra en el documento comercial el ítem "padre" y sus "hijos", deduciendo el inventario de los componentes hijos al facturar.'
    },
    {
      id: 3,
      question: '¿Cuál es el propósito medular de ejecutar el Asistente MRP en SAP Business One?',
      options: [
        'Contabilizar asientos de producción manual automáticamente',
        'Generar recomendaciones consolidadas de compras y producción basadas en pronósticos y pedidos',
        'Calcular únicamente los costos indirectos de fabricación mensuales',
        'Auditar el uso correcto de las ubicaciones en bodegas'
      ],
      correctAnswer: 1,
      explanation: 'El MRP (Material Requirements Planning) analiza demanda vs abastecimiento actual y sugiere (recomienda) exactamente qué, cuándo y cuánto comprar o fabricar.'
    },
    {
      id: 4,
      question: 'En una Orden de Producción, ¿qué método de emisión rebaja el inventario de componentes automáticamente al reportar la terminación del producto?',
      options: [
        'Emisión Manual',
        'Backflush (Notificación retroactiva)',
        'Cálculo Promedio',
        'FIFO'
      ],
      correctAnswer: 1,
      explanation: 'La emisión "Backflush" simplifica el registro asumiendo que al recibir el producto terminado, los componentes proporcionales teóricos de la receta se consumieron automáticamente.'
    },
    {
      id: 5,
      question: '¿Qué entidad en SAP B1 se usa para modelar maquinaria o mano de obra necesaria en el proceso productivo y así medir su capacidad disponible?',
      options: [
        'Centro de Costos',
        'Grupos de Artículos',
        'Recursos',
        'Activos Fijos'
      ],
      correctAnswer: 2,
      explanation: 'Los "Recursos" permiten definir capacidades (en horas o ciclos) de personas o máquinas y se incorporan como líneas a la Lista de Materiales y Rutas.'
    }
  ],

  'modulo-06': [
    {
      id: 1,
      question: '¿Qué registro maestro del módulo de Servicio documenta específicamente un artículo individualizado (con número de serie) adquirido por un cliente y su vigencia de garantía?',
      options: [
        'Tarjeta de Equipo del Cliente',
        'Contrato de Servicio',
        'Llamada de Servicio',
        'Oportunidad de Ventas'
      ],
      correctAnswer: 0,
      explanation: 'La Tarjeta de Equipo rastrea qué cliente posee qué número de serie en particular, junto con su historial de llamadas de servicio asociadas.'
    },
    {
      id: 2,
      question: '¿Qué documento ampara legal y funcionalmente los tiempos de respuesta prometidos y el nivel de servicio acordado (SLA) con un cliente?',
      options: [
        'Tarjeta de Equipo',
        'Contrato de Servicio',
        'Oferta de Venta',
        'Base de Conocimientos'
      ],
      correctAnswer: 1,
      explanation: 'El Contrato de Servicio (Service Contract) define los periodos de cobertura (oro, plata, bronce), horarios, y tiempos de resolución garantizados para las incidencias.'
    },
    {
      id: 3,
      question: 'Cuando un cliente reporta un incidente, queja o desperfecto técnico, ¿qué documento dinámico se abre en SAP B1 para gestionarlo?',
      options: [
        'Actividad de CRM',
        'Llamada de Servicio',
        'Reclamación Financiera',
        'Nota de Crédito'
      ],
      correctAnswer: 1,
      explanation: 'La Llamada de Servicio sirve como ticket del Help Desk; centraliza el problema, la solución, gastos derivados, y controla los tiempos del SLA.'
    },
    {
      id: 4,
      question: '¿Qué herramienta integrada del módulo de Servicio permite almacenar procedimientos conocidos de solución de problemas para facilitar futuras respuestas?',
      options: [
        'Base de Datos de Conocimientos (Soluciones)',
        'Informes de Servicio Diarios',
        'Anexos y Diagramas',
        'Campos Definidos por Usuario'
      ],
      correctAnswer: 0,
      explanation: 'La Base de Datos de Soluciones (Knowledge Base) actúa como una wiki interna, sugiriendo artículos a los agentes en base a síntomas o códigos de error recurrentes.'
    },
    {
      id: 5,
      question: 'Al crear un ticket o Llamada de Servicio, ¿es absolutamente mandatorio relacionarlo a un Número de Artículo y Número de Serie específico?',
      options: [
        'No, se pueden abrir llamadas generales o de tipo "No relacionado a Artículo"',
        'Sí, el sistema impide guardar si no hay un artículo asociado',
        'Solo es obligatorio si el cliente tiene un Contrato Oro',
        'Depende exclusivamente de si el cliente es corporativo'
      ],
      correctAnswer: 0,
      explanation: 'Existen llamadas de tipo "General" (por ejemplo dudas de facturación o fallas generales) que no requieren estar ligadas a un número de serie o artículo físico particular.'
    }
  ],

  'modulo-07': [
    {
      id: 1,
      question: '¿Qué estructura jerárquica permite dividir un proyecto grande o prolongado en fases manejables (como diseño, construcción, entrega)?',
      options: [
        'Etapas y Subproyectos',
        'Tareas y Actividades',
        'Fases y Entregables',
        'Hitos y Tareas'
      ],
      correctAnswer: 0,
      explanation: 'SAP B1 permite la estructura de Proyecto -> Subproyecto -> Etapas, lo que permite acumular presupuestos y progresos de lo particular a lo general.'
    },
    {
      id: 2,
      question: '¿Qué herramienta permite automatizar la creación masiva de facturas ligadas a los hitos que se van cumpliendo en múltiples proyectos?',
      options: [
        'Asistente de Facturación de Proyectos',
        'Asistente MRP',
        'Asistente de Reclamación',
        'Factura de Reserva'
      ],
      correctAnswer: 0,
      explanation: 'El Asistente de Facturación de Proyectos escanea los proyectos activos buscando etapas finalizadas "facturables" o costos repercutibles para consolidarlos en facturas de venta.'
    },
    {
      id: 3,
      question: '¿Cuál es la manera estándar en SAP B1 de garantizar que un gasto de compra específico afecte financieramente el P&L (Estado de Resultados) de un Proyecto?',
      options: [
        'Seleccionando o escribiendo el Código de Proyecto Financiero directamente en la cabecera o las líneas del documento de compra',
        'Usando solo un Centro de Costo',
        'A través del módulo de Activos Fijos',
        'Creando un almacén especial llamado igual al proyecto'
      ],
      correctAnswer: 0,
      explanation: 'Vincular el "Código de Proyecto" en el nivel de línea o documento permite que SAP etiquete el apunte contable y pueda extraer reportes de pérdidas y ganancias por proyecto.'
    },
    {
      id: 4,
      question: '¿Qué tipo de proyecto se define en SAP B1 para inversiones exclusivas de la empresa (como construir una nueva planta) y no para venta a clientes?',
      options: [
        'Proyecto Externo',
        'Proyecto Interno',
        'Proyecto de Capital',
        'Proyecto de Investigación'
      ],
      correctAnswer: 1,
      explanation: 'Los "Proyectos Internos" no requieren la asociación a un Socio de Negocios (Cliente) principal y se utilizan para controlar presupuestos de gastos de inversión.'
    },
    {
      id: 5,
      question: '¿Qué herramienta gráfica incorporada en la ventana del Proyecto permite visualizar de manera temporal la secuencia de etapas y dependencias?',
      options: [
        'Gráfico de Pareto',
        'Diagrama de Gantt Interactivo',
        'Tablero Kanban',
        'Mapa de Relaciones Contables'
      ],
      correctAnswer: 1,
      explanation: 'El Diagrama de Gantt proyecta las etapas definidas visualmente a lo largo de un calendario, permitiendo observar solapamientos, fechas de inicio y fin proyectadas.'
    }
  ],

  'modulo-08': [
    {
      id: 1,
      question: '¿En qué ruta se configuran a nivel granular los permisos de lectura, escritura o bloqueo a las distintas ventanas de SAP B1?',
      options: [
        'Recursos Humanos -> Empleados',
        'Gestión -> Definiciones -> General -> Usuarios',
        'Gestión -> Inicialización del Sistema -> Autorizaciones -> Autorizaciones Generales',
        'Gestión de Alarmas y Alertas'
      ],
      correctAnswer: 2,
      explanation: 'En las Autorizaciones Generales se despliega un árbol completo de módulos y ventanas donde al usuario o grupo de usuarios se le asignan derechos.'
    },
    {
      id: 2,
      question: '¿Qué herramienta oficial de SAP permite importar volúmenes masivos de datos desde archivos planos (CSV, TXT) a la base de datos validando integridad?',
      options: [
        'SAP Lumira',
        'Data Transfer Workbench (DTW)',
        'Crystal Reports',
        'Data Upload Manager'
      ],
      correctAnswer: 1,
      explanation: 'El Data Transfer Workbench (DTW) es la utilidad puente que consume la DI API de SAP B1 para insertar, actualizar o borrar masivamente asegurando la lógica del negocio.'
    },
    {
      id: 3,
      question: '¿Qué funcionalidad define cómo será la secuencia, longitud y prefijo de los números asignados a las facturas y otros comprobantes?',
      options: [
        'Numeración de Documentos',
        'Búsqueda Formateada',
        'Parámetros de Impresión',
        'Periodos Contables'
      ],
      correctAnswer: 0,
      explanation: 'La Numeración de Documentos agrupa series de folios asignables por sucursal, documento o periodo fiscal asegurando correlatividad legal.'
    },
    {
      id: 4,
      question: '¿Cómo se puede evitar temporalmente que los usuarios regulares se logueen en la base de datos mientras el administrador aplica un parche o mantenimiento?',
      options: [
        'Desconectando el cable de red del servidor SQL',
        'Bloqueando manualmente uno a uno a cada usuario',
        'Marcando la opción "Bloquear base de datos a accesos de usuario" en Gestión -> Seleccionar sociedad',
        'Borrando el archivo b1-local-machine.xml'
      ],
      correctAnswer: 2,
      explanation: 'En la pantalla de selección de sociedad, el administrador puede bloquear temporalmente la DB impidiendo nuevos logins excepto de usuarios Super-User.'
    },
    {
      id: 5,
      question: '¿Qué mecanismo estándar e interno advierte a un usuario por medio de un mensaje emergente que el inventario de un artículo ha caído por debajo de su stock mínimo?',
      options: [
        'Alerta de Desviación de Presupuesto',
        'Mensaje de Sistema Estático',
        'Alerta Definida por el Usuario basada en Consulta SQL',
        'Alerta de Gestión Estándar de Desviación de Stock'
      ],
      correctAnswer: 3,
      explanation: 'SAP B1 trae preconfiguradas alertas nativas de gestión, como la de "Desviación de Stock Mínimo", que se activan marcando la casilla sin necesidad de programar SQL.'
    }
  ],

  'modulo-09': [
    {
      id: 1,
      question: '¿Qué herramienta de monitorización instalada en el entorno SAP B1 envía diagnósticos proactivos de la salud del servidor y realiza respaldos automáticos?',
      options: [
        'Remote Support Platform (RSP)',
        'SAP Solution Manager',
        'Early Watch Alert (EWA)',
        'System Landscape Directory (SLD)'
      ],
      correctAnswer: 0,
      explanation: 'RSP es obligatorio; automatiza tareas de mantenimiento de DB, parches pre-aprobados, y comunica el estado del sistema al Partner y a SAP para soporte preventivo.'
    },
    {
      id: 2,
      question: '¿Cuál es el portal web oficial y unificado de SAP donde los clientes, usuarios administradores y partners descargan software, licencias y contactan soporte de SAP global?',
      options: [
        'SAP Service Marketplace (obsoleto)',
        'SAP for Me',
        'SAP PartnerEdge',
        'SAP Community Network'
      ],
      correctAnswer: 1,
      explanation: 'SAP for Me reemplazó al clásico Service Marketplace y Launchpad como la entrada central para gestionar portfolios en la nube y on-premise, y crear incidentes de soporte.'
    },
    {
      id: 3,
      question: 'En un modelo de escalamiento estándar de soporte IT de SAP B1, ¿qué actor asume el rol de Nivel 1 (N1)?',
      options: [
        'Desarrolladores base de SAP en Alemania o Israel',
        'Soporte técnico y funcional de consultoría del Partner implementador',
        'El equipo interno o Key Users (Help Desk) propios del Cliente',
        'Auditores externos del sistema'
      ],
      correctAnswer: 2,
      explanation: 'El soporte N1 (Tier 1) es el primer contacto y debe ser proporcionado por la mesa de ayuda interna o usuarios clave de la compañía cliente para filtrar errores básicos.'
    },
    {
      id: 4,
      question: '¿Qué son las "SAP Notes" (Notas SAP)?',
      options: [
        'Documentación técnica y correcciones (parches, workarounds) publicadas oficialmente por SAP respecto a bugs o funcionamientos del producto',
        'Notas internas (Post-its) en el Cockpit del usuario',
        'Manuales de usuario final genéricos',
        'Reportes de estado de ventas'
      ],
      correctAnswer: 0,
      explanation: 'Una SAP Note es el documento fundamental del ecosistema de soporte de SAP, detallando síntomas, causas y soluciones a un problema técnico documentado.'
    },
    {
      id: 5,
      question: 'Para análisis de cuellos de botella de rendimiento (performance) en SAP HANA, ¿qué acción es rutinariamente recomendada generar para enviar a SAP Global?',
      options: [
        'Un Full System Info Dump (FSID) o volcado completo de HANA',
        'Un SQL Server Profiler Trace clásico',
        'Solo el archivo de log plain text (b1.log)',
        'Exportar el visor de eventos de Windows'
      ],
      correctAnswer: 0,
      explanation: 'El FSID contiene los logs, traces, y el estado de la base de datos de HANA sin incluir los datos transaccionales de los clientes, permitiendo a SAP depurar fallos en C/C++ y memoria.'
    }
  ],

  'modulo-10': [
    {
      id: 1,
      question: '¿Cuál es la matriz que automatiza que las transacciones generen asientos contables en las cuentas correctas sin intervención manual del usuario?',
      options: [
        'Determinación de Cuentas de Mayor',
        'Reconciliación Interna',
        'Modelos de Asiento',
        'Contabilidad de Costos'
      ],
      correctAnswer: 0,
      explanation: 'La Determinación de Cuentas de Mayor asigna qué cuenta de gastos, inventario o ingresos impactará la operación dependiendo del almacén, grupo de artículos o cliente.'
    },
    {
      id: 2,
      question: '¿Qué herramienta funcional permite emparejar y cruzar masivamente los cobros y pagos asentados en SAP con el estado de cuenta (extracto) descargado del banco?',
      options: [
        'Asistente de Pagos',
        'Procesamiento de Extractos Bancarios (Reconciliación Externa)',
        'Asiento Manual',
        'Gestión de Cheques Postdatados'
      ],
      correctAnswer: 1,
      explanation: 'El procesamiento de extractos asocia automáticamente movimientos del sistema (libros) con las líneas importadas del banco para tener el saldo contable real.'
    },
    {
      id: 3,
      question: '¿Qué utilitario se utiliza para programar y generar pagos en bloque a múltiples proveedores (transferencias masivas o cheques) y cobrar facturas pendientes a clientes?',
      options: [
        'Factura de Anticipo',
        'Asistente de Pagos (Payment Wizard)',
        'Cobro Individual de Deudores',
        'Remesa de Efectivo'
      ],
      correctAnswer: 1,
      explanation: 'El Asistente de Pagos consolida y procesa facturas abiertas masivamente basadas en reglas, generando archivos bancarios y contabilizando los pagos en lote.'
    },
    {
      id: 4,
      question: '¿En qué módulo se centraliza el ciclo de vida, la capitalización, la contabilización de depreciación sistemática mensual y los retiros de los bienes de capital?',
      options: [
        'Gestión de Materiales',
        'Finanzas -> Activos Fijos',
        'Producción',
        'Inventario'
      ],
      correctAnswer: 1,
      explanation: 'El sub-módulo de Activos Fijos maneja de manera automatizada las áreas de depreciación, cálculos lineales o acelerados de los bienes duraderos como vehículos y máquinas.'
    },
    {
      id: 5,
      question: '¿Cómo se llama al proceso contable de "cruzar" o liquidar una Factura de Proveedor que está abierta (deuda) con su respectivo Pago Efectuado, cerrando ambas partidas?',
      options: [
        'Reconciliación Interna',
        'Reconciliación Externa',
        'Cierre de Periodo',
        'Asignación de Costos'
      ],
      correctAnswer: 0,
      explanation: 'La Reconciliación Interna (Internal Reconciliation) cruza partidas dentro de la contabilidad de una sola entidad (como los saldos al debe y haber de un mismo proveedor).'
    }
  ],

  'modulo-11': [
    {
      id: 1,
      question: '¿Qué significa el acrónimo UDF en el ecosistema de personalización de SAP Business One?',
      options: [
        'User Defined Function',
        'User Defined Field (Campo Definido por el Usuario)',
        'Universal Data Format',
        'Unified Data Flow'
      ],
      correctAnswer: 1,
      explanation: 'Los UDF permiten añadir campos nuevos no existentes por defecto (ej. "Talla", "Color") a ventanas y tablas estándar sin alterar el código fuente.'
    },
    {
      id: 2,
      question: '¿Qué característica permite desencadenar automáticamente una consulta SQL en un campo cuando otro campo cambia de valor en la pantalla (autocompletar)?',
      options: [
        'Búsquedas Formateadas (FMS - Formatted Search / User Defined Values)',
        'Transaction Notification',
        'Procedimiento de Aprobación',
        'Add-On en C#'
      ],
      correctAnswer: 0,
      explanation: 'La Búsqueda Formateada o Valores Definidos por Usuario asocia una Query a un campo (representado por una lupa) para obtener resultados dinámicamente.'
    },
    {
      id: 3,
      question: '¿Cuál es el único stored procedure avalado oficialmente por SAP para interceptar y bloquear transacciones no válidas antes de ser guardadas en la base de datos (sin programar Add-Ons)?',
      options: [
        'SBO_SP_PostTransactionNotice',
        'SBO_SP_TransactionNotification',
        'SBO_Update_MasterData',
        'SBO_Commit_Handler'
      ],
      correctAnswer: 1,
      explanation: 'El SBO_SP_TransactionNotification es un SP en SQL o HANA que SAP dispara antes de hacer el "commit", permitiendo retornar un código de error y abortar el insert/update si no se cumplen las reglas de negocio (ej. RUC inválido).'
    },
    {
      id: 4,
      question: 'En analítica avanzada con SAP HANA, ¿qué motor y tecnología permite crear tableros interactivos (dashboards), análisis penetrantes e indicadores clave de rendimiento (KPIs) de forma visual?',
      options: [
        'SAP Crystal Reports Viewer',
        'Pervasive Analytics para SAP HANA',
        'Asistente de Consultas Antiguo',
        'Impresión de Layouts (PLD)'
      ],
      correctAnswer: 1,
      explanation: 'Pervasive Analytics es el componente HTML5 dentro del cliente SAP HANA que permite diseñar KPIs, tableros y análisis incrustados directamente en el entorno de trabajo del usuario.'
    },
    {
      id: 5,
      question: '¿Qué funcionalidad nativa intercepta un documento recién creado y, si cumple una condición (ej. descuento superior al 10%), lo envía a la bandeja del gerente para su autorización?',
      options: [
        'Alerta de Sistema',
        'Transaction Notification',
        'Procedimientos de Aprobación (Approval Procedures)',
        'Workflow Manager'
      ],
      correctAnswer: 2,
      explanation: 'Los Procedimientos de Aprobación detienen la adición firme de un documento al sistema, dejándolo como "Borrador" hasta que los responsables lo aprueben o rechacen.'
    }
  ],

  'modulo-12': [
    {
      id: 1,
      question: '¿Cómo se denomina a la metodología de implementación oficial en fases desarrollada por SAP específicamente para acelerar la instalación y despliegue de SAP Business One?',
      options: [
        'ASAP (Accelerated SAP)',
        'SAP Activate',
        'AIP (Accelerated Implementation Program)',
        'Scrum B1'
      ],
      correctAnswer: 2,
      explanation: 'AIP provee una hoja de ruta estandarizada y plantillas de documentos dividida en fases: Preparación, Business Blueprint, Realización, Preparación Final y Go-Live.'
    },
    {
      id: 2,
      question: 'En un ciclo de proyecto, ¿cuál es el documento clave, firmado por el cliente, que mapea los procesos del negocio actual y establece exactamente cómo el sistema los cubrirá?',
      options: [
        'Plan de Proyecto de Gantt',
        'Business Blueprint (Plano Empresarial)',
        'Go-Live Checklist',
        'Manual de Usuario Final'
      ],
      correctAnswer: 1,
      explanation: 'El Business Blueprint se genera en la fase 2; es el contrato funcional del alcance técnico. Si un requerimiento no está en el blueprint, no se implementa o es cambio de alcance.'
    },
    {
      id: 3,
      question: '¿Qué herramienta empaquetada nativamente permite extraer parametrizaciones, campos UDFs y formatos de impresión de la Base de Datos "Test" y transportarlos a la Base de Datos "Productiva"?',
      options: [
        'Quick Copy',
        'Data Transfer Workbench',
        'Solution Packager',
        'Migración por Excel'
      ],
      correctAnswer: 0,
      explanation: 'Quick Copy permite exportar la configuración (no transacciones) a un archivo XML o transferirla directo de DB a DB de forma guiada.'
    },
    {
      id: 4,
      question: '¿Qué hito crítico en el cronograma marca el apagado o desuso del sistema legacy viejo y la entrada al sistema productivo con transacciones reales diarias?',
      options: [
        'Reunión de Lanzamiento (Kick-off)',
        'Salida en Vivo (Go-Live)',
        'Aprobación del Blueprint',
        'Carga Inicial'
      ],
      correctAnswer: 1,
      explanation: 'El Go-Live (Salida a producción) es el día 0 de la operación. Marca la transición final de la fase de implementación al uso regular de la herramienta por la compañía.'
    },
    {
      id: 5,
      question: 'Durante la etapa técnica de Cut-over (Transición), respecto a los datos transaccionales, ¿qué información típica se migra obligatoriamente al nuevo sistema SAP B1 para que contablemente inicie sano?',
      options: [
        'Saldos iniciales de cuentas contables, partidas abiertas consolidadas de clientes y proveedores, e inventario físico inicial (cantidades y costos)',
        'Todas las facturas cerradas históricas de los últimos 5 años línea por línea',
        'Solo el saldo de la caja chica',
        'Ninguno, los ERP se inicializan con saldos ceros sin importar el balance real'
      ],
      correctAnswer: 0,
      explanation: 'Las migraciones saludables no importan transacciones históricas cerradas (eso se guarda en un DW o sistema legacy de consulta), sino únicamente "saldos de apertura" en asientos, stocks e ítems vivos.'
    }
  ]
};
