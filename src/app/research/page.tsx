import { Suspense } from "react";
import ResearchContent from "./ResearchContent";

export default function ResearchPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#0a0807", color: "rgba(196,163,90,0.5)" }}
        >
          Loading…
        </div>
      }
    >
      <ResearchContent />
    </Suspense>
  );
}
