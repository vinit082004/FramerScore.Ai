import Link from "next/link";
import { PlayCircle, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
      <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
        AI-powered image evaluation
      </span>
      <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Evaluate Images Like a Professional.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
        AI-powered image quality analysis for sports, entertainment, news and media
        organizations.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" nativeButton={false} render={<Link href="/upload" />}>
          <UploadCloud className="size-4" />
          Upload Image
        </Button>
        <Button size="lg" variant="outline" nativeButton={false} render={<a href="#live-preview" />}>
          <PlayCircle className="size-4" />
          Watch Demo
        </Button>
      </div>
    </section>
  );
}
