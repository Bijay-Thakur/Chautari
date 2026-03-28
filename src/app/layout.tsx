import type { Metadata } from "next";
import "./globals.css";
import CrisisBar from "@/components/CrisisBar";

export const metadata: Metadata = {
  title: "साथी — Saathi | Break the Chain",
  description: "A culturally grounded safe space for Nepali youth. Understand generational trauma — and choose what you pass forward.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <main className="pb-16">
          {children}
        </main>
        <CrisisBar />
      </body>
    </html>
  );
}
