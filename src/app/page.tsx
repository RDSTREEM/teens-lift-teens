"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/AuthContext";

function MainRouter() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/welcome");
      }
    }
  }, [user, loading, router]);

  return (
    <main className="flex items-center justify-center h-[100vh] text-3xl">
      <div>Loading...</div>
    </main>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
}
