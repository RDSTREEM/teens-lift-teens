import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Heart, Users, Shield } from "lucide-react";

const Welcome = () => {
  const [nickname, setNickname] = useState("");
  const [currentStep, setCurrentStep] = useState<"splash" | "onboarding">(
    "splash",
  );
  const navigate = useNavigate();

  const avatarColors = [
    "from-primary to-secondary",
    "from-accent to-sunny",
    "from-safe to-primary-glow",
    "from-secondary to-accent",
    "from-sunny to-safe",
  ];

  const randomAvatar =
    avatarColors[Math.floor(Math.random() * avatarColors.length)];

  const handleEnterSpace = () => {
    if (nickname.trim()) {
      localStorage.setItem("teenspace-nickname", nickname);
      localStorage.setItem("teenspace-avatar", randomAvatar);
      navigate("/home");
    }
  };

  if (currentStep === "splash") {
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

          <Button
            onClick={() => setCurrentStep("onboarding")}
            className="teen-button-primary w-full"
            size="lg"
          >
            Get Started ✨
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <Card className="teen-card max-w-sm w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome to Teen Space! 🌟
          </h2>
          <p className="text-muted-foreground">
            Let's set up your anonymous profile
          </p>
        </div>

        {/* Avatar Preview */}
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 rounded-full bg-gradient-to-r ${randomAvatar} flex items-center justify-center text-white text-2xl font-bold`}
          >
            {nickname ? nickname.charAt(0).toUpperCase() : "?"}
          </div>
        </div>

        {/* Nickname Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Choose your nickname
          </label>
          <Input
            placeholder="Enter a fun nickname..."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="teen-input"
            maxLength={20}
          />
          <p className="text-xs text-muted-foreground">
            This keeps you anonymous and safe 🛡️
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleEnterSpace}
            disabled={!nickname.trim()}
            className="teen-button-primary w-full"
            size="lg"
          >
            Enter Teen Space 🚀
          </Button>

          <Button
            variant="ghost"
            onClick={() => setCurrentStep("splash")}
            className="w-full"
          >
            Back
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Welcome;
