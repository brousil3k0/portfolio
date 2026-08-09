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
        <div className="flex max-w-2xl flex-1 flex-col justify-center bg-[radial-gradient(ellipse_at_30%_50%,rgba(7,7,7,0.75)_0%,rgba(7,7,7,0.45)_45%,transparent_75%)]">
          <h1 className="font-display text-5xl font-bold leading-[1] tracking-tight text-bone sm:text-6xl md:text-7xl">
            {siteConfig.name}
          </h1>

          <blockquote className="mt-8">
            <p className="font-display text-2xl font-medium leading-snug tracking-tight text-bone-dim sm:text-3xl">
              “{t.hero.quote}”
            </p>
            <footer className="mt-4 font-mono text-sm uppercase tracking-[0.2em] text-bone-dim sm:text-base">
              — {siteConfig.handle}
            </footer>
          </blockquote>
        </div>
      </div>

      <ScrollCue label={t.hero.scroll} />
    </section>
  );
}
