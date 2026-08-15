import type { GlyphSpot } from "@/components/grid/TechGrid";
import { TechGrid } from "@/components/grid/TechGrid";
import { BINARY_GLYPHS, ELECTRICAL_VOCAB, MECHANICAL_VOCAB } from "@/components/grid/vocab";
import { ScrollCue } from "@/components/ui/ScrollCue";
import type { Lang } from "@/content/i18n";
import { getDictionary } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { ABS_CONTAINER, CONTAINER } from "@/lib/layout";

// Three vocabularies (binary / mechanical / electrical), each anchored to
// its own spot so they cluster into distinct regions that blend into each
// other at the edges, rather than interleaving word-by-word. Binary gets a
// bigger, more dominant footprint (large sigma); mechanical/electrical stay
// tighter and more separated from each other (small sigma) — binary's own
// reach is what keeps the three regions interfering with each other at
// their edges rather than reading as three fully isolated zones.
const HERO_SPOTS: GlyphSpot[] = [
  { glyphs: BINARY_GLYPHS, center: [0.22, 0.3], sigma: 0.52 },
  { glyphs: MECHANICAL_VOCAB, center: [0.82, 0.2], sigma: 0.32 },
  { glyphs: ELECTRICAL_VOCAB, center: [0.5, 0.87], sigma: 0.32 },
];

export function Hero({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void">
      <div className={ABS_CONTAINER}>
        <TechGrid
          mode="words"
          spots={HERO_SPOTS}
          seed="hero"
          rows={24}
          cols={36}
          shadeSpread={2.2}
          shadeBands={5}
          shapeScale={0.9}
          warpAmount={0.3}
          boundInner={0.68}
          boundOuter={1.05}
          shapeThreshold={0.58}
          className="inset-0"
        />
      </div>

      <div className={`${CONTAINER} relative z-10 flex flex-1 flex-col pt-28 pb-8`}>
        <div className="flex flex-1 flex-col">
          <div className="relative w-fit max-w-6xl pt-24 sm:pt-32 md:pt-40">
            <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-void/85 blur-xl" />
            <h1 className="relative font-display text-base font-normal leading-[1.25] tracking-tight text-bone sm:text-[32px] md:text-[38px] lg:text-[52px] xl:text-[58px]">
              <span className="block whitespace-nowrap">
                {t.hero.sloganLine1.map((seg, i) => (
                  <span key={i} className={"bold" in seg && seg.bold ? "font-bold" : undefined}>
                    {seg.text}
                  </span>
                ))}
              </span>
              <span className="ml-16 block whitespace-nowrap sm:ml-28 md:ml-40 lg:ml-56 xl:ml-64">
                {t.hero.sloganLine2.map((seg, i) => (
                  <span key={i} className={"bold" in seg && seg.bold ? "font-bold" : undefined}>
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
            <div aria-hidden="true" className="absolute -inset-3 rounded-xl bg-void/85 blur-md" />
            <p className="relative text-center font-mono text-base uppercase tracking-[0.2em] text-bone-dim sm:text-lg md:text-xl">
              {siteConfig.name}
            </p>
          </div>
        </div>
      </div>

      <ScrollCue label={t.hero.scroll} />
    </section>
  );
}
