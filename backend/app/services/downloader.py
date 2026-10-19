import os
import uuid
import shutil
from typing import Optional
from pathlib import Path
import yt_dlp
from app.config import TEMP_MEDIA_DIR

def has_ffmpeg() -> bool:
    return shutil.which("ffmpeg") is not None

def get_cookie_file_path() -> Optional[str]:
    """
    Checks for cookies in environment variable YOUTUBE_COOKIES or local cookies.txt.
    """
    env_cookies = os.environ.get("YOUTUBE_COOKIES", "").strip()
    if env_cookies:
        cookie_path = TEMP_MEDIA_DIR / "youtube_cookies.txt"
        cookie_path.write_text(env_cookies, encoding="utf-8")
        return str(cookie_path)
    
    local_cookies = Path(__file__).resolve().parent.parent.parent / "cookies.txt"
    if local_cookies.exists():
        return str(local_cookies)
        
    return None

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
        "extractor_args": {
            "youtube": {
                "player_client": ["android", "ios", "mweb"]
            }
        },
        "http_headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        }
    }

    cookie_file = get_cookie_file_path()
    if cookie_file:
        ydl_opts["cookiefile"] = cookie_file

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
