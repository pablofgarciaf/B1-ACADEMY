"use client";

import React, { useState } from "react";
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

type Tab = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const { login, createStudent, resetPassword } = useAuth();

  const [tab, setTab] = useState<Tab>("login");

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
        if (res.role === "super" || res.role === "admin") {
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
      setRegError("Nombre, correo y cedula son obligatorios.");
      return;
    }
    if (regCedula.length < 8) {
      setRegError("La cedula debe tener al menos 8 digitos.");
      return;
    }
    setRegLoading(true);
    const res = await createStudent({
      name: regName,
      email: regEmail,
      cedula: regCedula,
      phone: regPhone,
      role: "estudiante",
      assignedTracks: ["sap-b1-core"],
    });
    setRegLoading(false);
    if (!res.success) {
      setRegError(res.error || "Error al registrar. Intenta de nuevo.");
      return;
    }
    setRegSuccess(
      "Cuenta creada con exito. Tu contrasena inicial es tu numero de cedula. Inicia sesion para continuar."
    );
    setTimeout(() => {
      setTab("login");
      setEmail(regEmail);
      setRegName("");
      setRegEmail("");
      setRegCedula("");
      setRegPhone("");
      setRegSuccess("");
    }, 3000);
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Correo Electronico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
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
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Contrasena / Cedula
                    </label>
                    <span className="text-[11px] text-slate-400">
                      (Primer acceso: tu numero de cedula)
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contrasena o numero de cedula"
                      required
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue transition-colors"
                    />
                    <button
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
                  <p className="text-[11px] text-slate-500">Accede al track SAP Business One Core sin costo. Tu contrasena inicial es tu cedula.</p>
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Correo Electronico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Cedula / Pasaporte * <span className="font-normal text-slate-400">(sera tu contrasena inicial)</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regCedula}
                      onChange={(e) => setRegCedula(e.target.value)}
                      placeholder="Ej: 1718293849"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Telefono / WhatsApp <span className="font-normal text-slate-400">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0991234567"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
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
