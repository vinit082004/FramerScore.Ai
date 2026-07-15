"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/types";
import { exportUrl } from "@/lib/api/analysis";
import { exportAnalysisPdf } from "@/lib/export/pdf";

export function ExportActions({ result }: { result: AnalysisResult }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => exportAnalysisPdf(result)}>
        <FileDown className="size-3.5" />
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={<a href={exportUrl(result.id, "json")} download />}
      >
        <FileDown className="size-3.5" />
        JSON
      </Button>
      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={<a href={exportUrl(result.id, "csv")} download />}
      >
        <FileDown className="size-3.5" />
        CSV
      </Button>
    </div>
  );
}
