const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
require('./register.cjs');
const original = Module._load;
Module._load = function(name, ...args) { return name === 'server-only' ? {} : original.call(this, name, ...args); };
const { firmarTexto, firmaValida } = require('../src/lib/tts-firma.ts');
Module._load = original;

test('la narración pública mantiene firma estable sin clave dedicada y rechaza texto o credencial distintos', () => {
  const keys = ['TTS_SIGNING_SECRET', 'CERTIFICATE_SIGNING_SECRET', 'FIREBASE_ADMIN_PRIVATE_KEY'];
  const before = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  try {
    keys.forEach(key => delete process.env[key]);
    assert.equal(firmarTexto('Guion'), undefined);
    process.env.FIREBASE_ADMIN_PRIVATE_KEY = 'credencial-sintetica-de-prueba';
    const signature = firmarTexto('Guion de prueba');
    assert.ok(firmaValida('Guion de prueba', signature));
    assert.equal(firmarTexto('Guion de prueba'), signature);
    assert.equal(firmaValida('Texto arbitrario', signature), false);
    process.env.FIREBASE_ADMIN_PRIVATE_KEY = 'otra-credencial-sintetica';
    assert.equal(firmaValida('Guion de prueba', signature), false);
    process.env.TTS_SIGNING_SECRET = 'clave-dedicada-sintetica';
    const dedicated = firmarTexto('Guion de prueba');
    process.env.FIREBASE_ADMIN_PRIVATE_KEY = 'rotacion-sintetica';
    assert.ok(firmaValida('Guion de prueba', dedicated));
  } finally {
    for (const key of keys) if (before[key] === undefined) delete process.env[key]; else process.env[key] = before[key];
  }
});
