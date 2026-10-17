const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('./register.cjs');
const { OFFICIAL_SYLLABUS, SYLLABUS_BLOCKS, SPECIALTY_DIPLOMAS } = require('../src/lib/curriculum-data.ts');
const { EXAM_BANK, EXAM_QUESTIONS_PER_ATTEMPT } = require('../src/lib/exam-bank.ts');
const { practicasDelModulo, camposEsperados } = require('../src/lib/practice-registry.ts');
const lessons = require('../src/content/aula/lecciones.json');

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
