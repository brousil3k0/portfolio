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
 * slogan's arc, not just emphasized text. Also drives the hero's own
 * TechGrid accent, tying the background texture to the same color. */
const SLOGAN_ACCENT = "#40e0d0";

export function Hero({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void">
      <div className={ABS_CONTAINER}>
        <TechGrid
          mode="binary"
          glyphs={HERO_BINARY}
          seed="hero"
          rows={32}
          cols={60}
          align="center"
          shadeSpread={2}
          shadeBands={5}
          shapeScale={1.15}
          shapeThreshold={0.52}
          warpAmount={0.5}
          boundInner={0.3}
          boundOuter={0.8}
          centerU={0.64}
          accentColor={SLOGAN_ACCENT}
          swapIntervalMs={70}
          swapFraction={0.6}
          className="inset-0"
        />
      </div>

      <div className={`${CONTAINER} relative z-10 flex flex-1 flex-col pt-28 pb-8`}>
        <div className="flex flex-1 flex-col">
          <div className="relative mx-auto w-fit max-w-4xl pt-24 text-center sm:pt-32 md:pt-40">
            <div aria-hidden="true" className="absolute -inset-8 rounded-[2rem] bg-void/85 blur-xl" />
            <h1 className="relative font-display text-base font-medium leading-[1.25] tracking-tight text-bone sm:text-[32px] md:text-[38px] lg:text-[52px] xl:text-[58px]">
              {/* A slight, deliberate left/right offset on each line —
                  enough to read as an intentional off-center composition,
                  not a layout bug. Pure transform (no margin) so it doesn't
                  disturb the block's own centered width. */}
              <span className="block -translate-x-14 whitespace-nowrap sm:-translate-x-20 md:-translate-x-28 lg:-translate-x-36">
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
              <span className="block translate-x-6 whitespace-nowrap sm:translate-x-8 md:translate-x-12 lg:translate-x-16">
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
              <div aria-hidden="true" className="absolute -inset-4 rounded-full bg-void/85 blur-xl" />
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
