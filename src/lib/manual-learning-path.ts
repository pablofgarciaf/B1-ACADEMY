import { ALL_MANUALS } from './manuals-120-data';
import { OFFICIAL_SYLLABUS } from './curriculum-data';
/** Explicit subject routes; these are related modules, not claimed one-to-one equivalences. */
export const MANUAL_MODULE_ROUTES: Record<number,string[]> = {
1:['mod-1','mod-2'],2:['mod-12'],3:['mod-7','mod-8'],4:['mod-2','mod-9'],5:['mod-10','mod-7'],6:['mod-11'],7:['mod-10'],8:['mod-13'],9:['mod-15'],10:['mod-16','mod-17'],11:['mod-26','mod-27'],12:['mod-14'],13:['mod-18'],14:['mod-18'],15:['mod-20'],16:['mod-19'],17:['mod-20'],18:['mod-21'],19:['mod-3'],20:['mod-25','mod-28','mod-29'],21:['mod-4'],22:['mod-23','mod-24'],23:['mod-28','mod-30']
};
/** Clases de la malla que tratan el tema concreto, revisadas por código de manual. */
const MANUAL_CLASSES:Record<string,string[]>={
'1.1':['mod1-c1'],'1.2':['mod1-c2','mod1-c4'],'1.3':['mod1-c3'],
'2.1':['mod12-c1'],'2.2':['mod12-c1','mod12-c3'],'2.3':['mod2-c1'],'2.4':['mod14-c1','mod14-c2'],'2.5':['mod12-c2'],'2.6':['mod12-c4'],'2.7':['mod12-c4'],
'3.1':['mod7-c1'],'3.2':['mod7-c1'],'3.3':['mod8-c1'],'3.4':['mod8-c2'],'3.5':['mod7-c1','mod7-c2'],'3.6':['mod8-c3'],'3.7':['mod7-c5'],'3.8':['mod7-c5'],
'4.1':['mod2-c2'],'4.2':['mod2-c2'],'4.3':['mod2-c3'],'4.4':['mod2-c3'],'4.5':['mod9-c1'],'4.6':['mod9-c2'],'4.7':['mod9-c3'],
'5.1':['mod7-c2'],'5.2':['mod7-c2'],'5.3':['mod7-c4'],'5.4':['mod7-c4','mod9-c3'],'5.5':['mod10-c4'],'5.6':['mod12-c3'],
'6.1':['mod11-c1'],'6.2':['mod11-c2'],
'7.1':['mod7-c3'],'7.2':['mod10-c2'],'7.3':['mod10-c1'],'7.4':['mod10-c2','mod9-c1'],'7.5':['mod10-c3'],'7.6':['mod7-c4','mod10-c1'],
'8.1':['mod2-c4'],'8.2':['mod13-c1'],'8.3':['mod13-c1'],'8.4':['mod13-c2'],'8.5':['mod13-c3'],'8.6':['mod13-c4'],
'9.1':['mod15-c1'],'9.2':['mod15-c2'],'9.3':['mod15-c3'],
'10.1':['mod16-c2'],'10.2':['mod17-c1'],'10.3':['mod17-c2'],'10.4':['mod16-c1'],'10.5':['mod16-c2'],'10.6':['mod16-c1','mod16-c3'],'10.7':['mod17-c3'],'10.8':['mod16-c3'],'10.9':['mod16-c3'],
'11.1':['mod16-c4'],'11.2':['mod16-c4'],'12.1':['mod14-c3'],
'13.1':['mod18-c1'],'13.2':['mod20-c1'],'13.3':['mod18-c1'],'13.4':['mod18-c2'],'13.5':['mod18-c2'],'13.6':['mod20-c2'],
'14.1':['mod18-c1','mod18-c3'],'14.2':['mod18-c3'],
'15.1':['mod18-c3'],'15.2':['mod18-c3'],'15.3':['mod20-c3'],'15.4':['mod18-c4'],'15.5':['mod18-c4'],'15.6':['mod19-c3'],
'16.1':['mod19-c1'],'16.2':['mod19-c2'],'16.3':['mod19-c3'],
'17.1':['mod20-c4'],'17.2':['mod20-c4'],'17.3':['mod19-c4'],'17.4':['mod19-c4'],
'18.1':['mod21-c1'],'18.2':['mod21-c2'],'18.3':['mod9-c4'],'18.4':['mod21-c3'],
'19.1':['mod3-c1'],'19.2':['mod3-c1','mod3-c2'],'19.3':['mod3-c1'],'19.4':['mod3-c2'],'19.5':['mod3-c3'],'19.6':['mod3-c4'],
'20.1':['mod25-c1','mod29-c1'],'20.2':['mod29-c2'],'20.3':['mod4-c5'],'20.4':['mod29-c3'],'20.5':['mod29-c4'],'20.6':['mod23-c4'],'20.7':['mod23-c4'],'20.8':['mod29-c4'],
'21.1':['mod4-c5'],'21.2':['mod4-c6'],'21.3':['mod4-c4'],'21.4':['mod4-c1'],'21.5':['mod4-c3'],'21.6':['mod4-c2'],'21.7':['mod4-c3'],
'22.1':['mod23-c1'],'22.2':['mod23-c2'],'22.3':['mod23-c2'],'22.4':['mod23-c3'],'22.5':['mod23-c3'],'22.6':['mod24-c1'],'22.7':['mod24-c2'],
'23.1':['mod4-c4'],'23.2':['mod30-c1'],'23.3':['mod30-c1'],'23.4':['mod30-c2'],'23.5':['mod30-c2'],'23.6':['mod30-c3'],'23.7':['mod30-c3'],
};
export function manualLearningPath(id:string) {
 const manual=ALL_MANUALS.find(item=>item.id===id);
 const classes=manual?MANUAL_CLASSES[manual.id.split('_')[0]]??[]:[];
 const modules=OFFICIAL_SYLLABUS.map(module=>({...module,classes:module.classes.filter(lesson=>classes.includes(lesson.id))})).filter(module=>module.classes.length>0);
 return {manual,modules};
}
export function lessonHref(moduleId:string,classId:string){return '/mi-aula/'+encodeURIComponent(moduleId)+'?clase='+encodeURIComponent(classId);}
