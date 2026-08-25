import Image from "next/image";
import { INTRO, ACCREDITATIONS } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The positioning claim, set as one oversized sentence.
 *
 * v1 splits this into an offset two-column layout with the figures beneath.
 * Here the claim is the whole section: their own heading at display size with
 * the operative phrase carried in brass, the body copy small and off to one
 * side, and the accreditation marks closing it as a quiet strip.
 *
 * Bringing the marks up here rather than burying them near the footer is
 * deliberate — a claim to be "the leading specialist" is worth more with the
 * licences sitting directly under it than three screens away from it.
 */
export function StatementIntro() {
  const [lead, ...tail] = INTRO.heading.split("shower screen");

  return (
    <section id="about" className="relative bg-mist">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
          Who we are
        </p>

        <Reveal variant="rise">
          <h2 className="mt-8 max-w-[20ch] text-[clamp(30px,4.8vw,74px)] font-semibold leading-[1.0] tracking-[-0.035em] text-ink">
            {lead}
            <span className="text-brass">shower screen</span>
            {tail.join("shower screen")}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 border-t border-[color:var(--rule-dark)] pt-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <p className="max-w-[54ch] text-[15px] leading-relaxed text-[color:var(--ink-60)]">
            {INTRO.body}
          </p>
          <p className="max-w-[54ch] text-[15px] leading-relaxed text-[color:var(--ink-60)]">
            {INTRO.sub}
          </p>
        </div>

        {/* Accreditations, quiet. */}
        <div className="mt-20">
          <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
            Accredited &amp; supplied by
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-8">
            {ACCREDITATIONS.map((a) => (
              <Image
                key={a.name}
                src={asset(a.mark)}
                alt={a.name}
                title={a.name}
                width={160}
                height={160}
                className="h-10 w-auto opacity-40 grayscale transition duration-700 hover:opacity-100 hover:grayscale-0 lg:h-12"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
