'use client';
import type { PurchaseDocType } from '@/lib/firestore-types';
import SalesOrderForm from './SalesOrderForm';
export default function PurchaseOrderForm({ docType = 'purchase_order' }: { docType?: PurchaseDocType }) { return <SalesOrderForm docType={docType} />; }
