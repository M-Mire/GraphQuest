"use client";
import MainPage from "~/app/_components/MainPage";
import { ThemeContext } from "../context/ThemeContext";
import { useTheme } from "../hooks/useTheme";
import { pageConfigurationBFS as pageConfiguration } from "~/app/_pageConfigs/config";

export default function BFSPage() {
  const { theme, setTheme } = useTheme();
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <MainPage pageConfiguration={pageConfiguration} />
    </ThemeContext.Provider>
  );
}
