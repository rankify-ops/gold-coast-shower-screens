"use client";

import { useState } from "react";
import { WHY } from "@/content/site";
import { asset } from "@/lib/basePath";

/**
 * Their six "Why Choose Us" points as a numbered accordion.
 *
 * On the current site these are six equal blocks of body copy, which means
 * nobody reads any of them. Collapsed to titles, the whole proposition is
 * scannable in one screen and the detail opens on hover. First row opens by
 * default so the pattern is obvious without interaction.
 */
export function WhyUs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="why" className="relative bg-mist">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="mi text-[color:var(--ink-38)]">(04) &mdash; Why us</p>
          <p className="mi max-w-[26ch] text-[color:var(--ink-38)]">
            Six reasons people choose us over a cheaper quote.
          </p>
        </div>

        <div className="mt-16 border-t border-[color:var(--rule-dark)]">
          {WHY.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.index} className="border-b border-[color:var(--rule-dark)]">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  // Hover opens; click still toggles, which is what touch and
                  // the keyboard get. Deliberately no close on mouse-leave —
                  // running the pointer down the list would slam every row
                  // shut behind it, and the row you left is the one you were
                  // just reading. It stays open until another takes over.
                  onMouseEnter={() => setOpen(i)}
                  onFocus={() => setOpen(i)}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center gap-6 py-7 text-left lg:gap-12"
                >
                  <span
                    className={`mi flex-none transition-colors duration-500 ${
                      isOpen ? "text-ink" : "text-[color:var(--ink-38)]"
                    }`}
                  >
                    {item.index}
                  </span>

                  {/* Their own icon for each reason, straight off their site.
                      Kept as an <img> rather than a CSS mask because these are
                      two-tone marks — masking would flatten them to one
                      colour and lose the taupe. */}
                  {item.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={asset(item.icon)}
                      alt=""
                      aria-hidden
                      className={`h-11 w-11 flex-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen ? "opacity-100" : "opacity-55"
                      } group-hover:scale-110 group-hover:opacity-100`}
                    />
                  ) : null}

                  <span className="dsp-sm-sentence flex-1 text-[clamp(20px,2.6vw,38px)]">
                    {item.title}
                  </span>

                  {/* Crossed rules instead of a chevron; the vertical scales to
                      nothing on open so the horizontal never moves. */}
                  <span className="relative h-3.5 w-3.5 flex-none">
                    <span className="absolute left-0 top-1/2 h-px w-3.5 -translate-y-1/2 bg-ink" />
                    <span
                      className={`absolute left-1/2 top-0 h-3.5 w-px -translate-x-1/2 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen ? "scale-y-0" : "scale-y-100"
                      }`}
                    />
                  </span>
                </button>

                {/* grid-rows 0fr to 1fr animates to auto height with no JS
                    measurement. */}
                <div
                  className="grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="bd-sentence max-w-[62ch] pb-9 text-[color:var(--ink-60)] lg:ml-[calc(2rem+3rem)]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
