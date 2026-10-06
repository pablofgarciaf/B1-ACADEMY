import 'server-only';
import { createHash } from 'node:crypto';
import { adminDb } from './firebase-admin';
import { collectionNames, emptyCompany, type CompanyState, type CompanyCollections, type CollectionName, type Entity } from './firestore-types';
import { applyCommand } from './company-engine';
import { today } from './company-calculations';
import { companySummary } from './company-summary';
import type { CompanyCommand } from './company-commands';
import type { Transaction, QuerySnapshot } from 'firebase-admin/firestore';

function assignRows<K extends CollectionName>(state: CompanyState, key: K, snapshot: QuerySnapshot): void {
  state[key] = snapshot.docs.map(doc => doc.data() as CompanyCollections[K]) as CompanyState[K];
}
export async function readCompanyFirestore(uid: string, tx?: Transaction): Promise<CompanyState> {
  try {
    if (!tx) return await adminDb.runTransaction(transaction => readCompanyFirestore(uid, transaction), { readOnly: true });
    const root = adminDb.collection('sapCompanies').doc(uid);
    const state = emptyCompany();
    const profileRef = root.collection('profile').doc('main');
    const profile = tx ? await tx.get(profileRef) : await profileRef.get();
    state.profile = profile.exists ? profile.data() as CompanyState['profile'] : null;
    const snapshots = await Promise.all(collectionNames.map(name => tx ? tx.get(root.collection(name)) : root.collection(name).get()));
    snapshots.forEach((snapshot, i) => assignRows(state, collectionNames[i], snapshot));
    return state;
  } catch (error: unknown) { throw new Error('No se pudo leer la empresa.', { cause: error }); }
}
export async function executeCompanyCommandFirestore(uid: string, email: string, command: CompanyCommand, requestId: string): Promise<string> {
  try {
    return await adminDb.runTransaction(async tx => {
      const root = adminDb.collection('sapCompanies').doc(uid);
      const requestRef = root.collection('requests').doc(requestId);
      const previous = await tx.get(requestRef);
      const fingerprint = createHash('sha256').update(JSON.stringify(command)).digest('hex');
      if (previous.exists) {
        if (previous.data()?.fingerprint !== fingerprint) throw new Error('La solicitud ya fue usada para otra operación.');
        return String(previous.data()?.result ?? '');
      }
      const before = await readCompanyFirestore(uid, tx);
      const { state, result } = applyCommand(before, command, uid, email, new Date().toISOString());
      let writes = 0;
      for (const name of collectionNames) {
        const old = new Map<string, Entity>(before[name].map(row => [row.id, row]));
        for (const row of state[name]) if (JSON.stringify(old.get(row.id)) !== JSON.stringify(row)) {
          tx.set(root.collection(name).doc(row.id), row); writes++;
        }
      }
      if (writes > 450) throw new Error('Demasiadas líneas para una sola operación; divide el documento.');
      if (state.profile) {
        tx.set(root.collection('profile').doc('main'), state.profile);
        const activityDate = today();
        tx.set(root, { ...state.profile, ...companySummary(state, activityDate) });
      }
      tx.set(requestRef, { result, action: command.action, fingerprint, createdAt: new Date().toISOString() });
      return result;
    });
  } catch (error: unknown) { if (error instanceof Error) throw error; throw new Error('No se pudo guardar la operación.'); }
}
