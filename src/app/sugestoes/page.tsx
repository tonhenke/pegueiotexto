"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import {
  Sparkles,
  Layout,
  Mic,
  Bot,
  Bug,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Send,
  User,
  Mail,
  HelpCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
  badge: string;
  icon: any;
  description: string;
  color: string;
  border: string;
  bg: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: "ux",
    name: "UX & Interface",
    badge: "Design & Navegação",
    icon: Layout,
    description: "Layout, facilidade de uso, botões, modo escuro e visual da plataforma.",
    color: "#818CF8",
    border: "rgba(129, 140, 248, 0.35)",
    bg: "rgba(129, 140, 248, 0.08)",
  },
  {
    id: "transcription",
    name: "Transcrição & Áudio",
    badge: "Player & Upload",
    icon: Mic,
    description: "Velocidade de processamento, novos formatos (WAV, M4A), player e legendas (.SRT).",
    color: "#34D399",
    border: "rgba(52, 211, 153, 0.35)",
    bg: "rgba(52, 211, 153, 0.08)",
  },
  {
    id: "ai",
    name: "Inteligência Artificial",
    badge: "Precisão do Modelo",
    icon: Bot,
    description: "Qualidade do texto transcrito, pontuação, detecção de vozes/falantes e resumos.",
    color: "#C084FC",
    border: "rgba(192, 132, 252, 0.35)",
    bg: "rgba(192, 132, 252, 0.08)",
  },
  {
    id: "bugs",
    name: "Bugs & Problemas",
    badge: "Correção Técnica",
    icon: Bug,
    description: "Telas travando, erros de download, falhas em arquivos específicos ou links.",
    color: "#F87171",
    border: "rgba(248, 113, 113, 0.35)",
    bg: "rgba(248, 113, 113, 0.08)",
  },
  {
    id: "features",
    name: "Nova Funcionalidade",
    badge: "Inovação",
    icon: Lightbulb,
    description: "Ideias de novos recursos, ferramentas que você sente falta ou integrações externas.",
    color: "#FBBF24",
    border: "rgba(251, 191, 36, 0.35)",
    bg: "rgba(251, 191, 36, 0.08)",
  },
];

export default function SugestoesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("features");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  // Check logged-in user to auto-populate
  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setIsLoggedIn(true);
          setUserId(data.user.id);
          if (data.user.email) setUserEmail(data.user.email);
          const metaName = data.user.user_metadata?.full_name || data.user.user_metadata?.name;
          if (metaName) setUserName(metaName);
        }
      });
    } catch (e) {
      console.warn("Auth check error:", e);
    }
  }, []);

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[4];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (title.trim().length < 4) {
      setErrorMsg("O título precisa ter pelo menos 4 caracteres.");
      return;
    }

    if (description.trim().length < 15) {
      setErrorMsg("Por favor, descreva sua sugestão ou problema com pelo menos 15 caracteres para entendermos bem.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          category_label: activeCategoryObj.name,
          title: title.trim(),
          description: description.trim(),
          user_email: userEmail.trim() || undefined,
          user_name: userName.trim() || undefined,
          user_id: userId || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao registrar sugestão.");
      }

      setSubmittedData({
        category: activeCategoryObj.name,
        title: title.trim(),
        userEmail: userEmail.trim(),
      });
      setIsSuccess(true);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu uma falha ao enviar. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setSubmittedData(null);
    setErrorMsg(null);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0b0a16", color: "#ffffff" }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="container" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px" }}>
          
          {/* Top Hero Section */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(124, 58, 237, 0.12)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              borderRadius: "100px",
              padding: "6px 16px",
              marginBottom: "16px",
              fontSize: "13px",
              color: "#A78BFA",
              fontWeight: 600
            }}>
              <Sparkles size={14} />
              <span>Construído com a Comunidade</span>
            </div>

            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 2.85rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              marginBottom: "16px"
            }}>
              Envie sua <span style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Sugestão ou Melhoria</span>
            </h1>

            <p style={{
              fontSize: "16px",
              color: "#94a3b8",
              maxWidth: "640px",
              margin: "0 auto",
              lineHeight: 1.6
            }}>
              Queremos que o <strong>Peguei o Texto</strong> seja a melhor ferramenta do seu dia a dia.
              Compartilhe suas ideias, aponte melhorias ou relate problemas para nossa equipe atuar diretamente.
            </p>
          </div>

          {/* Success Screen Card */}
          {isSuccess ? (
            <div style={{
              background: "rgba(21, 19, 41, 0.75)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              borderRadius: "24px",
              padding: "48px 32px",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              backdropFilter: "blur(16px)",
              animation: "fadeIn 0.3s ease-in-out"
            }}>
              <div style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "rgba(52, 211, 153, 0.15)",
                border: "2px solid #34D399",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto"
              }}>
                <CheckCircle2 size={38} color="#34D399" />
              </div>

              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "12px", color: "#ffffff" }}>
                Sugestão Enviada com Sucesso! 🎉
              </h2>

              <p style={{ fontSize: "15px", color: "#cbd5e1", maxWidth: "540px", margin: "0 auto 24px auto", lineHeight: 1.6 }}>
                Muito obrigado por ajudar a construir um produto melhor! Encaminhamos uma cópia completa da sua mensagem para a nossa equipe de desenvolvimento em <strong>feedbacks@pegueiotexto.com.br</strong>.
              </p>

              {submittedData && (
                <div style={{
                  background: "rgba(11, 10, 22, 0.6)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  padding: "18px 24px",
                  maxWidth: "520px",
                  margin: "0 auto 32px auto",
                  textAlign: "left"
                }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    Categoria: <span style={{ color: "#34D399", fontWeight: 700 }}>{submittedData.category}</span>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>
                    &ldquo;{submittedData.title}&rdquo;
                  </div>
                  {submittedData.userEmail && (
                    <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "8px" }}>
                      ✉️ Notificação enviada para: <strong style={{ color: "#ffffff" }}>{submittedData.userEmail}</strong>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
                <button
                  onClick={handleResetForm}
                  className="btn-outline"
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    cursor: "pointer",
                    background: "transparent",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.2)"
                  }}
                >
                  Enviar outra sugestão
                </button>

                <Link
                  href="/dashboard"
                  className="btn-primary"
                  style={{
                    padding: "12px 28px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span>Ir para o Dashboard</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            /* Main Form Card */
            <div style={{
              background: "rgba(21, 19, 41, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              padding: "36px 32px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
              backdropFilter: "blur(16px)"
            }}>
              
              {/* Step 1: Category Selection */}
              <div style={{ marginBottom: "28px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#cbd5e1", marginBottom: "12px" }}>
                  1. Em qual área está a sua sugestão?
                </label>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "10px"
                }}>
                  {CATEGORIES.map((cat) => {
                    const IconComponent = cat.icon;
                    const isSelected = selectedCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                          background: isSelected ? cat.bg : "rgba(255,255,255,0.03)",
                          border: isSelected ? `2px solid ${cat.color}` : "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "14px",
                          padding: "14px 12px",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                          position: "relative",
                          outline: "none"
                        }}
                      >
                        <div style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: isSelected ? cat.color : "rgba(255,255,255,0.06)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isSelected ? "#0b0a16" : cat.color,
                          transition: "all 0.2s ease"
                        }}>
                          <IconComponent size={20} />
                        </div>
                        <span style={{
                          fontSize: "13px",
                          fontWeight: isSelected ? 800 : 600,
                          color: isSelected ? "#ffffff" : "#cbd5e1"
                        }}>
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Category Description Note */}
                <div style={{
                  marginTop: "12px",
                  fontSize: "13px",
                  color: "#94a3b8",
                  background: "rgba(11, 10, 22, 0.4)",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  borderLeft: `3px solid ${activeCategoryObj.color}`
                }}>
                  <strong style={{ color: activeCategoryObj.color }}>{activeCategoryObj.name}:</strong> {activeCategoryObj.description}
                </div>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                
                {/* Title Input */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label htmlFor="suggestion-title" style={{ fontSize: "14px", fontWeight: 700, color: "#cbd5e1" }}>
                      2. Título da sugestão <span style={{ color: "#F87171" }}>*</span>
                    </label>
                    <span style={{ fontSize: "12px", color: title.length > 100 ? "#F87171" : "#64748b" }}>
                      {title.length}/120
                    </span>
                  </div>

                  <input
                    id="suggestion-title"
                    type="text"
                    maxLength={120}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Permitir pausar e continuar o áudio com a tecla Espaço"
                    required
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: "rgba(11, 10, 22, 0.8)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "15px",
                      outline: "none",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = activeCategoryObj.color)}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                </div>

                {/* Description Textarea */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label htmlFor="suggestion-description" style={{ fontSize: "14px", fontWeight: 700, color: "#cbd5e1" }}>
                      3. Descreva com detalhes o que gostaria de ver ou corrigir <span style={{ color: "#F87171" }}>*</span>
                    </label>
                    <span style={{ fontSize: "12px", color: description.length > 1500 ? "#F87171" : "#64748b" }}>
                      {description.length}/2000
                    </span>
                  </div>

                  <textarea
                    id="suggestion-description"
                    rows={5}
                    maxLength={2000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explique o contexto, como essa melhoria ajudaria na sua rotina ou, em caso de bug, o que aconteceu e como reproduzir o problema..."
                    required
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: "rgba(11, 10, 22, 0.8)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      outline: "none",
                      resize: "vertical",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = activeCategoryObj.color)}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                </div>

                {/* User Identity / Email section */}
                <div style={{
                  background: "rgba(11, 10, 22, 0.5)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#cbd5e1", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Mail size={15} color="#A78BFA" />
                      <span>E-mail para resposta (opcional, mas recomendado)</span>
                    </span>

                    {isLoggedIn && (
                      <span style={{
                        fontSize: "11px",
                        background: "rgba(52, 211, 153, 0.15)",
                        color: "#34D399",
                        padding: "3px 10px",
                        borderRadius: "100px",
                        fontWeight: 700
                      }}>
                        ✓ Logado na conta
                      </span>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                    <div>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="seu-email@exemplo.com"
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          background: "rgba(11, 10, 22, 0.9)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "10px",
                          color: "#ffffff",
                          fontSize: "14px",
                          outline: "none"
                        }}
                      />
                      <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", display: "block" }}>
                        Usado apenas para avisar quando sua ideia for implementada.
                      </span>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Seu nome ou como quer ser chamado"
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          background: "rgba(11, 10, 22, 0.9)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "10px",
                          color: "#ffffff",
                          fontSize: "14px",
                          outline: "none"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    color: "#FCA5A5",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    fontSize: "14px"
                  }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                {/* Submit Button */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", paddingTop: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b" }}>
                    <ShieldCheck size={14} color="#34D399" />
                    <span>Enviado com segurança para feedbacks@pegueiotexto.com.br</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{
                      padding: "14px 32px",
                      borderRadius: "12px",
                      fontSize: "15px",
                      fontWeight: 700,
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.7 : 1,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      border: "none"
                    }}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid #ffffff",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite"
                        }} />
                        <span>Enviando sugestão...</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar Sugestão</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Value Props & How it Works Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginTop: "60px"
          }}>
            <div style={{
              background: "rgba(21, 19, 41, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "16px",
              padding: "24px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(124, 58, 237, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "14px"
              }}>
                <Zap size={20} color="#A78BFA" />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", color: "#ffffff" }}>
                Priorização Real
              </h3>
              <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
                Nossa equipe analisa cada sugestão individualmente para planejar os próximos lançamentos da plataforma.
              </p>
            </div>

            <div style={{
              background: "rgba(21, 19, 41, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "16px",
              padding: "24px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(52, 211, 153, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "14px"
              }}>
                <Bot size={20} color="#34D399" />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", color: "#ffffff" }}>
                IA em Constante Evolução
              </h3>
              <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
                Se você encontrou sotaques ou termos técnicos que a transcrição teve dificuldade, nos avise para aprimorarmos o vocabulário.
              </p>
            </div>

            <div style={{
              background: "rgba(21, 19, 41, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "16px",
              padding: "24px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(251, 191, 36, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "14px"
              }}>
                <HelpCircle size={20} color="#FBBF24" />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", color: "#ffffff" }}>
                Canal Direto
              </h3>
              <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
                As mensagens chegam diretamente na caixa da liderança de produto no e-mail feedbacks@pegueiotexto.com.br.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
