"use client";

import { motion } from "framer-motion";
import type { ParameterResult } from "@/lib/types";
import { scoreToTone, TONE_CLASSES } from "@/lib/scoring/colors";

export function ParameterCard({ parameter }: { parameter: ParameterResult }) {
  const tone = scoreToTone(parameter.score);
  const classes = TONE_CLASSES[tone];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{parameter.name}</p>
          <p className={`text-xs font-medium ${classes.text}`}>{parameter.label}</p>
        </div>
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {parameter.score}
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className={`h-full rounded-full ${classes.solidBg}`}
          initial={{ width: 0 }}
          animate={{ width: `${parameter.score}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{parameter.detail}</p>
    </div>
  );
}
