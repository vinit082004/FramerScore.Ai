import type { RatingTone } from "@/lib/types";
import { TONE_CLASSES } from "@/lib/scoring/colors";

export function StatusChip({ label, tone }: { label: string; tone: RatingTone }) {
  const classes = TONE_CLASSES[tone];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${classes.bg} ${classes.text}`}
    >
      {label}
    </span>
  );
}
