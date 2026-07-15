import { Landmark, Newspaper, Trophy, Users } from "lucide-react";

const BENEFITS = [
  {
    icon: Trophy,
    title: "Sports organizations",
    description: "Screen player photos for databases and broadcast graphics at scale.",
  },
  {
    icon: Newspaper,
    title: "News & media",
    description: "Confirm wire photos meet publishing standards before they go live.",
  },
  {
    icon: Users,
    title: "Talent & casting",
    description: "Evaluate headshots for consistency across a roster or catalog.",
  },
  {
    icon: Landmark,
    title: "Public sector & AI teams",
    description: "Build clean, consistent image datasets with objective scoring.",
  },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Built for teams that publish images at scale
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {BENEFITS.map((benefit) => (
          <div
            key={benefit.title}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <benefit.icon className="size-4.5 text-foreground" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{benefit.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
