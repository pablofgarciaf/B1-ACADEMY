const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('./register.cjs');
const { OFFICIAL_SYLLABUS, SYLLABUS_BLOCKS, SPECIALTY_DIPLOMAS } = require('../src/lib/curriculum-data.ts');
const { EXAM_BANK, EXAM_QUESTIONS_PER_ATTEMPT } = require('../src/lib/exam-bank.ts');
const { practicasDelModulo, camposEsperados } = require('../src/lib/practice-registry.ts');
const lessons = require('../src/content/aula/lecciones.json');

test('todas las respuestas publicadas se pueden aprobar, incluidas monedas y separadores', () => {
  const { coincide } = require('../src/lib/practice-check.ts');
  let fields = 0;
  for (const [classId, lesson] of Object.entries(lessons)) {
    for (const slide of lesson.syncData) {
      for (const field of slide.step_guide?.campos ?? []) {
        assert.equal(coincide(field.valor, field.valor, field.etiqueta), true,
          `Respuesta correcta rechazada en ${classId}#${slide.slide_index}: ${field.etiqueta}`);
        fields++;
      }
    }
  }
  assert.ok(fields > 1000);
  assert.equal(coincide('.', ','), false, 'Los dos separadores deben seguir siendo distintos');
  assert.equal(coincide('EUR', 'USD'), false, 'Las monedas deben seguir siendo distintas');
  assert.equal(coincide('', 'USD'), false, 'El vacío no es una moneda');
});

test('la ficha de acceso usa solo credenciales ficticias y no pide claves de cuentas reales', () => {
  const slide = lessons['mod1-c2'].syncData[4];
  assert.equal(slide.presentation, 'text');
  assert.equal(slide.step_guide.campos[0].valor, 'alumno@ejemplo.test');
  assert.equal(slide.step_guide.campos[1].valor, 'ClaveSoloDePractica2026!');
  assert.doesNotMatch(slide.step_guide.instructions.join(' '), /contraseña de tu cuenta|tu correo de usuario/);
  assert.match(slide.script_text, /Nunca escribas una contraseña real/);
});

test('cada práctica conectada tiene una operación verificable y las fichas SQL declaran su alcance', () => {
  const { pantallaConectada } = require('../src/lib/practica-conectada.ts');
  const { operationFor } = require('../src/lib/practice-contract.ts');
  for (const [classId, lesson] of Object.entries(lessons)) {
    for (const slide of lesson.syncData) {
      const screen = pantallaConectada({ ...slide.step_guide, missionId: `${classId}#${slide.slide_index}` });
      if (screen && screen.clave !== 'consultaAcademica') {
        assert.ok(operationFor(screen).length, `${classId}#${slide.slide_index}: pantalla sin operación verificable`);
      }
    }
  }
  for (const id of ['mod23-c1', 'mod30-c3']) {
    for (const slide of lessons[id].syncData) {
      assert.equal(slide.presentation, 'text');
      if (slide.step_guide) assert.equal(pantallaConectada(slide.step_guide), null, `${id}#${slide.slide_index}: una ficha conceptual no debe exigir escritura contable`);
    }
  }
});

test('las consultas enseñadas funcionan con las columnas y los estados reales del laboratorio', () => {
  const { ejecutarConsulta } = require('../src/lib/query-engine.ts');
  const { emptyCompany } = require('../src/lib/firestore-types.ts');
  const company = emptyCompany();
  company.customers = [{ cardCode: 'C1', name: 'Cliente ficticio', balance: 80, creditLimit: 100 }];
  company.vendors = [{ cardCode: 'V1', name: 'Proveedor ficticio', balance: 0 }];
  company.salesOrders = [
    { id: 'i1', docNumber: 'F001', docType: 'invoice', date: '2026-04-02', cardCode: 'C1', total: 115, subtotal: 100, status: 'open', lines: [{itemCode: 'A1', quantity: 1, price: 100, discount: 0}] },
    { id: 'i2', docNumber: 'F002', docType: 'invoice', date: '2026-03-30', cardCode: 'C1', total: 57.5, subtotal: 50, status: 'closed', lines: [] },
    { id: 'o1', docNumber: 'P001', docType: 'order', date: '2026-04-03', cardCode: 'C1', total: 230, subtotal: 200, status: 'open', lines: [{itemCode: 'A1', quantity: 2, price: 100, discount: 0}] },
  ];
  const cases = [
    ["SELECT cardCode, name FROM OCRD WHERE cardType = 'C'", [{cardCode: 'C1', name: 'Cliente ficticio'}]],
    ["SELECT docNumber, cardCode, total FROM ORDR WHERE status = 'open' ORDER BY date", [{docNumber: 'P001', cardCode: 'C1', total: 230}]],
    ["SELECT docNumber, cardCode, total FROM ORDR WHERE date > '2026-04-01' ORDER BY date", [{docNumber: 'P001', cardCode: 'C1', total: 230}]],
    ["SELECT docNumber, itemCode, quantity, lineTotal FROM INV1 WHERE docType = 'invoice'", [{docNumber: 'F001', itemCode: 'A1', quantity: 1, lineTotal: 100}]],
    ['SELECT cardCode, SUM(subtotal) AS base_facturada FROM OINV GROUP BY cardCode ORDER BY base_facturada DESC', [{cardCode: 'C1', base_facturada: 150}]],
    ["SELECT docNumber, date, total FROM OINV WHERE date > '2026-04-01'", [{docNumber: 'F001', date: '2026-04-02', total: 115}]],
    ["SELECT docNumber, cardCode, total FROM OINV WHERE status = 'open'", [{docNumber: 'F001', cardCode: 'C1', total: 115}]],
  ];
  const published = ['mod23-c1', 'mod30-c3'].flatMap(id => lessons[id].syncData.map(s => s.script_text)).join(' ');
  for (const [sql, expected] of cases) {
    assert.ok(published.includes(sql), `Consulta no coincide con el guion: ${sql}`);
    assert.deepEqual(ejecutarConsulta(company, sql).filas, expected, sql);
  }
});

test('la navegación incluye cada módulo publicado y todos los requisitos de diploma existen', () => {
  const modules = new Set(OFFICIAL_SYLLABUS.map(courseModule => courseModule.id));
  assert.equal(modules.size, OFFICIAL_SYLLABUS.length, 'Módulos duplicados');
  for (const courseModule of OFFICIAL_SYLLABUS) {
    assert.ok(SYLLABUS_BLOCKS.includes(courseModule.block), `Módulo oculto por bloque ausente: ${courseModule.id}`);
    assert.ok(courseModule.classes.length > 0, `Módulo vacío: ${courseModule.id}`);
    assert.ok(EXAM_BANK[courseModule.id]?.length >= EXAM_QUESTIONS_PER_ATTEMPT, `Banco insuficiente: ${courseModule.id}`);
    for (const question of EXAM_BANK[courseModule.id]) {
      assert.ok(question.question.trim());
      assert.ok(question.rubric.length >= 3 && question.rubric.every(item => item.trim()));
    }
    assert.ok(practicasDelModulo(courseModule.id).length > 0, `Módulo sin práctica evaluada: ${courseModule.id}`);
  }
  const diplomas = new Set(SPECIALTY_DIPLOMAS.map(diploma => diploma.id));
  for (const diploma of SPECIALTY_DIPLOMAS) {
    for (const moduleId of diploma.requiredModules) assert.ok(modules.has(moduleId), `Requisito inexistente: ${moduleId}`);
    for (const diplomaId of diploma.requiresOneDiplomaOf ?? []) assert.ok(diplomas.has(diplomaId), `Diploma inexistente: ${diplomaId}`);
  }
});

test('cada clase activa tiene narración, láminas ordenadas y prácticas evaluables sin campos vacíos', () => {
  const published = OFFICIAL_SYLLABUS.flatMap(courseModule => courseModule.classes);
  const ids = published.map(lesson => lesson.id);
  assert.equal(new Set(ids).size, ids.length, 'Clases duplicadas entre módulos');
  assert.deepEqual([...Object.keys(lessons)].sort(), [...ids].sort(), 'Contenido huérfano o clase sin contenido');
  for (const lesson of published) {
    assert.match(lesson.description.trim(), /[.!?]$/, `Descripción cortada: ${lesson.id}`);
    assert.ok(Number.isFinite(lesson.durationMinutes) && lesson.durationMinutes > 0);
    const content = lessons[lesson.id];
    assert.ok(content.syncData.length >= 2, `Clase sin desarrollo: ${lesson.id}`);
    assert.equal(content.images.length, content.syncData.length, `Imagen y narración desalineadas: ${lesson.id}`);
    assert.deepEqual(content.syncData.map(slide => slide.slide_index), content.syncData.map((_, index) => index + 1));
    for (const [index, slide] of content.syncData.entries()) {
      assert.ok(slide.script_text.trim().length >= 50, `Guion vacío: ${lesson.id}#${index + 1}`);
      assert.ok(fs.existsSync(path.join(__dirname, '../public', content.images[index])), `Lámina ausente: ${lesson.id}#${index + 1}`);
      const guide = slide.step_guide;
      if (!guide) continue;
      assert.ok(guide.title.trim() && guide.menu_path.trim());
      assert.ok(guide.instructions.length >= 2 && guide.instructions.every(text => text.trim()));
      const expected = camposEsperados(lesson.id, slide.slide_index);
      assert.ok(expected?.length > 0 && expected.length <= 12, `Práctica incompatible con el evaluador: ${lesson.id}#${index + 1}`);
      for (const field of expected) assert.ok(typeof field.valor === 'string' && field.valor.trim() && field.etiqueta.trim());
    }
  }
});

test('las correcciones de arquitectura y facturación se presentan con el mismo texto visible y narrado', () => {
  for (const [id, indices] of [['mod1-c1', [2, 4, 6, 9, 10, 11, 12]], ['mod22-c1', [1, 2, 3, 4, 5, 7, 8, 9, 10]]]) {
    for (const index of indices) assert.equal(lessons[id].syncData[index - 1].presentation, 'text', `${id}#${index}: captura heredada contradice la corrección`);
  }
  const architecture = EXAM_BANK['mod-1'][0];
  assert.doesNotMatch(architecture.rubric.join(' '), /HANA|SQL Server|cada sociedad es una base de datos independiente/);
  assert.match(lessons['mod22-c1'].syncData[6].script_text, /no envía una solicitud al SRI/);
  assert.ok(lessons['mod22-c1'].references.every(reference => new URL(reference.url).hostname === 'www.sri.gob.ec'));
});

test('los ejemplos analíticos del curso funcionan sobre los registros disponibles y se califican como análisis', () => {
  const { ejecutarConsulta } = require('../src/lib/query-engine.ts');
  const { emptyCompany } = require('../src/lib/firestore-types.ts');
  const { pantallaConectada } = require('../src/lib/practica-conectada.ts');
  const company = emptyCompany();
  company.salesOrders = [
    { docType: 'invoice', cardCode: 'C1', subtotal: 100 },
    { docType: 'invoice', cardCode: 'C1', subtotal: 50 },
    { docType: 'credit_note', cardCode: 'C1', subtotal: 20 },
    { docType: 'order', cardCode: 'C1', subtotal: 900 },
  ];
  company.warehouseStock = [{ warehouseCode: '01', quantity: 3 }, { warehouseCode: '01', quantity: 4 }, { warehouseCode: '02', quantity: 2 }];
  const content = lessons['mod24-c2'];
  const invoiceQuery = content.syncData[10].script_text.match(/SELECT .*? DESC/)[0];
  assert.deepEqual(ejecutarConsulta(company, invoiceQuery).filas, [{ cardCode: 'C1', base_facturada: 150 }]);
  const stockQuery = content.syncData[11].script_text.match(/SELECT .*? GROUP BY warehouseCode/)[0];
  assert.deepEqual(ejecutarConsulta(company, stockQuery).filas, [{ warehouseCode: '01', unidades: 7 }, { warehouseCode: '02', unidades: 2 }]);
  for (const slide of content.syncData) {
    assert.equal(slide.presentation, 'text');
    if (slide.step_guide) assert.equal(pantallaConectada({ ...slide.step_guide, missionId: `mod24-c2#${slide.slide_index}` }), null, 'Una respuesta analítica no debe calificarse como una escritura contable');
  }
  assert.equal(pantallaConectada(lessons['mod22-c1'].syncData[6].step_guide), null, 'La solicitud al proveedor no crea una factura ni un proveedor');
});
