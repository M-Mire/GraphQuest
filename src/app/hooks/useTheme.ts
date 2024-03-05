import { useState, useCallback } from "react";
import { Theme } from "../types";
import themes from "../themes/themes";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(themes.nordic!);

  const setThemeCallback = useCallback(
    (value: React.SetStateAction<Theme>) => {
      setTheme((prevTheme) =>
        typeof value === "function" ? value(prevTheme) : value,
      );
    },
    [setTheme],
  );

  return { theme: theme, setTheme: setThemeCallback };
};
