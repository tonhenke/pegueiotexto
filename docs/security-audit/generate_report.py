import os
import sys
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent.parent
OUTPUT_PDF = BASE_DIR / "relatorio-auditoria-seguranca.pdf"
ASSETS_DIR = BASE_DIR / "assets"
ASSETS_DIR.mkdir(parents=True, exist_ok=True)

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    KeepTogether,
    PageBreak,
    HRFlowable,
)
from reportlab.pdfgen import canvas

# Palette constants
COLOR_CRITICA = "#B91C1C"
COLOR_ALTA = "#EA580C"
COLOR_MEDIA = "#D97706"
COLOR_BAIXA = "#2563EB"
COLOR_FORTE = "#059669"
COLOR_DARK = "#0F172A"
COLOR_MUTED = "#64748B"
COLOR_BG_LIGHT = "#F8FAFC"
COLOR_BORDER = "#E2E8F0"

def generate_charts():
    # 1. Donut chart of severity
    labels = ["Crítica (4)", "Alta (8)", "Média (3)", "Baixa (1)"]
    sizes = [4, 8, 3, 1]
    chart_colors = [COLOR_CRITICA, COLOR_ALTA, COLOR_MEDIA, COLOR_BAIXA]

    fig, ax = plt.subplots(figsize=(4.5, 3.2), dpi=200)
    wedges, texts, autotexts = ax.pie(
        sizes,
        labels=labels,
        colors=chart_colors,
        autopct="%1.0f%%",
        startangle=140,
        pctdistance=0.75,
        wedgeprops=dict(width=0.45, edgecolor="white", linewidth=2),
        textprops=dict(fontsize=8.5, color=COLOR_DARK, weight="bold")
    )
    for autotext in autotexts:
        autotext.set_color("white")
        autotext.set_fontsize(8.5)
        autotext.set_weight("bold")

    ax.set_title("Distribuição por Severidade", fontsize=11, fontweight="bold", pad=12, color=COLOR_DARK)
    plt.tight_layout()
    chart1_path = ASSETS_DIR / "chart_severity.png"
    plt.savefig(chart1_path, dpi=200, transparent=True)
    plt.close()

    # 2. Horizontal Bar Chart of Categories
    categories = [
        "Inputs sem Tratamento (XSS)",
        "Banco sem Tranca (RLS)",
        "Permissão no Navegador",
        "IDOR (Acesso Direto)",
        "Chaves Expostas (Hardcode)",
    ]
    counts = [2, 3, 3, 4, 4]
    bar_colors = [COLOR_MEDIA, COLOR_ALTA, COLOR_CRITICA, COLOR_CRITICA, COLOR_CRITICA]

    fig, ax = plt.subplots(figsize=(5.5, 3.2), dpi=200)
    bars = ax.barh(categories, counts, color=bar_colors, height=0.6, edgecolor="none")
    ax.set_xlim(0, 5)
    ax.set_xticks(range(0, 6))
    ax.set_xlabel("Número de Achados", fontsize=8.5, color=COLOR_MUTED, fontweight="bold")
    ax.set_title("Achados por Categoria Auditada", fontsize=11, fontweight="bold", pad=12, color=COLOR_DARK)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color("#CBD5E1")
    ax.spines["bottom"].set_color("#CBD5E1")
    ax.tick_params(axis="both", labelsize=8, colors=COLOR_DARK)

    for bar in bars:
        w = bar.get_width()
        ax.text(w + 0.12, bar.get_y() + bar.get_height() / 2, f"{int(w)}",
                ha="left", va="center", fontsize=8.5, fontweight="bold", color=COLOR_DARK)

    plt.tight_layout()
    chart2_path = ASSETS_DIR / "chart_categories.png"
    plt.savefig(chart2_path, dpi=200, transparent=True)
    plt.close()

    return chart1_path, chart2_path

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Skip header and footer on cover page
            return
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor(COLOR_MUTED))

        # Top Header
        self.drawString(56, A4[1] - 36, "Relatório de Auditoria de Segurança — Peguei o Texto")
        self.drawRightString(A4[0] - 56, A4[1] - 36, "CONFIDENCIAL")
        self.setStrokeColor(colors.HexColor(COLOR_BORDER))
        self.setLineWidth(0.6)
        self.line(56, A4[1] - 42, A4[0] - 56, A4[1] - 42)

        # Bottom Footer
        self.line(56, 45, A4[0] - 56, 45)
        self.drawString(56, 32, "docs/security-audit/relatorio-auditoria-seguranca.pdf")
        page_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(A4[0] - 56, 32, page_text)
        self.restoreState()

def build_pdf():
    chart1, chart2 = generate_charts()

    # Document setup: A4 with ~2cm margins (56 pt ~ 1.98 cm)
    doc = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "CoverTitle",
        fontName="Helvetica-Bold",
        fontSize=26,
        leading=32,
        textColor=colors.HexColor(COLOR_DARK),
        alignment=0,
    )
    subtitle_style = ParagraphStyle(
        "CoverSubtitle",
        fontName="Helvetica",
        fontSize=12,
        leading=17,
        textColor=colors.HexColor(COLOR_MUTED),
        alignment=0,
    )
    h1_style = ParagraphStyle(
        "Heading1_Custom",
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=21,
        textColor=colors.HexColor(COLOR_DARK),
        spaceBefore=14,
        spaceAfter=8,
    )
    h2_style = ParagraphStyle(
        "Heading2_Custom",
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor(COLOR_DARK),
        spaceBefore=10,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "Body_Custom",
        fontName="Helvetica",
        fontSize=9.2,
        leading=13.5,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=6,
    )
    body_bold = ParagraphStyle(
        "Body_Bold",
        fontName="Helvetica-Bold",
        fontSize=9.2,
        leading=13.5,
        textColor=colors.HexColor(COLOR_DARK),
    )
    code_style = ParagraphStyle(
        "Code_Custom",
        fontName="Courier",
        fontSize=7.8,
        leading=10.5,
        textColor=colors.HexColor("#0F172A"),
    )
    chip_critica = ParagraphStyle(
        "ChipCritica",
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=9,
        textColor=colors.white,
        alignment=1,
    )
    chip_alta = ParagraphStyle(
        "ChipAlta",
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=9,
        textColor=colors.white,
        alignment=1,
    )
    chip_media = ParagraphStyle(
        "ChipMedia",
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=9,
        textColor=colors.white,
        alignment=1,
    )
    chip_baixa = ParagraphStyle(
        "ChipBaixa",
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=9,
        textColor=colors.white,
        alignment=1,
    )

    story = []

    # =========================================================================
    # CAPA
    # =========================================================================
    story.append(Spacer(1, 20))
    # Brand badge
    story.append(Paragraph(
        "<font color='#7C3AED'><b>PEGUEI O TEXTO</b></font> &nbsp;|&nbsp; AUDITORIA INTERNA DE CÓDIGO",
        subtitle_style
    ))
    story.append(Spacer(1, 15))
    story.append(Paragraph("Relatório de Auditoria de Segurança", title_style))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Análise Abrangente de Vulnerabilidades de Código-Fonte, Arquitetura e Controle de Acesso",
        subtitle_style
    ))
    story.append(Spacer(1, 18))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#7C3AED"), spaceAfter=18))

    # Metadata card table
    meta_data = [
        [
            Paragraph("<b>Projeto Auditado:</b>", body_style),
            Paragraph("Peguei o Texto (pegueiotexto.com.br)", body_style),
            Paragraph("<b>Data da Análise:</b>", body_style),
            Paragraph("09 de Novembro de 2026", body_style),
        ],
        [
            Paragraph("<b>Escopo Auditado:</b>", body_style),
            Paragraph("Código Frontend (Next.js), Backend (FastAPI), Supabase e Stores JSON", body_style),
            Paragraph("<b>Classificação:</b>", body_style),
            Paragraph("<font color='#B91C1C'><b>CONFIDENCIAL / RESTRITO</b></font>", body_style),
        ],
        [
            Paragraph("<b>Linguagens:</b>", body_style),
            Paragraph("TypeScript, Python, SQL", body_style),
            Paragraph("<b>Versão da Análise:</b>", body_style),
            Paragraph("1.0 — Auditoria Defensiva OWASP Top 10", body_style),
        ]
    ]
    meta_table = Table(meta_data, colWidths=[105, 170, 95, 115])
    meta_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(COLOR_BG_LIGHT)),
        ("PADDING", (0, 0), (-1, -1), 6),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor(COLOR_BORDER)),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#F1F5F9")),
    ]))
    story.append(meta_table)

    story.append(Spacer(1, 16))
    story.append(Paragraph("<b>Nota Metodológica & Detecção de Stack</b>", h2_style))
    story.append(Paragraph(
        "A auditoria realizou uma varredura estrita e sistemática, arquivo por arquivo e linha por linha, "
        "sem especulação. A stack técnica detectada orientou o mapeamento exato de cada uma das 5 categorias:",
        body_style
    ))

    stack_data = [
        [
            Paragraph("<b>Camada</b>", body_bold),
            Paragraph("<b>Tecnologias Identificadas</b>", body_bold),
            Paragraph("<b>Mapeamento de Riscos de Segurança</b>", body_bold)
        ],
        [
            Paragraph("<b>Frontend & BFF</b>", body_style),
            Paragraph("Next.js 16 (Turbopack, App Router), React 19, Tailwind CSS", body_style),
            Paragraph("Validação de privilégios de rotas no servidor, proteção contra XSS e integridade de sessões.", body_style)
        ],
        [
            Paragraph("<b>API Backend</b>", body_style),
            Paragraph("Python 3.11, FastAPI, Pydantic, uvicorn, yt-dlp, Stripe SDK", body_style),
            Paragraph("Autenticação de endpoints públicos, autorização de saques, controle de CORS e proteção IDOR.", body_style)
        ],
        [
            Paragraph("<b>Banco & Dados</b>", body_style),
            Paragraph("Supabase (PostgreSQL, Auth, RLS), SQLite (FastAPI), JSON local (data/)", body_style),
            Paragraph("Supabase RLS bypass por service_role, isolamento de tenant por user_id e vazamento de PII em repositório.", body_style)
        ],
        [
            Paragraph("<b>Auth & Notificações</b>", body_style),
            Paragraph("Supabase Auth (OAuth/OTP), HMAC cookies próprios, Zoho Mail SMTP", body_style),
            Paragraph("Segredos estáticos para assinatura HMAC, senhas default hardcoded e injeção de HTML em e-mails.", body_style)
        ],
    ]
    stack_table = Table(stack_data, colWidths=[90, 185, 210])
    stack_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
        ("PADDING", (0, 0), (-1, -1), 5),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor(COLOR_BORDER)),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(stack_table)

    story.append(PageBreak())

    # =========================================================================
    # RESUMO EXECUTIVO & GRÁFICOS
    # =========================================================================
    story.append(Paragraph("Resumo Executivo da Auditoria", h1_style))
    story.append(Paragraph(
        "Foram inspecionados todos os módulos de backend, API routes do Next.js, serviços de integração com Supabase, "
        "Stripe, sistema de afiliados e componentes de interface. A auditoria identificou um total de <b>16 achados técnicos</b>, "
        "com destaque para <b>4 vulnerabilidades de severidade Crítica</b> que requerem remediação imediata antes de novas divulgações públicas.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # Severity metric cards
    cards_data = [
        [
            Paragraph("<font size=14><b>4</b></font><br/><font size=7 color='#B91C1C'><b>CRÍTICAS</b></font>", chip_critica),
            Paragraph("<font size=14><b>8</b></font><br/><font size=7 color='#EA580C'><b>ALTAS</b></font>", chip_alta),
            Paragraph("<font size=14><b>3</b></font><br/><font size=7 color='#D97706'><b>MÉDIAS</b></font>", chip_media),
            Paragraph("<font size=14><b>1</b></font><br/><font size=7 color='#2563EB'><b>BAIXA</b></font>", chip_baixa),
            Paragraph("<font size=14><b>5</b></font><br/><font size=7 color='#059669'><b>PONTOS FORTES</b></font>", chip_critica),
        ]
    ]
    cards_table = Table(cards_data, colWidths=[95, 95, 95, 95, 105])
    cards_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#FEF2F2")),
        ("BACKGROUND", (1, 0), (1, 0), colors.HexColor("#FFF7ED")),
        ("BACKGROUND", (2, 0), (2, 0), colors.HexColor("#FFFBEB")),
        ("BACKGROUND", (3, 0), (3, 0), colors.HexColor("#EFF6FF")),
        ("BACKGROUND", (4, 0), (4, 0), colors.HexColor("#ECFDF5")),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("PADDING", (0, 0), (-1, -1), 8),
        ("BOX", (0, 0), (0, 0), 1, colors.HexColor(COLOR_CRITICA)),
        ("BOX", (1, 0), (1, 0), 1, colors.HexColor(COLOR_ALTA)),
        ("BOX", (2, 0), (2, 0), 1, colors.HexColor(COLOR_MEDIA)),
        ("BOX", (3, 0), (3, 0), 1, colors.HexColor(COLOR_BAIXA)),
        ("BOX", (4, 0), (4, 0), 1, colors.HexColor(COLOR_FORTE)),
    ]))
    story.append(cards_table)
    story.append(Spacer(1, 14))

    # Visual Charts section (Donut + Bars side by side)
    chart_row = [
        [
            Image(str(chart1), width=3.2 * inch, height=2.3 * inch),
            Image(str(chart2), width=3.5 * inch, height=2.3 * inch),
        ]
    ]
    charts_table = Table(chart_row, colWidths=[240, 245])
    charts_table.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("PADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(charts_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # PONTOS FORTES E RISCOS CENTRAIS
    # =========================================================================
    story.append(Paragraph("Pontos Fortes da Implementação (Verificados)", h2_style))
    fortes_data = [
        [
            Paragraph("🛡️ <b>Mecanismo Seguro</b>", body_bold),
            Paragraph("<b>Arquivo e Linha</b>", body_bold),
            Paragraph("<b>Evidência Técnica Verificada</b>", body_bold),
        ],
        [
            Paragraph("<b>Isolamento de Histórico</b>", body_style),
            Paragraph("<font size=7.5>backend/app/api/transcribe.py:410-418</font>", code_style),
            Paragraph("Rota GET /history valida token Bearer do Supabase e filtra estritamente por user_id autenticado no banco.", body_style),
        ],
        [
            Paragraph("<b>Débito Seguro de Créditos</b>", body_style),
            Paragraph("<font size=7.5>backend/app/api/transcribe.py:148-230</font>", code_style),
            Paragraph("Exige autenticação obrigatória via Bearer token antes de processar qualquer URL ou upload e debita créditos do próprio chamador.", body_style),
        ],
        [
            Paragraph("<b>Proteção de Conta Mestra</b>", body_style),
            Paragraph("<font size=7.5>src/app/api/admin/users/route.ts:133-168</font>", code_style),
            Paragraph("Bloqueio explícito que impede a exclusão acidental ou proposital da conta do administrador principal.", body_style),
        ],
        [
            Paragraph("<b>Escape Automático no DOM</b>", body_style),
            Paragraph("<font size=7.5>src/components/TranscribeForm.tsx</font>", code_style),
            Paragraph("Uso de JSX nativo do React 19 para renderização de textos e títulos de vídeos, prevenindo XSS por escape padrão.", body_style),
        ],
        [
            Paragraph("<b>Execução Segura de Mídia</b>", body_style),
            Paragraph("<font size=7.5>backend/app/services/downloader.py:85-110</font>", code_style),
            Paragraph("A ferramenta yt-dlp é executada através da API Python interna, evitando shell injection por concatenação de comandos bash.", body_style),
        ],
    ]
    fortes_table = Table(fortes_data, colWidths=[110, 150, 225])
    fortes_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#ECFDF5")),
        ("PADDING", (0, 0), (-1, -1), 4.5),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor(COLOR_BORDER)),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(fortes_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Riscos Centrais (Pontos Fracos)", h2_style))
    story.append(Paragraph(
        "1. <b>Exposição de Superchave Supabase</b>: A chave mestra <code>service_role</code> está embutida em código-fonte compilado. Quem obtê-la possui controle total sobre todo o banco PostgreSQL.<br/>"
        "2. <b>Falta de Autenticação em Endpoints Administrativos e Financeiros</b>: Rotas como <code>/api/admin/users?action=record_user</code> e <code>/api/affiliates/status</code> aceitam mutações sem validação de credenciais.<br/>"
        "3. <b>IDOR em Transcrições e Afiliados</b>: Visualização irrestrita de áudios confidenciais em <code>/api/transcribe/public/[id]</code> e vazamento de CPFs/Pix de parceiros em <code>/api/affiliates?action=me</code>.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # TABELA DETALHADA DE ACHADOS (POR CATEGORIA)
    # =========================================================================
    story.append(Paragraph("Tabela Detalhada de Achados de Segurança", h1_style))
    story.append(Paragraph(
        "Abaixo constam todos os 16 achados técnicos verificados no código real, com sua respectiva localização exata, "
        "mecanismo de explorabilidade e classificação de severidade:",
        body_style
    ))
    story.append(Spacer(1, 4))

    def make_chip(sev):
        if sev == "CRÍTICA":
            bg = COLOR_CRITICA
        elif sev == "ALTA":
            bg = COLOR_ALTA
        elif sev == "MÉDIA":
            bg = COLOR_MEDIA
        else:
            bg = COLOR_BAIXA
        p = Paragraph(f"<b>{sev}</b>", chip_critica)
        t = Table([[p]], colWidths=[54], rowHeights=[14])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(bg)),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("PADDING", (0, 0), (-1, -1), 1),
            ("CORNERPAD", (0, 0), (-1, -1), 3),
        ]))
        return t

    findings_rows = [
        [
            Paragraph("<b>Sev.</b>", body_bold),
            Paragraph("<b>Cat.</b>", body_bold),
            Paragraph("<b>Arquivo : Linha</b>", body_bold),
            Paragraph("<b>Descrição e Mecânica de Exploração</b>", body_bold)
        ],
        # Cat 1: Banco sem tranca
        [
            make_chip("ALTA"),
            Paragraph("1. Banco", body_style),
            Paragraph("<font size=7>src/lib/admin-store.ts:229-306<br/>src/app/api/referral/route.ts:125-139</font>", code_style),
            Paragraph("<b>Bypass de RLS com chave service_role baixando todos os perfis:</b> O BFF utiliza a chave de serviço em rotas de usuário e faz <code>select('*')</code> em profiles, puxando todos os inquilinos sem cláusula WHERE na memória.", body_style)
        ],
        [
            make_chip("ALTA"),
            Paragraph("1. Banco", body_style),
            Paragraph("<font size=7>src/app/dashboard/page.tsx:162-170, 215-224</font>", code_style),
            Paragraph("<b>Escrita direta em saldo e plano pelo navegador do cliente:</b> O frontend executa <code>supabase.from('profiles').upsert({ credits_minutes, plan })</code> diretamente. Permite que qualquer usuário logado aumente seus créditos para 999.999 via console DevTools.", body_style)
        ],
        [
            make_chip("MÉDIA"),
            Paragraph("1. Banco", body_style),
            Paragraph("<font size=7>backend/app/services/database.py:15-30, 53-60</font>", code_style),
            Paragraph("<b>Uso generalizado de admin_client no backend:</b> Quase todas as operações usam service_role em vez de cliente restrito ao usuário, anulando a defesa em profundidade do RLS no Supabase.", body_style)
        ],
        # Cat 2: Permissão no navegador
        [
            make_chip("CRÍTICA"),
            Paragraph("2. Papel", body_style),
            Paragraph("<font size=7>src/app/api/admin/users/route.ts:66-90</font>", code_style),
            Paragraph("<b>Modificação arbitrária de usuário sem autenticação:</b> <code>POST /api/admin/users?action=record_user</code> não checa se o chamador é admin. Qualquer pessoa pode sobrescrever e-mail, plano (ex: 'ilimitado') e créditos de qualquer conta.", body_style)
        ],
        [
            make_chip("CRÍTICA"),
            Paragraph("2. Papel", body_style),
            Paragraph("<font size=7>backend/app/api/affiliates.py:322-347</font>", code_style),
            Paragraph("<b>Aprovação de afiliados desprotegida no FastAPI:</b> O endpoint <code>POST /api/affiliates/status</code> não valida token de admin. Qualquer parceiro pode autoaprovar sua conta para 'active' sem moderação humana.", body_style)
        ],
        [
            make_chip("ALTA"),
            Paragraph("2. Papel", body_style),
            Paragraph("<font size=7>src/app/api/admin/purchases/route.ts:63-95<br/>src/app/api/affiliates/route.ts:1003-1049</font>", code_style),
            Paragraph("<b>Forja de compras e comissões financeiras sem webhook secret:</b> Rotas que registram compras e comissões aceitam payloads POST sem autenticação ou validação de assinatura HMAC do Stripe.", body_style)
        ],
        # Cat 3: IDOR
        [
            make_chip("CRÍTICA"),
            Paragraph("3. IDOR", body_style),
            Paragraph("<font size=7>src/app/api/transcribe/public/[id]/route.ts:22-29<br/>backend/app/api/transcribe.py:501-521</font>", code_style),
            Paragraph("<b>Vazamento de transcrições confidenciais por ID:</b> O endpoint busca qualquer transcrição por UUID usando service_role sem checar dono e sem checar a flag <code>is_public</code>. Áudios privados e sensíveis ficam expostos.", body_style)
        ],
        [
            make_chip("ALTA"),
            Paragraph("3. IDOR", body_style),
            Paragraph("<font size=7>src/app/api/affiliates/route.ts:471-486, 528-563</font>", code_style),
            Paragraph("<b>Vazamento de CPF, Pix e Telefone de afiliados por código:</b> <code>GET /api/affiliates?action=me&affiliate_code=XYZ</code> sem autenticação retorna dados fiscais (CPF/CNPJ, Pix, celular) e histórico de compras.", body_style)
        ],
        [
            make_chip("ALTA"),
            Paragraph("3. IDOR", body_style),
            Paragraph("<font size=7>src/app/api/affiliates/route.ts:796-825</font>", code_style),
            Paragraph("<b>Account Takeover via redefinição de senha sem token:</b> <code>POST /api/affiliates?action=affiliate_set_password</code> altera a senha apenas pelo <code>affiliate_code</code> público, sem exigir senha antiga ou e-mail.", body_style)
        ],
        [
            make_chip("MÉDIA"),
            Paragraph("3. IDOR", body_style),
            Paragraph("<font size=7>src/app/api/suggestions/route.ts:124-197</font>", code_style),
            Paragraph("<b>Alteração e exclusão desprotegida de sugestões:</b> Métodos PATCH e DELETE em <code>/api/suggestions</code> operam por ID sem autenticação, permitindo vandalismo e exclusão de feedbacks.", body_style)
        ],
        # Cat 4: Chaves expostas
        [
            make_chip("CRÍTICA"),
            Paragraph("4. Chaves", body_style),
            Paragraph("<font size=7>src/lib/admin-store.ts:206-215</font>", code_style),
            Paragraph("<b>Chave mestra Supabase service_role em Base64 no código:</b> String <code>c2Jfc2VjcmV0X...</code> decodifica para a chave real <code>sb_secret_Spsu...</code>, concedendo superadmin sobre todo o banco PostgreSQL da aplicação.", body_style)
        ],
        [
            make_chip("CRÍTICA"),
            Paragraph("4. Chaves", body_style),
            Paragraph("<font size=7>src/lib/admin-auth.ts:4-5<br/>src/app/api/affiliates/route.ts:7-8, 51</font>", code_style),
            Paragraph("<b>Senha default '987123aA!' e segredo HMAC estático:</b> Credencial padrão administrativa e segredo HMAC <code>peguei_o_texto_admin_sec_2026_safe</code> permitem forjar tokens de sessão admin offline.", body_style)
        ],
        [
            make_chip("ALTA"),
            Paragraph("4. Chaves", body_style),
            Paragraph("<font size=7>src/lib/email.ts:5-6</font>", code_style),
            Paragraph("<b>Credencial SMTP do Zoho Mail exposta no código:</b> Senha de envio de e-mails corporativos <code>L4SRYb2jj8Rx</code> gravada como fallback direto em produção, além de <code>rejectUnauthorized: false</code> no TLS.", body_style)
        ],
        [
            make_chip("ALTA"),
            Paragraph("4. Chaves", body_style),
            Paragraph("<font size=7>data/users.json<br/>data/affiliates.json</font>", code_style),
            Paragraph("<b>PII de clientes e parceiros commitada no Git:</b> Dezenas de registros com nomes reais, e-mails, planos, CPFs, chaves Pix e celulares estão sob controle de versão sem estar no <code>.gitignore</code>.", body_style)
        ],
        # Cat 5: Inputs sem tratamento
        [
            make_chip("MÉDIA"),
            Paragraph("5. XSS", body_style),
            Paragraph("<font size=7>src/lib/email.ts:78, 219, 337, 444, 452</font>", code_style),
            Paragraph("<b>Injeção de HTML em templates de e-mail (Stored XSS):</b> Entradas de usuário como nome, título e descrição de sugestões são concatenadas em templates sem sanitização contra caracteres <code>< > & '</code>.", body_style)
        ],
        [
            make_chip("BAIXA"),
            Paragraph("5. XSS", body_style),
            Paragraph("<font size=7>src/app/blog/[slug]/page.tsx:313<br/>src/lib/blog.ts:163</font>", code_style),
            Paragraph("<b>Renderização de Markdown sem DOMPurify:</b> <code>marked.parse</code> compila Markdown para HTML e injeta via <code>dangerouslySetInnerHTML</code> sem biblioteca de sanitização ativa.", body_style)
        ],
    ]

    findings_table = Table(findings_rows, colWidths=[48, 52, 125, 260], repeatRows=1)
    findings_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F172A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("PADDING", (0, 0), (-1, -1), 4),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor(COLOR_BORDER)),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor(COLOR_BG_LIGHT)]),
    ]))
    story.append(findings_table)

    story.append(PageBreak())

    # =========================================================================
    # RECOMENDAÇÕES PRIORIZADAS
    # =========================================================================
    story.append(Paragraph("Plano de Ação e Recomendações Priorizadas", h1_style))
    story.append(Paragraph(
        "Para mitigar os riscos com máxima eficiência, recomendamos a execução das ações em 3 etapas cronológicas:",
        body_style
    ))
    story.append(Spacer(1, 6))

    recs_data = [
        [
            Paragraph("<b>Prioridade</b>", body_bold),
            Paragraph("<b>Ações Essenciais Recomendadas</b>", body_bold),
            Paragraph("<b>Prazo Sugerido</b>", body_bold),
        ],
        [
            Paragraph("<font color='#B91C1C'><b>P1 — URGENTE</b><br/>(24h - 48h)</font>", body_bold),
            Paragraph(
                "• <b>Rotacionar a chave SUPABASE_SERVICE_ROLE_KEY</b> no painel do Supabase e deletar o fallback em Base64 de <code>src/lib/admin-store.ts</code>.<br/>"
                "• <b>Remover a senha padrão '987123aA!'</b> e segredo estático de <code>src/lib/admin-auth.ts</code>. Forçar falha no startup se variáveis de ambiente estiverem ausentes.<br/>"
                "• <b>Adicionar proteção de autenticação admin obrigatória</b> em <code>/api/admin/users</code> (action=record_user) e <code>backend/app/api/affiliates.py</code> (/status).<br/>"
                "• <b>Exigir verificação de posse em <code>/api/transcribe/public/[id]</code></b>, permitindo leitura pública apenas se <code>is_public == true</code>.",
                body_style
            ),
            Paragraph("<b>Imediato</b><br/>(Próximas 24 horas)", body_style),
        ],
        [
            Paragraph("<font color='#EA580C'><b>P2 — CURTO PRAZO</b><br/>(Até 7 dias)</font>", body_bold),
            Paragraph(
                "• <b>Proibir escrita direta no cliente em <code>profiles</code></b>. Configurar RLS no PostgreSQL do Supabase restringindo <code>UPDATE(credits_minutes, plan)</code> apenas a <code>service_role</code>.<br/>"
                "• <b>Corrigir fluxo de senha de afiliados</b>: exigir token de redefinição único enviado ao e-mail cadastrado antes de alterar a senha.<br/>"
                "• <b>Adicionar autenticação em <code>GET /api/affiliates?action=me</code></b> e não expor CPF, telefone e Pix sem token de sessão do afiliado.<br/>"
                "• <b>Expurgar arquivos <code>data/*.json</code> do git</b> (usar <code>git filter-repo</code> ou <code>git rm --cached</code>) e adicionar <code>data/*.json</code> ao <code>.gitignore</code>.",
                body_style
            ),
            Paragraph("<b>7 dias</b>", body_style),
        ],
        [
            Paragraph("<font color='#2563EB'><b>P3 — MÉDIO PRAZO</b><br/>(Até 15 dias)</font>", body_bold),
            Paragraph(
                "• <b>Adicionar biblioteca de escape HTML</b> (como <code>escape-html</code> ou <code>he</code>) nos templates de e-mail em <code>src/lib/email.ts</code>.<br/>"
                "• <b>Instalar <code>sanitize-html</code> ou <code>dompurify</code></b> no pipeline de renderização de Markdown do blog.<br/>"
                "• <b>Configurar CORS estrito no FastAPI</b>, substituindo o wildcard <code>*</code> com <code>allow_credentials=True</code> por domínios autorizados explícitos.",
                body_style
            ),
            Paragraph("<b>15 dias</b>", body_style),
        ],
    ]
    recs_table = Table(recs_data, colWidths=[90, 310, 85])
    recs_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F172A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("PADDING", (0, 0), (-1, -1), 6),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor(COLOR_BORDER)),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor(COLOR_BG_LIGHT)]),
    ]))
    story.append(recs_table)

    story.append(PageBreak())

    # =========================================================================
    # ISSUES PRONTAS PARA O GITHUB
    # =========================================================================
    story.append(Paragraph("Issues Prontas para o GitHub (Copiar e Colar)", h1_style))
    story.append(Paragraph(
        "Abaixo constam os textos completos de 8 issues organizadas e consolidadas para criação direta no GitHub, "
        "com evidências, impacto, código de correção sugerido e critérios de aceite verificáveis:",
        body_style
    ))
    story.append(Spacer(1, 8))

    github_issues = [
        # Issue 1
        (
            "Issue 1",
            "[Segurança] [Crítica] Remoção imediata da SUPABASE_SERVICE_ROLE_KEY em Base64 e rotação de credenciais",
            "security, severity:critica, priority:p1",
            "Foi identificada a chave mestra de serviço do Supabase (`service_role`) embutida diretamente em Base64 dentro do código-fonte em `src/lib/admin-store.ts:211`. Esta chave tem permissão de superusuário e bypassa todas as políticas de Row Level Security (RLS) do banco de dados PostgreSQL.\n\n"
            "Qualquer pessoa com acesso de leitura ao repositório ou aos arquivos compilados pode decodificar a string e obter acesso completo de escrita, leitura e deleção em todas as tabelas e dados de autenticação do Supabase.",
            "src/lib/admin-store.ts:206-215\n"
            "```ts\n"
            "export function getSupabaseServiceKey(): string | undefined {\n"
            "  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {\n"
            "    return process.env.SUPABASE_SERVICE_ROLE_KEY;\n"
            "  }\n"
            "  try {\n"
            "    return Buffer.from(\"c2Jfc2VjcmV0X1Nwc3VFaDFTa3c...[CHAVE_REDUZIDA]\", \"base64\").toString(\"utf-8\");\n"
            "  } catch {\n"
            "    return undefined;\n"
            "  }\n"
            "}\n"
            "```",
            "Vazamento total do banco de dados de produção, destruição de tabelas ou alteração em massa de dados de clientes.",
            "1. Acessar o dashboard do Supabase (Project Settings > API) e clicar em 'Reset Secret' para a Service Role Key antiga.\n"
            "2. Remover a linha de fallback com Buffer.from em `src/lib/admin-store.ts`.\n"
            "3. Lançar erro de inicialização se `process.env.SUPABASE_SERVICE_ROLE_KEY` não estiver definido em produção.",
            "[ ] Chave antiga do Supabase invalidada e nova chave configurada nas variáveis de ambiente na Vercel e Railway.\n"
            "[ ] String Base64 removida de `src/lib/admin-store.ts`.\n"
            "[ ] Verificado que a aplicação rejeita inicialização se a variável de ambiente estiver ausente."
        ),
        # Issue 2
        (
            "Issue 2",
            "[Segurança] [Crítica] Remoção de senhas padrão e segredos estáticos de assinatura HMAC",
            "security, severity:critica, priority:p1",
            "Em `src/lib/admin-auth.ts` e `src/app/api/affiliates/route.ts`, o sistema define valores padrão inseguros para variáveis de credencial e assinatura caso elas não estejam no ambiente:\n"
            "- Senha administrativa padrão: `987123aA!`\n"
            "- Segredo de assinatura de tokens: `peguei_o_texto_admin_sec_2026_safe` e `peguei_affiliate_sec_2026_auth`\n\n"
            "Por ser um HMAC com segredo estático público, um atacante pode calcular tokens administrativos válidos offline e obter acesso total ao painel `/admin`.",
            "src/lib/admin-auth.ts:4-5\n"
            "```ts\n"
            "export const ADMIN_PASSWORD = process.env.AFFILIATE_ADMIN_PASSWORD || \"987123aA!\";\n"
            "export const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || \"peguei_o_texto_admin_sec_2026_safe\";\n"
            "```",
            "Acesso administrativo não autorizado e forja de identidade para qualquer conta do sistema.",
            "Exigir que `AFFILIATE_ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET` sejam fornecidos obrigatoriamente via ambiente, sem fallbacks pré-definidos.",
            "[ ] Fallbacks '987123aA!' e 'peguei_o_texto_admin_sec_2026_safe' removidos.\n"
            "[ ] Função de validação lança exceção em ambiente de produção se segredo tiver menos de 32 caracteres.\n"
            "[ ] Testado login administrativo com segredo forte injetado via `.env`."
        ),
        # Issue 3
        (
            "Issue 3",
            "[Segurança] [Crítica] Correção de IDOR nas rotas de transcrição pública (Next.js e FastAPI)",
            "security, severity:critica, priority:p1",
            "As rotas `GET /api/transcribe/public/[id]` (Next.js) e `GET /api/transcribe/public/{item_id}` (FastAPI) buscam transcrições no banco de dados utilizando a chave privilegiada `service_role` filtrando unicamente pelo ID recebido no path, sem validar se o chamador é o proprietário ou se a transcrição possui a flag `is_public: true`.",
            "src/app/api/transcribe/public/[id]/route.ts:22-26\n"
            "```ts\n"
            "const { data, error } = await sb\n"
            "  .from(\"transcriptions\")\n"
            "  .select(\"id, title, platform, duration_seconds, text_content, srt_content, vtt_content, created_at\")\n"
            "  .eq(\"id\", id)\n"
            "  .single();\n"
            "```\n"
            "backend/app/api/transcribe.py:507-513\n"
            "```python\n"
            "sb = get_supabase(admin=True)\n"
            "res = sb.table(\"transcriptions\").select(\"...\").eq(\"id\", item_id).single().execute()\n"
            "```",
            "Exposição de gravações privadas, transcrições confidenciais de reuniões corporativas e áudios jurídicos/médicos para qualquer usuário que possua ou enumere o UUID.",
            "1. Adicionar coluna booleana `is_public BOOLEAN DEFAULT FALSE` na tabela `transcriptions`.\n"
            "2. No endpoint público, adicionar estritamente o filtro `.eq('is_public', True)`.\n"
            "3. Se o usuário estiver autenticado, permitir acesso se `user_id == caller_id`.",
            "[ ] Adicionado filtro `.eq('is_public', true)` em `src/app/api/transcribe/public/[id]/route.ts`.\n"
            "[ ] Adicionado filtro equivalente no endpoint Python em `backend/app/api/transcribe.py`.\n"
            "[ ] Teste automatizado garante que transcrições privadas retornam HTTP 404 para usuários não autorizados."
        ),
        # Issue 4
        (
            "Issue 4",
            "[Segurança] [Crítica] Autenticação de rotas privilegiadas em /api/admin/users e /api/affiliates/status",
            "security, severity:critica, priority:p1",
            "A ação `POST /api/admin/users?action=record_user` permite a qualquer usuário anônimo enviar parâmetros de `plan` e `credits_minutes`, sobrescrevendo o perfil da vítima no arquivo e banco.\n"
            "Da mesma forma, no backend FastAPI, a rota `POST /api/affiliates/status` permite a qualquer chamador alterar o status de um parceiro para 'active'.",
            "src/app/api/admin/users/route.ts:66-70\n"
            "```ts\n"
            "if (action === \"record_user\") {\n"
            "  const { id, email, name, plan, credits_minutes, referral_source } = body;\n"
            "  const user = upsertUser({ ... });\n"
            "}\n"
            "```\n"
            "backend/app/api/affiliates.py:322-332\n"
            "```python\n"
            "@router.post(\"/status\")\n"
            "def update_affiliate_status(payload: StatusUpdateSchema):\n"
            "    cursor.execute(\"UPDATE affiliates SET status = ? WHERE affiliate_code = ?\", ...)\n"
            "```",
            "Qualquer visitante pode autoatribuir-se o plano 'ilimitado' gratuitamente ou autoaprovar status de afiliado sem moderação.",
            "1. Proteger `POST /api/admin/users?action=record_user` para que `plan` e `credits_minutes` sejam ignorados caso o chamador não seja admin autenticado.\n"
            "2. Proteger `backend/app/api/affiliates.py:status` exigindo cabeçalho `X-Admin-Token` assinado.",
            "[ ] `record_user` sanitizado: apenas o admin pode alterar `plan` e `credits_minutes` via API.\n"
            "[ ] `POST /api/affiliates/status` retorna HTTP 401 se token admin não for fornecido.\n"
            "[ ] Testado que requisições forjadas do frontend não conseguem elevar privilégios."
        ),
        # Issue 5
        (
            "Issue 5",
            "[Segurança] [Alta] Proteção contra Account Takeover e vazamento de PII de afiliados em /api/affiliates",
            "security, severity:alta, priority:p2",
            "Em `src/app/api/affiliates/route.ts`:\n"
            "1. A ação `GET ?action=me&affiliate_code=XYZ` permite consultar dados cadastrais completos de qualquer parceiro pelo código público (exibindo CPF, telefone, Pix e lista de compradores com e-mails).\n"
            "2. A ação `POST ?action=affiliate_set_password` aceita `affiliate_code` e redefine a senha do afiliado sem pedir senha antiga ou token por e-mail.",
            "src/app/api/affiliates/route.ts:478-485\n"
            "```ts\n"
            "} else if (userId || affiliateCode || emailParam) {\n"
            "  affiliate = affiliates.find(a => ... a.affiliate_code === affiliateCode);\n"
            "}\n"
            "```\n"
            "src/app/api/affiliates/route.ts:796-820\n"
            "```ts\n"
            "if (action === \"affiliate_set_password\") {\n"
            "  const { affiliate_code, password } = body;\n"
            "  aff.password_hash = hash;\n"
            "}\n"
            "```",
            "Vazamento grave de dados sensíveis protegidos pela LGPD e sequestro total de contas de afiliados.",
            "1. Exigir sessão autenticada (`getAuthenticatedAffiliate`) para visualização de métricas e dados pessoais em `action=me`.\n"
            "2. No `affiliate_set_password`, permitir definição de senha apenas uma vez (quando `password_hash` for nulo) ou exigir token temporário criptografado enviado ao e-mail do titular.",
            "[ ] Consulta pública de métricas de afiliados desativada em `action=me`.\n"
            "[ ] Redefinição de senha exige token verificado enviado ao e-mail cadastrado.\n"
            "[ ] CPFs e telefones mascarados em qualquer resposta que não pertença estritamente à sessão do titular."
        ),
        # Issue 6
        (
            "Issue 6",
            "[Segurança] [Alta] Bloqueio de escrita direta de saldo pelo cliente no Supabase e imposição de RLS",
            "security, severity:alta, priority:p2",
            "O componente `DashboardPage` contém chamadas diretas como `supabase.from('profiles').upsert({ credits_minutes, plan })` disparadas pelo navegador. Se as políticas de RLS permitirem update do próprio perfil, o usuário pode alterar seus minutos e plano localmente pelo console.",
            "src/app/dashboard/page.tsx:164-169\n"
            "```ts\n"
            "await supabase.from(\"profiles\").upsert({\n"
            "  id: user.id,\n"
            "  credits_minutes: activeCredits,\n"
            "  plan: activePlan,\n"
            "  updated_at: new Date().toISOString(),\n"
            "});\n"
            "```",
            "Fraude de créditos e uso infinito de recursos de inteligência artificial sem pagamento.",
            "1. No PostgreSQL do Supabase, remover permissão de escrita do usuário nas colunas `credits_minutes` e `plan` usando colunas protegidas ou triggers.\n"
            "2. Atualizar saldos exclusivamente através de Stored Procedures RPC com `SECURITY DEFINER` e validação do Stripe.",
            "[ ] RLS do Supabase configurado bloqueando `UPDATE(credits_minutes, plan)` para a role `authenticated`.\n"
            "[ ] Tentativa de update manual via DevTools rejeitada com código 42501 (permissão negada).\n"
            "[ ] Concessão de créditos restrita ao processamento validado de webhooks da Stripe."
        ),
        # Issue 7
        (
            "Issue 7",
            "[Segurança] [Alta] Expurgo de arquivos com dados pessoais (PII) do histórico Git e adição ao .gitignore",
            "security, severity:alta, priority:p2",
            "Arquivos em `data/*.json` (`data/users.json` e `data/affiliates.json`) contêm dados reais de clientes (nomes, e-mails, planos) e de afiliados (CPFs, números de telefone, chaves Pix e e-mails) e estão rastreados no Git.",
            "Verificação de arquivos no repositório:\n"
            "```bash\n"
            "$ git ls-files data\n"
            "data/affiliates.json\n"
            "data/users.json\n"
            "```",
            "Violação da LGPD (vazamento de dados pessoais e bancários de parceiros e clientes cadastrados).",
            "1. Adicionar `data/*.json` e `data/` ao `.gitignore` imediatamente.\n"
            "2. Remover os arquivos do índice Git com `git rm --cached data/*.json`.\n"
            "3. Se o repositório for compartilhado externamente, expurgar os commits que continham esses arquivos com `git-filter-repo`.",
            "[ ] `data/*.json` adicionado no `.gitignore`.\n"
            "[ ] Arquivos de dados reais removidos do rastreamento de versão.\n"
            "[ ] Criados arquivos de exemplo sanitizados (ex: `data/users.example.json`)."
        ),
        # Issue 8
        (
            "Issue 8",
            "[Segurança] [Média] Sanitização de templates de e-mail contra HTML Injection e sanitização de Markdown",
            "security, severity:media, priority:p3",
            "1. Em `src/lib/email.ts`, dados fornecidos pelo usuário (`name`, `title`, `description`) são concatenados em HTML cru enviado por e-mail via `nodemailer`, permitindo injeção de tags HTML em clientes de e-mail.\n"
            "2. Em `src/app/blog/[slug]/page.tsx`, o HTML gerado pelo `marked` é renderizado via `dangerouslySetInnerHTML` sem passar por `DOMPurify`.",
            "src/lib/email.ts:78\n"
            "```ts\n"
            "<h1 style=\"...\">Olá, ${cleanName}! Seja muito bem-vindo ao Peguei o Texto.</h1>\n"
            "```\n"
            "src/app/blog/[slug]/page.tsx:313\n"
            "```tsx\n"
            "<div className=\"blog-prose\" dangerouslySetInnerHTML={{ __html: post.htmlContent || \"\" }} />\n"
            "```",
            "Ataques de HTML Injection e Stored XSS em clientes de e-mail ou no navegador através de conteúdos markdown.",
            "1. Implementar função auxiliar `escapeHtml(str)` para substituir caracteres `& < > \" '` antes de injetar variáveis em templates de e-mail.\n"
            "2. Instalar biblioteca de sanitização (ex: `sanitize-html`) antes de repassar o HTML gerado pelo Markdown ao React.",
            "[ ] Função `escapeHtml` criada e aplicada a todas as interpolações de variáveis de usuário em `src/lib/email.ts`.\n"
            "[ ] Sanitização de Markdown implementada no leitor de posts do blog.\n"
            "[ ] Testado envio de sugestão com tags `<script>` e `<img>` verificando que o e-mail renderiza como texto puro."
        ),
    ]

    import html

    def fmt_text(txt: str) -> str:
        escaped = html.escape(str(txt))
        return escaped.replace("\n\n", "<br/><br/>").replace("\n", "<br/>")

    def fmt_code(txt: str) -> str:
        escaped = html.escape(str(txt))
        return escaped.replace("\n", "<br/>").replace(" ", "&nbsp;")

    for num, title, labels, desc, evid, impact, sug, crit in github_issues:
        story.append(Paragraph(f"<b>--- {html.escape(num.upper())} ---</b>", body_bold))
        story.append(Paragraph(f"<b>Título:</b> {html.escape(title)}", h2_style))
        story.append(Paragraph(f"<b>Labels sugeridas:</b> <code>{html.escape(labels)}</code>", body_style))
        story.append(Spacer(1, 2))
        story.append(Paragraph("<b>Descrição do Problema:</b>", body_bold))
        story.append(Paragraph(fmt_text(desc), body_style))
        story.append(Spacer(1, 2))
        story.append(Paragraph("<b>Evidência Técnica (Arquivo:Linha):</b>", body_bold))
        story.append(Paragraph(fmt_code(evid), code_style))
        story.append(Spacer(1, 2))
        story.append(Paragraph(f"<b>Impacto:</b> {fmt_text(impact)}", body_style))
        story.append(Spacer(1, 2))
        story.append(Paragraph(f"<b>Sugestão de Correção:</b><br/>{fmt_text(sug)}", body_style))
        story.append(Spacer(1, 2))
        story.append(Paragraph(f"<b>Critérios de Aceite:</b><br/>{fmt_text(crit)}", body_style))
        story.append(Spacer(1, 2))
        story.append(Paragraph(f"<b>--- FIM {html.escape(num.upper())} ---</b>", body_bold))
        story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor(COLOR_BORDER), spaceBefore=8, spaceAfter=14))

    # Build the document using NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[PDF Build] Relatório gerado com sucesso em: {OUTPUT_PDF}")

if __name__ == "__main__":
    build_pdf()
