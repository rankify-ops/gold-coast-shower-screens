"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { PROCESS } from "@/content/site";

/**
 * Three stepped cards. Whichever one is hovered lights; the rest sit dim.
 *
 * The active card is tracked in state rather than done with :hover alone,
 * because the point is that exactly one step is lit at a time — with pure CSS
 * the first card would stay lit while a second was hovered on the way past.
 * Defaults to the first step so the pattern is legible before any interaction,
 * and on touch, where hover never fires at all.
 */
export function Process() {
  const [active, setActive] = useState(0);

  return (
    <section id="process" className="relative bg-navy on-dark">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-2">
          <p className="mi text-[color:var(--ink-38)]">(06) &mdash; How it works</p>

          <Reveal variant="mask">
            <h2 className="dsp-sm max-w-[18ch] text-[clamp(28px,4.2vw,62px)]">
              Measured, made and fitted by the same team.
            </h2>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {PROCESS.map((step, i) => {
            const on = active === i;
            return (
              <Reveal key={step.index} delay={i * 110}>
                <div
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  tabIndex={0}
                  className={`flex h-full min-h-[300px] flex-col justify-between p-8 transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:min-h-[380px] ${
                    on ? "bg-white text-navy" : "bg-white/[0.05] text-ink"
                  }`}
                >
                  <span className={`mi ${on ? "text-navy/45" : "text-[color:var(--ink-38)]"}`}>{step.index}</span>

                  <div>
                    <h3 className="dsp-sm text-[clamp(22px,2.4vw,34px)]">{step.title}</h3>
                    <p
                      className={`bd mt-5 max-w-[38ch] transition-colors duration-700 ${
                        on ? "text-navy/65" : "text-[color:var(--ink-60)]"
                      }`}
                    >
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
