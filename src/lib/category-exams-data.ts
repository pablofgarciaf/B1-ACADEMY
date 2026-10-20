import { ALL_MANUALS } from './manuals-120-data';
import { MANUAL_SPECIFIC_QUIZZES, shuffleQuizOptions, type QuizQuestion } from './manual-quizzes-data';
export interface CategoryExam {categoryName:string;badgeTitle:string;description:string;passingScore:number;questions:QuizQuestion[]}
export const CATEGORY_EXAMS:Record<string,CategoryExam>=Object.fromEntries([...new Set(ALL_MANUALS.map(m=>m.category))].map(categoryName=>{
 const questions=ALL_MANUALS.filter(m=>m.category===categoryName).flatMap(m=>MANUAL_SPECIFIC_QUIZZES[m.id]);
 return [categoryName,{categoryName,badgeTitle:'Repaso de '+categoryName,description:'Casos aplicados de los manuales de esta categoría. Este repaso no emite una constancia.',passingScore:Math.ceil(questions.length*.9),questions}];
}));
export function getCategoryExam(categoryName:string):CategoryExam {
 const exam=CATEGORY_EXAMS[categoryName];
 if(!exam)throw new Error('No existe un repaso revisado para esta categoría.');
 const questions=exam.questions.map(q=>shuffleQuizOptions(q));
 for(let i=questions.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[questions[i],questions[j]]=[questions[j],questions[i]];}
 return {...exam,questions};
}
