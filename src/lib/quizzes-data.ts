export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const TRACK_QUIZZES: Record<string, QuizQuestion[]> = {
  'SAP-B1-CORE': [
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

  'HEIN-NOM-EC': [
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
      explanation: 'El décimo cuarto sueldo o bono escolar equivale estrictamente a un SBU ($482 en 2026), sin incluir comisiones ni horas extras.'
    }
  ],

  'HEIN-HCM-TALENT': [
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
  ]
};
