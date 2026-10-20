from typing import Dict, Any, Optional
import stripe
from app.config import STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, FRONTEND_URL
from app.services.database import add_user_credits

stripe.api_key = STRIPE_SECRET_KEY

PLANS: Dict[str, Dict[str, Any]] = {
    "starter": {
        "name": "Pacote Starter — 60 minutos",
        "description": "60 minutos de transcrição com IA Whisper",
        "amount": 490,  # R$ 4,90 in cents
        "currency": "brl",
        "minutes": 60,
    },
    "pro": {
        "name": "Pacote Pro — 300 minutos",
        "description": "300 minutos de transcrição com IA Whisper",
        "amount": 1790,  # R$ 17,90 in cents
        "currency": "brl",
        "minutes": 300,
    },
    "business": {
        "name": "Pacote Business — 1.000 minutos",
        "description": "1.000 minutos de transcrição com IA Whisper",
        "amount": 7990,  # R$ 79,90 in cents
        "currency": "brl",
        "minutes": 1000,
    },
}

def create_checkout_session(
    plan_id: str,
    user_id: Optional[str] = None,
    user_email: Optional[str] = None,
    success_url: Optional[str] = None,
    cancel_url: Optional[str] = None
) -> Dict[str, Any]:
    """
    Creates a Stripe Checkout Session for purchasing credit packages.
    """
    plan = PLANS.get(plan_id.lower())
    if not plan:
        raise ValueError(f"Plano inválido: {plan_id}. Planos disponíveis: {list(PLANS.keys())}")

    resolved_success = success_url or f"{FRONTEND_URL}/dashboard?payment=success&plan={plan_id}&session_id={{CHECKOUT_SESSION_ID}}"
    if "{CHECKOUT_SESSION_ID}" not in resolved_success:
        sep = "&" if "?" in resolved_success else "?"
        resolved_success = f"{resolved_success}{sep}session_id={{CHECKOUT_SESSION_ID}}"
    resolved_cancel = cancel_url or f"{FRONTEND_URL}/precos?payment=cancelled"

    # Fallback to simulated checkout if Stripe key is missing
    if not STRIPE_SECRET_KEY or STRIPE_SECRET_KEY == "sua_chave_stripe_aqui":
        print("[Stripe] STRIPE_SECRET_KEY não configurada. Simulando compra e creditando minutos no Supabase.")
        new_balance = None
        if user_id:
            try:
                credit_res = add_user_credits(
                    user_id=user_id,
                    minutes_to_add=plan["minutes"],
                    plan_id=plan_id,
                    stripe_session_id=f"sim_cs_{plan_id}_123",
                    user_email=user_email
                )
                new_balance = credit_res.get("new_balance")
                print(f"[Stripe Simulado] +{plan['minutes']} minutos creditados para o usuário {user_id}. Novo saldo: {new_balance}")
            except Exception as e:
                print(f"[Stripe Simulado] Erro ao creditar minutos: {e}")

        # Replace template placeholder for simulated redirect
        sim_session_id = f"sim_cs_{plan_id}_123456"
        sim_success = resolved_success.replace("{CHECKOUT_SESSION_ID}", sim_session_id)

        return {
            "checkout_url": f"{sim_success}&mode=simulated",
            "session_id": sim_session_id,
            "plan": plan,
            "mode": "simulated",
            "credits_added": plan["minutes"],
            "new_balance": new_balance
        }

    session = stripe.checkout.Session.create(
        client_reference_id=user_id,
        line_items=[{
            "price_data": {
                "currency": plan["currency"],
                "product_data": {
                    "name": plan["name"],
                    "description": plan["description"],
                },
                "unit_amount": plan["amount"],
            },
            "quantity": 1,
        }],
        mode="payment",
        customer_email=user_email if user_email else None,
        metadata={
            "user_id": user_id or "",
            "plan_id": plan_id,
            "minutes": str(plan["minutes"]),
            "user_email": user_email or "",
        },
        success_url=resolved_success,
        cancel_url=resolved_cancel,
    )

    return {
        "checkout_url": session.url,
        "session_id": session.id,
        "plan": plan,
        "mode": "live"
    }

def retrieve_session(session_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieves a Stripe Checkout Session by ID.
    """
    if not STRIPE_SECRET_KEY or STRIPE_SECRET_KEY == "sua_chave_stripe_aqui":
        return None
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return session
    except Exception as e:
        print(f"[Stripe] Erro ao recuperar sessão {session_id}: {e}")
        return None

def find_recent_paid_sessions_for_user(
    user_id: Optional[str] = None,
    user_email: Optional[str] = None,
    limit: int = 20
) -> list:
    """
    Finds recent paid checkout sessions matching user ID or user email.
    Useful for immediately recovering and crediting Pix payments.
    """
    if not STRIPE_SECRET_KEY or STRIPE_SECRET_KEY == "sua_chave_stripe_aqui":
        return []
    try:
        sessions = stripe.checkout.Session.list(limit=limit)
        matching = []
        raw_list = sessions.data if hasattr(sessions, "data") else sessions
        for s in raw_list:
            if s.get("payment_status") != "paid":
                continue
            meta = s.get("metadata", {}) or {}
            s_uid = s.get("client_reference_id") or meta.get("user_id")
            s_cust = s.get("customer_details") or {}
            s_email = s_cust.get("email") or meta.get("user_email")

            is_match = False
            if user_id and s_uid and str(s_uid).strip() == str(user_id).strip():
                is_match = True
            elif user_email and s_email and str(s_email).strip().lower() == str(user_email).strip().lower():
                is_match = True

            if is_match:
                matching.append(s)
        return matching
    except Exception as e:
        print(f"[Stripe] Erro ao buscar sessões recentes: {e}")
        return []

def verify_webhook(payload: bytes, sig_header: str) -> Dict[str, Any]:
    """
    Constructs and verifies a Stripe Webhook event.
    """
    if not STRIPE_WEBHOOK_SECRET:
        raise ValueError("STRIPE_WEBHOOK_SECRET não configurado.")

    event = stripe.Webhook.construct_event(
        payload, sig_header, STRIPE_WEBHOOK_SECRET
    )
    return event
