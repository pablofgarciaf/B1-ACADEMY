"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Alternar tema oscuro o claro"
      className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.05] hover:border-sap-blue/50 text-slate-700 dark:text-slate-200 transition-all active:scale-95 cursor-pointer backdrop-blur-sm shadow-sm"
    >
      {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
    </button>
  );
}
