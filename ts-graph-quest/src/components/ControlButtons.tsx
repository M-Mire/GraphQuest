import React from "react";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { Node, ACTIONS_NODE, ActionNode } from "./NodeElement";

const iconSize = "small";
const paddingStyle = "p-0.5";
const buttonMargin = "m-1";

interface ControlButtonsProps {
  rootValue: number | null;
  setRootValue: React.Dispatch<React.SetStateAction<number | null>>;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  speed: number;
  dispatch: React.Dispatch<ActionNode>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  play: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  rootValue,
  setRootValue,
  setSpeed,
  speed,
  dispatch,
  setCurrentIndex,
  setPlay,
  play,
}) => {
  return (
    <div className="w-full h-12 flex justify-center items-end mt-2">
      <div className="bg-white rounded-t-lg shadow-md p-1 rounded-b-lg">
        <div className="flex justify-between">
          <div
            className={`control-button-bg bg-green-500 rounded-full ${paddingStyle} ${buttonMargin}`}>
            <IconButton
              color="primary"
              onClick={() => {
                console.log("clicked here");
                setRootValue(
                  rootValue !== null && !isNaN(rootValue) ? rootValue : 0
                );
                setPlay(true);
                console.log("value is now " + play);
              }}>
              <PlayArrowIcon fontSize={iconSize} style={{ fill: "#FFF" }} />
            </IconButton>
          </div>
          <div
            className={`control-button-bg bg-yellow-500 rounded-full ${paddingStyle} ${buttonMargin}`}>
            <IconButton
              color="primary"
              onClick={() => {
                setPlay(false);
              }}>
              <PauseIcon fontSize={iconSize} style={{ fill: "#FFF" }} />
            </IconButton>
          </div>
          <div
            className={`control-button-bg bg-red-500 rounded-full ${paddingStyle} ${buttonMargin}`}>
            <IconButton color="primary">
              <FastRewindIcon
                fontSize={iconSize}
                style={{ fill: "#FFF" }}
                onClick={() => {
                  if (speed < 3000) {
                    setSpeed(speed + 250);
                  }
                }}
              />
            </IconButton>
          </div>
          <div
            className={`control-button-bg bg-blue-500 rounded-full ${paddingStyle} ${buttonMargin}`}>
            <IconButton color="primary">
              <FastForwardIcon
                fontSize={iconSize}
                style={{ fill: "#FFF" }}
                onClick={() => {
                  if (speed > 250) {
                    setSpeed(speed - 250);
                  } else if (speed <= 250) {
                    setSpeed(speed - 50);
                  } else {
                    setSpeed(25);
                  }
                }}
              />
            </IconButton>
          </div>

          <div
            className={`control-button-bg bg-purple-500 rounded-full ${paddingStyle} ${buttonMargin}`}>
            <IconButton color="primary">
              <RotateLeftIcon
                fontSize={iconSize}
                style={{ fill: "#FFF" }}
                onClick={() => {
                  dispatch({
                    type: ACTIONS_NODE.NODE_RESET,
                    payload: NaN,
                  });
                  setCurrentIndex(0);
                }}
              />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlButtons;
