# Pendientes: retiro de la marca del fabricante externo

Este es el **único documento autorizado a nombrar** la marca externa: existe para saber qué falta reemplazar.
Estado: el código, la interfaz, los avisos legales, los exámenes y la documentación ya están limpios.
Lo que sigue se dejó para una segunda etapa, por decisión del responsable.

## 1. Texto de manuales, clases y guiones (reemplazar por terminología Finix ERP)
Lista exacta por archivo y número de ocurrencias: `docs/pendientes_retiro_marca.csv`.

| Zona | Archivos | Ocurrencias |
|---|---|---|
| `public/Capacitacion Finix/` (120 manuales) | 360 | 3.656 |
| `public/Aula_Finix/` (clases del aula) | 176 | 222 |
| `public/Video_Scripts/` (guiones, sin uso en la app) | 120 | 1.212 |
| `public/Manual_Maestro_Consolidado_Finix_ERP_10.md` | 1 | 175 |

Los nombres de carpetas y archivos ya se renombraron (sin la marca) y sus referencias se actualizaron.

## 2. Imágenes (no se pueden corregir con texto)
Las capturas de diapositivas muestran la interfaz y logotipos del fabricante dentro de la imagen.
Deben regenerarse desde el simulador Finix o eliminarse:
- `public/Capacitacion Finix/**/Imagenes_Diapositivas/`: 2.271 imágenes.
- `public/Aula_Finix/**`: 184 imágenes y videos.
- `public/aula/**`: 1.394 imágenes; revisar si contienen interfaz del fabricante.

## 3. Términos derivados, aún presentes en código y contenido
Son marcas o jerga del producto original, aunque no contienen la palabra principal:
- **"Fiori"** (107 usos; carpeta `src/components/fiori`, componentes `FinixFiori*`).
- **"B1"** y **"Business One"** (334 y 2 usos; incluye el nombre comercial "B1 Academy", "B1 Center", `Master B1`).
- Jerga técnica del producto original: HANA, Crystal Reports, DTW, Service Layer, UDO, etc. (358 usos). Algunos son términos genéricos del sector y pueden conservarse.

## 4. Referencias que ya estaban rotas antes del retiro de marca
- `src/content/clases-maestras/m01/sim-m01-l02.json`: 10 rutas a carpetas de diapositivas que no existen.
- `src/lib/manuals-120-data.ts`: 2 rutas truncadas por espacios en el nombre.
