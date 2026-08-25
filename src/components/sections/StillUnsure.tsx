"use client";

import { useState } from "react";
import { SITE, HERO } from "@/content/site";
import { SmartLink } from "@/components/ui/SmartLink";
import { Arrow } from "@/components/ui/Arrow";

/**
 * The last easy step, and a way to leave an address.
 *
 * Two of Effica's closing patterns in one band: the "still unsure?" centred
 * reassurance, and the newsletter capture. Paired because they answer the two
 * states someone is in at the bottom of a long page — ready to talk, or not
 * ready yet but not wanting to lose the thread.
 *
 * The form does not submit anywhere. Same rule as the estimator: this is a
 * demo, and a field that silently swallows an address is worse than one that
 * says so. It validates and acknowledges locally, and wiring it to their list
 * is a one-line change once they say which list.
 */
export function StillUnsure() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="relative bg-mist">
      <div className="layer px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid gap-px border border-[color:var(--rule-dark)] bg-[color:var(--rule-dark)] lg:grid-cols-2">
          {/* Ready to talk */}
          <div className="flex flex-col justify-between gap-10 bg-paper p-8 lg:p-14">
            <div>
              <p className="mi text-[color:var(--ink-38)]">Still unsure?</p>
              <h2 className="dsp-sm-sentence mt-8 max-w-[16ch] text-[clamp(24px,2.8vw,42px)]">
                Talk to someone who measures them for a living.
              </h2>
              <p className="bd-sentence mt-6 max-w-[42ch] text-[color:var(--ink-60)]">
                No obligation, no deposit to get a price. We come to you, measure
                the space and quote it properly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <SmartLink href="#configurator" className="mi btn btn-solid">
                {HERO.cta}
                <Arrow />
              </SmartLink>
              <a href={SITE.phoneHref} className="mi btn">
                {SITE.phone}
              </a>
            </div>
          </div>

          {/* Not ready yet */}
          <div className="flex flex-col justify-between gap-10 bg-paper p-8 lg:p-14">
            <div>
              <p className="mi text-[color:var(--ink-38)]">Not renovating yet?</p>
              <h2 className="dsp-sm-sentence mt-8 max-w-[16ch] text-[clamp(24px,2.8vw,42px)]">
                We&rsquo;ll send the guides, not the spam.
              </h2>
              <p className="bd-sentence mt-6 max-w-[42ch] text-[color:var(--ink-60)]">
                Occasional notes on choosing glass, hardware and finishes — the
                things people wish they had known before they ordered.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setDone(true);
              }}
              className="flex flex-col gap-4"
            >
              <div className="flex border border-[color:var(--rule-dark)]">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  aria-label="Email address"
                  className="mi w-full bg-transparent px-5 py-4 outline-none placeholder:text-[color:var(--ink-38)] focus-visible:bg-mist"
                />
                <button type="submit" className="mi btn btn-solid border-y-0 border-r-0">
                  Join
                  <Arrow />
                </button>
              </div>

              <p className="mi text-[color:var(--ink-38)]" role="status">
                {done
                  ? "Noted — this is a demo, so nothing was sent."
                  : "Demo form. Not connected to a mailing list."}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
