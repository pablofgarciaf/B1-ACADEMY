# Fuente técnica: Gestión de Clientes, Pruebas UAT y Gestión del Cambio Organizacional

## Gestión de Stakeholders en Proyectos ERP
Un proyecto de implementación no fracasa por fallos técnicos de base de datos; fracasa por factores humanos y mala gestión de expectativas.
- **Matriz Poder / Interés (Matriz de Mendelow):**
  1. *Alto Poder, Alto Interés (Sponsors, Gerente General, Director Financiero):* **Gestionar de cerca.** Requieren informes ejecutivos de avance, control presupuestario y visibilidad de riesgos críticos.
  2. *Alto Poder, Bajo Interés (Accionistas, Directores pasivos):* **Mantener satisfechos.** No abrumarlos con detalles técnicos; mostrar cumplimiento de hitos estratégicos.
  3. *Bajo Poder, Alto Interés (Key Users, Jefes de Operaciones):* **Mantener informados y comprometidos.** Son el motor del proyecto; si se sienten ignorados, boicotearán las pruebas.
  4. *Bajo Poder, Bajo Interés (Usuarios finales operativos):* **Monitorear y capacitar oportunamente.**
- **Control de Cambios de Alcance (Change Request - CR):**
  - Todo cambio solicitado fuera del Business Blueprint original debe evaluarse mediante la regla del **Triángulo de Hierro**: *Alcance, Tiempo y Costo*.
  - El consultor debe documentar: Justificación del cambio, impacto en horas de consultoría, retraso potencial en la fecha de Go-Live y costo económico adicional para aprobación formal del Comité de Proyecto.

## Gestión del Cambio Organizacional (OCM)
- La adopción de un ERP genera resistencia natural (miedo a perder el empleo, frustración por pantallas nuevas, incomodidad por mayor control y transparencia).
- **Curva del Cambio de Kübler-Ross:**
  1. *Negación:* "El sistema viejo de hojas de cálculo funcionaba perfecto".
  2. *Resistencia / Frustración:* "SAP me pide demasiados campos y me quita tiempo".
  3. *Exploración / Aprendizaje:* "Empiezo a ver que los reportes automáticos me ahorran horas de cuadre".
  4. *Compromiso e Integración:* "Ya no podría trabajar sin SAP".
- **Estrategia "Train the Trainer":**
  - La consultora no capacita a los 200 empleados de la fábrica; capacita a los 8 Key Users para que alcancen nivel experto.
  - Los Key Users capacitan luego a sus propios equipos. Esto genera apropiación interna, reduce costos y crea soporte de primer nivel dentro de la empresa cliente.

## Estrategia Integral de Pruebas (Test Strategy)
En SAP Business One, la calidad de la solución se asegura en 3 niveles progresivos:
1. **Pruebas Unitarias (Unit Testing):**
   - Ejecutadas por el consultor funcional.
   - Valida cada ventana y cálculo de forma aislada (ej. verificar que un UDF guarde correctamente, o que una retención aplique la tasa correcta).
2. **Pruebas Integradas de Sistema (SIT - System Integration Testing):**
   - Ejecutadas conjuntamente entre consultores de diferentes áreas (Logística + Finanzas).
   - Valida el flujo completo de punta a punta entre módulos: `Pedido de Venta → Entrega en Bodega → Factura de Clientes → Asiento Contable → Cobro en Banco`.
3. **Pruebas de Aceptación de Usuario (UAT - User Acceptance Testing):**
   - **Son las pruebas definitivas antes del Go-Live.** Las ejecutan exclusivamente los Key Users con datos reales del negocio.
   - El objetivo es certificar que el sistema cumple con lo especificado en el Business Blueprint.

## Diseño de Guiones de Prueba UAT (Test Scripts)
Un guion de prueba profesional contiene:
- `ID del Caso de Prueba`: Identificador único (ej. `UAT-O2C-01`).
- `Título del Escenario`: Escenario de negocio a validar (ej. "Venta a crédito con aplicación de descuento comercial y entrega parcial").
- `Prerrequisitos`: Datos maestros necesarios creados (ej. Cliente C20000 con cupo de $5,000, Artículo A00001 con 50 unidades en stock en Almacén 01).
- `Pasos de Navegación`: Ruta exacta de menú en SAP B1.
- `Datos de Entrada`: Valores precisos a ingresar.
- `Resultado Esperado`: Mensaje del sistema, número de documento generado y asiento contable esperado.
- `Resultado Obtenido`: Conforme / No Conforme (con captura de pantalla del error si falla).
- `Firma y Estado`: Aprobado por el Key User con fecha y hora.

## Protocolo de Decisión Go / No-Go
Una semana antes de la fecha programada de Go-Live, el Comité de Proyecto se reúne para la decisión crítica:
- **Criterios obligatorios para el GO:**
  - 100% de casos de prueba UAT críticos aprobados (0 defectos bloqueantes abiertos).
  - Usuarios finales capacitados y evaluados satisfactoriamente.
  - Base de datos de producción inicializada y datos maestros validados por el cliente.
  - Cutover Runbook acordado hora a hora entre consultoría y el equipo TI del cliente.
  - Plan de contingencia (Rollback Plan) documentado en caso de falla mayor.
