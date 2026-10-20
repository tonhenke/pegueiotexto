from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Request, Header
from pydantic import BaseModel
from app.services.stripe_service import (
    create_checkout_session,
    retrieve_session,
    find_recent_paid_sessions_for_user,
    verify_webhook,
    PLANS
)
from app.services.database import (
    add_user_credits,
    get_user_active_plan,
    verify_token_and_get_user
)

router = APIRouter(prefix="/api/checkout", tags=["Stripe Payments"])

class CreateCheckoutRequest(BaseModel):
    plan_id: str
    user_id: Optional[str] = None
    email: Optional[str] = None
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None

class VerifySessionRequest(BaseModel):
    session_id: str

@router.get("/plans")
def get_plans():
    """Returns available credit packages."""
    return {"plans": PLANS}

@router.post("/create-session")
def create_session(req: CreateCheckoutRequest):
    """Creates a Stripe Checkout Session for buying credit packages."""
    try:
        session_data = create_checkout_session(
            plan_id=req.plan_id,
            user_id=req.user_id,
            user_email=req.email,
            success_url=req.success_url,
            cancel_url=req.cancel_url
        )
        return {
            "success": True,
            "checkout_url": session_data["checkout_url"],
            "session_id": session_data["session_id"],
            "plan": session_data["plan"],
            "mode": session_data["mode"],
            "credits_added": session_data.get("credits_added"),
            "new_balance": session_data.get("new_balance")
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar sessão Stripe: {str(e)}")

@router.post("/verify-session")
def verify_session(req: VerifySessionRequest, authorization: Optional[str] = Header(None)):
    """
    Verifies a Stripe checkout session in real-time when the customer returns to the dashboard.
    Fulfills the purchased credits immediately if not yet fulfilled by the webhook.
    """
    session_id = req.session_id.strip()
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id é obrigatório.")

    # 1. Retrieve session from Stripe
    session = retrieve_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sessão Stripe não encontrada ou inválida.")

    # 2. Check payment status
    payment_status = session.get("payment_status")
    if payment_status != "paid":
        return {
            "success": False,
            "paid": False,
            "status": payment_status,
            "message": "Pagamento ainda pendente de processamento bancário."
        }

    # 3. Extract metadata
    metadata = session.get("metadata", {}) or {}
    plan_id = metadata.get("plan_id", "starter").lower()
    plan_info = PLANS.get(plan_id, PLANS["starter"])
    try:
        minutes = int(metadata.get("minutes") or plan_info["minutes"])
    except Exception:
        minutes = plan_info["minutes"]

    # 4. Resolve user id
    user_id = session.get("client_reference_id") or metadata.get("user_id")
    if not user_id and authorization:
        auth_user = verify_token_and_get_user(authorization)
        if auth_user:
            user_id = auth_user["id"]

    if not user_id:
        raise HTTPException(status_code=400, detail="Não foi possível associar a sessão ao usuário.")

    user_email = metadata.get("user_email") or (session.get("customer_details") or {}).get("email")

    # 5. Fulfill credits idempotently
    fulfill_result = add_user_credits(
        user_id=user_id,
        minutes_to_add=minutes,
        plan_id=plan_id,
        stripe_session_id=session.get("id"),
        user_email=user_email
    )

    return {
        "success": True,
        "paid": True,
        "plan": plan_id,
        "plan_name": plan_info["name"],
        "credits_added": minutes if not fulfill_result.get("already_processed") else 0,
        "new_balance": fulfill_result.get("new_balance"),
        "already_processed": fulfill_result.get("already_processed", False),
        "rls_fallback_needed": fulfill_result.get("rls_fallback_needed", False)
    }

@router.post("/sync-status")
def sync_user_status(authorization: Optional[str] = Header(None)):
    """
    Syncs the user's credits and active plan.
    Checks Stripe for any unfulfilled paid sessions for this user (e.g. recent Pix purchases).
    Returns the active plan and balance.
    """
    user = verify_token_and_get_user(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Usuário não autenticado.")

    user_id = user["id"]
    user_email = user.get("email")

    fulfilled_any = False
    latest_plan = None
    latest_balance = None
    minutes_added_total = 0

    # Check Stripe for any paid sessions for this user
    try:
        paid_sessions = find_recent_paid_sessions_for_user(user_id=user_id, user_email=user_email)
        for s in paid_sessions:
            meta = s.get("metadata", {}) or {}
            plan_id = meta.get("plan_id", "starter").lower()
            plan_info = PLANS.get(plan_id, PLANS["starter"])
            try:
                minutes = int(meta.get("minutes") or plan_info["minutes"])
            except Exception:
                minutes = plan_info["minutes"]
            s_id = s.get("id")

            # Fulfill idempotently
            res = add_user_credits(
                user_id=user_id,
                minutes_to_add=minutes,
                plan_id=plan_id,
                stripe_session_id=s_id,
                user_email=user_email
            )
            if not res.get("already_processed"):
                fulfilled_any = True
                latest_plan = plan_id
                latest_balance = res.get("new_balance")
                minutes_added_total += minutes
                print(f"[Sync] Sessão {s_id} encontrada e creditada com sucesso para {user_email} (+{minutes} min).")
    except Exception as e:
        print(f"[Sync] Erro ao sincronizar com Stripe: {e}")

    # Fetch active plan and balance
    active_info = get_user_active_plan(user_id)

    return {
        "success": True,
        "synced": fulfilled_any,
        "plan": latest_plan or active_info["plan"],
        "plan_name": active_info["plan_name"],
        "credits_minutes": latest_balance if latest_balance is not None else active_info["credits_minutes"],
        "credits_added": minutes_added_total,
        "is_paid": active_info["is_paid"] or fulfilled_any,
        "fulfilled_now": fulfilled_any
    }

@router.get("/user-plan")
def get_user_plan_endpoint(authorization: Optional[str] = Header(None)):
    """
    Returns current plan and credit balance for logged-in user.
    """
    user = verify_token_and_get_user(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Usuário não autenticado.")
    return get_user_active_plan(user["id"])

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: Optional[str] = Header(None)):
    """
    Handles incoming Stripe webhooks to automatically fulfill purchased credits in Supabase.
    """
    if not stripe_signature:
        raise HTTPException(status_code=400, detail="Cabeçalho Stripe-Signature ausente.")

    payload = await request.body()
    try:
        event = verify_webhook(payload, stripe_signature)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro de assinatura Webhook: {str(e)}")

    event_type = event.get("type")
    if event_type == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session.get("metadata", {}) or {}
        user_id = session.get("client_reference_id") or metadata.get("user_id")
        plan_id = metadata.get("plan_id", "starter").lower()
        plan_info = PLANS.get(plan_id, PLANS["starter"])
        try:
            minutes = int(metadata.get("minutes") or plan_info["minutes"])
        except Exception:
            minutes = plan_info["minutes"]
        user_email = metadata.get("user_email") or (session.get("customer_details") or {}).get("email")

        print(f"[Stripe Webhook] Pagamento confirmado!")
        print(f" -> Usuário ID: {user_id} ({user_email})")
        print(f" -> Plano: {plan_id} (+{minutes} minutos)")

        if user_id:
            try:
                res = add_user_credits(
                    user_id=user_id,
                    minutes_to_add=minutes,
                    plan_id=plan_id,
                    stripe_session_id=session.get("id"),
                    user_email=user_email
                )
                print(f" -> Créditos adicionados no Supabase com sucesso! Resultado: {res}")
            except Exception as e:
                print(f"[Stripe Webhook] Erro ao creditar minutos no Supabase: {e}")
        else:
            print("[Stripe Webhook] Aviso: user_id não encontrado no metadata da sessão.")

    return {"status": "success", "event": event_type}
