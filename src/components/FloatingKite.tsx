"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { KiteSVG } from "./KiteSVG";
import { KiteHoverCard } from "./KiteHoverCard";
import { KITE_COLORS, generateKiteMotion } from "@/lib/kitePhysics";

const KITE_SIZE = 152;
const DRAG_THRESHOLD_PX = 8;
const DRAG_THRESHOLD_SQ = DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX;

export type KiteData = {
  id: string;
  message: string;
  nepaliPhrase?: string;
  silencingPhrase?: string;
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

type DragStart = {
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  thresholdPassed: boolean;
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pointerDownRef = useRef(false);
  const longHoldRef = useRef(false);
  const downAtRef = useRef(0);
  const dragStartRef = useRef<DragStart | null>(null);

  const isOwn = kite.user_id === currentUserId && !kite.isSeed;

  const HOLD_MS = 220;
  const TAP_MAX_MS = 380;

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const colorEntry = KITE_COLORS.find((c) => c.fill === kite.color) ?? KITE_COLORS[0];

  const glowResting = [
    `drop-shadow(0 0  8px ${colorEntry.glow})`,
    `drop-shadow(0 0 24px ${colorEntry.glow})`,
  ].join(" ");

  const glowHovered = [
    `drop-shadow(0 0 12px ${colorEntry.glow})`,
    `drop-shadow(0 0 32px ${colorEntry.glow})`,
    `drop-shadow(0 0 58px ${colorEntry.glow})`,
  ].join(" ");

  const physicsPaused = held || isDragging;

  // ── Hover card handlers ──────────────────────────────────────────────────

  const handleMouseEnter = useCallback(() => {
    clearTimeout(leaveTimerRef.current);
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    leaveTimerRef.current = setTimeout(() => {
      setHovered(false);
    }, 140);
  }, []);

  const handleRelate = useCallback(() => {
    setHovered(false);
    onHug(kite.id);
  }, [kite.id, onHug]);

  const handleJustFeel = useCallback(() => {
    setHovered(false);
  }, []);

  // ── Drag / hold pointer handlers ─────────────────────────────────────────

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    pointerDownRef.current = true;
    longHoldRef.current = false;
    downAtRef.current = Date.now();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: dragOffset.x,
      origY: dragOffset.y,
      thresholdPassed: false,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }

    clearHoldTimer();
    holdTimerRef.current = setTimeout(() => {
      if (dragStartRef.current?.thresholdPassed) return;
      longHoldRef.current = true;
      setHeld(true);
    }, HOLD_MS);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragStartRef.current;
    if (!pointerDownRef.current || !d) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    if (!d.thresholdPassed) {
      if (dx * dx + dy * dy < DRAG_THRESHOLD_SQ) return;
      d.thresholdPassed = true;
      clearHoldTimer();
      longHoldRef.current = false;
      setHeld(false);
      setIsDragging(true);
    }

    setDragOffset({ x: d.origX + dx, y: d.origY + dy });
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }

    const dragged = dragStartRef.current?.thresholdPassed ?? false;
    dragStartRef.current = null;

    clearHoldTimer();
    setHeld(false);
    setIsDragging(false);

    const elapsed = Date.now() - downAtRef.current;
    const shouldHug =
      !isOwn &&
      pointerDownRef.current &&
      !longHoldRef.current &&
      !dragged &&
      elapsed < TAP_MAX_MS;

    pointerDownRef.current = false;
    longHoldRef.current = false;

    if (shouldHug) onHug(kite.id);
  }

  function handlePointerCancel(e: React.PointerEvent<HTMLDivElement>) {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    dragStartRef.current = null;
    clearHoldTimer();
    setHeld(false);
    setIsDragging(false);
    pointerDownRef.current = false;
    longHoldRef.current = false;
  }

  const msgWidth = Math.round(KITE_SIZE * 0.72);
  const msgFontPx = Math.round(KITE_SIZE * 0.095);
  const msgMaxH = Math.round(KITE_SIZE * 0.52);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${kite.position_x}%`,
        top: `${kite.position_y}%`,
        zIndex: hovered || held || isDragging ? 50 : 10,
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
      {/* Drag translate wrapper — also the hover boundary for the card */}
      <div
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          willChange: isDragging ? "transform" : "auto",
          position: "relative",
        }}
        onMouseEnter={!isOwn ? handleMouseEnter : undefined}
        onMouseLeave={!isOwn ? handleMouseLeave : undefined}
      >
        {/* Ambient glow pulse */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: `${-Math.round(KITE_SIZE * 0.26)}px`,
            borderRadius: "50%",
            background: `radial-gradient(ellipse at center, ${colorEntry.glow}, transparent 72%)`,
            filter: "blur(14px)",
            pointerEvents: "none",
            zIndex: -1,
          }}
          animate={{ opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 3.6 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Physics / interactive kite body */}
        <motion.div
          style={{
            cursor: isDragging ? "grabbing" : held ? "grabbing" : "grab",
            userSelect: "none",
            touchAction: "none",
            filter: hovered || held || isDragging ? glowHovered : glowResting,
            transition: "filter 0.32s ease",
          }}
          animate={
            physicsPaused
              ? { rotate: isDragging ? 0 : held ? -4 : 0, x: 0, y: 0, scale: held && !isDragging ? 1.07 : isDragging ? 1.04 : 1 }
              : {
                  rotate: motionProps.rotate,
                  x: motionProps.x,
                  y: motionProps.y,
                  scale: 1,
                }
          }
          transition={
            physicsPaused
              ? { duration: 0.22, ease: "easeOut" }
              : {
                  duration: motionProps.duration,
                  delay: motionProps.delay,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <KiteSVG color={kite.color} tailColor={colorEntry.tail} size={KITE_SIZE} />

          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: msgFontPx,
              color: "rgba(255, 252, 245, 0.98)",
              textAlign: "center",
              width: msgWidth,
              lineHeight: 1.5,
              maxHeight: msgMaxH,
              overflow: "hidden",
              pointerEvents: "none",
              textShadow:
                "0 0 1px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,0.95), 0 2px 12px rgba(0,0,0,0.85)",
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 600,
              wordBreak: "break-word",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            {kite.message}
          </div>

          {kite.hug_count > 0 && (
            <div
              style={{
                position: "absolute",
                top: -12,
                right: -14,
                background: "rgba(245,166,35,0.95)",
                color: "#07090f",
                fontSize: 10,
                fontWeight: 700,
                borderRadius: "999px",
                padding: "3px 7px",
                pointerEvents: "none",
                fontFamily: "Inter, system-ui, sans-serif",
                lineHeight: 1.35,
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.55), 0 0 10px rgba(245,166,35,0.45)",
              }}
            >
              {kite.hug_count}🤗
            </div>
          )}

          {isOwn && (
            <div
              style={{
                position: "absolute",
                top: -10,
                left: -10,
                width: 17,
                height: 17,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8,
                pointerEvents: "none",
                boxShadow: "0 0 6px rgba(255,255,255,0.2)",
              }}
            >
              ✦
            </div>
          )}
        </motion.div>

        {/* Hover card — outside the rotating physics div so it stays axis-aligned */}
        <AnimatePresence>
          {hovered && !isOwn && kite.nepaliPhrase && (
            <div
              onMouseEnter={() => clearTimeout(leaveTimerRef.current)}
              onMouseLeave={handleMouseLeave}
            >
              <KiteHoverCard
                nepaliPhrase={kite.nepaliPhrase}
                silencingPhrase={kite.silencingPhrase}
                onRelate={handleRelate}
                onJustFeel={handleJustFeel}
                positionRight={kite.position_x > 55}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
