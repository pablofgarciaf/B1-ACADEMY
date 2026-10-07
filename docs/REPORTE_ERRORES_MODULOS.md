# 📋 MAPEO COMPLETO DE ERRORES E INCONSISTENCIAS POR MODULO - B1 ACADEMY

> Auditoria Tecnica Automatizada de Contenido y Simulador
> Total de practicas con inconsistencias o texto redundante detectadas: 159

## 🔍 Resumen General

- **Redundancia en instrucciones:** La linea 'Datos a registrar: ...' al final de las instrucciones repite lo que ya esta en la tabla de campos.
- **Inconsistencias en rutas/menus:** Prácticas que usan menus superiores o que carecen de boton directo de cierre.

---

### MOD1 (5 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod1-c1 | 8 | Consultar artículo en stock | Inventario > Datos maestros de artículo | REDUNDANCIA_DATOS | Datos a registrar: Descripción = Laptop Dell Latitude 3420; Precio = 850.00; Costo = 650.00; IVA = IVA 15%. |
| mod1-c2 | 5 | Iniciar sesión en B1 Center | Gestión > Seleccionar empresa | REDUNDANCIA_DATOS | Datos a registrar: Usuario = manager; Contraseña = B1Admin2026. |
| mod1-c2 | 10 | Crear tu propio cockpit | Herramientas > Cockpit > Gestión de Cockpit | REDUNDANCIA_DATOS | Datos a registrar: Nombre del cockpit = Mi Cockpit Ventas; Descripción = Cockpit del área de ventas. |
| mod1-c3 | 5 | Crear nuevo cliente | Interlocutores comerciales > Datos maestros interlocutor comercial | REDUNDANCIA_DATOS | Datos a registrar: Lista de precios = Lista 1. |
| mod1-c4 | 5 | Ajustar formatos de visualización | Gestión > Inicialización del sistema > Parametrizaciones generales | REDUNDANCIA_DATOS | Datos a registrar: Formato de fecha = DD/MM/AAAA; Decimales en importes = 2. |

### MOD2 (3 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod2-c1 | 6 | Registrar cliente potencial | Interlocutores comerciales > Datos maestros interlocutor comercial | REDUNDANCIA_DATOS | Datos a registrar: Ciudad = Quito. |
| mod2-c1 | 7 | Convertir potencial a cliente | Interlocutores comerciales > Datos maestros interlocutor comercial | REDUNDANCIA_DATOS | Datos a registrar: Nombre = Maxi-Teq; Grupo de clientes = EDU; Ciudad = Quito. |
| mod2-c2 | 5 | Crear artículo maestro | Inventario > Datos maestros de artículo | REDUNDANCIA_DATOS | Datos a registrar: Descripción 2 = Equipo alto rendimiento. |

### MOD3 (12 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod3-c1 | 5 | Crear pedido de compra | Compras - Proveedores > Pedido | REDUNDANCIA_DATOS | Datos a registrar: Fecha documento = 01/06/2026; Fecha vencimiento = 30/06/2026. |
| mod3-c1 | 7 | Registrar entrada de mercancías | Compras - Proveedores > Entrada de mercancías de pedido | REDUNDANCIA_DATOS | Datos a registrar: Fecha documento = 05/06/2026. |
| mod3-c1 | 8 | Crear factura de proveedor | Compras - Proveedores > Factura de proveedores | REDUNDANCIA_DATOS | Datos a registrar: Fecha documento = 10/06/2026; Fecha vencimiento = 10/07/2026. |
| mod3-c1 | 10 | Efectuar pago al proveedor | Gestión de bancos > Pagos efectuados > Pagos efectuados | REDUNDANCIA_DATOS | Datos a registrar: Banco = Banco Pichincha - Cta Corriente 210001; Fecha pago = 15/06/2026. |
| mod3-c2 | 5 | Crear almacén regional | Gestión > Definición > Inventario > Almacenes | REDUNDANCIA_DATOS | Datos a registrar: Dirección = Av. de las Américas N12-45; Provincia = Azuay; Código Postal = 010101. |
| mod3-c2 | 6 | Activar gestión de depósito | Gestión > Definición > Inventario > Almacenes | REDUNDANCIA_DATOS | Datos a registrar: Código = 03; Nombre = Almacén Regional Cuenca; Gestión de depósito = Activado; Formato de depósito = ISLA-ESTERIA-NIVEL; Longitud isla = 2; Longitud estantería = 2. |
| mod3-c2 | 7 | Registrar entrada de stock | Inventario > Operaciones de stock > Entrada de mercancías | REDUNDANCIA_DATOS | Datos a registrar: Artículo = A00003; Descripción = Monitor Lenovo ThinkVision 24"; Precio = 120.00. |
| mod3-c2 | 9 | Registrar salida por daño | Inventario > Operaciones de stock > Salida de mercancías | REDUNDANCIA_DATOS | Datos a registrar: Artículo = A00004; Descripción = Teclado Inalámbrico Logitech; Costo = 25.00. |
| mod3-c3 | 7 | Trasladar mouse a ubicación | Inventario > Informes de inventario > Lista de contenido de la ubicación | REDUNDANCIA_DATOS | Datos a registrar: Fecha = 15/06/2026. |
| mod3-c3 | 8 | Asignar mouse en pedido | Inventario > Ubicaciones > Gestión de códigos de subniveles de almacén | REDUNDANCIA_DATOS | Datos a registrar: Disponible = 25. |
| mod3-c4 | 10 | Consultar historial de serie | Inventario > Informes de Inventario > Informe de Auditoría de Inventario de Lotes/Series | REDUNDANCIA_DATOS | Datos a registrar: Tipo de movimiento = Entrada, Salida; Documento = EP, ENT, FAC. |
| mod3-c5 | 7 | Crear tipo de gasto seguro | Administración > Configuración > Compras > Costos de Importación | REDUNDANCIA_DATOS | Datos a registrar: Método de Distribución = Ninguno. |

### MOD4 (10 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod4-c1 | 6 | Generar entrega desde pedido | Ventas - Clientes > Entrega | REDUNDANCIA_DATOS | Datos a registrar: Fecha = 06/04/2026. |
| mod4-c1 | 10 | Registrar cobro con descuento | Gestión de bancos > Pagos recibidos | REDUNDANCIA_DATOS | Datos a registrar: Fecha = 10/04/2026. |
| mod4-c2 | 6 | Convertir oferta a pedido | Ventas - Clientes > Pedido de cliente | REDUNDANCIA_DATOS | Datos a registrar: Artículo = A00009. |
| mod4-c2 | 7 | Verificar disponibilidad | Ventas - Clientes > Pedido de cliente | REDUNDANCIA_DATOS | Datos a registrar: Artículo = A00009. |
| mod4-c2 | 8 | Crear pedido con descuento | Ventas - Clientes > Pedido de cliente | REDUNDANCIA_DATOS | Datos a registrar: Descuento % = 1.00. |
| mod4-c2 | 9 | Usar asistente de documentos | Ventas - Clientes > Asistente de creación de documentos | REDUNDANCIA_DATOS | Datos a registrar: Artículo = A00006. |
| mod4-c3 | 5 | Crear pedido de cliente | Ventas - Clientes > Pedido de cliente | REDUNDANCIA_DATOS | Datos a registrar: Descuento % = 1.00. |
| mod4-c3 | 6 | Generar nota de entrega | Ventas - Clientes > Entrega | REDUNDANCIA_DATOS | Datos a registrar: Cliente = C20000; Artículo = A00009; Descuento % = 1.00. |
| mod4-c3 | 8 | Facturar la entrega | Ventas - Clientes > Factura de clientes | REDUNDANCIA_DATOS | Datos a registrar: Cliente = C20000; Artículo = A00009. |
| mod4-c3 | 10 | Registrar cobro con descuento | Gestión de bancos > Pagos recibidos | REDUNDANCIA_DATOS | Datos a registrar: Descuento % = 3.00; Fecha documento = 05/04/2026. |

### MOD5 (6 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod5-c1 | 7 | Definir precio por caja | Inventario > Listas de precios > Listas de precios | REDUNDANCIA_DATOS | Datos a registrar: Automático = No. |
| mod5-c2 | 7 | Configurar descuento por período | Inventario > Listas de precios > Precios especiales > Descuentos por período y cantidad | REDUNDANCIA_DATOS | Datos a registrar: Automático = No. |
| mod5-c3 | 5 | Crear grupo de descuento | Inventario > Listas de precios > Precios especiales > Grupos de descuento | REDUNDANCIA_DATOS | Datos a registrar: Descripción = Descuentos para clientes minoristas; Fecha de inicio = 01/01/2026; Fecha de fin = 31/12/2026. |
| mod5-c3 | 8 | Asignar grupo a cliente | Gestión > Definición > Interlocutores comerciales > Grupos de clientes / acreedores | REDUNDANCIA_DATOS | Datos a registrar: Lista de precios = Precio Minorista. |
| mod5-c4 | 7 | Aplicar ajuste masivo de descuento | Inventario > Listas de precios > Precios especiales > Actualización global de precios especiales | REDUNDANCIA_DATOS | Datos a registrar: Fecha de inicio = 01/08/2026; Fecha de fin = 31/08/2026. |
| mod5-c4 | 8 | Copiar precio especial a otros clientes | Inventario > Listas de precios > Precios especiales > Precios especiales para interlocutores comerciales | REDUNDANCIA_DATOS | Datos a registrar: Fecha de inicio = 01/09/2026. |

### MOD6 (7 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod6-c1 | 6 | Crear oportunidad de venta | Interlocutores comerciales > Actividad | REDUNDANCIA_DATOS | Datos a registrar: Descripción = Interés en laptops. |
| mod6-c2 | 5 | Registrar llamada de seguimiento | Interlocutores comerciales > Actividad | REDUNDANCIA_DATOS | Datos a registrar: Asunto = Seguimiento postventa; Fecha de inicio = 05/04/2026; Hora de inicio = 10:00; Interlocutor = C20000 - Maxi-Teq; Usuario responsable = E001 - Juan Pérez. |
| mod6-c2 | 6 | Registrar oportunidad tras llamada | Interlocutores comerciales > Actividad | REDUNDANCIA_DATOS | Datos a registrar: Cliente = C20000 - Maxi-Teq; Valor potencial = 2000.00; Probabilidad = 20 %; Fecha estimada de cierre = 30/06/2026; Descripción = Interés en servidores HP. |
| mod6-c2 | 7 | Crear oferta de servidores | Ventas - Clientes > Oferta de ventas | REDUNDANCIA_DATOS | Datos a registrar: Cliente = C20000 - Maxi-Teq; Artículo = A00006 - Servidor HP ProLiant DL380; Cantidad = 2; Precio unitario = 3200.00; Fecha de validez = 05/07/2026; Comentarios = Oferta válida 90 días. |
| mod6-c2 | 9 | Consultar actividad en calendario | Interlocutores comerciales > Actividad | REDUNDANCIA_DATOS | Datos a registrar: Usuario = E001 - Juan Pérez; Asunto = Seguimiento postventa. |
| mod6-c3 | 6 | Registrar diagnóstico y costos | Servicio > Llamada de servicio | REDUNDANCIA_DATOS | Datos a registrar: Historial = Revisado fuente de poder; Diagnóstico = Falla en placa madre; Costo mano de obra = 40.00; Desplazamiento = 15.00; Solución propuesta = Reemplazar placa. |
| mod6-c4 | 6 | Crear artículo serializado | Inventario > Artículos | REDUNDANCIA_DATOS | Datos a registrar: Descripción = Laptop Dell Latitude 3420. |

### MOD7 (9 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod7-c1 | 6 | Navegar al cajón de Pasivo | Finanzas > Plan de cuentas | REDUNDANCIA_DATOS | Datos a registrar: Cajón = 2 - Pasivo. |
| mod7-c1 | 7 | Ver detalle de cuenta de banco | Finanzas > Detalles de cuenta de mayor | REDUNDANCIA_DATOS | Datos a registrar: Descripción = Banco Pichincha Cta Corriente. |
| mod7-c1 | 11 | Definir límites de saldo | Finanzas > Detalles de cuenta de mayor | REDUNDANCIA_DATOS | Datos a registrar: Fecha inicio = 01/03/2026; Fecha fin = 31/12/2026. |
| mod7-c2 | 6 | Seleccionar método por defecto | Gestión > Inicialización del sistema > Parametrizaciones generales > ficha Inventario > subficha Artículos | REDUNDANCIA_DATOS | Datos a registrar: Método de valoración = Promedio móvil; Gestionar lotes = No; Gestionar series = No. |
| mod7-c2 | 7 | Configurar grupo de artículos | Gestión > Configuración > Inventario > Grupos de artículos > ficha Finanzas | REDUNDANCIA_DATOS | Datos a registrar: Cuenta de existencias = 9000. |
| mod7-c2 | 8 | Asignar artículo al grupo | Inventario > Artículos | REDUNDANCIA_DATOS | Datos a registrar: Código de barras = HP440001. |
| mod7-c3 | 9 | Registrar Gasto de Oficina | Finanzas > Asiento | REDUNDANCIA_DATOS | Datos a registrar: Fecha Contabilización = DD/MM/2026; Debe = 50.00; Haber = 50.00. |
| mod7-c3 | 12 | Anular Gasto de Oficina | Finanzas > Asiento | REDUNDANCIA_DATOS | Datos a registrar: Número de Asiento = XXXX; Fecha Contabilización = DD/MM/2026; Comentario = (Anulación) Asiento XXXX. |
| mod7-c4 | 6 | Crear mes de enero | Gestión > Inicialización del Sistema > Períodos Contables | REDUNDANCIA_DATOS | Datos a registrar: Período = 001; Descripción = Enero 2026. |

### MOD8 (3 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod8-c2 | 8 | Ver recomendaciones de pago | Gestión de bancos > Asistente de pagos | REDUNDANCIA_DATOS | Datos a registrar: Documento = Factura Proveedor. |
| mod8-c3 | 9 | Importar extracto bancario | Gestión de bancos > Extractos de cuenta y reconciliaciones externas > Tratamiento de extracto bancario | REDUNDANCIA_DATOS | Datos a registrar: Moneda = USD. |
| mod8-c4 | 7 | Generar antigüedad de proveedores | Finanzas > Informes financieros > Contabilidad > Antigüedad > Antigüedad de deudas de proveedores | REDUNDANCIA_DATOS | Datos a registrar: Mostrar anticipos = Sí. |

### MOD9 (4 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod9-c1 | 6 | Crear serie para activos | Gestión > Definición > Finanzas > Activos fijos > Series de numeración | REDUNDANCIA_DATOS | Datos a registrar: Longitud = 8. |
| mod9-c1 | 7 | Definir artículo virtual | Finanzas > Activos fijos > Datos maestros de activo fijo > Casilla | REDUNDANCIA_DATOS | Datos a registrar: Artículo de activo = Marcado; Artículo virtual = Marcado. |
| mod9-c2 | 8 | Completar datos maestros | Finanzas > Activos fijos > Datos maestros de activo | REDUNDANCIA_DATOS | Datos a registrar: Descripción = Servidor HP ProLiant DL380. |
| mod9-c3 | 6 | Ejecutar amortización anual | Finanzas > Activos Fijos > Ejecución de Amortización | REDUNDANCIA_DATOS | Datos a registrar: Vista previa = Activar. |

### MOD10 (5 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod10-c1 | 7 | Analizar resultados MRP | Planificación de necesidades > Asistente de planificación de necesidades | REDUNDANCIA_DATOS | Datos a registrar: Recomendación = Orden de compra 100. |
| mod10-c1 | 8 | Crear pedido de compra desde MRP | Planificación de necesidades > Recomendaciones de pedido | REDUNDANCIA_DATOS | Datos a registrar: Fecha requerida = 15/08/2026; Almacén = 01. |
| mod10-c3 | 7 | Configurar monitor para compra | Inventario > Datos maestros de artículo > Pestaña Datos de planificación | REDUNDANCIA_DATOS | Datos a registrar: Proveedor preferido = V10002. |
| mod10-c4 | 6 | Ejecutar el asistente MRP | Planificación de necesidades > Asistente de planificación de necesidades | REDUNDANCIA_DATOS | Datos a registrar: Escenario = MRP_Junio2026. |
| mod10-c4 | 8 | Crear pedido de compra desde MRP | Planificación de necesidades > Recomendaciones de pedido | REDUNDANCIA_DATOS | Datos a registrar: Fecha requerida = 15/06/2026. |

### MOD11 (7 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod11-c1 | 7 | Agregar recurso de máquina | Producción > Lista de materiales | REDUNDANCIA_DATOS | Datos a registrar: Código = R001. |
| mod11-c1 | 8 | Agregar recurso de mano de obra | Producción > Lista de materiales | REDUNDANCIA_DATOS | Datos a registrar: Número de línea = 3; Código = R002. |
| mod11-c1 | 10 | Generar orden de producción | Producción > Orden de producción | REDUNDANCIA_DATOS | Datos a registrar: Número = OP0001. |
| mod11-c1 | 11 | Recibir producción terminada | Producción > Recibo de producción | REDUNDANCIA_DATOS | Datos a registrar: Número = RP0001. |
| mod11-c2 | 5 | Crear orden de producción | Producción > Orden de producción | REDUNDANCIA_DATOS | Datos a registrar: Descripción = Laptop Dell Latitude 3420. |
| mod11-c2 | 7 | Trasladar componentes a planta | Producción > Orden de producción | REDUNDANCIA_DATOS | Datos a registrar: Descripción = Teclado Inalámbrico Logitech; Fecha = 02/05/2026. |
| mod11-c2 | 8 | Informar finalización de producción | Producción > Orden de producción | REDUNDANCIA_DATOS | Datos a registrar: Descripción = Laptop Dell Latitude 3420; Fecha = 02/05/2026. |

### MOD12 (8 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod12-c1 | 5 | Activar Información del sistema | Herramientas > Consultas > Generador de Consultas | REDUNDANCIA_DATOS | Datos a registrar: Función = Mostrar nombres técnicos. |
| mod12-c2 | 5 | Activar alerta de stock mínimo | Gestión > Gestión de alertas | REDUNDANCIA_DATOS | Datos a registrar: Notificación = Interno y Correo; Usuario AlertSvc = Marcado. |
| mod12-c2 | 11 | Habilitar proceso de autorización | Gestión > Inicialización del sistema > Parametrizaciones generales > Pestaña IC | REDUNDANCIA_DATOS | Datos a registrar: Casilla = Habilitar proceso de autorización; Empresa = B1 Center; Reinicio = No requerido. |
| mod12-c3 | 6 | Definir valores para EstadoCliente | Herramientas > Herramientas de customizing > Campos definidos por el usuario - Gestión | REDUNDANCIA_DATOS | Datos a registrar: Obligatorio = No. |
| mod12-c3 | 9 | Registrar instrucciones en pedido | Herramientas > Herramientas de customizing > Campos definidos por el usuario - Gestión | REDUNDANCIA_DATOS | Datos a registrar: Fecha = 15/03/2026; Precio = 850.00. |
| mod12-c4 | 5 | Importar nuevo cliente | Administración > Importación/Exportación de Datos > Importación de Datos > Importar desde Excel | REDUNDANCIA_DATOS | Datos a registrar: CardCode = C20000; CardName = Maxi-Teq; Moneda = USD. |
| mod12-c4 | 6 | Importar nuevo artículo | Administración > Importación/Exportación de Datos > Importación de Datos > Importar desde Excel | REDUNDANCIA_DATOS | Datos a registrar: ItemCode = A00001; ItemName = Laptop Dell Latitude 3420; Precio = 850.00; Costo = 650.00. |
| mod12-c4 | 7 | Actualizar precio de artículo | Administración > Importación/Exportación de Datos > Importación de Datos > Importar desde Excel | REDUNDANCIA_DATOS | Datos a registrar: Lista de precios = 1; ItemCode = A00001; Precio = 850.00; Moneda = USD. |

### MOD13 (7 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod13-c1 | 5 | Crear solicitud de compra | Compras - Proveedores > Solicitud de Compra | REDUNDANCIA_DATOS | Datos a registrar: Descripción = Monitor Lenovo ThinkVision 24"; Comentario = Para presentación de ventas. |
| mod13-c1 | 6 | Generar múltiples cotizaciones | Compras - Proveedores > Asistente para Generación de Ofertas de Compra | REDUNDANCIA_DATOS | Datos a registrar: Número de solicitud = 10000; Artículo = A00003; Cantidad = 2; Proveedores a considerar = 3; Tipo de documento destino = Cotización de Compra. |
| mod13-c1 | 8 | Crear pedido de compra | Compras - Proveedores > Oferta de Compra | REDUNDANCIA_DATOS | Datos a registrar: Código = A00003; Descripción = Monitor Lenovo ThinkVision 24"; Precio unitario = 170.00; Fecha de entrega = 19/06/2026. |
| mod13-c3 | 5 | Crear solicitud devolución | Compras - Proveedores > Solicitud de Devolución de Mercancías | REDUNDANCIA_DATOS | Datos a registrar: Fecha = 15/04/2026; Número RMA = RMA20260415. |
| mod13-c3 | 6 | Crear devolución mercancía | Compras - Proveedores > Devolución de Mercancías | REDUNDANCIA_DATOS | Datos a registrar: Fecha = 16/04/2026. |
| mod13-c3 | 8 | Crear abono proveedor | Compras - Proveedores > Abono de Proveedores | REDUNDANCIA_DATOS | Datos a registrar: Fecha = 20/04/2026. |
| mod13-c3 | 10 | Crear abono sin cantidad | Compras - Proveedores > Abono de Proveedores | REDUNDANCIA_DATOS | Datos a registrar: Fecha = 25/04/2026. |

### MOD14 (6 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod14-c3 | 5 | Crear grupo de artículos | Gestión > Definición > Inventario > Grupos de artículos | REDUNDANCIA_DATOS | Datos a registrar: Código = GEN-001; Nombre = Artículos Genéricos; Método de valoración = Promedio variable. |
| mod14-c3 | 6 | Crear artículo con costo estándar | Inventario > Datos maestros de artículo > Pestaña Datos de inventario | REDUNDANCIA_DATOS | Datos a registrar: Grupo de artículos = GEN-001; Código = A00001; Descripción = Laptop Dell Latitude 3420; Costo estándar = 650.00; Precio de venta = 850.00. |
| mod14-c3 | 7 | Actualizar costo estándar | Inventario > Revalorización de inventario | REDUNDANCIA_DATOS | Datos a registrar: Código = A00001; Costo estándar actual = 650.00; Nuevo costo estándar = 680.00; Fecha de efecto = 01/04/2026; Motivo = Ajuste por inflación. |
| mod14-c4 | 5 | Crear serie de ajuste | Gestión > Inicialización del sistema > Numeración de documentos > Asientos | REDUNDANCIA_DATOS | Datos a registrar: Nombre = Ajuste de Costos; Solo para Ajuste de Contabilidad de Costos = Marcado. |
| mod14-c4 | 6 | Definir cuenta G/L | Finanzas > Plan de cuentas > Detalles de cuenta | REDUNDANCIA_DATOS | Datos a registrar: Solo para Ajuste de Contabilidad de Costos = Marcado; Grupo de cuenta = Gastos Operacionales. |
| mod14-c4 | 7 | Vincular serie y cuenta | Gestión > Inicialización del sistema > Parametrizaciones generales > Ficha Contabilidad de costes | REDUNDANCIA_DATOS | Datos a registrar: Centro de costo predeterminado = NINGUNO; Activar ajuste de costos = Marcado. |

### MOD15 (6 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod15-c2 | 5 | Definir peso en artículo | Inventario > Datos maestros de artículo > Pestaña Datos de inventario > Campo Peso | REDUNDANCIA_DATOS | Datos a registrar: Precio de venta = 130.00. |
| mod15-c2 | 6 | Configurar peso máximo en ubicación | Inventario > Ubicaciones > Datos maestros de ubicación > Campos Peso de artículo y Peso máximo | REDUNDANCIA_DATOS | Datos a registrar: Bodega = 01 - Bodega Central Quito; Peso artículo = 80.000; Peso disponible = 20.000. |
| mod15-c2 | 7 | Activar validación de peso máximo | Gestión > Definición > Inventario > Almacenes > Pestaña Ubicaciones > Validación de peso máximo | REDUNDANCIA_DATOS | Datos a registrar: Unidad de peso = kg. |
| mod15-c4 | 5 | Crear ciclo de inventario | Administración > Configuración > Inventario > Ciclos de Inventario | REDUNDANCIA_DATOS | Datos a registrar: Código = CICLO01; Nombre = Conteo Semestral; Unidad básica = Mensual; Fecha inicio = 01/02/2026. |
| mod15-c4 | 6 | Configurar determinación cíclica | Administración > Configuración > Inventario > Determinación del Recuento Cíclico | REDUNDANCIA_DATOS | Datos a registrar: Frecuencia = 6; Prioridad = 1. |
| mod15-c4 | 7 | Definir fecha de stock | Administración > Inicialización del Sistema > Configuración de Documentos > Por Documento > Documento de Recuento de Inventario | REDUNDANCIA_DATOS | Datos a registrar: Aplica a = Todos los usuarios; Fecha ejemplo = 07/09/2026. |

### MOD16 (6 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod16-c1 | 7 | Generar salida para producción | Inventario > Picking y embalaje > Gestor de picking y embalaje | REDUNDANCIA_DATOS | Datos a registrar: Artículo = A00001; Fecha = 06/04/2026. |
| mod16-c1 | 9 | Registrar entrada desde producción | Inventario > Picking y embalaje > Gestor de picking y embalaje | REDUNDANCIA_DATOS | Datos a registrar: Artículo = A00001; Fecha = 07/04/2026. |
| mod16-c1 | 11 | Filtrar por tipo de fila recurso | Inventario > Picking y embalaje > Gestor de picking y embalaje | REDUNDANCIA_DATOS | Datos a registrar: Descripción = Mano de obra ensamblaje. |
| mod16-c2 | 5 | Crear solicitud de traslado | Inventario > Operaciones de stock > Solicitud de traslado | REDUNDANCIA_DATOS | Datos a registrar: Fecha = 15/06/2026. |
| mod16-c2 | 7 | Liberar a lista de preparación | Inventario > Preparación y Embalaje > Gestor de Preparación | REDUNDANCIA_DATOS | Datos a registrar: Artículo = A00001. |
| mod16-c2 | 9 | Generar documento de traslado | Inventario > Operaciones de stock > Traslado de inventario | REDUNDANCIA_DATOS | Datos a registrar: Artículo = A00001; Cantidad = 5; Fecha = 15/06/2026. |

### MOD17 (2 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod17-c2 | 8 | Vista previa del asiento contable | Ventas - Clientes > Factura de clientes | REDUNDANCIA_DATOS | Datos a registrar: Cuenta de Cliente = C20000. |
| mod17-c4 | 5 | Generar Balance al 31/12/2026 | Finanzas > Informes financieros > Financiero > Balance | REDUNDANCIA_DATOS | Datos a registrar: Ordenar por cuenta = Código. |

### MOD18 (2 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod18-c2 | 9 | Ejecutar informe por departamento | Finanzas > Contabilidad de costes > Informe de centro de coste | REDUNDANCIA_DATOS | Datos a registrar: Periodo = 01/2026; Gasos eléctricos = 60.00; Total gastos = 60.00. |
| mod18-c3 | 5 | Inicializar el presupuesto | Gestión > Inicialización del sistema > Parametrizaciones generales > Ficha Presupuesto | REDUNDANCIA_DATOS | Datos a registrar: Inicialización del Presupuesto = Marcado. |

### MOD19 (7 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod19-c1 | 7 | Solicitar anulación de factura | Compras - Proveedores > Factura de Proveedores | REDUNDANCIA_DATOS | Datos a registrar: Tipo de Documento = Factura de Proveedores; Fecha de Emisión = 05/04/2026. |
| mod19-c1 | 8 | Ver retenciones calculadas | Compras - Proveedores > Factura de Proveedores | REDUNDANCIA_DATOS | Datos a registrar: Base Imponible = 890.00. |
| mod19-c2 | 8 | Generar comprobante de retención | Compras - Proveedores > Factura de Proveedores | REDUNDANCIA_DATOS | Datos a registrar: Fecha = 05/04/2026; Proveedor = V10000. |
| mod19-c3 | 8 | Generar comprobante de retención | Compras - Proveedores > Factura de Proveedores | REDUNDANCIA_DATOS | Datos a registrar: Proveedor = V10000; Fecha = 15/06/2026. |
| mod19-c4 | 6 | Registrar factura de proveedor | Compras - Proveedores > Factura de proveedores | REDUNDANCIA_DATOS | Datos a registrar: Proveedor = V10000; Fecha de contabilización = 05/04/2026; Artículo = A00001; Precio unitario = 850.00. |
| mod19-c5 | 6 | Configurar proveedor para retenciones | Interlocutores comerciales > Datos maestros interlocutor comercial | REDUNDANCIA_DATOS | Datos a registrar: Categoría fiscal = No especial. |
| mod19-c7 | 5 | Registrar el RUC de B1 Center | Gestión > Inicialización del sistema > Detalles de la empresa | REDUNDANCIA_DATOS | Datos a registrar: Dirección = Av. El Salvador N34-12, Quito. |

### MOD20 (5 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod20-c1 | 5 | Crear recurso de trabajo | Recursos > Datos maestros del recurso | REDUNDANCIA_DATOS | Datos a registrar: Código = TRAB001; Nombre = Operario CNC. |
| mod20-c1 | 6 | Crear recurso de máquina | Recursos > Datos maestros del recurso | REDUNDANCIA_DATOS | Datos a registrar: Código = MAQ001; Nombre = Torno CNC Principal. |
| mod20-c1 | 7 | Configurar tiempo de ejecución | Recursos > Datos maestros del recurso | REDUNDANCIA_DATOS | Datos a registrar: U. de medida = Horas. |
| mod20-c2 | 7 | Analizar capacidad disponible | Recursos > Capacidad de recursos | REDUNDANCIA_DATOS | Datos a registrar: Periodo = 01/03/2026 - 31/03/2026. |
| mod20-c3 | 6 | Visualizar etapas ruta | Producción > Orden de producción > Menú contextual > Enviar componentes | REDUNDANCIA_DATOS | Datos a registrar: Etapa = 1. |

### MOD21 (17 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod21-c1 | 7 | Definir serie por defecto para Ana | Gestión > Inicialización del sistema > Numeración de documento | REDUNDANCIA_DATOS | Datos a registrar: Grupo de serie = 2. |
| mod21-c1 | 9 | Configurar formato CLI-1000-2026 | Gestión > Inicialización del sistema > Numeración de documento | REDUNDANCIA_DATOS | Datos a registrar: Tipo de documento = Datos maestros de clientes. |
| mod21-c2 | 5 | Previsualizar formatos disponibles | Administración > Configuración > General > Gestor de Informes y Formatos | REDUNDANCIA_DATOS | Datos a registrar: Número = FV-000123; Cliente = C20000; Fecha = 15/04/2026; Total = 1150.00; Formato activo = Factura Estándar. |
| mod21-c2 | 6 | Editar un formato PLD | Administración > Configuración > General > Gestor de Informes y Formatos | REDUNDANCIA_DATOS | Datos a registrar: Logo = Insertado; Dirección = Av. República de El Salvador; Pie de página = Gracias por su compra. |
| mod21-c3 | 4 | Configurar método de correo | Administración > Inicialización del Sistema > Configuración General > Pestaña Servicios | REDUNDANCIA_DATOS | Datos a registrar: Servidor SMTP = smtp.b1center.com; Puerto = 587; Usuario = sap_mailer. |
| mod21-c3 | 5 | Configurar preferencias de oferta | Administración > Inicialización del Sistema > Preferencias de Impresión > Por Documento | REDUNDANCIA_DATOS | Datos a registrar: Asunto = Oferta de ventas - B1 Center; Cuerpo = Estimado cliente, adjuntamos su oferta.; Persona de contacto = Predeterminada del documento. |
| mod21-c3 | 6 | Enviar ofertas en lote | Ventas > Impresión de Documentos A/R | REDUNDANCIA_DATOS | Datos a registrar: Documentos seleccionados = 3 ofertas; Asunto = Oferta de ventas - B1 Center; Cuerpo = Estimado cliente, adjuntamos su oferta.; Correo electrónico = Habilitado; Adjunto = PDF generado. |
| mod21-c3 | 7 | Asignar grupo de correo | Interlocutores comerciales > Datos maestros de interlocutor comercial > Ficha Personas de contacto | REDUNDANCIA_DATOS | Datos a registrar: Correo electrónico = ana.lopez@maxiteq.com. |
| mod21-c4 | 5 | Activar propiedad de datos | Gestión > Inicialización del sistema > Parametrizaciones generales > Ficha IC | REDUNDANCIA_DATOS | Datos a registrar: Habilitar la propiedad de los datos = Marcado; Permitir interlocutores sin propietario = Marcado. |
| mod21-c4 | 7 | Asignar propietario a cliente | Gestión > Inicialización del sistema > Autorizaciones > Propiedad de datos > Autorizaciones de propiedad de datos | REDUNDANCIA_DATOS | Datos a registrar: Ciudad = Quito; Teléfono = 023456789. |
| mod21-c4 | 9 | Acceder a factura de cliente | Gestión > Inicialización del sistema > Autorizaciones > Propiedad de datos > Autorizaciones de propiedad de datos | REDUNDANCIA_DATOS | Datos a registrar: Cliente = C20000 Maxi-Teq; Propietario = E002 María Gómez; Fecha = 15/06/2026; Total = 1150.00. |
| mod21-c5 | 8 | Crear grupo de ventas | Gestión > Definición > General > Grupos de usuarios | REDUNDANCIA_DATOS | Datos a registrar: Fecha inicio = 01/06/2026; Fecha fin = 31/12/2026. |
| mod21-c5 | 9 | Configurar política alta de claves | Gestión > Configuración > General > Seguridad > Gestión de claves de acceso | REDUNDANCIA_DATOS | Datos a registrar: Bloqueo automático = Activado. |
| mod21-c6 | 5 | Activar alerta de stock mínimo | Gestión > Gestión de alertas | REDUNDANCIA_DATOS | Datos a registrar: Método = Interno. |
| mod21-c6 | 7 | Crear alerta de usuario semanal | Gestión > Gestión de alertas | REDUNDANCIA_DATOS | Datos a registrar: Consulta = Consulta_stock_bajo. |
| mod21-c6 | 9 | Asignar autorizaciones de ventas | Gestión > Inicialización del sistema > Autorizaciones > Autorizaciones generales | REDUNDANCIA_DATOS | Datos a registrar: Compras = No; Finanzas = No. |
| mod21-c6 | 10 | Copiar autorizaciones entre usuarios | Gestión > Inicialización del sistema > Autorizaciones > Autorizaciones generales | REDUNDANCIA_DATOS | Datos a registrar: Incluir jefe = No. |

### MOD22 (3 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod22-c1 | 6 | Agregar campo Nombre | Herramientas > Herramientas de customizing > Campos definidos por el usuario - Gestión | REDUNDANCIA_DATOS | Datos a registrar: Descripción = Nombre completo del conductor. |
| mod22-c2 | 6 | Definir medida y dimensión | Herramientas > Informe de Excel y análisis interactivo | REDUNDANCIA_DATOS | Datos a registrar: Área de destino = Listo para arrastrar. |
| mod22-c2 | 7 | Seleccionar gráfico circular | Herramientas > Informe de Excel y análisis interactivo | REDUNDANCIA_DATOS | Datos a registrar: Vista previa = Muestra % por cliente; Otros clientes = Distribuidos en secciones; Leyenda = Código y valor. |

### MOD23 (3 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod23-c2 | 4 | Ingresar datos empresa | Gestión > Seleccionar empresa > Nueva con el asistente | REDUNDANCIA_DATOS | Datos a registrar: Tipo de licencia = Prueba 31 días. |
| mod23-c2 | 5 | Definir períodos contables | Gestión > Inicialización del sistema > Centro de implementación > Tareas de implementación > Configurar parametrizaciones de empresa | REDUNDANCIA_DATOS | Datos a registrar: Rango de vencimiento = Más amplio que contabilización. |
| mod23-c3 | 7 | Ingresar saldo de apertura de caja | Administración > Inicialización del Sistema > Saldos de Apertura > Saldo de Apertura de Cuentas G/L | REDUNDANCIA_DATOS | Datos a registrar: Origen = OB. |

### MOD24 (7 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod24-c1 | 5 | Asignar plantilla de cockpit | Herramientas > Cockpit > Seleccionar Plantilla de Cockpit | REDUNDANCIA_DATOS | Datos a registrar: Descripción = Cockpit de Ventas estilo Fiori. |
| mod24-c2 | 6 | Convertir oferta en pedido | Compras - Proveedores > Pedido | REDUNDANCIA_DATOS | Datos a registrar: Código socio de negocios = V10000; Fecha = 02/05/2026; Código de artículo = A00001; Cantidad = 10; Precio unitario = 850.00; Impuesto = 15. |
| mod24-c2 | 7 | Registrar entrada de mercancías | Compras - Proveedores > Entrada de Mercancías por Pedido | REDUNDANCIA_DATOS | Datos a registrar: Código socio de negocios = V10000; Código de artículo = A00001; Precio unitario = 850.00. |
| mod24-c2 | 9 | Registrar factura de proveedor | Compras - Proveedores > Factura de Proveedores | REDUNDANCIA_DATOS | Datos a registrar: Código socio de negocios = V10000; Código de artículo = A00001; Cantidad = 10; Precio unitario = 850.00; Impuesto = 15. |
| mod24-c2 | 11 | Ejecutar pago al proveedor | Herramientas > Consultas > Generador de Consultas | REDUNDANCIA_DATOS | Datos a registrar: Código socio de negocios = V10000; Fecha = 10/05/2026. |
| mod24-c3 | 14 | Guardar consulta en Ventas | Herramientas > Consultas > Generador de Consultas | REDUNDANCIA_DATOS | Datos a registrar: Nombre consulta = Facturas Abiertas por Fecha; Descripción = Facturas O > [%0]. |
| mod24-c3 | 15 | Vincular consulta a alarma | Gestión > Alarmas > Gestión de Alarmas | REDUNDANCIA_DATOS | Datos a registrar: Nombre alarma = Límite de crédito superado; Consulta base = Facturas Abiertas por Fecha; Condición = Balance > CreditLine. |

### MOD25 (9 incidencias)

| Clase | Lamina | Titulo de la Practica | Menu / Ruta | Tipo | Detalle |
| :--- | :---: | :--- | :--- | :--- | :--- |
| mod25-c1 | 5 | Crear al empleado Pedro Andrade | Recursos humanos > Datos maestros de empleado | REDUNDANCIA_DATOS | Datos a registrar: N° de cédula = 1704444445; Cargo = Asistente de Bodega. |
| mod25-c3 | 5 | Ejecutar rol de Carlos López mayo | Finanzas > Asiento | REDUNDANCIA_DATOS | Datos a registrar: Anticipo = 0.00. |
| mod25-c4 | 8 | Pagar sueldos netos por transferencia | Gestión de bancos > Pagos efectuados > Pagos efectuados | REDUNDANCIA_DATOS | Datos a registrar: Contrapartida = 2.1.05 Sueldos por pagar; Referencia = Nómina abr-26. |
| mod25-c4 | 9 | Pagar planilla del IESS | Gestión de bancos > Pagos efectuados > Pagos efectuados | REDUNDANCIA_DATOS | Datos a registrar: Contrapartida = 2.1.04 IESS por pagar; Referencia = Planilla IESS abr-26. |
| mod25-c5 | 6 | Ejecutar rol de Juan Pérez con comisión | Finanzas > Asiento | REDUNDANCIA_DATOS | Datos a registrar: Comisión = 300.00; Referencia 1 = Rol Junio E001. |
| mod25-c5 | 9 | Ejecutar rol de Ana Silva | Finanzas > Asiento | REDUNDANCIA_DATOS | Datos a registrar: Días Trabajados = 30; Referencia 1 = Rol Mayo E004. |
| mod25-c6 | 7 | Calcular impuesto a la renta | Finanzas > Asiento | REDUNDANCIA_DATOS | Datos a registrar: Referencia = Cierre 2026. |
| mod25-c6 | 9 | Calcular anticipo impuesto | Finanzas > Asiento | REDUNDANCIA_DATOS | Datos a registrar: Referencia = Anticipo 2027. |
| mod25-c6 | 11 | Calcular anticipo con retenciones | Finanzas > Asiento | REDUNDANCIA_DATOS | Datos a registrar: Referencia = Anticipo 2027. |
