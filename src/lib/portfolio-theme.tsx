"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function PortfolioThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("nv-selected-theme") as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  const toggle = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      window.localStorage.setItem("nv-selected-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div className={`nv-root${theme === "dark" ? " nv-dark-theme" : ""}`}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function usePortfolioTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("usePortfolioTheme must be used within PortfolioThemeProvider");
  return ctx;
}
