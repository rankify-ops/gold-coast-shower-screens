import { PROCESS } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Effica's vertical timeline: a marker on the left, the milestone on the
 * right, a connector running down between them.
 *
 * Theirs is a company history keyed to years. Ours is keyed to the job,
 * because a history would mean inventing dated milestones nobody published —
 * and the job timeline is the thing a customer actually wants to know: where
 * their screen is, and when it turns up.
 *
 * Every marker below is a fact from their own process copy. Nothing is
 * estimated.
 */
const MARKERS = ["On site", "At the factory", "Day 14"];

export function Timeline() {
  return (
    <section className="relative bg-paper">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <p className="mi text-[color:var(--ink-38)]">Start to finish</p>

        <h2 className="dsp-sm mt-8 max-w-[16ch] text-[clamp(28px,3.6vw,54px)]">
          What happens, and when.
        </h2>

        <ol className="mt-20">
          {PROCESS.map((step, i) => {
            const last = i === PROCESS.length - 1;
            return (
              <Reveal key={step.index} delay={i * 110}>
                <li className="grid gap-x-12 gap-y-4 sm:grid-cols-[minmax(140px,0.28fr)_auto_1fr]">
                  {/* Marker */}
                  <p className="dsp-sm-sentence pt-6 text-[clamp(18px,1.8vw,25px)] text-navy sm:text-right">
                    {MARKERS[i]}
                  </p>

                  {/* Dot and connector. The line is on the same grid column as
                      the dot and stretches the full row, so it joins one step
                      to the next with no measuring. */}
                  <div className="relative hidden w-3 justify-center sm:flex">
                    <span className="absolute top-[30px] z-10 h-3 w-3 rotate-45 bg-navy" />
                    {!last ? (
                      <span
                        aria-hidden
                        className="absolute top-[30px] h-full w-px bg-[color:var(--rule-dark)]"
                      />
                    ) : null}
                  </div>

                  {/* Milestone */}
                  <div className={`pt-5 ${last ? "pb-0" : "pb-14"}`}>
                    <div className="flex items-baseline gap-5">
                      <span className="mi text-[color:var(--ink-38)]">/{step.index}/</span>
                      <h3 className="dsp-sm-sentence text-[clamp(20px,2.1vw,30px)]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="bd-sentence mt-5 max-w-[54ch] text-[color:var(--ink-60)]">
                      {step.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
