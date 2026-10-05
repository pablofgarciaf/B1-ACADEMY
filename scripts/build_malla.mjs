// Genera la malla curricular de Mi Aula a partir de una definición compacta.
// Salidas: src/content/malla/malla.json  y  docs/12_Malla_Curricular.md
// Valida que los manuales aparezcan EXACTAMENTE una vez.
// Uso: node scripts/build_malla.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

// ---------- 1. Manuales reales (fuente: manuals-120-data.ts) ----------
const ts = fs.readFileSync(path.join(ROOT, 'src/lib/manuals-120-data.ts'), 'utf8');
const re = /"id": "([^"]+)",\s*"number": (\d+),[\s\S]*?"title": "([^"]*)",\s*"category": "([^"]*)"/g;
const MANUALS = new Map();
for (const m of ts.matchAll(re)) {
  const n = Number(m[2]);
  if (!MANUALS.has(n)) MANUALS.set(n, { number: n, id: m[1], title: m[3], category: m[4] });
}
if (MANUALS.size !== 120) throw new Error(`Se esperaban manuales y se leyeron ${MANUALS.size}`);

// ---------- 2. Definición de la malla ----------
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const MODULES = [
  {
    id: 'M01', career: 'C01', name: 'Primer contacto con SAP Business One',
    purpose: 'Entender qué es un ERP, cómo se organiza SAP Business One y moverse por el sistema con soltura.',
    question: '¿Dónde está la información de mi empresa y cómo la encuentro?',
    manuals: [1, 2, 3, 117, 118], requires: [],
    extra: ['Qué es un ERP y para qué sirve a una empresa', 'Una empresa = una base de datos: arquitectura, HANA frente a SQL Server, nube frente a instalación local']
  },
  {
    id: 'M02', career: 'C01', name: 'Fundamentos contables para operar el ERP',
    purpose: 'Leer y predecir asientos: debe y haber, balance, estado de resultados y asientos automáticos.',
    question: '¿Qué le pasa a la contabilidad cada vez que registro un documento?',
    manuals: [26, 27], requires: [],
    extra: ['Debe, haber, balance general y estado de resultados desde cero', 'IVA: crédito y débito fiscal en una factura']
  },
  {
    id: 'M03', career: 'C01', name: 'Socios de negocios y artículos: los datos maestros',
    purpose: 'Crear y mantener clientes, proveedores y artículos, y entender por qué su calidad define la de todos los informes.',
    question: '¿Qué campo del maestro cambia qué informe?',
    manuals: [57, 58, 108], requires: ['M01'],
    extra: ['Calidad de datos maestros: qué campos alteran los informes']
  },
  {
    id: 'M04', career: 'C01', name: 'Unidades de medida y empaque',
    purpose: 'Comprar, almacenar y vender en unidades distintas sin descuadrar el inventario.',
    question: '¿Cómo compro en cajas, guardo en unidades y vendo en pallets?',
    manuals: [59, 64, 65, 66], requires: ['M03'], extra: []
  },

  {
    id: 'M05', career: 'C02', name: 'Ciclo de compras (Procure-to-Pay)',
    purpose: 'Controlar la compra desde la solicitud hasta el pago, con recepción parcial, devoluciones y la cuenta puente.',
    question: '¿Qué recibimos, qué debemos y cuándo pagamos?',
    manuals: [98, 99, 100, 101, 102, 103, 119, 120], requires: ['M03', 'M02'], extra: []
  },
  {
    id: 'M06', career: 'C02', name: 'Costos de importación y portes (Landed Costs)',
    purpose: 'Incorporar fletes, seguros y aranceles al costo del artículo para conocer el margen real.',
    question: '¿Cuánto me cuesta realmente lo que importé?',
    manuals: [104, 105], requires: ['M05'],
    extra: ['Cómo el flete y los aranceles cambian el costo unitario y el margen']
  },

  {
    id: 'M07', career: 'C03', name: 'Ciclo de ventas (Order-to-Cash)',
    purpose: 'Llevar la venta de la oferta al cobro, con automatización, devoluciones y notas de crédito.',
    question: '¿Qué prometimos, qué entregamos, qué facturamos y qué nos deben?',
    manuals: [106, 107, 110, 111, 112], requires: ['M03', 'M02'],
    extra: ['Del pedido al cobro: qué registra cada documento y cómo comprobarlo (clase piloto: src/content/lessons/m03-c01-order-to-cash.md)']
  },
  {
    id: 'M08', career: 'C03', name: 'Precios, descuentos y márgenes',
    purpose: 'Definir listas de precios, descuentos y precios especiales sabiendo su efecto en el margen.',
    question: '¿A qué precio vendo y cuánto gano en cada venta?',
    manuals: range(81, 86), requires: ['M07'],
    extra: ['Margen frente a markup: cómo calcularlos y compararlos']
  },

  {
    id: 'M09', career: 'C08', name: 'CRM y servicio postventa',
    purpose: 'Gestionar oportunidades, tarjetas de equipo, contratos de servicio y llamadas con SLA.',
    question: '¿Cómo cuido al cliente antes y después de la venta?',
    manuals: [109, 113], requires: ['M07'], extra: []
  },
  {
    id: 'M23', career: 'C08', name: 'Gestión de proyectos y facturación por hitos',
    purpose: 'Controlar etapas, presupuesto y facturación de proyectos con visión de rentabilidad.',
    question: '¿Está siendo rentable este proyecto hoy, no al final del mes?',
    manuals: [96, 97], requires: ['M07', 'M05'], extra: []
  },

  {
    id: 'M10', career: 'C04', name: 'Almacenes, movimientos e inventario físico',
    purpose: 'Controlar existencias entre almacenes, traslados, consignación y conteos.',
    question: '¿Qué hay, dónde está y cuánto vale?',
    manuals: [60, 61, 68, 69, 70, 71], requires: ['M03', 'M04'], extra: []
  },
  {
    id: 'M11', career: 'C04', name: 'Valoración de inventario, lotes y series',
    purpose: 'Elegir y entender el método de valoración y la trazabilidad por lote y serie.',
    question: '¿Cómo decide el método de costeo cuánto gano y cuánto impuesto pago?',
    manuals: [62, 63, 67], requires: ['M10'],
    extra: ['Cómo el método de valoración cambia el costo de ventas y el impuesto']
  },
  {
    id: 'M12', career: 'C04', name: 'Ubicaciones en almacén (Bin Locations)',
    purpose: 'Operar bodegas grandes por pasillo, estantería y casilla.',
    question: '¿En qué casilla exacta está lo que el cliente necesita hoy?',
    manuals: range(72, 77), requires: ['M10'], extra: []
  },

  {
    id: 'M13', career: 'C05', name: 'Producción: recetas, recursos y órdenes',
    purpose: 'Modelar listas de materiales y recursos y ejecutar órdenes de producción.',
    question: '¿Qué necesito para fabricar y cuánto me cuesta?',
    manuals: range(87, 93), requires: ['M10'], extra: []
  },
  {
    id: 'M14', career: 'C05', name: 'Contabilidad y costo de producción',
    purpose: 'Seguir el costo desde las materias primas hasta el producto terminado y sus desviaciones.',
    question: '¿Por qué el costo real no coincide con el estándar?',
    manuals: [94, 95], requires: ['M13', 'M16'], extra: []
  },
  {
    id: 'M15', career: 'C05', name: 'Planificación de necesidades (MRP)',
    purpose: 'Calcular qué comprar o fabricar, cuánto y cuándo, usando demanda y pronósticos.',
    question: '¿Qué debo pedir hoy para no quedarme sin stock ni sobrecomprar?',
    manuals: [78, 79, 80], requires: ['M13', 'M05'], extra: []
  },

  {
    id: 'M16', career: 'C06', name: 'Plan de cuentas, monedas y determinación de cuentas',
    purpose: 'Estructurar el plan de cuentas y definir a qué cuenta va cada transacción.',
    question: '¿Por qué este documento contabilizó en esta cuenta?',
    manuals: range(45, 50), requires: ['M02'], extra: []
  },
  {
    id: 'M17', career: 'C06', name: 'Asientos, períodos y cierre contable',
    purpose: 'Registrar asientos, plantillas y vouchers, y cerrar períodos y conciliaciones internas.',
    question: '¿Cómo cierro el mes con la certeza de que todo cuadra?',
    manuals: range(39, 44), requires: ['M16'], extra: []
  },
  {
    id: 'M18', career: 'C06', name: 'Tesorería: cobros, pagos y conciliación bancaria',
    purpose: 'Gestionar medios de pago, pagos masivos y conciliar contra el extracto del banco.',
    question: '¿Cuánta caja tengo realmente y qué falta conciliar?',
    manuals: [28, 29, 30], requires: ['M17'], extra: []
  },
  {
    id: 'M19', career: 'C06', name: 'Activos fijos',
    purpose: 'Capitalizar, depreciar, ajustar y dar de baja activos con su impacto contable.',
    question: '¿Cuánto vale hoy cada activo y cuándo deja de ser útil?',
    manuals: range(51, 56), requires: ['M16'], extra: []
  },

  {
    id: 'M20', career: 'C07', name: 'Informes financieros y de caja',
    purpose: 'Leer balances, flujo de caja, antigüedad de saldos y cobranza, y saber comprobarlos.',
    question: '¿Puedo confiar en este informe?',
    manuals: range(31, 34), requires: ['M17'],
    extra: ['Cómo verificar un informe: cuadre de auxiliares contra mayor']
  },
  {
    id: 'M21', career: 'C07', name: 'Costos, dimensiones y presupuestos',
    purpose: 'Analizar costos por centro y dimensión, ajustar costos y controlar presupuestos.',
    question: '¿Qué áreas y productos generan o consumen margen?',
    manuals: range(35, 38), requires: ['M20'],
    extra: ['Costos fijos y variables: cómo clasificarlos en cuentas y centros de costo', 'Punto de equilibrio y margen de contribución con datos del sistema']
  },
  {
    id: 'M22', career: 'C07', name: 'Consultas y analítica',
    purpose: 'Construir consultas propias y entender la capa analítica y los indicadores.',
    question: '¿Cómo obtengo la respuesta que ningún informe estándar me da?',
    manuals: [4, 10, 115, 116], requires: ['M01'],
    extra: ['Indicadores gerenciales: rotación de inventario, DSO/DPO y clasificación ABC']
  },

  {
    id: 'M24', career: 'C09', name: 'Metodología y arranque de implementación',
    purpose: 'Planificar una implementación, configurar los parámetros clave y cargar saldos de apertura.',
    question: '¿Qué decisiones de arranque no tienen marcha atrás?',
    manuals: range(11, 15), requires: ['M01'], extra: []
  },
  {
    id: 'M25', career: 'C09', name: 'Migración de datos (DTW y Excel)',
    purpose: 'Cargar datos maestros y documentos desde Excel sin duplicar saldos.',
    question: '¿Cómo migro la historia de la empresa sin corromper la contabilidad?',
    manuals: [16, 19, 20], requires: ['M24'], extra: []
  },
  {
    id: 'M26', career: 'C09', name: 'Usuarios, autorizaciones y numeración',
    purpose: 'Controlar quién ve y hace qué, y cómo se numeran documentos y maestros.',
    question: '¿Quién puede ver qué dato de mi empresa?',
    manuals: [17, 18, 21, 22], requires: ['M24'], extra: []
  },
  {
    id: 'M27', career: 'C09', name: 'Campos, valores y tablas definidos por el usuario',
    purpose: 'Extender el sistema con campos, valores y tablas propias sin romper el soporte.',
    question: '¿Cómo adapto SAP a lo que mi negocio necesita registrar?',
    manuals: [7, 8, 9], requires: ['M26'], extra: []
  },
  {
    id: 'M28', career: 'C09', name: 'Alertas, aprobaciones y plantillas del sistema',
    purpose: 'Automatizar avisos y aprobaciones y personalizar impresión, correo y pantallas.',
    question: '¿Cómo hago que el sistema avise y controle por excepción?',
    manuals: [5, 6, 23, 24, 25], requires: ['M26'], extra: []
  },
  {
    id: 'M29', career: 'C09', name: 'Soporte técnico y plataforma RSP',
    purpose: 'Diagnosticar, documentar y escalar incidentes con el modelo N1/N2/N3.',
    question: '¿Cuándo es un error del sistema y cuándo es un error de uso?',
    manuals: [114], requires: ['M24'], extra: []
  },

  // Extensión Ecuador: NO está en los manuales; requiere contenido propio (propuesto).
  {
    id: 'M30', career: 'C10', name: 'Facturación electrónica y retenciones SRI',
    purpose: 'Emitir comprobantes electrónicos y aplicar retenciones en la fuente en SAP B1.',
    question: '¿Cómo cumplo con el SRI sin trabajo manual?',
    manuals: [], requires: ['M07', 'M16'], status: 'propuesto', extra: []
  },
  {
    id: 'M31', career: 'C10', name: 'ATS y formularios SRI',
    purpose: 'Generar el ATS y cruzarlo contra los formularios 103 y 104.',
    question: '¿Mis declaraciones coinciden con mi contabilidad?',
    manuals: [], requires: ['M30'], status: 'propuesto', extra: []
  },
];

const CAREERS = [
  { id: 'C01', name: 'Fundamentos y Usuario Experto B1', level: 'OP', description: 'Base común: entender el sistema, la contabilidad que lo mueve y los datos maestros.' },
  { id: 'C02', name: 'Compras e Importaciones', level: 'OP', description: 'Del requerimiento al pago, con costo real de importación.' },
  { id: 'C03', name: 'Ventas y Estrategia de Precios', level: 'OP', description: 'Del cliente al cobro, con precios y márgenes bajo control.' },
  { id: 'C04', name: 'Logística, Inventarios y Bodegas', level: 'OP', description: 'Existencias, valoración, trazabilidad y bodegas por ubicación.' },
  { id: 'C05', name: 'Producción y Planificación (MRP)', level: 'ARQ', description: 'Recetas, órdenes, costo de fabricación y planificación de necesidades.' },
  { id: 'C06', name: 'Contabilidad y Finanzas', level: 'ARQ', description: 'Plan de cuentas, asientos, cierres, tesorería y activos fijos.' },
  { id: 'C07', name: 'Control de Gestión, Costos y Analítica', level: 'ARQ', description: 'Leer y verificar informes, costear, presupuestar y consultar datos.' },
  { id: 'C08', name: 'Servicio al Cliente y Proyectos', level: 'OP', description: 'CRM, postventa con SLA y proyectos con facturación por hitos.' },
  { id: 'C09', name: 'Consultoría, Implementación y Administración', level: 'ARQ', description: 'Implementar, migrar, asegurar, personalizar y dar soporte.' },
  { id: 'C10', name: 'Localización Ecuador (SRI)', level: 'ARQ', status: 'propuesto', description: 'Comprobantes electrónicos, retenciones y ATS (no cubierto por los manuales).' },
];

const CERTIFICACION = {
  porClase: 'Quiz de comprensión: aprobación con 90 % o más.',
  porModulo: 'Quizzes aprobados + defensa oral con Master B1 (mínimo 80 %).',
  porCarrera: 'Todos los módulos de la carrera aprobados + defensa oral integradora (mínimo 80 %). Diploma con hash SHA-256 y QR.',
  consultorIntegral: 'C01 completa + al menos 5 carreras de especialidad, incluidas C06 y C09. Examen en B1 Secure Exam Guard.',
};

const PRODUCCION = {
  voz: 'es-MX-JorgeNeural',
  nota: 'Voz documentada en los videos de los manuales CS (docs/07); se mantiene por continuidad. Por verificar qué voz usan los demás videos. Alternativas a probar para acento ecuatoriano: es-EC-LuisNeural, es-EC-AndreaNeural (hay que confirmar que edge-tts las ofrezca).',
  imagenes: 'Ilustración 2D plana (sin texto) generada con Gemini; diagramas con cifras como SVG/HTML.',
};

// ---------- 3. Validación ----------
const count = new Map();
for (const mod of MODULES) for (const n of mod.manuals) count.set(n, (count.get(n) || 0) + 1);
const missing = range(1, 120).filter((n) => !count.has(n));
const dup = [...count].filter(([, c]) => c > 1).map(([n]) => n);
const ids = new Set(MODULES.map((m) => m.id));
const badReq = MODULES.flatMap((m) => m.requires.filter((r) => !ids.has(r)).map((r) => `${m.id}->${r}`));
const careerIds = new Set(CAREERS.map((c) => c.id));
const badCareer = MODULES.filter((m) => !careerIds.has(m.career)).map((m) => m.id);
if (missing.length || dup.length || badReq.length || badCareer.length) {
  console.error('MALLA INVÁLIDA', { missing, dup, badReq, badCareer });
  process.exit(1);
}

// ---------- 4. Salida JSON ----------
const modules = MODULES.map((m) => ({
  ...m,
  status: m.status || 'definido',
  manuals: m.manuals.map((n) => MANUALS.get(n)),
  baseClasses: m.manuals.length,
  extraClasses: m.extra.length,
  integratorClass: m.manuals.length ? 1 : 0,
}));
const out = {
  version: '0.1-borrador', generado: new Date().toISOString().slice(0, 10),
  resumen: { carreras: CAREERS.length, modulos: modules.length, manuales: 120 },
  produccion: PRODUCCION, certificacion: CERTIFICACION,
  carreras: CAREERS.map((c) => ({ ...c, modules: modules.filter((m) => m.career === c.id).map((m) => m.id) })),
  modulos: modules.map(({ extra, ...rest }) => ({ ...rest, extra })),
};
fs.mkdirSync(path.join(ROOT, 'src/content/malla'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'src/content/malla/malla.json'), JSON.stringify(out, null, 2) + '\n');

// ---------- 5. Salida Markdown ----------
const L = [];
const tot = modules.reduce((a, m) => a + m.baseClasses + m.extraClasses + m.integratorClass, 0);
L.push('# 🎓 Malla Curricular de Mi Aula (borrador v0.1)', '');
L.push(`> Generada por \`scripts/build_malla.mjs\` desde los manuales. **Validada: los manuales aparecen exactamente una vez.**`, '');
L.push(`**${CAREERS.length} carreras · ${modules.length} módulos · ~${tot} clases maestras** (1 por manual + clases propias de la academia + 1 integradora por módulo).`, '');
L.push('## Reglas de la malla', '',
  '- Cada manual pertenece a **un solo módulo** (su "casa"); un módulo puede ser prerrequisito de otras carreras.',
  '- Cada clase explica **para qué** existe el tema, **qué dato aporta** el usuario, el **impacto contable/logístico** con ejemplo numérico y **cómo se verifica** en un informe.',
  '- *Clases propias*: temas que los manuales no cubren (fundamentos contables, punto de equilibrio, verificación de informes, etc.).',
  '- Los módulos marcados **propuesto** no tienen manuales de origen y requieren contenido propio.', '');
L.push('## Certificación', '', ...Object.entries(CERTIFICACION).map(([k, v]) => `- **${k}:** ${v}`), '');
L.push('## Producción de contenido', '', `- **Voz de los minivideos:** \`${PRODUCCION.voz}\`. ${PRODUCCION.nota}`, `- **Imágenes:** ${PRODUCCION.imagenes}`, '');
L.push('## Carreras y módulos', '');
for (const c of out.carreras) {
  L.push(`### ${c.id} · ${c.name} [${c.level}]${c.status ? ' — ' + c.status : ''}`, '', c.description, '');
  for (const mid of c.modules) {
    const m = modules.find((x) => x.id === mid);
    L.push(`#### ${m.id} · ${m.name}${m.status === 'propuesto' ? ' *(propuesto)*' : ''}`, '');
    L.push(`- **Propósito:** ${m.purpose}`, `- **Pregunta de negocio:** ${m.question}`);
    L.push(`- **Requiere:** ${m.requires.length ? m.requires.join(', ') : 'ninguno'}`);
    if (m.manuals.length) {
      L.push('- **Manuales de origen:**');
      for (const mm of m.manuals) L.push(`  - ${String(mm.number).padStart(3, '0')} · \`${mm.id}\``);
    }
    if (m.extra.length) { L.push('- **Clases propias de la academia:**'); for (const e of m.extra) L.push(`  - ${e}`); }
    L.push('');
  }
}
L.push('## Índice inverso: manual → módulo', '', '| # | Manual | Módulo |', '|---:|---|---|');
for (let n = 1; n <= 120; n++) {
  const mod = modules.find((m) => m.manuals.some((x) => x.number === n));
  L.push(`| ${n} | \`${MANUALS.get(n).id}\` | ${mod.id} |`);
}
L.push('');
fs.writeFileSync(path.join(ROOT, 'docs/12_Malla_Curricular.md'), L.join('\n'));

console.log(`OK · ${CAREERS.length} carreras · ${modules.length} módulos · 120/manuales asignados una vez · ~${tot} clases`);
