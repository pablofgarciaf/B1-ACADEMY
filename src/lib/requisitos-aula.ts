import 'server-only';
import { getModuleById } from '@/lib/curriculum-data';
import { hasInitializedCompany } from '@/lib/company-server';
import { readAcademicProgress } from '@/lib/academic-progress';
export const MODULO_INDUCCION='mod-1';
const ROLES_SIN_REQUISITO=new Set(['super','admin','docente']);
export async function moduloInduccionCompleto(uid:string,role?:string,studentName?:string,email?:string):Promise<boolean>{
 if (!await hasInitializedCompany(uid)) return false;
 if (role && ROLES_SIN_REQUISITO.has(role)) return true;
 const classes=getModuleById(MODULO_INDUCCION)?.classes??[];
 const p=await readAcademicProgress(uid,MODULO_INDUCCION,studentName??'',email??'');
 return classes.length>0 && classes.every(c=>p.completedClasses.includes(c.id));
}
