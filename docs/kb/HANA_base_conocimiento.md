# SAP HANA: base de conocimiento (pendiente de integrar al simulador)

> Estado: **borrador listo para integrar**. Aún no está conectado al simulador ni al tutor IA.
> Lo marcado con ⚠ debe verificarse contra la documentación oficial vigente antes de enseñarlo como cierto.

## 1. Qué es (y qué NO es)

- **HANA es una base de datos en memoria**, orientada a columnas, más una plataforma de procesamiento. **No es una aplicación de negocio** y no tiene "pantallas de ventas o contabilidad".
- Lo que ve el usuario (pedidos, facturas, asientos) lo pone **la aplicación** encima: SAP Business One o S/4HANA.
- Por eso en los videos de B1 "HANA" aparece como *versión de base de datos* de B1, no como un módulo.

## 2. Relación con cada producto

| Producto | Relación con HANA |
|---|---|
| **SAP Business One** | Se ofrece **sobre SQL Server o sobre HANA** (versión "for SAP HANA"). Mismas pantallas y procesos; cambia la base de datos y algunas capacidades. ⚠ Confirmar matriz vigente (PAM) de la versión 10.0 FP que se enseñe. |
| **S/4HANA** | Solo corre sobre HANA. Es otro ERP (no es B1). |
| **Fiori** | Es la capa de interfaz. No depende de HANA por sí misma, pero S/4HANA la usa como UI principal. |

## 3. Conceptos que un alumno debe dominar

1. **In-memory:** los datos viven en RAM; las consultas analíticas son mucho más rápidas que en disco.
2. **Columnar:** se almacena por columna; ideal para agregaciones (sumar ventas por mes).
3. **Compresión:** reduce el tamaño de memoria usado.
4. **Esquemas:** en B1 sobre HANA hay un esquema común (`SBOCOMMON`) y un esquema por cada sociedad (empresa).
5. **Herramientas de administración:** SAP HANA Cockpit / Database Explorer ⚠ (los nombres cambian entre versiones).
6. **Respaldo y recuperación:** copias de seguridad del sistema y del esquema de la empresa; tema típico de examen.

## 4. Impacto directo en Query Manager de B1 (lo más práctico)

Las consultas en Query Manager **se escriben distinto** según la base de datos.

| Aspecto | SQL Server (T-SQL) | HANA (SQL de HANA) |
|---|---|---|
| Nombres de tabla/campo | `OCRD.CardCode` | `"OCRD"."CardCode"` (comillas dobles, sensible a mayúsculas) |
| Concatenar texto | `a + b` | `a \|\| b` |
| Limitar filas | `SELECT TOP 10 ...` | `SELECT ... LIMIT 10` |
| Fecha actual | `GETDATE()` | `CURRENT_DATE` |
| Valor nulo | `ISNULL(x, 0)` | `IFNULL(x, 0)` |
| Parámetros de usuario | `[%0]`, `$[...]` | igual (lo resuelve B1) |

Ejemplo equivalente (clientes):

```sql
-- SQL Server
SELECT T0.CardCode, T0.CardName FROM OCRD T0 WHERE T0.CardType = 'C'

-- HANA
SELECT T0."CardCode", T0."CardName" FROM "OCRD" T0 WHERE T0."CardType" = 'C'
```

## 5. Qué mejora HANA en B1 (a nivel de enseñanza)

- Informes y consultas pesadas más rápidos. ⚠ Evitar prometer cifras concretas de velocidad.
- Búsqueda empresarial y analítica integrada ("Analytics powered by HANA"). ⚠ Verificar disponibilidad por versión.
- Menor tiempo de cierres y reportes con mucho volumen.

## 6. Qué debería simular el simulador (propuesta)

- Un **selector de base de datos** en el laboratorio de Query Manager: el mismo ejercicio se valida con sintaxis T-SQL **o** HANA, con feedback de la IA sobre la diferencia.
- Ejercicios de "traduce esta consulta de SQL Server a HANA".
- Una lección corta de arquitectura: aplicación (B1/S4) vs. base de datos (HANA) vs. interfaz (Fiori).

## 7. Pendientes para integrar

- [ ] Verificar ⚠ contra documentación oficial (versión B1 que se enseñe).
- [ ] Capturas reales de Cockpit/Query Manager en HANA (los canales PlanetSAP y SAP Help pueden aportarlas).
- [ ] Campo `sistema: hana` en las fichas de `docs/kb/` cuando existan imágenes.
- [ ] Ejercicios de traducción T-SQL ↔ HANA con validador.
