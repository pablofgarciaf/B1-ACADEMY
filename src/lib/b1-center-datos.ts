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

const EMPLEADOS = [
  { firstName: 'Juan', lastName: 'Pérez', identification: '1712345675', position: 'Gerente Comercial', department: 'Comercial', hireDate: '2022-01-10', baseSalary: 1200, thirteenthMonthly: false, fourteenthMonthly: false, reserveMonthly: true },
  { firstName: 'María', lastName: 'Gómez', identification: '1709876542', position: 'Contadora General', department: 'Contabilidad', hireDate: '2024-03-01', baseSalary: 900, thirteenthMonthly: false, fourteenthMonthly: false, reserveMonthly: true },
  { firstName: 'Carlos', lastName: 'López', identification: '1711111110', position: 'Jefe de Bodega', department: 'Bodega', hireDate: '2023-06-10', baseSalary: 750, thirteenthMonthly: false, fourteenthMonthly: false, reserveMonthly: false },
  { firstName: 'Ana', lastName: 'Silva', identification: '1722222229', position: 'Asistente de Ventas', department: 'Ventas', hireDate: '2026-01-15', baseSalary: 482, thirteenthMonthly: true, fourteenthMonthly: true, reserveMonthly: true },
];

/** Comandos que crean la B1 Center completa (sin el stock, que necesita los códigos de artículo generados). */
export function comandosB1Center(): CompanyCommand[] {
  return [
    { action: 'initialize', data: { companyName: EMPRESA_CURSO } },
    { action: 'companySettings', data: { companyName: EMPRESA_CURSO, ruc: '1792456789001', address: 'Av. El Salvador N34-12, Quito', phone: '022345678', incomeTaxRate: 25,
      warehouses: [{ code: '01', name: 'Bodega Central Quito' }, { code: '02', name: 'Bodega Sucursal Guayaquil' }] } },
    { action: 'importMasterData', data: { kind: 'customer', rows: CLIENTES.map((c) => ({ ...socio(c), kind: 'customer' })) } },
    { action: 'importMasterData', data: { kind: 'vendor', rows: PROVEEDORES.map(socio) } },
    { action: 'importMasterData', data: { kind: 'item', rows: ARTICULOS.map(([name, costo, precio]) => ({
      name, type: 'inventory', group: 'Equipos', purchaseUnit: 'UND', salesUnit: 'UND', price: precio, price2: precio, price3: precio,
      maxDiscount: 10, purchasePrice: costo, preferredVendor: '', weight: 0, length: 0, width: 0, height: 0, costingMethod: 'average',
      standardCost: costo, minStock: 2, maxStock: 50, reorderPoint: 5, description: name, specifications: '', active: true,
    })) } },
    ...EMPLEADOS.map((e): CompanyCommand => ({ action: 'employee', data: { ...e, contract: 'indefinite', schedule: 'full', employerRate: 12.15, personalRate: 9.45, vacationDays: 15, dependents: 0, projectedExpenses: 0, active: true } })),
    {
      action: 'journal',
      data: {
        date: '2026-09-01',
        dueDate: '2026-09-01',
        memo: 'Asiento de Apertura y Balance Inicial a Septiembre 2026',
        reference: 'APER-2026',
        lines: [
          { accountCode: '1.1.01', description: 'Caja General - Apertura', debit: 12000, credit: 0, costCenter: '' },
          { accountCode: '1.1.02', description: 'Bancos Locales - Apertura', debit: 65000, credit: 0, costCenter: '' },
          { accountCode: '1.1.03', description: 'Clientes Nacionales - Cartera inicial', debit: 18000, credit: 0, costCenter: '' },
          { accountCode: '1.1.05', description: 'Inventario de mercaderías - Inicial', debit: 35000, credit: 0, costCenter: '' },
          { accountCode: '1.2.01', description: 'Equipos de cómputo y oficina', debit: 25000, credit: 0, costCenter: '' },
          { accountCode: '2.1.01', description: 'Proveedores locales por pagar', debit: 0, credit: 20000, costCenter: '' },
          { accountCode: '2.1.04', description: 'Obligaciones tributarias SRI / IESS', debit: 0, credit: 2500, costCenter: '' },
          { accountCode: '2.1.05', description: 'Sueldos por pagar fin de mes', debit: 0, credit: 2500, costCenter: '' },
          { accountCode: '3.01', description: 'Capital social pagado', debit: 0, credit: 100000, costCenter: '' },
          { accountCode: '3.02', description: 'Resultados acumulados ejercicios anteriores', debit: 0, credit: 30000, costCenter: '' },
        ],
      },
    },
  ];
}

/** Stock inicial de un artículo en la bodega central. */
export const comandoStock = (itemCode: string): CompanyCommand => ({ action: 'stock', data: { itemCode, warehouseCode: '01', qty: 20, costingMethod: 'average' } });
