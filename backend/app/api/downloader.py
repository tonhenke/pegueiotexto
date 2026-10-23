from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from app.services.downloader import extract_video_stream_info

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
