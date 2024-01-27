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
import { useThemeContext } from "~/app/context/ThemeContext";

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
  const { theme } = useThemeContext();
  const colour = theme.background.quaternary;

  return (
    <div className="relative ml-5 flex items-center text-sm font-bold">
      <div
        className="ml-3 mr-2 flex items-center rounded-full
 border-2  p-[0.2rem]"
        style={{ background: theme.background.primary, borderColor: colour }}
      >
        <CustomButton onClick={handleRewindClick} colour={colour} ml={true}>
          <FastRewindIcon style={style} />
        </CustomButton>
        {!isPlay ? (
          <CustomButton onClick={handlePlayClick} colour={colour} ml={true}>
            <PlayArrowIcon style={style} />
          </CustomButton>
        ) : (
          <CustomButton onClick={handlePauseClick} colour={colour} ml={true}>
            <PauseIcon style={style} />
          </CustomButton>
        )}

        <CustomButton
          onClick={handleFastForwardClick}
          colour={colour}
          ml={true}
        >
          <FastForwardIcon style={style} />
        </CustomButton>

        <CustomButton
          onClick={handleResetClick}
          colour={colour}
          ml={true}
          mr={true}
        >
          <ReplayIcon style={style} />
        </CustomButton>
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
