# Fuente técnica: Metodología de Implementación SAP (SAP Activate & AIP)

## De Waterfall clásico a SAP Activate y AIP en el Mid-Market
En el ecosistema SAP, la implementación de un sistema de gestión empresarial ha evolucionado de las metodologías tradicionales en cascada (Waterfall / ASAP) hacia marcos ágiles e híbridos:
- **SAP Activate:** Metodología insignia de SAP para implementaciones ágiles, basada en mejores prácticas preconfiguradas, entrega iterativa por sprints de configuración y validación continua con el cliente.
- **AIP (Accelerated Implementation Program):** Metodología optimizada específicamente para SAP Business One en el mercado de pequeñas y medianas empresas, estructurada para proyectos con ciclos de 8 a 16 semanas.

## Las 6 Fases de Implementación Oficiales
1. **Discover (Descubrimiento):**
   - El cliente evalúa sus necesidades estratégicas, analiza el retorno de inversión (ROI) y comprende el valor del ERP.
   - El equipo de consultoría comprende los retos principales de la empresa y la visión directiva.
2. **Prepare (Preparación):**
   - **Entregables clave:** Acta de Constitución del Proyecto (Project Charter), Definición de Gobernanza, Plan de Trabajo (WBS/Gantt) y Matriz de Riesgos Inicial.
   - **Conformación del equipo:**
     - *Sponsor / Comité Directivo:* Define prioridades y aprueba cambios de alcance o presupuesto.
     - *Project Manager (PM):* Controla cronograma, hitos, costos y recursos.
     - *Consultor Líder / Business Analyst:* Guía la traducción de procesos de negocio al estándar del ERP.
     - *Key Users (Usuarios Clave):* Dueños funcionales de cada área (Compras, Ventas, Finanzas, Bodega) que aportan el conocimiento operativo y validarán el sistema.
   - Preparación de ambientes de trabajo: Ambiente de pruebas (Sandbox / Desarrollo) con la base de datos preconfigurada.
3. **Explore (Exploración y Fit/Gap):**
   - Se ejecutan los talleres de diseño conceptual (*Fit/Gap Workshops*) por ciclo de negocio.
   - Se muestra el sistema estándar funcionando con datos modelo y se compara contra la operación real del cliente.
   - **Clasificación Fit / Gap:**
     - *Fit (Ajuste):* El proceso del cliente se cubre 100% con la funcionalidad estándar de SAP B1.
     - *Gap - Configurable:* Se resuelve con parametrización nativa (campos UDF, búsquedas formateadas, alertas, procesos de aprobación o formatos de impresión).
     - *Gap - Extensión / Add-on:* Requiere un módulo certificado de terceros (ej. WMS Produmex, Beas Manufacturing, facturación electrónica local).
     - *Gap - Desarrollo a Medida:* Requiere integración mediante Service Layer / API o scripts de automatización.
   - **Entregable:** Matriz Fit-Gap firmada y Business Blueprint (BBD).
4. **Realize (Realización / Construcción):**
   - Parametrización en la "Golden Database" (base de datos modelo).
   - Configuración de plan de cuentas, determinación contable, maestros de socios y artículos, listas de precios y flujos de aprobación.
   - Migración de datos maestros y saldos mediante Data Transfer Workbench (DTW).
   - Pruebas unitarias de consultoría y Pruebas Integradas de Sistema (SIT - System Integration Testing).
5. **Deploy (Despliegue y Puesta en Marcha):**
   - Capacitación a usuarios finales liderada por los Key Users (*Train the Trainer*).
   - **El Cutover Runbook:** Cronograma de transición hora a hora para el fin de semana del arranque.
   - Congelamiento de operaciones en el sistema legado (*Blackout Period*).
   - Carga y cuadre de saldos de apertura: balance de comprobación, cuentas por cobrar, cuentas por pagar e inventario inicial valorado.
   - Pase a producción y Go-Live formal.
6. **Run (Operación e Hypercare):**
   - Período de estabilización (Hypercare) de 2 a 4 semanas con acompañamiento presencial/remoto intensivo.
   - Resolución de incidentes con modelo N1 (Key User), N2 (Consultor de soporte), N3 (Fábrica / SAP Support).
   - Cierre de proyecto, acta final de entrega y transición al equipo de mantenimiento regular.
