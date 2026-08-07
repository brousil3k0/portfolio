import { siteConfig } from "@/content/site";

export type Lang = "en" | "cs";

const MECHANICAL_SKILLS = ["SolidWorks", "Fusion 360", "GD&T", "FEA", "CNC Machining", "Sheet Metal"];
const ELECTRICAL_SKILLS = ["KiCad", "Altium", "ESP32", "STM32", "Arduino", "Power Electronics"];
const SOFTWARE_SKILLS = ["Python", "TypeScript", "React", "Node.js", "C / C++", "Embedded Firmware"];

export const dictionary = {
  en: {
    nav: { resume: "RESUME", skills: "SKILLS", projects: "PROJECTS", contactMe: "CONTACT ME" },
    hero: {
      quote: "I design the part, the board, and the code that runs it.",
      scroll: "Scroll",
    },
    mechanical: {
      heading: "Mechanical Engineer",
      body: "I work across the full mechanical design cycle — modeling, tolerancing, and validating parts before they ever reach a machine, so the first article is usually the last revision.",
      bullets: [
        "Concept sketches through FEA to production-ready drawings.",
        "Tolerances, surface finishes, and fits that hold up off the screen.",
        "Parts designed for how they'll actually be manufactured.",
      ],
      skills: MECHANICAL_SKILLS,
    },
    electrical: {
      heading: "Electrical Engineer",
      body: "I design the circuits and firmware that give a product its senses and its reflexes — from the power stage that keeps it running to the code that decides what happens next.",
      bullets: [
        "Schematics, power stages, and sensor front-ends.",
        "Firmware loops that turn raw signals into decisions.",
        "Boards designed to be built, tested, and debugged.",
      ],
      skills: ELECTRICAL_SKILLS,
    },
    software: {
      heading: "Software Engineer",
      body: "I build the software layer that sits between hardware and the people using it — dashboards, tools, and services that turn raw signals into something legible.",
      bullets: [
        "Dashboards and tools that make hardware legible.",
        "Clean interfaces between firmware and the outside world.",
        "Code written to be read again in six months.",
      ],
      skills: SOFTWARE_SKILLS,
    },
    contact: {
      availability: "Open to mechanical, electrical, and software engineering work — reach out.",
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "you@example.com",
      messagePlaceholder: "What are you working on?",
      send: "Send",
      sending: "Sending…",
      success: "Message sent — thanks. I'll get back to you soon.",
      errorValidation: "Please check the form fields and try again.",
      errorGeneric: "Something went wrong.",
      linkedin: "LinkedIn",
      github: "GitHub",
      gdprPrefix: "I've read and agree to the ",
      gdprLinkText: "Zásady zpracování osobních údajů",
      gdprSuffix: ".",
    },
    privacy: {
      title: "Zásady zpracování osobních údajů",
      back: "Back",
      updated: "Last updated: August 2026",
      intro:
        "This page explains what personal data this site collects through the contact form, why, and what rights you have over it.",
      sections: [
        {
          heading: "1. Data controller",
          body: `The data controller is Ondřej Brousil, contact: ${siteConfig.email}.`,
        },
        {
          heading: "2. What data is collected",
          body: "When you submit the contact form, I collect the name, email address, and message content you provide. No other personal data is collected or tracked on this site.",
        },
        {
          heading: "3. Purpose and legal basis",
          body: "Your data is processed solely to respond to your message, on the basis of your consent given by submitting the form.",
        },
        {
          heading: "4. Storage and sharing",
          body: "Submitted messages are sent by email via an SMTP provider and are not shared with any other third party. Data is kept only as long as needed to handle the correspondence, then deleted.",
        },
        {
          heading: "5. Your rights",
          body: "Under the GDPR you have the right to access, correct, or request deletion of your data, to object to its processing, and to withdraw consent at any time by emailing the address above. You may also file a complaint with the Office for Personal Data Protection (ÚOOÚ).",
        },
      ],
    },
    resume: {
      title: "Mechanical / Electrical / Software Engineer",
      back: "Back",
      summary:
        "Engineer working across mechanical design, electronics, and firmware/software — I take products from a sketch to a working prototype without handing the problem off between disciplines.",
      location: "Czech Republic",
      education: "Education",
      experience: "Experience",
      skills: "Skills",
      educationEntries: [
        {
          school: "Czech Technical University in Prague",
          program: "B.Sc. Mechanical Engineering",
          period: "2021 — 2025",
          detail: "Focus on machine design and mechatronics.",
        },
      ],
      experienceEntries: [
        {
          org: "Placeholder Robotics s.r.o.",
          role: "Mechatronics Engineer (Intern)",
          period: "2024 — Present",
          bullets: [
            "Designed and machined structural components for a small mobile robot platform, iterating from FEA to production drawings.",
            "Built the sensor interconnect board and firmware driving motor control and telemetry.",
            "Wrote the internal dashboard used to monitor test runs.",
          ],
        },
        {
          org: "Independent Projects",
          role: "Mechanical / Electrical / Software",
          period: "2020 — Present",
          bullets: [
            "Designed and built several PCB-based instrumentation projects, from schematic to enclosure.",
            "Developed embedded firmware for sensor acquisition and control loops on ARM and AVR platforms.",
            "Built web tools and dashboards to visualize and control hardware in the field.",
          ],
        },
      ],
      skillGroups: [
        { category: "Mechanical", items: MECHANICAL_SKILLS },
        { category: "Electrical", items: ELECTRICAL_SKILLS },
        { category: "Software", items: SOFTWARE_SKILLS },
      ],
    },
  },
  cs: {
    nav: { resume: "ŽIVOTOPIS", skills: "DOVEDNOSTI", projects: "PROJEKTY", contactMe: "NAPIŠTE MI" },
    hero: {
      quote: "Navrhuji součástku, desku i kód, který ji řídí.",
      scroll: "Scroll",
    },
    mechanical: {
      heading: "Strojní inženýr",
      body: "Pracuji napříč celým cyklem strojního návrhu — od modelování přes tolerance až po ověření dílu ještě předtím, než se dostane na obráběcí stroj, takže první kus bývá zároveň tím posledním.",
      bullets: [
        "Od konceptu přes FEA až po výrobní výkresy.",
        "Tolerance, povrchy a uložení, které fungují i mimo obrazovku.",
        "Díly navržené podle toho, jak se skutečně vyrábí.",
      ],
      skills: MECHANICAL_SKILLS,
    },
    electrical: {
      heading: "Elektroinženýr",
      body: "Navrhuji obvody a firmware, které produktu dávají smysly i reflexy — od výkonového stupně, který ho drží v chodu, až po kód, který rozhoduje, co se stane dál.",
      bullets: [
        "Schémata, výkonové stupně a snímací frontendy.",
        "Firmwarové smyčky, které mění signály na rozhodnutí.",
        "Desky navržené tak, aby šly postavit, otestovat a odladit.",
      ],
      skills: ELECTRICAL_SKILLS,
    },
    software: {
      heading: "Softwarový inženýr",
      body: "Vytvářím softwarovou vrstvu mezi hardwarem a lidmi, kteří ho používají — dashboardy, nástroje a služby, které mění syrové signály na něco čitelného.",
      bullets: [
        "Dashboardy a nástroje, které dělají hardware čitelným.",
        "Čistá rozhraní mezi firmwarem a okolním světem.",
        "Kód psaný tak, aby se dal číst i za půl roku.",
      ],
      skills: SOFTWARE_SKILLS,
    },
    contact: {
      availability: "Otevřený spolupráci ve strojírenství, elektrotechnice i softwaru — ozvěte se.",
      nameLabel: "Jméno",
      emailLabel: "E-mail",
      messageLabel: "Zpráva",
      namePlaceholder: "Vaše jméno",
      emailPlaceholder: "vas@email.cz",
      messagePlaceholder: "Na čem pracujete?",
      send: "Odeslat",
      sending: "Odesílám…",
      success: "Zpráva odeslána — díky. Ozvu se co nejdřív.",
      errorValidation: "Zkontrolujte prosím vyplněná pole.",
      errorGeneric: "Něco se pokazilo.",
      linkedin: "LinkedIn",
      github: "GitHub",
      gdprPrefix: "Souhlasím se ",
      gdprLinkText: "Zásady zpracování osobních údajů",
      gdprSuffix: ".",
    },
    privacy: {
      title: "Zásady zpracování osobních údajů",
      back: "Zpět",
      updated: "Naposledy aktualizováno: srpen 2026",
      intro:
        "Tato stránka vysvětluje, jaké osobní údaje tento web shromažďuje prostřednictvím kontaktního formuláře, proč, a jaká máte práva.",
      sections: [
        {
          heading: "1. Správce údajů",
          body: `Správcem osobních údajů je Ondřej Brousil, kontakt: ${siteConfig.email}.`,
        },
        {
          heading: "2. Jaké údaje se shromažďují",
          body: "Při odeslání kontaktního formuláře shromažďuji jméno, e-mailovou adresu a obsah zprávy, které uvedete. Žádné jiné osobní údaje tento web nesbírá ani nesleduje.",
        },
        {
          heading: "3. Účel a právní základ",
          body: "Vaše údaje zpracovávám výhradně za účelem odpovědi na vaši zprávu, na základě souhlasu uděleného odesláním formuláře.",
        },
        {
          heading: "4. Uchovávání a předávání",
          body: "Odeslané zprávy jsou doručeny e-mailem prostřednictvím SMTP poskytovatele a nejsou předávány žádné další třetí straně. Údaje uchovávám pouze po dobu nezbytnou k vyřízení korespondence, poté je maži.",
        },
        {
          heading: "5. Vaše práva",
          body: "Podle GDPR máte právo na přístup k vašim údajům, jejich opravu či výmaz, právo vznést námitku proti zpracování a právo kdykoli odvolat souhlas zasláním e-mailu na výše uvedenou adresu. Rovněž máte právo podat stížnost u Úřadu pro ochranu osobních údajů (ÚOOÚ).",
        },
      ],
    },
    resume: {
      title: "Strojní / Elektro / Softwarový inženýr",
      back: "Zpět",
      summary:
        "Inženýr pracující napříč strojním návrhem, elektronikou a firmwarem/softwarem — dovedu produkt od skici k funkčnímu prototypu bez předávání mezi obory.",
      location: "Česká republika",
      education: "Vzdělání",
      experience: "Praxe",
      skills: "Dovednosti",
      educationEntries: [
        {
          school: "Škoda Auto a.s., Střední odborné učiliště strojírenské, odštěpný závod",
          program: "26-41-M/01 Elektrotechnika - IT technik",
          period: "2025 - 2029 (stále probíhající)",
          detail: "Čtyřletý středoškolský studijní obor zakončení maturitní zkouškou.",
        },
      ],
      experienceEntries: [
        {
          org: "Placeholder Robotics s.r.o.",
          role: "Mechatronik (stáž)",
          period: "2024 — nyní",
          bullets: [
            "Navrhoval a obráběl konstrukční díly pro malou mobilní robotickou platformu, iterace od FEA po výrobní výkresy.",
            "Vytvořil propojovací desku senzorů a firmware pro řízení motorů a telemetrii.",
            "Napsal interní dashboard pro sledování testovacích jízd.",
          ],
        },
        {
          org: "Vlastní projekty",
          role: "Strojní / elektro / software",
          period: "2020 — nyní",
          bullets: [
            "Navrhl a postavil několik přístrojových projektů na bázi desek plošných spojů, od schématu po kryt.",
            "Vyvíjel vestavěný firmware pro sběr dat ze senzorů a regulační smyčky na platformách ARM a AVR.",
            "Vytvářel webové nástroje a dashboardy pro vizualizaci a ovládání hardwaru v terénu.",
          ],
        },
      ],
      skillGroups: [
        { category: "Strojní", items: MECHANICAL_SKILLS },
        { category: "Elektro", items: ELECTRICAL_SKILLS },
        { category: "Software", items: SOFTWARE_SKILLS },
      ],
    },
  },
} as const;

export function getDictionary(lang: Lang) {
  return dictionary[lang];
}

export function resolveLang(value: string | string[] | undefined): Lang {
  return value === "cs" ? "cs" : "en";
}
