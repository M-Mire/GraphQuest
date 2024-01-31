import { useEffect } from "react";
import { useThemeContext } from "../context/ThemeContext";

const useThemeBackground = () => {
  const { theme } = useThemeContext();

  useEffect(() => {
    document.body.style.backgroundColor = theme.background.primary;

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [theme]);

  return { theme };
};

export default useThemeBackground;
