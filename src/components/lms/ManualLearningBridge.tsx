'use client';
import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { manualLearningPath, lessonHref } from '@/lib/manual-learning-path';
export default function ManualLearningBridge({manualId}:{manualId:string}) {
 const {manual,modules}=manualLearningPath(manualId);
 return <section className="h-full overflow-y-auto p-3 sm:p-4 space-y-4 text-slate-200">
 <div className="rounded-2xl border border-sky-400/30 bg-sky-400/10 p-4"><p className="text-xs uppercase tracking-widest text-sky-300 font-bold">Del manual a la práctica</p><h3 className="mt-2 text-base font-bold text-white">{manual?.title??'Elige tu módulo de aprendizaje'}</h3><p className="mt-3 text-sm leading-relaxed">Elige una clase relacionada para practicar en tu empresa educativa y registrar tu avance en Mi Aula.</p></div>

 {modules.map(module=><article key={module.id} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4"><h4 className="font-bold text-white">{module.title}</h4><p className="mt-2 text-xs text-slate-400 leading-relaxed">{module.description}</p><ul className="mt-4 space-y-2">{module.classes.map(lesson=><li key={lesson.id}><Link href={lessonHref(module.id,lesson.id)} className="flex items-center justify-between gap-3 rounded-lg border border-slate-700 px-3 py-3 text-sm hover:bg-sky-400/10 hover:border-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"><span>{lesson.number}. {lesson.title}</span><ArrowRight size={16} className="shrink-0"/></Link></li>)}</ul></article>)}
 {!modules.length&&<Link className="text-sky-300 underline" href="/mi-aula">Explorar módulos en Mi Aula</Link>}
 <div className="rounded-xl border border-emerald-400/25 p-4 text-sm"><h4 className="flex gap-2 font-bold text-emerald-300"><GraduationCap size={19}/>Una constancia por módulo aprobado</h4><p className="mt-2 leading-relaxed">Los manuales son material de consulta. La constancia se obtiene en Mi Aula al completar las clases, las prácticas requeridas y la evaluación del módulo. Leer este manual o aprobar su repaso no emite un certificado.</p></div>
 </section>;
}
