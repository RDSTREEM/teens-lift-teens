import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import ClientNavbar from "../components/ClientNavbar";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teens Lift Teens",
  description:
    "A safe-space platform for teens which helps them in their journey of self-improvement through resillience, habbit management system and supportive anonymous communications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
      >
        <AuthProvider>
          <ClientNavbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
