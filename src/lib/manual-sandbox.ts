import { applyCommand } from './company-engine';
import { commandSchema, type CompanyCommand } from './company-commands';
import { emptyCompany, type CompanyState } from './firestore-types';
const ID='manual-demonstration';
/** Empresa aislada en memoria: nunca lee ni escribe la empresa del usuario. */
export function createManualSandbox(){
 const initial = applyCommand(emptyCompany(),{action:'initializeTraining',data:{companyName:'Empresa ficticia — laboratorio temporal'}},ID,'demo@example.test','2026-06-01T12:00:00Z').state;
 const document={date:'2026-06-02',dueDate:'2026-07-02',cardCode:'C20000',reference:'Factura ficticia para practicar devolución completa',comments:'Datos de muestra',baseDocumentId:'',lines:[{itemCode:'A00001',description:'Laptop',quantity:1,unit:'UND',price:1000,discount:0,taxRate:15 as const,warehouseCode:'01'}]};
 return applyCommand(initial,{action:'sales',data:{docType:'invoice',document}},ID,'demo@example.test','2026-06-02T12:00:00Z').state;
}
export function runManualCommand(state:CompanyState,command:CompanyCommand){
 return applyCommand(state,commandSchema.parse(command),ID,'demo@example.test',new Date().toISOString());
}
