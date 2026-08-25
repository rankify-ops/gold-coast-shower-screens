import Image from "next/image";
import { FOOTER_LINKS, SITE, HERO } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";

/**
 * The light footer.
 *
 * v1 closes on a navy slab. Ending a light page on a dark one undoes the whole
 * temperature of the design in the last screen, so this stays on paper and
 * uses a single rounded navy CTA card as the one dark object — a full stop
 * rather than a change of subject.
 *
 * The phone number is set at display size because at the bottom of a long page
 * the number is the thing being looked for, and it should be the largest thing
 * on screen.
 */
export function FooterLight() {
  return (
    <footer id="contact" className="relative bg-paper">
      <div className="layer px-6 pb-12 pt-24 lg:px-12 lg:pt-32">
        {/* The one dark object on the page. */}
        <div className="relative overflow-hidden rounded-[28px] bg-navy px-8 py-14 lg:rounded-[36px] lg:px-16 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(166,159,136,0.28),transparent_66%)] blur-2xl"
          />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_auto] lg:items-end">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-white/45">
                Free measure &amp; quote
              </p>
              <h2 className="mt-6 max-w-[16ch] text-[clamp(30px,4.4vw,66px)] font-semibold leading-[1.0] tracking-[-0.035em] text-white">
                Let&rsquo;s measure your bathroom.
              </h2>
              <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-white/60">
                No obligation, no deposit for a price. We come to you, template
                the space and quote it properly.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <SmartLink
                href="#configurator"
                className="flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-brass"
              >
                {HERO.cta}
                <Arrow />
              </SmartLink>
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-4 text-[13px] font-medium text-white transition-colors duration-300 hover:bg-white/10"
              >
                {SITE.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Directory */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1.2fr_repeat(2,minmax(0,0.9fr))]">
          <div>
            <Image
              src={asset("/img/logos/Gold-Coast-Screens-Logo-1.svg")}
              alt={SITE.name}
              width={200}
              height={39}
              className="h-8 w-auto"
            />

            <a
              href={SITE.phoneHref}
              className="mt-8 block text-[clamp(26px,3.4vw,46px)] font-semibold tracking-[-0.03em] text-ink transition-colors duration-300 hover:text-brass"
            >
              {SITE.phone}
            </a>

            <a
              href={`mailto:${SITE.email}`}
              className="mt-3 block text-[14px] text-[color:var(--ink-60)] transition-colors duration-300 hover:text-ink"
            >
              {SITE.email}
            </a>

            <p className="mt-8 max-w-[30ch] text-[13px] leading-relaxed text-[color:var(--ink-38)]">
              {SITE.address}
              <br />
              Mon&ndash;Fri, 8am&ndash;4pm
            </p>
          </div>

          {FOOTER_LINKS.map((col) => (
            <nav key={col.title}>
              <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
                {col.title}
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {col.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#top"
                      className="text-[13px] font-medium text-[color:var(--ink-60)] transition-colors duration-300 hover:text-ink"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-5 border-t border-[color:var(--rule-dark)] pt-8">
          <p className="text-[12px] text-[color:var(--ink-38)]">
            &copy; {new Date().getFullYear()} {SITE.name}
            <span className="mx-3">&middot;</span>
            {SITE.licence}
          </p>

          <div className="flex items-center gap-6">
            {[
              { label: "Facebook", href: SITE.social.facebook },
              { label: "Instagram", href: SITE.social.instagram },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] font-medium text-[color:var(--ink-38)] transition-colors duration-300 hover:text-ink"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
