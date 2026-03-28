"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { calculateChainScore } from "@/data/chainData";
import ChainBreakAnimation from "@/components/ChainBreakAnimation";
import KiteAnimation from "@/components/KiteAnimation";

const fade = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as number[] },
};

function Reflections({ reflections }: { reflections: string[] }) {
  if (!reflections.length) return null;
  return (
    <div className="mt-10 max-w-lg mx-auto px-4">
      <p
        className="text-[10px] uppercase tracking-widest mb-4 text-center"
        style={{ color: "rgba(212,196,176,0.3)" }}
      >
        Your reflections
      </p>
      <div className="flex flex-col gap-2.5">
        {reflections.map((r, i) => (
          <div
            key={i}
            className="px-4 py-3.5 rounded-xl text-sm italic leading-relaxed"
            style={{
              background: "rgba(255,255,255,0.03)",
              color: "rgba(212,196,176,0.6)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <span className="not-italic text-[10px] font-semibold mr-2" style={{ color: "rgba(196,163,90,0.45)" }}>
              {i + 1}.
            </span>
            &ldquo;{r}&rdquo;
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionRow() {
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xs mx-auto w-full px-4">
      <a
        href="tel:16600102005"
        className="flex-1 py-3 rounded-xl text-center text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer"
        style={{
          background: "linear-gradient(180deg, #b8923d 0%, #9a7b3c 100%)",
          color: "#fdf8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
      >
        Talk to someone now
      </a>
      <Link
        href="/chautari"
        className="flex-1 py-3 rounded-xl text-center text-sm font-semibold transition-all duration-200 hover:bg-white/[0.07] active:scale-[0.98] cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.04)",
          color: "rgba(212,196,176,0.65)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        Enter Chautari
      </Link>
    </div>
  );
}

function Atmosphere({ tint }: { tint: string }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div
        style={{
          position: "absolute", top: "-20%", left: "20%",
          width: "65%", height: "75%",
          background: `radial-gradient(ellipse, ${tint} 0%, transparent 65%)`,
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}

function ChainBrokenResult({ totalScore, maxScore, reflections }: { totalScore: number; maxScore: number; reflections: string[] }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden px-4 py-10 text-center"
      style={{ background: "#0a0807" }}
    >
      <Atmosphere tint="rgba(100,140,110,0.18)" />
      <div className="relative z-10">
        <ChainBreakAnimation totalScore={totalScore} maxScore={maxScore} />
        <ActionRow />
        <Reflections reflections={reflections} />
      </div>
    </div>
  );
}

function ChainBendingResult({ totalScore, maxScore, reflections }: { totalScore: number; maxScore: number; reflections: string[] }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-5 py-16 relative"
      style={{ background: "#0a0807" }}
    >
      <Atmosphere tint="rgba(168,120,50,0.18)" />
      <motion.div
        initial={fade.initial}
        animate={fade.animate}
        transition={fade.transition}
        className="max-w-md w-full text-center relative z-10 flex flex-col items-center gap-5"
      >
        <div className="flex justify-center gap-1 mb-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const isGold = i < Math.round((totalScore / maxScore) * 6);
            return (
              <svg key={i} width="34" height="26" viewBox="0 0 34 26">
                <rect
                  x="3" y="3" width="28" height="20" rx="10"
                  fill="none"
                  stroke={isGold ? "#c4a35a" : "#3d3630"}
                  strokeWidth="5"
                  style={{ transition: "stroke 0.4s" }}
                />
                <rect
                  x="9" y="9" width="16" height="8" rx="4"
                  fill={isGold ? "#9a7b3c" : "#3d3630"}
                />
              </svg>
            );
          })}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-4" style={{ color: "rgba(196,163,90,0.5)" }}>
            Your reflection
          </p>
          <h1
            className="font-display mb-2"
            style={{ fontSize: "clamp(1.9rem, 6vw, 2.4rem)", letterSpacing: "-0.03em", color: "#d8c28a" }}
          >
            The chain is bending.
          </h1>
          <p className="text-sm leading-relaxed mb-2" style={{ color: "rgba(215,192,140,0.55)" }}>
            Awareness is the first break. You are already doing something your parents may never have had the
            chance to do.
          </p>
          <p className="text-xs" style={{ color: "rgba(212,196,176,0.22)" }}>
            Awareness score: {totalScore}/{maxScore}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a
            href="tel:16600102005"
            className="block w-full py-3.5 rounded-xl text-center font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer"
            style={{
              background: "linear-gradient(180deg, #b8923d 0%, #9a7b3c 100%)",
              color: "#fdf8f0",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            Keep going — Talk to a therapist
          </a>
          <Link
            href="/chautari"
            className="block w-full py-3 rounded-xl text-center font-semibold text-sm transition-all duration-200 hover:bg-white/[0.07] active:scale-[0.98] cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(212,196,176,0.65)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            Enter Chautari
          </Link>
        </div>
      </motion.div>

      <div className="relative z-10 w-full">
        <Reflections reflections={reflections} />
      </div>
    </div>
  );
}

function ChainHoldingResult({ totalScore, maxScore, reflections }: { totalScore: number; maxScore: number; reflections: string[] }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-5 py-16 relative"
      style={{ background: "#0a0807" }}
    >
      <Atmosphere tint="rgba(90,110,140,0.15)" />
      <motion.div
        initial={fade.initial}
        animate={fade.animate}
        transition={fade.transition}
        className="max-w-md w-full text-center relative z-10 flex flex-col items-center gap-5"
      >
        <div className="mb-2">
          <KiteAnimation size={60} animate={false} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-4" style={{ color: "rgba(196,163,90,0.5)" }}>
            Your reflection
          </p>
          <h1
            className="font-display mb-2"
            style={{ fontSize: "clamp(1.9rem, 6vw, 2.4rem)", letterSpacing: "-0.03em", color: "#e0d8cc" }}
          >
            This weight is heavy.
          </h1>
          <p className="text-sm leading-relaxed mb-2" style={{ color: "rgba(212,196,176,0.5)" }}>
            Recognising it is not weakness. It is the beginning. You don&apos;t have to carry this alone or figure
            it out by yourself.
          </p>
          <p className="text-xs" style={{ color: "rgba(212,196,176,0.22)" }}>
            Awareness score: {totalScore}/{maxScore}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <a
            href="tel:16600102005"
            className="flex-1 py-3 rounded-xl text-center font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer"
            style={{
              background: "linear-gradient(180deg, #b8923d 0%, #9a7b3c 100%)",
              color: "#fdf8f0",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            Talk to a professional
          </a>
          <Link
            href="/chautari"
            className="flex-1 py-3 rounded-xl text-center font-semibold text-sm transition-all duration-200 hover:bg-white/[0.07] active:scale-[0.98] cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(212,196,176,0.65)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            Enter Chautari
          </Link>
        </div>
      </motion.div>

      <div className="relative z-10 w-full">
        <Reflections reflections={reflections} />
      </div>
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

  const { totalScore, maxScore, result, reflections } = calculateChainScore(chainAnswers);

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
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#0a0807" }}
        >
          <div
            className="w-10 h-10 rounded-full border-[2.5px] animate-spin"
            style={{
              borderColor: "rgba(196,163,90,0.25)",
              borderTopColor: "rgba(196,163,90,0.9)",
            }}
          />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
