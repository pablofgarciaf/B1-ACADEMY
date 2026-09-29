# 📚 Manuales SAP Academy - Documentación Técnica

## Visión General

La **Biblioteca de Manuales Técnicos** es el repositorio central de los 120 manuales oficiales de capacitación SAP Business One. Cada manual contiene:

- **PDF original** del manual SAP
- **Markdown de texto** (`_slides.md`) con la transcripción de cada diapositiva
- **Imágenes de diapositivas** (`.webp`) extraídas con alta resolución

## Arquitectura de Datos

```mermaid
graph TD
    A[public/Capacitacion SAP/] --> B[10_Sales_11_Process_Overview_ES/]
    B --> C[10_Sales_11_Process_Overview_ES.pdf]
    B --> D[10_Sales_11_Process_Overview_ES_slides.md]
    B --> E[Imagenes_Diapositivas/]
    E --> F[*.webp - Capturas de cada slide]
    
    G[src/lib/manuals-120-data.ts] --> H[ALL_MANUALS: ManualItem - 120 items]
    G --> I[MANUAL_CATEGORIES: CategoryGroup - 23 categorías]
    G --> J[CATEGORY_NAMES: string - para filtros]
    
    K[src/app/manuales/page.tsx] --> G
    L[src/app/manuales/id/page.tsx] --> M[ManualViewer]
```

## Interfaz TypeScript

```typescript
export interface ManualItem {
  id: string;           // ID = nombre de la carpeta
  number: number;       // Número secuencial (1-120)
  slug: string;         // Slug para URL
  title: string;        // Título en ESPAÑOL
  category: string;     // Categoría temática en español
  categoryIcon: string; // Emoji de la categoría
  categoryOrder: number;// Orden de agrupación
  summary: string;      // Resumen extraído del contenido real
  totalSlides: number;  // Cantidad de diapositivas disponibles
  pdfPath: string;      // Ruta al PDF
  mdPath: string;       // Ruta al Markdown de texto
  imagesPath: string;   // Ruta a la carpeta de imágenes
}
```

## Categorías (23 Módulos Temáticos)

| # | Icono | Categoría | Manuales |
|---|-------|-----------|----------|
| 1 | 🎓 | Introducción a SAP Business One | 2 |
| 2 | 🗺️ | Visión General del Sistema | 1 |
| 3 | 🛠️ | Implementación y Configuración | 22 |
| 4 | 📊 | Contabilidad Básica | 2 |
| 5 | 🏦 | Gestión Bancaria y Pagos | 3 |
| 6 | 📈 | Informes Financieros y Control | 4 |
| 7 | 💰 | Costos y Presupuestos | 4 |
| 8 | 🔄 | Procesos Financieros | 6 |
| 9 | ⚙️ | Configuración Financiera | 6 |
| 10 | 🏢 | Activos Fijos | 6 |
| 11 | 📦 | Gestión de Inventario y Artículos | 7 |
| 12 | 🏷️ | Datos Maestros de Artículo | 4 |
| 13 | 📋 | Inventarios y Movimientos | 4 |
| 14 | 📦 | Ubicaciones en Almacén (Bin Locations) | 6 |
| 15 | 📐 | Planificación de Materiales (MRP) | 3 |
| 16 | 🏷️ | Determinación de Precios | 6 |
| 17 | 🏭 | Producción | 9 |
| 18 | 📊 | Gestión de Proyectos | 2 |
| 19 | 🛒 | Compras y Aprovisionamiento | 8 |
| 20 | 💼 | Ventas | 7 |
| 21 | 🔧 | Gestión de Servicios | 1 |
| 22 | 🆘 | Herramientas de Soporte | 1 |
| 23 | ✏️ | Casos Prácticos y Ejercicios | 6 |

## Flujo de Navegación

```mermaid
graph LR
    A[/manuales] -->|Clic en tarjeta| B[Ficha Técnica Modal]
    A -->|Abrir Clase| C[/manuales/id]
    C --> D[ManualViewer]
    D --> E[Carrusel de Diapositivas]
    D --> F[Texto Markdown]
```

## Archivos Relacionados

- [[01_Auth]] - Sistema de autenticación para acceso a manuales
- [[03_Inspection]] - Aplicación de campo (módulo independiente)

## Proceso de Extracción de Imágenes

Las imágenes se extrajeron con un script Python usando PyMuPDF (`fitz`):
1. **Detección dinámica del área del slide** (bounding box del rectángulo más grande)
2. **Renderizado a 3x resolución** para máxima nitidez
3. **Recorte quirúrgico** eliminando bordes negros
4. **Clasificación automática** en BUENAS vs MALAS (cuarentena)
5. **Revisión manual humana** de las imágenes en cuarentena

> **Estado**: Las 114 carpetas principales tienen imágenes extraídas. 
> Las 6 carpetas CSL/CSI están pendientes de extracción manual.
