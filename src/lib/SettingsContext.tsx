"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface SettingsContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  compactLayout: boolean;
  setCompactLayout: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};

const THEME_KEY = "tlt_settings_theme";
const SETTINGS_KEY = "tlt_settings";

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setThemeState] = useState<Theme>("system");
  const [reducedMotion, setReducedMotionState] = useState<boolean>(false);
  const [compactLayout, setCompactLayoutState] = useState<boolean>(false);

  useEffect(() => {
    // load from localStorage (single settings object preferred, fallback to old key)
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed.theme === "light" ||
          parsed.theme === "dark" ||
          parsed.theme === "system"
        ) {
          setThemeState(parsed.theme);
        }
        if (typeof parsed.reducedMotion === "boolean")
          setReducedMotionState(parsed.reducedMotion);
        if (typeof parsed.compactLayout === "boolean")
          setCompactLayoutState(parsed.compactLayout);
        return;
      }

      const old = localStorage.getItem(THEME_KEY);
      if (old === "light" || old === "dark" || old === "system") {
        setThemeState(old);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const apply = (t: Theme) => {
      const root = document.documentElement;
      if (t === "dark") {
        root.classList.add("dark");
      } else if (t === "light") {
        root.classList.remove("dark");
      } else {
        // system
        const isDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDark) root.classList.add("dark");
        else root.classList.remove("dark");
      }
    };

    apply(theme);

    try {
      const toSave = { theme, reducedMotion, compactLayout };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(toSave));
      // keep legacy key for compatibility
      localStorage.setItem(THEME_KEY, theme);
    } catch {}

    // apply reduced motion class
    const root = document.documentElement;
    if (reducedMotion) root.classList.add("reduce-motion");
    else root.classList.remove("reduce-motion");

    // if system, listen to changes
    let mql: MediaQueryList | null = null;
    const handleSystem = (ev: MediaQueryListEvent) => {
      if (theme !== "system") return;
      const root = document.documentElement;
      if (ev.matches) root.classList.add("dark");
      else root.classList.remove("dark");
    };
    if (theme === "system" && window.matchMedia) {
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      if (mql.addEventListener) mql.addEventListener("change", handleSystem);
      // legacy addListener/removeListener intentionally omitted for brevity
    }

    return () => {
      if (mql && mql.removeEventListener) {
        mql.removeEventListener("change", handleSystem);
      }
    };
  }, [theme, reducedMotion, compactLayout]);

  const setTheme = (t: Theme) => setThemeState(t);
  const setReducedMotion = (v: boolean) => setReducedMotionState(v);
  const setCompactLayout = (v: boolean) => setCompactLayoutState(v);

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        reducedMotion,
        setReducedMotion,
        compactLayout,
        setCompactLayout,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
