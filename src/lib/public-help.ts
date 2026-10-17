/** Public admissions information uses no AI provider, account data or external requests. */
export function publicHelpReply(question: string) {
  const normalized = question.toLowerCase();
  if (/empresa|equipo|cotiza|capacitaci/.test(normalized)) return 'Para capacitar a tu equipo, visita /empresas#solicitud. Puedes indicar los procesos, número de personas y un medio de contacto. La solicitud no implica contratar.';
  if (/precio|pago|costo|gratis/.test(normalized)) return 'Crear una cuenta es gratuito. Revisa el alcance de cada programa antes de comenzar. Para una propuesta empresarial y sus condiciones, usa /empresas#solicitud. No se realiza ningún cobro desde este chat.';
  if (/certific|constancia/.test(normalized)) return 'Las constancias son emitidas por Finix Academy y requieren completar el recorrido y las evaluaciones del programa. Se verifican por código en /verificar; no equivalen a acreditación estatal o del fabricante.';
  if (/inscri|cuenta|curso|registro/.test(normalized)) return 'Explora las rutas en /capacitacion y crea tu cuenta en /login. Crear la cuenta no equivale a comprar un curso ni a obtener una constancia. Al entrar tendrás los requisitos del aula y las prácticas.';
  return 'Puedes explorar la formación en /capacitacion y los manuales en /manuales. Para preguntas sobre tus prácticas y el uso del ERP, inicia sesión en /login y consulta al tutor. Si representas a una empresa, deja una solicitud en /empresas#solicitud.';
}
