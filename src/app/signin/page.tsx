"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: { username: signupUsername },
      },
    });
    if (error) {
      setSignupError(error.message);
    } else {
      setSignedUp(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSignedUp(true);
  };

  if (signedUp) {
    return (
      <main className="pt-20 min-h-screen text-zinc-900 flex items-center justify-center">
        <div className="w-full max-w-md bg-zinc-100/70 backdrop-blur-md p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
          <p className="mb-6">
            {showLogin
              ? "You are now logged in."
              : "Your account has been created. You are now signed in."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen text-zinc-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-100/70 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {showLogin ? "Log In" : "Create Account"}
        </h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={showLogin ? handleLogin : handleSignup}
        >
          {!showLogin && (
            <>
              <div>
                <label htmlFor="username" className="block mb-1 font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  required
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <Input
              id={showLogin ? "login-email" : "email"}
              type="email"
              placeholder="you@example.com"
              required
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor={showLogin ? "login-password" : "password"}
              className="block mb-1 font-medium"
            >
              Password
            </label>
            <Input
              id={showLogin ? "login-password" : "password"}
              type="password"
              placeholder="••••••••"
              required
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
          </div>
          {signupError && !showLogin && (
            <div className="text-red-500 text-sm text-center">
              {signupError}
            </div>
          )}
          <Button type="submit" className="w-full mt-2">
            {showLogin ? "Log In" : "Sign Up"}
          </Button>
        </form>
        <p className="text-sm text-zinc-900/60 mt-4 text-center">
          {showLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="text-indigo-400 hover:underline bg-transparent border-none outline-none cursor-pointer"
            onClick={() => setShowLogin(!showLogin)}
          >
            {showLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </main>
  );
}
