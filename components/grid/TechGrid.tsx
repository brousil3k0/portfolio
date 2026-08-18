"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { createSeededRng } from "./grid-utils";

type FadeEdge = "top" | "bottom" | "none";

interface Cell {
  key: string;
  final: string;
  weight: number;
  opacity: number;
  /** Accent hex for this cell, or undefined to keep the default gray/bone
   * text color. Assigned per-cell so accent and gray glyphs scatter
   * randomly through the shape (edges and interior alike) rather than the
   * whole block turning a single flat color. */
  color?: string;
}

interface Row {
  key: string;
  cells: Cell[];
}

interface DisplayCell {
  glyph: string;
  color?: string;
}

/** Smooth low-frequency 2D value noise from a small grid of random anchors. */
function makeNoise(rng: () => number, gridW: number, gridH: number) {
  const nodes: number[][] = Array.from({ length: gridH }, () =>
    Array.from({ length: gridW }, () => rng()),
  );
  return (u: number, v: number) => {
    const x = u * (gridW - 1);
    const y = v * (gridH - 1);
    const x0 = Math.floor(x);
    const x1 = Math.min(gridW - 1, x0 + 1);
    const y0 = Math.floor(y);
    const y1 = Math.min(gridH - 1, y0 + 1);
    const fx = x - x0;
    const fy = y - y0;
    const top = nodes[y0][x0] * (1 - fx) + nodes[y0][x1] * fx;
    const bottom = nodes[y1][x0] * (1 - fx) + nodes[y1][x1] * fx;
    return top * (1 - fy) + bottom * fy;
  };
}

/** Blocky (no interpolation) 2D value noise — hard jumps between cells
 * instead of a smooth gradient. Used for the shape mask specifically so the
 * silhouette reads as jagged/burred, not a smooth rounded blob, regardless
 * of how many grid cells sample it. */
function makeBlockyNoise(rng: () => number, gridW: number, gridH: number) {
  const nodes: number[][] = Array.from({ length: gridH }, () =>
    Array.from({ length: gridW }, () => rng()),
  );
  return (u: number, v: number) => {
    const x = Math.min(gridW - 1, Math.floor(u * gridW));
    const y = Math.min(gridH - 1, Math.floor(v * gridH));
    return nodes[y][x];
  };
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Round to a fixed precision so the value survives an HTML style-attribute
 * round trip unchanged — raw floats (e.g. 0.000418591205329076) get rounded
 * differently by the browser when serialized to markup vs recomputed on the
 * client, which trips React's hydration mismatch check. */
function stable(n: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

// Halo shape: a domain-warped 2D noise field, thresholded into a mask —
// glyphs sit behind the text at roughly uniform brightness, not a
// corner-biased heatmap. This produces a genuinely irregular, non-geometric
// silhouette (like an ink stain) instead of circles/ellipses, which always
// read as "round" no matter how many of them you union together.
const BASE_OPACITY = 0.48;
const OPACITY_JITTER = 0.1;
/** Fraction of visible cells tinted with a section's accentColor when one is
 * given; the remainder stay gray/bone so the shading isn't a flat color. */
const ACCENT_PROBABILITY = 0.55;
/** Opacity multiplier applied to accent-tinted cells on top of their normal
 * shading value, so the color reads clearly instead of blending into the
 * gray background at the same faint opacity. */
const ACCENT_OPACITY_BOOST = 3.2;
/** Floor opacity for accent-tinted cells that ARE inside the halo (never
 * applied to cells outside it, which stay at exactly 0) — without this, the
 * darkest jittered cells of an already-dark accent hue (e.g. the navy
 * blueprint) can round-trip back down near-invisible even after the boost
 * multiplier above. */
const ACCENT_MIN_OPACITY = 0.6;
const BASE_WEIGHT = 420;
const WEIGHT_JITTER = 90;
const WARP_AMOUNT = 0.22;
const SHAPE_THRESHOLD = 0.42;
const SHAPE_EDGE = 0.05;
/** Radial vignette (in the 0..1 unit square, distance 0 = dead center):
 * shape mask cells beyond BOUND_INNER start fading, fully gone by
 * BOUND_OUTER. Widening this lets the halo reach further into the corners
 * instead of concentrating as one central blob. */
const BOUND_INNER = 0.62;
const BOUND_OUTER = 1.0;

// Shape/warp noise resolution (the macro silhouette contour) is calibrated
// against the 26x24 mechanical/electrical reference grid, then grown with a
// SUB-LINEAR power curve as cols/rows increase — not left fully proportional
// (that's the original formula, and it makes denser grids like Hero/Software
// resample the same silhouette at a finer physical grain, which reads as
// smoother/rounder, not jagged) and not capped to a fixed cell budget either
// (that overcorrects: a fixed budget spread across a much denser glyph grid
// makes each noise cell span so many glyphs that dense sections render as
// big flat rectangular patches — a "map", not a burr).
//
// Jitter (fine per-glyph opacity/weight shading, not the outer silhouette)
// stays fully proportional to cols/rows — dampening it the same way starves
// dense grids of local shading variance and makes them look like a single
// flat gray, which is a different bug from the silhouette one above.
const RES_EXPONENT = 0.65;
const REF_COLS = 26;
const REF_ROWS = 24;

function powerRes(value: number, refValue: number, refResult: number) {
  const k = refResult / refValue ** RES_EXPONENT;
  return k * value ** RES_EXPONENT;
}

/** `shapeScale` coarsens the shape/warp noise fields independently of the
 * glyph grid's own density — below 1, fewer distinct noise cells span the
 * same silhouette, so the mask reads as blockier/more irregular instead of
 * resampling the same contour at a finer, smoother-looking grain. */
function noiseRes(cols: number, rows: number, shapeScale = 1) {
  return {
    shapeW: Math.max(4, Math.round(powerRes(cols, REF_COLS, REF_COLS / 3.7) * shapeScale)),
    shapeH: Math.max(4, Math.round(powerRes(rows, REF_ROWS, REF_ROWS / 4) * shapeScale)),
    warpW: Math.max(3, Math.round(powerRes(cols, REF_COLS, REF_COLS / 5.2) * shapeScale)),
    warpH: Math.max(3, Math.round(powerRes(rows, REF_ROWS, REF_ROWS / 6) * shapeScale)),
    jitterW: Math.max(6, Math.round(cols / 2.4)),
    jitterH: Math.max(6, Math.round(rows / 2.7)),
  };
}

export interface GlyphSpot {
  glyphs: string[];
  /** [u, v] center in the 0..1 unit square. */
  center: [number, number];
  /** This spot's own radius — bigger means a bigger, more dominant/
   * overlapping region; smaller means tighter and more separated from the
   * others. Falls back to DEFAULT_SPOT_SIGMA when omitted. */
  sigma?: number;
  /** Accent hex for glyphs drawn from this spot specifically — lets a
   * multi-vocabulary grid (e.g. Hero's binary/mechanical/electrical blend)
   * tint each vocabulary with its own section color instead of one flat
   * color for the whole grid. Omit to leave this spot's glyphs gray/bone. */
  accentColor?: string;
}

/** Default spot radius (in unit-square units) when a spot doesn't specify
 * its own `sigma`. */
const DEFAULT_SPOT_SIGMA = 0.3;

/** Gaussian-weighted distance-to-spot-center sampling: cells near a spot's
 * center almost always draw from that spot's pool, cells between two spots
 * draw from a soft probabilistic mix of both — this is what makes adjacent
 * spots blend into each other instead of having a hard border. Each spot's
 * own sigma controls how big/dominant its region is independently of the
 * others. */
function pickSpotGlyph(
  rng: () => number,
  u: number,
  v: number,
  spots: GlyphSpot[],
  prevGlyph: string | undefined,
): { glyph: string; spotColor?: string } {
  const weights = spots.map((s) => {
    const dx = u - s.center[0];
    const dy = v - s.center[1];
    const d2 = dx * dx + dy * dy;
    const sigma = s.sigma ?? DEFAULT_SPOT_SIGMA;
    return Math.exp(-d2 / (2 * sigma * sigma));
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  let index = spots.length - 1;
  for (let i = 0; i < spots.length; i++) {
    if (r < weights[i]) {
      index = i;
      break;
    }
    r -= weights[i];
  }
  const pool = spots[index].glyphs;
  const candidates = pool.length > 1 ? pool.filter((g) => g !== prevGlyph) : pool;
  const glyph = candidates[Math.floor(rng() * candidates.length)];
  return { glyph, spotColor: spots[index].accentColor };
}

function buildRows({
  mode,
  glyphs,
  spots,
  seed,
  rows,
  cols,
  fade,
  shadeSpread,
  shadeBands,
  accentColor,
  shapeScale = 1,
  warpAmount = WARP_AMOUNT,
  boundInner = BOUND_INNER,
  boundOuter = BOUND_OUTER,
  shapeThreshold = SHAPE_THRESHOLD,
  centerU = 0.5,
}: {
  mode: "binary" | "words";
  glyphs: string[];
  spots?: GlyphSpot[];
  seed: string;
  rows: number;
  cols: number;
  fade: FadeEdge;
  shadeSpread: number;
  shadeBands?: number;
  accentColor?: string;
  shapeScale?: number;
  warpAmount?: number;
  boundInner?: number;
  boundOuter?: number;
  shapeThreshold?: number;
  centerU?: number;
}): Row[] {
  const rng = createSeededRng(seed);
  const res = noiseRes(cols, rows, shapeScale);
  const shapeNoise = makeBlockyNoise(rng, res.shapeW, res.shapeH);
  const warpNoiseX = makeNoise(rng, res.warpW, res.warpH);
  const warpNoiseY = makeNoise(rng, res.warpW, res.warpH);
  const jitterNoise = makeNoise(rng, res.jitterW, res.jitterH);
  const flameNoise = makeNoise(rng, Math.max(6, Math.round(cols / 3)), 1);

  const out: Row[] = [];
  let prevGlyph: string | undefined;

  for (let r = 0; r < rows; r++) {
    const cells: Cell[] = [];
    const v = rows <= 1 ? 0.5 : r / (rows - 1);
    prevGlyph = undefined;

    for (let c = 0; c < cols; c++) {
      const u = cols <= 1 ? 0.5 : c / (cols - 1);
      const jitter = jitterNoise(u, v) - 0.5;

      let opacity: number;
      let weight: number;

      if (fade !== "none") {
        // Irregular, flame-like band: each column has its own height (from
        // a per-column noise field) instead of one uniform horizontal
        // fade line, so the top edge flickers/jags like flame tips.
        const vv = fade === "top" ? v : 1 - v;
        const flameHeight = 0.22 + flameNoise(u, 0) * 0.68;
        const band = smoothstep(flameHeight - 0.12, flameHeight + 0.12, vv);
        opacity = band * (0.15 + Math.max(0, jitter + 0.5) * 0.32);
        weight = BASE_WEIGHT + jitter * WEIGHT_JITTER * shadeSpread;
      } else {
        // Warp the sampling point with its own noise field before reading
        // the shape field — this is what keeps the contour from tracing a
        // smooth geometric curve.
        const wu = Math.min(1, Math.max(0, u + (warpNoiseX(u, v) - 0.5) * warpAmount));
        const wv = Math.min(1, Math.max(0, v + (warpNoiseY(u, v) - 0.5) * warpAmount));
        const shape = shapeNoise(wu, wv);
        const shapeInside = smoothstep(shapeThreshold, shapeThreshold + SHAPE_EDGE, shape);

        // Hard multiplicative mask (not just a minor bias) so cells right at
        // the literal edge of the box are always fully suppressed — without
        // this, two adjacent sections' fields can both show glyphs on their
        // shared boundary row, reading as a visible seam between them.
        const dx = (u - centerU) / 0.5;
        const dy = (v - 0.5) / 0.5;
        const rDist = Math.sqrt(dx * dx + dy * dy);
        const bound = 1 - smoothstep(boundInner, boundOuter, rDist);

        const inside = shapeInside * bound;

        if (shadeBands && shadeBands > 1) {
          // Quantize into N discrete levels instead of a continuous jitter
          // — a narrow continuous range reads as one or two shades even
          // when technically varying; discrete bands read unmistakably as
          // "N shades of gray".
          const raw = jitter + 0.5; // 0..1
          const level = Math.min(shadeBands - 1, Math.floor(raw * shadeBands));
          const t = shadeBands > 1 ? level / (shadeBands - 1) : 0;
          const opacityMin = BASE_OPACITY - OPACITY_JITTER * shadeSpread;
          const opacityMax = BASE_OPACITY + OPACITY_JITTER * shadeSpread;
          const weightMin = BASE_WEIGHT - WEIGHT_JITTER * shadeSpread;
          const weightMax = BASE_WEIGHT + WEIGHT_JITTER * shadeSpread;
          opacity = inside * Math.max(0, opacityMin + t * (opacityMax - opacityMin));
          weight = weightMin + t * (weightMax - weightMin);
        } else {
          opacity = inside * Math.max(0, BASE_OPACITY + jitter * OPACITY_JITTER * shadeSpread);
          weight = BASE_WEIGHT + jitter * WEIGHT_JITTER * shadeSpread;
        }
      }

      opacity = Math.min(1, Math.max(0, opacity));

      // Word vocabulary shouldn't repeat immediately next to itself (e.g.
      // "20g6 20g6") — binary digits are exempt, repetition there is normal.
      let glyph: string;
      let cellAccent: string | undefined;
      if (spots && spots.length > 0) {
        const picked = pickSpotGlyph(rng, u, v, spots, prevGlyph);
        glyph = picked.glyph;
        cellAccent = picked.spotColor;
      } else if (mode === "words" && glyphs.length > 1) {
        const pool = glyphs.filter((g) => g !== prevGlyph);
        glyph = pool[Math.floor(rng() * pool.length)];
        cellAccent = accentColor;
      } else {
        glyph = glyphs[Math.floor(rng() * glyphs.length)];
        cellAccent = accentColor;
      }
      prevGlyph = glyph;

      // Randomly tint a portion of the visible cells with the cell's accent
      // color (the section's own for a flat grid, or the glyph's own spot's
      // for a multi-vocabulary blend), leaving the rest on the default
      // gray/bone — keeps the grayscale shading present (edges and interior
      // alike) instead of the whole shape turning one flat color. Colored
      // cells also get an opacity boost — accent hues read much dimmer than
      // bone at the same opacity value, so without this the color was
      // barely visible.
      const color = cellAccent && rng() < ACCENT_PROBABILITY ? cellAccent : undefined;
      if (color && opacity > 0) opacity = Math.min(1, Math.max(opacity * ACCENT_OPACITY_BOOST, ACCENT_MIN_OPACITY));

      cells.push({
        key: `${r}-${c}`,
        final: glyph,
        weight: Math.round(weight),
        opacity: stable(opacity, 3),
        color,
      });
    }
    out.push({ key: `r${r}`, cells });
  }

  return out;
}

/**
 * Client-rendered technical texture: a grid of glyphs (binary digits or
 * vocabulary words) shaped into a soft, organic halo centered behind the
 * section's text — roughly uniform brightness, not a corner-biased
 * heatmap. Scrambles through random glyphs for a moment and settles once
 * the block scrolls into view.
 */
/** Ms between glyph swaps while scrambling. */
const SWAP_INTERVAL_MS = 150;
/** How long the spin runs before settling. */
const SPIN_DURATION_MS = 1500;
/** Fraction of cells re-randomized on each tick — flipping only part of the
 * grid per tick (instead of the whole thing at once) reads as a gentle
 * sparkle/settle rather than a full-screen strobe. */
const SWAP_FRACTION = 0.35;

/** Below this viewport width, the grid renders at roughly a quarter of its
 * cell count (half the rows, half the cols) — full density is both visually
 * cluttered and, at rows*cols in the thousands, a real amount of extra DOM
 * on phone-class hardware. */
const MOBILE_BREAKPOINT_PX = 640;
const MOBILE_DENSITY_SCALE = 0.5;
const MOBILE_MIN_ROWS = 8;
const MOBILE_MIN_COLS = 10;

export function TechGrid({
  mode,
  glyphs,
  spots,
  seed,
  rows = 14,
  cols = 26,
  fontSize = 20,
  align = "left",
  fade = "none",
  shadeSpread = 1,
  shadeBands,
  accentColor,
  shapeScale = 1,
  warpAmount,
  boundInner,
  boundOuter,
  shapeThreshold,
  centerU = 0.5,
  swapIntervalMs = SWAP_INTERVAL_MS,
  spinDurationMs = SPIN_DURATION_MS,
  swapFraction = SWAP_FRACTION,
  className,
}: {
  mode: "binary" | "words";
  /** Flat glyph pool. Required unless `spots` is provided. */
  glyphs?: string[];
  /** Multiple glyph pools placed at spatial centers, blended by distance —
   * use instead of `glyphs` to mix vocabularies (e.g. Hero's binary +
   * mechanical + electrical spots) rather than interleaving them uniformly. */
  spots?: GlyphSpot[];
  seed: string;
  rows?: number;
  cols?: number;
  fontSize?: number;
  align?: "left" | "right" | "center";
  fade?: FadeEdge;
  /** Multiplies the per-glyph opacity/weight jitter — higher values read as
   * more diverse shades of gray. Defaults to 1 (matches the reference
   * mechanical/electrical look); Hero/Software use a higher value. */
  shadeSpread?: number;
  /** Quantizes opacity/weight into N discrete levels instead of a
   * continuous jitter, for an unmistakably "stepped" set of shades. Omit
   * for the default continuous look. */
  shadeBands?: number;
  /** Section accent hex (e.g. blueprint/copper/terminal-green). When given,
   * a random portion of the visible cells are tinted with it while the rest
   * stay gray/bone, so the shape reads as accent-colored overall but keeps
   * grayscale shading scattered through edges and interior alike. Omit to
   * keep the plain gray/bone look (Hero, contact/footer). */
  accentColor?: string;
  /** Coarsens the halo's shape/warp noise below 1 — makes the silhouette
   * read as blockier and more irregular instead of a smooth, rounded blob.
   * Useful for dense grids (e.g. Hero) whose fine glyph resolution otherwise
   * resamples the same contour at a smoother-looking grain. Defaults to 1. */
  shapeScale?: number;
  /** Overrides how much the shape mask is domain-warped before sampling —
   * higher reads as a more distorted, less regular contour. Defaults to the
   * component's standard warp amount. */
  warpAmount?: number;
  /** Overrides how far the halo's radial vignette reaches from center before
   * fading out (0..1+ in unit-square distance) — widening lets it spread
   * further toward the corners instead of concentrating as one central
   * blob. Defaults to the component's standard inner/outer radius. */
  boundInner?: number;
  boundOuter?: number;
  /** Overrides the noise threshold that decides whether a cell is "inside"
   * the halo at all — higher means fewer, more scattered islands of visible
   * glyphs with more open space between them; lower means one denser,
   * more contiguous mass. Defaults to the component's standard threshold. */
  shapeThreshold?: number;
  /** Horizontal center (0..1) of the halo's radial vignette — shifts the
   * visible cluster toward one side of the grid (e.g. matching where a
   * section's text sits) while it still fades out naturally in every
   * direction, instead of relying on a narrower container to hard-crop it.
   * Defaults to 0.5 (true center). */
  centerU?: number;
  /** Override the default scramble pace — lower is faster/more frantic.
   * Binary sections use this to read as a clearly "live" flicker instead of
   * a barely-perceptible change (a 0/1 swap has only two possible values). */
  swapIntervalMs?: number;
  spinDurationMs?: number;
  swapFraction?: number;
  className?: string;
}) {
  const scrambleGlyphs = useMemo(
    () => (spots && spots.length > 0 ? spots.flatMap((s) => s.glyphs) : (glyphs ?? [])),
    [spots, glyphs],
  );

  // Pool of accent colors a scrambling cell can flash while it's still
  // mid-spin — every spot's own color for a multi-vocabulary blend, or just
  // the section's single accent for a flat grid.
  const scrambleColors = useMemo(() => {
    if (spots && spots.length > 0) {
      return spots.map((s) => s.accentColor).filter((c): c is string => Boolean(c));
    }
    return accentColor ? [accentColor] : [];
  }, [spots, accentColor]);

  // Server always renders at full density (viewport width is unknown during
  // SSR); once mounted, narrow viewports drop to a coarser grid. This is a
  // one-time client-side downsize, not a continuous resize-tracking layout —
  // acceptable for a decorative background.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const effectiveRows = narrow ? Math.max(MOBILE_MIN_ROWS, Math.round(rows * MOBILE_DENSITY_SCALE)) : rows;
  const effectiveCols = narrow ? Math.max(MOBILE_MIN_COLS, Math.round(cols * MOBILE_DENSITY_SCALE)) : cols;

  const gridRows = useMemo(
    () =>
      buildRows({
        mode,
        glyphs: glyphs ?? [],
        spots,
        seed,
        rows: effectiveRows,
        cols: effectiveCols,
        fade,
        shadeSpread,
        shadeBands,
        accentColor,
        shapeScale,
        warpAmount,
        boundInner,
        boundOuter,
        shapeThreshold,
        centerU,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      mode,
      seed,
      effectiveRows,
      effectiveCols,
      fade,
      shadeSpread,
      shadeBands,
      accentColor,
      shapeScale,
      warpAmount,
      boundInner,
      boundOuter,
      shapeThreshold,
      centerU,
      spots,
      glyphs,
    ],
  );

  const [display, setDisplay] = useState<DisplayCell[][]>(() =>
    gridRows.map((row) => row.cells.map((c) => ({ glyph: c.final, color: c.color }))),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplay(gridRows.map((row) => row.cells.map((c) => ({ glyph: c.final, color: c.color }))));
  }, [gridRows]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // navigator.connection is Chromium-only and always optional — absent
    // elsewhere, this simply falls through to running the animation.
    const saveData = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData ?? false;
    if (reduced || saveData) return;

    let rafId: number | undefined;
    let running = false;

    // Spins every time the section is scrolled into view (not just once
    // ever) — leaving and coming back re-triggers it. Guarded only against
    // overlapping with an already-running spin.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting || running) return;
        running = true;

        // Each cell gets its own random moment (35%-100% of the spin) to
        // lock into its final glyph, instead of every cell holding a random
        // glyph until one shared timeout snaps the whole grid to its final
        // state at once — that single global snap read as a jarring flick.
        // Staggering the settle makes the grid converge gradually with no
        // one instant where everything changes together.
        const settleAt = gridRows.map((row) => row.cells.map(() => 0.35 + Math.random() * 0.65));
        const startTime = performance.now();
        let lastTick = startTime;

        // Driven by requestAnimationFrame (throttled to swapIntervalMs)
        // rather than setInterval — an independent JS timer writing to
        // state on its own schedule can land mid-paint and race the
        // browser's compositor, which is a common source of tearing when
        // several grids animate at once (e.g. scrolling fast enough that
        // multiple sections cross the intersection threshold together).
        // rAF keeps every write aligned to the browser's own paint cycle.
        const frame = (now: number) => {
          const elapsed = Math.min(1, (now - startTime) / spinDurationMs);

          if (now - lastTick >= swapIntervalMs || elapsed >= 1) {
            lastTick = now;
            setDisplay((prev) =>
              gridRows.map((row, ri) =>
                row.cells.map((cell, ci) => {
                  if (elapsed >= settleAt[ri][ci]) return { glyph: cell.final, color: cell.color };
                  const current = prev[ri]?.[ci] ?? { glyph: cell.final, color: cell.color };
                  if (Math.random() >= swapFraction) return current;
                  // Always pick a glyph different from what's currently shown —
                  // binary mode only has two possible values, so an unfiltered
                  // random pick has a 50% chance of "swapping" to the same
                  // digit, which reads as the grid barely moving at all.
                  const candidates =
                    scrambleGlyphs.length > 1 ? scrambleGlyphs.filter((g) => g !== current.glyph) : scrambleGlyphs;
                  const glyph = candidates[Math.floor(Math.random() * candidates.length)];
                  // Re-roll the tint too while scrambling — a cell whose
                  // glyph flips several times but whose color never budges
                  // reads as "only the digits are alive", not the whole cell.
                  const color =
                    scrambleColors.length > 0 && Math.random() < ACCENT_PROBABILITY
                      ? scrambleColors[Math.floor(Math.random() * scrambleColors.length)]
                      : undefined;
                  return { glyph, color };
                }),
              ),
            );
          }

          if (elapsed < 1) {
            rafId = requestAnimationFrame(frame);
          } else {
            running = false;
            rafId = undefined;
          }
        };

        rafId = requestAnimationFrame(frame);
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafId !== undefined) window.cancelAnimationFrame(rafId);
    };
  }, [gridRows, scrambleGlyphs, swapIntervalMs, spinDurationMs, swapFraction, scrambleColors]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute select-none overflow-hidden font-mono text-bone",
        className,
      )}
    >
      <div
        className="flex h-full w-full flex-col"
        style={{
          // A fade band (the footer's flame texture) must stretch full-width
          // edge to edge, not hug one side and shrink to its content width
          // like the halo grids do.
          alignItems:
            fade !== "none"
              ? "stretch"
              : align === "right"
                ? "flex-end"
                : align === "center"
                  ? "center"
                  : "flex-start",
          // Halo (fade="none") stays centered in its box. The footer's
          // bottom-anchored band must hug the true bottom edge — centering
          // it here was leaving a gap between the glyphs and the page's
          // actual bottom edge.
          justifyContent: fade === "top" ? "flex-end" : fade === "bottom" ? "flex-start" : "center",
          gap: mode === "binary" ? "0.15em" : "0.4em",
        }}
      >
        {gridRows.map((row, ri) => (
          <div
            key={row.key}
            className="flex"
            style={{
              lineHeight: 1,
              gap: mode === "binary" ? "0.6em" : "0.7em",
              justifyContent: fade !== "none" ? "space-between" : "center",
            }}
          >
            {row.cells.map((cell, ci) => (
              <span
                key={cell.key}
                className="whitespace-nowrap"
                style={{
                  fontSize,
                  fontWeight: cell.weight,
                  opacity: cell.opacity,
                  color: display[ri]?.[ci]?.color ?? cell.color,
                  width: mode === "binary" ? `${Math.round(fontSize * 0.62)}px` : undefined,
                  textAlign: mode === "binary" ? "center" : undefined,
                  display: "inline-block",
                }}
              >
                {display[ri]?.[ci]?.glyph ?? cell.final}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
