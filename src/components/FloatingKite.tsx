"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
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

export function FloatingKite({
  kite,
  currentUserId,
  onHug,
  motionProps,
  isNew = false,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [held, setHeld] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOwn = kite.user_id === currentUserId && !kite.isSeed;
  const colorEntry = KITE_COLORS.find((c) => c.fill === kite.color) ?? KITE_COLORS[0];

  /*
    Three-tier glow system:
      resting  — soft ambient halo (two drop-shadow layers)
      hovered  — bright, dramatic bloom (three layers, bigger radius)
    The CSS `transition` on the inner div handles the smooth change
    because Framer Motion is NOT animating `filter`, so the browser's
    own transition engine takes over cleanly.
  */
  const glowResting = [
    `drop-shadow(0 0  6px ${colorEntry.glow})`,
    `drop-shadow(0 0 20px ${colorEntry.glow})`,
  ].join(" ");

  const glowHovered = [
    `drop-shadow(0 0 10px ${colorEntry.glow})`,
    `drop-shadow(0 0 28px ${colorEntry.glow})`,
    `drop-shadow(0 0 55px ${colorEntry.glow})`,
  ].join(" ");

  return (
    /* ── Outer: position on sky + entrance animation ── */
    <motion.div
      style={{
        position: "absolute",
        left: `${kite.position_x}%`,
        top: `${kite.position_y}%`,
        zIndex: hovered ? 20 : 10,
        /* Needed so the ambient glow blob positions relative to this div */
        isolation: "isolate",
      }}
      initial={isNew ? { y: 90, opacity: 0, scale: 0.55 } : { opacity: 0 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={
        isNew
          ? { type: "spring", stiffness: 75, damping: 13, duration: 1.3 }
          : { duration: 0.45, ease: "easeOut" }
      }
    >
      {/* ── Ambient glow blob behind the kite (pulsing, separate layer) ── */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-28px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${colorEntry.glow}, transparent 72%)`,
          filter: "blur(14px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
        animate={{ opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 3.6 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Inner: continuous floating motion + hover glow ── */}
      <motion.div
        style={{
          cursor: isOwn ? "default" : held ? "grabbing" : "grab",
          userSelect: "none",
          filter: hovered || held ? glowHovered : glowResting,
          transition: "filter 0.32s ease",
        }}
        animate={
          held
            ? { rotate: 0, x: 0, y: 0, scale: 1.07 }
            : {
                rotate: motionProps.rotate,
                x: motionProps.x,
                y: motionProps.y,
                scale: 1,
              }
        }
        transition={
          held
            ? { duration: 0.28, ease: "easeOut" }
            : {
                duration: motionProps.duration,
                delay: motionProps.delay,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }
        }
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => {
          setHovered(false);
          if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
          setHeld(false);
        }}
        onPointerDown={() => {
          holdTimerRef.current = setTimeout(() => setHeld(true), 160);
        }}
        onPointerUp={() => {
          if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current);
            holdTimerRef.current = null;
          }
          setHeld(false);
        }}
        onClick={() => { if (!isOwn) onHug(kite.id); }}
        onTap={() => { if (!isOwn) onHug(kite.id); }}
      >
        <KiteSVG color={kite.color} tailColor={colorEntry.tail} size={88} />

        {/* ── Message — word-wrapped inside the kite body ── */}
        <div
          style={{
            position: "absolute",
            top: "42%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 8.5,
            color: "rgba(255,255,255,0.94)",
            textAlign: "center",
            width: 62,
            lineHeight: 1.52,
            maxHeight: 46,
            overflow: "hidden",
            pointerEvents: "none",
            textShadow: "0 1px 8px rgba(0,0,0,1), 0 0 2px rgba(0,0,0,0.9)",
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 600,
            wordBreak: "break-word",
          }}
        >
          {kite.message}
        </div>

        {/* ── Hug count badge ── */}
        {kite.hug_count > 0 && (
          <div
            style={{
              position: "absolute",
              top: -10,
              right: -12,
              background: "rgba(245,166,35,0.95)",
              color: "#07090f",
              fontSize: 8,
              fontWeight: 700,
              borderRadius: "999px",
              padding: "2px 6px",
              pointerEvents: "none",
              fontFamily: "Inter, system-ui, sans-serif",
              lineHeight: 1.35,
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.55), 0 0 10px rgba(245,166,35,0.45)",
            }}
          >
            {kite.hug_count}🤍
          </div>
        )}

        {/* ── Owner indicator dot ── */}
        {isOwn && (
          <div
            style={{
              position: "absolute",
              top: -8,
              left: -8,
              width: 15,
              height: 15,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 7,
              pointerEvents: "none",
              boxShadow: "0 0 6px rgba(255,255,255,0.2)",
            }}
          >
            ✦
          </div>
        )}

        {/* ── Hover tooltip ── */}
        <AnimatePresence>
          {hovered && !isOwn && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.18 }}
              style={{
                position: "absolute",
                bottom: -68,
                left: "50%",
                transform: "translateX(-50%)",
                width: 170,
                background: "rgba(8,11,20,0.96)",
                border: `1px solid ${colorEntry.glow.replace(/[\d.]+\)$/, "0.35)")}`,
                borderRadius: 10,
                padding: "9px 12px",
                pointerEvents: "none",
                fontFamily: "Inter, system-ui, sans-serif",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                zIndex: 30,
                boxShadow: `0 4px 24px rgba(0,0,0,0.6), 0 0 16px ${colorEntry.glow.replace(/[\d.]+\)$/, "0.2)")}`,
              }}
            >
              {/* Coloured accent line at top */}
              <div
                style={{
                  height: 2,
                  borderRadius: 1,
                  background: `linear-gradient(90deg, ${colorEntry.tail}, transparent)`,
                  marginBottom: 7,
                  opacity: 0.7,
                }}
              />
              <p
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.55,
                  marginBottom: 6,
                  fontStyle: "italic",
                }}
              >
                &ldquo;{kite.message}&rdquo;
              </p>
              <p
                style={{
                  fontSize: 9,
                  color: colorEntry.tail,
                  opacity: 0.75,
                  letterSpacing: "0.04em",
                }}
              >
                tap to send a hug ✦
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
