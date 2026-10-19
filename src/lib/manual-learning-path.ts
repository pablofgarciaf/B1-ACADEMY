import { ALL_MANUALS } from './manuals-120-data';
import { OFFICIAL_SYLLABUS } from './curriculum-data';
/** Explicit subject routes; these are related modules, not claimed one-to-one equivalences. */
export const MANUAL_MODULE_ROUTES: Record<number,string[]> = {
1:['mod-1','mod-2'],2:['mod-12'],3:['mod-7','mod-8'],4:['mod-2','mod-9'],5:['mod-10','mod-7'],6:['mod-11'],7:['mod-10'],8:['mod-13'],9:['mod-15'],10:['mod-16','mod-17'],11:['mod-26','mod-27'],12:['mod-14'],13:['mod-18'],14:['mod-18'],15:['mod-20'],16:['mod-19'],17:['mod-20'],18:['mod-21'],19:['mod-3'],20:['mod-25','mod-28','mod-29'],21:['mod-4'],22:['mod-23','mod-24'],23:['mod-28','mod-30']
};
export function manualLearningPath(id:string) {
 const manual=ALL_MANUALS.find(item=>item.id===id);
 const modules=(manual?MANUAL_MODULE_ROUTES[manual.categoryOrder]??[]:[]).map(id=>OFFICIAL_SYLLABUS.find(m=>m.id===id)).filter((m):m is typeof OFFICIAL_SYLLABUS[number]=>Boolean(m));
 return {manual,modules};
}
export function lessonHref(moduleId:string,classId:string){return '/mi-aula/'+encodeURIComponent(moduleId)+'?clase='+encodeURIComponent(classId);}
