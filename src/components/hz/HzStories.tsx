import { REVIEWS, RATING } from "@/content/site";
import { Label, Rise, BarButton } from "@/components/hz/Bits";

/**
 * 05 — Client stories.
 *
 * The reference's testimonial layout, and the detail that makes it: each card
 * carries a coral rule across its top edge. On a page with no shadows and no
 * rounded corners, that one line is what separates a quote from the section
 * around it.
 *
 * Heading pinned left with the rating and a CTA under it; the quotes run as
 * two independent masonry columns on the right so cards of different lengths
 * pack without leaving gaps.
 *
 * Initials rather than photographs. These are real customers and we have no
 * pictures of them; a stock face against a real name would be a fabrication.
 */
export function HzStories() {
  if (!REVIEWS.length) return null;

  const columns = [
    REVIEWS.filter((_, i) => i % 2 === 0),
    REVIEWS.filter((_, i) => i % 2 === 1),
  ];

  return (
    <section id="reviews" className="hz-grid relative border-t border-[color:var(--hz-line)]">
      <div className="hz-pad hz-sec">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Label n="05">Testimonials</Label>

            <Rise>
              <h2 className="hz-dsp hz-dsp-lg mt-12 max-w-[9ch]">
                Client
                <br />
                <span className="hz-dim">stories.</span>
              </h2>

              <p className="hz-body mt-8 max-w-[32ch]">
                <span className="hz-dim">A few words from</span> Gold Coast homes{" "}
                <span className="hz-dim">we&rsquo;ve worked in.</span>
              </p>

              <div className="mt-10 flex items-center gap-4">
                <span className="flex -space-x-2.5">
                  {REVIEWS.slice(0, 3).map((r) => (
                    <span
                      key={r.name}
                      aria-hidden
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--hz-paper)] bg-[color:var(--hz-line)] text-[10px] font-medium"
                    >
                      {r.name.charAt(0)}
                    </span>
                  ))}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--hz-paper)] bg-[color:var(--hz-accent)] text-[10px] font-medium text-[#121212]">
                    +
                  </span>
                </span>
                <span className="hz-mono leading-tight text-[color:var(--hz-muted)]">
                  <span className="text-[color:var(--hz-ink)]">{RATING.score}</span>/5
                  <span className="mt-1 block">
                    <span className="text-[color:var(--hz-ink)]">{RATING.count}+</span> reviews on{" "}
                    {RATING.source}
                  </span>
                </span>
              </div>

              <div className="mt-10">
                <BarButton note="/Free" href="#configurator">
                  Start your project
                </BarButton>
              </div>
            </Rise>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
            {columns.map((col, c) => (
              <div key={c} className="flex flex-col gap-3 lg:gap-4">
                {col.map((review, i) => (
                  <Rise key={review.name} delay={(i * 2 + c) * 70}>
                    <figure className="border-t-2 border-[color:var(--hz-accent)] bg-white p-6 lg:p-8">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className="flex h-10 w-10 items-center justify-center bg-[color:var(--hz-line)] text-[12px] font-medium"
                          >
                            {review.name.charAt(0)}
                          </span>
                          <span className="hz-mono leading-tight">
                            {review.name}
                            <span className="hz-mono-sm mt-1 block text-[color:var(--hz-muted)]">
                              {review.source}
                            </span>
                          </span>
                        </div>

                        <span aria-hidden className="flex gap-0.5 text-[color:var(--hz-accent)]">
                          {[0, 1, 2, 3, 4].map((s) => (
                            <svg key={s} viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor">
                              <path d="M6 0l1.6 3.9L12 4.4 8.8 7.2l1 4.4L6 9.3 2.2 11.6l1-4.4L0 4.4l4.4-.5z" />
                            </svg>
                          ))}
                        </span>
                      </div>

                      <blockquote className="hz-body mt-7 text-[color:var(--hz-muted)]">
                        {review.quote}
                      </blockquote>
                    </figure>
                  </Rise>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
