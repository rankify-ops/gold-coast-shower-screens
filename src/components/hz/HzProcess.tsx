import { PROCESS, WHY } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Label, Rise, BarButton } from "@/components/hz/Bits";

/**
 * 04 — How it goes.
 *
 * The reference's process section: the heading pinned in a sticky left column
 * while the steps scroll past it on the right. The pin is the whole idea —
 * the question stays on screen the entire time you are reading the answer, so
 * a long right-hand column never loses its frame.
 *
 * Their six reasons close it as a plain hairline list. Titles only: the
 * accordion versions elsewhere in this project already give the bodies room,
 * and here the point is that there are six of them.
 */
export function HzProcess() {
  return (
    <section id="process" className="hz-grid relative border-t border-[color:var(--hz-line)]">
      <div className="hz-pad hz-sec">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Pinned */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Label n="04">How it goes</Label>

            <Rise>
              <h2 className="hz-dsp hz-dsp-lg mt-12 max-w-[10ch]">
                Three steps
                <br />
                <span className="hz-dim">to launch.</span>
              </h2>

              <p className="hz-body mt-8 max-w-[34ch] text-[color:var(--hz-muted)]">
                From the first phone call to the last silicone bead — measure to
                install in as little as 14 working days.
              </p>

              <div className="mt-10">
                <BarButton note="/Free" href="#configurator">
                  Book a measure
                </BarButton>
              </div>
            </Rise>
          </div>

          {/* Scrolling */}
          <ol>
            {PROCESS.map((step, i) => (
              <Rise key={step.index} as="li" delay={i * 80}>
                <div className="border-t border-[color:var(--hz-line)] py-10 lg:py-14">
                  <div className="flex items-baseline gap-6 lg:gap-10">
                    <span className="hz-mono text-[color:var(--hz-accent)]">{step.index}</span>
                    <h3 className="hz-dsp hz-dsp-md">{step.title}</h3>
                  </div>
                  <p className="hz-body mt-6 max-w-[52ch] text-[color:var(--hz-muted)] lg:ml-[4.4rem]">
                    {step.body}
                  </p>
                </div>
              </Rise>
            ))}

            {/* Their six reasons, as the closing list. */}
            <Rise as="li" delay={260}>
              <div className="border-t border-[color:var(--hz-line)] pt-10 lg:pt-14">
                <p className="hz-mono text-[color:var(--hz-muted)]">Why people choose us</p>
                <ul className="mt-8">
                  {WHY.map((w) => (
                    <li
                      key={w.title}
                      className="group flex items-center gap-5 border-b border-[color:var(--hz-line)] py-4"
                    >
                      <span className="hz-mono-sm w-6 flex-none text-[color:var(--hz-muted)]">
                        {w.index}
                      </span>
                      {w.icon ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={asset(w.icon)}
                          alt=""
                          aria-hidden
                          className="h-7 w-7 flex-none opacity-60 transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : null}
                      <span className="hz-body flex-1">{w.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Rise>
          </ol>
        </div>
      </div>
    </section>
  );
}
