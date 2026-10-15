import os
import time
from pathlib import Path
from app.config import TEMP_MEDIA_DIR

def secure_delete_file(file_path: str | Path | None) -> bool:
    """
    Deletes the temporary media file immediately to ensure user privacy.
    """
    if not file_path:
        return False
    try:
        path = Path(file_path)
        if path.exists() and path.is_file():
            path.unlink(missing_ok=True)
            return True
    except Exception as e:
        print(f"[Cleaner] Error deleting file {file_path}: {e}")
    return False

def cleanup_stale_temp_files(max_age_seconds: int = 1800) -> int:
    """
    Sweeps temp dir and deletes files older than max_age_seconds (default 30 min).
    """
    deleted_count = 0
    now = time.time()
    try:
        for file in TEMP_MEDIA_DIR.iterdir():
            if file.is_file():
                if now - file.stat().st_mtime > max_age_seconds:
                    file.unlink(missing_ok=True)
                    deleted_count += 1
    except Exception as e:
        print(f"[Cleaner] Error during stale cleanup: {e}")
    return deleted_count
