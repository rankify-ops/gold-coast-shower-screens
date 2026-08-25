"use client";

import { DIVIDER_LINE } from "@/content/site";

/**
 * A thin band between two heavy sections.
 *
 * Effica uses a hairline divider carrying one line of eyebrow text to break up
 * long runs of full-height sections. This version moves: the line repeats
 * across a marquee so the band reads as a strip of tape rather than a stray
 * caption, and the motion gives the eye somewhere to rest between two dense
 * screens without adding another thing to read.
 *
 * The text is duplicated and the track travels exactly -50%, so the loop is
 * seamless. Only the first copy is exposed to assistive tech; the rest are
 * decorative repeats of the same sentence.
 */
export function Marquee() {
  const line = DIVIDER_LINE;

  return (
    <section
      aria-label={line}
      className="relative overflow-hidden border-y border-[color:var(--rule-dark)] bg-paper py-5"
    >
      <div className="flex w-max animate-[rail-left_38s_linear_infinite] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="mi flex items-center whitespace-nowrap text-[color:var(--ink-38)]">
                {line}
                {/* Diamond separator, drawn from a rotated square so it matches
                    the page's hard-cornered geometry rather than a bullet. */}
                <span
                  aria-hidden
                  className="mx-8 inline-block h-1.5 w-1.5 rotate-45 bg-brass"
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
