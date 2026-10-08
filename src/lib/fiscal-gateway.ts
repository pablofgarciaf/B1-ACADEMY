/**
 * Capa de pasarelas externas (SRI, firma electrónica, bancos).
 *
 * El simulador depende SOLO de estas interfaces. Hoy se usan las implementaciones
 * `Simulated*`, que no hacen ninguna llamada de red ni verificación criptográfica.
 * Cuando exista la empresa (RUC activo, certificado .p12 real, convenio bancario)
 * se escribe una implementación real de cada interfaz y se cambia en `fiscalGateways`;
 * el resto del código no se toca.
 */

export type SriAmbiente = 1 | 2; // 1 = pruebas (celcer), 2 = producción (cel)

export const SRI_ENDPOINTS: Record<SriAmbiente, { recepcion: string; autorizacion: string }> = {
  1: {
    recepcion: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
    autorizacion: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
  },
  2: {
    recepcion: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
    autorizacion: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
  },
};

/** Resultado común: `simulado` es true mientras no haya integración real. */
export interface GatewayResult<T = undefined> {
  ok: boolean;
  simulado: boolean;
  mensaje: string;
  datos?: T;
}

export interface CertificadoInfo {
  titular: string;
  validoHasta: string;
  /** Solo true cuando una implementación real abrió el .p12 y validó vigencia y cadena. */
  verificadoCriptograficamente: boolean;
}

export interface SriGateway {
  probarConexion(ambiente: SriAmbiente): Promise<GatewayResult>;
  enviarComprobante(xmlFirmado: string, ambiente: SriAmbiente): Promise<GatewayResult<{ estado: 'RECIBIDA' | 'DEVUELTA' }>>;
  consultarAutorizacion(claveAcceso: string, ambiente: SriAmbiente): Promise<GatewayResult<{ numeroAutorizacion: string; fecha: string }>>;
}

export interface FirmaElectronicaGateway {
  /** Abre el .p12 con su clave y devuelve metadatos; una implementación real verifica vigencia. */
  cargarCertificado(p12: ArrayBuffer, clave: string): Promise<GatewayResult<CertificadoInfo>>;
  /** Devuelve el XML firmado (XAdES-BES). */
  firmarXml(xml: string): Promise<GatewayResult<{ xmlFirmado: string }>>;
}

export interface MovimientoBancario {
  fecha: string;
  referencia: string;
  descripcion: string;
  monto: number;
}

export interface BancoGateway {
  obtenerExtracto(cuenta: string, desde: string, hasta: string): Promise<GatewayResult<MovimientoBancario[]>>;
  enviarPagoMasivo(lotes: { cuentaDestino: string; monto: number; referencia: string }[]): Promise<GatewayResult<{ idLote: string }>>;
}

const NO_REAL = 'Modo simulación: sin conexión real. Se activará al conectar la implementación de producción.';

export class SimulatedSriGateway implements SriGateway {
  async probarConexion(ambiente: SriAmbiente): Promise<GatewayResult> {
    return { ok: true, simulado: true, mensaje: `${NO_REAL} Endpoint previsto: ${SRI_ENDPOINTS[ambiente].recepcion}` };
  }
  async enviarComprobante(_xml: string, _ambiente: SriAmbiente) {
    return { ok: true, simulado: true, mensaje: NO_REAL, datos: { estado: 'RECIBIDA' as const } };
  }
  async consultarAutorizacion(claveAcceso: string, _ambiente: SriAmbiente) {
    return {
      ok: true,
      simulado: true,
      mensaje: NO_REAL,
      datos: { numeroAutorizacion: claveAcceso, fecha: new Date().toISOString() },
    };
  }
}

export class SimulatedFirmaGateway implements FirmaElectronicaGateway {
  async cargarCertificado(p12: ArrayBuffer, clave: string): Promise<GatewayResult<CertificadoInfo>> {
    if (!clave) return { ok: false, simulado: true, mensaje: 'Ingrese la contraseña del certificado.' };
    if (p12.byteLength === 0) return { ok: false, simulado: true, mensaje: 'El archivo está vacío.' };
    return {
      ok: true,
      simulado: true,
      mensaje: NO_REAL,
      datos: { titular: 'CERTIFICADO DE PRUEBA (simulado)', validoHasta: '', verificadoCriptograficamente: false },
    };
  }
  async firmarXml(xml: string) {
    return { ok: true, simulado: true, mensaje: NO_REAL, datos: { xmlFirmado: xml } };
  }
}

export class SimulatedBancoGateway implements BancoGateway {
  async obtenerExtracto() {
    return { ok: true, simulado: true, mensaje: NO_REAL, datos: [] as MovimientoBancario[] };
  }
  async enviarPagoMasivo() {
    return { ok: true, simulado: true, mensaje: NO_REAL, datos: { idLote: 'SIM-0001' } };
  }
}

/** Único punto a modificar para pasar de simulación a producción. */
export const fiscalGateways: { sri: SriGateway; firma: FirmaElectronicaGateway; banco: BancoGateway } = {
  sri: new SimulatedSriGateway(),
  firma: new SimulatedFirmaGateway(),
  banco: new SimulatedBancoGateway(),
};
