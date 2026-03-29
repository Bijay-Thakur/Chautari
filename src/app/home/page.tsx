"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import EnterChautariModal from "@/components/EnterChautariModal";

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

/* Paused — used by “Come sit with yourself” home card when restored
function ChainGlyph() {
  return (
    <svg width="70" height="24" viewBox="0 0 70 24" fill="none" aria-hidden>
      <rect x="1" y="1" width="24" height="22" rx="11" stroke="rgba(196,163,90,0.5)" strokeWidth="2.5" />
      <rect x="45" y="1" width="24" height="22" rx="11" stroke="rgba(196,163,90,0.5)" strokeWidth="2.5" />
      <rect x="20" y="8" width="30" height="8" rx="4" fill="rgba(154,123,60,0.35)" />
    </svg>
  );
}
*/

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

const CHAUTARI_UNAME_KEY = "chautari_uname";

export default function ChautariHome() {
  const router = useRouter();
  const [enterModalOpen, setEnterModalOpen] = useState(false);

  function handleConfirmName(anonymousName: string) {
    try {
      sessionStorage.setItem(CHAUTARI_UNAME_KEY, anonymousName);
    } catch {
      /* ignore quota / private mode */
    }
    setEnterModalOpen(false);
    router.push("/chautari");
  }

  return (
    <div
      className="flex flex-col relative overflow-x-hidden overflow-y-hidden"
      style={{
        background: "#0a0807",
        minHeight: "100dvh",
        height: "100dvh",
      }}
    >
      <Atmosphere />

      <EnterChautariModal
        open={enterModalOpen}
        onClose={() => setEnterModalOpen(false)}
        onConfirm={handleConfirmName}
      />

      {/* Vertically center the full page stack (hero + rest + privacy) */}
      <div className="relative z-10 flex flex-1 min-h-0 w-full flex-col justify-center items-center px-5 sm:px-6">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">
        {/* ── Hero (compact — keep title block untouched in spirit) ── */}
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center shrink-0"
          style={{ paddingBottom: 0 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.55 }}
            style={{
              fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase",
              color: "rgba(220,190,130,0.85)", marginBottom: "clamp(0.5rem, 1.5vh, 1rem)",
              textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}
          >
            A culturally grounded safe space
          </motion.p>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2.75rem, 11vw, 6.5rem)",
              lineHeight: 0.92,
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
              margin: "clamp(0.5rem, 1.8vh, 1rem) auto",
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.55 }}
            style={{
              fontSize: "clamp(0.8rem, 1.85vw, 0.95rem)",
              color: "rgba(212,196,176,0.42)",
              maxWidth: "24rem",
              lineHeight: 1.55,
            }}
          >
            Understand what you carry.{" "}
            <span style={{ display: "inline-block" }}>Choose what you pass forward.</span>
          </motion.p>
        </motion.section>

        {/* ── A Place to Rest — directly under hero, same centered column ── */}
        <div className="w-full" style={{ paddingTop: "clamp(0.65rem, 2vh, 1.1rem)" }}>
          <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" className="w-full">
            <div className="text-center">
              <div
                className="flex justify-center mb-2 sm:mb-3"
                style={{ filter: "drop-shadow(0 4px 20px rgba(109, 143, 122, 0.22))" }}
              >
                <div style={{ transform: "scale(0.88)" }}>
                  <LeafGlyph />
                </div>
              </div>

              <div
                className="mx-auto mb-2 sm:mb-3"
                style={{
                  width: "min(100%, 160px)",
                  height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(143, 188, 159, 0.45), transparent)",
                  opacity: 0.85,
                }}
              />

              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(1.35rem, 4vw, 2rem)",
                  color: "#cfe8dc",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.15,
                  marginBottom: "0.45rem",
                  textShadow: "0 2px 24px rgba(0,0,0,0.5), 0 0 32px rgba(109, 143, 122, 0.1)",
                }}
              >
                A Place to Rest and Express
              </h2>
              <p
                style={{
                  color: "rgba(185, 215, 200, 0.82)",
                  fontSize: "clamp(0.8rem, 1.65vw, 0.92rem)",
                  lineHeight: 1.55,
                  maxWidth: "21rem",
                  margin: "0 auto 0.75rem",
                  fontWeight: 400,
                  textShadow: "0 1px 12px rgba(0,0,0,0.35)",
                }}
              >
                The resting stone under the pipal tree — where people stop, share, and breathe. Come as you are.
              </p>

              <div className="flex justify-center mt-1 sm:mt-2">
                <motion.div
                  className="relative inline-flex"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
                  whileHover={{ scale: 1.06, y: 0 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Soft canopy glow — pulses like light through leaves */}
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute -inset-4 rounded-full"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(52, 211, 153, 0.38) 0%, rgba(251, 191, 36, 0.22) 45%, transparent 72%)",
                      filter: "blur(14px)",
                      zIndex: 0,
                    }}
                    animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.5, 0.85, 0.5] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <button
                    type="button"
                    onClick={() => setEnterModalOpen(true)}
                    className="relative z-[1] inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0807]"
                    style={{
                      padding: "11px 22px 11px 24px",
                      fontSize: "clamp(0.62rem, 1.9vw, 0.72rem)",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#0a0f14",
                      fontFamily: "Inter, system-ui, sans-serif",
                      background: "linear-gradient(145deg, #fde68a 0%, #d4a574 38%, #b45309 120%)",
                      border: "1px solid rgba(255, 235, 200, 0.45)",
                      boxShadow:
                        "0 2px 0 rgba(255,255,255,0.35) inset, 0 8px 28px rgba(217, 119, 6, 0.35), 0 0 36px rgba(52, 211, 153, 0.12)",
                    }}
                  >
                    <motion.span
                      className="pointer-events-none absolute inset-0 opacity-40"
                      style={{
                        background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.55) 45%, transparent 70%)",
                      }}
                      animate={{ x: ["-120%", "120%"] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "linear", repeatDelay: 0.4 }}
                    />
                    <span
                      className="relative z-[1] inline-flex items-center"
                      style={{ gap: 10 }}
                    >
                      Sit under Chautari
                      <motion.span
                        animate={{ x: [0, 6, 0], rotate: [0, 8, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ display: "inline-flex" }}
                      >
                        <ArrowRight />
                      </motion.span>
                    </span>
                    <motion.span
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{ boxShadow: "inset 0 0 24px rgba(255,255,255,0.12)" }}
                      animate={{ opacity: [0.45, 0.9, 0.45] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Privacy — part of the same vertically centered stack */}
        <div
          className="shrink-0 w-full pt-3 sm:pt-4"
          style={{
            color: "rgba(220,200,165,0.72)",
            fontSize: "0.62rem",
            letterSpacing: "0.07em",
            textShadow: "0 1px 6px rgba(0,0,0,0.55)",
          }}
        >
          Your responses are private and never stored.
        </div>
        </div>
      </div>

      {/* Come sit with yourself — temporarily hidden; uncomment to restore second path
      <div className="relative z-10 flex flex-row w-full max-w-5xl mx-auto px-5 gap-5" style={{ paddingBottom: "clamp(5.5rem, 14vh, 8rem)", flexWrap: "wrap" }}>
        <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" style={{ flex: "1 1 300px" }}>
          <Link href="/come-sit-with-yourself" className="group relative block overflow-hidden rounded-[22px] cursor-pointer h-full" style={{ minHeight: "clamp(260px, 38vh, 360px)" }}>
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]" style={{ background: "linear-gradient(148deg, #2c1a0e 0%, #3b2410 52%, #2a1a0a 100%)" }} />
            <div className="absolute transition-opacity duration-600 opacity-60 group-hover:opacity-95" style={{ top: "-10%", right: "5%", width: "75%", height: "90%", background: "radial-gradient(ellipse, rgba(210,140,60,0.32) 0%, transparent 62%)", filter: "blur(32px)" }} />
            <div className="absolute opacity-35" style={{ bottom: 0, left: "5%", width: "50%", height: "55%", background: "radial-gradient(ellipse, rgba(190,95,55,0.30) 0%, transparent 62%)", filter: "blur(20px)" }} />
            <div className="absolute inset-[1px] rounded-[21px] flex flex-col items-center justify-center text-center gap-2.5 px-8 py-8" style={{ background: "rgba(255, 200, 130, 0.07)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(210, 155, 80, 0.18)" }}>
              <ChainGlyph />
              <div>
                <h2 className="font-display" style={{ fontSize: "clamp(1.55rem, 4.5vw, 1.9rem)", color: "#f0d5a8", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "0.45rem", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>Come sit with yourself</h2>
                <p style={{ color: "rgba(240, 215, 175, 0.82)", fontSize: "0.86rem", lineHeight: 1.65, maxWidth: "290px", margin: "0 auto 0.3rem" }}>Speak in your own voice, reflect on what you carry, and explore gentle next steps with care.</p>
                <p style={{ color: "rgba(230, 195, 145, 0.62)", fontSize: "0.78rem", fontStyle: "italic" }}>Your words stay with you — we listen without judgment.</p>
              </div>
              <span className="flex items-center gap-2 mt-1 transition-all duration-300 group-hover:gap-3" style={{ color: "#e8b870", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>Take a seat <ArrowRight /></span>
            </div>
          </Link>
        </motion.div>
      </div>
      */}
    </div>
  );
}
