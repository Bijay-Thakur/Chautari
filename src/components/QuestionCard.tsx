"use client";

import { motion } from "framer-motion";

type Option = {
  id: string;
  text: string;
  textNe?: string;
};

type QuestionCardProps = {
  questionNumber: number;
  totalQuestions: number;
  categoryLabel: string;
  text: string;
  textNe?: string;
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
  options,
  selectedId,
  onSelect,
  variant = "screening",
}: QuestionCardProps) {
  const isScenario = variant === "scenario";

  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-xs font-bold px-3.5 py-1.5 rounded-full tracking-wide"
          style={{
            background: "linear-gradient(180deg, #b8923d 0%, #9a7b3c 100%)",
            color: "#fdf8f0",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          {questionNumber} / {totalQuestions}
        </span>
        <span
          className="text-xs px-3.5 py-1.5 rounded-full font-semibold"
          style={{
            background: "rgba(154,123,60,0.1)",
            color: "rgba(196,163,90,0.8)",
            border: "1px solid rgba(154,123,60,0.2)",
          }}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Question text */}
      <div className="mb-6">
        {isScenario && (
          <p
            className="text-xs uppercase tracking-widest mb-2.5"
            style={{ color: "rgba(196,163,90,0.65)" }}
          >
            Imagine this situation:
          </p>
        )}
        <p
          className="text-[1.05rem] font-semibold leading-relaxed"
          style={{ color: "rgba(244,232,216,0.92)" }}
        >
          {text}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className="w-full text-left px-5 py-4 rounded-xl transition-all duration-200 border cursor-pointer active:scale-[0.985]"
              style={{
                background: isSelected
                  ? "rgba(196,163,90,0.12)"
                  : "rgba(255,255,255,0.03)",
                borderColor: isSelected
                  ? "rgba(196,163,90,0.45)"
                  : "rgba(255,255,255,0.08)",
                color: isSelected
                  ? "#f0e4d4"
                  : "rgba(212,196,176,0.82)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: isSelected
                  ? "inset 0 1px 0 rgba(255,255,255,0.06)"
                  : "none",
              }}
            >
              <span className="text-sm font-medium leading-snug">{opt.text}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
