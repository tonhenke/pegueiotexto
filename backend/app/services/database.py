import os
import math
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from app.config import env_path
from dotenv import load_dotenv

load_dotenv(dotenv_path=env_path)

from app.config import SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

_client: Optional[Client] = None
_admin_client: Optional[Client] = None

def get_supabase(admin: bool = False) -> Client:
    global _client, _admin_client
    if admin:
        if _admin_client is None:
            key = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY
            if not SUPABASE_URL or not key:
                raise ValueError("SUPABASE_URL e chave Supabase precisam estar configurados.")
            _admin_client = create_client(SUPABASE_URL, key)
        return _admin_client

    if _client is None:
        key = SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY
        if not SUPABASE_URL or not key:
            raise ValueError("SUPABASE_URL e SUPABASE_ANON_KEY precisam estar configurados.")
        _client = create_client(SUPABASE_URL, key)
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
        sb = get_supabase(admin=False)
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
    sb = get_supabase(admin=True)
    try:
        res = sb.table("profiles").select("*").eq("id", user_id).limit(1).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
    except Exception as e:
        print(f"[Database] Erro ao buscar perfil ({user_id}): {e}")
    return None

def get_user_active_plan(user_id: str) -> Dict[str, Any]:
    """
    Determines user's active plan by checking profiles.plan or recent credit_transactions.
    """
    sb = get_supabase(admin=True)
    profile = get_user_profile(user_id)
    credits = int(profile.get("credits_minutes", 5)) if profile else 5

    plan_id = "gratuito"
    if profile and profile.get("plan"):
        plan_id = str(profile.get("plan")).strip().lower()
    else:
        # Fallback to credit_transactions for latest purchase
        try:
            tx = sb.table("credit_transactions") \
                .select("type, created_at") \
                .eq("user_id", user_id) \
                .like("type", "purchase_%") \
                .order("created_at", desc=True) \
                .limit(1) \
                .execute()
            if tx.data and len(tx.data) > 0:
                t_type = tx.data[0].get("type", "")
                plan_id = t_type.replace("purchase_", "").strip().lower()
        except Exception as e:
            print(f"[Database] Erro ao buscar transações de plano: {e}")

    plan_names = {
        "starter": "Starter",
        "starter_annual": "Starter Anual",
        "pro": "Pro",
        "pro_annual": "Pro Anual",
        "business": "Business",
        "business_annual": "Business Anual",
        "gratuito": "Gratuito"
    }

    return {
        "plan": plan_id,
        "plan_name": plan_names.get(plan_id, plan_id.capitalize()),
        "credits_minutes": credits,
        "is_paid": plan_id in ["starter", "starter_annual", "pro", "pro_annual", "business", "business_annual"]
    }

def check_and_deduct_credits(user_id: str, duration_seconds: int) -> Dict[str, Any]:
    """
    Calculates minutes needed, verifies user balance, and deducts credits.
    """
    sb = get_supabase(admin=True)
    profile = get_user_profile(user_id)
    if not profile:
        # Auto-create profile if missing with 5 free initial credits
        try:
            sb.table("profiles").insert({
                "id": user_id,
                "credits_minutes": 5,
                "email": "",
                "plan": "gratuito"
            }).execute()
            profile = {"id": user_id, "credits_minutes": 5, "plan": "gratuito"}
        except Exception as e:
            print(f"[Database] Erro ao criar perfil padrão: {e}")
            profile = {"id": user_id, "credits_minutes": 5, "plan": "gratuito"}

    current_balance = int(profile.get("credits_minutes", 0))
    minutes_needed = max(1, math.ceil(duration_seconds / 60))

    if current_balance < minutes_needed:
        return {
            "allowed": False,
            "minutes_deducted": 0,
            "credits_remaining": current_balance,
            "error": f"Saldo insuficiente. Este vídeo requer {minutes_needed} minutos, mas seu saldo atual é de {current_balance} minutos."
        }

    new_balance = current_balance - minutes_needed

    try:
        sb.table("profiles").update({"credits_minutes": new_balance}).eq("id", user_id).execute()
    except Exception as e:
        print(f"[Database] Erro ao debitar créditos: {e}")

    try:
        sb.table("credit_transactions").insert({
            "user_id": user_id,
            "amount_minutes": -minutes_needed,
            "type": "usage"
        }).execute()
    except Exception as e:
        print(f"[Database] Falha ao registrar log de transação de uso: {e}")

    return {
        "allowed": True,
        "minutes_deducted": minutes_needed,
        "credits_remaining": new_balance,
        "error": None
    }

def add_user_credits(
    user_id: str,
    minutes_to_add: int,
    plan_id: str,
    stripe_session_id: Optional[str] = None,
    user_email: Optional[str] = None
) -> Dict[str, Any]:
    """
    Adds credits to user's profile upon successful purchase.
    Guarantees idempotency (does not credit twice for the same stripe_session_id).
    Updates user's active plan.
    """
    sb = get_supabase(admin=True)
    plan_clean = plan_id.strip().lower()

    # 1. Idempotency Check
    if stripe_session_id:
        try:
            existing_tx = sb.table("credit_transactions") \
                .select("id") \
                .eq("stripe_session_id", stripe_session_id) \
                .limit(1) \
                .execute()
            if existing_tx.data and len(existing_tx.data) > 0:
                print(f"[Database] Sessão {stripe_session_id} já foi processada anteriormente. Evitando duplicidade.")
                profile = get_user_profile(user_id)
                current_balance = int(profile.get("credits_minutes", 0)) if profile else 0
                return {
                    "already_processed": True,
                    "new_balance": current_balance,
                    "plan": plan_clean,
                    "credits_added": 0
                }
        except Exception as e:
            print(f"[Database] Verificação de idempotência: {e}")

    # 2. Try PostgreSQL RPC with SECURITY DEFINER first if available
    try:
        rpc_res = sb.rpc("fulfill_user_credits", {
            "p_user_id": user_id,
            "p_minutes": minutes_to_add,
            "p_plan": plan_clean,
            "p_session_id": stripe_session_id or ""
        }).execute()
        if rpc_res.data:
            print(f"[Database RPC] fulfill_user_credits executado com sucesso: {rpc_res.data}")
            return {
                "already_processed": rpc_res.data.get("already_processed", False),
                "new_balance": rpc_res.data.get("new_balance", minutes_to_add),
                "plan": plan_clean,
                "credits_added": minutes_to_add,
                "rls_fallback_needed": False
            }
    except Exception as rpc_err:
        print(f"[Database RPC] RPC não configurado ou indisponível, usando fallback direto: {rpc_err}")

    # 3. Direct table update / upsert
    profile = get_user_profile(user_id)
    current_balance = int(profile.get("credits_minutes", 5)) if profile else 5
    new_balance = current_balance + minutes_to_add

    update_data = {
        "credits_minutes": new_balance,
        "plan": plan_clean
    }
    if user_email and not (profile and profile.get("email")):
        update_data["email"] = user_email

    rls_error = None
    try:
        if profile:
            sb.table("profiles").update(update_data).eq("id", user_id).execute()
        else:
            insert_data = {
                "id": user_id,
                "credits_minutes": new_balance,
                "plan": plan_clean,
                "email": user_email or ""
            }
            sb.table("profiles").insert(insert_data).execute()
    except Exception as e:
        err_msg = str(e)
        if "column profiles.plan does not exist" in err_msg or "42703" in err_msg:
            print("[Database] Coluna 'plan' ainda não existe na tabela profiles. Atualizando apenas credits_minutes.")
            try:
                if profile:
                    sb.table("profiles").update({"credits_minutes": new_balance}).eq("id", user_id).execute()
                else:
                    sb.table("profiles").insert({
                        "id": user_id,
                        "credits_minutes": new_balance,
                        "email": user_email or ""
                    }).execute()
            except Exception as e2:
                print(f"[Database] Erro ao atualizar profiles: {e2}")
                rls_error = str(e2)
        else:
            print(f"[Database] Erro ao salvar no profiles: {e}")
            rls_error = err_msg

    # Record transaction in credit_transactions
    try:
        sb.table("credit_transactions").insert({
            "user_id": user_id,
            "amount_minutes": minutes_to_add,
            "type": f"purchase_{plan_clean}",
            "stripe_session_id": stripe_session_id
        }).execute()
    except Exception as e:
        print(f"[Database] Falha ao registrar credit_transaction: {e}")

    return {
        "already_processed": False,
        "new_balance": new_balance,
        "plan": plan_clean,
        "credits_added": minutes_to_add,
        "rls_fallback_needed": bool(rls_error and ("row-level security" in rls_error.lower() or "42501" in rls_error))
    }

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
    sb = get_supabase(admin=True)
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
    sb = get_supabase(admin=True)
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
