import uuid
import shutil
from pathlib import Path
import yt_dlp
from app.config import TEMP_MEDIA_DIR

def has_ffmpeg() -> bool:
    return shutil.which("ffmpeg") is not None

def download_audio_from_url(url: str) -> dict:
    """
    Downloads the audio track of any video URL supported by yt-dlp.
    Returns:
        {
            "audio_path": Path,
            "title": str,
            "duration": int (seconds),
            "platform": str,
            "uploader": str
        }
    """
    file_id = str(uuid.uuid4())
    output_template = str(TEMP_MEDIA_DIR / f"{file_id}.%(ext)s")

    ydl_opts = {
        "outtmpl": output_template,
        "format": "bestaudio[ext=m4a]/bestaudio[ext=mp3]/bestaudio/best",
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "extract_flat": False,
    }

    if has_ffmpeg():
        ydl_opts["postprocessors"] = [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "128",
        }]

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        title = info.get("title", "Áudio da Internet")
        duration = int(info.get("duration") or 0)
        uploader = info.get("uploader", "Desconhecido")
        extractor = info.get("extractor_key", "Web")

    # Locate the downloaded file
    matching_files = list(TEMP_MEDIA_DIR.glob(f"{file_id}.*"))
    if not matching_files:
        raise RuntimeError("Falha ao localizar o arquivo de áudio baixado.")

    downloaded_path = matching_files[0]

    return {
        "audio_path": downloaded_path,
        "title": title,
        "duration": duration,
        "platform": extractor,
        "uploader": uploader,
    }
