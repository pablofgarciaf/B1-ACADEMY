# Transcripción por Diapositiva: 10_FinProcess_21_PostPeriods_PostPeriods_ES

## Diapositiva 1

PUBLIC Proceso financiero: Períodos contables SAP Business One Versión 10.0 Bienvenido al curso sobre el proceso de períodos contables. 1

---

## Diapositiva 2

Después de completar este tema, podrá establecer cómo definir y gestionar los períodos de contables. 2 PUBLIC Al finalizar este tema, podrá:  Establecer cómo se definen y gestionan los períodos contables. Objetivos

---

## Diapositiva 3

3 PUBLIC Escenario empresarial Implementará SAP Business One en un nuevo cliente, OEC Computers.  Le explica a María, la responsable del área de contabilidad, que para crear la base de datos de empresa es obligatorio definir los períodos contables de la empresa:  El período contable principal: el ejercicio.  Los subperiodos del ejercicio.  La empresa crea el balance contable anual una vez al año. Sin embargo, necesitan doce períodos contables para el control interno.  Crea una nueva base de datos de empresa y define el ejercicio como año natural y los subperiodos como meses.  María pregunta qué necesita para registrar un determinado documento o un asiento en un periodo contable o un subperiodo.  Le responde que SAP Business One determina automáticamente a qué período contable pertenece la transacción en función de la fecha de contabilización de la transacción.  Implementará SAP Business One en un nuevo cliente, OEC Computers.  Le explica a María, la responsable del área de contabilidad, que para crear la base de datos de empresa es obligatorio definir los períodos contables de la empresa:  Define el período contable principal: el ejercicio, que por lo general corresponde al año natural.  Y luego los subperiodos del ejercicio.  Ambos analizan los procesos financieros de OEC Computers. La empresa crea el balance contable anual una vez al año. Sin embargo, necesitan doce períodos contables para el control interno.  Crea una nueva base de datos empresarial y define el ejercicio como año natural y los subperiodos como meses.  María pregunta qué necesita para registrar un determinado documento o un asiento en un periodo contable o un subperiodo.  Le responde que SAP Business One determina automáticamente a qué período contable pertenece la transacción en función de la fecha de contabilización de la transacción. 3

---

## Diapositiva 4

Aquí, puede ver un resumen del proceso de períodos contables. Existen tres pasos en el proceso de períodos contables. En este curso nos centraremos en los pasos operativos y de parametrizaciones, los dos primeros pasos del proceso. En el primer paso, definimos las parametrizaciones de los períodos contables. Primero se define el período contable principal para el ejercicio. Y, a continuación, los subperiodos del ejercicio: año, trimestres, meses o días. El segundo paso es el operativo. En el trabajo diario, introducimos los documentos y los asientos con una fecha de contabilización que se registrará automáticamente en el subperiodo adecuado. Los subperiodos permiten al usuario controlar su contabilización. De esa manera, se pueden controlar las contabilizaciones mensuales. El tercer período es el cierre del período donde se traspasan todos los saldos de cuenta de PyG a la cuenta de arrastre de saldos y se definen en cero las cuentas de PyG. Analizaremos el proceso de cierre del período en otro tema. 4 PUBLIC Períodos contables: resumen del proceso  Ejercicio: 20XX Fecha de contabilización Subperíodo  Subperíodos: Meses  20XX-01  20XX-02  20XX-03  …….  Parametrizaciones adicionales Cierre del período/ejercicio

---

## Diapositiva 5

Al crear una base de datos de empresa nueva, se crean los períodos contables del primer ejercicio. A los subperiodos los crea automáticamente SAP Business One en el ejercicio basado en la clase de subperiodo seleccionado.  Los cuatro subperiodos disponibles son: año, trimestre, mes y día. Define los subperíodos dependiendo de las necesidades empresariales de la empresa:  Un año tiene un subperiodo.  Los trimestres tienen cuatro subperiodos.  Los meses tienen doce subperiodos.  Los días pueden tener cualquier cantidad de subperiodos. Con esta selección, el sistema crea automáticamente el número correspondiente de períodos contables. Un motivo para definir subperiodos será la posibilidad de bloquear un período pasado para que ningún usuario pueda realizar contabilizaciones adicionales. 5 PUBLIC Definición de períodos contables y subperiodos 1 2 3 4 Trimestres 1 2 3 4 5 6 7 8 9 10 11 12 Meses Días Año Ejercicio 1

---

## Diapositiva 6

Al crear nuevos períodos contables, tenga en cuenta las advertencias importantes siguientes:  El inicio del ejercicio solo puede ser el primer día del mes. El inicio del ejercicio se fija automáticamente en el primer día del mes que se ha indicado en el campo "Fecha de contabilización desde".  Le recomendamos crear los períodos contables desde el más antiguo en adelante. Tenga en cuenta los datos más antiguos que desea migrar para determinar el primer período.  Asegúrese de crear un nuevo período con antelación para permitir validaciones y posibles modificaciones antes de empezar el trabajo.  No puede tener períodos contables que se solapen.  De manera predeterminada, "Desde la fecha" es el día posterior a la fecha de finalización del último período contable existente y "Hasta la fecha" es un año después.  La determinación de cuentas de mayor se graba por período y se copia del período anterior al siguiente. Por consiguiente, se recomienda crear el período más antiguo, seleccionar la cuenta primaria y, a continuación, crear los períodos adicionales. Puede modificar la determinación de cuentas de mayor antes de comenzar a trabajar con un nuevo período.  Aunque se podría modificar a mitad del período, no se recomienda hacerlo porque la determinación de cuentas influye en los informes financieros.  Debe tomar decisiones junto con la persona responsable del área de contabilidad del cliente. Juntos deben considerar temas como los informes legales y la consolidación empresarial. 6 PUBLIC Notas importantes sobre períodos contables El inicio del ejercicio solo puede ser el primer día del mes. Cree primero los períodos contables más antiguos. Cree un nuevo período contable con antelación. Sin períodos que se solapen. La determinación de cuentas de mayor se graba por período y se copia del período anterior al siguiente. Tome las decisiones junto con la persona responsable del área de contabilidad del cliente.

---

## Diapositiva 7

7 PUBLIC Resumen A continuación, se detallan algunos puntos clave: Al crear períodos contables, debe definir: • El período contable principal: el ejercicio, que suele corresponder al año natural. • Los subperiodos del ejercicio (año, trimestres, meses o días). SAP Business One determina automáticamente a qué subperiodo pertenece la transacción: • Según la fecha de contabilización de la transacción. Cuando crea un nuevo período contable: • Tenga en cuenta las notas importantes mencionadas en el curso.  A continuación, se detallan algunos puntos clave para tener en cuenta:  Al crear períodos contables, debe definir el período contable principal: el ejercicio, que normalmente corresponde al año natural.  Los subperiodos del ejercicio (Año, Trimestres, Meses o Días).  SAP Business One determina automáticamente a qué subperiodo pertenece la transacción en función de la fecha de contabilización de la transacción.  Cuando crea un nuevo período contable, tenga en cuenta las advertencias importantes mencionadas en el curso. 7

---

