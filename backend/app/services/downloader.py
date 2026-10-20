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

    base_opts = {
        "outtmpl": output_template,
        "format": "bestaudio[ext=m4a]/bestaudio[ext=mp3]/bestaudio/best",
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "extract_flat": False,
    }

    cookie_file = get_cookie_file_path()
    if cookie_file:
        base_opts["cookiefile"] = cookie_file

    if has_ffmpeg():
        base_opts["postprocessors"] = [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "128",
        }]

    # Strategy 1 (Primary): Direct Mobile InnerTube API (android)
    # player_skip skips downloading the browser HTML page, bypassing datacenter IP bot detection
    opts_mobile_android = {
        **base_opts,
        "extractor_args": {
            "youtube": {
                "player_client": ["android"],
                "player_skip": ["webpage", "configs", "js"]
            }
        }
    }

    info = None
    try:
        with yt_dlp.YoutubeDL(opts_mobile_android) as ydl:
            info = ydl.extract_info(url, download=True)
    except Exception as e1:
        print(f"[Downloader] Estratégia android direta falhou: {e1}. Tentando android + ios...")
        try:
            opts_mobile_combo = {
                **base_opts,
                "extractor_args": {
                    "youtube": {
                        "player_client": ["android", "ios"],
                        "player_skip": ["webpage", "configs", "js"]
                    }
                }
            }
            with yt_dlp.YoutubeDL(opts_mobile_combo) as ydl:
                info = ydl.extract_info(url, download=True)
        except Exception as e2:
            print(f"[Downloader] Estratégia combo falhou: {e2}. Tentando fallback genérico...")
            with yt_dlp.YoutubeDL(base_opts) as ydl:
                info = ydl.extract_info(url, download=True)

    if not info:
        raise RuntimeError("Não foi possível extrair informações do vídeo.")

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
