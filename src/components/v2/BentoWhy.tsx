import Image from "next/image";
import { WHY, GALLERY, SITE } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The six reasons, as a bento.
 *
 * v1 stacks them as an accordion — one open at a time, everything else a
 * title. This is the opposite: all six visible at once in cells of deliberately
 * unequal size, so the grid itself does the ranking. The two the client leads
 * with get double-width cells and their body copy; the rest get a title and
 * their icon.
 *
 * A photograph occupies one cell rather than a seventh reason, which is what
 * stops a six-cell grid of text reading as a spreadsheet.
 */
export function BentoWhy() {
  const [first, second, ...rest] = WHY;

  return (
    <section id="why" className="relative bg-mist">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
              Why us
            </p>
            <h2 className="mt-6 max-w-[16ch] text-[clamp(30px,4vw,60px)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
              Six reasons people pay a bit more.
            </h2>
          </div>
          <p className="max-w-[30ch] text-[15px] leading-relaxed text-[color:var(--ink-60)]">
            {SITE.name} has been doing this on the Gold Coast since 2009.
          </p>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-4">
          {/* Two lead cells, double width, with their copy */}
          {[first, second].map((item, i) => (
            <Reveal key={item.title} delay={i * 80} className="lg:col-span-2">
              {/* justify-between, like the compact cells: the icon row pins to the
                  top and the copy to the bottom, so two cards with different
                  amounts of body text still line up along both edges. */}
              <article className="group flex h-full flex-col justify-between gap-10 rounded-[24px] border border-[color:var(--rule-dark)] bg-paper p-8 transition-colors duration-500 hover:border-navy lg:p-10">
                <div className="flex items-start justify-between gap-6">
                  <span className="flex h-10 min-w-10 items-center justify-center rounded-full bg-navy px-3 text-[12px] font-medium text-white">
                    {item.index}
                  </span>
                  {item.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={asset(item.icon)}
                      alt=""
                      aria-hidden
                      className="h-12 w-12 flex-none opacity-70 transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : null}
                </div>

                <div>
                  <h3 className="max-w-[18ch] text-[clamp(20px,2vw,28px)] font-semibold tracking-[-0.02em] text-ink">
                    {item.title}
                  </h3>

                  <p className="mt-5 max-w-[54ch] text-[14px] leading-relaxed text-[color:var(--ink-60)]">
                    {item.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}

          {/* Photograph cell */}
          <Reveal delay={160} className="lg:col-span-2 lg:row-span-2">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-[24px] bg-paper">
              <Image
                src={asset(GALLERY[3].image)}
                alt={GALLERY[3].name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.4s] hover:scale-[1.04]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,26,43,0.7),transparent_52%)]"
              />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-white/60">
                  {GALLERY[3].finish}
                </p>
                <p className="mt-3 text-[20px] font-semibold tracking-[-0.02em] text-white">
                  {GALLERY[3].name}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Four compact cells */}
          {rest.map((item, i) => (
            <Reveal key={item.title} delay={200 + i * 70}>
              <article className="group flex h-full flex-col justify-between gap-8 rounded-[24px] border border-[color:var(--rule-dark)] bg-paper p-7 transition-colors duration-500 hover:border-navy">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
                    {item.index}
                  </span>
                  {item.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={asset(item.icon)}
                      alt=""
                      aria-hidden
                      className="h-10 w-10 flex-none opacity-70 transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : null}
                </div>

                <h3 className="max-w-[14ch] text-[17px] font-semibold leading-tight tracking-[-0.02em] text-ink">
                  {item.title}
                </h3>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
