"use client";
import React, { useState, useEffect } from "react";
import { Home, Search, User } from "lucide-react"; // example icons

const Nav = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // mobile breakpoint
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { icon: <Home className="w-6 h-6" />, label: "Home" },
    { icon: <Search className="w-6 h-6" />, label: "Search" },
    { icon: <User className="w-6 h-6" />, label: "Profile" },
  ];

  // Bottom nav (kept exactly the same Tailwind classes)
  const BottomNav = (
    <div className="fixed bottom-0 w-full flex justify-around bg-white border-t border-gray-200 p-2">
      {navItems.map((item) => (
        <button key={item.label} className="flex flex-col items-center text-gray-700 hover:text-blue-500">
          {item.icon}
          <span className="text-xs">{item.label}</span>
        </button>
      ))}
    </div>
  );

  // Top navbar (updated to match bottom nav style)
  const Navbar = (
    <div className="w-full flex justify-around bg-white border-b border-gray-200 p-2">
      {navItems.map((item) => (
        <button key={item.label} className="flex flex-col items-center text-gray-700 hover:text-blue-500">
          {item.icon}
          <span className="text-xs">{item.label}</span>
        </button>
      ))}
    </div>
  );

  return isMobile ? BottomNav : Navbar;
};

export default Nav;
