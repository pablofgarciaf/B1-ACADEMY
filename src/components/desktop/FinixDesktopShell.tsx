'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import { ShieldAlert, Shield, LogOut, Info, X, Bot, Lock, Mail, Printer, FileSpreadsheet, FileText, Filter, ArrowUpDown, Settings, HelpCircle, Check, Eye } from 'lucide-react';
import { empresaActiva } from '@/lib/firestore-company';
import FinixMenuBar from './FinixMenuBar';
import FinixToolBar from './FinixToolBar';
import FinixModulesTree from './FinixModulesTree';
import FinixWindowManager, { Window } from './FinixWindowManager';
import SimuladorAIAdvisor from '../simulador/SimuladorAIAdvisor';

export type FinixRole = 'super' | 'ventas' | 'compras' | 'contabilidad' | 'almacen';

export interface FinixRoleDefinition {
  id: FinixRole;
  label: string;
  prefix: string;
  department: string;
  description: string;
  allowedModuleKeys: string[];
}

export const FINIX_ROLES: Record<FinixRole, FinixRoleDefinition> = {
  super: {
    id: 'super',
    label: 'Superusuario (manager)',
    prefix: 'super.',
    department: 'Dirección General / IT',
    description: 'Acceso total y sin restricciones a todos los módulos y definiciones de Finix ERP.',
    allowedModuleKeys: ['*'],
  },
  ventas: {
    id: 'ventas',
    label: 'Ejecutivo de Ventas',
    prefix: 'ventas.',
    department: 'Comercial & CRM',
    description: 'Acceso a Ofertas, Pedidos, Facturación de Clientes y Oportunidades CRM.',
    allowedModuleKeys: ['02_Ventas', '13_CRM', '08_Servicios', '09_Reportes'],
  },
  compras: {
    id: 'compras',
    label: 'Comprador / Abastecimiento',
    prefix: 'compras.',
    department: 'Logística & Compras',
    description: 'Acceso a Solicitudes de Compra, Pedidos, Recepciones y Costos de Importación.',
    allowedModuleKeys: ['03_Compras', '09_Reportes'],
  },
  contabilidad: {
    id: 'contabilidad',
    label: 'Contador General',
    prefix: 'contabilidad.',
    department: 'Finanzas & Contabilidad',
    description: 'Libros contables, asientos, tesorería, activos fijos, cierres e impuestos SRI.',
    allowedModuleKeys: ['01_Finanzas', '07_Bancos', '10_Consultas', 'ecuador', '09_Reportes'],
  },
  almacen: {
    id: 'almacen',
    label: 'Jefe de Bodega / Inventario',
    prefix: 'almacen.',
    department: 'Operaciones & Producción',
    description: 'Inventario físico, artículos, transferencias, recetas BOM y manufactura.',
    allowedModuleKeys: ['04_Inventario', '05_Produccion', '06_MRP', '09_Reportes'],
  },
};

interface Module {
  key: string;
  name: string;
  icon: string;
  screens: Array<{ id: string; name: string }>;
}

export interface FinixDesktopShellProps {
  catalog: {
    modules: Record<string, Module>;
    metadata: { total_screens: number; total_modules: number };
  };
  onExit?: () => void;
  onSwitchToFiori?: () => void;
  activeSlot?: string;
  onSelectSlot?: (slot: any) => void;
  availableSlots?: Array<{ id: string; name: string; shortName: string; icon: string }>;
}

export default function FinixDesktopShell({
  catalog,
  onExit,
  onSwitchToFiori,
  activeSlot: slotProp,
  onSelectSlot,
  availableSlots,
}: FinixDesktopShellProps) {
  const { userProfile, currentUser } = useAuth();
  const company = useCompany();
  const [windows, setWindows] = useState<Window[]>([]);
  const [windowCount, setWindowCount] = useState(0);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [activeRole, setActiveRole] = useState<FinixRole>('super');
  const [themeMode, setThemeMode] = useState<'finix_horizon' | 'finix_fiori_3_dark' | 'classic'>('finix_horizon');
  const [activeSlot, setActiveSlot] = useState<string>('curso');
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'info' | 'success' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4000);
  };

  useEffect(() => {
    setActiveSlot(empresaActiva());
    const onSlotChange = () => setActiveSlot(empresaActiva());
    window.addEventListener('finix-company-changed', onSlotChange);
    return () => {
      window.removeEventListener('finix-company-changed', onSlotChange);
    };
  }, []);
  const [unauthorizedModal, setUnauthorizedModal] = useState<{
    screenName: string;
    moduleKey: string;
    moduleName: string;
    suggestedRole: FinixRole;
  } | null>(null);

  const [systemTime, setSystemTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Orden canónico de módulos según SAP Business One oficial (GenPyme):
  // 1. Gestión, 2. Finanzas, 3. CRM, 4. Oportunidades, 5. Ventas, 6. Compras, 7. Socios, 8. Bancos, 9. Inventario, 10. Producción, 11. MRP, 12. Servicio, 13. RRHH / Ecuador, 14. Informes, 15. Consultas
  const SAP_ORDER_KEYS = [
    '11_Admin',
    '01_Finanzas',
    '13_CRM',
    '12_Oportunidades',
    '02_Ventas',
    '03_Compras',
    '07_Socios',
    '07_Bancos',
    '04_Inventario',
    '05_Produccion',
    '06_MRP',
    '08_Servicios',
    '12_Herramientas',
    'ecuador',
    '09_Reportes',
    '10_Consultas',
  ];

  const rawModules = Object.values(catalog.modules || {});
  const modules = [...rawModules].sort((a, b) => {
    const idxA = SAP_ORDER_KEYS.indexOf(a.key);
    const idxB = SAP_ORDER_KEYS.indexOf(b.key);
    return (idxA >= 0 ? idxA : 99) - (idxB >= 0 ? idxB : 99);
  });
  const baseEmail = userProfile?.email || currentUser?.email || 'estudiante@finix.ec';
  const currentRoleDef = FINIX_ROLES[activeRole];
  const simulatedEmail = `${currentRoleDef.prefix}${baseEmail}`;
  const companyTitle = company.data.profile?.companyName || 'Finix Center';

  const isModuleAuthorized = (moduleKey?: string): boolean => {
    if (!moduleKey || activeRole === 'super') return true;
    const allowed = currentRoleDef.allowedModuleKeys;
    if (allowed.includes('*')) return true;
    return allowed.includes(moduleKey);
  };

  const getSuggestedRoleForModule = (moduleKey?: string): FinixRole => {
    if (!moduleKey) return 'super';
    for (const [rKey, rDef] of Object.entries(FINIX_ROLES) as [FinixRole, FinixRoleDefinition][]) {
      if (rDef.allowedModuleKeys.includes(moduleKey)) return rKey;
    }
    return 'super';
  };

  const createWindow = (screenId: string, screenName: string, moduleKey?: string) => {
    // Verificación de autorizaciones por rol Finix ERP
    if (!isModuleAuthorized(moduleKey)) {
      const mod = modules.find(m => m.key === moduleKey);
      setUnauthorizedModal({
        screenName,
        moduleKey: moduleKey || 'Módulo',
        moduleName: mod?.name || moduleKey || 'Módulo',
        suggestedRole: getSuggestedRoleForModule(moduleKey),
      });
      return;
    }

    const existingWindow = windows.find(w => w.screenId === screenId);
    if (existingWindow) {
      focusWindow(existingWindow.id);
      return;
    }

    const resolvedMod = moduleKey
      ? modules.find(m => m.key === moduleKey)
      : modules.find(m => m.screens.some(s => s.id === screenId));

    const newWindow: Window = {
      id: `win-${Date.now()}`,
      title: screenName,
      screenId,
      moduleKey: resolvedMod?.key || moduleKey,
      moduleName: resolvedMod?.name,
      x: 0,
      y: 0,
      width: 1000,
      height: 700,
      minimized: false,
      maximized: true,
      zIndex: nextZIndex,
      focused: true,
    };

    setWindows(prev => [
      ...prev.map(w => ({ ...w, focused: false })),
      newWindow,
    ]);
    setWindowCount(prev => prev + 1);
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, minimized: !w.minimized } : w))
    );
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, maximized: !w.maximized } : w))
    );
  };

  const focusWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => ({
        ...w,
        focused: w.id === id,
        zIndex: w.id === id ? nextZIndex : w.zIndex,
      }))
    );
    setNextZIndex(prev => prev + 1);
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, x, y } : w))
    );
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      // ── Archivo ───────────────────────────────────────────
      case 'Nuevo':
        createWindow('SAL002', 'Pedido de Venta', '02_Ventas');
        showToast('Abriendo nuevo Pedido de Venta...', 'info');
        break;
      case 'Abrir':
        createWindow('FIN001', 'Asientos Contables (Diario)', '01_Finanzas');
        showToast('Abriendo Asientos Contables...', 'info');
        break;
      case 'Guardar':
        showToast('Documento y cambios guardados en el servidor Finix Cloud.', 'success');
        break;
      case 'Guardar Como...':
        showToast('Copia del documento generada exitosamente.', 'success');
        break;
      case 'Salir':
        if (onExit) onExit();
        else window.location.href = '/simulador';
        break;

      // ── Edición ───────────────────────────────────────────
      case 'Deshacer':
        showToast('Deshacer: no hay acciones previas en el historial local.', 'info');
        break;
      case 'Rehacer':
        showToast('Rehacer: última acción restablecida.', 'info');
        break;
      case 'Cortar':
      case 'Copiar':
      case 'Pegar':
        showToast(`Operación de portapapeles: ${action}`, 'info');
        break;
      case 'Buscar':
        createWindow('SAL006', 'Socios de Negocio (Clientes / Proveedores)', '02_Ventas');
        break;

      // ── Ver ───────────────────────────────────────────────
      case 'Barra de Herramientas':
        showToast('Barra de herramientas estándar activa.', 'info');
        break;
      case 'Barra de Estado':
        showToast('Barra de estado de conexión activa en tiempo real.', 'info');
        break;
      case 'Refrescar':
        void company.refresh();
        showToast('Datos de la empresa y motor contable refrescados.', 'success');
        break;
      case 'Pantalla Completa':
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          showToast('Modo pantalla completa activado.', 'info');
        } else {
          document.exitFullscreen().catch(() => {});
          showToast('Modo pantalla completa desactivado.', 'info');
        }
        break;

      // ── Datos ─────────────────────────────────────────────
      case 'Añadir Registro':
        createWindow('SAL002', 'Pedido de Venta', '02_Ventas');
        showToast('Creando nuevo registro de documento.', 'info');
        break;
      case 'Duplicar Registro':
        showToast('Registro duplicado en modo borrador para edición.', 'info');
        break;
      case 'Eliminar Registro':
        showToast('Operación restringida: Los registros contables y fiscales están protegidos.', 'warn');
        break;
      case 'Buscar Registro':
        createWindow('SAL006', 'Socios de Negocio (Clientes / Proveedores)', '02_Ventas');
        break;
      case 'Filtrar':
        createWindow('INV005', 'Consulta de Disponibilidad de Artículos', '04_Inventario');
        break;

      // ── Ir a ──────────────────────────────────────────────
      case 'Primero':
      case 'Anterior':
      case 'Siguiente':
      case 'Último':
        showToast(`Navegación de registros: ${action}`, 'info');
        break;

      // ── Herramientas ──────────────────────────────────────
      case 'Generador de Reportes':
        createWindow('RPT001', 'Generador de Reportes y Layouts', '09_Reportes');
        break;
      case 'Query Manager':
        createWindow('QRY001', 'Query Manager (Consultas SQL)', '10_Consultas');
        break;
      case 'Importador de Datos':
        createWindow('UTL002', 'Importador de Datos Masivos', '12_Herramientas');
        break;
      case 'Exportador de Datos':
        createWindow('UTL003', 'Exportador de Datos y Balances', '12_Herramientas');
        break;
      case 'Parametrizaciones':
        createWindow('ADM001', 'Inicialización y Parametrizaciones del Sistema', '11_Admin');
        break;

      // ── Ventana ───────────────────────────────────────────
      case 'Cascada':
        setWindows(prev =>
          prev.map((w, idx) => ({
            ...w,
            x: 40 + idx * 30,
            y: 30 + idx * 30,
            minimized: false,
            maximized: false,
          }))
        );
        showToast('Ventanas ordenadas en cascada.', 'info');
        break;
      case 'Mosaico Horizontal': {
        const activeWins = windows.filter(w => !w.minimized);
        if (activeWins.length === 0) break;
        const h = Math.floor(600 / activeWins.length);
        setWindows(prev =>
          prev.map(w => {
            const index = activeWins.findIndex(aw => aw.id === w.id);
            if (index === -1) return w;
            return {
              ...w,
              x: 20,
              y: 20 + index * h,
              width: 860,
              height: Math.max(h - 10, 200),
              maximized: false,
            };
          })
        );
        showToast('Ventanas ordenadas en mosaico horizontal.', 'info');
        break;
      }
      case 'Mosaico Vertical': {
        const activeWins = windows.filter(w => !w.minimized);
        if (activeWins.length === 0) break;
        const wWidth = Math.floor(900 / activeWins.length);
        setWindows(prev =>
          prev.map(w => {
            const index = activeWins.findIndex(aw => aw.id === w.id);
            if (index === -1) return w;
            return {
              ...w,
              x: 20 + index * wWidth,
              y: 20,
              width: Math.max(wWidth - 10, 300),
              height: 580,
              maximized: false,
            };
          })
        );
        showToast('Ventanas ordenadas en mosaico vertical.', 'info');
        break;
      }
      case 'Cerrar Todo':
        setWindows([]);
        showToast('Todas las ventanas fueron cerradas.', 'info');
        break;

      // ── Ayuda ─────────────────────────────────────────────
      case 'Ayuda de Finix ERP':
        window.dispatchEvent(new CustomEvent('feni-abrir'));
        showToast('Tutor IA activado (F1). Pregúntame sobre cualquier proceso.', 'info');
        break;
      case 'Acerca de Finix ERP':
        setShowAboutModal(true);
        break;

      default:
        showToast(`Acción ejecutada: ${action}`, 'info');
        break;
    }
  };

  // Estados y Modales para Acciones Reales de la Barra de Herramientas SAP B1
  const [isLocked, setIsLocked] = useState(false);
  const [lockPassword, setLockPassword] = useState('');

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    to: 'cliente@empresa.com',
    subject: 'Documento Comercial — SAP Business One',
    format: 'PDF',
    body: 'Estimado cliente,\n\nAdjunto remitimos el comprobante oficial emitido en nuestro sistema SAP Business One.\n\nAtentamente,\nDepartamento Comercial'
  });

  const [showPrintPreviewModal, setShowPrintPreviewModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterForm, setFilterForm] = useState({ column: 'ItemCode', condition: 'contains', value: '' });

  const [showSortModal, setShowSortModal] = useState(false);
  const [sortForm, setSortForm] = useState({ column: 'DocNum', order: 'asc' });

  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    itemCode: true,
    itemDesc: true,
    quantity: true,
    unitPrice: true,
    taxCode: true,
    total: true,
    warehouse: true,
    costCenter: false,
    project: false,
  });

  const [currentRecordIndex, setCurrentRecordIndex] = useState(1);
  const TOTAL_RECORDS = 20;

  const exportToExcel = () => {
    const activeWin = windows[windows.length - 1];
    const title = activeWin ? activeWin.title : 'Documento';
    const csvData = [
      `# SAP BUSINESS ONE - EXPORTACION OFICIAL DE DATOS`,
      `Fecha,${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      `Sociedad,${companyTitle}`,
      `Documento Activo,${title}`,
      ``,
      `Linea,Codigo Articulo/Cuenta,Descripcion,Cantidad,Precio Unitario USD,Impuesto,Total USD`,
      `1,A0001,Laptop Dell Precision i7 32GB RAM SSD,2,1250.00,IVA 15%,2875.00`,
      `2,A0002,Monitor Dell UltraSharp 27 4K UHD,3,420.00,IVA 15%,1449.00`,
      `3,A0003,Teclado y Mouse Inalambrico Pro,5,45.00,IVA 15%,258.75`,
      `4,S0001,Servicio de Instalacion y Soporte 24/7,1,180.00,IVA 15%,207.00`,
      ``,
      `Subtotal,,,,,,4125.00`,
      `IVA 15%,,,,,,663.75`,
      `Total General USD,,,,,,4788.75`,
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SAP_B1_${title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Matriz de datos exportada exitosamente a MS Excel (.csv)`, 'success');
  };

  const exportToWord = () => {
    const activeWin = windows[windows.length - 1];
    const title = activeWin ? activeWin.title : 'Documento';
    const docContent = [
      `=============================================================`,
      `SAP BUSINESS ONE - REPORTE Y COMPROBANTE DE DOCUMENTO`,
      `=============================================================`,
      `Sociedad: ${companyTitle}`,
      `Documento: ${title}`,
      `Fecha de Emisión: ${new Date().toLocaleDateString()}`,
      `Estado del Documento: Contabilizado / Válido`,
      `Usuario Operador: manager`,
      ``,
      `DETALLE DE PARTIDAS:`,
      `1. [A0001] Laptop Dell Precision i7 32GB | Cantidad: 2 | Total: $2,875.00 USD`,
      `2. [A0002] Monitor Dell UltraSharp 27" 4K | Cantidad: 3 | Total: $1,449.00 USD`,
      `3. [A0003] Teclado y Mouse Inalámbrico Pro | Cantidad: 5 | Total: $258.75 USD`,
      `4. [S0001] Servicio de Instalación y Soporte | Cantidad: 1 | Total: $207.00 USD`,
      ``,
      `SUBTOTAL: $4,125.00 USD`,
      `IVA (15%): $663.75 USD`,
      `TOTAL GENERAL: $4,788.75 USD`,
      `=============================================================`,
      `Comprobante emitido automáticamente desde SAP Business One Cloud.`,
    ].join('\n');

    const blob = new Blob([docContent], { type: 'application/msword;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SAP_B1_${title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Documento exportado exitosamente a MS Word (.doc)`, 'success');
  };

  const handleToolAction = (toolId: string) => {
    switch (toolId) {
      case 'add':
        createWindow('SAL002', 'Pedido de Venta', '02_Ventas');
        showToast('Modo Crear (Ctrl+A): Abriendo nuevo documento de venta...', 'info');
        break;
      case 'search':
        createWindow('SAL006', 'Socios de Negocio (Clientes)', '02_Ventas');
        showToast('Modo Buscar (Ctrl+F): Búsqueda de socios de negocio...', 'info');
        break;
      case 'preview':
        setShowPrintPreviewModal(true);
        break;
      case 'print':
        window.print();
        showToast('Enviando documento a la cola de impresión predeterminada...', 'info');
        break;
      case 'email':
        setShowEmailModal(true);
        break;
      case 'sms':
        showToast('Mensaje de texto SMS despachado al teléfono del contacto del cliente.', 'success');
        break;
      case 'fax':
        showToast('Comprobante encolado en el servidor de Fax corporativo.', 'info');
        break;
      case 'excel':
        exportToExcel();
        break;
      case 'word':
        exportToWord();
        break;
      case 'pdf':
        setShowPrintPreviewModal(true);
        break;
      case 'lock':
        setIsLocked(true);
        break;
      case 'first':
      case 'previous':
      case 'next':
      case 'last': {
        let newIdx = currentRecordIndex;
        if (toolId === 'first') newIdx = 1;
        else if (toolId === 'previous') newIdx = Math.max(1, currentRecordIndex - 1);
        else if (toolId === 'next') newIdx = Math.min(TOTAL_RECORDS, currentRecordIndex + 1);
        else if (toolId === 'last') newIdx = TOTAL_RECORDS;
        setCurrentRecordIndex(newIdx);
        window.dispatchEvent(new CustomEvent('sap-navigate-record', {
          detail: { direction: toolId, recordIndex: newIdx, totalRecords: TOTAL_RECORDS }
        }));
        showToast(`Registro ${newIdx} de ${TOTAL_RECORDS} cargado en el documento activo (Navegación SAP B1)`, 'info');
        break;
      }
      case 'refresh':
        void company.refresh();
        showToast('Datos maestros y documentos actualizados (F5)', 'success');
        break;
      case 'filter':
        setShowFilterModal(true);
        break;
      case 'sort':
        setShowSortModal(true);
        break;
      case 'base_document':
        createWindow('PUR001', 'Solicitud de Compra / Cotización', '03_Compras');
        showToast('Abriendo documento base del flujo comercial...', 'info');
        break;
      case 'target_document':
        createWindow('SAL003', 'Entrega de Mercancías', '02_Ventas');
        showToast('Abriendo documento de destino comercial...', 'info');
        break;
      case 'relationship_map':
        createWindow('SAL-MAP', 'Mapa de Relaciones', '02_Ventas');
        showToast('Abriendo Mapa de Relaciones SAP B1...', 'info');
        break;
      case 'journal_preview':
        createWindow('FIN001', 'Libro Diario & Asientos', '01_Finanzas');
        showToast('Previsualización del Asiento Contable Preliminar', 'info');
        break;
      case 'layout_designer':
        setShowLayoutModal(true);
        break;
      case 'settings':
        setShowSettingsModal(true);
        break;
      case 'help':
        window.dispatchEvent(new CustomEvent('feni-abrir'));
        showToast('Tutor IA activado (F1).', 'info');
        break;
      case 'search_by_model':
        createWindow('QRY001', 'Generador de Consultas SQL (Query Manager)', '10_Consultas');
        showToast('Búsqueda por modelo: Abriendo Query Manager SQL...', 'info');
        break;
      default:
        if (toolId.startsWith('search_query:')) {
          const q = toolId.replace('search_query:', '').trim().toLowerCase();
          if (!q) return;

          let matchedScreen: { screenId: string; title: string; moduleKey: string } | null = null;
          for (const m of modules) {
            for (const s of m.screens) {
              if (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)) {
                matchedScreen = { screenId: s.id, title: s.name, moduleKey: m.key };
                break;
              }
            }
            if (matchedScreen) break;
          }

          if (matchedScreen) {
            createWindow(matchedScreen.screenId, matchedScreen.title, matchedScreen.moduleKey);
            showToast(`Abriendo: ${matchedScreen.title}`, 'info');
          } else if (q.includes('pedido') || q.includes('venta')) {
            createWindow('SAL002', 'Pedido de Venta', '02_Ventas');
          } else if (q.includes('factura')) {
            createWindow('SAL004', 'Factura de Clientes', '02_Ventas');
          } else if (q.includes('compra')) {
            createWindow('PUR003', 'Orden de Compra', '03_Compras');
          } else if (q.includes('socio') || q.includes('cliente') || q.includes('proveedor')) {
            createWindow('SAL006', 'Socios de Negocio', '02_Ventas');
          } else if (q.includes('asiento') || q.includes('diario') || q.includes('contab')) {
            createWindow('FIN001', 'Libro Diario & Asientos', '01_Finanzas');
          } else if (q.includes('banco') || q.includes('pago')) {
            createWindow('BAN001', 'Pagos Efectuados', '07_Bancos');
          } else if (q.includes('mrp')) {
            createWindow('MRP001', 'Asistente de Planificación MRP', '06_MRP');
          } else if (q.includes('proyecto')) {
            createWindow('PRJ001', 'Gestión de Proyectos', '12_Herramientas');
          } else if (q.includes('servicio')) {
            createWindow('SRV001', 'Llamadas de Servicio', '08_Servicios');
          } else if (q.includes('oportunidad') || q.includes('crm')) {
            createWindow('CRM001', 'Oportunidades de Venta', '13_CRM');
          } else if (q.includes('dtw') || q.includes('import')) {
            createWindow('DTW001', 'Data Transfer Workbench (DTW)', '12_Herramientas');
          } else if (q.includes('query') || q.includes('sql')) {
            createWindow('QRY001', 'Generador de Consultas SQL (Query Manager)', '10_Consultas');
          } else {
            showToast(`Búsqueda: Mostrando Socios de Negocio para "${q}"...`, 'info');
            createWindow('SAL006', 'Socios de Negocio (Clientes)', '02_Ventas');
          }
        }
        break;
    }
  };

  // Atajos de teclado oficiales de SAP Business One a nivel global
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Ctrl+F / Cmd+F -> Modo Buscar SAP B1 (Evita el buscador del navegador)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('sap-search-mode'));
        handleToolAction('search');
        return;
      }

      // 2. Ctrl+A / Cmd+A -> Modo Crear / Añadir SAP B1 (Evita seleccionar todo el texto en la página)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('sap-add-mode'));
        handleToolAction('add');
        return;
      }

      // 3. Ctrl+S / Cmd+S -> Guardar / Contabilizar documento activo
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('sap-save-document'));
        showToast('Guardando documento activo (Ctrl+S)...', 'info');
        return;
      }

      // 4. F5 -> Actualizar datos sin recargar la página del navegador
      if (e.key === 'F5') {
        e.preventDefault();
        e.stopPropagation();
        handleToolAction('refresh');
        return;
      }

      // 5. F1 -> Ayuda de SAP B1 / Asistente FeNi
      if (e.key === 'F1') {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('feni-abrir'));
        showToast('Asistente FeNi activado (F1).', 'info');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [windows, nextZIndex]);

  return (
    <div className="w-full h-full flex-1 flex flex-col bg-[#e8ecf2] font-[Tahoma,Arial,sans-serif] text-xs overflow-hidden select-none">
      {/* Barra de Título Superior de Finix ERP */}
      <div className="bg-gradient-to-r from-[#001833] via-[#002b5c] to-[#0055A5] text-white px-3 py-1 flex items-center justify-between border-b border-[#001833] shadow-md z-30">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#001833] border border-blue-400/40 px-2 py-0.5 rounded shadow-inner">
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-black text-amber-400 text-xs tracking-wider">SAP</span>
          </div>
          <div>
            <h1 className="text-xs font-bold leading-none">SAP Business One (Cloud 2026) — {companyTitle}</h1>
          </div>
        </div>

        {/* Identidad de Usuario Finix ERP con Roles, Selector de Sociedad y Selector de Temas */}
        <div className="flex items-center gap-3">
          {/* Selector de Modo: Clásico vs Fiori */}
          <div className="flex items-center bg-[#081a4d] border border-blue-400/40 rounded p-0.5 shadow-inner">
            <button
              type="button"
              className="flex items-center gap-1 bg-[#0055A5] text-white px-2.5 py-0.5 rounded text-[11px] font-bold shadow-sm"
              title="Modo Clásico (Escritorio SAP Business One MDI activo)"
            >
              <span>💻</span>
              <span>Modo Clásico</span>
            </button>
            {onSwitchToFiori && (
              <button
                type="button"
                onClick={onSwitchToFiori}
                className="flex items-center gap-1 text-blue-200 hover:text-white hover:bg-blue-900/50 px-2.5 py-0.5 rounded text-[11px] font-semibold transition active:scale-95 cursor-pointer"
                title="Cambiar a la vista moderna de SAP Fiori Launchpad"
              >
                <span>✨</span>
                <span>Modo Fiori</span>
              </button>
            )}
          </div>

          {/* Selector de Sociedad NATIVO (1 a 7) */}
          {availableSlots && availableSlots.length > 0 && onSelectSlot && (
            <div className="flex items-center gap-1.5 bg-[#081a4d]/90 border border-emerald-400/40 px-2.5 py-1 rounded shadow-inner">
              <span className="text-emerald-400 font-bold text-[11px]">🏢 Sociedad:</span>
              <select
                aria-label="Seleccionar sociedad de práctica"
                value={slotProp ?? activeSlot}
                onChange={(e) => onSelectSlot(e.target.value)}
                className="bg-[#0e2c7a] text-white font-bold text-[11px] rounded border border-emerald-400/40 px-2 py-0.5 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-400 max-w-[180px] sm:max-w-[220px]"
              >
                {availableSlots.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.icon} {emp.shortName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-[#081a4d]/80 border border-blue-400/30 px-2.5 py-1 rounded shadow-inner">
            <Shield className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span className="text-[11px] text-blue-200">Usuario Finix:</span>
            <select
              aria-label="Perfil de usuario Finix ERP"
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as FinixRole)}
              className="bg-[#0e2c7a] text-white font-semibold text-[11px] rounded border border-blue-300/40 px-2 py-0.5 outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              {Object.values(FINIX_ROLES).map(r => (
                <option key={r.id} value={r.id}>
                  {r.prefix}{baseEmail} ({r.label})
                </option>
              ))}
            </select>
          </div>

          {/* Botón Salir al Campus / Dashboard Principal */}
          <button
            type="button"
            onClick={() => {
              if (onExit) onExit();
              else window.location.href = '/campus';
            }}
            className="flex items-center gap-1.5 bg-red-950/80 hover:bg-red-800 text-red-100 hover:text-white border border-red-500/50 px-2.5 py-1 rounded text-[11px] font-bold transition-all active:scale-95 shadow-sm"
            title="Salir del Simulador y volver al Campus / Panel Principal"
          >
            <LogOut className="w-3.5 h-3.5 text-red-300" aria-hidden="true" />
            <span>Salir al Campus</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-1 bg-[#0e2c7a] hover:bg-[#1a42a0] border border-blue-300/40 text-white px-2 py-1 rounded text-[11px] font-semibold transition-all active:scale-95 shadow-sm"
            title="Ir a la Página Principal del Sitio Web"
          >
            <span>🏠</span>
            <span>Principal</span>
          </Link>

          <div className="flex gap-1">
            <button
              type="button"
              className="w-6 h-6 bg-[#0e2c7a] hover:bg-[#1a42a0] border border-blue-300/40 text-white rounded text-xs flex items-center justify-center transition-all active:scale-95"
              onClick={() => {
                if (onExit) onExit();
                else window.location.href = '/simulador';
              }}
              title="Volver al Panel Principal de Prácticas"
            >
              ⌂
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Menú Principal */}
      <FinixMenuBar onActionClick={handleMenuAction} />

      {/* Barra de Herramientas */}
      <FinixToolBar onActionClick={handleToolAction} />

      {/* Área Central: Menú de Módulos (Árbol) y Escritorio de Ventanas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Árbol Lateral de Módulos Finix */}
        <FinixModulesTree modules={modules} onScreenSelect={createWindow} />

        {/* Gestor de Ventanas Flotantes ocupando la sección derecha */}
        <div className="flex-1 min-w-0 h-full relative overflow-hidden flex flex-col bg-gradient-to-br from-[#cde7f0] via-[#e2f2f7] to-[#d4ebf3]">
          <div className="flex-1 min-h-0 relative overflow-hidden">
            <FinixWindowManager
              windows={windows}
              themeMode={themeMode}
              onWindowClose={closeWindow}
              onWindowMinimize={minimizeWindow}
              onWindowMaximize={maximizeWindow}
              onWindowFocus={focusWindow}
              onWindowMove={moveWindow}
            />
          </div>
        </div>
      </div>

      {/* Barra de Estado Inferior Auténtica de SAP Business One (3 Paneles Encastrados) */}
      <div className="bg-[#e0e8f0] text-[#1e293b] text-[11px] px-2 py-0.5 flex items-center justify-between border-t border-[#9aaec0] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] font-[Tahoma,Arial,sans-serif] shrink-0 select-none">
        {/* Panel 1: Mensajes del Sistema y Alertas (Encastrado) */}
        <div className="flex-1 min-w-0 mr-1 bg-[#f4f7fa] border border-[#a4b8cc] px-2 py-0.5 rounded-xs flex items-center gap-2 overflow-hidden shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)]">
          {toastMessage ? (
            <span className={`inline-flex items-center gap-1.5 font-bold truncate ${
              toastMessage.type === 'success' ? 'text-emerald-700' : toastMessage.type === 'warn' ? 'text-amber-800' : 'text-blue-800'
            }`}>
              <span>{toastMessage.type === 'success' ? '🟩' : toastMessage.type === 'warn' ? '🟧' : 'ℹ️'}</span>
              <span className="truncate">{toastMessage.text}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-emerald-800 text-[10.5px] truncate">
              <span className="w-2 h-2 bg-emerald-600 rounded-2xs inline-block shadow-xs shrink-0" />
              <span className="truncate font-medium">Operación finalizada con éxito · Para ayuda, pulse F1</span>
            </span>
          )}
        </div>

        {/* Panel 2: Sociedad y Usuario Activo (Encastrado) */}
        <div className="w-64 shrink-0 mr-1 bg-[#f4f7fa] border border-[#a4b8cc] px-2 py-0.5 rounded-xs flex items-center justify-between text-[10.5px] text-[#334455] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)] truncate">
          <span className="font-bold truncate text-[#003366]">{companyTitle}</span>
          <span className="text-gray-500 font-mono text-[9.5px]">manager</span>
        </div>

        {/* Panel 3: Fecha, Hora e Identificador Oficial SAP B1 (Encastrado) */}
        <div className="w-60 shrink-0 bg-[#f4f7fa] border border-[#a4b8cc] px-2 py-0.5 rounded-xs flex items-center justify-between text-[10.5px] text-[#334455] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)]">
          <span className="font-mono text-[10px] text-gray-700">{systemTime}</span>
          <span className="inline-flex items-center gap-1 font-bold text-[10px] text-[#004080] tracking-tight">
            <span className="px-1 py-0.2 bg-[#0055a5] text-white rounded-xs text-[8.5px] font-black">SAP</span>
            <span>Business One</span>
          </span>
        </div>
      </div>

      {/* Modal de Advertencia de Autorizaciones Finix ERP */}
      {unauthorizedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#ECE9D8] border-2 border-[#0A246A] shadow-2xl rounded-sm p-4 font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222]">
            <div className="flex items-center gap-2 bg-[#0A246A] text-white px-2 py-1 font-bold -mx-4 -mt-4 mb-3">
              <span>Finix ERP — Mensaje del Sistema</span>
            </div>
            <div className="flex gap-3 items-start my-2">
              <ShieldAlert className="w-8 h-8 text-[#A12622] shrink-0" aria-hidden="true" />
              <div className="space-y-1.5">
                <p className="font-bold text-[#A12622] text-xs">Autorización insuficiente (Código Finix #1320-04)</p>
                <p>
                  El usuario actual <strong>{simulatedEmail}</strong> ({currentRoleDef.label}) no tiene autorización para acceder a <strong>{unauthorizedModal.screenName}</strong> en el módulo <em>{unauthorizedModal.moduleName}</em>.
                </p>
                <p className="text-[#555] bg-white p-2 border border-[#d5dde8] rounded-sm">
                  ℹ️ <strong>Concepto Clave Finix ERP:</strong> Las empresas configuran perfiles para que cada empleado solo opere las áreas de su competencia.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2 mt-4 pt-2 border-t border-[#999]">
              <button
                type="button"
                className="px-3 py-1 bg-[#0A246A] text-white font-bold hover:bg-[#1E3A5F] rounded-sm active:scale-95 transition-all"
                onClick={() => {
                  setActiveRole(unauthorizedModal.suggestedRole);
                  setUnauthorizedModal(null);
                }}
              >
                Cambiar a usuario {unauthorizedModal.suggestedRole}
              </button>
              <button
                type="button"
                className="px-3 py-1 bg-[#0A246A] text-white font-bold hover:bg-[#1E3A5F] rounded-sm active:scale-95 transition-all"
                onClick={() => {
                  setActiveRole('super');
                  setUnauthorizedModal(null);
                }}
              >
                Acceder como Superusuario (manager)
              </button>
              <button
                type="button"
                className="px-3 py-1 bg-[#D4D0C8] border border-[#808080] hover:bg-white rounded-sm active:scale-95 transition-all"
                onClick={() => setUnauthorizedModal(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Acerca de SAP Business One */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border-2 border-[#0055A5] shadow-2xl rounded-sm p-5 font-[Tahoma,Arial,sans-serif] text-xs text-[#222]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Bot className="w-7 h-7 text-amber-500" />
                <div>
                  <h2 className="text-sm font-bold text-[#002b5c]">SAP Business One (Cloud 2026)</h2>
                  <p className="text-[10px] text-gray-500">Versión 26.4.1 (Ecuador NIIF & SRI Edition)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-[11px] text-gray-700">
              <p><strong>Sociedad Activa:</strong> {companyTitle}</p>
              <p><strong>Entorno:</strong> Simulación interactiva empresarial en tiempo real con motor de doble partida contable.</p>
              <p><strong>Normativa:</strong> NIIF para PYMES y Resoluciones SRI Ecuador (Comprobantes 01, 07, ATS).</p>
              <p><strong>Desarrollado por:</strong> B1 Academy · Plataforma de Alto Rendimiento Empresarial.</p>
              <div className="bg-blue-50 border border-blue-200 p-2.5 rounded text-[10.5px] text-blue-900 mt-2">
                💡 Todas las operaciones comerciales, de inventario y tesorería impactan directamente los libros contables y financieros de su empresa en el simulador.
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-1.5 bg-[#0055A5] text-white font-bold hover:bg-[#003d75] rounded text-xs active:scale-95 transition-all shadow-sm"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Bloqueo de Aplicación SAP Business One */}
      {isLocked && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
          <div className="w-full max-w-sm bg-[#ECE9D8] border-2 border-[#0055A5] shadow-2xl rounded-xs p-5 font-[Tahoma,Arial,sans-serif] text-xs text-[#222]">
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#808080]">
              <div className="w-10 h-10 rounded-full bg-[#0055A5] flex items-center justify-center text-white shadow">
                <Lock className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#002b5c]">Bloqueo de Aplicación</h2>
                <p className="text-[11px] text-gray-600">SAP Business One (Seguridad)</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-700 mb-3 leading-relaxed">
              La sesión de trabajo ha sido bloqueada. Ingrese su clave de usuario para continuar en <strong>{companyTitle}</strong>.
            </p>
            <div className="space-y-2 mb-4 bg-white p-3 border border-[#808080] rounded-xs">
              <div>
                <span className="text-[10px] text-gray-500 font-semibold block mb-0.5">Usuario:</span>
                <span className="font-bold text-[#0055A5] text-xs">manager (Superusuario)</span>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-semibold block mb-0.5">Clave de acceso:</label>
                <input
                  type="password"
                  autoFocus
                  value={lockPassword}
                  onChange={(e) => setLockPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsLocked(false);
                      setLockPassword('');
                      showToast('Sesión de SAP Business One desbloqueada exitosamente.', 'success');
                    }
                  }}
                  placeholder="Ingrese cualquier clave o pulse Enter..."
                  className="w-full px-2 py-1 text-xs border border-[#808080] rounded-xs bg-[#fffde7] focus:outline-none focus:border-[#0055A5]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsLocked(false);
                  setLockPassword('');
                  showToast('Sesión desbloqueada exitosamente.', 'success');
                }}
                className="px-4 py-1.5 bg-[#0055A5] text-white font-bold hover:bg-[#003d75] rounded-xs text-xs active:scale-95 transition-all shadow cursor-pointer"
              >
                Desbloquear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Enviar por Correo Electrónico */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#ECE9D8] border border-[#0055A5] shadow-2xl rounded-xs p-4 font-[Tahoma,Arial,sans-serif] text-xs text-[#222]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#a0a0a0]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0055A5]" />
                <h2 className="text-xs font-bold text-[#002b5c]">Enviar Mensaje / Correo Electrónico — SAP Business One</h2>
              </div>
              <button type="button" onClick={() => setShowEmailModal(false)} className="hover:bg-red-500 hover:text-white px-1.5 py-0.5 rounded-xs">✕</button>
            </div>
            <div className="space-y-2.5 bg-white p-3 border border-[#808080] rounded-xs mb-3">
              <div className="grid grid-cols-4 items-center gap-2">
                <label className="text-[11px] font-semibold text-gray-700">Para:</label>
                <input
                  type="email"
                  value={emailForm.to}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, to: e.target.value }))}
                  className="col-span-3 px-2 py-0.5 text-xs border border-[#808080] rounded-xs bg-[#fffde7] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <label className="text-[11px] font-semibold text-gray-700">Asunto:</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="col-span-3 px-2 py-0.5 text-xs border border-[#808080] rounded-xs bg-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <label className="text-[11px] font-semibold text-gray-700">Formato Anexo:</label>
                <select
                  value={emailForm.format}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, format: e.target.value }))}
                  className="col-span-3 px-2 py-0.5 text-xs border border-[#808080] rounded-xs bg-white focus:outline-none"
                >
                  <option value="PDF">Documento Oficial en PDF (Crystal Reports Layout)</option>
                  <option value="XML">Factura Electrónica XML (Comprobante SRI Ecuador)</option>
                  <option value="XLSX">Matriz de Datos Excel (.xlsx)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">Cuerpo del Mensaje:</label>
                <textarea
                  rows={4}
                  value={emailForm.body}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full px-2 py-1 text-xs border border-[#808080] rounded-xs bg-white focus:outline-none font-sans"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowEmailModal(false);
                  showToast(`Correo enviado a ${emailForm.to} con anexo ${emailForm.format}.`, 'success');
                }}
                className="px-4 py-1 bg-[#0055A5] text-white font-bold hover:bg-[#003d75] rounded-xs text-xs active:scale-95 transition-all shadow cursor-pointer"
              >
                Enviar Mensaje
              </button>
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="px-3 py-1 bg-[#d4d0c8] border border-[#808080] hover:bg-white rounded-xs text-xs active:scale-95 transition-all cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Vista Preliminar de Impresión Crystal Reports */}
      {showPrintPreviewModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-[#ECE9D8] border border-[#0055A5] shadow-2xl rounded-xs p-3 font-[Tahoma,Arial,sans-serif] text-xs text-[#222] flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#a0a0a0]">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#0055A5]" />
                <h2 className="text-xs font-bold text-[#002b5c]">Vista Preliminar de Impresión — Crystal Reports (SAP B1)</h2>
              </div>
              <button type="button" onClick={() => setShowPrintPreviewModal(false)} className="hover:bg-red-500 hover:text-white px-1.5 py-0.5 rounded-xs">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto bg-white p-6 border border-[#808080] rounded-xs shadow-inner text-[#111] space-y-4">
              <div className="flex justify-between border-b pb-3">
                <div>
                  <h1 className="text-base font-extrabold text-[#002b5c]">{companyTitle}</h1>
                  <p className="text-[10px] text-gray-500">RUC: 1792148291001 · Matriz: Av. Amazonas y República</p>
                  <p className="text-[10px] text-gray-500">Quito - Ecuador · Obligado a llevar Contabilidad: SÍ</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-[#0055A5] font-bold rounded text-[11px] border border-blue-300">
                    ORIGINAL · COMPROBANTE OFICIAL
                  </span>
                  <p className="text-xs font-mono font-bold mt-1">No. 001-001-000004821</p>
                  <p className="text-[10px] text-gray-500">Fecha: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[11px] bg-gray-50 p-2.5 rounded border border-gray-200">
                <div>
                  <p><strong>Cliente / Razón Social:</strong> Corporación Favorita C.A.</p>
                  <p><strong>RUC / C.I.:</strong> 1790016919001</p>
                  <p><strong>Dirección:</strong> Av. General Enríquez km 2.5</p>
                </div>
                <div>
                  <p><strong>Condición de Pago:</strong> Crédito 30 días</p>
                  <p><strong>Moneda:</strong> Dólares Americanos (USD)</p>
                  <p><strong>Vendedor:</strong> Carlos Mendoza (Ventas Corporativas)</p>
                </div>
              </div>
              <table className="w-full text-left text-[10.5px] border-collapse">
                <thead>
                  <tr className="bg-[#002b5c] text-white">
                    <th className="p-1 border border-slate-700">#</th>
                    <th className="p-1 border border-slate-700">Código</th>
                    <th className="p-1 border border-slate-700">Descripción del Artículo</th>
                    <th className="p-1 border border-slate-700 text-right">Cant.</th>
                    <th className="p-1 border border-slate-700 text-right">Precio Unit.</th>
                    <th className="p-1 border border-slate-700 text-right">Total USD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-1 border">1</td>
                    <td className="p-1 border font-mono">A0001</td>
                    <td className="p-1 border">Laptop Dell Precision i7 32GB RAM SSD</td>
                    <td className="p-1 border text-right">2</td>
                    <td className="p-1 border text-right">$1,250.00</td>
                    <td className="p-1 border text-right font-bold">$2,500.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-1 border">2</td>
                    <td className="p-1 border font-mono">A0002</td>
                    <td className="p-1 border">Monitor Dell UltraSharp 27 pulg. 4K UHD</td>
                    <td className="p-1 border text-right">3</td>
                    <td className="p-1 border text-right">$420.00</td>
                    <td className="p-1 border text-right font-bold">$1,260.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-1 border">3</td>
                    <td className="p-1 border font-mono">S0001</td>
                    <td className="p-1 border">Servicio de Puesta en Marcha y Garantía</td>
                    <td className="p-1 border text-right">1</td>
                    <td className="p-1 border text-right">$180.00</td>
                    <td className="p-1 border text-right font-bold">$180.00</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end pt-2">
                <div className="w-56 space-y-1 text-right text-[11px]">
                  <div className="flex justify-between"><span>Subtotal 15%:</span><span className="font-bold">$3,940.00</span></div>
                  <div className="flex justify-between"><span>Subtotal 0%:</span><span>$0.00</span></div>
                  <div className="flex justify-between"><span>IVA 15%:</span><span className="font-bold">$591.00</span></div>
                  <div className="flex justify-between text-xs font-bold text-[#002b5c] border-t pt-1">
                    <span>IMPORTE TOTAL:</span><span>$4,531.00 USD</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-gray-500">Formato: Crystal Reports 2026 Engine</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { window.print(); setShowPrintPreviewModal(false); }}
                  className="px-3 py-1 bg-[#0055A5] text-white font-bold hover:bg-[#003d75] rounded-xs text-xs active:scale-95 transition-all shadow cursor-pointer flex items-center gap-1"
                >
                  <Printer size={13} /> Imprimir Comprobante
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintPreviewModal(false)}
                  className="px-3 py-1 bg-[#d4d0c8] border border-[#808080] hover:bg-white rounded-xs text-xs active:scale-95 transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Filtrar Tabla */}
      {showFilterModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#ECE9D8] border border-[#0055A5] shadow-2xl rounded-xs p-4 font-[Tahoma,Arial,sans-serif] text-xs text-[#222]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#a0a0a0]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#0055A5]" />
                <h2 className="text-xs font-bold text-[#002b5c]">Filtrar Matriz de Datos — SAP Business One</h2>
              </div>
              <button type="button" onClick={() => setShowFilterModal(false)} className="hover:bg-red-500 hover:text-white px-1.5 py-0.5 rounded-xs">✕</button>
            </div>
            <div className="space-y-3 bg-white p-3 border border-[#808080] rounded-xs mb-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">Columna a filtrar:</label>
                <select
                  value={filterForm.column}
                  onChange={(e) => setFilterForm(prev => ({ ...prev, column: e.target.value }))}
                  className="w-full px-2 py-1 text-xs border border-[#808080] rounded-xs bg-white focus:outline-none"
                >
                  <option value="ItemCode">Código de Artículo / Cuenta</option>
                  <option value="Description">Descripción del Artículo / Servicio</option>
                  <option value="Quantity">Cantidad</option>
                  <option value="Price">Precio Unitario</option>
                  <option value="Total">Total Línea (USD)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">Regla de filtro:</label>
                <select
                  value={filterForm.condition}
                  onChange={(e) => setFilterForm(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full px-2 py-1 text-xs border border-[#808080] rounded-xs bg-white focus:outline-none"
                >
                  <option value="contains">Contiene el texto</option>
                  <option value="equals">Es exactamente igual a</option>
                  <option value="starts">Empieza por</option>
                  <option value="greater">Mayor que (&gt;)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">Valor de búsqueda:</label>
                <input
                  type="text"
                  value={filterForm.value}
                  onChange={(e) => setFilterForm(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Escriba valor a filtrar..."
                  className="w-full px-2 py-1 text-xs border border-[#808080] rounded-xs bg-[#fffde7] focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowFilterModal(false);
                  showToast(`Filtro aplicado por "${filterForm.column}": ${filterForm.value || 'Todos'}`, 'info');
                }}
                className="px-4 py-1 bg-[#0055A5] text-white font-bold hover:bg-[#003d75] rounded-xs text-xs active:scale-95 transition-all shadow cursor-pointer"
              >
                Aplicar Filtro
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterForm({ column: 'ItemCode', condition: 'contains', value: '' });
                  setShowFilterModal(false);
                  showToast('Filtro restablecido. Mostrando todas las líneas.', 'info');
                }}
                className="px-3 py-1 bg-[#d4d0c8] border border-[#808080] hover:bg-white rounded-xs text-xs active:scale-95 transition-all cursor-pointer"
              >
                Restablecer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Clasificar Tabla (Ordenar) */}
      {showSortModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#ECE9D8] border border-[#0055A5] shadow-2xl rounded-xs p-4 font-[Tahoma,Arial,sans-serif] text-xs text-[#222]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#a0a0a0]">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-[#0055A5]" />
                <h2 className="text-xs font-bold text-[#002b5c]">Clasificar Tabla — SAP Business One</h2>
              </div>
              <button type="button" onClick={() => setShowSortModal(false)} className="hover:bg-red-500 hover:text-white px-1.5 py-0.5 rounded-xs">✕</button>
            </div>
            <div className="space-y-3 bg-white p-3 border border-[#808080] rounded-xs mb-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">Clasificar por columna:</label>
                <select
                  value={sortForm.column}
                  onChange={(e) => setSortForm(prev => ({ ...prev, column: e.target.value }))}
                  className="w-full px-2 py-1 text-xs border border-[#808080] rounded-xs bg-white focus:outline-none"
                >
                  <option value="DocNum">Número de Documento</option>
                  <option value="ItemCode">Código de Artículo</option>
                  <option value="Description">Descripción</option>
                  <option value="Total">Importe Total</option>
                  <option value="Date">Fecha Contable</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">Sentido de la ordenación:</label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="sortOrder"
                      value="asc"
                      checked={sortForm.order === 'asc'}
                      onChange={() => setSortForm(prev => ({ ...prev, order: 'asc' }))}
                    />
                    <span>Ascendente (A-Z, 0-9)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="sortOrder"
                      value="desc"
                      checked={sortForm.order === 'desc'}
                      onChange={() => setSortForm(prev => ({ ...prev, order: 'desc' }))}
                    />
                    <span>Descendente (Z-A, 9-0)</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowSortModal(false);
                  showToast(`Tabla ordenada por ${sortForm.column} (${sortForm.order === 'asc' ? 'Ascendente' : 'Descendente'})`, 'success');
                }}
                className="px-4 py-1 bg-[#0055A5] text-white font-bold hover:bg-[#003d75] rounded-xs text-xs active:scale-95 transition-all shadow cursor-pointer"
              >
                Clasificar
              </button>
              <button
                type="button"
                onClick={() => setShowSortModal(false)}
                className="px-3 py-1 bg-[#d4d0c8] border border-[#808080] hover:bg-white rounded-xs text-xs active:scale-95 transition-all cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: Diseñador de Layouts de Impresión */}
      {showLayoutModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#ECE9D8] border border-[#0055A5] shadow-2xl rounded-xs p-4 font-[Tahoma,Arial,sans-serif] text-xs text-[#222]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#a0a0a0]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0055A5]" />
                <h2 className="text-xs font-bold text-[#002b5c]">Diseñador de Layouts de Impresión (Crystal Reports / PLD)</h2>
              </div>
              <button type="button" onClick={() => setShowLayoutModal(false)} className="hover:bg-red-500 hover:text-white px-1.5 py-0.5 rounded-xs">✕</button>
            </div>
            <div className="bg-white p-3 border border-[#808080] rounded-xs mb-3 space-y-2">
              <p className="text-[11px] text-gray-600 mb-2">Plantillas de impresión asociadas al documento comercial activo:</p>
              <div className="space-y-1.5">
                {[
                  { name: 'SAP B1 Formato Estándar (Sistema)', type: 'PLD', def: true },
                  { name: 'Factura Electrónica SRI con Código de Barras y QR', type: 'Crystal Reports', def: false },
                  { name: 'Factura Comercial con Condiciones de Crédito y Logo', type: 'Crystal Reports', def: false },
                  { name: 'Guía de Remisión Oficial de Despacho', type: 'Crystal Reports', def: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xs border border-gray-200 hover:bg-blue-50 transition cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#002b5c]">{item.name}</span>
                      <span className="text-[9.5px] px-1.5 py-0.2 bg-gray-200 rounded text-gray-700 font-mono">{item.type}</span>
                    </div>
                    {item.def && <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">Estándar</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowLayoutModal(false);
                  showToast('Plantilla Crystal Reports seleccionada como estándar para impresión.', 'success');
                }}
                className="px-4 py-1 bg-[#0055A5] text-white font-bold hover:bg-[#003d75] rounded-xs text-xs active:scale-95 transition-all shadow cursor-pointer"
              >
                Fijar Estándar
              </button>
              <button
                type="button"
                onClick={() => setShowLayoutModal(false)}
                className="px-3 py-1 bg-[#d4d0c8] border border-[#808080] hover:bg-white rounded-xs text-xs active:scale-95 transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 7: Parametrizaciones de Formulario */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#ECE9D8] border border-[#0055A5] shadow-2xl rounded-xs p-4 font-[Tahoma,Arial,sans-serif] text-xs text-[#222]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#a0a0a0]">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#d97706]" />
                <h2 className="text-xs font-bold text-[#002b5c]">Parametrizaciones de Formulario — Formato de Tabla</h2>
              </div>
              <button type="button" onClick={() => setShowSettingsModal(false)} className="hover:bg-red-500 hover:text-white px-1.5 py-0.5 rounded-xs">✕</button>
            </div>
            <div className="bg-white p-3 border border-[#808080] rounded-xs mb-3 space-y-2">
              <p className="text-[11px] text-gray-600 mb-2">Seleccione las columnas visibles en las matrices de documentos:</p>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {[
                  { key: 'itemCode', label: 'Número de artículo / Cuenta' },
                  { key: 'itemDesc', label: 'Descripción del artículo / servicio' },
                  { key: 'quantity', label: 'Cantidad' },
                  { key: 'unitPrice', label: 'Precio por unidad' },
                  { key: 'taxCode', label: 'Código de Impuesto / IVA' },
                  { key: 'total', label: 'Total (ML)' },
                  { key: 'warehouse', label: 'Almacén destino' },
                  { key: 'costCenter', label: 'Centro de costo / Norma reparto' },
                  { key: 'project', label: 'Código de Proyecto' },
                ].map((col) => (
                  <label key={col.key} className="flex items-center justify-between p-1.5 rounded-xs hover:bg-gray-100 cursor-pointer border-b border-gray-100">
                    <span className="text-[11px] font-medium text-gray-800">{col.label}</span>
                    <input
                      type="checkbox"
                      checked={visibleColumns[col.key]}
                      onChange={(e) => setVisibleColumns(prev => ({ ...prev, [col.key]: e.target.checked }))}
                      className="cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowSettingsModal(false);
                  showToast('Parametrizaciones de formulario guardadas para el usuario.', 'success');
                }}
                className="px-4 py-1 bg-[#0055A5] text-white font-bold hover:bg-[#003d75] rounded-xs text-xs active:scale-95 transition-all shadow cursor-pointer"
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-3 py-1 bg-[#d4d0c8] border border-[#808080] hover:bg-white rounded-xs text-xs active:scale-95 transition-all cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 right-6 z-50 flex items-center gap-2 px-3.5 py-2 bg-slate-900/95 border border-blue-400 text-white rounded shadow-2xl animate-in slide-in-from-bottom-2 duration-200 text-xs">
          <span className="text-sm">
            {toastMessage.type === 'success' ? '✅' : toastMessage.type === 'warn' ? '⚠️' : 'ℹ️'}
          </span>
          <span className="font-medium">{toastMessage.text}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Asistente IA */}
      {(() => {
        if (activeSlot === 'privado' || company.data.profile?.usage === 'private') return null;
        const activeWin = windows.find(w => w.focused) || windows[windows.length - 1];
        const activeScreenTitle = activeWin ? activeWin.title : 'Dashboard';
        const activeModuleTitle = activeWin?.moduleName
          || (activeWin?.moduleKey && catalog.modules[activeWin.moduleKey]?.name)
          || 'General';
        return (
          <SimuladorAIAdvisor
            currentScreen={activeScreenTitle}
            currentModule={activeModuleTitle}
            isOpen={false}
          />
        );
      })()}
    </div>
  );
}

