"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, Loader2, Mic, MicOff, Sparkles, Volume2 } from "lucide-react";
import type { MentalHealthBucket } from "@/data/comeSitConfig";
import {
  BUCKET_DISPLAY,
  BUCKET_VIDEO_URLS,
  BUCKET_WARM_HIGHLIGHT,
  researchLinkForBucket,
} from "@/data/comeSitConfig";
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
};

/** Bucket accents — light glass + neon per theme */
const BUCKET_ACCENT: Record<
  MentalHealthBucket,
  { ring: string; soft: string; card: string; glow: string; stepDot: string }
> = {
  depression: {
    ring: "rgba(244, 114, 182, 0.45)",
    soft: "rgba(255, 228, 235, 0.95)",
    card: "linear-gradient(155deg, rgba(255,245,248,0.92) 0%, rgba(255,220,230,0.88) 55%, rgba(255,200,215,0.75) 100%)",
    glow: "rgba(244, 114, 182, 0.25)",
    stepDot: "linear-gradient(135deg, #f9a8d4, #db2777)",
  },
  anxiety: {
    ring: "rgba(34, 211, 238, 0.5)",
    soft: "rgba(224, 255, 240, 0.9)",
    card: "linear-gradient(155deg, rgba(240,253,250,0.95) 0%, rgba(204,251,241,0.88) 55%, rgba(167,243,208,0.75) 100%)",
    glow: "rgba(45, 212, 191, 0.28)",
    stepDot: "linear-gradient(135deg, #5eead4, #0d9488)",
  },
  psychosis: {
    ring: "rgba(167, 139, 250, 0.5)",
    soft: "rgba(245, 243, 255, 0.95)",
    card: "linear-gradient(155deg, rgba(250,245,255,0.95) 0%, rgba(237,233,254,0.9) 55%, rgba(221,214,254,0.8) 100%)",
    glow: "rgba(167, 139, 250, 0.28)",
    stepDot: "linear-gradient(135deg, #c4b5fd, #7c3aed)",
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
    } catch {
      setResources(null);
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

  /** Open the gentle-steps modal — called when the clip finishes (`onEnded`) or as a manual fallback. */
  const onVideoEnded = useCallback(() => {
    setShowSolutions(true);
  }, []);

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
      style={{
        background:
          "linear-gradient(165deg, #f8fafc 0%, #eef6ff 35%, #f5f0ff 70%, #fffbeb 100%)",
      }}
    >
      {/* Soft neon wash + glass depth */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 15% 10%, rgba(34, 211, 238, 0.12), transparent 50%),
            radial-gradient(ellipse 70% 50% at 85% 20%, rgba(167, 139, 250, 0.1), transparent 45%),
            radial-gradient(ellipse 80% 40% at 50% 100%, rgba(251, 191, 36, 0.08), transparent 55%)
          `,
        }}
      />

      <header className="relative z-10 flex items-center gap-3 px-5 pt-6 pb-2 max-w-2xl mx-auto">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:text-cyan-600"
          style={{ color: "rgba(30, 41, 59, 0.65)" }}
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
            className="text-[0.65rem] uppercase tracking-[0.35em] mb-3 font-semibold"
            style={{ color: "rgba(8, 145, 178, 0.75)" }}
          >
            Come sit with yourself
          </p>
          <h1
            className="font-display text-[clamp(1.75rem,6vw,2.35rem)] leading-tight mb-4"
            style={{
              color: "#0f172a",
              textShadow: "0 0 40px rgba(34, 211, 238, 0.15)",
            }}
          >
            Speak what you&apos;re holding
          </h1>
          <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: "rgba(51, 65, 85, 0.72)" }}>
            {liveSpeechOk
              ? "Words appear as you speak. Stop when you’re done, edit if needed, then continue. Educational only — not a diagnosis or emergency service."
              : "Record your voice — we transcribe after you stop. You can also type. Educational only — not a diagnosis or emergency service."}
          </p>
        </motion.div>

        {phase === "speak" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[24px] p-6 sm:p-8 space-y-6 backdrop-blur-xl"
            style={{
              background: "rgba(255, 255, 255, 0.42)",
              border: "1px solid rgba(255, 255, 255, 0.65)",
              boxShadow:
                "0 4px 24px rgba(34, 211, 238, 0.08), 0 24px 64px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={recording ? stopRecording : startRecording}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold text-sm transition-all hover:brightness-[1.02] active:scale-[0.99]"
                style={{
                  background: recording
                    ? "linear-gradient(135deg, rgba(254, 202, 202, 0.95), rgba(252, 165, 165, 0.85))"
                    : "linear-gradient(135deg, rgba(224, 242, 254, 0.95), rgba(207, 250, 254, 0.75))",
                  color: recording ? "#991b1b" : "#0e7490",
                  border: recording
                    ? "1px solid rgba(248, 113, 113, 0.45)"
                    : "1px solid rgba(34, 211, 238, 0.45)",
                  boxShadow: recording
                    ? "0 0 24px rgba(248, 113, 113, 0.2)"
                    : "0 0 28px rgba(34, 211, 238, 0.22)",
                }}
              >
                {recording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    {liveSpeechOk ? "Stop listening" : "Stop & transcribe"}
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    {liveSpeechOk ? "Speak — live transcript" : "Speak — record audio"}
                  </>
                )}
              </button>
              {recording && (
                <span className="text-xs flex items-center gap-2 font-medium" style={{ color: "#dc2626" }}>
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#f87171]" />
                  {liveSpeechOk ? "Live captioning…" : "Recording…"}
                </span>
              )}
            </div>

            {liveSpeechOk ? (
              <p className="text-xs leading-relaxed" style={{ color: "rgba(71, 85, 105, 0.75)" }}>
                Live transcription runs in your browser (Chrome, Edge, or Safari). Text updates as you
                talk; stop when you’re done, then edit if anything looks off.
              </p>
            ) : (
              <p className="text-xs leading-relaxed" style={{ color: "rgba(71, 85, 105, 0.75)" }}>
                This browser uses server transcription after you stop. For real-time captions, try
                Chrome or Edge — or type below.
              </p>
            )}

            <div>
              <label
                htmlFor="come-sit-transcript"
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "rgba(14, 116, 144, 0.85)" }}
              >
                Your words (edit if the transcript is off)
              </label>
              <textarea
                id="come-sit-transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={6}
                placeholder={
                  liveSpeechOk
                    ? "Tap Speak — your words will appear here as you talk. You can also type or edit freely."
                    : "Record above, or type here if you prefer not to use the mic."
                }
                className="w-full rounded-xl px-4 py-3 text-sm leading-relaxed resize-y outline-none transition-shadow focus:ring-2 focus:ring-cyan-400/40"
                style={{
                  background: "rgba(255, 255, 255, 0.72)",
                  border: "1px solid rgba(167, 139, 250, 0.22)",
                  color: "#0f172a",
                  minHeight: "140px",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.8)",
                }}
              />
            </div>

            {error && (
              <p className="text-sm font-medium" style={{ color: "#dc2626" }}>
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={submitFeelings}
              disabled={transcript.trim().length < 3}
              className="w-full rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-35 disabled:cursor-not-allowed hover:brightness-[1.03] active:scale-[0.995]"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 45%, #d946ef 130%)",
                color: "#1e1b4b",
                boxShadow:
                  "0 8px 32px rgba(251, 191, 36, 0.35), 0 0 40px rgba(217, 70, 239, 0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              <Sparkles className="w-4 h-4" />
              This is how I feel
            </button>
          </motion.section>
        )}

        {(phase === "transcribing" || phase === "classifying") && (
          <div
            className="flex flex-col items-center justify-center gap-4 py-24 rounded-[24px] backdrop-blur-xl"
            style={{
              background: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 8px 40px rgba(34, 211, 238, 0.08)",
            }}
          >
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#0891b2" }} />
            <p className="text-sm font-medium" style={{ color: "rgba(51, 65, 85, 0.75)" }}>
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
              className="rounded-[24px] p-5 sm:p-6 mb-4 backdrop-blur-xl"
              style={{
                background: `linear-gradient(135deg, ${BUCKET_ACCENT[bucket].soft} 0%, rgba(255,255,255,0.55) 100%)`,
                border: `2px solid ${BUCKET_ACCENT[bucket].ring}`,
                boxShadow: `0 8px 40px ${BUCKET_ACCENT[bucket].glow}, inset 0 1px 0 rgba(255,255,255,0.9)`,
              }}
            >
              <p
                className="text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-2"
                style={{ color: "rgba(14, 116, 144, 0.75)" }}
              >
                Your reflection points toward
              </p>
              <p
                className="font-display text-lg sm:text-xl mb-3"
                style={{ color: "#0f172a", textShadow: "0 0 32px rgba(34, 211, 238, 0.2)" }}
              >
                {BUCKET_WARM_HIGHLIGHT[bucket].theme}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(51, 65, 85, 0.88)" }}>
                {BUCKET_WARM_HIGHLIGHT[bucket].message}
              </p>
            </div>

            <div
              className="rounded-[24px] p-6 sm:p-8 space-y-4 backdrop-blur-xl"
              style={{
                background: "rgba(255, 255, 255, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.65)",
                boxShadow:
                  "0 12px 48px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.85)",
              }}
            >
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "rgba(124, 58, 237, 0.7)" }}>
                What we heard in your words
              </p>
              <h2 className="font-display text-xl sm:text-2xl leading-snug" style={{ color: "#0f172a" }}>
                {title || meta.headline}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(51, 65, 85, 0.88)" }}>
                {howItAffects}
              </p>
              <p className="text-xs italic leading-relaxed pt-2 border-t border-slate-200/80" style={{ color: "rgba(100, 116, 139, 0.75)" }}>
                This is supportive routing for learning, not a clinical label. If you are in danger,
                contact local emergency services or your crisis line.
              </p>
            </div>

            <div
              className="rounded-[24px] overflow-hidden backdrop-blur-md"
              style={{
                border: "1px solid rgba(15, 23, 42, 0.12)",
                boxShadow: "0 16px 48px rgba(15, 23, 42, 0.08)",
                background: "rgba(15, 23, 42, 0.92)",
              }}
            >
              <div
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium backdrop-blur-sm"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "rgba(224, 242, 254, 0.9)",
                  borderBottom: "1px solid rgba(34, 211, 238, 0.15)",
                }}
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
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
              <div
                className="flex flex-col items-stretch border-t"
                style={{ borderColor: "rgba(34, 211, 238, 0.12)" }}
              >
                <Link
                  href={researchLinkForBucket(bucket)}
                  className="w-full text-center text-xs py-2.5 font-medium transition-colors hover:text-cyan-200 underline underline-offset-2"
                  style={{ color: "rgba(186, 230, 253, 0.92)" }}
                >
                  Learn more from real stories and research
                </Link>
                <button
                  type="button"
                  onClick={onVideoEnded}
                  className="w-full text-center text-[0.65rem] py-2 transition-colors hover:text-cyan-200/90"
                  style={{ color: "rgba(165, 243, 252, 0.45)" }}
                >
                  Can&apos;t play the video? Open suggestions
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={reset}
              className="text-sm underline underline-offset-4 mx-auto block font-medium transition-colors hover:text-cyan-600"
              style={{ color: "rgba(71, 85, 105, 0.75)" }}
            >
              Start over
            </button>
          </motion.section>
        )}

        {phase === "error" && (
          <div
            className="text-center py-12 space-y-4 rounded-[24px] backdrop-blur-xl px-4"
            style={{
              background: "rgba(254, 242, 242, 0.75)",
              border: "1px solid rgba(252, 165, 165, 0.4)",
            }}
          >
            <p className="font-medium" style={{ color: "#b91c1c" }}>{error}</p>
            <button
              type="button"
              onClick={() => {
                setPhase("speak");
                setError(null);
              }}
              className="text-sm underline font-medium hover:text-cyan-600"
              style={{ color: "#0891b2" }}
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
              background: "linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(241, 245, 249, 0.55) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
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
              className="w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-[28px] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
              style={{
                background: "linear-gradient(168deg, rgba(255,255,255,0.88) 0%, rgba(248, 250, 252, 0.92) 45%, rgba(255, 251, 235, 0.9) 100%)",
                border: `2px solid rgba(255, 255, 255, 0.85)`,
                boxShadow: `0 32px 90px rgba(15, 23, 42, 0.12), 0 0 60px ${BUCKET_ACCENT[bucket].glow}, inset 0 1px 0 rgba(255, 255, 255, 0.95)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-2xl px-4 py-2.5 mb-5 text-center text-[0.68rem] font-bold uppercase tracking-[0.2em]"
                style={{
                  background: `linear-gradient(90deg, rgba(224, 242, 254, 0.9), rgba(250, 232, 255, 0.85))`,
                  color: "#0f172a",
                  border: `1px solid ${BUCKET_ACCENT[bucket].ring}`,
                  boxShadow: `0 4px 24px ${BUCKET_ACCENT[bucket].glow}`,
                }}
              >
                {BUCKET_WARM_HIGHLIGHT[bucket].theme}
              </div>
              <h3
                id="solutions-title"
                className="font-display text-xl sm:text-2xl mb-2 leading-tight"
                style={{
                  color: "#0f172a",
                  textShadow: "0 0 40px rgba(34, 211, 238, 0.12)",
                }}
              >
                Gentle steps you might try
              </h3>
              <p
                className="text-sm mb-6 leading-relaxed rounded-xl px-3 py-2.5 -mx-1"
                style={{
                  color: "rgba(51, 65, 85, 0.88)",
                  background: "rgba(255, 255, 255, 0.55)",
                  border: "1px solid rgba(226, 232, 240, 0.9)",
                }}
              >
                These ideas come from public mental-health education — they&apos;re invitations, not
                instructions. Pair them with someone you trust when you can. Every small choice toward care
                matters.
              </p>

              {resLoading && (
                <div className="flex items-center gap-2 py-8 justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#0891b2" }} />
                  <span className="text-sm font-medium" style={{ color: "rgba(71, 85, 105, 0.85)" }}>
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
                      className="rounded-2xl p-4 sm:p-5 backdrop-blur-sm"
                      style={{
                        background: BUCKET_ACCENT[bucket].card,
                        border: `1px solid ${BUCKET_ACCENT[bucket].ring}`,
                        boxShadow: `0 8px 28px rgba(15, 23, 42, 0.06), 0 0 36px ${BUCKET_ACCENT[bucket].glow}, inset 0 1px 0 rgba(255, 255, 255, 0.75)`,
                      }}
                    >
                      <p
                        className="font-semibold text-sm mb-2 flex items-center gap-3"
                        style={{ color: "#0f172a" }}
                      >
                        <span
                          className="inline-flex w-7 h-7 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold shadow-md"
                          style={{
                            background: BUCKET_ACCENT[bucket].stepDot,
                            color: "#ffffff",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                          }}
                        >
                          {i + 1}
                        </span>
                        {w.title}
                      </p>
                      <p className="text-sm leading-relaxed pl-10" style={{ color: "rgba(51, 65, 85, 0.9)" }}>
                        {w.description}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              )}

              {resources?.learnMoreSummary && !resLoading && (
                <p
                  className="text-sm mb-6 leading-relaxed px-3 py-3 rounded-xl italic"
                  style={{
                    color: "rgba(51, 65, 85, 0.88)",
                    background: "rgba(254, 249, 195, 0.35)",
                    borderLeft: "3px solid rgba(251, 191, 36, 0.65)",
                  }}
                >
                  {resources.learnMoreSummary}
                </p>
              )}

              <div
                className="mb-2 pt-4"
                style={{ borderTop: "1px solid rgba(226, 232, 240, 0.95)" }}
              >
                <p
                  className="text-[0.65rem] font-bold uppercase tracking-[0.24em] mb-3 text-center"
                  style={{ color: "rgba(124, 58, 237, 0.65)" }}
                >
                  Continue exploring
                </p>
                <Link
                  href={researchLinkForBucket(bucket)}
                  onClick={() => setShowSolutions(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-sm transition-all hover:brightness-[1.02] hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: "linear-gradient(135deg, #22d3ee 0%, #a78bfa 55%, #fbbf24 130%)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    color: "#0f172a",
                    boxShadow: "0 8px 32px rgba(34, 211, 238, 0.25), inset 0 1px 0 rgba(255,255,255,0.45)",
                  }}
                >
                  <BookOpen className="w-4 h-4 shrink-0 opacity-90" aria-hidden />
                  Learn more from real stories and research
                </Link>
                <p className="text-center text-[0.7rem] mt-2.5 leading-relaxed" style={{ color: "rgba(100, 116, 139, 0.75)" }}>
                  Opens the research &amp; resources page for this theme.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSolutions(false)}
                className="w-full text-sm py-2.5 rounded-xl transition-colors hover:bg-slate-100/80 font-medium"
                style={{ color: "rgba(71, 85, 105, 0.85)" }}
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
