import json
from typing import Dict, Any, Optional
from groq import Groq
from app.config import GROQ_API_KEY

SUPPORTED_LANGUAGES: Dict[str, str] = {
    "en": "Inglês (English)",
    "es": "Espanhol (Español)",
    "pt": "Português (Português)",
    "fr": "Francês (Français)",
    "de": "Alemão (Deutsch)",
    "it": "Italiano (Italiano)",
    "zh": "Mandarim (中文)",
    "ja": "Japonês (日本語)",
    "ru": "Russo (Русский)"
}

def translate_transcription(
    text: str,
    target_language: str = "en",
    title: str = ""
) -> Dict[str, Any]:
    """
    Translates transcription text to the target language using Groq LLM (llama-3.3-70b-versatile).
    Feature restricted to paid plans.
    """
    clean_text = (text or "").strip()
    if not clean_text:
        return {
            "success": False,
            "error": "Texto vazio para tradução."
        }

    lang_code = target_language.lower().strip()
    lang_name = SUPPORTED_LANGUAGES.get(lang_code, lang_code.capitalize())

    # Fallback if no GROQ_API_KEY configured (local dev test mode)
    if not GROQ_API_KEY or GROQ_API_KEY == "sua_chave_groq_aqui":
        translated_preview = (
            f"[{lang_name} Translation - Modo Simulado]\n\n"
            f"{clean_text}\n\n"
            f"(Tradução processada com sucesso. Para tradução em tempo real com IA, configure sua GROQ_API_KEY no arquivo .env do backend.)"
        )
        return {
            "success": True,
            "translated_text": translated_preview,
            "target_language": lang_code,
            "target_language_name": lang_name,
            "engine": "Peguei o Texto IA (Modo Teste)"
        }

    try:
        client = Groq(api_key=GROQ_API_KEY)

        # Context limit protection (~30,000 characters)
        prompt_text = clean_text[:30000]

        system_instruction = (
            f"Você é um tradutor profissional de altíssima fidelidade da plataforma Peguei o Texto. "
            f"Sua missão é traduzir com perfeição e naturalidade o texto transcrito fornecido para o idioma: {lang_name}.\n"
            f"Diretrizes:\n"
            f"1. Mantenha a pontuação, divisão de parágrafos e tom original (formal, informal ou técnico).\n"
            f"2. Adapte gírias e expressões idiomáticas com naturalidade para o idioma de destino.\n"
            f"3. NUNCA adicione preâmbulos, notas de tradutor ou comentários como 'Aqui está a tradução'.\n"
            f"4. Retorne EXCLUSIVAMENTE o texto traduzido."
        )

        user_content = f"Texto a ser traduzido para {lang_name}:\n\n{prompt_text}"

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_content}
            ],
            temperature=0.3,
            max_tokens=3500
        )

        translated_result = response.choices[0].message.content.strip()

        return {
            "success": True,
            "translated_text": translated_result,
            "target_language": lang_code,
            "target_language_name": lang_name,
            "engine": "Llama 3.3 70B (Groq)"
        }
    except Exception as e:
        print(f"[Translator] Erro ao chamar Groq LLM para tradução: {e}")
        return {
            "success": False,
            "error": f"Falha ao realizar tradução: {str(e)}"
        }

