/**
 * Evaluador del examen de certificación: NVIDIA primero y, si no responde o falla, Gemini.
 * Sin evaluador disponible NUNCA se inventa una nota (se lanza EvaluatorUnavailableError).
 * Sin dependencias del proyecto para poder probarlo aislado (scratch/test_exam_evaluator.ts).
 */

export interface QuestionResult { score: number; covered: string[]; missing: string[]; feedback: string; evaluator: string }

export class EvaluatorUnavailableError extends Error {}

function examinerPrompt(maxPoints: number) {
  return [
    'Eres el examinador de certificación de B1 Academy Ecuador para SAP Business One y su simulador Finix ERP. Eres pedagógico, comprensivo y rigurosamente justo.',
    `La escala de calificación para esta pregunta es de 0 a ${maxPoints} puntos (escala entera de números enteros, donde ${maxPoints} es la nota máxima perfecta).`,
    'Ten en cuenta que el alumno utiliza el simulador interactivo Finix ERP / SAP Business One, por lo que menciones a "Finix ERP", "Finix", "el simulador" o "SAP Business One" son totalmente equivalentes y 100% válidas.',
    'Evalúa la comprensión conceptual y operativa de los puntos de la rúbrica. Si el alumno explica las ideas clave con sus propias palabras, otórgale el puntaje completo de ese concepto.',
    `PUNTUACIÓN OBLIGATORIA: Si la respuesta cubre todos los conceptos de la rúbrica, el score DEBE ser ${maxPoints}. Si cubre solo una parte, asigna el puntaje proporcional (ejemplo: si son 3 conceptos y cubre los 3, score = ${maxPoints}; si cubre 2 de 3, score = Math.round(${maxPoints} * 2 / 3)).`,
    'COHERENCIA CRÍTICA: El número en "score" DEBE ser totalmente coherente con tu "feedback". NUNCA devuelvas score 0 si en tu feedback felicitas al alumno o dices que respondió de manera excelente, precisa o correcta.',
    'Devuelve ÚNICAMENTE un objeto JSON: {"score": número entero entre 0 y ' + maxPoints + ', "covered": [conceptos demostrados], "missing": [conceptos omitidos], "feedback": "2-3 frases en español felicitando o explicando constructivamente qué faltó"}.',
  ].join(' ');
}

/** Extrae y valida el JSON del evaluador con salvaguardas de consistencia lógica */
function parseEvaluation(raw: string, maxPoints: number, evaluator: string): QuestionResult {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('respuesta sin JSON');
  const parsed = JSON.parse(match[0]) as Partial<QuestionResult> & { score?: number | string };
  
  const toList = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 10) : []);
  const covered = toList(parsed.covered);
  const missing = toList(parsed.missing);
  const feedback = typeof parsed.feedback === 'string' ? parsed.feedback.slice(0, 1200) : 'Respuesta evaluada.';
  
  let score = typeof parsed.score === 'number' ? parsed.score : Number(parsed.score);
  if (isNaN(score)) score = 0;

  // Si el modelo devolvió escala fraccionaria 0.0 - 1.0
  if (score > 0 && score <= 1.0 && maxPoints > 1) {
    score = score * maxPoints;
  }

  // Salvaguarda de Coherencia:
  const feedbackLower = feedback.toLowerCase();
  const esElogioRotundo = 
    feedbackLower.includes('excelente') || 
    feedbackLower.includes('gran precisión') || 
    feedbackLower.includes('comprensión muy clara') || 
    feedbackLower.includes('has abordado todos los puntos') ||
    feedbackLower.includes('perfectamente');

  if (covered.length > 0 && missing.length === 0) {
    // Si cubrió todos los puntos de la rúbrica y no falta nada
    score = maxPoints;
  } else if (esElogioRotundo && score < Math.round(maxPoints * 0.7)) {
    // Si el feedback alaba rotundamente la respuesta, otorgar puntaje alto/máximo
    score = maxPoints;
  } else if (covered.length > 0 && (covered.length + missing.length) > 0 && score === 0) {
    // Si cubrió conceptos pero por error del LLM devolvió score 0
    score = Math.round((covered.length / (covered.length + missing.length)) * maxPoints);
  }

  return {
    score: Math.round(Math.min(maxPoints, Math.max(0, score))),
    covered,
    missing,
    feedback,
    evaluator,
  };
}

async function evaluateWithNvidia(apiKey: string, system: string, user: string, maxPoints: number): Promise<QuestionResult> {
  // Nemotron 3 Super (120B) no está disponible en esta cuenta (HTTP 404).
  // Fallback: llama-3.2-90b-vision-instruct — el único modelo funcional en la clave nvapi actual.
  const model = process.env.NVIDIA_EXAM_MODEL || 'meta/llama-3.2-90b-vision-instruct';
  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(30_000),
    body: JSON.stringify({
      model, temperature: 0.1, max_tokens: 700,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json() as { choices?: { message?: { content?: string } }[] };
  return parseEvaluation(data.choices?.[0]?.message?.content ?? '', maxPoints, `nvidia:${model}`);
}

async function evaluateWithGemini(apiKey: string, system: string, user: string, maxPoints: number): Promise<QuestionResult> {
  const model = process.env.EXAM_MODEL || 'gemini-2.5-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { temperature: 0.1, responseMimeType: 'application/json' },
    }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  return parseEvaluation(data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '', maxPoints, `gemini:${model}`);
}

export async function evaluateAnswer(question: string, rubric: string[], answer: string, maxPoints: number): Promise<QuestionResult> {
  const system = examinerPrompt(maxPoints);
  const user = JSON.stringify({ pregunta: question, rubrica: rubric, respuesta_del_estudiante: answer });
  const providers: [string, string | undefined, typeof evaluateWithNvidia][] = [
    ['NVIDIA', process.env.NVIDIA_API_KEY, evaluateWithNvidia],
    ['Gemini', process.env.GEMINI_API_KEY, evaluateWithGemini],
  ];
  const failures: string[] = [];
  for (const [name, key, run] of providers) {
    if (!key) { failures.push(`${name}: sin llave`); continue; }
    try {
      return await run(key, system, user, maxPoints);
    } catch (error) {
      failures.push(`${name}: ${error instanceof Error ? error.message : 'error'}`);
    }
  }
  console.error('Evaluador de examen no disponible →', failures.join(' | '));
  throw new EvaluatorUnavailableError(failures.join(' | '));
}
