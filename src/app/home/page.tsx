"use client";

import Link from "next/link";
import { motion } from "framer-motion";

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 5l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LeafGlyph() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <circle cx="22" cy="22" r="21" stroke="rgba(141,175,152,0.18)" strokeWidth="1" />
      <path
        d="M14 32 Q22 14 30 32"
        stroke="rgba(141,175,152,0.55)"
        strokeWidth="1.5"
        fill="rgba(61,92,74,0.22)"
        strokeLinejoin="round"
      />
      <line x1="22" y1="32" x2="22" y2="36" stroke="rgba(141,175,152,0.35)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ChainGlyph() {
  return (
    <svg width="70" height="24" viewBox="0 0 70 24" fill="none" aria-hidden>
      <rect x="1" y="1" width="24" height="22" rx="11" stroke="rgba(196,163,90,0.5)" strokeWidth="2.5" />
      <rect x="45" y="1" width="24" height="22" rx="11" stroke="rgba(196,163,90,0.5)" strokeWidth="2.5" />
      <rect x="20" y="8" width="30" height="8" rx="4" fill="rgba(154,123,60,0.35)" />
    </svg>
  );
}

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {/* Blurred background image */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/images/Background.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(7px)",
          transform: "scale(1.05)", // prevent blur edge bleed
          zIndex: 0,
        }}
      />
      {/* Dark warm overlay so text and cards remain readable */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "rgba(6, 3, 1, 0.62)",
          zIndex: 1,
        }}
      />
      {/* Subtle warm vignette — keeps centre brighter */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 42%, transparent 0%, rgba(4,2,0,0.38) 100%)",
          zIndex: 2,
        }}
      />
    </div>
  );
}

export default function ChautariHome() {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-x-hidden"
      style={{ background: "#0a0807" }}
    >
      <Atmosphere />

      {/* ── Hero ── */}
      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{ paddingTop: "clamp(3.5rem, 11vh, 6.5rem)", paddingBottom: "clamp(2rem, 6vh, 4rem)" }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.55 }}
          style={{
            fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase",
            color: "rgba(220,190,130,0.85)", marginBottom: "1.6rem",
            textShadow: "0 1px 8px rgba(0,0,0,0.6)",
          }}
        >
          A culturally grounded safe space
        </motion.p>

        <h1
          className="font-display"
          style={{
            fontSize: "clamp(4.2rem, 15vw, 8.5rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.045em",
            color: "#efe4d0",
            textShadow: "0 8px 90px rgba(0,0,0,0.55)",
          }}
        >
          Chautari
        </h1>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.55, ease: "easeOut" }}
          style={{
            width: 44, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(196,163,90,0.55), transparent)",
            margin: "1.75rem auto",
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.55 }}
          style={{
            fontSize: "clamp(0.875rem, 2vw, 1rem)",
            color: "rgba(212,196,176,0.42)",
            maxWidth: "24rem",
            lineHeight: 1.75,
          }}
        >
          Understand what you carry.{" "}
          <span style={{ display: "inline-block" }}>Choose what you pass forward.</span>
        </motion.p>
      </motion.section>

      {/* ── Two horizontal paths ── */}
      <div
        className="relative z-10 flex flex-row w-full max-w-5xl mx-auto px-5 gap-5"
        style={{ paddingBottom: "clamp(5.5rem, 14vh, 8rem)", flexWrap: "wrap" }}
      >
        {/* Path 1 — A Place to Rest */}
        <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" style={{ flex: "1 1 300px" }}>
          <Link
            href="/chautari"
            className="group relative block overflow-hidden rounded-[22px] cursor-pointer h-full"
            style={{ minHeight: "clamp(260px, 38vh, 360px)" }}
          >
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              style={{ background: "linear-gradient(148deg, #0d2119 0%, #122e22 55%, #0b1d16 100%)" }}
            />
            <div
              className="absolute transition-opacity duration-600 opacity-55 group-hover:opacity-90"
              style={{
                top: "-20%", left: "20%", width: "65%", height: "100%",
                background: "radial-gradient(ellipse, rgba(109,143,122,0.38) 0%, transparent 60%)",
                filter: "blur(32px)",
              }}
            />
            <div
              className="absolute opacity-25"
              style={{
                bottom: 0, right: 0, width: "40%", height: "50%",
                background: "radial-gradient(ellipse, rgba(90,160,120,0.25) 0%, transparent 65%)",
                filter: "blur(20px)",
              }}
            />
            <div
              className="absolute inset-[1px] rounded-[21px] flex flex-col items-center justify-center text-center gap-3 px-8 py-8"
              style={{
                background: "rgba(255,255,255,0.028)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.075)",
              }}
            >
              <LeafGlyph />
              <div>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(1.55rem, 4.5vw, 1.9rem)",
                    color: "#bcd4c6", letterSpacing: "-0.025em",
                    lineHeight: 1.1, marginBottom: "0.45rem",
                  }}
                >
                  A Place to Rest
                </h2>
                <p style={{ color: "rgba(175,208,190,0.48)", fontSize: "0.86rem", lineHeight: 1.65, maxWidth: "270px", margin: "0 auto" }}>
                  The resting stone under the pipal tree — where people stop, share, and breathe. Come as you are.
                </p>
              </div>
              <span
                className="flex items-center gap-2 mt-1 transition-all duration-300 group-hover:gap-3"
                style={{ color: "#6f9e82", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}
              >
                Enter the room <ArrowRight />
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Path 2 — Come sit with yourself */}
        <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" style={{ flex: "1 1 300px" }}>
          <Link
            href="/come-sit-with-yourself"
            className="group relative block overflow-hidden rounded-[22px] cursor-pointer h-full"
            style={{ minHeight: "clamp(260px, 38vh, 360px)" }}
          >
            {/* warm terracotta-amber base */}
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              style={{ background: "linear-gradient(148deg, #2c1a0e 0%, #3b2410 52%, #2a1a0a 100%)" }}
            />
            {/* amber glow top-right */}
            <div
              className="absolute transition-opacity duration-600 opacity-60 group-hover:opacity-95"
              style={{
                top: "-10%", right: "5%", width: "75%", height: "90%",
                background: "radial-gradient(ellipse, rgba(210,140,60,0.32) 0%, transparent 62%)",
                filter: "blur(32px)",
              }}
            />
            {/* terracotta blush bottom-left */}
            <div
              className="absolute opacity-35"
              style={{
                bottom: 0, left: "5%", width: "50%", height: "55%",
                background: "radial-gradient(ellipse, rgba(190,95,55,0.30) 0%, transparent 62%)",
                filter: "blur(20px)",
              }}
            />
            <div
              className="absolute inset-[1px] rounded-[21px] flex flex-col items-center justify-center text-center gap-2.5 px-8 py-8"
              style={{
                background: "rgba(255, 200, 130, 0.07)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(210, 155, 80, 0.18)",
              }}
            >
              <ChainGlyph />
              <div>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(1.55rem, 4.5vw, 1.9rem)",
                    color: "#f0d5a8", letterSpacing: "-0.025em",
                    lineHeight: 1.1, marginBottom: "0.45rem",
                    textShadow: "0 2px 12px rgba(0,0,0,0.55)",
                  }}
                >
                  Come sit with yourself
                </h2>
                <p style={{ color: "rgba(240, 215, 175, 0.82)", fontSize: "0.86rem", lineHeight: 1.65, maxWidth: "290px", margin: "0 auto 0.3rem" }}>
                  Speak in your own voice, reflect on what you carry, and explore gentle next steps with care.
                </p>
                <p style={{ color: "rgba(230, 195, 145, 0.62)", fontSize: "0.78rem", fontStyle: "italic" }}>
                  Your words stay with you — we listen without judgment.
                </p>
              </div>
              <span
                className="flex items-center gap-2 mt-1 transition-all duration-300 group-hover:gap-3"
                style={{ color: "#e8b870", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}
              >
                Take a seat <ArrowRight />
              </span>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Privacy note */}
      <div
        className="relative z-10 text-center pb-16"
        style={{ color: "rgba(220,200,165,0.72)", fontSize: "0.65rem", letterSpacing: "0.07em", textShadow: "0 1px 6px rgba(0,0,0,0.55)" }}
      >
        Your responses are private and never stored.
      </div>
    </div>
  );
}
