# Guion de Video: DOC 002 AccBasics Automatic Journal Entries

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 002 AccBasics Automatic Journal Entries.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 002: ASIENTOS CONTABLES AUTOMÁTICOS Y DETERMINACIÓN DE CUENTAS DE MAYOR (SAP BUSINESS ONE 10.0)
Código de Manual: 10_AccBasics_12_AccBasics_Automatic_Journal_Entries_ES
Módulo Oficial: Finanzas / Integración Logística-Contable (FI-MM-SD)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Contadores Generales, Arquitectos de Datos y Agentes IA (Antigravity)
Carpeta Asociada: 002_10_AccBasics_12_AccBasics_Automatic_Journal_Entries_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "002",

  "topic": "Automatic Journal Entries & G/L Account Determination",

  "sap_module": "Financials_CrossModule",

  "configuration_entities": [

    {

      "name": "GL Account Determination",

      "window": "Gestión > Inicialización del sistema > Parametrizaciones de documento > Determinación de cuentas de mayor",

      "tabs": ["Ventas", "Compras", "Inventario", "General", "Activos fijos"],

      "description": "Define las cuentas contables por defecto que se disparan en transacciones logísticas y comerciales"

    },

    {

      "name": "Account Determination Levels",

      "levels": [

        { "priority": 1, "level": "Almacén (Warehouse Level)", "config": "Datos maestros de almacén > Finanzas" },

        { "priority": 2, "level": "Grupo de Artículos (Item Group Level)", "config": "Definición > Inventario > Grupos de artículos" },

        { "priority": 3, "level": "Nivel General / Empresa (Company Level)", "config": "Determinación de cuentas de mayor por defecto" }

      ]

    }

  ],

  "purchasing_perpetual_inventory_flow": {

    "step_1_grpo": {

      "document": "Entrada de mercancías por pedido (OPDN / PDN1)",

      "trigger": "Recepción física de artículos de inventario en almacén",

      "journal_entry": {

        "debit": "Cuenta de Inventario / Existencias (Activo)",

        "credit": "Cuenta de Compensación / Asignación de Mercancías No Facturadas (Pasivo Transitorio / Clearing)"

      }

    },

    "step_2_ap_invoice": {

      "document": "Factura de proveedores basada en Entrada de Mercancías (OPCH / PCH1)",

      "trigger": "Recepción y validación de la factura fiscal del proveedor",

      "journal_entry": {

        "debit": "Cuenta de Compensación / Asignación (Cancela Pasivo Transitorio)",

        "debit_tax": "Cuenta de IVA Soportado / Crédito Fiscal (Activo Impositivo)",

        "credit": "Cuenta Asociada de Proveedores (Pasivo Real Exigible)"

      }

    }

  },

  "sales_perpetual_inventory_flow": {

    "step_1_delivery": {

      "document": "Entrega de mercancías (ODLN / DLN1)",

      "journal_entry": {

        "debit": "Costo de Ventas (COGS - Pérdidas y Ganancias)",

        "credit": "Cuenta de Inventario / Existencias (Disminución de Activo)"

      }

    },

    "step_2_ar_invoice": {

      "document": "Factura de clientes (OINV / INV1)",

      "journal_entry": {

        "debit": "Cuenta Asociada de Clientes (Activo Exigible)",

        "credit": "Ingresos por Ventas (Ganancias)",

        "credit_tax": "Cuenta de IVA Repercutido / Débito Fiscal (Pasivo Impositivo)"

      }

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Motor de Contabilización Automática
En SAP Business One, la gran mayoría de los asientos contables no son redactados manualmente por contadores, sino que son derivados en tiempo real por el Motor de Contabilización Automática cuando los usuarios de almacén, compras o ventas registran transacciones cotidianas.

Para que este automatismo opere con total precisión matemática y contable, el sistema responde a dos preguntas clave en cada documento:

¿Qué cuentas contables utilizar? Lo determina a través de la Determinación de Cuentas de Mayor.
¿Qué valores asignar al Debe y al Haber? Lo calcula combinando los Precios del Documento (listas de precios, costos de compra o métodos de valoración de inventario) con las Cantidades Transaccionadas.
2.2 Jerarquía y Prioridad en la Determinación de Cuentas
A partir de la versión 9.0 y consolidado en la 10.0, SAP Business One permite tres métodos de determinación contable para artículos:

Por Almacén: Permite que un mismo artículo impute a cuentas contables distintas dependiendo de la ubicación física en la que se almacene (ideal para empresas con bodegas fiscales, sucursales en distintas regiones o almacenes de consignación).
Por Grupo de Artículos: Agrupa cuentas contables homogéneas para familias de artículos (ej. Materias Primas vs Productos Terminados vs Servicios).
Nivel General de Empresa: Actúa como la regla por defecto para cualquier artículo que no tenga especificaciones a nivel de almacén o grupo.
2.3 El Circuito Crítico de Compras en Inventario Permanente: Entrada vs Factura
Uno de los puntos más críticos en la auditoría contable es la desconexión temporal entre la llegada física de la mercancía y la recepción de la factura comercial:

Entrada de Mercancías por Pedido (GRPO - OPDN):
La empresa ya posee la mercancía física en su almacén, por lo que el activo de existencias debe aumentarse inmediatamente al costo estimado del pedido.
Sin embargo, aún no se tiene la factura fiscal del proveedor, por lo que no se puede acreditar la cuenta del proveedor formal.
Solución SAP: Se utiliza la Cuenta de Compensación de Compras (Allocation Account), que actúa como una provisión de pasivo transitorio.
Factura de Proveedores (A/P Invoice - OPCH):
Al llegar la factura, el sistema debita la Cuenta de Compensación de Compras (dejándola con saldo cero si el precio coincide) y acredita formalmente la Cuenta del Proveedor (OCRD), registrando la deuda líquida y exigible.


3. ATLAS DIDÁCTICO Y ANÁLISIS DE LÁMINAS TÉCNICAS
En la subcarpeta Imagenes_Diapositivas de esta unidad se encuentran las siguientes láminas técnicas operativas:

SLIDE_04_Parametrizacion_Determinacion_Cuentas_Mayor.png:

Descripción Técnica: Muestra la ventana central de configuración contable en Gestión > Inicialización del sistema > Determinación de cuentas de mayor.
Punto Clave: Exhibe las pestañas operativas (Ventas, Compras, Inventario, General) donde se definen las cuentas puente, ingresos, gastos y cuentas de ajuste de inventario.

SLIDE_05_Determinacion_Cuentas_Articulos_Procesos.png:

Descripción Técnica: Esquema de cómo los artículos de inventario heredan la determinación contable durante la creación de pedidos, entregas y facturas.
Punto Clave: Resalta que el usuario operativo en almacén no necesita saber qué cuenta contable afectar; el código de artículo arrastra automáticamente la parametrización contable.

SLIDE_06_Cuentas_Asociadas_Clientes_Proveedores.png:

Descripción Técnica: Diagrama de integración entre los auxiliares de Interlocutores Comerciales y el Libro Mayor.
Punto Clave: Ilustra cómo la Cuenta de Deudores consolida las cuentas por cobrar de todos los clientes en el activo corriente, y la Cuenta de Proveedores consolida las cuentas por pagar en el pasivo corriente.

SLIDE_09_Fijacion_Precios_Asiento_Ventas.png:

Descripción Técnica: Flujo de precios en el ciclo de facturación a clientes.
Punto Clave: Muestra cómo el precio unitario pactado multiplicado por la cantidad facturada genera el importe total de ingresos y la obligación de cobro al cliente.

SLIDE_10_Fijacion_Precios_Asiento_Compras.png:

Descripción Técnica: Flujo de determinación de precios en el aprovisionamiento.
Punto Clave: Detalla la captura de costos desde la lista de precios de compra o última orden de compra y su repercusión contable.

SLIDE_11_Entrada_Mercancias_Inventario_Permanente.png:

Descripción Técnica: La arquitectura contable de la Entrada de Mercancías (GRPO).
Punto Clave: Visualiza el asiento de dos patas: Débito a Cuenta de Existencias y Crédito a Cuenta de Compensación de Compras.


4. CASO DE NEGOCIO RESUELTO: RECEPCIÓN Y FACTURACIÓN EN OEC COMPUTERS
Escenario de Consultoría:
Joe, jefe de almacén de OEC Computers, emite una orden de compra para adquirir 10 reproductores multimedia portátiles del proveedor Coconut Devices a un precio de $50.00 USD por unidad (Total: $500.00 USD). La empresa opera con sistema de Inventario Permanente.
Paso 1: Recepción de Mercancías en Almacén (GRPO)
Joe recibe físicamente las 10 unidades del transportista y registra la Entrada de mercancías por pedido en el sistema.

Asiento Contable Generado Automáticamente (OJDT):
Debe (JDT1): 140000 - Cuenta de Existencias / Inventario = +$500.00 USD
Efecto: El inventario de OEC Computers se valoriza formalmente por $500.
Haber (JDT1): 210000 - Cuenta de Compensación de Mercancías = -$500.00 USD
Efecto: Se crea una provisión de pasivo temporal por mercancía recibida no facturada.
Paso 2: Recepción y Registro de la Factura del Proveedor (A/P Invoice)
Tres días después, el departamento de finanzas de OEC Computers recibe la factura fiscal de Coconut Devices por $500.00 USD más $60.00 USD de IVA (12%). El contador crea la factura copiando desde el documento GRPO previo.

Asiento Contable Generado Automáticamente (OJDT):
Debe (JDT1): 210000 - Cuenta de Compensación de Mercancías = +$500.00 USD
Efecto: La cuenta puente de pasivo temporal queda completamente saldada en $0.00.
Debe (JDT1): 115000 - IVA Crédito Tributario Soportado = +$60.00 USD
Efecto: Crédito fiscal recuperable para la empresa.
Haber (JDT1): 200000 - Cuenta Asociada Proveedor (Coconut Devices) = -$560.00 USD
Efecto: Se establece la deuda comercial definitiva en el pasivo corriente.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
En un entorno con Inventario Permanente, ¿cuál es el propósito de la Cuenta de Compensación de Mercancías (Allocation Account) utilizada en la Entrada de Mercancías por Pedido (GRPO)?
A) Registrar la ganancia obtenida por descuentos de proveedores.
B) Servir como cuenta puente de pasivo transitorio que registra la obligación por mercancía recibida hasta que se contabiliza la Factura de Proveedores definitiva.
C) Pagar las comisiones del transportista de forma directa.
D) Acumular los impuestos de importación para la aduana.
Respuesta Correcta: B
Justificación Técnica: Al entrar la mercancía al almacén se incrementa el activo de existencias. Como aún no se tiene la factura fiscal para acreditar al proveedor, se utiliza la cuenta de compensación para balancear el asiento hasta que llegue la factura formal.
Pregunta 2
Si un artículo tiene configurada la determinación de cuentas a nivel de "Almacén", pero el almacén donde se realiza la entrada no tiene cuentas asignadas, ¿qué hace SAP Business One?
A) Bloquea inmediatamente el documento impidiendo su creación.
B) Busca la cuenta en el nivel siguiente de la jerarquía (Grupo de Artículos) y, si tampoco existe, toma la cuenta por defecto de la Determinación General de la Empresa.
C) Crea automáticamente una cuenta contable nueva en el plan de cuentas.
D) Asigna el movimiento a la cuenta de Pérdidas y Ganancias sin aviso.
Respuesta Correcta: B
Justificación Técnica: SAP Business One aplica un mecanismo de cascada: Almacén -> Grupo de Artículos -> Determinación General de la Empresa. Si en ningún nivel se encuentra una cuenta válida, el sistema emite un error de validación contable.
Pregunta 3
¿Qué sucede contablemente si se emite una Factura de Proveedores directa SIN haber registrado previamente una Entrada de Mercancías (GRPO) en inventario permanente?
A) El sistema debita directamente la Cuenta de Inventario y acredita la Cuenta del Proveedor (más impuestos), sin pasar por la Cuenta de Compensación de Mercancías.
B) El sistema no permite crear facturas directas bajo ninguna circunstancia.
C) El sistema envía el monto íntegro a una cuenta de gastos no deducibles.
D) Se genera un duplicado de stock en el almacén de tránsito.
Respuesta Correcta: A
Justificación Técnica: Al no existir un documento previo de recepción física, la Factura de Proveedores asume simultáneamente el rol logístico de entrada de inventario y el rol fiscal de reconocimiento de deuda, debitando directamente la cuenta de inventario.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
