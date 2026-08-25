"use client";

import Image from "next/image";
import { HERO, RATING, SITE } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";
import { Stars } from "@/components/ui/Stars";
import { Counter } from "@/components/ui/Counter";

/**
 * Light hero — type first, photograph second.
 *
 * The opposite construction to v1. There the photograph is the hero and the
 * type sits inside a glass card cut into it; here the type owns the top of the
 * page on plain paper, and the photograph arrives underneath as a wide plate
 * with the proof cards resting on its edge.
 *
 * That order matters on a light page: white space above the headline is what
 * makes a light design read as expensive rather than empty, and a full-bleed
 * image starting at pixel zero would spend all of it.
 *
 * The category row sits between the two as pill links, so the four product
 * lines are on screen before the fold without competing with the headline.
 */
export function HeroSpotlight() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper">
      {/* A soft brass bloom behind the headline. The only warmth on the page
          that is not a border or a button — it stops a white hero reading as
          an unstyled document. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(166,159,136,0.22),transparent_68%)] blur-2xl"
      />

      <div className="layer px-6 pb-20 pt-36 lg:px-12 lg:pb-24 lg:pt-44">
        {/* Rating pill */}
        <div className="flex justify-center">
          <SmartLink
            href="#reviews"
            className="group flex items-center gap-3 rounded-full border border-[color:var(--rule-dark)] bg-white/70 py-2 pl-3 pr-5 backdrop-blur-sm transition-colors duration-300 hover:border-navy"
          >
            <Stars size={14} label={`Rated ${RATING.score} out of 5`} className="text-brass" />
            <span className="text-[13px] font-medium text-[color:var(--ink-60)]">
              <span className="text-ink">{RATING.score}</span> from{" "}
              <Counter to={RATING.count} suffix="+" /> reviews
            </span>
          </SmartLink>
        </div>

        <h1 className="mx-auto mt-10 max-w-[17ch] text-center text-[clamp(38px,6.4vw,92px)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink">
          {HERO.headline}{" "}
          <span className="text-brass">{HERO.headlineDim}</span>
        </h1>

        <p className="mx-auto mt-8 max-w-[52ch] text-center text-[15px] leading-relaxed text-[color:var(--ink-60)]">
          {HERO.body}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <SmartLink
            href="#configurator"
            className="flex items-center gap-2.5 rounded-full bg-navy px-7 py-4 text-[13px] font-medium text-white transition-colors duration-300 hover:bg-[color:var(--navy-lift)]"
          >
            {HERO.cta}
            <Arrow />
          </SmartLink>
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-2.5 rounded-full border border-[color:var(--rule-dark)] px-7 py-4 text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-mist"
          >
            {SITE.phone}
          </a>
        </div>

        {/* Category pills */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-2.5">
          {HERO.categories.map((c) => (
            <SmartLink
              key={c.label}
              href="#products"
              className="group flex items-center gap-2.5 rounded-full border border-[color:var(--rule-dark)] bg-white/60 py-2.5 pl-3 pr-5 transition-colors duration-300 hover:border-navy hover:bg-white"
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
                className="h-6 w-6 flex-none bg-navy transition-transform duration-500 group-hover:scale-110"
              />
              <span className="text-[13px] font-medium text-[color:var(--ink-60)] transition-colors duration-300 group-hover:text-ink">
                {c.label}
              </span>
            </SmartLink>
          ))}
        </div>
      </div>

      {/* The plate, with the proof cards sitting on its lower edge. */}
      <div className="layer px-3 pb-24 lg:px-6 lg:pb-32">
        <div className="relative mx-auto max-w-[1500px]">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px] bg-mist lg:rounded-[40px]">
            <Image
              src={asset("/img/hero-natural.webp")}
              alt="Made to measure glass shower screen in a modern bathroom"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* A wash at the foot only, so the cards below have something to
                sit against without dimming the photograph. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,38,62,0.55),transparent_46%)]"
            />
          </div>

          {/* Overlapping proof strip. Pulled up onto the image rather than
              placed below it — the overlap is what makes the plate read as an
              object on the page instead of a banner across it. */}
          <div className="relative z-10 -mt-16 px-4 sm:-mt-14 lg:-mt-20 lg:px-10">
            <div className="grid gap-px overflow-hidden rounded-[20px] border border-[color:var(--rule-dark)] bg-[color:var(--rule-dark)] shadow-[0_24px_60px_-30px_rgba(0,38,62,0.45)] sm:grid-cols-3">
              {[
                { v: 8000, s: "+", k: "Happy clients" },
                { v: 10000, s: "+", k: "Screens installed" },
                { v: 14, s: "", k: "Working days, measure to install" },
              ].map((stat) => (
                <div key={stat.k} className="bg-white/90 px-6 py-7 backdrop-blur-xl">
                  <p className="text-[clamp(26px,3vw,40px)] font-semibold leading-none tracking-[-0.03em] text-ink">
                    <Counter to={stat.v} suffix={stat.s} />
                  </p>
                  <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
                    {stat.k}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
