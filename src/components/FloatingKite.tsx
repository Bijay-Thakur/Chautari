"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { KiteSVG } from "./KiteSVG";
import { KITE_COLORS, generateKiteMotion } from "@/lib/kitePhysics";

export type KiteData = {
  id: string;
  message: string;
  color: string;
  position_x: number;
  position_y: number;
  hug_count: number;
  anonymous_name: string;
  user_id?: string;
  isSeed?: boolean;
};

type Props = {
  kite: KiteData;
  currentUserId: string;
  onHug: (kiteId: string) => void;
  motionProps: ReturnType<typeof generateKiteMotion>;
  isNew?: boolean;
};

export function FloatingKite({ kite, currentUserId, onHug, motionProps, isNew = false }: Props) {
  const [hovered, setHovered] = useState(false);
  const isOwn = kite.user_id === currentUserId && !kite.isSeed;
  const colorEntry = KITE_COLORS.find((c) => c.fill === kite.color) ?? KITE_COLORS[0];

  return (
    /* Outer: positioning + entrance animation */
    <motion.div
      style={{
        position: "absolute",
        left: `${kite.position_x}%`,
        top: `${kite.position_y}%`,
        zIndex: hovered ? 20 : 10,
      }}
      initial={isNew ? { y: 90, opacity: 0, scale: 0.55 } : { opacity: 0 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={
        isNew
          ? { type: "spring", stiffness: 75, damping: 13, duration: 1.3 }
          : { duration: 0.45, ease: "easeOut" }
      }
    >
      {/* Inner: continuous float */}
      <motion.div
        style={{
          cursor: isOwn ? "default" : "pointer",
          filter: `drop-shadow(0 0 10px ${colorEntry.glow})`,
          userSelect: "none",
        }}
        animate={{
          rotate: motionProps.rotate,
          x: motionProps.x,
          y: motionProps.y,
        }}
        transition={{
          duration: motionProps.duration,
          delay: motionProps.delay,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => !isOwn && onHug(kite.id)}
        whileTap={!isOwn ? { scale: 0.9 } : {}}
      >
        <KiteSVG color={kite.color} tailColor={colorEntry.tail} size={88} />

        {/* Message label — word-wrapped inside the kite diamond */}
        <div
          style={{
            position: "absolute",
            top: "43%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 8.5,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            width: 64,
            lineHeight: 1.5,
            maxHeight: 44,          /* ~3.5 lines visible */
            overflow: "hidden",
            pointerEvents: "none",
            textShadow: "0 1px 6px rgba(0,0,0,0.98)",
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 500,
            wordBreak: "break-word",
          }}
        >
          {kite.message}
        </div>

        {/* Hug count badge */}
        {kite.hug_count > 0 && (
          <div
            style={{
              position: "absolute",
              top: -8,
              right: -10,
              background: "rgba(245,166,35,0.92)",
              color: "#07090f",
              fontSize: 8,
              fontWeight: 700,
              borderRadius: "999px",
              padding: "2px 5px",
              pointerEvents: "none",
              fontFamily: "Inter, system-ui, sans-serif",
              lineHeight: 1.3,
              boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            {kite.hug_count}🤍
          </div>
        )}

        {/* Owner indicator */}
        {isOwn && (
          <div
            style={{
              position: "absolute",
              top: -7,
              left: -7,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 7,
              pointerEvents: "none",
            }}
          >
            ✦
          </div>
        )}

        {/* Hover tooltip — full message + hint */}
        <AnimatePresence>
          {hovered && !isOwn && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              style={{
                position: "absolute",
                bottom: -62,
                left: "50%",
                transform: "translateX(-50%)",
                width: 160,
                background: "rgba(10,13,22,0.94)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 8,
                padding: "8px 10px",
                pointerEvents: "none",
                fontFamily: "Inter, system-ui, sans-serif",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                zIndex: 30,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.5,
                  marginBottom: 4,
                  fontStyle: "italic",
                }}
              >
                &ldquo;{kite.message}&rdquo;
              </p>
              <p style={{ fontSize: 9, color: "rgba(245,166,35,0.6)", letterSpacing: "0.05em" }}>
                tap to send a hug
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
