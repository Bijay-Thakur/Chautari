"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense } from "react";
import { scenarioQuestions } from "@/data/chainData";
import ProgressChain from "@/components/ProgressChain";

function WarmDepth() {
  return (
    <div className="warm-ambient" aria-hidden>
      <div
        className="warm-ambient__blob"
        style={{
          width: "min(90vw, 480px)",
          height: "min(90vw, 480px)",
          top: "-12%", right: "-15%",
          background: "rgba(180, 95, 70, 0.2)",
        }}
      />
      <div
        className="warm-ambient__blob"
        style={{
          width: "min(70vw, 380px)",
          height: "min(70vw, 380px)",
          bottom: "5%", left: "-18%",
          background: "rgba(196, 163, 90, 0.11)",
        }}
      />
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

  const completedScores = scenarioQuestions.map((q) => {
    const answerId = answers[q.id];
    if (!answerId) return null;
    return q.options.find((o) => o.id === answerId)?.score ?? null;
  });

  function handleSelect(id: string) {
    if (selectedId) return;
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
      const ca = encodeURIComponent(btoa(JSON.stringify(newAnswers)));
      router.push(`/break-the-chain/result?sa=${screeningAnswersRaw}&ca=${ca}`);
    }
  }

  const selectedOption = question.options.find((o) => o.id === selectedId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen relative px-4 py-10 warm-mesh-dark overflow-hidden"
    >
      <WarmDepth />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Chain progress */}
        <div className="mb-6">
          <p
            className="text-center text-[10px] mb-2 tracking-widest uppercase"
            style={{ color: "rgba(212,196,176,0.35)" }}
          >
            Scenario {currentIndex + 1} of {scenarioQuestions.length}
          </p>
          <ProgressChain
            total={scenarioQuestions.length}
            completedScores={completedScores}
            currentIndex={currentIndex}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.32 }}
          >
            {/* Scenario card */}
            <div
              className="mb-5 p-5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(196,163,90,0.1)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-3"
                style={{ color: "rgba(196,163,90,0.65)" }}
              >
                Imagine this situation:
              </p>
              <p
                className="text-base font-medium leading-relaxed"
                style={{ color: "rgba(244,232,216,0.9)" }}
              >
                {question.situation}
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5 mb-4">
              {question.options.map((opt) => {
                const isSelected = selectedId === opt.id;
                const isLocked = !!selectedId;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    disabled={isLocked && !isSelected}
                    className="w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 active:scale-[0.985]"
                    style={{
                      background: isSelected
                        ? "rgba(196,163,90,0.12)"
                        : "rgba(255,255,255,0.03)",
                      borderColor: isSelected
                        ? "rgba(196,163,90,0.4)"
                        : "rgba(255,255,255,0.07)",
                      color: isSelected
                        ? "#f0e4d4"
                        : "rgba(212,196,176,0.82)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      opacity: isLocked && !isSelected ? 0.38 : 1,
                      cursor: isLocked ? "default" : "pointer",
                    }}
                  >
                    <span className="text-sm font-medium leading-snug">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Reflection */}
            <AnimatePresence>
              {showReflection && selectedOption && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="mb-4 px-5 py-4 rounded-xl"
                  style={{
                    background: "rgba(196,163,90,0.07)",
                    border: "1px solid rgba(196,163,90,0.18)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <p
                    className="text-[10px] uppercase tracking-widest mb-2"
                    style={{ color: "rgba(196,163,90,0.7)" }}
                  >
                    Reflection
                  </p>
                  <p className="text-sm italic leading-relaxed" style={{ color: "rgba(232,217,184,0.85)" }}>
                    &ldquo;{selectedOption.reflection}&rdquo;
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {canContinue && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <button
                    onClick={handleContinue}
                    className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer"
                    style={{
                      background: "linear-gradient(180deg, #b8923d 0%, #9a7b3c 100%)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)",
                    }}
                  >
                    {currentIndex === scenarioQuestions.length - 1
                      ? "See my result →"
                      : "Continue →"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function BreakTheChainPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center warm-mesh-dark">
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
      <BreakTheChainContent />
    </Suspense>
  );
}
