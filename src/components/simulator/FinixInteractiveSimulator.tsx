"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Save,
  CheckCircle2,
  Sparkles,
  Database,
  Filter,
  Calendar,
  RefreshCw,
  ArrowRight,
  Network,
  Users,
  LayoutDashboard,
  Eye,
  Sliders,
  X,
  ChevronRight,
  Check,
  BookOpen,
  DollarSign,
  ShoppingCart,
  Package,
  FileText,
  CreditCard,
  Layers,
  Wrench,
  AlertCircle,
  Bell,
  Mail,
  Search
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getManualSimulatorConfig, ManualSimulatorConfig } from '@/lib/manual-simulator-registry';
import { BusinessPartner, Item } from '@/lib/erp/erp-models';
import { initializeDemoCompany, getBusinessPartners, getItems, createSalesInvoice, createJournalEntry } from '@/lib/erp/erp-database-service';
import GuidedOverlay from './GuidedOverlay';
import FinixScreenRenderer from '@/components/sap-screens/FinixScreenRenderer';
import PracticaValidada, { type CampoPractica } from './PracticaValidada';
import type { IntentoPractica } from '@/lib/practice-check';
import { pantallaConectada } from '@/lib/practica-conectada';
import PracticaConectada from './PracticaConectada';

/** Índice del buscador del menú (lupa / F3): enseña dónde vive cada formulario de Finix ERP. */
const FINIX_SEARCH_INDEX: { name: string; path: string }[] = [
  { name: 'Datos maestros de socio de negocios', path: 'Socios de negocios › Datos maestros de socio de negocios' },
  { name: 'Datos maestros de artículo', path: 'Inventario › Datos maestros de artículo' },
  { name: 'Oferta de ventas', path: 'Ventas › Oferta de ventas' },
  { name: 'Pedido de cliente', path: 'Ventas › Pedido de cliente' },
  { name: 'Entrega', path: 'Ventas › Entrega' },
  { name: 'Factura de deudores', path: 'Ventas › Factura de deudores' },
  { name: 'Nota de crédito de clientes', path: 'Ventas › Nota de crédito de clientes' },
  { name: 'Pedido de compra', path: 'Compras › Pedido de compra' },
  { name: 'Entrada de mercancías (pedido)', path: 'Compras › Entrada de mercancías' },
  { name: 'Factura de proveedores', path: 'Compras › Factura de proveedores' },
  { name: 'Asiento', path: 'Finanzas › Asiento' },
  { name: 'Plan de cuentas', path: 'Finanzas › Plan de cuentas' },
  { name: 'Pagos recibidos', path: 'Gestión de bancos › Pagos recibidos' },
  { name: 'Pagos efectuados', path: 'Gestión de bancos › Pagos efectuados' },
  { name: 'Conciliación bancaria', path: 'Gestión de bancos › Conciliaciones bancarias' },
  { name: 'Transferencia de stock', path: 'Inventario › Transacciones de stock › Transferencia de stock' },
  { name: 'Recuento de inventario', path: 'Inventario › Transacciones de inventario › Recuento de inventario' },
  { name: 'Lista de materiales', path: 'Producción › Lista de materiales' },
  { name: 'Orden de fabricación', path: 'Producción › Orden de fabricación' },
  { name: 'Asistente MRP', path: 'MRP › Asistente MRP' },
  { name: 'Llamada de servicio', path: 'Servicio › Llamada de servicio' },
  { name: 'Gestor de consultas', path: 'Herramientas › Consultas › Gestor de consultas' },
  { name: 'Parametrizaciones generales', path: 'Gestión › Inicialización sistema › Parametrizaciones generales' },
  { name: 'Usuarios', path: 'Gestión › Definiciones › General › Usuarios' },
];

type PracticeScreen = { mode: string; screenId?: string };

/** Orden importa: los temas específicos van antes que los generales (p. ej. "unidad" antes que "artículo"). */
const PRACTICE_RULES: { test: RegExp; screen: PracticeScreen }[] = [
  { test: /inicio de sesi|acceso al sistema|login/i, screen: { mode: 'login' } },
  { test: /parametriz|perfil|preferencia|cockpit|widget|alerta|mensaje|buz[oó]n|b[uú]squeda|lupa/i, screen: { mode: 'cockpit' } },
  { test: /listas? de materiales|\bbom\b/i, screen: { mode: 'screen', screenId: 'MFG001' } },
  { test: /orden(es)? de (producci|fabricaci)|emisi[oó]n y recibo|fabricaci/i, screen: { mode: 'screen', screenId: 'MFG003' } },
  { test: /\bmrp\b|pron[oó]stico|recomendaci/i, screen: { mode: 'screen', screenId: 'MRP001' } },
  { test: /socio|interlocutor|al cliente/i, screen: { mode: 'screen', screenId: 'SAL006' } },
  { test: /unidad|\budm\b|\buom\b/i, screen: { mode: 'uom_setup' } },
  { test: /art[ií]culo|oitm/i, screen: { mode: 'item_master' } },
  { test: /descuento|campa[ñn]a|precios? especial/i, screen: { mode: 'screen', screenId: 'SAL008' } },
  { test: /lista de precios|precio/i, screen: { mode: 'screen', screenId: 'SAL007' } },
  { test: /pago|cobro|banco|tesorer|reconcilia|medio/i, screen: { mode: 'banking' } },
  { test: /asiento|contab|plan de cuentas|modelo|diferencias? de cambio|niif/i, screen: { mode: 'journal_entry' } },
  { test: /query|consulta|sql|vista/i, screen: { mode: 'query' } },
  { test: /data transfer|workbench|importa/i, screen: { mode: 'screen', screenId: 'ADM005' } },
  { test: /compra|procure|proveedor|mercanc/i, screen: { mode: 'procurement' } },
  { test: /garant|equipo|soluciones|servicio/i, screen: { mode: 'screen', screenId: 'SRV002' } },
  { test: /proyecto/i, screen: { mode: 'screen', screenId: 'SRV003' } },
  { test: /factura|venta|entrega|oferta|devoluc|oportunidad|order-to-cash/i, screen: { mode: 'sales' } },
  { test: /recuento/i, screen: { mode: 'screen', screenId: 'INV003' } },
  { test: /almac[eé]n|inventario|stock|transacci/i, screen: { mode: 'screen', screenId: 'INV002' } },
  { test: /activo|amortiz|capitaliz/i, screen: { mode: 'screen', screenId: 'FIX001' } },
];

function inferPracticeScreen(guide?: { title?: string; menu_path?: string; action_type?: string } | null): PracticeScreen | null {
  if (!guide) return null;
  if (guide.action_type && guide.action_type !== 'cockpit') return null; // ya viene explícita
  // Primero el título (es lo específico de la práctica); la ruta de menú arrastra nombres de grupo
  // como "Post-venta" o "(BOM)" que confundirían la deducción, por eso solo se usa como respaldo.
  for (const source of [guide.title ?? '', guide.menu_path ?? '']) {
    const rule = PRACTICE_RULES.find((r) => r.test.test(source));
    if (rule) return rule.screen;
  }
  return null;
}

interface StepGuide {
  title: string;
  menu_path?: string;
  action_type?: string;
  instructions: string[];
  expected_output?: string;
  /** Campos y valores exactos que la práctica evalúa (prácticas de Mi Aula). */
  campos?: CampoPractica[];
}

export interface FinixInteractiveSimulatorProps {
  manualId: string;
  currentStepIndex: number;
  stepGuide?: StepGuide;
  guidedMode?: boolean;
  onStepComplete?: (stepNumber: number) => void;
  /** En las prácticas evaluadas de Mi Aula recibe el intento, para que el servidor lo califique. */
  onMissionComplete?: (intento?: IntentoPractica) => void;
  /**
   * false = el simulador crece con su contenido y el scroll lo hace la página que lo contiene
   * (Mi Aula). Evita que el botón final quede oculto dentro de un contenedor de altura fija.
   */
  scrollInterno?: boolean;
}
export type SAPInteractiveSimulatorProps = FinixInteractiveSimulatorProps;

// Datos simulados para OCRD (Socios de Negocios)
const MOCK_OCRD = [
  { CardCode: "C20000", CardName: "Maxi-Teq", CardType: "C", Address: "Hendon Way 42", City: "London", ZipCode: "NW2 7YT", Balance: 13866.20, CreditLine: 15000.00, CntctPrsn: "Norm Thompson" },
  { CardCode: "C40000", CardName: "Earthshaker Corporation", CardType: "C", Address: "94 Bolton Road", City: "London", ZipCode: "NW12 8HG", Balance: -1653.03, CreditLine: 10000.00, CntctPrsn: "Bob McKensly" },
  { CardCode: "C50000", CardName: "ADA Technologies", CardType: "C", Address: "FluggeStrasse 6", City: "Hamburg", ZipCode: "22303", Balance: 0.00, CreditLine: 20000.00, CntctPrsn: "Mary Brown" },
  { CardCode: "C60000", CardName: "SG Electronics", CardType: "C", Address: "45th Street", City: "New York", ZipCode: "10010", Balance: -27077.56, CreditLine: 50000.00, CntctPrsn: "Eric Alexander" },
  { CardCode: "C70000", CardName: "Aquent Systems", CardType: "C", Address: "Hollywood Ave", City: "San Jose", ZipCode: "95112", Balance: 2325.72, CreditLine: 5000.00, CntctPrsn: "Troy Brown" },
  { CardCode: "C80000", CardName: "Pivotal Solutions", CardType: "C", Address: "8th Avenue", City: "New York", ZipCode: "10011", Balance: 50217.77, CreditLine: 40000.00, CntctPrsn: "Norm Thompson" },
  { CardCode: "S10000", CardName: "Far East Imports", CardType: "S", Address: "Industrial Port 12", City: "Singapore", ZipCode: "018956", Balance: 42100.00, CreditLine: 80000.00, CntctPrsn: "Lee Kuan" },
  { CardCode: "S20000", CardName: "Office Supplies Co.", CardType: "S", Address: "Commerce Park 5", City: "Chicago", ZipCode: "60601", Balance: 1540.00, CreditLine: 25000.00, CntctPrsn: "Alice Vance" },
  { CardCode: "L90001", CardName: "Lead Tech Solutions", CardType: "L", Address: "Innovation Hub 3", City: "Austin", ZipCode: "78701", Balance: 0.00, CreditLine: 0.00, CntctPrsn: "David Miller" }
];

const OCRD_FIELDS = [
  { name: "CardCode", desc: "BP Code" },
  { name: "CardName", desc: "BP Name" },
  { name: "CardType", desc: "BP Type" },
  { name: "GroupCode", desc: "Group Code" },
  { name: "CmpPrivate", desc: "Business Partner Type" },
  { name: "Address", desc: "Bill-to Street" },
  { name: "ZipCode", desc: "Bill-to Zip Code" },
  { name: "MailAddres", desc: "Ship-to Street" },
  { name: "MailZipCod", desc: "Ship-to Zip Code" },
  { name: "Phone1", desc: "Telephone 1" },
  { name: "Phone2", desc: "Telephone 2" },
  { name: "Fax", desc: "Fax Number" },
  { name: "CntctPrsn", desc: "Contact Person" },
  { name: "Notes", desc: "Remarks" },
  { name: "Balance", desc: "Account Balance" },
  { name: "ChecksBal", desc: "Open Checks Balance" },
  { name: "DNotesBal", desc: "Open Deliveries/GRPO Balance" },
  { name: "OrdersBal", desc: "Open Orders Balance" }
];

const MOCK_OINV = [
  { DocEntry: 101, DocNum: 1001, CardCode: "C20000", CardName: "Maxi-Teq", DocDate: "2026-03-15", DocTotal: 4500.00, DocStatus: "O" },
  { DocEntry: 102, DocNum: 1002, CardCode: "C40000", CardName: "Earthshaker Corporation", DocDate: "2026-03-20", DocTotal: 1250.50, DocStatus: "O" },
  { DocEntry: 103, DocNum: 1003, CardCode: "C60000", CardName: "SG Electronics", DocDate: "2026-03-22", DocTotal: 9800.00, DocStatus: "O" },
  { DocEntry: 104, DocNum: 1004, CardCode: "C70000", CardName: "Aquent Systems", DocDate: "2026-02-10", DocTotal: 3400.00, DocStatus: "C" },
  { DocEntry: 105, DocNum: 1005, CardCode: "C80000", CardName: "Pivotal Solutions", DocDate: "2026-03-28", DocTotal: 18200.00, DocStatus: "O" }
];

const OINV_FIELDS = [
  { name: "DocEntry", desc: "Document Internal ID" },
  { name: "DocNum", desc: "Document Number" },
  { name: "CardCode", desc: "Customer Code" },
  { name: "CardName", desc: "Customer Name" },
  { name: "DocDate", desc: "Posting Date" },
  { name: "DocDueDate", desc: "Due Date" },
  { name: "DocTotal", desc: "Document Total" },
  { name: "DocStatus", desc: "Document Status" }
];

export default function FinixInteractiveSimulator({
  manualId,
  currentStepIndex,
  stepGuide,
  guidedMode = false,
  onStepComplete,
  onMissionComplete,
  scrollInterno = true
}: FinixInteractiveSimulatorProps) {
  const { userProfile } = useAuth();
  const missionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const missionFinished = useRef(false);
  useEffect(() => {
    missionFinished.current = false;
    return () => {
      if (missionTimer.current) clearTimeout(missionTimer.current);
      missionTimer.current = null;
    };
  }, [manualId, currentStepIndex]);
  const completeMission = (delay = 1000, intento?: IntentoPractica) => {
    if (missionFinished.current || missionTimer.current) return;
    missionTimer.current = setTimeout(() => {
      missionTimer.current = null;
      missionFinished.current = true;
      onMissionComplete?.(intento);
    }, delay);
  };
  const practiceTitle = `${stepGuide?.title ?? ''} ${stepGuide?.menu_path ?? ''}`;
  const isAlertsPractice = /alerta|bandeja|buz[oó]n|mensaje/i.test(practiceTitle);
  const isSearchPractice = /b[uú]squeda|lupa/i.test(practiceTitle);
  const isExplorationPractice = manualId === 'mod1-c1' && stepGuide?.action_type === 'cockpit';

  // Configuración del Simulador basada en el catálogo unificado
  const simConfig = useMemo<ManualSimulatorConfig>(() => {
    return getManualSimulatorConfig(manualId);
  }, [manualId]);

  const validModes = ['login', 'sales', 'procurement', 'item_master', 'uom_setup', 'inventory_move', 'bin_locations', 'journal_entry', 'banking', 'production', 'mrp', 'pricing', 'cockpit', 'query'];

  // Pantalla de la práctica. Casi todas las clases llegan con action_type genérico 'cockpit':
  // en ese caso se deduce la pantalla real a partir del título y la ruta de menú de la práctica.
  const inferred = useMemo(() => inferPracticeScreen(stepGuide), [stepGuide]);
  const explicitMode = stepGuide?.action_type && stepGuide.action_type !== 'cockpit' && validModes.includes(stepGuide.action_type)
    ? stepGuide.action_type : null;
  const simMode: string = explicitMode
    ?? inferred?.mode
    ?? (simConfig.archetype && validModes.includes(simConfig.archetype) ? simConfig.archetype : 'cockpit');

  // Estados de persistencia en Firebase / LocalStorage
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [stepSuccessMsg, setStepSuccessMsg] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPick, setSearchPick] = useState<{ name: string; path: string } | null>(null);

  // Estados de Datos Reales del ERP (Firebase)
  const [dbBPs, setDbBPs] = useState<BusinessPartner[]>([]);
  const [dbItems, setDbItems] = useState<Item[]>([]);
  const [dbLoaded, setDbLoaded] = useState(false);

  // Cargar datos maestros de la empresa desde Firebase
  useEffect(() => {
    async function loadCompanyData() {
      if (userProfile?.uid) {
        const isInit = await initializeDemoCompany(userProfile.uid);
        if (isInit) {
          const bps = await getBusinessPartners(userProfile.uid);
          const items = await getItems(userProfile.uid);
          setDbBPs(bps);
          setDbItems(items);
          setDbLoaded(true);
        }
      }
    }
    loadCompanyData();
  }, [userProfile]);

  // Cargar progreso del estudiante desde Firestore
  useEffect(() => {
    async function loadStudentProgress() {
      const storageKey = `sim_progress_${manualId}`;
      let localSaved: number[] = [];
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) localSaved = JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }

      if (userProfile?.uid) {
        try {
          const simRef = doc(db, 'usuarios', userProfile.uid, 'simulaciones', manualId);
          const snap = await getDoc(simRef);
          if (snap.exists()) {
            const data = snap.data();
            const steps = data.completedSteps || localSaved;
            setCompletedSteps(steps);
            localStorage.setItem(storageKey, JSON.stringify(steps));
            return;
          }
        } catch (err) {
          console.warn('Error recuperando progreso de Firestore:', err);
        }
      }
      setCompletedSteps(localSaved);
    }
    loadStudentProgress();
  }, [manualId, userProfile]);

  // Resetear completedSteps cuando cambia la clase o el slide
  useEffect(() => {
    setCompletedSteps([]);
    setStepSuccessMsg(null);
    setValidationMessage(null);
  }, [manualId, currentStepIndex]);

  const markStepDone = async (stepNum: number) => {
    if (completedSteps.includes(stepNum)) return;
    const updated = [...completedSteps, stepNum];
    setCompletedSteps(updated);
    setStepSuccessMsg(`¡Paso ${stepNum} superado con éxito!`);
    setTimeout(() => setStepSuccessMsg(null), 3500);

    localStorage.setItem(`sim_progress_${manualId}`, JSON.stringify(updated));

    if (userProfile?.uid) {
      setSaveLoading(true);
      try {
        const simRef = doc(db, 'usuarios', userProfile.uid, 'simulaciones', manualId);
        await setDoc(simRef, {
          manualId,
          completedSteps: updated,
          lastUpdated: new Date().toISOString(),
          studentName: userProfile.displayName || userProfile.name || 'Estudiante',
          isApproved: updated.length >= 2
        }, { merge: true });
      } catch (err) {
        console.warn('Error guardando progreso en Firestore:', err);
      } finally {
        setSaveLoading(false);
      }
    }

    if (onStepComplete) {
      onStepComplete(stepNum);
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // ESTADOS DEL MODO UNIDADES DE MEDIDA (OUGP / UGP1)
  // ═════════════════════════════════════════════════════════════════
  const [uomCode, setUomCode] = useState("GRP_CABLES");
  const [uomName, setUomName] = useState("Grupo Cables de Red - OEC Computers");
  const [baseUom, setBaseUom] = useState("MTR");
  const [uomRollQty, setUomRollQty] = useState("100");
  const [uomSpoolQty, setUomSpoolQty] = useState("50");
  const [uomGroupSaved, setUomGroupSaved] = useState(false);

  const handleSaveUomGroup = () => {
    setUomGroupSaved(true);
    setStepSuccessMsg("¡Grupo de Unidades de Medida registrado en OUGP/UGP1! Base: Metro. Conversiones: 1 Rollo = 100m, 1 Bobina = 50m.");
    markStepDone(1);
    markStepDone(2);
    completeMission(1200);
  };

  // ═════════════════════════════════════════════════════════════════
  // ESTADOS DEL MODO QUERY GENERATOR (CONSULTAS SQL)
  // ═════════════════════════════════════════════════════════════════
  const [selectedTable, setSelectedTable] = useState<string>("OCRD");
  const [selectedFieldInLeftList, setSelectedFieldInLeftList] = useState<string>("CardType");
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "CardCode",
    "CardName",
    "CardType",
    "Address",
    "Balance",
    "ZipCode",
    "City"
  ]);
  const [whereClause, setWhereClause] = useState<string>('T0."CardType" = \'C\'');
  const [sortByClause, setSortByClause] = useState<string>('T0."CardCode"');
  const [groupByClause, setGroupByClause] = useState<string>("");
  const [runtimeParamDate, setRuntimeParamDate] = useState<string>("2026-03-01");
  const [showParamModal, setShowParamModal] = useState<boolean>(false);
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [queryExecuted, setQueryExecuted] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [columnSum, setColumnSum] = useState<number | null>(null);
  const [summedColumn, setSummedColumn] = useState<string | null>(null);

  const activeTableFields = useMemo(() => {
    if (selectedTable === "OINV") return OINV_FIELDS;
    return OCRD_FIELDS;
  }, [selectedTable]);

  const handleAddFieldToSelect = (fieldName: string) => {
    if (!selectedFields.includes(fieldName)) {
      setSelectedFields(prev => [...prev, fieldName]);
      markStepDone(2);
    }
  };

  const handleRemoveFieldFromSelect = (fieldName: string) => {
    setSelectedFields(prev => prev.filter(f => f !== fieldName));
  };

  const handleExecuteQuery = () => {
    if (whereClause.includes("[%0]") && !showParamModal) {
      setShowParamModal(true);
      return;
    }
    setShowParamModal(false);

    let data: any[] = [];
    if (selectedTable === "OCRD") {
      const sourceData = dbBPs.length > 0 ? dbBPs : MOCK_OCRD;
      data = sourceData.filter(item => {
        if (whereClause.includes("CardType = 'C'") || whereClause.includes("CardType = 'c'")) {
          return item.CardType === 'C';
        }
        if (whereClause.includes("Balance > CreditLine")) {
          return item.Balance > item.CreditLine;
        }
        return true;
      });
    } else {
      data = MOCK_OINV;
    }

    setQueryResults(data);
    setQueryExecuted(true);
    markStepDone(1);
    markStepDone(2);
    // Solo vuelve a la clase si la consulta trajo resultados (una consulta vacía no demuestra dominio).
    if (data.length > 0) completeMission(3000);
    else setStepSuccessMsg('La consulta no devolvió filas: revisa el filtro WHERE e inténtalo de nuevo.');
  };

  const handleSortColumn = (colName: string) => {
    const isAsc = sortColumn === colName && sortOrder === 'asc';
    const nextOrder = isAsc ? 'desc' : 'asc';
    setSortColumn(colName);
    setSortOrder(nextOrder);

    const sorted = [...queryResults].sort((a, b) => {
      const valA = a[colName];
      const valB = b[colName];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return nextOrder === 'asc' ? valA - valB : valB - valA;
      }
      return nextOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
    setQueryResults(sorted);
  };

  const handleCalculateColumnSum = (colName: string) => {
    const sum = queryResults.reduce((acc, row) => {
      const val = parseFloat(row[colName]);
      return isNaN(val) ? acc : acc + val;
    }, 0);
    setColumnSum(sum);
    setSummedColumn(colName);
  };

  // ═════════════════════════════════════════════════════════════════
  // ESTADOS DEL MODO COCKPIT (CSL01 / SETUP)
  // ═════════════════════════════════════════════════════════════════
  const [assignedRole, setAssignedRole] = useState("Ventas y Distribución");
  const [defaultWarehouse, setDefaultWarehouse] = useState("01 - Almacén Central");
  const [activeWidgets, setActiveWidgets] = useState<string[]>(["kpi_sales", "top_customers"]);

  const toggleWidget = (widgetId: string) => {
    setActiveWidgets(prev =>
      prev.includes(widgetId) ? prev.filter(w => w !== widgetId) : [...prev, widgetId]
    );
  };

  // ═════════════════════════════════════════════════════════════════
  // ESTADOS DEL MODO COMPRAS (CSL02 / PROCUREMENT)
  // ═════════════════════════════════════════════════════════════════
  const [procurementStage, setProcurementStage] = useState<'po' | 'grpo' | 'invoice' | 'map'>('po');
  const [poQuantity, setPoQuantity] = useState<number>(5);
  const [poPrice, setPoPrice] = useState<number>(1200);
  const [grpoCreated, setGrpoCreated] = useState<boolean>(false);
  const [invoiceCreated, setInvoiceCreated] = useState<boolean>(false);

  const handleCreatePO = () => {
    markStepDone(1);
    setProcurementStage('grpo');
  };

  const handleCreateGRPO = () => {
    setGrpoCreated(true);
    markStepDone(2);
    setProcurementStage('invoice');
  };

  const handleCreateInvoice = () => {
    setInvoiceCreated(true);
    markStepDone(3);
    setProcurementStage('map');
    completeMission(3500); // deja ver el mapa del flujo P2P antes de volver a la clase
  };

  // ═════════════════════════════════════════════════════════════════
  // ESTADOS DEL MODO VENTAS (SALES / ORDER-TO-CASH)
  // ═════════════════════════════════════════════════════════════════
  const [salesQty1, setSalesQty1] = useState<number>(2);
  const [salesQty2, setSalesQty2] = useState<number>(4);
  const [salesCreated, setSalesCreated] = useState<boolean>(false);

  const salesSubtotal = (salesQty1 * 1500) + (salesQty2 * 375);
  const salesTax = salesSubtotal * 0.21;
  const salesTotal = salesSubtotal + salesTax;

  const handleCreateSalesInvoice = async () => {
    if (!userProfile?.uid) {
      // Sin perfil cargado: la práctica cuenta igual (no se guarda en la empresa simulada) y la clase continúa.
      setSalesCreated(true);
      markStepDone(1);
      markStepDone(2);
      setStepSuccessMsg('¡Factura contabilizada! (práctica registrada sin guardar en tu empresa simulada)');
      completeMission(1800);
      return;
    }

    // Call Firebase Service to save OINV and discount stock
    const result = await createSalesInvoice(
      userProfile.uid,
      "C20000",
      "Maxi-Teq Corporation",
      salesTotal,
      [
        { itemCode: "A00001", qty: salesQty1, price: 1500 },
        { itemCode: "A00002", qty: salesQty2, price: 375 }
      ]
    );

    if (result.success) {
      setSalesCreated(true);
      markStepDone(1);
      markStepDone(2);
      setStepSuccessMsg(`¡Factura #${result.docNum} contabilizada en Firebase! Inventario descontado.`);
      completeMission(1800);
    } else {
      alert("Error al contabilizar: " + result.error);
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // ESTADOS DEL MODO ASIENTO CONTABLE (JOURNAL ENTRY)
  // ═════════════════════════════════════════════════════════════════
  const [jeDebit1, setJeDebit1] = useState<number>(1210);
  const [jeCredit2, setJeCredit2] = useState<number>(1000);
  const [jeCredit3, setJeCredit3] = useState<number>(210);
  const [jeCreated, setJeCreated] = useState<boolean>(false);

  const jeTotalDebit = jeDebit1;
  const jeTotalCredit = jeCredit2 + jeCredit3;
  const jeDiff = jeTotalDebit - jeTotalCredit;

  const handleCreateJE = async () => {
    if (jeDiff !== 0) {
      alert("El asiento contable está descuadrado. La suma del Debe debe ser igual a la del Haber.");
      return;
    }
    if (!userProfile?.uid) {
      setJeCreated(true);
      markStepDone(1);
      markStepDone(2);
      setStepSuccessMsg('¡Asiento cuadrado y contabilizado! (práctica registrada sin guardar en tu empresa simulada)');
      completeMission(1800);
      return;
    }

    // Conectar con el Motor Financiero en Firebase
    const result = await createJournalEntry(userProfile.uid, "ASIENTO-VENTAS", [
      { account: "43000000", shortName: "C20000", debit: jeDebit1, credit: 0 },
      { account: "70000000", shortName: "", debit: 0, credit: jeCredit2 },
      { account: "47700000", shortName: "", debit: 0, credit: jeCredit3 }
    ]);

    if (result.success) {
      setJeCreated(true);
      markStepDone(1);
      markStepDone(2);
      setStepSuccessMsg(`¡Asiento Contable #${result.transId} registrado en el Libro Mayor de Firebase!`);
      completeMission(1800);
    } else {
      alert("Error contabilizando: " + result.error);
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // ESTADOS DEL MODO MAESTRO DE ARTÍCULOS (ITEM MASTER DATA)
  // ═════════════════════════════════════════════════════════════════
  const [itemTab, setItemTab] = useState<'general' | 'purchasing' | 'sales' | 'inventory' | 'planning'>('inventory');
  const [itemValuation, setItemValuation] = useState<string>("FIFO");
  const [itemSaved, setItemSaved] = useState<boolean>(false);

  const handleUpdateItem = () => {
    setItemSaved(true);
    markStepDone(1);
    markStepDone(2);
    setStepSuccessMsg("¡Datos Maestros de Artículo A00001 actualizados!");
    completeMission(1800);
  };

  // ═════════════════════════════════════════════════════════════════
  // ESTADOS DEL MODO GESTIÓN BANCARIA / PAGOS
  // ═════════════════════════════════════════════════════════════════
  const [payMethod, setPayMethod] = useState<'transfer' | 'check' | 'cash'>('transfer');
  const [payDone, setPayDone] = useState<boolean>(false);

  const handleCreatePayment = () => {
    setPayDone(true);
    markStepDone(1);
    markStepDone(2);
    setStepSuccessMsg("¡Pago Recibido #804 contabilizado y conciliado!");
    completeMission(1800);
  };

  // Prácticas conectadas: si la práctica corresponde a una pantalla real del Simulador, el estudiante la hace
  // en SU empresa (Supabase), eligiendo de listas sus propios datos.
  const conectada = stepGuide ? pantallaConectada(stepGuide) : null;
  if (stepGuide && conectada) {
    return (
      <div className={`${scrollInterno ? 'h-full overflow-y-auto' : 'min-h-full'} rounded-lg`}>
        <PracticaConectada
          guia={stepGuide}
          pantalla={conectada}
          onCompleta={(intento) => {
            (stepGuide.instructions ?? []).forEach((_, i) => markStepDone(i + 1));
            completeMission(200, intento);
          }}
        />
      </div>
    );
  }

  // Prácticas de Mi Aula con campos a evaluar: pantalla y datos salen de la misma instrucción de la clase,
  // se valida cada valor y solo se vuelve a la clase cuando todo está correcto.
  if (stepGuide?.campos?.length) {
    return (
      <div className={`${scrollInterno ? 'h-full overflow-y-auto' : 'min-h-full'} rounded-lg`}>
        <div>
          <PracticaValidada
            guia={stepGuide}
            onCompleta={(intento) => {
              (stepGuide.instructions ?? []).forEach((_, i) => markStepDone(i + 1));
              completeMission(200, intento);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${scrollInterno ? 'h-full overflow-hidden' : 'min-h-full'} flex flex-col bg-[#101720] text-gray-200 font-sans select-none relative`}>
      <GuidedOverlay
        active={guidedMode}
        message={stepGuide?.instructions?.[0] || "Sigue la instrucción para continuar con el ejercicio práctico."}
        expectedAction={stepGuide?.action_type || "Haz clic en el área resaltada"}
        onActionSimulated={() => markStepDone(currentStepIndex)}
      />
      {/* Barra de Estado Superior */}
      <div className="bg-[#18222d] border-b border-gray-800 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] shrink-0 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-amber-400">Finix ERP 2026 (Enterprise)</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">Sociedad: <strong className="text-gray-300">SBODEMO_ES</strong></span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">Módulo: <strong className="text-blue-300">{simConfig.moduleName}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {validationMessage ? (
            <span role="alert" className="text-amber-200 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded text-[10px]">
              {validationMessage}
            </span>
          ) : stepSuccessMsg ? (
            <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] animate-pulse">
              ✓ {stepSuccessMsg}
            </span>
          ) : (
            <span className="text-amber-400 text-[10px] font-bold bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
              ⏳ Misión pendiente — sigue las instrucciones
            </span>
          )}
        </div>
      </div>

      {/* Barra de Herramientas Estándar (Finix Top Toolbar) */}
      <div className="bg-[#e4e8ef] border-b border-[#b0b8c4] px-2 py-1 flex items-center gap-2 shrink-0 relative z-10 text-gray-700">
        <div className="flex gap-1 border-r border-[#b0b8c4] pr-2">
          <button
            className={`p-1 rounded transition-colors text-[#316ac5] ${showSearch ? 'bg-[#c4d4ec]' : 'hover:bg-[#d0d6e0]'}`}
            title="Buscar (F3)"
            onClick={() => {
              setShowSearch(true);
              setSearchQuery('');
              setSearchPick(null);
              markStepDone(1); // Clic en la lupa
              markStepDone(2); // Barra de búsqueda desplegada
            }}
          >
            <Search size={14} />
          </button>
        </div>
        {showSearch && (
          <div className="flex-1 relative">
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchPick(null); }}
                placeholder="Escribe un formulario: factura, pedido, asiento..."
                className="w-full max-w-sm bg-white border border-[#7f9db9] rounded px-2 py-0.5 text-[11px] text-gray-900 focus:outline-none focus:border-[#316ac5]"
              />
              <button
                title="Cerrar búsqueda"
                className="w-5 h-5 rounded bg-[#992222] text-white flex items-center justify-center hover:bg-red-600"
                onClick={() => {
                  setShowSearch(false);
                  markStepDone(3); // Cierra la barra
                  // La lupa solo cierra la misión cuando la práctica activa es la de búsqueda.
                  if (isSearchPractice) {
                    setStepSuccessMsg('¡Búsqueda rápida dominada!');
                    completeMission();
                  }
                }}
              >
                <X size={12} />
              </button>
            </div>
            {searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 top-full mt-1 w-full max-w-sm bg-white border border-[#7f9db9] rounded shadow-xl z-40 text-[11px] text-gray-900 max-h-56 overflow-y-auto">
                {FINIX_SEARCH_INDEX.filter((f) => f.name.toLowerCase().includes(searchQuery.trim().toLowerCase())).map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setSearchPick(f)}
                    className="w-full text-left px-2 py-1 hover:bg-[#fffde0] border-b border-gray-100"
                  >
                    <span className="font-bold text-[#316ac5]">{f.name}</span>
                    <span className="block text-[10px] text-gray-500">{f.path}</span>
                  </button>
                ))}
                {!FINIX_SEARCH_INDEX.some((f) => f.name.toLowerCase().includes(searchQuery.trim().toLowerCase())) && (
                  <p className="px-2 py-1.5 text-gray-500">Sin resultados. Prueba con &quot;factura&quot;, &quot;pedido&quot; o &quot;asiento&quot;.</p>
                )}
              </div>
            )}
            {searchPick && (
              <p className="mt-1 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-300 rounded px-2 py-0.5 inline-block">
                Ruta en el menú: <strong>{searchPick.path}</strong>
              </p>
            )}
          </div>
        )}
        <div className="flex gap-1">
          <button
            className="p-1 hover:bg-[#d0d6e0] rounded transition-colors text-amber-500 relative"
            title="Mensajes y Alertas"
            onClick={() => {
              setShowAlertsModal(true);
              markStepDone(1); // Click en ícono completado
            }}
          >
            <Bell size={14} />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Modal de Alertas */}
      {showAlertsModal && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#ece9d8] border-2 border-[#1c3a63] rounded shadow-2xl overflow-hidden flex flex-col text-xs text-gray-900">
            <div className="bg-gradient-to-r from-[#21436e] via-[#2f5c94] to-[#21436e] text-white px-3 py-1 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Mail size={13} className="text-amber-400" />
                <span>Resumen de mensajes y alertas</span>
              </div>
              <button
                onClick={() => {
                  setShowAlertsModal(false);
                  markStepDone(2); // Cierra ventana completado
                  setStepSuccessMsg("¡Buzón revisado correctamente!");
                  if (isAlertsPractice) completeMission();
                }}
                className="w-4 h-4 rounded bg-[#992222] text-white font-bold flex items-center justify-center hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
            <div className="p-3 bg-white flex-1 min-h-[250px]">
              <table className="w-full text-[11px] border-collapse">
                <thead className="bg-[#f0f2f5] border-y border-[#7f9db9] text-gray-700 font-bold">
                  <tr>
                    <th className="p-1.5 text-left border-x border-[#7f9db9]">Asunto</th>
                    <th className="p-1.5 text-left border-x border-[#7f9db9]">Remitente</th>
                    <th className="p-1.5 text-left border-x border-[#7f9db9]">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-[#fffde0] cursor-pointer">
                    <td className="p-1.5 border-x border-[#7f9db9] font-bold text-[#316ac5]">Autorización requerida: Pedido de Compras #1004</td>
                    <td className="p-1.5 border-x border-[#7f9db9]">Sistema</td>
                    <td className="p-1.5 border-x border-[#7f9db9] text-gray-500">Hoy 09:30 AM</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-[#fffde0] cursor-pointer bg-gray-50">
                    <td className="p-1.5 border-x border-[#7f9db9] font-bold text-[#316ac5]">Desviación de presupuesto en proyecto Beta</td>
                    <td className="p-1.5 border-x border-[#7f9db9]">Alertas Finix</td>
                    <td className="p-1.5 border-x border-[#7f9db9] text-gray-500">Ayer 16:45 PM</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded text-blue-800 text-[11px]">
                <strong>Nota del sistema:</strong> Esta es tu bandeja de entrada de Finix ERP.
                Aquí recibirás notificaciones clave, workflows de autorización y mensajes de otros usuarios.
                Para completar la misión actual, cierra esta ventana.
              </div>
            </div>
            <div className="bg-[#ece9d8] border-t border-[#b0b8c4] p-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAlertsModal(false);
                  markStepDone(2);
                  setStepSuccessMsg("¡Buzón revisado correctamente!");
                  if (isAlertsPractice) completeMission();
                }}
                className="bg-[#dfdfdf] hover:bg-[#d0d0d0] text-gray-900 border border-[#555555] px-4 py-1 rounded-[3px] shadow active:scale-95"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ÁREA DE TRABAJO PRINCIPAL DEL CLIENTE FINIX ERP */}
      <div className={`flex-1 p-2 sm:p-3 ${scrollInterno ? 'overflow-y-auto custom-scrollbar' : 'min-h-[420px]'} flex flex-col justify-start relative`}>

        {/* ====================================================================
            ARQUETIPO -1: LOGIN (Override action_type='login')
        ==================================================================== */}
        {simMode === 'login' && (
          <div className="absolute inset-0 bg-[#e4e8ef] flex items-center justify-center">
            <div className="w-[450px] bg-white border border-[#b0b8c4] rounded-lg shadow-2xl overflow-hidden flex flex-col text-gray-800">
              <div className="bg-gradient-to-r from-[#21436e] via-[#2f5c94] to-[#21436e] p-4 flex items-center justify-center">
                <div className="text-white font-bold text-2xl tracking-wider">FINIX <span className="font-light">ERP Cloud</span></div>
              </div>
              <div className="p-8 pb-12 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">ID de Usuario</label>
                  <input type="text" defaultValue="manager" className="w-full bg-white text-gray-900 border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Clave de Acceso</label>
                  <input type="password" defaultValue="********" className="w-full bg-white text-gray-900 border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Sociedad</label>
                  <div className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-1.5 text-sm font-semibold flex items-center justify-between">
                    <span>FINIX_DEMO_EC</span>
                    <button className="text-gray-400 hover:text-blue-500 text-xs">Cambiar</button>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      markStepDone(1);
                      setStepSuccessMsg("¡Sesión iniciada correctamente!");
                      completeMission();
                    }}
                    className="w-full bg-[#ffb700] hover:bg-[#ffaa00] text-[#1c3a63] font-bold py-2 rounded shadow transition-all active:scale-95"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            ARQUETIPO 0: MÓDULO TEÓRICO Y CONCEPTUAL (requiresSimulator = false)
        ════════════════════════════════════════════════════════════════ */}
        {/* ════════════════════════════════════════════════════════════════
            PANTALLA RÉPLICA FINIX ERP: prácticas sin arquetipo propio (socios, precios, producción, MRP…)
        ════════════════════════════════════════════════════════════════ */}
        {simMode === 'screen' && inferred?.screenId && (
          <div className="flex-1 flex flex-col min-h-[420px] border border-[#2b3a4a] rounded-lg overflow-hidden">
            <div className="flex-1 min-h-0 overflow-auto bg-[#ECE9D8]">
              <FinixScreenRenderer screenId={inferred.screenId} screenName={stepGuide?.title ?? simConfig.title} />
            </div>
            <div className="shrink-0 flex items-center justify-between gap-3 px-3 py-2 bg-[#16222f] border-t border-[#2b3a4a]">
              <p className="text-[11px] text-gray-300">Sigue las instrucciones de arriba en esta pantalla y confirma cuando termines.</p>
              <button
                onClick={() => {
                  (stepGuide?.instructions ?? []).forEach((_, i) => markStepDone(i + 1));
                  setStepSuccessMsg('¡Práctica completada!');
                  completeMission(800);
                }}
                className="px-4 py-1.5 rounded bg-[#ffb700] hover:bg-[#ffaa00] text-[#1c3a63] text-xs font-bold shadow active:scale-95 transition-all"
              >
                Terminé la práctica
              </button>
            </div>
          </div>
        )}

        {(simMode === 'none' || (!simConfig.requiresSimulator && !stepGuide)) && (
          <div className="w-full max-w-2xl mx-auto my-auto p-5 sm:p-6 bg-[#16222f] border border-[#2b3a4a] rounded-2xl text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
              <BookOpen size={28} />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 inline-block mb-2">
              Lección Conceptual de Fundamentos
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">{simConfig.title}</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg mx-auto mb-4">
              {simConfig.theoreticalSummary}
            </p>
            <div className="bg-[#10171e] border border-gray-800 rounded-xl p-3.5 text-left mb-4 space-y-2">
              <div className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <span>🎯</span> Metodología Recomendada para este Manual:
              </div>
              <ul className="text-xs text-gray-400 space-y-1.5 pl-5 list-disc leading-relaxed">
                <li>Presta atención a la clase magistral en video y al teleprompter para dominar los términos clave.</li>
                <li>Formula preguntas al <strong>Tutor IA</strong> para despejar dudas arquitecturales.</li>
                <li>Prepárate para el <strong>Examen con el Profesor IA</strong> (límite de 35s por pregunta).</li>
              </ul>
            </div>
            <Link
              href="/simulador"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all active:scale-95"
            >
              <Wrench size={14} />
              <span>Explorar Escritorio Virtual Libre (Sandbox)</span>
            </Link>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            ARQUETIPO 1: VENTAS (ORDER-TO-CASH / OINV / ORDR)
        ════════════════════════════════════════════════════════════════ */}
        {simMode === "sales" && (
          <div className="w-full max-w-4xl mx-auto rounded border-2 border-[#1c3a63] bg-[#ece9d8] shadow-2xl overflow-hidden text-xs text-gray-900">
            {/* Barra de Título Clásica */}
            <div className="bg-gradient-to-r from-[#004e92] via-[#003366] to-[#000428] text-white px-3 py-1 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <ShoppingCart size={13} className="text-amber-400" />
                <span>Factura de Clientes - Finix ERP</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">_</button>
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">□</button>
                <button className="w-4 h-4 rounded bg-[#992222] text-white font-bold">✕</button>
              </div>
            </div>

            <div className="p-3 space-y-2.5">
              {/* Cabecera del Documento de Marketing */}
              <div className="bg-white border border-[#7f9db9] p-2.5 rounded grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div>
                  <label className="font-bold text-[#1c3a63] block">Cliente:</label>
                  <input type="text" readOnly value="C20000" className="w-full bg-[#fffde0] border border-[#7f9db9] px-1.5 py-0.5 font-mono font-bold" />
                </div>
                <div>
                  <label className="font-bold text-[#1c3a63] block">Nombre de Cliente:</label>
                  <input type="text" readOnly value="Maxi-Teq Corporation" className="w-full bg-gray-100 border border-[#7f9db9] px-1.5 py-0.5 truncate" />
                </div>
                <div>
                  <label className="font-bold text-[#1c3a63] block">Fecha Contabilización:</label>
                  <input type="text" readOnly value="15.03.2026" className="w-full bg-gray-100 border border-[#7f9db9] px-1.5 py-0.5" />
                </div>
                <div>
                  <label className="font-bold text-[#1c3a63] block">Estado:</label>
                  <span className={`inline-block px-2 py-0.5 rounded font-bold ${salesCreated ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {salesCreated ? 'Cerrado' : 'Abierto'}
                  </span>
                </div>
              </div>

              {/* Grilla de Contenido de Artículos */}
              <div className="bg-white border border-[#7f9db9] rounded overflow-hidden">
                <table className="w-full text-[11px]">
                  <thead className="bg-[#f0f2f5] border-b border-[#7f9db9] text-gray-700 font-bold">
                    <tr>
                      <th className="p-1 text-center w-8">#</th>
                      <th className="p-1 text-left">Número de Artículo</th>
                      <th className="p-1 text-left">Descripción del Artículo</th>
                      <th className="p-1 text-right w-20">Cantidad</th>
                      <th className="p-1 text-right w-24">Precio Unitario</th>
                      <th className="p-1 text-center w-16">IVA</th>
                      <th className="p-1 text-right w-28">Total (EUR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-1 text-center font-mono">1</td>
                      <td className="p-1 font-mono font-bold text-blue-700">A00001</td>
                      <td className="p-1">Servidor ProLiant DL380</td>
                      <td className="p-1 text-right">
                        <input
                          type="number"
                          min={1}
                          value={salesQty1}
                          onChange={(e) => setSalesQty1(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 text-right bg-[#fffde0] border border-[#7f9db9] px-1"
                        />
                      </td>
                      <td className="p-1 text-right font-mono">1,500.00</td>
                      <td className="p-1 text-center">21%</td>
                      <td className="p-1 text-right font-mono font-bold">{(salesQty1 * 1500).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="p-1 text-center font-mono">2</td>
                      <td className="p-1 font-mono font-bold text-blue-700">A00002</td>
                      <td className="p-1">Memoria RAM 64GB DDR4</td>
                      <td className="p-1 text-right">
                        <input
                          type="number"
                          min={1}
                          value={salesQty2}
                          onChange={(e) => setSalesQty2(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 text-right bg-[#fffde0] border border-[#7f9db9] px-1"
                        />
                      </td>
                      <td className="p-1 text-right font-mono">375.00</td>
                      <td className="p-1 text-center">21%</td>
                      <td className="p-1 text-right font-mono font-bold">{(salesQty2 * 375).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pie de Documento y Totales */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="flex gap-1.5">
                  <button className="bg-[#e4e8ef] border border-[#7f9db9] px-2 py-0.5 text-xs font-semibold rounded-[2px] shadow-sm">
                    Copiar de &darr;
                  </button>
                  <button className="bg-[#e4e8ef] border border-[#7f9db9] px-2 py-0.5 text-xs font-semibold rounded-[2px] shadow-sm">
                    Copiar a &rarr;
                  </button>
                </div>

                <div className="bg-white border border-[#7f9db9] p-2 rounded text-right space-y-0.5 w-64 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <strong className="font-mono">{salesSubtotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })} EUR</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Impuesto (IVA 21%):</span>
                    <strong className="font-mono">{salesTax.toLocaleString('es-ES', { minimumFractionDigits: 2 })} EUR</strong>
                  </div>
                  <div className="flex justify-between border-t pt-1 bg-[#fffde0] px-1 font-bold text-gray-900">
                    <span>Total del Documento:</span>
                    <span className="font-mono text-xs">{salesTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })} EUR</span>
                  </div>
                </div>
              </div>

              {/* Botón de Creación */}
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-300">
                <button
                  disabled={salesCreated}
                  onClick={handleCreateSalesInvoice}
                  className={`font-bold text-xs px-5 py-1 rounded-[3px] border shadow transition-all ${salesCreated
                      ? 'bg-emerald-600 text-white border-emerald-800 opacity-80 cursor-default'
                      : 'bg-[#dfdfdf] hover:bg-[#d0d0d0] text-gray-900 border-[#555555] active:scale-95'
                    }`}
                >
                  {salesCreated ? '✓ Factura Contabilizada' : 'Crear / Añadir'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            ARQUETIPO 2: ASIENTO CONTABLE MANUAL (JOURNAL ENTRY - OJDT)
        ════════════════════════════════════════════════════════════════ */}
        {simMode === "journal_entry" && (
          <div className="w-full max-w-4xl mx-auto rounded border-2 border-[#1c3a63] bg-[#ece9d8] shadow-2xl overflow-hidden text-xs text-gray-900">
            <div className="bg-gradient-to-r from-[#004e92] via-[#003366] to-[#000428] text-white px-3 py-1 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <FileText size={13} className="text-amber-400" />
                <span>Registro en el Diario (Asiento Contable Manual) - Finix ERP</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">_</button>
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">□</button>
                <button className="w-4 h-4 rounded bg-[#992222] text-white font-bold">✕</button>
              </div>
            </div>

            <div className="p-3 space-y-2.5">
              <div className="bg-white border border-[#7f9db9] p-2.5 rounded grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div>
                  <label className="font-bold text-[#1c3a63] block">Nº Transacción:</label>
                  <input type="text" readOnly value="10842" className="w-full bg-[#fffde0] border border-[#7f9db9] px-1.5 py-0.5 font-mono font-bold" />
                </div>
                <div>
                  <label className="font-bold text-[#1c3a63] block">Fecha Contabilización:</label>
                  <input type="text" readOnly value="15.03.2026" className="w-full bg-gray-100 border border-[#7f9db9] px-1.5 py-0.5" />
                </div>
                <div>
                  <label className="font-bold text-[#1c3a63] block">Ref. 1:</label>
                  <input type="text" readOnly value="ASIENTO-VENTAS" className="w-full bg-gray-100 border border-[#7f9db9] px-1.5 py-0.5" />
                </div>
                <div>
                  <label className="font-bold text-[#1c3a63] block">Moneda:</label>
                  <input type="text" readOnly value="EUR (Moneda Local)" className="w-full bg-gray-100 border border-[#7f9db9] px-1.5 py-0.5" />
                </div>
              </div>

              {/* Tabla de Partidas Dobles (Debe y Haber) */}
              <div className="bg-white border border-[#7f9db9] rounded overflow-hidden">
                <table className="w-full text-[11px]">
                  <thead className="bg-[#f0f2f5] border-b border-[#7f9db9] text-gray-700 font-bold">
                    <tr>
                      <th className="p-1 text-center w-8">#</th>
                      <th className="p-1 text-left">Cuenta de Mayor / SN</th>
                      <th className="p-1 text-left">Nombre de la Cuenta</th>
                      <th className="p-1 text-right w-28">Debe (EUR)</th>
                      <th className="p-1 text-right w-28">Haber (EUR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-1 text-center font-mono">1</td>
                      <td className="p-1 font-mono font-bold text-blue-700">43000000</td>
                      <td className="p-1">Clientes Nacionales (Maxi-Teq)</td>
                      <td className="p-1 text-right">
                        <input
                          type="number"
                          value={jeDebit1}
                          onChange={(e) => setJeDebit1(parseFloat(e.target.value) || 0)}
                          className="w-24 text-right bg-[#fffde0] border border-[#7f9db9] px-1 font-mono font-bold"
                        />
                      </td>
                      <td className="p-1 text-right font-mono text-gray-400">0.00</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="p-1 text-center font-mono">2</td>
                      <td className="p-1 font-mono font-bold text-blue-700">70000000</td>
                      <td className="p-1">Ventas de Mercaderías</td>
                      <td className="p-1 text-right font-mono text-gray-400">0.00</td>
                      <td className="p-1 text-right">
                        <input
                          type="number"
                          value={jeCredit2}
                          onChange={(e) => setJeCredit2(parseFloat(e.target.value) || 0)}
                          className="w-24 text-right bg-[#fffde0] border border-[#7f9db9] px-1 font-mono font-bold"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-1 text-center font-mono">3</td>
                      <td className="p-1 font-mono font-bold text-blue-700">47700000</td>
                      <td className="p-1">H.P. IVA Repercutido (21%)</td>
                      <td className="p-1 text-right font-mono text-gray-400">0.00</td>
                      <td className="p-1 text-right">
                        <input
                          type="number"
                          value={jeCredit3}
                          onChange={(e) => setJeCredit3(parseFloat(e.target.value) || 0)}
                          className="w-24 text-right bg-[#fffde0] border border-[#7f9db9] px-1 font-mono font-bold"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Verificación de Cuadre Contable */}
              <div className="flex items-center justify-between bg-white border border-[#7f9db9] p-2 rounded text-[11px]">
                <div className="flex items-center gap-4">
                  <span>Total Debe: <strong className="font-mono">{jeTotalDebit.toFixed(2)}</strong></span>
                  <span>Total Haber: <strong className="font-mono">{jeTotalCredit.toFixed(2)}</strong></span>
                </div>
                <div className={`font-bold px-2 py-0.5 rounded ${jeDiff === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {jeDiff === 0 ? '✓ Asiento Cuadrado (Saldo = 0.00)' : `✗ Descuadre: ${jeDiff.toFixed(2)}`}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-300">
                <button
                  disabled={jeCreated || jeDiff !== 0}
                  onClick={handleCreateJE}
                  className={`font-bold text-xs px-5 py-1 rounded-[3px] border shadow transition-all ${jeCreated
                      ? 'bg-emerald-600 text-white border-emerald-800 opacity-80 cursor-default'
                      : jeDiff === 0
                        ? 'bg-[#dfdfdf] hover:bg-[#d0d0d0] text-gray-900 border-[#555555] active:scale-95'
                        : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                    }`}
                >
                  {jeCreated ? '✓ Asiento Contabilizado' : 'Crear / Añadir'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            ARQUETIPO 3: MAESTRO DE ARTÍCULOS (ITEM MASTER DATA - OITM)
        ════════════════════════════════════════════════════════════════ */}
        {simMode === "item_master" && (
          <div className="w-full max-w-4xl mx-auto rounded border-2 border-[#1c3a63] bg-[#ece9d8] shadow-2xl overflow-hidden text-xs text-gray-900">
            <div className="bg-gradient-to-r from-[#004e92] via-[#003366] to-[#000428] text-white px-3 py-1 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Package size={13} className="text-amber-400" />
                <span>Datos Maestros de Artículo - Finix ERP</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">_</button>
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">□</button>
                <button className="w-4 h-4 rounded bg-[#992222] text-white font-bold">✕</button>
              </div>
            </div>

            <div className="p-3 space-y-2.5">
              <div className="bg-white border border-[#7f9db9] p-2.5 rounded grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <label className="font-bold text-[#1c3a63] block">Número de Artículo:</label>
                  <input type="text" readOnly value="A00001" className="w-full bg-[#fffde0] border border-[#7f9db9] px-1.5 py-0.5 font-mono font-bold" />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#1c3a63] block">Descripción:</label>
                  <input type="text" readOnly value="Servidor ProLiant DL380 Gen10" className="w-full bg-gray-100 border border-[#7f9db9] px-1.5 py-0.5" />
                </div>
                <div>
                  <label className="font-bold text-[#1c3a63] block">Grupo de Artículos:</label>
                  <input type="text" readOnly value="01 - Servidores y Hardware" className="w-full bg-gray-100 border border-[#7f9db9] px-1.5 py-0.5" />
                </div>
                <div>
                  <label className="font-bold text-[#1c3a63] block">Lista de Precios:</label>
                  <input type="text" readOnly value="01 - Lista Regular de Ventas" className="w-full bg-gray-100 border border-[#7f9db9] px-1.5 py-0.5" />
                </div>
                <div className="flex items-center gap-3 pt-3">
                  <label className="flex items-center gap-1 font-semibold text-[10px]"><input type="checkbox" defaultChecked /> Inventario</label>
                  <label className="flex items-center gap-1 font-semibold text-[10px]"><input type="checkbox" defaultChecked /> Venta</label>
                  <label className="flex items-center gap-1 font-semibold text-[10px]"><input type="checkbox" defaultChecked /> Compra</label>
                </div>
              </div>

              {/* Pestañas de Datos Maestros */}
              <div className="flex border-b border-[#7f9db9] bg-[#e4e8ef] p-0.5 rounded-t gap-1">
                {[
                  { id: 'inventory', label: 'Datos de Inventario' },
                  { id: 'purchasing', label: 'Datos de Compras' },
                  { id: 'sales', label: 'Datos de Ventas' },
                  { id: 'planning', label: 'Planificación' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setItemTab(tab.id as any)}
                    className={`px-3 py-1 text-xs font-semibold rounded-t ${itemTab === tab.id
                        ? 'bg-white border-t-2 border-t-[#316ac5] text-[#1c3a63]'
                        : 'text-gray-600 hover:bg-[#d0dae8]'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-white border border-[#7f9db9] p-3 rounded-b min-h-[140px]">
                {itemTab === 'inventory' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span>Método de Valoración de Stock:</span>
                      <select
                        value={itemValuation}
                        onChange={(e) => setItemValuation(e.target.value)}
                        className="bg-[#fffde0] border border-[#7f9db9] px-2 py-0.5 font-bold"
                      >
                        <option value="FIFO">FIFO (First In, First Out)</option>
                        <option value="Promedio">Promedio Ponderado</option>
                        <option value="Estándar">Precio Estándar</option>
                      </select>
                    </div>

                    <table className="w-full text-[11px] border border-gray-200">
                      <thead className="bg-[#f0f2f5] text-gray-700">
                        <tr>
                          <th className="p-1 text-left">Almacén</th>
                          <th className="p-1 text-right">En Stock</th>
                          <th className="p-1 text-right">Comprometido</th>
                          <th className="p-1 text-right">Pedido</th>
                          <th className="p-1 text-right font-bold text-blue-800">Disponible</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="p-1 font-bold">01 - Almacén Central</td>
                          <td className="p-1 text-right font-mono">24</td>
                          <td className="p-1 text-right font-mono">6</td>
                          <td className="p-1 text-right font-mono">10</td>
                          <td className="p-1 text-right font-mono font-bold text-emerald-700">28</td>
                        </tr>
                        <tr>
                          <td className="p-1 font-bold">02 - Almacén Norte</td>
                          <td className="p-1 text-right font-mono">5</td>
                          <td className="p-1 text-right font-mono">0</td>
                          <td className="p-1 text-right font-mono">0</td>
                          <td className="p-1 text-right font-mono font-bold text-emerald-700">5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {itemTab !== 'inventory' && (
                  <div className="text-gray-500 text-center py-6 text-[11px]">
                    Propiedades y dimensiones configuradas correctamente según la lección.
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-300">
                <button
                  disabled={itemSaved}
                  onClick={handleUpdateItem}
                  className="bg-[#dfdfdf] hover:bg-[#d0d0d0] text-gray-900 border border-[#555555] font-bold text-xs px-5 py-1 rounded-[3px] shadow active:scale-95"
                >
                  {itemSaved ? '✓ Actualizado' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            ARQUETIPO: DEFINICIÓN DE GRUPOS DE UNIDADES DE MEDIDA (OUGP/UGP1)
        ════════════════════════════════════════════════════════════════ */}
        {simMode === "uom_setup" && (
          <div className="w-full max-w-4xl mx-auto rounded border-2 border-[#1c3a63] bg-[#ece9d8] shadow-2xl overflow-hidden text-xs text-gray-900">
            {/* Title Bar */}
            <div className="bg-gradient-to-r from-[#004e92] via-[#003366] to-[#000428] text-white px-3 py-1 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Layers size={13} className="text-amber-400" />
                <span>Grupos de Unidades de Medida - Definición (OUGP / UGP1) - Finix ERP</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">_</button>
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">□</button>
                <button className="w-4 h-4 rounded bg-[#992222] text-white font-bold">✕</button>
              </div>
            </div>

            <div className="p-3 space-y-2.5">
              {/* Header Fields */}
              <div className="bg-white border border-[#7f9db9] p-2.5 rounded grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div>
                  <label className="font-bold text-[#1c3a63] block">Código de Grupo:</label>
                  <input
                    type="text"
                    value={uomCode}
                    onChange={e => setUomCode(e.target.value)}
                    className="w-full bg-[#fffde0] border border-[#7f9db9] px-2 py-1 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1c3a63] block">Descripción del Grupo:</label>
                  <input
                    type="text"
                    value={uomName}
                    onChange={e => setUomName(e.target.value)}
                    className="w-full bg-white border border-[#7f9db9] px-2 py-1"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1c3a63] block">Unidad de Medida Base:</label>
                  <select
                    value={baseUom}
                    onChange={e => setBaseUom(e.target.value)}
                    className="w-full bg-[#e8f4fd] border border-[#7f9db9] px-2 py-1 font-bold text-blue-900"
                  >
                    <option value="MTR">Metro (MTR) — Unidad Base de Inventario</option>
                    <option value="PCE">Pieza / Unidad (PCE)</option>
                    <option value="KG">Kilogramo (KG)</option>
                  </select>
                </div>
              </div>

              {/* Conversion Matrix (UGP1) */}
              <div className="bg-white border border-[#7f9db9] rounded overflow-hidden">
                <div className="bg-[#f0f4f8] px-3 py-1.5 border-b border-[#7f9db9] flex items-center justify-between">
                  <span className="font-bold text-[#1c3a63] text-xs">Matriz de Reglas de Conversión (Tabla UGP1):</span>
                  <span className="text-[10px] text-gray-500 font-mono">Fórmula: Cant. Alt × UdM Alt = Cant. Base × UdM Base</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] border-collapse">
                    <thead className="bg-[#e4e8ef] text-gray-700 border-b border-gray-300">
                      <tr>
                        <th className="p-1.5 text-center w-10">#</th>
                        <th className="p-1.5 text-left">Código UdM Alt.</th>
                        <th className="p-1.5 text-left">Nombre de Unidad</th>
                        <th className="p-1.5 text-center w-24">Cant. Alt.</th>
                        <th className="p-1.5 text-center w-28">= Cant. Base</th>
                        <th className="p-1.5 text-left">Unidad Base</th>
                        <th className="p-1.5 text-left">Tipo de Empaque</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {/* Fila 1: Base */}
                      <tr className="bg-[#f8fafc]">
                        <td className="p-1.5 text-center font-bold text-gray-400">1</td>
                        <td className="p-1.5 font-mono font-bold text-blue-900">MTR</td>
                        <td className="p-1.5">Metro</td>
                        <td className="p-1.5 text-center font-mono">1</td>
                        <td className="p-1.5 text-center font-mono font-bold bg-[#eff6ff] text-blue-900">1</td>
                        <td className="p-1.5 font-bold text-blue-900">Metro (Base Fija)</td>
                        <td className="p-1.5 text-gray-600">Unidad de Almacén</td>
                      </tr>
                      {/* Fila 2: Rollo */}
                      <tr className="hover:bg-amber-50/50">
                        <td className="p-1.5 text-center font-bold text-gray-400">2</td>
                        <td className="p-1.5 font-mono font-bold text-emerald-800">ROLL</td>
                        <td className="p-1.5 font-semibold">Rollo (100m)</td>
                        <td className="p-1.5 text-center font-mono">1</td>
                        <td className="p-1.5 text-center">
                          <input
                            type="number"
                            value={uomRollQty}
                            onChange={e => setUomRollQty(e.target.value)}
                            className="w-16 bg-[#fffde0] border border-[#7f9db9] text-center font-mono font-bold px-1 py-0.5 text-emerald-800"
                          />
                        </td>
                        <td className="p-1.5 text-gray-700">Metros</td>
                        <td className="p-1.5 text-gray-600">Carrete de Madera (Compras)</td>
                      </tr>
                      {/* Fila 3: Bobina */}
                      <tr className="hover:bg-purple-50/50">
                        <td className="p-1.5 text-center font-bold text-gray-400">3</td>
                        <td className="p-1.5 font-mono font-bold text-purple-800">SPOOL</td>
                        <td className="p-1.5 font-semibold">Bobina (50m)</td>
                        <td className="p-1.5 text-center font-mono">1</td>
                        <td className="p-1.5 text-center">
                          <input
                            type="number"
                            value={uomSpoolQty}
                            onChange={e => setUomSpoolQty(e.target.value)}
                            className="w-16 bg-[#fffde0] border border-[#7f9db9] text-center font-mono font-bold px-1 py-0.5 text-purple-800"
                          />
                        </td>
                        <td className="p-1.5 text-gray-700">Metros</td>
                        <td className="p-1.5 text-gray-600">Bobina Plástica (Ventas)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Consultant Note */}
              <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded p-2 text-[11px] text-[#1e40af] flex items-start gap-2">
                <span className="font-bold text-sm">💡</span>
                <div>
                  <span className="font-bold">Regla de Consultoría Finix ERP:</span> Al registrar este grupo, el stock de artículos vinculados se valorizará en metros. Si compras 5 Rollos, Finix ERP ingresará automáticamente 500 metros en la bodega sin descuadres.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                <span className="text-[10px] text-gray-500 font-mono">Estado: OUGP preparado para actualización</span>
                <div className="flex gap-2">
                  <button
                    disabled={uomGroupSaved}
                    onClick={handleSaveUomGroup}
                    className={`font-bold text-xs px-5 py-1.5 rounded-[3px] shadow transition-all active:scale-95 ${uomGroupSaved
                        ? 'bg-emerald-600 text-white border border-emerald-700'
                        : 'bg-[#dfdfdf] hover:bg-[#d0d0d0] text-gray-900 border border-[#555555]'
                      }`}
                  >
                    {uomGroupSaved ? '✓ Grupo Guardado en Finix ERP' : 'Actualizar y Guardar Grupo'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            ARQUETIPO 4: GESTIÓN BANCARIA Y PAGOS (BANKING / PAYMENTS)
        ════════════════════════════════════════════════════════════════ */}
        {simMode === "banking" && (
          <div className="w-full max-w-4xl mx-auto rounded border-2 border-[#1c3a63] bg-[#ece9d8] shadow-2xl overflow-hidden text-xs text-gray-900">
            <div className="bg-gradient-to-r from-[#004e92] via-[#003366] to-[#000428] text-white px-3 py-1 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <DollarSign size={13} className="text-amber-400" />
                <span>Pagos Recibidos (Cobros a Clientes) - Finix ERP</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">_</button>
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">□</button>
                <button className="w-4 h-4 rounded bg-[#992222] text-white font-bold">✕</button>
              </div>
            </div>

            <div className="p-3 space-y-2.5">
              <div className="bg-white border border-[#7f9db9] p-2.5 rounded grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <label className="font-bold text-[#1c3a63] block">Código de Cliente:</label>
                  <input type="text" readOnly value="C20000" className="w-full bg-[#fffde0] border border-[#7f9db9] px-1.5 py-0.5 font-mono font-bold" />
                </div>
                <div>
                  <label className="font-bold text-[#1c3a63] block">Nombre de Cliente:</label>
                  <input type="text" readOnly value="Maxi-Teq Corporation" className="w-full bg-gray-100 border border-[#7f9db9] px-1.5 py-0.5" />
                </div>
                <div>
                  <label className="font-bold text-[#1c3a63] block">Medio de Pago:</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full bg-[#fffde0] border border-[#7f9db9] px-1.5 py-0.5 font-bold"
                  >
                    <option value="transfer">Transferencia Bancaria</option>
                    <option value="check">Cheque Bancario</option>
                    <option value="cash">Efectivo (Caja)</option>
                  </select>
                </div>
              </div>

              {/* Facturas Pendientes a Conciliar */}
              <div className="bg-white border border-[#7f9db9] rounded overflow-hidden">
                <table className="w-full text-[11px]">
                  <thead className="bg-[#f0f2f5] border-b border-[#7f9db9] text-gray-700 font-bold">
                    <tr>
                      <th className="p-1 text-center w-8">[x]</th>
                      <th className="p-1 text-left">Nº Documento</th>
                      <th className="p-1 text-left">Fecha Factura</th>
                      <th className="p-1 text-right">Total Factura</th>
                      <th className="p-1 text-right font-bold text-amber-800">Saldo Pendiente</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 bg-[#fffde0]/40">
                      <td className="p-1 text-center"><input type="checkbox" defaultChecked /></td>
                      <td className="p-1 font-mono font-bold text-blue-700">FACT-1001</td>
                      <td className="p-1">15.03.2026</td>
                      <td className="p-1 text-right font-mono">4,500.00 EUR</td>
                      <td className="p-1 text-right font-mono font-bold text-amber-700">4,500.00 EUR</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-300">
                <button
                  disabled={payDone}
                  onClick={handleCreatePayment}
                  className={`font-bold text-xs px-5 py-1 rounded-[3px] border shadow transition-all ${payDone
                      ? 'bg-emerald-600 text-white border-emerald-800 opacity-80 cursor-default'
                      : 'bg-[#dfdfdf] hover:bg-[#d0d0d0] text-gray-900 border-[#555555] active:scale-95'
                    }`}
                >
                  {payDone ? '✓ Cobro Registrado y Conciliado' : 'Crear / Añadir Cobro'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            ARQUETIPO 5: QUERY GENERATOR (CONSULTAS SQL - CSI08)
        ════════════════════════════════════════════════════════════════ */}
        {simMode === "query" && (
          <div className="w-full max-w-4xl mx-auto rounded border-2 border-[#1c3a63] bg-[#ece9d8] shadow-2xl overflow-hidden text-xs text-gray-900">
            <div className="bg-gradient-to-r from-[#004e92] via-[#003366] to-[#000428] text-white px-3 py-1 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Database size={13} className="text-amber-400" />
                <span>Query Generator - Generador de Consultas SQL</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">_</button>
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">□</button>
                <button className="w-4 h-4 rounded bg-[#992222] text-white font-bold">✕</button>
              </div>
            </div>

            <div className="p-3 space-y-2.5">
              <div className="bg-white border border-[#7f9db9] p-2 rounded flex items-center gap-3 text-[11px]">
                <span className="font-bold text-[#1c3a63]">Tabla:</span>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="bg-[#fffde0] border border-[#7f9db9] px-2 py-0.5 font-bold rounded"
                >
                  <option value="OCRD">OCRD - Business Partners (Socios de Negocios)</option>
                  <option value="OINV">OINV - A/R Invoices (Facturas de Clientes)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Panel Izquierdo: Lista de Campos */}
                <div className="bg-white border border-[#7f9db9] rounded h-56 flex flex-col overflow-hidden">
                  <div className="bg-[#f0f2f5] border-b border-[#7f9db9] px-2 py-1 font-bold text-gray-700 grid grid-cols-2 text-[10px]">
                    <span>Name</span>
                    <span>Description</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {activeTableFields.map(f => (
                      <div
                        key={f.name}
                        onClick={() => setSelectedFieldInLeftList(f.name)}
                        onDoubleClick={() => handleAddFieldToSelect(f.name)}
                        className={`grid grid-cols-2 px-2 py-0.5 cursor-pointer text-[10px] font-mono border-b border-gray-100 ${selectedFieldInLeftList === f.name ? 'bg-[#316ac5] text-white font-bold' : 'hover:bg-blue-50 text-gray-800'
                          }`}
                      >
                        <span>{f.name}</span>
                        <span className="truncate">{f.desc}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-1 bg-[#f0f2f5] border-t border-gray-300 flex justify-between items-center text-[10px]">
                    <button onClick={() => setSelectedFields([])} className="bg-white border px-2 py-0.5 rounded text-gray-600">X Limpiar</button>
                    <button onClick={() => handleAddFieldToSelect(selectedFieldInLeftList)} className="bg-[#316ac5] text-white px-2 py-0.5 rounded font-bold">&gt;&gt; Insertar</button>
                  </div>
                </div>

                {/* Panel Derecho: Sentencia SQL */}
                <div className="bg-white border border-[#7f9db9] rounded p-2.5 h-56 flex flex-col justify-between space-y-1.5 text-[10px]">
                  <div>
                    <label className="font-bold text-[#1c3a63] block">Select:</label>
                    <div className="border border-[#7f9db9] bg-[#fffde0] p-1 font-mono text-[10px] min-h-[40px] max-h-[50px] overflow-y-auto">
                      {selectedFields.map(f => `T0."${f}"`).join(', ')}
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-[#1c3a63] block">From:</label>
                    <input type="text" readOnly value={`${selectedTable} T0`} className="w-full border border-[#7f9db9] bg-gray-50 px-1 font-mono" />
                  </div>
                  <div>
                    <label className="font-bold text-[#1c3a63] block">Where:</label>
                    <input type="text" value={whereClause} onChange={(e) => setWhereClause(e.target.value)} className="w-full border border-[#7f9db9] bg-[#fffde0] px-1 font-mono" />
                  </div>
                  <div>
                    <label className="font-bold text-[#1c3a63] block">Sort By:</label>
                    <input type="text" value={sortByClause} onChange={(e) => setSortByClause(e.target.value)} className="w-full border border-[#7f9db9] bg-gray-50 px-1 font-mono" />
                  </div>
                </div>
              </div>

              {/* Botones de Ejecución */}
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-300">
                <button
                  onClick={handleExecuteQuery}
                  className="bg-[#dfdfdf] hover:bg-[#d0d0d0] text-gray-900 border border-[#555555] font-bold text-xs px-5 py-1 rounded-[3px] shadow active:scale-95"
                >
                  Ejecutar Consulta
                </button>
              </div>

              {/* Resultados de Consulta */}
              {queryExecuted && (
                <div className="mt-2 bg-white border border-[#7f9db9] rounded overflow-hidden">
                  <div className="bg-[#21436e] text-white px-2 py-1 font-bold text-[10px] flex justify-between">
                    <span>Resultados de Consulta ({queryResults.length} registros)</span>
                    {columnSum !== null && (
                      <span className="text-amber-300">Suma ({summedColumn}): {columnSum.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                    )}
                  </div>
                  <div className="max-h-40 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-[10px] font-mono">
                      <thead className="bg-[#f0f2f5] border-b text-gray-700">
                        <tr>
                          {selectedFields.map(f => (
                            <th
                              key={f}
                              onClick={() => handleSortColumn(f)}
                              title="Ctrl+Clic para calcular suma"
                              className="p-1 text-left cursor-pointer hover:bg-blue-100"
                            >
                              {f}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResults.map((row, idx) => (
                          <tr key={idx} className="border-b hover:bg-blue-50">
                            {selectedFields.map(f => (
                              <td
                                key={f}
                                onClick={(e) => {
                                  if (e.ctrlKey) handleCalculateColumnSum(f);
                                }}
                                className="p-1"
                              >
                                {row[f] !== undefined ? String(row[f]) : '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            ARQUETIPO 6: COCKPIT & SETUP (CSL01 / GENERAL)
        ════════════════════════════════════════════════════════════════ */}
        {simMode === "cockpit" && (
          <div className="w-full max-w-4xl mx-auto rounded border-2 border-[#1c3a63] bg-[#ece9d8] shadow-2xl overflow-hidden text-xs text-gray-900">
            <div className="bg-gradient-to-r from-[#21436e] via-[#2f5c94] to-[#21436e] text-white px-3 py-1 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <span>🎛️ Parametrizaciones Generales - Fiori Cockpit</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">_</button>
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">□</button>
                <button className="w-4 h-4 rounded bg-[#992222] text-white font-bold">✕</button>
              </div>
            </div>

            <div className="p-3 space-y-3">
              <div className="bg-white border border-[#7f9db9] p-2.5 rounded grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#1c3a63] block mb-1">Plantilla de Perfil / Rol:</label>
                  <select
                    value={assignedRole}
                    onChange={(e) => {
                      setAssignedRole(e.target.value);
                      markStepDone(1);
                    }}
                    className="w-full bg-[#f8fafc] border border-[#7f9db9] text-xs p-1 font-semibold text-gray-800 rounded focus:outline-none"
                  >
                    <option value="Ventas y Distribución">Perfil: Ventas y Distribución</option>
                    <option value="Compras y Logística">Perfil: Compras y Logística</option>
                    <option value="Finanzas y Gerencia">Perfil: Finanzas y Dirección</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#1c3a63] block mb-1">Almacén Predeterminado:</label>
                  <select
                    value={defaultWarehouse}
                    onChange={(e) => setDefaultWarehouse(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#7f9db9] text-xs p-1 font-semibold text-gray-800 rounded focus:outline-none"
                  >
                    <option value="01 - Almacén Central">01 - Almacén Central Principal</option>
                    <option value="02 - Almacén Logístico Norte">02 - Almacén Logístico Norte</option>
                  </select>
                </div>
              </div>

              {/* Widgets de Cockpit */}
              <div className="bg-white border border-[#7f9db9] p-2.5 rounded">
                <span className="text-[11px] font-bold text-[#1c3a63] block mb-2">Widgets Activos en Pantalla Fiori:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "kpi_sales", label: "KPI de Ventas Mensual" },
                    { id: "top_customers", label: "Gráfico Top 5 Clientes" },
                    { id: "quick_links", label: "Accesos Rápidos de Menú" }
                  ].map(w => {
                    const active = activeWidgets.includes(w.id);
                    return (
                      <button
                        key={w.id}
                        onClick={() => toggleWidget(w.id)}
                        className={`px-3 py-1 rounded text-xs border font-medium transition-all ${active
                            ? 'bg-[#316ac5] text-white border-[#1c3a63]'
                            : 'bg-[#f0f2f5] text-gray-600 border-[#b0b8c4]'
                          }`}
                      >
                        {active ? "✓ " : "+ "} {w.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    setValidationMessage(null);
                    if (isAlertsPractice || isSearchPractice) {
                      setValidationMessage('Usa la herramienta indicada en las instrucciones para completar esta práctica.');
                      return;
                    }
                    if (manualId === 'mod1-c2' && (assignedRole !== 'Ventas y Distribución' || defaultWarehouse !== '02 - Almacén Logístico Norte')) {
                      setValidationMessage('Selecciona Ventas y Distribución y el Almacén Logístico Norte antes de guardar.');
                      return;
                    }
                    // Solo contar como 1 paso completado (la misión completa = guardar los cambios)
                    void markStepDone(1);
                    setStepSuccessMsg("¡Parametrizaciones de Cockpit guardadas correctamente!");
                    // Esperar 1.5s para que el estudiante vea el éxito, luego continuar
                    completeMission(1500);
                  }}
                  className="bg-[#dfdfdf] hover:bg-[#d0d0d0] text-gray-900 border border-[#555555] font-bold text-xs px-5 py-1 rounded-[3px] shadow active:scale-95"
                >
                  {isExplorationPractice ? 'Terminar exploración' : 'Actualizar y Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            ARQUETIPO 7: COMPRAS (CSL02 / PROCUREMENT)
        ════════════════════════════════════════════════════════════════ */}
        {simMode === "procurement" && (
          <div className="w-full max-w-4xl mx-auto rounded border-2 border-[#1c3a63] bg-[#ece9d8] shadow-2xl overflow-hidden text-xs text-gray-900">
            <div className="bg-gradient-to-r from-[#21436e] via-[#2f5c94] to-[#21436e] text-white px-3 py-1 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <span>📦 Documentos de Compras - Finix ERP</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">_</button>
                <button className="w-4 h-4 rounded bg-[#37669d] text-white font-bold">□</button>
                <button className="w-4 h-4 rounded bg-[#992222] text-white font-bold">✕</button>
              </div>
            </div>

            <div className="p-3 space-y-3">
              <div className="flex border-b border-[#b0b8c4] bg-[#e4e8ef] p-1 rounded-t gap-1">
                {[
                  { id: 'po', label: '1. Pedido de Compras' },
                  { id: 'grpo', label: '2. Entrada de Mercancías' },
                  { id: 'invoice', label: '3. Factura de Proveedores' },
                  { id: 'map', label: '4. Mapa de Relaciones' }
                ].map(step => (
                  <button
                    key={step.id}
                    onClick={() => setProcurementStage(step.id as any)}
                    className={`px-3 py-1 text-xs font-semibold rounded ${procurementStage === step.id
                        ? 'bg-[#316ac5] text-white'
                        : 'text-gray-700 hover:bg-[#d0dae8]'
                      }`}
                  >
                    {step.label}
                  </button>
                ))}
              </div>

              {procurementStage === 'po' && (
                <div className="bg-white border border-[#7f9db9] p-3 rounded space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="font-bold text-gray-700">Proveedor:</span>
                      <div className="bg-gray-100 p-1 border border-gray-300 font-mono">S10000 - Far East Imports</div>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">Fecha de Entrega:</span>
                      <div className="bg-gray-100 p-1 border border-gray-300 font-mono">2026-03-30</div>
                    </div>
                  </div>

                  <div className="border border-gray-300 rounded overflow-hidden">
                    <table className="w-full text-[11px]">
                      <thead className="bg-[#f0f2f5] text-gray-700">
                        <tr>
                          <th className="p-1 text-left">Artículo</th>
                          <th className="p-1 text-right">Cantidad</th>
                          <th className="p-1 text-right">Precio Unitario</th>
                          <th className="p-1 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-1 font-mono">A00001 - Servidor ProLiant</td>
                          <td className="p-1 text-right">
                            <input
                              type="number"
                              value={poQuantity}
                              onChange={(e) => setPoQuantity(parseInt(e.target.value) || 0)}
                              className="w-16 text-right bg-[#fffde0] border border-[#7f9db9] px-1"
                            />
                          </td>
                          <td className="p-1 text-right font-mono">${poPrice.toFixed(2)}</td>
                          <td className="p-1 text-right font-mono font-bold">${(poQuantity * poPrice).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleCreatePO}
                      className="bg-[#dfdfdf] hover:bg-[#d0d0d0] text-gray-900 border border-[#555555] font-bold text-xs px-4 py-1 rounded-[3px] shadow active:scale-95"
                    >
                      Crear Pedido de Compra
                    </button>
                  </div>
                </div>
              )}

              {procurementStage === 'grpo' && (
                <div className="bg-white border border-[#7f9db9] p-3 rounded space-y-3">
                  <div className="text-[11px] font-bold text-[#1c3a63]">Entrada de Mercancías O.C. (OPDN) - Almacén 01</div>
                  <div className="flex items-center justify-between text-xs bg-[#f8fafc] p-2 border border-gray-200">
                    <span>Recepción de Artículo A00001:</span>
                    <select
                      className="bg-[#fffde0] border border-[#7f9db9] px-2 py-0.5 font-bold"
                      onChange={(e) => setPoQuantity(parseInt(e.target.value))}
                    >
                      <option value={5}>5 unidades (Recepción Completa)</option>
                      <option value={3}>3 unidades (Recepción Parcial)</option>
                    </select>
                  </div>
                  <div className="bg-[#e8f5e9] border border-emerald-400 p-2 rounded text-[11px] text-emerald-900">
                    • Asiento Contable Automático: Débito a Inventario (+$6,000) / Crédito a Compensación EM/RF ($6,000).
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleCreateGRPO}
                      className="bg-[#dfdfdf] hover:bg-[#d0d0d0] text-gray-900 border border-[#555555] font-bold text-xs px-4 py-1 rounded-[3px] shadow active:scale-95"
                    >
                      Contabilizar Entrada de Mercancías
                    </button>
                  </div>
                </div>
              )}

              {procurementStage === 'invoice' && (
                <div className="bg-white border border-[#7f9db9] p-3 rounded space-y-2">
                  <div className="text-[11px] font-bold text-[#1c3a63]">Factura de Proveedores (OPCH) - Copiado de Entrada #2001</div>
                  <div className="border border-gray-300 rounded overflow-hidden">
                    <table className="w-full text-[11px] font-mono">
                      <thead className="bg-[#f0f2f5] text-gray-700">
                        <tr>
                          <th className="p-1 text-left">Cuenta de Mayor</th>
                          <th className="p-1 text-right">Débito</th>
                          <th className="p-1 text-right">Crédito</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-1 font-sans">210001 - Compensación EM/RF</td>
                          <td className="p-1 text-right text-emerald-700 font-bold">$6,000.00</td>
                          <td className="p-1 text-right">$0.00</td>
                        </tr>
                        <tr>
                          <td className="p-1 font-sans">200001 - Proveedores (Far East Imports)</td>
                          <td className="p-1 text-right">$0.00</td>
                          <td className="p-1 text-right text-amber-700 font-bold">$6,000.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleCreateInvoice}
                      className="bg-[#dfdfdf] hover:bg-[#d0d0d0] text-gray-900 border border-[#555555] font-bold text-xs px-4 py-1 rounded-[3px] shadow active:scale-95"
                    >
                      Contabilizar Factura de Proveedor
                    </button>
                  </div>
                </div>
              )}

              {procurementStage === 'map' && (
                <div className="bg-white border border-[#7f9db9] p-3 rounded space-y-3">
                  <div className="text-xs font-bold text-[#1c3a63]">Mapa de Relaciones de Documentos (Auditoría Finix ERP)</div>
                  <div className="flex items-center justify-center gap-2 py-3">
                    <div className="border border-[#7f9db9] bg-[#f8fafc] p-2 rounded text-center w-36 shadow-sm">
                      <div className="text-[10px] text-gray-500 uppercase">Pedido</div>
                      <div className="font-bold text-gray-800">#3001</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Cerrado</div>
                    </div>
                    <span className="text-gray-400 font-bold">&rarr;</span>
                    <div className="border border-[#7f9db9] bg-[#f8fafc] p-2 rounded text-center w-36 shadow-sm">
                      <div className="text-[10px] text-gray-500 uppercase">Entrada Merc.</div>
                      <div className="font-bold text-gray-800">#2001</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Cerrado</div>
                    </div>
                    <span className="text-gray-400 font-bold">&rarr;</span>
                    <div className="border border-emerald-500 bg-[#e8f5e9] p-2 rounded text-center w-36 shadow-sm">
                      <div className="text-[10px] text-emerald-800 uppercase">Factura</div>
                      <div className="font-bold text-emerald-900">#1001</div>
                      <div className="text-[10px] text-amber-700 font-semibold">Por Pagar</div>
                    </div>
                  </div>
                  <div className="text-center text-emerald-700 font-bold text-xs">
                    ✓ Ciclo de Aprovisionamiento 100% Validado
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export { FinixInteractiveSimulator as SAPInteractiveSimulator };
