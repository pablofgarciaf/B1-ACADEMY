# 🏗️ ARQUITECTURE - B1 Academy

Documento integral de la arquitectura del sistema: stack tecnológico, estructura, componentes, autenticación, flujos de datos y consideraciones operacionales.

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Autenticación y Roles](#autenticación-y-roles)
5. [Componentes Principales](#componentes-principales)
6. [Rutas y Páginas](#rutas-y-páginas)
7. [Servicios y Librerías](#servicios-y-librerías)
8. [Flujos de Datos](#flujos-de-datos)
9. [Base de Datos (Firestore)](#base-de-datos-firestore)
10. [APIs y Webhooks](#apis-y-webhooks)
11. [Seguridad](#seguridad)
12. [Consideraciones de Deployment](#consideraciones-de-deployment)

---

## Resumen Ejecutivo

**B1 Academy** es una plataforma educativa web (SaaS) para capacitación profesional en **SAP Business One, Nómina HCM y Localización SRI Ecuador**. Combina:

- **LMS (Learning Management System):** Cursos estructurados, módulos interactivos, simuladores, videos.
- **Portal de Empleabilidad:** Bolsa de empleo, perfiles de consultores, conexión empresa-profesional.
- **Dashboard Alumno:** Avance de cursos, calificaciones, certificados, expediente digital.
- **Panel Admin:** Gestión de usuarios, cursos, evaluaciones, reportes.

**Público objetivo:**
- Estudiantes (roles: `estudiante`, `docente`)
- Administradores (roles: `admin`, `super`)
- Consultores certificados (rol: `consultor_premium`)

**Modo operación:**
- Esencialmente **online**, con acceso a sandbox (entorno de pruebas SAP B1).
- Autenticación por email/contraseña (Firebase Auth).
- Roles y permisos granulares guardados en Firestore.

---

## Stack Tecnológico

| Categoría | Tecnología | Versión | Función |
|-----------|-----------|---------|---------|
| **Frontend** | React | 19.0.0 | UI, componentes interactivos |
| | Next.js App Router | 15.2.0 | SSR, rutas, optimización |
| | TypeScript | 5.9.3 | Tipado estático |
| | Tailwind CSS | 3.4.17 | Estilos atómicos, dark mode |
| **Autenticación** | Firebase Auth | 11.4.0 | Login, sesión, recuperación de contraseña |
| **Base de Datos** | Firestore | (integrado Firebase) | NoSQL, documentos JSON, colecciones |
| **Extras** | jsPDF | 4.2.1 | Generación de certificados/reportes PDF |
| | Lucide React | 0.475.0 | Iconos SVG |
| | React Markdown | 10.1.0 | Renderizado de contenido `.md` |
| | Zod | 3.24.2 | Validación de esquemas TypeScript |
| **Integración** | n8n Webhooks | (configurado) | Automatización, sincronización externa |

### Arquitectura en Capas

```
┌─────────────────────────────────────────┐
│         Next.js App Router (SSR)        │
├─────────────────────────────────────────┤
│    React Components (Client)            │
│  - Pages (src/app)                      │
│  - Components (src/components)          │
│  - Context API (AuthContext)            │
├─────────────────────────────────────────┤
│    Services & Libraries                 │
│  - Firebase Auth                        │
│  - Firestore SDK                        │
│  - student-service.ts                   │
│  - courses-data.ts                      │
├─────────────────────────────────────────┤
│    External APIs                        │
│  - Firebase (Auth + Firestore)          │
│  - n8n (Webhooks)                       │
└─────────────────────────────────────────┘
```

---

## Estructura de Carpetas

```
sap-academy/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                 # Home (landing)
│   │   ├── layout.tsx               # Root layout + providers
│   │   ├── login/page.tsx           # Autenticación
│   │   ├── dashboard/               # Área privada alumno
│   │   │   ├── page.tsx             # Dashboard principal
│   │   │   └── calificaciones/      # Historial de notas
│   │   ├── capacitacion/            # Catálogo de cursos
│   │   │   ├── page.tsx             # Listado de cursos (5 tracks)
│   │   │   └── [moduloId]/page.tsx  # Detalle + módulos interactivos
│   │   ├── mi-aula/                 # Aula virtual (módulos markdown)
│   │   │   ├── page.tsx             # Listado módulos
│   │   │   └── [moduloId]/page.tsx  # Contenido módulo
│   │   ├── manuales/                # Repositorio documental (83 manuales)
│   │   ├── bolsa-empleo/            # Job board
│   │   ├── talento/                 # Portal de consultores
│   │   ├── admin/                   # Panel administrativo
│   │   ├── cambiar-contraseña/      # Cambio de password
│   │   ├── blog/                    # Blog/news
│   │   ├── api/                     # Rutas API
│   │   │   └── webhooks/n8n/route.ts# Webhook n8n
│   │   ├── robots.ts                # SEO: robots.txt dinámico
│   │   ├── sitemap.ts               # SEO: sitemap.xml dinámico
│   │   └── not-found.tsx            # Página 404
│   │
│   ├── components/                  # Componentes React reutilizables
│   │   ├── site/                    # Componentes del sitio (globales)
│   │   │   ├── Navbar.tsx           # Navegación top + branding
│   │   │   ├── Footer.tsx           # Pie de página
│   │   │   ├── JsonLd.tsx           # Schema JSON-LD (SEO)
│   │   │   ├── ThemeProvider.tsx    # Dark/Light mode
│   │   │   ├── ProtectedEmail.tsx   # Ofuscación de emails (contra scrapers)
│   │   │   └── ThemeToggle.tsx      # Switch tema
│   │   │
│   │   ├── lms/                     # Learning Management System
│   │   │   ├── MarkdownRenderer.tsx # Renderizador de contenido .md
│   │   │   ├── ModuleSidebar.tsx    # Navegación lateral módulos
│   │   │   ├── VideoPlayer.tsx      # Reproductor video + metadata
│   │   │   ├── EvaluationQuiz.tsx   # Quiz de evaluación
│   │   │   ├── QuickCheckQuiz.tsx   # Quiz rápido
│   │   │   ├── InteractiveSimulator.tsx # Simulador SAP B1 / Nómina
│   │   │   ├── VisualScreenSimulator.tsx# Mockup GUI SAP
│   │   │   └── LessonNavigator.tsx  # Navegación lecciones
│   │   │
│   │   ├── auth/                    # Componentes de autenticación
│   │   │   └── AuthModal.tsx        # Modal de login
│   │   │
│   │   └── ecosystem/               # Componentes de empleabilidad
│   │       └── JobApplicationModal.tsx # Modal de aplicación a empleo
│   │
│   ├── context/                     # Context API (estado global)
│   │   └── AuthContext.tsx          # Proveedor de autenticación + sesión
│   │
│   ├── lib/                         # Funciones, configuración, datos
│   │   ├── firebase.ts              # Inicialización Firebase (Auth + DB)
│   │   ├── auth-context.tsx         # Versión alternativa contexto auth
│   │   ├── courses-data.ts          # Array de cursos (5 tracks)
│   │   ├── student-service.ts       # Servicios de estudiante (CRUD)
│   │   ├── manuals-83-data.ts       # 83 manuales (F, G, H bloques)
│   │   ├── module-simulations-data.ts # Simulaciones interactivas
│   │   ├── quizzes-data.ts          # Base de preguntas evaluaciones
│   │   ├── submodules-content.ts    # Contenido detallado submódulos
│   │   ├── modules-data.ts          # Estructura módulos aula virtual
│   │   └── types/
│   │       ├── courses.ts           # Tipos: Course, TrackCode, etc.
│   │       └── student.ts           # Tipos: UserProfile, StudentRecord
│   │
│   ├── globals.css                  # Estilos globales + Tailwind
│   └── favicon.ico                  # Favicon
│
├── public/                          # Archivos estáticos
│   ├── logo.webp                    # Logo B1 Academy (light)
│   ├── logo_dark.webp               # Logo B1 Academy (dark)
│   ├── llms.txt                     # Feed para LLMs (IA search)
│   ├── llms-full.txt                # Feed extendido para LLMs
│   ├── Capacitacion SAP/            # PDFs + imágenes contenido
│   ├── Capacitacion_SAP_Todos_Los_Markdowns/ # Archivos .md conocimiento
│   ├── modulos/                     # Módulos markdown aula virtual
│   ├── Manual_Maestro_Consolidado_SAP_Business_One_10.md
│   ├── Planificacion Capacitacion SAP 2025.xlsx
│   └── (otros assets)
│
├── .claude/                         # Configuración Claude Code
│   ├── launch.json                  # Dev server (next dev)
│   └── settings.json                # (si aplica)
│
├── .next/                           # Build output de Next.js
├── node_modules/                    # Dependencias npm
│
├── .gitignore                       # Git ignore
├── .env.local                       # Secretos locales (Firebase keys, etc)
├── .env                             # Env vars públicas (si aplica)
├── next.config.mjs                  # Configuración Next.js
├── tailwind.config.ts               # Configuración Tailwind
├── tsconfig.json                    # Configuración TypeScript
├── postcss.config.js                # Configuración PostCSS (Tailwind)
├── package.json                     # Dependencias + scripts
├── package-lock.json                # Lock file npm
│
├── AGENTS.md                        # Sistema de agentes especialistas (A+)
├── ARQUITECTURE.md                  # Este archivo
└── README.md                        # (si existe)
```

---

## Autenticación y Roles

### Sistema de Roles

Firebase Auth (email/password) + Firestore profiles:

```
┌─────────────────────────────────────────────────────────────┐
│                      ROLES EN LA PLATAFORMA                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  'super'               → Superadministrador (1 usuario)    │
│    - UID: pablofgarciaf@gmail.com                          │
│    - Acceso total: usuarios, cursos, sandbox, admin panel  │
│    - Master bypass: acceso sin validación si Firebase cae  │
│                                                             │
│  'admin'               → Administrador de institución      │
│    - Gestión de usuarios (crear, activar, suspender)      │
│    - Creación y edición de cursos                          │
│    - Acceso a reportes y analítica                         │
│    - Panel admin (/admin)                                  │
│                                                             │
│  'docente'             → Instructor/Profesor               │
│    - Crear contenido (módulos, simulaciones)              │
│    - Calificar evaluaciones                               │
│    - Acceso a dashboard estudiantes                       │
│                                                             │
│  'estudiante'          → Alumno (mayoría)                  │
│    - Acceso a cursos asignados (tracks)                   │
│    - Enviar evaluaciones                                  │
│    - Ver calificaciones                                   │
│    - Perfil de talento                                    │
│    - Sandbox limitado (horas)                             │
│                                                             │
│  'consultor_premium'   → Consultor certificado            │
│    - Estudiante + perfil público en bolsa talento         │
│    - Horas sandbox extendidas                             │
│    - Certificados destacados                              │
│                                                             │
│  'regular'             → Usuario anónimo/sin asignar      │
│    - Acceso público (landing, blog, bolsa empleo browse) │
│    - No accede a contenido privado                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Autenticación

```
1. Usuario abre /login
   ↓
2. Escribe email + password
   ↓
3. Firebase Auth valida credenciales
   ↓
4. Si válido → AuthContext obtiene perfil de Firestore
   ↓
5. localStorage guarda sesión de respaldo (JSON)
   ↓
6. Redirige según rol:
   - super/admin → /admin
   - docente/estudiante → /dashboard
   - regular → /capacitacion
   ↓
7. AuthProvider inicia onAuthStateChanged() listener permanente
   ↓
8. Si session expira: logout automático → /login
```

### Almacenamiento de Perfil

```firestore
usuarios/
  └── {email}/
      ├── uid: string
      ├── email: string
      ├── name: string
      ├── displayName: string
      ├── cedula: string
      ├── role: 'super' | 'admin' | 'docente' | 'estudiante' | 'consultor_premium' | 'regular'
      ├── status: 'active' | 'suspended'
      ├── assignedTracks: string[] // ['sap-b1-core', 'sap-loc-ec', 'heinsohn-nomina', ...]
      ├── createdAt: ISO string
      ├── updatedAt: ISO string
      ├── passwordChanged: boolean
      ├── sandboxHoursUsed: number
      ├── sandboxHoursLimit: number
      ├── phone: string (opcional)
      └── bio: string (opcional)
```

---

## Componentes Principales

### 1. **Navbar** (`src/components/site/Navbar.tsx`)
- Logo B1 Academy + "SAP BUSINESS ONE"
- Navegación: Explorar Tracks, Manuales, Mi Aula, Bolsa Empleo, Ecosistema
- Botones: Iniciar Sesión, Ingresar a Mi Aula
- Responsive: menú hamburguesa en mobile
- Dark/Light toggle

### 2. **Footer** (`src/components/site/Footer.tsx`)
- Logo + descripción institución
- 4 columnas: tracks, plataforma, empleabilidad, admisiones
- Email protegido (ofuscado contra scrapers)
- Links internos + meta info

### 3. **AuthContext** (`src/context/AuthContext.tsx`)
**Responsabilidades:**
- Escuchar cambios en Firebase Auth (`onAuthStateChanged`)
- Traer perfil Firestore al cambiar user
- Guardar sesión en localStorage (fallback offline)
- Métodos: `login()`, `logout()`, `createStudent()`, `changePassword()`, `resetPassword()`
- Proveedor global para toda la app

### 4. **Dashboard** (`src/app/dashboard/page.tsx`)
**Para estudiantes/docentes:**
- Resumen progreso cursos (barras)
- Próximos eventos/evaluaciones
- Acceso rápido a módulos en progreso
- Enlace a Calificaciones
- Botón "Ingresar a Aula" → /mi-aula

### 5. **Capacitación** (`src/app/capacitacion/`)

**`page.tsx` (Listado de cursos):**
- 5 tracks principales (SAP B1, SRI, Nómina, Gestión Humana, Verticales)
- Tarjetas por curso: descripción, badge, instructor, botón "Ver módulos"
- Filtros/búsqueda

**`[moduloId]/page.tsx` (Detalle del curso):**
- Hero con nombre, descripción, requisitos
- Sidebar izquierdo: lista de módulos (lecciones)
- Área central: video + contenido markdown (MarkdownRenderer)
- Simulador SAP B1 o Nómina HCM (si aplica)
- Evaluación (QuickCheckQuiz o EvaluationQuiz)
- Navegación: siguiente/anterior módulo

### 6. **Mi Aula** (`src/app/mi-aula/`)
**Aula Virtual con módulos Markdown:**
- `/mi-aula`: Listado de módulos disponibles (por track asignado)
- `/mi-aula/[moduloId]`: Renderiza contenido `.md` de `public/modulos/`
- ModuleSidebar: índice navegable
- MarkdownRenderer: convierte markdown a HTML (con GFM, raw HTML, etc.)

### 7. **Manuales** (`src/app/manuales/page.tsx`)
- 83 manuales descargables (bloques F, G, H)
- Busca en `src/lib/manuals-83-data.ts`
- Cada manual es un objeto con:
  - `id`, `title`, `blockTitle`, `description`
  - Link descarga PDF
  - Bloque (F, G, H) → asocia a track

### 8. **Bolsa de Empleo** (`src/app/bolsa-empleo/`)
- Job board: lista de vacantes
- Filtros por track/nivel
- Click en oferta → JobApplicationModal
- Aplicación guarda en Firestore (aplicaciones)

### 9. **Portal Talento** (`src/app/talento/`)
- Listado de consultores certificados (rol `consultor_premium`)
- Filtros por especialidad (tracks)
- Click en perfil → detalles, certificaciones, contacto
- Para empresas: buscar consultores

### 10. **Panel Admin** (`src/app/admin/`)
**Acceso: super, admin**
- CRUD usuarios (crear estudiante, cambiar rol, suspender)
- CRUD cursos/módulos
- Evaluaciones pendientes por calificar
- Reportes: inscripciones, avance, sandbox usage
- Exportar datos

---

## Rutas y Páginas

| Ruta | Componente | Acceso | Función |
|------|-----------|--------|---------|
| `/` | `page.tsx` | Público | Landing page (hero + tracks + CTA) |
| `/login` | `login/page.tsx` | Público | Formulario autenticación |
| `/dashboard` | `dashboard/page.tsx` | Autenticado | Resumen alumno + progreso |
| `/dashboard/calificaciones` | `dashboard/calificaciones/page.tsx` | Autenticado | Historial de notas |
| `/capacitacion` | `capacitacion/page.tsx` | Autenticado | Listado 5 tracks |
| `/capacitacion/[moduloId]` | `capacitacion/[moduloId]/page.tsx` | Autenticado | Detalle curso + simulador + quiz |
| `/mi-aula` | `mi-aula/page.tsx` | Autenticado | Módulos markdown aula virtual |
| `/mi-aula/[moduloId]` | `mi-aula/[moduloId]/page.tsx` | Autenticado | Contenido markdown |
| `/manuales` | `manuales/page.tsx` | Autenticado | 83 manuales (bloques F, G, H) |
| `/bolsa-empleo` | `bolsa-empleo/page.tsx` | Autenticado | Job board + aplicaciones |
| `/talento` | `talento/page.tsx` | Autenticado/Semi | Perfiles consultores |
| `/empresas` | `empresas/page.tsx` | Semi | Portal para empresas contratantes |
| `/consultores` | `consultores/page.tsx` | Semi | Directorio consultores |
| `/blog` | `blog/page.tsx` | Público | Artículos/news |
| `/cambiar-contraseña` | `change-password/page.tsx` | Autenticado | Cambio password post-login |
| `/admin` | `admin/page.tsx` | Admin/Super | Panel administrativo |
| `/api/webhooks/n8n` | `api/webhooks/n8n/route.ts` | Internal | Webhook entrante de n8n |
| `/robots.txt` | `robots.ts` | Público | SEO: robots dinámico (abre a LLMs) |
| `/sitemap.xml` | `sitemap.ts` | Público | SEO: sitemap dinámico |
| `/*` | `not-found.tsx` | Público | Página 404 |

---

## Servicios y Librerías

### `lib/firebase.ts`
```typescript
// Inicializa Firebase SDK
export const auth = initializeAuth(...)
export const db = getFirestore(...)
// Exporta instancias para usar en contextos/servicios
```

### `lib/student-service.ts`
**CRUD de estudiantes:**
- `getStudent(email: string)` → UserProfile
- `getAllStudents()` → UserProfile[]
- `createStudent(data)` → boolean
- `updateStudent(email, data)` → boolean
- `deleteStudent(email)` → boolean
- `getSampleCandidates()` → Array de consultores demo
- `mapCourseToTalento()` → Mapeo curso → perfil talento

### `lib/courses-data.ts`
**Array de 5 cursos (tracks):**
```typescript
export const courses = [
  {
    id: 'sap-b1-core',
    code: 'SAP-B1-CORE',
    title: 'SAP B1 Core & Finanzas NIIF',
    shortTitle: 'SAP B1 & NIIF',
    category: 'ERP',
    badge: 'NIIF + SAP + RFC',
    description: '...',
    instructor: 'Ing. Consultor Senior...',
    duration: '40 horas',
    modules: [ ... ]
  },
  // ... + 4 tracks más (SRI, Nómina, Gestión Humana, Verticales)
]
```

### `lib/courses-data.ts` - Módulos
**Cada curso contiene array `modules`:**
```typescript
modules: [
  {
    id: 'mod-001',
    title: 'Fundamentos SAP B1',
    description: '...',
    video: 'url_video',
    duration: '45 min',
    content: 'markdown_o_html',
    simulation?: { type: 'SAP_B1', scenario: '...' },
    quiz?: { questions: [...] }
  }
]
```

### `lib/manuals-83-data.ts`
**83 manuales estructurados:**
- Bloques F, G, H (Nómina HCM + Gestión Humana)
- Cada manual: `id`, `title`, `blockTitle`, `description`, `pdfUrl`, `imageUrl`

### `lib/module-simulations-data.ts`
**Simulaciones interactivas:**
- Ejercicios con paso a paso
- Preguntas + soluciones
- Conecta con VisualScreenSimulator (mockup GUI)
- ~2500+ líneas de contenido simulaciones

### `lib/submodules-content.ts`
**Contenido detallado por track:**
- Tracks, submódulos, lecturas técnicas
- Describe funcionalidad, fórmulas, flujos SAP/Nómina
- ~400+ líneas de especificaciones

### `lib/quizzes-data.ts`
**Base de preguntas por track:**
```typescript
export const quizzes = {
  'SAP-B1-CORE': [...questions],
  'SAP-LOC-EC': [...questions],
  'HEIN-NOM-EC': [...questions],
  // ...
}
```

### `components/lms/MarkdownRenderer.tsx`
**Renderiza markdown a HTML:**
- Plugins: remark-gfm (tablas, strikethrough, etc.)
- rehype-raw (HTML crudo dentro markdown)
- Integración con Tailwind para estilos

### `components/lms/VisualScreenSimulator.tsx`
**Mockup visual de GUI SAP B1 / Nómina HCM:**
- Simula ventanas de escritorio
- Menús, inputs, botones
- Interactivo: click → siguiente paso

### `components/lms/EvaluationQuiz.tsx`
**Quiz de evaluación formal (grading):**
- Múltiple choice + respuesta libre
- Valida respuestas
- Guarda en Firestore (student_evaluations)
- Calificación automática o manual (docente)

### `types/courses.ts`
```typescript
export type TrackCode = 'SAP-B1-CORE' | 'SAP-LOC-EC' | 'HEIN-NOM-EC' | 'HEIN-HCM-TALENT' | 'VERT-EXPORT-EC'
export interface Course { ... }
export interface Module { ... }
```

### `types/student.ts`
```typescript
export interface StudentRecord {
  id: string
  email: string
  name: string
  specialties: string[] // track codes
  certifications: Certification[]
  enrolledCourses: EnrolledCourse[]
  evaluationScores: Record<string, number>
  // ...
}
```

---

## Flujos de Datos

### 1. **Flujo de Autenticación**
```
Usuario → /login
  ↓
Escribe email + password
  ↓
signInWithEmailAndPassword(auth, email, password)
  ↓
Firebase Auth valida
  ↓
SI válido:
  - Firebase emite onAuthStateChanged
  - AuthContext obtiene doc('usuarios', email) de Firestore
  - Guarda perfil en estado + localStorage
  - Redirige a /dashboard (o /admin si es admin)
NO válido:
  - Muestra error "Email o contraseña incorrectos"
```

### 2. **Flujo de Inscripción en Curso**
```
Estudiante en /capacitacion
  ↓
Click "Explorar módulos" en un track
  ↓
Navega a /capacitacion/[moduloId]
  ↓
Sistema chequea:
  - ¿Está este track en assignedTracks del usuario?
  - ¿Tiene permiso?
  ↓
SI SÍ → Carga módulos
SI NO → Muestra "Necesitas estar inscrito"
  ↓
Alumno ve:
  - Contenido video
  - Markdown (con MarkdownRenderer)
  - Simulador (si aplica)
  - Quiz
```

### 3. **Flujo de Evaluación**
```
Alumno completa módulo
  ↓
Click "Enviar evaluación"
  ↓
EvaluationQuiz:
  - Valida respuestas
  - Calcula puntuación
  ↓
Guarda en Firestore:
  evaluations/
    └── {studentEmail}/
        └── {courseId}/
            ├── score: number (0-100)
            ├── answers: object
            ├── submittedAt: timestamp
            └── status: 'submitted' | 'graded'
  ↓
Actualiza dashboard del alumno
  ↓
Notifica docente (si es necesario grading manual)
```

### 4. **Flujo de Aplicación a Empleo**
```
Alumno en /bolsa-empleo
  ↓
Ve oferta
  ↓
Click "Aplicar"
  ↓
JobApplicationModal:
  - Valida que sea estudiante/consultor
  - Recoge datos: motivación, CV
  ↓
POST a Firestore:
  job_applications/
    └── {jobId}/
        └── {studentEmail}/
            ├── appliedAt: timestamp
            ├── status: 'pending' | 'accepted' | 'rejected'
            ├── motivation: string
            └── resume: URL
  ↓
Empresa ve en panel (si hace login)
  ↓
Empresa acepta → notifica estudiante
```

### 5. **Flujo de Acceso Sandbox**
```
Alumno en /dashboard
  ↓
Ve "Horas sandbox: 20 / 100"
  ↓
Click "Acceder entorno pruebas"
  ↓
Sistema chequea:
  - ¿sandboxHoursUsed < sandboxHoursLimit?
  - ¿role es estudiante o admin?
  ↓
SI → Abre sesión en SAP B1 remoto
NO → Muestra "Cuota agotada, contacta admin"
  ↓
Cuenta horas en Firestore:
  usuarios/
    └── {email}/
        └── sandboxHoursUsed: incrementa
```

---

## Base de Datos (Firestore)

**Estructura NoSQL (documentos + colecciones):**

```firestore
root/
├── usuarios/
│   └── {email}/
│       ├── uid, email, name, displayName, cedula
│       ├── role, status, createdAt, updatedAt
│       ├── assignedTracks: string[]
│       ├── passwordChanged, sandboxHoursUsed, sandboxHoursLimit
│       ├── phone, bio
│       └── [metadata de sesión]
│
├── evaluations/
│   └── {studentEmail}/
│       └── {courseId}/
│           ├── score: number (0-100)
│           ├── answers: object (respuestas)
│           ├── submittedAt: timestamp
│           └── status: 'submitted' | 'graded'
│
├── enrollments/
│   └── {studentEmail}/
│       └── {courseId}/
│           ├── enrolledAt: timestamp
│           ├── progress: 0-100%
│           ├── completedModules: string[]
│           └── status: 'active' | 'completed' | 'dropped'
│
├── job_applications/
│   └── {jobId}/
│       └── {studentEmail}/
│           ├── appliedAt: timestamp
│           ├── status: 'pending' | 'accepted' | 'rejected'
│           ├── motivation: string
│           └── resume: URL
│
├── jobs/
│   └── {jobId}/
│       ├── title, description, company
│       ├── requiredTracks: string[]
│       ├── salary, location, type (remote/onsite)
│       ├── createdAt, expiresAt
│       └── postedBy: email (empresa admin)
│
└── consultants/
    └── {email}/
        ├── name, bio, specialties (tracks)
        ├── certifications: array
        ├── hourlyRate, availability
        ├── github, linkedin, portfolio URLs
        └── verified: boolean
```

### Índices Recomendados

```
// Para queries frecuentes
- usuarios: index on (role, status)
- evaluations: compound index (studentEmail, courseId, submittedAt)
- enrollments: compound index (studentEmail, status)
- jobs: index on (requiredTracks, expiresAt)
```

---

## APIs y Webhooks

### Webhook n8n (`/api/webhooks/n8n`)

**Endpoint:** `POST /api/webhooks/n8n`

**Trigger desde n8n:** 
- Nuevas inscripciones
- Evaluaciones completadas
- Aplicaciones a empleo
- Cambios de perfil

**Acción en B1 Academy:**
```typescript
// route.ts
export async function POST(request: Request) {
  const body = await request.json()
  // Valida payload
  // Procesa evento (actualiza Firestore, envía notificaciones, etc.)
  // Retorna { success: true }
}
```

**Ejemplo payload:**
```json
{
  "event": "student.enrolled",
  "studentEmail": "juan@sap.academy",
  "courseId": "sap-b1-core",
  "timestamp": "2026-09-27T10:30:00Z"
}
```

### Integración Firebase REST API (Alternativa)

Si necesitas sincronizar datos externos sin n8n:

```bash
# Obtener usuario
GET https://firestore.googleapis.com/v1/projects/{projectId}/databases/(default)/documents/usuarios/{email}
Authorization: Bearer {idToken}

# Crear evaluación
POST https://firestore.googleapis.com/v1/projects/{projectId}/databases/(default)/documents/evaluations/{studentEmail}
Authorization: Bearer {idToken}
Content-Type: application/json
{
  "fields": {
    "score": { "integerValue": "85" },
    "submittedAt": { "timestampValue": "2026-09-27T10:30:00Z" }
  }
}
```

---

## Seguridad

### 1. **Autenticación**
- **Firebase Auth:** Email/password con reglas de complejidad
- **Master bypass:** Email `pablofgarciaf@gmail.com` + hardcoded pass (⚠️ revisar en producción)
- **Sesión localStorage:** Fallback si Firebase offline

**Vulnerabilidad conocida:**
```typescript
// AuthContext.tsx línea 57-58
const MASTER_SUPERADMIN_EMAIL = 'pablofgarciaf@gmail.com';
const MASTER_SUPERADMIN_PASS = '1721790721'; // ← HARDCODED (revisar)
```

**Recomendación:** Mover a `.env.local` o usar Firebase Custom Claims.

### 2. **Autorización (Firestore Rules)**
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo leen su propio perfil
    match /usuarios/{email} {
      allow read: if request.auth.token.email == email
      allow write: if request.auth.uid == resource.data.uid || request.auth.token.role == 'super'
    }
    
    // Evaluaciones: estudiante lee las suyas, docente lee todas
    match /evaluations/{student}/{course}/{document=**} {
      allow read: if request.auth.token.email == student || request.auth.token.role in ['docente', 'admin', 'super']
      allow write: if request.auth.token.role in ['docente', 'admin', 'super']
    }
    
    // Jobs: público leer, solo admin crear
    match /jobs/{document=**} {
      allow read: if true
      allow write: if request.auth.token.role in ['admin', 'super']
    }
  }
}
```

### 3. **Protección de Email (Scraping)**
```typescript
// ProtectedEmail.tsx
// Ofuscación de emails contra bots extractores
// Ejemplo: admin@sapacademy.es → visual pero no indexable
```

### 4. **Secretos**
```bash
# .env.local (NO versionado, NO en git)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
FIREBASE_ADMIN_SDK_KEY=... # ← solo lado servidor
```

### 5. **API Security Headers** (Verificar en `next.config.mjs`)
```javascript
// next.config.mjs
headers: [
  {
    source: '/:path*',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
    ]
  }
]
```

### 6. **CORS (Si aplica)**
Por defecto, Next.js no requiere CORS (servidor renderiza HTML). Solo si expones APIs REST.

---

## Consideraciones de Deployment

### 1. **Hosting**
- **Recomendado:** Vercel (Next.js nativo, serverless)
- **Alternativa:** Firebase Hosting (con Cloud Functions para APIs)
- **Alternativa:** AWS Amplify, Railway, Heroku

### 2. **Variables de Entorno**
```bash
# .env.local (DEV)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=b1academy-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=b1academy-prod
# SECRETOS (lado servidor, NO exponerlos)
FIREBASE_ADMIN_PRIVATE_KEY=...
```

### 3. **Build & Deploy**
```bash
# Local
npm run build
npm run start

# CI/CD (GitHub Actions, GitLab CI, etc.)
- Lint + Type Check
- Unit Tests (si aplica)
- Build
- Deploy a staging
- Tests E2E
- Deploy a producción
```

### 4. **Monitoreo**
- **Logs:** Vercel Dashboard, Firebase Cloud Logging
- **Errores:** Sentry, LogRocket
- **Performance:** Lighthouse CI, Google Analytics (Core Web Vitals)
- **Uptime:** Pingdom, Uptime Robot

### 5. **Backups Firestore**
```bash
# Backup automático (schedule en Cloud Tasks)
gcloud firestore export gs://b1academy-backups/$(date +%Y%m%d)
```

### 6. **Dominios & SSL**
- Dominio: `b1academy.ec` (o similar)
- SSL: Automático en Vercel / Firebase Hosting
- DNS: A records o CNAME a hosting provider

### 7. **Checklist Pre-Producción**
- [ ] Remover hardcoded passwords (master bypass)
- [ ] Validar Firestore Security Rules
- [ ] Configurar CORS si necesario
- [ ] Test de carga (1000+ usuarios simultáneos)
- [ ] Test de seguridad (OWASP Top 10)
- [ ] Configurar backups automáticos
- [ ] Setup CI/CD pipeline
- [ ] Monitoreo + alertas activas
- [ ] Documentación de runbooks (qué hacer si X falla)
- [ ] Plan de disaster recovery

---

## 🎯 Resumen Técnico Rápido

| Aspecto | Stack |
|--------|-------|
| **Frontend** | React 19 + Next.js 15 App Router |
| **Styling** | Tailwind CSS 3 + Dark Mode |
| **Lenguaje** | TypeScript 5 |
| **Autenticación** | Firebase Auth (email/password) |
| **Base de Datos** | Firestore NoSQL |
| **Hosting** | Vercel (recomendado) |
| **SEO** | robots.txt, sitemap.xml, JSON-LD dinámicos |
| **Integración** | n8n webhooks |
| **PDF** | jsPDF para certificados |
| **Markdown** | react-markdown + remark-gfm + rehype-raw |

---

## 📝 Notas Finales

1. **Modularidad:** Componentes reutilizables en `src/components/`, datos en `src/lib/`
2. **Type Safety:** Todo tipado con TypeScript. Beneficios: autocompletado, seguridad en compile-time
3. **Performance:** Server Components en Next.js (SSR), code splitting automático
4. **Escalabilidad:** Firestore escala horizontalmente. Sandbox limitado por cuota (horas/usuario)
5. **Manutenibilidad:** Separación clara: UI (components) ↔ Lógica (services) ↔ Datos (lib)

---

**Última actualización:** 27/09/2026  
**Versión:** 1.0  
**Autor:** B1 Academy Tech Team
