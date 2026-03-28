"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { calculateChainScore } from "@/data/chainData";
import ChainBreakAnimation from "@/components/ChainBreakAnimation";
import KiteAnimation from "@/components/KiteAnimation";

function Reflections({ reflections }: { reflections: string[] }) {
  if (!reflections.length) return null;
  return (
    <div className="mt-10 max-w-xl mx-auto">
      <p className="text-xs uppercase tracking-widest mb-4 text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
        Your 6 reflections
      </p>
      <div className="flex flex-col gap-3">
        {reflections.map((r, i) => (
          <div key={i}
            className="px-4 py-3 rounded-xl text-sm italic leading-relaxed"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="not-italic text-xs font-semibold mr-2 opacity-50">{i + 1}.</span>
            &ldquo;{r}&rdquo;
          </div>
        ))}
      </div>
    </div>
  );
}

function CrisisAndChautari() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto w-full">
      <a
        href="tel:16600102005"
        className="flex-1 py-3 rounded-xl text-center text-sm font-semibold transition hover:opacity-90"
        style={{ background: "rgba(217,119,6,0.18)", color: "#fbbf24", border: "1px solid rgba(217,119,6,0.35)" }}
      >
        Talk to someone now
      </a>
      <Link
        href="/chautari"
        className="flex-1 py-3 rounded-xl text-center text-sm font-semibold transition hover:opacity-90"
        style={{ background: "rgba(255,255,255,0.06)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        Enter Chautari
      </Link>
    </div>
  );
}

function ChainBrokenResult({ totalScore, maxScore, reflections }: { totalScore: number; maxScore: number; reflections: string[] }) {
  return (
    <div className="min-h-screen relative overflow-hidden px-4 py-10 text-center"
      style={{ background: "#0a0a14" }}>
      <ChainBreakAnimation totalScore={totalScore} maxScore={maxScore} />
      <CrisisAndChautari />
      <Reflections reflections={reflections} />
    </div>
  );
}

function ChainBendingResult({ totalScore, maxScore, reflections }: { totalScore: number; maxScore: number; reflections: string[] }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-16"
      style={{ background: "linear-gradient(160deg, #451a03 0%, #78350f 50%, #451a03 100%)" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl w-full text-center"
      >
        {/* Partial chain glow */}
        <div className="flex justify-center gap-1 mb-8">
          {Array.from({ length: 6 }).map((_, i) => {
            const isGold = i < Math.round((totalScore / maxScore) * 6);
            return (
              <svg key={i} width="36" height="28" viewBox="0 0 36 28">
                <rect x="4" y="4" width="28" height="20" rx="10"
                  fill="none"
                  stroke={isGold ? "#f6c90e" : "#4a5568"}
                  strokeWidth="5"
                  style={{ filter: isGold ? "drop-shadow(0 0 5px #f6c90e)" : "none" }}
                />
                <rect x="10" y="10" width="16" height="8" rx="4"
                  fill={isGold ? "#f6c90e" : "#4a5568"}
                />
              </svg>
            );
          })}
        </div>

        <h1 className="ne text-3xl font-bold mb-3" style={{ color: "#fcd34d" }}>
          श्रृंखला झुकिरहेको छ।
        </h1>
        <h2 className="text-xl font-semibold mb-6" style={{ color: "#fbbf24" }}>
          The chain is bending.
        </h2>

        <p className="text-amber-100 leading-relaxed mb-4 text-base">
          Awareness is the first break. You are already doing something your parents may never
          have had the chance to do.
        </p>

        <div className="text-sm mb-8" style={{ color: "rgba(253,243,236,0.45)" }}>
          Your awareness score: {totalScore}/{maxScore}
        </div>

        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <a
            href="tel:16600102005"
            className="block w-full py-3 rounded-xl text-center font-semibold transition hover:opacity-90"
            style={{ background: "#d97706", color: "#fff" }}
          >
            Keep going — Talk to a therapist
          </a>
          <Link
            href="/chautari"
            className="block w-full py-3 rounded-xl text-center font-semibold transition hover:opacity-90"
            style={{ background: "rgba(253,243,236,0.08)", color: "#fcd34d", border: "1px solid rgba(253,243,236,0.2)" }}
          >
            Enter Chautari
          </Link>
        </div>
      </motion.div>

      <Reflections reflections={reflections} />
    </div>
  );
}

function ChainHoldingResult({ totalScore, maxScore, reflections }: { totalScore: number; maxScore: number; reflections: string[] }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-16"
      style={{ background: "#0f1929" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl w-full text-center"
      >
        <div className="flex justify-center mb-8">
          <KiteAnimation size={60} animate={false} />
        </div>

        <h1 className="ne text-3xl font-bold mb-3" style={{ color: "#e2e8f0" }}>
          यो भार गाह्रो छ।
        </h1>
        <h2 className="text-xl font-semibold mb-6" style={{ color: "#94a3b8" }}>
          This weight is heavy.
        </h2>

        <p className="text-slate-300 leading-relaxed mb-4 text-base">
          Recognising it is not weakness. It is the beginning.
          You don&apos;t have to carry this alone or figure it out by yourself.
        </p>

        <div className="text-sm mb-8" style={{ color: "rgba(148,163,184,0.5)" }}>
          Your awareness score: {totalScore}/{maxScore}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto w-full">
          <a
            href="tel:16600102005"
            className="flex-1 py-3 rounded-xl text-center font-semibold transition hover:opacity-90"
            style={{ background: "#d97706", color: "#fff" }}
          >
            Talk to a professional
          </a>
          <Link
            href="/chautari"
            className="flex-1 py-3 rounded-xl text-center font-semibold transition hover:opacity-90"
            style={{ background: "rgba(255,255,255,0.07)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            Enter Chautari
          </Link>
        </div>
      </motion.div>

      <Reflections reflections={reflections} />
    </div>
  );
}

function ResultContent() {
  const params = useSearchParams();
  const caRaw = params.get("ca") ?? "";

  let chainAnswers: Record<string, string> = {};
  try {
    chainAnswers = JSON.parse(atob(decodeURIComponent(caRaw)));
  } catch {
    // invalid
  }

  const { totalScore, maxScore, percentage, result, reflections } = calculateChainScore(chainAnswers);

  if (result === "chain_broken") {
    return <ChainBrokenResult totalScore={totalScore} maxScore={maxScore} reflections={reflections} />;
  }
  if (result === "chain_bending") {
    return <ChainBendingResult totalScore={totalScore} maxScore={maxScore} reflections={reflections} />;
  }
  return <ChainHoldingResult totalScore={totalScore} maxScore={maxScore} reflections={reflections} />;
}

export default function BreakTheChainResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a14" }}>
        <div className="w-10 h-10 rounded-full border-4 animate-spin"
          style={{ borderColor: "#d97706", borderTopColor: "transparent" }} />
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
