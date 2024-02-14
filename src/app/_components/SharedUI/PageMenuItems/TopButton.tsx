import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Filter1Icon from "@mui/icons-material/Filter1";
import DoneIcon from "@mui/icons-material/Done";
import Link from "next/link";
import { useThemeContext } from "~/app/context/ThemeContext";
import useQueryString from "~/app/hooks/useQueryString";
import { usePathname, useSearchParams } from "next/navigation";
import { pageConfigurationType, pageEnum } from "~/app/_pageConfigs/config";

interface ButtonProps {
  pageConfiguration?: pageConfigurationType;
  config: [pageEnum, pageConfigurationType];
}

const TopButton = ({ pageConfiguration, config }: ButtonProps) => {
  // Extract necessary variables and hooks
  const { theme } = useThemeContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hooks
  const { deleteQueryString } = useQueryString();

  // Extract configuration data and determine mode
  const [id, configData] = config;
  const isExplorersMode = id === pageEnum.EXPLORERS;
  const targetQueryName = isExplorersMode ? "compareMode" : "edit";
  const isModeActive = searchParams?.get(targetQueryName) === "true";
  const isViewCurrentOptions =
    pageConfiguration?.algorithmName === configData.algorithmName;

  // Define href based on current options and mode
  const href = isViewCurrentOptions
    ? `${pathname}?${deleteQueryString(targetQueryName)}`
    : configData.urlName;

  // Define container classes for styling
  const containerClasses = `mt-2 flex w-full items-center justify-between rounded p-1 hover:bg-slate-500 ${
    pageConfiguration?.algorithmName === configData.algorithmName &&
    !isModeActive
      ? "bg-gray-700"
      : ""
  }`;

  return (
    // Href Link to toggle active mode
    <Link href={href}>
      <div className={containerClasses}>
        <p>
          {/* Display Numbered icon for Explorers Mode and EditIcon */}
          {isExplorersMode ? (
            <>
              <Filter1Icon
                style={{
                  fill: theme.background.quaternary,
                  marginRight: "0.5rem",
                }}
              />
              Solo Mode
            </>
          ) : (
            <>
              <RemoveRedEyeIcon
                style={{
                  fill: theme.background.quaternary,
                  marginRight: "0.5rem",
                }}
              />
              View {configData.algorithmName}
            </>
          )}
        </p>
        {/* Display done icon if mode is currently active */}
        {pageConfiguration?.algorithmName === configData.algorithmName &&
          !isModeActive && <DoneIcon />}
      </div>
    </Link>
  );
};

export default TopButton;
