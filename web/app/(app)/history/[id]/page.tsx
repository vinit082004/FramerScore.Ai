"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalysisResultView } from "@/components/analysis/analysis-result-view";
import { useHistoryItem } from "@/hooks/use-analysis";

export default function HistoryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isError } = useHistoryItem(params.id);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-12 pt-8 pb-12">
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => router.push("/history")}>
        <ArrowLeft className="size-3.5" />
        Back to history
      </Button>

      {isLoading && (
        <div className="grid grid-cols-[380px_1fr] gap-14">
          <Skeleton className="aspect-[4/5] rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-24 text-center">
          <TriangleAlert className="size-6 text-muted-foreground/50" strokeWidth={1.5} />
          <p className="text-base font-medium text-foreground">Analysis not found</p>
          <p className="text-sm text-muted-foreground">This entry may have been deleted.</p>
        </div>
      )}

      {data && <AnalysisResultView result={data} />}
    </div>
  );
}
