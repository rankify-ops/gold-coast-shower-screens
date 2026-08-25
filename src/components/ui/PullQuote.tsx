import { Stars } from "@/components/ui/Stars";
import { REVIEWS } from "@/content/site";

/**
 * A single review, lifted out and dropped between two sections.
 *
 * Scattered rather than pooled: one voice arriving mid-scroll, straight after
 * the claim it happens to back up, lands harder than the same words filed in a
 * testimonials block that most people scroll past. Each instance takes a
 * different review by index so no quote appears twice on the page.
 *
 * Renders nothing when REVIEWS is empty — which it is until their real Google
 * reviews are pasted in. That is deliberate: a placeholder testimonial on a
 * real trade business reads as a real customer saying something they never
 * said, so the section simply does not exist until the words are theirs.
 */
export function PullQuote({ index = 0, tone = "light" }: { index?: number; tone?: "light" | "navy" }) {
  const review = REVIEWS[index % REVIEWS.length];
  if (!review) return null;

  const dark = tone === "navy";

  return (
    <section className={`relative ${dark ? "bg-navy on-dark" : "bg-mist"}`}>
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <figure className="mx-auto max-w-[54ch]">
          <Stars size={18} label="Rated 5 out of 5" className="text-brass" />

          <blockquote className="dsp-sm-sentence mt-8 text-[clamp(20px,2.8vw,40px)]">
            &ldquo;{review.quote}&rdquo;
          </blockquote>

          <figcaption
            className={`mi mt-8 ${dark ? "text-[color:var(--w-55)]" : "text-[color:var(--ink-38)]"}`}
          >
            {review.name}
            {review.source ? <span className="mx-3">&middot; {review.source}</span> : null}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
