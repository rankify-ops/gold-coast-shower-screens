"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HERO, PRODUCTS, RATING, SITE, GALLERY } from "@/content/site";
import { asset } from "@/lib/basePath";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";
import { Stars } from "@/components/ui/Stars";
import { Counter } from "@/components/ui/Counter";

/**
 * The deck hero.
 *
 * Two devices, both doing a job the previous centred hero was not:
 *
 * 1. IMAGE CHIPS IN THE HEADLINE. Two of their photographs are set inline in
 *    the H1, sized in `em` so they scale with the type and sit on its baseline.
 *    They cycle every few seconds. It puts real work inside the sentence rather
 *    than in a slab underneath it, and it is the thing that makes the hero read
 *    as designed rather than as a template with the copy swapped.
 *
 * 2. A FANNED DECK. The four product lines are photographs dealt like cards,
 *    overlapping and rotated. Hovering one straightens it, lifts it and brings
 *    it forward; the rest tilt further away. The whole deck also leans a few
 *    degrees toward the pointer, which is what makes it feel like an object on
 *    a surface instead of four PNGs.
 *
 * Nothing decorative displaced anything functional: the rating, headline, body,
 * both calls to action, all four categories and the three proof figures are all
 * still here and all still links.
 *
 * Every effect is pointer-driven and gated on a fine pointer, so touch gets the
 * same content as a static, tidy stack. Reduced-motion stops the cycling.
 */
const DECK = HERO.categories.map((c, i) => ({
  ...c,
  image: PRODUCTS[i]?.image ?? GALLERY[i].image,
}));

// The chips cycle through these. Their photographs, no crops invented.
const CHIP_A = [GALLERY[0].image, GALLERY[3].image, GALLERY[5].image];
const CHIP_B = [GALLERY[6].image, GALLERY[7].image, GALLERY[1].image];

export function HeroDeck() {
  const sectionRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState<number | null>(null);
  const [chip, setChip] = useState(0);
  const [fine, setFine] = useState(false);

  // Pointer lean. Stored as -1..1 so the transform maths stays readable.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setFine(canHover && !reduced);
    if (!canHover || reduced) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        setTilt({
          x: ((e.clientX - r.left) / r.width - 0.5) * 2,
          y: ((e.clientY - r.top) / r.height - 0.5) * 2,
        });
      });
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Chip cycle.
  useEffect(() => {
    if (!fine) return;
    const id = setInterval(() => setChip((c) => (c + 1) % CHIP_A.length), 3200);
    return () => clearInterval(id);
  }, [fine]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative overflow-hidden bg-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-52 left-1/2 h-[620px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(166,159,136,0.26),transparent_66%)] blur-2xl"
      />

      <div className="layer px-6 pb-20 pt-32 lg:px-12 lg:pb-20 lg:pt-36">
        <div className="grid items-center gap-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          {/* ── Words ── */}
          <div>
            <SmartLink
              href="#reviews"
              className="group inline-flex items-center gap-3 rounded-full border border-[color:var(--rule-dark)] bg-white/70 py-2 pl-3 pr-5 backdrop-blur-sm transition-colors duration-300 hover:border-navy"
            >
              <Stars size={14} label={`Rated ${RATING.score} out of 5`} className="text-brass" />
              <span className="text-[13px] font-medium text-[color:var(--ink-60)]">
                <span className="text-ink">{RATING.score}</span> from{" "}
                <Counter to={RATING.count} suffix="+" /> reviews
              </span>
            </SmartLink>

            <h1 className="mt-8 max-w-[15ch] text-[clamp(40px,5.6vw,86px)] font-semibold leading-[0.98] tracking-[-0.038em] text-ink">
              Custom made
              <ImageChip srcs={CHIP_A} index={chip} alt="" />
              to measure
              <br />
              <span className="text-brass">glass</span>
              <ImageChip srcs={CHIP_B} index={chip} alt="" />
              <span className="text-brass">solutions</span>
            </h1>

            <p className="mt-8 max-w-[46ch] text-[15px] leading-relaxed text-[color:var(--ink-60)]">
              {HERO.body}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <SmartLink
                href="#configurator"
                className="flex items-center gap-2.5 rounded-full bg-navy px-7 py-4 text-[13px] font-medium text-white transition-colors duration-300 hover:bg-[color:var(--navy-lift)]"
              >
                {HERO.cta}
                <Arrow />
              </SmartLink>
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2.5 rounded-full border border-[color:var(--rule-dark)] px-7 py-4 text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-mist"
              >
                {SITE.phone}
              </a>
            </div>

            {/* Proof figures, inline on a rule rather than in a slab. */}
            <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t border-[color:var(--rule-dark)] pt-7">
              {[
                { v: 8000, s: "+", k: "Happy clients" },
                { v: 10000, s: "+", k: "Screens installed" },
                { v: 14, s: "", k: "Days, measure to install" },
              ].map((stat) => (
                <div key={stat.k}>
                  <dt className="text-[clamp(24px,2.4vw,34px)] font-semibold leading-none tracking-[-0.03em] text-ink">
                    <Counter to={stat.v} suffix={stat.s} />
                  </dt>
                  <dd className="mt-2.5 text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
                    {stat.k}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Deck ── */}
          <div
            className="relative hidden h-[560px] lg:block"
            style={{
              perspective: "1400px",
              transform: `translate3d(${tilt.x * 10}px, ${tilt.y * 8}px, 0)`,
              transition: "transform 700ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseLeave={() => setActive(null)}
          >
            {DECK.map((card, i) => {
              const isActive = active === i;
              const spread = i - (DECK.length - 1) / 2;
              // Fanned at rest; the hovered card straightens and the rest lean
              // further out of the way rather than simply sitting behind it.
              const rot = isActive ? 0 : spread * 5 + (active !== null ? spread * 2.5 : 0);
              // 132px of travel against a 250px card leaves roughly half of each
              // one exposed at rest. At 74 the fan was tight enough that three
              // of the four labels were hidden behind the card in front.
              const x = spread * 132 + (isActive ? 0 : active !== null ? spread * 22 : 0);
              const y = isActive ? -24 : Math.abs(spread) * 12;

              return (
                <SmartLink
                  key={card.label}
                  href="#products"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group absolute left-1/2 top-1/2 block h-[400px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${isActive ? 1.06 : 1})`,
                    zIndex: isActive ? 40 : 10 + i,
                    transition: "transform 700ms cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <div
                    className="relative h-full w-full overflow-hidden rounded-[24px] border border-white/60 bg-mist transition-shadow duration-500"
                    style={{
                      boxShadow: isActive
                        ? "0 40px 80px -30px rgba(0,38,62,0.55)"
                        : "0 18px 46px -26px rgba(0,38,62,0.4)",
                    }}
                  >
                    <Image
                      src={asset(card.image)}
                      alt={card.label}
                      fill
                      priority={i === 0}
                      sizes="250px"
                      className="object-cover transition-transform duration-[1.4s] group-hover:scale-[1.06]"
                    />

                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,26,43,0.86),rgba(0,26,43,0.08)_58%)]"
                    />

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <span
                        aria-hidden
                        style={{
                          maskImage: `url(${asset(card.icon)})`,
                          WebkitMaskImage: `url(${asset(card.icon)})`,
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskPosition: "center",
                          maskSize: "contain",
                          WebkitMaskSize: "contain",
                        }}
                        className="block h-8 w-8 bg-white transition-transform duration-500 group-hover:scale-110"
                      />

                      <p className="mt-4 max-w-[7ch] text-[17px] font-semibold leading-tight tracking-[-0.02em] text-white">
                        {card.label}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.06em] text-white/0 transition-colors duration-500 group-hover:text-white/70">
                        See the range
                        <Arrow />
                      </span>
                    </div>
                  </div>
                </SmartLink>
              );
            })}

            <p className="absolute inset-x-0 bottom-0 text-center text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--ink-38)]">
              Four lines, one factory
            </p>
          </div>

          {/* Touch and small screens: the same four, as a plain grid. */}
          <div className="grid grid-cols-2 gap-3 lg:hidden">
            {DECK.map((card) => (
              <SmartLink
                key={card.label}
                href="#products"
                className="group relative block aspect-[3/4] overflow-hidden rounded-[20px] bg-mist"
              >
                <Image
                  src={asset(card.image)}
                  alt={card.label}
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,26,43,0.84),transparent_58%)]"
                />
                <p className="absolute inset-x-0 bottom-0 p-4 text-[14px] font-semibold tracking-[-0.01em] text-white">
                  {card.label}
                </p>
              </SmartLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A photograph set inline in the headline.
 *
 * Sized in `em` so it scales with the clamped type instead of needing a
 * breakpoint of its own, and given `align-middle` so it rides the text
 * baseline rather than pushing the line box around. Crossfades between images
 * by stacking them and animating opacity — no layout involvement at all.
 */
function ImageChip({ srcs, index, alt }: { srcs: string[]; index: number; alt: string }) {
  return (
    <span className="relative mx-[0.18em] inline-block h-[0.72em] w-[1.34em] translate-y-[0.02em] overflow-hidden rounded-full border border-[color:var(--rule-dark)] align-middle">
      {srcs.map((src, i) => (
        <Image
          key={src}
          src={asset(src)}
          alt={i === 0 ? alt : ""}
          fill
          sizes="140px"
          className="object-cover transition-opacity duration-700"
          style={{ opacity: i === index % srcs.length ? 1 : 0 }}
        />
      ))}
    </span>
  );
}
