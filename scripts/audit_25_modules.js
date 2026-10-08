const fs = require('fs');
const path = require('path');

// 1. Cargar datos maestros
const clasesAula = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/content/aula/clases.json'), 'utf8'));
const leccionesAula = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/content/aula/lecciones.json'), 'utf8'));
const malla = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/content/malla/malla.json'), 'utf8'));

// Simulación de pantallaConectada
function plano(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const REGLAS = [
  [/ruc del sistema|ingresar (el )?ruc/, { clave: 'empresa' }],
  [/comprobante de retencion|emitir (la )?retencion|generar (el )?comprobante|retencion electronica|comprobante electronico|guia de remision|autorizar.*sri|\bsri\b/, { clave: 'sri' }],
  [/utilidades de los trabajadores|participacion de (los )?trabajadores|impuesto a la renta (del ejercicio|anual|de la empresa)|cierre tributario|anticipo (de|del) impuesto/, { clave: 'cierreTributario' }],
  [/(^|[^a-z])isd([^a-z]|$)|salida de divisas|pago al exterior|pagos al exterior/, { clave: 'isd' }],
  [/pagos (efectuados|recibidos)|pagar (los )?sueldos|pagar (la )?planilla|pago.*proveedor|pagar.*proveedor|ejecutar pago/, { clave: 'bancos' }],
  [/(^|[^a-z])rol(es)?([^a-z]|$)|liquidar sueldos|ejecutar nomina/, { clave: 'nomina' }],
  [/nota de credito|abono de cliente/, { clave: 'documento', docType: 'credit_note' }],
  [/factura de proveedor|factura de acreedor/, { clave: 'documento', docType: 'vendor_invoice' }],
  [/entrada de mercanc|recepcion de mercanc|grpo/, { clave: 'documento', docType: 'goods_receipt' }],
  [/solicitud de compra/, { clave: 'documento', docType: 'purchase_request' }],
  [/convertir.*pedido|pedido de compra|orden de compra|compras.*pedido/, { clave: 'documento', docType: 'purchase_order' }],
  [/nota de credito de cliente|nota de credito de venta|nota de credito de deudor/, { clave: 'documento', docType: 'credit_note' }],
  [/factura de (cliente|deudor|venta)/, { clave: 'documento', docType: 'invoice' }],
  [/entrega/, { clave: 'documento', docType: 'delivery' }],
  [/pedido de cliente|orden de venta|pedido de venta/, { clave: 'documento', docType: 'order' }],
  [/oferta de venta|cotizacion de venta|cotizacion a cliente/, { clave: 'documento', docType: 'quotation' }],
  [/proveedor/, { clave: 'proveedor' }],
  [/(socio|interlocutor)[^>]*(datos maestros|maestro)|crear (nuevo )?cliente|nuevo cliente/, { clave: 'cliente' }],
  [/datos maestros de articulo|maestro de articulo|crear (nuevo )?articulo|nuevo articulo/, { clave: 'articulo' }],
  [/asiento/, { clave: 'asiento' }],
  [/activos? fijos?|capitalizacion|depreciacion/, { clave: 'activos' }],
  [/lista de materiales|bom\b/, { clave: 'bom' }],
  [/orden de produccion|orden de fabricacion/, { clave: 'produccion' }],
  [/transferencia/, { clave: 'transferencia' }],
  [/inventario fisico|recuento de inventario|recuento de stock|resultado de conteo|conteo.*stock|conteo.*inventario/, { clave: 'conteo' }],
  [/descuento/, { clave: 'descuentos' }],
  [/lista(s)? de precios/, { clave: 'precios' }],
  [/pago|cobro|banco|reconcilia|conciliacion/, { clave: 'bancos' }],
  [/empleado/, { clave: 'empleado' }],
  [/oportunidad/, { clave: 'oportunidad' }],
  [/detalles de la empresa/, { clave: 'empresa' }],
  [/presupuesto/, { clave: 'presupuesto' }],
  [/cierre de periodo|periodos contables|cierre del ejercicio/, { clave: 'cierre' }],
  [/costos? de importacion|gastos de envio|landed/, { clave: 'importacion' }],
  [/mrp|planificacion de necesidades|datos de planificacion|parametros de planificacion/, { clave: 'mrp' }],
  [/generador de consultas|consulta sql|query|crear consulta|asistente.*consulta|consulta.*variable|consulta.*fecha/, { clave: 'consultas' }],
  [/comprobante electronico|retencion electronica|sri/, { clave: 'sri' }],
  [/cliente potencial|registrar cliente|convertir.*potencial|potencial.*cliente/, { clave: 'cliente' }],
  [/grupo de clientes|grupo de socios|grupo.*clientes/, { clave: 'grupos', tipo: 'cliente' }],
  [/grupo.*articulo|grupo cable/, { clave: 'grupos', tipo: 'articulo' }],
  [/peso del articulo|articulo virtual|articulo generico|definir.*articulo|datos.*articulo/, { clave: 'articulo' }],
  [/salida.*produccion|salida para produccion|generar salida/, { clave: 'produccion' }],
  [/entrada.*produccion|entrada desde produccion|recibir produccion|recepcion.*produccion/, { clave: 'produccion' }],
  [/agregar componente|componente.*lista|componente.*bom/, { clave: 'bom' }],
  [/agregar recurso.*ldm|recurso.*lista de materiales|recurso.*materiales/, { clave: 'bom' }],
  [/serie.*activos|activos.*serie/, { clave: 'series', docType: 'activos' }],
  [/serie.*factura|factura.*serie|serie por defecto|serie.*ventas norte|serie.*ventas|serie.*clientes norte|serie.*clientes|formato.*serie|configurar formato.*cli|cli.*formato/, { clave: 'series', docType: 'facturas' }],
  [/serie de numeracion|crear serie|definir serie|autorizar.*grupo.*serie|autorizar.*ana/, { clave: 'series' }],
  [/monedas local|configurar monedas|diferencia.*cambio|revalorizacion|tipo de cambio/, { clave: 'monedas' }],
  [/centro de coste|centros de coste|cost center|reparto.*area|norma.*area|area.*norma|vincular.*cuenta.*norma|cuenta.*norma|informe de gastos/, { clave: 'costos' }],
  [/recurso de trabajo|recursos de trabajo/, { clave: 'recursos', tipo: 'trabajo' }],
  [/recurso de maquina|recursos de maquina|tiempo de ejecucion|configurar.*recurso|filtrar.*fila|tipo de fila recurso/, { clave: 'recursos', tipo: 'maquina' }],
  [/tabla de conductores|objeto definido|udos?|campo.*conductor|conductor.*campo|agregar campo nombre|registrar.*udo|udo.*registrar/, { clave: 'udo' }],
  [/cockpit|plantilla.*cockpit|asignar.*plantilla/, { clave: 'cockpit' }],
  [/informacion del sistema|activar.*informacion|configurar sistema/, { clave: 'empresa' }],
  [/saldo.*apertura|apertura.*saldo|saldos iniciales/, { clave: 'asiento' }],
];

function pantallaConectada(guia) {
  if (!guia) return null;
  if (/buscar|consultar|identificar|verificar|revisar|visualizar|solicitar|anular|anulacion|asistente de pagos|payment wizard|generador de consultas|agregar tabla|filtrar|seleccionar campos|vincular consulta|programar notificacion|configurar ficha|datos de planificacion|definir peso|grupo cable|definir categorias|activar informacion|widget de actividades|agregar widget|configuracion de widget|prevision|alerta de stock|proceso de autorizacion|visibilidad de udf|importar desde excel|importar nuevo/.test(plano(guia.title ?? '')) || /^ver\b/.test(plano(guia.title ?? '').trim())) return null;
  const texto = plano(`${guia.title ?? ''} ${guia.menu_path ?? ''}`);
  if (/asistente de pagos|payment wizard/.test(texto)) return /ejecutar/.test(plano(guia.title ?? '')) ? { clave: 'bancos' } : null;
  return REGLAS.find(([re]) => re.test(texto))?.[1] ?? null;
}

// Ejecución de la auditoría para los 25 módulos
const reportes = [];

for (let i = 1; i <= 25; i++) {
  const modId = `mod-${i}`;
  const classes = clasesAula[modId] || [];
  const modMalla = (malla.modulos || []).find(m => m.modKey === modId || m.number === i);

  let totalLaminas = 0;
  let totalPracticas = 0;
  let practicasConectadas = 0;
  let practicasFormulario = 0;
  const practicasDetalle = [];
  const hallazgos = [];

  classes.forEach(c => {
    const leccion = leccionesAula[c.id];
    if (!leccion) {
      hallazgos.push(`Clase ${c.id} (${c.title}): No encontrada en lecciones.json`);
      return;
    }

    const syncData = leccion.syncData || [];
    totalLaminas += syncData.length;

    syncData.forEach(s => {
      const stepGuide = s.step_guide;
      const campos = stepGuide?.campos || [];

      if (campos.length > 0) {
        totalPracticas++;
        const conectada = pantallaConectada(stepGuide);
        if (conectada) {
          practicasConectadas++;
        } else {
          practicasFormulario++;
        }

        practicasDetalle.push({
          claseId: c.id,
          slideIndex: s.slide_index,
          title: stepGuide.title,
          menuPath: stepGuide.menu_path,
          camposCount: campos.length,
          campos: campos.map(k => k.etiqueta),
          conectada: conectada ? JSON.stringify(conectada) : 'Formulario validado',
        });
      }
    });
  });

  const moduloReporte = {
    id: modId,
    numero: i,
    titulo: modMalla ? modMalla.name : `Módulo ${i}`,
    totalClases: classes.length,
    totalLaminas,
    totalPracticas,
    practicasConectadas,
    practicasFormulario,
    certificable: classes.length > 0 && totalPracticas > 0,
    hallazgos,
    practicas: practicasDetalle,
  };

  reportes.push(moduloReporte);
}

// Resumen general
console.log('=== RESUMEN AUDITORÍA 25 MÓDULOS SAP ACADEMY ===');
let sumaClases = 0;
let sumaPracticas = 0;
let sumaConectadas = 0;
let sumaForm = 0;

reportes.forEach(r => {
  sumaClases += r.totalClases;
  sumaPracticas += r.totalPracticas;
  sumaConectadas += r.practicasConectadas;
  sumaForm += r.practicasFormulario;
  console.log(
    `[${r.id.padEnd(6)}] ${r.titulo.padEnd(50)} | Clases: ${String(r.totalClases).padStart(2)} | Prácticas: ${String(r.totalPracticas).padStart(2)} (Conectadas: ${String(r.practicasConectadas).padStart(2)}, Ficha: ${String(r.practicasFormulario).padStart(2)}) | Certificable: ${r.certificable ? 'SÍ ✓' : 'NO ✗'}`
  );
  if (r.hallazgos.length > 0) {
    console.log(`   ⚠ Hallazgos: ${r.hallazgos.join(', ')}`);
  }
});

console.log('------------------------------------------------');
console.log(`TOTALES: 25 Módulos | ${sumaClases} Clases | ${sumaPracticas} Prácticas Evaluadas (${sumaConectadas} en Simulador Conectado, ${sumaForm} en Ficha de Validación Guiada)`);

fs.writeFileSync(path.join(__dirname, '../docs/AUDITORIA_25_MODULOS.json'), JSON.stringify(reportes, null, 2), 'utf8');
console.log('Reporte JSON guardado en docs/AUDITORIA_25_MODULOS.json');
