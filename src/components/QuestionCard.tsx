"use client";

import { motion } from "framer-motion";

type Option = {
  id: string;
  text: string;
  textNe: string;
};

type QuestionCardProps = {
  questionNumber: number;
  totalQuestions: number;
  categoryLabel: string;
  text: string;
  textNe: string;
  options: Option[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  variant?: "screening" | "scenario";
};

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  categoryLabel,
  text,
  textNe,
  options,
  selectedId,
  onSelect,
  variant = "screening",
}: QuestionCardProps) {
  const isScenario = variant === "scenario";

  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header badges */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: "#d97706", color: "#fff" }}
        >
          {questionNumber} / {totalQuestions}
        </span>
        <span
          className="text-xs px-3 py-1 rounded-full"
          style={{ background: "rgba(217,119,6,0.18)", color: "#d97706", border: "1px solid rgba(217,119,6,0.35)" }}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Question text */}
      <div className="mb-6">
        {isScenario && (
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d97706" }}>
            Imagine this situation:
          </p>
        )}
        <p className="text-lg font-semibold leading-relaxed mb-2"
          style={{ color: isScenario ? "#e2e8f0" : "#3d1a00" }}>
          {text}
        </p>
        <p className="ne text-sm leading-relaxed"
          style={{ color: isScenario ? "#94a3b8" : "#6b4226" }}>
          {textNe}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className="w-full text-left px-5 py-4 rounded-xl transition-all duration-200 border-2"
              style={{
                background: isSelected
                  ? "rgba(217,119,6,0.25)"
                  : isScenario ? "rgba(255,255,255,0.05)" : "rgba(217,119,6,0.07)",
                borderColor: isSelected ? "#d97706" : isScenario ? "rgba(255,255,255,0.1)" : "rgba(217,119,6,0.2)",
                color: isScenario ? (isSelected ? "#fef3c7" : "#cbd5e1") : (isSelected ? "#92400e" : "#4b2800"),
              }}
            >
              <span className="text-sm font-medium leading-snug">{opt.text}</span>
              {opt.textNe && (
                <span className="ne block text-xs mt-1 opacity-70">{opt.textNe}</span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
