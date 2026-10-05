'use client';
import type { Vendor } from '@/lib/firestore-types';
import { PartnerLookup } from './CustomerLookupModal';
export default function VendorLookupModal({ onSelect, onClose }: { onSelect: (partner: Vendor) => void; onClose: () => void }) { return <PartnerLookup vendor onSelect={onSelect} onClose={onClose} />; }
