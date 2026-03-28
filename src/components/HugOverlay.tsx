"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  visible: boolean;
  kiteMessage: string;
  kiteOwnerName: string;
  onConnect: () => void;
  onDismiss: () => void;
};

export function HugOverlay({ visible, kiteMessage, kiteOwnerName, onConnect, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(7,9,15,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            zIndex: 50,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {/* Expanding rings */}
          {[128, 172, 216].map((size, i) => (
            <motion.div
              key={size}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.14 - i * 0.04 }}
              transition={{ delay: i * 0.14, duration: 0.65, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: "50%",
                border: "1.5px solid rgba(245,166,35,0.55)",
              }}
            />
          ))}

          {/* Core pulse circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.1, 1] }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "rgba(245,166,35,0.1)",
              border: "2px solid rgba(245,166,35,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              zIndex: 1,
            }}
          >
            🤍
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.5 }}
            style={{ textAlign: "center", zIndex: 1, padding: "0 24px" }}
          >
            <p
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 21,
                fontStyle: "italic",
                color: "rgba(245,230,200,0.95)",
                marginBottom: 12,
                lineHeight: 1.4,
              }}
            >
              Someone held your kite.
            </p>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.38)",
                lineHeight: 1.75,
                maxWidth: 240,
                fontStyle: "italic",
              }}
            >
              &ldquo;{kiteMessage}&rdquo;
            </p>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.22)",
                marginTop: 10,
                letterSpacing: "0.03em",
              }}
            >
              — {kiteOwnerName} is not alone right now.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.4 }}
            style={{ display: "flex", gap: 12, zIndex: 1 }}
          >
            <button
              onClick={onConnect}
              style={{
                background: "#f5a623",
                color: "#07090f",
                border: "none",
                borderRadius: 10,
                padding: "12px 26px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, system-ui, sans-serif",
                letterSpacing: "0.01em",
              }}
            >
              Talk to them →
            </button>
            <button
              onClick={onDismiss}
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.28)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "12px 26px",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Just feel it
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
