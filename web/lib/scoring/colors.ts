import type { RatingTone } from "@/lib/types";

interface ToneClasses {
  text: string;
  bg: string;
  border: string;
  solidBg: string;
}

export const TONE_CLASSES: Record<RatingTone, ToneClasses> = {
  success: {
    text: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    solidBg: "bg-success",
  },
  brand: {
    text: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/30",
    solidBg: "bg-brand",
  },
  warning: {
    text: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    solidBg: "bg-warning",
  },
  danger: {
    text: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
    solidBg: "bg-danger",
  },
};

const TONE_HEX: Record<RatingTone, string> = {
  success: "#22C55E",
  brand: "#2563EB",
  warning: "#F59E0B",
  danger: "#EF4444",
};

export function toneHex(tone: RatingTone): string {
  return TONE_HEX[tone];
}

export function scoreToTone(score: number): RatingTone {
  if (score >= 85) return "success";
  if (score >= 70) return "brand";
  if (score >= 50) return "warning";
  return "danger";
}
