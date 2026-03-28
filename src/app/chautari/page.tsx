"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FloatingKite, type KiteData } from "@/components/FloatingKite";
import { HugOverlay } from "@/components/HugOverlay";
import { ReleasePanel } from "@/components/ReleasePanel";
import { AnonymousChat } from "@/components/AnonymousChat";
import { generateAnonName } from "@/lib/anonName";
import { generateKiteMotion, KITE_COLORS } from "@/lib/kitePhysics";
import { seedKites } from "@/data/seedKites";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/* ─── Stars (deterministic to avoid hydration mismatch) ───────────────── */
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: `${((i * 73 + 17) % 85) + 3}%`,
  left: `${(i * 61 + 11) % 100}%`,
  delay: `${((i * 37) % 48) / 10}s`,
  dur: `${2.5 + ((i * 29) % 30) / 10}s`,
  opacity: 0.18 + ((i * 41) % 38) / 100,
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

      const { data: dbKites } = await supabase
        .from("kites")
        .select("*")
        .eq("room_id", rid)
        .order("created_at", { ascending: false })
        .limit(30);

      const fetched = (dbKites ?? []) as KiteData[];

      if (fetched.length < 3) {
        const seeds = makeSeedKites();
        const all = [...fetched, ...seeds];
        setKites(all);
        assignMotions(all);
      } else {
        setKites(fetched);
        assignMotions(fetched);
      }
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

  /* ── Helpers ── */
  function makeSeedKites(): KiteData[] {
    return seedKites.map((sk, i) => ({
      id: `seed-${i}`,
      anonymous_name: generateAnonName(),
      message: sk.message,
      color: sk.color,
      position_x: sk.position_x,
      position_y: sk.position_y,
      hug_count: Math.floor(((i * 7 + 3) % 8)),
      isSeed: true,
    }));
  }

  async function handleHug(kiteId: string) {
    const kite = kites.find((k) => k.id === kiteId);
    if (!kite || kite.user_id === userId) return;

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
        // Clear "Flying…" — kite is visually in the sky already
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

      {/* ── Top-left: room label ── */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 20,
          zIndex: 20,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          fontSize: 18,
          color: "rgba(245,166,35,0.72)",
          letterSpacing: "0.01em",
        }}
      >
        Chautari
      </div>

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
            fontSize: 10,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.03em",
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
          fontSize: 11,
          color: "rgba(255,255,255,0.18)",
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
          bottom: 48,
        }}
      >
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

        {/* Release panel */}
        <ReleasePanel onRelease={handleRelease} isReleasing={isReleasing} />

        {/* Hug overlay */}
        {hugOverlay.kite && (
          <HugOverlay
            visible={hugOverlay.visible}
            kiteMessage={hugOverlay.kite.message}
            kiteOwnerName={hugOverlay.kite.anonymous_name}
            onConnect={handleConnect}
            onDismiss={() => setHugOverlay({ visible: false, kite: null })}
          />
        )}

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

      {/* ── Crisis bar ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "rgba(7,9,15,0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          zIndex: 100,
        }}
      >
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.26)" }}>
          Need support right now?
        </span>
        <a
          href="tel:16600102005"
          style={{
            fontSize: 12,
            color: "rgba(245,166,35,0.75)",
            textDecoration: "none",
            fontWeight: 500,
            letterSpacing: "0.01em",
          }}
        >
          TPO Nepal — 1660-0102005
        </a>
      </div>
    </div>
  );
}
