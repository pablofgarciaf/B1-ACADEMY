/**
 * Pruebas de listas de precios derivadas (factor), asistente de actualización y oportunidades con probabilidad.
 *   npx tsx scripts/pruebas/motor_listas_oportunidades.ts
 */
import { applyCommand } from '../../src/lib/company-engine';
import { emptyCompany, type CompanyState } from '../../src/lib/firestore-types';
import { comandosB1Center, comandoStock } from '../../src/lib/b1-center-datos';
import { precioDeLista, precioSugerido, listasDePrecios } from '../../src/lib/company-pricing';
import type { CompanyCommand } from '../../src/lib/company-commands';

let ok = 0; let mal = 0;
const check = (n: string, c: boolean, extra = '') => { if (c) ok++; else mal++; console.log(c ? '✔' : '✘', n, c ? '' : extra); };

let s: CompanyState = emptyCompany(); let reloj = Date.parse('2026-04-01T15:00:00.000Z');
const run = (cmd: unknown): string => { reloj += 5000; const r = applyCommand(s, cmd as CompanyCommand, 'u1', 'a@b.c', new Date(reloj).toISOString()); s = r.state; return r.result; };
const falla = (cmd: unknown): string => { try { run(cmd); return 'NO FALLÓ'; } catch (e) { return (e as Error).message; } };
for (const c of comandosB1Center()) run(c);
for (const it of s.items) run(comandoStock(it.itemCode));
const laptop = s.items[0];

// ═════ Listas derivadas con factor ═════
check('el artículo A00001 cuesta 850,00 en la lista General', laptop.price === 850);
check('solo existen las 3 listas base al empezar', listasDePrecios(s).length === 3);
check('lista sin nombre válido → rechazada', falla({ action: 'priceListSave', data: { name: 'Mayorista', base: 1, factor: 2 } }).includes('Ya existe'));
check('lista con base inexistente → rechazada', falla({ action: 'priceListSave', data: { name: 'Fantasma', base: 9, factor: 2 } }).includes('no existe'));
run({ action: 'priceListSave', data: { name: 'Escuelas 2', base: 1, factor: 2 } });
const escuelas = s.profile!.priceLists!.find(l => l.name === 'Escuelas 2')!;
check('la primera lista nueva es la 4, derivada de General con factor 2', escuelas.no === 4 && escuelas.base === 1 && escuelas.factor === 2);
check('precio en Escuelas 2 = 850 × 2 = 1.700,00', precioDeLista(s, laptop, 4) === 1700, String(precioDeLista(s, laptop, 4)));
run({ action: 'priceListSave', data: { name: 'Escuelas premium', base: 4, factor: 1.1 } });
check('una lista puede derivarse de otra derivada (1.700 × 1,1 = 1.870)', precioDeLista(s, laptop, 5) === 1870, String(precioDeLista(s, laptop, 5)));
check('al cambiar el precio base, las derivadas se recalculan solas', (() => { run({ action: 'itemPrices', data: { itemCode: laptop.itemCode, price: 900, price2: laptop.price2, price3: laptop.price3 } }); return precioDeLista(s, s.items[0], 4) === 1800 && precioDeLista(s, s.items[0], 5) === 1980; })());
check('asignar una lista que no existe a un cliente → rechazado', falla({ action: 'customerPriceList', data: { cardCode: s.customers[0].cardCode, list: 9 } }).includes('no existe'));
run({ action: 'customerPriceList', data: { cardCode: s.customers[0].cardCode, list: 4 } });
const sug = precioSugerido(s, s.customers[0].cardCode, laptop.itemCode, 1)!;
check('al facturar a un cliente con Escuelas 2, SAP propone 1.800,00', sug.precio === 1800 && sug.nombreLista === 'Escuelas 2', `${sug.precio}/${sug.nombreLista}`);

// ═════ Asistente de actualización ═════
run({ action: 'priceUpdate', data: { list: 4, method: 'factor', value: 1.1 } });
check('asistente en lista derivada: factor 2 × 1,1 = 2,2', s.profile!.priceLists!.find(l => l.no === 4)!.factor === 2.2);
check('el precio de Escuelas 2 pasa a 900 × 2,2 = 1.980,00', precioDeLista(s, s.items[0], 4) === 1980, String(precioDeLista(s, s.items[0], 4)));
const antes = s.items[1].price2;
run({ action: 'priceUpdate', data: { list: 2, method: 'percent', value: 10 } });
check('asistente en lista base: +10 % a todos los precios Mayorista', s.items[1].price2 === Math.round(antes * 1.1 * 100) / 100, `${antes} → ${s.items[1].price2}`);
check('factor cero o negativo → rechazado', falla({ action: 'priceUpdate', data: { list: 2, method: 'factor', value: 0 } }).includes('mayor que cero'));

// ═════ Oportunidades ═════
const op = (extra: Record<string, unknown>) => ({ action: 'opportunity', data: { id: '', name: 'Interés en laptops', cardCode: 'C20000', amount: 2000, stage: 'prospecto', expectedClose: '2026-06-30', source: 'Referido', notes: '', lossReason: '', ...extra } });
run(op({ probability: 20 }));
check('la probabilidad escrita (20 %) se respeta en la etapa Primera reunión', s.opportunities.at(-1)!.probability === 20, String(s.opportunities.at(-1)!.probability));
run(op({ name: 'Otra oportunidad' }));
check('sin probabilidad escrita se usa la de la etapa (10 %)', s.opportunities.at(-1)!.probability === 10);
run(op({ name: 'Cerrada', stage: 'ganada', probability: 5 }));
check('una oportunidad ganada siempre es 100 %', s.opportunities.at(-1)!.probability === 100);

console.log(`\n${ok} correctas, ${mal} fallidas`);
if (mal) process.exit(1);
