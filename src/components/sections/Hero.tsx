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

/**
 * Four stacked planes: graded photograph, two washes, artboard panel, status
 * rail. Grain sits over the lot, painted on <body>.
 *
 * Three grades exist so the treatment can be compared:
 *   bw       (/)         mono, heaviest grade
 *   colour   (/colour)   darkened hard, saturation pushed to compensate
 *   natural  (/natural)  brightness only, colour exactly as shot
 *
 * The photograph is graded in scripts/grade-images.mjs —
 * glass only reads as glass when the specular hits stand against a dark
 * ground, and it resolves the client's mixed bathroom photography into one
 * consistent set.
 */
const HERO_IMAGE = {
  bw: "/img/hero-bw.webp",
  colour: "/img/hero-colour.webp",
  natural: "/img/hero-natural.webp",
} as const;

export function Hero({ variant = "bw" }: { variant?: keyof typeof HERO_IMAGE }) {
  const src = HERO_IMAGE[variant];
  // The natural grade runs the photograph at its own brightness, so the hero
  // sits on a light ground and the whole scope flips: navy type, white washes.
  // Everything below reads the --wash-* alphas and the white-alpha ramp,
  // all of which .hero-light re-points — so there is no second copy of
  // this markup.
  const light = variant === "natural";
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      id="top"
      className={`relative flex min-h-svh flex-col overflow-hidden ${
        light ? "hero-light bg-mist" : "hero-scope bg-black"
      }`}
    >
      <Image
        src={asset(src)}
        alt="Made to measure glass shower screen in a modern bathroom"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/*
          Three washes, each doing one job, so the photograph stays as light as
          it can while the type still reads.

          A flat 55% scrim used to carry all of this, which meant the whole
          frame paid for contrast that only the middle of it actually needed.
          Now the flat wash is light, and the darkness is concentrated where
          the card sits.
      */}

      {/* 1. Light overall wash — knocks the glare off the tiles, nothing more. */}
      <div aria-hidden className="absolute inset-0 bg-[rgb(0_0_0/var(--wash-flat))]" />

      {/* 2. Top and bottom only, so the header and the status rail have
             something to sit against. The middle stays clear. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/var(--wash-edge-top)),transparent,rgb(0_0_0/var(--wash-edge-bot)))]"
      />

      {/* 3. A soft pool around the card, feathering its edges into the
             photograph so the panel does not look pasted on. Deliberately
             weaker than the card's own tint: an earlier version leaned on this
             for the type contrast and the headline sat at ~30% of the section,
             right where a 42%-radius ellipse centred at 48% has already fallen
             away. The card carries the contrast; this only softens the join. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_62%_58%_at_50%_45%,rgb(0_0_0/var(--wash-pool)),transparent_78%)]"
      />

      <div className="layer flex flex-1 items-center justify-center px-6 py-28 lg:px-12">
        <Reveal variant="rise">
          {/*
              The panel is frosted glass with three behaviours — squeegee,
              steam and run-off — switched from the control top-right.

              No backdrop-blur or heavy tint here: a backdrop-filter cannot be
              partially erased, so the frost has to live in a canvas. The blur
              does the legibility work rather than darkness, which is why the
              tint is light.
          */}
          <GlassPanel
            src={asset(src)}
            coverOf={sectionRef}
            className="w-full max-w-[1040px]"
            /*
              Wider blur on the light hero. Under the panel the photograph is
              mostly plain white tile, so there is little detail for a blur to
              show — thinning the tint to expose more of it only cost the white
              type its contrast and still read as flat. What actually sells the
              glass here is the wipe: cleared areas come back sharp and bright
              against the frosted plate, and a bigger radius widens that gap.
            */
            blur={light ? 26 : undefined}
          >
            <Board
              className={`relative w-full bg-[rgb(0_0_0/var(--wash-panel))] px-8 py-10 sm:px-12 sm:py-14 ${
                // The card keeps the original white type even on the light
                // hero — see .on-glass.
                light ? "on-glass" : ""
              }`}
            >
            <p className="mi text-[color:var(--w-32)]">
              Made to measure <span className="text-[color:var(--w-90)]">glass</span> since 2009
            </p>

            {/* Their own H1. It covers all four product lines deliberately —
                naming only shower screens here would drop three quarters of
                the business off the front page. */}
            {/* Sized so "Custom Made to Measure" holds one line inside the
                board. At 86px it wrapped and stranded "MEASURE" on its own
                line, which broke the two-line lockup their brand uses. */}
            <h1 className="dsp mt-7 text-balance text-[clamp(30px,4.6vw,64px)]">
              {HERO.headline}
              <br />
              <span className="text-[color:var(--w-55)]">{HERO.headlineDim}</span>
            </h1>

            <div className="mt-9 grid gap-8 sm:grid-cols-[1.4fr_1fr] sm:items-end">
              <p className="bd max-w-[46ch] text-[color:var(--w-55)]">{HERO.body}</p>

              {/* Their own 3-year warranty badge, straight off their site.
                  Sits above the volume figures so the guarantee is read first
                  and the numbers back it up, rather than the other way round. */}
              <div className="flex flex-col items-start gap-4 sm:items-end">
                <Image
                  src={asset("/img/badges/3-Year-Warranty-Blue-BG.webp")}
                  alt="Three year warranty"
                  width={591}
                  height={257}
                  className="h-14 w-auto"
                />

                <p className="mi text-left text-[color:var(--w-32)] sm:text-right">
                  8,000+ clients
                  <span className="mx-2 text-[color:var(--rule)]">/</span>
                  10,000+ screens
                </p>
              </div>
            </div>

            {/*
                The client's own category icons, served as their original
                untouched SVG files from wp-content/uploads — byte-identical to
                what runs on their current site.

                Painted via CSS mask rather than rendered as <img>: the file
                supplies the shape, `bg-current` supplies the colour. That
                keeps the asset unmodified on disk while letting each icon
                inherit its link's colour, so icon and label go beige together
                instead of the label moving alone.

                Both mask-image and the -webkit- prefix are set because these
                are inline styles — React writes them straight to the element,
                so they bypass the CSS pipeline that would otherwise strip one
                of the pair.
            */}
            <nav className="mt-12 grid grid-cols-2 gap-px border border-[color:var(--rule)] bg-[color:var(--rule)] sm:grid-cols-4">
              {HERO.categories.map((c) => (
                <SmartLink
                  key={c.label}
                  href="#products"
                  className="group flex flex-col items-center gap-4 bg-[rgb(0_0_0/var(--wash-flat))] py-7 text-[color:var(--w-90)] transition-colors duration-500 hover:bg-[rgb(0_0_0/0.28)] hover:text-brass"
                >
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
                    className="h-9 w-9 flex-none bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5"
                  />
                  <span className="mi text-center">{c.label}</span>
                </SmartLink>
              ))}
            </nav>

            {/* Actions left, social proof right — it fills the space beside
                the buttons that the four-up category row leaves empty, and
                puts the rating at the exact point someone is deciding whether
                to click. */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-8">
              <div className="flex flex-wrap items-center gap-4">
              <SmartLink href="#configurator" className="mi btn btn-solid">
                {HERO.cta}
                <Arrow />
              </SmartLink>
                <a href={SITE.phoneHref} className="mi btn">
                  {SITE.phone}
                </a>
              </div>

              <SmartLink
                href="#reviews"
                className="group flex items-center gap-4 text-left sm:text-right"
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
            </div>

            </Board>
          </GlassPanel>
        </Reveal>
      </div>

      <div className="layer">
        <StatusRail />
      </div>
    </section>
  );
}
