import { createElement, type ComponentType } from 'react';
import CompanyPartnerForm from './CompanyPartnerForm';
import ItemMasterForm from './ItemMasterForm';
import InventoryReportScreen from './InventoryReportScreen';
import WarehouseTransferForm from './WarehouseTransferForm';
import ChartOfAccountsScreen from './ChartOfAccountsScreen';
import FinancialStatementsScreen from './FinancialStatementsScreen';
import BankingScreen from './BankingScreen';
import SalesReportScreen from './SalesReportScreen';
import SRIElectronicScreen from './SRIElectronicScreen';
import RetentionForm from './RetentionForm';
import TaxReportScreen from './TaxReportScreen';
import EmployeeForm from './EmployeeForm';
import PayrollRunScreen from './PayrollRunScreen';
import TaxCloseScreen from './TaxCloseScreen';
import ForeignPaymentScreen from './ForeignPaymentScreen';
import BOMForm from './BOMForm';
import ProductionOrderForm from './ProductionOrderForm';
import MRPScreen from './MRPScreen';
import ManagementAnalysisScreen from './ManagementAnalysisScreen';
import AgingScreen from './AgingScreen';
import CashFlowScreen from './CashFlowScreen';
import PurchaseAnalysisScreen from './PurchaseAnalysisScreen';
import QueryManagerScreen from './QueryManagerScreen';
import BudgetScreen from './BudgetScreen';
import ApprovalsScreen from './ApprovalsScreen';
import PeriodCloseScreen from './PeriodCloseScreen';
import PriceListScreen from './PriceListScreen';
import VolumeDiscountScreen from './VolumeDiscountScreen';
import InventoryCountScreen from './InventoryCountScreen';
import FixedAssetsScreen from './FixedAssetsScreen';
import LandedCostScreen from './LandedCostScreen';
import OpportunitiesScreen from './OpportunitiesScreen';
import CompanySettingsScreen from './CompanySettingsScreen';
import PrintLayoutScreen from './PrintLayoutScreen';
import DataTransferScreen from './DataTransferScreen';
import { ServiceContractsScreen, ServiceCallsScreen, ProjectsScreen } from './ServiceScreens';
import { TeamUsersScreen, DataVerificationScreen, RoutingScreen, CapacityScreen } from './AdminProductionScreens';

export const companyScreens: Record<string, ComponentType> = {
  'EC-CUSTOMERS': CompanyPartnerForm,
  'EC-VENDORS': function Vendors() { return createElement(CompanyPartnerForm, { vendor: true }); },
  'INV001': ItemMasterForm, 'INV002': WarehouseTransferForm, 'INV005': InventoryReportScreen, 'INV006': InventoryReportScreen,
  'EC-ACCOUNTS': ChartOfAccountsScreen, 'FIN002': FinancialStatementsScreen, 'FIN003': FinancialStatementsScreen, 'FIN004': FinancialStatementsScreen,
  'BNK001': BankingScreen, 'BNK002': BankingScreen, 'BNK003': BankingScreen,
  'RPT002': SalesReportScreen, 'RPT-VENTAS': SalesReportScreen, 'RPT004': ManagementAnalysisScreen, 'RPT005': AgingScreen, 'RPT003': PurchaseAnalysisScreen, 'QRY001': QueryManagerScreen, 'QRY002': QueryManagerScreen, 'FIN007': BudgetScreen,
  'ADM003': ApprovalsScreen, 'ADM006': ApprovalsScreen, 'FIN008': PeriodCloseScreen, 'SAL007': PriceListScreen,
  'SAL008': VolumeDiscountScreen, 'INV003': InventoryCountScreen, 'FIN006': FixedAssetsScreen,
  'PUR007': LandedCostScreen, 'CRM001': OpportunitiesScreen, 'ADM001': CompanySettingsScreen, 'UTL001': PrintLayoutScreen,
  'UTL002': DataTransferScreen, 'UTL003': DataTransferScreen, 'UTL004': DataTransferScreen,
  'RPT001': QueryManagerScreen, 'QRY003': QueryManagerScreen,
  'SRV001': ServiceContractsScreen, 'SRV002': ServiceCallsScreen, 'SRV004': ServiceCallsScreen, 'SRV003': ProjectsScreen,
  'ADM002': TeamUsersScreen, 'ADM005': DataVerificationScreen, 'MFG002': RoutingScreen, 'MFG006': CapacityScreen, 'FIN005': CashFlowScreen,
  'EC-SRI': SRIElectronicScreen, 'EC-RETENTION': RetentionForm, 'EC-TAX': TaxReportScreen,
  'EC-EMPLOYEE': EmployeeForm, 'EC-PAYROLL': PayrollRunScreen, 'EC-TAXCLOSE': TaxCloseScreen, 'EC-ISD': ForeignPaymentScreen,
  'MFG001': BOMForm, 'MFG003': ProductionOrderForm, 'MFG004': ProductionOrderForm, 'MFG005': ProductionOrderForm,
  'MRP001': MRPScreen, 'MRP002': MRPScreen, 'MRP003': MRPScreen,
};
