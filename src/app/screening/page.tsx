"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { screeningQuestions, categoryLabels } from "@/data/chainData";
import QuestionCard from "@/components/QuestionCard";

export default function ScreeningPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState(1);

  const question = screeningQuestions[currentIndex];
  const progress = (currentIndex / screeningQuestions.length) * 100;

  function handleSelect(id: string) {
    setSelectedId(id);
  }

  function handleNext() {
    if (!selectedId) return;
    const newAnswers = { ...answers, [question.id]: selectedId };
    setAnswers(newAnswers);

    if (currentIndex < screeningQuestions.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
      setSelectedId(answers[screeningQuestions[currentIndex + 1]?.id] ?? null);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        const encoded = encodeURIComponent(btoa(JSON.stringify(newAnswers)));
        router.push(`/screening/result?a=${encoded}`);
      }, 1400);
    }
  }

  function handleBack() {
    if (currentIndex === 0) {
      router.push("/");
      return;
    }
    setDirection(-1);
    setCurrentIndex(currentIndex - 1);
    setSelectedId(answers[screeningQuestions[currentIndex - 1].id] ?? null);
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: "#0a0807" }}
      >
        <div
          className="w-11 h-11 rounded-full border-[2.5px] animate-spin"
          style={{
            borderColor: "rgba(196,163,90,0.25)",
            borderTopColor: "rgba(196,163,90,0.9)",
          }}
        />
        <p
          className="text-sm font-medium tracking-wide"
          style={{ color: "rgba(212,196,176,0.5)" }}
        >
          Processing your responses with care…
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen px-4 py-8 warm-mesh-dark"
    >
      {/* Progress bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleBack}
            className="p-2 rounded-full transition-all duration-200 cursor-pointer active:scale-[0.96] hover:bg-white/[0.05]"
            style={{ color: "rgba(196,163,90,0.7)" }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div
            className="flex-1 h-[3px] rounded-full overflow-hidden"
            style={{ background: "rgba(196,163,90,0.1)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #9a7b3c 0%, #c4a35a 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
              initial={{ width: `${progress}%` }}
              animate={{ width: `${(currentIndex / screeningQuestions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span
            className="text-xs font-semibold tabular-nums"
            style={{ color: "rgba(196,163,90,0.6)", minWidth: "2.8rem", textAlign: "right" }}
          >
            {currentIndex + 1}/{screeningQuestions.length}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={`${currentIndex}-${direction}`}
            questionNumber={currentIndex + 1}
            totalQuestions={screeningQuestions.length}
            categoryLabel={categoryLabels[question.category]}
            text={question.text}
            options={question.options}
            selectedId={selectedId}
            onSelect={handleSelect}
            variant="screening"
          />
        </AnimatePresence>

        <AnimatePresence>
          {selectedId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 flex justify-end"
            >
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer"
                style={{
                  background: "linear-gradient(180deg, #b8923d 0%, #9a7b3c 100%)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
              >
                {currentIndex === screeningQuestions.length - 1 ? "See my result →" : "Next →"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
