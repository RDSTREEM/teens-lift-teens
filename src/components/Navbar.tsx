"use client";

import React, { useEffect, useState } from "react";
import { Home, User, Settings as Gear, LogOut, Book } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SettingsPanel from "@/components/SettingsPanel";
import { useAuth } from "@/lib/AuthContext";
import { useSettings } from "@/lib/SettingsContext";

const Nav = ({ onOpenSettings }: { onOpenSettings?: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useSettings();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { icon: <Home className="w-6 h-6" />, label: "Home", href: "/home" },
    {
      icon: <Book className="w-6 h-6" />,
      label: "Notes",
      href: "/home/notes",
    },
    { icon: <User className="w-6 h-6" />, label: "Profile", href: "/profile" },
  ];

  const handleNav = (href: string) => {
    router.push(href);
  };

  const activeClass = (href: string) =>
    pathname === href ? "text-blue-600" : "text-gray-700 hover:text-blue-500";

  const BottomNav = (
    <div
      className={`fixed bottom-0 w-full flex justify-around p-2 ${theme === "dark" ? "bg-zinc-900 border-t border-zinc-700 text-white" : "bg-white border-t border-gray-200"}`}
    >
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => handleNav(item.href)}
          className={`flex flex-col items-center ${activeClass(item.href)}`}
        >
          {item.icon}
          <span className="text-xs">{item.label}</span>
        </button>
      ))}
      <button
        onClick={() => onOpenSettings?.()}
        className="flex flex-col items-center text-gray-700 hover:text-blue-500"
      >
        <Gear className="w-6 h-6" />
        <span className="text-xs">Settings</span>
      </button>
    </div>
  );

  const Navbar = (
    <div
      className={`w-full flex justify-around p-2 ${theme === "dark" ? "bg-zinc-900 border-b border-zinc-700 text-white" : "bg-white border-b border-gray-200"}`}
    >
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => handleNav(item.href)}
          className={`flex flex-col items-center ${activeClass(item.href)}`}
        >
          {item.icon}
          <span className="text-xs">{item.label}</span>
        </button>
      ))}
      <div className="flex items-center gap-2">
        <button onClick={() => onOpenSettings?.()} className="p-1">
          <Gear className="w-6 h-6" />
        </button>
        {user ? (
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 p-1"
            title={user.email}
          >
            <User className="w-6 h-6" />
          </button>
        ) : (
          <button onClick={() => router.push("/signin")} className="p-1">
            <User className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );

  return isMobile ? BottomNav : Navbar;
};

function NavWrapper() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return (
    <>
      <Nav onOpenSettings={() => setIsSettingsOpen(true)} />
      <SettingsPanel
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}

export default NavWrapper;
