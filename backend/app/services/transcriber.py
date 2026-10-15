from pathlib import Path
from typing import List, Dict, Any
from groq import Groq
from app.config import GROQ_API_KEY

def format_timestamp_srt(seconds: float) -> str:
    """Format seconds into SRT timestamp (HH:MM:SS,mmm)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds - int(seconds)) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

def format_timestamp_vtt(seconds: float) -> str:
    """Format seconds into WebVTT timestamp (HH:MM:SS.mmm)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds - int(seconds)) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}.{millis:03d}"

def segments_to_srt(segments: List[Dict[str, Any]]) -> str:
    """Converts verbose segments to SubRip (.srt) subtitle text."""
    lines = []
    for i, seg in enumerate(segments, 1):
        start = format_timestamp_srt(seg.get("start", 0))
        end = format_timestamp_srt(seg.get("end", 0))
        text = seg.get("text", "").strip()
        lines.append(f"{i}\n{start} --> {end}\n{text}\n")
    return "\n".join(lines)

def segments_to_vtt(segments: List[Dict[str, Any]]) -> str:
    """Converts verbose segments to WebVTT (.vtt) subtitle text."""
    lines = ["WEBVTT\n"]
    for seg in segments:
        start = format_timestamp_vtt(seg.get("start", 0))
        end = format_timestamp_vtt(seg.get("end", 0))
        text = seg.get("text", "").strip()
        lines.append(f"{start} --> {end}\n{text}\n")
    return "\n".join(lines)

def mock_transcription(title: str = "Vídeo") -> dict:
    """Simulated transcription for testing when no Groq API Key is configured."""
    segments = [
        {"start": 0.0, "end": 6.5, "text": f"Olá a todos! Bem-vindos à transcrição de {title} no Peguei o Texto."},
        {"start": 6.8, "end": 14.2, "text": "Nossa plataforma utiliza modelos de ponta baseados no Whisper Large v3 para garantir máxima precisão em português."},
        {"start": 14.5, "end": 22.0, "text": "Este resultado inclui marcas temporais completas para gerar arquivos .SRT de legendas e .VTT para a web."},
        {"start": 22.4, "end": 30.1, "text": "Para ativar transcrições reais com áudio ao vivo, basta configurar sua GROQ_API_KEY no arquivo .env do backend."},
        {"start": 30.5, "end": 38.0, "text": "Lembrando que o arquivo de mídia carregado é permanentemente excluído logo após o processamento para garantir total privacidade."}
    ]
    full_text = " ".join(s["text"] for s in segments)
    return {
        "text": full_text,
        "segments": segments,
        "srt": segments_to_srt(segments),
        "vtt": segments_to_vtt(segments),
        "language": "pt",
        "duration": 38.0,
        "engine": "mock-whisper (adicione GROQ_API_KEY no .env para transcrição real)"
    }

def transcribe_audio_file(audio_path: str | Path, language: str = "pt", model: str = "whisper-large-v3-turbo") -> dict:
    """
    Transcribes an audio file using Groq Whisper Large v3 API.
    """
    path = Path(audio_path)
    if not path.exists():
        raise FileNotFoundError(f"Arquivo de áudio não encontrado: {audio_path}")

    # Fallback to simulated mode if no API key is set
    if not GROQ_API_KEY or GROQ_API_KEY == "sua_chave_groq_aqui":
        print("[Transcriber] GROQ_API_KEY não configurada. Usando transcrição simulada.")
        return mock_transcription(title=path.stem)

    client = Groq(api_key=GROQ_API_KEY)

    with open(path, "rb") as file_handle:
        transcription_resp = client.audio.transcriptions.create(
            file=(path.name, file_handle.read()),
            model=model,
            language=language if language != "auto" else None,
            response_format="verbose_json",
            temperature=0.0
        )

    # Groq verbose_json returns a TranscriptionVerbose object with .text and .segments
    full_text = getattr(transcription_resp, "text", "") or ""
    raw_segments = getattr(transcription_resp, "segments", []) or []

    segments = []
    for s in raw_segments:
        start_val = getattr(s, "start", None)
        end_val = getattr(s, "end", None)
        text_val = getattr(s, "text", "")
        if isinstance(s, dict):
            start_val = s.get("start", 0)
            end_val = s.get("end", 0)
            text_val = s.get("text", "")
        segments.append({
            "start": float(start_val or 0),
            "end": float(end_val or 0),
            "text": str(text_val or "").strip()
        })

    duration = float(getattr(transcription_resp, "duration", 0) or (segments[-1]["end"] if segments else 0))

    return {
        "text": full_text,
        "segments": segments,
        "srt": segments_to_srt(segments),
        "vtt": segments_to_vtt(segments),
        "language": getattr(transcription_resp, "language", language),
        "duration": duration,
        "engine": f"groq-{model}"
    }
