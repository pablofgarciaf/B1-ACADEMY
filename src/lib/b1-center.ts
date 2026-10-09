'use client';

import { getCompany, sendCommand } from '@/lib/firestore-company';
import { comandosB1Center, comandoStock } from '@/lib/b1-center-datos';

export { EMPRESA_CURSO } from '@/lib/b1-center-datos';

const AVANCES = ['Creando tu empresa B1 Center…', 'Configurando bodegas…', 'Registrando clientes de prueba…', 'Registrando proveedores…', 'Cargando artículos…', 'Registrando empleados…', 'Registrando empleados…', 'Registrando empleados…', 'Registrando empleados…'];

/** Crea la B1 Center del estudiante con sus datos de prueba. `avance` informa cada paso a la interfaz. */
export async function crearB1Center(uid: string, avance: (texto: string) => void = () => {}, nombrePersonalizado?: string): Promise<void> {
  const comandos = comandosB1Center(nombrePersonalizado);
  for (let i = 0; i < comandos.length; i++) {
    avance(AVANCES[i] ?? 'Preparando tu empresa…');
    await sendCommand(uid, comandos[i]);
  }
  // 1. Estructura de Producción: Lista de Materiales (BOM) antes del stock del padre
  avance('Configurando listas de materiales de producción (BOM)...');
  try {
    await sendCommand(uid, {
      action: 'bom',
      data: {
        parentItemCode: 'A00006', // Servidor HP ProLiant DL380
        type: 'production',
        components: [
          { itemCode: 'A00007', quantity: 2, unit: 'UND', cost: 80 },
          { itemCode: 'A00008', quantity: 4, unit: 'UND', cost: 45 },
          { itemCode: 'A00011', quantity: 1, unit: 'UND', cost: 30 },
        ],
      },
    });
  } catch { /* BOM opcional */ }

  // 2. Stock inicial en la bodega central para poder vender desde la primera clase.
  avance('Cargando stock inicial…');
  const empresa = await getCompany(uid);
  for (const item of empresa.items) await sendCommand(uid, comandoStock(item.itemCode));

  // 2. Pedido de Cliente abierto (Demanda comercial activa para MRP)
  avance('Registrando pedidos de clientes y demanda MRP...');
  try {
    await sendCommand(uid, {
      action: 'sales',
      data: {
        docType: 'order',
        document: {
          cardCode: 'C20000', // Maxi-Teq
          date: '2026-09-10',
          dueDate: '2026-09-25',
          reference: 'PED-2026-001',
          comments: 'Pedido corporativo renovación oficinas Quito',
          baseDocumentId: '',
          lines: [
            { itemCode: 'A00001', description: 'Laptop Dell Latitude 3420', quantity: 6, unit: 'UND', price: 850, discount: 5, taxRate: 15, warehouseCode: '01' },
            { itemCode: 'A00006', description: 'Servidor HP ProLiant DL380', quantity: 2, unit: 'UND', price: 3200, discount: 0, taxRate: 15, warehouseCode: '01' },
          ],
        },
      },
    });
  } catch { /* Pedido opcional */ }

  // 3. Factura de Clientes con ingresos operacionales reales
  avance('Generando facturación comercial y cuentas por cobrar...');
  try {
    await sendCommand(uid, {
      action: 'sales',
      data: {
        docType: 'invoice',
        document: {
          cardCode: 'C20001', // TechSolutions
          date: '2026-09-18',
          dueDate: '2026-10-05',
          reference: 'FAC-001-001-000045',
          comments: 'Factura comercial de equipamiento corporativo con IVA 15%',
          baseDocumentId: '',
          lines: [
            { itemCode: 'A00002', description: 'Laptop HP ProBook 440', quantity: 4, unit: 'UND', price: 890, discount: 0, taxRate: 15, warehouseCode: '01' },
            { itemCode: 'A00003', description: 'Monitor Lenovo ThinkVision 24"', quantity: 6, unit: 'UND', price: 180, discount: 0, taxRate: 15, warehouseCode: '01' },
          ],
        },
      },
    });
  } catch { /* Factura opcional */ }

  // 4. Pedido de Compra a proveedores en curso
  avance('Registrando órdenes de compra a proveedores...');
  try {
    await sendCommand(uid, {
      action: 'purchase',
      data: {
        docType: 'purchase_order',
        document: {
          cardCode: 'V10000', // Dell Ecuador
          date: '2026-09-12',
          dueDate: '2026-09-28',
          reference: 'OC-DELL-2026-01',
          comments: 'Reposición programada equipos Latitude',
          baseDocumentId: '',
          lines: [
            { itemCode: 'A00001', description: 'Laptop Dell Latitude 3420', quantity: 8, unit: 'UND', price: 650, discount: 0, taxRate: 15, warehouseCode: '01' },
          ],
        },
      },
    });
  } catch { /* Compra opcional */ }

  avance('¡Tu B1 Center está lista con operaciones reales a Septiembre 2026!');
}
