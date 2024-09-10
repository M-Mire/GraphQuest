import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import useQueryString from "~/app/hooks/useQueryString";
import { pageConfigurationType, pageEnum } from "~/app/_pageConfigs/config";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";

interface ActionButtonProps {
  pageConfiguration?: pageConfigurationType;
  config: [pageEnum, pageConfigurationType];
  type: "top" | "bottom";
}

const IconClassStyle = "mr-[0.5rem]";

const ActionButton = ({
  pageConfiguration,
  config,
  type,
}: ActionButtonProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createQueryString, deleteQueryString } = useQueryString();

  const [id, configData] = config;
  const isExplorersMode = id === pageEnum.EXPLORERS;
  const targetQueryName = isExplorersMode ? "compareMode" : "edit";
  const isModeActive = searchParams?.get(targetQueryName) === "true";
  const isViewCurrentOptions =
    pageConfiguration?.algorithmName === configData.algorithmName;

  let href = configData.urlName + `?${targetQueryName}=true`;

  if (type === "top") {
    href = isViewCurrentOptions
      ? `${pathname}?${deleteQueryString(targetQueryName)}`
      : configData.urlName;
  } else if (
    configData.algorithmName === pageConfiguration?.algorithmName &&
    !isModeActive
  ) {
    href = pathname + "?" + createQueryString(targetQueryName, "true");
  }

  const renderIcon = () => {
    if (isExplorersMode) {
      return type === "top" ? (
        <Filter1Icon className={IconClassStyle} />
      ) : (
        <Filter2Icon className={IconClassStyle} />
      );
    }
    return type === "top" ? (
      <RemoveRedEyeIcon className={IconClassStyle} />
    ) : (
      <EditIcon className={IconClassStyle} />
    );
  };

  return (
    <Link href={href}>
      <div className="mt-2 flex w-full items-center justify-between rounded p-1 hover:bg-primary">
        <span>
          {renderIcon()}
          {type === "top"
            ? isExplorersMode
              ? "Solo Mode"
              : `View ${configData.algorithmName}`
            : isExplorersMode
            ? "Dual Mode"
            : `Edit ${configData.algorithmName}`}
        </span>
      </div>
    </Link>
  );
};

export default ActionButton;
