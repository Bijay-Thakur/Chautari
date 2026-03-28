"use client";

import { ArrowUpRight, BookOpen, HeartHandshake, Microscope, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { MentalHealthBucket } from "@/data/comeSitConfig";
import {
  COME_SIT_RESEARCH_SECTIONS,
  sortSectionLinksForBucket,
  type CuratedResearchLink,
  type CuratedResearchSection,
} from "@/data/comeSitResearchCurated";

const SECTION_ICON: Record<string, typeof BookOpen> = {
  scholarly: Microscope,
  cases: BookOpen,
  lived: HeartHandshake,
};

/** Visual accent per section — warm, on-brand */
const SECTION_ACCENT: Record<
  string,
  { bar: string; glow: string; chip: string; hoverBorder: string }
> = {
  scholarly: {
    bar: "linear-gradient(90deg, rgba(255,200,140,0.95), rgba(200,150,90,0.4))",
    glow: "rgba(255, 190, 120, 0.35)",
    chip: "rgba(255, 210, 165, 0.85)",
    hoverBorder: "rgba(200, 140, 80, 0.55)",
  },
  cases: {
    bar: "linear-gradient(90deg, rgba(180, 220, 190, 0.85), rgba(100, 140, 110, 0.45))",
    glow: "rgba(140, 190, 155, 0.32)",
    chip: "rgba(195, 235, 210, 0.88)",
    hoverBorder: "rgba(90, 130, 100, 0.45)",
  },
  lived: {
    bar: "linear-gradient(90deg, rgba(255, 180, 175, 0.9), rgba(200, 120, 130, 0.45))",
    glow: "rgba(255, 170, 155, 0.3)",
    chip: "rgba(255, 205, 195, 0.88)",
    hoverBorder: "rgba(190, 110, 100, 0.48)",
  },
};

function splitLinkTitle(title: string): { source: string; headline: string } {
  const sep = " — ";
  const i = title.indexOf(sep);
  if (i === -1) return { source: "Resource", headline: title };
  return { source: title.slice(0, i).trim(), headline: title.slice(i + sep.length).trim() };
}

type Props = {
  highlightBucket?: MentalHealthBucket;
  compact?: boolean;
};

function listContainerVariants(compact: boolean) {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: compact ? 0.06 : 0.09, delayChildren: 0.06 },
    },
  };
}

const cardItem = (reduceMotion: boolean) => ({
  hidden: reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 22, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, damping: 24, stiffness: 320 },
  },
});

export default function CuratedResearchList({ highlightBucket, compact }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={compact ? "space-y-8" : "space-y-14"}>
      {COME_SIT_RESEARCH_SECTIONS.map((section, si) => (
        <ResearchSectionBlock
          key={section.id}
          section={section}
          bucket={highlightBucket}
          sectionIndex={si}
          compact={compact}
          reduceMotion={!!reduceMotion}
        />
      ))}
    </div>
  );
}

function ResearchSectionBlock({
  section,
  bucket,
  sectionIndex,
  compact,
  reduceMotion,
}: {
  section: CuratedResearchSection;
  bucket?: MentalHealthBucket;
  sectionIndex: number;
  compact?: boolean;
  reduceMotion: boolean;
}) {
  const Icon = SECTION_ICON[section.id] ?? BookOpen;
  const accent = SECTION_ACCENT[section.id] ?? SECTION_ACCENT.scholarly;
  const sorted =
    bucket != null
      ? sortSectionLinksForBucket(section.links, bucket)
      : section.links;

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: sectionIndex * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 ${compact ? "mb-4" : "mb-6"}`}>
        <div className="flex items-start gap-4">
          <motion.span
            className="shrink-0 inline-flex items-center justify-center rounded-2xl shadow-lg"
            style={{
              width: compact ? 48 : 56,
              height: compact ? 48 : 56,
              background: "linear-gradient(145deg, rgba(255, 210, 170, 0.4), rgba(170, 120, 70, 0.35))",
              border: "1px solid rgba(255, 230, 200, 0.35)",
              color: "rgba(35, 22, 14, 0.95)",
              boxShadow: `0 8px 28px rgba(0,0,0,0.35), 0 0 40px ${accent.glow}`,
            }}
            whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            <Icon className={compact ? "w-5 h-5" : "w-6 h-6"} strokeWidth={1.75} />
          </motion.span>
          <div>
            <h2
              className={`font-display font-semibold tracking-tight ${compact ? "text-lg" : "text-xl sm:text-2xl"}`}
              style={{ color: "#fff8ed" }}
            >
              {section.title}
            </h2>
            <p
              className={`mt-1.5 max-w-xl leading-relaxed ${compact ? "text-xs" : "text-sm"}`}
              style={{ color: "rgba(255, 220, 195, 0.72)" }}
            >
              {section.subtitle}
            </p>
          </div>
        </div>
        {!compact && (
          <p className="text-[0.65rem] uppercase tracking-[0.2em] shrink-0" style={{ color: "rgba(255, 190, 140, 0.45)" }}>
            {sorted.length} picks
          </p>
        )}
      </div>

      <motion.ul
        className={
          compact
            ? "grid grid-cols-1 gap-3"
            : "grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5"
        }
        variants={listContainerVariants(!!compact)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-20px" }}
      >
        {sorted.map((link) => (
          <motion.li key={link.href} variants={cardItem(reduceMotion)}>
            <ResourceCard
              link={link}
              accent={accent}
              resonates={bucket != null && link.relatedBuckets.includes(bucket)}
              compact={compact}
              reduceMotion={reduceMotion}
            />
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}

function ResourceCard({
  link,
  accent,
  resonates,
  compact,
  reduceMotion,
}: {
  link: CuratedResearchLink;
  accent: (typeof SECTION_ACCENT)["scholarly"];
  resonates: boolean;
  compact?: boolean;
  reduceMotion: boolean;
}) {
  const { source, headline } = splitLinkTitle(link.title);

  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block h-full rounded-[1.35rem] overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf6f0] focus-visible:ring-amber-600/45"
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -6,
              transition: { type: "spring", stiffness: 420, damping: 22 },
            }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      style={{
        transformOrigin: "50% 50%",
      }}
    >
      {!reduceMotion && (
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 group-hover:translate-x-full group-hover:opacity-100 transition-[transform,opacity] duration-700 ease-out z-[1]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255, 255, 252, 0.55) 50%, transparent 100%)",
          }}
          aria-hidden
        />
      )}

      <div
        className={`relative h-full flex flex-col ${compact ? "p-4 min-h-[7.5rem]" : "p-5 sm:p-6 min-h-[9.5rem]"}`}
        style={{
          background:
            "linear-gradient(165deg, rgba(255, 250, 244, 0.98) 0%, rgba(245, 232, 218, 0.97) 38%, rgba(232, 214, 195, 0.96) 100%)",
          border: resonates
            ? `1.5px solid ${accent.hoverBorder}`
            : "1.5px solid rgba(180, 145, 110, 0.35)",
          boxShadow: resonates
            ? `0 14px 36px rgba(80, 55, 40, 0.12), 0 0 0 1px rgba(255,255,255,0.65), 0 24px 48px ${accent.glow}`
            : "0 10px 28px rgba(70, 50, 38, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.85)",
        }}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] opacity-90 group-hover:opacity-100 transition-opacity"
          style={{ background: accent.bar }}
          aria-hidden
        />

        {resonates && (
          <div className="absolute top-3 right-3 z-[2] flex items-center gap-1">
            <span
              className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full ${compact ? "text-[0.58rem] px-2 py-0.5" : "text-[0.62rem] px-2.5 py-1"}`}
              style={{
                background: accent.chip,
                color: "rgba(40, 24, 14, 0.95)",
                border: "1px solid rgba(255, 235, 210, 0.35)",
                boxShadow: "0 4px 14px rgba(80, 50, 35, 0.12)",
              }}
            >
              <Sparkles className="w-3 h-3 shrink-0" strokeWidth={2.5} aria-hidden />
              For you
            </span>
          </div>
        )}

        <div className={`relative z-[2] flex flex-col flex-1 ${resonates ? "pr-16 sm:pr-20" : ""}`}>
          <span
            className={`font-semibold uppercase tracking-[0.12em] ${compact ? "text-[0.6rem]" : "text-[0.65rem]"}`}
            style={{ color: "rgba(130, 88, 55, 0.72)" }}
          >
            {source}
          </span>
          <span
            className={`font-display font-medium leading-snug mt-2 transition-colors group-hover:text-[#1f1410] ${compact ? "text-[0.95rem] sm:text-base" : "text-base sm:text-[1.05rem]"}`}
            style={{
              color: resonates ? "rgba(42, 28, 18, 0.96)" : "rgba(52, 36, 26, 0.92)",
            }}
          >
            {headline}
          </span>
        </div>

        <div
          className={`relative z-[2] mt-auto pt-4 flex items-center justify-between gap-3 border-t border-amber-900/[0.1]`}
        >
          <span
            className={`inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-300 ${compact ? "text-xs" : "text-sm"}`}
            style={{
              color: "rgba(95, 58, 28, 0.92)",
            }}
          >
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 group-hover:shadow-md"
              style={{
                background: "linear-gradient(135deg, rgba(255, 220, 175, 0.75), rgba(230, 175, 115, 0.55))",
                border: "1px solid rgba(180, 120, 60, 0.35)",
              }}
            >
              Learn more
              <ArrowUpRight
                className={`shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${compact ? "w-3.5 h-3.5" : "w-4 h-4"}`}
                aria-hidden
              />
            </span>
          </span>
          <span
            className="text-[0.65rem] uppercase tracking-wider shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline"
            style={{ color: "rgba(120, 85, 55, 0.45)" }}
          >
            Opens in new tab
          </span>
        </div>
      </div>
    </motion.a>
  );
}
