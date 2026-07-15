"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dropzone, type DropzoneHandle } from "@/components/upload/dropzone";
import { LoadingSequence } from "@/components/analysis/loading-sequence";
import { AnalysisResultView } from "@/components/analysis/analysis-result-view";
import { useAnalyzeImage, useHistory } from "@/hooks/use-analysis";
import { pushNotification } from "@/hooks/use-notifications";
import { assetUrl, getErrorMessage } from "@/lib/api/client";
import type { AnalysisResult } from "@/lib/types";

const MIN_ANALYSIS_MS = 3200;

export default function UploadPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const analyze = useAnalyzeImage();
  const dropzoneRef = useRef<DropzoneHandle>(null);
  const { data: history } = useHistory(6);

  const idle = !result && !analyze.isPending && !error;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "u" && idle) {
        e.preventDefault();
        dropzoneRef.current?.openFilePicker();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [idle]);

  async function handleFileSelected(file: File) {
    setError(null);
    setResult(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      const [analysis] = await Promise.all([
        analyze.mutateAsync(file),
        new Promise((resolve) => setTimeout(resolve, MIN_ANALYSIS_MS)),
      ]);
      setResult(analysis);
      pushNotification(
        `Analysis complete for ${file.name} — scored ${analysis.overall_score}/100 (${analysis.rating})`
      );
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong while analyzing this image."));
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setPreviewUrl(null);
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-12 pt-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Upload &amp; Evaluate
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Upload a photo to get an instant, AI-computed publishing score.
          </p>
        </div>
        {!idle && (
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="size-3.5" />
            Analyze another image
          </Button>
        )}
      </div>

      {result ? (
        <AnalysisResultView result={result} />
      ) : (
        <div className="grid grid-cols-[45fr_55fr] items-start gap-10">
          <div className="flex flex-col gap-5">
            {analyze.isPending && previewUrl ? (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Uploaded preview"
                  className="aspect-[4/5] w-full rounded-xl object-cover opacity-90"
                />
              </div>
            ) : (
              <>
                <Dropzone ref={dropzoneRef} onFileSelected={handleFileSelected} disabled={!idle} />
                <p className="text-center text-xs text-muted-foreground/70">
                  Press{" "}
                  <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-medium">
                    ⌘U
                  </kbd>{" "}
                  to upload from anywhere
                </p>
              </>
            )}

            {idle && history && history.items.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Recent uploads
                </p>
                <div className="flex gap-3">
                  {history.items.slice(0, 6).map((item) => (
                    <Link
                      key={item.id}
                      href={`/history/${item.id}`}
                      className="group relative size-16 shrink-0 overflow-hidden rounded-lg"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={assetUrl(item.thumbnail_url)}
                        alt={item.filename}
                        className="size-full object-cover transition-transform duration-200 group-hover:scale-110"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
            {analyze.isPending ? (
              <LoadingSequence />
            ) : error ? (
              <div className="flex flex-col items-center gap-3">
                <TriangleAlert className="size-7 text-danger" strokeWidth={1.5} />
                <div>
                  <p className="text-base font-medium text-foreground">Analysis failed</p>
                  <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                </div>
                <Button variant="outline" size="sm" onClick={reset}>
                  <RotateCcw className="size-3.5" />
                  Try again
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <LayoutDashboard className="size-6 text-muted-foreground/40" strokeWidth={1.5} />
                <p className="mt-1 text-[15px] font-medium text-foreground">
                  Your publishing score will appear here
                </p>
                <p className="max-w-xs text-[13px] text-muted-foreground">
                  Upload an image on the left to see the full analysis dashboard.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
