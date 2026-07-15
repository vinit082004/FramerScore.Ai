import { Sparkles } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

export function VerdictPanel({ result }: { result: AnalysisResult }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Sparkles className="size-3.5 text-brand" />
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {result.verdict_title}
        </p>
      </div>

      <p className="mt-2.5 text-[15px] leading-relaxed text-foreground">
        {result.verdict_summary}
      </p>

      <ul className="mt-4 flex flex-col gap-2">
        {result.verdict_reasons.map((reason, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
