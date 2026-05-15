import { createContext, useContext, useState, useMemo } from "react";
import type React from "react";

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  themeColors: {
    bg: string;
    card: string;
    text: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  const themeColors = useMemo(
    () => ({
      bg: darkMode ? "#0f172a" : "#eef2f6",
      card: darkMode ? "#1e293b" : "white",
      text: darkMode ? "white" : "black",
    }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
