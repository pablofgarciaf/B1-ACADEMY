import {publicUrl} from '@/lib/site-url';
import {OFFICIAL_SYLLABUS} from '@/lib/curriculum-data';
export function GET(){return new Response(`# Finix Academy — programa de formación

Objetivo: practicar compras, ventas, inventario, producción y finanzas en un laboratorio educativo. El progreso exige prácticas verificadas y evaluación del programa. Las constancias de Finix Academy se consultan por código; no equivalen a títulos o acreditación externa.

## Módulos
${OFFICIAL_SYLLABUS.map(m=>`- ${m.title}: ${m.description} (${publicUrl('/capacitacion/'+encodeURIComponent(m.id))})`).join('\n')}

## Alcance y contacto
La creación de cuenta no implica contratar un curso ni obtener una constancia. Empresas: ${publicUrl('/empresas#solicitud')}. El simulador trabaja con escenarios de laboratorio; no emite comprobantes SRI ni ejecuta banca real. Revise los términos en ${publicUrl('/terminos')} y la privacidad en ${publicUrl('/privacidad')}.
`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
