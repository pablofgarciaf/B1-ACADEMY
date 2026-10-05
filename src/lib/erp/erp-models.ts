// src/lib/erp/erp-models.ts

// ═════════════════════════════════════════════════════════════════
// MODELOS DE DATOS MAESTROS (MASTER DATA)
// ═════════════════════════════════════════════════════════════════

// OCRD - Business Partner Master Data (Maestro de Socios de Negocios)
export interface BusinessPartner {
  CardCode: string;
  CardName: string;
  CardType: 'C' | 'S' | 'L'; // C = Customer, S = Vendor, L = Lead
  GroupCode?: string;
  Address?: string;
  City?: string;
  ZipCode?: string;
  Phone1?: string;
  Email?: string;
  Balance: number;
  CreditLine: number;
  CntctPrsn?: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// OITM - Item Master Data (Maestro de Artículos)
export interface Item {
  ItemCode: string;
  ItemName: string;
  ItmsGrpCod?: string;
  InventoryItem: boolean;
  SalesItem: boolean;
  PurchaseItem: boolean;
  ValuationMethod: 'FIFO' | 'Moving Average' | 'Standard';
  Stock: number;
  Price: number;
  Currency: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// ═════════════════════════════════════════════════════════════════
// MODELOS DE DOCUMENTOS DE MARKETING
// ═════════════════════════════════════════════════════════════════

// OINV - A/R Invoice (Factura de Clientes - Cabecera)
export interface ARInvoice {
  DocEntry: string;
  DocNum: number;
  CardCode: string;
  CardName: string;
  DocDate: string;
  DocDueDate: string;
  DocTotal: number;
  VatSum: number;
  DocStatus: 'O' | 'C'; // Open, Closed
  Comments?: string;
  CreatedAt: string;
}

// INV1 - A/R Invoice Lines (Factura de Clientes - Líneas)
export interface ARInvoiceLine {
  DocEntry: string; // Foreign key to OINV
  LineNum: number;
  ItemCode: string;
  Dscription: string;
  Quantity: number;
  Price: number;
  LineTotal: number;
  VatGroup: string;
  VatPrcnt: number;
}

// ═════════════════════════════════════════════════════════════════
// MODELOS FINANCIEROS Y CONTABLES
// ═════════════════════════════════════════════════════════════════

// OJDT - Journal Entry (Asiento Contable - Cabecera)
export interface JournalEntry {
  TransId: string; // ID único
  RefDate: string;
  DueDate: string;
  TaxDate: string;
  Memo: string;
  TransValue: number;
  CreatedAt: string;
}

// JDT1 - Journal Entry Lines (Asiento Contable - Líneas)
export interface JournalEntryLine {
  TransId: string;
  Line_ID: number;
  Account: string; // Número de cuenta G/L
  ShortName: string; // Código BP si aplica (SN)
  Debit: number;
  Credit: number;
  LineMemo: string;
}
