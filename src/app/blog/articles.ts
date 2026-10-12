export const articles = [
  {
    slug: 'partida-doble-en-el-simulador',
    title: 'Partida doble: cómo practicar un asiento antes de registrarlo',
    summary: 'Una guía para comprobar el equilibrio del asiento, su soporte y el período contable en un entorno de práctica.',
    sections: [
      { heading: 'Empieza por el hecho económico', paragraphs: [
        'Antes de elegir cuentas, describe qué ocurrió: quién entregó un bien o servicio, qué recibió la empresa, cuándo nació la obligación y cuál es el documento de soporte. Un asiento sin hecho económico identificable puede cuadrar matemáticamente y aun así estar equivocado.',
        'En una empresa de servicios, una factura a crédito aumenta la cuenta por cobrar y reconoce el ingreso. El cobro posterior reduce la cuenta por cobrar y aumenta bancos; no crea un segundo ingreso. En una venta de mercancías también intervienen inventario y costo de ventas.',
      ] },
      { heading: 'Comprueba el equilibrio y el período', paragraphs: [
        'La suma de débitos debe ser igual a la suma de créditos. Esa igualdad es necesaria, pero no prueba que la cuenta, el importe, el impuesto o la fecha sean correctos. Verifica el período contable y conserva la referencia del comprobante antes de confirmar.',
        'Practica con un caso simple: compra de suministros por USD 100 a crédito, sin impuestos para aislar la mecánica. Debita suministros o gasto por USD 100 y acredita cuentas por pagar por USD 100. Después registra el pago como débito a cuentas por pagar y crédito a bancos. En un caso real, clasificación e impuestos requieren revisión según el régimen aplicable.',
      ] },
      { heading: 'Revisa la huella de la operación', paragraphs: [
        'Tras registrar, consulta el asiento y verifica empresa, fecha, usuario, documento de origen, cuentas y saldos. Si detectas un error, documenta su corrección mediante un reverso y un nuevo asiento. Evita sobrescribir una operación contabilizada porque se pierde la explicación de cómo cambió el libro.',
        'El simulador sirve para ensayar estas decisiones. Sus resultados no equivalen a libros oficiales ni a comprobantes autorizados por el SRI.',
      ] },
    ],
  },
  {
    slug: 'trazabilidad-de-operaciones-erp',
    title: 'Trazabilidad en un ERP: qué debe poder reconstruirse',
    summary: 'Una lista práctica de evidencias para seguir una operación desde el documento de origen hasta su efecto contable.',
    sections: [
      { heading: 'Sigue la operación completa', paragraphs: [
        'Una operación comercial suele atravesar varias etapas: pedido, entrega o recepción, factura, asiento, cobro o pago y conciliación. La trazabilidad permite unirlas mediante referencias estables. El número visible de una pantalla no basta si puede repetirse entre empresas o períodos.',
        'Para cada evento conviene registrar la empresa, el documento, la acción, la fecha y hora, el usuario responsable, el resultado y el identificador de la operación anterior. Cuando se requiere aprobación, también debe identificarse quién aprobó y qué versión vio.',
      ] },
      { heading: 'Prueba un caso con una corrección', paragraphs: [
        'Crea una compra de prueba, recibe los bienes y registra la factura. Comprueba que el movimiento de inventario y el asiento corresponden al mismo documento. Luego simula una devolución o corrección y verifica que el historial conserva la operación original y su reverso.',
        'Una buena prueba intenta responder, sin depender de la memoria de quien operó el sistema: qué pasó, cuándo, quién lo hizo, qué dato cambió y cuál fue el impacto en inventario, cuentas por pagar y mayor contable.',
      ] },
      { heading: 'Separación de funciones', paragraphs: [
        'Si una misma persona puede crear, aprobar, modificar y conciliar una operación, el registro de eventos ayuda a investigar, pero no sustituye los permisos. Para usar un ERP con datos reales hacen falta reglas por empresa y función, aprobaciones, respaldos y conciliaciones verificables.',
        'En la academia estos recorridos son ejercicios de aprendizaje. No deben interpretarse como una certificación de controles internos ni como aptitud del simulador para contabilidad oficial.',
      ] },
    ],
  },
] as const;

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
