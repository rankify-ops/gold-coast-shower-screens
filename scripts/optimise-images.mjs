/**
 * Turns the raw scrape in assets-raw/ into web-ready WebP in public/img.
 *
 * assets-raw/ deliberately sits OUTSIDE public/ — Next copies public/ into the
 * export verbatim, so while the originals lived there the shipped site was
 * 34MB instead of 1.2MB.
 *
 * The raw folder holds untouched originals straight off the client's
 * WordPress install — one of them is a 14.8MB camera file. Static export runs
 * with images.unoptimized, so nothing downstream will compress these for us.
 *
 * Only the files named in PLAN are processed. The scrape pulled 120 images
 * and the home page uses a dozen; converting the rest would just move dead
 * weight from one folder to another.
 *
 * Run: node scripts/optimise-images.mjs
 */
import sharp from "sharp";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC = "assets-raw";
const OUT = "public/img";

// [source file, output name, target width]
// Widths are ~2x the largest CSS box each image occupies, so they stay sharp
// on retina without paying for a full-bleed 4K asset nobody sees.
const PLAN = [
  ["showerscreens/Fully-Frameless-Shower-Screen-Panel-Modern-White-Bathroom-Hero.jpg", "hero", 1400],

  ["showerscreens/Shower-Screen-Frameless-Front-Return-Black-Hinge-1.jpg", "product-shower-screens", 1200],
  ["gallery/Kitchen-Splashback-Grey-Mirror-Glass-1.jpg", "product-splashbacks", 1200],
  ["gallery/Round-LED-900mm-Bathroom-Mirror.jpg", "product-mirrors", 1200],
  ["gallery/Wardrobe-Doors-Framed-White-Glass-White-Frame-1.jpg", "product-wardrobe-doors", 1200],

  ["showerscreens/Shower-Screen-Frameless-Door-and-Panel-Gold-Hardware-2.jpg", "gallery-1", 1000],
  ["showerscreens/Shower-Screen-Semi-Frameless-Front-Return-Nickel-3.jpeg", "gallery-2", 1000],
  ["showerscreens/Shower-Screen-Framed-Fixed-Panel-Reeded-Glass-Black-3.jpg", "gallery-3", 1000],

  ["showerscreens/Gold-Coast-Shower-Screens-Showroom-16x9-1.jpg", "showroom", 1400],
];

const kb = (n) => `${Math.round(n / 1024)}KB`;

await mkdir(OUT, { recursive: true });

let before = 0;
let after = 0;

for (const [src, name, width] of PLAN) {
  const from = path.join(SRC, src);
  const to = path.join(OUT, `${name}.webp`);

  const { size } = await stat(from);
  before += size;

  await sharp(from)
    .rotate() // honour EXIF orientation before resizing, or portraits come out sideways
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(to);

  const { size: outSize } = await stat(to);
  after += outSize;

  console.log(`${name.padEnd(26)} ${kb(size).padStart(8)} -> ${kb(outSize).padStart(7)}`);
}

console.log(`\ntotal ${kb(before)} -> ${kb(after)}  (${Math.round((1 - after / before) * 100)}% smaller)`);

// Partner marks and badges are small already; just normalise them to WebP.
for (const folder of ["partners", "badges"]) {
  const files = await readdir(path.join(SRC, folder)).catch(() => []);
  await mkdir(path.join(OUT, folder), { recursive: true });
  for (const f of files) {
    if (!/\.(jpe?g|png)$/i.test(f)) continue;
    const base = f.replace(/\.[^.]+$/, "");
    await sharp(path.join(SRC, folder, f))
      .resize({ width: 320, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(OUT, folder, `${base}.webp`));
  }
  console.log(`${folder}: ${files.length} marks`);
}
