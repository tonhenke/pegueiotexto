import uuid
from typing import Optional
from pathlib import Path
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Header
from pydantic import BaseModel
from backend.app.config import TEMP_MEDIA_DIR
from backend.app.services.downloader import download_audio_from_url
from backend.app.services.transcriber import transcribe_audio_file
from backend.app.services.cleaner import secure_delete_file
from backend.app.services.database import (
    verify_token_and_get_user,
    check_and_deduct_credits,
    save_transcription_record,
    get_user_transcription_history,
    get_user_profile
)

router = APIRouter(prefix="/api/transcribe", tags=["Transcription"])

class TranscribeUrlRequest(BaseModel):
    url: str
    language: str = "pt"

@router.post("/url")
async def transcribe_from_url(
    req: TranscribeUrlRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Transcribes video/audio from any URL, verifies user credits, deducts minutes,
    saves history, and immediately deletes the temporary audio file.
    """
    if not req.url or not req.url.startswith("http"):
        raise HTTPException(status_code=400, detail="URL inválida. Forneça uma URL completa iniciando com http:// ou https://")

    # 1. Identify user (if logged in)
    user = verify_token_and_get_user(authorization)

    downloaded_audio = None
    try:
        # 2. Extract media metadata and audio stream
        download_info = download_audio_from_url(req.url)
        downloaded_audio = download_info["audio_path"]
        duration_seconds = int(download_info.get("duration") or 60)

        credits_remaining = None
        minutes_deducted = 0

        # 3. Credit verification & deduction
        if user:
            credit_check = check_and_deduct_credits(user["id"], duration_seconds)
            if not credit_check["allowed"]:
                # Insufficient credits: delete audio immediately and reject
                raise HTTPException(status_code=402, detail=credit_check["error"])
            credits_remaining = credit_check["credits_remaining"]
            minutes_deducted = credit_check["minutes_deducted"]
        else:
            # Guest visitor on landing page (demo limit 120s)
            if duration_seconds > 180:
                raise HTTPException(
                    status_code=401,
                    detail="Este vídeo tem mais de 3 minutos. Crie sua conta grátis para receber 5 minutos de bônus e transcrever agora!"
                )

        # 4. Transcribe using Whisper
        transcription = transcribe_audio_file(
            audio_path=downloaded_audio,
            language=req.language
        )

        title = download_info.get("title") or "Vídeo da Internet"
        platform = download_info.get("platform") or "Web"
        text = transcription.get("text", "")
        srt = transcription.get("srt", "")
        vtt = transcription.get("vtt", "")

        # 5. Save record in database for logged-in user
        record_id = None
        if user:
            record_id = save_transcription_record(
                user_id=user["id"],
                title=title,
                platform=platform,
                duration_seconds=duration_seconds,
                minutes_deducted=minutes_deducted,
                text_content=text,
                srt_content=srt,
                vtt_content=vtt
            )

        return {
            "success": True,
            "id": record_id,
            "title": title,
            "platform": platform,
            "uploader": download_info.get("uploader"),
            "duration": duration_seconds,
            "minutes_deducted": minutes_deducted,
            "credits_remaining": credits_remaining,
            "text": text,
            "segments": transcription.get("segments"),
            "srt": srt,
            "vtt": vtt,
            "engine": transcription.get("engine"),
            "media_deleted": True,
            "privacy_notice": "O arquivo de mídia baixado foi permanentemente excluído dos nossos servidores."
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar vídeo: {str(e)}")
    finally:
        # CRITICAL PRIVACY: Delete media immediately
        if downloaded_audio:
            secure_delete_file(downloaded_audio)

@router.post("/upload")
async def transcribe_from_upload(
    file: UploadFile = File(...),
    language: str = Form("pt"),
    authorization: Optional[str] = Header(None)
):
    """
    Transcribes an uploaded video or audio file, deducts credits,
    saves record in history, and permanently deletes file immediately.
    """
    allowed_extensions = {".mp3", ".wav", ".m4a", ".mp4", ".mov", ".ogg", ".webm", ".flac", ".aac"}
    original_suffix = Path(file.filename or "media.mp3").suffix.lower()

    if original_suffix not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Extensão de arquivo não suportada: {original_suffix}. Formatos aceitos: {', '.join(allowed_extensions)}"
        )

    user = verify_token_and_get_user(authorization)

    temp_file_path = None
    try:
        file_id = str(uuid.uuid4())
        temp_file_path = TEMP_MEDIA_DIR / f"{file_id}{original_suffix}"

        # Write uploaded file
        with open(temp_file_path, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                buffer.write(chunk)

        # Transcribe with Whisper
        transcription = transcribe_audio_file(
            audio_path=temp_file_path,
            language=language
        )

        duration_seconds = int(transcription.get("duration") or 60)
        credits_remaining = None
        minutes_deducted = 0

        # Credit check & deduction
        if user:
            credit_check = check_and_deduct_credits(user["id"], duration_seconds)
            if not credit_check["allowed"]:
                raise HTTPException(status_code=402, detail=credit_check["error"])
            credits_remaining = credit_check["credits_remaining"]
            minutes_deducted = credit_check["minutes_deducted"]

        title = file.filename or "Arquivo de mídia"
        text = transcription.get("text", "")
        srt = transcription.get("srt", "")
        vtt = transcription.get("vtt", "")

        record_id = None
        if user:
            record_id = save_transcription_record(
                user_id=user["id"],
                title=title,
                platform="Upload",
                duration_seconds=duration_seconds,
                minutes_deducted=minutes_deducted,
                text_content=text,
                srt_content=srt,
                vtt_content=vtt
            )

        return {
            "success": True,
            "id": record_id,
            "title": title,
            "duration": duration_seconds,
            "minutes_deducted": minutes_deducted,
            "credits_remaining": credits_remaining,
            "text": text,
            "segments": transcription.get("segments"),
            "srt": srt,
            "vtt": vtt,
            "engine": transcription.get("engine"),
            "media_deleted": True,
            "privacy_notice": "O arquivo de mídia enviado foi permanentemente excluído dos nossos servidores."
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao transcrever arquivo: {str(e)}")
    finally:
        if temp_file_path:
            secure_delete_file(temp_file_path)

@router.get("/history")
def get_history(authorization: Optional[str] = Header(None)):
    """Fetches user transcription history from Supabase."""
    user = verify_token_and_get_user(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Usuário não autenticado.")
    history = get_user_transcription_history(user["id"])
    return {"history": history}

@router.get("/health")
def transcription_health():
    from backend.app.config import GROQ_API_KEY
    from backend.app.services.downloader import has_ffmpeg
    return {
        "status": "ready",
        "has_ffmpeg": has_ffmpeg(),
        "groq_configured": bool(GROQ_API_KEY and GROQ_API_KEY != "sua_chave_groq_aqui"),
        "supported_platforms": "YouTube, TikTok, Instagram, Vimeo, X/Twitter, Facebook, e mais de 1.700 sites"
    }
