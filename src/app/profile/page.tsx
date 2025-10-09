"use client";

import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
  };

  if (loading) return <div className="pt-20 p-4">Loading...</div>;

  if (!user)
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="p-8 bg-card text-card-foreground rounded-xl">
          You are not signed in.
        </div>
      </main>
    );

  return (
    <main className="pt-20 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl bg-card text-card-foreground rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
        <div className="space-y-2 mb-6">
          <div>
            <div className="text-sm text-muted-foreground">Email</div>
            <div className="font-medium">{user.email}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">ID</div>
            <div className="font-mono text-xs">{user.id}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.push("/home")}>
            Go Home
          </Button>
          <Button onClick={handleLogout} className="flex items-center gap-2">
            <span>Log out</span>
          </Button>
        </div>
      </div>
    </main>
  );
}
