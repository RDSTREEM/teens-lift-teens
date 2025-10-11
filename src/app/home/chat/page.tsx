"use client";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

export default function ChatPage() {
  type ChatMessage = {
    id: string;
    content?: string;
    created_at?: string;
    username?: string | null;
  };

  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // displayMap maps username -> ephemeral display id
  const [displayMap, setDisplayMap] = useState<Record<string, string>>({});

  // local guest id for non-logged in users (to group messages from same browser)
  const [guestId, setGuestId] = useState<string | null>(null);

  // keys and expiry interval (12 hours)
  const MAP_KEY = "tlt_chat_display_map_v2";
  const GUEST_KEY = "tlt_chat_guest_id";
  const EXPIRY_HOURS = 12;

  useEffect(() => {
    // ensure guest id exists
    try {
      let g = localStorage.getItem(GUEST_KEY);
      if (!g) {
        g = `guest_${Math.floor(100000 + Math.random() * 900000)}`;
        localStorage.setItem(GUEST_KEY, g);
      }
      setGuestId(g);
    } catch {
      setGuestId(null);
    }

    // load or initialize display map with expiry timestamp
    try {
      const raw = localStorage.getItem(MAP_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const now = Date.now();
        if (parsed && parsed.expiresAt && parsed.map) {
          if (now < parsed.expiresAt) {
            setDisplayMap(parsed.map);
          } else {
            // expired -> reset
            const expiresAt = now + EXPIRY_HOURS * 60 * 60 * 1000;
            localStorage.setItem(
              MAP_KEY,
              JSON.stringify({ expiresAt, map: {} }),
            );
            setDisplayMap({});
          }
        } else {
          const expiresAt = now + EXPIRY_HOURS * 60 * 60 * 1000;
          localStorage.setItem(MAP_KEY, JSON.stringify({ expiresAt, map: {} }));
          setDisplayMap({});
        }
      } else {
        const expiresAt = Date.now() + EXPIRY_HOURS * 60 * 60 * 1000;
        localStorage.setItem(MAP_KEY, JSON.stringify({ expiresAt, map: {} }));
        setDisplayMap({});
      }
    } catch {
      setDisplayMap({});
    }

    fetchMessages();

    const subscription = supabase
      .channel("public:chat_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          if (newMsg && newMsg.id) setMessages((msgs) => [...msgs, newMsg]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, content, username, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) setError(error.message);
    else setMessages((data || []).slice().reverse());
    setLoading(false);
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!newMessage.trim()) return;

    const username = user?.email ?? guestId ?? "unknown";

    const { error } = await supabase.from("chat_messages").insert({
      content: newMessage,
      username,
    });
    if (error) setError(error.message);
    setNewMessage("");
  }

  // lookup or generate display id for a username and persist until expiry
  function getDisplayForUsername(username?: string | null) {
    if (!username) return "----";
    if (displayMap[username]) return displayMap[username];

    // create unique 4-digit id
    const existing = new Set(Object.values(displayMap));
    let id: string | null = null;
    for (let i = 0; i < 200; i++) {
      const candidate = Math.floor(1000 + Math.random() * 9000).toString();
      if (!existing.has(candidate)) {
        id = candidate;
        break;
      }
    }
    if (!id) id = (Math.floor(Math.random() * 9000) + 1000).toString();

    const next = { ...displayMap, [username]: id };
    setDisplayMap(next);
    try {
      const raw = localStorage.getItem(MAP_KEY);
      const now = Date.now();
      let expiresAt = now + EXPIRY_HOURS * 60 * 60 * 1000;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.expiresAt) expiresAt = parsed.expiresAt;
      }
      localStorage.setItem(MAP_KEY, JSON.stringify({ expiresAt, map: next }));
    } catch {}
    return id;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Anonymous Chat</h2>
        <div className="text-sm text-zinc-600">
          Your display ID:{" "}
          <span className="font-semibold">
            #{getDisplayForUsername(user?.email ?? guestId)}
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        <div className="h-full bg-zinc-100 rounded-lg p-4 mb-4 flex flex-col">
          {loading ? (
            <div>Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-zinc-500">No messages yet.</div>
          ) : (
            <ul className="space-y-2 overflow-y-auto flex-1">
              {messages.map((msg) => {
                const text = msg.content ?? "";
                const displayId = getDisplayForUsername(
                  msg.username ?? undefined,
                );
                return (
                  <li
                    key={msg.id}
                    className="bg-white rounded p-2 shadow text-left"
                  >
                    <div className="flex items-baseline justify-between">
                      <div className="font-semibold text-sm">#{displayId}</div>
                      <div className="text-xs text-zinc-500">
                        {msg.created_at
                          ? new Date(msg.created_at).toLocaleString()
                          : ""}
                      </div>
                    </div>
                    <div className="mt-1">{text}</div>
                  </li>
                );
              })}
            </ul>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button type="submit">Send</Button>
        </form>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
}
