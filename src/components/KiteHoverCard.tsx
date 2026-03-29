"use client";
import { motion } from "framer-motion";

type Props = {
  nepaliPhrase: string;
  silencingPhrase?: string;
  onRelate: () => void;
  onJustFeel: () => void;
  positionRight?: boolean;
};

export function KiteHoverCard({
  nepaliPhrase,
  silencingPhrase,
  onRelate,
  onJustFeel,
  positionRight = false,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: 8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{
        position: "absolute",
        top: "50%",
        [positionRight ? "left" : "right"]: "calc(100% + 14px)",
        transform: "translateY(-50%)",
        width: 224,
        background: "rgba(8, 10, 18, 0.97)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 14,
        padding: "16px 18px",
        zIndex: 100,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
        pointerEvents: "all",
      }}
    >
      {/* Connector arrow */}
      <div style={{
        position: "absolute",
        top: "50%",
        [positionRight ? "right" : "left"]: -7,
        transform: "translateY(-50%)",
        width: 0,
        height: 0,
        borderTop: "7px solid transparent",
        borderBottom: "7px solid transparent",
        [positionRight ? "borderLeft" : "borderRight"]: "7px solid rgba(8,10,18,0.97)",
      }} />

      {/* Section label */}
      <p style={{
        fontSize: 9,
        color: "rgba(255,255,255,0.22)",
        letterSpacing: "1.4px",
        textTransform: "uppercase",
        marginBottom: 10,
        fontFamily: "Inter, sans-serif",
      }}>
        घरमा यसो भन्छन्
      </p>

      {/* Nepali phrase — larger, more readable */}
      <p style={{
        fontSize: 14,
        color: "rgba(255,255,255,0.78)",
        lineHeight: 1.75,
        marginBottom: silencingPhrase ? 14 : 18,
        borderLeft: "2px solid rgba(245,166,35,0.4)",
        paddingLeft: 11,
        fontFamily: "'Noto Sans Devanagari', 'Mangal', 'Arial Unicode MS', sans-serif",
        fontWeight: 400,
      }}>
        {nepaliPhrase}
      </p>

      {/* Silencing phrase — optional */}
      {silencingPhrase && (
        <>
          <p style={{
            fontSize: 9,
            color: "rgba(255,120,100,0.45)",
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            marginBottom: 8,
            fontFamily: "Inter, sans-serif",
          }}>
            What shut you down
          </p>
          <div style={{
            background: "rgba(180,60,60,0.08)",
            border: "1px solid rgba(255,100,80,0.14)",
            borderRadius: 8,
            padding: "10px 12px",
            marginBottom: 18,
          }}>
            <p style={{
              fontSize: 12,
              color: "rgba(255,190,180,0.62)",
              lineHeight: 1.6,
              fontStyle: "italic",
              fontFamily: "Inter, sans-serif",
            }}>
              &ldquo;{silencingPhrase}&rdquo;
            </p>
          </div>
        </>
      )}

      {/* Do you relate */}
      <p style={{
        fontSize: 10,
        color: "rgba(255,255,255,0.22)",
        marginBottom: 10,
        letterSpacing: "0.3px",
        fontFamily: "Inter, sans-serif",
      }}>
        Do you relate?
      </p>

      {/* Send a hug */}
      <button
        onClick={(e) => { e.stopPropagation(); onRelate(); }}
        style={{
          width: "100%",
          background: "rgba(245,166,35,0.14)",
          border: "1px solid rgba(245,166,35,0.32)",
          borderRadius: 9,
          padding: "10px",
          color: "rgba(245,166,35,0.95)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 8,
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.3px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        🤍 Send a hug
      </button>

      {/* Just feel it */}
      <button
        onClick={(e) => { e.stopPropagation(); onJustFeel(); }}
        style={{
          width: "100%",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 9,
          padding: "9px",
          color: "rgba(255,255,255,0.28)",
          fontSize: 11,
          cursor: "pointer",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.3px",
        }}
      >
        Just feel it
      </button>
    </motion.div>
  );
}
