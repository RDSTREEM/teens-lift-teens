"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PostPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id, content, created_at, user_id")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setPosts(data || []);
    setLoading(false);
  }

  async function handleAddPost(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!newPost.trim() || !user) return;
    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      content: newPost,
    });
    if (error) setError(error.message);
    setNewPost("");
    fetchPosts();
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Post</h2>
      <form onSubmit={handleAddPost} className="flex gap-2 mb-6">
        <Input
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share something..."
        />
        <Button type="submit">Post</Button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-zinc-500">No posts yet.</div>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id} className="bg-zinc-100 rounded-lg p-4">
              <span>{post.content}</span>
              <div className="text-xs text-zinc-500 mt-1">
                {new Date(post.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
