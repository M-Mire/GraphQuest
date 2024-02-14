import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { pageConfigurationMap } from "~/app/_pageConfigs/config";
import { useThemeContext } from "~/app/context/ThemeContext";
import useQueryString from "~/app/hooks/useQueryString";

const ToggleMode = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme } = useThemeContext();
  const { createQueryString, deleteQueryString } = useQueryString();

  const mapArray = Array.from(pageConfigurationMap);

  const isGraphPage = mapArray.some(
    ([_, config]) => pathname === config.urlName,
  );
  const isExplorersMode = pathname.includes("/explorersMode");
  const targetQueryName = isExplorersMode ? "compareMode" : "edit";

  let mode = "";
  if (isExplorersMode) {
    mode =
      searchParams?.get(targetQueryName) === "true" ? "Solo Mode" : "Dual Mode";
  } else {
    mode =
      searchParams?.get(targetQueryName) === "true" ? "Edit" : "View Graph";
  }

  const toggle = () => {
    if (targetQueryName) {
      return searchParams.get(targetQueryName)
        ? pathname + "?" + deleteQueryString(targetQueryName)
        : pathname + "?" + createQueryString(targetQueryName, "true");
    } else {
      return pathname;
    }
  };

  return (
    <Link href={toggle()}>
      <button
        name="changeView"
        className="rounded border-2 px-4 py-1  text-sm transition duration-300 ease-in-out hover:bg-gray-400"
        style={{
          background: theme.background.primary,
          color: theme.text.primary,
          borderColor: theme.background.quaternary,
        }}
      >
        {mode}
      </button>
    </Link>
  );
};

export default ToggleMode;
