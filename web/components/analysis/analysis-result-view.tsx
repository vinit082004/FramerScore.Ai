import Link from "next/link";
import { UploadCloud } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { assetUrl } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { formatDate, formatFileSize, formatMegapixels } from "@/lib/format";
import { PublishingScoreCard } from "@/components/analysis/publishing-score-card";
import { RecommendationBanner } from "@/components/analysis/recommendation-banner";
import { ParameterGrid } from "@/components/analysis/parameter-grid";
import { ParameterRadarChart } from "@/components/analysis/parameter-radar-chart";
import { AiSummaryCard } from "@/components/analysis/ai-summary-card";
import { PublishingRecommendationCard } from "@/components/analysis/publishing-recommendation-card";

export function AnalysisResultView({ result }: { result: AnalysisResult }) {
  return (
    <div className="grid grid-cols-[45fr_55fr] items-start gap-10">
      {/* Left column — image + metadata */}
      <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetUrl(result.thumbnail_url)}
          alt={result.filename}
          className="aspect-[4/5] w-full rounded-xl object-cover"
        />

        <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5">
          <InfoRow label="Filename" value={result.filename} />
          <InfoRow label="Resolution" value={formatMegapixels(result.width, result.height)} />
          <InfoRow label="Dimensions" value={`${result.width} × ${result.height} px`} />
          <InfoRow label="Size" value={formatFileSize(result.file_size_bytes)} />
          <InfoRow label="Upload Date" value={formatDate(result.created_at)} />
        </div>

        <Button
          size="xl"
          className="mt-6 w-full"
          nativeButton={false}
          render={<Link href="/upload" />}
        >
          <UploadCloud className="size-4" />
          Upload another image
        </Button>
      </div>

      {/* Right column — analysis */}
      <div className="flex flex-col gap-6">
        <PublishingScoreCard result={result} />
        <RecommendationBanner result={result} />

        <ParameterGrid parameters={result.parameters} />

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="mb-2 text-lg font-semibold text-foreground">Parameter Overview</p>
          <ParameterRadarChart parameters={result.parameters} height={450} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <AiSummaryCard result={result} />
          <PublishingRecommendationCard result={result} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[15px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate pl-4 font-medium text-foreground">{value}</span>
    </div>
  );
}
