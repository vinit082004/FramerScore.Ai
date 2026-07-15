import { CheckCircle2, TriangleAlert } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RecommendationBanner({ result }: { result: AnalysisResult }) {
  const ready = result.rating === "Perfect" || result.rating === "Good";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4",
        ready ? "border-success/25 bg-success/5" : "border-warning/25 bg-warning/5"
      )}
    >
      {ready ? (
        <CheckCircle2 className="size-5 shrink-0 text-success" strokeWidth={1.75} />
      ) : (
        <TriangleAlert className="size-5 shrink-0 text-warning" strokeWidth={1.75} />
      )}
      <div>
        <p className="text-[15px] font-semibold text-foreground">
          {ready ? "Ready for Publishing" : "Needs Improvement"}
        </p>
        <p className="text-[13px] text-muted-foreground">{result.verdict_summary}</p>
      </div>
    </div>
  );
}
