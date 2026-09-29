"use client";

import React, { useState } from 'react';
import { SAPFioriShell } from './SAPFioriShell';
import { SAPFioriTile } from './SAPFioriTile';
import { SAPMasterDetail } from './SAPMasterDetail';
import { SAPSearchTable } from './SAPSearchTable';
import { Users, Shield, CheckSquare, Settings, Award, Link, Hash, LayoutList, FileText, Activity, PhoneCall, Database } from 'lucide-react';

export const DemoFioriApp = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'masterDetail' | 'searchTable'>('dashboard');
  const [selectedRole, setSelectedRole] = useState('cashier');

  const handleTileClick = (viewName: 'dashboard' | 'masterDetail' | 'searchTable') => {
    setCurrentView(viewName);
  };

  if (currentView === 'masterDetail') {
    return (
      <SAPFioriShell title="SAP Customer Checkout manager">
        <SAPMasterDetail 
          pageTitle="Roles"
          selectedId={selectedRole}
          onSelect={setSelectedRole}
          onBack={() => setCurrentView('dashboard')}
          items={[
            { id: 'cashier', title: 'CASHIER', subtitle: 'Cashier' },
            { id: 'salesmanager', title: 'SALESMANAGER', subtitle: 'Sales Manager' },
            { id: 'admin', title: 'ADMINISTRATOR', subtitle: 'System Administrator' },
            { id: 'security', title: 'DATASECURITYOFFICER', subtitle: 'Data Security Officer' }
          ]}
        >
          <div className="p-8">
            <h1 className="text-3xl font-bold text-[#32363a] uppercase mb-1">{selectedRole}</h1>
            <p className="text-[#6a6d70] mb-8 capitalize">{selectedRole}</p>
            
            <div className="flex space-x-6 border-b border-[#d9d9d9] mb-8">
              <button className="pb-3 border-b-2 border-[#008FD3] text-[#008FD3] font-semibold">Detalles</button>
              <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-[#32363a] font-semibold">Autorizaciones</button>
              <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-[#32363a] font-semibold">Aplicaciones</button>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="font-semibold text-[#32363a] mb-4">Datos generales</h3>
                <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
                  <div className="text-right text-sm text-[#6a6d70]">Nombre</div>
                  <div className="text-sm text-[#32363a] font-medium uppercase">{selectedRole}</div>
                  
                  <div className="text-right text-sm text-[#6a6d70]">Descripción</div>
                  <div className="text-sm text-[#32363a] border-b border-dashed border-slate-300 pb-1">Cashier</div>
                  
                  <div className="text-right text-sm text-[#6a6d70]">Rol superior</div>
                  <div className="text-sm border-b border-slate-300 pb-1 h-6 w-full max-w-xs"></div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-[#32363a] mb-4">Datos de ventas</h3>
                <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
                  <div className="text-right text-sm text-[#6a6d70]">Lista de precios</div>
                  <div className="text-sm border-b border-slate-300 pb-1 h-6 w-full max-w-xs flex justify-between items-center">
                    <span></span>
                    <span className="text-slate-400">▼</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </SAPMasterDetail>
      </SAPFioriShell>
    );
  }

  return (
    <SAPFioriShell title="SAP Customer Checkout manager">
      {currentView === 'searchTable' && (
        <SAPSearchTable 
          title="CLIENTE"
          onClose={() => setCurrentView('dashboard')}
          columns={[
            { key: 'id', label: 'ID de cliente', width: '20%' },
            { key: 'nombre', label: 'Nombre', width: '30%' },
            { key: 'direccion', label: 'Dirección', width: '40%' },
            { key: 'estado', label: 'Estado', width: '10%' }
          ]}
          data={[
            { id: 'C0102439189001', nombre: 'MENA SANCHEZ FLORA MARGARITA', direccion: 'CUENCA, ADOLFO TORRES 3-01 Y BELISARIO ANDRADE', estado: 'Activo' },
            { id: 'C0103407284001', nombre: 'MENA SANCHEZ EDWIN ISAAC', direccion: 'CUENCA / MERCADO 12 DE ABRIL LOCAL 297 Y AV GUAPONDELIG', estado: 'Activo' },
            { id: 'C0102503299001', nombre: 'FUENTES LOJA CARLOS FELIPE', direccion: 'CUENCA PARROQUIA TURI CENTRO C/O VIA TURI Y CALLEJON SIN NOM. MAS ARRIBA', estado: 'Activo' },
            { id: 'C0101759892001', nombre: 'LOPEZ MALDONADO JOSE RODRIGO', direccion: 'Mercado, San Vicente de Paul, Calle 24 y A B esquina, GUAYAQUIL, EC', estado: 'Activo' },
            { id: 'C0102828555001', nombre: 'SOLIS CARDENAS MONICA SUSANA', direccion: '-', estado: 'Activo' },
            { id: 'C010269225001', nombre: 'ORDOÑEZ ALMEIDA MARTHA BEATRIZ', direccion: 'CUENCA, GUAPONDELIG 4-23 Y CLEMENTE YEROVI, MERC 12 DE ABRIL LOCAL 625', estado: 'Activo' },
            { id: 'C0190403769001', nombre: 'TRANSPORTE Y LOGISTICA INTEGRAL GOTRANS CIA. LTDA.', direccion: 'GYE, KM 1/2 VIA DAULE CONJUNTO DE BODEGAS SEPRACOM', estado: 'Activo' }
          ]}
        />
      )}

      <div className="p-8">
        <h2 className="text-2xl text-[#32363a] font-normal mb-6">SAP Customer Checkout manager</h2>
        
        <div className="flex flex-wrap gap-4 mb-12">
          <SAPFioriTile title="Usuarios" icon={Users} onClick={() => handleTileClick('searchTable')} />
          <SAPFioriTile title="Roles" icon={Shield} onClick={() => handleTileClick('masterDetail')} />
          <SAPFioriTile title="Tareas" icon={CheckSquare} onClick={() => handleTileClick('dashboard')} />
          <SAPFioriTile title="Configuración" icon={Settings} onClick={() => handleTileClick('dashboard')} />
          <SAPFioriTile title="Certificados" icon={Award} onClick={() => handleTileClick('dashboard')} />
          <SAPFioriTile title="Sistemas de comunicación" icon={Link} onClick={() => handleTileClick('dashboard')} />
          <SAPFioriTile title="Acuerdos de comunicación" icon={Hash} onClick={() => handleTileClick('dashboard')} />
          <SAPFioriTile title="Números de secuencia" icon={Hash} onClick={() => handleTileClick('dashboard')} />
          <SAPFioriTile title="Consumidores de números de secuencia" icon={LayoutList} onClick={() => handleTileClick('dashboard')} />
          <SAPFioriTile title="Licencias" icon={FileText} onClick={() => handleTileClick('dashboard')} />
          <SAPFioriTile title="Configuración de datos maestros" icon={Settings} onClick={() => handleTileClick('dashboard')} />
        </div>

        <h2 className="text-2xl text-[#32363a] font-normal mb-6">Supervisión</h2>
        <div className="flex flex-wrap gap-4">
          <SAPFioriTile title="Supervisión" icon={Activity} onClick={() => handleTileClick('dashboard')} />
          <SAPFioriTile title="Informes de supervisión" icon={FileText} onClick={() => handleTileClick('dashboard')} />
          <SAPFioriTile title="Supervisión de llamada entrante" icon={PhoneCall} onClick={() => handleTileClick('dashboard')} />
          <SAPFioriTile title="Cola de datos maestros" icon={Database} onClick={() => handleTileClick('dashboard')} />
        </div>
      </div>
    </SAPFioriShell>
  );
};
