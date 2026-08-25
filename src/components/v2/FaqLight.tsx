"use client";

import { useState } from "react";
import { FAQ, SITE } from "@/content/site";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";

/**
 * FAQ as two columns of cards.
 *
 * v1 runs one full-width accordion down the page. This splits the questions
 * into two independent columns of rounded cards, so the list is half as tall
 * and opening one answer never pushes the questions below it off the screen —
 * the thing that makes a long single-column accordion tiring to use.
 *
 * Answers animate open on grid-template-rows rather than max-height, so the
 * card grows to exactly the height of its content with no magic number to get
 * wrong when the copy changes.
 */
export function FaqLight() {
  const [open, setOpen] = useState<number | null>(0);

  const columns = [
    FAQ.filter((_, i) => i % 2 === 0),
    FAQ.filter((_, i) => i % 2 === 1),
  ];

  return (
    <section id="faq" className="relative bg-paper">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
              Questions
            </p>
            <h2 className="mt-6 max-w-[14ch] text-[clamp(30px,4vw,60px)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
              Answered before you ask.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[14px] text-[color:var(--ink-60)]">Not covered here?</p>
            <a
              href={SITE.phoneHref}
              className="flex items-center gap-2.5 rounded-full border border-[color:var(--rule-dark)] px-5 py-3 text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-mist"
            >
              {SITE.phone}
            </a>
          </div>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-2">
          {columns.map((col, c) => (
            <div key={c} className="flex flex-col gap-4">
              {col.map((item) => {
                const idx = FAQ.indexOf(item);
                const isOpen = open === idx;
                return (
                  <div
                    key={item.q}
                    className={`rounded-[20px] border transition-colors duration-500 ${
                      isOpen
                        ? "border-navy bg-mist"
                        : "border-[color:var(--rule-dark)] bg-paper hover:border-navy"
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : idx)}
                      className="flex w-full items-start gap-5 p-6 text-left lg:p-7"
                    >
                      <span className="mt-0.5 text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>

                      <span className="flex-1 text-[16px] font-semibold leading-snug tracking-[-0.015em] text-ink">
                        {item.q}
                      </span>

                      {/* Plus that becomes a minus: the vertical stroke scales
                          to nothing so the horizontal never moves. */}
                      <span className="relative mt-1 h-3.5 w-3.5 flex-none">
                        <span className="absolute left-0 top-1/2 h-px w-3.5 -translate-y-1/2 bg-ink" />
                        <span
                          className={`absolute left-1/2 top-0 h-3.5 w-px -translate-x-1/2 bg-ink transition-transform duration-500 ${
                            isOpen ? "scale-y-0" : "scale-y-100"
                          }`}
                        />
                      </span>
                    </button>

                    <div
                      className="grid transition-[grid-template-rows] duration-500"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 pl-[3.4rem] text-[14px] leading-relaxed text-[color:var(--ink-60)] lg:px-7 lg:pb-7 lg:pl-[3.7rem]">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <SmartLink
            href="#configurator"
            className="flex items-center gap-2.5 rounded-full bg-navy px-7 py-4 text-[13px] font-medium text-white transition-colors duration-300 hover:bg-[color:var(--navy-lift)]"
          >
            Get an instant estimate
            <Arrow />
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
