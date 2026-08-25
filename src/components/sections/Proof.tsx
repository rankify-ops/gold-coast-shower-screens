"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import { Counter } from "@/components/ui/Counter";
import { ACCREDITATIONS, RATING, REVIEWS } from "@/content/site";
import { asset } from "@/lib/basePath";

/**
 * Reviews and accreditation marks.
 *
 * Rating-led rather than quote-led, because a rating is what they can actually
 * evidence. They publish a 450+ five-star count and nothing else — no quotes on
 * the homepage, none on the about page, no reviews page at all. So the score
 * carries the section and the quotes are an enhancement on top: drop real ones
 * into REVIEWS and the rotator below appears, leave it empty and the section
 * still reads as finished rather than as a gap.
 *
 * The rotator shows one quote at a time, large. Three-across cards make the eye
 * choose which to read and it usually reads none; one at a time is read.
 * Auto-advancing with a visible timer rule, and every quote is directly
 * reachable from the numbered list so it never traps you waiting.
 */
export function Proof() {
  const has = REVIEWS.length > 0;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const HOLD = 6000;

  // Timer drives both the advance and the progress rule, so the rule can never
  // disagree with when the quote actually changes.
  const raf = useRef(0);
  useEffect(() => {
    if (!has || paused || REVIEWS.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / HOLD);
      setElapsed(t);
      if (t === 1) {
        setI((n) => (n + 1) % REVIEWS.length);
        setElapsed(0);
        start = 0;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [has, paused, i]);

  const review = has ? REVIEWS[i] : null;

  return (
    <section id="reviews" className="relative bg-paper">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="mi text-[color:var(--ink-38)]">(06) &mdash; The record</p>
            <Reveal variant="mask" delay={80}>
              <h2 className="dsp-sm mt-8 max-w-[14ch] text-[clamp(30px,5vw,80px)]">
                Built on reputation.
              </h2>
            </Reveal>
          </div>
          <p className="bd-sentence max-w-[32ch] text-[color:var(--ink-60)]">{RATING.line}</p>
        </div>

        {/* The score, at display size. Three cells on one hairline grid so the
            rating, the volume and the source read as one instrument panel. */}
        <div className="mt-20 grid gap-px border border-[color:var(--rule-dark)] bg-[color:var(--rule-dark)] sm:grid-cols-3">
          <div className="bg-paper px-8 py-10">
            <p className="dsp text-[clamp(48px,7vw,104px)] leading-none">{RATING.score}</p>
            <Stars size={18} label={`Rated ${RATING.score} out of 5`} className="mt-6 text-brass" />
          </div>

          <div className="flex flex-col justify-between bg-paper px-8 py-10">
            <p className="dsp text-[clamp(40px,5.4vw,78px)] leading-none">
              <Counter to={RATING.count} suffix="+" />
            </p>
            <p className="mi mt-6 text-[color:var(--ink-38)]">Five-star reviews</p>
          </div>

          <div className="flex flex-col justify-between bg-paper px-8 py-10">
            <p className="dsp-sm-sentence text-[clamp(22px,2.4vw,34px)]">{RATING.source}</p>
            <p className="mi mt-6 text-[color:var(--ink-38)]">Where they are published</p>
          </div>
        </div>

        {review ? (
          <div
            className="mt-20"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <blockquote>
              {/* keyed so the quote re-mounts and re-runs its entrance each
                  time the rotator advances */}
              <p
                key={i}
                className="dsp-sm-sentence max-w-[24ch] text-[clamp(24px,3.4vw,52px)] [animation:rise_.7s_cubic-bezier(0.16,1,0.3,1)_both]"
              >
                &ldquo;{review.quote}&rdquo;
              </p>
              <footer className="mi mt-10 text-[color:var(--ink-38)]">
                {review.name}
                {review.source ? <span className="mx-3">&middot; {review.source}</span> : null}
              </footer>
            </blockquote>

            {REVIEWS.length > 1 ? (
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
                <div className="flex items-center gap-2">
                  {REVIEWS.map((_, n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`Review ${n + 1}`}
                      onClick={() => {
                        setI(n);
                        setElapsed(0);
                      }}
                      className={`mi h-8 w-8 border transition-colors duration-300 ${
                        n === i
                          ? "border-navy bg-navy text-white"
                          : "border-[color:var(--rule-dark)] text-[color:var(--ink-38)] hover:border-navy"
                      }`}
                    >
                      {String(n + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>

                <div className="h-px min-w-[120px] flex-1 bg-[color:var(--rule-dark)]">
                  <div className="h-px bg-navy" style={{ width: `${elapsed * 100}%` }} />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-20">
          <p className="mi mb-10 text-[color:var(--ink-38)]">Accredited &amp; supplied by</p>
          <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-10">
            {ACCREDITATIONS.map((a) => (
              <Image
                key={a.name}
                src={asset(a.mark)}
                alt={a.name}
                title={a.name}
                width={160}
                height={160}
                className="h-12 w-auto opacity-45 grayscale transition duration-700 hover:opacity-100 hover:grayscale-0 lg:h-14"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
