"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, Mic, MicOff, Sparkles, Volume2 } from "lucide-react";
import type { MentalHealthBucket } from "@/data/comeSitConfig";
import {
  BUCKET_DISPLAY,
  BUCKET_VIDEO_URLS,
  BUCKET_WARM_HIGHLIGHT,
  researchLinkForBucket,
} from "@/data/comeSitConfig";
import CuratedResearchList from "@/components/come-sit/CuratedResearchList";
import {
  createSpeechRecognition,
  isBrowserSpeechSupported,
  type BrowserSpeechRecognition,
  type BrowserSpeechRecognitionEvent,
} from "@/lib/browserSpeech";

type Phase = "speak" | "transcribing" | "classifying" | "watch" | "error";

type ResourceWay = { title: string; description: string };

type ResourcesState = {
  ways: ResourceWay[];
  learnMoreSummary: string;
  source?: string;
  notice?: string;
};

const BUCKET_ACCENT: Record<
  MentalHealthBucket,
  { ring: string; soft: string; card: string; glow: string; stepDot: string }
> = {
  depression: {
    ring: "rgba(255, 190, 200, 0.5)",
    soft: "rgba(180, 100, 120, 0.28)",
    card: "linear-gradient(155deg, rgba(255,228,232,0.2) 0%, rgba(120,64,78,0.42) 55%, rgba(60,36,44,0.5) 100%)",
    glow: "rgba(255, 180, 190, 0.14)",
    stepDot: "linear-gradient(135deg, #ffb4c0, #c4788a)",
  },
  anxiety: {
    ring: "rgba(190, 235, 195, 0.48)",
    soft: "rgba(100, 150, 110, 0.26)",
    card: "linear-gradient(155deg, rgba(230,255,236,0.18) 0%, rgba(64,108,78,0.4) 55%, rgba(36,58,44,0.48) 100%)",
    glow: "rgba(170, 220, 180, 0.12)",
    stepDot: "linear-gradient(135deg, #b8e8c0, #6a9b72)",
  },
  psychosis: {
    ring: "rgba(215, 195, 255, 0.45)",
    soft: "rgba(130, 100, 170, 0.24)",
    card: "linear-gradient(155deg, rgba(244,236,255,0.18) 0%, rgba(88,68,118,0.4) 55%, rgba(48,38,68,0.48) 100%)",
    glow: "rgba(200, 180, 255, 0.12)",
    stepDot: "linear-gradient(135deg, #d4c4f8, #8b74b8)",
  },
};

function pickMime(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
    return "audio/webm;codecs=opus";
  }
  if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
  if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
  return undefined;
}

export default function ComeSitFlow() {
  const [phase, setPhase] = useState<Phase>("speak");
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [bucket, setBucket] = useState<MentalHealthBucket | null>(null);
  const [title, setTitle] = useState("");
  const [howItAffects, setHowItAffects] = useState("");

  const [showSolutions, setShowSolutions] = useState(false);
  const [resources, setResources] = useState<ResourcesState | null>(null);
  const [resLoading, setResLoading] = useState(false);
  const [resNotice, setResNotice] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const transcriptRef = useRef("");
  transcriptRef.current = transcript;

  const [liveSpeechOk, setLiveSpeechOk] = useState(false);
  useEffect(() => {
    setLiveSpeechOk(isBrowserSpeechSupported());
  }, []);

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const keepListeningRef = useRef(false);
  const prefixRef = useRef("");
  const sessionFinalRef = useRef("");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recRef.current = null;
  }, []);

  const stopBrowserRecognition = useCallback(() => {
    keepListeningRef.current = false;
    const r = recognitionRef.current;
    recognitionRef.current = null;
    if (r) {
      try {
        r.onend = null;
        r.stop();
      } catch {
        try {
          r.abort();
        } catch {
          /* noop */
        }
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      stopStream();
      stopBrowserRecognition();
    };
  }, [stopStream, stopBrowserRecognition]);

  const startRecording = async () => {
    setError(null);

    if (liveSpeechOk) {
      const Rec = createSpeechRecognition();
      if (!Rec) {
        setError("Live speech is not available. Try Chrome, Edge, or Safari.");
        return;
      }

      prefixRef.current = transcriptRef.current.trimEnd();
      sessionFinalRef.current = "";

      const recognition = Rec;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const r = event.results[i];
          const piece = r[0]?.transcript ?? "";
          if (r.isFinal) {
            sessionFinalRef.current += piece;
          } else {
            interim += piece;
          }
        }
        const pre = prefixRef.current.trimEnd();
        const sess = sessionFinalRef.current.trim();
        const int = interim.trim();
        const parts = [pre, sess, int].filter((p) => p.length > 0);
        setTranscript(parts.join(" "));
      };

      recognition.onerror = (event) => {
        if (event.error === "no-speech" || event.error === "aborted") return;
        if (event.error === "not-allowed") {
          setError("Microphone permission was blocked. Allow the mic to use live captions.");
          keepListeningRef.current = false;
          setRecording(false);
          return;
        }
        setError(`Voice capture: ${event.error}`);
      };

      recognition.onend = () => {
        if (keepListeningRef.current && recognitionRef.current === recognition) {
          try {
            recognition.start();
          } catch {
            /* InvalidStateError: already started */
          }
        }
      };

      recognitionRef.current = recognition;
      keepListeningRef.current = true;

      try {
        recognition.start();
        setRecording(true);
      } catch {
        setError("Could not start live transcription. Try again or use another browser.");
        recognitionRef.current = null;
        keepListeningRef.current = false;
      }
      return;
    }

    /* Fallback: record blob → Whisper */
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone is not available in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mime = pickMime();
      const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.start(200);
      recRef.current = mr;
      setRecording(true);
    } catch {
      setError("We could not access the microphone. Check permissions and try again.");
    }
  };

  const stopRecording = async () => {
    if (liveSpeechOk && recognitionRef.current) {
      stopBrowserRecognition();
      setRecording(false);
      setTranscript((t) => t.trim());
      return;
    }

    const mr = recRef.current;
    if (!mr || mr.state === "inactive") {
      setRecording(false);
      stopStream();
      return;
    }

    await new Promise<void>((resolve) => {
      mr.addEventListener("stop", () => resolve(), { once: true });
      mr.stop();
    });

    setRecording(false);
    stopStream();

    const blobType = mr.mimeType || "audio/webm";
    const blob = new Blob(chunksRef.current, { type: blobType });
    if (blob.size < 200) {
      setError("Recording was too short. Please try again.");
      return;
    }

    setPhase("transcribing");
    const fd = new FormData();
    const ext = blobType.includes("mp4") ? "m4a" : "webm";
    fd.append("audio", blob, `recording.${ext}`);

    try {
      const res = await fetch("/api/come-sit/transcribe", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Transcription failed.");
      }
      setTranscript(String(data.text ?? "").trim());
      setPhase("speak");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transcription failed.");
      setPhase("error");
    }
  };

  const fetchResources = useCallback(async (b: MentalHealthBucket, context: string) => {
    setResLoading(true);
    setResNotice(null);
    try {
      const res = await fetch("/api/come-sit/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket: b, context }),
      });
      const data = await res.json();
      setResources({
        ways: Array.isArray(data.ways) ? data.ways : [],
        learnMoreSummary: String(data.learnMoreSummary ?? ""),
        source: data.source,
      });
      if (data.notice) setResNotice(String(data.notice));
    } catch {
      setResources(null);
      setResNotice("Could not load suggestions. You can still use the research link below.");
    } finally {
      setResLoading(false);
    }
  }, []);

  const submitFeelings = async () => {
    const t = transcript.trim();
    if (t.length < 3) {
      setError("Add a few words (or record again) before continuing.");
      return;
    }
    setError(null);
    setPhase("classifying");
    try {
      const res = await fetch("/api/come-sit/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Could not process your words.");
      }
      const b = data.bucket as MentalHealthBucket;
      setBucket(b);
      setTitle(String(data.title ?? ""));
      setHowItAffects(String(data.howItAffects ?? ""));
      setPhase("watch");
      setShowSolutions(false);
      void fetchResources(b, t);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPhase("speak");
    }
  };

  const onVideoEnded = () => {
    setShowSolutions(true);
  };

  const reset = () => {
    stopBrowserRecognition();
    stopStream();
    setRecording(false);
    setPhase("speak");
    setTranscript("");
    setBucket(null);
    setTitle("");
    setHowItAffects("");
    setShowSolutions(false);
    setResources(null);
    setResNotice(null);
    setError(null);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const meta = bucket ? BUCKET_DISPLAY[bucket] : null;
  const videoSrc = bucket ? BUCKET_VIDEO_URLS[bucket] : "";

  return (
    <div
      className="min-h-screen relative overflow-x-hidden pb-24"
      style={{ background: "#0a0807" }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120,72,58,0.25), transparent 55%)",
        }}
      />

      <header className="relative z-10 flex items-center gap-3 px-5 pt-6 pb-2 max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-90"
          style={{ color: "rgba(196,163,90,0.75)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto px-5 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p
            className="text-[0.65rem] uppercase tracking-[0.35em] mb-3"
            style={{ color: "rgba(196,163,90,0.45)" }}
          >
            Come sit with yourself
          </p>
          <h1
            className="font-display text-[clamp(1.75rem,6vw,2.35rem)] leading-tight mb-4"
            style={{ color: "#efe4d0" }}
          >
            Speak what you&apos;re holding
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(212,196,176,0.55)" }}>
            {liveSpeechOk
              ? "Words appear as you speak. Stop when you’re done, edit if needed, then continue. Educational only — not a diagnosis or emergency service."
              : "Record your voice — we transcribe after you stop. You can also type. Educational only — not a diagnosis or emergency service."}
          </p>
        </motion.div>

        {phase === "speak" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[22px] p-6 sm:p-8 space-y-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(196,163,90,0.12)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.35)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={recording ? stopRecording : startRecording}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold text-sm transition-all"
                style={{
                  background: recording
                    ? "linear-gradient(135deg, rgba(180,72,72,0.35), rgba(120,40,40,0.45))"
                    : "linear-gradient(135deg, rgba(196,163,90,0.22), rgba(154,123,60,0.15))",
                  color: recording ? "#fecaca" : "rgba(244,232,216,0.95)",
                  border: `1px solid ${recording ? "rgba(248,113,113,0.35)" : "rgba(196,163,90,0.28)"}`,
                }}
              >
                {recording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    {liveSpeechOk ? "Stop listening" : "Stop &amp; transcribe"}
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    {liveSpeechOk ? "Speak — live transcript" : "Speak — record audio"}
                  </>
                )}
              </button>
              {recording && (
                <span className="text-xs flex items-center gap-2" style={{ color: "#fca5a5" }}>
                  <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  {liveSpeechOk ? "Live captioning…" : "Recording…"}
                </span>
              )}
            </div>

            {liveSpeechOk ? (
              <p className="text-xs leading-relaxed" style={{ color: "rgba(196,163,90,0.42)" }}>
                Live transcription runs in your browser (Chrome, Edge, or Safari). Text updates as you
                talk; stop when you’re done, then edit if anything looks off.
              </p>
            ) : (
              <p className="text-xs leading-relaxed" style={{ color: "rgba(196,163,90,0.42)" }}>
                This browser uses server transcription after you stop. For real-time captions, try
                Chrome or Edge — or type below.
              </p>
            )}

            <div>
              <label
                htmlFor="come-sit-transcript"
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "rgba(196,163,90,0.65)" }}
              >
                Your words (edit if the transcript is off)
              </label>
              <textarea
                id="come-sit-transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                readOnly={recording && liveSpeechOk}
                rows={6}
                placeholder={
                  liveSpeechOk
                    ? "Tap Speak — your words will appear here as you talk."
                    : "Record above, or type here if you prefer not to use the mic."
                }
                className="w-full rounded-xl px-4 py-3 text-sm leading-relaxed resize-y outline-none transition-shadow"
                style={{
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(248,240,230,0.95)",
                  minHeight: "140px",
                  opacity: recording && liveSpeechOk ? 0.98 : 1,
                }}
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: "#fca5a5" }}>
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={submitFeelings}
              disabled={transcript.trim().length < 3}
              className="w-full rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-35 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #c4a35a 0%, #8f7030 100%)",
                color: "#1a1208",
                boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              }}
            >
              <Sparkles className="w-4 h-4" />
              This is how I feel
            </button>
          </motion.section>
        )}

        {(phase === "transcribing" || phase === "classifying") && (
          <div
            className="flex flex-col items-center justify-center gap-4 py-24 rounded-[22px]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(196,163,90,0.1)",
            }}
          >
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: "rgba(196,163,90,0.85)" }} />
            <p className="text-sm" style={{ color: "rgba(212,196,176,0.6)" }}>
              {phase === "transcribing" ? "Turning your voice into text…" : "Listening to themes with care…"}
            </p>
          </div>
        )}

        {phase === "watch" && bucket && meta && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div
              className="rounded-[22px] p-5 sm:p-6 mb-4"
              style={{
                background: `linear-gradient(135deg, ${BUCKET_ACCENT[bucket].soft} 0%, rgba(28,22,18,0.75) 100%)`,
                border: `2px solid ${BUCKET_ACCENT[bucket].ring}`,
                boxShadow: `0 0 40px ${BUCKET_ACCENT[bucket].soft}, inset 0 1px 0 rgba(255,245,230,0.12)`,
              }}
            >
              <p
                className="text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-2"
                style={{ color: "rgba(255,236,210,0.75)" }}
              >
                Your reflection points toward
              </p>
              <p
                className="font-display text-lg sm:text-xl mb-3"
                style={{ color: "#fff5e6", textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
              >
                {BUCKET_WARM_HIGHLIGHT[bucket].theme}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,232,215,0.88)" }}>
                {BUCKET_WARM_HIGHLIGHT[bucket].message}
              </p>
            </div>

            <div
              className="rounded-[22px] p-6 sm:p-8 space-y-4"
              style={{
                background: "rgba(255,248,238,0.06)",
                border: "1px solid rgba(196,163,90,0.22)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,250,240,0.08)",
              }}
            >
              <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(196,163,90,0.65)" }}>
                What we heard in your words
              </p>
              <h2 className="font-display text-xl sm:text-2xl leading-snug" style={{ color: "#faf3e6" }}>
                {title || meta.headline}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(235,218,195,0.9)" }}>
                {howItAffects}
              </p>
              <p className="text-xs italic leading-relaxed pt-2 border-t border-amber-100/10" style={{ color: "rgba(200,185,165,0.55)" }}>
                This is supportive routing for learning, not a clinical label. If you are in danger,
                contact local emergency services or your crisis line.
              </p>
            </div>

            <div
              className="rounded-[22px] overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#000",
              }}
            >
              <div
                className="flex items-center gap-2 px-4 py-2 text-xs"
                style={{
                  background: "rgba(30,24,18,0.95)",
                  color: "rgba(196,163,90,0.65)",
                }}
              >
                <Volume2 className="w-3.5 h-3.5" />
                {meta.videoCaption}
              </div>
              <video
                key={videoSrc}
                ref={videoRef}
                className="w-full aspect-video bg-black"
                controls
                playsInline
                src={videoSrc}
                onEnded={onVideoEnded}
              />
              <button
                type="button"
                onClick={onVideoEnded}
                className="w-full text-center text-xs py-2.5 transition-opacity hover:opacity-90"
                style={{ color: "rgba(196,163,90,0.45)" }}
              >
                Clip won&apos;t play? Open suggestions
              </button>
            </div>

            <button
              type="button"
              onClick={reset}
              className="text-sm underline underline-offset-4 mx-auto block"
              style={{ color: "rgba(196,163,90,0.5)" }}
            >
              Start over
            </button>
          </motion.section>
        )}

        {phase === "error" && (
          <div className="text-center py-12 space-y-4">
            <p style={{ color: "#fca5a5" }}>{error}</p>
            <button
              type="button"
              onClick={() => {
                setPhase("speak");
                setError(null);
              }}
              className="text-sm underline"
              style={{ color: "rgba(196,163,90,0.7)" }}
            >
              Try again
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSolutions && bucket && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background:
                "linear-gradient(180deg, rgba(45, 28, 22, 0.55) 0%, rgba(18, 12, 8, 0.78) 100%)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setShowSolutions(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="solutions-title"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-[28px] p-6 sm:p-8 shadow-2xl"
              style={{
                background: `linear-gradient(168deg, rgba(72, 48, 38, 0.98) 0%, rgba(48, 34, 28, 0.99) 35%, rgba(32, 24, 20, 1) 100%)`,
                border: `2px solid rgba(255, 200, 160, 0.28)`,
                boxShadow: `0 32px 90px rgba(0,0,0,0.5), 0 0 80px ${BUCKET_ACCENT[bucket].glow}, inset 0 1px 0 rgba(255, 248, 235, 0.22)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-2xl px-4 py-2.5 mb-5 text-center text-[0.68rem] font-bold uppercase tracking-[0.2em]"
                style={{
                  background: `linear-gradient(90deg, rgba(255,210,170,0.2), rgba(255,230,200,0.12))`,
                  color: "rgba(255, 245, 220, 0.95)",
                  border: "1px solid rgba(255, 200, 150, 0.35)",
                  boxShadow: "0 4px 20px rgba(255, 180, 120, 0.08)",
                }}
              >
                {BUCKET_WARM_HIGHLIGHT[bucket].theme}
              </div>
              <h3
                id="solutions-title"
                className="font-display text-xl sm:text-2xl mb-2 leading-tight"
                style={{
                  color: "#fffaf0",
                  textShadow: "0 2px 24px rgba(255, 200, 150, 0.2)",
                }}
              >
                Gentle steps you might try
              </h3>
              <p
                className="text-sm mb-6 leading-relaxed rounded-xl px-3 py-2.5 -mx-1"
                style={{
                  color: "rgba(255, 235, 210, 0.9)",
                  background: "rgba(255, 200, 150, 0.06)",
                  border: "1px solid rgba(255, 210, 180, 0.12)",
                }}
              >
                These ideas come from public mental-health education — they&apos;re invitations, not
                instructions. Pair them with someone you trust when you can. Every small choice toward care
                matters.
              </p>

              {resLoading && (
                <div className="flex items-center gap-2 py-8 justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: "rgba(255, 205, 150, 0.95)" }} />
                  <span className="text-sm" style={{ color: "rgba(255, 220, 190, 0.8)" }}>
                    Gathering kind next steps…
                  </span>
                </div>
              )}

              {!resLoading && resources?.ways && (
                <ul className="space-y-3.5 mb-8">
                  {resources.ways.map((w, i) => (
                    <motion.li
                      key={`${w.title}-${i}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-2xl p-4 sm:p-5"
                      style={{
                        background: BUCKET_ACCENT[bucket].card,
                        border: `1px solid ${BUCKET_ACCENT[bucket].ring}`,
                        boxShadow: `0 10px 32px rgba(0,0,0,0.25), 0 0 40px ${BUCKET_ACCENT[bucket].glow}, inset 0 1px 0 rgba(255, 252, 245, 0.14)`,
                      }}
                    >
                      <p
                        className="font-semibold text-sm mb-2 flex items-center gap-3"
                        style={{ color: "#fff8f0" }}
                      >
                        <span
                          className="inline-flex w-7 h-7 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold shadow-md"
                          style={{
                            background: BUCKET_ACCENT[bucket].stepDot,
                            color: "#1a1008",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                          }}
                        >
                          {i + 1}
                        </span>
                        {w.title}
                      </p>
                      <p className="text-sm leading-relaxed pl-10" style={{ color: "rgba(255, 236, 218, 0.92)" }}>
                        {w.description}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              )}

              {resNotice && (
                <p
                  className="text-xs mb-4 px-3 py-2.5 rounded-xl"
                  style={{
                    color: "rgba(255, 220, 190, 0.88)",
                    background: "rgba(255, 190, 120, 0.1)",
                    border: "1px solid rgba(255, 200, 150, 0.22)",
                  }}
                >
                  {resNotice}
                </p>
              )}

              {resources?.learnMoreSummary && !resLoading && (
                <p
                  className="text-sm mb-8 leading-relaxed px-3 py-3 rounded-xl italic"
                  style={{
                    color: "rgba(255, 225, 195, 0.88)",
                    background: "rgba(255, 240, 220, 0.05)",
                    borderLeft: "3px solid rgba(255, 190, 130, 0.45)",
                  }}
                >
                  {resources.learnMoreSummary}
                </p>
              )}

              <div
                className="relative mb-6 pt-2"
                style={{
                  borderTop: "1px solid rgba(255, 200, 160, 0.15)",
                }}
              >
                <p
                  className="text-[0.65rem] font-bold uppercase tracking-[0.28em] mb-1"
                  style={{ color: "rgba(255, 200, 150, 0.65)" }}
                >
                  Go deeper when you&apos;re ready
                </p>
                <h4
                  className="font-display text-lg sm:text-xl mb-1"
                  style={{ color: "#fff5e6" }}
                >
                  Research &amp; case study resources
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed mb-5" style={{ color: "rgba(255, 220, 195, 0.78)" }}>
                  Scholarly articles, clinical case reports, and lived-experience stories — outside links
                  open in a new tab.
                </p>
                <CuratedResearchList highlightBucket={bucket} compact />
              </div>

              <a
                href={researchLinkForBucket(bucket)}
                className="inline-flex items-center justify-center w-full rounded-xl py-3 font-semibold text-sm mb-2 transition-all hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 210, 165, 0.35) 0%, rgba(200, 150, 90, 0.45) 100%)",
                  border: "1px solid rgba(255, 235, 200, 0.5)",
                  color: "#2a1810",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.35)",
                }}
              >
                Open full resource page
              </a>

              <button
                type="button"
                onClick={() => setShowSolutions(false)}
                className="w-full text-sm py-2.5 rounded-xl transition-colors hover:bg-white/5"
                style={{ color: "rgba(255, 215, 185, 0.7)" }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
