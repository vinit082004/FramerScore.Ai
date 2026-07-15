"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCcw, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiDropzone } from "@/components/upload/multi-dropzone";
import { CompareCard } from "@/components/compare/compare-card";
import { LoadingSequence } from "@/components/analysis/loading-sequence";
import { useCompareImages, useHistoryItemsByIds } from "@/hooks/use-analysis";
import { rankResults } from "@/lib/compare-rank";
import { getErrorMessage } from "@/lib/api/client";
import type { AnalysisResult } from "@/lib/types";

function ComparePageContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  const ids = useMemo(() => (idsParam ? idsParam.split(",").filter(Boolean) : []), [idsParam]);
  const idsQuery = useHistoryItemsByIds(ids);

  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const compare = useCompareImages();

  function addFiles(newFiles: File[]) {
    setFiles((prev) => [...prev, ...newFiles].slice(0, 6));
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function runCompare() {
    setError(null);
    try {
      const response = await compare.mutateAsync(files);
      setResults(response.items);
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong while comparing these images."));
    }
  }

  function reset() {
    setFiles([]);
    setResults(null);
    setError(null);
  }

  if (ids.length > 0) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-12 pt-8 pb-12">
        <div>
          <h1 className="text-display-sm text-foreground">Compare</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {ids.length} images selected from your history.
          </p>
        </div>

        {idsQuery.isLoading && (
          <div className="grid grid-cols-3 gap-6">
            {ids.map((id) => (
              <Skeleton key={id} className="h-96 rounded-lg" />
            ))}
          </div>
        )}

        {idsQuery.isError && (
          <div className="flex flex-col items-center gap-2 py-24 text-center">
            <TriangleAlert className="size-6 text-danger" strokeWidth={1.5} />
            <p className="text-base font-medium text-foreground">Couldn&apos;t load these images</p>
            <p className="text-sm text-muted-foreground">One or more selected analyses may have been deleted.</p>
          </div>
        )}

        {idsQuery.data && (
          <div className="grid grid-cols-3 gap-6">
            {rankResults(idsQuery.data).map((result) => (
              <CompareCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-12 pt-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-sm text-foreground">Compare</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload 2–6 images to see which one scores best.
          </p>
        </div>
        {(files.length > 0 || results) && (
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="size-3.5" />
            Start over
          </Button>
        )}
      </div>

      {!results && !compare.isPending && (
        <div className="flex flex-col gap-5">
          <MultiDropzone onFilesSelected={addFiles} disabled={files.length >= 6} />

          {files.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {files.map((file, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <button
                    onClick={() => removeFile(i)}
                    aria-label={`Remove ${file.name}`}
                    className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-foreground text-background"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {files.length >= 2 && (
            <Button className="w-fit" onClick={runCompare}>
              Compare {files.length} images
            </Button>
          )}
          {files.length === 1 && (
            <p className="text-sm text-muted-foreground">Add at least one more image to compare.</p>
          )}
        </div>
      )}

      {compare.isPending && (
        <div className="flex flex-col items-center gap-8 py-16">
          <LoadingSequence />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <TriangleAlert className="size-6 text-danger" strokeWidth={1.5} />
          <p className="text-base font-medium text-foreground">Comparison failed</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="size-3.5" />
            Try again
          </Button>
        </div>
      )}

      {results && (
        <div className="grid grid-cols-3 gap-6">
          {results.map((result) => (
            <CompareCard key={result.id} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-12 pt-8 pb-12">
          <Skeleton className="h-96 rounded-lg" />
        </div>
      }
    >
      <ComparePageContent />
    </Suspense>
  );
}
