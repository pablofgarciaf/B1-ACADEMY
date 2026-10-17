const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('./register.cjs');
const { ALL_MANUALS, MANUAL_CATEGORIES } = require('../src/lib/manuals-120-data.ts');
const { ALL_SLIDES_INDEX } = require('../src/lib/all-slides-index.ts');
const root = path.join(__dirname, '../public');

test('todas las categorías del selector tienen resultados y cubren el catálogo sin duplicarlo', () => {
  const ids = [];
  for (const category of MANUAL_CATEGORIES) {
    const matches = ALL_MANUALS.filter(manual => manual.category === category.name);
    assert.ok(matches.length > 0, `Filtro vacío: ${category.name}`);
    assert.deepEqual(category.manuals.map(manual => manual.id), matches.map(manual => manual.id));
    ids.push(...matches.map(manual => manual.id));
  }
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, ALL_MANUALS.length);
});

test('cada manual y cada lámina de la API apuntan a un recurso publicado real y ordenado', () => {
  for (const manual of ALL_MANUALS) {
    for (const field of ['pdfPath', 'mdPath', 'imagesPath']) {
      assert.ok(fs.existsSync(path.join(root, manual[field])), `${manual.id}: ${field}`);
    }
    const names = ALL_SLIDES_INDEX[manual.id];
    assert.ok(names?.length > 0, `Manual sin láminas: ${manual.id}`);
    assert.equal(new Set(names).size, names.length);
    assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b, 'en', { numeric: true })));
    for (const name of names) assert.ok(fs.existsSync(path.join(root, manual.imagesPath, name)), `${manual.id}: ${name}`);
  }
  const guided = require('../src/content/clases-maestras/m01/sim-m01-l02.json');
  for (const step of guided.pasos) assert.ok(fs.existsSync(path.join(root, step.screenshot)), `Paso ${step.id}: captura inexistente`);
});
