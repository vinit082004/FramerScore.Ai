import { ScanFace } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ScanFace className="size-4" strokeWidth={2} />
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        FrameScore AI
      </span>
    </div>
  );
}
