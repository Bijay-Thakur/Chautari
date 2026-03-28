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
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const question = screeningQuestions[currentIndex];
  const progress = ((currentIndex) / screeningQuestions.length) * 100;

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
      // Last question — go to result
      setIsLoading(true);
      setTimeout(() => {
        const encoded = encodeURIComponent(btoa(JSON.stringify(newAnswers)));
        router.push(`/screening/result?a=${encoded}`);
      }, 1500);
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
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ background: "#fdf6ec" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4"
          style={{ borderColor: "#d97706", borderTopColor: "transparent" }}
        />
        <p className="text-center text-lg font-medium" style={{ color: "#92400e" }}>
          Processing your responses with care...
        </p>
        <p className="ne text-sm" style={{ color: "#b45309" }}>
          तपाईंका उत्तरहरू सावधानीपूर्वक प्रशोधन गरिँदैछ...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "#fdf6ec" }}>
      {/* Progress bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-amber-100 transition-colors"
            style={{ color: "#92400e" }}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#e8d5b0" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#d97706" }}
              initial={{ width: `${progress}%` }}
              animate={{ width: `${((currentIndex) / screeningQuestions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: "#92400e", minWidth: "3rem", textAlign: "right" }}>
            {currentIndex + 1} / {screeningQuestions.length}
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
            textNe={question.textNe}
            options={question.options}
            selectedId={selectedId}
            onSelect={handleSelect}
            variant="screening"
          />
        </AnimatePresence>

        {/* Next button */}
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
                className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#d97706" }}
              >
                {currentIndex === screeningQuestions.length - 1 ? "See my result →" : "Next →"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
