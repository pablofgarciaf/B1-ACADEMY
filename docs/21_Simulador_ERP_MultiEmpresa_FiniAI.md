# 🏢 21 · Arquitectura ERP Multi-Empresa, Copiloto Fini AI y Prácticas Reales Supabase

Este documento forma parte de la red neuronal de documentación en Obsidian y detalla la modernización integral del simulador contable y operativo de **B1 Academy** para soportar operaciones reales en las **7 empresas del holding corporativo**, la conexión de prácticas desde Mi Aula directamente a **Supabase**, la eliminación del bloqueo en entradas numéricas mediante `NumberInput`, y la especialización de **@Fini AI (🐦‍🔥)**.

Relacionado con:
- [[09_Simulador_Integral_Desktop]]
- [[18_Simulador_Departamentos_y_Aislamiento_Supabase]]
- [[20_Auditoria_Agente_Estudiante_Simulador_y_Certificacion]]

---

## 🏗️ 1. Diagrama de Flujo e Integración del Ecosistema

```mermaid
graph TD
    A[Estudiante en Mi Aula / Simulador] -->|Navega Lección| B[SAPInteractiveSimulator]
    B -->|Práctica con pantalla real| C[PracticaConectada]
    B -->|Consulta o Asistencia| D[@Fini AI 🐦‍🔥 Advisor]
    
    C -->|Acciones de negocio| E[company-engine / applyCommand]
    E -->|Auto-inicialización si vacío| F[Perfil & Apertura Septiembre 2026]
    E -->|Almacenamiento Aislado| G[(Supabase / Firestore - 7 Sociedades)]
    
    D -->|Contexto en vivo| H[/api/simulador/advisor]
    H -->|Pantalla + Módulo + Sociedad| I[Llama-3.2 / NVIDIA NeMo API]
    I -->|Instrucciones exactas sin alucinación| D
```

---

## 🔢 2. Componente `NumberInput` (Erradicación de Trampas de Tecleo)

### Problema anterior
En inputs `<input type="number" min="0.01" step="0.01" value={amount ?? 0} />`:
1. Cuando el usuario borraba el `0`, el valor pasaba a `""`, `Number("")` evaluaba a `0`, haciendo que React inmediatamente restaurara el `0`.
2. Las flechas del navegador saltaban de `0.01` en `0.01`, impidiendo digitar valores comerciales como `$3,500.00` de forma ágil.

### Solución A+
Se diseñó `NumberInput` en `src/components/sap-screens/SAPControls.tsx`:
- Estado local desacoplado de cadena con sincronización reactiva bidireccional.
- `onFocus` con auto-selección (`select()`): un clic resalta el número para sobrescribir en una sola pulsación.
- Soporte para coma `,` o punto `.` decimal (adaptado a digitación ecuatoriana y latina).
- Supresión de spinners de incremento mediante CSS atómico `[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`.

---

## 🐦‍🔥 3. Copiloto Inteligente @Fini AI (`/api/simulador/advisor`)

- **Identidad:** @Fini AI, el Fénix de B1 Academy.
- **Ruta dedicada:** `src/app/api/simulador/advisor/route.ts`.
- **Contexto dinámico:** Recibe `currentScreen`, `currentModule`, `companySlot` y `companyName`.
- **Catálogo de Conocimiento Real:**
  - Sabe exactamente cómo guiar a **Finanzas & Contabilidad > [FIN002] Libro Mayor** (cuenta `1.1.02 Bancos`) para verificar mayores.
  - Sabe cómo conciliar extractos en **Gestión de Bancos > [BNK001] Conciliación Bancaria**.
  - Conoce la normativa ecuatoriana NIIF y SRI (IVA 15%, SBU $482, retenciones en la fuente y de IVA).
  - Cero alucinaciones de botones ficticios o fechas caducadas.

---

## 🏛️ 4. Multi-Sociedad para las 7 Empresas

Cada una de las 7 empresas cuenta con su propio espacio de base de datos en Supabase mediante la cabecera `X-Empresa`:
1. **B1 Center S.A.S. (Matriz)**: Tecnología, hardware y servidores.
2. **Comercializadora Retail S.A.**: Comercio minorista multicanal.
3. **Servicios & Consultoría IT**: Facturación por horas y consultoría SAP.
4. **Manufactura & Ensamble**: Listas de materiales (BOM) y órdenes de producción.
5. **Distribución & Logística**: Movimientos de stock y transporte.
6. **Importaciones & Comex**: Comercio exterior, aranceles e ISD.
7. **Inmobiliaria & Activos**: Control de activos fijos y depreciaciones.

---

## 🎓 5. Conexión de Prácticas desde Mi Aula (`PracticaConectada`)

En `SAPInteractiveSimulator.tsx`:
- Se eliminó el bloqueo que exigía `stepGuide.campos.length`.
- Toda práctica reconocida por `pantallaConectada(stepGuide)` monta `PracticaConectada`.
- Las transacciones completadas por el estudiante en las clases (crear clientes, emitir facturas, generar órdenes de compra, pagos y asientos) se guardan directamente en su empresa en Supabase, alimentando los estados financieros en tiempo real.
