import Link from "next/link";
import { Crown, TrendingDown, TrendingUp } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { assetUrl } from "@/lib/api/client";
import { ScoreRing } from "@/components/analysis/score-ring";
import { StarRating } from "@/components/analysis/star-rating";
import { TONE_CLASSES } from "@/lib/scoring/colors";

const RANK_STYLES: Record<string, { icon: typeof Crown; className: string }> = {
  "Best Image": { icon: Crown, className: "bg-success/10 text-success" },
  "Second Best": { icon: TrendingUp, className: "bg-brand/10 text-brand" },
  "Worst Image": { icon: TrendingDown, className: "bg-danger/10 text-danger" },
};

export function CompareCard({ result }: { result: AnalysisResult }) {
  const classes = TONE_CLASSES[result.rating_tone];
  const rankStyle = result.rank_label ? RANK_STYLES[result.rank_label] : undefined;
  const RankIcon = rankStyle?.icon;

  return (
    <div className="group flex flex-col gap-4 transition-transform duration-200 ease-out hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetUrl(result.thumbnail_url)}
          alt={result.filename}
          className="h-52 w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
        />
        {rankStyle && RankIcon && (
          <span
            className={`absolute top-3 left-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${rankStyle.className}`}
          >
            <RankIcon className="size-3.5" />
            {result.rank_label}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ScoreRing score={result.overall_score} tone={result.rating_tone} size={68} strokeWidth={6} />
        <div>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${classes.bg} ${classes.text}`}>
            {result.rating}
          </span>
          <div className="mt-1.5">
            <StarRating value={result.star_rating} />
          </div>
        </div>
      </div>

      <p className="truncate text-xs text-muted-foreground">{result.filename}</p>

      <ul className="flex flex-col gap-1.5 border-t border-border pt-3">
        {result.parameters
          .filter((p) => p.id !== "overall_suitability")
          .slice(0, 4)
          .map((p) => (
            <li key={p.id} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{p.name}</span>
              <span className="font-medium text-foreground">{p.score}</span>
            </li>
          ))}
      </ul>

      <Link
        href={`/history/${result.id}`}
        className="text-xs font-medium text-brand hover:underline"
      >
        View full report →
      </Link>
    </div>
  );
}
