import { WHY } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Effica's "why companies choose us" grid: numbered pill badges over a
 * four-across advantage list.
 *
 * The badge is doing real work — a filled, rounded number reads as a step in a
 * set, so four cards are taken in as one argument rather than four unrelated
 * boasts. Their icons sit beside it.
 *
 * An alternative to the Why Us accordion for anyone who would rather see all
 * six reasons at once than open them one at a time. Runs six across three
 * columns so nothing is cut — Effica shows four, but dropping two of their
 * reasons to match a reference layout would be the wrong trade.
 */
export function AdvantageGrid() {
  return (
    <section className="relative bg-mist">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <p className="mi text-[color:var(--ink-38)]">Our advantages include:</p>

        <h2 className="dsp-sm mt-8 max-w-[20ch] text-[clamp(28px,3.6vw,54px)]">
          Why people choose us over a cheaper quote.
        </h2>

        <div className="mt-16 grid gap-px border border-[color:var(--rule-dark)] bg-[color:var(--rule-dark)] sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 70} className="bg-paper">
              <div className="group flex h-full flex-col gap-7 p-7 transition-colors duration-500 hover:bg-mist lg:p-9">
                <div className="flex items-center justify-between gap-4">
                  {/* Filled numeral pill — the thing that makes six cards read
                      as one set rather than six separate claims. */}
                  <span className="mi flex h-9 min-w-9 items-center justify-center rounded-full bg-navy px-3 text-white">
                    {item.index}
                  </span>

                  {item.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={asset(item.icon)}
                      alt=""
                      aria-hidden
                      className="h-11 w-11 flex-none opacity-60 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:opacity-100"
                    />
                  ) : null}
                </div>

                <h3 className="dsp-sm-sentence max-w-[16ch] text-[clamp(18px,1.8vw,25px)]">
                  {item.title}
                </h3>

                <p className="bd-sentence text-[color:var(--ink-60)]">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
