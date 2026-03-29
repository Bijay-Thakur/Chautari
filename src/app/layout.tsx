import type { Metadata } from "next";
import { Fraunces, Noto_Sans_Devanagari, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import CrisisBar from "@/components/CrisisBar";
import SiteLogo from "@/components/SiteLogo";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const notoNepali = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nepali",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chautari",
  description:
    "A culturally grounded safe space. Rest in the Chautari room, or come sit with yourself and explore with care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = `${fraunces.variable} ${sourceSans.variable} ${notoNepali.variable}`;

  return (
    <html lang="ne" className={fontVars} style={{ background: "var(--bg-root)" }}>
      <body className="antialiased grain font-sans text-[var(--text-primary)]" style={{ background: "var(--bg-root)" }}>
        <SiteLogo />
        <main className="pb-12">
          {children}
        </main>
        <CrisisBar />
      </body>
    </html>
  );
}
