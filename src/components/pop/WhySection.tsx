"use client";

import { useState } from "react";
import { WHY } from "@/content/site";
import { LottieIcon } from "@/components/pop/LottieIcon";

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
 *   - The icons are the DARK set — white and sky rather than navy and sky.
 *     A Lottie carries its colours inside its shape data, so there is no
 *     currentColor for it to inherit and no way to invert one with CSS; the
 *     only correct answer on a navy ground is a separately exported file. Each plays once as it scrolls in and replays when its card is
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
      // .on-navy re-points --ink / --ink-2 / --ink-3 / --rule, so the whole
      // subtree inverts without a single "dark" prop being threaded through it.
      className="on-navy relative"
      style={{ background: "var(--navy)", color: "var(--ink)" }}
    >
      {/* A soft light from above rather than a flat fill. The reference's dark
          band is not one colour — it is lit from the top, which is what stops a
          large dark area reading as a hole in the page. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.07),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-[1300px] px-8 py-24 lg:px-14 lg:py-32">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--sky)]">
          (05) &mdash; Why us
        </p>

        <h2
          className="mt-6 max-w-[20ch] text-[clamp(30px,3.2vw,44px)] font-medium leading-[1.05] tracking-[-0.04em]"
          style={{ fontFamily: font }}
        >
          Why choose us?
        </h2>

        {/* gap-0 — the cards touch. Each keeps its own hairline and radius, so
            the four-corner meetings leave the small diamond of ground showing,
            which is the reference's look rather than an artefact. */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((item, i) => (
            <article
              key={item.title}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              // Measured off the reference's dark band: a 4% white fill and a
              // 12% white hairline, lifting to 8% with the accent border on
              // hover, plus the 1-degree skew. A solid card here would read as
              // a sticker; the translucent fill is what makes it glass.
              className="group rounded-2xl border border-white/[0.12] bg-white/[0.04] p-[30px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-skew-x-1 hover:border-[color:var(--sky)] hover:bg-white/[0.08]"
            >
              {/* Position row: dots left, number right. */}
              <div className="flex items-center justify-between">
                <span aria-hidden className="flex items-center gap-1.5">
                  {WHY.map((_, d) => (
                    <span
                      key={d}
                      className={`h-1.5 w-1.5 rounded-full ${
                        d === i ? "bg-[color:var(--ink)]" : "bg-[color:var(--rule)]"
                      }`}
                    />
                  ))}
                </span>
                <span className="text-[10px] font-semibold tracking-[-0.06em] text-[color:var(--ink-3)]">
                  {item.index}
                </span>
              </div>

              <h3
                className="mt-11 text-[18px] font-semibold leading-[1.5] tracking-[-0.02em] text-[color:var(--ink)]"
                style={{ fontFamily: font }}
              >
                {item.title}
              </h3>

              {/* Icon beside the copy, not above it — this is the part that
                  makes the layout read as Rankify's rather than a generic
                  icon-over-text card. */}
              <div className="mt-8 flex gap-5">
                <span className="flex-none transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110">
                  <LottieIcon src={item.lottieDark} size={54} hovered={hovered === i} />
                </span>
                <p className="text-[15px] leading-[1.38] text-[color:var(--ink-2)]">
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
