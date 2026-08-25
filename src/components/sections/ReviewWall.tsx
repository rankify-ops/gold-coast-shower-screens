"use client";

import { useEffect, useRef, useState } from "react";
import { REVIEWS, RATING } from "@/content/site";
import { Stars } from "@/components/ui/Stars";

/**
 * The review carousel: two rails running in opposite directions, forever.
 *
 * Not a one-at-a-time slider with arrows. Nine reviews behind a "next" button
 * means nobody reads past the second, and the volume — the actual claim being
 * made — never lands. Two continuously drifting rails put a dozen cards on
 * screen at once, so the impression is "there are lots of these" before a
 * single one has been read, and the ones you do stop on are read by choice.
 *
 * Opposite directions on purpose: two rails travelling the same way read as one
 * broken grid sliding sideways. Counter-motion reads as a wall of them.
 *
 * The drift is a CSS animation on a duplicated track — the list is rendered
 * twice, so when the first copy has travelled its own width the frame is
 * pixel-identical and the loop is invisible. Hovering anywhere pauses both
 * rails, because a moving target you cannot finish reading is worse than no
 * animation at all.
 */
export function ReviewWall() {
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!REVIEWS.length) return null;

  // Split so neither rail repeats a review the other is showing.
  const half = Math.ceil(REVIEWS.length / 2);
  const rails = [REVIEWS.slice(0, half), REVIEWS.slice(half)];

  return (
    <section id="review-wall" className="relative overflow-hidden bg-navy on-dark">
      <div className="layer px-6 pt-24 lg:px-12 lg:pt-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="mi text-[color:var(--w-32)]">(09) &mdash; In their words</p>
            <h2 className="dsp-sm mt-8 max-w-[16ch] text-[clamp(28px,3.8vw,58px)]">
              Four hundred and fifty of these.
            </h2>
          </div>

          <div className="flex items-center gap-5">
            <Stars size={20} label={`Rated ${RATING.score} out of 5`} className="text-brass" />
            <p className="mi text-[color:var(--w-55)]">
              <span className="text-[color:var(--w-90)]">{RATING.score}</span> on {RATING.source}
            </p>
          </div>
        </div>
      </div>

      <div
        ref={ref}
        className="mt-16 flex flex-col gap-5 pb-24 lg:pb-32"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {rails.map((rail, r) => (
          <div key={r} className="relative flex overflow-hidden">
            {/* Two identical copies: the second covers the gap the first
                leaves as it exits, which is what makes the loop seamless. */}
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 gap-5 pr-5"
                style={{
                  animation: reduced
                    ? undefined
                    : `${r === 0 ? "rail-left" : "rail-right"} ${rail.length * 13}s linear infinite`,
                  animationPlayState: paused ? "paused" : "running",
                }}
              >
                {rail.map((review) => (
                  <figure
                    key={review.name + copy}
                    className="flex w-[78vw] flex-none flex-col justify-between border border-[color:var(--rule)] bg-white/[0.04] p-7 sm:w-[46vw] lg:w-[30vw]"
                  >
                    <Stars size={14} label="Five stars" className="text-brass" />
                    <blockquote className="bd-sentence mt-6 text-[color:var(--w-90)]">
                      {review.quote}
                    </blockquote>
                    <figcaption className="mi mt-8 border-t border-[color:var(--rule)] pt-5 text-[color:var(--w-55)]">
                      {review.name}
                      <span className="mx-2 text-[color:var(--w-32)]">&middot;</span>
                      {review.source}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
