import {publicUrl} from '@/lib/site-url';
export function GET(){return new Response(`# Finix Academy

Formación en español para practicar procesos administrativos y contables con Finix ERP. Es un laboratorio educativo; sus comprobantes no se envían al SRI ni a bancos. Las constancias son propias de la academia.

- [Formación](${publicUrl('/capacitacion')})
- [Manuales](${publicUrl('/manuales')})
- [Prácticas explicadas](${publicUrl('/blog')})
- [Equipos de empresas](${publicUrl('/empresas')})
- [Verificar constancias](${publicUrl('/verificar')})
- [Privacidad](${publicUrl('/privacidad')})
- [Descripción completa](${publicUrl('/llms-full.txt')})

Consulte la página concreta y su alcance vigente. No se afirma acreditación estatal, empleo garantizado ni aptitud del simulador como libro oficial.
`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
