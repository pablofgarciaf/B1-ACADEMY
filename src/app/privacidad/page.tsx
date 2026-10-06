import type { Metadata } from 'next';
import Link from 'next/link';
import { CorreoLegal, LegalPage } from '@/components/legal/LegalPage';
import { dato, LEGAL } from '@/lib/legal-config';

export const metadata: Metadata = {
  // 54 caracteres
  title: 'Política de Privacidad y Datos Personales | B1 Academy',
  // 152 caracteres
  description: 'Cómo B1 Academy trata tus datos personales conforme a la LOPDP de Ecuador: finalidades, cédula, IA, transferencias, plazos y cómo ejercer tus derechos.',
  alternates: { canonical: `${LEGAL.sitio}/privacidad` },
};

export default function PrivacidadPage() {
  return (
    <LegalPage
      actual="/privacidad"
      titulo="Política de privacidad y protección de datos personales"
      resumen={[
        'Usamos tus datos solo para darte acceso al campus, medir tu avance y emitir tus certificados.',
        'Tu cédula se usa para identificarte y como clave de tu primer ingreso; luego creas tu contraseña personal.',
        'No vendemos tus datos. Los proveedores tecnológicos que usamos están detallados abajo.',
        'Tu examen lo califica una IA, pero siempre puedes pedir que una persona revise el resultado.',
        'Puedes acceder, corregir, eliminar o llevarte tus datos escribiéndonos.',
      ]}
    >
      <h2>1. Responsable del tratamiento</h2>
      <p>
        El responsable del tratamiento de tus datos personales es <strong>{dato(LEGAL.razonSocial)}</strong>, con RUC{' '}
        <strong>{dato(LEGAL.ruc)}</strong> y domicilio en {dato(LEGAL.direccion)}, {dato(LEGAL.ciudad)}, Ecuador, que opera la plataforma
        educativa <strong>{LEGAL.marca}</strong> ({LEGAL.sitio}). Contacto para temas de datos personales:{' '}
        <CorreoLegal correo={LEGAL.correoPrivacidad} /> · WhatsApp {LEGAL.whatsapp}.
      </p>
      <p>
        Esta política se rige por la <strong>Ley Orgánica de Protección de Datos Personales</strong> (LOPDP, Registro Oficial Suplemento
        459 de 26 de mayo de 2021) y su Reglamento.
      </p>

      <h2>2. Qué datos tratamos</h2>
      <table>
        <thead><tr><th>Categoría</th><th>Datos</th><th>Origen</th></tr></thead>
        <tbody>
          <tr><td>Identificación y contacto</td><td>Nombre, correo electrónico, cédula o pasaporte, teléfono/WhatsApp (opcional)</td><td>Tú, al registrarte, o la institución que te inscribe</td></tr>
          <tr><td>Cuenta</td><td>Identificador de usuario, rol, estado de la cuenta, fecha de registro. La contraseña la gestiona Google Firebase y nosotros no podemos verla.</td><td>Generados por la plataforma</td></tr>
          <tr><td>Actividad académica</td><td>Clases completadas, progreso, puntajes, prácticas del simulador, respuestas y notas de evaluaciones, certificados emitidos</td><td>Tu uso del campus</td></tr>
          <tr><td>Conversaciones con el tutor IA</td><td>Preguntas y respuestas en el chat de ayuda y en las evaluaciones</td><td>Tu uso del campus</td></tr>
          <tr><td>Datos técnicos</td><td>Cookies de sesión y preferencias; si lo aceptas, datos de navegación analítica (páginas visitadas, dispositivo, ubicación aproximada)</td><td>Tu navegador (ver <Link href="/cookies">Política de cookies</Link>)</td></tr>
        </tbody>
      </table>
      <p>
        No solicitamos datos sensibles (salud, origen étnico, creencias, datos biométricos, etc.). Te pedimos no incluirlos en el chat ni en
        tus respuestas.
      </p>

      <h2>3. Para qué los usamos y con qué base legal</h2>
      <table>
        <thead><tr><th>Finalidad</th><th>Base legal (LOPDP)</th></tr></thead>
        <tbody>
          <tr><td>Crear y administrar tu cuenta; identificarte con tu cédula en el primer ingreso</td><td>Ejecución de la relación educativa que solicitas y tu consentimiento</td></tr>
          <tr><td>Darte acceso a clases, manuales, simulador y tutor IA; registrar tu progreso</td><td>Ejecución de la relación educativa</td></tr>
          <tr><td>Evaluar tus conocimientos y emitir certificados verificables</td><td>Ejecución de la relación educativa</td></tr>
          <tr><td>Seguridad de la plataforma y prevención de fraude en evaluaciones</td><td>Interés legítimo</td></tr>
          <tr><td>Analítica de uso para mejorar el campus</td><td>Tu consentimiento (cookies analíticas), que puedes retirar en cualquier momento</td></tr>
          <tr><td>Cumplir obligaciones legales y tributarias, si contratas servicios pagados</td><td>Obligación legal</td></tr>
        </tbody>
      </table>
      <p>No usamos tus datos para publicidad de terceros ni los vendemos.</p>

      <h2>4. Evaluaciones calificadas con inteligencia artificial</h2>
      <p>
        Las respuestas de la evaluación de certificación se califican automáticamente con modelos de inteligencia artificial contra una rúbrica
        de conceptos técnicos. Esta calificación puede decidir si obtienes un certificado. Por eso tienes derecho a{' '}
        <strong>solicitar que una persona revise tu resultado</strong>, a expresar tu punto de vista y a impugnar la decisión, escribiendo a{' '}
        <CorreoLegal correo={LEGAL.correoPrivacidad} /> con el módulo y la fecha de la evaluación.
      </p>

      <h2>5. Con quién compartimos tus datos (encargados del tratamiento)</h2>
      <p>Usamos proveedores tecnológicos que tratan datos por nuestra cuenta y solo para prestarnos el servicio:</p>
      <table>
        <thead><tr><th>Proveedor</th><th>Servicio</th><th>Datos</th><th>Ubicación</th></tr></thead>
        <tbody>
          <tr><td>Google (Firebase)</td><td>Autenticación y base de datos</td><td>Cuenta, perfil, progreso, evaluaciones</td><td>Estados Unidos y otros</td></tr>
          <tr><td>Vercel</td><td>Alojamiento del sitio</td><td>Datos técnicos de las solicitudes</td><td>Estados Unidos y otros</td></tr>
          <tr><td>NVIDIA</td><td>IA para el tutor y la calificación de evaluaciones</td><td>Texto de tus preguntas y respuestas</td><td>Estados Unidos</td></tr>
          <tr><td>Google (Gemini)</td><td>IA de respaldo para la calificación</td><td>Texto de tus respuestas</td><td>Estados Unidos y otros</td></tr>
          <tr><td>Microsoft</td><td>Voz del tutor (texto a voz)</td><td>Solo textos del curso, no datos personales</td><td>Estados Unidos y otros</td></tr>
          <tr><td>Google (Tag Manager / Analytics)</td><td>Analítica, solo si la aceptas</td><td>Datos de navegación</td><td>Estados Unidos y otros</td></tr>
        </tbody>
      </table>
      <p>
        <strong>Transferencia internacional:</strong> estos proveedores procesan datos fuera de Ecuador. Al aceptar esta política consientes esa
        transferencia, que se realiza con proveedores que aplican medidas contractuales y técnicas de seguridad. Solo compartiremos datos con
        autoridades cuando una ley u orden competente lo exija.
      </p>

      <h2>6. Cuánto tiempo los conservamos</h2>
      <ul>
        <li>Datos de cuenta y progreso: mientras tu cuenta esté activa y hasta 2 años después de tu último ingreso.</li>
        <li>Certificados emitidos: el código de verificación se conserva mientras el certificado deba poder verificarse.</li>
        <li>Respuestas de evaluaciones: hasta 2 años, para atender revisiones e impugnaciones.</li>
        <li>Datos tributarios de servicios pagados: el plazo que exija la normativa tributaria.</li>
        <li>Datos analíticos: según la configuración de la herramienta, máximo 14 meses.</li>
      </ul>
      <p>Si pides eliminar tu cuenta, borramos o anonimizamos tus datos salvo los que la ley nos obligue a conservar.</p>

      <h2>7. Tus derechos</h2>
      <p>Según la LOPDP puedes ejercer en cualquier momento, de forma gratuita, los derechos de:</p>
      <ul>
        <li><strong>Información y acceso:</strong> saber qué datos tuyos tratamos y obtener una copia.</li>
        <li><strong>Rectificación y actualización:</strong> corregir datos inexactos o incompletos.</li>
        <li><strong>Eliminación:</strong> pedir que borremos tus datos cuando ya no sean necesarios o retires tu consentimiento.</li>
        <li><strong>Oposición:</strong> oponerte a tratamientos basados en interés legítimo.</li>
        <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso común.</li>
        <li><strong>Suspensión del tratamiento</strong> en los casos previstos por la ley.</li>
        <li><strong>No ser objeto de decisiones basadas únicamente en tratamiento automatizado</strong> (ver sección 4).</li>
        <li><strong>Retirar tu consentimiento</strong> (por ejemplo, el de cookies analíticas) sin afectar lo tratado antes.</li>
      </ul>
      <p>
        Para ejercerlos escribe a <CorreoLegal correo={LEGAL.correoPrivacidad} /> indicando tu nombre, el correo de tu cuenta y el derecho que
        quieres ejercer. Te responderemos dentro de los plazos de la LOPDP. Si no estás conforme con la respuesta, puedes acudir a la{' '}
        <strong>Superintendencia de Protección de Datos Personales</strong>.
      </p>

      <h2>8. Menores de edad</h2>
      <p>
        El campus está dirigido a personas mayores de 18 años. Si eres menor de edad, necesitas la autorización de tu madre, padre o
        representante legal para registrarte. Si detectamos una cuenta de un menor sin esa autorización, la suspenderemos.
      </p>

      <h2>9. Seguridad</h2>
      <p>
        Aplicamos medidas como conexiones cifradas (HTTPS), cookies de sesión protegidas, contraseñas gestionadas por Firebase (no las
        almacenamos), control de acceso por roles y reglas de seguridad en la base de datos. Si ocurre una vulneración de seguridad que afecte
        tus datos, la notificaremos a la autoridad y, cuando corresponda, a ti, conforme a la LOPDP.
      </p>

      <h2>10. Cambios a esta política</h2>
      <p>
        Si cambiamos esta política de forma relevante te lo avisaremos en el campus y, cuando la ley lo exija, te pediremos un nuevo
        consentimiento. La versión vigente es siempre la publicada en esta página.
      </p>
    </LegalPage>
  );
}
