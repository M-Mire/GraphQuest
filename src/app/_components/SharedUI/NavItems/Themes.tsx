import { useState } from "react";
import { useThemeContext } from "~/app/context/ThemeContext";
import themes from "~/app/themes/themes";
import { getThemes } from "~/app/utils/getThemes";
import ColorLensIcon from "@mui/icons-material/ColorLens";

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
      <div
        className=" px-[2px] pb-[2px] pt-[1px] text-sm transition duration-300 ease-in-out hover:bg-gray-400"
        style={{ ...themeStyle, background: "inherit" }}
        onClick={() => setDropDown(!isOpen)}
      >
        <ColorLensIcon
          style={{
            padding: 0,
            fontSize: "1.5rem",
            color: theme.background.quaternary,
          }}
        />
      </div>
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
