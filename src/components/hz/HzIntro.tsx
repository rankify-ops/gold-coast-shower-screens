import Image from "next/image";
import { INTRO, PROOF, SITE } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Label, Rise, Tally, BarButton } from "@/components/hz/Bits";

/**
 * 01 — Who we are.
 *
 * The reference's opening light section: a two-tone display sentence in the
 * left column, a portrait plate on the right, and the figures underneath on a
 * full-width hairline row.
 *
 * The two-tone sentence is the mechanic worth copying. There is no bold weight
 * anywhere in that template — emphasis is carried entirely by dimming the
 * words that are not the point, so the eye lands on the four or five that are.
 */
export function HzIntro() {
  return (
    <section id="about" className="hz-grid relative border-t border-[color:var(--hz-line)]">
      <div className="hz-head hz-pad hz-sec">
        <Label n="01">Who we are</Label>

        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Rise>
            <h2 className="hz-dsp hz-dsp-lg max-w-[15ch]">
              <span className="hz-dim">Gold Coast&rsquo;s leading</span> shower screen{" "}
              <span className="hz-dim">specialist.</span>
            </h2>

            <p className="hz-body mt-10 max-w-[52ch] text-[color:var(--hz-muted)]">
              {INTRO.body}
            </p>

            <div className="mt-12">
              <BarButton note="/Free" href="#configurator">
                Get an instant estimate
              </BarButton>
            </div>
          </Rise>

          <Rise delay={120}>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[color:var(--hz-line)]">
              <Image
                src={asset("/img/site/factory.webp")}
                alt="The Gold Coast Shower Screens factory at Coombabah"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <p className="hz-mono-sm absolute bottom-4 left-4 bg-[#121212] px-3 py-2 text-white">
                Our factory / Coombabah
              </p>
            </div>
          </Rise>
        </div>
      </div>

      {/* Figures, full width on hairlines. */}
      <div className="grid border-t border-[color:var(--hz-line)] sm:grid-cols-3">
        {PROOF.map((stat, i) => (
          <Rise
            key={stat.label}
            delay={i * 90}
            className={`hz-pad py-12 ${
              i < PROOF.length - 1 ? "sm:border-r sm:border-[color:var(--hz-line)]" : ""
            }`}
          >
            <p className="hz-dsp hz-dsp-md">
              <Tally to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="hz-mono mt-5">{stat.label}</p>
            <p className="hz-body mt-4 max-w-[34ch] text-[color:var(--hz-muted)]">{stat.body}</p>
          </Rise>
        ))}
      </div>

      <p className="hz-mono-sm hz-pad border-t border-[color:var(--hz-line)] py-5 text-[color:var(--hz-muted)]">
        {SITE.address}
      </p>
    </section>
  );
}
