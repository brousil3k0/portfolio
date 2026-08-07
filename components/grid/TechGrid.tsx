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
}

interface Row {
  key: string;
  cells: Cell[];
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
const BASE_OPACITY = 0.34;
const OPACITY_JITTER = 0.08;
const BASE_WEIGHT = 420;
const WEIGHT_JITTER = 90;
const WARP_AMOUNT = 0.22;
const SHAPE_THRESHOLD = 0.42;
const SHAPE_EDGE = 0.05;

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

function noiseRes(cols: number, rows: number) {
  return {
    shapeW: Math.max(4, Math.round(powerRes(cols, REF_COLS, REF_COLS / 3.7))),
    shapeH: Math.max(4, Math.round(powerRes(rows, REF_ROWS, REF_ROWS / 4))),
    warpW: Math.max(3, Math.round(powerRes(cols, REF_COLS, REF_COLS / 5.2))),
    warpH: Math.max(3, Math.round(powerRes(rows, REF_ROWS, REF_ROWS / 6))),
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
): string {
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
  return candidates[Math.floor(rng() * candidates.length)];
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
}): Row[] {
  const rng = createSeededRng(seed);
  const res = noiseRes(cols, rows);
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
        const wu = Math.min(1, Math.max(0, u + (warpNoiseX(u, v) - 0.5) * WARP_AMOUNT));
        const wv = Math.min(1, Math.max(0, v + (warpNoiseY(u, v) - 0.5) * WARP_AMOUNT));
        const shape = shapeNoise(wu, wv);
        const shapeInside = smoothstep(SHAPE_THRESHOLD, SHAPE_THRESHOLD + SHAPE_EDGE, shape);

        // Hard multiplicative mask (not just a minor bias) so cells right at
        // the literal edge of the box are always fully suppressed — without
        // this, two adjacent sections' fields can both show glyphs on their
        // shared boundary row, reading as a visible seam between them.
        const dx = (u - 0.5) / 0.5;
        const dy = (v - 0.5) / 0.5;
        const rDist = Math.sqrt(dx * dx + dy * dy);
        const bound = 1 - smoothstep(0.62, 1.0, rDist);

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
      if (spots && spots.length > 0) {
        glyph = pickSpotGlyph(rng, u, v, spots, prevGlyph);
      } else if (mode === "words" && glyphs.length > 1) {
        const pool = glyphs.filter((g) => g !== prevGlyph);
        glyph = pool[Math.floor(rng() * pool.length)];
      } else {
        glyph = glyphs[Math.floor(rng() * glyphs.length)];
      }
      prevGlyph = glyph;

      cells.push({
        key: `${r}-${c}`,
        final: glyph,
        weight: Math.round(weight),
        opacity: stable(opacity, 3),
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
  align?: "left" | "right";
  fade?: FadeEdge;
  /** Multiplies the per-glyph opacity/weight jitter — higher values read as
   * more diverse shades of gray. Defaults to 1 (matches the reference
   * mechanical/electrical look); Hero/Software use a higher value. */
  shadeSpread?: number;
  /** Quantizes opacity/weight into N discrete levels instead of a
   * continuous jitter, for an unmistakably "stepped" set of shades. Omit
   * for the default continuous look. */
  shadeBands?: number;
  className?: string;
}) {
  const scrambleGlyphs = useMemo(
    () => (spots && spots.length > 0 ? spots.flatMap((s) => s.glyphs) : (glyphs ?? [])),
    [spots, glyphs],
  );

  const gridRows = useMemo(
    () => buildRows({ mode, glyphs: glyphs ?? [], spots, seed, rows, cols, fade, shadeSpread, shadeBands }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, seed, rows, cols, fade, shadeSpread, shadeBands, spots, glyphs],
  );

  const [display, setDisplay] = useState<string[][]>(() =>
    gridRows.map((row) => row.cells.map((c) => c.final)),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplay(gridRows.map((row) => row.cells.map((c) => c.final)));
  }, [gridRows]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    // Spins every time the section is scrolled into view (not just once
    // ever) — leaving and coming back re-triggers it. Guarded only against
    // overlapping with an already-running spin.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting || intervalId !== undefined) return;

        // Each cell gets its own random moment (35%-100% of the spin) to
        // lock into its final glyph, instead of every cell holding a random
        // glyph until one shared timeout snaps the whole grid to its final
        // state at once — that single global snap read as a jarring flick.
        // Staggering the settle makes the grid converge gradually with no
        // one instant where everything changes together.
        const settleAt = gridRows.map((row) => row.cells.map(() => 0.35 + Math.random() * 0.65));
        const startTime = performance.now();

        const tick = () => {
          const elapsed = Math.min(1, (performance.now() - startTime) / SPIN_DURATION_MS);
          setDisplay((prev) =>
            gridRows.map((row, ri) =>
              row.cells.map((cell, ci) => {
                if (elapsed >= settleAt[ri][ci]) return cell.final;
                return Math.random() < SWAP_FRACTION
                  ? scrambleGlyphs[Math.floor(Math.random() * scrambleGlyphs.length)]
                  : (prev[ri]?.[ci] ?? cell.final);
              }),
            ),
          );
        };

        intervalId = window.setInterval(tick, SWAP_INTERVAL_MS);
        timeoutId = window.setTimeout(
          () => {
            if (intervalId !== undefined) window.clearInterval(intervalId);
            intervalId = undefined;
            setDisplay(gridRows.map((row) => row.cells.map((c) => c.final)));
          },
          SPIN_DURATION_MS + SWAP_INTERVAL_MS,
        );
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (intervalId !== undefined) window.clearInterval(intervalId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [gridRows, scrambleGlyphs]);

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
          alignItems: align === "right" ? "flex-end" : "flex-start",
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
            className="flex justify-center"
            style={{ lineHeight: 1, gap: mode === "binary" ? "0.6em" : "0.7em" }}
          >
            {row.cells.map((cell, ci) => (
              <span
                key={cell.key}
                className="whitespace-nowrap"
                style={{
                  fontSize,
                  fontWeight: cell.weight,
                  opacity: cell.opacity,
                  width: mode === "binary" ? `${Math.round(fontSize * 0.62)}px` : undefined,
                  textAlign: mode === "binary" ? "center" : undefined,
                  display: "inline-block",
                }}
              >
                {display[ri]?.[ci] ?? cell.final}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
