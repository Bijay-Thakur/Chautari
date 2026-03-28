"use client";

export default function CrisisBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden font-sans">
      {/* Warm gradient accent line at top */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(196,163,90,0.5) 20%, rgba(220,160,60,0.65) 50%, rgba(196,163,90,0.5) 80%, transparent 100%)",
        }}
      />

      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          background:
            "linear-gradient(180deg, rgba(16,12,6,0.97) 0%, rgba(20,15,7,0.99) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          gap: 12,
        }}
      >
        {/* Left label with pulse dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgba(196,163,90,0.92)",
              boxShadow:
                "0 0 6px rgba(196,163,90,0.8), 0 0 14px rgba(196,163,90,0.4)",
              flexShrink: 0,
              animation: "crisisBarPulse 2.4s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "rgba(230,205,155,0.72)",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
          >
            Need support right now?
          </span>
        </div>

        {/* Right: styled call-to-action */}
        <a
          href="tel:16600102005"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "6px 14px",
            background:
              "linear-gradient(135deg, rgba(196,163,90,0.16) 0%, rgba(160,120,45,0.1) 100%)",
            border: "1px solid rgba(196,163,90,0.3)",
            borderRadius: 999,
            textDecoration: "none",
            flexShrink: 0,
            boxShadow:
              "0 2px 12px rgba(196,163,90,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
            transition: "all 0.2s",
          }}
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(196,163,90,0.88)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.45 2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.57a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "rgba(220,190,110,0.92)",
              letterSpacing: "0.02em",
            }}
          >
            TPO Nepal · 1660-0102005
          </span>
        </a>
      </div>

      <style>{`
        @keyframes crisisBarPulse {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.72); }
        }
      `}</style>
    </div>
  );
}
