"use client";

import { REVIEWS, RATING } from "@/content/site";
import { Stars } from "@/components/ui/Stars";
import { Counter } from "@/components/ui/Counter";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Reviews as three drifting columns.
 *
 * v1 runs two horizontal rails on navy. This one turns the same idea ninety
 * degrees and lights it: three vertical columns of cards on paper, the middle
 * one travelling against the outer two, masked top and bottom so the cards fade
 * out at the edges rather than being cut off by a hard line.
 *
 * Vertical suits a light page better — a horizontal rail reads as a ticker,
 * which is a news device; a slow vertical drift reads as a wall of them, which
 * is the claim being made.
 *
 * Each column holds every review, offset by its index, so no column is short
 * and no two columns show the same card side by side.
 */
export function QuoteColumns() {
  if (!REVIEWS.length) return null;

  const columns = [0, 1, 2].map((c) =>
    REVIEWS.map((_, i) => REVIEWS[(i + c * 3) % REVIEWS.length])
  );

  return (
    <section id="reviews" className="relative overflow-hidden bg-mist">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* The claim */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
              In their words
            </p>

            <h2 className="mt-6 max-w-[13ch] text-[clamp(30px,4vw,60px)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
              Four hundred and fifty of these.
            </h2>

            <div className="mt-10 flex items-center gap-4">
              <Stars size={20} label={`Rated ${RATING.score} out of 5`} className="text-brass" />
              <p className="text-[14px] font-medium text-[color:var(--ink-60)]">
                <span className="text-ink">{RATING.score}</span> from{" "}
                <Counter to={RATING.count} suffix="+" /> on {RATING.source}
              </p>
            </div>

            <p className="mt-8 max-w-[38ch] text-[15px] leading-relaxed text-[color:var(--ink-60)]">
              {RATING.line}
            </p>

            <SmartLink
              href="#configurator"
              className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-navy px-6 py-3.5 text-[13px] font-medium text-white transition-colors duration-300 hover:bg-[color:var(--navy-lift)]"
            >
              Join them
              <Arrow />
            </SmartLink>
          </div>

          {/* The wall. Masked at both ends so cards dissolve rather than clip. */}
          <div
            className="group relative h-[560px] overflow-hidden lg:h-[720px]"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
            }}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {columns.map((col, c) => (
                <div
                  key={c}
                  className={`flex flex-col gap-3 ${c === 2 ? "hidden sm:flex" : ""}`}
                  style={{
                    animation: `${c === 1 ? "col-down" : "col-up"} ${46 + c * 7}s linear infinite`,
                  }}
                >
                  {/* Doubled, so the loop closes on an identical frame. */}
                  {[...col, ...col].map((review, i) => (
                    <figure
                      key={c + "-" + i}
                      className="rounded-[18px] border border-[color:var(--rule-dark)] bg-paper p-6 transition-colors duration-500 hover:border-navy"
                    >
                      <Stars size={13} label="Five stars" className="text-brass" />
                      <blockquote className="mt-5 text-[13.5px] leading-relaxed text-[color:var(--ink-60)]">
                        {review.quote}
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-3 border-t border-[color:var(--rule-dark)] pt-5">
                        {/* Initial in place of an avatar — we have no photos of
                            these people and a stock face would be a lie. */}
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mist text-[12px] font-semibold text-ink">
                          {review.name.charAt(0)}
                        </span>
                        <span className="text-[12px] font-medium text-[color:var(--ink-38)]">
                          {review.name}
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
