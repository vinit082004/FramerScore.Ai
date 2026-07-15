import { ScoreRing } from "@/components/analysis/score-ring";
import { StarRating } from "@/components/analysis/star-rating";
import { ParameterRadarChart } from "@/components/analysis/parameter-radar-chart";
import { ParameterCard } from "@/components/analysis/parameter-card";
import { VerdictPanel } from "@/components/analysis/verdict-panel";
import { FeedbackList } from "@/components/analysis/feedback-list";
import { SAMPLE_RESULT } from "@/lib/marketing/sample-result";

export function LivePreview() {
  const result = SAMPLE_RESULT;

  return (
    <section id="live-preview" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          See a real evaluation
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          This is the exact report FrameScore AI generates for every upload &mdash; no
          screenshots, just the real interface.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6">
            <ScoreRing score={result.overall_score} tone={result.rating_tone} />
            <div className="space-y-1.5">
              <p className="text-lg font-semibold text-foreground">{result.rating} Image</p>
              <StarRating value={result.star_rating} />
              <p className="text-xs text-muted-foreground">{result.filename}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">Parameter Overview</h3>
            <ParameterRadarChart parameters={result.parameters} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {result.parameters.slice(0, 4).map((parameter) => (
              <ParameterCard key={parameter.id} parameter={parameter} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <VerdictPanel result={result} />
          <FeedbackList feedback={result.feedback} suggestion={result.suggestion} />
        </div>
      </div>
    </section>
  );
}
