"use client";

import Link from "next/link";

function ChainLinkPulse() {
  return (
    <svg className="chain-pulse" width="64" height="40" viewBox="0 0 64 40" fill="none">
      <rect x="4" y="4" width="56" height="32" rx="16" stroke="#d97706" strokeWidth="7" />
      <rect x="16" y="14" width="32" height="12" rx="6" fill="#d97706" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "#1a0a00" }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1
          className="ne font-bold mb-3"
          style={{ fontSize: "clamp(3rem, 10vw, 5rem)", color: "#f6c90e", lineHeight: 1.15 }}
        >
          साथी
        </h1>
        <p className="text-amber-200 text-lg font-light tracking-wide">
          A place to rest what you carry
        </p>
      </div>

      {/* Two doors */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        {/* Left door — Chautari */}
        <Link
          href="/chautari"
          className="flex-1 flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 group"
          style={{
            background: "rgba(13,43,26,0.7)",
            borderColor: "rgba(34,197,94,0.4)",
            boxShadow: "0 0 24px rgba(34,197,94,0.12)",
          }}
        >
          <div className="text-5xl">🏡</div>
          <div className="text-center">
            <p className="ne text-xl font-semibold mb-1" style={{ color: "#86efac" }}>
              चौतारी / Ghumti
            </p>
            <p className="text-green-300 text-sm opacity-80">Come rest a while</p>
          </div>
          <div
            className="text-xs px-4 py-1.5 rounded-full transition-all"
            style={{ background: "rgba(34,197,94,0.15)", color: "#86efac", border: "1px solid rgba(34,197,94,0.3)" }}
          >
            Enter the room
          </div>
        </Link>

        {/* Right door — Break the Chain */}
        <Link
          href="/screening"
          className="flex-1 flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 group"
          style={{
            background: "rgba(92,45,0,0.7)",
            borderColor: "rgba(217,119,6,0.5)",
            boxShadow: "0 0 32px rgba(217,119,6,0.18)",
          }}
        >
          <ChainLinkPulse />
          <div className="text-center">
            <p className="ne text-lg font-semibold mb-1" style={{ color: "#fbbf24" }}>
              श्रृंखला तोड्नुस्
            </p>
            <p className="text-amber-400 text-base font-semibold">Break the Chain</p>
          </div>

          {/* Catching statement */}
          <div className="text-center mt-2 px-2">
            <p className="ne text-xs leading-relaxed mb-1" style={{ color: "#fcd34d", opacity: 0.85 }}>
              के तपाईंलाई थाहा छ — तपाईंले आफूलाई नचाहेको कुरा आफ्नो भावी सन्तानलाई दिइरहनुभएको हुन सक्छ?
            </p>
            <p className="text-xs leading-relaxed italic" style={{ color: "#d97706" }}>
              Do you know — you might be passing something to your future ones that you never wanted for yourself?
            </p>
          </div>

          <div
            className="text-xs px-4 py-1.5 rounded-full transition-all"
            style={{ background: "rgba(217,119,6,0.2)", color: "#fbbf24", border: "1px solid rgba(217,119,6,0.4)" }}
          >
            Begin the journey
          </div>
        </Link>
      </div>

      {/* Subtle tagline */}
      <p className="mt-10 text-center text-xs max-w-xs" style={{ color: "rgba(253,243,236,0.3)" }}>
        This is a safe space. Your responses are private and never stored.
      </p>
    </div>
  );
}
