'use client';

/**
 * SAPScreenRenderer
 * Mapea cada screenId del sap_ui_catalog.json a su componente real interactivo conectado al Simulador ERP.
 * Los componentes replican visualmente las pantallas reales de SAP Business One 10.0 y guardan en Supabase/Firestore.
 */

import React from 'react';
import dynamic from 'next/dynamic';
import GenericSAPScreen from './GenericSAPScreen';

// Carga perezosa de pantallas funcionales reales para optimizar el bundle
const cargando = () => <div className="p-6 text-sm text-[#4a5b70]">Abriendo ventana de SAP Business One…</div>;

const SalesOrderForm = dynamic(() => import('./SalesOrderForm'), { loading: cargando });
const JournalEntryForm = dynamic(() => import('./JournalEntryForm'), { loading: cargando });
const CompanyPartnerForm = dynamic(() => import('./CompanyPartnerForm'), { loading: cargando });
const ItemMasterForm = dynamic(() => import('./ItemMasterForm'), { loading: cargando });
const WarehouseTransferForm = dynamic(() => import('./WarehouseTransferForm'), { loading: cargando });
const InventoryCountScreen = dynamic(() => import('./InventoryCountScreen'), { loading: cargando });
const BOMForm = dynamic(() => import('./BOMForm'), { loading: cargando });
const ProductionOrderForm = dynamic(() => import('./ProductionOrderForm'), { loading: cargando });
const FixedAssetsScreen = dynamic(() => import('./FixedAssetsScreen'), { loading: cargando });
const BudgetScreen = dynamic(() => import('./BudgetScreen'), { loading: cargando });
const PeriodCloseScreen = dynamic(() => import('./PeriodCloseScreen'), { loading: cargando });
const CashFlowScreen = dynamic(() => import('./CashFlowScreen'), { loading: cargando });
const PriceListScreen = dynamic(() => import('./PriceListScreen'), { loading: cargando });
const VolumeDiscountScreen = dynamic(() => import('./VolumeDiscountScreen'), { loading: cargando });
const BankingScreen = dynamic(() => import('./BankingScreen'), { loading: cargando });
const MRPScreen = dynamic(() => import('./MRPScreen'), { loading: cargando });
const QueryManagerScreen = dynamic(() => import('./QueryManagerScreen'), { loading: cargando });
const CompanySettingsScreen = dynamic(() => import('./CompanySettingsScreen'), { loading: cargando });
const LandedCostScreen = dynamic(() => import('./LandedCostScreen'), { loading: cargando });
const OpportunitiesScreen = dynamic(() => import('./OpportunitiesScreen'), { loading: cargando });
const SalesReportScreen = dynamic(() => import('./SalesReportScreen'), { loading: cargando });
const PurchaseAnalysisScreen = dynamic(() => import('./PurchaseAnalysisScreen'), { loading: cargando });
const SRIElectronicScreen = dynamic(() => import('./SRIElectronicScreen'), { loading: cargando });
const PayrollRunScreen = dynamic(() => import('./PayrollRunScreen'), { loading: cargando });
const TaxCloseScreen = dynamic(() => import('./TaxCloseScreen'), { loading: cargando });
const ForeignPaymentScreen = dynamic(() => import('./ForeignPaymentScreen'), { loading: cargando });
const EmployeeForm = dynamic(() => import('./EmployeeForm'), { loading: cargando });
const ATSScreen = dynamic(() => import('./ATSScreen'), { loading: cargando });
const ChartOfAccountsScreen = dynamic(() => import('./ChartOfAccountsScreen'), { loading: cargando });
const UDOScreen = dynamic(() => import('./UDOScreen'), { loading: cargando });

interface SAPScreenRendererProps {
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
  'FIN002': (p) => <GenericSAPScreen {...p} icon="📒" description="Consulta del Libro Mayor con filtros por cuenta, fecha y centro de costo" />,
  'FIN003': (p) => <GenericSAPScreen {...p} icon="⚖️" description="Balance General con comparativo entre periodos contables" />,
  'FIN004': (p) => <GenericSAPScreen {...p} icon="📊" description="Estado de Pérdidas y Ganancias por departamento o empresa completa" />,
  'FIN005': () => <CashFlowScreen />,
  'FIN006': () => <FixedAssetsScreen />,
  'FIN007': () => <BudgetScreen />,
  'FIN008': () => <PeriodCloseScreen />,

  // ── Inventario & Almacén ──────────────────────────────────────────
  'INV001': () => <ItemMasterForm />,
  'INV002': () => <WarehouseTransferForm />,
  'INV003': () => <InventoryCountScreen />,
  'INV004': (p) => <GenericSAPScreen {...p} icon="📍" description="Configuración de ubicaciones bin dentro del almacén (filas/columnas/niveles)" />,
  'INV005': (p) => <GenericSAPScreen {...p} icon="🔍" description="Consulta de disponibilidad de artículos en tiempo real por almacén" />,
  'INV006': (p) => <GenericSAPScreen {...p} icon="📈" description="Valoración de inventario: precio promedio, FIFO, precio estándar" />,
  'INV007': (p) => <GenericSAPScreen {...p} icon="🏷️" description="Gestión y trazabilidad de lotes y números de serie" />,

  // ── Producción & Manufactura ───────────────────────────────────────
  'MFG001': () => <BOMForm />,
  'MFG002': (p) => <GenericSAPScreen {...p} icon="🛤️" description="Rutas de fabricación con secuencia de operaciones y tiempos estándar" />,
  'MFG003': () => <ProductionOrderForm />,
  'MFG004': (p) => <GenericSAPScreen {...p} icon="⬇️" description="Registro de entradas de producción terminada al inventario" />,
  'MFG005': (p) => <GenericSAPScreen {...p} icon="⬆️" description="Registro de salidas de materiales para órdenes de producción activas" />,
  'MFG006': (p) => <GenericSAPScreen {...p} icon="⚙️" description="Cálculo y gestión de capacidad de centros de trabajo y máquinas" />,

  // ── Planificación & MRP ───────────────────────────────────────────
  'MRP001': () => <MRPScreen />,
  'MRP002': (p) => <GenericSAPScreen {...p} icon="📋" description="Consulta de necesidades generadas por MRP por artículo y fecha requerida" />,
  'MRP003': (p) => <GenericSAPScreen {...p} icon="🛒" description="Conversión de sugerencias MRP a pedidos de compra o producción" />,

  // ── Gestión de Bancos ─────────────────────────────────────────────
  'BNK001': () => <BankingScreen />,
  'BNK002': () => <BankingScreen />,
  'BNK003': () => <BankingScreen />,

  // ── Reportes & Consultas ──────────────────────────────────────────
  'RPT001': (p) => <GenericSAPScreen {...p} icon="🖨️" description="Generador de reportes con Crystal Reports integrado y personalización de layouts" />,
  'RPT002': () => <SalesReportScreen />,
  'RPT003': () => <PurchaseAnalysisScreen />,
  'QRY001': () => <QueryManagerScreen />,
  'QRY002': (p) => <GenericSAPScreen {...p} icon="💡" description="Consultas personalizadas guardadas y ejecutadas directamente desde menús" />,
  'QRY003': (p) => <GenericSAPScreen {...p} icon="🗄️" description="Conexión directa a base de datos para consultas analíticas en tiempo real" />,

  // ── CRM & Oportunidades ───────────────────────────────────────────
  'CRM001': () => <OpportunitiesScreen />,

  // ── Administración ────────────────────────────────────────────────
  'ADM001': () => <CompanySettingsScreen />,
  'ADM002': (p) => <GenericSAPScreen {...p} icon="👤" description="Gestión de usuarios, roles, autorizaciones y licencias de acceso SAP B1" />,
  'ADM004': () => <UDOScreen />,

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

export default function SAPScreenRenderer({ screenId, screenName }: SAPScreenRendererProps) {
  const ScreenComponent = SCREEN_MAP[screenId];

  if (!ScreenComponent) {
    return (
      <GenericSAPScreen
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
