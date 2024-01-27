import { useState, useMemo, useEffect } from "react";
import type pageConfigurationType from "~/app/_pageConfigs/config";
import { pageConfigurationMap } from "~/app/_pageConfigs/config";
import type { pageEnum } from "~/app/_pageConfigs/config";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import DoneIcon from "@mui/icons-material/Done";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useThemeContext } from "~/app/context/ThemeContext";

interface MultiSwitcherProps {
  pageConfiguration: pageConfigurationType;
  isEditMode: boolean;
  setMultiSwitcher: React.Dispatch<React.SetStateAction<boolean>>;
  clearNodes: () => void;
  createQueryString: (name: string, value: string) => string;
  deleteQueryString: (name: string) => string;
}
const MultiSwitcher: React.FC<MultiSwitcherProps> = ({
  pageConfiguration,
  isEditMode,
  setMultiSwitcher,
  deleteQueryString,
}) => {
  const [hoveredDiv, setHoveredDiv] = useState<pageEnum | null>(null);
  const [query, setQuery] = useState<string>("");
  const pathname = usePathname();
  const mapArray = Array.from(pageConfigurationMap);
  const { theme } = useThemeContext();

  const filteredAlgorithms = useMemo(() => {
    return mapArray.filter((algorithm) => {
      return algorithm[1].algorithmName
        .toLowerCase()
        .includes(query.toLowerCase());
    });
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMultiSwitcher(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setMultiSwitcher]);

  const handleMouseEnter = (id: pageEnum | null) => {
    if (id !== null) {
      setHoveredDiv(id);
    }
  };

  const handleMouseLeave = () => {
    setHoveredDiv(null);
  };

  return (
    <div
      className="relative z-10"
      onMouseEnter={() => handleMouseEnter(hoveredDiv)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute z-10 h-48 w-64 rounded-l-lg border-2 border-solid "
        style={{
          borderColor: theme.background.quaternary,
          background: theme.background.primary,
        }}
      >
        <div
          className="flex h-12 w-full items-center justify-between border-b-2 border-solid "
          style={{ borderColor: theme.background.quaternary }}
        >
          <div className="flex items-center">
            <SearchIcon
              style={{
                fill: theme.background.quaternary,
                fontSize: "1.5rem",
              }}
              className="ml-4 mr-1"
            />
            <input
              placeholder="Find Algorithm"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              className="w-40  bg-inherit text-white placeholder-slate-500"
              autoFocus
            />
          </div>
          <div
            className="mr-2 flex items-center rounded-lg border-2  p-[1px] text-xs"
            style={{
              borderColor: theme.background.quaternary,
              color: theme.text.primary,
            }}
          >
            Esc
          </div>
        </div>
        <div style={{ maxHeight: "calc(100% - 3rem)", overflowY: "auto" }}>
          {!!filteredAlgorithms.length ? (
            filteredAlgorithms.map((k, i) => {
              return (
                <div key={k[0]} className="px-4">
                  <div
                    className={`mt-2 flex w-full items-center justify-between p-1  ${
                      pageConfiguration.algorithmName === k[1].algorithmName
                        ? "rounded bg-gray-700"
                        : hoveredDiv === k[0]
                        ? "rounded bg-gray-500"
                        : ""
                    } ${i === filteredAlgorithms.length - 1 && "mb-2"}`}
                    onMouseEnter={() => handleMouseEnter(k[0])}
                    style={{ color: theme.text.primary }}
                  >
                    <p>{k[1].algorithmName}</p>
                    {pageConfiguration.algorithmName === k[1].algorithmName && (
                      <DoneIcon />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="p-4 text-sm " style={{ color: theme.text.primary }}>
              Your search for &quot;{query}&ldquo; algorithm was unsuccessful
            </p>
          )}
        </div>
      </div>

      {hoveredDiv !== null &&
        mapArray.map((k) => {
          const isViewCurrentOptions =
            pageConfiguration.algorithmName === k[1].algorithmName; // if user viewing the options for currentPage
          return (
            <div
              key={k[0]}
              className="absolute left-64 z-10 h-48 w-64 rounded-r-lg border-y-2 border-r-2 border-solid "
              style={{
                display: hoveredDiv === k[0] ? "block" : "none",
                borderColor: theme.background.quaternary,
                background: theme.background.primary,
              }}
            >
              <div
                className=" flex h-12 w-full justify-between border-b-2 border-solid "
                style={{ borderColor: theme.background.quaternary }}
              >
                <p className="m-auto" style={{ color: theme.text.primary }}>
                  {k[0]}
                </p>
              </div>

              <div className="px-4">
                {isViewCurrentOptions && isEditMode ? (
                  <EditButton
                    pageConfiguration={pageConfiguration}
                    k={k}
                    isEditMode={isEditMode}
                    styles={{
                      color: theme.text.primary,
                      background: theme.background.quaternary,
                    }}
                  />
                ) : (
                  <Link href={k[1].urlName + "?edit=true"}>
                    <EditButton
                      pageConfiguration={pageConfiguration}
                      k={k}
                      isEditMode={isEditMode}
                      styles={{
                        color: theme.text.primary,
                        background: theme.background.quaternary,
                      }}
                    />
                  </Link>
                )}
              </div>
              <div className="px-4 py-2">
                {isViewCurrentOptions && !isEditMode ? (
                  <ViewButton
                    pageConfiguration={pageConfiguration}
                    k={k}
                    isEditMode={isEditMode}
                    styles={{
                      color: theme.text.primary,
                      background: theme.background.quaternary,
                    }}
                  />
                ) : (
                  <Link
                    href={
                      isViewCurrentOptions
                        ? pathname + "?" + deleteQueryString("edit")
                        : k[1].urlName
                    }
                  >
                    <ViewButton
                      pageConfiguration={pageConfiguration}
                      k={k}
                      isEditMode={isEditMode}
                      styles={{
                        color: theme.text.primary,
                        background: theme.background.quaternary,
                      }}
                    />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default MultiSwitcher;

interface ButtonProps {
  pageConfiguration: pageConfigurationType;
  k: [pageEnum, pageConfigurationType];
  isEditMode: boolean;
  styles: { color: string; background: string };
}

const EditButton: React.FC<ButtonProps> = ({
  pageConfiguration,
  k,
  isEditMode,
  styles,
}) => {
  return (
    <div
      className={`mt-2 flex w-full items-center justify-between rounded p-1  hover:bg-slate-500 ${
        pageConfiguration.algorithmName === k[1].algorithmName && isEditMode
          ? "bg-gray-700"
          : ""
      }`}
      style={{ color: styles.color }}
    >
      <span>
        <EditIcon
          style={{
            fill: styles.background,
          }}
        />
        Edit {k[0]}
      </span>
      {isEditMode && pageConfiguration.algorithmName === k[1].algorithmName && (
        <DoneIcon />
      )}
    </div>
  );
};

const ViewButton: React.FC<ButtonProps> = ({
  pageConfiguration,
  k,
  isEditMode,
  styles,
}) => {
  return (
    <div
      className={`mt-2 flex w-full items-center justify-between rounded p-1 hover:bg-slate-500 ${
        pageConfiguration.algorithmName === k[1].algorithmName && !isEditMode
          ? "bg-gray-700"
          : ""
      }`}
      style={{ color: styles.color }}
    >
      <p>
        <RemoveRedEyeIcon
          style={{
            fill: styles.background,
          }}
        />
        View {k[0]}
      </p>
      {!isEditMode &&
        pageConfiguration.algorithmName === k[1].algorithmName && <DoneIcon />}
    </div>
  );
};
