"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HERO, RATING, SITE } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";
import { Rise } from "@/components/hz/Bits";

/**
 * The /refresh hero.
 *
 * A different room to every other build in this project — the reeded-glass
 * door with brass hinges, graded deep rather than merely darkened so it sits
 * into #121212 instead of floating grey on top of it.
 *
 * The construction follows the reference: full-bleed media, almost nothing in
 * the top half, and everything anchored along the bottom edge — the rating on
 * the left, the display sentence across the middle, the numbered product
 * markers on the right. The empty upper two thirds is the effect. Filling it
 * is what makes a hero ordinary.
 *
 * The photograph drifts up slowly as you scroll, at a fraction of page speed,
 * so the type separates from the room rather than travelling locked to it.
 */
export function HzHero() {
  const ref = useRef<HTMLElement>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        // 0 at the top of the page, 1 once the hero has fully left.
        const p = Math.min(1, Math.max(0, window.scrollY / el.offsetHeight));
        setShift(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="top"
      className="hz-dark relative flex min-h-svh flex-col justify-end overflow-hidden"
    >
      {/* 118% tall so there is headroom for the drift at either end. */}
      <div
        aria-hidden
        className="absolute inset-x-0 -top-[9%] h-[118%]"
        style={{ transform: `translate3d(0, ${shift * -7}%, 0)` }}
      >
        <Image
          src={asset("/img/hero-hz.webp")}
          alt="Frameless reeded glass shower screen with brass hinges"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Two washes, and both pulled back once the grade stopped doing their
          job as well as its own: a light flat one so nothing is fully exposed,
          and a foot heavy enough to seat the type without swallowing the room
          above it. */}
      <div aria-hidden className="absolute inset-0 bg-[#121212]/18" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,18,18,0.92),rgba(18,18,18,0.2)_38%,transparent_62%)]"
      />

      <div className="relative z-10 hz-pad pb-8 lg:pb-10">
        {/* Top strip of the lower block: rating left, markers right. */}
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-white/12 pb-8">
          <Rise>
            <SmartLink href="#reviews" className="group flex items-center gap-4">
              <span className="flex -space-x-2.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#121212] bg-white/10 text-[10px] font-medium text-white backdrop-blur-sm"
                  >
                    {["P", "K", "D"][i]}
                  </span>
                ))}
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#121212] bg-[color:var(--hz-accent)] text-[10px] font-medium text-[#121212]">
                  +
                </span>
              </span>
              <span className="hz-mono leading-tight text-white/55">
                <span className="text-white">{RATING.score}</span>/5
                <span className="mt-1 block">
                  Trusted by <span className="text-white">{RATING.count}+</span> Gold Coast homes
                </span>
              </span>
            </SmartLink>
          </Rise>

          <Rise delay={90}>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {HERO.categories.map((c, i) => (
                <li key={c.label}>
                  <SmartLink
                    href="#products"
                    className="hz-mono group flex items-center gap-3 text-white/55 transition-colors duration-500 hover:text-white"
                  >
                    <span className="text-[color:var(--hz-accent)]">/0{i + 1}</span>
                    {c.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </Rise>
        </div>

        {/* The sentence. */}
        <Rise delay={140}>
          <h1 className="hz-dsp hz-dsp-xl mt-8 max-w-[16ch] text-white">
            {HERO.headline}{" "}
            <span className="hz-dim">{HERO.headlineDim}</span>
          </h1>
        </Rise>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
          <Rise delay={190}>
            <p className="hz-body max-w-[46ch] text-white/60">{HERO.body}</p>
          </Rise>

          <Rise delay={240}>
            <SmartLink href="#configurator" className="hz-btn group border-transparent">
              <span className="hz-mono">
                {HERO.cta}
                <span className="opacity-45">/Free</span>
              </span>
              <span aria-hidden>
                <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 5h6M5.4 2.2 8.2 5l-2.8 2.8" />
                </svg>
              </span>
            </SmartLink>
          </Rise>
        </div>

        {/* Footer strip of the hero, mono, the way the reference runs it. */}
        <div className="hz-mono-sm mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-5 text-white/40">
          <span>Est. 2009 — Coombabah, QLD</span>
          <span className="hidden sm:block">{SITE.licence}</span>
          <span>Measure to install / 14 working days</span>
        </div>
      </div>
    </section>
  );
}
