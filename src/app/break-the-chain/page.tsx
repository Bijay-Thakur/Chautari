"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense } from "react";
import { scenarioQuestions } from "@/data/chainData";
import ProgressChain from "@/components/ProgressChain";

// Twinkling stars background
function Stars() {
  const stars = useRef(
    Array.from({ length: 60 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 4,
      size: Math.random() > 0.8 ? 3 : 2,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.current.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            "--duration": `${s.duration}s`,
            "--delay": `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function BreakTheChainContent() {
  const router = useRouter();
  const params = useSearchParams();
  const screeningAnswersRaw = params.get("sa") ?? "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  const question = scenarioQuestions[currentIndex];

  // Scores for completed answers (for chain display)
  const completedScores = scenarioQuestions.map((q) => {
    const answerId = answers[q.id];
    if (!answerId) return null;
    return q.options.find((o) => o.id === answerId)?.score ?? null;
  });

  function handleSelect(id: string) {
    if (selectedId) return; // already selected
    setSelectedId(id);
    setShowReflection(true);
    setTimeout(() => setCanContinue(true), 2000);
  }

  function handleContinue() {
    if (!selectedId) return;
    const newAnswers = { ...answers, [question.id]: selectedId };
    setAnswers(newAnswers);

    if (currentIndex < scenarioQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedId(null);
      setShowReflection(false);
      setCanContinue(false);
    } else {
      // Done — go to result
      const ca = encodeURIComponent(btoa(JSON.stringify(newAnswers)));
      router.push(`/break-the-chain/result?sa=${screeningAnswersRaw}&ca=${ca}`);
    }
  }

  const selectedOption = question.options.find((o) => o.id === selectedId);

  return (
    <div className="min-h-screen relative px-4 py-10" style={{ background: "#0f172a" }}>
      <Stars />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Chain progress */}
        <div className="mb-6">
          <p className="text-center text-xs text-slate-400 mb-2 tracking-wider">
            Scenario {currentIndex + 1} of {scenarioQuestions.length}
          </p>
          <ProgressChain
            total={scenarioQuestions.length}
            completedScores={completedScores}
            currentIndex={currentIndex}
          />
        </div>

        {/* Scenario card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            {/* Scenario text */}
            <div className="mb-6 p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#d97706" }}>
                Imagine this situation:
              </p>
              <p className="text-base font-medium leading-relaxed mb-3 text-slate-100">
                {question.situation}
              </p>
              <p className="ne text-sm leading-relaxed text-slate-400">
                {question.situationNe}
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3 mb-4">
              {question.options.map((opt) => {
                const isSelected = selectedId === opt.id;
                const isLocked = !!selectedId;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    disabled={isLocked && !isSelected}
                    className="w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200"
                    style={{
                      background: isSelected
                        ? "rgba(217,119,6,0.22)"
                        : "rgba(255,255,255,0.04)",
                      borderColor: isSelected ? "#d97706" : "rgba(255,255,255,0.09)",
                      color: isSelected ? "#fef3c7" : "#cbd5e1",
                      opacity: isLocked && !isSelected ? 0.4 : 1,
                      cursor: isLocked ? "default" : "pointer",
                    }}
                  >
                    <span className="text-sm font-medium leading-snug">{opt.text}</span>
                    <span className="ne block text-xs mt-1" style={{ color: isSelected ? "#fcd34d" : "#64748b" }}>
                      {opt.textNe}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Reflection */}
            <AnimatePresence>
              {showReflection && selectedOption && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-4 px-5 py-4 rounded-xl"
                  style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.25)" }}
                >
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d97706" }}>
                    Reflection
                  </p>
                  <p className="text-sm italic leading-relaxed" style={{ color: "#fde68a" }}>
                    &ldquo;{selectedOption.reflection}&rdquo;
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue button */}
            <AnimatePresence>
              {canContinue && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <button
                    onClick={handleContinue}
                    className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "#d97706" }}
                  >
                    {currentIndex === scenarioQuestions.length - 1 ? "See my result →" : "Continue →"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BreakTheChainPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f172a" }}>
        <div className="w-10 h-10 rounded-full border-4 animate-spin"
          style={{ borderColor: "#d97706", borderTopColor: "transparent" }} />
      </div>
    }>
      <BreakTheChainContent />
    </Suspense>
  );
}
