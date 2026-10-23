import os
import re
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

def normalize_video_url(url: str) -> str:
    """
    Normalizes video URLs to ensure maximum extraction compatibility:
    - Vimeo: converts public web URLs (vimeo.com/<id>) to public player embeds
      (player.vimeo.com/video/<id>) to bypass login requirements.
    """
    url = (url or "").strip()
    vimeo_match = re.search(
        r"vimeo\.com/(?:channels/(?:\w+/)?|groups/[^/]+/videos/|album/(?:\d+/)?video/|video/|)(\d+)(?:/([a-zA-Z0-9]+))?",
        url
    )
    if vimeo_match and "player.vimeo.com" not in url:
        video_id = vimeo_match.group(1)
        h_hash = vimeo_match.group(2)
        if h_hash:
            return f"https://player.vimeo.com/video/{video_id}?h={h_hash}"
        return f"https://player.vimeo.com/video/{video_id}"

    return url

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
    url = normalize_video_url(url)
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


def extract_video_stream_info(url: str) -> dict:
    """
    Extracts direct CDN stream links and metadata with download=False.
    Consumes ZERO disk space and ZERO media bandwidth on our server.
    """
    url = normalize_video_url(url)
    base_opts = {
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "extract_flat": False,
    }
    cookie_file = get_cookie_file_path()
    if cookie_file:
        base_opts["cookiefile"] = cookie_file

    opts_android = {
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
        with yt_dlp.YoutubeDL(opts_android) as ydl:
            info = ydl.extract_info(url, download=False)
    except Exception as e1:
        print(f"[StreamExtractor] Android client extraction failed: {e1}. Trying android + ios fallback...")
        try:
            opts_fallback = {
                **base_opts,
                "extractor_args": {
                    "youtube": {
                        "player_client": ["android", "ios"],
                        "player_skip": ["webpage", "configs", "js"]
                    }
                }
            }
            with yt_dlp.YoutubeDL(opts_fallback) as ydl:
                info = ydl.extract_info(url, download=False)
        except Exception as e2:
            raise RuntimeError(f"Não foi possível obter links diretos do vídeo: {e2}")

    if not info:
        raise RuntimeError("Não foi possível extrair informações do vídeo.")

    title = info.get("title", "Vídeo da Web")
    duration = int(info.get("duration") or 0)
    uploader = info.get("uploader") or info.get("channel") or "Autor Desconhecido"
    extractor = info.get("extractor_key") or "Web"
    thumbnail = info.get("thumbnail")

    formats = info.get("formats", [])

    # Filter progressive mp4 (contains both video and audio)
    progressive_mp4s = [
        f for f in formats 
        if f.get("url") and f.get("ext") == "mp4" and f.get("vcodec") != "none" and f.get("acodec") != "none"
    ]

    # Or best video format if progressive isn't available
    all_videos = [
        f for f in formats 
        if f.get("url") and f.get("vcodec") != "none"
    ]

    # Best audio format
    all_audios = [
        f for f in formats 
        if f.get("url") and f.get("vcodec") == "none" and (f.get("acodec") != "none" or f.get("ext") in ("mp3", "m4a", "webm"))
    ]

    best_video_url = None
    if progressive_mp4s:
        progressive_mp4s.sort(key=lambda x: (x.get("height") or 0, x.get("tbr") or 0), reverse=True)
        best_video_url = progressive_mp4s[0].get("url")
    elif all_videos:
        all_videos.sort(key=lambda x: (x.get("height") or 0, x.get("tbr") or 0), reverse=True)
        best_video_url = all_videos[0].get("url")

    best_audio_url = None
    if all_audios:
        all_audios.sort(key=lambda x: (x.get("abr") or 0), reverse=True)
        best_audio_url = all_audios[0].get("url")
    elif best_video_url:
        best_audio_url = best_video_url

    # Format options for the frontend selector
    formatted_options = []
    seen_heights = set()
    for f in (progressive_mp4s or all_videos):
        h = f.get("height")
        if h and h not in seen_heights and f.get("url"):
            seen_heights.add(h)
            formatted_options.append({
                "format_id": str(f.get("format_id")),
                "label": f"MP4 {h}p",
                "quality": f"{h}p",
                "ext": f.get("ext", "mp4"),
                "url": f.get("url")
            })

    return {
        "title": title,
        "duration": duration,
        "uploader": uploader,
        "platform": extractor,
        "thumbnail": thumbnail,
        "video_url": best_video_url,
        "audio_url": best_audio_url,
        "formats": formatted_options[:4]
    }

