"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Heart, Users, Shield } from "lucide-react";

// Define possible avatar color classes
const avatarColors = [
  "from-pink-500 to-yellow-500",
  "from-blue-500 to-green-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-red-500",
  "from-teal-500 to-cyan-500",
];

const WelcomePage = () => {
  const [nickname, setNickname] = useState("");
  const [currentStep, setCurrentStep] = useState<"splash" | "onboarding">(
    "splash",
  );
  const [randomAvatar, setRandomAvatar] = useState(
    avatarColors[Math.floor(Math.random() * avatarColors.length)],
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="text-center space-y-8 max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient-primary">
              Teen Space
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              By Teens, For Teens
            </p>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-left">
            <Shield className="w-6 h-6 text-safe" />
            <span className="text-foreground">Safe & Anonymous</span>
          </div>
          <div className="flex items-center space-x-3 text-left">
            <Users className="w-6 h-6 text-primary" />
            <span className="text-foreground">Connect with Peers</span>
          </div>
          <div className="flex items-center space-x-3 text-left">
            <Sparkles className="w-6 h-6 text-accent" />
            <span className="text-foreground">Build Resilience</span>
          </div>
        </div>

        <Button className="teen-button-primary w-full" size="lg">
          <Link href={"/signin"}> Get Started </Link>
        </Button>
      </div>
    </div>
  );
};

export default WelcomePage;
