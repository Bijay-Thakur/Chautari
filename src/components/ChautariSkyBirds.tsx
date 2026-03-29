"use client";

import { motion } from "framer-motion";

/** Silhouette — color is either light (moonlit) or dark (depth) */
function BirdSVG({
  size = 28,
  opacity = 0.78,
  fill,
}: {
  size?: number;
  opacity?: number;
  fill: string;
}) {
  return (
    <svg width={size} height={size * 0.48} viewBox="0 0 60 29" fill="none" style={{ opacity, display: "block" }}>
      <path
        d="M30 15 Q21 3 6 8 Q15 13 22 17 Q26 13 30 15 Q34 13 38 17 Q45 13 54 8 Q39 3 30 15Z"
        fill={fill}
      />
    </svg>
  );
}

type SkyBirdConfig = {
  y: number;
  dur: number;
  delay: number;
  size: number;
  amp: number;
  dir: 1 | -1;
  light: boolean;
};

/** Deterministic flock — SSR-safe, no hydration drift */
function buildBirds(count: number): SkyBirdConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const y = 2 + ((i * 73 + 17) % 86);
    const dur = 12 + ((i * 29) % 26);
    const delay = ((i * 37) % 40) + ((i * 11) % 7) * 0.1;
    const size = 7 + ((i * 53 + 19) % 26);
    const amp = 1.2 + ((i * 41) % 28) / 10;
    const dir = (i * 5 + 2) % 2 === 0 ? (1 as const) : (-1 as const);
    const light = (i * 7 + 3) % 2 === 0;
    return { y, dur, delay, size, amp, dir, light };
  });
}

const BIRDS = buildBirds(72);

/**
 * Dense ambient flock for the Chautari kite room — white + black silhouettes,
 * bidirectional flight, behind kites (keep z-index under kite layer).
 */
export function ChautariSkyBirds() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden
    >
      {BIRDS.map((b, i) => {
        const fill = b.light ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.78)";
        const baseOpacity = b.light ? 0.4 + (b.size / 34) * 0.42 : 0.38 + (b.size / 34) * 0.42;
        const left = b.dir === 1 ? "-8%" : "104%";
        const xRange: [string, string] = b.dir === 1 ? ["0vw", "118vw"] : ["0vw", "-118vw"];

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${b.y}%`,
              left,
              filter: b.light
                ? "drop-shadow(0 0 2px rgba(255,255,255,0.35))"
                : "drop-shadow(0 0 3px rgba(180,205,255,0.35)) drop-shadow(0 0 1px rgba(0,0,0,0.9))",
            }}
            animate={{
              x: xRange,
              y: [
                "0px",
                `${-b.amp * 9}px`,
                "0px",
                `${b.amp * 5}px`,
                "0px",
                `${-b.amp * 7}px`,
                "0px",
              ],
            }}
            transition={{
              x: { duration: b.dur, delay: b.delay, repeat: Infinity, ease: "linear" },
              y: {
                duration: b.dur / 7,
                delay: b.delay,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <div style={{ transform: b.dir === -1 ? "scaleX(-1)" : undefined }}>
              <motion.div
                animate={{ scaleY: [1, 0.48, 1, 0.55, 1] }}
                transition={{
                  duration: 0.42 + (i % 5) * 0.07,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (i * 0.09) % 0.5,
                }}
                style={{ transformOrigin: "center 40%" }}
              >
                <BirdSVG size={b.size} opacity={baseOpacity} fill={fill} />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
