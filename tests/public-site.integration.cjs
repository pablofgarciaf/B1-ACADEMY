// Read-only, opt-in deployed-page check. No report files or personal records.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const base = 'https://b1-academy.vercel.app';
test('todas las páginas del sitemap público responden y las páginas comerciales tienen metadatos', {
  skip: process.env.RUN_PUBLIC_SITE_TESTS !== '1' && 'Requiere comprobación pública explícita', timeout: 180000,
}, async () => {
  const get = async (path, method = 'GET') => fetch(new URL(path, base), { method, redirect: 'manual', signal: AbortSignal.timeout(30000) });
  const sitemap = await get('/sitemap.xml'); assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1].replace(/&amp;/g, '&')));
  assert.ok(urls.length >= 150 && urls.length <= 500, 'Inventario público esperado');
  for (const url of urls) assert.equal(url.origin, base, 'El sitemap no envía a un dominio ajeno');
  const failed = []; let checked = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (urls.length) {
      const url = urls.pop();
      const result = await get(url, 'HEAD'); checked++;
      if (result.status !== 200) failed.push({ path: url.pathname, status: result.status });
    }
  }));
  assert.deepEqual(failed, [], 'Páginas públicas rotas');
  for (const path of ['/', '/capacitacion', '/empresas', '/manuales', '/blog']) {
    const response = await get(path); assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /<html[^>]+lang="es"/, `${path}: idioma español`);
    assert.match(html, /<title>[^<]+<\/title>/, `${path}: título`);
    assert.match(html, /name="description" content="[^"]+"/, `${path}: descripción`);
    assert.match(html, /rel="canonical"/, `${path}: canonical`);
    assert.match(html, /<h1(?:\s|>)/, `${path}: encabezado principal`);
    assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/, `${path}: indexable`);
  }
  const robots = await get('/robots.txt'); assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Disallow: \/api\//);
  const llms = await get('/llms.txt'); assert.equal(llms.status, 200);
  assert.ok((await llms.text()).length > 100, 'Guía de contenido para buscadores IA');
  console.log(JSON.stringify({ sitemapPagesPassed: checked, commercialMetadataPagesPassed: 5, robots: true, llms: true }));
});
