"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KiteAnimation from "./KiteAnimation";

// Confetti kite piece
function ConfettiKite({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <motion.div
      initial={{ y: -60, x, opacity: 0, rotate: 0, scale: 0.5 }}
      animate={{ y: 700, opacity: [0, 1, 1, 0], rotate: 360, scale: 1 }}
      transition={{ duration: 2.5, delay, ease: "easeIn" }}
      style={{ position: "absolute", top: 0, left: "50%", pointerEvents: "none" }}
    >
      <svg width="16" height="20" viewBox="0 0 16 20" fill={color}>
        <path d="M8 0 L16 9 L8 18 L0 9 Z" />
      </svg>
    </motion.div>
  );
}

const confettiItems = Array.from({ length: 24 }).map((_, i) => ({
  delay: 1.8 + i * 0.08,
  x: (Math.random() - 0.5) * 600,
  color: ["#ef4444", "#f59e0b", "#16a34a", "#f6c90e", "#3b82f6", "#ec4899"][i % 6],
}));

// SVG chain — two halves that fly apart
function ChainSVG({ phase }: { phase: number }) {
  // phase 0: static iron
  // phase 1: shake
  // phase 2: gold glow links one by one
  // phase 3: snap (halves fly apart)
  const linkGold = (index: number) => phase >= 2 && index <= (phase - 2);

  const links = [0, 1, 2, 3, 4, 5];

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={phase === 1 ? { x: [-4, 4, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        style={{ display: "flex", alignItems: "center" }}
      >
        {/* Left half */}
        <motion.div
          animate={phase >= 3 ? { x: -300, opacity: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeIn" }}
          style={{ display: "flex" }}
        >
          {links.slice(0, 3).map((_, i) => (
            <svg key={i} width="44" height="32" viewBox="0 0 44 32">
              <rect x="4" y="4" width="36" height="24" rx="12"
                fill="none"
                stroke={linkGold(i) ? "#f6c90e" : "#4a5568"}
                strokeWidth="6"
                style={{ filter: linkGold(i) ? "drop-shadow(0 0 8px #f6c90e)" : "none", transition: "stroke 0.4s, filter 0.4s" }}
              />
              <rect x="12" y="12" width="20" height="8" rx="4"
                fill={linkGold(i) ? "#f6c90e" : "#4a5568"}
                style={{ transition: "fill 0.4s" }}
              />
            </svg>
          ))}
        </motion.div>

        {/* Right half */}
        <motion.div
          animate={phase >= 3 ? { x: 300, opacity: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeIn" }}
          style={{ display: "flex" }}
        >
          {links.slice(3).map((_, i) => (
            <svg key={i + 3} width="44" height="32" viewBox="0 0 44 32">
              <rect x="4" y="4" width="36" height="24" rx="12"
                fill="none"
                stroke={linkGold(i + 3) ? "#f6c90e" : "#4a5568"}
                strokeWidth="6"
                style={{ filter: linkGold(i + 3) ? "drop-shadow(0 0 8px #f6c90e)" : "none", transition: "stroke 0.4s, filter 0.4s" }}
              />
              <rect x="12" y="12" width="20" height="8" rx="4"
                fill={linkGold(i + 3) ? "#f6c90e" : "#4a5568"}
                style={{ transition: "fill 0.4s" }}
              />
            </svg>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ChainBreakAnimation({ totalScore, maxScore }: { totalScore: number; maxScore: number }) {
  const [phase, setPhase] = useState(0);
  const [showKite, setShowKite] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Phase sequence:
    // 0: static (0.5s)
    // 1: shake (0.5s)
    // 2-7: links light up one by one (0.3s each = 1.8s)
    // 8: snap (0.6s)
    // kite rises, text fades in, confetti

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase(1), 500));   // shake
    timers.push(setTimeout(() => setPhase(2), 1000));  // link 0 gold
    timers.push(setTimeout(() => setPhase(3), 1300));  // link 1
    timers.push(setTimeout(() => setPhase(4), 1600));  // link 2
    timers.push(setTimeout(() => setPhase(5), 1900));  // link 3
    timers.push(setTimeout(() => setPhase(6), 2200));  // link 4
    timers.push(setTimeout(() => setPhase(7), 2500));  // link 5
    timers.push(setTimeout(() => setPhase(8), 2800));  // snap!
    timers.push(setTimeout(() => setShowKite(true), 3200));
    timers.push(setTimeout(() => setShowText(true), 3800));
    timers.push(setTimeout(() => setShowConfetti(true), 3600));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] overflow-hidden">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && confettiItems.map((item, i) => (
          <ConfettiKite key={i} {...item} />
        ))}
      </AnimatePresence>

      {/* Chain animation — hide after snap */}
      {phase < 8 && (
        <div className="mb-8">
          <ChainSVG phase={phase} />
        </div>
      )}
      {phase >= 8 && !showKite && (
        <div className="mb-8 h-8" />
      )}

      {/* Kite rising */}
      <AnimatePresence>
        {showKite && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-6"
          >
            <KiteAnimation size={100} animate={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text */}
      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <p className="ne text-3xl font-bold mb-2" style={{ color: "#f6c90e" }}>
              तपाईंले श्रृंखला तोड्नुभयो।
            </p>
            <p className="text-xl font-semibold mb-4" style={{ color: "#fef3c7" }}>
              You broke the chain.
            </p>
            <p className="text-base max-w-md mx-auto leading-relaxed" style={{ color: "#d1d5db" }}>
              What was passed to you — stops here.
              <br />
              What you pass forward — is yours to choose.
            </p>
            <div className="mt-6 inline-block px-6 py-2 rounded-full text-sm font-semibold"
              style={{ background: "rgba(246,201,14,0.15)", border: "1px solid #f6c90e", color: "#f6c90e" }}>
              Your awareness score: {totalScore}/{maxScore}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
