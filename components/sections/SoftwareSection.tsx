import { TechGrid } from "@/components/grid/TechGrid";
import { BINARY_GLYPHS } from "@/components/grid/vocab";
import { SkillTag } from "@/components/ui/SkillTag";
import type { Lang } from "@/content/i18n";
import { getDictionary } from "@/content/i18n";
import { ABS_CONTAINER, CONTAINER } from "@/lib/layout";

export function SoftwareSection({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);

  return (
    <section className="relative overflow-hidden bg-void">
      <div className={ABS_CONTAINER}>
        <TechGrid
          mode="binary"
          glyphs={BINARY_GLYPHS}
          seed="software"
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
          centerU={0.68}
          accentColor="#00cc00"
          swapIntervalMs={70}
          swapFraction={0.6}
          className="inset-0"
        />
      </div>

      <div className={`${CONTAINER} relative z-10 flex flex-col items-end pt-[11rem] pb-[9rem] md:pt-[14rem] md:pb-[12rem]`}>
        <div className="relative w-fit max-w-full">
          <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-void/85 blur-xl" />
          <div className="relative text-right">
            <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-bone sm:text-4xl lg:text-5xl">
              {t.software.heading}
            </h2>

            <ul className="mt-14 flex flex-wrap justify-end gap-2">
              {t.software.skills.map((skill) => (
                <li key={skill}>
                  <SkillTag>{skill}</SkillTag>
                </li>
              ))}
            </ul>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-bone-dim">
              {t.software.body}
            </p>

            <ul className="mt-6 max-w-xl list-none space-y-2 text-lg leading-relaxed text-bone-dim">
              {t.software.bullets.map((bullet) => (
                <li key={bullet} className="flex justify-end gap-2">
                  <span>{bullet}</span>
                  <span aria-hidden="true" className="text-bone">
                    &lt;
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
