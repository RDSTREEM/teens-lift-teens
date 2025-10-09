"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ResilienceHubPage() {
  type Blog = {
    id: string;
    title?: string;
    content?: string;
    created_at?: string;
  };
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, content, created_at")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setBlogs(data || []);
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Resilience Hub</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="text-zinc-500">No blog posts yet.</div>
      ) : (
        <ul className="space-y-4">
          {blogs.map((blog) => (
            <li key={blog.id} className="bg-zinc-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
              <div className="mb-2">{blog.content}</div>
              <div className="text-xs text-zinc-500">
                {blog.created_at
                  ? new Date(blog.created_at).toLocaleString()
                  : ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
