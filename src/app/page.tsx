"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Bird silhouette ────────────────────────────────────────────────── */
function BirdSVG({ size = 28, opacity = 0.78 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size * 0.48} viewBox="0 0 60 29" fill="none" style={{ opacity }}>
      <path
        d="M30 15 Q21 3 6 8 Q15 13 22 17 Q26 13 30 15 Q34 13 38 17 Q45 13 54 8 Q39 3 30 15Z"
        fill="rgba(22,14,8,0.88)"
      />
    </svg>
  );
}

/* ─── Bird flock — generous count, layered depths ────────────────────── */
const BIRDS = [
  /* near — larger, slower */
  { y: 9,  dur: 26, delay: 0,  size: 30, amp: 3.8, dir: 1 },
  { y: 12, dur: 30, delay: 7,  size: 24, amp: 3.0, dir: 1 },
  { y: 7,  dur: 22, delay: 14, size: 28, amp: 3.4, dir: 1 },
  /* mid flock */
  { y: 15, dur: 18, delay: 2,  size: 20, amp: 2.4, dir: 1 },
  { y: 10, dur: 24, delay: 9,  size: 18, amp: 2.2, dir: 1 },
  { y: 18, dur: 20, delay: 5,  size: 22, amp: 2.6, dir: 1 },
  { y: 6,  dur: 28, delay: 18, size: 16, amp: 2.0, dir: 1 },
  { y: 21, dur: 16, delay: 12, size: 19, amp: 2.1, dir: 1 },
  /* far — small, faster */
  { y: 8,  dur: 14, delay: 4,  size: 12, amp: 1.6, dir: 1 },
  { y: 14, dur: 12, delay: 10, size: 10, amp: 1.4, dir: 1 },
  { y: 5,  dur: 16, delay: 22, size: 11, amp: 1.5, dir: 1 },
  { y: 20, dur: 10, delay: 6,  size: 9,  amp: 1.3, dir: 1 },
  /* scattered singles */
  { y: 11, dur: 19, delay: 17, size: 14, amp: 1.8, dir: 1 },
  { y: 16, dur: 23, delay: 3,  size: 13, amp: 1.7, dir: 1 },
  { y: 3,  dur: 21, delay: 13, size: 15, amp: 1.9, dir: 1 },
  { y: 22, dur: 15, delay: 20, size: 17, amp: 2.0, dir: 1 },
  { y: 4,  dur: 27, delay: 8,  size: 21, amp: 2.5, dir: 1 },
  { y: 19, dur: 11, delay: 25, size: 8,  amp: 1.2, dir: 1 },
  { y: 13, dur: 13, delay: 1,  size: 16, amp: 1.8, dir: 1 },
  { y: 8,  dur: 17, delay: 30, size: 12, amp: 1.6, dir: 1 },
];

function AnimatedBirds() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
      {BIRDS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${b.y}%`, left: "-6%" }}
          animate={{
            x: ["0vw", "112vw"],
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
          {/* Wing-flap via scaleY on the SVG wrapper */}
          <motion.div
            animate={{ scaleY: [1, 0.5, 1, 0.58, 1] }}
            transition={{
              duration: 0.48 + (i % 4) * 0.08,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i * 0.11) % 0.48,
            }}
            style={{ transformOrigin: "center 40%" }}
          >
            <BirdSVG size={b.size} opacity={0.55 + (b.size / 30) * 0.35} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Fire — positioned over the actual bonfire in the image ─────────── */
const FIRE_CX = 32;   // % from left
const FIRE_CY = 72;   // % from top

type Particle = { id: number; dx: number; dy: number; size: number; dur: number; delay: number; hue: number; drift: number };

function FireParticles() {
  const count = 28;
  const particles: Particle[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    dx: ((i * 37 + 13) % 16) - 8,     // spread ±8% around center x
    dy: ((i * 29 + 7) % 6) - 3,       // spread ±3% around center y
    size: 4 + ((i * 17 + 5) % 12),
    dur: 1.2 + ((i * 23 + 11) % 16) / 10,
    delay: ((i * 31 + 3) % 26) / 10,
    hue: i % 3,
    drift: ((i * 19 + 7) % 22) - 11,
  }));

  const hueColors = [
    "rgba(255, 205, 55, 0.9)",
    "rgba(255, 115, 25, 0.85)",
    "rgba(235, 50, 15, 0.75)",
  ];

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {/* Outer warm halo */}
      <motion.div
        style={{
          position: "absolute",
          left: `${FIRE_CX}%`, top: `${FIRE_CY - 4}%`,
          width: 200, height: 140,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,120,25,0.25) 0%, rgba(200,70,10,0.1) 50%, transparent 75%)",
          filter: "blur(24px)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ opacity: [0.55, 0.9, 0.6, 0.85, 0.55] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Core glow */}
      <motion.div
        style={{
          position: "absolute",
          left: `${FIRE_CX}%`, top: `${FIRE_CY}%`,
          width: 90, height: 60,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,170,35,0.55) 0%, rgba(255,80,10,0.22) 55%, transparent 80%)",
          filter: "blur(10px)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ opacity: [0.75, 1, 0.78, 0.96, 0.75], scaleX: [1, 1.1, 0.93, 1.06, 1], scaleY: [1, 0.9, 1.08, 0.93, 1] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Flame particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `calc(${FIRE_CX + p.dx * 0.4}% )`,
            top: `${FIRE_CY + p.dy}%`,
            width: p.size,
            height: p.size * 1.7,
            borderRadius: "50% 50% 28% 28%",
            background: hueColors[p.hue],
            filter: "blur(1.8px)",
          }}
          animate={{
            y: [0, -(28 + p.size * 3.2)],
            x: [0, p.drift * 0.6, p.drift * 1.2],
            opacity: [0, 0.92, 0.55, 0],
            scale: [0.35, 1, 0.55, 0.08],
          }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
        />
      ))}
      {/* Ember sparks */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={`spark-${i}`}
          style={{
            position: "absolute",
            left: `calc(${FIRE_CX + ((i * 37 % 14) - 7) * 0.3}%)`,
            top: `${FIRE_CY - 1}%`,
            width: 2.5, height: 2.5,
            borderRadius: "50%",
            background: "rgba(255, 225, 110, 0.98)",
          }}
          animate={{
            y: [0, -(55 + i * 9)],
            x: [0, (i % 2 === 0 ? 1 : -1) * (8 + i * 4)],
            opacity: [0, 1, 0.7, 0],
            scale: [1, 1, 0.4, 0],
          }}
          transition={{ duration: 2.4 + i * 0.16, delay: i * 0.28, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
      {/* Smoke wisps from fire */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`smoke-${i}`}
          style={{
            position: "absolute",
            left: `${FIRE_CX + (i - 1) * 2}%`,
            top: `${FIRE_CY - 4}%`,
            width: 32 + i * 10,
            height: 50 + i * 15,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(190,180,170,0.11) 0%, transparent 70%)",
            filter: "blur(7px)",
            transformOrigin: "bottom center",
          }}
          animate={{
            y: [0, -(70 + i * 28)],
            x: [0, (i % 2 === 0 ? 16 : -12) + i * 4],
            opacity: [0, 0.4, 0.22, 0],
            scale: [0.4, 1, 1.5, 2.2],
          }}
          transition={{ duration: 5 + i * 1.4, repeat: Infinity, ease: "easeOut", delay: i * 1.7 }}
        />
      ))}
    </div>
  );
}

/* ─── Lantern / light pulses ─────────────────────────────────────────── */
const LIGHTS = [
  { x: 12, y: 42, r: 65, color: "rgba(255,185,60,0.28)" },
  { x: 20, y: 35, r: 48, color: "rgba(255,210,90,0.22)" },
  { x: 72, y: 40, r: 58, color: "rgba(255,190,70,0.24)" },
  { x: 85, y: 44, r: 42, color: "rgba(255,175,50,0.2)" },
  { x: 55, y: 37, r: 52, color: "rgba(255,200,80,0.18)" },
  { x: 30, y: 50, r: 35, color: "rgba(255,160,40,0.2)" },
  { x: 92, y: 35, r: 38, color: "rgba(255,195,75,0.18)" },
  { x: 8,  y: 55, r: 32, color: "rgba(255,170,55,0.22)" },
];

function LightPulses() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
      {LIGHTS.map((l, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: `${l.x}%`, top: `${l.y}%`,
            width: l.r * 2, height: l.r * 2,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${l.color} 0%, transparent 70%)`,
            filter: "blur(18px)",
          }}
          animate={{ opacity: [0.3, 0.88, 0.42, 0.95, 0.3], scale: [0.88, 1.12, 0.93, 1.08, 0.88] }}
          transition={{ duration: 3.2 + i * 0.75, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        />
      ))}
    </div>
  );
}

/* ─── CTA Button with breathing ring + floating glow ─────────────────── */
function EnterButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {/* Pulsing ring 1 — slow breath */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: -8,
          borderRadius: 999,
          border: "1.5px solid rgba(220, 180, 90, 0.45)",
          pointerEvents: "none",
        }}
        animate={{ scale: [1, 1.14, 1], opacity: [0.7, 0.15, 0.7] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Pulsing ring 2 — offset phase */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: -18,
          borderRadius: 999,
          border: "1px solid rgba(220, 175, 70, 0.25)",
          pointerEvents: "none",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Warm glow behind button */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: -20,
          borderRadius: 999,
          background: "radial-gradient(ellipse, rgba(200,155,55,0.32) 0%, transparent 70%)",
          filter: "blur(14px)",
          pointerEvents: "none",
        }}
        animate={{ opacity: hovered ? [0.6, 1, 0.6] : [0.3, 0.65, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.button
        onClick={onClick}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.35, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.055, y: -3, transition: { type: "spring", stiffness: 380, damping: 22 } }}
        whileTap={{ scale: 0.96 }}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: 11,
          padding: "15px 42px",
          borderRadius: 999,
          background: hovered
            ? "linear-gradient(135deg, rgba(215,172,88,0.96) 0%, rgba(175,128,52,0.94) 100%)"
            : "linear-gradient(135deg, rgba(196,155,72,0.9) 0%, rgba(158,115,42,0.88) 100%)",
          border: "1px solid rgba(255, 232, 172, 0.6)",
          color: "rgba(18, 10, 2, 0.96)",
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: "1.02rem",
          fontWeight: 600,
          letterSpacing: "0.07em",
          cursor: "pointer",
          boxShadow: hovered
            ? "0 10px 50px rgba(180,130,35,0.5), 0 2px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.5)"
            : "0 6px 32px rgba(160,115,28,0.38), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.42)",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
          overflow: "hidden",
        }}
      >
        <span style={{ position: "relative", zIndex: 1 }}>Enter Chautari</span>
        {/* Arrow with gentle right-nudge on hover */}
        <motion.span
          style={{ position: "relative", zIndex: 1, display: "flex" }}
          animate={hovered ? { x: [0, 5, 0] } : { x: 0 }}
          transition={{ duration: 0.8, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>

        {/* Travelling shimmer */}
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.28) 50%, transparent 75%)",
            borderRadius: 999,
          }}
          animate={{ x: ["-120%", "160%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
        />
      </motion.button>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter();
  const [entered, setEntered] = useState(false);

  function handleEnter() {
    setEntered(true);
    setTimeout(() => router.push("/home"), 700);
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100dvh", overflow: "hidden", background: "#110c07" }}>

      {/* ── z:1  Background image — cover fills the whole screen ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage: "url(/images/Background.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ── z:2  Top + bottom cinematic fade ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(180deg, rgba(4,2,1,0.35) 0%, transparent 16%, transparent 65%, rgba(4,2,1,0.48) 100%)",
        pointerEvents: "none",
      }} />

      {/* ── z:2  Right-side gradient vignette — darkens only the text area ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(90deg, transparent 45%, rgba(6,3,1,0.52) 68%, rgba(8,4,1,0.68) 100%)",
        pointerEvents: "none",
      }} />

      {/* ── Animation layers ── */}
      <AnimatedBirds />
      <LightPulses />
      <FireParticles />

      {/* ── Content — right side, no card, text floats directly over image ── */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            key="content"
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute", inset: 0, zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0 clamp(2.5rem, 6vw, 6rem) 0 0",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                maxWidth: "clamp(260px, 36vw, 420px)",
              }}
            >
              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0, letterSpacing: "0.65em" }}
                animate={{ opacity: 1, letterSpacing: "0.28em" }}
                transition={{ delay: 0.5, duration: 1.1 }}
                style={{
                  fontSize: "0.58rem",
                  textTransform: "uppercase",
                  color: "rgba(255, 232, 188, 0.95)",
                  marginBottom: "0.9rem",
                  fontFamily: "'Georgia', serif",
                  fontStyle: "italic",
                  textShadow:
                    "0 0 12px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1), 0 0 28px rgba(0,0,0,0.9)",
                }}
              >
                A space to breathe · Nepal
              </motion.p>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(3rem, 8vw, 5.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "#fffdf6",
                  textShadow:
                    "0 0 18px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,1), 0 0 50px rgba(0,0,0,0.9), 0 4px 24px rgba(0,0,0,0.8)",
                  marginBottom: "1.15rem",
                }}
              >
                Chautari
              </motion.h1>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.55, ease: "easeOut" }}
                style={{
                  width: 48, height: 1,
                  background: "linear-gradient(90deg, rgba(215,180,100,0.9), rgba(215,180,100,0.15))",
                  marginBottom: "1.15rem",
                  transformOrigin: "left center",
                }}
              />

              {/* Main quote */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontStyle: "italic",
                  fontSize: "clamp(0.92rem, 2vw, 1.15rem)",
                  color: "#fffcf4",
                  lineHeight: 1.78,
                  marginBottom: "0.55rem",
                  textShadow:
                    "0 0 14px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1), 0 0 36px rgba(0,0,0,0.95)",
                }}
              >
                You must be tired carrying all those things in your heart.
              </motion.p>

              {/* Subline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.75 }}
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "clamp(0.76rem, 1.5vw, 0.86rem)",
                  color: "rgba(255, 240, 215, 0.9)",
                  lineHeight: 1.7,
                  marginBottom: "2.1rem",
                  textShadow:
                    "0 0 12px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1), 0 0 28px rgba(0,0,0,0.9)",
                }}
              >
                Come, rest a while. You are not alone.
              </motion.p>

              {/* CTA */}
              <EnterButton onClick={handleEnter} />

              {/* Disclaimer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.85, duration: 0.9 }}
                style={{
                  marginTop: "1.2rem",
                  fontSize: "0.57rem",
                  color: "rgba(255, 225, 185, 0.6)",
                  letterSpacing: "0.07em",
                  fontFamily: "Inter, system-ui, sans-serif",
                  textShadow: "0 0 10px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)",
                }}
              >
                A culturally grounded mental health companion · Not a crisis service
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
