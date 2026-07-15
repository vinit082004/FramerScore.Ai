import { Sparkles } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

export function AiSummaryCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-brand" strokeWidth={1.75} />
        <p className="text-lg font-semibold text-foreground">AI Summary</p>
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-foreground">{result.verdict_summary}</p>

      <ul className="mt-4 flex flex-col gap-2">
        {result.verdict_reasons.map((reason, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[15px] text-foreground">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
