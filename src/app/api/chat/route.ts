import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { ALL_MANUALS } from '@/lib/manuals-120-data';
import { z } from 'zod';

const chatSchema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(4000) })).min(1).max(20),
});
const attempts = new Map<string, { count: number; resetAt: number }>();

function getRelevantContext(query: string) {
  const manualsDir = path.join(process.cwd(), 'public', 'Capacitacion SAP');

  // Prepare catalog string
  const catalog = ALL_MANUALS.map(m => `#${m.id} - ${m.title} (${m.category}) -> /manuales/${m.id}`).join('\n');

  let contextStr = "";
  let matchCount = 0;

  const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);

  if (fs.existsSync(manualsDir)) {
    const folders = fs.readdirSync(manualsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const folder of folders) {
      if (matchCount >= 3) break;

      const slidePath = path.join(manualsDir, folder, `${folder}_slides.md`);
      if (fs.existsSync(slidePath)) {
        const content = fs.readFileSync(slidePath, 'utf-8');
        const lowerContent = content.toLowerCase();

        if (keywords.length === 0 || keywords.some(k => lowerContent.includes(k))) {
          contextStr += `\n--- Extracto de ${folder} ---\n`;
          contextStr += content.substring(0, 1500) + "...\n";
          matchCount++;
        }
      }
    }
  }

  return { catalog, contextStr };
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const now = Date.now();
    const limit = attempts.get(ip);
    if (limit && limit.resetAt > now && limit.count >= 10) {
      return NextResponse.json({ error: 'Demasiadas solicitudes.' }, { status: 429 });
    }
    attempts.set(ip, limit && limit.resetAt > now ? { ...limit, count: limit.count + 1 } : { count: 1, resetAt: now + 15 * 60_000 });
    const parsed = chatSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
    if (!process.env.NVIDIA_API_KEY) return NextResponse.json({ error: 'Asistente no configurado.' }, { status: 503 });
    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    const { messages } = parsed.data;
    const latestUserMessage = messages[messages.length - 1]?.content || "";

    const { catalog, contextStr } = getRelevantContext(latestUserMessage);

    const systemPrompt = `Eres @Fini AI (🐦‍🔥 el Fénix de B1 Academy), el tutor virtual y copiloto inteligente de SAP Business One para Ecuador y Latinoamérica. Conoces al revés y al derecho los manuales oficiales de SAP Business One y el simulador contable y operativo.

Reglas estrictas:
1. Siempre responde en español
2. Cuando menciones un manual, usa este formato exacto: [Nombre del Manual](/manuales/ID_DEL_MANUAL) para que sea un enlace clickeable
3. Sé precisa, concisa y profesional pero cercana.
4. Si te preguntan cómo verificar mayores de cuentas o bancos en el sistema, indica la ruta real: **Finanzas & Contabilidad > [FIN002] Libro Mayor** (filtrando por la cuenta correspondiente, ej: 1.1.02 Bancos) y para conciliar con extractos **Gestión de Bancos > [BNK001] Conciliación Bancaria**. NUNCA inventes botones ficticios como "Verificar Mayor" ni fechas del 2022.
5. Si la pregunta no tiene que ver con SAP B1 o contabilidad empresarial, responde amablemente que tu especialidad es SAP Business One
6. Cuando no estés segura, recomienda consultar con un profesor vía WhatsApp
7. Siempre sugiere al menos un manual relevante al final de tu respuesta
8. POLÍTICA ESTRICTA DE INTEGRIDAD ACADÉMICA (PROHIBIDO RESPONDER PREGUNTAS DE EXAMEN O QUIZ):
   Si el usuario te pregunta directa o indirectamente por la respuesta a una pregunta de evaluación, quiz o examen (por ejemplo: "¿cuál es la respuesta de la pregunta 1?", "¿qué opción debo marcar?", "resuelve este quiz", o pega una pregunta con opciones de respuesta):
   TIENES ESTRICTAMENTE PROHIBIDO DAR LA RESPUESTA O DECIR CUÁL ES LA OPCIÓN CORRECTA.
   En su lugar, debes responder con este protocolo exacto:
   a) Negarte con firmeza y amabilidad profesional: "Como Tutor Virtual de B1 Academy, tengo estrictamente prohibido dar respuestas directas a preguntas de exámenes o evaluaciones."
   b) Orientación de estudio: Indicarle exactamente qué manual, diapositiva o tema del sistema debe repasar en el Teleprompter para deducir la respuesta por su propia cuenta.
   c) Advertencia de expediente: Notificarle que el intento de solicitar respuestas a la IA ha sido registrado en su expediente académico.
   d) Recordatorio de Bolsa de Empleo: Recordarle textualmente que para acceder a las ofertas de la Bolsa de Empleo con empresas partners de SAP, es REQUISITO OBLIGATORIO aprobar una evaluación presencial semi-oral en vivo frente a un reclutador técnico experto, por lo que memorizar o intentar trampear las respuestas en la plataforma no le servirá al momento de defender sus conocimientos en la entrevista real.

CATÁLOGO DE MANUALES:
${catalog}

CONTEXTO RELEVANTE:
${contextStr}`;

    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.2-11b-vision-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.2,
      max_tokens: 1024,
    });

    return NextResponse.json({ message: completion.choices[0].message.content });
  } catch (error: any) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
