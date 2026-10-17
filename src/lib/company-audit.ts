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
  // Firestore maps can return their keys in a different order after persistence.
  const canonical = (value: unknown): unknown => value instanceof Date ? value.toISOString() : Array.isArray(value) ? value.map(canonical)
    : value !== null && typeof value === 'object' ? Object.fromEntries(Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([key,item])=>[key,canonical(item)])) : value;
  return createHash('sha256').update(JSON.stringify(canonical(event))).digest('hex');
}

export function verifyAuditChain(events: CompanyAuditEvent[], head: {version:number;hash:string}|null, companyExists: boolean) {
  if (!events.length) return {valid:!companyExists&&!head,checked:0,...(companyExists||head?{incomplete:true}:{})};
  if (!head || events[0].version!==1) return {valid:false,checked:0,incomplete:true};
  let previousHash='0'.repeat(64),version=0;
  for (const event of events) {
    const {hash,version:current,...payload}=event;
    if (current!==version+1 || event.previousHash!==previousHash || auditHash(payload)!==hash) return {valid:false,checked:version,firstBadVersion:current};
    previousHash=hash;version=current;
  }
  if (head.version!==version || head.hash!==previousHash) return {valid:false,checked:version,incomplete:true};
  return {valid:true,checked:version};
}
