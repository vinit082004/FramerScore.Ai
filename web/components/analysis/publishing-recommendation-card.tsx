import { CheckCircle2, XCircle } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { StatusChip } from "@/components/analysis/status-chip";

export function PublishingRecommendationCard({ result }: { result: AnalysisResult }) {
  const pros = result.feedback.filter((f) => f.type === "positive").map((f) => f.message);
  const cons = result.feedback.filter((f) => f.type === "warning").map((f) => f.message);
  const ready = result.rating === "Perfect" || result.rating === "Good";

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <p className="text-lg font-semibold text-foreground">Publishing Recommendation</p>

      <div className="mt-4 grid flex-1 grid-cols-2 gap-6">
        <div>
          <p className="text-[13px] font-medium tracking-wide text-success uppercase">Pros</p>
          <ul className="mt-2 flex flex-col gap-2">
            {pros.length > 0 ? (
              pros.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] text-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={1.75} />
                  {p}
                </li>
              ))
            ) : (
              <li className="text-[13px] text-muted-foreground">No standout strengths detected.</li>
            )}
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-medium tracking-wide text-danger uppercase">Cons</p>
          <ul className="mt-2 flex flex-col gap-2">
            {cons.length > 0 ? (
              cons.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] text-foreground">
                  <XCircle className="mt-0.5 size-4 shrink-0 text-danger" strokeWidth={1.75} />
                  {c}
                </li>
              ))
            ) : (
              <li className="text-[13px] text-muted-foreground">No issues detected.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="text-[13px] font-medium tracking-wide text-muted-foreground uppercase">
          Final Decision
        </span>
        <StatusChip
          label={ready ? "Ready for Publishing" : "Needs Improvement"}
          tone={ready ? "success" : "warning"}
        />
      </div>
    </div>
  );
}
