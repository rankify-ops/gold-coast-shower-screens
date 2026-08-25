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
 * Slab order matters as much as section order. The grounds run
 *
 *   dark / paper / mist / paper / mist / paper / NAVY / paper / mist / NAVY
 *
 * so no two adjacent sections share a ground and every transition is a hard
 * cut. The body is light throughout; navy appears exactly twice — the process
 * block and the footer — which keeps it reading as the brand colour rather
 * than as a background. The hero keeps its dark treatment because a graded
 * photograph needs a dark surround to hold its blacks.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
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
