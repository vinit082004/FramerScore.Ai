import { jsPDF } from "jspdf";
import type { AnalysisResult } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

export function exportAnalysisPdf(result: AnalysisResult) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  let y = 56;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("FrameScore AI Report", marginX, y);

  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(`${result.filename} · ${formatDateTime(result.created_at)}`, marginX, y);

  y += 34;
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.text(`${result.overall_score}/100`, marginX, y);

  doc.setFontSize(13);
  doc.text(result.rating, marginX + 130, y);

  y += 26;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(55, 65, 81);
  const summaryLines = doc.splitTextToSize(result.verdict_summary, 500);
  doc.text(summaryLines, marginX, y);
  y += summaryLines.length * 14 + 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text("Parameter Scores", marginX, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  for (const param of result.parameters) {
    if (y > 760) {
      doc.addPage();
      y = 56;
    }
    doc.setTextColor(17, 24, 39);
    doc.text(param.name, marginX, y);
    doc.text(`${param.score}/100`, marginX + 220, y);
    doc.setTextColor(107, 114, 128);
    doc.text(param.label, marginX + 290, y);
    y += 16;
  }

  y += 14;
  if (y > 720) {
    doc.addPage();
    y = 56;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text("AI Feedback", marginX, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  for (const item of result.feedback) {
    const prefix = item.type === "positive" ? "✓ " : "⚠ ";
    const lines = doc.splitTextToSize(prefix + item.message, 480);
    doc.text(lines, marginX, y);
    y += lines.length * 14;
  }

  y += 10;
  doc.setTextColor(37, 99, 235);
  const suggestionLines = doc.splitTextToSize(`Suggestion: ${result.suggestion}`, 480);
  doc.text(suggestionLines, marginX, y);

  doc.save(`framescore-${result.id}.pdf`);
}
