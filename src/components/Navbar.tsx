import React from "react";
import Link from "next/link";

interface NavbarLinkProps {
  href: string;
  label: string;
}


const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-500">
      <span className="bg-indigo-500 text-white px-2 py-1 rounded-lg">TLT</span>
      <span className="hidden sm:inline text-white">Teens Lift Teens</span>
    </Link>
  );
};

const NavbarLink: React.FC<NavbarLinkProps> = ({ href, label }) => {
  return (
    <Link
      href={href}
      className="relative text-white/90 hover:text-white transition-colors duration-200 group"
    >
      {label}
      <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-zinc-900/95 backdrop-blur-md shadow-md z-50">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-6">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          <NavbarLink href="/about" label="About" />
          <NavbarLink href="/features" label="Features" />
          <NavbarLink href="/community" label="Community" />
          <NavbarLink href="/resources" label="Resources" />
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-sm font-medium text-white/90 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
