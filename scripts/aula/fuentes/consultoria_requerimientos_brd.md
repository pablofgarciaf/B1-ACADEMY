# Fuente técnica: Levantamiento de Requerimientos y Documentación de Negocio (BRD & BBD)

## El Rol del Business Analyst en la Consultoría SAP
El Analista de Negocio (Business Analyst) es el puente traductor entre las necesidades de negocio del cliente y las capacidades técnicas del ERP. Su responsabilidad principal es evitar los dos fracasos clásicos de un proyecto de software:
1. Construir algo técnicamente impecable que no resuelve el problema real del negocio.
2. Prometer soluciones imposibles o desmedidas que destruyen el cronograma y el presupuesto.

## Tipos de Requerimientos en Proyectos ERP
- **Requerimientos de Negocio (Business Requirements):** Objetivos de alto nivel de la empresa (ej. "Reducir el tiempo de despacho de 48h a 12h", "Tener estados financieros en NIIF el día 3 de cada mes").
- **Requerimientos Funcionales (Functional Requirements):** Qué debe hacer el sistema (ej. "El sistema debe calcular automáticamente la retención en la fuente del 1,75% para compras de bienes", "El sistema debe bloquear pedidos si el socio supera su cupo de crédito").
- **Requerimientos No Funcionales (NFRs):** Atributos de calidad (ej. "El tiempo de respuesta al generar un balance debe ser menor a 3 segundos", "Copia de seguridad automática diaria").
- **Requerimientos de Transición / Migración:** Lo necesario para el Go-Live (ej. "Migrar 5.000 clientes activos con sus saldos de cartera de los últimos 2 años").
- **Requerimientos Regulatorios:** Cumplimiento legal ineludible (SRI, IESS, Ministerio de Trabajo).

## Técnicas de Elicitación y Descubrimiento
- **Los Cinco Porqués (5 Whys):** No quedarse con la queja superficial. Si el usuario dice "Necesito un botón para forzar inventario negativo", preguntar por qué hasta descubrir que el problema real es que Bodega recibe la mercadería física 3 días antes de que Compras digite la factura. La solución no es inventario negativo, sino implementar la Entrada de Mercancías (GRPO).
- **Entrevistas Estructuradas:** Preguntar por entradas, reglas de validación, excepciones, salidas e indicadores de éxito.
- **Talleres de Descubrimiento (Workshops):** Dinámicas colaborativas donde participan todas las áreas involucradas en un proceso para resolver conflictos de intereses entre departamentos.

## Documentos Oficiales: BRD y Business Blueprint (BBD)
1. **BRD (Business Requirements Document):**
   - Documento centrado en el **problema del negocio**, independiente de la herramienta tecnológica.
   - Contiene: Resumen ejecutivo, Justificación del negocio, Alcance del proyecto (In-Scope / Out-of-Scope), Reglas de negocio del cliente y Criterios de éxito.
2. **Business Blueprint (BBD) de SAP:**
   - Documento de **diseño de la solución en SAP**. Traduce el BRD a arquitectura de software.
   - Estructura estándar:
     - Estructura organizativa de la empresa (Sociedades, Monedas, Almacenes).
     - Diseño de datos maestros (Estructura de codificación de cuentas, socios y artículos).
     - Flujos de procesos TO-BE paso a paso por módulo.
     - Matriz de personalizaciones requeridas: UDFs (User-Defined Fields), UDTs (User-Defined Tables), Alertas y Autorizaciones.
     - Especificaciones funcionales de desarrollos a medida o integraciones (FS - Functional Specifications).

## Historias de Usuario y Criterios de Aceptación
- **Formato ágil estándar:**
  - *Como* [rol del usuario en la empresa],
  - *Quiero* [ejecutar una acción concreta en el sistema],
  - *Para* [obtener un beneficio de negocio medible].
- **Criterios de Aceptación (Formato Gherkin):**
  - **Dado** que un cliente tiene un límite de crédito de $5,000 y una deuda acumulada de $4,800,
  - **Cuando** el ejecutivo comercial intenta crear un pedido por $500,
  - **Entonces** el sistema debe detener la creación del pedido y notificar al Gerente de Crédito para su aprobación.

## Matriz de Trazabilidad de Requisitos (RTM)
- Hoja de control que asegura que **ningún requerimiento se quede sin resolver ni se pruebe sin fundamento**.
- Estructura de columnas:
  `ID Requerimiento` | `Descripción de Negocio` | `Prioridad (MoSCoW)` | `Módulo SAP B1` | `Tipo Solución (Estándar / UDF / Script)` | `ID Caso de Prueba UAT` | `Estado de Validación`.

## Modelado Práctico en SAP Business One
Cuando un requerimiento de negocio supera los campos estándar:
- **Campos de Usuario (UDF):** En `Herramientas > Herramientas de personalización > Campos definidos por el usuario` (ej. añadir campo `Canal de Distribución` en la cabecera del pedido de cliente).
- **Valores Válidos:** Limitar la digitación a listas desplegables cerradas (ej. Mayorista, Minorista, E-commerce) para garantizar la calidad analítica de los datos.
