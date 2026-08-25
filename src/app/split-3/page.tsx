import { Header } from "@/components/layout/Header";
import { HeroSplitLight } from "@/components/sections/HeroSplitLight";
import { Intro } from "@/components/sections/Intro";
import { Products } from "@/components/sections/Products";
import { Gallery } from "@/components/sections/Gallery";
import { WhyUs } from "@/components/sections/WhyUs";
import { Configurator } from "@/components/sections/Configurator";
import { Process } from "@/components/sections/Process";
import { Proof } from "@/components/sections/Proof";
import { Story } from "@/components/sections/Story";
import { Showroom } from "@/components/sections/Showroom";
import { Faq } from "@/components/sections/Faq";
import { Blog } from "@/components/sections/Blog";
import { Closing } from "@/components/sections/Closing";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { ReviewWall } from "@/components/sections/ReviewWall";
import { MadeHere } from "@/components/sections/MadeHere";
import { ImpactStat } from "@/components/sections/ImpactStat";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { Marquee } from "@/components/sections/Marquee";
import { StillUnsure } from "@/components/sections/StillUnsure";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { MetricsPanel } from "@/components/sections/MetricsPanel";
import { AdvantageGrid } from "@/components/sections/AdvantageGrid";
import { StepsRow } from "@/components/sections/StepsRow";
import { Timeline } from "@/components/sections/Timeline";
import { TierTable } from "@/components/sections/TierTable";
import { Belief } from "@/components/sections/Belief";
import { GetInTouch } from "@/components/sections/GetInTouch";
import { PullQuote } from "@/components/ui/PullQuote";
import { FloatingCta } from "@/components/layout/FloatingCta";

/*
 * split-3 — the split hero at full brightness.
 *
 * Identical to /split below the fold; the hero is the only difference, which
 * is the only thing being compared. There the photograph is graded down under
 * four washes and the card is tinted near-black with white type. Here the
 * photograph runs at its own brightness with no wash at all, the frost is
 * white, and the type is navy.
 *
 * Layout comparison. Everything below the hero is the same shared set of
 * section components as the other builds, so the pages cannot drift apart —
 * the hero is the only difference, which is the only thing being compared.
 *
 * Order is argued rather than inherited from their site: claim (intro) →
 * product → work → why → how → proof → who → showroom → answers → journal.
 * The pull-quotes are spaced so a customer voice lands straight after the two
 * places the page asks you to believe something — the product run and the
 * six reasons — rather than all being pooled in one testimonials block.
 */
export const metadata = {
  title: "Gold Coast Shower Screens — Bright Split",
  // Comparison page, not a real route the client should rank for.
  robots: { index: false, follow: false },
};

export default function SplitHero() {
  return (
    <div className="rk bg-[color:var(--rk-ground)]">
      <Header light />
      <main>
        <HeroSplitLight />
        <Intro />
        <HowWeWork />
        <Products />
        <ServiceCards />
        <Marquee />
        <ImpactStat />
        <MetricsPanel />
        <Gallery />
        <WhyUs />
        <AdvantageGrid />
        <PullQuote index={1} tone="navy" />
        <CaseStudy />
        <Configurator />
        <Process />
        <StepsRow />
        <Timeline />
        <Proof />
        <MadeHere />
        <Story />
        <Showroom />
        <TierTable />
        <Belief />
        <PullQuote index={2} />
        <ReviewWall />
        <Faq />
        <Blog />
        <StillUnsure />
        <GetInTouch />
        <Closing />
        <ContactFooter />
      </main>
      <FloatingCta />
    </div>
  );
}
