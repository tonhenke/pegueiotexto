import sys
from pathlib import Path

# Add backend directory to sys.path so 'app' is always importable
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.transcribe import router as transcribe_router
from app.api.checkout import router as checkout_router
from app.api.affiliates import router as affiliates_router
from app.api.downloader import router as download_router
from app.services.cleaner import cleanup_stale_temp_files

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: sweep any leftover temp media files
    cleaned = cleanup_stale_temp_files(max_age_seconds=600)
    print(f"[Backend Startup] Peguei o Texto API iniciada. Arquivos temporários limpos: {cleaned}")
    yield
    # Shutdown
    cleanup_stale_temp_files(max_age_seconds=0)

app = FastAPI(
    title="Peguei o Texto: API de Transcrição",
    description="Backend para transcrição de vídeos da internet, extração de áudio, Inteligência Artificial e cobrança via Stripe.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(transcribe_router)
app.include_router(checkout_router)
app.include_router(affiliates_router)
app.include_router(download_router)

@app.get("/")
def root():
    return {
        "service": "Peguei o Texto API",
        "status": "online",
        "docs": "/docs",
        "endpoints": {
            "transcribe_url": "POST /api/transcribe/url",
            "transcribe_upload": "POST /api/transcribe/upload",
            "transcribe_summarize": "POST /api/transcribe/summarize",
            "checkout_plans": "GET /api/checkout/plans",
            "checkout_session": "POST /api/checkout/create-session",
            "checkout_webhook": "POST /api/checkout/webhook",
            "affiliates_list": "GET /api/affiliates/list",
            "affiliates_register": "POST /api/affiliates/register",
            "affiliates_status": "POST /api/affiliates/status",
        }
    }
