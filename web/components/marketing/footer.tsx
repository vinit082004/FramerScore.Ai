import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 sm:flex-row sm:justify-between">
        <BrandMark />
        <nav className="flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
            How it works
          </a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">
            FAQ
          </a>
          <Link href="/upload" className="text-sm text-muted-foreground hover:text-foreground">
            Open App
          </Link>
        </nav>
      </div>
    </footer>
  );
}
