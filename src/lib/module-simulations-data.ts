export interface ModuleVisualSimulation {
  systemType: 'SAP_B1' | 'HEIN_NOMINA';
  windowTitle: string;
  transactionCode: string;
  screenSummary: string;
  interactiveFields: {
    label: string;
    value: string;
    helperExplanation: string;
    isMandatory?: boolean;
  }[];
  workedExample: {
    title: string;
    stepByStepMath: string[];
    accountingJournalEntry: {
      account: string;
      debe?: number;
      haber?: number;
    }[];
  };
}

export const MODULE_SIMULATIONS: Record<string, ModuleVisualSimulation> = {
  // 1. HORAS EXTRAS HEINSOHN NOMINA
  'nom-01': {
    systemType: 'HEIN_NOMINA',
    windowTitle: 'Registro y Liquidación de Novedades del Mes',
    transactionCode: 'HN-NOV-01',
    screenSummary: 'En esta pantalla se registran las novedades que alteran el rol de pagos mensual. Los conceptos se cargan por colaborador con su cantidad de horas. El sistema aplica automáticamente la fórmula legal del Código del Trabajo de Ecuador: Sueldo / 240 horas.',
    interactiveFields: [
      {
        label: 'Cédula / Colaborador',
        value: '1718945201 - Juan Carlos Mora',
        helperExplanation: 'Identificador único del colaborador registrado ante el IESS. Debe coincidir con la Hoja de Vida para no rechazar la planilla.',
        isMandatory: true,
      },
      {
        label: 'Concepto Salarial',
        value: 'CONC-105: Horas Suplementarias (+50%)',
        helperExplanation: 'Aplica a las horas trabajadas fuera de la jornada regular hasta las 24h00. Se paga con un 50% de recargo sobre el valor hora ordinaria.',
        isMandatory: true,
      },
      {
        label: 'Divisor Legal Horas',
        value: '240 HORAS (Fijo por Ley)',
        helperExplanation: 'El Código de Trabajo de Ecuador fija 30 días comerciales de 8 horas = 240 horas. Si usas 160 pagarías un 50% extra ilegal.',
        isMandatory: true,
      },
      {
        label: 'Horas Reportadas',
        value: '12.00 Horas',
        helperExplanation: 'Número de horas extraídas del reloj biométrico o aprobadas por el jefe de área en el período.',
        isMandatory: true,
      },
      {
        label: 'Materia Gravada IESS',
        value: 'SI (Aporta 9.45% / 12.15%)',
        helperExplanation: 'Las horas extras integran la base imponible del IESS. No se pueden excluir del cálculo de aportes.',
      },
    ],
    workedExample: {
      title: 'Caso Práctico Resuelto: Cálculo de Horas Extras de Juan Mora',
      stepByStepMath: [
        'Datos del Empleado: Sueldo mensual = $800.00. Horas suplementarias (50%) = 10 horas. Horas extraordinarias domingo (100%) = 4 horas.',
        'Paso 1: Cálculo del Valor Hora Ordinaria = $800.00 ÷ 240 horas = $3.3333 por hora.',
        'Paso 2: Valor Hora Suplementaria (+50%) = $3.3333 × 1.50 = $5.0000. Total por 10 horas = 10 × $5.0000 = $50.00.',
        'Paso 3: Valor Hora Extraordinaria (+100%) = $3.3333 × 2.00 = $6.6666. Total por 4 horas = 4 × $6.6666 = $26.67.',
        'Paso 4: Total Ganado en Horas Extras = $50.00 + $26.67 = $76.67.',
        'Paso 5: Materia Gravada IESS Total = $800.00 (Sueldo) + $76.67 (Extras) = $876.67.',
        'Paso 6: Aporte Personal IESS del Empleado (9.45%) = $876.67 × 0.0945 = $82.85 (se descuenta de su sueldo en el rol).',
        'Paso 7: Aporte Patronal de la Empresa (12.15%) = $876.67 × 0.1215 = $106.52 (costo laboral asumido por la empresa).',
        'Paso 8: Salario Neto a Pagar a Juan Mora = $876.67 - $82.85 = $793.82 en su cuenta bancaria.'
      ],
      accountingJournalEntry: [
        { account: '5.1.02.01 Gasto Sueldos y Salarios', debe: 800.00 },
        { account: '5.1.02.02 Gasto Horas Extras y Suplementarias', debe: 76.67 },
        { account: '5.1.02.05 Gasto Aporte Patronal IESS (12.15%)', debe: 106.52 },
        { account: '2.1.03.01 Cuentas por Pagar IESS Aportes (Personal + Patronal)', haber: 189.37 },
        { account: '2.1.03.02 Sueldos por Pagar (Líquido a Empleado)', haber: 793.82 }
      ]
    }
  },

  // 2. RETENCIONES SRI COMPRAS SAP B1
  'loc-02': {
    systemType: 'SAP_B1',
    windowTitle: 'Tabla de Retención de Impuestos en Compras A/P',
    transactionCode: 'OPCH / WTCode',
    screenSummary: 'Al registrar una factura de compras de un proveedor en Ecuador, SAP B1 determina qué retención de Impuesto a la Renta y de IVA se debe descontar. El dinero retenido no se le paga al proveedor, sino que se entrega al SRI al mes siguiente mediante el Formulario 103.',
    interactiveFields: [
      {
        label: 'Tipo de Documento',
        value: 'Factura de Proveedor (OPCH)',
        helperExplanation: 'Documento contable oficial que sustenta la compra de insumos, servicios o activos fijos.',
        isMandatory: true,
      },
      {
        label: 'Código Retención Bienes',
        value: '312 - Transferencia de Bienes Muebles (1.75%)',
        helperExplanation: 'Aplica a compras de productos físicos, materias primas y mercadería. Porcentaje vigente: 1.75%.',
        isMandatory: true,
      },
      {
        label: 'Código Retención Servicios',
        value: '344 - Servicios en General (2.75%)',
        helperExplanation: 'Aplica a mano de obra, mantenimiento, consultorías estándar y transporte. Porcentaje: 2.75%.',
        isMandatory: true,
      },
      {
        label: 'Retención de IVA Bienes',
        value: 'Código IVA-30% (Retiene el 30% del IVA causado)',
        helperExplanation: 'Si eres Agente de Retención calificado por el SRI, retienes el 30% del IVA al comprar bienes a sociedades.',
      },
      {
        label: 'Retención de IVA Servicios',
        value: 'Código IVA-70% (Retiene el 70% del IVA causado)',
        helperExplanation: 'En compras de servicios se retiene el 70% del IVA liquidado en la factura.',
      },
    ],
    workedExample: {
      title: 'Caso Práctico Resuelto: Factura Mixta de Insumos y Mantenimiento',
      stepByStepMath: [
        'Escenario: Compras $4,000 en insumos de cómputo (Bienes) y $1,500 en soporte técnico (Servicios). Empresa proveedora es Régimen General.',
        'Paso 1: Subtotal Compra = $4,000.00 (Bienes) + $1,500.00 (Servicios) = $5,500.00.',
        'Paso 2: IVA 15% Total = $5,500.00 × 0.15 = $825.00 ($600 de bienes + $225 de servicios).',
        'Paso 3: Retención Renta Bienes Cód. 312 (1.75%) = $4,000.00 × 0.0175 = $70.00.',
        'Paso 4: Retención Renta Servicios Cód. 344 (2.75%) = $1,500.00 × 0.0275 = $41.25.',
        'Paso 5: Retención IVA Bienes 30% = $600.00 × 0.30 = $180.00.',
        'Paso 6: Retención IVA Servicios 70% = $225.00 × 0.70 = $157.50.',
        'Paso 7: Total Retenido que NO pagas al proveedor = $70.00 + $41.25 + $180.00 + $157.50 = $448.75.',
        'Paso 8: Total Factura con IVA = $5,500.00 + $825.00 = $6,325.00.',
        'Paso 9: Valor Neto a Transferir al Proveedor = $6,325.00 - $448.75 = $5,876.25.'
      ],
      accountingJournalEntry: [
        { account: '1.1.05.01 Inventario de Equipos (Bienes)', debe: 4000.00 },
        { account: '5.1.03.02 Gasto Mantenimiento Técnico (Servicios)', debe: 1500.00 },
        { account: '1.1.06.01 IVA Crédito Tributario Compras 15%', debe: 825.00 },
        { account: '2.1.04.01 Retención en la Fuente Renta por Pagar (312 + 344)', haber: 111.25 },
        { account: '2.1.04.02 Retención en la Fuente IVA por Pagar (30% + 70%)', haber: 337.50 },
        { account: '2.1.01.01 Proveedores Locales por Pagar (Líquido)', haber: 5876.25 }
      ]
    }
  },

  // 3. DETERMINACION DE CUENTAS G/L EN SAP B1
  'b1-02': {
    systemType: 'SAP_B1',
    windowTitle: 'Determinación de Cuentas de Mayor (G/L Determination)',
    transactionCode: 'SPRO / GL-01',
    screenSummary: 'Esta es la pantalla más crítica de todo el ERP. Define qué cuentas contables se afectan automáticamente cuando el usuario guarda una factura, una entrega de inventario o un cobro. Si una cuenta está mal configurada, todos los balances de la empresa saldrán desajustados.',
    interactiveFields: [
      {
        label: 'Pestaña Configurada',
        value: 'Inventario / Ventas / Compras',
        helperExplanation: 'Permite configurar los disparadores contables independientes para las 3 operaciones principales del negocio.',
        isMandatory: true,
      },
      {
        label: 'Cuenta de Stock (Inventario)',
        value: '1.1.05.01 Inventario Mercaderías',
        helperExplanation: 'Registra el valor monetario de las existencias físicas que ingresan o salen del almacén.',
        isMandatory: true,
      },
      {
        label: 'Cuenta de Costo de Ventas',
        value: '5.1.01.01 Costo de Ventas Nacional',
        helperExplanation: 'Se debita automáticamente en el momento en que se entrega la mercadería al cliente (Entrega ODLN).',
        isMandatory: true,
      },
      {
        label: 'Cuenta de Dotación de Mercancías',
        value: '2.1.02.01 Entradas de Mercancías no Facturadas',
        helperExplanation: 'Cuenta transitoria puente entre la recepción física del almacén (GRPO) y la factura final del proveedor.',
        isMandatory: true,
      },
    ],
    workedExample: {
      title: 'Caso Práctico Resuelto: Venta y Salida de Inventario de 10 Unidades',
      stepByStepMath: [
        'Escenario: Venta de 10 bombas industriales. Precio de venta = $500 c/u ($5,000 total). Costo de adquisición unitario en inventario = $300 c/u ($3,000 total).',
        'Paso 1: Al crear la Entrega (ODLN), el inventario físico sale de bodega. Costo = 10 × $300 = $3,000.00.',
        'Paso 2: Asiento de Entrega: Se debita Costo de Ventas ($3,000) y se acredita la cuenta de Inventario ($3,000).',
        'Paso 3: Al crear la Factura de Clientes (OINV), se cobra el precio pactado: $5,000.00 + IVA 15% ($750.00) = $5,750.00.',
        'Paso 4: Ganancia Bruta Operativa de la Empresa = $5,000.00 (Ventas) - $3,000.00 (Costo de Ventas) = $2,000.00.'
      ],
      accountingJournalEntry: [
        { account: '1.1.02.01 Clientes Nacionales por Cobrar', debe: 5750.00 },
        { account: '4.1.01.01 Ventas de Productos Gravados', haber: 5000.00 },
        { account: '2.1.04.05 IVA por Pagar en Ventas 15%', haber: 750.00 },
        { account: '5.1.01.01 Costo de Ventas (Asiento de Entrega)', debe: 3000.00 },
        { account: '1.1.05.01 Inventario de Mercaderías (Baja de Stock)', haber: 3000.00 }
      ]
    }
  },

  // 4. VERTICAL BANANERA EXPORTACION
  'vert-01': {
    systemType: 'SAP_B1',
    windowTitle: 'Vertical Bananera: Liquidación a Productores y Embarque',
    transactionCode: 'BAN-EXP-01',
    screenSummary: 'Control de la fruta desde la finca hasta el puerto. Valida que el pago a los productores cumpla con el Precio Mínimo de Sustentación fijado por el Ministerio de Agricultura y añade fletes navieros al costo final de exportación.',
    interactiveFields: [
      {
        label: 'Cajas Recibidas en Empacadora',
        value: '5,000 Cajas 22XU',
        helperExplanation: 'Total de cajas empacadas que cumplieron los estándares de calibre y sanidad vegetal.',
        isMandatory: true,
      },
      {
        label: 'Precio Mínimo de Sustentación',
        value: '$6.85 por Caja (Oficial)',
        helperExplanation: 'Precio legal de ley en Ecuador. Si el ERP permite pagar menos de $6.85, la empresa es multada y clausurada por el MAG.',
        isMandatory: true,
      },
      {
        label: 'Certificación de Trazabilidad',
        value: 'GlobalGAP / Rainforest Alliance',
        helperExplanation: 'Código de finca exigido por los supermercados europeos para autorizar el desembarque en destino.',
      },
      {
        label: 'Costos de Exportación (FOB)',
        value: 'Cartón ($1.40) + Flete Naviero ($3.50)',
        helperExplanation: 'Gastos adicionales incorporados al valor de la fruta para fijar el costo real FOB en puerto de Guayaquil.',
      },
    ],
    workedExample: {
      title: 'Caso Práctico Resuelto: Liquidación de Embarque de 5,000 Cajas de Banano',
      stepByStepMath: [
        'Escenario: Liquidación a productor independiente por 5,000 cajas de banano premium enviadas a Róterdam.',
        'Paso 1: Pago al Productor (Precio Mínimo Oficial) = 5,000 cajas × $6.85 = $34,250.00.',
        'Paso 2: Retención en la Fuente Banano (1.50% impuesto a la renta único) = $34,250.00 × 0.015 = $513.75.',
        'Paso 3: Pago Neto al Productor Bananero = $34,250.00 - $513.75 = $33,736.25.',
        'Paso 4: Insumos de Empaque (Cartón $1.40 + Funda $0.30) = 5,000 × $1.70 = $8,500.00.',
        'Paso 5: Flete y Logística Naviera = 5,000 × $3.50 = $17,500.00.',
        'Paso 6: Costo FOB Total del Contenedor = $34,250.00 + $8,500.00 + $17,500.00 = $60,250.00 ($12.05 por caja exportada).'
      ],
      accountingJournalEntry: [
        { account: '5.1.04.01 Costo de Fruta Adquirida (Banano)', debe: 34250.00 },
        { account: '5.1.04.02 Materiales de Empaque (Cartón y Plásticos)', debe: 8500.00 },
        { account: '5.1.04.03 Fletes Marítimos y Puerto', debe: 17500.00 },
        { account: '2.1.04.03 Retención en la Fuente Banano por Pagar', haber: 513.75 },
        { account: '2.1.01.02 Productores Agrícolas por Pagar (Líquido)', haber: 33736.25 },
        { account: '2.1.01.03 Proveedores de Logística y Empaque', haber: 26000.00 }
      ]
    }
  }
};
