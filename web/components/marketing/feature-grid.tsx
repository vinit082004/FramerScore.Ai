import {
  BadgeCheck,
  Compass,
  Crosshair,
  Focus,
  Layers,
  Maximize,
  ScanFace,
  Sun,
  Users,
  Activity,
  type LucideIcon,
} from "lucide-react";

const FEATURES: { icon: LucideIcon; name: string; description: string }[] = [
  { icon: ScanFace, name: "Face Visibility", description: "Detects if the face is clear, partial, or blocked." },
  { icon: Compass, name: "Face Orientation", description: "Measures head pose from front-facing to profile." },
  { icon: Focus, name: "Image Sharpness", description: "Flags blur and out-of-focus shots via edge analysis." },
  { icon: Users, name: "Subject Count", description: "Counts people in frame, from solo to crowd." },
  { icon: Activity, name: "Subject Movement", description: "Estimates posture, from standing to sports action." },
  { icon: Crosshair, name: "Subject Centering", description: "Checks framing against the center of the shot." },
  { icon: Sun, name: "Lighting", description: "Analyzes exposure, brightness and contrast." },
  { icon: Maximize, name: "Image Resolution", description: "Confirms the image meets publishing resolution." },
  { icon: Layers, name: "Background Distraction", description: "Measures how busy or clean the backdrop is." },
  { icon: BadgeCheck, name: "Overall Suitability", description: "Combines every signal into one publish-ready score." },
];

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Ten signals, one score
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Every upload is measured across the same evaluation criteria used by media and
          sports organizations.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {FEATURES.map((feature) => (
          <div
            key={feature.name}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <feature.icon className="size-5 text-brand" strokeWidth={2} />
            <p className="mt-3 text-sm font-semibold text-foreground">{feature.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
