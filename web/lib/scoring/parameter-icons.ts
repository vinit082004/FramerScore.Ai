import {
  Activity,
  BadgeCheck,
  Compass,
  Crosshair,
  Focus,
  Layers,
  Maximize,
  ScanFace,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react";

export const PARAMETER_ICONS: Record<string, LucideIcon> = {
  face_visibility: ScanFace,
  face_orientation: Compass,
  sharpness: Focus,
  subject_count: Users,
  movement: Activity,
  centering: Crosshair,
  lighting: Sun,
  resolution: Maximize,
  background: Layers,
  overall_suitability: BadgeCheck,
};
