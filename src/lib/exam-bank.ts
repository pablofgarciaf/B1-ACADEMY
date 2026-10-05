/**
 * Banco del examen de certificación por módulo.
 * Cada pregunta trae su rúbrica: los conceptos que una respuesta correcta DEBE cubrir.
 * El evaluador IA califica contra esta rúbrica, no por extensión ni por estilo.
 */
export interface ExamQuestion {
  question: string;
  /** Conceptos obligatorios para obtener el puntaje completo. */
  rubric: string[];
}

export const EXAM_QUESTIONS_PER_ATTEMPT = 5;
export const POINTS_PER_QUESTION = 20;
/** Aprobación: 80/100 en total Y al menos 60 % en cada pregunta (no se aprueba compensando con una sola área fuerte). */
export const PASS_TOTAL = 80;
export const PASS_MIN_PER_QUESTION = 12;
export const MAX_ATTEMPTS_PER_DAY = 3;
export const EXAM_DURATION_MS = 45 * 60_000;
export const MIN_ANSWER_WORDS = 25;

export const EXAM_BANK: Record<string, ExamQuestion[]> = {
  'mod-1': [
    { question: 'Explica la arquitectura de SAP Business One (capas) y qué ocurre técnicamente cuando un usuario inicia sesión y elige una sociedad.', rubric: ['capa de presentación/cliente, capa de aplicación/servidor y capa de base de datos (HANA o SQL Server)', 'cada sociedad es una base de datos independiente', 'el login valida usuario y clave contra la sociedad seleccionada'] },
    { question: '¿Para qué sirve el Cockpit y sus widgets? Da un ejemplo concreto de decisión que un gerente tomaría con un widget.', rubric: ['el cockpit es un tablero personalizable por usuario', 'los widgets muestran KPIs o información en tiempo real', 'ejemplo concreto ligado a una decisión de negocio'] },
    { question: 'Un usuario de ventas pierde tiempo eligiendo siempre el mismo almacén y perfil. ¿Qué configurarías y dónde, y por qué afecta a la calidad de los datos?', rubric: ['configuración de valores por defecto del usuario (parametrizaciones/datos de usuario)', 'almacén predeterminado', 'reduce errores de digitación y estandariza los documentos'] },
    { question: 'Describe al menos tres formas de encontrar información rápidamente en SAP B1 sin navegar todo el menú.', rubric: ['búsqueda/lupa o búsqueda empresarial', 'flecha naranja (vínculo al dato maestro)', 'drag and relate o filtros/búsqueda en formularios'] },
    { question: '¿Qué son las alertas y el buzón de mensajes, y por qué un consultor debe revisarlos al iniciar el día? Da un ejemplo de alerta útil.', rubric: ['las alertas avisan de excepciones o desviaciones (gestión por excepción)', 'el buzón recibe mensajes, alertas y solicitudes de autorización', 'ejemplo concreto (stock mínimo, descuento excedido, aprobación pendiente)'] },
  ],
  'mod-2': [
    { question: 'Diferencia un dato maestro de un documento transaccional y explica qué pasa en los documentos si el maestro de un cliente está mal configurado.', rubric: ['el maestro es permanente y define reglas', 'el documento registra una transacción puntual', 'un error en el maestro se propaga a todos los documentos (precios, condiciones, cuentas)'] },
    { question: '¿Qué datos mínimos y de control configurarías al crear un cliente nuevo en SAP B1 y por qué cada uno importa?', rubric: ['código único y tipo (cliente/proveedor/lead)', 'grupo o cuenta asociada de cuentas por cobrar', 'condiciones de pago, límite de crédito o lista de precios'] },
    { question: 'Explica la diferencia entre un artículo de inventario y un artículo de servicio, y su impacto en la contabilidad.', rubric: ['el de inventario lleva existencias y valoración', 'el servicio no maneja stock', 'el de inventario mueve cuentas de inventario/costo; el servicio va directo a gasto o ingreso'] },
    { question: 'Una empresa compra cajas de 10 unidades pero vende por unidad. ¿Cómo lo resuelves en SAP B1 y qué error evitas?', rubric: ['grupos de unidades de medida', 'UdM de compra distinta de la UdM de venta con factor de conversión', 'evita descuadres de inventario y precios'] },
    { question: '¿Cómo llega automáticamente el precio a una oferta de ventas? Explica el papel de la lista de precios y del socio de negocios.', rubric: ['el artículo tiene precios por lista de precios', 'la lista de precios se asigna al socio de negocios', 'al crear el documento el sistema propone el precio de la lista del cliente'] },
  ],
  'mod-3': [
    { question: 'Describe el ciclo Procure-to-Pay en SAP B1 documento por documento y qué efecto tiene cada uno en inventario y contabilidad.', rubric: ['solicitud/pedido de compra sin efecto contable', 'entrada de mercancías aumenta stock y genera asiento', 'factura de proveedor crea la cuenta por pagar y el pago la cancela'] },
    { question: '¿Qué es el matching de tres vías y qué fraude o error previene?', rubric: ['compara pedido, entrada de mercancías y factura', 'cantidades y precios deben coincidir', 'previene pagar lo no recibido o a precio distinto'] },
    { question: 'Explica cuándo usarías una transferencia de stock y cuándo una entrada o salida de mercancías manual.', rubric: ['transferencia mueve stock entre almacenes sin cambiar el total', 'entradas/salidas manuales cambian el stock total', 'las manuales generan asiento contable contra una cuenta de ajuste'] },
    { question: '¿Cómo harías un recuento de inventario físico en SAP B1 y qué pasa con las diferencias encontradas?', rubric: ['recuento de inventario por almacén/artículos', 'comparación entre cantidad contada y en sistema', 'contabilización de ajuste de diferencias'] },
    { question: '¿Qué diferencia hay entre costo promedio móvil y FIFO, y cuál recomendarías a una distribuidora con precios de compra muy variables?', rubric: ['promedio recalcula el costo con cada entrada', 'FIFO valoriza por capas en orden de entrada', 'recomendación justificada según el negocio'] },
  ],
  'mod-4': [
    { question: 'Describe el ciclo Order-to-Cash completo en SAP B1 y qué documento afecta el inventario y cuál la contabilidad.', rubric: ['oferta → pedido → entrega → factura → cobro', 'la entrega reduce el stock y registra el costo', 'la factura reconoce el ingreso y la cuenta por cobrar'] },
    { question: '¿Para qué sirve el pedido de cliente si todavía no se entrega ni factura? Explica el compromiso de stock.', rubric: ['registra el compromiso con el cliente', 'reserva/compromete cantidades (disponible vs. en stock)', 'permite planificar compras o producción'] },
    { question: 'Un cliente devuelve mercadería ya facturada. ¿Qué documentos usarías y cuál es el efecto en stock y contabilidad?', rubric: ['devolución y/o nota de crédito de clientes', 'reingreso del stock', 'reversa del ingreso y de la cuenta por cobrar'] },
    { question: '¿Qué es una oportunidad de venta y qué información le da a la gerencia comercial?', rubric: ['seguimiento de un negocio potencial por etapas', 'monto potencial y probabilidad de cierre', 'pronóstico del pipeline de ventas'] },
    { question: 'Explica cómo se copia un documento a otro (Copiar a / Copiar de) y por qué es importante para la trazabilidad.', rubric: ['funciones copiar a / copiar desde', 'los documentos quedan vinculados', 'se puede auditar el flujo completo y evita digitar dos veces'] },
  ],
  'mod-5': [
    { question: 'Explica la jerarquía de determinación de precios en SAP B1: ¿qué precio gana cuando hay precio especial, descuento por período y lista de precios?', rubric: ['precios especiales por socio de negocios tienen prioridad', 'luego descuentos por período/volumen', 'por último la lista de precios'] },
    { question: '¿Cómo configurarías un descuento por volumen (a mayor cantidad, menor precio) y para qué tipo de cliente?', rubric: ['descuentos por período y volumen', 'escalas de cantidad con precio o porcentaje', 'aplicación a una lista o socio específico'] },
    { question: '¿Qué son los grupos de descuento y en qué se diferencian de un precio especial?', rubric: ['descuento aplicado a grupos de artículos o fabricantes', 'se asigna a un cliente o grupo de clientes', 'el precio especial es por artículo y socio concreto'] },
    { question: 'Explica cómo crear una lista de precios derivada de otra (por ejemplo, distribuidores = base menos 10 %).', rubric: ['lista basada en otra lista', 'factor o porcentaje', 'se actualiza al cambiar la base'] },
    { question: '¿Qué riesgo financiero tiene dar descuentos sin control y qué mecanismo de SAP B1 lo evita?', rubric: ['pérdida de margen', 'procedimientos de autorización o alertas por descuento excedido', 'control por usuario/límites'] },
  ],
  'mod-6': [
    { question: '¿Qué es una llamada de servicio y qué información registra desde que el cliente reporta hasta que se cierra?', rubric: ['registro del problema del cliente', 'técnico asignado, actividades y tiempos', 'solución y cierre con historial'] },
    { question: '¿Qué es una tarjeta de equipo y cómo se genera automáticamente?', rubric: ['registro del equipo vendido con número de serie', 'se crea al entregar artículos con número de serie', 'vincula cliente, garantía e historial'] },
    { question: '¿Para qué sirve la base de soluciones y cómo ahorra tiempo al área de soporte?', rubric: ['repositorio de soluciones conocidas', 'se reutiliza en nuevas llamadas', 'reduce tiempo de resolución'] },
    { question: 'Explica cómo un contrato de servicio o garantía define si una reparación se cobra o no.', rubric: ['contrato con cobertura (piezas, mano de obra, viaje)', 'vigencia', 'lo no cubierto se factura'] },
    { question: '¿Qué indicadores de servicio presentarías a la gerencia y de dónde salen?', rubric: ['tiempo de respuesta/resolución', 'llamadas abiertas vs cerradas o por técnico', 'informes del módulo de servicio'] },
  ],
  'mod-7': [
    { question: 'Explica la estructura de un plan de cuentas y la diferencia entre cuentas de título y cuentas activas.', rubric: ['estructura jerárquica por niveles (activo, pasivo, patrimonio, ingresos, gastos)', 'cuentas de título agrupan', 'solo las cuentas activas reciben movimientos'] },
    { question: '¿Qué asientos genera SAP B1 automáticamente en una factura de deudores de un artículo de inventario? Detalla débitos y créditos.', rubric: ['débito a cuentas por cobrar del cliente', 'crédito a ingresos y a IVA por pagar', 'si la entrega no existía: costo de ventas contra inventario'] },
    { question: '¿Cuándo es correcto registrar un asiento manual y qué controles debería tener?', rubric: ['ajustes, provisiones o reclasificaciones sin documento de origen', 'debe cuadrar débito = crédito', 'referencia, comentario y autorización/revisión'] },
    { question: 'Explica para qué sirven las cuentas de mayor por defecto (determinación de cuentas) y qué pasa si están mal configuradas.', rubric: ['definen qué cuentas usan automáticamente los documentos', 'por artículo, grupo o almacén', 'mala configuración = contabilización errónea masiva'] },
    { question: '¿Qué son las diferencias de cambio y cuándo debe ejecutarse su ajuste?', rubric: ['saldos en moneda extranjera revaluados al tipo de cambio actual', 'genera ganancia o pérdida por diferencia de cambio', 'se ejecuta al cierre de período'] },
  ],
  'mod-8': [
    { question: 'Describe cómo registrar un pago recibido de un cliente que paga dos facturas con una transferencia, y qué asiento resulta.', rubric: ['pago recibido seleccionando las facturas', 'medio de pago transferencia a cuenta bancaria', 'débito a banco y crédito a cuentas por cobrar'] },
    { question: '¿Qué medios de pago maneja SAP B1 y qué diferencia contable tiene un cheque recibido frente a una transferencia?', rubric: ['efectivo, cheque, transferencia, tarjeta', 'el cheque puede pasar por una cuenta transitoria hasta el depósito', 'la transferencia va directo a la cuenta bancaria'] },
    { question: 'Explica la conciliación bancaria: qué se compara, qué son las partidas conciliatorias y por qué es un control clave.', rubric: ['compara extracto bancario con libros', 'partidas en tránsito o no registradas', 'detecta errores, fraudes u omisiones'] },
    { question: '¿Qué es la reconciliación interna de cuentas y en qué se diferencia de la conciliación bancaria?', rubric: ['empareja débitos y créditos dentro de una cuenta (p. ej. cliente)', 'deja saldos abiertos correctos', 'no involucra extracto bancario'] },
    { question: '¿Cómo usarías el asistente de pagos para pagar a varios proveedores y qué riesgo controla?', rubric: ['selección masiva de facturas por vencimiento/criterios', 'generación de pagos en lote', 'control de flujo de caja y de pagos duplicados'] },
  ],
  'mod-9': [
    { question: '¿Qué datos configuras en el maestro de un activo fijo y por qué la clase de activo es importante?', rubric: ['clase de activo, vida útil, método de amortización', 'la clase define cuentas y parámetros por defecto', 'fecha de capitalización/valor'] },
    { question: 'Explica la capitalización de un activo comprado a un proveedor y su asiento.', rubric: ['capitalización desde factura o documento de capitalización', 'débito a activo fijo', 'crédito a proveedor o cuenta de compensación'] },
    { question: '¿Cómo se ejecuta la amortización mensual y qué asiento genera?', rubric: ['ejecución de amortización por período', 'débito a gasto de amortización', 'crédito a amortización acumulada'] },
    { question: 'Un activo se vende antes de terminar su vida útil. ¿Qué proceso sigues y cómo se determina la ganancia o pérdida?', rubric: ['retiro o venta del activo', 'valor neto en libros = costo - amortización acumulada', 'diferencia con el precio de venta = ganancia o pérdida'] },
    { question: '¿Qué informe usarías para presentar al auditor el estado de los activos fijos?', rubric: ['historial o listado de activos', 'valor de adquisición, amortización acumulada y valor neto', 'movimientos del período'] },
  ],
  'mod-10': [
    { question: 'Explica qué es el MRP y qué datos de entrada necesita para calcular necesidades.', rubric: ['planificación de necesidades de materiales', 'demanda: pedidos de cliente y/o pronósticos', 'stock, pedidos abiertos, listas de materiales y plazos'] },
    { question: '¿Para qué sirve un pronóstico y cómo se combina con los pedidos reales en el MRP?', rubric: ['estima demanda futura', 'se consume con pedidos reales para no duplicar', 'permite planificar antes de recibir pedidos'] },
    { question: 'Describe el asistente MRP paso a paso hasta obtener recomendaciones.', rubric: ['escenario: horizonte y artículos', 'fuentes de datos y almacenes', 'ejecución y revisión de recomendaciones'] },
    { question: '¿Qué hace un usuario con las recomendaciones del MRP?', rubric: ['revisarlas y ajustar', 'convertir en pedidos de compra u órdenes de fabricación', 'controlar los plazos'] },
    { question: '¿Qué ocurre si los plazos de entrega (lead time) de los artículos están mal definidos?', rubric: ['fechas de pedido erróneas', 'faltantes o exceso de inventario', 'el MRP solo es tan bueno como sus datos maestros'] },
  ],
  'mod-11': [
    { question: 'Explica los tipos de lista de materiales (producción, montaje, venta, plantilla) y cuándo usar cada uno.', rubric: ['producción: fabricación con orden', 'montaje/venta: se expande en el documento de venta', 'plantilla: sugerencia modificable'] },
    { question: 'Describe el ciclo de una orden de fabricación desde planificada hasta cerrada.', rubric: ['planificada → liberada → cerrada', 'emisión de componentes', 'recibo del producto terminado y cierre'] },
    { question: '¿Qué asientos generan la emisión para producción y el recibo de producción?', rubric: ['emisión: crédito a inventario de materias primas, débito a producción en proceso (WIP)', 'recibo: débito a inventario de producto terminado', 'diferencias de costo al cerrar la orden'] },
    { question: '¿Cómo calcularías el costo real de fabricar una unidad en SAP B1?', rubric: ['costo de componentes emitidos', 'recursos/mano de obra/costos adicionales', 'dividido entre la cantidad recibida'] },
    { question: '¿Qué es un proyecto en SAP B1 y cómo ayuda a medir la rentabilidad por proyecto?', rubric: ['código de proyecto en documentos y asientos', 'agrupa ingresos y costos', 'informes de rentabilidad por proyecto'] },
  ],
  'mod-12': [
    { question: '¿Qué es el gestor de consultas (Query Manager) y qué precauciones de seguridad tomarías al dar acceso?', rubric: ['crea y guarda consultas SQL sobre las tablas', 'consultas de solo lectura y autorizaciones por usuario', 'riesgo de exponer datos sensibles'] },
    { question: 'Escribe en palabras (o SQL) una consulta para listar facturas de clientes abiertas con su saldo. ¿Qué tablas usarías?', rubric: ['tabla de facturas OINV (y líneas INV1 si aplica)', 'filtro de documentos abiertos (DocStatus = O)', 'saldo = total - pagado'] },
    { question: '¿Para qué sirve Data Transfer Workbench y qué pasos sigues para migrar maestros de clientes?', rubric: ['herramienta de importación masiva', 'plantillas con estructura de tablas', 'simulación/prueba y luego importación con revisión de errores'] },
    { question: '¿Cómo crearías una alerta personalizada basada en una consulta? Da un ejemplo de negocio.', rubric: ['consulta guardada como base', 'gestión de alertas con frecuencia y destinatarios', 'ejemplo concreto (stock bajo, facturas vencidas)'] },
    { question: 'Un cliente pide un campo que SAP B1 no trae. ¿Qué opciones tienes antes de programar?', rubric: ['campos definidos por el usuario (UDF)', 'valores definidos por el usuario / búsquedas formateadas', 'evitar desarrollos cuando la configuración basta'] },
  ],
};
