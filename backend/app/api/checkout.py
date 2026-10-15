from typing import Optional
from fastapi import APIRouter, HTTPException, Request, Header
from pydantic import BaseModel
from backend.app.services.stripe_service import (
    create_checkout_session,
    verify_webhook,
    PLANS
)
from backend.app.services.database import add_user_credits

router = APIRouter(prefix="/api/checkout", tags=["Stripe Payments"])

class CreateCheckoutRequest(BaseModel):
    plan_id: str
    user_id: Optional[str] = None
    email: Optional[str] = None
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None

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
        metadata = session.get("metadata", {})
        user_id = session.get("client_reference_id") or metadata.get("user_id")
        plan_id = metadata.get("plan_id", "starter")
        minutes_str = metadata.get("minutes", "60")
        minutes = int(minutes_str)
        user_email = metadata.get("user_email") or session.get("customer_details", {}).get("email")

        print(f"[Stripe Webhook] Pagamento confirmado!")
        print(f" -> Usuário ID: {user_id} ({user_email})")
        print(f" -> Plano: {plan_id} (+{minutes} minutos)")

        if user_id:
            try:
                new_balance = add_user_credits(
                    user_id=user_id,
                    minutes_to_add=minutes,
                    plan_id=plan_id,
                    stripe_session_id=session.get("id")
                )
                print(f" -> Créditos adicionados no Supabase com sucesso! Novo saldo: {new_balance} min")
            except Exception as e:
                print(f"[Stripe Webhook] Erro ao creditar minutos no Supabase: {e}")
        else:
            print("[Stripe Webhook] Aviso: user_id não encontrado no metadata da sessão.")

    return {"status": "success", "event": event_type}
