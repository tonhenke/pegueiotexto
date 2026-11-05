from fastapi import APIRouter, HTTPException, BackgroundTasks, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel
import re
from urllib.parse import quote
from pathlib import Path
from app.services.downloader import extract_video_stream_info, download_audio_from_url, download_video_from_url
from app.services.cleaner import secure_delete_file

router = APIRouter(prefix="/api/download", tags=["Downloader"])

class DownloadInfoRequest(BaseModel):
    url: str

@router.post("/info")
def get_video_stream_info(req: DownloadInfoRequest):
    url = (req.url or "").strip()
    if not url:
        raise HTTPException(status_code=400, detail="A URL do vídeo é obrigatória.")

    try:
        data = extract_video_stream_info(url)
        return {
            "status": "success",
            "data": data
        }
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Não foi possível extrair o vídeo fornecido: {str(e)}"
        )

@router.get("/mp3")
def download_audio_mp3(url: str = Query(..., description="URL do vídeo"), background_tasks: BackgroundTasks = None):
    url = (url or "").strip()
    if not url:
        raise HTTPException(status_code=400, detail="A URL do vídeo é obrigatória.")

    try:
        info = download_audio_from_url(url)
        audio_path = Path(info["audio_path"])
        if not audio_path.exists():
            raise HTTPException(status_code=500, detail="Arquivo de áudio não encontrado.")

        raw_title = info.get("title") or "audio"
        safe_title = re.sub(r'[\\/*?:"<>|#%&{}\\<>*?/$!\'":@]', "", raw_title).strip()[:70] or "audio"
        ext = audio_path.suffix.lstrip(".") or "mp3"
        filename = f"{safe_title}.{ext}"

        media_type = "audio/mpeg" if ext == "mp3" else f"audio/{ext}"

        if background_tasks:
            background_tasks.add_task(secure_delete_file, audio_path)

        return FileResponse(
            path=str(audio_path),
            media_type=media_type,
            filename=filename,
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Cache-Control": "no-cache",
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Não foi possível extrair o áudio deste vídeo: {str(e)}"
        )

@router.get("/video")
def download_video_mp4(
    url: str = Query(..., description="URL do vídeo"),
    quality: str = Query("720", description="Qualidade do vídeo (ex: 720, 1080)"),
    download: bool = Query(False, description="Forçar download como anexo"),
    background_tasks: BackgroundTasks = None
):
    url = (url or "").strip()
    if not url:
        raise HTTPException(status_code=400, detail="A URL do vídeo é obrigatória.")

    max_height = 720
    if quality and quality.isdigit():
        max_height = min(int(quality), 1080)

    try:
        info = download_video_from_url(url, max_height=max_height)
        video_path = Path(info["video_path"])
        if not video_path.exists():
            raise HTTPException(status_code=500, detail="Arquivo de vídeo não encontrado.")

        raw_title = info.get("title") or "video"
        safe_title = re.sub(r'[\\/*?:"<>|#%&{}\\<>*?/$!\'":@]', "", raw_title).strip()[:70] or "video"
        ext = video_path.suffix.lstrip(".") or "mp4"
        filename = f"{safe_title}.{ext}"

        media_type = f"video/{ext}" if ext in ("mp4", "webm") else "video/mp4"

        if background_tasks:
            background_tasks.add_task(secure_delete_file, video_path)

        disposition = "attachment" if download else "inline"

        return FileResponse(
            path=str(video_path),
            media_type=media_type,
            filename=filename,
            headers={
                "Content-Disposition": f'{disposition}; filename="{filename}"; filename*=UTF-8\'\'{quote(filename)}',
                "Cache-Control": "no-cache",
                "Accept-Ranges": "bytes",
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Não foi possível processar o vídeo fornecido: {str(e)}"
        )
