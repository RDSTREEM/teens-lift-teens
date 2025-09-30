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

  useEffect(() => {
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
    const { error } = await supabase.from("chat_messages").insert({
      content: newMessage,
    });
    if (error) setError(error.message);
    setNewMessage("");
    // fetchMessages(); // Not needed if subscription works
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Anonymous Chat</h2>
      <div className="bg-zinc-100 rounded-lg p-4 mb-4 h-80 overflow-y-auto flex flex-col-reverse">
        {loading ? (
          <div>Loading...</div>
        ) : messages.length === 0 ? (
          <div className="text-zinc-500">No messages yet.</div>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="bg-white rounded p-2 shadow text-left"
              >
                <span>{msg.content}</span>
                <div className="text-xs text-zinc-500 mt-1">
                  {new Date(msg.created_at).toLocaleString()}
                </div>
              </li>
            ))}
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
