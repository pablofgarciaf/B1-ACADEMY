import os

simulator_code = '''"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getManualSimulatorConfig, ManualSimulatorConfig } from '@/lib/manual-simulator-registry';

interface StepGuide {
  title: string;
  menu_path?: string;
  action_type?: string;
  instructions: string[];
  expected_output?: string;
}

interface SAPInteractiveSimulatorProps {
  manualId: string;
  currentStepIndex: number;
  stepGuide?: StepGuide;
  onStepComplete?: (stepNumber: number) => void;
}

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

export default function SAPInteractiveSimulator({ 
  manualId, 
  currentStepIndex, 
  stepGuide,
  onStepComplete 
}: SAPInteractiveSimulatorProps) {
  const { userProfile } = useAuth();

  // Configuración del Simulador basada en el catálogo unificado
  const simConfig = useMemo<ManualSimulatorConfig>(() => {
    return getManualSimulatorConfig(manualId);
  }, [manualId]);

  const simMode = simConfig.archetype;

  // Estados de persistencia en Firebase / LocalStorage
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [stepSuccessMsg, setStepSuccessMsg] = useState<string | null>(null);

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
  const [whereClause, setWhereClause] = useState<string>('T0."CardType" = \\'C\\'');
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
      data = MOCK_OCRD.filter(item => {
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

  const handleCreateSalesInvoice = () => {
    setSalesCreated(true);
    markStepDone(1);
    markStepDone(2);
    setStepSuccessMsg("¡Factura de Clientes #1042 contabilizada con éxito!");
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

  const handleCreateJE = () => {
    if (jeDiff !== 0) {
      alert("El asiento contable está descuadrado. La suma del Debe debe ser igual a la del Haber.");
      return;
    }
    setJeCreated(true);
    markStepDone(1);
    markStepDone(2);
    setStepSuccessMsg("¡Asiento Contable #10892 registrado en el Libro Mayor!");
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
  };

  return (
    <div className="h-full flex flex-col bg-[#101720] text-gray-200 overflow-hidden font-sans select-none">
      {/* Barra de Estado Superior */}
      <div className="bg-[#18222d] border-b border-gray-800 px-3 py-1.5 flex items-center justify-between text-[11px] shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-400">SAP Business One 10.0 (HANA)</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">Sociedad: <strong className="text-gray-300">SBODEMO_ES</strong></span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">Módulo: <strong className="text-blue-300">{simConfig.moduleName}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {stepSuccessMsg && (
            <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] animate-pulse">
              {stepSuccessMsg}
            </span>
          )}
          <span className="text-gray-400">Completados: <strong className="text-emerald-400">{completedSteps.length}</strong></span>
        </div>
      </div>

      {/* ÁREA DE TRABAJO PRINCIPAL DEL CLIENTE SAP */}
      <div className="flex-1 p-2 sm:p-3 overflow-y-auto custom-scrollbar flex flex-col justify-start">

        {/* ════════════════════════════════════════════════════════════════
            ARQUETIPO 0: MÓDULO TEÓRICO Y CONCEPTUAL (requiresSimulator = false)
        ════════════════════════════════════════════════════════════════ */}
        {(!simConfig.requiresSimulator || simMode === 'none') && (
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
                <span>Factura de Clientes - SAP Business One</span>
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
                  className={`font-bold text-xs px-5 py-1 rounded-[3px] border shadow transition-all ${
                    salesCreated 
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
                <span>Registro en el Diario (Asiento Contable Manual) - SAP B1</span>
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
                  className={`font-bold text-xs px-5 py-1 rounded-[3px] border shadow transition-all ${
                    jeCreated 
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
                <span>Datos Maestros de Artículo - SAP Business One</span>
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
                    className={`px-3 py-1 text-xs font-semibold rounded-t ${
                      itemTab === tab.id 
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
            ARQUETIPO 4: GESTIÓN BANCARIA Y PAGOS (BANKING / PAYMENTS)
        ════════════════════════════════════════════════════════════════ */}
        {simMode === "banking" && (
          <div className="w-full max-w-4xl mx-auto rounded border-2 border-[#1c3a63] bg-[#ece9d8] shadow-2xl overflow-hidden text-xs text-gray-900">
            <div className="bg-gradient-to-r from-[#004e92] via-[#003366] to-[#000428] text-white px-3 py-1 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <DollarSign size={13} className="text-amber-400" />
                <span>Pagos Recibidos (Cobros a Clientes) - SAP Business One</span>
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
                  className={`font-bold text-xs px-5 py-1 rounded-[3px] border shadow transition-all ${
                    payDone 
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
                        className={`grid grid-cols-2 px-2 py-0.5 cursor-pointer text-[10px] font-mono border-b border-gray-100 ${
                          selectedFieldInLeftList === f.name ? 'bg-[#316ac5] text-white font-bold' : 'hover:bg-blue-50 text-gray-800'
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
                        className={`px-3 py-1 rounded text-xs border font-medium transition-all ${
                          active 
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
                    markStepDone(1);
                    markStepDone(2);
                    markStepDone(3);
                    setStepSuccessMsg("¡Parametrizaciones de Cockpit guardadas!");
                  }}
                  className="bg-[#dfdfdf] hover:bg-[#d0d0d0] text-gray-900 border border-[#555555] font-bold text-xs px-5 py-1 rounded-[3px] shadow active:scale-95"
                >
                  Actualizar y Guardar
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
                <span>📦 Documentos de Compras - SAP Business One</span>
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
                    className={`px-3 py-1 text-xs font-semibold rounded ${
                      procurementStage === step.id 
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
                  <div className="text-xs font-bold text-[#1c3a63]">Mapa de Relaciones de Documentos (Auditoría SAP B1)</div>
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
'''

with open('src/components/simulator/SAPInteractiveSimulator.tsx', 'w', encoding='utf-8') as f:
    f.write(simulator_code)

print("Updated src/components/simulator/SAPInteractiveSimulator.tsx successfully!")
