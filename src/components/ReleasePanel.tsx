"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onRelease: (message: string) => void;
  isReleasing: boolean;
};

export function ReleasePanel({ onRelease, isReleasing }: Props) {
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(true);

  function handleSubmit() {
    if (!msg.trim() || isReleasing) return;
    onRelease(msg.trim());
    setMsg("");
  }

  return (
    <div
      style={{
        position: "absolute",
        right: 20,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 30,
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              width: 220,
              background: "rgba(10,13,22,0.94)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "20px 18px",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              fontFamily: "Inter, system-ui, sans-serif",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "rgba(245,166,35,0.9)",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Release a kite
            </p>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.26)",
                lineHeight: 1.65,
                marginBottom: 14,
              }}
            >
              Write what you&apos;re carrying. Let it fly with the others.
            </p>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value.slice(0, 160))}
              placeholder="I feel like no one really sees me..."
              maxLength={160}
              rows={4}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 8,
                color: "rgba(255,255,255,0.85)",
                fontSize: 12,
                fontFamily: "Inter, system-ui, sans-serif",
                padding: "10px 12px",
                resize: "none",
                outline: "none",
                lineHeight: 1.6,
                transition: "border-color 0.2s",
                caretColor: "rgba(245,166,35,0.8)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(245,166,35,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
            />
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.14)",
                textAlign: "right",
                marginTop: 4,
              }}
            >
              {msg.length}/160
            </div>
            <button
              onClick={handleSubmit}
              disabled={!msg.trim() || isReleasing}
              style={{
                width: "100%",
                marginTop: 10,
                background: msg.trim() ? "#f5a623" : "rgba(245,166,35,0.15)",
                color: msg.trim() ? "#07090f" : "rgba(245,166,35,0.35)",
                border: "none",
                borderRadius: 8,
                padding: "10px",
                fontSize: 12,
                fontWeight: 600,
                cursor: msg.trim() && !isReleasing ? "pointer" : "default",
                transition: "all 0.2s",
                fontFamily: "Inter, system-ui, sans-serif",
                letterSpacing: "0.4px",
              }}
            >
              {isReleasing ? "Flying…" : "Let it fly ↗"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle tab */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Collapse panel" : "Open release panel"}
        style={{
          position: "absolute",
          top: 0,
          left: open ? -36 : 0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(245,166,35,0.12)",
          border: "1px solid rgba(245,166,35,0.28)",
          color: "rgba(245,166,35,0.8)",
          cursor: "pointer",
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "left 0.3s",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {open ? "›" : "✦"}
      </button>
    </div>
  );
}
