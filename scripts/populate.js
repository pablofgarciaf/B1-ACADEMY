const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/app/api/lesson-data/route.ts');
let content = fs.readFileSync(targetPath, 'utf8');

let newModules = '';

const modules = [
  { mod: 3, img: 'mod3_logistica_1790986000116.jpg', title: 'Aprovisionamiento y Control de Inventarios', classes: ['Ciclo Procure-to-Pay', 'Transacciones de Almacén', 'Recuentos de Inventario', 'MRP Básico'] },
  { mod: 4, img: 'mod4_ventas_1790986008319.jpg', title: 'Gestión de Ventas y Order-to-Cash', classes: ['Proceso de Ventas', 'Oportunidades de Ventas', 'Facturación y Entregas', 'Devoluciones'] },
  { mod: 5, img: 'mod4_ventas_1790986008319.jpg', title: 'Estrategias Avanzadas de Precios', classes: ['Descuentos por Periodo', 'Grupos de Descuentos', 'Precios Especiales', 'Campañas'] },
  { mod: 6, img: 'mod4_ventas_1790986008319.jpg', title: 'Gestión CRM y Servicios Post-venta', classes: ['Llamadas de Servicio', 'Tarjetas de Equipo', 'Base de Soluciones', 'Garantías'] },
  { mod: 7, img: 'mod2_maestros_1790985991136.jpg', title: 'Contabilidad Central y NIIF', classes: ['Plan de Cuentas', 'Asientos Manuales', 'Modelos Contables', 'Diferencias de Cambio'] },
  { mod: 8, img: 'mod2_maestros_1790985991136.jpg', title: 'Tesorería, Cobros y Pagos', classes: ['Pagos Recibidos', 'Pagos Efectuados', 'Medios de Pago', 'Reconciliación Interna'] },
  { mod: 9, img: 'mod2_maestros_1790985991136.jpg', title: 'Control de Activos Fijos', classes: ['Datos Maestros de Activos', 'Capitalización', 'Amortización', 'Baja de Activos'] },
  { mod: 10, img: 'mod3_logistica_1790986000116.jpg', title: 'Planificación de Materiales (MRP)', classes: ['Pronósticos', 'Asistente MRP', 'Recomendaciones', 'Ejecución MRP'] },
  { mod: 11, img: 'mod3_logistica_1790986000116.jpg', title: 'Fabricación y Proyectos (BOM)', classes: ['Listas de Materiales', 'Órdenes de Producción', 'Emisión y Recibo', 'Gestión de Proyectos'] },
  { mod: 12, img: 'mod2_maestros_1790985991136.jpg', title: 'Consultoría y Herramientas SQL', classes: ['Query Manager', 'Vistas SQL', 'Data Transfer Workbench', 'Alertas Personalizadas'] },
];

modules.forEach(m => {
  newModules += `\n  // ============================================================================\n`;
  newModules += `  // MÓDULO ${m.mod}: ${m.title}\n`;
  newModules += `  // ============================================================================\n`;
  
  m.classes.forEach((cTitle, idx) => {
    const cNum = idx + 1;
    newModules += `
  'mod${m.mod}-c${cNum}': {
    images: ['/images/${m.img}'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre ${cTitle}. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "${m.title} > ${cTitle}",
          title: "Práctica: ${cTitle}",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de ${cTitle}.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },`;
  });
});

content = content.replace('};', newModules + '\n};');
fs.writeFileSync(targetPath, content);
console.log('Done.');
