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
import { Arrow } from "@/components/ui/Arrow";
import { asset } from "@/lib/basePath";

const HERO_SRC = "/img/hero-bright.webp";

/**
 * The split hero, inverted.
 *
 * Same construction as HeroSplit — headline left at full size, product chooser
 * in glass on the right — but every value flipped:
 *
 *   photograph   full brightness, no wash at all   (was: graded down, four washes)
 *   frost        white                             (was: 42% near-black)
 *   type         navy                              (was: white)
 *
 * The frost is the part that makes this work rather than the wash. On the dark
 * builds the plate is tinted almost black and the blur is incidental; here the
 * plate is tinted white, so the card reads as condensation on real glass — the
 * bathroom stays visible through it and the navy type sits on the milk rather
 * than on a darkened photograph.
 *
 * Nothing is darkened anywhere: .wash-none zeroes the flat, edge and panel
 * washes and leaves only a 4% pool to feather the card's edge into the room.
 */
export function HeroSplitLight() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="hero-light wash-none relative flex min-h-svh flex-col overflow-hidden bg-paper"
    >
      <Image
        src={asset(HERO_SRC)}
        alt="Made to measure glass shower screen in a modern bathroom"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/*
          The left scrim — the thing that lets a full-brightness photograph
          carry dark type.

          Two effects, and the second matters more than the first:

          1. A WHITE GRADIENT. Navy on bare tiles measured fine on average but
             read thin, because the tiles are not one value — the headline
             crossed grout lines, a window reflection and a shadowed corner, so
             its contrast changed letter to letter. The gradient gives the left
             column a single, near-constant ground instead of a moving one.

          2. A BACKDROP BLUR. Contrast is only half of legibility; the other
             half is competing detail. Blurring what sits behind the type kills
             the grout lines and edges that were breaking up the letterforms,
             without darkening anything.

          Measured on the actual pixels: bare, the tiles behind the headline
          ran 106 to 253 luminance, so navy hit 2.9:1 at its worst — under AA —
          while reading 15.4:1 twenty centimetres to the right. The alpha is
          held nearly flat across the headline's full span rather than falling
          away through it, which is what evens that out.

          Sized to the headline column and masked to nothing past it, so the
          right half — the card and the vanity — keeps full brightness and full
          sharpness. The room is untouched where anyone is looking at it.
      */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[62%] backdrop-blur-[7px] bg-[linear-gradient(to_right,rgba(255,255,255,0.93),rgba(255,255,255,0.89)_58%,rgba(255,255,255,0.84)_78%,transparent)]"
        style={{
          maskImage: "linear-gradient(to right, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, black 80%, transparent)",
        }}
      />

      {/* A soft pool under the card so its edge feathers into the room instead
          of being cut out of it. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_58%_62%_at_72%_50%,rgb(0_0_0/var(--wash-pool)),transparent_76%)]"
      />

      {/* min-h-0 lets this flex child actually shrink, which is what allows
          items-center to centre against the space the status rail leaves
          rather than against the section's full height. Without it the column
          sat high and the whole hero looked bottom-heavy. */}
      <div className="layer flex min-h-0 flex-1 items-center px-6 py-24 lg:px-12 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1460px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: the headline */}
          <Reveal variant="rise">
            <p className="rk-small text-[color:var(--rk-muted)]">
              Made to measure glass since 2009
            </p>

            <h1 className="rk-h1 mt-6 max-w-[15ch] text-balance text-[color:var(--rk-ink)]">
              {HERO.headline}{" "}
              <span className="text-brass">{HERO.headlineDim}</span>
            </h1>

            <p className="rk-body mt-7 max-w-[46ch] text-[color:var(--rk-muted)]">{HERO.body}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <SmartLink href="#configurator" className="rk-btn rk-btn-solid">
                {HERO.cta}
                <Arrow />
              </SmartLink>
              <a href={SITE.phoneHref} className="rk-btn rk-btn-ghost">
                {SITE.phone}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-[color:var(--rk-line)] pt-7">
              <Image
                src={asset("/img/badges/3-Year-Warranty-Blue-BG.webp")}
                alt="Three year warranty"
                width={591}
                height={257}
                className="h-12 w-auto"
              />
              <p className="rk-small text-[color:var(--rk-muted)]">
                <span className="text-[color:var(--rk-ink)]">8,000+</span> clients
                <span className="mx-2">/</span>
                <span className="text-[color:var(--rk-ink)]">10,000+</span> screens
              </p>
            </div>
          </Reveal>

          {/* Right: the chooser, in white glass */}
          <Reveal variant="rise">
            <GlassPanel
              src={asset(HERO_SRC)}
              coverOf={sectionRef}
              className="w-full"
              /* White frost rather than near-black. 0.55 is the point where the
                 room is still legible through the plate but navy type is
                 comfortably clear of the tiles behind it. */
              tint="rgba(255,255,255,0.55)"
              blur={22}
            >
              {/* 55%, not 35%.
                  The canvas frost sits UNDER this board, so if it has not
                  painted yet — first frame, image still loading, JS off, or a
                  throttled background tab — the card is only this tint. At 35%
                  navy type on a bright white bathroom was unreadable in that
                  window. At 55% the card clears 12:1 on its own and the frost
                  becomes character rather than legibility. */}
              <Board className="relative w-full border border-white/70 bg-white/55 px-7 py-8 shadow-[0_28px_70px_-34px_rgba(0,38,62,0.55)] sm:px-10 sm:py-10">
                <p className="rk-small text-[color:var(--rk-muted)]">What can we make you?</p>

                <nav className="mt-7 grid grid-cols-2 gap-px border border-[color:var(--rule)] bg-[color:var(--rule)]">
                  {HERO.categories.map((c) => (
                    <SmartLink
                      key={c.label}
                      href="#products"
                      className="group flex flex-col items-center gap-5 bg-white/55 px-4 py-8 text-[color:var(--w-90)] transition-colors duration-500 hover:bg-white/80 hover:text-navy"
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
                        className="h-12 w-12 flex-none bg-current transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-125"
                      />
                      <span className="rk-small inline-block text-center text-[color:var(--rk-ink)] transition-transform duration-500 group-hover:scale-110">
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
                    className="text-brass transition-transform duration-500 group-hover:-translate-y-px"
                  />
                  <span className="rk-small leading-tight">
                    <span className="block text-[color:var(--rk-ink)]">Over 450 5-star reviews</span>
                    <span className="block text-[color:var(--rk-muted)]">Google reviews</span>
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
