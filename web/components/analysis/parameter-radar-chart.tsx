"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { ParameterResult } from "@/lib/types";

const SHORT_LABELS: Record<string, string> = {
  face_visibility: "Visibility",
  face_orientation: "Orientation",
  sharpness: "Sharpness",
  subject_count: "Count",
  movement: "Movement",
  centering: "Centering",
  lighting: "Lighting",
  resolution: "Resolution",
  background: "Background",
};

export function ParameterRadarChart({
  parameters,
  height = 288,
}: {
  parameters: ParameterResult[];
  height?: number;
}) {
  const data = parameters
    .filter((p) => p.id !== "overall_suitability")
    .map((p) => ({ name: SHORT_LABELS[p.id] ?? p.name, score: p.score }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="score"
            stroke="#2563EB"
            fill="#2563EB"
            fillOpacity={0.08}
            strokeWidth={1.5}
            animationDuration={700}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
