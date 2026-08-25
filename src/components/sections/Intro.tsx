import { Reveal } from "@/components/ui/Reveal";
import { INTRO, PROOF } from "@/content/site";
import { Counter } from "@/components/ui/Counter";

/**
 * First light slab, straight off the dark hero.
 *
 * Split down the middle with the two halves offset: the heading lands right,
 * the supporting copy sits low on the left. That offset is what stops a
 * full-bleed colour block reading as a slide.
 *
 * Their three headline figures close the section, so the positioning claim and
 * the evidence for it arrive together rather than being separated by four
 * screens of scrolling the way they are on the current site.
 */
export function Intro() {
  return (
    <section id="about" className="relative bg-paper">
      <div className="layer grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-between border-b border-[color:var(--rule-dark)] px-6 py-16 lg:border-b-0 lg:px-12 lg:py-24">
          <p className="mi text-[color:var(--ink-38)]">(01) &mdash; Who we are</p>

          <Reveal delay={140}>
            <p className="bd mt-14 max-w-[42ch] text-[color:var(--ink-60)] lg:mt-0">
              {INTRO.sub}
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col justify-center px-6 py-16 lg:border-l lg:border-[color:var(--rule-dark)] lg:px-12 lg:py-24">
          <Reveal variant="mask">
            <h2 className="dsp-sm text-[clamp(28px,4vw,62px)]">
              Gold Coast&rsquo;s leading shower screen specialist.
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="bd mt-10 max-w-[46ch] text-[color:var(--ink-60)]">{INTRO.body}</p>
          </Reveal>
        </div>
      </div>

      {/* Figures, full width, hairline-separated. */}
      <div className="layer grid gap-px border-y border-[color:var(--rule-dark)] bg-[color:var(--rule-dark)] sm:grid-cols-3">
        {PROOF.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 100} className="bg-paper px-6 py-12 lg:px-12">
            <p className="dsp text-[clamp(34px,4.4vw,66px)]">
              <Counter to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mi mt-4 text-ink">{stat.label}</p>
            <p className="bd mt-4 max-w-[34ch] text-[color:var(--ink-60)]">{stat.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
