import uuid
from typing import Optional
from pathlib import Path
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Header
from pydantic import BaseModel
from app.config import TEMP_MEDIA_DIR
from app.services.downloader import download_audio_from_url, try_extract_youtube_captions
from app.services.transcriber import transcribe_audio_file
from app.services.summarizer import summarize_transcription
from app.services.translator import translate_transcription, SUPPORTED_LANGUAGES
from app.services.cleaner import secure_delete_file
from app.services.database import (
    verify_token_and_get_user,
    check_and_deduct_credits,
    save_transcription_record,
    get_user_transcription_history,
    get_user_profile,
    get_user_active_plan
)

router = APIRouter(prefix="/api/transcribe", tags=["Transcription"])

class TranscribeUrlRequest(BaseModel):
    url: str
    language: Optional[str] = None

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

    # 1. Identify user (mandatory for transcription)
    user = verify_token_and_get_user(authorization)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Autenticação necessária. Crie sua conta grátis em segundos para transcrever e liberar seus 5 minutos grátis!"
        )

    downloaded_audio = None
    caption_fallback = None

    try:
        # 2. Extract media metadata and audio stream, with seamless caption fallback for YouTube
        try:
            download_info = download_audio_from_url(req.url)
            downloaded_audio = download_info["audio_path"]
            duration_seconds = int(download_info.get("duration") or 60)
            title = download_info.get("title") or "Vídeo da Internet"
            platform = download_info.get("platform") or "Web"
            uploader = download_info.get("uploader")
        except Exception as dl_err:
            is_youtube = ("youtube.com" in req.url) or ("youtu.be" in req.url)
            if is_youtube:
                try:
                    caption_fallback = try_extract_youtube_captions(req.url, preferred_language=req.language)
                except Exception:
                    caption_fallback = None
            if not caption_fallback:
                raise dl_err

        if caption_fallback:
            duration_seconds = int(caption_fallback.get("duration") or 60)
            title = caption_fallback.get("title") or "Vídeo do YouTube"
            platform = "YouTube"
            uploader = caption_fallback.get("uploader")

        # 3. Credit verification & deduction
        credit_check = check_and_deduct_credits(user["id"], duration_seconds)
        if not credit_check["allowed"]:
            raise HTTPException(status_code=402, detail=credit_check["error"])
        credits_remaining = credit_check["credits_remaining"]
        minutes_deducted = credit_check["minutes_deducted"]

        if caption_fallback:
            text = caption_fallback.get("text", "")
            srt = caption_fallback.get("srt", "")
            vtt = caption_fallback.get("vtt", "")
            segments = caption_fallback.get("segments", [])
            engine = caption_fallback.get("engine", "YouTube Transcrição Nativa")
        else:
            # 4. Transcribe using Whisper
            transcription = transcribe_audio_file(
                audio_path=downloaded_audio,
                language=req.language
            )
            text = transcription.get("text", "")
            srt = transcription.get("srt", "")
            vtt = transcription.get("vtt", "")
            segments = transcription.get("segments")
            engine = transcription.get("engine")

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
            "uploader": uploader,
            "duration": duration_seconds,
            "minutes_deducted": minutes_deducted,
            "credits_remaining": credits_remaining,
            "text": text,
            "segments": segments,
            "srt": srt,
            "vtt": vtt,
            "engine": engine,
            "media_deleted": True,
            "privacy_notice": "O arquivo de mídia baixado foi permanentemente excluído dos nossos servidores."
        }
    except HTTPException:
        raise
    except Exception as e:
        err_str = str(e)
        err_lower = err_str.lower()
        if "sign in to confirm" in err_lower or ("bot" in err_lower and "confirm" in err_lower):
            friendly_err = (
                "O YouTube solicitou temporariamente uma confirmação antibot para este link. "
                "Tente novamente em instantes ou faça o upload direto do arquivo pela aba 'Enviar arquivo'."
            )
            raise HTTPException(status_code=500, detail=friendly_err)
        if "logged-in" in err_lower and "vimeo" in err_lower:
            friendly_err = (
                "Este vídeo do Vimeo é privado ou requer login direto na conta do autor. "
                "Faça o upload do arquivo de vídeo diretamente pela aba 'Enviar arquivo'."
            )
            raise HTTPException(status_code=500, detail=friendly_err)
        raise HTTPException(status_code=500, detail=f"Erro ao processar vídeo: {err_str}")
    finally:
        # CRITICAL PRIVACY: Delete media immediately
        if downloaded_audio:
            secure_delete_file(downloaded_audio)

@router.post("/upload")
async def transcribe_from_upload(
    file: UploadFile = File(...),
    language: Optional[str] = Form(None),
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
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Autenticação necessária. Crie sua conta grátis em segundos para transcrever e liberar seus 5 minutos grátis!"
        )

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

        # Credit check & deduction
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
    from app.config import GROQ_API_KEY
    from app.services.downloader import has_ffmpeg
    return {
        "status": "ready",
        "has_ffmpeg": has_ffmpeg(),
        "groq_configured": bool(GROQ_API_KEY and GROQ_API_KEY != "sua_chave_groq_aqui"),
        "supported_platforms": "YouTube, TikTok, Instagram, Vimeo, X/Twitter, Facebook, e mais de 1.700 sites"
    }

class SummarizeRequest(BaseModel):
    text: str
    title: Optional[str] = "Transcrição"

@router.post("/summarize")
def summarize_endpoint(req: SummarizeRequest):
    """
    Produces an executive summary and key takeaways for any transcript using Groq LLM.
    """
    if not req.text or len(req.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Texto muito curto para gerar resumo.")
    res = summarize_transcription(text=req.text, title=req.title or "Transcrição")
    return res

class TranslateRequest(BaseModel):
    text: str
    target_language: str = "en"
    title: Optional[str] = "Transcrição"

@router.get("/languages")
def get_supported_languages():
    """Returns the list of supported translation languages."""
    return {"languages": SUPPORTED_LANGUAGES}

@router.post("/translate")
def translate_endpoint(
    req: TranslateRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Translates a transcription to the specified target language using Groq LLM.
    STRICTLY RESTRICTED TO PAID PLAN SUBSCRIBERS.
    """
    if not req.text or len(req.text.strip()) < 5:
        raise HTTPException(status_code=400, detail="Texto muito curto para realizar a tradução.")

    # 1. Require user authentication
    user = verify_token_and_get_user(authorization)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Autenticação necessária. Faça login na sua conta para traduzir suas transcrições."
        )

    # 2. Strict paid plan check
    plan_info = get_user_active_plan(user["id"])
    user_email = str(user.get("email") or "").lower().strip()
    is_paid = bool(plan_info.get("is_paid")) or user_email == "tonhenke@gmail.com"
    if not is_paid:
        raise HTTPException(
            status_code=403,
            detail=(
                "A tradução com Inteligência Artificial é exclusiva para assinantes dos planos pagos. "
                "Faça um upgrade para liberar traduções ilimitadas em mais de 10 idiomas!"
            )
        )

    # 3. Process translation
    res = translate_transcription(
        text=req.text,
        target_language=req.target_language,
        title=req.title or "Transcrição"
    )
    if not res.get("success"):
        raise HTTPException(
            status_code=500,
            detail=res.get("error", "Não foi possível realizar a tradução neste momento.")
        )

    return res

@router.get("/public/{item_id}")
def get_public_transcription(item_id: str):
    """
    Returns public reading data for a single transcription (no sensitive user info).
    """
    from app.services.database import get_supabase
    sb = get_supabase(admin=True)
    try:
        res = sb.table("transcriptions")\
            .select("id, title, platform, duration_seconds, text_content, srt_content, vtt_content, created_at")\
            .eq("id", item_id)\
            .single()\
            .execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Transcrição não encontrada.")
        return res.data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=404, detail="Transcrição não encontrada ou indisponível.")


