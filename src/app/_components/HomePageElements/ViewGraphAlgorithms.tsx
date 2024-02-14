import { pageConfigurationMap, pageEnum } from "~/app/_pageConfigs/config";
import { useThemeContext } from "~/app/context/ThemeContext";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";

interface ViewGraphAlgorithmsProps {
  setGraphList: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewGraphAlgorithms = ({ setGraphList }: ViewGraphAlgorithmsProps) => {
  const { theme } = useThemeContext();
  const pageObjects = Array.from(pageConfigurationMap).filter(
    ([name, _]) => name !== pageEnum.EXPLORERS,
  );

  return (
    <div className="z-5 absolute inset-0 flex items-center justify-center bg-black opacity-90">
      <div className="relative flex h-3/5 w-3/5 flex-col items-center justify-start">
        <IconButton
          onClick={() => setGraphList(false)}
          style={{ position: "absolute", top: 10, right: 10, color: "red" }}
        >
          <CloseIcon />
        </IconButton>
        <h1 className="mb-4 mt-4 " style={{ color: theme.text.title }}>
          Select Graph Algorithm
        </h1>
        <div className="flex w-full flex-wrap justify-center overflow-auto">
          {pageObjects.map(([_, config]) => (
            <Link
              key={config.id}
              className="m-2 flex h-32 w-full rounded-2xl border-2 hover:bg-white hover:bg-opacity-100 sm:w-1/4"
              style={{ borderColor: theme.background.quaternary }}
              href={config.urlName}
            >
              <p
                className="m-auto"
                style={{ color: theme.background.quaternary }}
              >
                {config.algorithmName}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewGraphAlgorithms;
