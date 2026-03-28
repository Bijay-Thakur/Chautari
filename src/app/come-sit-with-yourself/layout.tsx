import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Come sit with yourself | Chautari",
  description:
    "Speak in your own words, explore themes with care, and find gentle next steps — educational only, not a diagnosis.",
};

export default function ComeSitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
