import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { jsPDF } from "jspdf";

export interface ExportMetadata {
  title?: string;
  duration?: number;
  platform?: string;
  summary?: string;
  engine?: string;
}

function sanitizeFilename(name: string): string {
  const clean = (name || "transcricao")
    .replace(/[^a-zA-Z0-9à-úÀ-Ú_\-\s]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .slice(0, 50);
  return clean || "transcricao";
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads plain text file (.TXT)
 */
export function exportToTxt(text: string, title: string = "transcricao") {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  triggerDownload(blob, `${sanitizeFilename(title)}.txt`);
}

/**
 * Downloads SubRip subtitle file (.SRT)
 */
export function exportToSrt(srtContent: string, title: string = "legendas") {
  const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
  triggerDownload(blob, `${sanitizeFilename(title)}.srt`);
}

/**
 * Downloads WebVTT subtitle file (.VTT)
 */
export function exportToVtt(vttContent: string, title: string = "legendas") {
  const blob = new Blob([vttContent], { type: "text/vtt;charset=utf-8" });
  triggerDownload(blob, `${sanitizeFilename(title)}.vtt`);
}

/**
 * Downloads formatted Microsoft Word (.DOCX) document
 */
export async function exportToDocx(
  text: string,
  title: string = "Transcrição",
  meta: ExportMetadata = {}
) {
  const paragraphs: Paragraph[] = [];

  // Title
  paragraphs.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: title || "Transcrição de Áudio",
          bold: true,
          size: 32, // 16pt
          color: "7C3AED", // Brand purple
        }),
      ],
      spacing: { after: 120 },
    })
  );

  // Metadata line
  const metaParts: string[] = ["Peguei o Texto (pegueiotexto.com.br)"];
  if (meta.platform) metaParts.push(`Origem: ${meta.platform}`);
  if (meta.duration) {
    const mins = Math.floor(meta.duration / 60);
    const secs = Math.round(meta.duration % 60);
    metaParts.push(`Duração: ${mins}m ${secs}s`);
  }
  metaParts.push(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`);

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: metaParts.join(" • "),
          size: 18, // 9pt
          color: "6B7280",
          italics: true,
        }),
      ],
      spacing: { after: 240 },
    })
  );

  // Optional AI Summary section if present
  if (meta.summary) {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: "Resumo com Inteligência Artificial",
            bold: true,
            size: 24, // 12pt
            color: "4F46E5",
          }),
        ],
        spacing: { before: 200, after: 120 },
      })
    );

    const summaryLines = meta.summary.split("\n").filter((l) => l.trim().length > 0);
    for (const line of summaryLines) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.trim(),
              size: 20, // 10pt
              color: "1F2937",
            }),
          ],
          spacing: { after: 80 },
        })
      );
    }

    paragraphs.push(
      new Paragraph({
        text: "",
        spacing: { after: 200 },
      })
    );
  }

  // Section: Full Transcription
  paragraphs.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [
        new TextRun({
          text: "Texto da Transcrição",
          bold: true,
          size: 24, // 12pt
          color: "111827",
        }),
      ],
      spacing: { before: 180, after: 140 },
    })
  );

  // Split transcript into paragraphs
  const rawParagraphs = text.split("\n\n").filter((p) => p.trim().length > 0);
  if (rawParagraphs.length === 0) {
    rawParagraphs.push(text);
  }

  for (const para of rawParagraphs) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: para.trim(),
            size: 22, // 11pt
            color: "374151",
          }),
        ],
        spacing: { after: 140, line: 276 },
      })
    );
  }

  // Footer notice
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Transcrito com alta fidelidade pelo Peguei o Texto • Inteligência Artificial",
          size: 16, // 8pt
          color: "9CA3AF",
        }),
      ],
      spacing: { before: 400 },
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `${sanitizeFilename(title)}.docx`);
}

/**
 * Downloads clean formatted PDF document
 */
export function exportToPdf(
  text: string,
  title: string = "Transcrição",
  meta: ExportMetadata = {}
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let currentY = 20;

  const addHeader = (pageNum: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(124, 58, 237); // Brand purple
    doc.text("Peguei o Texto", margin, 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("pegueiotexto.com.br", pageWidth - margin, 15, { align: "right" });

    doc.setDrawColor(230, 230, 235);
    doc.line(margin, 18, pageWidth - margin, 18);
  };

  const addFooter = (pageNum: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `Página ${pageNum} • Transcrição gerada por Peguei o Texto com Inteligência Artificial`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  };

  let pageCount = 1;
  addHeader(pageCount);
  currentY = 28;

  // Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(20, 20, 25);
  const titleLines = doc.splitTextToSize(title || "Transcrição de Áudio", contentWidth);
  doc.text(titleLines, margin, currentY);
  currentY += titleLines.length * 6 + 2;

  // Metadata
  const metaParts: string[] = [];
  if (meta.platform) metaParts.push(`Origem: ${meta.platform}`);
  if (meta.duration) {
    const mins = Math.floor(meta.duration / 60);
    const secs = Math.round(meta.duration % 60);
    metaParts.push(`Duração: ${mins}m ${secs}s`);
  }
  metaParts.push(`Data: ${new Date().toLocaleDateString("pt-BR")}`);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 110);
  doc.text(metaParts.join("  |  "), margin, currentY);
  currentY += 7;

  doc.setDrawColor(240, 240, 245);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 7;

  // Optional Summary
  if (meta.summary) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text("Resumo com Inteligência Artificial", margin, currentY);
    currentY += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 50);

    const summaryLines = doc.splitTextToSize(meta.summary, contentWidth);
    for (const sLine of summaryLines) {
      if (currentY > pageHeight - 20) {
        addFooter(pageCount);
        doc.addPage();
        pageCount++;
        addHeader(pageCount);
        currentY = 28;
      }
      doc.text(sLine, margin, currentY);
      currentY += 5;
    }
    currentY += 4;
    doc.setDrawColor(240, 240, 245);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 7;
  }

  // Section: Full Transcript
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 25);
  doc.text("Texto Completo", margin, currentY);
  currentY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(45, 45, 55);

  const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0);
  if (paragraphs.length === 0) paragraphs.push(text);

  for (const para of paragraphs) {
    const lines = doc.splitTextToSize(para.trim(), contentWidth);
    for (const line of lines) {
      if (currentY > pageHeight - 18) {
        addFooter(pageCount);
        doc.addPage();
        pageCount++;
        addHeader(pageCount);
        currentY = 28;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(45, 45, 55);
      }
      doc.text(line, margin, currentY);
      currentY += 5.2;
    }
    currentY += 3.5; // spacing between paragraphs
  }

  addFooter(pageCount);
  doc.save(`${sanitizeFilename(title)}.pdf`);
}
