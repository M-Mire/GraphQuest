import { useState } from "react";
import { useThemeContext } from "~/app/context/ThemeContext";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import themes from "~/app/themes/themes";
import { getThemes } from "~/app/utils/getThemes";

const Themes = () => {
  const { theme, setTheme } = useThemeContext();
  const themeObjects = getThemes();
  const [isOpen, setDropDown] = useState<boolean>(false);
  const themeStyle = {
    background: theme.background.primary,
    color: theme.text.primary,
    borderColor: theme.background.quaternary,
  };

  const handleThemeChange = (name: string) => {
    if (themes?.[name]) {
      setTheme(themes[name]!);
    } else {
      console.error(`Theme "${name}" not found`);
    }
  };

  return (
    <div className="relative">
      <button
        name="changeView"
        className="rounded border-2 py-1 pl-2 pr-1 text-sm transition duration-300 ease-in-out hover:bg-gray-400"
        style={themeStyle}
        onClick={() => setDropDown(!isOpen)}
      >
        Themes <ArrowDropDownIcon style={{ padding: 0, fontSize: "1rem" }} />
      </button>
      {isOpen && (
        <>
          <div
            className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border-2 border-solid border-slate-700"
            style={themeStyle}
          >
            {themeObjects.map(({ name, theme: t }, index) => (
              <ThemesItems
                key={t.name}
                themeStyle={themeStyle}
                themeName={t.name}
                onClick={() => handleThemeChange(name)}
                roundedB={index + 1 === themeObjects.length}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

interface ThemesItemsProps {
  themeStyle: {
    background: string;
    color: string;
    borderColor: string;
  };
  themeName: string;
  roundedB?: boolean;
  onClick?: () => void;
}

const ThemesItems = ({
  themeStyle,
  themeName,
  roundedB,
  onClick,
}: ThemesItemsProps) => {
  return (
    <button
      className={`flex h-12 w-full items-center justify-between rounded-t-lg border-solid ${
        roundedB ? "rounded-b-lg" : "border-b-2"
      }`}
      style={themeStyle}
      onClick={onClick}
    >
      <span className="p-2">{themeName}</span>
    </button>
  );
};

export default Themes;
