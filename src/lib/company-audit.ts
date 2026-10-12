import { createHash } from 'node:crypto';
import { collectionNames, type CollectionName, type CompanyState, type Entity } from './firestore-types';
import type { CompanyCommand } from './company-commands';

export type AuditChange = {
  collection: CollectionName | 'profile';
  id: string;
  before: unknown | null;
  after: unknown | null;
};

export type CompanyAuditEvent = {
  version?: number;
  companyId: string;
  actorUid: string;
  actorEmail: string;
  requestId: string;
  action: CompanyCommand['action'] | 'migracion' | 'assignMission';
  result: string;
  occurredAt: string;
  changes: AuditChange[];
  previousHash: string;
  hash: string;
};

export function auditChanges(before: CompanyState, after: CompanyState): AuditChange[] {
  const changes: AuditChange[] = [];
  if (JSON.stringify(before.profile) !== JSON.stringify(after.profile)) {
    changes.push({ collection: 'profile', id: 'main', before: before.profile, after: after.profile });
  }
  for (const collection of collectionNames) {
    const old = new Map<string, Entity>(before[collection].map(row => [row.id, row]));
    for (const row of after[collection] as Entity[]) {
      const prior = old.get(row.id) ?? null;
      if (JSON.stringify(prior) !== JSON.stringify(row)) changes.push({ collection, id: row.id, before: prior, after: row });
      old.delete(row.id);
    }
    for (const prior of old.values()) changes.push({ collection, id: prior.id, before: prior, after: null });
  }
  return changes;
}

export function auditHash(event: Omit<CompanyAuditEvent, 'hash'>): string {
  return createHash('sha256').update(JSON.stringify(event)).digest('hex');
}
