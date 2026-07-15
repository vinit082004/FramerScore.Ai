import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { Hero } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Benefits } from "@/components/marketing/benefits";
import { LivePreview } from "@/components/marketing/live-preview";
import { Faq } from "@/components/marketing/faq";
import { Footer } from "@/components/marketing/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-col">
      <MarketingNavbar />
      <main className="flex-1">
        <Hero />
        <FeatureGrid />
        <HowItWorks />
        <Benefits />
        <LivePreview />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
