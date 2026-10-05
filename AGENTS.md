# 🌐 SISTEMA GLOBAL DE AGENTES Y CALIDAD WEB A+ (Web Engineering & AI Search Framework)

Este ecosistema rige todos los proyectos web (EnergyEngine, Vermilion Routes, SofIA Tech, Nexo Talento, Modulares GM y nuevas aplicaciones). Garantiza que **cada desarrollo arranque en calificación A y culmine en A+ en Rendimiento, Accesibilidad, SEO Tradicional, Indexación por IA (GEO), Seguridad y Experiencia Visual**.

> **Fuente global obligatoria:** usar `C:\Users\pablo\OneDrive\Documentos\Obsidian Vault\Estructura proyectos web\KAI_ARCHITECTURE_MAP.md` como arquitectura maestra para proyectos actuales y futuros. **No usar** `C:\Users\pablo\OneDrive\Documentos\Obsidian Vault\.architecture.md` como referencia global; ese archivo pertenece solo a Baterías Maresa.

---

## 👥 Matriz de Agentes Especialistas y Subagentes

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        ORQUESTADOR GENERAL (Lead Web Director)                         │
└────────────────────────────────────────────────────────────────────────────────────────┘
          │                 │                 │                 │                 │
    ┌─────┴─────┐     ┌─────┴─────┐     ┌─────┴─────┐     ┌─────┴─────┐     ┌─────┴─────┐
    ▼           ▼     ▼           ▼     ▼           ▼     ▼           ▼     ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ AGENTE │ │ AGENTE │ │ AGENTE │ │ AGENTE │ │ AGENTE │ │ AGENTE │ │ AGENTE │ │ AGENTE │
│   01   │ │   02   │ │   03   │ │   04   │ │   05   │ │   06   │ │   07   │ │   08   │
│ ARCH   │ │  DEV   │ │ DESIGN │ │ CYBER  │ │  SEO   │ │  GEO   │ │   QA   │ │ CONV   │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

---

## 📋 Catálogo de Agentes Especialistas

### 1. 🏛️ Agente de Arquitectura & Calidad A+ (`01_architecture_quality_agent.md`)
- **Subagente Isolation Guard:** Blindaje estricto de fronteras (Sitio Público ≠ Admin ≠ Apps de Campo).
- **Subagente Clean SSR:** Byte-0 Server Components, cero duplicidad de `<head>` en Next.js App Router, cero skeletons que oculten contenido a crawlers.

### 2. 💻 Agente de Desarrollo & Ejecución Técnica (`02_development_agent.md`)
- **Subagente DOM Craftsman:** Semántica HTML5 nativa, cero `style={{}}` inline, Tailwind CSS modular.
- **Subagente Data Flow:** Formularios con validación Zod, contratos TypeScript y estado ligero.

### 3. 🎨 Agente de Diseño Luxury UI/UX (`04_luxury_ui_ux_agent.md`)
- **Subagente Luxury Tokens:** Estética cinematográfica (Apple) + precisión técnica (Stripe), contraste WCAG 2.2 AA (4.5:1), soporte dual Dark/Light.
- **Subagente Motion Feedback:** Micro-interacciones táctiles (`active:scale-95`), hover glow sutil, respeto estricto a `prefers-reduced-motion`.

### 4. 🛡️ Agente de Ciberseguridad & Confianza E-E-A-T (`05_cybersecurity_trust_agent.md`)
- **Subagente Scraper Defense:** Ofuscación obligatoria de correos y teléfonos contra bots extractores.
- **Subagente Headers Policy:** Cabeceras HTTP seguras; sensores restringidos en el sitio público pero **con cinto de seguridad para cámara y GPS en herramientas de campo (`/inspection`, `/admin`)**.

### 5. 🔍 Agente de Dominio SEO Tradicional (`03_growth_seo_geo_agent.md`)
- **Subagente Robots & Sitemap:** "Robox" (`robots.txt`) abierto a buscadores y bots de IA, y "Mapa" (`sitemap.xml`) 100% limpio (códigos 200 OK, sin redirects 301, sin páginas bloqueadas).
- **Subagente OnPage Silos:** Title Tag quirúrgico (50-60 chars), Meta Description (120-160 chars), único H1 transaccional (45-65 chars) y enlazado interno sin callejones sin salida.

### 6. 🤖 Agente de Ingestión por IA / GEO (`03_growth_seo_geo_agent.md`)
- **Subagente LLMs Feed:** Mantenimiento de `public/llms.txt` y Cápsulas de Respuesta Directa ("Direct Answer / Key Takeaways") en los primeros 1,000 caracteres de DOM.
- **Subagente Schema Graph:** Inyección de JSON-LD en Server Components (`Organization`, `Service`, `FAQPage`, `Person` con credenciales reales).

### 7. 🧪 Agente de QA, Web Vitals & Gatekeeper (`06_qa_testing_gatekeeper_agent.md`)
- **Subagente Web Vitals:** Auditoría de Lighthouse 100x4, imágenes WebP con dimensiones explícitas (CLS=0), scripts de analítica con `strategy="lazyOnload"` (TBT=0).
- **Subagente Git Sentinel:** Verificación de compilación local (`npm run build` con salida 0). **PROHIBIDO hacer `git push` sin autorización explícita del usuario**.

---

## 🎯 Protocolo de Inicio (Comenzar con A)

Toda nueva página, ruta o componente debe nacer cumpliendo:
1. **Title Tag:** 50-60 caracteres exactos.
2. **Meta Description:** 120-160 caracteres con intención clara.
3. **Jerarquía H1-H3:** 1 solo `<h1>` (45-65 chars) con enfoque transaccional.
4. **Cápsula GEO:** Resumen ejecutivo `<aside>` en el primer kilobyte de HTML.
5. **Schema JSON-LD:** Inyectado en Server Component.
6. **Imágenes:** WebP con `width` y `height` obligatorios.
7. **Estilos:** Cero `style=""` — solo clases atómicas de Tailwind CSS.
8. **Privacidad:** Correos ofuscados en entidades HTML.
9. **Sensores:** Comprobar que `/inspection` y `/admin` mantengan acceso libre a cámara/GPS.

---

## 📊 Scorecard de Salida Obligatorio (Llegar al A+)

Al finalizar cualquier entrega, se presentará el scorecard de diagnóstico:

```markdown
### 📋 Scorecard de Calidad A+
- [x] Arquitectura & Aislamiento: Sin intrusiones entre módulos, Server Components Byte 0
- [x] Title Tag: 50-60 caracteres (Actual: XX chars)
- [x] Meta Description: 120-160 caracteres (Actual: XX chars)
- [x] SEO On-Page: 1 solo <h1> (Actual: XX chars), cross-linking activo
- [x] "El Robox & El Mapa": robots.txt abierto a IAs + sitemap.xml 100% código 200 OK
- [x] GEO & LLMs: llms.txt actualizado + Cápsula de Respuesta Directa en byte 0 + JSON-LD Schema
- [x] Diseño & UX: Estética premium, WCAG 2.2 AA contraste, feedback táctil active:scale-95
- [x] Ciberseguridad: Correos ofuscados + Permissions-Policy seguro (sensores operativos intactos)
- [x] Core Web Vitals: Cero estilos inline + WebP con dimensiones + analítica lazyOnload (TBT=0)
- [x] Pre-Flight Build: npm run build superado exitosamente (exit code 0)
- [x] Regla de Oro Git: Cambios verificados localmente, esperando autorización para git push
- [x] Estado de Calificación Estimada: A+
```
