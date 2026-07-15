import { CheckCircle2, Lightbulb, TriangleAlert } from "lucide-react";
import type { FeedbackItem } from "@/lib/types";

export function FeedbackList({
  feedback,
  suggestion,
}: {
  feedback: FeedbackItem[];
  suggestion: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Detected Issues &amp; Highlights
      </p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {feedback.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            {item.type === "positive" ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={1.75} />
            ) : (
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" strokeWidth={1.75} />
            )}
            <span className="text-foreground">{item.message}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-start gap-2.5 border-t border-border pt-4">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.75} />
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Recommendation
          </p>
          <p className="mt-1 text-sm text-foreground">{suggestion}</p>
        </div>
      </div>
    </div>
  );
}
