# Guion de Video: DOC 102 CSL02 CaseStudy Procurement Solution

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 102 CSL02 CaseStudy Procurement Solution.

## Contenido Principal (Visual: Diapositivas correspondientes)
Solución Técnica Integral: Caso Práctico CSL02 - Proceso de Aprovisionamiento y Compras
Metadatos Técnicos
Módulo SAP: Gestión de Compras, Inventario Permanente y Finanzas (Procurement & Payables)
Código de Unidad: 102_CSL02_Procurement_Process_Solution_ES
Versión Oficial: SAP Business One 10.0, versión para SAP HANA
Audiencia Objetivo: Consultores Funcionales de Compras, Contadores y Analistas de Procesos.



{

  "antigravity_master_schema": {

    "module": "Purchasing & Inventory Valuation - Full Solution",

    "version": "10.0 HANA",

    "technical_flow": {

      "step_1": "Creación de OPOR con 4 líneas a proveedor V10000",

      "step_2": "Copiado selectivo (Copiar de Pedidos -> Personalizar) a primera OPDN (líneas I00004=50, I00007=25, I00008=15)",

      "step_3": "Segunda OPDN con copia de remanentes, edición de I00004=30 e inserción libre de I00003=20 tras verificar stock",

      "step_4": "Cierre de fila en OPOR para I00004 (20 u) y copiado múltiple consolidado de 2 OPDNs a Factura OPCH",

      "step_5": "Factura directa OPCH para I00008 e I00009; consulta de asiento vía Comentario de Asiento, Vista Previa o Mapa de Relaciones",

      "step_6": "Creación de Pago Efectuado OVPM seleccionando 2 facturas y cálculo automático con Ctrl + B"

    },

    "database_impact": {

      "OPOR": "Status final 'Cerrado' tras entrega y cierre manual de saldo remanente",

      "OPDN": "2 entradas registradas debitando Cuenta de Existencias y acreditando Cuenta de Dotación de Mercancías (EM/RF)",

      "OPCH": "Factura de proveedor consolidada debitando EM/RF y acreditando Cuenta de Proveedor (V10000)",

      "OVPM": "Pago efectuado debitando Proveedor (V10000) y acreditando Banco"

    }

  }

}


1. Ejecución y Resolución Técnica Detallada
Solución Tarea 1: Creación del Pedido de Compra (OPOR)
Vaya a Compras - Proveedores -> Pedido (OPOR).
Seleccione el proveedor V10000 en el campo Proveedor.
En la cuadrícula de contenido, ingrese las líneas de artículos:
Fila 1: I00002 | Cantidad: 50
Fila 2: I00004 | Cantidad: 100
Fila 3: I00007 | Cantidad: 25
Fila 4: I00008 | Cantidad: 15
Presione Crear y visualizar. Se genera el documento base con estatus Abierto.
Solución Tarea 2: Entrada Parcial de Mercancías (OPDN)
Vaya a Compras - Proveedores -> Entrada de mercancías OP (OPDN).
Seleccione el proveedor V10000.
Haga clic en el botón inferior Copiar de -> Pedidos.
Seleccione el pedido creado en la Tarea 1.
En la ventana del asistente de arrastre, elija la opción Personalizar y presione Siguiente:
Seleccione las filas I00004, I00007 e I00008.
En la fila I00004, modifique la cantidad a 50.
Desmarque o no seleccione la fila I00002.
Haga clic en Finalizar. Presione Crear.
Alternativa Técnica: Copiar todo el documento directamente y, en la cuadrícula de la entrada de mercancías, ajustar la cantidad de I00004 a 50 y hacer clic derecho sobre la fila de I00002 seleccionando Borrar línea.
Solución Tarea 3: Modificaciones en Segunda Recepción y Verificación de Stock
Identificación de Saldo Abierto: Al consultar el Pedido original (OPOR), las líneas de I00007 e I00008 aparecen en gris (cerradas). Las líneas I00002 (50 pendientes) e I00004 (50 pendientes) permanecen en blanco.
Copiado de Restantes: Desde el Pedido, haga clic en Copiar en -> Entrada de mercancías.
Modificación de Cantidades e Inserción:
Ajuste la cantidad de I00004 de 50 a 30.
En una nueva línea, ingrese el artículo no pedido I00003 con cantidad 20.
Tres Métodos de Verificación de Stock sin Salir del Documento:
Opción A (Datos Maestros de Artículo): Haga clic en la flecha de enlace naranja junto a I00004 e I00003. Vaya a la ficha Datos de stock para revisar el Stock, Comprometido y Disponible por almacén.
Opción B (Stock por Almacenes - Ctrl + Tab): Haga clic en el campo Almacén de la fila y presione Ctrl + Tab. Se abre la ventana modal de inventario consolidado por almacén para dicho artículo.
Opción C (Menú Contextual de Disponibilidad): Haga clic derecho sobre la línea del artículo y seleccione Disponibilidad. El sistema despliega la ventana flotante con el balance de existencias en tiempo real.
Al comprobar que las cantidades son adecuadas, presione Crear.
Solución Tarea 4: Cierre de Fila y Facturación Consolidada
Cierre de Fila en Pedido Base:
Abra el Pedido de Compra original (OPOR).
Localice la fila de I00004 donde figuran 20 unidades pendientes.
Haga clic derecho sobre la línea y seleccione Cerrar línea.
Confirme el mensaje del sistema ("¿Desea cerrar las líneas seleccionadas?") y presione Actualizar. El documento completo pasa a estatus Cerrado.
Consolidación en Factura de Proveedor (OPCH):
Vaya a Compras - Proveedores -> Factura de proveedores.
Seleccione el proveedor V10000.
Haga clic en Copiar de -> Entrada de mercancías.
En la lista de documentos pendientes, mantenga presionada la tecla Ctrl y seleccione ambas entradas de mercancías (la de la Tarea 2 y la de la Tarea 3).
En el asistente, seleccione Arrastrar todos los datos y presione Finalizar.
La factura resultante contendrá todas las partidas entregadas (mostrando el artículo I00004 en dos filas separadas con su trazabilidad de origen). Presione Crear.
Solución Tarea 5: Compra Urgente sin Recepción Previa y Auditoría Contable
Facturación Directa: Abra Compras - Proveedores -> Factura de proveedores (OPCH). Ingrese V10000, fecha de contabilización y agregue I00008 (25 u) e I00009 (5 u).
Al crearse una factura de proveedor sin documento base, el sistema realiza simultáneamente el débito al inventario físico y el crédito al pasivo del proveedor en un único asiento contable.
Tres Vías para Visualizar el Asiento Contable:
Vía 1 (Comentario de Asiento): En la ficha Finanzas de la factura, haga clic en la flecha naranja situada junto al campo Comentario de diario (TransId).
Vía 2 (Vista Previa de Asiento): Antes o después de la creación, presione el ícono de Vista previa de asiento en la barra superior.
Vía 3 (Mapa de Relaciones): Haga clic derecho en la factura, elija Mapa de relaciones, seleccione en la esquina superior izquierda Documentos de marketing: Detalles de contabilización y haga doble clic en el recuadro del Asiento.
Solución Tarea 6: Liquidación Financiera Agrupada (OVPM)
Vaya a Gestión de bancos -> Pagos efectuados -> Pagos efectuados (OVPM).
Seleccione el proveedor V10000.
En la tabla de documentos abiertos, marque la casilla de selección de las dos Facturas de Proveedores generadas en las tareas 4 y 5.
En la barra de herramientas, haga clic en el ícono de Medios de pago (Ctrl + Y).
Vaya a la ficha Transferencia bancaria:
Ingrese la cuenta de mayor bancaria y la fecha de transferencia.
En el campo Total, presione el atajo Ctrl + B (el sistema calcula e introduce exactamente la suma total de las facturas seleccionadas).
Presione OK y luego elija Crear. Las dos facturas quedan totalmente conciliadas y pagadas.


2. Banco de Evaluación de Certificación
Pregunta 1: En un circuito de compras bajo el sistema de Inventario Permanente, ¿cuál es el efecto contable de una Factura de Proveedores (OPCH) que se crea tomando como base previa una Entrada de Mercancías (OPDN)?

A) Débito a la Cuenta de Existencias y Crédito a la Cuenta del Proveedor.
B) Débito a la Cuenta de Compensación de Existencias (EM/RF) y Crédito a la Cuenta del Proveedor.
C) Débito al Costo de Ventas y Crédito a la Cuenta de Banco.
D) Débito al Proveedor y Crédito a la Cuenta de Existencias.
Respuesta Correcta: B.
Justificación Técnica: La Entrada de Mercancías (OPDN) ya incrementó el inventario debitando Existencias y acreditando la cuenta puente transitoria (Compensación de Compras / EM/RF). La Factura posterior cancela dicha cuenta puente debitándola y reconoce la deuda definitiva acreditando al Proveedor.

Pregunta 2: Si un proveedor entrega únicamente 30 unidades de las 50 pactadas en un Pedido de Compras y notifica formalmente que el remanente no será entregado, ¿cuál es la mejor práctica operativa en SAP Business One?

A) Modificar la cantidad del pedido original directamente a 30.
B) Eliminar el pedido de compras.
C) Hacer clic derecho sobre la línea del pedido y seleccionar "Cerrar línea".
D) Crear una Factura de Abono por las 20 unidades.
Respuesta Correcta: C.
Justificación Técnica: La opción "Cerrar línea" cancela el compromiso de suministro remanente en el sistema, actualiza el estatus del documento y evita que el motor MRP continúe asumiendo que llegarán 20 unidades en el cálculo de necesidades.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
