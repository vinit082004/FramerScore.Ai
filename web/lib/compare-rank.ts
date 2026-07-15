import type { AnalysisResult } from "@/lib/types";

/** Mirrors the ranking logic in api/app/api/routes/compare.py so results fetched
 * individually (e.g. from history) can be ranked the same way the backend does
 * for a fresh multi-upload comparison. */
export function rankResults(results: AnalysisResult[]): AnalysisResult[] {
  const ranked = [...results].sort((a, b) => b.overall_score - a.overall_score);

  return ranked.map((item, idx) => {
    let rankLabel: string | null = null;
    if (idx === 0) rankLabel = "Best Image";
    else if (idx === ranked.length - 1 && ranked.length > 1) rankLabel = "Worst Image";
    else if (idx === 1) rankLabel = "Second Best";

    return { ...item, rank: idx + 1, rank_label: rankLabel };
  });
}
