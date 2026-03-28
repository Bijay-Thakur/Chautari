"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { setAuthCookie } from "@/lib/authCookie";
import { saveUsername } from "@/lib/profileHelper";

/* ─────────────────────────────────────────────────────────────────────────────
   BACKGROUND — Himalayan sky scene
───────────────────────────────────────────────────────────────────────────── */

function MountainSVG() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
      aria-hidden
    >
      <defs>
        <linearGradient id="mtnFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b21b6" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.98" />
        </linearGradient>
        <linearGradient id="mtnMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4338ca" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="mtnNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#312e81" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="snowCap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf5ff" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#e9d5ff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="mistGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(167,139,250,0)" />
          <stop offset="45%" stopColor="rgba(167,139,250,0.14)" />
          <stop offset="100%" stopColor="rgba(109,40,217,0)" />
        </linearGradient>
      </defs>

      {/* Far range */}
      <path
        d="M -10 900 L -10 600 L 0 540 L 70 430 L 130 350 L 195 400 L 255 290 L 330 210 L 410 265 L 490 185 L 565 220 L 630 170 L 700 190 L 775 148 L 855 185 L 930 155 L 1005 205 L 1070 175 L 1145 230 L 1215 195 L 1290 248 L 1360 212 L 1440 265 L 1450 900 Z"
        fill="url(#mtnFar)"
      />
      {[{ cx: 490, tip: 185, w: 42 }, { cx: 630, tip: 170, w: 46 }, { cx: 775, tip: 148, w: 52 },
        { cx: 930, tip: 155, w: 44 }, { cx: 330, tip: 210, w: 34 }, { cx: 1070, tip: 175, w: 38 },
        { cx: 1360, tip: 212, w: 36 }].map(({ cx, tip, w }, i) => (
        <polygon key={i}
          points={`${cx},${tip} ${cx - w},${tip + w * 1.1} ${cx + w},${tip + w * 1.1}`}
          fill="url(#snowCap)" opacity={0.8} />
      ))}

      <rect x="0" y="260" width="1440" height="140" fill="url(#mistGrad)" opacity="0.65" />

      {/* Mid range */}
      <path
        d="M -10 900 L -10 720 L 60 650 L 150 580 L 250 610 L 350 530 L 450 555 L 545 470 L 640 500 L 730 420 L 820 460 L 920 400 L 1010 440 L 1105 408 L 1195 455 L 1285 420 L 1370 462 L 1450 500 L 1450 900 Z"
        fill="url(#mtnMid)"
      />
      {[{ cx: 730, tip: 420, w: 30 }, { cx: 920, tip: 400, w: 34 },
        { cx: 1105, tip: 408, w: 28 }, { cx: 545, tip: 470, w: 26 }].map(({ cx, tip, w }, i) => (
        <polygon key={i}
          points={`${cx},${tip} ${cx - w},${tip + w * 1.1} ${cx + w},${tip + w * 1.1}`}
          fill="url(#snowCap)" opacity={0.62} />
      ))}

      <rect x="0" y="420" width="1440" height="110" fill="url(#mistGrad)" opacity="0.45" />

      {/* Near range */}
      <path
        d="M -10 900 L -10 820 L 90 770 L 210 748 L 340 765 L 470 720 L 590 748 L 710 700 L 840 728 L 960 690 L 1090 718 L 1210 688 L 1330 722 L 1440 698 L 1450 900 Z"
        fill="url(#mtnNear)"
      />
      {[{ cx: 710, tip: 700, w: 20 }, { cx: 960, tip: 690, w: 22 },
        { cx: 1210, tip: 688, w: 20 }].map(({ cx, tip, w }, i) => (
        <polygon key={i}
          points={`${cx},${tip} ${cx - w},${tip + w * 1.0} ${cx + w},${tip + w * 1.0}`}
          fill="url(#snowCap)" opacity={0.4} />
      ))}
    </svg>
  );
}

function ForegroundSVG() {
  const leftLeaves: [number, number, number, string][] = [
    [-62, 278, -26, "#7c3aed"], [-34, 252, -14, "#8b5cf6"], [-5, 234, 0, "#c084fc"],
    [28, 248, 13, "#7c3aed"],   [60, 268, 24, "#8b5cf6"],  [-72, 308, -36, "#c084fc"],
    [-42, 292, -22, "#7c3aed"], [8, 302, 6, "#8b5cf6"],    [52, 298, 20, "#c084fc"],
    [82, 312, 32, "#7c3aed"],   [-52, 342, -28, "#8b5cf6"], [2, 344, 0, "#c084fc"],
    [56, 338, 24, "#7c3aed"],   [-78, 372, -42, "#8b5cf6"], [-18, 368, -10, "#c084fc"],
    [32, 374, 16, "#7c3aed"],   [78, 368, 38, "#8b5cf6"],  [-42, 404, -26, "#c084fc"],
    [16, 408, 9, "#7c3aed"],    [68, 402, 30, "#8b5cf6"],
  ];
  const rightLeaves: [number, number, number, string][] = [
    [-52, 438, -23, "#a78bfa"], [-26, 416, -10, "#c084fc"], [0, 408, 0, "#e9d5ff"],
    [30, 422, 13, "#a78bfa"],   [54, 442, 25, "#c084fc"],  [-58, 468, -32, "#e9d5ff"],
    [-24, 458, -12, "#a78bfa"], [16, 462, 9, "#c084fc"],   [52, 466, 24, "#e9d5ff"],
    [-42, 496, -22, "#a78bfa"], [0, 498, 0, "#c084fc"],    [44, 494, 20, "#e9d5ff"],
  ];
  const flags1 = [
    { x: 138, y: 330, c: "#3b82f6" }, { x: 228, y: 352, c: "#f9fafb" },
    { x: 318, y: 374, c: "#ef4444" }, { x: 408, y: 396, c: "#22c55e" },
    { x: 498, y: 418, c: "#eab308" }, { x: 588, y: 440, c: "#818cf8" },
  ];
  const flags2 = [
    { x: 1312, y: 494, c: "#ec4899" }, { x: 1220, y: 499, c: "#818cf8" },
    { x: 1128, y: 503, c: "#3b82f6" }, { x: 1036, y: 506, c: "#f9fafb" },
    { x: 944,  y: 508, c: "#ef4444" }, { x: 852,  y: 509, c: "#eab308" },
  ];

  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 4 }}
      aria-hidden
    >
      <defs>
        <filter id="treeGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="flagGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="rimL" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="rgba(253,224,71,0.4)" />
          <stop offset="45%"  stopColor="rgba(251,146,60,0.22)" />
          <stop offset="80%"  stopColor="rgba(244,114,182,0.14)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="rimR" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="rgba(244,114,182,0.3)" />
          <stop offset="55%"  stopColor="rgba(139,92,246,0.16)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="canopyGrad" cx="50%" cy="45%" r="58%">
          <stop offset="0%"   stopColor="rgba(253,224,71,0.15)" />
          <stop offset="40%"  stopColor="rgba(244,114,182,0.11)" />
          <stop offset="80%"  stopColor="rgba(139,92,246,0.07)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Left peepal */}
      <g>
        <path
          d="M 128 902 L 110 822 L 100 742 L 95 662 L 92 582 L 94 502 L 100 422 L 112 362 L 120 322 L 128 312 L 136 322 L 144 362 L 156 422 L 162 502 L 164 582 L 161 662 L 156 742 L 146 822 L 128 902 Z"
          fill="#2d1b69" filter="url(#treeGlow)"
        />
        <path
          d="M 120 902 L 104 822 L 96 742 L 92 662 L 90 592 L 93 512 L 101 432 L 111 382 L 121 352 L 128 344 L 135 352 L 145 382 L 155 432 L 163 512 L 166 592 L 163 662 L 158 742 L 148 822 L 136 902 Z"
          fill="#4c1d95" opacity="0.55"
        />
        {([[108,555,78,724],[118,525,68,682],[148,562,180,732],[138,532,190,692]] as number[][]).map(
          ([x1,y1,x2,y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={`rgba(253,224,71,${i%2===0?0.2:0.13})`}
              strokeWidth={i%2===0?1.5:1} />
          )
        )}
        <ellipse cx="128" cy="375" rx="165" ry="122" fill="url(#rimL)" opacity="0.5" />
        <ellipse cx="128" cy="358" rx="148" ry="108" fill="url(#canopyGrad)" opacity="0.4" />
        <g className="login-himalaya-leaves">
          {leftLeaves.map(([dx, dy, rot, color], i) => (
            <path key={i}
              d="M 0 -14 C -18 -14,-22 2,-12 12 Q 0 20, 12 12 C 22 2, 18 -14, 0 -14 Z"
              fill={color} opacity={0.7}
              transform={`translate(${128 + dx},${dy}) rotate(${rot})`} />
          ))}
        </g>
      </g>

      {/* Right tree */}
      <g>
        <path
          d="M 1318 902 L 1306 832 L 1300 762 L 1298 692 L 1299 622 L 1303 562 L 1311 512 L 1317 492 L 1321 488 L 1325 492 L 1331 512 L 1339 562 L 1343 622 L 1344 692 L 1341 762 L 1335 832 L 1318 902 Z"
          fill="#3b0764" filter="url(#treeGlow)"
        />
        <ellipse cx="1318" cy="518" rx="115" ry="88" fill="url(#rimR)" opacity="0.42" />
        <g className="login-himalaya-leaves-right">
          {rightLeaves.map(([dx, dy, rot, color], i) => (
            <path key={i}
              d="M 0 -11 C -14 -11,-17 1,-9 9 Q 0 15, 9 9 C 17 1, 14 -11, 0 -11 Z"
              fill={color} opacity={0.62}
              transform={`translate(${1318 + dx},${dy}) rotate(${rot})`} />
          ))}
        </g>
      </g>

      {/* Prayer flags */}
      <line x1="82" y1="312" x2="622" y2="480" stroke="rgba(253,224,71,0.38)" strokeWidth="1" />
      {flags1.map((f, i) => (
        <rect key={i} x={f.x - 10} y={f.y} width="18" height="25"
          fill={f.c} opacity={0.72} filter="url(#flagGlow)" />
      ))}
      <line x1="1372" y1="488" x2="822" y2="510" stroke="rgba(253,224,71,0.32)" strokeWidth="1" />
      {flags2.map((f, i) => (
        <rect key={i} x={f.x - 10} y={f.y} width="18" height="25"
          fill={f.c} opacity={0.65} filter="url(#flagGlow)" />
      ))}
    </svg>
  );
}

function CloudCluster({
  style,
  driftClass,
}: {
  style?: React.CSSProperties;
  driftClass?: string;
}) {
  return (
    <div className={`absolute pointer-events-none ${driftClass ?? ""}`} style={{ ...style, zIndex: 3 }}>
      <svg viewBox="0 0 320 100" width="320" height="100">
        <defs>
          <radialGradient id="cg1" cx="50%" cy="60%" r="55%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.88)" />
            <stop offset="60%"  stopColor="rgba(240,235,255,0.62)" />
            <stop offset="100%" stopColor="rgba(220,210,255,0)" />
          </radialGradient>
          <filter id="cf"><feGaussianBlur stdDeviation="0.9" /></filter>
        </defs>
        <ellipse cx="88"  cy="62" rx="78" ry="40" fill="url(#cg1)"              filter="url(#cf)" />
        <ellipse cx="158" cy="44" rx="98" ry="45" fill="rgba(255,255,255,0.72)" filter="url(#cf)" />
        <ellipse cx="228" cy="58" rx="74" ry="37" fill="rgba(240,235,255,0.62)" filter="url(#cf)" />
        <ellipse cx="122" cy="70" rx="88" ry="30" fill="rgba(255,248,255,0.52)" filter="url(#cf)" />
        <ellipse cx="192" cy="66" rx="66" ry="28" fill="rgba(230,220,255,0.42)" filter="url(#cf)" />
      </svg>
    </div>
  );
}

/* Decorative chain glyph */
function ChainGlyph() {
  return (
    <svg width="56" height="20" viewBox="0 0 70 24" fill="none" aria-hidden>
      <rect
        x="1" y="1" width="24" height="22" rx="11"
        stroke="rgba(196,163,90,0.35)" strokeWidth="2"
      />
      <rect
        x="45" y="1" width="24" height="22" rx="11"
        stroke="rgba(196,163,90,0.35)" strokeWidth="2"
      />
      <rect x="20" y="8" width="30" height="8" rx="4" fill="rgba(154,123,60,0.22)" />
    </svg>
  );
}

/* Warm divider line */
function Divider() {
  return (
    <div
      style={{
        width: 36,
        height: 1,
        background:
          "linear-gradient(90deg, transparent, rgba(196,163,90,0.45), transparent)",
        margin: "0 auto",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED INPUT + LABEL styles (inline, no global class conflicts)
───────────────────────────────────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.72rem",
        fontWeight: 500,
        color: "rgba(196,163,90,0.6)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: "0.45rem",
      }}
    >
      {children}
    </div>
  );
}

const WarmInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function WarmInput(props, ref) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      ref={ref}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      style={{
        width: "100%",
        background: focused
          ? "rgba(196,163,90,0.07)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${
          focused ? "rgba(196,163,90,0.38)" : "rgba(196,163,90,0.14)"
        }`,
        borderRadius: "10px",
        color: "rgba(244,232,216,0.9)",
        fontSize: "0.9375rem",
        padding: "0.72rem 1rem",
        outline: "none",
        fontFamily: "inherit",
        transition: "border-color 0.18s, background 0.18s",
        caretColor: "rgba(196,163,90,0.8)",
        ...(props.style ?? {}),
      }}
    />
  );
});

/* ─────────────────────────────────────────────────────────────────────────────
   LOGIN FORM
───────────────────────────────────────────────────────────────────────────── */
function LoginForm({
  onSuccess,
}: {
  onSuccess: (username: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      onSuccess(username.trim());
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ marginBottom: "1.1rem" }}>
        <Label>Username</Label>
        <WarmInput
          ref={ref}
          id="login-username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          placeholder=""
        />
      </div>

      <div style={{ marginBottom: "1.4rem" }}>
        <Label>Password</Label>
        <WarmInput
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder=""
        />
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key={error}
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: "0.8125rem",
              color: "rgba(220,100,80,0.9)",
              marginBottom: "1rem",
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <SubmitButton loading={loading} label="Sign In" />
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   REGISTER FORM
───────────────────────────────────────────────────────────────────────────── */
function RegisterForm({
  onSuccess,
}: {
  onSuccess: (username: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const passwordMismatch = confirm.length > 0 && password !== confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !confirm.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
          confirmPassword: confirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      onSuccess(username.trim());
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ marginBottom: "1rem" }}>
        <Label>
          Username{" "}
          <span style={{ color: "rgba(196,163,90,0.38)", fontWeight: 400, letterSpacing: 0 }}>
            · 3–30 chars, letters / numbers / _
          </span>
        </Label>
        <WarmInput
          ref={ref}
          id="reg-username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          placeholder=""
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Label>Password <span style={{ color: "rgba(196,163,90,0.38)", fontWeight: 400, letterSpacing: 0 }}>· min 6 chars</span></Label>
        <WarmInput
          id="reg-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder=""
        />
      </div>

      <div style={{ marginBottom: "1.4rem" }}>
        <Label>
          Confirm Password{" "}
          {passwordMismatch && (
            <span style={{ color: "rgba(220,100,80,0.75)", fontWeight: 400, letterSpacing: 0, textTransform: "none" }}>
              · doesn't match
            </span>
          )}
        </Label>
        <WarmInput
          id="reg-confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={loading}
          placeholder=""
          style={
            passwordMismatch
              ? { borderColor: "rgba(220,100,80,0.4)" }
              : undefined
          }
        />
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key={error}
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: "0.8125rem",
              color: "rgba(220,100,80,0.9)",
              marginBottom: "1rem",
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <SubmitButton loading={loading} label="Create Account" />
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED SUBMIT BUTTON
───────────────────────────────────────────────────────────────────────────── */
function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full font-semibold transition-opacity"
      style={{
        padding: "0.875rem 1rem",
        borderRadius: "10px",
        border: "none",
        background: loading
          ? "rgba(196,163,90,0.25)"
          : "linear-gradient(135deg, #c4a35a 0%, #9a7b3c 100%)",
        color: loading ? "rgba(196,163,90,0.5)" : "#1a1208",
        fontSize: "0.9375rem",
        fontWeight: 700,
        letterSpacing: "0.02em",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.22s ease",
        boxShadow: loading ? "none" : "0 6px 20px rgba(154,123,60,0.28)",
      }}
    >
      {loading ? "Please wait…" : label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN LOGIN PAGE
───────────────────────────────────────────────────────────────────────────── */
type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");

  function handleSuccess(username: string) {
    saveUsername(username);
    setAuthCookie();
    router.push("/home");
    router.refresh();
  }

  function switchMode(next: Mode) {
    setMode(next);
  }

  return (
    <>
      <style>{`
        @keyframes saathi-sun-pulse {
          0%,100% { transform: translateX(-50%) scale(1);    opacity: 0.82; }
          50%      { transform: translateX(-50%) scale(1.03); opacity: 0.92; }
        }
        .saathi-sun-animate { animation: saathi-sun-pulse 16s ease-in-out infinite; }

        @keyframes login-himalaya-leaf-a {
          0%,100% { opacity: 0.70; } 50% { opacity: 0.92; }
        }
        @keyframes login-himalaya-leaf-b {
          0%,100% { opacity: 0.62; } 50% { opacity: 0.84; }
        }
        .login-himalaya-leaves       { animation: login-himalaya-leaf-a 7s   ease-in-out infinite; }
        .login-himalaya-leaves-right { animation: login-himalaya-leaf-b 8.5s ease-in-out infinite; }

        @keyframes cloud-a { 0% { transform: translateX(0); } 100% { transform: translateX(26px);  } }
        @keyframes cloud-b { 0% { transform: translateX(0); } 100% { transform: translateX(-22px); } }
        @keyframes cloud-c { 0% { transform: translateX(0); } 100% { transform: translateX(18px);  } }
        .cloud-drift-a { animation: cloud-a 28s ease-in-out infinite alternate; }
        .cloud-drift-b { animation: cloud-b 42s ease-in-out infinite alternate; }
        .cloud-drift-c { animation: cloud-c 35s ease-in-out infinite alternate; }

        @media (prefers-reduced-motion: reduce) {
          .saathi-sun-animate { transform: translateX(-50%) !important; animation: none; }
          .login-himalaya-leaves, .login-himalaya-leaves-right { animation: none; }
          .cloud-drift-a, .cloud-drift-b, .cloud-drift-c { animation: none; }
        }
      `}</style>

    <div
      className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-20 sm:py-24"
      style={{ overflow: "hidden" }}
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>

        {/* 1 · Sky gradient */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(185deg,
            #1e1b4b 0%, #312e81 10%, #4c1d95 22%, #7c3aed 35%,
            #c026d3 48%, #e879f9 58%, #fda4af 68%,
            #fbcfe8 76%, #ddd6fe 84%, #a5b4fc 91%, #6366f1 100%)`
        }} />

        {/* 2 · Sun glow */}
        <div className="absolute saathi-sun-animate" style={{
          left: "50%", bottom: "8%",
          width: "min(140vw, 900px)", height: "45vh",
          borderRadius: "50%",
          background: `radial-gradient(ellipse 55% 45% at 50% 60%,
            rgba(253,186,116,0.55), rgba(244,114,182,0.25), transparent)`,
          filter: "blur(4px)",
        }} />

        {/* 3 · Center haze */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 55% 70% at 58% 42%,
            rgba(255,255,255,0.14) 0%, transparent 58%)`,
        }} />

        {/* 4 · Mountains */}
        <MountainSVG />

        {/* 5 · Ground mist */}
        <div className="absolute bottom-0 left-0 right-0" style={{
          height: "38%", zIndex: 2,
          background: `linear-gradient(to top, rgba(88,28,135,0.5), rgba(49,46,129,0.18), transparent)`,
          WebkitMaskImage: `linear-gradient(90deg, rgba(0,0,0,0.2) 0%, black 10%, black 90%, rgba(0,0,0,0.2) 100%)`,
          maskImage:        `linear-gradient(90deg, rgba(0,0,0,0.2) 0%, black 10%, black 90%, rgba(0,0,0,0.2) 100%)`,
        }} />

        {/* 6 · Foreground trees + prayer flags */}
        <ForegroundSVG />

        {/* 7 · Drifting cloud clusters */}
        <CloudCluster driftClass="cloud-drift-a" style={{ top: "8%",  left: "3%",  opacity: 0.78, transform: "scale(0.88)" }} />
        <CloudCluster driftClass="cloud-drift-b" style={{ top: "5%",  left: "62%", opacity: 0.72, transform: "scale(1.1)"  }} />
        <CloudCluster driftClass="cloud-drift-c" style={{ top: "16%", left: "28%", opacity: 0.62, transform: "scale(0.78)" }} />
        <CloudCluster driftClass="cloud-drift-a" style={{ top: "2%",  left: "44%", opacity: 0.50, transform: "scale(0.65)" }} />
        <CloudCluster driftClass="cloud-drift-b" style={{ top: "20%", left: "72%", opacity: 0.55, transform: "scale(0.92)" }} />
      </div>

      {/* ── GLASS CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full"
        style={{ maxWidth: 420, zIndex: 10 }}
      >
        <div
          className="rounded-[24px]"
          style={{
            background:
              "linear-gradient(165deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.07) 100%)",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow:
              "0 32px 64px -12px rgba(49,46,129,0.5), inset 0 1px 0 rgba(255,255,255,0.32)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            padding: "clamp(2rem,5vw,2.75rem) clamp(1.75rem,5vw,2.5rem)",
          }}
        >
          {/* ── Header ── */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              style={{ marginBottom: "0.75rem" }}
            >
              <ChainGlyph />
            </motion.div>

            <h1
              className="font-display font-semibold"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.1rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#fff",
                textShadow: "0 2px 16px rgba(49,46,129,0.4)",
              }}
            >
              Chautari
            </h1>

            <div style={{ marginTop: "0.6rem", marginBottom: "0.6rem" }}>
              <Divider />
            </div>

            <p
              style={{
                fontSize: "0.825rem",
                color: "rgba(255,255,255,0.62)",
                lineHeight: 1.7,
                maxWidth: "22rem",
                margin: "0 auto",
              }}
            >
              A quiet space to slow down, breathe, and be here for a while.
            </p>
          </div>

          {/* ── Tab switcher ── */}
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(196,163,90,0.1)",
              borderRadius: "12px",
              padding: "3px",
              marginBottom: "1.75rem",
              gap: "3px",
            }}
          >
            {(["login", "register"] as Mode[]).map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  style={{
                    flex: 1,
                    padding: "0.55rem 0.5rem",
                    borderRadius: "9px",
                    border: "none",
                    background: active
                      ? "rgba(196,163,90,0.14)"
                      : "transparent",
                    color: active
                      ? "rgba(244,232,216,0.92)"
                      : "rgba(196,163,90,0.4)",
                    fontWeight: active ? 600 : 400,
                    fontSize: "0.84rem",
                    cursor: "pointer",
                    letterSpacing: "0.01em",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                    boxShadow: active
                      ? "inset 0 1px 0 rgba(255,255,255,0.06)"
                      : "none",
                  }}
                >
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              );
            })}
          </div>

          {/* ── Animated form swap ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "login" ? -14 : 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "login" ? 14 : -14 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {mode === "login" ? (
                <LoginForm onSuccess={handleSuccess} />
              ) : (
                <RegisterForm onSuccess={handleSuccess} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Mode hint ── */}
          <p
            style={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.45)",
              textAlign: "center",
              marginTop: "1.25rem",
              lineHeight: 1.6,
            }}
          >
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(196,163,90,0.55)",
                    cursor: "pointer",
                    fontSize: "inherit",
                    fontFamily: "inherit",
                    textDecoration: "underline",
                    textUnderlineOffset: "2px",
                    padding: 0,
                  }}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(196,163,90,0.55)",
                    cursor: "pointer",
                    fontSize: "inherit",
                    fontFamily: "inherit",
                    textDecoration: "underline",
                    textUnderlineOffset: "2px",
                    padding: 0,
                  }}
                >
                  Sign in instead
                </button>
              </>
            )}
          </p>

          {/* ── Footer ── */}
          <p
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.35)",
              textAlign: "center",
              marginTop: "1.5rem",
              lineHeight: 1.65,
              letterSpacing: "0.02em",
            }}
          >
            Your information is stored securely. Passwords are hashed and never
            stored in plain text.
          </p>
        </div>
      </motion.div>
    </div>
    </>
  );
}
