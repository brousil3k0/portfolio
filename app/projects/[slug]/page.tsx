import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { TechGrid } from "@/components/grid/TechGrid";
import { BINARY_GLYPHS } from "@/components/grid/vocab";
import { ProjectBlocks } from "@/components/ProjectBlocks";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { SkillTag } from "@/components/ui/SkillTag";
import { findProject, getDictionary, resolveLang } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { ABS_CONTAINER, CONTAINER } from "@/lib/layout";
import { PROJECT_STATUS_COLOR } from "@/lib/projectStatus";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const lang = resolveLang(sp.lang);
  const item = findProject(lang, slug);
  return { title: item ? `${item.name} — ${siteConfig.name}` : siteConfig.name };
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const lang = resolveLang(sp.lang);
  const t = getDictionary(lang);
  const p = t.projects;
  const item = findProject(lang, slug);

  if (!item) notFound();

  const hasLiveLink = item.url && item.url !== "#";
  const accentColor = PROJECT_STATUS_COLOR[item.status];

  return (
    <main className="bg-void text-bone">
      <Nav lang={lang} path={`/projects/${slug}`} />

      <section className="relative overflow-hidden bg-void">
        <div className={ABS_CONTAINER}>
          <TechGrid
            mode="binary"
            glyphs={BINARY_GLYPHS}
            seed={`project-hero-${slug}`}
            rows={22}
            cols={40}
            accentColor={accentColor}
            swapIntervalMs={90}
            swapFraction={0.5}
            className="inset-0"
          />
        </div>

        <div className={`${CONTAINER} relative z-10 pt-28 pb-16 md:pt-32`}>
          <div className="relative mb-10 inline-block w-fit">
            <div aria-hidden="true" className="absolute -inset-3 rounded-xl bg-void/85 blur-md" />
            <Link
              href="/#projects"
              className="relative inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-bone transition-colors hover:text-bone-dim"
            >
              ← {p.back}
            </Link>
          </div>

          <div className="relative w-fit max-w-3xl">
            <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-void/85 blur-xl" />
            <div className="relative">
              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{item.name}</h1>
              <ul className="mt-6 flex flex-wrap gap-2">
                {item.tags.map((tagKey) => (
                  <li key={tagKey}>
                    <SkillTag>{p.tags[tagKey as keyof typeof p.tags]}</SkillTag>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-void py-16">
        <div className={CONTAINER}>
          <div className="space-y-10">
            <p className="text-justify text-xl leading-relaxed text-bone-dim">{item.description}</p>
            <ProjectBlocks blocks={item.content} name={item.name} />
          </div>

          {(hasLiveLink || item.files.length > 0) && (
            <div className="mt-16 grid gap-10 border-t border-line pt-10 sm:grid-cols-2">
              {hasLiveLink && (
                <div>
                  <h2 className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-bone-dim">
                    {p.liveLink}
                  </h2>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 font-mono text-sm text-bone underline decoration-line underline-offset-4 transition-colors hover:decoration-bone"
                  >
                    {item.url} ↗
                  </a>
                </div>
              )}

              {item.files.length > 0 && (
                <div>
                  <h2 className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-bone-dim">
                    {p.filesHeading}
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {item.files.map((file) => (
                      <li key={file.href}>
                        <a
                          href={file.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-mono text-sm text-bone underline decoration-line underline-offset-4 transition-colors hover:decoration-bone"
                        >
                          {file.name} ↗
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {item.images.length > 0 && (
        <section className="bg-void pb-20">
          <div className={CONTAINER}>
            <h2 className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-bone-dim">
              {p.galleryHeading}
            </h2>
            <div
              className="mt-6 grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
            >
              {item.images.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={item.name}
                  className="h-64 w-full rounded-xl border border-line object-cover"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactFooter lang={lang} />
    </main>
  );
}
