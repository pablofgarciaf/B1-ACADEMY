/**
 * Prácticas conectadas: cuando una práctica de Mi Aula corresponde a una pantalla real del Simulador
 * (clientes, artículos, pedidos, asientos…), el estudiante trabaja en SU empresa (Supabase) con esa pantalla,
 * eligiendo de listas sus propios datos, en lugar del formulario genérico que solo comparaba texto.
 */
import { SALES_MISSIONS } from './sales-learning';
export type PantallaConectada =
  | { clave: 'consultaAcademica' }
  | { clave: 'cliente' } | { clave: 'proveedor' } | { clave: 'articulo' }
  | { clave: 'documento'; docType: 'quotation' | 'order' | 'delivery' | 'invoice' | 'credit_note' | 'purchase_request' | 'purchase_order' | 'goods_receipt' | 'vendor_invoice' }
  | { clave: 'asiento' } | { clave: 'activos' } | { clave: 'bom' } | { clave: 'produccion' } | { clave: 'transferencia' }
  | { clave: 'conteo' } | { clave: 'precios' } | { clave: 'descuentos' } | { clave: 'bancos' } | { clave: 'empleado' }
  | { clave: 'oportunidad' } | { clave: 'empresa' } | { clave: 'presupuesto' } | { clave: 'cierre' } | { clave: 'importacion' }
  | { clave: 'mrp' } | { clave: 'consultas' } | { clave: 'sri' } | { clave: 'nomina' } | { clave: 'cierreTributario' } | { clave: 'isd' }
  | { clave: 'series'; docType?: string } | { clave: 'grupos'; tipo: 'cliente' | 'articulo' }
  | { clave: 'monedas' } | { clave: 'costos' } | { clave: 'recursos'; tipo: 'trabajo' | 'maquina' }
  | { clave: 'udo' } | { clave: 'cockpit' };

const plano = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Reglas en orden: la primera que coincide con el título y la ruta de la práctica decide la pantalla. */
const REGLAS: [RegExp, PantallaConectada][] = [
  // SRI y notas de crédito primero: sus títulos mencionan "factura de proveedor/cliente" y se los comería otra regla.
  [/conductor|udt|tabla vinculada/, { clave: 'udo' }],
  [/ruc del sistema|ingresar (el )?ruc/, { clave: 'empresa' }],
  [/comprobante de retencion|emitir (la )?retencion|generar (el )?comprobante|retencion electronica|comprobante electronico|guia de remision|autorizar.*sri|\bsri\b/, { clave: 'sri' }],
  [/utilidades de los trabajadores|participacion de (los )?trabajadores|impuesto a la renta (del ejercicio|anual|de la empresa)|cierre tributario|anticipo (de|del) impuesto/, { clave: 'cierreTributario' }],
  [/(^|[^a-z])isd([^a-z]|$)|salida de divisas|pago al exterior|pagos al exterior/, { clave: 'isd' }],
  [/pagos (efectuados|recibidos)|pagar (los )?sueldos|pagar (la )?planilla|pago.*proveedor|pagar.*proveedor|ejecutar pago/, { clave: 'bancos' }], // antes que "transferencia" (que es de stock)
  [/(^|[^a-z])rol(es)?([^a-z]|$)|liquidar sueldos|ejecutar nomina/, { clave: 'nomina' }],
  [/nota de credito|abono de cliente/, { clave: 'documento', docType: 'credit_note' }], // "Abono de clientes" es el nombre de Finix ERP en español
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
  // Clientes / socios (ampliado)
  [/cliente potencial|registrar cliente|convertir.*potencial|potencial.*cliente/, { clave: 'cliente' }],
  // Grupos de clientes (pantalla exacta de administración)
  [/grupo de clientes|grupo de socios|grupo.*clientes/, { clave: 'grupos', tipo: 'cliente' }],
  // Grupos de artículos
  [/grupo.*articulo|grupo cable/, { clave: 'grupos', tipo: 'articulo' }],
  // Peso/unidad del artículo → maestro de artículo
  [/peso del articulo|articulo virtual|articulo generico|definir.*articulo|datos.*articulo/, { clave: 'articulo' }],
  // Producción: salidas, entradas, recursos en BOM
  [/salida.*produccion|salida para produccion|generar salida/, { clave: 'produccion' }],
  [/entrada.*produccion|entrada desde produccion|recibir produccion|recepcion.*produccion/, { clave: 'produccion' }],
  [/agregar componente|componente.*lista|componente.*bom/, { clave: 'bom' }],
  [/agregar recurso.*ldm|recurso.*lista de materiales|recurso.*materiales/, { clave: 'bom' }],
  // Series de numeración (pantalla exacta)
  [/serie.*activos|activos.*serie/, { clave: 'series', docType: 'activos' }],
  [/serie.*factura|factura.*serie|serie por defecto|serie.*ventas norte|serie.*ventas|serie.*clientes norte|serie.*clientes|formato.*serie|configurar formato.*cli|cli.*formato/, { clave: 'series', docType: 'facturas' }],
  [/serie de numeracion|crear serie|definir serie|autorizar.*grupo.*serie|autorizar.*ana/, { clave: 'series' }],
  // Monedas y tipo de cambio
  [/monedas local|configurar monedas|diferencia.*cambio|revalorizacion|tipo de cambio/, { clave: 'monedas' }],
  // Centro de costos (pantalla exacta)
  [/centro de coste|centros de coste|cost center|reparto.*area|norma.*area|area.*norma|vincular.*cuenta.*norma|cuenta.*norma|informe de gastos/, { clave: 'costos' }],
  // Recursos de producción (trabajo / máquina)
  [/recurso de trabajo|recursos de trabajo/, { clave: 'recursos', tipo: 'trabajo' }],
  [/recurso de maquina|recursos de maquina|tiempo de ejecucion|configurar.*recurso|filtrar.*fila|tipo de fila recurso/, { clave: 'recursos', tipo: 'maquina' }],
  // UDO / objetos definidos por el usuario
  [/tabla de conductores|objeto definido|udos?|campo.*conductor|conductor.*campo|agregar campo nombre|registrar.*udo|udo.*registrar/, { clave: 'udo' }],
  // Cockpit Finix ERP
  [/cockpit|plantilla.*cockpit|asignar.*plantilla/, { clave: 'cockpit' }],
  // Configuración general del sistema
  [/informacion del sistema|activar.*informacion|configurar sistema/, { clave: 'empresa' }],
  // Saldos de apertura → asiento contable
  [/saldo.*apertura|apertura.*saldo|saldos iniciales/, { clave: 'asiento' }],
];

export function pantallaConectada(guia?: { title?: string; menu_path?: string; missionId?: string } | null): PantallaConectada | null {
  if (!guia) return null;
  if (guia.missionId && SALES_MISSIONS[guia.missionId]) return SALES_MISSIONS[guia.missionId].pantalla;
  // Buscar, consultar o asistentes/fichas de configuración guiada no guardan un registro de motor directo: esas prácticas siguen con la ficha del ejercicio en PracticaValidada.
  // Ver, solicitar o anular tampoco guardan un registro nuevo; el asistente de pagos solo genera un archivo.
  if (/buscar|consultar|identificar|verificar|revisar|visualizar|solicitar|anular|anulacion|asistente de pagos|payment wizard|generador de consultas|agregar tabla|filtrar|seleccionar campos|vincular consulta|programar notificacion|configurar ficha|datos de planificacion|definir peso|grupo cable|definir categorias|activar informacion|widget de actividades|agregar widget|configuracion de widget|prevision|alerta de stock|proceso de autorizacion|visibilidad de udf|importar desde excel|importar nuevo/.test(plano(guia.title ?? '')) || /^ver\b/.test(plano(guia.title ?? '').trim())) return null;
  const texto = plano(`${guia.title ?? ''} ${guia.menu_path ?? ''}`);
  // Asistente de pagos: ejecutarlo registra pagos reales (pantalla de Bancos); ver recomendaciones, elegir opciones
  // o generar el archivo no guardan nada en la empresa y siguen como ficha.
  if (/asistente de pagos|payment wizard/.test(texto)) return /ejecutar/.test(plano(guia.title ?? '')) ? { clave: 'bancos' } : null;
  return REGLAS.find(([re]) => re.test(texto))?.[1] ?? null;
}
