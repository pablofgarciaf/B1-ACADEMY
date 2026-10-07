/**
 * Datos de prueba de B1 Center (módulo puro, sin conexión): los usa crearB1Center y las pruebas del motor.
 */
import type { CompanyCommand } from '@/lib/company-commands';

export const EMPRESA_CURSO = 'B1 Center';

const CLIENTES = [
  { name: 'Maxi-Teq', city: 'Quito', ruc: '1790011003001' },
  { name: 'TechSolutions', city: 'Guayaquil', ruc: '0990022003001' },
  { name: 'CompuMundo', city: 'Cuenca', ruc: '0190033007001' },
  { name: 'ElectroHogar', city: 'Manta', ruc: '1390045006001' },
  { name: 'Sistemas del Valle', city: 'Quito', ruc: '1790055000001' },
];
const PROVEEDORES = [
  { name: 'Dell Ecuador', city: 'Quito', ruc: '1790066002001' },
  { name: 'HP Importaciones', city: 'Guayaquil', ruc: '0990077002001' },
  { name: 'Lenovo Andina', city: 'Quito', ruc: '1790088006001' },
  { name: 'Acer Distributors', city: 'Cuenca', ruc: '0190099008001' },
];
const ARTICULOS: [string, number, number][] = [
  ['Laptop Dell Latitude 3420', 650, 850], ['Laptop HP ProBook 440', 680, 890], ['Monitor Lenovo ThinkVision 24"', 120, 180],
  ['Teclado Inalámbrico Logitech', 25, 45], ['Mouse Óptico Dell', 10, 20], ['Servidor HP ProLiant DL380', 2500, 3200],
  ['Disco Duro SSD 1TB Samsung', 80, 130], ['Memoria RAM 16GB DDR4', 45, 75], ['Impresora Multifunción Epson', 150, 220],
  ['Switch Cisco 24 Puertos', 300, 450], ['Cable de Red Cat6 100m', 30, 55], ['UPS APC 1500VA', 180, 260],
];

const socio = (s: { name: string; city: string; ruc: string }) => ({
  name: s.name, ruc: s.ruc, email: '', phone: '', address: s.city, city: s.city, contactName: '', currency: 'USD' as const,
  paymentTermsDays: 30, creditLimit: 10000, active: true, group: 'Nacional', notes: 'Dato de prueba de B1 Center',
});

/** Comandos que crean la B1 Center completa (sin el stock, que necesita los códigos de artículo generados). */
export function comandosB1Center(): CompanyCommand[] {
  return [
    { action: 'initialize', data: { companyName: EMPRESA_CURSO } },
    { action: 'companySettings', data: { companyName: EMPRESA_CURSO, ruc: '1792456789001', incomeTaxRate: 25,
      warehouses: [{ code: '01', name: 'Bodega Central Quito' }, { code: '02', name: 'Bodega Sucursal Guayaquil' }] } },
    { action: 'importMasterData', data: { kind: 'customer', rows: CLIENTES.map((c) => ({ ...socio(c), kind: 'customer' })) } },
    { action: 'importMasterData', data: { kind: 'vendor', rows: PROVEEDORES.map(socio) } },
    { action: 'importMasterData', data: { kind: 'item', rows: ARTICULOS.map(([name, costo, precio]) => ({
      name, type: 'inventory', group: 'Equipos', purchaseUnit: 'UND', salesUnit: 'UND', price: precio, price2: precio, price3: precio,
      maxDiscount: 10, purchasePrice: costo, preferredVendor: '', weight: 0, length: 0, width: 0, height: 0, costingMethod: 'average',
      standardCost: costo, minStock: 2, maxStock: 50, reorderPoint: 5, description: name, specifications: '', active: true,
    })) } },
  ];
}

/** Stock inicial de un artículo en la bodega central. */
export const comandoStock = (itemCode: string): CompanyCommand => ({ action: 'stock', data: { itemCode, warehouseCode: '01', qty: 20, costingMethod: 'average' } });
