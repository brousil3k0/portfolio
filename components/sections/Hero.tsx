import { ScrollCue } from "@/components/ui/ScrollCue";
import type { Lang } from "@/content/i18n";
import { getDictionary } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";
import { CONTAINER } from "@/lib/layout";

/** Accent color for highlighted slogan words — deliberately outside the
 * bone/void palette so "idea" and "product" read as the two poles of the
 * slogan's arc, not just emphasized text. */
const SLOGAN_ACCENT = "#40e0d0";

/** Faint drafting-table grid behind the hero — a plain, static graph-paper
 * pattern (not the animated glyph TechGrid the rest of the page uses)
 * fading out toward the edges via a radial mask so it reads as an ambient
 * surface, not a hard-edged rectangle. */
function BlueprintGrid() {
  const maskImage = "radial-gradient(ellipse at 50% 40%, black 0%, transparent 72%)";
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        // bone-dim instead of the dark line color — a dark line color reads
        // as "too dark" at any opacity, since it's dark-on-dark by
        // definition; a lighter base color is what actually makes the grid
        // read as bright rather than just denser.
        backgroundImage:
          "linear-gradient(to right, var(--color-bone-dim) 1px, transparent 1px), linear-gradient(to bottom, var(--color-bone-dim) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        opacity: 0.45,
        WebkitMaskImage: maskImage,
        maskImage,
      }}
    />
  );
}

/** Hand-drawn marginalia scattered around the slogan — the same "sketch on
 * paper" idea the copy itself describes, made literal. Rather than
 * symmetric corners, the three marks trail loosely along the same
 * top-left-to-bottom-right diagonal the two offset title lines already
 * establish — margin notes dropped in as someone worked down the page,
 * not a tidy decorative frame. tick.png is intentionally unused here (kept
 * in public/hero for reuse elsewhere). */
const HERO_DOODLES = [
  {
    src: "/hero/doodle.png",
    className: "top-[8%] left-[16%] w-16 -rotate-[16deg] sm:w-20 md:top-[10%] md:left-[20%] md:w-28 lg:w-32",
  },
  {
    src: "/hero/cross.png",
    className: "top-[55%] right-[13%] w-9 rotate-[6deg] sm:w-11 md:right-[19%] md:w-12 lg:w-14",
  },
  {
    src: "/hero/hastag.png",
    className: "bottom-[22%] left-[9%] w-12 -rotate-[6deg] sm:w-14 md:bottom-[24%] md:left-[14%] md:w-16 lg:w-20",
  },
] as const;

function HeroDoodles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {HERO_DOODLES.map((d) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={d.src} src={d.src} alt="" className={cn("absolute drop-shadow-[0_0_18px_rgba(7,7,7,0.9)]", d.className)} />
      ))}
    </div>
  );
}

export function Hero({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void">
      <BlueprintGrid />
      <HeroDoodles />

      <div className={`${CONTAINER} relative z-10 flex flex-1 flex-col pt-28 pb-8`}>
        <div className="flex flex-1 flex-col">
          <div className="relative mx-auto w-fit max-w-4xl pt-24 text-center sm:pt-32 md:pt-40">
            <h1 className="relative font-display text-base font-medium leading-[1.25] tracking-tight text-bone sm:text-[32px] md:text-[38px] lg:text-[52px] xl:text-[58px]">
              {/* A slight, deliberate left/right offset on each line —
                  enough to read as an intentional off-center composition,
                  not a layout bug. Pure transform (no margin) so it doesn't
                  disturb the block's own centered width. */}
              <span className="block -translate-x-6 whitespace-nowrap sm:-translate-x-8 md:-translate-x-12 lg:-translate-x-16">
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
