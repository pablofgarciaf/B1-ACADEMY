import { MANUAL_CASES, type ManualCase } from './manual-cases';
export interface QuizQuestion {id:number;question:string;options:string[];correctAnswer:number;explanation:string}
const topics:Record<string,string[]>={
 'FINIX-ERP-LOGISTICS':['3.1','3.5','5.2','5.5','3.8'],
 'modulo-01':['1.1','1.2','1.3','2.3','13.2'],
 'modulo-02':['3.1','3.2','3.4','3.5','3.8'],
 'modulo-03':['2.1','2.2','2.3','2.6','2.7'],
 'modulo-04':['4.1','4.3','4.7','5.2','5.5'],
 'modulo-05':['10.1','10.2','10.3','10.4','10.5'],
 'modulo-06':['2.4','12.1','5.3'],
 'modulo-07':['11.1','11.2','18.1'],
 'modulo-08':['21.1','21.2','21.3','21.4','21.5'],
 'modulo-09':['23.1','20.3','20.5'],
 'modulo-10':['13.4','14.2','15.1','15.5','16.3'],
 'modulo-11':['22.1','22.2','22.3','22.4','22.6'],
 'modulo-12':['20.1','20.2','20.4','20.6','20.8'],
};
const cases:Record<string,ManualCase[]>={
 'Finix ERP-LOC-EC':[
 ['Una factura fue generada y firmada, pero el SRI aún no respondió. ¿Qué estado puedes afirmar?',['Pendiente de autorización','Autorizada por el receptor','Anulada por el proveedor','Aceptada para todo efecto'],'Generar o firmar el XML no equivale a recibir autorización. Se comprueba la respuesta del ambiente correspondiente.'],
 ['En este ejercicio se aplica una retención de 2 % sobre una base de 1000. ¿Cuál es el importe?',['20','25','15','30'],'La tarifa es un supuesto del caso: 1000 × 0,02 = 20. En una operación real debe verificarse la tarifa y condición aplicable.'],
 ['Un comprobante de pruebas tiene respuesta satisfactoria. ¿Qué demuestra?',['Funcionamiento en pruebas','Validez en producción','Pago bancario recibido','Entrega física confirmada'],'Los ambientes son distintos: una prueba no constituye autorización de un comprobante real.'],
 ],
 'B1-NOM-EC':[
 ['El ejercicio usa sueldo 480 y divisor 240. ¿Cuál es el valor de la hora base?',['2,00','1,50','2,50','3,00'],'480 dividido entre 240 es 2. El divisor es un dato del caso; no se afirma aquí que aplique a toda relación laboral.'],
 ['Base de aporte 1000 y tasa personal dada de 9,45 %. ¿Qué descuento corresponde?',['94,50','90,45','99,45','95,40'],'1000 × 0,0945 = 94,50. El aporte personal y los cargos del empleador se calculan y clasifican por separado.'],
 ['Se devengaron sueldos por 2000 y todavía no se pagan. ¿Qué reconoces?',['Gasto y pasivo','Ingreso y pasivo','Gasto y cobro','Activo y venta'],'El devengo reconoce gasto y deuda; el pago posterior cancela el pasivo contra bancos.'],
 ],
 'B1-HCM-TALENT':[
 ['Una matriz Nine-Box combina dos criterios. ¿Cuáles son?',['Desempeño y potencial','Antigüedad y sueldo','Formación y asistencia','Cargo y remuneración'],'La matriz compara desempeño observado y potencial; debe apoyarse en evidencias y criterios definidos.'],
 ['Dos jefes puntúan de forma muy distinta evidencias similares. ¿Qué ayuda a revisar la diferencia?',['Calibrar los criterios','Promediar sin discutir','Cambiar la antigüedad','Premiar al área mayor'],'La calibración contrasta evidencia y criterios para reducir diferencias de severidad o benevolencia.'],
 ],
 'Finix ERP-VERT-EXP':[
 ['Dos embarques tienen fletes distintos. ¿Qué permite analizar el margen de cada exportación?',['Costos por embarque','Promedio de ventas anual','Saldo global de bancos','Número total de clientes'],'La rentabilidad requiere asignar costos e ingresos al embarque o unidad de análisis correspondiente.'],
 ['Una piscina consume 300 de alimento, 100 de energía y 200 de mano de obra. ¿Cuál es el costo identificado?',['600','500','400','700'],'La suma es 600; para costo unitario falta dividir entre la producción obtenida con una base consistente.'],
 ],
};
function questions(rows:ManualCase[]):QuizQuestion[]{return rows.map((r,i)=>({id:i+1,question:r[0],options:r[1],correctAnswer:0,explanation:r[2]}));}
export const TRACK_QUIZZES:Record<string,QuizQuestion[]>={...Object.fromEntries(Object.entries(topics).map(([k,ids])=>[k,questions(ids.map(id=>MANUAL_CASES[id]))])),...Object.fromEntries(Object.entries(cases).map(([k,rows])=>[k,questions(rows)]))};
export function prepareTrackQuiz(code:string):QuizQuestion[]{
 return (TRACK_QUIZZES[code]??[]).map(q=>{const pairs=q.options.map((text,i)=>({text,correct:i===q.correctAnswer}));for(let i=pairs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pairs[i],pairs[j]]=[pairs[j],pairs[i]];}return {...q,options:pairs.map(p=>p.text),correctAnswer:pairs.findIndex(p=>p.correct)};});
}
