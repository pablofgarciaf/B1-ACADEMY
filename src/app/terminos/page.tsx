import type { Metadata } from 'next';
import Link from 'next/link';
import { CorreoLegal, LegalPage } from '@/components/legal/LegalPage';
import { dato, LEGAL } from '@/lib/legal-config';

export const metadata: Metadata = {
  // 53 caracteres
  title: 'Términos y Condiciones de Uso del Campus | B1 Academy',
  // 150 caracteres
  description: 'Condiciones de uso de B1 Academy: cuenta y cédula, simulador, tutor IA, evaluaciones, certificados propios no oficiales de SAP y ley ecuatoriana.',
  alternates: { canonical: `${LEGAL.sitio}/terminos` },
};

export default function TerminosPage() {
  return (
    <LegalPage
      actual="/terminos"
      titulo="Términos y condiciones de uso"
      resumen={[
        `${LEGAL.marca} es una academia independiente: no es SAP SE ni un socio oficial de SAP.`,
        'Nuestros certificados son propios de la academia y no equivalen a una certificación oficial de SAP.',
        'Tu cuenta es personal: tu cédula es tu clave del primer ingreso y luego debes crear una contraseña propia.',
        'El simulador es una réplica educativa con datos ficticios; no es el software SAP Business One.',
        'Copiar en las evaluaciones o manipular a la IA anula el resultado.',
      ]}
    >
      <h2>1. Quiénes somos y aceptación</h2>
      <p>
        Estos términos regulan el uso de <strong>{LEGAL.marca}</strong> ({LEGAL.sitio}), plataforma educativa operada por{' '}
        <strong>{dato(LEGAL.razonSocial)}</strong>, RUC <strong>{dato(LEGAL.ruc)}</strong>, con domicilio en {dato(LEGAL.direccion)},{' '}
        {dato(LEGAL.ciudad)}, Ecuador. Al crear una cuenta o usar el campus aceptas estos términos y la{' '}
        <Link href="/privacidad">Política de privacidad</Link>. Si no estás de acuerdo, no uses la plataforma.
      </p>

      <h2>2. Independencia de SAP y marcas registradas</h2>
      <p>
        {LEGAL.marca} es una iniciativa independiente de formación. <strong>No está afiliada, patrocinada ni avalada por SAP SE</strong> ni por
        sus empresas relacionadas. SAP, SAP Business One, SAP HANA, SAP S/4HANA, SAP Fiori y los logotipos asociados son marcas comerciales o
        registradas de SAP SE en Alemania y otros países; se mencionan solo para identificar el software sobre el que trata la formación.
      </p>

      <h2>3. Cuenta de usuario</h2>
      <ul>
        <li>Debes proporcionar datos verdaderos: nombre, correo y cédula o pasaporte propios.</li>
        <li>Tu cédula funciona como clave únicamente en tu <strong>primer ingreso</strong>; en ese momento debes crear una contraseña personal.</li>
        <li>La cuenta es personal e intransferible. No compartas tu contraseña; eres responsable de la actividad realizada con tu cuenta.</li>
        <li>Avísanos de inmediato si sospechas un uso no autorizado.</li>
        <li>Si eres menor de edad, necesitas la autorización de tu representante legal.</li>
      </ul>

      <h2>4. Uso del campus, simulador y manuales</h2>
      <ul>
        <li>El contenido es para tu formación personal. No puedes copiarlo, revenderlo, redistribuirlo ni publicarlo sin autorización escrita.</li>
        <li>
          El simulador es una <strong>réplica visual con fines educativos</strong> que usa una empresa y datos ficticios. No es el software SAP
          Business One y no debe usarse para registrar operaciones reales de ninguna empresa.
        </li>
        <li>Las referencias tributarias (IVA, retenciones, SRI, IESS) son material didáctico y pueden no reflejar la normativa vigente a la fecha en que la consultes.</li>
        <li>Está prohibido intentar vulnerar la seguridad, extraer contenido de forma automatizada o sobrecargar la plataforma.</li>
      </ul>

      <h2>5. Tutor y evaluador con inteligencia artificial</h2>
      <p>
        El campus usa inteligencia artificial para narrar clases, responder dudas y calificar evaluaciones. La IA puede equivocarse: verifica la
        información importante. Las calificaciones automáticas pueden ser revisadas por una persona a tu solicitud (ver la sección 4 de la{' '}
        <Link href="/privacidad">Política de privacidad</Link>).
      </p>

      <h2>6. Evaluaciones y certificados</h2>
      <ul>
        <li>Los certificados que emite {LEGAL.marca} acreditan que aprobaste nuestras evaluaciones. <strong>No son certificaciones oficiales de SAP.</strong></li>
        <li>Debes rendir las evaluaciones por ti mismo, sin ayuda de terceros ni copiar y pegar respuestas.</li>
        <li>Intentar manipular al evaluador (por ejemplo, con instrucciones dentro de una respuesta) o suplantar a otra persona anula la evaluación y puede causar la suspensión de la cuenta.</li>
        <li>Cada certificado tiene un código de verificación. Podemos revocar un certificado obtenido con fraude.</li>
        <li>Los límites de intentos, tiempo y puntaje mínimo se informan antes de iniciar cada evaluación.</li>
      </ul>

      <h2>7. Servicios pagados</h2>
      <p>
        El registro básico es gratuito. Si en el futuro contratas servicios pagados, se informará antes del pago el precio final con impuestos,
        las condiciones y la política de devoluciones, y se emitirá el comprobante electrónico autorizado por el SRI, conforme a la{' '}
        <strong>Ley Orgánica de Defensa del Consumidor</strong> y la normativa tributaria.
      </p>

      <h2>8. Propiedad intelectual</h2>
      <p>
        Los textos, guiones, láminas, diagramas, videos, simulador y software del campus pertenecen a su titular o se usan con autorización, y
        están protegidos por el Código Orgánico de la Economía Social de los Conocimientos, Creatividad e Innovación. El uso del campus no te
        transfiere ningún derecho sobre ellos.
      </p>

      <h2>9. Disponibilidad y responsabilidad</h2>
      <p>
        Trabajamos para que el campus esté disponible y sea correcto, pero se ofrece en el estado en que se encuentra: puede haber
        interrupciones, errores o cambios de contenido. En la medida permitida por la ley, no respondemos por decisiones laborales o
        empresariales tomadas solo con base en el contenido del campus. Nada en estos términos limita los derechos que la ley ecuatoriana te
        reconoce como consumidor.
      </p>

      <h2>10. Suspensión y baja</h2>
      <p>
        Podemos suspender cuentas que incumplan estos términos. Puedes pedir la baja de tu cuenta en cualquier momento escribiendo a{' '}
        <CorreoLegal correo={LEGAL.correoPrivacidad} />.
      </p>

      <h2>11. Comunicaciones electrónicas</h2>
      <p>
        Aceptas recibir comunicaciones sobre tu cuenta y tus cursos por medios electrónicos, que tienen validez conforme a la Ley de Comercio
        Electrónico, Firmas Electrónicas y Mensajes de Datos. No enviaremos publicidad sin tu consentimiento.
      </p>

      <h2>12. Cambios, ley aplicable y jurisdicción</h2>
      <p>
        Podemos actualizar estos términos; los cambios relevantes se avisarán en el campus. Estos términos se rigen por las leyes de la República
        del Ecuador. Cualquier controversia se someterá a los jueces competentes de {dato(LEGAL.ciudad)}, sin perjuicio de los derechos del
        consumidor reconocidos por la ley.
      </p>

      <h2>13. Contacto</h2>
      <p>
        <CorreoLegal correo={LEGAL.correoPrivacidad} /> · WhatsApp {LEGAL.whatsapp}
      </p>
    </LegalPage>
  );
}
