import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plexSans.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full bg-void font-body text-bone antialiased">
        <SmoothScrollLinks />
        {children}
      </body>
    </html>
  );
}
