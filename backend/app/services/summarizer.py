import json
from typing import Dict, Any, List
from groq import Groq
from app.config import GROQ_API_KEY

def summarize_transcription(text: str, title: str = "") -> Dict[str, Any]:
    """
    Generates an executive summary, key bullet points, and key takeaway
    using Groq LLM (llama-3.3-70b-versatile).
    Guaranteed JSON response.
    """
    clean_text = (text or "").strip()
    if not clean_text:
        return {
            "success": False,
            "error": "Texto vazio para resumo."
        }

    # If no API key configured (e.g. local test mode), return clean algorithmic fallback
    if not GROQ_API_KEY or GROQ_API_KEY == "sua_chave_groq_aqui":
        sentences = [s.strip() for s in clean_text.split(".") if len(s.strip()) > 15]
        resumo = sentences[0] if sentences else "Este conteúdo apresenta os pontos centrais da discussão."
        topicos = sentences[1:5] if len(sentences) > 1 else ["Visão geral dos conceitos apresentados."]
        return {
            "success": True,
            "executive_summary": resumo + ".",
            "key_points": [t + "." for t in topicos],
            "takeaway": "Material rico para consulta e aproveitamento prático dos tópicos abordados."
        }

    try:
        client = Groq(api_key=GROQ_API_KEY)
        # Limit text length if extremely long to fit within context (first ~25,000 chars)
        prompt_text = clean_text[:25000]

        system_instruction = (
            "Você é o assistente de inteligência artificial de alta performance do Peguei o Texto. "
            "Sua tarefa é analisar a transcrição de um vídeo ou áudio e produzir uma síntese de altíssimo nível, "
            "100% em português brasileiro, clara, executiva e altamente produtiva. "
            "Regra de redação: nunca utilize travessões ou traços longos na escrita; utilize dois pontos, vírgulas ou parênteses.\n"
            "Retorne OBRIGATORIAMENTE um JSON com as seguintes chaves:\n"
            "- 'executive_summary': string contendo um parágrafo envolvente e direto (3 a 5 frases) com o resumo central.\n"
            "- 'key_points': array de strings com 3 a 6 tópicos essenciais e ensinamentos práticos abordados.\n"
            "- 'takeaway': string contendo a principal lição, conclusão ou ação recomendada para quem assistiu/ouviu."
        )

        user_content = f"Título do conteúdo: {title or 'Conteúdo em Áudio'}\n\nTranscrição:\n{prompt_text}"

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_content}
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=1000
        )

        result_raw = response.choices[0].message.content
        data = json.loads(result_raw)

        return {
            "success": True,
            "executive_summary": data.get("executive_summary", "Resumo processado com sucesso."),
            "key_points": data.get("key_points", []),
            "takeaway": data.get("takeaway", "")
        }
    except Exception as e:
        print(f"[Summarizer] Erro ao chamar Groq LLM: {e}")
        # Graceful fallback: produce structured summary from the text rather than crashing
        sentences = [s.strip() for s in clean_text.split(".") if len(s.strip()) > 15]
        resumo = sentences[0] if sentences else "Conteúdo transcrito com sucesso."
        topicos = sentences[1:5] if len(sentences) > 1 else ["Principais conceitos abordados no conteúdo."]
        return {
            "success": True,
            "executive_summary": resumo + ".",
            "key_points": [t + "." for t in topicos],
            "takeaway": "Síntese automática dos pontos mais relevantes da transcrição."
        }
