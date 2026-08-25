import { HeaderLight } from "@/components/v2/HeaderLight";
import { HeroDeck } from "@/components/v2/HeroDeck";
import { StatementIntro } from "@/components/v2/StatementIntro";
import { ProductAccordion } from "@/components/v2/ProductAccordion";
import { MosaicGallery } from "@/components/v2/MosaicGallery";
import { BentoWhy } from "@/components/v2/BentoWhy";
import { ProcessRail } from "@/components/v2/ProcessRail";
import { QuoteColumns } from "@/components/v2/QuoteColumns";
import { ShowroomBand } from "@/components/v2/ShowroomBand";
import { FaqLight } from "@/components/v2/FaqLight";
import { FooterLight } from "@/components/v2/FooterLight";
import { Configurator } from "@/components/sections/Configurator";

/*
 * split-2 — a second home page, rebuilt rather than restyled.
 *
 * Every section is a different construction to its opposite number on /split,
 * not the same layout with new colours:
 *
 *   hero        image chips in the H1 + a fanned card deck  (was: glass card cut into a dark photo)
 *   intro       one oversized claim + marks             (was: offset columns + figures)
 *   products    horizontal accordion, one screen        (was: sticky index, five screens)
 *   gallery     reactive mosaic, page holds still       (was: pinned, scroll-driven filmstrip)
 *   why         bento of unequal cells                  (was: single-column accordion)
 *   process     rail that fills with scroll position    (was: numbered list on navy)
 *   reviews     three vertical drifting columns         (was: two horizontal rails on navy)
 *   showroom    full-bleed plate, frosted card on it    (was: equal side-by-side columns)
 *   faq         two columns of cards                    (was: one full-width accordion)
 *   footer      light, with a single navy CTA card      (was: full navy slab)
 *
 * The page is light end to end — including the header, which floats as a pill
 * and frosts on scroll instead of hardening to black. Geometry is rounded here
 * where v1 is hard-cornered; that is the fastest way to tell the two apart at a
 * glance, which is the point of having both.
 *
 * The configurator is the one component shared with v1 — it is a working
 * estimator rather than a layout, and rebuilding it would only risk breaking it.
 */
export const metadata = {
  title: "Gold Coast Shower Screens — Light Build",
  // Comparison page, not a real route the client should rank for.
  robots: { index: false, follow: false },
};

export default function SplitTwo() {
  return (
    <>
      <HeaderLight />
      <main>
        <HeroDeck />
        <StatementIntro />
        <ProductAccordion />
        <MosaicGallery />
        <BentoWhy />
        <ProcessRail />
        <QuoteColumns />
        <ShowroomBand />
        <Configurator />
        <FaqLight />
        <FooterLight />
      </main>
    </>
  );
}
