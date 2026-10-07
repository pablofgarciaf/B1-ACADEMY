'use client';

import { getCompany, sendCommand } from '@/lib/firestore-company';
import { comandosB1Center, comandoStock } from '@/lib/b1-center-datos';

export { EMPRESA_CURSO } from '@/lib/b1-center-datos';

const AVANCES = ['Creando tu empresa B1 Center…', 'Configurando bodegas…', 'Registrando clientes de prueba…', 'Registrando proveedores…', 'Cargando artículos…', 'Registrando empleados…', 'Registrando empleados…', 'Registrando empleados…', 'Registrando empleados…'];

/** Crea la B1 Center del estudiante con sus datos de prueba. `avance` informa cada paso a la interfaz. */
export async function crearB1Center(uid: string, avance: (texto: string) => void = () => {}): Promise<void> {
  const comandos = comandosB1Center();
  for (let i = 0; i < comandos.length; i++) {
    avance(AVANCES[i] ?? 'Preparando tu empresa…');
    await sendCommand(uid, comandos[i]);
  }
  // Stock inicial en la bodega central para poder vender desde la primera clase.
  avance('Cargando stock inicial…');
  const empresa = await getCompany(uid);
  for (const item of empresa.items) await sendCommand(uid, comandoStock(item.itemCode));
  avance('¡Tu B1 Center está lista!');
}
