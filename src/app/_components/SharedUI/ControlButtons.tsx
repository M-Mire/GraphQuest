import { ReactNode } from "react";
import IconButton from "@mui/material/IconButton";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import FastForwardIcon from "@mui/icons-material/FastForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  ACTIONS_NODE,
  ActionNode,
} from "~/app/_components/GraphUI/NodeElement";
import { useSearchParams } from "next/navigation";
import { ActionLine } from "../CanvasElements/Animation";
import { Line } from "~/app/_GraphAlgorithm/Graph";

const style = { fontSize: "1rem" };

export interface ControlButtonsProps {
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  speed: number;
  dispatch: React.Dispatch<ActionNode>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  isPlay: boolean;
  dispatchLineNumbers: React.Dispatch<ActionLine>;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  setSpeed,
  speed,
  dispatch,
  setCurrentIndex,
  setPlay,
  isPlay,
  dispatchLineNumbers,
}) => {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";

  const handlePlayClick = () => {
    if (!isEditMode) {
      setPlay(true);
    }
  };

  const handlePauseClick = () => {
    setPlay(false);
  };
  const handleResetClick = () => {
    dispatch({
      type: ACTIONS_NODE.NODE_RESET,
      payload: NaN,
    });
    setCurrentIndex(-1);
    setPlay(false);
    dispatchLineNumbers({
      type: Line.LineReset,
      payload: 0,
    });
  };

  const handleFastForwardClick = () => {
    if (speed > 250) {
      setSpeed(speed - 250);
    } else if (speed <= 250) {
      setSpeed(speed - 50);
    } else {
      setSpeed(25);
    }
  };

  const handleRewindClick = () => {
    if (speed < 3000) {
      setSpeed(speed + 250);
    }
  };

  return (
    <div className="relative flex items-center text-sm font-bold md:ml-5">
      <div
        className="ml-3 mr-2 flex items-center rounded-full
border-2  p-[0.2rem]"
      >
        <div className={`flex items-center rounded-full`}>
          <IconButton size="small" color="primary" onClick={handleRewindClick}>
            <FastRewindIcon style={style} />
          </IconButton>
        </div>

        <div className={`flex items-center rounded-full`}>
          {!isPlay ? (
            <IconButton size="small" color="primary" onClick={handlePlayClick}>
              <PlayArrowIcon style={style} />
            </IconButton>
          ) : (
            <IconButton size="small" color="primary" onClick={handlePauseClick}>
              <PauseIcon style={style} />
            </IconButton>
          )}
        </div>

        <div className={`flex items-center rounded-full`}>
          <IconButton
            size="small"
            color="primary"
            onClick={handleFastForwardClick}
          >
            <FastForwardIcon style={style} />
          </IconButton>
        </div>
        <div className={`flex items-center rounded-full`}>
          <IconButton size="small" color="primary" onClick={handleResetClick}>
            <ReplayIcon style={style} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ControlButtons;

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
