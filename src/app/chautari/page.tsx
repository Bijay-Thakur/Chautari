"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FloatingKite, type KiteData } from "@/components/FloatingKite";
import { HugOverlay } from "@/components/HugOverlay";
import { AnonymousChat } from "@/components/AnonymousChat";
import { generateAnonName } from "@/lib/anonName";
import { generateKiteMotion, KITE_COLORS } from "@/lib/kitePhysics";
import { seedKites } from "@/data/seedKites";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { playKiteHushSound } from "@/lib/kiteFlySound";
import { ChautariSkyBirds } from "@/components/ChautariSkyBirds";


/* ─── Stars (deterministic to avoid hydration mismatch) ───────────────── */
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: `${((i * 73 + 17) % 85) + 3}%`,
  left: `${(i * 61 + 11) % 100}%`,
  delay: `${((i * 37) % 48) / 10}s`,
  dur: `${2.5 + ((i * 29) % 30) / 10}s`,
  opacity: 0.18 + ((i * 41) % 38) / 100,
}));

/* ─── Wind streaks (deterministic positions, varying speeds) ──────────── */
const WIND_STREAKS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  top: `${4 + ((i * 67 + 23) % 84)}%`,
  width: 110 + ((i * 53 + 17) % 190),
  height: i % 5 === 0 ? 2 : 1,
  opacity: 0.032 + ((i * 23 + 7) % 7) / 100,
  duration: 11 + ((i * 41 + 3) % 16),
  delay: -(((i * 5.7 + 1.3) % 24)),
  blur: i % 4 === 0 ? "1px" : "0px",
}));

/* ─── Simulated room members (letters from anon adjectives) ───────────── */
const ROOM_LETTERS = ["Q", "G", "W", "S", "R"];

export default function ChautariRoom() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [kites, setKites] = useState<KiteData[]>([]);
  const [newKiteIds, setNewKiteIds] = useState<Set<string>>(new Set());
  const kiteMotions = useRef<Record<string, ReturnType<typeof generateKiteMotion>>>({});
  const userIdRef = useRef(""); // stable ref for realtime closure
  const [hugOverlay, setHugOverlay] = useState<{ visible: boolean; kite: KiteData | null }>({
    visible: false,
    kite: null,
  });
  const [chatPartner, setChatPartner] = useState<{ id: string; name: string } | null>(null);
  const [isReleasing, setIsReleasing] = useState(false);
  const [releaseInput, setReleaseInput] = useState("");
  const [, forceUpdate] = useState(0); // trigger re-render when motions are set

  const supabaseReady = isSupabaseConfigured;

  /* ── Init session ── */
  useEffect(() => {
    let uid = sessionStorage.getItem("chautari_uid");
    let uname = sessionStorage.getItem("chautari_uname");
    if (!uid) {
      uid = crypto.randomUUID();
      sessionStorage.setItem("chautari_uid", uid);
    }
    if (!uname) {
      uname = generateAnonName();
      sessionStorage.setItem("chautari_uname", uname);
    }
    setUserId(uid);
    setUserName(uname);
    userIdRef.current = uid;
  }, []);

  /* ── Add motions for a batch of kites ── */
  function assignMotions(ks: KiteData[]) {
    ks.forEach((k) => {
      if (!kiteMotions.current[k.id]) {
        kiteMotions.current[k.id] = generateKiteMotion();
      }
    });
    forceUpdate((n) => n + 1);
  }

  /* ── Fetch room + kites ── */
  useEffect(() => {
    if (!userId) return;

    async function init() {
      if (!supabaseReady) {
        /* Show seed kites only */
        const seeds = makeSeedKites();
        setKites(seeds);
        assignMotions(seeds);
        return;
      }

      const { data: rooms } = await supabase
        .from("chautari_rooms")
        .select("id")
        .eq("is_active", true)
        .order("created_at")
        .limit(1);

      if (!rooms?.length) {
        const seeds = makeSeedKites();
        setKites(seeds);
        assignMotions(seeds);
        return;
      }

      const rid = rooms[0].id as string;
      setRoomId(rid);

      /* Clear only this user's previous kites — other users' kites stay */
      await supabase.from("kites").delete().eq("room_id", rid).eq("user_id", userId);

      const seeds = makeSeedKites();
      setKites(seeds);
      assignMotions(seeds);
    }

    init();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Realtime ── */
  useEffect(() => {
    if (!roomId) return;

    const kitesChannel = supabase
      .channel(`room-kites-${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "kites", filter: `room_id=eq.${roomId}` },
        (payload) => {
          const nk = payload.new as KiteData;
          // Skip our own inserts — already shown optimistically
          if (nk.user_id === userIdRef.current) return;
          setKites((prev) => {
            if (prev.find((k) => k.id === nk.id)) return prev;
            return [...prev, nk];
          });
          kiteMotions.current[nk.id] = generateKiteMotion();
          setNewKiteIds((prev) => new Set([...prev, nk.id]));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "kites", filter: `room_id=eq.${roomId}` },
        (payload) => {
          const deletedId = (payload.old as { id: string }).id;
          if (!deletedId) return;
          setKites((prev) => prev.filter((k) => k.id !== deletedId));
          delete kiteMotions.current[deletedId];
        }
      )
      .subscribe();

    const hugsChannel = supabase
      .channel(`room-hugs-${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "kite_hugs" },
        (payload) => {
          const hug = payload.new as { kite_id: string };
          setKites((prev) =>
            prev.map((k) =>
              k.id === hug.kite_id ? { ...k, hug_count: (k.hug_count ?? 0) + 1 } : k
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(kitesChannel);
      supabase.removeChannel(hugsChannel);
    };
  }, [roomId]);

  /* ── Erase user's own kites when they leave (reliable via beforeunload) ── */
  useEffect(() => {
    if (!roomId || !supabaseReady || !userId) return;

    const eraseOwnKites = () => {
      supabase
        .from("kites")
        .delete()
        .eq("room_id", roomId)
        .eq("user_id", userId)
        .then(() => {});
    };

    /* beforeunload fires on hard navigations / tab close */
    window.addEventListener("beforeunload", eraseOwnKites);

    return () => {
      window.removeEventListener("beforeunload", eraseOwnKites);
      /* Also fires on soft SPA navigation (component unmount) */
      eraseOwnKites();
      /* Clear session so re-joining feels like a fresh start */
      sessionStorage.removeItem("chautari_uid");
      sessionStorage.removeItem("chautari_uname");
    };
  }, [roomId, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Helpers ── */
  function makeSeedKites(): KiteData[] {
    return seedKites.map((sk, i) => ({
      id: sk.id,
      anonymous_name: generateAnonName(),
      message: sk.message,
      nepaliPhrase: sk.nepaliPhrase,
      silencingPhrase: sk.silencingPhrase,
      color: sk.color,
      position_x: sk.position_x,
      position_y: sk.position_y,
      hug_count: Math.floor(((i * 7 + 3) % 8)),
      isSeed: true,
    }));
  }

  async function handleHug(kiteId: string) {
    const kite = kites.find((k) => k.id === kiteId);
    if (!kite) return;
    /* Block hugging your own (non-seed) kites */
    if (!kite.isSeed && kite.user_id === userId) return;

    /* Optimistic hug count bump */
    setKites((prev) =>
      prev.map((k) =>
        k.id === kiteId ? { ...k, hug_count: (k.hug_count ?? 0) + 1 } : k
      )
    );

    /* Show overlay */
    setHugOverlay({ visible: true, kite });

    /* Persist hug (skip seeds) */
    if (!kite.isSeed && roomId) {
      await supabase.from("kite_hugs").insert({
        kite_id: kiteId,
        hugger_user_id: userId,
        hugger_name: userName,
        kite_owner_user_id: kite.user_id ?? null,
      });
    }
  }

  const handleRelease = useCallback(async (message: string) => {
    if (!userId) return;
    setIsReleasing(true);

    const colorEntry = KITE_COLORS[Math.floor(Math.random() * KITE_COLORS.length)];
    const pos_x = 8 + Math.random() * 68;
    const pos_y = 10 + Math.random() * 50;

    /* ── Step 1: Optimistic — kite appears in the sky immediately ── */
    const optId = `opt-${Date.now()}`;
    const optKite: KiteData = {
      id: optId,
      user_id: userId,
      anonymous_name: userName,
      message,
      color: colorEntry.fill,
      position_x: pos_x,
      position_y: pos_y,
      hug_count: 0,
    };

    kiteMotions.current[optId] = generateKiteMotion();
    setKites((prev) => [...prev, optKite]);
    setNewKiteIds((prev) => new Set([...prev, optId]));
    playKiteHushSound();
    setIsReleasing(false);

    /* ── Step 2: Persist to DB (needs roomId) ── */
    if (!roomId) return;

    const { data, error } = await supabase
      .from("kites")
      .insert({
        room_id: roomId,
        user_id: userId,
        anonymous_name: userName,
        message,
        color: colorEntry.fill,
        position_x: pos_x,
        position_y: pos_y,
        hug_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Release kite failed:", error);
      // Keep the optimistic kite so the user still sees it
      return;
    }

    /* ── Step 3: Swap optimistic ID for real DB ID ── */
    if (data) {
      kiteMotions.current[data.id] = kiteMotions.current[optId];
      delete kiteMotions.current[optId];
      setNewKiteIds((prev) => {
        const next = new Set(prev);
        next.delete(optId);
        next.add(data.id);
        return next;
      });
      setKites((prev) =>
        prev.map((k) => (k.id === optId ? { ...data, isSeed: false } : k))
      );
    }
  }, [userId, userName, roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitReleaseFromInput = useCallback(() => {
    const t = releaseInput.trim();
    if (!t || isReleasing || !userId) return;
    void handleRelease(t);
    setReleaseInput("");
  }, [releaseInput, isReleasing, userId, handleRelease]);

  function handleConnect() {
    if (!hugOverlay.kite) return;
    setChatPartner({
      id: hugOverlay.kite.user_id ?? hugOverlay.kite.id,
      name: hugOverlay.kite.anonymous_name,
    });
    setHugOverlay({ visible: false, kite: null });
  }

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 15%, #0f1628 0%, #07090f 65%)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* ── Stars ── */}
      {STARS.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            width: 1.5,
            height: 1.5,
            background: "white",
            borderRadius: "50%",
            top: s.top,
            left: s.left,
            opacity: s.opacity,
            animation: `twinkle ${s.dur} ease-in-out ${s.delay} infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── Wind streaks ── */}
      {WIND_STREAKS.map((w) => (
        <div
          key={w.id}
          style={{
            position: "absolute",
            top: w.top,
            left: -350,
            width: w.width,
            height: w.height,
            background: `linear-gradient(90deg, transparent 0%, rgba(180,200,255,${w.opacity}) 40%, rgba(200,215,255,${w.opacity}) 60%, transparent 100%)`,
            borderRadius: 2,
            filter: w.blur !== "0px" ? `blur(${w.blur})` : undefined,
            animation: `windSlide ${w.duration}s linear ${w.delay}s infinite`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      ))}

      {/* ── Top-left: branding is the global SiteLogo only (no duplicate title) ── */}

      {/* ── Top-center: users bar ── */}
      <div
        style={{
          position: "absolute",
          top: 15,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ display: "flex" }}>
          {KITE_COLORS.slice(0, 5).map((c, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: c.fill,
                border: "2px solid rgba(7,9,15,0.85)",
                marginLeft: i > 0 ? -7 : 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8,
                fontWeight: 700,
                color: "rgba(255,255,255,0.82)",
              }}
            >
              {ROOM_LETTERS[i]}
            </div>
          ))}
        </div>
        <span
          style={{
            fontSize: 12,
            color: "rgba(255, 235, 220, 0.55)",
            letterSpacing: "0.04em",
          }}
        >
          5 in this room
        </span>
      </div>

      {/* ── Top-right: back ── */}
      <Link
        href="/"
        style={{
          position: "absolute",
          top: 18,
          right: 20,
          zIndex: 20,
          fontSize: 13,
          color: "rgba(255, 220, 190, 0.65)",
          textDecoration: "none",
          letterSpacing: "0.04em",
        }}
      >
        ← back
      </Link>

      {/* ── Sky canvas (excludes crisis bar) ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 60,
        }}
      >
        <ChautariSkyBirds />

        {/* Kites */}
        {kites.map((kite) => {
          const mp = kiteMotions.current[kite.id];
          if (!mp) return null;
          return (
            <FloatingKite
              key={kite.id}
              kite={kite}
              currentUserId={userId}
              onHug={handleHug}
              motionProps={mp}
              isNew={newKiteIds.has(kite.id)}
            />
          );
        })}

        {/* ── Welcome copy + minimal release input (bottom center) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1.8 }}
          style={{
            position: "absolute",
            bottom: "max(11%, 72px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(92vw, 520px)",
            textAlign: "center",
            zIndex: 4,
            pointerEvents: "auto",
          }}
        >
          <p
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "rgba(255, 245, 230, 0.96)",
              letterSpacing: "0.02em",
              lineHeight: 1.65,
              margin: 0,
              textShadow:
                "0 1px 2px rgba(0,0,0,0.85), 0 0 24px rgba(251, 191, 36, 0.15), 0 2px 14px rgba(0,0,0,0.6)",
            }}
          >
            Whatever you&apos;re holding — you can let it go here.
          </p>
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "clamp(0.72rem, 1.35vw, 0.85rem)",
              color: "rgba(255, 228, 200, 0.88)",
              letterSpacing: "0.06em",
              marginTop: 10,
              marginBottom: 14,
              lineHeight: 1.5,
              textTransform: "none",
              textShadow: "0 1px 8px rgba(0,0,0,0.75)",
            }}
          >
            Write it, release it, and relate with others.
          </p>
          <input
            type="text"
            value={releaseInput}
            maxLength={160}
            placeholder="Fly your kite, express yourself"
            disabled={isReleasing || !userId}
            onChange={(e) => setReleaseInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitReleaseFromInput();
              }
            }}
            aria-label="Message for your kite — press Enter to release"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 18px",
              borderRadius: 14,
              border: "1px solid rgba(245, 166, 35, 0.35)",
              outline: "none",
              fontSize: 14,
              fontFamily: "Inter, system-ui, sans-serif",
              color: "rgba(255, 252, 248, 0.96)",
              background: "rgba(12, 16, 28, 0.55)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              caretColor: "rgba(245, 166, 35, 0.95)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(34, 211, 238, 0.08)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(34, 211, 238, 0.45)";
              e.target.style.boxShadow =
                "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 28px rgba(34, 211, 238, 0.12), 0 0 0 1px rgba(245, 166, 35, 0.25)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(245, 166, 35, 0.35)";
              e.target.style.boxShadow =
                "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(34, 211, 238, 0.08)";
            }}
          />
        </motion.div>

        {/* Come sit — floating copy + CTA (gentle sway + directional hints) */}
        <div
          className="come-sit-invite"
          style={{
            position: "absolute",
            right: 22,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 12,
            width: "min(280px, calc(100vw - 36px))",
            pointerEvents: "none",
            textAlign: "right",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.55, ease: "easeOut" }}
            style={{ pointerEvents: "none" }}
          >
            <motion.div
              animate={{
                x: [0, -7, 0, 5, 0],
                y: [0, -2.5, 0, 2, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.2, 0.45, 0.72, 1],
                delay: 1.75,
              }}
            >
            <div
              style={{
                pointerEvents: "auto",
                paddingRight: 2,
                borderRight: "2px solid rgba(251, 191, 36, 0.35)",
                paddingLeft: 8,
              }}
            >
              <p
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontStyle: "italic",
                  fontSize: "clamp(1.05rem, 1.9vw, 1.25rem)",
                  lineHeight: 1.35,
                  color: "rgba(255, 248, 238, 0.98)",
                  margin: "0 0 8px 0",
                  textShadow:
                    "0 1px 3px rgba(0,0,0,0.9), 0 0 28px rgba(251, 191, 36, 0.12), 0 2px 16px rgba(0,0,0,0.65)",
                }}
              >
                Come sit with yourself
              </p>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "rgba(255, 230, 210, 0.88)",
                  margin: "0 0 10px 0",
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: 450,
                  textShadow: "0 1px 8px rgba(0,0,0,0.85), 0 0 20px rgba(0,0,0,0.4)",
                }}
              >
                Speak in your own words — we&apos;ll offer gentle next steps when you&apos;re ready.
              </p>

              {/* Soft arrows toward the doorway (left / inward) */}
              <div
                aria-hidden
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 5,
                  marginBottom: 8,
                  opacity: 0.85,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    style={{
                      fontSize: 13,
                      color: "rgba(125, 211, 252, 0.75)",
                      textShadow: "0 0 12px rgba(34, 211, 238, 0.35)",
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                    animate={{ x: [0, -3, 0], opacity: [0.35, 0.95, 0.35] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.22,
                    }}
                  >
                    ‹
                  </motion.span>
                ))}
              </div>

              {/* Downward cue toward the button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 10,
                }}
              >
                <motion.span
                  aria-hidden
                  style={{
                    fontSize: 20,
                    lineHeight: 1,
                    color: "rgba(251, 191, 36, 0.9)",
                    filter: "drop-shadow(0 0 10px rgba(251, 191, 36, 0.45))",
                  }}
                  animate={{ y: [0, 6, 0], opacity: [0.65, 1, 0.65] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ↓
                </motion.span>
              </div>

              <motion.div
                style={{ display: "inline-block" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/come-sit-with-yourself"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                    color: "#0c1020",
                    fontFamily: "Inter, system-ui, sans-serif",
                    padding: "11px 20px",
                    borderRadius: 999,
                    background: "linear-gradient(145deg, #fde68a 0%, #f59e0b 45%, #d97706 100%)",
                    boxShadow:
                      "0 2px 0 rgba(255,255,255,0.35) inset, 0 6px 24px rgba(245, 158, 11, 0.45), 0 0 40px rgba(34, 211, 238, 0.15)",
                    border: "1px solid rgba(255, 237, 200, 0.55)",
                    transition: "filter 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  Step inside
                  <motion.span
                    aria-hidden
                    style={{ fontSize: 15, lineHeight: 1, display: "inline-block" }}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </div>
            </motion.div>
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 720px) {
            .come-sit-invite {
              right: 12px !important;
              width: min(240px, calc(100vw - 100px)) !important;
              top: 118px !important;
              transform: none !important;
            }
          }
        `}</style>

        {/* Anonymous chat */}
        <AnimatePresence>
          {chatPartner && roomId && (
            <AnonymousChat
              key={chatPartner.id}
              roomId={roomId}
              currentUserId={userId}
              currentUserName={userName}
              partnerName={chatPartner.name}
              partnerId={chatPartner.id}
              onClose={() => setChatPartner(null)}
            />
          )}
        </AnimatePresence>

        {/* Hill silhouette */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          <svg
            viewBox="0 0 800 90"
            style={{ display: "block", width: "100%", height: 90 }}
            preserveAspectRatio="none"
          >
            <path
              d="M0 100 Q100 60 200 75 Q300 88 400 65 Q500 45 600 68 Q700 82 800 58 L800 100 Z"
              fill="#0a1408"
            />
            <path
              d="M0 100 Q150 72 300 82 Q450 90 600 76 Q700 70 800 78 L800 100 Z"
              fill="#081008"
            />
          </svg>
        </div>
      </div>

      {/* ── Hug overlay — fixed so it always covers the full viewport ── */}
      {hugOverlay.kite && (
        <HugOverlay
          visible={hugOverlay.visible}
          kiteMessage={hugOverlay.kite.message}
          kiteOwnerName={hugOverlay.kite.anonymous_name}
          onConnect={handleConnect}
          onDismiss={() => setHugOverlay({ visible: false, kite: null })}
        />
      )}

      {/* ── Crisis bar — urgent tone, readable copy, green call CTA ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,170,160,0.5) 25%, rgba(240,130,125,0.55) 50%, rgba(255,170,160,0.5) 75%, transparent 100%)",
          }}
        />

        <div
          style={{
            minHeight: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "9px 16px 11px",
            gap: 12,
            background:
              "linear-gradient(180deg, rgba(92, 52, 64, 0.78) 0%, rgba(62, 44, 54, 0.82) 45%, rgba(48, 36, 44, 0.86) 100%)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            boxShadow:
              "0 -8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,200,195,0.08)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 100% 140% at 50% 0%, rgba(200, 100, 110, 0.1), transparent 58%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              position: "relative",
              minWidth: 0,
              flex: 1,
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  background: "rgba(255, 150, 155, 0.12)",
                  animation: "crisis-ring 2.8s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(145deg, rgba(255,170,175,0.28), rgba(200,100,110,0.22))",
                  border: "1px solid rgba(255,190,185,0.32)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  color: "rgba(255, 220, 218, 0.95)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
                  animation: "crisis-heartbeat 2.8s ease-in-out infinite",
                  position: "relative",
                }}
              >
                ♥
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.015em",
                  lineHeight: 1.35,
                  color: "rgba(255, 250, 248, 0.96)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.22)",
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                Need support right now?
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 11.5,
                  fontWeight: 400,
                  color: "rgba(255, 232, 228, 0.78)",
                  marginTop: 3,
                  lineHeight: 1.45,
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                TPO Nepal helpline · You are not alone
              </span>
            </div>
          </div>

          <a
            href="tel:16600102005"
            className="crisis-call-btn"
            aria-label="Call Helpline — TPO Nepal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "9px 14px",
              background: "linear-gradient(180deg, #6fdfaa 0%, #45c07f 100%)",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 999,
              textDecoration: "none",
              flexShrink: 0,
              boxShadow:
                "0 3px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.45)",
              transition: "transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease",
              position: "relative",
              touchAction: "manipulation",
            }}
          >
            <svg
              width={17}
              height={17}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.45 2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.57a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "rgba(255,255,255,0.98)",
                letterSpacing: "0.03em",
                fontFamily: "Inter, system-ui, sans-serif",
                whiteSpace: "nowrap",
                textShadow: "0 1px 1px rgba(0,0,0,0.12)",
              }}
            >
              Call Helpline
            </span>
          </a>
        </div>

        <style>{`
          @keyframes windSlide {
            from { left: -350px; }
            to   { left: 2800px; }
          }
          @keyframes twinkle {
            0%, 100% { opacity: var(--op, 0.2); }
            50%       { opacity: calc(var(--op, 0.2) * 2.2); }
          }
          @keyframes crisis-heartbeat {
            0%, 100% { transform: scale(1); }
            50%       { transform: scale(1.05); }
          }
          @keyframes crisis-ring {
            0%, 100% { opacity: 0; transform: scale(1); }
            50%       { opacity: 0.7; transform: scale(1.32); }
          }
          .crisis-call-btn:hover {
            filter: brightness(1.03);
            transform: translateY(-1px);
            box-shadow: 0 5px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.5) !important;
          }
          .crisis-call-btn:active {
            transform: translateY(0);
            filter: brightness(0.96);
          }
        `}</style>
      </div>
    </div>
  );
}
