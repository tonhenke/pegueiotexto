import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Shield,
  Lock,
  Trash2,
  FileText,
  CheckCircle2,
  Mail,
  Scale,
  EyeOff,
  Server,
  UserCheck,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade | Peguei o Texto",
  description:
    "Entenda como o Peguei o Texto protege seus dados e garante sua privacidade. Política de retenção zero de mídia: áudios e vídeos são excluídos imediatamente após a transcrição. Em conformidade com a LGPD.",
  keywords: [
    "politica de privacidade peguei o texto",
    "privacidade transcricao ia",
    "lgpd transcricao de audio",
    "segurança de dados peguei o texto",
    "termos de privacidade",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/privacidade",
  },
  openGraph: {
    title: "Política de Privacidade | Peguei o Texto",
    description:
      "Compromisso de privacidade total e zero armazenamento de mídias. Seus áudios e vídeos são excluídos permanentemente após a transcrição.",
    url: "https://pegueiotexto.com.br/privacidade",
  },
};

export default function PrivacidadePage() {
  const lastUpdated = "19 de outubro de 2026";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <section style={{ paddingTop: "140px", paddingBottom: "100px", position: "relative" }}>
        {/* Ambient Glow */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "500px",
            height: "350px",
            background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(124,58,237,0.08) 50%, transparent 70%)",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: "860px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div
              className="badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                marginBottom: "20px",
                borderRadius: "9999px",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                fontSize: "13px",
                fontWeight: 600,
                color: "#34D399",
              }}
            >
              <Shield size={14} /> Privacidade e Proteção de Dados
            </div>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                marginBottom: "16px",
              }}
            >
              Política de <span className="text-gradient">Privacidade</span>
            </h1>

            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Última atualização: {lastUpdated} • Em conformidade com a LGPD (Lei nº 13.709/2018)
            </p>
          </div>

          {/* Quick Summary Card */}
          <div
            className="glass-card"
            style={{
              padding: "28px 32px",
              borderRadius: "20px",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              background: "linear-gradient(145deg, rgba(16,185,129,0.08), rgba(124,58,237,0.05))",
              marginBottom: "56px",
            }}
          >
            <h2
              style={{
                fontSize: "17px",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Lock size={18} color="#10B981" /> Resumo em 1 Minuto: Nossos Compromissos Centrais
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "3px" }} />
                <span style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--text-primary)" }}>Zero retenção de mídia:</strong> Seus áudios e vídeos são apagados automaticamente logo após a transcrição.
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "3px" }} />
                <span style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--text-primary)" }}>Sem treino de IA:</strong> Seus conteúdos privados jamais são usados para treinar modelos de inteligência artificial de terceiros.
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "3px" }} />
                <span style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--text-primary)" }}>Controle total:</strong> Você pode excluir seu histórico de transcrições ou sua conta inteira a qualquer momento.
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "3px" }} />
                <span style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--text-primary)" }}>Conexão segura:</strong> Tráfego criptografado com tecnologia HTTPS/TLS de ponta a ponta.
                </span>
              </div>
            </div>
          </div>

          {/* Policy Document Content */}
          <div
            style={{
              color: "var(--text-secondary)",
              fontSize: "15px",
              lineHeight: "1.8",
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            }}
          >
            {/* 1. INTRODUÇÃO */}
            <section>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Scale size={20} color="#7C3AED" /> 1. Informações Gerais e Controlador de Dados
              </h2>
              <p style={{ marginBottom: "12px" }}>
                Esta Política de Privacidade descreve de forma clara e transparente como a plataforma <strong>Peguei o Texto</strong> (disponível no endereço eletrônico <Link href="/" style={{ color: "#06B6D4", textDecoration: "none" }}>https://pegueiotexto.com.br</Link>) coleta, processa, utiliza e protege os dados dos seus usuários.
              </p>
              <p>
                Ao utilizar nossos serviços, você declara estar ciente dos termos aqui descritos, elaborados em estrita observância à Lei Geral de Proteção de Dados Pessoais do Brasil (<strong>LGPD — Lei nº 13.709/2018</strong>) e às normas internacionais de segurança da informação.
              </p>
            </section>

            {/* 2. DADOS COLETADOS */}
            <section>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <UserCheck size={20} color="#06B6D4" /> 2. Dados que Coletamos
              </h2>
              <p style={{ marginBottom: "14px" }}>
                Coletamos apenas as informações estritamente necessárias para a prestação do serviço contratado:
              </p>
              <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Dados de Cadastro e Autenticação:</strong> Quando você cria uma conta ou faz login com o Google (Single Sign-On / OAuth), recebemos seu nome, endereço de e-mail e identificador de usuário para gerenciar seu acesso e saldo de minutos.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Histórico de Transcrições de Texto:</strong> O texto final resultante da transcrição gerada pela IA fica disponível em seu painel pessoal (Dashboard) para consulta e download, podendo ser excluído por você a qualquer instante.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Dados de Transações e Pagamentos:</strong> Registros dos pacotes de minutos adquiridos, data e status do pagamento. Não armazenamos números de cartão de crédito em nossos servidores; todos os pagamentos são processados por gateways homologados e seguros.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Dados de Navegação (Analytics):</strong> Informações técnicas anônimas (como tipo de navegador, páginas acessadas e tempo de resposta) coletadas via Google Analytics para aprimoramento de performance e correção de erros.
                </li>
              </ul>
            </section>

            {/* 3. POLÍTICA DE RETENÇÃO ZERO */}
            <section
              style={{
                background: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                padding: "28px",
                borderRadius: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#F87171",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Trash2 size={20} /> 3. O que NÃO Armazenamos (Política de Mídia Efêmera)
              </h2>
              <p style={{ marginBottom: "12px", color: "var(--text-primary)" }}>
                <strong>Sua mídia não é guardada.</strong> Temos uma política rígida de deleção imediata para garantir total sigilo:
              </p>
              <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li>
                  <strong>Arquivos de upload direto (MP3, MP4, WAV, M4A, etc.):</strong> São enviados para um ambiente de processamento temporário isolado. Concluída a transcrição, o arquivo original é <strong>deletado permanentemente</strong> do servidor.
                </li>
                <li>
                  <strong>Vídeos de links públicos (YouTube, Instagram, TikTok, etc.):</strong> Apenas o fluxo de áudio estritamente necessário é extraído em tempo real para alimentação da inteligência artificial. Nenhum vídeo completo é armazenado.
                </li>
                <li>
                  <strong>Sem uso para treino de modelos:</strong> Não utilizamos os arquivos nem os textos das suas transcrições para alimentar ou treinar modelos públicos de IA generativa.
                </li>
              </ul>
            </section>

            {/* 4. FINALIDADE */}
            <section>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FileText size={20} color="#7C3AED" /> 4. Finalidade do Tratamento de Dados
              </h2>
              <p style={{ marginBottom: "12px" }}>
                Os dados pessoais coletados possuem propósitos específicos, fundamentados nas bases legais da LGPD (Art. 7º, I, II e V):
              </p>
              <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li>Executar os serviços de conversão de áudio/vídeo em texto solicitados pelo usuário;</li>
                <li>Manter e autenticar a sessão do usuário em sua conta;</li>
                <li>Controlar o saldo e consumo de créditos de minutos adquiridos;</li>
                <li>Prestar suporte técnico, esclarecer dúvidas e atender solicitações;</li>
                <li>Prevenir fraudes e garantir a integridade da plataforma.</li>
              </ul>
            </section>

            {/* 5. COMPARTILHAMENTO COM TERCEIROS */}
            <section>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Server size={20} color="#06B6D4" /> 5. Compartilhamento de Dados com Terceiros
              </h2>
              <p style={{ marginBottom: "12px" }}>
                Não comercializamos, alugamos ou compartilhamos dados pessoais com anunciantes. O compartilhamento ocorre única e exclusivamente com prestadores de infraestrutura imprescindíveis à entrega da ferramenta:
              </p>
              <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Supabase:</strong> Fornecedor de banco de dados em nuvem criptografado e infraestrutura de autenticação segura.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Google (OAuth & Analytics):</strong> Para autenticação facilitada via Google SSO e medição anônima de tráfego web.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Processadores de Pagamento Homologados:</strong> Intermediários de pagamento seguro para cobrança e liberação automática de créditos.
                </li>
              </ul>
            </section>

            {/* 6. DIREITOS DO TITULAR (LGPD) */}
            <section>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Shield size={20} color="#10B981" /> 6. Seus Direitos como Titular de Dados (LGPD)
              </h2>
              <p style={{ marginBottom: "14px" }}>
                De acordo com o Artigo 18 da LGPD, você possui os seguintes direitos garantidos e pode exercê-los a qualquer momento:
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "14px",
                }}
              >
                {[
                  { t: "Confirmação e Acesso", d: "Saber quais dados mantemos sobre você em nossos cadastros." },
                  { t: "Correção de Dados", d: "Solicitar alteração de dados incompletos ou desatualizados." },
                  { t: "Exclusão Definitiva", d: "Pedir a exclusão irreversível da sua conta e de todos os históricos." },
                  { t: "Revogação de Acesso", d: "Desconectar o login social do Google a qualquer instante." },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "14px", marginBottom: "4px" }}>
                      {item.t}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                      {item.d}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. SEGURANÇA */}
            <section>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Lock size={20} color="#EC4899" /> 7. Medidas de Segurança da Informação
              </h2>
              <p>
                Adotamos práticas alinhadas aos mais altos padrões de segurança, incluindo criptografia em trânsito (HTTPS/TLS com certificados de segurança modernos), controle rigoroso de privilégios de acesso aos bancos de dados por Row Level Security (RLS) e processos automatizados para sanitização e limpeza periódica de caches de arquivos temporários.
              </p>
            </section>

            {/* 8. CONTATO / DPO */}
            <section
              style={{
                padding: "32px",
                borderRadius: "20px",
                background: "linear-gradient(145deg, rgba(124,58,237,0.1), rgba(6,182,212,0.08))",
                border: "1px solid rgba(124, 58, 237, 0.3)",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Mail size={20} color="#06B6D4" /> 8. Contato e Encarregado pelo Tratamento de Dados
              </h2>
              <p style={{ marginBottom: "16px" }}>
                Para solicitar a exclusão de dados, exercer quaisquer dos direitos previstos na LGPD ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato diretamente com o nosso canal oficial de privacidade:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "15px" }}>
                <div>
                  <strong style={{ color: "var(--text-primary)" }}>E-mail de Contato e Suporte:</strong>{" "}
                  <a
                    href="mailto:pegueiotexto@gmail.com"
                    style={{ color: "#06B6D4", textDecoration: "none", fontWeight: 600 }}
                  >
                    pegueiotexto@gmail.com
                  </a>
                </div>
                <div>
                  <strong style={{ color: "var(--text-primary)" }}>Website:</strong>{" "}
                  <Link href="/" style={{ color: "#06B6D4", textDecoration: "none" }}>
                    https://pegueiotexto.com.br
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
