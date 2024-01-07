import { useState, useMemo, useEffect } from "react";
import type pageConfigurationType from "~/app/_pageConfigs/config";
import { pageConfigurationMap } from "~/app/_pageConfigs/config";
import type { pageEnum } from "~/app/_pageConfigs/config";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import DoneIcon from "@mui/icons-material/Done";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

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
  clearNodes,
  createQueryString,
  deleteQueryString,
}) => {
  const [hoveredDiv, setHoveredDiv] = useState<pageEnum | null>(null);
  const [query, setQuery] = useState<string>("");
  const pathname = usePathname();
  const mapArray = Array.from(pageConfigurationMap);

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
      <div className="absolute z-10 h-48 w-64 rounded-l-lg border-2 border-solid border-slate-700 bg-black">
        <div className="flex h-12 w-full items-center justify-between border-b-2 border-solid border-slate-700">
          <div className="flex items-center">
            <SearchIcon
              style={{
                fill: "white",
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
          <div className="mr-2 flex items-center rounded-lg border-2 border-slate-500 p-[1px] text-xs text-white">
            Esc
          </div>
        </div>

        {!!filteredAlgorithms.length ? (
          filteredAlgorithms.map((k) => {
            return (
              <div key={k[0]} className="px-4">
                <div
                  className={`mt-2 flex w-full items-center justify-between p-1 text-white ${
                    pageConfiguration.algorithmName === k[1].algorithmName
                      ? "rounded bg-gray-700"
                      : hoveredDiv === k[0]
                      ? "rounded bg-gray-500"
                      : ""
                  }`}
                  onMouseEnter={() => handleMouseEnter(k[0])}
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
          <p className="p-4 text-sm text-slate-400">
            Your search for &quot;{query}&ldquo; algorithm was unsuccessful
          </p>
        )}
      </div>

      {hoveredDiv !== null &&
        mapArray.map((k) => {
          const isViewCurrentOptions =
            pageConfiguration.algorithmName === k[1].algorithmName; // if user viewing the options for currentPage
          return (
            <div
              key={k[0]}
              className="absolute left-64 z-10 h-48 w-64 rounded-r-lg border-y-2 border-r-2 border-solid border-slate-700 bg-black"
              style={{ display: hoveredDiv === k[0] ? "block" : "none" }}
            >
              <div className=" flex h-12 w-full justify-between border-b-2 border-solid border-slate-700">
                <p className="m-auto text-white">{k[0]}</p>
              </div>

              <div className="px-4">
                {isViewCurrentOptions && isEditMode ? (
                  <EditButton
                    pageConfiguration={pageConfiguration}
                    k={k}
                    isEditMode={isEditMode}
                  />
                ) : (
                  <Link href={k[1].urlName + "?edit=true"}>
                    <EditButton
                      pageConfiguration={pageConfiguration}
                      k={k}
                      isEditMode={isEditMode}
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
}

const EditButton: React.FC<ButtonProps> = ({
  pageConfiguration,
  k,
  isEditMode,
}) => {
  return (
    <div
      className={`mt-2 flex w-full items-center justify-between rounded p-1 text-white hover:bg-slate-500 ${
        pageConfiguration.algorithmName === k[1].algorithmName && isEditMode
          ? "bg-gray-700"
          : ""
      }`}
    >
      <p>
        <EditIcon /> Edit {k[0]}
      </p>
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
}) => {
  return (
    <div
      className={`mt-2 flex w-full items-center justify-between rounded p-1 text-white hover:bg-slate-500 ${
        pageConfiguration.algorithmName === k[1].algorithmName && !isEditMode
          ? "bg-gray-700"
          : ""
      }`}
    >
      <p>
        <RemoveRedEyeIcon /> View {k[0]}
      </p>
      {!isEditMode &&
        pageConfiguration.algorithmName === k[1].algorithmName && <DoneIcon />}
    </div>
  );
};
