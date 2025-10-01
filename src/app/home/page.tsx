"use client";
import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="pt-20 min-h-screen text-zinc-900 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-zinc-100/70 backdrop-blur-md p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to Teens Lift Teens</h1>
        <nav className="flex flex-col gap-4">
          <Link
            href="/home/notes"
            className="text-lg text-indigo-600 hover:underline"
          >
            My Notes
          </Link>
          <Link
            href="/home/post"
            className="text-lg text-indigo-600 hover:underline"
          >
            Post
          </Link>
          <Link
            href="/home/chat"
            className="text-lg text-indigo-600 hover:underline"
          >
            Anonymous Chat
          </Link>
          <Link
            href="/home/resilience-hub"
            className="text-lg text-indigo-600 hover:underline"
          >
            Resilience Hub
          </Link>
          <Link
            href="/home/admin"
            className="text-lg text-indigo-600 hover:underline"
          >
            Admin Panel
          </Link>
        </nav>
      </div>
    </main>
  );
}
