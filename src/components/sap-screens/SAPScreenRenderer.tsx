'use client';

/**
 * SAPScreenRenderer
 * Mapea cada screenId del sap_ui_catalog.json a su componente React correspondiente.
 * Los componentes replican visualmente las pantallas reales de SAP Business One 10.0.
 */

import React, { lazy, Suspense } from 'react';
import BusinessPartnerForm from './BusinessPartnerForm';
import SalesOrderForm from './SalesOrderForm';
import JournalEntryForm from './JournalEntryForm';
import GenericSAPScreen from './GenericSAPScreen';

interface SAPScreenRendererProps {
  screenId: string;
  screenName: string;
}

// Mapa screenId → componente
const SCREEN_MAP: Record<string, React.ComponentType<{ screenId: string; screenName: string }>> = {
  // ── Ventas ────────────────────────────────────────────────────────
  'SAL001': (p) => <SalesOrderForm {...p} docType="quotation" />,
  'SAL002': (p) => <SalesOrderForm {...p} docType="order" />,
  'SAL003': (p) => <SalesOrderForm {...p} docType="delivery" />,
  'SAL004': (p) => <SalesOrderForm {...p} docType="invoice" />,
  'SAL005': (p) => <SalesOrderForm {...p} docType="credit_note" />,
  'SAL006': (p) => <BusinessPartnerForm mode="customer" />,
  'SAL007': (p) => <GenericSAPScreen {...p} icon="📋" description="Gestión de listas de precios para clientes y grupos de descuento" />,
  'SAL008': (p) => <GenericSAPScreen {...p} icon="💰" description="Configuración de descuentos por volumen y periodos especiales" />,

  // ── Compras ───────────────────────────────────────────────────────
  'PUR001': (p) => <SalesOrderForm {...p} docType="purchase_request" />,
  'PUR002': (p) => <SalesOrderForm {...p} docType="purchase_order" />,
  'PUR003': (p) => <SalesOrderForm {...p} docType="goods_receipt" />,
  'PUR004': (p) => <SalesOrderForm {...p} docType="vendor_invoice" />,
  'PUR005': (p) => <SalesOrderForm {...p} docType="debit_note" />,
  'PUR006': (p) => <BusinessPartnerForm mode="vendor" />,

  // ── Finanzas ──────────────────────────────────────────────────────
  'FIN001': (p) => <JournalEntryForm {...p} />,
  'FIN002': (p) => <GenericSAPScreen {...p} icon="📒" description="Consulta del Libro Mayor con filtros por cuenta, fecha y centro de costo" />,
  'FIN003': (p) => <GenericSAPScreen {...p} icon="⚖️" description="Balance General con comparativo entre periodos contables" />,
  'FIN004': (p) => <GenericSAPScreen {...p} icon="📊" description="Estado de Pérdidas y Ganancias por departamento o empresa completa" />,
  'FIN005': (p) => <GenericSAPScreen {...p} icon="💧" description="Flujo de Caja proyectado con entradas, salidas y saldo disponible" />,

  // ── Inventario ────────────────────────────────────────────────────
  'INV001': (p) => <GenericSAPScreen {...p} icon="📦" description="Datos Maestros de Artículos: precio, almacén, proveedor preferido, BOM" />,
  'INV002': (p) => <GenericSAPScreen {...p} icon="🔄" description="Registro de movimientos de mercancía: entradas, salidas y traspasos" />,
  'INV003': (p) => <GenericSAPScreen {...p} icon="🔢" description="Asistente de conteo de inventario físico por almacén y artículo" />,
  'INV004': (p) => <GenericSAPScreen {...p} icon="📍" description="Configuración de ubicaciones bin dentro del almacén (filas/columnas/niveles)" />,
  'INV005': (p) => <GenericSAPScreen {...p} icon="🔍" description="Consulta de disponibilidad de artículos en tiempo real por almacén" />,
  'INV006': (p) => <GenericSAPScreen {...p} icon="📈" description="Valoración de inventario: precio promedio, FIFO, precio estándar" />,

  // ── Producción ────────────────────────────────────────────────────
  'MFG001': (p) => <GenericSAPScreen {...p} icon="🏗️" description="Lista de Materiales: estructura de productos con componentes y cantidades" />,
  'MFG002': (p) => <GenericSAPScreen {...p} icon="🛤️" description="Rutas de fabricación con secuencia de operaciones y tiempos estándar" />,
  'MFG003': (p) => <GenericSAPScreen {...p} icon="🏭" description="Orden de Fabricación: lanzamiento, consumo de materiales y reporte de producción" />,
  'MFG004': (p) => <GenericSAPScreen {...p} icon="⬇️" description="Registro de entradas de producción terminada al inventario" />,
  'MFG005': (p) => <GenericSAPScreen {...p} icon="⬆️" description="Registro de salidas de materiales para órdenes de producción activas" />,

  // ── MRP ───────────────────────────────────────────────────────────
  'MRP001': (p) => <GenericSAPScreen {...p} icon="🎯" description="Asistente MRP: planificación de necesidades con horizonte y políticas de reaprovisionamiento" />,
  'MRP002': (p) => <GenericSAPScreen {...p} icon="📋" description="Consulta de necesidades generadas por MRP por artículo y fecha requerida" />,
  'MRP003': (p) => <GenericSAPScreen {...p} icon="🛒" description="Conversión de sugerencias MRP a pedidos de compra o producción" />,

  // ── Bancos ────────────────────────────────────────────────────────
  'BNK001': (p) => <GenericSAPScreen {...p} icon="🏦" description="Conciliación bancaria: cruce de extracto bancario con registros contables" />,
  'BNK002': (p) => <GenericSAPScreen {...p} icon="💵" description="Registro de depósitos bancarios y asignación a cuentas de tesorería" />,
  'BNK003': (p) => <GenericSAPScreen {...p} icon="💳" description="Gestión de pagos: cheques, transferencias y asistente de pagos masivos" />,

  // ── Servicio ──────────────────────────────────────────────────────
  'SRV001': (p) => <GenericSAPScreen {...p} icon="📜" description="Contratos de servicio con cobertura, vigencia y condiciones de garantía" />,
  'SRV002': (p) => <GenericSAPScreen {...p} icon="🔧" description="Órdenes de servicio: seguimiento de llamadas, técnico asignado y tiempo empleado" />,
  'SRV003': (p) => <GenericSAPScreen {...p} icon="📂" description="Gestión de proyectos con etapas, tareas, recursos y facturación por avance" />,

  // ── Reportes ──────────────────────────────────────────────────────
  'RPT001': (p) => <GenericSAPScreen {...p} icon="🖨️" description="Generador de reportes con Crystal Reports integrado y personalización de layouts" />,
  'RPT002': (p) => <GenericSAPScreen {...p} icon="📊" description="Análisis de ventas por cliente, artículo, vendedor y periodo temporal" />,
  'RPT003': (p) => <GenericSAPScreen {...p} icon="📉" description="Análisis de compras por proveedor, artículo, comprador y condiciones obtenidas" />,

  // ── Consultas ─────────────────────────────────────────────────────
  'QRY001': (p) => <GenericSAPScreen {...p} icon="🔎" description="Query Manager: editor SQL con acceso a todas las tablas de SAP B1" />,
  'QRY002': (p) => <GenericSAPScreen {...p} icon="💡" description="Consultas personalizadas guardadas y ejecutadas directamente desde menús" />,
  'QRY003': (p) => <GenericSAPScreen {...p} icon="🗄️" description="Conexión directa a HANA Database para consultas analíticas en tiempo real" />,

  // ── Administración ────────────────────────────────────────────────
  'ADM001': (p) => <GenericSAPScreen {...p} icon="⚙️" description="Inicialización del sistema: datos de la empresa, moneda base y ejercicio fiscal" />,
  'ADM002': (p) => <GenericSAPScreen {...p} icon="👤" description="Gestión de usuarios, roles, autorizaciones y licencias de acceso" />,
  'ADM003': (p) => <GenericSAPScreen {...p} icon="🔀" description="Configuración de workflows de aprobación para documentos y montos" />,
  'ADM004': (p) => <GenericSAPScreen {...p} icon="🏷️" description="Campos personalizados (UDF) y valores definidos por el usuario (UDV)" />,
  'ADM005': (p) => <GenericSAPScreen {...p} icon="🔄" description="Herramienta de recuperación y migración de datos desde Excel o sistemas anteriores" />,

  // ── Utilidades ────────────────────────────────────────────────────
  'UTL001': (p) => <GenericSAPScreen {...p} icon="🖨️" description="Diseñador de layouts de impresión para facturas, órdenes y etiquetas" />,
  'UTL002': (p) => <GenericSAPScreen {...p} icon="📥" description="Importador de datos masivo con validación y mapeo de campos" />,
  'UTL003': (p) => <GenericSAPScreen {...p} icon="📤" description="Exportador de datos a Excel, CSV o sistemas externos vía API" />,
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
