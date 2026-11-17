import os
import re
import uuid
import shutil
import subprocess
from pathlib import Path
from typing import List, Dict, Any, Optional
from groq import Groq
from app.config import GROQ_API_KEY

# Maximum file size Groq Whisper accepts (Groq hard limit is 25 MB = 26,214,400 bytes)
# We set safety threshold at 24 MB to avoid edge cases with headers
GROQ_MAX_FILE_SIZE_BYTES = 24 * 1024 * 1024

# Segment duration for chunking large media files (15 minutes = 900 seconds)
# At 48kbps mono MP3, 15 minutes is only ~5.4 MB, perfectly safe for Groq
CHUNK_DURATION_SECONDS = 900


def get_ffmpeg_path() -> Optional[str]:
    """Locate the ffmpeg binary on the system, in venv, or via imageio_ffmpeg."""
    found = shutil.which("ffmpeg")
    if found:
        return found

    # Check backend venv bin directory
    venv_ffmpeg = Path(__file__).resolve().parent.parent.parent / "venv" / "bin" / "ffmpeg"
    if venv_ffmpeg.exists():
        return str(venv_ffmpeg)

    # Fallback to imageio_ffmpeg if installed
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        pass

    return None


def get_media_duration_seconds(file_path: Path, ffmpeg_exe: str) -> float:
    """Extract media duration in seconds using ffmpeg -i."""
    try:
        cmd = [ffmpeg_exe, "-i", str(file_path)]
        res = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
        match = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.?\d*)", res.stderr)
        if match:
            h, m, s = match.groups()
            return int(h) * 3600 + int(m) * 60 + float(s)
    except Exception as e:
        print(f"[Transcriber] Erro ao obter duração com ffmpeg: {e}")
    return 0.0


def optimize_audio_for_whisper(input_path: Path, ffmpeg_exe: str) -> Path:
    """
    Strips video and re-encodes audio to 16kHz mono 48kbps MP3 speech format.
    Speech at 48kbps mono takes only ~360 KB per minute (~21.6 MB for a full 1-hour audio),
    significantly reducing upload sizes and eliminating video stream overhead.
    """
    output_path = input_path.parent / f"{input_path.stem}_opt_{uuid.uuid4().hex[:8]}.mp3"
    cmd = [
        ffmpeg_exe, "-y",
        "-i", str(input_path),
        "-vn",                   # Remove video stream
        "-ar", "16000",          # 16kHz sample rate standard for Whisper
        "-ac", "1",              # Mono channel
        "-b:a", "48k",           # 48kbps bitrate
        "-map_metadata", "-1",   # Strip unnecessary metadata
        str(output_path)
    ]
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    return output_path


def split_audio_into_chunks(audio_path: Path, ffmpeg_exe: str, segment_seconds: int = CHUNK_DURATION_SECONDS) -> List[Path]:
    """
    Splits an audio file into sequential chunks using ffmpeg copy.
    Returns list of valid chunk Paths.
    """
    pattern = audio_path.parent / f"{audio_path.stem}_chk_%04d.mp3"
    cmd = [
        ffmpeg_exe, "-y",
        "-i", str(audio_path),
        "-f", "segment",
        "-segment_time", str(segment_seconds),
        "-reset_timestamps", "1",
        "-c", "copy",
        str(pattern)
    ]
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

    import glob
    chunk_pattern = str(audio_path.parent / f"{audio_path.stem}_chk_*.mp3")
    all_chunks = sorted(Path(p) for p in glob.glob(chunk_pattern))

    # Filter out empty artifacts (e.g. 0-second trailing chunks under 2KB)
    valid_chunks = [c for c in all_chunks if c.stat().st_size > 2048]
    return valid_chunks


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
        {"start": 6.8, "end": 14.2, "text": "Nossa plataforma utiliza modelos de ponta baseados em Inteligência Artificial para garantir máxima precisão em português."},
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
        "engine": "Peguei o Texto IA"
    }


def transcribe_audio_file(
    audio_path: str | Path,
    language: Optional[str] = None,
    model: str = "whisper-large-v3-turbo"
) -> dict:
    """
    Transcribes an audio or video file using Groq Whisper Large v3 API.
    
    Automatically optimizes video and audio files to 16kHz mono speech MP3
    and seamlessly splits files exceeding Groq's 25 MB limit into 15-minute chunks,
    re-concatenating segments with accurate global timestamps.
    """
    path = Path(audio_path)
    if not path.exists():
        raise FileNotFoundError(f"Arquivo de áudio não encontrado: {audio_path}")

    # Fallback to simulated mode if no API key is set
    if not GROQ_API_KEY or GROQ_API_KEY == "sua_chave_groq_aqui":
        print("[Transcriber] GROQ_API_KEY não configurada. Usando transcrição simulada.")
        return mock_transcription(title=path.stem)

    client = Groq(api_key=GROQ_API_KEY)

    # Determine target language: None allows Whisper to auto-detect the speaker's true language
    target_lang = None
    if language and str(language).strip().lower() not in ["auto", "detect", "none", ""]:
        target_lang = str(language).strip().lower()

    ffmpeg_exe = get_ffmpeg_path()
    temp_files_to_clean: List[Path] = []
    
    working_audio_path = path

    try:
        # Step 1: Optimize media if FFmpeg is available
        # Strips video tracks and compresses audio to mono 48kbps 16kHz speech MP3.
        # This reduces 100MB+ videos down to ~3-10MB pure speech audio.
        if ffmpeg_exe:
            try:
                print(f"[Transcriber] Compactando áudio com FFmpeg: {path.name} ({path.stat().st_size / (1024*1024):.1f} MB)")
                optimized_path = optimize_audio_for_whisper(path, ffmpeg_exe)
                temp_files_to_clean.append(optimized_path)
                working_audio_path = optimized_path
                print(f"[Transcriber] Áudio compactado: {optimized_path.name} ({optimized_path.stat().st_size / (1024*1024):.2f} MB)")
            except Exception as opt_err:
                print(f"[Transcriber] Falha na otimização de áudio, tentando com arquivo original: {opt_err}")

        # Step 2: Check if file still exceeds Groq limit (24 MB)
        current_size = working_audio_path.stat().st_size
        chunks_to_process: List[Path] = []

        if current_size > GROQ_MAX_FILE_SIZE_BYTES and ffmpeg_exe:
            print(f"[Transcriber] Arquivo ainda excede 24 MB ({current_size / (1024*1024):.1f} MB). Fatiando em blocos de 15 minutos...")
            chunks_to_process = split_audio_into_chunks(working_audio_path, ffmpeg_exe, segment_seconds=CHUNK_DURATION_SECONDS)
            temp_files_to_clean.extend(chunks_to_process)
            print(f"[Transcriber] Dividido em {len(chunks_to_process)} blocos.")
        else:
            chunks_to_process = [working_audio_path]

        # Step 3: Transcribe chunk by chunk
        all_segments: List[Dict[str, Any]] = []
        all_texts: List[str] = []
        detected_language = language or "pt"
        time_offset = 0.0

        for idx, chunk_file in enumerate(chunks_to_process):
            chunk_size = chunk_file.stat().st_size
            if chunk_size > 25 * 1024 * 1024:
                raise ValueError(
                    f"Bloco de áudio {idx + 1} excede o limite de 25 MB do Groq Whisper ({chunk_size / (1024*1024):.1f} MB)."
                )

            print(f"[Transcriber] Enviando bloco {idx + 1}/{len(chunks_to_process)} para Groq Whisper ({chunk_size / 1024:.1f} KB)...")
            with open(chunk_file, "rb") as file_handle:
                transcription_resp = client.audio.transcriptions.create(
                    file=(chunk_file.name, file_handle.read()),
                    model=model,
                    language=target_lang,
                    response_format="verbose_json",
                    temperature=0.0
                )

            chunk_text = getattr(transcription_resp, "text", "") or ""
            if chunk_text.strip():
                all_texts.append(chunk_text.strip())

            if getattr(transcription_resp, "language", None):
                detected_language = getattr(transcription_resp, "language")

            raw_segments = getattr(transcription_resp, "segments", []) or []
            chunk_duration = float(getattr(transcription_resp, "duration", 0) or 0)

            # If ffmpeg is available, get exact duration of chunk if not returned by Groq
            if chunk_duration <= 0 and ffmpeg_exe:
                chunk_duration = get_media_duration_seconds(chunk_file, ffmpeg_exe)

            for s in raw_segments:
                start_val = getattr(s, "start", None)
                end_val = getattr(s, "end", None)
                text_val = getattr(s, "text", "")
                if isinstance(s, dict):
                    start_val = s.get("start", 0)
                    end_val = s.get("end", 0)
                    text_val = s.get("text", "")

                shifted_start = float(start_val or 0) + time_offset
                shifted_end = float(end_val or 0) + time_offset
                seg_text = str(text_val or "").strip()

                if seg_text:
                    all_segments.append({
                        "start": round(shifted_start, 2),
                        "end": round(shifted_end, 2),
                        "text": seg_text
                    })

            # Advance time offset for next chunk
            if chunk_duration > 0:
                time_offset += chunk_duration
            elif raw_segments:
                last_seg_end = float(getattr(raw_segments[-1], "end", 0) if hasattr(raw_segments[-1], "end") else raw_segments[-1].get("end", 0))
                time_offset += last_seg_end
            else:
                time_offset += CHUNK_DURATION_SECONDS

        # Total duration
        total_duration = time_offset
        if all_segments and all_segments[-1]["end"] > total_duration:
            total_duration = all_segments[-1]["end"]

        full_transcription_text = " ".join(all_texts).strip()

        return {
            "text": full_transcription_text,
            "segments": all_segments,
            "srt": segments_to_srt(all_segments),
            "vtt": segments_to_vtt(all_segments),
            "language": detected_language,
            "duration": round(total_duration, 1),
            "engine": "Peguei o Texto IA (Whisper Large v3)"
        }

    finally:
        # Secure cleanup of any intermediate optimized or chunked audio files
        for temp_file in temp_files_to_clean:
            try:
                if temp_file.exists():
                    temp_file.unlink()
            except Exception as clean_err:
                print(f"[Transcriber] Erro ao limpar arquivo temporário {temp_file}: {clean_err}")
