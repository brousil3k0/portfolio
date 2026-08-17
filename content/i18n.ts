import { siteConfig } from "@/content/site";

export type Lang = "en" | "cs";

// Kept as separate lists per surface (not shared constants) so the
// homepage's skill tags and the resume's skill groups can each be edited
// without changing the other.
const HOME_MECHANICAL_SKILLS = ["SolidWorks", "Fusion 360", "GD&T", "3D Printing", "Technical Documentation"];
const HOME_ELECTRICAL_SKILLS = ["KiCad", "PCB Design", "ESP32", "STM32", "Embedded Systems"];
const HOME_SOFTWARE_SKILLS = ["Python", "TypeScript", "React", "Node.js", "C / C++", "Embedded Firmware"];

const RESUME_MECHANICAL_SKILLS = ["SolidWorks", "Fusion 360", "GD&T", "3D Printing", "Technical Documentation"];
const RESUME_ELECTRICAL_SKILLS = ["KiCad", "PCB Design", "ESP32", "STM32", "Embedded Systems"];
const RESUME_SOFTWARE_SKILLS = ["Python", "TypeScript", "React", "Node.js", "C / C++", "Embedded Firmware"];

// Placeholder body copy for project pages — real Lorem Ipsum, not a
// translation, since it's filler either way regardless of site language.
// Swap for real project write-ups later; the block *structure* (which
// paragraphs get an image, on which side, at what ratio) is what each
// project's `content` array is actually demonstrating.
const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.",
] as const;

// Placeholder images — drop your own files at these exact paths under
// public/ (public/projects/placeholders/1.jpg … 5.jpg) and every project
// page picks them up automatically; nothing else needs to change.
const PH = [
  "/projects/placeholders/1.jpg",
  "/projects/placeholders/2.jpg",
  "/projects/placeholders/3.jpg",
  "/projects/placeholders/4.jpeg",
  "/projects/placeholders/5.jpg",
] as const;

export const dictionary = {
  en: {
    nav: { resume: "RESUME", skills: "SKILLS", projects: "PROJECTS", contactMe: "CONTACT ME" },
    hero: {
      // Segmented (not a plain string) so the key nouns can render bold
      // and/or accent-colored while the connecting words are lighter —
      // `bold`/`accent` default to false when omitted.
      sloganLine1: [{ text: "From " }, { text: "idea", bold: true, accent: true }, { text: " on paper" }],
      sloganLine2: [
        { text: "to fully working " },
        { text: "product", bold: true, accent: true },
      ],
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
      skills: HOME_MECHANICAL_SKILLS,
    },
    electrical: {
      heading: "Electrical Engineer",
      body: "I design the circuits and firmware that give a product its senses and its reflexes — from the power stage that keeps it running to the code that decides what happens next.",
      bullets: [
        "Schematics, power stages, and sensor front-ends.",
        "Firmware loops that turn raw signals into decisions.",
        "Boards designed to be built, tested, and debugged.",
      ],
      skills: HOME_ELECTRICAL_SKILLS,
    },
    software: {
      heading: "Software Engineer",
      body: "I build the software layer that sits between hardware and the people using it — dashboards, tools, and services that turn raw signals into something legible.",
      bullets: [
        "Dashboards and tools that make hardware legible.",
        "Clean interfaces between firmware and the outside world.",
        "Code written to be read again in six months.",
      ],
      skills: HOME_SOFTWARE_SKILLS,
    },
    contact: {
      ctaHeadingLine1: "Got a project in mind?",
      ctaHeadingLine2: "Let's build it together.",
      ctaSubtitle: "Whether it's a full product or a single board, I'd love to hear about it.",
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
      orcid: "ORCID",
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
      back: "Back",
      summary:
        "I'm a student who takes a project from pencil and paper, through building the mechanical and electrical parts, to a finished product.",
      location: "Czech Republic",
      education: "Education",
      experience: "Experience",
      skills: "Skills",
      educationEntries: [
        {
          school: "Škoda Auto a.s., Secondary Vocational School of Mechanical Engineering (branch)",
          program: "26-41-M/01 Electrical Engineering – IT Technician",
          period: "2025 — 2029 (ongoing)",
          detail: "Four-year secondary school program, concluding with the Maturita school-leaving exam.",
        },
      ],
      experienceEntries: [
        {
          org: "EcoWheel s.r.o.",
          role: "Electromechanical Technician",
          period: "2024 — Present",
          bullets: [
            "Diagnosed and verified reported faults, then proposed the most cost-effective fix.",
            "Carried out repairs and verified they were successful.",
            "Documented completed repairs and logged the replacement parts used.",
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
        { category: "Mechanical", items: RESUME_MECHANICAL_SKILLS },
        { category: "Electrical", items: RESUME_ELECTRICAL_SKILLS },
        { category: "Software", items: RESUME_SOFTWARE_SKILLS },
      ],
      certifications: {
        title: "Certifications",
        entries: [
          {
            name: "Fundamentals of Hybrid and Battery Electric Vehicles",
            issuer: "Denso",
            year: "2026",
            file: "/certificates/hybrid.pdf",
          },
          {
            name: "3D Printing and Modeling for Beginners (MK3S+)",
            issuer: "Prusa Research a.s.",
            year: "2023",
            file: "/certificates/prusa.pdf",
          },
        ],
      },
    },
    projects: {
      heading: "Explore what projects I've worked on",
      body: "A mix of the mechanical, electrical, and software work I've shipped — filter by type to narrow it down.",
      filterAll: "All",
      tags: {
        website: "Website",
        mobileApp: "Mobile App",
        controlSystem: "Control System",
        firmware: "Firmware",
        hardware: "Hardware",
      },
      status: {
        finished: "Finished",
        workingOn: "Working On",
        planned: "In Plan",
      },
      viewProject: "View project",
      back: "Back to projects",
      liveLink: "Live link",
      galleryHeading: "Gallery",
      filesHeading: "Files",
      items: [
        {
          slug: "robotics-dashboard",
          name: "Placeholder Robotics Dashboard",
          year: "2025",
          status: "workingOn",
          description:
            "Web dashboard for monitoring and controlling a mobile robot platform in real time — live telemetry, manual overrides, and test-run logging.",
          content: [
            { type: "text", text: LOREM[0] },
            { type: "textImage", text: LOREM[1], image: PH[0], imagePosition: "left", imageWidth: 50 },
          ],
          tags: ["website", "controlSystem"],
          url: "#",
          images: [PH[0], PH[1], PH[2]],
          files: [],
        },
        {
          slug: "sensor-interconnect",
          name: "Sensor Interconnect Firmware",
          year: "2024",
          status: "finished",
          description:
            "Embedded firmware driving motor control and sensor telemetry on an ARM-based interconnect board.",
          content: [
            { type: "text", text: LOREM[1] },
            { type: "textImage", text: LOREM[2], image: PH[1], imagePosition: "right", imageWidth: 38 },
            { type: "text", text: LOREM[3] },
          ],
          tags: ["firmware", "hardware"],
          url: "#",
          images: [PH[1], PH[2]],
          files: [],
        },
        {
          slug: "field-instrumentation",
          name: "Field Instrumentation Suite",
          year: "2023",
          status: "finished",
          description:
            "PCB-based instrumentation project, from schematic to enclosure, with a companion mobile app for field readings.",
          content: [
            { type: "images", images: [PH[2], PH[3], PH[4]], height: "16rem" },
            { type: "text", text: LOREM[0] },
            { type: "textImage", text: LOREM[2], image: PH[0], imagePosition: "left", imageWidth: 38 },
          ],
          tags: ["hardware", "mobileApp"],
          url: "#",
          images: [PH[2], PH[3], PH[4]],
          files: [],
        },
        {
          slug: "test-rig-control",
          name: "Test Rig Control Panel",
          year: "2023",
          status: "finished",
          description:
            "Closed-loop control system for a bench test rig, with a touch-panel UI for setting run profiles and watching live sensor plots.",
          content: [
            { type: "text", text: LOREM[3] },
            { type: "textImage", text: LOREM[0], image: PH[3], imagePosition: "right", imageWidth: 50 },
          ],
          tags: ["controlSystem", "hardware"],
          url: "#",
          images: [PH[3], PH[0]],
          files: [],
        },
        {
          slug: "fleet-tracking-app",
          name: "Fleet Tracking Companion App",
          year: "2022",
          status: "planned",
          description:
            "Cross-platform mobile app for tracking a small equipment fleet's location, battery state, and maintenance schedule.",
          content: [
            { type: "text", text: LOREM[2] },
            { type: "images", images: [PH[4]], height: "24rem" },
          ],
          tags: ["mobileApp"],
          url: "#",
          images: [PH[4]],
          files: [],
        },
        {
          slug: "portfolio-site",
          name: "Portfolio & Case Study Site",
          year: "2022",
          status: "workingOn",
          description: "This site — a Next.js portfolio with a generative background system tying three disciplines together.",
          content: [
            { type: "textImage", text: LOREM[1], image: PH[1], imagePosition: "left", imageWidth: 50 },
            { type: "text", text: LOREM[3] },
          ],
          tags: ["website"],
          url: "#",
          images: [PH[1], PH[4]],
          files: [],
        },
        {
          slug: "motor-driver-firmware",
          name: "Motor Driver Firmware",
          year: "2021",
          status: "finished",
          description:
            "Low-level firmware for a brushless motor driver — current sensing, commutation, and a serial telemetry link.",
          content: [
            { type: "text", text: LOREM[0] },
            { type: "textImage", text: LOREM[3], image: PH[2], imagePosition: "right", imageWidth: 38 },
            { type: "images", images: [PH[0], PH[1]], height: "18rem" },
          ],
          tags: ["firmware"],
          url: "#",
          images: [PH[2], PH[0]],
          files: [],
        },
        {
          slug: "greenhouse-controller",
          name: "Greenhouse Climate Controller",
          year: "2021",
          status: "planned",
          description:
            "Standalone controller regulating temperature, humidity, and irrigation for a small greenhouse, with a local dashboard.",
          content: [
            { type: "textImage", text: LOREM[2], image: PH[4], imagePosition: "left", imageWidth: 50 },
            { type: "text", text: LOREM[1] },
            { type: "images", images: [PH[3]], height: "20rem" },
          ],
          tags: ["controlSystem", "firmware"],
          url: "#",
          images: [PH[4], PH[3]],
          files: [],
        },
      ],
    },
  },
  cs: {
    nav: { resume: "ŽIVOTOPIS", skills: "DOVEDNOSTI", projects: "PROJEKTY", contactMe: "NAPIŠTE MI" },
    hero: {
      sloganLine1: [{ text: "Z " }, { text: "nápadu", bold: true, accent: true }, { text: " na papíře" }],
      sloganLine2: [
        { text: "po plně funkční " },
        { text: "produkt", bold: true, accent: true },
        { text: "." },
      ],
      scroll: "Scroll",
    },
    mechanical: {
      heading: "Strojírenství",
      body: "Pracuji napříč celým cyklem strojního návrhu — od modelování přes tolerance až po ověření dílu ještě předtím, než se dostane na obráběcí stroj, takže první kus bývá zároveň tím posledním.",
      bullets: [
        "Od konceptu přes FEA až po výrobní výkresy.",
        "Tolerance, povrchy a uložení, které fungují i mimo obrazovku.",
        "Díly navržené podle toho, jak se skutečně vyrábí.",
      ],
      skills: HOME_MECHANICAL_SKILLS,
    },
    electrical: {
      heading: "Elektrotechnika",
      body: "Navrhuji obvody a firmware, které produktu dávají smysly i reflexy — od výkonového stupně, který ho drží v chodu, až po kód, který rozhoduje, co se stane dál.",
      bullets: [
        "Schémata, výkonové stupně a snímací frontendy.",
        "Firmwarové smyčky, které mění signály na rozhodnutí.",
        "Desky navržené tak, aby šly postavit, otestovat a odladit.",
      ],
      skills: HOME_ELECTRICAL_SKILLS,
    },
    software: {
      heading: "Programování a software",
      body: "Vytvářím softwarovou vrstvu mezi hardwarem a lidmi, kteří ho používají — dashboardy, nástroje a služby, které mění syrové signály na něco čitelného.",
      bullets: [
        "Dashboardy a nástroje, které dělají hardware čitelným.",
        "Čistá rozhraní mezi firmwarem a okolním světem.",
        "Kód psaný tak, aby se dal číst i za půl roku.",
      ],
      skills: HOME_SOFTWARE_SKILLS,
    },
    contact: {
      ctaHeadingLine1: "Máte nápad na projekt?",
      ctaHeadingLine2: "Pojďme ho společně vytvořit.",
      ctaSubtitle: "Ať už jde o celý produkt nebo jen jednu desku, rád se o něm dozvím víc.",
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
      orcid: "ORCID",
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
      back: "Zpět",
      summary:
        "Jsem student, který vytvoří projekt od papíru s tužkou, přes výrobu mechanických a elektrických součástí, po hotový produkt.",
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
          org: "EcoWheel s.r.o.",
          role: "Elektromechanik",
          period: "2024 — nyní",
          bullets: [
            "Diagnostika a ověření avizované poruchy, nárvh nejméně nákladného řešení",
            "Provedení opravy a ověření její úšspěšnosti",
            "Zpracování dokumentace o provedené opravě a výpis použitých náhradních dílů.",
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
        { category: "Strojní", items: RESUME_MECHANICAL_SKILLS },
        { category: "Elektro", items: RESUME_ELECTRICAL_SKILLS },
        { category: "Software", items: RESUME_SOFTWARE_SKILLS },
      ],
      certifications: {
        title: "Certifikace",
        entries: [
          {
            name: "Základy hybridních a bateriových elektrických vozidel",
            issuer: "Denso",
            year: "2026",
            file: "/certificates/hybrid.pdf",
          },
          {
            name: "3D tisk a modelování pro začátečníky (MK3S+)",
            issuer: "Prusa Research a.s.",
            year: "2023",
            file: "/certificates/prusa.pdf",
          },
        ],
      },
    },
    projects: {
      heading: "Podívejte se na projekty, na kterých jsem pracoval",
      body: "Kombinace strojních, elektro a softwarových projektů, které jsem vytvořil — filtrujte podle typu.",
      filterAll: "Vše",
      tags: {
        website: "Web",
        mobileApp: "Mobilní aplikace",
        controlSystem: "Řídicí systém",
        firmware: "Firmware",
        hardware: "Hardware",
      },
      status: {
        finished: "Dokončeno",
        workingOn: "Pracuji na tom",
        planned: "V plánu",
      },
      viewProject: "Zobrazit projekt",
      back: "Zpět na projekty",
      liveLink: "Živý odkaz",
      galleryHeading: "Galerie",
      filesHeading: "Soubory",
      items: [
        {
          slug: "robotics-dashboard",
          name: "Dashboard Placeholder Robotics",
          year: "2025",
          status: "workingOn",
          description:
            "Webový dashboard pro sledování a ovládání mobilní robotické platformy v reálném čase — telemetrie, manuální zásahy a logování testovacích jízd.",
          content: [
            { type: "text", text: LOREM[0] },
            { type: "textImage", text: LOREM[1], image: PH[0], imagePosition: "left", imageWidth: 50 },
          ],
          tags: ["website", "controlSystem"],
          url: "#",
          images: [PH[0], PH[1], PH[2]],
          files: [],
        },
        {
          slug: "sensor-interconnect",
          name: "Firmware propojovací desky senzorů",
          year: "2024",
          status: "finished",
          description:
            "Vestavěný firmware pro řízení motorů a telemetrii senzorů na propojovací desce s ARM procesorem.",
          content: [
            { type: "text", text: LOREM[1] },
            { type: "textImage", text: LOREM[2], image: PH[1], imagePosition: "right", imageWidth: 38 },
            { type: "text", text: LOREM[3] },
          ],
          tags: ["firmware", "hardware"],
          url: "#",
          images: [PH[1], PH[2]],
          files: [],
        },
        {
          slug: "field-instrumentation",
          name: "Sada přístrojového vybavení pro terén",
          year: "2023",
          status: "finished",
          description:
            "Projekt desky plošných spojů, od schématu po kryt, s doprovodnou mobilní aplikací pro čtení dat v terénu.",
          content: [
            { type: "images", images: [PH[2], PH[3], PH[4]], height: "16rem" },
            { type: "text", text: LOREM[0] },
            { type: "textImage", text: LOREM[2], image: PH[0], imagePosition: "left", imageWidth: 38 },
          ],
          tags: ["hardware", "mobileApp"],
          url: "#",
          images: [PH[2], PH[3], PH[4]],
          files: [],
        },
        {
          slug: "test-rig-control",
          name: "Řídicí panel zkušebního stendu",
          year: "2023",
          status: "finished",
          description:
            "Uzavřená regulační smyčka pro zkušební stend s dotykovým panelem pro nastavení profilů běhu a sledování živých grafů senzorů.",
          content: [
            { type: "text", text: LOREM[3] },
            { type: "textImage", text: LOREM[0], image: PH[3], imagePosition: "right", imageWidth: 50 },
          ],
          tags: ["controlSystem", "hardware"],
          url: "#",
          images: [PH[3], PH[0]],
          files: [],
        },
        {
          slug: "fleet-tracking-app",
          name: "Aplikace pro sledování flotily",
          year: "2022",
          status: "planned",
          description:
            "Multiplatformní mobilní aplikace pro sledování polohy, stavu baterie a údržby malé flotily zařízení.",
          content: [
            { type: "text", text: LOREM[2] },
            { type: "images", images: [PH[4]], height: "24rem" },
          ],
          tags: ["mobileApp"],
          url: "#",
          images: [PH[4]],
          files: [],
        },
        {
          slug: "portfolio-site",
          name: "Portfolio web a případové studie",
          year: "2022",
          status: "workingOn",
          description: "Tento web — portfolio v Next.js s generativním pozadím propojujícím tři obory dohromady.",
          content: [
            { type: "textImage", text: LOREM[1], image: PH[1], imagePosition: "left", imageWidth: 50 },
            { type: "text", text: LOREM[3] },
          ],
          tags: ["website"],
          url: "#",
          images: [PH[1], PH[4]],
          files: [],
        },
        {
          slug: "motor-driver-firmware",
          name: "Firmware řízení motoru",
          year: "2021",
          status: "finished",
          description:
            "Nízkoúrovňový firmware pro řízení bezkartáčového motoru — snímání proudu, komutace a sériová telemetrie.",
          content: [
            { type: "text", text: LOREM[0] },
            { type: "textImage", text: LOREM[3], image: PH[2], imagePosition: "right", imageWidth: 38 },
            { type: "images", images: [PH[0], PH[1]], height: "18rem" },
          ],
          tags: ["firmware"],
          url: "#",
          images: [PH[2], PH[0]],
          files: [],
        },
        {
          slug: "greenhouse-controller",
          name: "Regulátor klimatu ve skleníku",
          year: "2021",
          status: "planned",
          description:
            "Samostatný regulátor teploty, vlhkosti a zavlažování pro menší skleník s lokálním dashboardem.",
          content: [
            { type: "textImage", text: LOREM[2], image: PH[4], imagePosition: "left", imageWidth: 50 },
            { type: "text", text: LOREM[1] },
            { type: "images", images: [PH[3]], height: "20rem" },
          ],
          tags: ["controlSystem", "firmware"],
          url: "#",
          images: [PH[4], PH[3]],
          files: [],
        },
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

export type ProjectStatus = "finished" | "workingOn" | "planned";

/** Body content for a project page is a list of blocks instead of one long
 * string, so image placement (none / beside text / standalone row) can vary
 * block by block instead of being fixed for the whole page. */
export type ProjectBlock =
  | { type: "text"; text: string }
  | {
      type: "textImage";
      text: string;
      image: string;
      imagePosition: "left" | "right";
      /** Image's share of the row, as a percentage (1-99) — text takes the
       * rest. Fully customizable per block, not limited to fixed presets. */
      imageWidth: number;
    }
  | { type: "images"; images: readonly string[]; height: string };

export interface ProjectItem {
  slug: string;
  name: string;
  year: string;
  status: ProjectStatus;
  description: string;
  content: readonly ProjectBlock[];
  tags: readonly string[];
  url: string;
  images: readonly string[];
  files: readonly { name: string; href: string }[];
}

export function findProject(lang: Lang, slug: string): ProjectItem | undefined {
  return dictionary[lang].projects.items.find((item) => item.slug === slug);
}
