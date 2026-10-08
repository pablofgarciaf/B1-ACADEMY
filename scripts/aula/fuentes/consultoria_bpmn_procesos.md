# Fuente técnica: Modelado y Optimización de Procesos de Negocio (BPMN 2.0 en ERP)

## ¿Por qué el Consultor ERP modela en BPMN 2.0?
BPMN 2.0 (Business Process Model and Notation) es el estándar internacional indiscutible para representar flujos de trabajo de forma gráfica y rigurosa. Un consultor o analista de negocio en SAP utiliza BPMN para:
1. Hablar un lenguaje común con la gerencia, los usuarios operativos y los desarrolladores técnicos.
2. Identificar claramente **quién hace qué**, **cuándo**, **bajo qué condiciones** y **en qué pantalla del sistema**.
3. Eliminar la ambigüedad que suele existir en manuales escritos o explicaciones verbales.

## Elementos Centrales de BPMN 2.0
- **Carriles y Participantes (Pools & Lanes):**
  - *Pool (Piscina):* Representa una entidad completa u organización (ej. Empresa Cliente, Proveedor, Banco).
  - *Lane (Carril):* Subdivide el Pool en roles o departamentos funcionales dentro de la empresa (ej. Ventas, Crédito y Cobranzas, Almacén, Contabilidad). Cada tarea debe ubicarse exactamente en el carril del responsable de ejecutarla.
- **Actividades (Tareas):**
  - Rectángulos con esquinas redondeadas. En proyectos ERP se etiquetan como `[Verbo en infinitivo] + [Objeto]` (ej. "Registrar pedido de cliente", "Verificar disponibilidad de stock", "Autorizar orden de compra").
  - Tipos comunes: Tarea de usuario (manual en pantalla), Tarea de servicio (automática por sistema/API), Tarea de envío/recepción de mensajes.
- **Compuertas de Decisión (Gateways):**
  - *Compuerta Exclusiva (XOR - Rombo con X):* Bifurcación donde solo una rama es posible según una condición (ej. ¿Cliente tiene crédito disponible? Sí / No).
  - *Compuerta Paralela (AND - Rombo con +):* Divide el flujo en múltiples ramas que ocurren al mismo tiempo (ej. Notificar a almacén Y enviar confirmación al cliente).
  - *Compuerta Inclusiva (OR - Rombo con círculo):* Una o más ramas pueden activarse según las condiciones.
- **Eventos:**
  - *Inicio (círculo simple):* Disparador del proceso (ej. "Recepción de orden de compra del cliente").
  - *Intermedio (círculo doble):* Evento durante el proceso (ej. "Esperar 24 horas", "Llegada de camión a muelle").
  - *Fin (círculo grueso):* Conclusión del flujo (ej. "Factura cobrada y asiento registrado").

## Diagnóstico del Estado Actual (AS-IS)
- El mapeo AS-IS documenta **cómo opera la empresa hoy en día**, antes de implementar o cambiar SAP.
- **Técnicas de captura:**
  - Entrevistas semi-estructuradas con los Key Users.
  - Análisis de documentos reales (facturas en papel, hojas de Excel paralelas, correos).
  - "Gemba Walk" o acompañamiento en el puesto de trabajo (observar cómo digitan y qué problemas enfrentan).
- **Patologías habituales que revela el AS-IS:**
  - *Silos de información:* Bodega usa un Excel no conectado con Contabilidad.
  - *Doble o triple digitación:* El mismo dato se escribe en el cuaderno de recepción, luego en Excel y luego en el sistema.
  - *Aprobaciones informales:* Pedidos autorizados por mensaje de WhatsApp sin registro auditable.
  - *Cuellos de botella:* Pedidos retenidos días esperando la firma física del gerente ausente.

## Diseño del Estado Futuro (TO-BE) con Mejores Prácticas SAP
- El diagrama TO-BE define **cómo va a operar la empresa dentro de SAP Business One**.
- **Regla de oro de consultoría:** *Adaptar el proceso al estándar de SAP, no forzar al sistema a replicar los vicios del sistema anterior.*
- **Traducción directa de BPMN a objetos de SAP B1:**
  - *Compuerta de decisión crediticia:* Se parametriza en `Gestión > Inicialización del sistema > Parametrizaciones de documento > General > Bloquear clientes con límite de crédito excedido`.
  - *Compuerta de aprobación por monto:* Se implementa mediante `Gestión > Procedimientos de aprobación > Modelos de aprobación` (autorizador por nivel de importe).
  - *Lanes departamentales:* Se traducen a la **Matriz de Autorizaciones** (`Gestión > Inicialización > Autorizaciones generales`) para que Ventas solo vea ofertas/pedidos y Contabilidad maneje facturas y cobros.
  - *Tareas automáticas:* Se configuran mediante **Alertas del Sistema** (`Gestión > Definición > General > Alertas`).
