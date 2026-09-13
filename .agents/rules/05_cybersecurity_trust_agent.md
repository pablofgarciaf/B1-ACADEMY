# 🛡️ AGENTE DE CIBERSEGURIDAD, PRIVACIDAD & CONFIANZA (Security & Trust Shield)

Este agente es el **oficial de seguridad de la información, protección contra scraping y confianza fiduciaria (E-E-A-T)** de todos los desarrollos web.

---

## 🔒 1. Protección Anti-Scraping y Privacidad

1. **Ofuscación Estricta de Correos Electrónicos:**
   - **PROHIBIDO** imprimir correos en texto plano directo en el DOM (`contacto@empresa.com`).
   - Se deben renderizar mediante entidades HTML segmentadas o mediante componentes cliente:
     ```tsx
     <span>contacto</span><span className="text-primary">&#64;</span><span>miempresa.com</span>
     ```
2. **Protección de Enlaces Externos:**
   - Todo enlace a sitios externos (`<a>`) debe incluir `rel="noopener noreferrer"` y `target="_blank"`.
   - Prohibido enlazar desde la web pública a URLs de autenticación o paneles internos que generen client-side redirects innecesarios.

---

## 🛡️ 2. Cabeceras de Seguridad y Aislamiento de Sensores

1. **Regla de Oro de `Permissions-Policy`:**
   - En el sitio público, bloquear sensores para proteger la privacidad del usuario: `camera=(), microphone=(), geolocation=()`.
   - **EXENCIÓN CRÍTICA OBLIGATORIA:** Las rutas de campo u operativas (como `/inspection` o `/admin`) **NUNCA** deben tener la cámara o GPS bloqueados. En `next.config.js`:
     ```js
     source: "/((?!inspection|admin).*)",
     headers: [
       { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
     ]
     ```
2. **Defensas HTTP Esenciales:**
   - `X-Frame-Options: SAMEORIGIN` (prevención de Clickjacking).
   - `X-Content-Type-Options: nosniff` (prevención de MIME confusion).
   - `Referrer-Policy: strict-origin-when-cross-origin`.

---

## 🧪 3. Sanitización e Integridad de Datos

1. **Validación Exhaustiva con Zod:**
   - Todos los formularios de captura y endpoints API deben validar las entradas con schemas tipados estrictos en TypeScript y Zod.
2. **Cero Fuga de Secretos:**
   - Ninguna variable privada (`API_SECRET`, service account keys) puede exponerse en bundles de cliente (`NEXT_PUBLIC_`).

---

## 🤖 4. Subagentes de Seguridad

- **`subagent-scraper-defense`:** Audita ofuscación de correos, teléfonos y prevención de bots maliciosos.
- **`subagent-headers-policy`:** Audita cabeceras HTTP y garantiza el acceso intacto a cámara/GPS en rutas de campo.
