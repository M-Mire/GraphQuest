import { useState, useCallback } from "react";
import useLocalStorage from "./useLocalStorage";
import { Theme } from "../types";
import themes from "../themes/themes";

export const useTheme = () => {
  const [getThemeStorageValue, setThemeStorageValue] = useLocalStorage<Theme>(
    "theme",
    themes.nightFox!,
  );
  const [theme, setSystemTheme] = useState<Theme>(getThemeStorageValue);

  const setTheme = useCallback(
    (value: React.SetStateAction<Theme>) => {
      setSystemTheme((prevTheme) =>
        typeof value === "function" ? value(prevTheme) : value,
      );
      setThemeStorageValue(value);
    },
    [setSystemTheme, setThemeStorageValue],
  );

  return { theme: theme, setTheme };
};
