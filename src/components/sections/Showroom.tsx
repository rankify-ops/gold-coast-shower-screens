import Image from "next/image";
import { SHOWROOM, SITE } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Visit our showroom — their invitation, verbatim.
 *
 * Given a full-bleed image with the detail plate overlapping it, because this
 * is the one section on the page asking for a trip across town rather than a
 * click. The address, hours and licence sit together on that plate so the
 * practical information needed to actually turn up is in one block rather than
 * scattered into the footer.
 */
export function Showroom() {
  return (
    <section id="showroom" className="relative bg-mist">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <Reveal variant="rise">
            <p className="mi text-[color:var(--ink-38)]">(07) &mdash; {SHOWROOM.eyebrow}</p>

            <h2 className="dsp-sm mt-8 max-w-[12ch] text-[clamp(32px,4.6vw,72px)]">
              {SHOWROOM.title}
            </h2>

            <p className="bd-sentence mt-8 max-w-[52ch] text-[color:var(--ink-60)]">
              {SHOWROOM.body}
            </p>

            <dl className="mt-12 grid gap-px border border-[color:var(--rule-dark)] bg-[color:var(--rule-dark)] sm:grid-cols-2">
              {[
                { label: "Showroom", value: SITE.address },
                { label: "Trading hours", value: "Mon–Fri, 8am–4pm" },
                { label: "Phone", value: SITE.phone },
                { label: "Licence", value: SITE.licence },
              ].map((row) => (
                <div key={row.label} className="bg-mist px-5 py-5">
                  <dt className="mi text-[color:var(--ink-38)]">{row.label}</dt>
                  <dd className="mi mt-2 text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>

            <a
              href={SITE.phoneHref}
              className="mi btn btn-solid mt-12"
            >
              Book a visit
              <Arrow />
            </a>
          </Reveal>

          <Reveal variant="rise" delay={120}>
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-paper">
              <Image
                src={asset("/img/site/showroom.webp")}
                alt="The Gold Coast Shower Screens showroom at Coombabah"
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
