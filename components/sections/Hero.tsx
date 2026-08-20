import { TechGrid } from "@/components/grid/TechGrid";
import { HERO_BINARY } from "@/components/grid/vocab";
import { ScrollCue } from "@/components/ui/ScrollCue";
import type { Lang } from "@/content/i18n";
import { getDictionary } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";
import { ABS_CONTAINER, CONTAINER } from "@/lib/layout";

/** Accent color for highlighted slogan words — deliberately outside the
 * bone/void palette so "idea" and "product" read as the two poles of the
 * slogan's arc, not just emphasized text. */
const SLOGAN_ACCENT = "#40e0d0";

/** Hero TechGrid accent — a deep purple, plus a few shades of it (lighter
 * tints and a darker tone) spread one per instance so the four corner
 * clusters aren't all one identical flat color. */
const GRID_ACCENT_BASE = "#4b006e";
const GRID_ACCENT_LIGHT_1 = "#784092";
const GRID_ACCENT_LIGHT_2 = "#9c73af";
const GRID_ACCENT_DARK = "#35004d";

export function Hero({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void">
      {/* Four smaller instances instead of two bigger ones — two clusters
          both sat in the upper half, reading as "one pack" up top with the
          lower half empty. Spreading one into each quadrant (with a smaller
          boundOuter per instance so four of them don't merge back into one
          big mass) covers the section evenly while each still keeps the
          same boundInner-well-above-one-noise-cell recipe that keeps the
          silhouette fragmented into islands rather than a solid block.
          cols=50 (not the usual 60) — at 60 cols/fontSize=20 each row
          renders ~1286px wide, ~134px wider than the max-w-6xl container
          box that clips it, so a dense cluster near an edge got hard-cut.
          50 cols keeps the same per-glyph size/spacing (so it still reads
          just as packed) but renders ~1070px wide, comfortably inside the
          container with no clipping needed.
          boundOuter is smaller here (0.48, not 0.62) specifically so each
          cluster's own falloff finishes before reaching u=0/u=1 — at 0.62
          a cluster centered near an edge (0.14/0.82, tried first) still had
          most of its full-density core sitting AT that edge, so it didn't
          fade at all before hitting the row's own boundary, reading as a
          hard straight-line "wall" instead of an organic taper. Pulling
          centerU inward instead (tried next, ~0.34-0.66) fixed the wall but
          collapsed all four clusters into one dense mass in the middle,
          right behind the text — the same symmetric-mask problem from
          earlier in this session. Shrinking boundOuter keeps centerU close
          to the corners (0.26/0.74) for real left/right spread while still
          guaranteeing the vignette reaches zero before the edge. */}
      <div className={ABS_CONTAINER}>
        <TechGrid
          mode="binary"
          glyphs={HERO_BINARY}
          seed="hero-a"
          rows={32}
          cols={50}
          shadeSpread={2}
          shadeBands={5}
          shapeScale={1.15}
          shapeThreshold={0.52}
          warpAmount={0.5}
          boundInner={0.24}
          boundOuter={0.48}
          centerU={0.74}
          centerV={0.22}
          accentColor={GRID_ACCENT_LIGHT_1}
          swapIntervalMs={70}
          swapFraction={0.6}
          className="inset-0"
        />
        <TechGrid
          mode="binary"
          glyphs={HERO_BINARY}
          seed="hero-b"
          rows={32}
          cols={50}
          shadeSpread={2}
          shadeBands={5}
          shapeScale={1.15}
          shapeThreshold={0.52}
          warpAmount={0.5}
          boundInner={0.24}
          boundOuter={0.48}
          centerU={0.26}
          centerV={0.3}
          accentColor={GRID_ACCENT_BASE}
          swapIntervalMs={70}
          swapFraction={0.6}
          className="inset-0"
        />
        <TechGrid
          mode="binary"
          glyphs={HERO_BINARY}
          seed="hero-c"
          rows={32}
          cols={50}
          shadeSpread={2}
          shadeBands={5}
          shapeScale={1.15}
          shapeThreshold={0.52}
          warpAmount={0.5}
          boundInner={0.24}
          boundOuter={0.48}
          centerU={0.74}
          centerV={0.7}
          accentColor={GRID_ACCENT_DARK}
          swapIntervalMs={70}
          swapFraction={0.6}
          className="inset-0"
        />
        <TechGrid
          mode="binary"
          glyphs={HERO_BINARY}
          seed="hero-d"
          rows={32}
          cols={50}
          shadeSpread={2}
          shadeBands={5}
          shapeScale={1.15}
          shapeThreshold={0.52}
          warpAmount={0.5}
          boundInner={0.24}
          boundOuter={0.48}
          centerU={0.26}
          centerV={0.78}
          accentColor={GRID_ACCENT_LIGHT_2}
          swapIntervalMs={70}
          swapFraction={0.6}
          className="inset-0"
        />
      </div>

      <div className={`${CONTAINER} relative z-10 flex flex-1 flex-col pt-28 pb-8`}>
        <div className="flex flex-1 flex-col">
          <div className="relative mx-auto w-fit max-w-4xl pt-24 text-center sm:pt-32 md:pt-40">
            <h1 className="relative font-display text-base font-medium leading-[1.25] tracking-tight text-bone sm:text-[32px] md:text-[38px] lg:text-[52px] xl:text-[58px]">
              {/* A slight, deliberate left/right offset on each line —
                  enough to read as an intentional off-center composition,
                  not a layout bug. Pure transform (no margin) so it doesn't
                  disturb the block's own centered width.
                  Each line gets its own shadow, sized (inline-block, not
                  full-width block) and moved (the translate lives on this
                  same inline-block, not a separate wrapper) to match that
                  line's own actual rendered text exactly — a single shared
                  backdrop sized to the wider line left dead shaded space
                  next to the shorter one while glyphs bled in on its other
                  side, since it couldn't track each line's own width/offset
                  independently. */}
              <span className="block">
                <span className="relative inline-block -translate-x-14 whitespace-nowrap sm:-translate-x-20 md:-translate-x-28 lg:-translate-x-36">
                  <span aria-hidden="true" className="absolute -inset-x-3 -inset-y-1.5 -z-10 rounded-lg bg-void/95 blur-md" />
                  {t.hero.sloganLine1.map((seg, i) => (
                    <span
                      key={i}
                      className={cn("bold" in seg && seg.bold && "font-extrabold")}
                      style={"accent" in seg && seg.accent ? { color: SLOGAN_ACCENT } : undefined}
                    >
                      {seg.text}
                    </span>
                  ))}
                </span>
              </span>
              <span className="block">
                <span className="relative inline-block translate-x-6 whitespace-nowrap sm:translate-x-8 md:translate-x-12 lg:translate-x-16">
                  <span aria-hidden="true" className="absolute -inset-x-3 -inset-y-1.5 -z-10 rounded-lg bg-void/95 blur-md" />
                  {t.hero.sloganLine2.map((seg, i) => (
                    <span
                      key={i}
                      className={cn("bold" in seg && seg.bold && "font-extrabold")}
                      style={"accent" in seg && seg.accent ? { color: SLOGAN_ACCENT } : undefined}
                    >
                      {seg.text}
                    </span>
                  ))}
                </span>
              </span>
            </h1>
          </div>

          {/* mt-auto pushes this to the bottom of the flex-1 column, right
              above the ScrollCue (absolute, bottom-10 in its own right) —
              centered on the full page-content width (not the slogan's own,
              narrower box) via a separate wrapper so it doesn't inherit the
              h1's shrink-to-fit width and end up off-center relative to the
              page. */}
          <div className="relative mt-auto w-full max-w-6xl pb-28 sm:pb-32 md:pb-36">
            <div className="relative mx-auto w-fit">
              <div aria-hidden="true" className="absolute -inset-6 rounded-full bg-void/95 blur-xl" />
              <p className="relative text-center font-mono text-base uppercase tracking-[0.2em] text-bone-dim sm:text-lg md:text-xl">
                {siteConfig.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScrollCue label={t.hero.scroll} />
    </section>
  );
}
