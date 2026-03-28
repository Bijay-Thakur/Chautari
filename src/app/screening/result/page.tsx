"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { calculateScreeningScore, categoryLabels, ScreeningQuestion } from "@/data/chainData";

function ScreeningResultContent() {
  const params = useSearchParams();
  const raw = params.get("a") ?? "";

  let answers: Record<string, string> = {};
  try {
    answers = JSON.parse(atob(decodeURIComponent(raw)));
  } catch {
    // invalid state — fall through with empty
  }

  const { score, result, dominantCategory } = calculateScreeningScore(answers);

  // Build next-page URL with screening answers carried forward
  const nextUrl = `/break-the-chain?sa=${encodeURIComponent(raw)}`;

  if (result === "strong_signs") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
        style={{ background: "#3d0c02" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl w-full text-center"
        >
          <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-6">
            Your reflection
          </p>

          <h1 className="ne text-3xl font-bold mb-3" style={{ color: "#fef3c7" }}>
            तपाईंले धेरै कुरा बोकिरहनुभएको छ।
          </h1>
          <h2 className="text-xl font-semibold mb-6" style={{ color: "#fcd34d" }}>
            You have been carrying a lot.
          </h2>

          <p className="text-amber-100 leading-relaxed mb-8 text-base">
            What you felt growing up was real. And it may have shaped more than you know.
            That is not your fault — but it can be changed.
          </p>

          {/* Category breakdown */}
          {dominantCategory && dominantCategory !== "general" && (
            <div className="mb-8 p-4 rounded-xl text-left"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(253,243,236,0.15)" }}>
              <p className="text-xs uppercase tracking-widest text-amber-400 mb-2">Strongest pattern</p>
              <p className="text-amber-100 font-medium">
                {categoryLabels[dominantCategory as ScreeningQuestion["category"]] ?? dominantCategory}
              </p>
            </div>
          )}

          <div className="text-sm mb-10" style={{ color: "rgba(253,243,236,0.45)" }}>
            Score: {score}/10 — This is a reflection, not a diagnosis.
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href={nextUrl}
              className="block w-full py-4 rounded-xl font-bold text-center transition-all hover:opacity-90"
              style={{ background: "#d97706", color: "#fff" }}
            >
              <span className="ne block text-base">के तपाईं श्रृंखला तोड्न तयार हुनुहुन्छ?</span>
              <span className="text-sm font-normal">Are you ready to see if you can break the chain?</span>
            </Link>
            <a
              href="tel:16600102005"
              className="block w-full py-3 rounded-xl font-semibold text-center transition-all hover:opacity-90"
              style={{ background: "rgba(253,243,236,0.1)", color: "#fcd34d", border: "1px solid rgba(253,243,236,0.2)" }}
            >
              <span className="ne block text-sm">अहिले कुरा गर्नुहोस्</span>
              <span className="text-xs font-normal">Talk to someone now — TPO Nepal</span>
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  if (result === "moderate_signs") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
        style={{ background: "#431407" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl w-full text-center"
        >
          <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-6">
            Your reflection
          </p>

          <h1 className="ne text-3xl font-bold mb-3" style={{ color: "#fef3c7" }}>
            केही ढाँचाहरू देखिन्छन्।
          </h1>
          <h2 className="text-xl font-semibold mb-6" style={{ color: "#fcd34d" }}>
            Some patterns are showing.
          </h2>

          <p className="text-amber-100 leading-relaxed mb-8 text-base">
            Recognising these patterns takes courage. Awareness is the first step —
            and you are already here. That means something.
          </p>

          <div className="text-sm mb-10" style={{ color: "rgba(253,243,236,0.45)" }}>
            Score: {score}/10 — This is a reflection, not a diagnosis.
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href={nextUrl}
              className="block w-full py-4 rounded-xl font-bold text-center transition-all hover:opacity-90"
              style={{ background: "#d97706", color: "#fff" }}
            >
              <span className="ne block text-base">के तपाईं श्रृंखला तोड्न तयार हुनुहुन्छ?</span>
              <span className="text-sm font-normal">Are you ready to see if you can break the chain?</span>
            </Link>
            <a
              href="tel:16600102005"
              className="block w-full py-3 rounded-xl font-semibold text-center transition-all hover:opacity-90"
              style={{ background: "rgba(253,243,236,0.1)", color: "#fcd34d", border: "1px solid rgba(253,243,236,0.2)" }}
            >
              <span className="ne block text-sm">अहिले कुरा गर्नुहोस्</span>
              <span className="text-xs font-normal">Talk to someone now — TPO Nepal</span>
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // low_signs
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "#0d2b1a" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl w-full text-center"
      >
        <p className="text-green-400 text-sm font-medium tracking-widest uppercase mb-6">
          Your reflection
        </p>

        <h1 className="ne text-3xl font-bold mb-3" style={{ color: "#d1fae5" }}>
          तपाईं सुरक्षित ठाउँमा देखिनुहुन्छ।
        </h1>
        <h2 className="text-xl font-semibold mb-6" style={{ color: "#6ee7b7" }}>
          You seem to be in a safer place.
        </h2>

        <p className="text-green-100 leading-relaxed mb-8 text-base">
          But if anything in these questions stirred something — trust that feeling.
          There is no wrong reason to explore this.
        </p>

        <div className="text-sm mb-10" style={{ color: "rgba(209,250,229,0.4)" }}>
          Score: {score}/10 — This is a reflection, not a diagnosis.
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href={nextUrl}
            className="block w-full py-4 rounded-xl font-bold text-center transition-all hover:opacity-90"
            style={{ background: "#16a34a", color: "#fff" }}
          >
            <span className="block text-base">Still want to try Break the Chain?</span>
            <span className="ne text-sm font-normal">श्रृंखला तोड्न प्रयास गर्नुहुन्छ?</span>
          </Link>
          <Link
            href="/chautari"
            className="block w-full py-3 rounded-xl font-semibold text-center transition-all hover:opacity-90"
            style={{ background: "rgba(209,250,229,0.08)", color: "#6ee7b7", border: "1px solid rgba(209,250,229,0.2)" }}
          >
            Enter Chautari — a space to rest
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function ScreeningResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#3d0c02" }}>
        <div className="w-10 h-10 rounded-full border-4 animate-spin"
          style={{ borderColor: "#d97706", borderTopColor: "transparent" }} />
      </div>
    }>
      <ScreeningResultContent />
    </Suspense>
  );
}
