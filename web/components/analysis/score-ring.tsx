"use client";

import { motion } from "framer-motion";
import type { RatingTone } from "@/lib/types";
import { toneHex } from "@/lib/scoring/colors";
import { useCountUp } from "@/hooks/use-count-up";

interface ScoreRingProps {
  score: number;
  tone: RatingTone;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({ score, tone, size = 120, strokeWidth = 10 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = toneHex(tone);
  const animatedScore = useCountUp(score, 800);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-semibold tabular-nums text-foreground"
          style={{ fontSize: size * 0.26, letterSpacing: "-0.02em" }}
        >
          {animatedScore}
        </span>
        <span className="text-xs text-muted-foreground" style={{ fontSize: Math.max(11, size * 0.075) }}>
          / 100
        </span>
      </div>
    </div>
  );
}
