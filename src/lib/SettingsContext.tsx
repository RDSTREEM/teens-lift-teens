"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface SettingsContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
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

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    // load from localStorage
    try {
      const raw = localStorage.getItem(THEME_KEY);
      if (raw === "light" || raw === "dark" || raw === "system") {
        setThemeState(raw);
      }
    } catch (e) {
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
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}

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
      else mql.addListener(handleSystem as any);
    }

    return () => {
      if (mql) {
        if (mql.removeEventListener)
          mql.removeEventListener("change", handleSystem);
        else mql.removeListener(handleSystem as any);
      }
    };
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <SettingsContext.Provider value={{ theme, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
