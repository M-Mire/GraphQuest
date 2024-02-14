"use client";
import { useTheme } from "./hooks/useTheme";
import { ThemeContext } from "./context/ThemeContext";
import HomePage from "./_components/HomePage";

export default function Home() {
  const { theme, setTheme } = useTheme();
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <HomePage />
    </ThemeContext.Provider>
  );
}
