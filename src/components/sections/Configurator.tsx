"use client";

import { useState } from "react";
import { Board } from "@/components/ui/Board";
import { SpecList } from "@/components/ui/Spec";
import { SmartLink } from "@/components/ui/SmartLink";
import { CONFIGURATOR } from "@/content/site";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Replaces the chatbot estimate on their current site.
 *
 * Every choice is visible at once rather than asked one at a time — someone
 * spending a couple of thousand dollars wants to see the shape of the
 * decision before they start making it, and a chat window hides exactly that.
 *
 * Options are text on a rule, not buttons. The rule is the control: it turns
 * navy on selection.
 */
export function Configurator() {
  const [choice, setChoice] = useState<Record<string, string>>({});

  const specs = CONFIGURATOR.filter((g) => choice[g.id]).map((g) => ({
    label: g.label,
    value: choice[g.id],
  }));
  const complete = specs.length === CONFIGURATOR.length;

  return (
    <section id="configurator" className="relative bg-paper">

      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="mi text-[color:var(--ink-38)]">(05) &mdash; Build it</p>
            <h2 className="dsp-sm mt-8 max-w-[18ch] text-[clamp(30px,4.6vw,68px)]">
              Tell us what you want.{" "}
              <span className="dim">We will tell you what it costs.</span>
            </h2>
          </div>
          <p className="mi max-w-[26ch] text-[color:var(--ink-38)]">
            Free measure &amp; quote. Nothing here is binding.
          </p>
        </div>

        <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_0.55fr] lg:gap-24">
          <div className="flex flex-col gap-14">
            {CONFIGURATOR.map((group, gi) => (
              <fieldset key={group.id}>
                <legend className="mi mb-6 flex items-center gap-4 text-[color:var(--ink-38)]">
                  <span className="text-navy">{String(gi + 1).padStart(2, "0")}</span>
                  {group.label}
                </legend>

                <div className="grid grid-cols-2 gap-x-8 sm:grid-cols-4">
                  {group.options.map((option) => {
                    const selected = choice[group.id] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setChoice((c) => ({ ...c, [group.id]: selected ? "" : option }))
                        }
                        className="group/o pt-2 text-left"
                      >
                        <span
                          className={`mi block transition-colors duration-500 ${
                            selected
                              ? "text-ink"
                              : "text-[color:var(--ink-38)] group-hover/o:text-ink"
                          }`}
                        >
                          {option}
                        </span>
                        <span
                          aria-hidden
                          className={`mt-3 block h-px transition-colors duration-500 ${
                            selected
                              ? "bg-navy"
                              : "bg-[color:var(--rule-dark)] group-hover/o:bg-[color:var(--ink-60)]"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <Board className="bg-white/[0.02] p-8">
              <p className="mi border-b border-[color:var(--rule-dark)] pb-5 text-[color:var(--ink-38)]">
                Your screen
              </p>

              <div className="mt-5 min-h-[160px]">
                {specs.length ? (
                  <SpecList specs={specs} />
                ) : (
                  <p className="bd text-[color:var(--ink-38)]">Choose a style to begin.</p>
                )}
              </div>

              <SmartLink
                href="#contact"
                className={`mi btn mt-8 w-full justify-center ${complete ? "btn-solid" : ""}`}
              >
                {complete ? "Get my price" : "Send this to us"}
                <Arrow />
              </SmartLink>
            </Board>
          </div>
        </div>
      </div>
    </section>
  );
}
