"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TechGrid } from "@/components/grid/TechGrid";
import { PROJECTS_BINARY } from "@/components/grid/vocab";
import { SkillTag } from "@/components/ui/SkillTag";
import type { Lang } from "@/content/i18n";
import { getDictionary } from "@/content/i18n";
import { cn } from "@/lib/cn";
import { ABS_CONTAINER, CONTAINER } from "@/lib/layout";

function filterButtonClass(active: boolean) {
  return cn(
    "border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide shadow-[0_14px_20px_rgba(0,0,0,0.85)] transition-colors",
    active
      ? "border-bone bg-bone text-void"
      : "border-bone-dim bg-line text-bone-dim hover:border-bone hover:text-bone",
  );
}

export function ProjectsSection({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const p = t.projects;
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tagKeys = Object.keys(p.tags) as (keyof typeof p.tags)[];

  const filtered = useMemo(() => {
    if (!activeTag) return p.items;
    return p.items.filter((item) => (item.tags as readonly string[]).includes(activeTag));
  }, [activeTag, p.items]);

  return (
    <section id="projects" className="relative scroll-mt-16 overflow-hidden bg-void">
      <div className={ABS_CONTAINER}>
        <TechGrid
          mode="binary"
          glyphs={PROJECTS_BINARY}
          seed="projects"
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
          centerU={0.72}
          swapIntervalMs={70}
          swapFraction={0.6}
          className="inset-0"
        />
      </div>

      <div className={`${CONTAINER} relative z-10 pt-[9rem] pb-[5rem] md:pt-[12rem] md:pb-[7rem]`}>
        <div className="relative w-fit max-w-full">
          <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-void/85 blur-xl" />
          <div className="relative">
            <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-bone sm:text-4xl lg:text-5xl">
              {p.heading}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-bone-dim">{p.body}</p>
          </div>
        </div>

        <div className="relative mt-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-full h-4 bg-void/90 blur-md" />
          <div className="relative flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              aria-pressed={activeTag === null}
              className={filterButtonClass(activeTag === null)}
            >
              {p.filterAll}
            </button>
            {tagKeys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTag(key)}
                aria-pressed={activeTag === key}
                className={filterButtonClass(activeTag === key)}
              >
                {p.tags[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Announces the filtered count for screen reader users — the
            filter buttons only change a visual list below, with no page
            navigation or focus move to signal that anything happened. */}
        <p role="status" aria-live="polite" className="sr-only">
          {filtered.length} {p.heading}
        </p>

        <div className="relative mt-12">
          <div className="relative">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-48 h-6 bg-void/90 blur-md" />
            <ul className="thin-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-6">
              {filtered.map((item) => (
                <li
                  key={item.name}
                  className="h-48 w-72 shrink-0 snap-start overflow-hidden border border-bone-dim bg-black shadow-[0_20px_28px_rgba(0,0,0,0.85)] transition-colors hover:border-bone"
                >
                  <Link href={`/projects/${item.slug}?lang=${lang}`} className="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="line-clamp-1 font-display text-base font-bold text-bone">{item.name}</h3>
                      <span className="shrink-0 font-mono text-xs text-bone-dim">{item.year}</span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.tags.map((tagKey) => (
                        <SkillTag key={tagKey} className="shadow-[0_4px_8px_rgba(0,0,0,0.7)]">
                          {p.tags[tagKey as keyof typeof p.tags]}
                        </SkillTag>
                      ))}
                    </div>

                    <p className="mt-2 line-clamp-2 overflow-hidden text-sm leading-relaxed text-bone-dim">{item.description}</p>

                    <span className="mt-auto inline-flex w-fit items-center gap-2 pt-2 font-mono text-xs text-bone underline decoration-line underline-offset-4">
                      {p.viewProject} ↗
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pointer-events-none absolute top-0 right-0 h-48 w-16 bg-gradient-to-l from-void to-transparent" />
        </div>
      </div>
    </section>
  );
}
