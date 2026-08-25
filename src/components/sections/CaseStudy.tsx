import { CASE_STUDY } from "@/content/site";
import { Stars } from "@/components/ui/Stars";
import { Reveal } from "@/components/ui/Reveal";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";

/**
 * One job, told properly.
 *
 * Effica's case-study card: metadata down the left, the narrative and its
 * outcomes on the right. The pattern works because the reader can take the
 * shape of the job in two seconds from the left column and only commit to the
 * story if it looks like their job.
 *
 * The narrative here is the customer's own review rather than a case study
 * written about them — same reason the review wall exists. It means the
 * "outcomes" are only things the review itself states.
 */
export function CaseStudy() {
  return (
    <section className="relative bg-mist">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <Reveal variant="rise">
          <div className="border border-[color:var(--rule-dark)] bg-paper">
            <div className="grid gap-px bg-[color:var(--rule-dark)] lg:grid-cols-[0.42fr_1fr]">
              {/* Metadata rail */}
              <div className="bg-paper p-8 lg:p-12">
                <p className="mi text-[color:var(--ink-38)]">{CASE_STUDY.eyebrow}</p>

                <h2 className="dsp-sm-sentence mt-8 text-[clamp(24px,2.6vw,38px)]">
                  {CASE_STUDY.client}
                </h2>

                <dl className="mt-10 border-t border-[color:var(--rule-dark)]">
                  {CASE_STUDY.meta.map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[color:var(--rule-dark)] py-4"
                    >
                      <dt className="mi text-[color:var(--ink-38)]">{row.label}</dt>
                      <dd className="mi text-ink">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Narrative */}
              <div className="flex flex-col justify-between bg-paper p-8 lg:p-12">
                <div>
                  <Stars size={18} label="Five stars" className="text-brass" />
                  <blockquote className="dsp-sm-sentence mt-8 max-w-[42ch] text-[clamp(18px,1.9vw,27px)]">
                    &ldquo;{CASE_STUDY.quote}&rdquo;
                  </blockquote>
                  <p className="mi mt-8 text-[color:var(--ink-38)]">
                    {CASE_STUDY.name}
                    <span className="mx-3">&middot;</span>
                    Google
                  </p>
                </div>

                <div className="mt-12 flex flex-wrap items-end justify-between gap-8 border-t border-[color:var(--rule-dark)] pt-8">
                  <div className="flex gap-12">
                    {CASE_STUDY.outcomes.map((o) => (
                      <div key={o.label}>
                        <p className="dsp text-[clamp(30px,3.4vw,50px)] leading-none text-navy">
                          {o.figure}
                        </p>
                        <p className="mi mt-3 max-w-[14ch] text-[color:var(--ink-38)]">{o.label}</p>
                      </div>
                    ))}
                  </div>

                  <SmartLink href="#configurator" className="mi btn">
                    Get yours priced
                    <Arrow />
                  </SmartLink>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
