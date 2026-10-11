UNIDAD 032: GESTIÓN DE INVENTARIO FÍSICO, RECUENTO CÍCLICO Y AJUSTES CONTABLES (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Inven_13_WM_PhyInv
Módulo Oficial: Gestión de Inventario / Inventario Físico (Inventory Management - Physical Inventory)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Logísticos, Contadores de Inventario, Jefes de Bodega y Agentes IA (Antigravity)
Carpeta Asociada: 032_10_Inven_13_WM_PhyInv


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "032",

  "topic": "Physical Inventory, Cycle Counting & Inventory Posting",

  "sap_module": "Inventory_PhysicalCounting",

  "database_tables": {

    "cycle_definitions": "OCYC",

    "cycle_determination": "CYC1",

    "inventory_counting_header": "OINC",

    "inventory_counting_lines": "INC1",

    "inventory_posting_header": "OIQR",

    "inventory_posting_lines": "IQR1",

    "item_warehouse_status": "OITW"

  },

  "menu_paths": [

    "Gestión > Definición > Inventario > Ciclos de inventario",

    "Gestión > Definición > Inventario > Determinación de recuento de inventario",

    "Inventario > Operaciones de inventario > Recuento de inventario > Recuento de inventario",

    "Inventario > Operaciones de inventario > Recuento de inventario > Contabilización de inventario",

    "Inventario > Operaciones de inventario > Recomendaciones de recuento de ciclos"

  ],

  "cycle_counting_architecture": {

    "frequencies": ["Diario", "Semanal", "Mensual", "Bimestral", "Trimestral", "Semestral", "Anual"],

    "recurrence_triggers": "Asignación por Grupo de Artículos (OITB) o por Subniveles de Ubicación de Almacén (OSBL)",

    "alert_mechanism": "Envío de recomendación automática al usuario responsable indicando las fechas de vencimiento de recuento"

  },

  "counting_mechanics": {

    "item_freezing": {

      "field": "INC1.Freeze",

      "effect": "Bloquea el artículo en el almacén o celda específica para cualquier documento de entrada, salida o traslado hasta que se registre la contabilización o se desmarque la casilla"

    },

    "counting_types": {

      "Single_Counter": "Un único usuario/empleado realiza el conteo de la línea",

      "Multiple_Individual_Counters": "Dos o más contadores independientes cuentan la misma área sin ver los resultados del otro para auditar discrepancias",

      "Team_Counters": "Un grupo de contadores suman conjuntamente sus conteos para consolidar una cantidad total por zona",

      "Mixed": "Combinación de contador individual vs suma de equipo"

    },

    "uom_conversion": "El sistema permite ingresar conteos en unidades de compra/embalaje (ej. Cajas máster) y convierte automáticamente a la UdM de inventario según el grupo UoM",

    "draft_serials_batches": "Si el conteo físico revela números de serie o lotes adicionales no registrados, se crean en estado Preliminar (Draft) en INC1 y se transforman en definitivos al crear el documento OIQR"

  },

  "accounting_posting_rules": {

    "inventory_increase": {

      "trigger": "Cantidad Contada > Cantidad en Sistema",

      "debit": "Cuenta de Existencias / Inventario (Activo)",

      "credit": "Cuenta de Aumento de Inventario / Ganancia por Sobrante de Inventario (Pérdidas y Ganancias)"

    },

    "inventory_decrease": {

      "trigger": "Cantidad Contada < Cantidad en Sistema",

      "debit": "Cuenta de Ajuste de Inventario / Merma y Faltante de Inventario (Gastos)",

      "credit": "Cuenta de Existencias / Inventario (Disminución de Activo)"

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Rol Estratégico del Inventario Físico y el Recuento Cíclico
La discrepancia entre el inventario teórico registrado en el ERP y el stock físico real disponible en almacén genera quiebres de servicio, sobrecostos financieros e incorrecciones en los balances contables.

Inventario Anual Clásico: Tradicionalmente las empresas paralizaban sus operaciones para contar el 100% de los almacenes a fin de año, incurriendo en lucro cesante y errores por fatiga.
Recuento Cíclico (Cycle Counting): SAP Business One 10.0 promueve el conteo continuo programado a lo largo de todo el año. Los artículos se clasifican comúnmente según metodología ABC:
Artículos Clase A (alta rotación / alto valor): contados 6 a 12 veces por año.
Artículos Clase B (rotación media): contados 4 a 6 veces por año.
Artículos Clase C (baja rotación): contados 1 vez al año.
2.2 Configuración de Ciclos y Determinación de Recuento
Definición de Ciclos (OCYC): En Gestión > Definición > Inventario > Ciclos de inventario, se definen los intervalos (ej. "Bimestral - Segundo martes del mes").
Determinación de Ciclos (CYC1): Se asocian los ciclos a grupos de artículos (OITB) o a subniveles de ubicación de almacén (ej. todo el Pasillo 1). Se define el usuario destinatario que recibirá las Alertas de Recomendación de recuento en su bandeja de entrada o mediante el widget Fiori.
2.3 El Documento de Recuento de Inventario (OINC / INC1)
El documento de Recuento centraliza la gestión del inventario físico:

Función Congelar (Freeze): Al marcar esta casilla para una línea, SAP Business One bloquea temporalmente el artículo en el almacén o ubicación específica (OITW.FrozenFor = 'Y'). Se impide emitir entregas, facturas o traslados que involucren ese artículo hasta que el recuento concluya, garantizando que el stock no se mueva durante la auditoría.
Múltiples Contadores y Comparación: Permite auditar almacenes asignando contadores individuales independientes o equipos de trabajo. La pantalla calcula automáticamente la Diferencia entre Contadores (Counters' Difference) y resalta en color las discrepancias que superen el porcentaje de tolerancia configurado.
Fecha Base de Stock (Fecha de Creación vs Fecha de Contabilización):
En Parametrizaciones de Documento, la empresa define cómo calcular la "Cantidad en Almacén":
Fecha de Creación de Transacciones: Ideal cuando todos los movimientos se digitan en tiempo real el mismo día.
Fecha de Contabilización: Esencial si el almacén tiene rezago en la digitación y registra recepciones con fechas retroactivas, asegurando que los documentos ingresados con fecha anterior al recuento sean considerados en el stock teórico.
2.4 Contabilización de Diferencias (OIQR / IQR1)
Una vez confirmadas las cantidades físicas:

El documento de Recuento de Inventario se copia hacia la Contabilización de Inventario (Inventory Posting).
Si no hay discrepancias, la partida se cierra sin impacto contable.
Si existen sobrantes o faltantes, el sistema calcula el costo unitario del artículo (según FIFO, Promedio Ponderado o Estándar) y dispara un asiento contable automático en OJDT afectando la Cuenta de Existencias contra la Cuenta de Pérdidas por Mermas o Ganancias por Ajustes de Inventario.


3. CASO DE NEGOCIO RESUELTO: AUDITORÍA DE EXISTENCIAS EN OEC COMPUTERS
Escenario de Negocio:
En OEC Computers, George (jefe de bodega) programa el recuento cíclico de la categoría Impresoras Láser. El sistema registra en libros 54 unidades de la impresora PRN001 en el Almacén 01, con seguimiento por número de serie.
Pasos Operativos:
Emisión y Congelación:
George abre Recuento de inventario, selecciona el artículo PRN001, marca la casilla Congelar y asigna a dos contadores independientes: Keisha y Saul. Imprime las hojas de recuento a ciegas (sin mostrar las cantidades del sistema).
Registro de Resultados:
Keisha cuenta físicamente 55 impresoras.
Saul cuenta físicamente 55 impresoras.
Ambos coinciden en que hay 55 unidades físicas reales (un sobrante de +1 unidad frente al sistema).
Gestión del Número de Serie Faltante:
Al haber 55 impresoras físicas pero solo 54 números de serie en la base de datos, George accede a la ventana de gestión de series desde el documento de recuento y crea un Número de Serie Preliminar (Draft Serial Number) con el serial impreso en la caja de la unidad excedente: SN-PRN-88421.
Contabilización del Ajuste:
George pulsa Copiar a Contabilización de inventario.
Se genera el documento OIQR.
El número de serie preliminar SN-PRN-88421 pasa a ser un registro activo definitivo en la tabla OSRN.
Se genera el asiento contable: Débito a la cuenta 140000 - Existencias de Inventario por el costo de la impresora ($350 USD) y Crédito a 430000 - Ingresos por Sobrantes de Inventario.
El stock queda cuadrado en 55 unidades y se levanta la congelación del artículo.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es el efecto inmediato de marcar la casilla "Congelar" (Freeze) en una fila del documento de Recuento de Inventario en SAP Business One?
A) Borra temporalmente el costo del artículo en la base de datos.
B) Bloquea el artículo en el almacén o ubicación especificada, impidiendo cualquier entrada, salida o traslado hasta que se concluya el conteo o se desmarque la casilla.
C) Envía una notificación de pago al proveedor del artículo.
D) Obliga al operario a cambiar el método de valoración a FIFO.
Respuesta Correcta: B
Justificación Técnica: La función Freeze asegura la integridad del inventario físico bloqueando las transacciones de almacén para ese ítem, evitando que movimientos operativos alteren las existencias mientras los auditores realizan el conteo.
Pregunta 2
Al realizar un recuento de artículos gestionados por Números de Serie, los auditores detectan una unidad física adicional que no existe en el sistema. ¿Cómo se registra esta serie en el Recuento de Inventario?
A) No se puede registrar y debe descartarse la unidad física.
B) Se crea como un "Número de Serie Preliminar" (Draft Serial) en el documento de recuento, el cual se convierte en un número de serie oficial al crear la Contabilización de Inventario.
C) Debe crearse una orden de fabricación manual para darla de alta.
D) Se añade directamente a la tabla OCRD de clientes.
Respuesta Correcta: B
Justificación Técnica: SAP Business One admite el registro de series y lotes preliminares en el documento de recuento (INC1); su alta formal en las tablas maestras de stock ocurre al procesar la contabilización de diferencias (OIQR).
Pregunta 3
Si se utiliza la opción de "Contadores Múltiples" en el Recuento de Inventario con un esquema Mixto (un contador individual y un equipo de dos contadores), ¿cómo procesa el sistema las cantidades del equipo?
A) Multiplica los conteos de los integrantes del equipo.
B) Suma automáticamente los conteos de los miembros del equipo para consolidar una cantidad total y la compara contra el conteo del contador individual.
C) Descarta el conteo del contador individual por considerarlo insuficiente.
D) Calcula la mediana matemática de los tres números.
Respuesta Correcta: B
Justificación Técnica: Los miembros de un equipo ingresan sus aportes parcelados de la misma zona; el sistema totaliza aritméticamente las cantidades del equipo y las contrasta contra el recuento del auditor individual asignado.