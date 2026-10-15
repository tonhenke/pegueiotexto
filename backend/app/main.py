from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.transcribe import router as transcribe_router
from backend.app.api.checkout import router as checkout_router
from backend.app.services.cleaner import cleanup_stale_temp_files

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: sweep any leftover temp media files
    cleaned = cleanup_stale_temp_files(max_age_seconds=600)
    print(f"[Backend Startup] Peguei o Texto API iniciada. Arquivos temporários limpos: {cleaned}")
    yield
    # Shutdown
    cleanup_stale_temp_files(max_age_seconds=0)

app = FastAPI(
    title="Peguei o Texto — API de Transcrição",
    description="Backend para transcrição de vídeos da internet, extração de áudio, Whisper IA e cobrança via Stripe.",
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

@app.get("/")
def root():
    return {
        "service": "Peguei o Texto API",
        "status": "online",
        "docs": "/docs",
        "endpoints": {
            "transcribe_url": "POST /api/transcribe/url",
            "transcribe_upload": "POST /api/transcribe/upload",
            "checkout_plans": "GET /api/checkout/plans",
            "checkout_session": "POST /api/checkout/create-session",
            "checkout_webhook": "POST /api/checkout/webhook",
        }
    }
