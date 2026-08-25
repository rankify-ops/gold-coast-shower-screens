import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Effica's three-column pricing table, with the prices taken out.
 *
 * They do not publish prices — every screen is made to measure, so a figure on
 * a card would be a made-up number. What the layout is genuinely good at is
 * comparison, and that part survives intact: three styles side by side, the
 * same six rows on each, so the differences are readable at a glance instead of
 * buried in prose.
 *
 * Every row below is drawn from their own product copy. There is deliberately
 * no "most popular" badge — Effica's card carries one, but which style sells
 * best is theirs to say, not ours to invent.
 */
const TIERS = [
  {
    name: "Framed",
    line: "The most economical way to enclose a shower, and the most forgiving of an out-of-square wall.",
    rows: [
      { k: "Glass", v: "6mm toughened" },
      { k: "Frame", v: "Full perimeter" },
      { k: "Door", v: "Pivot or sliding" },
      { k: "Finishes", v: "6 hardware options" },
      { k: "Made to measure", v: "Yes" },
      { k: "Warranty", v: "3 years" },
    ],
  },
  {
    name: "Semi-frameless",
    line: "Framed where it has to be, frameless where it shows. The middle ground most bathrooms land on.",
    rows: [
      { k: "Glass", v: "6mm toughened" },
      { k: "Frame", v: "Partial" },
      { k: "Door", v: "Frameless leaf" },
      { k: "Finishes", v: "6 hardware options" },
      { k: "Made to measure", v: "Yes" },
      { k: "Warranty", v: "3 years" },
    ],
  },
  {
    name: "Frameless",
    line: "Glass, hinges and nothing else. Templated on site because there is no frame to take up the tolerance.",
    rows: [
      { k: "Glass", v: "10mm toughened" },
      { k: "Frame", v: "None" },
      { k: "Door", v: "Hinged or fixed panel" },
      { k: "Finishes", v: "6 hardware options" },
      { k: "Made to measure", v: "Yes" },
      { k: "Warranty", v: "3 years" },
    ],
  },
];

export function TierTable() {
  return (
    <section className="relative bg-mist">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="mi text-[color:var(--ink-38)]">Three ways to do it</p>
            <h2 className="dsp-sm mt-8 max-w-[16ch] text-[clamp(28px,3.6vw,54px)]">
              Compare the styles.
            </h2>
          </div>
          <p className="mi max-w-[26ch] text-[color:var(--ink-38)]">
            Every screen is made to measure, so every price is quoted on the space.
          </p>
        </div>

        <div className="mt-16 grid gap-px border border-[color:var(--rule-dark)] bg-[color:var(--rule-dark)] lg:grid-cols-3">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 90} className="bg-paper">
              <div className="flex h-full flex-col p-7 lg:p-10">
                <h3 className="dsp-sm-sentence text-[clamp(22px,2.3vw,32px)]">{tier.name}</h3>

                <p className="bd-sentence mt-5 min-h-[5.5em] max-w-[34ch] text-[color:var(--ink-60)]">
                  {tier.line}
                </p>

                {/* Price slot, kept as a slot. An empty space where a figure
                    would sit says "quoted on the job" more clearly than a
                    number with an asterisk on it. */}
                <p className="dsp mt-8 text-[clamp(26px,2.6vw,38px)] leading-none text-navy">
                  Quoted
                  <span className="mi ml-3 align-middle text-[color:var(--ink-38)]">
                    on measure
                  </span>
                </p>

                <dl className="mt-10 flex-1 border-t border-[color:var(--rule-dark)]">
                  {tier.rows.map((row) => (
                    <div
                      key={row.k}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[color:var(--rule-dark)] py-3.5"
                    >
                      <dt className="mi text-[color:var(--ink-38)]">{row.k}</dt>
                      <dd className="mi text-ink">{row.v}</dd>
                    </div>
                  ))}
                </dl>

                <SmartLink
                  href="#configurator"
                  className={`mi btn mt-10 ${i === 2 ? "btn-solid" : ""}`}
                >
                  Get a price
                  <Arrow />
                </SmartLink>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
