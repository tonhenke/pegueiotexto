import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Media temp storage
TEMP_MEDIA_DIR = Path(os.getenv("TEMP_MEDIA_DIR", "/tmp/peguei_o_texto_media"))
TEMP_MEDIA_DIR.mkdir(parents=True, exist_ok=True)

# Transcription limits
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "500"))
MAX_AUDIO_DURATION_MINUTES = int(os.getenv("MAX_AUDIO_DURATION_MINUTES", "180"))
