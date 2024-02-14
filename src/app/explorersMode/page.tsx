"use client";
import ExplorerModePage from "../_components/ExplorerModePage";
import { ThemeContext } from "../context/ThemeContext";
import { useTheme } from "../hooks/useTheme";

export default function App() {
  const { theme, setTheme } = useTheme();
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ExplorerModePage />
    </ThemeContext.Provider>
  );
}
