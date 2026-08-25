import { IMPACT } from "@/content/site";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";

/**
 * One sentence, one number, nothing else.
 *
 * Borrowed from Effica's single-statement impact band: after a run of dense
 * sections, a screen that holds exactly one claim resets the reader and makes
 * that claim land harder than it would as a bullet among six.
 *
 * The figure is set inline in the sentence rather than stacked above it, so it
 * is read as part of the sentence rather than as a stat you can skip — and it
 * counts up, so the eye is pulled to it before the words either side.
 */
export function ImpactStat() {
  return (
    <section className="relative bg-paper">
      <div className="layer px-6 py-28 lg:px-12 lg:py-40">
        <Reveal variant="rise">
          <p className="mi text-center text-[color:var(--ink-38)]">{IMPACT.eyebrow}</p>

          <p className="dsp-sm-sentence mx-auto mt-12 max-w-[22ch] text-center text-[clamp(28px,4.6vw,68px)]">
            {IMPACT.before}{" "}
            <span className="whitespace-nowrap text-brass">
              <Counter to={IMPACT.figure} />
              {IMPACT.unit}
            </span>{" "}
            {IMPACT.after}
          </p>

          <p className="bd-sentence mx-auto mt-12 max-w-[46ch] text-center text-[color:var(--ink-60)]">
            {IMPACT.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
