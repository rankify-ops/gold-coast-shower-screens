import { PROCESS } from "@/content/site";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Effica's "fast track" steps: numbered stages laid across one row with a rule
 * running through them, and a call to action underneath.
 *
 * Their version runs four; ours runs their three, because measure / make /
 * install is the whole job and padding it to four to match a reference would
 * mean inventing a stage they do not have.
 *
 * The connector is a single hairline behind the row with the numerals sitting
 * on it — so the row reads as a sequence rather than three cards that happen to
 * be adjacent. Horizontal-scrolls on a phone rather than stacking, which keeps
 * the left-to-right reading of a process intact at every size.
 */
export function StepsRow() {
  return (
    <section className="relative bg-mist">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="mi text-[color:var(--ink-38)]">How it goes</p>
            <h2 className="dsp-sm mt-8 max-w-[16ch] text-[clamp(28px,3.6vw,54px)]">
              The fast track to a finished bathroom.
            </h2>
          </div>
          <p className="mi max-w-[24ch] text-[color:var(--ink-38)]">
            Measure to install in as little as 14 working days.
          </p>
        </div>

        <div className="relative mt-20">
          {/* The rule the numerals sit on. Behind everything, inset so it stops
              at the first and last step rather than running off the edges. */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[22px] hidden h-px bg-[color:var(--rule-dark)] lg:block"
          />

          <ol className="grid gap-12 lg:grid-cols-3 lg:gap-10">
            {PROCESS.map((step, i) => (
              <Reveal key={step.index} delay={i * 110}>
                <li className="relative">
                  <span className="mi relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--rule-dark)] bg-paper text-ink">
                    {step.index}
                  </span>

                  <h3 className="dsp-sm-sentence mt-8 text-[clamp(20px,2.1vw,30px)]">
                    {step.title}
                  </h3>

                  <p className="bd-sentence mt-5 max-w-[38ch] text-[color:var(--ink-60)]">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <SmartLink href="#configurator" className="mi btn btn-solid mt-16">
          Start with a free measure
          <Arrow />
        </SmartLink>
      </div>
    </section>
  );
}
