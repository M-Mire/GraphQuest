import { useState, useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import ReplayIcon from "@mui/icons-material/Replay";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import TextField from "@mui/material/TextField";
import FastForwardIcon from "@mui/icons-material/FastForward";

import {
  ACTIONS_NODE,
  ActionNode,
} from "~/app/_components/GraphUI/NodeElement";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ActionLine } from "../CanvasElements/Animation";
import { Line } from "~/app/_GraphAlgorithm/Graph";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import isStringNumber from "~/app/utils/isStringNumber";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e3f2fd",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#fff",
    },
  },
});

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

const ControlButtons: React.FC<ControlButtonsProps> = ({
  setRootValue,
  setSpeed,
  speed,
  dispatch,
  setCurrentIndex,
  setPlay,
  isPlay,
  dispatchLineNumbers,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isEditMode = searchParams.get("edit") === "true";

  const handlePlayClick = () => {
    if (!isEditMode) {
      setRootValue(inputValue === "" ? 0 : parseInt(inputValue));
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

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") return;
    if (event.key === "Enter" && inputValue !== "") {
      event.currentTarget.blur();
    } else if (!isStringNumber(event.key)) {
      event.preventDefault();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="relative ml-5 flex items-center text-sm font-bold text-gray-200">
      <TextField
        placeholder="Enter root number "
        variant="outlined"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <>
              {!isPlay ? (
                <IconButton
                  color="primary"
                  size="small"
                  onClick={handlePlayClick}
                >
                  <PlayCircleIcon
                    fontSize="medium"
                    style={{
                      fill: "#306844",
                      position: "absolute",
                      fontSize: "1.7rem",
                    }}
                  />
                </IconButton>
              ) : (
                <IconButton
                  color="primary"
                  size="small"
                  onClick={handlePauseClick}
                >
                  <PauseCircleIcon
                    fontSize="medium"
                    style={{
                      fill: "red",
                      position: "absolute",
                      fontSize: "1.7rem",
                    }}
                  />
                </IconButton>
              )}
            </>
          ),
          style: {
            background: "black",
            outlineStyle: "solid",
            outlineWidth: "2px",
            outlineColor: "white",
            borderRadius: "20px 20px 20px 20px",
            width: "12rem",
            height: "30px",
          },
          inputProps: { min: 0, style: { color: "white", padding: "10px" } },
        }}
        InputLabelProps={{ style: { color: "white" }, shrink: true }}
        onKeyDown={handleInputKeyDown}
        onChange={handleInputChange}
        value={inputValue}
      />
      <div
        className="ml-3 mr-2 flex items-center rounded-full
 border-2 border-white p-[0.2rem]"
      >
        <div
          className="ml-2 flex items-center rounded-full
 border-2 border-white"
        >
          <ThemeProvider theme={theme}>
            <IconButton
              color="primary"
              size="small"
              onClick={handleRewindClick}
            >
              <FastRewindIcon style={{ fontSize: "1rem" }} />
            </IconButton>
          </ThemeProvider>
        </div>
        <div
          className="ml-2 flex items-center rounded-full
 border-2 border-white"
        >
          <ThemeProvider theme={theme}>
            <IconButton
              color="primary"
              size="small"
              onClick={handleFastForwardClick}
            >
              <FastForwardIcon style={{ fontSize: "1rem" }} />
            </IconButton>
          </ThemeProvider>
        </div>
        <div
          className="ml-2 mr-2 flex items-center rounded-full
 border-2 border-white"
        >
          <ThemeProvider theme={theme}>
            <IconButton color="primary" size="small" onClick={handleResetClick}>
              <ReplayIcon style={{ fontSize: "1rem" }} />
            </IconButton>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};

export default ControlButtons;
