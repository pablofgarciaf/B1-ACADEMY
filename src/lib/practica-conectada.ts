/**
 * Prácticas conectadas: cuando una práctica de Mi Aula corresponde a una pantalla real del Simulador
 * (clientes, artículos, pedidos, asientos…), el estudiante trabaja en SU empresa (Supabase) con esa pantalla,
 * eligiendo de listas sus propios datos, en lugar del formulario genérico que solo comparaba texto.
 */
export type PantallaConectada =
  | { clave: 'cliente' } | { clave: 'proveedor' } | { clave: 'articulo' }
  | { clave: 'documento'; docType: 'quotation' | 'order' | 'delivery' | 'invoice' | 'credit_note' | 'purchase_request' | 'purchase_order' | 'goods_receipt' | 'vendor_invoice' }
  | { clave: 'asiento' } | { clave: 'activos' } | { clave: 'bom' } | { clave: 'produccion' } | { clave: 'transferencia' }
  | { clave: 'conteo' } | { clave: 'precios' } | { clave: 'descuentos' } | { clave: 'bancos' } | { clave: 'empleado' }
  | { clave: 'oportunidad' } | { clave: 'empresa' } | { clave: 'presupuesto' } | { clave: 'cierre' } | { clave: 'importacion' }
  | { clave: 'mrp' } | { clave: 'consultas' } | { clave: 'sri' } | { clave: 'nomina' };

const plano = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Reglas en orden: la primera que coincide con el título y la ruta de la práctica decide la pantalla. */
const REGLAS: [RegExp, PantallaConectada][] = [
  // SRI y notas de crédito primero: sus títulos mencionan "factura de proveedor/cliente" y se los comería otra regla.
  [/ruc del sistema|ingresar (el )?ruc/, { clave: 'empresa' }],
  [/comprobante de retencion|emitir (la )?retencion|generar (el )?comprobante|retencion electronica|comprobante electronico|guia de remision|autorizar.*sri|\bsri\b/, { clave: 'sri' }],
  [/pagos (efectuados|recibidos)|pagar (los )?sueldos|pagar (la )?planilla/, { clave: 'bancos' }], // antes que "transferencia" (que es de stock)
  [/(^|[^a-z])rol(es)?([^a-z]|$)|liquidar sueldos|ejecutar nomina/, { clave: 'nomina' }],
  [/nota de credito|abono de cliente/, { clave: 'documento', docType: 'credit_note' }], // "Abono de clientes" es el nombre de SAP en español
  [/factura de proveedor|factura de acreedor/, { clave: 'documento', docType: 'vendor_invoice' }],
  [/entrada de mercanc|recepcion de mercanc|grpo/, { clave: 'documento', docType: 'goods_receipt' }],
  [/solicitud de compra/, { clave: 'documento', docType: 'purchase_request' }],
  [/pedido de compra|orden de compra/, { clave: 'documento', docType: 'purchase_order' }],
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
  [/inventario fisico|recuento|conteo/, { clave: 'conteo' }],
  [/descuento/, { clave: 'descuentos' }],
  [/lista(s)? de precios/, { clave: 'precios' }],
  [/pago|cobro|banco|reconcilia|conciliacion/, { clave: 'bancos' }],
  [/empleado/, { clave: 'empleado' }],
  [/oportunidad/, { clave: 'oportunidad' }],
  [/detalles de la empresa/, { clave: 'empresa' }],
  [/presupuesto/, { clave: 'presupuesto' }],
  [/cierre de periodo|periodos contables|cierre del ejercicio/, { clave: 'cierre' }],
  [/costos? de importacion|gastos de envio|landed/, { clave: 'importacion' }],
  [/mrp|planificacion de necesidades/, { clave: 'mrp' }],
  [/generador de consultas|consulta sql|query/, { clave: 'consultas' }],
  [/comprobante electronico|retencion electronica|sri/, { clave: 'sri' }],
];

export function pantallaConectada(guia?: { title?: string; menu_path?: string } | null): PantallaConectada | null {
  if (!guia) return null;
  // Buscar o consultar no guarda nada en la empresa: esas prácticas siguen con la ficha del ejercicio.
  // Ver, solicitar o anular tampoco guardan un registro nuevo; el asistente de pagos solo genera un archivo.
  if (/buscar|consultar|identificar|verificar|revisar|visualizar|solicitar|anular|anulacion|asistente de pagos|payment wizard/.test(plano(guia.title ?? '')) || /^ver\b/.test(plano(guia.title ?? '').trim())) return null;
  const texto = plano(`${guia.title ?? ''} ${guia.menu_path ?? ''}`);
  // Asistente de pagos: ejecutarlo registra pagos reales (pantalla de Bancos); ver recomendaciones, elegir opciones
  // o generar el archivo no guardan nada en la empresa y siguen como ficha.
  if (/asistente de pagos|payment wizard/.test(texto)) return /ejecutar/.test(plano(guia.title ?? '')) ? { clave: 'bancos' } : null;
  return REGLAS.find(([re]) => re.test(texto))?.[1] ?? null;
}
