"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Phone,
  KeyRound,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function AfiliadosObrigadoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ paddingTop: "120px", paddingBottom: "100px" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {/* MAIN HERO CARD */}
          <div
            className="glass-card"
            style={{
              padding: "48px 36px",
              textAlign: "center",
              border: "1px solid rgba(124, 58, 237, 0.4)",
              background: "radial-gradient(circle at top center, rgba(124, 58, 237, 0.15), transparent 70%), var(--bg-card)",
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5)",
              marginBottom: "32px",
            }}
          >
            {/* Glowing Icon */}
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)",
                border: "2px solid rgba(16, 185, 129, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: "0 0 30px rgba(16, 185, 129, 0.25)",
              }}
            >
              <CheckCircle2 size={40} color="#10B981" />
            </div>

            <span
              className="badge badge-purple"
              style={{
                marginBottom: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 16px",
                fontSize: "13px",
              }}
            >
              <Clock size={13} color="#A78BFA" /> Candidatura em Análise Manual
            </span>

            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 2.7rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: "8px 0 14px",
              }}
            >
              Inscrição Enviada com Sucesso!
            </h1>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "16px",
                lineHeight: 1.6,
                maxWidth: 600,
                margin: "0 auto 28px",
              }}
            >
              Recebemos os seus dados cadastrais e as informações do seu canal. Nossa equipe está revisando sua candidatura para garantir a máxima qualidade da nossa rede de parceiros.
            </p>

            {/* NOTICE BOX */}
            <div
              style={{
                padding: "16px 20px",
                borderRadius: "12px",
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                color: "#FCD34D",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                maxWidth: 580,
                margin: "0 auto 36px",
                textAlign: "left",
              }}
            >
              <ShieldCheck size={20} color="#F59E0B" style={{ flexShrink: 0 }} />
              <span>
                <strong>Acesso restrito:</strong> O acesso ao painel de afiliados é liberado exclusivamente após a aprovação manual. Você será avisado no WhatsApp assim que seu cadastro for aceito.
              </span>
            </div>

            {/* TIMELINE STEPS */}
            <div style={{ textAlign: "left", marginTop: "32px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "28px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "20px", textAlign: "center" }}>
                O que acontece agora?
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {/* Step 1 */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(124, 58, 237, 0.2)",
                      border: "1px solid rgba(124, 58, 237, 0.4)",
                      color: "#C4B5FD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    1
                  </div>
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 4px", color: "#FFFFFF" }}>
                      Moderação do seu Perfil (24 a 48 horas úteis)
                    </h4>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                      Nossos moderadores analisam o canal e as informações preenchidas para confirmar que estão alinhadas com as boas práticas do programa.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(16, 185, 129, 0.2)",
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                      color: "#6EE7B7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    2
                  </div>
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 4px", color: "#FFFFFF" }}>
                      Mensagem de Aprovação no WhatsApp com Link de Ativação
                    </h4>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                      Você receberá uma mensagem oficial no seu WhatsApp contendo o link exclusivo para criar a sua senha pessoal vinculada ao seu e-mail cadastrado.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(6, 182, 212, 0.2)",
                      border: "1px solid rgba(6, 182, 212, 0.4)",
                      color: "#67E8F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    3
                  </div>
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 4px", color: "#FFFFFF" }}>
                      Criação da Senha e Acesso Imediato ao Painel
                    </h4>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                      Após cadastrar sua senha, você poderá acessar o seu painel a qualquer momento usando seu e-mail e senha, copiar seu link exclusivo de divulgação e começar a faturar 25% de comissão via Pix.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div style={{ marginTop: "36px", display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
              <Link
                href="/"
                className="btn-primary"
                style={{ padding: "12px 28px", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}
              >
                Voltar para a Página Inicial <ArrowRight size={16} />
              </Link>

              <Link
                href="/afiliados/login"
                className="btn-secondary"
                style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}
              >
                Já foi aprovado? Fazer Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
