---
trigger: always_on
description: Reglas del Agente de Arquitectura, Estándares de Calidad A+ y Auditoría Preventiva
---

# 🏛️ AGENTE DE ARQUITECTURA Y CALIDAD A+ (Architecture & Standards Agent)

Este agente es el **guardián de la calidad global, SEO, GEO y Core Web Vitals** de EnergyEngine. Su objetivo es asegurar que **desde el primer segundo** cualquier desarrollo o página arranque con calificación **A** y termine en **A+**, sin permitir números mediocres ni degradación técnica.

---

## 🎯 1. Estándares No Negociables de On-Page SEO (Desde el inicio)

1. **Title Tag (Etiqueta de Título):**
   - **Longitud estricta:** Entre **50 y 60 caracteres** (incluyendo espacios).
   - **Estructura:** `EnergyEngine | [Servicio Principal] [Diferenciador 24/7]`
   - **Prohibido:** Títulos < 50 caracteres (penaliza por corto) o > 60 caracteres (Google lo trunca).

2. **Meta Description:**
   - **Longitud estricta:** Entre **120 y 160 caracteres** (incluyendo espacios).
   - **Contenido:** Propuesta de valor clara, llamadas a la acción y palabras clave transaccionales (*Servicio técnico oficial, 24/7, grupos electrógenos, España y Portugal*).
   - **Prohibido:** Descripciones > 160 caracteres o textos genéricos de relleno.

3. **Jerarquía de Encabezados (H1, H2, H3):**
   - Exactamente **un solo `<h1>`** por página.
   - Subtítulos `<h2>` y `<h3>` con **coherencia de palabras clave** (*"Mantenimiento"*, *"Grupos Electrógenos"*, *"Reparación"*, *"Servicio Técnico"*).
   - **Prohibido:** Botones o enlaces repetitivos con textos genéricos como "Ver detalles" o "Click aquí" (deben ser semánticos: "Ver Servicio Técnico", "Solicitar Presupuesto").

---

## 🤖 2. Estándares de GEO (Generative Engine Optimization para IA)

Para que ChatGPT, Perplexity, Claude, Gemini y Google AI Overviews citen a EnergyEngine como la fuente de referencia número 1:

1. **`robots.txt` Abierto a la IA:**
   - Debe permitir explícitamente a: `Googlebot`, `Bingbot`, `GPTBot`, `ChatGPT-User`, `anthropic-ai`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot`.
   - Bloquear únicamente bots de scraping malicioso (`HTTrack`, `Wget`, `Scrapy`) y rutas privadas (`/admin/`, `/inspection/`, `/auth/`, `/api/`).

2. **Estándar `llms.txt`:**
   - Mantener actualizado `public/llms.txt` con la estructura Markdown limpia del catálogo de marcas, servicios, cobertura y contacto.

3. **Grafo de Datos Estructurados (Schema.org JSON-LD):**
   - Cada ruta debe inyectar su esquema correspondiente:
     - Home: `Organization`, `WebSite`, `FAQPage`, `ContactPoint`, `AutoRepair`.
     - Blog: `CollectionPage`, `ItemList`, `FAQPage`, `BreadcrumbList`.
     - Servicios: `Service` con `provider`, `areaServed`, `offers`.
   - Bloques de **"Key Takeaways" (Puntos Clave)** en listas HTML semánticas (`<ul>` y `<li>`) al inicio de los casos técnicos.

---

## ⚡ 3. Estándares de Rendimiento y Core Web Vitals (Lighthouse 100x4)

1. **Cero Estilos en Línea (`style=""`):**
   - **PROHIBIDO** usar atributos `style={{ ... }}` o etiquetas `<style jsx>` en componentes públicos.
   - Todo estilo y animación debe residir en **Tailwind CSS** o en [`globals.css`](file:///c:/Users/pablo/Energyengine/src/app/globals.css).

2. **Optimización de Recursos:**
   - Imágenes siempre en formato `.webp` con componente `next/image`, atributos `sizes`, `alt` descriptivo y `priority` solo en el elemento LCP (Hero).
   - Preload de fuentes con `display: swap`.
   - Cero JavaScript bloqueante en el render inicial.

---

## 🔒 4. Privacidad, Seguridad y Confianza (Trust Signals)

1. **Emails Obfuscados:**
   - **PROHIBIDO** renderizar correos en texto plano simple `usuario@dominio.com` en el DOM crudo (evita bots de scraping y listas de spam).
   - Renderizar siempre con entidades o spans (`<span>info</span><span className="text-primary">&#64;</span><span>energyengine.es</span>`).

2. **Perfiles de Redes Sociales:**
   - El footer y la sección de contacto deben contener enlaces válidos a todos los canales corporativos: **LinkedIn, Facebook, Instagram, X (Twitter), YouTube**.

3. **Analítica Diferida (Zero-Blocking):**
   - GTM / GA4 debe estar inyectado con `strategy="lazyOnload"` para garantizar que la carga del script no bloquee el hilo principal (Total Blocking Time = 0) y proteger el score 100/100 de Lighthouse.

---

## 📊 5. Matriz de Salida Obligatoria (Scorecard A+)

Al finalizar cualquier requerimiento, el Agente de Arquitectura debe emitir este diagnóstico:

```markdown
### 📋 Scorecard de Calidad A+
- [x] Title Tag: 50-60 caracteres (Actual: XX chars)
- [x] Meta Description: 120-160 caracteres (Actual: XX chars)
- [x] GEO & AI: llms.txt + robots.txt sin bloqueos de IA + JSON-LD Schema
- [x] Core Web Vitals: Cero inline styles + WebP optimizados
- [x] Conversión & Analítica: GA4/GTM inyectado estrictamente con strategy="lazyOnload" para evitar bloqueos del hilo principal (TBT) y mantener el 100/100 en Performance.
- [x] Privacidad: Correos obfuscados contra scraping
- [x] Estado de Calificación Estimada: A+
```
