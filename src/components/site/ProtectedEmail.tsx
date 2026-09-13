"use client";

import React from "react";

interface ProtectedEmailProps {
  user?: string;
  domain?: string;
  className?: string;
}

/**
 * Componente de Ciberseguridad Anti-Scraping.
 * Ofusca el correo dividiéndolo en spans y entidades HTML
 * para evitar la extracción automatizada por bots de spam.
 */
export function ProtectedEmail({
  user = "admisiones",
  domain = "sapacademy.es",
  className = "",
}: ProtectedEmailProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${user}@${domain}`;
  };

  return (
    <span
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title="Click para enviar correo"
      className={`inline-flex items-center cursor-pointer select-all font-medium transition-colors hover:text-sap-blue focus:outline-none focus:ring-2 focus:ring-sap-blue/50 rounded ${className}`}
    >
      <span>{user}</span>
      <span className="text-sap-blue dark:text-sky-400 font-bold px-0.5" aria-hidden="true">
        &#64;
      </span>
      <span>{domain}</span>
    </span>
  );
}
