"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminPanel() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Replace with your admin check logic
  const isAdmin = user && user.email && user.email.endsWith("@admin.com");

  async function handleCreateBlog(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!title.trim() || !content.trim()) {
      setError("Title and content required.");
      return;
    }
    if (!user) {
      setError("User not authenticated.");
      return;
    }
    const { error } = await supabase.from("blogs").insert({
      title,
      content,
      author_id: user.id,
    });
    if (error) setError(error.message);
    else {
      setSuccess("Blog post created!");
      setTitle("");
      setContent("");
    }
  }

  if (!isAdmin) {
    return <div className="p-8">Access denied. Admins only.</div>;
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <form onSubmit={handleCreateBlog} className="flex flex-col gap-4 mb-6">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog Title"
        />
        <textarea
          className="border rounded p-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Blog Content"
          rows={6}
        />
        <Button type="submit">Create Blog Post</Button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
    </div>
  );
}
