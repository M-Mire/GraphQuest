"use client";
import MainPage from "~/app/_components/MainPage";
import { pageConfigurationDFS as pageConfiguration } from "~/app/_pageConfigs/config";
import { ThemeContext } from "../context/ThemeContext";
import { useTheme } from "../hooks/useTheme";

export default function DFSPage() {
  const { theme, setTheme } = useTheme();
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <MainPage pageConfiguration={pageConfiguration} />
    </ThemeContext.Provider>
  );
}
