"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PRODUCTS } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";

/**
 * (02) — What we make. Ported from the /split build, restyled for this page.
 *
 * Index on the left that stays put, full-height panels on the right. Sticky
 * positioning rather than a scroll-scrubbed timeline: every panel remains a
 * normal block in the document, so the section stays keyboard navigable and
 * legible to a screen reader, and nothing breaks if JS never runs.
 *
 * WHAT THE OBSERVER IS FOR: the index highlight follows the scroll rather than
 * being set by whatever was last clicked. It trips at the viewport's vertical
 * midpoint, so a row lights exactly as its panel takes the screen — the same
 * behaviour whether you arrived by hovering the index or by scrolling past it.
 *
 * The pinned column offsets by the FIXED header (71px) instead of top-0, and
 * its height is the viewport minus the same 71 — otherwise "centred" means
 * centred in the whole viewport and the index rides low, half of it under the
 * frosted bar.
 *
 * This also restores `#products`, which the mega menu and the hero's four
 * category links have been pointing at since the old ranges section came out.
 *
 * THE PLATE IS SIZED BY ASPECT, AND THE PANEL IS ALLOWED TO EXCEED THE
 * VIEWPORT. That is deliberate, and it is the second time round on this.
 *
 * It was switched to a viewport-relative height so the whole panel — plate,
 * name, copy, specs — would fit inside 100svh with nothing below the fold.
 * That bought a tidy fold at the cost of the only thing anyone is here to
 * look at: three of the four source photographs are portrait, 750x1000, so a
 * short wide frame crops them to a letterbox. At 42svh it showed a quarter of
 * each picture; at 54svh, a third.
 *
 * 4/3 is squarer than the 16/10 this started as, because with portrait
 * sources height is exactly what buys coverage — it shows a little over half
 * of each photograph. The panel is taller than the viewport as a result and
 * the product name sits below the fold on arrival. Correct trade: the panel
 * scrolls, and a cropped photograph does not uncrop.
 *
 * The real constraint here is WIDTH, not height — a full-bleed frame in a
 * column this wide cannot suit a portrait photograph at any height. The fixes
 * that actually close it are landscape source images, or moving the plate
 * beside the copy instead of above it.
 */
export function ProductsSection() {
  const [active, setActive] = useState(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Hovering an index row brings its panel to the screen — debounced, because
   * dragging the pointer down the list crosses every row on the way. Without
   * the delay each one fires a smooth scroll and they fight each other all the
   * way down. 140ms means only the row actually settled on wins.
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

  useEffect(
    () => () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = panels.current.findIndex((el) => el === entry.target);
          if (i >= 0) setActive(i);
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    panels.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const font = "var(--font-geist), ui-sans-serif, system-ui, sans-serif";

  return (
    <section
      id="products"
      className="relative"
      style={{ background: "#f5f5f5", color: "var(--ink)" }}
    >
      <div className="lg:grid lg:grid-cols-[0.5fr_1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-[71px] flex h-[calc(100svh-71px)] flex-col justify-center px-14">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[color:var(--sky)]">
              (02) &mdash; What we make
            </p>

            <h2
              className="mt-10 text-[clamp(30px,3.2vw,50px)] font-medium leading-[1.04] tracking-[-0.035em]"
              style={{ fontFamily: font }}
            >
              Four things.
              <br />
              <span className="text-[color:var(--ink-3)]">All of them glass.</span>
            </h2>

            <ol className="mt-14 border-t border-[color:var(--rule)]">
              {PRODUCTS.map((p, i) => (
                <li key={p.name} className="border-b border-[color:var(--rule)]">
                  <button
                    type="button"
                    onMouseEnter={() => goTo(i)}
                    onMouseLeave={cancelGo}
                    onFocus={() => goTo(i)}
                    onClick={() => {
                      cancelGo();
                      panels.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="group flex w-full items-center gap-6 py-5 text-left"
                  >
                    {/* The number stays micro — it is an index, not a name.
                        The name is the thing you click, so it is set at list
                        scale rather than label scale: 11px uppercase made the
                        four ranges read as a footnote under a 50px heading. */}
                    <span
                      className={`text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-500 ${
                        i === active ? "text-[color:var(--sky)]" : "text-[color:var(--ink-3)]"
                      }`}
                    >
                      {p.index}
                    </span>
                    <span
                      className={`text-[clamp(20px,1.6vw,26px)] font-medium tracking-[-0.03em] transition-all duration-500 group-hover:translate-x-1 ${
                        i === active ? "text-[color:var(--ink)]" : "text-[color:var(--ink-2)]"
                      }`}
                      style={{ fontFamily: font }}
                    >
                      {p.name}
                    </span>
                    {/* Progress rule, drawn in the grid's own hairline colour. */}
                    <span
                      aria-hidden
                      className={`ml-auto h-px bg-[color:var(--navy)] transition-all duration-700 ${
                        i === active ? "w-14 opacity-100" : "w-0 opacity-0"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="lg:border-l lg:border-[color:var(--rule)]">
          {PRODUCTS.map((p, i) => (
            <div
              key={p.name}
              ref={(el) => {
                panels.current[i] = el;
              }}
              className="flex min-h-svh flex-col justify-center border-b border-[color:var(--rule)] px-8 py-20 last:border-b-0 lg:px-14"
            >
              <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--ink-3)]">
                <span className="text-[color:var(--brass)] lg:hidden">{p.index}</span>
                <span className="hidden lg:block">({p.index})</span>
                <span>{p.finish}</span>
              </div>

              <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden bg-[color:var(--navy)]/5 lg:aspect-[4/3]">
                <Image
                  src={asset(p.image)}
                  alt={p.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 62vw"
                  className="object-cover"
                />
              </div>

              <h3
                className="mt-9 text-[clamp(30px,4vw,62px)] font-medium leading-[1.02] tracking-[-0.04em]"
                style={{ fontFamily: font }}
              >
                {p.name}
              </h3>

              <div className="mt-8 grid gap-10 sm:grid-cols-[1fr_0.85fr]">
                <div>
                  <p className="max-w-[36ch] text-[16px] leading-[1.65] text-[color:var(--ink-2)]">
                    {p.line}
                  </p>
                  <SmartLink
                    href="#configurator"
                    className="mt-9 inline-flex items-center gap-3 bg-[color:var(--navy)] px-8 py-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-colors duration-500 hover:bg-[color:var(--navy-lift)]"
                  >
                    Configure
                    <Arrow />
                  </SmartLink>
                </div>

                {/*
                    Spec sheet, written out here rather than reusing SpecList.
                    That component deliberately reads --ink / --ink-38 /
                    --rule-dark so it can invert inside .on-dark — but this page
                    defines none of them, so every row would render invisible.
                */}
                <dl className="flex flex-col">
                  {p.specs.map((sp) => (
                    <div
                      key={sp.label}
                      className="flex items-baseline gap-4 border-b border-[color:var(--rule)] py-3 text-[11px] font-medium uppercase tracking-[0.14em] last:border-b-0"
                    >
                      <dt className="text-[color:var(--ink-3)]">{sp.label}</dt>
                      <dd className="ml-auto text-right text-[color:var(--ink)]">{sp.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
