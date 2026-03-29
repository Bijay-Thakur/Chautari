"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const MAX_LEN = 48;
const MIN_LEN = 1;

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (anonymousName: string) => void;
};

export default function EnterChautariModal({ open, onClose, onConfirm }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const descId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setValue("");
      setError(null);
      return;
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, handleKeyDown]);

  const submit = () => {
    const trimmed = value.trim();
    if (trimmed.length < MIN_LEN) {
      setError("Please add a name to continue.");
      inputRef.current?.focus();
      return;
    }
    if (trimmed.length > MAX_LEN) {
      setError(`Keep it under ${MAX_LEN} characters.`);
      return;
    }
    setError(null);
    onConfirm(trimmed);
  };

  if (!mounted) return null;

  const panel = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="enter-chautari-modal"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 z-0 bg-[rgba(4,2,0,0.72)] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="relative z-[1] w-full max-w-md overflow-hidden rounded-[22px] border border-[rgba(220,190,130,0.18)] shadow-[0_24px_80px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.06)]"
            style={{
              background:
                "linear-gradient(165deg, rgba(22,18,14,0.96) 0%, rgba(12,10,8,0.98) 55%, rgba(8,7,6,0.99) 100%)",
            }}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-50"
              style={{
                background: "radial-gradient(circle, rgba(52,211,153,0.14) 0%, transparent 70%)",
                filter: "blur(2px)",
              }}
            />
            <div
              className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full opacity-40"
              style={{
                background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)",
              }}
            />

            <div className="relative px-6 pb-7 pt-8 sm:px-8 sm:pb-8 sm:pt-9">
              <div
                className="mx-auto mb-5 h-px w-16"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(143, 188, 159, 0.5), transparent)",
                }}
              />

              <h2
                id={titleId}
                className="font-display text-center text-[1.35rem] leading-tight tracking-tight text-[#efe4d0] sm:text-[1.5rem]"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.45)" }}
              >
                A name for this visit
              </h2>
              <p
                id={descId}
                className="mx-auto mt-2 max-w-[22rem] text-center text-[0.82rem] leading-relaxed text-[rgba(185,215,200,0.78)]"
              >
                Choose something that feels right — it stays on this device only, and isn’t your real name.
              </p>

              <label htmlFor="chautari-anon-name" className="sr-only">
                Anonymous name
              </label>
              <input
                ref={inputRef}
                id="chautari-anon-name"
                type="text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                maxLength={MAX_LEN}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder="e.g. Quiet River, या एक नाम"
                className="mt-6 w-full rounded-xl border border-[rgba(220,190,130,0.2)] bg-[rgba(6,5,4,0.65)] px-4 py-3.5 font-sans text-[0.95rem] text-[#efe4d0] placeholder:text-[rgba(180,165,140,0.38)] outline-none ring-0 transition-[border-color,box-shadow] focus:border-[rgba(143,188,159,0.45)] focus:shadow-[0_0_0_3px_rgba(52,211,153,0.12)]"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
              />

              {error && (
                <p className="mt-2 text-center text-[0.78rem] text-amber-200/90" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="order-2 rounded-full border border-[rgba(220,190,130,0.2)] bg-transparent px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[rgba(220,200,165,0.85)] transition-colors hover:bg-[rgba(255,255,255,0.04)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/45 sm:order-1"
                >
                  Not now
                </button>
                <button
                  type="button"
                  onClick={submit}
                  className="order-1 rounded-full px-6 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#0a0f14] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0a08] active:scale-[0.98] sm:order-2"
                  style={{
                    background: "linear-gradient(145deg, #fde68a 0%, #d4a574 42%, #b45309 115%)",
                    border: "1px solid rgba(255, 235, 200, 0.4)",
                    boxShadow:
                      "0 2px 0 rgba(255,255,255,0.28) inset, 0 8px 24px rgba(217, 119, 6, 0.28)",
                  }}
                >
                  Enter the room
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(panel, document.body);
}
