"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ChautariPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 warm-mesh-dark relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(109,143,122,0.2), transparent 55%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full text-center relative z-10"
      >
        <div
          className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border"
          style={{
            background: "rgba(109,143,122,0.12)",
            borderColor: "rgba(141,175,152,0.25)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <svg width="32" height="28" viewBox="0 0 32 28" fill="none" aria-hidden>
            <path
              d="M6 22 L16 6 L26 22 Z"
              stroke="rgba(184,212,196,0.7)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              fill="rgba(61,92,74,0.35)"
            />
            <line x1="10" y1="22" x2="22" y2="22" stroke="rgba(141,175,152,0.4)" strokeWidth="1.2" />
          </svg>
        </div>

        <h1 className="ne text-3xl font-bold mb-2" style={{ color: "#c5ddd0" }}>
          चौतारी
        </h1>
        <p className="text-sm font-medium tracking-widest uppercase mb-1" style={{ color: "rgba(184,212,196,0.5)" }}>
          Chautari
        </p>
        <p className="text-sm mb-10 italic" style={{ color: "rgba(184,212,196,0.45)" }}>
          A resting place. Coming soon.
        </p>

        <p className="leading-relaxed mb-10 text-base px-2" style={{ color: "rgba(220,230,222,0.78)" }}>
          Chautari — the resting stone under the pipal tree — is where people stop, share, and breathe. This peer
          space is being built with care.
        </p>

        <Link
          href="/"
          className="inline-block px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:brightness-110 active:scale-[0.98] cursor-pointer"
          style={{
            background: "linear-gradient(180deg, #4a6b58 0%, #3d5c4a 100%)",
            color: "#f0f7f3",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          ← Back home
        </Link>
      </motion.div>
    </div>
  );
}
