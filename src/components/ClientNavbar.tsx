"use client";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function ClientNavbar() {
  const pathname = usePathname();
  const hideNavbarRoutes = ["/welcome", "/signin", "/login"];
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (shouldHideNavbar) return null;
  return <Navbar />;
}
