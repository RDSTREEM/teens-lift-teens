"use client";
import React from "react";
import { useSettings } from "@/lib/SettingsContext";
import { X, Sun, Moon, Monitor } from "lucide-react";

export default function SettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { theme, setTheme } = useSettings();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card text-card-foreground rounded-xl p-6 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Settings</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted/30">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 font-medium">Theme</p>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("system")}
                className={`flex-1 p-2 rounded ${theme === "system" ? "ring-2 ring-primary" : "border"}`}
                title="System"
              >
                <Monitor className="w-5 h-5 mx-auto" />
                <div className="text-xs mt-1">System</div>
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 p-2 rounded ${theme === "light" ? "ring-2 ring-primary" : "border"}`}
                title="Light"
              >
                <Sun className="w-5 h-5 mx-auto" />
                <div className="text-xs mt-1">Light</div>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 p-2 rounded ${theme === "dark" ? "ring-2 ring-primary" : "border"}`}
                title="Dark"
              >
                <Moon className="w-5 h-5 mx-auto" />
                <div className="text-xs mt-1">Dark</div>
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium">Other</p>
            <p className="text-sm text-muted-foreground">
              More settings coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
