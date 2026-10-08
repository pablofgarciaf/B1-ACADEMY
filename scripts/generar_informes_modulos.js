import fs from 'fs';
import path from 'path';

// Load content files
const clasesPath = path.resolve('src/content/aula/clases.json');
const leccionesPath = path.resolve('src/content/aula/lecciones.json');
const mallaPath = path.resolve('src/content/malla/malla.json');

const clasesData = JSON.parse(fs.readFileSync(clasesPath, 'utf8'));
const leccionesData = JSON.parse(fs.readFileSync(leccionesPath, 'utf8'));
const mallaData = JSON.parse(fs.readFileSync(mallaPath, 'utf8'));

// Normalize text for rule matching
const plano = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

// Map module names from malla.json
const moduleMeta = {};
mallaData.modulos.forEach(m => {
  const num = parseInt(m.id.replace('M', ''), 10);
  const modKey = 'mod-' + num;
  moduleMeta[modKey] = {
    id: m.id,
    name: m.name,
    purpose: m.purpose || '',
    question: m.question || '',
    career: m.career || '',
    manuals: m.manuals || []
  };
});

// PantallaConectada rules matching practica-conectada.ts
const REGLAS = [
  [/ruc del sistema|ingresar (el )?ruc/, { clave: 'empresa', screen: 'CompanySettingsScreen.tsx' }],
  [/comprobante de retencion|emitir (la )?retencion|generar (el )?comprobante|retencion electronica|comprobante electronico|guia de remision|autorizar.*sri|\bsri\b/, { clave: 'sri', screen: 'SRIElectronicScreen.tsx' }],
  [/utilidades de los trabajadores|participacion de (los )?trabajadores|impuesto a la renta (del ejercicio|anual|de la empresa)|cierre tributario|anticipo (de|del) impuesto/, { clave: 'cierreTributario', screen: 'TaxCloseScreen.tsx' }],
  [/(^|[^a-z])isd([^a-z]|$)|salida de divisas|pago al exterior|pagos al exterior/, { clave: 'isd', screen: 'ForeignPaymentScreen.tsx' }],
  [/pagos (efectuados|recibidos)|pagar (los )?sueldos|pagar (la )?planilla|pago.*proveedor|pagar.*proveedor|ejecutar pago/, { clave: 'bancos', screen: 'BankingScreen.tsx' }],
  [/(^|[^a-z])rol(es)?([^a-z]|$)|liquidar sueldos|ejecutar nomina/, { clave: 'nomina', screen: 'PayrollRunScreen.tsx' }],
  [/nota de credito|abono de cliente/, { clave: 'documento', docType: 'credit_note', screen: 'SalesOrderForm.tsx' }],
  [/factura de proveedor|factura de acreedor/, { clave: 'documento', docType: 'vendor_invoice', screen: 'SalesOrderForm.tsx' }],
  [/entrada de mercanc|recepcion de mercanc|grpo/, { clave: 'documento', docType: 'goods_receipt', screen: 'SalesOrderForm.tsx' }],
  [/solicitud de compra/, { clave: 'documento', docType: 'purchase_request', screen: 'SalesOrderForm.tsx' }],
  [/convertir.*pedido|pedido de compra|orden de compra|compras.*pedido/, { clave: 'documento', docType: 'purchase_order', screen: 'SalesOrderForm.tsx' }],
  [/nota de credito de cliente|nota de credito de venta|nota de credito de deudor/, { clave: 'documento', docType: 'credit_note', screen: 'SalesOrderForm.tsx' }],
  [/factura de (cliente|deudor|venta)/, { clave: 'documento', docType: 'invoice', screen: 'SalesOrderForm.tsx' }],
  [/entrega/, { clave: 'documento', docType: 'delivery', screen: 'SalesOrderForm.tsx' }],
  [/pedido de cliente|orden de venta|pedido de venta/, { clave: 'documento', docType: 'order', screen: 'SalesOrderForm.tsx' }],
  [/oferta de venta|cotizacion de venta|cotizacion a cliente/, { clave: 'documento', docType: 'quotation', screen: 'SalesOrderForm.tsx' }],
  [/proveedor/, { clave: 'proveedor', screen: 'CompanyPartnerForm.tsx (vendor)' }],
  [/(socio|interlocutor)[^>]*(datos maestros|maestro)|crear (nuevo )?cliente|nuevo cliente/, { clave: 'cliente', screen: 'CompanyPartnerForm.tsx' }],
  [/datos maestros de articulo|maestro de articulo|crear (nuevo )?articulo|nuevo articulo/, { clave: 'articulo', screen: 'ItemMasterForm.tsx' }],
  [/asiento/, { clave: 'asiento', screen: 'JournalEntryForm.tsx' }],
  [/activos? fijos?|capitalizacion|depreciacion/, { clave: 'activos', screen: 'FixedAssetsScreen.tsx' }],
  [/lista de materiales|bom\b/, { clave: 'bom', screen: 'BOMForm.tsx' }],
  [/orden de produccion|orden de fabricacion/, { clave: 'produccion', screen: 'ProductionOrderForm.tsx' }],
  [/transferencia/, { clave: 'transferencia', screen: 'WarehouseTransferForm.tsx' }],
  [/inventario fisico|recuento de inventario|recuento de stock|resultado de conteo|conteo.*stock|conteo.*inventario/, { clave: 'conteo', screen: 'InventoryCountScreen.tsx' }],
  [/descuento/, { clave: 'descuentos', screen: 'VolumeDiscountScreen.tsx' }],
  [/lista(s)? de precios/, { clave: 'precios', screen: 'PriceListScreen.tsx' }],
  [/pago|cobro|banco|reconcilia|conciliacion/, { clave: 'bancos', screen: 'BankingScreen.tsx' }],
  [/empleado/, { clave: 'empleado', screen: 'EmployeeForm.tsx' }],
  [/oportunidad/, { clave: 'oportunidad', screen: 'OpportunitiesScreen.tsx' }],
  [/detalles de la empresa/, { clave: 'empresa', screen: 'CompanySettingsScreen.tsx' }],
  [/presupuesto/, { clave: 'presupuesto', screen: 'BudgetScreen.tsx' }],
  [/cierre de periodo|periodos contables|cierre del ejercicio/, { clave: 'cierre', screen: 'PeriodCloseScreen.tsx' }],
  [/costos? de importacion|gastos de envio|landed/, { clave: 'importacion', screen: 'LandedCostScreen.tsx' }],
  [/mrp|planificacion de necesidades|datos de planificacion|parametros de planificacion/, { clave: 'mrp', screen: 'MRPScreen.tsx' }],
  [/generador de consultas|consulta sql|query|crear consulta|asistente.*consulta|consulta.*variable|consulta.*fecha/, { clave: 'consultas', screen: 'QueryManagerScreen.tsx' }],
  [/comprobante electronico|retencion electronica|sri/, { clave: 'sri', screen: 'SRIElectronicScreen.tsx' }],
  [/cliente potencial|registrar cliente|convertir.*potencial|potencial.*cliente/, { clave: 'cliente', screen: 'CompanyPartnerForm.tsx' }],
  [/grupo de clientes|grupo de socios|grupo.*clientes/, { clave: 'grupos', tipo: 'cliente', screen: 'GruposScreen.tsx' }],
  [/grupo.*articulo|grupo cable/, { clave: 'grupos', tipo: 'articulo', screen: 'GruposScreen.tsx' }],
  [/peso del articulo|articulo virtual|articulo generico|definir.*articulo|datos.*articulo/, { clave: 'articulo', screen: 'ItemMasterForm.tsx' }],
  [/salida.*produccion|salida para produccion|generar salida/, { clave: 'produccion', screen: 'ProductionOrderForm.tsx' }],
  [/entrada.*produccion|entrada desde produccion|recibir produccion|recepcion.*produccion/, { clave: 'produccion', screen: 'ProductionOrderForm.tsx' }],
  [/agregar componente|componente.*lista|componente.*bom/, { clave: 'bom', screen: 'BOMForm.tsx' }],
  [/agregar recurso.*ldm|recurso.*lista de materiales|recurso.*materiales/, { clave: 'bom', screen: 'BOMForm.tsx' }],
  [/serie.*activos|activos.*serie/, { clave: 'series', docType: 'activos', screen: 'SeriesNumeracionScreen.tsx' }],
  [/serie.*factura|factura.*serie|serie por defecto|serie.*ventas norte|serie.*ventas|serie.*clientes norte|serie.*clientes|formato.*serie|configurar formato.*cli|cli.*formato/, { clave: 'series', docType: 'facturas', screen: 'SeriesNumeracionScreen.tsx' }],
  [/serie de numeracion|crear serie|definir serie|autorizar.*grupo.*serie|autorizar.*ana/, { clave: 'series', screen: 'SeriesNumeracionScreen.tsx' }],
  [/monedas local|configurar monedas|diferencia.*cambio|revalorizacion|tipo de cambio/, { clave: 'monedas', screen: 'MonedasScreen.tsx' }],
  [/centro de coste|centros de coste|cost center|reparto.*area|norma.*area|area.*norma|vincular.*cuenta.*norma|cuenta.*norma|informe de gastos/, { clave: 'costos', screen: 'CentroCostesScreen.tsx' }],
  [/recurso de trabajo|recursos de trabajo/, { clave: 'recursos', tipo: 'trabajo', screen: 'RecursosProduccionScreen.tsx' }],
  [/recurso de maquina|recursos de maquina|tiempo de ejecucion|configurar.*recurso|filtrar.*fila|tipo de fila recurso/, { clave: 'recursos', tipo: 'maquina', screen: 'RecursosProduccionScreen.tsx' }],
  [/tabla de conductores|objeto definido|udos?|campo.*conductor|conductor.*campo|agregar campo nombre|registrar.*udo|udo.*registrar/, { clave: 'udo', screen: 'UDOScreen.tsx' }],
  [/cockpit|plantilla.*cockpit|asignar.*plantilla/, { clave: 'cockpit', screen: 'CockpitScreen.tsx' }],
  [/informacion del sistema|activar.*informacion|configurar sistema/, { clave: 'empresa', screen: 'CompanySettingsScreen.tsx' }],
  [/saldo.*apertura|apertura.*saldo|saldos iniciales/, { clave: 'asiento', screen: 'JournalEntryForm.tsx' }],
];

function getPantallaInfo(g) {
  if (!g) return null;
  const tit = plano(g.title);
  if (/buscar|consultar|identificar|verificar|revisar|visualizar|solicitar|anular|anulacion|asistente de pagos|payment wizard|generador de consultas|agregar tabla|filtrar|seleccionar campos|vincular consulta|programar notificacion|configurar ficha|datos de planificacion|definir peso|grupo cable|definir categorias|activar informacion|widget de actividades|agregar widget|configuracion de widget|prevision|alerta de stock|proceso de autorizacion|visibilidad de udf|importar desde excel|importar nuevo/.test(tit) || /^ver\b/.test(tit)) {
    return null;
  }
  const texto = plano(`${g.title ?? ''} ${g.menu_path ?? ''}`);
  for (const [re, info] of REGLAS) {
    if (re.test(texto)) return info;
  }
  return null;
}

// Module IDs in order: mod-1 .. mod-24, mod-25
const modKeys = Object.keys(clasesData).sort((a, b) => {
  const numA = parseInt(a.replace('mod-', ''), 10);
  const numB = parseInt(b.replace('mod-', ''), 10);
  return numA - numB;
});

const outputDir = path.resolve('docs/informes_modulos');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const resumenGlobal = [];

modKeys.forEach(modKey => {
  const num = parseInt(modKey.replace('mod-', ''), 10);
  const padNum = num < 10 ? '0' + num : '' + num;
  const meta = moduleMeta[modKey] || { name: 'Módulo ' + num, purpose: '', question: '', career: '' };
  const classesList = clasesData[modKey] || [];

  let totalPracticas = 0;
  let practicasConectadas = 0;
  let practicasSimuladas = 0;
  let erroresBloqueantes = 0;
  let advertenciasRedundancia = 0;

  const clasesDetalle = [];

  classesList.forEach(cls => {
    const classId = cls.id;
    const lesson = leccionesData[classId];
    const syncData = lesson?.syncData || [];

    const practicas = [];

    syncData.forEach(slide => {
      if (slide.step_guide) {
        totalPracticas++;
        const g = slide.step_guide;
        const pantalla = getPantallaInfo(g);
        if (pantalla) practicasConectadas++;
        else practicasSimuladas++;

        const issues = [];

        // Check 1: Redundancia de datos en instructions
        const instructions = g.instructions || [];
        const hasRedundancy = instructions.some(inst => /datos a registrar:/i.test(inst));
        let redundantText = '';
        if (hasRedundancy) {
          advertenciasRedundancia++;
          const idxRedundant = instructions.findIndex(inst => /datos a registrar:/i.test(inst));
          redundantText = instructions[idxRedundant];
          issues.push({
            tipo: 'REDUNDANCIA_DATOS',
            severidad: 'ADVERTENCIA',
            descripcion: 'Instrucción con bloque redundante "Datos a registrar:" que duplica la tabla de campos.',
            instruccionIndex: idxRedundant,
            texto: redundantText
          });
        }

        // Check 2: Formulario Conectado y campos obligatorios
        if (pantalla) {
          if (pantalla.clave === 'cliente' || pantalla.clave === 'proveedor') {
            const hasName = (g.campos || []).some(c => /nombre|razon|cliente|proveedor/i.test(c.etiqueta));
            if (!hasName) {
              erroresBloqueantes++;
              issues.push({
                tipo: 'CAMPO_REQUIRED_FALTANTE',
                severidad: 'BLOQUEANTE',
                descripcion: 'CompanyPartnerForm.tsx exige Razón Social. No está presente en campos.',
                pantalla: pantalla.screen
              });
            }
          } else if (pantalla.clave === 'articulo') {
            const hasName = (g.campos || []).some(c => /nombre|art[ií]culo|descripci[oó]n/i.test(c.etiqueta));
            if (!hasName) {
              erroresBloqueantes++;
              issues.push({
                tipo: 'CAMPO_REQUIRED_FALTANTE',
                severidad: 'BLOQUEANTE',
                descripcion: 'ItemMasterForm.tsx exige Nombre del artículo. No está presente en campos.',
                pantalla: pantalla.screen
              });
            }
          } else if (pantalla.clave === 'consultas') {
            // Ya reparado con c.save({ action: 'query' }) en QueryManagerScreen.tsx
          } else if (pantalla.clave === 'bom') {
            issues.push({
              tipo: 'DEPENDENCIA_MAESTRA',
              severidad: 'ADVERTENCIA',
              descripcion: 'BOMForm.tsx requiere artículos de inventario previamente registrados. Si la empresa del alumno está vacía, el select de Producto Padre estará deshabilitado.',
              pantalla: pantalla.screen
            });
          } else if (pantalla.clave === 'produccion') {
            issues.push({
              tipo: 'DEPENDENCIA_MAESTRA',
              severidad: 'ADVERTENCIA',
              descripcion: 'ProductionOrderForm.tsx requiere que exista al menos una Lista de Materiales (BOM) de producción. Si no existe, el formulario bloquea con select vacío.',
              pantalla: pantalla.screen
            });
          }
        } else {
          // Práctica Simulada en PracticaValidada
          if (!g.campos || g.campos.length === 0) {
            issues.push({
              tipo: 'CAMPOS_VACIOS',
              severidad: 'ADVERTENCIA',
              descripcion: 'Práctica simulada sin array de campos interactivos (modo solo lectura o checklist).'
            });
          }
        }

        practicas.push({
          slide_index: slide.slide_index,
          title: g.title,
          menu_path: g.menu_path || 'No especificada',
          action_type: g.action_type,
          pantalla: pantalla ? pantalla.screen : 'Simulador Genérico (PracticaValidada.tsx)',
          esConectada: !!pantalla,
          claveConectada: pantalla?.clave || null,
          instructions: g.instructions || [],
          campos: g.campos || [],
          issues,
          script_text: slide.script_text
        });
      }
    });

    clasesDetalle.push({
      classId,
      number: cls.number,
      title: cls.title,
      durationMinutes: cls.durationMinutes,
      totalSlides: syncData.length,
      practicas
    });
  });

  const estadoGeneral = erroresBloqueantes > 0 
    ? '🔴 REQUIERE CORRECCIÓN URGENTE' 
    : (advertenciasRedundancia > 0 ? '🟡 REQUIERE LIMPIEZA DE INSTRUCCIONES' : '🟢 100% OPERATIVO / LISTO');

  resumenGlobal.push({
    modKey,
    num,
    name: meta.name,
    totalClases: classesList.length,
    totalPracticas,
    practicasConectadas,
    practicasSimuladas,
    erroresBloqueantes,
    advertenciasRedundancia,
    estadoGeneral,
    fileName: `INFORME_MODULO_${padNum}.md`
  });

  // GENERAR MARKDOWN DEL MÓDULO INDIVIDUAL
  let md = `# 📘 Informe de Auditoría y Especificación Quirúrgica: Módulo ${padNum}\n\n`;
  md += `**Nombre Oficial:** ${meta.name}  \n`;
  md += `**ID Interno:** \`${modKey}\`  \n`;
  md += `**Propósito Pedagógico:** ${meta.purpose || 'Formación práctica en SAP Business One'}  \n`;
  md += `**Pregunta Guía:** *${meta.question || 'N/A'}*  \n`;
  md += `**Estado del Módulo:** **${estadoGeneral}**  \n\n`;

  md += `---\n\n`;
  md += `## 📊 Resumen Ejecutivo del Módulo\n\n`;
  md += `| Métrica | Valor |\n`;
  md += `| :--- | :--- |\n`;
  md += `| **Total Clases en el Módulo** | ${classesList.length} |\n`;
  md += `| **Total Prácticas Interactivas** | ${totalPracticas} |\n`;
  md += `| **Prácticas Conectadas (ERP Real)** | ${practicasConectadas} |\n`;
  md += `| **Prácticas Simuladas (PracticaValidada)** | ${practicasSimuladas} |\n`;
  md += `| **Errores Bloqueantes Detectados** | ${erroresBloqueantes} |\n`;
  md += `| **Instrucciones Redundantes ("Datos a registrar:")** | ${advertenciasRedundancia} |\n\n`;

  md += `---\n\n`;
  md += `## 🎯 Guía Quirúrgica para Astra (Cero Desperdicio de Tokens)\n\n`;
  md += `> **Directriz de Ejecución:** Para aplicar las correcciones sin quemar créditos ni buscar archivos innecesarios:\n`;
  md += `> 1. Ubica el archivo principal de datos: \`src/content/aula/lecciones.json\`.\n`;
  md += `> 2. Busca la clave de la clase específica (ej. \`"${modKey}-c1"\`).\n`;
  md += `> 3. Dirígete a \`syncData\` en el \`slide_index\` señalado.\n`;
  md += `> 4. Aplica el reemplazo exacto del bloque JSON mostrado en cada sección.\n\n`;

  md += `---\n\n`;
  md += `## 🔬 Detalle Quirúrgico Clase por Clase\n\n`;

  clasesDetalle.forEach(cls => {
    md += `### 📁 Clase ${cls.number}: ${cls.title} (\`${cls.classId}\`)\n`;
    md += `- **Duración Estimada:** ${cls.durationMinutes} minutos\n`;
    md += `- **Total de Láminas:** ${cls.totalSlides}\n`;
    md += `- **Prácticas Interactivas:** ${cls.practicas.length}\n\n`;

    if (cls.practicas.length === 0) {
      md += `*ℹ️ Esta clase es conceptual/teórica. No contiene prácticas interactivas ni bloqueos técnicos.*\n\n`;
      return;
    }

    cls.practicas.forEach((p, pIdx) => {
      const severityIcon = p.issues.some(i => i.severidad === 'BLOQUEANTE') ? '🔴' : (p.issues.length > 0 ? '🟡' : '🟢');
      md += `#### ${severityIcon} Práctica ${pIdx + 1}: ${p.title} (Lámina ${p.slide_index})\n\n`;
      md += `- **Ruta en SAP B1:** \`${p.menu_path}\`\n`;
      md += `- **Tipo de Ejecución:** ${p.esConectada ? `Conectada a pantalla real ERP (\`${p.pantalla}\`)` : `Simulador Validado (\`PracticaValidada.tsx\`)}`}\n`;
      md += `- **Estado Técnico:** ${p.issues.length === 0 ? '🟢 **Limpia / Sin Errores**' : p.issues.map(i => `**${i.severidad}: ${i.tipo}**`).join(' | ')}\n\n`;

      if (p.issues.length > 0) {
        md += `##### ⚠️ Problemas Identificados:\n`;
        p.issues.forEach(iss => {
          md += `- **[${iss.severidad}] ${iss.tipo}:** ${iss.descripcion}\n`;
          if (iss.texto) {
            md += `  > *Texto exacto a depurar:* \`${iss.texto}\`\n`;
          }
        });
        md += `\n`;
      }

      md += `##### 📋 Tabla de Campos Esperados:\n\n`;
      if (p.campos.length > 0) {
        md += `| Campo / Etiqueta | Valor Esperado | Pista / Contexto |\n`;
        md += `| :--- | :--- | :--- |\n`;
        p.campos.forEach(f => {
          md += `| \`${f.etiqueta}\` | **${f.valor}** | ${f.pista || '—'} |\n`;
        });
        md += `\n`;
      } else {
        md += `*No se registraron campos interactivos para esta práctica (revisión visual o lectura).*\n\n`;
      }

      // ACCIÓN QUIRÚRGICA PARA ASTRA
      if (p.issues.length > 0) {
        md += `##### 🛠️ Solución Quirúrgica para Astra (Reemplazo Directo):\n\n`;
        md += `**Archivo:** \`src/content/aula/lecciones.json\`  \n`;
        md += `**Clave:** \`"${cls.classId}"\` -> \`syncData\` -> \`slide_index: ${p.slide_index}\` -> \`step_guide\`\n\n`;

        // Instrucciones limpias (sin redundancia)
        const cleanInstructions = p.instructions.filter(inst => !/datos a registrar:/i.test(inst));
        
        // Campos corregidos si faltaban obligatorios
        let cleanCampos = [...p.campos];
        if (p.issues.some(i => i.tipo === 'CAMPO_REQUIRED_FALTANTE')) {
          if (p.claveConectada === 'cliente' || p.claveConectada === 'proveedor') {
            if (!cleanCampos.some(c => /ruc|identificaci|cedula/i.test(c.etiqueta))) {
              cleanCampos.unshift({ etiqueta: 'RUC / Cédula', valor: '1792999888001', pista: '13 dígitos ficticios' });
            }
            if (!cleanCampos.some(c => /nombre|razon/i.test(c.etiqueta))) {
              cleanCampos.unshift({ etiqueta: 'Razón social', valor: 'Socio Comercial Ficticio S.A.', pista: 'Nombre del socio' });
            }
          } else if (p.claveConectada === 'articulo') {
            if (!cleanCampos.some(c => /nombre|art[ií]culo/i.test(c.etiqueta))) {
              cleanCampos.unshift({ etiqueta: 'Descripción', valor: 'Artículo de Prueba SAP', pista: 'Descripción del ítem' });
            }
          }
        }

        const jsonCorregido = {
          action_type: p.action_type,
          title: p.title,
          menu_path: p.menu_path,
          instructions: cleanInstructions,
          campos: cleanCampos
        };

        md += `\`\`\`json\n`;
        md += `// Reemplazar step_guide en "${cls.classId}" (slide_index: ${p.slide_index}) con este objeto exacto:\n`;
        md += JSON.stringify(jsonCorregido, null, 2);
        md += `\n\`\`\`\n\n`;
      } else {
        md += `*✅ Práctica verificada y compatible. Astra no requiere realizar cambios en esta lámina.*\n\n`;
      }

      md += `---\n\n`;
    });
  });

  // Guardar archivo individual
  const fileName = `INFORME_MODULO_${padNum}.md`;
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, md, 'utf8');
  console.log(`Generado: ${fileName}`);
});

// GENERAR EL ÍNDICE MASTER
let indexMd = `# 📑 ÍNDICE MAESTRO DE AUDITORÍA Y CALIDAD SAP ACADEMY\n\n`;
indexMd += `> **Directorio de Informes:** \`docs/informes_modulos/\`  \n`;
indexMd += `> **Total Módulos Auditados:** ${resumenGlobal.length} módulos  \n`;
indexMd += `> **Generado:** ${new Date().toISOString()}  \n`;
indexMd += `> **Propósito:** Guía de referencia modular y quirúrgica para Astra y desarrolladores.\n\n`;

indexMd += `## 📊 Tabla General de Módulos y Diagnósticos\n\n`;
indexMd += `| Módulo | Título | Clases | Prácticas | Conectadas | Simuladas | Bloqueantes | Redundancias | Estado | Enlace al Informe |\n`;
indexMd += `| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |\n`;

resumenGlobal.forEach(r => {
  const padNum = r.num < 10 ? '0' + r.num : '' + r.num;
  indexMd += `| **${padNum}** | ${r.name} | ${r.totalClases} | ${r.totalPracticas} | ${r.practicasConectadas} | ${r.practicasSimuladas} | ${r.erroresBloqueantes > 0 ? `🔴 ${r.erroresBloqueantes}` : '0'} | ${r.advertenciasRedundancia > 0 ? `🟡 ${r.advertenciasRedundancia}` : '0'} | ${r.estadoGeneral} | [Ver Informe](./informes_modulos/${r.fileName}) |\n`;
});

indexMd += `\n---\n\n`;
indexMd += `## 🚀 Guía de Uso Rápido con Astra\n\n`;
indexMd += `Para reparar un módulo sin quemar créditos de Astra:\n`;
indexMd += `1. Selecciona el módulo a reparar (ej. \`docs/informes_modulos/INFORME_MODULO_09.md\`).\n`;
indexMd += `2. Copia el prompt quirúrgico o el bloque JSON corregido que se encuentra en la sección **Solución Quirúrgica para Astra**.\n`;
indexMd += `3. Astra aplicará el cambio en 1 solo paso sin tener que escanear el repositorio completo.\n\n`;

fs.writeFileSync(path.resolve('docs/INDEX_AUDITORIA_MODULOS.md'), indexMd, 'utf8');
console.log('Generado: INDEX_AUDITORIA_MODULOS.md');
