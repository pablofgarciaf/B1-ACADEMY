import type { Metadata } from 'next';
import Link from 'next/link';
import { CorreoLegal, LegalPage } from '@/components/legal/LegalPage';
import { BotonConfigurarCookies } from '@/components/legal/CookieConsent';
import { LEGAL } from '@/lib/legal-config';

export const metadata: Metadata = {
  // 53 caracteres
  title: 'Política de Cookies y Consentimiento Web | B1 Academy',
  // 141 caracteres
  description: 'Qué cookies usa B1 Academy, para qué sirven, cuánto duran y cómo aceptar, rechazar o cambiar tu consentimiento de analítica en cualquier momento.',
  alternates: { canonical: `${LEGAL.sitio}/cookies` },
};

export default function CookiesPage() {
  return (
    <LegalPage
      actual="/cookies"
      titulo="Política de cookies"
      resumen={[
        'Solo usamos las cookies necesarias para que inicies sesión y recordemos tus preferencias.',
        'Las cookies de analítica (Google) se activan únicamente si las aceptas.',
        'Puedes cambiar tu decisión cuando quieras con el botón de esta página.',
      ]}
    >
      <h2>1. Qué son las cookies</h2>
      <p>
        Son pequeños archivos o registros que el sitio guarda en tu navegador. Algunas son imprescindibles para que el campus funcione; otras
        nos ayudan a entender cómo se usa. Además de cookies, usamos tecnologías similares del navegador (almacenamiento local e IndexedDB), a
        las que se aplica esta misma política.
      </p>

      <h2>2. Cookies que usamos</h2>
      <table>
        <thead><tr><th>Nombre</th><th>Tipo</th><th>Para qué</th><th>Duración</th><th>Proveedor</th></tr></thead>
        <tbody>
          <tr><td><code>__session</code></td><td>Necesaria</td><td>Mantener tu sesión iniciada de forma segura (no accesible desde JavaScript)</td><td>Hasta 5 días o al cerrar sesión</td><td>{LEGAL.marca}</td></tr>
          <tr><td><code>b1_consent</code></td><td>Necesaria</td><td>Recordar si aceptaste o rechazaste la analítica, con la versión y fecha</td><td>12 meses</td><td>{LEGAL.marca}</td></tr>
          <tr><td><code>theme</code> (almacenamiento local)</td><td>Necesaria / preferencia</td><td>Recordar el modo claro u oscuro</td><td>Hasta que la borres</td><td>{LEGAL.marca}</td></tr>
          <tr><td><code>firebaseLocalStorageDb</code> (IndexedDB)</td><td>Necesaria</td><td>Autenticación de tu cuenta</td><td>Hasta cerrar sesión</td><td>Google Firebase</td></tr>
          <tr><td><code>_ga</code>, <code>_ga_*</code></td><td>Analítica (opcional)</td><td>Estadísticas de uso anónimas o seudonimizadas</td><td>Hasta 2 años</td><td>Google Analytics, vía Google Tag Manager</td></tr>
        </tbody>
      </table>
      <p>
        No usamos cookies publicitarias ni de redes sociales. Las cookies necesarias no requieren consentimiento porque sin ellas no podrías
        iniciar sesión; las analíticas solo se activan después de que las aceptas.
      </p>

      <h2>3. Cómo cambiar tu decisión</h2>
      <p>Puedes aceptar o retirar tu consentimiento para la analítica en cualquier momento:</p>
      <div className="not-prose my-4">
        <BotonConfigurarCookies className="px-5 py-2.5 rounded-xl bg-sap-blue text-white text-sm font-bold hover:opacity-90 active:scale-95 transition-all" />
      </div>
      <p>
        También puedes borrar o bloquear cookies desde la configuración de tu navegador; si bloqueas las necesarias, no podrás iniciar sesión.
      </p>

      <h2>4. Más información</h2>
      <p>
        El tratamiento de los datos obtenidos con cookies se rige por nuestra <Link href="/privacidad">Política de privacidad</Link>. Consultas:{' '}
        <CorreoLegal correo={LEGAL.correoPrivacidad} />.
      </p>
    </LegalPage>
  );
}
