# Transcripción por Diapositiva: 10_FixedAsset_31_WorkingProcessFA_Activate_AssetMD

## Diapositiva 1

Activos Fijos: Activar los Datos Maestros de Activos — SAP Business One Versión 10.0. Bienvenido al tema: Activar los Datos Maestros de Activos.

---

## Diapositiva 2

Objetivos. Al finalizar este curso, podrás: Activar los Datos Maestros de Activos.

---

## Diapositiva 3

Escenario de Negocio. OEC Computers utiliza una pequeña flota de camiones de reparto. Tras adquirirlos, los definieron como activos fijos en SAP Business One. Para presentar el valor actualizado de los camiones en los informes financieros de la empresa, necesitan documentar las transacciones que afectan al valor de los vehículos durante su vida útil. Eres un consultor implementando activos fijos y les muestras la funcionalidad y el proceso de trabajo de Activos Fijos en SAP Business One.

---

## Diapositiva 4

Activación de Activos Fijos – Documentos. Factura OC → Capitalización. OEC Computers. Coste de Adquisición y Producción = 6.000. La Capitalización es el proceso de registrar el coste de adquisición y producción (CAP) como un activo fijo. En nuestro ejemplo, el valor de adquisición del camión es 6.000. El usuario puede adquirir un activo fijo usando una Factura OC. La Factura OC genera automáticamente el documento de Capitalización para cada Factura OC que incluya datos maestros de activos fijos. El usuario puede elegir si generar el documento de Capitalización directamente, o generarlo automáticamente desde la Factura OC. Ten en cuenta que esto también es relevante para la Factura de Reserva OC. Puedes encontrar el documento de Capitalización en Finanzas → Activos Fijos → Capitalización. En ambas opciones se activan los Datos Maestros de Activos. Nota: puedes elegir un registro de dato maestro de activo en la Factura OC y también puedes crear uno nuevo desde dentro de la Factura OC. Para ello ve a Administración → Configuración → General → Valores por Defecto del Usuario, pestaña Predeterminados, y marca la casilla Permitir Crear Activos Fijos en Documentos de Marketing.

---

## Diapositiva 5

Fecha de Valoración del Activo. Factura OC → Capitalización. Cuando emites la Factura OC, la Fecha de Valoración del Activo (bajo la pestaña Contabilización) se establece por defecto igual que la Fecha de Contabilización de la Factura OC. Esta fecha puede cambiarse antes de agregar la Factura OC para actualizar la Fecha de Valoración del Activo en el documento de Capitalización. La fecha de valoración del activo puede ser diferente de la fecha de contabilización y la fecha del documento, pero debe estar dentro del mismo período que la fecha de contabilización. En nuestro ejemplo, la Fecha de Valoración del Activo del camión se estableció el 1 de enero. La Fecha de Valoración del Activo establece la Fecha de Capitalización en los Datos Maestros de Activos.

---

## Diapositiva 6

Conjunto de Definiciones de Activos Fijos. Clase de Activo / Datos Maestros del Activo: Camión / Tipo de Amortización / Determinación de Cuentas / Área de Amortización. Área de Amortización Principal: PCGA. Método: Lineal. Código: Vehículos de Motor. En nuestro ejemplo, tenemos el nuevo camión que OEC Computers adquirió. Definimos un conjunto de definiciones relevante para este tipo de activo, el conjunto de definiciones Vehículos Pesados. Luego, definimos este camión como un registro de Datos Maestros de Activos en Finanzas → Activos Fijos → Datos Maestros de Activos y adjuntamos el conjunto de definiciones Vehículos de Motor a este registro. La definición principal en los Datos Maestros de Activos es la Clase de Activo, que incluye la asociación con las demás definiciones: Área de Amortización, Determinación de Cuentas y Tipo de Amortización.

---

## Diapositiva 7

Activación – Determinación de Cuentas. Cuenta del Balance del Activo 6.000. Coste de Adquisición y Producción = 6.000. Clase de Activo / Determinación de Cuentas. Código: Vehículos de Motor. La definición de Determinación de Cuentas permite al sistema seleccionar automáticamente las cuentas G/L relevantes para la contabilidad de activos. En nuestro ejemplo definimos el conjunto de cuentas Vehículos de Motor y lo adjuntamos a la clase de activo Vehículos de Motor. La clase de activo se seleccionará para activos de vehículos pesados, como el camión de la empresa. Por tanto, todas las transacciones que involucren al camión registrarán automáticamente asientos en el conjunto de cuentas Vehículos de Motor. Así, en nuestro ejemplo, el documento de Capitalización debitará la Cuenta del Balance del Activo definida en el conjunto de cuentas Vehículos de Motor con el coste de adquisición de 6.000.

---

## Diapositiva 8

Activación de Activos Fijos – Asientos Contables. Factura OC: Debe – Proveedor 6.000 / Haber – Cuenta de Compensación de Adquisición 6.000. Capitalización: Debe – Cuenta de Compensación de Adquisición 6.000 / Haber – Cuenta del Balance del Activo 6.000. El gráfico muestra los asientos contables automáticos creados durante el proceso de activación, incluidas las cuentas involucradas. Si no hay ningún proveedor implicado, el usuario puede generar un documento de Capitalización directamente. En este caso, solo se creará el asiento de capitalización y, por lo tanto, la cuenta de compensación aparecerá como una obligación en el Balance.

---

## Diapositiva 9

Capitalización de Activos Fijos Virtuales. Cuando tu empresa necesite comprar activos fijos idénticos en grandes cantidades para uso interno, crea un artículo virtual que represente el activo fijo. En la Factura OC elige este artículo plantilla e introduce una determinada cantidad en la fila del artículo. Opcionalmente, puedes gestionar números de serie para los activos fijos virtuales generados. Puedes usar la definición de artículo virtual en casos en que la empresa compra activos idénticos para uso de oficina, como portátiles, teléfonos móviles o sillas. Ten en cuenta que los artículos virtuales solo pueden capitalizarse mediante Facturas OC. La cantidad de datos maestros de activos creados automáticamente es la misma que la cantidad especificada en la Factura OC.

---

## Diapositiva 10

Capitalización de Activos Fijos Virtuales (cont.). Se emite automáticamente un documento de Capitalización que incluye los activos creados, así como un asiento contable contra la cuenta del activo. Ten en cuenta que puedes incluir múltiples activos fijos virtuales en la misma Factura OC, pero no puedes incluir tanto activos fijos virtuales como activos fijos normales en la misma Factura OC.

---

## Diapositiva 11

Capitalización de Activos Fijos Virtuales – Lista de Artículos. Al emitir una Factura OC, para facilitar la identificación de un artículo virtual en la lista de artículos y activos fijos, modifica la configuración de la lista de artículos y muestra el campo Artículo Virtual de Activo. Para ello, después de abrir la ventana Lista de Artículos, elige el icono Configuración de Formulario del menú superior para modificar la visualización de la lista.

---

## Diapositiva 12

Resumen. Puntos clave: La Capitalización es el proceso de registrar el coste de adquisición y producción (CAP) como un activo fijo. La Factura OC genera automáticamente el documento de Capitalización para cada Factura OC que incluya datos maestros de activos fijos. El usuario puede generar el documento de Capitalización directamente. En ambas opciones se activan los Datos Maestros de Activos. La definición de Determinación de Cuentas permite al sistema seleccionar automáticamente las cuentas G/L relevantes para la contabilidad de activos. Los artículos virtuales solo pueden capitalizarse mediante Facturas OC. Se emite automáticamente un documento de Capitalización que incluye los activos creados, así como un asiento contable contra la cuenta del activo. Los activos creados son activos fijos normales con valores monetarios. El artículo virtual funciona como plantilla y por lo tanto no tendrá ningún valor bajo la pestaña Activos Fijos. Puedes incluir múltiples activos fijos virtuales en la misma Factura OC, pero no puedes incluir tanto activos fijos virtuales como activos fijos normales en la misma Factura OC.

---

## Diapositiva 13

Aviso legal SAP — sin cambios respecto al documento original.

---
