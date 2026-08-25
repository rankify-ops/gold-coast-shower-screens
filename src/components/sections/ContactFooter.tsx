import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SpecList } from "@/components/ui/Spec";
import { SITE, FOOTER_LINKS } from "@/content/site";
import { asset } from "@/lib/basePath";

/**
 * Final slab — navy, so the page closes on their brand colour rather than
 * fading out on another light band. The phone number is the largest thing in
 * the section on purpose: it is the actual conversion.
 */
export function ContactFooter() {
  return (
    <footer id="contact" className="relative bg-navy on-dark">

      <div className="layer px-6 pt-24 lg:px-12 lg:pt-32">
        <p className="mi text-black/45">(09) &mdash; Get in touch</p>

        <div className="mt-12 grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
          <div>
            <Reveal variant="mask">
              <h2 className="dsp text-[clamp(34px,6.4vw,104px)]">Free measure.</h2>
            </Reveal>
            <Reveal variant="mask" delay={90}>
              <h2 className="dsp text-[clamp(34px,6.4vw,104px)]">Free quote.</h2>
            </Reveal>
            <Reveal variant="mask" delay={180}>
              <h2 className="dsp text-[clamp(34px,6.4vw,104px)] text-black/40">No obligation.</h2>
            </Reveal>

            <a
              href={SITE.phoneHref}
              className="dsp mt-14 block text-[clamp(30px,5vw,76px)] transition-opacity duration-500 hover:opacity-60"
            >
              {SITE.phone}
            </a>

            <a href={`mailto:${SITE.email}`} className="mi ln mt-8 inline-block">
              {SITE.email}
            </a>
          </div>

          <div>
            <SpecList specs={[
                { label: "Factory", value: SITE.address },
                { label: "Servicing", value: "Gold Coast & Brisbane" },
                { label: "Hours", value: "Mon–Fri, 8am–4pm" },
                { label: "Licence", value: SITE.licence },
              ]}
            />

            {/* Their own two footer columns, labelled as they label them.
                These replaced a repeat of the header nav — the same five links
                twice on one page told nobody anything new, and their product
                list is the half a visitor at the bottom of the page actually
                wants. */}
            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              {FOOTER_LINKS.map((col) => (
                <nav key={col.title}>
                  <p className="mi text-black/40">{col.title}</p>
                  <ul className="mt-5 flex flex-col gap-3">
                    {col.items.map((item) => (
                      <li key={item}>
                        <a
                          href="#top"
                          className="mi ln self-start text-black/60 hover:text-black"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>

            <div className="mt-10 flex gap-8">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="mi ln self-start text-black/60 hover:text-black"
              >
                Facebook
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mi ln self-start text-black/60 hover:text-black"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mi mt-24 flex flex-wrap items-center justify-between gap-6 border-t border-black/20 py-8 text-black/50">
          <Image
            src={asset("/img/logos/Gold-Coast-Screens-Logo-1.svg")}
            alt={SITE.name}
            width={180}
            height={35}
            className="h-7 w-auto opacity-70"
          />
          <span>
            &copy; {new Date().getFullYear()} {SITE.name}
          </span>
          <span>Made on the Gold Coast</span>
        </div>
      </div>
    </footer>
  );
}
