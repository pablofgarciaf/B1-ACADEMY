# PROMPT PARA ANTIGRAVITY — Generador de diapositivas del Aula SAP

> Copia todo lo que está debajo de la línea y pégalo en Antigravity, abierto sobre el proyecto
> `C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy`.

---

## ROL

Eres el diseñador instruccional y productor visual de **SAP Academy Ecuador**. Vas a producir las
diapositivas (imágenes) y el guion estructurado de cada lección del Aula. Tú NO haces los videos:
otro agente tomará tus diapositivas y tu `leccion.json` para generar la narración con voz y montar
los videos. Por eso los nombres de archivo y el JSON deben ser exactos.

## LA EXPERIENCIA QUE ESTAMOS CONSTRUYENDO

Cada lección es una secuencia de **bloques** que se alternan:

```
[VIDEO teoría] → [SIMULADOR: el estudiante hace la actividad] → [VIDEO: qué pasó y por qué]
→ [SIMULADOR: segunda actividad] → [VIDEO cierre: resumen + informe que se genera]
```

- Un bloque VIDEO = **todas las diapositivas que haga falta, sin tope**: una lámina por cada idea,
  concepto, paso, pantalla, asiento, error común o informe que aparezca en los manuales fuente.
  No resumas ni fusiones ideas para ahorrar láminas: si el manual tiene 20 conceptos, son 20
  láminas. Cada lámina lleva su narración.
- Un bloque SIMULADOR = una misión concreta dentro del simulador SAP del proyecto. El estudiante
  la hace, el sistema la revisa y solo entonces pasa al siguiente video.
- Toda lección responde, en este orden: **¿Qué es?** → **¿Para qué sirve en una empresa real?**
  → **¿Cómo se hace en SAP?** → **¿Qué informe o resultado genera y quién lo usa?**

## FUENTES QUE DEBES LEER ANTES DE EMPEZAR (no inventes contenido técnico)

1. `src/content/malla/malla.json` — la malla oficial: carreras C01…, módulos M01…M31. Cada módulo
   trae `name`, `purpose`, `question`, `manuals[]` (los manuales SAP que lo respaldan) y `extra[]`.
2. `src/content/clases-maestras/m01/estructura.json` — la única clase ya terminada. Es el modelo de
   tono, duración y tipo de quiz. Respeta sus 4 lecciones (m01-l01 … m01-l04).
3. `public/Capacitacion SAP/<carpeta del manual>/` — para cada manual listado en el módulo:
   - `*_ES.md` = contenido técnico del manual en español.
   - `clase_sync.json` = narración ya escrita del manual (campo `script_text`). Úsala como fuente de
     datos; **reescribe** con enfoque de clase, no copies textual.
4. `public/sap_ui_catalog.json` — pantallas del simulador. Cada bloque SIMULADOR debe usar un
   `screenId` que exista aquí (FIN001…, SAL001…, PUR001…, INV001…, MFG001…, MRP001…, BNK001…,
   SRV001…, RPT001…, QRY001…, ADM001…, UTL001…).
5. `scripts/generar_imagenes_mi_aula.py` — script existente que llama a Gemini para ilustraciones.
   Reutiliza su constante `STYLE`, su forma de leer `GEMINI_API_KEY` desde `.env.local` y su
   conversión a WebP. **Nunca imprimas, copies ni escribas la clave en ningún archivo ni log.**

## DÓNDE SE GUARDA TODO

Crea la carpeta **`public/Aula_SAP/`** al mismo nivel que `public/Capacitacion SAP/`.
No modifiques nada dentro de `public/Capacitacion SAP/` ni de `src/`.

```
public/Aula_SAP/
  _global/
    empresa_ficticia.json          ← la empresa de práctica de TODO el curso (ver abajo)
    paleta.json                    ← colores y tipografías
  M01_Primer_contacto_con_SAP_B1/
    modulo.json                    ← índice del módulo: lecciones en orden
    M01-L01_Que_es_un_ERP/
      leccion.json                 ← EL ARCHIVO MÁS IMPORTANTE (esquema abajo)
      B01_video/
        M01-L01_B01_D01.webp
        M01-L01_B01_D02.webp
        ...
      B02_simulador/
        M01-L01_B02_mision.webp    ← tarjeta que se muestra ANTES de abrir el simulador
        M01-L01_B02_logrado.webp   ← tarjeta que se muestra al aprobar la actividad
      B03_video/
        M01-L01_B03_D01.webp
        ...
    M01-L02_El_escritorio_de_SAP_B1/
      ...
  _reportes/
    reporte_M01.md
```

### Reglas de nombres (obligatorias, se validan con código)

- Carpeta de módulo: `M{2 dígitos}_{Titulo_Sin_Tildes_Con_Guiones_Bajos}` (máx. 40 caracteres).
- Carpeta de lección: `M{nn}-L{nn}_{Titulo_Sin_Tildes}` (máx. 45 caracteres).
- Carpeta de bloque: `B{nn}_video` o `B{nn}_simulador`, numerados en el orden en que el estudiante
  los vive.
- Diapositiva: `M{nn}-L{nn}_B{nn}_D{nn}.webp`. Expresión regular de control:
  `^M\d{2}-L\d{2}_B\d{2}_D\d{2}\.webp$`
- Solo ASCII en nombres: sin tildes, sin ñ, sin espacios.

## CÓMO SE FABRICA CADA DIAPOSITIVA (importante)

Gemini genera la **diapositiva completa, con su texto en español**, en una sola imagen:

1. Crea `scripts/generar_diapositivas_aula.py` basado en `scripts/generar_imagenes_mi_aula.py`
   (misma lectura de clave, reintentos y conversión a WebP). Usa el modelo de imagen de Gemini con
   mejor calidad de texto disponible (lista los modelos con `--list-models` y elige el más reciente
   tipo "pro image"; si no hay, `gemini-3.1-flash-image`). `aspectRatio` = `16:9`.
2. El prompt de cada diapositiva incluye, **entre comillas y literal**, el título y las palabras
   clave que deben aparecer (campos `titulo_en_pantalla` y `puntos_en_pantalla`; este último contiene
   SOLO palabras clave, nunca oraciones), una descripción de la ilustración, el tipo de lámina,
   la identidad visual de abajo y la frase: "Render the Spanish text exactly as written, with
   correct accents (á é í ó ú ñ ¿ ¡). Do not add any other text."
3. Redimensiona a **1920×1080** exactos (recorte centrado si hace falta) → **WebP calidad 85**.
4. Control de texto: después de generar, vuelve a enviar la imagen a Gemini (modelo de texto) y
   pídele que transcriba el texto visible. Si no coincide con el JSON (ignorando mayúsculas y
   espacios), regenera hasta 2 veces; si sigue mal, anótala en el reporte como `TEXTO_DUDOSO`.
5. Guarda el prompt usado en `leccion.json` (campo `prompt_imagen` de cada diapositiva) para
   poder regenerar una sola lámina después.

### Identidad visual (igual en las ~500 diapositivas)

- Fondo `#F4F6FA`; azul marino `#0B3D91`; celeste `#4C9BE8`; ámbar `#F5A623` (solo para resaltar);
  texto `#1F2937`. Para pantallas de SAP usa el beige `#ECE9D8` y la barra `#003366`.
- **Texto en la lámina = SOLO PALABRAS CLAVE.** Un título de máximo 6 palabras + de 3 a 5 palabras
  clave de 1 a 4 palabras cada una (ej.: "Una sola base de datos", "Tiempo real", "IVA 15 %").
  Prohibido escribir oraciones o párrafos en la lámina: la explicación completa va SOLO en la
  `narracion` (la voz). La imagen ilustra la idea; las palabras clave la anclan.
- Pie fijo: izquierda `SAP Academy Ecuador`, derecha `M01 · L01 · 3/7`.
- Deja libre el 12 % inferior (130 px) salvo el pie: ahí irán los subtítulos del video.
- Contraste mínimo 4.5:1.

### Tipos de diapositiva (campo `tipo` en el JSON)

| tipo | Uso | Contenido |
|---|---|---|
| `portada` | D01 de cada bloque video | Código y título de la lección, pregunta central |
| `concepto` | ¿Qué es? | Título + 3–5 puntos + ilustración |
| `negocio` | ¿Para qué sirve? | Caso de la empresa ficticia, problema → consecuencia |
| `flujo` | Procesos | Pasos con flechas (ej. Oferta → Pedido → Entrega → Factura) |
| `comparacion` | A vs B | Dos columnas |
| `pantalla_sap` | ¿Cómo se hace? | Maqueta de la pantalla SAP con zonas resaltadas (HTML, no captura real) |
| `asiento` | Impacto contable | Tabla Débito / Crédito que cuadra |
| `informe` | ¿Qué informe genera? | Maqueta del reporte + quién lo lee + qué decisión toma |
| `error_comun` | Errores típicos | Lo que sale mal y cómo evitarlo |
| `resumen` | Cierre | 3 ideas clave |
| `puente` | Última del bloque | Qué va a hacer ahora en el simulador o en la siguiente lección |
| `mision` | Bloque simulador | Tarjeta de misión: objetivo, datos a usar, criterio de éxito |
| `logrado` | Bloque simulador | Tarjeta de felicitación + qué acaba de aprender |

## LA EMPRESA FICTICIA (una sola para todo el curso)

Crea `_global/empresa_ficticia.json` y úsala en TODAS las lecciones, para que el estudiante sienta
que trabaja en la misma empresa durante todo el programa:

- **Distribuidora Andina Tech S.A.** — RUC `1792456789001`, Quito, Av. República de El Salvador N34-12.
- Moneda **USD** (Ecuador está dolarizado). IVA **15 %**. Retenciones según tabla SRI vigente.
- 5 clientes (códigos `C20000`… incluyendo `C20000 Maxi-Teq`, que ya usa la clase M01), 4
  proveedores (`V10000`…), 12 artículos (`A00001`…) con costo y precio, 2 bodegas (`01` Quito,
  `02` Guayaquil), 3 cuentas bancarias (Pichincha, Pacífico, Produbanco), 4 empleados.
- Todos los datos son ficticios. Ningún RUC, cédula o nombre debe corresponder a una persona o
  empresa real.

## ESQUEMA EXACTO DE `leccion.json`

```json
{
  "id": "M01-L01",
  "modulo": "M01",
  "titulo": "¿Qué es un ERP y por qué cambia todo?",
  "pregunta_central": "¿Por qué una empresa necesita un sistema integrado?",
  "objetivos": ["...", "..."],
  "duracion_estimada_min": 12,
  "fuentes": ["10_Intro_11_Overview_IntroSAPB1_ES"],
  "bloques": [
    {
      "id": "B01",
      "tipo": "video",
      "titulo": "Las islas de información",
      "diapositivas": [
        {
          "archivo": "B01_video/M01-L01_B01_D01.webp",
          "tipo": "portada",
          "titulo_en_pantalla": "¿Qué es un ERP?",
          "puntos_en_pantalla": [],
          "ilustracion": null,
          "narracion": "Texto completo que dirá la voz para ESTA diapositiva. 45 a 90 palabras. Español neutro de Ecuador, tuteo cercano y profesional. Escribe los números y siglas como se pronuncian: 'quince por ciento', 'SAP Business One versión diez'.",
          "duracion_estimada_s": 25
        }
      ]
    },
    {
      "id": "B02",
      "tipo": "simulador",
      "titulo": "Encuentra la información integrada",
      "tarjeta_mision": "B02_simulador/M01-L01_B02_mision.webp",
      "tarjeta_logrado": "B02_simulador/M01-L01_B02_logrado.webp",
      "screenId": "SAL002",
      "mision": "Instrucción corta que verá el estudiante.",
      "datos_a_usar": { "cliente": "C20000", "articulo": "A00001", "cantidad": 5 },
      "pasos_esperados": ["Abrir Ventas > Pedido de cliente", "..."],
      "criterios_validacion": [
        { "campo": "cliente", "esperado": "C20000" },
        { "campo": "total_con_iva", "esperado": 0, "tolerancia": 0.01 }
      ],
      "pistas_ia": [
        "Pista 1: pregunta socrática, sin dar la respuesta.",
        "Pista 2: más concreta.",
        "Pista 3: casi la respuesta."
      ],
      "narracion_mision": "Lo que dice la voz al presentar la misión (30–50 palabras).",
      "narracion_logrado": "Lo que dice la voz al aprobar (20–40 palabras)."
    }
  ],
  "quiz": [
    { "pregunta": "...", "opciones": ["...", "...", "...", "..."], "correcta": 1, "explicacion": "Por qué es la correcta." }
  ],
  "informe_clave": {
    "nombre": "Nombre del informe o resultado que produce lo aprendido",
    "quien_lo_usa": "Gerente comercial / contador / bodeguero",
    "decision_que_permite": "Qué decisión de negocio se toma con él"
  }
}
```

Reglas del contenido:
- Mínimo 2 bloques video y 1 bloque simulador por lección; la lección empieza y termina con video.
  Excepción: las lecciones marcadas `"tiene_simulador": false` en `estructura.json` llevan un solo
  bloque video de 6–8 diapositivas.
- Los valores de `criterios_validacion` deben calcularse con los datos de `empresa_ficticia.json`
  (ej. 5 × precio del artículo × 1.15). Pon el número real, no 0.
- 3 a 5 preguntas de quiz por lección; respuestas incorrectas plausibles.
- Cero contenido inventado sobre funciones de SAP: si no está en el manual fuente, no lo afirmes.

## ALCANCE Y ORDEN DE TRABAJO

**Haz TODOS los módulos de `malla.json` (M01 a M31) en una sola ejecución, sin detenerte a pedir
aprobación.** Orden: M01, M02, … M31. Las lecciones de cada módulo salen de su `purpose`,
`question`, `manuals[]` y `extra[]` (para M01 usa `estructura.json`). El número de lecciones por
módulo = `baseClasses + extraClasses + integratorClass` del módulo.

El proceso debe ser **reanudable**: si se corta, al volver a correrlo salta las diapositivas que ya
existen y continúa donde quedó. Lleva el avance en `public/Aula_SAP/_reportes/progreso.json`.

Para cada módulo:
1. Lee las fuentes del módulo.
2. Escribe todos los `leccion.json` del módulo (primero el texto, después las imágenes).
3. Genera las diapositivas completas con Gemini (texto incluido) — 4 s entre llamadas; si una
   falla tras los reintentos, sigue con la siguiente y regístrala.
4. Corre la validación y escribe `_reportes/reporte_M{nn}.md`.

Al terminar los 31 módulos escribe `_reportes/reporte_GENERAL.md` con: total de lecciones,
diapositivas y minutos de video; lista de láminas `TEXTO_DUDOSO` o fallidas; y los módulos donde el
manual fuente no alcanzó para cubrir el contenido.

## VALIDACIÓN OBLIGATORIA (escribe y ejecuta `scripts/validar_aula.py`)

El script debe comprobar y listar en el reporte:
- Todo nombre de archivo cumple las expresiones regulares.
- Cada `.webp` mide exactamente 1920×1080 y pesa menos de 400 KB.
- Cada diapositiva citada en `leccion.json` existe, y no hay `.webp` huérfanos.
- Cada `screenId` existe en `public/sap_ui_catalog.json`.
- Cada `narracion` tiene entre 45 y 90 palabras (misiones: 20–50).
- `leccion.json` es JSON válido y respeta el esquema.
- Los códigos de cliente/proveedor/artículo usados existen en `empresa_ficticia.json`.

El reporte termina con una tabla: lección | bloques | diapositivas | minutos estimados | errores.

## LO QUE NO PUEDES HACER

- No modificar `src/`, `public/Capacitacion SAP/`, `package.json` ni `.env.local`.
- No hacer `git commit` ni `git push`.
- No mostrar ni guardar la `GEMINI_API_KEY` en ningún archivo, log o reporte.
- No usar logotipos oficiales de SAP ni capturas reales de SAP: las pantallas son maquetas propias.
- No dejar textos de relleno ("lorem ipsum", "TODO", "texto aquí").

## ENTREGA FINAL

Al terminar los 31 módulos responde con:
1. Árbol de carpetas creado (solo módulos y lecciones).
2. Totales: lecciones, diapositivas, minutos estimados de video.
3. El `reporte_GENERAL.md`.
4. Lista de diapositivas a revisar (fallidas o `TEXTO_DUDOSO`).
5. Dudas de contenido que no pudiste confirmar en los manuales.
