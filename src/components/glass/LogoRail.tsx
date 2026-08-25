"use client";

import Image from "next/image";
import { ACCREDITATIONS } from "@/content/site";
import { asset } from "@/lib/basePath";

/**
 * The band between the fluted hero and the ranges: who accredits them and who
 * supplies their glass.
 *
 * Every mark here is one of theirs — Master Builders, QBCC and HIA are
 * accreditations they hold; EnduroShield, G James, National Glass, SuperKOTE
 * and Glass Outlet are the brands they buy and apply. Nothing invented.
 *
 * WHITE GROUND, AND NOT BY TASTE. All eight files are opaque 320px squares on
 * #ffffff with no alpha channel, so on any other ground they would each sit in
 * a visible white box. White is also the right move tonally: the hero is
 * #f0eeed and the ranges are #f5f5f5, so the page steps up into this band and
 * back down out of it rather than crossing one flat seam.
 *
 * The track holds TWO identical copies and travels exactly -50%, which is the
 * only offset that loops seamlessly — at -100% the whole pair leaves the frame
 * and the rail visibly jumps as it restarts.
 *
 * The marks are held at 55% saturation rather than greyscaled. Full greyscale
 * plus reduced opacity was the first attempt and it erased them: these logos
 * average 226-248 in luminance, so stripping the colour leaves pale grey on
 * white and nothing to read. Holding some colour is what keeps them legible;
 * hover restores them fully.
 */
export function LogoRail() {
  return (
    <section
      aria-label="Accreditations and suppliers"
      className="border-y border-[color:var(--navy)]/12 bg-white"
      style={{ color: "var(--navy)" }}
    >
      <div className="flex items-stretch">
        {/* The label sits in its own bordered cell, same hairline and same
            micro-type as the mega menu's cells, so the two read as one system.
            It drops out below lg, where the rail needs the full width. */}
        <div className="hidden flex-none items-center border-r border-[color:var(--navy)]/12 px-8 lg:flex lg:px-14">
          <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--sky)]">
            Accredited &amp; supplied by
          </p>
        </div>

        <div
          className="relative flex-1 overflow-hidden py-7"
          style={{
            // Feathered ends, so marks arrive and leave instead of being
            // clipped against the divider and the viewport edge.
            maskImage:
              "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
          }}
        >
          <div className="flex w-max animate-[rail-half_44s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="flex shrink-0">
                {ACCREDITATIONS.map((a) => (
                  <span
                    key={a.name}
                    className="group flex w-[172px] flex-none items-center justify-center px-6"
                  >
                    <Image
                      src={asset(a.trim)}
                      alt={a.name}
                      width={a.w}
                      height={a.h}
                      // Height comes from the data, not from a utility. Every
                      // mark is set to the same optical area, so the 4:1
                      // wordmarks and the square badges carry equal weight —
                      // see ACCREDITATIONS for the arithmetic.
                      style={{ height: a.size }}
                      className="w-auto transition-[filter,opacity] duration-500 [filter:saturate(0.55)] group-hover:opacity-100 group-hover:[filter:saturate(1)]"
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
