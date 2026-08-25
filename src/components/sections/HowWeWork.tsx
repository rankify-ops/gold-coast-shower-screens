import Image from "next/image";
import { INTRO } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Effica's "how we help you" block: a narrow text column against a large piece
 * of media, with the copy capped around 600px so it stays one readable measure
 * however wide the screen gets.
 *
 * Their version anchors a video. Ours anchors the factory, because the claim
 * being made in the text — made here, by us, not subcontracted — is one the
 * building evidences.
 */
export function HowWeWork() {
  return (
    <section className="relative bg-paper">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal variant="rise">
            <p className="mi text-[color:var(--ink-38)]">How we work</p>

            <h2 className="dsp-sm mt-8 max-w-[15ch] text-[clamp(28px,3.4vw,52px)]">
              Made here, fitted by us.
            </h2>

            <p className="bd-sentence mt-10 max-w-[600px] text-[color:var(--ink-60)]">
              {INTRO.body}
            </p>

            <p className="bd-sentence mt-6 max-w-[600px] text-[color:var(--ink-60)]">
              {INTRO.sub}
            </p>

            <SmartLink href="#process" className="mi btn mt-12">
              See the process
              <Arrow />
            </SmartLink>
          </Reveal>

          <Reveal variant="rise" delay={120}>
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-mist">
              <Image
                src={asset("/img/site/factory.webp")}
                alt="The Gold Coast Shower Screens factory at Coombabah"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
