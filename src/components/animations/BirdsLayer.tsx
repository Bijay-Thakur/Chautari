"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ─── Configurable constants ────────────────────────────────────────────────
const BIRD_CONFIG = {
  DESKTOP_COUNT: 9,
  TABLET_COUNT: 5,
  MOBILE_COUNT: 3,
  SKY_TOP_PERCENT: 8,
  SKY_BOTTOM_PERCENT: 22,
  MIN_DURATION: 24,
  MAX_DURATION: 36,
  OPACITY_RANGE: [0.4, 0.7],
  FLAP_SPEED_RANGE: [0.6, 1.1],
} as const;

// ─── Bird shape ────────────────────────────────────────────────────────────
interface BirdDef {
  id: number;
  y: string;
  yWobble: number;
  duration: number;
  delay: number;
  scale: number;
  flapSpeed: number;
  opacity: number;
  wingspan: number;
}

// ─── Pre-defined flock ────────────────────────────────────────────────────
//   2 leaders  →  faster, higher, smaller stagger
//   3 cluster  →  close together in y, staggered delay ~40-80 px apart
//   4 trailers →  loose formation behind, lower in sky
const ALL_BIRDS: BirdDef[] = [
  // Leaders — large, early, fast
  { id: 1, y: "9%",  yWobble: 6,  duration: 14, delay: 0,   scale: 1.20, flapSpeed: 0.65, opacity: 0.92, wingspan: 38 },
  { id: 2, y: "11%", yWobble: 5,  duration: 15, delay: 0.8, scale: 1.10, flapSpeed: 0.70, opacity: 0.88, wingspan: 34 },
  // Cluster — close together, medium-large
  { id: 3, y: "14%", yWobble: 8,  duration: 16, delay: 2.2, scale: 1.15, flapSpeed: 0.62, opacity: 0.85, wingspan: 40 },
  { id: 4, y: "15%", yWobble: 7,  duration: 16, delay: 2.8, scale: 1.00, flapSpeed: 0.75, opacity: 0.82, wingspan: 32 },
  { id: 5, y: "13%", yWobble: 9,  duration: 17, delay: 3.4, scale: 1.10, flapSpeed: 0.68, opacity: 0.80, wingspan: 36 },
  // Trailers — still clearly visible
  { id: 6, y: "17%", yWobble: 10, duration: 18, delay: 4.5, scale: 0.95, flapSpeed: 0.82, opacity: 0.78, wingspan: 30 },
  { id: 7, y: "19%", yWobble: 8,  duration: 18, delay: 5.5, scale: 0.90, flapSpeed: 0.88, opacity: 0.76, wingspan: 30 },
  { id: 8, y: "20%", yWobble: 11, duration: 20, delay: 6.2, scale: 0.98, flapSpeed: 0.95, opacity: 0.75, wingspan: 32 },
  { id: 9, y: "22%", yWobble: 7,  duration: 19, delay: 7.0, scale: 0.92, flapSpeed: 1.00, opacity: 0.75, wingspan: 28 },
];

// ─── Keyframes injected once — scoped names, no global side-effects ────────
const KEYFRAME_CSS = `
@keyframes birdDrift {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(var(--y-wobble)); }
}
@keyframes flapLeft {
  0%,100% { transform: rotate(0deg); }
  50%     { transform: rotate(25deg); }
}
@keyframes flapRight {
  0%,100% { transform: rotate(0deg); }
  50%     { transform: rotate(-25deg); }
}
`;

// ─── Single bird ──────────────────────────────────────────────────────────
function Bird({ def }: { def: BirdDef }) {
  const driftDuration = +(def.duration * 0.4).toFixed(2);

  return (
    <motion.div
      style={{
        position: "absolute",
        top: def.y,
        left: 0,
        opacity: def.opacity,
        pointerEvents: "none",
        willChange: "transform",
      }}
      animate={{ x: ["-120px", "calc(100vw + 120px)"] }}
      transition={{
        duration: def.duration,
        delay: def.delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {/* vertical sine drift */}
      <div
        style={{
          transform: `scale(${def.scale})`,
          animation: `birdDrift ${driftDuration}s ease-in-out infinite`,
          animationDelay: `${(def.delay % driftDuration).toFixed(2)}s`,
          /* CSS custom property consumed by the keyframe */
          ["--y-wobble" as string]: `${def.yWobble}px`,
        }}
      >
        <svg
          viewBox="0 0 40 20"
          width={def.wingspan}
          height={def.wingspan * 0.5}
          overflow="visible"
          aria-hidden="true"
          focusable="false"
        >
          <g transform="translate(20,10)">
            {/* Left wing */}
            <path
              d="M 0 0 Q -10 -8 -20 -2"
              stroke="rgba(20,10,4,0.82)"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
              style={{
                transformOrigin: "0% 50%",
                ["--flap-speed" as string]: `${def.flapSpeed}s`,
                animation: "flapLeft var(--flap-speed) ease-in-out infinite",
              }}
            />
            {/* Right wing — 180° phase offset via negative delay */}
            <path
              d="M 0 0 Q 10 -8 20 -2"
              stroke="rgba(20,10,4,0.82)"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
              style={{
                transformOrigin: "0% 50%",
                ["--flap-speed" as string]: `${def.flapSpeed}s`,
                animation: "flapRight var(--flap-speed) ease-in-out infinite",
                animationDelay: `${-(def.flapSpeed / 2).toFixed(3)}s`,
              }}
            />
            {/* Body */}
            <circle r="2" fill="rgba(20,10,4,0.85)" />
          </g>
        </svg>
      </div>
    </motion.div>
  );
}

// ─── BirdsLayer ───────────────────────────────────────────────────────────
export default function BirdsLayer() {
  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  useEffect(() => {
    // Respect reduced-motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleCount(0);
      return;
    }

    function resolve() {
      const w = window.innerWidth;
      if (w < 640)  return BIRD_CONFIG.MOBILE_COUNT;
      if (w < 1024) return BIRD_CONFIG.TABLET_COUNT;
      return BIRD_CONFIG.DESKTOP_COUNT;
    }

    setVisibleCount(resolve());

    const handler = () => setVisibleCount(resolve());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Don't render on SSR or when reduced-motion is on
  if (!visibleCount) return null;

  const birds = ALL_BIRDS.slice(0, visibleCount);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAME_CSS }} />
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-[2]"
        aria-hidden="true"
      >
        {birds.map((def) => (
          <Bird key={def.id} def={def} />
        ))}
      </div>
    </>
  );
}
