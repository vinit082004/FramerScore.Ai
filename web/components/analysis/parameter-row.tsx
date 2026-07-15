"use client";

import { Info } from "lucide-react";
import { motion } from "framer-motion";
import type { ParameterResult } from "@/lib/types";
import { scoreToTone, TONE_CLASSES } from "@/lib/scoring/colors";
import { StatusChip } from "@/components/analysis/status-chip";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { LucideIcon } from "lucide-react";

interface ParameterRowProps {
  parameter: ParameterResult;
  icon: LucideIcon;
}

export function ParameterRow({ parameter, icon: Icon }: ParameterRowProps) {
  const tone = scoreToTone(parameter.score);
  const classes = TONE_CLASSES[tone];

  return (
    <div className="-mx-3 flex items-center gap-4 rounded-lg px-3 py-3 transition-colors duration-150 hover:bg-secondary/50">
      <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />

      <div className="w-32 shrink-0 text-sm text-foreground">{parameter.name}</div>

      <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className={`h-full rounded-full ${classes.solidBg}`}
          initial={{ width: 0 }}
          animate={{ width: `${parameter.score}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <span className="w-8 shrink-0 text-right text-sm font-medium tabular-nums text-foreground">
        {parameter.score}
      </span>

      <div className="w-32 shrink-0">
        <StatusChip label={parameter.label} tone={tone} />
      </div>

      <Tooltip>
        <TooltipTrigger
          render={<button type="button" className="shrink-0 text-muted-foreground/60 hover:text-muted-foreground" />}
        >
          <Info className="size-3.5" strokeWidth={1.75} />
          <span className="sr-only">Why this score</span>
        </TooltipTrigger>
        <TooltipContent side="left">{parameter.detail}</TooltipContent>
      </Tooltip>
    </div>
  );
}
