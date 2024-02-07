import { ReactNode, useState } from "react";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useThemeContext } from "~/app/context/ThemeContext";
import { AlgorithmEnum, algorithmMap } from "~/app/_pageConfigs/configExplorer";

const style = { fontSize: "1rem" };

interface ControlButtonsProps {
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  isPlay: boolean;
  selectedAlgorithm: AlgorithmEnum | null;
  setSelectedAlgorithm: React.Dispatch<
    React.SetStateAction<AlgorithmEnum | null>
  >;
}

const ControlAlgorithmButton: React.FC<ControlButtonsProps> = ({
  setPlay,
  isPlay,
  selectedAlgorithm,
  setSelectedAlgorithm,
}) => {
  const { theme } = useThemeContext();
  const colour = theme.background.quaternary;

  const algorithmObjects = Object.entries(algorithmMap).map(
    ([name, algorithm]) => ({
      name,
      algorithm,
    }),
  );

  const [isOpen, setDropDown] = useState<boolean>(false);

  const themeStyle = {
    background: theme.background.primary,
    color: theme.text.primary,
    borderColor: theme.background.quaternary,
  };

  const handlePlayClick = () => {
    setPlay(true);
  };

  return (
    <div className="relative ml-5 flex items-center text-sm font-bold">
      <div
        className="ml-3 flex
 h-8 items-center rounded-l-lg border-2"
        style={themeStyle}
      >
        <CustomButton onClick={handlePlayClick} colour={colour}>
          <PlayArrowIcon style={style} />
        </CustomButton>
      </div>
      <button
        name="changeView"
        className="mr-2 h-8 w-28 rounded-r-lg border-y-2 border-r-2 text-sm transition duration-300 ease-in-out hover:bg-gray-400 "
        style={themeStyle}
        onClick={() => {
          if (!isPlay) {
            setDropDown(!isOpen);
          }
        }}
      >
        {selectedAlgorithm ? (
          ` ${selectedAlgorithm}`
        ) : (
          <p className="text-sm">Pick Algorithm</p>
        )}
      </button>
      {isOpen && (
        <>
          <div
            className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border-2 border-solid border-slate-700"
            style={themeStyle}
          >
            {algorithmObjects.map(({ name, algorithm: algorithm }, index) => (
              <ExplorerItems
                key={algorithm.name}
                themeStyle={themeStyle}
                name={algorithm.name}
                roundedB={index + 1 === algorithmObjects.length}
                onClick={() => {
                  setSelectedAlgorithm(algorithm.name as AlgorithmEnum);
                  setDropDown(!isOpen);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ControlAlgorithmButton;

interface CustomButtonProps {
  onClick: () => void;
  children: ReactNode;
  colour: string;
  mr?: boolean;
  ml?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  children,
  ml,
  mr,
  colour,
}) => {
  return (
    <div
      className={`flex items-center rounded-full  ${ml ? "ml-2" : ""} ${
        mr ? "mr-2" : ""
      }`}
    >
      <IconButton
        color="primary"
        size="small"
        onClick={onClick}
        style={{ color: colour }}
      >
        {children}
      </IconButton>
    </div>
  );
};

interface ExplorerItemsProps {
  themeStyle: {
    background: string;
    color: string;
    borderColor: string;
  };
  name: string;
  roundedB?: boolean;
  onClick?: () => void;
}

const ExplorerItems = ({
  themeStyle,
  name,
  roundedB,
  onClick,
}: ExplorerItemsProps) => {
  return (
    <button
      className={`flex h-12 w-full items-center justify-between rounded-t-lg border-solid ${
        roundedB ? "rounded-b-lg" : "border-b-2"
      }`}
      style={themeStyle}
      onClick={onClick}
    >
      <span className="p-2">{name}</span>
    </button>
  );
};
