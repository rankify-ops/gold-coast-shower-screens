/**
 * Fluted / "fractal" glass refraction.
 *
 * The distortion model here is a port of the fluted transform from
 * franky-adl/fractal-glass-gradients (src/shaders/fragment.glsl). That project
 * runs it in GLSL against a procedural gradient; this runs the same maths in a
 * 2D canvas against a photograph.
 *
 * THEIR TRANSFORM
 *
 *     scaledUv = mappedCoords / fluteWidth
 *     fract    = fract(scaledUv.x)                 // 0..1 across one reed
 *     flutedX  =  strength * (fract - 0.5)
 *     flutedY  = -strength * atanh(pow(fract, 6))
 *
 * WHY IT LOOKS RIGHT AND MY FIRST ATTEMPT DID NOT
 *
 * I only displaced horizontally. That gives you compression across each reed
 * and nothing else, which reads as a smear — flat, and a bit dead.
 *
 * The second line is the whole trick: a VERTICAL displacement driven by
 * `atanh(fract^6)`. Because of the sixth power that term is ~0 across almost
 * the entire reed and then climbs near-vertically as fract approaches 1, so
 * each reed gets a violent vertical stretch in the last few percent of its
 * width and is otherwise calm. That is exactly what real reeded glass does at
 * a flute boundary, and it is what the repo's devlog means by "more details at
 * the flute edges".
 *
 * atanh(1) is infinite, so the argument is clamped — in GLSL the sampler
 * swallows the overflow, but here it would produce NaN source coordinates.
 *
 * ONE MAP FOR EVERY ROW
 * Both displacements depend only on x, so the whole transform collapses to two
 * short arrays computed once and walked per scanline. That is what keeps a
 * per-pixel remap cheap enough to be practical.
 */

/**
 * Byte order of this platform, probed once. The packed fast path writes RGBA
 * as a single uint32, which only lands correctly on little-endian.
 */
const LITTLE_ENDIAN = (() => {
  const probe = new ArrayBuffer(4);
  new Uint32Array(probe)[0] = 0x000000ff;
  return new Uint8Array(probe)[0] === 0xff;
})();

export type Lens = {
  /** Fractional source x per destination column. */
  mapX: Float32Array;
  /** Fractional source y OFFSET per destination column. */
  mapY: Float32Array;
  /** Brightness multiplier per column. */
  shade: Float32Array;
};

export function buildLens(
  width: number,
  /** Reed pitch in px. */
  fluteWidth: number,
  /** Displacement magnitude in px — their uFluteStrength. */
  strength: number,
  /** Offset of this strip from the centre of the plate, in px. */
  originX: number,
  tone: "light" | "dark" = "light"
): Lens {
  const mapX = new Float32Array(width);
  const mapY = new Float32Array(width);
  const shade = new Float32Array(width);

  const liftAmt = tone === "light" ? 0.42 : 0.24;
  const darkAmt = tone === "light" ? 0.16 : 0.36;

  for (let i = 0; i < width; i++) {
    // Their mappedCoords: position relative to the centre of the plate.
    const mx = originX + i;
    const scaled = mx / fluteWidth;
    // GLSL fract() is floor-based, so it stays positive for negative inputs.
    const t = scaled - Math.floor(scaled);

    const dx = strength * (t - 0.5);

    // atanh(t^6), clamped short of the singularity at t = 1.
    const p = Math.min(Math.pow(t, 6), 0.999995);
    const dy = -strength * 0.5 * Math.log((1 + p) / (1 - p));

    mapX[i] = i + dx;
    mapY[i] = dy;

    // A gentle cylinder on top. Their shader gets its light and shade for free
    // from sampling a gradient; a photograph needs a little help to read as a
    // lens rather than as a warp.
    const lift = Math.pow(1 - t, 2.4) * liftAmt;
    const dark = Math.pow(t, 2.8) * darkAmt;
    shade[i] = 1 + lift - dark;
  }

  return { mapX, mapY, shade };
}

/**
 * Render one frame of a MOVING pane.
 *
 * The pane is a physical sheet: its reeds live in pane-local coordinates, so
 * when it slides the whole refraction pattern travels with it. That rules out
 * pre-rendering — the refraction is a resampling, not a translation, so the
 * output for a pane at x and the same pane at x+δ are not related by a shift.
 * It has to be recomputed every frame.
 *
 * WHICH MEANS IT HAS TO BE FAST. Three things do the work:
 *
 *  1. `dy` is constant down a column, so `floor(y + dy)` is hoisted out of the
 *     row loop into an integer add. A per-pixel Math.floor was most of the
 *     cost of the first version.
 *  2. Row offsets are stepped by `+w` rather than multiplied out.
 *  3. Dispersion is optional. During motion nobody resolves a 0.8px colour
 *     fringe, so it is dropped while sliding and restored at rest.
 *
 * Writes into `dst`, an ImageData exactly `paneW` wide — putImageData then
 * places it. Pixels whose source falls outside the plate are left transparent
 * so the sharp plate shows through.
 */
export function renderPane(
  src: ImageData,
  dst: ImageData,
  paneLeft: number,
  lens: Lens,
  dispersion = 0
): void {
  const { mapX, mapY, shade } = lens;
  const w = src.width;
  const h = src.height;
  const s = src.data;
  const d = dst.data;
  const paneW = dst.width;

  // Fast path — the one that runs during motion.
  //
  // Three optimisations, measured at 1920x911 with the pane at 50%:
  //
  //   naive column-major, bytewise    27.2ms   37fps
  //   + row-major                     21.0ms   48fps
  //   + 32-bit packed pixels          13.8ms   73fps
  //
  // ROW-MAJOR was the first and least obvious. Walking down a column reads
  // addresses `w * 4` bytes apart — 7.6KB here — so essentially every access
  // missed cache and the whole frame ran at memory latency. Row-major keeps
  // the working set to the handful of source rows one reed touches, which
  // sits in L2.
  //
  // PACKED PIXELS was the biggest. Reading four corners channel by channel is
  // twelve loads and four stores per output pixel; reading each corner as one
  // uint32 and unpacking with shifts is four loads and a single store.
  //
  // The uint32 view assumes little-endian byte order, which is every platform
  // a browser runs on in practice — but it is checked rather than assumed, and
  // the bytewise path below is the fallback.
  if (dispersion <= 0 && LITTLE_ENDIAN) {
    const n = Math.min(paneW, w - paneLeft);
    if (n <= 0) return;

    const s32 = new Uint32Array(src.data.buffer);
    const d32 = new Uint32Array(dst.data.buffer);

    const dyI = new Int32Array(n);
    const wyF = new Float32Array(n);
    const cA = new Int32Array(n);
    const cB = new Int32Array(n);
    const fxF = new Float32Array(n);

    for (let i = 0; i < n; i++) {
      const dy = mapY[i];
      const di = Math.floor(dy);
      dyI[i] = di;
      wyF[i] = dy - di;

      let px = paneLeft + mapX[i];
      if (px < 0) px = 0;
      else if (px > w - 1.001) px = w - 1.001;
      const xa = px | 0;
      cA[i] = xa;
      cB[i] = xa + 1 < w ? xa + 1 : xa;
      fxF[i] = px - xa;
    }

    for (let y = 0; y < h; y++) {
      let di = y * paneW;
      for (let i = 0; i < n; i++, di++) {
        let ya = y + dyI[i];
        if (ya < 0) ya = 0;
        else if (ya > h - 2) ya = h - 2;

        const rA = ya * w;
        const rB = rA + w;
        const fx = fxF[i];
        const wy = wyF[i];
        const k = shade[i];

        const p00 = s32[rA + cA[i]];
        const p01 = s32[rA + cB[i]];
        const p10 = s32[rB + cA[i]];
        const p11 = s32[rB + cB[i]];

        let t = (p00 & 255) + ((p01 & 255) - (p00 & 255)) * fx;
        let u = (p10 & 255) + ((p11 & 255) - (p10 & 255)) * fx;
        let r = (t + (u - t) * wy) * k;
        r = r < 0 ? 0 : r > 255 ? 255 : r;

        t = ((p00 >> 8) & 255) + ((((p01 >> 8) & 255) - ((p00 >> 8) & 255)) * fx);
        u = ((p10 >> 8) & 255) + ((((p11 >> 8) & 255) - ((p10 >> 8) & 255)) * fx);
        let g = (t + (u - t) * wy) * k;
        g = g < 0 ? 0 : g > 255 ? 255 : g;

        t = ((p00 >> 16) & 255) + ((((p01 >> 16) & 255) - ((p00 >> 16) & 255)) * fx);
        u = ((p10 >> 16) & 255) + ((((p11 >> 16) & 255) - ((p10 >> 16) & 255)) * fx);
        let b = (t + (u - t) * wy) * k;
        b = b < 0 ? 0 : b > 255 ? 255 : b;

        d32[di] = (255 << 24) | (b << 16) | (g << 8) | r;
      }
    }
    return;
  }

  for (let i = 0; i < paneW; i++) {
    const destX = paneLeft + i;
    if (destX < 0 || destX >= w) continue;

    const k = shade[i];
    const dy = mapY[i];
    const dyInt = Math.floor(dy);
    const wy = dy - dyInt;

    const x1 = new Int32Array(3);
    const x2 = new Int32Array(3);
    const wx = new Float32Array(3);
    for (let c = 0; c < 3; c++) {
      let px = paneLeft + mapX[i] + (c - 1) * dispersion;
      if (px < 0) px = 0;
      else if (px > w - 1.001) px = w - 1.001;
      const f = px | 0;
      x1[c] = f;
      x2[c] = f + 1 < w ? f + 1 : f;
      wx[c] = px - f;
    }

    for (let y = 0; y < h; y++) {
      const di = (y * paneW + i) * 4;
      let ya = y + dyInt;
      if (ya < 0) ya = 0;
      else if (ya > h - 2) ya = h - 2;

      const rowA = ya * w;
      const rowB = rowA + w;

      for (let c = 0; c < 3; c++) {
        const a1 = (rowA + x1[c]) * 4 + c;
        const a2 = (rowA + x2[c]) * 4 + c;
        const b1 = (rowB + x1[c]) * 4 + c;
        const b2 = (rowB + x2[c]) * 4 + c;
        const fx = wx[c];
        const top = s[a1] + (s[a2] - s[a1]) * fx;
        const bot = s[b1] + (s[b2] - s[b1]) * fx;
        const v = (top + (bot - top) * wy) * k;
        d[di + c] = v < 0 ? 0 : v > 255 ? 255 : v;
      }
      d[di + 3] = 255;
    }
  }
}

/** Draw an image object-cover into a context and return its pixels. */
export function coverToImageData(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
): ImageData {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return ctx.getImageData(0, 0, w, h);
}
