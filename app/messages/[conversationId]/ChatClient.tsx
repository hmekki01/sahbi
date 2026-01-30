
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // ✅ TON CLIENT EXISTANT

type Participant = { user_id: string; role: "artisan" | "client" | null };
type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  attachment_url: string | null;
  attachment_type: string | null;
};

export default function ChatClient({
  conversationId,
  currentUserId,
  participants,
}: {
  conversationId: string;
  currentUserId: string;
  participants: Participant[];
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);

  const otherUserId = useMemo(
    () => participants?.find((p) => p.user_id !== currentUserId)?.user_id,
    [participants, currentUserId]
  );

  // Charger les messages + marquer comme lus
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (!mounted) return;
      if (!error && data) {
        setMessages(data as Message[]);
        scrollToBottom();
      }
      setLoading(false);

      await supabase.from("message_read_receipts").upsert({
        conversation_id: conversationId,
        user_id: currentUserId,
        last_read_at: new Date().toISOString(),
      });
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Realtime: nouveaux messages
  useEffect(() => {
    const channel = supabase
      .channel(`conv:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottomSmooth();

          const m = payload.new as Message;
          if (m.sender_id !== currentUserId) {
            supabase.from("message_read_receipts").upsert({
              conversation_id: conversationId,
              user_id: currentUserId,
              last_read_at: new Date().toISOString(),
            }).then();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);

  // Typing indicator (broadcast) + read receipts on visibility
  useEffect(() => {
    const typingChannel = supabase.channel(`typing:${conversationId}`, {
      config: { broadcast: { self: true }, presence: { key: currentUserId } },
    });

    typingChannel
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        const userId = payload.userId as string;
        if (userId === currentUserId) return;
        setTypingUsers((prev) => new Set(prev).add(userId));
        setTimeout(() => {
          setTypingUsers((prev) => {
            const n = new Set(prev);
            n.delete(userId);
            return n;
          });
        }, 2000);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await typingChannel.track({ user_id: currentUserId });
        }
      });

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        supabase.from("message_read_receipts").upsert({
          conversation_id: conversationId,
          user_id: currentUserId,
          last_read_at: new Date().toISOString(),
        }).then();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      supabase.removeChannel(typingChannel);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [conversationId, currentUserId]);

  const onType = () => {
    supabase.channel(`typing:${conversationId}`).send({
      type: "broadcast",
      event: "typing",
      payload: { userId: currentUserId },
    });
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setSending(true);
    setInput("");
    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: text,
      });
      if (error) {
        setInput(text); // rétablir en cas d’erreur
      }
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "auto" });
    });
  };
  const scrollToBottomSmooth = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-gray-500">Chargement…</div>;
  }

  const showTyping = otherUserId && typingUsers.has(otherUserId);

  return (
    <div className="flex-1 flex flex-col border rounded-md">
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => {
          const isMine = m.sender_id === currentUserId;
          return (
            <div key={m.id} className={`max-w-[80%] ${isMine ? "ml-auto text-right" : ""}`}>
              <div className={`inline-block rounded-2xl px-3 py-2 ${isMine ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                <div className="whitespace-pre-wrap break-words">{m.content}</div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(m.created_at).toLocaleString()}
              </div>
            </div>
          );
        })}
        {showTyping && (
          <div className="text-sm text-gray-500 italic">L’artisan est en train d’écrire…</div>
        )}
      </div>

      <div className="border-t p-2 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onInput={onType}
          rows={1}
          placeholder="Écrire un message…"
          className="flex-1 resize-none rounded-md border px-3 py-2 focus:outline-none focus:ring"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
