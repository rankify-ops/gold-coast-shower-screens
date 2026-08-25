"use client";

import { useState } from "react";
import { FAQ } from "@/content/site";

/**
 * Hairline rows. Two crossed rules where a chevron would be — the vertical
 * one scales to nothing on open so the horizontal never moves.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative bg-mist">

      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.55fr_1fr] lg:gap-24">
          <div>
            <p className="mi text-[color:var(--ink-38)]">(08) &mdash; Questions</p>
            <h2 className="dsp-sm mt-8 max-w-[12ch] text-[clamp(28px,3.6vw,54px)]">
              The ones we get <span className="dim">asked most.</span>
            </h2>
          </div>

          <div className="border-t border-[color:var(--rule-dark)]">
            {FAQ.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q} className="border-b border-[color:var(--rule-dark)]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-8 py-6 text-left"
                  >
                    <span className="mi mi-lg transition-colors duration-300 group-hover:text-navy">
                      {item.q}
                    </span>
                    <span className="relative h-3 w-3 flex-none">
                      <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-[color:var(--ink-60)]" />
                      <span
                        className={`absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-[color:var(--ink-60)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>

                  {/* grid-rows 0fr to 1fr animates to auto height with no JS
                      measurement. */}
                  <div
                    className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="bd max-w-[54ch] pb-7 text-[color:var(--ink-60)]">
                        {item.a || "Answer to come from the client."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
