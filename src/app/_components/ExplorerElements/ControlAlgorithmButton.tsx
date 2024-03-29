import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MazeIcon from "@mui/icons-material/BorderClear";

import { useThemeContext } from "~/app/context/ThemeContext";
import { AlgorithmEnum, algorithmMap } from "~/app/_pageConfigs/configExplorer";
import { Grid } from "~/app/types";

const style = { fontSize: "1rem" };

interface ControlButtonsProps {
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  isPlay: boolean;
  selectedAlgorithm: AlgorithmEnum | null;
  setSelectedAlgorithm: React.Dispatch<
    React.SetStateAction<AlgorithmEnum | null>
  >;
  isMaze: boolean;
  setMaze: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isEditMode: boolean;
}

const ControlAlgorithmButton: React.FC<ControlButtonsProps> = ({
  setPlay,
  isPlay,
  selectedAlgorithm,
  setSelectedAlgorithm,
  setMaze,
  setDeleteClicked,
  isEditMode,
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

  const handleMazeClick = () => {
    if (!isPlay) setMaze(true);
  };

  const handleDeleteClick = () => {
    setDeleteClicked(true);
  };

  useEffect(() => {
    if (isEditMode && isOpen) {
      setDropDown(false);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (isPlay) {
      setDropDown(false);
    }
  }, [isPlay]);
  return (
    <div className="relative ml-5 flex items-center text-sm font-bold">
      <div
        className="ml-3 flex
 h-8 items-center rounded-l-lg border-2"
        style={themeStyle}
      >
        <div className={`flex items-center rounded-full `}>
          <IconButton
            color="primary"
            size="small"
            onClick={handlePlayClick}
            style={{ color: colour }}
          >
            <PlayArrowIcon style={style} />
          </IconButton>
        </div>
      </div>
      {!isEditMode && (
        <button
          name="changeView"
          className="h-8 w-32 border-y-2 text-sm transition duration-300 ease-in-out hover:bg-gray-400 "
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
      )}

      <div
        className={`flex
 h-8 items-center border-y-2 ${!isEditMode && "border-l-2"}`}
        style={themeStyle}
      >
        <div className={`flex items-center rounded-full `}>
          <IconButton
            color="primary"
            size="small"
            onClick={handleMazeClick}
            style={{ color: colour }}
          >
            <MazeIcon style={style} />
            <p className="ml-2 mr-2 text-sm"> Maze</p>
          </IconButton>
        </div>
      </div>
      <div
        className="flex
 h-8 items-center rounded-r-lg border-2"
        style={themeStyle}
      >
        <div className={`flex items-center rounded-full `}>
          <IconButton
            color="primary"
            size="small"
            onClick={handleDeleteClick}
            style={{ color: colour }}
          >
            <DeleteForeverIcon style={style} />
            <p className="ml-2 mr-2 text-sm"> Clear </p>
          </IconButton>
        </div>
      </div>
      {isOpen && (
        <>
          <div
            className="absolute right-20 top-full z-10 mt-2 w-48 rounded-lg border-2 border-solid border-slate-700"
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
