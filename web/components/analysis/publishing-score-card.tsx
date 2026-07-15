import type { AnalysisResult } from "@/lib/types";
import { ScoreRing } from "@/components/analysis/score-ring";
import { StatusChip } from "@/components/analysis/status-chip";

export function PublishingScoreCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center gap-8">
        <ScoreRing score={result.overall_score} tone={result.rating_tone} size={144} strokeWidth={10} />

        <div className="flex flex-1 flex-col gap-4">
          <div>
            <p className="text-[13px] font-medium tracking-wide text-muted-foreground uppercase">
              Publishing Score
            </p>
            <div className="mt-1.5">
              <StatusChip label={result.rating} tone={result.rating_tone} />
            </div>
          </div>

          <div className="flex gap-10 border-t border-border pt-4">
            <div>
              <p className="text-[13px] text-muted-foreground">Confidence</p>
              <p className="text-lg font-semibold tabular-nums text-foreground">
                {result.confidence}%
              </p>
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground">Processing Time</p>
              <p className="text-lg font-semibold tabular-nums text-foreground">
                {result.processing_time_seconds.toFixed(1)}s
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
