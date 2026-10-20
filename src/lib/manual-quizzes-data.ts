import { ALL_MANUALS } from './manuals-120-data';
import { legacyManualCode } from './manual-legacy-codes';
import { MANUAL_CASES } from './manual-cases';

export interface QuizQuestion { q:string; options:string[]; answer:number; explanation:string; topic?:string; recommendedManualId?:string; recommendedManualTitle?:string }
/** Permuta alternativas y conserva su identidad; no altera el contenido ni el índice correcto. */
export function shuffleQuizOptions(question:QuizQuestion, random:()=>number=Math.random):QuizQuestion {
 const choices=question.options.map((text,index)=>({text,correct:index===question.answer}));
 for(let i=choices.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
 return {...question,options:choices.map(c=>c.text),answer:choices.findIndex(c=>c.correct)};
}
export const MANUAL_SPECIFIC_QUIZZES:Record<string,QuizQuestion[]>=Object.fromEntries(ALL_MANUALS.map(manual=>{
 const entry=MANUAL_CASES[manual.id.split('_')[0]];
 return [manual.id,entry?[{q:entry[0],options:entry[1],answer:0,explanation:entry[2],topic:manual.title,recommendedManualId:manual.id,recommendedManualTitle:manual.title}]:[]];
}));
export function getQuizForManual(manualId:string,_manualTitle:string,_manualCategory:string):QuizQuestion[]{
 const manual=ALL_MANUALS.find(m=>m.id===manualId||legacyManualCode(m.id)===manualId);
 return (manual?MANUAL_SPECIFIC_QUIZZES[manual.id]:[]).map(q=>shuffleQuizOptions(q));
}
