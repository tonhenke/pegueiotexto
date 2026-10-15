import os
import math
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from app.config import env_path
from dotenv import load_dotenv

load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

_client: Optional[Client] = None

def get_supabase() -> Client:
    global _client
    if _client is None:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise ValueError("SUPABASE_URL e SUPABASE_ANON_KEY precisam estar configurados.")
        _client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    return _client

def verify_token_and_get_user(auth_header: Optional[str]) -> Optional[Dict[str, Any]]:
    """
    Validates the Bearer access_token sent from frontend
    and returns the Supabase user object.
    """
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.replace("Bearer ", "").strip()
    try:
        sb = get_supabase()
        user_res = sb.auth.get_user(token)
        if user_res and user_res.user:
            return {
                "id": user_res.user.id,
                "email": user_res.user.email,
            }
    except Exception as e:
        print(f"[Auth] Token verification failed: {e}")
    return None

def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    sb = get_supabase()
    res = sb.table("profiles").select("*").eq("id", user_id).limit(1).execute()
    if res.data and len(res.data) > 0:
        return res.data[0]
    return None

def check_and_deduct_credits(user_id: str, duration_seconds: int) -> Dict[str, Any]:
    """
    Calculates minutes needed, verifies user balance, and deducts credits.
    Returns:
        {
            "allowed": bool,
            "minutes_deducted": int,
            "credits_remaining": int,
            "error": Optional[str]
        }
    """
    sb = get_supabase()
    profile = get_user_profile(user_id)
    if not profile:
        return {
            "allowed": False,
            "minutes_deducted": 0,
            "credits_remaining": 0,
            "error": "Perfil de usuário não encontrado."
        }

    current_balance = int(profile.get("credits_minutes", 0))
    # Round up duration to whole minutes (e.g. 65 seconds = 2 minutes)
    minutes_needed = max(1, math.ceil(duration_seconds / 60))

    if current_balance < minutes_needed:
        return {
            "allowed": False,
            "minutes_deducted": 0,
            "credits_remaining": current_balance,
            "error": f"Saldo insuficiente. Este vídeo requer {minutes_needed} minutos, mas seu saldo atual é de {current_balance} minutos."
        }

    new_balance = current_balance - minutes_needed

    # Update profile credits
    sb.table("profiles").update({"credits_minutes": new_balance}).eq("id", user_id).execute()

    # Log transaction
    try:
        sb.table("credit_transactions").insert({
            "user_id": user_id,
            "amount_minutes": -minutes_needed,
            "type": "usage"
        }).execute()
    except Exception as e:
        print(f"[Database] Failed to log credit transaction: {e}")

    return {
        "allowed": True,
        "minutes_deducted": minutes_needed,
        "credits_remaining": new_balance,
        "error": None
    }

def add_user_credits(user_id: str, minutes_to_add: int, plan_id: str, stripe_session_id: Optional[str] = None) -> int:
    """
    Adds credits to user's profile upon successful purchase.
    """
    sb = get_supabase()
    profile = get_user_profile(user_id)
    current_balance = int(profile.get("credits_minutes", 0)) if profile else 0
    new_balance = current_balance + minutes_to_add

    if profile:
        sb.table("profiles").update({"credits_minutes": new_balance}).eq("id", user_id).execute()
    else:
        # Create profile if not exist
        sb.table("profiles").insert({
            "id": user_id,
            "credits_minutes": new_balance,
            "email": ""
        }).execute()

    sb.table("credit_transactions").insert({
        "user_id": user_id,
        "amount_minutes": minutes_to_add,
        "type": f"purchase_{plan_id}",
        "stripe_session_id": stripe_session_id
    }).execute()

    return new_balance

def save_transcription_record(
    user_id: str,
    title: str,
    platform: str,
    duration_seconds: int,
    minutes_deducted: int,
    text_content: str,
    srt_content: str,
    vtt_content: str
) -> Optional[str]:
    """
    Saves the transcription text into user's history in Supabase.
    """
    sb = get_supabase()
    try:
        res = sb.table("transcriptions").insert({
            "user_id": user_id,
            "title": title,
            "platform": platform,
            "duration_seconds": duration_seconds,
            "minutes_deducted": minutes_deducted,
            "text_content": text_content,
            "srt_content": srt_content,
            "vtt_content": vtt_content
        }).execute()
        if res.data and len(res.data) > 0:
            return res.data[0].get("id")
    except Exception as e:
        print(f"[Database] Error saving transcription: {e}")
    return None

def get_user_transcription_history(user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
    sb = get_supabase()
    try:
        res = sb.table("transcriptions")\
            .select("id, title, platform, duration_seconds, minutes_deducted, created_at, text_content")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()
        return res.data or []
    except Exception as e:
        print(f"[Database] Error fetching user history: {e}")
        return []
