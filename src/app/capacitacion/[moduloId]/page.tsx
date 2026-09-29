import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Layers, Briefcase, CheckCircle2 } from 'lucide-react';
import { TRAINING_TRACKS } from '@/lib/courses-data';
import { getStudentProfile } from '@/lib/student-service';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

export default async function TrackSyllabusPage({ params }: { params: Promise<{ moduloId: string }> }) {
  const resolvedParams = await params;
  const moduloId = resolvedParams?.moduloId || 'sap-b1-logistics';

  const track = TRAINING_TRACKS.find(t => t.id === moduloId) || TRAINING_TRACKS[0];
  const student = getStudentProfile();
  const course = student.progress[track.id] || student.progress[track.code];
  const completedLessonsMap: Record<string, boolean> = {};
  
  if (course?.completedLessons) {
    course.completedLessons.forEach(lid => {
      completedLessonsMap[lid] = true;
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />
      <main className="flex-1 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 w-full">
        {/* BANNER MAESTRO DEL TRACK */}
        <div className="p-6 sm:p-8 rounded-3xl border border-sap-blue/30 bg-gradient-to-br from-sap-blue/10 via-sky-500/5 to-white dark:to-white/[0.02] shadow-sm space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/capacitacion" className="inline-flex items-center gap-1.5 text-xs font-bold text-sap-blue hover:text-sky-600 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Todas las Especialidades
              </Link>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-sap-blue text-white shadow-sm">
                {track.code}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
                {track.badge}
              </span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight mt-1">
                {track.title}
              </h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
              {track.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 font-bold text-sap-blue">
                <Clock className="w-4 h-4" /> {track.totalDurationHours} Horas Lectivas
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <Layers className="w-4 h-4 text-sky-500" /> {track.submodules.length} Submódulos Especializados
              </span>
            </div>
          </div>
        </div>

        {/* SYLLABUS GRID */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Syllabus del Programa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {track.submodules.map((sub, sIdx) => {
              const isDone = !!completedLessonsMap[`l${sIdx + 1}`];
              return (
                <Link
                  key={sub.id}
                  href={`/capacitacion/${track.id}/${sub.id}`}
                  className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-sap-blue/50 hover:shadow-lg hover:shadow-sap-blue/10 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-extrabold text-sap-blue bg-sap-blue/10 px-2 py-0.5 rounded">
                        Módulo {sIdx + 1}
                      </span>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-sap-blue transition-colors">
                      {sub.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                      {sub.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">{sub.durationHours}h • Nivel {sub.level}</span>
                    <span className="text-sap-blue flex items-center gap-1">Entrar a Clase <ArrowLeft className="w-3.5 h-3.5 rotate-180" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
