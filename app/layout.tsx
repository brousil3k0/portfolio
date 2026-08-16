import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { SmoothScrollLinks } from "@/components/SmoothScrollLinks";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ondřej Brousil — Mechanical / Electrical / Software Engineer",
  description:
    "Portfolio of Ondřej Brousil — mechanical, electrical, and software engineer.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Reading the nonce middleware.ts minted for this request is what lets
  // Next detect it and apply it to the inline RSC-streaming scripts it
  // renders itself; it also opts this layout into per-request dynamic
  // rendering, which a fresh-nonce-per-request CSP requires anyway.
  await headers();

  return (
    <html lang="en" className={`${plexSans.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full bg-void font-body text-bone antialiased">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:bg-bone focus-visible:px-4 focus-visible:py-2 focus-visible:font-mono focus-visible:text-sm focus-visible:uppercase focus-visible:tracking-wide focus-visible:text-void focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
        >
          Skip to content
        </a>
        <SmoothScrollLinks />
        {children}
      </body>
    </html>
  );
}
