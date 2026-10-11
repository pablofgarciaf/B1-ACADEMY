# Guía Técnica: Soluciones a la Práctica de Consultas SQL en SAP HANA (Query Generator & Wizard)

## Metadatos Técnicos
- **Módulo SAP:** Herramientas del Sistema y Consultas SQL (System Customization / SQL Queries)
- **Código de Unidad:** 098_CSI08_Query_Practice_Solutions
- **Versión Oficial:** SAP Business One 10.0, versión para SAP HANA
- **Audiencia Objetivo:** Consultores Junior, Usuarios Clave (Power Users) e Instructores.

```json
{
  "antigravity_master_schema": {
    "module": "System Tools - Query Practice Solutions",
    "version": "10.0 HANA",
    "prerequisites": {
      "database": "SBODEMO_ES / SBODEMO_US (HANA Version)",
      "user_code": "manager",
      "license": "Professional"
    },
    "key_tables": {
      "OCRD": "Datos Maestros de Socios de Negocios",
      "OINV": "Facturas de Clientes (Cabecera)",
      "OQUT": "Ofertas de Ventas (Cabecera)",
      "OSLP": "Empleados del Departamento de Ventas",
      "ORDR": "Pedidos de Clientes (Cabecera)",
      "ODLN": "Entregas de Mercancías (Cabecera)"
    },
    "tools_used": [
      "Generador de consultas (Query Generator)",
      "Asistente de consultas (Query Wizard)",
      "Información del sistema (System Information)",
      "Gestor de Consultas (Query Manager)",
      "Configuración de Widgets y Cockpit Fiori"
    ]
  }
}
```

---

## 1. Introducción y Objetivos
Este documento complementa el caso práctico **CSI08_Query_Practice**, proporcionando las resoluciones oficiales, código SQL exacto optimizado para el motor **SAP HANA**, navegación paso a paso en la interfaz de SAP Business One 10.0 y los lineamientos pedagógicos para su explicación en video o simulación interactiva.

---

## 2. Solución Detallada por Tarea

### Tarea 1: Informe de Lista de Clientes con Saldos (Tabla OCRD)
**Objetivo:** Obtener un listado de clientes activos excluyendo proveedores y prospectos, totalizar los saldos y almacenar la consulta en una categoría con permisos controlados.

#### Procedimiento Paso a Paso:
1. Ir a **Herramientas → Consultas → Generador de consultas**.
2. En la casilla superior izquierda, escribir `OCRD` y presionar `Tab`.
3. Seleccionar con doble clic los campos requeridos:
   - `CardCode` (Código de cliente)
   - `CardName` (Nombre o razón social)
   - `Address` (Dirección)
   - `City` (Ciudad de facturación)
   - `ZipCode` (Código postal)
   - `Balance` (Saldo de cuenta)
   - `CntctPrsn` (Persona de contacto)
4. En el panel lateral derecho **Dónde (Where)**:
   - Hacer doble clic en el campo `CardType`.
   - Escribir `= 'C'`.
5. Hacer clic en **Ejecutar**.
6. **Ajuste y Totales:**
   - Hacer doble clic en el encabezado de cualquier columna para ordenar alfabéticamente.
   - Mantener pulsada la tecla `Ctrl` y hacer clic en el encabezado `Balance` para desplegar la suma total al pie de columna.
7. **Guardado y Permisos:**
   - En la vista previa, hacer clic en **Guardar**.
   - En la ventana de guardado, seleccionar **Tratar Categorías** y crear la categoría `Ventas` (`Sales`).
   - Pulsar **Asignar Grupo** y vincular la categoría al grupo **Saved Queries – Group No.1**.
   - Asignar el nombre `Customer Balance Report` (Informe de Saldo de Clientes) y guardar.

#### Consulta SQL Generada (Sintaxis HANA):
```sql
SELECT 
    T0."CardCode", 
    T0."CardName", 
    T0."Address", 
    T0."City", 
    T0."ZipCode", 
    T0."Balance", 
    T0."CntctPrsn" 
FROM OCRD T0 
WHERE T0."CardType" = 'C'
ORDER BY T0."CardName";
```

---

### Tarea 2: Informe Parametrizado de Facturas Abiertas (Tabla OINV)
**Objetivo:** Permitir al usuario ingresar una fecha dinámica en tiempo de ejecución para filtrar facturas con saldo pendiente.

#### Procedimiento Paso a Paso:
1. Activar **Vista → Información del Sistema** (`Ctrl + Shift + I`).
2. Abrir una Factura de Clientes vacía y posar el ratón para corroborar los campos:
   - Número: `DocNum`
   - Cliente: `CardName`
   - Fecha de contabilización: `DocDate`
   - Total del documento: `DocTotal`
3. En el Generador de Consultas, ingresar la tabla `OINV`.
4. En la cláusula **Dónde (Where)**, configurar:
   - `T0."DocStatus" = 'O'`
   - Escribir `AND` y seleccionar `DocDate`.
   - En el asistente de condiciones, seleccionar **Mayor que (>)** y hacer doble clic en `[%0]`.
5. Ejecutar la consulta:
   - Aparecerá la ventana modal de parámetros.
   - Seleccionar una fecha del selector de calendario y confirmar.
   - Observar que las flechas naranjas de enlace permiten navegar directamente al Socio de Negocios.
6. Guardar en la categoría `Ventas` con el nombre `Lista de Facturas`.

#### Consulta SQL Generada (Sintaxis HANA):
```sql
SELECT 
    T0."DocNum", 
    T0."CardName", 
    T0."DocDate", 
    T0."DocTotal" 
FROM OINV T0 
WHERE T0."DocStatus" = 'O' 
  AND T0."DocDate" > [%0];
```

---

### Tarea 3: Consulta Multitabla Agrupada (OQUT + OSLP)
**Objetivo:** Consolidar el volumen comercial y número de ofertas de ventas abiertas por empleado y cliente.

#### Procedimiento Paso a Paso:
1. En el Generador de Consultas, ingresar `OQUT` y presionar `Tab`.
2. Luego ingresar `OSLP` y presionar `Tab`. El sistema creará automáticamente el vínculo relacional `INNER JOIN`.
3. Seleccionar los campos de agrupación:
   - De OSLP: `SlpName`
   - De OQUT: `CardCode`, `CardName`
4. En el área de selección, incorporar funciones agregadas:
   - `SUM(T0."DocTotal") as "Valor Total"`
   - `COUNT(T0."DocNum") as "Nro de Documentos"`
5. Cláusula de filtrado: `T0."DocStatus" = 'O'`.
6. En **Ordenar por (Sort By)**: seleccionar `T1."SlpName"`.
7. En **Agrupar por (Group By)**: incluir obligatoriamente `T1."SlpName"`, `T0."CardCode"`, `T0."CardName"`.

#### Consulta SQL Generada (Sintaxis HANA):
```sql
SELECT 
    T1."SlpName", 
    T0."CardCode", 
    T0."CardName", 
    SUM(T0."DocTotal") AS "Valor Total", 
    COUNT(T0."DocNum") AS "Nro de Documentos" 
FROM OQUT T0 
INNER JOIN OSLP T1 ON T0."SlpCode" = T1."SlpCode" 
WHERE T0."DocStatus" = 'O' 
GROUP BY T1."SlpName", T0."CardCode", T0."CardName" 
ORDER BY T1."SlpName";
```

---

### Tarea 4: Lista de Trabajo con Acumulado Continuo (ORDR + OSLP)
**Objetivo:** Diseñar una consulta analítica de pedidos del día con cálculo acumulado progresivo por representante para su uso en alertas automáticas.

#### Procedimiento Paso a Paso:
1. Seleccionar tablas `ORDR` y `OSLP`.
2. Emplear la función de ventana analítica de SAP HANA `SUM(...) OVER (PARTITION BY ... ORDER BY ...)`.
3. Filtrar por la fecha del sistema (`CURRENT_DATE`).
4. Guardar como `Pedidos de Ventas de Hoy` en la categoría `Ventas`.

#### Consulta SQL Generada (Sintaxis HANA):
```sql
SELECT 
    T1."SlpName", 
    T0."DocNum", 
    T0."CardCode", 
    T0."DocTotal", 
    T0."DiscPrcnt", 
    SUM(T0."DocTotal") OVER (
        PARTITION BY T1."SlpName" 
        ORDER BY T0."DocNum"
    ) AS "Acumulado Representante" 
FROM ORDR T0 
INNER JOIN OSLP T1 ON T0."SlpCode" = T1."SlpCode" 
WHERE T0."DocDate" = CURRENT_DATE;
```

---

### Tarea 5: Consulta e Integración de Widget en Cockpit (Tabla ODLN)
**Objetivo:** Supervisar en tiempo real las entregas del día desde el panel Fiori del usuario mediante un Widget de Recuento.

#### Procedimiento Paso a Paso:
1. **Creación de la Consulta:**
   - Extraer documentos de entrega `ODLN` contabilizados en la fecha actual.
   - Guardar con el nombre técnico `Deliveries_Today`.
2. **Configuración del Widget:**
   - Navegar a **Herramientas → Cockpit → Configuración de widget de recuento**.
   - Cambiar a modo **Crear / Añadir**.
   - Código: `W_DELIV_TODAY`.
   - Nombre: `Entregas de Hoy`.
   - Vincular a la consulta `Deliveries_Today` mediante el botón **Seleccionar consulta**.
3. **Despliegue en Cockpit:**
   - Hacer clic en el icono del **Lápiz** (Editar Cockpit).
   - Presionar `+` para abrir la **Galería de Widgets**.
   - Filtrar por categoría **Recuento de Objetos de Negocio**.
   - Seleccionar el widget `Entregas de Hoy` (aparece check verde).
   - Guardar cambios en el cockpit con el check superior.

#### Consulta SQL Generada (Sintaxis HANA):
```sql
SELECT 
    T0."DocNum" 
FROM ODLN T0 
WHERE T0."DocDate" = CURRENT_DATE;
```

---

## 3. Consideraciones Críticas de Rendimiento en SAP HANA
1. **Distinción de Mayúsculas / Minúsculas (Case Sensitivity):** En SAP HANA, los identificadores de campo creados por la aplicación deben delimitarse siempre con comillas dobles (ej. `T0."CardCode"`), de lo contrario el motor arrojará el error `invalid column name`.
2. **Valores Nulos en Agrupaciones:** Si existen ofertas sin empleado asignado (`SlpCode = -1`), se recomienda manejarlo mediante funciones de sustitución como `IFNULL(T1."SlpName", 'Sin Asignar')`.
3. **Uso de Variables de Interfaz:** Las variables `[%0]`, `[%1]` deben colocarse sin comillas cuando interactúan con el analizador léxico de SAP Business One.
