"use client";

import { useRef } from "react";
import Image from "next/image";
import { Board } from "@/components/ui/Board";
import { Reveal } from "@/components/ui/Reveal";
import { SmartLink } from "@/components/ui/SmartLink";
import { StatusRail } from "@/components/layout/StatusRail";
import { HERO, SITE } from "@/content/site";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Stars } from "@/components/ui/Stars";
import { asset } from "@/lib/basePath";
import { Arrow } from "@/components/ui/Arrow";

const HERO_SRC = "/img/hero-dim.webp";

/**
 * Split hero: the headline owns the left half at full size, the four product
 * lines sit in a glass card on the right.
 *
 * The single-card version put the type, the categories, the buttons, the
 * warranty and the rating inside one frame, which capped the headline at
 * whatever was left over — a made-to-measure glass company led by 64px type.
 * Splitting them lets the headline run to ~116px, and stops the card being a
 * container for everything so it can be one thing: the product chooser.
 *
 * Nothing was dropped in the move. The warranty and the volume figures sit
 * under the buttons on the left; the rating sits under the categories on the
 * right, at the point the four tiles have just been read.
 *
 * Dark ground on the hero-dim grade, with .wash-soft pulling the four washes
 * back: dark enough to sit white type on, light enough that the bathroom is
 * still a colour photograph rather than a black rectangle. White type throughout, and the headline itself is
 * brass — the same beige as the solid button, which makes the two loudest
 * things in the hero read as one accent rather than two.
 */
export function HeroSplit() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="hero-scope wash-soft relative flex min-h-svh flex-col overflow-hidden bg-black"
    >
      <Image
        src={asset(HERO_SRC)}
        alt="Made to measure glass shower screen in a modern bathroom"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Flat wash, then top-and-bottom so the header and the status rail have
          something to sit against, then a soft pool feathering the card into
          the photograph. All four alphas come from .hero-scope; the pool is
          pushed right of centre because that is where the card now sits. */}
      <div aria-hidden className="absolute inset-0 bg-[rgb(0_0_0/var(--wash-flat))]" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/var(--wash-edge-top)),transparent,rgb(0_0_0/var(--wash-edge-bot)))]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_58%_62%_at_72%_50%,rgb(0_0_0/var(--wash-pool)),transparent_76%)]"
      />

      <div className="layer flex flex-1 items-center px-6 py-24 lg:px-12 lg:py-16">
        <div className="mx-auto grid w-full max-w-[1460px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: the headline, at full size */}
          <Reveal variant="rise">
            <p className="mi text-[color:var(--w-55)]">
              Made to measure <span className="text-[color:var(--w-90)]">glass</span> since 2009
            </p>

            {/* Their own H1, covering all four product lines.
                Capped at 80px, not larger: the left column also carries the
                body copy, the buttons, the warranty and the volume figures,
                and at 116px the badge finished 178px below the fold on a
                855px viewport. 80px still sets four lines of display type
                against a half-width column, which is the effect wanted. */}
            <h1 className="dsp mt-6 text-balance text-[clamp(38px,4.2vw,80px)] text-brass">
              {HERO.headline}
              <br />
              <span className="text-white">{HERO.headlineDim}</span>
            </h1>

            <p className="bd mt-7 max-w-[42ch] text-[color:var(--w-55)]">{HERO.body}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <SmartLink href="#configurator" className="mi btn btn-solid">
                {HERO.cta}
                <Arrow />
              </SmartLink>
              <a href={SITE.phoneHref} className="mi btn">
                {SITE.phone}
              </a>
            </div>

            {/* Their warranty badge and the volume figures, on a rule so they
                read as credentials rather than as more body copy. */}
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-[color:var(--rule)] pt-7">
              <Image
                src={asset("/img/badges/3-Year-Warranty-Blue-BG.webp")}
                alt="Three year warranty"
                width={591}
                height={257}
                className="h-12 w-auto"
              />
              <p className="mi text-[color:var(--w-55)]">
                <span className="text-[color:var(--w-90)]">8,000+</span> clients
                <span className="mx-2 text-[color:var(--rule)]">/</span>
                <span className="text-[color:var(--w-90)]">10,000+</span> screens
              </p>
            </div>
          </Reveal>

          {/* Right: the product chooser, in glass */}
          <Reveal variant="rise">
            <GlassPanel
              src={asset(HERO_SRC)}
              coverOf={sectionRef}
              className="w-full"
            >
              <Board className="relative w-full bg-[rgb(0_0_0/var(--wash-panel))] px-7 py-8 sm:px-10 sm:py-10">
                <p className="mi text-[color:var(--w-32)]">What can we make you?</p>

                {/* Two-up rather than the four-across of the single-card hero:
                    at half width, four columns left each tile too narrow for
                    its label to hold one line. */}
                <nav className="mt-7 grid grid-cols-2 gap-px border border-[color:var(--rule)] bg-[color:var(--rule)]">
                  {HERO.categories.map((c) => (
                    <SmartLink
                      key={c.label}
                      href="#products"
                      className="group flex flex-col items-center gap-5 bg-[rgb(0_0_0/var(--wash-flat))] px-4 py-8 text-[color:var(--w-90)] transition-colors duration-500 hover:bg-[rgb(0_0_0/0.28)] hover:text-brass"
                    >
                      {/* Their own SVG, painted by CSS mask so the icon takes
                          its link's colour and the file stays untouched. */}
                      <span
                        aria-hidden
                        style={{
                          maskImage: `url(${asset(c.icon)})`,
                          WebkitMaskImage: `url(${asset(c.icon)})`,
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskPosition: "center",
                          maskSize: "contain",
                          WebkitMaskSize: "contain",
                        }}
                        className="h-12 w-12 flex-none bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-125"
                      />
                      <span className="mi inline-block text-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
                        {c.label}
                      </span>
                    </SmartLink>
                  ))}
                </nav>

                <SmartLink
                  href="#reviews"
                  className="group mt-8 flex items-center gap-4 border-t border-[color:var(--rule)] pt-7"
                >
                  <Stars
                    size={20}
                    label="Rated 5 out of 5"
                    className="text-brass transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-px"
                  />
                  <span className="mi leading-tight">
                    <span className="block text-[color:var(--w-90)]">Over 450 5-star reviews</span>
                    <span className="block text-[color:var(--w-32)]">
                      Google reviews
                    </span>
                  </span>
                </SmartLink>
              </Board>
            </GlassPanel>
          </Reveal>
        </div>
      </div>

      <div className="layer">
        <StatusRail />
      </div>
    </section>
  );
}
