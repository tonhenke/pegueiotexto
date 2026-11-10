import os
import re
import uuid
import shutil
from typing import Optional, Dict, Any, List, Tuple
from pathlib import Path
from urllib.parse import quote
import yt_dlp
from app.config import TEMP_MEDIA_DIR

try:
    from yt_dlp.networking.impersonate import ImpersonateTarget
    HAS_IMPERSONATE = True
except Exception:
    HAS_IMPERSONATE = False

try:
    from curl_cffi import requests as cffi_requests
    HAS_CURL_CFFI = True
except Exception:
    HAS_CURL_CFFI = False


try:
    from youtube_transcript_api import YouTubeTranscriptApi
    HAS_YOUTUBE_TRANSCRIPT_API = True
except Exception:
    HAS_YOUTUBE_TRANSCRIPT_API = False


def has_ffmpeg() -> bool:
    return shutil.which("ffmpeg") is not None


def get_cookie_file_path() -> Optional[str]:
    """
    Checks for cookies in environment variable YOUTUBE_COOKIES or local cookies.txt.
    Safely normalizes line endings and unescapes literal \n if present.
    """
    env_cookies = os.environ.get("YOUTUBE_COOKIES", "").strip()
    if env_cookies:
        if "\\n" in env_cookies:
            env_cookies = env_cookies.replace("\\n", "\n")
        env_cookies = env_cookies.replace("\r\n", "\n").replace("\r", "\n")
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
        "format": "bestaudio/best[ext=mp4]/best",
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "extract_flat": False,
        "remote_components": ["ejs:github"],
        "http_headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        }
    }

    if shutil.which("node"):
        base_opts["js_runtimes"] = {"node": {}}

    if HAS_IMPERSONATE:
        try:
            base_opts["impersonate"] = ImpersonateTarget.from_str("chrome")
        except Exception:
            pass

    cookie_file = get_cookie_file_path()
    if cookie_file:
        base_opts["cookiefile"] = cookie_file

    if has_ffmpeg():
        base_opts["postprocessors"] = [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }]

    # Progressive extraction strategies across multiple player clients
    # visionos and combined clients cleanly bypass SABR blocks and datacenter bot checks
    strategies = [
        {"player_client": ["visionos", "android", "ios", "web"]},
        {"player_client": ["visionos"]},
        {"player_client": ["android"]},
        {"player_client": ["ios"]},
        None,
    ]

    info = None
    last_err = None
    for strat in strategies:
        try:
            curr_opts = {**base_opts}
            if strat:
                curr_opts["extractor_args"] = {"youtube": strat}
            with yt_dlp.YoutubeDL(curr_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                if info:
                    break
        except Exception as e:
            last_err = e
            continue

    if not info:
        raise RuntimeError(f"Não foi possível extrair informações do vídeo: {last_err or 'Erro desconhecido'}")

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


def parse_json3_captions(data: dict) -> Tuple[str, str, str, List[dict]]:
    """
    Parses YouTube json3 format (timedtext pb3/events) into clean text, SRT, VTT, and segments.
    """
    events = data.get("events", [])
    segments = []
    plain_words = []
    srt_lines = []
    vtt_lines = ["WEBVTT\n"]
    
    idx = 1
    last_text = ""
    for ev in events:
        segs = ev.get("segs")
        if not segs:
            continue
        text = "".join([s.get("utf8", "") for s in segs]).strip()
        text = re.sub(r"[\r\n]+", " ", text).strip()
        if not text or text == last_text:
            continue
        last_text = text
        
        start_ms = ev.get("tStartMs", 0)
        dur_ms = ev.get("dDurationMs", 0)
        end_ms = start_ms + dur_ms
        
        def format_ts(ms: int, sep: str = ",") -> str:
            total_sec = ms // 1000
            rem_ms = ms % 1000
            h = total_sec // 3600
            m = (total_sec % 3600) // 60
            s = total_sec % 60
            return f"{h:02d}:{m:02d}:{s:02d}{sep}{rem_ms:03d}"
            
        srt_start = format_ts(start_ms, ",")
        srt_end = format_ts(end_ms, ",")
        vtt_start = format_ts(start_ms, ".")
        vtt_end = format_ts(end_ms, ".")
        
        srt_lines.append(f"{idx}\n{srt_start} --> {srt_end}\n{text}\n")
        vtt_lines.append(f"{vtt_start} --> {vtt_end}\n{text}\n")
        idx += 1
        
        segments.append({
            "start": round(start_ms / 1000.0, 2),
            "end": round(end_ms / 1000.0, 2),
            "text": text
        })
        plain_words.append(text)
        
    plain_text = " ".join(plain_words)
    srt_content = "\n".join(srt_lines)
    vtt_content = "\n".join(vtt_lines)
    return plain_text, srt_content, vtt_content, segments


def parse_vtt_captions(vtt_text: str) -> Tuple[str, str, str, List[dict]]:
    """
    Parses WEBVTT subtitle text into clean text, SRT, VTT, and segments.
    """
    cue_pattern = re.compile(
        r"(\d{2}:\d{2}:\d{2}[\.,]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[\.,]\d{3})[^\r\n]*\r?\n(.*?)(?=\r?\n\r?\n|\Z)",
        re.DOTALL
    )
    cues = []
    plain_lines = []
    srt_blocks = []
    idx = 1
    last_text = ""
    for m in cue_pattern.finditer(vtt_text):
        start_raw, end_raw, text_raw = m.groups()
        clean_text = re.sub(r"<[^>]+>", "", text_raw).strip()
        if not clean_text:
            continue
        lines = [line.strip() for line in clean_text.splitlines() if line.strip()]
        line_joined = " ".join(lines)
        if line_joined == last_text:
            continue
        last_text = line_joined
        
        srt_start = start_raw.replace(".", ",")
        srt_end = end_raw.replace(".", ",")
        srt_blocks.append(f"{idx}\n{srt_start} --> {srt_end}\n{clean_text}\n")
        idx += 1
        
        def to_sec(ts: str) -> float:
            ts = ts.replace(",", ".")
            p = ts.split(":")
            return float(p[0]) * 3600 + float(p[1]) * 60 + float(p[2])
            
        cues.append({
            "start": round(to_sec(start_raw), 2),
            "end": round(to_sec(end_raw), 2),
            "text": clean_text
        })
        plain_lines.append(line_joined)
        
    full_text = " ".join(plain_lines)
    full_srt = "\n".join(srt_blocks)
    return full_text, full_srt, vtt_text, cues


def parse_srt_captions(srt_text: str) -> Tuple[str, str, str, List[dict]]:
    """
    Parses SubRip (.srt) subtitle text into clean text, SRT, VTT, and segments.
    """
    pattern = re.compile(
        r"(\d+)\r?\n(\d{2}:\d{2}:\d{2}[,\.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,\.]\d{3})\r?\n(.*?)(?=\r?\n\r?\n|\Z)",
        re.DOTALL
    )
    segments = []
    plain_lines = []
    vtt_blocks = ["WEBVTT\n"]
    def to_sec(ts: str) -> float:
        ts = ts.replace(",", ".")
        parts = ts.split(":")
        return float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])

    last_text = ""
    for m in pattern.finditer(srt_text):
        _, start_s, end_s, text = m.groups()
        clean = re.sub(r"<[^>]+>", "", text).strip()
        if not clean:
            continue
        clean_joined = " ".join([l.strip() for l in clean.splitlines() if l.strip()])
        if clean_joined == last_text:
            continue
        last_text = clean_joined
        vtt_start = start_s.replace(",", ".")
        vtt_end = end_s.replace(",", ".")
        vtt_blocks.append(f"{vtt_start} --> {vtt_end}\n{clean_joined}\n")
        segments.append({
            "start": round(to_sec(start_s), 2),
            "end": round(to_sec(end_s), 2),
            "text": clean_joined
        })
        plain_lines.append(clean_joined)
    return " ".join(plain_lines), srt_text, "\n".join(vtt_blocks), segments


def extract_youtube_video_id(url: str) -> Optional[str]:
    """
    Extracts the 11-character YouTube video ID from various URL formats.
    """
    url = (url or "").strip()
    patterns = [
        r"(?:v=|\/v\/|youtu\.be\/|embed\/)([0-9A-Za-z_-]{11})",
        r"shorts\/([0-9A-Za-z_-]{11})",
        r"live\/([0-9A-Za-z_-]{11})"
    ]
    for p in patterns:
        m = re.search(p, url)
        if m:
            return m.group(1)
    return None


def try_extract_youtube_captions(url: str, preferred_language: Optional[str] = None) -> Optional[dict]:
    """
    Directly extracts official YouTube transcripts/captions without downloading
    media streams, bypassing googlevideo.com antibot barriers completely.
    Uses YouTubeTranscriptApi + official oEmbed metadata, with fallback to yt-dlp timedtext.
    """
    video_id = extract_youtube_video_id(url)
    
    # Strategy 1: Ultra-fast direct YouTubeTranscriptApi (0.5s, 0% media bandwidth, 0 antibot block)
    if video_id and HAS_YOUTUBE_TRANSCRIPT_API:
        try:
            # 1. Fetch metadata via official oEmbed (zero auth, 100% reliable)
            title = "Vídeo do YouTube"
            uploader = "YouTube"
            try:
                import httpx
                oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
                with httpx.Client(timeout=6.0) as client:
                    resp = client.get(oembed_url)
                    if resp.status_code == 200:
                        o_data = resp.json()
                        title = o_data.get("title") or title
                        uploader = o_data.get("author_name") or uploader
            except Exception:
                pass

            # 2. Fetch transcript with smart language selection
            api = YouTubeTranscriptApi()
            lang_priority = []
            if preferred_language:
                lang_priority.append(preferred_language)
            lang_priority.extend(["pt", "pt-BR", "en", "en-US", "es"])

            transcript_data = None
            try:
                transcript_list = api.list(video_id)
                target_transcript = None
                
                # Check for direct language match
                for lang in lang_priority:
                    try:
                        target_transcript = transcript_list.find_transcript([lang])
                        break
                    except Exception:
                        continue

                # If no exact match, look for translatable transcript or any available
                if not target_transcript:
                    for t in transcript_list:
                        if t.is_translatable:
                            try:
                                target_transcript = t.translate(preferred_language or "pt")
                                break
                            except Exception:
                                continue
                        else:
                            target_transcript = t
                            break

                # If still no target transcript, fallback to the first raw transcript available
                if not target_transcript and transcript_list:
                    for t in transcript_list:
                        target_transcript = t
                        break

                if target_transcript:
                    transcript_data = target_transcript.fetch()
            except Exception:
                # Direct fetch fallback
                try:
                    transcript_data = api.fetch(video_id, languages=lang_priority)
                except Exception:
                    transcript_data = None

            snippets = getattr(transcript_data, "snippets", transcript_data)
            if snippets:
                plain_words = []
                segments = []
                srt_blocks = []
                vtt_blocks = ["WEBVTT\n"]

                def format_ts(sec: float, sep: str = ",") -> str:
                    ms = int(round((sec - int(sec)) * 1000))
                    total_sec = int(sec)
                    h = total_sec // 3600
                    m = (total_sec % 3600) // 60
                    s = total_sec % 60
                    return f"{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}"

                idx = 1
                duration = 0
                for item in snippets:
                    start_s = getattr(item, "start", None)
                    dur_s = getattr(item, "duration", None)
                    raw_text = getattr(item, "text", None)

                    if start_s is None and isinstance(item, dict):
                        start_s = item.get("start", 0)
                        dur_s = item.get("duration", 0)
                        raw_text = item.get("text", "")

                    start_s = float(start_s or 0)
                    dur_s = float(dur_s or 0)
                    end_s = start_s + dur_s
                    clean_text = re.sub(r"[\r\n]+", " ", str(raw_text or "")).strip()

                    if not clean_text:
                        continue

                    if end_s > duration:
                        duration = int(round(end_s))

                    plain_words.append(clean_text)
                    segments.append({
                        "start": round(start_s, 2),
                        "end": round(end_s, 2),
                        "text": clean_text
                    })

                    srt_start = format_ts(start_s, ",")
                    srt_end = format_ts(end_s, ",")
                    vtt_start = format_ts(start_s, ".")
                    vtt_end = format_ts(end_s, ".")

                    srt_blocks.append(f"{idx}\n{srt_start} --> {srt_end}\n{clean_text}\n")
                    vtt_blocks.append(f"{vtt_start} --> {vtt_end}\n{clean_text}\n")
                    idx += 1

                full_text = " ".join(plain_words).strip()
                if full_text:
                    return {
                        "title": title,
                        "duration": max(duration, 1),
                        "platform": "YouTube",
                        "uploader": uploader,
                        "text": full_text,
                        "srt": "\n".join(srt_blocks),
                        "vtt": "\n".join(vtt_blocks),
                        "segments": segments,
                        "engine": "YouTube Transcrição Nativa"
                    }
        except Exception as e:
            print(f"[YouTubeCaptions] Erro ao extrair via YouTubeTranscriptApi: {e}")

    # Strategy 2: Fallback to yt-dlp timedtext extractor
    opts = {
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "extract_flat": False,
        "remote_components": ["ejs:github"],
        "extractor_args": {"youtube": {"player_client": ["visionos", "android", "web"]}},
    }
    if shutil.which("node"):
        opts["js_runtimes"] = {"node": {}}
    if HAS_IMPERSONATE:
        try:
            opts["impersonate"] = ImpersonateTarget.from_str("chrome")
        except Exception:
            pass

    cookie_file = get_cookie_file_path()
    if cookie_file:
        opts["cookiefile"] = cookie_file

    info = None
    with yt_dlp.YoutubeDL(opts) as ydl:
        try:
            info = ydl.extract_info(url, download=False)
        except Exception:
            return None

    if not info:
        return None

    title = info.get("title") or "Vídeo do YouTube"
    duration = int(info.get("duration") or 0)
    uploader = info.get("uploader") or info.get("channel") or "YouTube"

    subtitles = info.get("subtitles") or {}
    auto_captions = info.get("automatic_captions") or {}

    lang_candidates = []
    if preferred_language:
        lang_candidates.append(preferred_language)
    lang_candidates.extend(["pt-BR", "pt", "pt-PT", "en", "en-US", "en-orig", "es", "es-419"])

    selected_formats = None
    for lang in lang_candidates:
        if lang in subtitles:
            selected_formats = subtitles[lang]
            break

    if not selected_formats:
        for lang in lang_candidates:
            if lang in auto_captions:
                selected_formats = auto_captions[lang]
                break

    if not selected_formats and subtitles:
        selected_formats = next(iter(subtitles.values()))
    if not selected_formats and auto_captions:
        selected_formats = next(iter(auto_captions.values()))

    if not selected_formats:
        return None

    fmt_map = {f.get("ext"): f.get("url") for f in selected_formats if f.get("url")}
    target_ext = "srt" if "srt" in fmt_map else ("vtt" if "vtt" in fmt_map else ("json3" if "json3" in fmt_map else None))
    target_url = fmt_map.get(target_ext) if target_ext else selected_formats[0].get("url")

    if not target_url:
        return None

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    }

    try:
        if HAS_CURL_CFFI:
            s = cffi_requests.Session(impersonate="chrome")
            resp = s.get(target_url, headers=headers, timeout=25)
        else:
            import httpx
            resp = httpx.get(target_url, headers=headers, timeout=25.0)
            
        if resp.status_code != 200:
            return None
        raw_content = resp.text
    except Exception:
        return None

    text, srt, vtt, segments = "", "", "", []
    if target_ext == "srt" or ("-->" in raw_content and not raw_content.startswith("WEBVTT") and not raw_content.strip().startswith("{")):
        text, srt, vtt, segments = parse_srt_captions(raw_content)
    elif target_ext == "vtt" or raw_content.startswith("WEBVTT"):
        text, srt, vtt, segments = parse_vtt_captions(raw_content)
    else:
        try:
            data = resp.json()
            if "events" in data:
                text, srt, vtt, segments = parse_json3_captions(data)
        except Exception:
            pass

    if not text.strip():
        return None

    return {
        "title": title,
        "duration": duration,
        "platform": "YouTube",
        "uploader": uploader,
        "text": text,
        "srt": srt,
        "vtt": vtt,
        "segments": segments,
        "engine": "YouTube Transcrição Nativa"
    }


def download_video_from_url(url: str, max_height: int = 720) -> dict:
    """
    Downloads and merges the best MP4 video (up to max_height, e.g. 720p) and audio track.
    Returns:
        {
            "video_path": Path,
            "title": str,
            "duration": int (seconds),
            "platform": str,
            "uploader": str
        }
    """
    url = normalize_video_url(url)
    file_id = str(uuid.uuid4())
    output_template = str(TEMP_MEDIA_DIR / f"video_{file_id}.%(ext)s")

    if has_ffmpeg():
        video_format = f"bestvideo[ext=mp4][height<={max_height}]+bestaudio[ext=m4a]/bestvideo[height<={max_height}]+bestaudio/best[height<={max_height}][ext=mp4]/best[ext=mp4]/best"
    else:
        video_format = f"best[height<={max_height}][ext=mp4]/best[ext=mp4]/best[height<={max_height}]/best"

    base_opts = {
        "outtmpl": output_template,
        "format": video_format,
        "merge_output_format": "mp4" if has_ffmpeg() else None,
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "extract_flat": False,
        "remote_components": ["ejs:github"],
        "http_headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        }
    }

    if shutil.which("node"):
        base_opts["js_runtimes"] = {"node": {}}

    if HAS_IMPERSONATE:
        try:
            base_opts["impersonate"] = ImpersonateTarget.from_str("chrome")
        except Exception:
            pass

    cookie_file = get_cookie_file_path()
    if cookie_file:
        base_opts["cookiefile"] = cookie_file

    strategies = [
        {"player_client": ["visionos", "android", "ios", "web"]},
        {"player_client": ["visionos"]},
        {"player_client": ["android"]},
        {"player_client": ["ios"]},
        None,
    ]

    info = None
    last_err = None
    for strat in strategies:
        try:
            curr_opts = {**base_opts}
            if strat:
                curr_opts["extractor_args"] = {"youtube": strat}
            with yt_dlp.YoutubeDL(curr_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                if info:
                    break
        except Exception as e:
            last_err = e
            continue

    if not info:
        raise RuntimeError(f"Não foi possível baixar o vídeo: {last_err or 'Erro desconhecido'}")

    title = info.get("title", "Vídeo da Web")
    duration = int(info.get("duration") or 0)
    uploader = info.get("uploader") or info.get("channel") or "Autor Desconhecido"
    extractor = info.get("extractor_key") or "Web"

    downloaded_files = list(TEMP_MEDIA_DIR.glob(f"video_{file_id}.*"))
    if not downloaded_files:
        raise RuntimeError("Arquivo de vídeo não encontrado após o download.")

    video_path = downloaded_files[0]
    return {
        "video_path": video_path,
        "title": title,
        "duration": duration,
        "platform": extractor,
        "uploader": uploader
    }


def extract_video_stream_info(url: str) -> dict:
    """
    Extracts stream metadata and direct or proxied stream links.
    Guarantees no broken HLS manifests and handles IP restrictions.
    """
    url = normalize_video_url(url)
    is_youtube = bool(re.search(r"youtube\.com|youtu\.be", url, re.I))

    base_opts = {
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "extract_flat": False,
        "remote_components": ["ejs:github"],
        "format": "all",
    }
    if shutil.which("node"):
        base_opts["js_runtimes"] = {"node": {}}
    if HAS_IMPERSONATE:
        try:
            base_opts["impersonate"] = ImpersonateTarget.from_str("chrome")
        except Exception:
            pass

    cookie_file = get_cookie_file_path()
    if cookie_file:
        base_opts["cookiefile"] = cookie_file

    info = None
    last_err = None
    strategies = [
        {"player_client": ["visionos", "android", "ios", "web"]},
        {"player_client": ["visionos"]},
        {"player_client": ["android"]},
        {"player_client": ["ios"]},
        None,
    ]

    for strat in strategies:
        try:
            curr_opts = {**base_opts}
            if strat:
                curr_opts["extractor_args"] = {"youtube": strat}
            with yt_dlp.YoutubeDL(curr_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                if info:
                    break
        except Exception as e:
            last_err = e
            continue

    if not info:
        raise RuntimeError(f"Não foi possível obter informações do vídeo: {last_err or 'Erro desconhecido'}")

    title = info.get("title", "Vídeo da Web")
    duration = int(info.get("duration") or 0)
    uploader = info.get("uploader") or info.get("channel") or "Autor Desconhecido"
    extractor = info.get("extractor_key") or ("YouTube" if is_youtube else "Web")
    thumbnail = info.get("thumbnail")

    formats = info.get("formats", [])
    direct_url = info.get("url")

    # If YouTube, googlevideo.com URLs are IP-bound to the server IP and will 403 on client browsers.
    # Therefore, we provide our rock-solid server streaming/download endpoint.
    if is_youtube or "youtube" in extractor.lower():
        video_proxy_url = f"/api/download/video?url={quote(url)}"
        audio_proxy_url = f"/api/download/mp3?url={quote(url)}"
        return {
            "title": title,
            "duration": duration,
            "uploader": uploader,
            "platform": "YouTube",
            "thumbnail": thumbnail,
            "video_url": video_proxy_url,
            "video_hd_url": video_proxy_url,
            "audio_url": audio_proxy_url,
            "formats": [
                {
                    "format_id": "mp4-hd",
                    "label": "MP4 HD (Download Rápido)",
                    "quality": "HD 720p",
                    "ext": "mp4",
                    "url": video_proxy_url
                },
                {
                    "format_id": "mp3-audio",
                    "label": "Áudio MP3 (Download)",
                    "quality": "192k",
                    "ext": "mp3",
                    "url": audio_proxy_url
                }
            ]
        }

    # For other platforms, exclude broken HLS manifests and filter valid MP4s
    valid_formats = [
        f for f in formats 
        if f.get("url") 
        and not f.get("protocol", "").startswith("m3u8")
        and f.get("protocol") != "http_dash_segments"
        and "manifest" not in f.get("url", "")
        and ".m3u8" not in f.get("url", "")
    ]

    progressive_mp4s = [
        f for f in valid_formats 
        if f.get("ext") == "mp4" and f.get("vcodec") != "none" and f.get("acodec") != "none"
    ]

    all_videos = [
        f for f in valid_formats 
        if f.get("vcodec") != "none"
    ]

    best_video_url = None
    if progressive_mp4s:
        progressive_mp4s.sort(key=lambda x: (x.get("height") or 0, x.get("tbr") or 0), reverse=True)
        best_video_url = progressive_mp4s[0].get("url")
    elif all_videos:
        all_videos.sort(key=lambda x: (x.get("height") or 0, x.get("tbr") or 0), reverse=True)
        best_video_url = all_videos[0].get("url")
    elif direct_url and "manifest" not in direct_url and ".m3u8" not in direct_url:
        best_video_url = direct_url
    else:
        best_video_url = f"/api/download/video?url={quote(url)}"

    # Best audio format
    all_audios = [
        f for f in valid_formats 
        if f.get("vcodec") == "none" and (f.get("acodec") != "none" or f.get("ext") in ("mp3", "m4a", "webm"))
    ]
    best_audio_url = None
    if all_audios:
        all_audios.sort(key=lambda x: (x.get("abr") or 0), reverse=True)
        best_audio_url = all_audios[0].get("url")
    else:
        best_audio_url = f"/api/download/mp3?url={quote(url)}"

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

    if not formatted_options:
        formatted_options.append({
            "format_id": "mp4-hd",
            "label": "MP4 HD",
            "quality": "HD",
            "ext": "mp4",
            "url": best_video_url
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
