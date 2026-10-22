import os
import sqlite3
import datetime
from pathlib import Path
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter(prefix="/api/affiliates", tags=["Affiliates"])

DATA_DIR = Path(os.getenv("AFFILIATES_DATA_DIR", "/tmp/peguei_o_texto_data"))
DATA_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DATA_DIR / "affiliates.db"

def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS affiliates (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            affiliate_code TEXT UNIQUE,
            full_name TEXT,
            email TEXT,
            phone TEXT,
            cpf_cnpj TEXT,
            pix_key_type TEXT,
            pix_key TEXT,
            pix_name TEXT,
            channel_type TEXT,
            channel_url TEXT,
            audience_range TEXT,
            commission_rate REAL DEFAULT 0.25,
            balance_available REAL DEFAULT 0.0,
            balance_pending REAL DEFAULT 0.0,
            total_paid REAL DEFAULT 0.0,
            status TEXT DEFAULT 'pending_review',
            created_at TEXT,
            updated_at TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS affiliate_clicks (
            id TEXT PRIMARY KEY,
            affiliate_code TEXT,
            referer TEXT,
            created_at TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS affiliate_conversions (
            id TEXT PRIMARY KEY,
            affiliate_code TEXT,
            plan_id TEXT,
            plan_name TEXT,
            order_amount REAL,
            commission_amount REAL,
            status TEXT,
            available_at TEXT,
            stripe_session_id TEXT,
            buyer_email TEXT,
            created_at TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS affiliate_payouts (
            id TEXT PRIMARY KEY,
            affiliate_id TEXT,
            affiliate_code TEXT,
            amount REAL,
            pix_key_type TEXT,
            pix_key TEXT,
            pix_name TEXT,
            status TEXT,
            requested_at TEXT,
            paid_at TEXT
        )
    """)
    conn.commit()
    conn.close()

# Initialize tables
init_db()

# Pydantic Schemas
class RegisterSchema(BaseModel):
    user_id: str
    full_name: str
    email: str
    phone: str
    cpf_cnpj: str
    pix_key_type: str = "cpf_cnpj"
    pix_key: str
    pix_name: Optional[str] = None
    channel_type: Optional[str] = "outros"
    channel_url: Optional[str] = ""
    audience_range: Optional[str] = "iniciante"
    affiliate_code: str

class StatusUpdateSchema(BaseModel):
    affiliate_code: str
    status: str

class TrackClickSchema(BaseModel):
    affiliate_code: str
    referer: Optional[str] = None

class PayoutRequestSchema(BaseModel):
    affiliate_code: str
    amount: Optional[float] = None

class ConversionSchema(BaseModel):
    affiliate_code: str
    plan_id: str
    plan_name: str
    order_amount: float
    stripe_session_id: Optional[str] = None
    buyer_email: Optional[str] = None

def mature_commissions(affiliate_code: str):
    conn = get_db()
    cursor = conn.cursor()
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    cursor.execute("""
        SELECT * FROM affiliate_conversions
        WHERE affiliate_code = ? AND status = 'pending' AND available_at <= ?
    """, (affiliate_code, now_iso))
    matured = cursor.fetchall()

    if matured:
        amount_to_release = sum(row["commission_amount"] for row in matured)
        cursor.execute("""
            UPDATE affiliate_conversions
            SET status = 'available'
            WHERE affiliate_code = ? AND status = 'pending' AND available_at <= ?
        """, (affiliate_code, now_iso))

        cursor.execute("""
            UPDATE affiliates
            SET balance_available = balance_available + ?,
                balance_pending = MAX(0.0, balance_pending - ?),
                updated_at = ?
            WHERE affiliate_code = ?
        """, (amount_to_release, amount_to_release, now_iso, affiliate_code))
        conn.commit()
    conn.close()

@router.get("/list")
def list_affiliates():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM affiliates ORDER BY created_at DESC")
    affiliates_rows = cursor.fetchall()
    affiliates = [dict(r) for r in affiliates_rows]

    cursor.execute("SELECT * FROM affiliate_clicks")
    clicks = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM affiliate_conversions")
    conversions = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM affiliate_payouts")
    payouts = [dict(r) for r in cursor.fetchall()]
    conn.close()

    enriched = []
    for aff in affiliates:
        aff_code = aff["affiliate_code"]
        aff_clicks = [c for c in clicks if c["affiliate_code"] == aff_code]
        aff_convs = [c for c in conversions if c["affiliate_code"] == aff_code]
        aff_payouts = [p for p in payouts if p["affiliate_code"] == aff_code]

        enriched.append({
            **aff,
            "clicks_count": len(aff_clicks),
            "conversions_count": len(aff_convs),
            "total_revenue": sum(c["order_amount"] for c in aff_convs),
            "total_commission_generated": sum(c["commission_amount"] for c in aff_convs),
            "payouts_count": len(aff_payouts),
        })

    pending_count = len([a for a in affiliates if a["status"] == "pending_review"])
    active_count = len([a for a in affiliates if a["status"] == "active"])
    suspended_count = len([a for a in affiliates if a["status"] == "suspended"])

    return {
        "affiliates": enriched,
        "summary": {
            "total": len(affiliates),
            "pending": pending_count,
            "active": active_count,
            "suspended": suspended_count,
            "total_clicks": len(clicks),
            "total_conversions": len(conversions),
            "total_payouts_paid": sum(p["amount"] for p in payouts if p["status"] == "paid"),
        }
    }

@router.post("/register")
def register_affiliate(payload: RegisterSchema):
    clean_code = payload.affiliate_code.strip().lower()
    if len(clean_code) < 3:
        raise HTTPException(status_code=400, detail="O código de afiliado deve conter ao menos 3 caracteres alfanuméricos.")

    conn = get_db()
    cursor = conn.cursor()

    # Check if code taken by another user
    cursor.execute("SELECT * FROM affiliates WHERE affiliate_code = ?", (clean_code,))
    existing_code = cursor.fetchone()
    if existing_code and existing_code["user_id"] != payload.user_id:
        conn.close()
        raise HTTPException(status_code=409, detail="Este código de afiliado já está em uso. Por favor, escolha outro.")

    # Check if user already registered
    cursor.execute("SELECT * FROM affiliates WHERE user_id = ?", (payload.user_id,))
    existing_user = cursor.fetchone()
    if existing_user:
        conn.close()
        return {
            "success": True,
            "affiliate": dict(existing_user),
            "message": "Você já possui cadastro de afiliado.",
        }

    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    aff_id = f"aff_{int(datetime.datetime.now().timestamp() * 1000)}"

    cursor.execute("""
        INSERT INTO affiliates (
            id, user_id, affiliate_code, full_name, email, phone, cpf_cnpj,
            pix_key_type, pix_key, pix_name, channel_type, channel_url,
            audience_range, commission_rate, balance_available, balance_pending,
            total_paid, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.25, 0.0, 0.0, 0.0, 'pending_review', ?, ?)
    """, (
        aff_id, payload.user_id, clean_code, payload.full_name.strip(),
        payload.email.strip().lower(), payload.phone.strip(), payload.cpf_cnpj.strip(),
        payload.pix_key_type, payload.pix_key.strip(),
        (payload.pix_name or payload.full_name).strip(),
        payload.channel_type, (payload.channel_url or "").strip(),
        payload.audience_range, now_iso, now_iso
    ))
    conn.commit()

    cursor.execute("SELECT * FROM affiliates WHERE id = ?", (aff_id,))
    new_aff = dict(cursor.fetchone())
    conn.close()

    return {
        "success": True,
        "affiliate": new_aff,
        "message": "Candidatura enviada com sucesso! Seus dados foram recebidos e estão em análise.",
    }

@router.get("/me")
def get_affiliate_me(user_id: Optional[str] = None, affiliate_code: Optional[str] = None):
    if not user_id and not affiliate_code:
        raise HTTPException(status_code=400, detail="user_id ou affiliate_code é obrigatório.")

    conn = get_db()
    cursor = conn.cursor()

    if affiliate_code:
        cursor.execute("SELECT * FROM affiliates WHERE affiliate_code = ?", (affiliate_code.strip().lower(),))
    else:
        cursor.execute("SELECT * FROM affiliates WHERE user_id = ?", (user_id,))

    row = cursor.fetchone()
    if not row:
        conn.close()
        return {"is_affiliate": False}

    affiliate = dict(row)
    conn.close()

    mature_commissions(affiliate["affiliate_code"])

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM affiliates WHERE id = ?", (affiliate["id"],))
    updated_aff = dict(cursor.fetchone())

    aff_code = updated_aff["affiliate_code"]
    cursor.execute("SELECT * FROM affiliate_clicks WHERE affiliate_code = ? ORDER BY created_at DESC", (aff_code,))
    clicks = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM affiliate_conversions WHERE affiliate_code = ? ORDER BY created_at DESC", (aff_code,))
    conversions = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM affiliate_payouts WHERE affiliate_code = ? ORDER BY requested_at DESC", (aff_code,))
    payouts = [dict(r) for r in cursor.fetchall()]
    conn.close()

    total_clicks = len(clicks)
    total_conversions = len(conversions)
    conversion_rate = round((total_conversions / total_clicks) * 100, 1) if total_clicks > 0 else 0.0

    return {
        "is_affiliate": True,
        "affiliate": updated_aff,
        "metrics": {
            "clicks_total": total_clicks,
            "conversions_total": total_conversions,
            "conversion_rate_percent": conversion_rate,
            "total_commission_earned": sum(c["commission_amount"] for c in conversions),
            "balance_available": updated_aff["balance_available"],
            "balance_pending": updated_aff["balance_pending"],
            "total_paid": updated_aff["total_paid"],
            "min_payout_amount": 100.0,
            "safety_period_days": 14,
        },
        "conversions": conversions,
        "payouts": payouts,
    }

@router.post("/status")
def update_affiliate_status(payload: StatusUpdateSchema):
    conn = get_db()
    cursor = conn.cursor()
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    cursor.execute("""
        UPDATE affiliates
        SET status = ?, updated_at = ?
        WHERE affiliate_code = ?
    """, (payload.status, now_iso, payload.affiliate_code.strip().lower()))

    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Afiliado não encontrado.")

    conn.commit()
    cursor.execute("SELECT * FROM affiliates WHERE affiliate_code = ?", (payload.affiliate_code.strip().lower(),))
    aff = dict(cursor.fetchone())
    conn.close()

    return {
        "success": True,
        "affiliate": aff,
        "message": f"Status do afiliado {payload.affiliate_code} alterado para {payload.status}.",
    }

@router.post("/click")
def track_click(payload: TrackClickSchema):
    clean_code = payload.affiliate_code.strip().lower()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM affiliates WHERE affiliate_code = ? AND status = 'active'", (clean_code,))
    aff = cursor.fetchone()

    if aff:
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        clk_id = f"clk_{int(datetime.datetime.now().timestamp() * 1000)}"
        cursor.execute("""
            INSERT INTO affiliate_clicks (id, affiliate_code, referer, created_at)
            VALUES (?, ?, ?, ?)
        """, (clk_id, clean_code, payload.referer or "", now_iso))
        conn.commit()

    conn.close()
    return {"success": True, "tracked": bool(aff)}

@router.post("/payout")
def request_payout(payload: PayoutRequestSchema):
    clean_code = payload.affiliate_code.strip().lower()
    mature_commissions(clean_code)

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM affiliates WHERE affiliate_code = ?", (clean_code,))
    aff = cursor.fetchone()

    if not aff:
        conn.close()
        raise HTTPException(status_code=404, detail="Afiliado não encontrado.")

    aff = dict(aff)
    payout_amount = payload.amount or aff["balance_available"]
    min_amount = 100.0

    if payout_amount < min_amount:
        conn.close()
        raise HTTPException(status_code=400, detail=f"O valor mínimo para resgate é de R$ {min_amount:.2f}.")

    if payout_amount > aff["balance_available"]:
        conn.close()
        raise HTTPException(status_code=400, detail="Saldo disponível insuficiente.")

    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    pay_id = f"pay_{int(datetime.datetime.now().timestamp() * 1000)}"

    cursor.execute("""
        INSERT INTO affiliate_payouts (
            id, affiliate_id, affiliate_code, amount, pix_key_type,
            pix_key, pix_name, status, requested_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'requested', ?)
    """, (
        pay_id, aff["id"], clean_code, payout_amount,
        aff["pix_key_type"], aff["pix_key"], aff["pix_name"], now_iso
    ))

    cursor.execute("""
        UPDATE affiliates
        SET balance_available = 0.0, updated_at = ?
        WHERE affiliate_code = ?
    """, (now_iso, clean_code))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": f"Solicitação de saque de R$ {payout_amount:.2f} via Pix registrada com sucesso!",
    }

@router.post("/conversion")
def record_conversion(payload: ConversionSchema):
    clean_code = payload.affiliate_code.strip().lower()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM affiliates WHERE affiliate_code = ? AND status = 'active'", (clean_code,))
    aff = cursor.fetchone()

    if not aff:
        conn.close()
        return {"success": False, "detail": "Afiliado não encontrado ou inativo."}

    aff = dict(aff)
    commission_rate = aff.get("commission_rate", 0.25)
    commission_amount = round(payload.order_amount * commission_rate, 2)

    now = datetime.datetime.now(datetime.timezone.utc)
    now_iso = now.isoformat()
    # 14 days maturation
    available_at_iso = (now + datetime.timedelta(days=14)).isoformat()
    conv_id = f"conv_{int(now.timestamp() * 1000)}"

    cursor.execute("""
        INSERT INTO affiliate_conversions (
            id, affiliate_code, plan_id, plan_name, order_amount,
            commission_amount, status, available_at, stripe_session_id,
            buyer_email, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
    """, (
        conv_id, clean_code, payload.plan_id, payload.plan_name,
        payload.order_amount, commission_amount, available_at_iso,
        payload.stripe_session_id or "", payload.buyer_email or "", now_iso
    ))

    cursor.execute("""
        UPDATE affiliates
        SET balance_pending = balance_pending + ?, updated_at = ?
        WHERE affiliate_code = ?
    """, (commission_amount, now_iso, clean_code))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "commission_amount": commission_amount,
        "available_at": available_at_iso,
    }
