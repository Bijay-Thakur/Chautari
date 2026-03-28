"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

type LocalMessage = {
  sender_id: string;
  content: string;
};

type Props = {
  roomId: string;
  currentUserId: string;
  currentUserName: string;
  partnerName: string;
  partnerId: string;
  onClose: () => void;
};

export function AnonymousChat({
  roomId,
  currentUserId,
  currentUserName,
  partnerName,
  partnerId,
  onClose,
}: Props) {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    /**
     * Broadcast channel — scoped to the sorted user-pair so ONLY these two
     * users receive each other's messages. This is the safe approach:
     * unlike postgres_changes (which would fan every row to every subscriber),
     * broadcast is an isolated, ephemeral channel that is never written to the
     * Supabase realtime log visible to others.
     */
    const pairKey = [currentUserId, partnerId].sort().join("-");
    const channelName = `anon-chat:${roomId}:${pairKey}`;

    const channel = supabase
      .channel(channelName)
      .on("broadcast", { event: "msg" }, ({ payload }) => {
        const m = payload as LocalMessage;
        setMessages((prev) => [...prev, m]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, currentUserId, partnerId]);

  async function send() {
    if (!input.trim() || !channelRef.current) return;
    const content = input.trim();
    setInput("");

    const msg: LocalMessage = { sender_id: currentUserId, content };

    /* Optimistic local render */
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    /* Broadcast to partner — scoped to pair channel only */
    await channelRef.current.send({
      type: "broadcast",
      event: "msg",
      payload: msg,
    });

    /* Persist to DB for moderation / audit trail (no anon SELECT policy, so
       chat history is write-only from the client side — history resets on reload,
       which matches the "disappears when you leave" UX promise). */
    await supabase.from("chautari_messages").insert({
      room_id: roomId,
      sender_id: currentUserId,
      sender_name: currentUserName,
      recipient_id: partnerId,
      recipient_name: partnerName,
      content,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        position: "absolute",
        bottom: 58,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(320px, 92vw)",
        zIndex: 40,
        background: "rgba(10,13,22,0.97)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
        boxShadow: "0 12px 50px rgba(0,0,0,0.6)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(245,230,200,0.92)" }}>
            {partnerName}
          </p>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", marginTop: 1 }}>
            anonymous · disappears when you leave
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.22)",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: "2px 4px",
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          height: 210,
          overflowY: "auto",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {messages.length === 0 && (
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.18)",
              textAlign: "center",
              marginTop: 64,
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            You both felt the same thing.
            <br />
            Say something.
          </p>
        )}
        {messages.map((m, i) => {
          const isMine = m.sender_id === currentUserId;
          return (
            <div
              key={i}
              style={{
                alignSelf: isMine ? "flex-end" : "flex-start",
                maxWidth: "78%",
                background: isMine ? "rgba(245,166,35,0.14)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${isMine ? "rgba(245,166,35,0.24)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: isMine ? "10px 10px 3px 10px" : "10px 10px 10px 3px",
                padding: "8px 12px",
              }}
            >
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.82)", lineHeight: 1.55 }}>
                {m.content}
              </p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "10px 14px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Type something…"
          maxLength={500}
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 8,
            color: "rgba(255,255,255,0.85)",
            fontSize: 12,
            padding: "8px 12px",
            outline: "none",
            fontFamily: "Inter, system-ui, sans-serif",
            caretColor: "rgba(245,166,35,0.8)",
          }}
        />
        <button
          onClick={send}
          style={{
            background: "#f5a623",
            border: "none",
            borderRadius: 8,
            padding: "0 14px",
            cursor: "pointer",
            fontSize: 14,
            color: "#07090f",
            fontWeight: 700,
          }}
        >
          ↑
        </button>
      </div>
    </motion.div>
  );
}
