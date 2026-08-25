import { HzHeader } from "@/components/hz/HzHeader";
import { HzHero } from "@/components/hz/HzHero";
import { HzIntro } from "@/components/hz/HzIntro";
import { HzWork } from "@/components/hz/HzWork";
import { HzServices } from "@/components/hz/HzServices";
import { HzProcess } from "@/components/hz/HzProcess";
import { HzStories } from "@/components/hz/HzStories";
import { HzContact } from "@/components/hz/HzContact";

/*
 * /refresh — built to hanza-template.framer.website.
 *
 * Not a restyle of the other builds. The type system, the grounds, the accent
 * and the section grammar are all measured off that template and rebuilt here
 * against the client's own content:
 *
 *   display   Zalando Sans 500, UPPERCASE, line-height 0.90, -0.03em
 *   micro     Geist Mono 500, uppercase, positive tracking
 *   accent    #FF6044
 *   grounds   #FCFCFC / #121212, alternating
 *
 * The grammar it repeats, section by section:
 *   - every section opens with a coral square, a number, and one word
 *   - headings are two-tone: the words that matter in ink, the rest dimmed.
 *     There is no bold anywhere on this page — colour carries every emphasis
 *   - controls are a bar with a coral square on the end, never a pill
 *   - a vertical hairline grid runs behind everything
 *   - long sections pin their heading and scroll the content past it
 *
 * The hero uses a different room to every other build — the reeded-glass door
 * with brass hinges — graded down to 0.52 with saturation pushed, so it sits
 * INTO #121212 rather than sitting grey on top of it.
 */
export const metadata = {
  title: "Gold Coast Shower Screens — Refresh",
  // Comparison page, not a real route the client should rank for.
  robots: { index: false, follow: false },
};

export default function Refresh() {
  return (
    <div className="hz">
      <HzHeader />
      <main>
        <HzHero />
        <HzIntro />
        <HzWork />
        <HzServices />
        <HzProcess />
        <HzStories />
        <HzContact />
      </main>
    </div>
  );
}
