import { Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ParameterResult } from "@/lib/types";
import { scoreToTone } from "@/lib/scoring/colors";
import { StatusChip } from "@/components/analysis/status-chip";

export function ParameterGridCard({
  parameter,
  icon: Icon,
}: {
  parameter: ParameterResult;
  icon: LucideIcon;
}) {
  const tone = scoreToTone(parameter.score);

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
          </div>
          <p className="text-lg font-semibold text-foreground">{parameter.name}</p>
        </div>
        <span className="shrink-0 text-lg font-semibold tabular-nums text-foreground">
          {parameter.score}%
        </span>
      </div>

      <div className="mt-3">
        <StatusChip label={parameter.label} tone={tone} />
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{parameter.detail}</p>

      <div className="mt-4 flex items-start gap-2 border-t border-border pt-4">
        <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        <p className="text-[13px] text-muted-foreground">{parameter.suggestion}</p>
      </div>
    </div>
  );
}
