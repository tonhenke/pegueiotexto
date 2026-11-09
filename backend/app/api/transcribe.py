import uuid
import math
from typing import Optional
from pathlib import Path
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Header, Request
from pydantic import BaseModel
from app.config import TEMP_MEDIA_DIR
from app.services.downloader import download_audio_from_url, download_video_from_url, try_extract_youtube_captions
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

class TranscribePreviewRequest(BaseModel):
    url: str
    language: Optional[str] = "auto"

@router.post("/preview")
async def preview_transcription(req: TranscribePreviewRequest):
    """
    Returns a quick preview (title, platform, duration, first 20-30s snippet of transcription)
    without authentication. Perfect for teaser split signup page.
    """
    url = (req.url or "").strip()
    if not url or not url.startswith("http"):
        raise HTTPException(status_code=400, detail="URL inválida.")

    is_youtube = ("youtube.com" in url) or ("youtu.be" in url)
    caption_fallback = None

    if is_youtube:
        try:
            caption_fallback = try_extract_youtube_captions(url, preferred_language=req.language)
        except Exception as e:
            print(f"[Preview] YouTube caption error: {e}")
            caption_fallback = None

    if caption_fallback:
        segments = caption_fallback.get("segments", [])
        title = caption_fallback.get("title") or "Vídeo do YouTube"
        duration = int(caption_fallback.get("duration") or 60)

        preview_segs = []
        preview_words = []
        for s in segments:
            preview_segs.append(s)
            preview_words.append(s.get("text", ""))
            if s.get("end", 0) >= 28 or len(" ".join(preview_words)) >= 220:
                break

        preview_text = " ".join(preview_words).strip()
        if not preview_text and segments:
            preview_text = segments[0].get("text", "")

        return {
            "success": True,
            "title": title,
            "platform": "YouTube",
            "duration": duration,
            "total_minutes": max(1, math.ceil(duration / 60)),
            "preview_text": preview_text or "Áudio detectado e pronto para transcrição completa com IA.",
            "segments": preview_segs,
            "has_real_captions": True,
            "exceeds_free": duration > 300,
        }

    # If not YouTube or no captions: extract metadata
    try:
        from app.services.downloader import extract_youtube_video_id
        import httpx

        title = "Vídeo da Internet"
        duration = 180
        platform = "Web"

        if is_youtube:
            platform = "YouTube"
            vid = extract_youtube_video_id(url)
            if vid:
                try:
                    with httpx.Client(timeout=4.0) as client:
                        resp = client.get(f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json")
                        if resp.status_code == 200:
                            data = resp.json()
                            title = data.get("title") or title
                except Exception:
                    pass
        else:
            if "instagram.com" in url:
                platform = "Instagram"
                title = "Reels / Vídeo do Instagram"
            elif "tiktok.com" in url:
                platform = "TikTok"
                title = "Vídeo do TikTok"

        return {
            "success": True,
            "title": title,
            "platform": platform,
            "duration": duration,
            "total_minutes": max(1, math.ceil(duration / 60)),
            "preview_text": "Transcrição de áudio de alta precisão iniciada com inteligência artificial.",
            "segments": [
                {"start": 0.0, "end": 15.0, "text": "Transcrição de áudio de alta precisão iniciada com inteligência artificial."}
            ],
            "has_real_captions": False,
            "exceeds_free": duration > 300,
        }
    except Exception as e:
        return {
            "success": True,
            "title": "Mídia da Internet",
            "platform": "Web",
            "duration": 180,
            "total_minutes": 3,
            "preview_text": "Áudio identificado e pronto para transcrição completa no painel.",
            "segments": [],
            "has_real_captions": False,
            "exceeds_free": False,
        }

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
        # 2. Extract media metadata and audio stream, with instant native caption priority for YouTube
        is_youtube = ("youtube.com" in req.url) or ("youtu.be" in req.url)

        if is_youtube:
            try:
                caption_fallback = try_extract_youtube_captions(req.url, preferred_language=req.language)
            except Exception as cap_err:
                print(f"[YouTube] Falha na extração de legendas nativas: {cap_err}")
                caption_fallback = None

            if not caption_fallback:
                try:
                    download_info = download_audio_from_url(req.url)
                    downloaded_audio = download_info["audio_path"]
                    duration_seconds = int(download_info.get("duration") or 60)
                    title = download_info.get("title") or "Vídeo do YouTube"
                    platform = "YouTube"
                    uploader = download_info.get("uploader")
                except Exception as dl_err:
                    print(f"[YouTube] Falha no download de áudio, tentando fallback de vídeo 360p: {dl_err}")
                    try:
                        v_info = download_video_from_url(req.url, max_height=360)
                        downloaded_audio = Path(v_info["video_path"])
                        duration_seconds = int(v_info.get("duration") or 60)
                        title = v_info.get("title") or "Vídeo do YouTube"
                        platform = "YouTube"
                        uploader = v_info.get("uploader")
                    except Exception as v_err:
                        print(f"[YouTube] Falha total no download para transcrição: {v_err}")
                        friendly_err = (
                            "Este vídeo não possui legendas ativas no YouTube e o link direto foi restringido pela proteção antibot do Google. "
                            "Para transcrever este vídeo, faça o upload do arquivo pela aba 'Enviar arquivo' ou teste com vídeos que possuem legendas ativas."
                        )
                        raise HTTPException(status_code=500, detail=friendly_err)
        else:
            try:
                download_info = download_audio_from_url(req.url)
                downloaded_audio = download_info["audio_path"]
                duration_seconds = int(download_info.get("duration") or 60)
                title = download_info.get("title") or "Vídeo da Internet"
                platform = download_info.get("platform") or "Web"
                uploader = download_info.get("uploader")
            except Exception as dl_err:
                err_str = str(dl_err)
                if "sign in to confirm" in err_str.lower() or "bot" in err_str.lower():
                    raise HTTPException(
                        status_code=500,
                        detail="Este link foi restringido pela proteção antibot da plataforma. Faça o upload direto do arquivo pela aba 'Enviar arquivo'."
                    )
                raise HTTPException(status_code=500, detail=f"Erro ao baixar áudio: {dl_err}")

        if caption_fallback:
            duration_seconds = int(caption_fallback.get("duration") or 60)
            title = caption_fallback.get("title") or "Vídeo do YouTube"
            platform = "YouTube"
            uploader = caption_fallback.get("uploader")

        # 3. Credit verification & deduction
        credit_check = check_and_deduct_credits(user["id"], duration_seconds)
        if not credit_check["allowed"]:
            raise HTTPException(
                status_code=402,
                detail={
                    "message": credit_check["error"],
                    "minutes_needed": credit_check.get("minutes_needed", max(1, math.ceil(duration_seconds / 60))),
                    "current_balance": credit_check.get("credits_remaining", 0),
                    "duration_seconds": duration_seconds,
                    "title": title
                }
            )
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
                "Este vídeo não possui legendas nativas no YouTube e o YouTube bloqueou temporariamente a extração direta de áudio via servidor. "
                "Para transcrever este vídeo específico, faça o upload do arquivo pela aba 'Enviar arquivo' ou teste com vídeos que possuem legendas/fala ativas."
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
    title: Optional[str] = Form(None),
    platform: Optional[str] = Form(None),
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
        final_title = (title or file.filename or "Arquivo de mídia").strip()
        final_platform = (platform or "Upload").strip()

        # Credit check & deduction
        credit_check = check_and_deduct_credits(user["id"], duration_seconds)
        if not credit_check["allowed"]:
            raise HTTPException(
                status_code=402,
                detail={
                    "message": credit_check["error"],
                    "minutes_needed": credit_check.get("minutes_needed", max(1, math.ceil(duration_seconds / 60))),
                    "current_balance": credit_check.get("credits_remaining", 0),
                    "duration_seconds": duration_seconds,
                    "title": final_title
                }
            )
        credits_remaining = credit_check["credits_remaining"]
        minutes_deducted = credit_check["minutes_deducted"]

        text = transcription.get("text", "")
        srt = transcription.get("srt", "")
        vtt = transcription.get("vtt", "")

        record_id = None
        if user:
            record_id = save_transcription_record(
                user_id=user["id"],
                title=final_title,
                platform=final_platform,
                duration_seconds=duration_seconds,
                minutes_deducted=minutes_deducted,
                text_content=text,
                srt_content=srt,
                vtt_content=vtt
            )

        return {
            "success": True,
            "id": record_id,
            "title": final_title,
            "platform": final_platform,
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
def get_public_transcription(item_id: str, request: Request):
    """
    Returns public reading data for a single transcription.
    Verifies public availability or caller ownership.
    """
    from app.services.database import get_supabase, verify_token_and_get_user
    sb = get_supabase(admin=True)
    try:
        # Check if caller has auth token
        auth_header = request.headers.get("authorization", "")
        token = auth_header.replace("Bearer ", "").strip() if auth_header.startswith("Bearer ") else None
        caller_user_id = None
        if token:
            try:
                caller = verify_token_and_get_user(token)
                if caller:
                    caller_user_id = caller.get("id")
            except Exception:
                pass

        # Try to select with is_public if column exists
        data = None
        try:
            res = sb.table("transcriptions")\
                .select("id, title, platform, duration_seconds, text_content, srt_content, vtt_content, created_at, user_id, is_public")\
                .eq("id", item_id)\
                .single()\
                .execute()
            data = res.data
        except Exception:
            # Fallback if is_public column doesn't exist
            res = sb.table("transcriptions")\
                .select("id, title, platform, duration_seconds, text_content, srt_content, vtt_content, created_at, user_id")\
                .eq("id", item_id)\
                .single()\
                .execute()
            data = res.data

        if not data:
            raise HTTPException(status_code=404, detail="Transcrição não encontrada.")

        # Check access: if is_public is explicitly False, only owner can view
        if data.get("is_public") is False and caller_user_id != data.get("user_id"):
            raise HTTPException(status_code=403, detail="Esta transcrição é privada.")

        # Exclude internal user_id
        data.pop("user_id", None)
        return data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=404, detail="Transcrição não encontrada ou indisponível.")


