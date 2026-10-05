# SAP Business One Academy — construcción e integración

Actualizado: 2026-10-05. Cambios locales; sin commit, push ni despliegue.

## Entrega

Los entregables de las fases 1–10 están construidos e integrados en el simulador. Incluyen empresa por estudiante, formularios persistentes, ciclos de ventas/compras, inventario y costeo, contabilidad, bancos, SRI educativo, nómina, producción/MRP y panel docente con XP.

Esto es un simulador académico: no firma ni envía documentos al SRI y no constituye certificación de cumplimiento tributario. La referencia histórica solicitada conserva SBU 2024 de USD 460 y las tasas didácticas indicadas por el usuario. La base instalada conserva Next.js 15.5.25 y Firebase 11.4; no se degradaron dependencias existentes a Firebase 10.

## Archivos completos por fase

Los archivos del repositorio contienen el código completo, sin fragmentos pendientes.

| Fase | Entregables principales |
| --- | --- |
| 1 | `src/components/sap-screens/SAPLoginScreen.tsx`, `src/lib/firestore-types.ts`, `src/lib/firestore-company.ts`, `src/hooks/useCompany.ts` |
| 2 | `SalesOrderForm.tsx`, `CustomerLookupModal.tsx`, `ItemLookupModal.tsx`, `SalesReportScreen.tsx` |
| 3 | `PurchaseOrderForm.tsx`, `VendorLookupModal.tsx`; motor compartido de documentos |
| 4 | `ItemMasterForm.tsx`, `InventoryReportScreen.tsx`, `WarehouseTransferForm.tsx` |
| 5 | `ChartOfAccountsScreen.tsx`, `JournalEntryForm.tsx`, `FinancialStatementsScreen.tsx`, `BankingScreen.tsx` |
| 6 | `SRIElectronicScreen.tsx`, `SRIDetailFields.tsx`, `RetentionForm.tsx`, `TaxReportScreen.tsx`, `src/lib/sri-xml.ts` |
| 7 | `EmployeeForm.tsx`, `PayrollRunScreen.tsx`, `PayrollSlip.tsx`, `payroll-print.css` |
| 8 | `BOMForm.tsx`, `ProductionOrderForm.tsx`, `MRPScreen.tsx` |
| 9 | `src/app/simulador/admin/page.tsx`, `src/components/simulador/TeacherDashboard.tsx`, `CompanyRecordDetails.tsx`, `src/lib/company-summary.ts`; XP en `company-engine.ts` |
| 10 | Contratos Zod, controlador de empresa, componentes `SAPControls.tsx`, validación del servidor y pruebas del motor |

Salvo rutas explícitas, los componentes de la tabla están en `src/components/sap-screens/`.

## INTEGRACIÓN

Ya aplicada; no es necesario copiar manualmente componentes:

1. `src/app/simulador/page.tsx`: campus, login SAP y empresa; XP real desde Firestore.
2. `src/components/simulador/CompanyWorkspace.tsx`: contexto, inicialización, avisos, misiones, niveles, último acceso y catálogo Ecuador.
3. `src/components/sap-screens/GenericSAPScreen.tsx` y `company-screen-registry.ts`: registro de pantallas adicionales sin modificar SAPScreenRenderer.
4. `src/app/api/sap/company/route.ts`: lecturas y operaciones autenticadas del estudiante.
5. `src/app/api/sap/teacher/route.ts`: consulta docente, estadísticas globales, filtro por módulo, ranking y asignación de misiones.
6. Acceso local: `http://localhost:4000/simulador`. Panel docente: `/simulador/admin`, con rol `teacher` o `docente` en el perfil de Firestore.

Se conservaron los componentes protegidos: SAPDesktopShell, SAPWindowManager, SAPModulesTree, SAPMenuBar, SAPToolBar, SAPScreenRenderer, BusinessPartnerForm, SimuladorDashboard y Firebase Auth. El nuevo CompanyPartnerForm persiste socios. SalesOrderForm y JournalEntryForm sí se actualizaron por autorización expresa en las fases 2 y 5.

## Persistencia y aislamiento

Firestore exige alternar colección/documento: el perfil único se guarda en `sapCompanies/{uid}/profile/main`; el documento `sapCompanies/{uid}` contiene el resumen docente.

Subcolecciones: salesOrders, purchaseOrders, customers, vendors, items, warehouseStock, stockMovements, journalEntries, chartOfAccounts, bankAccounts, bankTransactions, employees, payrollRuns, sriDocuments, productionOrders, boms, missions y requests.

El servidor toma el UID del token autenticado y valida entradas con Zod. `company-engine.ts` calcula documentos, stock, asientos, saldos, numeradores y XP; `company-server.ts` los guarda en una transacción. Las lecturas usan una instantánea transaccional. Los reintentos comprueban tanto requestId como huella del contenido. Las reglas propuestas impiden escrituras directas a empresas desde el cliente.

Las reglas de `firestore.rules` están en disco, no publicadas. La aplicación usa Firebase Admin para la persistencia nueva. El índice docente creado en la primera entrega dejó de ser necesario: las estadísticas ahora se calculan sobre todos los resúmenes, independientemente de la página visible. No se publicó ninguna configuración remota.

## Correcciones completadas en esta continuación

- Seis XML con nodos específicos: detalles/impuestos, datos del comprador/proveedor, documentos modificados, transporte/destinatarios y retenciones ATS. Clave de acceso de 49 dígitos y descarga XML educativa. Validación de documentos de sustento compatibles y bloqueo de duplicados por tipo/origen.
- Campos ATS ampliados: proveedor/cliente, modificación, retención, pago exterior, AIR, reembolsos y compensaciones editables. Formulario 103 suma retenciones IR; IVA se presenta por separado en los reportes correspondientes.
- Panel docente global: nombres, estados de cuenta, estudiantes sin empresa, alertas, ciclo de ventas, balances actuales y ranking; detalle legible por módulo.
- Actualización de último acceso y XP del campus desde la empresa real.
- Las notas de débito se pueden pagar sin cerrar su factura base. Las notas de crédito sobre facturas cobradas permiten devolución bancaria sin duplicarla.
- Transferencias FIFO conservan las capas de costo; producción multinivel abona la cuenta correcta del componente fabricado.
- Estado de resultados separa utilidad bruta, operacional y otros ingresos. Reporte de ventas añade totales de los documentos listados.

## Validación realizada

- 17/17 pruebas del motor superadas: inicialización, validación, ciclos vinculados, rollback, stock, IVA, créditos/devoluciones, FIFO/transferencias, asientos/reversión, nómina, producción multinivel, MRP, XML, idempotencia funcional, acceso y resúmenes por fecha Ecuador.
- TypeScript y ESLint de los archivos del simulador sin errores.
- Compilación Next.js exitosa de 148 rutas. Advertencia preexistente de dependencias de useEffect en `src/app/mi-aula/[moduleId]/page.tsx:110`.
- Los seis XML se analizaron con lxml: bien formados. No se afirma validación XSD completa: la descarga de los esquemas oficiales agotó el tiempo de conexión desde este entorno.
- Lectura autenticada de Firestore Admin confirmada con las credenciales existentes, sin crear ni modificar datos remotos.
- Sin sesión de estudiante en el navegador disponible: la ruta protegida redirige al login. No se ha verificado todavía el recorrido visual autenticado ni la impresión física A4.

## Límites del alcance educativo

- Copias documentales íntegras; sin entregas/facturas parciales ni cierre retroactivo de inventario.
- ATS es captura y reporte académico, no exportación validada para presentación fiscal. Los XML son estructuras sin firma y las tasas son las del ejercicio solicitado.
- MRP simplificado sin calendario de capacidad; nómina con días ingresados por el alumno y provisiones diferenciadas del pago.
- El plan de cuentas es una base de aula. El IR se estima, no se contabiliza automáticamente.
- Lecturas de empresa completa y resumen docente completo: apropiadas para empresas de aula pequeñas. El diseño requiere paginación/consultas selectivas antes de cargar volúmenes productivos.
- La concurrencia real de escrituras, autorización cruzada con dos sesiones y reglas desplegadas aún no tienen evidencia contra un emulador o entorno remoto de prueba. No se han creado cuentas ni datos de prueba remotos.

## Scorecard de calidad

| Aspecto | Resultado comprobado |
| --- | --- |
| Arquitectura e aislamiento | UID del servidor; empresas separadas; componentes protegidos conservados |
| TypeScript y estilos nuevos | Sin any de TypeScript ni estilos inline en la implementación nueva |
| Formularios | Carga, bloqueo durante guardado, errores, confirmación e historial |
| SEO/GEO | Área privada con noindex; no se aplican requisitos de landing pública ni se modifica sitemap/llms |
| Contabilidad | Procesos probados con cuadre, saldos y reversión; no se declara equivalencia contable exhaustiva |
| Accesibilidad y diseño | Controles etiquetados, diálogos nativos, paleta SAP; auditoría visual autenticada pendiente |
| Build | Compilación exitosa; advertencia ajena al simulador documentada |
| Firestore | Conectividad Admin de lectura verificada; pruebas remotas de escritura pendientes |
| Git | Sin push ni modificaciones masivas sobre los cambios previos del usuario |
| Calificación | No se asigna A+ sin Lighthouse, recorrido autenticado y validación completa de integración |

## Referencias

- SRI, formatos y especificaciones oficiales: https://www.sri.gob.ec/facturacion-electronica
- SRI, ATS y anexos: https://www.sri.gob.ec/formularios-e-instructivos1
- El carácter educativo se muestra en la interfaz y dentro de cada XML; no hay conexión de envío a SRI.

## Consumo al cierre

90% usado de la ventana de cinco horas y 40% semanal. No se canjeó crédito de reinicio. Construcción guardada y compilación final completada.
