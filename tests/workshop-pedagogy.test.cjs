const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('./register.cjs');
const lessons = require('../src/lib/aula/published-lessons.ts').default;
const { OPERATIONAL_WORKSHOPS } = require('../src/lib/aula/operational-workshops.ts');
const { OFFICIAL_SYLLABUS } = require('../src/lib/curriculum-data.ts');
const { practicasDelModulo, camposEsperados, guiaPublicada } = require('../src/lib/practice-registry.ts');
const { pantallaConectada } = require('../src/lib/practica-conectada.ts');
const { coincide } = require('../src/lib/practice-check.ts');

test('los talleres publicados forman parte de los requisitos reales y no se enrutan a escrituras ERP', () => {
  let count = 0;
  for (const [classId, workshops] of Object.entries(OPERATIONAL_WORKSHOPS)) {
    const curriculumModule = OFFICIAL_SYLLABUS.find(candidate => candidate.classes.some(clase => clase.id === classId));
    const required = practicasDelModulo(curriculumModule.id);
    const cases = lessons[classId].syncData.filter(slide => slide.step_guide?.action_type === 'caso');
    assert.equal(cases.length, workshops.length);
    assert.ok(cases.length >= 2, classId);
    for (const slide of cases) {
      const key = `${classId}#${slide.slide_index}`;
      assert.ok(required.includes(key), key);
      assert.equal(pantallaConectada(guiaPublicada(classId, slide.slide_index)), null, key);
      assert.deepEqual(camposEsperados(classId, slide.slide_index), slide.step_guide.campos);
      for (const field of slide.step_guide.campos) {
        assert.ok(coincide(field.valor, field.valor, field.etiqueta));
        assert.equal(coincide('', field.valor, field.etiqueta), false);
        assert.equal(coincide('respuesta incorrecta', field.valor, field.etiqueta), false);
        if (field.opciones) assert.ok(field.opciones.includes(field.valor));
      }
      assert.ok(slide.step_guide.expected_output.length > 30);
      count++;
    }
  }
  assert.equal(count, 16);
});

test('salida laboral deja de repetir beneficios y no acredita el antiguo rol de nómina', () => {
  const exit = lessons['mod5-c3'];
  assert.notDeepEqual(exit.syncData, lessons['mod6-c2'].syncData);
  assert.match(exit.syncData[0].script_text, /expediente de salida/);
  assert.equal(camposEsperados('mod5-c3', 5), null);
  assert.ok(!practicasDelModulo('mod-5').includes('mod5-c3#5'));
  assert.ok(practicasDelModulo('mod-5').includes('mod5-c3#11'));
  assert.ok(practicasDelModulo('mod-5').includes('mod5-c3#12'));
});

test('el contenido efectivo conserva clases, secuencia, láminas y representación textual de los casos', () => {
  const classes = OFFICIAL_SYLLABUS.flatMap(module => module.classes.map(clase => clase.id));
  assert.deepEqual(Object.keys(lessons).sort(), classes.sort());
  for (const [classId, lesson] of Object.entries(lessons)) {
    assert.equal(lesson.syncData.length, lesson.images.length, classId);
    lesson.syncData.forEach((slide, i) => {
      assert.equal(slide.slide_index, i + 1);
      if (slide.step_guide?.action_type === 'caso') {
        assert.equal(slide.presentation, 'text');
        assert.ok(fs.existsSync(path.join(__dirname, '../public', lesson.images[i])));
      }
    });
  }
});

test('casos logísticos, proyectos y retenciones concilian sus importes', () => {
  const values = (id, caseIndex) => OPERATIONAL_WORKSHOPS[id][caseIndex].fields.map(field => field.valor);
  assert.deepEqual(values('mod9-c2', 1), ['2', '2', '3', '150']);
  assert.deepEqual(values('mod10-c1', 1), ['5', '3', '1', 'No']);
  assert.deepEqual(values('mod16-c4', 1), ['600', '0', 'P-01']);
  assert.deepEqual(values('mod22-c4', 0).map(Number), [1000 * 0.01, 150 * 0.3, 1150 - 10 - 45]);
  assert.deepEqual(values('mod22-c10', 0).map(Number), [1095, 55, 0]);
  assert.deepEqual(values('mod6-c2', 0).map(Number), [960 / 12, 480 / 12, 960 / 12, 960 / 24]);
});
