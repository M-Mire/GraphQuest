"use client";
import MainPage from "~/app/_components/MainPage";
import { pageConfigurationPrimJarnik as pageConfiguration } from "~/app/_pageConfigs/config";
import { ThemeContext } from "../context/ThemeContext";
import { useTheme } from "../hooks/useTheme";

export default function PRIMJARNIKPage() {
  const { theme, setTheme } = useTheme();
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <MainPage pageConfiguration={pageConfiguration} />
    </ThemeContext.Provider>
  );
}
