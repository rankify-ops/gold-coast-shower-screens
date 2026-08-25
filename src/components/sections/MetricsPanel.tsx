import Image from "next/image";
import { asset } from "@/lib/basePath";
import { PROOF, GALLERY } from "@/content/site";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Effica's metrics showcase: three counting figures on the left, product
 * imagery on the right.
 *
 * Different job to the figures under the intro, which are read as part of a
 * claim being made in prose. Here they carry a screen on their own, against a
 * photograph, so the numbers are the argument rather than the footnote to one.
 *
 * The counters replay on every scroll back, same as everywhere else.
 */
export function MetricsPanel() {
  return (
    <section className="relative bg-paper">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.92fr] lg:gap-20">
          <Reveal variant="rise">
            <p className="mi text-[color:var(--ink-38)]">By the numbers</p>

            <h2 className="dsp-sm mt-8 max-w-[14ch] text-[clamp(28px,3.8vw,58px)]">
              Sixteen years of it.
            </h2>

            <dl className="mt-14 border-t border-[color:var(--rule-dark)]">
              {PROOF.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-b border-[color:var(--rule-dark)] py-7"
                >
                  <dt className="dsp min-w-[4.5ch] text-[clamp(30px,3.6vw,54px)] leading-none text-navy">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </dt>
                  <dd className="flex-1">
                    <p className="mi text-ink">{stat.label}</p>
                    <p className="bd-sentence mt-2 max-w-[38ch] text-[color:var(--ink-60)]">
                      {stat.body}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>

            <SmartLink href="#configurator" className="mi btn btn-solid mt-12">
              Get an instant estimate
              <Arrow />
            </SmartLink>
          </Reveal>

          <Reveal variant="rise" delay={120}>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-mist">
              <Image
                src={asset(GALLERY[5].image)}
                alt={GALLERY[5].name}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
