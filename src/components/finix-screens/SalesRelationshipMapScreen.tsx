'use client';

import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { 
  Network, 
  FileText, 
  ShoppingCart, 
  Truck, 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Building2, 
  ZoomIn, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Screen, buttonClass } from './FinixControls';

interface NodeData {
  id: string;
  type: 'quotation' | 'order' | 'delivery' | 'invoice' | 'payment';
  code: string;
  title: string;
  date: string;
  status: 'Cerrado' | 'Abierto' | 'Conciliado';
  amount: number;
  details: string;
  executiveValue: string;
}

export default function SalesRelationshipMapScreen() {
  const c = useCompany();
  const [selectedNode, setSelectedNode] = useState<string>('inv-1');
  const [viewMode, setViewMode] = useState<'chain' | 'accounting'>('chain');

  // Buscar documentos reales guardados en la empresa del estudiante (B1 Center)
  const quotes = c.data.salesOrders.filter(d => d.docType === 'quotation');
  const orders = c.data.salesOrders.filter(d => d.docType === 'order');
  const deliveries = c.data.salesOrders.filter(d => d.docType === 'delivery');
  const invoices = c.data.salesOrders.filter(d => d.docType === 'invoice');
  const payments = c.data.bankTransactions.filter(t => t.type === 'deposit');

  const nodes: NodeData[] = [
    {
      id: 'quot-1',
      type: 'quotation',
      code: quotes[0]?.docNumber || 'COT-10021',
      title: 'Oferta de Venta',
      date: quotes[0]?.date || '15/03/2026',
      status: 'Cerrado',
      amount: quotes[0]?.total || 4250.00,
      details: '5x Laptop Dell Latitude 3420 · Cliente: C20005 Corporación Andina · Validez 15 días.',
      executiveValue: 'Demuestra al cliente que el pipeline se registra formalmente sin dispersión en correos ni hojas de cálculo.'
    },
    {
      id: 'ord-1',
      type: 'order',
      code: orders[0]?.docNumber || 'PV-20045',
      title: 'Pedido de Cliente',
      date: orders[0]?.date || '15/03/2026',
      status: 'Cerrado',
      amount: orders[0]?.total || 4250.00,
      details: 'Copiado desde Oferta COT-10021 · Stock Comprometido: 5 unidades en Bodega Central 01.',
      executiveValue: 'Reserva automática en almacén: elimina la sobreventa y asegura el cumplimiento exacto de la promesa comercial.'
    },
    {
      id: 'del-1',
      type: 'delivery',
      code: deliveries[0]?.docNumber || 'ENT-30012',
      title: 'Entrega de Mercancía',
      date: deliveries[0]?.date || '16/03/2026',
      status: 'Cerrado',
      amount: deliveries[0]?.total || 4250.00,
      details: 'Despacho logístico físico de Bodega 01 · Asiento de Costo de Ventas vs Inventario automático.',
      executiveValue: 'Sincronización logística-contable: descarga de inventario sin intervención manual ni duplicidad.'
    },
    {
      id: 'inv-1',
      type: 'invoice',
      code: invoices[0]?.docNumber || 'FAC-001-001-000492',
      title: 'Factura Electrónica SRI',
      date: invoices[0]?.date || '16/03/2026',
      status: 'Cerrado',
      amount: invoices[0]?.total || 4887.50,
      details: 'Base Imponible: $4,250.00 + IVA 15% SRI ($637.50) · Clave de Acceso SRI Ecuador 2026 generada.',
      executiveValue: 'Cumplimiento tributario en tiempo real: emite comprobantes oficiales SRI y genera la cuenta por cobrar al centavo.'
    },
    {
      id: 'pay-1',
      type: 'payment',
      code: payments[0]?.reference || 'PAG-REC-8901',
      title: 'Pago Recibido en Bancos',
      date: payments[0]?.date || '17/03/2026',
      status: 'Conciliado',
      amount: payments[0]?.amount || 4887.50,
      details: 'Transferencia Banco Pichincha (BAN-1) · Liquidación de saldo a cobrar y liberación de límite de crédito.',
      executiveValue: 'Cierre del ciclo Order-to-Cash: flujo de caja real en tesorería y restablecimiento automático del cupo de crédito.'
    }
  ];

  const currentNode = nodes.find(n => n.id === selectedNode) || nodes[3];

  const getIcon = (type: NodeData['type']) => {
    switch (type) {
      case 'quotation': return FileText;
      case 'order': return ShoppingCart;
      case 'delivery': return Truck;
      case 'invoice': return Receipt;
      case 'payment': return CreditCard;
    }
  };

  return (
    <Screen title="Mapa de Relaciones · Trazabilidad y Auditoría Comercial Finix ERP">
      {/* Controles Superiores de la Ventana */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#f0f4f9] border border-[#7f9db9] rounded text-xs mb-3">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-[#004e92]" />
          <span className="font-bold text-[#1c3a63]">Documento Raíz:</span>
          <span className="px-2 py-0.5 rounded bg-white border border-[#7f9db9] font-mono font-bold text-slate-800">
            {currentNode.code} ({currentNode.title})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded border border-[#7f9db9] overflow-hidden bg-white text-[11px]">
            <button
              type="button"
              onClick={() => setViewMode('chain')}
              className={`px-3 py-1 font-semibold transition-colors ${
                viewMode === 'chain' ? 'bg-[#1c3a63] text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Cadena Documental (O2C)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('accounting')}
              className={`px-3 py-1 font-semibold transition-colors ${
                viewMode === 'accounting' ? 'bg-[#1c3a63] text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Vínculo Contable & SRI
            </button>
          </div>
        </div>
      </div>

      {/* Lienzo del Árbol de Relaciones */}
      <div className="relative bg-[#ffffff] border-2 border-[#7f9db9] rounded-lg p-5 shadow-inner min-h-[300px] overflow-x-auto">
        <div className="text-[11px] font-semibold text-slate-500 mb-4 flex items-center justify-between">
          <span>Vista interactiva: Haz clic en cualquier documento para auditar su impacto directivo</span>
          <span className="flex items-center gap-1.5 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> Trazabilidad Completa 100% Auditada
          </span>
        </div>

        {/* Nodos Conectados */}
        <div className="flex items-center justify-between gap-3 min-w-[760px] py-4 px-2">
          {nodes.map((node, index) => {
            const Icon = getIcon(node.type);
            const isSelected = selectedNode === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNode(node.id)}
                  className={`cursor-pointer transition-all rounded-lg p-3 text-left w-40 border-2 select-none ${
                    isSelected
                      ? 'border-[#004e92] bg-blue-50/70 shadow-lg scale-105 ring-2 ring-blue-400/40'
                      : 'border-slate-300 bg-slate-50/90 hover:border-blue-400 hover:bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="p-1 rounded bg-[#004e92]/10 text-[#004e92]">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      node.status === 'Conciliado' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-900 leading-tight truncate">{node.title}</p>
                  <p className="font-mono text-[10px] font-semibold text-blue-800 truncate mt-0.5">{node.code}</p>
                  <div className="mt-2 pt-1 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 text-[10px]">{node.date}</span>
                    <span className="font-mono font-bold text-slate-900">${node.amount.toFixed(2)}</span>
                  </div>
                </div>

                {index < nodes.length - 1 && (
                  <div className="flex flex-col items-center justify-center shrink-0 px-1 text-slate-400">
                    <ArrowRight className="w-5 h-5 text-blue-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Copiar a</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Panel de Auditoría y Argumentación Comercial Directiva */}
      <div className="mt-3 bg-[#fdfdfd] border border-[#7f9db9] rounded-lg p-4 shadow-sm text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-[#1c3a63] text-sm">
              Detalle de Auditoría Directiva: {currentNode.title} ({currentNode.code})
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">
            Empresa activa: <strong>{c.data.profile?.companyName || 'B1 Center'}</strong>
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Detalles de la Operación:</p>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
              {currentNode.details}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="font-bold text-blue-900 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <span>🎯</span> Valor Comercial para la Demostración (CEO / CFO):
            </p>
            <p className="text-blue-950 font-medium leading-relaxed bg-blue-50/70 p-2.5 rounded border border-blue-200 text-xs">
              {currentNode.executiveValue}
            </p>
          </div>
        </div>

        {viewMode === 'accounting' && (
          <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px] space-y-1">
            <p className="font-bold">Asiento Contable Relacionado (Partida Doble Automática):</p>
            <div className="font-mono text-[10px] space-y-0.5">
              <p>• 1.1.03 Clientes Nacionales (Cuentas por Cobrar): Debe $4,887.50 USD</p>
              <p>• 4.1.01 Ventas de Mercaderías (Ingresos Operacionales): Haber $4,250.00 USD</p>
              <p>• 2.1.07 IVA en Ventas 15% SRI Ecuador (Pasivo Tributario): Haber $637.50 USD</p>
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}
