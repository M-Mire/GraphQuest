import { useState, useEffect } from "react";
import { useThemeContext } from "~/app/context/ThemeContext";
import { pageEnum, pageConfigurationType } from "~/app/_pageConfigs/config";
import SearchInput from "./PageMenuItems/SearchInput";
import OptionsList from "./PageMenuItems/OptionsList";
import HoveredOption from "./PageMenuItems/HoveredOption";

interface PageMenuProps {
  pageConfiguration?: pageConfigurationType;
  setPageMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const PageMenu = ({ pageConfiguration, setPageMenu }: PageMenuProps) => {
  const [hoveredDiv, setHoveredDiv] = useState<pageEnum | null>(null);
  const [query, setQuery] = useState<string>("");

  const { theme } = useThemeContext();

  // Listener for Esc key to exit the page menu interface
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPageMenu(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setPageMenu]);

  // Track the hovered div
  const handleMouseEnter = (id: pageEnum | null) => {
    if (id !== null) {
      setHoveredDiv(id);
    }
  };
  // If the mouse leaves the div set the hovered div to null
  const handleMouseLeave = () => {
    setHoveredDiv(null);
  };

  return (
    <div
      className="relative z-10"
      onMouseEnter={() => handleMouseEnter(hoveredDiv)}
      onMouseLeave={handleMouseLeave}
      style={{
        background: theme.background.primary,
        borderColor: theme.background.quaternary,
        color: theme.text.primary,
      }}
    >
      <div className="absolute z-10 mt-16 h-48 w-64 rounded-l-lg border-2 border-solid border-inherit bg-inherit">
        {/* Search Input to filter Options */}
        <SearchInput setQuery={setQuery} query={query} />
        {/* Display filtered Options */}
        <OptionsList
          query={query}
          pageConfiguration={pageConfiguration}
          hoveredDiv={hoveredDiv}
          handleMouseEnter={handleMouseEnter}
        />
      </div>

      {/* Display (edit & view) / (solo & dual mode) options on hover */}
      <HoveredOption
        hoveredDiv={hoveredDiv}
        pageConfiguration={pageConfiguration}
      />
    </div>
  );
};

export default PageMenu;
