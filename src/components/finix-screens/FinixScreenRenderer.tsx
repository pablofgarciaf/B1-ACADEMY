'use client';

/**
 * FinixScreenRenderer
 * Mapea cada screenId del catálogo de Finix ERP a su componente real interactivo conectado al Simulador ERP.
 * Los 13 módulos de SAP Business One cuentan con pantallas interactivas reales.
 */

import React from 'react';
import dynamic from 'next/dynamic';
import GenericFinixScreen from './GenericFinixScreen';

// Carga perezosa de pantallas funcionales reales para optimizar el bundle
const cargando = () => <div className="p-6 text-sm text-[#4a5b70]">Abriendo ventana de Finix ERP…</div>;

// ── Ventas & Compras ───────────────────────────────────────────────
const SalesOrderForm = dynamic(() => import('./SalesOrderForm'), { loading: cargando });
const CompanyPartnerForm = dynamic(() => import('./CompanyPartnerForm'), { loading: cargando });
const PriceListScreen = dynamic(() => import('./PriceListScreen'), { loading: cargando });
const VolumeDiscountScreen = dynamic(() => import('./VolumeDiscountScreen'), { loading: cargando });
const SalesRelationshipMapScreen = dynamic(() => import('./SalesRelationshipMapScreen'), { loading: cargando });
const LandedCostScreen = dynamic(() => import('./LandedCostScreen'), { loading: cargando });

// ── Finanzas & Contabilidad ───────────────────────────────────────
const JournalEntryForm = dynamic(() => import('./JournalEntryForm'), { loading: cargando });
const FinancialStatementsScreen = dynamic(() => import('./FinancialStatementsScreen'), { loading: cargando });
const FixedAssetsScreen = dynamic(() => import('./FixedAssetsScreen'), { loading: cargando });
const BudgetScreen = dynamic(() => import('./BudgetScreen'), { loading: cargando });
const PeriodCloseScreen = dynamic(() => import('./PeriodCloseScreen'), { loading: cargando });
const CashFlowScreen = dynamic(() => import('./CashFlowScreen'), { loading: cargando });
const ChartOfAccountsScreen = dynamic(() => import('./ChartOfAccountsScreen'), { loading: cargando });

// ── Inventario & Almacén ──────────────────────────────────────────
const ItemMasterForm = dynamic(() => import('./ItemMasterForm'), { loading: cargando });
const WarehouseTransferForm = dynamic(() => import('./WarehouseTransferForm'), { loading: cargando });
const InventoryCountScreen = dynamic(() => import('./InventoryCountScreen'), { loading: cargando });
const BinWeightScreen = dynamic(() => import('./BinWeightScreen'), { loading: cargando });
const InventoryReportScreen = dynamic(() => import('./InventoryReportScreen'), { loading: cargando });
const StockRevaluationScreen = dynamic(() => import('./StockRevaluationScreen'), { loading: cargando });
const BatchSerialScreen = dynamic(() => import('./BatchSerialScreen'), { loading: cargando });

// ── Producción & Manufactura ───────────────────────────────────────
const BOMForm = dynamic(() => import('./BOMForm'), { loading: cargando });
const ProductionOrderForm = dynamic(() => import('./ProductionOrderForm'), { loading: cargando });
const RoutingScreen = dynamic(() => import('./AdminProductionScreens').then(m => m.RoutingScreen), { loading: cargando });
const CapacityScreen = dynamic(() => import('./AdminProductionScreens').then(m => m.CapacityScreen), { loading: cargando });

// ── Planificación & MRP ───────────────────────────────────────────
const MRPScreen = dynamic(() => import('./MRPScreen'), { loading: cargando });

// ── Gestión de Bancos ─────────────────────────────────────────────
const BankingScreen = dynamic(() => import('./BankingScreen'), { loading: cargando });

// ── Servicios & Proyectos ──────────────────────────────────────────
const ServiceContractsScreen = dynamic(() => import('./ServiceScreens').then(m => m.ServiceContractsScreen), { loading: cargando });
const ServiceCallsScreen = dynamic(() => import('./ServiceScreens').then(m => m.ServiceCallsScreen), { loading: cargando });
const ProjectsScreen = dynamic(() => import('./ServiceScreens').then(m => m.ProjectsScreen), { loading: cargando });

// ── Reportes & Consultas ──────────────────────────────────────────
const PrintLayoutScreen = dynamic(() => import('./PrintLayoutScreen'), { loading: cargando });
const SalesReportScreen = dynamic(() => import('./SalesReportScreen'), { loading: cargando });
const PurchaseAnalysisScreen = dynamic(() => import('./PurchaseAnalysisScreen'), { loading: cargando });
const ManagementAnalysisScreen = dynamic(() => import('./ManagementAnalysisScreen'), { loading: cargando });
const AgingScreen = dynamic(() => import('./AgingScreen'), { loading: cargando });
const QueryManagerScreen = dynamic(() => import('./QueryManagerScreen'), { loading: cargando });

// ── CRM & Oportunidades ───────────────────────────────────────────
const OpportunitiesScreen = dynamic(() => import('./OpportunitiesScreen'), { loading: cargando });

// ── Administración ────────────────────────────────────────────────
const CompanySettingsScreen = dynamic(() => import('./CompanySettingsScreen'), { loading: cargando });
const TeamUsersScreen = dynamic(() => import('./AdminProductionScreens').then(m => m.TeamUsersScreen), { loading: cargando });
const ApprovalsScreen = dynamic(() => import('./ApprovalsScreen'), { loading: cargando });
const UDOScreen = dynamic(() => import('./UDOScreen'), { loading: cargando });
const DataVerificationScreen = dynamic(() => import('./AdminProductionScreens').then(m => m.DataVerificationScreen), { loading: cargando });
const SeriesNumeracionScreen = dynamic(() => import('./SeriesNumeracionScreen'), { loading: cargando });

// ── Herramientas & Migración ──────────────────────────────────────
const DataTransferScreen = dynamic(() => import('./DataTransferScreen'), { loading: cargando });

// ── Localización Ecuador (SRI & Nómina) ───────────────────────────
const SRIElectronicScreen = dynamic(() => import('./SRIElectronicScreen'), { loading: cargando });
const PayrollRunScreen = dynamic(() => import('./PayrollRunScreen'), { loading: cargando });
const TaxCloseScreen = dynamic(() => import('./TaxCloseScreen'), { loading: cargando });
const ForeignPaymentScreen = dynamic(() => import('./ForeignPaymentScreen'), { loading: cargando });
const EmployeeForm = dynamic(() => import('./EmployeeForm'), { loading: cargando });
const ATSScreen = dynamic(() => import('./ATSScreen'), { loading: cargando });

export interface FinixScreenRendererProps {
  screenId: string;
  screenName: string;
}

// Mapa completo screenId → componente funcional
const SCREEN_MAP: Record<string, React.ComponentType<{ screenId: string; screenName: string }>> = {
  // ── Ventas (Order-to-Cash) ─────────────────────────────────────────
  'SAL001': (p) => <SalesOrderForm {...p} docType="quotation" />,
  'SAL002': (p) => <SalesOrderForm {...p} docType="order" />,
  'SAL003': (p) => <SalesOrderForm {...p} docType="delivery" />,
  'SAL004': (p) => <SalesOrderForm {...p} docType="invoice" />,
  'SAL005': (p) => <SalesOrderForm {...p} docType="credit_note" />,
  'SAL006': () => <CompanyPartnerForm vendor={false} />,
  'SAL007': () => <PriceListScreen />,
  'SAL008': () => <VolumeDiscountScreen />,
  'SAL009': () => <SalesRelationshipMapScreen />,
  'SAL-MAP': () => <SalesRelationshipMapScreen />,

  // ── Compras (Procure-to-Pay) ───────────────────────────────────────
  'PUR001': (p) => <SalesOrderForm {...p} docType="purchase_request" />,
  'PUR002': (p) => <SalesOrderForm {...p} docType="purchase_order" />,
  'PUR003': (p) => <SalesOrderForm {...p} docType="goods_receipt" />,
  'PUR004': (p) => <SalesOrderForm {...p} docType="vendor_invoice" />,
  'PUR005': (p) => <SalesOrderForm {...p} docType="credit_note" />,
  'PUR006': () => <CompanyPartnerForm vendor={true} />,
  'PUR007': () => <LandedCostScreen />,

  // ── Finanzas & Contabilidad ───────────────────────────────────────
  'FIN001': (p) => <JournalEntryForm {...p} />,
  'FIN002': () => <FinancialStatementsScreen initialTab={2} />, // Libro Mayor / Balance de Comprobación
  'FIN003': () => <FinancialStatementsScreen initialTab={0} />, // Balance General Oficial NIIF
  'FIN004': () => <FinancialStatementsScreen initialTab={1} />, // Estado de Pérdidas y Ganancias P&G
  'FIN005': () => <CashFlowScreen />,
  'FIN006': () => <FixedAssetsScreen />,
  'FIN007': () => <BudgetScreen />,
  'FIN008': () => <PeriodCloseScreen />,

  // ── Inventario & Almacén ──────────────────────────────────────────
  'INV001': () => <ItemMasterForm />,
  'INV002': () => <WarehouseTransferForm />,
  'INV003': () => <InventoryCountScreen />,
  'INV004': () => <BinWeightScreen />,
  'INV005': () => <InventoryReportScreen />,
  'INV006': () => <StockRevaluationScreen />,
  'INV007': () => <BatchSerialScreen />,

  // ── Producción & Manufactura ───────────────────────────────────────
  'MFG001': () => <BOMForm />,
  'MFG002': () => <RoutingScreen />,
  'MFG003': () => <ProductionOrderForm />,
  'MFG004': () => <ProductionOrderForm />, // Entrada de producción terminada
  'MFG005': () => <ProductionOrderForm />, // Emisión de componentes para producción
  'MFG006': () => <CapacityScreen />,

  // ── Planificación & MRP ───────────────────────────────────────────
  'MRP001': () => <MRPScreen />,
  'MRP002': () => <MRPScreen />,
  'MRP003': () => <MRPScreen />,

  // ── Gestión de Bancos ─────────────────────────────────────────────
  'BNK001': () => <BankingScreen />,
  'BNK002': () => <BankingScreen />,
  'BNK003': () => <BankingScreen />,

  // ── Servicios & Proyectos ──────────────────────────────────────────
  'SRV001': () => <ServiceContractsScreen />,
  'SRV002': () => <ServiceCallsScreen />,
  'SRV003': () => <ProjectsScreen />,
  'SRV004': () => <ServiceCallsScreen />,

  // ── Reportes & Consultas ──────────────────────────────────────────
  'RPT001': () => <PrintLayoutScreen />,
  'RPT002': () => <SalesReportScreen />,
  'RPT003': () => <PurchaseAnalysisScreen />,
  'RPT004': () => <ManagementAnalysisScreen />,
  'RPT005': () => <AgingScreen />,
  'QRY001': () => <QueryManagerScreen />,
  'QRY002': () => <QueryManagerScreen />,
  'QRY003': () => <QueryManagerScreen />,

  // ── CRM & Oportunidades ───────────────────────────────────────────
  'CRM001': () => <OpportunitiesScreen />,

  // ── Administración ────────────────────────────────────────────────
  'ADM001': () => <CompanySettingsScreen />,
  'ADM002': () => <TeamUsersScreen />,
  'ADM003': () => <ApprovalsScreen />,
  'ADM-APROB': () => <ApprovalsScreen />,
  'ADM004': () => <UDOScreen />,
  'ADM005': () => <DataVerificationScreen />,
  'ADM006': () => <SeriesNumeracionScreen />,
  'RPT-AGING': () => <AgingScreen />,
  'FIN-AGING': () => <AgingScreen />,

  // ── Herramientas & Migración ──────────────────────────────────────
  'UTL001': () => <PrintLayoutScreen />,
  'UTL002': () => <DataTransferScreen />,
  'UTL003': () => <DataTransferScreen />,
  'UTL004': () => <DataTransferScreen />,

  // ── Localización Ecuador (SRI & Nómina) ───────────────────────────
  'EC-SRI': () => <SRIElectronicScreen initialType="01" />,
  'EC-RETENTION': () => <SRIElectronicScreen initialType="07" />,
  'EC-TAX': () => <ATSScreen />,
  'EC-PAYROLL': () => <PayrollRunScreen />,
  'EC-TAXCLOSE': () => <TaxCloseScreen />,
  'EC-ISD': () => <ForeignPaymentScreen />,
  'EC-EMPLOYEE': () => <EmployeeForm />,
  'EC-CUSTOMERS': () => <CompanyPartnerForm vendor={false} />,
  'EC-VENDORS': () => <CompanyPartnerForm vendor={true} />,
  'EC-ACCOUNTS': () => <ChartOfAccountsScreen />,
  'RPT-VENTAS': () => <SalesReportScreen />,
};

export default function FinixScreenRenderer({ screenId, screenName }: FinixScreenRendererProps) {
  const ScreenComponent = SCREEN_MAP[screenId];

  if (!ScreenComponent) {
    return (
      <GenericFinixScreen
        screenId={screenId}
        screenName={screenName}
        icon="🖥️"
        description={`Pantalla ${screenId} — ${screenName}`}
      />
    );
  }

  return (
    <div className="w-full h-full">
      <ScreenComponent screenId={screenId} screenName={screenName} />
    </div>
  );
}
