"use client";

import Link from "next/link";
import { ArrowRight, ImageIcon, Star, TrendingUp, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { ScoreTimelineChart } from "@/components/dashboard/score-timeline-chart";
import { HistoryCard } from "@/components/history/history-card";
import { useDeleteHistoryItem, useHistory } from "@/hooks/use-analysis";

export default function DashboardPage() {
  const { data, isLoading } = useHistory();
  const items = data?.items ?? [];
  const deleteItem = useDeleteHistoryItem();

  const totalAnalyzed = items.length;
  const averageScore = totalAnalyzed
    ? Math.round(items.reduce((sum, i) => sum + i.overall_score, 0) / totalAnalyzed)
    : 0;
  const bestScore = totalAnalyzed ? Math.max(...items.map((i) => i.overall_score)) : 0;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-12 pt-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-sm text-foreground">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            An overview of your image evaluation activity.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/upload" />}>
          <UploadCloud className="size-3.5" />
          Upload image
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-8">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      ) : totalAnalyzed === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <ImageIcon className="size-6 text-muted-foreground/50" strokeWidth={1.5} />
          <p className="mt-2 text-base font-medium text-foreground">No images analyzed yet</p>
          <p className="text-sm text-muted-foreground">
            Upload your first photo to see your evaluation stats here.
          </p>
          <Button nativeButton={false} render={<Link href="/upload" />} className="mt-2">
            <UploadCloud className="size-3.5" />
            Upload your first image
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 divide-x divide-border">
            <StatCard label="Images Analyzed" value={totalAnalyzed} icon={ImageIcon} />
            <div className="pl-8">
              <StatCard label="Average Score" value={averageScore} icon={TrendingUp} />
            </div>
            <div className="pl-8">
              <StatCard label="Best Score" value={bestScore} icon={Star} />
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <p className="mb-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Score Timeline
            </p>
            <ScoreTimelineChart items={items} />
          </div>

          <div className="flex flex-col gap-5 border-t border-border pt-8">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Recent Activity
              </p>
              <Link
                href="/history"
                className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
              >
                View all
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {items.slice(0, 3).map((item) => (
                <HistoryCard key={item.id} item={item} onDelete={(id) => deleteItem.mutate(id)} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
