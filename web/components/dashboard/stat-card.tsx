"use client";

import type { LucideIcon } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  const animated = useCountUp(value, 600);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-wide uppercase">{label}</span>
      </div>
      <span className="text-4xl font-semibold tabular-nums text-foreground">{animated}</span>
    </div>
  );
}
