import { PRODUCTS } from "@/content/site";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Effica's four-column service cards, on our four product lines.
 *
 * Their pattern: a numbered eyebrow, the service name, a short body, then the
 * detail reduced to tag pills along the bottom. The pills are the reason it
 * works — they let someone scanning four cards compare the specs across all
 * four without reading any of the bodies.
 *
 * An alternative to the full-height Products section rather than a companion
 * to it: same four lines, same specs, one screen instead of five.
 */
export function ServiceCards() {
  return (
    <section className="relative bg-paper">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="mi text-[color:var(--ink-38)]">What we make</p>
            <h2 className="dsp-sm mt-8 max-w-[18ch] text-[clamp(28px,3.6vw,54px)]">
              Four lines, one factory.
            </h2>
          </div>
          <SmartLink href="#configurator" className="mi btn">
            Price any of them
            <Arrow />
          </SmartLink>
        </div>

        <div className="mt-16 grid gap-px border border-[color:var(--rule-dark)] bg-[color:var(--rule-dark)] sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 80} className="bg-paper">
              <SmartLink
                href="#products"
                className="group flex h-full flex-col justify-between gap-10 p-7 transition-colors duration-500 hover:bg-mist lg:p-9"
              >
                <div>
                  <p className="mi text-[color:var(--ink-38)]">/{p.index}/</p>

                  <h3 className="dsp-sm-sentence mt-8 text-[clamp(19px,1.9vw,26px)]">
                    {p.name}
                  </h3>

                  <p className="bd-sentence mt-5 text-[color:var(--ink-60)]">{p.line}</p>
                </div>

                {/* Specs as pills — scannable across all four cards at once. */}
                <ul className="flex flex-wrap gap-2">
                  {p.specs.map((s) => (
                    <li
                      key={s.label}
                      className="mi rounded-full border border-[color:var(--rule-dark)] px-3 py-1.5 text-[color:var(--ink-38)] transition-colors duration-500 group-hover:border-navy group-hover:text-ink"
                    >
                      {s.value}
                    </li>
                  ))}
                </ul>
              </SmartLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
