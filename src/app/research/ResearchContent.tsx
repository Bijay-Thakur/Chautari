"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CuratedResearchList from "@/components/come-sit/CuratedResearchList";
import type { MentalHealthBucket } from "@/data/comeSitConfig";
import { MENTAL_HEALTH_BUCKETS } from "@/data/comeSitConfig";

function topicFromParam(raw: string | null): MentalHealthBucket | undefined {
  if (!raw) return undefined;
  const t = raw.toLowerCase().trim();
  return (MENTAL_HEALTH_BUCKETS as string[]).includes(t) ? (t as MentalHealthBucket) : undefined;
}

export default function ResearchContent() {
  const params = useSearchParams();
  const highlight = topicFromParam(params.get("topic"));

  return (
    <div className="min-h-screen relative overflow-x-hidden pb-20" style={{ background: "#0a0807" }}>
      <div
        className="pointer-events-none fixed inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% -15%, rgba(180, 100, 70, 0.2), transparent 55%), radial-gradient(ellipse 70% 50% at 100% 80%, rgba(120, 90, 60, 0.12), transparent 50%)",
        }}
      />

      <header className="relative z-10 max-w-3xl mx-auto px-5 pt-8 pb-4">
        <Link
          href="/come-sit-with-yourself"
          className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-90"
          style={{ color: "rgba(255, 200, 150, 0.75)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Come sit with yourself
        </Link>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-5">
        <div className="mb-10">
          <p
            className="text-[0.65rem] uppercase tracking-[0.35em] mb-3"
            style={{ color: "rgba(255, 190, 140, 0.5)" }}
          >
            Research &amp; stories
          </p>
          <h1
            className="font-display text-[clamp(1.85rem,5vw,2.5rem)] leading-tight mb-4"
            style={{ color: "#fff5e8" }}
          >
            Depression, anxiety &amp; psychosis — curated links
          </h1>
          <div
            className="rounded-2xl p-5 sm:p-6 space-y-3"
            style={{
              background:
                "linear-gradient(165deg, rgba(255, 220, 190, 0.08) 0%, rgba(60, 44, 36, 0.45) 100%)",
              border: "1px solid rgba(255, 200, 160, 0.2)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255, 248, 235, 0.1)",
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255, 230, 210, 0.88)" }}>
              Below is a hand-picked mix of{" "}
              <strong style={{ color: "#fff8ec" }}>scholarly sources</strong>,{" "}
              <strong style={{ color: "#fff8ec" }}>clinical case literature</strong>, and{" "}
              <strong style={{ color: "#fff8ec" }}>lived-experience writing</strong>. Nothing here replaces
              a clinician; use it to learn and feel less alone.
            </p>
            {highlight ? (
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255, 200, 160, 0.75)" }}>
                Links that align with your <span className="font-semibold">{highlight}</span> reflection are
                marked and listed first in each section.
              </p>
            ) : (
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255, 200, 160, 0.65)" }}>
                Add <code className="text-[0.7rem] px-1 rounded bg-black/30">?topic=depression</code>,{" "}
                <code className="text-[0.7rem] px-1 rounded bg-black/30">anxiety</code>, or{" "}
                <code className="text-[0.7rem] px-1 rounded bg-black/30">psychosis</code> to highlight
                matching resources.
              </p>
            )}
          </div>
        </div>

        <CuratedResearchList highlightBucket={highlight} />

        <p
          className="mt-12 text-center text-xs leading-relaxed max-w-md mx-auto"
          style={{ color: "rgba(200, 175, 155, 0.55)" }}
        >
          External sites may change or move. If a link breaks, search by the article title. This page is for
          education only — not emergency or medical advice.
        </p>
      </main>
    </div>
  );
}
