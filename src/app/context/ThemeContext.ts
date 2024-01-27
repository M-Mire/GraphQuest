import { createContext, useContext } from "react";
import { Theme } from "../types";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (value: Theme) => void;
}
export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined,
);

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used within ThemeContext");
  }

  return context;
}
