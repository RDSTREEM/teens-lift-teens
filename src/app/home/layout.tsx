"use client";
import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is for /home and its subpages
  // We'll use a client component for auth protection
  return <AuthGuard>{children}</AuthGuard>;
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  // This is a client component to check auth
  if (typeof window === "undefined") return null;
  // Use dynamic import to avoid hydration mismatch
  const [checked, setChecked] = React.useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/signin");
      } else {
        setChecked(true);
      }
    }
  }, [user, loading, router]);

  if (loading || !checked) return null;
  return <>{children}</>;
}
