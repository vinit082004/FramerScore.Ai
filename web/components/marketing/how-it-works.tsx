const STEPS = [
  {
    step: "01",
    title: "Upload",
    description: "Drag and drop, browse, or paste an image directly into FrameScore AI.",
  },
  {
    step: "02",
    title: "AI Analysis",
    description: "Computer vision measures face, framing, sharpness, lighting and more.",
  },
  {
    step: "03",
    title: "Scoring",
    description: "Each parameter is scored 0–100 and combined into one suitability score.",
  },
  {
    step: "04",
    title: "Export",
    description: "Download a PDF, JSON, or CSV report to share or archive.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            How it works
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            From upload to report in seconds.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <div key={item.step}>
              <span className="text-sm font-semibold text-brand">{item.step}</span>
              <p className="mt-2 text-sm font-semibold text-foreground">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
