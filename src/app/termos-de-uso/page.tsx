import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso | Peguei o Texto",
  description:
    "Termos e Condições Gerais de Uso da plataforma Peguei o Texto. Leia os direitos, deveres e regras para utilização dos serviços de transcrição de áudio e vídeo com inteligência artificial.",
  alternates: {
    canonical: "https://pegueiotexto.com.br/termos-de-uso",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermosDeUsoPage() {
  const lastUpdated = "19 de outubro de 2026";

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        color: "#111827",
        minHeight: "100vh",
        padding: "48px 20px 80px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        lineHeight: 1.7,
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "48px 40px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Header de documento */}
        <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "24px", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Documento Oficial • Termos e Condições de Uso
            </span>
            <Link
              href="/"
              style={{
                fontSize: "13px",
                color: "#4f46e5",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              ← Voltar para o site
            </Link>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>
            Termos de Uso da Plataforma Peguei o Texto
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
            Última atualização: {lastUpdated} • Versão 1.0
          </p>
        </div>

        {/* Corpo do Documento */}
        <div style={{ fontSize: "15px", color: "#374151" }}>
          <p style={{ marginBottom: "20px" }}>
            Bem-vindo ao <strong>Peguei o Texto</strong> (acessível pelo endereço eletrônico{" "}
            <a href="https://pegueiotexto.com.br" style={{ color: "#4f46e5", textDecoration: "underline" }}>
              https://pegueiotexto.com.br
            </a>
            ). Este documento estabelece os Termos e Condições de Uso que regem a utilização da nossa plataforma de transcrição automatizada de áudios e vídeos por meio de inteligência artificial.
          </p>

          <p style={{ marginBottom: "24px", padding: "12px 16px", backgroundColor: "#f3f4f6", borderRadius: "6px", borderLeft: "4px solid #4f46e5" }}>
            <strong>Atenção:</strong> Ao acessar, cadastrar-se ou utilizar qualquer funcionalidade do Peguei o Texto, você declara ter lido, compreendido e concordado integralmente com estes Termos de Uso e com a nossa{" "}
            <Link href="/privacidade" target="_blank" style={{ color: "#4f46e5", textDecoration: "underline" }}>
              Política de Privacidade
            </Link>
            . Caso discorde de qualquer disposição, solicitamos que não utilize a plataforma.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            1. Definições
          </h2>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>Plataforma / Serviço:</strong> O website e as ferramentas tecnológicas disponibilizadas sob o domínio pegueiotexto.com.br.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Usuário:</strong> Qualquer pessoa física ou jurídica que acessa ou utiliza os serviços da plataforma, seja na modalidade gratuita ou paga.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Mídia / Conteúdo de Entrada:</strong> Arquivos de áudio ou vídeo carregados via upload direto ou referenciados por links de plataformas públicas de terceiros (como YouTube, Instagram Reels, TikTok, entre outros).
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Transcrição:</strong> O texto escrito resultante do processamento fonético da mídia pela tecnologia de inteligência artificial.
            </li>
          </ul>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            2. Descrição dos Serviços
          </h2>
          <p style={{ marginBottom: "12px" }}>
            O Peguei o Texto é uma ferramenta de produtividade digital que converte mídias em áudio e vídeo para texto com o auxílio de modelos avançados de fala para texto (Speech-to-Text).
          </p>
          <p style={{ marginBottom: "20px" }}>
            O usuário pode obter a transcrição em formatos como texto simples (.TXT), legendas temporizadas (.SRT) ou documento formatado (.DOCX), respeitadas as condições de limites de minutos da conta.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            3. Cadastro e Segurança da Conta
          </h2>
          <p style={{ marginBottom: "12px" }}>
            Para usufruir de créditos adicionais e histórico de transcrições, o usuário deverá criar uma conta através de seu e-mail ou autenticação social com o Google (OAuth/SSO).
          </p>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li style={{ marginBottom: "8px" }}>O usuário é o único responsável pela veracidade dos dados informados no cadastro.</li>
            <li style={{ marginBottom: "8px" }}>A conta é pessoal e intransferível, cabendo ao usuário a guarda segura de suas credenciais de acesso.</li>
            <li style={{ marginBottom: "8px" }}>O Peguei o Texto não se responsabiliza por acessos não autorizados decorrentes de negligência do usuário quanto à segurança de suas senhas ou contas vinculadas.</li>
          </ul>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            4. Responsabilidade e Direitos sobre os Conteúdos Enviados
          </h2>
          <p style={{ marginBottom: "12px" }}>
            Ao submeter qualquer arquivo ou link para transcrição, o usuário declara e garante que:
          </p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li style={{ marginBottom: "8px" }}>
              Possui os direitos autorais, licença ou autorização legal necessária para transcrever a referida mídia;
            </li>
            <li style={{ marginBottom: "8px" }}>
              O conteúdo não viola direitos de terceiros, incluindo propriedade intelectual, privacidade, honra e imagem;
            </li>
            <li style={{ marginBottom: "8px" }}>
              O conteúdo não possui finalidade ilícita, não promove discursos de ódio, discriminação, exploração de vulneráveis, ameaças ou qualquer conduta tipificada como crime pela legislação brasileira.
            </li>
          </ul>
          <p style={{ marginBottom: "20px" }}>
            O Peguei o Texto atua estritamente como provedor de ferramenta técnica automatizada e não realiza moderação prévia de conteúdo nem assume qualquer responsabilidade cível ou criminal pelo teor dos áudios submetidos por seus usuários.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            5. Política de Privacidade e Descarte de Mídia
          </h2>
          <p style={{ marginBottom: "12px" }}>
            A privacidade do usuário é compromisso central da plataforma:
          </p>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>Deleção Imediata:</strong> Arquivos de áudio ou vídeo processados são temporários e são excluídos automaticamente e de forma definitiva dos nossos servidores após a conclusão da transcrição.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Não utilização para treinamento:</strong> Suas mídias e conteúdos privados não são utilizados para treinar modelos públicos de inteligência artificial de terceiros.
            </li>
            <li style={{ marginBottom: "8px" }}>
              Para informações detalhadas sobre tratamento de dados e cumprimento da LGPD, consulte nossa{" "}
              <Link href="/privacidade" target="_blank" style={{ color: "#4f46e5", textDecoration: "underline" }}>
                Política de Privacidade
              </Link>
              .
            </li>
          </ul>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            6. Planos, Créditos e Pagamentos
          </h2>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>Créditos Promocionais Gratuitos:</strong> Novos usuários recebem minutos gratuitos de cortesia no momento do cadastro para degustação da ferramenta, limitados a uma conta por usuário.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Pacotes de Minutos:</strong> A compra de minutos adicionais confere o direito de processar mídias equivalentes à duração adquirida. Os minutos são deduzidos proporcionalmente ao tempo real da mídia processada.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Validade dos Créditos:</strong> Salvo especificação contrária na oferta de compra, os créditos adquiridos possuem validade de 6 a 12 meses a contar da data de confirmação do pagamento.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Processamento de Pagamento:</strong> As transações são intermediadas por processadores e instituições financeiras seguras. O Peguei o Texto não retém dados de cartão de crédito.
            </li>
          </ul>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            7. Limitação de Responsabilidade e Precisão da IA
          </h2>
          <p style={{ marginBottom: "12px" }}>
            Nossos modelos de inteligência artificial utilizam tecnologia de ponta com índice de precisão aproximado de 98% em gravações nítidas em português. Contudo, o usuário reconhece que:
          </p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li style={{ marginBottom: "8px" }}>
              A acurácia do texto pode variar conforme ruídos de fundo, qualidade da captação do microfone, eco, sobreposição de vozes ou termos técnicos excessivamente específicos;
            </li>
            <li style={{ marginBottom: "8px" }}>
              O serviço é fornecido "no estado em que se encontra" ("as is"), cabendo ao usuário revisar e validar o texto transcrito antes de utilizá-lo para finalidades críticas, legais ou editoriais;
            </li>
            <li style={{ marginBottom: "8px" }}>
              A plataforma não se responsabiliza por prejuízos decorrentes de instabilidades momentâneas de rede ou indisponibilidade de serviços de terceiros (como YouTube ou servidores de hospedagem).
            </li>
          </ul>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            8. Propriedade Intelectual
          </h2>
          <p style={{ marginBottom: "12px" }}>
            A marca "Peguei o Texto", os logotipos, o design da interface, códigos-fonte e sistemas são de propriedade exclusiva dos seus desenvolvedores e encontram-se protegidos pelas leis de propriedade intelectual e direitos autorais.
          </p>
          <p style={{ marginBottom: "20px" }}>
            O texto resultante da transcrição pertence integralmente ao usuário que submeteu o conteúdo, dentro dos limites do conteúdo original.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            9. Encerramento e Suspensão de Contas
          </h2>
          <p style={{ marginBottom: "20px" }}>
            Reservamo-nos o direito de suspender ou cancelar imediatamente o acesso de qualquer usuário que viole estes Termos, utilize meios automatizados abusivos (como ataques DDoS ou web scraping excessivo) ou utilize a plataforma para propósitos ilegais.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            10. Alterações nestes Termos
          </h2>
          <p style={{ marginBottom: "20px" }}>
            Podemos atualizar estes Termos periodicamente para refletir evoluções da plataforma ou exigências legais. A data da última revisão sempre constará no topo desta página. O uso continuado após alterações implica na aceitação dos novos termos.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            11. Legislação Aplicável e Foro
          </h2>
          <p style={{ marginBottom: "20px" }}>
            Estes Termos de Uso são regidos e interpretados em conformidade com as Leis da República Federativa do Brasil, em especial o Marco Civil da Internet (Lei nº 12.965/2014) e a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Fica eleito o foro do domicílio do usuário para dirimir eventuais litígios oriundos deste instrumento.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            12. Contato
          </h2>
          <p style={{ marginBottom: "8px" }}>
            Para dúvidas, notificações ou esclarecimentos a respeito destes Termos de Uso, entre em contato através do nosso canal oficial:
          </p>
          <p style={{ margin: 0, fontWeight: 600 }}>
            E-mail:{" "}
            <a href="mailto:pegueiotexto@gmail.com" style={{ color: "#4f46e5", textDecoration: "none" }}>
              pegueiotexto@gmail.com
            </a>
          </p>
        </div>

        {/* Rodapé do Documento */}
        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #e5e7eb", textAlign: "center", fontSize: "13px", color: "#9ca3af" }}>
          © {new Date().getFullYear()} Peguei o Texto • Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
