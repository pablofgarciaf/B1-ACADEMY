import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { ALL_MANUALS } from '@/lib/manuals-120-data';

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
    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY || "dummy-key-for-build",
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    const { messages } = await req.json();
    const latestUserMessage = messages[messages.length - 1]?.content || "";
    
    const { catalog, contextStr } = getRelevantContext(latestUserMessage);

    const systemPrompt = `Eres SAPI, la asistente experta de B1 Academy. Conoces al revés y al derecho los 120 manuales oficiales de SAP Business One.

Reglas estrictas:
1. Siempre responde en español
2. Cuando menciones un manual, usa este formato exacto: [Nombre del Manual](/manuales/ID_DEL_MANUAL) para que sea un enlace clickeable
3. Sé precisa, concisa y profesional pero cercana
4. Si la pregunta no tiene que ver con SAP B1, responde amablemente que tu especialidad es SAP Business One
5. Cuando no estés segura, recomienda consultar con un profesor vía WhatsApp
6. Siempre sugiere al menos un manual relevante al final de tu respuesta

CATÁLOGO DE MANUALES:
${catalog}

CONTEXTO RELEVANTE:
${contextStr}`;

    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
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
