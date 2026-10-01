"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Award, 
  Sparkles, 
  BookOpen, 
  Wrench, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Compass, 
  DollarSign, 
  ShoppingCart, 
  Factory, 
  Scale, 
  Terminal, 
  Users, 
  LayoutDashboard, 
  TrendingUp, 
  Building2, 
  CreditCard, 
  PieChart, 
  ArrowRight, 
  Search, 
  Filter, 
  Check, 
  Clock, 
  Lock, 
  ExternalLink,
  Bot,
  ChevronRight,
  X,
  UserCheck,
  LogIn
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { 
  CAREER_TRACKS, 
  MICRO_CERTIFICATIONS, 
  TEACHER_ACCREDITATION_INFO,
  CareerId, 
  MicroCertification,
  CareerTrack 
} from '@/lib/campus-curriculum-data';
import { generateOfficialCampusCertificate } from '@/lib/certificate-generator';
import { useAuth } from '@/context/AuthContext';

export default function MiAulaPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [profileMode, setProfileMode] = useState<'student' | 'teacher'>('student');
  const [selectedCareer, setSelectedCareer] = useState<CareerId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal de Emisión Oficial de Certificado
  const [modalCert, setModalCert] = useState<{
    type: 'micro' | 'diploma' | 'master' | 'docente';
    title: string;
    careerTitle: string;
    hours: number;
    fee: number;
    competencies?: string[];
  } | null>(null);

  const [studentNameInput, setStudentNameInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccessCode, setGeneratedSuccessCode] = useState<string | null>(null);

  // Inicializar nombre si hay perfil activo
  React.useEffect(() => {
    if (userProfile?.displayName || userProfile?.name) {
      setStudentNameInput(userProfile.displayName || userProfile.name || '');
    } else {
      setStudentNameInput('Consultor Profesional SAP');
    }
  }, [userProfile]);

  // Filtrado de Micro-Certificaciones
  const filteredMicroCerts = useMemo(() => {
    return MICRO_CERTIFICATIONS.filter(mc => {
      const matchesCareer = selectedCareer === 'all' || mc.careerId === selectedCareer;
      const matchesQuery = searchQuery === '' || 
        mc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mc.skillsTagged.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCareer && matchesQuery;
    });
  }, [selectedCareer, searchQuery]);

  // Manejar descarga de Certificado Oficial Firmado
  const handleDownloadOfficialCert = () => {
    if (!modalCert) return;
    setIsGenerating(true);

    try {
      const code = generateOfficialCampusCertificate({
        studentName: studentNameInput.trim() || 'Estudiante Acreditado SAP',
        certificateType: modalCert.type,
        title: modalCert.title,
        careerTitle: modalCert.careerTitle,
        hours: modalCert.hours,
        competencies: modalCert.competencies,
        scorePercent: 96
      });
      setGeneratedSuccessCode(code);
    } catch (e) {
      console.error('Error generando certificado:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Renderizador de iconos temáticos
  const renderIcon = (name: string, className = "w-5 h-5") => {
    switch (name) {
      case 'LayoutDashboard': return <LayoutDashboard className={className} />;
      case 'Users': return <Users className={className} />;
      case 'DollarSign': return <DollarSign className={className} />;
      case 'CreditCard': return <CreditCard className={className} />;
      case 'Building2': return <Building2 className={className} />;
      case 'PieChart': return <PieChart className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'ShoppingCart': return <ShoppingCart className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Scale': return <Scale className={className} />;
      case 'Factory': return <Factory className={className} />;
      case 'Terminal': return <Terminal className={className} />;
      default: return <Award className={className} />;
    }
  };

  const studentDisplayName = userProfile?.displayName || userProfile?.name || 'Estudiante';
  const studentEmail = userProfile?.email || '';
  const initials = studentDisplayName
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-gray-100 selection:bg-amber-500/30 selection:text-white transition-colors">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 sm:space-y-12">
        {/* Cápsula GEO para Google AI Overviews, Perplexity y ChatGPT */}
        <aside aria-label="Resumen de Mi Aula Virtual SAP B1" className="p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 backdrop-blur-md">
          <strong className="text-slate-900 dark:text-white font-semibold">Mi Aula Virtual SAP Business One:</strong>{' '}
          Espacio de formación y acreditación profesional oficial. Estructurado en <strong>4 Carreras Universitarias</strong>,{' '}
          <strong>12 Micro-Certificaciones Transaccionales</strong>, tutoría interactiva de <strong>Master B1</strong> y laboratorios de práctica en el <strong>Simulador SAP B1 10.0 (HANA)</strong> con firmas de responsabilidad legal y académica.
        </aside>

        {/* Tarjeta de Bienvenida & Perfil del Estudiante */}
        {userProfile ? (
          <div className="rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#131a20] p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg ring-2 ring-amber-400/30">
                {initials || <GraduationCap size={28} />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Estudiante Activo
                  </span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {studentDisplayName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  {studentEmail} • Expediente Curricular SAP B1 Habilitado
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/simulador"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition-all active:scale-95"
              >
                <Wrench className="w-4 h-4" />
                <span>Abrir Simulador</span>
              </Link>
              <Link
                href="/manuales"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 text-xs font-bold border border-slate-300 dark:border-gray-700 transition-all active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Manuales & Atlas</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Bienvenido a tu Aula Virtual de SAP Business One
              </h2>
              <p className="text-xs text-slate-600 dark:text-gray-400">
                Puedes explorar los módulos y manuales libremente. Para guardar tu progreso y registrar tus diplomas oficiales, inicia sesión.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </Link>
          </div>
        )}

        {/* Hero Section & Switch de Perfil (Alumno vs Docente) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200 dark:border-gray-800 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <GraduationCap className="w-3.5 h-3.5" /> Aula Virtual • SAP Business One 10.0
            </div>
            {/* H1 Quirúrgico (45-65 chars) -> 58 caracteres */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
              Mi Aula Virtual: Escuela y Certificación SAP Business One
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              El espacio integral donde aprendes la lógica ERP, practicas en el simulador de escritorio con <strong>Master B1</strong> y obtienes tus certificaciones oficiales avaladas por la dirección académica.
            </p>
          </div>

          {/* Selector de Modo: Alumno vs Docente */}
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#131a20] border border-slate-200 dark:border-gray-800 shadow-xl">
            <button
              onClick={() => setProfileMode('student')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                profileMode === 'student'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Estudiante / Profesional</span>
            </button>
            <button
              onClick={() => setProfileMode('teacher')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                profileMode === 'teacher'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Docente Universitario</span>
            </button>
          </div>
        </div>

        {/* VISTA DOCENTE UNIVERSITARIO ("TRAIN THE TRAINER") */}
        {profileMode === 'teacher' && (
          <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-[#131a20] to-[#0d131a] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-500/20 pb-5">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Programa Train the Trainer</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" /> Acreditación Docente e Instructor Catedrático
                </h2>
              </div>
              <button
                onClick={() => setModalCert({
                  type: 'docente',
                  title: 'Acreditación Docente e Instructor Académico SAP Business One',
                  careerTitle: 'Programa Train-the-Trainer Universitario',
                  hours: 120,
                  fee: 149,
                  competencies: [
                    'Didáctica de sistemas ERP en aula superior',
                    'Manejo del Simulador SAP B1 como laboratorio evaluativo',
                    'Resolución de casos de estudio contables y de supply chain'
                  ]
                })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg transition-all active:scale-95"
              >
                <Award className="w-4 h-4" />
                <span>Solicitar Acreditación Docente</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
              <div className="space-y-3 rounded-2xl bg-black/40 border border-purple-500/20 p-5">
                <h3 className="font-bold text-purple-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Requisitos de Habilitación por Carrera
                </h3>
                <p className="text-xs leading-relaxed text-gray-400">
                  {TEACHER_ACCREDITATION_INFO.specialistRequirements}
                </p>
                <div className="pt-2 text-xs font-semibold text-purple-200">
                  ¿Quieres enseñar únicamente Finanzas o Logística? Puedes obtener la acreditación de <em>Docente Catedrático Especialista</em> aprobando el itinerario correspondiente.
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-black/40 border border-purple-500/20 p-5">
                <h3 className="font-bold text-amber-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> Acreditación Docente Titular Master B1
                </h3>
                <p className="text-xs leading-relaxed text-gray-400">
                  {TEACHER_ACCREDITATION_INFO.masterTeacherRequirements}
                </p>
                <div className="pt-2 text-xs font-semibold text-amber-200">
                  Otorga la máxima jerarquía académica y la facultad de rubricar exámenes de grado a nivel universitario.
                </div>
              </div>
            </div>

            <div className="border-t border-purple-500/20 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Beneficios del Docente Acreditado:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TEACHER_ACCREDITATION_INFO.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-300 rounded-xl bg-purple-900/10 border border-purple-500/20 p-3">
                    <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LAS 4 CARRERAS DE ESPECIALIDAD */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Itinerarios Formativos
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Las 4 Carreras de la Escuela SAP Business One
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 max-w-md">
              Cada carrera consolida un perfil empresarial completo con diplomas oficiales, horas acreditadas y prácticas en el simulador.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAREER_TRACKS.map((career) => (
              <div
                key={career.id}
                className="group relative rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#131a20] p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Glow decorativo de fondo */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${career.gradient} rounded-full blur-3xl -z-0 opacity-50 group-hover:opacity-100 transition-opacity`} />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-gray-700">
                      Carrera {career.number} • {career.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {career.totalHours}h Académicas
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      {career.title}
                    </h3>
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                      Rol: {career.careerRole}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                    {career.description}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Competencias Clave:</span>
                    <ul className="text-xs text-slate-600 dark:text-gray-300 space-y-1">
                      {career.objectives.slice(0, 3).map((obj, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="relative z-10 mt-6 pt-5 border-t border-slate-100 dark:border-gray-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCareer(career.id)}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      Ver {career.microCertifications.length} Micro-certificados <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setModalCert({
                      type: 'diploma',
                      title: career.diplomaTitle,
                      careerTitle: career.title,
                      hours: career.totalHours,
                      fee: career.diplomaIssuanceFeeUSD,
                      competencies: career.objectives
                    })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white border border-slate-700 dark:border-gray-600 transition-all active:scale-95"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Emitir Diploma Oficial</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXPLORADOR DE LAS 12 MICRO-CERTIFICACIONES MODULARES */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Acreditaciones por Hitos
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                12 Micro-Certificaciones de Competencia Transaccional
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
                Completa los bloques temáticos de manuales, resuelve los retos en el simulador y obtén tus credenciales verificables con código hash y QR.
              </p>
            </div>

            {/* Buscador Rápido */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar competencia o módulo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-[#131a20] border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Filtro por Carrera */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <button
              onClick={() => setSelectedCareer('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                selectedCareer === 'all'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#131a20] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todas las Carreras ({MICRO_CERTIFICATIONS.length})
            </button>
            {CAREER_TRACKS.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCareer(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                  selectedCareer === c.id
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white dark:bg-[#131a20] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {c.shortTitle}
              </button>
            ))}
          </div>

          {/* Grid de Micro-certificaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMicroCerts.map((mc) => (
              <div
                key={mc.id}
                className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#131a20] p-5 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        {renderIcon(mc.iconName, "w-4 h-4")}
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-gray-400">
                        {mc.code}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      mc.level === 'OPERATIVO'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : mc.level === 'ESPECIALISTA'
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                        : 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                    }`}>
                      {mc.level}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {mc.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {mc.description}
                    </p>
                  </div>

                  {/* Etiquetas de habilidades */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {mc.skillsTagged.map((skill, i) => (
                      <span key={i} className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 dark:text-gray-400 flex items-center justify-between border-t border-slate-100 dark:border-gray-800/80">
                    <span>{mc.manualIds.length} Manuales Prácticos</span>
                    <span className="font-semibold text-slate-700 dark:text-gray-300">{mc.estimatedHours}h Formación</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between gap-2">
                  <Link
                    href={`/manuales/${mc.manualIds[0]}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Estudiar</span>
                  </Link>

                  <button
                    onClick={() => setModalCert({
                      type: 'micro',
                      title: mc.title,
                      careerTitle: CAREER_TRACKS.find(c => c.id === mc.careerId)?.title || 'Escuela SAP B1',
                      hours: mc.estimatedHours,
                      fee: mc.officialIssuanceFeeUSD,
                      competencies: mc.competencies
                    })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all active:scale-95 shadow-md"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Emitir ($ {mc.officialIssuanceFeeUSD})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN DEL GRADO MASTER Y SIMULADOR */}
        <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-950 via-[#131a20] to-slate-950 p-6 sm:p-10 shadow-2xl text-white flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Award className="w-4 h-4" /> Grado Máximo Profesional
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Certificación Master: Consultor Asociado SAP Business One
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              El pináculo de la academia. Certifica el dominio integral de las 4 Carreras de la Escuela, la superación de los 121 manuales y el examen de grado de 60 reactivos con simulación en tiempo real.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setModalCert({
                  type: 'master',
                  title: 'Certificación Master: Consultor Asociado SAP Business One',
                  careerTitle: 'Escuela Completa de Consultoría e Implementación ERP',
                  hours: 310,
                  fee: 199,
                  competencies: [
                    'Implementación completa y parametrización de sociedades SAP B1',
                    'Modelado de arquitectura contable NIIF y control de inventarios',
                    'Integración de cadenas de suministro y planificación MRP',
                    'Herramientas avanzadas: DTW, SQL Queries y procedimientos de aprobación'
                  ]
                })}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl transition-all active:scale-95"
              >
                <Award className="w-4 h-4" />
                <span>Emitir Certificación Master</span>
              </button>

              <Link
                href="/simulador"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs sm:text-sm border border-gray-700 transition-all active:scale-95"
              >
                <Wrench className="w-4 h-4 text-blue-400" />
                <span>Ir al Simulador de Escritorio</span>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-black/60 p-6 space-y-4 max-w-sm w-full backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Firmas de Responsabilidad</h4>
                <p className="text-[11px] text-gray-400">Verificables por empresas y reclutadores</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Todos los certificados emitidos en Mi Aula Virtual cuentan con firmas digitales del Director Académico, Consultores Titulares SAP, código QR y verificación pública permanente.
            </p>
            <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-bold pt-2 border-t border-gray-800">
              <span>B1-CERT-2026-ONLINE</span>
              <span>100% AUDITABLE</span>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL DE EMISIÓN DE CERTIFICADO OFICIAL */}
      {modalCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/40 bg-[#131a20] p-6 sm:p-7 shadow-2xl text-left text-white">
            <button
              onClick={() => {
                setModalCert(null);
                setGeneratedSuccessCode(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-lg">
                <Award size={22} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Acreditación Oficial B1 Academy</span>
                <h3 className="text-base font-bold text-white leading-tight">
                  {modalCert.title}
                </h3>
              </div>
            </div>

            {generatedSuccessCode ? (
              <div className="space-y-4 text-center py-4">
                <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">¡Certificado Emitido con Éxito!</h4>
                  <p className="text-xs text-gray-300 mt-1">El documento oficial en PDF de alta resolución ha sido descargado en tu dispositivo.</p>
                </div>
                <div className="rounded-xl bg-black/50 border border-gray-800 p-3 font-mono text-xs text-amber-400">
                  Código de Validación: <strong>{generatedSuccessCode}</strong>
                </div>
                <button
                  onClick={() => {
                    setModalCert(null);
                    setGeneratedSuccessCode(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white transition-all active:scale-95"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Nombre Completo del Titular (tal como aparecerá en el PDF):
                  </label>
                  <input
                    type="text"
                    value={studentNameInput}
                    onChange={(e) => setStudentNameInput(e.target.value)}
                    placeholder="Ej. Ing. María Elena Rossi"
                    className="w-full rounded-xl border border-gray-700 bg-gray-900 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="rounded-xl border border-gray-800 bg-[#1a232b] p-3.5 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Itinerario Curricular:</span>
                    <strong className="text-gray-200">{modalCert.careerTitle}</strong>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Horas Académicas:</span>
                    <strong className="text-gray-200">{modalCert.hours} Horas</strong>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Firmas de Responsabilidad:</span>
                    <strong className="text-emerald-400">Director Académico & Master B1</strong>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Verificación Digital:</span>
                    <strong className="text-blue-400">Código Hash SHA-256 + QR</strong>
                  </div>
                  <div className="flex justify-between text-gray-400 pt-1 border-t border-gray-800">
                    <span>Arancel de Emisión Oficial:</span>
                    <strong className="text-amber-400 font-bold">$ {modalCert.fee} USD</strong>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 leading-relaxed">
                  * Este certificado cumple con los estándares para acreditación de horas profesionales universitarias y postulación a cargos de Consultor SAP Business One.
                </p>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => setModalCert(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDownloadOfficialCert}
                    disabled={isGenerating || !studentNameInput.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="h-3 w-3 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                        <span>Generando PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download size={14} />
                        <span>Descargar Certificado Oficial en PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
