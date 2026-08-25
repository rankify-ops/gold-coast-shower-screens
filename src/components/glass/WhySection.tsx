"use client";

import { useState } from "react";
import { WHY } from "@/content/site";
import { LottieIcon } from "@/components/glass/LottieIcon";

/**
 * (05) — Why us. The card layout lifted from rankify.com.au/web-design-and-development,
 * measured off the live page rather than eyeballed, then mapped onto this
 * palette and this client's content.
 *
 * WHAT WAS MEASURED, AND KEPT:
 *   card      330x363, 16px radius, 1px #e7e7e7, white, 30px padding
 *   shadow    a four-part stack — two soft drops plus two inset hairlines.
 *             The inset white top edge and dark bottom edge are what make the
 *             card read as a raised physical object instead of a rectangle
 *             with a blur under it. Copied verbatim.
 *   eyebrow   11px / 600 / +1.54px tracking
 *   heading   44px / 500 / -1.76px tracking
 *   number    10px / 600 / #999, parked top-right
 *   dots      6px, one per card in the set, the current one filled
 *   title     18px / 600 / 27px line height
 *   body      14.5px / 400 / #999, set BESIDE the icon with a 20px gutter
 *
 * WHAT CHANGED, AND WHY:
 *   - Ink is navy rather than #0a0a0a, and the eyebrow is --sky rather than
 *     Rankify's teal. Same structure, this brand's colours.
 *   - Three across rather than four. Rankify has four cards; there are six
 *     here, and six across a row would put each one under 300px.
 *   - The icons are animated Lordicon exports rather than static marks. They
 *     arrived already recoloured to navy and sky, so nothing is tinted at
 *     runtime. Each plays once as it scrolls in and replays when its card is
 *     hovered; see LottieIcon for why the trigger lives on the card.
 */
export function WhySection() {
  const font = "var(--font-geist), ui-sans-serif, system-ui, sans-serif";
  // Which card the pointer is on. Held here rather than in each icon because
  // hovering a 54px glyph inside a 390px card would be almost undiscoverable —
  // the whole card is the target.
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="why"
      className="relative"
      style={{ background: "#f5f5f5", color: "var(--navy)" }}
    >
      {/* Capped, not full-bleed. Three across the full width gave 592px cards
          against the reference's 330, which stretched the body copy to a
          456px measure and lost the proportions that make these read as
          cards rather than panels. */}
      <div className="mx-auto max-w-[1300px] px-8 py-24 lg:px-14 lg:py-32">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--sky)]">
          (05) &mdash; Why us
        </p>

        <h2
          className="mt-6 max-w-[20ch] text-[clamp(30px,3.2vw,44px)] font-medium leading-[1.05] tracking-[-0.04em]"
          style={{ fontFamily: font }}
        >
          Why choose us?
        </h2>

        {/* gap-0: the cards touch, as they do on the reference. Each keeps its
            own border and 16px radius, so the seams read as a single rule and
            the four-corner meetings leave the small diamond of ground showing
            — that is the reference's look, not an artefact. */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((item, i) => (
            <article
              key={item.title}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              // Hover, measured off rankify.com.au: a 1-degree skew, the
              // border to the accent, and a lift in the fill — all on 300ms
              // cubic-bezier(0.4, 0, 0.2, 1). The skew is the part that makes
              // it feel like a physical card being nudged rather than a colour
              // change.
              className="group rounded-2xl border border-[color:var(--navy)]/10 bg-white p-[30px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-skew-x-1 hover:border-[color:var(--sky)] hover:bg-[color:var(--sky)]/[0.04]"
              style={{
                boxShadow:
                  "0 6px 24px rgba(0,0,0,0.043), 0 2px 8px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.02)",
              }}
            >
              {/* Position row: dots left, number right. */}
              <div className="flex items-center justify-between">
                <span aria-hidden className="flex items-center gap-1.5">
                  {WHY.map((_, d) => (
                    <span
                      key={d}
                      className={`h-1.5 w-1.5 rounded-full ${
                        d === i ? "bg-[color:var(--navy)]" : "bg-[color:var(--navy)]/12"
                      }`}
                    />
                  ))}
                </span>
                <span className="text-[10px] font-semibold tracking-[-0.06em] text-[color:var(--navy)]/45">
                  {item.index}
                </span>
              </div>

              <h3
                className="mt-11 text-[18px] font-semibold leading-[1.5] tracking-[-0.02em] text-[color:var(--navy)]"
                style={{ fontFamily: font }}
              >
                {item.title}
              </h3>

              {/* Icon beside the copy, not above it — this is the part that
                  makes the layout read as Rankify's rather than a generic
                  icon-over-text card. */}
              <div className="mt-8 flex gap-5">
                <span className="flex-none transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110">
                  <LottieIcon src={item.lottie} size={54} hovered={hovered === i} />
                </span>
                <p className="text-[14.5px] leading-[1.38] text-[color:var(--navy)]/60">
                  {item.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
