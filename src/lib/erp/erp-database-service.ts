import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { BusinessPartner, Item } from './erp-models';

const SEED_BPS: BusinessPartner[] = [
  { CardCode: "C20000", CardName: "Maxi-Teq", CardType: "C", Address: "Hendon Way 42", City: "London", ZipCode: "NW2 7YT", Balance: 0, CreditLine: 15000.00, CntctPrsn: "Norm Thompson", CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() },
  { CardCode: "C40000", CardName: "Earthshaker Corporation", CardType: "C", Address: "94 Bolton Road", City: "London", ZipCode: "NW12 8HG", Balance: 0, CreditLine: 10000.00, CntctPrsn: "Bob McKensly", CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() },
  { CardCode: "S10000", CardName: "Far East Imports", CardType: "S", Address: "Industrial Port 12", City: "Singapore", ZipCode: "018956", Balance: 0, CreditLine: 80000.00, CntctPrsn: "Lee Kuan", CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() }
];

const SEED_ITEMS: Item[] = [
  { ItemCode: "A00001", ItemName: "Servidor ProLiant DL380 Gen10", ItmsGrpCod: "01", InventoryItem: true, SalesItem: true, PurchaseItem: true, ValuationMethod: 'FIFO', Stock: 15, Price: 1500.00, Currency: "EUR", CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() },
  { ItemCode: "A00002", ItemName: "Memoria RAM 64GB DDR4", ItmsGrpCod: "01", InventoryItem: true, SalesItem: true, PurchaseItem: true, ValuationMethod: 'FIFO', Stock: 120, Price: 375.00, Currency: "EUR", CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() },
  { ItemCode: "Z00001", ItemName: "Licencia SAP B1 Profesional", ItmsGrpCod: "02", InventoryItem: false, SalesItem: true, PurchaseItem: false, ValuationMethod: 'Standard', Stock: 0, Price: 2500.00, Currency: "EUR", CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() }
];

/**
 * Inicializa la base de datos de la "Sociedad Demo" para un estudiante en Firebase.
 * Crea los catálogos base (OCRD, OITM) si la compañía no ha sido inicializada.
 */
export async function initializeDemoCompany(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  const companyRef = doc(db, 'usuarios', userId, 'sociedades', 'SBODEMO');
  
  try {
    const companySnap = await getDoc(companyRef);
    if (companySnap.exists() && companySnap.data()?.initialized) {
      return true; // Ya inicializada
    }

    const batch = writeBatch(db);
    
    // Marcar sociedad como inicializada
    batch.set(companyRef, {
      companyName: "SBODEMO_ES",
      initialized: true,
      createdAt: new Date().toISOString()
    });

    // Inyectar Business Partners (OCRD) semilla
    SEED_BPS.forEach(bp => {
      const bpRef = doc(collection(companyRef, 'OCRD'), bp.CardCode);
      batch.set(bpRef, bp);
    });

    // Inyectar Items (OITM) semilla
    SEED_ITEMS.forEach(item => {
      const itemRef = doc(collection(companyRef, 'OITM'), item.ItemCode);
      batch.set(itemRef, item);
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error inicializando la sociedad demo en Firebase:", error);
    return false;
  }
}

/**
 * Obtiene todos los Socios de Negocios de la empresa del usuario
 */
export async function getBusinessPartners(userId: string): Promise<BusinessPartner[]> {
  try {
    const bpsRef = collection(db, 'usuarios', userId, 'sociedades', 'SBODEMO', 'OCRD');
    const snap = await getDocs(bpsRef);
    return snap.docs.map(doc => doc.data() as BusinessPartner);
  } catch (error) {
    console.error("Error leyendo OCRD:", error);
    return [];
  }
}

/**
 * Obtiene todos los Artículos del inventario de la empresa del usuario
 */
export async function getItems(userId: string): Promise<Item[]> {
  try {
    const itemsRef = collection(db, 'usuarios', userId, 'sociedades', 'SBODEMO', 'OITM');
    const snap = await getDocs(itemsRef);
    return snap.docs.map(doc => doc.data() as Item);
  } catch (error) {
    console.error("Error leyendo OITM:", error);
    return [];
  }
}

/**
 * Crea una Factura de Ventas (OINV) y descuenta el inventario (OITM) de forma transaccional.
 */
export async function createSalesInvoice(
  userId: string, 
  cardCode: string, 
  cardName: string, 
  docTotal: number, 
  lines: { itemCode: string; qty: number; price: number }[]
): Promise<{ success: boolean; docNum?: number; error?: string }> {
  if (!userId) return { success: false, error: "Usuario no autenticado" };

  try {
    const companyRef = doc(db, 'usuarios', userId, 'sociedades', 'SBODEMO');
    const batch = writeBatch(db);

    // 1. Generar número de documento simulado (ej. 1000 + random)
    const newDocNum = Math.floor(10000 + Math.random() * 90000);
    const docEntryStr = newDocNum.toString();

    // 2. Crear cabecera OINV
    const invoiceRef = doc(collection(companyRef, 'OINV'), docEntryStr);
    batch.set(invoiceRef, {
      DocEntry: docEntryStr,
      DocNum: newDocNum,
      CardCode: cardCode,
      CardName: cardName,
      DocDate: new Date().toISOString().split('T')[0],
      DocDueDate: new Date().toISOString().split('T')[0],
      DocTotal: docTotal,
      DocStatus: 'O',
      CreatedAt: new Date().toISOString()
    });

    // 3. Crear líneas INV1 y descontar inventario en OITM
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Insertar línea
      const lineRef = doc(collection(companyRef, 'INV1'), `${docEntryStr}_${i}`);
      batch.set(lineRef, {
        DocEntry: docEntryStr,
        LineNum: i + 1,
        ItemCode: line.itemCode,
        Quantity: line.qty,
        Price: line.price,
        LineTotal: line.qty * line.price
      });

      // Descontar inventario (Leemos el stock actual primero)
      const itemRef = doc(collection(companyRef, 'OITM'), line.itemCode);
      const itemSnap = await getDoc(itemRef);
      if (itemSnap.exists()) {
        const currentStock = itemSnap.data().Stock || 0;
        batch.update(itemRef, { 
          Stock: Math.max(0, currentStock - line.qty),
          UpdatedAt: new Date().toISOString()
        });
      }
    }

    // 4. Actualizar Saldo del Cliente (OCRD) - Motor Financiero Automático
    const bpRef = doc(collection(companyRef, 'OCRD'), cardCode);
    const bpSnap = await getDoc(bpRef);
    if (bpSnap.exists()) {
      const currentBalance = bpSnap.data().Balance || 0;
      batch.update(bpRef, {
        Balance: currentBalance + docTotal, // El saldo de deuda del cliente aumenta
        UpdatedAt: new Date().toISOString()
      });
    }

    // 5. Asiento Contable Automático (OJDT) - Simulado en el Batch
    const jeTransId = Math.floor(50000 + Math.random() * 40000).toString();
    const jeRef = doc(collection(companyRef, 'OJDT'), jeTransId);
    batch.set(jeRef, {
      TransId: jeTransId,
      BaseRef: docEntryStr,
      Memo: `Factura de Clientes - ${cardName}`,
      TransValue: docTotal,
      CreatedAt: new Date().toISOString()
    });

    await batch.commit();
    return { success: true, docNum: newDocNum };
  } catch (error: any) {
    console.error("Error creando Factura de Ventas:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Crea un Asiento Contable Manual (OJDT / JDT1) en el motor financiero
 */
export async function createJournalEntry(
  userId: string,
  memo: string,
  lines: { account: string; shortName: string; debit: number; credit: number }[]
): Promise<{ success: boolean; transId?: string; error?: string }> {
  if (!userId) return { success: false, error: "Usuario no autenticado" };

  try {
    const companyRef = doc(db, 'usuarios', userId, 'sociedades', 'SBODEMO');
    const batch = writeBatch(db);

    const transId = Math.floor(10000 + Math.random() * 90000).toString();
    const totalDebit = lines.reduce((acc, l) => acc + l.debit, 0);

    // Cabecera del Asiento
    const jeRef = doc(collection(companyRef, 'OJDT'), transId);
    batch.set(jeRef, {
      TransId: transId,
      RefDate: new Date().toISOString().split('T')[0],
      Memo: memo,
      TransValue: totalDebit,
      CreatedAt: new Date().toISOString()
    });

    // Líneas del Asiento
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineRef = doc(collection(companyRef, 'JDT1'), `${transId}_${i}`);
      batch.set(lineRef, {
        TransId: transId,
        Line_ID: i + 1,
        Account: line.account,
        ShortName: line.shortName,
        Debit: line.debit,
        Credit: line.credit
      });

      // Si la línea toca un Socio de Negocios (ShortName), afectamos su saldo en OCRD
      if (line.shortName) {
        const bpRef = doc(collection(companyRef, 'OCRD'), line.shortName);
        const bpSnap = await getDoc(bpRef);
        if (bpSnap.exists()) {
          const currentBalance = bpSnap.data().Balance || 0;
          // En SAP, un débito a un cliente aumenta su saldo deudor, un crédito lo disminuye
          const balanceChange = line.debit - line.credit; 
          batch.update(bpRef, {
            Balance: currentBalance + balanceChange,
            UpdatedAt: new Date().toISOString()
          });
        }
      }
    }

    await batch.commit();
    return { success: true, transId };
  } catch (error: any) {
    console.error("Error creando Asiento Contable:", error);
    return { success: false, error: error.message };
  }
}
