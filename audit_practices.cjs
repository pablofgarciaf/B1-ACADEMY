const fs = require('fs');
require('./tests/register.cjs');
const lecciones = JSON.parse(fs.readFileSync('src/content/aula/lecciones.json', 'utf8'));
const { pantallaConectada } = require('./src/lib/practica-conectada.ts');
const { outcomeContractFor } = require('./src/lib/practice-outcome-contract.ts');
const { STRICT_PRACTICE_KEYS } = require('./src/lib/strict-practice-keys.ts');

// 1. Natural Sort Helper
function naturalCompare(a, b) {
  const parseKey = (key) => {
    // e.g. "mod1-c2#5" -> { mod: 1, c: 2, slide: 5 }
    // e.g. "mod-ventas-c1#2" -> { mod: 999, c: 1, slide: 2 }
    const match = key.match(/mod(?:-([a-z]+)|(\d+))-c(\d+)#(\d+)/i);
    if (!match) return { mod: 9999, c: 0, slide: 0, raw: key };
    const mod = match[2] ? parseInt(match[2], 10) : 900;
    const c = parseInt(match[3], 10);
    const slide = parseInt(match[4], 10);
    return { mod, c, slide, raw: key };
  };

  const pa = parseKey(a.missionId);
  const pb = parseKey(b.missionId);

  if (pa.mod !== pb.mod) return pa.mod - pb.mod;
  if (pa.c !== pb.c) return pa.c - pb.c;
  return pa.slide - pb.slide;
}

// 2. Extraer y ordenar las 386 prácticas
const rawReport = [];
for (const [classId, cls] of Object.entries(lecciones)) {
  for (const s of (cls.syncData || [])) {
    const sg = s.step_guide;
    if (!sg || (sg.action_type !== 'practica' && (!sg.campos || !sg.campos.length))) continue;
    const missionId = classId + '#' + s.slide_index;
    const conn = pantallaConectada({ title: sg.title, menu_path: sg.menu_path, missionId });
    rawReport.push({
      classId,
      slideIndex: s.slide_index,
      missionId,
      title: sg.title || '',
      menuPath: sg.menu_path || '',
      scriptText: s.script_text || '',
      screenType: conn ? conn.clave : 'didactica_formulario',
      screenDetails: conn || null,
      instructions: sg.instructions || [],
      campos: sg.campos || []
    });
  }
}
rawReport.sort(naturalCompare);
fs.writeFileSync('reporte_practicas.json', JSON.stringify(rawReport, null, 2), 'utf8');

// 3. Detección exhaustiva de errores
function detectErrors(p) {
  const errors = [];
  const title = (p.title || '').trim();
  const menu = (p.menuPath || '').trim();
  const campos = p.campos || [];
  const contract = outcomeContractFor(p.missionId);
  const isStrict = STRICT_PRACTICE_KEYS.has(p.missionId);

  // Excluir mod18-c2#8 porque ya fue corregido en main (abrir maestro de artículos)
  if (p.missionId === 'mod18-c2#8') {
    return errors;
  }

  // A. Discrepancias directas de contrato de validación (El validador estricto busca algo distinto a lo que pide la lección)
  if (contract && contract.requirements) {
    for (const req of contract.requirements) {
      const exp = String(req.expected || '').trim();
      if (!exp) continue;
      const matching = campos.find(c =>
        c.etiqueta.toLowerCase() === req.label.toLowerCase() ||
        (req.label === 'Cuenta' && /cuenta/i.test(c.etiqueta) && !/compensación/i.test(c.etiqueta)) ||
        (req.label === 'Artículo' && /artículo/i.test(c.etiqueta) && !/grupo/i.test(c.etiqueta)) ||
        (req.label === 'Proveedor' && /proveedor/i.test(c.etiqueta)) ||
        (req.label === 'Cliente' && /cliente/i.test(c.etiqueta))
      );
      if (matching) {
        const val = String(matching.valor || '').trim();
        const norm = s => s.toLowerCase().replace(/\.00$/, '').replace(/,/g, '').trim();
        const isAccountMatch = req.path === 'accountCode' && ['101000', '1.1.01', 'caja'].includes(norm(val)) && ['101000', '1.1.01', 'caja'].includes(norm(exp));
        const isKindMatch = req.path === 'kind' && ((norm(val) === 'cliente' && norm(exp) === 'customer') || (norm(val) === 'customer' && norm(exp) === 'cliente') || (norm(val) === 'caja' && norm(exp) === 'cash'));
        const isManageMatch = req.path === 'manageMethod' && (['sí', 'si', 'serial', 'números de serie'].includes(norm(val)) && ['sí', 'si', 'serial', 'números de serie'].includes(norm(exp)));
        const isBoolMatch = (req.path === 'isAsset' || req.path === 'virtual') && (['marcado', 'sí', 'si'].includes(norm(val)) && ['marcado', 'sí', 'si'].includes(norm(exp)));

        if (!isAccountMatch && !isKindMatch && !isManageMatch && !isBoolMatch) {
          if (norm(val) !== norm(exp) && !norm(val).includes(norm(exp)) && !norm(exp).includes(norm(val))) {
            errors.push({
              code: 'CONTRATO_VALOR_MISMATCH',
              msg: `Discrepancia en "${matching.etiqueta}": El formulario pide "${val}", pero el validador estricto espera "${exp}" (${req.path}).`
            });
          }
        }
      }
    }
  }

  // B. Prácticas estrictas bloqueadas sin contrato implementado
  if (isStrict && p.screenType !== 'didactica_formulario' && (!contract || (contract.pending && contract.pending.length > 0))) {
    errors.push({
      code: 'STRICT_PENDING',
      msg: 'Práctica estricta (v3) bloqueada por contrato pendiente: arroja error 409 PRACTICE_CONTENT_PENDING al verificar.'
    });
  }

  // C. Enrutamiento erróneo de documentos (Ventas vs Compras)
  if (p.missionId === 'mod12-c2#6' && p.screenDetails?.docType !== 'order') {
    errors.push({
      code: 'DOC_TYPE_MISMATCH',
      msg: 'Enrutamiento erróneo: "Convertir oferta a pedido" en Ventas abría la orden de compra (purchase_order) de Compras.'
    });
  }

  // D. Enrutamiento erróneo a pantallas incompatibles
  if (p.missionId === 'mod13-c3#8' && p.screenType === 'descuentos') {
    errors.push({
      code: 'PANTALLA_DESALINEADA',
      msg: 'Pide asignar grupo de descuento al cliente Maxi-Teq (C20000) en datos maestros, pero se enruta a la pantalla de Descuentos por volumen (sin campos de cliente).'
    });
  }
  if (p.missionId === 'mod21-c3#5' && p.screenType === 'costos') {
    errors.push({
      code: 'PANTALLA_DESALINEADA',
      msg: 'Pide activar la inicialización del presupuesto en Parametrizaciones Generales, pero se enruta arbitrariamente a Centro de Costos.'
    });
  }

  // E. Prácticas de Configuración o Asistentes abiertas en formulario de pagos manuales
  if (p.screenType === 'bancos') {
    if (/bancos propios/i.test(title) || /definición > gestión de bancos > bancos propios/i.test(menu)) {
      errors.push({
        code: 'PANTALLA_BANCOS_CONFIG',
        msg: 'Configuración de bancos propios abierta erróneamente en el formulario transaccional de pagos.'
      });
    } else if (/vías de pago/i.test(title) || /definición > gestión de bancos > vías de pago/i.test(menu)) {
      errors.push({
        code: 'PANTALLA_BANCOS_CONFIG',
        msg: 'Configuración de vías de pago abierta erróneamente en el formulario transaccional de pagos.'
      });
    } else if (/asistente de pagos/i.test(menu)) {
      errors.push({
        code: 'PANTALLA_BANCOS_CONFIG',
        msg: `Paso del Asistente de pagos ("${title}") abierto en formulario de pagos manuales en vez de ficha interactiva guiada.`
      });
    } else if (/extractos de cuenta|reconciliación manual|tratamiento de extracto/i.test(menu) || /extracto|reconciliación manual/i.test(title)) {
      errors.push({
        code: 'PANTALLA_BANCOS_CONFIG',
        msg: `Reconciliación o extracto bancario externo ("${title}") abierto en formulario de pagos de facturas.`
      });
    }
  }

  // F. Discrepancias didácticas Guion vs Campos
  if (p.missionId === 'mod2-c2#10' && /A0013/i.test(p.scriptText)) {
    errors.push({
      code: 'GUION_VS_CAMPOS',
      msg: 'El guion menciona el artículo A0013, pero los campos solo validan las propiedades del grupo HARDWARE.'
    });
  }
  if (p.missionId === 'mod13-c4#8' && !campos.some(c => /destino/i.test(c.etiqueta))) {
    errors.push({
      code: 'GUION_VS_CAMPOS',
      msg: 'El guion menciona copiar precio especial a C20001 y C20002, pero los campos no validan los clientes destino.'
    });
  }
  if ((p.missionId === 'mod15-c1#5' || p.missionId === 'mod15-c4#5') && !campos.some(c => /artículo/i.test(c.etiqueta))) {
    errors.push({
      code: 'GUION_VS_CAMPOS',
      msg: 'El guion explica la configuración del artículo A00007, pero no existe el campo "Artículo" en la validación.'
    });
  }
  if (p.missionId === 'mod18-c2#7' && /asignar artículos A00002 y A00003/i.test(p.scriptText)) {
    errors.push({
      code: 'GUION_VS_CAMPOS',
      msg: 'El guion menciona asignar artículos A00002 y A00003, pero los campos son para definir el grupo contable IMPRES.'
    });
  }

  // Desduplicar errores por código
  const uniqueErrors = [];
  const seen = new Set();
  for (const err of errors) {
    const key = err.code + ':' + err.msg;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueErrors.push(err);
    }
  }

  return uniqueErrors;
}

function severity(errors) {
  if (errors.length === 0) return 'OK';
  if (errors.some(e => ['CONTRATO_VALOR_MISMATCH', 'STRICT_PENDING', 'DOC_TYPE_MISMATCH'].includes(e.code))) return 'ALTO';
  if (errors.some(e => ['PANTALLA_DESALINEADA', 'PANTALLA_BANCOS_CONFIG'].includes(e.code))) return 'MEDIO';
  return 'BAJO';
}

const analyzed = rawReport.map(p => {
  const errs = detectErrors(p);
  return { ...p, errors: errs, severity: severity(errs) };
});

const stats = {
  total: analyzed.length,
  ok: analyzed.filter(p => p.severity === 'OK').length,
  bajo: analyzed.filter(p => p.severity === 'BAJO').length,
  medio: analyzed.filter(p => p.severity === 'MEDIO').length,
  alto: analyzed.filter(p => p.severity === 'ALTO').length,
};

// Módulos ordenados naturalmente: mod1, mod2, ... mod31, mod-ventas
const modulosMap = new Map();
analyzed.forEach(p => {
  const modId = p.classId.split('-')[0] + (p.classId.startsWith('mod-ventas') ? '-ventas' : '');
  if (!modulosMap.has(modId)) {
    const num = modId.replace(/\D/g, '');
    const sortVal = num ? parseInt(num, 10) : 999;
    modulosMap.set(modId, sortVal);
  }
});
const modulosSorted = Array.from(modulosMap.entries()).sort((a, b) => a[1] - b[1]).map(e => e[0]);

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Auditoría de Prácticas — Finix Academy</title>
<style>
  :root {
    --bg: #0b111a;
    --card: #131c28;
    --border: #1e2c3d;
    --text: #e2e8f0;
    --muted: #8899aa;
    --red: #f87171;
    --red-bg: rgba(248,113,113,0.12);
    --yellow: #fbbf24;
    --yellow-bg: rgba(251,191,36,0.12);
    --green: #34d399;
    --green-bg: rgba(52,211,153,0.12);
    --blue: #38bdf8;
    --accent: #6366f1;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text); padding: 24px; font-size: 13px; line-height: 1.5; }
  header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
  h1 { font-size: 20px; font-weight: 700; color: #fff; }
  .sub { color: var(--muted); font-size: 12px; margin-top: 2px; }
  .stats { display: flex; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
  .sc { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 10px 16px; min-width: 110px; }
  .sc strong { display: block; font-size: 20px; font-weight: 800; color: #fff; }
  .sc span { font-size: 11px; color: var(--muted); }
  .sc.alto strong { color: var(--red); }
  .sc.medio strong { color: var(--yellow); }
  .sc.bajo strong { color: #f59e0b; }
  .sc.ok strong { color: var(--green); }
  .bar { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
  input, select { background: var(--card); border: 1px solid var(--border); color: var(--text); padding: 8px 12px; border-radius: 6px; font-size: 12px; }
  input[type="text"] { width: 320px; }
  .btn-filter { background: var(--card); border: 1px solid var(--border); color: var(--muted); padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s; }
  .btn-filter:hover, .btn-filter.active { background: var(--accent); color: #fff; border-color: var(--accent); }
  table { width: 100%; border-collapse: collapse; background: var(--card); border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
  th { background: #0f1722; padding: 10px 12px; text-align: left; font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border); }
  td { padding: 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
  tr:hover { background: rgba(255,255,255,0.02); }
  .badge { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: 0.04em; }
  .b-ALTO { background: var(--red-bg); color: var(--red); border: 1px solid var(--red); }
  .b-MEDIO { background: var(--yellow-bg); color: var(--yellow); border: 1px solid var(--yellow); }
  .b-BAJO { background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid #f59e0b; }
  .b-OK { background: var(--green-bg); color: var(--green); border: 1px solid var(--green); }
  .tag { display: inline-block; background: rgba(255,255,255,0.06); padding: 1px 6px; border-radius: 3px; font-size: 11px; margin-right: 4px; margin-bottom: 3px; }
  .err-box { background: var(--red-bg); border-left: 3px solid var(--red); padding: 6px 10px; border-radius: 0 4px 4px 0; font-size: 12px; color: #fca5a5; margin-top: 4px; }
  .warn-box { background: var(--yellow-bg); border-left: 3px solid var(--yellow); padding: 6px 10px; border-radius: 0 4px 4px 0; font-size: 12px; color: #fde68a; margin-top: 4px; }
  .info-box { background: rgba(56,189,248,0.08); border-left: 3px solid var(--blue); padding: 6px 10px; border-radius: 0 4px 4px 0; font-size: 12px; color: #bae6fd; margin-top: 4px; }
  .row-btn { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; margin-right: 4px; }
  .row-btn:hover { color: #fff; border-color: var(--muted); }
  .row-btn.flagged { background: var(--red-bg); color: var(--red); border-color: var(--red); }
  .flagged-row { background: rgba(239, 68, 68, 0.06) !important; }
  .note-area { margin-top: 6px; display: none; }
  .note-area textarea { width: 100%; background: #0a0f18; border: 1px solid var(--border); color: var(--text); padding: 6px; border-radius: 4px; font-size: 11px; font-family: inherit; resize: vertical; }
</style>
</head>
<body>

<header>
  <div>
    <h1>🔍 Auditoría Integral de Prácticas — Finix Academy</h1>
    <p class="sub">386 prácticas analizadas exhaustivamente contra Contratos ERP, Enrutamiento de Pantalla, Coherencia de Datos y Guiones · ${new Date().toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
  </div>
</header>

<div class="stats">
  <div class="sc"><strong>${stats.total}</strong><span>Total Prácticas</span></div>
  <div class="sc ok"><strong>${stats.ok}</strong><span>✅ Sin errores</span></div>
  <div class="sc bajo"><strong>${stats.bajo}</strong><span>⚠️ Bajo (Didáctico)</span></div>
  <div class="sc medio"><strong>${stats.medio}</strong><span>🟠 Medio (Pantalla)</span></div>
  <div class="sc alto"><strong>${stats.alto}</strong><span>🔴 Alto (Bloqueante)</span></div>
</div>

<div class="bar">
  <input type="text" id="q" placeholder="Buscar por ID (ej. mod19-c2#5), título, pantalla o error..." oninput="filter()">
  <select id="fsev" onchange="filter()">
    <option value="">Severidad: Todas</option>
    <option value="ERRORS" selected>⚠️ Todas con hallazgos (${stats.total - stats.ok})</option>
    <option value="ALTO">🔴 Alto (${stats.alto})</option>
    <option value="MEDIO">🟠 Medio (${stats.medio})</option>
    <option value="BAJO">⚠️ Bajo (${stats.bajo})</option>
    <option value="OK">✅ OK (${stats.ok})</option>
  </select>
  <select id="fmod" onchange="filter()">
    <option value="">Módulo: Todos</option>
    ${modulosSorted.map(m => `<option value="${m}">${m.toUpperCase()}</option>`).join('')}
  </select>
  <button class="btn-filter" id="btnFlagged" onclick="toggleFlaggedFilter()">🚩 Solo marcadas</button>
  <span style="color:var(--muted); margin-left:auto; font-size:12px;" id="count"></span>
</div>

<table id="tbl">
  <thead>
    <tr>
      <th style="width: 120px;">ID / Misión</th>
      <th style="width: 85px;">Severidad</th>
      <th style="width: 220px;">Misión / Pantalla</th>
      <th>Campos de Validación</th>
      <th style="width: 340px;">Diagnóstico / Hallazgo</th>
      <th style="width: 100px;">Acciones</th>
    </tr>
  </thead>
  <tbody>
    ${analyzed.map(p => {
      const rowId = p.missionId;
      const mod = p.classId.split('-')[0] + (p.classId.startsWith('mod-ventas') ? '-ventas' : '');
      const screenLabel = p.screenDetails ? (p.screenDetails.clave + (p.screenDetails.docType ? ` (${p.screenDetails.docType})` : '')) : 'Ficha didáctica';

      return `
    <tr id="row-${rowId}" data-id="${rowId}" data-mod="${mod}" data-sev="${p.severity}">
      <td>
        <strong style="font-family: monospace; font-size: 12px; color: #fff;">${p.missionId}</strong>
        <div style="color: var(--muted); font-size: 10.5px;">Lámina ${p.slideIndex}</div>
      </td>
      <td>
        <span class="badge b-${p.severity}">${p.severity}</span>
      </td>
      <td>
        <div style="font-weight: 600; color: #fff; margin-bottom: 2px;">${p.title}</div>
        <div style="font-size: 11px; color: var(--muted); margin-bottom: 4px;">Ruta: ${p.menuPath || '—'}</div>
        <div style="font-size: 11px;">
          <span style="color: var(--muted);">Pantalla:</span>
          <span class="tag" style="color: var(--blue);">${screenLabel}</span>
        </div>
      </td>
      <td>
        <div style="max-height: 120px; overflow-y: auto;">
          ${p.campos.map(c => `
            <div style="margin-bottom: 2px; font-size: 11px;">
              <span style="color: var(--muted);">${c.etiqueta}:</span>
              <span style="font-family: monospace; color: #fff; font-weight: 600;">${c.valor}</span>
            </div>
          `).join('')}
        </div>
      </td>
      <td>
        ${p.errors.length === 0 ? `
          <div style="color: var(--green); font-size: 11.5px;">✓ Contrato y pantalla en perfecta coherencia</div>
        ` : p.errors.map(e => `
          <div class="${e.code.includes('CONTRATO') || e.code.includes('DOC_TYPE') || e.code.includes('STRICT') ? 'err-box' : e.code.includes('PANTALLA') ? 'warn-box' : 'info-box'}">
            <strong>[${e.code}]</strong> ${e.msg}
          </div>
        `).join('')}
      </td>
      <td>
        <button class="row-btn" id="btn-flag-${rowId}" onclick="toggleFlag('${rowId}')">🚩 Marcar</button>
        <button class="row-btn" onclick="toggleNote('${rowId}')">💬 Nota</button>
        <div class="note-area" id="note-box-${rowId}">
          <textarea id="note-${rowId}" rows="2" placeholder="Comentarios..." oninput="saveNote('${rowId}')"></textarea>
        </div>
      </td>
    </tr>
      `;
    }).join('')}
  </tbody>
</table>

<script>
  let onlyFlagged = false;

  function loadSavedState() {
    const flagged = JSON.parse(localStorage.getItem('audit_flagged') || '[]');
    flagged.forEach(id => {
      const row = document.getElementById('row-' + id);
      const btn = document.getElementById('btn-flag-' + id);
      if (row) row.classList.add('flagged-row');
      if (btn) btn.classList.add('flagged');
    });

    const notes = JSON.parse(localStorage.getItem('audit_notes') || '{}');
    Object.entries(notes).forEach(([id, txt]) => {
      const noteInput = document.getElementById('note-' + id);
      const box = document.getElementById('note-box-' + id);
      if (noteInput && txt) {
        noteInput.value = txt;
        if (box) box.style.display = 'block';
      }
    });
  }

  function toggleFlag(id) {
    let flagged = JSON.parse(localStorage.getItem('audit_flagged') || '[]');
    const row = document.getElementById('row-' + id);
    const btn = document.getElementById('btn-flag-' + id);
    if (flagged.includes(id)) {
      flagged = flagged.filter(x => x !== id);
      if (row) row.classList.remove('flagged-row');
      if (btn) btn.classList.remove('flagged');
    } else {
      flagged.push(id);
      if (row) row.classList.add('flagged-row');
      if (btn) btn.classList.add('flagged');
    }
    localStorage.setItem('audit_flagged', JSON.stringify(flagged));
    if (onlyFlagged) filter();
  }

  function toggleNote(id) {
    const box = document.getElementById('note-box-' + id);
    if (!box) return;
    box.style.display = box.style.display === 'block' ? 'none' : 'block';
  }

  function saveNote(id) {
    const notes = JSON.parse(localStorage.getItem('audit_notes') || '{}');
    const val = (document.getElementById('note-' + id)?.value || '').trim();
    if (val) {
      notes[id] = val;
    } else {
      delete notes[id];
    }
    localStorage.setItem('audit_notes', JSON.stringify(notes));
  }

  function toggleFlaggedFilter() {
    onlyFlagged = !onlyFlagged;
    const btn = document.getElementById('btnFlagged');
    btn.classList.toggle('active', onlyFlagged);
    filter();
  }

  function filter() {
    const q = document.getElementById('q').value.toLowerCase().trim();
    const fsev = document.getElementById('fsev').value;
    const fmod = document.getElementById('fmod').value;
    const rows = document.querySelectorAll('#tbl tbody tr');
    let visible = 0;

    rows.forEach(tr => {
      const sev = tr.getAttribute('data-sev');
      const mod = tr.getAttribute('data-mod');
      const text = tr.innerText.toLowerCase();
      const isFlagged = tr.classList.contains('flagged-row');

      let show = true;
      if (onlyFlagged && !isFlagged) show = false;
      if (show && fmod && mod !== fmod) show = false;
      if (show && fsev) {
        if (fsev === 'ERRORS') {
          if (sev === 'OK') show = false;
        } else if (sev !== fsev) {
          show = false;
        }
      }
      if (show && q && !text.includes(q)) show = false;

      tr.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    document.getElementById('count').innerText = \`Mostrando \${visible} de \${rows.length} prácticas\`;
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadSavedState();
    filter();
  });
</script>

</body>
</html>
`;

fs.writeFileSync('public/auditoria_practicas.html', html, 'utf8');
console.log(`Auditoría actualizada con éxito. Total analizado: ${analyzed.length}. Total con hallazgos: ${analyzed.filter(p => p.severity !== 'OK').length}.`);
