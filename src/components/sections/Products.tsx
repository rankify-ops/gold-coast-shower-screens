"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SpecList } from "@/components/ui/Spec";
import { SmartLink } from "@/components/ui/SmartLink";
import { PRODUCTS } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Index on the left that stays put, full-height panels on the right.
 *
 * Sticky positioning rather than a scroll-scrubbed timeline: every panel
 * remains a normal block in the document, so the section stays keyboard
 * navigable and legible to a screen reader.
 */
export function Products() {
  const [active, setActive] = useState(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Hovering an index row brings its panel to the screen.
   *
   * Debounced, because dragging the pointer down the list crosses every row on
   * the way: without the delay each one would fire a smooth scroll and they
   * would fight each other all the way down. 140ms means only the row actually
   * settled on wins.
   *
   * Nothing sets `active` here — the panel observer still does that on its own
   * as the scroll arrives, so the index highlight and the progress rule behave
   * exactly as they do when scrolling by hand.
   */
  const goTo = useCallback((i: number) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      panels.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 140);
  }, []);

  const cancelGo = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }, []);

  useEffect(() => () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = panels.current.findIndex((el) => el === entry.target);
          if (i >= 0) setActive(i);
        });
      },
      // Trips at the vertical midpoint, so the index changes exactly as a
      // panel takes over the screen.
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    panels.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="products" className="relative bg-mist">

      <div className="layer lg:grid lg:grid-cols-[0.5fr_1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-0 flex h-svh flex-col justify-center px-12">
            <p className="mi text-[color:var(--ink-38)]">(02) — What we make</p>

            <h2 className="dsp mt-10 text-[clamp(30px,3.2vw,50px)]">
              Four things.
              <br />
              <span className="dim">All of them glass.</span>
            </h2>

            <ol className="mt-14 border-t border-[color:var(--rule-dark)]">
              {PRODUCTS.map((p, i) => (
                <li key={p.name} className="border-b border-[color:var(--rule-dark)]">
                  <button
                    type="button"
                    onMouseEnter={() => goTo(i)}
                    onMouseLeave={cancelGo}
                    onFocus={() => goTo(i)}
                    onClick={() => {
                      cancelGo();
                      panels.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="group flex w-full items-center gap-5 py-4 text-left"
                  >
                    <span
                      className={`mi transition-colors duration-500 ${
                        i === active ? "text-navy" : "text-[color:var(--ink-38)]"
                      }`}
                    >
                      {p.index}
                    </span>
                    <span
                      className={`mi transition-colors duration-500 ${
                        i === active ? "text-ink" : "text-[color:var(--ink-38)]"
                      }`}
                    >
                      {p.name}
                    </span>
                    {/* Progress bar built from the grid's own hairline. */}
                    <span
                      aria-hidden
                      className={`ml-auto h-px bg-navy transition-all duration-700 ${
                        i === active ? "w-14 opacity-100" : "w-0 opacity-0"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="border-l border-[color:var(--rule-dark)]">
          {PRODUCTS.map((p, i) => (
            <div
              key={p.name}
              ref={(el) => {
                panels.current[i] = el;
              }}
              className="flex min-h-svh flex-col justify-center border-b border-[color:var(--rule-dark)] px-6 py-20 last:border-b-0 lg:px-14"
            >
              <div className="mi flex items-center justify-between text-[color:var(--ink-38)]">
                <span className="text-navy lg:hidden">{p.index}</span>
                <span className="hidden lg:block">({p.index})</span>
                <span>{p.finish}</span>
              </div>

              <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden bg-mist">
                <Image
                  src={asset(p.image)}
                  alt={p.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 62vw"
                  className="object-cover"
                />
              </div>

              <h3 className="dsp mt-9 text-[clamp(30px,4vw,62px)]">{p.name}</h3>

              <div className="mt-8 grid gap-10 sm:grid-cols-[1fr_0.85fr]">
                <div>
                  <p className="bd max-w-[36ch] text-[color:var(--ink-60)]">{p.line}</p>
                  <SmartLink href="#configurator" className="mi btn mt-9">
                    Configure
                    <Arrow />
                  </SmartLink>
                </div>
                <SpecList specs={p.specs} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
