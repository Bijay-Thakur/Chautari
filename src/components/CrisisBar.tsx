"use client";

import { Phone } from "lucide-react";

export default function CrisisBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-3 px-4 py-3"
      style={{ background: "rgba(26,10,0,0.95)", borderTop: "1px solid #d97706" }}>
      <Phone size={16} className="text-amber-400 flex-shrink-0" />
      <span className="text-amber-100 text-sm font-medium">
        सहायता चाहिन्छ? | Need help now?
      </span>
      <a
        href="tel:16600102005"
        className="text-amber-400 font-bold text-sm hover:text-amber-300 transition-colors underline underline-offset-2"
      >
        TPO Nepal — 16600102005
      </a>
    </div>
  );
}
