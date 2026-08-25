import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Products } from "@/components/sections/Products";
import { Gallery } from "@/components/sections/Gallery";
import { WhyUs } from "@/components/sections/WhyUs";
import { Configurator } from "@/components/sections/Configurator";
import { Process } from "@/components/sections/Process";
import { Proof } from "@/components/sections/Proof";
import { Faq } from "@/components/sections/Faq";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { FloatingCta } from "@/components/layout/FloatingCta";

/*
 * Comparison build: identical to the home page in every respect except the
 * hero grade, which runs in colour here instead of black & white.
 *
 * Deliberately composed from the same section components rather than copied,
 * so the two pages cannot drift apart while the decision is being made — every
 * later change lands on both, and the only difference stays the one thing
 * being compared.
 */
export const metadata = {
  title: "Gold Coast Shower Screens — Colour Hero",
  // Comparison page, not a real route the client should rank for.
  robots: { index: false, follow: false },
};

export default function ColourHero() {
  return (
    <>
      <Header />
      <main>
        <Hero variant="colour" />
        <Intro />
        <Products />
        <Gallery />
        <WhyUs />
        <Configurator />
        <Process />
        <Proof />
        <Faq />
      </main>
      <ContactFooter />
    </>
  );
}
