/**
 * Image pipeline: resize, convert to WebP, and grade only where it earns its
 * keep.
 *
 * The hero alone is crushed to high-contrast black & white. It sits behind
 * type and needs a dark surround to hold its blacks, and glass only reads as
 * glass when the specular hits stand against a dark ground.
 *
 * Everything below the hero stays in full colour. On a light page the colour
 * is doing real work — it shows the brushed gold against the brushed nickel
 * against the matte black, which is exactly the decision a customer is trying
 * to make in the configurator.
 *
 * Run: node scripts/grade-images.mjs
 */
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC = "assets-raw";
const OUT = "public/img";

// [source, output name, width, mode]
const PLAN = [
  // Three hero grades so the treatment can be compared side by side:
  // /         renders hero-bw       — mono, heaviest grade
  // /colour   renders hero-colour   — darkened, saturation pushed to compensate
  // /natural  renders hero-natural  — brightness only, colour untouched
  // /split    renders hero-dim      — dark but still plainly a colour photo
  ["showerscreens/Fully-Frameless-Shower-Screen-Panel-Modern-White-Bathroom-Hero.jpg", "hero-bw", 1800, "hero"],
  ["showerscreens/Fully-Frameless-Shower-Screen-Panel-Modern-White-Bathroom-Hero.jpg", "hero-dim", 1800, "hero-dim"],
  ["showerscreens/Fully-Frameless-Shower-Screen-Panel-Modern-White-Bathroom-Hero.jpg", "hero-bright", 1800, "hero-bright"],

  // /refresh — a different room to every other build, graded for a near-black
  // ground with white display type over it.
  ["showerscreens/Shower-Screen-Frameless-Door-and-Panel-Reeded-Glass-Gold-Hinge-1.jpg", "hero-hz", 2000, "hero-hz"],
  ["showerscreens/Shower-Screen-Framed-Fixed-Panel-Reeded-Glass-Black-3.jpg", "hz-2", 1600, "hero-hz"],
  ["showerscreens/Shower-Screen-Frameless-Front-Return-Black-Hinge-1.jpg", "hz-3", 1600, "colour"],
  ["showerscreens/Bath-Shower-Screen-Framelss-Bi-Fold-Nickel-Hinges-2.jpg", "hz-4", 1600, "colour"],
  ["showerscreens/Fully-Frameless-Shower-Screen-Panel-Modern-White-Bathroom-Hero.jpg", "hero-colour", 1800, "hero-colour"],
  ["showerscreens/Fully-Frameless-Shower-Screen-Panel-Modern-White-Bathroom-Hero.jpg", "hero-natural", 1800, "hero-natural"],

  // Category panels — colour
  ["showerscreens/Shower-Screen-Frameless-Front-Return-Black-Hinge-1.jpg", "product-1", 1400, "colour"],
  ["gallery/Kitchen-Splashback-Grey-Mirror-Glass-1.jpg", "product-2", 1400, "colour"],
  ["gallery/Round-LED-900mm-Bathroom-Mirror.jpg", "product-3", 1400, "colour"],
  ["gallery/Wardrobe-Doors-Framed-White-Glass-White-Frame-1.jpg", "product-4", 1400, "colour"],

  // Gallery — colour, spread across all four lines and every hardware finish
  ["showerscreens/Shower-Screen-Frameless-Door-and-Panel-Gold-Hardware-2.jpg", "g1", 1300, "colour"],
  ["showerscreens/Shower-Screen-Semi-Frameless-Front-Return-Nickel-3.jpeg", "g2", 1300, "colour"],
  ["showerscreens/Shower-Screen-Framed-Fixed-Panel-Reeded-Glass-Black-3.jpg", "g3", 1300, "colour"],
  ["showerscreens/Shower-Screen-Frameless-Fixed-Radius-Panel-Gold-Hardware-5.jpg", "g4", 1300, "colour"],
  ["showerscreens/Bath-Shower-Screen-Framelss-Bi-Fold-Nickel-Hinges-1.jpg", "g5", 1300, "colour"],
  ["showerscreens/Shower-Screen-Frameless-Door-and-Panel-Reeded-Glass-Gold-Hinge-1.jpg", "g6", 1300, "colour"],
  ["gallery/Kitchen-Splashback-Black-Glass-Custom-Made-1.jpg", "g7", 1300, "colour"],
  ["gallery/LED-Mirror-Round.jpg", "g8", 1300, "colour"],
  ["gallery/Wardrobe-Doors-Slimline-Mirrored-Glass-Black-Frame-1-scaled.jpg", "g9", 1300, "colour"],

  ["showerscreens/Gold-Coast-Shower-Screens-Showroom-16x9-1.jpg", "showroom", 1600, "colour"],
];

const kb = (n) => `${Math.round(n / 1024)}KB`;
await mkdir(OUT, { recursive: true });

let total = 0;

for (const [src, name, width, mode] of PLAN) {
  const to = path.join(OUT, `${name}.webp`);

  let img = sharp(path.join(SRC, src))
    .rotate() // honour EXIF before resize, or portraits land sideways
    .resize({ width, withoutEnlargement: true });

  if (mode === "hero-hz") {
    // Deep and warm, but still a photograph.
    //
    // First pass ran 0.52 brightness with a hard contrast curve, and under the
    // hero's two washes on top of that the room disappeared into the ground
    // completely — a black rectangle with type on it. The grade and the washes
    // were each doing the whole job instead of half of it. 0.72 leaves enough
    // room for the washes to finish, and the saturation push keeps the brass
    // hardware alive after the levels come down.
    img = img
      .modulate({ brightness: 0.72, saturation: 1.24 })
      .linear(1.18, -10)
      .gamma(1.12);
  } else if (mode === "hero-bright") {
    // Full brightness. No wash, no dimming, no grade beyond opening the
    // highlights a touch — the source has a faint grey cast off the tiles and
    // lifting it is what makes the room read as white rather than overcast.
    // The type that sits on this is navy, so nothing here has to be darkened
    // to make anything legible.
    img = img.linear(1.1, 6).gamma(1.05).modulate({ saturation: 1.04 });
  } else if (mode === "hero-dim") {
    // Between the colour grade and the natural one.
    //
    // hero-colour was built to seat white type on its own, so it drops to 0.42
    // brightness and then adds a contrast curve on top. Under the split hero's
    // four washes that compounded into near-black — the bathroom stopped being
    // visible at all, which defeats the point of using a colour photograph.
    //
    // 0.62 with the saturation lifted keeps it clearly dark while the tiles,
    // the brass tapware and the timber vanity all still read as themselves.
    // No contrast curve: the washes supply the rest of the depth.
    img = img.modulate({ brightness: 0.62, saturation: 1.18 });
  } else if (mode === "hero-natural") {
    // The light hero. Where the other two darken the frame so white type can
    // sit on it, this one leaves the bathroom the brightness it was shot at
    // and flips the type to navy instead (see .hero-light in globals.css).
    //
    // So: no brightness cut at all. The only move is a faint lift — the
    // source has a slightly grey cast off the tiles, and opening the highlights
    // a touch is what makes it read as a white bathroom rather than a dim one.
    // Saturation is left alone; this is their photograph as taken.
    img = img.linear(1.06, 4).gamma(1.04);
  } else if (mode === "hero-colour") {
    // Same job as the mono grade — get the frame dark enough to seat white
    // type — but done without desaturating. Pulling brightness alone drags the
    // colour toward mud, so saturation is pushed back up to compensate and the
    // gamma lift keeps the midtones from closing entirely.
    img = img
      .modulate({ brightness: 0.42, saturation: 1.25 })
      .linear(1.32, -18)
      .gamma(1.22);
  } else if (mode === "hero") {
    // The source is a bright white bathroom, so contrast-stretching alone
    // makes it *lighter*: its highlights already sit at the top of the range,
    // and steepening the curve just clips more of them to white. Brightness
    // has to come down hard first.
    img = img.grayscale().modulate({ brightness: 0.34 }).linear(1.5, -30).gamma(1.35);
  } else {
    // A gentle lift only — the client's photography is already usable, and
    // heavy grading across fifteen images shot in different bathrooms under
    // different light makes them less consistent, not more.
    img = img.modulate({ saturation: 1.04 }).linear(1.04, -4);
  }

  await img.webp({ quality: 82 }).toFile(to);

  const { size } = await stat(to);
  total += size;
  console.log(`${name.padEnd(12)} ${mode.padEnd(7)} ${kb(size).padStart(7)}`);
}

console.log(`\n${PLAN.length} images, ${kb(total)} total`);
