import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="pt-20 min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900/70 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form className="flex flex-col gap-4">
          <Input label="Username" type="text" placeholder="Choose a username" required />
          <Input label="Email" type="email" placeholder="you@example.com" required />
          <Input label="Password" type="password" placeholder="••••••••" required />
          <Button type="submit" className="w-full mt-2">
            Sign Up
          </Button>
        </form>
        <p className="text-sm text-white/60 mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}
