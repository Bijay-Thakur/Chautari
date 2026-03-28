"use client";

type ProgressChainProps = {
  total: number;
  completedScores: (number | null)[]; // null = not yet answered, 0-3 = score
  currentIndex: number;
};

export default function ProgressChain({ total, completedScores, currentIndex }: ProgressChainProps) {
  return (
    <div className="flex items-center justify-center gap-1 my-4">
      {Array.from({ length: total }).map((_, i) => {
        const score = completedScores[i];
        const isCompleted = score !== null && score !== undefined;
        const isCurrent = i === currentIndex;
        const isGold = isCompleted && score >= 2;
        const isIron = isCompleted && score < 2;

        return (
          <svg key={i} width="36" height="28" viewBox="0 0 36 28" className="transition-all duration-500">
            {/* Chain link shape */}
            <rect
              x="4" y="4" width="28" height="20" rx="10"
              fill="none"
              stroke={isGold ? "#f6c90e" : isIron ? "#4a5568" : isCurrent ? "#6b7280" : "#2d3748"}
              strokeWidth="5"
              style={{
                filter: isGold ? "drop-shadow(0 0 6px #f6c90e)" : "none",
                transition: "stroke 0.5s, filter 0.5s",
              }}
            />
            {/* Inner cutout */}
            <rect
              x="10" y="10" width="16" height="8" rx="4"
              fill={isGold ? "#f6c90e" : isIron ? "#4a5568" : isCurrent ? "#6b7280" : "#2d3748"}
              style={{ transition: "fill 0.5s" }}
            />
          </svg>
        );
      })}
    </div>
  );
}
