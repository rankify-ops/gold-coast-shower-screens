"use client";

import { useState } from "react";
import Image from "next/image";
import { PRODUCTS } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Products as a horizontal accordion.
 *
 * v1 gives each product a full screen and a sticky index; v2 puts all four
 * side by side and lets the hovered one take the room. Same four products,
 * opposite gesture — one screen instead of five, and the comparison is
 * immediate rather than remembered.
 *
 * flex-grow does the work rather than fixed widths, so the open panel takes
 * whatever is left after the closed ones and the row always fills exactly, at
 * any viewport, with no measurement.
 *
 * Below the lg breakpoint it becomes a plain vertical stack: four columns at
 * 3.4vw each would be unreadable slivers on a phone, and a horizontal
 * accordion needs a pointer to work at all.
 */
export function ProductAccordion() {
  const [active, setActive] = useState(0);

  return (
    <section id="products" className="relative bg-paper">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
              What we make
            </p>
            <h2 className="mt-6 max-w-[15ch] text-[clamp(30px,4vw,60px)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
              Four things. All of them glass.
            </h2>
          </div>
          <p className="max-w-[34ch] text-[15px] leading-relaxed text-[color:var(--ink-60)]">
            Every one made to measure at our own Coombabah factory, and fitted
            by the people who made it.
          </p>
        </div>

        {/* Desktop: horizontal accordion */}
        <div className="mt-16 hidden gap-3 lg:flex lg:h-[540px]">
          {PRODUCTS.map((p, i) => {
            const open = active === i;
            return (
              <article
                key={p.name}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                style={{ flexGrow: open ? 6 : 1 }}
                className="relative min-w-0 overflow-hidden rounded-[24px] transition-[flex-grow] duration-700"
              >
                <Image
                  src={asset(p.image)}
                  alt={p.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className={`absolute inset-0 transition-colors duration-700 ${
                    open
                      ? "bg-[linear-gradient(to_top,rgba(0,26,43,0.86),rgba(0,26,43,0.12)_62%)]"
                      : "bg-navy/55"
                  }`}
                />

                {/* Closed state: the name runs up the spine of the panel. */}
                <div
                  className={`absolute inset-x-0 bottom-0 flex items-end justify-center pb-8 transition-opacity duration-500 ${
                    open ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                >
                  <span className="whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.08em] text-white [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                    {p.name}
                  </span>
                </div>

                {/* Open state */}
                <div
                  className={`absolute inset-x-0 bottom-0 p-9 transition-all duration-700 ${
                    open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-white/50">
                    /{p.index}/
                  </p>

                  <h3 className="mt-4 text-[clamp(24px,2.6vw,40px)] font-semibold tracking-[-0.03em] text-white">
                    {p.name}
                  </h3>

                  <p className="mt-4 max-w-[46ch] text-[14px] leading-relaxed text-white/70">
                    {p.line}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-2.5">
                    {p.specs.map((s) => (
                      <span
                        key={s.label}
                        className="rounded-full border border-white/25 px-3.5 py-1.5 text-[12px] font-medium text-white/80"
                      >
                        {s.value}
                      </span>
                    ))}
                  </div>

                  <SmartLink
                    href="#configurator"
                    className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3 text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-brass"
                  >
                    Price this
                    <Arrow />
                  </SmartLink>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile: stack */}
        <div className="mt-12 grid gap-4 lg:hidden">
          {PRODUCTS.map((p) => (
            <article key={p.name} className="relative overflow-hidden rounded-[22px]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={asset(p.image)}
                  alt={p.name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,26,43,0.88),transparent_58%)]"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-white">
                  {p.name}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-white/70">{p.line}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
