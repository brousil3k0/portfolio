import { HtmlLangSync } from "@/components/HtmlLangSync";
import { Nav } from "@/components/Nav";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { ElectricalSection } from "@/components/sections/ElectricalSection";
import { Hero } from "@/components/sections/Hero";
import { MechanicalSection } from "@/components/sections/MechanicalSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SoftwareSection } from "@/components/sections/SoftwareSection";
import { resolveLang } from "@/content/i18n";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const lang = resolveLang(params.lang);

  return (
    <main id="main-content">
      <HtmlLangSync lang={lang} />
      <Nav lang={lang} />
      <Hero lang={lang} />
      <MechanicalSection lang={lang} />
      <ElectricalSection lang={lang} />
      <SoftwareSection lang={lang} />
      <ProjectsSection lang={lang} />
      <ContactFooter lang={lang} />
    </main>
  );
}
