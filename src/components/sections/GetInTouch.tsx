import { SITE } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Effica's centred contact block: one heading, the contact methods stacked as
 * oversized links, social underneath.
 *
 * The point of the pattern is that the phone number and the email are set at
 * display size rather than as body copy — at the bottom of a long page the
 * thing you want is the number, and it should be the biggest thing on screen.
 */
export function GetInTouch() {
  return (
    <section className="relative bg-paper">
      <div className="layer px-6 py-24 text-center lg:px-12 lg:py-32">
        <Reveal variant="rise">
          <p className="mi text-[color:var(--ink-38)]">Get in touch</p>

          <h2 className="dsp-sm-sentence mx-auto mt-10 max-w-[18ch] text-[clamp(24px,3vw,44px)]">
            No call centre. You&rsquo;ll speak to the people who make them.
          </h2>

          <div className="mt-14 flex flex-col items-center gap-6">
            <a
              href={SITE.phoneHref}
              className="dsp text-[clamp(30px,5.4vw,80px)] leading-none transition-colors duration-500 hover:text-brass"
            >
              {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="mi ln text-[color:var(--ink-60)] hover:text-ink"
            >
              {SITE.email}
            </a>
          </div>

          <div className="mt-14 flex items-center justify-center gap-10">
            {[
              { label: "Facebook", href: SITE.social.facebook },
              { label: "Instagram", href: SITE.social.instagram },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mi ln text-[color:var(--ink-38)] hover:text-ink"
              >
                {s.label}
              </a>
            ))}
          </div>

          <p className="mi mt-14 text-[color:var(--ink-38)]">
            {SITE.address}
            <span className="mx-3">&middot;</span>
            Mon&ndash;Fri, 8am&ndash;4pm
          </p>
        </Reveal>
      </div>
    </section>
  );
}
