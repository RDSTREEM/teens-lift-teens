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
  // Use hooks unconditionally
  const [checked, setChecked] = React.useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Wait until this component is mounted on the client to avoid
  // calling router.replace during SSR. This keeps hooks order stable.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/signin");
      } else {
        setChecked(true);
      }
    }
  }, [user, loading, router]);

  if (!mounted) return null;
  if (loading || !checked) return null;
  return <>{children}</>;
}
