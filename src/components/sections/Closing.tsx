import { SEO_BLOCK } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Their closing copy, verbatim.
 *
 * This is search-oriented text on their site — the block that repeats "shower
 * screens Gold Coast" for the crawler. It still has to sit on the page without
 * looking like filler, so it is set quiet and small in two columns just above
 * the footer: present and readable for anyone who gets that far, and clearly
 * subordinate to everything above it. Deliberately no heading hierarchy jump,
 * no image, no call to action competing with the footer directly below.
 */
export function Closing() {
  return (
    <section className="relative bg-mist">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid gap-x-16 gap-y-12 border-t border-[color:var(--rule-dark)] pt-14 md:grid-cols-2">
          {SEO_BLOCK.map((block, i) => (
            <Reveal key={block.title} delay={i * 90}>
              <h2 className="dsp-sm-sentence max-w-[26ch] text-[clamp(17px,1.7vw,23px)]">
                {block.title}
              </h2>
              <p className="bd-sentence mt-5 max-w-[58ch] text-[color:var(--ink-60)]">
                {block.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
