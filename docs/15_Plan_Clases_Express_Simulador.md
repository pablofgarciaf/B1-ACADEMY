# Plan: Clases Express en el Simulador (modo guiado con SAPI)

> Estado: **PLANIFICADO, sin desarrollar** (decisión del 7-oct-2026: no hay presupuesto de tokens ahora).
> Objetivo: que quien ve los videos de los manuales pase directo a practicar en `/simulador`, con las instrucciones a la derecha y SAPI moviéndose por la pantalla para indicar qué hacer.

## 1. La idea y mi valoración

**Qué se quiere:** el simulador "igualito" a SAP, y por cada ejemplo un panel de instrucciones a la derecha; SAPI se desplaza hasta el campo que toca y señala qué escribir o elegir. Clases rápidas, solo práctica, sin diapositivas: refuerzo de los manuales y videos.

**Valoración: muy buena, y es más barata de lo que parece.** Razones:
1. **Ya existe casi todo el contenido.** Las 328 prácticas de Mi Aula ya traen título, ruta de menú, instrucciones, campos y valores exactos. De ellas, ~166 ya abren una pantalla real del simulador. Convertirlas en guías express **no requiere IA ni tokens**: es un script que transforma datos.
2. **Ya existe la validación.** Mi Aula comprueba en Supabase que la operación quedó registrada en la empresa del estudiante. El modo express reutiliza esa misma comprobación, así que no hay un segundo sistema que mantener.
3. **Refuerza sin competir.** Mi Aula = aprender (video + práctica, con certificado). Express = repetir hasta dominarlo, sin diapositivas, en 3–5 minutos.
4. **SAPI ya existe** (mascota flotante arrastrable). Hay que enseñarle a ir a un punto de la pantalla, no a crearla.

**Riesgos a vigilar:**
- *Que el panel tape el trabajo:* en móvil debe ser una hoja inferior plegable; en escritorio, columna derecha que se puede ocultar.
- *Que SAPI estorbe:* ya hubo quejas de que estorbaba. En modo express debe poder pausarse ("Déjame solo") y no interceptar clics.
- *Anclas frágiles:* si se señala un campo por su posición en pantalla, se rompe cuando cambia el diseño. Se resuelve con identificadores estables (`data-guia="cliente"`), nunca con posición.
- *Rutas y campos de SAP:* el "igualito a SAP" solo lo puede garantizar un consultor con SAP real (ver `docs/16_Paquete_de_Revision_SAP_y_Contador.md`).

## 2. Cómo se vería

```
┌──────────────────────────────────────────────┬─────────────────────────┐
│  /simulador (pantalla real, igual que hoy)   │  EXPRESS · Factura de   │
│                                              │  proveedor · 4 min      │
│   Cliente  [ C20000 ▾ ]  ◄── SAPI señala     │  ─────────────────────  │
│   Artículo [        ]                        │  ✔ 1. Abre Compras…     │
│   Cant.    [        ]                        │  ➜ 2. Elige proveedor   │
│                                              │     V10000 (Dell)       │
│                                              │  ○ 3. Agrega A00001     │
│                                              │  ○ 4. Guarda            │
│                                              │  [Pista] [Saltar] [Salir]│
└──────────────────────────────────────────────┴─────────────────────────┘
```
SAPI "vuela" hasta el campo del paso activo y muestra un globo corto ("Elige a Dell Ecuador"). Al completar el paso, el panel lo marca y SAPI pasa al siguiente.

## 3. Diseño técnico propuesto

### 3.1 Formato de una guía (dato, no código)
```json
{
  "id": "mod4-c4-p3",
  "titulo": "Crear un abono de cliente",
  "origen": "mod4-c4",            // clase de Mi Aula de la que sale
  "pantalla": { "clave": "documento", "docType": "credit_note" },
  "minutos": 4,
  "pasos": [
    { "ancla": "cliente",  "instruccion": "Elige a Maxi-Teq", "valor": "C20000", "pista": "Cliente C20000" },
    { "ancla": "articulo", "instruccion": "Agrega el artículo A00001", "valor": "A00001" },
    { "ancla": "guardar",  "instruccion": "Guarda el documento" }
  ],
  "verificacion": "registro-reciente"   // el mismo chequeo que Mi Aula
}
```

### 3.2 Piezas
| Pieza | Qué hace | Reutiliza |
|---|---|---|
| `GuiaExpress` (ruta `/simulador/express/[id]`) | Carga la guía y la pantalla real a la izquierda | `PracticaConectada`, `CompanyContext` |
| `PanelPasos` | Lista de pasos, progreso, pista, saltar | — |
| `SapiGuia` | Calcula la posición del ancla (`getBoundingClientRect`) y anima a SAPI hasta allí | `SapiMascota` |
| Anclas `data-guia="…"` | Marcan campos y botones en las pantallas del simulador | pantallas `sap-screens/*` |
| Verificación | `/api/practice` con `conectada:true` (el servidor mira Supabase) | `practice/route.ts` |
| Catálogo `/simulador/express` | Lista por módulo, con duración y estado | `curriculum-data.ts` |

### 3.3 Verificación de pasos
- **Pasos intermedios:** se comprueban en el navegador leyendo el estado de la pantalla (¿el campo ya tiene el valor?). Solo orientan; no puntúan.
- **Paso final:** lo confirma el servidor (registro nuevo en la empresa del estudiante), igual que hoy. Así nadie "aprueba" sin hacerlo.

### 3.4 Relación con certificados (decisión pendiente)
Recomendación: **las express NO son requisito de certificado**, pero sí dan una insignia ("Dominado: 3 repeticiones sin pista"). Así el certificado sigue dependiendo de Mi Aula y las express motivan a repetir. Se puede cambiar después.

## 4. Fases y esfuerzo

| Fase | Entrega | Tokens de IA | Esfuerzo |
|---|---|---|---|
| **F0 – Datos** | Script `scripts/aula/generar_express.py`: convierte las prácticas conectadas en guías JSON (campos→pasos, ruta→pantalla) | **0** | pequeño |
| **F1 – Anclas** | Añadir `data-guia` a las ~25 pantallas del simulador (campos y botones principales) | 0 | mediano (mecánico) |
| **F2 – Motor** | `GuiaExpress` + `PanelPasos` + verificación | 0 | mediano |
| **F3 – SAPI guía** | `SapiGuia`: movimiento hacia el ancla, globo, "déjame solo", `prefers-reduced-motion` | 0 | mediano |
| **F4 – Catálogo y enlaces** | `/simulador/express`, botón "Reforzar en el simulador" al final de cada práctica de Mi Aula | 0 | pequeño |
| **F5 – Móvil** | Panel como hoja inferior; SAPI sin tapar campos | 0 | pequeño |
| **F6 – Contenido nuevo** | Guías sin clase de origen (si se quieren) | mínimos, solo para textos | opcional |

**Total de tokens de IA para dejarlo funcionando: prácticamente cero**; es ingeniería, no generación de contenido. Orden recomendado: F0 → F2 → F1 (solo 5 pantallas) → F3 → resto, para tener un piloto con 10 guías antes de escalar.

## 5. Criterios de "terminado" (para no dejarlo a medias)
- 20 guías piloto (una por pantalla principal) que se completan de principio a fin.
- Cada guía se verifica en el servidor y deja el registro en la empresa del estudiante.
- SAPI se puede pausar y respeta `prefers-reduced-motion`.
- Funciona en móvil sin scroll horizontal y con teclado (accesibilidad AA).
- Un estudiante real (no el equipo) completa 5 guías sin ayuda.

## 6. Preguntas abiertas
1. ¿Express cuenta para certificado o solo para insignias? (recomendado: insignias)
2. ¿Se mantiene la empresa del curso (B1 Center) para express, o se permite "Mi empresa"? (recomendado: B1 Center, para tener datos conocidos)
3. ¿Se reinicia la empresa para repetir una guía? (recomendado: botón "Restablecer B1 Center" por si el estudiante se ensucia los datos)
4. ¿Videos de manuales enlazados dentro del panel? (recomendado: sí, un enlace al minuto del video)
