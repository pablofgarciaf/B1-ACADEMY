# Transcripción por Diapositiva: 10_FixedAsset_33_WorkingProcessFA_Retirement_Monitoring

## Diapositiva 1

Activos Fijos: Baja y Seguimiento — SAP Business One Versión 10.0. Bienvenido al tema: Baja y Seguimiento.

---

## Diapositiva 2

Objetivos. Al finalizar este curso, podrás: Dar de baja un activo fijo. Usar informes y el formulario de Datos Maestros de Activos para supervisar el valor de un activo fijo. Nota: Debes tomar decisiones sobre los requisitos legales y del sector junto con el contable del cliente.

---

## Diapositiva 3

Escenario de Negocio. OEC Computers utiliza una pequeña flota de camiones de reparto. Tras adquirirlos, los definieron como activos fijos en SAP Business One. Para presentar el valor actualizado de los camiones en los informes financieros de la empresa, necesitan documentar las transacciones que afectan al valor de los vehículos durante su vida útil. Da de baja un activo fijo mediante una Factura A/R o mediante el documento de Baja si no hay ningún cliente implicado. Usa informes y el formulario de Datos Maestros de Activos para supervisar el valor de un activo fijo.

---

## Diapositiva 4

Baja de Activos Fijos. Factura A/R → Baja. Debe – Cliente 2.000 / Haber – Cuenta de Compensación de Ingresos 2.000. Debe – Cuenta de Compensación de Ingresos 2.000 / Haber – Cuenta del Balance del Activo 2.000. La Baja es la eliminación de un activo o parte de un activo de la cartera de activos. Hay dos formas de dar de baja un activo fijo: mediante Factura A/R si vendes el activo, o mediante un documento de Baja si no hay ningún cliente implicado y necesitas dar de baja el activo fijo. Si la empresa vende el activo al final de su vida útil (o antes), el usuario puede dar de baja el artículo usando una Factura A/R. Si usas la opción de Factura A/R, asegúrate de definir los Datos Maestros de Activos como un Artículo de Ventas. La Factura A/R genera automáticamente un documento de Baja. Un documento de Baja puede emitirse directamente cuando no hay ningún cliente implicado y necesitas dar de baja el activo fijo. Tras dar de baja completamente el activo: Su valor en la cuenta del balance del activo, en el libro auxiliar de activos fijos, queda registrado como cero. El estado del dato maestro de activo cambia a Inactivo. El Valor Contable Neto de los Datos Maestros de Activos se establece en cero. Ten en cuenta que en el documento de Baja existe la opción de baja parcial. En este caso, el activo conservará el valor restante hasta el final de la vida útil del artículo.

---

## Diapositiva 5

Baja de Activos Fijos (cont.). Nota: Según el escenario de negocio y las definiciones del sistema, diferentes cuentas estarán involucradas en el asiento contable adjunto al documento de Baja. Recuerda que en el Área de Amortización, en el campo Contabilización de Baja, eliges entre Bruto y Neto. Esta definición se aplicará en un documento de Baja de tipo Desecho (a diferencia del tipo Venta). El sistema siempre tratará el desecho como pérdida. En Bruto el sistema usa la cuenta de gastos brutos predeterminada. Y en Neto usa la cuenta de gastos netos predeterminada. Además, depende de la opción de Contabilización de Amortización que elijas (es decir, Contabilización Directa o Indirecta).

---

## Diapositiva 6

Informe de Previsión de Amortización de Activos y los Datos Maestros de Activos. Durante el proceso, supervisamos el valor del activo fijo usando informes y los Datos Maestros de Activos. Para emitir los informes de activos fijos ve a Finanzas → Activos Fijos → Informes de Activos Fijos. La amortización se usa para dar de baja el coste de un activo a lo largo de su vida útil. Representa la reducción del valor contable de un activo tanto a efectos fiscales como contables y se incluirá entre los gastos de la empresa. El sistema predice la cuota de amortización anual esperada según las definiciones de los Datos Maestros de Activos. Puedes ver esta información en el Informe de Previsión de Amortización de Activos. Ejecutas el informe para cada área de amortización. La información de amortización se presenta para cada activo y se agrupa por ejercicio fiscal. Si el ejercicio fiscal seleccionado aún no existe, las previsiones de activos fijos se basarán en el último período fiscal definido en SAP Business One. En la visualización, los ejercicios fiscales de previsión se marcan con un asterisco. Además, puedes ver la información de amortización de un activo fijo específico en la ventana de Datos Maestros de Activos bajo la subpestaña Amortización.

---

## Diapositiva 7

Hoja de Historial de Activos. Libro Auxiliar de Activos Fijos. La Hoja de Historial de Activos es el suplemento más importante del balance desde el punto de vista de los activos fijos. El informe puede emitirse para todos los activos fijos. Muestra todas las transacciones de activos contabilizadas en un ejercicio fiscal y presenta los activos para cada cuenta del Balance. Al emitir el informe, puedes elegir una cuenta del balance o dejar esta selección vacía para mostrar los datos de todas las cuentas del balance de activos. También puedes elegir una clase de activo. Puedes emitir la Hoja de Historial de Activos y el Informe de Previsión de Amortización de Activos para un área de amortización cada vez. Recuerda que también puedes emitir el informe para un área de amortización que no sea de Contabilización en C/G para comprobar el valor de los activos fijos según esa área. En nuestro ejemplo, podrías emitir el informe para el área NIIF, que tiene un método de amortización diferente y por lo tanto mostrará valores distintos. El informe puede mostrarse según una plantilla de informe financiero. Ve a Finanzas → Plantillas de Informes Financieros para definir la plantilla de activos fijos para la Hoja de Historial de Activos. También puedes exportar los resultados del informe a MS Excel.

---

## Diapositiva 8

Informe de Estado de Activos. El Informe de Estado de Activos presenta una visión general de todos los registros maestros de activos fijos para un ejercicio fiscal seleccionado.

---

## Diapositiva 9

Informe de Transacciones de Activos. El informe de transacciones de activos proporciona una lista de transacciones relevantes para un activo. Usa el botón Tipo de Transacción para especificar las transacciones que deseas ver en el informe.

---

## Diapositiva 10

Datos Maestros de Activos – Pestaña Valores. Otro lugar para el seguimiento de activos fijos es la subpestaña Valores bajo la pestaña Activos Fijos en los Datos Maestros de Activos. Aquí puedes supervisar el cambio de valor de un activo a lo largo de un año. En el ejemplo presentado, puedes ver los valores esperados para el activo del camión en el año actual según el área de amortización PCGA.

---

## Diapositiva 11

Resumen. Puntos clave: La Baja es la eliminación de un activo o parte de un activo de la cartera de activos. Tras dar de baja completamente el activo, su valor en la cuenta del balance del activo, en el libro auxiliar de activos fijos, queda registrado como cero. El estado del dato maestro de activo cambia a Inactivo. El Valor Contable Neto de los Datos Maestros de Activos se establece en cero. Hay dos formas de dar de baja un activo fijo: mediante Factura A/R si vendes el activo, o mediante un documento de Baja si no hay ningún cliente implicado. Si usas la opción de Factura A/R, asegúrate de definir los Datos Maestros de Activos como un Artículo de Ventas. La Factura A/R genera automáticamente un documento de Baja.

---

## Diapositiva 12

Resumen (cont.). Supervisamos el valor del activo fijo usando informes y los Datos Maestros de Activos. Puedes ver la amortización anual esperada en el Informe de Previsión de Amortización de Activos. También puedes ver la información de amortización en la ventana de Datos Maestros de Activos bajo la subpestaña Amortización. La Hoja de Historial de Activos es el suplemento más importante del balance desde el punto de vista de los activos fijos. El informe muestra todas las transacciones de activos contabilizadas en un ejercicio fiscal y presenta los activos para cada cuenta del Balance.

---

## Diapositiva 13

Aviso legal SAP — sin cambios respecto al documento original.

---
