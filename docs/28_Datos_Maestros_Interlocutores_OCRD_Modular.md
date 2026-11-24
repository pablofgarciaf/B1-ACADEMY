# 🏢 28. Arquitectura Modular de Datos Maestros de Interlocutores Comerciales (OCRD)

Enlazado con: [[09_Simulador_Integral_Desktop]], [[21_Simulador_ERP_MultiEmpresa_FiniAI]], [[24_PasoCero_Empresa_B1Center_ZeroTrust]], [[27_Simulador_Practicas_Consultas_UX_Movil]].

---

## 🎯 1. Objetivo y Alcance

Este documento describe la arquitectura modular del subsistema de **Datos Maestros de Interlocutores Comerciales (OCRD)** en Finix ERP / SAP Business One, garantizando el cumplimiento estricto del límite de líneas por archivo (< 500 líneas), la segregación de responsabilidades y la correcta vinculación de contrapartes comerciales (**Cliente Conectado** y **Proveedor Conectado**).

---

## 🗺️ 2. Diagrama de Arquitectura Modular OCRD

```mermaid
graph TD
    A[CompanyPartnerForm.tsx<br/>Orquestador & Estado Global] --> B[PartnerHeaderNav.tsx<br/>Navegación & Salto Rápido]
    A --> C[PartnerMainFields.tsx<br/>Cabecera Canónica 2 Columnas]
    A --> D[PartnerTabsDetail.tsx<br/>Pestañas Detalladas SAP B1]
    A --> E[PartnerLinkBox.tsx<br/>Vinculación Contrapartes]
    
    C --> F[Campo Oficial Cliente Conectado<br/>linkedCustomerCode en Proveedores]
    C --> G[Campo Oficial Proveedor Conectado<br/>linkedVendorCode en Clientes]
    
    E --> H[c.save action: partnerLink<br/>customerCode + vendorCode]
    A --> I[c.save action: partnerUpdate / customer / vendor]
    
    H --> J[Motor Transaccional: applyPartnerCommand]
    J --> K[Firestore / Supabase Audit Changes]
    K --> L[PracticaConectada: Captura de Evidencia]
```

---

## 🧩 3. Desglose de Componentes Modulares (< 500 líneas)

| Componente | Archivo | Líneas | Responsabilidad |
| :--- | :--- | :--- | :--- |
| **Orquestador Principal** | `src/components/finix-screens/CompanyPartnerForm.tsx` | < 480 | Gestión del ciclo de vida, atajos de teclado SAP B1 (`Ctrl+A`, `Ctrl+F`, `Ctrl+S`, `Esc`), dispatch de comandos a `useCompany`. |
| **Navegación y Búsqueda** | `src/components/finix-screens/partner/PartnerHeaderNav.tsx` | ~130 | Indicadores de modo (`Crear`, `Buscar`, `Visualizar/Actualizar`), paginador oficial (`\|<`, `<`, `X/Y`, `>`, `>\|`) y selector rápido dropdown. |
| **Campos Maestros OCRD** | `src/components/finix-screens/partner/PartnerMainFields.tsx` | ~300 | Estructura canónica a dos columnas: Código, Razón Social, Grupo, Ciudad, RUC, Tipo de Socio, Estado, y campos de contraparte (`Cliente conectado` / `Proveedor conectado`). |
| **Detalle de Pestañas** | `src/components/finix-screens/PartnerTabsDetail.tsx` | ~480 | Pestañas oficiales SAP B1: General, Personas de contacto, Direcciones, Condiciones de pago, Finanzas (SRI), Anexos. |
| **Caja de Vinculación** | `src/components/finix-screens/partner/PartnerLinkBox.tsx` | ~110 | Interfaz dedicada para relacionar mutuamente un Cliente y un Proveedor activos sin disparar validaciones HTML5 huérfanas. |

---

## 🔗 4. Flujo de Vinculación de Contrapartes (`mod2-c1#8`)

En el currículo oficial de SAP Business One, cuando una misma entidad jurídica actúa como cliente y proveedor (ejemplo: `V10000 · Dell Ecuador` y `C20000 · Maxi-Teq`):

```mermaid
sequenceDiagram
    autonumber
    actor Alumno as Estudiante / Usuario
    participant Nav as PartnerHeaderNav
    participant Form as PartnerMainFields
    participant Eng as Motor ERP (applyPartnerCommand)
    participant Sim as PracticaConectada
    
    Alumno->>Nav: Selecciona V10000 (Dell Ecuador)
    Nav->>Form: Carga estado del proveedor V10000
    Alumno->>Form: Selecciona Cliente Conectado: C20000
    Alumno->>Form: Clic en Actualizar (o Guardar Vínculo)
    Form->>Eng: dispatch(partnerLink: { customerCode: 'C20000', vendorCode: 'V10000' })
    Eng->>Eng: Asigna linkedCustomerCode = 'C20000' y linkedVendorCode = 'V10000'
    Eng-->>Sim: Emite evento de auditoría con changes en 'vendors'
    Sim-->>Alumno: Habilita botón 'Verificar y Validar Práctica' (Aprobado)
```

---

## 🛡️ 5. Blindaje de Calidad y Cero Regresiones

- **TypeScript estricto:** 0 errores en `tsc --noEmit`.
- **Suite de pruebas:** 201/201 tests unitarios superados en `tests/*.test.cjs`.
- **Regla de líneas:** Ningún subcomponente supera las 500 líneas, garantizando mantenibilidad inmediata y legibilidad de código.
