import Image from "next/image";
import { SHOWROOM, SITE } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The showroom, as a full-bleed plate with the card sitting on it.
 *
 * v1 puts the copy and the photograph side by side in equal columns. Here the
 * photograph takes the whole band and the invitation floats over it as a
 * frosted card, which is the arrangement that makes a place feel like a
 * destination rather than an item in a list.
 *
 * The card is frosted rather than solid so the room stays visible through it —
 * on a section whose entire argument is "come and see it", covering the thing
 * you are being asked to come and see would be the wrong call.
 */
export function ShowroomBand() {
  return (
    <section id="showroom" className="relative bg-mist">
      <div className="layer px-3 py-24 lg:px-6 lg:py-32">
        <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[28px] lg:rounded-[40px]">
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[16/8]">
            <Image
              src={asset("/img/site/showroom.webp")}
              alt="The Gold Coast Shower Screens showroom at Coombabah"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-navy/25" />
          </div>

          <div className="absolute inset-0 flex items-end p-4 sm:p-8 lg:p-12">
            <Reveal variant="rise" className="w-full sm:max-w-[520px]">
              <div className="rounded-[22px] border border-white/25 bg-white/80 p-7 shadow-[0_24px_70px_-30px_rgba(0,38,62,0.6)] backdrop-blur-2xl lg:p-9">
                <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
                  {SHOWROOM.eyebrow}
                </p>

                <h2 className="mt-5 max-w-[12ch] text-[clamp(26px,3.2vw,44px)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
                  {SHOWROOM.title}
                </h2>

                <p className="mt-5 max-w-[46ch] text-[14px] leading-relaxed text-[color:var(--ink-60)]">
                  {SHOWROOM.body}
                </p>

                <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                  {[
                    { k: "Showroom", v: SITE.address },
                    { k: "Trading hours", v: "Mon–Fri, 8am–4pm" },
                  ].map((row) => (
                    <div key={row.k}>
                      <dt className="text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
                        {row.k}
                      </dt>
                      <dd className="mt-2 text-[13px] font-medium text-ink">{row.v}</dd>
                    </div>
                  ))}
                </dl>

                <a
                  href={SITE.phoneHref}
                  className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-navy px-6 py-3.5 text-[13px] font-medium text-white transition-colors duration-300 hover:bg-[color:var(--navy-lift)]"
                >
                  Book a visit
                  <Arrow />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
