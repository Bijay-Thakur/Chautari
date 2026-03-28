"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { calculateScreeningScore, categoryLabels, ScreeningQuestion } from "@/data/chainData";

const fade = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as number[] },
};

function GlassCard({ children, accentColor }: { children: React.ReactNode; accentColor: string }) {
  return (
    <div
      className="w-full rounded-2xl px-7 py-6"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: `1px solid ${accentColor}`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {children}
    </div>
  );
}

function ActionButton({
  href,
  tel,
  primary,
  children,
}: {
  href?: string;
  tel?: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  const base =
    "block w-full py-3.5 rounded-xl text-center font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer";
  const style = primary
    ? {
        background: "linear-gradient(180deg, #b8923d 0%, #9a7b3c 100%)",
        color: "#fdf8f0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)",
      }
    : {
        background: "rgba(255,255,255,0.04)",
        color: "rgba(212,196,176,0.7)",
        border: "1px solid rgba(255,255,255,0.08)",
      };

  if (tel) {
    return (
      <a href={tel} className={base} style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href!} className={base} style={style}>
      {children}
    </Link>
  );
}

function Atmosphere({ tint }: { tint: string }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "20%",
          width: "65%",
          height: "75%",
          background: `radial-gradient(ellipse, ${tint} 0%, transparent 65%)`,
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}

function ScreeningResultContent() {
  const params = useSearchParams();
  const raw = params.get("a") ?? "";

  let answers: Record<string, string> = {};
  try {
    answers = JSON.parse(atob(decodeURIComponent(raw)));
  } catch {
    // invalid
  }

  const { score, result, dominantCategory } = calculateScreeningScore(answers);
  const nextUrl = `/break-the-chain?sa=${encodeURIComponent(raw)}`;

  if (result === "strong_signs") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-5 py-16"
        style={{ background: "#0a0807" }}
      >
        <Atmosphere tint="rgba(168,88,60,0.18)" />
        <motion.div
          initial={fade.initial}
          animate={fade.animate}
          transition={fade.transition}
          className="max-w-md w-full text-center relative z-10 flex flex-col gap-5"
        >
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] mb-5"
              style={{ color: "rgba(196,163,90,0.55)" }}
            >
              Your reflection
            </p>
            <h1
              className="font-display mb-2"
              style={{
                fontSize: "clamp(1.9rem, 6vw, 2.5rem)",
                letterSpacing: "-0.03em",
                color: "#e8d9b8",
              }}
            >
              You have been carrying a lot.
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(212,196,176,0.48)" }}>
              What you felt growing up was real. And it may have shaped more than you know.
              That is not your fault — but it can be changed.
            </p>
          </div>

          {dominantCategory && dominantCategory !== "general" && (
            <GlassCard accentColor="rgba(196,163,90,0.15)">
              <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "rgba(196,163,90,0.6)" }}>
                Strongest pattern
              </p>
              <p className="font-semibold text-sm" style={{ color: "rgba(232,217,184,0.85)" }}>
                {categoryLabels[dominantCategory as ScreeningQuestion["category"]] ?? dominantCategory}
              </p>
            </GlassCard>
          )}

          <p className="text-xs" style={{ color: "rgba(212,196,176,0.25)" }}>
            Score: {score}/10 — This is a reflection, not a diagnosis.
          </p>

          <div className="flex flex-col gap-3">
            <ActionButton href={nextUrl} primary>
              Are you ready to break the chain? →
            </ActionButton>
            <ActionButton tel="tel:16600102005">
              Talk to someone now — TPO Nepal
            </ActionButton>
          </div>
        </motion.div>
      </div>
    );
  }

  if (result === "moderate_signs") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-5 py-16"
        style={{ background: "#0a0807" }}
      >
        <Atmosphere tint="rgba(150,100,50,0.15)" />
        <motion.div
          initial={fade.initial}
          animate={fade.animate}
          transition={fade.transition}
          className="max-w-md w-full text-center relative z-10 flex flex-col gap-5"
        >
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] mb-5"
              style={{ color: "rgba(196,163,90,0.55)" }}
            >
              Your reflection
            </p>
            <h1
              className="font-display mb-2"
              style={{
                fontSize: "clamp(1.9rem, 6vw, 2.5rem)",
                letterSpacing: "-0.03em",
                color: "#e8d9b8",
              }}
            >
              Some patterns are showing.
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(212,196,176,0.48)" }}>
              Recognising these patterns takes courage. Awareness is the first step — and you are already here.
              That means something.
            </p>
          </div>

          <p className="text-xs" style={{ color: "rgba(212,196,176,0.25)" }}>
            Score: {score}/10 — This is a reflection, not a diagnosis.
          </p>

          <div className="flex flex-col gap-3">
            <ActionButton href={nextUrl} primary>
              Are you ready to break the chain? →
            </ActionButton>
            <ActionButton tel="tel:16600102005">
              Talk to someone now — TPO Nepal
            </ActionButton>
          </div>
        </motion.div>
      </div>
    );
  }

  // low_signs
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-16"
      style={{ background: "#0a0807" }}
    >
      <Atmosphere tint="rgba(78,118,100,0.15)" />
      <motion.div
        initial={fade.initial}
        animate={fade.animate}
        transition={fade.transition}
        className="max-w-md w-full text-center relative z-10 flex flex-col gap-5"
      >
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-5"
            style={{ color: "rgba(141,175,152,0.6)" }}
          >
            Your reflection
          </p>
          <h1
            className="font-display mb-2"
            style={{
              fontSize: "clamp(1.9rem, 6vw, 2.5rem)",
              letterSpacing: "-0.03em",
              color: "#c8ddd0",
            }}
          >
            You seem to be in a safer place.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(184,212,196,0.48)" }}>
            But if anything in these questions stirred something — trust that feeling. There is no wrong reason
            to explore this.
          </p>
        </div>

        <p className="text-xs" style={{ color: "rgba(184,212,196,0.25)" }}>
          Score: {score}/10 — This is a reflection, not a diagnosis.
        </p>

        <div className="flex flex-col gap-3">
          <ActionButton href={nextUrl} primary>
            Still want to try Break the Chain? →
          </ActionButton>
          <ActionButton href="/chautari">
            Enter Chautari — a space to rest
          </ActionButton>
        </div>
      </motion.div>
    </div>
  );
}

export default function ScreeningResultPage() {
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
      <ScreeningResultContent />
    </Suspense>
  );
}
