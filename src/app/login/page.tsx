"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import {
  KeyRound,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  UserPlus,
  User,
} from "lucide-react";

import { validarCedula } from "@/lib/cedula";

type Tab = "login" | "register";

/** Destino interno seguro de `?next=` (evita redirecciones abiertas a otros dominios). */
function destinoSeguro(valor: string | null): string | null {
  if (!valor || !valor.startsWith("/") || valor.startsWith("//") || valor.startsWith("/login")) return null;
  return valor;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, register, resetPassword, userProfile, loading: authLoading } = useAuth();

  const [tab, setTab] = useState<Tab>("login");

  // `?next=` lo pone el servidor al proteger /mi-aula, /simulador, etc. Se lee en el cliente
  // (window) para no obligar a envolver la página en Suspense por useSearchParams.
  const [siguiente, setSiguiente] = useState<string | null>(null);
  useEffect(() => {
    setSiguiente(destinoSeguro(new URLSearchParams(window.location.search).get("next")));
  }, []);

  // Si el navegador ya tiene sesión de Firebase (la cookie del servidor solo había caducado),
  // AuthProvider la renueva y aquí se devuelve al estudiante a donde iba, sin pedir la clave otra vez.
  useEffect(() => {
    if (authLoading || !userProfile || !siguiente) return;
    router.replace(userProfile.passwordChanged === false ? "/change-password" : siguiente);
  }, [authLoading, userProfile, siguiente, router]);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotError, setForgotError] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCedula, setRegCedula] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regConsent, setRegConsent] = useState(false);
  const [politica, setPolitica] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Por favor completa tu correo y contrasena.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || "Credenciales invalidas.");
        setLoading(false);
        return;
      }
      if (res.passwordChanged === false) {
        setSuccessMsg("Bienvenido! Crea tu contrasena personal antes de continuar...");
        setTimeout(() => router.push("/change-password"), 800);
        return;
      }
      setSuccessMsg("Bienvenido! Redirigiendo...");
      setTimeout(() => {
        if (siguiente) {
          router.push(siguiente);
        } else if (res.role === "super" || res.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || "Error inesperado al iniciar sesion.");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    if (!regName || !regEmail || !regCedula) {
      setRegError("Nombre, correo y cédula son obligatorios.");
      return;
    }
    if (!regConsent) {
      setRegError("Debes aceptar los Términos y la Política de privacidad para crear tu cuenta.");
      return;
    }
    const errorCedula = validarCedula(regCedula);
    if (errorCedula) {
      setRegError(errorCedula);
      return;
    }
    setRegLoading(true);
    const res = await register({ name: regName, email: regEmail, cedula: regCedula, phone: regPhone });
    if (!res.success) {
      setRegLoading(false);
      setRegError(res.error || "Error al registrar. Intenta de nuevo.");
      return;
    }
    // Primer ingreso automático con la cédula; el login lleva a crear la clave personal.
    setRegSuccess("¡Cuenta creada! Ahora crea tu contraseña personal...");
    const ingreso = await login(regEmail, regCedula);
    setRegLoading(false);
    if (ingreso.success) {
      setTimeout(() => router.push(ingreso.passwordChanged === false ? "/change-password" : "/dashboard"), 700);
      return;
    }
    setRegSuccess("Cuenta creada. Inicia sesión con tu correo y tu cédula para crear tu contraseña personal.");
    setTab("login");
    setEmail(regEmail);
  };

    const handleForgotPassword = async () => {
    if (!email) {
      setForgotError('Por favor ingresa tu correo.');
      return;
    }
    setForgotError('');
    setForgotMsg('');
    try {
      const res = await resetPassword(email);
      if (res.success) {
        setForgotMsg('Correo de recuperación enviado.');
      } else {
        setForgotError(res.error || 'Error al enviar el correo.');
      }
    } catch (err: any) {
      setForgotError(err.message || 'Error inesperado.');
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setErrorMsg("");
    setSuccessMsg("");
    setRegError("");
    setRegSuccess("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-sap-blue/30 bg-sap-blue/5 text-xs font-bold text-sap-blue">
              <ShieldCheck className="w-3.5 h-3.5" /> Portal Oficial B1 Academy Ecuador
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              {tab === "login" ? "Iniciar Sesion" : "Registro Gratuito"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {tab === "login"
                ? "Accede a tu Aula Virtual, expediente academico o panel de administracion."
                : "Crea tu cuenta y comienza tu formacion SAP en B1 Academy hoy mismo."}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-2xl border border-slate-200 dark:border-white/10 p-1 bg-slate-100 dark:bg-white/[0.03] gap-1">
            <button
              onClick={() => switchTab("login")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === "login"
                  ? "bg-white dark:bg-sap-blue text-sap-blue dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Iniciar Sesion
            </button>
            <button
              onClick={() => switchTab("register")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === "register"
                  ? "bg-white dark:bg-sap-blue text-sap-blue dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Registro Gratuito
            </button>
          </div>

          {/* LOGIN FORM */}
          {tab === "login" && (
            <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-xl space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="login-email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Correo Electronico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@empresa.com"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="login-password" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Contrasena / Cedula
                    </label>
                    <span className="text-[11px] text-slate-400">
                      (Primer acceso: tu numero de cedula)
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contrasena o numero de cedula"
                      required
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue transition-colors"
                    />
                    <button
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
<div className="text-right">
  <button type="button" onClick={handleForgotPassword} className="text-sap-blue hover:underline text-xs mt-1">
    ¿Olvidaste tu contraseña?
  </button>
</div>
{forgotError && (
  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in">
    <AlertCircle className="w-4 h-4 shrink-0" />
    <span>{forgotError}</span>
  </div>
)}
{forgotMsg && (
  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in">
    <CheckCircle2 className="w-4 h-4 shrink-0" />
    <span>{forgotMsg}</span>
  </div>
)}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-sap-blue hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sap-blue/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Autenticando...</span>
                  ) : (
                    <>
                      <span>Entrar al Sistema</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-500">
                  No tienes cuenta?{" "}
                  <button
                    onClick={() => switchTab("register")}
                    className="text-sap-blue font-bold hover:underline cursor-pointer"
                  >
                    Registrate gratis
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* REGISTER FORM */}
          {tab === "register" && (
            <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-xl space-y-6">
              {/* Free badge */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <GraduationCap className="w-8 h-8 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Registro 100% Gratuito</p>
                  <p className="text-[11px] text-slate-500">Accede al track SAP Business One Core sin costo con una contraseña personal segura.</p>
                </div>
              </div>

              {regError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}
              {regSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="register-name" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-name"
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ej: Ing. Andrea Morales"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="register-email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Correo Electronico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="tucorreo@empresa.com"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="register-cedula" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Cédula o pasaporte * <span className="font-normal text-slate-400">(será tu clave del primer ingreso)</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-cedula"
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      value={regCedula}
                      onChange={(e) => setRegCedula(e.target.value.replace(/\s/g, ''))}
                      placeholder="Ej: 1712345678"
                      minLength={6}
                      maxLength={20}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="register-phone" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Telefono / WhatsApp <span className="font-normal text-slate-400">(opcional)</span>
                  </label>
                  <input
                    id="register-phone"
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0991234567"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue transition-colors"
                  />
                </div>

                {/* LOPDP: consentimiento expreso, informado y no premarcado para tratar nombre, correo y cédula. */}
                <label htmlFor="register-consent" className="flex items-start gap-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    id="register-consent"
                    type="checkbox"
                    checked={regConsent}
                    onChange={(e) => setRegConsent(e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 shrink-0 accent-emerald-500"
                  />
                  <span>
                    Acepto los{" "}
                    <button type="button" onClick={(e) => { e.preventDefault(); setPolitica("/terminos"); }} className="text-sap-blue underline">Términos y condiciones</button>{" "}
                    y autorizo el tratamiento de mis datos personales, incluida mi cédula, según la{" "}
                    <button type="button" onClick={(e) => { e.preventDefault(); setPolitica("/privacidad"); }} className="text-sap-blue underline">Política de privacidad</button>.
                  </span>
                </label>

                {politica && (
                  <div role="dialog" aria-modal="true" aria-label="Política" className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-3">
                    <div className="w-full max-w-3xl h-[85vh] rounded-2xl overflow-hidden bg-white dark:bg-[#0e1620] flex flex-col shadow-2xl">
                      <iframe src={politica} title="Política" className="flex-1 w-full border-0" />
                      <div className="p-3 flex gap-2 justify-end border-t border-slate-200 dark:border-white/10">
                        <button type="button" onClick={() => setPolitica(null)} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/20 text-xs font-bold active:scale-95">Cerrar</button>
                        <button type="button" onClick={() => { setRegConsent(true); setPolitica(null); }} className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold active:scale-95">He leído y acepto</button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={regLoading || !regConsent}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {regLoading ? (
                    <span>Creando cuenta...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Crear Cuenta Gratis</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-500">
                  Ya tienes cuenta?{" "}
                  <button
                    onClick={() => switchTab("login")}
                    className="text-sap-blue font-bold hover:underline cursor-pointer"
                  >
                    Inicia sesion
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
