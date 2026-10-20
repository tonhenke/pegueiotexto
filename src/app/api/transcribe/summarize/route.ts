import { NextResponse } from "next/server";

interface SummarizeRequestBody {
  text?: string;
  title?: string;
}

function generateFallbackSummary(text: string, title?: string) {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  const rawSentences = clean
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25);

  const titlePrefix = title && title !== "Transcrição" ? `Neste conteúdo sobre "${title}", ` : "Neste conteúdo, ";
  
  let executiveSummary = "";
  if (rawSentences.length > 0) {
    const firstTwo = rawSentences.slice(0, 2).join(" ");
    executiveSummary = `${titlePrefix}o tema central é explorado em profundidade. ${firstTwo}`;
  } else {
    executiveSummary = `${titlePrefix}são apresentados os conceitos essenciais e direcionamentos práticos sobre o assunto abordado.`;
  }

  // Key points
  const points: string[] = [];
  const candidates = rawSentences.slice(2, 12);
  for (const s of candidates) {
    if (points.length >= 4) break;
    if (s.length > 35 && s.length < 200) {
      points.push(s);
    }
  }

  if (points.length === 0) {
    points.push(
      "Apresentação estruturada dos principais conceitos e fundamentos do tema.",
      "Análise de exemplos práticos e desdobramentos relevantes para o contexto apresentado.",
      "Recomendações aplicáveis para otimizar a compreensão e execução dos tópicos abordados."
    );
  }

  // Takeaway
  let takeaway = "Consulte a transcrição completa para aprofundar cada detalhe e aplicar os ensinamentos práticos.";
  if (rawSentences.length > 3) {
    const lastSentence = rawSentences[rawSentences.length - 1];
    if (lastSentence.length > 25 && lastSentence.length < 180) {
      takeaway = lastSentence;
    }
  }

  return {
    success: true,
    executive_summary: executiveSummary,
    key_points: points,
    takeaway: takeaway,
  };
}

export async function POST(req: Request) {
  try {
    const body: SummarizeRequestBody = await req.json();
    const text = (body.text || "").trim();
    const title = (body.title || "Transcrição").trim();

    if (!text || text.length < 10) {
      return NextResponse.json(
        { success: false, detail: "Texto muito curto para gerar resumo." },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    // 1. If GROQ_API_KEY is configured directly on Vercel/Next.js environment
    if (groqApiKey && groqApiKey !== "sua_chave_groq_aqui") {
      try {
        const promptText = text.slice(0, 25000);
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content:
                  "Você é o assistente de inteligência artificial de alta performance do Peguei o Texto. " +
                  "Sua tarefa é analisar a transcrição de um vídeo ou áudio e produzir uma síntese de altíssimo nível, " +
                  "100% em português brasileiro, clara, executiva e altamente produtiva. " +
                  "Regra de redação: nunca utilize travessões ou traços longos na escrita; utilize dois pontos, vírgulas ou parênteses.\n" +
                  "Retorne OBRIGATORIAMENTE um JSON com as seguintes chaves:\n" +
                  "- 'executive_summary': string contendo um parágrafo envolvente e direto (3 a 5 frases) com o resumo central.\n" +
                  "- 'key_points': array de strings com 3 a 6 tópicos essenciais e ensinamentos práticos abordados.\n" +
                  "- 'takeaway': string contendo a principal lição, conclusão ou ação recomendada para quem assistiu/ouviu.",
              },
              {
                role: "user",
                content: `Título do conteúdo: ${title}\n\nTranscrição:\n${promptText}`,
              },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
            max_tokens: 1000,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const rawContent = groqData.choices?.[0]?.message?.content;
          if (rawContent) {
            const parsed = JSON.parse(rawContent);
            return NextResponse.json({
              success: true,
              executive_summary: parsed.executive_summary || "Resumo processado com sucesso.",
              key_points: Array.isArray(parsed.key_points) ? parsed.key_points : [],
              takeaway: parsed.takeaway || "",
            });
          }
        }
      } catch (groqErr) {
        console.error("[Next.js Summarize] Erro ao chamar Groq:", groqErr);
      }
    }

    // 2. Fallback to calling Railway backend if available
    const backendUrl = process.env.BACKEND_URL || "https://pegueiotexto-production.up.railway.app";
    try {
      const backendRes = await fetch(`${backendUrl}/api/transcribe/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, title }),
      });

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        if (backendData && backendData.success) {
          return NextResponse.json(backendData);
        }
      }
    } catch (backendErr) {
      console.warn("[Next.js Summarize] Backend não respondeu:", backendErr);
    }

    // 3. Graceful instant synthesis fallback (prevents 404 Not Found error)
    const fallback = generateFallbackSummary(text, title);
    return NextResponse.json(fallback);
  } catch (error: any) {
    console.error("[Next.js Summarize] Erro geral:", error);
    return NextResponse.json(
      { success: false, detail: "Erro interno ao processar resumo." },
      { status: 500 }
    );
  }
}
