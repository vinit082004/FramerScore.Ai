"use client";

import Link from "next/link";
import { FileBarChart2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHistory } from "@/hooks/use-analysis";
import { exportUrl } from "@/lib/api/analysis";
import { assetUrl } from "@/lib/api/client";
import { formatDate } from "@/lib/format";
import { StatusChip } from "@/components/analysis/status-chip";

export default function ReportsPage() {
  const { data, isLoading } = useHistory();
  const items = data?.items ?? [];

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-12 pt-8 pb-12">
      <div>
        <h1 className="text-display-sm text-foreground">Reports</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Export any past evaluation as a PDF, JSON, or CSV report.
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-24 text-center">
          <FileBarChart2 className="size-6 text-muted-foreground/50" strokeWidth={1.5} />
          <p className="mt-2 text-base font-medium text-foreground">No reports yet</p>
          <p className="text-sm text-muted-foreground">
            Analyze an image to generate your first report.
          </p>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div>
          <div className="grid grid-cols-[1fr_140px_100px_140px_220px] gap-4 border-b border-border pb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <span>Image</span>
            <span>Date</span>
            <span>Score</span>
            <span>Rating</span>
            <span className="text-right">Export</span>
          </div>
          {items.map((item) => (
            <div
              key={item.id}
              className="-mx-3 grid grid-cols-[1fr_140px_100px_140px_220px] items-center gap-4 rounded-lg border-b border-border px-3 py-4 transition-colors duration-150 last:border-0 hover:bg-secondary/40"
            >
              <Link href={`/history/${item.id}`} className="flex min-w-0 items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={assetUrl(item.thumbnail_url)}
                  alt={item.filename}
                  className="size-10 shrink-0 rounded-lg object-cover"
                />
                <span className="truncate text-sm text-foreground">{item.filename}</span>
              </Link>
              <span className="text-sm text-muted-foreground">{formatDate(item.created_at)}</span>
              <span className="text-sm font-medium tabular-nums text-foreground">
                {item.overall_score}
              </span>
              <StatusChip label={item.rating} tone={item.rating_tone} />
              <div className="flex justify-end gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<a href={exportUrl(item.id, "json")} download />}
                >
                  <FileDown className="size-3.5" />
                  JSON
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<a href={exportUrl(item.id, "csv")} download />}
                >
                  <FileDown className="size-3.5" />
                  CSV
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
