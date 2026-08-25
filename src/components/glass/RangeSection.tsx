"use client";

import { useState } from "react";
import Image from "next/image";
import { PRODUCTS, INTRO } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";
import { Counter } from "@/components/ui/Counter";

/**
 * The section under the fluted hero: their four ranges.
 *
 * Carries the hero's language rather than starting a new one — navy ink on a
 * near-white ground, 11px micro-type at 0.14em, beige used once and only as an
 * accent. The join matters: the hero ends on a full-bleed photograph, so this
 * opens on flat ground and lets the page breathe before the next image.
 *
 * #f5f5f5, not the brand mid grey. --grey was chosen back when the hero plate
 * was the dark shower head and the page needed a step down in tone; the plate
 * is the light one now, so a darker band underneath reads as a seam rather than
 * as a continuation. This sits a shade above the hero's own #f0eeed, so the
 * page lifts very slightly as it goes down instead of dropping.
 *
 * The four ranges are rows, not cards. Cards ask you to choose one before you
 * have read any; a list is read top to bottom. The hovered row lifts its
 * photograph in from the right — the only movement in the section, so it lands.
 */
export function RangeSection() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="products"
      className="relative"
      style={{ background: "#f5f5f5", color: "var(--navy)" }}
    >
      <div className="px-8 py-24 lg:px-14 lg:py-32">
        {/* Heading */}
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[color:var(--navy)]/55">
              What we make
            </p>
            <h2
              className="mt-8 max-w-[13ch] text-[clamp(30px,3.4vw,52px)] font-medium leading-[1.04] tracking-[-0.035em]"
              style={{ fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif" }}
            >
              Four things. All of them glass.
            </h2>
          </div>

          <div className="lg:pt-14">
            <p className="max-w-[52ch] text-[15px] leading-[1.65] text-[color:var(--navy)]/70">
              {INTRO.body}
            </p>

            <div className="mt-10 flex flex-wrap gap-x-12 gap-y-5">
              {[
                { v: 8000, s: "+", k: "Happy clients" },
                { v: 10000, s: "+", k: "Screens installed" },
                { v: 14, s: "", k: "Days, measure to install" },
              ].map((stat) => (
                <div key={stat.k}>
                  <p className="text-[clamp(22px,2.2vw,32px)] font-medium leading-none tracking-[-0.03em]">
                    <Counter to={stat.v} suffix={stat.s} />
                  </p>
                  <p className="mt-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--navy)]/50">
                    {stat.k}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The four ranges */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <ol className="border-t border-[color:var(--navy)]/15">
            {PRODUCTS.map((p, i) => {
              const on = active === i;
              return (
                <li key={p.name} className="border-b border-[color:var(--navy)]/15">
                  <SmartLink
                    href="#configurator"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex items-center gap-6 py-7 text-left lg:gap-10"
                  >
                    <span
                      className={`text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-500 ${
                        on ? "text-[color:var(--brass)]" : "text-[color:var(--navy)]/40"
                      }`}
                    >
                      {p.index}
                    </span>

                    <span
                      className="flex-1 text-[clamp(20px,2vw,30px)] font-medium tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-1"
                      style={{ fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif" }}
                    >
                      {p.name}
                    </span>

                    <span className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--navy)]/45 lg:block">
                      {p.specs[0].value}
                    </span>

                    <span
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border transition-colors duration-500 ${
                        on
                          ? "border-[color:var(--navy)] bg-[color:var(--navy)] text-white"
                          : "border-[color:var(--navy)]/25 text-[color:var(--navy)]"
                      }`}
                    >
                      <Arrow />
                    </span>
                  </SmartLink>
                </li>
              );
            })}
          </ol>

          {/* The plate for the hovered range. */}
          <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:min-h-[440px]">
            {PRODUCTS.map((p, i) => (
              <div
                key={p.name}
                aria-hidden={active !== i}
                className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? "none" : "translateX(24px)",
                }}
              >
                <Image
                  src={asset(p.image)}
                  alt={p.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            ))}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-[linear-gradient(to_top,rgba(0,38,61,0.7),transparent)] p-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white">
                {PRODUCTS[active].name}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
                {PRODUCTS[active].finish}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
