import React from "react";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { Node, ACTIONS_NODE, ActionNode } from "~/app/_components/NodeElement";

import { ActionLine } from "./Animation";
import { Line } from "~/app/_GraphAlgorithm/Graph";

export interface ControlButtonsProps {
  rootValue: number | null;
  setRootValue: React.Dispatch<React.SetStateAction<number | null>>;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  speed: number;
  dispatch: React.Dispatch<ActionNode>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  isPlay: boolean;
  dispatchLineNumbers: React.Dispatch<ActionLine>;
}

const iconSize = "small";
const paddingStyle = "p-1";
const buttonMargin = "m-1";

const ControlButtons: React.FC<ControlButtonsProps> = ({
  rootValue,
  setRootValue,
  setSpeed,
  speed,
  dispatch,
  setCurrentIndex,
  setPlay,
  isPlay,
  dispatchLineNumbers,
}) => {
  const handlePlayClick = () => {
    setRootValue(rootValue !== null && !isNaN(rootValue) ? rootValue : 0);
    setPlay(true);
  };

  const handlePauseClick = () => {
    setPlay(false);
  };
  const handleResetClick = () => {
    dispatch({
      type: ACTIONS_NODE.NODE_RESET,
      payload: NaN,
    });
    setCurrentIndex(0);
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
    <div className="mt-2 flex h-12 w-full items-end justify-center">
      <div className="rounded-b-lg rounded-t-lg bg-white p-1 shadow-md">
        <div className="flex justify-between">
          <div
            className={`control-button-bg rounded-full bg-green-500 ${paddingStyle} ${buttonMargin}`}
          >
            <IconButton color="primary" onClick={handlePlayClick}>
              <PlayArrowIcon fontSize={iconSize} style={{ fill: "#FFF" }} />
            </IconButton>
          </div>
          <div
            className={`control-button-bg rounded-full bg-yellow-500 ${paddingStyle} ${buttonMargin}`}
          >
            <IconButton color="primary" onClick={handlePauseClick}>
              <PauseIcon fontSize={iconSize} style={{ fill: "#FFF" }} />
            </IconButton>
          </div>
          <div
            className={`control-button-bg rounded-full bg-red-500 ${paddingStyle} ${buttonMargin}`}
          >
            <IconButton color="primary" onClick={handleRewindClick}>
              <FastRewindIcon fontSize={iconSize} style={{ fill: "#FFF" }} />
            </IconButton>
          </div>
          <div
            className={`control-button-bg rounded-full bg-blue-500 ${paddingStyle} ${buttonMargin}`}
          >
            <IconButton color="primary" onClick={handleFastForwardClick}>
              <FastForwardIcon fontSize={iconSize} style={{ fill: "#FFF" }} />
            </IconButton>
          </div>

          <div
            className={`control-button-bg rounded-full bg-purple-500 ${paddingStyle} ${buttonMargin}`}
          >
            <IconButton color="primary" onClick={handleResetClick}>
              <RotateLeftIcon fontSize={iconSize} style={{ fill: "#FFF" }} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlButtons;
