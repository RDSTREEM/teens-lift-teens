"use client";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [anonId, setAnonId] = useState<string | null>(null);
  const [displayMap, setDisplayMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // ensure we have a persistent anonymous id for this client
    const KEY = "tlt_chat_anon_id";
    let stored = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch (e) {
      // ignore
    }
    if (!stored) {
      // create a 4-digit random id as a string
      const num = Math.floor(1000 + Math.random() * 9000).toString();
      try {
        localStorage.setItem(KEY, num);
      } catch (e) {}
      stored = num;
    }
    setAnonId(stored);

    // load or init the daily display map (maps anon_id -> local daily number)
    const MAP_KEY = "tlt_chat_display_map";
    try {
      const raw = localStorage.getItem(MAP_KEY);
      const today = new Date().toISOString().slice(0, 10);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.date === today && parsed.map) {
          setDisplayMap(parsed.map);
        } else {
          // reset for new day
          localStorage.setItem(
            MAP_KEY,
            JSON.stringify({ date: today, map: {} }),
          );
          setDisplayMap({});
        }
      } else {
        localStorage.setItem(MAP_KEY, JSON.stringify({ date: today, map: {} }));
        setDisplayMap({});
      }
    } catch (e) {
      setDisplayMap({});
    }

    fetchMessages();
    // Optionally, subscribe to new messages
    const subscription = supabase
      .channel("public:chat_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((msgs) => [payload.new, ...msgs]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, content, created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) setError(error.message);
    else setMessages(data || []);
    setLoading(false);
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!newMessage.trim()) return;
    // ensure we have an anonId before sending (in case user sent quickly)
    let sendAnon = anonId;
    if (!sendAnon) {
      const KEY = "tlt_chat_anon_id";
      try {
        const stored = localStorage.getItem(KEY);
        if (stored) sendAnon = stored;
        else {
          const num = Math.floor(1000 + Math.random() * 9000).toString();
          try {
            localStorage.setItem(KEY, num);
          } catch (e) {}
          sendAnon = num;
          setAnonId(num);
        }
      } catch (e) {
        // ignore
      }
    }

    // embed anon id in the message content as a prefix so other clients can parse it
    const payloadContent = sendAnon
      ? `[anon:${sendAnon}]${newMessage}`
      : newMessage;
    const { error } = await supabase.from("chat_messages").insert({
      content: payloadContent,
    });
    if (error) setError(error.message);
    setNewMessage("");
    // fetchMessages(); // Not needed if subscription works
  }

  // generate or lookup a display number for a given anon id (stored locally per day)
  function getDisplayNumberForId(rawId: string | null | undefined) {
    const MAP_KEY = "tlt_chat_display_map";
    // do not map or fallback if there is no anon id
    if (!rawId) return "----";
    const key = rawId;
    // if map already has it, return
    if (displayMap[key]) return displayMap[key];

    // generate a unique 4-digit number not used in map
    const existing = new Set(Object.values(displayMap));
    let num: string | null = null;
    for (let i = 0; i < 50; i++) {
      const candidate = Math.floor(1000 + Math.random() * 9000).toString();
      if (!existing.has(candidate)) {
        num = candidate;
        break;
      }
    }
    if (!num) num = (Math.floor(Math.random() * 9000) + 1000).toString();

    const next = { ...displayMap, [key]: num };
    setDisplayMap(next);
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(MAP_KEY, JSON.stringify({ date: today, map: next }));
    } catch (e) {}
    return num;
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Anonymous Chat</h2>
        <div className="text-sm text-zinc-600">
          Your display ID:{" "}
          <span className="font-semibold">
            #{getDisplayNumberForId(anonId)}
          </span>
        </div>
      </div>
      <div className="bg-zinc-100 rounded-lg p-4 mb-4 h-80 overflow-y-auto flex flex-col-reverse">
        {loading ? (
          <div>Loading...</div>
        ) : messages.length === 0 ? (
          <div className="text-zinc-500">No messages yet.</div>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg) => {
              const rawContent: string = msg.content ?? "";
              const m = rawContent.match(/^\[anon:(\d{4})\]([\s\S]*)$/);
              const extractedAnon = m ? m[1] : null;
              const text = m ? m[2].trim() : rawContent;
              const displayId = getDisplayNumberForId(extractedAnon);
              return (
                <li
                  key={msg.id}
                  className="bg-white rounded p-2 shadow text-left"
                >
                  <div className="flex items-baseline justify-between">
                    <div className="font-semibold text-sm">#{displayId}</div>
                    <div className="text-xs text-zinc-500">
                      {new Date(msg.created_at).toLocaleString()}
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
  );
}
