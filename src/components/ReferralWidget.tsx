"use client";

import { useState, useEffect } from "react";
import { Gift, X, Sparkles, Copy, Check, MessageCircle, Users, Zap, ExternalLink } from "lucide-react";

interface ReferralWidgetProps {
  user: any;
  profile: any;
}

export default function ReferralWidget({ user, profile }: ReferralWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{
    total_invites: number;
    total_minutes_earned: number;
  }>({
    total_invites: 0,
    total_minutes_earned: 0,
  });

  const userId = user?.id || "";
  const referralCode = userId ? userId.slice(0, 8) : "";
  const userName = profile?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "amigo";

  const referralUrl = typeof window !== "undefined" && referralCode
    ? `${window.location.origin}/login?ref=${referralCode}`
    : `https://pegueiotexto.com.br/login?ref=${referralCode}`;

  useEffect(() => {
    async function loadStats() {
      if (!userId) return;
      try {
        const res = await fetch(`/api/referral?user_id=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            total_invites: data.total_invites || 0,
            total_minutes_earned: data.total_minutes_earned || 0,
          });
        }
      } catch (err) {
        console.error("Erro ao carregar estatísticas de indicação:", err);
      }
    }

    if (userId) {
      loadStats();
    }
  }, [userId]);

  const handleCopy = () => {
    if (!referralUrl) return;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Oi! Achei essa ferramenta incrível para transcrever vídeos e áudios com Inteligência Artificial em segundos: Peguei o Texto. Crie sua conta grátis com meu link e ganhe 15 minutos de bônus imediato:\n${referralUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 999,
        }}
      >
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 20px",
              borderRadius: "100px",
              background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 700,
              boxShadow: "0 10px 30px rgba(124, 58, 237, 0.45), 0 2px 8px rgba(0, 0, 0, 0.3)",
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px) scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
            title="Clique para abrir o programa de indicação e ganhar minutos grátis"
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Gift size={15} color="#FFFFFF" />
            </span>
            <span>Ganhe 10 min</span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10B981",
                boxShadow: "0 0 10px #10B981",
              }}
            />
          </button>
        )}
      </div>

      {/* Chatbot-style Flyout Card */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "clamp(320px, 92vw, 400px)",
            maxHeight: "85vh",
            zIndex: 1000,
            background: "rgba(18, 18, 28, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(124, 58, 237, 0.4)",
            borderRadius: "20px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(124, 58, 237, 0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "fadeInUp 0.25s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              background: "linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.4)",
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>
                  Assistente de Recompensas
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "#6EE7B7", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                  Online agora • Indique e Ganhe
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                borderRadius: "50%",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              title="Fechar janela"
            >
              <X size={15} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div
            style={{
              padding: "20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              fontSize: "13px",
              lineHeight: 1.55,
            }}
          >
            {/* Bubble 1: Friendly greeting */}
            <div
              style={{
                alignSelf: "flex-start",
                maxWidth: "92%",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px 14px 14px 2px",
                padding: "12px 14px",
                color: "var(--text-primary)",
              }}
            >
              Olá, <strong>{userName}</strong>! Sabia que você pode ganhar minutos adicionais para transcrever sem colocar a mão no bolso?
            </div>

            {/* Bubble 2: The member-get-member rule */}
            <div
              style={{
                alignSelf: "flex-start",
                maxWidth: "92%",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px 14px 14px 2px",
                padding: "12px 14px",
                color: "var(--text-primary)",
              }}
            >
              Com o nosso programa <strong>Indique e Ganhe</strong>:
              <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#67E8F9", fontSize: "14px" }}>🎁</span>
                  <span>O seu amigo ganha <strong>+10 minutos extras</strong> ao criar a conta.</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#A78BFA", fontSize: "14px" }}>⚡</span>
                  <span>Você ganha <strong>+10 minutos</strong> no seu saldo para cada nova conta criada!</span>
                </div>
              </div>
            </div>

            {/* Bubble 3: Interactive Link Card */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)",
                border: "1px solid rgba(124, 58, 237, 0.35)",
                borderRadius: "14px",
                padding: "14px",
              }}
            >
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: 700, color: "#C4B5FD", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Seu link pessoal de convite
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  padding: "4px 8px 4px 12px",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="text"
                  readOnly
                  value={referralUrl}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                    width: "100%",
                    fontFamily: "monospace",
                  }}
                />
                <button
                  onClick={handleCopy}
                  className="btn-ghost"
                  style={{
                    fontSize: "11px",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    flexShrink: 0,
                    color: copied ? "#6EE7B7" : "#A78BFA",
                    borderColor: copied ? "rgba(16, 185, 129, 0.4)" : "rgba(124, 58, 237, 0.3)",
                    background: copied ? "rgba(16, 185, 129, 0.12)" : "rgba(124, 58, 237, 0.1)",
                  }}
                  title="Copiar link de convite"
                >
                  {copied ? (
                    <>
                      <Check size={12} color="#6EE7B7" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copiar
                    </>
                  )}
                </button>
              </div>

              {/* Action: Direct WhatsApp share button */}
              <button
                onClick={handleWhatsAppShare}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  color: "#6EE7B7",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                title="Compartilhar link de convite diretamente no WhatsApp"
              >
                <MessageCircle size={15} /> Enviar convite no WhatsApp
              </button>
            </div>

            {/* Bubble 4: Metrics / Live Tracker */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  textAlign: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#67E8F9", marginBottom: "4px" }}>
                  <Users size={14} />
                  <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Amigos</span>
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {stats.total_invites}
                </div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>contas criadas</div>
              </div>

              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  textAlign: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#A78BFA", marginBottom: "4px" }}>
                  <Zap size={14} />
                  <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Ganhos</span>
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                  +{stats.total_minutes_earned} min
                </div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>adicionados ao saldo</div>
              </div>
            </div>

            {/* Bubble 5: Tip */}
            <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)", textAlign: "center" }}>
              💡 Não há limite de convites. Quanto mais amigos você convidar, mais minutos gratuitos acumula!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
