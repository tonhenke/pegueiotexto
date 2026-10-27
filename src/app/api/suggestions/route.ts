import { NextRequest, NextResponse } from "next/server";
import {
  getSuggestions,
  saveSuggestion,
  updateSuggestionStatus,
  deleteSuggestion,
  SuggestionRecord,
} from "@/lib/admin-store";
import {
  sendSuggestionNotificationEmail,
  sendSuggestionUserConfirmationEmail,
} from "@/lib/email";

export const dynamic = "force-dynamic";

const CATEGORY_MAP: Record<string, string> = {
  ux: "UX & Interface",
  transcription: "Ferramenta de Transcrição",
  ai: "Inteligência Artificial",
  bugs: "Bugs & Problemas Técnicos",
  features: "Nova Funcionalidade",
  other: "Outras Sugestões",
};

// GET: Retrieve suggestions list
export async function GET(req: NextRequest) {
  try {
    const list = getSuggestions();
    return NextResponse.json({
      success: true,
      suggestions: list,
      total: list.length,
    });
  } catch (error: any) {
    console.error("[API Suggestions GET] Erro:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao carregar sugestões." },
      { status: 500 }
    );
  }
}

// POST: Submit a new suggestion / feedback
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, title, description, user_email, user_name, user_id } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "O título da sugestão deve ter pelo menos 3 caracteres." },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Por favor, detalhe sua sugestão com pelo menos 10 caracteres.",
        },
        { status: 400 }
      );
    }

    const cleanCategory = (category && typeof category === "string" ? category.toLowerCase().trim() : "features");
    const categoryLabel = CATEGORY_MAP[cleanCategory] || body.category_label || "Sugestão Geral";

    // Persist in Admin Store
    const record = saveSuggestion({
      category: cleanCategory,
      category_label: categoryLabel,
      title: title.trim(),
      description: description.trim(),
      user_email: user_email ? String(user_email).trim() : undefined,
      user_name: user_name ? String(user_name).trim() : undefined,
      user_id: user_id ? String(user_id).trim() : undefined,
    });

    // 1. Send notification email to team (feedbacks@pegueiotexto.com.br)
    sendSuggestionNotificationEmail({
      category: cleanCategory,
      categoryLabel,
      title: record.title,
      description: record.description,
      userEmail: record.user_email,
      userName: record.user_name,
      userId: record.user_id,
    }).catch((err) => console.error("[API Suggestions] Erro no envio de e-mail de notificação:", err));

    // 2. Send confirmation email to user if email was provided
    if (record.user_email && record.user_email.includes("@")) {
      sendSuggestionUserConfirmationEmail({
        to: record.user_email,
        userName: record.user_name,
        title: record.title,
        categoryLabel,
      }).catch((err) => console.warn("[API Suggestions] Erro no envio de confirmação ao usuário:", err));
    }

    return NextResponse.json({
      success: true,
      message: "Sugestão enviada com sucesso! Muito obrigado pela sua contribuição.",
      suggestion: record,
    });
  } catch (error: any) {
    console.error("[API Suggestions POST] Erro:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno ao registrar sugestão. Tente novamente." },
      { status: 500 }
    );
  }
}

// PATCH: Update suggestion status (e.g. pending -> in_review -> implemented -> dismissed)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Campos 'id' e 'status' são obrigatórios." },
        { status: 400 }
      );
    }

    const validStatuses: SuggestionRecord["status"][] = ["pending", "in_review", "implemented", "dismissed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Status inválido. Permitidos: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const ok = updateSuggestionStatus(id, status);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Sugestão não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status atualizado com sucesso.",
    });
  } catch (error: any) {
    console.error("[API Suggestions PATCH] Erro:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao atualizar status." },
      { status: 500 }
    );
  }
}

// DELETE: Delete suggestion
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Parâmetro 'id' é obrigatório." },
        { status: 400 }
      );
    }

    const ok = deleteSuggestion(id);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Sugestão não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sugestão removida com sucesso.",
    });
  } catch (error: any) {
    console.error("[API Suggestions DELETE] Erro:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao remover sugestão." },
      { status: 500 }
    );
  }
}
