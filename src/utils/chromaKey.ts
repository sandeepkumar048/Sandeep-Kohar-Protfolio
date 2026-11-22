export interface ChromaKeyOptions {
  /** Euclidean RGB distance within which border-connected pixels are treated as pure background */
  tolerance?: number;
  /** Maximum chromaticity (brightness-independent hue/tint) distance for BFS background pixels */
  chromaTolerance?: number;
  /** Additional distance band for smooth alpha feathering on boundary pixels */
  feather?: number;
  /** Pixel width of the foreground edge band inspected for color decontamination and matting */
  edgeRadius?: number;
}

/**
 * Removes a uniform solid background connected to any of the four image borders
 * using a chroma-guarded breadth-first flood fill, then performs local foreground
 * estimation, linear alpha matting, color decontamination (spill removal), and
 * gentle edge anti-aliasing for a clean studio cutout without dark halos or gaps.
 */
export function removeUniformBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  options: ChromaKeyOptions = {}
): Uint8ClampedArray {
  const tolerance = options.tolerance ?? 28;
  const chromaTolerance = options.chromaTolerance ?? 14;
  const feather = options.feather ?? 26;
  const edgeRadius = options.edgeRadius ?? 4;
  const totalPixels = width * height;
  if (totalPixels === 0 || data.length < totalPixels * 4) {
    return data;
  }

  // Sample background color from top-left and top-right corners
  const tlIdx = 0;
  const trIdx = (width - 1) * 4;
  const bgR = Math.round((data[tlIdx] + data[trIdx]) / 2);
  const bgG = Math.round((data[tlIdx + 1] + data[trIdx + 1]) / 2);
  const bgB = Math.round((data[tlIdx + 2] + data[trIdx + 2]) / 2);
  const bgMean = (bgR + bgG + bgB) / 3;
  const bgCr = bgR - bgMean;
  const bgCg = bgG - bgMean;
  const bgCb = bgB - bgMean;

  const colorDistance = (pixelIndex: number): number => {
    const i = pixelIndex * 4;
    const dr = data[i] - bgR;
    const dg = data[i + 1] - bgG;
    const db = data[i + 2] - bgB;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  const chromaDistance = (pixelIndex: number): number => {
    const i = pixelIndex * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const mean = (r + g + b) / 3;
    const dcr = r - mean - bgCr;
    const dcg = g - mean - bgCg;
    const dcb = b - mean - bgCb;
    return Math.sqrt(dcr * dcr + dcg * dcg + dcb * dcb);
  };

  const visited = new Uint8Array(totalPixels);
  const isBackground = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let head = 0;
  let tail = 0;

  const enqueueIfBg = (idx: number) => {
    if (visited[idx]) return;
    visited[idx] = 1;
    if (colorDistance(idx) <= tolerance && chromaDistance(idx) <= chromaTolerance) {
      isBackground[idx] = 1;
      queue[tail++] = idx;
    }
  };

  // Seed flood-fill from ALL FOUR borders (top, bottom, left, right)
  // so background gaps touching the bottom edge (e.g. between arms and torso) are cleared too.
  for (let x = 0; x < width; x++) {
    enqueueIfBg(x);
    enqueueIfBg((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    enqueueIfBg(y * width);
    enqueueIfBg(y * width + (width - 1));
  }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % width;
    const y = (idx - x) / width;

    if (x > 0) enqueueIfBg(idx - 1);
    if (x < width - 1) enqueueIfBg(idx + 1);
    if (y > 0) enqueueIfBg(idx - width);
    if (y < height - 1) enqueueIfBg(idx + width);
  }

  const out = new Uint8ClampedArray(data);

  // Zero alpha for confirmed background pixels
  for (let i = 0; i < totalPixels; i++) {
    if (isBackground[i]) {
      out[i * 4 + 3] = 0;
    }
  }

  // Compute morphological distance (0..edgeRadius) from background into foreground
  const bgDist = new Uint8Array(totalPixels);
  bgDist.fill(255);
  head = 0;
  tail = 0;

  for (let i = 0; i < totalPixels; i++) {
    if (isBackground[i]) {
      bgDist[i] = 0;
      queue[tail++] = i;
    }
  }

  while (head < tail) {
    const idx = queue[head++];
    const d = bgDist[idx];
    if (d >= edgeRadius) continue;

    const x = idx % width;
    const y = (idx - x) / width;
    const nextD = d + 1;

    if (x > 0 && bgDist[idx - 1] > nextD) {
      bgDist[idx - 1] = nextD;
      queue[tail++] = idx - 1;
    }
    if (x < width - 1 && bgDist[idx + 1] > nextD) {
      bgDist[idx + 1] = nextD;
      queue[tail++] = idx + 1;
    }
    if (y > 0 && bgDist[idx - width] > nextD) {
      bgDist[idx - width] = nextD;
      queue[tail++] = idx - width;
    }
    if (y < height - 1 && bgDist[idx + width] > nextD) {
      bgDist[idx + width] = nextD;
      queue[tail++] = idx + width;
    }
  }

  // Helper to estimate clean local foreground color near (x, y)
  const sampleRadius = Math.max(3, edgeRadius + 1);
  const estimateLocalForeground = (
    cx: number,
    cy: number,
    minDist: number
  ): [number, number, number] | null => {
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    let count = 0;

    const x0 = Math.max(0, cx - sampleRadius);
    const x1 = Math.min(width - 1, cx + sampleRadius);
    const y0 = Math.max(0, cy - sampleRadius);
    const y1 = Math.min(height - 1, cy + sampleRadius);

    for (let ny = y0; ny <= y1; ny++) {
      const row = ny * width;
      for (let nx = x0; nx <= x1; nx++) {
        const nIdx = row + nx;
        if (bgDist[nIdx] >= minDist) {
          const off = nIdx * 4;
          sumR += data[off];
          sumG += data[off + 1];
          sumB += data[off + 2];
          count++;
        }
      }
    }

    if (count === 0) return null;
    return [sumR / count, sumG / count, sumB / count];
  };

  // Edge matting + color decontamination on foreground boundary band (1 <= bgDist <= edgeRadius)
  const useFullMatting = width >= 16 && height >= 16 && edgeRadius > 0;
  if (useFullMatting) {
    for (let y = 0; y < height; y++) {
      const row = y * width;
      for (let x = 0; x < width; x++) {
        const idx = row + x;
        const d = bgDist[idx];
        if (d === 0 || d > edgeRadius) continue;

        const off = idx * 4;
        const cr = data[off];
        const cg = data[off + 1];
        const cb = data[off + 2];

        const minCleanDist = Math.min(edgeRadius + 1, Math.max(d + 1, edgeRadius));
        const fg =
          estimateLocalForeground(x, y, minCleanDist) ??
          estimateLocalForeground(x, y, Math.min(2, d + 1));

        if (!fg) {
          const dist = colorDistance(idx);
          if (feather > 0 && dist < tolerance + feather) {
            const ratio = Math.max(0, Math.min(1, (dist - tolerance) / feather));
            out[off + 3] = Math.round(out[off + 3] * ratio);
          }
          continue;
        }

        const [fr, fgG, fb] = fg;
        const dr = fr - bgR;
        const dg = fgG - bgG;
        const db = fb - bgB;
        const lenSq = dr * dr + dg * dg + db * db;

        if (lenSq > 144) {
          // Project observed pixel C onto segment B -> F
          const rawT = ((cr - bgR) * dr + (cg - bgG) * dg + (cb - bgB) * db) / lenSq;
          const clampedT = Math.max(0, Math.min(1, rawT));

          // Perpendicular distance from the B -> F blend segment
          const pr = bgR + clampedT * dr - cr;
          const pg = bgG + clampedT * dg - cg;
          const pb = bgB + clampedT * db - cb;
          const perpDist = Math.sqrt(pr * pr + pg * pg + pb * pb);

          if (perpDist < 62 && rawT < 0.96) {
            // Choke outermost ring slightly more to remove JPEG dark fringe cleanly
            const choke = d === 1 ? 0.18 : d === 2 ? 0.08 : 0.02;
            const alphaNorm = Math.max(0, Math.min(1, (rawT - choke) / (1 - choke - 0.06)));
            out[off + 3] = Math.round(alphaNorm * 255);

            // Decontaminate RGB by pulling blended edge pixels toward clean local foreground F
            const spillWeight = Math.min(1, (1 - alphaNorm) * 0.95 + (d <= 2 ? 0.45 : 0.15));
            out[off] = Math.round(cr + (fr - cr) * spillWeight);
            out[off + 1] = Math.round(cg + (fgG - cg) * spillWeight);
            out[off + 2] = Math.round(cb + (fb - cb) * spillWeight);
          } else if (d === 1 && colorDistance(idx) < tolerance + feather) {
            const ratio = Math.max(0, Math.min(1, (colorDistance(idx) - tolerance) / Math.max(1, feather)));
            out[off + 3] = Math.round(ratio * 255);
            out[off] = Math.round(fr);
            out[off + 1] = Math.round(fgG);
            out[off + 2] = Math.round(fb);
          }
        }
      }
    }

    // Gentle 3x3 Gaussian alpha smoothing strictly on the silhouette band (bgDist <= 2)
    const alphaSnapshot = new Uint8Array(totalPixels);
    for (let i = 0; i < totalPixels; i++) {
      alphaSnapshot[i] = out[i * 4 + 3];
    }

    for (let y = 1; y < height - 1; y++) {
      const row = y * width;
      for (let x = 1; x < width - 1; x++) {
        const idx = row + x;
        const d = bgDist[idx];
        if (d > 2) continue;

        const off = idx * 4;

        // Confirmed background pixels stay strictly alpha = 0; only clean their RGB if
        // they border the foreground so CSS bilinear scaling never bleeds dark backdrop color.
        if (d === 0) {
          const touchesFg =
            bgDist[idx - 1] > 0 ||
            bgDist[idx + 1] > 0 ||
            bgDist[idx - width] > 0 ||
            bgDist[idx + width] > 0;
          if (touchesFg) {
            const fg = estimateLocalForeground(x, y, 2);
            if (fg) {
              out[off] = Math.round(fg[0]);
              out[off + 1] = Math.round(fg[1]);
              out[off + 2] = Math.round(fg[2]);
            }
          }
          continue;
        }

        const sum =
          alphaSnapshot[idx - width - 1] +
          alphaSnapshot[idx - width] * 2 +
          alphaSnapshot[idx - width + 1] +
          alphaSnapshot[idx - 1] * 2 +
          alphaSnapshot[idx] * 4 +
          alphaSnapshot[idx + 1] * 2 +
          alphaSnapshot[idx + width - 1] +
          alphaSnapshot[idx + width] * 2 +
          alphaSnapshot[idx + width + 1];

        let smoothed = Math.round(sum / 16);
        if (smoothed < 14) smoothed = 0;
        else if (smoothed > 246) smoothed = 255;

        out[off + 3] = smoothed;
      }
    }
  } else if (feather > 0) {
    // Simple 1px feather fallback for very small synthetic canvases
    const maxDist = tolerance + feather;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (isBackground[idx]) continue;

        const touchesBg =
          isBackground[idx - 1] ||
          isBackground[idx + 1] ||
          isBackground[idx - width] ||
          isBackground[idx + width];

        if (touchesBg) {
          const dist = colorDistance(idx);
          if (dist < maxDist) {
            const ratio = Math.max(0, Math.min(1, (dist - tolerance) / feather));
            out[idx * 4 + 3] = Math.round(out[idx * 4 + 3] * ratio);
          }
        }
      }
    }
  }

  return out;
}
