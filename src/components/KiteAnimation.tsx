"use client";

import { motion } from "framer-motion";

type KiteProps = {
  size?: number;
  animate?: boolean;
  className?: string;
};

export default function KiteAnimation({ size = 80, animate = true, className = "" }: KiteProps) {
  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        animate: { y: [0, -12, 0], rotate: [-5, 5, -5] },
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
      }
    : {};

  return (
    <Wrapper {...wrapperProps} className={`inline-block ${className}`}>
      <svg width={size} height={size * 1.3} viewBox="0 0 80 104" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Kite body — diamond shape */}
        <path d="M40 4 L76 44 L40 84 L4 44 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
        {/* Top left quarter */}
        <path d="M40 4 L4 44 L40 44 Z" fill="#ef4444" />
        {/* Top right quarter */}
        <path d="M40 4 L76 44 L40 44 Z" fill="#f59e0b" />
        {/* Bottom left quarter */}
        <path d="M4 44 L40 84 L40 44 Z" fill="#16a34a" />
        {/* Bottom right quarter */}
        <path d="M76 44 L40 84 L40 44 Z" fill="#f59e0b" />
        {/* Cross lines */}
        <line x1="4" y1="44" x2="76" y2="44" stroke="#92400e" strokeWidth="1.5" />
        <line x1="40" y1="4" x2="40" y2="84" stroke="#92400e" strokeWidth="1.5" />
        {/* Tail ribbon */}
        <path
          d="M40 84 Q48 92 36 100 Q44 104 40 104"
          stroke="#d97706"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Small bows on tail */}
        <ellipse cx="43" cy="89" rx="4" ry="2.5" fill="#fbbf24" opacity="0.8" />
        <ellipse cx="37" cy="97" rx="4" ry="2.5" fill="#ef4444" opacity="0.8" />
      </svg>
    </Wrapper>
  );
}
