import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import useQueryString from "~/app/hooks/useQueryString";
import { pageConfigurationType, pageEnum } from "~/app/_pageConfigs/config";
import { useThemeContext } from "~/app/context/ThemeContext";
import Filter2Icon from "@mui/icons-material/Filter2";

interface ButtonProps {
  pageConfiguration?: pageConfigurationType;
  config: [pageEnum, pageConfigurationType];
}

const BottomButton = ({ pageConfiguration, config }: ButtonProps) => {
  // Necessary variables
  const { theme } = useThemeContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [id, configData] = config;

  // Hooks
  const { createQueryString } = useQueryString();

  // Determine if it's explorers mode and target query name
  const isExplorersMode = id === pageEnum.EXPLORERS;
  const targetQueryName = isExplorersMode ? "compareMode" : "edit";

  // Determine if edit mode is active
  const isModeActive = searchParams?.get(targetQueryName) === "true";

  // Set default href to toggle edit mode
  let href = configData.urlName + `?${targetQueryName}=true`;

  // Modify href if current page configuration matches and edit mode is not active
  if (
    configData.algorithmName === pageConfiguration?.algorithmName &&
    !isModeActive
  ) {
    href = pathname + "?" + createQueryString(targetQueryName, "true");
  }

  // Define container classes for styling
  const containerClasses = `mt-2 flex w-full items-center justify-between rounded p-1 hover:bg-slate-500 ${
    pageConfiguration?.algorithmName === configData.algorithmName &&
    isModeActive
      ? "bg-gray-700"
      : ""
  }`;

  return (
    // Href Link to toggle active mode
    <Link href={href}>
      <div className={containerClasses}>
        <span>
          {/* Display Numbered icon for Explorers Mode and EditIcon */}
          {isExplorersMode ? (
            <>
              <Filter2Icon
                style={{
                  fill: theme.background.quaternary,
                  marginRight: "0.5rem",
                }}
              />
              Dual Mode
            </>
          ) : (
            <>
              <EditIcon
                style={{
                  fill: theme.background.quaternary,
                  marginRight: "0.5rem",
                }}
              />
              Edit {configData.algorithmName}
            </>
          )}
        </span>
        {/* Display done icon if mode is currently active */}
        {pageConfiguration?.algorithmName === configData.algorithmName &&
          isModeActive && <DoneIcon />}
      </div>
    </Link>
  );
};

export default BottomButton;
