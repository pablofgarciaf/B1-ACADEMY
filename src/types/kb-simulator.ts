/** Tipos compartidos para el Simulador SAP basado en la KB de capturas reales */

export interface KBCard {
  id: string;               // "folder/filename"
  archivo: string;          // "output/visualk_moderno/..."
  modulo: string;           // folder de origen
  origen: string;           // "visualk-2024+", "web-2024+", etc.
  video: string | null;
  fecha: string | null;
  segundo: number | null;
  sistema: 'b1' | 's4-sapgui' | 'fiori';
  sistema_real: 'b1' | 's4-sapgui' | 'fiori';
  proceso: string;          // "00_Navegacion", "01_Ventas", "02_Compras", …
  titulo: string;
  etiquetas: string[];
  texto: string[];
  descripcion_ia: string | null;
  calidad: 'ok' | 'revisar' | 'descartar';
  duplicado_de: string | null;
}

/** Props que recibe cada vista de simulador (B1, Fiori, S4GUI) */
export interface SimuladorSAPProps {
  cards: KBCard[];
  proceso: string;
  procesoNombre: string;
  sistema: 'b1' | 's4-sapgui' | 'fiori';
  step: number;
  onStep: (n: number) => void;
  onComplete: () => void;
}

/** Mapa proceso → nombre legible */
export const PROCESO_NOMBRES: Record<string, string> = {
  '00_Navegacion':       'Navegación SAP',
  '01_Ventas':           'Proceso de Ventas',
  '02_Compras':          'Proceso de Compras',
  '03_Bancos':           'Tesorería y Bancos',
  '04_Finanzas':         'Contabilidad y Finanzas',
  '05_Maestros':         'Datos Maestros',
  '06_Produccion':       'Producción',
  '07_MRP':              'Planificación MRP',
  '08_CRM_Oportunidades':'CRM y Oportunidades',
  '09_Servicios':        'Servicios',
  '10_Proyectos':        'Proyectos',
  '11_DTW_Migracion':    'DTW / Migración',
  '12_Query_Manager':    'Query Manager',
  '13_Autorizaciones':   'Autorizaciones',
};

/** Nombre visible de cada sistema */
export const SISTEMA_NOMBRES: Record<string, string> = {
  'b1':        'SAP Business One',
  's4-sapgui': 'S/4HANA SAP GUI',
  'fiori':     'SAP Fiori',
};

/** Icono / color de acento por sistema */
export const SISTEMA_CONFIG: Record<string, { color: string; accent: string; label: string }> = {
  'b1':        { color: '#1B4F8A', accent: '#3B8EDB', label: 'SAP Business One' },
  's4-sapgui': { color: '#003180', accent: '#0050A0', label: 'S/4HANA SAP GUI' },
  'fiori':     { color: '#354A5E', accent: '#5B738B', label: 'SAP Fiori' },
};
