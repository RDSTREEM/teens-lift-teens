"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NotesPage() {
  const { user } = useAuth();
  type Note = { id: string; content?: string; created_at?: string };
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchNotes();
  }, [user]);

  async function fetchNotes() {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("id, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setNotes(data || []);
    setLoading(false);
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!newNote.trim()) return;
    if (!user) {
      setError("User not authenticated.");
      return;
    }
    const { error } = await supabase.from("notes").insert({
      user_id: user.id,
      content: newNote,
    });
    if (error) setError(error.message);
    setNewNote("");
    fetchNotes();
  }

  async function handleDeleteNote(id: string) {
    await supabase.from("notes").delete().eq("id", id);
    fetchNotes();
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Notes</h2>
      <form onSubmit={handleAddNote} className="flex gap-2 mb-6">
        <Input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
        />
        <Button type="submit">Add</Button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : notes.length === 0 ? (
        <div className="text-zinc-500">No notes yet.</div>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="bg-zinc-100 rounded-lg p-4 flex justify-between items-center"
            >
              <span>{note.content}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteNote(note.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
