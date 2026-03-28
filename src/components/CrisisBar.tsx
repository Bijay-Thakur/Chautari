"use client";

import { Phone } from "lucide-react";

export default function CrisisBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between font-sans"
      style={{
        height: 48,
        paddingLeft: 24,
        paddingRight: 24,
        background: "rgba(18, 14, 11, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(196, 163, 90, 0.12)",
      }}
    >
      <span style={{ fontWeight: 400, fontSize: 13, color: "var(--text-muted)" }}>
        Need support right now?
      </span>
      <a
        href="tel:16600102005"
        className="crisis-link flex items-center gap-1.5"
        style={{ fontWeight: 500, fontSize: 13 }}
      >
        <Phone size={14} />
        TPO Nepal — 1660-0102005
      </a>
    </div>
  );
}
