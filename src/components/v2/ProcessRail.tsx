"use client";

import { useEffect, useRef, useState } from "react";
import { PROCESS } from "@/content/site";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";

/**
 * The three stages, on a rail that draws itself as you arrive.
 *
 * v1 sets the process on navy as a numbered list. This one keeps the light
 * ground and gives the sequence a line that fills left-to-right in step with
 * the section entering the viewport, with each node lighting as the line
 * reaches it.
 *
 * The fill is tied to scroll position rather than to a one-shot reveal, so
 * scrolling back up unwinds it — the line is a progress indicator, not an
 * entrance animation, and treating it as one would make it lie the second
 * someone scrolled up.
 */
export function ProcessRail() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        // 0 as the rail reaches the lower third, 1 once it passes the middle.
        const start = window.innerHeight * 0.85;
        const end = window.innerHeight * 0.4;
        const p = (start - r.top) / (start - end);
        setProgress(Math.min(1, Math.max(0, p)));
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
    <section id="process" className="relative bg-paper">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
              How it goes
            </p>
            <h2 className="mt-6 max-w-[14ch] text-[clamp(30px,4vw,60px)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
              Three steps, fourteen days.
            </h2>
          </div>
          <SmartLink
            href="#configurator"
            className="flex items-center gap-2.5 rounded-full bg-navy px-6 py-3.5 text-[13px] font-medium text-white transition-colors duration-300 hover:bg-[color:var(--navy-lift)]"
          >
            Book a free measure
            <Arrow />
          </SmartLink>
        </div>

        <div ref={ref} className="relative mt-20">
          {/* The rail, and the fill that chases it. */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-6 hidden h-px bg-[color:var(--rule-dark)] lg:block"
          >
            <div
              className="h-px bg-navy transition-[width] duration-200"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <ol className="grid gap-12 lg:grid-cols-3 lg:gap-10">
            {PROCESS.map((step, i) => {
              // Each node lights once the fill has reached its position.
              const lit = progress >= i / PROCESS.length;
              return (
                <li key={step.index} className="relative">
                  <span
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border text-[13px] font-medium transition-all duration-500 ${
                      lit
                        ? "border-navy bg-navy text-white"
                        : "border-[color:var(--rule-dark)] bg-paper text-[color:var(--ink-38)]"
                    }`}
                  >
                    {step.index}
                  </span>

                  <h3 className="mt-8 text-[clamp(22px,2.2vw,32px)] font-semibold tracking-[-0.025em] text-ink">
                    {step.title}
                  </h3>

                  <p className="mt-5 max-w-[40ch] text-[14px] leading-relaxed text-[color:var(--ink-60)]">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
