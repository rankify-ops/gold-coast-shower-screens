import { WHY } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Effica's "what we believe" block: one centred statement, credited.
 *
 * Their version is a founder quote. This one is their own published position on
 * price, used verbatim — it is the most opinionated thing on their site and the
 * only paragraph that argues rather than describes, which is exactly what this
 * layout is for. Attributed to the company rather than to a person, because
 * nobody signed it.
 */
export function Belief() {
  const belief = WHY.find((w) => w.title === "Quality Work at Fair Prices");
  if (!belief) return null;

  return (
    <section className="relative bg-navy on-dark">
      <div className="layer px-6 py-28 lg:px-12 lg:py-40">
        <Reveal variant="rise">
          <p className="mi text-center text-[color:var(--w-32)]">What we believe</p>

          <blockquote className="dsp-sm-sentence mx-auto mt-14 max-w-[26ch] text-center text-[clamp(24px,3.4vw,50px)]">
            {belief.body}
          </blockquote>

          <p className="mi mt-14 text-center text-[color:var(--w-55)]">
            Gold Coast Shower Screens
            <span className="mx-3 text-[color:var(--w-32)]">&middot;</span>
            Est. 2009
          </p>
        </Reveal>
      </div>
    </section>
  );
}
